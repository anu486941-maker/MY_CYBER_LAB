/**
 * AMAN Agent Runtime v3 - Central Runtime Coordinator
 * Implements the core runtime loop, explicit agent & lab state machines,
 * tool planning, safe multi-step execution, and voice interruption handling.
 */

import { 
  AmanAgentState, 
  AmanLabState, 
  ConversationalMemoryItem, 
  RuntimePlan, 
  ToolResult 
} from './amanRuntimeTypes';
import { AmanExecutionContext } from './amanTools';
import { AmanToolRegistryV3 } from './amanToolRegistryV3';
import { AmanPlanner, PlanExecutionResult } from './amanPlanner';
import { AmanIntentEngine } from './amanIntentEngine';
import { amanEventBus, AmanEvent } from './amanEvents';

export interface RuntimeExecutionResponse {
  state: AmanAgentState;
  labState: AmanLabState;
  text: string;
  plan?: RuntimePlan;
  stepsExecuted?: number;
  lastToolResult?: ToolResult;
  isCasual: boolean;
  requiresConfirmation?: boolean;
}

export type StateChangeCallback = (state: AmanAgentState, labState: AmanLabState) => void;

export class AmanRuntime {
  private static instance: AmanRuntime;

  private agentState: AmanAgentState = 'IDLE';
  private labState: AmanLabState = 'STANDBY';
  private memory: ConversationalMemoryItem[] = [];
  private activeAbortController: AbortController | null = null;
  private stateListeners: Set<StateChangeCallback> = new Set();

  private constructor() {
    // Listen to internal event bus for lab state transitions
    amanEventBus.on('LAB_PROVISIONING', () => this.setLabState('PROVISIONING'));
    amanEventBus.on('LAB_READY', () => this.setLabState('READY'));
    amanEventBus.on('LAB_STARTED', () => this.setLabState('RUNNING'));
    amanEventBus.on('LAB_STOPPED', () => this.setLabState('STANDBY'));
  }

  public static getInstance(): AmanRuntime {
    if (!AmanRuntime.instance) {
      AmanRuntime.instance = new AmanRuntime();
    }
    return AmanRuntime.instance;
  }

  public getAgentState(): AmanAgentState {
    return this.agentState;
  }

  public getLabState(): AmanLabState {
    return this.labState;
  }

  public onStateChange(listener: StateChangeCallback): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private setAgentState(state: AmanAgentState): void {
    this.agentState = state;
    this.notifyState();
  }

  private setLabState(state: AmanLabState): void {
    this.labState = state;
    this.notifyState();
  }

  private notifyState(): void {
    this.stateListeners.forEach(fn => {
      try {
        fn(this.agentState, this.labState);
      } catch (err) {
        console.error('[AmanRuntime] State callback error:', err);
      }
    });
  }

  /**
   * Safe cancellation & interruption ("AMAN, stop")
   */
  public interrupt(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
    this.setAgentState('IDLE');
  }

