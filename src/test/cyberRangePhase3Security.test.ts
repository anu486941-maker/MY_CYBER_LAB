/**
 * MY CYBER LAB — REAL ISOLATED CYBER RANGE ENGINE v2.0
 * Module: /src/test/cyberRangePhase3Security.test.ts
 * Purpose: Comprehensive Phase 3 QA & Security Test Suite covering AttackBoxRuntime abstraction,
 *          Virtual vs Linux Runtime Providers, TargetMachineRuntimes, and Truth-in-Labeling.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  RuntimeOrchestrator,
  VirtualRuntimeProvider,
  LinuxRuntimeProvider,
  VirtualTargetProvider,
  LinuxTargetProvider,
  MachineRegistry,
  SessionOrchestrator,
  LabScopeEnforcer
} from '../engine';

describe('MY CYBER LAB — Phase 3 Real Isolated Cyber Range Test Suite', () => {
  let orchestrator: RuntimeOrchestrator;
  const testRuntimeId = 'test-attackbox-01';

  beforeEach(() => {
    orchestrator = RuntimeOrchestrator.getInstance();
  });

  describe('1. AttackBoxRuntime & Provider Abstraction Tests', () => {
    it('should initialize VirtualRuntimeProvider cleanly with correct defaults', async () => {
      const provider = new VirtualRuntimeProvider();
      expect(provider.providerMode).toBe('SIMULATED');
      expect(provider.providerName).toContain('Virtual');

      const inst = await provider.createRuntime({
        runtimeId: testRuntimeId,
        preferredMode: 'SIMULATED',
        user: 'root'
      });

      expect(inst.config.runtimeId).toBe(testRuntimeId);
      expect(inst.status.isRealExecution).toBe(false);
      expect(inst.status.state).toBe('RUNNING');
    });

    it('should execute VFS commands in VirtualRuntimeProvider with scope safety', async () => {
      const provider = new VirtualRuntimeProvider();
      await provider.createRuntime({
        runtimeId: 'vfs-exec-01',
        preferredMode: 'SIMULATED'
      });

      const output = await provider.executeCommand('vfs-exec-01', 'whoami', null);
      expect(output).toHaveLength(2);
      expect(output[1].text).toBe('root');
    });

    it('should block out-of-scope subnet targets in VirtualRuntimeProvider', async () => {
      const provider = new VirtualRuntimeProvider();
      await provider.createRuntime({
        runtimeId: 'scope-block-01',
        preferredMode: 'SIMULATED'
      });

      const roe = {
        engagementId: 'test-roe',
        clientName: 'Test Corp',
        authorizedScope: ['10.20.0.0/24'],
        prohibitedScope: ['192.168.1.1'],
        rules: [],
        authorizedTools: ['nmap'],
        timeLimitMinutes: 60,
        testingWindow: '24/7',
        emergencyContact: 'sec@test.local'
      };

      const output = await provider.executeCommand('scope-block-01', 'nmap -sV 192.168.1.1', roe);
      expect(output.some(l => l.text.includes('SCOPE SECURITY ENFORCER'))).toBe(true);
    });

    it('should report correct network identity and resource metrics in VirtualRuntimeProvider', async () => {
      const provider = new VirtualRuntimeProvider();
      await provider.createRuntime({
        runtimeId: 'metrics-01',
        preferredMode: 'SIMULATED'
      });

      const net = await provider.getNetworkIdentity('metrics-01');
      expect(net.ipAddress).toBe('10.10.14.5');
      expect(net.subnet).toBe('10.10.14.0/24');

      const resources = await provider.getResourceUsage('metrics-01');
      expect(resources.ramMbLimit).toBe(2048);
      expect(resources.cpuPercent).toBeGreaterThan(0);
    });
  });

  describe('2. LinuxRuntimeProvider & Truth in Labeling Tests', () => {
    it('should initialize LinuxRuntimeProvider in REAL_ISOLATED mode', async () => {
      const provider = new LinuxRuntimeProvider();
      expect(provider.providerMode).toBe('REAL_ISOLATED');

      const inst = await provider.createRuntime({
        runtimeId: 'linux-01',
        preferredMode: 'REAL_ISOLATED',
        user: 'attacker'
      });

      expect(inst.config.runtimeId).toBe('linux-01');
      expect(inst.status.user).toBe('attacker');
    });

    it('should report statusMessage containing truth in labeling when real container backend is unprovisioned', async () => {
      const provider = new LinuxRuntimeProvider();
      await provider.createRuntime({
        runtimeId: 'linux-status-check',
        preferredMode: 'REAL_ISOLATED'
      });

      const status = await provider.getStatus('linux-status-check');
      expect(status.providerMode).toBe('REAL_ISOLATED');
      // If real range backend is not enabled in environment, status must indicate UNAVAILABLE with clear truth in labeling
      if (!status.isRealExecution) {
        expect(status.state).toBe('UNAVAILABLE');
        expect(status.statusMessage).toContain('REAL RUNTIME UNAVAILABLE');
      }
    });

    it('should enforce scope policy refusal on LinuxRuntimeProvider prior to network dispatch', async () => {
      const provider = new LinuxRuntimeProvider();
      await provider.createRuntime({
        runtimeId: 'linux-scope-check',
        preferredMode: 'REAL_ISOLATED'
      });

      const roe = {
        engagementId: 'test-roe-02',
        clientName: 'Test Corp',
        authorizedScope: ['10.20.0.0/24'],
        prohibitedScope: ['8.8.8.8'],
        rules: [],
        authorizedTools: ['nmap'],
        timeLimitMinutes: 60,
        testingWindow: '24/7',
        emergencyContact: 'sec@test.local'
      };

      const lines = await provider.executeCommand('linux-scope-check', 'nmap -sV 8.8.8.8', roe);
      expect(lines.some(l => l.text.includes('SCOPE SECURITY ENFORCER'))).toBe(true);
    });
  });

  describe('3. RuntimeOrchestrator Lifecycle & Provider Switch Tests', () => {
    it('should initialize runtime via orchestrator and support dynamic provider switching', async () => {
      const inst = await orchestrator.initializeRuntime({
        runtimeId: 'orch-01',
        preferredMode: 'SIMULATED'
      });

      expect(inst.status.providerMode).toBe('SIMULATED');
      expect(orchestrator.getActiveMode('orch-01')).toBe('SIMULATED');

      const switchedStatus = await orchestrator.switchRuntimeMode('orch-01', 'REAL_ISOLATED');
      expect(switchedStatus).toBeDefined();
    });

    it('should maintain truth in labeling when orchestrator switches to unprovisioned real mode', async () => {
      await orchestrator.initializeRuntime({
        runtimeId: 'orch-fallback-01',
        preferredMode: 'SIMULATED'
      });

      const status = await orchestrator.switchRuntimeMode('orch-fallback-01', 'REAL_ISOLATED');
      // If backend real container is unprovisioned, orchestrator must fall back cleanly or flag status message
      expect(status.statusMessage).toBeDefined();
    });
  });

  describe('4. TargetMachineRuntime & Machine Isolation Tests', () => {
    it('should provision VirtualTargetProvider machine status accurately from registry', async () => {
      const provider = new VirtualTargetProvider();
      const status = await provider.provisionTarget('m-webforge-01');

      expect(status.targetId).toBe('m-webforge-01');
      expect(status.ipAddress).toBe('10.20.0.10');
      expect(status.mode).toBe('VIRTUAL_SERVICE');
      expect(status.state).toBe('ONLINE');
      expect(status.openPorts).toContain(80);
      expect(status.openPorts).toContain(22);
    });

    it('should handle target restart and reset cleanly', async () => {
      const provider = new VirtualTargetProvider();
      await provider.provisionTarget('m-blackout-boss');

      const stopped = await provider.stopTarget('m-blackout-boss');
      expect(stopped).toBe(true);

      const statusAfterStop = await provider.getStatus('m-blackout-boss');
      expect(statusAfterStop.state).toBe('OFFLINE');

      const reset = await provider.resetTarget('m-blackout-boss');
      expect(reset).toBe(true);

      const statusAfterReset = await provider.getStatus('m-blackout-boss');
      expect(statusAfterReset.state).toBe('ONLINE');
    });

    it('should provision LinuxTargetProvider cleanly with fallback handling', async () => {
      const provider = new LinuxTargetProvider();
      const status = await provider.provisionTarget('m-aisec-01');
      expect(status.targetId).toBe('m-aisec-01');
      expect(status.state).toBe('ONLINE');
    });
  });
});
