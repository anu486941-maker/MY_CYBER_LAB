import { describe, it, expect, beforeEach } from 'vitest';
import {
  DeterministicAIProvider,
  AIHealthTracker,
  AIRequestPolicy,
  AIProviderRouter,
  AIChatTurn,
  AIGenerateOptions
} from '../aman/ai';

describe('AMAN 3.0 Universal AI Provider Architecture', () => {
  describe('1. AIHealthTracker & Quarantine Engine', () => {
    let tracker: AIHealthTracker;

    beforeEach(() => {
      tracker = AIHealthTracker.getInstance();
      tracker.clearAllQuarantines();
    });

    it('tracks successful calls and updates status', () => {
      tracker.recordSuccess('LOCAL_OLLAMA:llama3.2');
      const health = tracker.getHealth('LOCAL_OLLAMA:llama3.2', 'LOCAL_OLLAMA', 'llama3.2');
      expect(health.status).toBe('AVAILABLE');
      expect(health.failureCount).toBe(0);
    });

    it('quarantines models when quota or failure occurs', () => {
      tracker.recordFailure('CLOUD_GEMINI:gemini-3.6-flash', 'Daily quota exhausted', 60000, true);
      expect(tracker.isAvailable('CLOUD_GEMINI:gemini-3.6-flash')).toBe(false);
      
      const health = tracker.getHealth('CLOUD_GEMINI:gemini-3.6-flash', 'CLOUD_GEMINI', 'gemini-3.6-flash');
      expect(health.status).toBe('QUARANTINED');
      expect(health.reason).toBe('Daily quota exhausted');
    });

    it('allows clearing quarantines for all providers', () => {
      tracker.recordFailure('CLOUD_GEMINI:gemini-3.6-flash', 'Quota', 60000, true);
      tracker.clearAllQuarantines();
      expect(tracker.isAvailable('CLOUD_GEMINI:gemini-3.6-flash')).toBe(true);
    });
  });

  describe('2. AIRequestPolicy Engine', () => {
    it('returns default AI configuration and cloud permissions', () => {
      const config = AIRequestPolicy.getConfig();
      expect(config.aiMode).toBeDefined();
      expect(typeof config.isCloudAiEnabled).toBe('boolean');
    });

    it('checks cloud authorization policy', () => {
      const allowed = AIRequestPolicy.isCloudAllowed();
      expect(typeof allowed).toBe('boolean');
    });
  });

  describe('3. DeterministicAIProvider (Offline-First Guarantee)', () => {
    const deterministicProvider = new DeterministicAIProvider();

    it('is always available and healthy without cloud or external services', async () => {
      const health = await deterministicProvider.healthCheck();
      expect(health.status).toBe('AVAILABLE');
      expect(deterministicProvider.isAvailable()).toBe(true);
    });

    it('produces structured, responsive cybersecurity guidance for concept queries', async () => {
      const turns: AIChatTurn[] = [
        { role: 'user', text: 'Explain SQL Injection and how to prevent it' }
      ];
      const options: AIGenerateOptions = {
        language: 'English',
        activeMode: 'TEACH',
        contextData: { cyberLevel: 2 }
      };

      const stream = deterministicProvider.generateStream(turns, options);
      let totalText = '';
      let chunkCount = 0;

      for await (const chunk of stream) {
        chunkCount++;
        totalText += chunk.text || '';
        expect(chunk.amanStatus).toBe('LOCAL_GUIDANCE');
        expect(chunk.modelUsed).toBe('aman-local-socratic-v3');
      }

      expect(chunkCount).toBeGreaterThan(0);
      expect(totalText).toContain('SQL Injection');
    });

    it('handles casual conversation naturally', async () => {
      const turns: AIChatTurn[] = [
        { role: 'user', text: 'Kya haal hai AMAN?' }
      ];
      const options: AIGenerateOptions = {
        language: 'Hinglish',
        activeMode: 'TEACH'
      };

      const stream = deterministicProvider.generateStream(turns, options);
      let totalText = '';

      for await (const chunk of stream) {
        totalText += chunk.text || '';
      }

      expect(totalText.length).toBeGreaterThan(10);
    });
  });

  describe('4. AIProviderRouter Universal Execution Ladder', () => {
    it('executes the deterministic provider seamlessly when offline mode is selected', async () => {
      const router = AIProviderRouter.getInstance();
      router.setAIMode('LOCAL_ONLY');

      const turns: AIChatTurn[] = [
        { role: 'user', text: 'What is port 443 used for?' }
      ];
      const options: AIGenerateOptions = {
        language: 'English',
        activeMode: 'TEACH'
      };

      const stream = router.generateStream(turns, options);
      let collectedText = '';
      let receivedChunks = 0;

      for await (const chunk of stream) {
        receivedChunks++;
        collectedText += chunk.text || '';
      }

      expect(receivedChunks).toBeGreaterThan(0);
      expect(collectedText.length).toBeGreaterThan(10);
    });

    it('exposes overall health and provider metrics accurately', async () => {
      const router = AIProviderRouter.getInstance();
      const health = await router.getOverallHealth();

      expect(health.activeMode).toBeDefined();
      expect(Array.isArray(health.providers)).toBe(true);
      
      const deterministic = health.providers.find(p => p.providerName === 'AMAN_DETERMINISTIC_ENGINE');
      expect(deterministic).toBeDefined();
      expect(deterministic?.status).toBe('AVAILABLE');
    });
  });
});

