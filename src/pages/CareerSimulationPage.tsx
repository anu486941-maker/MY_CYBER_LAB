import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getCareerRoleById } from '../data/careerRolesData';
import { CareerReadinessService, CareerReadinessReport } from '../services/careerReadinessService';
import { computeEvidenceHash } from '../utils/evidenceIntegrity';
import { validateAceCommandScope } from '../utils/aceScopePolicy';
import {
  Briefcase,
  Terminal as TerminalIcon,
  CheckCircle2,
  FileText,
  Activity,
  ExternalLink,
  FolderGit2,
  Sparkles,
  Radio,
  Zap,
  TrendingUp,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Simulation Scenario Interfaces
export interface SimulationPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  hint: string;
  targetIpOrAsset: string;
  suggestedCommand: string;
  expectedOutput: string;
  evidenceSnippet?: string;
  mitreTechnique?: string;
  cweCategory?: string;
  xpReward: number;
}

export interface CareerSimulation {
  id: string;
  roleId: string;
  title: string;
  subtitle: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  targetOrg: string;
  scenarioType: 'PENTEST' | 'SIEM_TRIAGE' | 'HARDENING' | 'FORENSICS';
  description: string;
  phases: SimulationPhase[];
}

// Built-in Career Job Simulations
export const CAREER_JOB_SIMULATIONS: CareerSimulation[] = [
  {
    id: 'sim-eth-01',
    roleId: 'ethical-hacker',
    title: 'FinVault Core Banking System Penetration Test',
    subtitle: 'Authorized Black-Box Penetration Testing Campaign',
    difficulty: 'INTERMEDIATE',
    targetOrg: 'FinVault International (Internal Staging)',
    scenarioType: 'PENTEST',
    description: 'Execute an authorized offensive security engagement against FinVault staging infrastructure (10.50.20.0/24). Identify web vulnerabilities, escalate privileges, extract PoC evidence, and author a CVSS 3.1 executive pentest report.',
    phases: [
      {
        id: 'eth-phase-1',
        phaseNumber: 1,
        title: 'Rules of Engagement & Perimeter Reconnaissance',
        description: 'Audit the scope policy and execute nmap host discovery against authorized target 10.50.20.100.',
        hint: 'Use nmap to discover running services and port numbers on 10.50.20.100.',
        targetIpOrAsset: '10.50.20.100',
        suggestedCommand: 'nmap -sV -sC 10.50.20.100',
        expectedOutput: `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for finvault-api.internal (10.50.20.100)\nHost is up (0.0015s latency).\nPORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu\n80/tcp   open  http    nginx 1.18.0\n8080/tcp open  http    Node.js Express Diagnostic API\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`,
        evidenceSnippet: 'Nmap discovery output: Node.js Express Diagnostic API listening on TCP 8080.',
        xpReward: 50
      },
      {
        id: 'eth-phase-2',
        phaseNumber: 2,
        title: 'Unauthenticated Command Injection PoC',
        description: 'Inspect the HTTP API on port 8080. Test input parameters for shell command injection vulnerability.',
        hint: 'Send a HTTP request with concatenated shell operators like ; id or && cat /etc/passwd.',
        targetIpOrAsset: 'http://10.50.20.100:8080/api/v1/diagnostics',
        suggestedCommand: 'curl -X POST http://10.50.20.100:8080/api/v1/diagnostics -d "ping=127.0.0.1; id; cat /etc/passwd"',
        expectedOutput: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "status": "success",\n  "raw": "PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.032 ms\\n\\nuid=1001(finvault-svc) gid=1001(finvault-svc) groups=1001(finvault-svc)\\nroot:x:0:0:root:/root:/bin/bash\\nfinvault-svc:x:1001:1001::/home/finvault-svc:/bin/bash"\n}`,
        evidenceSnippet: 'POST /api/v1/diagnostics payload "ping=127.0.0.1; id" returned uid=1001(finvault-svc). CWE-78 Command Injection confirmed.',
        cweCategory: 'CWE-78: Improper Neutralization of Special Elements used in an OS Command',
        xpReward: 100
      },
      {
        id: 'eth-phase-3',
        phaseNumber: 3,
        title: 'Local SUID & Cron Privilege Escalation',
        description: 'Audit system privileges and root-owned maintenance scripts to elevate from finvault-svc to root.',
        hint: 'Inspect /etc/crontab or check SUID binaries in /usr/local/bin.',
        targetIpOrAsset: '10.50.20.100 (/etc/crontab)',
        suggestedCommand: 'cat /etc/crontab',
        expectedOutput: `# /etc/crontab - system-wide crontab\n* * * * * root /usr/local/bin/cleanup_vault.sh\n# World-writable file /usr/local/bin/cleanup_vault.sh identified!\nExecuting privilege escalation payload...\nroot@finvault-api:~# id\nuid=0(root) gid=0(root) groups=0(root)\nFLAG{FINVAULT_ROOT_PRIV_ESCALATION_SUCCESS}`,
        evidenceSnippet: 'Root privilege escalation unlocked via world-writable cron script /usr/local/bin/cleanup_vault.sh. Obtained root flag.',
        xpReward: 120
      },
      {
        id: 'eth-phase-4',
        phaseNumber: 4,
        title: 'CVSS 3.1 Risk Scoring & Remediation Proposal',
        description: 'Calculate the CVSS 3.1 vector metric for unauthenticated command injection and propose actionable defensive remediation.',
        hint: 'Command Injection via network without credentials results in CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Score: 9.8 Critical).',
        targetIpOrAsset: 'CVSS 3.1 Scoring Engine',
        suggestedCommand: 'cvss-score --vector CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        expectedOutput: `CVSS v3.1 Base Score: 9.8 (CRITICAL)\nVector String: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H\nImpact Subscore: 5.9\nExploitability Subscore: 3.9\n\nRemediation Guidance:\n1. Replace shell execution calls with safe array-parameterized APIs.\n2. Sanitize and validate all user inputs using strict IPv4 regex whitelist.\n3. Remove world-writable permissions on root cron scripts.`,
        evidenceSnippet: 'CVSS 3.1 Score: 9.8 CRITICAL. Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        xpReward: 80
      }
    ]
  },
  {
    id: 'sim-soc-01',
    roleId: 'soc-analyst',
    title: 'Operation ShadowLurk: Enterprise SIEM Alert Triage & Incident Response',
    subtitle: 'Live Tier-1 SOC Incident Handling & Threat Containment',
    difficulty: 'INTERMEDIATE',
    targetOrg: 'Aegis Defense Systems (SOC Operations)',
    scenarioType: 'SIEM_TRIAGE',
    description: 'Monitor live SIEM telemetry, investigate high-severity alerts, distinguish true positives from false positives, isolate compromised assets, block malicious IOCs, and publish an incident response debrief report.',
    phases: [
      {
        id: 'soc-phase-1',
        phaseNumber: 1,
        title: 'SIEM Log Ingestion & Alert Stream Triage',
        description: 'Examine incoming SIEM alert logs from host 10.100.4.12. Identify anomalous authentication spikes.',
        hint: 'Use soc-triage command to query the active SIEM queue.',
        targetIpOrAsset: '10.100.4.12 (Aegis Workstation WS-0412)',
        suggestedCommand: 'soc-triage --queue active --host 10.100.4.12',
        expectedOutput: `[SIEM ALERT SOC-2026-881] SEVERITY: HIGH | EVENT: Failed SSH Brute Force (542 attempts in 60s)\n  Source IP: 185.220.101.5 (Known Tor Exit Node)\n  Target Account: j.doe@aegis.corp\n  Timestamp: 2026-08-29 09:14:02 UTC\n[SIEM ALERT SOC-2026-882] SEVERITY: CRITICAL | EVENT: Encoded PowerShell Command Execution\n  Parent Process: cmd.exe (PID 4102)\n  Command: powershell.exe -e aQBlAHgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQ...`,
        evidenceSnippet: 'SIEM Alert SOC-2026-881 & 882: 542 SSH failed logins followed by encoded PowerShell payload execution from 185.220.101.5.',
        mitreTechnique: 'T1110.001 Brute Force / T1059.001 PowerShell',
        xpReward: 60
      },
      {
        id: 'soc-phase-2',
        phaseNumber: 2,
        title: 'Log Correlation & True Positive Verification',
        description: 'Correlate auth.log entries with network connection records to confirm compromise and extract IOCs.',
        hint: 'Inspect the auth.log file on the target server.',
        targetIpOrAsset: 'auth.log / 185.220.101.5',
        suggestedCommand: 'grep "Accepted password for j.doe" /var/log/auth.log',
        expectedOutput: `Aug 29 09:15:01 aegis-ws0412 sshd[12401]: Accepted password for j.doe from 185.220.101.5 port 49152 ssh2\nAug 29 09:15:04 aegis-ws0412 systemd[1]: Started User Manager for UID 1004.\nAug 29 09:15:10 aegis-ws0412 curl[12455]: Downloaded file malicious_stage2.elf (SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)\n\nVERDICT: TRUE POSITIVE INCIDENT CONFIRMED. Account j.doe compromised.`,
        evidenceSnippet: 'auth.log correlation: Successful SSH login for j.doe from 185.220.101.5 followed by malware payload staging.',
        mitreTechnique: 'T1078.003 Valid Accounts / T1105 Ingress Tool Transfer',
        xpReward: 90
      },
      {
        id: 'soc-phase-3',
        phaseNumber: 3,
        title: 'Active Incident Containment Execution',
        description: 'Execute active containment procedures: isolate host 10.100.4.12, block source IP on perimeter firewall, and revoke user credentials.',
        hint: 'Run isolate-host, block-ip, and revoke-user commands to contain the threat.',
        targetIpOrAsset: '10.100.4.12 / 185.220.101.5',
        suggestedCommand: 'isolate-host 10.100.4.12 && block-ip 185.220.101.5 && revoke-user j.doe',
        expectedOutput: `[CONTAINMENT STATUS]\n1. Host 10.100.4.12 network interface isolated. Active TCP connections terminated.\n2. Perimeter Firewall Rule #9941 deployed: Drop all packets from 185.220.101.5/32.\n3. Active Active Directory session for j.doe terminated. Account disabled.\n\nRESULT: Threat successfully contained within 4.2 minutes of detection.`,
        evidenceSnippet: 'Active containment executed: Host 10.100.4.12 isolated, IP 185.220.101.5 blocked, user j.doe disabled.',
        xpReward: 110
      },
      {
        id: 'soc-phase-4',
        phaseNumber: 4,
        title: 'Incident Timeline & Forensic Report Compilation',
        description: 'Compile a structured Incident Response debrief report mapping findings to MITRE ATT&CK framework.',
        hint: 'Summarize the root cause, containment actions, and long-term detection enhancements.',
        targetIpOrAsset: 'Incident Response Reporting Engine',
        suggestedCommand: 'generate-ir-report --incident SOC-2026-881 --format markdown',
        expectedOutput: `# INCIDENT RESPONSE DEBRIEF REPORT: OPERATION SHADOWLURK\n**Incident ID**: SOC-2026-881\n**Severity**: HIGH | **Status**: CONTAINED & RESOLVED\n\n## Summary\nAn external attacker from 185.220.101.5 executed an automated SSH brute force attack, compromising user account j.doe. SOC analysts detected anomalous telemetry, verified true positive status, and contained the host within 4.2 minutes.\n\n## MITRE ATT&CK Mapping\n- T1110.001: Password Guessing\n- T1078: Valid Accounts\n- T1059.001: PowerShell Execution\n\n## Recommendations\n1. Enforce Mandatory Multi-Factor Authentication (MFA) on SSH endpoints.\n2. Implement fail2ban rate limiting on SSH gateways.`,
        evidenceSnippet: 'Incident Report SOC-2026-881 compiled with full timeline and MITRE ATT&CK mappings.',
        xpReward: 90
      }
    ]
  }
];

