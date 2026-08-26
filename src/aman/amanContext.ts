/**
 * AMAN 4.0 - Minimal Application Context Collector
 * Compact, safe, structured representation of the learner's live application state.
 * Only sends essential telemetry fields to eliminate context bloat and token serialization latency.
 */

export interface AmanMinimalContext {
  activeRole: string;
  cyberLevel: number;
  xp: number;
  currentCourse: string;
  currentModule: string;
  currentLesson: string;
  nextRequiredSkill: string;
  masteryPercentage: number;
  completedLabsCount: number;
  completedLessonsCount: number;
  weaknessSummary: string;
  evidenceCount: number;
  currentRoute: string;
  activeMode: string;
  language: string;
  recentCommandHistory?: string[];
  activeAceEngagement?: {
    id: string;
    title: string;
    scope: string;
    status: string;
  };
}

export type CompactLearnerContext = AmanMinimalContext;

/**
 * Builds a lightweight minimal context payload suitable for sending to the Gemini backend or local agent logic.
 * Avoids leaking full arrays or large binaries.
 */
export function buildAmanContext(
  profile: any,
  learningState: any,
  evidenceLocker: any[],
  currentRoute: string = '/dashboard',
  activeMode: string = 'TEACH',
  recentCommands: string[] = []
): AmanMinimalContext {
  const pos = learningState?.position || {};
  
  return {
    activeRole: pos.careerPath || profile?.careerTrack || 'ETHICAL_HACKER',
    cyberLevel: profile?.cyberLevel || pos.cyberLevel || 1,
    xp: profile?.xp || 0,
    currentCourse: pos.currentCourse || 'Foundations of Cybersecurity',
    currentModule: pos.currentModule || 'Linux Fundamentals',
    currentLesson: pos.currentLesson || 'Terminal Navigation',
    nextRequiredSkill: pos.nextRequiredSkill || 'Network Reconnaissance',
    masteryPercentage: pos.overallMasteryPercentage || 0,
    completedLabsCount: pos.completedLabsCount || 0,
    completedLessonsCount: pos.completedLessonsCount || 0,
    weaknessSummary: pos.currentWeakness ? `${pos.currentWeakness}: ${pos.weaknessDetail || ''}` : 'None identified',
    evidenceCount: Array.isArray(evidenceLocker) ? evidenceLocker.length : 0,
    currentRoute: currentRoute || '/dashboard',
    activeMode: activeMode || 'TEACH',
    language: profile?.language || 'Auto',
    recentCommandHistory: (recentCommands || []).slice(-4)
  };
}
