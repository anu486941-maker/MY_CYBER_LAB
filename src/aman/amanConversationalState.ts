/**
 * AMAN Conversational State Engine
 * Manages explicit conversational states and natural intent routing.
 */

export type AmanConversationalState = 
  | 'GREETING'
  | 'CASUAL_CONVERSATION'
  | 'LEARNING'
  | 'LAB_ASSISTANCE'
  | 'MISSION_ASSISTANCE'
  | 'INVESTIGATION'
  | 'REPORT_REVIEW'
  | 'DEBRIEF'
  | 'CAREER_GUIDANCE';

export interface StateDetectionResult {
  state: AmanConversationalState;
  confidence: number;
  intentSummary: string;
  shouldTeachImmediately: boolean;
}

export function detectConversationalState(
  message: string,
  currentRoute: string = '/dashboard'
): StateDetectionResult {
  const msg = message.trim().toLowerCase();

  // 1. Simple Greetings
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|yo)(\s+aman|\s+there|\s*!|\s*\.)*$/i.test(msg)) {
    return {
      state: 'GREETING',
      confidence: 0.98,
      intentSummary: 'User initiated a greeting.',
      shouldTeachImmediately: false
    };
  }

  // 2. Report Submission / Review
  if (/review my report|submit report|evaluate findings|report feedback|grade my report/i.test(msg)) {
    return {
      state: 'REPORT_REVIEW',
      confidence: 0.95,
      intentSummary: 'User submitted or requested feedback on an incident report.',
      shouldTeachImmediately: true
    };
  }

  // 3. Debrief / Performance Analysis
  if (/how did i do|debrief|my performance|summary of session|what went well|my score/i.test(msg)) {
    return {
      state: 'DEBRIEF',
      confidence: 0.92,
      intentSummary: 'User requested a post-lab or post-mission debrief.',
      shouldTeachImmediately: true
    };
  }

  // 4. Lab / Command Stuck Assistance
  if (/stuck|help me with this lab|i don't understand this step|hint|give me a hint|how to solve/i.test(msg)) {
    return {
      state: 'LAB_ASSISTANCE',
      confidence: 0.95,
      intentSummary: 'User requested progressive assistance or hint on active lab.',
      shouldTeachImmediately: true
    };
  }

  // 5. Threat Investigation / Log Search
  if (/what should i investigate|investigate|logs|alerts|search evidence|threat hunt|mitre/i.test(msg)) {
    return {
      state: 'INVESTIGATION',
      confidence: 0.90,
      intentSummary: 'User is conducting or asking about evidence investigation.',
      shouldTeachImmediately: true
    };
  }

  // 6. Mission Assistance
  if (/mission|objective|target scope|rules of engagement|briefing/i.test(msg) || currentRoute.includes('mission')) {
    return {
      state: 'MISSION_ASSISTANCE',
      confidence: 0.88,
      intentSummary: 'User asked about mission details or objectives.',
      shouldTeachImmediately: true
    };
  }

  // 7. Career & Role Guidance
  if (/career|role|salary|path|how to become|soc analyst|ethical hacker|pentester|cert/i.test(msg)) {
    return {
      state: 'CAREER_GUIDANCE',
      confidence: 0.90,
      intentSummary: 'User requested advice regarding cybersecurity career roles.',
      shouldTeachImmediately: true
    };
  }

  // 8. Explicit Teaching / Concept Learning
  if (/teach me|explain|what is|how does|learn|concept|sql injection|xss|nmap|wireshark/i.test(msg)) {
    return {
      state: 'LEARNING',
      confidence: 0.92,
      intentSummary: 'User asked for conceptual instruction.',
      shouldTeachImmediately: true
    };
  }

  // Default to Casual or Learning depending on length
  return {
    state: msg.length < 20 ? 'CASUAL_CONVERSATION' : 'LEARNING',
    confidence: 0.70,
    intentSummary: 'General query.',
    shouldTeachImmediately: true
  };
}
