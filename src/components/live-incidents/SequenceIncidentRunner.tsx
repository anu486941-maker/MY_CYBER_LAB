/**
 * Sequence-Wise Incident Runner (13 Phases)
 * Enforces structured incident lifecycle execution:
 * 1. Briefing -> 2. Recon -> 3. Enum -> 4. Initial Access -> 5. Exploitation -> 6. PrivEsc -> 7. Persistence/Lateral -> 8. Detection -> 9. Investigation -> 10. Attack Chain -> 11. Response -> 12. Report -> 13. AMAN Debrief
 */

import React, { useState } from 'react';
import { IncidentMission } from '../../data/incidentMissionsData';
import { Shield, Terminal, CheckCircle2, Lock, FileText, Sparkles, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { validateTargetScope } from '../../utils/targetAllowlistPolicy';

interface SequenceIncidentRunnerProps {
  mission: IncidentMission;
  onCompleteMission?: (flag: string, report: any) => void;
}

const PHASES = [
  '1. BRIEFING',
  '2. RECONNAISSANCE',
  '3. ENUMERATION',
  '4. INITIAL ACCESS SIMULATION',
  '5. EXPLOITATION SIMULATION',
  '6. PRIVILEGE ESCALATION',
  '7. PERSISTENCE & LATERAL SIM',
  '8. DETECTION & LOG TELEMETRY',
  '9. HYPOTHESIS & INVESTIGATION',
  '10. ATTACK CHAIN RECONSTRUCTION',
  '11. RESPONSE & CONTAINMENT',
  '12. SECURITY REPORT DRAFTING',
  '13. AMAN AI DEBRIEF'
];

export const SequenceIncidentRunner: React.FC<SequenceIncidentRunnerProps> = ({
  mission,
  onCompleteMission
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [flagInput, setFlagInput] = useState<string>('');
  const [targetInput, setTargetInput] = useState<string>(mission.targetScope.split(' ')[0]);
  const [targetValidation, setTargetValidation] = useState(validateTargetScope(mission.targetScope.split(' ')[0]));
  const [capturedEvidence, setCapturedEvidence] = useState<string[]>([]);
  const [reportDraft, setReportDraft] = useState<{ summary: string; remediation: string }>({
    summary: '',
    remediation: ''
  });
  const [debriefScore, setDebriefScore] = useState<number | null>(null);

  const handleTargetChange = (val: string) => {
    setTargetInput(val);
    const res = validateTargetScope(val);
    setTargetValidation(res);
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < PHASES.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
    }
  };

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(prev => prev - 1);
    }
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flagInput.trim() === mission.authoritativeFlag) {
      setCapturedEvidence(prev => [...prev, `Verified Flag: ${flagInput}`]);
      setDebriefScore(95);
      if (onCompleteMission) {
        onCompleteMission(flagInput, reportDraft);
      }
    } else {
      alert('Flag mismatch. Verify payload execution inside scope.');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl space-y-6">
      {/* Header & Target Scope Security Guard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            {mission.category} • {mission.difficulty}
          </span>
          <h2 className="text-2xl font-bold mt-2 text-white">{mission.title}</h2>
          <p className="text-sm text-slate-400">{mission.organizationName}</p>
        </div>

        {/* Target Scope Security Display */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-1 min-w-[280px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> TARGET SCOPE:
            </span>
            <span className={targetValidation.allowed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {targetValidation.allowed ? "AUTHORIZED" : "REFUSED"}
            </span>
          </div>
          <input
            type="text"
            value={targetInput}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono px-2 py-1 rounded focus:outline-none focus:border-cyan-500"
          />
          {!targetValidation.allowed && (
            <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" /> {targetValidation.refusalMessage}
            </p>
          )}
        </div>
      </div>

      {/* 13-Phase Progress Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-1">
        {PHASES.map((phaseName, idx) => {
          const isActive = idx === currentPhaseIndex;
          const isPassed = idx < currentPhaseIndex;
          return (
            <button
              key={idx}
              onClick={() => setCurrentPhaseIndex(idx)}
              className={`p-2 rounded text-[10px] font-semibold truncate text-left transition ${
                isActive
                  ? 'bg-cyan-600 text-white font-bold ring-2 ring-cyan-400'
                  : isPassed
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-900'
                  : 'bg-slate-950 text-slate-500 border border-slate-900'
              }`}
            >
              Phase {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Phase Content Render */}
      <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 min-h-[260px]">
        <h3 className="text-lg font-bold text-cyan-400 mb-2">{PHASES[currentPhaseIndex]}</h3>

        {currentPhaseIndex === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">{mission.briefing}</p>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Objectives:</h4>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                {mission.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {currentPhaseIndex >= 1 && currentPhaseIndex <= 7 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Executing {PHASES[currentPhaseIndex]} on authorized target <code className="text-cyan-400">{targetInput}</code>.
            </p>
            <div className="bg-slate-900 p-4 rounded border border-slate-800 font-mono text-xs text-emerald-400">
              <p className="text-slate-500"># Authorized MY CYBER LAB Workstation Console</p>
              <p>$ nmap -sV -p 80,443,5432 {targetInput}</p>
              <p className="text-slate-300">PORT 80/TCP OPEN http Nginx 1.18.0</p>
              <p className="text-slate-300">PORT 5432/TCP OPEN postgresql PostgreSQL 14.2</p>
              <p className="text-cyan-400 font-bold mt-2">[TELEMETRY LOGGED TO EVIDENCE LOCKER]</p>
            </div>
          </div>
        )}

        {currentPhaseIndex >= 8 && currentPhaseIndex <= 10 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-300">MITRE ATT&CK Attack-Chain Reconstruction:</h4>
            <div className="flex flex-wrap gap-2">
              {mission.mitreTechniques.map((tech, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono border border-amber-900/50">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {currentPhaseIndex === 11 && (
          <form onSubmit={handleFlagSubmit} className="space-y-4">
            <h4 className="text-sm font-bold text-slate-300">Submit Authoritative Flag & Report:</h4>
            <input
              type="text"
              placeholder="FLAG{...}"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-sm font-mono text-cyan-300 p-2.5 rounded focus:outline-none focus:border-cyan-500"
            />
            <textarea
              placeholder="Executive Summary & Technical Remediation..."
              value={reportDraft.summary}
              onChange={(e) => setReportDraft(prev => ({ ...prev, summary: e.target.value }))}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 text-sm text-slate-200 p-2.5 rounded focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Flag & Verification
            </button>
          </form>
        )}

        {currentPhaseIndex === 12 && (
          <div className="space-y-4 text-center py-4">
            <Sparkles className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
            <h4 className="text-xl font-bold text-white">AMAN AI Mission Debrief</h4>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Outstanding execution! You completed all 13 phases of {mission.title} against authorized scope {targetInput}.
            </p>
            {debriefScore && (
              <div className="inline-block bg-cyan-950 border border-cyan-800 px-6 py-3 rounded-xl">
                <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">Debrief Rating Score</span>
                <span className="text-3xl font-extrabold text-white">{debriefScore} / 100</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrevPhase}
          disabled={currentPhaseIndex === 0}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold rounded disabled:opacity-50 transition"
        >
          Previous Phase
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Phase {currentPhaseIndex + 1} of {PHASES.length}
        </span>

        <button
          onClick={handleNextPhase}
          disabled={currentPhaseIndex === PHASES.length - 1}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-xs text-white font-bold rounded disabled:opacity-50 transition flex items-center gap-2"
        >
          Next Phase <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
