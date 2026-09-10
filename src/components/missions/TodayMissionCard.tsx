import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Target, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Bot,
  Terminal,
  Award
} from 'lucide-react';
import { playTacticalSound } from '../../utils/audio';

interface TodayMissionCardProps {
  onStartMission?: () => void;
}

export const TodayMissionCard: React.FC<TodayMissionCardProps> = ({ onStartMission }) => {
  const { profile, completedMissions } = useApp();
  const navigate = useNavigate();

  const isCompleted = completedMissions.includes('SOC-001') || (profile.lastCheckpointPassed === 'SOC-001');

  const handleStart = () => {
    playTacticalSound('click');
    if (onStartMission) {
      onStartMission();
    } else {
      navigate('/flag-checkpoint');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
      {/* Background ambient radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Mission details */}
        <div className="space-y-4 max-w-2xl">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              TODAY'S MISSION
            </span>
            <span className="text-xs font-mono text-slate-500">•</span>
            <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold">
              TRACK: {((profile.selectedRole || 'SOC Analyst') as string).toUpperCase().replace('-', ' ')}
            </span>
            <span className="text-xs font-mono text-slate-500">•</span>
            <span className="px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              DIFFICULTY: {profile.calibratedLevel || 'BEGINNER'}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-3xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
              <span>SOC-001 — Investigate a Suspicious Login</span>
              {isCompleted && (
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  VERIFIED
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1.5 leading-relaxed">
              Identify an unauthorized external remote authentication anomaly in simulated authentication logs and extract the authoritative evidence flag.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Est. Time: <strong className="text-slate-200">15 mins</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Reward: <strong className="text-amber-300">+100 XP</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Format: <strong className="text-slate-200">Controlled Sandbox</strong></span>
            </div>
          </div>

          {/* AMAN Note */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
            <Bot className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" />
            <div className="text-xs font-sans text-cyan-200 leading-relaxed">
              <strong className="text-cyan-300 font-mono">AMAN: </strong>
              "Main tumhe guide karunga ki logs ko kaise inspect karna hai aur unauthorized activity kaise spot karni hai. We will analyze real authentication events and catch the attacker together."
            </div>
          </div>

        </div>

        {/* Right: CTA */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={handleStart}
            className={`px-8 py-4 rounded-2xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xl ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.35)]'
            }`}
          >
            <span>{isCompleted ? 'Review Flag Checkpoint' : 'Start Mission'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono text-slate-500 text-center">
            {isCompleted ? 'Checkpoint verified & saved' : 'Authoritative server verification'}
          </span>
        </div>

      </div>
    </div>
  );
};
