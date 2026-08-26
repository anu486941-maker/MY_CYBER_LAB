import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Copy, 
  Download, 
  CheckCircle2, 
  Info,
  Terminal,
  Layers,
  Printer,
  FolderGit2,
  ExternalLink
} from 'lucide-react';

interface FindingReport {
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  affectedComponent: string;
  cveId?: string;
  description: string;
  evidence: string;
  reproductionSteps: string;
  impact: string;
  remediation: string;
  references: string;
}

export const SecurityReportPage: React.FC = () => {
  const { securityFindings, evidenceLocker } = useApp();
  const [report, setReport] = useState<FindingReport>({
    title: securityFindings[0]?.title || 'Unauthenticated Remote Command Injection in Diagnostic Endpoint',
    severity: (securityFindings[0]?.severity as any) || 'HIGH',
    affectedComponent: securityFindings[0]?.affectedAsset || '/api/v1/diagnostic-ping (Service daemon)',
    cveId: securityFindings[0]?.cweId || 'CWE-78 / Lab Simulation',
    description: securityFindings[0]?.description || 'The internal network diagnostic ping endpoint directly concatenates user input into a system shell command without sanitization or parameter binding.',
    evidence: evidenceLocker[0]?.rawContent || 'Payload: 127.0.0.1 && cat /etc/passwd\nServer Response: root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student User:/home/student:/bin/bash',
    reproductionSteps: '1. Send a POST request to /api/v1/diagnostic-ping with body {"target": "127.0.0.1 && id"}.\n2. Inspect the HTTP 200 response.\n3. Verify command execution output: uid=0(root) gid=0(root).',
    impact: 'An attacker with network line-of-sight can execute arbitrary OS commands with elevated privileges, leading to complete compromise of host integrity and confidentiality.',
    remediation: securityFindings[0]?.remediation || '1. Avoid shell execution functions (e.g. system(), exec()).\n2. Use safe subprocess APIs with array arguments.\n3. Apply strict input validation using an IPv4/IPv6 regex whitelist before invocation.',
    references: 'OWASP Top 10 A03:2021-Injection\nCWE-78: Improper Neutralization of Special Elements used in an OS Command'
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyMarkdown = () => {
    const md = `
# VULNERABILITY ASSESSMENT REPORT: ${report.title}
**Severity**: ${report.severity}
**Affected Component**: ${report.affectedComponent}
**Vulnerability Type / ID**: ${report.cveId}

---

## 1. Executive Summary & Description
${report.description}

## 2. Technical Evidence & Telemetry
\`\`\`
${report.evidence}
\`\`\`

## 3. Steps to Reproduce (Authorized Training Verification)
${report.reproductionSteps}

## 4. Business & Security Impact
${report.impact}

## 5. Recommended Remediation & Defensive Hardening
${report.remediation}

## 6. Authoritative References
${report.references}

---
*Report generated via My Cyber Lab — AI Security Report Assistant (Authorized Testing Only)*
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold">
            <FileText className="w-3.5 h-3.5" /> PROFESSIONAL REPORTING ASSISTANT
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            Security Assessment Report Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans">
            Structure professional, audit-ready vulnerability assessment and incident reports conforming to industry standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/ace"
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> OPEN ACE SIMULATOR
          </Link>
          <button
            onClick={handleCopyMarkdown}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> COPIED MARKDOWN
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-950" /> COPY AS MARKDOWN
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick-Select from ACE Findings */}
      {securityFindings.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <FolderGit2 className="w-4 h-4 text-purple-400" />
            <span>LOAD FROM ACE FINDINGS LOCKER:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {securityFindings.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  const ev = evidenceLocker.find(e => f.evidenceIds?.includes(e.id)) || evidenceLocker[0];
                  setReport({
                    title: f.title,
                    severity: f.severity as any,
                    affectedComponent: f.affectedAsset,
                    cveId: f.cweId,
                    description: f.description,
                    evidence: ev ? ev.rawContent : f.description,
                    reproductionSteps: `1. Conduct reconnaissance against ${f.affectedAsset}.\n2. Verify service response.\n3. Validate finding payload.`,
                    impact: f.impact,
                    remediation: f.remediation,
                    references: f.references.join('\n')
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 text-[11px] transition-colors"
              >
                {f.id}: {f.title.slice(0, 28)}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Form & Live Report Formatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Input Form */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs shadow-xl">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            Finding Metadata & Analysis
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">VULNERABILITY TITLE:</label>
            <input
              type="text"
              value={report.title}
              onChange={(e) => setReport({ ...report, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-cyan-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-bold mb-1">SEVERITY LEVEL:</label>
              <select
                value={report.severity}
                onChange={(e) => setReport({ ...report, severity: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-cyan-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
                <option value="INFORMATIONAL">INFORMATIONAL</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">CVE / CWE ID:</label>
              <input
                type="text"
                value={report.cveId}
                onChange={(e) => setReport({ ...report, cveId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-cyan-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">AFFECTED COMPONENT:</label>
            <input
              type="text"
              value={report.affectedComponent}
              onChange={(e) => setReport({ ...report, affectedComponent: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-cyan-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">DESCRIPTION & SCOPE:</label>
            <textarea
              rows={3}
              value={report.description}
              onChange={(e) => setReport({ ...report, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-cyan-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">TELEMETRY & EVIDENCE:</label>
            <textarea
              rows={3}
              value={report.evidence}
              onChange={(e) => setReport({ ...report, evidence: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-cyan-200 focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">STEPS TO REPRODUCE:</label>
            <textarea
              rows={3}
              value={report.reproductionSteps}
              onChange={(e) => setReport({ ...report, reproductionSteps: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-cyan-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">RECOMMENDED REMEDIATION:</label>
            <textarea
              rows={3}
              value={report.remediation}
              onChange={(e) => setReport({ ...report, remediation: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-cyan-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Right: Live Formatted Executive Deliverable */}
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 font-mono text-xs">
            <span className="text-slate-400 font-bold">DELIVERABLE PREVIEW</span>
            <span
              className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${
                report.severity === 'CRITICAL' || report.severity === 'HIGH'
                  ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-950 text-amber-400 border border-amber-500/30'
              }`}
            >
              {report.severity} SEVERITY
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <h2 className="text-lg font-mono font-bold text-white">
                {report.title}
              </h2>
              <div className="font-mono text-[11px] text-slate-400 mt-1">
                Target: <span className="text-cyan-300">{report.affectedComponent}</span> • Ref: {report.cveId}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase">
                1. Description
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {report.description}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase">
                2. Evidence Artifacts
              </h3>
              <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                {report.evidence}
              </pre>
            </div>

            <div className="space-y-1">
              <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase">
                3. Safe Verification Steps
              </h3>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {report.reproductionSteps}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-mono text-xs font-bold text-emerald-400 uppercase">
                4. Remediation Guidance
              </h3>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {report.remediation}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
