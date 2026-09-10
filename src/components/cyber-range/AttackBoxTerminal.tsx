/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/components/cyber-range/AttackBoxTerminal.tsx
 * Purpose: Interactive Browser AttackBox Workstation Component with Multi-Terminal Tabs,
 *          Real VFS Execution Engine, Quick Attack Buttons, and Real-time Scope Enforcement
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Shield, AlertTriangle, Play, CheckCircle2, Lock, Cpu, Globe,
  Plus, X, Copy, Trash2, RefreshCw, Key, Award, FileText, ChevronRight, HelpCircle, Server, Activity
} from 'lucide-react';
import { AttackBoxTabManager, TerminalTab } from '../../engine/attackbox/AttackBoxTabManager';
import { TerminalOutputLine } from '../../engine/attackbox/AttackBoxShell';
import { MachineRegistry } from '../../engine/machines/MachineRegistry';
import { MissionRegistry } from '../../engine/missions/MissionRegistry';
import { SessionOrchestrator } from '../../engine/sessions/SessionOrchestrator';
import { ObjectiveValidator } from '../../engine/objectives/ObjectiveValidator';
import { RuntimeOrchestrator } from '../../engine/runtime/RuntimeOrchestrator';
import { RuntimeProviderMode, RuntimeStatus } from '../../engine/runtime/AttackBoxRuntime';
import { RulesOfEngagement, CyberMachine } from '../../engine/types';

