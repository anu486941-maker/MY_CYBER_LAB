/**
 * AMAN Agent 2.0 - Action Executor & Multi-Step Pipeline
 * Safely validates and executes tool invocations against React application state.
 */

import { AmanToolRegistry } from './amanToolRegistry';
import { ToolCallInvocation, AmanExecutionContext, AgentStep } from './amanTools';
import { isOperationSafe, PERMISSION_POLICIES } from './amanPermissions';

export interface ExecutionResult {
  toolCallId: string;
  toolName: string;
  status: 'SUCCESS' | 'FAILED' | 'REQUIRES_CONFIRMATION' | 'REJECTED';
  result?: any;
  error?: string;
  confirmationMessage?: string;
  displayMessage?: string;
}

export class AmanActionExecutor {
  /**
   * Validates and executes a single tool call invocation safely.
   */
  public static async executeTool(
    toolName: string,
    params: Record<string, any>,
    context: AmanExecutionContext,
    userConfirmed: boolean = false
  ): Promise<ExecutionResult> {
    const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const tool = AmanToolRegistry.getTool(toolName);

    if (!tool) {
      return {
        toolCallId: callId,
        toolName,
        status: 'FAILED',
        error: `Tool "${toolName}" is not registered in the AMAN Agent Tool Registry.`
      };
    }

    // 1. Safety verification
    const safetyCheck = isOperationSafe(toolName, params);
    if (!safetyCheck.safe) {
      return {
        toolCallId: callId,
        toolName,
        status: 'REJECTED',
        error: safetyCheck.reason || 'Operation blocked by security policy.'
      };
    }

    // 2. Permission policy verification
    const policy = PERMISSION_POLICIES[tool.permission];
    if (policy.requiresConfirmation && !userConfirmed) {
      const confirmText = toolName === 'delete_evidence'
        ? `⚠️ AMAN is requesting permission to remove evidence "${params.evidenceId || 'all'}". This cannot be undone.`
        : `⚠️ AMAN is requesting permission to execute high-impact action: ${toolName}.`;

      return {
        toolCallId: callId,
        toolName,
        status: 'REQUIRES_CONFIRMATION',
        confirmationMessage: confirmText
      };
    }

    // 3. Execution under safe context
    try {
      const result = await tool.execute(params, context);
      return {
        toolCallId: callId,
        toolName,
        status: 'SUCCESS',
        result,
        displayMessage: tool.formatResult ? tool.formatResult(result) : `Executed ${tool.name} successfully.`
      };
    } catch (err: any) {
      console.error(`[AMAN Action Executor] Error executing ${toolName}:`, err);
      return {
        toolCallId: callId,
        toolName,
        status: 'FAILED',
        error: err.message || 'Execution failed.'
      };
    }
  }

  /**
   * Executes a multi-step workflow sequentially with real-time status reporting.
   */
  public static async executeWorkflow(
    steps: AgentStep[],
    context: AmanExecutionContext,
    onStepUpdate?: (step: AgentStep) => void
  ): Promise<AgentStep[]> {
    const executedSteps: AgentStep[] = [];

    for (const step of steps) {
      step.status = 'RUNNING';
      if (onStepUpdate) onStepUpdate(step);

      if (step.toolName) {
        const result = await this.executeTool(step.toolName, {}, context);
        if (result.status === 'SUCCESS') {
          step.status = 'COMPLETED';
          step.resultSummary = result.displayMessage;
        } else {
          step.status = 'FAILED';
          step.resultSummary = result.error;
          executedSteps.push(step);
          if (onStepUpdate) onStepUpdate(step);
          break; // Stop pipeline on failure
        }
      } else {
        step.status = 'COMPLETED';
      }

      executedSteps.push(step);
      if (onStepUpdate) onStepUpdate(step);
    }

    return executedSteps;
  }
}
