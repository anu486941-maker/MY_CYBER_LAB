import assert from 'assert';
import { calculateLearnerPosition, calculateNextMove } from '../src/utils/learningPositionEngine';
import { calculateCoachingLevel, parseVoiceCommand } from '../src/utils/amanInstructionEngine';
import { detectAmanIntent, resolveContentDestination } from '../src/utils/amanActionDispatcher';
import { UnifiedLearningEngine } from '../src/utils/unifiedLearningEngine';
import { validateAceCommandScope } from '../src/utils/aceScopePolicy';
import { AUTHORIZED_CLIENT_ENGAGEMENTS } from '../src/data/authorizedClientEngagements';

console.log('🧪 RUNNING PRODUCTION ENGINE ACCEPTANCE TESTS (v1.0)...');

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ Passed: ${name}`);
  } catch (err: any) {
    console.error(`  ❌ Failed: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ---------------------------------------------------------
// Mock Data for Testing
// ---------------------------------------------------------
const mockProfile = {
  uid: 'test-user-123',
  displayName: 'Alex Cyber',
  email: 'alex@example.com',
  careerPath: 'soc-analyst',
  cyberLevel: 3,
  xp: 4500,
  streak: 5,
  joinedAt: '2026-08-01T00:00:00Z',
  achievements: [],
  diagnosticScore: 78
};

const mockLevels = [
  {
    id: 1,
    title: 'Security Foundations',
    lessons: [
      { id: 'les-1', title: 'Network Baseline Telemetry', completed: true, score: 90, durationMin: 15 },
      { id: 'les-2', title: 'Active Listening Sockets', completed: false, durationMin: 20 }
    ],
    completed: false
  }
];

const mockMissions = [
  {
    id: 'm-01',
    title: 'DMZ Perimeter Reconnaissance',
    category: 'Networking',
    difficulty: 'BEGINNER',
    objectives: [
      { id: 'obj-1', description: 'Audit all live listening ports', completed: true },
      { id: 'obj-2', description: 'Extract the service version metadata', completed: false }
    ],
    isCompleted: false,
    xpReward: 300
  }
];

const mockCtfs = [
  {
    id: 'ctf-01',
    title: 'Source Inspection',
    points: 100,
    difficulty: 'EASY',
    isSolved: false,
    xpReward: 150,
    expectedFlagHash: 'MCL{welcome_to_cyber_lab_1337}',
    hints: []
  }
];

const mockSkillMasteries = [
  { skillId: 'network-security', skillName: 'Network Security', masteryPercentage: 85, confidence: 'STRONG' as const },
  { skillId: 'incident-response', skillName: 'Incident Response', masteryPercentage: 45, confidence: 'BEGINNER' as const }
];

const mockMistakes = [
  {
    id: 'mistake-01',
    timestamp: Date.now(),
    labId: 'lab-soc-01',
    category: 'Log Auditing',
    mistakePattern: 'Ignoring unauthorized cron activity',
    reviewNotes: 'Cron files in /etc/cron.d should always be audited for unexpected execution parameters.',
    resolved: false
  }
];

const mockQuizScores = { 'les-1': 90 };
const mockLabScores = { 'lab-soc-01': 80 };

// ---------------------------------------------------------
// Test Cases
// ---------------------------------------------------------

runTest('Learning Position Engine - Position Calculations', () => {
  const position = calculateLearnerPosition(
    mockProfile as any,
    mockLevels as any,
    mockMissions as any,
    mockCtfs as any,
    mockSkillMasteries as any,
    mockMistakes as any,
    mockQuizScores,
    mockLabScores
  );

  assert.strictEqual(position.cyberLevel, 3);
  assert.strictEqual(mockProfile.xp, 4500);
  assert.strictEqual(position.completedLessonsCount, 1);
  assert.strictEqual(position.totalLessonsCount, 2);
  assert.strictEqual(position.completedMissionsCount, 0);
  assert.strictEqual(position.totalMissionsCount, 1);
  assert.strictEqual(position.completedCtfCount, 0);
  assert.strictEqual(position.totalCtfCount, 1);
  assert.ok(position.progressPercentage > 0);
});

