import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CAREER_ROLES_DATA, getCareerRoleById } from '../data/careerRolesData';
import { CareerRole, CareerRoleId, CareerCategory } from '../types';
import { SmartNextStepBanner } from '../components/common/SmartNextStepBanner';
import {
  Shield,
  Crosshair,
  Terminal,
  Network,
  Cloud,
  Cpu,
  Microscope,
  Trophy,
  Globe,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Briefcase,
  Flame,
  Award,
  BookOpen,
  Eye,
  X,
  ChevronRight,
  Layers,
  Wrench,
  HelpCircle
} from 'lucide-react';

export const CareerRolesPage: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<CareerCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewRole, setPreviewRole] = useState<CareerRole | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'curriculum' | 'capstone' | 'interview'>('overview');

  const currentRole = getCareerRoleById(profile.targetRole || 'soc-analyst');

  const handleSelectRole = (role: CareerRole) => {
    updateProfile({ targetRole: role.id });
    setPreviewRole(null);
  };

  const handleStartCareerPath = (role: CareerRole) => {
    updateProfile({ targetRole: role.id });
    setPreviewRole(null);
    navigate('/roadmap');
  };

  const filteredRoles = CAREER_ROLES_DATA.filter((role) => {
    // Category filter
    if (activeCategory === 'beginner' && !role.beginnerFriendly) return false;
    if (activeCategory === 'offensive' && role.category !== 'offensive' && role.category !== 'hybrid') return false;
    if (activeCategory === 'defensive' && role.category !== 'defensive' && role.category !== 'hybrid') return false;
    if (activeCategory === 'engineering' && role.category !== 'engineering') return false;
    if (activeCategory === 'forensics' && role.category !== 'forensics') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = role.title.toLowerCase().includes(q);
      const matchDesc = role.shortDescription.toLowerCase().includes(q) || role.fullDescription.toLowerCase().includes(q);
      const matchSkills = role.coreSkills.some((s) => s.toLowerCase().includes(q));
      const matchTools = role.commonTools.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchSkills || matchTools;
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> ROLE-BASED AI CYBERSECURITY ACADEMY
          </div>

          <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-white">
            WHAT DO YOU WANT TO BECOME?
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Select your specialized cybersecurity career path. MY CYBER LAB dynamically generates a personalized, role-specific curriculum, interactive lab sequence, real-world case studies, and career capstones tailored to your chosen specialization.
          </p>

          {/* Current Active Role Status */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Current Chosen Track:</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
              <span className="text-base">{currentRole.emoji}</span>
              <span className="font-mono text-xs font-bold text-cyan-300">{currentRole.title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
            <button
              onClick={() => {
                setPreviewRole(currentRole);
                setActivePreviewTab('overview');
              }}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
            >
              View Track Roadmap →
            </button>
          </div>
        </div>
      </div>

      {/* AMAN Proactive Career Guidance Banner */}
      <SmartNextStepBanner />

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs">
          {[
            { id: 'all', label: 'ALL ROLES (12)' },
            { id: 'beginner', label: 'BEGINNER FRIENDLY' },
            { id: 'defensive', label: 'DEFENSIVE / BLUE' },
            { id: 'offensive', label: 'OFFENSIVE / RED' },
            { id: 'engineering', label: 'ENGINEERING & CLOUD' },
            { id: 'forensics', label: 'DFIR & FORENSICS' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CareerCategory)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles, tools, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => {
          const isCurrentActive = profile.targetRole === role.id;

          return (
            <div
              key={role.id}
              className={`relative rounded-3xl p-6 transition-all flex flex-col justify-between border ${
                isCurrentActive
                  ? 'bg-slate-900 border-cyan-400 border-l-4 border-l-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge & Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                      {role.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-mono font-bold text-white group-hover:text-cyan-300">
                        {role.title}
                      </h3>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        {role.badge}
                      </span>
                    </div>
                  </div>

                  {isCurrentActive && (
                    <span className="px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" /> ACTIVE
                    </span>
                  )}
                </div>

                {/* Tagline & Short Description */}
                <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
                  {role.shortDescription}
                </p>

                {/* Key Metadata Pills */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase block">DIFFICULTY</span>
                    <span className={`font-semibold ${
                      role.difficulty === 'Beginner Friendly' ? 'text-emerald-400' : 'text-cyan-400'
                    }`}>
                      {role.difficulty}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase block">ESTIMATED TIME</span>
                    <span className="text-slate-200 font-semibold">
                      {role.estimatedWeeks} Wks • {role.estimatedHours}h
                    </span>
                  </div>
                </div>

                {/* Core Skills Preview */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    CORE SKILLS YOU WILL MASTER:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.coreSkills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {role.coreSkills.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                        +{role.coreSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Tools Preview */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    COMMON TOOLS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.commonTools.slice(0, 4).map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-800/70 text-slate-300 text-[11px] font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Outcome Preview */}
                <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-300 font-semibold">{role.careerOutcomes[0]?.title}</span>
                    <span className="text-emerald-400 font-bold">{role.careerOutcomes[0]?.averageSalary}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Market Demand: <strong className="text-cyan-400">{role.careerOutcomes[0]?.demand}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    setPreviewRole(role);
                    setActivePreviewTab('overview');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5" /> PREVIEW ROLE
                </button>

                <button
                  onClick={() => handleStartCareerPath(role)}
                  className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    isCurrentActive
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950'
                  }`}
                >
                  {isCurrentActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE TRACK
                    </>
                  ) : (
                    <>
                      SELECT ROLE <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROLE PREVIEW MODAL / DRAWER */}
      {previewRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative my-6 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
                  {previewRole.emoji}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold">
                      {previewRole.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      • {previewRole.estimatedWeeks} Weeks • {previewRole.estimatedHours} Hours
                    </span>
                  </div>
                  <h2 className="text-2xl font-mono font-bold text-white">
                    {previewRole.title}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {previewRole.tagline}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewRole(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 font-mono text-xs overflow-x-auto">
              {[
                { id: 'overview', label: 'WHAT YOU WILL LEARN' },
                { id: 'curriculum', label: `CURRICULUM SEQUENCE (${previewRole.curriculumSequence.length})` },
                { id: 'capstone', label: 'FINAL CAPSTONE & PROJECTS' },
                { id: 'interview', label: 'CAREER & INTERVIEW PREP' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id as typeof activePreviewTab)}
                  className={`px-4 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activePreviewTab === tab.id
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body with Custom Scrollbar */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              {/* TAB 1: OVERVIEW */}
              {activePreviewTab === 'overview' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                      ROLE OVERVIEW & MISSION STATEMENT
                    </h4>
                    <p className="text-sm text-slate-200 font-sans leading-relaxed">
                      {previewRole.fullDescription}
                    </p>
                  </div>

                  {/* Core Skills & Tools Grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> CORE SKILLS YOU DEVELOP
                      </h4>
                      <ul className="space-y-2 text-xs font-mono text-slate-300">
                        {previewRole.coreSkills.map((skill, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                        <Wrench className="w-4 h-4" /> TOOLS & ENVIRONMENTS
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {previewRole.commonTools.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Career Salaries & Demand */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" /> CAREER OUTCOMES & INDUSTRY DEMAND
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {previewRole.careerOutcomes.map((out, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                          <div className="text-xs font-mono font-bold text-white">{out.title}</div>
                          <div className="text-sm font-mono font-extrabold text-emerald-400">{out.averageSalary}</div>
                          <span className="text-[10px] font-mono text-slate-400 block">Demand: {out.demand}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CURRICULUM SEQUENCE */}
              {activePreviewTab === 'curriculum' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                        ROLE-SPECIFIC CURRICULUM SEQUENCE
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Structured step-by-step pathway from foundation to master capstone.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                      {previewRole.curriculumSequence.length} Milestones
                    </span>
                  </div>

                  <div className="space-y-3">
                    {previewRole.curriculumSequence.map((step, idx) => (
                      <div
                        key={step.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center font-mono font-extrabold text-xs text-cyan-300">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-white">{step.title}</span>
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                                {step.moduleCategory}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-sans mt-0.5">
                              {step.shortDescription}
                            </p>
                            {step.practicalLabName && (
                              <div className="mt-1.5 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                                🧪 Practical Lab: <span className="text-slate-200">{step.practicalLabName}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <span className="text-xs font-mono text-cyan-400 font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                            +{step.xpReward} XP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CAPSTONE & PROJECTS */}
              {activePreviewTab === 'capstone' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                      <Award className="w-4 h-4" /> OFFICIAL CAREER CAPSTONE PROJECT
                    </div>
                    <h3 className="text-xl font-mono font-bold text-white">
                      {previewRole.capstoneProject.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                      {previewRole.capstoneProject.description}
                    </p>

                    <div className="pt-2 space-y-2">
                      <span className="text-xs font-mono text-slate-400 uppercase font-bold block">
                        SKILLS APPLIED IN THIS CAPSTONE:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {previewRole.capstoneProject.skillsApplied.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                      <span className="text-slate-400 font-bold block mb-0.5">FINAL PORTFOLIO DELIVERABLE:</span>
                      <span className="text-slate-200">{previewRole.capstoneProject.deliverable}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INTERVIEW PREP */}
              {activePreviewTab === 'interview' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                      SAMPLE TECHNICAL INTERVIEW QUESTIONS
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Practice answering real interview scenarios tailored to this exact career role with AI Cyber Mentor.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {previewRole.sampleInterviewQuestions.map((q, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-start gap-2 font-mono text-xs text-white font-bold">
                          <span className="text-cyan-400">Q{idx + 1}:</span>
                          <span>{q.question}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-sans italic pl-5">
                          💡 Hint: {q.hint}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pl-5 pt-1">
                          {q.keyConcepts.map((k, kIdx) => (
                            <span key={kIdx} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-300 border border-slate-800">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400">
                Selected Role: <strong className="text-white">{previewRole.title}</strong>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setPreviewRole(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold cursor-pointer"
                >
                  CHANGE ROLE / BACK
                </button>

                <button
                  onClick={() => handleStartCareerPath(previewRole)}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-mono font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" /> START THIS CAREER PATH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
