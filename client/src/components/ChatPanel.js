import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, Download, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatPanel = ({ history, onSendMessage, isGenerating }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadCode = (code, filename = 'generated-code.js') => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded');
  };

  const renderMessage = (msg, index) => {
    if (msg.type === 'error') {
      return (
        <div key={index} className="mb-4 animate-slide-up">
          <div className="card bg-red-50 border-red-200">
            <div className="card-body py-3 px-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="label text-sm text-red-900">Error</span>
              </div>
              <p className="body text-red-800">{msg.content}</p>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === 'assistant') {
      return (
        <div key={index} className="mb-4 animate-slide-up">
          <div className="card">
            <div className="card-body py-4 px-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="icon-primary w-7 h-7">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="label text-sm">AI Assistant</span>
              </div>
              
              <div className="body-lg mb-3">{msg.content}</div>

              {/* Render code blocks */}
              {msg.code && msg.code.length > 0 && (
                <div className="space-y-3">
                  {msg.code.map((codeBlock, codeIndex) => (
                    <div key={codeIndex} className="card border-gray-300">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                        <span className="label text-xs">Generated Code</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyToClipboard(codeBlock)}
                            className="btn-icon btn-sm text-gray-600 hover:text-orange-500"
                            title="Copy Code"
                            aria-label="Copy Code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadCode(codeBlock)}
                            className="btn-icon btn-sm text-gray-600 hover:text-orange-500"
                            title="Download Code"
                            aria-label="Download Code"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 text-xs text-gray-800 overflow-x-auto max-h-80 overflow-y-auto bg-gray-50/50 font-mono">
                        <code>{codeBlock}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Render structured data */}
              {msg.data && (
                <div className="mt-3 space-y-3">
                  {msg.data.analysis && (
                    <div className="card bg-yellow-50 border-yellow-200">
                      <div className="card-body py-3 px-4">
                        <h4 className="label text-sm text-yellow-900 mb-2 flex items-center gap-2">
                          <span>📊</span>
                          <span>Analysis</span>
                        </h4>
                        <p className="body text-yellow-800">{msg.data.analysis}</p>
                      </div>
                    </div>
                  )}
                  
                  {msg.data.changes && (
                    <div className="card bg-green-50 border-green-200">
                      <div className="card-body py-3 px-4">
                        <h4 className="label text-sm text-green-900 mb-2 flex items-center gap-2">
                          <span>✅</span>
                          <span>Changes Made</span>
                        </h4>
                        <p className="body text-green-800">{msg.data.changes}</p>
                      </div>
                    </div>
                  )}
                  
                  {msg.data.prevention && (
                    <div className="card bg-orange-50 border-orange-200">
                      <div className="card-body py-3 px-4">
                        <h4 className="label text-sm text-orange-900 mb-2 flex items-center gap-2">
                          <span>💡</span>
                          <span>Prevention Tips</span>
                        </h4>
                        <p className="body text-orange-800">{msg.data.prevention}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // User message
    return (
      <div key={index} className="mb-4 animate-slide-up flex justify-end">
        <div className="bg-orange-500 rounded-xl px-4 py-3 max-w-[80%]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span className="text-sm font-semibold text-white">You</span>
          </div>
          <p className="text-sm text-white leading-relaxed">{msg.content}</p>
        </div>
      </div>
    );
  };

  const suggestions = [
    'Create a React login form with validation',
    'Build a REST API for user management',
    'Generate a responsive navbar component',
    'Create a database schema for e-commerce'
  ];

  return (
    <div className="panel h-full">
      {/* Chat Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="icon-primary w-8 h-8">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="heading-4 text-base">AI Chat</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        {history.length === 0 ? (
          <div className="text-center mt-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-50 rounded-xl mb-4">
              <Sparkles className="w-7 h-7 text-orange-500" />
            </div>
            <h4 className="heading-3 mb-2">Start a conversation</h4>
            <p className="body text-gray-600 max-w-md mx-auto mb-6">
              Ask me to generate code, debug issues, explain concepts, or build applications
            </p>
            
            <div className="space-y-2 max-w-xl mx-auto">
              <p className="caption uppercase tracking-wider mb-3">Suggestions</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion)}
                  className="card-hover w-full text-left px-4 py-3 group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full group-hover:scale-150 transition-transform"></div>
                    <span className="body text-gray-700 group-hover:text-gray-900 font-medium">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {history.map(renderMessage)}
            {isGenerating && (
              <div className="mb-4 animate-slide-up">
                <div className="card bg-orange-50 border-orange-200">
                  <div className="card-body py-3 px-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="icon-primary w-7 h-7">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="label text-sm">AI Assistant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="loading-spinner text-orange-500"></div>
                      <span className="body-sm text-gray-700">Thinking and generating...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="panel-footer">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI to generate, debug, or explain code..."
            className="input flex-1 py-2"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!message.trim() || isGenerating}
            className="btn-primary btn-md"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
        
        <div className="flex items-center justify-between mt-2">
          <span className="caption flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold border border-gray-200">Enter</kbd>
              <span>to send</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold border border-gray-200">Shift+Enter</kbd>
              <span>new line</span>
            </span>
          </span>
          <span className={`caption ${message.length > 900 ? 'text-orange-500 font-semibold' : ''}`}>
            {message.length}/1000
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;

