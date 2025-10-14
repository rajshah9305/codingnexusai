import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import PreviewPanel from './components/PreviewPanel';
import ChatPanel from './components/ChatPanel';
import AgentDashboard from './components/AgentDashboard';
import AgentCollaboration from './components/AgentCollaboration';
import { AIService } from './services/AIService';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState('claude-3.7-sonnet');
  const [models, setModels] = useState([]);
  const [code, setCode] = useState('// Welcome to AI Coding Nexus\n// Start typing or use the chat to generate code\n\nfunction welcome() {\n  console.log("Hello, World!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [preview, setPreview] = useState({ html: '', type: 'empty' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [layout, setLayout] = useState('split');
  
  // Multi-Agent State
  const [multiAgentMode, setMultiAgentMode] = useState(false);
  const [agents, setAgents] = useState([]);
  const [agentMetrics, setAgentMetrics] = useState(null);
  const [activeAgents, setActiveAgents] = useState([]);
  const [executionPlan, setExecutionPlan] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  
  const aiService = new AIService();

  useEffect(() => {
    loadModels();
    loadAgents();
    loadMetrics();
    connectWebSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadModels = async () => {
    try {
      const availableModels = await aiService.getModels();
      setModels(availableModels);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const loadAgents = async () => {
    try {
      const availableAgents = await aiService.getAgents();
      setAgents(availableAgents);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const loadMetrics = async () => {
    try {
      const metrics = await aiService.getAgentMetrics();
      setAgentMetrics(metrics);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const connectWebSocket = () => {
    aiService.connectWebSocket((data) => {
      if (data.type === 'preview_update') {
        setPreview(data.data);
      } else if (data.type === 'edit_result') {
        setCode(data.data.updatedCode);
        setPreview(data.data.preview);
      }
    });
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    clearTimeout(window.previewTimeout);
    window.previewTimeout = setTimeout(() => {
      aiService.updatePreview(newCode);
    }, 500);
  };

  const handleGenerate = async (prompt, type = 'component', options = {}) => {
    setIsGenerating(true);
    
    try {
      let result;
      
      if (multiAgentMode) {
        // Use Multi-Agent Orchestration
        console.log('Using multi-agent orchestration...');
        
        // Set default options for multi-agent
        const multiAgentOptions = {
          includeTests: options.includeTests !== false,
          includeSecurity: options.includeSecurity !== false,
          includePerformance: options.includePerformance || false,
          includeDocs: options.includeDocs !== false,
          ...options
        };
        
        result = await aiService.orchestrateMultiAgent(prompt, multiAgentOptions);
        
        // Update multi-agent state
        if (result.executionPlan) {
          setExecutionPlan(result.executionPlan);
          setActiveAgents(result.agentContributions || []);
        }
        
        // Update code if available
        if (result.code && result.code.length > 0) {
          setCode(result.code[0]);
          setLanguage(result.language);
        }
        
        setChatHistory(prev => [...prev, {
          type: 'assistant',
          content: result.explanation || 'Multi-agent task completed',
          data: result,
          multiAgent: true
        }]);
        
        // Refresh metrics
        loadMetrics();
      } else {
        // Use Single Agent
        result = await aiService.generateCode(prompt, selectedModel, type);
        
        if (type === 'fullstack') {
          setChatHistory(prev => [...prev, {
            type: 'assistant',
            content: 'Generated full-stack application',
            data: result
          }]);
        } else {
          if (result.code && result.code.length > 0) {
            setCode(result.code[0]);
            setLanguage(result.language);
          }
          
          setChatHistory(prev => [...prev, {
            type: 'assistant',
            content: result.explanation,
            code: result.code
          }]);
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setChatHistory(prev => [...prev, {
        type: 'error',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setIsGenerating(false);
      setActiveAgents([]);
      setActiveStep(0);
    }
  };

  const handleDebug = async (issue) => {
    setIsGenerating(true);
    try {
      const result = await aiService.debugCode(code, issue, selectedModel);
      
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        content: 'Debug Analysis',
        data: result
      }]);
      
      if (result.fixedCode && result.fixedCode.length > 0) {
        setCode(result.fixedCode[0]);
      }
    } catch (error) {
      console.error('Debug failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container-fluid bg-white">
      <Header 
        selectedModel={selectedModel}
        models={models}
        onModelChange={setSelectedModel}
        layout={layout}
        onLayoutChange={setLayout}
        multiAgentMode={multiAgentMode}
        onMultiAgentToggle={() => setMultiAgentMode(!multiAgentMode)}
      />
      
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat + Preview Panel OR Agent Dashboard */}
          {(layout === 'split' || layout === 'preview') && (
            <div className={`${layout === 'split' ? 'w-[52%]' : 'w-full'} flex flex-col border-r border-gray-200 bg-white`}>
              {/* Chat Panel */}
              <div className={multiAgentMode ? 'h-1/2 border-b border-gray-200' : 'flex-1 min-h-0'}>
                <ChatPanel
                  history={chatHistory}
                  onSendMessage={(message) => handleGenerate(message)}
                  isGenerating={isGenerating}
                  multiAgentMode={multiAgentMode}
                />
              </div>
              
              {/* Agent Collaboration View (Multi-Agent Mode) OR Preview Panel */}
              {multiAgentMode ? (
                <div className="h-1/2">
                  <AgentCollaboration
                    executionPlan={executionPlan}
                    activeStep={activeStep}
                    agentResults={{}}
                    isExecuting={isGenerating}
                  />
                </div>
              ) : (
                <div className="h-[360px] border-t border-gray-200">
                  <PreviewPanel preview={preview} />
                </div>
              )}
            </div>
          )}
          
          {/* Code Editor OR Agent Dashboard */}
          {(layout === 'split' || layout === 'editor') && (
            <div className={`${layout === 'split' ? 'w-[48%]' : 'w-full'} bg-white`}>
              {multiAgentMode && layout === 'split' ? (
                <div className="h-full flex flex-col">
                  <div className="h-1/2 border-b border-gray-200">
                    <CodeEditor
                      code={code}
                      language={language}
                      onChange={handleCodeChange}
                      onLanguageChange={setLanguage}
                    />
                  </div>
                  <div className="h-1/2">
                    <AgentDashboard
                      agents={agents}
                      activeAgents={activeAgents}
                      metrics={agentMetrics}
                      executionPlan={executionPlan}
                    />
                  </div>
                </div>
              ) : (
                <CodeEditor
                  code={code}
                  language={language}
                  onChange={handleCodeChange}
                  onLanguageChange={setLanguage}
                />
              )}
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <Sidebar 
          onGenerate={handleGenerate}
          onDebug={handleDebug}
          isGenerating={isGenerating}
          multiAgentMode={multiAgentMode}
        />
      </div>
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#000',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '16px 20px',
            fontWeight: '600',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
