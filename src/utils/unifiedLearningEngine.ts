import { UserProfile, LevelModule, Mission, CTFChallenge } from '../types';
import { SkillMasteryRecord, LearnerMistake } from '../types/intelligence';
import { 
  LearnerPosition, 
  NextMoveRecommendation, 
  DailyStudyPlan, 
  calculateLearnerPosition, 
  calculateNextMove, 
  generateDailyStudyPlan 
} from './learningPositionEngine';
import { 
  AmanInstruction, 
  AmanEvent, 
  AmanCoachingLevelInfo,
  calculateCoachingLevel,
  generateAmanInstruction, 
  getEscalatedHint, 
  parseVoiceCommand,
  EscalatedHint,
  VoiceCommandResult
} from './amanInstructionEngine';
import { CyberLabTask } from '../types/cyberLabModuleTypes';

export interface UnifiedLearningState {
  // Core Position
  position: LearnerPosition;
  careerPath: string;
  currentCourse: string;
  currentModule: string;
  currentLesson: string;
  currentLessonId: string;
  cyberLevel: number;

  // Progress & Readiness
  progressPercentage: number;
  overallMasteryPercentage: number;
  readinessPercentage: number;

  // Adaptive Coaching Level
  coachingLevel: AmanCoachingLevelInfo;

  // Counts & Progress Flags
  completedLessonsCount: number;
  totalLessonsCount: number;
  completedLabsCount: number;
  totalLabsCount: number;
  completedMissionsCount: number;
  totalMissionsCount: number;
  completedCtfCount: number;
  totalCtfCount: number;

  // Skill Masteries & Prerequisites
  skillMasteries: SkillMasteryRecord[];
  weakSkills: SkillMasteryRecord[];
  strongSkills: SkillMasteryRecord[];
  nextRequiredSkill: string;
  blockingSkill: string | null;

  // Mistakes & Remediation
  pendingMistakes: LearnerMistake[];
  resolvedMistakes: LearnerMistake[];
  currentWeakness: string;
  weaknessDetail: string;

  // Assessment & Lab Performance
  quizScores: Record<string, number>;
  labScores: Record<string, number>;
  evidenceLocker?: any[];
  reportSubmitted?: boolean;

  // Unified Next Action
  nextMove: NextMoveRecommendation;

  // Active AMAN Instruction
  activeAmanInstruction: AmanInstruction;

  // Daily Adaptive Plan
  studyPlan: DailyStudyPlan;
}

export class UnifiedLearningEngine {
  /**
   * Computes the single authoritative learning state snapshot from context slices.
   */
  static getSnapshot(
    profile: UserProfile,
    levels: LevelModule[],
    missions: Mission[],
    ctfChallenges: CTFChallenge[],
    skillMasteries: SkillMasteryRecord[],
    mistakes: LearnerMistake[],
    quizScores: Record<string, number>,
    labScores: Record<string, number>,
    event: AmanEvent = 'session_start',
    extraContext?: any
  ): UnifiedLearningState {
    // 1. Calculate Core Position
    const position = calculateLearnerPosition(
      profile,
      levels,
      missions,
      ctfChallenges,
      skillMasteries,
      mistakes,
      quizScores,
      labScores
    );

    // 2. Calculate Single Best Next Move
    const nextMove = calculateNextMove(
      position,
      mistakes,
      skillMasteries,
      missions
    );

    // 3. Filter Weak & Strong Skills
    const weakSkills = skillMasteries.filter(
      s => s.confidence === 'BEGINNER' || s.confidence === 'FAMILIAR' || s.masteryPercentage < 70
    );
    const strongSkills = skillMasteries.filter(
      s => s.confidence === 'STRONG' || s.confidence === 'MASTERED' || s.masteryPercentage >= 80
    );

    // 4. Filter Mistakes
    const pendingMistakes = mistakes.filter(m => !m.resolved);
    const resolvedMistakes = mistakes.filter(m => m.resolved);

    // 5. Readiness Percentage Calculation (Weighted)
    const missionRatio = position.totalMissionsCount > 0 ? position.completedMissionsCount / position.totalMissionsCount : 0;
    const ctfRatio = position.totalCtfCount > 0 ? position.completedCtfCount / position.totalCtfCount : 0;
    const readinessPercentage = Math.min(100, Math.round(
      (position.progressPercentage * 0.4) +
      (position.overallMasteryPercentage * 0.3) +
      (missionRatio * 100 * 0.2) +
      (ctfRatio * 100 * 0.1)
    ));

    // 6. Calculate Adaptive Coaching Level
    const coachingLevel = calculateCoachingLevel(
      position.overallMasteryPercentage,
      extraContext?.attempts || 1,
      pendingMistakes.length,
      extraContext?.trainingMode || 'Coach'
    );

    // 7. Generate Active AMAN Instruction
    const activeAmanInstruction = generateAmanInstruction(
      event,
      position,
      nextMove,
      profile,
      extraContext
    );
    activeAmanInstruction.coachingLevel = coachingLevel;

    // 8. Generate Daily Adaptive Study Plan (default 30 mins)
    const studyPlan = generateDailyStudyPlan(30, position, mistakes);

    return {
      position,
      careerPath: position.careerPath,
      currentCourse: position.currentCourse,
      currentModule: position.currentModule,
      currentLesson: position.currentLesson,
      currentLessonId: position.currentLessonId,
      cyberLevel: position.cyberLevel,

      progressPercentage: position.progressPercentage,
      overallMasteryPercentage: position.overallMasteryPercentage,
      readinessPercentage,
      coachingLevel,

      completedLessonsCount: position.completedLessonsCount,
      totalLessonsCount: position.totalLessonsCount,
      completedLabsCount: position.completedLabsCount,
      totalLabsCount: position.totalLabsCount,
      completedMissionsCount: position.completedMissionsCount,
      totalMissionsCount: position.totalMissionsCount,
      completedCtfCount: position.completedCtfCount,
      totalCtfCount: position.totalCtfCount,

      skillMasteries,
      weakSkills,
      strongSkills,
      nextRequiredSkill: position.nextRequiredSkill,
      blockingSkill: position.blockingSkill,

      pendingMistakes,
      resolvedMistakes,
      currentWeakness: position.currentWeakness,
      weaknessDetail: position.weaknessDetail,

      quizScores,
      labScores,

      nextMove,
      activeAmanInstruction,
      studyPlan
    };
  }

  /**
   * Helper to fetch AMAN instruction for any learning event
   */
  static getAmanInstruction(
    event: AmanEvent,
    state: UnifiedLearningState,
    profile: UserProfile,
    extraContext?: any
  ): AmanInstruction {
    return generateAmanInstruction(
      event,
      state.position,
      state.nextMove,
      profile,
      extraContext
    );
  }

  /**
   * Helper to get adaptive study plan for specific duration
   */
  static getStudyPlan(durationMinutes: number, state: UnifiedLearningState, mistakes: LearnerMistake[]): DailyStudyPlan {
    return generateDailyStudyPlan(durationMinutes, state.position, mistakes);
  }

  /**
   * Helper to fetch escalated hint
   */
  static getHint(task: CyberLabTask, attemptCount: number): EscalatedHint {
    return getEscalatedHint(task, attemptCount);
  }

  /**
   * Helper to process voice commands
   */
  static processVoice(transcript: string): VoiceCommandResult {
    return parseVoiceCommand(transcript);
  }
}