runTest('Learning Position Engine - Next Move Recommendations', () => {
  const position = calculateLearnerPosition(
    mockProfile as any,
    mockLevels as any,
    mockMissions as any,
    mockCtfs as any,
    mockSkillMasteries as any,
    mockMistakes as any,
    mockQuizScores,
    mockLabScores
  );

  const recommendation = calculateNextMove(
    position,
    mockMistakes as any,
    mockSkillMasteries as any,
    mockMissions as any
  );

  assert.ok(recommendation.activityId);
  assert.ok(recommendation.title);
  assert.ok(['LESSON', 'PRACTICE', 'LAB', 'ASSESSMENT', 'REVISION', 'MISSION', 'CHALLENGE', 'BOSS', 'CAPSTONE'].includes(recommendation.actionType));
});

runTest('Adaptive Coaching Levels (AMAN Engine)', () => {
  const coachingBeginner = calculateCoachingLevel(30, 3, 3);
  assert.strictEqual(coachingBeginner.level, 1);
  assert.strictEqual(coachingBeginner.name, 'Direct Guidance');

  const coachingAdvanced = calculateCoachingLevel(85, 1, 0);
  assert.strictEqual(coachingAdvanced.level, 4);
  assert.strictEqual(coachingAdvanced.name, 'Minimal Guidance');
});

runTest('Voice Command Parsing (AMAN Speech UI)', () => {
  const cmdRoadmap = parseVoiceCommand('open my roadmap');
  assert.strictEqual(cmdRoadmap.commandType, 'roadmap');

  const cmdWhere = parseVoiceCommand('AMAN, where am I?');
  assert.strictEqual(cmdWhere.commandType, 'where_am_i');

  const cmdNext = parseVoiceCommand('start next activity');
  assert.strictEqual(cmdNext.commandType, 'start_next');

  const cmdHint = parseVoiceCommand('give me a hint');
  assert.strictEqual(cmdHint.commandType, 'hint');
});

runTest('AMAN Intent Engine & Scenario Routing Suite', () => {
  // 1. General Conversation
  const resHi = detectAmanIntent('Hi');
  assert.strictEqual(resHi.intent, 'CONVERSATION');

  const resHelloAman = detectAmanIntent('Hello AMAN');
  assert.strictEqual(resHelloAman.intent, 'CONVERSATION');

  // 2. Career Learning Intent & Hinglish
  const resEthical1 = detectAmanIntent('I want to learn ethical hacking');
  assert.strictEqual(resEthical1.intent, 'CAREER_LEARNING_INTENT');
  assert.strictEqual(resEthical1.canonicalRole, 'ETHICAL_HACKER');

  const resEthical2 = detectAmanIntent('Mujhe ethical hacking sikhni hai');
  assert.strictEqual(resEthical2.intent, 'CAREER_SWITCH');

  const resEthical3 = detectAmanIntent('Mujhe ethical hacker banna hai');
  assert.strictEqual(resEthical3.intent, 'CAREER_SWITCH');

  // 3. Pentester Canonical Role
  const resPentester = detectAmanIntent('I want to become a pentester');
  assert.strictEqual(resPentester.intent, 'CAREER_LEARNING_INTENT');
  assert.strictEqual(resPentester.canonicalRole, 'ETHICAL_HACKER');

  // 4. Module Intent
  const resModule = detectAmanIntent('Open Linux Fundamentals');
  assert.strictEqual(resModule.intent, 'MODULE_INTENT');

  // 5. Career Roadmap Intent
  const resRoadmap = detectAmanIntent('Show me the ethical hacking roadmap');
  assert.strictEqual(resRoadmap.intent, 'CAREER_ROADMAP');

  // 6. Resume Career Path
  const resResume = detectAmanIntent('Continue ethical hacking');
  assert.strictEqual(resResume.intent, 'RESUME_CAREER_PATH');

  // 7. Command Coach
  const resCommand = detectAmanIntent('Why did nmap fail?');
  assert.strictEqual(resCommand.intent, 'COMMAND_COACH');

  // 8. Missing Content / Safe Fallback Resolution
  const invalidContentRes = resolveContentDestination('invalid_nonexistent_module_999');
  assert.strictEqual(invalidContentRes.exists, false);
  assert.strictEqual(invalidContentRes.validRoute, '/modules');
  assert.ok(invalidContentRes.fallbackMessage?.includes('Linux learning path'));

  // 9. Premium Orchestrator - SOC Analyst natural queries
  const resSoc = detectAmanIntent('I want to do defensive security and become a soc analyst');
  assert.strictEqual(resSoc.intent, 'CAREER_LEARNING_INTENT');
  assert.strictEqual(resSoc.canonicalRole, 'SOC_ANALYST');
  assert.ok(resSoc.action?.label.includes('SOC Analyst'));

  // 10. Premium Orchestrator - Network Security natural queries
  const resNet = detectAmanIntent('teach me network security please');
  assert.strictEqual(resNet.intent, 'CAREER_LEARNING_INTENT');
  assert.strictEqual(resNet.canonicalRole, 'NETWORK_SECURITY');
  assert.ok(resNet.action?.label.includes('Network Security'));

  // 11. Premium Orchestrator - Blue Team natural queries
  const resBlue = detectAmanIntent('Show me blue team career roadmap');
  assert.strictEqual(resBlue.intent, 'CAREER_ROADMAP');
  assert.strictEqual(resBlue.canonicalRole, 'BLUE_TEAM');
  assert.ok(resBlue.action?.label.includes('Blue Teamer'));
});

