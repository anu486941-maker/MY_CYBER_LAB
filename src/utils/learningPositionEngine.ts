import { 
  UserProfile, 
  LevelModule, 
  Mission, 
  CTFChallenge 
} from '../types';
import { 
  SkillMasteryRecord, 
  LearnerMistake 
} from '../types/intelligence';

export interface LearnerPosition {
  careerPath: string;
  cyberLevel: number;
  currentCourse: string;
  currentModule: string;
  currentLesson: string;
  currentLessonId: string;
  progressPercentage: number;
  overallMasteryPercentage: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  completedLabsCount: number;
  totalLabsCount: number;
  completedMissionsCount: number;
  totalMissionsCount: number;
  completedCtfCount: number;
  totalCtfCount: number;
  currentWeakness: string;
  weaknessDetail: string;
  nextRequiredSkill: string;
  blockingSkill: string | null;
  estimatedNextSession: string;
}

export type NextActionType =
  | 'LESSON'
  | 'PRACTICE'
  | 'LAB'
  | 'ASSESSMENT'
  | 'REVISION'
  | 'MISSION'
  | 'CHALLENGE'
  | 'BOSS'
  | 'CAPSTONE'
  | 'mistake_review'
  | 'lab_practice'
  | 'tactical_mission'
  | 'boss_evaluation';

export interface NextLearningAction {
  actionType: NextActionType;
  activityId: string;
  pathId: string;
  skillId: string;
  title: string;
  reason: string;
  estimatedMinutes: number;
  priority: number;
  stepLink: string;
  whyDescription: string;
  hinglishWhy: string;
  timeEstimate: string;
  xpReward: number;
  difficulty: 'Beginner' | 'Easy' | 'Medium' | 'Challenging';
  badgeLabel: string;
  badgeColor: string;
}

export type NextMoveRecommendation = NextLearningAction;

export interface DailyStudyPlanItem {
  id: string;
  durationMinutes: number;
  title: string;
  type: 'review' | 'practice' | 'lab' | 'quiz' | 'mission';
  link: string;
  description: string;
}

export interface DailyStudyPlan {
  totalMinutes: number;
  items: DailyStudyPlanItem[];
  focusSummary: string;
}

/**
 * Deterministically calculates the exact learning position from application state.
 */
export function calculateLearnerPosition(
  profile: UserProfile,
  levels: LevelModule[],
  missions: Mission[],
  ctfChallenges: CTFChallenge[],
  skillMasteries: SkillMasteryRecord[],
  mistakes: LearnerMistake[],
  quizScores: Record<string, number>,
  labScores: Record<string, number>
): LearnerPosition {
  // 1. Lessons & Modules Count
  let totalLessons = 0;
  let completedLessons = 0;
  let currentLevelModule: LevelModule | null = null;
  let currentLessonTitle = 'IPv4 Basics';
  let currentLessonId = 'l2-1';

  for (const lvl of levels) {
    if (lvl.lessons && lvl.lessons.length > 0) {
      totalLessons += lvl.lessons.length;
      for (const les of lvl.lessons) {
        if (les.completed) {
          completedLessons++;
        } else if (!currentLevelModule) {
          currentLevelModule = lvl;
          currentLessonTitle = les.title;
          currentLessonId = les.id;
        }
      }
    }
  }

  if (!currentLevelModule && levels.length > 0) {
    currentLevelModule = levels[0];
  }

  // 2. Labs Count
  const totalLabs = skillMasteries.length;
  const completedLabs = skillMasteries.filter(s => s.labCompleted).length;

  // 3. Missions Count
  const totalMissions = missions.length;
  const completedMissions = missions.filter(m => m.status === 'completed' || m.completed).length;

  // 4. CTF Count
  const totalCtf = ctfChallenges.length;
  const completedCtf = ctfChallenges.filter(c => c.isSolved || (c as unknown as { solved?: boolean }).solved).length;

  // 5. Mastery Calculation
  const avgMastery = skillMasteries.length > 0
    ? Math.round(skillMasteries.reduce((sum, s) => sum + s.masteryPercentage, 0) / skillMasteries.length)
    : 72;

  const progressPercentage = totalLessons > 0 
    ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
    : 38;

  // 6. Weakness Detection
  const pendingMistakes = mistakes.filter(m => !m.resolved);
  let currentWeakness = 'Subnet Masks & CIDR';
  let weaknessDetail = 'Recent quiz score was 61% on CIDR prefix notation.';
  let blockingSkill: string | null = null;

  if (pendingMistakes.length > 0) {
    currentWeakness = pendingMistakes[0].title;
    weaknessDetail = pendingMistakes[0].whyItHappens || 'Requires conceptual drill and practice.';
    blockingSkill = pendingMistakes[0].title;
  } else {
    const lowestSkill = [...skillMasteries].sort((a, b) => a.masteryPercentage - b.masteryPercentage)[0];
    if (lowestSkill && lowestSkill.masteryPercentage < 70) {
      currentWeakness = lowestSkill.name;
      weaknessDetail = `Mastery is at ${lowestSkill.masteryPercentage}%. Practice recommended.`;
      blockingSkill = lowestSkill.name;
    }
  }

  // 7. Next Required Skill
  const nextIncompleteSkill = skillMasteries.find(s => !s.labCompleted || !s.theoryCompleted) || skillMasteries[0];
  const nextRequiredSkill = nextIncompleteSkill ? nextIncompleteSkill.name : 'Ports & Services';

  // 8. Career Path title
  const careerMap: Record<string, string> = {
    'soc-analyst': 'SOC Analyst (Tier 1)',
    'pentester': 'Junior Penetration Tester',
    'cloud-security': 'Cloud Security Specialist',
    'incident-responder': 'Digital Forensics & Incident Responder',
    'beginner': 'Cybersecurity Beginner'
  };
  const careerPath = careerMap[profile.targetRole || 'beginner'] || 'Cybersecurity Beginner';

  return {
    careerPath,
    cyberLevel: profile.cyberLevel || 3,
    currentCourse: currentLevelModule?.title || 'Networking Fundamentals',
    currentModule: currentLevelModule?.category || 'IP Addressing',
    currentLesson: currentLessonTitle,
    currentLessonId,
    progressPercentage,
    overallMasteryPercentage: avgMastery,
    completedLessonsCount: completedLessons,
    totalLessonsCount: totalLessons,
    completedLabsCount: completedLabs,
    totalLabsCount: totalLabs,
    completedMissionsCount: completedMissions,
    totalMissionsCount: totalMissions,
    completedCtfCount: completedCtf,
    totalCtfCount: totalCtf,
    currentWeakness,
    weaknessDetail,
    nextRequiredSkill,
    blockingSkill,
    estimatedNextSession: '15 minutes'
  };
}

