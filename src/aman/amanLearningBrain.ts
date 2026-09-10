/**
 * AMAN 3.0 Learning Brain & Orchestrator
 * Central intelligence coordinating:
 * - Learner Profile & Multi-factor Evidence Mastery (Unknown -> Mastered)
 * - 19-Level Prerequisite Dependency Graph
 * - Next-Best-Action Recommendation Engine
 * - Dynamic Assessment & Lab Alignment
 * - Career Gap Analysis & Portfolio Project Builder
 */

import { 
  MASTER_CONCEPTS_GRAPH, 
  MASTER_CURRICULUM_LEVELS, 
  MasterConcept, 
  CurriculumLevel 
} from '../data/masterCurriculumGraph';

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
  highestHintUsed?: number;
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
  targetCareer: 'SOC_ANALYST' | 'PENETRATION_TESTER' | 'BLUE_TEAM' | 'SECURITY_ENGINEER' | 'NETWORK_SECURITY' | 'DFIR_EXAMINER' | 'CLOUD_SECURITY' | 'AI_SECURITY';
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
  conceptId?: string;
}

export interface CareerGapReport {
  careerTitle: string;
  totalRequiredSkills: number;
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
  public static readonly CONCEPTS = MASTER_CONCEPTS_GRAPH;
  public static readonly LEVELS = MASTER_CURRICULUM_LEVELS;

  public static readonly CAREER_MAPPINGS: Record<string, { title: string; required: string[]; project: { title: string; description: string; milestones: string[] } }> = {
    'SOC_ANALYST': {
      title: 'Junior SOC / Security Analyst',
      required: [
        'c1_linux_fs_perms',
        'c2_tcp_handshake',
        'c3_cia_triad',
        'c9_windows_event_forensics',
        'c11_siem_architecture',
        'c11_ioc_vs_ioa',
        'c11_soc_alert_triage'
      ],
      project: {
        title: 'Automated Python SSH Brute-Force Log Analyzer & Triage Bot',
        description: 'Build a lightweight Python script that parses auth.log, detects IP addresses exceeding 5 failed logins within 60 seconds, and generates a structured JSON alert report with MITRE ATT&CK T1110 mapping.',
        milestones: [
          'Parse Linux /var/log/auth.log with regex pattern matching',
          'Track failed attempts per IP address using sliding time windows',
          'Correlate against known threat intel or RFC 1918 private subnets',
          'Export structured incident reports ready for senior analyst triage'
        ]
      }
    },
    'PENETRATION_TESTER': {
      title: 'Junior Penetration Tester / Ethical Hacker',
      required: [
        'c1_linux_fs_perms',
        'c2_tcp_handshake',
        'c4_nmap_scanning',
        'c4_burp_proxy',
        'c6_sqli',
        'c6_xss',
        'c8_suid_capabilities',
        'c10_kerberos_attacks'
      ],
      project: {
        title: 'Custom Nmap Service Enumeration & Vulnerability Correlator',
        description: 'Develop a Python-based CLI tool that accepts Nmap XML output (-oX), parses open services and banner versions, queries NVD/CVE feeds, and outputs a formatted markdown executive penetration testing report.',
        milestones: [
          'Perform structured Nmap port scanning in authorized lab machine',
          'Parse XML tree output using Python ElementTree',
          'Extract version banners and match against known vulnerable configurations',
          'Generate professional executive summary and mitigation advice'
        ]
      }
    },
    'BLUE_TEAM': {
      title: 'Incident Responder & Threat Detection Engineer',
      required: [
        'c2_tcp_handshake',
        'c9_windows_event_forensics',
        'c11_siem_architecture',
        'c12_hypothesis_hunting',
        'c13_disk_artifacts',
        'c16_sigma_detection_rules'
      ],
      project: {
        title: 'Sigma-to-Splunk Automated Detection Pipeline',
        description: 'Create a Git-driven detection engineering repository that validates Sigma YAML rules, converts them to Splunk SPL and Microsoft Sentinel KQL, and runs automated syntax tests in CI/CD.',
        milestones: [
          'Write 5 novel Sigma rules targeting LOLBin execution',
          'Automate conversion with pySigma CLI',
          'Validate telemetry mapping against MITRE ATT&CK matrix',
          'Build automated CI verification test suite'
        ]
      }
    },
    'CLOUD_SECURITY': {
      title: 'Cloud Security Architect / DevSecOps Engineer',
      required: [
        'c3_cia_triad',
        'c5_rest_apis_json',
        'c17_cloud_shared_responsibility',
        'c17_cloud_iam_least_privilege',
        'c17_cloud_storage_audit',
        'c18_docker_isolation_breakout'
      ],
      project: {
        title: 'Automated Multi-Cloud IAM Least-Privilege Auditor',
        description: 'Develop an automated auditor that queries cloud IAM role policies, identifies wildcard permissions and overprivileged service accounts, and outputs actionable remediation JSON.',
        milestones: [
          'Query cloud IAM policies via SDK',
          'Detect high-risk privilege escalation vectors (iam:PassRole, etc.)',
          'Generate scoped least-privilege replacement policies',
          'Integrate into GitHub Actions pull request checks'
        ]
      }
    },
    'AI_SECURITY': {
      title: 'AI Red Teamer & LLM Security Specialist',
      required: [
        'c6_sqli',
        'c6_xss',
        'c5_rest_apis_json',
        'c19_prompt_injection_defense',
        'c19_insecure_tool_agency',
        'c19_ai_red_teaming_guardrails'
      ],
      project: {
        title: 'Adversarial Prompt Injection & Guardrail Evaluation Suite',
        description: 'Construct a benchmarking suite that evaluates LLM applications against direct and indirect prompt injection attacks, measuring guardrail bypass rates and output leakage.',
        milestones: [
          'Implement 20 diverse adversarial jailbreak probes',
          'Test delimiter isolation and system prompt extraction resistance',
          'Measure latency overhead of input/output guardrails',
          'Produce executive AI risk assessment scorecard'
        ]
      }
    }
  };

