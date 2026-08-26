import React from 'react';
import { useApp } from '../../context/AppContext';
import { RefreshCw, Shield, Database } from 'lucide-react';

export const SyncRestoreLoadingOverlay: React.FC = () => {
  const { isAuthLoading, currentUser } = useApp();

  if (!isAuthLoading || !currentUser) {
    return null;
  }

  return (
    <div 
      id="sync-restore-loading-overlay" 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4"
    >
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center">
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin absolute" />
          <Database className="w-7 h-7 text-cyan-400" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-base font-mono font-bold text-slate-100 uppercase tracking-wide">
            Restoring Cyber Lab State
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Synchronizing lessons, missions, CTF scores, and notebook from Cloud Firestore...
          </p>
        </div>

        <div className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/50 py-1.5 px-3 rounded-lg border border-cyan-500/20">
          OPERATOR: {currentUser.email}
        </div>
      </div>
    </div>
  );
};
