/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/mastery/RangeMasteryBridge.ts
 * Purpose: Bridges Cyber Range Telemetry & Evidence into AMAN 3.0 Knowledge Graph & Mastery State
 */

import { AmanLearningBrain, LearnerProfile, LearnerSkillState } from '../../aman/amanLearningBrain';
import { CyberRangeSession } from '../types';
import { MissionRegistry } from '../missions/MissionRegistry';
import { MachineRegistry } from '../machines/MachineRegistry';

export class RangeMasteryBridge {
  /**
   * Applies validated mission results to update the learner's AMAN Knowledge Graph mastery states.
   */
  public static recordMissionCompletion(
    profile: LearnerProfile,
    session: CyberRangeSession
  ): { updatedProfile: LearnerProfile; promotedSkills: string[]; masterySummary: string } {
    const mission = MissionRegistry.getMissionById(session.missionId);
    if (!mission) {
      return { updatedProfile: profile, promotedSkills: [], masterySummary: 'Mission not found.' };
    }

    const promotedSkills: string[] = [];
    const updatedSkills: Record<string, LearnerSkillState> = { ...profile.skills };

    // For each tested skill in the mission's target machines
    for (const machineId of mission.targetMachines) {
      const machine = MachineRegistry.getMachineById(machineId);
      if (!machine) continue;

      for (const skillId of machine.requiredSkills) {
        const existingSkill = updatedSkills[skillId] || {
          skillId,
          level: 'UNKNOWN',
          quizScoreAvg: 0,
          practicalAttempts: 0,
          lastPracticed: new Date().toISOString(),
          identifiedMistakes: []
        };
        const isCompletedAllObjectives = session.completedObjectiveIds.length >= mission.objectives.length;
        const quizScore = isCompletedAllObjectives ? 95 : 75;
        const highestHintUsed = session.hintsUsedCount > 3 ? 3 : session.hintsUsedCount;

        const evaluatedState = AmanLearningBrain.evaluateSkillMastery(
          existingSkill,
          quizScore,
          isCompletedAllObjectives,
          highestHintUsed
        );

        updatedSkills[skillId] = evaluatedState;

        if (evaluatedState.level === 'COMPETENT' || evaluatedState.level === 'MASTERED') {
          promotedSkills.push(skillId);
        }
      }
    }

    const updatedProfile: LearnerProfile = {
      ...profile,
      skills: updatedSkills
    };

    return {
      updatedProfile,
      promotedSkills,
      masterySummary: `AMAN Knowledge Graph updated. ${promotedSkills.length} skill(s) advanced based on practical lab evidence.`
    };
  }
}