  private static readonly ALIAS_MAP: Record<string, string> = {
    'ip_addressing': 'c2_subnetting_cidr',
    'net_fundamentals': 'c2_osi_tcpip',
    'nmap_recon': 'c4_nmap_scanning',
    'linux_basics': 'c1_linux_fs_perms',
    'web_basics': 'c5_http_mechanics',
    'sqli': 'c6_sqli',
    'xss': 'c6_xss'
  };

  /**
   * Resolves the learner's skill state for a given concept ID or legacy alias.
   */
  public static getLearnerSkill(profile: LearnerProfile, conceptIdOrAlias: string): LearnerSkillState | undefined {
    if (profile.skills[conceptIdOrAlias]) return profile.skills[conceptIdOrAlias];
    
    // Check direct alias mapping
    const graphId = this.ALIAS_MAP[conceptIdOrAlias];
    if (graphId && profile.skills[graphId]) return profile.skills[graphId];
    
    // Check reverse alias mapping
    for (const [alias, targetId] of Object.entries(this.ALIAS_MAP)) {
      if (targetId === conceptIdOrAlias && profile.skills[alias]) {
        return profile.skills[alias];
      }
    }

    const concept = this.getConcept(conceptIdOrAlias);
    if (concept && profile.skills[concept.id]) {
      return profile.skills[concept.id];
    }
    return undefined;
  }

  /**
   * Retrieves a specific concept from the master graph with fallback alias matching.
   */
  public static getConcept(id: string): MasterConcept | undefined {
    if (!id || !id.trim()) return undefined;
    if (this.CONCEPTS[id]) return this.CONCEPTS[id];
    const mapped = this.ALIAS_MAP[id];
    if (mapped && this.CONCEPTS[mapped]) return this.CONCEPTS[mapped];
    
    const lower = id.toLowerCase().trim();
    const byKey = Object.values(this.CONCEPTS).find(c => 
      c.id.toLowerCase() === lower || 
      c.title.toLowerCase() === lower ||
      (lower.length >= 3 && c.title.toLowerCase().includes(lower))
    );
    return byKey;
  }

  /**
   * Returns all concepts in the master graph.
   */
  public static getAllConcepts(): MasterConcept[] {
    return Object.values(this.CONCEPTS);
  }

  /**
   * Retrieves all concepts belonging to a specific curriculum level.
   */
  public static getConceptsByLevel(level: number): MasterConcept[] {
    return Object.values(this.CONCEPTS).filter(c => c.level === level);
  }

