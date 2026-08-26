import { computeEvidenceHash } from './evidenceIntegrity';
import { LIVE_INCIDENT_SCENARIOS, LiveIncidentScenario } from '../data/liveIncidentsData';

export interface IncidentTimelineEvent {
  timestamp: string;
  type:
    | 'OPENED'
    | 'ASSET_DISCOVERED'
    | 'SERVICE_IDENTIFIED'
    | 'HYPOTHESIS_SUBMITTED'
    | 'INVESTIGATION_PERFORMED'
    | 'VULN_CONFIRMED'
    | 'EVIDENCE_CAPTURED'
    | 'ALERT_TRIGGERED'
    | 'CONTROL_APPLIED'
    | 'RETEST_COMPLETED'
    | 'REPORT_SUBMITTED';
  title: string;
  description: string;
  team?: 'RED' | 'BLUE';
}

export interface DiscoveredAsset {
  host: string;
  ip: string;
  role: string;
  status: 'UNKNOWN' | 'DISCOVERED' | 'ENUMERATED' | 'COMPROMISED' | 'MITIGATED';
  discoveredAt?: string;
  details?: string;
}

export interface DiscoveredService {
  port: number;
  service: string;
  protocol: string;
  state: 'HIDDEN' | 'DISCOVERED' | 'ENUMERATED' | 'VULNERABLE' | 'BLOCKED';
  banner?: string;
}

export interface SocraticHypothesisState {
  id: string;
  timestamp: string;
  hypothesis: string;
  reasoning: string;
  expectedResult: string;
  investigationPlan: string;
  score: number;
  qualityBadge: string;
  feedback: {
    strengths: string[];
    missingConsiderations: string[];
    recommendedNextStep: string;
  };
}

export interface ExecutedActionState {
  id: string;
  timestamp: string;
  commandOrAction: string;
  output: string;
  path: 'HEADER_FINGERPRINT' | 'DIRECTORY_FUZZING' | 'SERVICE_ENUMERATION' | 'EXPLOIT_POC' | 'PRIVILEGE_ESCALATION' | 'DEFENSIVE_HARDENING' | 'OTHER';
  noiseLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  generatedAlertId?: string;
}

export interface CollectedEvidenceState {
  id: string;
  title: string;
  type: string;
  rawContent: string;
  mitreTechnique: string;
  analystNote: string;
  sha256: string;
  timestamp: string;
  verified: boolean;
}

export interface TriggeredAlertState {
  id: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  source: string;
  description: string;
  read: boolean;
}

export interface DefensiveControlState {
  id: string;
  name: string;
  description: string;
  ruleType: 'WAF_FILTER' | 'IP_BLOCK' | 'SUID_HARDENING' | 'KERBEROS_AES' | 'IMDS_TOKEN' | 'CERT_REVOCATION' | 'AUTH_REQUIREMENT';
  applied: boolean;
  appliedAt?: string;
}

export interface RetestResultState {
  performed: boolean;
  timestamp: string;
  beforeStatus: string; // e.g., "HTTP 200 OK — Vulnerability Triggered (Flag Compromised)"
  afterStatus: string;  // e.g., "HTTP 403 Forbidden — WAF Rule Triggered & Request Blocked"
  isMitigated: boolean;
  outputBefore: string;
  outputAfter: string;
}

export interface IncidentScoreState {
  recon: number;            // max 20
  investigation: number;    // max 15
  reasoning: number;        // max 15
  execution: number;        // max 15
  evidence: number;         // max 10
  mitre: number;            // max 5
  detectionAwareness: number; // max 5
  remediation: number;      // max 5
  retesting: number;        // max 5
  reporting: number;        // max 5
  totalScore: number;       // max 100
  grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  breakdown: Array<{ category: string; points: number; maxPoints: number; reason: string }>;
}

export interface ActionFailureInfo {
  actionName: string;
  why: string;
  whatChanged: string;
  whatYouLearned: string;
  amanSocraticQuestion: string;
}

export interface AttackerDecisionOption {
  id: string;
  label: string;
  category: 'RECON' | 'WEB' | 'CREDENTIAL' | 'CONFIG' | 'NETWORK' | 'SOCIAL_ENG' | 'SIEM_LOGS';
  description: string;
  isOptimal: boolean;
  scoreDelta: number;
  noiseDelta: 'LOW' | 'MEDIUM' | 'HIGH';
  feedback: string;
  nextSuggestedCommand?: string;
}

export interface TargetGraphNode {
  id: string;
  label: string;
  ip: string;
  status: 'UNKNOWN' | 'DISCOVERED' | 'ENUMERATED' | 'COMPROMISED' | 'MITIGATED';
  icon: string;
  role: string;
  dependencies: string[];
}

export interface IncidentState {
  incidentId: string;
  seed: number;
  currentStage: number; // 1 to 12 (Phase 3 Stages)
  activeTeam: 'RED' | 'BLUE';
  hackerMindsetMode: boolean;
  discoveredAssets: DiscoveredAsset[];
  discoveredServices: Record<string, DiscoveredService[]>; // ip -> services
  completedInvestigations: string[];
  hypotheses: SocraticHypothesisState[];
  executedActions: ExecutedActionState[];
  collectedEvidence: CollectedEvidenceState[];
  triggeredAlerts: TriggeredAlertState[];
  compromisedAssets: string[];
  defensiveControls: Record<string, DefensiveControlState>;
  remediationStatus: 'UNPROTECTED' | 'PARTIALLY_REMEDIATED' | 'REMEDIATED';
  retestResults: RetestResultState | null;
  lastFailureInfo: ActionFailureInfo | null;
  score: IncidentScoreState;
  hintsUsed: number;
  hintMultiplier: number;
  activeHintLevel: number;
  unlockedHints: Record<number, string>;
  timeline: IncidentTimelineEvent[];
  isCompleted: boolean;
  timestamps: {
    startedAt: string;
    lastUpdated: string;
    completedAt?: string;
  };
  // Phase 3 Extended State Attributes
  mentorLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  mistakeCount: number;
  noiseMeter: number;
  activeAttackPath: 'A' | 'B' | 'C';
  notebook: {
    knownFacts: string;
    hypotheses: string;
    discoveredIntel: string;
    evidenceNotes: string;
  };
  targetGraphNodes: TargetGraphNode[];
}

export interface CompactIncidentContext {
  incidentId: string;
  seed: number;
  currentStage: number;
  discoveredAssetsCount: number;
  hypothesesSubmittedCount: number;
  evidenceItemsCount: number;
  alertsTriggeredCount: number;
  remediationStatus: string;
  isRetested: boolean;
  isMitigated: boolean;
  score: number;
  grade: string;
  activeTeam: string;
  latestHypothesis?: string;
}

const STORAGE_KEY_PREFIX = 'mycyberlab_live_inc_state_';

// Helper for formatted time strings (e.g. "09:05:12")
function getCurrentTimeString(): string {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
}

export function generateInitialGraphNodes(incidentId: string, seed: number): TargetGraphNode[] {
  const ipSuffix = (seed % 80) + 10;
  const targetSubnet = '10.10.20';
  
  if (incidentId === 'live-inc-01') {
    return [
      { id: 'ext', label: 'Internet', ip: 'External', status: 'DISCOVERED', icon: 'Globe', role: 'External Attacker Space', dependencies: [] },
      { id: 'waf', label: 'WAF Proxy', ip: `${targetSubnet}.1`, status: 'DISCOVERED', icon: 'Shield', role: 'Gateway Firewall Proxy', dependencies: ['ext'] },
      { id: 'web', label: 'Web Server', ip: `${targetSubnet}.${ipSuffix}`, status: 'DISCOVERED', icon: 'Server', role: 'Public-Facing REST API Server', dependencies: ['waf'] },
      { id: 'db', label: 'Database Node', ip: `${targetSubnet}.${ipSuffix + 15}`, status: 'UNKNOWN', icon: 'Database', role: 'Internal DB (PostgreSQL)', dependencies: ['web'] },
      { id: 'auth', label: 'Identity Vault', ip: `${targetSubnet}.${ipSuffix + 45}`, status: 'UNKNOWN', icon: 'Key', role: 'SSO Storage & Key Management', dependencies: ['db'] },
      { id: 'dc', label: 'Domain Controller', ip: `${targetSubnet}.${ipSuffix + 90}`, status: 'UNKNOWN', icon: 'Cpu', role: 'Active Directory Domain Controller', dependencies: ['auth'] }
    ];
  } else {
    return [
      { id: 'ext', label: 'Internet', ip: 'External', status: 'DISCOVERED', icon: 'Globe', role: 'External Attacker Space', dependencies: [] },
      { id: 'waf', label: 'Edge Gateway', ip: `${targetSubnet}.1`, status: 'DISCOVERED', icon: 'Shield', role: 'Ingress Router', dependencies: ['ext'] },
      { id: 'web', label: 'Target System', ip: `${targetSubnet}.${ipSuffix}`, status: 'DISCOVERED', icon: 'Server', role: 'Primary Host System', dependencies: ['waf'] },
      { id: 'db', label: 'Database Host', ip: `${targetSubnet}.${ipSuffix + 15}`, status: 'UNKNOWN', icon: 'Database', role: 'Secure DB Cluster', dependencies: ['web'] },
      { id: 'dc', label: 'Control Plane', ip: `${targetSubnet}.${ipSuffix + 90}`, status: 'UNKNOWN', icon: 'Cpu', role: 'Cloud Admin Console', dependencies: ['db'] }
    ];
  }
}

/**
 * Generates initial state deterministically derived from a seed number.
 */
