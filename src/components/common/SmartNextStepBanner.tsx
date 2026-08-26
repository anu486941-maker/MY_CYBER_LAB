import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getCareerRoleById } from '../../data/careerRolesData';
import { calculateLearnerPosition, calculateNextMove } from '../../utils/learningPositionEngine';
import { 
  ArrowRight, 
  Target, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  ShieldAlert,
  GraduationCap,
  Bot,
  Info,
  Clock,
  HelpCircle,
  Award
} from 'lucide-react';

interface SmartNextStepBannerProps {
  className?: string;
}

export const SmartNextStepBanner: React.FC<SmartNextStepBannerProps> = ({ className = '' }) => {
  const { learningState, profile, trainingMode } = useApp();
  const navigate = useNavigate();
  const [showWhy, setShowWhy] = useState(false);

  const currentRole = getCareerRoleById(profile.targetRole || 'soc-analyst');
  const { position, nextMove } = learningState;

  const getActionIcon = () => {
    switch (nextMove.actionType) {
      case 'mistake_review':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'lab_practice':
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'tactical_mission':
        return <ShieldAlert className="w-5 h-5 text-indigo-400" />;
      case 'boss_evaluation':
        return <GraduationCap className="w-5 h-5 text-rose-400" />;
      default:
        return <Target className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleAskAman = () => {
    navigate('/ai-mentor', { 
      state: { initialPrompt: `AMAN, explain why my recommended next action is: "${nextMove.title}". What will I learn from it?` } 
    });
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)] flex flex-col space-y-4 ${className}`}>
      
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-widest">
            AMAN'S AUTONOMOUS NEXT BEST ACTION
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded-md border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>EST: {nextMove.timeEstimate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-slate-950/50 px-2.5 py-1 rounded-md border border-slate-800">
            <Award className="w-3.5 h-3.5" />
            <span>+{nextMove.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-2">
        {/* Left Info */}
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
            {getActionIcon()}
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${nextMove.badgeColor}`}>
                {nextMove.badgeLabel}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {currentRole.title} Curriculum
              </span>
              {trainingMode === 'EXAM' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-400 font-bold">
                  EXAM MODE
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-mono font-bold text-white truncate">
              {nextMove.title}
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
              {nextMove.whyDescription}
            </p>

            {/* Why This Panel */}
            <div className="mt-3">
              <button 
                onClick={() => setShowWhy(!showWhy)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                {showWhy ? 'HIDE REASONING' : 'WHY THIS? (ENGLISH / HINGLISH)'}
              </button>
              {showWhy && (
                <div className="mt-2 p-3.5 rounded-xl bg-slate-950/80 border border-cyan-900/40 text-xs text-slate-300 font-sans space-y-1.5">
                  <div className="text-[11px] font-mono text-cyan-400 font-bold">EDUCATIONAL REASONING:</div>
                  <p>{nextMove.whyDescription}</p>
                  <p className="text-xs text-slate-400 font-mono italic pt-1 border-t border-slate-800">
                    💬 "{nextMove.hinglishWhy}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleAskAman}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            ASK AMAN
          </button>
          <Link
            to={nextMove.stepLink}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>START NEXT ACTION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
