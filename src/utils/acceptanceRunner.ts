import { analyzeCommandSyntax } from './commandCoachEngine';
import { detectVoiceIntent } from './amanActionDispatcher';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import { ALL_30_REAL_CASES } from '../data/realCasesData';

export interface AcceptanceTestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export function runAcceptanceSuite(): AcceptanceTestResult[] {
  const results: AcceptanceTestResult[] = [];

  const assert = (name: string, condition: boolean, failMessage?: string) => {
    results.push({
      name,
      passed: condition,
      message: condition ? 'PASSED' : failMessage || 'FAILED'
    });
  };

  // 1. Command Coach & Syntax Validation
  const cmd1 = analyzeCommandSyntax('10.50.0.15 nmap');
  assert(
    'Command Coach: detect COMMAND_FIRST_ERROR',
    !cmd1.isValid && cmd1.errorType === 'COMMAND_FIRST_ERROR',
    `Expected COMMAND_FIRST_ERROR, got ${cmd1.errorType}`
  );

  const cmd2 = analyzeCommandSyntax('nmap');
  assert(
    'Command Coach: detect MISSING_REQUIRED_ARGUMENT',
    !cmd2.isValid && cmd2.errorType === 'MISSING_REQUIRED_ARGUMENT',
    `Expected MISSING_REQUIRED_ARGUMENT, got ${cmd2.errorType}`
  );

  const cmd3 = analyzeCommandSyntax('nmap -sV 10.50.0.15');
  assert(
    'Command Coach: validate correct nmap syntax',
    cmd3.isValid && cmd3.parsedCommand === 'nmap' && cmd3.target === '10.50.0.15',
    'Failed to validate correct nmap syntax'
  );

  // 2. Career Roles & Universal Beginner Foundation
  assert(
    'Career Roles: 12 specialized roles available',
    CAREER_ROLES_DATA.length === 12,
    `Expected 12 roles, got ${CAREER_ROLES_DATA.length}`
  );

  const allStartAtZero = CAREER_ROLES_DATA.every(role => {
    const firstStep = role.curriculumSequence[0];
    return firstStep && (firstStep.milestoneType === 'FOUNDATION' || firstStep.levelRef === 0);
  });
  assert(
    'Universal Beginner Foundation: All 12 roles start at foundation level 0',
    allStartAtZero,
    'Not all career roles start with a foundation milestone at level 0'
  );

  // 3. Real Cases
  assert(
    'Real Cases: 30 structured educational cases available',
    ALL_30_REAL_CASES.length === 30,
    `Expected 30 cases, got ${ALL_30_REAL_CASES.length}`
  );

  // 4. AMAN Voice & Intent Dispatcher
  const intent1 = detectVoiceIntent('Show my role path');
  assert(
    'AMAN Dispatcher: "Show my role path" -> OPEN_LEARNING_PATH',
    intent1?.intent === 'OPEN_LEARNING_PATH',
    `Expected OPEN_LEARNING_PATH, got ${intent1?.intent}`
  );

  const intent2 = detectVoiceIntent('Show my beginner foundation');
  assert(
    'AMAN Dispatcher: "Show my beginner foundation" -> OPEN_ROADMAP',
    intent2?.intent === 'OPEN_ROADMAP',
    `Expected OPEN_ROADMAP, got ${intent2?.intent}`
  );

  const intent3 = detectVoiceIntent('How ready am I for this career?');
  assert(
    'AMAN Dispatcher: "How ready am I for this career?" -> SHOW_READINESS',
    intent3?.intent === 'SHOW_READINESS',
    `Expected SHOW_READINESS, got ${intent3?.intent}`
  );

  return results;
}
