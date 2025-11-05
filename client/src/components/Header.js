import React from 'react';
import { ChevronDown, Zap, Users, Activity } from 'lucide-react';

const Header = ({ selectedModel, models, onModelChange, layout, onLayoutChange, multiAgentMode, onMultiAgentToggle }) => { // eslint-disable-line no-unused-vars
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-orange-500 flex-shrink-0 shadow-md">
      {/* Logo & Brand - Clear & Readable */}
      <div className="flex items-center gap-4">
        {/* Clear Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="w-7 h-7 text-white" strokeWidth={2.5} fill="white" />
        </div>
        
        {/* Brand Name - High Contrast */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-gray-900">
            AI CODING NEXUS
          </h1>
          <p className="text-xs text-gray-600 font-semibold tracking-wide uppercase">Enterprise Development Platform</p>
        </div>
      </div>

      {/* Controls - Professional */}
      <div className="flex items-center gap-3">
        {/* Model Selector - Clear & Readable */}
        <div className="relative hidden md:block">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="appearance-none bg-white text-gray-900 border-2 border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-semibold min-w-[220px] hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer shadow-sm"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id} className="bg-white text-gray-900">
                {model.name} • {model.provider}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
        </div>

        {/* Multi-Agent System Badge - High Contrast */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all">
          <Users className="w-5 h-5" strokeWidth={2.5} />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-sm font-bold">8-AGENT</span>
            <span className="text-xs font-semibold">SYSTEM</span>
          </div>
          <span className="sm:hidden text-sm font-bold">8</span>
        </div>

        {/* Status Indicator - Clear */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-green-50 rounded-lg border-2 border-green-500">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-green-700">ONLINE</span>
            <span className="text-xs text-green-600 font-medium">All Systems Active</span>
          </div>
        </div>

        {/* Performance Indicator - Clear */}
        <div className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-orange-50 rounded-lg border-2 border-orange-500">
          <Activity className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-orange-700">READY</span>
            <span className="text-xs text-orange-600 font-medium">High Performance</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
