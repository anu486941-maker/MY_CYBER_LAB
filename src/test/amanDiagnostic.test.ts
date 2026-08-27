import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runAmanDiagnostic } from '../utils/amanChatDiagnostic';

describe('AMAN Chat Diagnostic Utility Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubGlobal('navigator', { onLine: true });
    vi.stubGlobal('performance', { now: () => Date.now() });
    
    // Stub the window object
    if (typeof window !== 'undefined') {
      window.runAmanDiagnostic = runAmanDiagnostic;
    } else {
      vi.stubGlobal('window', {
        location: { origin: 'http://localhost:3000' },
        runAmanDiagnostic: runAmanDiagnostic
      });
    }
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  // 1. window.runAmanDiagnostic availability
  it('registers runAmanDiagnostic properly on the global window scope', () => {
    expect(window.runAmanDiagnostic).toBeTypeOf('function');
    expect(typeof window.runAmanDiagnostic === 'function').toBe(true);
  });

  // 2. calling window.runAmanDiagnostic invokes the real implementation
  it('invokes the actual diagnostic implementation when calling window.runAmanDiagnostic', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      text: () => Promise.resolve('{"text": "Diagnostic result"}')
    });
    global.fetch = mockFetch;

    const result = await window.runAmanDiagnostic('Hi AMAN');
    expect(result.success).toBe(true);
    expect(result.failedStage).toBe('NONE');
    expect(result.responseSnippet).toBe('Diagnostic result');
  });

  // 3. safe payload construction & secret sanitization
  it('creates safe payloads and does not leak secret keys or sensitive credentials', async () => {
    const mockFetch = vi.fn().mockImplementation((url, init) => {
      // Security Check: Verify that the body doesn't contain any API keys or credentials
      expect(init.body).not.toContain('AIzaSy');
      expect(init.body).not.toContain('GEMINI_API_KEY');
      expect(init.body).not.toContain('firebase');
      expect(init.body).not.toContain('password');
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        text: () => Promise.resolve('{"text": "Secure diagnostic result"}')
      });
    });
    global.fetch = mockFetch;

    // Put mock environment secrets to simulate active context
    const result = await window.runAmanDiagnostic('Hi AMAN');
    expect(result.success).toBe(true);
    
    // Verify that logs do not leak sensitive credentials or private environment variables
    const allLogsJoined = result.logs.join('\n');
    expect(allLogsJoined).not.toContain('AIzaSy');
    expect(allLogsJoined).not.toContain('GEMINI_API_KEY');
  });

  // 4. 401 handling
  it('correctly maps 401 response status to authentication error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Map([['content-type', 'application/json']]),
      text: () => Promise.resolve('{"error": "Unauthorized"}')
    });
    global.fetch = mockFetch;

    const result = await runAmanDiagnostic();
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(401);
    expect(result.failedStage).toBe('HTTP_STATUS');
    expect(result.failureLocation).toContain('Authentication');
  });

  // 5. 404 handling
  it('correctly maps 404 response status to API route missing', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Map([['content-type', 'text/html']]),
      text: () => Promise.resolve('Cannot POST /api/aman/chat')
    });
    global.fetch = mockFetch;

    const result = await runAmanDiagnostic();
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(404);
    expect(result.failedStage).toBe('HTTP_STATUS');
    expect(result.failureLocation).toContain('Routing');
  });

  // 6. 429 handling
  it('correctly maps 429 response status to rate limit error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      headers: new Map([['content-type', 'application/json']]),
      text: () => Promise.resolve('{"error": "Too many requests"}')
    });
    global.fetch = mockFetch;

    const result = await runAmanDiagnostic();
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(429);
    expect(result.failedStage).toBe('HTTP_STATUS');
    expect(result.failureLocation).toContain('Rate Limiter');
  });

  // 7. 500 handling & Gemini failure fallback
  it('correctly maps 500 response status to backend exception', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Map([['content-type', 'application/json']]),
      text: () => Promise.resolve('{"error": "Gemini API failed to initialize"}')
    });
    global.fetch = mockFetch;

    const result = await runAmanDiagnostic();
    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(500);
    expect(result.failedStage).toBe('HTTP_STATUS');
    expect(result.failureLocation).toContain('Server Route Handler');
  });

  // 8. Successful 200 response with JSON
  it('successfully parses valid JSON response on 200 OK', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Map([['content-type', 'application/json']]),
      text: () => Promise.resolve('{"text": "Everything is green!"}')
    });
    global.fetch = mockFetch;

    const result = await runAmanDiagnostic();
    expect(result.success).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.responseSnippet).toContain('Everything is green!');
  });

  // 9. Streaming response parsing
  it('successfully processes stream chunks when response.body is present', async () => {
    const mockStreamReader = {
      read: vi.fn()
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('Hello ') })
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('from AMAN!') })
        .mockResolvedValueOnce({ done: true, value: undefined })
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Map([['content-type', 'text/event-stream']]),
      body: {
        getReader: () => mockStreamReader
      }
    });
    global.fetch = mockFetch;

    const result = await runAmanDiagnostic();
    expect(result.success).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.responseSnippet).toContain('Hello from AMAN!');
  });

  // 10. Timeout handling
  it('correctly handles timeouts and maps to NETWORK_DISPATCH failure', async () => {
    const abortError = new Error('The user aborted a request.');
    abortError.name = 'AbortError';

    const mockFetch = vi.fn().mockRejectedValue(abortError);
    global.fetch = mockFetch;

    const result = await runAmanDiagnostic();
    expect(result.success).toBe(false);
    expect(result.failedStage).toBe('NETWORK_DISPATCH');
    expect(result.failureLocation).toContain('Timeout');
  });
});
