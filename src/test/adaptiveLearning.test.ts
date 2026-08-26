import { describe, it, expect } from 'vitest';
import { getAmanVideoRecommendations, searchVideos } from '../services/videoRecommendationEngine';

describe('Adaptive Learning & Recommendation Engine Unit Tests', () => {
  it('recommends weak-skill remediation when weak skills are present', () => {
    const profile = { selectedRole: 'soc-analyst' };
    const videoProgressMap = {};
    const weakSkills = ['SOC Operations'];

    const recommendation = getAmanVideoRecommendations(profile, videoProgressMap, weakSkills);

    expect(recommendation).toBeDefined();
    expect(recommendation.primaryVideo).toBeDefined();
    expect(recommendation.categoryBadge).toBe('WEAK-SKILL REMEDIATION');
    expect(recommendation.reason).toContain('Targeting detected weak skill');
  });

  it('recommends resume video when a lesson is in progress', () => {
    const profile = { selectedRole: 'soc-analyst' };
    const videoProgressMap = {
      'vid-soc-01': {
        videoId: 'vid-soc-01',
        watchProgress: 55,
        completed: false,
        lastWatchedAt: new Date().toISOString()
      }
    };
    const weakSkills: string[] = [];

    const recommendation = getAmanVideoRecommendations(profile, videoProgressMap, weakSkills);

    expect(recommendation).toBeDefined();
    expect(recommendation.categoryBadge).toBe('RESUME IN PROGRESS');
    expect(recommendation.reason).toContain('halfway through');
  });

  it('searches videos effectively', () => {
    const results = searchVideos('SOC');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toContain('soc');
  });
});
