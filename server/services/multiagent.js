const BedrockService = require('./bedrock');

/**
 * Multi-Agent Orchestration Service
 * Inspired by AWS Bedrock Multi-Agent Collaboration
 * 
 * Architecture:
 * - Supervisor Agent: Routes tasks to specialized agents
 * - Specialized Agents: Code, Testing, Security, Performance, Documentation
 * - Knowledge Base: Context and best practices repository
 * - Task Router: Intelligent task distribution
 */
class MultiAgentOrchestrator {
  constructor() {
    this.bedrock = new BedrockService();
    
    // Define specialized agents with clear roles and capabilities
    this.agents = {
      supervisor: {
        id: 'supervisor',
        role: 'Supervisor Agent',
        goal: 'Analyze user requests and route to appropriate specialized agents',
        backstory: 'Expert coordinator with deep understanding of software development lifecycle',
        capabilities: ['task_routing', 'coordination', 'quality_control'],
        priority: 1
      },
      codeGenerator: {
        id: 'codeGenerator',
        role: 'Code Generation Agent',
        goal: 'Generate high-quality, production-ready code',
        backstory: 'Senior full-stack developer with 15+ years experience across modern frameworks',
        capabilities: ['react', 'node', 'python', 'typescript', 'api_design', 'database_design'],
        priority: 2
      },
      testingAgent: {
        id: 'testingAgent',
        role: 'Testing & QA Agent',
        goal: 'Create comprehensive tests and ensure code quality',
        backstory: 'QA automation specialist with expertise in testing frameworks and methodologies',
        capabilities: ['unit_tests', 'integration_tests', 'e2e_tests', 'test_coverage'],
        priority: 3
      },
      securityAgent: {
        id: 'securityAgent',
        role: 'Security Agent',
        goal: 'Identify and fix security vulnerabilities',
        backstory: 'Security engineer specializing in secure coding practices and vulnerability assessment',
        capabilities: ['security_audit', 'vulnerability_scan', 'secure_coding', 'compliance'],
        priority: 3
      },
      performanceAgent: {
        id: 'performanceAgent',
        role: 'Performance Optimization Agent',
        goal: 'Optimize code for speed, efficiency, and scalability',
        backstory: 'Performance engineer with expertise in profiling and optimization techniques',
        capabilities: ['performance_analysis', 'optimization', 'caching', 'scalability'],
        priority: 4
      },
      documentationAgent: {
        id: 'documentationAgent',
        role: 'Documentation Agent',
        goal: 'Create clear, comprehensive documentation',
        backstory: 'Technical writer with developer background, expert in creating developer-friendly docs',
        capabilities: ['api_docs', 'code_comments', 'readme', 'architecture_docs'],
        priority: 4
      },
      architectAgent: {
        id: 'architectAgent',
        role: 'Solution Architect',
        goal: 'Design scalable, maintainable system architecture',
        backstory: 'Solutions architect with expertise in microservices, cloud architecture, and design patterns',
        capabilities: ['architecture_design', 'system_design', 'scalability', 'design_patterns'],
        priority: 2
      },
      debugAgent: {
        id: 'debugAgent',
        role: 'Debugging Agent',
        goal: 'Identify and fix bugs efficiently',
        backstory: 'Expert debugger with deep knowledge of common pitfalls and debugging techniques',
        capabilities: ['bug_detection', 'root_cause_analysis', 'error_handling', 'logging'],
        priority: 2
      }
    };

    // Knowledge base for best practices and patterns
    this.knowledgeBase = {
      react: {
        bestPractices: [
          'Use functional components with hooks',
          'Implement proper error boundaries',
          'Optimize re-renders with memo and useMemo',
          'Follow component composition patterns',
          'Use TypeScript for type safety'
        ],
        patterns: ['Container/Presenter', 'Compound Components', 'Render Props', 'Custom Hooks']
      },
      security: {
        owasp: ['Injection', 'Broken Authentication', 'XSS', 'CSRF', 'Security Misconfiguration'],
        practices: ['Input validation', 'Parameterized queries', 'HTTPS only', 'Secure headers', 'Rate limiting']
      },
      performance: {
        metrics: ['FCP', 'LCP', 'TTI', 'CLS', 'FID'],
        optimizations: ['Code splitting', 'Lazy loading', 'Image optimization', 'Caching strategies', 'CDN usage']
      },
      testing: {
        pyramid: ['Unit Tests (70%)', 'Integration Tests (20%)', 'E2E Tests (10%)'],
        frameworks: ['Jest', 'React Testing Library', 'Cypress', 'Playwright']
      }
    };

    // Task execution history for learning and improvement
    this.executionHistory = [];
  }