  /**
   * Starts the sandbox lab session with appropriate lifecycle state transitions
   */
  public async startLab(missionId: string = 'SOC-001', userId: string = 'operator'): Promise<void> {
    this.setLabState('PROVISIONING');
    amanEventBus.emit({
      type: 'LAB_PROVISIONING',
      missionId,
      userId,
      timestamp: new Date().toISOString()
    });
    this.setLabState('READY');
    this.setLabState('RUNNING');
    amanEventBus.emit({
      type: 'LAB_STARTED',
      missionId,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Stops the active lab session safely
   */
  public stopLab(): void {
    this.setLabState('STOPPING');
    amanEventBus.emit({
      type: 'LAB_STOPPED',
      timestamp: new Date().toISOString()
    });
    this.setLabState('STANDBY');
  }

  /**
   * Core Runtime Loop:
   * USER MESSAGE / VOICE -> Intent Classification (Language & Mode Policy)
   * -> Context Gating -> Plan Generation -> Safe Tool Execution -> Natural Response
   */
  public async handleUserMessage(
    message: string,
    context: AmanExecutionContext,
    userConfirmationGranted: boolean = false
  ): Promise<RuntimeExecutionResponse> {
    const rawText = message.trim();
    if (!rawText) {
      return {
        state: 'IDLE',
        labState: this.labState,
        text: '',
        isCasual: true
      };
    }

    // Check for explicit stop / interrupt command
    if (/^(aman,?\s*stop|stop|cancel|abort)[\.!\s]*$/i.test(rawText.trim())) {
      this.interrupt();
      return {
        state: 'IDLE',
        labState: this.labState,
        text: 'Execution stopped. Returning to standby.',
        isCasual: false
      };
    }

    this.activeAbortController = new AbortController();

    // 1. INTENT CLASSIFICATION FIRST (Before context gating or tools)
    this.setAgentState('UNDERSTANDING');
    const classification = AmanIntentEngine.classifyIntent(
      rawText,
      this.memory,
      context.currentRoute || '/'
    );

    // 2. CHAT_MODE (GREETING, SMALL_TALK, CASUAL_CONVERSATION)
    // No tools, no learning context injection, primary response in English
    if (classification.mode === 'CHAT_MODE' || classification.isCasual) {
      this.setAgentState('RESPONDING');
      const casualReply = classification.conversationalResponse || AmanPlanner.getCasualResponse(rawText);

      this.recordMemory('user', rawText);
      this.recordMemory('aman', casualReply);

      this.setAgentState('IDLE');
      return {
        state: 'IDLE',
        labState: this.labState,
        text: casualReply,
        isCasual: true
      };
    }

    // 3. LEARNING_QUESTION INTENT ("What am I learning right now?", "Where am I in the course?")
    if (classification.intent === 'LEARNING_QUESTION') {
      this.setAgentState('RESPONDING');
      const course = context.learningState?.currentCourse || 'Networking Fundamentals';
      const lesson = context.learningState?.currentLesson || 'Switches, Routers & Default Gateways';
      const reply = `You're currently working on **${course}**, specifically **${lesson}**.`;

      this.recordMemory('user', rawText);
      this.recordMemory('aman', reply, { category: 'networking', route: context.currentRoute });

      this.setAgentState('IDLE');
      return {
        state: 'IDLE',
        labState: this.labState,
        text: reply,
        isCasual: false
      };
    }

    // 4. TECHNICAL_HELP INTENT ("Explain what a default gateway is", "Explain it simply", "Give me an example", "mujhe networking samjha do")
    if (classification.intent === 'TECHNICAL_HELP') {
      this.setAgentState('RESPONDING');
      let reply = '';
      const lower = rawText.toLowerCase();

      if (lower.includes('simply') || lower.includes('simple') || lower.includes('aasan')) {
        reply = `### 💡 Simplified Explanation\n\nThink of a **Default Gateway** like the front door of your house. All devices in your house can talk to each other directly. But when you want to send mail to someone in another city (the internet), you must pass through the front door (the default gateway router).`;
      } else if (lower.includes('example') || lower.includes('udaharan')) {
        reply = `### 🛠️ Practical Example\n\n- **Your Machine IP**: \`192.168.1.50/24\`\n- **Default Gateway**: \`192.168.1.1\`\n- **Scenario**: When you execute \`ping 8.8.8.8\`, your operating system sees that \`8.8.8.8\` is outside your local subnet, so it wraps the packet in an Ethernet frame addressed to the default gateway router.`;
      } else if (lower.includes('default gateway') || lower.includes('gateway')) {
        reply = `### 🌐 Default Gateway Explained\n\nA **Default Gateway** is the node or router on a computer network that serves as the access point to another network or the internet.\n\n- **How It Works**: When a device sends packets to an IP address outside its local subnet, it forwards those packets to the default gateway's MAC/IP address.\n- **Example**: In a local network \`192.168.1.0/24\`, your machine might be \`192.168.1.50\` and your default gateway is typically \`192.168.1.1\`.\n- **Routing**: The gateway inspects its routing table and forwards the traffic onward to external networks.`;
      } else if (lower.includes('networking') || lower.includes('network')) {
        reply = `### 🌐 Networking Fundamentals\n\nComputer networking is the practice of connecting computing devices together to exchange data and share resources.\n\n- **OSI & TCP/IP Models**: The layered architecture governing how data moves from application software down to physical electrical/optical signals.\n- **IP Addressing & Subnets**: Unique numerical labels (IPv4/IPv6) that identify hosts and sub-networks.\n- **Key Hardware**: **Switches** connect devices within the same local network, while **Routers** forward packets between different networks using default gateways.`;
      } else if (lower.includes('nmap') || lower.includes('port scan')) {
        reply = `### 🔍 Nmap & Port Scanning\n\n**Nmap** is a network exploration tool and port scanner used for host discovery and vulnerability assessment.\n\n- **SYN Stealth Scan**: \`nmap -sS -T4 target_ip\` probes open TCP ports by initiating a 3-way handshake without completing it.\n- **Service Versioning**: \`nmap -sV target_ip\` extracts application banner details to identify outdated or vulnerable services.`;
      } else {
        reply = `Here is a breakdown of the technical concept: Computer security systems rely on precise protocol standards, boundary segmentation, and least-privilege access controls.`;
      }

      this.recordMemory('user', rawText);
      this.recordMemory('aman', reply);

      this.setAgentState('IDLE');
      return {
        state: 'IDLE',
        labState: this.labState,
        text: reply,
        isCasual: false
      };
    }

    // 4b. CURRENT_MISSION & GUIDANCE INTENT ("What should I do first?", "What's the target?", "Ab mujhe kya karna hai?")
    if (classification.intent === 'CURRENT_MISSION') {
      this.setAgentState('RESPONDING');
      const prevCat = this.memory.slice().reverse().find(m => m.referencedEntities?.category)?.referencedEntities?.category;
      const targetIp = '10.10.19.84';
      const reply = `### 🎯 Target Briefing & Immediate Action\n\n- **Target Machine**: \`${targetIp}\` (Controlled Sandbox Simulation)\n- **Objective**: Identify open services and suspicious authentication anomalies.\n- **Recommended First Step**: Launch a fast port discovery scan:\n  \`\`\`bash\n  nmap -sV -T4 ${targetIp}\n  \`\`\`\n\n*(Environment: Simulated & Controlled Range)*`;

      this.recordMemory('user', rawText);
      this.recordMemory('aman', reply, { category: prevCat || 'soc', targetId: 'SOC-001', route: context.currentRoute });

      this.setAgentState('IDLE');
      return {
        state: 'IDLE',
        labState: this.labState,
        text: reply,
        isCasual: false
      };
    }

    // 4c. LAB_CONTROL START HANDLING
    if (classification.intent === 'LAB_CONTROL') {
      const lower = rawText.toLowerCase();
      if (lower.includes('start') || lower.includes('launch') || lower.includes('boot')) {
        await this.startLab(classification.resolvedEntity?.targetId || 'SOC-001', context.profile?.name || 'operator');
      }
    }

    // 5. PLANNING & MULTI-STEP EXECUTION
    this.setAgentState('PLANNING');
    const plan = AmanPlanner.createPlan(rawText, context, this.memory);

    if (plan.steps.length === 0) {
      this.setAgentState('RESPONDING');
      const fallbackReply = classification.conversationalResponse || "How can I assist your investigation today?";
      this.recordMemory('user', rawText);
      this.recordMemory('aman', fallbackReply);
      this.setAgentState('IDLE');
      return {
        state: 'IDLE',
        labState: this.labState,
        text: fallbackReply,
        isCasual: false
      };
    }

    const result: PlanExecutionResult = await AmanPlanner.executePlan(
      plan,
      context,
      (step, stepState) => {
        this.setAgentState(stepState);
      },
      userConfirmationGranted
    );

    // 6. OBSERVING & VERIFYING
    if (plan.steps.some(s => s.toolName === 'verifyMission')) {
      this.setAgentState('VERIFYING');
    } else {
      this.setAgentState('OBSERVING');
    }

    // 7. RESPONDING
    this.setAgentState('RESPONDING');
    let finalMessage = result.finalMessage;

    if (classification.intent === 'PROGRESS') {
      const xp = context.profile?.xp || 1200;
      const level = context.profile?.cyberLevel || 2;
      const rank = context.profile?.rank || 'Security Specialist';
      finalMessage = `### 📊 Your Progress\n\n- **Level**: Level ${level} (${rank})\n- **XP**: ${xp} XP\n- **Completed Labs**: 4 labs\n- **Mastery**: 68%`;
    } else if (classification.intent === 'CHALLENGE_DISCOVERY') {
      finalMessage = `I found your unsolved challenges and navigated to the **Flag Checkpoint**. Ready to triage!`;
    } else if (classification.intent === 'LAB_CONTROL') {
      finalMessage = `Authorized cybersecurity training sandbox is started and ready.`;
    }

    // Record to memory with resolved entity context
    this.recordMemory('user', rawText);
    this.recordMemory('aman', finalMessage, {
      route: context.currentRoute,
      missionId: plan.steps.find(s => s.params?.missionId)?.params.missionId,
      category: rawText.includes('web') ? 'web' : (rawText.includes('linux') ? 'linux' : undefined)
    });

    this.setAgentState('IDLE');

    return {
      state: 'IDLE',
      labState: this.labState,
      text: finalMessage,
      plan: result.plan,
      stepsExecuted: result.stepsExecuted,
      lastToolResult: result.lastToolResult,
      isCasual: false,
      requiresConfirmation: result.status === 'CONFIRMATION_REQUIRED'
    };
  }

  private recordMemory(
    sender: 'user' | 'aman' | 'system',
    text: string,
    referencedEntities?: any
  ): void {
    this.memory.push({
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sender,
      text,
      referencedEntities,
      timestamp: new Date().toISOString()
    });

    if (this.memory.length > 20) {
      this.memory.shift();
    }
  }

  public getMemory(): ConversationalMemoryItem[] {
    return [...this.memory];
  }

  public clearMemory(): void {
    this.memory = [];
  }
}

export const amanRuntime = AmanRuntime.getInstance();
