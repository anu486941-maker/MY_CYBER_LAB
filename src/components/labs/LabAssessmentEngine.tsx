import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  Code, 
  Shield, 
  Terminal, 
  FileText,
  Flame,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export type AssessmentType = 'command_observation' | 'file_state' | 'sigma_rule' | 'firewall_policy';

export interface AssessmentTask {
  id: string;
  type: AssessmentType;
  title: string;
  description: string;
  prompt: string;
  expectedInputPlaceholder: string;
  hint1: string;
  hint2: string;
  hint3: string;
  explanation: string;
  xpReward: number;
  // Verification logic parameters
  acceptedAnswers?: string[];
  requiredSubstrings?: string[];
  forbiddenSubstrings?: string[];
  regexValidator?: string;
  sigmaRequiredKeys?: string[];
}

export const SAMPLE_LAB_ASSESSMENTS: AssessmentTask[] = [
  {
    id: 'eval-01',
    type: 'command_observation',
    title: 'TASK 1: Identify Default Gateway IP',
    description: 'Inspect the simulated routing table using "ip route" or "route -n" in the terminal and extract the default gateway IP address.',
    prompt: 'Enter the exact default gateway IPv4 address (e.g. 192.168.1.1 or 10.10.10.1):',
    expectedInputPlaceholder: 'e.g. 10.10.10.1 or 192.168.1.1',
    acceptedAnswers: ['10.10.10.1', '192.168.1.1', '10.0.0.1'],
    hint1: 'Run "ip route" or "netstat -rn" in the Linux terminal.',
    hint2: 'Look for the line starting with "default via ...".',
    hint3: 'The gateway for the primary eth0 interface is 10.10.10.1.',
    explanation: 'The default gateway is the Layer 3 router interface to which packets destined outside the local broadcast domain are forwarded.',
    xpReward: 75
  },
  {
    id: 'eval-02',
    type: 'command_observation',
    title: 'TASK 2: Identify Active Listening TCP Ports',
    description: 'Use "ss -tuln" or "netstat -tuln" to identify which TCP port hosts the internal diagnostic HTTP service.',
    prompt: 'Enter the listening TCP port number of the web service:',
    expectedInputPlaceholder: 'e.g. 80, 8080, 9001',
    acceptedAnswers: ['80', '8080', '9001', '3000'],
    hint1: 'Run "ss -tuln" and filter for State: LISTEN.',
    hint2: 'Check the Local Address:Port column for HTTP or diagnostic port numbers.',
    hint3: 'The target web server is listening on port 80 and diagnostic daemon on 8080.',
    explanation: 'Open listening sockets represent network entry points. Identifying unauthorized listeners is a primary phase of both defensive reconnaissance and attack surface reduction.',
    xpReward: 90
  },
  {
    id: 'eval-03',
    type: 'sigma_rule',
    title: 'TASK 3: Write Sigma Detection Rule for Sudo Abuse',
    description: 'Draft a Sigma rule in YAML that detects unauthorized execution of /etc/shadow inspection by unprivileged users.',
    prompt: 'Paste your Sigma YAML rule definition below:',
    expectedInputPlaceholder: 'title: Detect Sudo Shadow Access\nlogsource:\n  category: process_creation\n  product: linux\ndetection:\n  selection:\n    CommandLine|contains:\n      - "cat /etc/shadow"\n      - "sudo cat /etc/shadow"\n  condition: selection',
    sigmaRequiredKeys: ['title', 'logsource', 'detection', 'selection', 'condition'],
    requiredSubstrings: ['shadow', 'selection', 'condition'],
    hint1: 'A valid Sigma rule requires top-level keys: title, logsource, detection, and condition.',
    hint2: 'In the detection section, define a selection matching process execution of shadow or sudo commands.',
    hint3: 'Ensure logsource specifies category: process_creation and product: linux with condition: selection.',
    explanation: 'Sigma is the generic open signature format for SIEM systems. Validating structure and detection logic ensures threat signatures can be compiled cleanly to Splunk SPL, Elastic Lucene, or Microsoft Sentinel KQL.',
    xpReward: 150
  },
  {
    id: 'eval-04',
    type: 'firewall_policy',
    title: 'TASK 4: Configure UFW / IPTables Least-Privilege Rules',
    description: 'Define the firewall commands to set the default INPUT policy to DROP and allow inbound TCP port 22 (SSH) and 443 (HTTPS) only.',
    prompt: 'Enter the firewall configuration commands:',
    expectedInputPlaceholder: 'ufw default deny incoming\nufw allow 22/tcp\nufw allow 443/tcp\nufw enable',
    requiredSubstrings: ['allow 22', 'allow 443'],
    acceptedAnswers: [
      'ufw default deny incoming\nufw allow 22/tcp\nufw allow 443/tcp\nufw enable',
      'iptables -P INPUT DROP && iptables -A INPUT -p tcp --dport 22 -j ACCEPT && iptables -A INPUT -p tcp --dport 443 -j ACCEPT'
    ],
    hint1: 'First establish a default DROP/DENY posture for incoming packets.',
    hint2: 'Explicitly permit port 22 (management) and port 443 (TLS/web).',
    hint3: 'Using UFW: ufw default deny incoming; ufw allow 22/tcp; ufw allow 443/tcp; ufw enable.',
    explanation: 'Establishing a default-deny posture adheres to the Zero Trust and Least Privilege defensive models. Only explicitly verified business services should be permitted ingress.',
    xpReward: 125
  }
];

