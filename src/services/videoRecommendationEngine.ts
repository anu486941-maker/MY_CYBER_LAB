import { VideoItem, UserProfile, VideoUserProgress, VideoLanguage } from '../types';
import { VIDEO_LEARNING_DATA, getVideosByRole } from '../data/videoLearningData';

export interface AmanVideoRecommendation {
  primaryVideo: VideoItem;
  reason: string;
  categoryBadge: string;
  nextUpVideos: VideoItem[];
  roleCurriculum: VideoItem[];
  completionPercentage: number;
  recommendedLanguage?: VideoLanguage | 'Auto';
  suggestedAction?: {
    type: 'WATCH_VIDEO' | 'TAKE_QUIZ' | 'LAUNCH_LAB';
    label: string;
    route?: string;
  };
}

/**
 * AMAN's Cognitive Video Recommendation Engine
 * Analyzes the operator's active career role, language preference, completed videos,
 * quiz performance, weak skills, and hands-on milestones to recommend the optimal video lesson.
 */
export function getAmanVideoRecommendations(
  profile: Partial<UserProfile> | any,
  videoProgressMap: Record<string, VideoUserProgress> = {},
  weakSkills: string[] = [],
  preferredLanguage: VideoLanguage | 'Auto' = 'Auto'
): AmanVideoRecommendation {
  const targetRole = profile?.selectedRole || profile?.targetRole || 'ethical-hacker';
  
  // 1. Get role-specific curriculum
  let roleVideos = getVideosByRole(targetRole);
  if (roleVideos.length === 0) {
    roleVideos = VIDEO_LEARNING_DATA;
  }

  // 2. Filter by language preference if not 'Auto'
  if (preferredLanguage && preferredLanguage !== 'Auto') {
    const langFiltered = roleVideos.filter(v => v.language === preferredLanguage);
    if (langFiltered.length > 0) {
      roleVideos = langFiltered;
    }
  }

  // 3. Identify completed and in-progress videos
  const completedVideoIds = new Set(
    Object.values(videoProgressMap)
      .filter(p => p.completed || (p.watchProgress && p.watchProgress >= 90))
      .map(p => p.videoId)
  );

  const inProgressVideos = roleVideos.filter(v => {
    const prog = videoProgressMap[v.id];
    return prog && prog.watchProgress > 0 && !prog.completed;
  });

  // Fallback: check if any video across catalog or custom id is in progress
  if (inProgressVideos.length === 0) {
    const globalInProgress = VIDEO_LEARNING_DATA.filter(v => {
      const prog = videoProgressMap[v.id];
      return prog && prog.watchProgress > 0 && !prog.completed;
    });
    if (globalInProgress.length > 0) {
      inProgressVideos.push(...globalInProgress);
    } else {
      const anyInProgressId = Object.keys(videoProgressMap).find(id => {
        const prog = videoProgressMap[id];
        return prog && prog.watchProgress > 0 && !prog.completed;
      });
      if (anyInProgressId) {
        const matched = VIDEO_LEARNING_DATA.find(v => v.id === anyInProgressId) || roleVideos[0] || VIDEO_LEARNING_DATA[0];
        inProgressVideos.push({
          ...matched,
          id: anyInProgressId
        });
      }
    }
  }

  const uncompletedRoleVideos = roleVideos.filter(v => !completedVideoIds.has(v.id));

  // Compute stats
  const completedInRole = roleVideos.filter(v => completedVideoIds.has(v.id)).length;
  const completionPercentage = roleVideos.length > 0 
    ? Math.round((completedInRole / roleVideos.length) * 100) 
    : 0;

  // 4. Selection Strategy
  let primaryVideo: VideoItem;
  let reason: string;
  let categoryBadge: string;
  let suggestedAction: AmanVideoRecommendation['suggestedAction'];

  if (inProgressVideos.length > 0) {
    // Resume video
    primaryVideo = inProgressVideos[0];
    const progress = Math.round(videoProgressMap[primaryVideo.id]?.watchProgress || 0);
    reason = `You were halfway through this lesson (${progress}% watched). Resume to solidify your ${primaryVideo.topic} understanding.`;
    categoryBadge = 'RESUME IN PROGRESS';
    suggestedAction = {
      type: 'WATCH_VIDEO',
      label: `Resume (${progress}%)`
    };
  } else if (weakSkills && weakSkills.length > 0) {
    // Check if any uncompleted video in role curriculum matches a weak skill
    const weakMatchInRole = roleVideos.find(v => 
      !completedVideoIds.has(v.id) && 
      weakSkills.some(ws => 
        v.topic.toLowerCase().includes(ws.toLowerCase()) || 
        v.title.toLowerCase().includes(ws.toLowerCase()) ||
        (v.skills && v.skills.some(s => s.toLowerCase().includes(ws.toLowerCase()))) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(ws.toLowerCase())))
      )
    );

    if (weakMatchInRole) {
      primaryVideo = weakMatchInRole;
      const matchedWeak = weakSkills.find(ws => 
        primaryVideo.topic.toLowerCase().includes(ws.toLowerCase()) || 
        primaryVideo.title.toLowerCase().includes(ws.toLowerCase()) ||
        (primaryVideo.tags && primaryVideo.tags.some(t => t.toLowerCase().includes(ws.toLowerCase())))
      ) || weakSkills[0];
      reason = `Targeting detected weak skill (${matchedWeak}). AMAN recommends watching this lesson to eliminate operational knowledge gaps.`;
      categoryBadge = 'WEAK-SKILL REMEDIATION';
      suggestedAction = {
        type: 'WATCH_VIDEO',
        label: 'Strengthen Skill'
      };
    } else if (uncompletedRoleVideos.length > 0) {
      primaryVideo = uncompletedRoleVideos[0];
      reason = `Aligned with your ${targetRole.toUpperCase()} career track. Mastering ${primaryVideo.topic} unlocks subsequent hands-on missions.`;
      categoryBadge = 'ROLE ROADMAP NEXT';
      suggestedAction = {
        type: 'WATCH_VIDEO',
        label: 'Start Next Lesson'
      };
    } else {
      primaryVideo = roleVideos[0];
      reason = `Revisiting key concepts in ${primaryVideo.topic} to maintain operational readiness.`;
      categoryBadge = 'CURRICULUM REVIEW';
      suggestedAction = {
        type: 'WATCH_VIDEO',
        label: 'Review Lesson'
      };
    }
  } else if (uncompletedRoleVideos.length > 0) {
    // Next ordered uncompleted video in curriculum
    primaryVideo = uncompletedRoleVideos[0];
    reason = `Aligned with your ${targetRole.toUpperCase()} career pathway. Mastering ${primaryVideo.topic} prepares you for live range labs.`;
    categoryBadge = 'ROLE ROADMAP NEXT';
    suggestedAction = {
      type: 'WATCH_VIDEO',
      label: 'Start Lesson'
    };
  } else {
    // Role curriculum completed: suggest cross-discipline or review
    const allUncompleted = VIDEO_LEARNING_DATA.filter(v => !completedVideoIds.has(v.id));
    if (allUncompleted.length > 0) {
      primaryVideo = allUncompleted[0];
      reason = `You have completed your primary ${targetRole} video curriculum! Expanding into ${primaryVideo.topic} builds cross-domain purple-team agility.`;
      categoryBadge = 'CROSS-DISCIPLINE EXPANSION';
      suggestedAction = {
        type: 'WATCH_VIDEO',
        label: 'Explore Expansion'
      };
    } else {
      primaryVideo = roleVideos[0];
      reason = `You have achieved 100% video curriculum mastery. Revisiting key topics reinforces retention.`;
      categoryBadge = 'CURRICULUM REVIEW';
      suggestedAction = {
        type: 'WATCH_VIDEO',
        label: 'Review Mastered Topic'
      };
    }
  }

  // 5. If primary video is watched but quiz isn't passed, prompt quiz
  const primaryProg = videoProgressMap[primaryVideo.id];
  if (primaryProg && (primaryProg.watchProgress >= 80 || primaryProg.completed) && !primaryProg.quizCompleted) {
    reason = `You finished watching ${primaryVideo.title}. Complete the 3-question mastery quiz to cement +50 XP and test retention.`;
    categoryBadge = 'QUIZ READY';
    suggestedAction = {
      type: 'TAKE_QUIZ',
      label: 'Take Mastery Quiz (+50 XP)'
    };
  } else if (primaryProg && primaryProg.quizCompleted && primaryVideo.relatedLab) {
    reason = `You mastered the theory and quiz for ${primaryVideo.topic}. Put it into practice in the ${primaryVideo.relatedLab.name}.`;
    categoryBadge = 'HANDS-ON READY';
    suggestedAction = {
      type: 'LAUNCH_LAB',
      label: `Launch Lab: ${primaryVideo.relatedLab.name}`,
      route: primaryVideo.relatedLab.route
    };
  }

  // 6. Determine "Next Up" suggestions
  const nextUpVideos = VIDEO_LEARNING_DATA
    .filter(v => v.id !== primaryVideo.id && !completedVideoIds.has(v.id))
    .slice(0, 4);

  return {
    primaryVideo,
    reason,
    categoryBadge,
    nextUpVideos,
    roleCurriculum: roleVideos,
    completionPercentage,
    recommendedLanguage: preferredLanguage,
    suggestedAction
  };
}

