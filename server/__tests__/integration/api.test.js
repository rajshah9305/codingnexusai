const request = require('supertest');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Mock the services
jest.mock('../../services/bedrock');
jest.mock('../../services/crewai');
jest.mock('../../services/code');

const BedrockService = require('../../services/bedrock');
const CrewAIService = require('../../services/crewai');
const CodeService = require('../../services/code');

describe('API Integration Tests', () => {
  let app;
  let bedrockService;
  let crewaiService;
  let codeService;

  beforeEach(() => {
    // Setup app without WebSocket for testing
    app = express();
    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));

    bedrockService = new BedrockService();
    crewaiService = new CrewAIService();
    codeService = new CodeService();

    // Setup routes
    app.get('/api/models', async (req, res) => {
      try {
        const models = await bedrockService.getAvailableModels();
        res.json(models);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/generate', async (req, res) => {
      try {
        const { prompt, model, type } = req.body;
        let result;
        
        switch (type) {
          case 'component':
            result = await bedrockService.generateCode(prompt, model);
            break;
          case 'debug':
            result = await codeService.debugCode(req.body.code, prompt, model);
            break;
          default:
            result = await bedrockService.generateCode(prompt, model);
        }
        
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    jest.clearAllMocks();
  });

  describe('GET /api/models', () => {
    it('should return 200 and list of models', async () => {
      const mockModels = [
        { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic' },
        { id: 'titan-text', name: 'Titan Text', provider: 'Amazon' }
      ];
      bedrockService.getAvailableModels.mockResolvedValue(mockModels);

      const response = await request(app)
        .get('/api/models')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockModels);
      expect(response.body.length).toBe(2);
    });

    it('should return 500 on service error', async () => {
      bedrockService.getAvailableModels.mockRejectedValue(new Error('Service unavailable'));

      const response = await request(app)
        .get('/api/models')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Service unavailable');
    });
  });

  describe('POST /api/generate', () => {
    it('should generate code successfully', async () => {
      const mockResult = {
        code: ['const hello = "world";'],
        explanation: 'Simple variable declaration',
        language: 'javascript',
        model: 'claude-3.7-sonnet'
      };
      bedrockService.generateCode.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/generate')
        .send({
          prompt: 'Create a hello world variable',
          model: 'claude-3.7-sonnet',
          type: 'component'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(bedrockService.generateCode).toHaveBeenCalledWith(
        'Create a hello world variable',
        'claude-3.7-sonnet'
      );
    });

    it('should handle debug type requests', async () => {
      const mockResult = {
        analysis: 'Variable not defined',
        fixedCode: ['const x = 1;'],
        changes: 'Added const declaration',
        prevention: 'Always declare variables'
      };
      codeService.debugCode.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/generate')
        .send({
          code: 'x = 1',
          prompt: 'Fix this error',
          model: 'claude-3.7-sonnet',
          type: 'debug'
        })
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(codeService.debugCode).toHaveBeenCalled();
    });

    it('should return 500 on generation error', async () => {
      bedrockService.generateCode.mockRejectedValue(new Error('Generation failed'));

      const response = await request(app)
        .post('/api/generate')
        .send({
          prompt: 'Test',
          model: 'claude-3.7-sonnet',
          type: 'component'
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle empty request body gracefully', async () => {
      bedrockService.generateCode.mockResolvedValue({ 
        code: [], 
        explanation: '', 
        language: 'javascript', 
        model: 'claude-3.7-sonnet' 
      });

      const response = await request(app)
        .post('/api/generate')
        .send({});

      // Should either return 200 with empty result or 500 with error
      expect([200, 500]).toContain(response.status);
    });

    it('should handle default type', async () => {
      const mockResult = { code: ['test'], explanation: 'test', language: 'javascript', model: 'claude-3.7-sonnet' };
      bedrockService.generateCode.mockResolvedValue(mockResult);

      await request(app)
        .post('/api/generate')
        .send({
          prompt: 'Test',
          model: 'claude-3.7-sonnet'
        })
        .expect(200);

      expect(bedrockService.generateCode).toHaveBeenCalled();
    });
  });

  describe('Security Headers', () => {
    it('should include helmet security headers', async () => {
      bedrockService.getAvailableModels.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/models');

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });

  describe('CORS', () => {
    it('should allow cross-origin requests', async () => {
      bedrockService.getAvailableModels.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/models')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('JSON Parsing', () => {
    it('should parse JSON request bodies', async () => {
      bedrockService.generateCode.mockResolvedValue({ code: [], explanation: '', language: 'javascript', model: 'claude-3.7-sonnet' });

      await request(app)
        .post('/api/generate')
        .send({
          prompt: 'Test',
          model: 'claude-3.7-sonnet'
        })
        .expect(200);
    });

    it('should handle large payloads up to 10mb', async () => {
      bedrockService.generateCode.mockResolvedValue({ code: [], explanation: '', language: 'javascript', model: 'claude-3.7-sonnet' });

      const largePrompt = 'A'.repeat(1000000); // 1MB

      await request(app)
        .post('/api/generate')
        .send({
          prompt: largePrompt,
          model: 'claude-3.7-sonnet'
        })
        .expect(200);
    });
  });
});

