import { SkillMasteryRecord } from './intelligence';

export type ExperienceLevel = 
  | 'beginner'
  | 'some_computer'
  | 'some_linux'
  | 'some_networking'
  | 'already_studying';

export type LanguagePreference = 'English' | 'Hindi' | 'Hinglish' | 'Other';

export type DailyTimeGoal = '15m' | '30m' | '1h' | '2h' | '3h_plus';

export type LearningStyle = 'reading' | 'video' | 'interactive' | 'practice' | 'missions' | 'mixed';

export type SkillStatus = 'locked' | 'learning' | 'completed' | 'mastered';

export type CareerRoleId = 
  | 'soc-analyst'
  | 'pentester'
  | 'web-security'
  | 'threat-hunter'
  | 'digital-forensics'
  | 'dfir-analyst'
  | 'cloud-security'
  | 'active-directory'
  | 'security-python'
  | 'incident-responder'
  | 'ctf-ethical-hacker'
  | 'ethical-hacker'
  | 'beginner-explore'
  | 'network-security'
  | 'blue-team'
  | 'purple-team'
  | 'security-engineer'
  | 'security-researcher'
  | 'ctf-competitor';

export interface UserProfile {
  name: string;
  codename: string;
  cyberLevel: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastActiveDate: string;
  labHours: number;
  experience: ExperienceLevel;
  experienceLevel?: ExperienceLevel | string;
  learningGoals?: string[];
  assessmentCompleted?: boolean;
  assessmentScores?: Record<string, number>;
  recommendedPath?: string[];
  emailVerified?: boolean;
  language: LanguagePreference;
  dailyTime: DailyTimeGoal;
  learningStyle: LearningStyle;
  selectedRole?: CareerRoleId | string;
  roleSelectedAt?: string;
  targetRole?: CareerRoleId | string;
  secondaryRoles?: (CareerRoleId | string)[];
  careerPath?: string;
  rank?: string;
  streakDays?: number;
  achievements?: string[];
  uid?: string;
  onboardingCompleted: boolean;
  theme: 'dark' | 'midnight' | 'cyber';
  accentColor: 'cyan' | 'emerald' | 'violet' | 'amber';
}

export interface SkillProgress {
  category: string;
  percentage: number;
  level: number;
  totalXp: number;
}

export interface LessonQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  levelId: number;
  title: string;
  duration: string;
  xpReward: number;
  summary: string;
  theoryContent: string;
  videoRecommendation?: {
    title: string;
    channel: string;
    duration: string;
    tags: string[];
  };
  interactiveExample?: {
    title: string;
    type: 'terminal' | 'network_packet' | 'binary_inspector' | 'code_snippet' | 'sql_query' | 'soc_log' | 'hex_view' | 'asm_disassembly' | 'defense_config' | string;
    description: string;
    codeOrData: string;
  };

  quiz?: LessonQuiz;
  practiceTask: string;
  completed?: boolean;
}

export interface LevelModule {
  level: number;
  title: string;
  code: string;
  description: string;
  category: string;
  status: SkillStatus;
  lessonsCount: number;
  completedLessons: number;
  xpReward: number;
  lessons: Lesson[];
  isCompleted?: boolean;
}

export interface Mission {
  id: string;
  missionNumber: string;
  title: string;
  codename: string;
  difficulty: 'Beginner' | 'Easy' | 'Intermediate' | 'Hard' | 'Advanced';
  xp: number;
  estimatedTime: string;
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  completed?: boolean;
  unlocked?: boolean;
  prerequisite: string;
  prerequisites?: string[];
  category: 'Linux' | 'Networking' | 'Recon' | 'Web' | 'Investigation';
  description: string;
  briefing: string[];
  objectives: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    hint: string;
  }[];
  rewardBadge?: string;
  classification?: 'UNCLASSIFIED' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP SECRET' | 'BLACK OPS';
  threatLevel?: 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  targetHost?: {
    name: string;
    ip: string;
    os: string;
    status: string;
    ports?: string[];
  };
  requiredTools?: string[];
  tacticalTransmission?: {
    sender: string;
    timestamp: string;
    message: string;
  };
}

