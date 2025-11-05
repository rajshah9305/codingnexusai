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
    <div className="h-full flex flex-col bg-white">
      {/* Compact Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Multi-Agent System</h2>
            <p className="text-xs text-gray-600 mt-0.5">
              {agents?.length || 0} agents • {activeAgents?.length || 0} active
            </p>
          </div>
          {metrics && (
            <div className="flex gap-3">
              <div className="text-center px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-400">
                <div className="text-lg font-bold text-orange-600">{metrics.totalExecutions || 0}</div>
                <div className="text-xs text-orange-700 font-medium">Tasks</div>
              </div>
              <div className="text-center px-3 py-1.5 bg-green-50 rounded-lg border border-green-400">
                <div className="text-lg font-bold text-green-600">{activeAgents?.length || 0}</div>
                <div className="text-xs text-green-700 font-medium">Active</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Execution Plan Visualization */}
      {executionPlan && (
        <div className="px-6 py-4 bg-orange-50 border-b border-orange-200">
          <h3 className="text-sm font-bold text-black mb-2">Current Execution Plan</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-white rounded-md text-gray-700">
              Type: <span className="font-semibold">{executionPlan.taskType}</span>
            </span>
            <span className="px-2 py-1 bg-white rounded-md text-gray-700">
              Complexity: <span className="font-semibold">{executionPlan.complexity}</span>
            </span>
            <span className="px-2 py-1 bg-white rounded-md text-gray-700">
              Agents: <span className="font-semibold">{executionPlan.requiredAgents?.length || 0}</span>
            </span>
            <span className="px-2 py-1 bg-white rounded-md text-gray-700">
              ETA: <span className="font-semibold">{executionPlan.estimatedTime}</span>
            </span>
          </div>
        </div>
      )}

      {/* Agent Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {agents && agents.map((agent) => {
            const status = getAgentStatus(agent.id);
            const isSelected = selectedAgent?.id === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`
                  p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${isSelected ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'}
                `}
              >
                {/* Agent Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${status === 'active' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {getAgentIcon(agent.id)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-black">{agent.role}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{agent.id}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs font-semibold border-2 flex items-center gap-1 ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span>{status}</span>
                  </div>
                </div>

                {/* Agent Info */}
                <p className="text-xs text-gray-700 mb-3 line-clamp-2">{agent.goal}</p>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities?.slice(0, 3).map((cap, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {cap.replace('_', ' ')}
                    </span>
                  ))}
                  {agent.capabilities?.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{agent.capabilities.length - 3}
                    </span>
                  )}
                </div>

                {/* Usage Metric */}
                {metrics?.agentUsage?.[agent.id] && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Times Used</span>
                      <span className="font-bold text-orange-600">{metrics.agentUsage[agent.id]}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Agent Details */}
      {selectedAgent && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-black">{selectedAgent.role}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedAgent.goal}</p>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.capabilities?.map((cap, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg"
                  >
                    {cap.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {executionPlan?.executionSequence?.find(task => task.agent === selectedAgent.id) && (
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Current Task</h4>
                <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                  {executionPlan.executionSequence.find(task => task.agent === selectedAgent.id).task}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;

