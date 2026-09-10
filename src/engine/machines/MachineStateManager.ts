/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/machines/MachineStateManager.ts
 * Purpose: Mutable Runtime State, Snapshots, State Persistence, and Deterministic Machine Resets
 */

import { MachineStateSnapshot, CyberMachine, MachineAccessLevel } from '../types';
import { MachineRegistry } from './MachineRegistry';

export class MachineStateManager {
  private static machineStates: Map<string, MachineStateSnapshot> = new Map();

  /**
   * Initializes or fetches an active machine runtime snapshot.
   */
  public static getOrCreateState(machineId: string, sessionId: string): MachineStateSnapshot {
    const key = `${sessionId}_${machineId}`;
    if (!this.machineStates.has(key)) {
      const machine = MachineRegistry.getMachineById(machineId);
      const initialState: MachineStateSnapshot = {
        machineId,
        snapshotId: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        accessLevel: 'DISCOVERED',
        compromisedAccounts: [],
        modifiedFiles: machine ? { ...machine.filesystemBaseline } : {},
        runningProcesses: machine ? machine.services.map(s => s.serviceName) : [],
        stoppedServices: [],
        startedServices: machine ? machine.services.map(s => s.port) : [],
        discoveredCredentials: {},
        capturedFlags: [],
        activeSessionsCount: 1
      };
      this.machineStates.set(key, initialState);
    }
    return this.machineStates.get(key)!;
  }

  /**
   * Updates state attributes (e.g. file creation, privilege escalation, credential discovery).
   */
  public static updateState(
    machineId: string,
    sessionId: string,
    updates: Partial<MachineStateSnapshot>
  ): MachineStateSnapshot {
    const current = this.getOrCreateState(machineId, sessionId);
    const updated: MachineStateSnapshot = {
      ...current,
      ...updates,
      timestamp: new Date().toISOString()
    };
    this.machineStates.set(`${sessionId}_${machineId}`, updated);
    return updated;
  }

  /**
   * Elevates machine access level (e.g., NONE -> DISCOVERED -> ENUMERATED -> USER_ACCESS -> ROOT_SYSTEM_ADMIN).
   */
  public static elevateAccessLevel(
    machineId: string,
    sessionId: string,
    newLevel: MachineAccessLevel
  ): MachineStateSnapshot {
    const current = this.getOrCreateState(machineId, sessionId);
    const levelRanks: Record<MachineAccessLevel, number> = {
      'NONE': 0,
      'DISCOVERED': 1,
      'ENUMERATED': 2,
      'USER_ACCESS': 3,
      'ROOT_SYSTEM_ADMIN': 4
    };

    if (levelRanks[newLevel] > levelRanks[current.accessLevel]) {
      return this.updateState(machineId, sessionId, { accessLevel: newLevel });
    }
    return current;
  }

  /**
   * Resets the machine to its pristine initial baseline snapshot.
   */
  public static resetMachine(machineId: string, sessionId: string): MachineStateSnapshot {
    const key = `${sessionId}_${machineId}`;
    const machine = MachineRegistry.getMachineById(machineId);
    
    const freshSnapshot: MachineStateSnapshot = {
      machineId,
      snapshotId: `snap_reset_${Date.now()}`,
      timestamp: new Date().toISOString(),
      accessLevel: 'DISCOVERED',
      compromisedAccounts: [],
      modifiedFiles: machine ? { ...machine.filesystemBaseline } : {},
      runningProcesses: machine ? machine.services.map(s => s.serviceName) : [],
      stoppedServices: [],
      startedServices: machine ? machine.services.map(s => s.port) : [],
      discoveredCredentials: {},
      capturedFlags: [],
      activeSessionsCount: 1
    };

    this.machineStates.set(key, freshSnapshot);
    return freshSnapshot;
  }

  /**
   * Cleans up sessions to prevent memory leaks in the active process.
   */
  public static destroySessionStates(sessionId: string): void {
    for (const key of Array.from(this.machineStates.keys())) {
      if (key.startsWith(`${sessionId}_`)) {
        this.machineStates.delete(key);
      }
    }
  }
}
