import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SOC_ALERTS_DATA } from '../data/mockData';
import { SocAlert } from '../types';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Clock, 
  Terminal, 
  Crosshair, 
  Shield, 
  Server, 
  Activity,
  ArrowRight,
  Sparkles,
  Lock,
  FileText,
  RotateCcw,
  Bot,
  Plus,
  Zap,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SocSimulatorPage: React.FC = () => {
  const { addXp, addEvidence, recordMistake } = useApp();
  const [alerts, setAlerts] = useState<SocAlert[]>(SOC_ALERTS_DATA);
  const [selectedAlertId, setSelectedAlertId] = useState<string>(SOC_ALERTS_DATA[0].id);
  const [shiftTimeSeconds, setShiftTimeSeconds] = useState<number>(0);
  const [isShiftActive, setIsShiftActive] = useState<boolean>(true);
  const [actionLog, setActionLog] = useState<string[]>([
    '08:00:00 UTC - SIEM correlation engine initialized. Listening on eth0.'
  ]);
  const [feedback, setFeedback] = useState<{
    alertId: string;
    verdict: string;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);
  const [savedIocs, setSavedIocs] = useState<string[]>([]);
  const [showShiftDebrief, setShowShiftDebrief] = useState<boolean>(false);

  // Shift Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isShiftActive) {
      interval = setInterval(() => {
        setShiftTimeSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isShiftActive]);

  const activeAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];
  const processedCount = alerts.filter(a => a.verdict !== 'PENDING').length;
  const correctCount = alerts.filter(a => {
    if (a.id === 'soc-05') return a.verdict === 'FALSE_POSITIVE';
    return a.verdict === 'TRUE_POSITIVE' || a.verdict === 'ESCALATED';
  }).length;
  const accuracy = processedCount > 0 ? Math.round((correctCount / processedCount) * 100) : 100;

  const handleTriageAction = (verdict: 'TRUE_POSITIVE' | 'FALSE_POSITIVE' | 'ESCALATED', actionName: string) => {
    const isFalsePositiveAlert = activeAlert.id === 'soc-05';
    let isCorrect = false;

    if (verdict === 'FALSE_POSITIVE' && isFalsePositiveAlert) {
      isCorrect = true;
    } else if (verdict === 'TRUE_POSITIVE' && !isFalsePositiveAlert) {
      isCorrect = true;
    } else if (verdict === 'ESCALATED' && activeAlert.severity === 'CRITICAL') {
      isCorrect = true;
    }

    if (isCorrect) {
      addXp(activeAlert.xpReward, `Accurate SOC triage for ${activeAlert.alertCode}`);
    } else {
      recordMistake({
        title: `SOC Triage Misclassification: ${activeAlert.alertTitle}`,
        category: 'SOC / Detection',
        whyItHappens: `Alert was triaged as ${verdict} while actual root cause is ${activeAlert.severity} threat requiring ${activeAlert.recommendedAction}.`,
        howToFixIt: `Inspect raw telemetry, source/destination ports, and correlating MITRE techniques (${activeAlert.mitreAttackId}) before classifying.`,
        relatedSkillId: 'soc-triage',
        drillQuestion: {
          prompt: `When analyzing alert ${activeAlert.alertCode} (${activeAlert.mitreTactic}), what indicates the true verdict?`,
          options: [
            activeAlert.explanation,
            'Routine background healthcheck traffic with benign payload',
            'Internal load-balancer probe without security impact',
            'Standard automated operating system update synchronization'
          ],
          correctIndex: 0,
          explanation: activeAlert.explanation,
          hint: `Review MITRE Technique ${activeAlert.mitreAttackId}`
        }
      });
    }

    // Update alert status
    setAlerts(prev => prev.map(a => {
      if (a.id === activeAlert.id) {
        return { ...a, verdict };
      }
      return a;
    }));

    setActionLog(prev => [
      `${new Date().toISOString().substring(11, 19)} UTC - [${activeAlert.alertCode}] Action: "${actionName}". Verdict: ${verdict}.`,
      ...prev
    ]);

    setFeedback({
      alertId: activeAlert.id,
      verdict,
      isCorrect,
      explanation: isCorrect 
        ? `Accurate triage! ${activeAlert.explanation} (+${activeAlert.xpReward} XP awarded)`
        : `Triage correction: ${activeAlert.explanation}`
    });

    if (processedCount + 1 >= alerts.length) {
      setShowShiftDebrief(true);
    }
  };

  const handleSaveToEvidenceLocker = () => {
    if (savedIocs.includes(activeAlert.id)) return;
    
    addEvidence({
      engagementId: 'ENG-SOC-001',
      assetId: `SRV-${activeAlert.id}`,
      assetIp: activeAlert.sourceIp || '10.0.0.1',
      type: 'LOG_ENTRY',
      description: `SOC Alert IOC: ${activeAlert.alertCode} - ${activeAlert.alertTitle}`,
      rawContent: `Source: ${activeAlert.sourceIp} -> Dest: ${activeAlert.destinationIp}:${activeAlert.destinationPort}\nMITRE: ${activeAlert.mitreAttackId} (${activeAlert.mitreTactic})\nPayload Artifact:\n${activeAlert.rawPayloadSnippet}`,
      analystNote: `Triage finding: ${activeAlert.recommendedAction}. Investigated during SOC shift.`,
      verified: true
    });

    setSavedIocs(prev => [...prev, activeAlert.id]);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-950/80 border-red-500/50 text-red-400';
      case 'HIGH':
        return 'bg-orange-950/80 border-orange-500/50 text-orange-400';
      case 'MEDIUM':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-400';
      default:
        return 'bg-blue-950/80 border-blue-500/50 text-blue-400';
    }
  };

  return (
    <div id="soc-simulator-page" className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-400 font-mono text-xs font-semibold">
              BLUE TEAM INCIDENT RESPONSE
            </span>
            <span className="text-xs font-mono text-slate-500">• LIVE SOC ANALYST SHIFT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            SOC Level 1 Alert Triage Simulator
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Investigate network and host anomalies, extract IOCs, and execute authorized containment actions.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
          <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Shift Time</div>
              <div className="text-xs font-bold text-cyan-300">{formatTimer(shiftTimeSeconds)}</div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Queue Progress</div>
              <div className="text-xs font-bold text-emerald-400">{processedCount}/{alerts.length} Processed</div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Triage Accuracy</div>
              <div className="text-xs font-bold text-amber-400">{accuracy}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main SOC Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Alert Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-1">
            <span>INCOMING ALERT QUEUE</span>
            <span>{alerts.filter(a => a.verdict === 'PENDING').length} PENDING</span>
          </div>

          <div className="space-y-2.5">
            {alerts.map((al) => {
              const isSelected = al.id === activeAlert.id;
              const isResolved = al.verdict !== 'PENDING';

              return (
                <button
                  key={al.id}
                  onClick={() => {
                    setSelectedAlertId(al.id);
                    setFeedback(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] text-slate-500">{al.alertCode}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(al.severity)}`}>
                        {al.severity}
                      </span>
                      {isResolved && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                          {al.verdict}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                    {al.alertTitle}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{al.sourceIp} &rarr; {al.destinationIp}:{al.destinationPort}</span>
                    <span>{al.timestamp.substring(11, 19)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Evidence Link */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Evidence Locker: {savedIocs.length} IOCs Saved</span>
            </div>
            <Link 
              to="/security-report"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
            >
              <span>Build Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Alert Inspector & Containment Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl font-mono">
            
            {/* Alert Header Details */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs text-cyan-400 font-bold">{activeAlert.alertCode}</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getSeverityBadge(activeAlert.severity)}`}>
                  SEVERITY: {activeAlert.severity}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-100">
                {activeAlert.alertTitle}
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {activeAlert.description}
              </p>
            </div>

            {/* Network / MITRE ATT&CK Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500">SOURCE IP</div>
                <div className="font-bold text-slate-200">{activeAlert.sourceIp}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500">DEST PORT / PROTO</div>
                <div className="font-bold text-slate-200">{activeAlert.destinationPort} / {activeAlert.protocol}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500">MITRE TECHNIQUE</div>
                <div className="font-bold text-cyan-400">{activeAlert.mitreAttackId}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500">MITRE TACTIC</div>
                <div className="font-bold text-purple-400">{activeAlert.mitreTactic}</div>
              </div>
            </div>

            {/* Raw Payload Evidence Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Raw Forensic Payload / Sysmon Artifact Evidence:</span>
                </div>
                <button
                  onClick={handleSaveToEvidenceLocker}
                  disabled={savedIocs.includes(activeAlert.id)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{savedIocs.includes(activeAlert.id) ? '✓ Saved to Locker' : 'Save IOC to Locker'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all custom-scrollbar font-mono">
                {activeAlert.rawPayloadSnippet}
              </div>
            </div>

            {/* Recommended Action Box */}
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-300 space-y-1">
              <div className="font-bold">RECOMMENDED PLAYBOOK ACTION:</div>
              <p className="text-slate-300 text-[11px] font-sans">{activeAlert.recommendedAction}</p>
            </div>

            {/* Triage Decision Buttons */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-300">
                EXECUTE CONTAINMENT / TRIAGE VERDICT:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleTriageAction('TRUE_POSITIVE', 'Block Source IP & Quarantine Host')}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-slate-100 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  TRUE POSITIVE (CONTAIN)
                </button>

                <button
                  onClick={() => handleTriageAction('FALSE_POSITIVE', 'Mark Benign / Tune Rule')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  FALSE POSITIVE (DISMISS)
                </button>

                <button
                  onClick={() => handleTriageAction('ESCALATED', 'Escalate Incident to Tier 2 DFIR')}
                  className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-100 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  ESCALATE (TIER 2)
                </button>
              </div>
            </div>

            {/* Feedback Alert */}
            {feedback && feedback.alertId === activeAlert.id && (
              <div className={`p-4 rounded-xl border text-xs space-y-1 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                  {feedback.isCorrect ? 'ACCURATE TRIAGE ANALYSIS' : 'TRIAGE REVIEW'}
                </div>
                <p className="text-slate-300 font-sans">{feedback.explanation}</p>
              </div>
            )}

          </div>

          {/* Action Audit Trail Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs space-y-2">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              INCIDENT RESPONSE ACTION LOG (AUDIT TRAIL)
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto text-[11px] text-slate-400">
              {actionLog.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-cyan-400">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SHIFT COMPLETION DEBRIEF MODAL */}
      {showShiftDebrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 max-w-xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Senior SOC Analyst Shift Review</h3>
                <p className="text-slate-400 text-[11px]">Shift performance evaluation & containment audit</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Shift Duration</div>
                <div className="text-base font-bold text-cyan-300">{formatTimer(shiftTimeSeconds)}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Alerts Triaged</div>
                <div className="text-base font-bold text-slate-200">{processedCount}/{alerts.length}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                <div className="text-base font-bold text-emerald-400">{accuracy}%</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-slate-300 font-sans leading-relaxed">
              <span className="font-bold text-white font-mono block uppercase text-xs">SENIOR MENTOR OBSERVATION:</span>
              <p>
                {accuracy >= 80 
                  ? 'Strong work on the shift queue! You accurately differentiated benign scanner traffic from actionable SSH brute force and web shell anomalies. Your IOCs are ready for the executive debrief.' 
                  : 'You completed your shift triage. Review the false positive tuning rule for alert soc-05 to avoid alert fatigue in enterprise SIEM operations.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowShiftDebrief(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Close Shift Review
              </button>
              <Link
                to="/security-report"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black font-mono flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <span>Generate Shift Report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

