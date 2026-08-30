import { describe, it, expect } from 'vitest';
import { AmanLearningBrain, LearnerProfile, LearnerSkillState } from '../aman/amanLearningBrain';

describe('AMAN 3.0 Learning Brain & Orchestrator Regression Tests', () => {
  const baseProfile: LearnerProfile = {
    userId: 'test-user-cyber-01',
    targetCareer: 'SOC_ANALYST',
    currentOverallLevel: 'BEGINNER',
    preferredLanguage: 'HINGLISH',
    activeTopicId: 'ip_addressing',
    mistakeMemory: [],
    skills: {
      'net_fundamentals': {
        skillId: 'net_fundamentals',
        level: 'COMPETENT',
        quizScoreAvg: 85,
        practicalAttempts: 2,
        lastPracticed: new Date().toISOString(),
        identifiedMistakes: []
      },
      'ip_addressing': {
        skillId: 'ip_addressing',
        level: 'LEARNING',
        quizScoreAvg: 0,
        practicalAttempts: 0,
        lastPracticed: new Date().toISOString(),
        identifiedMistakes: []
      }
    }
  };

  describe('1. Next-Best-Action Decision Engine', () => {
    it('prioritizes pending unreviewed mistakes above new lessons', () => {
      const profileWithMistake: LearnerProfile = {
        ...baseProfile,
        mistakeMemory: [
          {
            conceptId: 'TCP vs UDP',
            misconception: 'TCP encrypts traffic',
            correction: 'Reliability is separate from TLS encryption',
            timestamp: new Date().toISOString(),
            recheckCompleted: false
          }
        ]
      };

      const nextAction = AmanLearningBrain.calculateNextBestAction(profileWithMistake);
      expect(nextAction.actionType).toBe('REVIEW_MISTAKE');
      expect(nextAction.title).toContain('Clarify Misconception');
    });

    it('recommends hands-on lab practice when a concept has been learned theoretically with 0 practical attempts', () => {
      const nextAction = AmanLearningBrain.calculateNextBestAction(baseProfile);
      expect(nextAction.actionType).toBe('PRACTICE_LAB');
      expect(nextAction.title).toContain('Hands-on Practice');
      expect(nextAction.route).toBe('/network-lab');
    });

    it('recommends quiz assessment when a topic is in PRACTICING state with quiz score < 80', () => {
      const practicingProfile: LearnerProfile = {
        ...baseProfile,
        skills: {
          ...baseProfile.skills,
          'ip_addressing': {
            skillId: 'ip_addressing',
            level: 'PRACTICING',
            quizScoreAvg: 60,
            practicalAttempts: 2,
            lastPracticed: new Date().toISOString(),
            identifiedMistakes: []
          }
        }
      };

      const nextAction = AmanLearningBrain.calculateNextBestAction(practicingProfile);
      expect(nextAction.actionType).toBe('TAKE_QUIZ');
      expect(nextAction.title).toContain('Assess Understanding');
    });
  });

  describe('2. Career Gap Analysis & Portfolio Project Engine', () => {
    it('accurately calculates readiness percentage and critical gaps for SOC Analyst track', () => {
      const report = AmanLearningBrain.generateCareerGapReport(baseProfile);
      expect(report.careerTitle).toContain('SOC / Security Analyst');
      expect(report.criticalGaps).toContain('TCP 3-Way Handshake & UDP Mechanics');
      expect(report.criticalGaps).toContain('Linux Permissions & Core Administration');
      expect(report.recommendedProject.title).toContain('SSH Brute-Force Log Analyzer');
      expect(report.recommendedProject.milestones.length).toBeGreaterThanOrEqual(3);
    });

    it('generates tailored Penetration Testing project for Red Team track', () => {
      const redTeamProfile: LearnerProfile = {
        ...baseProfile,
        targetCareer: 'PENETRATION_TESTER'
      };

      const report = AmanLearningBrain.generateCareerGapReport(redTeamProfile);
      expect(report.careerTitle).toContain('Penetration Tester');
      expect(report.recommendedProject.title).toContain('Nmap Service Enumeration');
    });
  });

  describe('3. Evidence-Based Mastery Transition Logic', () => {
    it('does NOT mark a skill COMPETENT without sufficient practical evidence and quiz performance', () => {
      const initial: LearnerSkillState = {
        skillId: 'nmap_recon',
        level: 'LEARNING',
        quizScoreAvg: 90,
        practicalAttempts: 0,
        lastPracticed: new Date().toISOString(),
        identifiedMistakes: []
      };

      // Merely passing a quiz does not skip to COMPETENT without practical hands-on attempts
      const updated = AmanLearningBrain.evaluateSkillMastery(initial, 95, false);
      expect(updated.level).toBe('LEARNING');
    });

    it('advances to PRACTICING upon first lab attempt and COMPETENT upon 2 lab attempts + 80+ quiz score', () => {
      const initial: LearnerSkillState = {
        skillId: 'nmap_recon',
        level: 'LEARNING',
        quizScoreAvg: 70,
        practicalAttempts: 0,
        lastPracticed: new Date().toISOString(),
        identifiedMistakes: []
      };

      // 1st lab attempt -> PRACTICING
      const step1 = AmanLearningBrain.evaluateSkillMastery(initial, 85, true);
      expect(step1.level).toBe('PRACTICING');
      expect(step1.practicalAttempts).toBe(1);

      // 2nd lab attempt + high quiz score -> COMPETENT
      const step2 = AmanLearningBrain.evaluateSkillMastery(step1, 85, true);
      expect(step2.level).toBe('COMPETENT');
      expect(step2.practicalAttempts).toBe(2);
    });
  });
});
