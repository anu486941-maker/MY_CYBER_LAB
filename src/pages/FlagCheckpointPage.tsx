import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Terminal as TerminalIcon, 
  Search, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Award, 
  Bot, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Lock, 
  ExternalLink,
  ChevronRight,
  Filter,
  FileText
} from 'lucide-react';
import { playTacticalSound, toggleSound, isSoundEnabled } from '../utils/audio';
import { amanEventBus } from '../aman/amanEvents';

interface CheckpointVerificationResponse {
  success: boolean;
  verified: boolean;
  missionId: string;
  missionTitle: string;
  result: string;
  evidence: {
    id: string;
    missionId: string;
    timestamp: string;
    objective: string;
    artifact: string;
    score: number;
    verified: boolean;
  };
  score: number;
  hintsUsedCount: number;
  amanFeedback: string;
  nextMission?: {
    id: string;
    title: string;
    status: string;
  };
}

const SAMPLE_AUTH_LOGS = [
  `[2026-09-10 03:38:12 UTC] sshd[1029]: Accepted publickey for jsmith from 10.0.4.12 port 51220 ssh2: RSA SHA256:7f...`,
  `[2026-09-10 03:39:01 UTC] sshd[1035]: Connection closed by 10.0.4.12 port 51220 [preauth]`,
  `[2026-09-10 03:41:45 UTC] sshd[1039]: Failed password for invalid user admin from 198.51.100.44 port 43112 ssh2`,
  `[2026-09-10 03:41:48 UTC] sshd[1040]: Failed password for invalid user root from 198.51.100.44 port 43114 ssh2`,
  `[2026-09-10 03:42:04 UTC] sshd[1042]: Accepted password for m_chen from 198.51.100.44 port 43118 ssh2 (SIGNATURE: FLAG{SOC_AUTH_ANOMALY_EVENT_1042})`,
  `[2026-09-10 03:42:15 UTC] sudo[1045]: m_chen : TTY=pts/2 ; PWD=/home/m_chen ; USER=root ; COMMAND=/bin/cat /etc/shadow`,
  `[2026-09-10 03:43:30 UTC] sshd[1048]: pam_unix(sshd:session): session opened for user m_chen by (uid=0)`
];

