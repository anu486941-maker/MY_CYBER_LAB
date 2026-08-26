import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Zap,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface RemediationControl {
  id: string;
  name: string;
  category: 'WAF' | 'LINUX_HARDENING' | 'ACTIVE_DIRECTORY' | 'IMDS' | 'NETWORK_ACL';
  description: string;
  isApplied: boolean;
}

interface PurpleTeamComparatorProps {
  scenarioTitle?: string;
  redPayload?: string;
  initialRemediationState?: boolean;
}

export const PurpleTeamComparator: React.FC<PurpleTeamComparatorProps> = ({
  scenarioTitle = 'Financial API SQL Injection & PrivEsc',
  redPayload = `GET /api/v1/customer?id=101' UNION SELECT null,password FROM users--`,
  initialRemediationState = false
}) => {
  const { addXp } = useApp();
  const [activeTab, setActiveTab] = useState<'RED' | 'BLUE' | 'PURPLE'>('PURPLE');
  const [remediationApplied, setRemediationApplied] = useState<boolean>(initialRemediationState);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);

  const controls: RemediationControl[] = [
    {
      id: 'ctrl-1',
      name: 'WAF SQLi Parameter Filter Rule',
      category: 'WAF',
      description: 'Intercepts requests containing quotes and SQL keywords (`UNION`, `SELECT`, `OR 1=1`) and returns 403 Forbidden.',
      isApplied: remediationApplied
    },
    {
      id: 'ctrl-2',
      name: 'Linux SUID Binary Hardening',
      category: 'LINUX_HARDENING',
      description: 'Removes SUID permissions from `/usr/bin/python3` and `/usr/bin/find`.',
      isApplied: remediationApplied
    },
    {
      id: 'ctrl-3',
      name: 'IMDSv2 Hop-Limit Enforcement',
      category: 'IMDS',
      description: 'Requires HTTP PUT token authorization for cloud metadata API access.',
      isApplied: remediationApplied
    }
  ];

  const handleToggleRemediation = () => {
    const newState = !remediationApplied;
    setRemediationApplied(newState);
    if (newState) {
      addXp(100);
    }
  };

  const handleRunPurpleTest = () => {
    setIsTestRunning(true);
    setTimeout(() => {
      setIsTestRunning(false);
    }, 800);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">
                PURPLE TEAM COMPARATOR
              </span>
              <span className="text-xs font-mono text-slate-400">{scenarioTitle}</span>
            </div>
            <h3 className="text-base font-bold font-mono text-slate-100">
              Red vs Blue Attack & Defense Verification
            </h3>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('RED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'RED' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Red Team</span>
          </button>
          <button
            onClick={() => setActiveTab('BLUE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'BLUE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Blue Team</span>
          </button>
          <button
            onClick={() => setActiveTab('PURPLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'PURPLE' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Purple Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Control Switch Bar */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>DEFENSIVE REMEDIATION CONTROLS</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Toggle defensive filters to observe real-time exploit outcome changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleRemediation}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg ${
              remediationApplied
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/40'
            }`}
          >
            {remediationApplied ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Remediation ACTIVE (Enforced)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Remediation OFF (Vulnerable)</span>
              </>
            )}
          </button>

          <button
            onClick={handleRunPurpleTest}
            disabled={isTestRunning}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Play className={`w-3.5 h-3.5 ${isTestRunning ? 'animate-spin' : ''}`} />
            <span>Re-Test Attack Chain</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Red Team View */}
      {activeTab === 'RED' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-red-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-red-400">RED TEAM EXPLOIT PAYLOAD</span>
              <span className="text-[10px] font-mono text-slate-400">METHOD: HTTP GET</span>
            </div>
            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-red-300 overflow-x-auto">
              {redPayload}
            </pre>
          </div>
        </div>
      )}

      {/* Tab Content: Blue Team View */}
      {activeTab === 'BLUE' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-blue-400">BLUE TEAM SIEM ALERTS & POLICIES</span>
              <span className="text-[10px] font-mono text-slate-400">SIEM STREAM</span>
            </div>
            <div className="space-y-2">
              {controls.map((ctrl) => (
                <div key={ctrl.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-200">{ctrl.name}</div>
                    <div className="text-[11px] text-slate-400">{ctrl.description}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    remediationApplied ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {remediationApplied ? 'ENFORCED' : 'INACTIVE'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Purple Team Side-by-Side Comparison */}
      {activeTab === 'PURPLE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Remediation Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-red-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs font-mono font-bold text-red-300">
                  BEFORE REMEDIATION (Unprotected)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono text-[10px] font-bold">
                VULNERABLE
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-slate-400">HTTP Access Log:</div>
              <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-red-300 text-[11px] overflow-x-auto">
                200 OK - 84,120 bytes returned{"\n"}[SQLi Execution Succeeded]
              </pre>

              <div className="text-slate-400 pt-1">Target Host Outcome:</div>
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
                ❌ Database credentials exposed. SUID shell executed with root access.
              </div>
            </div>
          </div>

          {/* After Remediation Card */}
          <div className={`p-5 rounded-2xl bg-slate-950 border transition-all space-y-4 ${
            remediationApplied ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${remediationApplied ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className={`text-xs font-mono font-bold ${remediationApplied ? 'text-emerald-300' : 'text-slate-400'}`}>
                  AFTER REMEDIATION (Enforced)
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                remediationApplied ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
              }`}>
                {remediationApplied ? 'PROTECTED' : 'NOT APPLIED'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-slate-400">HTTP Access Log:</div>
              <pre className={`p-3 rounded-lg bg-slate-900 border text-[11px] overflow-x-auto ${
                remediationApplied ? 'border-emerald-500/40 text-emerald-300' : 'border-slate-800 text-slate-500'
              }`}>
                {remediationApplied
                  ? "403 Forbidden - WAF SQLi Filter Intercepted\n[EventID 9001 Alert Generated in SIEM]"
                  : "Enable Remediation Controls above to preview protected state."}
              </pre>

              <div className="text-slate-400 pt-1">Target Host Outcome:</div>
              <div className={`p-3 rounded-lg text-xs ${
                remediationApplied
                  ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
                  : 'bg-slate-900 border border-slate-800 text-slate-500'
              }`}>
                {remediationApplied
                  ? '✅ Exploit safely neutralized. WAF rule blocked payload. Alert registered in SIEM.'
                  : 'Awaiting defensive control enforcement.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
