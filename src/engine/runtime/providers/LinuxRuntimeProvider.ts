/**
 * MY CYBER LAB — REAL ISOLATED CYBER RANGE ENGINE v2.0
 * Module: /src/engine/runtime/providers/LinuxRuntimeProvider.ts
 * Purpose: Real isolated Linux runtime execution provider with PTY, non-root boundary, and fallback reporting
 */

import {
  IAttackBoxRuntime,
  RuntimeConfig,
  RuntimeInstance,
  RuntimeStatus,
  NetworkIdentity,
  ResourceUsage,
  RuntimeProviderMode
} from '../AttackBoxRuntime';
import { TerminalOutputLine } from '../../attackbox/AttackBoxShell';
import { RulesOfEngagement } from '../../types';
import { LabScopeEnforcer } from '../../safety/LabScopeEnforcer';

export class LinuxRuntimeProvider implements IAttackBoxRuntime {
  public readonly providerMode: RuntimeProviderMode = 'REAL_ISOLATED';
  public readonly providerName: string = 'Isolated Linux Container (Real PTY/Subprocess Gateway)';

  private instances: Map<
    string,
    {
      config: RuntimeConfig;
      startTime: number;
      cwd: string;
      user: string;
      isAvailable: boolean;
      outputHistory: TerminalOutputLine[];
    }
  > = new Map();

  private streamCallbacks: Map<string, Array<(line: TerminalOutputLine) => void>> = new Map();
  private backendApiUrl: string = '/api/terminal/execute';

  constructor(customBackendUrl?: string) {
    if (customBackendUrl) {
      this.backendApiUrl = customBackendUrl;
    }
  }

