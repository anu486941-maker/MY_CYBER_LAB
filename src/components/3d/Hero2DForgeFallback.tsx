import React from 'react';
import { Shield, Cpu, Network, Sparkles, Lock, Server } from 'lucide-react';

interface Hero2DForgeFallbackProps {
  className?: string;
}

export const Hero2DForgeFallback: React.FC<Hero2DForgeFallbackProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-[400px] sm:h-[480px] flex items-center justify-center overflow-hidden rounded-3xl bg-slate-950/80 border border-slate-800/80 p-6 ${className}`}>
      {/* Background Atmosphere Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-slate-950/80 pointer-events-none" />

      {/* Glowing Outer Energy Rings */}
      <div className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full border border-cyan-500/20 animate-[spin_25s_linear_infinite] pointer-events-none" />
      <div className="absolute w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full border border-dashed border-indigo-500/30 animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />
      <div className="absolute w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] rounded-full border border-violet-500/30 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30 pointer-events-none" />

      {/* Central 2D Forge Emblem Card */}
      <div className="relative z-10 p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center text-center space-y-4 max-w-sm backdrop-blur-md">
        
        {/* Core Icon Badge */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-900 to-violet-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-violet-600 text-white shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
            DIGITAL FORGE COMMAND
          </span>
          <h3 className="text-xl font-mono font-black text-white">
            CYBERFORGE AI
          </h3>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-2 w-full pt-2 font-mono text-[10px]">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center space-y-1 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>CORE READY</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center space-y-1 text-slate-300">
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span>TOPOLOGY</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center space-y-1 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>SECURE</span>
          </div>
        </div>

        {/* Orbiting Satellite Dots */}
        <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-World Security Sandboxes Active</span>
        </div>

      </div>

      {/* Corner Data Nodes */}
      <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[10px] text-slate-400 flex items-center gap-2">
        <Server className="w-3.5 h-3.5 text-cyan-400" />
        <span>NODE-01: ONLINE</span>
      </div>
      <div className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[10px] text-slate-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        <span>AMAN LAYER: ACTIVE</span>
      </div>
    </div>
  );
};