/**
 * Deterministically determines the single best next action for the learner.
 */
export function calculateNextMove(
  position: LearnerPosition,
  mistakes: LearnerMistake[],
  skillMasteries: SkillMasteryRecord[],
  missions: Mission[]
): NextMoveRecommendation {
  const pendingMistakes = mistakes.filter(m => !m.resolved);

  // 1. Critical Mistake Drill / Revision
  if (pendingMistakes.length > 0) {
    const topMistake = pendingMistakes[0];
    const reason = `You recorded difficulty with ${topMistake.category}. Clearing this conceptual weakness is required before advancing.`;
    return {
      actionType: 'REVISION',
      activityId: topMistake.id,
      pathId: position.careerPath,
      skillId: topMistake.relatedSkillId || 'general-remediation',
      title: `Review Mistake: ${topMistake.title}`,
      reason,
      estimatedMinutes: 5,
      priority: 1,
      whyDescription: reason,
      hinglishWhy: `Aapka ${topMistake.title} mein concept weak hai. Pehle 5-minute drill complete karke foundation strong karein.`,
      timeEstimate: '5 minutes',
      xpReward: 75,
      difficulty: 'Easy',
      stepLink: '/mistakes',
      badgeLabel: 'CRITICAL DRILL',
      badgeColor: 'bg-amber-950/80 border-amber-500/40 text-amber-300'
    };
  }

  // 2. Next Hands-On Cyber Lab Module
  const nextLabSkill = skillMasteries.find(s => s.theoryCompleted && !s.labCompleted);
  if (nextLabSkill) {
    const reason = `You have completed the theory for ${nextLabSkill.name}. Now validate your skills in the safe isolated sandbox.`;
    return {
      actionType: 'LAB',
      activityId: `lab-${nextLabSkill.skillId}`,
      pathId: position.careerPath,
      skillId: nextLabSkill.skillId,
      title: `Cyber Lab Module: ${nextLabSkill.name}`,
      reason,
      estimatedMinutes: 20,
      priority: 2,
      whyDescription: reason,
      hinglishWhy: `Aapne ${nextLabSkill.name} ki theory complete kar li hai. Ab isolated lab terminal mein practice start karein.`,
      timeEstimate: '20 minutes',
      xpReward: 250,
      difficulty: 'Beginner',
      stepLink: '/modules',
      badgeLabel: 'HANDS-ON LAB',
      badgeColor: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
    };
  }

  // 3. Next Tactical Mission
  const nextMission = missions.find(m => m.status === 'in_progress' || (!m.completed && m.status !== 'locked'));
  if (nextMission) {
    const reason = nextMission.description;
    return {
      actionType: 'MISSION',
      activityId: nextMission.id,
      pathId: position.careerPath,
      skillId: nextMission.id,
      title: `Tactical Mission: ${nextMission.title}`,
      reason,
      estimatedMinutes: 20,
      priority: 3,
      whyDescription: reason,
      hinglishWhy: `Aapke pass active investigation mission ready hai. Incident telemetry analyze karke +200 XP unlock karein.`,
      timeEstimate: '20 minutes',
      xpReward: 200,
      difficulty: 'Medium',
      stepLink: '/missions',
      badgeLabel: 'TACTICAL MISSION',
      badgeColor: 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
    };
  }

  // 4. Default Skill Advance / Lesson
  const nextSkill = skillMasteries.find(s => !s.bossCompleted) || skillMasteries[0];
  const skillName = nextSkill ? nextSkill.name : 'Ports & Services';
  const reason = `Advance through the core curriculum to raise your role readiness towards your career target.`;
  return {
    actionType: 'LESSON',
    activityId: nextSkill ? `skill-${nextSkill.skillId}` : 'lesson-default',
    pathId: position.careerPath,
    skillId: nextSkill ? nextSkill.skillId : 'ports-and-services',
    title: `Next Required Skill: ${skillName}`,
    reason,
    estimatedMinutes: 15,
    priority: 4,
    whyDescription: reason,
    hinglishWhy: `Aapka current course progress smooth chal raha hai. Ab agla core concept ${skillName} start karein.`,
    timeEstimate: '15 minutes',
    xpReward: 100,
    difficulty: 'Easy',
    stepLink: nextSkill ? `/skills/${nextSkill.skillId}` : '/roadmap',
    badgeLabel: 'RECOMMENDED TARGET',
    badgeColor: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
  };
}

