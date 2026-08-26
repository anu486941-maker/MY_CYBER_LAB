import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  RefreshCw, 
  WifiOff, 
  AlertCircle, 
  Cloud, 
  CloudOff,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { SyncStatus } from '../../types';

interface SyncIndicatorBadgeProps {
  showManualSyncButton?: boolean;
  className?: string;
}

export const SyncIndicatorBadge: React.FC<SyncIndicatorBadgeProps> = ({ 
  showManualSyncButton = true,
  className = '' 
}) => {
  const { 
    syncStatus, 
    isOnline, 
    lastSyncedTime, 
    syncErrorMessage, 
    currentUser, 
    signInWithGoogle, 
    signOut, 
    syncNow,
    isAuthLoading
  } = useApp();

  const getStatusBadge = () => {
    switch (syncStatus) {
      case 'SYNCED':
        return (
          <div 
            id="sync-status-synced"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold"
            title={currentUser ? `Cloud synchronized (${currentUser.email})` : 'Offline cache active (Sign in to sync with Cloud)'}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>SYNCED</span>
            {lastSyncedTime && (
              <span className="text-[9px] text-emerald-500/80 hidden sm:inline">({lastSyncedTime})</span>
            )}
          </div>
        );
      case 'SYNCING':
        return (
          <div 
            id="sync-status-syncing"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-semibold animate-pulse"
            title="Synchronizing progress with Cloud Firestore..."
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>SYNCING</span>
          </div>
        );
      case 'OFFLINE':
        return (
          <div 
            id="sync-status-offline"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-semibold"
            title="Internet disconnected. Using localStorage cache. Will auto-sync when online."
          >
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFLINE</span>
          </div>
        );
      case 'SYNC ERROR':
        return (
          <div 
            id="sync-status-error"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-400 font-mono text-[11px] font-semibold"
            title={syncErrorMessage || 'Sync error occurred. Local cache safe.'}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>SYNC ERROR</span>
          </div>
        );
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getStatusBadge()}

      {/* Manual Sync Button */}
      {showManualSyncButton && currentUser && isOnline && (
        <button
          id="manual-sync-button"
          onClick={() => syncNow()}
          disabled={syncStatus === 'SYNCING'}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors disabled:opacity-50 cursor-pointer"
          title="Force Cloud Sync Now"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
        </button>
      )}

      {/* Quick Auth Trigger */}
      {!currentUser ? (
        <button
          id="header-google-signin-btn"
          onClick={() => signInWithGoogle()}
          disabled={isAuthLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold transition-all cursor-pointer"
          title="Sign in with Google to enable cloud sync"
        >
          <LogIn className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">GOOGLE SIGN IN</span>
          <span className="sm:hidden">LOGIN</span>
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <div 
            className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
            title={`Authenticated: ${currentUser.email}`}
          >
            <UserCheck className="w-3 h-3 text-cyan-400" />
            <span className="max-w-[120px] truncate">{currentUser.email}</span>
          </div>
          <button
            id="header-signout-btn"
            onClick={() => signOut()}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
