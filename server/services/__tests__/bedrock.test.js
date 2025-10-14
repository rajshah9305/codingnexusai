const BedrockService = require('../bedrock');

// Mock AWS SDK
jest.mock('@aws-sdk/client-bedrock-runtime', () => ({
  BedrockRuntimeClient: jest.fn().mockImplementation(() => ({
    send: jest.fn()
  })),
  InvokeModelCommand: jest.fn()
}));

describe('BedrockService', () => {
  let service;
  let mockSend;

  beforeEach(() => {
    service = new BedrockService();
    mockSend = service.client.send;
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct default region', () => {
      expect(service.client).toBeDefined();
    });

    it('should have correct model mappings', () => {
      expect(service.models['claude-3.7-sonnet']).toBeDefined();
      expect(service.models['titan-text']).toBeDefined();
      expect(Object.keys(service.models).length).toBeGreaterThan(0);
    });
  });

  describe('getAvailableModels', () => {
    it('should return list of available models', async () => {
      const models = await service.getAvailableModels();
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      expect(models[0]).toHaveProperty('id');
      expect(models[0]).toHaveProperty('name');
      expect(models[0]).toHaveProperty('provider');
    });

    it('should correctly identify model providers', async () => {
      const models = await service.getAvailableModels();
      const claudeModel = models.find(m => m.id.includes('claude'));
      const titanModel = models.find(m => m.id.includes('titan'));
      
      expect(claudeModel.provider).toBe('Anthropic');
      expect(titanModel.provider).toBe('Amazon');
    });
  });

  describe('generateCode', () => {
    it('should generate code using Claude model', async () => {
      const mockResponse = {
        body: new TextEncoder().encode(JSON.stringify({
          content: [{ text: '```javascript\nconst hello = "world";\n```\n\nThis is a simple example.' }]
        }))
      };
      mockSend.mockResolvedValue(mockResponse);

      const result = await service.generateCode('Create a hello world variable', 'claude-3.7-sonnet');
      
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('explanation');
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('model');
      expect(result.model).toBe('claude-3.7-sonnet');
    });

    it('should handle errors gracefully', async () => {
      mockSend.mockRejectedValue(new Error('API Error'));

      await expect(
        service.generateCode('Test prompt', 'claude-3.7-sonnet')
      ).rejects.toThrow('Bedrock API error');
    });

    it('should use default model when none specified', async () => {
      const mockResponse = {
        body: new TextEncoder().encode(JSON.stringify({
          content: [{ text: 'test code' }]
        }))
      };
      mockSend.mockResolvedValue(mockResponse);

      await service.generateCode('Test prompt');
      
      expect(mockSend).toHaveBeenCalled();
    });
  });

  describe('extractCode', () => {
    it('should extract code from markdown code blocks', () => {
      const text = '```javascript\nconst x = 1;\n```\nSome text\n```python\nprint("hello")\n```';
      const result = service.extractCode(text);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toContain('const x = 1');
      expect(result[1]).toContain('print("hello")');
    });

    it('should return original text if no code blocks found', () => {
      const text = 'No code blocks here';
      const result = service.extractCode(text);
      
      expect(result).toEqual([text]);
    });
  });

  describe('extractExplanation', () => {
    it('should remove code blocks from text', () => {
      const text = 'Here is some code:\n```js\ncode\n```\nAnd explanation.';
      const result = service.extractExplanation(text);
      
      expect(result).not.toContain('```');
      expect(result).toContain('Here is some code:');
      expect(result).toContain('And explanation');
    });
  });

  describe('detectLanguage', () => {
    it('should detect JavaScript from React imports', () => {
      expect(service.detectLanguage('import React from "react"')).toBe('javascript');
    });

    it('should detect JavaScript from const/function', () => {
      expect(service.detectLanguage('const x = 1;')).toBe('javascript');
      expect(service.detectLanguage('function test() {}')).toBe('javascript');
    });

    it('should detect Python', () => {
      expect(service.detectLanguage('def hello():')).toBe('python');
    });

    it('should detect Java', () => {
      expect(service.detectLanguage('public class Test {}')).toBe('java');
    });

    it('should default to text for unknown languages', () => {
      expect(service.detectLanguage('random text')).toBe('text');
    });
  });

  describe('getProvider', () => {
    it('should return correct provider for each model type', () => {
      expect(service.getProvider('claude-3.7-sonnet')).toBe('Anthropic');
      expect(service.getProvider('titan-text')).toBe('Amazon');
    });

    it('should return Unknown for unrecognized models', () => {
      expect(service.getProvider('unknown-model')).toBe('Unknown');
    });
  });
});

