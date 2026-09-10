import React, { useState } from 'react';
import { AttackBoxTerminal } from '../components/cyber-range/AttackBoxTerminal';
import { Shield, Terminal, BookOpen, Lock, Server, Sparkles, FileSearch, CheckCircle } from 'lucide-react';

export const AttackBoxPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'network' | 'hints'>('terminal');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Phase 2 — AttackBox Workstation
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Active Session Scoped
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2">AttackBox Authorized Operating Workstation</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browser Linux terminal subsystem with automated penetration testing tools, multi-tab execution, and scope containment.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" /> AttackBox Terminal
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'network'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server className="w-4 h-4" /> Range Topology
          </button>
          <button
            onClick={() => setActiveTab('hints')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'hints'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> AMAN Cyber Mentor
          </button>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'terminal' && <AttackBoxTerminal />}

      {activeTab === 'network' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" /> Target Subnet Range Topology
          </h2>
          <p className="text-xs text-slate-400">
            Authorized target IPs isolated under client Rules of Engagement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block">10.20.0.0/24 Subnet</span>
              <div className="text-slate-200">WEBFORGE-01 (10.20.0.10)</div>
              <div className="text-slate-400 text-[11px]">Ports: 22 (SSH), 80 (HTTP), 8080 (Flask API)</div>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">ONLINE</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block">10.30.0.0/24 Subnet</span>
              <div className="text-slate-200">BLACKOUT-01 (10.30.0.15)</div>
              <div className="text-slate-400 text-[11px]">Ports: 22, 80, 88 (Kerberos), 445 (SMB)</div>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold">LOCKED</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block">10.40.0.0/24 Subnet</span>
              <div className="text-slate-200">AISEC-01 (10.40.0.25)</div>
              <div className="text-slate-400 text-[11px]">Ports: 8000 (RAG API)</div>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold">LOCKED</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hints' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> AMAN 3.0 Live Socratic Mentor
          </h2>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-cyan-300 font-bold">
              AMAN: "Looking at your current target (10.20.0.10), remember to start with a service version scan using Nmap!"
            </div>
            <div className="text-slate-300">
              Try running: <code className="text-emerald-300">nmap -sV -sC 10.20.0.10</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttackBoxPage;