  /**
   * Main orchestration method - analyzes request and coordinates agents
   */
  async orchestrate(userRequest, options = {}) {
    const {
      model = 'claude-3.7-sonnet',
      includeTests = true,
      includeSecurity = true,
      includePerformance = false,
      includeDocs = true,
      agentSelection = 'auto'
    } = options;

    console.log(`[Orchestrator] Starting multi-agent orchestration for request: ${userRequest.substring(0, 100)}...`);

    // Step 1: Supervisor analyzes and creates execution plan
    const executionPlan = await this.createExecutionPlan(userRequest, options, model);
    
    // Step 2: Execute tasks with appropriate agents
    const results = await this.executeAgentTasks(executionPlan, model);
    
    // Step 3: Integrate and validate results
    const integratedResult = await this.integrateResults(results, executionPlan, model);
    
    // Step 4: Final quality check
    const finalResult = await this.qualityCheck(integratedResult, executionPlan, model);
    
    // Store execution for learning
    this.recordExecution(userRequest, executionPlan, finalResult);

    return finalResult;
  }

  /**
   * Supervisor agent creates execution plan
   */
  async createExecutionPlan(userRequest, options, model) {
    console.log('[Supervisor] Analyzing request and creating execution plan...');

    const supervisorPrompt = `${this.getAgentContext(this.agents.supervisor)}

USER REQUEST:
${userRequest}

OPTIONS:
- Include Tests: ${options.includeTests}
- Include Security Review: ${options.includeSecurity}
- Include Performance Optimization: ${options.includePerformance}
- Include Documentation: ${options.includeDocs}

TASK:
Analyze this request and create a detailed execution plan. Determine:
1. Which specialized agents should be involved
2. The sequence of agent execution
3. Dependencies between agent tasks
4. Expected deliverables from each agent
5. Collaboration requirements between agents

Respond in the following JSON format:
{
  "taskType": "code_generation|debugging|architecture|refactoring|fullstack",
  "complexity": "simple|moderate|complex",
  "requiredAgents": ["agent1", "agent2", ...],
  "executionSequence": [
    {
      "agent": "agentId",
      "task": "specific task description",
      "dependencies": ["agentId1", ...],
      "priority": 1-5
    }
  ],
  "expectedDeliverables": ["deliverable1", ...],
  "estimatedTime": "time estimate"
}`;

    const response = await this.bedrock.generateCode(supervisorPrompt, model);
    
    try {
      // Extract JSON from response
      const jsonMatch = response.explanation.match(/\{[\s\S]*\}/);
      const plan = jsonMatch ? JSON.parse(jsonMatch[0]) : this.createDefaultPlan(userRequest, options);
      
      console.log('[Supervisor] Execution plan created:', plan);
      return plan;
    } catch (error) {
      console.warn('[Supervisor] Failed to parse plan, using default:', error.message);
      return this.createDefaultPlan(userRequest, options);
    }
  }

  /**
   * Execute tasks with appropriate agents in sequence
   */
  async executeAgentTasks(executionPlan, model) {
    console.log('[Orchestrator] Executing agent tasks...');
    
    const results = {};
    const executionSequence = this.sortTasksByDependency(executionPlan.executionSequence);

    for (const task of executionSequence) {
      const agent = this.agents[task.agent];
      if (!agent) {
        console.warn(`[Orchestrator] Agent ${task.agent} not found, skipping...`);
        continue;
      }

      console.log(`[${agent.role}] Starting task: ${task.task.substring(0, 60)}...`);

      // Gather context from dependent agents
      const context = this.gatherDependencyContext(task.dependencies, results);

      // Execute agent task
      const agentResult = await this.executeAgentTask(agent, task, context, model);
      results[task.agent] = agentResult;

      console.log(`[${agent.role}] Task completed`);
    }

    return results;
  }

