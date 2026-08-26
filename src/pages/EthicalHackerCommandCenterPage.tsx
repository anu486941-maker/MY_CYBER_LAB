import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Terminal as TerminalIcon,
  Shield,
  ShieldAlert,
  Brain,
  Search,
  Activity,
  Layers,
  FileText,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Cpu,
  BarChart2,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sliders,
  Sparkles,
  Printer,
  Compass,
  Building2,
  FolderGit2,
  Trophy,
  Dices
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LIVE_INCIDENT_SCENARIOS, LiveIncidentScenario } from '../data/liveIncidentsData';
import { SIMULATED_TARGET_RANGES, SimulatedEnvironmentRange } from '../data/simulatedTargetRanges';
import {
  IncidentStateEngine,
  IncidentState,
  executeSimulatedCommand,
  resetIncidentWithSeed,
  clearLastFailureInfo,
  AttackerDecisionOption
} from '../utils/incidentStateEngine';
import { ThinkLikeAnEthicalHackerEngine, HypothesisEvaluation } from '../components/ethical-hacker/ThinkLikeAnEthicalHackerEngine';
import { AttackerDecisionEngine } from '../components/ethical-hacker/AttackerDecisionEngine';
import { BluePurpleTeamPanel } from '../components/blue-purple/BluePurpleTeamPanel';
import { ActionFailureModal } from '../components/common/ActionFailureModal';
import { PostIncidentDebriefModal } from '../components/debrief/PostIncidentDebriefModal';
import { CybersecuritySkillGraph } from '../components/skills/CybersecuritySkillGraph';
import { ExecutiveReportGenerator } from '../components/reports/ExecutiveReportGenerator';
import { AskAmanDrawer } from '../components/common/AskAmanDrawer';

