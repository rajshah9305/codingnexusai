import React, { useState } from 'react';
import { Users, Activity, CheckCircle, Clock, Zap, Shield, TestTube, FileText, Cpu, Bug } from 'lucide-react';

/**
 * Multi-Agent Dashboard Component
 * Displays agent status, metrics, and orchestration visualization
 */
const AgentDashboard = ({ agents, activeAgents, metrics, executionPlan }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);

  const agentIcons = {
    supervisor: Users,
    codeGenerator: Cpu,
    testingAgent: TestTube,
    securityAgent: Shield,
    performanceAgent: Zap,
    documentationAgent: FileText,
    architectAgent: Activity,
    debugAgent: Bug
  };

  const getAgentIcon = (agentId) => {
    const Icon = agentIcons[agentId] || Activity;
    return <Icon className="w-5 h-5" />;
  };

  const getAgentStatus = (agentId) => {
    if (!activeAgents || activeAgents.length === 0) return 'idle';
    if (activeAgents.includes(agentId)) return 'active';
    if (executionPlan?.requiredAgents?.includes(agentId)) return 'pending';
    return 'idle';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-orange-50 border-orange-500 text-orange-700';
      case 'pending':
        return 'bg-yellow-50 border-yellow-500 text-yellow-700';
      case 'completed':
        return 'bg-green-50 border-green-500 text-green-700';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4 animate-pulse" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex items-center bg-white px-3 py-2 overflow-x-auto">
      {/* Ultra Compact Horizontal Agent Bar */}
      <div className="flex items-center gap-2 min-w-max">
        {/* System Info */}
        <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
          <Users className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-semibold text-gray-900">{agents?.length || 0} Agents</span>
          {metrics && (
            <span className="text-xs text-gray-600">• {metrics.totalExecutions || 0} tasks</span>
          )}
        </div>

        {/* Agent Pills */}
        {agents && agents.slice(0, 8).map((agent) => {
          const status = getAgentStatus(agent.id);
          const isActive = status === 'active';

          return (
            <div
              key={agent.id}
              title={`${agent.role} - ${agent.goal}`}
              className={`
                flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer
                ${isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-600 shadow-sm' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                }
              `}
            >
              <div className={isActive ? 'text-white' : 'text-gray-600'}>
                {getAgentIcon(agent.id)}
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">
                {agent.role.replace(' Agent', '').replace('Solution ', '')}
              </span>
              {isActive && (
                <Activity className="w-3 h-3 animate-pulse" />
              )}
            </div>
          );
        })}

        {/* Execution Plan Indicator */}
        {executionPlan && (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="px-2 py-1 bg-orange-50 rounded-md border border-orange-300">
              <span className="text-xs font-semibold text-orange-700">
                {executionPlan.taskType} • {executionPlan.complexity}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;

