export interface NetworkTopology {
  subnet: string;
  gateway: string;
  firewallRules: string[];
}

export interface LabTaskObjective {
  id: string;
  description: string;
  verificationType: 'terminal' | 'flag' | 'evidence';
  expectedValue: string;
  isCompleted: boolean;
  mitreTechnique: string;
}

export interface DefensiveRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'WAF_FILTER' | 'IP_BLOCK' | 'SUID_HARDENING' | 'KERBEROS_AES' | 'IMDS_TOKEN' | 'CERT_REVOCATION' | 'AUTH_REQUIREMENT';
  applied: boolean;
  appliedAt?: string;
}

export interface LabHostNode {
  id: string;
  label: string;
  ip: string;
  status: 'UNKNOWN' | 'DISCOVERED' | 'ENUMERATED' | 'COMPROMISED' | 'MITIGATED';
  icon: string;
  role: string;
  dependencies: string[];
  os: string;
}

export interface LabEnvironment {
  labId: string;
  labType: string; // e.g. 'PRACTICE_LAB' | 'REAL_INCIDENT' | 'MISSION' | 'CTF'
  difficulty: 'Beginner' | 'Easy' | 'Intermediate' | 'Hard' | 'Advanced' | 'Expert' | 'Master';
  targetOrganization: string;
  targetAssets: string[];
  networkTopology: NetworkTopology;
  hosts: LabHostNode[];
  ports: number[];
  services: string[];
  versions: string[];
  simulatedCredentials: Record<string, string>; // e.g. "admin" -> "P@ssword1"
  vulnerabilities: string[];
  files: string[];
  processes: string[];
  users: string[];
  logs: string[];
  SIEMEvents: { timestamp: string; severity: string; title: string; source: string; description: string; read: boolean }[];
  flags: string[];
  defensiveControls: Record<string, DefensiveRule>;
  discoveredAssets: string[]; // IP or host IDs
  compromisedAssets: string[]; // IP or host IDs
  evidence: { id: string; title: string; type: string; rawContent: string; mitreTechnique: string; analystNote: string; sha256: string; timestamp: string; verified: boolean }[];
  learnerActions: { timestamp: string; command: string; output: string; path: string; noiseLevel: string }[];
  hypotheses: { id: string; hypothesis: string; reasoning: string; expectedResult: string; investigationPlan: string; score: number; qualityBadge: string; feedback: { strengths: string[]; missingConsiderations: string[]; recommendedNextStep: string } }[];
  score: {
    recon: number;
    investigation: number;
    reasoning: number;
    execution: number;
    evidence: number;
    totalScore: number;
    grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  };
  currentStage: number; // 1 to 12
  remediationStatus: 'UNPROTECTED' | 'PARTIALLY_REMEDIATED' | 'REMEDIATED';
  isCompleted: boolean;
  lastFailureInfo: { actionName: string; why: string; whatChanged: string; whatYouLearned: string; amanSocraticQuestion: string } | null;
  mistakeCount: number;
  noiseMeter: number;
  objectives: LabTaskObjective[];
  hintsUsed: number;
  timeline: { timestamp: string; type: string; title: string; description: string; team?: 'RED' | 'BLUE' }[];
  replaySeed: number;
  timestamps: {
    startedAt: string;
    lastUpdated: string;
    completedAt?: string;
  };
}
