import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CinematicProductVideoModal } from '../components/common/CinematicProductVideoModal';
import { CyberForgeCore } from '../components/3d/CyberForgeCore';
import { Interactive3DCyberNetwork } from '../components/3d/Interactive3DCyberNetwork';
import { 
  Shield, 
  Terminal, 
  Network, 
  Trophy, 
  Bot, 
  Server, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Lock, 
  GitBranch,
  Crosshair,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Play,
  Crown,
  Check,
  Film
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveCareerTrack, currentUser } = useApp();
  const navigate = useNavigate();
  const [showCinematicVideo, setShowCinematicVideo] = useState<boolean>(false);

  const handleStartLearning = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // App routing will display WelcomeSignIn or Onboarding cleanly
    }
  };

  const handleExploreLabs = () => {
    const el = document.getElementById('hands-on-labs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/practice');
    }
  };

  const featureCards = [
    {
      title: 'Linux Training Lab',
      tag: 'SIMULATION MODE',
      desc: 'Simulated educational command line environment to practice essential triage, permissions, and tool workflows.',
      icon: Terminal,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
    },
    {
      title: 'Networking Simulator',
      tag: 'TOPOLOGY MAP',
      desc: 'Visual packet flows, ARP inspections, subnetting calculators, and device port analyzers.',
      icon: Network,
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/20'
    },
    {
      title: 'Web Security Lab',
      tag: 'OWASP TOP 10',
      desc: 'Practice discovering and remediating SQL injection, Cross-Site Scripting (XSS), and auth bypasses.',
      icon: Shield,
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/20'
    },
    {
      title: 'Ethical Hacking Range',
      tag: 'OFFENSIVE RECON',
      desc: 'Hands-on port enumeration, service scanning, vulnerability assessment, and exploit verification.',
      icon: Crosshair,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20'
    },
    {
      title: 'CTF Arena',
      tag: 'REAL FLAGS',
      desc: 'Solve authentic capture-the-flag challenges across Web, Linux, Forensics, and Cryptography.',
      icon: Trophy,
      color: 'text-rose-400 border-rose-500/30 bg-rose-950/20'
    },
    {
      title: 'Safe Cyber Range',
      tag: 'ISOLATED TARGETS',
      desc: 'Multi-phase penetration testing maps against simulated machines in controlled sandboxes.',
      icon: Server,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/20'
    },
    {
      title: 'AMAN AI Mentor',
      tag: 'PERSONAL TUTOR',
      desc: '24/7 AI guide providing plain analogies, command breakdowns, and step-by-step hint ladders.',
      icon: Bot,
      color: 'text-teal-400 border-teal-500/30 bg-teal-950/20'
    },
    {
      title: 'Skill Tracking & Mastery',
      tag: 'TELEMETRY ENGINE',
      desc: 'Continuous mastery tracking across 12 core domains with automated mistake drill generation.',
      icon: GitBranch,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. CINEMATIC LANDING PAGE HERO */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Layer 1 & 2: Atmospheric Gradient & Grid Backdrop */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden">
          {/* Radial Light behind Core */}
          <div className="absolute right-0 top-1/4 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-violet-600/20 rounded-full blur-[140px]" />
          {/* Faint Cyber Environment Glow */}
          <div className="absolute left-0 bottom-10 w-[500px] h-[500px] bg-indigo-950/30 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto pt-4">
          
          {/* Left Side: Headline & Copy */}
          <div className="lg:col-span-7 space-y-8 text-left z-10">
            
            {/* Small Eyebrow */}
            <div className="inline-flex items-center">
              <span className="px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-md">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                CYBERFORGE AI
              </span>
            </div>

            {/* Main Hero Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-black text-white tracking-tight uppercase leading-[0.98]">
                CYBERSECURITY<br />
                LEARNING,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
                  REIMAGINED.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-xl">
                Master cybersecurity through hands-on labs, real-world scenarios, and AI-powered guidance.
              </p>
            </div>

            {/* Hero CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleStartLearning}
                className="py-4 px-8 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-95 text-slate-950 font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(6,182,212,0.35)] hover:shadow-[0_0_45px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>ENTER THE CYBER RANGE</span>
                <ArrowRight className="w-4.5 h-4.5 text-slate-950" />
              </button>

              <button
                onClick={handleExploreLabs}
                className="py-4 px-7 rounded-xl border border-cyan-500/40 bg-slate-900/90 hover:bg-slate-800 hover:border-cyan-400 text-cyan-300 font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Server className="w-4 h-4 text-cyan-400" />
                <span>EXPLORE THE LABS</span>
              </button>

              <button
                onClick={() => setShowCinematicVideo(true)}
                className="py-4 px-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-cyan-400" />
                <span>SHOWCASE (2:00)</span>
              </button>
            </div>

            {/* Metric Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono text-left">
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-0.5">
                <span className="text-xl font-bold text-cyan-400">10+</span>
                <span className="text-[11px] text-slate-400 block font-sans">Interactive Sandboxes</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-0.5">
                <span className="text-xl font-bold text-indigo-400">100+</span>
                <span className="text-[11px] text-slate-400 block font-sans">Missions & CTFs</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-0.5">
                <span className="text-xl font-bold text-emerald-400">24/7</span>
                <span className="text-[11px] text-slate-400 block font-sans">AMAN AI Mentorship</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-0.5">
                <span className="text-xl font-bold text-amber-400">100%</span>
                <span className="text-[11px] text-slate-400 block font-sans">SHA-256 Credentials</span>
              </div>
            </div>

          </div>

          {/* Right Side: Cinematic 3D Hero CyberForge Core */}
          <div className="lg:col-span-5 w-full relative z-10">
            <CyberForgeCore />
          </div>

        </div>

        {/* Bottom Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 pt-8 font-mono text-[10px] text-slate-400 uppercase tracking-widest animate-pulse pointer-events-none">
          <span>SCROLL TO EXPLORE</span>
          <div className="w-[1px] h-7 bg-gradient-to-b from-cyan-400 via-cyan-500/50 to-transparent" />
        </div>
      </section>

      {/* 3 PRIMARY PILLARS FEATURE REVEAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all group shadow-[0_0_30px_rgba(6,182,212,0.05)] hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              PILLAR 01
            </span>
            <h3 className="text-xl font-mono font-bold text-white mb-2">HANDS-ON LABS</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Practice real cybersecurity concepts through interactive Linux terminals, networking tools, OWASP web vulnerabilities, and live CTFs.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/50 transition-all group shadow-[0_0_30px_rgba(139,92,246,0.05)] hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-violet-950/80 border border-violet-500/40 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest block mb-1">
              PILLAR 02
            </span>
            <h3 className="text-xl font-mono font-bold text-white mb-2">AMAN AI</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Your personal 24/7 AI cybersecurity instructor providing real-time command breakdowns, concept analogies, and hint ladders.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all group shadow-[0_0_30px_rgba(16,185,129,0.05)] hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Server className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              PILLAR 03
            </span>
            <h3 className="text-xl font-mono font-bold text-white mb-2">CYBER RANGE</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Explore realistic multi-machine security environments across corporate Active Directory, healthcare PACS, and banking infrastructures.
            </p>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED INTERACTIVE 3D CYBER NETWORK VISUALIZATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D INTERACTIVE CYBER RANGE TOPOLOGY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight">
            Explore Real Cybersecurity Environments
          </h2>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Inspect real network topology nodes, active asset roles, open services, and live audit telemetry across FinVault, PACS Healthcare, and Enterprise Active Directory target ranges.
          </p>
        </div>

        {/* 3D Network Component */}
        <Interactive3DCyberNetwork />
      </section>

      {/* Featured Career Paths */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            CAREER SPECIALIZATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            Choose Your Cyber Track
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ethical Hacker Card */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 flex flex-col justify-between space-y-6 hover:border-cyan-500/60 transition-all shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
                <Crosshair className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">OFFENSIVE SECURITY</span>
                <h3 className="text-2xl font-mono font-bold text-white">ETHICAL HACKER</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Master authorized reconnaissance, port scanning, network exploitation, web vulnerability discovery, and CTF challenges.
              </p>
            </div>
            <button
              onClick={() => { setActiveCareerTrack('ETHICAL_HACKER'); navigate('/dashboard'); }}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>EXPLORE ETHICAL HACKER TRACK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* SOC Analyst Card */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/30 flex flex-col justify-between space-y-6 hover:border-amber-500/60 transition-all shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/60 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">DEFENSIVE SECURITY</span>
                <h3 className="text-2xl font-mono font-bold text-white">SOC ANALYST</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Master security operations center analysis, live SIEM log triage, threat hunting, malware detection, and incident response.
              </p>
            </div>
            <button
              onClick={() => { setActiveCareerTrack('SOC_ANALYST'); navigate('/dashboard'); }}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>EXPLORE SOC ANALYST TRACK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Hands-on Labs & Capabilities Grid */}
      <section id="hands-on-labs" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            HANDS-ON SIMULATION INFRASTRUCTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-mono font-bold text-white">
            Practical Security Sandboxes
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Real tools and terminal environments operating safely inside your browser session.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl border w-fit ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      {feat.tag}
                    </span>
                    <h4 className="font-mono font-bold text-white text-base">{feat.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Whop Commercial Membership Showcase */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>COMMERCIAL WHOP MEMBERSHIP</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-mono font-bold text-white">
            Starter vs. Pro Academy Passes
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Test-drive the basics for free, or unlock the full Cyber Range, all 30+ comprehensive modules, and 24/7 unrestricted AMAN AI mentorship through Whop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Starter Card */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">COMMUNITY ACCESS</span>
              <h3 className="text-2xl font-mono font-bold text-white">Free Starter Pass</h3>
              <div className="text-3xl font-mono font-black text-white">$0 <span className="text-xs font-mono text-slate-400">/ forever free</span></div>
              <ul className="space-y-2 pt-2 text-xs text-slate-300 font-sans">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Security Foundations (Levels 1–3)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Basic Sandboxed Linux Terminal</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> First 2 Beginner CTF Challenges</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> AMAN AI Socratic Hints (Standard)</li>
              </ul>
            </div>
            <button
              onClick={handleStartLearning}
              className="w-full py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Start Free Preview
            </button>
          </div>

          {/* Whop Pro Academy Card */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/60 flex flex-col justify-between space-y-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-mono text-[10px] font-black uppercase tracking-widest shadow-md">
              WHOP OFFICIAL
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">ALL-INCLUSIVE PASS</span>
              <h3 className="text-2xl font-mono font-bold text-white">Pro Academy Pass</h3>
              <div className="text-3xl font-mono font-black text-white">$29 <span className="text-xs font-mono text-slate-400">/ month or $199 lifetime</span></div>
              <ul className="space-y-2 pt-2 text-xs text-slate-300 font-sans">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>All 30+ Deep Learning Modules</strong> & Career Tracks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Cyber Range Machine Targets</strong> (WebForge, AD)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Dual-Lens Telemetry</strong> & AI Wargame Arena</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Unrestricted AMAN AI Mentorship</strong> with Deep Dives</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 shrink-0" /> <strong>Verifiable SHA-256 Certificates</strong> & Portfolio Export</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>VIEW WHOP PRICING & DETAILS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Final Bottom Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-mono font-black text-white">
              Ready to Start Your Cybersecurity Journey?
            </h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
              Join CyberForge AI today and experience hands-on learning guided by AMAN AI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartLearning}
              className="w-full sm:w-auto py-4 px-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <span>GET STARTED NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCinematicVideo(true)}
              className="w-full sm:w-auto py-4 px-6 rounded-xl border border-cyan-500/40 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Film className="w-4 h-4 text-cyan-400" />
              <span>WATCH 2:00 SHOWCASE</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive 2-Minute Cinematic Showcase Modal */}
      <CinematicProductVideoModal 
        isOpen={showCinematicVideo} 
        onClose={() => setShowCinematicVideo(false)} 
      />
    </div>
  );
};
