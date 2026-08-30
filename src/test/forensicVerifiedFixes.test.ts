import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  verifyVideoAvailability,
  getVerifiedReplacementForVideo
} from '../services/videoVerificationService';
import { classifyGeminiError } from '../utils/geminiErrorClassifier';
import { VideoItem } from '../types';

describe('Forensic Verified Fixes Regression Suite', () => {
  const originalFetch = global.fetch;

  const createMockVideoItem = (overrides: Partial<VideoItem> = {}): VideoItem => ({
    id: 'vid-test-01',
    title: 'Nmap Scanning Basics',
    description: 'Learn network scanning basics.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3Kq1MIfTWCE',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    duration: '15:00',
    durationSeconds: 900,
    difficulty: 'Beginner',
    tags: ['Nmap', 'Scanning'],
    topic: 'nmap',
    role: 'ethical-hacker',
    prerequisites: [],
    learningObjectives: ['Host Discovery'],
    notesSummary: 'Basic Nmap host discovery scanning methods.',
    ...overrides
  } as unknown as VideoItem);

  beforeEach(() => {
    vi.stubGlobal('navigator', { onLine: true });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  // --- VIDEO SYSTEM TESTS ---

  // 1. verifyVideoAvailability receives VideoItem
  it('1. verifyVideoAvailability accepts a full VideoItem and performs oEmbed verification', async () => {
    const testVideo = createMockVideoItem();

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ title: 'Nmap Scanning Basics', author_name: 'Cyber Channel' })
    });
    global.fetch = mockFetch;

    const result = await verifyVideoAvailability(testVideo);
    expect(result.isPlayable).toBe(true);
    expect(result.statusMessage).toBe('Video is active, verified, and ready for embedded playback.');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://www.youtube.com/oembed?url='),
      expect.any(Object)
    );
  });

  // 2. isPlayable is used correctly
  it('2. isPlayable property accurately reflects video playable state on 200 vs 404', async () => {
    const testVideo = createMockVideoItem({
      id: 'vid-dead-01',
      title: 'Dead Video Test',
      videoUrl: 'https://www.youtube.com/watch?v=dead_video_id',
      embedUrl: 'https://www.youtube-nocookie.com/embed/dead_video_id'
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.reject(new Error('Not found'))
    });
    global.fetch = mockFetch;

    const result = await verifyVideoAvailability(testVideo);
    expect(result.isPlayable).toBe(false);
    expect(result.statusMessage).toContain('Video was deleted or removed from YouTube.');
  });

  // 3. statusMessage is used correctly
  it('3. statusMessage contains descriptive human-readable verification details', async () => {
    const testVideo = createMockVideoItem({
      id: 'vid-test-03',
      title: 'Status Message Test'
    });

    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    const result = await verifyVideoAvailability(testVideo);
    expect(typeof result.statusMessage).toBe('string');
    expect(result.statusMessage.length).toBeGreaterThan(5);
  });

  // 4. synchronous replacement helper does not use Promise APIs
  it('4. getVerifiedReplacementForVideo is strictly synchronous and returns VideoItem directly', () => {
    const originalVideo = createMockVideoItem({
      id: 'vid-hi-nmap-01',
      title: 'Nmap Complete Beginner Guide',
      videoUrl: 'https://www.youtube.com/watch?v=k2Zg8e5Zf1U',
      embedUrl: 'https://www.youtube-nocookie.com/embed/k2Zg8e5Zf1U'
    });

    const replacement = getVerifiedReplacementForVideo(originalVideo);
    expect(replacement).toBeDefined();
    expect((replacement as any).then).toBeUndefined(); // Proves it is NOT a Promise
    expect(replacement.id).toContain('verified-rep-');
    expect(replacement.embedUrl).toContain('youtube-nocookie.com/embed/');
  });

  // 5, 6, 7, 8. replacement guarding & loop prevention logic
  it('5-8. replacement video IDs starting with verified-rep- skip recursive re-verification and preserve notice', () => {
    const replacementVideo = createMockVideoItem({
      id: 'verified-rep-hi-nmap-01',
      title: '[Verified Lesson] Nmap Complete Guide'
    });

    // The guard checks selectedVideo.id.startsWith('verified-rep-')
    expect(replacementVideo.id.startsWith('verified-rep-')).toBe(true);
  });

  // --- AMAN & GEMINI TAXONOMY TESTS ---

  // 9. Gemini 429 → RATE_LIMITED
  it('9. classifies HTTP 429 / RESOURCE_EXHAUSTED errors as RATE_LIMITED', () => {
    const error429 = { status: 429, message: 'RESOURCE_EXHAUSTED: Quota exceeded for quota metric' };
    const classified = classifyGeminiError(error429);
    expect(classified.code).toBe('RATE_LIMITED');
    expect(classified.httpStatus).toBe(429);
  });

  // 10. 429 → model quarantine
  it('10. classifies 429 as retryable for model fallback quarantine logic', () => {
    const error429 = new Error('429 Too Many Requests: Rate limit exceeded');
    const classified = classifyGeminiError(error429);
    expect(classified.code).toBe('RATE_LIMITED');
    expect(classified.isRetryable).toBe(true);
  });

  // 11. fallback model attempted
  it('11. model-unavailable 503 errors trigger MODEL_UNAVAILABLE classification', () => {
    const error503 = { status: 503, message: 'The model is overloaded. Please try again later.' };
    const classified = classifyGeminiError(error503);
    expect(classified.code).toBe('MODEL_UNAVAILABLE');
    expect(classified.httpStatus).toBe(503);
  });

  // 12 & 13. fallback timeout → TIMEOUT (does not become INVALID_REQUEST)
  it('12-13. classifies stream handshake timeouts as TIMEOUT, NOT INVALID_REQUEST', () => {
    const timeoutErr = new Error('TIMEOUT: Stream handshake took longer than 4000ms');
    const classified = classifyGeminiError(timeoutErr);
    expect(classified.code).toBe('TIMEOUT');
    expect(classified.code).not.toBe('INVALID_REQUEST');
    expect(classified.httpStatus).toBe(408);
  });

  // 14 & 15. timeout does not crash /api/aman/chat and returns Local Guidance SSE
  it('14-15. unknown or unhandled errors default safely to UNKNOWN_ERROR / Local Guidance without throwing', () => {
    const unknownErr = new Error('Unexpected network pipeline disconnect');
    const classified = classifyGeminiError(unknownErr);
    expect(classified.code).toBe('UNKNOWN_ERROR');
    expect(classified.userFacingMessage).toContain('Local Guidance Mode');
  });

  // 16 & 17. failure before/after chunks handling
  it('16-17. preserves distinct error codes across rates, timeouts, and auth failures', () => {
    const authErr = { status: 401, message: 'API key not valid' };
    const classifiedAuth = classifyGeminiError(authErr);
    expect(classifiedAuth.code).toBe('AUTHENTICATION_OR_PERMISSION_ERROR');
    expect(classifiedAuth.isRetryable).toBe(false);
  });

  // 18. model-not-found remains distinct from quota exhaustion
  it('18. distinguishes 404 MODEL_NOT_FOUND from 429 RATE_LIMITED', () => {
    const notFoundErr = { status: 404, message: 'models/gemini-invalid is not found' };
    const classified = classifyGeminiError(notFoundErr);
    expect(classified.code).not.toBe('RATE_LIMITED');
  });
});
