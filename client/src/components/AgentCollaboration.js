import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Loader2, AlertCircle, Activity } from 'lucide-react';

/**
 * Agent Collaboration Visualization Component
 * Shows real-time agent collaboration and task execution flow
 */
const AgentCollaboration = ({ executionPlan, activeStep, agentResults, isExecuting }) => {
  if (!executionPlan) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 px-3">
        <div className="text-center">
          <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" strokeWidth={2} />
          <p className="text-xs text-gray-600 font-medium">Start a task to see collaboration</p>
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

  return (
    <div className="h-full flex items-center bg-white px-3 py-2 overflow-x-auto">
      {/* Ultra Compact Horizontal Flow */}
      <div className="flex items-center gap-2 min-w-max">
        {/* Header */}
        <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
          <Activity className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-semibold text-gray-900">
            {executionPlan.executionSequence?.length || 0} Steps
          </span>
          {isExecuting && (
            <Loader2 className="w-3.5 h-3.5 text-orange-600 animate-spin" />
          )}
        </div>

        {/* Task Pills */}
        {executionPlan.executionSequence?.map((task, index) => {
          const status = getStepStatus(index, task.agent);
          
          return (
            <React.Fragment key={index}>
              <div
                title={task.task}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all
                  ${status === 'completed' ? 'bg-green-50 border-green-500 text-green-700' :
                    status === 'active' ? 'bg-orange-50 border-orange-500 text-orange-700' :
                    'bg-gray-50 border-gray-300 text-gray-600'}
                `}
              >
                <div className="flex-shrink-0">
                  {status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                   status === 'active' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                   <Clock className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-semibold whitespace-nowrap">
                  {task.agent.replace(/([A-Z])/g, ' $1').trim().replace(' Agent', '')}
                </span>
              </div>
              {index < executionPlan.executionSequence.length - 1 && (
                <ArrowRight className="w-3 h-3 text-gray-400" />
              )}
            </React.Fragment>
          );
        })}

        {/* Summary */}
        {agentResults && Object.keys(agentResults).length > 0 && (
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <span className="text-xs text-gray-600">
              {Object.keys(agentResults).length}/{executionPlan.executionSequence?.length}
            </span>
            {Object.keys(agentResults).length === executionPlan.executionSequence?.length && (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCollaboration;

