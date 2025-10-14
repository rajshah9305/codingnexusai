const MultiAgentOrchestrator = require('../multiagent');

// Mock the BedrockService
jest.mock('../bedrock');
const BedrockService = require('../bedrock');

describe('MultiAgentOrchestrator', () => {
  let orchestrator;
  let mockBedrockService;

  beforeEach(() => {
    orchestrator = new MultiAgentOrchestrator();
    mockBedrockService = orchestrator.bedrock;
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with all specialized agents', () => {
      expect(orchestrator.agents).toHaveProperty('supervisor');
      expect(orchestrator.agents).toHaveProperty('codeGenerator');
      expect(orchestrator.agents).toHaveProperty('testingAgent');
      expect(orchestrator.agents).toHaveProperty('securityAgent');
      expect(orchestrator.agents).toHaveProperty('performanceAgent');
      expect(orchestrator.agents).toHaveProperty('documentationAgent');
      expect(orchestrator.agents).toHaveProperty('architectAgent');
      expect(orchestrator.agents).toHaveProperty('debugAgent');
    });

    it('should initialize knowledge base', () => {
      expect(orchestrator.knowledgeBase).toBeDefined();
      expect(orchestrator.knowledgeBase).toHaveProperty('react');
      expect(orchestrator.knowledgeBase).toHaveProperty('security');
      expect(orchestrator.knowledgeBase).toHaveProperty('performance');
      expect(orchestrator.knowledgeBase).toHaveProperty('testing');
    });

    it('should initialize empty execution history', () => {
      expect(orchestrator.executionHistory).toBeDefined();
      expect(Array.isArray(orchestrator.executionHistory)).toBe(true);
      expect(orchestrator.executionHistory.length).toBe(0);
    });

    it('should have correct agent priorities', () => {
      expect(orchestrator.agents.supervisor.priority).toBe(1);
      expect(orchestrator.agents.codeGenerator.priority).toBe(2);
      expect(orchestrator.agents.testingAgent.priority).toBe(3);
    });
  });

  describe('getAgentsInfo', () => {
    it('should return array of agent information', () => {
      const agentsInfo = orchestrator.getAgentsInfo();
      
      expect(Array.isArray(agentsInfo)).toBe(true);
      expect(agentsInfo.length).toBe(8);
      
      agentsInfo.forEach(agent => {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('role');
        expect(agent).toHaveProperty('goal');
        expect(agent).toHaveProperty('capabilities');
      });
    });
  });

  describe('createDefaultPlan', () => {
    it('should create plan with code generator by default', () => {
      const plan = orchestrator.createDefaultPlan('Test request', {});
      
      expect(plan.requiredAgents).toContain('codeGenerator');
      expect(plan.executionSequence.length).toBeGreaterThan(0);
      expect(plan.executionSequence[0].agent).toBe('codeGenerator');
    });

    it('should add testing agent when includeTests is true', () => {
      const plan = orchestrator.createDefaultPlan('Test request', { includeTests: true });
      
      expect(plan.requiredAgents).toContain('testingAgent');
      const testingTask = plan.executionSequence.find(task => task.agent === 'testingAgent');
      expect(testingTask).toBeDefined();
      expect(testingTask.dependencies).toContain('codeGenerator');
    });

    it('should add security agent when includeSecurity is true', () => {
      const plan = orchestrator.createDefaultPlan('Test request', { includeSecurity: true });
      
      expect(plan.requiredAgents).toContain('securityAgent');
    });

    it('should add performance agent when includePerformance is true', () => {
      const plan = orchestrator.createDefaultPlan('Test request', { includePerformance: true });
      
      expect(plan.requiredAgents).toContain('performanceAgent');
    });

    it('should add documentation agent when includeDocs is true', () => {
      const plan = orchestrator.createDefaultPlan('Test request', { includeDocs: true });
      
      expect(plan.requiredAgents).toContain('documentationAgent');
    });

    it('should include all expected properties', () => {
      const plan = orchestrator.createDefaultPlan('Test request', {});
      
      expect(plan).toHaveProperty('taskType');
      expect(plan).toHaveProperty('complexity');
      expect(plan).toHaveProperty('requiredAgents');
      expect(plan).toHaveProperty('executionSequence');
      expect(plan).toHaveProperty('expectedDeliverables');
      expect(plan).toHaveProperty('estimatedTime');
    });
  });

  describe('getAgentContext', () => {
    it('should return formatted agent context', () => {
      const context = orchestrator.getAgentContext(orchestrator.agents.codeGenerator);
      
      expect(context).toContain('Code Generation Agent');
      expect(context).toContain('You are:');
      expect(context).toContain('Goal:');
      expect(context).toContain('Backstory:');
      expect(context).toContain('Capabilities:');
    });
  });

  describe('getAgentKnowledge', () => {
    it('should return relevant knowledge for React capabilities', () => {
      const agent = {
        capabilities: ['react', 'node']
      };
      
      const knowledge = orchestrator.getAgentKnowledge(agent);
      
      expect(knowledge).toContain('React Best Practices');
    });

    it('should return relevant knowledge for security capabilities', () => {
      const agent = {
        capabilities: ['security_audit', 'vulnerability_scan']
      };
      
      const knowledge = orchestrator.getAgentKnowledge(agent);
      
      expect(knowledge).toContain('Security Guidelines');
    });

    it('should return empty string for agents without relevant knowledge', () => {
      const agent = {
        capabilities: ['unknown_capability']
      };
      
      const knowledge = orchestrator.getAgentKnowledge(agent);
      
      expect(knowledge).toBe('');
    });
  });

  describe('sortTasksByDependency', () => {
    it('should sort tasks by priority', () => {
      const tasks = [
        { agent: 'task3', priority: 3, dependencies: [] },
        { agent: 'task1', priority: 1, dependencies: [] },
        { agent: 'task2', priority: 2, dependencies: [] }
      ];
      
      const sorted = orchestrator.sortTasksByDependency(tasks);
      
      expect(sorted[0].priority).toBe(1);
      expect(sorted[1].priority).toBe(2);
      expect(sorted[2].priority).toBe(3);
    });

    it('should sort by dependency count when priorities are equal', () => {
      const tasks = [
        { agent: 'task1', priority: 1, dependencies: ['dep1', 'dep2'] },
        { agent: 'task2', priority: 1, dependencies: [] }
      ];
      
      const sorted = orchestrator.sortTasksByDependency(tasks);
      
      expect(sorted[0].dependencies.length).toBe(0);
      expect(sorted[1].dependencies.length).toBe(2);
    });
  });

  describe('gatherDependencyContext', () => {
    it('should gather context from completed dependencies', () => {
      const results = {
        codeGenerator: {
          role: 'Code Generator',
          explanation: 'Generated code with best practices',
          output: ['const x = 1;']
        }
      };
      
      const context = orchestrator.gatherDependencyContext(['codeGenerator'], results);
      
      expect(context).toBeDefined();
      expect(context.codeGenerator).toBeDefined();
      expect(context.codeGenerator.role).toBe('Code Generator');
    });

    it('should return null for empty dependencies', () => {
      const context = orchestrator.gatherDependencyContext([], {});
      
      expect(context).toBeNull();
    });

    it('should handle missing dependencies gracefully', () => {
      const results = {};
      const context = orchestrator.gatherDependencyContext(['nonexistent'], results);
      
      expect(context).toBeNull();
    });
  });

  describe('getAgentMetrics', () => {
    it('should return metrics with zero executions initially', () => {
      const metrics = orchestrator.getAgentMetrics();
      
      expect(metrics).toHaveProperty('totalExecutions');
      expect(metrics).toHaveProperty('agentUsage');
      expect(metrics).toHaveProperty('recentExecutions');
      expect(metrics.totalExecutions).toBe(0);
    });

    it('should track agent usage from execution history', () => {
      orchestrator.executionHistory = [
        {
          timestamp: new Date().toISOString(),
          request: 'Test 1',
          agentsUsed: ['codeGenerator', 'testingAgent']
        },
        {
          timestamp: new Date().toISOString(),
          request: 'Test 2',
          agentsUsed: ['codeGenerator']
        }
      ];
      
      const metrics = orchestrator.getAgentMetrics();
      
      expect(metrics.totalExecutions).toBe(2);
      expect(metrics.agentUsage.codeGenerator).toBe(2);
      expect(metrics.agentUsage.testingAgent).toBe(1);
    });

    it('should limit recent executions to last 10', () => {
      orchestrator.executionHistory = Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date().toISOString(),
        request: `Test ${i}`,
        agentsUsed: []
      }));
      
      const metrics = orchestrator.getAgentMetrics();
      
      expect(metrics.recentExecutions.length).toBe(10);
    });
  });

  describe('recordExecution', () => {
    it('should add execution to history', () => {
      const request = 'Test request';
      const plan = { taskType: 'code_generation' };
      const result = { status: 'completed', agentContributions: ['codeGenerator'] };
      
      orchestrator.recordExecution(request, plan, result);
      
      expect(orchestrator.executionHistory.length).toBe(1);
      expect(orchestrator.executionHistory[0]).toHaveProperty('timestamp');
      expect(orchestrator.executionHistory[0].request).toContain('Test request');
      expect(orchestrator.executionHistory[0].status).toBe('completed');
    });

    it('should limit history to 100 executions', () => {
      // Fill history with 100 items
      for (let i = 0; i < 100; i++) {
        orchestrator.recordExecution(`Request ${i}`, {}, { status: 'completed', agentContributions: [] });
      }
      
      expect(orchestrator.executionHistory.length).toBe(100);
      
      // Add one more
      orchestrator.recordExecution('Request 101', {}, { status: 'completed', agentContributions: [] });
      
      // Should still be 100
      expect(orchestrator.executionHistory.length).toBe(100);
      // First item should be removed
      expect(orchestrator.executionHistory[0].request).not.toContain('Request 0');
    });

    it('should truncate long requests to 200 characters', () => {
      const longRequest = 'A'.repeat(300);
      orchestrator.recordExecution(longRequest, {}, { status: 'completed', agentContributions: [] });
      
      expect(orchestrator.executionHistory[0].request.length).toBe(200);
    });
  });

  describe('orchestrate (integration)', () => {
    it('should orchestrate successfully with mocked bedrock', async () => {
      const mockPlanResponse = {
        code: [],
        explanation: JSON.stringify({
          taskType: 'code_generation',
          complexity: 'simple',
          requiredAgents: ['codeGenerator'],
          executionSequence: [
            { agent: 'codeGenerator', task: 'Generate code', dependencies: [], priority: 1 }
          ],
          expectedDeliverables: ['code'],
          estimatedTime: '1 minute'
        }),
        language: 'javascript',
        model: 'claude-3.7-sonnet'
      };

      const mockAgentResponse = {
        code: ['const test = 1;'],
        explanation: 'Generated test code',
        language: 'javascript'
      };

      mockBedrockService.generateCode
        .mockResolvedValueOnce(mockPlanResponse)  // For createExecutionPlan
        .mockResolvedValueOnce(mockAgentResponse)  // For executeAgentTask
        .mockResolvedValueOnce(mockAgentResponse)  // For integrateResults
        .mockResolvedValueOnce({ ...mockAgentResponse, explanation: 'Quality check passed' }); // For qualityCheck

      const result = await orchestrator.orchestrate('Create a test variable', {});
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('status');
      expect(result.status).toBe('completed');
      expect(orchestrator.executionHistory.length).toBe(1);
    });

    it('should use default plan when JSON parsing fails', async () => {
      const mockInvalidResponse = {
        code: [],
        explanation: 'This is not valid JSON',
        language: 'javascript'
      };

      const mockAgentResponse = {
        code: ['const test = 1;'],
        explanation: 'Generated code',
        language: 'javascript'
      };

      mockBedrockService.generateCode
        .mockResolvedValueOnce(mockInvalidResponse)  // Invalid plan
        .mockResolvedValueOnce(mockAgentResponse)    // Agent execution
        .mockResolvedValueOnce(mockAgentResponse)    // Integration
        .mockResolvedValueOnce(mockAgentResponse);   // Quality check

      const result = await orchestrator.orchestrate('Test', { includeTests: false, includeSecurity: false, includeDocs: false });
      
      expect(result).toBeDefined();
      expect(result.status).toBe('completed');
    });

    it('should handle orchestration errors gracefully', async () => {
      mockBedrockService.generateCode.mockRejectedValue(new Error('Bedrock error'));

      await expect(
        orchestrator.orchestrate('Test request', {})
      ).rejects.toThrow('Bedrock error');
    });
  });
});

