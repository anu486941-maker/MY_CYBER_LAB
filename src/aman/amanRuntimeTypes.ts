/**
 * AMAN Agent Runtime v3 - Core Types and Interfaces
 */

import { AmanExecutionContext } from './amanTools';

export type AmanAgentState =
  | 'IDLE'
  | 'LISTENING'
  | 'UNDERSTANDING'
  | 'PLANNING'
  | 'AWAITING_PERMISSION'
  | 'EXECUTING'
  | 'OBSERVING'
  | 'VERIFYING'
  | 'RESPONDING';

export type AmanLabState =
  | 'STANDBY'
  | 'PROVISIONING'
  | 'STARTING'
  | 'READY'
  | 'RUNNING'
  | 'STOPPING'
  | 'FAILED';

export type RiskLevel = 'low' | 'medium' | 'high';

export type AmanIntent =
  | 'CASUAL_CONVERSATION'
  | 'GREETING'
  | 'SMALL_TALK'
  | 'LEARNING_QUESTION'
  | 'CURRENT_MISSION'
  | 'ROADMAP'
  | 'NAVIGATION'
  | 'LAB_CONTROL'
  | 'CHALLENGE_DISCOVERY'
  | 'PROGRESS'
  | 'CAREER'
  | 'TECHNICAL_HELP'
  | 'COMMAND'
  | 'UNKNOWN';

export type AmanResponseMode =
  | 'CHAT_MODE'
  | 'LEARNING_MODE'
  | 'ACTION_MODE'
  | 'NAVIGATION_MODE'
  | 'LAB_MODE'
  | 'PROGRESS_MODE';

export interface ToolResult<T = any> {
  success: boolean;
  tool: string;
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
}

export interface AmanTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  riskLevel: RiskLevel;
  requiresAuth: boolean;
  requiredTier?: 'FREE' | 'PRO' | 'ENTERPRISE';
  execute: (input: any, context: AmanExecutionContext) => Promise<ToolResult>;
}

export interface SafeElementSummary {
  id: string;
  type: 'button' | 'link' | 'mission' | 'input' | 'tab' | 'card';
  label: string;
  enabled: boolean;
  route?: string;
  actionHint?: string;
}

export interface SafePageState {
  route: string;
  title: string;
  elements: SafeElementSummary[];
  activeMission?: string;
  activeLab?: string;
  lastUpdated: string;
}

export interface ExecutionPlanStep {
  stepNumber: number;
  toolName: string;
  description: string;
  params: Record<string, any>;
  riskLevel: RiskLevel;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  result?: ToolResult;
}

export interface RuntimePlan {
  id: string;
  goal: string;
  steps: ExecutionPlanStep[];
  status: 'PROPOSED' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'HALTED';
  currentStepIndex: number;
}

export interface ConversationalMemoryItem {
  id: string;
  sender: 'user' | 'aman' | 'system';
  text: string;
  referencedEntities?: {
    category?: string;
    missionId?: string;
    difficulty?: string;
    labId?: string;
    route?: string;
  };
  timestamp: string;
}

export interface AmanModelProvider {
  name: string;
  generateText(prompt: string, options?: any): Promise<string>;
  generateStructuredAction(prompt: string, tools: AmanTool[], options?: any): Promise<any>;
}
