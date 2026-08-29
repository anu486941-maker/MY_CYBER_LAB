import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Shield, Terminal, Cpu, Zap } from 'lucide-react';
import { ExperienceLevel } from '../../types';

interface OnboardingStepExperienceProps {
  selectedExperience: ExperienceLevel;
  onSelectExperience: (level: ExperienceLevel) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ExperienceOption {
  id: ExperienceLevel;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  {
    id: 'beginner',
    title: 'Completely New',
    badge: 'ZERO PRIOR KNOWLEDGE',
    description: 'Starting from zero. No prior IT, networking, or cybersecurity background.',
    icon: Shield,
    accentColor: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
  },
  {
    id: 'some_computer',
    title: 'Beginner',
    badge: 'GENERAL TECH SAVVY',
    description: 'I know the basics. Familiar with general computing, browsers, and standard operating systems.',
    icon: Terminal,
    accentColor: 'border-blue-500/50 bg-blue-500/10 text-blue-400'
  },
  {
    id: 'some_linux',
    title: 'Intermediate',
    badge: 'SOME HANDS-ON',
    description: 'I have hands-on experience. Familiar with command line, Linux, basic networking, or programming.',
    icon: Cpu,
    accentColor: 'border-purple-500/50 bg-purple-500/10 text-purple-400'
  },
  {
    id: 'already_studying',
    title: 'Advanced',
    badge: 'EXPERIENCED PRACTITIONER',
    description: 'I am comfortable with cybersecurity concepts, penetration testing tools, and defensive frameworks.',
    icon: Zap,
    accentColor: 'border-amber-500/50 bg-amber-500/10 text-amber-400'
  }
];

export const OnboardingStepExperience: React.FC<OnboardingStepExperienceProps> = ({
  selectedExperience,
  onSelectExperience,
  onNext,
  onBack
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
          STEP 1 OF 6 • EXPERIENCE LEVEL
        </span>
        <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
          What's your current cybersecurity experience?
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Select the option that best reflects your current knowledge so AMAN can calibrate lessons.
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3 pt-2">
        {EXPERIENCE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedExperience === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onSelectExperience(opt.id)}
              className={`w-full p-4.5 rounded-2xl border text-left flex items-start justify-between gap-4 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] scale-[1.01]'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl border mt-0.5 ${opt.accentColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-white text-base">{opt.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{opt.description}</p>
                </div>
              </div>

              <div className="shrink-0 mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold'
                      : 'border-slate-700 bg-transparent'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-950 fill-cyan-400" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
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
          className="py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer ml-auto"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