export const EthicalHackerCommandCenterPage: React.FC = () => {
  const { addXp, completeMission } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const incidentIdParam = searchParams.get('id') || 'live-inc-01';

  // Active scenario and range state
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidentIdParam);
  const [teamMode, setTeamMode] = useState<'RED' | 'BLUE' | 'PURPLE'>('PURPLE');
  const [activeBottomTab, setActiveBottomTab] = useState<'siem' | 'evidence' | 'hypothesis' | 'retest' | 'skills' | 'report'>('siem');
  const [isAmanOpen, setIsAmanOpen] = useState<boolean>(false);
  const [showDebriefModal, setShowDebriefModal] = useState<boolean>(false);

  // Stateful incident engine
  const [incidentState, setIncidentState] = useState<IncidentState>(() => {
    return IncidentStateEngine.loadOrCreateState(selectedIncidentId);
  });

  // Seed Input state
  const [seedInput, setSeedInput] = useState<string>(String(incidentState.seed || '1337'));

  // Target Range selection
  const [selectedRange, setSelectedRange] = useState<SimulatedEnvironmentRange>(SIMULATED_TARGET_RANGES[0]);

  // Terminal state
  const [commandInput, setCommandInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<{ text: string; type: 'cmd' | 'output' | 'err' | 'system' }[]>([
    { text: '============================================================', type: 'system' },
    { text: '   MY CYBER LAB — ETHICAL HACKER COMMAND CENTER v5.0', type: 'system' },
    { text: '   Target Sandbox: FinVault Infrastructure [10.10.20.0/24]', type: 'system' },
    { text: '   Type "help" to display the multi-pane range helper guides.', type: 'system' },
    { text: '============================================================', type: 'system' }
  ]);

  // Phase 3 Extended UI state: notebook tabs
  const [notebookTab, setNotebookTab] = useState<'facts' | 'hypotheses' | 'intel' | 'evidence'>('facts');

  // Latency benchmark metrics
  const [latencyMetrics, setLatencyMetrics] = useState({
    routerLatencyMs: 1.4,
    toolLatencyMs: 12.2,
    contextLatencyMs: 3.8,
    geminiTtftMs: 310,
    totalResponseMs: 327.4
  });

  useEffect(() => {
    if (incidentIdParam !== selectedIncidentId) {
      setSelectedIncidentId(incidentIdParam);
      const newState = IncidentStateEngine.loadOrCreateState(incidentIdParam);
      setIncidentState(newState);
      setSeedInput(String(newState.seed || '1337'));
    }
  }, [incidentIdParam]);

  const currentScenario = LIVE_INCIDENT_SCENARIOS.find(s => s.id === selectedIncidentId) || LIVE_INCIDENT_SCENARIOS[0];

  const handleIncidentChange = (id: string) => {
    setSelectedIncidentId(id);
    setSearchParams({ id });
    const newState = IncidentStateEngine.loadOrCreateState(id);
    setIncidentState(newState);
    setSeedInput(String(newState.seed || '1337'));
    setTerminalLogs([
      { text: `[SYSTEM] Switched active incident target to: ${id}`, type: 'system' },
      { text: `Type "help" or "nmap" to start active reconnaissance.`, type: 'system' }
    ]);
  };

  const handleResetIncident = () => {
    const seedNum = parseInt(seedInput, 10) || 1337;
    const freshState = resetIncidentWithSeed(selectedIncidentId, seedNum);
    setIncidentState(freshState);
    setTerminalLogs([{ text: `[SYSTEM] Target environment reset to seed: ${seedInput}`, type: 'system' }]);
  };

  const handleRandomSeed = () => {
    const newSeedNum = Math.floor(1000 + Math.random() * 9000);
    const newSeedStr = newSeedNum.toString();
    setSeedInput(newSeedStr);
    const freshState = resetIncidentWithSeed(selectedIncidentId, newSeedNum);
    setIncidentState(freshState);
    setTerminalLogs([{ text: `[SYSTEM] Deterministic seed regenerated: ${newSeedStr}`, type: 'system' }]);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    setTerminalLogs(prev => [...prev, { text: `$ ${cmd}`, type: 'cmd' }]);
    setCommandInput('');

    if (cmd.toLowerCase() === 'clear') {
      setTerminalLogs([]);
      return;
    }

    setTimeout(() => {
      const { updatedState, output } = executeSimulatedCommand(incidentState, cmd);
      setIncidentState(updatedState);
      setTerminalLogs(prev => [...prev, { text: output, type: 'output' }]);

      if (updatedState.remediationStatus === 'REMEDIATED') {
        completeMission(currentScenario.id);
      }
    }, 150);
  };

  const handleDecisionChosen = (option: AttackerDecisionOption) => {
    setTerminalLogs(prev => [
      ...prev,
      { text: `[DECISION CHOSEN] ${option.label}`, type: 'system' },
      { text: option.feedback, type: 'output' }
    ]);
    if (option.nextSuggestedCommand) {
      setCommandInput(option.nextSuggestedCommand);
    }
  };

  const handleNodeClick = (node: any) => {
    if (node.status === 'UNKNOWN') {
      setTerminalLogs(prev => [
        ...prev,
        { text: `[SYSTEM-ERROR] Node "${node.label}" is currently undisclosed. Satisfy active objectives or run security tools to discover this resource.`, type: 'err' }
      ]);
      return;
    }
    
    let suggested = '';
    if (node.id === 'web') {
      suggested = `curl -i http://${node.ip}/api/v1/customer?id=101`;
    } else if (node.id === 'db') {
      suggested = `sqlmap -u http://10.10.20.10/api/v1/customer?id=101 --dbms=postgresql`;
    } else if (node.id === 'auth') {
      suggested = `ssh admin@${node.ip}`;
    } else if (node.id === 'dc') {
      suggested = `ldapsearch -h ${node.ip} -x -b "dc=finvault,dc=local"`;
    } else {
      suggested = `nmap -sV -sC ${node.ip}`;
    }
    
    setCommandInput(suggested);
    setTerminalLogs(prev => [
      ...prev,
      { text: `[SYSTEM] Target node "${node.label}" (${node.ip}) selected. Suggesting appropriate range command:`, type: 'system' },
      { text: `  $ ${suggested}`, type: 'cmd' }
    ]);
  };

  const handleNotebookChange = (field: 'knownFacts' | 'hypotheses' | 'discoveredIntel' | 'evidenceNotes', val: string) => {
    const updated = {
      ...incidentState,
      notebook: {
        ...incidentState.notebook,
        [field]: val
      }
    };
    setIncidentState(updated);
    IncidentStateEngine.saveState(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* 1. TOP BAR COMMAND CENTER RIBBON */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">
                ETHICAL HACKER COMMAND CENTER
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">LIVE STAGE: {incidentState.currentStage}</span>
            </div>
            <h1 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
              <span>{currentScenario.code}: {currentScenario.title}</span>
            </h1>
          </div>
        </div>

        {/* Incident Dropdown & Range Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedIncidentId}
            onChange={(e) => handleIncidentChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-purple-500"
          >
            {LIVE_INCIDENT_SCENARIOS.map(s => (
              <option key={s.id} value={s.id}>
                [{s.code}] {s.title} ({s.difficulty})
              </option>
            ))}
          </select>

          {/* Team Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setTeamMode('RED')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                teamMode === 'RED' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RED TEAM
            </button>
            <button
              onClick={() => setTeamMode('BLUE')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                teamMode === 'BLUE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BLUE TEAM
            </button>
            <button
              onClick={() => setTeamMode('PURPLE')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                teamMode === 'PURPLE' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PURPLE
            </button>
          </div>

          {/* Seed Input & Replay Controls */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-slate-500 text-[10px] pl-1 font-bold uppercase">SEED:</span>
            <input
              type="text"
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              className="w-16 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold text-center focus:outline-hidden focus:border-purple-500"
            />
            <button
              onClick={handleRandomSeed}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 transition-colors"
              title="Regenerate Random Seed"
            >
              <Dices className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowDebriefModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Debrief Report</span>
          </button>

          <button
            onClick={() => setIsAmanOpen(!isAmanOpen)}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AMAN 5.0</span>
          </button>
        </div>
      </header>

      {/* Latency Performance Benchmark Ribbon */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1.5 font-mono text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="text-purple-400 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-400" /> AMAN 5.0 TURBO LATENCY RIBBON:
          </span>
          <span>Router: <strong className="text-emerald-400">{latencyMetrics.routerLatencyMs}ms</strong></span>
          <span>Tool Exec: <strong className="text-emerald-400">{latencyMetrics.toolLatencyMs}ms</strong></span>
          <span>Context Assembly: <strong className="text-emerald-400">{latencyMetrics.contextLatencyMs}ms</strong></span>
          <span>Gemini TTFT: <strong className="text-cyan-400">{latencyMetrics.geminiTtftMs}ms</strong></span>
          <span>Total Pipeline: <strong className="text-purple-300 font-bold">{latencyMetrics.totalResponseMs}ms</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500">Score: <strong className="text-emerald-400">{incidentState.score.totalScore}/100</strong> ({incidentState.score.grade})</span>
          <span className="text-slate-500">Evidence Count: <strong className="text-cyan-400">{incidentState.collectedEvidence.length}</strong></span>
        </div>
      </div>

      {/* 2. MAIN MULTI-PANE WORKSPACE CONTENT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* PANE 1: TARGET RANGE NETWORK MAP & HOST INSPECTOR (Cols 3) */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-slate-950 p-4 space-y-4 overflow-y-auto custom-scrollbar flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Interactive Target Topology</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono">
                {selectedRange.category}
              </span>
            </div>

            {/* Topology Flow Graph */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider pb-1">Target Topology Graph</div>
              
              <div className="relative space-y-2.5">
                {incidentState.targetGraphNodes.map((node, index) => {
                  const isWebCompromised = incidentState.targetGraphNodes.find(n => n.id === 'web')?.status === 'COMPROMISED';
                  const isDbCompromised = incidentState.targetGraphNodes.find(n => n.id === 'db')?.status === 'COMPROMISED';
                  
                  // Handle dependency visibility in range
                  let isAccessible = true;
                  if (node.id === 'db' && !isWebCompromised && node.status === 'UNKNOWN') isAccessible = false;
                  if (node.id === 'auth' && !isWebCompromised && node.status === 'UNKNOWN') isAccessible = false;
                  if (node.id === 'dc' && !isDbCompromised && node.status === 'UNKNOWN') isAccessible = false;

                  const cardStyle = 
                    node.status === 'COMPROMISED' ? 'bg-red-950/60 border-red-500/50 hover:border-red-500 text-red-100' :
                    node.status === 'MITIGATED' ? 'bg-emerald-950/60 border-emerald-500/50 hover:border-emerald-500 text-emerald-100' :
                    node.status === 'ENUMERATED' ? 'bg-cyan-950/60 border-cyan-500/50 hover:border-cyan-500 text-cyan-100' :
                    node.status === 'DISCOVERED' ? 'bg-slate-900 border-slate-700 hover:border-purple-500 text-slate-200' :
                    'bg-slate-950/40 border-slate-900/80 text-slate-600 opacity-50 cursor-not-allowed';

                  const badgeStyle = 
                    node.status === 'COMPROMISED' ? 'bg-red-900/50 text-red-300 border border-red-500/30' :
                    node.status === 'MITIGATED' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' :
                    node.status === 'ENUMERATED' ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/30' :
                    node.status === 'DISCOVERED' ? 'bg-slate-800 text-slate-400' :
                    'bg-slate-900 text-slate-600';

                  return (
                    <div key={node.id} className="relative">
                      {/* Visual Line connector */}
                      {index > 0 && (
                        <div className="absolute -top-3 left-6 w-0.5 h-3 bg-slate-800" />
                      )}

                      <div 
                        onClick={() => handleNodeClick(node)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer font-mono text-xs ${cardStyle}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded bg-slate-950/80 border border-slate-800">
                              {node.id === 'web' && <Globe className="w-3.5 h-3.5 text-cyan-400" />}
                              {node.id === 'db' && <Cpu className="w-3.5 h-3.5 text-yellow-400" />}
                              {node.id === 'auth' && <Lock className="w-3.5 h-3.5 text-purple-400" />}
                              {node.id === 'dc' && <Shield className="w-3.5 h-3.5 text-red-400" />}
                            </div>
                            <div>
                              <div className="font-bold text-[11px] flex items-center gap-1.5">
                                <span>{node.label}</span>
                                {node.status === 'COMPROMISED' && <span className="animate-ping w-1.5 h-1.5 rounded-full bg-red-400" />}
                              </div>
                              <div className="text-[9px] text-slate-400">{node.ip || '10.10.20.' + (node.id === 'web' ? '10' : node.id === 'db' ? '20' : '50')}</div>
                            </div>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${badgeStyle}`}>
                            {node.status}
                          </span>
                        </div>
                        {node.status !== 'UNKNOWN' && (
                          <div className="mt-1.5 pt-1.5 border-t border-slate-800/40 text-[9px] text-slate-400 flex items-center justify-between">
                            <span>OS: {node.id === 'web' || node.id === 'db' ? 'Linux Ubuntu' : 'Windows Server'}</span>
                            <span className="text-purple-400 font-bold hover:underline">Click to target</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Persistent Investigation Notebook Section */}
          <div className="border-t border-slate-800/80 pt-4 mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-purple-400" /> Investigation Notebook
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                AUTO-SAVING
              </span>
            </div>

            {/* Notebook Tab Selector */}
            <div className="grid grid-cols-4 gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              {(['facts', 'hypotheses', 'intel', 'evidence'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setNotebookTab(tab)}
                  className={`py-1 text-[9px] font-mono font-bold uppercase rounded transition-all ${
                    notebookTab === tab ? 'bg-purple-950 text-purple-300 border border-purple-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Notebook Content Box */}
            <div className="font-mono text-xs">
              {notebookTab === 'facts' && (
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-400">Log known facts, IP subnet limits, and clues:</span>
                  <textarea
                    value={incidentState.notebook?.knownFacts || ''}
                    onChange={(e) => handleNotebookChange('knownFacts', e.target.value)}
                    placeholder="Enter range scope, subnets, and active intelligence..."
                    className="w-full h-32 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-hidden focus:border-purple-500 resize-none font-mono"
                  />
                </div>
              )}
              {notebookTab === 'hypotheses' && (
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-400">Log analytical reasoning, assumptions:</span>
                  <textarea
                    value={incidentState.notebook?.hypotheses || ''}
                    onChange={(e) => handleNotebookChange('hypotheses', e.target.value)}
                    placeholder="Document suspected vulnerabilities and threat models..."
                    className="w-full h-32 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-hidden focus:border-purple-500 resize-none font-mono"
                  />
                </div>
              )}
              {notebookTab === 'intel' && (
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-400">Document extracted credentials, hash values:</span>
                  <textarea
                    value={incidentState.notebook?.discoveredIntel || ''}
                    onChange={(e) => handleNotebookChange('discoveredIntel', e.target.value)}
                    placeholder="Save usernames, encrypted db hashes, SUID findings..."
                    className="w-full h-32 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-hidden focus:border-purple-500 resize-none font-mono"
                  />
                </div>
              )}
              {notebookTab === 'evidence' && (
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-400">Chronological chain-of-custody log:</span>
                  <textarea
                    value={incidentState.notebook?.evidenceNotes || ''}
                    onChange={(e) => handleNotebookChange('evidenceNotes', e.target.value)}
                    placeholder="Draft chronological timeline of actions and evidence hashes..."
                    className="w-full h-32 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-hidden focus:border-purple-500 resize-none font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PANE 2: SIMULATED TERMINAL CLI & ATTACK RECONSTRUCTION ENGINE (Cols 5) */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-slate-950 flex flex-col overflow-hidden">
          {/* Terminal Header */}
          <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300">
              <TerminalIcon className="w-4 h-4 text-emerald-400" />
              <span>Stateful Kali Terminal CLI</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Interactive Execution Engine</span>
          </div>

          {/* Dual-Gauge Dashboard: OpSec Noise, Mistakes and Mentor Controls */}
          <div className="bg-slate-900 border-b border-slate-800 p-3 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              {/* Noise Level */}
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3 text-red-400" /> OpSec Noise Meter
                  </span>
                  <span className={`text-[10px] font-bold ${
                    (incidentState.noiseMeter || 10) > 70 ? 'text-red-400 animate-pulse' :
                    (incidentState.noiseMeter || 10) > 30 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {(incidentState.noiseMeter || 10)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      (incidentState.noiseMeter || 10) > 70 ? 'bg-red-500' :
                      (incidentState.noiseMeter || 10) > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(incidentState.noiseMeter || 10)}%` }}
                  />
                </div>
                <div className="text-[9px] text-slate-500">
                  {(incidentState.noiseMeter || 10) > 70 ? '⚠️ HIGH NOISE! SIEM TRIGGERED' : 'STEALTH: Low forensic noise.'}
                </div>
              </div>

              {/* Mistakes Counter */}
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" /> Mistakes Counter
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold font-mono">
                    {incidentState.mistakeCount || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, incidentState.mistakeCount || 0) }).map((_, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  ))}
                  {(incidentState.mistakeCount || 0) === 0 && (
                    <span className="text-[9px] text-emerald-400 font-bold">Perfect Score</span>
                  )}
                  {(incidentState.mistakeCount || 0) > 5 && (
                    <span className="text-[9px] text-red-400 font-bold">{(incidentState.mistakeCount || 0)} errors</span>
                  )}
                </div>
                <div className="text-[9px] text-slate-500">
                  {(incidentState.mistakeCount || 0) > 3 ? 'Check "help" syntax helper.' : 'Tutor monitoring command stream.'}
                </div>
              </div>
            </div>

            {/* Mentor Mode Controls */}
            <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Socratic Mentor:</span>
              <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-md border border-slate-800">
                {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      const updated = { ...incidentState, mentorLevel: lvl };
                      setIncidentState(updated);
                      IncidentStateEngine.saveState(updated);
                      setTerminalLogs(prev => [
                        ...prev,
                        { text: `[SYSTEM] AMAN Socratic mentor adjusted to: ${lvl}. Command stream & guides optimized.`, type: 'system' }
                      ]);
                    }}
                    className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase transition-all ${
                      incidentState.mentorLevel === lvl ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs space-y-1.5 overflow-y-auto custom-scrollbar">
            {terminalLogs.map((log, idx) => (
              <div
                key={idx}
                className={`leading-relaxed whitespace-pre-wrap ${
                  log.type === 'cmd' ? 'text-cyan-300 font-bold' :
                  log.type === 'err' ? 'text-red-400' :
                  log.type === 'system' ? 'text-purple-300 font-semibold' :
                  'text-emerald-400/90'
                }`}
              >
                {log.text}
              </div>
            ))}
          </div>

          {/* Terminal Command Input Form */}
          <form onSubmit={handleTerminalSubmit} className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-xs font-bold">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Type CLI command (e.g. nmap 10.10.20.10, curl, sqlmap, whoami, help)..."
              className="flex-1 bg-transparent font-mono text-xs text-slate-200 focus:outline-hidden placeholder-slate-600"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold"
            >
              Exec
            </button>
          </form>
        </div>

        {/* PANE 3: ATTACKER THINKING ENGINE ("THINK LIKE AN ETHICAL HACKER") & DECISION ENGINE (Cols 4) */}
        <div className="lg:col-span-4 bg-slate-950 p-4 overflow-y-auto custom-scrollbar space-y-4">
          {/* Attacker Decision Engine ("What do you do next?") */}
          <AttackerDecisionEngine
            state={incidentState}
            onDecisionChosen={handleDecisionChosen}
          />

          <ThinkLikeAnEthicalHackerEngine
            scenarioTitle={currentScenario.title}
            targetScope={selectedRange.assets.map(a => a.ip)}
            incidentState={incidentState}
            onStateUpdated={setIncidentState}
          />
        </div>
      </div>

      {/* Blue / Purple Team Workspace View when active */}
      {(teamMode === 'BLUE' || teamMode === 'PURPLE') && (
        <div className="border-t border-slate-800 bg-slate-950 p-4">
          <BluePurpleTeamPanel
            state={incidentState}
            onStateUpdated={setIncidentState}
          />
        </div>
      )}

      {/* Action Failure / Learning Modal */}
      {incidentState.lastFailureInfo && (
        <ActionFailureModal
          failureInfo={incidentState.lastFailureInfo}
          onClose={() => {
            const cleared = clearLastFailureInfo(incidentState);
            setIncidentState(cleared);
          }}
        />
      )}

      {/* Post-Incident Debrief Modal */}
      {showDebriefModal && (
        <PostIncidentDebriefModal
          state={incidentState}
          onClose={() => setShowDebriefModal(false)}
        />
      )}

      {/* 3. BOTTOM COLLAPSIBLE DRAWER TABS */}
      <div className="border-t border-slate-800 bg-slate-900">
        <div className="flex flex-wrap items-center border-b border-slate-800 bg-slate-950 px-4">
          <button
            onClick={() => setActiveBottomTab('siem')}
            className={`px-4 py-2 font-mono text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeBottomTab === 'siem' ? 'border-cyan-500 text-cyan-300 bg-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>SIEM Logs & Telemetry</span>
          </button>
          <button
            onClick={() => setActiveBottomTab('evidence')}
            className={`px-4 py-2 font-mono text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeBottomTab === 'evidence' ? 'border-purple-500 text-purple-300 bg-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Evidence Locker ({incidentState.collectedEvidence.length})</span>
          </button>
          <button
            onClick={() => setActiveBottomTab('retest')}
            className={`px-4 py-2 font-mono text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeBottomTab === 'retest' ? 'border-emerald-500 text-emerald-300 bg-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Defensive Retest Engine</span>
          </button>
          <button
            onClick={() => setActiveBottomTab('skills')}
            className={`px-4 py-2 font-mono text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeBottomTab === 'skills' ? 'border-amber-500 text-amber-300 bg-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Skill Graph & Roadmap</span>
          </button>
          <button
            onClick={() => setActiveBottomTab('report')}
            className={`px-4 py-2 font-mono text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeBottomTab === 'report' ? 'border-purple-400 text-purple-300 bg-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Executive Report Compiler</span>
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
          {activeBottomTab === 'siem' && (
            <div className="space-y-2 font-mono text-xs">
              {selectedRange.simulatedLogs.map((log, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <strong className="text-slate-200">{log.source}</strong>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                        log.severity === 'CRITICAL' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {log.severity}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{log.message}</p>
                  </div>
                  {log.mitreTechnique && (
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                      {log.mitreTechnique}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeBottomTab === 'evidence' && (
            <div className="space-y-3 font-mono text-xs">
              {incidentState.collectedEvidence.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No evidence findings logged yet. Execute commands or hypotheses to collect evidence.</p>
              ) : (
                incidentState.collectedEvidence.map((ev) => (
                  <div key={ev.id} className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1">
                    <div className="flex justify-between text-purple-300 font-bold">
                      <span>{ev.title} [{ev.type}]</span>
                      <span className="text-slate-500 text-[10px]">SHA-256: {ev.sha256}</span>
                    </div>
                    <div className="text-slate-300 text-[11px] whitespace-pre-wrap">{ev.rawContent}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeBottomTab === 'retest' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Defensive Retest Status</h4>
                  <p className="text-slate-400 text-[11px]">Verify if defensive rules successfully block the attack chain.</p>
                </div>
                <button
                  onClick={() => {
                    const res = IncidentStateEngine.runRetest(incidentState, 'WAF Parameter Sanitization & SUID Privileges Revocation');
                    setIncidentState(res);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
                >
                  Run Defensive Retest
                </button>
              </div>

              {incidentState.retestResults && (
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-emerald-400 font-bold">RETEST RESULT: {incidentState.retestResults.isMitigated ? 'SUCCESSFULLY MITIGATED' : 'ACTION REQUIRED'}</div>
                  <p className="text-slate-300 text-[11px]">{incidentState.retestResults.afterStatus}</p>
                </div>
              )}
            </div>
          )}

          {activeBottomTab === 'skills' && (
            <CybersecuritySkillGraph />
          )}

          {activeBottomTab === 'report' && (
            <ExecutiveReportGenerator state={incidentState} />
          )}
        </div>
      </div>

      {/* AMAN 5.0 Platform Copilot Drawer */}
      <AskAmanDrawer isOpen={isAmanOpen} onClose={() => setIsAmanOpen(false)} />
    </div>
  );
};
