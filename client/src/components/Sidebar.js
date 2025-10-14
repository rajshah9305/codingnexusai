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

const Sidebar = ({ onGenerate, onDebug, isGenerating }) => {
  const [expandedSections, setExpandedSections] = useState(['generate', 'tools']);

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

  const integrations = [
    { id: 'auth', label: 'Authentication', icon: '🔐' },
    { id: 'payment', label: 'Payment Gateway', icon: '💳' },
    { id: 'database', label: 'Database Setup', icon: '🗄️' },
    { id: 'api', label: 'External API', icon: '🌐' }
  ];

  const handleQuickAction = (action) => {
    const userInput = prompt(`${action.prompt}:`);
    if (userInput) {
      onGenerate(`${action.prompt} ${userInput}`, action.type);
    }
  };

  const SectionHeader = ({ title, section, icon: Icon }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-orange-500" strokeWidth={2} />
        <span className="label text-sm">{title}</span>
      </div>
      {expandedSections.includes(section) ? (
        <ChevronDown className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <aside className="w-64 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="icon-primary w-8 h-8">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="heading-4 text-base">AI Tools</h2>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick Generate Section */}
        <div className="border-b border-gray-200">
          <SectionHeader title="Quick Generate" section="generate" icon={Zap} />
          
          {expandedSections.includes('generate') && (
            <div className="px-3 py-2 space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  disabled={isGenerating}
                  className="w-full flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="icon-primary w-8 h-8 group-hover:bg-orange-600">
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tools Section */}
        <div className="border-b border-gray-200">
          <SectionHeader title="Code Tools" section="tools" icon={Wrench} />
          
          {expandedSections.includes('tools') && (
            <div className="px-3 py-2 space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={tool.action}
                  disabled={isGenerating}
                  className="w-full text-left px-3 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="icon-secondary w-7 h-7 group-hover:bg-orange-500 group-hover:text-white">
                      <tool.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{tool.label}</span>
                  </div>
                  <p className="body-sm ml-9">{tool.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Integrations Section */}
        <div className="border-b border-gray-200">
          <SectionHeader title="Integrations" section="integrations" icon={Layers} />
          
          {expandedSections.includes('integrations') && (
            <div className="px-3 py-2 space-y-2">
              {integrations.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => onGenerate(`Generate ${integration.label.toLowerCase()} integration`, 'component')}
                  disabled={isGenerating}
                  className="w-full flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 group-hover:bg-orange-500 rounded-lg transition-colors">
                    <span className="text-base group-hover:scale-110 transition-transform">{integration.icon}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{integration.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status - Only show when generating */}
      {isGenerating && (
        <div className="panel-footer bg-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="status-busy"></div>
              <span className="text-sm font-semibold text-gray-900">Generating...</span>
            </div>
            <div className="loading-spinner text-orange-500"></div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
