/**
 * AMAN 4.0 - Minimal Application Context Collector
 * Compact, safe, structured representation of the learner's live application state.
 * Only sends essential telemetry fields to eliminate context bloat and token serialization latency.
 */

import { getRolePersonalization } from '../services/rolePersonalization';
import { getVideoRecommendationsForRole, getNextRecommendedVideo } from '../services/videoRecommendationEngine';

export interface AmanMinimalContext {
  activeRole: string;
  selectedRole?: string;
  roleTitle?: string;
  roleCategory?: string;
  roleRecommendedNextAction?: string;
  roleRecommendedNextRoute?: string;
  cyberLevel: number;
  xp: number;
  skillLevel?: string;
  currentCourse: string;
  currentModule: string;
  currentLesson: string;
  currentLab?: string;
  currentMission?: string;
  completedMissionsCount?: number;
  verifiedCheckpointsCount?: number;
  recentEvidenceSummary?: string;
  conversationalSubject?: string;
  currentQuestion?: string;
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
  videosWatchedCount?: number;
  recommendedVideoTitle?: string;
  recommendedVideoTopic?: string;
  recommendedVideoRoute?: string;
  currentVideoId?: string;
  currentVideoTitle?: string;
  activeAceEngagement?: {
    id: string;
    title: string;
    scope: string;
    status: string;
  };
}

export type CompactLearnerContext = AmanMinimalContext;

/**
 * Derives current lab description from the active route or state
 */
export function deriveCurrentLabName(route: string): string | undefined {
  if (!route) return undefined;
  if (route.includes('linux-lab')) return 'Linux Fundamentals Terminal Lab';
  if (route.includes('network-lab')) return 'Network Reconnaissance & Nmap Lab';
  if (route.includes('web-security')) return 'Web Application Security & SQLi Lab';
  if (route.includes('soc-simulator') || route.includes('incident-lab')) return 'SOC Incident Investigation Simulator';
  if (route.includes('cyber-range')) return 'Virtual Cyber Range & AttackBox';
  if (route.includes('flag-checkpoint')) return 'Flag Checkpoint & Verification Lab';
  if (route.includes('evidence-locker') || route.includes('ace')) return 'Forensic Evidence Locker';
  if (route.includes('roadmap')) return 'Interactive Cybersecurity Roadmap';
  return undefined;
}

/**
 * Resolves conversational pronouns ("this", "it", "that error") based on current route or history
 */
export function resolveConversationalSubject(
  query: string,
  route: string,
  recentCommands: string[] = []
): string | undefined {
  const q = query.toLowerCase();
  if (/\b(this|it|that|the error|my command|why.*wrong)\b/.test(q)) {
    if (recentCommands.length > 0) {
      return `Previous command executed in terminal: "${recentCommands[recentCommands.length - 1]}"`;
    }
    const lab = deriveCurrentLabName(route);
    if (lab) return lab;
  }
  return undefined;
}

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
  recentCommands: string[] = [],
  videoProgressMap?: Record<string, any>,
  currentVideoContext?: { videoId: string; title: string; topic: string },
  currentQuestion?: string
): AmanMinimalContext {
  const pos = learningState?.position || {};
  const chosenRoleKey = profile?.selectedRole || profile?.targetRole || pos.careerPath || 'soc-analyst';
  const roleCfg = getRolePersonalization(chosenRoleKey);
  const nextRec = roleCfg.getNextAction(profile);

  let nextVidRec: any = null;
  let watchedCount = 0;
  if (videoProgressMap) {
    watchedCount = Object.values(videoProgressMap).filter((v: any) => v.completed || (v.watchProgress || 0) >= 90).length;
    nextVidRec = getNextRecommendedVideo(chosenRoleKey, videoProgressMap, pos.currentWeakness ? [pos.currentWeakness] : []);
  }

  // Evidence summary: brief names of recent 2 items
  let recentEvidenceSummary: string | undefined = undefined;
  if (Array.isArray(evidenceLocker) && evidenceLocker.length > 0) {
    const recent = evidenceLocker.slice(-2);
    recentEvidenceSummary = recent.map((e: any) => e.title || e.type || 'Finding').join(', ');
  }

  const currentLab = deriveCurrentLabName(currentRoute);
  const conversationalSubject = currentQuestion ? resolveConversationalSubject(currentQuestion, currentRoute, recentCommands) : undefined;
  
  return {
    activeRole: chosenRoleKey,
    selectedRole: chosenRoleKey,
    roleTitle: roleCfg.title,
    roleCategory: roleCfg.category,
    roleRecommendedNextAction: `${nextRec.title} (${nextRec.targetName})`,
    roleRecommendedNextRoute: nextRec.route,
    cyberLevel: profile?.cyberLevel || pos.cyberLevel || 1,
    xp: profile?.xp || 0,
    skillLevel: profile?.skillLevel || profile?.assessedLevel || (profile?.cyberLevel && profile.cyberLevel >= 3 ? 'Intermediate' : 'Beginner'),
    currentCourse: pos.currentCourse || 'Foundations of Cybersecurity',
    currentModule: pos.currentModule || 'Linux Fundamentals',
    currentLesson: pos.currentLesson || 'Terminal Navigation',
    currentLab,
    currentMission: learningState?.currentMission || pos.currentMission || 'Network Triage',
    completedMissionsCount: Array.isArray(profile?.completedMissions) ? profile.completedMissions.length : (pos.completedMissionsCount || 0),
    verifiedCheckpointsCount: Array.isArray(profile?.verifiedCheckpoints) ? profile.verifiedCheckpoints.length : 0,
    recentEvidenceSummary,
    conversationalSubject,
    currentQuestion,
    nextRequiredSkill: pos.nextRequiredSkill || nextRec.title || 'Network Reconnaissance',
    masteryPercentage: pos.overallMasteryPercentage || 0,
    completedLabsCount: pos.completedLabsCount || 0,
    completedLessonsCount: pos.completedLessonsCount || 0,
    weaknessSummary: pos.currentWeakness ? `${pos.currentWeakness}: ${pos.weaknessDetail || ''}` : 'None identified',
    evidenceCount: Array.isArray(evidenceLocker) ? evidenceLocker.length : 0,
    currentRoute: currentRoute || '/dashboard',
    activeMode: activeMode || 'TEACH',
    language: profile?.language || 'Auto',
    recentCommandHistory: (recentCommands || []).slice(-4),
    videosWatchedCount: watchedCount,
    recommendedVideoTitle: nextVidRec?.title,
    recommendedVideoTopic: nextVidRec?.topic,
    recommendedVideoRoute: nextVidRec ? `/video-learning?videoId=${nextVidRec.id}` : '/video-learning',
    currentVideoId: currentVideoContext?.videoId,
    currentVideoTitle: currentVideoContext?.title
  };
}