runTest('Unified Learning Engine Integration', () => {
  const snapshot = UnifiedLearningEngine.getSnapshot(
    mockProfile as any,
    mockLevels as any,
    mockMissions as any,
    mockCtfs as any,
    mockSkillMasteries as any,
    mockMistakes as any,
    mockQuizScores,
    mockLabScores,
    'session_start'
  );

  assert.strictEqual(snapshot.cyberLevel, 3);
  assert.strictEqual(snapshot.weakSkills.length, 1);
  assert.strictEqual(snapshot.strongSkills.length, 1);
  assert.strictEqual(snapshot.pendingMistakes.length, 1);
  assert.ok(snapshot.readinessPercentage >= 0 && snapshot.readinessPercentage <= 100);
});

// P0 Security Verification Suite
runTest('P0-1 Server Scope Policy Matrix', () => {
  const northstar = AUTHORIZED_CLIENT_ENGAGEMENTS.find(e => e.id === 'ace-northstar-01')!;

  // 1. Authorized target -> ALLOW
  const res1 = validateAceCommandScope('nmap -sn 10.50.0.0/24', northstar);
  assert.strictEqual(res1.allowed, true, 'Authorized CIDR scan should be allowed');

  // 2. Unauthorized target -> DENY
  const res2 = validateAceCommandScope('nmap -sV 192.168.1.1', northstar);
  assert.strictEqual(res2.allowed, false, 'Unauthorized IP scan must be denied');

  // 3. Target outside CIDR -> DENY
  const res3 = validateAceCommandScope('curl http://8.8.8.8', northstar);
  assert.strictEqual(res3.allowed, false, 'External public IP target must be denied');

  // 4. Missing engagement -> DENY
  const res4 = validateAceCommandScope('nmap -sV 10.50.0.1', null);
  assert.strictEqual(res4.allowed, false, 'Network command without active engagement must be denied');

  // 5. Destructive command -> DENY
  const res5 = validateAceCommandScope('rm -rf /etc/shadow', northstar);
  assert.strictEqual(res5.allowed, false, 'Destructive attempt must be denied');

  // 6. Prohibited command / utility -> DENY
  const res6 = validateAceCommandScope('sqlmap -u http://10.50.0.10', northstar);
  assert.strictEqual(res6.allowed, false, 'Restricted offensive utility must be denied');

  // 7. Malformed target -> DENY
  const res7 = validateAceCommandScope('ping 999.999.999.999', northstar);
  assert.strictEqual(res7.allowed, false, 'Malformed IP address target must be denied');
});

import { classifyGeminiError } from '../src/utils/geminiErrorClassifier';
import { generateLocalGuidanceResponse } from '../src/utils/amanLocalGuidance';

