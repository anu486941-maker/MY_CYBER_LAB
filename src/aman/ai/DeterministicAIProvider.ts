/**
 * AMAN 3.0 - Deterministic Local Intelligence Provider
 * 100% offline, zero-dependency, instantaneous Socratic & cybersecurity reasoning engine.
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
import { generateLocalGuidanceResponse } from '../../utils/amanLocalGuidance';
import { AmanPlatformIndex } from '../amanPlatformIndex';

export class DeterministicAIProvider implements AIProvider {
  public readonly providerName = 'AMAN_DETERMINISTIC_ENGINE';
  public readonly modelName = 'aman-local-socratic-v3';

  public getCapabilities(): AIProviderCapabilities {
    return {
      supportsStreaming: true,
      supportsTools: true,
      supportsSystemInstructions: true,
      isLocal: true,
      isCloud: false,
      isDeterministic: true
    };
  }

  public isAvailable(): boolean {
    return true; // Always operational
  }

  public async healthCheck(): Promise<AIProviderHealthInfo> {
    return {
      status: 'AVAILABLE',
      providerName: this.providerName,
      modelName: this.modelName,
      failureCount: 0
    };
  }

  private extractUserQuery(prompt: string | AIChatTurn[]): string {
    if (typeof prompt === 'string') return prompt;
    if (Array.isArray(prompt) && prompt.length > 0) {
      for (let i = prompt.length - 1; i >= 0; i--) {
        if (prompt[i].role === 'user') {
          if (prompt[i].text) return prompt[i].text!;
          if (prompt[i].parts) {
            const textPart = prompt[i].parts?.find(p => p.text);
            if (textPart?.text) return textPart.text;
          }
        }
      }
      return prompt[prompt.length - 1].text || 'Hello';
    }
    return 'Hello';
  }

  public async generate(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const userQuery = this.extractUserQuery(prompt);
    const lang = options?.language || options?.contextData?.language || 'Auto';
    const guidance = generateLocalGuidanceResponse(
      userQuery,
      options?.contextData,
      lang,
      'OFFLINE_DETERMINISTIC'
    );

    // Check for platform index keyword matching
    const searchMatches = AmanPlatformIndex.search(userQuery);
    let enhancedText = guidance.fullText;
    if (searchMatches.length > 0 && !guidance.fullText.includes(searchMatches[0].title)) {
      const top = searchMatches[0];
      enhancedText += `\n\n📌 **Recommended Practice Lab**: [${top.title}](${top.route}) — ${top.description}`;
    }

    return {
      text: enhancedText,
      modelUsed: this.modelName,
      providerName: this.providerName,
      isLocal: true,
      isFallback: true,
      amanStatus: 'LOCAL_GUIDANCE'
    };
  }

  public async *generateStream(
    prompt: string | AIChatTurn[],
    options?: AIGenerateOptions
  ): AsyncIterable<AIStreamChunk> {
    const result = await this.generate(prompt, options);
    
    // Simulate natural fast streaming chunks for consistent UI feel
    const words = result.text.split(/(\s+)/);
    const chunkSize = 4;
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const piece = words.slice(i, i + chunkSize).join('');
      yield {
        text: piece,
        modelUsed: this.modelName,
        providerName: this.providerName,
        isLocal: true,
        isFallback: true,
        isLocalGuidance: true,
        amanStatus: 'LOCAL_GUIDANCE'
      };
      // Brief tick for smooth UX flow
      await new Promise(r => setTimeout(r, 15));
    }

    yield {
      done: true,
      modelUsed: this.modelName,
      providerName: this.providerName,
      isLocal: true,
      isFallback: true,
      isLocalGuidance: true,
      amanStatus: 'LOCAL_GUIDANCE'
    };
  }
}