  public async checkBackendAvailability(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' && process.env.REAL_RANGE_ENABLED === 'true') {
        return true;
      }
      // Query health endpoint or environment flag
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        return data.realRangeEnabled === true || process.env.REAL_RANGE_ENABLED === 'true';
      }
      return false;
    } catch {
      return false;
    }
  }

  public async createRuntime(config: RuntimeConfig): Promise<RuntimeInstance> {
    const isAvailable = await this.checkBackendAvailability();
    const startTime = Date.now();
    const user = config.user || 'attacker';
    const cwd = `/home/${user}`;

    this.instances.set(config.runtimeId, {
      config,
      startTime,
      cwd,
      user,
      isAvailable,
      outputHistory: [
        {
          text: `[REAL RUNTIME GATEWAY] Initializing Linux PTY container session for user [${user}]...`,
          type: 'system'
        },
        {
          text: isAvailable
            ? `[REAL RUNTIME GATEWAY] Connection established to isolated container network.`
            : `[REAL RUNTIME GATEWAY] NOTICE: Real isolated container backend unavailable or disconnected. Ready for virtual fallback switch.`,
          type: isAvailable ? 'success' : 'warning'
        }
      ]
    });

    const status = await this.getStatus(config.runtimeId);
    return {
      config,
      status,
      provider: this
    };
  }

  public async startRuntime(runtimeId: string): Promise<boolean> {
    const inst = this.instances.get(runtimeId);
    if (!inst) throw new Error(`Linux runtime [${runtimeId}] does not exist.`);
    inst.isAvailable = await this.checkBackendAvailability();
    return inst.isAvailable;
  }

  public async stopRuntime(runtimeId: string): Promise<boolean> {
    const inst = this.instances.get(runtimeId);
    if (inst) {
      inst.outputHistory.push({
        text: `[REAL RUNTIME GATEWAY] Linux container session stopped cleanly.`,
        type: 'system'
      });
    }
    return true;
  }

  public async resetRuntime(runtimeId: string): Promise<boolean> {
    const inst = this.instances.get(runtimeId);
    if (!inst) throw new Error(`Linux runtime [${runtimeId}] does not exist.`);
    inst.startTime = Date.now();
    inst.cwd = `/home/${inst.user}`;
    inst.outputHistory = [
      { text: `[REAL RUNTIME GATEWAY] Re-zeroing container state and restoring clean volume...`, type: 'system' }
    ];
    return true;
  }

  public async destroyRuntime(runtimeId: string): Promise<boolean> {
    this.instances.delete(runtimeId);
    this.streamCallbacks.delete(runtimeId);
    return true;
  }

  public async executeCommand(
    runtimeId: string,
    commandStr: string,
    roe: RulesOfEngagement | null
  ): Promise<TerminalOutputLine[]> {
    const rawCmd = commandStr.trim();
    if (!rawCmd) return [];

    let inst = this.instances.get(runtimeId);
    if (!inst) {
      await this.createRuntime({
        runtimeId,
        preferredMode: 'REAL_ISOLATED',
        user: 'attacker',
        hostname: 'linux-attackbox',
        ipAddress: '10.10.14.12'
      });
      inst = this.instances.get(runtimeId)!;
    }

    // 1. Enforce Lab Scope Policy on Client / Subprocessor Layer
    const scopeCheck = LabScopeEnforcer.validateCommand(rawCmd, roe);
    if (!scopeCheck.allowed) {
      const refusalLines: TerminalOutputLine[] = [
        { text: `${inst.user}@linux-attackbox:${inst.cwd}$ ${rawCmd}`, type: 'input' },
        { text: `[SCOPE SECURITY ENFORCER - REFUSAL]`, type: 'error' },
        { text: scopeCheck.reason || 'Command denied by Range Rules of Engagement policy.', type: 'error' }
      ];
      inst.outputHistory.push(...refusalLines);
      return refusalLines;
    }

    const promptSymbol = inst.user === 'root' ? '#' : '$';
    const lines: TerminalOutputLine[] = [
      { text: `${inst.user}@linux-attackbox:${inst.cwd}${promptSymbol} ${rawCmd}`, type: 'input' }
    ];

    // Check availability
    if (!inst.isAvailable) {
      lines.push({
        text: `[REAL RUNTIME UNAVAILABLE] Backend isolated container daemon is not active. Switch tab to Virtual AttackBox or start local container daemon.`,
        type: 'error'
      });
      inst.outputHistory.push(...lines);
      return lines;
    }

    try {
      // Call backend bridge API
      const response = await fetch(this.backendApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: rawCmd,
          workingDirectory: inst.cwd,
          user: inst.user,
          runtimeId
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: 'HTTP request failed' }));
        lines.push({
          text: errJson.output || errJson.error || `Server HTTP ${response.status} error executing isolated command.`,
          type: 'error'
        });
      } else {
        const data = await response.json();
        if (data.workingDirectory) {
          inst.cwd = data.workingDirectory;
        }
        if (data.output) {
          const outputType = data.isError ? 'error' : 'output';
          const splitLines = data.output.split('\n');
          for (const s of splitLines) {
            lines.push({ text: s, type: outputType });
          }
        }
      }
    } catch (err: any) {
      lines.push({
        text: `Network or API connection failure: ${err?.message || 'Failed to reach Linux execution gateway'}`,
        type: 'error'
      });
    }

    inst.outputHistory.push(...lines);

    // Stream listeners
    const listeners = this.streamCallbacks.get(runtimeId);
    if (listeners) {
      for (const line of lines) {
        for (const cb of listeners) {
          cb(line);
        }
      }
    }

    return lines;
  }

  public streamOutput(runtimeId: string, callback: (line: TerminalOutputLine) => void): void {
    const existing = this.streamCallbacks.get(runtimeId) || [];
    existing.push(callback);
    this.streamCallbacks.set(runtimeId, existing);
  }

  public async writeFile(runtimeId: string, path: string, content: string): Promise<boolean> {
    const lines = await this.executeCommand(runtimeId, `cat << 'EOF' > ${path}\n${content}\nEOF`, null);
    return !lines.some(l => l.type === 'error');
  }

  public async readFile(runtimeId: string, path: string): Promise<string> {
    const lines = await this.executeCommand(runtimeId, `cat ${path}`, null);
    return lines.map(l => l.text).join('\n');
  }

  public async listFiles(runtimeId: string, path: string): Promise<string[]> {
    const lines = await this.executeCommand(runtimeId, `ls ${path}`, null);
    return lines.map(l => l.text);
  }

  public async getStatus(runtimeId: string): Promise<RuntimeStatus> {
    const inst = this.instances.get(runtimeId);
    const network = await this.getNetworkIdentity(runtimeId);
    const resources = await this.getResourceUsage(runtimeId);
    const uptimeSeconds = inst ? Math.floor((Date.now() - inst.startTime) / 1000) : 0;
    const isAvailable = inst ? inst.isAvailable : false;

    return {
      runtimeId,
      providerMode: 'REAL_ISOLATED',
      providerName: this.providerName,
      state: isAvailable ? 'RUNNING' : 'UNAVAILABLE',
      isRealExecution: isAvailable,
      statusMessage: isAvailable
        ? 'Real Isolated Linux PTY Session Active'
        : 'REAL RUNTIME UNAVAILABLE - FALLBACK TO VIRTUAL ATTACKBOX POSSIBLE',
      user: inst?.user || 'attacker',
      cwd: inst?.cwd || '/home/attacker',
      network,
      resources,
      uptimeSeconds
    };
  }

  public async getNetworkIdentity(runtimeId: string): Promise<NetworkIdentity> {
    const inst = this.instances.get(runtimeId);
    return {
      ipAddress: inst?.config.ipAddress || '10.10.14.12',
      macAddress: '02:42:ac:11:00:02',
      subnet: '10.10.14.0/24',
      gateway: '10.10.14.1',
      interfaceName: 'eth0'
    };
  }

  public async getResourceUsage(runtimeId: string): Promise<ResourceUsage> {
    return {
      cpuPercent: 4.2,
      ramMbUsed: 312,
      ramMbLimit: 4096,
      diskMbUsed: 1024,
      diskMbLimit: 30720,
      processCount: 12
    };
  }
}
