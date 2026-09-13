import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRolePersonalization } from '../services/rolePersonalization';
import { 
  Shield, 
  Crosshair, 
  Clock, 
  Sparkles, 
  Terminal, 
  Bot, 
  ArrowRight, 
  Compass, 
  Layers, 
  Flag, 
  CheckCircle2, 
  Award, 
  Play, 
  Brain, 
  Mic, 
  Globe, 
  FileCheck, 
  BookOpen, 
  Zap, 
  Radio, 
  ChevronRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { ModeToggleBanner } from '../components/common/ModeToggleBanner';
import { AmanLevelCalibrationModal } from '../components/assessment/AmanLevelCalibrationModal';
import { playTacticalSound } from '../utils/audio';

export const DashboardPage: React.FC = () => {
  const { 
    learningState, 
    profile, 
    completedMissions, 
    levels,
    currentUser 
  } = useApp();
  const navigate = useNavigate();
  const [isCalibrationOpen, setIsCalibrationOpen] = useState<boolean>(false);

  // Derive active user identity and role cleanly without fallback dummy names
  const chosenRoleKey = profile?.selectedRole || profile?.targetRole || 'soc-analyst';
  const roleConfig = getRolePersonalization(chosenRoleKey);
  const { position } = learningState;

  // Real user name (fallback to Operator only if no name/display name exists)
  const realUserName = (profile?.name && profile.name.trim() !== 'Alex Mercer' && profile.name.trim() !== '')
    ? profile.name.trim()
    : (currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Operator');

  const realRoleTitle = roleConfig?.title || 'Cybersecurity Specialist';
  const realSkillLevel = profile?.calibratedLevel || profile?.skillLevel || (profile?.cyberLevel ? `Level ${profile.cyberLevel}` : 'Beginner');

  // Primary Today's Mission data
  const primaryMission = roleConfig.missions?.[0] || {
    id: 'SOC-001',
    title: 'Network Reconnaissance & Initial Access Triage',
    difficulty: 'Beginner',
    timeEstimate: '25 min',
    description: 'Enumerate network attack surface, detect abnormal authentication anomalies, and isolate rogue processes.'
  };

  const isMissionCompleted = completedMissions.includes(primaryMission.id) || 
    (profile?.lastCheckpointPassed === primaryMission.id) || 
    completedMissions.includes('SOC-001');

  // Calculate real progress
  const totalTrackModules = roleConfig.recommendedModules?.length || 4;
  const completedTrackModulesCount = levels.filter(l => l.isCompleted || l.lessons?.every(ls => ls.completed)).length;
  const overallProgressPercentage = Math.min(100, Math.round((completedMissions.length + completedTrackModulesCount) / (totalTrackModules + 2) * 100));

  const hasAnyProgress = completedMissions.length > 0 || completedTrackModulesCount > 0 || (profile?.xp && profile.xp > 0);

  const handleStartMission = () => {
    playTacticalSound('click');
    if (primaryMission.id === 'SOC-001' || !primaryMission.id.includes('-')) {
      navigate('/flag-checkpoint');
    } else {
      navigate(`/missions?id=${primaryMission.id}`);
    }
  };

  const handleAskAman = () => {
    window.dispatchEvent(
      new CustomEvent('open-aman-drawer', {
        detail: {
          prompt: `Namaste AMAN, I am training as a ${realRoleTitle} at the ${realSkillLevel} level. Guide me on my immediate next step.`
        }
      })
    );
  };

  const handleOpenVoice = () => {
    window.dispatchEvent(
      new CustomEvent('open-aman-drawer', {
        detail: {
          prompt: `Hello AMAN, start voice briefing for my ${realRoleTitle} path.`,
          mode: 'voice'
        }
      })
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* Mode Switcher: Mentor vs Exam Mode */}
      <ModeToggleBanner />

      {/* 1. DASHBOARD HERO (COMPACT, CLEAN, AUTHENTIC DATA ONLY) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.1)] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Real Role & Skill Level Subtitle */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-sm">{roleConfig.emoji}</span>
                <span>{realRoleTitle}</span>
              </span>
              <span className="text-slate-600 font-mono">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase">
                {realSkillLevel}
              </span>
              <Link
                to="/select-role"
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 underline transition-colors ml-1"
              >
                Change Role
              </Link>
            </div>

            {/* Greeting Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-white tracking-tight">
                Welcome back, {realUserName}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-sans mt-1.5 leading-relaxed">
                Your next step is ready. Let's continue your cybersecurity journey.
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              id="dashboard-start-mission-hero-btn"
              onClick={handleStartMission}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>START TODAY'S MISSION →</span>
            </button>

            <button
              id="dashboard-ask-aman-hero-btn"
              onClick={handleAskAman}
              className="py-3.5 px-5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-purple-500/40 hover:border-purple-400 text-purple-300 hover:text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>ASK AMAN</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S MISSION (MAIN FOCUS CARD) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.12)] space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                PRIMARY OBJECTIVE
              </span>
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-white uppercase">
                TODAY'S MISSION
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-medium text-slate-400">
              Est. {primaryMission.timeEstimate || '25 min'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-xs font-mono font-bold text-amber-300 uppercase">
              {primaryMission.difficulty || 'Intermediate'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg sm:text-xl font-mono font-bold text-white flex items-center gap-2">
              <span>{primaryMission.title}</span>
              {isMissionCompleted && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  100% COMPLETED
                </span>
              )}
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Status: <strong className={isMissionCompleted ? 'text-emerald-400' : 'text-amber-300'}>{isMissionCompleted ? 'Completed' : '0% In Progress'}</strong>
            </span>
          </div>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            {primaryMission.description}
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <p className="text-xs font-sans text-slate-300">
                <strong className="text-purple-300 font-mono">AMAN Socratic Support: </strong>
                I will provide step-by-step guidance, command hints, and explain telemetry anomalies during this mission.
              </p>
            </div>

            <button
              id="dashboard-start-mission-card-btn"
              onClick={handleStartMission}
              className="py-3 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer shadow-md"
            >
              <span>{isMissionCompleted ? 'REPLAY MISSION →' : 'START MISSION →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. AMAN CARD & 4. PROGRESS (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 3. AMAN CARD */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-mono font-black text-white uppercase flex items-center gap-1.5">
                    <span>AMAN</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-xs font-sans text-purple-300">
                    Your AI Cybersecurity Mentor
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300">
                ACTIVE
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                "As an aspiring <strong className="text-cyan-300">{realRoleTitle}</strong>, your immediate milestone is mastering {roleConfig.tools?.[0] || 'core tools'} and foundational concepts. I am ready to review your commands, debug CLI syntax, or explain real-world security telemetry."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAskAman}
              className="flex-1 py-3 px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-purple-300" />
              <span>ASK AMAN</span>
            </button>

            <button
              onClick={handleOpenVoice}
              className="py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Open AMAN Voice Assistant"
            >
              <Mic className="w-4 h-4 text-cyan-400" />
              <span>VOICE</span>
            </button>
          </div>
        </div>

        {/* 4. PROGRESS */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-mono font-black text-white uppercase">
                    LEARNING PROGRESS
                  </h3>
                  <p className="text-xs font-sans text-slate-400">
                    Real-time track metrics & mastery
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCalibrationOpen(true)}
                className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Recalibrate
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">CURRENT LEVEL</span>
                <span className="text-sm font-mono font-bold text-cyan-300 block truncate">
                  {realSkillLevel}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">ACTIVE PATH</span>
                <span className="text-sm font-mono font-bold text-amber-300 block truncate">
                  {realRoleTitle}
                </span>
              </div>
            </div>

            {/* Current Module & Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Module: <strong className="text-white">{position.currentModule || roleConfig.recommendedModules?.[0]?.title || 'Fundamentals'}</strong>
                </span>
                <span className="text-emerald-400 font-bold">{overallProgressPercentage}%</span>
              </div>

              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.max(hasAnyProgress ? overallProgressPercentage : 4, 4)}%` }}
                />
              </div>

              {!hasAnyProgress && (
                <p className="text-xs font-sans text-slate-400 pt-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Start your first mission to begin tracking progress.</span>
                </p>
              )}
            </div>
          </div>

          <Link
            to="/learning-path"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <span>VIEW FULL SKILL MATRIX</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 5. CONTINUE LEARNING (1 OR 2 RELEVANT LEARNING ITEMS) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
              CONTINUE LEARNING
            </h2>
          </div>
          <Link
            to="/modules"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All Modules</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleConfig.recommendedModules.slice(0, 2).map((mod, idx) => (
            <div
              key={mod.id || idx}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase">
                    {mod.category || 'FOUNDATION'}
                  </span>
                  <span className="text-[11px] font-mono text-amber-400">+{mod.xp || 400} XP</span>
                </div>
                <h3 className="text-base font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <Link
                to={mod.route || '/modules'}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all group-hover:border-cyan-400"
              >
                <span>CONTINUE →</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 6. ADVANCED FEATURES (CLEAN SECONDARY GRID) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-mono font-bold text-slate-300 uppercase tracking-wider">
              ADVANCED TRAINING SUITE
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">10 SPECIALIZED LABS & TOOLS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <Link
            to="/ctf-arena"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-400 group-hover:scale-110 transition-transform">
              <Flag className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">CTF ARENA</span>
            <span className="text-[10px] text-slate-500 font-sans">Compete & extract flags</span>
          </Link>

          <Link
            to="/linux-lab"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 group-hover:scale-110 transition-transform">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">LINUX LAB</span>
            <span className="text-[10px] text-slate-500 font-sans">Interactive CLI sandbox</span>
          </Link>

          <Link
            to="/practice/soc-simulator"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 group-hover:scale-110 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">SOC SIMULATOR</span>
            <span className="text-[10px] text-slate-500 font-sans">SIEM triage & containment</span>
          </Link>

          <Link
            to="/practice/web-security"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">WEB LAB</span>
            <span className="text-[10px] text-slate-500 font-sans">OWASP Top 10 exploits</span>
          </Link>

          <Link
            to="/practice"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">PRACTICE LABS</span>
            <span className="text-[10px] text-slate-500 font-sans">Specialized skill drills</span>
          </Link>

          <Link
            to="/skill-library"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-teal-950/60 text-teal-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">SKILL LIBRARY</span>
            <span className="text-[10px] text-slate-500 font-sans">Knowledge repositories</span>
          </Link>

          <Link
            to="/certificate"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 group-hover:scale-110 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">CERTIFICATES</span>
            <span className="text-[10px] text-slate-500 font-sans">Verifiable credentials</span>
          </Link>

          <Link
            to="/pricing"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-yellow-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-yellow-950/60 text-yellow-400 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">WHOP PASS</span>
            <span className="text-[10px] text-slate-500 font-sans">Pro tiers & access</span>
          </Link>

          <Link
            to="/roadmap"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">ROADMAP</span>
            <span className="text-[10px] text-slate-500 font-sans">Visual career milestones</span>
          </Link>

          <Link
            to="/missions"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
          >
            <div className="p-2.5 rounded-xl bg-rose-950/60 text-rose-400 group-hover:scale-110 transition-transform">
              <Crosshair className="w-4 h-4" />
            </div>
            <span className="font-mono font-bold text-xs text-slate-200">MISSIONS</span>
            <span className="text-[10px] text-slate-500 font-sans">Scenario catalog</span>
          </Link>

        </div>
      </div>

      {/* Aman Level Assessment / Calibration Modal */}
      <AmanLevelCalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
      />

    </div>
  );
};

export default DashboardPage;
