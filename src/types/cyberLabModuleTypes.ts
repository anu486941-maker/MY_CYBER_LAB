export type CyberLabDifficulty = 'Beginner' | 'Easy' | 'Intermediate' | 'Hard' | 'Expert';

export type CyberLabTaskType = 
  | 'knowledge' 
  | 'identification' 
  | 'terminal' 
  | 'configuration' 
  | 'investigation' 
  | 'defensive' 
  | 'flag';

export type TaskValidationStatus = 'UNATTEMPTED' | 'PASS' | 'PARTIAL' | 'FAILED';

export interface CyberLabTask {
  id: string;
  taskNumber: number;
  title: string;
  type: CyberLabTaskType;
  difficulty: CyberLabDifficulty;
  description: string;
  instructions: string;
  educationalCommandSuggestion?: string;
  questionType: 'multiple_choice' | 'text_exact' | 'terminal_command' | 'regex_match' | 'boolean';
  multipleChoiceOptions?: string[];
  correctOptionIndex?: number;
  expectedAnswers?: string[];
  requiredKeywords?: string[];
  forbiddenKeywords?: string[];
  placeholder?: string;
  hint1_concept: string;
  hint2_direction: string;
  hint3_specific: string;
  finalExplanation: string;
  xpReward: number;
  skillTested: string;
}

export interface CyberLabTheorySection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  diagramType?: 'osi_model' | 'tcp_handshake' | 'packet_structure' | 'dns_tree' | 'linux_tree' | 'owasp_sqli' | 'soc_killchain' | 'firewall_chain' | 'crypto_flow' | string;
  codeSnippet?: {
    language: string;
    code: string;
    title: string;
  };
  keyTakeaways: string[];
}

export interface SimulatedPacket {
  id: string;
  no: number;
  time: string;
  source: string;
  destination: string;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'DNS' | 'ICMP' | 'ARP' | 'TLS';
  length: number;
  info: string;
  details: string;
  flags?: string;
}

export interface SimulatedLogEntry {
  id: string;
  timestamp: string;
  facility: 'auth' | 'syslog' | 'nginx' | 'ufw' | 'snort';
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'ALERT';
  message: string;
  sourceIp?: string;
  user?: string;
}

export interface CyberLabSandboxEnvironment {
  targetName: string;
  targetIp: string;
  targetOs: string;
  isolationTier: string;
  initialTerminalLogs?: string[];
  simulatedFileSystem: Record<string, string>;
  simulatedServices: { port: number; service: string; banner: string; state: string }[];
  simulatedWebEndpoints?: { path: string; status: number; body: string; headers: Record<string, string> }[];
  simulatedNetworkPackets?: SimulatedPacket[];
  simulatedLogs?: SimulatedLogEntry[];
}

export interface CyberLabAssessmentQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CyberLabModule {
  id: string;
  code: string;
  slug: string;
  title: string;
  badge: string;
  category: 'Foundations' | 'Linux' | 'Networking' | 'Web Security' | 'Offensive' | 'Defensive & SOC' | 'Cryptography' | 'Capstone';
  difficulty: CyberLabDifficulty;
  estimatedMinutes: number;
  xpReward: number;
  skillsEarned: string[];
  prerequisites: string[];
  roleAlignment: string[];
  summary: string;
  learningObjectives: string[];
  overview: {
    introduction: string;
    whyItMatters: string;
    realWorldApplication: string;
  };
  theorySections: CyberLabTheorySection[];
  sandboxEnvironment: CyberLabSandboxEnvironment;
  tasks: CyberLabTask[];
  assessmentQuiz: {
    id: string;
    title: string;
    questions: CyberLabAssessmentQuestion[];
  };
  capstoneChallenge?: {
    title: string;
    scenario: string;
    deliverable: string;
    validationAnswer: string;
    xpReward: number;
  };
}
