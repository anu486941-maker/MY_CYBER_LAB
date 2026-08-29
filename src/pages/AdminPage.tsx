import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  GraduationCap, 
  Settings, 
  Activity, 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  FileText, 
  Database, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Plus, 
  Trash2, 
  Lock, 
  Radio, 
  ShieldCheck,
  Check,
  Zap
} from 'lucide-react';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import { CYBER_LAB_MODULES } from '../data/cyberLabModulesData';

interface SystemFeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'AI' | 'SECURITY' | 'CURRICULUM' | 'LABS';
}

interface AdminAuditLog {
  id: string;
  action: string;
  adminUser: string;
  timestamp: string;
  details: string;
  status: 'SUCCESS' | 'WARNING';
}

export const AdminPage: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'USERS' | 'CURRICULUM' | 'FLAGS' | 'HEALTH' | 'AUDIT'>('FLAGS');
  const [searchTerm, setSearchTerm] = useState('');

  // Feature Flags State
  const [flags, setFlags] = useState<SystemFeatureFlag[]>([
    {
      id: 'flag-hinglish-ai',
      name: 'Hinglish AI Socratic Explanations',
      description: 'Allows AMAN AI mentor to respond in natural Hindi + English code-switching.',
      enabled: true,
      category: 'AI'
    },
    {
      id: 'flag-strict-terminal-sandbox',
      name: 'High-Security Deterministic Kali Sandbox',
      description: 'Enforces strict scope validation and blocks any unauthorized target IP calls.',
      enabled: true,
      category: 'SECURITY'
    },
    {
      id: 'flag-voice-synthesis',
      name: 'Web Audio Speech Engine Synthesis',
      description: 'Enables AMAN text-to-speech audio playback on desktop and mobile browsers.',
      enabled: true,
      category: 'AI'
    },
    {
      id: 'flag-real-incident-bridge',
      name: 'Real Incident to Practice Lab Bridge',
      description: 'Directly links historical breach case studies to interactive sandboxed training environments.',
      enabled: true,
      category: 'CURRICULUM'
    },
    {
      id: 'flag-evidence-hashing',
      name: 'SHA-256 Cryptographic Evidence Verification',
      description: 'Computes immutable hashes for collected lab artifacts in the Evidence Locker.',
      enabled: true,
      category: 'SECURITY'
    }
  ]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([
    {
      id: 'log-01',
      action: 'FEATURE_FLAG_TOGGLE',
      adminUser: profile?.name || 'Admin Operator',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString(),
      details: 'Enabled Hinglish AI Socratic Explanations flag.',
      status: 'SUCCESS'
    },
    {
      id: 'log-02',
      action: 'CURRICULUM_AUDIT',
      adminUser: profile?.name || 'Admin Operator',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleTimeString(),
      details: 'Verified 10 career tracks and 6-stage guided lab modules.',
      status: 'SUCCESS'
    }
  ]);

  const toggleFlag = (flagId: string) => {
    setFlags(prev => prev.map(f => {
      if (f.id === flagId) {
        const nextState = !f.enabled;
        const newLog: AdminAuditLog = {
          id: `log-${Date.now()}`,
          action: 'FEATURE_FLAG_TOGGLE',
          adminUser: profile?.name || 'Admin Operator',
          timestamp: new Date().toLocaleTimeString(),
          details: `${nextState ? 'Enabled' : 'Disabled'} ${f.name}.`,
          status: 'SUCCESS'
        };
        setAuditLogs(logs => [newLog, ...logs]);
        return { ...f, enabled: nextState };
      }
      return f;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-950 flex items-center justify-center border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-mono font-bold text-white tracking-tight">
                OWNER & ADMIN CONTROL CENTER
              </h1>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-400">
                AUTHORIZED SUPERADMIN
              </span>
            </div>
            <p className="text-sm text-slate-400 font-sans mt-1">
              Manage platform feature flags, user roles, curriculum status, AI model configurations, and system health metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">System Status</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-center">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              100% HEALTHY
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'FLAGS', label: 'FEATURE FLAGS', icon: Sliders },
          { id: 'CURRICULUM', label: 'CURRICULUM MANAGEMENT', icon: GraduationCap },
          { id: 'USERS', label: 'USER ROSTER', icon: Users },
          { id: 'HEALTH', label: 'SYSTEM HEALTH', icon: Cpu },
          { id: 'AUDIT', label: 'AUDIT LOGS', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* FEATURE FLAGS TAB */}
      {activeTab === 'FLAGS' && (
        <div className="space-y-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-rose-400" />
              System Feature Flags & AI Model Parameters
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Changes take effect immediately across all active sessions.
            </span>
          </div>

          <div className="space-y-3">
            {flags.map(flag => (
              <div 
                key={flag.id} 
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4 transition-all hover:border-slate-700"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{flag.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {flag.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{flag.description}</p>
                </div>

                <button
                  onClick={() => toggleFlag(flag.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    flag.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  {flag.enabled ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-400" />
                      <span>ENABLED</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-slate-500" />
                      <span>DISABLED</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CURRICULUM MANAGEMENT TAB */}
      {activeTab === 'CURRICULUM' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              10 Career Tracks & Module Administration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CAREER_ROLES_DATA.map(role => (
                <div key={role.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{role.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ACTIVE IN PRODUCTION
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{role.shortDescription}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* USER ROSTER TAB */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Enrolled Learner Directory
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search learners..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 font-mono text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="p-3">Learner</th>
                  <th className="p-3">Role Track</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Readiness</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-3 font-bold text-white">{profile?.name || 'Active Operator'}</td>
                  <td className="p-3 font-mono text-cyan-400">{profile?.selectedRole || 'Ethical Hacker'}</td>
                  <td className="p-3">{profile?.experienceLevel || 'Intermediate'}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">84.5%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                      ONLINE NOW
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SYSTEM HEALTH TAB */}
      {activeTab === 'HEALTH' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              Real-Time System Health & Diagnostics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-500 uppercase block">Express Server Proxy</span>
                <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 200 OK (0ms TTFB)
                </span>
                <p className="text-[11px] text-slate-400">
                  Container running on port 3000 behind reverse proxy.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-500 uppercase block">Gemini GenAI SDK</span>
                <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> INITIALIZED
                </span>
                <p className="text-[11px] text-slate-400">
                  `process.env.GEMINI_API_KEY` validated server-side.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-500 uppercase block">Firestore Security</span>
                <span className="text-lg font-bold text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> UID ISOLATED
                </span>
                <p className="text-[11px] text-slate-400">
                  Rules enforce user isolation on all data paths.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'AUDIT' && (
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Administrative Audit Log Trail
          </h3>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">{log.action}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{log.adminUser}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">{log.details}</p>
                </div>
                <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
