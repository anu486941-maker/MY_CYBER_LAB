import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';

export const SocSimulatorPage: React.FC = () => {
  const { addXp } = useApp();
  const [alerts, setAlerts] = useState<SocAlert[]>(SOC_ALERTS_DATA);
  const [selectedAlertId, setSelectedAlertId] = useState<string>(SOC_ALERTS_DATA[0].id);
  const [actionLog, setActionLog] = useState<string[]>([
    '08:00:00 UTC - SIEM correlation engine initialized. Listening on eth0.'
  ]);
  const [feedback, setFeedback] = useState<{
    alertId: string;
    verdict: string;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  const activeAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

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
      addXp(activeAlert.xpReward);
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
            <span className="text-xs font-mono text-slate-500">• REALTIME SIEM TRIAGE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            SOC Level 1 Alert Triage Simulator
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Investigate network and host anomalies, review payload evidence, and execute containment actions.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">SIEM Status</div>
              <div className="text-xs font-bold text-emerald-400">INGESTING LIVE (5 ALERTS)</div>
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

              <p className="text-xs text-slate-400 leading-relaxed">
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
            <div className="space-y-1.5">
              <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Raw Forensic Payload / Sysmon Artifact Evidence:</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all custom-scrollbar font-mono">
                {activeAlert.rawPayloadSnippet}
              </div>
            </div>

            {/* Recommended Action Box */}
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-300 space-y-1">
              <div className="font-bold">RECOMMENDED PLAYBOOK ACTION:</div>
              <p className="text-slate-300 text-[11px]">{activeAlert.recommendedAction}</p>
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
                <p className="text-slate-300">{feedback.explanation}</p>
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

    </div>
  );
};
