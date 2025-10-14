import React from 'react';
import { ChevronDown, Layout, Code, Eye, Zap, Users } from 'lucide-react';

const Header = ({ selectedModel, models, onModelChange, layout, onLayoutChange, multiAgentMode, onMultiAgentToggle }) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200 flex-shrink-0">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="icon-primary w-10 h-10">
          <Zap className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="heading-4 leading-tight">RAJ AI CODING TOOL</h1>
          <p className="caption">Powered by AWS Bedrock & Claude</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Model Selector */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="select pr-10 py-2 text-sm font-semibold min-w-[200px]"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Layout Controls */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onLayoutChange('split')}
            className={`btn-icon transition-all ${
              layout === 'split' 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
            title="Split View"
            aria-label="Split View"
          >
            <Layout className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLayoutChange('editor')}
            className={`btn-icon transition-all ${
              layout === 'editor' 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
            title="Editor Only"
            aria-label="Editor Only"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLayoutChange('preview')}
            className={`btn-icon transition-all ${
              layout === 'preview' 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
            title="Preview Only"
            aria-label="Preview Only"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Agent Toggle */}
        <button
          onClick={onMultiAgentToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all font-semibold text-sm ${
            multiAgentMode
              ? 'bg-orange-500 text-white border-orange-500 shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
          }`}
          title={multiAgentMode ? 'Multi-Agent Mode Active' : 'Single Agent Mode'}
        >
          <Users className="w-4 h-4" />
          <span>{multiAgentMode ? 'Multi-Agent' : 'Single'}</span>
        </button>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="status-online"></div>
          <span className="text-sm font-semibold text-gray-900">Connected</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
