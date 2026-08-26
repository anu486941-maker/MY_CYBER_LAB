import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mission } from '../types';
import { 
  Crosshair, 
  CheckCircle2, 
  Clock, 
  Award, 
  Lock, 
  Filter, 
  Sparkles, 
  ArrowRight,
  Terminal,
  ShieldAlert,
  Radio,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  Cpu,
  Layers,
  MapPin,
  HelpCircle,
  Lightbulb,
  Radar,
  Sliders
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MissionProgressTracker } from '../components/common/MissionProgressTracker';
import { PracticeToolsLab } from '../components/common/PracticeToolsLab';
import { playTacticalSound, toggleSound, isSoundEnabled } from '../utils/audio';

import { MissionRunnerModal } from '../components/common/MissionRunnerModal';

export const MissionsPage: React.FC = () => {
  const { missions, setSelectedMission, profile } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeViewMode, setActiveViewMode] = useState<'grid' | 'tactical_map' | 'arsenal'>('grid');
  const [soundActive, setSoundActive] = useState<boolean>(isSoundEnabled());
  const [activeMissionRunner, setActiveMissionRunner] = useState<Mission | null>(null);

  const categories = ['All', 'Linux', 'Networking', 'Recon', 'Investigation'];
  const statuses = ['All', 'available', 'in_progress', 'completed', 'locked'];

  const filteredMissions = missions.filter(m => {
    const matchesCat = filterCategory === 'All' || m.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    return matchesCat && matchesStatus;
  });

  const completedCount = missions.filter(m => m.status === 'completed').length;
  const totalXp = missions.reduce((acc, m) => m.status === 'completed' ? acc + m.xp : acc, 0);

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundActive(next);
    if (next) playTacticalSound('click');
  };

  const handleMissionCardClick = (mission: Mission) => {
    playTacticalSound('click');
    if (mission.status !== 'locked') {
      setActiveMissionRunner(mission);
    } else {
      setSelectedMission(mission);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      
      {/* =========================================================================
          TOP CYBER COMMAND WAR ROOM HUD
          ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden">
        {/* Ambient grid background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Title & Operator Status */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                CYBER COMMAND MISSION CONTROL
              </span>
              <span className="text-xs font-mono text-slate-500">•</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold">
                DEFCON 3 // ELEVATED READY
              </span>
              <span className="text-xs font-mono text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400">
                OPERATOR: <span className="text-slate-200 font-bold">{profile.name.toUpperCase()}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-mono font-black text-slate-100 tracking-tight">
              Tactical Operations & Field Missions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl">
              Execute live penetration testing procedures, investigate system footprints, and clear objective pipelines inside isolated container targets.
            </p>
          </div>

          {/* Right Metrics & Audio Control */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 shadow-lg text-xs font-mono">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">MISSION REWARDS</div>
                <div className="text-base font-bold text-cyan-400 font-mono">{totalXp} OPS XP</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 shadow-lg text-xs font-mono">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">CLEARANCE RATIO</div>
                <div className="text-base font-bold text-emerald-400 font-mono">
                  {completedCount} / {missions.length} CLEARED
                </div>
              </div>
            </div>

            <button
              onClick={handleSoundToggle}
              title={soundActive ? 'Tactical Audio Enabled (Click to Mute)' : 'Tactical Audio Muted'}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
            >
              {soundActive ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* View Switcher Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveViewMode('grid');
                playTacticalSound('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeViewMode === 'grid'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>TACTICAL BRIEFINGS GRID</span>
            </button>

            <button
              onClick={() => {
                setActiveViewMode('tactical_map');
                playTacticalSound('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeViewMode === 'tactical_map'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Radar className="w-4 h-4 text-purple-400" />
              <span>SECTOR WAR MAP</span>
            </button>

            <button
              onClick={() => {
                setActiveViewMode('arsenal');
                playTacticalSound('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeViewMode === 'arsenal'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>PRACTICE TOOLS & ARSENAL</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-cyan-400/80 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>SELECT A DIRECTIVE TO COMMENCE OPERATIONS</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          VIEW MODE 1: TACTICAL BRIEFINGS GRID (GAME CARDS)
          ========================================================================= */}
      {activeViewMode === 'grid' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800/90 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1 pr-1">
                <Filter className="w-3.5 h-3.5" /> Sector:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    playTacticalSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              <span className="text-xs font-mono text-slate-500 pr-1">Status:</span>
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setFilterStatus(st);
                    playTacticalSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                    filterStatus === st
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Tactical Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMissions.map((mission) => {
              const isCompleted = mission.status === 'completed';
              const isInProgress = mission.status === 'in_progress';
              const isLocked = mission.status === 'locked';

              return (
                <div
                  key={mission.id}
                  onClick={() => handleMissionCardClick(mission)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden ${
                    isCompleted
                      ? 'bg-slate-900/40 border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                      : isInProgress
                      ? 'bg-slate-900/90 border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.18)] hover:border-cyan-400 ring-1 ring-cyan-500/30'
                      : isLocked
                      ? 'bg-slate-950/70 border-slate-800/80 opacity-70 hover:opacity-100'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 shadow-md'
                  }`}
                >
                  {/* Subtle top scanline glow */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    isCompleted ? 'bg-emerald-400/80' : isInProgress ? 'bg-cyan-400 animate-pulse' : 'bg-slate-800'
                  }`} />

                  <div className="space-y-3.5 pt-1">
                    
                    {/* Header Metadata */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {mission.missionNumber}
                        </span>
                        <span className="text-slate-600 font-mono">•</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-purple-300 font-bold">
                          {mission.codename}
                        </span>
                      </div>

                      {isCompleted ? (
                        <StatusBadge type="mastered" label="DONE" />
                      ) : isInProgress ? (
                        <StatusBadge type="learning" label="ACTIVE" />
                      ) : isLocked ? (
                        <StatusBadge type="locked" />
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold">
                          AVAILABLE
                        </span>
                      )}
                    </div>

                    {/* Mission Title & Classification */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                        <span className="text-rose-400 font-bold">{mission.classification || 'CONFIDENTIAL'}</span>
                        <span>•</span>
                        <span>{mission.estimatedTime}</span>
                        <span>•</span>
                        <span className="text-cyan-400 font-bold">+{mission.xp} XP</span>
                      </div>
                      <h3 className="text-base font-mono font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {mission.title}
                      </h3>
                    </div>

                    {/* Target Host Box */}
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        Target Host:
                      </span>
                      <span className="text-slate-200 font-bold">
                        {mission.category === 'Linux' ? 'cyberlab-workstation (127.0.0.1)' :
                         mission.category === 'Networking' ? 'gateway-router (192.168.1.1)' :
                         'nightfall-target (192.168.1.105)'}
                      </span>
                    </div>

                    {/* Mission Description */}
                    <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                      {mission.description}
                    </p>

                    {/* Visual Progress Component */}
                    <div className="pt-1">
                      <MissionProgressTracker
                        mission={mission}
                        variant="compact"
                        interactive={false}
                      />
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      {mission.objectives.length} Directives
                    </span>

                    <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {isCompleted ? 'Review Intel' : isInProgress ? 'Resume Op' : 'Open Briefing'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: TACTICAL SECTOR WAR MAP
          ========================================================================= */}
      {activeViewMode === 'tactical_map' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-purple-500/30 space-y-6 animate-fadeIn shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                <Radar className="w-5 h-5 text-purple-400 animate-spin" />
                <span>CYBERSMITH SECTOR THREAT MAP</span>
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Visual relationship graph of active engagement nodes, targets, and prerequisite paths.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Cleared
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Active
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-700" /> Locked
              </span>
            </div>
          </div>

          {/* Interactive Node Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map((m, idx) => (
              <div
                key={m.id}
                onClick={() => handleMissionCardClick(m)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  m.status === 'completed'
                    ? 'bg-slate-900/60 border-emerald-500/40 hover:border-emerald-400'
                    : m.status === 'in_progress'
                    ? 'bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/40'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-300">NODE 0{idx + 1}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    +{m.xp} XP
                  </span>
                </div>
                <div className="font-mono font-bold text-sm text-slate-200">{m.title}</div>
                <div className="text-[11px] font-mono text-slate-400 truncate">{m.codename}</div>
                <div className="text-[10px] font-mono text-cyan-400/80 pt-1">
                  Target: {m.category} Security Perimeter
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: HANDS-ON PRACTICE ARSENAL
          ========================================================================= */}
      {activeViewMode === 'arsenal' && (
        <div className="animate-fadeIn">
          <PracticeToolsLab activeTargetIp="192.168.1.105" />
        </div>
      )}

      {/* =========================================================================
          RECOMMENDATION & STRATEGIC R&D ROADMAP PANEL
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
                STRATEGIC RECOMMENDATIONS: WHAT TO EXPAND NEXT
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Architectural guidance from your AI Cybersecurity Lead for maximum platform engagement.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold hidden sm:inline">
            EXPANSION BLUEPRINT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
              <Radio className="w-4 h-4" />
              <span>1. LIVE ZERO-DAY FEED</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Simulate dynamic CVE emergency response missions where real-time CVE alerts pop up on the war room HUD requiring triage.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>2. RED VS BLUE DUELS</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Multi-phase attack chains where you conduct reconnaissance as an attacker, then switch to Blue Team to patch iptables & detect logs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
              <Clock className="w-4 h-4" />
              <span>3. TIMED CTF SPEEDRUNS</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Gauntlet speedrun mode with live ticking countdown timers, combo multipliers, and automated flag verification leaderboards.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
              <Cpu className="w-4 h-4" />
              <span>4. MULTI-NODE DOMAINS</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Simulated multi-tier corporate networks with Windows Active Directory domain controllers, Kerberoasting, and BloodHound graphs.
            </p>
          </div>

        </div>
      </div>

      {activeMissionRunner && (
        <MissionRunnerModal
          mission={activeMissionRunner}
          onClose={() => setActiveMissionRunner(null)}
        />
      )}

    </div>
  );
};
export default MissionsPage;
