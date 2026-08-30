import { UserProfile } from '../types';
import { hasFeature, FeatureId } from './entitlements';

export type ControlledAmanActionType =
  | 'OPEN_DASHBOARD'
  | 'OPEN_ROADMAP'
  | 'OPEN_LEARNING_PATH'
  | 'OPEN_MODULE'
  | 'OPEN_LESSON'
  | 'OPEN_LAB'
  | 'OPEN_MISSION'
  | 'OPEN_CTF'
  | 'OPEN_NETWORK_LAB'
  | 'OPEN_LINUX_LAB'
  | 'OPEN_WEB_SECURITY_LAB'
  | 'OPEN_SOC_SIMULATOR'
  | 'OPEN_THREAT_HUNTING'
  | 'OPEN_ACE'
  | 'OPEN_SKILL_TREE'
  | 'OPEN_ACHIEVEMENTS'
  | 'OPEN_NOTEBOOK'
  | 'OPEN_CERTIFICATE'
  | 'SHOW_PROGRESS'
  | 'SHOW_READINESS'
  | 'START_NEXT_LESSON'
  | 'START_NEXT_MISSION'
  | 'START_TODAY_PLAN'
  | 'RESUME_LEARNING'
  | 'SWITCH_MODE'
  | 'NAVIGATE';

export interface AmanAction {
  type: ControlledAmanActionType;
  targetRoute: string;
  label: string;
  requiredFeature?: FeatureId;
  isLocked?: boolean;
  parameter?: string;
}

export interface ParsedAmanResponse {
  cleanText: string;
  actions: AmanAction[];
  lockedNotice?: string;
}

// Allowed route whitelist for safety
export const AMAN_ALLOWED_ROUTES: Record<string, string> = {
  OPEN_DASHBOARD: '/dashboard',
  OPEN_ROADMAP: '/roadmap',
  OPEN_LEARNING_PATH: '/learning-path',
  OPEN_MODULE: '/modules',
  OPEN_LESSON: '/modules',
  OPEN_LAB: '/modules',
  OPEN_MISSION: '/missions',
  OPEN_CTF: '/ctf-arena',
  OPEN_NETWORK_LAB: '/network-lab',
  OPEN_LINUX_LAB: '/linux-lab',
  OPEN_WEB_SECURITY_LAB: '/practice/web-security',
  OPEN_SOC_SIMULATOR: '/practice/soc-simulator',
  OPEN_THREAT_HUNTING: '/practice/threat-hunting',
  OPEN_ACE: '/ace',
  OPEN_SKILL_TREE: '/skill-tree',
  OPEN_ACHIEVEMENTS: '/achievements',
  OPEN_NOTEBOOK: '/notebook',
  OPEN_CERTIFICATE: '/certificate',
  SHOW_PROGRESS: '/analytics',
  SHOW_READINESS: '/career-roles',
  START_NEXT_LESSON: '/modules',
  START_NEXT_MISSION: '/missions',
  START_TODAY_PLAN: '/ai-study-plan',
  RESUME_LEARNING: '/dashboard',
};

// Route feature mapping for entitlement checks
export const ROUTE_FEATURE_MAP: Record<string, FeatureId> = {
  '/missions': 'ADVANCED_MISSIONS',
  '/ctf-arena': 'ADVANCED_CTF',
  '/ace': 'CLIENT_ENGAGEMENTS',
  '/practice/soc-simulator': 'ADVANCED_LABS',
  '/practice/threat-hunting': 'ADVANCED_LABS',
};

/**
 * Extracts controlled action tags from AMAN's text responses.
 * Supported syntax: [ACTION:OPEN_ROADMAP], [ACTION:NAVIGATE:/modules], [ACTION:SWITCH_MODE:DEBATE]
 */
