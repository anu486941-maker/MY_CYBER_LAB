import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateLearnerPosition, calculateNextMove } from '../../utils/learningPositionEngine';
import { 
  X, 
  Crosshair, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Target, 
  BookOpen, 
  Terminal, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Award, 
  CheckCircle2, 
  Layers,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WhereAmIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAmanChat?: (initialPrompt?: string) => void;
}

export const WhereAmIModal: React.FC<WhereAmIModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenAmanChat
}) => {
  const { learningState, profile } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const { position, nextMove } = learningState;

  const handleStartNext = () => {
    onClose();
    navigate(nextMove.stepLink);
  };

  const handleAskWhy = () => {
    onClose();
    if (onOpenAmanChat) {
      onOpenAmanChat(`AMAN, why is "${nextMove.title}" my recommended next move? Explain in detail.`);
    } else {
      navigate('/ai-mentor', { 
        state: { initialPrompt: `AMAN, why is "${nextMove.title}" my recommended next move? Explain in detail.` } 
      });
    }
  };

  const handleTalkToAman = () => {
    onClose();
    navigate('/ai-mentor');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-mono font-bold text-white tracking-wide">
                  WHERE AM I? • OPERATIONAL POSITION
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-400">
                  REAL-TIME TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Exact learning coordinate, foundational progress, and deterministic next move.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Grid: YOU ARE HERE Data Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Career & Level */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> CAREER PATH & TIER
              </div>
              <div>
                <div className="text-sm font-bold text-white font-mono">{position.careerPath}</div>
                <div className="text-xs text-cyan-400 font-mono mt-0.5">Level {position.cyberLevel} Operator</div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Total XP</span>
                <span className="text-amber-400 font-bold">+{profile.xp} XP</span>
              </div>
            </div>

            {/* Current Course & Module */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> ACTIVE COORDINATE
              </div>
              <div>
                <div className="text-sm font-bold text-slate-200 font-sans line-clamp-1">{position.currentCourse}</div>
                <div className="text-xs text-indigo-300 font-mono mt-0.5">{position.currentModule} → {position.currentLesson}</div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Curriculum Progress</span>
                <span className="text-cyan-400 font-bold">{position.progressPercentage}%</span>
              </div>
            </div>

            {/* Mastery & Weakness */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" /> SKILL MASTERY & FOCUS
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-400 font-mono">{position.overallMasteryPercentage}% Overall Mastery</div>
                <div className="text-xs text-amber-300 font-mono mt-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" /> Weakness: {position.currentWeakness}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Next Required</span>
                <span className="text-slate-300 font-medium truncate max-w-[130px]">{position.nextRequiredSkill}</span>
              </div>
            </div>

          </div>

          {/* Completed Metrics Bar */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
              ACCOMPLISHED FOUNDATIONS (DETERMINISTIC VERIFICATION)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono text-slate-400">LESSONS</div>
                  <div className="text-sm font-bold text-white">{position.completedLessonsCount} / {position.totalLessonsCount}</div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                <Terminal className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono text-slate-400">LABS</div>
                  <div className="text-sm font-bold text-white">{position.completedLabsCount} / {position.totalLabsCount}</div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono text-slate-400">MISSIONS</div>
                  <div className="text-sm font-bold text-white">{position.completedMissionsCount} / {position.totalMissionsCount}</div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono text-slate-400">CTF FLAGS</div>
                  <div className="text-sm font-bold text-white">{position.completedCtfCount} / {position.totalCtfCount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AMAN'S NEXT MOVE HIGHLIGHT CARD */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/40 rounded-2xl p-6 relative overflow-hidden shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    AMAN'S RECOMMENDED NEXT MOVE
                  </span>
                  <h3 className="text-lg font-bold text-white font-mono">{nextMove.title}</h3>
                </div>
              </div>
              <span className={`self-start sm:self-auto px-2.5 py-1 rounded text-xs font-mono border ${nextMove.badgeColor}`}>
                {nextMove.badgeLabel}
              </span>
            </div>

            {/* Why Section */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 mb-5 space-y-2">
              <div className="text-[11px] font-mono text-cyan-400 uppercase">WHY THIS STEP:</div>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                {nextMove.whyDescription}
              </p>
              <p className="text-xs text-slate-400 font-mono italic pt-1 border-t border-slate-800/60">
                💬 "{nextMove.hinglishWhy}"
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mb-6">
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Estimated Time: <strong className="text-slate-200">{nextMove.timeEstimate}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Reward: <strong className="text-amber-300">+{nextMove.xpReward} XP</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Difficulty: <strong className="text-emerald-300">{nextMove.difficulty}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleStartNext}
                className="py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
              >
                START NEXT MOVE <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleAskWhy}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" /> ASK AMAN WHY
              </button>

              <button
                onClick={handleTalkToAman}
                className="py-3 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 font-mono font-medium text-xs flex items-center justify-center gap-2 border border-purple-500/40 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-400" /> TALK TO AMAN
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
