const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const WebSocket = require('ws');
const http = require('http');
const BedrockService = require('./services/bedrock');
const CrewAIService = require('./services/crewai');
const CodeService = require('./services/code');
const MultiAgentOrchestrator = require('./services/multiagent');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://codingnexusai.vercel.app', 'https://codingnexusai-k2ok9va9c-rajshah9305s-projects.vercel.app']
    : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Services
const bedrockService = new BedrockService();
const crewaiService = new CrewAIService();
const codeService = new CodeService();
const multiAgentOrchestrator = new MultiAgentOrchestrator();

// WebSocket for real-time code preview
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'code_preview':
          const preview = await codeService.generatePreview(data.code);
          ws.send(JSON.stringify({ type: 'preview_update', data: preview }));
          break;
        case 'live_edit':
          const result = await codeService.processLiveEdit(data.changes);
          ws.send(JSON.stringify({ type: 'edit_result', data: result }));
          break;
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });
  
  ws.on('close', () => console.log('Client disconnected'));
});

// API Routes
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
    console.log(`[API] Generate request - Type: ${type}, Model: ${model}, Prompt: ${prompt?.substring(0, 50)}...`);
    
    let result;
    switch (type) {
      case 'fullstack':
        result = await crewaiService.generateFullStackApp(prompt, model);
        break;
      case 'component':
        result = await bedrockService.generateCode(prompt, model);
        break;
      case 'debug':
        result = await codeService.debugCode(req.body.code, prompt, model);
        break;
      case 'explain':
        result = await codeService.explainCode(req.body.code, model);
        break;
      case 'fix':
        result = await codeService.fixCode(req.body.code, req.body.error, model);
        break;
      default:
        result = await bedrockService.generateCode(prompt, model);
    }
    
    console.log('[API] Generation successful');
    res.json(result);
  } catch (error) {
    console.error('[API] Generation error:', error);
    console.error('[API] Error stack:', error.stack);
    res.status(500).json({ error: error.message, details: error.stack });
  }
});

app.post('/api/autocomplete', async (req, res) => {
  try {
    const { code, cursor, model } = req.body;
    const suggestions = await codeService.getAutocompleteSuggestions(code, cursor, model);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/integrate', async (req, res) => {
  try {
    const { type, config } = req.body;
    const integration = await codeService.generateIntegration(type, config);
    res.json(integration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Multi-Agent Orchestration Routes
app.post('/api/multiagent/orchestrate', async (req, res) => {
  try {
    const { prompt, options } = req.body;
    console.log(`[API] Multi-agent orchestration request: ${prompt?.substring(0, 50)}...`);
    
    const result = await multiAgentOrchestrator.orchestrate(prompt, options);
    
    console.log('[API] Multi-agent orchestration completed');
    res.json(result);
  } catch (error) {
    console.error('[API] Multi-agent orchestration error:', error);
    res.status(500).json({ error: error.message, details: error.stack });
  }
});

app.get('/api/multiagent/agents', async (req, res) => {
  try {
    const agents = multiAgentOrchestrator.getAgentsInfo();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/multiagent/metrics', async (req, res) => {
  try {
    const metrics = multiAgentOrchestrator.getAgentMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

// Only start server in development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`🚀 AI Coding Nexus Server running on port ${PORT}`);
    console.log(`📦 Multi-Agent Orchestration: ENABLED`);
    console.log(`🤖 Available Agents: ${multiAgentOrchestrator.getAgentsInfo().length}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;