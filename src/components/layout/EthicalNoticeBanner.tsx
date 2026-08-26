import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';

export const EthicalNoticeBanner: React.FC = () => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div className="bg-slate-900/90 border-b border-cyan-500/20 px-4 py-1 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono font-medium text-cyan-300">ETHICAL USE ONLY:</span>
          <span>Only test systems you own or have explicit written permission to test.</span>
        </div>
        <button 
          onClick={() => setMinimized(false)}
          className="text-xs text-slate-400 hover:text-cyan-300 underline font-mono cursor-pointer"
        >
          View Scope Policy
        </button>
      </div>
    );
  }

  return (
    <div id="ethical-notice-banner" className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/20 px-4 py-2 text-xs relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono font-bold text-cyan-400 uppercase tracking-wider mr-2">
              MANDATORY ETHICAL RULE:
            </span>
            <span className="text-slate-200 font-medium">
              &ldquo;ONLY TEST SYSTEMS YOU OWN OR HAVE EXPLICIT PERMISSION TO TEST.&rdquo;
            </span>
            <span className="hidden md:inline text-slate-400 ml-2">
              All offensive simulations are conducted against isolated, fictional training targets.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ISOLATED LAB BOUNDARY: ACTIVE</span>
          </div>
          <button 
            onClick={() => setMinimized(true)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800/60 cursor-pointer"
            title="Minimize banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
