import React from 'react';
import { useApp } from '../../context/AppContext';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertTriangle, Save } from 'lucide-react';

interface SaveStatusProps {
  showSaveButton?: boolean;
  className?: string;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ showSaveButton = true, className = '' }) => {
  const { syncStatus, lastSyncedTime, syncNow, syncErrorMessage } = useApp();

  const handleManualSave = () => {
    syncNow();
  };

  const getStatusBadge = () => {
    switch (syncStatus) {
      case 'SYNCED':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>SYNCED TO CLOUD {lastSyncedTime ? `(${lastSyncedTime})` : ''}</span>
          </div>
        );
      case 'SYNCING':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
            <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
            <span>SAVING & SYNCING...</span>
          </div>
        );
      case 'OFFLINE':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
            <CloudOff className="w-3 h-3 text-amber-400" />
            <span>SAVED LOCALLY (OFFLINE QUEUE)</span>
          </div>
        );
      case 'SYNC ERROR':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold" title={syncErrorMessage || 'Sync error'}>
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>SYNC CONFLICT / ERROR</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px]">
            <Cloud className="w-3 h-3" />
            <span>SAVED LOCALLY</span>
          </div>
        );
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {getStatusBadge()}

      {showSaveButton && (
        <button
          onClick={handleManualSave}
          disabled={syncStatus === 'SYNCING'}
          className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-200 border border-slate-700 font-mono text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Force immediate save and cloud synchronization"
        >
          <Save className="w-3 h-3 text-cyan-400" />
          <span>SAVE PROGRESS</span>
        </button>
      )}
    </div>
  );
};
