import React, { useState } from 'react';
import { 
  Zap, 
  Code, 
  Bug, 
  HelpCircle, 
  Wrench, 
  Database, 
  Globe, 
  Layers,
  Sparkles,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const Sidebar = ({ onGenerate, onDebug, isGenerating, multiAgentMode, compact = false }) => { // eslint-disable-line no-unused-vars
  const [expandedSections, setExpandedSections] = useState(['generate', 'tools']);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const quickActions = [
    {
      id: 'react-component',
      label: 'React Component',
      icon: Code,
      prompt: 'Create a modern React component with',
      type: 'component'
    },
    {
      id: 'api-endpoint',
      label: 'API Endpoint',
      icon: Globe,
      prompt: 'Generate an Express.js API endpoint for',
      type: 'component'
    },
    {
      id: 'database-model',
      label: 'Database Model',
      icon: Database,
      prompt: 'Create a database model/schema for',
      type: 'component'
    },
    {
      id: 'fullstack-app',
      label: 'Full-Stack App',
      icon: Layers,
      prompt: 'Build a complete full-stack application for',
      type: 'fullstack'
    }
  ];

  const tools = [
    {
      id: 'debug',
      label: 'Debug Code',
      icon: Bug,
      description: 'Find and fix issues',
      action: () => {
        const issue = prompt('Describe the issue you\'re experiencing:');
        if (issue) onDebug(issue);
      }
    },
    {
      id: 'explain',
      label: 'Explain Code',
      icon: HelpCircle,
      description: 'Get detailed explanations',
      action: () => onGenerate('Explain this code in detail', 'explain')
    },
    {
      id: 'optimize',
      label: 'Optimize',
      icon: Sparkles,
      description: 'Improve performance',
      action: () => onGenerate('Optimize this code for better performance and readability', 'component')
    },
    {
      id: 'fix',
      label: 'Auto Fix',
      icon: Wrench,
      description: 'Fix common issues',
      action: () => {
        const error = prompt('Paste the error message:');
        if (error) onGenerate(error, 'fix');
      }
    }
  ];

  // Removed integrations - not currently used
  // const integrations = [
  //   { id: 'auth', label: 'Authentication', icon: '🔐' },
  //   { id: 'payment', label: 'Payment Gateway', icon: '💳' },
  //   { id: 'database', label: 'Database Setup', icon: '🗄️' },
  //   { id: 'api', label: 'External API', icon: '🌐' }
  // ];

  const handleQuickAction = (action) => {
    const userInput = prompt(`${action.prompt}:`);
    if (userInput) {
      // Always use multi-agent options
      const options = {
        includeTests: true,
        includeSecurity: true,
        includePerformance: false,
        includeDocs: true
      };
      onGenerate(`${action.prompt} ${userInput}`, action.type, options);
    }
  };

  // Compact Section Header Component
  const SectionHeader = ({ title, section, icon: Icon }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-4 py-2.5 text-left bg-white hover:bg-gray-50 transition-all group border-b border-gray-200"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
      </div>
      <div className="w-6 h-6 bg-gray-100 group-hover:bg-orange-50 rounded-md flex items-center justify-center transition-all">
        {expandedSections.includes(section) ? (
          <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-orange-600 transition-colors" strokeWidth={2} />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-orange-600 transition-colors" strokeWidth={2} />
        )}
      </div>
    </button>
  );

  // Clear sidebar content
  const renderContent = () => (
    <>
      {/* Quick Actions Section - Compact */}
      <div className="border-b border-gray-200">
        <SectionHeader title="Quick Actions" section="generate" icon={Zap} />
        {expandedSections.includes('generate') && (
          <div className="px-3 py-2 space-y-2 bg-white">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                disabled={isGenerating}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left rounded-lg bg-white hover:bg-orange-50 border border-gray-300 hover:border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 rounded-lg flex items-center justify-center transition-all">
                  <action.icon className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tools Section - Compact */}
      <div className="border-b border-gray-200">
        <SectionHeader title="Code Tools" section="tools" icon={Wrench} />
        {expandedSections.includes('tools') && (
          <div className="px-3 py-2 space-y-2 bg-white">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={tool.action}
                disabled={isGenerating}
                className="w-full flex items-start gap-2 px-3 py-2.5 text-left rounded-lg bg-white hover:bg-gray-50 border border-gray-300 hover:border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-all">
                  <tool.icon className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">{tool.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{tool.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Compact floating button for mobile
  if (compact) {
    return (
      <>
        {/* Floating Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Open AI Tools"
        >
          <Sparkles className="w-6 h-6" />
        </button>

        {/* Floating Panel */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <div className="fixed bottom-20 right-4 w-80 max-h-[70vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-slide-up">
              <div className="panel-header">
                <div className="flex items-center gap-2">
                  <div className="icon-primary w-8 h-8">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="heading-4 text-base">AI Tools</h2>
                    <p className="text-xs text-orange-600 font-semibold">8-Agent System</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {renderContent()}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <aside className="w-full bg-white flex flex-col flex-shrink-0">
      {/* Compact Tools Header */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          {/* Icon */}
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          
          {/* Title */}
          <div>
            <h2 className="text-base font-semibold text-gray-900">AI Tools</h2>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-orange-600 font-medium">8 Agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">{renderContent()}</div>

      {/* Status - Only show when generating */}
      {isGenerating && (
        <div className="px-4 py-2 border-t border-gray-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">Generating...</span>
            </div>
            <div className="loading-spinner text-orange-500"></div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
