import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCareerRoleById, CAREER_ROLES_DATA } from '../data/careerRolesData';
import { AmanInstructionBanner } from '../components/common/AmanInstructionBanner';
import { 
  Compass, 
  Shield, 
  Terminal, 
  Cpu, 
  Network, 
  Lock, 
  CheckCircle2, 
  PlayCircle, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Award,
  Layers,
  Crosshair,
  ShieldAlert,
  Flame,
  Search,
  Video,
  Wrench,
  HelpCircle,
  Briefcase,
  Target,
  Clock,
  Eye
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { learningState, profile, levels, setSelectedLesson, updateProfile, activeCareerTrack } = useApp();
  const navigate = useNavigate();

  const unresolvedMistakes = learningState.pendingMistakes;
  const weakSkills = learningState.weakSkills;

  const currentRole = CAREER_ROLES_DATA.find(r => r.id === (activeCareerTrack === 'SOC_ANALYST' ? 'soc-analyst' : 'ethical-hacker')) || CAREER_ROLES_DATA[0];
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FOUNDATION' | 'CORE' | 'PRACTICAL_LAB' | 'MISSION' | 'CAPSTONE'>('ALL');
  const [expandedStepId, setExpandedStepId] = useState<string | null>(currentRole.curriculumSequence[0]?.id || null);

  const handleLaunchStep = (levelRef: number, stepName?: string) => {
    const targetLvl = levels.find((l) => l.level === levelRef) || levels[0];
    if (targetLvl && targetLvl.lessons && targetLvl.lessons.length > 0) {
      setSelectedLesson(targetLvl.lessons[0]);
    } else {
      navigate('/learning-path');
    }
  };

  const calculateNodeStatus = (index: number, levelRef: number) => {
    const lvl = levels.find((l) => l.level === levelRef);
    if (lvl && lvl.completedLessons >= Math.min(lvl.lessonsCount, 3)) {
      return 'COMPLETED';
    }
    if (index === 0 || index === 1) {
      return lvl && lvl.completedLessons > 0 ? 'IN PROGRESS' : 'CURRENT';
    }
    if (index === 2) {
      return 'NEXT';
    }
    return 'LOCKED';
  };

  const filteredSteps = activeFilter === 'ALL'
    ? currentRole.curriculumSequence
    : currentRole.curriculumSequence.filter((s) => s.milestoneType === activeFilter);

  const completedStepsCount = currentRole.curriculumSequence.filter((step, idx) => {
    const status = calculateNodeStatus(idx, step.levelRef);
    return status === 'COMPLETED';
  }).length;

  const progressPercentage = Math.round((completedStepsCount / currentRole.curriculumSequence.length) * 100);

  return (
    <div id="roadmap-page" className="space-y-8 pb-20">
      
      {/* AUTONOMOUS AMAN INSTRUCTION BANNER */}
      <AmanInstructionBanner />

      {/* Header Banner - Career Track Focused */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
                <Compass className="w-3.5 h-3.5" />
                PERSONALIZED CAREER ROADMAP
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentRole.emoji}</span>
                <h1 className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                  {currentRole.title} Track
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl">
                {currentRole.tagline}
              </p>
            </div>

            {/* Quick Actions & Role Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/modules"
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-950/50"
              >
                <Terminal className="w-4 h-4" /> HANDS-ON CYBER LABS
              </Link>
              <Link
                to="/roles"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Briefcase className="w-4 h-4" /> CHANGE ROLE
              </Link>
              <Link
                to="/learning-path"
                className="px-4 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4" /> FULL 32-LEVELS LIST
              </Link>
            </div>
          </div>

          {/* Progress Bar & Quick Stats */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Roadmap Progress:</span>
                <span className="font-bold text-cyan-400">{completedStepsCount} of {currentRole.curriculumSequence.length} Milestones Mastered</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span>⏱️ {currentRole.estimatedHours} Total Training Hours</span>
                <span>🧪 {currentRole.labsCount} Practical Labs</span>
                <span>🎯 {currentRole.missionsCount} Operational Missions</span>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.max(12, progressPercentage)}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {[
            { id: 'ALL', label: 'ALL MILESTONES' },
            { id: 'FOUNDATION', label: 'FOUNDATION' },
            { id: 'CORE', label: 'CORE THEORY' },
            { id: 'PRACTICAL_LAB', label: 'HANDS-ON LABS' },
            { id: 'MISSION', label: 'MISSIONS' },
            { id: 'CAPSTONE', label: 'CAPSTONE' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <strong className="text-cyan-300">{filteredSteps.length}</strong> modules
        </div>
      </div>

      {/* DYNAMIC ROADMAP ADAPTATION NODE */}
      {(unresolvedMistakes.length > 0 || weakSkills.length > 0) ? (
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AMAN DYNAMIC REMEDIATION NODE INSERTED
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">
              PRIORITY REVISION
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-mono font-bold text-white">
              {unresolvedMistakes.length > 0
                ? `Remediation Drill: ${unresolvedMistakes[0].title}`
                : `Skill Polish: ${weakSkills[0]?.category || weakSkills[0]?.name}`}
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              <strong>WHY: </strong>
              {unresolvedMistakes.length > 0
                ? `AMAN detected ${unresolvedMistakes.length} unresolved mistake in your journal (${unresolvedMistakes[0].title || 'Concept Check'}). Correcting this mistake is required before unlocking capstone evaluations.`
                : `Your mastery in ${weakSkills[0]?.category || weakSkills[0]?.name} is currently ${weakSkills[0]?.masteryPercentage || 0}%. Practice a targeted drill to reinforce your baseline.`}
            </p>
          </div>
          <div className="pt-1 flex items-center gap-3">
            <button
              onClick={() => navigate(unresolvedMistakes.length > 0 ? '/mistakes' : '/practice')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-xs uppercase flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Crosshair className="w-4 h-4" />
              <span>START REMEDIATION NOW</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">Est. Time: 10 min</span>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-300 font-bold">
              ROADMAP HEALTH OPTIMAL: Zero pending mistakes recorded. Standard progression active.
            </span>
          </div>
          <button
            onClick={() => navigate('/practice')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline font-bold cursor-pointer"
          >
            Practice Sandbox
          </button>
        </div>
      )}

      {/* Milestone Progression Chain */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {filteredSteps.map((step, idx) => {
          const status = calculateNodeStatus(idx, step.levelRef);
          const isCompleted = status === 'COMPLETED';
          const isInProgress = status === 'IN PROGRESS';
          const isCurrent = status === 'CURRENT' || status === 'NEXT';
          const isLocked = status === 'LOCKED';
          const isExpanded = expandedStepId === step.id;

          return (
            <div key={step.id} className="relative">
              {/* Connector line between steps */}
              {idx < filteredSteps.length - 1 && (
                <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/40 via-slate-800 to-slate-900 -z-0" />
              )}

              <div
                className={`relative z-10 rounded-2xl border transition-all p-5 sm:p-6 ${
                  isCompleted
                    ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-500/60'
                    : isInProgress
                    ? 'bg-slate-900/95 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.18)] ring-1 ring-cyan-500/40'
                    : isCurrent
                    ? 'bg-slate-900/80 border-slate-700 hover:border-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Left: Icon & Badge */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
                        isCompleted
                          ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400 shadow-sm'
                          : isInProgress
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 animate-pulse'
                          : isCurrent
                          ? 'bg-slate-900 border-slate-700 text-slate-200'
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-slate-600" />
                      ) : (
                        <span>0{idx + 1}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-mono font-bold text-white">
                          {step.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            isCompleted
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                              : isInProgress
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                              : isCurrent
                              ? 'bg-blue-950 text-blue-300 border-blue-500/30'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {status}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                          {step.moduleCategory}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {step.shortDescription}
                      </p>

                      {/* Golden Learning Loop Indicators */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> Theory
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-teal-300 flex items-center gap-1">
                          <Video className="w-3 h-3" /> Video
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                          <Terminal className="w-3 h-3" /> Practice Lab
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-purple-300 flex items-center gap-1">
                          <Crosshair className="w-3 h-3" /> Mission
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Quiz & Boss
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleLaunchStep(step.levelRef, step.title)}
                      className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                          : isInProgress
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:opacity-90'
                          : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      {isCompleted ? 'REVIEW MODULE' : isInProgress ? 'CONTINUE LEARNING' : 'START MODULE'}
                    </button>
                  </div>

                </div>

                {/* Practical lab & Tools note */}
                {step.practicalLabName && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Lab: {step.practicalLabName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Tools: {step.toolsUsed.join(', ')}</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Capstone Card at bottom */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/40 space-y-4 max-w-4xl mx-auto shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
            <Award className="w-4 h-4" /> OFFICIAL CAREER CAPSTONE PROJECT
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            ACCREDITED PORTFOLIO
          </span>
        </div>

        <h3 className="text-xl font-mono font-bold text-white">
          {currentRole.capstoneProject.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          {currentRole.capstoneProject.description}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400">
            Deliverable: <strong className="text-slate-200">{currentRole.capstoneProject.deliverable}</strong>
          </div>

          <Link
            to="/master-cyber-range"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-mono font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Shield className="w-4 h-4" /> LAUNCH MASTER CYBER RANGE
          </Link>
        </div>
      </div>

    </div>
  );
};
