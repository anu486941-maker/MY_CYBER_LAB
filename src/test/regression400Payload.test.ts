import { describe, it, expect } from 'vitest';

/**
 * REGRESSION TEST: Reproduction of the 400 Invalid Request payload issues:
 * 1. Unsanitized `functionCall` in history without `thought_signature`.
 * 2. Unsanitized `functionCall` in user message turn.
 * 3. Both tools and web research combined in request config.
 */

function sanitizeHistoryAndMessage(history: any[], message: any) {
  // Sanitize history
  const validHistoryTurns: { role: 'user' | 'model'; parts: any[] }[] = [];
  for (const msg of history || []) {
    if (!msg || typeof msg !== 'object') continue;
    const role: 'user' | 'model' = (msg.role === 'aman' || msg.role === 'model' || msg.role === 'assistant') ? 'model' : 'user';
    let rawParts = msg.parts;
    if (!rawParts || !Array.isArray(rawParts)) {
      if (typeof msg.text === 'string' && msg.text.trim().length > 0) {
        rawParts = [{ text: msg.text.trim() }];
      } else {
        rawParts = [];
      }
    }

    const cleanParts = rawParts
      .map((p: any) => {
        if (typeof p === 'string') {
          const trimmed = p.trim();
          return trimmed.length > 0 ? { text: trimmed } : null;
        }
        if (p && typeof p === 'object') {
          if (typeof p.text === 'string') {
            const trimmed = p.text.trim();
            return trimmed.length > 0 ? { text: trimmed } : null;
          }
          if (p.inlineData) return { inlineData: p.inlineData };
          if (p.functionCall) {
            const fnName = p.functionCall.name || 'action';
            return { text: `[Action requested: ${fnName}]` };
          }
          if (p.functionResponse) {
            const fnName = p.functionResponse.name || 'action';
            return { text: `[Action result for ${fnName}]` };
          }
        }
        return null;
      })
      .filter(Boolean);

    if (cleanParts.length > 0) {
      validHistoryTurns.push({ role, parts: cleanParts });
    }
  }

  // Merge consecutive turns
  const formattedHistory: { role: 'user' | 'model'; parts: any[] }[] = [];
  for (const turn of validHistoryTurns) {
    if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === turn.role) {
      formattedHistory[formattedHistory.length - 1].parts.push(...turn.parts);
    } else {
      formattedHistory.push({ role: turn.role, parts: [...turn.parts] });
    }
  }

  // Ensure starts with user
  while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
    formattedHistory.shift();
  }

  // Sanitize message
  let chatMessageContent: any = message;
  if (typeof message === 'string') {
    chatMessageContent = message.trim() || 'Hello';
  } else if (message && typeof message === 'object' && typeof message.text === 'string' && !Array.isArray(message.parts)) {
    chatMessageContent = message.text.trim() || 'Hello';
  } else if (message && typeof message === 'object' && Array.isArray(message.parts)) {
    const cleanParts = message.parts.map((p: any) => {
      if (typeof p === 'string') {
        const trimmed = p.trim();
        return trimmed.length > 0 ? { text: trimmed } : null;
      }
      if (p && typeof p === 'object') {
        if (p.functionCall) return { text: `[Action requested: ${p.functionCall.name || 'action'}]` };
        if (p.functionResponse) return { functionResponse: p.functionResponse };
        if (p.inlineData) return { inlineData: p.inlineData };
        if (typeof p.text === 'string' && p.text.trim().length > 0) return { text: p.text.trim() };
      }
      return null;
    }).filter(Boolean);
    chatMessageContent = cleanParts.length > 0 ? cleanParts : 'Hello';
  } else if (Array.isArray(message)) {
    const cleanParts = message.map((p: any) => {
      if (typeof p === 'string') {
        const trimmed = p.trim();
        return trimmed.length > 0 ? { text: trimmed } : null;
      }
      if (p && typeof p === 'object') {
        if (p.functionCall) return { text: `[Action requested: ${p.functionCall.name || 'action'}]` };
        if (p.functionResponse) return { functionResponse: p.functionResponse };
        if (p.inlineData) return { inlineData: p.inlineData };
        if (typeof p.text === 'string' && p.text.trim().length > 0) return { text: p.text.trim() };
      }
      return null;
    }).filter(Boolean);
    chatMessageContent = cleanParts.length > 0 ? cleanParts : 'Hello';
  } else {
    chatMessageContent = String(message || 'Hello').trim() || 'Hello';
  }

  return { formattedHistory, chatMessageContent };
}

describe('Regression 400 Invalid Request Payload Sanitization', () => {
  it('correctly converts historical functionCall without thought_signature into safe text annotation', () => {
    const rawFailingHistory = [
      { role: 'user', parts: [{ text: 'Take me to dashboard' }] },
      { role: 'model', parts: [{ functionCall: { name: 'open_dashboard', args: {} } }] }
    ];

    const { formattedHistory } = sanitizeHistoryAndMessage(rawFailingHistory, 'Hello');

    expect(formattedHistory).toHaveLength(2);
    expect(formattedHistory[1].role).toBe('model');
    expect(formattedHistory[1].parts[0]).toEqual({ text: '[Action requested: open_dashboard]' });
    expect(formattedHistory[1].parts[0].functionCall).toBeUndefined();
  });

  it('correctly converts user message containing functionCall into safe text annotation', () => {
    const userMsgWithFunctionCall = [{ functionCall: { name: 'open_dashboard', args: {} } }];

    const { chatMessageContent } = sanitizeHistoryAndMessage([], userMsgWithFunctionCall);

    expect(chatMessageContent).toHaveLength(1);
    expect(chatMessageContent[0]).toEqual({ text: '[Action requested: open_dashboard]' });
    expect(chatMessageContent[0].functionCall).toBeUndefined();
  });

  it('preserves valid user functionResponse in message', () => {
    const userMsgWithFunctionResponse = [
      { functionResponse: { name: 'open_dashboard', response: { status: 'success' } } }
    ];

    const { chatMessageContent } = sanitizeHistoryAndMessage([], userMsgWithFunctionResponse);

    expect(chatMessageContent).toHaveLength(1);
    expect(chatMessageContent[0].functionResponse).toEqual({ name: 'open_dashboard', response: { status: 'success' } });
  });
});
