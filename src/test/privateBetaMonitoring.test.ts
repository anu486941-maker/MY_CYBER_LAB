import { describe, it, expect, beforeEach } from 'vitest';
import { BetaHealthMonitor } from '../services/betaHealthMonitor';

describe('Master Private Beta Launch, Monitoring & Bug Detection Suite', () => {
  beforeEach(() => {
    BetaHealthMonitor.clearStateForTesting();
  });

  describe('Phase 1 & 2 — Beta Baseline & Metrics Tracking', () => {
    it('initializes with clean metrics and computes healthy baseline score', () => {
      const score = BetaHealthMonitor.calculateBetaHealthScore();
      expect(score.overallScore).toBeGreaterThanOrEqual(90);
      expect(score.securityScore).toBe(100);
      expect(score.activeIncidentsCount).toBe(0);
      expect(score.recommendation).toBe('READY_FOR_PUBLIC_LAUNCH');
    });
  });

  describe('Phase 5 — Tester Feedback Engine', () => {
    it('sanitizes API keys and sensitive tokens from tester feedback', () => {
      const fb = BetaHealthMonitor.submitFeedback({
        testerId: 'tester-beta-01',
        version: 'MY-CYBER-LAB-BETA-1',
        category: 'BUG',
        description: 'Observed error with AIzaSyD9876543210ZYXWVUTSRQPONMLKJIHG and password=supersecret123',
        severity: 'P2_MEDIUM',
        route: '/ai-mentor'
      });

      expect(fb.description).not.toContain('AIzaSyD9876543210ZYXWVUTSRQPONMLKJIHG');
      expect(fb.description).toContain('[REDACTED_API_KEY]');
      expect(fb.description).toContain('password:[REDACTED]');
      expect(fb.feedbackId).toBeDefined();
    });
  });

  describe('Phase 6, 9 & 11 — Error Telemetry, Classification & Deduplication', () => {
    it('deduplicates recurring errors under a single Bug Report with occurrence count', () => {
      BetaHealthMonitor.recordError({
        source: 'AMAN_AI',
        severity: 'P2_MEDIUM',
        errorSignature: 'AMAN_STREAM_TIMEOUT_NETWORK',
        message: 'Stream interrupted after 15s handshake',
        route: '/api/aman/chat',
        userId: 'user-1'
      });

      BetaHealthMonitor.recordError({
        source: 'AMAN_AI',
        severity: 'P2_MEDIUM',
        errorSignature: 'AMAN_STREAM_TIMEOUT_NETWORK',
        message: 'Stream interrupted after 15s handshake',
        route: '/api/aman/chat',
        userId: 'user-2'
      });

      const bugs = BetaHealthMonitor.getBugReports();
      expect(bugs.length).toBe(1);
      expect(bugs[0].bugId).toBe('BUG-001');
      expect(bugs[0].occurrences).toBe(2);
      expect(bugs[0].affectedUsers.size).toBe(2);
    });

    it('correctly reduces reliability score and triggers STOP_AND_FIX when a P0 Critical error occurs', () => {
      BetaHealthMonitor.recordError({
        source: 'FIREBASE',
        severity: 'P0_CRITICAL',
        errorSignature: 'AUTH_TOKEN_CORRUPTION',
        message: 'Critical authentication state mismatch',
        route: '/login'
      });

      const score = BetaHealthMonitor.calculateBetaHealthScore();
      expect(score.securityScore).toBe(50);
      expect(score.activeIncidentsCount).toBe(1);
      expect(score.recommendation).toBe('STOP_AND_FIX');
    });
  });

  describe('Phase 7 & 8 — AMAN Health & Quota Protection Monitoring', () => {
    it('tracks AMAN request performance, fallbacks, and model quarantine events', () => {
      BetaHealthMonitor.recordAmanRequest(true, 180);
      BetaHealthMonitor.recordAmanRequest(false, 350, {
        statusCode: 429,
        usedFallback: true,
        quarantinedModel: 'gemini-3.6-flash'
      });
      BetaHealthMonitor.recordAmanRequest(true, 210, {
        usedFallback: true
      });

      const metrics = BetaHealthMonitor.getAmanMetrics();
      expect(metrics.totalRequests).toBe(3);
      expect(metrics.successfulRequests).toBe(2);
      expect(metrics.failedRequests).toBe(1);
      expect(metrics.quota429Count).toBe(1);
      expect(metrics.fallbackCount).toBe(2);
      expect(metrics.quarantinedModels).toContain('gemini-3.6-flash');
    });
  });
});
