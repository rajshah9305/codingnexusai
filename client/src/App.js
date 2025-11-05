import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import ChatPanel from './components/ChatPanel';
import AgentDashboard from './components/AgentDashboard';
import AgentCollaboration from './components/AgentCollaboration';
import { AIService } from './services/AIService';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState('claude-3.5-sonnet-v2');
  const [models, setModels] = useState([]);
  const [code, setCode] = useState('// Welcome to AI Coding Nexus\n// Start typing or use the chat to generate code\n\nfunction welcome() {\n  console.log("Hello, World!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [layout, setLayout] = useState('split');
  const [hasPreview, setHasPreview] = useState(false); // eslint-disable-line no-unused-vars
  
  // Multi-Agent State (Always Enabled)
  const [multiAgentMode] = useState(true); // eslint-disable-line no-unused-vars
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
        // Preview updates handled by PreviewPanel component
        console.log('Preview updated');
      } else if (data.type === 'edit_result') {
        setCode(data.data.updatedCode);
      }
    });
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    
    // Check if code contains HTML/CSS/JS that can be previewed
    const hasPreviewableContent = 
      newCode.includes('<html') || 
      newCode.includes('<!DOCTYPE') || 
      newCode.includes('<div') ||
      newCode.includes('<body') ||
      (language === 'html' || language === 'css' || language === 'javascript');
    
    setHasPreview(hasPreviewableContent);
    
    clearTimeout(window.previewTimeout);
    window.previewTimeout = setTimeout(() => {
      if (hasPreviewableContent) {
        aiService.updatePreview(newCode);
      }
    }, 500);
  };

  const handleGenerate = async (prompt, type = 'component', options = {}) => {
    setIsGenerating(true);
    
    try {
      let result;
      
      // Always use Multi-Agent Orchestration
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
        
        // Check if generated code is previewable
        const generatedCode = result.code[0];
        const isPreviewable = 
          generatedCode.includes('<html') || 
          generatedCode.includes('<!DOCTYPE') || 
          generatedCode.includes('<div') ||
          generatedCode.includes('<body') ||
          result.language === 'html';
        
        setHasPreview(isPreviewable);
      }
      
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        content: result.explanation || 'Multi-agent task completed',
        data: result,
        multiAgent: true
      }]);
      
      // Refresh metrics
      loadMetrics();
    } catch (error) {
      console.error('Generation failed:', error);
      setChatHistory(prev => [...prev, {
        type: 'error',
        content: `Error: ${error.message}`
      }]);
      // Make sure we always reset states
      setIsGenerating(false);
      setActiveAgents([]);
      setActiveStep(0);
      setExecutionPlan(null);  // Add this to reset execution plan on error
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
        multiAgentMode={true}
        onMultiAgentToggle={() => {}}
      />
      
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Professional 3-Pane Layout: Chat | Editor | Tools */}
        
        {/* LEFT PANE: Chat & Agent Collaboration */}
        <div className="hidden md:flex md:w-[320px] lg:w-[360px] flex-col border-r border-gray-200 bg-white overflow-hidden flex-shrink-0">
          {/* Chat Panel - Full Height */}
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              history={chatHistory}
              onSendMessage={(message) => handleGenerate(message)}
              isGenerating={isGenerating}
              multiAgentMode={true}
            />
          </div>
          
          {/* Agent Collaboration - Compact Bottom Section */}
          <div className="h-[160px] border-t border-gray-200 overflow-hidden">
            <AgentCollaboration
              executionPlan={executionPlan}
              activeStep={activeStep}
              agentResults={{}}
              isExecuting={isGenerating}
            />
          </div>
        </div>
        
        {/* MIDDLE PANE: Code Editor (Primary Focus) */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden min-w-0">
          {/* Code Editor - Full Height */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              language={language}
              onChange={handleCodeChange}
              onLanguageChange={setLanguage}
            />
          </div>
          
          {/* Agent Dashboard - Compact Bottom Bar */}
          <div className="h-[120px] border-t border-gray-200 bg-white overflow-hidden">
            <AgentDashboard
              agents={agents}
              activeAgents={activeAgents}
              metrics={agentMetrics}
              executionPlan={executionPlan}
            />
          </div>
        </div>
        
        {/* RIGHT PANE: Tools & Actions */}
        <div className="hidden lg:flex w-[280px] xl:w-[300px] flex-col bg-white border-l border-gray-200 overflow-hidden flex-shrink-0">
          <Sidebar 
            onGenerate={handleGenerate}
            onDebug={handleDebug}
            isGenerating={isGenerating}
            multiAgentMode={true}
          />
        </div>
        
        {/* Mobile Chat Button (Floating) - Bottom Left */}
        <div className="md:hidden fixed bottom-6 left-6 z-50">
          <button
            onClick={() => {/* Toggle mobile chat */}}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
            aria-label="Open Chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Tools Button (Floating) - Bottom Right */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Sidebar 
            onGenerate={handleGenerate}
            onDebug={handleDebug}
            isGenerating={isGenerating}
            multiAgentMode={true}
            compact={true}
          />
        </div>
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