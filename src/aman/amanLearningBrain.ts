/**
 * AMAN 3.0 Learning Brain & Orchestrator
 * Central intelligence coordinating:
 * - Learner Profile & Evidence-based Mastery (Unknown -> Mastered)
 * - Prerequisite Dependency Graph
 * - Next-Best-Action Recommendation Engine
 * - Dynamic Curriculum Generation & Mistake Memory
 * - Safe Lab & Challenge Orchestration
 * - Career Gap Analysis & Portfolio Project Builder
 */

export type MasteryLevel = 'UNKNOWN' | 'INTRODUCED' | 'LEARNING' | 'PRACTICING' | 'COMPETENT' | 'MASTERED';

export type TeachingStrategy = 
  | 'DIRECT'
  | 'EXPLAIN'
  | 'SOCRATIC'
  | 'PRACTICAL'
  | 'ASSESS'
  | 'DEBUG'
  | 'CHALLENGE'
  | 'REVIEW'
  | 'CAREER';

export interface SkillNode {
  id: string;
  name: string;
  domain: string;
  prerequisites: string[];
  recommendedLabRoute: string;
  recommendedLabName: string;
  keyConcepts: string[];
}

export interface LearnerSkillState {
  skillId: string;
  level: MasteryLevel;
  quizScoreAvg: number; // 0-100
  practicalAttempts: number;
  lastPracticed: string; // ISO date
  identifiedMistakes: string[];
}

export interface CompactMistakeRecord {
  conceptId: string;
  misconception: string;
  correction: string;
  timestamp: string;
  recheckCompleted: boolean;
}

export interface LearnerProfile {
  userId: string;
  targetCareer: 'SOC_ANALYST' | 'PENETRATION_TESTER' | 'BLUE_TEAM' | 'SECURITY_ENGINEER' | 'NETWORK_SECURITY';
  currentOverallLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  preferredLanguage: 'ENGLISH' | 'HINDI' | 'HINGLISH';
  skills: Record<string, LearnerSkillState>;
  mistakeMemory: CompactMistakeRecord[];
  activeTopicId: string;
}

export interface NextBestAction {
  actionType: 'CONTINUE_LESSON' | 'PRACTICE_LAB' | 'TAKE_QUIZ' | 'ATTEMPT_CHALLENGE' | 'REVIEW_MISTAKE' | 'BUILD_PROJECT';
  title: string;
  reason: string;
  route: string;
  estimatedMinutes: number;
  secondaryActions: { title: string; route: string }[];
}

export interface CareerGapReport {
  careerTitle: string;
  readinessPercentage: number;
  readySkills: string[];
  nearReadySkills: string[];
  criticalGaps: string[];
  recommendedProject: {
    title: string;
    description: string;
    milestones: string[];
  };
}

export class AmanLearningBrain {
  public static readonly SKILL_GRAPH: Record<string, SkillNode> = {
    'net_fundamentals': {
      id: 'net_fundamentals',
      name: 'Networking Fundamentals & OSI/TCP Model',
      domain: 'Networking',
      prerequisites: [],
      recommendedLabRoute: '/network-lab',
      recommendedLabName: 'Network Recon Lab',
      keyConcepts: ['OSI 7 Layers', 'TCP/IP 4 Layers', 'Encapsulation', 'MAC vs IP']
    },
    'ip_addressing': {
      id: 'ip_addressing',
      name: 'IP Addressing & Subnetting Basics',
      domain: 'Networking',
      prerequisites: ['net_fundamentals'],
      recommendedLabRoute: '/network-lab',
      recommendedLabName: 'Subnetting Trainer',
      keyConcepts: ['IPv4 Structure', 'CIDR Notation', 'Network vs Broadcast IP', 'Usable Hosts']
    },
    'tcp_udp_mechanics': {
      id: 'tcp_udp_mechanics',
      name: 'TCP 3-Way Handshake & UDP Mechanics',
      domain: 'Networking',
      prerequisites: ['ip_addressing'],
      recommendedLabRoute: '/network-lab',
      recommendedLabName: 'Packet Analysis Lab',
      keyConcepts: ['SYN-SYN/ACK-ACK', 'State Management', 'Connectionless UDP', 'Ports 1-65535']
    },
    'nmap_recon': {
      id: 'nmap_recon',
      name: 'Nmap Network Scanning & Reconnaissance',
      domain: 'Reconnaissance',
      prerequisites: ['tcp_udp_mechanics'],
      recommendedLabRoute: '/network-lab',
      recommendedLabName: 'Nmap Scanning Sandbox',
      keyConcepts: ['TCP Connect (-sT)', 'SYN Stealth (-sS)', 'Version Detection (-sV)', 'OS Fingerprint (-O)']
    },
    'linux_basics': {
      id: 'linux_basics',
      name: 'Linux Permissions & Core Administration',
      domain: 'Linux Systems',
      prerequisites: [],
      recommendedLabRoute: '/linux-lab',
      recommendedLabName: 'Linux Interactive Terminal',
      keyConcepts: ['chmod / chown', 'Users & Groups', 'Process Management', 'Bash Piping']
    },
    'web_sqli': {
      id: 'web_sqli',
      name: 'SQL Injection (OWASP Top 10)',
      domain: 'Web Security',
      prerequisites: ['net_fundamentals'],
      recommendedLabRoute: '/web-security',
      recommendedLabName: 'Web Security Sandbox',
      keyConcepts: ['String Concatenation', 'UNION-based Payloads', 'Boolean Injection', 'Parameterized Queries']
    },
    'soc_log_triage': {
      id: 'soc_log_triage',
      name: 'SOC Alert Triage & SIEM Log Analysis',
      domain: 'SOC Operations',
      prerequisites: ['net_fundamentals', 'linux_basics'],
      recommendedLabRoute: '/soc-simulator',
      recommendedLabName: 'SOC SIEM Incident Simulator',
      keyConcepts: ['Brute Force Detection', 'IOC Analysis', 'Event IDs', 'Incident Containment']
    }
  };