export function parseAmanActions(text: string, userProfile?: UserProfile | null): ParsedAmanResponse {
  if (!text) return { cleanText: '', actions: [] };

  const actionRegex = /\[ACTION:([A-Z_]+):?([^\]]*)\]/g;
  const actions: AmanAction[] = [];
  let lockedNotice: string | undefined = undefined;

  let match;
  while ((match = actionRegex.exec(text)) !== null) {
    const rawType = match[1];
    const parameter = match[2] ? match[2].trim() : '';

    let actionType: ControlledAmanActionType = 'NAVIGATE';
    let targetRoute = '/dashboard';
    let label = 'Execute Action';

    if (rawType in AMAN_ALLOWED_ROUTES) {
      actionType = rawType as ControlledAmanActionType;
      targetRoute = AMAN_ALLOWED_ROUTES[rawType];
      label = getLabelForActionType(actionType, parameter);
    } else if (rawType === 'NAVIGATE') {
      // Validate provided route against known routes or prefix
      const sanitized = parameter.startsWith('/') ? parameter : `/${parameter}`;
      targetRoute = sanitizeRoute(sanitized);
      label = `Go to ${targetRoute}`;
    } else if (rawType === 'SWITCH_MODE') {
      actionType = 'SWITCH_MODE';
      targetRoute = parameter;
      label = `Switch to ${parameter} Mode`;
    }

    // Entitlement validation
    const requiredFeature = ROUTE_FEATURE_MAP[targetRoute];
    const isLocked = requiredFeature ? !hasFeature(userProfile, requiredFeature) : false;

    if (isLocked) {
      lockedNotice = "That module is currently available to Pro learners. You can continue with the available training missions.";
    }

    actions.push({
      type: actionType,
      targetRoute,
      label,
      requiredFeature,
      isLocked,
      parameter: parameter || undefined,
    });
  }

  const cleanText = text.replace(actionRegex, '').trim();

  return { cleanText, actions, lockedNotice };
}

function getLabelForActionType(type: ControlledAmanActionType, param?: string): string {
  switch (type) {
    case 'OPEN_DASHBOARD': return '📊 Open Command Dashboard';
    case 'OPEN_ROADMAP': return '🗺️ View Adaptive Roadmap';
    case 'OPEN_LEARNING_PATH': return '🎓 Open Learning Path';
    case 'OPEN_MODULE':
    case 'OPEN_LESSON':
    case 'OPEN_LAB': return '🚀 Open Cyber Lab Modules';
    case 'OPEN_MISSION': return '🎯 Open Tactical Missions';
    case 'OPEN_CTF': return '🏆 Launch CTF Arena';
    case 'OPEN_NETWORK_LAB': return '🔬 Launch Network Lab';
    case 'OPEN_LINUX_LAB': return '🐧 Launch Linux Lab';
    case 'OPEN_WEB_SECURITY_LAB': return '🌐 Open Web Security Lab';
    case 'OPEN_SOC_SIMULATOR': return '🛡️ Launch SOC Simulator';
    case 'OPEN_THREAT_HUNTING': return '🕵️ Launch Threat Hunting Range';
    case 'OPEN_ACE': return '⚖️ Open Authorized Engagement';
    case 'OPEN_SKILL_TREE': return '🌲 View Cyber Skill Tree';
    case 'OPEN_ACHIEVEMENTS': return '🏅 View Achievements';
    case 'OPEN_NOTEBOOK': return '📓 Open Tactical Notebook';
    case 'OPEN_CERTIFICATE': return '📜 View Verified Certificates';
    case 'SHOW_PROGRESS': return '📈 View Learning Analytics';
    case 'SHOW_READINESS': return '💼 View Career Role Readiness';
    case 'START_NEXT_LESSON': return '▶️ Launch Next Lesson';
    case 'START_NEXT_MISSION': return '🎯 Launch Next Mission';
    case 'START_TODAY_PLAN': return '⚡ Start Today\'s Study Plan';
    case 'RESUME_LEARNING': return '🔄 Continue Saved Learning Position';
    default: return param ? `Execute ${param}` : 'Execute Action';
  }
}

/**
 * Ensures AMAN route execution never navigates to arbitrary unsafe paths
 */
