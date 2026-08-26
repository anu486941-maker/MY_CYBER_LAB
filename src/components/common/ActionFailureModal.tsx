import React from 'react';
import { AlertTriangle, ShieldX, HelpCircle, X, Sparkles } from 'lucide-react';
import { ActionFailureInfo } from '../../utils/incidentStateEngine';

interface ActionFailureModalProps {
  failureInfo: ActionFailureInfo;
  onClose: () => void;
}

export const ActionFailureModal: React.FC<ActionFailureModalProps> = ({
  failureInfo,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-rose-500/40 shadow-2xl space-y-4 text-slate-100 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 text-rose-400">
            <ShieldX className="w-6 h-6" />
            <h3 className="text-base font-bold">ACTION BLOCKED / FAILED</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
            <span className="text-rose-300 font-bold uppercase text-[11px]">WHY IT FAILED:</span>
            <p className="text-rose-100">{failureInfo.why}</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <span className="text-amber-300 font-bold uppercase text-[11px]">WHAT CHANGED IN THE ENVIRONMENT:</span>
            <p className="text-amber-100">{failureInfo.whatChanged}</p>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1">
            <span className="text-blue-300 font-bold uppercase text-[11px]">WHAT YOU LEARNED:</span>
            <p className="text-blue-100">{failureInfo.whatYouLearned}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AMAN Socratic Question</span>
            </div>
            <p className="text-slate-200 italic">{failureInfo.amanSocraticQuestion}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-all"
        >
          Acknowledge & Adapt Strategy
        </button>
      </div>
    </div>
  );
};
