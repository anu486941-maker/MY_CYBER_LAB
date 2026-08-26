import { VideoItem, UserProfile, VideoUserProgress } from '../types';
import { VIDEO_LEARNING_DATA, getVideosByRole } from '../data/videoLearningData';

export interface AmanVideoRecommendation {
  primaryVideo: VideoItem;
  reason: string;
  categoryBadge: string;
  nextUpVideos: VideoItem[];
  roleCurriculum: VideoItem[];
  completionPercentage: number;
}

/**
 * AMAN's Cognitive Video Recommendation Engine
 * Analyzes the operator's active career role, completed videos, quiz performance,
 * weak skills, and current mission to recommend the optimal next video lesson.
 */
export function getAmanVideoRecommendations(
  profile: Partial<UserProfile> | any,
  videoProgressMap: Record<string, VideoUserProgress> = {},
  weakSkills: string[] = []
): AmanVideoRecommendation {
  const targetRole = profile?.selectedRole || profile?.targetRole || 'soc-analyst';
  
  // 1. Get role-specific curriculum
  let roleVideos = getVideosByRole(targetRole);
  if (roleVideos.length === 0) {
    roleVideos = VIDEO_LEARNING_DATA;
  }

  // 2. Identify completed and in-progress videos
  const completedVideoIds = new Set(
    Object.values(videoProgressMap)
      .filter(p => p.completed || (p.watchProgress && p.watchProgress >= 90))
      .map(p => p.videoId)
  );

  const inProgressVideos = roleVideos.filter(v => {
    const prog = videoProgressMap[v.id];
    return prog && prog.watchProgress > 0 && !prog.completed;
  });

  const uncompletedRoleVideos = roleVideos.filter(v => !completedVideoIds.has(v.id));

  // Compute stats
  const completedInRole = roleVideos.filter(v => completedVideoIds.has(v.id)).length;
  const completionPercentage = roleVideos.length > 0 
    ? Math.round((completedInRole / roleVideos.length) * 100) 
    : 0;

  // 3. Selection Strategy
  let primaryVideo: VideoItem;
  let reason: string;
  let categoryBadge: string;

  if (inProgressVideos.length > 0) {
    // Resume video
    primaryVideo = inProgressVideos[0];
    const progress = Math.round(videoProgressMap[primaryVideo.id]?.watchProgress || 0);
    reason = `You were halfway through this lesson (${progress}% watched). Resume to solidify your ${primaryVideo.topic} understanding.`;
    categoryBadge = 'RESUME IN PROGRESS';
  } else if (weakSkills && weakSkills.length > 0) {
    // Check if any uncompleted video in role curriculum (or all videos) matches a weak skill
    const weakMatchInRole = roleVideos.find(v => 
      !completedVideoIds.has(v.id) && 
      weakSkills.some(ws => 
        v.topic.toLowerCase().includes(ws.toLowerCase()) || 
        v.title.toLowerCase().includes(ws.toLowerCase()) ||
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
      reason = `Targeting detected weak skill (${matchedWeak}). AMAN recommends watching this lesson to eliminate knowledge gaps.`;
      categoryBadge = 'WEAK-SKILL REMEDIATION';
    } else if (uncompletedRoleVideos.length > 0) {
      primaryVideo = uncompletedRoleVideos[0];
      reason = `Aligned with your ${targetRole.toUpperCase()} career track. Mastering ${primaryVideo.topic} unlocks the next phase of hands-on labs.`;
      categoryBadge = 'ROLE CURRICULUM NEXT';
    } else {
      primaryVideo = roleVideos[0];
      reason = `Revisiting key concepts in ${primaryVideo.topic} to maintain operational readiness.`;
      categoryBadge = 'CURRICULUM REVIEW';
    }
  } else if (uncompletedRoleVideos.length > 0) {
    // Next ordered uncompleted video in the curriculum
    primaryVideo = uncompletedRoleVideos[0];
    reason = `Aligned with your ${targetRole.toUpperCase()} career track. Mastering ${primaryVideo.topic} unlocks the next phase of hands-on labs.`;
    categoryBadge = 'ROLE CURRICULUM NEXT';
  } else {
    // Role curriculum complete! Recommend advanced topic from broader catalog
    const allUncompleted = VIDEO_LEARNING_DATA.filter(v => !completedVideoIds.has(v.id));
    if (allUncompleted.length > 0) {
      primaryVideo = allUncompleted[0];
      reason = `You have completed your primary ${targetRole} video curriculum! Expanding into ${primaryVideo.topic} enhances your purple team capabilities.`;
      categoryBadge = 'CROSS-DISCIPLINE EXPANSION';
    } else {
      primaryVideo = roleVideos[0];
      reason = `You have achieved 100% video curriculum mastery. Revisiting key concepts ensures long-term operational readiness.`;
      categoryBadge = 'CURRICULUM REVIEW';
    }
  }

  // 4. Determine "Next Up" suggestions
  const nextUpVideos = VIDEO_LEARNING_DATA
    .filter(v => v.id !== primaryVideo.id && !completedVideoIds.has(v.id))
    .slice(0, 4);

  return {
    primaryVideo,
    reason,
    categoryBadge,
    nextUpVideos,
    roleCurriculum: roleVideos,
    completionPercentage
  };
}

/**
 * Get the next recommended video for a given role and progress state
 */
export function getNextRecommendedVideo(
  roleId: string,
  videoProgressMap: Record<string, VideoUserProgress> = {},
  weakSkills: string[] = []
): VideoItem | null {
  const rec = getAmanVideoRecommendations({ selectedRole: roleId }, videoProgressMap, weakSkills);
  return rec?.primaryVideo || null;
}

/**
 * Get all recommended videos for a given role in optimal order
 */
export function getVideoRecommendationsForRole(
  roleId: string,
  videoProgressMap: Record<string, VideoUserProgress> = {},
  weakSkills: string[] = []
): VideoItem[] {
  const rec = getAmanVideoRecommendations({ selectedRole: roleId }, videoProgressMap, weakSkills);
  if (!rec) return getVideosByRole(roleId);
  
  const roleVids = rec.roleCurriculum || getVideosByRole(roleId);
  return roleVids;
}

/**
 * Search videos across titles, topics, tags, instructors, and descriptions
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
    const inInstructor = (v.instructor || '').toLowerCase().includes(q);
    const inTags = (v.tags || []).some(t => t.toLowerCase().includes(q));

    return inTitle || inDesc || inTopic || inRole || inInstructor || inTags;
  });
}

