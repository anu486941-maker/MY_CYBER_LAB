import React from 'react';
import { ArrowRight, ArrowLeft, Bot, Sparkles, Terminal, Lightbulb, Compass, Brain, Zap, ShieldCheck } from 'lucide-react';

interface OnboardingStepAmanIntroProps {
  onNext: () => void;
  onBack: () => void;
}

interface CapabilityItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  accent: string;
}

const AMAN_CAPABILITIES: CapabilityItem[] = [
  {
    icon: Lightbulb,
    title: 'Understand Complex Concepts',
    desc: 'Provides plain-English analogies, architectural breakdowns, and bilingual Hinglish explanations on demand.',
    accent: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    icon: Sparkles,
    title: 'Step-by-Step Hint Ladders',
    desc: 'When you are stuck on a lab or CTF, AMAN gives progressive hints without spoiling the final answer.',
    accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  },
  {
    icon: Terminal,
    title: 'Terminal & Command Explanation',
    desc: 'Deep dives into Linux flags, syntax, shell errors, and explains exactly what each parameter does.',
    accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    icon: Compass,
    title: 'Personalized Next Actions',
    desc: 'Always answers "What should I do next?" with high-precision recommendations tailored to your goals.',
    accent: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
  },
  {
    icon: Brain,
    title: 'Mistake Analysis & Drills',
    desc: 'Tracks misconceptions in your Mistakes Journal and schedules targeted practice drills to achieve mastery.',
    accent: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  },
  {
    icon: Zap,
    title: 'Adaptive Difficulty',
    desc: 'Dynamically scales challenge complexity as your skills grow from Novice Cadet to Cyber Specialist.',
    accent: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  }
];

export const OnboardingStepAmanIntro: React.FC<OnboardingStepAmanIntroProps> = ({
  onNext,
  onBack
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 animate-fadeIn relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-2 border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.25)]">
          <Bot className="w-8 h-8 animate-pulse" />
        </div>
        <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest uppercase block">
          STEP 5 OF 6 • MEET YOUR MENTOR
        </span>
        <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
          Meet AMAN AI Mentor
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
          AMAN is always active across all lessons, labs, terminals, and CTF arenas. Click <strong className="text-cyan-300">"ASK AMAN"</strong> or press the floating mentor button anytime.
        </p>
      </div>

      {/* Capabilities 6-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {AMAN_CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.title}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 space-y-0.5"
            >
              <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${cap.accent}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-mono font-bold text-white text-xs sm:text-sm">{cap.title}</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">{cap.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Try It Note */}
      <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-200 font-mono">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
        <span>You are ready to complete your first hands-on cybersecurity mission!</span>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <button
          onClick={onBack}
          className="py-3 px-5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <button
          onClick={onNext}
          className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-black text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all cursor-pointer ml-auto"
        >
          <span>START MY FIRST MISSION</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
