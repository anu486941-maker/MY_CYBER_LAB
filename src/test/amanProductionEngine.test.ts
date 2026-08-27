import { describe, it, expect } from 'vitest';
import { detectConversationalState } from '../aman/amanConversationalState';
import { generateProgressiveHint } from '../aman/progressiveHintSystem';
import { classifyGeminiError } from '../utils/geminiErrorClassifier';
import { generateLocalGuidanceResponse } from '../utils/amanLocalGuidance';
import { validateTargetScope } from '../utils/targetAllowlistPolicy';

describe('AMAN AI Production Engine & Routing Verification', () => {

  // 1. Secret Protection & Environment Variable Boundaries
  describe('Environment Variable Security & Secret Boundaries', () => {
    it('uses GEMINI_API_KEY for server execution without VITE_ prefix', () => {
      const envKeys = Object.keys(process.env);
      const hasViteSecret = envKeys.some(k => k.includes('VITE_GEMINI_KEY') || k.includes('VITE_SECRET'));
      expect(hasViteSecret).toBe(false);
    });

    it('never exposes process.env.GEMINI_API_KEY in local guidance or error responses', () => {
      const localResp = generateLocalGuidanceResponse('Hi AMAN', {}, 'English', 'GEMINI_AUTHENTICATION_ERROR');
      expect(localResp.fullText).not.toContain(process.env.GEMINI_API_KEY || 'SECRET_MOCK_VAL');
      expect(JSON.stringify(localResp)).not.toContain('AI_STUDIO_KEY');
    });
  });

  // 3. Conversational State Detection (9 explicit states)
  describe('Conversational State Detection Engine', () => {
    it('detects GREETING state without triggering immediate technical lecture', () => {
      const res = detectConversationalState('Hi AMAN');
      expect(res.state).toBe('GREETING');
      expect(res.shouldTeachImmediately).toBe(false);
    });

    it('detects CASUAL_CONVERSATION state', () => {
      const res = detectConversationalState('How are you?');
      expect(res.state).toBe('CASUAL_CONVERSATION');
    });

    it('detects LEARNING state for conceptual queries', () => {
      const res = detectConversationalState('Teach me SQL injection');
      expect(res.state).toBe('LEARNING');
      expect(res.shouldTeachImmediately).toBe(true);
    });

    it('detects LAB_ASSISTANCE state when learner is stuck', () => {
      const res = detectConversationalState("I'm stuck on this lab step");
      expect(res.state).toBe('LAB_ASSISTANCE');
      expect(res.shouldTeachImmediately).toBe(true);
    });

    it('detects MISSION_ASSISTANCE state', () => {
      const res = detectConversationalState('What is the mission objective?');
      expect(res.state).toBe('MISSION_ASSISTANCE');
    });

    it('detects INVESTIGATION state for log analysis', () => {
      const res = detectConversationalState('What should I investigate next in the logs?');
      expect(res.state).toBe('INVESTIGATION');
    });

    it('detects REPORT_REVIEW state', () => {
      const res = detectConversationalState('Review my report findings');
      expect(res.state).toBe('REPORT_REVIEW');
    });

    it('detects DEBRIEF state for post-session performance', () => {
      const res = detectConversationalState('Give me a debrief on my performance');
      expect(res.state).toBe('DEBRIEF');
    });

    it('detects CAREER_GUIDANCE state', () => {
      const res = detectConversationalState('How do I become a SOC Analyst?');
      expect(res.state).toBe('CAREER_GUIDANCE');
    });
  });

  // 4. Progressive Hint Ladder (6 levels)
  describe('Progressive Hint Ladder (Level 0 - 5)', () => {
    it('returns Level 0 Independent Reflection without solution', () => {
      const hint = generateProgressiveHint(0, 'Nmap Scanning', 'Run nmap -sV');
      expect(hint.level).toBe(0);
      expect(hint.isSolution).toBe(false);
      expect(hint.hintText).toContain('Take a moment');
    });

    it('returns Level 1 Conceptual Guidance', () => {
      const hint = generateProgressiveHint(1, 'Nmap Scanning', 'Run nmap -sV');
      expect(hint.level).toBe(1);
      expect(hint.isSolution).toBe(false);
    });

    it('returns Level 3 Tool Direction', () => {
      const hint = generateProgressiveHint(3, 'Nmap Scanning', 'Run nmap -sV');
      expect(hint.level).toBe(3);
      expect(hint.isSolution).toBe(false);
    });

    it('returns Level 5 Solution', () => {
      const hint = generateProgressiveHint(5, 'Nmap Scanning', 'Run nmap -sV 10.200.1.10');
      expect(hint.level).toBe(5);
      expect(hint.isSolution).toBe(true);
    });
  });

  // 5. Target Scope Refusal & Security Boundary
  describe('Unauthorized Target Scope Refusal Policy', () => {
    it('refuses unauthorized target IP (8.8.8.8) and directs to lab scope', () => {
      const policy = validateTargetScope('8.8.8.8');
      expect(policy.allowed).toBe(false);
      expect(policy.reason).toBe('TARGET_OUT_OF_SCOPE');
      expect(policy.refusalMessage).toContain('outside your authorized training scope');
    });

    it('permits valid lab subnet targets (10.200.1.50)', () => {
      const policy = validateTargetScope('10.200.1.50');
      expect(policy.allowed).toBe(true);
    });
  });

  // 6. Error Classification & Local Guidance Fallback
  describe('Gemini Error Classification & Fallback System', () => {
    it('classifies 404 model errors cleanly without crashing', () => {
      const err = new Error('This model models/gemini-2.0-flash is no longer available.');
      const classified = classifyGeminiError(err);
      expect(classified.code).toBe('UNKNOWN_ERROR');
      expect(classified.userFacingMessage).toContain('Local Guidance');
    });

    it('classifies 503 high demand service errors cleanly', () => {
      const err = new Error('This model is currently experiencing high demand.');
      const classified = classifyGeminiError(err);
      expect(classified.code).toBe('MODEL_UNAVAILABLE');
    });

    it('generates rich local guidance fallback response', () => {
      const localResp = generateLocalGuidanceResponse('Teach me Linux commands', {}, 'English', 'MODEL_UNAVAILABLE');
      expect(localResp.summary).toBeDefined();
      expect(localResp.fullText.length).toBeGreaterThan(20);
    });
  });
});
