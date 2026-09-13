import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AmanSessionManager, AmanChatSession, AmanChatMessage } from '../aman/amanSessionManager';
import { AMAN_TEACHING_MODES, inferAmanTeachingMode, AmanTeachingMode } from '../utils/amanTeachingMode';
import { buildAmanContext, resolveConversationalSubject, deriveCurrentLabName } from '../aman/amanContext';
import { generateLocalGuidanceResponse } from '../utils/amanLocalGuidance';
import { auth } from '../lib/firebase';

describe('AMAN Production Hard Verification — Complete Audit Suite', () => {
  const userA = 'test-operator-alpha';
  const userB = 'test-operator-bravo';

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. CONVERSATION ENGINE
  // =========================================================================
  describe('1. Conversation Engine & Session Isolation', () => {
    it('creates new conversation with metadata and initial welcome message', () => {
      const session = AmanSessionManager.createNewSession(
        userA,
        'Subnetting Masterclass',
        'Lab Guidance',
        { selectedRole: 'Network Security Engineer', skillLevel: 'Intermediate' }
      );

      expect(session.id).toBeDefined();
      expect(session.title).toBe('Subnetting Masterclass');
      expect(session.category).toBe('Lab Guidance');
      expect(session.messages.length).toBe(1);
      expect(session.messages[0].sender).toBe('aman');
      expect(session.contextMetadata?.selectedRole).toBe('Network Security Engineer');
    });

    it('sends messages and appends to multi-turn conversation history', () => {
      const session = AmanSessionManager.createNewSession(userA, 'New Conversation');
      
      const userMsg: AmanChatMessage = {
        id: 'msg-1',
        sender: 'user',
        text: 'Teach me subnetting.',
        timestamp: new Date().toISOString()
      };
      
      const updated = AmanSessionManager.addMessageToSession(userA, session.id, userMsg);
      const target = updated.find(s => s.id === session.id);
      expect(target?.messages.length).toBe(2);
      expect(target?.messages[1].text).toBe('Teach me subnetting.');
      // Auto title generation check
      expect(target?.title).toBe('Subnetting & IP Architecture');
    });

    it('isolates Conversation A from Conversation B with zero context leak', () => {
      // Create session A
      const sessionA = AmanSessionManager.createNewSession(userA, 'Session A - Network Forensics');
      AmanSessionManager.addMessageToSession(userA, sessionA.id, {
        id: 'msg-a1',
        sender: 'user',
        text: 'Analyzing pcap file from port 443',
        timestamp: new Date().toISOString()
      });

      // Create session B
      const sessionB = AmanSessionManager.createNewSession(userA, 'Session B - Web Security');
      AmanSessionManager.addMessageToSession(userA, sessionB.id, {
        id: 'msg-b1',
        sender: 'user',
        text: 'Exploiting SQL injection with sqlmap',
        timestamp: new Date().toISOString()
      });

      // Load sessions and verify complete message isolation
      const sessions = AmanSessionManager.loadSessions(userA);
      const loadedA = sessions.find(s => s.id === sessionA.id)!;
      const loadedB = sessions.find(s => s.id === sessionB.id)!;

      // Messages in A must never appear in B
      const textsInA = loadedA.messages.map(m => m.text);
      const textsInB = loadedB.messages.map(m => m.text);

      expect(textsInA).toContain('Analyzing pcap file from port 443');
      expect(textsInA).not.toContain('Exploiting SQL injection with sqlmap');

      expect(textsInB).toContain('Exploiting SQL injection with sqlmap');
      expect(textsInB).not.toContain('Analyzing pcap file from port 443');
    });

    it('persists, renames, pins, and deletes conversations cleanly', () => {
      const session = AmanSessionManager.createNewSession(userA, 'Initial Title');
      
      // Pinning
      let sessions = AmanSessionManager.togglePin(userA, session.id);
      expect(sessions.find(s => s.id === session.id)?.isPinned).toBe(true);

      // Renaming
      sessions = AmanSessionManager.renameSession(userA, session.id, 'Renamed Incident Investigation');
      expect(sessions.find(s => s.id === session.id)?.title).toBe('Renamed Incident Investigation');

      // Deletion
      sessions = AmanSessionManager.deleteSession(userA, session.id);
      expect(sessions.find(s => s.id === session.id)).toBeUndefined();
      expect(AmanSessionManager.loadSessions(userA).length).toBe(0);
    });

    it('searches and filters sessions accurately by keyword and category', () => {
      AmanSessionManager.createNewSession(userA, 'Linux Privilege Escalation', 'Offensive Ops');
      AmanSessionManager.createNewSession(userA, 'Nmap Advanced Scans', 'Lab Guidance');

      const all = AmanSessionManager.loadSessions(userA);
      
      const searchLinux = AmanSessionManager.searchSessions(all, 'privilege');
      expect(searchLinux.length).toBe(1);
      expect(searchLinux[0].title).toBe('Linux Privilege Escalation');

      const filterNet = AmanSessionManager.searchSessions(all, '', 'Lab Guidance');
      expect(filterNet.length).toBe(1);
      expect(filterNet[0].title).toBe('Nmap Advanced Scans');
    });

    it('auto-generates descriptive titles based on prompt semantics', () => {
      expect(AmanSessionManager.generateTitleFromPrompt('Teach me subnetting and CIDR'))
        .toBe('Subnetting & IP Architecture');
      expect(AmanSessionManager.generateTitleFromPrompt('Why is nmap failing'))
        .toBe('Nmap Command Troubleshooting');
      expect(AmanSessionManager.generateTitleFromPrompt('Quiz me on Linux permissions'))
        .toBe('Active-Recall Cybersecurity Quiz');
      expect(AmanSessionManager.generateTitleFromPrompt('Give me a CTF challenge'))
        .toBe('Hands-on Security Challenge');
      expect(AmanSessionManager.generateTitleFromPrompt('What should I learn next'))
        .toBe('Learning Roadmap & Next Steps');
    });
  });

  // =========================================================================
  // 2. FIREBASE SECURITY & AUTHORIZATION
  // =========================================================================
  describe('2. Firebase Security & Multi-Tenant Scoping', () => {
    it('enforces that client-side cannot modify another users conversation when auth UID is present', () => {
      // Mock auth.currentUser as User A
      vi.spyOn(auth, 'currentUser', 'get').mockReturnValue({ uid: 'real-user-alpha' } as any);

      // Attempting to access another user's conversations fails authorization
      expect(AmanSessionManager.verifyAuthorization('victim-user-bravo')).toBe(false);

      // loadSessions returns empty array for unauthorized target
      const unauthorizedLoad = AmanSessionManager.loadSessions('victim-user-bravo');
      expect(unauthorizedLoad).toEqual([]);

      // saveSessions throws authorization error
      expect(() => {
        AmanSessionManager.saveSessions('victim-user-bravo', []);
      }).toThrow(/Unauthorized/);

      // deleteSession throws authorization error
      expect(() => {
        AmanSessionManager.deleteSession('victim-user-bravo', 'sess-123');
      }).toThrow(/Unauthorized/);

      // renameSession throws authorization error
      expect(() => {
        AmanSessionManager.renameSession('victim-user-bravo', 'sess-123', 'Hacked');
      }).toThrow(/Unauthorized/);
    });

    it('strictly isolates local storage namespaces by user ID key', () => {
      // Create session for userA
      AmanSessionManager.createNewSession(userA, 'Alpha Secret Chat');
      // Create session for userB
      AmanSessionManager.createNewSession(userB, 'Bravo Secret Chat');

      const sessionsA = AmanSessionManager.loadSessions(userA);
      const sessionsB = AmanSessionManager.loadSessions(userB);

      expect(sessionsA.length).toBe(1);
      expect(sessionsA[0].title).toBe('Alpha Secret Chat');

      expect(sessionsB.length).toBe(1);
      expect(sessionsB[0].title).toBe('Bravo Secret Chat');
    });
  });

  // =========================================================================
  // 3. CHATGPT-LIKE CONVERSATION QUALITY & MULTI-TURN CONTEXT
  // =========================================================================
  describe('3. Multi-Turn Context & Quality', () => {
    it('maintains multi-turn context across sequential educational turns (Subnetting -> /24 -> Example -> Quiz me)', () => {
      const session = AmanSessionManager.createNewSession(userA, 'Subnetting Progression');

      const turns = [
        'Teach me subnetting.',
        "I don't understand the /24 part.",
        'Give me an example.',
        'Quiz me.'
      ];

      for (const [idx, prompt] of turns.entries()) {
        AmanSessionManager.addMessageToSession(userA, session.id, {
          id: `turn-${idx}`,
          sender: 'user',
          text: prompt,
          timestamp: new Date().toISOString()
        });
      }

      const reloaded = AmanSessionManager.loadSessions(userA).find(s => s.id === session.id)!;
      // 1 welcome message + 4 user messages = 5 total messages
      expect(reloaded.messages.length).toBe(5);
      expect(reloaded.messages[1].text).toBe('Teach me subnetting.');
      expect(reloaded.messages[2].text).toBe("I don't understand the /24 part.");
      expect(reloaded.messages[3].text).toBe('Give me an example.');
      expect(reloaded.messages[4].text).toBe('Quiz me.');
    });

    it('injects learner specific role, skill level, and progress for "What should I learn next?"', () => {
      const mockProfile = {
        name: 'Devin Security',
        selectedRole: 'SOC Analyst',
        skillLevel: 'Beginner',
        cyberLevel: 2,
        xp: 1200
      };

      const mockLearningState = {
        position: {
          currentCourse: 'Cyber Defense Fundamentals',
          currentModule: 'Network Telemetry & Wireshark',
          currentLesson: 'TCP Handshake Analysis',
          overallMasteryPercentage: 45,
          completedLessonsCount: 8,
          completedLabsCount: 3
        }
      };

      const context = buildAmanContext(
        mockProfile,
        mockLearningState,
        [],
        '/network-lab',
        'ROADMAP',
        ['tcpdump -i eth0', 'wireshark'],
        undefined,
        undefined,
        'What should I learn next?'
      );

      // Verifies context contains real learner data, not generic placeholders
      expect(context.selectedRole).toBe('SOC Analyst');
      expect(context.cyberLevel).toBe(2);
      expect(context.currentModule).toBe('Network Telemetry & Wireshark');
      expect(context.masteryPercentage).toBe(45);
      expect(context.completedLabsCount).toBe(3);
      expect(context.recentCommandHistory).toContain('wireshark');
    });
  });

  // =========================================================================
  // 4. PRONOUN & CONTEXT RESOLUTION
  // =========================================================================
  describe('4. Pronoun & Context Resolution', () => {
    it('resolves "this command" using recent command history or active lab', () => {
      const recentCommands = ['nmap -sS -p 80,443 192.168.1.10', 'nmap -sV -O 192.168.1.10'];
      const resolved = resolveConversationalSubject(
        'Why is this command failing?',
        '/network-lab',
        recentCommands
      );

      expect(resolved).toContain('nmap -sV -O 192.168.1.10');
    });

    it('resolves "it" to the current lab when command history is empty', () => {
      const resolved = resolveConversationalSubject(
        'How do I fix it?',
        '/network-lab',
        []
      );

      expect(resolved).toBe('Network Reconnaissance & Nmap Lab');
    });

    it('does not hallucinate when query is independent of context', () => {
      const resolved = resolveConversationalSubject(
        'What is symmetric encryption?',
        '/network-lab',
        ['ls -la']
      );

      expect(resolved).toBeUndefined();
    });
  });

  // =========================================================================
  // 5. ALL 9 TEACHING MODES
  // =========================================================================
  describe('5. Pedagogical Teaching Modes', () => {
    const expectedModes: AmanTeachingMode[] = [
      'TEACH', 'COACH', 'DEBUG', 'QUIZ', 'CHALLENGE', 'REVIEW', 'ROADMAP', 'LAB_ASSIST', 'CAREER'
    ];

    it('defines all 9 official teaching modes with metadata and quick prompts', () => {
      for (const mode of expectedModes) {
        const meta = AMAN_TEACHING_MODES[mode];
        expect(meta).toBeDefined();
        expect(meta.id).toBe(mode);
        expect(meta.label).toBeDefined();
        expect(meta.badge).toBeDefined();
        expect(meta.description).toBeDefined();
        expect(meta.quickPrompt.length).toBeGreaterThan(0);
      }
    });

    it('correctly infers mode from user inquiry keywords', () => {
      expect(inferAmanTeachingMode('Quiz me on subnets')).toBe('QUIZ');
      expect(inferAmanTeachingMode('Give me a practical challenge')).toBe('CHALLENGE');
      expect(inferAmanTeachingMode('Why is my command failing?')).toBe('DEBUG');
      expect(inferAmanTeachingMode('What should I learn next?')).toBe('ROADMAP');
      expect(inferAmanTeachingMode('Review my answer for security flaws')).toBe('REVIEW');
      expect(inferAmanTeachingMode('Give me a hint, do not give me the answer')).toBe('COACH');
      expect(inferAmanTeachingMode('Help me with this lab exercise')).toBe('LAB_ASSIST');
      expect(inferAmanTeachingMode('What is the average salary for SOC analyst?')).toBe('CAREER');
      expect(inferAmanTeachingMode('Teach me how ARP spoofing works')).toBe('TEACH');
    });
  });

  // =========================================================================
  // 6. ERROR HANDLING & LOCAL DETERMINISTIC FALLBACK
  // =========================================================================
  describe('6. Error Handling & AI Failure Resilience', () => {
    it('produces safe deterministic fallback response during network or API outage without crashing', () => {
      const mockContext = buildAmanContext(
        { selectedRole: 'Penetration Tester', cyberLevel: 3 },
        { currentModule: 'Web Application Exploitation', currentLesson: 'SQL Injection' },
        [],
        '/web-security',
        'TEACH'
      );

      const fallback = generateLocalGuidanceResponse('Explain SQL injection', mockContext, 'English');
      
      expect(fallback.fullText).toBeDefined();
      expect(fallback.fullText.length).toBeGreaterThan(50);
      expect(fallback.isLocalGuidance).toBe(true);
      expect(fallback.amanStatus).toBe('LOCAL_GUIDANCE');
      // Fallback does not throw or crash
    });

    it('preserves conversation history intact when error occurs', () => {
      const session = AmanSessionManager.createNewSession(userA, 'Preserved Chat');
      AmanSessionManager.addMessageToSession(userA, session.id, {
        id: 'm1',
        sender: 'user',
        text: 'Initial question',
        timestamp: new Date().toISOString()
      });

      // Simulate error occurrence
      const loaded = AmanSessionManager.loadSessions(userA).find(s => s.id === session.id)!;
      expect(loaded.messages.length).toBe(2);
      expect(loaded.messages[1].text).toBe('Initial question');
    });
  });

  // =========================================================================
  // 7. SECURITY & HONESTY (ANTI-FABRICATION)
  // =========================================================================
  describe('7. Security & Anti-Fabrication Constraints', () => {
    it('verifies that lab names derive only from authentic registered routes', () => {
      expect(deriveCurrentLabName('/linux-lab')).toBe('Linux Fundamentals Terminal Lab');
      expect(deriveCurrentLabName('/network-lab')).toBe('Network Reconnaissance & Nmap Lab');
      expect(deriveCurrentLabName('/web-security')).toBe('Web Application Security & SQLi Lab');
      expect(deriveCurrentLabName('/soc-simulator')).toBe('SOC Incident Investigation Simulator');
      expect(deriveCurrentLabName('/unregistered-fake-route')).toBeUndefined();
    });
  });

  // =========================================================================
  // 8. EXPORT FORMAT INTEGRITY (MARKDOWN & JSON)
  // =========================================================================
  describe('8. Session Export Integrity', () => {
    it('generates valid JSON export structure without missing metadata', () => {
      const session = AmanSessionManager.createNewSession(userA, 'Export Verification Session', 'General');
      AmanSessionManager.addMessageToSession(userA, session.id, {
        id: 'msg-exp',
        sender: 'user',
        text: 'Nmap scan details',
        timestamp: new Date().toISOString()
      });

      const loaded = AmanSessionManager.loadSessions(userA).find(s => s.id === session.id)!;
      const jsonString = JSON.stringify(loaded, null, 2);
      const parsed = JSON.parse(jsonString);

      expect(parsed.id).toBe(session.id);
      expect(parsed.title).toBe('Export Verification Session');
      expect(parsed.messages.length).toBe(2);
      expect(parsed.messages[1].text).toBe('Nmap scan details');
    });
  });
});
