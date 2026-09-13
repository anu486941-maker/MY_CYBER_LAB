/**
 * AMAN 3.0 - AI Request Policy & Environment Configuration
 * Handles policy routing modes and environment variables for local/cloud AI providers.
 */

export type AIMode = 'LOCAL_FIRST' | 'LOCAL_ONLY' | 'CLOUD_OPTIONAL' | 'CLOUD_DISABLED';

export interface AIConfig {
  aiMode: AIMode;
  ollamaBaseUrl: string;
  ollamaModel: string;
  ollamaFallbackModel: string;
  isCloudAiEnabled: boolean;
  geminiModel: string;
  geminiFastModel: string;
  geminiDeepModel: string;
  defaultTimeoutMs: number;
}

export class AIRequestPolicy {
  public static isProduction(): boolean {
    // Cloud Run, Vercel, or NODE_ENV=production
    return (
      process.env.NODE_ENV === 'production' ||
      Boolean(process.env.K_SERVICE) ||
      Boolean(process.env.K_REVISION) ||
      Boolean(process.env.VERCEL)
    );
  }

  public static isOllamaConfigured(): boolean {
    const explicitlyEnabled = process.env.AMAN_ENABLE_OLLAMA === 'true' || process.env.ENABLE_OLLAMA === 'true';
    const explicitlyDisabled = process.env.AMAN_ENABLE_OLLAMA === 'false' || process.env.ENABLE_OLLAMA === 'false';
    if (explicitlyDisabled) return false;
    if (explicitlyEnabled) return true;

    // In Cloud Run / Vercel / Production: localhost Ollama is not accessible unless a custom external OLLAMA_BASE_URL is explicitly set
    if (this.isProduction()) {
      const customUrl = process.env.OLLAMA_BASE_URL;
      if (customUrl && !customUrl.includes('localhost') && !customUrl.includes('127.0.0.1')) {
        return true;
      }
      return false;
    }

    return true;
  }

  public static getConfig(): AIConfig {
    const rawMode = (process.env.AMAN_AI_MODE || (this.isProduction() ? 'CLOUD_OPTIONAL' : 'LOCAL_FIRST')).toUpperCase();
    let aiMode: AIMode = 'LOCAL_FIRST';
    if (rawMode === 'LOCAL_ONLY') aiMode = 'LOCAL_ONLY';
    else if (rawMode === 'CLOUD_OPTIONAL') aiMode = 'CLOUD_OPTIONAL';
    else if (rawMode === 'CLOUD_DISABLED') aiMode = 'CLOUD_DISABLED';
    else if (this.isProduction()) aiMode = 'CLOUD_OPTIONAL';
    else aiMode = 'LOCAL_FIRST';

    const isCloudAiExplicit = process.env.AMAN_CLOUD_AI_ENABLED !== undefined
      ? process.env.AMAN_CLOUD_AI_ENABLED === 'true'
      : true;

    const isCloudAiEnabled = (aiMode !== 'LOCAL_ONLY' && aiMode !== 'CLOUD_DISABLED') && isCloudAiExplicit;

    return {
      aiMode,
      ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
      ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2',
      ollamaFallbackModel: process.env.OLLAMA_FALLBACK_MODEL || 'qwen2.5-coder',
      isCloudAiEnabled,
      geminiModel: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      geminiFastModel: process.env.GEMINI_FAST_MODEL || 'gemini-3.6-flash',
      geminiDeepModel: process.env.GEMINI_DEEP_MODEL || 'gemini-3.6-flash',
      defaultTimeoutMs: parseInt(process.env.AMAN_AI_TIMEOUT_MS || '4000', 10)
    };
  }

  public static isCloudAllowed(): boolean {
    const config = this.getConfig();
    return config.isCloudAiEnabled && config.aiMode !== 'LOCAL_ONLY' && config.aiMode !== 'CLOUD_DISABLED';
  }
}
