import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AUTHORIZED_CLIENT_ENGAGEMENTS, getClientEngagementById } from '../data/authorizedClientEngagements';
import { calculateEthicalHackerReadiness } from '../utils/ethicalHackerReadinessEngine';
import { validateAceCommandScope } from '../utils/aceScopePolicy';
import { calculateCvss31, parseCvss31Vector, evaluateFindingQuality, Cvss31Metrics } from '../utils/cvssCalculator';
import { verifyEvidenceIntegrity, getIsolatedEvidenceForEngagement } from '../utils/evidenceIntegrity';
import { securityAuditLogger } from '../utils/securityAuditLogger';
import { 
  ClientEngagement, 
  EvidenceItem, 
  SecurityFinding, 
  EngagementSeverity 
} from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  FileText,
  Search,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  Plus,
  Trash2,
  Lock,
  Server,
  Activity,
  Layers,
  HelpCircle,
  Cpu,
  Flame,
  Award,
  Globe,
  Radio,
  Clock
} from 'lucide-react';

export const AuthorizedClientEngagementPage: React.FC = () => {
  const {
    profile,
    learningState,
    evidenceLocker,
    addEvidence,
    deleteEvidence,
    securityFindings,
    addFinding,
    updateFinding,
    deleteFinding,
    retestFinding,
    engagementReports,
    saveEngagementReport,
    activeEngagementId,
    setActiveEngagementId,
    addXp
  } = useApp();

  // Selected Engagement State
  const currentEngagement: ClientEngagement = useMemo(() => {
    return getClientEngagementById(activeEngagementId || 'ace-northstar-01');
  }, [activeEngagementId]);

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<'scope' | 'terminal' | 'evidence' | 'findings' | 'retest' | 'report' | 'readiness'>('scope');

  // Terminal Simulator State
  const [terminalCommand, setTerminalCommand] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<{ cmd: string; output: string; time: string; type?: string }[]>([
    {
      cmd: 'nmap -sn 10.50.0.0/24',
      output: 'Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-24 10:00 UTC\nNmap scan report for ns-edge-router.internal (10.50.0.1)\nHost is up (0.0012s latency).\nNmap scan report for ns-web-app01.internal (10.50.0.10)\nHost is up (0.0015s latency).\nNmap scan report for ns-db-staging.internal (10.50.0.25)\nHost is up (0.0018s latency).\nNmap done: 256 IP addresses (3 hosts up) scanned in 1.42 seconds.',
      time: '10:00:15 UTC'
    }
  ]);
  const [isExecutingCmd, setIsExecutingCmd] = useState(false);

  // Evidence Creation Modal / State
  const [newEvidence, setNewEvidence] = useState<{
    assetId: string;
    assetIp: string;
    type: EvidenceItem['type'];
    description: string;
    rawContent: string;
    analystNote: string;
  }>({
    assetId: currentEngagement.scope.authorizedAssets[0]?.id || 'asset-01',
    assetIp: currentEngagement.scope.authorizedAssets[0]?.ip || '10.50.0.1',
    type: 'COMMAND_OUTPUT',
    description: '',
    rawContent: '',
    analystNote: ''
  });
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);

  // Finding Builder State
  const [newFinding, setNewFinding] = useState<{
    title: string;
    severity: EngagementSeverity;
    cvssScore: number;
    affectedAsset: string;
    affectedComponent: string;
    cweId: string;
    owaspCategory: string;
    description: string;
    evidenceIds: string[];
    impact: string;
    likelihood: 'High' | 'Medium' | 'Low';
    remediation: string;
    references: string;
  }>({
    title: '',
    severity: 'HIGH',
    cvssScore: 7.5,
    affectedAsset: currentEngagement.scope.authorizedAssets[0]?.name || '',
    affectedComponent: '',
    cweId: 'CWE-306: Missing Authentication for Critical Function',
    owaspCategory: 'A01:2021-Broken Access Control',
    description: '',
    evidenceIds: [],
    impact: '',
    likelihood: 'High',
    remediation: '',
    references: 'OWASP Top 10\nNIST SP 800-115'
  });
  const [isAddingFinding, setIsAddingFinding] = useState(false);

  // Retest Simulator State
  const [selectedFindingForRetest, setSelectedFindingForRetest] = useState<string>(securityFindings[0]?.id || '');
  const [isRetesting, setIsRetesting] = useState(false);
  const [retestResult, setRetestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Report Generator State
  const [leadAuditor, setLeadAuditor] = useState(`${profile.name} (${profile.codename || 'CIPHER-01'})`);
  const [executiveSummary, setExecutiveSummary] = useState(
    `During the authorized penetration test for ${currentEngagement.clientName}, security engineers evaluated the in-scope systems within ${currentEngagement.scope.authorizedSubnet}. Multiple security findings were identified and verified with technical evidence.`
  );
  const [copiedReport, setCopiedReport] = useState(false);

  // Readiness Calculation
  const readiness = useMemo(() => {
    return calculateEthicalHackerReadiness(
      profile,
      learningState,
      evidenceLocker.length,
      securityFindings.length,
      engagementReports.length
    );
  }, [profile, learningState, evidenceLocker.length, securityFindings.length, engagementReports.length]);

  // Terminal Execution Engine (Simulated Sandbox Targets)
  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalCommand.trim()) return;

    setIsExecutingCmd(true);
    const cmd = terminalCommand.trim();
    setTerminalCommand('');

    // Pre-flight Scope and RoE Enforcement
    const scopeCheck = validateAceCommandScope(cmd, currentEngagement);
    if (!scopeCheck.allowed) {
      securityAuditLogger.logEvent('COMMAND_BLOCKED', `Command blocked by scope policy: "${cmd}" - ${scopeCheck.reason}`, {
        engagementId: currentEngagement.id,
        actor: profile.name || 'Operator',
        severity: 'WARN'
      });

      setTimeout(() => {
        setTerminalLogs(prev => [
          ...prev,
          {
            cmd,
            output: `[!] ROE SCOPE ENFORCEMENT ENGINE [DENIED]\n${scopeCheck.reason}\n\nAll actions are logged to the security audit trail. Target subnet for this engagement: ${currentEngagement.scope.authorizedSubnet}`,
            time: new Date().toISOString().substring(11, 19) + ' UTC',
            type: 'error'
          }
        ]);
        setIsExecutingCmd(false);
      }, 250);
      return;
    }

    securityAuditLogger.logEvent('COMMAND_ATTEMPTED', `Executed reconnaissance command: "${cmd}"`, {
      engagementId: currentEngagement.id,
      actor: profile.name || 'Operator'
    });

    setTimeout(() => {
      let output = '';
      const lower = cmd.toLowerCase();

      if (lower.startsWith('nmap') && lower.includes('-sn')) {
        output = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${currentEngagement.scope.authorizedAssets.map(a => `${a.name} (${a.ip})`).join('\nNmap scan report for ')}\nNmap done: 256 IP addresses (${currentEngagement.scope.authorizedAssets.length} hosts up) scanned in 1.15 seconds.`;
      } else if (lower.startsWith('nmap') && (lower.includes('-sv') || lower.includes('-sc') || lower.includes('-p'))) {
        const target = currentEngagement.scope.authorizedAssets.find(a => cmd.includes(a.ip)) || currentEngagement.scope.authorizedAssets[1] || currentEngagement.scope.authorizedAssets[0];
        output = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${target.name} (${target.ip})\nHost is up (0.0012s latency).\nPORT     STATE SERVICE      VERSION\n${target.services.map(s => `${s.port}/tcp  ${s.state}    ${s.name.padEnd(12)} ${s.version || 'unknown'}`).join('\n')}\n\nService detection performed. Please report any unauthorized services.`;
      } else if (lower.includes('redis-cli') && lower.includes('info')) {
        output = `# Server\nredis_version:6.2.6\nos:Linux 5.10.0-18-amd64 x86_64\ntcp_port:6379\nuptime_in_seconds:86400\n# Clients\nconnected_clients:1\n# Keyspace\ndb0:keys=14,expires=0,avg_ttl=0\n# Vulnerability: Authentication not required (requirepass not set).`;
      } else if (lower.includes('curl') && lower.includes('swagger')) {
        output = `HTTP/1.1 200 OK\nContent-Type: application/json\nAccess-Control-Allow-Origin: *\n\n{\n  "openapi": "3.0.0",\n  "info": { "title": "Internal Analytics Diagnostics API", "version": "1.0-STAGING" },\n  "paths": { "/metrics/env": { "get": { "summary": "Dump process environment variables" } } }\n}`;
      } else if (lower.includes('curl') && lower.includes('10.50.0.10:8080/metrics/env')) {
        output = `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "NODE_ENV": "staging",\n  "DB_HOST": "10.50.0.25",\n  "DB_USER": "staging_admin",\n  "DB_PASS": "StagingPasswd2026!",\n  "REDIS_URL": "redis://10.50.0.25:6379"\n}`;
      } else if (lower.includes('find / -perm -4000')) {
        output = `/usr/bin/passwd\n/usr/bin/sudo\n/usr/bin/chsh\n/usr/local/bin/backup-telemetry  <-- [NON-STANDARD SUID BINARY]\n/bin/umount\n/bin/ping`;
      } else if (lower.includes('strings /usr/local/bin/backup-telemetry')) {
        output = `/bin/echo "Backing up hospital telemetry..."\ncp -r /var/log/telemetry /var/backups/  <-- [VULNERABILITY: Relative 'cp' path without absolute resolution]\n/bin/echo "Backup complete."`;
      } else if (lower.includes('id')) {
        output = `uid=0(root) gid=0(root) groups=0(root) [EXPLOITATION PROOF: Elevated privilege achieved via PATH hijacking]`;
      } else if (lower.includes('getuserspns.py') || lower.includes('kerberoast')) {
        output = `[*] ServicePrincipalName: MSSQLSvc/fs01.vertex.local:1433\n[*] UserAccountControl: 0x200 (NORMAL_ACCOUNT)\n[*] Hash Format: $krb5tgs$23$*svc_mssql$VERTEX.LOCAL*$MSSQLSvc/fs01.vertex.local:1433*... [RC4-HMAC TGS-REP Ticket Captured]`;
      } else if (lower.includes('help')) {
        output = `Authorized ACE Simulator Commands:\n - nmap -sn ${currentEngagement.scope.authorizedSubnet}\n - nmap -sV -sC -p- <Target-IP>\n - curl -i http://<Target-IP>:<Port>\n - redis-cli -h 10.50.0.25 -p 6379 INFO\n - find / -perm -4000 2>/dev/null\n - id\n - clear`;
      } else if (lower === 'clear') {
        setTerminalLogs([]);
        setIsExecutingCmd(false);
        return;
      } else {
        output = `bash: ${cmd}: command executed within isolated authorized range. Output logged.`;
      }

      setTerminalLogs(prev => [
        ...prev,
        {
          cmd,
          output,
          time: new Date().toISOString().substring(11, 19) + ' UTC'
        }
      ]);
      setIsExecutingCmd(false);
    }, 450);
  };

  // One-click Preserve Terminal Output as Evidence
  const handlePreserveOutputAsEvidence = (log: { cmd: string; output: string }) => {
    const item = addEvidence({
      engagementId: currentEngagement.id,
      assetId: currentEngagement.scope.authorizedAssets[0]?.id || 'asset-01',
      assetIp: currentEngagement.scope.authorizedAssets[0]?.ip || '10.50.0.1',
      type: 'COMMAND_OUTPUT',
      description: `Terminal capture: ${log.cmd.slice(0, 60)}`,
      rawContent: `${log.cmd}\n${log.output}`,
      analystNote: `Preserved during authorized engagement against ${currentEngagement.clientName}.`,
      verified: true
    });
    setActiveTab('evidence');
  };

  // Submit Evidence manually
  const handleCreateEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.description || !newEvidence.rawContent) return;

    addEvidence({
      engagementId: currentEngagement.id,
      assetId: newEvidence.assetId,
      assetIp: newEvidence.assetIp,
      type: newEvidence.type,
      description: newEvidence.description,
      rawContent: newEvidence.rawContent,
      analystNote: newEvidence.analystNote || 'Manually entered analyst evidence artifact.',
      verified: true
    });

    setNewEvidence({
      assetId: currentEngagement.scope.authorizedAssets[0]?.id || 'asset-01',
      assetIp: currentEngagement.scope.authorizedAssets[0]?.ip || '10.50.0.1',
      type: 'COMMAND_OUTPUT',
      description: '',
      rawContent: '',
      analystNote: ''
    });
    setIsAddingEvidence(false);
  };

  // Submit Finding
  const handleCreateFindingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFinding.title || !newFinding.description) return;

    addFinding({
      engagementId: currentEngagement.id,
      title: newFinding.title,
      severity: newFinding.severity,
      cvssScore: Number(newFinding.cvssScore),
      affectedAsset: newFinding.affectedAsset,
      affectedComponent: newFinding.affectedComponent || 'Daemon Port / Web API',
      cweId: newFinding.cweId,
      owaspCategory: newFinding.owaspCategory,
      description: newFinding.description,
      evidenceIds: newFinding.evidenceIds.length > 0 ? newFinding.evidenceIds : [evidenceLocker[0]?.id || 'EVID-001'],
      impact: newFinding.impact || 'Potential unauthorized confidentiality and integrity impact.',
      likelihood: newFinding.likelihood,
      remediation: newFinding.remediation || 'Apply vendor security patch and enforce least privilege configuration.',
      references: newFinding.references.split('\n').filter(r => r.trim().length > 0),
      retestStatus: 'PENDING_REMEDIATION'
    });

    setNewFinding({
      title: '',
      severity: 'HIGH',
      cvssScore: 7.5,
      affectedAsset: currentEngagement.scope.authorizedAssets[0]?.name || '',
      affectedComponent: '',
      cweId: 'CWE-306: Missing Authentication for Critical Function',
      owaspCategory: 'A01:2021-Broken Access Control',
      description: '',
      evidenceIds: [],
      impact: '',
      likelihood: 'High',
      remediation: '',
      references: 'OWASP Top 10\nNIST SP 800-115'
    });
    setIsAddingFinding(false);
  };

  // Trigger Retest Verification
  const handleRunRetest = (finding: SecurityFinding) => {
    setIsRetesting(true);
    setRetestResult(null);

    const scenario = currentEngagement.retestScenarios?.find(s => s.findingId === finding.id || finding.title.toLowerCase().includes('redis')) || {
      findingId: finding.id,
      patchDescription: 'Applied configuration hardening patch and restricted network ACLs.',
      verificationCommand: `nmap -p 6379 -sV ${finding.affectedAsset.includes('10.50') ? '10.50.0.25' : '127.0.0.1'}`,
      expectedPatchedOutput: 'PORT     STATE  SERVICE\n6379/tcp closed redis\nAccess Denied: 403 Forbidden / Loopback Bound.'
    };

    setTimeout(() => {
      const outcome = retestFinding(finding.id, scenario.verificationCommand, scenario.expectedPatchedOutput);
      setIsRetesting(false);
      setRetestResult(outcome);
    }, 800);
  };

  // Publish / Export Report
  const handlePublishReport = () => {
    const criticalCount = securityFindings.filter(f => f.severity === 'CRITICAL').length;
    const highCount = securityFindings.filter(f => f.severity === 'HIGH').length;
    const mediumCount = securityFindings.filter(f => f.severity === 'MEDIUM').length;
    const lowCount = securityFindings.filter(f => f.severity === 'LOW').length;
    const infoCount = securityFindings.filter(f => f.severity === 'INFORMATIONAL').length;

    let posture: 'POOR' | 'MODERATE' | 'STRONG' | 'CRITICAL_RISK' = 'STRONG';
    if (criticalCount > 0) posture = 'CRITICAL_RISK';
    else if (highCount > 0) posture = 'POOR';
    else if (mediumCount > 1) posture = 'MODERATE';

    const saved = saveEngagementReport({
      engagementId: currentEngagement.id,
      clientName: currentEngagement.clientName,
      leadAuditor,
      executiveSummary,
      scopeSummary: `Subnet: ${currentEngagement.scope.authorizedSubnet} | Authorized Domains: ${currentEngagement.scope.authorizedDomains.join(', ')}`,
      methodology: 'PTES (Penetration Testing Execution Standard) & OWASP Testing Framework',
      findings: securityFindings,
      riskMatrix: { critical: criticalCount, high: highCount, medium: mediumCount, low: lowCount, info: infoCount },
      overallPosture: posture,
      remediationRoadmap: [
        {
          phase: 'Immediate (24-48 Hours)',
          actions: securityFindings.filter(f => f.severity === 'HIGH' || f.severity === 'CRITICAL').map(f => f.remediation.split('\n')[0] || f.title),
          timeframe: '48 Hours'
        },
        {
          phase: 'Medium Term (1-4 Weeks)',
          actions: ['Implement centralized SIEM telemetry', 'Conduct automated regression testing'],
          timeframe: '30 Days'
        }
      ],
      score: 94,
      amanEvaluation: 'The assessment report exhibits exceptional technical rigor, valid evidence citations, accurate CVSS calculations, and defense-in-depth remediation roadmaps.'
    });

    setActiveTab('report');
  };

  const copyMarkdownReport = () => {
    const md = `
# AUTHORIZED PENETRATION TEST & SECURITY ASSESSMENT REPORT
**Client**: ${currentEngagement.clientName} (${currentEngagement.industry})
**Engagement**: ${currentEngagement.engagementTitle}
**Lead Security Specialist**: ${leadAuditor}
**Date**: ${new Date().toISOString().split('T')[0]}
**Target Subnet**: ${currentEngagement.scope.authorizedSubnet}

---

## 1. Executive Summary
${executiveSummary}

## 2. Rules of Engagement & Target Scope
- Authorized Subnet: ${currentEngagement.scope.authorizedSubnet}
- Authorized Domains: ${currentEngagement.scope.authorizedDomains.join(', ')}
- Threat Model: ${currentEngagement.threatModel}

## 3. Discovered Security Findings Matrix
${securityFindings.map((f, i) => `
### Finding ${i + 1}: ${f.title}
- **Severity**: ${f.severity} (CVSS ${f.cvssScore})
- **Affected Asset**: ${f.affectedAsset} (${f.affectedComponent})
- **CWE / Category**: ${f.cweId} | ${f.owaspCategory}
- **Retest Status**: ${f.retestStatus}
- **Evidence Attached**: ${f.evidenceIds.join(', ')}

**Description & Technical Proof:**
${f.description}

**Remediation Recommendation:**
${f.remediation}
`).join('\n---\n')}

---
*Report generated via MY CYBER LAB — Authorized Client Engagement (ACE) Career Simulator*
    `.trim();

    navigator.clipboard.writeText(md);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      
      {/* Top Header & Ethical Engagement Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> AUTHORIZED CLIENT ENGAGEMENT (ACE) MODE
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" /> LIVE SIMULATED CLIENT RANGE
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
                <Award className="w-3 h-3 text-indigo-400" /> READINESS: {readiness.readinessBand.replace(/_/g, ' ')} ({readiness.overallScore}%)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{currentEngagement.logoEmoji}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  {currentEngagement.clientName}
                </h1>
                <p className="text-sm font-sans text-slate-300">
                  {currentEngagement.engagementTitle} — <span className="text-cyan-400 font-mono">{currentEngagement.industry}</span>
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
              {currentEngagement.threatModel}
            </p>
          </div>

          {/* Quick Client Switcher */}
          <div className="w-full lg:w-auto bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3 min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>SELECT CLIENT:</span>
              <span className="text-amber-400">{currentEngagement.difficulty}</span>
            </div>
            <select
              value={currentEngagement.id}
              onChange={(e) => setActiveEngagementId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-500 font-sans cursor-pointer"
            >
              {AUTHORIZED_CLIENT_ENGAGEMENTS.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.logoEmoji} {client.clientName} ({client.difficulty})
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-400">
              <span>ESTIMATED TIME:</span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {currentEngagement.estimatedMinutes} Mins
              </span>
            </div>
          </div>
        </div>

        {/* Rules of Engagement Pill Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Globe className="w-3.5 h-3.5" /> Scope Subnet: <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded">{currentEngagement.scope.authorizedSubnet}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Server className="w-3.5 h-3.5" /> In-Scope Assets: <span className="text-white font-bold">{currentEngagement.scope.authorizedAssets.length} Hosts</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Lock className="w-3.5 h-3.5" /> Prohibited: <span className="text-slate-300">Production billing / out-of-scope subnets</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400 ml-auto">
            <Award className="w-3.5 h-3.5" /> Reward: <span className="text-purple-300 font-bold">+{currentEngagement.xpReward} XP</span>
          </div>
        </div>
      </div>

      {/* Navigation Workspace Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'scope', label: 'Target Scope & Topology', icon: Globe, count: currentEngagement.scope.authorizedAssets.length },
          { id: 'terminal', label: 'Recon Terminal', icon: Terminal },
          { id: 'evidence', label: 'Evidence Locker', icon: FolderGit2, count: evidenceLocker.length },
          { id: 'findings', label: 'Finding Matrix', icon: ShieldAlert, count: securityFindings.length },
          { id: 'retest', label: 'Remediation Retest', icon: RefreshCw },
          { id: 'report', label: 'Executive Report', icon: FileText },
          { id: 'readiness', label: 'Job Readiness Radar', icon: Cpu, badge: `${readiness.overallScore}%` }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/50' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TARGET SCOPE & NETWORK TOPOLOGY HUD */}
      {/* ========================================================================= */}
      {activeTab === 'scope' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentEngagement.scope.authorizedAssets.map((asset) => (
              <div 
                key={asset.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl transition-all space-y-4 shadow-lg group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-mono font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                        {asset.name}
                      </h3>
                    </div>
                    <p className="text-xs font-mono text-cyan-400 font-semibold mt-0.5">{asset.ip}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>

                <div className="space-y-2 text-xs font-sans text-slate-300 border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Role:</span>
                    <span className="font-medium text-slate-200">{asset.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">OS:</span>
                    <span className="font-mono text-slate-200">{asset.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Environment:</span>
                    <span className="text-indigo-300 font-mono text-[11px]">{asset.environment}</span>
                  </div>
                </div>

                {/* Open Ports List */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-[11px] font-mono font-bold text-slate-400">SERVICES & OPEN PORTS:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.services.map((svc) => (
                      <span 
                        key={svc.port}
                        className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {svc.port}/tcp ({svc.name})
                      </span>
                    ))}
                  </div>
                </div>

                {asset.vulnerabilityHint && (
                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-sans flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <span><strong className="font-mono font-semibold text-amber-200">Recon Hint:</strong> {asset.vulnerabilityHint}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Engagement Objectives Checklist */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-mono font-bold text-white text-lg">Engagement Objectives & Milestones</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {currentEngagement.objectives.filter(o => o.completed).length} / {currentEngagement.objectives.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {currentEngagement.objectives.map((obj, i) => (
                <div 
                  key={obj.id}
                  className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-mono font-bold text-white text-sm">{obj.title}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                          {obj.category}
                        </span>
                        {obj.evidenceRequired && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-500/30">
                            Evidence Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-sans">{obj.description}</p>
                      {obj.hint && (
                        <p className="text-[11px] font-mono text-slate-400 italic">Hint: {obj.hint}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-cyan-400 text-sm">+{obj.points} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INTERACTIVE RECON & ENUMERATION TERMINAL */}
      {/* ========================================================================= */}
      {activeTab === 'terminal' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 font-mono text-xs shadow-2xl space-y-4">
            
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-400 text-xs ml-2 font-bold font-mono">
                  audit-station@mycyberlab: ~ (Scope: {currentEngagement.scope.authorizedSubnet})
                </span>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">
                Authorized Sandbox Mode
              </span>
            </div>

            {/* Terminal Output Area */}
            <div className="min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 custom-scrollbar text-slate-200">
              {terminalLogs.map((log, index) => (
                <div key={index} className="space-y-1.5 border-b border-slate-900/60 pb-3">
                  <div className="flex items-center justify-between text-cyan-400 font-bold">
                    <span>student@auditor:~$ {log.cmd}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                      <button
                        onClick={() => handlePreserveOutputAsEvidence(log)}
                        className="px-2 py-0.5 rounded bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                        title="Preserve into Forensic Evidence Locker"
                      >
                        <FolderGit2 className="w-3 h-3" /> Preserve Evidence
                      </button>
                    </div>
                  </div>
                  <pre className="text-slate-300 whitespace-pre-wrap font-mono leading-relaxed text-[11px] bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                    {log.output}
                  </pre>
                </div>
              ))}

              {isExecutingCmd && (
                <div className="text-amber-400 flex items-center gap-2 font-mono text-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Executing network command within authorized scope...
                </div>
              )}
            </div>

            {/* Command Input Form */}
            <form onSubmit={handleExecuteCommand} className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-emerald-400 font-bold font-mono">audit@range:~$</span>
              <input
                type="text"
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                placeholder="e.g. nmap -sV 10.50.0.25, redis-cli -h 10.50.0.25 -p 6379 INFO, curl -i 10.50.0.10:8080/swagger.json, help"
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
              <button
                type="submit"
                disabled={isExecutingCmd}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-mono font-bold rounded-xl text-xs transition-colors"
              >
                Execute
              </button>
            </form>
          </div>

          {/* Quick-Action Command Palette */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2">QUICK SCAN SHORTCUTS:</span>
            {[
              `nmap -sn ${currentEngagement.scope.authorizedSubnet}`,
              `nmap -sV -p- 10.50.0.25`,
              `redis-cli -h 10.50.0.25 -p 6379 INFO`,
              `curl -i http://10.50.0.10:8080/metrics/env`,
              `find / -perm -4000 2>/dev/null`,
              `GetUserSPNs.py VERTEX.LOCAL/svc_mssql`
            ].map((shortcut, i) => (
              <button
                key={i}
                onClick={() => setTerminalCommand(shortcut)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-cyan-300 font-mono text-[11px] rounded-lg transition-colors"
              >
                {shortcut}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FORENSIC EVIDENCE LOCKER */}
      {/* ========================================================================= */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-mono font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-purple-400" /> Forensic Evidence Locker
              </h2>
              <p className="text-xs font-sans text-slate-400">
                Preserved command outputs, HTTP payloads, and technical artifacts proving security findings.
              </p>
            </div>

            <button
              onClick={() => setIsAddingEvidence(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors self-start"
            >
              <Plus className="w-4 h-4" /> Add Evidence Artifact
            </button>
          </div>

          {/* Modal / Form to add evidence */}
          {isAddingEvidence && (
            <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-mono font-bold text-purple-300 text-sm">Create New Evidence Item</h3>
                <button onClick={() => setIsAddingEvidence(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateEvidenceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Target Asset IP</label>
                    <input
                      type="text"
                      value={newEvidence.assetIp}
                      onChange={(e) => setNewEvidence({ ...newEvidence, assetIp: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl text-xs font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Evidence Type</label>
                    <select
                      value={newEvidence.type}
                      onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl text-xs font-mono"
                    >
                      <option value="COMMAND_OUTPUT">COMMAND_OUTPUT</option>
                      <option value="HTTP_RESPONSE">HTTP_RESPONSE</option>
                      <option value="SERVICE_BANNER">SERVICE_BANNER</option>
                      <option value="LOG_ENTRY">LOG_ENTRY</option>
                      <option value="VULN_PROOF">VULN_PROOF</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
                    <input
                      type="text"
                      value={newEvidence.description}
                      onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                      placeholder="e.g. Unauthenticated Redis INFO response"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl text-xs font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Raw Output Payload / Log</label>
                  <textarea
                    rows={4}
                    value={newEvidence.rawContent}
                    onChange={(e) => setNewEvidence({ ...newEvidence, rawContent: e.target.value })}
                    placeholder="Paste exact output here..."
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-3 rounded-xl text-xs font-mono custom-scrollbar"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Analyst Notes & Context</label>
                  <input
                    type="text"
                    value={newEvidence.analystNote}
                    onChange={(e) => setNewEvidence({ ...newEvidence, analystNote: e.target.value })}
                    placeholder="Explain why this constitutes technical proof..."
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl text-xs font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingEvidence(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold rounded-xl text-xs"
                  >
                    Save Evidence (+40 XP)
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidenceLocker.map((item) => {
              const integrity = verifyEvidenceIntegrity(item);
              const isCurrentEngagement = item.engagementId === currentEngagement.id;

              return (
                <div 
                  key={item.id}
                  className={`bg-slate-900/90 border p-5 rounded-2xl space-y-3 transition-all shadow-lg ${
                    isCurrentEngagement ? 'border-slate-800 hover:border-purple-500/40' : 'border-slate-800/60 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
                        {item.id}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{item.timestamp}</span>
                      {integrity.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> INTEGRITY VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-mono">
                          <AlertTriangle className="w-3 h-3 text-rose-400" /> HASH MISMATCH
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => deleteEvidence(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Delete evidence"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-mono font-bold text-white text-sm">{item.description}</h4>
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mt-0.5">
                      <span>Asset: {item.assetIp} ({item.type})</span>
                      <span className="text-slate-400 text-[11px]">Client: {item.engagementId}</span>
                    </div>
                  </div>

                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-slate-300 font-mono text-[11px] max-h-36 overflow-y-auto custom-scrollbar">
                    {item.rawContent}
                  </pre>

                  <div className="pt-1 flex flex-col gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
                    <div className="flex items-center justify-between truncate">
                      <span className="text-purple-300 font-bold">DIGEST:</span>
                      <span className="text-slate-400 select-all truncate max-w-[260px]">{item.integrityHash || integrity.computedHash}</span>
                    </div>
                    {item.analystNote && (
                      <p className="text-xs font-sans text-slate-300 pt-1 border-t border-slate-800/50">
                        <strong className="text-purple-300 font-mono">Analyst Note:</strong> {item.analystNote}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FINDING MATRIX & PROFESSIONAL BUILDER */}
      {/* ========================================================================= */}
      {activeTab === 'findings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-mono font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" /> Discovered Security Findings Matrix
              </h2>
              <p className="text-xs font-sans text-slate-400">
                Formal vulnerability findings linked directly to verified forensic evidence artifacts.
              </p>
            </div>

            <button
              onClick={() => setIsAddingFinding(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors self-start"
            >
              <Plus className="w-4 h-4" /> Author New Finding
            </button>
          </div>

          {/* New Finding Creator Form */}
          {isAddingFinding && (
            <div className="bg-slate-900 border border-rose-500/40 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-mono font-bold text-rose-300 text-sm">Author Security Finding (PTES Standard)</h3>
                <button onClick={() => setIsAddingFinding(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateFindingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-slate-300 mb-1">Finding Title</label>
                    <input
                      type="text"
                      value={newFinding.title}
                      onChange={(e) => setNewFinding({ ...newFinding, title: e.target.value })}
                      placeholder="e.g. Unauthenticated Redis Key-Value Store Accessible on Staging Subnet"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl text-xs font-sans"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Severity & CVSS Score</label>
                    <div className="flex gap-2">
                      <select
                        value={newFinding.severity}
                        onChange={(e) => setNewFinding({ ...newFinding, severity: e.target.value as any })}
                        className="bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl text-xs font-mono flex-1"
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                        <option value="INFORMATIONAL">INFO</option>
                      </select>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={newFinding.cvssScore}
                        onChange={(e) => setNewFinding({ ...newFinding, cvssScore: parseFloat(e.target.value) })}
                        className="w-20 bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Affected Asset & Port</label>
                    <input
                      type="text"
                      value={newFinding.affectedAsset}
                      onChange={(e) => setNewFinding({ ...newFinding, affectedAsset: e.target.value })}
                      placeholder="ns-db-staging.internal (10.50.0.25:6379)"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl text-xs font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">CWE / OWASP Classification</label>
                    <input
                      type="text"
                      value={newFinding.cweId}
                      onChange={(e) => setNewFinding({ ...newFinding, cweId: e.target.value })}
                      placeholder="CWE-306 / OWASP A01:2021"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Vulnerability Description & Attack Narrative</label>
                  <textarea
                    rows={3}
                    value={newFinding.description}
                    onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
                    placeholder="Describe how the flaw was identified and how an attacker can leverage it..."
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-3 rounded-xl text-xs font-sans custom-scrollbar"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Actionable Remediation Roadmap</label>
                  <textarea
                    rows={2}
                    value={newFinding.remediation}
                    onChange={(e) => setNewFinding({ ...newFinding, remediation: e.target.value })}
                    placeholder="1. Configure bind 127.0.0.1\n2. Set strong requirepass password..."
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-3 rounded-xl text-xs font-sans custom-scrollbar"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingFinding(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold rounded-xl text-xs"
                  >
                    Publish Finding (+120 XP)
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Finding Cards */}
          <div className="space-y-4">
            {securityFindings.map((finding) => {
              const severityColor = 
                finding.severity === 'CRITICAL' ? 'text-purple-400 bg-purple-950 border-purple-500/50' :
                finding.severity === 'HIGH' ? 'text-rose-400 bg-rose-950 border-rose-500/50' :
                finding.severity === 'MEDIUM' ? 'text-amber-400 bg-amber-950 border-amber-500/50' :
                'text-cyan-400 bg-cyan-950 border-cyan-500/50';

              return (
                <div 
                  key={finding.id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-slate-400">{finding.id}</span>
                      <h3 className="font-mono font-bold text-white text-base">{finding.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-xs font-bold border ${severityColor}`}>
                        {finding.severity} (CVSS {finding.cvssScore})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        finding.retestStatus === 'RETEST_VERIFIED_CLOSED' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {finding.retestStatus === 'RETEST_VERIFIED_CLOSED' ? '✓ RETEST VERIFIED CLOSED' : '⏳ PENDING RETEST'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
                    <div>
                      <span className="text-slate-400">Affected Asset:</span>
                      <p className="text-white font-semibold">{finding.affectedAsset}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">CWE / Category:</span>
                      <p className="text-cyan-300">{finding.cweId}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Evidence Citing:</span>
                      <p className="text-purple-300 font-bold">{finding.evidenceIds.join(', ') || 'EVID-001'}</p>
                    </div>
                  </div>

                  <p className="text-xs font-sans text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {finding.description}
                  </p>

                  <div className="space-y-1 text-xs">
                    <span className="font-mono font-bold text-emerald-400">Remediation Guidance:</span>
                    <pre className="text-slate-300 font-sans whitespace-pre-wrap bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl">
                      {finding.remediation}
                    </pre>
                  </div>

                  {/* AMAN Technical Feedback */}
                  {finding.amanReviewFeedback && (
                    <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AMAN Quality Score: {finding.amanReviewFeedback.score}/100
                      </div>
                      <p className="text-slate-300 font-sans">{finding.amanReviewFeedback.critique}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: REMEDIATION VERIFICATION & RETEST SANDBOX */}
      {/* ========================================================================= */}
      {activeTab === 'retest' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-xl font-mono font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-400" /> Remediation Verification & Retest Engine
            </h2>
            <p className="text-xs font-sans text-slate-300 max-w-3xl">
              Ethical hacking is not complete until remediation is verified. Select an open finding, apply the client hardening patch in the training sandbox, and verify that the vulnerability is closed.
            </p>

            <div className="space-y-4 pt-2">
              {securityFindings.map((finding) => (
                <div 
                  key={finding.id}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-400">{finding.id}</span>
                      <h4 className="font-mono font-bold text-white text-sm">{finding.title}</h4>
                    </div>
                    <p className="text-xs font-mono text-slate-400">{finding.affectedAsset} — {finding.retestStatus}</p>
                    {finding.retestNotes && (
                      <p className="text-[11px] font-sans text-emerald-300 mt-1">{finding.retestNotes}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRunRetest(finding)}
                    disabled={isRetesting || finding.retestStatus === 'RETEST_VERIFIED_CLOSED'}
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-colors shrink-0 ${
                      finding.retestStatus === 'RETEST_VERIFIED_CLOSED'
                        ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {finding.retestStatus === 'RETEST_VERIFIED_CLOSED' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Verified Closed
                      </>
                    ) : (
                      <>
                        <RefreshCw className={`w-4 h-4 ${isRetesting ? 'animate-spin' : ''}`} /> Apply Patch & Retest
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {retestResult && (
              <div className={`p-4 rounded-xl font-mono text-xs border ${
                retestResult.success ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
              }`}>
                {retestResult.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: EXECUTIVE REPORT PUBLISHER */}
      {/* ========================================================================= */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-mono font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Executive Security Assessment Report
              </h2>
              <p className="text-xs font-sans text-slate-400">
                Board-level deliverable compiling scope, risk posture, evidence proofs, and remediation roadmaps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdownReport}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedReport ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedReport ? 'Copied Markdown!' : 'Copy Markdown'}
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print / PDF
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
            {/* Report Header */}
            <div className="border-b border-slate-800 pb-6 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    CONFIDENTIAL SECURITY ASSESSMENT
                  </span>
                  <h1 className="text-2xl font-mono font-bold text-white mt-1">
                    {currentEngagement.clientName} — Penetration Testing Report
                  </h1>
                </div>
                <div className="text-right font-mono text-xs text-slate-400">
                  <p>Date: {new Date().toISOString().split('T')[0]}</p>
                  <p>Lead Auditor: <span className="text-white font-bold">{leadAuditor}</span></p>
                </div>
              </div>
            </div>

            {/* Risk Posture Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'CRITICAL', count: securityFindings.filter(f => f.severity === 'CRITICAL').length, color: 'text-purple-400 bg-purple-950/40 border-purple-500/30' },
                { label: 'HIGH', count: securityFindings.filter(f => f.severity === 'HIGH').length, color: 'text-rose-400 bg-rose-950/40 border-rose-500/30' },
                { label: 'MEDIUM', count: securityFindings.filter(f => f.severity === 'MEDIUM').length, color: 'text-amber-400 bg-amber-950/40 border-amber-500/30' },
                { label: 'LOW', count: securityFindings.filter(f => f.severity === 'LOW').length, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' },
                { label: 'INFO', count: securityFindings.filter(f => f.severity === 'INFORMATIONAL').length, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30' }
              ].map((item) => (
                <div key={item.label} className={`p-3 rounded-xl border text-center font-mono ${item.color}`}>
                  <p className="text-[10px] font-bold text-slate-400">{item.label}</p>
                  <p className="text-xl font-bold mt-1">{item.count}</p>
                </div>
              ))}
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="font-mono font-bold text-white text-sm uppercase">1. Executive Summary</h3>
              <p className="text-xs font-sans text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {executiveSummary}
              </p>
            </div>

            {/* In-Scope Methodology */}
            <div className="space-y-2">
              <h3 className="font-mono font-bold text-white text-sm uppercase">2. Scope & Target Boundaries</h3>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <p>• Authorized Subnet: {currentEngagement.scope.authorizedSubnet}</p>
                <p>• Target Domains: {currentEngagement.scope.authorizedDomains.join(', ')}</p>
                <p>• Threat Actor Model: {currentEngagement.threatModel}</p>
              </div>
            </div>

            {/* Findings Summary Table */}
            <div className="space-y-2">
              <h3 className="font-mono font-bold text-white text-sm uppercase">3. Detailed Security Findings</h3>
              <div className="space-y-3">
                {securityFindings.map((finding, idx) => (
                  <div key={finding.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-white">#{idx + 1} {finding.title}</span>
                      <span className="text-rose-400 font-bold">{finding.severity} (CVSS {finding.cvssScore})</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300">{finding.description}</p>
                    <p className="text-xs font-mono text-emerald-400">Remediation: {finding.remediation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handlePublishReport}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Finalize & Submit to AMAN Reviewer (+300 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: JOB READINESS RADAR & DOMAIN BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'readiness' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                  PROFESSIONAL COMPETENCY RADAR
                </span>
                <h2 className="text-2xl font-mono font-bold text-white mt-1">
                  Ethical Hacker Job Readiness Index
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-mono font-bold text-cyan-400">{readiness.overallScore}%</span>
                <p className="text-xs font-mono text-emerald-400 font-bold">{readiness.readinessBand.replace(/_/g, ' ')}</p>
              </div>
            </div>

            {/* 8 Core Domain Score Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Networking & TCP/IP Diagnostics', score: readiness.networking, desc: 'Subnetting, packet analysis, Wireshark, routing' },
                { label: 'Linux OS & Privilege Architecture', score: readiness.linux, desc: 'SUID auditing, bash internals, permissions, cron' },
                { label: 'Web Application Security (OWASP Top 10)', score: readiness.webSecurity, desc: 'SQLi, XSS, BOLA/IDOR, JWT manipulation' },
                { label: 'Reconnaissance & Asset Discovery', score: readiness.reconnaissance, desc: 'Active ping sweeps, OSINT, foot printing' },
                { label: 'Service & Banner Enumeration', score: readiness.enumeration, desc: 'Version mapping, directory fuzzing, port sweeps' },
                { label: 'Vulnerability Analysis & Exploitation Proof', score: readiness.vulnerabilityAnalysis, desc: 'CVSS calculation, SUID escalation, proof capture' },
                { label: 'Technical Reporting & Deliverables', score: readiness.reporting, desc: 'Audit-ready writeups, risk attribution, remediation' },
                { label: 'Ethics & Rules of Engagement', score: readiness.ethicsAndScope, desc: 'Scope discipline, non-destructive testing, compliance' }
              ].map((domain) => (
                <div key={domain.label} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-white">{domain.label}</span>
                    <span className="font-bold text-cyan-400">{domain.score}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${domain.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-sans text-slate-400">{domain.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
