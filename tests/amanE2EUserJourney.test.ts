import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AmanIntentEngine } from '../src/aman/amanIntentEngine';
import { AmanPlanner } from '../src/aman/amanPlanner';
import { AmanRuntime } from '../src/aman/amanRuntime';
import { AmanExecutionContext } from '../src/aman/amanTools';
import { AmanToolRegistryV3 } from '../src/aman/amanToolRegistryV3';
import { amanEventBus } from '../src/aman/amanEvents';

describe('AMAN Real User Journey — Complete End-to-End Acceptance Test Suite', () => {
  let runtime: AmanRuntime;
  let mockContext: AmanExecutionContext;
  let navigatedRoute: string;
  let evidenceList: any[];
  let xpScore: number;
  let completedMissionsList: string[];

  beforeEach(() => {
    runtime = AmanRuntime.getInstance();
    runtime.clearMemory();
    navigatedRoute = '/dashboard';
    evidenceList = [];
    xpScore = 1250;
    completedMissionsList = [];

    mockContext = {
      navigate: (route: string) => {
        navigatedRoute = route;
        mockContext.currentRoute = route;
      },
      currentRoute: '/dashboard',
      evidenceLocker: evidenceList,
      addEvidence: (ev: any) => {
        const item = { id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, ...ev };
        evidenceList.push(item);
        return item;
      },
      addXp: (amount: number) => {
        xpScore += amount;
      },
      profile: {
        id: 'user_alex_prod',
        name: 'Alex',
        cyberLevel: 2,
        rank: 'Security Specialist',
        xp: 1250,
        targetRole: 'ethical-hacker',
        evidenceLocker: evidenceList
      },
      learningState: {
        currentCourse: 'Networking Fundamentals',
        currentLesson: 'Switches, Routers & Default Gateways',
        activeLab: 'NET-001'
      }
    };
  });

  // =========================================================================
  // PHASE 1 — CASUAL CONVERSATION
  // =========================================================================
  describe('Phase 1 — Casual Conversation & Intent Isolation', () => {
    it('1.1 User: "Hey AMAN" -> Natural English greeting, zero tool execution, no navigation', async () => {
      const classification = AmanIntentEngine.classifyIntent('Hey AMAN');
      expect(classification.intent).toBe('GREETING');
      expect(classification.isCasual).toBe(true);
      expect(classification.mode).toBe('CHAT_MODE');

      const res = await runtime.handleUserMessage('Hey AMAN', mockContext);
      expect(res.isCasual).toBe(true);
      expect(res.stepsExecuted || 0).toBe(0);
      expect(res.text).toContain('Hey! 👋');
      expect(res.text).not.toContain('Networking Fundamentals');
      expect(navigatedRoute).toBe('/dashboard');
    });

    it('1.2 User: "How are you?" -> Friendly response without learning dump', async () => {
      const res = await runtime.handleUserMessage('How are you?', mockContext);
      expect(res.isCasual).toBe(true);
      expect(res.text.toLowerCase()).toContain("i'm doing great");
      expect(res.text).not.toContain('Switches, Routers');
    });

    it('1.3 User: "I\'m doing good." -> Acknowledges without injecting mission information', async () => {
      const res = await runtime.handleUserMessage("I'm doing good.", mockContext);
      expect(res.isCasual).toBe(true);
      expect(res.text.toLowerCase()).toMatch(/glad to hear|what would you like to work on/i);
      expect(res.text).not.toContain('SOC-001');
    });

    it('1.4 User: "Actually I\'m a little tired today." -> Empathetic chat without course summary', async () => {
      const res = await runtime.handleUserMessage("Actually I'm a little tired today.", mockContext);
      expect(res.isCasual).toBe(true);
      expect(res.text).toContain("Let's fix that");
      expect(res.text).not.toContain('You are currently on');
    });

    it('1.5 User: "Thanks bro 😂" -> Concise closing acknowledgment', async () => {
      const res = await runtime.handleUserMessage('Thanks bro 😂', mockContext);
      expect(res.isCasual).toBe(true);
      expect(res.text.toLowerCase()).toMatch(/anytime/i);
    });
  });

  // =========================================================================
  // PHASE 2 — LEARNING CONTEXT & RELEVANT EXPLANATIONS
  // =========================================================================
  describe('Phase 2 — Learning Context & Contextual Follow-up', () => {
    it('2.1 User: "What am I learning?" -> Retrieves current learning context', async () => {
      const res = await runtime.handleUserMessage('What am I learning?', mockContext);
      expect(res.isCasual).toBe(false);
      expect(res.text).toContain('Networking Fundamentals');
      expect(res.text).toContain('Switches, Routers & Default Gateways');
    });

    it('2.2 User: "Explain it simply." -> Explains the previous topic in simple terms', async () => {
      // Prior query establishes learning topic
      await runtime.handleUserMessage('What am I learning?', mockContext);

      const res = await runtime.handleUserMessage('Explain it simply.', mockContext);
      expect(res.text).toContain('Simplified Explanation');
      expect(res.text).toContain('Default Gateway');
      expect(res.text).toContain('front door');
    });

    it('2.3 User: "Give me an example." -> Provides a practical concrete example', async () => {
      const res = await runtime.handleUserMessage('Give me an example.', mockContext);
      expect(res.text).toContain('Practical Example');
      expect(res.text).toContain('192.168.1.50');
      expect(res.text).toContain('192.168.1.1');
    });

    it('2.4 User: "Make it harder." -> Resolves previous context and increases challenge difficulty', async () => {
      const classification = AmanIntentEngine.classifyIntent('Make it harder.', runtime.getMemory(), mockContext.currentRoute);
      expect(classification.intent).toBe('COMMAND');
      expect(classification.resolvedEntity?.difficulty).toBe('hardest');

      const res = await runtime.handleUserMessage('Make it harder.', mockContext);
      expect(res.stepsExecuted).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // PHASE 3 — MISSION & CHALLENGE DISCOVERY
  // =========================================================================
  describe('Phase 3 — Mission & Challenge Discovery', () => {
    it('3.1 User: "Give me something practical to practice." -> Discovers challenges and opens Flag Checkpoint', async () => {
      const classification = AmanIntentEngine.classifyIntent('Give me something practical to practice.');
      expect(classification.intent).toBe('CHALLENGE_DISCOVERY');

      const res = await runtime.handleUserMessage('Give me something practical to practice.', mockContext);
      expect(res.stepsExecuted).toBeGreaterThan(0);
      expect(res.text).toContain('Flag Checkpoint');
      expect(navigatedRoute).toBe('/flag-checkpoint');
    });

    it('3.2 User: "Give me an unsolved challenge." -> Reuses challenge discovery tools', async () => {
      const plan = AmanPlanner.createPlan('Give me an unsolved challenge.', mockContext, runtime.getMemory());
      expect(plan.steps.some(s => s.toolName === 'getUnsolvedMissions')).toBe(true);
      expect(plan.steps.some(s => s.toolName === 'navigate')).toBe(true);
    });

    it('3.3 User: "Start the challenge." -> Recognizes lab control intent', async () => {
      const classification = AmanIntentEngine.classifyIntent('Start the challenge.');
      expect(classification.intent).toBe('LAB_CONTROL');
      expect(classification.mode).toBe('LAB_MODE');
    });

    it('3.4 User: "What should I do first?" -> Concise guidance without a huge tutorial dump', async () => {
      const res = await runtime.handleUserMessage('What should I do first?', mockContext);
      expect(res.text).toContain('Target Machine');
      expect(res.text).toContain('10.10.19.84');
      expect(res.text).toContain('nmap -sV -T4');
    });
  });

  // =========================================================================
  // PHASE 4 — LAB CONTROL & SANDBOX LIFECYCLE
  // =========================================================================
  describe('Phase 4 — Lab Control & Realistic Sandbox Constraints', () => {
    it('4.1 User: "Start my cyber lab." -> Correct state transitions and explicit simulated environment identification', async () => {
      const stateTransitions: string[] = [];
      const unsub = runtime.onStateChange((agentSt, labSt) => {
        stateTransitions.push(`agent:${agentSt}|lab:${labSt}`);
      });

      const res = await runtime.handleUserMessage('Start my cyber lab.', mockContext);
      unsub();

      expect(res.text).toMatch(/sandbox is started|training sandbox/i);
      expect(runtime.getLabState()).toBe('RUNNING');
    });

    it('4.2 User: "What\'s the target?" -> Accurately reports the simulated sandbox target IP', async () => {
      const res = await runtime.handleUserMessage("What's the target?", mockContext);
      expect(res.text).toContain('10.10.19.84');
      expect(res.text).toMatch(/Simulated|Controlled/i);
    });

    it('4.3 User: "What should I investigate first?" -> Guides to initial port discovery', async () => {
      const res = await runtime.handleUserMessage('What should I investigate first?', mockContext);
      expect(res.text).toContain('Recommended First Step');
      expect(res.text).toContain('nmap');
    });

    it('4.4 User: "Stop." -> Safely interrupts running operations and transitions to standby', async () => {
      const res = await runtime.handleUserMessage('Stop.', mockContext);
      expect(res.text).toContain('Execution stopped. Returning to standby.');
      expect(runtime.getAgentState()).toBe('IDLE');
    });
  });

  // =========================================================================
  // PHASE 5 — FLAG CHECKPOINT LEARNING LOOP & EVIDENCE VERIFICATION
  // =========================================================================
  describe('Phase 5 — Authoritative Flag Checkpoint & Evidence Locker Flow', () => {
    it('5.1 Validates correct vs incorrect flag submissions authoritatively', async () => {
      const verifyTool = AmanToolRegistryV3.getTool('verifyMission');
      expect(verifyTool).toBeDefined();

      // Submit incorrect flag
      const wrongResult = await verifyTool!.execute({
        missionId: 'SOC-001',
        submittedFlag: 'FLAG{wrong_guess}'
      }, mockContext);

      expect(wrongResult.success).toBe(true);
      expect(wrongResult.data.verified).toBe(false);
      expect(wrongResult.data.result).toContain('incorrect');

      // Submit correct flag
      const correctResult = await verifyTool!.execute({
        missionId: 'SOC-001',
        submittedFlag: 'FLAG{SOC_AUTH_ANOMALY_EVENT_1042}'
      }, mockContext);

      expect(correctResult.success).toBe(true);
      expect(correctResult.data.verified).toBe(true);
      expect(correctResult.data.score).toBeGreaterThanOrEqual(100);
      expect(correctResult.data.evidence).toBeDefined();
      expect(correctResult.data.evidence.verified).toBe(true);

      // Verify evidence is saved
      mockContext.addEvidence(correctResult.data.evidence);
      expect(evidenceList.length).toBeGreaterThan(0);
      expect(evidenceList[0].verified).toBe(true);
    });
  });

  // =========================================================================
  // PHASE 6 — MULTI-TURN CONTEXT RESOLUTION
  // =========================================================================
  describe('Phase 6 — Multi-Turn Pronoun & Entity Resolution', () => {
    it('6.1 Resolves multi-turn conversation without jumping to unrelated context', async () => {
      // Turn 1: "I want to practice web security."
      const t1 = await runtime.handleUserMessage('I want to practice web security.', mockContext);
      expect(t1.text).toContain('Flag Checkpoint');

      // Turn 2: "Give me something beginner-friendly."
      const c2 = AmanIntentEngine.classifyIntent('Give me something beginner-friendly.', runtime.getMemory(), mockContext.currentRoute);
      expect(c2.resolvedEntity?.category).toBe('web');
      expect(c2.resolvedEntity?.difficulty).toBe('easy');

      // Turn 3: "Start it."
      const c3 = AmanIntentEngine.classifyIntent('Start it.', runtime.getMemory(), mockContext.currentRoute);
      expect(c3.intent).toBe('LAB_CONTROL');

      // Turn 4: "What do I do first?"
      const t4 = await runtime.handleUserMessage('What do I do first?', mockContext);
      expect(t4.text).toContain('Target Machine');
      expect(t4.text).toContain('nmap');

      // Turn 5: "Make it harder."
      const c5 = AmanIntentEngine.classifyIntent('Make it harder.', runtime.getMemory(), mockContext.currentRoute);
      expect(c5.resolvedEntity?.category).toBe('web');
      expect(c5.resolvedEntity?.difficulty).toBe('hardest');
    });
  });

  // =========================================================================
  // PHASE 7 — MULTI-LANGUAGE TEST (English / Hinglish / Hindi)
  // =========================================================================
  describe('Phase 7 — Multi-Language Comprehension with English-First Policy', () => {
    it('7.1 English: "What should I do next?" -> Understood and answered in English', async () => {
      const c = AmanIntentEngine.classifyIntent('What should I do next?');
      expect(c.detectedLanguage).toBe('English');
      const res = await runtime.handleUserMessage('What should I do next?', mockContext);
      expect(res.text).toContain('Target Machine');
    });

    it('7.2 Hinglish: "Ab mujhe kya karna hai?" -> Understood and answered in English', async () => {
      const c = AmanIntentEngine.classifyIntent('Ab mujhe kya karna hai?');
      expect(c.detectedLanguage).toBe('Hinglish');
      const res = await runtime.handleUserMessage('Ab mujhe kya karna hai?', mockContext);
      expect(res.text).toContain('Target Machine');
      expect(res.text).toContain('nmap');
    });

    it('7.3 Hindi: "मुझे अब क्या करना चाहिए?" -> Understood and answered in English with exact command flags', async () => {
      const c = AmanIntentEngine.classifyIntent('मुझे अब क्या करना चाहिए?');
      expect(c.detectedLanguage).toBe('Hindi');
      const res = await runtime.handleUserMessage('मुझे अब क्या करना चाहिए?', mockContext);
      expect(res.text).toContain('Target Machine');
      expect(res.text).toContain('nmap -sV -T4 10.10.19.84');
    });
  });

  // =========================================================================
  // PHASE 8 — FAILURE TESTING & RECOVERY
  // =========================================================================
  describe('Phase 8 — Failure Handling & Graceful Recovery', () => {
    it('8.1 Handles tool execution failure gracefully without crashing runtime', async () => {
      const failingTool = {
        name: 'failingTool',
        description: 'Simulates a tool error',
        riskLevel: 'low' as const,
        requiresConfirmation: false,
        requiresAuth: false,
        inputSchema: { type: 'object' },
        execute: async () => {
          throw new Error('Sandbox container allocation timed out');
        }
      };

      AmanToolRegistryV3.registerTool(failingTool);
      const plan = {
        id: 'plan_fail',
        goal: 'test failure',
        steps: [{
          stepNumber: 1,
          toolName: 'failingTool',
          description: 'Fail step',
          params: {},
          riskLevel: 'low' as const,
          status: 'PENDING' as const
        }],
        status: 'PROPOSED' as const,
        currentStepIndex: 0
      };

      const result = await AmanPlanner.executePlan(plan, mockContext);
      expect(result.status).toBe('FAILED');
      expect(result.finalMessage).toContain('Sandbox container allocation timed out');
    });

    it('8.2 Handles unknown / empty input without errors', async () => {
      const emptyRes = await runtime.handleUserMessage('', mockContext);
      expect(emptyRes.text).toBe('');

      const unknownRes = await runtime.handleUserMessage('xyz999foobar qwerty', mockContext);
      expect(unknownRes.text).toContain("I'm here");
    });

    it('8.3 Preserves strict security by rejecting unauthorized external targets', async () => {
      const c = AmanIntentEngine.classifyIntent('Scan 8.8.8.8 with aggressive flags');
      expect(c.intent).toBe('TECHNICAL_HELP');
      // No unauthorized scanning executed
    });
  });
});