  /**
   * Evaluates next best action based on real learner profile evidence.
   */
  public static calculateNextBestAction(profile: LearnerProfile): NextBestAction {
    // 1. Check for unverified/unreviewed critical mistakes (Mistake Spaced Review)
    const pendingMistake = profile.mistakeMemory.find(m => !m.recheckCompleted);
    if (pendingMistake) {
      return {
        actionType: 'REVIEW_MISTAKE',
        title: `Clarify Misconception: ${pendingMistake.conceptId}`,
        reason: `You previously noted a misconception regarding ${pendingMistake.misconception}. Reinforcing this concept will solidify your foundation.`,
        route: '/ai-mentor',
        estimatedMinutes: 5,
        secondaryActions: [
          { title: 'Practice in Network Lab', route: '/network-lab' }
        ]
      };
    }

    // 2. Check current active topic state
    const currentSkillState = profile.skills[profile.activeTopicId];
    if (currentSkillState) {
      if (currentSkillState.level === 'LEARNING' && currentSkillState.practicalAttempts === 0) {
        const skill = this.SKILL_GRAPH[profile.activeTopicId];
        return {
          actionType: 'PRACTICE_LAB',
          title: `Hands-on Practice: ${skill?.name || profile.activeTopicId}`,
          reason: `You have completed initial theory. Applying this in the authorized lab environment will build muscle memory.`,
          route: skill?.recommendedLabRoute || '/network-lab',
          estimatedMinutes: 15,
          secondaryActions: [
            { title: 'Take Concept Quiz', route: '/ai-mentor' }
          ]
        };
      }

      if (currentSkillState.level === 'PRACTICING' && currentSkillState.quizScoreAvg < 80) {
        return {
          actionType: 'TAKE_QUIZ',
          title: `Assess Understanding: ${profile.activeTopicId}`,
          reason: `Validating your knowledge with an interactive 3-question adaptive quiz will qualify you for Competent mastery.`,
          route: '/ai-mentor',
          estimatedMinutes: 8,
          secondaryActions: [
            { title: 'Review Command Anatomy', route: '/network-lab' }
          ]
        };
      }
    }

    // 3. Default Next Action: Continue toward Target Career Track
    if (profile.targetCareer === 'SOC_ANALYST') {
      return {
        actionType: 'PRACTICE_LAB',
        title: 'SOC SIEM Log Triage Lab',
        reason: 'Analyzing real-world auth logs aligns directly with your target SOC Analyst career milestone.',
        route: '/soc-simulator',
        estimatedMinutes: 20,
        secondaryActions: [
          { title: 'Explore SOC Career Path', route: '/career-paths' }
        ]
      };
    }

    return {
      actionType: 'CONTINUE_LESSON',
      title: 'Nmap Scanning Sandbox',
      reason: 'Continue progressing along your cybersecurity learning path.',
      route: '/network-lab',
      estimatedMinutes: 15,
      secondaryActions: [
        { title: 'Cyber Career Paths', route: '/career-paths' }
      ]
    };
  }

