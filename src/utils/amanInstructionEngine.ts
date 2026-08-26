import { LearnerPosition, NextMoveRecommendation } from './learningPositionEngine';
import { UserProfile } from '../types';
import { CyberLabTask } from '../types/cyberLabModuleTypes';

export type AmanEvent = 
  | 'login'
  | 'role_selection'
  | 'onboarding_complete'
  | 'path_start'
  | 'module_start'
  | 'lesson_complete'
  | 'lab_start'
  | 'lab_task_complete'
  | 'lab_failure'
  | 'lab_success'
  | 'skill_mastered'
  | 'quiz_complete'
  | 'major_assessment'
  | 'repeated_mistake'
  | 'remediation_complete'
  | 'mission_start'
  | 'mission_complete'
  | 'boss_start'
  | 'boss_complete'
  | 'capstone_start'
  | 'capstone_complete'
  | 'path_complete'
  | 'roadmap_change'
  | 'learner_return'
  | 'session_start'
  | 'session_end';

export type AmanCoachingLevel = 1 | 2 | 3 | 4 | 5;

export interface AmanCoachingLevelInfo {
  level: AmanCoachingLevel;
  name: 'Direct Guidance' | 'Guided Hint' | 'Socratic Question' | 'Minimal Guidance' | 'Independent';
  description: string;
}

export function calculateCoachingLevel(
  masteryPercentage: number,
  attemptsCount: number = 1,
  pendingMistakesCount: number = 0,
  trainingMode: 'Coach' | 'Direct' | 'Exam' = 'Coach'
): AmanCoachingLevelInfo {
  if (trainingMode === 'Exam') {
    return {
      level: 5,
      name: 'Independent',
      description: 'Exam Mode active: Zero hints or solutions provided. Strict assessment.'
    };
  }

  if (trainingMode === 'Direct') {
    return {
      level: 1,
      name: 'Direct Guidance',
      description: 'Direct Mode active: Step-by-step commands and solutions provided immediately.'
    };
  }

  if (attemptsCount >= 3 || pendingMistakesCount >= 3 || masteryPercentage < 40) {
    return {
      level: 1,
      name: 'Direct Guidance',
      description: 'Step-by-step instructions provided due to repeated struggle or low mastery.'
    };
  }
  if (attemptsCount === 2 || pendingMistakesCount > 0 || masteryPercentage < 65) {
    return {
      level: 2,
      name: 'Guided Hint',
      description: 'Directional hint and syntax guidance provided to lead you to the solution.'
    };
  }
  if (masteryPercentage < 80) {
    return {
      level: 3,
      name: 'Socratic Question',
      description: 'Probing questions asked to encourage analytical problem solving.'
    };
  }
  if (masteryPercentage < 90) {
    return {
      level: 4,
      name: 'Minimal Guidance',
      description: 'Minimal feedback provided. Rely on diagnostic logs and terminal outputs.'
    };
  }

  return {
    level: 5,
    name: 'Independent',
    description: 'High mastery achieved. Complete activities fully independently.'
  };
}

export interface EscalatedHint {
  level: number;
  label: string;
  concept: string;
  direction: string;
  guidance: string;
  explanation: string;
}

export interface AmanInstruction {
  event: AmanEvent;
  title: string;
  whatToDo: string;
  why: string;
  howToStart: string;
  expectedTime: string;
  whatHappensNext: string;
  spokenText: string;
  hinglishSpokenText: string;
  primaryActionLabel: string;
  primaryActionRoute: string;
  taskIndex?: number;
  totalTasks?: number;
  coachingLevel?: AmanCoachingLevelInfo;
  escalatedHint?: EscalatedHint;
}

export interface VoiceCommandResult {
  matched: boolean;
  commandType: 
    | 'next'
    | 'what_next'
    | 'start_next'
    | 'repeat'
    | 'hint'
    | 'explain'
    | 'start'
    | 'roadmap'
    | 'where_am_i'
    | 'what_am_i_doing'
    | 'why'
    | 'test_me'
    | 'stop'
    | 'start_today_plan'
    | 'next_lab';
  spokenResponse: string;
  actionRoute?: string;
}

