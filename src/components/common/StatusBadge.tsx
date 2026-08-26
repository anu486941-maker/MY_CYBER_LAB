import React from 'react';
import { ShieldAlert, Terminal, AlertTriangle, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  type: 'simulation' | 'requires_lab' | 'ai_demo' | 'locked' | 'mastered' | 'learning' | 'ethical' | 'completed';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-mono' : 'px-3 py-1 text-sm font-mono';

  switch (type) {
    case 'simulation':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 font-semibold tracking-wide ${sizeClasses}`}>
          <Terminal className="w-3 h-3 text-cyan-400" />
          {label || 'SIMULATION PREVIEW'}
        </span>
      );
    case 'requires_lab':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-950/40 text-amber-400 font-semibold tracking-wide ${sizeClasses}`}>
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          {label || 'REQUIRES LOCAL LAB'}
        </span>
      );
    case 'ai_demo':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-950/40 text-purple-400 font-semibold tracking-wide ${sizeClasses}`}>
          <Sparkles className="w-3 h-3 text-purple-400" />
          {label || 'AI DEMO MODE'}
        </span>
      );
    case 'ethical':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-semibold tracking-wide ${sizeClasses}`}>
          <ShieldAlert className="w-3 h-3 text-emerald-400" />
          {label || 'AUTHORIZED ETHICAL LAB'}
        </span>
      );
    case 'locked':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900/60 text-slate-400 font-semibold tracking-wide ${sizeClasses}`}>
          <Lock className="w-3 h-3 text-slate-500" />
          {label || 'LOCKED'}
        </span>
      );
    case 'mastered':
    case 'completed':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-950/50 text-emerald-300 font-semibold tracking-wide ${sizeClasses}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {label || (type === 'completed' ? 'COMPLETED' : 'MASTERED')}
        </span>
      );
    case 'learning':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-950/40 text-blue-300 font-semibold tracking-wide ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {label || 'IN PROGRESS'}
        </span>
      );
    default:
      return null;
  }
};
