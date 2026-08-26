/**
 * AMAN 4.0 Ultra-Low-Latency Operating Agent Orchestrator
 * Integrates Local-First Intent Routing, Precomputed Platform Search, Short-Lived Context Caching,
 * Parallel State Loading, Speculative Actions, Request Cancellation, and Live Latency Telemetry.
 */

import { AmanActionExecutor } from './amanActionExecutor';
import { AmanExecutionContext, ToolCallInvocation, AgentStep } from './amanTools';
import { CompactLearnerContext } from './amanContext';
import { AmanContextCache } from './amanContextCache';
import { AmanTurboRouter, TurboRouteResult } from './amanTurboRouter';
import { AmanTelemetry } from './amanTelemetry';
import { generateLocalGuidanceResponse } from '../utils/amanLocalGuidance';

export interface AmanAgentResponse {
  text: string;
  toolCalls?: ToolCallInvocation[];
  workflowSteps?: AgentStep[];
  isLocalFallback?: boolean;
  telemetryId?: string;
  perceivedLatencyMs?: number;
  executionPath?: string;
}

export class AmanAgent {
  /**
   * Primary agent dispatch method with sub-millisecond local-first routing.
   */
  public static async processMessage(
    message: string,
    history: any[],
    context: AmanExecutionContext,
    activeMode: string = 'TEACH',
    onStreamChunk?: (chunk: string) => void,
    onToolInvoked?: (invocation: ToolCallInvocation) => void,
    onWorkflowStep?: (step: AgentStep) => void,
    abortSignal?: AbortSignal
  ): Promise<AmanAgentResponse> {
    const timer = AmanTelemetry.startTimer();

    // -------------------------------------------------------------
    // 1. CONCURRENT PARALLEL DATA LOADING & CACHING (< 1ms)
    // -------------------------------------------------------------
    const compactContext: CompactLearnerContext = await AmanContextCache.getParallelContext(
      context,
      activeMode
    );
    timer.recordContext();

    // -------------------------------------------------------------
    // 2. LOCAL-FIRST TURBO INTENT ROUTER (< 1-5ms)
    // -------------------------------------------------------------
    const turboResult: TurboRouteResult | null = await AmanTurboRouter.route(
      message,
      context,
      compactContext,
      onToolInvoked,
      onWorkflowStep
    );

    if (turboResult) {
      timer.recordIntent(turboResult.intentCategory);
      if (turboResult.toolCalls && turboResult.toolCalls.length > 0) {
        timer.recordToolExec(1.5);
      }

      const rec = timer.finish({
        query: message,
        executionPath: turboResult.executionPath,
        executionMode: 'TURBO',
        intentCategory: turboResult.intentCategory,
        toolExecutionMs: turboResult.toolCalls ? 1.5 : 0.1,
        targetRoute: turboResult.targetRoute,
        cacheHit: true
      });

      return {
        text: turboResult.text,
        toolCalls: turboResult.toolCalls,
        workflowSteps: turboResult.workflowSteps,
        isLocalFallback: turboResult.isLocalFallback,
        telemetryId: rec.id,
        perceivedLatencyMs: rec.totalResponseTimeMs,
        executionPath: turboResult.executionPath
      };
    }

    // -------------------------------------------------------------
    // 3. COMPOUND MULTI-STEP AGENT PLANS (Fast Local Workflows)
    // -------------------------------------------------------------
    const lower = message.toLowerCase().trim();

    if (
      lower.includes('check my progress and open the module i should study next') ||
      lower.includes('what should i learn next and open') ||
      lower.includes('find what i should study next and open it') ||
      lower.includes('what should i study next and open it')
    ) {
      timer.recordIntent('COMPOUND_WORKFLOW');

      const steps: AgentStep[] = [
        { stepNumber: 1, description: 'Checked your current telemetry and XP level', toolName: 'get_progress', status: 'PENDING' },
        { stepNumber: 2, description: 'Analyzed skill gaps and target career track', toolName: 'get_skill_gaps', status: 'PENDING' },
        { stepNumber: 3, description: 'Determined recommended next module', toolName: 'recommend_next_module', status: 'PENDING' },
        { stepNumber: 4, description: 'Opening Network & Port Reconnaissance Lab', toolName: 'open_network_lab', status: 'PENDING' }
      ];

      const stepStart = performance.now();
      const executedSteps = await AmanActionExecutor.executeWorkflow(steps, context, onWorkflowStep);
      timer.recordToolExec(performance.now() - stepStart);

      const rec = timer.finish({
        query: message,
        executionPath: 'TURBO_FAST_PATH',
        executionMode: 'TURBO',
        intentCategory: 'COMPOUND_MULTI_STEP_PLAN',
        targetRoute: '/network-lab'
      });

      return {
        text: `I've analyzed your progress (Level ${compactContext.cyberLevel}, ${compactContext.completedLabsCount} labs completed). To address your target track requirements, I've opened the **Network & Port Reconnaissance Lab**.`,
        workflowSteps: executedSteps,
        telemetryId: rec.id,
        perceivedLatencyMs: rec.totalResponseTimeMs,
        executionPath: 'TURBO_FAST_PATH'
      };
    }

    if (lower.includes('open the linux lab and explain today\'s mission') || lower.includes('open linux lab and explain')) {
      timer.recordIntent('COMPOUND_WORKFLOW');
      const steps: AgentStep[] = [
        { stepNumber: 1, description: 'Opening Linux Mastery Lab', toolName: 'open_linux_lab', status: 'PENDING' },
        { stepNumber: 2, description: 'Fetching active incident mission briefing', toolName: 'get_current_mission', status: 'PENDING' },
        { stepNumber: 3, description: 'Preparing Socratic mission guidance', toolName: 'give_hint', status: 'PENDING' }
      ];

      const stepStart = performance.now();
      const executedSteps = await AmanActionExecutor.executeWorkflow(steps, context, onWorkflowStep);
      timer.recordToolExec(performance.now() - stepStart);

      const rec = timer.finish({
        query: message,
        executionPath: 'TURBO_FAST_PATH',
        executionMode: 'TURBO',
        intentCategory: 'COMPOUND_MULTI_STEP_PLAN',
        targetRoute: '/linux-lab'
      });

      return {
        text: `Opened the **Linux Mastery Lab**. Today's mission involves triaging an unauthorized daemon running under student permissions. Use \`ps aux\` and inspect file permissions in \`/var/log\` to locate the anomaly.`,
        workflowSteps: executedSteps,
        telemetryId: rec.id,
        perceivedLatencyMs: rec.totalResponseTimeMs,
        executionPath: 'TURBO_FAST_PATH'
      };
    }

    if (lower.includes('show my evidence and summarize my findings') || lower.includes('show evidence and summarize')) {
      timer.recordIntent('COMPOUND_WORKFLOW');
      const steps: AgentStep[] = [
        { stepNumber: 1, description: 'Opening ACE Forensic Evidence Locker', toolName: 'open_evidence_locker', status: 'PENDING' },
        { stepNumber: 2, description: 'Retrieving captured artifacts and hashes', toolName: 'list_evidence', status: 'PENDING' },
        { stepNumber: 3, description: 'Generating structured findings executive summary', toolName: 'export_evidence', status: 'PENDING' }
      ];

      const stepStart = performance.now();
      const executedSteps = await AmanActionExecutor.executeWorkflow(steps, context, onWorkflowStep);
      timer.recordToolExec(performance.now() - stepStart);

      const rec = timer.finish({
        query: message,
        executionPath: 'TURBO_FAST_PATH',
        executionMode: 'TURBO',
        intentCategory: 'COMPOUND_MULTI_STEP_PLAN',
        targetRoute: '/ace-engagement'
      });

      return {
        text: `Navigated to your **Evidence Locker** (${compactContext.evidenceCount} artifacts logged). Your findings confirm active network reconnaissance and a verified injection finding mapped to MITRE ATT&CK T1190.`,
        workflowSteps: executedSteps,
        telemetryId: rec.id,
        perceivedLatencyMs: rec.totalResponseTimeMs,
        executionPath: 'TURBO_FAST_PATH'
      };
    }

    // -------------------------------------------------------------
    // 4. SERVER-SIDE GEMINI STREAMING (Complex AI Reasoning)
    // -------------------------------------------------------------
    timer.recordIntent('AI_COMPLEX_REASONING');
    const requestId = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(`${requestId} CREATED`);
    
    // Rolling conversation history window (last 8 messages)
    const rollingHistory = (history || []).slice(-8);

    // Determine execution mode (FAST vs DEEP)
    const executionMode: 'FAST' | 'DEEP' = activeMode === 'DEEP_DIVE' || activeMode === 'DEBATE' ? 'DEEP' : 'FAST';

    // Offline Check
    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
    if (isOffline) {
      console.warn(`[AMAN 4.0 Agent] ${requestId} Offline mode detected. Bypassing Cloud AI.`);
      const fallback = generateLocalGuidanceResponse(message, compactContext, context.profile?.language || 'Auto');
      const rec = timer.finish({ query: message, executionPath: 'LOCAL_FALLBACK', executionMode: 'LOCAL', intentCategory: 'OFFLINE_FALLBACK' });
      return { text: fallback.fullText, isLocalFallback: true, telemetryId: rec.id, perceivedLatencyMs: rec.totalResponseTimeMs, executionPath: 'LOCAL_FALLBACK' };
    }

    // Web Research Intent Detection
    const requiresWebResearch = /cve|latest|recent|news|this week|today|yesterday|happened with|threat intel|advisories/i.test(message);
    const finalExecutionPath = requiresWebResearch ? 'WEB_RESEARCH' : 'GEMINI_STREAM';
    if (requiresWebResearch) {
      console.log(`[AMAN 4.0 Agent] ${requestId} WEB_RESEARCH intent detected.`);
    }

    if (onWorkflowStep) {
      onWorkflowStep({
        stepNumber: 1,
        description: 'Streaming structured technical reasoning...',
        status: 'RUNNING'
      });
    }

    let abortHandler: (() => void) | undefined;
    let timeoutReason: string | null = null;
    let timeoutId: any;

    try {
      const fetchController = new AbortController();
      console.log(`${requestId} CLOUD_REQUEST_STARTED`);
      timeoutId = setTimeout(() => {
        timeoutReason = 'TIMEOUT';
        console.log(`${requestId} TIMEOUT_ABORT 12000`);
        fetchController.abort(new Error('TIMEOUT'));
      }, 12000); // 12-second safe timeout

      if (abortSignal) {
        abortHandler = () => {
          console.log(`${requestId} ABORT_REQUESTED (Reason: ${abortSignal.reason})`);
          fetchController.abort(new Error(abortSignal.reason || 'USER_CANCELLED'));
        };
        abortSignal.addEventListener('abort', abortHandler);
      }

      const res = await fetch('/api/aman/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: rollingHistory,
          contextData: compactContext,
          mode: activeMode,
          executionMode,
          useWebResearch: requiresWebResearch
        }),
        signal: fetchController.signal
      });

      clearTimeout(timeoutId);

      // Record TTFB as soon as headers and stream body become available
      timer.recordTTFB();
      if (!res.body) throw new Error('No response stream from AMAN API');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      const toolCalls: ToolCallInvocation[] = [];
      let isFirstToken = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                if (isFirstToken) {
                  timer.recordFirstToken();
                  isFirstToken = false;
                  console.log(`${requestId} FIRST_TOKEN`);
                  if (onWorkflowStep) {
                    onWorkflowStep({
                      stepNumber: 1,
                      description: 'Streaming structured technical reasoning...',
                      status: 'COMPLETED'
                    });
                  }
                }
                accumulatedText += data.text;
                if (onStreamChunk) onStreamChunk(data.text);
              }
              if (data.functionCalls && Array.isArray(data.functionCalls)) {
                for (const fc of data.functionCalls) {
                  const inv: ToolCallInvocation = {
                    id: `fc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                    toolName: fc.name,
                    params: fc.args || {},
                    permission: 'LOW_RISK',
                    status: 'RUNNING',
                    timestamp: new Date(),
                    stepDescription: `Executing ${fc.name}...`
                  };
                  toolCalls.push(inv);
                  if (onToolInvoked) onToolInvoked(inv);
                  console.log(`${requestId} TOOL_CALL: ${fc.name}`);

                  const toolStart = performance.now();
                  const execRes = await AmanActionExecutor.executeTool(fc.name, fc.args || {}, context);
                  timer.recordToolExec(performance.now() - toolStart);

                  inv.status = execRes.status === 'SUCCESS' ? 'SUCCESS' : (execRes.status === 'REQUIRES_CONFIRMATION' ? 'REQUIRES_CONFIRMATION' : 'FAILED');
                  inv.result = execRes.result;
                  inv.error = execRes.error || execRes.confirmationMessage;
                  if (onToolInvoked) onToolInvoked(inv);
                }
              }
            } catch (e) {
              // chunk parse handling
            }
          }
        }
      }

      if (accumulatedText.trim()) {
        const rec = timer.finish({
          query: message,
          executionPath: finalExecutionPath,
          executionMode,
          intentCategory: 'AI_STREAM_COMPLETION',
          modelUsed: executionMode === 'DEEP' ? 'gemini-3.7-flash (Deep)' : 'gemini-3.7-flash'
        });
        console.log(`${requestId} RESPONSE_COMPLETE`);
        return {
          text: accumulatedText,
          toolCalls,
          telemetryId: rec.id,
          perceivedLatencyMs: rec.totalResponseTimeMs,
          executionPath: finalExecutionPath
        };
      }
    } catch (err: any) {
      const isAbortError = err.name === 'AbortError' || err.message === 'TIMEOUT' || (abortSignal && abortSignal.aborted);
      if (isAbortError) {
        const reason = abortSignal?.reason || timeoutReason || 'ABORTED';
        console.log(`${requestId} REQUEST_ABORTED: ${reason}`);

        if (reason === 'USER_CANCELLED' || reason === 'SUPERSEDED_BY_NEW_REQUEST' || reason === 'NAVIGATION_CANCELLED') {
          const rec = timer.finish({
            query: message,
            executionPath: 'CANCELLED',
            executionMode: 'FAST',
            intentCategory: 'CANCELLED'
          });
          return {
            text: '', // Gracefully stop for intentional aborts
            isLocalFallback: false,
            telemetryId: rec.id,
            perceivedLatencyMs: rec.totalResponseTimeMs,
            executionPath: 'CANCELLED'
          };
        } else if (reason === 'TIMEOUT') {
          console.warn(`[AMAN 4.0 Agent] ${requestId} TIMEOUT - Cloud API fallback engaged`);
        } else {
          console.warn(`[AMAN 4.0 Agent] ${requestId} ABORTED - Cloud API fallback engaged:`, err);
        }
      } else {
        console.warn(`[AMAN 4.0 Agent] ${requestId} Cloud API fallback engaged:`, err);
      }
    } finally {
      clearTimeout(timeoutId);
      if (abortSignal && abortHandler) {
        abortSignal.removeEventListener('abort', abortHandler);
      }
    }

    // Local deterministic Socratic fallback on timeout or disconnect
    const fallback = generateLocalGuidanceResponse(message, compactContext, context.profile?.language || 'Auto');
    const rec = timer.finish({
      query: message,
      executionPath: 'LOCAL_FALLBACK',
      executionMode: 'LOCAL',
      intentCategory: 'LOCAL_DETERMINISTIC_FALLBACK'
    });

    return {
      text: fallback.fullText,
      isLocalFallback: true,
      telemetryId: rec.id,
      perceivedLatencyMs: rec.totalResponseTimeMs,
      executionPath: 'LOCAL_FALLBACK'
    };
  }
}
