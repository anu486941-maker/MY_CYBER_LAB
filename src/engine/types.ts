/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Core Type Definitions & Cyber Range Abstraction Models (Phase 1)
 */

import { MasteryLevel } from '../aman/amanLearningBrain';

export type MachineOS = 'Ubuntu 22.04 LTS' | 'Debian 12' | 'Alpine Linux' | 'Windows Server 2022' | 'Windows 11 Enterprise' | 'FreeBSD 14';

export type MachineDifficulty = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE' | 'EXPERT';

export type MachineCategory = 
  | 'LINUX'
  | 'WINDOWS'
  | 'ACTIVE_DIRECTORY'
  | 'WEB_APPLICATION'
  | 'NETWORK_INFRASTRUCTURE'
  | 'CLOUD_SECURITY'
  | 'AI_SECURITY'
  | 'FORENSICS'
  | 'SOC_BLUE_TEAM'
  | 'PURPLE_TEAM';

export type MachineAccessLevel = 'NONE' | 'DISCOVERED' | 'ENUMERATED' | 'USER_ACCESS' | 'ROOT_SYSTEM_ADMIN';

export type EnvironmentRuntimeType = 'ISOLATED_SANDBOX' | 'CONTAINERIZED_LAB' | 'VIRTUAL_RANGE' | 'SIMULATED_NODE';

export interface MachineService {
  port: number;
  protocol: 'TCP' | 'UDP';
  serviceName: string;
  product: string;
  version: string;
  banner: string;
  state: 'OPEN' | 'FILTERED' | 'CLOSED';
  isVulnerable?: boolean;
  vulnerabilityRef?: string;
}

export interface MachineVulnerability {
  id: string;
  name: string;
  cve?: string;
  cwe?: string;
  cvssScore: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitreTechnique: string;
  description: string;
  servicePort: number;
  exploitPrerequisiteConcepts: string[];
  remediationAdvice: string;
}

export interface MachineFlag {
  id: string;
  type: 'USER_FLAG' | 'ROOT_FLAG' | 'EVIDENCE_FLAG' | 'BONUS_FLAG';
  description: string;
  points: number;
  location: string;
  expectedHashSha256: string; // Authoritative validation hash
  canonicalValue: string; // Server-side reference
}

export interface MachineStateSnapshot {
  machineId: string;
  snapshotId: string;
  timestamp: string;
  accessLevel: MachineAccessLevel;
  compromisedAccounts: string[];
  modifiedFiles: Record<string, string>;
  runningProcesses: string[];
  stoppedServices: number[];
  startedServices: number[];
  discoveredCredentials: Record<string, string>;
  capturedFlags: string[];
  activeSessionsCount: number;
}

export interface CyberMachine {
  id: string;
  name: string;
  codename: string;
  hostname: string;
  ipAddress: string;
  subnet: string;
  os: MachineOS;
  difficulty: MachineDifficulty;
  category: MachineCategory;
  runtimeType: EnvironmentRuntimeType;
  description: string;
  scenario: string;
  requiredSkills: string[];
  recommendedPrerequisites: string[];
  services: MachineService[];
  vulnerabilities: MachineVulnerability[];
  flags: MachineFlag[];
  defaultCredentials: Record<string, string>;
  filesystemBaseline: Record<string, string>; // Virtual/Isolated initial file state
  authoritativeRulesOfEngagement: {
    authorizedSubnet: string;
    allowedPorts: number[];
    prohibitedTargets: string[];
  };
  learningOutcomes: string[];
  defensiveRemediation: {
    patchOverview: string;
    hardeningSteps: string[];
    verificationCommand: string;
  };
}

export interface RulesOfEngagement {
  engagementId: string;
  clientName: string;
  authorizedScope: string[]; // IP CIDRs and Hostnames
  prohibitedScope: string[];
  rules: string[];
  authorizedTools: string[];
  timeLimitMinutes: number;
  testingWindow: string;
  emergencyContact: string;
}

export interface MissionObjective {
  id: string;
  phase: 'RECONNAISSANCE' | 'ENUMERATION' | 'VULNERABILITY_ASSESSMENT' | 'INITIAL_ACCESS' | 'PRIVILEGE_ESCALATION' | 'POST_EXPLOITATION' | 'EVIDENCE_PRESERVATION' | 'REMEDIATION_VERIFICATION';
  title: string;
  description: string;
  verificationMethod: 'TERMINAL_OUTPUT' | 'FLAG_SUBMISSION' | 'EVIDENCE_RECORD' | 'DEFENSIVE_PATCH' | 'REPORT_SUBMISSION';
  targetMachineId: string;
  points: number;
  isCompleted: boolean;
  completedAt?: string;
  mitreAttackId?: string;
  validationCriteria: {
    expectedRegex?: string;
    expectedFlagHash?: string;
    requiredArtifactSha256?: string;
    requiredSkillId?: string;
  };
}

export interface GraduatedHint {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  title: string;
  hintContent: string;
  costXp: number;
  pedagogicalFocus: 'CONCEPTUAL_QUESTION' | 'EVIDENCE_DIRECTION' | 'TECHNIQUE_CATEGORY' | 'CONSTRAINED_HINT' | 'GUIDED_SOLUTION';
}

