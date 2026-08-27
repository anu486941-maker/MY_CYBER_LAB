/**
 * AI Learning Orchestrator Engine
 * Central decision engine determining the single best next action for the learner based on adaptive state.
 */

import { UnifiedLearningState } from './unifiedLearningEngine';
import { getWeakestSkills, SkillNode } from './aiSkillGraphEngine';

export type OrchestrationActionType =
  | 'WATCH_VIDEO'
  | 'TAKE_QUIZ'
  | 'REPEAT_LESSON'
  | 'ENTER_LAB'
  | 'PRACTICE_COMMANDS'
  | 'START_MISSION'
  | 'INVESTIGATE_EVIDENCE'
  | 'WRITE_REPORT'
  | 'REVIEW_WEAK_SKILL'
  | 'ADVANCE_TO_NEXT_MODULE';

export interface RecommendedActionPlan {
  actionType: OrchestrationActionType;
  title: string;
  description: string;
  targetRoute: string;
  targetId?: string;
  weakSkillName?: string;
  remediationReason: string;
  expectedXp: number;
  badge?: string;
}

export class AiLearningOrchestrator {
  /**
   * Decides the next logical step in the continuous lifecycle:
   * ONBOARD -> ROLE -> ASSESSMENT -> CURRICULUM -> VIDEO -> QUIZ -> LAB -> READINESS -> MISSION -> INVESTIGATION -> EVIDENCE -> ATTACK CHAIN -> REPORT -> DEBRIEF -> REMEDIATION -> NEXT MISSION
   */
  public static evaluateNextStep(state: UnifiedLearningState): RecommendedActionPlan {
    const weakestSkills = getWeakestSkills();
    const primaryWeakness = state.currentWeakness || (weakestSkills.length > 0 ? weakestSkills[0].name : null);

    // 1. Weak Skill Remediation Loop
    if (primaryWeakness && (state.pendingMistakes.length > 0 || (weakestSkills[0] && weakestSkills[0].score < 65))) {
      const topWeak = weakestSkills[0];
      return {
        actionType: 'REVIEW_WEAK_SKILL',
        title: `Remediate Weak Skill: ${topWeak.name}`,
        description: `Your diagnostic score in ${topWeak.name} is ${topWeak.score}%. Watch the recommended video micro-lesson and complete the targeted exercise to bridge this gap.`,
        targetRoute: topWeak.recommendedRemediation.videoRoute || '/video-learning',
        targetId: topWeak.recommendedRemediation.labId,
        weakSkillName: topWeak.name,
        remediationReason: `Automated weak-skill trigger: ${topWeak.mistakesCount} mistakes logged.`,
        expectedXp: 150,
        badge: 'Remediation Loop Active'
      };
    }

    // 2. Pending Unsubmitted Report
    if (state.evidenceLocker && state.evidenceLocker.length >= 3 && !state.reportSubmitted) {
      return {
        actionType: 'WRITE_REPORT',
        title: 'Draft & Submit Incident Report',
        description: `You have gathered ${state.evidenceLocker.length} key evidence artifacts in your locker. Draft your executive summary and technical recommendations for AMAN review.`,
        targetRoute: '/security-report',
        remediationReason: 'Collected evidence ready for attack-chain reconstruction and reporting.',
        expectedXp: 300,
        badge: 'Report Pending'
      };
    }

    // 3. Low Quiz Scores -> Knowledge Check
    if (state.quizScores && Object.values(state.quizScores).some(score => score < 70)) {
      return {
        actionType: 'TAKE_QUIZ',
        title: 'Retake Knowledge Check',
        description: 'Your recent quiz score fell below 70%. Retake the knowledge check to verify conceptual understanding before proceeding to authorized labs.',
        targetRoute: '/exam-mode',
        remediationReason: 'Quiz threshold not met.',
        expectedXp: 100
      };
    }

    // 4. Lab Practice
    if (state.completedLabsCount < 3) {
      return {
        actionType: 'ENTER_LAB',
        title: 'Hands-On Authorized Cyber Lab',
        description: 'Practice interactive command execution and vulnerability verification inside the isolated MY CYBER LAB training environment.',
        targetRoute: '/practice/web-security',
        remediationReason: 'Hands-on practical experience required for role progression.',
        expectedXp: 200,
        badge: 'Authorized Lab'
      };
    }

    // 5. Authorized Attack Simulation Mission
    return {
      actionType: 'START_MISSION',
      title: 'Authorized Enterprise Incident Mission',
      description: 'Engage in a sequence-wise enterprise incident mission to test your end-to-end incident response or ethical hacking skills.',
      targetRoute: '/missions',
      remediationReason: 'Core curriculum requirements completed. Advance to authorized scenario.',
      expectedXp: 500,
      badge: 'Authorized Cyber Range'
    };
  }
}
