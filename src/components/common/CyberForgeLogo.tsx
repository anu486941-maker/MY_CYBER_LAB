import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface CyberForgeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const CyberForgeLogo: React.FC<CyberForgeLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = ''
}) => {
  const iconSizeClass = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const iconInnerClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const titleClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  const badgeClass = size === 'sm' ? 'text-[9px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Icon Box */}
      <div className={`${iconSizeClass} rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all duration-200 relative`}>
        <Shield className={`${iconInnerClass} text-cyan-400`} />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
      </div>

      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-mono font-extrabold ${titleClass} tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors`}>
            CYBERFORGE
          </span>
          <span className={`${badgeClass} rounded bg-cyan-500/10 border border-cyan-500/30 font-mono font-bold text-cyan-400 uppercase tracking-wider`}>
            AI
          </span>
        </div>
        {showTagline && (
          <p className="text-[10px] text-slate-400 font-mono tracking-tight mt-0.5 hidden sm:block">
            BUILD SKILLS • BREAK THREATS
          </p>
        )}
      </div>
    </div>
  );
};
