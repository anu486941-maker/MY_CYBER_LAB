import { describe, it, expect } from 'vitest';
import { MASTER_CURRICULUM_LEVELS, MASTER_CONCEPTS_GRAPH, MasterConcept } from '../data/masterCurriculumGraph';
import { AmanLearningBrain, LearnerProfile, LearnerSkillState } from '../aman/amanLearningBrain';

describe('MASTER AUDIT: Curriculum Forensics & Knowledge Graph Integrity', () => {
  const allConcepts = Object.values(MASTER_CONCEPTS_GRAPH);
  const allConceptIds = new Set(Object.keys(MASTER_CONCEPTS_GRAPH));

  it('Phase 1 & 2: Covers all 20 levels (Level 0 to 19) with non-empty, valid concept mappings', () => {
    expect(MASTER_CURRICULUM_LEVELS.length).toBe(20);

    for (let lvl = 0; lvl <= 19; lvl++) {
      const levelDef = MASTER_CURRICULUM_LEVELS.find(l => l.level === lvl);
      expect(levelDef, `Missing level ${lvl} in MASTER_CURRICULUM_LEVELS`).toBeDefined();
      expect(levelDef!.conceptIds.length, `Level ${lvl} has no conceptIds assigned`).toBeGreaterThan(0);

      // Verify every conceptId listed in levelDef actually exists in MASTER_CONCEPTS_GRAPH
      for (const cId of levelDef!.conceptIds) {
        expect(allConceptIds.has(cId), `Level ${lvl} references non-existent concept '${cId}'`).toBe(true);
        const concept = MASTER_CONCEPTS_GRAPH[cId];
        expect(concept.level, `Concept '${cId}' level (${concept.level}) does not match levelDef level (${lvl})`).toBe(lvl);
      }
    }
  });

  it('Phase 2: Verifies Knowledge Graph structural completeness for every concept (15-point standard schema)', () => {
    expect(allConcepts.length).toBeGreaterThanOrEqual(60);

    for (const concept of allConcepts) {
      expect(concept.id).toBeTruthy();
      expect(concept.title).toBeTruthy();
      expect(concept.difficulty).toMatch(/^(FOUNDATION|BEGINNER|INTERMEDIATE|ADVANCED|EXPERT)$/);
      expect(concept.definition.length).toBeGreaterThan(10);
      expect(concept.whyItMatters.length).toBeGreaterThan(10);
      expect(concept.mentalModel.length).toBeGreaterThan(10);
      expect(concept.coreExplanation.length).toBeGreaterThan(15);
      expect(concept.visualExplanation?.content).toBeTruthy();
      expect(concept.practicalExercise?.task).toBeTruthy();
      expect(concept.practicalExercise?.labRoute).toBeTruthy();
      expect(concept.commonMistakes?.length).toBeGreaterThanOrEqual(1);
      expect(concept.offensivePerspective?.length).toBeGreaterThan(10);
      expect(concept.defensivePerspective?.length).toBeGreaterThan(10);
      expect(concept.careerRelevance?.length).toBeGreaterThanOrEqual(1);

      // Assessment verification
      expect(concept.assessment?.question?.length).toBeGreaterThan(5);
      expect(concept.assessment?.options?.length).toBeGreaterThanOrEqual(3);
      expect(concept.assessment?.correctIndex).toBeGreaterThanOrEqual(0);
      expect(concept.assessment?.correctIndex).toBeLessThan(concept.assessment.options.length);
      expect(concept.assessment?.explanation?.length).toBeGreaterThan(5);

      // Mastery Criteria verification
      expect(concept.masteryCriteria?.minQuizScore).toBeGreaterThanOrEqual(70);
      expect(concept.masteryCriteria?.requiredPracticalRuns).toBeGreaterThanOrEqual(1);
      expect(concept.masteryCriteria?.retentionIntervalDays).toBeGreaterThan(0);
    }
  });

  it('Phase 2: Verifies there are NO broken prerequisite or nextConcept references (referential integrity)', () => {
    const brokenPrereqs: { concept: string; missingPrereq: string }[] = [];
    const brokenNexts: { concept: string; missingNext: string }[] = [];

    for (const concept of allConcepts) {
      for (const prereq of concept.prerequisites) {
        if (!AmanLearningBrain.getConcept(prereq)) {
          brokenPrereqs.push({ concept: concept.id, missingPrereq: prereq });
        }
      }
      for (const next of concept.nextConcepts) {
        if (!AmanLearningBrain.getConcept(next)) {
          brokenNexts.push({ concept: concept.id, missingNext: next });
        }
      }
    }

    expect(brokenPrereqs, `Broken prerequisites found: ${JSON.stringify(brokenPrereqs)}`).toEqual([]);
    expect(brokenNexts, `Broken nextConcepts found: ${JSON.stringify(brokenNexts)}`).toEqual([]);
  });

  it('Phase 2: Detects and forbids circular prerequisite dependencies (DAG validation)', () => {
    // DFS Cycle Detection
    const visited = new Set<string>();
    const recStack地下 = new Set<string>();

    function isCyclic(nodeId: string): boolean {
      visited.add(nodeId);
      recStack地下.add(nodeId);

      const concept = AmanLearningBrain.getConcept(nodeId);
      if (concept) {
        for (const prereqId of concept.prerequisites) {
          const resolvedPrereq = AmanLearningBrain.getConcept(prereqId)?.id || prereqId;
          if (!visited.has(resolvedPrereq)) {
            if (isCyclic(resolvedPrereq)) return true;
          } else if (recStack地下.has(resolvedPrereq)) {
            return true;
          }
        }
      }

      recStack地下.delete(nodeId);
      return false;
    }

    for (const concept of allConcepts) {
      if (!visited.has(concept.id)) {
        expect(isCyclic(concept.id), `Circular dependency detected starting at ${concept.id}`).toBe(false);
      }
    }
  });

  it('Phase 6: Verifies progressive difficulty ordering without premature advanced jumps', () => {
    // Prerequisite concepts should generally be lower or equal level to dependent concepts
    for (const concept of allConcepts) {
      for (const prereqId of concept.prerequisites) {
        const prereq = AmanLearningBrain.getConcept(prereqId);
        if (prereq) {
          expect(
            prereq.level,
            `Concept '${concept.id}' (Lvl ${concept.level}) depends on higher level '${prereq.id}' (Lvl ${prereq.level})`
          ).toBeLessThanOrEqual(concept.level);
        }
      }
    }
  });
});