  /**
   * Retrieves all curriculum levels.
   */
  public static getCurriculumLevels(): CurriculumLevel[] {
    return this.LEVELS;
  }

  /**
   * Validates whether all prerequisites for a given concept have been met by the learner.
   */
  public static checkPrerequisitesMet(conceptId: string, profile: LearnerProfile): { met: boolean; missing: string[] } {
    const concept = this.getConcept(conceptId);
    if (!concept || !concept.prerequisites || concept.prerequisites.length === 0) {
      return { met: true, missing: [] };
    }

    const missing: string[] = [];
    for (const prereqId of concept.prerequisites) {
      const state = this.getLearnerSkill(profile, prereqId);
      // Learner must be at least COMPETENT or MASTERED in prerequisite
      if (!state || (state.level !== 'COMPETENT' && state.level !== 'MASTERED')) {
        missing.push(prereqId);
      }
    }

    return {
      met: missing.length === 0,
      missing
    };
  }

  /**
   * Evaluates next best action based on real learner profile evidence and the 19-level graph.
   */
  public static calculateNextBestAction(profile: LearnerProfile): NextBestAction {
    // 1. Check for unverified/unreviewed critical mistakes (Mistake Spaced Review)
    const pendingMistake = profile.mistakeMemory?.find(m => !m.recheckCompleted);
    if (pendingMistake) {
      const concept = this.getConcept(pendingMistake.conceptId);
      return {
        actionType: 'REVIEW_MISTAKE',
        title: `Clarify Misconception: ${concept?.title || pendingMistake.conceptId}`,
        reason: `You previously noted a misconception regarding "${pendingMistake.misconception}". Reinforcing this concept will solidify your foundation.`,
        route: '/ai-mentor',
        estimatedMinutes: 5,
        secondaryActions: [
          { title: 'Practice in Lab', route: concept?.practicalExercise?.labRoute || '/network-lab' }
        ],
        conceptId: pendingMistake.conceptId
      };
    }

    // 2. Check current active topic state
    const activeConceptId = profile.activeTopicId || 'c0_cpu_ram';
    const activeConcept = this.getConcept(activeConceptId);
    const currentSkillState = this.getLearnerSkill(profile, activeConceptId);

    if (activeConcept) {
      // 2a. If prerequisites are not met, prompt learner to master the prerequisite first
      const prereqCheck = this.checkPrerequisitesMet(activeConceptId, profile);
      if (!prereqCheck.met && prereqCheck.missing.length > 0) {
        const missingConcept = this.getConcept(prereqCheck.missing[0]);
        return {
          actionType: 'CONTINUE_LESSON',
          title: `Build Prerequisite: ${missingConcept?.title || prereqCheck.missing[0]}`,
          reason: `Before diving deep into ${activeConcept.title}, you need to master prerequisite ${missingConcept?.title || prereqCheck.missing[0]}.`,
          route: '/ai-mentor',
          estimatedMinutes: 10,
          secondaryActions: [
            { title: 'View Full Roadmap', route: '/career-paths' }
          ],
          conceptId: prereqCheck.missing[0]
        };
      }

      // 2b. If learner is in LEARNING and hasn't done practical lab
      if (currentSkillState && currentSkillState.level === 'LEARNING' && currentSkillState.practicalAttempts === 0) {
        return {
          actionType: 'PRACTICE_LAB',
          title: `Hands-on Practice: ${activeConcept.title}`,
          reason: `You have completed initial theory for ${activeConcept.title}. Applying this in the authorized lab environment will build muscle memory.`,
          route: activeConcept.practicalExercise?.labRoute || '/network-lab',
          estimatedMinutes: 15,
          secondaryActions: [
            { title: 'Take Concept Quiz', route: '/ai-mentor' }
          ],
          conceptId: activeConcept.id
        };
      }

      // 2c. If learner is in PRACTICING and needs quiz validation
      if (currentSkillState && currentSkillState.level === 'PRACTICING' && currentSkillState.quizScoreAvg < 80) {
        return {
          actionType: 'TAKE_QUIZ',
          title: `Assess Understanding: ${activeConcept.title}`,
          reason: `Validating your knowledge with the concept assessment will qualify you for Competent mastery.`,
          route: '/ai-mentor',
          estimatedMinutes: 8,
          secondaryActions: [
            { title: 'Review in Lab', route: activeConcept.practicalExercise?.labRoute || '/network-lab' }
          ],
          conceptId: activeConcept.id
        };
      }

      // 2d. If current concept is MASTERED, advance to next concept in graph
      if (currentSkillState && (currentSkillState.level === 'COMPETENT' || currentSkillState.level === 'MASTERED')) {
        if (activeConcept.nextConcepts && activeConcept.nextConcepts.length > 0) {
          const nextConcept = this.getConcept(activeConcept.nextConcepts[0]);
          if (nextConcept) {
            return {
              actionType: 'CONTINUE_LESSON',
              title: `Next Concept: ${nextConcept.title}`,
              reason: `You have proven competence in ${activeConcept.title}. Ready to advance to Level ${nextConcept.level}: ${nextConcept.title}.`,
              route: '/ai-mentor',
              estimatedMinutes: 12,
              secondaryActions: [
                { title: 'Practice in Lab', route: nextConcept.practicalExercise?.labRoute || '/network-lab' },
                { title: 'Explore Roadmap', route: '/career-paths' }
              ],
              conceptId: nextConcept.id
            };
          }
        }
      }

      // 2e. If concept is active and has no skill state recorded yet, start the initial lesson
      if (!currentSkillState) {
        return {
          actionType: 'CONTINUE_LESSON',
          title: `Start Concept: ${activeConcept.title}`,
          reason: `Begin Level ${activeConcept.level} foundational concepts for ${activeConcept.title}.`,
          route: '/ai-mentor',
          estimatedMinutes: 10,
          secondaryActions: [
            { title: 'Practice in Lab', route: activeConcept.practicalExercise?.labRoute || '/network-lab' },
            { title: 'Explore Roadmap', route: '/career-paths' }
          ],
          conceptId: activeConcept.id
        };
      }
    }

    // 3. Fallback to Target Career Track Guidance
    const targetCareer = profile.targetCareer || 'SOC_ANALYST';
    const careerConfig = this.CAREER_MAPPINGS[targetCareer] || this.CAREER_MAPPINGS['SOC_ANALYST'];

    // Find the first required skill in the career path that is not yet COMPETENT/MASTERED
    for (const reqSkillId of careerConfig.required) {
      const state = this.getLearnerSkill(profile, reqSkillId);
      if (!state || (state.level !== 'COMPETENT' && state.level !== 'MASTERED')) {
        // Check prerequisites for this required skill
        const prereqCheck = this.checkPrerequisitesMet(reqSkillId, profile);
        const targetId = prereqCheck.met ? reqSkillId : prereqCheck.missing[0];
        const targetConcept = this.getConcept(targetId) || this.getConcept('c0_cpu_ram')!;
        
        return {
          actionType: 'CONTINUE_LESSON',
          title: `Career Milestone: ${targetConcept.title}`,
          reason: `Progress toward your ${careerConfig.title} goal by mastering ${targetConcept.title}.`,
          route: '/ai-mentor',
          estimatedMinutes: 10,
          secondaryActions: [
            { title: 'Practice in Lab', route: targetConcept.practicalExercise?.labRoute || '/network-lab' },
            { title: 'Explore Career Track', route: '/career-paths' }
          ],
          conceptId: targetConcept.id
        };
      }
    }

    return {
      actionType: 'CONTINUE_LESSON',
      title: 'Digital & Computer Foundations',
      reason: 'Continue building core cybersecurity knowledge from first principles.',
      route: '/ai-mentor',
      estimatedMinutes: 10,
      secondaryActions: [
        { title: 'Cyber Career Paths', route: '/career-paths' }
      ],
      conceptId: 'c0_cpu_ram'
    };
  }

