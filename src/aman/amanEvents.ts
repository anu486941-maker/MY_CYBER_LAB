/**
 * AMAN Agent Runtime v3 - Internal Event System
 * Authoritative event bus for mission lifecycle, lab states, and flag checkpoints.
 */

export type AmanEventType =
  | 'MISSION_STARTED'
  | 'LAB_PROVISIONING'
  | 'LAB_READY'
  | 'LAB_STARTED'
  | 'LAB_STOPPED'
  | 'STUDENT_ACTION'
  | 'VERIFICATION_STARTED'
  | 'VERIFICATION_PASSED'
  | 'VERIFICATION_FAILED'
  | 'FLAG_CHECKPOINT_PASSED'
  | 'MISSION_COMPLETED'
  | 'NEXT_MISSION_UNLOCKED';

export interface AmanEvent {
  type: AmanEventType;
  userId?: string;
  missionId?: string;
  labId?: string;
  score?: number;
  evidenceId?: string;
  timestamp: string;
  data?: any;
}

export type AmanEventListener = (event: AmanEvent) => void;

export class AmanEventBus {
  private static instance: AmanEventBus;
  private listeners: Map<AmanEventType, Set<AmanEventListener>> = new Map();
  private eventHistory: AmanEvent[] = [];

  private constructor() {}

  public static getInstance(): AmanEventBus {
    if (!AmanEventBus.instance) {
      AmanEventBus.instance = new AmanEventBus();
    }
    return AmanEventBus.instance;
  }

  public on(type: AmanEventType, listener: AmanEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    // Return unbind function
    return () => {
      this.listeners.get(type)?.delete(listener);
    };
  }

  public off(type: AmanEventType, listener: AmanEventListener): void {
    this.listeners.get(type)?.delete(listener);
  }

  public emit(event: AmanEvent): void {
    // Ensure timestamp
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString();
    }

    this.eventHistory.push(event);
    if (this.eventHistory.length > 100) {
      this.eventHistory.shift();
    }

    const set = this.listeners.get(event.type);
    if (set) {
      set.forEach(fn => {
        try {
          fn(event);
        } catch (err) {
          console.error(`[AmanEventBus] Error in listener for ${event.type}:`, err);
        }
      });
    }

    // Also dispatch to window for browser DOM listeners if available
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aman-agent-event', { detail: event }));
    }
  }

  public getHistory(limit: number = 20): AmanEvent[] {
    return this.eventHistory.slice(-limit);
  }

  public clear(): void {
    this.listeners.clear();
    this.eventHistory = [];
  }

  /**
   * Generates natural AMAN responses to system events
   */
  public static getNaturalReaction(event: AmanEvent): string {
    switch (event.type) {
      case 'LAB_READY':
      case 'LAB_STARTED':
        return `Your isolated lab machine (${event.labId || 'WebForge Alpha'}) is ready. The environment is active and within authorized sandbox scope 10.20.0.0/24.`;

      case 'VERIFICATION_PASSED':
      case 'FLAG_CHECKPOINT_PASSED':
        return `Excellent work! Your result has been verified authoritatively. Score: ${event.score || 100}%. Evidence has been locked in your Forensic Locker.`;

      case 'VERIFICATION_FAILED':
        return `That attempt did not pass authoritative verification. Let's inspect the target logs and refine your hypothesis.`;

      case 'MISSION_STARTED':
        return `Mission ${event.missionId || 'SOC-001'} initialized. Let's analyze the briefing and start reconnaissance.`;

      case 'NEXT_MISSION_UNLOCKED':
        return `Congratulations! The next tactical checkpoint (${event.missionId || 'SOC-002'}) is now unlocked.`;

      default:
        return `Event ${event.type} logged.`;
    }
  }
}

export const amanEventBus = AmanEventBus.getInstance();
