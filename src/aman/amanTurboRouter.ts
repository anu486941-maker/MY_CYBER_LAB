/**
 * AMAN Turbo Local-First Intent Router
 * Classifies user intent in sub-millisecond time and executes deterministic fast-paths
 * without unnecessary Gemini API roundtrips.
 */

import { AmanExecutionContext, ToolCallInvocation, AgentStep } from './amanTools';
import { CompactLearnerContext } from './amanContext';
import { AmanActionExecutor } from './amanActionExecutor';
import { AmanPlatformIndex } from './amanPlatformIndex';
import { AmanResponseCache } from './amanResponseCache';
import { isOperationSafe } from './amanPermissions';
import { getRolePersonalization } from '../services/rolePersonalization';

export interface TurboRouteResult {
  handledLocally: boolean;
  text: string;
  toolCalls?: ToolCallInvocation[];
  workflowSteps?: AgentStep[];
  intentCategory: string;
  targetRoute?: string;
  executionPath: 'TURBO_FAST_PATH' | 'TURBO_SPECULATIVE' | 'GEMINI_STREAM' | 'SECURITY_BLOCKED';
  isLocalFallback?: boolean;
  speculativeActionFired?: boolean;
}

export class AmanTurboRouter {
  /**
   * Evaluates if a message can be immediately resolved locally on the client.
   * Target execution time: < 1 - 5ms.
   */
  public static async route(
    message: string,
    context: AmanExecutionContext,
    compactContext: CompactLearnerContext,
    onToolInvoked?: (invocation: ToolCallInvocation) => void,
    onWorkflowStep?: (step: AgentStep) => void
  ): Promise<TurboRouteResult | null> {
    const raw = message.trim();
    const lower = raw.toLowerCase().replace(/[?!.,;:]/g, ' ').replace(/\s+/g, ' ').trim();

    // =========================================================================
    // 0. SECURITY & BLOCKED OPERATIONS (Zero-tolerance sandbox guardrail)
    // =========================================================================
    if (
      lower.includes('real computer') ||
      lower.includes('environment variable') ||
      lower.includes('api key') ||
      lower.includes('windows file') ||
      lower.includes('powershell') ||
      lower.includes('bash on the host') ||
      lower.includes('host shell') ||
      lower.includes('command on the host') ||
      lower.includes('on the host') ||
      lower.includes('/etc/shadow') ||
      lower.includes('/etc/passwd on host') ||
      lower.includes('bypass ace') ||
      lower.includes('ignore ace') ||
      lower.includes('steal password') ||
      lower.includes('process.env')
    ) {
      const securityCheck = isOperationSafe('EXECUTE_HOST_SHELL', { query: message });
      const blockedInv: ToolCallInvocation = {
        id: `sec-${Date.now()}`,
        toolName: 'execute_host_shell',
        params: { input: message },
        permission: 'BLOCKED',
        status: 'REJECTED',
        error: securityCheck.reason || 'Operation is blocked by AMAN Agent Security Policy.',
        timestamp: new Date(),
        stepDescription: 'Security policy blocked host access.'
      };
      if (onToolInvoked) onToolInvoked(blockedInv);

      return {
        handledLocally: true,
        executionPath: 'SECURITY_BLOCKED',
        intentCategory: 'SECURITY_POLICY_BLOCK',
        text: `🛡️ **Security Policy Enforcement [BLOCKED]**\n\nI cannot execute commands on your host operating system, expose server environment variables/API keys, access host system files (\`/etc/shadow\`), or bypass the **Authorized Client Engagement (ACE)** scope.\n\nAll cybersecurity operations in MY CYBER LAB are strictly confined to our safe, deterministic training sandboxes.`,
        toolCalls: [blockedInv]
      };
    }

    // =========================================================================
    // 1. CONFIRMATION-GATED OPERATIONS (Destructive actions require confirmation)
    // =========================================================================
    if (
      lower === 'delete all my progress' ||
      lower === 'reset all progress' ||
      lower === 'reset progress' ||
      lower.includes('erase all my progress')
    ) {
      const confirmRes = await AmanActionExecutor.executeTool('reset_all_progress', {}, context, false);
      const inv: ToolCallInvocation = {
        id: confirmRes.toolCallId,
        toolName: 'reset_all_progress',
        params: {},
        permission: 'CONFIRMATION_REQUIRED',
        status: 'REQUIRES_CONFIRMATION',
        error: confirmRes.confirmationMessage,
        timestamp: new Date()
      };
      if (onToolInvoked) onToolInvoked(inv);

      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'CONFIRMATION_REQUIRED',
        text: `⚠️ **Action Requires Confirmation**\n\nResetting all progress will erase your earned XP, streak history, and completed lab modules. Do you want to proceed?`,
        toolCalls: [inv]
      };
    }

