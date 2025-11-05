import React from 'react';
import { ChevronDown, Layout, Code, Eye, Zap, Users } from 'lucide-react';

const Header = ({ selectedModel, models, onModelChange, layout, onLayoutChange, multiAgentMode, onMultiAgentToggle }) => {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="icon-primary w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
          <Zap className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-gray-900">
            AI CODING NEXUS
          </h1>
        </div>
        <div className="sm:hidden">
          <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900">
            AI NEXUS
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Model Selector - Hidden on mobile */}
        <div className="relative hidden md:block">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="select pr-10 py-2 text-xs md:text-sm font-semibold min-w-[150px] md:min-w-[200px]"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Layout Controls - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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

        {/* Multi-Agent Badge */}
        <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md font-semibold text-xs md:text-sm">
          <Users className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">8-Agent System</span>
          <span className="sm:hidden">8 Agents</span>
        </div>

        {/* Status Indicator - Hidden on small screens */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="status-online"></div>
          <span className="text-sm font-semibold text-gray-900">Connected</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
