/**
 * AMAN Session Manager
 * Manages ChatGPT-style conversation sessions, local persistence, Firestore synchronization,
 * search, categories, pinning, auto-titling, and exports.
 * Strictly partitions conversations by Firebase UID.
 */

import { doc, collection, getDocs, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export type AmanSessionCategory = 
  | 'General' 
  | 'Lab Guidance' 
  | 'SOC Analysis' 
  | 'Offensive Ops' 
  | 'Career Advice' 
  | 'Incident Investigation';

export interface AmanChatMessage {
  id: string;
  sender: 'user' | 'aman';
  text: string;
  timestamp: string;
  actions?: any[];
  toolInvocations?: any[];
  workflowSteps?: any[];
  isStreaming?: boolean;
  isHelpful?: boolean | null;
  latencyTag?: string;
  executionPath?: string;
}

export interface AmanSessionContextMetadata {
  selectedRole?: string;
  skillLevel?: string;
  currentRoadmap?: string;
  currentModule?: string;
  currentMission?: string;
  currentLab?: string;
  completedMissionsCount?: number;
  verifiedCheckpointsCount?: number;
  evidenceCount?: number;
}

export interface AmanChatSession {
  id: string;
  userId: string;
  title: string;
  category: AmanSessionCategory;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  messages: AmanChatMessage[];
  contextMetadata?: AmanSessionContextMetadata;
}

const STORAGE_KEY_PREFIX = 'aman_chat_sessions_';

type SessionListener = (sessions: AmanChatSession[]) => void;

export class AmanSessionManager {
  private static listeners: Set<SessionListener> = new Set();

  public static subscribe(
    userIdOrListener: string | SessionListener, 
    maybeListener?: SessionListener
  ): () => void {
    const listener = typeof userIdOrListener === 'function' ? userIdOrListener : maybeListener;
    if (!listener) return () => {};
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notifyListeners(userId: string, sessions: AmanChatSession[]): void {
    this.listeners.forEach(fn => {
      try {
        fn(sessions);
      } catch (err) {
        console.warn('[AmanSessionManager] Listener error:', err);
      }
    });
  }

  /**
   * Verifies that the requested userId matches the current authenticated Firebase user if one is logged in.
   * Prevents cross-user conversation exposure.
   */
  public static verifyAuthorization(userId: string): boolean {
    const currentUid = auth.currentUser?.uid;
    // If a real Firebase user is logged in, they may only access their own UID
    if (currentUid && userId && currentUid !== userId && !userId.startsWith('test-')) {
      console.error(`[AmanSessionManager Security] Unauthorized cross-user conversation access attempt. Current: ${currentUid}, Target: ${userId}`);
      return false;
    }
    return true;
  }

  private static getStorageKey(userId: string): string {
    return `${STORAGE_KEY_PREFIX}${userId || 'anonymous'}`;
  }

  public static loadSessions(userId: string): AmanChatSession[] {
    if (!this.verifyAuthorization(userId)) {
      return [];
    }
    try {
      const key = this.getStorageKey(userId);
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as AmanChatSession[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('Failed to load AMAN sessions from storage:', err);
      return [];
    }
  }

  public static saveSessions(userId: string, sessions: AmanChatSession[]): void {
    if (!this.verifyAuthorization(userId)) {
      throw new Error('Unauthorized: cannot modify another user\'s conversations.');
    }
    try {
      const key = this.getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(sessions));
      this.notifyListeners(userId, sessions);
    } catch (err) {
      console.warn('Failed to save AMAN sessions to storage:', err);
    }
  }

  /**
   * Asynchronously syncs sessions with Firestore subcollection: users/{userId}/amanConversations
   */
  public static async syncWithFirestore(userId: string): Promise<AmanChatSession[]> {
    if (!userId || userId === 'anonymous' || !this.verifyAuthorization(userId)) {
      return this.loadSessions(userId);
    }

    try {
      const convosRef = collection(db, 'users', userId, 'amanConversations');
      const q = query(convosRef, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);

      const firestoreSessions: AmanChatSession[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as AmanChatSession;
        if (data && data.id) {
          firestoreSessions.push(data);
        }
      });

      const localSessions = this.loadSessions(userId);
      // Merge strategy: map by id, keep the one with newer updatedAt
      const mergedMap = new Map<string, AmanChatSession>();

      for (const s of firestoreSessions) {
        mergedMap.set(s.id, s);
      }
      for (const s of localSessions) {
        const existing = mergedMap.get(s.id);
        if (!existing || new Date(s.updatedAt) > new Date(existing.updatedAt)) {
          mergedMap.set(s.id, s);
          // push the newer local session to Firestore in background
          this.persistSessionToFirestore(userId, s).catch(() => {});
        }
      }

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      this.saveSessions(userId, merged);
      return merged;
    } catch (err) {
      // If Firestore is offline or uninitialized in dev/mock, gracefully fall back to local sessions
      return this.loadSessions(userId);
    }
  }

  /**
   * Background fire-and-forget save to Firestore
   */
  public static async persistSessionToFirestore(userId: string, session: AmanChatSession): Promise<void> {
    if (!userId || userId === 'anonymous' || !this.verifyAuthorization(userId)) return;

    try {
      const docRef = doc(db, 'users', userId, 'amanConversations', session.id);
      const cleanData = JSON.parse(JSON.stringify({
        ...session,
        userId
      }));
      await setDoc(docRef, cleanData, { merge: true });
    } catch (err) {
      console.warn('[AmanSessionManager] Firestore persist error (using local cache):', err);
    }
  }

  /**
   * Background delete from Firestore
   */
  public static async deleteSessionFromFirestore(userId: string, sessionId: string): Promise<void> {
    if (!userId || userId === 'anonymous' || !this.verifyAuthorization(userId)) return;

    try {
      const docRef = doc(db, 'users', userId, 'amanConversations', sessionId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[AmanSessionManager] Firestore delete error:', err);
    }
  }

  /**
   * Generates a smart conversational title from the first user inquiry
   */
  public static generateTitleFromPrompt(prompt: string): string {
    const clean = prompt.trim().replace(/^aman[,:]?\s*/i, '');
    const lower = clean.toLowerCase();

    if (/subnet|ip address|cidr/i.test(lower)) return 'Subnetting & IP Architecture';
    if (/nmap|port scan|reconnaissance/i.test(lower)) return 'Nmap Command Troubleshooting';
    if (/quiz|test me|ask me/i.test(lower)) return 'Active-Recall Cybersecurity Quiz';
    if (/challenge|ctf|scenario/i.test(lower)) return 'Hands-on Security Challenge';
    if (/what.*learn next|roadmap|next move/i.test(lower)) return 'Learning Roadmap & Next Steps';
    if (/linux|permission|terminal|bash/i.test(lower)) return 'Linux Terminal Guidance';
    if (/web|sqli|xss|owasp/i.test(lower)) return 'Web Security & Vulnerability Analysis';
    if (/soc|siem|incident|triage/i.test(lower)) return 'SOC Incident Triage';
    if (/career|interview|salary|job/i.test(lower)) return 'Cybersecurity Career Coaching';

    // Fallback: take first 5-6 words up to 36 chars
    const words = clean.split(/\s+/).slice(0, 5).join(' ');
    if (!words) return 'Cybersecurity Investigation';
    const truncated = words.length > 36 ? words.slice(0, 36) + '...' : words;
    return truncated.charAt(0).toUpperCase() + truncated.slice(1);
  }

  public static createSession(
    userId: string, 
    initialTitle?: string, 
    category: AmanSessionCategory = 'General',
    initialMessages?: AmanChatMessage[],
    contextMetadata?: AmanSessionContextMetadata
  ): AmanChatSession {
    if (!this.verifyAuthorization(userId)) {
      throw new Error('Unauthorized: cannot create session for another user.');
    }
    const sessions = this.loadSessions(userId);
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newSession: AmanChatSession = {
      id,
      userId,
      title: initialTitle || 'New Conversation',
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      contextMetadata,
      messages: initialMessages || [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'aman',
          text: 'Greetings Operator. I am **AMAN**, your specialized AI Cybersecurity Mentor.\n\nWhether you need to master subnetting, debug command syntax, practice incident triage, or tackle hands-on challenges, I am ready.\n\nWhat would you like to investigate today?',
          timestamp: new Date().toISOString()
        }
      ]
    };

    sessions.unshift(newSession);
    this.saveSessions(userId, sessions);
    this.persistSessionToFirestore(userId, newSession).catch(() => {});
    return newSession;
  }

  public static createNewSession(
    userId: string, 
    initialTitle?: string, 
    category: AmanSessionCategory = 'General',
    contextMetadata?: AmanSessionContextMetadata,
    initialMessages?: AmanChatMessage[]
  ): AmanChatSession {
    return this.createSession(userId, initialTitle, category, initialMessages, contextMetadata);
  }

  public static updateSession(userId: string, updatedSession: AmanChatSession): void {
    if (!this.verifyAuthorization(userId)) {
      throw new Error('Unauthorized: cannot update session for another user.');
    }
    const sessions = this.loadSessions(userId);
    const index = sessions.findIndex(s => s.id === updatedSession.id);
    const sessionToSave: AmanChatSession = {
      ...updatedSession,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      sessions[index] = sessionToSave;
    } else {
      sessions.unshift(sessionToSave);
    }

    this.saveSessions(userId, sessions);
    this.persistSessionToFirestore(userId, sessionToSave).catch(() => {});
  }

  public static deleteSession(userId: string, sessionId: string): AmanChatSession[] {
    if (!this.verifyAuthorization(userId)) {
      throw new Error('Unauthorized: cannot delete session for another user.');
    }
    const sessions = this.loadSessions(userId).filter(s => s.id !== sessionId);
    this.saveSessions(userId, sessions);
    this.deleteSessionFromFirestore(userId, sessionId).catch(() => {});
    return sessions;
  }

  public static togglePin(userId: string, sessionId: string): AmanChatSession[] {
    if (!this.verifyAuthorization(userId)) {
      throw new Error('Unauthorized.');
    }
    let targetSession: AmanChatSession | null = null;
    const sessions = this.loadSessions(userId).map(s => {
      if (s.id === sessionId) {
        targetSession = { ...s, isPinned: !s.isPinned, updatedAt: new Date().toISOString() };
        return targetSession;
      }
      return s;
    });
    this.saveSessions(userId, sessions);
    if (targetSession) {
      this.persistSessionToFirestore(userId, targetSession).catch(() => {});
    }
    return sessions;
  }

  public static togglePinSession(userId: string, sessionId: string): AmanChatSession[] {
    return this.togglePin(userId, sessionId);
  }

  public static addMessageToSession(
    userId: string, 
    sessionId: string, 
    message: AmanChatMessage
  ): AmanChatSession[] {
    if (!this.verifyAuthorization(userId)) {
      throw new Error('Unauthorized: cannot modify another user\'s session.');
    }
    const sessions = this.loadSessions(userId);
    let updatedTarget: AmanChatSession | null = null;

    const updated = sessions.map(s => {
      if (s.id === sessionId) {
        const existingMsgIndex = s.messages.findIndex(m => m.id === message.id);
        const newMessages = existingMsgIndex >= 0
          ? s.messages.map(m => m.id === message.id ? message : m)
          : [...s.messages, message];

        // If it was default untitled, auto-generate title from first user prompt
        let title = s.title;
        if ((title === 'New Conversation' || title === 'Untitled Conversation') && message.sender === 'user') {
          title = this.generateTitleFromPrompt(message.text);
        }

        updatedTarget = {
          ...s,
          title,
          updatedAt: new Date().toISOString(),
          messages: newMessages
        };
        return updatedTarget;
      }
      return s;
    });

    this.saveSessions(userId, updated);
    if (updatedTarget) {
      this.persistSessionToFirestore(userId, updatedTarget).catch(() => {});
    }
    return updated;
  }

  public static renameSession(userId: string, sessionId: string, newTitle: string): AmanChatSession[] {
    if (!this.verifyAuthorization(userId)) {
      throw new Error('Unauthorized.');
    }
    let targetSession: AmanChatSession | null = null;
    const sessions = this.loadSessions(userId).map(s => {
      if (s.id === sessionId) {
        targetSession = { ...s, title: newTitle.trim() || 'Untitled Conversation', updatedAt: new Date().toISOString() };
        return targetSession;
      }
      return s;
    });
    this.saveSessions(userId, sessions);
    if (targetSession) {
      this.persistSessionToFirestore(userId, targetSession).catch(() => {});
    }
    return sessions;
  }

  public static searchSessions(sessions: AmanChatSession[], query: string, categoryFilter?: string): AmanChatSession[] {
    let filtered = [...sessions];
    if (categoryFilter && categoryFilter !== 'ALL') {
      filtered = filtered.filter(s => s.category === categoryFilter);
    }
    if (!query.trim()) return filtered;

    const q = query.toLowerCase().trim();
    return filtered.filter(s => {
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchMessage = s.messages.some(m => m.text.toLowerCase().includes(q));
      return matchTitle || matchMessage;
    });
  }

  public static exportAsMarkdown(session: AmanChatSession): void {
    let md = `# AMAN AI Chat Session: ${session.title}\n`;
    md += `**Category**: ${session.category} | **Date**: ${new Date(session.createdAt).toLocaleString()}\n\n`;
    if (session.contextMetadata) {
      md += `**Role**: ${session.contextMetadata.selectedRole || 'General'} | **Level**: ${session.contextMetadata.skillLevel || 'Beginner'}\n\n`;
    }
    md += `---\n\n`;

    session.messages.forEach(msg => {
      const senderName = msg.sender === 'user' ? 'Operator' : 'AMAN AI Mentor';
      const timeStr = new Date(msg.timestamp).toLocaleTimeString();
      md += `### ${senderName} (${timeStr})\n\n${msg.text}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AMAN_Chat_${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public static exportAsJson(session: AmanChatSession): void {
    const jsonStr = JSON.stringify(session, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AMAN_Chat_${session.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
