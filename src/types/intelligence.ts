import { LanguagePreference, CareerRoleId } from './index';

export type TrainingMode = 'MENTOR' | 'EXAM';

export type SkillConfidence = 'BEGINNER' | 'FAMILIAR' | 'COMPETENT' | 'STRONG' | 'MASTERED';

export interface SkillMasteryRecord {
  skillId: string;
  name: string;
  category: string;
  tier: number;
  theoryCompleted: boolean;
  practiceCompleted: boolean;
  practiceScore: number;
  labCompleted: boolean;
  labScore: number;
  assessmentCompleted: boolean;
  assessmentScore: number;
  missionCompleted: boolean;
  missionScore: number;
  bossCompleted: boolean;
  bossScore: number;
  masteryPercentage: number;
  confidence: SkillConfidence;
  attemptsCount: number;
  hintsUsedCount: number;
  lastTrainedAt: string;
  nextSpacedReviewDue: string;
  prerequisites: string[];
  isLocked: boolean;
}

export interface LearnerMistake {
  id: string;
  title: string;
  category: string;
  occurrences: number;
  lastOccurredAt: string;
  whyItHappens: string;
  howToFixIt: string;
  relatedSkillId: string;
  resolved: boolean;
  drillQuestion: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    hint: string;
  };
}

export interface MultiToolScenario {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Advanced';
  scenarioContext: string;
  telemetryEvidence: string;
  targetType: string;
  tools: {
    name: string;
    description: string;
    isCorrect: boolean;
    rationale: string;
  }[];
  followUpPrompt: string;
  followUpOptions: string[];
  followUpCorrectIndex: number;
  followUpExplanation: string;
  xpReward: number;
}

export interface LearningHealthMetrics {
  consistencyScore: number;
  understandingScore: number;
  practicalScore: number;
  problemSolvingScore: number;
  overallHealthScore: number;
  totalStudyMinutes: number;
  streakDays: number;
  averageLabScore: number;
  firstAttemptRate: number;
  resolvedMistakesCount: number;
  pendingMistakesCount: number;
}

export interface SpacedReviewCard {
  id: string;
  skillId: string;
  skillName: string;
  intervalDays: number;
  dueDate: string;
  isDue: boolean;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamQuestion {
  id: string;
  category: string;
  skillRef: string;
  prompt: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface ExamSession {
  id: string;
  title: string;
  roleRef: CareerRoleId;
  durationMinutes: number;
  questions: ExamQuestion[];
  passingScorePercent: number;
}
