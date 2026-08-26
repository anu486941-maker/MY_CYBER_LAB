import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCareerRoleById } from '../data/careerRolesData';
import { calculateLearnerPosition, calculateNextMove } from '../utils/learningPositionEngine';
import { 
  Flame, 
  Crosshair, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Terminal, 
  Bot, 
  ArrowRight, 
  Briefcase,
  Compass,
  Layers,
  Shield
} from 'lucide-react';
import { ModeToggleBanner } from '../components/common/ModeToggleBanner';
import { GlobalProgressBar } from '../components/common/GlobalProgressBar';
import { AmanInstructionBanner } from '../components/common/AmanInstructionBanner';

export const DashboardPage: React.FC = () => {
  const { 
    learningState, 
    profile,
    activeCareerTrack,
    setActiveCareerTrack,
    careerProgress
  } = useApp();
  const navigate = useNavigate();

  const currentRole = getCareerRoleById(profile.targetRole || 'soc-analyst');
  const { position, nextMove } = learningState;

  const handleStartNext = () => {
    navigate(nextMove.stepLink);
  };

  const tracks = [
    {
      id: 'ETHICAL_HACKER' as const,
      title: 'Ethical Hacker Track',
      description: 'Offensive security, network penetration testing, web application exploits, and offensive scripting.',
      icon: Crosshair,
      accentColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
      activeColor: 'shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-400',
    },
    {
      id: 'SOC_ANALYST' as const,
      title: 'SOC Analyst Track',
      description: 'Defensive engineering, SIEM event handling, log forensics, threat investigation, and incident response.',
      icon: Shield,
      accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      activeColor: 'shadow-[0_0_20px_rgba(245,158,11,0.15)] border-amber-400',
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* AUTONOMOUS AMAN INSTRUCTION BANNER */}
      <AmanInstructionBanner />

      {/* Mode Switcher: Mentor vs Exam Mode */}
      <ModeToggleBanner />

      {/* AMAN HOME — ONE PRIMARY STARTING POINT CARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-6 relative overflow-hidden">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-inner">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-extrabold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                <span>AMAN AI NAVIGATOR • HOME</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h1 className="text-xl sm:text-2xl font-mono font-bold text-white">
                Welcome back, {profile.name}
              </h1>
            </div>
          </div>

          <Link
            to="/roles"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 text-xs font-mono font-bold transition-all shrink-0 self-start sm:self-auto"
          >
            <span>{currentRole.emoji}</span>
            <span>Target Goal: <strong>{currentRole.title}</strong></span>
            <span className="text-[10px] text-cyan-400 underline ml-1">Change →</span>
          </Link>
        </div>

        {/* Telemetry Status Row: Goal | You Are Here | Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">YOUR GOAL</span>
            <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{currentRole.title}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">YOU ARE HERE</span>
            <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5 truncate">
              <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{position.currentCourse} → {position.currentModule}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span>PATH PROGRESS</span>
              <span className="text-emerald-400">{position.progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500" 
                style={{ width: `${position.progressPercentage}%` }} 
              />
            </div>
          </div>
        </div>

        {/* AMAN'S NEXT MOVE CARD */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 border border-cyan-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AMAN'S RECOMMENDED NEXT MOVE
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {nextMove.timeEstimate}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-mono font-black text-white">
              {nextMove.title}
            </h2>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              <strong className="text-cyan-400 font-mono">WHY: </strong>
              {nextMove.whyDescription}
            </p>
            {nextMove.hinglishWhy && (
              <p className="text-xs text-slate-400 font-mono italic">
                💬 "{nextMove.hinglishWhy}"
              </p>
            )}
          </div>

          {/* ONE DOMINANT PRIMARY CTA BUTTON */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleStartNext}
              className="w-full sm:flex-1 py-4 px-8 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono font-black text-base tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Crosshair className="w-5 h-5" />
              <span>START NOW</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Quiet Secondary Links */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
              <Link
                to="/ai-mentor"
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors"
              >
                Ask AMAN
              </Link>
              <Link
                to="/roadmap"
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors"
              >
                View Roadmap
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Operator Stats Below the Fold */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">CYBER LEVEL</span>
          <div className="text-xl font-mono font-black text-cyan-400">LVL {profile.cyberLevel}</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">TOTAL XP</span>
          <div className="text-xl font-mono font-black text-slate-100">{profile.xp} XP</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">DAY STREAK</span>
          <div className="flex items-center gap-1 text-xl font-mono font-black text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400/20" />
            <span>{profile.streak} Days</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">SIMULATION HOURS</span>
          <div className="text-xl font-mono font-black text-purple-400">{profile.labHours} HRS</div>
        </div>
      </div>

      {/* PREMIUM CAREER TRACK SELECTION ORCHESTRATOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
              Career Track Orchestrator
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 uppercase">
            Premium Feature
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => {
            const isActive = activeCareerTrack === track.id;
            const progress = careerProgress?.[track.id];
            const trackLvl = progress ? progress.cyberLevel : 1;
            const trackXp = progress ? progress.xp : 0;
            const Icon = track.icon;

            return (
              <div
                key={track.id}
                className={`p-5 rounded-2xl bg-gradient-to-br border transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? `${track.activeColor} bg-slate-950` 
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Background active pulse glow */}
                {isActive && (
                  <span className="absolute top-0 right-0 w-3 h-3 m-3 bg-emerald-400 rounded-full animate-ping" />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${isActive ? track.accentColor : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider flex items-center gap-2">
                        {track.title}
                        {isActive && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ACTIVE
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-1">
                        {track.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specific Progress Metrics */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                    <span className="text-slate-500 uppercase block font-bold">Progress</span>
                    <span className="text-white font-bold block mt-0.5">
                      {progress ? `${progress.levels.filter(l => l.isCompleted || l.lessons.every(ls => ls.completed)).length} / ${progress.levels.length} Modules` : '0 Modules'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                    <span className="text-slate-500 uppercase block font-bold">Metrics</span>
                    <span className="text-white font-bold block mt-0.5 text-cyan-400">
                      LVL {trackLvl} • {trackXp} XP
                    </span>
                  </div>
                </div>

                {/* Switching Action */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Status: {isActive ? 'Running Simulation' : 'Suspended State'}
                  </span>
                  
                  <button
                    onClick={() => {
                      if (!isActive) {
                        setActiveCareerTrack(track.id);
                      }
                    }}
                    disabled={isActive}
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white hover:scale-[1.02]'
                    }`}
                  >
                    {isActive ? 'Simulating' : 'Deploy Track'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Progress Bar */}
      <GlobalProgressBar />

      {/* Secondary Hub Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/modules"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 group-hover:scale-110 transition-transform">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-xs text-slate-200">LEARN MODULES</span>
        </Link>

        <Link
          to="/practice"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-lg bg-indigo-950/60 text-indigo-400 group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-xs text-slate-200">PRACTICE LABS</span>
        </Link>

        <Link
          to="/roadmap"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 group-hover:scale-110 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-xs text-slate-200">ROADMAP</span>
        </Link>

        <Link
          to="/learning-path"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-lg bg-amber-950/60 text-amber-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-xs text-slate-200">SKILL PROGRESS</span>
        </Link>
      </div>

    </div>
  );
};
