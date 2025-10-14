const CrewAIService = require('../crewai');

// Mock the BedrockService
jest.mock('../bedrock');

describe('CrewAIService', () => {
  let service;

  beforeEach(() => {
    service = new CrewAIService();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct agents', () => {
      expect(service.agents).toHaveProperty('architect');
      expect(service.agents).toHaveProperty('frontend');
      expect(service.agents).toHaveProperty('backend');
      expect(service.agents).toHaveProperty('devops');
    });

    it('should have correct agent roles', () => {
      expect(service.agents.architect.role).toBe('Solution Architect');
      expect(service.agents.frontend.role).toBe('Frontend Developer');
      expect(service.agents.backend.role).toBe('Backend Developer');
      expect(service.agents.devops.role).toBe('DevOps Engineer');
    });
  });

  describe('generateProjectName', () => {
    it('should convert prompt to valid project name', () => {
      const result = service.generateProjectName('Create a Todo App with React');
      expect(result).toBe('create-a-todo-app-with-react');
    });

    it('should remove special characters', () => {
      const result = service.generateProjectName('My App! @#$ Test');
      expect(result).not.toContain('!');
      expect(result).not.toContain('@');
      expect(result).not.toContain('#');
    });

    it('should limit length to 30 characters', () => {
      const longPrompt = 'a'.repeat(50);
      const result = service.generateProjectName(longPrompt);
      expect(result.length).toBeLessThanOrEqual(30);
    });

    it('should convert spaces to hyphens', () => {
      const result = service.generateProjectName('Multi Word Project');
      expect(result).toBe('multi-word-project');
    });
  });

  describe('extractFeatures', () => {
    it('should extract bullet points', () => {
      const explanation = '✓ Feature 1\n• Feature 2\n- Feature 3\nRegular text';
      const result = service.extractFeatures(explanation);
      
      expect(result.length).toBe(3);
      expect(result).toContain('Feature 1');
      expect(result).toContain('Feature 2');
      expect(result).toContain('Feature 3');
    });

    it('should filter empty features', () => {
      const explanation = '✓ Valid\n•\n- \nAnother valid feature - here';
      const result = service.extractFeatures(explanation);
      
      expect(result.every(f => f.length > 0)).toBe(true);
    });
  });

  describe('generateFileStructure', () => {
    it('should return standard project structure', () => {
      const structure = service.generateFileStructure();
      
      expect(structure['package.json']).toBeDefined();
      expect(structure['src/']).toBeDefined();
      expect(structure['server/']).toBeDefined();
      expect(structure['public/']).toBeDefined();
      expect(structure['.env']).toBeDefined();
      expect(structure['README.md']).toBeDefined();
    });

    it('should include necessary directories', () => {
      const structure = service.generateFileStructure();
      
      expect(structure['src/']).toHaveProperty('components/');
      expect(structure['src/']).toHaveProperty('pages/');
      expect(structure['server/']).toHaveProperty('routes/');
      expect(structure['server/']).toHaveProperty('models/');
    });
  });

  describe('generateSetupInstructions', () => {
    it('should return array of setup steps', () => {
      const instructions = service.generateSetupInstructions();
      
      expect(Array.isArray(instructions)).toBe(true);
      expect(instructions.length).toBeGreaterThan(0);
    });

    it('should include npm install step', () => {
      const instructions = service.generateSetupInstructions();
      
      expect(instructions).toContain('npm install');
    });

    it('should include dev server start instruction', () => {
      const instructions = service.generateSetupInstructions();
      
      const hasDevInstruction = instructions.some(i => i.includes('npm run dev'));
      expect(hasDevInstruction).toBe(true);
    });
  });

  describe('createTasks', () => {
    it('should create tasks for all agents', async () => {
      const tasks = await service.createTasks('Build a todo app');
      
      expect(tasks.length).toBe(4);
      expect(tasks.map(t => t.agent)).toEqual(['architect', 'frontend', 'backend', 'devops']);
    });

    it('should include prompt in task descriptions', async () => {
      const prompt = 'Build a todo app';
      const tasks = await service.createTasks(prompt);
      
      tasks.forEach(task => {
        expect(task.description).toContain(prompt);
      });
    });

    it('should have expected output for each task', async () => {
      const tasks = await service.createTasks('Test app');
      
      tasks.forEach(task => {
        expect(task).toHaveProperty('expected_output');
        expect(task.expected_output.length).toBeGreaterThan(0);
      });
    });
  });

  describe('assembleApplication', () => {
    it('should assemble results from all agents', () => {
      const results = {
        architect: { code: ['arch code'], explanation: 'Architecture explanation' },
        frontend: { code: ['frontend code'], explanation: 'Frontend explanation' },
        backend: { code: ['backend code'], explanation: 'Backend explanation' },
        devops: { code: ['devops code'], explanation: 'DevOps explanation' }
      };

      const result = service.assembleApplication(results, 'Test app');
      
      expect(result).toHaveProperty('project');
      expect(result).toHaveProperty('frontend');
      expect(result).toHaveProperty('backend');
      expect(result).toHaveProperty('deployment');
      expect(result).toHaveProperty('fileStructure');
      expect(result).toHaveProperty('setupInstructions');
    });

    it('should include original prompt in project description', () => {
      const prompt = 'My test application';
      const results = {
        architect: { code: [], explanation: 'test' },
        frontend: { code: [], explanation: 'test' },
        backend: { code: [], explanation: 'test' },
        devops: { code: [], explanation: 'test' }
      };

      const result = service.assembleApplication(results, prompt);
      
      expect(result.project.description).toBe(prompt);
    });
  });
});

