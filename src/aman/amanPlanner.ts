/**
 * AMAN Agent Runtime v3 - Planner & Multi-Step Execution Engine
 * Handles goal decomposition, loop protection, casual conversation isolation,
 * entity resolution ("that", "it", "something harder"), and multi-tool orchestration.
 */

import { AmanToolRegistryV3 } from './amanToolRegistryV3';
import { AmanExecutionContext } from './amanTools';
import { 
  AmanAgentState, 
  ExecutionPlanStep, 
  RuntimePlan, 
  ToolResult, 
  ConversationalMemoryItem 
} from './amanRuntimeTypes';
import { AmanIntentEngine, IntentClassificationResult } from './amanIntentEngine';

export interface PlanExecutionResult {
  status: 'COMPLETED' | 'HALTED' | 'FAILED' | 'CONFIRMATION_REQUIRED';
  stepsExecuted: number;
  finalMessage: string;
  plan: RuntimePlan;
  lastToolResult?: ToolResult;
  requiresConfirmation?: {
    toolName: string;
    params: any;
    prompt: string;
  };
}

export class AmanPlanner {
  private static MAX_TOOL_CALLS = 8;

  /**
   * Evaluates whether a user message is purely casual or social conversation.
   * If true, zero tool calls are made and no course context is appended.
   */
  public static isCasualConversation(message: string): boolean {
    const classification = AmanIntentEngine.classifyIntent(message);
    return classification.isCasual;
  }

  /**
   * Generates natural conversational response for casual prompts without any tool calls.
   * English is the primary response language.
   */
  public static getCasualResponse(message: string, operatorName: string = 'Operator'): string {
    const classification = AmanIntentEngine.classifyIntent(message);
    if (classification.conversationalResponse) {
      return classification.conversationalResponse;
    }
    return "I'm doing great! 😄 How about you?";
  }

