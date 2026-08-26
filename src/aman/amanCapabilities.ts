/**
 * AMAN Agent 2.0 - Application Capability Registry
 * Dynamic feature discovery engine describing all modules, routes, capabilities, and permitted agent actions.
 */

export interface AppCapability {
  id: string;
  name: string;
  route: string;
  category: 'LAB' | 'CURRICULUM' | 'PRACTICE' | 'CAREER' | 'PORTFOLIO' | 'SETTINGS';
  description: string;
  primaryActions: string[];
  supportedTools: string[];
  isRealWorldAligned: boolean;
}

export const APP_CAPABILITIES: AppCapability[] = [
  {
    id: 'dashboard',
    name: 'Command Center Dashboard',
    route: '/dashboard',
    category: 'CURRICULUM',
    description: 'Central overview of XP, current level, active track, streaks, and next mission steps.',
    primaryActions: ['open', 'getProgress', 'viewNextMove'],
    supportedTools: ['open_dashboard', 'get_progress', 'get_current_learning_position'],
    isRealWorldAligned: true
  },
  {
    id: 'linux-lab',
    name: 'Linux Mastery & Terminal Lab',
    route: '/linux-lab',
    category: 'LAB',
    description: 'Simulated Bash terminal for Linux filesystem navigation, user permissions, process management, and log inspection.',
    primaryActions: ['open', 'executeSimulatedCommand', 'resetLab', 'inspectFilesystem'],
    supportedTools: ['open_linux_lab', 'execute_simulated_command', 'reset_lab'],
    isRealWorldAligned: true
  },
  {
    id: 'network-lab',
    name: 'Network & Port Reconnaissance Lab',
    route: '/network-lab',
    category: 'LAB',
    description: 'Hands-on networking sandbox for Nmap port scans, CIDR subnetting, TCP/IP handshake analysis, and DNS queries.',
    primaryActions: ['open', 'runPortScan', 'calculateSubnet', 'inspectTraffic'],
    supportedTools: ['open_network_lab', 'execute_simulated_command'],
    isRealWorldAligned: true
  },
  {
    id: 'web-security-lab',
    name: 'Web Application Security Lab',
    route: '/practice/web-security',
    category: 'PRACTICE',
    description: 'OWASP Top 10 practice environment for SQL Injection, XSS, CSRF, and broken authentication scenarios.',
    primaryActions: ['open', 'testInjection', 'viewPayloads', 'analyzeDefense'],
    supportedTools: ['open_web_security_lab'],
    isRealWorldAligned: true
  },
  {
    id: 'soc-simulator',
    name: 'SOC Incident Response & SIEM Simulator',
    route: '/practice/soc-simulator',
    category: 'PRACTICE',
    description: 'Triage live SIEM alerts, correlate suspicious logs, isolate breached endpoints, and perform root-cause analysis.',
    primaryActions: ['open', 'triageAlert', 'queryLogs', 'escalateIncident'],
    supportedTools: ['open_soc_simulator'],
    isRealWorldAligned: true
  },
  {
    id: 'threat-hunting',
    name: 'Threat Hunting Range',
    route: '/practice/threat-hunting',
    category: 'PRACTICE',
    description: 'Hunt advanced persistent threats (APTs) using MITRE ATT&CK mappings, process tree analysis, and IOC correlation.',
    primaryActions: ['open', 'huntThreat', 'mapMitre', 'analyzeMemory'],
    supportedTools: ['open_threat_hunting'],
    isRealWorldAligned: true
  },
  {
    id: 'ctf-arena',
    name: 'Capture The Flag (CTF) Arena',
    route: '/ctf-arena',
    category: 'LAB',
    description: 'Gamified competitive security challenges across Cryptography, Web Exploitation, Forensics, and Reverse Engineering.',
    primaryActions: ['open', 'submitFlag', 'filterCategory'],
    supportedTools: ['open_ctf'],
    isRealWorldAligned: true
  },
  {
    id: 'evidence-locker',
    name: 'ACE Forensic Evidence Locker',
    route: '/ace',
    category: 'PORTFOLIO',
    description: 'Chain of custody evidence repository for logging verified vulnerabilities, hashes, packet dumps, and pentest findings.',
    primaryActions: ['open', 'listEvidence', 'createEvidence', 'deleteEvidence', 'exportReport'],
    supportedTools: ['open_ace', 'open_evidence_locker', 'list_evidence', 'create_evidence', 'delete_evidence', 'export_evidence'],
    isRealWorldAligned: true
  },
  {
    id: 'missions',
    name: 'Tactical Cybersecurity Missions',
    route: '/missions',
    category: 'CURRICULUM',
    description: 'Scenario-driven incident cases based on real-world breaches (e.g., SolarWinds, Capital One, Colonial Pipeline).',
    primaryActions: ['open', 'startMission', 'getMissionStatus', 'submitMissionStep'],
    supportedTools: ['open_missions', 'start_mission', 'get_mission_status', 'submit_mission_step'],
    isRealWorldAligned: true
  },
  {
    id: 'career-roles',
    name: 'Cybersecurity Career Pathways & Readiness',
    route: '/career-roles',
    category: 'CAREER',
    description: 'Industry role requirements, salary insights, prerequisite mapping, and interview preparation for SOC and Pentesting.',
    primaryActions: ['open', 'getRoleRequirements', 'recommendSkills', 'generateRoadmap'],
    supportedTools: ['open_roles', 'get_role_requirements', 'recommend_skills', 'generate_career_roadmap'],
    isRealWorldAligned: true
  },
  {
    id: 'skill-tree',
    name: 'Skill Tree & Competency Matrix',
    route: '/skill-tree',
    category: 'CURRICULUM',
    description: 'Visual competency graph detailing mastery across Linux, Networking, Web Security, SOC Triage, and Cryptography.',
    primaryActions: ['open', 'getSkillGaps', 'viewSkillMastery'],
    supportedTools: ['open_skill_tree', 'get_skill_gaps'],
    isRealWorldAligned: true
  },
  {
    id: 'study-plan',
    name: 'AI Personalized Study Plan',
    route: '/ai-study-plan',
    category: 'CURRICULUM',
    description: 'Adaptive study planner that schedules focused daily practice blocks based on learner availability and skill gaps.',
    primaryActions: ['open', 'createStudyPlan', 'updateStudyPlan'],
    supportedTools: ['open_study_plan', 'create_study_plan', 'update_study_plan'],
    isRealWorldAligned: true
  },
  {
    id: 'certificate',
    name: 'Cryptographic Certificate & Verification',
    route: '/certificate',
    category: 'PORTFOLIO',
    description: 'Issue and verify tamper-evident cryptographic graduation certificates with QR-code and hash validation.',
    primaryActions: ['open', 'verifyCertificate', 'downloadPdf'],
    supportedTools: ['open_certificate', 'open_certificate_verification'],
    isRealWorldAligned: true
  }
];

export function getCapabilityByRoute(route: string): AppCapability | undefined {
  return APP_CAPABILITIES.find(c => c.route === route || route.startsWith(c.route));
}

export function searchCapabilities(query: string): AppCapability[] {
  const q = query.toLowerCase();
  return APP_CAPABILITIES.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.description.toLowerCase().includes(q) ||
    c.primaryActions.some(a => a.toLowerCase().includes(q))
  );
}
