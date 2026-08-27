/**
 * AttackBox Terminal Workstation Component
 * Professional browser-based training workstation page.
 * Enforces explicit target scope: AUTHORIZED TRAINING ENVIRONMENT | TARGET SCOPE: 10.200.1.0/24 | *.mycyberlab.local
 */

import React, { useState } from 'react';
import { Terminal, Shield, AlertTriangle, Play, CheckCircle2, Lock, Cpu, Globe } from 'lucide-react';
import { validateTargetScope } from '../../utils/targetAllowlistPolicy';

export const AttackBoxTerminal: React.FC = () => {
  const [targetScopeInput, setTargetScopeInput] = useState<string>('10.200.1.10');
  const [commandInput, setCommandInput] = useState<string>('nmap -sV 10.200.1.10');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'MY CYBER LAB Authorized Training Workstation v4.2 [OS: Kali Linux Simulation]',
    'Type "help" or run allowlisted commands against target scope.',
    '--------------------------------------------------------------------------------',
    '[SCOPE GUARD] Active Target Scope: 10.200.1.0/24, 172.16.40.0/24, *.mycyberlab.local'
  ]);
  const [validation, setValidation] = useState(validateTargetScope('10.200.1.10'));

  const handleTargetChange = (val: string) => {
    setTargetScopeInput(val);
    const res = validateTargetScope(val);
    setValidation(res);
  };

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    // Check target in command
    const targetMatch = commandInput.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (targetMatch && targetMatch[0]) {
      const scopeCheck = validateTargetScope(targetMatch[0]);
      if (!scopeCheck.allowed) {
        setTerminalLogs(prev => [
          ...prev,
          `$ ${commandInput}`,
          `[REFUSAL] ${scopeCheck.refusalMessage}`
        ]);
        return;
      }
    }

    setTerminalLogs(prev => [
      ...prev,
      `$ ${commandInput}`,
      `Executing ${commandInput} against authorized target ${targetScopeInput}...`,
      `[HTTP/1.1 200 OK] Target responded cleanly. Flag logged to Evidence Locker.`
    ]);
    setCommandInput('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-2xl space-y-4">
      {/* Top Banner: AUTHORIZED TRAINING ENVIRONMENT */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-950 to-slate-950 p-4 rounded-lg border border-cyan-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-900/40 border border-cyan-700 rounded-lg text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> AUTHORIZED TRAINING ENVIRONMENT
            </span>
            <h2 className="text-xl font-extrabold text-white mt-0.5">MY CYBER LAB Workstation (AttackBox)</h2>
          </div>
        </div>

        {/* Target Scope Guard */}
        <div className="bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-700 flex flex-col gap-1 min-w-[280px]">
          <span className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
            <span>TARGET SCOPE:</span>
            <span className={validation.allowed ? "text-emerald-400" : "text-rose-400"}>
              {validation.allowed ? "ALLOWED" : "OUT OF SCOPE"}
            </span>
          </span>
          <input
            type="text"
            value={targetScopeInput}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 px-2 py-1 rounded focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {!validation.allowed && (
        <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          {validation.refusalMessage}
        </div>
      )}

      {/* Terminal Display */}
      <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs text-emerald-400 min-h-[320px] max-h-[420px] overflow-y-auto space-y-1 shadow-inner">
        {terminalLogs.map((log, idx) => (
          <div key={idx} className={log.startsWith('[REFUSAL]') ? 'text-rose-400 font-bold' : log.startsWith('$') ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
            {log}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleRunCommand} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-xs font-mono text-cyan-400">$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="curl -v http://10.200.1.10/api/v1/customer..."
            className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 pl-7 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-2 shrink-0"
        >
          <Play className="w-4 h-4" /> Run Command
        </button>
      </form>
    </div>
  );
};
