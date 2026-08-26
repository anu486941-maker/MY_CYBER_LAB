import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ETHICAL_HACKER_ORGANIZATIONS,
  EthicalHackerOrganization,
  getEthicalHackerOrgById
} from '../data/ethicalHackerOrganizations';
import { EvidenceItem } from '../types';
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
  Printer,
  Sparkles,
  ChevronRight,
  Trash2,
  Lock,
  Activity,
  Layers,
  Flame,
  Globe,
  Radio,
  Clock,
  Code,
  Database,
  Cloud,
  Network,
  CheckSquare,
  Key,
  Shield,
  Bot,
  Send,
  Play,
  RotateCcw,
  Zap,
  BarChart2,
  Check
} from 'lucide-react';

// Data Types for Stateful Cyber-Range Engine
export interface DiscoveredFlag {
  stageIndex: number;
  stageName: string;
  flag: string;
  timestamp: string;
}

export interface CyberRangeAlert {
  id: string;
  timestamp: string;
  source: string;
  severity: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  message: string;
  correlatedAttackerAction: string;
  recommendedMitigation: string;
}

export interface OrgRangeState {
  currentStageIndex: number;
  completedStages: number[];
  discoveredFlags: DiscoveredFlag[];
  defensiveAlerts: CyberRangeAlert[];
  appliedMitigations: string[];
  submittedFlags: string[];
  seed: string;
  startTime: number;
  completedAt?: number;
  hintLevel: number;
}