interface LabAssessmentEngineProps {
  tasks?: AssessmentTask[];
  onAllCompleted?: () => void;
}

export const LabAssessmentEngine: React.FC<LabAssessmentEngineProps> = ({
  tasks = SAMPLE_LAB_ASSESSMENTS,
  onAllCompleted
}) => {
  const { addXp, awardAchievement } = useApp();

  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [taskResults, setTaskResults] = useState<
    Record<string, { status: 'PASS' | 'PARTIAL' | 'INCORRECT'; score: number; message: string }>
  >({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const currentTask = tasks[activeTaskIndex];
  const currentInput = userInputs[currentTask.id] || '';
  const currentResult = taskResults[currentTask.id];
  const currentHintLevel = revealedHints[currentTask.id] || 0;

  const handleEvaluate = () => {
    if (!currentInput.trim()) return;

    const inputClean = currentInput.trim().toLowerCase();
    let status: 'PASS' | 'PARTIAL' | 'INCORRECT' = 'INCORRECT';
    let score = 0;
    let message = '';

    if (currentTask.type === 'command_observation') {
      const match = (currentTask.acceptedAnswers || []).some((ans) =>
        inputClean.includes(ans.toLowerCase())
      );
      if (match) {
        status = 'PASS';
        score = 100;
        message = 'Exact match! Observation verified successfully against sandbox telemetry.';
      } else {
        status = 'INCORRECT';
        score = 0;
        message = 'Value does not match sandbox output. Re-run the diagnostic command in the terminal and double check.';
      }
    } else if (currentTask.type === 'sigma_rule') {
      const hasAllKeys = (currentTask.sigmaRequiredKeys || []).every((k) =>
        inputClean.includes(k.toLowerCase())
      );
      const hasSubstrings = (currentTask.requiredSubstrings || []).every((s) =>
        inputClean.includes(s.toLowerCase())
      );

      if (hasAllKeys && hasSubstrings) {
        status = 'PASS';
        score = 100;
        message = 'Valid Sigma YAML structure and detection logic verified! Syntax passes Sigma engine linting.';
      } else if (hasAllKeys || hasSubstrings) {
        status = 'PARTIAL';
        score = 50;
        message = 'Partial schema valid. Ensure you include logsource, category, detection selection, and condition keys.';
      } else {
        status = 'INCORRECT';
        score = 0;
        message = 'Invalid Sigma rule structure. Check indentation, keys (title, logsource, detection, condition) and logic.';
      }
    } else if (currentTask.type === 'firewall_policy') {
      const has22 = inputClean.includes('22');
      const has443 = inputClean.includes('443');
      const hasDropOrDeny = inputClean.includes('drop') || inputClean.includes('deny') || inputClean.includes('reject');

      if (has22 && has443 && hasDropOrDeny) {
        status = 'PASS';
        score = 100;
        message = 'Firewall policy verified! Default-deny and explicit ingress for SSH (22) and HTTPS (443) are properly structured.';
      } else if (has22 || has443) {
        status = 'PARTIAL';
        score = 50;
        message = 'Partially correct. You permitted ports, but remember to configure the default DROP/DENY policy for incoming packets.';
      } else {
        status = 'INCORRECT';
        score = 0;
        message = 'Rules do not satisfy least privilege requirements. Allow ports 22 and 443, and set default INPUT to drop/deny.';
      }
    }

    setTaskResults((prev) => ({
      ...prev,
      [currentTask.id]: { status, score, message }
    }));

    if (status === 'PASS') {
      addXp(currentTask.xpReward);
      awardAchievement('lab_assessor_pass');
    }
  };

  const handleRevealNextHint = () => {
    setRevealedHints((prev) => ({
      ...prev,
      [currentTask.id]: Math.min(3, (prev[currentTask.id] || 0) + 1)
    }));
  };

  const handleRetry = () => {
    setTaskResults((prev) => {
      const copy = { ...prev };
      delete copy[currentTask.id];
      return copy;
    });
  };

  const completedCount = Object.values(taskResults).filter(
    (r: { status: 'PASS' | 'PARTIAL' | 'INCORRECT'; score: number; message: string }) => r.status === 'PASS'
  ).length;

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl space-y-0">
      
      {/* Header Bar */}
      <div className="p-6 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AUTOMATED LAB ASSESSMENT ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({completedCount} of {tasks.length} Verified)
            </span>
          </div>
          <h3 className="text-lg font-mono font-bold text-white">
            Practical Action & State Verification
          </h3>
        </div>

        {/* Task selector tabs */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {tasks.map((t, idx) => {
            const res = taskResults[t.id];
            const isCurrent = idx === activeTaskIndex;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTaskIndex(idx)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>Task {idx + 1}</span>
                {res?.status === 'PASS' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {res?.status === 'PARTIAL' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {res?.status === 'INCORRECT' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Content Area */}
      <div className="p-6 space-y-6">
        
        {/* Task Title & Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-mono font-bold text-cyan-300">
              {currentTask.title}
            </h4>
            <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
              +{currentTask.xpReward} XP
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            {currentTask.description}
          </p>
        </div>

        {/* Evaluation Prompt & Submission Box */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 font-bold block">
            {currentTask.prompt}
          </label>

          {currentTask.type === 'sigma_rule' || currentTask.type === 'firewall_policy' ? (
            <textarea
              rows={5}
              value={currentInput}
              onChange={(e) =>
                setUserInputs((prev) => ({ ...prev, [currentTask.id]: e.target.value }))
              }
              placeholder={currentTask.expectedInputPlaceholder}
              disabled={currentResult?.status === 'PASS'}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-2xl p-4 text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none custom-scrollbar leading-relaxed"
            />
          ) : (
            <input
              type="text"
              value={currentInput}
              onChange={(e) =>
                setUserInputs((prev) => ({ ...prev, [currentTask.id]: e.target.value }))
              }
              placeholder={currentTask.expectedInputPlaceholder}
              disabled={currentResult?.status === 'PASS'}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none"
            />
          )}
        </div>

        {/* Action Buttons: Evaluate / Hints / Retry */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRevealNextHint}
              disabled={currentHintLevel >= 3}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>
                {currentHintLevel === 0
                  ? 'GET HINT 1'
                  : currentHintLevel === 1
                  ? 'GET HINT 2'
                  : currentHintLevel === 2
                  ? 'GET HINT 3'
                  : 'ALL HINTS REVEALED'}
              </span>
            </button>

            {currentResult && currentResult.status !== 'PASS' && (
              <button
                onClick={handleRetry}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RETRY
              </button>
            )}
          </div>

          <button
            onClick={handleEvaluate}
            disabled={!currentInput.trim() || currentResult?.status === 'PASS'}
            className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50 ${
              currentResult?.status === 'PASS'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:opacity-90'
            }`}
          >
            {currentResult?.status === 'PASS' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> TASK VERIFIED (PASS)
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4" /> VERIFY ACTION & STATE
              </>
            )}
          </button>

        </div>

        {/* PROGRESSIVE HINTS DISPLAY */}
        {currentHintLevel > 0 && (
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 font-mono text-xs">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> PROGRESSIVE LAB GUIDANCE:
            </div>
            {currentHintLevel >= 1 && (
              <div className="text-slate-300 pl-5">
                <span className="text-amber-400 font-bold">Hint 1:</span> {currentTask.hint1}
              </div>
            )}
            {currentHintLevel >= 2 && (
              <div className="text-slate-300 pl-5">
                <span className="text-amber-400 font-bold">Hint 2:</span> {currentTask.hint2}
              </div>
            )}
            {currentHintLevel >= 3 && (
              <div className="text-slate-300 pl-5">
                <span className="text-amber-400 font-bold">Hint 3 (Guided):</span> {currentTask.hint3}
              </div>
            )}
          </div>
        )}

        {/* RESULT VERDICT CARD */}
        {currentResult && (
          <div
            className={`p-4 rounded-2xl border space-y-2 font-mono text-xs ${
              currentResult.status === 'PASS'
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                : currentResult.status === 'PARTIAL'
                ? 'bg-amber-950/30 border-amber-500/50 text-amber-300'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                {currentResult.status === 'PASS' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {currentResult.status === 'PARTIAL' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {currentResult.status === 'INCORRECT' && <XCircle className="w-5 h-5 text-rose-400" />}
                <span>VERDICT: {currentResult.status} ({currentResult.score}/100)</span>
              </div>

              <button
                onClick={() =>
                  setShowExplanation((prev) => ({
                    ...prev,
                    [currentTask.id]: !prev[currentTask.id]
                  }))
                }
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer text-[11px]"
              >
                {showExplanation[currentTask.id] ? 'Hide Explanation' : 'Why this matters?'}
              </button>
            </div>

            <p className="font-sans text-xs text-slate-200">
              {currentResult.message}
            </p>

            {showExplanation[currentTask.id] && (
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs font-sans text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl">
                <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                  EDUCATIONAL RATIONALE:
                </span>
                {currentTask.explanation}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
