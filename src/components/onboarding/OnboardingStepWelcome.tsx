import React from 'react';
import { Bot, Shield, ArrowRight, Sparkles, Terminal, Compass, CheckCircle2 } from 'lucide-react';

interface OnboardingStepWelcomeProps {
  onNext: () => void;
  userName: string;
}

export const OnboardingStepWelcome: React.FC<OnboardingStepWelcomeProps> = ({ onNext, userName }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center space-y-8 animate-fadeIn relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* AMAN Avatar Icon */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border-2 border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
            <Bot className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-950 font-bold">
            ✓
          </span>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            MY CYBER LAB ONBOARDING
          </div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
            Welcome to MY CYBER LAB 👋
          </h1>
        </div>
      </div>

      {/* AMAN Introduction Text */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3 font-sans">
        <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>AMAN • Your AI Cybersecurity Mentor</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          Hello {userName || 'Operator'}! I'm <strong className="text-cyan-300">AMAN</strong>, your dedicated cybersecurity mentor. Whether you're starting from zero or sharpening advanced skills, I will guide you with structured lessons, interactive labs, hint ladders, and personalized career roadmaps.
        </p>
        <p className="text-slate-400 text-xs">
          Let's take 2 minutes to personalize your learning journey based on your background and goals.
        </p>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-mono font-bold text-white">Hands-On Labs</h4>
          <p className="text-[11px] text-slate-400 leading-snug">Practice real terminal commands and exploits safely in-browser.</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
          <Compass className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-mono font-bold text-white">Tailored Path</h4>
          <p className="text-[11px] text-slate-400 leading-snug">Customized module trajectory adapted to your career aspirations.</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-mono font-bold text-white">Real Verification</h4>
          <p className="text-[11px] text-slate-400 leading-snug">Earn verifiable certificates and track your skill mastery.</p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onNext}
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
      >
        <span>GET STARTED</span>
        <ArrowRight className="w-4 h-4 text-slate-950" />
      </button>
    </div>
  );
};