function sanitizeRoute(route: string): string {
  const allowedPrefixes = [
    '/dashboard', '/roles', '/career-roles', '/roadmap', '/modules', '/learn',
    '/learning-path', '/practice', '/rooms', '/tryhackme', '/missions',
    '/network-lab', '/linux-lab', '/cyber-range', '/ctf-arena', '/ai-mentor',
    '/ai-study-plan', '/skill-tree', '/achievements', '/notebook', '/certificate',
    '/verify-certificate', '/visualizer', '/portfolio', '/security-report',
    '/ace', '/cheat-sheets', '/instructor', '/rewards', '/mistakes', '/multi-tool',
    '/analytics', '/exam-mode', '/settings'
  ];

  const matched = allowedPrefixes.find(prefix => route.startsWith(prefix));
  return matched ? route : '/dashboard';
}

/**
 * Safely resolves content destinations and returns fallback routes if content is missing or invalid
 */
export function resolveContentDestination(requestedId?: string): { validRoute: string; exists: boolean; fallbackMessage?: string } {
  if (!requestedId) {
    return { validRoute: '/modules', exists: true };
  }
  
  const knownModuleIds = [
    'module-01-intro-cyber',
    'module-02-networking',
    'module-03-linux',
    'module-04-web-security',
    'module-05-offensive',
    'module-06-defensive-soc',
    'module-07-crypto',
    'module-08-capstone',
    'linux-fundamentals',
    'networking-fundamentals'
  ];
  
  const lowerReq = requestedId.toLowerCase().trim();
  const matchesKnown = knownModuleIds.some(id => 
    id === lowerReq || id.includes(lowerReq) || lowerReq.includes('linux') || lowerReq.includes('networking')
  );

  if (matchesKnown) {
    return { validRoute: `/modules`, exists: true };
  }

  return {
    validRoute: '/modules',
    exists: false,
    fallbackMessage: "That lesson isn't available yet. I'll open the Linux learning path instead."
  };
}

export function canonicalRoleToId(role?: string): string {
  if (!role) return 'ethical-hacker';
  return role.toLowerCase().replace(/_/g, '-');
}

/**
 * Categorizes learner intent into structured classifications:
 * CONVERSATION, CAREER_LEARNING_INTENT, CAREER_ROADMAP, RESUME_CAREER_PATH,
 * MODULE_INTENT, COMMAND_COACH, etc.
 *
 * Strictly follows the priority matrix:
 * PRIORITY 1 — CASUAL CONVERSATION
 * PRIORITY 2 — EXPLICIT USER COMMAND
 * PRIORITY 3 — CAREER INTENT & SWITCH
 * PRIORITY 4 — LEARNING INTENT & QUERY
 * PRIORITY 5 — ROOM/MODULE CONTEXT & MISSION
 * PRIORITY 6 — GENERAL CYBERSECURITY QUESTION
 */
