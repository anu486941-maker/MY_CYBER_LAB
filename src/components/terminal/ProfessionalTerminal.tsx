import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Plus,
  X,
  Columns,
  Square,
  Copy,
  Download,
  Trash2,
  Lock,
  RotateCcw,
  Search,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Server,
  Globe,
  CheckCircle2,
  Play,
  Cpu,
  CornerDownLeft,
  ChevronDown,
  Layers,
  BookOpen,
  Send,
  Zap,
  AlertTriangle,
  History,
  Command
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncidentState, executeSimulatedCommand, clearLastFailureInfo, IncidentStateEngine } from '../../utils/incidentStateEngine';
import { ActionFailureModal } from '../common/ActionFailureModal';
import { LabEnvironment } from '../../cyberrange/LabEnvironment';
import { CommandEngine } from '../../cyberrange/CommandEngine';

export interface CommandExplanation {
  command: string;
  result: string;
  whatYouDiscovered: string;
  whyItMatters: string;
  mitreConnection: string;
  nextInvestigation: string;
}

interface TerminalTab {
  id: string;
  name: string;
  target: string;
  logs: Array<{ text: string; type: 'cmd' | 'output' | 'err' | 'system'; timestamp?: string }>;
  explanation?: CommandExplanation | null;
}

interface ProfessionalTerminalProps {
  incidentState?: IncidentState;
  onStateUpdated?: (newState: IncidentState) => void;
  labEnv?: LabEnvironment;
  onEnvUpdated?: (newEnv: LabEnvironment) => void;
  missionTitle?: string;
  targetHost?: string;
  networkRange?: string;
  currentUser?: string;
  roe?: string;
}

