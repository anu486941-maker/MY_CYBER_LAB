/**
 * AMAN Agent 2.0 - Tool Permission System
 * Defines safety categories, permission levels, rate limits, and hard security boundaries.
 */

export type AmanPermissionLevel = 
  | 'READ_ONLY'              // Safe telemetry, progress, curriculum, inspection (auto-run)
  | 'LOW_RISK'               // Navigation, study plan generation, note creation (auto-run)
  | 'LOW_RISK_ACTION'        // Alias for LOW_RISK
  | 'LAB_ACTION'             // Simulated sandbox terminal commands, virtual state inspection
  | 'CONFIRMATION_REQUIRED'  // Irreversible actions: evidence deletion, progress reset
  | 'REQUIRE_CONFIRMATION'   // Alias for CONFIRMATION_REQUIRED
  | 'BLOCKED';               // Strictly forbidden operations (host escape, env secrets, etc.)

export interface ToolSecurityPolicy {
  permission: AmanPermissionLevel;
  requiresConfirmation: boolean;
  rateLimitPerMinute: number;
  allowedInDemo: boolean;
}

export const PERMISSION_POLICIES: Record<string, ToolSecurityPolicy> = {
  READ_ONLY: {
    permission: 'READ_ONLY',
    requiresConfirmation: false,
    rateLimitPerMinute: 60,
    allowedInDemo: true,
  },
  LOW_RISK: {
    permission: 'LOW_RISK',
    requiresConfirmation: false,
    rateLimitPerMinute: 30,
    allowedInDemo: true,
  },
  LOW_RISK_ACTION: {
    permission: 'LOW_RISK',
    requiresConfirmation: false,
    rateLimitPerMinute: 30,
    allowedInDemo: true,
  },
  LAB_ACTION: {
    permission: 'LAB_ACTION',
    requiresConfirmation: false,
    rateLimitPerMinute: 20,
    allowedInDemo: true,
  },
  CONFIRMATION_REQUIRED: {
    permission: 'CONFIRMATION_REQUIRED',
    requiresConfirmation: true,
    rateLimitPerMinute: 10,
    allowedInDemo: false,
  },
  REQUIRE_CONFIRMATION: {
    permission: 'CONFIRMATION_REQUIRED',
    requiresConfirmation: true,
    rateLimitPerMinute: 10,
    allowedInDemo: false,
  },
  BLOCKED: {
    permission: 'BLOCKED',
    requiresConfirmation: false,
    rateLimitPerMinute: 0,
    allowedInDemo: false,
  }
};

/**
 * Hardcoded Blacklist of Forbidden Operations.
 * The AI Agent is strictly forbidden from executing or producing tools for these.
 */
export const FORBIDDEN_OPERATIONS = [
  'EXECUTE_HOST_SHELL',
  'READ_ENVIRONMENT_VARIABLES',
  'ACCESS_HOST_FILES',
  'ARBITRARY_NETWORK_ATTACK',
  'EXECUTE_POWERSHELL',
  'EXECUTE_BASH_HOST',
  'READ_API_KEYS',
  'ACCESS_PROCESS_ENV',
  'EVAL_JAVASCRIPT',
  'BYPASS_ACE_SCOPE',
  'ACCESS_UNRELATED_USER_DATA',
  'MODIFY_APP_SOURCE_CODE',
  'SHOW_GEMINI_API_KEY'
] as const;

/**
 * Validates whether a command or action violates the global security policy.
 */
export function isOperationSafe(opName: string, payload?: any): { safe: boolean; reason?: string } {
  const normalized = opName.toUpperCase().replace(/\s+/g, '_');
  
  if (FORBIDDEN_OPERATIONS.some(f => normalized.includes(f))) {
    return {
      safe: false,
      reason: `Operation "${opName}" is strictly BLOCKED by AMAN Agent Security Policy. Host system execution, environment secrets, and arbitrary network attacks are forbidden.`
    };
  }

  // Check payload for shell escape or code injection attempts
  if (payload && typeof payload === 'object') {
    const payloadStr = JSON.stringify(payload).toLowerCase();
    if (
      payloadStr.includes('process.env') ||
      payloadStr.includes('eval(') ||
      payloadStr.includes('__proto__') ||
      payloadStr.includes('powershell') ||
      payloadStr.includes('cmd.exe') ||
      payloadStr.includes('/bin/sh') ||
      payloadStr.includes('/bin/bash') ||
      payloadStr.includes('gemini_api_key') ||
      payloadStr.includes('window.location') ||
      payloadStr.includes('document.cookie')
    ) {
      return {
        safe: false,
        reason: 'Security violation: Payload contains restricted runtime identifiers or host escape attempt.'
      };
    }
  }

  return { safe: true };
}
