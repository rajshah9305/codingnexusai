import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Loader2, AlertCircle, Activity } from 'lucide-react';

/**
 * Agent Collaboration Visualization Component
 * Shows real-time agent collaboration and task execution flow
 */
const AgentCollaboration = ({ executionPlan, activeStep, agentResults, isExecuting }) => {
  const [expandedAgent, setExpandedAgent] = useState(null);

  if (!executionPlan) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <Activity className="w-20 h-20 text-gray-400 mx-auto mb-4" strokeWidth={2} />
          <p className="text-gray-900 text-lg font-bold">No active collaboration</p>
          <p className="text-gray-600 text-base mt-2 font-medium">Start a multi-agent task to see the collaboration flow</p>
        </div>
      </div>
    );
  }

  const getStepStatus = (index, agentId) => {
    if (agentResults && agentResults[agentId]) {
      return 'completed';
    }
    if (activeStep === index) {
      return 'active';
    }
    if (activeStep > index) {
      return 'completed';
    }
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'active':
        return 'border-orange-500 bg-orange-50';
      case 'pending':
        return 'border-gray-300 bg-gray-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Compact Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Agent Collaboration</h2>
            <p className="text-xs text-gray-600 mt-0.5">
              {executionPlan.executionSequence?.length || 0} tasks
            </p>
          </div>
          {isExecuting && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-400 rounded-lg">
              <Loader2 className="w-4 h-4 text-orange-600 animate-spin" strokeWidth={2} />
              <span className="text-sm font-medium text-orange-600">Executing</span>
            </div>
          )}
        </div>
      </div>

      {/* Execution Flow */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {executionPlan.executionSequence?.map((task, index) => {
            const status = getStepStatus(index, task.agent);
            const isExpanded = expandedAgent === task.agent;
            const result = agentResults?.[task.agent];

            return (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < executionPlan.executionSequence.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200" />
                )}

                {/* Task Card */}
                <div
                  className={`
                    border-2 rounded-xl overflow-hidden transition-all
                    ${getStepColor(status)}
                    ${isExpanded ? 'shadow-lg' : 'shadow-sm'}
                  `}
                >
                  {/* Task Header */}
                  <div
                    onClick={() => setExpandedAgent(isExpanded ? null : task.agent)}
                    className="p-4 cursor-pointer hover:bg-opacity-80 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(status)}
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-500">
                            STEP {index + 1}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-white rounded-md text-gray-700 font-semibold">
                            Priority {task.priority}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-black mb-1">
                          {task.agent.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {task.task}
                        </p>

                        {/* Dependencies */}
                        {task.dependencies && task.dependencies.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-gray-500">Depends on:</span>
                            <div className="flex gap-1">
                              {task.dependencies.map((dep, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-xs text-gray-600"
                                >
                                  {dep}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Expand Indicator */}
                      <div className="flex-shrink-0">
                        <ArrowRight
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && result && (
                    <div className="border-t border-gray-200 bg-white p-4 space-y-4">
                      {/* Agent Output */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">
                          Agent Output
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {result.explanation?.substring(0, 500)}
                            {result.explanation?.length > 500 && '...'}
                          </p>
                        </div>
                      </div>

                      {/* Code Output */}
                      {result.output && result.output.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">
                            Generated Code ({result.output.length} file{result.output.length > 1 ? 's' : ''})
                          </h4>
                          <div className="space-y-2">
                            {result.output.slice(0, 2).map((code, idx) => (
                              <div
                                key={idx}
                                className="bg-gray-900 rounded-lg p-3 overflow-x-auto"
                              >
                                <pre className="text-xs text-green-400 font-mono">
                                  {code.substring(0, 300)}
                                  {code.length > 300 && '\n...'}
                                </pre>
                              </div>
                            ))}
                            {result.output.length > 2 && (
                              <p className="text-xs text-gray-500 text-center">
                                + {result.output.length - 2} more files
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                        <div>
                          <span className="text-xs text-gray-500">Model</span>
                          <p className="text-sm font-semibold text-gray-700">{result.metadata?.model}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Timestamp</span>
                          <p className="text-sm font-semibold text-gray-700">
                            {result.metadata?.timestamp ? new Date(result.metadata.timestamp).toLocaleTimeString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      {agentResults && Object.keys(agentResults).length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  {Object.keys(agentResults).length} / {executionPlan.executionSequence?.length} completed
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <span className="text-xs text-gray-500">
                {executionPlan.estimatedTime || 'Calculating...'}
              </span>
            </div>
            
            {Object.keys(agentResults).length === executionPlan.executionSequence?.length && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">All Tasks Complete</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCollaboration;

