/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/sessions/SessionOrchestrator.ts
 * Purpose: Multi-Tenant Session Isolation, Lifecycle Orchestration, and Telemetry Recording
 */

import { CyberRangeSession, RangeSessionTelemetryEvent, SessionLifecycleStatus } from '../types';
import { MissionRegistry } from '../missions/MissionRegistry';
import { MachineStateManager } from '../machines/MachineStateManager';
import { LabScopeEnforcer } from '../safety/LabScopeEnforcer';

export class SessionOrchestrator {
  private static sessions: Map<string, CyberRangeSession> = new Map();

  /**
   * Initializes an isolated session for a learner targeting a specific mission.
   */
  public static startSession(learnerId: string, missionId: string): CyberRangeSession {
    const mission = MissionRegistry.getMissionById(missionId);
    if (!mission) {
      throw new Error(`Cannot start session: Mission [${missionId}] not found in registry.`);
    }

    const sessionId = `crs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (mission.estimatedTimeMinutes || 60) * 60 * 1000);

    const initialMachineStates: Record<string, any> = {};
    for (const machineId of mission.targetMachines) {
      initialMachineStates[machineId] = MachineStateManager.getOrCreateState(machineId, sessionId);
    }

    const session: CyberRangeSession = {
      sessionId,
      learnerId,
      missionId,
      targetMachineIds: [...mission.targetMachines],
      activeMachineState: initialMachineStates,
      attackBoxConfig: {
        attackBoxIp: '10.20.0.50',
        hostname: 'aman-attackbox.lab',
        currentWorkingDir: '/home/student',
        activeUser: 'student',
        assignedSubnet: mission.rulesOfEngagement.authorizedScope[0] || '10.20.0.0/24'
      },
      lifecycleStatus: 'ACTIVE',
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastActivityAt: now.toISOString(),
      hintsUsedCount: 0,
      telemetry: [],
      collectedEvidenceIds: [],
      completedObjectiveIds: [],
      isRealVm: false, // Explicit & honest labeling: isolated training container/sandbox
      environmentLabel: 'Controlled Cybersecurity Training Sandbox'
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Retrieves an active session with strict ownership verification.
   */
  public static getSession(sessionId: string, learnerId?: string): CyberRangeSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (learnerId && session.learnerId !== learnerId) {
      console.warn(`[SECURITY AUDIT] Unauthorized cross-tenant session access attempt on [${sessionId}] by user [${learnerId}]`);
      return null;
    }

    // Auto-expire check
    if (new Date() > new Date(session.expiresAt) && session.lifecycleStatus === 'ACTIVE') {
      session.lifecycleStatus = 'EXPIRED';
    }

    return session;
  }

  /**
   * Records execution telemetry for an action or terminal command in the session.
   */
  public static recordTelemetry(
    sessionId: string,
    command: string,
    exitCode: number,
    targetIp: string = '10.20.0.10',
    discoveredInfo?: string
  ): RangeSessionTelemetryEvent {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const mission = MissionRegistry.getMissionById(session.missionId);
    const scopeCheck = LabScopeEnforcer.validateCommand(command, mission ? mission.rulesOfEngagement : null);

    const event: RangeSessionTelemetryEvent = {
      timestamp: new Date().toISOString(),
      sessionId,
      sourceIp: session.attackBoxConfig.attackBoxIp,
      targetIp,
      command,
      exitCode,
      actionCategory: scopeCheck.allowed ? 'ENUMERATION' : 'POLICY_VIOLATION',
      scopeCompliant: scopeCheck.allowed,
      noiseScore: command.includes('-p-') || command.includes('-A') ? 85 : 25,
      discoveredInfo
    };

    session.telemetry.push(event);
    session.lastActivityAt = new Date().toISOString();

    return event;
  }

  /**
   * Resets all machines and session states to clean baseline.
   */
  public static resetSession(sessionId: string): CyberRangeSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    for (const machineId of session.targetMachineIds) {
      session.activeMachineState[machineId] = MachineStateManager.resetMachine(machineId, sessionId);
    }

    session.completedObjectiveIds = [];
    session.hintsUsedCount = 0;
    session.lifecycleStatus = 'ACTIVE';
    session.lastActivityAt = new Date().toISOString();

    return session;
  }

  /**
   * Terminates and cleans up the session.
   */
  public static terminateSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lifecycleStatus = 'TERMINATED';
      MachineStateManager.destroySessionStates(sessionId);
    }
  }
}
