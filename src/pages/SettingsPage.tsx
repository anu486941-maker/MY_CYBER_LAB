import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import { CareerRoleId } from '../types';
import { 
  Settings as SettingsIcon, 
  User, 
  ShieldAlert, 
  RotateCcw, 
  Download, 
  Upload, 
  Save, 
  CheckCircle2, 
  Globe, 
  Clock, 
  Flame,
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
  LogIn,
  LogOut,
  ShieldCheck,
  Lock,
  Database,
  Wifi,
  WifiOff,
  Briefcase
} from 'lucide-react';
import { SyncIndicatorBadge } from '../components/common/SyncIndicatorBadge';

export const SettingsPage: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    resetAllData, 
    currentUser, 
    signInWithGoogle, 
    signOut, 
    syncStatus, 
    isOnline, 
    lastSyncedTime, 
    syncErrorMessage, 
    syncNow,
    isAuthLoading
  } = useApp();

  const [name, setName] = useState<string>(profile.name);
  const [codename, setCodename] = useState<string>(profile.codename);
  const [experienceLevel, setExperienceLevel] = useState<string>(profile.experience);
  const [language, setLanguage] = useState<string>(profile.language);
  const [dailyTime, setDailyTime] = useState<string>(profile.dailyTime);
  const [learningStyle, setLearningStyle] = useState<string>(profile.learningStyle);
  const [targetRole, setTargetRole] = useState<CareerRoleId>((profile.targetRole as CareerRoleId) || 'soc-analyst');
  const [savedMsg, setSavedMsg] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      codename,
      experience: experienceLevel as any,
      language: language as any,
      dailyTime: dailyTime as any,
      learningStyle: learningStyle as any,
      targetRole: targetRole as any
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleExportData = () => {
    const fullState = {
      profile: localStorage.getItem('mcl_profile'),
      missions: localStorage.getItem('mcl_missions'),
      levels: localStorage.getItem('mcl_levels'),
      ctf: localStorage.getItem('mcl_ctf'),
      notes: localStorage.getItem('mcl_notes'),
      achievements: localStorage.getItem('mcl_achievements'),
      bookmarks: localStorage.getItem('mcl_bookmarks'),
      certificate: localStorage.getItem('mcl_certificate'),
      studyPlanHistory: localStorage.getItem('mcl_study_plan_history'),
      videoHistory: localStorage.getItem('mcl_video_history'),
      quizScores: localStorage.getItem('mcl_quiz_scores'),
      ctfScores: localStorage.getItem('mcl_ctf_scores'),
      labScores: localStorage.getItem('mcl_lab_scores'),
      weakSkills: localStorage.getItem('mcl_weak_skills'),
      strongSkills: localStorage.getItem('mcl_strong_skills'),
      studyTime: localStorage.getItem('mcl_study_time'),
      currentTopic: localStorage.getItem('mcl_current_topic'),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mycyberlab_backup_${profile.codename}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
              SYSTEM CONFIGURATION
            </span>
            <span className="text-xs font-mono text-slate-500">• CLOUD SYNC & OPERATOR PREFERENCES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Settings & Cloud Persistence
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage your Cloud Firestore synchronization, Google authentication, and operator learning preferences.
          </p>
        </div>

        {savedMsg && (
          <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> PREFERENCES SAVED & QUEUED FOR SYNC
          </div>
        )}
      </div>

      {/* Cloud Firestore & Google Authentication Center Card */}
      <div id="cloud-sync-card" className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/30 border border-cyan-500/40 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
                CLOUD FIRESTORE & GOOGLE AUTHENTICATION
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Persistent cross-device learning state backed by Firebase & Firestore rules.
              </p>
            </div>
          </div>

          <SyncIndicatorBadge showManualSyncButton={true} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Account Status */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">STUDENT ACCOUNT</span>
            {currentUser ? (
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  UID: <span className="text-slate-300">{currentUser.uid.slice(0, 10)}...</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  Sign in with your Google account to automatically back up and restore your full cyber lab state across sessions.
                </p>
                <button
                  onClick={() => signInWithGoogle()}
                  disabled={isAuthLoading}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" /> Sign In with Google
                </button>
              </div>
            )}
          </div>

          {/* Sync Engine Details */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">SYNCHRONIZATION TELEMETRY</span>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Network:</span>
                <span className={`font-bold flex items-center gap-1 ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                  {isOnline ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`font-bold ${
                  syncStatus === 'SYNCED' ? 'text-emerald-400' :
                  syncStatus === 'SYNCING' ? 'text-cyan-400 animate-pulse' :
                  syncStatus === 'OFFLINE' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {syncStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Synced:</span>
                <span className="text-slate-200">{lastSyncedTime || 'Initial load'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Offline Cache:</span>
                <span className="text-cyan-400 font-bold">ACTIVE (Local Fallback)</span>
              </div>
            </div>
          </div>

          {/* Cloud Security Policy */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">FIRESTORE SECURITY & RULES</span>
            <div className="space-y-1 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Lock className="w-3.5 h-3.5" /> Private User Scoped Rules
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Data is locked down with Firebase security rules. Only authenticated requests matching your UID can read or write your personal learning data.
              </p>
            </div>
            {currentUser && isOnline && (
              <button
                onClick={() => syncNow()}
                disabled={syncStatus === 'SYNCING'}
                className="w-full mt-2 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
                {syncStatus === 'SYNCING' ? 'Syncing...' : 'Force Sync with Firestore'}
              </button>
            )}
          </div>
        </div>

        {syncErrorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Sync Notice: {syncErrorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <h2 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-4 h-4 text-cyan-400" />
              OPERATOR IDENTITY & PREFERENCES
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">CALLSIGN / NAME:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">CODENAME HANDLE:</label>
                <input
                  type="text"
                  value={codename}
                  onChange={(e) => setCodename(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">EXPERIENCE TIER:</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="beginner">Absolute Zero</option>
                  <option value="some_computer">Tech-Savvy Beginner</option>
                  <option value="some_linux">Some Linux Knowledge</option>
                  <option value="some_networking">Some Networking</option>
                  <option value="already_studying">Already Studying Cybersecurity</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">PRIMARY LANGUAGE:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">DAILY TIME GOAL:</label>
                <select
                  value={dailyTime}
                  onChange={(e) => setDailyTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="15m">15 min</option>
                  <option value="30m">30 min</option>
                  <option value="1h">1 hour</option>
                  <option value="2h">2 hours</option>
                  <option value="3h_plus">3+ hours</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">LEARNING STYLE:</label>
                <select
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="mixed">Mixed (Theory + Hands-on + Video)</option>
                  <option value="reading">Reading & Documentation</option>
                  <option value="video">Video First</option>
                  <option value="interactive">Interactive Demos</option>
                  <option value="practice">Hands-on Terminal Practice</option>
                  <option value="missions">Tactical Missions & CTF</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">TARGET CAREER SPECIALIZATION:</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as CareerRoleId)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {CAREER_ROLES_DATA.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.emoji} {r.title} ({r.difficulty})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" /> SAVE CHANGES
              </button>
            </div>
          </form>

          {/* Backup & Export Data */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
              <Download className="w-4 h-4 text-purple-400" />
              OFFLINE CACHE & DATA EXPORT
            </h2>

            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              All learning progress, levels, missions, quiz scores, certificates, and notebook entries are cached locally in your browser and automatically synchronized with Firestore whenever online. You can also export an offline JSON snapshot anytime.
            </p>

            <button
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" /> EXPORT FULL PROGRESS (.JSON)
            </button>
          </div>

          {/* My Certificates Section */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                MY ISSUED CERTIFICATES & ACCREDITATIONS
              </h2>
              <a
                href="/certificate"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View Full Diploma →
              </a>
            </div>

            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Active cryptographically verifiable certificates of completion issued to your profile.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                    ACTIVE • VERIFIED
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    MCL-2026-CYB-8F42A1
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Practical Ethical Hacking & Defensive Cybersecurity
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="/verify-certificate?id=MCL-2026-CYB-8F42A1"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold"
                >
                  Verify Publicly
                </a>
                <a
                  href="/certificate"
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-mono font-semibold border border-cyan-500/30"
                >
                  Print / Download
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Safety & Reset Zone */}
        <div className="space-y-6">
          
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
              DANGER ZONE
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Reset all completed missions, unlocked levels, quiz scores, and notebook entries back to zero.
            </p>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/50 text-rose-200 font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> RESET ALL PROGRESS
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-rose-500 space-y-3">
                <div className="text-xs font-mono font-bold text-rose-400">
                  ARE YOU ABSOLUTELY SURE?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      resetAllData();
                      setShowResetConfirm(false);
                      window.location.reload();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
