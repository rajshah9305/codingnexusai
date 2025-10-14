import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import PreviewPanel from './components/PreviewPanel';
import ChatPanel from './components/ChatPanel';
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
  
  const aiService = new AIService();

  useEffect(() => {
    loadModels();
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

  const handleGenerate = async (prompt, type = 'component') => {
    setIsGenerating(true);
    try {
      const result = await aiService.generateCode(prompt, selectedModel, type);
      
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
    } catch (error) {
      console.error('Generation failed:', error);
      setChatHistory(prev => [...prev, {
        type: 'error',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setIsGenerating(false);
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
      />
      
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat + Preview Panel */}
          {(layout === 'split' || layout === 'preview') && (
            <div className={`${layout === 'split' ? 'w-[52%]' : 'w-full'} flex flex-col border-r border-gray-200 bg-white`}>
              {/* Chat Panel */}
              <div className="flex-1 min-h-0">
                <ChatPanel
                  history={chatHistory}
                  onSendMessage={(message) => handleGenerate(message)}
                  isGenerating={isGenerating}
                />
              </div>
              
              {/* Preview Panel */}
              <div className="h-[360px] border-t border-gray-200">
                <PreviewPanel preview={preview} />
              </div>
            </div>
          )}
          
          {/* Code Editor */}
          {(layout === 'split' || layout === 'editor') && (
            <div className={`${layout === 'split' ? 'w-[48%]' : 'w-full'} bg-white`}>
              <CodeEditor
                code={code}
                language={language}
                onChange={handleCodeChange}
                onLanguageChange={setLanguage}
              />
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <Sidebar 
          onGenerate={handleGenerate}
          onDebug={handleDebug}
          isGenerating={isGenerating}
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