runTest('Gemini Error Classifier & Status Matrix', () => {
  // 1. 503 Model Unavailable
  const err503 = classifyGeminiError({ status: 503, message: 'This model is currently experiencing high demand.' });
  assert.strictEqual(err503.code, 'MODEL_UNAVAILABLE');
  assert.strictEqual(err503.isRetryable, true);
  assert.ok(!err503.userFacingMessage.includes('503'));
  assert.ok(!err503.userFacingHinglishMessage.includes('UNAVAILABLE'));

  // 2. 429 Rate Limit / Quota Exceeded
  const err429 = classifyGeminiError({ message: 'Quota exceeded for metric: generativelanguage.googleapis.com' });
  assert.strictEqual(err429.code, 'RATE_LIMITED');
  assert.strictEqual(err429.isRetryable, true);

  // 3. 401 / 403 Auth Error
  const err401 = classifyGeminiError({ status: 401, message: 'API key not valid' });
  assert.strictEqual(err401.code, 'AUTHENTICATION_OR_PERMISSION_ERROR');
  assert.strictEqual(err401.isRetryable, false);

  // 4. 400 Invalid Request / ContentUnion
  const err400 = classifyGeminiError({ message: 'ContentUnion is required' });
  assert.strictEqual(err400.code, 'INVALID_REQUEST');

  // 5. Timeout
  const errTimeout = classifyGeminiError({ message: 'ETIMEDOUT connection failed' });
  assert.strictEqual(errTimeout.code, 'TIMEOUT');

  // 6. Network failure
  const errNetwork = classifyGeminiError({ message: 'Failed to fetch' });
  assert.strictEqual(errNetwork.code, 'NETWORK_ERROR');
});

runTest('AMAN Local Guidance Engine & Multi-Model Fallback Matrix', () => {
  const contextData = {
    currentCourse: 'Networking Fundamentals',
    currentLesson: 'Switches, Routers & Default Gateways',
    cyberLevel: 2,
    language: 'Hinglish'
  };

  // Test 1: "Hi" / "Hyy" in Hinglish
  const respHi = generateLocalGuidanceResponse('Hi', contextData, 'Hinglish', 'MODEL_UNAVAILABLE');
  assert.strictEqual(respHi.amanStatus, 'LOCAL_GUIDANCE');
  assert.ok(respHi.fullText.includes('Main bilkul badhiya hoon'));
  assert.ok(!respHi.fullText.includes('Networking Fundamentals')); // Casual greetings should NOT have room context

  // Test 2: "Mujhe ethical hacking sikhni hai"
  const respHacking = generateLocalGuidanceResponse('Mujhe ethical hacking sikhni hai', contextData, 'Hinglish', 'MODEL_UNAVAILABLE');
  assert.ok(respHacking.fullText.includes('[ACTION:OPEN_LEARNING_PATH:ethical-hacker]'));

  // Test 3: "Mujhe networking sikhni hai"
  const respNet = generateLocalGuidanceResponse('Mujhe networking sikhni hai', contextData, 'Hinglish', 'MODEL_UNAVAILABLE');
  assert.ok(respNet.fullText.includes('Networking'));

  // Test 4: "Next lesson kholo"
  const respNext = generateLocalGuidanceResponse('Next lesson kholo', contextData, 'Hinglish', 'MODEL_UNAVAILABLE');
  assert.ok(respNext.fullText.includes('[ACTION:START_NEXT]'));

  // Test 5: English Query
  const respEng = generateLocalGuidanceResponse('I want to learn ethical hacking', { ...contextData, language: 'English' }, 'English', 'MODEL_UNAVAILABLE');
  assert.ok(respEng.fullText.includes('Ethical Hacker'));
  assert.ok(respEng.fullText.includes('[ACTION:OPEN_LEARNING_PATH:ethical-hacker]'));
});


runTest('AMAN Intent Routing Priority', () => {
  const casualMessages = ["Kya haal hai?", "How are you?", "Hi", "Tell me a joke", "What are you doing?", "Thanks"];
  for (const msg of casualMessages) {
    const intentResult = detectAmanIntent(msg);
    assert.strictEqual(intentResult.intent, 'CONVERSATION');
    assert.strictEqual(intentResult.useRoomContext, false);
    assert.strictEqual(intentResult.useCareerContext, false);
  }

  const roomMessages = ["Explain this room", "What is this room teaching?"];
  for (const msg of roomMessages) {
    const intentResult = detectAmanIntent(msg);
    assert.strictEqual(intentResult.intent, 'ROOM_QUERY');
    assert.strictEqual(intentResult.useRoomContext, true);
  }

  const careerMessages = ["Become an ethical hacker", "Switch to SOC", "Mujhe ethical hacking seekhni hai"];
  for (const msg of careerMessages) {
    const intentResult = detectAmanIntent(msg);
    assert.ok(['CAREER_SWITCH', 'CAREER_LEARNING_INTENT'].includes(intentResult.intent));
    assert.strictEqual(intentResult.useRoomContext, false);
    assert.strictEqual(intentResult.useCareerContext, true);
  }
});

console.log('🎉 ALL PRODUCTION ENGINE ACCEPTANCE TESTS PASSED (100% SUCCESS)');
