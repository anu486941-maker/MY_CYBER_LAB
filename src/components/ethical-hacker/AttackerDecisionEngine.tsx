import React, { useState } from 'react';
import { HelpCircle, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Shield, Terminal } from 'lucide-react';
import { AttackerDecisionOption, IncidentState, getAttackerDecisionOptions } from '../../utils/incidentStateEngine';

interface AttackerDecisionEngineProps {
  state: IncidentState;
  onDecisionChosen: (option: AttackerDecisionOption) => void;
}

export const AttackerDecisionEngine: React.FC<AttackerDecisionEngineProps> = ({
  state,
  onDecisionChosen
}) => {
  const options = getAttackerDecisionOptions(state);
  const [selectedOption, setSelectedOption] = useState<AttackerDecisionOption | null>(null);

  const handleSelect = (opt: AttackerDecisionOption) => {
    setSelectedOption(opt);
    onDecisionChosen(opt);
  };

  return (
    <div id="attacker-decision-engine" className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/40 border border-purple-500/30 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <HelpCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-slate-100 flex items-center gap-2">
              <span>WHAT DO YOU DO NEXT?</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/40">
                Attacker Decision Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Choose an investigative, technical, or strategic next action based on discovered target telemetry.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-slate-400">Current Stage:</span>{' '}
          <span className="text-purple-300 font-bold">Stage {state.currentStage}/5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedOption?.id === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 space-y-2 relative overflow-hidden ${
                isSelected
                  ? opt.isOptimal
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                    : 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/50'
                  : 'bg-slate-950/80 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono font-bold text-slate-100 flex items-center gap-1.5">
                  {opt.label}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    opt.noiseDelta === 'LOW'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : opt.noiseDelta === 'MEDIUM'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  Noise: {opt.noiseDelta}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {opt.description}
              </p>

              {isSelected && (
                <div className="pt-2 border-t border-slate-800 space-y-2 animate-fadeIn">
                  <div className={`p-2.5 rounded-lg text-xs font-mono space-y-1 ${
                    opt.isOptimal ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/40' : 'bg-amber-950/60 text-amber-200 border border-amber-500/40'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {opt.isOptimal ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{opt.isOptimal ? 'Optimal Investigative Decision' : 'Suboptimal Decision Warning'}</span>
                    </div>
                    <p className="text-[11px] leading-normal opacity-90">{opt.feedback}</p>
                  </div>

                  {opt.nextSuggestedCommand && (
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-purple-400" />
                        <span>Suggested Command:</span>
                      </span>
                      <code className="text-purple-300 font-bold text-[11px]">{opt.nextSuggestedCommand}</code>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