  /**
   * Decomposes user goal into an ordered multi-step execution plan based on detected intent
   */
  public static createPlan(
    goal: string,
    context: AmanExecutionContext,
    recentMemory: ConversationalMemoryItem[] = []
  ): RuntimePlan {
    const classification = AmanIntentEngine.classifyIntent(goal, recentMemory, context.currentRoute || '/');
    const planId = `plan_${Date.now()}`;
    const steps: ExecutionPlanStep[] = [];

    // CHAT_MODE: Zero tool calls for casual greetings, small talk, and social banter
    if (classification.mode === 'CHAT_MODE') {
      return {
        id: planId,
        goal,
        steps: [],
        status: 'COMPLETED',
        currentStepIndex: 0
      };
    }

    const q = goal.toLowerCase();
    const lastEntity = classification.resolvedEntity || {
      category: 'web',
      targetId: 'SOC-001',
      route: '/flag-checkpoint'
    };

    // Scenario A: "Open my unsolved web-security challenge and start the machine."
    if (
      (q.includes('unsolved') || q.includes('challenge') || q.includes('mission')) &&
      (q.includes('start') || q.includes('prepare') || q.includes('launch')) &&
      (q.includes('machine') || q.includes('lab') || q.includes('sandbox'))
    ) {
      const category = q.includes('web') ? 'web' : (q.includes('linux') ? 'linux' : (q.includes('soc') ? 'soc' : undefined));
      const targetMissionId = lastEntity.targetId || (category === 'web' ? 'WEB-002' : 'SOC-001');

      steps.push({
        stepNumber: 1,
        toolName: 'getCurrentPage',
        description: 'Verify current route and state',
        params: {},
        riskLevel: 'low',
        status: 'PENDING'
      });
      steps.push({
        stepNumber: 2,
        toolName: 'getUserProgress',
        description: 'Retrieve learner level and completed modules',
        params: {},
        riskLevel: 'low',
        status: 'PENDING'
      });
      steps.push({
        stepNumber: 3,
        toolName: 'getUnsolvedMissions',
        description: `Fetch unfinished ${category || 'tactical'} challenges`,
        params: { category, sort: q.includes('hard') ? 'hardest' : 'asc' },
        riskLevel: 'low',
        status: 'PENDING'
      });
      steps.push({
        stepNumber: 4,
        toolName: 'createLab',
        description: 'Allocate authorized sandbox environment',
        params: { missionId: targetMissionId, tier: 'PRO' },
        riskLevel: 'medium',
        status: 'PENDING'
      });
      steps.push({
        stepNumber: 5,
        toolName: 'startLab',
        description: 'Boot containerized target machine',
        params: { missionId: targetMissionId },
        riskLevel: 'medium',
        status: 'PENDING'
      });
      steps.push({
        stepNumber: 6,
        toolName: 'navigate',
        description: 'Navigate learner to the active challenge interface',
        params: { route: '/flag-checkpoint' },
        riskLevel: 'low',
        status: 'PENDING'
      });
      steps.push({
        stepNumber: 7,
        toolName: 'startMission',
        description: `Launch challenge ${targetMissionId}`,
        params: { missionId: targetMissionId },
        riskLevel: 'low',
        status: 'PENDING'
      });

      return {
        id: planId,
        goal,
        steps,
        status: 'PROPOSED',
        currentStepIndex: 0
      };
    }

    // Scenario B: "Open that." / "Open it."
    if (/^(open that|open it|launch that|start that|take me there)$/i.test(q.trim())) {
      const targetRoute = lastEntity.route || '/flag-checkpoint';
      steps.push({
        stepNumber: 1,
        toolName: 'navigate',
        description: `Navigate to target element: ${targetRoute}`,
        params: { route: targetRoute },
        riskLevel: 'low',
        status: 'PENDING'
      });
      return { id: planId, goal, steps, status: 'PROPOSED', currentStepIndex: 0 };
    }

    // Scenario C: "Give me something harder" / "Make it harder"
    if (/something harder|harder challenge|give me something harder|harder mission|make it harder|increase difficulty/i.test(q)) {
      steps.push({
        stepNumber: 1,
        toolName: 'getUnsolvedMissions',
        description: 'Retrieve unsolved missions sorted by highest difficulty',
        params: { category: lastEntity.category || 'web', sort: 'hardest' },
        riskLevel: 'low',
        status: 'PENDING'
      });
      steps.push({
        stepNumber: 2,
        toolName: 'startMission',
        description: 'Open the hardest available mission',
        params: { missionId: 'WEB-003' },
        riskLevel: 'low',
        status: 'PENDING'
      });
      return { id: planId, goal, steps, status: 'PROPOSED', currentStepIndex: 0 };
    }

    // Scenario D: Challenge Discovery ("Open my unsolved web challenges", "Find unsolved queries")
    if (classification.intent === 'CHALLENGE_DISCOVERY' || q.includes('unsolved')) {
      const category = q.includes('web') ? 'web' : (q.includes('linux') ? 'linux' : (q.includes('soc') ? 'soc' : undefined));
      steps.push({
        stepNumber: 1,
        toolName: 'getUnsolvedMissions',
        description: `Fetch unsolved ${category || 'cyber'} challenges`,
        params: { category, sort: 'asc' },
        riskLevel: 'low',
        status: 'PENDING'
      });
      steps.push({
        stepNumber: 2,
        toolName: 'navigate',
        description: 'Navigate to Flag Checkpoint and Unsolved Queries',
        params: { route: '/flag-checkpoint' },
        riskLevel: 'low',
        status: 'PENDING'
      });
      return { id: planId, goal, steps, status: 'PROPOSED', currentStepIndex: 0 };
    }

    // Scenario E: Progress queries ("What's my progress?", "How am I doing?")
    if (classification.intent === 'PROGRESS') {
      steps.push({
        stepNumber: 1,
        toolName: 'getUserProgress',
        description: 'Retrieve user XP, level, and completed labs',
        params: {},
        riskLevel: 'low',
        status: 'PENDING'
      });
      return { id: planId, goal, steps, status: 'PROPOSED', currentStepIndex: 0 };
    }

    // Scenario F: Roadmap navigation
    if (classification.intent === 'ROADMAP' || q.includes('roadmap')) {
      steps.push({
        stepNumber: 1,
        toolName: 'navigate',
        description: 'Navigate to Cybersecurity Roadmap',
        params: { route: '/roadmap' },
        riskLevel: 'low',
        status: 'PENDING'
      });
      return { id: planId, goal, steps, status: 'PROPOSED', currentStepIndex: 0 };
    }

    // Scenario G: Dashboard navigation
    if (q.includes('dashboard')) {
      steps.push({
        stepNumber: 1,
        toolName: 'navigate',
        description: 'Navigate to Command Dashboard',
        params: { route: '/dashboard' },
        riskLevel: 'low',
        status: 'PENDING'
      });
      return { id: planId, goal, steps, status: 'PROPOSED', currentStepIndex: 0 };
    }

    // Scenario H: Lab controls ("start my cyber lab", "start machine", "status of machine")
    if (classification.intent === 'LAB_CONTROL' || (q.includes('start') && (q.includes('machine') || q.includes('lab')))) {
      steps.push({
        stepNumber: 1,
        toolName: 'createLab',
        description: 'Allocate authorized lab container session',
        params: { missionId: lastEntity.targetId || 'SOC-001', tier: 'PRO' },
        riskLevel: 'medium',
        status: 'PENDING'
      });
      steps.push({
        stepNumber: 2,
        toolName: 'startLab',
        description: 'Start isolated training container',
        params: { missionId: lastEntity.targetId || 'SOC-001' },
        riskLevel: 'medium',
        status: 'PENDING'
      });
      return { id: planId, goal, steps, status: 'PROPOSED', currentStepIndex: 0 };
    }

    // Scenario I: Verification / Flag submission
    if (q.includes('flag{') || q.includes('mcl{') || q.includes('submit flag') || (q.includes('verify') && !q.includes('progress'))) {
      const match = goal.match(/(?:FLAG|MCL)\{[A-Za-z0-9_]+\}/i);
      const flagToken = match ? match[0] : goal;
      steps.push({
        stepNumber: 1,
        toolName: 'verifyMission',
        description: 'Authoritatively verify flag with server',
        params: { missionId: lastEntity.targetId || 'SOC-001', submission: flagToken },
        riskLevel: 'medium',
        status: 'PENDING'
      });
      return { id: planId, goal, steps, status: 'PROPOSED', currentStepIndex: 0 };
    }

    // Scenario J: Continue / Resume Command
    if (classification.intent === 'COMMAND' && (q.includes('continue') || q.includes('resume') || q.includes('aage badho'))) {
      const targetRoute = lastEntity.route || '/learning-path';
      steps.push({
        stepNumber: 1,
        toolName: 'navigate',
        description: `Resume learning at: ${targetRoute}`,
        params: { route: targetRoute },
        riskLevel: 'low',
        status: 'PENDING'
      });
      return { id: planId, goal, steps, status: 'PROPOSED', currentStepIndex: 0 };
    }

    // If no tools required (e.g. learning explanation or technical help)
    return { id: planId, goal, steps: [], status: 'COMPLETED', currentStepIndex: 0 };
  }