export function detectAmanIntent(
  text: string,
  userProfile?: UserProfile | null
): {
  intent: 
    | 'CONVERSATION'
    | 'CAREER_LEARNING_INTENT'
    | 'CAREER_ROADMAP'
    | 'RESUME_CAREER_PATH'
    | 'MODULE_INTENT'
    | 'COMMAND_COACH'
    | 'SYSTEM_INTENT'
    | 'CAREER_SWITCH'
    | 'LEARNING_QUERY'
    | 'ROOM_QUERY'
    | 'MISSION_INTENT'
    | 'LANGUAGE_PREFERENCE'
    | 'GENERAL_QUERY';
  canonicalRole?: string;
  action?: AmanAction;
  directPrompt?: string;
  fallback?: boolean;
  fallbackMessage?: string;
  useRoomContext?: boolean;
  useCareerContext?: boolean;
  useLearningContext?: boolean;
  useProgressContext?: boolean;
  useTechnicalContext?: boolean;
} {
  const lower = text.toLowerCase().trim();
  const cleanLower = lower.replace(/[?!.,;:]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. PRIORITY 1 — CASUAL CONVERSATION (Detect first to prevent context hijacking)
  const isGreeting = 
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower === 'hey aman' ||
    lower === 'hello aman' ||
    lower === 'hi aman' ||
    cleanLower === 'hello aman how are you' ||
    cleanLower === 'hi aman how are you' ||
    cleanLower === 'hey aman how are you' ||
    /^(hello|hi|hey|greetings|yo|hola)(\s+aman)?(\s+how\s+(are\s+you|r\s+u))?$/i.test(cleanLower) ||
    lower === 'hiii' ||
    lower === 'hy' ||
    lower === 'hyy' ||
    lower === 'yo' ||
    lower === 'hola' ||
    lower === 'greetings' ||
    lower === 'greetings aman';

  const isHinglishGreeting =
    lower === 'kya haal hai' ||
    lower === 'kya haal hai?' ||
    lower === 'kaisa hai' ||
    lower === 'kaisa ho' ||
    lower === 'kaise ho' ||
    lower === 'kaise ho?' ||
    lower === 'tu kaisa hai' ||
    lower === 'tu kaisa hai?' ||
    lower === 'kya haal' ||
    lower === 'kya haal?' ||
    lower === 'sab badhiya' ||
    lower === 'sab badhiya?' ||
    lower === 'kaise ho aman' ||
    lower === 'kya haal hai aman' ||
    lower === 'kya chal raha hai' ||
    lower === 'kya chal raha hai?' ||
    lower === 'kya chal rha h' ||
    lower === 'kya kar rahe ho' ||
    lower === 'kya kar rahe ho?' ||
    lower === 'kya kar rha h' ||
    lower === 'kaise chal raha hai' ||
    lower === 'kaise chal raha hai?';

  const isStatusCheckOrCasual =
    lower.startsWith('how are you') ||
    lower.startsWith('how r u') ||
    lower.startsWith('are you okay') ||
    lower.startsWith('what are you doing') ||
    lower.startsWith('what r u doing') ||
    lower.startsWith('what is up') ||
    lower.startsWith('whats up') ||
    lower.startsWith("what's up") ||
    lower === 'good morning' ||
    lower === 'good evening' ||
    lower === 'good afternoon' ||
    lower === 'good night' ||
    lower.startsWith('nice to meet you') ||
    lower.startsWith('nice meeting you') ||
    lower.includes('tell me a joke');

  const isQuickPoliteOrAcknowledge =
    lower === 'thanks' ||
    lower === 'thank you' ||
    lower === 'thank u' ||
    lower === 'ty' ||
    lower === 'awesome' ||
    lower === 'cool' ||
    lower === 'great' ||
    lower === 'nice' ||
    lower === 'good' ||
    lower === 'okay' ||
    lower === 'ok' ||
    lower === 'fine' ||
    lower === 'no problem' ||
    lower === 'no probs' ||
    lower === 'welcome' ||
    lower === 'you are welcome';

  const isGoodbye =
    lower === 'bye' ||
    lower === 'goodbye' ||
    lower === 'see ya' ||
    lower === 'see you later' ||
    lower === 'see u' ||
    lower === 'chalo bye';

  if (isGreeting || isHinglishGreeting || isStatusCheckOrCasual || isQuickPoliteOrAcknowledge || isGoodbye) {
    return { 
      intent: 'CONVERSATION',
      useRoomContext: false,
      useCareerContext: false,
      useLearningContext: false,
      useProgressContext: false,
      useTechnicalContext: false
    };
  }

  // 2. PRIORITY 2 — EXPLICIT LANGUAGE PREFERENCE COMMAND
  if (
    lower.includes('explain this in hinglish') ||
    lower.includes('hinglish mein samjhao') ||
    lower.includes('hinglish mein explain') ||
    lower.includes('speak in hinglish') ||
    lower.includes('hinglish please') ||
    lower.includes('hindi mein samjhao') ||
    lower.includes('hindi please')
  ) {
    return {
      intent: 'LANGUAGE_PREFERENCE',
      useRoomContext: true,
      useCareerContext: true,
      useLearningContext: true,
      useProgressContext: true,
      useTechnicalContext: true
    };
  }

  // 3. PRIORITY 3 — EXPLICIT USER COMMANDS & COOPERATIVE TERMINAL / LAB COACHING
  if (
    lower.includes('why did nmap fail') ||
    lower.includes('nmap failed') ||
    (lower.includes('why did') && lower.includes('fail')) ||
    lower.includes('command coach') ||
    lower.includes('explain command')
  ) {
    return {
      intent: 'COMMAND_COACH',
      useRoomContext: true,
      useCareerContext: true,
      useLearningContext: true,
      useProgressContext: false,
      useTechnicalContext: true,
      action: {
        type: 'OPEN_LAB',
        targetRoute: '/linux-lab',
        label: '💻 Open Linux Lab & Command Coach'
      }
    };
  }

  // 4. PRIORITY 4 — CAREER SYSTEM & ACTIVE SWITCHING
  const wantsHacking = 
    lower.includes('switch to ethical hacker') ||
    lower.includes('switch to ethical hacking') ||
    lower.includes('switch to eh') ||
    lower.includes('ethical hacker banna hai') ||
    lower.includes('ethical hacking seekhni hai') ||
    lower.includes('ethical hacking sikhni hai') ||
    lower.includes('ethical hacking seekhna hai') ||
    lower.includes('main ethical hacking seekhna chahta hoon') ||
    lower.includes('mujhe ethical hacking seekhni hai') ||
    lower.includes('mujhe ethical hacker banna hai') ||
    lower.includes('ethical hacking start karni hai');

  const wantsSoc =
    lower.includes('switch to soc') ||
    lower.includes('switch to soc analyst') ||
    lower.includes('soc analyst banna hai') ||
    lower.includes('soc analyst seekhna hai') ||
    lower.includes('soc analyst sikhna hai') ||
    lower.includes('soc analyst seekhna chahta hoon') ||
    lower.includes('mujhe soc analyst banna hai') ||
    lower.includes('mujhe soc analyst seekhna hai');

  if (wantsHacking) {
    return {
      intent: 'CAREER_SWITCH',
      canonicalRole: 'ETHICAL_HACKER',
      useRoomContext: false,
      useCareerContext: true,
      useLearningContext: true,
      useProgressContext: false,
      useTechnicalContext: false,
      action: {
        type: 'OPEN_LEARNING_PATH',
        targetRoute: '/learning-path',
        label: '🎓 Switch to Ethical Hacker Track',
        parameter: 'ethical-hacker'
      }
    };
  }

  if (wantsSoc) {
    return {
      intent: 'CAREER_SWITCH',
      canonicalRole: 'SOC_ANALYST',
      useRoomContext: false,
      useCareerContext: true,
      useLearningContext: true,
      useProgressContext: false,
      useTechnicalContext: false,
      action: {
        type: 'OPEN_LEARNING_PATH',
        targetRoute: '/learning-path',
        label: '🛡️ Switch to SOC Analyst Track',
        parameter: 'soc-analyst'
      }
    };
  }

  // General Career Track Mapping / Learning Paths
  let canonicalRole: string | undefined = undefined;
  let labelRole = '';

  if (
    lower.includes('ethical hacking') ||
    lower.includes('ethical hacker') ||
    lower.includes('hacking') ||
    lower.includes('hack') ||
    lower.includes('pentester') ||
    lower.includes('pentesting') ||
    lower.includes('penetration tester') ||
    lower.includes('penetration testing') ||
    lower.includes('offensive security')
  ) {
    canonicalRole = 'ETHICAL_HACKER';
    labelRole = 'Ethical Hacker';
  } else if (
    lower.includes('soc analyst') ||
    lower.includes('soc') ||
    lower.includes('security operations') ||
    lower.includes('defensive security')
  ) {
    canonicalRole = 'SOC_ANALYST';
    labelRole = 'SOC Analyst';
  } else if (
    lower.includes('network security') ||
    lower.includes('networking security')
  ) {
    canonicalRole = 'NETWORK_SECURITY';
    labelRole = 'Network Security Specialist';
  } else if (
    lower.includes('blue team') ||
    lower.includes('blue-team')
  ) {
    canonicalRole = 'BLUE_TEAM';
    labelRole = 'Blue Teamer';
  } else if (
    lower.includes('purple team') ||
    lower.includes('purple-team')
  ) {
    canonicalRole = 'PURPLE_TEAM';
    labelRole = 'Purple Teamer';
  } else if (
    lower.includes('dfir') ||
    lower.includes('forensics') ||
    lower.includes('digital forensics') ||
    lower.includes('incident response') ||
    lower.includes('dfir-analyst')
  ) {
    canonicalRole = 'DFIR_ANALYST';
    labelRole = 'DFIR Analyst';
  } else if (
    lower.includes('cloud security') ||
    lower.includes('cloud-security')
  ) {
    canonicalRole = 'CLOUD_SECURITY';
    labelRole = 'Cloud Security Engineer';
  } else if (
    lower.includes('security engineer') ||
    lower.includes('security-engineer')
  ) {
    canonicalRole = 'SECURITY_ENGINEER';
    labelRole = 'Security Engineer';
  } else if (
    lower.includes('security researcher') ||
    lower.includes('security-researcher')
  ) {
    canonicalRole = 'SECURITY_RESEARCHER';
    labelRole = 'Security Researcher';
  } else if (
    lower.includes('web security') ||
    lower.includes('web-security')
  ) {
    canonicalRole = 'WEB_SECURITY';
    labelRole = 'Web Security Specialist';
  } else if (
    lower.includes('threat hunter') ||
    lower.includes('threat-hunter') ||
    lower.includes('threat hunting')
  ) {
    canonicalRole = 'THREAT_HUNTER';
    labelRole = 'Threat Hunter';
  } else if (
    lower.includes('ctf competitor') ||
    lower.includes('ctf-competitor') ||
    lower.includes('ctf arena')
  ) {
    canonicalRole = 'CTF_COMPETITOR';
    labelRole = 'CTF Competitor';
  }

  if (canonicalRole) {
    const roleParam = canonicalRoleToId(canonicalRole);
    // If asking explicitly for roadmap
    if (lower.includes('roadmap') || lower.includes('road map') || lower.includes('roadmap dikhao')) {
      return {
        intent: 'CAREER_ROADMAP',
        canonicalRole,
        useRoomContext: false,
        useCareerContext: true,
        useLearningContext: true,
        useProgressContext: false,
        useTechnicalContext: false,
        action: {
          type: 'OPEN_ROADMAP',
          targetRoute: '/roadmap',
          label: `🗺️ Open ${labelRole} Roadmap`,
          parameter: roleParam
        }
      };
    }

    // If asking to continue or resume
    if (lower.includes('continue') || lower.includes('resume')) {
      return {
        intent: 'RESUME_CAREER_PATH',
        canonicalRole,
        useRoomContext: false,
        useCareerContext: true,
        useLearningContext: true,
        useProgressContext: true,
        useTechnicalContext: false,
        action: {
          type: 'RESUME_LEARNING',
          targetRoute: '/dashboard',
          label: `🔄 Resume ${labelRole} Position`,
          parameter: roleParam
        }
      };
    }

    return {
      intent: 'CAREER_LEARNING_INTENT',
      canonicalRole,
      useRoomContext: false,
      useCareerContext: true,
      useLearningContext: true,
      useProgressContext: false,
      useTechnicalContext: false,
      action: {
        type: 'OPEN_LEARNING_PATH',
        targetRoute: '/learning-path',
        label: `🎓 Open ${labelRole} Learning Path`,
        parameter: roleParam
      }
    };
  }

  // General Roadmap Intent
  if (lower.includes('roadmap') || lower.includes('road map') || lower.includes('roadmap dikhao')) {
    return {
      intent: 'CAREER_ROADMAP',
      useRoomContext: false,
      useCareerContext: true,
      useLearningContext: true,
      useProgressContext: false,
      useTechnicalContext: false,
      action: {
        type: 'OPEN_ROADMAP',
        targetRoute: '/roadmap',
        label: '🗺️ Open Career Roadmap'
      }
    };
  }

  // 5. PRIORITY 5 — MISSION SYSTEM ACTIONS
  if (
    lower.includes('give me a mission') ||
    lower.includes('start a mission') ||
    lower.includes('next mission') ||
    lower.includes('mission do') ||
    lower.includes('mujhe mission do') ||
    lower.includes('koi mission do')
  ) {
    return {
      intent: 'MISSION_INTENT',
      useRoomContext: false,
      useCareerContext: true,
      useLearningContext: true,
      useProgressContext: true,
      useTechnicalContext: false,
      action: {
        type: 'OPEN_MISSION',
        targetRoute: '/missions',
        label: '🎯 Launch Tactical Missions'
      }
    };
  }

  // 6. PRIORITY 6 — LEARNING INTENT & RESUME QUERIES (Adaptive path recommendation)
  const isLearningQuery =
    lower.includes('what should i learn next') ||
    lower.includes('what to learn next') ||
    lower.includes('what should i learn') ||
    lower.includes('next lesson') ||
    lower.includes('agla lesson') ||
    lower.includes('what\'s next') ||
    lower.includes('whats next') ||
    lower.includes('next move') ||
    lower.includes('continue learning') ||
    lower.includes('resume learning') ||
    lower.includes('where was i') ||
    lower.includes('ab mujhe kya karna hai') ||
    lower.includes('agla lesson kholo') ||
    lower.includes('next lesson kholo') ||
    lower.includes('kaha tak pahucha') ||
    lower.includes('kahan tak pahuncha') ||
    lower.includes('agla lesson kya hai') ||
    lower.includes('next lesson kya hai') ||
    lower.includes('next kya hai') ||
    lower.includes('ab kya karna hai');

  if (isLearningQuery) {
    return {
      intent: 'LEARNING_QUERY',
      useRoomContext: false,
      useCareerContext: true,
      useLearningContext: true,
      useProgressContext: true,
      useTechnicalContext: false,
      action: {
        type: 'RESUME_LEARNING',
        targetRoute: '/dashboard',
        label: '🔄 Continue Saved Learning Position'
      }
    };
  }

  // 7. PRIORITY 7 — ROOM / MODULE QUERY CONTEXT (Only trigger context on explicit request)
  const isRoomQuery =
    lower.includes('explain this room') ||
    lower.includes('explain room') ||
    lower.includes('explain current room') ||
    lower.includes('what is this room teaching') ||
    lower.includes('tell me about this room') ||
    lower.includes('is room ke baare mein') ||
    lower.includes('room context') ||
    lower.includes('is room ko explain karo') ||
    lower.includes('is room ko samjhao') ||
    lower.includes('mujhe ye room samjha') ||
    lower.includes('mujhe ye room samjhao') ||
    lower.includes('what is this room') ||
    lower.includes('where am i');

  if (isRoomQuery) {
    return {
      intent: 'ROOM_QUERY',
      useRoomContext: true,
      useCareerContext: true,
      useLearningContext: false,
      useProgressContext: false,
      useTechnicalContext: false
    };
  }

  // 8. Specific Module Request Intent
  if (lower.startsWith('open ') || lower.includes('open module') || lower.includes('open lesson')) {
    const requestedName = lower.replace('open ', '').replace('module ', '').replace('lesson ', '').trim();
    const resolved = resolveContentDestination(requestedName);
    
    if (resolved.exists) {
      return {
        intent: 'MODULE_INTENT',
        useRoomContext: true,
        useCareerContext: true,
        useLearningContext: true,
        useProgressContext: false,
        useTechnicalContext: true,
        action: {
          type: 'OPEN_MODULE',
          targetRoute: resolved.validRoute,
          label: `🚀 Open ${requestedName}`
        }
      };
    } else {
      return {
        intent: 'MODULE_INTENT',
        fallback: true,
        fallbackMessage: resolved.fallbackMessage,
        useRoomContext: true,
        useCareerContext: true,
        useLearningContext: true,
        useProgressContext: false,
        useTechnicalContext: true,
        action: {
          type: 'OPEN_MODULE',
          targetRoute: '/modules',
          label: '🚀 Open Cyber Lab Modules'
        }
      };
    }
  }

  // Default to general cyber query or general tutor response
  return { 
    intent: 'GENERAL_QUERY',
    useRoomContext: true,
    useCareerContext: true,
    useLearningContext: true,
    useProgressContext: true,
    useTechnicalContext: true
  };
}

/**
 * Recognizes natural language voice intents and maps them strictly to controlled actions
 */
export function detectVoiceIntent(
  transcript: string,
  userProfile?: UserProfile | null
): { intent: string; action?: AmanAction; directPrompt?: string } | null {
  const detected = detectAmanIntent(transcript, userProfile);
  
  if (detected.intent === 'CONVERSATION') {
    return null;
  }

  return {
    intent: detected.intent,
    action: detected.action,
    directPrompt: detected.directPrompt || transcript
  };
}