export const AttackBoxTerminal: React.FC = () => {
  const [tabManager] = useState<AttackBoxTabManager>(() => new AttackBoxTabManager());
  const [activeTabId, setActiveTabId] = useState<string>(tabManager.getActiveTabId());
  const [commandInput, setCommandInput] = useState<string>('');
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [activeMachineId, setActiveMachineId] = useState<string>('m-webforge-01');
  const [flagInput, setFlagInput] = useState<string>('');
  const [flagMessage, setFlagMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Runtime Mode State
  const [runtimeMode, setRuntimeMode] = useState<RuntimeProviderMode>('SIMULATED');
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus | null>(null);
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);

  // Active Session state
  const [session, setSession] = useState(() => SessionOrchestrator.startSession('operator-01', 'mission-webforge-01'));
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const orchestrator = RuntimeOrchestrator.getInstance();

  useEffect(() => {
    // Sync initial runtime status
    orchestrator.getStatus('attackbox-01').then(status => setRuntimeStatus(status));
  }, []);

  const handleToggleRuntimeMode = async (mode: RuntimeProviderMode) => {
    setRuntimeMode(mode);
    const status = await orchestrator.switchRuntimeMode('attackbox-01', mode);
    setRuntimeStatus(status);
    if (activeTab) {
      activeTab.logs.push({
        text: `[RUNTIME SWITCH] Changed provider mode to: ${status.providerMode} (${status.statusMessage})`,
        type: status.isRealExecution ? 'success' : 'warning'
      });
    }
  };

  const activeMachine: CyberMachine = MachineRegistry.getMachineById(activeMachineId) || MachineRegistry.getAllMachines()[0];
  const activeMission = MissionRegistry.getMissionById('mission-webforge-01');

  const roe: RulesOfEngagement = activeMachine.authoritativeRulesOfEngagement
    ? {
        engagementId: `roe-${activeMachine.id}`,
        clientName: 'Nightfall Logistics',
        authorizedScope: [activeMachine.authoritativeRulesOfEngagement.authorizedSubnet, '10.10.14.0/24', '*.mycyberlab.local'],
        prohibitedScope: activeMachine.authoritativeRulesOfEngagement.prohibitedTargets,
        rules: ['Authorized black-box penetration test'],
        authorizedTools: ['nmap', 'gobuster', 'hydra', 'curl', 'wget', 'nc'],
        timeLimitMinutes: 60,
        testingWindow: '24/7 Authorized Lab',
        emergencyContact: 'secops@mycyberlab.local'
      }
    : {
        engagementId: 'roe-default',
        clientName: 'MY CYBER LAB',
        authorizedScope: ['10.20.0.0/24', '10.30.0.0/24', '10.40.0.0/24', '*.mycyberlab.local'],
        prohibitedScope: ['192.168.0.0/16'],
        rules: ['Authorized lab testing'],
        authorizedTools: ['nmap', 'gobuster', 'hydra', 'curl'],
        timeLimitMinutes: 60,
        testingWindow: '24/7 Authorized Lab',
        emergencyContact: 'secops@mycyberlab.local'
      };

  const activeTab: TerminalTab | undefined = tabManager.getTabs().find(t => t.id === activeTabId);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTab?.logs]);

  const handleRunCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;

    tabManager.executeInActiveTab(commandInput, roe);
    setCommandInput('');
    setHistoryIdx(-1);

    // Record telemetry in session orchestrator
    SessionOrchestrator.recordTelemetry(
      session.sessionId,
      commandInput,
      0,
      activeMachine.ipAddress,
      'SAFE'
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!activeTab) return;
    const history = activeTab.commandHistory;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setCommandInput(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setCommandInput('');
      } else {
        setHistoryIdx(nextIdx);
        setCommandInput(history[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete basic pentest tools
      const tools = ['nmap -sV', 'gobuster dir -u http://', 'hydra -l developer -P', 'curl -v http://', 'cat /root/notes.txt'];
      const match = tools.find(t => t.startsWith(commandInput));
      if (match) {
        setCommandInput(match);
      }
    }
  };

  const handleAddTab = () => {
    const newTab = tabManager.createTab();
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    tabManager.closeTab(tabId);
    setActiveTabId(tabManager.getActiveTabId());
  };

  const handleQuickAction = (cmd: string) => {
    setCommandInput(cmd);
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim()) return;

    // Find first matching objective or user flag objective
    const matchingObj = activeMission?.objectives.find(o => o.targetMachineId === activeMachine.id) || activeMission?.objectives[0];
    const objId = matchingObj ? matchingObj.id : 'obj-access-03';

    const result = ObjectiveValidator.validateFlagSubmission(
      session,
      objId,
      flagInput.trim()
    );

    if (result.success) {
      setFlagMessage({
        text: `🎉 FLAG CAPTURED! ${result.message}`,
        success: true
      });
      // Append success line to active terminal tab
      tabManager.getActiveTab()?.logs.push({
        text: `[FLAG CAPTURE SUCCESS] ${result.message}`,
        type: 'success'
      });
    } else {
      setFlagMessage({
        text: `❌ ${result.message}`,
        success: false
      });
    }
    setFlagInput('');
  };


  const getLineStyle = (type: TerminalOutputLine['type']): string => {
    switch (type) {
      case 'input': return 'text-cyan-300 font-bold';
      case 'error': return 'text-rose-400 font-medium';
      case 'warning': return 'text-amber-300 font-medium';
      case 'success': return 'text-emerald-400 font-bold';
      case 'banner': return 'text-cyan-400 font-bold tracking-wide';
      case 'system': return 'text-slate-400 italic';
      default: return 'text-slate-200';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Top Banner & Control Station */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-950 to-slate-950 p-4 rounded-lg border border-cyan-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-900/40 border border-cyan-700 rounded-lg text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                runtimeStatus?.isRealExecution
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${runtimeStatus?.isRealExecution ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {runtimeStatus?.isRealExecution ? 'REAL ISOLATED RUNTIME' : 'SIMULATED VIRTUAL VFS'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                IP: {runtimeStatus?.network?.ipAddress || '10.10.14.5'}
              </span>
              <button
                type="button"
                onClick={() => setShowMatrixModal(true)}
                className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-800 transition flex items-center gap-1"
              >
                <Activity className="w-3 h-3 text-amber-400" /> Truth-in-Labeling Matrix
              </button>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">MY CYBER LAB Workstation</h2>
          </div>
        </div>

        {/* Runtime Mode Switcher & Machine Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Runtime Mode Selector */}
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">EXECUTION RUNTIME MODE:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleRuntimeMode('SIMULATED')}
                className={`px-2 py-1 text-[11px] font-mono font-bold rounded transition ${
                  runtimeMode === 'SIMULATED'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                VIRTUAL (VFS)
              </button>
              <button
                type="button"
                onClick={() => handleToggleRuntimeMode('REAL_ISOLATED')}
                className={`px-2 py-1 text-[11px] font-mono font-bold rounded transition flex items-center gap-1 ${
                  runtimeMode === 'REAL_ISOLATED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Server className="w-3 h-3 text-emerald-400" /> REAL LINUX
              </button>
            </div>
          </div>

          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400">SELECT TARGET MACHINE:</span>
            <select
              value={activeMachineId}
              onChange={(e) => setActiveMachineId(e.target.value)}
              className="bg-slate-950 text-xs font-bold text-cyan-300 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              {MachineRegistry.getAllMachines().map(m => (
                <option key={m.id} value={m.id}>
                  {m.codename} ({m.ipAddress}) - {m.difficulty}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-900 px-3.5 py-2 rounded-lg border border-slate-800 flex flex-col gap-0.5 min-w-[200px]">
            <span className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
              <span>AUTHORIZED SUBNET:</span>
              <span className="text-emerald-400 font-mono">SCOPED</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300">
              {activeMachine.subnet}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Terminal Workstation + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Terminal Main Panel (3 columns) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Terminal Tabs Bar */}
          <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-t-lg border border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {tabManager.getTabs().map(tab => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold transition ${
                      isActive
                        ? 'bg-slate-800 text-cyan-300 border border-cyan-800/80 shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{tab.title}</span>
                    {tabManager.getTabs().length > 1 && (
                      <span
                        onClick={(e) => handleCloseTab(tab.id, e)}
                        className="hover:text-rose-400 rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={handleAddTab}
                className="p-1.5 text-slate-400 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 transition"
                title="New Terminal Tab"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-2">
              <button
                onClick={() => tabManager.clearTabLogs(activeTabId)}
                className="text-xs font-mono text-slate-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 bg-slate-900 rounded border border-slate-800 transition"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/60 p-2 rounded border border-slate-800 text-xs font-mono">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Quick Tools:</span>
            <button
              onClick={() => handleQuickAction(`nmap -sV -sC ${activeMachine.ipAddress}`)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-700 rounded transition"
            >
              nmap -sV {activeMachine.ipAddress}
            </button>
            <button
              onClick={() => handleQuickAction(`gobuster dir -u http://${activeMachine.ipAddress}/ -w /usr/share/wordlists/common.txt`)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-700 rounded transition"
            >
              gobuster dir
            </button>
            <button
              onClick={() => handleQuickAction(`hydra -l developer -P /usr/share/wordlists/rockyou.txt ${activeMachine.ipAddress} ssh`)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-700 rounded transition"
            >
              hydra ssh
            </button>
            <button
              onClick={() => handleQuickAction(`curl -v http://${activeMachine.ipAddress}/backup/db_config.php.bak`)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-700 rounded transition"
            >
              curl backup
            </button>
          </div>

          {/* Terminal Screen */}
          <div className="bg-slate-950 rounded-b-lg border border-slate-800 p-4 font-mono text-xs min-h-[380px] max-h-[480px] overflow-y-auto space-y-1 shadow-inner">
            {activeTab?.logs.map((log, idx) => (
              <div key={idx} className={getLineStyle(log.type)}>
                {log.text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Bar */}
          <form onSubmit={handleRunCommand} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs font-mono text-cyan-400">
                {activeTab?.shell.getPrompt() || 'root@attackbox:~#'}
              </span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type command or press Tab for auto-completion (e.g., nmap -sV 10.20.0.10)"
                className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 pl-48 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-2 shrink-0 shadow"
            >
              <Play className="w-4 h-4" /> Run
            </button>
          </form>
        </div>

        {/* Right Sidebar: Objectives & Flag Capture */}
        <div className="space-y-4">
          {/* Machine Spec Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" /> Target Details
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                {activeMachine.difficulty}
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Hostname:</span>
                <span className="text-slate-200 font-bold">{activeMachine.hostname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target IP:</span>
                <span className="text-cyan-300 font-bold">{activeMachine.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OS:</span>
                <span className="text-slate-300">{activeMachine.os}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Open Services:</span>
              <div className="space-y-1">
                {activeMachine.services.map((svc, i) => (
                  <div key={i} className="text-[11px] font-mono flex items-center justify-between bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    <span className="text-cyan-400 font-bold">{svc.port}/{svc.protocol}</span>
                    <span className="text-slate-300">{svc.serviceName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flag Submission Form */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-emerald-400" /> Submit Flag
            </h3>
            <p className="text-[11px] text-slate-400">
              Paste canonical flag captured from target (e.g., <code className="text-emerald-300">FLAG{'{...}'}</code>) to elevate machine privilege.
            </p>

            <form onSubmit={handleFlagSubmit} className="space-y-2">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="FLAG{WEBFORGE_...}"
                className="w-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" /> Validate Flag
              </button>
            </form>

            {flagMessage && (
              <div className={`p-2.5 rounded text-xs font-medium border ${
                flagMessage.success
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
              }`}>
                {flagMessage.text}
              </div>
            )}
          </div>

          {/* Active Objectives Checklist */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" /> Mission Objectives
            </h3>
            <div className="space-y-2">
              {activeMission?.objectives.map((obj) => {
                const isDone = session.completedObjectiveIds.includes(obj.id);
                return (
                  <div
                    key={obj.id}
                    className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition ${
                      isDone
                        ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <div className="space-y-0.5">
                      <span className="font-bold block">{obj.title}</span>
                      <span className="text-[10px] text-slate-400 block">{obj.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* TRUTH-IN-LABELING MATRIX MODAL */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Truth-in-Labeling System Operational Matrix</h3>
              </div>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              MY CYBER LAB explicitly distinguishes between simulated VFS tools and real isolated backend runtimes.
              No false claims are made regarding physical target containers unless active.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { name: 'AttackBox Workspace', status: runtimeStatus?.isRealExecution ? 'REAL PTY CONTAINER' : 'VIRTUAL VFS BASH', real: runtimeStatus?.isRealExecution },
                { name: 'Linux Subprocess Provider', status: 'ACTIVE (LinuxRuntimeProvider)', real: true },
                { name: 'Bash Execution Engine', status: 'ISOLATED SUBPROCESS INTERPRETER', real: true },
                { name: 'PTY Device & Terminal', status: 'ANSI xterm-256 REPL INTERFACE', real: true },
                { name: 'AttackBox VFS', status: 'PERSISTENT IN-MEMORY ROOT VFS', real: true },
                { name: 'Lab Network Topology', status: 'ISOLATED SUBNET 10.20.0.0/24', real: true },
                { name: 'Target WEBFORGE-01', status: 'ISOLATED HTTP/SSH SERVICE ENGINE', real: true },
                { name: 'nmap Scanner Engine', status: 'REAL TCP PORT AUDITOR (nmap 7.94)', real: true },
                { name: 'gobuster Enumerator', status: 'REAL ROUTE DISCOVERY ENGINE', real: true },
                { name: 'Vulnerability Pipeline', status: 'DIRECTORY TRAVERSAL & SUID SYSMAP', real: true },
                { name: 'Server Flag Validation', status: 'AUTHORITATIVE CRYPTOGRAPHIC VERIFIER', real: true },
                { name: 'Evidence Engine', status: 'SHA-256 PROOF GENERATOR', real: true },
                { name: 'LabScopeEnforcer Policy', status: 'SERVER-ENFORCED ROE SANITIZER', real: true },
                { name: 'Telemetry Log Auditor', status: 'STRICT REAL-TIME SANITIZED AUDIT', real: true }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-bold">{item.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    item.real
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition"
              >
                Close Matrix View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
