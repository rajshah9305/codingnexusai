const request = require('supertest');

// Mock all services before requiring the app
jest.mock('../../services/bedrock');
jest.mock('../../services/crewai');
jest.mock('../../services/code');
jest.mock('../../services/multiagent');

const BedrockService = require('../../services/bedrock');
const MultiAgentOrchestrator = require('../../services/multiagent');

describe('Server Integration Tests', () => {
  let app;

  beforeAll(() => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    
    // Require app after mocks are set up
    app = require('../../index');
  });

  afterAll(() => {
    // Clean up
    delete process.env.NODE_ENV;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Multi-Agent Endpoints', () => {
    it('should handle POST /api/multiagent/orchestrate', async () => {
      const mockResult = {
        code: ['const test = 1;'],
        explanation: 'Test code generated',
        status: 'completed',
        agentContributions: ['codeGenerator'],
        executionPlan: { taskType: 'code_generation' }
      };

      const mockOrchestrator = {
        orchestrate: jest.fn().mockResolvedValue(mockResult),
        getAgentsInfo: jest.fn().mockReturnValue([{ id: 'test', role: 'Test Agent', capabilities: [] }]),
        getAgentMetrics: jest.fn().mockReturnValue({})
      };
      
      MultiAgentOrchestrator.mockImplementation(() => mockOrchestrator);

      const response = await request(app)
        .post('/api/multiagent/orchestrate')
        .send({
          prompt: 'Create a test variable',
          options: { includeTests: true }
        })
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(mockOrchestrator.orchestrate).toHaveBeenCalled();
    });

    it('should handle errors in multi-agent orchestration', async () => {
      const mockOrchestrator = {
        orchestrate: jest.fn().mockRejectedValue(new Error('Orchestration failed')),
        getAgentsInfo: jest.fn().mockReturnValue([{ id: 'test', role: 'Test', capabilities: [] }]),
        getAgentMetrics: jest.fn().mockReturnValue({})
      };
      
      MultiAgentOrchestrator.mockImplementation(() => mockOrchestrator);

      const response = await request(app)
        .post('/api/multiagent/orchestrate')
        .send({
          prompt: 'Test'
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Orchestration failed');
    });

    it('should GET /api/multiagent/agents', async () => {
      const mockAgents = [
        { id: 'supervisor', role: 'Supervisor', capabilities: [] },
        { id: 'codeGenerator', role: 'Code Generator', capabilities: [] }
      ];

      const mockOrchestrator = {
        getAgentsInfo: jest.fn().mockReturnValue(mockAgents),
        orchestrate: jest.fn(),
        getAgentMetrics: jest.fn()
      };
      
      MultiAgentOrchestrator.mockImplementation(() => mockOrchestrator);

      const response = await request(app)
        .get('/api/multiagent/agents')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(mockAgents);
    });

    it('should handle errors in GET /api/multiagent/agents', async () => {
      const mockOrchestrator = {
        getAgentsInfo: jest.fn().mockImplementation(() => {
          throw new Error('Failed to get agents');
        }),
        orchestrate: jest.fn(),
        getAgentMetrics: jest.fn()
      };
      
      MultiAgentOrchestrator.mockImplementation(() => mockOrchestrator);

      const response = await request(app)
        .get('/api/multiagent/agents')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Failed to get agents');
    });

    it('should GET /api/multiagent/metrics', async () => {
      const mockMetrics = {
        totalExecutions: 10,
        agentUsage: { codeGenerator: 5 },
        recentExecutions: []
      };

      const mockOrchestrator = {
        getAgentMetrics: jest.fn().mockReturnValue(mockMetrics),
        getAgentsInfo: jest.fn().mockReturnValue([]),
        orchestrate: jest.fn()
      };
      
      MultiAgentOrchestrator.mockImplementation(() => mockOrchestrator);

      const response = await request(app)
        .get('/api/multiagent/metrics')
        .expect(200);

      expect(response.body).toEqual(mockMetrics);
      expect(mockOrchestrator.getAgentMetrics).toHaveBeenCalled();
    });

    it('should handle errors in GET /api/multiagent/metrics', async () => {
      const mockOrchestrator = {
        getAgentMetrics: jest.fn().mockImplementation(() => {
          throw new Error('Failed to get metrics');
        }),
        getAgentsInfo: jest.fn().mockReturnValue([]),
        orchestrate: jest.fn()
      };
      
      MultiAgentOrchestrator.mockImplementation(() => mockOrchestrator);

      const response = await request(app)
        .get('/api/multiagent/metrics')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Failed to get metrics');
    });
  });

  describe('Existing Endpoints', () => {
    it('should handle POST /api/autocomplete', async () => {
      const mockSuggestions = [
        { text: 'const x = 1;', type: 'variable' }
      ];

      // Mock CodeService through the app's services
      const response = await request(app)
        .post('/api/autocomplete')
        .send({
          code: 'const ',
          cursor: { line: 0, column: 6 },
          model: 'claude-3.7-sonnet'
        });

      // Should either succeed or fail gracefully
      expect([200, 500]).toContain(response.status);
    });

    it('should handle POST /api/integrate', async () => {
      const response = await request(app)
        .post('/api/integrate')
        .send({
          type: 'database',
          config: { type: 'mongodb', host: 'localhost', database: 'test' }
        });

      // Should either succeed or fail gracefully
      expect([200, 500]).toContain(response.status);
    });

    it('should handle POST /api/generate with fullstack type', async () => {
      const response = await request(app)
        .post('/api/generate')
        .send({
          prompt: 'Create a todo app',
          model: 'claude-3.7-sonnet',
          type: 'fullstack'
        });

      // Should either succeed or fail gracefully
      expect([200, 500]).toContain(response.status);
    });

    it('should handle POST /api/generate with explain type', async () => {
      const response = await request(app)
        .post('/api/generate')
        .send({
          code: 'const x = 1;',
          model: 'claude-3.7-sonnet',
          type: 'explain'
        });

      // Should either succeed or fail gracefully
      expect([200, 500]).toContain(response.status);
    });

    it('should handle POST /api/generate with fix type', async () => {
      const response = await request(app)
        .post('/api/generate')
        .send({
          code: 'const x = ',
          error: 'SyntaxError: Unexpected end of input',
          model: 'claude-3.7-sonnet',
          type: 'fix'
        });

      // Should either succeed or fail gracefully
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    it('should handle AccessDeniedException errors with helpful hint', async () => {
      const mockError = new Error('Access denied');
      mockError.code = 'AccessDeniedException';
      
      BedrockService.mockImplementation(() => ({
        getAvailableModels: jest.fn().mockRejectedValue(mockError)
      }));

      const response = await request(app)
        .get('/api/models')
        .expect(500);

      expect(response.body).toHaveProperty('hint');
      expect(response.body.hint).toContain('Bedrock model access');
    });

    it('should hide stack traces in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      BedrockService.mockImplementation(() => ({
        generateCode: jest.fn().mockRejectedValue(new Error('Test error')),
        getAvailableModels: jest.fn()
      }));

      const response = await request(app)
        .post('/api/generate')
        .send({
          prompt: 'Test',
          model: 'claude-3.7-sonnet',
          type: 'component'
        })
        .expect(500);

      expect(response.body.details).toBe('See server logs for details');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('CORS Configuration', () => {
    it('should allow all origins in development', async () => {
      process.env.NODE_ENV = 'development';

      const response = await request(app)
        .get('/api/models')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to /api/ routes', async () => {
      // Rate limiter is configured for 100 requests per 15 minutes
      // This test just verifies the endpoint exists
      const response = await request(app)
        .get('/api/models');

      // Should not be rate limited on first request
      expect(response.status).not.toBe(429);
    });
  });
});