  /**
   * Analyzes skill gaps for target career roles using the 19-level graph.
   */
  public static generateCareerGapReport(profile: LearnerProfile): CareerGapReport {
    const career = profile.targetCareer;
    const targetConfig = this.CAREER_MAPPINGS[career] || this.CAREER_MAPPINGS['PENETRATION_TESTER'];
    const ready: string[] = [];
    const nearReady: string[] = [];
    const criticalGaps: string[] = [];

    for (const reqId of targetConfig.required) {
      const concept = this.getConcept(reqId);
      const state = this.getLearnerSkill(profile, reqId);
      const label = concept ? concept.title : reqId;

      if (state && (state.level === 'COMPETENT' || state.level === 'MASTERED')) {
        ready.push(label);
      } else if (state && state.level === 'PRACTICING') {
        nearReady.push(label);
      } else {
        criticalGaps.push(label);
      }
    }

    const total = targetConfig.required.length;
    const readinessPercentage = Math.round(((ready.length * 1.0 + nearReady.length * 0.5) / (total || 1)) * 100);

    return {
      careerTitle: targetConfig.title,
      totalRequiredSkills: total,
      readinessPercentage,
      readySkills: ready,
      nearReadySkills: nearReady,
      criticalGaps,
      recommendedProject: targetConfig.project
    };
  }