const emptySkills: Record<string, LearnerSkillState> = {};

const competentSkill = (cid: string): LearnerSkillState => ({
  skillId: cid,
  level: 'COMPETENT',
  quizScoreAvg: 85,
  practicalAttempts: 2,
  highestHintUsed: 0,
  lastPracticed: new Date().toISOString(),
  identifiedMistakes: []
});

const practicedSkill = (cid: string, quizScore: number): LearnerSkillState => ({
  skillId: cid,
  level: 'PRACTICING',
  quizScoreAvg: quizScore,
  practicalAttempts: 1,
  highestHintUsed: 1,
  lastPracticed: new Date().toISOString(),
  identifiedMistakes: []
});

describe('MASTER AUDIT: Adaptive Learning Engine & Learner Personas (Phase 3 & Phase 4)', () => {

  it('Learner A (Complete Beginner): Recommends foundation lesson Level 0 without jumping ahead', () => {
    const learnerA: LearnerProfile = {
      userId: 'user_a',
      targetCareer: 'SOC_ANALYST',
      currentOverallLevel: 'BEGINNER',
      preferredLanguage: 'ENGLISH',
      skills: {},
      mistakeMemory: [],
      activeTopicId: 'c0_cpu_ram'
    };

    const action = AmanLearningBrain.calculateNextBestAction(learnerA);
    expect(action.actionType).toBe('CONTINUE_LESSON');
    expect(action.conceptId).toBe('c0_cpu_ram');
  });

  it('Learner B (Strong Linux, Weak Networking): Identifies missing networking prereqs before advanced scanning', () => {
    const learnerB: LearnerProfile = {
      userId: 'user_b',
      targetCareer: 'PENETRATION_TESTER',
      currentOverallLevel: 'INTERMEDIATE',
      preferredLanguage: 'ENGLISH',
      skills: {
        'c0_cli_basics': competentSkill('c0_cli_basics'),
        'c1_linux_fs_perms': competentSkill('c1_linux_fs_perms'),
        'c1_pipes_redirection': competentSkill('c1_pipes_redirection'),
        'c8_suid_capabilities': competentSkill('c8_suid_capabilities')
      },
      mistakeMemory: [],
      activeTopicId: 'c4_nmap_scanning' // Requires c2_tcp_handshake & c2_subnetting_cidr
    };

    const action = AmanLearningBrain.calculateNextBestAction(learnerB);
    // Should NOT jump straight to nmap scanning; must point to prerequisite networking concept
    expect(action.actionType).toBe('CONTINUE_LESSON');
    expect(['c2_tcp_handshake', 'c2_subnetting_cidr', 'c2_osi_tcpip']).toContain(action.conceptId);
  });

  it('Learner C (Strong Networking, Weak Web): Guides to HTTP fundamentals before Web Security (OWASP)', () => {
    const learnerC: LearnerProfile = {
      userId: 'user_c',
      targetCareer: 'PENETRATION_TESTER',
      currentOverallLevel: 'INTERMEDIATE',
      preferredLanguage: 'ENGLISH',
      skills: {
        'c0_cpu_ram': competentSkill('c0_cpu_ram'),
        'c0_cli_basics': competentSkill('c0_cli_basics'),
        'c2_osi_tcpip': competentSkill('c2_osi_tcpip'),
        'c2_tcp_handshake': competentSkill('c2_tcp_handshake'),
        'c2_subnetting_cidr': competentSkill('c2_subnetting_cidr')
      },
      mistakeMemory: [],
      activeTopicId: 'c6_sqli' // Requires c5_http_mechanics & c5_cookies_sessions
    };

    const action = AmanLearningBrain.calculateNextBestAction(learnerC);
    expect(action.actionType).toBe('CONTINUE_LESSON');
    expect(['c5_http_mechanics', 'c5_cookies_sessions']).toContain(action.conceptId);
  });

  it('Learner D (Repeated Misconceptions): Prioritizes spaced review of pending mistake over new lessons', () => {
    const learnerD: LearnerProfile = {
      userId: 'user_d',
      targetCareer: 'SOC_ANALYST',
      currentOverallLevel: 'BEGINNER',
      preferredLanguage: 'ENGLISH',
      skills: {
        'c0_cpu_ram': competentSkill('c0_cpu_ram')
      },
      activeTopicId: 'c0_process_memory',
      mistakeMemory: [
        {
          conceptId: 'c0_cpu_ram',
          misconception: 'Confused volatile RAM with persistent disk storage during buffer allocation.',
          correction: 'RAM is volatile byte-addressable memory; storage is block-based persistent media.',
          timestamp: new Date().toISOString(),
          recheckCompleted: false
        }
      ]
    };

    const action = AmanLearningBrain.calculateNextBestAction(learnerD);
    expect(action.actionType).toBe('REVIEW_MISTAKE');
    expect(action.conceptId).toBe('c0_cpu_ram');
    expect(action.title).toContain('Clarify Misconception');
  });

  it('Learner E (Theory Passed, 0 Practical Labs): Recommends Hands-on Lab Practice before Quiz/Mastery', () => {
    const learnerE: LearnerProfile = {
      userId: 'user_e',
      targetCareer: 'SOC_ANALYST',
      currentOverallLevel: 'BEGINNER',
      preferredLanguage: 'ENGLISH',
      skills: {
        'c0_cpu_ram': {
          skillId: 'c0_cpu_ram',
          level: 'LEARNING',
          quizScoreAvg: 0,
          practicalAttempts: 0,
          lastPracticed: new Date().toISOString(),
          identifiedMistakes: []
        }
      },
      mistakeMemory: [],
      activeTopicId: 'c0_cpu_ram'
    };

    const action = AmanLearningBrain.calculateNextBestAction(learnerE);
    expect(action.actionType).toBe('PRACTICE_LAB');
    expect(action.route).toBe(MASTER_CONCEPTS_GRAPH['c0_cpu_ram'].practicalExercise.labRoute);
  });

  it('Learner F (Attempts Advanced Material Without Prereqs): Gated by prerequisite check', () => {
    const learnerF: LearnerProfile = {
      userId: 'user_f',
      targetCareer: 'PENETRATION_TESTER',
      currentOverallLevel: 'BEGINNER',
      preferredLanguage: 'ENGLISH',
      skills: {},
      mistakeMemory: [],
      activeTopicId: 'c10_kerberos_attacks' // Level 10 Active Directory attack
    };

    const prereqResult = AmanLearningBrain.checkPrerequisitesMet('c10_kerberos_attacks', learnerF);
    expect(prereqResult.met).toBe(false);
    expect(prereqResult.missing.length).toBeGreaterThan(0);

    const action = AmanLearningBrain.calculateNextBestAction(learnerF);
    expect(action.actionType).toBe('CONTINUE_LESSON');
    expect(prereqResult.missing).toContain(action.conceptId);
  });

  it('Learner G (Accelerating Master): Fast-tracks to next concept when prerequisites are COMPETENT', () => {
    const learnerG: LearnerProfile = {
      userId: 'user_g',
      targetCareer: 'SOC_ANALYST',
      currentOverallLevel: 'ADVANCED',
      preferredLanguage: 'ENGLISH',
      skills: {
        'c0_cpu_ram': competentSkill('c0_cpu_ram'),
        'c0_process_memory': competentSkill('c0_process_memory'),
        'c0_client_server': competentSkill('c0_client_server'),
        'c0_cli_basics': competentSkill('c0_cli_basics'),
        'c1_linux_fs_perms': competentSkill('c1_linux_fs_perms')
      },
      mistakeMemory: [],
      activeTopicId: 'c0_cpu_ram' // Currently pointing to c0_cpu_ram, but it is already mastered
    };

    const action = AmanLearningBrain.calculateNextBestAction(learnerG);
    // Should advance to next concept in graph (e.g. c0_process_memory or downstream)
    expect(action.conceptId).not.toBe('c0_cpu_ram');
  });
});