/**
 * Get role-based video recommendations array
 */
export function getVideoRecommendationsForRole(
  roleId: string,
  videoProgressMap: Record<string, VideoUserProgress> = {},
  weakSkills: string[] = [],
  preferredLanguage: VideoLanguage | 'Auto' = 'Auto'
): VideoItem[] {
  const rec = getAmanVideoRecommendations({ selectedRole: roleId }, videoProgressMap, weakSkills, preferredLanguage);
  return rec.roleCurriculum;
}

/**
 * Get the next recommended video for a given role and progress state
 */
export function getNextRecommendedVideo(
  roleId: string,
  videoProgressMap: Record<string, VideoUserProgress> = {},
  weakSkills: string[] = [],
  preferredLanguage: VideoLanguage | 'Auto' = 'Auto'
): VideoItem | null {
  const rec = getAmanVideoRecommendations({ selectedRole: roleId }, videoProgressMap, weakSkills, preferredLanguage);
  return rec?.primaryVideo || null;
}

/**
 * Search videos across titles, topics, tags, instructors, languages, and descriptions
 */
export function searchVideos(
  query: string,
  videos: VideoItem[] = VIDEO_LEARNING_DATA
): VideoItem[] {
  if (!query.trim()) return videos;
  const q = query.toLowerCase().trim();

  return videos.filter(v => {
    const inTitle = v.title.toLowerCase().includes(q);
    const inDesc = v.description.toLowerCase().includes(q);
    const inTopic = v.topic.toLowerCase().includes(q);
    const inRole = (v.role || (v as any).roleId || '').toLowerCase().includes(q);
    const inRoles = (v.roles || []).some(r => r.toLowerCase().includes(q));
    const inInstructor = (v.instructor || '').toLowerCase().includes(q);
    const inLanguage = (v.language || '').toLowerCase().includes(q);
    const inTags = (v.tags || []).some(t => t.toLowerCase().includes(q));
    const inSkills = (v.skills || []).some(s => s.toLowerCase().includes(q));

    return inTitle || inDesc || inTopic || inRole || inRoles || inInstructor || inLanguage || inTags || inSkills;
  });
}