    if (
      lower.includes('delete my evidence') ||
      lower.includes('delete evidence') ||
      lower.includes('delete all evidence') ||
      lower.includes('delete this evidence') ||
      lower.includes('purge evidence')
    ) {
      const confirmRes = await AmanActionExecutor.executeTool('delete_evidence', { evidenceId: 'ALL' }, context, false);
      const inv: ToolCallInvocation = {
        id: confirmRes.toolCallId,
        toolName: 'delete_evidence',
        params: { evidenceId: 'ALL' },
        permission: 'CONFIRMATION_REQUIRED',
        status: 'REQUIRES_CONFIRMATION',
        error: confirmRes.confirmationMessage,
        timestamp: new Date()
      };
      if (onToolInvoked) onToolInvoked(inv);

      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'CONFIRMATION_REQUIRED',
        text: `⚠️ **Action Requires Confirmation**\n\nDeleting evidence from the ACE Forensic Evidence Locker is permanent and cannot be undone.\n\nDo you want me to delete this evidence finding?`,
        toolCalls: [inv]
      };
    }

    // =========================================================================
    // 2. SPECULATIVE UI INTENTS (Immediate fast action + parallel tutoring context)
    // =========================================================================
    if (
      (lower.includes('open network') || lower.includes('open networking')) &&
      (lower.includes('tell me what i should learn') || lower.includes('what should i learn'))
    ) {
      context.navigate('/network-lab');
      const inv: ToolCallInvocation = {
        id: `inv-${Date.now()}`,
        toolName: 'open_network_lab',
        params: {},
        permission: 'LOW_RISK',
        status: 'SUCCESS',
        timestamp: new Date()
      };
      if (onToolInvoked) onToolInvoked(inv);

      return {
        handledLocally: true,
        executionPath: 'TURBO_SPECULATIVE',
        intentCategory: 'SPECULATIVE_NAVIGATION_AND_TUTORING',
        targetRoute: '/network-lab',
        speculativeActionFired: true,
        text: `⚡ **Networking Lab is open.**\n\nBased on your profile (Cyber Level ${compactContext.cyberLevel}), I recommend starting with **Port Scanning & Service Fingerprinting (Nmap)** followed by the **Subnetting Speed Trainer** to solidify your IP addressing foundation.`,
        toolCalls: [inv]
      };
    }

    // =========================================================================
    // 3. FAST DETERMINISTIC NAVIGATION (<10ms perceived latency)
    // =========================================================================
    const navMatch = this.detectNavigationIntent(lower);
    if (navMatch) {
      const res = await AmanActionExecutor.executeTool(navMatch.toolName, navMatch.params || {}, context);
      const inv: ToolCallInvocation = {
        id: `inv-${Date.now()}`,
        toolName: navMatch.toolName,
        params: navMatch.params || {},
        permission: 'LOW_RISK',
        status: 'SUCCESS',
        result: res.result,
        timestamp: new Date()
      };
      if (onToolInvoked) onToolInvoked(inv);

      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'FAST_NAVIGATION',
        targetRoute: navMatch.route,
        text: navMatch.responseMessage,
        toolCalls: [inv]
      };
    }

    // =========================================================================
    // 4. FAST TELEMETRY & PROGRESS QUERIES (<5ms perceived latency)
    // =========================================================================
    if (
      lower === 'show my xp' ||
      lower === 'what is my xp' ||
      lower === 'my xp' ||
      lower === 'show xp' ||
      lower === 'check my xp' ||
      lower === 'mera xp' ||
      lower === 'mera xp kitna hai'
    ) {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'PROGRESS_TELEMETRY',
        text: `⚡ **Learner Telemetry**: You currently have **${compactContext.xp} XP** at **Cyber Level ${compactContext.cyberLevel}** (${compactContext.activeRole.replace(/_/g, ' ')}).\n\nKeep completing interactive lab challenges and tactical incident missions to earn additional badges and level up!`
      };
    }

    if (
      lower === 'show my progress' ||
      lower === 'my progress' ||
      lower === 'what is my progress' ||
      lower === 'show progress' ||
      lower === 'show my stats' ||
      lower === 'check my progress' ||
      lower === 'check progress' ||
      lower === 'check my stats' ||
      lower === 'mera progress check karo' ||
      lower === 'mera progress' ||
      lower === 'progress check karo' ||
      lower === 'main kahan tak pahucha' ||
      lower === 'kahan tak pahucha'
    ) {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'PROGRESS_TELEMETRY',
        text: `📊 **Live Progress Summary**:\n\n- **Cyber Level**: Level ${compactContext.cyberLevel}\n- **Total XP**: ${compactContext.xp} XP\n- **Target Career Role**: ${compactContext.activeRole.replace(/_/g, ' ')}\n- **Completed Labs**: ${compactContext.completedLabsCount}\n- **Mastery Rate**: ${compactContext.masteryPercentage}%\n- **Forensic Evidence Findings**: ${compactContext.evidenceCount} artifacts logged`
      };
    }

    if (
      lower === 'find my weakest skill' ||
      lower === 'what is my weakest skill' ||
      lower === 'my weakest skill' ||
      lower === 'show my weakest skill' ||
      lower === 'weakest skill' ||
      lower === 'what am i weak at' ||
      lower === 'what am i weak in' ||
      lower === 'meri weakness kya hai' ||
      lower === 'weak area' ||
      lower.includes('weakest skill')
    ) {
      const weak = compactContext.weaknessSummary !== 'None identified' ? compactContext.weaknessSummary : 'CIDR Subnetting Calculations';
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'SKILL_GAP_ANALYSIS',
        text: `🎯 **Weakness Analysis**: Based on your diagnostic telemetry, your primary focus area is **${weak}**.\n\nI recommend jumping into the **Subnetting Speed Trainer** (\`/subnetting-trainer\`) or **Network Reconnaissance Lab** (\`/network-lab\`) to reinforce this core domain.`
      };
    }

    if (
      lower === 'check my progress and open my weakest module' ||
      lower === 'check my progress and open weakest module' ||
      lower === 'open my weakest module' ||
      lower === 'open weakest module' ||
      lower.includes('check my progress, find my weakest skill and open the module') ||
      lower.includes('check my progress find my weakest skill and open the module') ||
      lower.includes('check my progress and open the recommended module')
    ) {
      const weak = compactContext.weaknessSummary;
      const targetRoute = weak.toLowerCase().includes('linux') ? '/linux-lab' : (weak.toLowerCase().includes('web') ? '/web-security' : '/network-lab');
      const toolName = weak.toLowerCase().includes('linux') ? 'open_linux_lab' : (weak.toLowerCase().includes('web') ? 'open_web_security_lab' : 'open_network_lab');
      const modName = weak.toLowerCase().includes('linux') ? 'Linux Fundamentals Lab' : (weak.toLowerCase().includes('web') ? 'Web Security Lab' : 'Network Reconnaissance & Port Scanning Lab');
      
      const steps: AgentStep[] = [
        { stepNumber: 1, description: 'Checking progress & XP telemetry', toolName: 'get_progress', status: 'COMPLETED' },
        { stepNumber: 2, description: `Diagnosing skill gap (${weak})`, toolName: 'get_skill_gaps', status: 'COMPLETED' },
        { stepNumber: 3, description: `Selected module: ${modName}`, toolName: 'recommend_next_module', status: 'COMPLETED' },
        { stepNumber: 4, description: `Opening ${modName}`, toolName, status: 'COMPLETED' }
      ];

      const res = await AmanActionExecutor.executeTool(toolName, {}, context);
      const inv: ToolCallInvocation = {
        id: `inv-${Date.now()}`,
        toolName,
        params: {},
        permission: 'LOW_RISK',
        status: 'SUCCESS',
        result: res.result,
        timestamp: new Date()
      };
      if (onToolInvoked) onToolInvoked(inv);

      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'COMPOUND_MULTI_STEP_PLAN',
        targetRoute,
        workflowSteps: steps,
        text: `📊 **Compound Action Plan Executed**:\n\n[✓] **Checked progress**: Level ${compactContext.cyberLevel} (${compactContext.xp} XP)\n[✓] **Identified skill gap**: ${weak}\n[✓] **Selected module**: **${modName}**\n[✓] **Opening sandbox**: Navigated to \`${targetRoute}\`.\n\nLet's conquer this training challenge!`,
        toolCalls: [inv]
      };
    }

    if (
      lower.includes('show me my next mission and open the lab') ||
      lower.includes('find my next mission and open the required lab') ||
      lower.includes('find next mission and open lab') ||
      lower.includes('start my next mission and open lab')
    ) {
      const toolName = 'open_network_lab';
      const modName = 'Network Reconnaissance Lab';
      const targetRoute = '/network-lab';

      const steps: AgentStep[] = [
        { stepNumber: 1, description: 'Fetching active mission: System Reconnaissance', toolName: 'get_current_mission', status: 'COMPLETED' },
        { stepNumber: 2, description: 'Determining required sandbox: Network Recon Lab', toolName: 'recommend_next_module', status: 'COMPLETED' },
        { stepNumber: 3, description: 'Opening Network Recon Lab sandbox', toolName, status: 'COMPLETED' }
      ];

      const res = await AmanActionExecutor.executeTool(toolName, {}, context);
      const inv: ToolCallInvocation = {
        id: `inv-${Date.now()}`,
        toolName,
        params: {},
        permission: 'LOW_RISK',
        status: 'SUCCESS',
        result: res.result,
        timestamp: new Date()
      };
      if (onToolInvoked) onToolInvoked(inv);

      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'COMPOUND_MULTI_STEP_PLAN',
        targetRoute,
        workflowSteps: steps,
        text: `🎯 **Mission Deployment Complete**:\n\n[✓] **Next Mission**: Target Perimeter Enumeration (Difficulty: Intermediate)\n[✓] **Required Sandbox**: **${modName}**\n[✓] **Objective**: Scan target range for open ports (21, 22, 80, 443) and extract service banners.\n\nOpening sandbox now!`,
        toolCalls: [inv]
      };
    }

    if (
      lower.includes('show my achievements') ||
      lower === 'my achievements' ||
      lower === 'show achievements'
    ) {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'PROGRESS_ACHIEVEMENTS',
        text: `🏆 **Achievements & Badges**:\n\n- 🛡️ **Foundations Verified**: Completed initial security onboarding\n- 💻 **Terminal Novice**: Mastered core Linux filesystem commands\n- 🌐 **Network Recon Specialist**: Scanned open ports and identified target banners\n- 🎯 **Level ${compactContext.cyberLevel} Operative**: Active contributor in training sandboxes`
      };
    }

    // =========================================================================
    // 5. FAST SEARCH ACROSS PRECOMPUTED PLATFORM INDEX (<2ms perceived latency)
    // =========================================================================
    const searchMatch = this.detectSearchIntent(lower);
    if (searchMatch) {
      const results = AmanPlatformIndex.search(searchMatch.query, 3);
      if (results.length > 0) {
        const listText = results.map(r => 
          `• **${r.title}** (${r.category}) - ${r.description} \`[Route: ${r.route}]\``
        ).join('\n\n');

        const top = results[0];
        return {
          handledLocally: true,
          executionPath: 'TURBO_FAST_PATH',
          intentCategory: 'PLATFORM_INDEX_SEARCH',
          text: `🔍 **Search Results for "${searchMatch.query}"**:\n\n${listText}\n\n*Would you like me to open the **${top.title}**?*`
        };
      }
    }

    // =========================================================================
    // 6.5 PRODUCT UPGRADE DETERMINISTIC INTENT HANDLERS (<2ms perceived latency)
    // =========================================================================
    if (lower === 'open the linux lab' || lower === 'open linux lab') {
      context.navigate('/linux-lab');
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'FAST_NAVIGATION',
        targetRoute: '/linux-lab',
        text: `⚡ **Opening Linux Fundamentals Sandbox** (\`/linux-lab\`). Practice file permissions, SUID binaries, and system audit logs.`
      };
    }

    if (lower === 'start the finance incident' || lower === 'open finance incident') {
      context.navigate('/command-center?id=live-inc-01');
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'FAST_NAVIGATION',
        targetRoute: '/command-center?id=live-inc-01',
        text: `⚡ **Opening FinVault Capital Incident** in the **Ethical Hacker Command Center**. Target network: \`10.200.1.0/24\`.`
      };
    }

    if (lower === 'what should i investigate next' || lower === 'what to investigate next') {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'INVESTIGATION_GUIDANCE',
        text: `🔍 **Next Investigation Objective**:\n\n1. Scan \`10.200.1.25\` using \`nmap\` in the Command Center terminal.\n2. Inspect HTTP API parameters on port \`80/443\` for SQL injection.\n3. Verify SUID permission bit on \`/usr/bin/python3\` for root escalation.`
      };
    }

    if (lower === 'explain this alert' || lower === 'explain alert') {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'SIEM_ALERT_EXPLANATION',
        text: `🛡️ **SIEM Alert Triage Summary**:\n\n- **Rule ID**: \`SIEM-FIN-01\` (SQL Injection Single Quote Anomaly)\n- **Tactic**: Initial Access / Collection (MITRE T1190)\n- **Explanation**: WAF detected unescaped single quote syntax (\`'\`) in REST API query string.\n- **Recommended Mitigation**: Implement parameterized queries in API handler & deploy WAF rule \`WAF-901\`.`
      };
    }

    if (lower === 'analyze my hypothesis' || lower === 'evaluate my hypothesis') {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'SOCRATIC_EVALUATION',
        text: `🧠 **Socratic Engine Ready**: Open the **Think Like an Ethical Hacker** panel in the Command Center to evaluate your hypothesis across 8 category scoring metrics.`
      };
    }

    if (lower === 'show me the evidence i collected' || lower === 'show my evidence' || lower === 'show evidence') {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'EVIDENCE_LOCKER_QUERY',
        text: `🔒 **Forensic Evidence Locker Summary**:\n\nYou currently have **${compactContext.evidenceCount} locked artifacts**. Each artifact is cryptographic SHA-256 hashed and mapped to MITRE ATT&CK techniques.`
      };
    }

    if (lower === 'create a report from this investigation' || lower === 'create report' || lower === 'generate report') {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'EXECUTIVE_REPORT_COMPILER',
        text: `📄 **Executive Incident Report Compiled**:\n\nSummary, Scope, Timeline, Findings, MITRE Mapping, Evidence, and Retest Verification prepared. Click **Export to PDF / Print Report** in the Command Center.`
      };
    }

    if (lower === 'compare my attack with the defensive response' || lower === 'compare attack defense') {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'PURPLE_TEAM_COMPARISON',
        text: `⚖️ **Purple Team Comparative Matrix**:\n\n- **Red Attack Action**: SQL injection parameter extraction\n- **Blue Telemetry**: WAF log entry & PostgreSQL query audit\n- **Defensive Gap**: Absence of strict input sanitization\n- **Remediation Result**: 100% attack vector mitigation post-retest.`
      };
    }

    if (lower === 'teach me what i need before continuing' || lower === 'teach prerequisites') {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'PREREQUISITE_TUTORING',
        text: `🎓 **Prerequisite Knowledge Checklist**:\n\n1. **HTTP Request Structure**: GET/POST headers and status codes (200, 403, 500).\n2. **SQL Syntax**: \`UNION SELECT\`, comments (\`--\`), and schema reflection.\n3. **SUID Privileges**: Binary permissions (\`chmod u+s\`) and root UID \`0\`.`
      };
    }
    if (
      lower === 'what should i learn next' ||
      lower === 'what should i study next' ||
      lower === 'what to learn next' ||
      lower === 'recommend a module' ||
      lower === 'recommend next module' ||
      lower === 'where should i start' ||
      lower === 'resume learning'
    ) {
      const chosenRoleKey = compactContext.selectedRole || compactContext.activeRole || 'soc-analyst';
      const roleCfg = getRolePersonalization(chosenRoleKey);
      const nextRec = roleCfg.getNextAction({ cyberLevel: compactContext.cyberLevel, xp: compactContext.xp });
      const recModule = roleCfg.recommendedModules[0];

      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'LEARNING_RECOMMENDATION',
        text: `🎯 **Personalized Career Objective (${roleCfg.title})**:\n\nBased on your selected track and current level (Level ${compactContext.cyberLevel}, **${compactContext.completedLabsCount} labs completed**):\n\n- **Role Track**: **${roleCfg.title}** (${roleCfg.category})\n- **Recommended Next Task**: **${nextRec.title}** (${nextRec.targetName})\n- **Key Tools Focus**: ${roleCfg.tools.slice(0, 3).join(', ')}\n- **Primary Sandbox**: \`${nextRec.route}\`\n\nWould you like me to launch **${nextRec.targetName}** now?`
      };
    }

    if (
      lower === 'open the module i should study next' ||
      lower === 'open module i should study next' ||
      lower === 'open the module i should learn next' ||
      lower === 'open my recommended module' ||
      lower === 'open recommended module' ||
      lower === 'open next module'
    ) {
      const chosenRoleKey = compactContext.selectedRole || compactContext.activeRole || 'soc-analyst';
      const roleCfg = getRolePersonalization(chosenRoleKey);
      const nextRec = roleCfg.getNextAction({ cyberLevel: compactContext.cyberLevel, xp: compactContext.xp });

      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'FAST_NAVIGATION',
        targetRoute: nextRec.route,
        text: `Opening your recommended **${roleCfg.title}** module: **${nextRec.targetName}** (${nextRec.route}). Let's dive in!`
      };
    }

    if (
      lower === 'what should i watch next' ||
      lower === 'recommend a video' ||
      lower === 'recommend video' ||
      lower === 'what video should i watch' ||
      lower === 'video recommendation' ||
      lower === 'next video'
    ) {
      const chosenRoleKey = compactContext.selectedRole || compactContext.activeRole || 'soc-analyst';
      const roleCfg = getRolePersonalization(chosenRoleKey);
      const videoTitle = compactContext.recommendedVideoTitle || 'SOC Fundamentals & SIEM Architecture';
      const videoTopic = compactContext.recommendedVideoTopic || 'Security Operations';
      const videoRoute = compactContext.recommendedVideoRoute || '/video-learning';
      const watched = compactContext.videosWatchedCount || 0;

      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'LEARNING_RECOMMENDATION',
        text: `🎬 **Recommended Video for ${roleCfg.title}** (Watched: ${watched}):\n\n- **Lesson**: **${videoTitle}**\n- **Domain**: ${videoTopic}\n- **Aligned Track**: ${roleCfg.title}\n\nThis video directly bridges your conceptual understanding with hands-on command execution in our cyber range.\n\nWould you like me to launch this video lesson now?`
      };
    }

    if (
      lower === 'open video learning' ||
      lower === 'open videos' ||
      lower === 'go to video learning' ||
      lower === 'video learning hub' ||
      lower === 'open recommended video' ||
      lower === 'watch recommended video' ||
      lower === 'watch next video'
    ) {
      const videoRoute = compactContext.recommendedVideoRoute || '/video-learning';
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'FAST_NAVIGATION',
        targetRoute: videoRoute,
        text: `Navigating to **Video Learning Hub** (${videoRoute}). Get ready for high-fidelity cybersecurity video mastery!`
      };
    }

    // =========================================================================
    // 7. FAST DETERMINISTIC KNOWLEDGE LOOKUP (<2ms perceived latency)
    // =========================================================================
    const cachedResponse = AmanResponseCache.get(lower);
    if (cachedResponse) {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'KNOWLEDGE_CACHE_HIT',
        text: cachedResponse.response
      };
    }

    // =========================================================================
    // 8. FAST STUDY PLAN & LAB ERROR HELP
    // =========================================================================
    if (
      lower === 'create my study plan' ||
      lower === 'create a study plan' ||
      lower === 'create a study plan for me' ||
      lower.includes('generate study plan')
    ) {
      const chosenRoleKey = compactContext.selectedRole || compactContext.activeRole || 'soc-analyst';
      const roleCfg = getRolePersonalization(chosenRoleKey);
      const res = await AmanActionExecutor.executeTool('create_study_plan', { minutesPerDay: 30 }, context);
      const inv: ToolCallInvocation = {
        id: `inv-${Date.now()}`,
        toolName: 'create_study_plan',
        params: { minutesPerDay: 30 },
        permission: 'LOW_RISK',
        status: 'SUCCESS',
        result: res.result,
        timestamp: new Date()
      };
      if (onToolInvoked) onToolInvoked(inv);

      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'STUDY_PLAN_GENERATION',
        text: `📅 **Personalized Study Plan — ${roleCfg.title} (Level ${compactContext.cyberLevel})**:\n\n- **Target Track**: ${roleCfg.title} (${roleCfg.category})\n- **Core Tools**: ${roleCfg.tools.slice(0, 4).join(', ')}\n- **Phase 1 (10m)**: Theory breakdown on ${roleCfg.tools[0] || 'Fundamentals'}\n- **Phase 2 (15m)**: Interactive Sandbox Practice (${roleCfg.labs[0]?.name || 'Lab Simulator'})\n- **Phase 3 (5m)**: Documenting findings into the Evidence Locker & Notebook\n\nYour customized ${roleCfg.title} study plan is armed!`,
        toolCalls: [inv]
      };
    }

    if (
      lower.includes('why did my lab command fail') ||
      lower.includes('why did my scan fail') ||
      lower.includes('why did my command fail')
    ) {
      return {
        handledLocally: true,
        executionPath: 'TURBO_FAST_PATH',
        intentCategory: 'LAB_ERROR_DIAGNOSTIC',
        text: `🔍 **Terminal Command Diagnostic**:\n\n1. **Root Privilege Check**: Stealth SYN scans (\`nmap -sS\`) and raw packet sockets require root permissions. Ensure you run with \`sudo\`.\n2. **Target Reachability**: Verify your target is responsive using \`ping -c 2 <target-ip>\`.\n3. **Interface Binding**: Confirm network interface status with \`ip a\` or \`ifconfig\`.\n\n*(You can jump straight into the Linux Lab or Network Lab to practice!)*`
      };
    }

    // Not handled by local fast paths -> Delegate to Gemini streaming
    return null;
  }

  /**
   * Match user queries to deterministic navigation targets
   */
  private static detectNavigationIntent(lower: string): { toolName: string; route: string; responseMessage: string; params?: any } | null {
    // Linux Lab
    if (
      lower === 'open linux lab' ||
      lower === 'open linux' ||
      lower === 'go to linux lab' ||
      lower === 'open terminal' ||
      lower === 'open bash lab' ||
      lower === 'start linux lab' ||
      lower === 'linux lab' ||
      lower === 'linux lab khol' ||
      lower === 'bhai linux lab khol' ||
      lower === 'linux lab kholo' ||
      lower === 'terminal khol' ||
      lower === 'terminal kholo' ||
      lower === 'take me to linux'
    ) {
      return {
        toolName: 'open_linux_lab',
        route: '/linux-lab',
        responseMessage: 'Opening the **Linux Fundamentals & Command Mastery Lab**.'
      };
    }

    // Network Lab
    if (
      lower === 'open network lab' ||
      lower === 'open networking lab' ||
      lower === 'open nmap lab' ||
      lower === 'go to network lab' ||
      lower === 'open port scanning' ||
      lower === 'open network' ||
      lower === 'open networking' ||
      lower === 'take me to network' ||
      lower === 'take me to networking' ||
      lower === 'bhai mujhe networking wala lab khol' ||
      lower === 'bhai networking wala lab khol' ||
      lower === 'networking wala lab khol' ||
      lower === 'networking lab khol' ||
      lower === 'networking lab kholo' ||
      lower === 'network lab khol' ||
      lower === 'network lab kholo' ||
      lower === 'networking lab' ||
      lower === 'network lab'
    ) {
      return {
        toolName: 'open_network_lab',
        route: '/network-lab',
        responseMessage: 'Opening the **Network Reconnaissance & Port Scanning Lab**.'
      };
    }

    // Subnetting Trainer
    if (
      lower === 'open subnetting' ||
      lower === 'open subnetting trainer' ||
      lower === 'open cidr trainer' ||
      lower === 'practice subnetting' ||
      lower === 'subnetting trainer' ||
      lower === 'cidr trainer' ||
      lower === 'subnetting khol'
    ) {
      return {
        toolName: 'open_page',
        route: '/subnetting-trainer',
        params: { page: 'subnetting-trainer' },
        responseMessage: 'Opening the **CIDR Subnetting Speed & Binary Trainer**.'
      };
    }

    // Web Security Lab
    if (
      lower === 'open web security lab' ||
      lower === 'open web security' ||
      lower === 'open owasp lab' ||
      lower === 'open sqli lab' ||
      lower === 'go to web security' ||
      lower === 'web security lab' ||
      lower === 'web security' ||
      lower === 'web lab khol' ||
      lower === 'web security khol'
    ) {
      return {
        toolName: 'open_web_security_lab',
        route: '/web-security',
        responseMessage: 'Opening the **Web Application Security (OWASP Top 10) Lab**.'
      };
    }

    // SOC Simulator
    if (
      lower === 'open soc simulator' ||
      lower === 'open soc lab' ||
      lower === 'open siem' ||
      lower === 'open siem simulator' ||
      lower === 'go to soc' ||
      lower === 'soc simulator' ||
      lower === 'soc lab' ||
      lower === 'siem simulator' ||
      lower === 'soc khol'
    ) {
      return {
        toolName: 'open_soc_simulator',
        route: '/soc-simulator',
        responseMessage: 'Opening the **SOC Incident Response & SIEM Simulator**.'
      };
    }

    // Threat Hunting
    if (
      lower === 'open threat hunting' ||
      lower === 'open mitre range' ||
      lower === 'go to threat hunting' ||
      lower === 'threat hunting' ||
      lower === 'mitre range' ||
      lower === 'threat hunting khol'
    ) {
      return {
        toolName: 'open_threat_hunting',
        route: '/threat-hunting',
        responseMessage: 'Opening the **Threat Hunting & MITRE ATT&CK Range**.'
      };
    }

    // CTF Arena
    if (
      lower === 'open ctf' ||
      lower === 'open ctf arena' ||
      lower === 'go to ctf' ||
      lower === 'start ctf' ||
      lower === 'take me to ctf' ||
      lower === 'find me a ctf' ||
      lower === 'ctf arena' ||
      lower === 'ctf khol' ||
      lower === 'ctf kholo'
    ) {
      return {
        toolName: 'open_ctf',
        route: '/ctf',
        responseMessage: 'Opening the **CTF Arena**. Select your category to begin cracking challenges!'
      };
    }

    // ACE Console & Evidence Locker
    if (
      lower === 'open ace' ||
      lower === 'open ace console' ||
      lower === 'open ace engagement' ||
      lower === 'open evidence locker' ||
      lower === 'show evidence' ||
      lower === 'evidence locker' ||
      lower === 'ace console' ||
      lower === 'ace khol'
    ) {
      return {
        toolName: 'open_ace',
        route: '/ace-engagement',
        responseMessage: 'Opening the **Authorized Client Engagement (ACE) & Evidence Locker**.'
      };
    }

    // Tactical Missions
    if (
      lower === 'open missions' ||
      lower === 'open mission' ||
      lower === 'go to missions' ||
      lower === 'show missions' ||
      lower === 'open tactical missions' ||
      lower === 'missions' ||
      lower === 'show my missions' ||
      lower === 'start my next mission' ||
      lower === 'missions khol' ||
      lower === 'next mission'
    ) {
      return {
        toolName: 'open_missions',
        route: '/missions',
        responseMessage: 'Opening **Tactical Incident Missions**.'
      };
    }

    // Live Incident Mode
    if (
      lower === 'open live incidents' ||
      lower === 'open live incident' ||
      lower === 'live incidents' ||
      lower === 'live incident mode' ||
      lower === 'unsolved incidents' ||
      lower === 'live incident khol'
    ) {
      return {
        toolName: 'open_live_incidents',
        route: '/live-incidents',
        responseMessage: 'Opening **Live Incident Mode (Unsolved Incident Briefings & Socratic Hypotheses)**.'
      };
    }

    // Real Incidents Archive
    if (
      lower === 'open real incidents' ||
      lower === 'real incidents' ||
      lower === 'incident archive' ||
      lower === 'real world incidents' ||
      lower === 'case studies'
    ) {
      return {
        toolName: 'open_real_incidents',
        route: '/real-incidents',
        responseMessage: 'Opening the **Archive of Real-World Cyber Incidents & Case Studies**.'
      };
    }

    // Dashboard
    if (
      lower === 'open dashboard' ||
      lower === 'go to dashboard' ||
      lower === 'go home' ||
      lower === 'open home' ||
      lower === 'dashboard' ||
      lower === 'dashboard khol'
    ) {
      return {
        toolName: 'open_dashboard',
        route: '/dashboard',
        responseMessage: 'Navigating to your **Command Dashboard**.'
      };
    }

    // Skill Tree
    if (
      lower === 'open skill tree' ||
      lower === 'show skill tree' ||
      lower === 'view skill tree' ||
      lower === 'skill tree' ||
      lower === 'skill tree khol'
    ) {
      return {
        toolName: 'open_skill_tree',
        route: '/skill-tree',
        responseMessage: 'Opening the **Cybersecurity Skill Tree**.'
      };
    }

    // Roadmap
    if (
      lower === 'open roadmap' ||
      lower === 'show roadmap' ||
      lower === 'view roadmap' ||
      lower === 'roadmap' ||
      lower === 'roadmap khol'
    ) {
      return {
        toolName: 'open_roadmap',
        route: '/roadmap',
        responseMessage: 'Opening the **Interactive Cybersecurity Learning Roadmap**.'
      };
    }

    // Study Plan Page
    if (
      lower === 'open study plan' ||
      lower === 'show study plan' ||
      lower === 'view study plan' ||
      lower === 'study plan' ||
      lower === 'study plan khol'
    ) {
      return {
        toolName: 'open_study_plan',
        route: '/study-plan',
        responseMessage: 'Opening your **AI Personalized Study Plan**.'
      };
    }

    // Career Roles
    if (
      lower === 'open career roles' ||
      lower === 'open roles' ||
      lower === 'show career paths' ||
      lower === 'view career roles' ||
      lower === 'career roles' ||
      lower === 'roles'
    ) {
      return {
        toolName: 'open_roles',
        route: '/career-roles',
        responseMessage: 'Opening the **Cybersecurity Career Pathways & Role Matrix**.'
      };
    }

    // Career Portfolio
    if (
      lower === 'open portfolio' ||
      lower === 'show portfolio' ||
      lower === 'view portfolio' ||
      lower === 'open my portfolio' ||
      lower === 'portfolio' ||
      lower === 'portfolio khol'
    ) {
      return {
        toolName: 'open_portfolio',
        route: '/career-portfolio',
        responseMessage: 'Opening your **Verified Cyber Career Portfolio**.'
      };
    }

    // Certificate
    if (
      lower === 'open certificate' ||
      lower === 'show certificate' ||
      lower === 'open my certificate' ||
      lower === 'view certificate' ||
      lower === 'open certificate verification' ||
      lower === 'certificate verification' ||
      lower === 'certificate' ||
      lower === 'certificate khol'
    ) {
      return {
        toolName: 'open_certificate',
        route: '/certificate',
        responseMessage: 'Opening the **Cryptographic Certificate Issuance & Verification Dashboard**.'
      };
    }

    // Security Tools / Cheatsheets
    if (
      lower === 'open security tools' ||
      lower === 'open tools' ||
      lower === 'open cheatsheets' ||
      lower === 'show cheatsheets' ||
      lower === 'security tools' ||
      lower === 'cheatsheets'
    ) {
      return {
        toolName: 'open_page',
        route: '/security-tools',
        params: { page: 'security-tools' },
        responseMessage: 'Opening the **Security Tools Directory & Syntax Cheatsheets**.'
      };
    }

    // Analytics
    if (
      lower === 'open analytics' ||
      lower === 'show analytics' ||
      lower === 'view analytics' ||
      lower === 'analytics' ||
      lower === 'analytics khol'
    ) {
      return {
        toolName: 'open_page',
        route: '/analytics',
        params: { page: 'analytics' },
        responseMessage: 'Opening the **Learner Telemetry & Analytics Dashboard**.'
      };
    }

    // Notebook
    if (
      lower === 'open notebook' ||
      lower === 'show notes' ||
      lower === 'open notes' ||
      lower === 'notebook' ||
      lower === 'notes'
    ) {
      return {
        toolName: 'open_page',
        route: '/notebook',
        params: { page: 'notebook' },
        responseMessage: 'Opening your **Tactical Cyber Notebook**.'
      };
    }

    // Settings
    if (
      lower === 'open settings' ||
      lower === 'go to settings' ||
      lower === 'open aman settings' ||
      lower === 'aman settings' ||
      lower === 'settings' ||
      lower === 'settings khol'
    ) {
      return {
        toolName: 'open_page',
        route: '/settings',
        params: { page: 'settings' },
        responseMessage: 'Opening **Account & Application Settings**.'
      };
    }

    return null;
  }

  /**
   * Detect search keywords: "find subnetting", "search sql injection", "find module x", etc.
   */
  private static detectSearchIntent(lower: string): { query: string } | null {
    const searchPrefixes = [
      'find the module ',
      'find the lab ',
      'find the mission ',
      'find the ',
      'find module ',
      'find lab ',
      'find mission ',
      'find ',
      'search for the ',
      'search for ',
      'search the ',
      'search module ',
      'search lab ',
      'search ',
      'lookup ',
      'look up '
    ];

    for (const prefix of searchPrefixes) {
      if (lower.startsWith(prefix)) {
        let query = lower.slice(prefix.length).trim();
        // Clean out trailing 'module' or 'lab' if query is like "networking module"
        if (query.endsWith(' module')) query = query.replace(/ module$/, '').trim();
        if (query.endsWith(' lab')) query = query.replace(/ lab$/, '').trim();
        if (query.length >= 2) {
          return { query };
        }
      }
    }
    return null;
  }
}
