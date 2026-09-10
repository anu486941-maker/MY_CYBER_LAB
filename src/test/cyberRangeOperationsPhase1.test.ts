import { describe, it, expect, beforeEach } from 'vitest';
import {
  MachineRegistry,
  MachineStateManager,
  MissionRegistry,
  SessionOrchestrator,
  ObjectiveValidator,
  PentestReportEngine,
  EvidenceEngine,
  LabScopeEnforcer,
  RangeMasteryBridge,
  AdaptiveMachineSelector
} from '../engine';
import { LearnerProfile, AmanLearningBrain } from '../aman/amanLearningBrain';

describe('MY CYBER LAB — Realistic Ethical Hacker Operations Engine v1.0 [PHASE 1 QA SUITE]', () => {
  const learnerId = 'test-learner-1337';
  const missionId = 'mission-nightfall-webforge';

  beforeEach(() => {
    // Reset test state if needed
  });

  describe('1. Machine Model & Registry Tests', () => {
    it('should retrieve all baseline registered machines', () => {
      const machines = MachineRegistry.getAllMachines();
      expect(machines.length).toBeGreaterThanOrEqual(3);

      const webforge = MachineRegistry.getMachineById('m-webforge-01');
      expect(webforge).toBeDefined();
      expect(webforge?.codename).toBe('WEBFORGE-01');
      expect(webforge?.os).toBe('Ubuntu 22.04 LTS');
      expect(webforge?.services.length).toBe(3);
      expect(webforge?.vulnerabilities.length).toBe(2);
      expect(webforge?.flags.length).toBe(2);
    });

    it('should manage mutable runtime states, snapshots, and clean resets', () => {
      const sessionId = 'test-session-001';
      const machineId = 'm-webforge-01';

      const initial = MachineStateManager.getOrCreateState(machineId, sessionId);
      expect(initial.accessLevel).toBe('DISCOVERED');
      expect(initial.compromisedAccounts.length).toBe(0);

      // Elevate access level
      const elevated = MachineStateManager.elevateAccessLevel(machineId, sessionId, 'USER_ACCESS');
      expect(elevated.accessLevel).toBe('USER_ACCESS');

      const rootElevated = MachineStateManager.elevateAccessLevel(machineId, sessionId, 'ROOT_SYSTEM_ADMIN');
      expect(rootElevated.accessLevel).toBe('ROOT_SYSTEM_ADMIN');

      // Reset machine
      const resetSnapshot = MachineStateManager.resetMachine(machineId, sessionId);
      expect(resetSnapshot.accessLevel).toBe('DISCOVERED');
      expect(resetSnapshot.capturedFlags.length).toBe(0);
    });
  });

  describe('2. Mission Model & RoE Tests', () => {
    it('should enforce structured mission attributes, rules of engagement, and graduated hints', () => {
      const mission = MissionRegistry.getMissionById(missionId);
      expect(mission).toBeDefined();
      expect(mission?.rulesOfEngagement.authorizedScope).toContain('10.20.0.0/24');
      expect(mission?.rulesOfEngagement.prohibitedScope).toContain('public internet');
      expect(mission?.objectives.length).toBe(5);

      const hints = mission?.graduatedHints['obj-recon-01'];
      expect(hints).toBeDefined();
      expect(hints?.length).toBe(3);
      expect(hints?.[0].pedagogicalFocus).toBe('CONCEPTUAL_QUESTION');
    });
  });

  describe('3. Session Orchestrator & Multi-Tenant Isolation Tests', () => {
    it('should isolate sessions per learner and maintain telemetry logs', () => {
      const session = SessionOrchestrator.startSession(learnerId, missionId);
      expect(session.sessionId).toBeDefined();
      expect(session.lifecycleStatus).toBe('ACTIVE');
      expect(session.isRealVm).toBe(false); // Honest sandbox label

      // Cross-tenant protection
      const crossTenantAccess = SessionOrchestrator.getSession(session.sessionId, 'malicious-user-999');
      expect(crossTenantAccess).toBeNull();

      const authorizedAccess = SessionOrchestrator.getSession(session.sessionId, learnerId);
      expect(authorizedAccess).toBeDefined();
      expect(authorizedAccess?.learnerId).toBe(learnerId);

      // Record Telemetry
      const event = SessionOrchestrator.recordTelemetry(
        session.sessionId,
        'nmap -sV -p 80 10.20.0.10',
        0,
        '10.20.0.10'
      );
      expect(event.scopeCompliant).toBe(true);
      expect(session.telemetry.length).toBe(1);

      // Reset Session
      const reset = SessionOrchestrator.resetSession(session.sessionId);
      expect(reset.lifecycleStatus).toBe('ACTIVE');
      expect(reset.completedObjectiveIds.length).toBe(0);
    });
  });

  describe('4. Security Boundaries & Scope Policy Enforcer Tests', () => {
    const mission = MissionRegistry.getMissionById(missionId)!;

    it('should correctly calculate CIDR subnet containment', () => {
      expect(LabScopeEnforcer.isIpInCidr('10.20.0.10', '10.20.0.0/24')).toBe(true);
      expect(LabScopeEnforcer.isIpInCidr('10.20.0.254', '10.20.0.0/24')).toBe(true);
      expect(LabScopeEnforcer.isIpInCidr('10.20.1.10', '10.20.0.0/24')).toBe(false);
      expect(LabScopeEnforcer.isIpInCidr('8.8.8.8', '10.20.0.0/24')).toBe(false);
    });

    it('should allow safe commands inside scope', () => {
      const res = LabScopeEnforcer.validateCommand('ls -la', mission.rulesOfEngagement);
      expect(res.allowed).toBe(true);
      expect(res.category).toBe('SAFE');

      const netRes = LabScopeEnforcer.validateCommand('nmap -sV 10.20.0.10', mission.rulesOfEngagement);
      expect(netRes.allowed).toBe(true);
      expect(netRes.category).toBe('CONTROLLED');
    });

    it('should block destructive commands and sandbox escapes', () => {
      const res1 = LabScopeEnforcer.validateCommand('rm -rf /', mission.rulesOfEngagement);
      expect(res1.allowed).toBe(false);
      expect(res1.category).toBe('BLOCKED');
      expect(res1.violationCode).toBe('DESTRUCTIVE_ACTION');

      const res2 = LabScopeEnforcer.validateCommand('cat /etc/shadow', mission.rulesOfEngagement);
      expect(res2.allowed).toBe(false);
      expect(res2.category).toBe('BLOCKED');
    });

    it('should block out-of-scope and arbitrary internet targeting', () => {
      const res1 = LabScopeEnforcer.validateCommand('nmap -sV 8.8.8.8', mission.rulesOfEngagement);
      expect(res1.allowed).toBe(false);
      expect(res1.category).toBe('BLOCKED');
      expect(res1.violationCode).toBe('OUT_OF_SCOPE_TARGET');

      const res2 = LabScopeEnforcer.validateCommand('curl http://google.com', mission.rulesOfEngagement);
      expect(res2.allowed).toBe(false);
      expect(res2.category).toBe('BLOCKED');
    });
  });

  describe('5. Objective Validation & Flag Submission Tests', () => {
    it('should validate canonical flags and elevate machine access upon root flag capture', () => {
      const session = SessionOrchestrator.startSession(learnerId, missionId);

      // Wrong flag
      const failRes = ObjectiveValidator.validateFlagSubmission(session, 'obj-access-03', 'WRONG_FLAG');
      expect(failRes.success).toBe(false);

      // User flag
      const userRes = ObjectiveValidator.validateFlagSubmission(
        session,
        'obj-access-03',
        'FLAG{WEBFORGE_INITIAL_ACCESS_DEV_8821}'
      );
      expect(userRes.success).toBe(true);
      expect(userRes.pointsAwarded).toBe(75);
      expect(session.completedObjectiveIds).toContain('obj-access-03');

      // Duplicate submission
      const dupRes = ObjectiveValidator.validateFlagSubmission(
        session,
        'obj-access-03',
        'FLAG{WEBFORGE_INITIAL_ACCESS_DEV_8821}'
      );
      expect(dupRes.isAlreadyCompleted).toBe(true);
      expect(dupRes.pointsAwarded).toBe(0);

      // Root flag elevation
      const rootRes = ObjectiveValidator.validateFlagSubmission(
        session,
        'obj-privesc-04',
        'FLAG{WEBFORGE_ROOT_SYSTEM_MASTER_9901}'
      );
      expect(rootRes.success).toBe(true);
      expect(session.activeMachineState['m-webforge-01'].accessLevel).toBe('ROOT_SYSTEM_ADMIN');
    });

    it('should validate terminal output objectives via regex', () => {
      const session = SessionOrchestrator.startSession(learnerId, missionId);
      const res = ObjectiveValidator.evaluateTerminalOutput(
        session,
        'obj-recon-01',
        'PORT   STATE SERVICE\n80/tcp open  http\n8080/tcp open http-proxy'
      );
      expect(res.success).toBe(true);
      expect(res.pointsAwarded).toBe(25);
    });
  });

  describe('6. Evidence Locker & Cryptographic Hashing Tests', () => {
    it('should compute cryptographic hashes and record validated evidence', () => {
      const sessionId = 'test-session-ev';
      const evidence = EvidenceEngine.recordEvidence(
        sessionId,
        'm-webforge-01',
        'Nmap Scan Result',
        'NMAP_SCAN',
        '80/tcp open Apache 2.4.52',
        'T1046',
        'MEDIUM',
        'Apache webserver exposed on port 80',
        'Disable server signature and update Apache'
      );

      expect(evidence.id).toBeDefined();
      expect(evidence.sha256Hash.length).toBe(64);
      expect(evidence.verifiedByAman).toBe(true);

      const sessionEvs = EvidenceEngine.getSessionEvidence(sessionId);
      expect(sessionEvs.length).toBe(1);
    });
  });

  describe('7. Professional Reporting & AMAN Grading Tests', () => {
    it('should generate report draft and evaluate grading criteria with feedback', () => {
      const sessionId = 'test-session-rpt';
      EvidenceEngine.recordEvidence(
        sessionId,
        'm-webforge-01',
        'Port Scan Proof',
        'NMAP_SCAN',
        'Nmap scan data',
        'T1046',
        'LOW',
        'Open ports documented',
        'Filter unused ports'
      );
      EvidenceEngine.recordEvidence(
        sessionId,
        'm-webforge-01',
        'Privilege Escalation Proof',
        'VULNERABILITY_PROOF',
        'Sudo tar exploit output',
        'T1548.003',
        'HIGH',
        'Root achieved via tar wildcard',
        'Remove sudo wildcard'
      );

      const reportDraft = PentestReportEngine.generateReportDraft(
        sessionId,
        missionId,
        learnerId,
        'ShadowHacker'
      );

      expect(reportDraft.findings.length).toBe(2);
      expect(reportDraft.scopeAndRules.scopeComplianceConfirmed).toBe(true);

      const graded = PentestReportEngine.gradeReport(reportDraft);
      expect(graded.amanGrading).toBeDefined();
      expect(graded.amanGrading?.overallScore).toBeGreaterThanOrEqual(80);
      expect(graded.amanGrading?.letterGrade).toMatch(/S\+|S|A/);
      expect(graded.amanGrading?.strengths.length).toBeGreaterThan(0);
    });
  });

  describe('8. AMAN 3.0 Knowledge Graph Mastery Bridge Tests', () => {
    it('should accurately promote learner skills in the Knowledge Graph with zero unearned jumps', () => {
      const profile: LearnerProfile = {
        userId: 'learner-bridge-01',
        targetCareer: 'PENETRATION_TESTER',
        currentOverallLevel: 'BEGINNER',
        preferredLanguage: 'ENGLISH',
        skills: {
          'c1_linux_fs_perms': {
            skillId: 'c1_linux_fs_perms',
            level: 'PRACTICING',
            quizScoreAvg: 85,
            practicalAttempts: 1,
            lastPracticed: new Date().toISOString(),
            identifiedMistakes: []
          },
          'c4_nmap_scanning': {
            skillId: 'c4_nmap_scanning',
            level: 'PRACTICING',
            quizScoreAvg: 85,
            practicalAttempts: 1,
            lastPracticed: new Date().toISOString(),
            identifiedMistakes: []
          }
        },
        mistakeMemory: [],
        activeTopicId: 'c1_linux_fs_perms'
      };

      const session = SessionOrchestrator.startSession(profile.userId, missionId);
      session.completedObjectiveIds = ['obj-recon-01', 'obj-enum-02', 'obj-access-03', 'obj-privesc-04', 'obj-remediation-05'];
      session.hintsUsedCount = 1;

      const result = RangeMasteryBridge.recordMissionCompletion(profile, session);
      expect(result.promotedSkills.length).toBeGreaterThan(0);
      expect(result.updatedProfile.skills['c4_nmap_scanning'].level).toBe('COMPETENT');
    });
  });

  describe('9. Adaptive Machine Selector Tests', () => {
    it('should select next best machine targeting critical career skill gap', () => {
      const profile: LearnerProfile = {
        userId: 'learner-adapt-01',
        targetCareer: 'PENETRATION_TESTER',
        currentOverallLevel: 'BEGINNER',
        preferredLanguage: 'ENGLISH',
        skills: {},
        mistakeMemory: [],
        activeTopicId: 'c1_linux_fs_perms'
      };

      const recommendation = AdaptiveMachineSelector.selectNextMachine(profile);
      expect(recommendation.machine).toBeDefined();
      expect(recommendation.mission).toBeDefined();
      expect(recommendation.reason).toBeDefined();
      expect(recommendation.focusSkills.length).toBeGreaterThan(0);
    });
  });
});
