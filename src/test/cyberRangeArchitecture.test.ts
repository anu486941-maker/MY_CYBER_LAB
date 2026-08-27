import { describe, it, expect } from 'vitest';
import { validateTargetScope } from '../utils/targetAllowlistPolicy';
import { detectConversationalState } from '../aman/amanConversationalState';
import { generateProgressiveHint } from '../aman/progressiveHintSystem';
import { getWeakestSkills, MASTER_SKILL_GRAPH } from '../utils/aiSkillGraphEngine';
import { AiLearningOrchestrator } from '../utils/aiLearningOrchestrator';
import { AUTHORIZED_INCIDENT_MISSIONS } from '../data/incidentMissionsData';
import { getCyberTeams, joinTeamByInviteCode } from '../services/teamsService';
import { verifyAndIssueCertificate } from '../services/certificateService';

describe('MY CYBER LAB Architecture & Cyber Range Test Suite', () => {

  // 1. Target Allowlisting Policy & Safety
  describe('Target Allowlist Policy', () => {
    it('allows authorized lab subnets and local domains', () => {
      expect(validateTargetScope('10.200.1.10').allowed).toBe(true);
      expect(validateTargetScope('172.16.40.20').allowed).toBe(true);
      expect(validateTargetScope('api.finvault.local').allowed).toBe(true);
      expect(validateTargetScope('localhost').allowed).toBe(true);
    });

    it('refuses unauthorized public IPs and external third-party domains', () => {
      const result = validateTargetScope('8.8.8.8');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('TARGET_OUT_OF_SCOPE');
      expect(result.refusalMessage).toContain('outside your authorized training scope');
    });
  });

  // 2. AMAN Conversational State Detection
  describe('AMAN Conversational States', () => {
    it('detects greetings without teaching immediately', () => {
      const res = detectConversationalState('Hi AMAN');
      expect(res.state).toBe('GREETING');
      expect(res.shouldTeachImmediately).toBe(false);
    });

    it('detects lab assistance requests', () => {
      const res = detectConversationalState("I'm stuck on this SQL injection lab");
      expect(res.state).toBe('LAB_ASSISTANCE');
      expect(res.shouldTeachImmediately).toBe(true);
    });

    it('detects report submission feedback requests', () => {
      const res = detectConversationalState('Review my report findings');
      expect(res.state).toBe('REPORT_REVIEW');
    });
  });

  // 3. Progressive Hint System (6-level ladder)
  describe('Progressive Hint System', () => {
    it('returns independent reflection for Level 0', () => {
      const hint = generateProgressiveHint(0, 'SQL Injection', 'Exploit parameter');
      expect(hint.level).toBe(0);
      expect(hint.isSolution).toBe(false);
    });

    it('returns complete solution for Level 5', () => {
      const hint = generateProgressiveHint(5, 'SQL Injection', 'Use UNION SELECT payload');
      expect(hint.level).toBe(5);
      expect(hint.isSolution).toBe(true);
    });
  });

  // 4. AI Skill Graph Engine
  describe('AI Skill Graph Engine', () => {
    it('identifies top weakest skills sorted by score', () => {
      const weak = getWeakestSkills(MASTER_SKILL_GRAPH);
      expect(weak.length).toBeGreaterThan(0);
      expect(weak[0].score).toBeLessThanOrEqual(weak[1].score);
    });
  });

  // 5. 14 Authorized Incident Missions
  describe('14 Authorized Incident Missions', () => {
    it('contains exactly 14 synthetic incident pattern scenarios', () => {
      expect(AUTHORIZED_INCIDENT_MISSIONS.length).toBe(14);
    });

    it('ensures every mission specifies an authoritative flag', () => {
      AUTHORIZED_INCIDENT_MISSIONS.forEach(mission => {
        expect(mission.authoritativeFlag).toBeDefined();
        expect(mission.authoritativeFlag.length).toBeGreaterThan(5);
      });
    });
  });

  // 6. Cyber Teams & Invite Codes
  describe('Cyber Teams Service', () => {
    it('retrieves default teams and joins via invite code', () => {
      const teams = getCyberTeams();
      expect(teams.length).toBeGreaterThan(0);

      const team = joinTeamByInviteCode('BLUE-8891-SOC', 'test-user-99');
      expect(team).not.toBeNull();
      expect(team?.memberUserIds).toContain('test-user-99');
    });
  });

  // 7. Server-Verified Certification Service
  describe('Certificate Service', () => {
    it('issues certificate when readiness score threshold (70%) is satisfied', () => {
      const cert = verifyAndIssueCertificate('SOC Analyst Foundations', 'John Doe', 85);
      expect(cert).not.toBeNull();
      expect(cert?.certificateId).toContain('MCL-CERT-');
    });

    it('refuses certificate issuance when readiness score is below 70%', () => {
      const cert = verifyAndIssueCertificate('SOC Analyst Foundations', 'John Doe', 50);
      expect(cert).toBeNull();
    });
  });
});
