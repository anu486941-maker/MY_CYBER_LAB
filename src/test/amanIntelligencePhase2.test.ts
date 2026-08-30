import { describe, it, expect } from 'vitest';
import { AmanIntelligenceEngine } from '../aman/amanIntelligenceEngine';
import { generateProgressiveHint } from '../aman/progressiveHintSystem';
import { detectConversationalState } from '../aman/amanConversationalState';
import { classifyGeminiError } from '../utils/geminiErrorClassifier';

describe('AMAN Intelligence Engine (Phase 2 Upgrade)', () => {
  describe('1. Misconception Detection & Mental Model Corrections', () => {
    it('detects TCP vs UDP performance and security misconception', () => {
      const query = "TCP is faster than UDP because it is more secure";
      const result = AmanIntelligenceEngine.analyzeMisconceptions(query);
      expect(result.detected).toBe(true);
      expect(result.misconceptionTopic).toBe('TCP vs UDP Performance Mechanics');
      expect(result.underlyingTruth).toContain('UDP is faster and lighter');
      expect(result.verificationQuestion).toBeDefined();
    });

    it('detects HTTPS IP encryption misconception', () => {
      const query = "HTTPS encrypts destination IP addresses and hides where packets go";
      const result = AmanIntelligenceEngine.analyzeMisconceptions(query);
      expect(result.detected).toBe(true);
      expect(result.misconceptionTopic).toBe('TLS/HTTPS Encryption Layer Boundaries');
      expect(result.underlyingTruth).toContain('Layer 3 IP headers');
    });

    it('detects /24 subnet usable hosts arithmetic error', () => {
      const query = "A /24 subnet has 256 usable hosts for computers";
      const result = AmanIntelligenceEngine.analyzeMisconceptions(query);
      expect(result.detected).toBe(true);
      expect(result.misconceptionTopic).toBe('Subnet Usable Host Arithmetic');
      expect(result.underlyingTruth).toContain('254');
    });

    it('detects Base64 encryption misconception', () => {
      const query = "We should use Base64 to encrypt user passwords";
      const result = AmanIntelligenceEngine.analyzeMisconceptions(query);
      expect(result.detected).toBe(true);
      expect(result.misconceptionTopic).toBe('Encoding vs. Encryption vs. Hashing');
      expect(result.correctMentalModel).toContain('Base64');
    });

    it('detects Firewall vs SQL Injection misconception', () => {
      const query = "A network firewall protects our web application from all SQL injection";
      const result = AmanIntelligenceEngine.analyzeMisconceptions(query);
      expect(result.detected).toBe(true);
      expect(result.misconceptionTopic).toBe('Network Firewalls vs. Application Vulnerabilities');
      expect(result.underlyingTruth).toContain('Parameterized Queries');
    });
  });

  describe('2. Intent Classification & Cyber Domain Mapping', () => {
    it('classifies SOC domain query and suggests SOC Simulator', () => {
      const query = "How do I triage brute force alerts in SIEM logs?";
      const classified = AmanIntelligenceEngine.classifyIntent(query, 2, '/dashboard');
      expect(classified.cyberDomain).toBe('SOC');
      expect(classified.suggestedActionRoute).toBe('/soc-simulator');
    });

    it('classifies Web Security domain query and suggests Web Security Lab', () => {
      const query = "Explain SQL injection union payloads with Burp Suite";
      const classified = AmanIntelligenceEngine.classifyIntent(query, 2, '/dashboard');
      expect(classified.cyberDomain).toBe('WEB_SECURITY');
      expect(classified.suggestedActionRoute).toBe('/web-security');
    });

    it('classifies Network domain query and suggests Network Lab', () => {
      const query = "How do I perform an Nmap TCP SYN scan with Wireshark packet capture?";
      const classified = AmanIntelligenceEngine.classifyIntent(query, 1, '/dashboard');
      expect(classified.cyberDomain).toBe('NETWORK');
      expect(classified.suggestedActionRoute).toBe('/network-lab');
    });

    it('classifies Linux domain query and suggests Linux Lab', () => {
      const query = "Explain Linux file permissions chmod 755 vs 644";
      const classified = AmanIntelligenceEngine.classifyIntent(query, 1, '/dashboard');
      expect(classified.cyberDomain).toBe('LINUX');
      expect(classified.suggestedActionRoute).toBe('/linux-lab');
    });

    it('classifies Career query and suggests Career Paths', () => {
      const query = "How do I become a Penetration Tester and what certifications do I need?";
      const classified = AmanIntelligenceEngine.classifyIntent(query, 1, '/dashboard');
      expect(classified.primaryIntent).toBe('CAREER_ROADMAP');
      expect(classified.suggestedActionRoute).toBe('/career-paths');
    });
  });

  describe('3. Socratic Scaffolding & Progressive Hints', () => {
    it('generates multi-step Socratic ladders for Nmap scans', () => {
      const ladder = AmanIntelligenceEngine.generateSocraticLadder('nmap', 'NETWORK');
      expect(ladder.length).toBe(3);
      expect(ladder[0].focusArea).toBe('Observation');
      expect(ladder[1].focusArea).toBe('Protocol Mechanics');
      expect(ladder[2].focusArea).toBe('Defensive Detection');
    });

    it('generates 6-level progressive hint ladder without early solution leakage', () => {
      const hint0 = generateProgressiveHint(0, 'SQL Injection', 'Vulnerable ID parameter');
      expect(hint0.level).toBe(0);
      expect(hint0.isSolution).toBe(false);

      const hint2 = generateProgressiveHint(2, 'SQL Injection', 'Vulnerable ID parameter');
      expect(hint2.level).toBe(2);
      expect(hint2.isSolution).toBe(false);

      const hint5 = generateProgressiveHint(5, 'SQL Injection', 'Vulnerable ID parameter');
      expect(hint5.level).toBe(5);
      expect(hint5.isSolution).toBe(true);
    });
  });

  describe('4. Multilingual & Conversational State Handling', () => {
    it('accurately identifies simple greeting state in English and Hinglish', () => {
      const resEnglish = detectConversationalState('Hello AMAN');
      expect(resEnglish.state).toBe('GREETING');
      expect(resEnglish.shouldTeachImmediately).toBe(false);

      const resHinglish = detectConversationalState('Hey AMAN');
      expect(resHinglish.state).toBe('GREETING');
    });

    it('accurately routes lab stuck assistance queries', () => {
      const res = detectConversationalState("I'm stuck on this step, give me a hint");
      expect(res.state).toBe('LAB_ASSISTANCE');
      expect(res.shouldTeachImmediately).toBe(true);
    });
  });

  describe('5. Quota Resilience & 24h Quarantine', () => {
    it('classifies Daily Free-Tier exhaustion and prevents immediate retries', () => {
      const err = new Error('Quota exceeded for quota metric GenerateRequestsPerDayPerProjectPerModel-FreeTier');
      const classified = classifyGeminiError(err);
      expect(classified.code).toBe('DAILY_QUOTA_EXHAUSTED');
      expect(classified.isRetryable).toBe(false);
    });
  });
});
