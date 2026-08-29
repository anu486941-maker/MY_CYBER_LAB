import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Map, Sparkles, Terminal, Network, Shield, Cpu, Lock, Trophy, Server, Zap, Compass } from 'lucide-react';
import { CareerRoleId } from '../../types';

interface OnboardingStepPathProps {
  careerRole: CareerRoleId;
  startingModuleIndex: number;
  assessmentScores?: Record<string, number>;
  onNext: () => void;
  onBack: () => void;
}

interface PathMilestone {
  number: string;
  title: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PATH_MILESTONES: PathMilestone[] = [
  {
    number: '01',
    title: 'Computer & Internet Basics',
    category: 'FOUNDATION',
    description: 'Hardware architecture, operating system layers, internet routing, and security principles.',
    icon: Compass
  },
  {
    number: '02',
    title: 'Linux Fundamentals',
    category: 'SYSTEMS',
    description: 'Command line operations, file hierarchy, file permissions, shell scripting, and user security.',
    icon: Terminal
  },
  {
    number: '03',
    title: 'Networking Fundamentals',
    category: 'INFRASTRUCTURE',
    description: 'TCP/IP stack, OSI model, packet captures, subnetting calculations, and DNS/DHCP diagnostics.',
    icon: Network
  },
  {
    number: '04',
    title: 'Python for Security',
    category: 'AUTOMATION',
    description: 'Port scanners, HTTP requests automation, log parsers, and custom penetration scripts.',
    icon: Cpu
  },
  {
    number: '05',
    title: 'Web Security',
    category: 'APPLICATION',
    description: 'OWASP Top 10 vulnerabilities, SQL injection, XSS, CSRF, and HTTP request tampering.',
    icon: Shield
  },
  {
    number: '06',
    title: 'Ethical Hacking',
    category: 'OFFENSIVE',
    description: 'Reconnaissance methodology, Nmap port scanning, vulnerability assessment, and exploitation.',
    icon: Lock
  },
  {
    number: '07',
    title: 'Privilege Escalation',
    category: 'EXPLOITATION',
    description: 'Linux SUID abuse, sudo misconfigurations, Windows token escalation, and kernel exploits.',
    icon: Zap
  },
  {
    number: '08',
    title: 'Active Directory Fundamentals',
    category: 'ENTERPRISE',
    description: 'Domain controllers, Kerberos authentication, LDAP enumeration, and BloodHound mapping.',
    icon: Server
  },
  {
    number: '09',
    title: 'CTF & Cyber Range',
    category: 'TACTICAL',
    description: 'Real-world Jeopardy challenges, live vulnerable machine root access, and flag verification.',
    icon: Trophy
  },
  {
    number: '10',
    title: 'Advanced Security & Defense',
    category: 'CAPSTONE',
    description: 'SIEM log telemetry, SOC analysis, malware triage, incident response, and executive reporting.',
    icon: Shield
  }
];

export const OnboardingStepPath: React.FC<OnboardingStepPathProps> = ({
  careerRole,
  startingModuleIndex,
  assessmentScores,
  onNext,
  onBack
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          PATH PERSONALIZED BY AMAN
        </div>
        <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
          Your Learning Path Is Ready
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
          Here is your tailored 10-milestone cybersecurity curriculum. You can study progressively or jump into hands-on labs anytime.
        </p>
      </div>

      {/* Starting Point Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            {PATH_MILESTONES[startingModuleIndex]?.number || '01'}
          </div>
          <div>
            <span className="text-[10px] text-cyan-300 uppercase tracking-widest block font-bold">RECOMMENDED START POINT</span>
            <h4 className="text-sm font-bold text-white">
              {PATH_MILESTONES[startingModuleIndex]?.title || 'Computer & Internet Basics'}
            </h4>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
          YOUR LEVEL
        </span>
      </div>

      {/* Milestones List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
        {PATH_MILESTONES.map((milestone, idx) => {
          const Icon = milestone.icon;
          const isStart = idx === startingModuleIndex;
          const isPrior = idx < startingModuleIndex;

          return (
            <div
              key={milestone.number}
              className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 transition-all ${
                isStart
                  ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/40'
                  : isPrior
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                  : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                  isStart
                    ? 'bg-cyan-500 text-slate-950'
                    : isPrior
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {isPrior ? '✓' : milestone.number}
                </span>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-mono font-bold text-white text-sm">{milestone.title}</h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      {milestone.category}
                    </span>
                    {isStart && (
                      <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 text-[9px] font-mono font-black uppercase tracking-wider">
                        START HERE
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{milestone.description}</p>
                </div>
              </div>

              <div className="shrink-0 text-slate-500 mt-1">
                <Icon className={`w-4 h-4 ${isStart ? 'text-cyan-400' : 'text-slate-500'}`} />
              </div>
            </div>
          );
        })}
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
          className="py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer ml-auto"
        >
          <span>MEET AMAN AI MENTOR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
