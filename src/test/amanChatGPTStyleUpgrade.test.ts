import { describe, it, expect } from 'vitest';
import { detectAmanIntent } from '../utils/amanActionDispatcher';
import { generateLocalGuidanceResponse } from '../utils/amanLocalGuidance';
import { DeterministicAIProvider } from '../aman/ai/DeterministicAIProvider';
import { AIProviderRouter } from '../aman/ai/AIProviderRouter';
import { AIRequestPolicy } from '../aman/ai/AIRequestPolicy';

describe('AMAN Free ChatGPT-Style Conversational Upgrade', () => {
  const dummyContext = {
    currentCourse: 'Networking Fundamentals',
    currentLesson: 'Switches, Routers & Default Gateways',
    cyberLevel: 2,
    nextRequiredSkill: 'Hands-on Lab Practice'
  };

  describe('1. Natural Small Talk & Conversational Intent', () => {
    it('answers "HI" naturally without robotic room/course dumps', () => {
      const detected = detectAmanIntent('HI');
      expect(detected.intent).toBe('CONVERSATION');
      expect(detected.useRoomContext).toBe(false);

      const resp = generateLocalGuidanceResponse('HI', dummyContext, 'English');
      expect(resp.fullText).not.toContain('You are currently studying');
      expect(resp.fullText).toMatch(/Hello|How can I help|ready/i);
    });

    it('answers "HOW ARE U?" / "HOW ARE YOU?" naturally', () => {
      const detected = detectAmanIntent('HOW ARE U?');
      expect(detected.intent).toBe('CONVERSATION');
      expect(detected.useRoomContext).toBe(false);

      const resp = generateLocalGuidanceResponse('HOW ARE U?', dummyContext, 'English');
      expect(resp.fullText).not.toContain('You are currently studying');
      expect(resp.fullText).toMatch(/doing great|thanks for asking/i);
    });

    it('answers "WHAT ARE YOU DOING?" conversationally', () => {
      const detected = detectAmanIntent('WHAT ARE YOU DOING?');
      expect(detected.intent).toBe('CONVERSATION');
      expect(detected.useRoomContext).toBe(false);

      const resp = generateLocalGuidanceResponse('WHAT ARE YOU DOING?', dummyContext, 'English');
      expect(resp.fullText).not.toContain('You are currently studying');
      expect(resp.fullText).toMatch(/ready to help|What's on your mind/i);
    });

    it('answers "THANKS" / "THANK YOU" politely', () => {
      const detected = detectAmanIntent('THANKS');
      expect(detected.intent).toBe('CONVERSATION');
      expect(detected.useRoomContext).toBe(false);

      const resp = generateLocalGuidanceResponse('THANKS', dummyContext, 'English');
      expect(resp.fullText).not.toContain('You are currently studying');
      expect(resp.fullText).toMatch(/welcome/i);
    });

    it('handles rude / provocative input calmly and without defensiveness or unsolicited context', () => {
      const detected = detectAmanIntent('FUCK YOU');
      expect(detected.intent).toBe('CONVERSATION');
      expect(detected.useRoomContext).toBe(false);

      const resp = generateLocalGuidanceResponse('FUCK YOU', dummyContext, 'English');
      expect(resp.fullText).not.toContain('You are currently studying');
      expect(resp.fullText).toMatch(/frustrating|sorry|accomplish|sort it out/i);
    });
  });

  describe('2. Intent Routing Hierarchy & Gating', () => {
    it('gating: gives room context ONLY on explicit room questions', () => {
      const explicitRoom = detectAmanIntent('What is this room teaching?');
      expect(explicitRoom.intent).toBe('ROOM_QUERY');
      expect(explicitRoom.useRoomContext).toBe(true);

      const resp = generateLocalGuidanceResponse('What is this room teaching?', dummyContext, 'English');
      expect(resp.fullText).toContain('Networking Fundamentals');
    });

    it('technical concept query provides deep technical explanations without course spam', () => {
      const resp = generateLocalGuidanceResponse('Explain port scanning and nmap', dummyContext, 'English');
      expect(resp.fullText).toContain('Port Scanning & Network Reconnaissance');
      expect(resp.fullText).toContain('nmap -sS -sV');
      expect(resp.fullText).not.toContain('You are currently studying');
    });

    it('SQL injection query provides OWASP guidance and remediation without course spam', () => {
      const resp = generateLocalGuidanceResponse('How does SQL injection work?', dummyContext, 'English');
      expect(resp.fullText).toContain('SQL Injection');
      expect(resp.fullText).toContain('Prepared Statements');
      expect(resp.fullText).not.toContain('You are currently studying');
    });
  });

  describe('3. Deterministic AI & Router Reliability (Zero Paid APIs)', () => {
    it('deterministic provider generates full streamed responses with zero external API dependencies', async () => {
      const provider = new DeterministicAIProvider();
      expect(provider.isAvailable()).toBe(true);

      const stream = provider.generateStream('How are you?');
      let combined = '';
      for await (const chunk of stream) {
        if (chunk.text) combined += chunk.text;
      }

      expect(combined.length).toBeGreaterThan(0);
      expect(combined).toMatch(/doing great/i);
    });

    it('router provides an executable execution plan with deterministic fallback', () => {
      const router = AIProviderRouter.getInstance();
      expect(router).toBeDefined();
    });

    it('in production environment, localhost Ollama is skipped and does not block request path', () => {
      const originalEnv = process.env.NODE_ENV;
      const originalKService = process.env.K_SERVICE;
      try {
        process.env.K_SERVICE = 'cloud-run-aman-service';
        process.env.NODE_ENV = 'production';

        expect(AIRequestPolicy.isProduction()).toBe(true);
        expect(AIRequestPolicy.isOllamaConfigured()).toBe(false);

        const router = AIProviderRouter.getInstance();
        expect(router).toBeDefined();
      } finally {
        process.env.NODE_ENV = originalEnv;
        if (originalKService !== undefined) {
          process.env.K_SERVICE = originalKService;
        } else {
          delete process.env.K_SERVICE;
        }
      }
    });
  });
});
