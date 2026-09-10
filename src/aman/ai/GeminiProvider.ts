/**
 * AMAN 3.0 - Gemini Cloud AI Provider (Optional Cloud Provider)
 * Encapsulates GoogleGenAI client with model fallback, timeout guards,
 * and 24-hour quarantine on DAILY_QUOTA_EXHAUSTED.
 */

import { GoogleGenAI, Type } from '@google/genai';
import {
  AIProvider,
  AIProviderCapabilities,
  AIProviderHealthInfo,
  AIChatTurn,
  AIGenerateOptions,
  AIGenerateResult,
  AIStreamChunk,
  AIToolDeclaration
} from './AIProvider';
import { AIHealthTracker } from './AIHealthTracker';
import { AIRequestPolicy } from './AIRequestPolicy';
import { classifyGeminiError } from '../../utils/geminiErrorClassifier';

export class GeminiProvider implements AIProvider {
  public readonly providerName = 'CLOUD_GEMINI';
  public readonly modelName: string;
  private readonly fallbackModels: string[];
  private aiClient: GoogleGenAI | null = null;
  private readonly healthTracker: AIHealthTracker;

  constructor(
    primaryModel: string = 'gemini-3.6-flash',
    fallbackModels: string[] = ['gemini-3.1-flash-lite', 'gemini-3.1-flash-lite-preview']
  ) {
    this.modelName = primaryModel;
    this.fallbackModels = fallbackModels;
    this.healthTracker = AIHealthTracker.getInstance();
  }