/**
 * Generates an exact, deterministic AMAN Instruction object grounded in real state.
 */
export function generateAmanInstruction(
  event: AmanEvent,
  position: LearnerPosition,
  nextMove: NextMoveRecommendation,
  profile: UserProfile,
  extraContext?: {
    moduleTitle?: string;
    taskTitle?: string;
    taskIndex?: number;
    totalTasks?: number;
    attempts?: number;
    mistakeTitle?: string;
    missionTitle?: string;
  }
): AmanInstruction {
  const isHinglish = profile.language === 'Hinglish' || profile.language === 'Hindi';
  const roleName = position.careerPath;
  const currentCourse = position.currentCourse;
  const currentModule = position.currentModule;

  switch (event) {
    case 'login':
    case 'session_start':
    case 'learner_return': {
      return {
        event,
        title: `Welcome back, ${profile.codename || 'Operator'}!`,
        whatToDo: `Resume your ${roleName} journey at ${currentCourse} → ${currentModule}.`,
        why: nextMove.whyDescription,
        howToStart: `Click [ ${nextMove.title} ] to jump directly into your active module.`,
        expectedTime: nextMove.timeEstimate,
        whatHappensNext: `Complete this activity to raise your role readiness towards Level ${position.cyberLevel + 1}.`,
        spokenText: `Welcome back, ${profile.codename || 'Operator'}. You are currently at ${currentCourse}, studying ${currentModule}. Your next task is ${nextMove.title}. Estimated time is ${nextMove.timeEstimate}. Let's begin.`,
        hinglishSpokenText: `Welcome back ${profile.codename || 'Operator'}! Aap abhi ${currentCourse} mein ${currentModule} par hain. Aapka agla step hai: ${nextMove.title}. Isme lagbhag ${nextMove.timeEstimate} lagenge. Main aapko guide karunga.`,
        primaryActionLabel: `START NOW: ${nextMove.title}`,
        primaryActionRoute: nextMove.stepLink
      };
    }

    case 'role_selection': {
      return {
        event,
        title: `Target Role Locked: ${roleName}`,
        whatToDo: `Review your updated roadmap tailored specifically for ${roleName}.`,
        why: `Aligns your curriculum, practical labs, and missions directly with job requirements.`,
        howToStart: `Click [ START PATH ] to open your initial foundational module.`,
        expectedTime: `15 minutes`,
        whatHappensNext: `Complete your baseline assessment and first hands-on terminal exercise.`,
        spokenText: `Target role locked as ${roleName}. I have adjusted your curriculum, practical labs, and capstones specifically for this path. Let's start with your first module.`,
        hinglishSpokenText: `Target role ${roleName} lock ho gaya hai! Maine aapka curriculum aur practical labs is role ke according configure kar diye hain. Pehla step start kijiye.`,
        primaryActionLabel: `START PATH: ${currentCourse}`,
        primaryActionRoute: nextMove.stepLink
      };
    }

    case 'module_start':
    case 'lab_start': {
      const modName = extraContext?.moduleTitle || currentModule;
      return {
        event,
        title: `Launching Module: ${modName}`,
        whatToDo: `Read the task objectives, open the sandbox terminal, and execute diagnostic commands.`,
        why: `Practical execution builds muscle memory and prepares you for real incident investigations.`,
        howToStart: `Inspect the briefing file in the terminal or type "help" for available commands.`,
        expectedTime: `20 minutes`,
        whatHappensNext: `Pass all tasks in this module to unlock the end-of-module assessment quiz.`,
        spokenText: `Starting module ${modName}. Read the objectives carefully, execute diagnostic commands in the safe sandbox, and verify your output. I am here to assist if you get stuck.`,
        hinglishSpokenText: `Module ${modName} start ho raha hai. Sabse pehle terminal mein objective dekhein, diagnostic commands run karein. Koi doubt ho toh bejhijhak poochiye!`,
        primaryActionLabel: `BEGIN LAB TASKS`,
        primaryActionRoute: nextMove.stepLink
      };
    }

    case 'lab_task_complete': {
      const idx = (extraContext?.taskIndex ?? 0) + 1;
      const total = extraContext?.totalTasks ?? 4;
      return {
        event,
        title: `Task ${idx} Verified!`,
        whatToDo: `Proceed to Task ${Math.min(idx + 1, total)}: ${extraContext?.taskTitle || 'Next Objective'}.`,
        why: `Successful verification confirmed your understanding of security telemetry.`,
        howToStart: `Read the prompt for Task ${Math.min(idx + 1, total)} and execute the required command.`,
        expectedTime: `3 minutes`,
        whatHappensNext: `Complete all ${total} tasks to finish the practical component.`,
        spokenText: `Task ${idx} verified successfully! Great work. Let's move on to Task ${Math.min(idx + 1, total)}.`,
        hinglishSpokenText: `Shabash! Task ${idx} verify ho gaya hai. Ab aage badhte hain Task ${Math.min(idx + 1, total)} par!`,
        primaryActionLabel: `PROCEED TO TASK ${Math.min(idx + 1, total)}`,
        primaryActionRoute: nextMove.stepLink,
        taskIndex: idx,
        totalTasks: total
      };
    }

    case 'lab_failure':
    case 'repeated_mistake': {
      const attempts = extraContext?.attempts || 2;
      return {
        event,
        title: `Task Check Failed (Attempt ${attempts})`,
        whatToDo: `Re-examine your terminal output or request an escalated conceptual hint.`,
        why: `Mistakes highlight exact knowledge gaps. Addressing them now prevents issues in future missions.`,
        howToStart: `Review the syntax, check spacing, or click [ REQUEST HINT ].`,
        expectedTime: `2 minutes`,
        whatHappensNext: `Once corrected, your task status will turn green and award XP.`,
        spokenText: `The task output did not match expected telemetry. Don't worry. Check your syntax and spacing, or ask me for a hint.`,
        hinglishSpokenText: `Output match nahi hua. Koi baat nahi! Syntax aur commands dubara check karein, ya phir mujhse hint maang sakte hain.`,
        primaryActionLabel: `TRY AGAIN / GET HINT`,
        primaryActionRoute: nextMove.stepLink,
        taskIndex: extraContext?.taskIndex,
        totalTasks: extraContext?.totalTasks
      };
    }

    case 'lab_success':
    case 'remediation_complete': {
      return {
        event,
        title: `Module Completed Successfully!`,
        whatToDo: `Claim your XP reward and advance to ${nextMove.title}.`,
        why: `You have demonstrated practical competence and resolved any pending weaknesses.`,
        howToStart: `Click [ START NEXT ] to open your next curriculum milestone.`,
        expectedTime: `15 minutes`,
        whatHappensNext: `Your roadmap will update and your overall role readiness will increase.`,
        spokenText: `Outstanding job! You have successfully completed this module. I have updated your skill metrics and cleared any weak points. Ready for the next challenge?`,
        hinglishSpokenText: `Bahut badiya! Module complete ho gaya hai. Aapke skill scores upgrade ho gaye hain. Chaliye agle challenge par chalte hain!`,
        primaryActionLabel: `CONTINUE: ${nextMove.title}`,
        primaryActionRoute: nextMove.stepLink
      };
    }

    case 'mission_start': {
      const mTitle = extraContext?.missionTitle || 'Tactical Mission';
      return {
        event,
        title: `Tactical Mission Active: ${mTitle}`,
        whatToDo: `Analyze incident logs, correlate IOCs, and submit the objective flag.`,
        why: `Missions combine multiple skills into realistic incident response scenarios.`,
        howToStart: `Review the scenario briefing and inspect the provided evidence artifacts.`,
        expectedTime: `20 minutes`,
        whatHappensNext: `Solving this mission awards +200 XP and unlocks the path Boss Challenge.`,
        spokenText: `Tactical mission ${mTitle} is now active. Correlate the incident telemetry and identify the root cause. Minimal guidance will be provided for this mission.`,
        hinglishSpokenText: `Tactical mission ${mTitle} start ho gaya hai. Evidence analyze karke correct flag find karein. Best of luck!`,
        primaryActionLabel: `START INVESTIGATION`,
        primaryActionRoute: '/missions'
      };
    }

    case 'boss_start': {
      return {
        event,
        title: `Boss Evaluation Initiated!`,
        whatToDo: `Independently investigate and mitigate the incident without direct step-by-step guidance.`,
        why: `Boss challenges evaluate whether you can operate as an independent cybersecurity analyst.`,
        howToStart: `Open the Master Cyber Range or Boss Arena and start your investigation.`,
        expectedTime: `25 minutes`,
        whatHappensNext: `Passing the Boss Challenge grants high-tier achievements and capstone eligibility.`,
        spokenText: `Boss evaluation initiated. I will reduce step-by-step guidance now. Use your analytical reasoning to resolve the incident independently.`,
        hinglishSpokenText: `Boss evaluation start ho chuka hai. Is baar main step-by-step hints nahi dunga. Apni investigative skills se incident resolve karein!`,
        primaryActionLabel: `ENTER BOSS ARENA`,
        primaryActionRoute: '/master-cyber-range'
      };
    }

    case 'capstone_start':
    case 'path_complete': {
      return {
        event,
        title: `Career Capstone Reached: ${roleName}`,
        whatToDo: `Execute the final capstone scenario and generate your formal security report.`,
        why: `Validates full job-readiness for ${roleName}.`,
        howToStart: `Open the Capstone Assessment portal and follow the formal scope guidelines.`,
        expectedTime: `30 minutes`,
        whatHappensNext: `Issues your verified cryptographic certificate and detailed Career Readiness Report.`,
        spokenText: `Congratulations on reaching the final capstone for ${roleName}! Complete this final evaluation to receive your verified career certificate.`,
        hinglishSpokenText: `Badhai ho! Aap ${roleName} ke final Capstone tak pahunch gaye hain. Is incident ko complete karke apna verified certificate claim karein!`,
        primaryActionLabel: `GENERATE CERTIFICATE & REPORT`,
        primaryActionRoute: '/certificate'
      };
    }

    default: {
      return {
        event,
        title: `AMAN Next Move: ${nextMove.title}`,
        whatToDo: nextMove.whyDescription,
        why: isHinglish ? nextMove.hinglishWhy : nextMove.whyDescription,
        howToStart: `Click [ START NOW ] to launch your recommended activity.`,
        expectedTime: nextMove.timeEstimate,
        whatHappensNext: `Advances your learning path towards target role readiness.`,
        spokenText: `Your next recommended step is ${nextMove.title}. Estimated time is ${nextMove.timeEstimate}. ${nextMove.whyDescription}`,
        hinglishSpokenText: `Aapka agla target hai: ${nextMove.title}. Isme lagbhag ${nextMove.timeEstimate} lagenge. ${nextMove.hinglishWhy}`,
        primaryActionLabel: `START NOW`,
        primaryActionRoute: nextMove.stepLink
      };
    }
  }
}