export const ProfessionalTerminal: React.FC<ProfessionalTerminalProps> = ({
  incidentState,
  onStateUpdated,
  labEnv,
  onEnvUpdated,
  missionTitle = 'Investigate Initial Access & Footprint',
  targetHost = 'FINANCE-SIM-01',
  networkRange = '10.10.20.0/24',
  currentUser = 'student',
  roe = 'AUTHORIZED SIMULATION'
}) => {
  const { addXp, addEvidence, completeMission } = useApp();

  // Internal fallback state to preserve backward compatibility
  const [localIncidentState, setLocalIncidentState] = useState<IncidentState>(() => {
    return incidentState || IncidentStateEngine.loadOrCreateState(labEnv?.labId || 'general-sandbox');
  });

  useEffect(() => {
    if (incidentState) {
      setLocalIncidentState(incidentState);
    }
  }, [incidentState]);

  const activeIncidentState = incidentState || localIncidentState;
  const activeOnStateUpdated = onStateUpdated || ((ns) => setLocalIncidentState(ns));

  // Terminal Tabs State
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: 'tab-1',
      name: 'Recon & Scanning',
      target: targetHost,
      logs: [
        { text: `[AUTHORIZED SIMULATED CYBER RANGE ENGINE v2.0]`, type: 'system' },
        { text: `TARGET: ${targetHost} | NETWORK: ${networkRange} | USER: ${currentUser}`, type: 'system' },
        { text: `MISSION: ${missionTitle} | ROE: ${roe}`, type: 'system' },
        { text: `Type "help" or select a suggested command below to begin.`, type: 'system' }
      ]
    },
    {
      id: 'tab-2',
      name: 'Service Enumeration',
      target: 'WEB-SIM-01',
      logs: [
        { text: `[TAB 2: SERVICE ENUMERATION STREAM]`, type: 'system' },
        { text: `Ready for HTTP header inspection and web endpoint fuzzing.`, type: 'system' }
      ]
    }
  ]);

  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [splitTabId, setSplitTabId] = useState<string>('tab-2');

  // Input & Command History State
  const [commandInput, setCommandInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([
    'nmap 10.10.20.25',
    'curl -I http://10.10.20.25/api/v1/customer?id=101',
    'whoami',
    'cat /etc/shadow',
    'retest'
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Command Aliases Map
  const COMMAND_ALIASES: Record<string, string> = {
    'll': 'ls -la',
    'la': 'ls -la',
    'nmap-fast': 'nmap -F 10.10.20.25',
    'web-enum': 'gobuster dir -u http://10.10.20.25',
    'dir-scan': 'gobuster dir -u http://10.10.20.25',
    'sql-scan': 'sqlmap -u http://10.10.20.25/api/v1/customer?id=101',
    'nikto-scan': 'nikto -h 10.10.20.25',
    'hydra-pass': 'hydra -l admin -P pass.txt 10.10.20.25 ssh',
    'smb-enum': 'enum4linux -a 10.10.20.25',
    'whois-query': 'whois finvault.local',
    'ping-test': 'ping -c 4 10.10.20.25',
    'check-suid': 'find / -perm -4000 2>/dev/null',
    'my-id': 'id',
    'open-ports': 'ss -tuln'
  };

  // Socratic Pre-Execution Modal State
  const [socraticModalOpen, setSocraticModalOpen] = useState<boolean>(false);
  const [pendingCommand, setPendingCommand] = useState<string>('');
  const [studentIntent, setStudentIntent] = useState<string>('');
  const [studentExpectation, setStudentExpectation] = useState<string>('');

  // Selected Target & Environment
  const [selectedTarget, setSelectedTarget] = useState<string>(targetHost);
  const [selectedEnv, setSelectedEnv] = useState<string>('SIMULATED_FINANCIAL_RANGE');

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tabs]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const secondaryTab = tabs.find(t => t.id === splitTabId) || tabs[1] || tabs[0];

  // Command Suggestions list
  const suggestedCommands = [
    { cmd: 'nmap 10.10.20.25', label: 'Port Scan' },
    { cmd: 'curl -I http://10.10.20.25', label: 'HTTP Headers' },
    { cmd: 'dig @10.10.20.1 api.finvault.local', label: 'DNS Query' },
    { cmd: 'whoami', label: 'Current User' },
    { cmd: 'id', label: 'Permissions' },
    { cmd: 'ls -la /var/www/html', label: 'List Files' },
    { cmd: 'cat /etc/passwd', label: 'Read Users' },
    { cmd: 'ss -tuln', label: 'Open Sockets' },
    { cmd: 'ps aux', label: 'Running Processes' },
    { cmd: 'evidence lock', label: 'Lock Evidence' },
    { cmd: 'retest', label: 'Blue Retest' },
    { cmd: 'clear', label: 'Clear' }
  ];

  // Keyboard navigation for history & tab autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setCommandInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCommandInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab Autocomplete: check aliases first, then suggested commands
      const lowerInput = commandInput.toLowerCase();
      const aliasMatch = Object.keys(COMMAND_ALIASES).find(a => a.startsWith(lowerInput));
      if (aliasMatch) {
        setCommandInput(COMMAND_ALIASES[aliasMatch]);
      } else {
        const matching = suggestedCommands.find(c => c.cmd.toLowerCase().startsWith(lowerInput));
        if (matching) {
          setCommandInput(matching.cmd);
        }
      }
    }
  };

  const executeCommandInternal = (cmdToRun: string, tabId: string) => {
    let trimmed = cmdToRun.trim();
    if (!trimmed) return;

    // Expand CLI Alias if applicable
    const resolvedCmd = COMMAND_ALIASES[trimmed.toLowerCase()] || trimmed;

    // Add to history
    setCommandHistory(prev => [...prev.filter(c => c !== trimmed && c !== resolvedCmd), trimmed]);
    setHistoryIndex(-1);

    if (resolvedCmd.toLowerCase() === 'clear') {
      setTabs(prev => prev.map(t => t.id === tabId ? { ...t, logs: [] } : t));
      return;
    }

    if (resolvedCmd.toLowerCase() === 'help') {
      setShowHelpModal(true);
    }

    const kaliPrompt = `┌──(${currentUser}㉿kali)-[~/mission]\n└─$ ${trimmed}${trimmed !== resolvedCmd ? ` (alias -> ${resolvedCmd})` : ''}`;

    // Append command to tab log
    setTabs(prev => prev.map(t => {
      if (t.id === tabId) {
        return {
          ...t,
          logs: [...t.logs, { text: kaliPrompt, type: 'cmd', timestamp: new Date().toLocaleTimeString() }]
        };
      }
      return t;
    }));

    // Execute stateful logic from engine using resolved command
    let output = '';
    if (labEnv && onEnvUpdated) {
      const result = CommandEngine.executeCommand(labEnv, resolvedCmd);
      output = result.output;
      onEnvUpdated(result.updatedEnvironment);

      // Keep legacy incidentState synced if passed
      if (incidentState && onStateUpdated) {
        const { updatedState } = executeSimulatedCommand(incidentState, resolvedCmd);
        onStateUpdated(updatedState);
      }
    } else {
      const { updatedState, output: resOutput } = executeSimulatedCommand(activeIncidentState, resolvedCmd);
      output = resOutput;
      activeOnStateUpdated(updatedState);
    }

    // Build structured teaching explanation
    const explanation = generatePostExecutionExplanation(trimmed, output, activeIncidentState);

    // Append output & explanation
    setTabs(prev => prev.map(t => {
      if (t.id === tabId) {
        return {
          ...t,
          logs: [
            ...t.logs,
            { text: output, type: 'output', timestamp: new Date().toLocaleTimeString() }
          ],
          explanation
        };
      }
      return t;
    }));

    // If command was evidence lock or retest
    if (trimmed.toLowerCase().startsWith('evidence lock')) {
      addEvidence({
        engagementId: 'eng-01',
        assetId: 'target-01',
        assetIp: '10.10.20.25',
        type: 'COMMAND_OUTPUT',
        description: `Terminal Output Capture: ${trimmed}`,
        rawContent: output,
        analystNote: 'Locked from Professional Terminal CLI',
        verified: true,
        integrityHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      });
      addXp(50);
    } else if (trimmed.toLowerCase() === 'retest' && (activeIncidentState.remediationStatus === 'REMEDIATED' || (labEnv && labEnv.remediationStatus === 'REMEDIATED'))) {
      completeMission('fin-001');
      addXp(200);
    }
  };

  const generatePostExecutionExplanation = (cmd: string, output: string, state: IncidentState): CommandExplanation => {
    const lower = cmd.toLowerCase();
    if (lower.startsWith('nmap')) {
      return {
        command: cmd,
        result: 'Network Ports & Services Discovered',
        whatYouDiscovered: 'Discovered open HTTP port 80 (Nginx), HTTPS 443, and PostgreSQL database listener port 5432.',
        whyItMatters: 'Exposed database ports on network interfaces expand the attack surface and enable direct password bruteforcing or remote SQL injection.',
        mitreConnection: 'T1046 - Network Service Discovery',
        nextInvestigation: 'Inspect HTTP endpoint responses using "curl" or enumerate PostgreSQL database parameters.'
      };
    } else if (lower.startsWith('curl')) {
      return {
        command: cmd,
        result: 'HTTP API Response Headers Captured',
        whatYouDiscovered: 'Target server is running Express/4.18.2 behind Nginx proxy with active API endpoint /api/v1/customer?id=101.',
        whyItMatters: 'API endpoints accepting parameter queries without input validation are prime targets for SQL Injection and Broken Object Level Authorization (BOLA).',
        mitreConnection: 'T1190 - Exploit Public-Facing Application',
        nextInvestigation: 'Formulate an SQL injection hypothesis or test parameter sanitization with single quotes.'
      };
    } else if (lower.includes('sql') || lower.includes('select')) {
      return {
        command: cmd,
        result: 'SQL Injection Verified & Hash Extracted',
        whatYouDiscovered: 'Extracted PostgreSQL administrator credential hash: $6$saltsalt$hashedpassword99281.',
        whyItMatters: 'Unauthenticated database read access allows full data exfiltration and credential harvesting.',
        mitreConnection: 'T1005 - Data from Local System / Database',
        nextInvestigation: 'Check SUID binaries or administrative escalation paths using "whoami" and "cat /etc/shadow".'
      };
    } else if (lower.startsWith('whoami') || lower.startsWith('id')) {
      return {
        command: cmd,
        result: 'Process Execution Identity Evaluated',
        whatYouDiscovered: 'Current effective UID is 0 (root) via SUID python3 binary abuse.',
        whyItMatters: 'Achieving root access gives total administrative control over operating system processes, files, and audit logs.',
        mitreConnection: 'T1548.001 - Abuse Elevation Control Mechanism: Setuid and Setgid',
        nextInvestigation: 'Deploy Blue Team hardening rules using the "retest" command to verify vulnerability mitigation.'
      };
    } else {
      return {
        command: cmd,
        result: 'Command Executed in Cyber Range',
        whatYouDiscovered: 'System state updated in isolated container simulator.',
        whyItMatters: 'Every command produces digital footprint evidence that SIEM sensors monitor in realtime.',
        mitreConnection: 'T1059.004 - Unix Shell Command Execution',
        nextInvestigation: 'Review SIEM telemetry alerts or execute defensive retesting.'
      };
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    setCommandInput('');

    // Socratic checkpoint trigger for key commands
    const lower = cmd.toLowerCase();
    const isMajorCmd = lower.startsWith('nmap') || lower.startsWith('sql') || lower.startsWith('curl') || lower.includes('shadow') || lower === 'retest';

    if (isMajorCmd && !socraticModalOpen) {
      setPendingCommand(cmd);
      setSocraticModalOpen(true);
    } else {
      executeCommandInternal(cmd, activeTabId);
    }
  };

  const handleConfirmSocratic = () => {
    setSocraticModalOpen(false);
    if (pendingCommand) {
      executeCommandInternal(pendingCommand, activeTabId);
      setPendingCommand('');
      setStudentIntent('');
      setStudentExpectation('');
    }
  };

  const handleAddTab = () => {
    const newId = `tab-${tabs.length + 1}`;
    const newTab: TerminalTab = {
      id: newId,
      name: `Shell ${tabs.length + 1}`,
      target: selectedTarget,
      logs: [
        { text: `[SHELL ${tabs.length + 1} INITIALIZED]`, type: 'system' },
        { text: `Target: ${selectedTarget} | Environment: ${selectedEnv}`, type: 'system' }
      ]
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    const remaining = tabs.filter(t => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) setActiveTabId(remaining[0].id);
    if (splitTabId === id) setSplitTabId(remaining[0].id);
  };

  const handleCopyLogs = (tab: TerminalTab) => {
    const text = tab.logs.map(l => l.text).join('\n');
    navigator.clipboard.writeText(text);
  };

  const handleSaveLogs = (tab: TerminalTab) => {
    const text = tab.logs.map(l => l.text).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-log-${tab.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
  };

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
      
      {/* =========================================================================
          HUD BANNER (TARGET, NETWORK, USER, MISSION, ROE)
          ========================================================================= */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5 text-cyan-300 font-bold">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>TARGET:</span>
            <span className="text-slate-100">{selectedTarget}</span>
          </div>

          <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5 text-purple-300 font-bold">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>NET:</span>
            <span className="text-slate-100">{networkRange}</span>
          </div>

          <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5 text-emerald-300 font-bold">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>USER:</span>
            <span className="text-slate-100">{currentUser}</span>
          </div>

          <div className="hidden md:flex px-2.5 py-1 rounded bg-slate-950 border border-slate-800 items-center gap-1.5 text-amber-300 font-bold">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>MISSION:</span>
            <span className="text-slate-200 max-w-[200px] truncate">{missionTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {roe}
          </span>
        </div>
      </div>

      {/* =========================================================================
          TOOLBAR & TAB NAVIGATION
          ========================================================================= */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-2 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
        {/* Terminal Tabs */}
        <div className="flex items-center gap-1.5">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-950 border-purple-500/50 text-purple-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tab.name}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={handleAddTab}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="New Terminal Tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1 text-[11px] font-bold"
            title="Command History"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">HISTORY</span>
          </button>

          <button
            onClick={() => setIsSplitView(!isSplitView)}
            className={`p-1.5 rounded-lg border transition-all ${
              isSplitView ? 'bg-purple-950 border-purple-500/50 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Split Terminal View"
          >
            {isSplitView ? <Square className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => handleCopyLogs(activeTab)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy Terminal Logs"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleSaveLogs(activeTab)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Save Output to File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => executeCommandInternal('evidence lock', activeTabId)}
            className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm"
            title="Lock Current Output to Evidence Locker"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Lock Evidence</span>
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 hover:text-purple-200 transition-colors"
            title="AMAN Guidance & Help"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          </button>

          <button
            onClick={() => executeCommandInternal('clear', activeTabId)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          TERMINAL CONSOLE VIEW PANES (SINGLE VS SPLIT)
          ========================================================================= */}
      <div className={`grid ${isSplitView ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800' : 'grid-cols-1'} bg-slate-950 min-h-[360px] max-h-[500px]`}>
        
        {/* Main Terminal Pane */}
        <div className="p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-2">
          <div className="space-y-1">
            {activeTab.logs
              .map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    log.type === 'cmd' ? 'text-cyan-300 font-bold flex items-center justify-between' :
                    log.type === 'err' ? 'text-rose-400 font-semibold' :
                    log.type === 'system' ? 'text-purple-300 font-semibold' :
                    'text-emerald-400/90'
                  }`}
                >
                  <span>{log.text}</span>
                  {log.timestamp && <span className="text-[9px] text-slate-600 font-mono ml-2">{log.timestamp}</span>}
                </div>
              ))}
            <div ref={consoleEndRef} />
          </div>

          {/* Post-Execution Structured Explanation Card */}
          {activeTab.explanation && (
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs space-y-2 my-2 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                <span className="text-purple-300 font-bold flex items-center gap-1.5 uppercase text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AMAN TEACHING ANALYSIS — {activeTab.explanation.result}</span>
                </span>
                <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30">
                  {activeTab.explanation.mitreConnection}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] leading-relaxed">
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 font-bold block text-[10px]">WHAT YOU DISCOVERED:</span>
                  <span className="text-slate-200">{activeTab.explanation.whatYouDiscovered}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 font-bold block text-[10px]">WHY IT MATTERS:</span>
                  <span className="text-slate-200">{activeTab.explanation.whyItMatters}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-purple-900/30 border border-purple-500/30 text-[11px] flex items-center justify-between">
                <span className="text-purple-200">
                  <strong className="text-purple-300">RECOMMENDED NEXT INVESTIGATION: </strong>
                  {activeTab.explanation.nextInvestigation}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Secondary Terminal Pane (Split View) */}
        {isSplitView && (
          <div className="p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-2 bg-slate-950/80">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>SPLIT PANE: {secondaryTab.name}</span>
              </span>
              <span className="text-[10px] text-slate-500">Target: {secondaryTab.target}</span>
            </div>

            <div className="space-y-1 flex-1">
              {secondaryTab.logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    log.type === 'cmd' ? 'text-cyan-300 font-bold' :
                    log.type === 'err' ? 'text-rose-400' :
                    log.type === 'system' ? 'text-purple-300' :
                    'text-emerald-400/90'
                  }`}
                >
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SUGGESTED COMMANDS QUICK CHIPS BAR
          ========================================================================= */}
      <div className="bg-slate-900/80 border-t border-slate-800 p-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0 px-1">SUGGESTIONS:</span>
        {suggestedCommands.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCommandInput(item.cmd);
            }}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-purple-300 text-[10px] font-bold shrink-0 transition-colors flex items-center gap-1"
          >
            <span>{item.label}:</span>
            <code className="text-purple-400 font-normal">{item.cmd}</code>
          </button>
        ))}
      </div>

      {/* =========================================================================
          COMMAND INPUT FORM & KEYBOARD AUTOCOMPLETE (KALI PROMPT)
          ========================================================================= */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-1.5">
        <div className="text-cyan-400 font-bold text-[11px] flex items-center gap-1">
          <span>┌──({currentUser}㉿kali)-[~/mission]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-sm">└─$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type CLI command (e.g. nmap 10.10.20.25, curl, sqlmap, whoami, retest)... Press TAB to autocomplete."
            className="flex-1 bg-transparent font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <span>Execute</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* =========================================================================
          COMMAND HISTORY MODAL
          ========================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-4 text-slate-100 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <History className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase">COMMAND HISTORY LOG</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                placeholder="Search history (Ctrl+R equivalent)..."
                className="w-full bg-transparent font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1.5 custom-scrollbar">
              {commandHistory
                .filter(cmd => cmd.toLowerCase().includes(historySearchQuery.toLowerCase()))
                .map((cmd, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCommandInput(cmd);
                      setShowHistoryModal(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                  >
                    <code className="text-cyan-300 font-bold group-hover:text-cyan-200">{cmd}</code>
                    <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                  </div>
                ))}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          HELP & AMAN GUIDANCE MODAL
          ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg p-5 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl space-y-4 text-slate-100 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase">AMAN CYBER RANGE CLI HELP</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                <span className="text-purple-300 font-bold uppercase text-[11px]">AVAILABLE COMMAND CATEGORIES:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><code className="text-cyan-300 font-bold">nmap &lt;target&gt;</code> - Reconnaissance & port scanning</li>
                  <li><code className="text-cyan-300 font-bold">curl -I &lt;url&gt;</code> - HTTP header inspection & stack discovery</li>
                  <li><code className="text-cyan-300 font-bold">gobuster dir -u &lt;url&gt;</code> - Web directory/endpoint fuzzing</li>
                  <li><code className="text-cyan-300 font-bold">whoami / id / ps aux</code> - Operating system enumeration</li>
                  <li><code className="text-cyan-300 font-bold">evidence lock</code> - Lock current output as cryptographically hashed evidence</li>
                  <li><code className="text-cyan-300 font-bold">retest</code> - Verify mitigation following Blue Team hardening</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                <strong className="text-amber-400">PRO TIP:</strong> Major commands automatically trigger AMAN Socratic Checkpoints to evaluate your technical hypothesis before execution!
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Return to Terminal
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ACTION FAILURE MODAL (FAILURE AS LEARNING)
          ========================================================================= */}
      {activeIncidentState.lastFailureInfo && (
        <ActionFailureModal
          failureInfo={activeIncidentState.lastFailureInfo}
          onClose={() => {
            const updated = clearLastFailureInfo(activeIncidentState);
            activeOnStateUpdated(updated);
          }}
        />
      )}

      {/* =========================================================================
          SOCRATIC PRE-EXECUTION AMAN MODAL
          ========================================================================= */}
      {socraticModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-5 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl space-y-4 text-slate-100 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                <h3 className="text-sm font-bold uppercase">AMAN SOCRATIC THINKING CHECKPOINT</h3>
              </div>
              <button
                onClick={() => setSocraticModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1">
              <span className="text-slate-400 text-[10px]">PENDING COMMAND:</span>
              <code className="text-purple-300 font-bold block">{pendingCommand}</code>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  1. What are you trying to discover with this command?
                </label>
                <input
                  type="text"
                  value={studentIntent}
                  onChange={(e) => setStudentIntent(e.target.value)}
                  placeholder="E.g. Discovered open ports and active HTTP services..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  2. What response or evidence do you expect to receive?
                </label>
                <input
                  type="text"
                  value={studentExpectation}
                  onChange={(e) => setStudentExpectation(e.target.value)}
                  placeholder="E.g. Nginx service banners or SQL error parameters..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={handleConfirmSocratic}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>Execute & Analyze Telemetry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

