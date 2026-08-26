import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Terminal, 
  Network, 
  Trophy, 
  Bot, 
  Map, 
  Server, 
  Video, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  Cpu, 
  Lock, 
  GitBranch,
  PlayCircle,
  Crosshair
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const LandingPage: React.FC = () => {
  const { setIsOnboardingOpen, setActiveCareerTrack } = useApp();
  const navigate = useNavigate();

  const handleStartFromZero = () => {
    navigate('/learning-path');
  };

  const handleWhatShouldILearn = () => {
    navigate('/ai-mentor');
  };

  const featureCards = [
    {
      title: 'AI Cybersecurity Mentor',
      tag: 'PERSONAL TUTOR',
      desc: '24/7 AI guide with analogies, code explanations, hints, and step-by-step guidance tailored for beginners.',
      icon: Bot,
      route: '/ai-mentor',
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/20'
    },
    {
      title: 'Tactical Game Missions',
      tag: 'STORY-DRIVEN',
      desc: 'Hands-on operational missions with XP rewards, live checklists, tactical briefings, and clear objectives.',
      icon: Terminal,
      route: '/missions',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20'
    },
    {
      title: 'Linux Training Lab',
      tag: 'SIMULATION MODE',
      desc: 'Simulated educational command line environment to practice essential triage, permissions, and tool workflows.',
      icon: Terminal,
      route: '/linux-lab',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
    },
    {
      title: 'Networking Simulator',
      tag: 'TOPOLOGY MAP',
      desc: 'Visual packet flows, ARP inspections, subnetting calculators, and device port analyzers.',
      icon: Network,
      route: '/network-lab',
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/20'
    },
    {
      title: 'CTF Arena',
      tag: 'REAL FLAGS',
      desc: 'Solve authentic capture-the-flag challenges across Web, Linux, Forensics, and Cryptography.',
      icon: Trophy,
      route: '/ctf-arena',
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/20'
    },
    {
      title: 'Safe Cyber Range',
      tag: 'ISOLATED TARGETS',
      desc: 'Multi-phase penetration testing maps against fictional machines like Nightfall in controlled sandboxes.',
      icon: Server,
      route: '/cyber-range',
      color: 'text-rose-400 border-rose-500/30 bg-rose-950/20'
    },
    {
      title: 'AI Video Learning',
      tag: 'CURATED LESSONS',
      desc: 'Curated high-yield video breakdowns from verified cybersecurity educators matched to every level.',
      icon: Video,
      route: '/learning-path',
      color: 'text-teal-400 border-teal-500/30 bg-teal-950/20'
    },
    {
      title: 'Skill Tree & Progress',
      tag: '22 LEVEL ROADMAP',
      desc: 'Unlockable skill tiers from Level 0 Computer Basics to Level 21 Enterprise Cyber Range Capstone.',
      icon: GitBranch,
      route: '/skill-tree',
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-8">
        
        {/* Career Selection Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-5xl mx-auto">
          {/* Ethical Hacker Card */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 flex flex-col items-center text-center space-y-4">
             <div className="p-4 rounded-full bg-cyan-950/50 text-cyan-400">
               <Crosshair className="w-8 h-8" />
             </div>
             <h2 className="text-2xl font-bold text-white">ETHICAL HACKER</h2>
             <p className="text-sm text-slate-400">Offensive Security & Authorized Penetration Testing</p>
             <button
               onClick={() => { setActiveCareerTrack('ETHICAL_HACKER'); navigate('/dashboard'); }}
               className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold"
             >
               ENTER ETHICAL HACKER
             </button>
          </div>
          
          {/* SOC Analyst Card */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/30 flex flex-col items-center text-center space-y-4">
             <div className="p-4 rounded-full bg-amber-950/50 text-amber-400">
               <Shield className="w-8 h-8" />
             </div>
             <h2 className="text-2xl font-bold text-white">SOC ANALYST</h2>
             <p className="text-sm text-slate-400">Defensive Security, Detection & Incident Response</p>
             <button
               onClick={() => { setActiveCareerTrack('SOC_ANALYST'); navigate('/dashboard'); }}
               className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold"
             >
               ENTER SOC ANALYST
             </button>
          </div>
        </div>

        
        {/* Glow backdrop */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/30 via-blue-600/20 to-purple-600/30 rounded-full blur-[100px]" />
        </div>

        {/* Top Tagline Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            START FROM ZERO. LEARN THROUGH MISSIONS.
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs hidden sm:inline">
            PRACTICE SAFELY. MASTER ETHICAL HACKING.
          </span>
        </div>

        {/* Main Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-black text-slate-100 tracking-tight leading-none">
            MASTER ETHICAL HACKING <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              FROM ZERO.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-sans font-normal max-w-2xl mx-auto tracking-wide">
            Learn. Practice. Investigate. Secure.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl mx-auto">
            A personal AI-assisted cybersecurity academy and safe simulated range designed for complete beginners to master ethical penetration testing.
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStartFromZero}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-mono font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
          >
            START FROM ZERO
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleWhatShouldILearn}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            WHAT SHOULD I LEARN?
          </button>
        </div>

        {/* Secondary Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-2">
          <Link to="/cyber-range" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 underline">
            <Server className="w-3.5 h-3.5 text-slate-400" /> ENTER CYBER RANGE
          </Link>
          <span>•</span>
          <Link to="/skill-tree" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 underline">
            <GitBranch className="w-3.5 h-3.5 text-slate-400" /> VIEW SKILL TREE
          </Link>
          <span>•</span>
          <Link to="/dashboard" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 underline">
            <Terminal className="w-3.5 h-3.5 text-slate-400" /> OPEN DASHBOARD
          </Link>
        </div>

        {/* Ethical Box */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 max-w-2xl mx-auto text-left flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-mono font-bold text-emerald-300 uppercase tracking-wider">
              ETHICAL-USE GUARANTEE & SAFETY DIRECTIVE
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              &ldquo;ONLY TEST SYSTEMS YOU OWN OR HAVE EXPLICIT PERMISSION TO TEST.&rdquo;
            </p>
            <p className="text-slate-400 font-mono text-[11px]">
              All practical exercises on My Cyber Lab use isolated fictional environments, simulated networks, and dedicated training containers.
            </p>
          </div>
        </div>

      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              COMPREHENSIVE ECOSYSTEM
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100 mt-1">
              THE 8 PILLARS OF MY CYBER LAB
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Stage 1: Premium Interactive Frontend Architecture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link
                key={idx}
                to={feat.route}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-mono font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {feat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Secondary Tagline Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-center space-y-6 relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              LEARNING PARADIGM
            </span>
            <h2 className="text-3xl sm:text-5xl font-mono font-black text-slate-100 tracking-tight">
              LEARN. PRACTICE. UNDERSTAND. MASTER.
            </h2>
            <p className="text-sm text-slate-400 font-mono max-w-xl mx-auto pt-2">
              No previous programming, Linux, or hacking experience required.
              Step through our 22-level curriculum at your own pace.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              CONFIGURE LEARNING PROFILE
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono font-bold text-xs flex items-center gap-2"
            >
              LAUNCH OPERATOR DASHBOARD
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
