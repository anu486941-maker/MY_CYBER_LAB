import { UserProfile, CareerRoleId } from '../types';
import { SkillMasteryRecord, LearnerMistake } from '../types/intelligence';

export interface NextBestAction {
  id: string;
  targetName: string;
  activityType: 'LAB' | 'MISSION' | 'LESSON' | 'DRILL' | 'CTF' | 'REVIEW';
  title: string;
  category: string;
  reason: string;
  whyThis: string;
  whatYouWillLearn: string[];
  timeEstimate: string;
  xpReward: number;
  route: string;
  urgency: 'HIGH' | 'MEDIUM' | 'NORMAL';
  relatedSkillId?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SkillHealthSummary {
  overallHealthScore: number;
  topStrengths: { skillId: string; name: string; mastery: number; category: string }[];
  weakestSkills: { skillId: string; name: string; mastery: number; category: string; mistakeCount: number }[];
  recentlyImproved: { skillId: string; name: string; mastery: number; change: number }[];
  pendingReviewCount: number;
  retentionRecommendation: string;
}

/**
 * Adaptive Learning Engine for MY CYBER LAB
 * Analyzes skill telemetry, mistake history, assessment calibration,
 * and career goals to compute optimal personalized next steps.
 */
export class AdaptiveLearningService {
  
  /**
   * Computes the single highest-impact Next Best Action for the learner
   */
  static getNextBestAction(params: {
    profile: UserProfile;
    skillMasteries: SkillMasteryRecord[];
    mistakes: LearnerMistake[];
    completedMissions?: string[];
    labScores?: Record<string, number>;
  }): NextBestAction {
    const { profile, skillMasteries, mistakes } = params;
    const role = (profile.selectedRole || profile.targetRole || 'ethical-hacker') as CareerRoleId;
    const experience = profile.experience || 'beginner';

    // 1. Check for critical unresolved mistakes first (High Urgency)
    const pendingMistakes = mistakes.filter(m => !m.resolved);
    if (pendingMistakes.length > 0) {
      const topMistake = pendingMistakes[0];
      return {
        id: `remediate-${topMistake.id}`,
        targetName: topMistake.title,
        activityType: 'DRILL',
        title: `Remediate: ${topMistake.title}`,
        category: topMistake.category,
        reason: `You encountered ${topMistake.occurrences > 1 ? `${topMistake.occurrences} errors` : 'an error'} on ${topMistake.category}. Mastering this concept prevents recurring lab failure.`,
        whyThis: `Based on your recent mistake log: "${topMistake.whyItHappens}". Fixing this now will solidify your foundational comprehension.`,
        whatYouWillLearn: [
          topMistake.howToFixIt,
          'Underlying security mechanics and common pitfalls',
          'Accurate syntax and diagnostic validation techniques'
        ],
        timeEstimate: '5 mins',
        xpReward: 75,
        route: '/mistakes',
        urgency: 'HIGH',
        relatedSkillId: topMistake.relatedSkillId,
        difficulty: 'Beginner'
      };
    }

    // 2. Identify weakest skill with mastery below 60%
    const sortedWeakest = [...skillMasteries]
      .filter(s => !s.isLocked)
      .sort((a, b) => a.masteryPercentage - b.masteryPercentage);

    const lowestSkill = sortedWeakest[0];

    if (lowestSkill && lowestSkill.masteryPercentage < 60) {
      const isLinux = lowestSkill.category.toLowerCase().includes('linux');
      const isNet = lowestSkill.category.toLowerCase().includes('network');
      const isWeb = lowestSkill.category.toLowerCase().includes('web');

      let targetRoute = '/practice-hub';
      let targetName = `${lowestSkill.name} Lab`;
      if (isLinux) {
        targetRoute = '/linux-lab';
        targetName = 'Linux Permissions & Core Commands Lab';
      } else if (isNet) {
        targetRoute = '/networking-lab';
        targetName = 'Network Subnetting & Packet Analysis Lab';
      } else if (isWeb) {
        targetRoute = '/web-security-lab';
        targetName = 'Web App Vulnerability Analysis Lab';
      }

      return {
        id: `boost-${lowestSkill.skillId}`,
        targetName,
        activityType: 'LAB',
        title: `Strengthen ${lowestSkill.name}`,
        category: lowestSkill.category,
        reason: `Your current ${lowestSkill.name} mastery is at ${lowestSkill.masteryPercentage}%. Elevating this skill unlocks higher-tier career milestones.`,
        whyThis: `Your target role (${role.replace('-', ' ').toUpperCase()}) requires strong competency in ${lowestSkill.name}. Practice exercises reinforce practical execution.`,
        whatYouWillLearn: [
          `Hands-on terminal and analysis workflow for ${lowestSkill.name}`,
          'Real-world operational scenarios and common error patterns',
          'Defensive verification and security posture implications'
        ],
        timeEstimate: '20 mins',
        xpReward: 250,
        route: targetRoute,
        urgency: 'HIGH',
        relatedSkillId: lowestSkill.skillId,
        difficulty: lowestSkill.tier <= 1 ? 'Beginner' : 'Intermediate'
      };
    }

    // 3. Career Role-Driven Next Step
    if (role === 'soc-analyst' || role === 'dfir-analyst') {
      return {
        id: 'soc-incident-triage',
        targetName: 'Live SOC Alert Triage & Log Investigation',
        activityType: 'LAB',
        title: 'SOC Alert Triage & Event Correlation',
        category: 'SOC / Detection',
        reason: 'Analyzing suspicious authentication spikes and extracting IOCs is core to the SOC Analyst career pathway.',
        whyThis: 'Builds real-world log parsing intuition using simulated SIEM queries, auth.log timelines, and firewall telemetry.',
        whatYouWillLearn: [
          'Distinguish true positive brute-force patterns from benign noise',
          'Map adversary behavior to MITRE ATT&CK techniques',
          'Draft actionable incident containment recommendations'
        ],
        timeEstimate: '25 mins',
        xpReward: 300,
        route: '/labs',
        urgency: 'NORMAL',
        difficulty: 'Intermediate'
      };
    }

    if (role === 'pentester' || role === 'ctf-competitor') {
      return {
        id: 'ctf-arena-challenge',
        targetName: 'Target Enumeration & Service Exploitation',
        activityType: 'CTF',
        title: 'CTF Arena: Network Reconnaissance Challenge',
        category: 'Offensive Operations',
        reason: 'Sharpen your stealth port mapping, banner grabbing, and vulnerability correlation under realistic CTF constraints.',
        whyThis: 'Active hands-on CTF exercises train instinctual tool chaining and flag discovery under timed conditions.',
        whatYouWillLearn: [
          'Execute stealthy nmap scans and service version identification',
          'Locate misconfigurations in exposed internal HTTP/SSH services',
          'Extract and verify proof-of-concept system tokens'
        ],
        timeEstimate: '30 mins',
        xpReward: 350,
        route: '/ctf',
        urgency: 'NORMAL',
        difficulty: 'Intermediate'
      };
    }

    // Default Progressive Mission
    return {
      id: 'core-offensive-mission',
      targetName: 'Tactical Reconnaissance & Evidence Extraction',
      activityType: 'MISSION',
      title: 'Interactive Tactical Mission: Suspicious Service Audit',
      category: 'Security Operations',
      reason: 'Continue advancing along your primary learning roadmap by clearing scenario-driven objectives.',
      whyThis: 'Scenario-based missions simulate real engagement conditions, combining terminal execution with tactical analysis.',
      whatYouWillLearn: [
        'Structured methodology from intelligence gathering to debrief',
        'Command-line tooling and parameter precision',
        'Translating tactical findings into defensive remediations'
      ],
      timeEstimate: '20 mins',
      xpReward: 300,
      route: '/missions',
      urgency: 'NORMAL',
      difficulty: experience === 'beginner' ? 'Beginner' : 'Intermediate'
    };
  }

