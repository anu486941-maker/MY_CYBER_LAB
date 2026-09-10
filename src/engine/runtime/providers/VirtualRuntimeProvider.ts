/**
 * MY CYBER LAB — REAL ISOLATED CYBER RANGE ENGINE v2.0
 * Module: /src/engine/runtime/providers/VirtualRuntimeProvider.ts
 * Purpose: Implementation of IAttackBoxRuntime wrapping the simulated AttackBoxShell
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
import { AttackBoxShell, TerminalOutputLine } from '../../attackbox/AttackBoxShell';
import { RulesOfEngagement } from '../../types';

export class VirtualRuntimeProvider implements IAttackBoxRuntime {
  public readonly providerMode: RuntimeProviderMode = 'SIMULATED';
  public readonly providerName: string = 'Virtual AttackBox Shell Simulator';

  private instances: Map<string, { shell: AttackBoxShell; config: RuntimeConfig; startTime: number }> = new Map();
  private streamCallbacks: Map<string, Array<(line: TerminalOutputLine) => void>> = new Map();

  public async createRuntime(config: RuntimeConfig): Promise<RuntimeInstance> {
    const shell = new AttackBoxShell(config.user === 'kali' ? '/home/kali' : '/root');
    const startTime = Date.now();
    this.instances.set(config.runtimeId, { shell, config, startTime });

    const status = await this.getStatus(config.runtimeId);
    return {
      config,
      status,
      provider: this
    };
  }

  public async startRuntime(runtimeId: string): Promise<boolean> {
    const inst = this.instances.get(runtimeId);
    if (!inst) throw new Error(`Virtual runtime [${runtimeId}] does not exist.`);
    return true;
  }

  public async stopRuntime(runtimeId: string): Promise<boolean> {
    return true; // Virtual shell is lightweight, nothing to tear down immediately
  }

  public async resetRuntime(runtimeId: string): Promise<boolean> {
    const inst = this.instances.get(runtimeId);
    if (!inst) throw new Error(`Virtual runtime [${runtimeId}] does not exist.`);
    const newShell = new AttackBoxShell(inst.config.user === 'kali' ? '/home/kali' : '/root');
    inst.shell = newShell;
    inst.startTime = Date.now();
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
    const inst = this.instances.get(runtimeId);
    if (!inst) {
      // Auto-create if omitted for convenience
      await this.createRuntime({
        runtimeId,
        preferredMode: 'SIMULATED',
        user: 'root',
        hostname: 'attackbox',
        ipAddress: '10.10.14.5'
      });
    }

    const currentInst = this.instances.get(runtimeId)!;
    const outputLines = currentInst.shell.execute(commandStr, roe);

    // Stream callback notification if listener registered
    const listeners = this.streamCallbacks.get(runtimeId);
    if (listeners) {
      for (const line of outputLines) {
        for (const cb of listeners) {
          cb(line);
        }
      }
    }

    return outputLines;
  }

  public streamOutput(runtimeId: string, callback: (line: TerminalOutputLine) => void): void {
    const existing = this.streamCallbacks.get(runtimeId) || [];
    existing.push(callback);
    this.streamCallbacks.set(runtimeId, existing);
  }

  public async writeFile(runtimeId: string, path: string, content: string): Promise<boolean> {
    const inst = this.instances.get(runtimeId);
    if (!inst) return false;
    inst.shell.execute(`echo ${JSON.stringify(content)} > ${path}`, null);
    return true;
  }

  public async readFile(runtimeId: string, path: string): Promise<string> {
    const inst = this.instances.get(runtimeId);
    if (!inst) return '';
    const res = inst.shell.execute(`cat ${path}`, null);
    return res.map(l => l.text).join('\n');
  }

  public async listFiles(runtimeId: string, path: string): Promise<string[]> {
    const inst = this.instances.get(runtimeId);
    if (!inst) return [];
    const res = inst.shell.execute(`ls ${path}`, null);
    return res.map(l => l.text);
  }

  public async getStatus(runtimeId: string): Promise<RuntimeStatus> {
    const inst = this.instances.get(runtimeId);
    const network = await this.getNetworkIdentity(runtimeId);
    const resources = await this.getResourceUsage(runtimeId);
    const uptimeSeconds = inst ? Math.floor((Date.now() - inst.startTime) / 1000) : 0;

    return {
      runtimeId,
      providerMode: 'SIMULATED',
      providerName: this.providerName,
      state: inst ? 'RUNNING' : 'STOPPED',
      isRealExecution: false,
      statusMessage: 'Virtual Bash VFS Simulator Active',
      user: inst?.shell.getEnv('USER') || 'root',
      cwd: inst?.shell.getCwd() || '/root',
      network,
      resources,
      uptimeSeconds
    };
  }

  public async getNetworkIdentity(runtimeId: string): Promise<NetworkIdentity> {
    const inst = this.instances.get(runtimeId);
    return {
      ipAddress: inst?.config.ipAddress || '10.10.14.5',
      macAddress: '08:00:27:4e:66:a1',
      subnet: '10.10.14.0/24',
      gateway: '10.10.14.1',
      interfaceName: 'eth0'
    };
  }

  public async getResourceUsage(runtimeId: string): Promise<ResourceUsage> {
    return {
      cpuPercent: 0.5,
      ramMbUsed: 128,
      ramMbLimit: 2048,
      diskMbUsed: 256,
      diskMbLimit: 20480,
      processCount: 3
    };
  }
}
