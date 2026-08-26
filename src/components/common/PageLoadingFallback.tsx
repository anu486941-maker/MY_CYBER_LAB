import React from 'react';
import { Shield, Loader2 } from 'lucide-react';

export const PageLoadingFallback: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4 animate-fadeIn">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.25)]">
          <Shield className="w-7 h-7 text-cyan-400 animate-pulse" />
        </div>
        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin absolute -bottom-1 -right-1" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-mono text-sm font-bold text-white tracking-wide uppercase">
          Initializing Cyber Training Environment
        </h3>
        <p className="text-xs text-slate-400 font-sans max-w-sm">
          AMAN AI is verifying learning telemetry, sandboxed nodes, and curriculum state...
        </p>
      </div>

      <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse w-3/4" />
      </div>
    </div>
  );
};