export function createInitialIncidentState(incidentId: string, seed: number = 2026): IncidentState {
  const scenario = LIVE_INCIDENT_SCENARIOS.find(s => s.id === incidentId) || LIVE_INCIDENT_SCENARIOS[0];
  const now = getCurrentTimeString();
  const dateIso = new Date().toISOString();

  // Derive seed-based variations (for replayability)
  const ipSuffix = (seed % 80) + 10;
  const targetSubnet = scenario.authorizedScope[0] ? scenario.authorizedScope[0].split('/')[0].replace(/\.\d+$/, '') : '10.10.20';

  // Seeded Known vs Hidden Assets
  const knownAssets: DiscoveredAsset[] = scenario.knownAssets.map((asset, idx) => ({
    host: asset.host,
    ip: idx === 0 ? `${targetSubnet}.${ipSuffix}` : `${targetSubnet}.${ipSuffix + 15}`,
    role: asset.role,
    status: idx === 0 ? 'DISCOVERED' : 'UNKNOWN',
    discoveredAt: idx === 0 ? now : undefined,
    details: asset.status
  }));

  // Add seed-based hidden targets
  const hiddenAsset1: DiscoveredAsset = {
    host: `internal-auth-vault-${seed % 100}`,
    ip: `${targetSubnet}.${ipSuffix + 45}`,
    role: 'Internal SSO & Identity Gateway',
    status: 'UNKNOWN'
  };
  const hiddenAsset2: DiscoveredAsset = {
    host: `backup-storage-${seed % 50}`,
    ip: `${targetSubnet}.${ipSuffix + 90}`,
    role: 'Cold Storage & Log Audit Server',
    status: 'UNKNOWN'
  };

  const allAssets = [...knownAssets, hiddenAsset1, hiddenAsset2];

  // Default Services Map
  const discoveredServices: Record<string, DiscoveredService[]> = {};
  allAssets.forEach(ast => {
    discoveredServices[ast.ip] = [];
  });

  // Default Defensive Controls per Scenario
  const defensiveControls: Record<string, DefensiveControlState> = {};
  if (incidentId === 'live-inc-01') {
    defensiveControls['waf_sqli'] = {
      id: 'waf_sqli',
      name: 'WAF Parameterized Query & SQLi Filter',
      description: 'Blocks UNION SELECT, single-quote escaping, and SQL stack queries on /api/v1/customer.',
      ruleType: 'WAF_FILTER',
      applied: false
    };
    defensiveControls['suid_python'] = {
      id: 'suid_python',
      name: 'Revoke SUID Permissions on Python3',
      description: 'Strips binary setuid permission (chmod u-s /usr/bin/python3).',
      ruleType: 'SUID_HARDENING',
      applied: false
    };
  } else if (incidentId === 'live-inc-02') {
    defensiveControls['dicom_tls'] = {
      id: 'dicom_tls',
      name: 'DICOM AE-Title Allowlist & TLS Enforcement',
      description: 'Rejects unauthenticated ANY_AE queries on DICOM Port 104.',
      ruleType: 'AUTH_REQUIREMENT',
      applied: false
    };
    defensiveControls['block_ot_ip'] = {
      id: 'block_ot_ip',
      name: 'IPTables Border Isolation for PACS',
      description: 'Restricts TCP port 104 access strictly to PACS gateway 10.10.30.22.',
      ruleType: 'IP_BLOCK',
      applied: false
    };
  } else if (incidentId === 'live-inc-03') {
    defensiveControls['kerberos_aes'] = {
      id: 'kerberos_aes',
      name: 'Enforce AES256-HMAC Kerberos Policy',
      description: 'Disables legacy RC4-HMAC (0x17) ticket encryption for SPNs and rotates service account secrets.',
      ruleType: 'KERBEROS_AES',
      applied: false
    };
  } else if (incidentId === 'live-inc-04') {
    defensiveControls['imds_v2'] = {
      id: 'imds_v2',
      name: 'AWS IMDSv2 Hop-Limit & Token Enforcement',
      description: 'Requires HTTP PUT x-aws-ec2-metadata-token headers and sets hop limit to 1.',
      ruleType: 'IMDS_TOKEN',
      applied: false
    };
  } else {
    defensiveControls['isolate_dga'] = {
      id: 'isolate_dga',
      name: 'Isolate Update Server & Revoke Code Signing Cert',
      description: 'Blocks outbound DGA C2 traffic and revokes compromised supply chain certificate.',
      ruleType: 'CERT_REVOCATION',
      applied: false
    };
  }

  // Convert scenario initial evidence to state evidence
  const initialEvidence: CollectedEvidenceState[] = scenario.initialEvidence.map(ev => ({
    id: ev.id,
    title: ev.title,
    type: ev.type,
    rawContent: ev.rawContent,
    mitreTechnique: ev.mitreTechnique,
    analystNote: ev.analystNote,
    sha256: ev.sha256 || computeEvidenceHash(scenario.targetOrgId, allAssets[0].ip, now, ev.rawContent),
    timestamp: now,
    verified: true
  }));

  const initialTimeline: IncidentTimelineEvent[] = [
    {
      timestamp: now,
      type: 'OPENED',
      title: 'Incident Investigation Opened',
      description: `Dispatched lead responder to handle ${scenario.code} (${scenario.title}). Authorized scope: ${scenario.authorizedScope.join(', ')}.`,
      team: 'RED'
    },
    {
      timestamp: now,
      type: 'ASSET_DISCOVERED',
      title: `Initial Asset Identified: ${allAssets[0].host}`,
      description: `Target IP ${allAssets[0].ip} marked in active investigation scope.`,
      team: 'RED'
    }
  ];

  const initialAlerts: TriggeredAlertState[] = [
    {
      id: `alert-init-1`,
      timestamp: now,
      severity: 'MEDIUM',
      title: 'Initial SIEM Anomaly Logged',
      source: scenario.knownAssets[0]?.host || 'Gateway-SIEM',
      description: `Anomalous query pattern logged on primary ingress node.`,
      read: false
    }
  ];

  return {
    incidentId,
    seed,
    currentStage: 1,
    activeTeam: 'RED',
    hackerMindsetMode: false,
    discoveredAssets: allAssets,
    discoveredServices,
    completedInvestigations: [],
    hypotheses: [],
    executedActions: [],
    collectedEvidence: initialEvidence,
    triggeredAlerts: initialAlerts,
    compromisedAssets: [],
    defensiveControls,
    remediationStatus: 'UNPROTECTED',
    retestResults: null,
    lastFailureInfo: null,
    score: calculateIncidentScore({
      recon: 10,
      investigation: 0,
      reasoning: 0,
      execution: 0,
      evidence: 10,
      mitre: 5,
      detectionAwareness: 5,
      remediation: 0,
      retesting: 0,
      reporting: 0,
      hintsUsed: 0,
      executedActionsCount: 0
    }),
    hintsUsed: 0,
    hintMultiplier: 1.0,
    activeHintLevel: 0,
    unlockedHints: {},
    timeline: initialTimeline,
    isCompleted: false,
    timestamps: {
      startedAt: dateIso,
      lastUpdated: dateIso
    },
    // Phase 3 Extended State Attributes
    mentorLevel: 'INTERMEDIATE',
    mistakeCount: 0,
    noiseMeter: 10,
    activeAttackPath: 'A',
    notebook: {
      knownFacts: '',
      hypotheses: '',
      discoveredIntel: '',
      evidenceNotes: ''
    },
    targetGraphNodes: generateInitialGraphNodes(incidentId, seed)
  };
}

/**
 * Loads incident state from localStorage or initializes a new one.
 */
export function loadIncidentState(incidentId: string, customSeed?: number): IncidentState {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${incidentId}`);
    if (raw && !customSeed) {
      const parsed: IncidentState = JSON.parse(raw);
      if (parsed && parsed.incidentId === incidentId) {
        if (!parsed.mentorLevel) parsed.mentorLevel = 'INTERMEDIATE';
        if (parsed.mistakeCount === undefined) parsed.mistakeCount = 0;
        if (parsed.noiseMeter === undefined) parsed.noiseMeter = 10;
        if (!parsed.activeAttackPath) parsed.activeAttackPath = 'A';
        if (!parsed.notebook) {
          parsed.notebook = { knownFacts: '', hypotheses: '', discoveredIntel: '', evidenceNotes: '' };
        }
        if (!parsed.targetGraphNodes || parsed.targetGraphNodes.length === 0) {
          parsed.targetGraphNodes = generateInitialGraphNodes(parsed.incidentId, parsed.seed);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Failed to parse saved incident state for ${incidentId}:`, err);
  }
  const newState = createInitialIncidentState(incidentId, customSeed || 2026);
  saveIncidentState(newState);
  return newState;
}

/**
 * Saves incident state to localStorage.
 */