  /**
   * Execute individual agent task
   */
  async executeAgentTask(agent, task, context, model) {
    const agentPrompt = `${this.getAgentContext(agent)}

YOUR SPECIFIC TASK:
${task.task}

${context ? `CONTEXT FROM OTHER AGENTS:\n${JSON.stringify(context, null, 2)}\n` : ''}

${this.getAgentKnowledge(agent)}

Generate your deliverable with:
1. Complete implementation
2. Detailed explanation
3. Best practices applied
4. Any warnings or considerations
5. Next steps or recommendations`;

    const result = await this.bedrock.generateCode(agentPrompt, model);
    
    return {
      agent: agent.id,
      role: agent.role,
      output: result.code,
      explanation: result.explanation,
      language: result.language,
      metadata: {
        timestamp: new Date().toISOString(),
        model: model,
        capabilities: agent.capabilities
      }
    };
  }

  /**
   * Integrate results from multiple agents
   */
  async integrateResults(agentResults, executionPlan, model) {
    console.log('[Orchestrator] Integrating agent results...');

    const integrationPrompt = `You are integrating outputs from multiple specialized agents.

EXECUTION PLAN:
${JSON.stringify(executionPlan, null, 2)}

AGENT OUTPUTS:
${Object.entries(agentResults).map(([agentId, result]) => `
--- ${result.role} ---
${result.explanation}
CODE:
${result.output?.join('\n\n') || 'No code generated'}
`).join('\n\n')}

INTEGRATION TASK:
Combine all agent outputs into a cohesive, production-ready deliverable that:
1. Incorporates all code from agents in logical structure
2. Ensures compatibility between different agent outputs
3. Resolves any conflicts or overlaps
4. Maintains best practices from all agents
5. Creates a complete, deployable solution

Provide:
1. Integrated code files with clear file structure
2. Overall explanation of the solution
3. Setup and deployment instructions
4. Agent contribution summary`;

    const integrated = await this.bedrock.generateCode(integrationPrompt, model);

    return {
      code: integrated.code,
      explanation: integrated.explanation,
      language: integrated.language,
      agentContributions: Object.keys(agentResults),
      executionPlan: executionPlan
    };
  }

