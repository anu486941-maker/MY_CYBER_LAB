export type GeminiErrorCode =
  | 'RATE_LIMITED'
  | 'DAILY_QUOTA_EXHAUSTED'
  | 'MODEL_UNAVAILABLE'
  | 'AUTHENTICATION_OR_PERMISSION_ERROR'
  | 'INVALID_REQUEST'
  | 'TIMEOUT'
  | 'TEMPORARY_PROVIDER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface ClassifiedGeminiError {
  code: GeminiErrorCode;
  httpStatus?: number;
  userFacingMessage: string;
  userFacingHinglishMessage: string;
  isRetryable: boolean;
  technicalDetails?: string;
}

export function classifyGeminiError(error: any): ClassifiedGeminiError {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      userFacingMessage: "Gemini is temporarily unavailable. Continuing in Local Guidance Mode.",
      userFacingHinglishMessage: "Gemini abhi thoda busy hai, lekin main yahan hoon! Hum Local Guidance Mode se continue karenge.",
      isRetryable: true
    };
  }

  const msg = String(error?.message || error?.error?.message || error || '');
  const status = error?.status || error?.code || error?.response?.status || error?.error?.code;

  // 1. Daily Quota Exhausted (Check before general rate limit)
  if (
    msg.includes('GenerateRequestsPerDayPerProjectPerModel') ||
    msg.includes('PerDayPerProjectPerModel') ||
    msg.includes('per-day') ||
    msg.includes('per_day') ||
    (msg.includes('RESOURCE_EXHAUSTED') && (msg.includes('Day') || msg.includes('FreeTier') || msg.includes('daily'))) ||
    msg.includes('Daily quota') ||
    msg.includes('daily quota')
  ) {
    return {
      code: 'DAILY_QUOTA_EXHAUSTED',
      httpStatus: 429,
      userFacingMessage: "Daily free-tier quota reached for primary model. Continuing on resilient fallback models.",
      userFacingHinglishMessage: "Daily free-tier limit reached ho gayi hai. AMAN automatic fallback model se continue kar raha hai.",
      isRetryable: false,
      technicalDetails: '429 Daily Free-Tier Quota Exhausted (GenerateRequestsPerDayPerProjectPerModel-FreeTier)'
    };
  }

  // 2. Rate Limited / Temporary RPM/TPM Quota (429)
  if (
    status === 429 ||
    msg.includes('429') ||
    msg.includes('Quota') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('rate-limits') ||
    msg.includes('Too Many Requests')
  ) {
    return {
      code: 'RATE_LIMITED',
      httpStatus: 429,
      userFacingMessage: "API rate limit reached. Continuing seamlessly in Local Guidance Mode.",
      userFacingHinglishMessage: "API limit hit hone ki wajah se AMAN Local Guidance Mode mein chal raha hai.",
      isRetryable: true,
      technicalDetails: '429 Rate limit / RPM/TPM burst exceeded'
    };
  }

  // 2. Timeout (408) - Checked before 400 to prevent '4000ms' matching '400'
  if (
    status === 408 ||
    msg.includes('408') ||
    msg.includes('TIMEOUT') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('ECONNRESET') ||
    msg.includes('deadline exceeded')
  ) {
    return {
      code: 'TIMEOUT',
      httpStatus: 408,
      userFacingMessage: "Connection timed out. Retrying via Local Guidance Mode.",
      userFacingHinglishMessage: "Network connection slow hone ki wajah se Local Guidance Mode active hai.",
      isRetryable: true,
      technicalDetails: '408 Timeout'
    };
  }

  // 3. Model Unavailable / High Demand (503)
  if (
    status === 503 ||
    msg.includes('503') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('high demand') ||
    msg.includes('Overloaded') ||
    msg.includes('temporarily unavailable')
  ) {
    return {
      code: 'MODEL_UNAVAILABLE',
      httpStatus: 503,
      userFacingMessage: "Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.",
      userFacingHinglishMessage: "Gemini abhi thoda busy hai, lekin main yahan hoon! Hum Local Guidance Mode se continue karenge.",
      isRetryable: true,
      technicalDetails: '503 Model Unavailable / High demand'
    };
  }

  // 4. Auth / Permission (401/403)
  if (
    status === 401 ||
    status === 403 ||
    msg.includes('401') ||
    msg.includes('403') ||
    msg.includes('API key') ||
    msg.includes('PERMISSION_DENIED') ||
    msg.includes('UNAUTHENTICATED')
  ) {
    return {
      code: 'AUTHENTICATION_OR_PERMISSION_ERROR',
      httpStatus: status || 401,
      userFacingMessage: "API key or permissions issue detected. AMAN is operating in Local Guidance Mode.",
      userFacingHinglishMessage: "API configuration verify ho rahi hai. AMAN abhi Local Guidance Mode mein active hai.",
      isRetryable: false,
      technicalDetails: '401/403 Auth/Permission error'
    };
  }

  // 5. Invalid Request (400)
  if (
    status === 400 ||
    (/\b400\b/.test(msg) && !msg.includes('4000')) ||
    msg.includes('INVALID_ARGUMENT') ||
    msg.includes('ContentUnion') ||
    msg.includes('schema')
  ) {
    return {
      code: 'INVALID_REQUEST',
      httpStatus: 400,
      userFacingMessage: "Formatting adjusted for your prompt. Continuing your active session.",
      userFacingHinglishMessage: "Formatting adjust ho gayi hai. Aapka session chal raha hai.",
      isRetryable: false,
      technicalDetails: '400 Invalid Request'
    };
  }

  // 6. Temporary Provider Error (5xx)
  if (typeof status === 'number' && status >= 500 && status < 600) {
    return {
      code: 'TEMPORARY_PROVIDER_ERROR',
      httpStatus: status,
      userFacingMessage: "AI provider experienced a temporary disruption. Continuing via Local Guidance Mode.",
      userFacingHinglishMessage: "AI provider temporary delay de raha hai. AMAN Local Guidance Mode se continue karega.",
      isRetryable: true,
      technicalDetails: `${status} Provider Error`
    };
  }

  // 7. Network Error
  if (
    msg.includes('fetch failed') ||
    msg.includes('NetworkError') ||
    msg.includes('ENOTFOUND') ||
    msg.includes('Failed to fetch')
  ) {
    return {
      code: 'NETWORK_ERROR',
      userFacingMessage: "Network connectivity issue detected. Local Guidance Mode is keeping your session active.",
      userFacingHinglishMessage: "Network issue ke bawajood aapka local learning session active hai.",
      isRetryable: true,
      technicalDetails: 'Network Error'
    };
  }

  // 8. Unknown Error
  return {
    code: 'UNKNOWN_ERROR',
    userFacingMessage: "Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.",
    userFacingHinglishMessage: "Gemini abhi thoda busy hai, lekin main yahan hoon! Hum Local Guidance Mode se continue karenge.",
    isRetryable: true,
    technicalDetails: msg || 'Unknown Error'
  };
}
