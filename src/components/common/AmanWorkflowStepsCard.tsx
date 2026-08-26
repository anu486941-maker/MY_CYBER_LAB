import React from 'react';
import { AgentStep } from '../../aman/amanTools';
import { CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react';

interface AmanWorkflowStepsCardProps {
  steps: AgentStep[];
}

export const AmanWorkflowStepsCard: React.FC<AmanWorkflowStepsCardProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="my-3 p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 backdrop-blur-sm space-y-2.5">
      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
        <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
          ⚡ Multi-Step Agent Pipeline
        </span>
        <span className="text-[10px] font-mono text-indigo-400">
          {steps.filter(s => s.status === 'COMPLETED').length} / {steps.length} Steps
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step) => (
          <div 
            key={step.stepNumber} 
            className="flex items-start gap-2.5 text-xs font-mono"
          >
            <div className="mt-0.5 shrink-0">
              {step.status === 'COMPLETED' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              {step.status === 'RUNNING' && (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              )}
              {step.status === 'FAILED' && (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              {step.status === 'PENDING' && (
                <Clock className="w-4 h-4 text-slate-500" />
              )}
            </div>

            <div className="flex-1">
              <span className={`${
                step.status === 'COMPLETED' ? 'text-slate-200' :
                step.status === 'RUNNING' ? 'text-cyan-300 font-bold' :
                step.status === 'FAILED' ? 'text-rose-300' :
                'text-slate-400'
              }`}>
                [{step.stepNumber}] {step.description}
              </span>
              {step.resultSummary && (
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  ↳ {step.resultSummary}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
