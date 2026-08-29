/**
 * AMAN Session Manager
 * Manages ChatGPT-style conversation sessions, local persistence, search, categories, pinning, and exports.
 */

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
  isHelpful?: boolean | null;
  latencyTag?: string;
  executionPath?: string;
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
}

const STORAGE_KEY_PREFIX = 'aman_chat_sessions_';

export class AmanSessionManager {
  private static getStorageKey(userId: string): string {
    return `${STORAGE_KEY_PREFIX}${userId || 'anonymous'}`;
  }

  public static loadSessions(userId: string): AmanChatSession[] {
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
    try {
      const key = this.getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(sessions));
    } catch (err) {
      console.warn('Failed to save AMAN sessions to storage:', err);
    }
  }

  public static createSession(
    userId: string, 
    initialTitle?: string, 
    category: AmanSessionCategory = 'General',
    initialMessages?: AmanChatMessage[]
  ): AmanChatSession {
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
      messages: initialMessages || [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'aman',
          text: 'Greetings Operator. I am **AMAN Agent 2.0**, your autonomous AI Instructor and Command Agent.\n\nHow can I assist your operations or career development today?',
          timestamp: new Date().toISOString()
        }
      ]
    };

    sessions.unshift(newSession);
    this.saveSessions(userId, sessions);
    return newSession;
  }

  public static updateSession(userId: string, updatedSession: AmanChatSession): void {
    const sessions = this.loadSessions(userId);
    const index = sessions.findIndex(s => s.id === updatedSession.id);
    if (index >= 0) {
      sessions[index] = {
        ...updatedSession,
        updatedAt: new Date().toISOString()
      };
    } else {
      sessions.unshift(updatedSession);
    }
    this.saveSessions(userId, sessions);
  }

  public static deleteSession(userId: string, sessionId: string): AmanChatSession[] {
    const sessions = this.loadSessions(userId).filter(s => s.id !== sessionId);
    this.saveSessions(userId, sessions);
    return sessions;
  }

  public static togglePin(userId: string, sessionId: string): AmanChatSession[] {
    const sessions = this.loadSessions(userId).map(s => {
      if (s.id === sessionId) {
        return { ...s, isPinned: !s.isPinned, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    this.saveSessions(userId, sessions);
    return sessions;
  }

  public static renameSession(userId: string, sessionId: string, newTitle: string): AmanChatSession[] {
    const sessions = this.loadSessions(userId).map(s => {
      if (s.id === sessionId) {
        return { ...s, title: newTitle.trim() || 'Untitled Conversation', updatedAt: new Date().toISOString() };
      }
      return s;
    });
    this.saveSessions(userId, sessions);
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
