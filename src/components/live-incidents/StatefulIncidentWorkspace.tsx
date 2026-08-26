import React, { useState, useEffect } from 'react';
import {
  IncidentState,
  loadIncidentState,
  saveIncidentState,
  resetIncidentWithSeed,
  executeSimulatedCommand,
  submitSocraticHypothesis,
  captureEvidence,
  toggleDefensiveControl,
  performRetest,
  submitFinalReport,
  CollectedEvidenceState,
  TriggeredAlertState,
  DefensiveControlState,
  RetestResultState
} from '../../utils/incidentStateEngine';
import { LIVE_INCIDENT_SCENARIOS } from '../../data/liveIncidentsData';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
  Search,
  BookOpen,
  FolderGit2,
  Brain,
  ArrowRight,
  Zap,
  Layers,
  ShieldCheck,
  FileCheck2,
  Cpu,
  RefreshCw,
  Clock,
  ExternalLink,
  Award,
  Hash,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileText,
  Play
} from 'lucide-react';

interface StatefulIncidentWorkspaceProps {
  incidentId: string;
}

export const StatefulIncidentWorkspace: React.FC<StatefulIncidentWorkspaceProps> = ({ incidentId }) => {
  const { addXp, addNotebookNote } = useApp();
  const [state, setState] = useState<IncidentState>(() => loadIncidentState(incidentId));
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; out: string; time: string }>>([]);

  // Hypothesis Form state
  const [hypothesisText, setHypothesisText] = useState<string>('');
  const [reasoningText, setReasoningText] = useState<string>('');
  const [expectedResultText, setExpectedResultText] = useState<string>('');
  const [planText, setPlanText] = useState<string>('');

  // Evidence Capture Modal
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [evidenceTitle, setEvidenceTitle] = useState<string>('');
  const [evidenceType, setEvidenceType] = useState<string>('COMMAND_OUTPUT');
  const [evidenceContent, setEvidenceContent] = useState<string>('');
  const [evidenceMitre, setEvidenceMitre] = useState<string>('T1190');
  const [evidenceNote, setEvidenceNote] = useState<string>('');

  // Active View Tab inside workspace
  const [workspaceTab, setWorkspaceTab] = useState<'terminal' | 'hypothesis' | 'siem' | 'controls' | 'retest' | 'score' | 'timeline'>('terminal');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportNotes, setReportNotes] = useState<string>('');

  const scenario = LIVE_INCIDENT_SCENARIOS.find(s => s.id === incidentId) || LIVE_INCIDENT_SCENARIOS[0];

  // Reload state if incidentId changes
  useEffect(() => {
    const loaded = loadIncidentState(incidentId);
    setState(loaded);
    setTerminalHistory([]);
  }, [incidentId]);

  // Command Execution Handler
  const handleRunCommand = (cmdToRun?: string) => {
    const command = cmdToRun || terminalInput;
    if (!command.trim()) return;

    const res = executeSimulatedCommand(state, command);
    setState({ ...res.updatedState });
    setTerminalHistory(prev => [
      ...prev,
      { cmd: command, out: res.output, time: new Date().toTimeString().split(' ')[0] }
    ]);
    setTerminalInput('');
  };

  // Preset Branching Path Actions
  const handleBranchingAction = (actionName: string, command: string) => {
    handleRunCommand(command);
  };

  // Replay Handler
  const handleReplay = () => {
    if (window.confirm('Start a new deterministic replay with fresh seed? (IPs, hostnames, logs, and flags will be randomized while preserving objectives).')) {
      const newState = resetIncidentWithSeed(incidentId);
      setState(newState);
      setTerminalHistory([]);
    }
  };

  // Submit Hypothesis
  const handleSubmitHypothesisForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypothesisText.trim()) return;

    const res = submitSocraticHypothesis(state, {
      hypothesis: hypothesisText,
      reasoning: reasoningText,
      expectedResult: expectedResultText,
      investigationPlan: planText
    });

    setState({ ...res.updatedState });
    setHypothesisText('');
    setReasoningText('');
    setExpectedResultText('');
    setPlanText('');
    alert(`Hypothesis Evaluated! Quality Score: ${res.hypothesisRecord.score}% (${res.hypothesisRecord.qualityBadge})`);
  };

  // Capture Evidence Submission
  const handleSaveEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceContent.trim()) return;

    const res = captureEvidence(state, {
      title: evidenceTitle,
      type: evidenceType,
      rawContent: evidenceContent,
      mitreTechnique: evidenceMitre,
      analystNote: evidenceNote
    });

    setState({ ...res.updatedState });
    setShowEvidenceModal(false);
    setEvidenceTitle('');
    setEvidenceContent('');
    setEvidenceNote('');

    addNotebookNote({
      title: `[INCIDENT EVIDENCE] ${res.evidence.title}`,
      content: `Type: ${res.evidence.type}\nMITRE: ${res.evidence.mitreTechnique}\nSHA-256: ${res.evidence.sha256}\n\nContent:\n${res.evidence.rawContent}\n\nAnalyst Note:\n${res.evidence.analystNote}`,
      tags: ['evidence', 'live-incident', scenario.code]
    });

    alert(`Evidence locked in Evidence Locker with SHA-256: ${res.evidence.sha256.substring(0, 16)}...`);
  };

  // Toggle Blue Team Control
  const handleToggleControl = (controlId: string) => {
    const res = toggleDefensiveControl(state, controlId);
    setState({ ...res.updatedState });
  };

  // Run Retest Engine
  const handlePerformRetest = () => {
    const res = performRetest(state);
    setState({ ...res.updatedState });
    setWorkspaceTab('retest');
  };

  // Final Report Submission
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitFinalReport(state, reportNotes);
    setState({ ...res.updatedState });
    setShowReportModal(false);
    addXp(350);
    alert(`Incident Investigation Report Submitted! Grade: ${res.finalScore.grade} (${res.finalScore.totalScore}/100 pts)`);
  };

  return (
    <div className="space-y-6">
      {/* Stateful Header & Mode Switcher */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 animate-pulse" />
                STATEFUL RECONSTRUCTION ENGINE
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 text-[10px] font-mono">
                SEED: #{state.seed}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                STAGE {state.currentStage} / 5
              </span>
            </div>
            <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <span>{scenario.code}:</span>
              <span className="text-red-400">{scenario.title}</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Team Toggle */}
            <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => {
                  const newState = { ...state, activeTeam: 'RED' as const };
                  setState(newState);
                  saveIncidentState(newState);
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                  state.activeTeam === 'RED'
                    ? 'bg-red-950 text-red-300 border border-red-500/50 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>RED TEAM</span>
              </button>
              <button
                onClick={() => {
                  const newState = { ...state, activeTeam: 'BLUE' as const };
                  setState(newState);
                  saveIncidentState(newState);
                  setWorkspaceTab('siem');
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                  state.activeTeam === 'BLUE'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>BLUE TEAM</span>
              </button>
            </div>

            {/* Replay Button */}
            <button
              onClick={handleReplay}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
              title="Generate new seed and randomize target parameters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Replay Seed</span>
            </button>

            {/* Final Report Trigger */}
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Complete & Submit Report</span>
            </button>
          </div>
        </div>

        {/* Dynamic Target Asset Status Ribbon */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>REACTIVE TARGET ENVIRONMENT MATRIX</span>
            <span className="text-emerald-400 font-bold">
              Remediation Status: {state.remediationStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {state.discoveredAssets.map((asset, idx) => {
              let badgeColor = 'bg-slate-950 text-slate-500 border-slate-800';
              if (asset.status === 'DISCOVERED') badgeColor = 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
              if (asset.status === 'ENUMERATED') badgeColor = 'bg-purple-950 text-purple-300 border-purple-500/40';
              if (asset.status === 'COMPROMISED') badgeColor = 'bg-red-950 text-red-400 border-red-500/50 animate-pulse';
              if (asset.status === 'MITIGATED') badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';

              return (
                <div key={idx} className={`p-3 rounded-xl border space-y-1 ${badgeColor}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{asset.host}</span>
                    <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/40">
                      {asset.status}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] opacity-80">{asset.ip}</div>
                  <div className="text-[10px] opacity-70 truncate">{asset.role}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Workspace Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setWorkspaceTab('terminal')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
            workspaceTab === 'terminal' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-red-400" />
          <span>Simulated Terminal</span>
        </button>

        <button
          onClick={() => setWorkspaceTab('hypothesis')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
            workspaceTab === 'hypothesis' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-amber-400" />
          <span>Socratic Hypotheses ({state.hypotheses.length})</span>
        </button>

        <button
          onClick={() => setWorkspaceTab('siem')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
            workspaceTab === 'siem' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Blue Team SIEM Alerts ({state.triggeredAlerts.length})</span>
        </button>

        <button
          onClick={() => setWorkspaceTab('controls')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
            workspaceTab === 'controls' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Defensive Controls</span>
        </button>

        <button
          onClick={() => setWorkspaceTab('retest')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
            workspaceTab === 'retest' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Retest Engine</span>
        </button>

        <button
          onClick={() => setWorkspaceTab('score')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
            workspaceTab === 'score' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Scorecard ({state.score.totalScore}/100 Grade: {state.score.grade})</span>
        </button>

        <button
          onClick={() => setWorkspaceTab('timeline')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
            workspaceTab === 'timeline' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Live Timeline ({state.timeline.length})</span>
        </button>
      </div>

      {/* Tab 1: Terminal View */}
      {workspaceTab === 'terminal' && (
        <div className="space-y-4">
          {/* Branching Quick Action Shortcuts */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>BRANCHING INVESTIGATION VECTORS</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBranchingAction('Recon Scan', `nmap -sV -p 80,22,5432 ${state.discoveredAssets[0]?.ip}`)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono text-cyan-300 transition-all"
              >
                1. Recon & Port Scan
              </button>
              <button
                onClick={() => handleBranchingAction('HTTP Headers', `curl -I http://${state.discoveredAssets[0]?.ip}/api/v1/customer`)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-xs font-mono text-emerald-300 transition-all"
              >
                2. Header Fingerprinting
              </button>
              <button
                onClick={() => handleBranchingAction('Dir Fuzzing', `gobuster dir -u http://${state.discoveredAssets[0]?.ip}/ -w /wordlists/common.txt`)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-xs font-mono text-amber-300 transition-all"
              >
                3. Directory Discovery
              </button>
              <button
                onClick={() => handleBranchingAction('SQLi Payload', `curl -X GET "http://${state.discoveredAssets[0]?.ip}/api/v1/customer?id=101' UNION SELECT null,flag FROM flags--"`)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-red-500/50 text-xs font-mono text-red-300 transition-all"
              >
                4. Exploit PoC Payload
              </button>
              <button
                onClick={() => handleBranchingAction('PrivEsc Check', `find / -perm -4000 2>/dev/null`)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-xs font-mono text-purple-300 transition-all"
              >
                5. Audit SUID PrivEsc
              </button>
            </div>
          </div>

          {/* Terminal Console */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <Terminal className="w-4 h-4" />
                <span>range-investigator@kali:~/incidents/{scenario.code.toLowerCase()}</span>
              </div>
              <button
                onClick={() => {
                  setEvidenceContent(terminalHistory.map(h => `$ ${h.cmd}\n${h.out}`).join('\n\n'));
                  setEvidenceTitle(`Terminal Capture - ${scenario.code}`);
                  setShowEvidenceModal(true);
                }}
                className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] hover:bg-purple-900 transition-all flex items-center gap-1"
              >
                <FolderGit2 className="w-3 h-3" />
                <span>Capture Terminal to Locker</span>
              </button>
            </div>

            <div className="p-4 h-[340px] overflow-y-auto font-mono text-xs text-slate-200 space-y-4 custom-scrollbar">
              <div className="text-slate-500">
                Type commands (e.g., `nmap`, `curl`, `gobuster`, `python3`, `find`, `whoami`, `grep`) or click quick action buttons above.
              </div>

              {terminalHistory.map((h, i) => (
                <div key={i} className="space-y-1 border-b border-slate-900 pb-3">
                  <div className="text-emerald-400 flex items-center gap-2 font-bold">
                    <span className="text-slate-500 text-[10px]">[{h.time}]</span>
                    <span>$ {h.cmd}</span>
                  </div>
                  <pre className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap pl-4 font-mono">
                    {h.out}
                  </pre>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleRunCommand();
              }}
              className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-3"
            >
              <span className="text-emerald-400 font-mono text-xs font-bold shrink-0">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="Enter command (e.g. nmap, curl -I /api/v1/customer, find / -perm -4000)..."
                className="flex-1 bg-transparent text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shrink-0"
              >
                Execute
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Socratic Hypothesis Engine */}
      {workspaceTab === 'hypothesis' && (
        <div className="space-y-6">
          <form onSubmit={handleSubmitHypothesisForm} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-amber-400 font-mono text-sm font-bold">
              <Brain className="w-4 h-4" />
              <span>SUBMIT SOCRATIC HYPOTHESIS & INVESTIGATION PLAN</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">1. Technical Hypothesis</label>
                <textarea
                  value={hypothesisText}
                  onChange={e => setHypothesisText(e.target.value)}
                  placeholder="e.g. Unsanitized GET parameters on /api/v1/customer allow SQL injection..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-amber-500/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">2. Technical Reasoning</label>
                <textarea
                  value={reasoningText}
                  onChange={e => setReasoningText(e.target.value)}
                  placeholder="e.g. The web log telemetry shows single quote probes returning HTTP 200 with anomalous byte size..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-amber-500/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">3. Expected Result</label>
                <textarea
                  value={expectedResultText}
                  onChange={e => setExpectedResultText(e.target.value)}
                  placeholder="e.g. Executing UNION SELECT will return database table rows and proof flag..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-amber-500/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">4. Investigation Plan</label>
                <textarea
                  value={planText}
                  onChange={e => setPlanText(e.target.value)}
                  placeholder="e.g. 1. Craft curl request. 2. Verify payload. 3. Log evidence SHA-256..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-amber-500/50 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              <span>Evaluate Socratic Hypothesis</span>
            </button>
          </form>

          {/* Past Hypotheses List */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">PREVIOUS HYPOTHESIS EVALUATIONS</h4>
            {state.hypotheses.map(hyp => (
              <div key={hyp.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Score: {hyp.score}% — {hyp.qualityBadge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{hyp.timestamp}</span>
                </div>
                <div className="text-xs font-mono text-slate-200">
                  <strong>Hypothesis:</strong> {hyp.hypothesis}
                </div>
                <div className="text-xs font-mono text-slate-300">
                  <strong>Reasoning:</strong> {hyp.reasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Blue Team SIEM Alerts */}
      {workspaceTab === 'siem' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-between">
            <span>BLUE TEAM TELEMETRY & SIEM ALERT FEED</span>
            <span className="font-bold">{state.triggeredAlerts.length} Total Alerts Logged</span>
          </div>

          <div className="space-y-3">
            {state.triggeredAlerts.map(alertItem => {
              let sevColor = 'border-slate-800 bg-slate-900/90 text-slate-300';
              if (alertItem.severity === 'MEDIUM') sevColor = 'border-amber-500/40 bg-amber-950/20 text-amber-300';
              if (alertItem.severity === 'HIGH') sevColor = 'border-red-500/50 bg-red-950/30 text-red-300';
              if (alertItem.severity === 'CRITICAL') sevColor = 'border-purple-500/50 bg-purple-950/40 text-purple-300 animate-pulse';

              return (
                <div key={alertItem.id} className={`p-4 rounded-xl border space-y-2 ${sevColor}`}>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold uppercase tracking-wider">[{alertItem.severity}] {alertItem.title}</span>
                    <span className="text-[10px] opacity-70">{alertItem.timestamp}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">{alertItem.description}</div>
                  <div className="text-[10px] font-mono opacity-60">Source Node: {alertItem.source}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Defensive Controls */}
      {workspaceTab === 'controls' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                DEFENSIVE REMEDIATION & HARDENING CONTROLS
              </span>
              <span className="text-xs font-mono text-slate-400">
                Remediation Status: <strong className="text-emerald-300">{state.remediationStatus}</strong>
              </span>
            </div>

            <div className="space-y-3">
              {Object.values(state.defensiveControls).map(ctrl => (
                <div key={ctrl.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-mono font-bold text-slate-100">{ctrl.name}</h5>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-mono">
                        {ctrl.ruleType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans">{ctrl.description}</p>
                  </div>

                  <button
                    onClick={() => handleToggleControl(ctrl.id)}
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
                      ctrl.applied
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {ctrl.applied ? '✓ RULE DEPLOYED' : 'ENFORCE RULE'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Retest Engine */}
      {workspaceTab === 'retest' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                  RED TEAM AUTOMATED RETEST ENGINE
                </span>
                <p className="text-xs text-slate-400 font-sans">
                  Tests the original attack vector before and after applying defensive hardening rules to verify mitigation.
                </p>
              </div>

              <button
                onClick={handlePerformRetest}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2 shrink-0"
              >
                <Zap className="w-4 h-4" />
                <span>Execute Retest Suite</span>
              </button>
            </div>

            {state.retestResults && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Before Remediation */}
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/40 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs border-b border-red-500/30 pb-2">
                    <span className="font-bold text-red-400">BEFORE REMEDIATION</span>
                    <span className="text-red-300 font-bold">❌ Vulnerable</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">{state.retestResults.beforeStatus}</div>
                  <pre className="p-3 rounded-lg bg-slate-950 text-[10px] font-mono text-red-300 overflow-x-auto leading-relaxed">
                    {state.retestResults.outputBefore}
                  </pre>
                </div>

                {/* After Remediation */}
                <div className={`p-4 rounded-xl border space-y-3 ${
                  state.retestResults.isMitigated ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-red-950/20 border-red-500/40'
                }`}>
                  <div className="flex items-center justify-between font-mono text-xs border-b pb-2 border-slate-800">
                    <span className={`font-bold ${state.retestResults.isMitigated ? 'text-emerald-400' : 'text-red-400'}`}>
                      AFTER REMEDIATION
                    </span>
                    <span className={`font-bold ${state.retestResults.isMitigated ? 'text-emerald-300' : 'text-red-300'}`}>
                      {state.retestResults.isMitigated ? '✅ Mitigated' : '❌ Unprotected'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">{state.retestResults.afterStatus}</div>
                  <pre className="p-3 rounded-lg bg-slate-950 text-[10px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                    {state.retestResults.outputAfter}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: 10-Category Scorecard */}
      {workspaceTab === 'score' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase">INCIDENT SCORECARD</span>
                <h3 className="text-2xl font-bold font-mono text-slate-100 flex items-center gap-3">
                  <span>Grade:</span>
                  <span className={`px-3 py-1 rounded-xl font-mono ${
                    state.score.grade === 'S' ? 'bg-amber-950 text-amber-300 border border-amber-500/50' :
                    state.score.grade === 'A' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' :
                    'bg-slate-800 text-slate-200'
                  }`}>
                    {state.score.grade}
                  </span>
                  <span className="text-emerald-400">{state.score.totalScore} / 100 PTS</span>
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.score.breakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-slate-200">{item.category}</span>
                    <span className="text-emerald-400 font-bold">{item.points} / {item.maxPoints} pts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Timeline View */}
      {workspaceTab === 'timeline' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>REAL-TIME INCIDENT CHRONOLOGICAL TIMELINE</span>
            <span className="text-slate-400">{state.timeline.length} Events Logged</span>
          </div>

          <div className="space-y-3">
            {state.timeline.map((event, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <span className="px-2 py-1 rounded bg-slate-950 text-slate-400 font-mono text-[10px] font-bold shrink-0">
                  {event.timestamp}
                </span>
                <div className="space-y-1">
                  <h5 className="text-xs font-mono font-bold text-slate-100">{event.title}</h5>
                  <p className="text-xs text-slate-400 font-sans">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Evidence Capture */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-mono text-purple-400 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" />
                <span>CAPTURE EVIDENCE TO LOCKER</span>
              </h3>
              <button onClick={() => setShowEvidenceModal(false)} className="text-slate-400 hover:text-white font-mono text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvidence} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-300 font-bold">Evidence Title</label>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={e => setEvidenceTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold">MITRE Technique</label>
                <input
                  type="text"
                  value={evidenceMitre}
                  onChange={e => setEvidenceMitre(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold">Raw Content / Output</label>
                <textarea
                  value={evidenceContent}
                  onChange={e => setEvidenceContent(e.target.value)}
                  rows={4}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold">Analyst Note</label>
                <input
                  type="text"
                  value={evidenceNote}
                  onChange={e => setEvidenceNote(e.target.value)}
                  placeholder="e.g., Output demonstrates unauthenticated data exfiltration payload..."
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold"
                >
                  Lock Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Final Report Submission */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4" />
                <span>EXECUTIVE INCIDENT REPORT SUBMISSION</span>
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white font-mono text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs font-mono">
              <p className="text-slate-300 leading-relaxed font-sans">
                Review complete incident checklist: Hypothesis, Evidence, Retest verification, and Defensive controls. Enter final technical notes to submit your investigation.
              </p>

              <div>
                <label className="text-slate-300 font-bold">Executive Summary & Technical Recommendations</label>
                <textarea
                  value={reportNotes}
                  onChange={e => setReportNotes(e.target.value)}
                  rows={4}
                  placeholder="e.g. Identified SQL injection on customer endpoint, verified root SUID escalation, deployed WAF parameterized filter, confirmed mitigation via retest..."
                  className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-sans focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold shadow-lg"
                >
                  Submit Executive Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