  /**
   * Generates a comprehensive Skill Health report
   */
  static getSkillHealthSummary(
    skillMasteries: SkillMasteryRecord[],
    mistakes: LearnerMistake[]
  ): SkillHealthSummary {
    if (!skillMasteries || skillMasteries.length === 0) {
      return {
        overallHealthScore: 75,
        topStrengths: [],
        weakestSkills: [],
        recentlyImproved: [],
        pendingReviewCount: mistakes.filter(m => !m.resolved).length,
        retentionRecommendation: 'Complete your first interactive lab to establish your skill baseline.'
      };
    }

    const sortedByMastery = [...skillMasteries].sort((a, b) => b.masteryPercentage - a.masteryPercentage);
    const avgMastery = Math.round(
      skillMasteries.reduce((acc, s) => acc + s.masteryPercentage, 0) / skillMasteries.length
    );

    const topStrengths = sortedByMastery.slice(0, 3).map(s => ({
      skillId: s.skillId,
      name: s.name,
      mastery: s.masteryPercentage,
      category: s.category
    }));

    const weakestSkills = [...sortedByMastery].reverse().slice(0, 3).map(s => {
      const mistakeCount = mistakes.filter(m => m.relatedSkillId === s.skillId && !m.resolved).length;
      return {
        skillId: s.skillId,
        name: s.name,
        mastery: s.masteryPercentage,
        category: s.category,
        mistakeCount
      };
    });

    const recentlyImproved = sortedByMastery
      .filter(s => s.practiceCompleted || s.labCompleted)
      .slice(0, 2)
      .map(s => ({
        skillId: s.skillId,
        name: s.name,
        mastery: s.masteryPercentage,
        change: +15
      }));

    const pendingMistakes = mistakes.filter(m => !m.resolved).length;

    let retentionRecommendation = 'All core skills are performing within target parameters.';
    if (pendingMistakes > 0) {
      retentionRecommendation = `You have ${pendingMistakes} recorded conceptual flaw${pendingMistakes > 1 ? 's' : ''} in your Mistake Journal. Review before next lab.`;
    } else if (weakestSkills[0]?.mastery < 50) {
      retentionRecommendation = `Focus practice on ${weakestSkills[0].name} (${weakestSkills[0].mastery}% mastery) to balance your profile.`;
    }

    return {
      overallHealthScore: avgMastery,
      topStrengths,
      weakestSkills,
      recentlyImproved,
      pendingReviewCount: pendingMistakes,
      retentionRecommendation
    };
  }
}
