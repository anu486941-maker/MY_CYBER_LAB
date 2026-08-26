/**
 * AMAN Agent 2.0 - Tool Definitions and Types
 */

import { AmanPermissionLevel } from './amanPermissions';

export type ToolCategory = 
  | 'NAVIGATION'
  | 'LEARNING'
  | 'STUDY'
  | 'MISSIONS'
  | 'LAB'
  | 'EVIDENCE'
  | 'CAREER'
  | 'ACCOUNT';

export interface ToolParameterSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  enum?: string[];
  properties?: Record<string, ToolParameterSchema>;
  required?: string[];
}

export interface AmanToolDefinition<TParams = any, TResult = any> {
  name: string;
  category: ToolCategory;
  description: string;
  permission: AmanPermissionLevel;
  parameters: {
    type: 'object';
    properties: Record<string, ToolParameterSchema>;
    required?: string[];
  };
  execute: (params: TParams, context: AmanExecutionContext) => Promise<TResult> | TResult;
  formatResult?: (result: TResult) => string;
}

export interface AmanExecutionContext {
  // Navigation
  navigate: (route: string, options?: any) => void;
  currentRoute: string;

  // AppContext bindings
  profile: any;
  learningState: any;
  evidenceLocker: any[];
  addEvidence?: (evidence: any) => any;
  deleteEvidence?: (id: string) => void;
  addNote?: (note: any) => void;
  setActiveCareerTrack?: (track: 'ETHICAL_HACKER' | 'SOC_ANALYST') => void;
  resetAllProgress?: () => void;
  addXp?: (amount: number, reason?: string) => void;

  // Curricular references
  curriculum?: any[];
  modules?: any[];
  missions?: any[];
  careerRoles?: any[];

  // Execution dispatchers
  requestConfirmation?: (toolName: string, params: any, message: string) => Promise<boolean>;
}

export interface ToolCallInvocation {
  id: string;
  toolName: string;
  params: Record<string, any>;
  permission: AmanPermissionLevel;
  status: 'PENDING' | 'REQUIRES_CONFIRMATION' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'REJECTED';
  result?: any;
  error?: string;
  timestamp: Date;
  stepDescription?: string;
}

export interface AgentStep {
  stepNumber: number;
  description: string;
  toolName?: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  resultSummary?: string;
}
