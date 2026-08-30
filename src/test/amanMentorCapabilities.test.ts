import { describe, it, expect } from 'vitest';
import { generateProgressiveHint } from '../aman/progressiveHintSystem';
import { detectAmanIntent } from '../utils/amanActionDispatcher';
import { generateLocalGuidanceResponse } from '../utils/amanLocalGuidance';
import { getAmanVideoRecommendations } from '../services/videoRecommendationEngine';
import { buildAmanContext } from '../aman/amanContext';

describe('AMAN AI Cybersecurity Mentor System Tests', () => {
  describe('1. Socratic Progressive Hint System', () => {
    it('generates non-revealing reflective and conceptual hints for low levels (0-2)', () => {
      const hint0 = generateProgressiveHint(0, 'SQL Injection', 'Exploit vulnerable login parameter');
      expect(hint0.level).toBe(0);
      expect(hint0.isSolution).toBe(false);
      expect(hint0.hintText).toContain('analyze the challenge goal');

      const hint1 = generateProgressiveHint(1, 'SQL Injection', 'Exploit vulnerable login parameter');
      expect(hint1.level).toBe(1);
      expect(hint1.isSolution).toBe(false);
      expect(hint1.hintText).toContain('fundamental security mechanics');
    });

    it('generates execution steps and solution for level 4 and 5', () => {
      const hint4 = generateProgressiveHint(4, 'SQL Injection', 'Exploit vulnerable login parameter');
      expect(hint4.level).toBe(4);
      expect(hint4.isSolution).toBe(false);
      expect(hint4.hintText).toContain('Step-by-step guidance');

      const hint5 = generateProgressiveHint(5, 'SQL Injection', 'Exploit vulnerable login parameter');
      expect(hint5.level).toBe(5);
      expect(hint5.isSolution).toBe(true);
      expect(hint5.hintText).toContain('Solution Breakdown');
    });
  });

  describe('2. Intent Routing & Priority Safeguards', () => {
    it('prioritizes casual conversation and greetings without injecting room data', () => {
      const casualHinglish = detectAmanIntent('Kya haal hai?');
      expect(casualHinglish.intent).toBe('CONVERSATION');
      expect(casualHinglish.useRoomContext).toBe(false);

      const casualEnglish = detectAmanIntent('Hello AMAN, how are you?');
      expect(casualEnglish.intent).toBe('CONVERSATION');
      expect(casualEnglish.useRoomContext).toBe(false);
    });

    it('identifies explicit career requests and paths', () => {
      const careerReq = detectAmanIntent('Mujhe ethical hacking sikhni hai');
      expect(careerReq.intent).toBe('CAREER_SWITCH');
      expect(careerReq.canonicalRole).toBe('ETHICAL_HACKER');
    });
  });

  describe('3. Pedagogical Local Guidance for Cyber Topics', () => {
    const dummyContext = {
      currentCourse: 'Network Security',
      currentModule: 'Port Scanning & Nmap',
      cyberLevel: 2,
      language: 'English'
    };

    it('returns structured pedagogical breakdown for Nmap / Port Scanning in English', () => {
      const resp = generateLocalGuidanceResponse('Explain Nmap port scanning', dummyContext, 'English');
      expect(resp.isLocalGuidance).toBe(true);
      expect(resp.fullText).toContain('Port Scanning & Network Reconnaissance');
      expect(resp.fullText).toContain('TCP SYN Scan');
      expect(resp.fullText).toContain('nmap -sS');
      expect(resp.fullText).toContain('[ACTION:OPEN_MODULE:/network-lab]');
    });

    it('returns natural Hinglish breakdown for Subnetting when requested', () => {
      const resp = generateLocalGuidanceResponse('CIDR subnetting kaise kaam karta hai?', dummyContext, 'Hinglish');
      expect(resp.isLocalGuidance).toBe(true);
      expect(resp.fullText).toContain('CIDR & Subnetting Fundamentals');
      expect(resp.fullText).toContain('Host Calculation Formula');
      expect(resp.fullText).toContain('[ACTION:OPEN_MODULE:/subnetting-trainer]');
    });

    it('returns SQL Injection mechanics and secure prepared statement remediation', () => {
      const resp = generateLocalGuidanceResponse('What is SQL Injection and how to fix it?', dummyContext, 'English');
      expect(resp.isLocalGuidance).toBe(true);
      expect(resp.fullText).toContain('SQL Injection (OWASP Top 10)');
      expect(resp.fullText).toContain('Prepared Statements');
      expect(resp.fullText).toContain('[ACTION:OPEN_MODULE:/practice/web-security]');
    });
  });

  describe('4. Video Recommendations & Language Matching', () => {
    it('produces valid recommendation object for Ethical Hacker role', () => {
      const profile = { selectedRole: 'ethical-hacker', language: 'English' };
      const rec = getAmanVideoRecommendations(profile, {}, [], 'English');
      expect(rec).toBeDefined();
      expect(rec.primaryVideo).toBeDefined();
      expect(rec.primaryVideo.id).toBeDefined();
      expect(rec.completionPercentage).toBeGreaterThanOrEqual(0);
    });

    it('adapts when video is in progress', () => {
      const profile = { selectedRole: 'ethical-hacker' };
      const progressMap = {
        'eh-vid-01': {
          videoId: 'eh-vid-01',
          watchProgress: 45,
          completed: false,
          lastWatchedAt: new Date().toISOString()
        }
      };
      const rec = getAmanVideoRecommendations(profile, progressMap, [], 'Auto');
      expect(rec.categoryBadge).toBe('RESUME IN PROGRESS');
      expect(rec.primaryVideo.id).toBe('eh-vid-01');
    });
  });

  describe('5. Minimal Context Builder', () => {
    it('constructs sanitized compact learner context without leaking credentials', () => {
      const ctx = buildAmanContext(
        { name: 'Operator 1', selectedRole: 'ethical-hacker', cyberLevel: 3, xp: 450 },
        { position: { currentCourse: 'Ethical Hacking 101', currentModule: 'Reconnaissance' } },
        [{ id: 'ev-1', title: 'Open Port Finding' }],
        '/dashboard',
        'TEACH'
      );
      expect(ctx.activeRole).toBe('ethical-hacker');
      expect(ctx.cyberLevel).toBe(3);
      expect(ctx.evidenceCount).toBe(1);
      expect(ctx.currentRoute).toBe('/dashboard');
      expect(JSON.stringify(ctx)).not.toContain('apiKey');
    });
  });
});
