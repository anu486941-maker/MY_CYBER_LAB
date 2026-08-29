import React, { useState } from 'react';
import { 
  Building2, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  Bot, 
  Terminal, 
  Eye, 
  FileText, 
  Trophy, 
  Sparkles, 
  Globe, 
  RefreshCw, 
  Flame, 
  Video, 
  Lock,
  Layers,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, addXp } = useApp();
  const [activePerspective, setActivePerspective] = useState<'ETHICAL_HACKER' | 'SOC_ANALYST'>('ETHICAL_HACKER');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'HI' | 'HINGLISH'>('HINGLISH');
  const [demoLog, setDemoLog] = useState<string[]>([
    'MY CYBER LAB — Interactive Buyer Acquisition Demo Engine v5.0',
    'Simulating end-to-end 10-step learner journey across Red & Blue team perspectives...'
  ]);

  const steps = [
    { num: 1, title: 'Role Selection', desc: 'Select career pathway (Ethical Hacker vs SOC Analyst)', icon: Shield },
    { num: 2, title: 'Language Selection', desc: 'Choose independent video & AMAN AI language (English, Hindi, Hinglish)', icon: Globe },
    { num: 3, title: 'Video Academy Lesson', desc: 'Access role-targeted theory with localized transcripts', icon: Video },
    { num: 4, title: 'Ask AMAN AI', desc: 'Engage Socratic co-pilot for multi-lingual concept breakdown', icon: Bot },
    { num: 5, title: 'Simulated Attack', desc: 'Dispatch deterministic CLI exploit in safe Kali sandbox', icon: Terminal },
    { num: 6, title: 'Defensive Telemetry', desc: 'Observe real-time SIEM alerts & Suricata IDS detection', icon: Eye },
    { num: 7, title: 'Investigate Alert', desc: 'Extract IOCs, build attack timeline, map MITRE ATT&CK', icon: Layers },
    { num: 8, title: 'Collect Evidence', desc: 'Cryptographically stamp evidence with SHA-256 hash', icon: Lock },
    { num: 9, title: 'Generate Report', desc: 'Produce executive pentest/IR report evaluated by AMAN', icon: FileText },
    { num: 10, title: 'Career Readiness', desc: 'Update 9-pillar readiness metrics & portfolio artifacts', icon: Trophy }
  ];

  const handleNextStep = () => {
    if (activeStep < 10) {
      const next = activeStep + 1;
      setActiveStep(next);
      setDemoLog(prev => [
        ...prev,
        `[STEP ${next}] ${steps[next - 1].title}: ${steps[next - 1].desc} (${activePerspective} Mode)`
      ]);
      addXp(20, `Completed Demo Step ${next}`);
    }
  };

  const switchPerspective = (role: 'ETHICAL_HACKER' | 'SOC_ANALYST') => {
    setActivePerspective(role);
    if (role === 'ETHICAL_HACKER') {
      updateProfile({ selectedRole: 'ethical-hacker', targetRole: 'ethical-hacker' });
    } else {
      updateProfile({ selectedRole: 'soc-analyst', targetRole: 'soc-analyst' });
    }
    setDemoLog(prev => [
      ...prev,
      `[PERSPECTIVE SWITCH] Active Role set to ${role}. Demonstrating unified simulation underlying both tracks.`
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fadeIn text-slate-100">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                EXECUTIVE BUYER & ACQUISITION DEMO MODE
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                10-STEP LEARNER JOURNEY PROOF
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Platform Capability & Value Proof Sequence
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Experience how a single deterministic simulation engine powers both Red Team (Ethical Hacker) and Blue Team (SOC Analyst) career progression in 10-15 minutes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dual-lens')}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-lg"
            >
              <Eye className="w-4 h-4" /> LAUNCH DUAL-LENS ARENA
            </button>
            <button
              onClick={() => navigate('/wargame')}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-lg"
            >
              <Flame className="w-4 h-4" /> LAUNCH AI WARGAME
            </button>
          </div>
        </div>
      </div>

      {/* ROLE PERSPECTIVE TOGGLE */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">Active Perspective:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => switchPerspective('ETHICAL_HACKER')}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activePerspective === 'ETHICAL_HACKER'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ETHICAL HACKER (RED)
            </button>
            <button
              onClick={() => switchPerspective('SOC_ANALYST')}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activePerspective === 'SOC_ANALYST'
                  ? 'bg-purple-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SOC ANALYST (BLUE)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">AMAN Language:</span>
          {(['EN', 'HI', 'HINGLISH'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedLanguage === lang
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* 10-STEP PROGRESS STEPTREE */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {steps.map(step => {
          const Icon = step.icon;
          const isActive = activeStep === step.num;
          const isDone = activeStep > step.num;
          return (
            <div
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-lg'
                  : isDone
                  ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${
                  isActive ? 'text-cyan-400' : isDone ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  STEP {step.num}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                <Icon className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                {step.title}
              </h4>
            </div>
          );
        })}
      </div>

      {/* STEP INTERACTIVE DEMO CARD */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold block">
              Active Demonstration Step {activeStep} of 10
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              {steps[activeStep - 1].title}
            </h2>
            <p className="text-xs text-slate-300 mt-1">{steps[activeStep - 1].desc}</p>
          </div>

          <button
            onClick={handleNextStep}
            disabled={activeStep === 10}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 cursor-pointer transition-all shadow-lg"
          >
            <span>{activeStep === 10 ? 'DEMO COMPLETE' : 'NEXT STEP'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* STEP CONTENT PANEL */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          {activeStep === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                MY CYBER LAB provides tailored experiences for distinct career paths. Selected role: <strong className="text-cyan-400">{activePerspective}</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-cyan-400">Ethical Hacker Focus:</span>
                  <p className="text-[11px] text-slate-400">Reconnaissance, Web Vulnerability Exploitation, Privilege Escalation, Penetration Testing Reports.</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-purple-400">SOC Analyst Focus:</span>
                  <p className="text-[11px] text-slate-400">SIEM Alert Triage, Network Telemetry, IOC Extraction, MITRE ATT&CK Mapping, Incident Containment.</p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-300">
                Language mode is set to <strong className="text-cyan-400">{selectedLanguage}</strong>. AMAN AI explains complex concepts in regional languages with technical English terminology intact.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
                &quot;Nmap port scan me target IP pe TCP SYN packet bheja jata hai. Agar target port open hai, toh SYN-ACK response aata hai.&quot;
              </div>
            </div>
          )}

          {activeStep >= 3 && activeStep <= 8 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Deterministic Simulation Output:</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  SAFE SYNTHETIC LAB
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div>[SIMULATION] Target: 192.168.1.100 (Payment Gateway)</div>
                <div>[ACTION] Executing: <span className="text-cyan-400">nmap -sV -p 80,443 192.168.1.100</span></div>
                <div>[TELEMETRY] Suricata Alert Generated: <span className="text-amber-400">T1595.002 (Port Scan Detected)</span></div>
                <div>[EVIDENCE] SHA-256 Hash Generated: <span className="text-purple-300">SHA256:a8f9c2d1e...</span></div>
              </div>
            </div>
          )}

          {activeStep >= 9 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Verified Portfolio & Readiness Impact
              </span>
              <p className="text-xs text-slate-300">
                This completed exercise updated <strong>Technical Foundation (+15 XP)</strong>, <strong>Security Tools (+20 XP)</strong>, and generated a cryptographically stamped evidence artifact in the Evidence Locker.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DEMO CONSOLE LOG */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-400 space-y-1 max-h-48 overflow-y-auto">
        <span className="text-[10px] text-slate-500 uppercase block mb-1">Demo Audit Trail</span>
        {demoLog.map((log, i) => (
          <div key={i} className="text-slate-300">{log}</div>
        ))}
      </div>
    </div>
  );
};
