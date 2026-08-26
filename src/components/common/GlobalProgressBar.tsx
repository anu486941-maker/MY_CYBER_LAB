import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export const GlobalProgressBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { profile, missions, levels } = useApp();

  const totalMissions = missions.length;
  const completedMissions = missions.filter(m => m.status === 'completed' || m.completed).length;
  const missionProgress = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

  const totalLevels = levels.length;
  const completedLevels = levels.filter(l => l.status === 'completed' || l.isCompleted).length;
  const pathProgress = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

  const overallProgress = Math.round((missionProgress + pathProgress) / 2);

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-mono font-bold text-sm text-slate-100 uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          GLOBAL TRAINING COMPLETION
        </h3>
        <span className="text-sm font-mono font-extrabold text-cyan-400">{overallProgress}% OVERALL</span>
      </div>

      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400 transition-all duration-1000 relative overflow-hidden" 
          style={{ width: `${overallProgress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -skew-x-12" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1"><Target className="w-3 h-3" /> MISSIONS</span>
            <span className="text-slate-200 font-bold">{completedMissions}/{totalMissions}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-400 h-full rounded-full transition-all duration-700" style={{ width: `${missionProgress}%` }} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> PATH LEVELS</span>
            <span className="text-slate-200 font-bold">{completedLevels}/{totalLevels}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full transition-all duration-700" style={{ width: `${pathProgress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
