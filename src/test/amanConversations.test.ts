import { describe, it, expect, beforeEach } from 'vitest';
import { AmanSessionManager, AmanChatSession } from '../aman/amanSessionManager';

describe('AMAN Chat Session Manager & ChatGPT-Style Features', () => {
  const testUserId = 'test-operator-101';

  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly creates and persists a new AMAN chat session', () => {
    const session = AmanSessionManager.createSession(
      testUserId,
      'Investigating SQLi Vulnerability',
      'Offensive Ops'
    );

    expect(session.id).toBeDefined();
    expect(session.title).toBe('Investigating SQLi Vulnerability');
    expect(session.category).toBe('Offensive Ops');
    expect(session.messages.length).toBeGreaterThan(0);

    const loaded = AmanSessionManager.loadSessions(testUserId);
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe(session.id);
  });

  it('toggles pinned status on a session', () => {
    const session = AmanSessionManager.createSession(testUserId, 'SOC Alert Triage', 'SOC Analysis');
    expect(session.isPinned).toBe(false);

    const updated = AmanSessionManager.togglePin(testUserId, session.id);
    expect(updated[0].isPinned).toBe(true);

    const updatedAgain = AmanSessionManager.togglePin(testUserId, session.id);
    expect(updatedAgain[0].isPinned).toBe(false);
  });

  it('renames a session accurately', () => {
    const session = AmanSessionManager.createSession(testUserId, 'Old Title', 'General');
    const updated = AmanSessionManager.renameSession(testUserId, session.id, 'New Strategic Title');
    expect(updated[0].title).toBe('New Strategic Title');
  });

  it('deletes a session cleanly', () => {
    const session1 = AmanSessionManager.createSession(testUserId, 'Session 1');
    const session2 = AmanSessionManager.createSession(testUserId, 'Session 2');

    let loaded = AmanSessionManager.loadSessions(testUserId);
    expect(loaded.length).toBe(2);

    const remaining = AmanSessionManager.deleteSession(testUserId, session1.id);
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(session2.id);
  });

  it('filters sessions by search query and category', () => {
    const session1 = AmanSessionManager.createSession(testUserId, 'Nmap Network Scan', 'Offensive Ops');
    const session2 = AmanSessionManager.createSession(testUserId, 'Brute Force Alert', 'SOC Analysis');

    const sessions = AmanSessionManager.loadSessions(testUserId);

    const searchResult = AmanSessionManager.searchSessions(sessions, 'Nmap');
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].id).toBe(session1.id);

    const categoryResult = AmanSessionManager.searchSessions(sessions, '', 'SOC Analysis');
    expect(categoryResult.length).toBe(1);
    expect(categoryResult[0].id).toBe(session2.id);
  });
});