/**
 * Returns escalated hints based on the attempt count.
 */
export function getEscalatedHint(task: CyberLabTask, attemptCount: number): EscalatedHint {
  const level = Math.min(attemptCount, 4);

  return {
    level,
    label: level === 1 ? 'LEVEL 1: CONCEPT' : level === 2 ? 'LEVEL 2: DIRECTION' : level === 3 ? 'LEVEL 3: GUIDANCE' : 'LEVEL 4: FULL EXPLANATION',
    concept: task.hint1_concept || 'Understand the core security principle behind this task.',
    direction: task.hint2_direction || 'Focus on running diagnostic commands to gather evidence.',
    guidance: task.hint3_specific || 'Match your output with expected telemetry keyword.',
    explanation: task.finalExplanation || 'Review the theory tab for step-by-step verification.'
  };
}

/**
 * Parses a spoken voice command string and returns appropriate action.
 */
export function parseVoiceCommand(transcript: string): VoiceCommandResult {
  const lower = transcript.toLowerCase().trim();

  if (lower.includes('today') || lower.includes('plan')) {
    return {
      matched: true,
      commandType: 'start_today_plan',
      spokenResponse: "Launching today's personalized adaptive study plan.",
      actionRoute: '/ai-study-plan'
    };
  }

  if (lower.includes('lab') || lower.includes('practice lab')) {
    return {
      matched: true,
      commandType: 'next_lab',
      spokenResponse: 'Opening your next hands-on cyber lab module.',
      actionRoute: '/modules'
    };
  }

  if (lower.includes('start next') || lower.includes('agla step') || lower.includes('start step')) {
    return {
      matched: true,
      commandType: 'start_next',
      spokenResponse: 'Starting your next recommended activity now.'
    };
  }

  if (lower.includes('what next') || lower.includes('next kya') || lower.includes('kya karna hai')) {
    return {
      matched: true,
      commandType: 'what_next',
      spokenResponse: 'Checking your next authoritative learning action.'
    };
  }

  if (lower.includes('next') || lower.includes('aage') || lower.includes('continue') || lower.includes('agla')) {
    return {
      matched: true,
      commandType: 'next',
      spokenResponse: 'Proceeding to the next step.'
    };
  }

  if (lower.includes('repeat') || lower.includes('firse') || lower.includes('dobara') || lower.includes('again')) {
    return {
      matched: true,
      commandType: 'repeat',
      spokenResponse: 'Repeating last instruction.'
    };
  }

  if (lower.includes('hint') || lower.includes('clue') || lower.includes('madad') || lower.includes('help')) {
    return {
      matched: true,
      commandType: 'hint',
      spokenResponse: 'Here is a conceptual hint to guide you.'
    };
  }

  if (lower.includes('explain') || lower.includes('detail') || lower.includes('samjhaao')) {
    return {
      matched: true,
      commandType: 'explain',
      spokenResponse: 'Let me explain the underlying technical mechanism.'
    };
  }

  if (lower.includes('where am i') || lower.includes('kahan hoon') || lower.includes('position')) {
    return {
      matched: true,
      commandType: 'where_am_i',
      spokenResponse: 'Opening your current position map.',
      actionRoute: '/where-am-i'
    };
  }

  if (lower.includes('roadmap') || lower.includes('map')) {
    return {
      matched: true,
      commandType: 'roadmap',
      spokenResponse: 'Opening your personalized dynamic roadmap.',
      actionRoute: '/roadmap'
    };
  }

  if (lower.includes('why') || lower.includes('kyun')) {
    return {
      matched: true,
      commandType: 'why',
      spokenResponse: 'Here is the educational evidence behind this recommendation.'
    };
  }

  if (lower.includes('start') || lower.includes('shuru') || lower.includes('begin')) {
    return {
      matched: true,
      commandType: 'start',
      spokenResponse: 'Starting active learning task now.'
    };
  }

  if (lower.includes('stop') || lower.includes('pause') || lower.includes('ruk') || lower.includes('shant')) {
    return {
      matched: true,
      commandType: 'stop',
      spokenResponse: 'Pausing instruction.'
    };
  }

  return {
    matched: false,
    commandType: 'what_am_i_doing',
    spokenResponse: 'I did not recognize that command. You can say: Where am I, What next, Start next, Open my roadmap, Give me a hint, Explain this, Repeat, Start today\'s plan, or Take me to the next lab.'
  };
}