  private getClient(): GoogleGenAI | null {
    if (!AIRequestPolicy.isCloudAllowed()) {
      return null;
    }
    if (!this.aiClient && process.env.GEMINI_API_KEY) {
      this.aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-aman-v3'
          }
        }
      });
    }
    return this.aiClient;
  }

  public getCapabilities(): AIProviderCapabilities {
    return {
      supportsStreaming: true,
      supportsTools: true,
      supportsSystemInstructions: true,
      isLocal: false,
      isCloud: true,
      isDeterministic: false
    };
  }

  public isAvailable(): boolean {
    if (!AIRequestPolicy.isCloudAllowed()) return false;
    if (!process.env.GEMINI_API_KEY) return false;
    return this.healthTracker.isAvailable(this.getProviderKey());
  }

  private getProviderKey(model: string = this.modelName): string {
    return `${this.providerName}:${model}`;
  }

  public async healthCheck(): Promise<AIProviderHealthInfo> {
    if (!AIRequestPolicy.isCloudAllowed()) {
      return {
        status: 'DISABLED',
        providerName: this.providerName,
        modelName: this.modelName,
        failureCount: 0,
        reason: 'Cloud AI is disabled by policy'
      };
    }
    if (!process.env.GEMINI_API_KEY) {
      return {
        status: 'DISABLED',
        providerName: this.providerName,
        modelName: this.modelName,
        failureCount: 0,
        reason: 'GEMINI_API_KEY is not configured in server environment'
      };
    }

    return this.healthTracker.getHealth(
      this.getProviderKey(),
      this.providerName,
      this.modelName
    );
  }

  private formatTools(tools?: AIToolDeclaration[]): any[] | undefined {
    if (!tools || tools.length === 0) return undefined;
    return [{
      functionDeclarations: tools.map(t => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters ? {
          type: Type.OBJECT,
          properties: t.parameters.properties || {},
          required: t.parameters.required || []
        } : undefined
      }))
    }];
  }

  private formatHistory(prompt: string | AIChatTurn[]): { history: any[]; message: any } {
    if (typeof prompt === 'string') {
      return { history: [], message: prompt };
    }

    const turns = Array.isArray(prompt) ? prompt : [];
    if (turns.length === 0) {
      return { history: [], message: 'Hello' };
    }

    const historyTurns: any[] = [];
    const lastTurn = turns[turns.length - 1];
    const previousTurns = turns.slice(0, turns.length - 1);

    for (const t of previousTurns) {
      const role = t.role === 'model' ? 'model' : 'user';
      let parts: any[] = [];
      if (t.parts && Array.isArray(t.parts)) {
        parts = t.parts.map(p => {
          if (p.text) return { text: p.text };
          if (p.inlineData) return { inlineData: p.inlineData };
          if (p.functionCall) return { functionCall: p.functionCall };
          if (p.functionResponse) return { functionResponse: p.functionResponse };
          return null;
        }).filter(Boolean);
      } else if (t.text) {
        parts = [{ text: t.text }];
      }

      if (parts.length > 0) {
        historyTurns.push({ role, parts });
      }
    }

    // Merge adjacent turns with same role
    const formattedHistory: any[] = [];
    for (const h of historyTurns) {
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === h.role) {
        formattedHistory[formattedHistory.length - 1].parts.push(...h.parts);
      } else {
        formattedHistory.push(h);
      }
    }

    // Ensure history starts with user
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    let messageContent: any = lastTurn.text || 'Hello';
    if (lastTurn.parts && lastTurn.parts.length > 0) {
      messageContent = lastTurn.parts.map(p => {
        if (p.text) return { text: p.text };
        if (p.inlineData) return { inlineData: p.inlineData };
        if (p.functionCall) return { functionCall: p.functionCall };
        if (p.functionResponse) return { functionResponse: p.functionResponse };
        return null;
      }).filter(Boolean);
      if (messageContent.length === 0) messageContent = 'Hello';
    }

    return { history: formattedHistory, message: messageContent };
  }

  public async generate(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const client = this.getClient();
    if (!client) {
      throw new Error('Gemini client unavailable or disabled by policy');
    }

    const candidateModels = [this.modelName, ...this.fallbackModels];
    let lastErr: any = null;

    for (const model of candidateModels) {
      if (!this.healthTracker.isAvailable(this.getProviderKey(model))) {
        continue;
      }

      try {
        const { history, message } = this.formatHistory(prompt);
        const toolsConfig = this.formatTools(options?.tools);

        const chat = client.chats.create({
          model,
          config: {
            systemInstruction: options?.systemInstruction,
            tools: toolsConfig
          },
          history
        });

        const timeoutMs = options?.timeoutMs || 4000;
        const response: any = await Promise.race([
          chat.sendMessage({ message }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`TIMEOUT: Gemini generate exceeded ${timeoutMs}ms`)), timeoutMs)
          )
        ]);

        this.healthTracker.recordSuccess(this.getProviderKey(model));
        const outputText = response.text || '';
        const functionCalls = response.functionCalls || [];

        return {
          text: outputText,
          functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
          modelUsed: model,
          providerName: this.providerName,
          isLocal: false,
          amanStatus: 'CONNECTED',
          rawResponse: response
        };
      } catch (err: any) {
        lastErr = err;
        const classified = classifyGeminiError(err);

        if (classified.code === 'DAILY_QUOTA_EXHAUSTED') {
          this.healthTracker.recordFailure(this.getProviderKey(model), 'Daily quota exhausted', 24 * 3600 * 1000, true);
        } else if (classified.code === 'RATE_LIMITED') {
          this.healthTracker.recordFailure(this.getProviderKey(model), 'Rate limited', 30 * 1000);
        } else {
          this.healthTracker.recordFailure(this.getProviderKey(model), err.message, 30 * 1000);
        }
      }
    }

    throw lastErr || new Error('All Gemini model candidates exhausted or unavailable');
  }

  public async *generateStream(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): AsyncIterable<AIStreamChunk> {
    const client = this.getClient();
    if (!client) {
      throw new Error('Gemini client unavailable or disabled by policy');
    }

    const candidateModels = [this.modelName, ...this.fallbackModels];
    let lastErr: any = null;
    let stream: any = null;
    let selectedModel = '';

    for (const model of candidateModels) {
      if (!this.healthTracker.isAvailable(this.getProviderKey(model))) {
        continue;
      }

      try {
        const { history, message } = this.formatHistory(prompt);
        const toolsConfig = this.formatTools(options?.tools);

        const chat = client.chats.create({
          model,
          config: {
            systemInstruction: options?.systemInstruction,
            tools: toolsConfig
          },
          history
        });

        const timeoutMs = options?.timeoutMs || 4000;
        stream = await Promise.race([
          chat.sendMessageStream({ message }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`TIMEOUT: Gemini stream exceeded ${timeoutMs}ms`)), timeoutMs)
          )
        ]);

        selectedModel = model;
        this.healthTracker.recordSuccess(this.getProviderKey(model));
        break;
      } catch (err: any) {
        lastErr = err;
        const classified = classifyGeminiError(err);

        if (classified.code === 'DAILY_QUOTA_EXHAUSTED') {
          this.healthTracker.recordFailure(this.getProviderKey(model), 'Daily quota exhausted', 24 * 3600 * 1000, true);
        } else if (classified.code === 'RATE_LIMITED') {
          this.healthTracker.recordFailure(this.getProviderKey(model), 'Rate limited', 30 * 1000);
        } else {
          this.healthTracker.recordFailure(this.getProviderKey(model), err.message, 30 * 1000);
        }
      }
    }

    if (!stream) {
      throw lastErr || new Error('All Gemini stream candidates failed');
    }

    for await (const chunk of stream) {
      if (chunk.text) {
        yield {
          text: chunk.text,
          modelUsed: selectedModel,
          providerName: this.providerName,
          isLocal: false,
          amanStatus: 'CONNECTED'
        };
      }
      if (chunk.functionCalls && chunk.functionCalls.length > 0) {
        yield {
          functionCalls: chunk.functionCalls,
          modelUsed: selectedModel,
          providerName: this.providerName,
          isLocal: false,
          amanStatus: 'CONNECTED'
        };
      }
    }

    yield {
      done: true,
      modelUsed: selectedModel,
      providerName: this.providerName,
      isLocal: false,
      amanStatus: 'CONNECTED'
    };
  }
}
