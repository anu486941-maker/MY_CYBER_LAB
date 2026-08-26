import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Zap, 
  Terminal, 
  Award,
  AlertCircle
} from 'lucide-react';
import { Mission } from '../../types';
import { StatusBadge } from './StatusBadge';

export interface MissionProgressTrackerProps {
  mission: Mission;
  variant?: 'detailed' | 'compact' | 'stepper';
  onToggleObjective?: (missionId: string, objectiveId: string) => void;
  interactive?: boolean;
  showHints?: boolean;
  className?: string;
}

export const MissionProgressTracker: React.FC<MissionProgressTrackerProps> = ({
  mission,
  variant = 'detailed',
  onToggleObjective,
  interactive = true,
  showHints = true,
  className = ''
}) => {
  const [expandedHintId, setExpandedHintId] = useState<string | null>(null);
  const [copiedHintId, setCopiedHintId] = useState<string | null>(null);

  const totalObjectives = mission.objectives.length;
  const completedObjectives = mission.objectives.filter(o => o.completed).length;
  const percentage = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;
  const isComplete = percentage === 100;
  const xpPerObjective = totalObjectives > 0 ? Math.round(mission.xp / totalObjectives) : 0;

  // First non-completed objective is the "current active step"
  const currentStepIndex = mission.objectives.findIndex(o => !o.completed);

  const handleCopyHint = (e: React.MouseEvent, hintText: string, objId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hintText);
    setCopiedHintId(objId);
    setTimeout(() => setCopiedHintId(null), 2000);
  };

  const toggleHint = (e: React.MouseEvent, objId: string) => {
    e.stopPropagation();
    setExpandedHintId(prev => prev === objId ? null : objId);
  };

  /* -------------------------------------------------------------
     COMPACT VARIANT (Used for Mission Cards, Dashboard, Mini-Bars)
     ------------------------------------------------------------- */
  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'}`} />
            <span>PROGRESS:</span>
            <span className="text-slate-200 font-bold">{completedObjectives}/{totalObjectives} SUB-TASKS</span>
          </span>
          <span className={`font-bold ${isComplete ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {percentage}%
          </span>
        </div>

        {/* Progress Track */}
        <div 
          className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isComplete
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Mini dot step indicator */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {mission.objectives.map((obj, idx) => (
            <div
              key={obj.id}
              title={`${obj.title}: ${obj.completed ? 'Completed' : 'Pending'}`}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                obj.completed
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                  : idx === currentStepIndex
                  ? 'bg-cyan-400 animate-pulse'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     STEPPER VARIANT (Pipeline progression view)
     ------------------------------------------------------------- */
  if (variant === 'stepper') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Header telemetry */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400">OPERATION PIPELINE</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              isComplete ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' : 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40'
            }`}>
              {percentage}% DONE
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            {completedObjectives} of {totalObjectives} cleared
          </div>
        </div>

        {/* Connected Step Nodes */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {mission.objectives.map((obj, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={obj.id} className="relative group">
                {/* Node circle */}
                <div 
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all border ${
                    obj.completed
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : isCurrent
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-4 ring-cyan-500/20 animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {obj.completed ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                </div>

                <div 
                  onClick={() => interactive && onToggleObjective && onToggleObjective(mission.id, obj.id)}
                  className={`p-3 rounded-xl border transition-all ${interactive ? 'cursor-pointer' : ''} ${
                    obj.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : isCurrent
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`text-xs font-mono font-bold ${obj.completed ? 'text-emerald-300 line-through' : isCurrent ? 'text-cyan-200' : 'text-slate-300'}`}>
                        {obj.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">{obj.description}</p>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 shrink-0">
                      +{xpPerObjective} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     DETAILED VARIANT (Full feature set for MissionModal / Details)
     ------------------------------------------------------------- */
  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Visual Progress Header Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-xl space-y-4">
        
        {/* Top Header metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                OBJECTIVE EXECUTION PROGRESS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {completedObjectives}/{totalObjectives} SUB-TASKS
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              {isComplete 
                ? 'All objectives satisfied. Mission cleared and ready for reward claim.' 
                : currentStepIndex >= 0 
                ? `Current Focus: Sub-task #${currentStepIndex + 1} — "${mission.objectives[currentStepIndex]?.title}"` 
                : 'Execute each tactical directive in sequential order.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-500 uppercase">COMPLETION</div>
              <div className={`text-xl sm:text-2xl font-black ${
                isComplete ? 'text-emerald-400' : 'text-cyan-400'
              }`}>
                {percentage}%
              </div>
            </div>

            {/* Circular status icon */}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
              isComplete
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
            }`}>
              {isComplete ? (
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Terminal className="w-5 h-5 animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Multi-segmented Progress Bar with Dynamic Coloration */}
        <div className="space-y-1.5">
          <div 
            className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800/80 shadow-inner"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 relative ${
                isComplete
                  ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              }`}
              style={{ width: `${percentage}%` }}
            >
              {/* Scanline shimmer effect */}
              <div className="absolute inset-0 bg-white/20 opacity-30 animate-pulse rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>0% (INITIATION)</span>
            <span className="text-cyan-400/90 font-bold">{completedObjectives} of {totalObjectives} Completed</span>
            <span>100% (TARGET CLEARED)</span>
          </div>
        </div>

      </div>

      {/* Sub-Tasks Matrix List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span className="uppercase font-bold text-slate-300">SUB-TASK DIRECTIVES</span>
          {interactive && (
            <span className="text-[11px] text-slate-500">Click directive card to toggle status</span>
          )}
        </div>

        {mission.objectives.map((obj, index) => {
          const isObjCompleted = obj.completed;
          const isCurrentActive = index === currentStepIndex && !isObjCompleted;
          const isHintExpanded = expandedHintId === obj.id;
          const isCopied = copiedHintId === obj.id;

          return (
            <div
              key={obj.id}
              onClick={() => interactive && onToggleObjective && onToggleObjective(mission.id, obj.id)}
              className={`p-4 rounded-xl border transition-all text-left group ${
                interactive ? 'cursor-pointer' : ''
              } ${
                isObjCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)]'
                  : isCurrentActive
                  ? 'bg-slate-900/90 border-cyan-500 shadow-[0_0_18px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  
                  {/* Status Box Icon */}
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isObjCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                        : isCurrentActive
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/30'
                        : 'bg-slate-900 border-slate-700 text-slate-500 group-hover:border-slate-600'
                    }`}
                  >
                    {isObjCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrentActive ? (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <span className="text-[10px] font-mono font-bold">{index + 1}</span>
                    )}
                  </div>

                  {/* Objective Text and Metadata */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        TASK 0{index + 1}
                      </span>

                      {isObjCompleted ? (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-bold">
                          ✓ COMPLETED
                        </span>
                      ) : isCurrentActive ? (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold animate-pulse">
                          ● CURRENT STEP
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-500">
                          PENDING
                        </span>
                      )}

                      <span className="text-[10px] font-mono text-cyan-400/80">
                        +{xpPerObjective} XP
                      </span>
                    </div>

                    <h4 className={`font-mono font-bold text-xs sm:text-sm ${
                      isObjCompleted 
                        ? 'text-emerald-300 line-through opacity-90' 
                        : isCurrentActive
                        ? 'text-slate-100'
                        : 'text-slate-300'
                    }`}>
                      {obj.title}
                    </h4>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {obj.description}
                    </p>
                  </div>
                </div>

                {/* Hint Expander Toggle Button */}
                {showHints && obj.hint && (
                  <div className="shrink-0 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => toggleHint(e, obj.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-all border ${
                        isHintExpanded
                          ? 'bg-cyan-950 border-cyan-500/60 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Hint</span>
                      {isHintExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Expandable Hint Drawer with Quick Command Copy */}
              {showHints && isHintExpanded && obj.hint && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3.5 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-200 space-y-2 animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      TACTICAL OPERATOR HINT:
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyHint(e, obj.hint, obj.id)}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-[10px] text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 leading-relaxed break-words selection:bg-cyan-500/40">
                    {obj.hint}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
export default MissionProgressTracker;
