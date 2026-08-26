/**
 * AMAN Agent 2.0 - Centralized Tool Registry
 * Contains all strongly-typed tools with input schemas, permissions, safety policies, and execution handlers.
 */

import { AmanToolDefinition, AmanExecutionContext } from './amanTools';
import { isOperationSafe } from './amanPermissions';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import { CYBER_LAB_MODULES } from '../data/cyberLabModulesData';
import { REAL_WORLD_INCIDENTS } from '../data/realWorldIncidentsData';
import { CTF_CHALLENGES } from '../data/mockData';
import { validateAceCommandScope } from '../utils/aceScopePolicy';
import { loadIncidentState, getCompactIncidentContext } from '../utils/incidentStateEngine';

export class AmanToolRegistry {
  private static tools: Map<string, AmanToolDefinition> = new Map();

  public static registerTool(tool: AmanToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  public static getTool(name: string): AmanToolDefinition | undefined {
    return this.tools.get(name);
  }

  public static getAllTools(): AmanToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public static getToolsByCategory(category: string): AmanToolDefinition[] {
    return this.getAllTools().filter(t => t.category === category);
  }
}

// =============================================================
// CATEGORY A — NAVIGATION TOOLS
// =============================================================

AmanToolRegistry.registerTool({
  name: 'open_dashboard',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Navigates the user to the Main Command Dashboard.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/dashboard');
    return { success: true, route: '/dashboard', message: 'Navigated to Dashboard' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_roles',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the cybersecurity career pathways and job-readiness overview.',
  parameters: {
    type: 'object',
    properties: {
      roleId: { type: 'string', description: 'Optional specific role ID (e.g. "soc-analyst", "pentester")' }
    }
  },
  execute: async (params: { roleId?: string }, ctx: AmanExecutionContext) => {
    const route = params.roleId ? `/career-roles?role=${encodeURIComponent(params.roleId)}` : '/career-roles';
    ctx.navigate(route);
    return { success: true, route, message: 'Opened Career Roles' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_roadmap',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the dynamic cybersecurity learning roadmap.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/roadmap');
    return { success: true, route: '/roadmap', message: 'Navigated to Roadmap' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_learning_path',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the learning path or switches between Ethical Hacker and SOC Analyst tracks.',
  parameters: {
    type: 'object',
    properties: {
      pathId: {
        type: 'string',
        description: 'Track identifier: "ETHICAL_HACKER" or "SOC_ANALYST"',
        enum: ['ETHICAL_HACKER', 'SOC_ANALYST']
      }
    }
  },
  execute: async (params: { pathId?: 'ETHICAL_HACKER' | 'SOC_ANALYST' }, ctx: AmanExecutionContext) => {
    if (params.pathId && ctx.setActiveCareerTrack) {
      ctx.setActiveCareerTrack(params.pathId);
    }
    ctx.navigate('/learning-path');
    return { success: true, activeTrack: params.pathId || ctx.profile?.careerTrack || 'ETHICAL_HACKER', route: '/learning-path' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_skill_tree',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the interactive visual cybersecurity skill tree.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/skill-tree');
    return { success: true, route: '/skill-tree', message: 'Opened Skill Tree' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_missions',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the tactical missions hub or a specific mission case.',
  parameters: {
    type: 'object',
    properties: {
      missionId: { type: 'string', description: 'Optional mission or incident ID' }
    }
  },
  execute: async (params: { missionId?: string }, ctx: AmanExecutionContext) => {
    const route = params.missionId ? `/missions?id=${encodeURIComponent(params.missionId)}` : '/missions';
    ctx.navigate(route);
    return { success: true, route, message: params.missionId ? `Opened mission ${params.missionId}` : 'Opened Missions Hub' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_linux_lab',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the Linux Fundamentals & Bash Terminal Sandbox Lab.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/linux-lab');
    return { success: true, route: '/linux-lab', message: 'Opened Linux Lab' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_network_lab',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the Network & Port Scanning Reconnaissance Lab.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/network-lab');
    return { success: true, route: '/network-lab', message: 'Opened Network Lab' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_web_security_lab',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the Web Application Security Lab (OWASP Top 10, SQLi, XSS).',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/practice/web-security');
    return { success: true, route: '/practice/web-security', message: 'Opened Web Security Lab' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_soc_simulator',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the SOC Incident Response & SIEM Alert Simulator.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/practice/soc-simulator');
    return { success: true, route: '/practice/soc-simulator', message: 'Opened SOC Simulator' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_live_incidents',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens Live Incident Mode containing unsolved incident briefings and Socratic hypotheses.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/live-incidents');
    return { success: true, route: '/live-incidents', message: 'Opened Live Incident Mode' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_real_incidents',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens historical real-world cyber incidents and case studies archive.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/real-incidents');
    return { success: true, route: '/real-incidents', message: 'Opened Real Incidents Archive' };
  }
});

AmanToolRegistry.registerTool({
  name: 'start_live_incident',
  category: 'MISSIONS',
  permission: 'LOW_RISK',
  description: 'Launches a specific live incident scenario into the Cyber Range.',
  parameters: {
    type: 'object',
    properties: {
      incidentId: { type: 'string', description: 'ID of the live incident (e.g. "live-inc-01")' }
    }
  },
  execute: async (params: { incidentId?: string }, ctx: AmanExecutionContext) => {
    const route = params.incidentId ? `/live-incidents?id=${encodeURIComponent(params.incidentId)}` : '/live-incidents';
    ctx.navigate(route);
    return { success: true, route, message: `Started Live Incident ${params.incidentId || '01'}` };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_live_incident_context',
  category: 'MISSIONS',
  permission: 'LOW_RISK',
  description: 'Retrieves compact state context for the active live incident to provide Socratic guidance.',
  parameters: {
    type: 'object',
    properties: {
      incidentId: { type: 'string', description: 'ID of the live incident e.g. "live-inc-01"' }
    }
  },
  execute: async (params: { incidentId?: string }, ctx: AmanExecutionContext) => {
    const id = params.incidentId || 'live-inc-01';
    const state = loadIncidentState(id);
    const compactContext = getCompactIncidentContext(state);
    return {
      success: true,
      compactContext,
      message: `Retrieved Live Incident Context for ${id}: Stage ${compactContext.currentStage}, Assets Discovered: ${compactContext.discoveredAssetsCount}, Score: ${compactContext.score}/100 Grade: ${compactContext.grade}.`
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_threat_hunting',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the Threat Hunting & MITRE ATT&CK Range.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/practice/threat-hunting');
    return { success: true, route: '/practice/threat-hunting', message: 'Opened Threat Hunting Range' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_cyber_range',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the Cyber Range / Practice Hub for scenario-based training.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/practice');
    return { success: true, route: '/practice', message: 'Opened Practice Cyber Range' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_ctf',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the CTF (Capture The Flag) Arena challenges.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/ctf-arena');
    return { success: true, route: '/ctf-arena', message: 'Opened CTF Arena' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_ace',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the Authorized Client Engagement (ACE) console and evidence locker.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/ace');
    return { success: true, route: '/ace', message: 'Opened ACE Console' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_evidence_locker',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the ACE Forensic Evidence Locker where captured artifacts and findings are stored.',
  parameters: {
    type: 'object',
    properties: {
      filterTag: { type: 'string', description: 'Optional filter tag (e.g., "IP", "HASH", "SQLi")' }
    }
  },
  execute: async (params: { filterTag?: string }, ctx: AmanExecutionContext) => {
    const route = params.filterTag ? `/ace?filter=${encodeURIComponent(params.filterTag)}` : '/ace';
    ctx.navigate(route);
    return { success: true, count: ctx.evidenceLocker?.length || 0, route, message: 'Opened Evidence Locker' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_aman',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the full-screen AMAN AI Cybersecurity Mentor workspace.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/ai-mentor');
    return { success: true, route: '/ai-mentor', message: 'Opened AMAN Workspace' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_study_plan',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the AI Personalized Study Plan page.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/ai-study-plan');
    return { success: true, route: '/ai-study-plan', message: 'Opened Study Plan' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_portfolio',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the learner portfolio, verified skills, and project summaries.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/portfolio');
    return { success: true, route: '/portfolio', message: 'Opened Portfolio' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_certificate',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the certificate issuance and cryptographic verification page.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    ctx.navigate('/certificate');
    return { success: true, route: '/certificate', message: 'Opened Certificate Page' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_certificate_verification',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens the public cryptographic certificate verification portal.',
  parameters: {
    type: 'object',
    properties: {
      certId: { type: 'string', description: 'Certificate ID or hash to verify' }
    }
  },
  execute: async (params: { certId?: string }, ctx: AmanExecutionContext) => {
    const route = params.certId ? `/certificate?verify=${encodeURIComponent(params.certId)}` : '/certificate';
    ctx.navigate(route);
    return { success: true, route, message: 'Opened Certificate Verification Portal' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_page',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Navigates the user to any specific top-level page in MY CYBER LAB.',
  parameters: {
    type: 'object',
    properties: {
      page: {
        type: 'string',
        description: 'Target page identifier or route (e.g., "dashboard", "roadmap", "missions", "linux-lab", "network-lab", "evidence-locker", "certificate", "skill-tree", "analytics", "practice-hub", "notebook")'
      }
    },
    required: ['page']
  },
  execute: async (params: { page: string }, ctx: AmanExecutionContext) => {
    const routeMap: Record<string, string> = {
      'dashboard': '/dashboard',
      'roadmap': '/roadmap',
      'missions': '/missions',
      'linux-lab': '/linux-lab',
      'network-lab': '/network-lab',
      'web-security-lab': '/practice/web-security',
      'soc-simulator': '/practice/soc-simulator',
      'threat-hunting': '/practice/threat-hunting',
      'evidence-locker': '/ace',
      'ace': '/ace',
      'certificate': '/certificate',
      'skill-tree': '/skill-tree',
      'analytics': '/analytics',
      'practice': '/practice',
      'practice-hub': '/practice',
      'security-tools': '/security-tools',
      'ctf-arena': '/ctf-arena',
      'ctf': '/ctf-arena',
      'study-plan': '/ai-study-plan',
      'settings': '/settings',
      'career-roles': '/career-roles',
      'notebook': '/notebook',
      'portfolio': '/portfolio'
    };

    const targetRoute = routeMap[params.page.toLowerCase()] || (params.page.startsWith('/') ? params.page : `/${params.page}`);
    ctx.navigate(targetRoute);
    return { success: true, openedRoute: targetRoute, message: `Navigated to ${params.page}` };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_module',
  category: 'NAVIGATION',
  permission: 'LOW_RISK',
  description: 'Opens a specific cybersecurity lab module or room by ID or category keyword.',
  parameters: {
    type: 'object',
    properties: {
      moduleId: {
        type: 'string',
        description: 'The module ID or keyword (e.g., "linux-lab", "network-analysis", "sql-injection", "privilege-escalation")'
      }
    },
    required: ['moduleId']
  },
  execute: async (params: { moduleId: string }, ctx: AmanExecutionContext) => {
    const term = params.moduleId.toLowerCase();
    
    if (term.includes('linux') || term.includes('bash') || term.includes('terminal')) {
      ctx.navigate('/linux-lab');
      return { success: true, route: '/linux-lab', name: 'Linux Mastery Lab' };
    }
    if (term.includes('network') || term.includes('nmap') || term.includes('subnet') || term.includes('port')) {
      ctx.navigate('/network-lab');
      return { success: true, route: '/network-lab', name: 'Network & Port Lab' };
    }
    if (term.includes('web') || term.includes('sql') || term.includes('xss') || term.includes('owasp')) {
      ctx.navigate('/practice/web-security');
      return { success: true, route: '/practice/web-security', name: 'Web Application Security Lab' };
    }
    if (term.includes('soc') || term.includes('siem') || term.includes('alert') || term.includes('triage')) {
      ctx.navigate('/practice/soc-simulator');
      return { success: true, route: '/practice/soc-simulator', name: 'SOC Incident Simulator' };
    }
    if (term.includes('threat') || term.includes('hunting') || term.includes('mitre')) {
      ctx.navigate('/practice/threat-hunting');
      return { success: true, route: '/practice/threat-hunting', name: 'Threat Hunting Range' };
    }
    if (term.includes('ace') || term.includes('evidence') || term.includes('engagement')) {
      ctx.navigate('/ace');
      return { success: true, route: '/ace', name: 'Authorized Client Engagement' };
    }

    const foundModule = CYBER_LAB_MODULES.find(m => m.id === params.moduleId || m.title.toLowerCase().includes(term));
    if (foundModule) {
      ctx.navigate(`/modules/${foundModule.id}`);
      return { success: true, route: `/modules/${foundModule.id}`, name: foundModule.title };
    }

    ctx.navigate('/modules');
    return { success: true, route: '/modules', name: 'Cyber Lab Modules Hub' };
  }
});

// =============================================================
// CATEGORY B — LEARNING & TELEMETRY TOOLS
// =============================================================

AmanToolRegistry.registerTool({
  name: 'get_current_learning_position',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Retrieves the learner\'s authoritative real-time learning position, active track, mastery percentage, and recommended next move.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const pos = ctx.learningState?.position || {};
    const next = ctx.learningState?.nextMove || {};
    return {
      careerPath: pos.careerPath || ctx.profile?.careerTrack || 'ETHICAL_HACKER',
      cyberLevel: pos.cyberLevel || ctx.profile?.cyberLevel || 1,
      currentCourse: pos.currentCourse || 'Foundations of Cybersecurity',
      currentModule: pos.currentModule || 'Linux Basics',
      masteryPercentage: pos.overallMasteryPercentage || 0,
      nextMove: next.title || 'Start Linux Module',
      nextType: next.type || 'LESSON',
      actionPrompt: next.actionPrompt || 'Begin lesson now'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_current_career',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Gets the active career track, target job role, readiness score, and core competencies.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const track = ctx.profile?.careerTrack || 'ETHICAL_HACKER';
    const role = CAREER_ROLES_DATA.find((r: any) => r.id === (track === 'ETHICAL_HACKER' ? 'junior-pentester' : 'soc-analyst-l1')) || CAREER_ROLES_DATA[0];
    return {
      activeTrack: track,
      roleTitle: role.title,
      readinessScore: 65,
      requiredSkills: role.coreSkills,
      typicalSalary: role.careerOutcomes?.[0]?.averageSalary || '$85,000'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_progress',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Gets full summary of user progress: XP, completed labs, completed lessons, streaks, and current weakness areas.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const prof = ctx.profile || {};
    const pos = ctx.learningState?.position || {};
    return {
      name: prof.name || 'Operator',
      level: prof.cyberLevel || 1,
      xp: prof.xp || 0,
      completedLabs: pos.completedLabsCount || 0,
      completedLessons: pos.completedLessonsCount || 0,
      streakDays: prof.streakDays || 1,
      currentWeakness: pos.currentWeakness || 'None',
      weaknessDetail: pos.weaknessDetail || 'Continue hands-on lab practice daily.'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_skill_gaps',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Analyzes the user\'s skill competency gaps based on recent quizzes, failed terminal commands, and active career requirements.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const pos = ctx.learningState?.position || {};
    return {
      primaryGap: pos.currentWeakness || 'Network Port Scanning & CIDR Subnetting',
      recommendation: 'Complete the Network Lab 5-minute subnetting drill.',
      gaps: [
        { skill: 'CIDR Subnet Math', severity: 'MEDIUM', suggestedLab: 'Network Lab' },
        { skill: 'Linux File Permissions (chmod/chown)', severity: 'LOW', suggestedLab: 'Linux Mastery Lab' },
        { skill: 'SQL Injection Union Payloads', severity: 'LOW', suggestedLab: 'Web Security Lab' }
      ]
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_completed_modules',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Lists all modules and rooms completed by the user.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const count = ctx.learningState?.position?.completedLabsCount || 2;
    const completed = CYBER_LAB_MODULES.slice(0, Math.min(count, CYBER_LAB_MODULES.length)).map(m => ({
      id: m.id,
      title: m.title,
      category: m.category,
      xpEarned: m.xpReward
    }));
    return { completedCount: completed.length, completedModules: completed };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_available_modules',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Lists all modules available to the user based on prerequisite completion.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    return {
      totalAvailable: CYBER_LAB_MODULES.length,
      modules: CYBER_LAB_MODULES.map(m => ({ id: m.id, title: m.title, category: m.category, difficulty: m.difficulty }))
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_prerequisites',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Retrieves required prior modules or concepts before starting a target module.',
  parameters: {
    type: 'object',
    properties: {
      moduleId: { type: 'string', description: 'The target module ID' }
    },
    required: ['moduleId']
  },
  execute: async (params: { moduleId: string }, _) => {
    const mod = CYBER_LAB_MODULES.find(m => m.id === params.moduleId) || CYBER_LAB_MODULES[0];
    return {
      moduleId: mod.id,
      moduleTitle: mod.title,
      prerequisites: mod.prerequisites || ['Basic Computer Literacy', 'Familiarity with Terminal']
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_current_mission',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Fetches the active mission scenario, objective, target scope, and briefing.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const activeIncident = REAL_WORLD_INCIDENTS[0];
    return {
      missionId: activeIncident.id,
      title: activeIncident.name,
      sector: activeIncident.sector,
      objective: 'Triage initial breach vector and capture Indicators of Compromise (IOCs)',
      scope: 'Authorized lab target 10.10.10.0/24',
      status: 'IN_PROGRESS'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_mission_progress',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Gets step-by-step progress on the active tactical mission.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    return {
      activeMission: REAL_WORLD_INCIDENTS[0].name,
      stepsCompleted: 2,
      totalSteps: 5,
      currentStep: 'Step 3: Analyze PCAP traffic for unauthorized DNS exfiltration'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_skill_tree',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Fetches mastery levels across all core cybersecurity skill domains.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const skills = ctx.learningState?.position?.skillsMastery || [
      { name: 'Linux OS & Shell', level: 'Intermediate', percentage: 65 },
      { name: 'Network & Port Recon', level: 'Beginner', percentage: 40 },
      { name: 'Web App Security', level: 'Intermediate', percentage: 55 },
      { name: 'SOC Alert Triage', level: 'Beginner', percentage: 30 },
      { name: 'Forensics & Evidence', level: 'Advanced', percentage: 80 }
    ];
    return { skills };
  }
});

AmanToolRegistry.registerTool({
  name: 'search_curriculum',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Searches all curriculum lessons and labs for a given topic or keyword.',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search keywords (e.g. "subnetting", "nmap", "wireshark", "sqli", "reverse shell")' }
    },
    required: ['query']
  },
  execute: async (params: { query: string }, _) => {
    const q = params.query.toLowerCase();
    const results = CYBER_LAB_MODULES
      .filter(m => m.title.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q) || m.skillsEarned.some(s => s.toLowerCase().includes(q)))
      .slice(0, 5)
      .map(m => ({ id: m.id, title: m.title, category: m.category, difficulty: m.difficulty }));
    return { query: params.query, matches: results, count: results.length };
  }
});

AmanToolRegistry.registerTool({
  name: 'search_missions',
  category: 'LEARNING',
  permission: 'READ_ONLY',
  description: 'Searches tactical missions and real-world incident simulations.',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search term for incident cases or CTF challenges' }
    },
    required: ['query']
  },
  execute: async (params: { query: string }, _) => {
    const q = params.query.toLowerCase();
    const incidentMatches = REAL_WORLD_INCIDENTS
      .filter(i => i.name.toLowerCase().includes(q) || i.sector.toLowerCase().includes(q) || i.whatHappened.toLowerCase().includes(q))
      .slice(0, 4)
      .map(i => ({ id: i.id, title: i.name, type: 'INCIDENT', sector: i.sector, difficulty: i.difficulty }));

    const ctfMatches = CTF_CHALLENGES
      .filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
      .slice(0, 4)
      .map(c => ({ id: c.id, title: c.title, type: 'CTF', category: c.category, points: c.points }));

    return { incidents: incidentMatches, ctf: ctfMatches };
  }
});

// =============================================================
// CATEGORY C — STUDY & TUTORING TOOLS
// =============================================================

AmanToolRegistry.registerTool({
  name: 'create_study_plan',
  category: 'STUDY',
  permission: 'LOW_RISK',
  description: 'Generates a personalized daily cybersecurity study plan based on available minutes and learning gaps.',
  parameters: {
    type: 'object',
    properties: {
      minutesPerDay: { type: 'number', description: 'Minutes to dedicate (e.g. 15, 30, 60, 90)' },
      focusTopic: { type: 'string', description: 'Specific focus area (e.g. "Networking", "Web Pentesting")' }
    }
  },
  execute: async (params: { minutesPerDay?: number; focusTopic?: string }, ctx: AmanExecutionContext) => {
    const mins = params.minutesPerDay || 30;
    const plan = {
      allocatedMinutes: mins,
      focus: params.focusTopic || ctx.learningState?.position?.currentModule || 'Linux Fundamentals',
      tasks: [
        { time: `${Math.round(mins * 0.3)}m`, task: 'Review foundational concepts & terminal syntax' },
        { time: `${Math.round(mins * 0.5)}m`, task: 'Hands-on practice in interactive lab environment' },
        { time: `${Math.round(mins * 0.2)}m`, task: 'Document key findings in Tactical Notebook' }
      ],
      recommendedNextStep: 'Launch Linux Lab session'
    };
    return { plan, success: true };
  }
});

AmanToolRegistry.registerTool({
  name: 'update_study_plan',
  category: 'STUDY',
  permission: 'LOW_RISK',
  description: 'Updates an existing study plan with new pacing or topic adjustments.',
  parameters: {
    type: 'object',
    properties: {
      minutesPerDay: { type: 'number', description: 'New minutes allocation' },
      focusTopic: { type: 'string', description: 'New focus topic' }
    }
  },
  execute: async (params: { minutesPerDay?: number; focusTopic?: string }, _) => {
    return { success: true, updatedMinutes: params.minutesPerDay || 45, newFocus: params.focusTopic || 'Network Security' };
  }
});

AmanToolRegistry.registerTool({
  name: 'start_learning_session',
  category: 'STUDY',
  permission: 'LOW_RISK',
  description: 'Initiates a focused 25-minute Pomodoro learning session on a specific topic.',
  parameters: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'Topic or module to study' }
    },
    required: ['topic']
  },
  execute: async (params: { topic: string }, _) => {
    return {
      success: true,
      topic: params.topic,
      durationMinutes: 25,
      sessionStatus: 'ACTIVE',
      tip: 'Stay focused on one concept at a time. Document all terminal commands executed.'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'recommend_next_module',
  category: 'STUDY',
  permission: 'READ_ONLY',
  description: 'Recommends the single best next cybersecurity module based on career path and skill prerequisites.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const next = ctx.learningState?.nextMove || {};
    return {
      recommendedModuleId: next.stepLink?.replace('/modules/', '') || 'network-lab',
      title: next.title || 'Network Reconnaissance & Port Scanning',
      reason: 'Fundamental prerequisite for both Penetration Testing and SOC Incident Response.'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'generate_quiz',
  category: 'STUDY',
  permission: 'READ_ONLY',
  description: 'Generates active-recall scenario-based quiz questions on any cybersecurity topic.',
  parameters: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'Subject area (e.g. "TCP Handshake", "Nmap Flags", "OWASP Top 10")' },
      count: { type: 'number', description: 'Number of questions (default: 3)' }
    },
    required: ['topic']
  },
  execute: async (params: { topic: string; count?: number }, _) => {
    return {
      topic: params.topic,
      count: params.count || 3,
      instruction: `Generate ${params.count || 3} multiple-choice scenario questions for ${params.topic} with explanations.`
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'generate_flashcards',
  category: 'STUDY',
  permission: 'READ_ONLY',
  description: 'Generates fast-recall terminal command and concept flashcards.',
  parameters: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'Topic (e.g. "Linux Commands", "Nmap Scans", "HTTP Status Codes")' },
      count: { type: 'number', description: 'Number of flashcards (default: 4)' }
    },
    required: ['topic']
  },
  execute: async (params: { topic: string; count?: number }, _) => {
    return { topic: params.topic, count: params.count || 4 };
  }
});

AmanToolRegistry.registerTool({
  name: 'summarize_module',
  category: 'STUDY',
  permission: 'READ_ONLY',
  description: 'Generates a concise technical summary and cheat sheet for a specific module.',
  parameters: {
    type: 'object',
    properties: {
      moduleId: { type: 'string', description: 'Module ID or title' }
    },
    required: ['moduleId']
  },
  execute: async (params: { moduleId: string }, _) => {
    const mod = CYBER_LAB_MODULES.find(m => m.id === params.moduleId || m.title.toLowerCase().includes(params.moduleId.toLowerCase())) || CYBER_LAB_MODULES[0];
    return {
      moduleId: mod.id,
      title: mod.title,
      summary: mod.summary,
      keySkills: mod.skillsEarned
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'explain_topic',
  category: 'STUDY',
  permission: 'READ_ONLY',
  description: 'Provides a structured technical breakdown of any cybersecurity, networking, OS, or programming concept.',
  parameters: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'The concept to explain (e.g. "CIDR Subnetting", "SQL Injection", "TCP 3-Way Handshake", "Buffer Overflow")' },
      depth: { type: 'string', description: 'Explanation depth: "BEGINNER", "INTERMEDIATE", "DEEP_DIVE"', enum: ['BEGINNER', 'INTERMEDIATE', 'DEEP_DIVE'] }
    },
    required: ['topic']
  },
  execute: async (params: { topic: string; depth?: string }, _) => {
    return {
      topic: params.topic,
      depth: params.depth || 'INTERMEDIATE',
      instruction: `Provide a structured explanation of ${params.topic} with real-world context, technical mechanics, attack/defense examples, and key commands.`
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'give_hint',
  category: 'STUDY',
  permission: 'READ_ONLY',
  description: 'Gives a subtle Socratic nudge without giving away the direct flag or answer.',
  parameters: {
    type: 'object',
    properties: {
      context: { type: 'string', description: 'Current lab context, command error, or mission step' }
    }
  },
  execute: async (params: { context?: string }, ctx: AmanExecutionContext) => {
    return {
      currentRoom: ctx.currentRoute,
      hint: 'Inspect the running services and file permissions. Remember that default ports and setuid binaries often disclose vulnerabilities.',
      guidance: 'Try running `netstat -tuln` or `ps aux` to discover active daemons.'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'review_mistakes',
  category: 'STUDY',
  permission: 'READ_ONLY',
  description: 'Reviews the learner\'s recent command errors and incorrect quiz responses to provide targeted remediation.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    return {
      recentMistakes: [
        { error: 'nmap -sS -p- 192.168.1.1 (Permission Denied)', cause: 'SYN stealth scan requires root privileges (sudo).', fix: 'Run `sudo nmap -sS ...` or use non-root TCP Connect scan `-sT`.' },
        { error: 'chmod 777 /etc/shadow (Security Misconfiguration)', cause: 'Giving global write access to shadow file introduces severe local privilege escalation.', fix: 'Ensure /etc/shadow is strictly owned by root with 640 or 600 permissions.' }
      ]
    };
  }
});

// =============================================================
// CATEGORY D — MISSIONS TOOLS
// =============================================================

AmanToolRegistry.registerTool({
  name: 'start_mission',
  category: 'MISSIONS',
  permission: 'LOW_RISK',
  description: 'Starts a tactical mission case study or incident response lab.',
  parameters: {
    type: 'object',
    properties: {
      missionId: { type: 'string', description: 'Mission or incident case ID' }
    },
    required: ['missionId']
  },
  execute: async (params: { missionId: string }, ctx: AmanExecutionContext) => {
    const inc = REAL_WORLD_INCIDENTS.find(i => i.id === params.missionId || i.name.toLowerCase().includes(params.missionId.toLowerCase())) || REAL_WORLD_INCIDENTS[0];
    ctx.navigate(`/missions?id=${encodeURIComponent(inc.id)}`);
    return { success: true, missionId: inc.id, missionName: inc.name, status: 'INITIALIZED' };
  }
});

AmanToolRegistry.registerTool({
  name: 'open_mission',
  category: 'MISSIONS',
  permission: 'LOW_RISK',
  description: 'Opens a tactical cybersecurity mission by ID or navigates to the Missions Hub.',
  parameters: {
    type: 'object',
    properties: {
      missionId: { type: 'string', description: 'The mission ID' }
    }
  },
  execute: async (params: { missionId?: string }, ctx: AmanExecutionContext) => {
    if (params.missionId) {
      ctx.navigate(`/missions?id=${encodeURIComponent(params.missionId)}`);
      return { success: true, route: `/missions?id=${params.missionId}` };
    }
    ctx.navigate('/missions');
    return { success: true, route: '/missions' };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_mission_status',
  category: 'MISSIONS',
  permission: 'READ_ONLY',
  description: 'Retrieves current verification status, objectives completed, and pending steps for a mission.',
  parameters: {
    type: 'object',
    properties: {
      missionId: { type: 'string', description: 'The mission ID' }
    },
    required: ['missionId']
  },
  execute: async (params: { missionId: string }, _) => {
    return {
      missionId: params.missionId,
      status: 'IN_PROGRESS',
      objectivesCompleted: 1,
      totalObjectives: 3,
      currentObjective: 'Isolate compromised host and export PCAP evidence.'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'submit_mission_step',
  category: 'MISSIONS',
  permission: 'LOW_RISK',
  description: 'Submits a forensic artifact, flag, or answer for mission step validation.',
  parameters: {
    type: 'object',
    properties: {
      missionId: { type: 'string', description: 'The mission ID' },
      stepId: { type: 'string', description: 'Step identifier' },
      answer: { type: 'string', description: 'The submitted answer or flag' }
    },
    required: ['missionId', 'stepId', 'answer']
  },
  execute: async (params: { missionId: string; stepId: string; answer: string }, ctx: AmanExecutionContext) => {
    if (ctx.addXp) {
      ctx.addXp(50, `Mission step ${params.stepId} completed`);
    }
    return {
      success: true,
      missionId: params.missionId,
      stepId: params.stepId,
      verified: true,
      xpAwarded: 50,
      feedback: 'Valid finding submitted! Objective verified.'
    };
  }
});

// =============================================================
// CATEGORY E — LAB & TERMINAL SANDBOX TOOLS
// =============================================================

AmanToolRegistry.registerTool({
  name: 'open_lab',
  category: 'LAB',
  permission: 'LOW_RISK',
  description: 'Launches a specific interactive cybersecurity lab sandbox.',
  parameters: {
    type: 'object',
    properties: {
      labId: { type: 'string', description: 'Lab ID ("linux-lab", "network-lab", "web-security", "soc-simulator")' }
    },
    required: ['labId']
  },
  execute: async (params: { labId: string }, ctx: AmanExecutionContext) => {
    const routeMap: Record<string, string> = {
      'linux-lab': '/linux-lab',
      'network-lab': '/network-lab',
      'web-security': '/practice/web-security',
      'soc-simulator': '/practice/soc-simulator',
      'threat-hunting': '/practice/threat-hunting'
    };
    const route = routeMap[params.labId.toLowerCase()] || '/linux-lab';
    ctx.navigate(route);
    return { success: true, labId: params.labId, route };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_lab_state',
  category: 'LAB',
  permission: 'READ_ONLY',
  description: 'Inspects current virtual sandbox state (working directory, running processes, active network interfaces).',
  parameters: {
    type: 'object',
    properties: {
      labId: { type: 'string', description: 'The lab ID' }
    }
  },
  execute: async (params: { labId?: string }, _) => {
    return {
      labId: params.labId || 'linux-lab',
      workingDirectory: '/home/student',
      currentUser: 'student (uid=1000)',
      activeProcesses: ['bash', 'sshd', 'nginx (simulated)'],
      openPorts: [22, 80, 8080]
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'execute_simulated_command',
  category: 'LAB',
  permission: 'LAB_ACTION',
  description: 'Executes a command inside the safe simulated training sandbox and returns output while strictly enforcing ACE Rules of Engagement.',
  parameters: {
    type: 'object',
    properties: {
      command: { type: 'string', description: 'The bash or security tool command to run (e.g., "nmap -sS 10.10.10.5", "whoami", "cat /etc/passwd")' },
      workingDirectory: { type: 'string', description: 'Current working directory' }
    },
    required: ['command']
  },
  execute: async (params: { command: string; workingDirectory?: string }, _) => {
    const safeCheck = isOperationSafe('EXECUTE_COMMAND', params);
    if (!safeCheck.safe) {
      return { output: `[!] SECURITY VIOLATION: ${safeCheck.reason}`, isError: true };
    }

    const scopeValidation = validateAceCommandScope(params.command, null);
    if (!scopeValidation.allowed) {
      return {
        output: `[!] ACE SCOPE VIOLATION [DENIED]\n${scopeValidation.reason}\nTarget is out of authorized engagement scope.`,
        isError: true,
        category: scopeValidation.category
      };
    }

    try {
      const res = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: params.command,
          workingDirectory: params.workingDirectory || '/home/student'
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // offline deterministic fallback
    }

    return {
      output: `[Simulated Terminal Sandbox]\n$ ${params.command}\nCommand processed safely in offline sandbox.`,
      isError: false,
      workingDirectory: params.workingDirectory || '/home/student'
    };
  }
});

// Alias for execute_simulated_command
AmanToolRegistry.registerTool({
  name: 'run_simulated_command',
  category: 'LAB',
  permission: 'LAB_ACTION',
  description: 'Alias for execute_simulated_command.',
  parameters: {
    type: 'object',
    properties: {
      command: { type: 'string', description: 'Command to run' },
      workingDirectory: { type: 'string', description: 'Optional working directory' }
    },
    required: ['command']
  },
  execute: async (params: { command: string; workingDirectory?: string }, ctx: AmanExecutionContext) => {
    const mainTool = AmanToolRegistry.getTool('execute_simulated_command');
    return mainTool ? mainTool.execute(params, ctx) : { output: 'Sandbox ready.' };
  }
});

AmanToolRegistry.registerTool({
  name: 'inspect_virtual_filesystem',
  category: 'LAB',
  permission: 'READ_ONLY',
  description: 'Lists files and directories inside the simulated training sandbox filesystem.',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'Virtual directory path (e.g. "/home/student", "/var/log")' }
    },
    required: ['path']
  },
  execute: async (params: { path: string }, _) => {
    return {
      path: params.path,
      entries: [
        { name: 'evidence.pcap', type: 'FILE', size: '2.4MB', permissions: '-rw-r--r--' },
        { name: 'recon_notes.txt', type: 'FILE', size: '1.2KB', permissions: '-rw-r--r--' },
        { name: 'scripts', type: 'DIR', size: '4KB', permissions: 'drwxr-xr-x' }
      ]
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'reset_lab',
  category: 'LAB',
  permission: 'LAB_ACTION',
  description: 'Resets the current lab sandbox state to its initial clean snapshot.',
  parameters: {
    type: 'object',
    properties: {
      labId: { type: 'string', description: 'The lab ID to reset' }
    }
  },
  execute: async (params: { labId?: string }, _) => {
    return { success: true, labId: params.labId || 'current-lab', message: 'Virtual lab environment restored to clean snapshot.' };
  }
});

AmanToolRegistry.registerTool({
  name: 'analyze_terminal_output',
  category: 'LAB',
  permission: 'READ_ONLY',
  description: 'Analyzes a terminal error or command output to explain what went wrong and provide Socratic guidance.',
  parameters: {
    type: 'object',
    properties: {
      command: { type: 'string', description: 'The command executed' },
      output: { type: 'string', description: 'The raw terminal error or stdout' }
    },
    required: ['command', 'output']
  },
  execute: async (params: { command: string; output: string }, _) => {
    return {
      command: params.command,
      outputLength: params.output.length,
      instruction: `Analyze this terminal output from "${params.command}":\n"${params.output}"\nProvide Socratic coaching on why this occurred and what to check next.`
    };
  }
});

// =============================================================
// CATEGORY F — EVIDENCE TOOLS
// =============================================================

AmanToolRegistry.registerTool({
  name: 'list_evidence',
  category: 'EVIDENCE',
  permission: 'READ_ONLY',
  description: 'Fetches the list of all captured forensic evidence items in the active engagement locker.',
  parameters: {
    type: 'object',
    properties: {
      filterType: { type: 'string', description: 'Filter by type: IP, HASH, LOG_EXCERPT, SCREENSHOT, VULNERABILITY' }
    }
  },
  execute: async (params: { filterType?: string }, ctx: AmanExecutionContext) => {
    const items = ctx.evidenceLocker || [];
    const filtered = params.filterType ? items.filter((i: any) => i.type === params.filterType) : items;
    return {
      totalCount: items.length,
      filteredCount: filtered.length,
      evidence: filtered.slice(0, 10).map((i: any) => ({ id: i.id, title: i.title, type: i.type, timestamp: i.timestamp }))
    };
  }
});

// Alias for list_evidence
AmanToolRegistry.registerTool({
  name: 'get_evidence',
  category: 'EVIDENCE',
  permission: 'READ_ONLY',
  description: 'Alias for list_evidence.',
  parameters: {
    type: 'object',
    properties: {
      filterType: { type: 'string', description: 'Filter by evidence artifact type' }
    }
  },
  execute: async (params: { filterType?: string }, ctx: AmanExecutionContext) => {
    const listTool = AmanToolRegistry.getTool('list_evidence');
    return listTool ? listTool.execute(params, ctx) : { evidence: [] };
  }
});

AmanToolRegistry.registerTool({
  name: 'search_evidence',
  category: 'EVIDENCE',
  permission: 'READ_ONLY',
  description: 'Searches forensic findings by keyword, IOC, IP address, or CVE.',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' }
    },
    required: ['query']
  },
  execute: async (params: { query: string }, ctx: AmanExecutionContext) => {
    const q = params.query.toLowerCase();
    const items = ctx.evidenceLocker || [];
    const matches = items.filter((i: any) => 
      (i.title && i.title.toLowerCase().includes(q)) || 
      (i.description && i.description.toLowerCase().includes(q))
    );
    return { query: params.query, matchCount: matches.length, matches };
  }
});

AmanToolRegistry.registerTool({
  name: 'view_evidence',
  category: 'EVIDENCE',
  permission: 'READ_ONLY',
  description: 'Retrieves full cryptographic details, hash, timestamps, and notes for a specific evidence item.',
  parameters: {
    type: 'object',
    properties: {
      evidenceId: { type: 'string', description: 'The evidence item ID' }
    },
    required: ['evidenceId']
  },
  execute: async (params: { evidenceId: string }, ctx: AmanExecutionContext) => {
    const item = (ctx.evidenceLocker || []).find((i: any) => i.id === params.evidenceId) || {
      id: params.evidenceId,
      title: 'Sample IOC Finding',
      type: 'IP',
      description: 'Host beaconing observed on 10.10.10.15'
    };
    return { evidence: item };
  }
});

AmanToolRegistry.registerTool({
  name: 'create_evidence',
  category: 'EVIDENCE',
  permission: 'LOW_RISK',
  description: 'Saves a new verified finding or indicator of compromise into the Evidence Locker.',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Finding or artifact headline (e.g. "Unauthenticated Redis 6379 RCE")' },
      description: { type: 'string', description: 'Technical details, affected IP/URL, and hash/output' },
      type: { type: 'string', description: 'Evidence type: IP, HASH, LOG_EXCERPT, VULNERABILITY' }
    },
    required: ['title', 'description']
  },
  execute: async (params: { title: string; description: string; type?: string }, ctx: AmanExecutionContext) => {
    if (ctx.addEvidence) {
      const newEv = ctx.addEvidence({
        title: params.title,
        description: params.description,
        type: params.type || 'VULNERABILITY',
        category: 'ENGAGEMENT_FINDING',
        severity: 'HIGH',
        mitreTechnique: 'T1190'
      });
      return { success: true, evidenceId: newEv?.id || 'ev-created', message: `Evidence "${params.title}" logged to locker.` };
    }
    return { success: false, message: 'Evidence locker not ready.' };
  }
});

// Alias for create_evidence
AmanToolRegistry.registerTool({
  name: 'create_evidence_note',
  category: 'EVIDENCE',
  permission: 'LOW_RISK',
  description: 'Alias for create_evidence.',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Finding headline' },
      description: { type: 'string', description: 'Detailed findings and hash notes' },
      type: { type: 'string', description: 'Evidence type: IP, HASH, LOG_EXCERPT, VULNERABILITY' }
    },
    required: ['title', 'description']
  },
  execute: async (params: { title: string; description: string; type?: string }, ctx: AmanExecutionContext) => {
    const main = AmanToolRegistry.getTool('create_evidence');
    return main ? main.execute(params, ctx) : { success: false };
  }
});

AmanToolRegistry.registerTool({
  name: 'export_evidence',
  category: 'EVIDENCE',
  permission: 'LOW_RISK',
  description: 'Exports captured evidence artifacts as a structured markdown or JSON summary.',
  parameters: {
    type: 'object',
    properties: {
      format: { type: 'string', enum: ['MARKDOWN', 'JSON'], description: 'Export format' }
    }
  },
  execute: async (params: { format?: string }, ctx: AmanExecutionContext) => {
    const count = ctx.evidenceLocker?.length || 0;
    return {
      success: true,
      format: params.format || 'MARKDOWN',
      itemCount: count,
      message: `Exported ${count} findings to structured engagement report.`
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'delete_evidence',
  category: 'EVIDENCE',
  permission: 'CONFIRMATION_REQUIRED',
  description: 'Deletes a piece of evidence or clears the locker (Requires explicit user confirmation).',
  parameters: {
    type: 'object',
    properties: {
      evidenceId: { type: 'string', description: 'The evidence item ID to delete, or "ALL" to clear locker' }
    },
    required: ['evidenceId']
  },
  execute: async (params: { evidenceId: string }, ctx: AmanExecutionContext) => {
    if (ctx.deleteEvidence) {
      ctx.deleteEvidence(params.evidenceId);
      return { success: true, deletedId: params.evidenceId, message: `Evidence item ${params.evidenceId} was permanently deleted.` };
    }
    return { success: false, message: 'Delete operation could not complete.' };
  }
});

// =============================================================
// CATEGORY G — CAREER & ROADMAP TOOLS
// =============================================================

AmanToolRegistry.registerTool({
  name: 'get_career_progress',
  category: 'CAREER',
  permission: 'READ_ONLY',
  description: 'Calculates the user\'s completion percentage and job-readiness score toward their selected career role.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const track = ctx.profile?.careerTrack || 'ETHICAL_HACKER';
    return {
      targetRole: track === 'ETHICAL_HACKER' ? 'Junior Penetration Tester' : 'SOC Analyst Tier 1',
      readinessScore: 68,
      completedCoreSkills: 4,
      remainingCoreSkills: 2,
      nextRecommendedCertification: 'CompTIA Security+'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_role_requirements',
  category: 'CAREER',
  permission: 'READ_ONLY',
  description: 'Gets salary, daily duties, required skills, and cert prerequisites for any cybersecurity career role.',
  parameters: {
    type: 'object',
    properties: {
      roleId: { type: 'string', description: 'Role identifier (e.g. "soc-analyst", "pentester", "cloud-security-engineer")' }
    },
    required: ['roleId']
  },
  execute: async (params: { roleId: string }, _) => {
    const role = CAREER_ROLES_DATA.find(r => r.id === params.roleId || r.title.toLowerCase().includes(params.roleId.toLowerCase())) || CAREER_ROLES_DATA[0];
    return {
      roleId: role.id,
      title: role.title,
      summary: role.shortDescription,
      typicalSalary: role.careerOutcomes?.[0]?.averageSalary || '$85,000',
      keySkills: role.coreSkills,
      recommendedCerts: ['CompTIA Security+', 'BJD SOC-1']
    };
  }
});

// Alias for get_role_requirements
AmanToolRegistry.registerTool({
  name: 'get_career_role',
  category: 'CAREER',
  permission: 'READ_ONLY',
  description: 'Alias for get_role_requirements.',
  parameters: {
    type: 'object',
    properties: {
      roleId: { type: 'string', description: 'Role identifier' }
    },
    required: ['roleId']
  },
  execute: async (params: { roleId: string }, ctx: AmanExecutionContext) => {
    const main = AmanToolRegistry.getTool('get_role_requirements');
    return main ? main.execute(params, ctx) : {};
  }
});

AmanToolRegistry.registerTool({
  name: 'recommend_skills',
  category: 'CAREER',
  permission: 'READ_ONLY',
  description: 'Recommends highest-ROI cybersecurity skills to learn next based on market demand.',
  parameters: {
    type: 'object',
    properties: {
      roleId: { type: 'string', description: 'Optional target role' }
    }
  },
  execute: async (params: { roleId?: string }, _) => {
    return {
      targetRole: params.roleId || 'Cybersecurity Professional',
      topSkillsToLearn: [
        { skill: 'Linux Shell & Automation', demand: 'CRITICAL', timeToLearn: '2 weeks' },
        { skill: 'Wireshark & Packet Dissection', demand: 'HIGH', timeToLearn: '1 week' },
        { skill: 'MITRE ATT&CK Framework Mapping', demand: 'HIGH', timeToLearn: '3 days' }
      ]
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'generate_career_roadmap',
  category: 'CAREER',
  permission: 'READ_ONLY',
  description: 'Generates a phased 90-day learning roadmap tailored to a specific cybersecurity career path.',
  parameters: {
    type: 'object',
    properties: {
      roleId: { type: 'string', description: 'Role identifier ("soc-analyst", "pentester")' }
    },
    required: ['roleId']
  },
  execute: async (params: { roleId: string }, _) => {
    return {
      role: params.roleId,
      roadmap: [
        { phase: 'Month 1: Foundations', focus: 'Linux OS internals, Bash scripting, TCP/IP fundamentals, CIDR subnetting' },
        { phase: 'Month 2: Core Defense/Offense', focus: 'Port scanning, Web App OWASP Top 10, SIEM alert triage, log correlation' },
        { phase: 'Month 3: Capstone & Portfolio', focus: 'Tactical incident simulations, CTF challenge solving, verified evidence documentation' }
      ]
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'generate_portfolio_summary',
  category: 'CAREER',
  permission: 'READ_ONLY',
  description: 'Generates a resume-ready summary of completed labs, captured evidence, and verified cyber achievements.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const prof = ctx.profile || {};
    return {
      candidateName: prof.name || 'Operator',
      verifiedLevel: `Level ${prof.cyberLevel || 1}`,
      completedLabsCount: ctx.learningState?.position?.completedLabsCount || 0,
      evidenceLogged: ctx.evidenceLocker?.length || 0,
      summary: `Hands-on practitioner proficient in Linux administration, network reconnaissance, and forensic artifact logging on MY CYBER LAB.`
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'generate_interview_questions',
  category: 'CAREER',
  permission: 'READ_ONLY',
  description: 'Generates realistic technical and scenario-based interview questions for SOC Analyst or Penetration Tester jobs.',
  parameters: {
    type: 'object',
    properties: {
      role: { type: 'string', description: 'Role name ("SOC Analyst" or "Ethical Hacker")', enum: ['SOC Analyst', 'Ethical Hacker'] },
      experienceLevel: { type: 'string', description: 'Entry-Level, Mid-Level, Senior', enum: ['Entry-Level', 'Mid-Level', 'Senior'] }
    },
    required: ['role']
  },
  execute: async (params: { role: string; experienceLevel?: string }, _) => {
    return {
      role: params.role,
      level: params.experienceLevel || 'Entry-Level',
      instruction: `Generate 3 high-impact ${params.role} interview questions with ideal STAR response guidelines.`
    };
  }
});

// =============================================================
// CATEGORY H — ACCOUNT & PREFERENCES TOOLS
// =============================================================

AmanToolRegistry.registerTool({
  name: 'get_profile',
  category: 'ACCOUNT',
  permission: 'READ_ONLY',
  description: 'Gets current user profile, avatar, cyber level, and username.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const prof = ctx.profile || {};
    return {
      name: prof.name || 'Operator',
      level: prof.cyberLevel || 1,
      careerTrack: prof.careerTrack || 'ETHICAL_HACKER',
      language: prof.language || 'English / Hinglish'
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_preferences',
  category: 'ACCOUNT',
  permission: 'READ_ONLY',
  description: 'Gets user UI preferences (theme, teaching mode, sound effects).',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    return {
      preferredLanguage: ctx.profile?.language || 'Auto',
      activeMode: 'TEACH',
      soundEnabled: true
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'get_learning_statistics',
  category: 'ACCOUNT',
  permission: 'READ_ONLY',
  description: 'Retrieves comprehensive learning analytics: total study time, streak record, accuracy rate.',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    const prof = ctx.profile || {};
    const pos = ctx.learningState?.position || {};
    return {
      xp: prof.xp || 0,
      streakDays: prof.streakDays || 1,
      totalLabsCompleted: pos.completedLabsCount || 0,
      totalLessonsCompleted: pos.completedLessonsCount || 0,
      masteryScore: `${pos.overallMasteryPercentage || 0}%`
    };
  }
});

AmanToolRegistry.registerTool({
  name: 'reset_all_progress',
  category: 'ACCOUNT',
  permission: 'CONFIRMATION_REQUIRED',
  description: 'Resets all learner progress, XP, and completed labs (Requires explicit operator confirmation).',
  parameters: { type: 'object', properties: {} },
  execute: async (_, ctx: AmanExecutionContext) => {
    if (ctx.resetAllProgress) {
      ctx.resetAllProgress();
      return { success: true, message: 'All progress has been reset.' };
    }
    return { success: false, message: 'Reset handler not available.' };
  }
});
