import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCareerRoleById } from '../data/careerRolesData';
import { getRolePersonalization } from '../services/rolePersonalization';
import { getNextRecommendedVideo } from '../services/videoRecommendationEngine';
import { AdaptiveLearningService } from '../services/adaptiveLearningService';
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
  Shield,
  MessageSquare,
  Map,
  Flag,
  CheckCircle2,
  SlidersHorizontal,
  Award,
  Video,
  Play,
  Brain,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Zap
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
    careerProgress,
    selectedMission,
    videoProgressMap,
    weakSkills,
    skillMasteries,
    mistakes,
    completedMissions,
    labScores
  } = useApp();
  const navigate = useNavigate();

  const chosenRoleKey = profile?.selectedRole || profile?.targetRole || 'soc-analyst';
  const roleConfig = getRolePersonalization(chosenRoleKey);
  const currentRole = getCareerRoleById(chosenRoleKey);
  const { position, nextMove } = learningState;

  // Compute adaptive Next Best Action based on skill mastery telemetry and mistake journal
  const adaptiveAction = useMemo(() => {
    return AdaptiveLearningService.getNextBestAction({
      profile,
      skillMasteries,
      mistakes,
      completedMissions,
      labScores
    });
  }, [profile, skillMasteries, mistakes, completedMissions, labScores]);

  // Compute Skill Health telemetry summary
  const skillHealth = useMemo(() => {
    return AdaptiveLearningService.getSkillHealthSummary(skillMasteries, mistakes);
  }, [skillMasteries, mistakes]);

  // Compute role-tailored recommended next action
  const roleNextAction = roleConfig.getNextAction(profile);

  // Compute role-tailored recommended next video
  const nextVideo = useMemo(() => {
    return getNextRecommendedVideo(chosenRoleKey, videoProgressMap, weakSkills);
  }, [chosenRoleKey, videoProgressMap, weakSkills]);

  const handleStartNextTask = () => {
    navigate(roleNextAction.route);
  };

  const handleAskAman = () => {
    window.dispatchEvent(
      new CustomEvent('open-aman-drawer', {
        detail: {
          prompt: `Namaste AMAN, guide me on my next step for my career track: ${roleConfig.title}. What should I focus on right now?`
        }
      })
    );
  };

  const handleViewRoadmap = () => {
    navigate('/roadmap');
  };

  const handleContinueMission = () => {
    if (selectedMission) {
      navigate(`/missions?id=${selectedMission.id}`);
    } else if (roleConfig.missions && roleConfig.missions.length > 0) {
      navigate(`/missions?id=${roleConfig.missions[0].id}`);
    } else {
      navigate('/missions');
    }
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
    <div id="dashboard-page" className="space-y-6 pb-16">
      
      {/* AUTONOMOUS AMAN INSTRUCTION BANNER */}
      <AmanInstructionBanner />

      {/* Mode Switcher: Mentor vs Exam Mode */}
      <ModeToggleBanner />

      {/* DYNAMIC ROLE-PERSONALIZED AMAN PANEL — HOME STARTING POINT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-6 relative overflow-hidden">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-inner flex items-center justify-center text-xl">
              {roleConfig.emoji}
            </div>
            <div>
              <div className="text-[10px] font-mono font-extrabold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                <span>AMAN ROLE-PERSONALIZED RADAR</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h1 className="text-xl sm:text-2xl font-mono font-bold text-white">
                Welcome back, {profile?.name || profile?.codename || 'Operator'}
              </h1>
            </div>
          </div>

          {/* Active Role Selector Badge */}
          <Link
            to="/select-role"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 text-xs font-mono font-bold transition-all shrink-0 self-start sm:self-auto hover:border-cyan-400 group"
          >
            <span>{roleConfig.emoji}</span>
            <span>Role: <strong className="text-white">{roleConfig.title}</strong></span>
            <span className="text-[10px] text-cyan-400 underline ml-1 group-hover:text-cyan-300">Change Role →</span>
          </Link>
        </div>

        {/* Telemetry Status Row: Role & Focus | You Are Here | Path Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">CAREER TRACK</span>
            <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{roleConfig.title} ({roleConfig.badge})</span>
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
              <span>TRACK MASTERY</span>
              <span className="text-emerald-400">{position.progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-500" 
                style={{ width: `${position.progressPercentage}%` }} 
              />
            </div>
          </div>
        </div>

        {/* AMAN'S RECOMMENDED NEXT ACTION CARD */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 border border-cyan-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              RECOMMENDED NEXT: {roleNextAction.title.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {roleNextAction.timeEstimate}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-mono font-black text-white">
                {roleNextAction.targetName}
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                {roleConfig.title} Priority
              </span>
            </div>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              <strong className="text-cyan-400 font-mono">WHY AMAN RECOMMENDS THIS: </strong>
              {roleNextAction.reason}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-400">Core Tools for this step:</span>
              {roleConfig.tools.slice(0, 3).map((tool, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* 4 MANDATED ACTION BUTTONS */}
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* 1. START NEXT TASK (Primary Dominant CTA) */}
            <button
              id="dashboard-start-next-btn"
              onClick={handleStartNextTask}
              className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Crosshair className="w-4 h-4 shrink-0" />
              <span>START NEXT TASK</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {/* 2. ASK AMAN */}
            <button
              id="dashboard-ask-aman-btn"
              onClick={handleAskAman}
              className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>ASK AMAN</span>
            </button>

            {/* 3. VIEW ROADMAP */}
            <button
              id="dashboard-view-roadmap-btn"
              onClick={handleViewRoadmap}
              className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Map className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>VIEW ROADMAP</span>
            </button>

            {/* 4. CONTINUE MISSION */}
            <button
              id="dashboard-continue-mission-btn"
              onClick={handleContinueMission}
              className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Flag className="w-4 h-4 text-amber-400 shrink-0" />
              <span>CONTINUE MISSION</span>
            </button>

            {/* 5. JOB SIMULATION */}
            <button
              id="dashboard-job-sim-btn"
              onClick={() => navigate('/career-simulation')}
              className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 hover:from-emerald-900 hover:to-slate-800 border border-emerald-500/40 text-emerald-300 hover:text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>JOB SIMULATION</span>
            </button>

          </div>
        </div>

      </div>

      {/* Operator Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">CYBER LEVEL</span>
          <div className="text-xl font-mono font-black text-cyan-400">LVL {profile.cyberLevel}</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">TOTAL XP</span>
          <div className="text-xl font-mono font-black text-slate-100">{profile.xp} XP</div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">DAY STREAK</span>
          <div className="flex items-center gap-1 text-xl font-mono font-black text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400/20" />
            <span>{profile.streak} Days</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">SIMULATION HOURS</span>
          <div className="text-xl font-mono font-black text-purple-400">{profile.labHours} HRS</div>
        </div>
      </div>

      {/* TODAY'S 4-STAGE LEARNING PLAN: CONTINUE VIDEO -> PRACTICE LAB -> MISSION -> AMAN REVIEW */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ROLE-ALIGNED DAILY WORKFLOW</span>
            </div>
            <h2 className="text-lg font-mono font-black text-white uppercase">
              Today's 4-Stage Learning Plan
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Path: <strong className="text-cyan-300">{roleConfig.title}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* STAGE 1: CONTINUE VIDEO */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  STEP 1 • VIDEO
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {nextVideo?.durationSeconds ? `${Math.round(nextVideo.durationSeconds / 60)}m` : '15m'}
                </span>
              </div>
              <h3 className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                {nextVideo ? nextVideo.title : 'Role Overview & Core Concepts'}
              </h3>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                {nextVideo ? nextVideo.description : 'Watch key architectural concepts before starting range commands.'}
              </p>
            </div>

            <Link
              to={nextVideo ? `/video-learning?videoId=${nextVideo.id}` : '/video-learning'}
              className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all group-hover:border-cyan-400"
            >
              <Play className="w-3 h-3 fill-cyan-300" />
              <span>CONTINUE VIDEO</span>
            </Link>
          </div>

          {/* STAGE 2: PRACTICE LAB */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  STEP 2 • LAB
                </span>
                <span className="text-[10px] font-mono text-slate-500">20m</span>
              </div>
              <h3 className="text-xs font-mono font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                {roleConfig.recommendedModules[0]?.title || 'Interactive Terminal Sandboxes'}
              </h3>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Execute live simulated shell commands and verify defensive/offensive outputs.
              </p>
            </div>

            <Link
              to={roleNextAction.route || '/practice'}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all group-hover:border-indigo-400"
            >
              <Terminal className="w-3 h-3" />
              <span>PRACTICE LAB</span>
            </Link>
          </div>

          {/* STAGE 3: TACTICAL MISSION */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  STEP 3 • MISSION
                </span>
                <span className="text-[10px] font-mono text-slate-500">25m</span>
              </div>
              <h3 className="text-xs font-mono font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                {roleConfig.missions?.[0]?.title || 'Tactical Incident Response'}
              </h3>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Apply multi-stage procedures to investigate alerts or exploit target vectors.
              </p>
            </div>

            <button
              onClick={handleContinueMission}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all group-hover:border-emerald-400 cursor-pointer"
            >
              <Flag className="w-3 h-3" />
              <span>TACTICAL MISSION</span>
            </button>
          </div>

          {/* STAGE 4: AMAN REVIEW */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  STEP 4 • AI REVIEW
                </span>
                <span className="text-[10px] font-mono text-slate-500">5m</span>
              </div>
              <h3 className="text-xs font-mono font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                Autonomous AMAN Feedback
              </h3>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Get real-time drill questions, gap analysis, and tailored retention quizzes.
              </p>
            </div>

            <button
              onClick={handleAskAman}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all group-hover:border-purple-400 cursor-pointer"
            >
              <Bot className="w-3 h-3" />
              <span>AMAN REVIEW</span>
            </button>
          </div>
        </div>
      </div>

      {/* SKILL HEALTH & ADAPTIVE INTELLIGENCE RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* COL 1 & 2: ADAPTIVE NEXT BEST ACTION (TELEMETRY-DRIVEN) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                AMAN ADAPTIVE INTELLIGENCE • NEXT BEST MOVE
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
              adaptiveAction.urgency === 'HIGH' 
                ? 'bg-rose-950 text-rose-400 border border-rose-500/30' 
                : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
            }`}>
              {adaptiveAction.urgency} PRIORITY
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h3 className="text-base sm:text-lg font-mono font-bold text-white flex items-center gap-2">
                <span>{adaptiveAction.title}</span>
                <span className="text-xs text-slate-400 font-normal">({adaptiveAction.difficulty})</span>
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
                <span className="text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {adaptiveAction.timeEstimate}
                </span>
                <span>•</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  +{adaptiveAction.xpReward} XP
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              <strong className="text-cyan-400 font-mono">WHY AMAN RECOMMENDS THIS: </strong>
              {adaptiveAction.whyThis}
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">WHAT YOU WILL GAIN:</span>
              <ul className="space-y-1 text-slate-300 text-[11px] font-sans">
                {adaptiveAction.whatYouWillLearn.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Category: <strong className="text-slate-200">{adaptiveAction.category}</strong>
              </span>

              <button
                onClick={() => navigate(adaptiveAction.route)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                <span>Launch Recommended {adaptiveAction.activityType}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* COL 3: SKILL HEALTH & RETENTION RADAR */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  SKILL HEALTH & RETENTION
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {skillHealth.overallHealthScore}% Mastery
              </span>
            </div>

            {/* Top Strengths */}
            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">TOP STRENGTHS</span>
              {skillHealth.topStrengths.length > 0 ? (
                skillHealth.topStrengths.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                    <span className="text-slate-300 truncate">{s.name}</span>
                    <span className="text-emerald-400 font-bold">{s.mastery}%</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 font-sans">Complete labs to calibrate strengths.</p>
              )}
            </div>

            {/* Weakest Skills / Gaps */}
            <div className="space-y-1.5 font-mono text-xs pt-1">
              <span className="text-[10px] text-amber-500 uppercase font-bold block flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>GROWTH PRIORITIES</span>
              </span>
              {skillHealth.weakestSkills.length > 0 ? (
                skillHealth.weakestSkills.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-amber-500/20 text-[11px]">
                    <span className="text-slate-300 truncate">{s.name}</span>
                    <span className="text-amber-400 font-bold">{s.mastery}%</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 font-sans">No critical skill gaps identified.</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Mistake Journal:</span>
              <span className={skillHealth.pendingReviewCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                {skillHealth.pendingReviewCount} Pending Weaknesses
              </span>
            </div>
            <Link
              to="/mistakes"
              className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
            >
              <span>Open Mistake Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* CAREER TRACK ORCHESTRATOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
              Career Track Orchestrator
            </h2>
          </div>
          <Link
            to="/select-role"
            className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/25 uppercase transition-colors"
          >
            Explore All 11 Roles →
          </Link>
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

      {/* Secondary Hub Navigation Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/modules"
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 group-hover:scale-110 transition-transform">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-xs text-slate-200">LEARN MODULES</span>
        </Link>

        <Link
          to="/practice"
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-xs text-slate-200">PRACTICE LABS</span>
        </Link>

        <Link
          to="/roadmap"
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 group-hover:scale-110 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-xs text-slate-200">ROADMAP</span>
        </Link>

        <Link
          to="/learning-path"
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-xs text-slate-200">SKILL PROGRESS</span>
        </Link>
      </div>

    </div>
  );
};

export default DashboardPage;