  /**
   * Analyzes skill gaps for target career roles and generates tailored projects.
   */
  public static generateCareerGapReport(profile: LearnerProfile): CareerGapReport {
    const career = profile.targetCareer;
    
    if (career === 'SOC_ANALYST') {
      const required = ['net_fundamentals', 'ip_addressing', 'tcp_udp_mechanics', 'linux_basics', 'soc_log_triage'];
      const ready: string[] = [];
      const nearReady: string[] = [];
      const criticalGaps: string[] = [];

      for (const req of required) {
        const state = profile.skills[req];
        if (state && (state.level === 'COMPETENT' || state.level === 'MASTERED')) {
          ready.push(this.SKILL_GRAPH[req]?.name || req);
        } else if (state && state.level === 'PRACTICING') {
          nearReady.push(this.SKILL_GRAPH[req]?.name || req);
        } else {
          criticalGaps.push(this.SKILL_GRAPH[req]?.name || req);
        }
      }

      const readinessPercentage = Math.round(((ready.length * 1.0 + nearReady.length * 0.5) / required.length) * 100);

      return {
        careerTitle: 'Junior SOC / Security Analyst',
        readinessPercentage,
        readySkills: ready,
        nearReadySkills: nearReady,
        criticalGaps,
        recommendedProject: {
          title: 'Automated Python SSH Brute-Force Log Analyzer',
          description: 'Build a lightweight Python script that parses auth.log, detects IP addresses exceeding 5 failed logins within 60 seconds, and generates a structured JSON alert report with MITRE ATT&CK T1110 mapping.',
          milestones: [
            'Parse Linux /var/log/auth.log with regex pattern matching',
            'Track failed attempts per IP address using sliding time windows',
            'Correlate against known threat intel or RFC 1918 private subnets',
            'Export structured incident reports ready for senior analyst triage'
          ]
        }
      };
    }

    // Default Penetration Tester / Red Team Report
    const required = ['net_fundamentals', 'ip_addressing', 'tcp_udp_mechanics', 'nmap_recon', 'linux_basics', 'web_sqli'];
    const ready: string[] = [];
    const nearReady: string[] = [];
    const criticalGaps: string[] = [];

    for (const req of required) {
      const state = profile.skills[req];
      if (state && (state.level === 'COMPETENT' || state.level === 'MASTERED')) {
        ready.push(this.SKILL_GRAPH[req]?.name || req);
      } else if (state && state.level === 'PRACTICING') {
        nearReady.push(this.SKILL_GRAPH[req]?.name || req);
      } else {
        criticalGaps.push(this.SKILL_GRAPH[req]?.name || req);
      }
    }

    const readinessPercentage = Math.round(((ready.length * 1.0 + nearReady.length * 0.5) / required.length) * 100);

    return {
      careerTitle: 'Junior Penetration Tester / Ethical Hacker',
      readinessPercentage,
      readySkills: ready,
      nearReadySkills: nearReady,
      criticalGaps,
      recommendedProject: {
        title: 'Custom Nmap Service Enumeration & Vulnerability Correlator',
        description: 'Develop a Python-based CLI tool that accepts Nmap XML output (-oX), parses open services and banner versions, queries NVD/CVE feeds, and outputs a formatted markdown executive penetration testing report.',
        milestones: [
          'Perform structured Nmap port scanning in authorized lab machine',
          'Parse XML tree output using Python ElementTree',
          'Extract version banners and match against known vulnerable configurations',
          'Generate professional executive summary and mitigation advice'
        ]
      }
    };
  }

  /**
   * Evaluates evidence to update mastery level without inflation.
   */
  public static evaluateSkillMastery(
    currentState: LearnerSkillState,
    newQuizScore?: number,
    practicalCompleted?: boolean
  ): LearnerSkillState {
    const updated = { ...currentState };

    if (practicalCompleted) {
      updated.practicalAttempts += 1;
    }

    if (typeof newQuizScore === 'number') {
      updated.quizScoreAvg = Math.round((updated.quizScoreAvg + newQuizScore) / 2);
    }

    // Evidence progression rules:
    // 1. UNKNOWN -> INTRODUCED (Concept viewed)
    // 2. INTRODUCED -> LEARNING (Deep dive started)
    // 3. LEARNING -> PRACTICING (At least 1 practical attempt in lab)
    // 4. PRACTICING -> COMPETENT (>= 2 practical attempts + Quiz Score >= 80)
    // 5. COMPETENT -> MASTERED (>= 3 practical attempts + Quiz Score >= 90 + zero active misconceptions)

    if (updated.level === 'UNKNOWN') {
      updated.level = 'INTRODUCED';
    } else if (updated.level === 'INTRODUCED') {
      updated.level = 'LEARNING';
    } else if (updated.level === 'LEARNING' && updated.practicalAttempts >= 1) {
      updated.level = 'PRACTICING';
    } else if (
      updated.level === 'PRACTICING' &&
      updated.practicalAttempts >= 2 &&
      updated.quizScoreAvg >= 80
    ) {
      updated.level = 'COMPETENT';
    } else if (
      updated.level === 'COMPETENT' &&
      updated.practicalAttempts >= 3 &&
      updated.quizScoreAvg >= 90 &&
      updated.identifiedMistakes.length === 0
    ) {
      updated.level = 'MASTERED';
    }

    updated.lastPracticed = new Date().toISOString();
    return updated;
  }
}
