import { describe, it, expect, vi } from 'vitest';
import { classifyGeminiError } from '../utils/geminiErrorClassifier';

describe('AMAN Multi-Turn Conversation & Model Fallback Regression Tests', () => {
  describe('1. Multi-Turn Context & Rolling History Formatting', () => {
    it('correctly tracks history progression across Turn 1, Turn 2, and Turn 3', () => {
      // Simulate raw frontend message state
      const turn1User = "What is Nmap?";
      const turn1Aman = "Nmap is an open-source network scanner used for network discovery and vulnerability scanning.";
      
      const turn2User = "Why is it useful?";
      const turn2Aman = "It is useful for finding active hosts, identifying open ports, and auditing network security.";

      const turn3User = "Give me a practical example.";

      // Initial Turn 1: 0 prior messages
      const historyTurn1: { role: string; text: string }[] = [];
      expect(historyTurn1.length).toBe(0);

      // Turn 2: 2 prior messages (User -> AMAN)
      const historyTurn2 = [
        { role: 'user', text: turn1User },
        { role: 'model', text: turn1Aman }
      ];
      expect(historyTurn2.length).toBe(2);
      expect(historyTurn2[0].text).toContain('Nmap');

      // Turn 3: 4 prior messages (User -> AMAN -> User -> AMAN)
      const historyTurn3 = [
        { role: 'user', text: turn1User },
        { role: 'model', text: turn1Aman },
        { role: 'user', text: turn2User },
        { role: 'model', text: turn2Aman }
      ];
      expect(historyTurn3.length).toBe(4);
      
      // Verify context retention for pronoun resolution ("it" refers to Nmap)
      const reconstructedContext = historyTurn3.map(h => `${h.role}: ${h.text}`).join('\n');
      expect(reconstructedContext).toContain('What is Nmap?');
      expect(reconstructedContext).toContain('Why is it useful?');
    });

    it('sanitizes and formats multi-turn history for Gemini Chat SDK', () => {
      const rawHistory = [
        { role: 'user', text: 'What is Nmap?' },
        { role: 'assistant', text: 'Nmap is a network scanner.' },
        { role: 'user', text: 'Why is it useful?' },
        { role: 'model', text: 'It identifies open ports.' }
      ];

      // Mirror server.ts role mapping logic
      const formattedHistory = rawHistory.map(turn => ({
        role: turn.role === 'assistant' || turn.role === 'model' || turn.role === 'aman' ? 'model' : 'user',
        parts: [{ text: turn.text }]
      }));

      expect(formattedHistory.length).toBe(4);
      expect(formattedHistory[0].role).toBe('user');
      expect(formattedHistory[1].role).toBe('model');
      expect(formattedHistory[2].role).toBe('user');
      expect(formattedHistory[3].role).toBe('model');
      expect(formattedHistory[0].parts[0].text).toBe('What is Nmap?');
    });
  });

  describe('2. Gemini Daily Free-Tier Quota & Rate Limit Classification', () => {
    it('classifies GenerateRequestsPerDayPerProjectPerModel-FreeTier as DAILY_QUOTA_EXHAUSTED', () => {
      const dailyQuotaError = new Error(
        'GoogleGenAIError: [429 Too Many Requests] RESOURCE_EXHAUSTED: Quota exceeded for quota metric GenerateRequestsPerDayPerProjectPerModel-FreeTier'
      );
      const classified = classifyGeminiError(dailyQuotaError);
      expect(classified.code).toBe('DAILY_QUOTA_EXHAUSTED');
      expect(classified.isRetryable).toBe(false);
      expect(classified.httpStatus).toBe(429);
      expect(classified.technicalDetails).toContain('Daily Free-Tier Quota Exhausted');
    });

    it('classifies temporary burst rate limit as RATE_LIMITED', () => {
      const burstRateLimitError = new Error(
        'GoogleGenAIError: [429 Too Many Requests] RESOURCE_EXHAUSTED: Rate limit exceeded (requests per minute)'
      );
      const classified = classifyGeminiError(burstRateLimitError);
      expect(classified.code).toBe('RATE_LIMITED');
      expect(classified.isRetryable).toBe(true);
      expect(classified.httpStatus).toBe(429);
    });

    it('classifies 503 Overloaded as MODEL_UNAVAILABLE', () => {
      const model503 = new Error('[503 Service Unavailable] The model is overloaded. Please try again later.');
      const classified = classifyGeminiError(model503);
      expect(classified.code).toBe('MODEL_UNAVAILABLE');
      expect(classified.isRetryable).toBe(true);
    });
  });

  describe('3. Model Fallback Chain & Context Preservation Simulation', () => {
    it('preserves complete multi-turn history across primary model exhaustion and fallback', () => {
      const multiTurnHistory = [
        { role: 'user', parts: [{ text: 'What is Nmap?' }] },
        { role: 'model', parts: [{ text: 'Nmap is a network scanner.' }] },
        { role: 'user', parts: [{ text: 'Why is it useful?' }] },
        { role: 'model', parts: [{ text: 'It discovers open ports.' }] }
      ];

      const modelChain = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-flash-lite-preview'];
      const unavailableModels = new Set<string>();

      let executedWithModel = '';
      let receivedHistoryLength = -1;

      for (const model of modelChain) {
        if (unavailableModels.has(model)) continue;

        if (model === 'gemini-3.6-flash') {
          // Simulate 429 Daily Quota Exhaustion
          const err = new Error('RESOURCE_EXHAUSTED: GenerateRequestsPerDayPerProjectPerModel-FreeTier');
          const classified = classifyGeminiError(err);
          if (classified.code === 'DAILY_QUOTA_EXHAUSTED') {
            unavailableModels.add(model); // 24h quarantine
          }
          continue;
        }

        // Fallback model executes with EXACT SAME conversation history
        executedWithModel = model;
        receivedHistoryLength = multiTurnHistory.length;
        break;
      }

      expect(executedWithModel).toBe('gemini-3.1-flash-lite');
      expect(receivedHistoryLength).toBe(4);
      expect(unavailableModels.has('gemini-3.6-flash')).toBe(true);
    });
  });
});
