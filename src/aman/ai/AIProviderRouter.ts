/**
 * AMAN 3.0 - Central AI Provider Router & Fallback Orchestrator
 * Seamlessly routes reasoning across Local AI, Deterministic Intelligence, and Cloud AI.
 * 
 * Execution Hierarchy (LOCAL_FIRST policy):
 * 1. Primary Local AI (Ollama - e.g., llama3.2)
 * 2. Secondary Local AI (Ollama - e.g., qwen2.5-coder / mistral)
 * 3. Deterministic Local Intelligence Engine (AMAN Socratic Core - 100% offline & instant)
 * 4. Optional Cloud AI (Gemini) - ONLY when policy allows and model is not quarantined
 */

import {
  AIProvider,
  AIProviderHealthInfo,
  AIChatTurn,
  AIGenerateOptions,
  AIGenerateResult,
  AIStreamChunk
} from './AIProvider';
import { OllamaProvider } from './OllamaProvider';
import { DeterministicAIProvider } from './DeterministicAIProvider';
import { GeminiProvider } from './GeminiProvider';
import { AIRequestPolicy, AIMode, AIConfig } from './AIRequestPolicy';

export class AIProviderRouter {
  private static instance: AIProviderRouter;
  private primaryLocalProvider: OllamaProvider;
  private fallbackLocalProvider: OllamaProvider;
  private deterministicProvider: DeterministicAIProvider;
  private cloudProvider: GeminiProvider;
  private customMode?: AIMode;

  private constructor() {
    const config = AIRequestPolicy.getConfig();
    this.primaryLocalProvider = new OllamaProvider(config.ollamaModel, config.ollamaBaseUrl);
    this.fallbackLocalProvider = new OllamaProvider(config.ollamaFallbackModel, config.ollamaBaseUrl);
    this.deterministicProvider = new DeterministicAIProvider();
    this.cloudProvider = new GeminiProvider(config.geminiModel, [
      'gemini-3.1-flash-lite',
      'gemini-3.1-flash-lite-preview'
    ]);
  }

  public static getInstance(): AIProviderRouter {
    if (!AIProviderRouter.instance) {
      AIProviderRouter.instance = new AIProviderRouter();
    }
    return AIProviderRouter.instance;
  }

  public setAIMode(mode: AIMode): void {
    this.customMode = mode;
  }

  public getAIMode(): AIMode {
    return this.customMode || AIRequestPolicy.getConfig().aiMode;
  }

  public async getOverallHealth(): Promise<{
    activeMode: AIMode;
    providers: AIProviderHealthInfo[];
  }> {
    const healths: AIProviderHealthInfo[] = await Promise.all([
      this.primaryLocalProvider.healthCheck(),
      this.fallbackLocalProvider.healthCheck(),
      this.deterministicProvider.healthCheck(),
      this.cloudProvider.healthCheck()
    ]);

    return {
      activeMode: this.getAIMode(),
      providers: healths
    };
  }

  private getExecutionPlan(): AIProvider[] {
    const mode = this.getAIMode();
    const isProd = AIRequestPolicy.isProduction();
    const isOllamaEnabled = AIRequestPolicy.isOllamaConfigured();
    const plan: AIProvider[] = [];

    switch (mode) {
      case 'LOCAL_ONLY':
        if (isOllamaEnabled && this.primaryLocalProvider.isAvailable()) {
          plan.push(this.primaryLocalProvider);
        }
        if (isOllamaEnabled && this.fallbackLocalProvider.isAvailable()) {
          plan.push(this.fallbackLocalProvider);
        }
        plan.push(this.deterministicProvider);
        break;

      case 'CLOUD_DISABLED':
        if (isOllamaEnabled && this.primaryLocalProvider.isAvailable()) {
          plan.push(this.primaryLocalProvider);
        }
        if (isOllamaEnabled && this.fallbackLocalProvider.isAvailable()) {
          plan.push(this.fallbackLocalProvider);
        }
        plan.push(this.deterministicProvider);
        break;

      case 'CLOUD_OPTIONAL':
        // Production standard: Cloud Gemini first -> Local Ollama (if configured) -> Deterministic
        if (this.cloudProvider.isAvailable()) {
          plan.push(this.cloudProvider);
        }
        if (isOllamaEnabled && this.primaryLocalProvider.isAvailable()) {
          plan.push(this.primaryLocalProvider);
        }
        if (isOllamaEnabled && this.fallbackLocalProvider.isAvailable()) {
          plan.push(this.fallbackLocalProvider);
        }
        plan.push(this.deterministicProvider);
        break;

      case 'LOCAL_FIRST':
      default:
        // In production: if Ollama is not configured/available, directly use Cloud Gemini -> Deterministic
        if (!isProd && isOllamaEnabled) {
          if (this.primaryLocalProvider.isAvailable()) {
            plan.push(this.primaryLocalProvider);
          }
          if (this.fallbackLocalProvider.isAvailable()) {
            plan.push(this.fallbackLocalProvider);
          }
        }
        if (this.cloudProvider.isAvailable()) {
          plan.push(this.cloudProvider);
        }
        // In local development, if cloud is also attempted after local
        if (isProd && isOllamaEnabled) {
          if (this.primaryLocalProvider.isAvailable()) {
            plan.push(this.primaryLocalProvider);
          }
          if (this.fallbackLocalProvider.isAvailable()) {
            plan.push(this.fallbackLocalProvider);
          }
        }
        // Deterministic engine is always available as the ultimate resilient fallback
        plan.push(this.deterministicProvider);
        break;
    }

    return plan;
  }

  public async generate(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const providers = this.getExecutionPlan();
    let lastError: any = null;

    for (const provider of providers) {
      if (!provider.isAvailable()) {
        continue;
      }

      try {
        const result = await provider.generate(prompt, options);
        return result;
      } catch (err: any) {
        lastError = err;
        console.warn(`[AIProviderRouter] Provider ${provider.providerName} (${provider.modelName}) failed:`, err?.message);
        // Continue to next provider in fallback ladder
      }
    }

    // If all fail, deterministic provider is guaranteed to succeed
    console.warn('[AIProviderRouter] All candidates failed. Invoking Deterministic Socratic Core.');
    return this.deterministicProvider.generate(prompt, options);
  }

  public async *generateStream(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): AsyncIterable<AIStreamChunk> {
    const providers = this.getExecutionPlan();
    let streamWorked = false;
    let chunksCount = 0;

    for (const provider of providers) {
      if (!provider.isAvailable()) {
        continue;
      }

      try {
        for await (const chunk of provider.generateStream(prompt, options)) {
          chunksCount++;
          streamWorked = true;
          yield chunk;
        }
        if (streamWorked) {
          return;
        }
      } catch (err: any) {
        console.warn(`[AIProviderRouter] Provider stream ${provider.providerName} (${provider.modelName}) failed:`, err?.message);
        if (chunksCount > 0) {
          // If already streamed partial chunks, notify transition to deterministic mode
          yield {
            text: '\n\n*(Continuing via AMAN Local Guidance)*\n\n',
            modelUsed: this.deterministicProvider.modelName,
            providerName: this.deterministicProvider.providerName,
            isLocal: true,
            isFallback: true,
            amanStatus: 'LOCAL_GUIDANCE'
          };
          break;
        }
      }
    }

    // Always fallback to deterministic stream if no provider completed
    for await (const chunk of this.deterministicProvider.generateStream(prompt, options)) {
      yield chunk;
    }
  }
}
