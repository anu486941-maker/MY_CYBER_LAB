import React, { useState } from 'react';
import { ToolCallInvocation } from '../../aman/amanTools';
import { 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  ShieldAlert, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';

interface AmanToolCallCardProps {
  toolCall: ToolCallInvocation;
  onConfirm?: (toolCallId: string) => void;
  onReject?: (toolCallId: string) => void;
}

export const AmanToolCallCard: React.FC<AmanToolCallCardProps> = ({
  toolCall,
  onConfirm,
  onReject,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    switch (toolCall.status) {
      case 'RUNNING':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            <Loader2 className="w-3 h-3 animate-spin" /> Executing
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'REQUIRES_CONFIRMATION':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> Confirmation Needed
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
            <ShieldAlert className="w-3 h-3" /> Blocked
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="my-2.5 rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-md">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/50 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-200 truncate">
                {toolCall.toolName}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                ({toolCall.permission})
              </span>
            </div>
            {toolCall.stepDescription && (
              <p className="text-[11px] text-slate-400 truncate">
                {toolCall.stepDescription}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {getStatusBadge()}
          <button className="text-slate-400 hover:text-slate-200">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirmation Box if needed */}
      {toolCall.status === 'REQUIRES_CONFIRMATION' && (
        <div className="p-3 bg-amber-950/30 border-t border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-amber-200 font-sans">
            ⚠️ <strong>Action Authorization:</strong> AMAN requires your confirmation before proceeding with this high-impact action.
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onReject && onReject(toolCall.id)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              onClick={() => onConfirm && onConfirm(toolCall.id)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md"
            >
              <Check className="w-3.5 h-3.5" /> Confirm Action
            </button>
          </div>
        </div>
      )}

      {/* Expanded parameter & result details */}
      {isExpanded && (
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 space-y-2 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Input Parameters:</span>
            <pre className="mt-1 p-2 rounded bg-slate-900 text-slate-300 text-[11px] overflow-x-auto">
              {JSON.stringify(toolCall.params || {}, null, 2)}
            </pre>
          </div>

          {toolCall.result && (
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Execution Output:</span>
              <pre className="mt-1 p-2 rounded bg-slate-900 text-emerald-300 text-[11px] overflow-x-auto">
                {JSON.stringify(toolCall.result, null, 2)}
              </pre>
            </div>
          )}

          {toolCall.error && (
            <div>
              <span className="text-[10px] text-rose-400 uppercase font-bold">Error Message:</span>
              <pre className="mt-1 p-2 rounded bg-rose-950/50 border border-rose-500/30 text-rose-300 text-[11px]">
                {toolCall.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