/**
 * Generates an adaptive daily study plan based on available learner time (15, 30, or 55 minutes).
 */
export function generateDailyStudyPlan(
  availableMinutes: number,
  position: LearnerPosition,
  mistakes: LearnerMistake[]
): DailyStudyPlan {
  const pendingMistakes = mistakes.filter(m => !m.resolved);
  const items: DailyStudyPlanItem[] = [];

  if (availableMinutes <= 15) {
    if (pendingMistakes.length > 0) {
      items.push({
        id: 'plan-1',
        durationMinutes: 5,
        title: `Mistake Flash Drill: ${pendingMistakes[0].title}`,
        type: 'review',
        link: '/mistakes',
        description: 'Targeted single-question drill to reinforce memory.'
      });
      items.push({
        id: 'plan-2',
        durationMinutes: 10,
        title: 'Core Concept Lesson & Quiz',
        type: 'quiz',
        link: '/practice',
        description: 'Complete 3 rapid conceptual checks.'
      });
    } else {
      items.push({
        id: 'plan-1',
        durationMinutes: 15,
        title: `Quick Lab: ${position.nextRequiredSkill}`,
        type: 'lab',
        link: '/linux-lab',
        description: '15-minute guided interactive terminal exercise.'
      });
    }
  } else if (availableMinutes <= 30) {
    if (pendingMistakes.length > 0) {
      items.push({
        id: 'plan-1',
        durationMinutes: 5,
        title: `Revision: ${pendingMistakes[0].title}`,
        type: 'review',
        link: '/mistakes',
        description: 'Clear pending mistake from your journal.'
      });
    }
    items.push({
      id: 'plan-2',
      durationMinutes: 15,
      title: `Hands-On Lab: ${position.nextRequiredSkill}`,
      type: 'lab',
      link: '/linux-lab',
      description: 'Execute practical commands in the isolated sandbox.'
    });
    items.push({
      id: 'plan-3',
      durationMinutes: 10,
      title: 'Knowledge Assessment Quiz',
      type: 'quiz',
      link: '/practice',
      description: 'Test retention with instant scoring.'
    });
  } else {
    // 55+ minutes full master session
    items.push({
      id: 'plan-1',
      durationMinutes: 10,
      title: `Weakness Revision (${position.currentWeakness})`,
      type: 'review',
      link: '/mistakes',
      description: 'Review notes, cheat sheets, and previous failed concepts.'
    });
    items.push({
      id: 'plan-2',
      durationMinutes: 15,
      title: `Interactive Theory: ${position.currentLesson}`,
      type: 'practice',
      link: '/roadmap',
      description: 'Deep dive with interactive code/packet inspector.'
    });
    items.push({
      id: 'plan-3',
      durationMinutes: 20,
      title: `Authorized Sandbox Lab: ${position.nextRequiredSkill}`,
      type: 'lab',
      link: '/linux-lab',
      description: 'Hands-on terminal execution and verification.'
    });
    items.push({
      id: 'plan-4',
      durationMinutes: 10,
      title: 'Mini Tactical Mission / CTF Challenge',
      type: 'mission',
      link: '/missions',
      description: 'Solve an investigation and claim bonus XP.'
    });
  }

  const totalMin = items.reduce((sum, item) => sum + item.durationMinutes, 0);

  return {
    totalMinutes: totalMin,
    items,
    focusSummary: `Targeted ${totalMin}-minute session designed to improve ${position.currentWeakness} and unlock ${position.nextRequiredSkill}.`
  };
}
