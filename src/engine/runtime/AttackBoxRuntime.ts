/**
 * MY CYBER LAB — REAL ISOLATED CYBER RANGE ENGINE v2.0
 * Module: /src/engine/runtime/AttackBoxRuntime.ts
 * Purpose: Provider-independent execution runtime interface and core runtime types
 */

import { RulesOfEngagement } from '../types';
import { TerminalOutputLine } from '../attackbox/AttackBoxShell';

export type RuntimeProviderMode = 'SIMULATED' | 'REAL_ISOLATED';

export interface NetworkIdentity {
  ipAddress: string;
  macAddress: string;
  subnet: string;
  gateway: string;
  interfaceName: string;
}

export interface ResourceUsage {
  cpuPercent: number;
  ramMbUsed: number;
  ramMbLimit: number;
  diskMbUsed: number;
  diskMbLimit: number;
  processCount: number;
}

export interface RuntimeStatus {
  runtimeId: string;
  providerMode: RuntimeProviderMode;
  providerName: string;
  state: 'INITIALIZING' | 'RUNNING' | 'PAUSED' | 'STOPPED' | 'ERROR' | 'UNAVAILABLE';
  isRealExecution: boolean;
  statusMessage: string;
  user: string;
  cwd: string;
  network: NetworkIdentity;
  resources: ResourceUsage;
  uptimeSeconds: number;
}

export interface RuntimeConfig {
  runtimeId: string;
  preferredMode: RuntimeProviderMode;
  user?: string;
  hostname?: string;
  ipAddress?: string;
  subnet?: string;
  cpuLimitPercent?: number;
  ramLimitMb?: number;
  timeoutSeconds?: number;
}

export interface IAttackBoxRuntime {
  readonly providerMode: RuntimeProviderMode;
  readonly providerName: string;

  createRuntime(config: RuntimeConfig): Promise<RuntimeInstance>;
  startRuntime(runtimeId: string): Promise<boolean>;
  stopRuntime(runtimeId: string): Promise<boolean>;
  resetRuntime(runtimeId: string): Promise<boolean>;
  destroyRuntime(runtimeId: string): Promise<boolean>;

  executeCommand(
    runtimeId: string,
    commandStr: string,
    roe: RulesOfEngagement | null
  ): Promise<TerminalOutputLine[]>;

  streamOutput(runtimeId: string, callback: (line: TerminalOutputLine) => void): void;

  writeFile(runtimeId: string, path: string, content: string): Promise<boolean>;
  readFile(runtimeId: string, path: string): Promise<string>;
  listFiles(runtimeId: string, path: string): Promise<string[]>;

  getStatus(runtimeId: string): Promise<RuntimeStatus>;
  getNetworkIdentity(runtimeId: string): Promise<NetworkIdentity>;
  getResourceUsage(runtimeId: string): Promise<ResourceUsage>;
}

export interface RuntimeInstance {
  config: RuntimeConfig;
  status: RuntimeStatus;
  provider: IAttackBoxRuntime;
}