export const EthicalHackerWorkspacePage: React.FC = () => {
  const {
    evidenceLocker,
    addEvidence,
    deleteEvidence,
    addXp,
    completeMission
  } = useApp();

  // Target Organization State
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-acme-corp');
  const currentOrg: EthicalHackerOrganization = useMemo(() => {
    return getEthicalHackerOrgById(selectedOrgId);
  }, [selectedOrgId]);

  // Main Workspace Tab
  const [activeTab, setActiveTab] = useState<
    'terminal' | 'web-security' | 'active-directory' | 'cloud-security' | 'incident-command' | 'evidence' | 'mitre' | 'notes' | 'report' | 'aman-mentor'
  >('terminal');

  // Multi-Org Cyber Range Simulation States
  const [rangeStatesMap, setRangeStatesMap] = useState<Record<string, OrgRangeState>>(() => {
    const initial: Record<string, OrgRangeState> = {};
    ETHICAL_HACKER_ORGANIZATIONS.forEach(org => {
      initial[org.id] = {
        currentStageIndex: 0,
        completedStages: [],
        discoveredFlags: [],
        defensiveAlerts: org.defenderLogs.map((l, i) => ({
          id: `ALERT-${i + 1}`,
          timestamp: l.timestamp,
          source: l.source,
          severity: l.severity,
          message: l.message,
          correlatedAttackerAction: l.correlatedAttackerAction,
          recommendedMitigation: l.recommendedMitigation
        })),
        appliedMitigations: [],
        submittedFlags: [],
        seed: Math.random().toString(36).substring(2, 6).toUpperCase(),
        startTime: Date.now(),
        hintLevel: 0
      };
    });
    return initial;
  });

  const rangeState = useMemo(() => {
    return (
      rangeStatesMap[selectedOrgId] || {
        currentStageIndex: 0,
        completedStages: [],
        discoveredFlags: [],
        defensiveAlerts: [],
        appliedMitigations: [],
        submittedFlags: [],
        seed: 'INIT',
        startTime: Date.now(),
        hintLevel: 0
      }
    );
  }, [rangeStatesMap, selectedOrgId]);

  // Helper to update current org range state
  const updateRangeState = (updater: (prev: OrgRangeState) => OrgRangeState) => {
    setRangeStatesMap(prev => ({
      ...prev,
      [selectedOrgId]: updater(
        prev[selectedOrgId] || {
          currentStageIndex: 0,
          completedStages: [],
          discoveredFlags: [],
          defensiveAlerts: [],
          appliedMitigations: [],
          submittedFlags: [],
          seed: 'INIT',
          startTime: Date.now(),
          hintLevel: 0
        }
      )
    }));
  };

  // Hypothesis formulation state ("Think Like an Ethical Hacker")
  const [hypothesisText, setHypothesisText] = useState<string>('');
  const [hypothesisFeedback, setHypothesisFeedback] = useState<string | null>(null);
  const [isEvaluatingHypothesis, setIsEvaluatingHypothesis] = useState<boolean>(false);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<{ cmd: string; output: string; time: string; type?: string }[]>([
    {
      cmd: 'nmap -sn ' + currentOrg.scope.authorizedSubnet,
      output: `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${currentOrg.scope.authorizedAssets[0]?.name || 'target.internal'} (${currentOrg.scope.authorizedAssets[0]?.ip || '10.10.20.1'})\nHost is up (0.0012s latency).\nNmap done: 256 IP addresses (${currentOrg.scope.authorizedAssets.length} hosts up) scanned in 0.95 seconds.`,
      time: '10:00:00 UTC'
    }
  ]);
  const [isExecutingCmd, setIsExecutingCmd] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Web Security Testing Suite State
  const [webReqMethod, setWebReqMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [webReqUrl, setWebReqUrl] = useState<string>(
    currentOrg.webApp?.sampleRequests[0]?.path || '/api/v1/shipments?trackingId=ACME-90210'
  );
  const [webReqHeaders, setWebReqHeaders] = useState<string>('Accept: application/json\nUser-Agent: Mozilla/5.0 (Kali Linux)');
  const [webReqBody, setWebReqBody] = useState<string>('');
  const [webResponse, setWebResponse] = useState<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    elapsedMs: number;
  }>({
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json; charset=utf-8', 'server': 'Apache/2.4.52 (Ubuntu)', 'x-powered-by': 'Express' },
    body: '{\n  "success": true,\n  "data": [\n    {\n      "tracking_id": "ACME-90210",\n      "destination": "Rotterdam Port, NL",\n      "status": "IN_TRANSIT",\n      "cargo_weight": "14,200 KG",\n      "supplier_name": "Titanium Alloys Ltd"\n    }\n  ]\n}',
    elapsedMs: 24
  });
  const [webTab, setWebTab] = useState<'request' | 'response' | 'source' | 'database' | 'logs'>('request');
  const [liveDb, setLiveDb] = useState(currentOrg.webApp?.initialDatabase || []);

  // Red/Blue Dual Perspective State
  const [perspective, setPerspective] = useState<'RED_TEAM' | 'BLUE_TEAM'>('RED_TEAM');

  // Flag Submission State
  const [flagInputText, setFlagInputText] = useState<string>('');
  const [flagFeedback, setFlagFeedback] = useState<string | null>(null);

  // AMAN Chat State
  const [amanChatMessages, setAmanChatMessages] = useState<{ sender: 'user' | 'aman'; text: string; time: string }[]>([
    {
      sender: 'aman',
      text: `Hello Operator! I am **AMAN 4.1**, your AI Hacking Instructor and Cyber Range Simulation Director. You are currently connected to **${currentOrg.name} (${currentOrg.codename})** on \`${currentOrg.scope.authorizedSubnet}\`.\n\nRange Status: **Stage ${rangeState.currentStageIndex + 1} / ${currentOrg.attackChain.length} Active**. Submit your initial hypothesis or run your first recon command!`,
      time: '10:00 UTC'
    }
  ]);
  const [amanInput, setAmanInput] = useState<string>('');
  const [isAmanThinking, setIsAmanThinking] = useState<boolean>(false);

  // Scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Reset UI views when organization changes
  useEffect(() => {
    setTerminalLogs([
      {
        cmd: 'nmap -sn ' + currentOrg.scope.authorizedSubnet,
        output: `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${currentOrg.scope.authorizedAssets[0]?.name || 'target.internal'} (${currentOrg.scope.authorizedAssets[0]?.ip || '10.10.20.1'})\nHost is up (0.0012s latency).\nNmap done: 256 IP addresses (${currentOrg.scope.authorizedAssets.length} hosts up) scanned in 0.95 seconds.`,
        time: new Date().toLocaleTimeString() + ' UTC'
      }
    ]);
    setLiveDb(currentOrg.webApp?.initialDatabase || []);
    if (currentOrg.webApp?.sampleRequests[0]) {
      setWebReqUrl(currentOrg.webApp.sampleRequests[0].path);
    }
    setAmanChatMessages([
      {
        sender: 'aman',
        text: `Switched target environment to **${currentOrg.name}** (\`${currentOrg.scope.authorizedSubnet}\`). Threat Model: *${currentOrg.threatModel}*.\n\nRange Status: **Stage ${rangeState.currentStageIndex + 1} / ${currentOrg.attackChain.length}**. How would you like to proceed?`,
        time: new Date().toLocaleTimeString() + ' UTC'
      }
    ]);
    setHypothesisFeedback(null);
    setHypothesisText('');
    setFlagFeedback(null);
  }, [selectedOrgId]);

  // Range Reset / Replay Logic
  const handleResetRange = (isReplayWithNewSeed = false) => {
    const newSeed = isReplayWithNewSeed ? Math.random().toString(36).substring(2, 6).toUpperCase() : rangeState.seed;
    updateRangeState(() => ({
      currentStageIndex: 0,
      completedStages: [],
      discoveredFlags: [],
      defensiveAlerts: currentOrg.defenderLogs.map((l, i) => ({
        id: `ALERT-${i + 1}`,
        timestamp: new Date().toLocaleTimeString(),
        source: l.source,
        severity: l.severity,
        message: l.message,
        correlatedAttackerAction: l.correlatedAttackerAction,
        recommendedMitigation: l.recommendedMitigation
      })),
      appliedMitigations: [],
      submittedFlags: [],
      seed: newSeed,
      startTime: Date.now(),
      hintLevel: 0
    }));

    setTerminalLogs([
      {
        cmd: `reset-range --seed=${newSeed}`,
        output: `[✓] Target sandbox for ${currentOrg.name} reset to baseline (Seed: ${newSeed}). All stage progression cleared.`,
        time: new Date().toLocaleTimeString() + ' UTC'
      }
    ]);
    setLiveDb(currentOrg.webApp?.initialDatabase || []);
    alert(`Cyber range for ${currentOrg.name} reset to clean baseline (Seed: ${newSeed}).`);
  };

  // Trigger Stage Advance & Register Flag / Alert
  const advanceStageIfMatched = (stageIdx: number, flagValue: string, actionDescription: string) => {
    updateRangeState(prev => {
      const isAlreadyCompleted = prev.completedStages.includes(stageIdx);
      const nextCompleted = isAlreadyCompleted ? prev.completedStages : [...prev.completedStages, stageIdx];
      const nextCurrentIndex = Math.max(prev.currentStageIndex, Math.min(stageIdx + 1, currentOrg.attackChain.length - 1));
      const dynamicFlag = `${flagValue}_${prev.seed}`;

      const flagAlreadyFound = prev.discoveredFlags.some(f => f.stageIndex === stageIdx);
      const nextFlags = flagAlreadyFound
        ? prev.discoveredFlags
        : [
            ...prev.discoveredFlags,
            {
              stageIndex: stageIdx,
              stageName: currentOrg.attackChain[stageIdx]?.stage || `Stage ${stageIdx + 1}`,
              flag: dynamicFlag,
              timestamp: new Date().toLocaleTimeString()
            }
          ];

      const newAlert: CyberRangeAlert = {
        id: `SIEM-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        source: 'Snort / ModSecurity IDS',
        severity: 'ALERT',
        message: `Attacker executed stage ${stageIdx + 1} exploit (${currentOrg.attackChain[stageIdx]?.mitreId || 'T1190'}): ${actionDescription}`,
        correlatedAttackerAction: actionDescription,
        recommendedMitigation: `Enforce defensive remediation policy for ${currentOrg.attackChain[stageIdx]?.mitreTactic || 'exploitation'}`
      };

      return {
        ...prev,
        currentStageIndex: nextCurrentIndex,
        completedStages: nextCompleted,
        discoveredFlags: nextFlags,
        defensiveAlerts: [newAlert, ...prev.defensiveAlerts]
      };
    });

    addXp(200);

    // Notify AMAN in chat
    setAmanChatMessages(prev => [
      ...prev,
      {
        sender: 'aman',
        text: `🎉 **STAGE COMPLETED**: You successfully executed **Stage ${stageIdx + 1}: ${currentOrg.attackChain[stageIdx]?.stage}**!\n\nCaptured Flag: \`${flagValue}_${rangeState.seed}\`\nNew SIEM alert generated in Blue Team view. Proceeding to Stage ${Math.min(stageIdx + 2, currentOrg.attackChain.length)}.`,
        time: new Date().toLocaleTimeString() + ' UTC'
      }
    ]);
  };

  // Terminal Execution Engine with Blue Team Mitigation Checks & Stateful Target Progression
  const executeTerminalCommand = (cmdToRun?: string) => {
    const rawCmd = cmdToRun !== undefined ? cmdToRun : terminalInput;
    if (!rawCmd.trim() || isExecutingCmd) return;

    const cleanCmd = rawCmd.trim();
    setIsExecutingCmd(true);
    setTerminalInput('');

    setTimeout(() => {
      let output = '';
      const lower = cleanCmd.toLowerCase();
      const mitigations = rangeState.appliedMitigations;

      // Check Blue Team Defensive Mitigations
      if (lower.startsWith('find') && mitigations.includes('SUID_HARDENING')) {
        output = `[DEFENSE MITIGATION ACTIVE]: SUID permission on /usr/bin/find has been removed by system administrator (chmod 0755). Execution prevented.\nfind: File not found or permission denied.`;
        setTerminalLogs(prev => [...prev, { cmd: cleanCmd, output, time: new Date().toLocaleTimeString() + ' UTC' }]);
        setIsExecutingCmd(false);
        return;
      }

      if ((lower.startsWith('impacket-getuserspns') || lower.startsWith('getuserspns')) && mitigations.includes('KERBEROS_AES_ONLY')) {
        output = `[DEFENSE MITIGATION ACTIVE]: Kerberos KDC rejected TGS request.\nError: KDC_ERR_ETYPE_NOSUPP (RC4-HMAC disabled by Active Directory GPO. AES256 required).`;
        setTerminalLogs(prev => [...prev, { cmd: cleanCmd, output, time: new Date().toLocaleTimeString() + ' UTC' }]);
        setIsExecutingCmd(false);
        return;
      }

      // Check match against currentOrg attackChain
      const matchedStageIdx = currentOrg.attackChain.findIndex(c =>
        cleanCmd.toLowerCase().includes(c.expectedCommand.toLowerCase().slice(0, 15)) ||
        c.expectedCommand.toLowerCase().includes(cleanCmd.toLowerCase().slice(0, 15))
      );

      if (matchedStageIdx !== -1) {
        const stageObj = currentOrg.attackChain[matchedStageIdx];
        output = `${stageObj.expectedOutput}\n\n[DYNAMIC LAB FLAG]: ${stageObj.flagOrEvidence}_${rangeState.seed}`;
        advanceStageIfMatched(matchedStageIdx, stageObj.flagOrEvidence, cleanCmd);
      } else if (lower.startsWith('ping')) {
        const target = cleanCmd.split(' ')[1] || currentOrg.scope.authorizedAssets[0]?.ip;
        output = `PING ${target} (${target}) 56(84) bytes of data.\n64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.821 ms\n64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.744 ms\n--- ${target} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss, time 1002ms`;
        advanceStageIfMatched(0, 'FLAG{RECON_SUBNET_MAPPED}', `Subnet ping sweep against ${target}`);
      } else if (lower.startsWith('nmap')) {
        if (lower.includes('-sn') || lower.includes('-sp')) {
          output = `Starting Nmap 7.94 ( https://nmap.org )\n` +
            currentOrg.scope.authorizedAssets.map(a => `Nmap scan report for ${a.name} (${a.ip})\nHost is up (0.0014s latency).`).join('\n') +
            `\nNmap done: 256 IP addresses (${currentOrg.scope.authorizedAssets.length} hosts up) scanned in 0.88 seconds.`;
          advanceStageIfMatched(0, 'FLAG{RECON_SUBNET_MAPPED}', 'Nmap live host discovery sweep');
        } else {
          const targetIp = cleanCmd.split(' ').pop() || currentOrg.scope.authorizedAssets[0]?.ip;
          const foundAsset = currentOrg.scope.authorizedAssets.find(a => a.ip === targetIp || cleanCmd.includes(a.ip));
          if (foundAsset) {
            output = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${foundAsset.name} (${foundAsset.ip})\nHost is up (0.0019s latency).\nNot shown: 997 closed tcp ports (reset)\nPORT     STATE SERVICE  VERSION\n` +
              foundAsset.services.map(s => `${s.port}/tcp  ${s.state}  ${s.name.padEnd(8)} ${s.version || 'unknown'}`).join('\n') +
              `\nService Info: OS: ${foundAsset.os}; CPE: cpe:/o:linux:linux_kernel`;
          } else {
            output = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${currentOrg.scope.authorizedAssets[0]?.name} (${currentOrg.scope.authorizedAssets[0]?.ip})\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\nNmap done: 1 IP address scanned.`;
          }
          advanceStageIfMatched(0, 'FLAG{RECON_SUBNET_MAPPED}', `Nmap port scan on ${targetIp}`);
        }
      } else if (lower.startsWith('curl') || lower.startsWith('wget')) {
        if (lower.includes('union') || lower.includes("' or '1'='1")) {
          if (mitigations.includes('WAF_SQLI_PREVENTION')) {
            output = `HTTP/1.1 403 Forbidden\nServer: ModSecurity WAF\nX-WAF-Rule: OWASP CRS 942100 (SQLi Detected)\nContent-Type: text/html\n\n<h1>403 Access Denied: WAF SQL Injection Filter Active</h1>`;
          } else {
            output = `{"success":true,"data":[{"tracking_id":"admin","role":"SUPER_ADMIN","api_key":"ak_live_9f823a8c1e847","password_hash":"$2a$12$e9.Qh8P7o..."}]}\n<!-- FLAG{ACME_SQLI_CREDENTIAL_EXTRACTED_${rangeState.seed}} -->`;
            advanceStageIfMatched(1, 'FLAG{SQLI_CREDENTIAL_EXTRACTED}', 'CURL SQL Injection payload execution');
          }
        } else if (lower.includes('169.254.169.254')) {
          if (mitigations.includes('AWS_IMDSV2_REQUIRED')) {
            output = `HTTP/1.1 401 Unauthorized\nServer: AWS IMDS\nContent-Type: text/plain\n\nError: IMDSv1 is disabled. X-aws-ec2-metadata-token header required.`;
          } else {
            output = `{\n  "Code": "Success",\n  "Type": "AWS-HMAC",\n  "AccessKeyId": "ASIAV9876EXAMPLEKEY",\n  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",\n  "Token": "IQoJb3JpZ2luX2VjEEXAMPLE..."\n}\nFLAG{AWS_IMDSV1_CREDENTIALS_EXTRACTED_${rangeState.seed}}`;
            advanceStageIfMatched(1, 'FLAG{AWS_IMDSV1_CREDENTIALS_EXTRACTED}', 'CURL AWS Metadata IMDSv1 query');
          }
        } else if (lower.includes('etc/passwd')) {
          output = `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nclinical_nurse:x:1001:1001:Nurse Station:/home/clinical_nurse:/bin/bash\nFLAG{LFI_ETC_PASSWD_EXPOSED_${rangeState.seed}}`;
          advanceStageIfMatched(1, 'FLAG{LFI_ETC_PASSWD_EXPOSED}', 'CURL Path Traversal /etc/passwd extraction');
        } else {
          output = `HTTP/1.1 200 OK\nServer: nginx/1.24.0\nContent-Type: text/html\nContent-Length: 1422\n\n<!DOCTYPE html><html><head><title>${currentOrg.name} Portal</title></head><body><h1>Welcome to ${currentOrg.name}</h1></body></html>`;
        }
      } else if (lower.startsWith('find')) {
        output = `/usr/bin/sudo\n/usr/bin/passwd\n/usr/bin/find  <-- MISCONFIGURED SUID ROOT (chmod 4755)\n/usr/bin/newgrp\n/usr/bin/gpasswd`;
        advanceStageIfMatched(2, 'FLAG{SUID_FIND_PRIVILEGE_ELEVATION}', 'Find SUID binary audit');
      } else if (lower === 'id' || lower === 'whoami') {
        output = `uid=0(root) gid=0(root) groups=0(root),27(sudo) [ELEVATED PRIVILEGES VIA FIND SUID]\nFLAG{ROOT_SYSTEM_ACCESS_ACHIEVED_${rangeState.seed}}`;
        advanceStageIfMatched(2, 'FLAG{ROOT_SYSTEM_ACCESS_ACHIEVED}', 'Whoami / id privilege verification');
      } else if (lower.startsWith('impacket-getuserspns') || lower.startsWith('getuserspns')) {
        output = `ServicePrincipalName              Name       MemberOf\nMSSQLSvc/fs01.nexus.edu.local:1433 svc_mssql  CN=Tier1-Admins,CN=Users,DC=nexus,DC=edu,DC=local\n\n$krb5tgs$23$*svc_mssql*nexus.edu.local*MSSQLSvc/fs01.nexus.edu.local:1433*$4b8e7192aa0...[TICKET HASH]\nFLAG{NEXUS_KERBEROAST_TICKET_CAPTURED_${rangeState.seed}}`;
        advanceStageIfMatched(1, 'FLAG{NEXUS_KERBEROAST_TICKET_CAPTURED}', 'Impacket Kerberoasting TGS request');
      } else if (lower.startsWith('redis-cli')) {
        output = `# Server\nredis_version:6.2.6\n# Keyspace\ndb0:keys=42,expires=0,avg_ttl=0\nFound key: auth_signing_secret="NorthstarSecretKey2026!"\nFLAG{REDIS_UNAUTH_SECRET_EXTRACTED_${rangeState.seed}}`;
        advanceStageIfMatched(1, 'FLAG{REDIS_UNAUTH_SECRET_EXTRACTED}', 'Redis-cli unauthorized key extraction');
      } else if (lower.startsWith('mosquitto_sub')) {
        output = `fleet/truck_04/gps {"lat": 41.8781, "lon": -87.6298, "speed_mph": 62}\nfleet/truck_04/reefer_temp {"temp_celsius": -18.2, "status": "LOCKED"}\nFLAG{BLACKSTONE_MQTT_TELEMETRY_INTERCEPTED_${rangeState.seed}}`;
        advanceStageIfMatched(1, 'FLAG{BLACKSTONE_MQTT_TELEMETRY_INTERCEPTED}', 'Mosquitto MQTT wildcard topic subscription');
      } else if (lower === 'clear') {
        setTerminalLogs([]);
        setIsExecutingCmd(false);
        return;
      } else if (lower === 'help') {
        output = `MY CYBER LAB SIMULATED TERMINAL TOOLBOX:\n- nmap [-sn|-sV|-p] <target>   : Network scanner\n- ping <target>                : ICMP Echo test\n- curl [-X POST|-H] <url>      : HTTP client & API test\n- find / -perm -4000           : SUID binary audit\n- impacket-GetUserSPNs <args>  : Kerberoasting query\n- redis-cli -h <ip> info       : Redis database client\n- mosquitto_sub -h <ip> -t '#' : MQTT IoT sensor subscriber\n- id / whoami                  : Current effective user\n- clear                        : Clear console`;
      } else {
        output = `[SIMULATED EXECUTION]: Command '${cleanCmd}' executed against authorized target environment.\nExit Code: 0 (Success).`;
      }

      setTerminalLogs(prev => [
        ...prev,
        {
          cmd: cleanCmd,
          output,
          time: new Date().toLocaleTimeString() + ' UTC'
        }
      ]);
      setIsExecutingCmd(false);
    }, 400);
  };

  // Capture Terminal Output as Evidence
  const captureTerminalEvidence = (log: { cmd: string; output: string }) => {
    const hash = `sha256_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;
    const createdEvid = addEvidence({
      engagementId: currentOrg.id,
      assetId: currentOrg.scope.authorizedAssets[0]?.id || 'asset-01',
      assetIp: currentOrg.scope.authorizedAssets[0]?.ip || '10.10.20.10',
      type: 'COMMAND_OUTPUT',
      description: `Command execution proof: ${log.cmd}`,
      rawContent: `$ ${log.cmd}\n\n${log.output}`,
      analystNote: `Captured from ${currentOrg.codename} terminal during active authorized assessment. Seed: ${rangeState.seed}`,
      verified: true,
      integrityHash: hash
    });
    addXp(75);
    alert(`Artifact captured successfully as ${createdEvid.id} with SHA-256 hash.`);
  };

  // Evaluate Hypothesis
  const handleEvaluateHypothesis = () => {
    if (!hypothesisText.trim()) return;
    setIsEvaluatingHypothesis(true);

    setTimeout(() => {
      let feedback = '';
      const lower = hypothesisText.toLowerCase();

      if (lower.includes('nmap') || lower.includes('recon') || lower.includes('sweep') || lower.includes('scan') || lower.includes('port')) {
        feedback = `🎯 **Excellent Tactical Reasoning**: Starting with passive and active network sweeps (\`nmap -sn ${currentOrg.scope.authorizedSubnet}\`) allows you to map all live IP addresses without triggering noisy application firewalls. Next, focus on identifying open service banners on ports 80, 443, 8080, and database ports.`;
        addXp(100);
      } else if (lower.includes('web') || lower.includes('curl') || lower.includes('browser') || lower.includes('endpoint')) {
        feedback = `🔎 **Good Application Focus**: Investigating the web layer first is sensible if you already have the web host IP. Remember to inspect request parameters, hidden comments in HTML, and API endpoints for injection or broken access controls.`;
        addXp(75);
      } else {
        feedback = `💡 **AMAN Guidance**: Consider starting with baseline subnet reconnaissance to confirm live hosts and open listening ports before jumping into specific exploit payloads. What tools would you use to verify which ports are active?`;
      }

      setHypothesisFeedback(feedback);
      setIsEvaluatingHypothesis(false);
    }, 600);
  };

  // Execute Web Request in Suite with WAF & State progression
  const handleSendWebRequest = () => {
    let status = 200;
    let statusText = 'OK';
    let body = '';
    const lowerUrl = webReqUrl.toLowerCase();
    const mitigations = rangeState.appliedMitigations;

    if (lowerUrl.includes('union') || lowerUrl.includes("' or '1'='1")) {
      if (mitigations.includes('WAF_SQLI_PREVENTION')) {
        status = 403;
        statusText = 'Forbidden (WAF Blocked)';
        body = JSON.stringify(
          {
            error: 'WAF_RULE_TRIGGERED',
            message: 'OWASP CRS Rule 942100: SQL Injection attack detected in parameter. Request blocked by Web Application Firewall.',
            remediation: 'Application enforced prepared statements and parameter binding.'
          },
          null,
          2
        );
      } else {
        status = 200;
        body = JSON.stringify(
          {
            success: true,
            injection_detected: 'SQL Injection Proof of Concept',
            data: [
              { id: 1, username: 'admin', role: 'SUPER_ADMIN', api_key: 'ak_live_9f823a8c1e847', password_hash: '$2a$12$e9.Qh8P7o... (acme_root_2026)' },
              { id: 2, username: 'operator', role: 'OPERATOR', api_key: 'ak_live_3b719d0a2c914', password_hash: '$2a$12$k2.Lm4N9p... (operator123)' }
            ],
            flag: `FLAG{ACME_SQLI_CREDENTIAL_EXTRACTED_${rangeState.seed}}`
          },
          null,
          2
        );
        advanceStageIfMatched(1, 'FLAG{SQLI_CREDENTIAL_EXTRACTED}', 'Web Security Suite SQL Injection query');
      }
    } else if (lowerUrl.includes('etc/passwd')) {
      status = 200;
      body = `root:x:0:0:root:/root:/bin/bash\nclinical_nurse:x:1001:1001:Nurse Station:/home/clinical_nurse:/bin/bash\northanc:x:1002:1002:Orthanc DICOM:/var/lib/orthanc:/bin/false\n# FLAG{LFI_ETC_PASSWD_EXPOSED_${rangeState.seed}}`;
      advanceStageIfMatched(1, 'FLAG{LFI_ETC_PASSWD_EXPOSED}', 'Web Security Suite Path Traversal query');
    } else if (lowerUrl.includes('169.254.169.254')) {
      if (mitigations.includes('AWS_IMDSV2_REQUIRED')) {
        status = 401;
        statusText = 'Unauthorized';
        body = `IMDSv1 Disabled. Token required.`;
      } else {
        status = 200;
        body = JSON.stringify(
          {
            Code: 'Success',
            Type: 'AWS-HMAC',
            AccessKeyId: 'ASIAV9876EXAMPLEKEY',
            SecretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
            Token: 'IQoJb3JpZ2luX2VjEEXAMPLE...',
            Expiration: '2026-08-25T18:00:00Z',
            flag: `FLAG{AWS_IMDSV1_CREDENTIALS_EXTRACTED_${rangeState.seed}}`
          },
          null,
          2
        );
        advanceStageIfMatched(1, 'FLAG{AWS_IMDSV1_CREDENTIALS_EXTRACTED}', 'Web Security Suite SSRF metadata query');
      }
    } else {
      status = 200;
      body = JSON.stringify(
        {
          success: true,
          data: [
            { tracking_id: 'ACME-90210', destination: 'Rotterdam Port, NL', status: 'IN_TRANSIT', cargo_weight: '14,200 KG', supplier_name: 'Titanium Alloys Ltd' }
          ]
        },
        null,
        2
      );
    }

    setWebResponse({
      status,
      statusText,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'server': 'Apache/2.4.52 (Ubuntu)',
        'x-powered-by': 'Express',
        'date': new Date().toUTCString()
      },
      body,
      elapsedMs: Math.floor(Math.random() * 20) + 15
    });
    setWebTab('response');
  };

  // Toggle Blue Team Mitigation Action
  const toggleMitigation = (mitigationKey: string) => {
    updateRangeState(prev => {
      const exists = prev.appliedMitigations.includes(mitigationKey);
      const nextMitigations = exists
        ? prev.appliedMitigations.filter(m => m !== mitigationKey)
        : [...prev.appliedMitigations, mitigationKey];

      const alertMsg = exists
        ? `Defender disabled mitigation rule [${mitigationKey}]`
        : `Defender enabled mitigation rule [${mitigationKey}] to contain active vulnerability.`;

      return {
        ...prev,
        appliedMitigations: nextMitigations,
        defensiveAlerts: [
          {
            id: `DEF-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toLocaleTimeString(),
            source: 'Blue Team SOC Operator',
            severity: 'INFO',
            message: alertMsg,
            correlatedAttackerAction: 'Remediation control state change',
            recommendedMitigation: 'Re-test attack vector in Terminal / Web suite to verify containment.'
          },
          ...prev.defensiveAlerts
        ]
      };
    });
  };

  // Flag Submission Handler
  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInputText.trim()) return;

    const clean = flagInputText.trim();
    const matchedFlag = rangeState.discoveredFlags.find(
      f => f.flag.toLowerCase() === clean.toLowerCase() || clean.toLowerCase().includes(f.flag.toLowerCase())
    );

    if (matchedFlag) {
      if (!rangeState.submittedFlags.includes(matchedFlag.flag)) {
        updateRangeState(prev => ({
          ...prev,
          submittedFlags: [...prev.submittedFlags, matchedFlag.flag]
        }));
        addXp(300);
        completeMission(currentOrg.id);
        setFlagFeedback(`✅ **VALID FLAG ACCEPTED**: ${matchedFlag.flag}! Stage ${matchedFlag.stageIndex + 1} marked as verified. +300 XP awarded.`);
      } else {
        setFlagFeedback(`⚠️ Flag '${clean}' was already submitted for this range session.`);
      }
    } else {
      setFlagFeedback(`❌ Invalid flag submission. Verify dynamic flag format (e.g. FLAG{...}_${rangeState.seed}).`);
    }
    setFlagInputText('');
  };

  // Request AMAN Stage Hint
  const handleRequestStageHint = () => {
    const stageIdx = rangeState.currentStageIndex;
    const stageObj = currentOrg.attackChain[stageIdx] || currentOrg.attackChain[0];
    const nextLevel = rangeState.hintLevel + 1;

    updateRangeState(prev => ({ ...prev, hintLevel: nextLevel }));

    let hintText = '';
    if (nextLevel === 1) {
      hintText = `💡 **AMAN Stage ${stageIdx + 1} Hint (Level 1 - Tactical Concept)**:\n${stageObj.description}\n\nThink about what tool or endpoint can demonstrate MITRE Technique **${stageObj.mitreId} (${stageObj.mitreTactic})**.`;
    } else if (nextLevel === 2) {
      hintText = `🔍 **AMAN Stage ${stageIdx + 1} Hint (Level 2 - Tool Guidance)**:\nFor this stage, execute a command matching:\n\`${stageObj.expectedCommand}\` in the Terminal CLI or Web Security Request Builder.`;
    } else {
      hintText = `🎯 **AMAN Stage ${stageIdx + 1} Hint (Level 3 - Exact Payload)**:\nRun exactly: \`${stageObj.expectedCommand}\` to capture flag \`${stageObj.flagOrEvidence}_${rangeState.seed}\`.`;
    }

    setAmanChatMessages(prev => [
      ...prev,
      {
        sender: 'aman',
        text: hintText,
        time: new Date().toLocaleTimeString() + ' UTC'
      }
    ]);
    setActiveTab('aman-mentor');
  };

  // Send message to AMAN
  const handleSendAmanMessage = () => {
    if (!amanInput.trim() || isAmanThinking) return;
    const userMsg = amanInput.trim();
    setAmanInput('');
    setAmanChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString() + ' UTC' }]);
    setIsAmanThinking(true);

    setTimeout(() => {
      let reply = '';
      const lower = userMsg.toLowerCase();

      if (lower.includes('hint') || lower.includes('help') || lower.includes('stage')) {
        const stageObj = currentOrg.attackChain[rangeState.currentStageIndex] || currentOrg.attackChain[0];
        reply = `You are currently on **Stage ${rangeState.currentStageIndex + 1}: ${stageObj.stage}**.\n\nObjective: ${stageObj.description}\nSuggested Command: \`${stageObj.expectedCommand}\``;
      } else if (lower.includes('port 8080') || lower.includes('8080')) {
        reply = `Great find! Port **8080** on \`${currentOrg.codename}\` is running a Node.js Express API. Before probing for vulnerabilities, test \`/api/v1/shipments\` in the **Web Security** tab or CLI.`;
      } else if (lower.includes('sql') || lower.includes('sqli')) {
        reply = `To verify SQL injection safely:\n- Send a test payload like \`' OR '1'='1\` in the Web Security suite.\n- Inspect the **Database View** sub-tab to view live tables!`;
      } else if (lower.includes('privilege') || lower.includes('root') || lower.includes('suid')) {
        reply = `For Linux Privilege Escalation on this host:\n- Run \`find / -perm -4000 -type f 2>/dev/null\` to find SUID binaries.\n- Look for \`/usr/bin/find\` — execute shell commands with \`find . -exec /bin/sh -p \\;\`!`;
      } else {
        reply = `I am analyzing your target \`${currentOrg.name}\` (Range Seed: \`${rangeState.seed}\`).\nCurrent Stage: **${rangeState.currentStageIndex + 1} / ${currentOrg.attackChain.length}**.\n\nWhich tool or endpoint are you testing right now?`;
      }

      setAmanChatMessages(prev => [...prev, { sender: 'aman', text: reply, time: new Date().toLocaleTimeString() + ' UTC' }]);
      setIsAmanThinking(false);
    }, 500);
  };

  // Skill Score Calculation for Post-Mission scorecard
  const skillScores = useMemo(() => {
    const totalStages = currentOrg.attackChain.length;
    const completedCount = rangeState.completedStages.length;
    const reconScore = rangeState.completedStages.includes(0) ? 100 : 30;
    const vulnScore = Math.min(100, Math.round((completedCount / totalStages) * 100));
    const privEscScore = rangeState.completedStages.includes(2) || rangeState.completedStages.includes(3) ? 100 : 20;
    const evidenceScore = Math.min(100, evidenceLocker.length * 25);
    const defenseScore = Math.min(100, rangeState.appliedMitigations.length * 33 + 34);

    const overallAvg = Math.round((reconScore + vulnScore + privEscScore + evidenceScore + defenseScore) / 5);

    let tier = 'C-TIER';
    if (overallAvg >= 90) tier = 'S-TIER';
    else if (overallAvg >= 80) tier = 'A-TIER';
    else if (overallAvg >= 65) tier = 'B-TIER';

    return {
      reconScore,
      vulnScore,
      privEscScore,
      evidenceScore,
      defenseScore,
      overallAvg,
      tier
    };
  }, [currentOrg, rangeState, evidenceLocker]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Target Environment Selector */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 p-5 shadow-[0_0_25px_rgba(6,182,212,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {currentOrg.logoEmoji}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold tracking-wider">
                  ETHICAL HACKER CYBER RANGE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> AUTHORIZED LAB
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-[11px]">
                  {currentOrg.difficulty.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-slate-300 font-mono text-[11px]">
                  SEED: {rangeState.seed}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                {currentOrg.name} <span className="text-slate-400 font-mono text-base font-normal">({currentOrg.codename})</span>
              </h1>
              <p className="text-slate-400 text-sm mt-0.5 line-clamp-1 max-w-3xl">
                {currentOrg.description}
              </p>
            </div>
          </div>

          {/* Org Selector & Reset / Replay Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Target Org:</label>
              <select
                value={selectedOrgId}
                onChange={e => setSelectedOrgId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                {ETHICAL_HACKER_ORGANIZATIONS.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.logoEmoji} {org.name} ({org.codename})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleResetRange(false)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset target sandbox to baseline state"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>

            <button
              onClick={() => handleResetRange(true)}
              className="px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Replay range with a new dynamic flag seed"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay Range
            </button>
          </div>
        </div>

        {/* Multi-Stage Attack Chain Stepper */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-cyan-400" /> Multi-Stage Cyber Range Progression:
            </span>
            <span className="text-slate-300">
              {rangeState.completedStages.length} / {currentOrg.attackChain.length} Stages Cleared ({Math.round((rangeState.completedStages.length / currentOrg.attackChain.length) * 100)}%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentOrg.attackChain.map((stg, sIdx) => {
              const isCompleted = rangeState.completedStages.includes(sIdx);
              const isActive = rangeState.currentStageIndex === sIdx;

              return (
                <div
                  key={sIdx}
                  onClick={() => {
                    if (sIdx === 0 || rangeState.completedStages.includes(sIdx - 1) || isCompleted) {
                      updateRangeState(prev => ({ ...prev, currentStageIndex: sIdx }));
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isCompleted
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : isActive
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="font-bold">STAGE 0{sIdx + 1}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold">
                      {isCompleted ? '✓ CLEARED' : isActive ? '▶ ACTIVE' : '🔒 LOCKED'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white font-sans line-clamp-1">{stg.stage}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                    {stg.mitreTactic} ({stg.mitreId})
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scope & Rules of Engagement HUD */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
            <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">AUTHORIZED SUBNET</span>
              <span className="text-cyan-300 font-bold">{currentOrg.scope.authorizedSubnet}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">AUTHORIZED DOMAINS</span>
              <span className="text-emerald-300 truncate block max-w-[220px]">
                {currentOrg.scope.authorizedDomains.join(', ')}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">PROHIBITED OUT-OF-SCOPE</span>
              <span className="text-rose-300 truncate block max-w-[220px]">
                {currentOrg.scope.prohibitedTargets[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Hypothesis Formulation Box ("Think Like an Ethical Hacker") */}
        <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold font-mono">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>THINK LIKE AN ETHICAL HACKER: {currentOrg.hypothesisPrompt}</span>
            </div>

            <button
              onClick={handleRequestStageHint}
              className="px-2.5 py-1 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer hover:bg-purple-900 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" /> Request AMAN Stage Hint
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={hypothesisText}
              onChange={e => setHypothesisText(e.target.value)}
              placeholder="Formulate your initial hypothesis / attack vector strategy here (e.g. Execute nmap sweep on 10.10.20.0/24)..."
              className="flex-1 bg-slate-950/80 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              onClick={handleEvaluateHypothesis}
              disabled={isEvaluatingHypothesis || !hypothesisText.trim()}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isEvaluatingHypothesis ? 'Evaluating...' : 'Evaluate Strategy'}
            </button>
          </div>
          {hypothesisFeedback && (
            <div className="mt-2 p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-xs text-slate-200 font-sans leading-relaxed">
              {hypothesisFeedback}
            </div>
          )}
        </div>
      </div>

      {/* Main Multi-Pane Workspace Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'terminal', label: 'Terminal CLI', icon: Terminal },
          { id: 'web-security', label: 'Web Testing Suite', icon: Globe },
          { id: 'active-directory', label: 'Active Directory', icon: Network },
          { id: 'cloud-security', label: 'Cloud Security', icon: Cloud },
          { id: 'incident-command', label: 'Red / Blue Incident Center', icon: Activity, badge: rangeState.defensiveAlerts.length },
          { id: 'evidence', label: 'Evidence Locker', icon: FolderGit2, badge: evidenceLocker.length },
          { id: 'mitre', label: 'MITRE ATT&CK', icon: Layers },
          { id: 'notes', label: 'Attack Chain & Notes', icon: Code },
          { id: 'report', label: 'Pentest Scorecard & Report', icon: FileText, badge: rangeState.discoveredFlags.length },
          { id: 'aman-mentor', label: 'AMAN AI Partner', icon: Bot }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TERMINAL CLI INTERACTIVE ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'terminal' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col h-[520px]">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">
                  operator@kali:~ ({currentOrg.codename} Range Session)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                  Target Subnet: {currentOrg.scope.authorizedSubnet}
                </span>
              </div>
            </div>

            {/* Terminal Output Log Area */}
            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-2 custom-scrollbar">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">$</span>
                      <span className="text-cyan-300 font-bold">{log.cmd}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{log.time}</span>
                      <button
                        onClick={() => captureTerminalEvidence(log)}
                        className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] cursor-pointer"
                      >
                        + EVID
                      </button>
                    </div>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900/90 text-slate-200 leading-relaxed border border-slate-800/60 whitespace-pre-wrap overflow-x-auto">
                    {log.output}
                  </pre>
                </div>
              ))}
              {isExecutingCmd && (
                <div className="text-cyan-400 font-mono text-xs animate-pulse">
                  Executing remote payload...
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Command Input Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                executeTerminalCommand();
              }}
              className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2"
            >
              <span className="text-emerald-400 font-mono font-bold text-xs">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="Type command (nmap, ping, curl, find, impacket-GetUserSPNs, redis-cli, help)..."
                className="flex-1 bg-transparent border-none text-xs text-slate-100 font-mono focus:outline-none placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={isExecutingCmd || !terminalInput.trim()}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
              >
                Execute
              </button>
            </form>
          </div>

          {/* Preset Quick Commands */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Quick Commands:</span>
            {[
              `nmap -sn ${currentOrg.scope.authorizedSubnet}`,
              `curl http://${currentOrg.scope.authorizedAssets[0]?.ip || '10.10.20.10'}/api/v1/shipments?trackingId=' UNION SELECT 1,username,password_hash FROM users--`,
              `find / -perm -4000 -type f 2>/dev/null`,
              `impacket-GetUserSPNs -request -dc-ip ${currentOrg.activeDirectory?.domainControllerIp || '172.28.0.5'} nexus.edu.local/svc_mssql`,
              `mosquitto_sub -h 10.10.60.15 -t '#'`
            ].map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => executeTerminalCommand(cmd)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-mono text-[11px] cursor-pointer"
              >
                {cmd.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WEB APPLICATION SECURITY SUITE */}
      {/* ========================================================================= */}
      {activeTab === 'web-security' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            {/* Suite Header & Sub-tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" /> Web Security Inspector: {currentOrg.webApp?.name || 'Supply Chain Portal'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target Stack: <span className="text-cyan-300 font-mono">{currentOrg.webApp?.technologyStack || 'Node.js Express + PostgreSQL'}</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { id: 'request', label: 'HTTP Request Builder' },
                  { id: 'response', label: 'HTTP Response Inspector' },
                  { id: 'source', label: 'Backend Source Code' },
                  { id: 'database', label: 'Database View' },
                  { id: 'logs', label: 'Server Tail Logs' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setWebTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs cursor-pointer transition-colors ${
                      webTab === sub.id
                        ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Request Builder Sub-Tab */}
            {webTab === 'request' && (
              <div className="space-y-4 font-mono">
                <div className="flex items-center gap-2">
                  <select
                    value={webReqMethod}
                    onChange={e => setWebReqMethod(e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    value={webReqUrl}
                    onChange={e => setWebReqUrl(e.target.value)}
                    placeholder="/api/v1/shipments?trackingId=..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSendWebRequest}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Send Request
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 uppercase">HTTP Headers:</label>
                    <textarea
                      value={webReqHeaders}
                      onChange={e => setWebReqHeaders(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 uppercase">Request Body (JSON / Payload):</label>
                    <textarea
                      value={webReqBody}
                      onChange={e => setWebReqBody(e.target.value)}
                      rows={4}
                      placeholder="{ 'trackingId': 'ACME-90210' }"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Response Inspector Sub-Tab */}
            {webTab === 'response' && (
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${webResponse.status === 200 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-rose-950 text-rose-400 border border-rose-500/40'}`}>
                      {webResponse.status} {webResponse.statusText}
                    </span>
                    <span className="text-xs text-slate-400">{webResponse.elapsedMs} ms</span>
                  </div>
                  <button
                    onClick={() => {
                      const hash = `sha256_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;
                      addEvidence({
                        engagementId: currentOrg.id,
                        assetId: 'asset-web',
                        assetIp: '10.10.20.10',
                        type: 'HTTP_RESPONSE',
                        description: `HTTP Response artifact from ${webReqUrl}`,
                        rawContent: `HTTP ${webResponse.status}\n\n${webResponse.body}`,
                        analystNote: `Captured web security test response on ${currentOrg.codename}`,
                        verified: true,
                        integrityHash: hash
                      });
                      alert('Captured HTTP response artifact to Evidence Locker.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold cursor-pointer"
                  >
                    + Preserve HTTP Evidence
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 rounded-xl text-xs text-slate-200 leading-relaxed overflow-x-auto border border-slate-800 max-h-[350px]">
                  {webResponse.body}
                </pre>
              </div>
            )}

            {/* Backend Source Files View */}
            {webTab === 'source' && (
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-300 font-bold">
                    File: {currentOrg.webApp?.sourceFiles[0]?.filename || 'server.js'}
                  </span>
                  <span className="text-xs text-rose-400 font-mono">
                    {currentOrg.webApp?.sourceFiles[0]?.explanation}
                  </span>
                </div>
                <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-slate-200 border border-slate-800 leading-relaxed overflow-x-auto">
                  {currentOrg.webApp?.sourceFiles[0]?.code || '// Source unavailable'}
                </pre>
              </div>
            )}

            {/* Live Database View */}
            {webTab === 'database' && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
                <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" /> Live Database State (PostgreSQL / MySQL Sandbox)
                </h3>
                {liveDb.map((tbl, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase">Table: {tbl.tableName}</span>
                    <div className="overflow-x-auto border border-slate-800 rounded-xl">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                          <tr>
                            {tbl.columns.map(c => (
                              <th key={c} className="p-2.5 font-bold uppercase">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-950/60 text-slate-200">
                          {tbl.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-900/60">
                              {tbl.columns.map(c => (
                                <td key={c} className="p-2.5">{String(row[c] || '')}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Web Server Logs */}
            {webTab === 'logs' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <span className="text-slate-400 block mb-2">/var/log/apache2/access.log (Live Tail):</span>
                <div className="space-y-1 text-slate-300">
                  <p>10.10.20.254 - - [{new Date().toLocaleDateString()}:10:04:12 +0000] "GET /api/v1/shipments?trackingId=ACME-90210 HTTP/1.1" 200 482</p>
                  <p className="text-rose-400">10.10.20.254 - - [{new Date().toLocaleDateString()}:10:05:01 +0000] "GET /api/v1/shipments?trackingId=' UNION SELECT ... HTTP/1.1" 200 1204</p>
                  <p>10.10.20.254 - - [{new Date().toLocaleDateString()}:10:06:18 +0000] "GET /favicon.ico HTTP/1.1" 404 196</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ACTIVE DIRECTORY & WINDOWS LAB */}
      {/* ========================================================================= */}
      {activeTab === 'active-directory' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-cyan-400" /> Active Directory Domain: {currentOrg.activeDirectory?.domainName || 'NEXUS.EDU.LOCAL'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Primary Domain Controller: <span className="text-cyan-300 font-mono">{currentOrg.activeDirectory?.domainController || 'DC01'} ({currentOrg.activeDirectory?.domainControllerIp || '172.28.0.5'})</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                  BloodHound Graph Active
                </span>
              </div>
            </div>

            {/* BloodHound Style Attack Path Graph */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Attack Path Graph (Shortest Path to Domain Admin):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentOrg.activeDirectory?.attackPaths.map(step => (
                  <div key={step.step} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 relative">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold">STEP {step.step}</span>
                      <span className="text-rose-400">{step.technique}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-bold">{step.action}</p>
                    <div className="text-[11px] font-mono text-slate-400">
                      <div><span className="text-slate-400">Source:</span> {step.source}</div>
                      <div><span className="text-slate-400">Target:</span> {step.target}</div>
                    </div>
                    <p className="text-[11px] text-cyan-300 font-mono bg-slate-950 p-1.5 rounded">
                      {step.evidenceText}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Users & Kerberoastable Accounts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase block">Enumerated Domain Users</span>
                <div className="space-y-2">
                  {currentOrg.activeDirectory?.users.map(u => (
                    <div key={u.username} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-100 block">{u.displayName} ({u.username})</span>
                        <span className="text-slate-400 text-[11px]">{u.title} • {u.department}</span>
                      </div>
                      {u.spn && (
                        <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold">
                          KERBEROASTABLE SPN
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Defender Event Log Telemetry (Event ID 4769) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-rose-300 font-bold uppercase block">Defender Windows Security Logs</span>
                <div className="p-3 rounded-lg bg-slate-900 text-xs font-mono space-y-2 text-slate-300">
                  <p className="text-rose-400 font-bold">Event ID 4769: A Kerberos service ticket was requested</p>
                  <p>Target UserName: svc_mssql@nexus.edu.local</p>
                  <p>Service Name: MSSQLSvc/fs01.nexus.edu.local:1433</p>
                  <p>Ticket Options: 0x40810000</p>
                  <p className="text-amber-400">Ticket Encryption Type: 0x17 (RC4-HMAC weak encryption detected)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CLOUD SECURITY SIMULATION (AWS/AZURE/GCP) */}
      {/* ========================================================================= */}
      {activeTab === 'cloud-security' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-amber-400" /> Cloud Provider: AWS (Account: {currentOrg.cloud?.accountId || '987654321098'})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Simulated IAM Policies, S3 Storage Buckets & Metadata Endpoint</p>
              </div>
            </div>

            {/* IAM Policy Auditor */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-cyan-300 font-bold uppercase block">
                Overprivileged IAM Roles & Policies:
              </span>
              {currentOrg.cloud?.iamRoles.map(role => (
                <div key={role.roleName} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{role.roleName}</span>
                    {role.isOverprivileged && (
                      <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold">
                        OVERPRIVILEGED WILDCARD (*)
                      </span>
                    )}
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto">
                    {JSON.stringify(role.attachedPolicies, null, 2)}
                  </pre>
                </div>
              ))}
            </div>

            {/* S3 Storage Bucket Audit */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-amber-300 font-bold uppercase block">
                Cloud Storage Buckets & PII Exposure:
              </span>
              {currentOrg.cloud?.storageBuckets.map(b => (
                <div key={b.bucketName} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono">s3://{b.bucketName}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono font-bold">{b.visibility}</span>
                  </div>
                  <div className="space-y-1 font-mono text-slate-300">
                    {b.objects.map(obj => (
                      <div key={obj.key} className="flex items-center justify-between p-1.5 bg-slate-950 rounded">
                        <span>{obj.key} ({obj.size})</span>
                        {obj.sensitive && <span className="text-rose-400 font-bold">[SENSITIVE CREDENTIAL]</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: RED TEAM VS BLUE TEAM INCIDENT COMMAND */}
      {/* ========================================================================= */}
      {activeTab === 'incident-command' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
            {/* Perspective Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPerspective('RED_TEAM')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    perspective === 'RED_TEAM' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <Flame className="w-4 h-4" /> ATTACKER PERSPECTIVE (RED TEAM)
                </button>
                <button
                  onClick={() => setPerspective('BLUE_TEAM')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    perspective === 'BLUE_TEAM' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" /> DEFENDER PERSPECTIVE (BLUE TEAM)
                </button>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Active Mitigations: <span className="text-cyan-300 font-bold">{rangeState.appliedMitigations.length} Policies Enforced</span>
              </div>
            </div>

            {perspective === 'RED_TEAM' ? (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
                  Attacker Kill-Chain Execution Timeline ({currentOrg.name}):
                </h4>
                {currentOrg.attackChain.map((step, idx) => {
                  const isDone = rangeState.completedStages.includes(idx);
                  return (
                    <div key={idx} className={`p-4 rounded-xl border space-y-2 ${isDone ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-950 border-slate-800'}`}>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-rose-400 flex items-center gap-1.5">
                          {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4 text-rose-400" />}
                          STAGE 0{idx + 1}: {step.stage}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300">{step.mitreTactic} ({step.mitreId})</span>
                      </div>
                      <p className="text-xs text-slate-300">{step.description}</p>
                      <pre className="p-2.5 bg-slate-900/80 rounded text-xs font-mono text-emerald-400">
                        $ {step.expectedCommand}
                      </pre>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Defensive Mitigation Control Center */}
                <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" /> Blue Team Defensive Remediation Policy Center
                  </h4>
                  <p className="text-xs text-slate-400">
                    Apply defensive security controls to test how remediations block active attack vectors in the simulation:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'WAF_SQLI_PREVENTION', label: 'WAF SQLi Prevention (Prepared Statements)', desc: 'Blocks SQL injection payloads in Web Security Suite' },
                      { key: 'SUID_HARDENING', label: 'Linux SUID Hardening (chmod 0755 find)', desc: 'Prevents SUID root binary elevation via /usr/bin/find' },
                      { key: 'KERBEROS_AES_ONLY', label: 'Active Directory Kerberos AES-256 GPO', desc: 'Disables RC4-HMAC Kerberoasting ticket extraction' },
                      { key: 'AWS_IMDSV2_REQUIRED', label: 'AWS Cloud IMDSv2 Hop-Limit Rule', desc: 'Enforces session token header for metadata endpoint' }
                    ].map(m => {
                      const isApplied = rangeState.appliedMitigations.includes(m.key);
                      return (
                        <div key={m.key} className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${isApplied ? 'bg-blue-950/40 border-blue-500/50' : 'bg-slate-900 border-slate-800'}`}>
                          <div>
                            <span className="text-xs font-bold text-slate-100 font-mono block">{m.label}</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">{m.desc}</span>
                          </div>
                          <button
                            onClick={() => toggleMitigation(m.key)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer shrink-0 ${isApplied ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                          >
                            {isApplied ? 'ENFORCED' : 'APPLY'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SIEM Dynamic Event Stream */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
                    SIEM Security Alert Log Stream ({rangeState.defensiveAlerts.length} Events):
                  </h4>
                  {rangeState.defensiveAlerts.map((log, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-blue-400">{log.source} [{log.timestamp}]</span>
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold">{log.severity}</span>
                      </div>
                      <p className="text-xs text-slate-200 font-mono">{log.message}</p>
                      <div className="p-2.5 bg-blue-950/40 border border-blue-500/20 rounded-lg text-xs text-blue-200">
                        <span className="font-bold text-blue-300 block mb-0.5">Recommended Containment Action:</span>
                        {log.recommendedMitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: EVIDENCE LOCKER */}
      {/* ========================================================================= */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-purple-400" /> Preserved Forensic Evidence Artifacts ({evidenceLocker.length})
            </h3>
          </div>

          {evidenceLocker.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-slate-400 text-sm">No evidence artifacts preserved yet.</p>
              <p className="text-xs text-slate-400 font-mono">Run commands in the Terminal or Web Testing suite and click "+ EVID" to capture artifacts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidenceLocker.map(evid => (
                <div key={evid.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold border border-purple-500/40">
                      {evid.id}
                    </span>
                    <span className="text-slate-400 text-[10px]">{evid.timestamp.slice(0, 19)}</span>
                  </div>
                  <p className="text-slate-200 font-bold font-sans text-sm">{evid.description}</p>
                  <pre className="p-3 bg-slate-950 rounded-xl text-slate-300 overflow-x-auto max-h-[140px] text-[11px] leading-relaxed border border-slate-800">
                    {evid.rawContent}
                  </pre>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Hash: {evid.integrityHash?.slice(0, 24)}...</span>
                    <button
                      onClick={() => deleteEvidence(evid.id)}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: MITRE ATT&CK MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'mitre' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> MITRE ATT&CK Enterprise Matrix Mapping
          </h3>
          <p className="text-xs text-slate-400">Tactics and techniques demonstrated across the {currentOrg.name} attack chain:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs">
            {[
              { tactic: 'Reconnaissance', tech: 'T1595.001', name: 'IP Address Scanning' },
              { tactic: 'Discovery', tech: 'T1046', name: 'Network Service Discovery' },
              { tactic: 'Initial Access', tech: 'T1190', name: 'Exploit Public-Facing App' },
              { tactic: 'Privilege Escalation', tech: 'T1548.001', name: 'Setuid and Setgid' },
              { tactic: 'Credential Access', tech: 'T1558.003', name: 'Kerberoasting' },
              { tactic: 'Lateral Movement', tech: 'T1078', name: 'Valid Accounts' }
            ].map(m => (
              <div key={m.tech} className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1">
                <span className="text-[10px] text-cyan-400 block font-bold">{m.tactic}</span>
                <span className="text-xs text-white font-bold block">{m.tech}</span>
                <p className="text-[10px] text-slate-400 font-sans">{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: ATTACK CHAIN & NOTES */}
      {/* ========================================================================= */}
      {activeTab === 'notes' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" /> Full Attack Chain & Rules of Engagement
          </h3>
          <div className="space-y-3">
            {currentOrg.missionBriefing.map((b, idx) => (
              <p key={idx} className="text-xs text-slate-300 leading-relaxed font-sans">
                • {b}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: PENTEST SCORECARD & REPORT GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'report' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-mono">
                FORMAL PENETRATION TEST & IR REPORT
              </h3>
              <p className="text-xs text-slate-400">Client: {currentOrg.name} | Authorized Scope: {currentOrg.scope.authorizedSubnet} | Seed: {rangeState.seed}</p>
            </div>
            <button
              onClick={() => {
                window.print();
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Export PDF
            </button>
          </div>

          {/* Cyber Range Performance Scorecard */}
          <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" /> Learner Cyber Range Performance Scorecard
              </h4>
              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold">
                RANGE TIER: {skillScores.tier} ({skillScores.overallAvg}%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">Reconnaissance</span>
                <p className="text-base font-bold text-white">{skillScores.reconScore}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">Exploitation</span>
                <p className="text-base font-bold text-cyan-300">{skillScores.vulnScore}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">Privilege Escalation</span>
                <p className="text-base font-bold text-purple-300">{skillScores.privEscScore}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">Evidence Hashing</span>
                <p className="text-base font-bold text-emerald-300">{skillScores.evidenceScore}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">Defensive Remediation</span>
                <p className="text-base font-bold text-blue-300">{skillScores.defenseScore}%</p>
              </div>
            </div>
          </div>

          {/* Interactive Flag Submission Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3 font-mono text-xs">
            <span className="text-purple-300 font-bold uppercase block">
              Flag Submission & Objective Verification Panel:
            </span>
            <form onSubmit={handleSubmitFlag} className="flex gap-2">
              <input
                type="text"
                value={flagInputText}
                onChange={e => setFlagInputText(e.target.value)}
                placeholder={`Submit captured flag (e.g. FLAG{ACME_SQLI_CREDENTIAL_EXTRACTED_${rangeState.seed}})...`}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
              >
                Submit Flag
              </button>
            </form>

            {flagFeedback && (
              <p className="p-2 rounded bg-slate-900 text-slate-200 border border-slate-800">
                {flagFeedback}
              </p>
            )}

            {rangeState.discoveredFlags.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">Captured Flags in Current Session:</span>
                <div className="space-y-1">
                  {rangeState.discoveredFlags.map((flg, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900 text-cyan-300 text-[11px] flex items-center justify-between">
                      <span>{flg.stageName}: <strong className="text-white">{flg.flag}</strong></span>
                      <span className="text-slate-400">{flg.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">1. Executive Summary</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              During the authorized assessment of {currentOrg.name} ({currentOrg.codename}), the security testing team identified multiple critical and high-severity security vulnerabilities. Initial external reconnaissance mapped the active network perimeter on {currentOrg.scope.authorizedSubnet}, uncovering exposed management and diagnostic interfaces. Exploitation of web application parameters permitted unauthorized credential extraction and database access, culminating in internal privilege escalation.
            </p>
          </div>

          {/* Technical Findings Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">2. Technical Findings & Remediation Matrix</h4>
            <div className="space-y-3">
              {currentOrg.attackChain.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{f.stage}</span>
                    <span className="text-rose-400 font-bold">{f.mitreTactic} ({f.mitreId})</span>
                  </div>
                  <p className="text-slate-300 font-sans">{f.description}</p>
                  <p className="text-emerald-400 font-mono">Verification Payload: {f.expectedCommand}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 10: AMAN AI SECURITY INSTRUCTOR */}
      {/* ========================================================================= */}
      {activeTab === 'aman-mentor' && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 flex flex-col h-[550px] overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">AMAN 4.1 AI Security Instructor</span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  Connected to {currentOrg.codename} Range Context (Stage {rangeState.currentStageIndex + 1})
                </span>
              </div>
            </div>

            <button
              onClick={handleRequestStageHint}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Request Stage Hint
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs custom-scrollbar">
            {amanChatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-cyan-600 text-white rounded-tr-sm font-sans'
                    : 'mr-auto bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-sm font-sans'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className="text-[10px] opacity-60 block mt-1 text-right font-mono">{msg.time}</span>
              </div>
            ))}
            {isAmanThinking && (
              <div className="mr-auto p-3 rounded-2xl bg-slate-900 text-slate-400 text-xs font-mono animate-pulse">
                AMAN is analyzing target context...
              </div>
            )}
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendAmanMessage();
            }}
            className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={amanInput}
              onChange={e => setAmanInput(e.target.value)}
              placeholder="Ask AMAN for guidance, tool syntax, or hypothesis review..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isAmanThinking || !amanInput.trim()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-colors disabled:opacity-40 cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
