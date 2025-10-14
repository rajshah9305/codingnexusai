class CrewAIService {
  constructor() {
    this.agents = {
      architect: {
        role: 'Solution Architect',
        goal: 'Design scalable application architecture',
        backstory: 'Expert in system design and technology selection'
      },
      frontend: {
        role: 'Frontend Developer',
        goal: 'Create modern, responsive user interfaces',
        backstory: 'Specialist in React, Vue, and modern CSS frameworks'
      },
      backend: {
        role: 'Backend Developer', 
        goal: 'Build robust server-side applications',
        backstory: 'Expert in APIs, databases, and server architecture'
      },
      devops: {
        role: 'DevOps Engineer',
        goal: 'Ensure deployment and scalability',
        backstory: 'Specialist in cloud infrastructure and CI/CD'
      }
    };
  }

  async generateFullStackApp(prompt, model) {
    const tasks = await this.createTasks(prompt);
    const results = {};

    for (const task of tasks) {
      results[task.agent] = await this.executeTask(task, model);
    }

    return this.assembleApplication(results, prompt);
  }

  async createTasks(prompt) {
    return [
      {
        agent: 'architect',
        description: `Analyze requirements and design architecture for: ${prompt}`,
        expected_output: 'Technical architecture document with technology stack'
      },
      {
        agent: 'frontend',
        description: `Create frontend components and UI for: ${prompt}`,
        expected_output: 'React components with styling and interactions'
      },
      {
        agent: 'backend',
        description: `Build backend API and data layer for: ${prompt}`,
        expected_output: 'Express.js API with database integration'
      },
      {
        agent: 'devops',
        description: `Create deployment configuration for: ${prompt}`,
        expected_output: 'Deployment scripts and configuration files'
      }
    ];
  }

  async executeTask(task, model) {
    const BedrockService = require('./bedrock');
    const bedrock = new BedrockService();

    const agentPrompt = `
Role: ${this.agents[task.agent].role}
Goal: ${this.agents[task.agent].goal}
Backstory: ${this.agents[task.agent].backstory}

Task: ${task.description}
Expected Output: ${task.expected_output}

Generate production-ready code with:
- Modern best practices
- Complete implementations
- Proper error handling
- Security considerations
- Performance optimization
`;

    return await bedrock.generateCode(agentPrompt, model);
  }

  assembleApplication(results, originalPrompt) {
    const architecture = results.architect;
    const frontend = results.frontend;
    const backend = results.backend;
    const devops = results.devops;

    return {
      project: {
        name: this.generateProjectName(originalPrompt),
        description: originalPrompt,
        architecture: architecture.explanation
      },
      frontend: {
        framework: 'React',
        components: frontend.code,
        styling: 'Tailwind CSS',
        features: this.extractFeatures(frontend.explanation)
      },
      backend: {
        framework: 'Express.js',
        api: backend.code,
        database: 'MongoDB',
        features: this.extractFeatures(backend.explanation)
      },
      deployment: {
        platform: 'AWS',
        configuration: devops.code,
        instructions: devops.explanation
      },
      fileStructure: this.generateFileStructure(),
      setupInstructions: this.generateSetupInstructions()
    };
  }

  generateProjectName(prompt) {
    return prompt.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
  }

  extractFeatures(explanation) {
    const features = [];
    const lines = explanation.split('\n');
    
    lines.forEach(line => {
      if (line.includes('✓') || line.includes('•') || line.includes('-')) {
        features.push(line.replace(/[✓•-]/g, '').trim());
      }
    });
    
    return features.filter(f => f.length > 0);
  }

  generateFileStructure() {
    return {
      'package.json': 'Project configuration',
      'src/': {
        'components/': 'React components',
        'pages/': 'Application pages',
        'hooks/': 'Custom React hooks',
        'utils/': 'Utility functions',
        'styles/': 'CSS and styling'
      },
      'server/': {
        'routes/': 'API routes',
        'models/': 'Database models',
        'middleware/': 'Express middleware',
        'config/': 'Configuration files'
      },
      'public/': 'Static assets',
      '.env': 'Environment variables',
      'README.md': 'Project documentation'
    };
  }

  generateSetupInstructions() {
    return [
      'npm install',
      'cp .env.example .env',
      'Configure environment variables',
      'npm run dev',
      'Open http://localhost:3000'
    ];
  }
}

module.exports = CrewAIService;