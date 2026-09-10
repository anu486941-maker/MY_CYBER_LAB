import { describe, it, expect } from 'vitest';
import { AmanToolRegistry } from '../aman/amanToolRegistry';
import { AmanTurboRouter } from '../aman/amanTurboRouter';

describe('AMAN Autonomous Cyber Range Orchestrator & Checkpoint Tests', () => {
  const dummyContext: any = {
    navigate: (route: string) => {},
    currentRoute: '/dashboard',
    profile: {
      name: 'Agent Operator',
      email: 'operator@mycyberlab.test',
      cyberLevel: 3,
      subscriptionTier: 'PRO',
      completedMissions: []
    },
    learningState: {
      position: {
        completedLabsCount: 5,
        completedLessonsCount: 8,
        overallMasteryPercentage: 72
      }
    },
    evidenceLocker: [],
    addEvidence: (ev: any) => ({ ...ev, id: 'ev-test-1', timestamp: new Date().toISOString() }),
    addXp: (amount: number, reason?: string) => {}
  };

  const dummyCompactContext: any = {
    selectedRole: 'soc-analyst',
    activeRole: 'soc-analyst',
    cyberLevel: 3,
    xp: 450,
    completedLabsCount: 5,
    evidenceCount: 1
  };

  describe('1. Tool Registry Verification', () => {
    it('registers find_unsolved_challenge tool with READ_ONLY permission', () => {
      const tool = AmanToolRegistry.getTool('find_unsolved_challenge');
      expect(tool).toBeDefined();
      expect(tool?.category).toBe('CHECKPOINT');
      expect(tool?.permission).toBe('READ_ONLY');
    });

    it('find_unsolved_challenge prioritizes SOC-001 Flag Checkpoint for web security', async () => {
      const tool = AmanToolRegistry.getTool('find_unsolved_challenge');
      const result = await tool?.execute({ category: 'web-security' }, dummyContext);
      expect(result).toBeDefined();
      expect(result.id).toBe('SOC-001');
      expect(result.targetRoute).toBe('/flag-checkpoint');
      expect(result.targetMachine).toContain('WebForge Alpha');
      expect(result.authorizedScope).toBe('10.20.0.0/24');
    });

    it('registers start_cyber_machine tool with LAB_ACTION permission', () => {
      const tool = AmanToolRegistry.getTool('start_cyber_machine');
      expect(tool).toBeDefined();
      expect(tool?.category).toBe('CYBER_RANGE');
      expect(tool?.permission).toBe('LAB_ACTION');
    });

    it('start_cyber_machine provisions sandboxed container target with honest labels', async () => {
      const tool = AmanToolRegistry.getTool('start_cyber_machine');
      const result = await tool?.execute({ missionId: 'SOC-001' }, dummyContext);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.isRealVm).toBe(false);
      expect(result.attackBox?.attackBoxIp).toBe('10.20.0.50');
      expect(result.attackBox?.assignedSubnet).toBe('10.20.0.0/24');
      expect(result.environmentLabel).toContain('Controlled Cybersecurity Training Sandbox');
    });

    it('registers verify_checkpoint_flag tool', () => {
      const tool = AmanToolRegistry.getTool('verify_checkpoint_flag');
      expect(tool).toBeDefined();
      expect(tool?.category).toBe('CHECKPOINT');
    });
  });

  describe('2. Turbo Router Intent Resolution', () => {
    it('routes "I want to work on an unsolved web-security query" to /flag-checkpoint with full workflow', async () => {
      let routedTo = '';
      const trackingContext = {
        ...dummyContext,
        navigate: (route: string) => { routedTo = route; }
      };

      const result = await AmanTurboRouter.route(
        'I want to work on an unsolved web-security query',
        trackingContext,
        dummyCompactContext
      );

      expect(result).toBeDefined();
      expect(result?.handledLocally).toBe(true);
      expect(result?.intentCategory).toBe('CYBER_RANGE_ORCHESTRATION');
      expect(result?.targetRoute).toBe('/flag-checkpoint');
      expect(routedTo).toBe('/flag-checkpoint');
      expect(result?.text).toContain('SOC-001');
      expect(result?.text).toContain('WebForge Alpha');
      expect(result?.text).toContain('10.20.0.50');
      expect(result?.workflowSteps).toHaveLength(4);
    });

    it('routes "Prepare my authorized lab environment" and provisions range sandbox', async () => {
      let routedTo = '';
      const trackingContext = {
        ...dummyContext,
        navigate: (route: string) => { routedTo = route; }
      };

      const result = await AmanTurboRouter.route(
        'Prepare my authorized lab environment',
        trackingContext,
        dummyCompactContext
      );

      expect(result).toBeDefined();
      expect(result?.handledLocally).toBe(true);
      expect(result?.intentCategory).toBe('CYBER_RANGE_ORCHESTRATION');
      expect(result?.targetRoute).toBe('/flag-checkpoint');
      expect(routedTo).toBe('/flag-checkpoint');
      expect(result?.text).toContain('WebForge Alpha');
      expect(result?.text).toContain('Controlled Cybersecurity Training Sandbox');
    });

    it('routes "verify flag" to Flag Checkpoint workspace', async () => {
      let routedTo = '';
      const trackingContext = {
        ...dummyContext,
        navigate: (route: string) => { routedTo = route; }
      };

      const result = await AmanTurboRouter.route(
        'Verify my flag',
        trackingContext,
        dummyCompactContext
      );

      expect(result).toBeDefined();
      expect(result?.handledLocally).toBe(true);
      expect(result?.intentCategory).toBe('CHECKPOINT_VERIFICATION');
      expect(result?.targetRoute).toBe('/flag-checkpoint');
      expect(routedTo).toBe('/flag-checkpoint');
      expect(result?.text).toContain('/api/mission/checkpoint-verify');
    });
  });
});
