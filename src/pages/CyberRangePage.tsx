import React, { useState } from 'react';
import { CYBER_RANGE_FEATURE_LAB } from '../data/mockData';
import { 
  Server, 
  ShieldAlert, 
  Terminal, 
  Sparkles, 
  RotateCcw, 
  Flag, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  BookOpen, 
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const CyberRangePage: React.FC = () => {
  const lab = CYBER_RANGE_FEATURE_LAB;
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [flagInput, setFlagInput] = useState<string>('');
  const [flagMsg, setFlagMsg] = useState<{ text: string; success?: boolean } | null>(null);

  const handleActionClick = (actionName: string) => {
    setActiveModal(actionName);
  };

  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;
    if (flagInput.trim() === 'MCL{nightfall_root_compromised_1337}') {
      setFlagMsg({ text: 'CORRECT! Nightfall Root Flag captured (+500 XP).', success: true });
    } else {
      setFlagMsg({ text: 'REQUIRES LOCAL LAB — Flag submission verified locally. Connect local Docker range in Stage 2.', success: false });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
              CYBER RANGE SIMULATOR
            </span>
            <StatusBadge type="requires_lab" label="REQUIRES LOCAL LAB" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Isolated Cyber Range Arena
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Multi-stage offensive penetration testing targets in strictly contained, fictional lab networks.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-400">
          Range Gateway: <span className="text-amber-400 font-bold">10.10.14.0/24 (ISOLATED)</span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs font-mono">
          <div className="text-amber-300 font-bold uppercase">STAGE 1 ARCHITECTURE NOTICE:</div>
          <p className="text-slate-300 font-sans">
            Full-spectrum dynamic penetration testing machines require isolated Docker containers and virtualized target images coming in Stage 2.
            This interface illustrates the operational target dossier, phase checklist, and scoring architecture.
          </p>
        </div>
      </div>

      {/* Featured Target Dossier Card: "NIGHTFALL" */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        
        {/* Top Target Meta */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-950 to-slate-900 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <Server className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-400">{lab.codename}</span>
                <span className="text-slate-600 font-mono">•</span>
                <span className="text-xs font-mono text-slate-400">{lab.targetType}</span>
                <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                  {lab.difficulty}
                </span>
              </div>
              <h2 className="text-2xl font-mono font-black text-slate-100">
                TARGET: {lab.name}
              </h2>
              <div className="text-xs font-mono text-cyan-400">
                Target IP: {lab.targetIp} • OS: {lab.targetOs}
              </div>
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 block">USER FLAG</span>
              <span className="text-emerald-400 font-bold">+{lab.userFlagPoints} PTS</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 block">ROOT FLAG</span>
              <span className="text-rose-400 font-bold">+{lab.rootFlagPoints} PTS</span>
            </div>
          </div>
        </div>

        {/* Tactical Scenario */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            ENGAGEMENT SCENARIO & SCOPE OF WORK
          </h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line">
            {lab.scenario}
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            onClick={() => handleActionClick('START LAB')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Server className="w-4 h-4" /> START LAB
          </button>

          <button
            onClick={() => handleActionClick('OPEN TERMINAL')}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-cyan-400" /> OPEN TERMINAL
          </button>

          <button
            onClick={() => handleActionClick('AI HINT')}
            className="px-4 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> AI HINT
          </button>

          <button
            onClick={() => handleActionClick('VIEW THEORY')}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-400" /> VIEW THEORY
          </button>

          <button
            onClick={() => handleActionClick('RESET LAB')}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> RESET LAB
          </button>
        </div>

        {/* Penetration Testing Phases Checklist */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center justify-between">
            <span>ENGAGEMENT PHASES (8 OBJECTIVES)</span>
            <span className="text-cyan-400 text-xs font-mono">2 / 8 Completed</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {lab.objectives.map((obj) => (
              <div
                key={obj.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs font-mono ${
                  obj.completed
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded flex items-center justify-center ${obj.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'}`}>
                    {obj.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span>{obj.title}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-500">
                  {obj.phase.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Flag Submission Form */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-cyan-400" />
            SUBMIT CAPTURED LAB FLAG (USER / ROOT)
          </h4>

          <form onSubmit={handleSubmitFlag} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="e.g. MCL{nightfall_root_compromised_1337}"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs cursor-pointer shadow-sm"
            >
              SUBMIT FLAG
            </button>
          </form>

          {flagMsg && (
            <div className={`p-3 rounded-lg border text-xs font-mono ${flagMsg.success ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-amber-950/60 border-amber-500 text-amber-200'}`}>
              {flagMsg.text}
            </div>
          )}
        </div>

      </div>

      {/* Action Dialog Modal Placeholder */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                ACTION: {activeModal}
              </div>
              <h3 className="text-lg font-mono font-bold text-slate-100">
                REQUIRES LOCAL LAB (STAGE 2)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans pt-2">
                This action communicates with the future local Docker container daemon. In Stage 1, please utilize the simulated Linux Lab and Network Lab for educational commands.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold cursor-pointer"
            >
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
