import { describe, it, expect, beforeEach } from 'vitest';
import { AmanIntentEngine } from '../amanIntentEngine';
import { AmanPlanner } from '../amanPlanner';
import { AmanRuntime } from '../amanRuntime';
import { AmanExecutionContext } from '../amanTools';

describe('AMAN Conversational Intelligence & Runtime Suite', () => {
  let runtime: AmanRuntime;
  let mockContext: AmanExecutionContext;

  beforeEach(() => {
    runtime = AmanRuntime.getInstance();
    runtime.clearMemory();

    mockContext = {
      navigate: () => {},
      currentRoute: '/dashboard',
      evidenceLocker: [],
      profile: {
        id: 'user_test_01',
        name: 'Alex',
        cyberLevel: 2,
        rank: 'Security Specialist',
        xp: 1250,
        targetRole: 'ethical-hacker',
        evidenceLocker: []
      },
      learningState: {
        currentCourse: 'Networking Fundamentals',
        currentLesson: 'Switches, Routers & Default Gateways',
        activeLab: 'NET-001'
      }
    };
  });

  it('1. User: "How are you?" -> Natural English response, no navigation, zero learning tool calls', async () => {
    const classification = AmanIntentEngine.classifyIntent('How are you?');
    expect(classification.intent).toBe('SMALL_TALK');
    expect(classification.mode).toBe('CHAT_MODE');
    expect(classification.isCasual).toBe(true);

    const response = await runtime.handleUserMessage('How are you?', mockContext);
    expect(response.isCasual).toBe(true);
    expect(response.stepsExecuted || 0).toBe(0);
    expect(response.text.toLowerCase()).toContain("i'm doing great");
    expect(response.text).not.toContain('You are currently on');
    expect(response.text).not.toContain('Networking Fundamentals');
  });

  it('2. User: "I\'m fine." -> Natural conversational response, no mission injection', async () => {
    const classification = AmanIntentEngine.classifyIntent("I'm fine.");
    expect(classification.isCasual).toBe(true);

    const response = await runtime.handleUserMessage("I'm fine.", mockContext);
    expect(response.isCasual).toBe(true);
    expect(response.text.toLowerCase()).toMatch(/glad to hear|what would you like to work on/i);
    expect(response.text).not.toContain('You are currently learning');
  });

  it('3. User: "What am I learning?" -> Current learning context without irrelevant extras', async () => {
    const classification = AmanIntentEngine.classifyIntent('What am I learning?');
    expect(classification.intent).toBe('LEARNING_QUESTION');
    expect(classification.mode).toBe('LEARNING_MODE');

    const response = await runtime.handleUserMessage('What am I learning?', mockContext);
    expect(response.text).toContain('Networking Fundamentals');
    expect(response.text).toContain('Switches, Routers & Default Gateways');
  });

  it('4. User: "Explain what a default gateway is." -> Clear technical explanation in English', async () => {
    const classification = AmanIntentEngine.classifyIntent('Explain what a default gateway is.');
    expect(classification.intent).toBe('TECHNICAL_HELP');
    expect(classification.mode).toBe('LEARNING_MODE');

    const response = await runtime.handleUserMessage('Explain what a default gateway is.', mockContext);
    expect(response.text).toContain('Default Gateway');
    expect(response.text).toContain('router');
    expect(response.text).not.toContain('You are currently on');
  });

  it('5. User: "Open my unsolved web challenges." -> Challenge discovery + navigation to /flag-checkpoint', async () => {
    const classification = AmanIntentEngine.classifyIntent('Open my unsolved web challenges.');
    expect(classification.intent).toBe('CHALLENGE_DISCOVERY');

    const plan = AmanPlanner.createPlan('Open my unsolved web challenges.', mockContext);
    expect(plan.steps.some(s => s.toolName === 'getUnsolvedMissions')).toBe(true);
    expect(plan.steps.some(s => s.toolName === 'navigate')).toBe(true);

    const response = await runtime.handleUserMessage('Open my unsolved web challenges.', mockContext);
    expect(response.stepsExecuted).toBeGreaterThan(0);
    expect(response.text).toContain('Flag Checkpoint');
  });

  it('6. User: "Start my cyber lab." -> Authorized lab orchestration plan and startup', async () => {
    const classification = AmanIntentEngine.classifyIntent('Start my cyber lab.');
    expect(classification.intent).toBe('LAB_CONTROL');
    expect(classification.mode).toBe('LAB_MODE');

    const plan = AmanPlanner.createPlan('Start my cyber lab.', mockContext);
    expect(plan.steps.some(s => s.toolName === 'createLab')).toBe(true);
    expect(plan.steps.some(s => s.toolName === 'startLab')).toBe(true);

    const response = await runtime.handleUserMessage('Start my cyber lab.', mockContext);
    expect(response.text).toContain('sandbox is started');
  });

  it('7. User: "Continue." -> Resolves previous context and resumes', async () => {
    // Seed conversational memory
    await runtime.handleUserMessage('Open my unsolved web challenges.', mockContext);

    const classification = AmanIntentEngine.classifyIntent('Continue.', runtime.getMemory(), mockContext.currentRoute);
    expect(classification.intent).toBe('COMMAND');

    const plan = AmanPlanner.createPlan('Continue.', mockContext, runtime.getMemory());
    expect(plan.steps.some(s => s.toolName === 'navigate')).toBe(true);
  });

  it('8. User: "Make it harder." -> Uses previous challenge context and increases difficulty', async () => {
    // Seed conversational memory with web category
    await runtime.handleUserMessage('Open my unsolved web challenges.', mockContext);

    const classification = AmanIntentEngine.classifyIntent('Make it harder.', runtime.getMemory(), mockContext.currentRoute);
    expect(classification.intent).toBe('COMMAND');
    expect(classification.resolvedEntity?.category).toBe('web');

    const plan = AmanPlanner.createPlan('Make it harder.', mockContext, runtime.getMemory());
    expect(plan.steps.some(s => s.toolName === 'getUnsolvedMissions' && s.params?.sort === 'hardest')).toBe(true);
  });

  it('9. User in Hinglish: "mujhe networking samjha do" -> Understands intent and explains in English', async () => {
    const classification = AmanIntentEngine.classifyIntent('mujhe networking samjha do');
    expect(classification.detectedLanguage).toBe('Hinglish');
    expect(classification.intent).toBe('TECHNICAL_HELP');

    const response = await runtime.handleUserMessage('mujhe networking samjha do', mockContext);
    expect(response.text).toContain('Networking Fundamentals');
    expect(response.text).toContain('TCP/IP');
  });

  it('10. User: "thik chal rhi ha" -> Natural conversational response without cybersecurity injection', async () => {
    const classification = AmanIntentEngine.classifyIntent('thik chal rhi ha');
    expect(classification.intent).toBe('SMALL_TALK');
    expect(classification.isCasual).toBe(true);

    const response = await runtime.handleUserMessage('thik chal rhi ha', mockContext);
    expect(response.isCasual).toBe(true);
    expect(response.text).toMatch(/Glad to hear that|What would you like to work on/i);
    expect(response.text).not.toContain('Networking Fundamentals');
    expect(response.text).not.toContain('You are currently on');
  });
});
