import React from 'react';
import { ChevronDown, Zap, Users, Activity } from 'lucide-react';

const Header = ({ selectedModel, models, onModelChange, layout, onLayoutChange, multiAgentMode, onMultiAgentToggle }) => { // eslint-disable-line no-unused-vars
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 flex-shrink-0 shadow-lg">
      {/* Logo & Brand - Enterprise Style */}
      <div className="flex items-center gap-4">
        {/* Premium Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 blur-lg opacity-50 rounded-full"></div>
          <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} fill="white" />
          </div>
        </div>
        
        {/* Brand Name */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AI CODING NEXUS
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-wide">Enterprise Development Platform</p>
        </div>
      </div>

      {/* Controls - Professional */}
      <div className="flex items-center gap-3">
        {/* Model Selector - Premium Style */}
        <div className="relative hidden md:block">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-sm font-semibold min-w-[220px] hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id} className="bg-gray-800">
                {model.name} • {model.provider}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Multi-Agent System Badge - Premium */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all">
          <Users className="w-4 h-4" />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-xs font-bold">8-AGENT</span>
            <span className="text-[10px] opacity-90">SYSTEM</span>
          </div>
          <span className="sm:hidden text-sm font-bold">8</span>
        </div>

        {/* Status Indicator - Premium */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-bold text-white">ONLINE</span>
            <span className="text-[10px] text-gray-400">All Systems Active</span>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700">
          <Activity className="w-4 h-4 text-orange-500" />
          <div className="flex flex-col leading-none">
            <span className="text-xs font-bold text-white">READY</span>
            <span className="text-[10px] text-gray-400">High Performance</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
