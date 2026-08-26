import React, { useRef } from 'react';
import {
  FileCheck2,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Layers,
  FolderGit2,
  Lock,
  Download,
  Award
} from 'lucide-react';
import { IncidentState } from '../../utils/incidentStateEngine';
import { LIVE_INCIDENT_SCENARIOS } from '../../data/liveIncidentsData';

interface ExecutiveReportGeneratorProps {
  state: IncidentState;
  reportNotes?: string;
  onClose?: () => void;
}

export const ExecutiveReportGenerator: React.FC<ExecutiveReportGeneratorProps> = ({
  state,
  reportNotes = '',
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const scenario = LIVE_INCIDENT_SCENARIOS.find(s => s.id === state.incidentId) || LIVE_INCIDENT_SCENARIOS[0];

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Ribbon */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>INCIDENT REPORT COMPILER: <strong>{scenario.code}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-300"
            >
              Close Inspector
            </button>
          )}
          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Export to PDF / Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Document Body */}
      <div
        ref={printRef}
        className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-8 font-sans print:bg-white print:text-black print:p-0 print:border-none"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 print:border-black pb-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs text-emerald-400 print:text-emerald-700 font-bold uppercase tracking-wider">
              MY CYBER LAB — EXECUTIVE SECURITY INCIDENT REPORT
            </div>
            <div className="font-mono text-xs text-slate-400 print:text-gray-600">
              DATE: {new Date().toLocaleDateString()} | SEED: #{state.seed}
            </div>
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 print:text-black">
            {scenario.code}: {scenario.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 print:text-gray-700">
            <span>TARGET ORG: {scenario.organization}</span>
            <span>SECTOR: {scenario.industry}</span>
            <span>DIFFICULTY: <strong className="text-red-400 print:text-red-700">{scenario.difficulty}</strong></span>
            <span>CVSS SCORE: <strong className="text-amber-400 print:text-amber-700">8.8 (HIGH)</strong></span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono font-bold text-slate-100 print:text-black uppercase border-b border-slate-800 print:border-gray-300 pb-1">
            1. Executive Summary
          </h2>
          <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
            During authorized cybersecurity testing on {scenario.organization}, security analysts identified critical vulnerabilities permitting unauthenticated initial access, privilege escalation, and data exfiltration. Investigative grade achieved: <strong className="text-emerald-400 print:text-emerald-700 font-mono">{state.score.grade} ({state.score.totalScore}/100 pts)</strong>.
          </p>
          {reportNotes && (
            <div className="p-3 rounded-lg bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300 text-xs font-mono text-slate-200 print:text-black">
              <strong>Analyst Technical Notes:</strong> {reportNotes}
            </div>
          )}
        </div>

        {/* 2. Scope & Methodology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="text-sm font-mono font-bold text-slate-100 print:text-black uppercase border-b border-slate-800 print:border-gray-300 pb-1">
              2. Authorized Scope
            </h2>
            <ul className="list-disc list-inside text-xs text-slate-300 print:text-gray-800 space-y-1 font-mono">
              {state.discoveredAssets.map(a => (
                <li key={a.host}>{a.host} ({a.ip}) — {a.role}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-mono font-bold text-slate-100 print:text-black uppercase border-b border-slate-800 print:border-gray-300 pb-1">
              3. Methodology
            </h2>
            <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed font-mono">
              NIST SP 800-61 Rev. 2 & PTES standards: Reconnaissance → Enumeration → Socratic Hypothesis → Exploitation → Evidence Integrity SHA-256 → Remediation → Retest.
            </p>
          </div>
        </div>

        {/* 4. Incident Timeline */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono font-bold text-slate-100 print:text-black uppercase border-b border-slate-800 print:border-gray-300 pb-1">
            4. Chronological Incident Timeline
          </h2>
          <div className="space-y-2 font-mono text-xs">
            {state.timeline.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-slate-900 print:border-gray-200 pb-2">
                <span className="text-slate-500 print:text-gray-600 font-bold shrink-0">[{ev.timestamp}]</span>
                <div>
                  <strong className="text-slate-200 print:text-black">{ev.title}:</strong> <span className="text-slate-400 print:text-gray-700">{ev.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Findings & MITRE ATT&CK Mapping */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono font-bold text-slate-100 print:text-black uppercase border-b border-slate-800 print:border-gray-300 pb-1">
            5. Technical Findings & MITRE ATT&CK Mapping
          </h2>
          <div className="p-4 rounded-xl bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-2 font-mono text-xs">
            {scenario.mitreTechniques.map(m => (
              <div key={m.id} className="flex items-center justify-between border-b border-slate-800 print:border-gray-300 pb-1">
                <span>{m.id} — {m.name}</span>
                <span className="text-purple-400 print:text-purple-700 font-bold">{m.tactic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Forensic Evidence Locker SHA-256 Logs */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono font-bold text-slate-100 print:text-black uppercase border-b border-slate-800 print:border-gray-300 pb-1">
            6. Evidence Locker Integrity Log
          </h2>
          {state.collectedEvidence.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono">No evidence locked in session.</p>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {state.collectedEvidence.map(e => (
                <div key={e.id} className="p-3 rounded-lg bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                  <div className="flex justify-between text-emerald-400 print:text-emerald-700 font-bold">
                    <span>{e.title} [{e.type}]</span>
                    <span>SHA-256: {e.sha256.substring(0, 24)}...</span>
                  </div>
                  <div className="text-slate-300 print:text-black text-[11px] whitespace-pre-wrap">{e.rawContent}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Retest Verification & Remediation */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono font-bold text-slate-100 print:text-black uppercase border-b border-slate-800 print:border-gray-300 pb-1">
            7. Defensive Remediation & Retest Verification
          </h2>
          <div className="p-4 rounded-xl bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span>Remediation Status: <strong>{state.remediationStatus}</strong></span>
              <span className={state.retestResults?.isMitigated ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {state.retestResults?.isMitigated ? '✅ RETEST VERIFIED: MITIGATED' : '❌ UNPROTECTED'}
              </span>
            </div>
            {state.retestResults && (
              <p className="text-slate-300 print:text-gray-800 font-sans text-xs">
                {state.retestResults.afterStatus}
              </p>
            )}
          </div>
        </div>

        {/* Document Footer */}
        <div className="border-t border-slate-800 print:border-gray-300 pt-4 flex justify-between font-mono text-[10px] text-slate-500 print:text-gray-600">
          <span>CONFIDENTIAL — FOR EDUCATIONAL & REMEDIATION AUDIT PURPOSES</span>
          <span>MY CYBER LAB SECURITY REPORTING ENGINE</span>
        </div>
      </div>
    </div>
  );
};
