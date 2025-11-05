import React from 'react';
import { ChevronDown, Zap, Users, Activity } from 'lucide-react';

const Header = ({ selectedModel, models, onModelChange, layout, onLayoutChange, multiAgentMode, onMultiAgentToggle }) => { // eslint-disable-line no-unused-vars
  return (
    <header className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200 flex-shrink-0">
      {/* Logo & Brand - Ultra Compact */}
      <div className="flex items-center gap-2">
        {/* Icon */}
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} fill="white" />
        </div>
        
        {/* Brand Name */}
        <div>
          <h1 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
            AI Coding Nexus
          </h1>
          <p className="text-xs text-gray-500 font-medium hidden sm:block leading-tight">Multi-Agent</p>
        </div>
      </div>

      {/* Controls - Ultra Compact */}
      <div className="flex items-center gap-1.5">
        {/* Model Selector - Compact */}
        <div className="relative hidden md:block">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="appearance-none bg-white text-gray-900 border border-gray-300 rounded-lg px-2.5 py-1 pr-7 text-xs font-medium min-w-[160px] hover:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id} className="bg-white text-gray-900">
                {model.name} • {model.provider}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>

        {/* Multi-Agent System Badge - Compact */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <Users className="w-3.5 h-3.5" strokeWidth={2} />
          <span className="text-xs font-semibold">8 Agents</span>
        </div>

        {/* Status Indicator - Compact */}
        <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-green-50 rounded-lg border border-green-400">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-green-700">Online</span>
        </div>

        {/* Performance Indicator - Compact */}
        <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 bg-orange-50 rounded-lg border border-orange-400">
          <Activity className="w-3.5 h-3.5 text-orange-600" strokeWidth={2} />
          <span className="text-xs font-semibold text-orange-700">Ready</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