  /**
   * Helper to evaluate mastery progression for a concept by ID.
   */
  public static evaluateMasteryProgress(
    conceptId: string,
    currentState?: LearnerSkillState,
    practicalAttempts?: number,
    quizScore?: number,
    hintLevelUsed?: number
  ): LearnerSkillState {
    const base: LearnerSkillState = currentState || {
      skillId: conceptId,
      level: 'UNKNOWN',
      quizScoreAvg: 0,
      practicalAttempts: 0,
      lastPracticed: new Date().toISOString(),
      identifiedMistakes: []
    };

    if (practicalAttempts !== undefined) {
      base.practicalAttempts = practicalAttempts;
    }

    return this.evaluateSkillMastery(base, quizScore, false, hintLevelUsed);
  }

  /**
   * Evaluates evidence to update mastery level without artificial inflation.
   */
  public static evaluateSkillMastery(
    currentState: LearnerSkillState,
    newQuizScore?: number,
    practicalCompleted?: boolean,
    hintLevelUsed?: number
  ): LearnerSkillState {
    const updated = { ...currentState };

    if (practicalCompleted) {
      updated.practicalAttempts = (updated.practicalAttempts || 0) + 1;
    }

    if (typeof newQuizScore === 'number') {
      if (typeof updated.quizScoreAvg === 'number' && updated.quizScoreAvg > 0) {
        updated.quizScoreAvg = Math.round((updated.quizScoreAvg + newQuizScore) / 2);
      } else {
        updated.quizScoreAvg = newQuizScore;
      }
    }

    if (typeof hintLevelUsed === 'number') {
      updated.highestHintUsed = Math.max(updated.highestHintUsed || 0, hintLevelUsed);
    }

    // Evidence-based Progression Thresholds:
    // 1. UNKNOWN -> INTRODUCED (Concept viewed)
    // 2. INTRODUCED -> LEARNING (Deep dive started)
    // 3. LEARNING -> PRACTICING (At least 1 practical lab execution)
    // 4. PRACTICING -> COMPETENT (>= 2 practical attempts + Quiz Score >= 80 + hintLevel <= 2)
    // 5. COMPETENT -> MASTERED (>= 3 practical attempts + Quiz Score >= 90 + zero active mistakes + hintLevel <= 1)

    if (updated.level === 'UNKNOWN' || updated.level === 'INTRODUCED') {
      updated.level = 'LEARNING';
    }
    
    if (updated.level === 'LEARNING' && updated.practicalAttempts >= 1) {
      updated.level = 'PRACTICING';
    }
    
    if (
      (updated.level === 'PRACTICING' || updated.level === 'LEARNING') &&
      updated.practicalAttempts >= 2 &&
      updated.quizScoreAvg >= 80 &&
      (updated.highestHintUsed ?? 0) <= 2
    ) {
      updated.level = 'COMPETENT';
    }
    
    if (
      updated.level === 'COMPETENT' &&
      updated.practicalAttempts >= 3 &&
      updated.quizScoreAvg >= 90 &&
      (!updated.identifiedMistakes || updated.identifiedMistakes.length === 0) &&
      (updated.highestHintUsed ?? 0) <= 1
    ) {
      updated.level = 'MASTERED';
    }

    updated.lastPracticed = new Date().toISOString();
    return updated;
  }
}
