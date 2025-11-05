import React from 'react';
import { ChevronDown, Zap, Users, Activity } from 'lucide-react';

const Header = ({ selectedModel, models, onModelChange, layout, onLayoutChange, multiAgentMode, onMultiAgentToggle }) => { // eslint-disable-line no-unused-vars
  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 flex-shrink-0">
      {/* Logo & Brand - Compact */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" strokeWidth={2.5} fill="white" />
        </div>
        
        {/* Brand Name */}
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            AI Coding Nexus
          </h1>
          <p className="text-xs text-gray-500 font-medium hidden sm:block">Multi-Agent Development</p>
        </div>
      </div>

      {/* Controls - Compact */}
      <div className="flex items-center gap-2">
        {/* Model Selector - Compact */}
        <div className="relative hidden md:block">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="appearance-none bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium min-w-[180px] hover:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id} className="bg-white text-gray-900">
                {model.name} • {model.provider}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Multi-Agent System Badge - Compact */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <Users className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm font-semibold">8 Agents</span>
        </div>

        {/* Status Indicator - Compact */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg border border-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-green-700">Online</span>
        </div>

        {/* Performance Indicator - Compact */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-400">
          <Activity className="w-4 h-4 text-orange-600" strokeWidth={2} />
          <span className="text-sm font-semibold text-orange-700">Ready</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