export function saveIncidentState(state: IncidentState): void {
  try {
    state.timestamps.lastUpdated = new Date().toISOString();
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${state.incidentId}`, JSON.stringify(state));
  } catch (err) {
    console.error(`Failed to save incident state for ${state.incidentId}:`, err);
  }
}

/**
 * Resets incident with a new deterministic seed (Replay mode).
 */
export function resetIncidentWithSeed(incidentId: string, newSeed?: number): IncidentState {
  const seed = newSeed || Math.floor(Math.random() * 9000) + 1000;
  const state = createInitialIncidentState(incidentId, seed);
  saveIncidentState(state);
  return state;
}

/**
 * Executes a simulated command in the reactive target environment.
 */
export function executeSimulatedCommand(
  state: IncidentState,
  commandStr: string
): { updatedState: IncidentState; output: string; alertGenerated?: TriggeredAlertState } {
  const cmd = commandStr.trim();
  const lower = cmd.toLowerCase();
  const now = getCurrentTimeString();

  // Phase 3 Professional Platform CLI Utility Commands Interceptor
  if (lower === 'help' || lower === '?') {
    return {
      updatedState: state,
      output: `==================================================================
           MY CYBER LAB — PROFESSIONAL INTEGRATED CYBER-RANGE
==================================================================

[PLATFORM WORKFLOW COMMANDS]
  help        - Displays this multi-pane helper guide.
  history     - Lists previously executed command sequences in active cache.
  clear       - Clears CLI terminal output logs (client-side simulation).
  reset       - Restores range environment to pristine seed state.
  evidence    - Lists cryptographically locked SHA-256 evidence.
  target      - Prints the current stateful Target Network Node Graph (ASCII).
  objectives  - Displays active lifecycle stage objectives & validation status.
  notes       - Outputs current Investigation Notebook contents.
  timeline    - Chronicles all timeline events for Red/Blue forensic auditing.
  hints       - Request Socratic clues relative to active mentor level settings.

[ACTIVE PENETRATION TESTING UTILITIES]
  ping <ip>   - Sends network ICMP probe packets to test host availability.
  nmap <ip>   - Runs aggressive TCP port scan & service version audit.
  curl <url>  - Sends HTTP request headers or data bodies to target web app.
  gobuster    - Fuzzes endpoint subdirectories and public resources.
  sqlmap      - Automated SQL Injection vulnerability validator.
  ssh <user>  - Authenticates secure shell terminal sessions on targets.
  whoami / id - Queries active shell privileges and user identity groups.
  find <args> - Audits filesystem permissions (e.g. SUID python3).`
    };
  }

  if (lower === 'history') {
    const historyLogs = [...state.executedActions].reverse().map((a, idx) => `[${idx + 1}] ${a.timestamp} - $ ${a.commandOrAction}`).join('\n');
    return {
      updatedState: state,
      output: historyLogs ? `[CLI COMMAND HISTORY CACHE]:\n${historyLogs}` : `No commands logged in the active session history.`
    };
  }

  if (lower === 'reset') {
    const freshState = createInitialIncidentState(state.incidentId, state.seed);
    saveIncidentState(freshState);
    return {
      updatedState: freshState,
      output: `[SYSTEM RESET]: Target environment restored to seed: ${state.seed}. All states, graphs, and evidence re-initialized.`
    };
  }

  if (lower === 'evidence') {
    if (state.collectedEvidence.length === 0) {
      return {
        updatedState: state,
        output: `[FORENSIC LOCKER]: Empty. No cryptographically locked evidence has been collected yet.`
      };
    }
    const evidenceList = state.collectedEvidence.map(ev => 
      `--------------------------------------------------
ID: ${ev.id}
Title: ${ev.title}
Type: ${ev.type}
Technique: ${ev.mitreTechnique}
Analyst Note: ${ev.analystNote}
SHA-256 Integrity Hash:
  ${ev.sha256}
Captured At: ${ev.timestamp}`
    ).join('\n');
    return {
      updatedState: state,
      output: `==================================================
        FORENSIC EVIDENCE LOCKER (INTEGRITY SECURED)
==================================================
Total Items: ${state.collectedEvidence.length}

${evidenceList}`
    };
  }

  if (lower === 'target' || lower === 'graph') {
    const lines: string[] = [];
    lines.push(`==================================================================`);
    lines.push(`          STATEFUL NETWORK RELATIONSHIP TOPOLOGY GRAPH`);
    lines.push(`==================================================================\n`);
    
    state.targetGraphNodes.forEach((node, idx) => {
      const statusSymbol = 
        node.status === 'COMPROMISED' ? '☠️ [COMPROMISED]' :
        node.status === 'MITIGATED' ? '🛡️ [HARDENED/MITIGATED]' :
        node.status === 'ENUMERATED' ? '🔍 [ENUMERATED]' :
        node.status === 'DISCOVERED' ? '⚠️ [DISCOVERED]' :
                                      '❓ [UNKNOWN/ENCRYPTED]';
      
      const ipStr = node.status === 'UNKNOWN' ? 'XX.XX.XX.XX' : node.ip;
      const labelStr = node.status === 'UNKNOWN' ? '???' : node.label;
      const roleStr = node.status === 'UNKNOWN' ? 'Cryptographic protection active' : node.role;
      
      lines.push(`  +-- Node ${idx + 1}: ${labelStr} (${ipStr})`);
      lines.push(`      Status:      ${statusSymbol}`);
      lines.push(`      Description: ${roleStr}`);
      if (node.dependencies.length > 0) {
        lines.push(`      Routing Dep: ${node.dependencies.join(' -> ')}`);
      }
      lines.push('');
    });
    
    lines.push(`==================================================================`);
    return {
      updatedState: state,
      output: lines.join('\n')
    };
  }

  if (lower === 'objectives') {
    const stages = [
      { num: 1, title: 'BRIEFING', desc: 'Formulate and submit a Socratic Hypothesis concerning target validations.', test: state.hypotheses.length > 0 },
      { num: 2, title: 'RECONNAISSANCE', desc: 'Perform active network scanning (nmap/ping) to identify host interfaces.', test: state.discoveredAssets.some(a => a.status !== 'UNKNOWN') },
      { num: 3, title: 'ENUMERATION', desc: 'Audit port services, headers, and endpoints (curl/gobuster).', test: state.executedActions.some(a => a.path === 'HEADER_FINGERPRINT' || a.path === 'DIRECTORY_FUZZING') },
      { num: 4, title: 'INITIAL ACCESS', desc: 'Confirm SQL Injection vulnerability with active payloads.', test: state.compromisedAssets.length > 0 },
      { num: 5, title: 'FOOTHOLD', desc: 'Lock the exfiltrated flag database artifact securely in your locker.', test: state.collectedEvidence.some(e => e.type === 'Database Flag' || e.type.toLowerCase().includes('flag')) },
      { num: 6, title: 'PRIVILEGE ESCALATION', desc: 'Locate and abuse high-privilege system assets (SUID binaries) for root.', test: state.executedActions.some(a => a.path === 'PRIVILEGE_ESCALATION') },
      { num: 7, title: 'LATERAL MOVEMENT', desc: 'Audit internal routing dependencies and pivot to internal auth hosts.', test: state.targetGraphNodes.some(n => n.id === 'auth' && n.status !== 'UNKNOWN') },
      { num: 8, title: 'OBJECTIVE ACHIEVED', desc: 'Exfiltrate complete domain credentials or corporate SSO secrets.', test: state.collectedEvidence.length >= 3 },
      { num: 9, title: 'DETECTION (SIEM)', desc: 'Inspect live SIEM alert queues to analyze operations security footprint.', test: state.triggeredAlerts.length > 2 },
      { num: 10, title: 'MITIGATION', desc: 'Deploy targeted WAF filters or strip malicious server capabilities.', test: Object.values(state.defensiveControls).some(c => c.applied) },
      { num: 11, title: 'REMEDIATION', desc: 'Deploy full hardening rules and run comprehensive retests.', test: state.retestResults !== null && state.retestResults.isMitigated },
      { num: 12, title: 'REPORT & DEBRIEF', desc: 'Compile final executive report summarising attack path and security.', test: state.isCompleted }
    ];

    const outputLines = stages.map(st => {
      const icon = st.test ? ' [COMPLETED] ' : ' [PENDING]   ';
      const indicator = st.num === state.currentStage ? ' >>> ' : '     ';
      return `${indicator}${icon} STAGE ${st.num.toString().padStart(2, '0')} - ${st.title.padEnd(22)} : ${st.desc}`;
    }).join('\n');

    return {
      updatedState: state,
      output: `==================================================================
                 ATTACK-LIFECYCLE SIMULATION OBJECTIVES
==================================================================
Active Stage: STAGE ${state.currentStage}

${outputLines}
==================================================================`
    };
  }

  if (lower === 'notes') {
    return {
      updatedState: state,
      output: `==================================================================
                     INVESTIGATION NOTEBOOK ENTRIES
==================================================================

[KNOWN FACTS]
${state.notebook.knownFacts || '(Empty notes)'}

[HYPOTHESES & QUESTIONS]
${state.notebook.hypotheses || '(Empty notes)'}

[DISCOVERED INTEL (HOSTS, SERVICES, CREDENTIALS)]
${state.notebook.discoveredIntel || '(Empty notes)'}

[EVIDENCE & FORENSIC NOTES]
${state.notebook.evidenceNotes || '(Empty notes)'}

==================================================================`
    };
  }

  if (lower === 'timeline') {
    const list = state.timeline.map(t => `[${t.timestamp}] [${t.type}] ${t.title} - ${t.description}`).join('\n');
    return {
      updatedState: state,
      output: `==================================================================
                     CHRONOLOGICAL INCIDENT TIMELINE
==================================================================
${list || 'No timeline records active.'}
==================================================================`
    };
  }

  if (lower === 'hints') {
    const hints: Record<number, string> = {
      1: 'LEVEL 1 (CONCEPTUAL): Focus on discovering active hosts. Try executing "nmap" against your subnet.',
      2: 'LEVEL 2 (RECON): Use "nmap" with service versions enabled to find vulnerable running web servers.',
      3: 'LEVEL 3 (ENUMERATION): Try directory fuzzing on the web server or fingerprinting headers with "curl -i".',
      4: 'LEVEL 4 (EXPLOIT): Execute an unsanitized SQL union query payload against "/api/v1/customer?id=101".',
      5: 'LEVEL 5 (PRIV-ESC): Audit filesystem privileges using SUID checks such as "find / -perm -4000 2>/dev/null".'
    };

    let levelNum = state.activeHintLevel === 0 ? 1 : state.activeHintLevel;
    const activeHint = hints[levelNum] || 'Audit system services and ensure WAF mitigations are in place.';
    
    // Socratic adjustments depending on mentor mode:
    let adaptedHint = activeHint;
    if (state.mentorLevel === 'EXPERT') {
      adaptedHint = `[Socratic Master - Expert Mode]: Analyze your objectives. What would a professional pentester investigate after running an initial Nmap subnet scan? Inspect the open ports on 10.10.20.10 and formulate a technical hypothesis first.`;
    } else if (state.mentorLevel === 'ADVANCED') {
      adaptedHint = `[Socratic Master - Advanced Mode]: Look closely at the open HTTP service. What headers is it returning? Have you run directory discovery yet?`;
    } else if (state.mentorLevel === 'BEGINNER') {
      adaptedHint = `[Beginner Friendly Advice]: Try typing exactly: "nmap 10.10.20.10". This will scan the primary target and unlock Stage 2!`;
    }

    state.hintsUsed += 1;
    saveIncidentState(state);

    return {
      updatedState: state,
      output: `==================================================================
                    AMAN ADAPTIVE SOCRATIC MENTOR GUIDANCE
==================================================================
Selected Mentor Mode: ${state.mentorLevel}
Active Stage Clue:
  ${adaptedHint}
==================================================================`
    };
  }

  let output = '';
  let noiseLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let path: ExecutedActionState['path'] = 'OTHER';
  let alertGenerated: TriggeredAlertState | undefined = undefined;

  const targetAsset = state.discoveredAssets[0];
  const targetIp = targetAsset?.ip || '10.10.20.10';
  const targetHost = targetAsset?.host || 'web-srv-01';

  // Check if WAF / defensive controls are active
  const isWafApplied = Object.values(state.defensiveControls).some(c => c.applied);

  if (lower.startsWith('nmap') || lower.startsWith('ping') || lower.includes('subfinder')) {
    path = 'SERVICE_ENUMERATION';
    noiseLevel = 'LOW';

    // Mark unknown assets as DISCOVERED
    state.discoveredAssets = state.discoveredAssets.map((ast, idx) => ({
      ...ast,
      status: ast.status === 'UNKNOWN' ? 'DISCOVERED' : ast.status,
      discoveredAt: ast.discoveredAt || now
    }));

    // Service enumeration
    state.discoveredServices[targetIp] = [
      { port: 80, service: 'http', protocol: 'tcp', state: isWafApplied ? 'BLOCKED' : 'VULNERABLE', banner: 'Node.js Express / PostgreSQL Gateway' },
      { port: 22, service: 'ssh', protocol: 'tcp', state: 'ENUMERATED', banner: 'OpenSSH 8.9p1 Ubuntu' },
      { port: 5432, service: 'postgresql', protocol: 'tcp', state: 'ENUMERATED', banner: 'PostgreSQL 14.5 Internal Vault' }
    ];

    output = `Starting Nmap 7.95 ( https://nmap.org )\nNmap scan report for ${targetHost} (${targetIp})\nHost is up (0.0018s latency).\nNot shown: 997 closed tcp ports\nPORT     STATE SERVICE    VERSION\n22/tcp   open  ssh        OpenSSH 8.9p1 (Ubuntu)\n80/tcp   open  http       Node.js Express Gateway (${isWafApplied ? 'WAF Filter Active' : 'Unsanitized Parameters'})\n5432/tcp open  postgresql PostgreSQL 14.5\n\n[RECON STATUS]: Discovered 3 internal subnet hosts. All ports enumerated.`;

    state.timeline.push({
      timestamp: now,
      type: 'ASSET_DISCOVERED',
      title: 'Reconnaissance Scan Executed',
      description: `Discovered services on ${targetIp}: TCP/80 (HTTP), TCP/22 (SSH), TCP/5432 (PostgreSQL).`,
      team: 'RED'
    });

    if (state.currentStage === 1) {
      state.currentStage = 2;
    }
  } else if (lower.includes('curl') && (lower.includes('-i') || lower.includes('header'))) {
    path = 'HEADER_FINGERPRINT';
    noiseLevel = 'LOW';

    output = `HTTP/1.1 200 OK\nServer: Express-NodeJS/18.16.0\nX-Powered-By: Express\nX-Database-Engine: PostgreSQL-14.5\nAccess-Control-Allow-Origin: *\nContent-Type: application/json; charset=utf-8\n\n{"status":"online","service":"Customer Vault API v1.4","endpoint":"/api/v1/customer?id=101"}`;

    state.timeline.push({
      timestamp: now,
      type: 'SERVICE_IDENTIFIED',
      title: 'HTTP Technology Fingerprinted',
      description: `Identified target web stack: Node.js Express v18.16 with PostgreSQL database backend.`,
      team: 'RED'
    });
  } else if (lower.includes('gobuster') || lower.includes('dirb') || lower.includes('ffuf') || (lower.includes('curl') && lower.includes('/api/'))) {
    path = 'DIRECTORY_FUZZING';
    noiseLevel = 'MEDIUM';

    output = `===================================================\nGobuster v3.6 - Directory Fuzzing Engine\nTarget: http://${targetIp}/\n===================================================\n[+] /api/v1/customer (Status: 200) [Size: 412]\n[+] /api/v1/auth/token (Status: 401) [Size: 84]\n[+] /api/v1/admin/export (Status: 403) [Size: 112]\n[+] /metrics (Status: 200) [Size: 3450]`;

    alertGenerated = {
      id: `alert-${Date.now()}`,
      timestamp: now,
      severity: 'MEDIUM',
      title: 'Directory Enumeration & Web Fuzzing Detected',
      source: targetHost,
      description: `Rapid sequence of HTTP GET probes targeting /api/ endpoints originating from internal test subnet.`,
      read: false
    };

    state.triggeredAlerts.unshift(alertGenerated);
    state.timeline.push({
      timestamp: now,
      type: 'INVESTIGATION_PERFORMED',
      title: 'Directory Discovery Completed',
      description: 'Discovered key API endpoints: /api/v1/customer, /api/v1/auth/token.',
      team: 'RED'
    });
  } else if (lower.includes('select') || lower.includes('union') || lower.includes('sqli') || lower.includes("id=1'")) {
    path = 'EXPLOIT_POC';
    noiseLevel = 'HIGH';

    if (isWafApplied) {
      output = `HTTP/1.1 403 Forbidden\nServer: WAF-Guard-v4\nContent-Type: text/html\n\n<html><body><h1>403 Forbidden - Security Violation</h1><p>WAF Rule #WAF-901 Triggered: SQL Injection Payload Blocked.</p></body></html>`;

      alertGenerated = {
        id: `alert-${Date.now()}`,
        timestamp: now,
        severity: 'HIGH',
        title: 'WAF Intercepted Malicious SQL Injection Payload',
        source: 'WAF-Gateway-01',
        description: `Blocked UNION SELECT payload targeting /api/v1/customer?id=101. HTTP 403 returned to client.`,
        read: false
      };
      state.triggeredAlerts.unshift(alertGenerated);
    } else {
      const flagStr = `FLAG{LIVE_INCIDENT_${state.seed}_CONFIRMED}`;
      output = `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "status": "success",\n  "resultCount": 1,\n  "data": [\n    {"id": 101, "customer_name": "Acme Capital", "ssn": "999-00-1234", "flag": "${flagStr}"}\n  ]\n}\n\n[SUCCESS]: Unsanitized SQL query executed against PostgreSQL! Proof-of-concept confirmed.`;

      targetAsset.status = 'COMPROMISED';
      if (!state.compromisedAssets.includes(targetHost)) {
        state.compromisedAssets.push(targetHost);
      }

      alertGenerated = {
        id: `alert-${Date.now()}`,
        timestamp: now,
        severity: 'HIGH',
        title: 'CRITICAL SIEM ALERT: SQL Injection Vulnerability Triggered',
        source: targetHost,
        description: `Unsanitized SQL query executed on /api/v1/customer. 1 record exfiltrated.`,
        read: false
      };
      state.triggeredAlerts.unshift(alertGenerated);

      state.timeline.push({
        timestamp: now,
        type: 'VULN_CONFIRMED',
        title: 'Vulnerability Proof-of-Concept Confirmed',
        description: `Triggered SQL Injection on /api/v1/customer. Obtained valid payload result and proof flag.`,
        team: 'RED'
      });

      if (state.currentStage === 2) {
        state.currentStage = 3;
      }
    }
  } else if (lower.includes('suid') || lower.includes('find') || lower.includes('python3') || lower.includes('setuid') || lower.includes('whoami')) {
    path = 'PRIVILEGE_ESCALATION';
    noiseLevel = 'CRITICAL';

    const isSuidStripped = state.defensiveControls['suid_python']?.applied;

    if (lower.includes('whoami') || lower.includes('id')) {
      output = `uid=0(root) gid=0(root) groups=0(root)\n[ENVIRONMENT]: Elevated root shell active on ${targetHost}.`;
    } else if (isSuidStripped) {
      output = `python3: Operation not permitted.\n[SECURITY HARDENING]: SUID bit removed from /usr/bin/python3. Privilege escalation blocked.`;
    } else {
      output = `-rwsr-xr-x 1 root root 5488720 Aug 25 03:00 /usr/bin/python3\n[EXECUTION]: python3 -c "import os; os.setuid(0); os.system('/bin/sh')"\n# whoami\nroot\n[PRIVILEGE ESCALATION SUCCESS]: Root shell established on ${targetHost}.`;

      alertGenerated = {
        id: `alert-${Date.now()}`,
        timestamp: now,
        severity: 'CRITICAL',
        title: 'CRITICAL ALERT: Root Privilege Escalation via SUID Python',
        source: targetHost,
        description: `Process python3 executed with setuid(0) by www-data. Effective UID changed to 0 (root).`,
        read: false
      };
      state.triggeredAlerts.unshift(alertGenerated);

      state.timeline.push({
        timestamp: now,
        type: 'VULN_CONFIRMED',
        title: 'Root Privilege Escalation Confirmed',
        description: 'Abused SUID python3 binary to elevate www-data shell to effective UID 0 (root).',
        team: 'RED'
      });

      if (state.currentStage === 3) {
        state.currentStage = 4;
      }
    }
  } else if (lower.startsWith('ss') || lower.startsWith('netstat')) {
    path = 'SERVICE_ENUMERATION';
    output = `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process\ntcp   LISTEN 0      128    0.0.0.0:80          0.0.0.0:*         users:(("node",pid=1420,fd=18))\ntcp   LISTEN 0      128    0.0.0.0:22          0.0.0.0:*         users:(("sshd",pid=812,fd=3))\ntcp   LISTEN 0      128    127.0.0.1:5432      0.0.0.0:*         users:(("postgres",pid=930,fd=5))`;
  } else if (lower.startsWith('ps')) {
    path = 'SERVICE_ENUMERATION';
    output = `PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n  1 root      20   0  168240  11420   8312 S   0.0   0.1  0:02.14 systemd\n812 root      20   0   15800   7200   6100 S   0.0   0.1  0:00.45 sshd: /usr/sbin/sshd -D\n930 postgres  20   0  380120  42100  31000 S   0.2   0.4  0:01.88 postgres -D /var/lib/postgresql/data\n1420 www-data 20   0  820400  94100  41200 S   0.5   0.9  0:05.12 node server.js`;
  } else if (lower.startsWith('uname')) {
    output = `Linux ${targetHost} 5.15.0-88-generic #98-Ubuntu SMP Mon Oct 2 15:18:56 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux`;
  } else if (lower.startsWith('ip a') || lower.startsWith('ip route') || lower.startsWith('ifconfig')) {
    path = 'SERVICE_ENUMERATION';
    output = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default\n    inet ${targetIp}/24 brd 10.200.1.255 scope global eth0`;
  } else if (lower.startsWith('dig') || lower.startsWith('nslookup')) {
    path = 'SERVICE_ENUMERATION';
    output = `; <<>> DiG 9.18.18-1ubuntu1-Ubuntu <<>> @10.200.1.1 api.finvault.local\n;; ANSWER SECTION:\napi.finvault.local.	300	IN	A	${targetIp}\n;; AUTHORITY SECTION:\nfinvault.local.		3600	IN	NS	ns1.finvault.local.\n;; ADDITIONAL SECTION:\nns1.finvault.local.	3600	IN	A	10.200.1.1`;
  } else if (lower.startsWith('ls')) {
    output = `total 48\ndrwxr-xr-x 4 www-data www-data 4096 Aug 25 03:00 .\ndrwxr-xr-x 3 root     root     4096 Aug 25 02:45 ..\n-rw-r--r-- 1 www-data www-data 1240 Aug 25 03:00 server.js\n-rw-r--r-- 1 www-data www-data  412 Aug 25 02:50 package.json\n-rw-r--r-- 1 www-data www-data  180 Aug 25 02:55 .env.example\ndrwxr-xr-x 2 www-data www-data 4096 Aug 25 03:00 routes`;
  } else if (lower.startsWith('chmod')) {
    output = `chmod: applied requested mode change simulation on ${targetHost}. File permissions updated.`;
  } else if (lower.includes('grep') || lower.includes('cat') || lower.includes('log') || lower.includes('siem')) {
    output = `[2026-08-25 03:00:12] SIEM-ALERT: SQLi payload detected on /api/v1/customer?id=101' UNION SELECT username,password FROM users--\n[2026-08-25 03:01:45] SYSTEM-AUDIT: /usr/bin/python3 executed with effective UID 0 by user 'www-data'\n[2026-08-25 03:02:10] NETWORK-MONITOR: 50MB database export transferred to 10.10.20.100:4444`;
  } else if (lower.startsWith('smb') || lower.includes('enum4linux') || lower.includes('share')) {
    path = 'SERVICE_ENUMERATION';
    noiseLevel = 'MEDIUM';
    output = `Sharename       Type      Comment\n---------       ----      -------\nADMIN$          Disk      Remote Admin\nC$              Disk      Default share\nIPC$            IPC       Remote IPC\nbackups         Disk      Anonymous Backup Share (READ-ONLY)\n\n[SUCCESS] Anonymous logon permitted on backups share! Listed files:\n  - backup_log_2026.csv\n  - db_creds_encrypted.txt\n  - shadow_backup.txt`;
  } else if (lower.startsWith('ssh') || lower.includes('login')) {
    path = 'PRIVILEGE_ESCALATION';
    noiseLevel = 'LOW';
    if (lower.includes('admin') || lower.includes('root')) {
      output = `Authorized login accepted via cryptographic SSH key.\nLast login: Tue Aug 25 03:00:12 2026 from 10.10.20.5\n\nwww-data@web-srv-01:~$ whoami\nwww-data\n[SUCCESS] Foothold established on web-srv-01 via SSH! Access level: www-data.`;
      
      const webNode = state.targetGraphNodes.find(n => n.id === 'web');
      if (webNode) {
        webNode.status = 'COMPROMISED';
      }
    } else {
      output = `Permission denied (publickey,password).`;
      state.mistakeCount = (state.mistakeCount || 0) + 1;
    }
  } else if (lower.includes('ldap') || lower.includes('domain') || lower.includes('kerberoast')) {
    path = 'SERVICE_ENUMERATION';
    noiseLevel = 'HIGH';
    output = `Querying Domain Controller dc-01 for SPNs...\nFound SPN: HTTP/api.finvault.local@FINVAULT.LOCAL\nHash: $krb5tgs$23$*HTTP/api.finvault.local*$...\n[INFO] Kerberos ticket exported to local memory buffer for offline cracking.`;
  } else {
    // Unrecognized commands trigger a mistake and increase the noise meter
    state.mistakeCount = (state.mistakeCount || 0) + 1;
    state.noiseMeter = Math.min((state.noiseMeter || 10) + 15, 100);
    output = `bash: command not found: ${cmd}. Run "help" to display the multi-pane security range helper guide.`;
  }

  // Record action
  const actionRecord: ExecutedActionState = {
    id: `act-${Date.now()}`,
    timestamp: now,
    commandOrAction: cmd,
    output,
    path,
    noiseLevel,
    generatedAlertId: alertGenerated?.id
  };
  state.executedActions.unshift(actionRecord);

  // Phase 3 Stateful target network relationship topology updates
  state.targetGraphNodes = state.targetGraphNodes.map(node => {
    let updatedStatus = node.status;
    
    if (node.id === 'web') {
      if (state.compromisedAssets.length > 0 || state.executedActions.some(a => a.path === 'PRIVILEGE_ESCALATION')) {
        updatedStatus = 'COMPROMISED';
      } else if (state.executedActions.some(a => a.path === 'DIRECTORY_FUZZING' || a.path === 'HEADER_FINGERPRINT')) {
        updatedStatus = 'ENUMERATED';
      } else {
        updatedStatus = 'DISCOVERED';
      }
    }
    
    if (node.id === 'db') {
      if (state.collectedEvidence.some(e => e.type.toLowerCase().includes('database') || e.type.toLowerCase().includes('db') || e.type.toLowerCase().includes('flag'))) {
        updatedStatus = 'COMPROMISED';
      } else if (state.compromisedAssets.length > 0) {
        updatedStatus = 'ENUMERATED';
      } else if (state.executedActions.some(a => a.path === 'SERVICE_ENUMERATION')) {
        updatedStatus = 'DISCOVERED';
      }
    }
    
    if (node.id === 'auth') {
      if (state.collectedEvidence.some(e => e.title.toLowerCase().includes('identity') || e.title.toLowerCase().includes('sso') || e.title.toLowerCase().includes('vault'))) {
        updatedStatus = 'COMPROMISED';
      } else if (state.collectedEvidence.length >= 2) {
        updatedStatus = 'ENUMERATED';
      } else if (state.compromisedAssets.length > 0) {
        updatedStatus = 'DISCOVERED';
      }
    }
    
    if (node.id === 'dc') {
      if (state.isCompleted) {
        updatedStatus = 'COMPROMISED';
      } else if (state.collectedEvidence.length >= 3) {
        updatedStatus = 'ENUMERATED';
      } else if (state.collectedEvidence.length >= 1) {
        updatedStatus = 'DISCOVERED';
      }
    }

    const isMitigated = Object.values(state.defensiveControls).some(c => c.applied);
    if (isMitigated && (node.id === 'web' || node.id === 'db') && state.retestResults?.isMitigated) {
      updatedStatus = 'MITIGATED';
    }

    return { ...node, status: updatedStatus };
  });

  // Dynamic Phase 3 12-Stage Attack Lifecycle calculation
  let computedStage = state.currentStage;
  
  if (state.hypotheses.length > 0 && computedStage === 1) {
    computedStage = 2; // Briefing -> Recon
  }
  if (state.executedActions.some(a => a.commandOrAction.toLowerCase().includes('nmap') || a.commandOrAction.toLowerCase().includes('ping')) && computedStage === 2) {
    computedStage = 3; // Recon -> Enumeration
  }
  if (state.executedActions.some(a => a.path === 'DIRECTORY_FUZZING' || a.path === 'HEADER_FINGERPRINT') && computedStage === 3) {
    computedStage = 4; // Enumeration -> Initial Access
  }
  if (state.compromisedAssets.length > 0 && computedStage === 4) {
    computedStage = 5; // Initial Access -> Foothold
  }
  if (state.collectedEvidence.some(e => e.type.toLowerCase().includes('flag') || e.type.toLowerCase().includes('db')) && computedStage === 5) {
    computedStage = 6; // Foothold -> Priv-Esc
  }
  if (state.executedActions.some(a => a.path === 'PRIVILEGE_ESCALATION') && computedStage === 6) {
    computedStage = 7; // Priv-Esc -> Lateral Movement
  }
  if (state.targetGraphNodes.some(n => (n.id === 'auth' || n.id === 'db') && n.status === 'ENUMERATED') && computedStage === 7) {
    computedStage = 8; // Lateral -> Objective Achieved
  }
  if (state.collectedEvidence.length >= 2 && computedStage === 8) {
    computedStage = 9; // Objective -> SIEM/Detection
  }
  if (state.triggeredAlerts.length > 2 && computedStage === 9) {
    computedStage = 10; // Detection -> Mitigation
  }
  if (Object.values(state.defensiveControls).some(c => c.applied) && computedStage === 10) {
    computedStage = 11; // Mitigation -> Remediation
  }
  if (state.retestResults && state.retestResults.isMitigated && computedStage === 11) {
    computedStage = 12; // Remediation -> Report
  }
  
  state.currentStage = computedStage;

  // Recalculate score
  state.score = calculateIncidentScore({
    recon: state.discoveredAssets.filter(a => a.status !== 'UNKNOWN').length * 5 + 5,
    investigation: state.executedActions.length * 3,
    reasoning: state.hypotheses.length > 0 ? 15 : 0,
    execution: state.compromisedAssets.length > 0 ? 15 : 5,
    evidence: state.collectedEvidence.length * 5,
    mitre: 5,
    detectionAwareness: state.triggeredAlerts.length > 3 ? 2 : 5,
    remediation: Object.values(state.defensiveControls).some(c => c.applied) ? 5 : 0,
    retesting: state.retestResults ? 5 : 0,
    reporting: state.isCompleted ? 5 : 0,
    hintsUsed: state.hintsUsed,
    executedActionsCount: state.executedActions.length
  });

  saveIncidentState(state);
  return { updatedState: state, output, alertGenerated };
}

/**
 * Records a user command or manual action.
 */
export function recordAction(state: IncidentState, actionName: string, success: boolean, details?: string): IncidentState {
  const now = getCurrentTimeString();
  const actRecord: ExecutedActionState = {
    id: `act-${Date.now()}`,
    timestamp: now,
    commandOrAction: actionName,
    output: details || (success ? 'Action executed successfully.' : 'Action failed.'),
    path: 'EXPLOIT_POC',
    noiseLevel: 'MEDIUM'
  };
  state.executedActions.unshift(actRecord);
  state.timeline.push({
    timestamp: now,
    type: 'INVESTIGATION_PERFORMED',
    title: actionName,
    description: details || 'Action completed.',
    team: state.activeTeam
  });
  saveIncidentState(state);
  return state;
}

/**
 * Adds an evidence artifact to the forensic locker.
 */
export function addEvidence(state: IncidentState, item: { title: string; type: string; rawContent: string; mitreTechnique: string; analystNote?: string }): IncidentState {
  const now = getCurrentTimeString();
  const sha256 = computeEvidenceHash(state.incidentId, '10.200.1.25', now, item.rawContent);
  const evidenceRecord: CollectedEvidenceState = {
    id: `ev-${Date.now()}`,
    timestamp: now,
    title: item.title,
    type: item.type,
    rawContent: item.rawContent,
    mitreTechnique: item.mitreTechnique,
    analystNote: item.analystNote || 'Artifact locked by analyst.',
    sha256,
    verified: true
  };
  state.collectedEvidence.unshift(evidenceRecord);
  state.timeline.push({
    timestamp: now,
    type: 'EVIDENCE_CAPTURED',
    title: `Evidence Locked: ${item.title}`,
    description: `SHA-256: ${sha256.slice(0, 16)}...`,
    team: state.activeTeam
  });
  saveIncidentState(state);
  return state;
}

/**
 * Executes a simulated defensive retest.
 */
export function runRetest(state: IncidentState, remediationDescription: string): IncidentState {
  const now = getCurrentTimeString();
  Object.keys(state.defensiveControls).forEach(k => {
    state.defensiveControls[k].applied = true;
  });
  state.remediationStatus = 'REMEDIATED';
  state.retestResults = {
    performed: true,
    timestamp: now,
    beforeStatus: 'HTTP 200 OK — Exploitation Successful',
    afterStatus: 'HTTP 403 Forbidden — WAF Rule & Security Hardening Enforced',
    isMitigated: true,
    outputBefore: 'Database exfiltration & Root UID 0 achieved.',
    outputAfter: 'HTTP 403 Forbidden on SQL payload & SUID operation blocked.'
  };
  state.timeline.push({
    timestamp: now,
    type: 'RETEST_COMPLETED',
    title: 'Defensive Retest Verification Successful',
    description: remediationDescription,
    team: 'BLUE'
  });
  state.score = calculateIncidentScore({
    recon: 20,
    investigation: 15,
    reasoning: 15,
    execution: 15,
    evidence: 10,
    mitre: 5,
    detectionAwareness: 5,
    remediation: 5,
    retesting: 5,
    reporting: 5,
    hintsUsed: state.hintsUsed,
    executedActionsCount: state.executedActions.length
  });
  saveIncidentState(state);
  return state;
}
export function submitSocraticHypothesis(
  state: IncidentState,
  hypothesisData: { hypothesis: string; reasoning: string; expectedResult: string; investigationPlan: string }
): { updatedState: IncidentState; hypothesisRecord: SocraticHypothesisState } {
  const now = getCurrentTimeString();
  const len = (hypothesisData.hypothesis + hypothesisData.reasoning + hypothesisData.investigationPlan).length;

  let score = 85;
  let qualityBadge = 'DISTINGUISHED HYPOTHESIS';
  if (len < 60) {
    score = 50;
    qualityBadge = 'NEEDS TECHNICAL REASONING';
  } else if (len > 250) {
    score = 98;
    qualityBadge = 'EXEMPLARY SOCRATIC REASONING';
  }

  const hypothesisRecord: SocraticHypothesisState = {
    id: `hypo-${Date.now()}`,
    timestamp: now,
    hypothesis: hypothesisData.hypothesis,
    reasoning: hypothesisData.reasoning,
    expectedResult: hypothesisData.expectedResult,
    investigationPlan: hypothesisData.investigationPlan,
    score,
    qualityBadge,
    feedback: {
      strengths: [
        'Correctly identified primary injection surface',
        'Specified actionable investigation command sequence'
      ],
      missingConsiderations: [
        'Ensure evidence SHA-256 hash is computed before escalation',
        'Consider WAF detection rules for repeated UNION queries'
      ],
      recommendedNextStep: 'Execute proof-of-concept payload in range sandbox to confirm hypothesis.'
    }
  };

  state.hypotheses.unshift(hypothesisRecord);
  state.timeline.push({
    timestamp: now,
    type: 'HYPOTHESIS_SUBMITTED',
    title: `Socratic Hypothesis Submitted (${score}% Quality)`,
    description: `Hypothesis: "${hypothesisData.hypothesis.substring(0, 80)}..."`,
    team: 'RED'
  });

  if (state.currentStage === 1) {
    state.currentStage = 2;
  }

  // Recalculate score
  state.score = calculateIncidentScore({
    recon: 15,
    investigation: state.executedActions.length * 3,
    reasoning: 15,
    execution: state.compromisedAssets.length > 0 ? 15 : 5,
    evidence: state.collectedEvidence.length * 5,
    mitre: 5,
    detectionAwareness: 5,
    remediation: Object.values(state.defensiveControls).some(c => c.applied) ? 5 : 0,
    retesting: state.retestResults ? 5 : 0,
    reporting: state.isCompleted ? 5 : 0,
    hintsUsed: state.hintsUsed,
    executedActionsCount: state.executedActions.length
  });

  saveIncidentState(state);
  return { updatedState: state, hypothesisRecord };
}

/**
 * Captures an evidence item into the incident state & Evidence Locker.
 */
export function captureEvidence(
  state: IncidentState,
  evidenceData: { title: string; type: string; rawContent: string; mitreTechnique: string; analystNote: string }
): { updatedState: IncidentState; evidence: CollectedEvidenceState } {
  const now = getCurrentTimeString();
  const sha256 = computeEvidenceHash('INCIDENT-ENGAGEMENT', state.discoveredAssets[0]?.ip || '10.10.20.10', now, evidenceData.rawContent);

  const evidence: CollectedEvidenceState = {
    id: `ev-${Date.now()}`,
    title: evidenceData.title,
    type: evidenceData.type,
    rawContent: evidenceData.rawContent,
    mitreTechnique: evidenceData.mitreTechnique,
    analystNote: evidenceData.analystNote,
    sha256,
    timestamp: now,
    verified: true
  };

  state.collectedEvidence.unshift(evidence);
  state.timeline.push({
    timestamp: now,
    type: 'EVIDENCE_CAPTURED',
    title: `Forensic Evidence Captured: ${evidence.title}`,
    description: `Integrity SHA-256: ${sha256.substring(0, 20)}... Mapped to ${evidence.mitreTechnique}.`,
    team: 'RED'
  });

  // Recalculate score
  state.score = calculateIncidentScore({
    recon: 15,
    investigation: 15,
    reasoning: state.hypotheses.length > 0 ? 15 : 0,
    execution: state.compromisedAssets.length > 0 ? 15 : 5,
    evidence: Math.min(10, state.collectedEvidence.length * 5),
    mitre: 5,
    detectionAwareness: 5,
    remediation: Object.values(state.defensiveControls).some(c => c.applied) ? 5 : 0,
    retesting: state.retestResults ? 5 : 0,
    reporting: state.isCompleted ? 5 : 0,
    hintsUsed: state.hintsUsed,
    executedActionsCount: state.executedActions.length
  });

  saveIncidentState(state);
  return { updatedState: state, evidence };
}

/**
 * Toggles a defensive control (Blue Team Mode).
 */
export function toggleDefensiveControl(
  state: IncidentState,
  controlId: string
): { updatedState: IncidentState; message: string } {
  const now = getCurrentTimeString();
  const ctrl = state.defensiveControls[controlId];

  if (!ctrl) {
    return { updatedState: state, message: 'Control not found' };
  }

  ctrl.applied = !ctrl.applied;
  ctrl.appliedAt = ctrl.applied ? now : undefined;

  const appliedCount = Object.values(state.defensiveControls).filter(c => c.applied).length;
  const totalCount = Object.keys(state.defensiveControls).length;

  if (appliedCount === totalCount) {
    state.remediationStatus = 'REMEDIATED';
  } else if (appliedCount > 0) {
    state.remediationStatus = 'PARTIALLY_REMEDIATED';
  } else {
    state.remediationStatus = 'UNPROTECTED';
  }

  const actionMsg = ctrl.applied ? `Applied defensive rule: ${ctrl.name}` : `Disabled defensive rule: ${ctrl.name}`;

  state.timeline.push({
    timestamp: now,
    type: 'CONTROL_APPLIED',
    title: ctrl.applied ? 'Defensive Security Control Deployed' : 'Defensive Control Disabled',
    description: `${ctrl.name}: ${ctrl.description}`,
    team: 'BLUE'
  });

  if (state.currentStage === 3 || state.currentStage === 4) {
    state.currentStage = 4;
  }

  saveIncidentState(state);
  return { updatedState: state, message: actionMsg };
}

/**
 * Runs the Retest Engine (Red Team Retest after Blue Team Remediation).
 */
export function performRetest(state: IncidentState): { updatedState: IncidentState; retest: RetestResultState } {
  const now = getCurrentTimeString();

  const isRemediated = state.remediationStatus === 'REMEDIATED' || Object.values(state.defensiveControls).some(c => c.applied);

  const flagStr = `FLAG{LIVE_INCIDENT_${state.seed}_CONFIRMED}`;
  const outputBefore = `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "status": "success",\n  "data": [{"id": 101, "customer_name": "Acme Capital", "flag": "${flagStr}"}]\n}`;

  const outputAfter = isRemediated
    ? `HTTP/1.1 403 Forbidden\nServer: WAF-Guard-v4\nX-Security-Block: WAF-901\n\n<html><body><h1>403 Forbidden</h1><p>Request blocked by active security controls.</p></body></html>`
    : outputBefore;

  const retest: RetestResultState = {
    performed: true,
    timestamp: now,
    beforeStatus: 'HTTP 200 OK — Vulnerability Triggered (Flag Compromised)',
    afterStatus: isRemediated
      ? 'HTTP 403 Forbidden — WAF Rule Triggered & Payload Blocked'
      : 'HTTP 200 OK — Vulnerability Still Unprotected',
    isMitigated: isRemediated,
    outputBefore,
    outputAfter
  };

  state.retestResults = retest;

  if (isRemediated) {
    state.discoveredAssets = state.discoveredAssets.map(ast => ({
      ...ast,
      status: ast.status === 'COMPROMISED' ? 'MITIGATED' : ast.status
    }));
  }

  state.timeline.push({
    timestamp: now,
    type: 'RETEST_COMPLETED',
    title: isRemediated ? 'Retest Succeeded: Vulnerability Mitigated' : 'Retest Warning: Vulnerability Still Exploitable',
    description: isRemediated
      ? 'Attempted original exploit payload. Target returned HTTP 403 Forbidden. Remediation verified!'
      : 'Attempted original exploit payload. Target still returned HTTP 200 OK.',
    team: 'RED'
  });

  if (isRemediated && state.currentStage < 5) {
    state.currentStage = 5;
  }

  // Recalculate score
  state.score = calculateIncidentScore({
    recon: 20,
    investigation: 15,
    reasoning: 15,
    execution: 15,
    evidence: 10,
    mitre: 5,
    detectionAwareness: 5,
    remediation: 5,
    retesting: 5,
    reporting: state.isCompleted ? 5 : 0,
    hintsUsed: state.hintsUsed,
    executedActionsCount: state.executedActions.length
  });

  saveIncidentState(state);
  return { updatedState: state, retest };
}

/**
 * Submits final mission report & calculates final grade.
 */
export function submitFinalReport(
  state: IncidentState,
  reportNotes: string
): { updatedState: IncidentState; finalScore: IncidentScoreState } {
  const now = getCurrentTimeString();

  state.isCompleted = true;
  state.timestamps.completedAt = new Date().toISOString();

  state.timeline.push({
    timestamp: now,
    type: 'REPORT_SUBMITTED',
    title: 'Executive Incident Investigation Report Submitted',
    description: `Final Incident Report documented. Technical & executive summaries locked in Evidence Locker.`,
    team: 'RED'
  });

  state.score = calculateIncidentScore({
    recon: 20,
    investigation: 15,
    reasoning: 15,
    execution: 15,
    evidence: 10,
    mitre: 5,
    detectionAwareness: 5,
    remediation: 5,
    retesting: 5,
    reporting: 5,
    hintsUsed: state.hintsUsed,
    executedActionsCount: state.executedActions.length
  });

  saveIncidentState(state);
  return { updatedState: state, finalScore: state.score };
}

/**
 * Calculates complete 10-category Incident Score (0-100) & Grade (S, A, B, C, D).
 */
export function calculateIncidentScore(params: {
  recon: number;
  investigation: number;
  reasoning: number;
  execution: number;
  evidence: number;
  mitre: number;
  detectionAwareness: number;
  remediation: number;
  retesting: number;
  reporting: number;
  hintsUsed: number;
  executedActionsCount: number;
}): IncidentScoreState {
  const recon = Math.min(20, Math.max(0, params.recon));
  const investigation = Math.min(15, Math.max(0, params.investigation));
  const reasoning = Math.min(15, Math.max(0, params.reasoning));
  const execution = Math.min(15, Math.max(0, params.execution));
  const evidence = Math.min(10, Math.max(0, params.evidence));
  const mitre = Math.min(5, Math.max(0, params.mitre));
  const detectionAwareness = Math.min(5, Math.max(0, params.detectionAwareness));
  const remediation = Math.min(5, Math.max(0, params.remediation));
  const retesting = Math.min(5, Math.max(0, params.retesting));
  const reporting = Math.min(5, Math.max(0, params.reporting));

  const rawTotal = recon + investigation + reasoning + execution + evidence + mitre + detectionAwareness + remediation + retesting + reporting;
  const hintPenalty = params.hintsUsed * 5;
  const totalScore = Math.max(0, Math.min(100, rawTotal - hintPenalty));

  let grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' = 'D';
  if (totalScore >= 95) grade = 'S+';
  else if (totalScore >= 90) grade = 'S';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B';
  else if (totalScore >= 60) grade = 'C';

  const breakdown = [
    { category: 'Reconnaissance & Asset Discovery', points: recon, maxPoints: 20, reason: recon >= 15 ? 'Discovered all target subnet assets and open ports.' : 'Partial subnet asset discovery.' },
    { category: 'Investigation & Branching Path', points: investigation, maxPoints: 15, reason: investigation >= 12 ? 'Executed clean branching investigation path.' : 'Executed basic investigation commands.' },
    { category: 'Socratic Reasoning Quality', points: reasoning, maxPoints: 15, reason: reasoning >= 12 ? 'Submitted high-scoring technical hypothesis.' : 'Hypothesis needs further detail.' },
    { category: 'Technical Exploitation & PoC', points: execution, maxPoints: 15, reason: execution >= 12 ? 'Vulnerability PoC successfully confirmed.' : 'PoC execution incomplete.' },
    { category: 'Evidence Locker & SHA-256 Hashing', points: evidence, maxPoints: 10, reason: evidence >= 8 ? 'Collected cryptographically verified evidence.' : 'Evidence collection pending.' },
    { category: 'MITRE ATT&CK Mapping', points: mitre, maxPoints: 5, reason: mitre >= 4 ? 'Accurately mapped techniques to MITRE matrix.' : 'Basic MITRE mapping.' },
    { category: 'Detection Noise Awareness', points: detectionAwareness, maxPoints: 5, reason: detectionAwareness >= 4 ? 'Maintained low SIEM detection noise profile.' : 'Generated moderate alert volume.' },
    { category: 'Remediation & Defensive Hardening', points: remediation, maxPoints: 5, reason: remediation >= 4 ? 'Applied WAF / System hardening controls.' : 'Remediation pending.' },
    { category: 'Retesting Verification', points: retesting, maxPoints: 5, reason: retesting >= 4 ? 'Verified HTTP 403 mitigation via retest.' : 'Retest verification pending.' },
    { category: 'Final Executive Reporting', points: reporting, maxPoints: 5, reason: reporting >= 4 ? 'Executive and technical report submitted.' : 'Final report pending.' }
  ];

  return {
    recon,
    investigation,
    reasoning,
    execution,
    evidence,
    mitre,
    detectionAwareness,
    remediation,
    retesting,
    reporting,
    totalScore,
    grade,
    breakdown
  };
}

/**
 * Returns compact IncidentContext for AMAN Turbo Router & Gemini AI.
 */
export function getCompactIncidentContext(state: IncidentState): CompactIncidentContext {
  return {
    incidentId: state.incidentId,
    seed: state.seed,
    currentStage: state.currentStage,
    discoveredAssetsCount: state.discoveredAssets.filter(a => a.status !== 'UNKNOWN').length,
    hypothesesSubmittedCount: state.hypotheses.length,
    evidenceItemsCount: state.collectedEvidence.length,
    alertsTriggeredCount: state.triggeredAlerts.length,
    remediationStatus: state.remediationStatus,
    isRetested: state.retestResults?.performed || false,
    isMitigated: state.retestResults?.isMitigated || false,
    score: state.score.totalScore,
    grade: state.score.grade,
    activeTeam: state.activeTeam,
    latestHypothesis: state.hypotheses[0]?.hypothesis
  };
}

/**
 * Unlocks an adaptive hint at the specified level (0 to 5) and applies score deduction.
 */
export function unlockAdaptiveHint(
  state: IncidentState,
  level: number
): { updatedState: IncidentState; hintText: string } {
  state.hintsUsed += 1;
  state.activeHintLevel = Math.max(state.activeHintLevel, level);

  const hints: Record<number, string> = {
    1: 'LEVEL 1 CONCEPTUAL CLUE: Modern REST APIs that render dynamic queries often concatenate unvalidated GET parameters directly into database calls.',
    2: 'LEVEL 2 INVESTIGATION DIRECTION: Perform directory enumeration on /api/v1/ endpoints and inspect response headers for database engine signatures.',
    3: 'LEVEL 3 TOOL CATEGORY: Use cURL to probe query parameters with single quotes (\') or SQL UNION statements to trigger error messages or data leaks.',
    4: 'LEVEL 4 SPECIFIC TECHNIQUE: Execute "curl -i http://10.200.1.25/api/v1/customer?id=101\' UNION SELECT 1,2,3,4--".',
    5: 'LEVEL 5 GUIDED WALKTHROUGH: 1. Run "nmap" to map ports. 2. Send "curl -i /api/v1/customer?id=101\' UNION SELECT 1,2,3,4--". 3. Inspect SUID Python binary via "find / -perm -4000 2>/dev/null". 4. Lock flag SHA-256 evidence in Locker.'
  };

  const hintText = hints[level] || 'Review target network map and inspect SIEM logs for anomalies.';
  state.unlockedHints[level] = hintText;

  // Recalculate score with new hint penalty
  state.score = calculateIncidentScore({
    recon: 15,
    investigation: state.executedActions.length * 3,
    reasoning: state.hypotheses.length > 0 ? 15 : 0,
    execution: state.compromisedAssets.length > 0 ? 15 : 5,
    evidence: state.collectedEvidence.length * 5,
    mitre: 5,
    detectionAwareness: 5,
    remediation: Object.values(state.defensiveControls).some(c => c.applied) ? 5 : 0,
    retesting: state.retestResults ? 5 : 0,
    reporting: state.isCompleted ? 5 : 0,
    hintsUsed: state.hintsUsed,
    executedActionsCount: state.executedActions.length
  });

  saveIncidentState(state);
  return { updatedState: state, hintText };
}

/**
 * Toggles Hacker Mindset Mode (AMAN asks probing questions instead of revealing answers).
 */
export function toggleHackerMindsetMode(state: IncidentState): IncidentState {
  state.hackerMindsetMode = !state.hackerMindsetMode;
  saveIncidentState(state);
  return state;
}

/**
 * Clears the last failure info modal trigger.
 */
export function clearLastFailureInfo(state: IncidentState): IncidentState {
  state.lastFailureInfo = null;
  saveIncidentState(state);
  return state;
}

/**
 * Returns contextual decision options for the Attacker Decision Engine ("WHAT DO YOU DO NEXT?").
 */
export function getAttackerDecisionOptions(state: IncidentState): AttackerDecisionOption[] {
  const isCompromised = state.compromisedAssets.length > 0;
  const isEnumerated = state.discoveredServices[state.discoveredAssets[0]?.ip]?.length > 0;

  if (isCompromised) {
    return [
      {
        id: 'dec-1',
        label: 'A. Check Local SUID Binaries & Escalation Paths',
        category: 'CONFIG',
        description: 'Audit filesystem permissions for binaries with SUID bit enabled (e.g. /usr/bin/python3).',
        isOptimal: true,
        scoreDelta: 15,
        noiseDelta: 'LOW',
        feedback: 'Optimal move! SUID binary auditing reveals privilege escalation primitives without generating network noise.',
        nextSuggestedCommand: 'find / -perm -4000 2>/dev/null'
      },
      {
        id: 'dec-2',
        label: 'B. Exfiltrate Full Database & Disregard Detection Noise',
        category: 'WEB',
        description: 'Dump all table schemas rapidly using automated SQL extraction threads.',
        isOptimal: false,
        scoreDelta: 5,
        noiseDelta: 'HIGH',
        feedback: 'Suboptimal. Aggressive exfiltration triggers SIEM high-severity alerts before securing local persistence.',
        nextSuggestedCommand: 'curl -i http://10.200.1.25/api/v1/customer?id=101\' UNION SELECT username,password FROM users--'
      },
      {
        id: 'dec-3',
        label: 'C. Capture SHA-256 Proof-of-Concept Evidence in Locker',
        category: 'SIEM_LOGS',
        description: 'Hash exfiltrated data payload and lock evidence in the forensic locker.',
        isOptimal: true,
        scoreDelta: 10,
        noiseDelta: 'LOW',
        feedback: 'Great forensic practice! Lock proof-of-concept evidence before proceeding to privilege escalation.'
      },
      {
        id: 'dec-4',
        label: 'D. Switch to Blue Team Mode & Apply Hardening Controls',
        category: 'CONFIG',
        description: 'Review SIEM telemetry generated by your attack and deploy protective WAF rules.',
        isOptimal: true,
        scoreDelta: 10,
        noiseDelta: 'LOW',
        feedback: 'Excellent Purple Team workflow! Transitioning to defender mode validates your remediation strategy.'
      }
    ];
  } else if (isEnumerated) {
    return [
      {
        id: 'dec-web-1',
        label: 'A. Inspect HTTP Response Headers & Server Software',
        category: 'WEB',
        description: 'Run cURL -i to identify Web Server software, framework versions, and database headers.',
        isOptimal: true,
        scoreDelta: 10,
        noiseDelta: 'LOW',
        feedback: 'Excellent! Header fingerprinting is silent and reveals critical application layer technology.',
        nextSuggestedCommand: 'curl -i http://10.200.1.25/api/v1/customer?id=101'
      },
      {
        id: 'dec-web-2',
        label: 'B. Form Socratic Vulnerability Hypothesis',
        category: 'RECON',
        description: 'Document your reasoning regarding parameter input validation in the Socratic Engine.',
        isOptimal: true,
        scoreDelta: 15,
        noiseDelta: 'LOW',
        feedback: 'Top tier reasoning! Formulating a hypothesis before attacking ensures deliberate, safe testing.'
      },
      {
        id: 'dec-web-3',
        label: 'C. Run High-Speed Directory Brute Force (Gobuster)',
        category: 'WEB',
        description: 'Fuzz 50,000 wordlist paths against the target API server.',
        isOptimal: false,
        scoreDelta: 5,
        noiseDelta: 'HIGH',
        feedback: 'High noise penalty! Massive directory fuzzing triggered SIEM directory scan alert.',
        nextSuggestedCommand: 'gobuster dir -u http://10.200.1.25/ -w /usr/share/wordlists/dirb/common.txt'
      },
      {
        id: 'dec-web-4',
        label: 'D. Review Gateway SIEM Telemetry',
        category: 'SIEM_LOGS',
        description: 'Inspect live SIEM alert logs to measure defender awareness of your initial scan.',
        isOptimal: true,
        scoreDelta: 10,
        noiseDelta: 'LOW',
        feedback: 'Smart move! Checking SIEM logs keeps you informed of defender visibility.'
      }
    ];
  } else {
    return [
      {
        id: 'dec-init-1',
        label: 'A. Perform Subnet Reconnaissance & Port Discovery',
        category: 'RECON',
        description: 'Run simulated Nmap scan against authorized range subnet 10.200.1.0/24.',
        isOptimal: true,
        scoreDelta: 15,
        noiseDelta: 'LOW',
        feedback: 'Perfect starting point! Map live target assets and open ports before attempting application probes.',
        nextSuggestedCommand: 'nmap -sV -sC 10.200.1.25'
      },
      {
        id: 'dec-init-2',
        label: 'B. Attempt SQL Injection Payload Immediately',
        category: 'WEB',
        description: 'Send UNION SELECT payload without knowing open ports or web stack.',
        isOptimal: false,
        scoreDelta: 0,
        noiseDelta: 'HIGH',
        feedback: 'Unstructured attack! Firing payloads blindly without port enumeration risks WAF blocks.',
        nextSuggestedCommand: 'curl -i http://10.200.1.25/api/v1/customer?id=101\' UNION SELECT--'
      },
      {
        id: 'dec-init-3',
        label: 'C. Inspect DNS & Subnet Topology Map',
        category: 'NETWORK',
        description: 'Query DNS resolver and review target subnet layout.',
        isOptimal: true,
        scoreDelta: 10,
        noiseDelta: 'LOW',
        feedback: 'Good passive recon! Network topology review clarifies authorized target boundaries.',
        nextSuggestedCommand: 'dig @10.200.1.1 api.finvault.local'
      },
      {
        id: 'dec-init-4',
        label: 'D. Query AMAN Copilot for Strategy Guidance',
        category: 'RECON',
        description: 'Ask AMAN Turbo Router for context-aware investigation recommendations.',
        isOptimal: true,
        scoreDelta: 10,
        noiseDelta: 'LOW',
        feedback: 'Smart copilot usage! AMAN provides instant, deterministic scenario recommendations.'
      }
    ];
  }
}

/**
 * Generates structured post-incident debrief output.
 */
export function generatePostIncidentDebrief(state: IncidentState) {
  return {
    discovered: [
      `Discovered ${state.discoveredAssets.length} network target assets across subnet`,
      `Identified open TCP ports (HTTP/80, SSH/22, PostgreSQL/5432)`,
      `Confirmed SQL Injection proof-of-concept on REST endpoint`,
      `Verified root privilege escalation path via SUID Python binary`
    ],
    missed: state.hintsUsed > 0 ? [`Relied on ${state.hintsUsed} adaptive hint(s) during investigation`] : ['No investigative steps missed (Zero hints used)'],
    didWell: [
      `Submitted ${state.hypotheses.length} high-quality Socratic hypothesis entries`,
      `Collected ${state.collectedEvidence.length} cryptographically locked SHA-256 evidence items`,
      `Executed clean Red/Blue retest verification cycle`
    ],
    didPoorly: state.triggeredAlerts.length > 3 ? ['Generated elevated SIEM alert noise during initial web probes'] : ['Maintained clean operational security profile'],
    attackPath: state.executedActions.slice(0, 5).map(a => `${a.commandOrAction} (${a.path})`),
    defensiveResponse: Object.values(state.defensiveControls).filter(c => c.applied).map(c => `${c.name} (${c.ruleType})`),
    evidenceQuality: `${state.collectedEvidence.length} Verified SHA-256 Cryptographic Artifacts (100% Chain-of-Custody)`,
    mitreTechniques: Array.from(new Set(state.collectedEvidence.map(e => e.mitreTechnique))),
    weakSkills: state.score.totalScore < 85 ? ['SIEM Detection Awareness', 'Low-Noise Web Enumeration'] : ['None identified — Outstanding Performance'],
    recommendedModules: ['Advanced WAF Evasion & Encoding', 'Linux SUID Security Audit & Privilege Hardening', 'Purple Team SIEM Correlation']
  };
}

export type TargetAsset = DiscoveredAsset;

export const IncidentStateEngine = {
  createInitialIncidentState,
  loadState: loadIncidentState,
  saveState: saveIncidentState,
  loadOrCreateState: loadIncidentState,
  resetIncidentWithSeed,
  executeSimulatedCommand,
  recordAction,
  addEvidence,
  runRetest,
  unlockAdaptiveHint,
  toggleHackerMindsetMode,
  clearLastFailureInfo,
  getAttackerDecisionOptions,
  generatePostIncidentDebrief,
  getCompactIncidentContext
};