describe('MASTER AUDIT: Phase 5 Ethical Hacker Pathway & Career Gap Engine', () => {
  it('Verifies complete Ethical Hacker / Red Team progression from Computer Foundations to Capstone', () => {
    const redTeamProfile: LearnerProfile = {
      userId: 'pentest_learner',
      targetCareer: 'PENETRATION_TESTER',
      currentOverallLevel: 'INTERMEDIATE',
      preferredLanguage: 'ENGLISH',
      mistakeMemory: [],
      activeTopicId: 'c4_nmap_scanning',
      skills: {
        'c0_cli_basics': competentSkill('c0_cli_basics'),
        'c1_linux_fs_perms': competentSkill('c1_linux_fs_perms'),
        'c2_tcp_handshake': competentSkill('c2_tcp_handshake'),
        'c4_nmap_scanning': competentSkill('c4_nmap_scanning')
      }
    };

    const gapReport = AmanLearningBrain.generateCareerGapReport(redTeamProfile);
    expect(gapReport.careerTitle).toContain('Penetration Tester');
    expect(gapReport.totalRequiredSkills).toBeGreaterThanOrEqual(5);
    expect(gapReport.readinessPercentage).toBeGreaterThan(0);
    expect(gapReport.readinessPercentage).toBeLessThan(100);
    expect(gapReport.recommendedProject.title).toBeTruthy();
    expect(gapReport.recommendedProject.milestones.length).toBeGreaterThanOrEqual(3);
  });
});