export const CareerSimulationPage: React.FC = () => {
  const {
    profile,
    addXp,
    evidenceLocker,
    addEvidence,
    addFinding,
    saveEngagementReport,
    skillMasteries,
    mistakes,
    completedMissions,
    engagementReports,
    securityFindings,
    updateProfile
  } = useApp();

  const userRole = profile.selectedRole || profile.targetRole || 'ethical-hacker';
  const currentRoleInfo = getCareerRoleById(userRole);

  // Active Simulation Selection
  const [activeSimulationId, setActiveSimulationId] = useState<string>(() => {
    const matched = CAREER_JOB_SIMULATIONS.find(s => s.roleId === userRole);
    return matched ? matched.id : CAREER_JOB_SIMULATIONS[0].id;
  });

  const activeSimulation = useMemo(() => {
    return (
      CAREER_JOB_SIMULATIONS.find(s => s.id === activeSimulationId) ||
      CAREER_JOB_SIMULATIONS[0]
    );
  }, [activeSimulationId]);

  // Phase Execution State
  const [completedPhaseIds, setCompletedPhaseIds] = useState<string[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<{ text: string; type: 'cmd' | 'output' | 'system' | 'success' | 'err'; time: string }[]>([
    {
      text: `=========================================================================\n  MY CYBER LAB — CAREER SIMULATION & JOB READINESS ENGINE v5.0\n  Active Environment: ${activeSimulation.targetOrg}\n  Target Role: ${currentRoleInfo.title.toUpperCase()}\n  Type "help" or click "SUGGESTED COMMAND" to run phase tasks.\n=========================================================================`,
      type: 'system',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [evidenceCaptured, setEvidenceCaptured] = useState<boolean>(false);
  const [isReportSaved, setIsReportSaved] = useState<boolean>(false);
  const [isSimulationFinished, setIsSimulationFinished] = useState<boolean>(false);

  const activePhase = activeSimulation.phases[currentPhaseIndex] || activeSimulation.phases[0];

  // 9-Pillar Readiness Score Calculation
  const currentReadiness: CareerReadinessReport = useMemo(() => {
    return CareerReadinessService.calculateReadiness({
      profile,
      skillMasteries: skillMasteries || [],
      mistakes: mistakes || [],
      completedMissionsCount: (completedMissions?.length || 0) + (isSimulationFinished ? 1 : 0),
      evidenceCount: (evidenceLocker?.length || 0),
      reportsCount: (engagementReports?.length || 0) + (securityFindings?.length || 0) + (isReportSaved ? 1 : 0)
    });
  }, [profile, skillMasteries, mistakes, completedMissions, evidenceLocker, engagementReports, securityFindings, isSimulationFinished, isReportSaved]);

  // Handle Command Execution
  const handleExecuteCommand = (cmdToRun?: string) => {
    const command = (cmdToRun !== undefined ? cmdToRun : terminalInput).trim();
    if (!command) return;

    const timeStr = new Date().toLocaleTimeString();
    const newLogs = [...terminalLogs, { text: `> ${command}`, type: 'cmd' as const, time: timeStr }];

    if (command.toLowerCase() === 'help') {
      newLogs.push({
        text: `AVAILABLE SIMULATION COMMANDS:\n- ${activePhase.suggestedCommand}\n- help : Display this CLI guide\n- clear : Clear terminal logs\n- status : Check simulation phase progress`,
        type: 'system',
        time: timeStr
      });
      setTerminalLogs(newLogs);
      setTerminalInput('');
      return;
    }

    if (command.toLowerCase() === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    }

    // Check scope safety
    const scopeCheck = validateAceCommandScope(command, null);
    if (!scopeCheck.allowed) {
      newLogs.push({
        text: `[SCOPE POLICY VIOLATION] Command rejected: ${scopeCheck.reason}`,
        type: 'err',
        time: timeStr
      });
      setTerminalLogs(newLogs);
      setTerminalInput('');
      return;
    }

    // Execute simulated output
    if (
      command.toLowerCase().includes(activePhase.suggestedCommand.toLowerCase().slice(0, 10)) ||
      command.toLowerCase() === activePhase.suggestedCommand.toLowerCase() ||
      command.length > 5
    ) {
      newLogs.push({
        text: activePhase.expectedOutput,
        type: 'output',
        time: timeStr
      });

      // Mark phase as completed if not already
      if (!completedPhaseIds.includes(activePhase.id)) {
        const updatedCompleted = [...completedPhaseIds, activePhase.id];
        setCompletedPhaseIds(updatedCompleted);
        addXp(activePhase.xpReward, `Completed Simulation Phase: ${activePhase.title}`);

        newLogs.push({
          text: `🎉 PHASE ${activePhase.phaseNumber} COMPLETE! +${activePhase.xpReward} XP Awarded. Evidence unlocked.`,
          type: 'success',
          time: timeStr
        });

        // Check if all phases done
        if (updatedCompleted.length >= activeSimulation.phases.length) {
          setIsSimulationFinished(true);
        }
      }
    } else {
      newLogs.push({
        text: `Command executed. Target output: ${activePhase.expectedOutput.slice(0, 100)}...`,
        type: 'output',
        time: timeStr
      });
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  // Ingest Evidence to Locker
  const handleIngestEvidence = () => {
    if (!activePhase.evidenceSnippet) return;
    const rawContent = `[SIMULATION: ${activeSimulation.title}]\nPhase: ${activePhase.title}\nTarget: ${activePhase.targetIpOrAsset}\nCommand: ${activePhase.suggestedCommand}\n\nOutput:\n${activePhase.expectedOutput}`;
    const nowIso = new Date().toISOString();
    const hash = computeEvidenceHash(
      activeSimulation.id,
      activePhase.targetIpOrAsset,
      nowIso,
      rawContent
    );

    addEvidence({
      engagementId: activeSimulation.id,
      assetId: activePhase.targetIpOrAsset,
      assetIp: activePhase.targetIpOrAsset,
      type: activeSimulation.scenarioType === 'PENTEST' ? 'COMMAND_OUTPUT' : 'LOG_ENTRY',
      description: `${activeSimulation.title} — Phase ${activePhase.phaseNumber}: ${activePhase.evidenceSnippet || activePhase.title}`,
      rawContent,
      analystNote: `Ingested telemetry for phase ${activePhase.phaseNumber}`,
      verified: true,
      integrityHash: hash
    });

    setEvidenceCaptured(true);
    setTimeout(() => setEvidenceCaptured(false), 3000);
  };

  // Save Official Security Report to App Context & Portfolio
  const handleSaveReportToPortfolio = () => {
    saveEngagementReport({
      engagementId: activeSimulation.id,
      clientName: activeSimulation.targetOrg,
      leadAuditor: profile.name,
      executiveSummary: `This executive security report summarizes the job readiness simulation performed on ${activeSimulation.targetOrg}. All phases were completed successfully inside authorized sandboxed environments. Overall candidate readiness: ${currentReadiness.overallScore}% (${currentReadiness.careerReadinessTier.replace('_', ' ')}).`,
      scopeSummary: `Authorized testing inside isolated environment ${activeSimulation.targetOrg}`,
      methodology: 'NIST SP 800-115 / OWASP Testing Guide v4.2',
      findings: [],
      riskMatrix: { critical: 1, high: 1, medium: 0, low: 0, info: 0 },
      overallPosture: 'MODERATE',
      remediationRoadmap: [
        { phase: 'Immediate (24-48h)', actions: ['Patch identified vulnerabilities', 'Rotate API credentials'], timeframe: 'Immediate' }
      ],
      score: currentReadiness.overallScore
    });

    if (activeSimulation.scenarioType === 'PENTEST') {
      addFinding({
        engagementId: activeSimulation.id,
        title: `${activeSimulation.phases[1]?.title || 'Command Injection Finding'}`,
        severity: 'HIGH',
        cvssScore: 8.8,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        affectedAsset: activeSimulation.phases[1]?.targetIpOrAsset || '10.50.20.100',
        affectedComponent: 'API Gateway',
        cweId: 'CWE-78',
        owaspCategory: 'A03:2021-Injection',
        description: activeSimulation.phases[1]?.description || 'Unauthenticated remote execution vulnerability.',
        evidenceIds: [],
        impact: 'Unauthenticated OS Command Execution with service privileges.',
        likelihood: 'High',
        remediation: 'Sanitize input parameters and enforce strict regex whitelists.',
        references: ['https://cwe.mitre.org/data/definitions/78.html'],
        retestStatus: 'PENDING_REMEDIATION'
      });
    }

    setIsReportSaved(true);
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto animate-fadeIn">
      {/* =========================================================================
          TOP COMMAND HEADER & ROLE SELECTOR
          ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> CAREER SIMULATION & JOB READINESS ENGINE
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                TIER: {currentReadiness.careerReadinessTier.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-mono font-black text-slate-100 tracking-tight">
              Enterprise Job Simulations & Practical Proof
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Step into real-world cybersecurity roles inside authorized sandboxed environments. Complete technical workflows, gather SHA-256 evidence, compile employer-grade reports, and boost your 9-Pillar Readiness Index.
            </p>
          </div>

          {/* Overall Readiness Metric Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center shrink-0 min-w-[200px] text-center space-y-1">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">CAREER READINESS INDEX</div>
            <div className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300">
              {currentReadiness.overallScore}%
            </div>
            <div className="text-[11px] font-mono text-cyan-400 font-bold">
              {currentRoleInfo.title}
            </div>
            <Link
              to="/portfolio"
              className="mt-2 text-[10px] font-mono text-slate-400 hover:text-cyan-300 underline flex items-center gap-1"
            >
              View Verified Portfolio <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Role Switcher Ribbon */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400" /> TARGET CAREER ROLE:
          </span>
          {[
            { id: 'ethical-hacker', name: 'Ethical Hacker / Pentester', icon: '🎯' },
            { id: 'soc-analyst', name: 'SOC Analyst', icon: '🛡️' },
            { id: 'security-engineer', name: 'Security Engineer', icon: '⚡' },
            { id: 'incident-responder', name: 'Incident Responder', icon: '🔍' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => {
                updateProfile({ selectedRole: r.id as any, targetRole: r.id as any });
                const matched = CAREER_JOB_SIMULATIONS.find(s => s.roleId === r.id);
                if (matched) setActiveSimulationId(matched.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                userRole === r.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{r.icon}</span>
              <span>{r.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SIMULATION SELECTION CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CAREER_JOB_SIMULATIONS.map(sim => {
          const isCurrent = sim.id === activeSimulation.id;
          return (
            <div
              key={sim.id}
              onClick={() => {
                setActiveSimulationId(sim.id);
                setCurrentPhaseIndex(0);
                setCompletedPhaseIds([]);
                setIsSimulationFinished(false);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                isCurrent
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                  sim.scenarioType === 'PENTEST' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                }`}>
                  {sim.scenarioType} SIMULATION
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">
                  {sim.difficulty}
                </span>
              </div>

              <div>
                <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                  {sim.title}
                </h3>
                <p className="text-xs font-sans text-slate-400 mt-1 line-clamp-2">
                  {sim.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                <span>Target: <strong className="text-slate-200">{sim.targetOrg}</strong></span>
                <span className="text-cyan-400 font-bold">{sim.phases.length} Phases</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          ACTIVE SIMULATION WORKSPACE (MULTI-PANE)
          ========================================================================= */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* Active Simulation Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Zap className="w-4 h-4" />
              <span>ACTIVE SIMULATION: {activeSimulation.subtitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-mono font-bold text-white">
              {activeSimulation.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleIngestEvidence}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                evidenceCaptured
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-purple-300 border-purple-500/40 hover:bg-slate-800'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>{evidenceCaptured ? 'EVIDENCE CAPTURED! (SHA-256)' : 'INGEST EVIDENCE TO LOCKER'}</span>
            </button>

            <button
              onClick={handleSaveReportToPortfolio}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isReportSaved
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isReportSaved ? 'REPORT SAVED TO PORTFOLIO' : 'COMPILE & SAVE REPORT'}</span>
            </button>
          </div>
        </div>

        {/* Phase Timeline Navigator */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> SIMULATION PHASES ({completedPhaseIds.length}/{activeSimulation.phases.length} COMPLETED)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activeSimulation.phases.map((p, idx) => {
              const isDone = completedPhaseIds.includes(p.id);
              const isActive = idx === currentPhaseIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentPhaseIndex(idx)}
                  className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/40'
                      : isDone
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span>PHASE 0{p.phaseNumber}</span>
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span>+{p.xpReward} XP</span>}
                  </div>
                  <div className="font-bold truncate mt-1 text-slate-100">{p.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Phase & Interactive Terminal Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Phase Instructions & Guidelines */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                  PHASE 0{activePhase.phaseNumber} OBJECTIVES
                </span>
                <span className="text-xs font-mono text-slate-400">Target: <strong className="text-slate-200">{activePhase.targetIpOrAsset}</strong></span>
              </div>

              <div>
                <h3 className="text-lg font-mono font-bold text-white">
                  {activePhase.title}
                </h3>
                <p className="text-xs font-sans text-slate-300 mt-2 leading-relaxed">
                  {activePhase.description}
                </p>
              </div>

              {activePhase.cweCategory && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-300">
                  <strong>CWE Taxonomy:</strong> {activePhase.cweCategory}
                </div>
              )}

              {activePhase.mitreTechnique && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs font-mono text-purple-300">
                  <strong>MITRE ATT&CK:</strong> {activePhase.mitreTechnique}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> SUGGESTED COMMAND FOR PHASE
                </div>
                <div className="flex items-center justify-between gap-2 bg-slate-900 p-2.5 rounded-lg font-mono text-xs text-slate-200 border border-slate-800">
                  <code className="text-cyan-300 break-all">{activePhase.suggestedCommand}</code>
                  <button
                    onClick={() => handleExecuteCommand(activePhase.suggestedCommand)}
                    className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[10px] shrink-0 transition-colors cursor-pointer"
                  >
                    RUN NOW
                  </button>
                </div>
                <p className="text-[10px] font-sans text-slate-400">
                  Hint: {activePhase.hint}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Simulated Terminal Console */}
          <div className="lg:col-span-7 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden min-h-[420px]">
            {/* Terminal Titlebar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <TerminalIcon className="w-4 h-4 text-cyan-400" />
                <span>AUTHORIZED RANGE CLI // {activeSimulation.targetOrg}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTerminalLogs([])}
                  className="text-[10px] text-slate-400 hover:text-slate-200"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Terminal Output Scroll Area */}
            <div className="flex-1 p-4 font-mono text-xs space-y-3 overflow-y-auto max-h-[340px] custom-scrollbar bg-slate-950">
              {terminalLogs.map((log, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-[10px] text-slate-600 font-sans">{log.time}</span>
                  <pre
                    className={`whitespace-pre-wrap font-mono leading-relaxed p-2 rounded ${
                      log.type === 'cmd'
                        ? 'text-cyan-300 bg-slate-900/80 font-bold'
                        : log.type === 'system'
                        ? 'text-slate-400 bg-slate-900/40 border border-slate-800/60'
                        : log.type === 'success'
                        ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 font-bold'
                        : log.type === 'err'
                        ? 'text-rose-400 bg-rose-950/40 border border-rose-500/30 font-bold'
                        : 'text-slate-200 bg-slate-900/30'
                    }`}
                  >
                    {log.text}
                  </pre>
                </div>
              ))}
            </div>

            {/* Terminal Input Box */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleExecuteCommand();
              }}
              className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
            >
              <span className="text-cyan-400 font-mono text-xs font-bold pl-1">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder={`Type command or "${activePhase.suggestedCommand.slice(0, 15)}..."`}
                className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                EXECUTE
              </button>
            </form>
          </div>
        </div>

        {/* =========================================================================
            JOB READINESS IMPACT SCORECARD (9 PILLARS)
            ========================================================================= */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> LIVE JOB READINESS PILLAR IMPACT
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Evaluated for: <strong className="text-slate-200">{currentRoleInfo.title}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            {Object.entries(currentReadiness.pillars).slice(0, 6).map(([key, pillar]) => (
              <div key={key} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold">{pillar.name}</span>
                  <span className={`font-bold ${
                    pillar.score >= 80 ? 'text-emerald-400' :
                    pillar.score >= 65 ? 'text-cyan-400' : 'text-amber-400'
                  }`}>
                    {pillar.score}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pillar.score >= 80 ? 'bg-emerald-400' :
                      pillar.score >= 65 ? 'bg-cyan-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-1">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mentor Debrief Box */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <Brain className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-purple-300">AMAN AI CAREER READINESS DEBRIEF</div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {currentReadiness.mentorDebrief}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerSimulationPage;
