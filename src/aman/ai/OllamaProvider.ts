/**
 * AMAN 3.0 - Local AI Provider (Ollama Runtime Integration)
 * Communicates with local open-source models (Llama 3.2, Qwen 2.5 Coder, Mistral, DeepSeek)
 * via the local Ollama daemon without external internet or cloud dependencies.
 */

import {
  AIProvider,
  AIProviderCapabilities,
  AIProviderHealthInfo,
  AIChatTurn,
  AIGenerateOptions,
  AIGenerateResult,
  AIStreamChunk
} from './AIProvider';
import { AIHealthTracker } from './AIHealthTracker';
import { AIRequestPolicy } from './AIRequestPolicy';

export class OllamaProvider implements AIProvider {
  public readonly providerName = 'LOCAL_OLLAMA';
  public readonly modelName: string;
  private readonly baseUrl: string;
  private readonly healthTracker: AIHealthTracker;
  private isConnected: boolean | null = null;
  private lastHealthCheckTime: number = 0;

  constructor(
    modelName: string = 'llama3.2',
    baseUrl: string = 'http://127.0.0.1:11434'
  ) {
    this.modelName = modelName;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.healthTracker = AIHealthTracker.getInstance();
  }

  public getCapabilities(): AIProviderCapabilities {
    return {
      supportsStreaming: true,
      supportsTools: true,
      supportsSystemInstructions: true,
      isLocal: true,
      isCloud: false,
      isDeterministic: false
    };
  }

  public isAvailable(): boolean {
    if (!AIRequestPolicy.isOllamaConfigured()) {
      return false;
    }
    // If not yet verified or previously failed, check connectivity status
    if (this.isConnected === false) {
      // If we know it's disconnected and health check failed recently, skip immediately
      if (Date.now() - this.lastHealthCheckTime < 60000) {
        return false;
      }
    }
    return this.healthTracker.isAvailable(this.getProviderKey());
  }

  private getProviderKey(): string {
    return `${this.providerName}:${this.modelName}`;
  }

  public async healthCheck(): Promise<AIProviderHealthInfo> {
    if (!AIRequestPolicy.isOllamaConfigured()) {
      return {
        status: 'DISABLED',
        providerName: this.providerName,
        modelName: this.modelName,
        failureCount: 0,
        reason: 'Ollama is disabled in production / cloud runtime environment'
      };
    }

    const now = Date.now();
    // Cache health check for 10 seconds
    if (this.isConnected !== null && now - this.lastHealthCheckTime < 10000) {
      return this.healthTracker.getHealth(
        this.getProviderKey(),
        this.providerName,
        this.modelName
      );
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600);

      const resp = await fetch(`${this.baseUrl}/api/version`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        this.isConnected = true;
        this.lastHealthCheckTime = now;
        this.healthTracker.recordSuccess(this.getProviderKey());
        return {
          status: 'AVAILABLE',
          providerName: this.providerName,
          modelName: this.modelName,
          failureCount: 0
        };
      } else {
        this.isConnected = false;
        this.lastHealthCheckTime = now;
        this.healthTracker.recordFailure(this.getProviderKey(), `HTTP ${resp.status}`);
        return {
          status: 'DEGRADED',
          providerName: this.providerName,
          modelName: this.modelName,
          failureCount: 1,
          reason: `Ollama returned HTTP ${resp.status}`
        };
      }
    } catch (err: any) {
      this.isConnected = false;
      this.lastHealthCheckTime = now;
      this.healthTracker.recordFailure(this.getProviderKey(), err?.message || 'Connection refused', 60000);
      return {
        status: 'TEMPORARILY_UNAVAILABLE',
        providerName: this.providerName,
        modelName: this.modelName,
        failureCount: 1,
        reason: 'Ollama daemon not running or unreachable on configured port'
      };
    }
  }

  public async listInstalledModels(): Promise<string[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const resp = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!resp.ok) return [];
      const data = await resp.json();
      if (Array.isArray(data?.models)) {
        return data.models.map((m: any) => m.name || m.model).filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  }

  private formatMessages(prompt: string | AIChatTurn[], options?: AIGenerateOptions): any[] {
    const messages: any[] = [];

    // System instruction
    if (options?.systemInstruction) {
      messages.push({
        role: 'system',
        content: options.systemInstruction
      });
    }

    if (typeof prompt === 'string') {
      messages.push({
        role: 'user',
        content: prompt
      });
      return messages;
    }

    if (Array.isArray(prompt)) {
      for (const turn of prompt) {
        let content = turn.text || '';
        if (turn.parts) {
          content = turn.parts.map(p => p.text || '').filter(Boolean).join(' ');
        }
        if (content.trim().length > 0) {
          messages.push({
            role: turn.role === 'model' ? 'assistant' : turn.role,
            content
          });
        }
      }
    }

    return messages.length > 0 ? messages : [{ role: 'user', content: 'Hello' }];
  }

  public async generate(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const messages = this.formatMessages(prompt, options);
    const controller = new AbortController();
    const timeoutMs = options?.timeoutMs || 4000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const resp = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          messages,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            num_predict: options?.maxTokens ?? 1024
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!resp.ok) {
        throw new Error(`Ollama request failed with HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const outputText = data?.message?.content || '';
      this.healthTracker.recordSuccess(this.getProviderKey());

      return {
        text: outputText,
        modelUsed: this.modelName,
        providerName: this.providerName,
        isLocal: true,
        amanStatus: 'LOCAL_AI',
        rawResponse: data
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      this.healthTracker.recordFailure(this.getProviderKey(), err.message);
      throw err;
    }
  }

  public async *generateStream(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): AsyncIterable<AIStreamChunk> {
    const messages = this.formatMessages(prompt, options);
    const controller = new AbortController();
    const timeoutMs = options?.timeoutMs || 4000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const resp = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          messages,
          stream: true,
          options: {
            temperature: options?.temperature ?? 0.7
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!resp.ok || !resp.body) {
        throw new Error(`Ollama stream failed with HTTP ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            const chunkContent = parsed?.message?.content;
            if (chunkContent) {
              yield {
                text: chunkContent,
                modelUsed: this.modelName,
                providerName: this.providerName,
                isLocal: true,
                amanStatus: 'LOCAL_AI'
              };
            }
            if (parsed?.done) {
              yield {
                done: true,
                modelUsed: this.modelName,
                providerName: this.providerName,
                isLocal: true,
                amanStatus: 'LOCAL_AI'
              };
            }
          } catch {
            // ignore partial JSON parse errors
          }
        }
      }

      this.healthTracker.recordSuccess(this.getProviderKey());
    } catch (err: any) {
      clearTimeout(timeoutId);
      this.healthTracker.recordFailure(this.getProviderKey(), err.message);
      throw err;
    }
  }
}
