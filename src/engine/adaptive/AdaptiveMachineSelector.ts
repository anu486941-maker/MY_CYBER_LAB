/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/adaptive/AdaptiveMachineSelector.ts
 * Purpose: Dynamically Selects the Next Best Machine / Mission based on Learner Skill Matrix & Weaknesses
 */

import { LearnerProfile, AmanLearningBrain } from '../../aman/amanLearningBrain';
import { CyberMachine, CyberMission } from '../types';
import { MachineRegistry } from '../machines/MachineRegistry';
import { MissionRegistry } from '../missions/MissionRegistry';

export interface RecommendedMachineResult {
  machine: CyberMachine;
  mission: CyberMission;
  reason: string;
  focusSkills: string[];
  estimatedDifficulty: string;
}

export class AdaptiveMachineSelector {
  /**
   * Evaluates learner profile to determine the optimal next machine to tackle.
   */
  public static selectNextMachine(profile: LearnerProfile): RecommendedMachineResult {
    const allMissions = MissionRegistry.getAllMissions();
    const allMachines = MachineRegistry.getAllMachines();

    // 1. Identify critical gaps from career gap report
    const gapReport = AmanLearningBrain.generateCareerGapReport(profile);
    const criticalSkill = gapReport.criticalGaps[0] || gapReport.nearReadySkills[0] || 'c1_linux_fs_perms';

    // 2. Find a mission targeting the critical missing skill
    const matchedMission = allMissions.find(m => {
      const targetMachine = MachineRegistry.getMachineById(m.targetMachines[0]);
      return targetMachine && (targetMachine.requiredSkills.includes(criticalSkill) || targetMachine.recommendedPrerequisites.includes(criticalSkill));
    }) || allMissions[0];

    const matchedMachine = MachineRegistry.getMachineById(matchedMission.targetMachines[0]) || allMachines[0];

    return {
      machine: matchedMachine,
      mission: matchedMission,
      reason: `Targeting identified skill gap in "${criticalSkill}" to progress toward your ${gapReport.careerTitle} career milestone.`,
      focusSkills: matchedMachine.requiredSkills,
      estimatedDifficulty: matchedMachine.difficulty
    };
  }
}
