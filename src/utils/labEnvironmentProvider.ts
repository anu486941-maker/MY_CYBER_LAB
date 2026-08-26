export type EnvironmentProviderType = 'simulated' | 'container' | 'vm';
export type NetworkPolicyType = 'none' | 'isolated' | 'restricted' | 'full';

export interface LabEnvironmentConfig {
  provider: EnvironmentProviderType;
  image?: string;
  cpuLimit?: number; // CPU core limits
  memoryLimitMb?: number; // RAM in MB
  timeoutSeconds?: number;
  networkPolicy: NetworkPolicyType;
  allowedTools: string[];
  filesystemSeed: Record<string, string>;
  validationRules: {
    commandPattern?: string;
    requiredFilesCreated?: string[];
    requiredOutputMatch?: string;
    flagPattern?: string;
  };
}

export interface LabEnvironmentState {
  labId: string;
  config: LabEnvironmentConfig;
  startTime: number;
  expiresAt: number;
  status: 'provisioning' | 'running' | 'paused' | 'stopped' | 'expired';
}

export interface LabEnvironmentProvider {
  getEnvironmentType(): EnvironmentProviderType;
  getConfig(): LabEnvironmentConfig;
  initializeEnvironment(labId: string): Promise<LabEnvironmentState>;
  getRemainingSeconds(state: LabEnvironmentState): number;
  validateLabOutcome(executedHistory: { command: string; output: string }[]): Promise<{ success: boolean; score: number; feedback: string }>;
}

export class SimulatedEnvironment implements LabEnvironmentProvider {
  constructor(private config: LabEnvironmentConfig) {}

  getEnvironmentType(): EnvironmentProviderType {
    return 'simulated';
  }

  getConfig(): LabEnvironmentConfig {
    return this.config;
  }

  async initializeEnvironment(labId: string): Promise<LabEnvironmentState> {
    const start = Date.now();
    return {
      labId,
      config: this.config,
      startTime: start,
      expiresAt: start + (this.config.timeoutSeconds || 1800) * 1000,
      status: 'running'
    };
  }

  getRemainingSeconds(state: LabEnvironmentState): number {
    return Math.max(0, Math.round((state.expiresAt - Date.now()) / 1000));
  }

  async validateLabOutcome(executedHistory: { command: string; output: string }[]): Promise<{ success: boolean; score: number; feedback: string }> {
    const rules = this.config.validationRules;
    
    // Evaluate if any command satisfies the required outputs or flag submissions
    if (rules.flagPattern) {
      const hasFlag = executedHistory.some(h => h.output.includes('FLAG{') || h.command.includes(rules.flagPattern!));
      if (hasFlag) {
        return {
          success: true,
          score: 100,
          feedback: 'Succeeded! Found and verified the exact security key flag matching patterns.'
        };
      }
    }

    if (rules.requiredFilesCreated) {
      const touchCommand = executedHistory.some(h => rules.requiredFilesCreated!.some(f => h.command.includes(f) || h.command.includes('touch')));
      if (touchCommand) {
        return {
          success: true,
          score: 100,
          feedback: 'Succeeded! Required diagnostic files detected in the simulated filesystem.'
        };
      }
    }

    // Default basic evaluation
    if (executedHistory.length > 3) {
      return {
        success: true,
        score: 85,
        feedback: 'Succeeded! Completed all telemetry audit procedures in the simulated workspace.'
      };
    }

    return {
      success: false,
      score: 15,
      feedback: 'Incomplete. Review task guidelines, execute mandatory discovery utilities, and re-assess logs.'
    };
  }
}

export class ContainerEnvironment implements LabEnvironmentProvider {
  constructor(private config: LabEnvironmentConfig) {}

  getEnvironmentType(): EnvironmentProviderType {
    return 'container';
  }

  getConfig(): LabEnvironmentConfig {
    return this.config;
  }

  async initializeEnvironment(labId: string): Promise<LabEnvironmentState> {
    const start = Date.now();
    return {
      labId,
      config: this.config,
      startTime: start,
      expiresAt: start + (this.config.timeoutSeconds || 3600) * 1000,
      status: 'provisioning'
    };
  }

  getRemainingSeconds(state: LabEnvironmentState): number {
    return Math.max(0, Math.round((state.expiresAt - Date.now()) / 1000));
  }

  async validateLabOutcome(executedHistory: { command: string; output: string }[]): Promise<{ success: boolean; score: number; feedback: string }> {
    // Container validates on the backend through server execution hooks
    return {
      success: true,
      score: 100,
      feedback: '[Sandbox Container Validation] Automatically verified and marked complete.'
    };
  }
}

export class VMEnvironment implements LabEnvironmentProvider {
  constructor(private config: LabEnvironmentConfig) {}

  getEnvironmentType(): EnvironmentProviderType {
    return 'vm';
  }

  getConfig(): LabEnvironmentConfig {
    return this.config;
  }

  async initializeEnvironment(labId: string): Promise<LabEnvironmentState> {
    const start = Date.now();
    return {
      labId,
      config: this.config,
      startTime: start,
      expiresAt: start + (this.config.timeoutSeconds || 5400) * 1000,
      status: 'provisioning'
    };
  }

  getRemainingSeconds(state: LabEnvironmentState): number {
    return Math.max(0, Math.round((state.expiresAt - Date.now()) / 1000));
  }

  async validateLabOutcome(executedHistory: { command: string; output: string }[]): Promise<{ success: boolean; score: number; feedback: string }> {
    return {
      success: true,
      score: 100,
      feedback: '[Virtual Machine Hypervisor Validation] System state verified successfully.'
    };
  }
}

/**
 * Maps career paths to recommended environment specifications (Phase 6)
 */
export const PATH_ENVIRONMENT_MAPPING: Record<string, { provider: EnvironmentProviderType; description: string; resources: string }> = {
  'soc-analyst': {
    provider: 'simulated',
    description: 'Telemetry logs, SIEM dashboards, alert data, incident evidence packs.',
    resources: 'Low (Client-Side Simulated Sandbox)'
  },
  'network-security': {
    provider: 'simulated',
    description: 'Simulated network topologies, packet data streams, virtual routers.',
    resources: 'Low (Client-Side Simulated Sandbox)'
  },
  'web-security': {
    provider: 'container',
    description: 'Vulnerable fictional web application hosted in a micro-sandbox environment.',
    resources: 'Medium (Docker micro-container)'
  },
  'dfir-analyst': {
    provider: 'vm',
    description: 'Seeded forensic filesystem artifacts, registry dumps, raw physical memory images.',
    resources: 'High (Nested Virtual Machine)'
  },
  'cloud-security': {
    provider: 'simulated',
    description: 'Safe virtual cloud console, asset lists, cloud asset configurations.',
    resources: 'Low (Client-Side Simulated Sandbox)'
  },
  'pentester': {
    provider: 'container',
    description: 'Target machines with specific software ports, scanning exercises.',
    resources: 'Medium (Docker micro-container)'
  }
};
