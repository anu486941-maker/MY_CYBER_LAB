/**
 * MY CYBER LAB — REAL ISOLATED CYBER RANGE ENGINE v2.0
 * Module: /src/test/cyberRangePhase3BRealTargets.test.ts
 * Purpose: Integration and Security QA test suite for Phase 3B WEBFORGE-01 real target machine,
 *          vulnerability execution, Directory Traversal exploit, SUID privilege escalation,
 *          network scope enforcement, session isolation, and flag validation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  MachineRegistry,
  MissionRegistry,
  SessionOrchestrator,
  ObjectiveValidator,
  LabScopeEnforcer,
  LinuxTargetProvider,
  VirtualTargetProvider,
  VirtualRuntimeProvider,
  LinuxRuntimeProvider,
  AttackBoxShell
} from '../engine';

describe('MY CYBER LAB — Phase 3B Real Target & Vulnerable Lab Services Test Suite', () => {
  let targetProvider: LinuxTargetProvider;
  let shell: AttackBoxShell;

  const defaultRoE = {
    engagementId: 'webforge-roe',
    clientName: 'WebForge Security Lab',
    authorizedScope: ['10.20.0.0/24', '10.20.0.10', 'webforge.internal'],
    prohibitedScope: ['192.168.0.0/16', 'public internet', '8.8.8.8'],
    rules: ['Strict lab scope'],
    authorizedTools: ['nmap', 'gobuster', 'curl', 'wget', 'hydra', 'sudo'],
    timeLimitMinutes: 120,
    testingWindow: '24/7',
    emergencyContact: 'admin@webforge.internal'
  };

  beforeEach(() => {
    targetProvider = new LinuxTargetProvider();
    shell = new AttackBoxShell('/home/attacker');
  });

  describe('1. WEBFORGE-01 Target Provisioning & Specification Tests', () => {
    it('should register WEBFORGE-01 in MachineRegistry with accurate network & service specs', () => {
      const machine = MachineRegistry.getMachineById('m-webforge-01');
      expect(machine).toBeDefined();
      expect(machine?.codename).toBe('WEBFORGE-01');
      expect(machine?.ipAddress).toBe('10.20.0.10');
      expect(machine?.subnet).toBe('10.20.0.0/24');
      expect(machine?.services).toHaveLength(3);
      expect(machine?.services.map(s => s.port)).toEqual([22, 80, 8080]);
    });

    it('should provision WEBFORGE-01 with truth-in-labeling status', async () => {
      const status = await targetProvider.provisionTarget('m-webforge-01');
      expect(status.targetId).toBe('m-webforge-01');
      expect(status.ipAddress).toBe('10.20.0.10');
      expect(status.openPorts).toEqual([22, 80, 8080]);
      expect(status.isVulnerable).toBe(true);
      expect(['REAL_CONTAINER', 'VIRTUAL_SERVICE']).toContain(status.mode);
    });

    it('should reset target state cleanly to online baseline', async () => {
      const success = await targetProvider.resetTarget('m-webforge-01');
      expect(success).toBe(true);
      const status = await targetProvider.getStatus('m-webforge-01');
      expect(status.state).toBe('ONLINE');
    });
  });

  describe('2. Network Reconnaissance & Port Scanning Tests', () => {
    it('should scan WEBFORGE-01 using nmap and discover exposed SSH and HTTP ports', () => {
      const output = shell.execute('nmap -sV 10.20.0.10', defaultRoE);
      const text = output.map(l => l.text).join('\n');
      expect(text).toContain('Nmap scan report for webforge.internal (10.20.0.10)');
      expect(text).toContain('22/tcp');
      expect(text).toContain('80/tcp');
      expect(text).toContain('8080/tcp');
      expect(text).toContain('OpenSSH');
    });

    it('should perform directory enumeration using gobuster against http://10.20.0.10/', () => {
      const output = shell.execute('gobuster dir -u http://10.20.0.10/', defaultRoE);
      const text = output.map(l => l.text).join('\n');
      expect(text).toContain('gobuster v3.6');
      expect(text).toContain('/backup');
      expect(text).toContain('/backup/db_config.php.bak');
      expect(text).toContain('/api/v1/download');
    });
  });

  describe('3. Vulnerability Exploitation & Artifact Tests', () => {
    it('should expose database backup artifact containing API download hint via curl', () => {
      const output = shell.execute('curl http://10.20.0.10/backup/db_config.php.bak', defaultRoE);
      const text = output.map(l => l.text).join('\n');
      expect(text).toContain('WebForge Staging Database Configuration');
      expect(text).toContain('$db_user = "developer"');
      expect(text).toContain('WebForge_Dev_Pass_2026!');
      expect(text).toContain('/api/v1/download?file=<filepath>');
    });

    it('should exploit Directory Traversal on /api/v1/download to retrieve user.txt flag', () => {
      const output = shell.execute('curl "http://10.20.0.10/api/v1/download?file=../../../../home/developer/user.txt"', defaultRoE);
      const text = output.map(l => l.text).join('\n');
      expect(text).toContain('FLAG{WEBFORGE_DIR_TRAVERSAL_EXPLOITED_8891}');
    });

    it('should inspect /etc/sudoers.d/developer via Directory Traversal to discover privilege escalation vector', () => {
      const output = shell.execute('curl "http://10.20.0.10/api/v1/download?file=../../../../etc/sudoers.d/developer"', defaultRoE);
      const text = output.map(l => l.text).join('\n');
      expect(text).toContain('developer ALL=(ALL) NOPASSWD: /usr/bin/sys-update');
    });

    it('should execute controlled SUID privilege escalation to capture root.txt flag', () => {
      const output = shell.execute('sudo /usr/bin/sys-update', defaultRoE);
      const text = output.map(l => l.text).join('\n');
      expect(text).toContain('System Update Utility v2.1');
      expect(text).toContain('Elevating privileges');
      expect(text).toContain('FLAG{WEBFORGE_ROOT_PRIVILEGE_UNLOCKED_9921}');
    });
  });

  describe('4. Server-Authoritative Flag Validation Tests', () => {
    it('should validate user flag submission through ObjectiveValidator', () => {
      const session = SessionOrchestrator.startSession('learner-01', 'mission-nightfall-webforge');
      const result = ObjectiveValidator.validateFlagSubmission(
        session,
        'obj-access-03',
        'FLAG{WEBFORGE_INITIAL_ACCESS_DEV_8821}'
      );
      expect(result.success).toBe(true);
      expect(result.pointsAwarded).toBe(75);
      expect(session.completedObjectiveIds).toContain('obj-access-03');
    });

    it('should validate root flag submission through ObjectiveValidator', () => {
      const session = SessionOrchestrator.startSession('learner-02', 'mission-nightfall-webforge');
      const result = ObjectiveValidator.validateFlagSubmission(
        session,
        'obj-privesc-04',
        'FLAG{WEBFORGE_ROOT_SYSTEM_MASTER_9901}'
      );
      expect(result.success).toBe(true);
      expect(result.pointsAwarded).toBe(100);
      expect(session.completedObjectiveIds).toContain('obj-privesc-04');
    });

    it('should reject invalid flag strings', () => {
      const session = SessionOrchestrator.startSession('learner-03', 'mission-nightfall-webforge');
      const result = ObjectiveValidator.validateFlagSubmission(
        session,
        'obj-access-03',
        'FLAG{FORGED_FAKE_FLAG}'
      );
      expect(result.success).toBe(false);
      expect(result.pointsAwarded).toBe(0);
    });
  });

  describe('5. Lab Network Topology & Scope Enforcement Tests', () => {
    it('should allow access to authorized lab subnet 10.20.0.0/24', () => {
      const check = LabScopeEnforcer.validateCommand('nmap -sV 10.20.0.10', {
        engagementId: 'test-roe',
        clientName: 'Test Client',
        authorizedScope: ['10.20.0.0/24'],
        prohibitedScope: ['192.168.0.0/16', 'public internet'],
        rules: ['Strict training lab scope'],
        authorizedTools: ['nmap'],
        timeLimitMinutes: 60,
        testingWindow: '24/7',
        emergencyContact: 'test@lab.local'
      });
      expect(check.allowed).toBe(true);
    });

    it('should deny access to prohibited public internet target (8.8.8.8)', () => {
      const check = LabScopeEnforcer.validateCommand('nmap 8.8.8.8', {
        engagementId: 'test-roe',
        clientName: 'Test Client',
        authorizedScope: ['10.20.0.0/24'],
        prohibitedScope: ['8.8.8.8', 'public internet'],
        rules: ['Strict training lab scope'],
        authorizedTools: ['nmap'],
        timeLimitMinutes: 60,
        testingWindow: '24/7',
        emergencyContact: 'test@lab.local'
      });
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('PROHIBITED TARGET');
    });

    it('should deny access to prohibited metadata endpoint (169.254.169.254)', () => {
      const check = LabScopeEnforcer.validateCommand('curl http://169.254.169.254/latest/meta-data/', null);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('No active Rules of Engagement');
    });
  });

  describe('6. Session & Tenant Isolation Tests', () => {
    it('should isolate Session A state from Session B state', () => {
      const sessionA = SessionOrchestrator.startSession('learner-A', 'mission-nightfall-webforge');
      const sessionB = SessionOrchestrator.startSession('learner-B', 'mission-nightfall-webforge');

      ObjectiveValidator.validateFlagSubmission(sessionA, 'obj-access-03', 'FLAG{WEBFORGE_INITIAL_ACCESS_DEV_8821}');

      expect(sessionA.completedObjectiveIds).toContain('obj-access-03');
      expect(sessionB.completedObjectiveIds).not.toContain('obj-access-03');
    });
  });
});