export const FlagCheckpointPage: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    addXp, 
    completeMission, 
    addEvidence, 
    completedMissions,
    labScores
  } = useApp();
  const navigate = useNavigate();

  // Active step in the learning loop
  const [activeStep, setActiveStep] = useState<'briefing' | 'lab' | 'checkpoint' | 'complete'>('briefing');
  
  // Mission & Lab State
  const [submissionInput, setSubmissionInput] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<CheckpointVerificationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Socratic Hint Engine
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [logFilter, setLogFilter] = useState<string>('');

  // Audio briefing
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Check if mission was already verified in past session
  const isAlreadyCompleted = completedMissions.includes('SOC-001') || (profile.lastCheckpointPassed === 'SOC-001');

  useEffect(() => {
    // If already verified, hydrate checkpoint state
    if (isAlreadyCompleted && !verificationResult) {
      setVerificationResult({
        success: true,
        verified: true,
        missionId: 'SOC-001',
        missionTitle: 'SOC-001: Investigate a Suspicious Login',
        result: 'Suspicious login successfully identified and verified.',
        evidence: {
          id: 'EV-SAVED-SOC-001',
          missionId: 'SOC-001',
          timestamp: new Date().toISOString(),
          objective: 'SOC-001: Investigate a Suspicious Login',
          artifact: 'Authentication event #1042: Anomalous remote login from external untrusted IP 198.51.100.44 into user account "m_chen".',
          score: labScores['SOC-001'] || 100,
          verified: true
        },
        score: labScores['SOC-001'] || 100,
        hintsUsedCount: 0,
        amanFeedback: 'Excellent work, Operator! Tumne suspicious login correctly identify kiya. Event #1042 mein IP 198.51.100.44 ne unauthorized access attempt kiya tha.',
        nextMission: {
          id: 'SOC-002',
          title: 'SOC-002: Detect Brute Force Activity',
          status: 'UNLOCKED'
        }
      });
      setActiveStep('checkpoint');
    }
  }, [isAlreadyCompleted]);

  // Handle Speech synthesis for AMAN briefing
  const handleVoiceBriefing = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Namaste Operator. In this mission, your objective is to detect an unauthorized login event in the corporate authentication logs. Look for impossible travel, unusual IP subnets, or off-hours privilege escalation. Inspect the logs in the sandbox and submit your evidence flag when ready.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Socratic hints
  const hints = [
    {
      level: 1,
      costText: 'First Hint (Reduces score to 80%)',
      text: 'Examine the IP addresses in the log. Which IP belongs to internal corporate subnet 10.0.0.0/8, and which IP is external and untrusted?'
    },
    {
      level: 2,
      costText: 'Second Hint (Reduces score to 60%)',
      text: 'Filter specifically for "Accepted password" or look closely at Event ID #1042 around 03:42 UTC. The signature flag is embedded in the syslog message.'
    }
  ];

  const handleRevealNextHint = () => {
    playTacticalSound('click');
    setHintsRevealed(prev => Math.min(prev + 1, hints.length));
  };

  // Authoritative Server-Side Verification
  const handleVerifySubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionInput.trim()) return;

    setIsVerifying(true);
    setErrorMsg(null);
    playTacticalSound('click');

    try {
      const response = await fetch('/api/mission/checkpoint-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: 'SOC-001',
          submission: submissionInput.trim(),
          hintsUsedCount: hintsRevealed,
          learnerId: profile.codename || profile.name || 'operator-1',
          userTier: profile.membershipTier || 'FREE',
          licenseKey: profile.whopLicenseKey || ''
        })
      });

      const data: CheckpointVerificationResponse = await response.json();

      if (data.success && data.verified) {
        setVerificationResult(data);
        setActiveStep('checkpoint');
        playTacticalSound('success');

        // Persist to AppContext & Evidence Locker
        addEvidence({
          engagementId: 'ENG-SOC-001',
          assetId: 'AUTH-SRV-01',
          assetIp: '198.51.100.44',
          type: 'LOG_ENTRY',
          description: data.result,
          rawContent: data.evidence.artifact,
          analystNote: data.amanFeedback,
          verified: true
        });

        completeMission('SOC-001');
        addXp(data.score || 100);

        updateProfile({
          lastCheckpointPassed: 'SOC-001',
          checkpointScores: {
            ...(profile.checkpointScores || {}),
            'SOC-001': data.score
          }
        });

        // Emit Authoritative AMAN Event
        amanEventBus.emit({
          type: 'FLAG_CHECKPOINT_PASSED',
          userId: profile.codename || profile.name || 'operator',
          missionId: 'SOC-001',
          labId: 'm-webforge-01',
          score: data.score || 100,
          evidenceId: data.evidence?.id || 'ev-soc-001',
          timestamp: new Date().toISOString(),
          data
        });

      } else {
        setErrorMsg(data.amanFeedback || 'Verification failed. Please review your log analysis.');
        playTacticalSound('alert');
      }
    } catch (err: any) {
      setErrorMsg('Network error communicating with authoritative verification server.');
      playTacticalSound('alert');
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredLogs = SAMPLE_AUTH_LOGS.filter(line => 
    !logFilter || line.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <div data-aman-id="unsolved-queries" className="space-y-6 pb-24 animate-fadeIn font-sans text-slate-100">
      
      {/* =========================================================================
          TOP COMMAND HUD & ENVIRONMENT LABEL
          ========================================================================= */}
      <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-5 sm:p-7 shadow-[0_0_35px_rgba(6,182,212,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ENVIRONMENT: CONTROLLED SANDBOX
            </span>
            <span className="text-xs font-mono text-slate-500">•</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold">
              MISSION: SOC-001
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            Flag Checkpoint: Investigate a Suspicious Login
          </h1>
        </div>

        {/* Learning Loop Stepper */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveStep('briefing')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeStep === 'briefing' ? 'bg-cyan-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Briefing
          </button>
          <button
            data-aman-id="start-lab"
            onClick={() => setActiveStep('lab')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeStep === 'lab' ? 'bg-cyan-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Sandbox Lab
          </button>
          <button
            onClick={() => setActiveStep('checkpoint')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeStep === 'checkpoint' || activeStep === 'complete' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Checkpoint
          </button>
        </div>
      </div>

      {/* =========================================================================
          STEP 1: AMAN MISSION BRIEFING
          ========================================================================= */}
      {activeStep === 'briefing' && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
          
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            
            {/* AMAN Persona & Audio Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-base text-white flex items-center gap-2">
                    <span>AMAN Socratic Briefing</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      AUDIO READY
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Autonomous Cybersecurity Mentor // Lead Mission Director
                  </p>
                </div>
              </div>

              <button
                onClick={handleVoiceBriefing}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-mono text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'Mute Briefing' : 'Listen Briefing'}</span>
              </button>
            </div>

            {/* Structured Briefing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  1. Operational Objective
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Identify the unauthorized remote login event in the staging server's Linux authentication logs (<code className="text-cyan-300 font-mono">/var/log/auth.log</code>).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  2. Why This Matters In A Real Job
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  SOC Analysts triage authentication spikes daily. Identifying single compromised credentials early prevents network-wide ransomware deployment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  3. Log Data / Tools Inspected
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We inspect OpenSSH daemon entries (<code className="text-amber-300 font-mono">sshd</code>), user IDs, port assignments, and authentication status.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider font-bold">
                  4. Initial Recommended Command
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Run <code className="text-rose-300 font-mono">grep -i "Accepted" /var/log/auth.log</code> to isolate successful logins and inspect source IPs.
                </p>
              </div>

            </div>

            {/* AMAN Guidance Quote */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-200 font-sans leading-relaxed">
                <strong className="text-cyan-300 font-mono">AMAN:</strong> "Main tumhe guide karunga. Remember: corporate workstations are on the <code className="text-cyan-300 font-mono">10.0.0.0/8</code> range. Any external IP successfully logging in at off-hours warrants immediate isolation. Let's enter the sandbox."
              </p>
            </div>

            {/* Launch Lab CTA */}
            <div className="pt-2 flex justify-end">
              <button
                data-aman-id="start-mission"
                onClick={() => {
                  playTacticalSound('click');
                  setActiveStep('lab');
                }}
                className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Enter Controlled Sandbox Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          STEP 2: CONTROLLED HANDS-ON LAB & STUDENT ACTION
          ========================================================================= */}
      {activeStep === 'lab' && (
        <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
          
          {/* Lab HUD */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-5 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  TARGET HOST: auth-gateway-prod.internal [10.0.4.5]
                </span>
                <h3 className="text-base font-mono font-bold text-white">
                  Telemetry Sandbox: /var/log/auth.log
                </h3>
              </div>

              {/* Log Search Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  placeholder="Filter logs (e.g. Accepted)..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Terminal Window */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-slate-500">
                <span>bash - terminal@nightfall-range:~</span>
                <span>cat /var/log/auth.log</span>
              </div>

              <div className="space-y-1.5 text-slate-300 select-all">
                {filteredLogs.map((line, idx) => {
                  const isSuspicious = line.includes('198.51.100.44');
                  const isAccepted = line.includes('Accepted password');
                  return (
                    <div 
                      key={idx} 
                      className={`p-1.5 rounded transition-colors ${
                        isAccepted 
                          ? 'bg-amber-950/40 text-amber-200 border-l-2 border-amber-500' 
                          : isSuspicious 
                          ? 'bg-rose-950/30 text-rose-300' 
                          : 'hover:bg-slate-900'
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Action: Verification Submission Form */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-cyan-400" />
                    <span>Submit Evidence Flag or Anomalous IP</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">
                    Enter the extracted flag (e.g. <code className="text-cyan-300 font-mono">FLAG{'{...}'}</code>) or the external anomalous IP address / Event ID.
                  </p>
                </div>

                <button
                  onClick={handleRevealNextHint}
                  disabled={hintsRevealed >= hints.length}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask AMAN for Hint ({hintsRevealed}/{hints.length})</span>
                </button>
              </div>

              {/* Socratic Hints Display */}
              {hintsRevealed > 0 && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  {hints.slice(0, hintsRevealed).map((h, i) => (
                    <div key={i} className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-sans text-amber-200 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-mono text-amber-300 block mb-0.5">AMAN Hint #{h.level} ({h.costText}):</strong>
                        {h.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Verification Form */}
              <form onSubmit={handleVerifySubmission} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="text"
                  value={submissionInput}
                  onChange={(e) => setSubmissionInput(e.target.value)}
                  placeholder="Enter flag (e.g. FLAG{SOC_AUTH_...}) or anomalous IP (198.51.100.44)..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
                />

                <button
                  data-aman-id="submit-flag"
                  type="submit"
                  disabled={isVerifying || !submissionInput.trim()}
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shrink-0"
                >
                  {isVerifying ? (
                    <>
                      <Radio className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying on Server...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Checkpoint</span>
                    </>
                  )}
                </button>
              </form>

              {/* Error Feedback */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs font-sans text-rose-300 flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-mono text-rose-400 block mb-0.5">AMAN Correction:</strong>
                    {errorMsg}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          STEP 3 & 4: FLAG CHECKPOINT CARD & SCORE (PASSED)
          ========================================================================= */}
      {(activeStep === 'checkpoint' || activeStep === 'complete') && verificationResult && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
          
          <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/50 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
            
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold uppercase tracking-wider">
                    ✓ FLAG CHECKPOINT PASSED
                  </span>
                  <h2 className="text-lg sm:text-2xl font-mono font-bold text-white mt-1">
                    {verificationResult.missionTitle}
                  </h2>
                </div>
              </div>

              {/* Score Badge */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center gap-3 font-mono">
                <Award className="w-6 h-6 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Score Awarded</span>
                  <span className="text-xl font-bold text-emerald-400">+{verificationResult.score} / 100</span>
                </div>
              </div>
            </div>

            {/* Checkpoint Summary Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">Result:</span>
                <span className="text-emerald-400 font-bold">{verificationResult.result}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">Verified Evidence:</span>
                <span className="text-slate-200">{verificationResult.evidence.artifact}</span>
              </div>
            </div>

            {/* AMAN Socratic Explanatory Feedback */}
            <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AMAN Post-Mission Assessment & Rationale</span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100 font-sans leading-relaxed">
                "{verificationResult.amanFeedback}"
              </p>
            </div>

            {/* Evidence Locker Confirmation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Artifact saved to Evidence Locker as <strong className="text-slate-200">{verificationResult.evidence.id}</strong></span>
              </div>
              <button
                onClick={() => navigate('/portfolio')}
                className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Next Mission Unlocked CTA */}
            {verificationResult.nextMission && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    MISSION COMPLETE: SOC-001 ✓
                  </span>
                  <h4 className="text-base font-mono font-bold text-white">
                    Next: {verificationResult.nextMission.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans">
                    Continue with AMAN into brute force velocity detection and firewall defense.
                  </p>
                </div>

                <button
                  onClick={() => {
                    playTacticalSound('click');
                    navigate('/roadmap');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shrink-0"
                >
                  <span>Continue With AMAN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default FlagCheckpointPage;
