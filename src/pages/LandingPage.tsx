import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveCareerTrack, currentUser } = useApp();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // App routing will display WelcomeSignIn or Onboarding cleanly
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
      {/* Hero Section */}
      <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-8">
        
        {/* Glow backdrop */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/30 via-blue-600/20 to-purple-600/30 rounded-full blur-[100px]" />
        </div>

        {/* Top Tagline Badge */}
        <div className="inline-flex items-center justify-center">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI-POWERED CYBERSECURITY LEARNING PLATFORM
          </span>
        </div>

        {/* Main Hero Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-mono font-black text-white tracking-tight leading-tight">
            Learn Cybersecurity.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400">
              Build Real Skills.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 font-sans max-w-3xl mx-auto leading-relaxed">
            An AI-powered cybersecurity learning environment where you learn concepts, practice in hands-on labs, solve challenges, and build real-world security skills.
          </p>
        </div>

        {/* Hero CTA Action Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleStartLearning}
            className="w-full sm:w-auto py-4 px-8 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <span>START LEARNING</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={() => scrollToSection('hands-on-labs')}
            className="w-full sm:w-auto py-4 px-7 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>EXPLORE LABS</span>
          </button>
        </div>

        {/* Feature Badges Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-left font-mono">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-2xl font-bold text-cyan-400">10+</span>
            <span className="text-xs text-slate-400 block font-sans">Interactive Labs & Sandboxes</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-2xl font-bold text-indigo-400">100+</span>
            <span className="text-xs text-slate-400 block font-sans">Hands-on Missions & CTFs</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-2xl font-bold text-emerald-400">24/7</span>
            <span className="text-xs text-slate-400 block font-sans">AMAN AI Socratic Mentorship</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-2xl font-bold text-amber-400">100%</span>
            <span className="text-xs text-slate-400 block font-sans">Verifiable Skill Credentials</span>
          </div>
        </div>

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

      {/* Final Bottom Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-mono font-black text-white">
              Ready to Start Your Cybersecurity Journey?
            </h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
              Join MY CYBER LAB today and experience hands-on learning guided by AMAN AI.
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
          </div>
        </div>
      </section>
    </div>
  );
};
