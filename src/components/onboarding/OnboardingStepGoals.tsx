import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Crosshair, Shield, ShieldAlert, Cpu, Terminal, Trophy, Briefcase, Compass } from 'lucide-react';
import { CareerRoleId } from '../../types';

interface OnboardingStepGoalsProps {
  selectedRole: CareerRoleId;
  onSelectRole: (role: CareerRoleId) => void;
  selectedGoals: string[];
  onToggleGoal: (goal: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface GoalOption {
  id: string;
  roleId: CareerRoleId;
  title: string;
  badge: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'goal-ethical-hacking',
    roleId: 'ethical-hacker',
    title: 'Ethical Hacking',
    badge: 'OFFENSIVE',
    desc: 'Offensive security, network penetration, recon, and ethical vulnerability discovery.',
    icon: Crosshair,
    accentColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
  },
  {
    id: 'goal-pentesting',
    roleId: 'pentester',
    title: 'Penetration Testing',
    badge: 'RED TEAM',
    desc: 'System exploitation, privilege escalation, web attack vectors, and executive reporting.',
    icon: Terminal,
    accentColor: 'border-red-500/40 bg-red-500/10 text-red-400'
  },
  {
    id: 'goal-soc-blue-team',
    roleId: 'soc-analyst',
    title: 'SOC / Blue Team',
    badge: 'DEFENSIVE',
    desc: 'Security operations, SIEM telemetry, live alert triage, and incident response.',
    icon: ShieldAlert,
    accentColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400'
  },
  {
    id: 'goal-cybersecurity-analyst',
    roleId: 'soc-analyst',
    title: 'Cybersecurity Analyst',
    badge: 'DEFENSE & THREAT',
    desc: 'Threat intelligence, log correlation, forensic investigation, and malware detection.',
    icon: Shield,
    accentColor: 'border-blue-500/40 bg-blue-500/10 text-blue-400'
  },
  {
    id: 'goal-security-engineering',
    roleId: 'security-engineer',
    title: 'Security Engineering',
    badge: 'INFRASTRUCTURE',
    desc: 'Network architecture, system hardening, firewall configuration, and defense in depth.',
    icon: Cpu,
    accentColor: 'border-purple-500/40 bg-purple-500/10 text-purple-400'
  },
  {
    id: 'goal-ctf-bug-hunting',
    roleId: 'ctf-competitor',
    title: 'CTF / Bug Hunting',
    badge: 'CHALLENGES',
    desc: 'Jeopardy capture-the-flag competitions, binary reverse engineering, and web bug bounties.',
    icon: Trophy,
    accentColor: 'border-rose-500/40 bg-rose-500/10 text-rose-400'
  },
  {
    id: 'goal-cyber-career',
    roleId: 'ethical-hacker',
    title: 'Cybersecurity Career',
    badge: 'JOB-READY',
    desc: 'Industry-standard skills, practical portfolio projects, and verifiable credentials.',
    icon: Briefcase,
    accentColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
  },
  {
    id: 'goal-explore',
    roleId: 'beginner-explore',
    title: 'Explore Cybersecurity',
    badge: 'FOUNDATIONAL',
    desc: 'Broad exposure to all domains of security, cyber hygiene, and core digital defense.',
    icon: Compass,
    accentColor: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
  }
];

export const OnboardingStepGoals: React.FC<OnboardingStepGoalsProps> = ({
  selectedRole,
  onSelectRole,
  selectedGoals,
  onToggleGoal,
  onNext,
  onBack
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
          STEP 2 OF 6 • CAREER & LEARNING GOAL
        </span>
        <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
          What's your main goal?
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
          Choose your primary cybersecurity direction. You can customize or switch your track anytime from your dashboard.
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {GOAL_OPTIONS.map((g) => {
          const Icon = g.icon;
          const isSelected = selectedRole === g.roleId || selectedGoals.includes(g.id);

          return (
            <button
              key={g.id}
              onClick={() => {
                onSelectRole(g.roleId);
                onToggleGoal(g.id);
              }}
              className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.18)] scale-[1.01]'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border shrink-0 ${g.accentColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-mono font-bold text-white text-sm">{g.title}</h3>
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {g.badge}
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{g.desc}</p>
                </div>
              </div>

              <div className="shrink-0 mt-0.5">
                <div
                  className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold'
                      : 'border-slate-700 bg-transparent'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 fill-cyan-400" />}
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