export interface CyberMission {
  id: string;
  missionCode: string;
  title: string;
  clientOrganization: string;
  classification: 'UNCLASSIFIED' | 'AUTHORIZED_TRAINING' | 'CONFIDENTIAL_ENGAGEMENT' | 'BLACK_BOX_ASSESSMENT' | 'CAPSTONE_OPERATION';
  difficulty: MachineDifficulty;
  category: MachineCategory;
  scenarioBriefing: string;
  targetMachines: string[]; // CyberMachine IDs
  rulesOfEngagement: RulesOfEngagement;
  objectives: MissionObjective[];
  graduatedHints: Record<string, GraduatedHint[]>; // objectiveId -> hints
  estimatedTimeMinutes: number;
  xpReward: number;
  requiredCurriculumLevel: number;
  requiredPrerequisiteConcepts: string[];
  careerPathAlignment: ('SOC_ANALYST' | 'PENETRATION_TESTER' | 'BLUE_TEAM' | 'CLOUD_SECURITY' | 'AI_SECURITY')[];
  dualLensDefensiveScenario?: {
    detectionObjective: string;
    patchObjective: string;
    sigmaRuleTemplate?: string;
    mitigationCommand: string;
  };
}

export type SessionLifecycleStatus = 'INITIALIZING' | 'ACTIVE' | 'PAUSED' | 'RESETTING' | 'TERMINATED' | 'EXPIRED';

export interface RangeSessionTelemetryEvent {
  timestamp: string;
  sessionId: string;
  sourceIp: string;
  targetIp: string;
  command: string;
  exitCode: number;
  actionCategory: 'RECON' | 'ENUMERATION' | 'EXPLOITATION' | 'PRIVESC' | 'EVIDENCE' | 'DEFENSE' | 'POLICY_VIOLATION';
  scopeCompliant: boolean;
  noiseScore: number;
  discoveredInfo?: string;
}

export interface CyberRangeSession {
  sessionId: string;
  learnerId: string;
  missionId: string;
  targetMachineIds: string[];
  activeMachineState: Record<string, MachineStateSnapshot>;
  attackBoxConfig: {
    attackBoxIp: string;
    hostname: string;
    currentWorkingDir: string;
    activeUser: string;
    assignedSubnet: string;
  };
  lifecycleStatus: SessionLifecycleStatus;
  startedAt: string;
  expiresAt: string;
  lastActivityAt: string;
  hintsUsedCount: number;
  telemetry: RangeSessionTelemetryEvent[];
  collectedEvidenceIds: string[];
  completedObjectiveIds: string[];
  isRealVm: boolean;
  environmentLabel: string;
}

export interface LabScopePolicy {
  authorizedSubnets: string[];
  authorizedHosts: string[];
  prohibitedRanges: string[];
  maxCommandsPerMinute: number;
  blockedToolSignatures: string[];
  enforceStrictEgressControl: boolean;
}

export interface ScopeValidationResult {
  allowed: boolean;
  sanitizedTarget?: string;
  reason?: string;
  category: 'SAFE' | 'CONTROLLED' | 'RESTRICTED' | 'BLOCKED';
  violationCode?: 'OUT_OF_SCOPE_TARGET' | 'PROHIBITED_COMMAND' | 'DESTRUCTIVE_ACTION' | 'RATE_LIMIT_EXCEEDED';
}

export interface RangeEvidenceItem {
  id: string;
  sessionId: string;
  machineId: string;
  title: string;
  type: 'NMAP_SCAN' | 'HTTP_REQUEST_RESPONSE' | 'AUTH_LOG' | 'VULNERABILITY_PROOF' | 'CREDENTIAL_ARTIFACT' | 'PAYLOAD_OUTPUT' | 'SYSTEM_TELEMETRY';
  rawContent: string;
  extractedArtifact: string;
  sha256Hash: string;
  mitreTechnique: string;
  cvssBaseScore?: number;
  riskRating: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  analystNotes: string;
  recommendedRemediation: string;
  recordedAt: string;
  verifiedByAman: boolean;
}

export interface PentestReportFinding {
  findingId: string;
  title: string;
  affectedAsset: string;
  portService: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  cvssVector?: string;
  cveOrCwe?: string;
  description: string;
  attackPathSteps: string[];
  evidenceIds: string[];
  impactAssessment: string;
  remediationAdvice: string;
  retestVerificationSteps: string;
}

export interface PentestProfessionalReport {
  reportId: string;
  sessionId: string;
  missionId: string;
  learnerId: string;
  authorCodename: string;
  createdAt: string;
  executiveSummary: string;
  scopeAndRules: {
    authorizedTargets: string[];
    testingPeriod: string;
    scopeComplianceConfirmed: boolean;
  };
  methodologySummary: string;
  findings: PentestReportFinding[];
  remediationRoadmap: {
    immediateActions: string[];
    shortTermActions: string[];
    longTermActions: string[];
  };
  amanGrading?: {
    overallScore: number;
    technicalAccuracyScore: number;
    evidenceQualityScore: number;
    remediationClarityScore: number;
    methodologyScore: number;
    letterGrade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
    strengths: string[];
    criticalGaps: string[];
    amanFeedback: string;
  };
}