  /**
   * Final quality check by supervisor
   */
  async qualityCheck(integratedResult, executionPlan, model) {
    console.log('[Supervisor] Performing final quality check...');

    const qualityCheckPrompt = `${this.getAgentContext(this.agents.supervisor)}

INTEGRATED SOLUTION:
${integratedResult.explanation}

CODE:
${integratedResult.code?.join('\n\n') || ''}

QUALITY CHECK TASK:
Review the integrated solution and verify:
1. All requirements from the original request are met
2. Code follows best practices
3. No security vulnerabilities
4. Proper error handling
5. Code is maintainable and scalable
6. Documentation is complete

Provide a quality report and any final recommendations.`;

    const qualityReport = await this.bedrock.generateCode(qualityCheckPrompt, model);

    return {
      ...integratedResult,
      qualityReport: qualityReport.explanation,
      status: 'completed',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Helper methods
   */
  getAgentContext(agent) {
    return `You are: ${agent.role}
Goal: ${agent.goal}
Backstory: ${agent.backstory}
Capabilities: ${agent.capabilities.join(', ')}

You are part of a multi-agent system working collaboratively to deliver high-quality solutions.`;
  }

  getAgentKnowledge(agent) {
    const relevantKnowledge = [];
    
    agent.capabilities.forEach(cap => {
      if (cap.includes('react') && this.knowledgeBase.react) {
        relevantKnowledge.push(`React Best Practices: ${this.knowledgeBase.react.bestPractices.join(', ')}`);
      }
      if (cap.includes('security') && this.knowledgeBase.security) {
        relevantKnowledge.push(`Security Guidelines: ${this.knowledgeBase.security.practices.join(', ')}`);
      }
      if (cap.includes('performance') && this.knowledgeBase.performance) {
        relevantKnowledge.push(`Performance Optimizations: ${this.knowledgeBase.performance.optimizations.join(', ')}`);
      }
      if (cap.includes('test') && this.knowledgeBase.testing) {
        relevantKnowledge.push(`Testing Strategy: ${this.knowledgeBase.testing.pyramid.join(', ')}`);
      }
    });

    return relevantKnowledge.length > 0 
      ? `KNOWLEDGE BASE:\n${relevantKnowledge.join('\n')}`
      : '';
  }

  gatherDependencyContext(dependencies, results) {
    if (!dependencies || dependencies.length === 0) return null;

    const context = {};
    dependencies.forEach(dep => {
      if (results[dep]) {
        context[dep] = {
          role: results[dep].role,
          summary: results[dep].explanation.substring(0, 500),
          outputs: results[dep].output?.map(o => o.substring(0, 200))
        };
      }
    });

    return Object.keys(context).length > 0 ? context : null;
  }

  sortTasksByDependency(tasks) {
    // Simple topological sort based on priority and dependencies
    return tasks.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.dependencies?.length !== b.dependencies?.length) {
        return (a.dependencies?.length || 0) - (b.dependencies?.length || 0);
      }
      return 0;
    });
  }

  createDefaultPlan(userRequest, options) {
    const requiredAgents = ['codeGenerator'];
    const executionSequence = [
      { agent: 'codeGenerator', task: userRequest, dependencies: [], priority: 1 }
    ];

    if (options.includeTests) {
      requiredAgents.push('testingAgent');
      executionSequence.push({
        agent: 'testingAgent',
        task: 'Create comprehensive tests for the generated code',
        dependencies: ['codeGenerator'],
        priority: 2
      });
    }

    if (options.includeSecurity) {
      requiredAgents.push('securityAgent');
      executionSequence.push({
        agent: 'securityAgent',
        task: 'Review code for security vulnerabilities',
        dependencies: ['codeGenerator'],
        priority: 2
      });
    }

    if (options.includePerformance) {
      requiredAgents.push('performanceAgent');
      executionSequence.push({
        agent: 'performanceAgent',
        task: 'Optimize code for performance',
        dependencies: ['codeGenerator'],
        priority: 3
      });
    }

    if (options.includeDocs) {
      requiredAgents.push('documentationAgent');
      executionSequence.push({
        agent: 'documentationAgent',
        task: 'Create comprehensive documentation',
        dependencies: ['codeGenerator'],
        priority: 4
      });
    }

    return {
      taskType: 'code_generation',
      complexity: 'moderate',
      requiredAgents,
      executionSequence,
      expectedDeliverables: ['code', 'tests', 'documentation'],
      estimatedTime: '2-5 minutes'
    };
  }

  recordExecution(request, plan, result) {
    this.executionHistory.push({
      timestamp: new Date().toISOString(),
      request: request.substring(0, 200),
      plan: plan,
      status: result.status,
      agentsUsed: result.agentContributions
    });

    // Keep only last 100 executions
    if (this.executionHistory.length > 100) {
      this.executionHistory.shift();
    }
  }

  /**
   * Get agent performance metrics
   */
  getAgentMetrics() {
    const agentUsage = {};
    
    this.executionHistory.forEach(execution => {
      execution.agentsUsed?.forEach(agentId => {
        agentUsage[agentId] = (agentUsage[agentId] || 0) + 1;
      });
    });

    return {
      totalExecutions: this.executionHistory.length,
      agentUsage,
      recentExecutions: this.executionHistory.slice(-10)
    };
  }

  /**
   * Get available agents info
   */
  getAgentsInfo() {
    return Object.entries(this.agents).map(([id, agent]) => ({
      id,
      role: agent.role,
      goal: agent.goal,
      capabilities: agent.capabilities
    }));
  }
}

module.exports = MultiAgentOrchestrator;

