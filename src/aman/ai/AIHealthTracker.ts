/**
 * AMAN 3.0 - AI Health State Machine & Provider Health Tracker
 * Tracks isolated health status, quarantine windows, and error classifications per provider.
 */

import { AIProviderHealthStatus, AIProviderHealthInfo } from './AIProvider';

export class AIHealthTracker {
  private static instance: AIHealthTracker;
  private healthMap: Map<string, {
    status: AIProviderHealthStatus;
    failureCount: number;
    lastFailureTime?: number;
    quarantineUntil?: number;
    reason?: string;
  }> = new Map();

  public static getInstance(): AIHealthTracker {
    if (!AIHealthTracker.instance) {
      AIHealthTracker.instance = new AIHealthTracker();
    }
    return AIHealthTracker.instance;
  }

  public recordSuccess(providerKey: string): void {
    const current = this.healthMap.get(providerKey);
    if (current && current.status !== 'DISABLED') {
      current.status = 'AVAILABLE';
      current.failureCount = 0;
      current.reason = undefined;
    }
  }

  public recordFailure(
    providerKey: string,
    reason: string,
    quarantineDurationMs: number = 30000,
    isPermanentQuota: boolean = false
  ): void {
    const current = this.healthMap.get(providerKey) || {
      status: 'AVAILABLE',
      failureCount: 0
    };

    current.failureCount += 1;
    current.lastFailureTime = Date.now();
    current.reason = reason;

    if (isPermanentQuota) {
      current.status = 'QUARANTINED';
      current.quarantineUntil = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    } else if (quarantineDurationMs > 0) {
      current.status = 'TEMPORARILY_UNAVAILABLE';
      current.quarantineUntil = Date.now() + quarantineDurationMs;
    } else {
      current.status = 'DEGRADED';
    }

    this.healthMap.set(providerKey, current);
  }

  public setDisabled(providerKey: string, reason: string = 'Provider disabled by configuration'): void {
    this.healthMap.set(providerKey, {
      status: 'DISABLED',
      failureCount: 0,
      reason
    });
  }

  public getHealth(providerKey: string, providerName: string, modelName: string): AIProviderHealthInfo {
    const entry = this.healthMap.get(providerKey);
    if (!entry) {
      return {
        status: 'AVAILABLE',
        providerName,
        modelName,
        failureCount: 0
      };
    }

    // Check if quarantine expired
    if (entry.quarantineUntil && Date.now() > entry.quarantineUntil) {
      entry.status = 'AVAILABLE';
      entry.quarantineUntil = undefined;
      entry.failureCount = 0;
      entry.reason = undefined;
    }

    return {
      status: entry.status,
      providerName,
      modelName,
      failureCount: entry.failureCount,
      lastFailureTime: entry.lastFailureTime,
      quarantineUntil: entry.quarantineUntil,
      reason: entry.reason
    };
  }

  public isAvailable(providerKey: string): boolean {
    const entry = this.healthMap.get(providerKey);
    if (!entry) return true;
    if (entry.status === 'DISABLED') return false;
    if (entry.quarantineUntil && Date.now() <= entry.quarantineUntil) return false;
    if (entry.status === 'TEMPORARILY_UNAVAILABLE' || entry.status === 'QUARANTINED') {
      if (entry.quarantineUntil && Date.now() > entry.quarantineUntil) {
        entry.status = 'AVAILABLE';
        entry.quarantineUntil = undefined;
        return true;
      }
      return false;
    }
    return true;
  }

  public clearAllQuarantines(): void {
    for (const [key, entry] of this.healthMap.entries()) {
      if (entry.status !== 'DISABLED') {
        entry.status = 'AVAILABLE';
        entry.quarantineUntil = undefined;
        entry.failureCount = 0;
        entry.reason = undefined;
      }
    }
  }
}
