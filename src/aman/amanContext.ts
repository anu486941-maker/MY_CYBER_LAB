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
  currentVideoContext?: { videoId: string; title: string; topic: string }
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
  
  return {
    activeRole: chosenRoleKey,
    selectedRole: chosenRoleKey,
    roleTitle: roleCfg.title,
    roleCategory: roleCfg.category,
    roleRecommendedNextAction: `${nextRec.title} (${nextRec.targetName})`,
    roleRecommendedNextRoute: nextRec.route,
    cyberLevel: profile?.cyberLevel || pos.cyberLevel || 1,
    xp: profile?.xp || 0,
    currentCourse: pos.currentCourse || 'Foundations of Cybersecurity',
    currentModule: pos.currentModule || 'Linux Fundamentals',
    currentLesson: pos.currentLesson || 'Terminal Navigation',
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
