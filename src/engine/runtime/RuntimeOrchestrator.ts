/**
 * MY CYBER LAB — REAL ISOLATED CYBER RANGE ENGINE v2.0
 * Module: /src/engine/runtime/RuntimeOrchestrator.ts
 * Purpose: Unified Runtime Orchestrator managing provider selection, telemetry, and security policy
 */

import {
  IAttackBoxRuntime,
  RuntimeConfig,
  RuntimeInstance,
  RuntimeStatus,
  RuntimeProviderMode
} from './AttackBoxRuntime';
import { VirtualRuntimeProvider } from './providers/VirtualRuntimeProvider';
import { LinuxRuntimeProvider } from './providers/LinuxRuntimeProvider';
import { RulesOfEngagement } from '../types';
import { TerminalOutputLine } from '../attackbox/AttackBoxShell';

export class RuntimeOrchestrator {
  private static instance: RuntimeOrchestrator | null = null;

  private virtualProvider: VirtualRuntimeProvider;
  private linuxProvider: LinuxRuntimeProvider;

  private activeProviders: Map<string, RuntimeProviderMode> = new Map();
  private runtimeConfigs: Map<string, RuntimeConfig> = new Map();

  private constructor() {
    this.virtualProvider = new VirtualRuntimeProvider();
    this.linuxProvider = new LinuxRuntimeProvider();
  }

  public static getInstance(): RuntimeOrchestrator {
    if (!RuntimeOrchestrator.instance) {
      RuntimeOrchestrator.instance = new RuntimeOrchestrator();
    }
    return RuntimeOrchestrator.instance;
  }

  public getProvider(mode: RuntimeProviderMode): IAttackBoxRuntime {
    return mode === 'REAL_ISOLATED' ? this.linuxProvider : this.virtualProvider;
  }

  public async initializeRuntime(config: RuntimeConfig): Promise<RuntimeInstance> {
    this.runtimeConfigs.set(config.runtimeId, config);
    const preferredMode = config.preferredMode || 'SIMULATED';

    // If real is preferred, check availability
    let effectiveMode: RuntimeProviderMode = preferredMode;
    if (preferredMode === 'REAL_ISOLATED') {
      const isRealAvailable = await this.linuxProvider.checkBackendAvailability();
      if (!isRealAvailable) {
        effectiveMode = 'SIMULATED';
      }
    }

    this.activeProviders.set(config.runtimeId, effectiveMode);
    const provider = this.getProvider(effectiveMode);
    const instance = await provider.createRuntime(config);
    return instance;
  }

  public async switchRuntimeMode(runtimeId: string, targetMode: RuntimeProviderMode): Promise<RuntimeStatus> {
    const config = this.runtimeConfigs.get(runtimeId) || {
      runtimeId,
      preferredMode: targetMode
    };

    if (targetMode === 'REAL_ISOLATED') {
      const isRealAvailable = await this.linuxProvider.checkBackendAvailability();
      if (!isRealAvailable) {
        // Must maintain truth in labeling and report fallback
        this.activeProviders.set(runtimeId, 'SIMULATED');
        await this.virtualProvider.createRuntime(config);
        const status = await this.virtualProvider.getStatus(runtimeId);
        status.statusMessage = 'REAL RUNTIME UNAVAILABLE - FALLING BACK TO VIRTUAL ATTACKBOX';
        return status;
      }
    }

    this.activeProviders.set(runtimeId, targetMode);
    const provider = this.getProvider(targetMode);
    await provider.createRuntime(config);
    return await provider.getStatus(runtimeId);
  }

  public getActiveMode(runtimeId: string): RuntimeProviderMode {
    return this.activeProviders.get(runtimeId) || 'SIMULATED';
  }

  public getActiveProvider(runtimeId: string): IAttackBoxRuntime {
    const mode = this.getActiveMode(runtimeId);
    return this.getProvider(mode);
  }

  public async executeCommand(
    runtimeId: string,
    commandStr: string,
    roe: RulesOfEngagement | null
  ): Promise<TerminalOutputLine[]> {
    const provider = this.getActiveProvider(runtimeId);
    return await provider.executeCommand(runtimeId, commandStr, roe);
  }

  public async getStatus(runtimeId: string): Promise<RuntimeStatus> {
    const provider = this.getActiveProvider(runtimeId);
    return await provider.getStatus(runtimeId);
  }

  public async resetRuntime(runtimeId: string): Promise<boolean> {
    const provider = this.getActiveProvider(runtimeId);
    return await provider.resetRuntime(runtimeId);
  }

  public async destroyRuntime(runtimeId: string): Promise<boolean> {
    this.activeProviders.delete(runtimeId);
    this.runtimeConfigs.delete(runtimeId);
    await this.virtualProvider.destroyRuntime(runtimeId);
    await this.linuxProvider.destroyRuntime(runtimeId);
    return true;
  }
}