describe('MASTER AUDIT: Phase 8 Adversarial & Resilience Tests', () => {
  it('Resilient against malicious prompt injection or corrupted skill states', () => {
    const corruptedProfile: LearnerProfile = {
      userId: 'attacker_1337',
      targetCareer: '<script>alert("xss")</script>' as any,
      currentOverallLevel: 'BEGINNER',
      preferredLanguage: 'ENGLISH',
      mistakeMemory: [],
      skills: {
        // Inconsistent / corrupted skill state: marked MASTERED with 0 practical runs and -50 score
        'c0_cpu_ram': {
          skillId: 'c0_cpu_ram',
          level: 'MASTERED',
          quizScoreAvg: -50,
          practicalAttempts: 0,
          lastPracticed: new Date().toISOString(),
          identifiedMistakes: []
        },
        'invalid_nonexistent_node': {
          skillId: 'invalid_nonexistent_node',
          level: 'COMPETENT',
          quizScoreAvg: 100,
          practicalAttempts: 10,
          lastPracticed: new Date().toISOString(),
          identifiedMistakes: []
        }
      },
      activeTopicId: '../../etc/passwd'
    };

    // calculateNextBestAction must gracefully fall back without throwing or crashing
    expect(() => {
      const action = AmanLearningBrain.calculateNextBestAction(corruptedProfile);
      expect(action).toBeDefined();
      expect(action.actionType).toBeTruthy();
    }).not.toThrow();
  });

  it('Resilient against circular alias resolution or undefined concept requests', () => {
    expect(AmanLearningBrain.getConcept('non_existent_key_999')).toBeUndefined();
    expect(AmanLearningBrain.getConcept('')).toBeUndefined();

    // Verify alias resolution
    expect(AmanLearningBrain.getConcept('nmap_recon')?.id).toBe('c4_nmap_scanning');
    expect(AmanLearningBrain.getConcept('sqli')?.id).toBe('c6_sqli');
  });

  it('Phase 4 Mastery Gate: Evidence-based state transitions prevent unearned COMPETENT levels', () => {
    // 1. Initial LEARNING
    const initial = AmanLearningBrain.evaluateMasteryProgress('c0_cpu_ram', undefined, 0, 0);
    expect(initial.level).toBe('LEARNING');

    // 2. 1 Lab attempt (no quiz yet) -> PRACTICING
    const practicing = AmanLearningBrain.evaluateMasteryProgress('c0_cpu_ram', initial, 1, 0);
    expect(practicing.level).toBe('PRACTICING');

    // 3. 1 Lab attempt + 100 Quiz -> STILL PRACTICING because requiredPracticalRuns is 2
    const almostCompetent = AmanLearningBrain.evaluateMasteryProgress('c0_cpu_ram', practicing, 1, 100);
    expect(almostCompetent.level).toBe('PRACTICING');

    // 4. 2 Lab attempts + 85 Quiz score -> COMPETENT
    const competent = AmanLearningBrain.evaluateMasteryProgress('c0_cpu_ram', almostCompetent, 2, 85);
    expect(competent.level).toBe('COMPETENT');
  });
});
