/**
 * AMAN 3.0 - Provider-Agnostic AI Architecture
 * Universal interface and data structures for interchangeable AI reasoning providers.
 */

export type AIProviderHealthStatus =
  | 'AVAILABLE'
  | 'DEGRADED'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'QUARANTINED'
  | 'DISABLED';

export interface AIProviderCapabilities {
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsSystemInstructions: boolean;
  isLocal: boolean;
  isCloud: boolean;
  isDeterministic: boolean;
}

export interface AIProviderHealthInfo {
  status: AIProviderHealthStatus;
  providerName: string;
  modelName: string;
  failureCount: number;
  lastFailureTime?: number;
  quarantineUntil?: number;
  reason?: string;
}

export interface AIChatTurn {
  role: 'user' | 'model' | 'system' | 'tool';
  text?: string;
  parts?: Array<{
    text?: string;
    inlineData?: { mimeType: string; data: string };
    functionCall?: { name: string; args: any };
    functionResponse?: { name: string; response: any };
  }>;
  functionCalls?: Array<{ name: string; args: any }>;
  functionResponse?: { name: string; response: any };
}

export interface AIToolDeclaration {
  name: string;
  description: string;
  parameters?: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}

export interface AIGenerateOptions {
  systemInstruction?: string;
  tools?: AIToolDeclaration[];
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  contextData?: any;
  language?: string;
  executionMode?: 'FAST' | 'DEEP';
  activeMode?: string;
  isOfflineOnly?: boolean;
}

export interface AIGenerateResult {
  text: string;
  functionCalls?: Array<{ name: string; args: any }>;
  modelUsed: string;
  providerName: string;
  isLocal: boolean;
  isFallback?: boolean;
  amanStatus?: 'CONNECTED' | 'LOCAL_AI' | 'LOCAL_GUIDANCE' | 'OFFLINE';
  rawResponse?: any;
}

export interface AIStreamChunk {
  text?: string;
  functionCalls?: Array<{ name: string; args: any }>;
  done?: boolean;
  modelUsed: string;
  providerName: string;
  isLocal: boolean;
  isFallback?: boolean;
  isLocalGuidance?: boolean;
  amanStatus?: 'CONNECTED' | 'LOCAL_AI' | 'LOCAL_GUIDANCE' | 'OFFLINE';
}

export interface AIProvider {
  readonly providerName: string;
  readonly modelName: string;

  getCapabilities(): AIProviderCapabilities;
  isAvailable(): boolean;
  healthCheck(): Promise<AIProviderHealthInfo>;
  generate(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult>;
  generateStream(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): AsyncIterable<AIStreamChunk>;
}