  /**
   * Executes a multi-step plan with strict loop protection and safety boundaries.
   */
  public static async executePlan(
    plan: RuntimePlan,
    context: AmanExecutionContext,
    onStepUpdate?: (step: ExecutionPlanStep, state: AmanAgentState) => void,
    userConfirmationGranted: boolean = false
  ): Promise<PlanExecutionResult> {
    plan.status = 'EXECUTING';
    let executedCount = 0;
    let lastResult: ToolResult | undefined;

    // Loop Protection Tracker: tracks (toolName + JSON.stringify(params))
    const callSignatureHistory: string[] = [];

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      plan.currentStepIndex = i;

      // 1. Max Tool Calls Limit check
      if (executedCount >= this.MAX_TOOL_CALLS) {
        plan.status = 'HALTED';
        return {
          status: 'HALTED',
          stepsExecuted: executedCount,
          finalMessage: `Loop protection triggered: Maximum limit of ${this.MAX_TOOL_CALLS} tool actions reached in a single turn.`,
          plan,
          lastToolResult: lastResult
        };
      }

      // 2. Repeated Action Loop Protection Check
      const signature = `${step.toolName}:${JSON.stringify(step.params)}`;
      const identicalCalls = callSignatureHistory.filter(s => s === signature).length;
      if (identicalCalls >= 2) {
        plan.status = 'HALTED';
        return {
          status: 'HALTED',
          stepsExecuted: executedCount,
          finalMessage: "I'm unable to complete that automatically. I'll leave you at the current step.",
          plan,
          lastToolResult: lastResult
        };
      }
      callSignatureHistory.push(signature);

      // Notify state machine: PLANNING -> EXECUTING
      if (onStepUpdate) {
        step.status = 'RUNNING';
        onStepUpdate(step, 'EXECUTING');
      }

      // 3. Authorization & Execution
      const result = await AmanToolRegistryV3.executeTool(
        step.toolName,
        step.params,
        context,
        userConfirmationGranted
      );

      step.result = result;
      lastResult = result;
      executedCount++;

      // Check if confirmation was required
      if (!result.success && result.error?.code === 'CONFIRMATION_REQUIRED') {
        plan.status = 'HALTED';
        if (onStepUpdate) onStepUpdate(step, 'AWAITING_PERMISSION');
        return {
          status: 'CONFIRMATION_REQUIRED',
          stepsExecuted: executedCount,
          finalMessage: `Confirmation required: ${result.error.message}`,
          plan,
          lastToolResult: result,
          requiresConfirmation: {
            toolName: step.toolName,
            params: step.params,
            prompt: result.error.message
          }
        };
      }

      // Check for Entitlement or Auth failure
      if (!result.success && (result.error?.code === 'ENTITLEMENT_REQUIRED' || result.error?.code === 'AUTH_REQUIRED' || result.error?.code === 'FORBIDDEN_CROSS_TENANT_ACCESS')) {
        step.status = 'FAILED';
        plan.status = 'FAILED';
        if (onStepUpdate) onStepUpdate(step, 'OBSERVING');
        return {
          status: 'FAILED',
          stepsExecuted: executedCount,
          finalMessage: result.error.message,
          plan,
          lastToolResult: result
        };
      }

      // Tool Failure handling
      if (!result.success) {
        step.status = 'FAILED';
        plan.status = 'FAILED';
        if (onStepUpdate) onStepUpdate(step, 'OBSERVING');
        return {
          status: 'FAILED',
          stepsExecuted: executedCount,
          finalMessage: `Action failed at step '${step.toolName}': ${result.error?.message || 'Unknown error'}.`,
          plan,
          lastToolResult: result
        };
      }

      step.status = 'COMPLETED';
      if (onStepUpdate) onStepUpdate(step, 'OBSERVING');
    }

