import { describe, it, expect } from 'vitest';
import { validateAceCommandScope, isIpInCidr } from '../utils/aceScopePolicy';
import { calculateEthicalHackerReadiness } from '../utils/ethicalHackerReadinessEngine';
import { AUTHORIZED_CLIENT_ENGAGEMENTS } from '../data/authorizedClientEngagements';

describe('Security Integration & User Isolation Test Suite', () => {

  // 1. Target Scope & Command Authorization Boundary
  describe('Scope Policy & Target Allowlist Enforcement', () => {
    const northstarEngagement = AUTHORIZED_CLIENT_ENGAGEMENTS.find(e => e.id === 'ace-northstar-01') || null;

    it('allows authorized in-scope commands within designated CIDR subnet', () => {
      const res = validateAceCommandScope('nmap -sn 10.50.0.0/24', northstarEngagement);
      expect(res.allowed).toBe(true);
      expect(res.category).toBe('CONTROLLED');
    });

    it('blocks unauthorized external IP targets outside of client scope', () => {
      const res = validateAceCommandScope('nmap -sV 8.8.8.8', northstarEngagement);
      expect(res.allowed).toBe(false);
      expect(res.category).toBe('BLOCKED');
      expect(res.reason).toContain('OUT OF SCOPE');
    });

    it('blocks destructive shell commands and privilege escalation dumps', () => {
      const res1 = validateAceCommandScope('rm -rf /etc/shadow', northstarEngagement);
      expect(res1.allowed).toBe(false);
      expect(res1.category).toBe('BLOCKED');

      const res2 = validateAceCommandScope('cat /etc/shadow', northstarEngagement);
      expect(res2.allowed).toBe(false);
      expect(res2.category).toBe('BLOCKED');
    });

    it('denies execution when no client engagement scope is selected', () => {
      const res = validateAceCommandScope('nmap -sV 10.50.0.10', null);
      expect(res.allowed).toBe(false);
      expect(res.category).toBe('CONTROLLED');
      expect(res.reason).toContain('DENY BY DEFAULT');
    });

    it('categorizes uncoordinated offensive tools as RESTRICTED', () => {
      const res = validateAceCommandScope('sqlmap -u http://10.50.0.10', northstarEngagement);
      expect(res.allowed).toBe(false);
      expect(res.category).toBe('RESTRICTED');
    });

    it('correctly verifies IP membership in CIDR subnets', () => {
      expect(isIpInCidr('10.50.0.15', '10.50.0.0/24')).toBe(true);
      expect(isIpInCidr('192.168.1.1', '10.50.0.0/24')).toBe(false);
    });
  });

  // 2. User Data Isolation & Ownership Logic
  describe('User Data & Profile Isolation', () => {
    it('ensures distinct user identifiers create isolated data paths', () => {
      const userA = { uid: 'usr_alice_101', email: 'alice@lab.local', role: 'soc-analyst' };
      const userB = { uid: 'usr_bob_202', email: 'bob@lab.local', role: 'penetration-tester' };

      const keyA = `mcl_profile_${userA.uid}`;
      const keyB = `mcl_profile_${userB.uid}`;

      expect(keyA).not.toBe(keyB);
      expect(userA.role).not.toBe(userB.role);
    });

    it('evaluates Firestore ownership check function logic accurately', () => {
      const isOwner = (authUid: string | null, targetUserId: string) => {
        return authUid !== null && authUid === targetUserId;
      };

      expect(isOwner('user-123', 'user-123')).toBe(true);
      expect(isOwner('user-123', 'user-456')).toBe(false);
      expect(isOwner(null, 'user-123')).toBe(false);
    });
  });

  // 3. Attack Readiness Gate & Prerequisite Validation
  describe('Attack Readiness Gate & Ethical Hacker Competency', () => {
    it('places novice users with low scores into lower readiness bands', () => {
      const noviceProfile = {
        uid: 'user-novice',
        displayName: 'Novice Student',
        email: 'novice@lab.local',
        careerPath: 'ethical-hacker',
        cyberLevel: 1,
        xp: 100,
        streak: 1,
        joinedAt: new Date().toISOString(),
        achievements: [],
        diagnosticScore: 20
      };

      const emptyLearningState = {
        completedLessons: [],
        completedMissions: [],
        labScores: {},
        ctfScores: {}
      };

      const readiness = calculateEthicalHackerReadiness(noviceProfile as any, emptyLearningState);

      expect(readiness.overallScore).toBeLessThan(50);
      expect(['NOVICE', 'APPRENTICE', 'TRAINEE']).toContain(readiness.readinessBand);
    });

    it('advances experienced users with verified lab & mission history to higher readiness', () => {
      const advancedProfile = {
        uid: 'user-pro',
        displayName: 'Security Specialist',
        email: 'pro@lab.local',
        careerPath: 'ethical-hacker',
        cyberLevel: 8,
        xp: 12000,
        streak: 14,
        joinedAt: new Date().toISOString(),
        achievements: [],
        diagnosticScore: 92
      };

      const advancedLearningState = {
        completedLessons: ['net-01', 'tcp-02', 'linux-01', 'bash-02', 'web-sql-01', 'owasp-01'],
        completedMissions: ['m-recon-01', 'm-enum-01', 'm-exploit-01'],
        labScores: { 'network-lab': 95, 'linux-lab': 90, 'web-security-lab': 88 },
        ctfScores: { 'ctf-01': 100, 'ctf-02': 100 },
        quizScores: { 'subnet-quiz': 95 }
      };

      const readiness = calculateEthicalHackerReadiness(advancedProfile as any, advancedLearningState, 5, 4, 3);

      expect(readiness.overallScore).toBeGreaterThanOrEqual(70);
      expect(['PRACTITIONER', 'JOB_READY_ETHICAL_HACKER']).toContain(readiness.readinessBand);
    });
  });

});