export interface SkillNode {
  id: string;
  name: string;
  code: string;
  tier: number;
  category: string;
  status: SkillStatus;
  description: string;
  prerequisites: string[];
  associatedMissions: string[];
  keyConcepts: string[];
  iconName: string;
}

export interface NetworkDevice {
  id: string;
  name: string;
  role: 'Workstation' | 'Gateway / Router' | 'Web Server' | 'DNS Server' | 'Target Host' | 'Firewall';
  ip: string;
  mac: string;
  subnetMask: string;
  openPorts: { port: number; service: string; protocol: 'TCP' | 'UDP'; status: 'open' | 'filtered' }[];
  os: string;
  status: 'online' | 'analyzing' | 'vulnerable';
  description: string;
  securityNotes: string;
}

export interface CTFChallenge {
  id: string;
  title: string;
  category: 'Linux' | 'Networking' | 'Web' | 'Forensics' | 'Cryptography' | 'Privilege Escalation' | 'Windows' | 'Active Directory';
  difficulty: 'Beginner' | 'Easy' | 'Intermediate' | 'Hard' | 'Advanced';
  points: number;
  xpReward: number;
  solvedCount: number;
  solvesCount?: number;
  isSolved: boolean;
  solved?: boolean;
  description: string;
  targetHint: string;
  hint?: string;
  hints: { text: string; xpCost: number; unlocked: boolean }[];
  expectedFlagHash: string; // flag mock validation
  flagSampleFormat: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'Milestone' | 'Linux' | 'Networking' | 'CTF' | 'Dedication' | 'Web' | 'Forensics' | 'Tools' | 'General' | string;
  xp: number;
  xpReward?: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface NotebookEntry {
  id: string;
  title: string;
  category: 'Commands' | 'Concepts' | 'Lab Notes' | 'CTF Notes' | 'Mistakes' | 'Findings' | 'General' | string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export type NoteItem = NotebookEntry;
export type Note = NotebookEntry;
export type CtfChallenge = CTFChallenge;
export type SkillTreeNode = SkillNode;

export interface Bookmark {
  id: string;
  type: 'lesson' | 'mission' | 'ctf' | 'lab' | 'note';
  title: string;
  urlOrRef: string;
  addedAt: string;
}

export type SyncStatus = 'SYNCED' | 'SYNCING' | 'OFFLINE' | 'SYNC ERROR';

export type CertificateStatus = 'ISSUED' | 'VERIFIED' | 'REVOKED' | 'PENDING';

export interface CertificateRecord {
  certificateId: string;
  userId?: string;
  learnerName: string;
  codename: string;
  courseName: string;
  certificateTitle: string;
  completionDate: string;
  issueDate: string;
  trainingHours: number;
  finalScore: number;
  lessonsCompletedCount: number;
  labsCompletedCount: number;
  missionsCompletedCount: number;
  toolsMasteredCount: number;
  skillsCovered: string[];
  verificationCode: string;
  verificationUrl: string;
  status: CertificateStatus;
  issuer: {
    academyName: string;
    director: string;
    title: string;
    sealNumber: string;
  };
}

export interface CertificateInfo extends CertificateRecord {
  issuedTo?: string;
  verificationId?: string;
  completedLevels?: number;
  totalXpEarned?: number;
}

export interface CertificateRequirementItem {
  id: string;
  label: string;
  current: number;
  required: number;
  unit: string;
  isMet: boolean;
  description: string;
}

export interface VideoHistoryItem {
  id: string;
  title: string;
  channel: string;
  watchedAt: string;
  duration?: string;
  lessonId?: string;
}

export interface AiStudyPlanHistoryItem {
  id: string;
  generatedAt: string;
  targetGoal: string;
  dailyTime: string;
  days: {
    day: string;
    title: string;
    tasks: { id: string; title: string; xp: number; completed?: boolean }[];
  }[];
}

export interface CareerTrackState {
  levels: LevelModule[];
  missions: Mission[];
  ctfChallenges: CTFChallenge[];
  quizScores: Record<string, number>;
  labScores: Record<string, number>;
  ctfScores: Record<string, number>;
  completedMissions: string[];
  skillMasteries: SkillMasteryRecord[];
  xp: number;
  cyberLevel: number;
  xpToNextLevel: number;
  currentTopic: string;
  evidenceLocker: EvidenceItem[];
}

export interface UserLearningState {
  currentLevel: number;
  currentTopic: string;
  completedLessons: string[];
  completedMissions: string[];
  xp: number;
  rank: string;
  achievements: string[];
  streak: number;
  quizScores: Record<string, number>;
  labScores: Record<string, number>;
  ctfScores: Record<string, number>;
  weakSkills: string[];
  strongSkills: string[];
  studyTime: number; // in minutes
  preferredLanguage: string;
  preferredLearningStyle: string;
  dailyStudyTime: string;
  notes: NotebookEntry[];
  bookmarks: Bookmark[];
  certificateInfo: CertificateInfo | null;
  videoHistory: VideoHistoryItem[];
  aiStudyPlanHistory: AiStudyPlanHistoryItem[];
  lastSyncedAt?: string;
  activeCareerTrack?: 'ETHICAL_HACKER' | 'SOC_ANALYST';
  careerProgress?: Record<string, CareerTrackState>;
}

export interface CyberRangeLab {
  id: string;
  name: string;
  codename: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Advanced';
  targetType: string;
  targetIp: string;
  targetOs: string;
  summary: string;
  scenario: string;
  objectives: {
    id: string;
    title: string;
    phase: 'Reconnaissance' | 'Enumeration' | 'Vulnerability Analysis' | 'Initial Access' | 'Privilege Escalation' | 'Post-Exploitation';
    completed: boolean;
  }[];
  userFlagPoints: number;
  rootFlagPoints: number;
  userFlagFound: boolean;
  rootFlagFound: boolean;
  status: 'Ready' | 'Requires Local Lab';
}

export interface LearningPath {
  id: string;
  title: string;
  badge: string;
  description: string;
  difficulty: 'Pre-Security' | 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  totalModules: number;
  completedModules: number;
  icon: string;
  color: string;
  modules: {
    id: string;
    title: string;
    description: string;
    levelRef?: number;
    lessonsCount: number;
    xp: number;
    completed?: boolean;
  }[];
}

export interface SocAlert {
  id: string;
  alertCode: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'DNS' | 'SSH';
  alertTitle: string;
  description: string;
  mitreAttackId: string;
  mitreTactic: string;
  rawPayloadSnippet: string;
  verdict: 'PENDING' | 'TRUE_POSITIVE' | 'FALSE_POSITIVE' | 'QUARANTINED' | 'ESCALATED';
  xpReward: number;
  recommendedAction: string;
  explanation: string;
}

export interface ThreatHuntingCase {
  id: string;
  caseNumber: string;
  title: string;
  scenario: string;
  threatActor: string;
  difficulty: 'Intermediate' | 'Hard' | 'Advanced';
  targetSector: string;
  killChainSteps: {
    stepNumber: number;
    phase: 'Initial Access' | 'Execution' | 'Persistence' | 'Privilege Escalation' | 'Defense Evasion' | 'Credential Access' | 'Discovery' | 'Lateral Movement' | 'Collection' | 'Command and Control' | 'Exfiltration' | 'Impact';
    artifactEvidence: string;
    correctTechnique: string;
    options: string[];
    userSelectedTechnique?: string;
    isCorrect?: boolean;
    hint: string;
  }[];
  isSolved: boolean;
  xpReward: number;
}

export interface SubnetQuestion {
  id: string;
  ipAddress: string;
  cidr: number; // e.g. 24, 25, 26, 27, 28, 29, 30
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalUsableHosts: number;
  binaryMask: string;
  binaryIp: string;
}

export type CareerCategory = 'all' | 'beginner' | 'offensive' | 'defensive' | 'engineering' | 'forensics';

export interface CareerCurriculumStep {
  id: string;
  levelRef: number;
  title: string;
  shortDescription: string;
  moduleCategory: string;
  milestoneType: 'FOUNDATION' | 'CORE' | 'ADVANCED' | 'PRACTICAL_LAB' | 'MISSION' | 'CAPSTONE';
  practicalLabName?: string;
  missionName?: string;
  bossChallengeName?: string;
  toolsUsed: string[];
  estimatedHours: number;
  xpReward: number;
}

export interface CareerRole {
  id: CareerRoleId;
  title: string;
  emoji: string;
  badge: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Advanced';
  category: 'offensive' | 'defensive' | 'engineering' | 'forensics' | 'hybrid';
  estimatedWeeks: number;
  estimatedHours: number;
  beginnerFriendly: boolean;
  coreSkills: string[];
  commonTools: string[];
  careerOutcomes: {
    title: string;
    averageSalary: string;
    demand: 'High' | 'Very High' | 'Critical';
  }[];
  curriculumSequence: CareerCurriculumStep[];
  labsCount: number;
  missionsCount: number;
  capstoneProject: {
    title: string;
    description: string;
    skillsApplied: string[];
    deliverable: string;
  };
  sampleInterviewQuestions: {
    question: string;
    hint: string;
    keyConcepts: string[];
  }[];
}

// =========================================================================
// AUTHORIZED CLIENT ENGAGEMENT (ACE), EVIDENCE & REPORTING TYPES
// =========================================================================

export type EngagementSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export interface EvidenceItem {
  id: string; // e.g. EVID-001
  timestamp: string;
  engagementId: string;
  assetId: string;
  assetIp: string;
  type: 'COMMAND_OUTPUT' | 'HTTP_RESPONSE' | 'SERVICE_BANNER' | 'LOG_ENTRY' | 'VULN_PROOF' | 'OBSERVATION';
  description: string;
  rawContent: string;
  analystNote: string;
  verified: boolean;
  integrityHash?: string;
}

export interface SecurityFinding {
  id: string; // e.g. FIND-001
  engagementId: string;
  title: string;
  severity: EngagementSeverity;
  cvssScore: number;
  cvssVector?: string;
  affectedAsset: string;
  affectedComponent: string;
  cweId: string;
  owaspCategory: string;
  description: string;
  evidenceIds: string[];
  impact: string;
  likelihood: 'High' | 'Medium' | 'Low';
  remediation: string;
  references: string[];
  retestStatus: 'PENDING_REMEDIATION' | 'PATCH_APPLIED' | 'RETEST_FAILED' | 'RETEST_VERIFIED_CLOSED';
  retestNotes?: string;
  amanReviewFeedback?: {
    isValid: boolean;
    score: number;
    critique: string;
    remediationAdvice: string;
  };
}

export interface ClientTargetAsset {
  id: string;
  name: string;
  ip: string;
  role: string;
  os: string;
  environment: 'Isolated Training Sandbox Target';
  services: { port: number; name: string; version?: string; state: 'open' | 'filtered' }[];
  isVulnerable?: boolean;
  vulnerabilityHint?: string;
  patchApplied?: boolean;
}

export interface ClientEngagementObjective {
  id: string;
  title: string;
  category: 'Reconnaissance' | 'Enumeration' | 'Vulnerability Analysis' | 'Evidence Collection' | 'Remediation' | 'Reporting';
  description: string;
  points: number;
  completed: boolean;
  evidenceRequired: boolean;
  hint?: string;
}

export interface ClientEngagement {
  id: string;
  clientName: string;
  logoEmoji: string;
  engagementTitle: string;
  engagementType: string;
  industry: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Advanced' | 'Capstone';
  xpReward: number;
  estimatedMinutes: number;
  threatModel: string;
  briefing: string[];
  scope: {
    authorizedSubnet: string;
    authorizedDomains: string[];
    authorizedAssets: ClientTargetAsset[];
    prohibitedTargets: string[];
    rulesOfEngagement: string[];
  };
  objectives: ClientEngagementObjective[];
  retestScenarios?: {
    findingId: string;
    patchDescription: string;
    verificationCommand: string;
    expectedPatchedOutput: string;
  }[];
}

export interface EngagementReport {
  id: string;
  engagementId: string;
  clientName: string;
  leadAuditor: string;
  executiveSummary: string;
  scopeSummary: string;
  methodology: string;
  findings: SecurityFinding[];
  riskMatrix: { critical: number; high: number; medium: number; low: number; info: number };
  overallPosture: 'POOR' | 'MODERATE' | 'STRONG' | 'CRITICAL_RISK';
  remediationRoadmap: { phase: string; actions: string[]; timeframe: string }[];
  createdAt: string;
  score: number;
  amanEvaluation?: string;
}

export interface EthicalHackerReadiness {
  networking: number;
  linux: number;
  webSecurity: number;
  reconnaissance: number;
  enumeration: number;
  vulnerabilityAnalysis: number;
  reporting: number;
  ethicsAndScope: number;
  overallScore: number;
  readinessBand: 'NOVICE' | 'APPRENTICE' | 'TRAINEE' | 'PRACTITIONER' | 'JOB_READY_ETHICAL_HACKER';
}

// ==========================================
// VIDEO LEARNING SYSTEM TYPES
// ==========================================

export type VideoLanguage = 'English' | 'Hindi' | 'Hinglish';

export interface VideoChapter {
  title: string;
  timestamp: string;
  seconds: number;
}

export interface VideoQualityScore {
  total: number; // /100
  roleRelevance: number; // /25
  technicalAccuracy: number; // /25
  teachingClarity: number; // /20
  languageQuality: number; // /10
  practicalUsefulness: number; // /10
  recency: number; // /10
}

export interface VideoQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  provider: 'YouTube' | 'Vimeo' | 'CyberLab' | 'PeerTube' | 'Direct';
  videoUrl: string;
  embedUrl: string;
  thumbnail: string;
  language?: VideoLanguage;
  role: CareerRoleId | string;
  roles?: (CareerRoleId | string)[];
  topic: string;
  topics?: string[];
  skills?: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  durationSeconds: number;
  prerequisites: string[];
  tags: string[];
  learningObjectives: string[];
  notesSummary: string;
  keyTakeaways?: string[];
  chapters?: VideoChapter[];
  transcript?: string;
  transcriptAvailable?: boolean;
  qualityScore?: number;
  qualityBreakdown?: VideoQualityScore;
  qualityStatus?: 'VERIFIED' | 'REVIEW REQUIRED' | 'OUTDATED';
  whyRecommended?: string;
  xpReward?: number;
  instructor?: string;
  channelName?: string;
  order: number;
  learningPathStage: 'Foundations' | 'Core Skills' | 'Tool Mastery' | 'Exploitation & Defense' | 'Real-World Scenarios';
  quiz: VideoQuizQuestion[];
  relatedLab?: {
    id: string;
    name: string;
    route: string;
    description: string;
  };
  relatedMission?: {
    id: string;
    title: string;
    route: string;
    description: string;
  };
  relatedModules?: string[];
  relatedTools?: string[];
  lastVerified?: string;
}

export interface VideoUserProgress {
  videoId: string;
  completed: boolean;
  watchProgress: number; // 0 to 100 percentage
  currentTimeSeconds?: number;
  lastPosition?: number;
  lastWatchedAt: string; // ISO date string
  quizScore?: number; // 0 to 100 percentage
  quizCompleted?: boolean;
  bookmarked?: boolean;
  notes?: string;
  language?: VideoLanguage | 'Auto';
  startedAt?: string;
  completedAt?: string;
  relatedLabCompleted?: boolean;
  awardedMilestones?: ('25' | '50' | '90' | '100' | 'quiz')[];
  updatedAt?: string;
}