    plan.status = 'COMPLETED';

    // Formulate final success message based on plan type
    let finalMsg = 'Your lab is ready.';
    if (plan.steps.some(s => s.toolName === 'verifyMission')) {
      finalMsg = lastResult?.data?.verified
        ? `Verification successful! Flag verified with score: ${lastResult.data.score || 100}%.`
        : `Verification completed. Result: ${lastResult?.error?.message || 'Flag does not match'}.`;
    } else if (plan.steps.some(s => s.toolName === 'navigate')) {
      finalMsg = 'Navigated to the requested screen.';
    }

    return {
      status: 'COMPLETED',
      stepsExecuted: executedCount,
      finalMessage: finalMsg,
      plan,
      lastToolResult: lastResult
    };
  }

  /**
   * Resolves conversational references like "that", "it", "something harder"
   */
  private static resolveReferencedEntity(
    query: string,
    memory: ConversationalMemoryItem[],
    context: AmanExecutionContext
  ): { category?: string; missionId?: string; route?: string } {
    // 1. Check recent memory
    for (let i = memory.length - 1; i >= 0; i--) {
      const item = memory[i];
      if (item.referencedEntities) {
        return item.referencedEntities;
      }
      if (item.text.includes('web')) {
        return { category: 'web', missionId: 'WEB-002', route: '/flag-checkpoint' };
      }
      if (item.text.includes('linux')) {
        return { category: 'linux', missionId: 'LINUX-001', route: '/linux-lab' };
      }
      if (item.text.includes('network')) {
        return { category: 'network', missionId: 'NET-001', route: '/network-lab' };
      }
    }

    // 2. Default to active context
    const currentRoute = context.currentRoute || '/dashboard';
    if (currentRoute.includes('flag-checkpoint') || currentRoute.includes('unsolved')) {
      return { category: 'web', missionId: 'SOC-001', route: '/flag-checkpoint' };
    }

    return { category: 'web', missionId: 'SOC-001', route: '/flag-checkpoint' };
  }
}
