/**
 * AMAN Conversational Intelligence & Intent Engine v3
 *
 * Implements intent classification BEFORE context gating.
 * Primary response language is English, with natural understanding of Hinglish/Hindi.
 * Isolates casual conversation, greetings, and small talk from unsolicited learning injections.
 */

import { AmanIntent, AmanResponseMode, ConversationalMemoryItem } from './amanRuntimeTypes';

export interface ContextRelevancePolicy {
  useCurrentCourse: boolean;
  useCurrentMission: boolean;
  useCurrentPage: boolean;
  useProgress: boolean;
  useLab: boolean;
  allowToolExecution: boolean;
  allowNavigation: boolean;
}

export interface IntentClassificationResult {
  intent: AmanIntent;
  mode: AmanResponseMode;
  detectedLanguage: 'English' | 'Hinglish' | 'Hindi';
  confidence: number;
  isCasual: boolean;
  contextRelevance: ContextRelevancePolicy;
  resolvedEntity?: {
    entityType?: 'mission' | 'challenge' | 'lab' | 'module' | 'topic';
    targetId?: string;
    category?: string;
    difficulty?: string;
    route?: string;
  };
  conversationalResponse?: string;
}

export class AmanIntentEngine {
  /**
   * Language Policy:
   * AMAN's primary response language is English.
   * Understands English, Hinglish, and Hindi.
   */
  public static detectLanguage(text: string): 'English' | 'Hinglish' | 'Hindi' {
    const raw = text.trim();
    if (/[\u0900-\u097F]/.test(raw)) {
      return 'Hindi';
    }

    const lower = raw.toLowerCase();
    const hinglishMarkers = [
      /\b(kya|kaise|kaisa|kahan|kaha|kyun|kyu|kaun)\b/,
      /\b(haal|chal|rhi|rha|raha|rahi|hai|hain|ha|ho|hu|hoon)\b/,
      /\b(thik|theek|badhiya|accha|achha|sahi)\b/,
      /\b(samjha|samjhao|sikhao|sikhna|batao|kholo|karo|badho|aage)\b/,
      /\b(mujhe|mera|meri|mere|tum|aap|apka|hum|main)\b/,
      /\b(shukriya|dhanyawad|namaste|alvida)\b/
    ];

    const matchCount = hinglishMarkers.filter(regex => regex.test(lower)).length;
    return matchCount > 0 ? 'Hinglish' : 'English';
  }

  /**
   * Classify user input into an explicit AmanIntent and AmanResponseMode.
   */
  public static classifyIntent(
    message: string,
    recentMemory: ConversationalMemoryItem[] = [],
    backgroundPage: string = '/'
  ): IntentClassificationResult {
    const text = (message || '').trim();
    const lower = text.toLowerCase().replace(/['’]/g, '');
    // Normalize punctuation and unicode emoji safely
    const clean = lower.replace(/[?!.,;:]/g, ' ').replace(/[^\w\s\u0900-\u097F]/gu, ' ').replace(/\s+/g, ' ').trim();
    const detectedLang = this.detectLanguage(text);

    // Entity Resolution for context follow-ups ("that", "it", "something harder", "continue")
    const resolvedEntity = this.resolveReferencedEntity(clean, recentMemory, backgroundPage);

    // -------------------------------------------------------------
    // 1. GREETING INTENT
    // -------------------------------------------------------------
    if (
      /^(hi|hello|hey|greetings|namaste|yo|hola|good morning|good evening|good afternoon)(\s+aman|\s+there)?$/i.test(clean)
    ) {
      return {
        intent: 'GREETING',
        mode: 'CHAT_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.98,
        isCasual: true,
        contextRelevance: this.createRelevancePolicy(false),
        conversationalResponse: detectedLang === 'Hinglish'
          ? "Hey! 👋 What's up? Ready to learn or just chatting today?"
          : "Hey! 👋 What's up?"
      };
    }

    // -------------------------------------------------------------
    // 2. SMALL TALK & STATUS INQUIRY INTENT ("how are you?", "thik chal rhi ha", "i'm good")
    // -------------------------------------------------------------
    const isHowAreYou = /^(how\s+(are\s+you|r\s+u|do\s+you\s+do|is\s+it\s+going)|how're\s+you|what's\s+up|sup|kya\s+haal\s+(hai|ha)|kaise\s+ho|kaisa\s+hai|kya\s+chal\s+r(aha|ha)\s+(hai|h|ha))(\s+aman)?$/i.test(clean);
    if (isHowAreYou) {
      return {
        intent: 'SMALL_TALK',
        mode: 'CHAT_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.99,
        isCasual: true,
        contextRelevance: this.createRelevancePolicy(false),
        conversationalResponse: "I'm doing great! 😄 How about you?"
      };
    }

    const isUserFeelingGood = /^(i('?m|m| am)\s+(fine|good|great|doing well|doing fine|doing good|okay|ok|well)|all good|thik\s+chal\s+r(hi|aha)\s+(ha|hai)|sab\s+badhiya|badhiya\s+hai|sab\s+theek)$/i.test(clean);
    if (isUserFeelingGood) {
      return {
        intent: 'SMALL_TALK',
        mode: 'CHAT_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.98,
        isCasual: true,
        contextRelevance: this.createRelevancePolicy(false),
        conversationalResponse: detectedLang === 'Hinglish'
          ? "Glad to hear that! 😄"
          : "Glad to hear it! 😄 What would you like to work on?"
      };
    }

    const isBoredOrTired =
      clean.includes('tired') ||
      clean.includes('bored') ||
      clean.includes('sleepy') ||
      clean.includes('exhausted') ||
      clean.includes('bore ho') ||
      clean.includes('thak gaya');
    if (isBoredOrTired) {
      return {
        intent: 'SMALL_TALK',
        mode: 'CHAT_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.95,
        isCasual: true,
        contextRelevance: this.createRelevancePolicy(false),
        conversationalResponse: "Let's fix that 😄 Want to work on a cybersecurity challenge, learn something new, or just chat?"
      };
    }

    const isThanks = /^(thanks|thank you|thank u|ty|shukriya|dhanyawad|thanks a lot|many thanks)(\s+(aman|bro|bhai|yaar|man|dude))?$/i.test(clean);
    if (isThanks) {
      return {
        intent: 'SMALL_TALK',
        mode: 'CHAT_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.99,
        isCasual: true,
        contextRelevance: this.createRelevancePolicy(false),
        conversationalResponse: "Anytime!"
      };
    }

    const isCoolOrAck = /^(that('?s)?\s+cool|cool|awesome|great|nice|neat|sounds good|understood|got it|roger that)$/i.test(clean);
    if (isCoolOrAck) {
      return {
        intent: 'SMALL_TALK',
        mode: 'CHAT_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.95,
        isCasual: true,
        contextRelevance: this.createRelevancePolicy(false),
        conversationalResponse: "Glad to hear that! 😄 Let me know what you'd like to explore next."
      };
    }

    const isWhatAreYouDoing = /^(what\s+are\s+you\s+doing|what\s+r\s+u\s+doing|kya\s+kar\s+r(ahe|he|ha)\s+ho)(\s+aman)?$/i.test(clean);
    if (isWhatAreYouDoing) {
      return {
        intent: 'SMALL_TALK',
        mode: 'CHAT_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.95,
        isCasual: true,
        contextRelevance: this.createRelevancePolicy(false),
        conversationalResponse: "Just standing by and ready to help! 😄 What's on your mind today?"
      };
    }

    const isFarewell = /^(bye|goodbye|see you|see ya|cya|alvida|tata)(\s+aman|\s+later)?$/i.test(clean);
    if (isFarewell) {
      return {
        intent: 'SMALL_TALK',
        mode: 'CHAT_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.98,
        isCasual: true,
        contextRelevance: this.createRelevancePolicy(false),
        conversationalResponse: "See you later! Stay sharp and stay secure! 🛡️"
      };
    }

    // -------------------------------------------------------------
    // 3. CASUAL CONVERSATION (General Social Questions)
    // -------------------------------------------------------------
    const isIdentityOrSocial = /^(who are you|what is your name|tell me about yourself|are you an ai|are you real|tell me a joke)$/i.test(clean);
    if (isIdentityOrSocial) {
      return {
        intent: 'CASUAL_CONVERSATION',
        mode: 'CHAT_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.95,
        isCasual: true,
        contextRelevance: this.createRelevancePolicy(false),
        conversationalResponse: clean.includes('joke')
          ? "Why do programmers prefer dark mode? Because light attracts bugs! 😄"
          : "I'm AMAN, your autonomous AI mentor at My Cyber Lab! I'm here to help you practice real security skills, solve challenges, and guide your learning."
      };
    }

    // -------------------------------------------------------------
    // 4. CURRENT LEARNING QUESTION ("What am I learning right now?")
    // -------------------------------------------------------------
    if (
      clean.includes('what am i learning') ||
      clean.includes('what am i studying') ||
      clean.includes('what is my current topic') ||
      clean.includes('where am i in the course') ||
      clean.includes('what lesson is this') ||
      clean.includes('main kya sikh raha hu') ||
      clean.includes('kahan tak pahucha')
    ) {
      return {
        intent: 'LEARNING_QUESTION',
        mode: 'LEARNING_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.95,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: true,
          useCurrentMission: true,
          useCurrentPage: true,
          useProgress: true,
          useLab: false,
          allowToolExecution: false,
          allowNavigation: false
        }
      };
    }

    // -------------------------------------------------------------
    // 5. PROGRESS & CAREER READINESS ("What's my progress?", "How am I doing?")
    // -------------------------------------------------------------
    if (
      clean.includes('what is my progress') ||
      clean.includes("what's my progress") ||
      clean.includes('how am i doing') ||
      clean.includes('show my xp') ||
      clean.includes('my stats') ||
      clean.includes('skill readiness') ||
      clean.includes('career readiness')
    ) {
      return {
        intent: 'PROGRESS',
        mode: 'PROGRESS_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.95,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: true,
          useCurrentMission: false,
          useCurrentPage: false,
          useProgress: true,
          useLab: false,
          allowToolExecution: true,
          allowNavigation: false
        }
      };
    }

    // -------------------------------------------------------------
    // 6. LAB CONTROL ("Start my cyber lab", "Start the challenge", "Start it")
    // -------------------------------------------------------------
    if (
      (clean.includes('start') || clean.includes('launch') || clean.includes('stop') || clean.includes('boot') || clean.includes('restart')) &&
      (clean.includes('lab') || clean.includes('machine') || clean.includes('container') || clean.includes('sandbox') || clean.includes('cyber range') || clean.includes('challenge') || clean === 'start it' || clean === 'start')
    ) {
      return {
        intent: 'LAB_CONTROL',
        mode: 'LAB_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.97,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: false,
          useCurrentMission: true,
          useCurrentPage: true,
          useProgress: false,
          useLab: true,
          allowToolExecution: true,
          allowNavigation: false
        },
        resolvedEntity: {
          entityType: 'lab',
          targetId: resolvedEntity.targetId || 'SOC-001'
        }
      };
    }

    // -------------------------------------------------------------
    // 7. CHALLENGE DISCOVERY ("Open my unsolved web challenges", "Give me something practical to practice")
    // -------------------------------------------------------------
    if (
      clean.includes('unsolved') || 
      clean.includes('challenge') || 
      clean.includes('challenges') ||
      clean.includes('something practical') ||
      clean.includes('practical to practice') ||
      clean.includes('practice web security') ||
      clean.includes('beginner-friendly') ||
      clean.includes('beginner friendly') ||
      (clean.includes('practice') && (clean.includes('web') || clean.includes('linux') || clean.includes('soc') || clean.includes('security')))
    ) {
      const category = (clean.includes('web') || resolvedEntity.category === 'web')
        ? 'web' 
        : (clean.includes('linux') ? 'linux' : (clean.includes('soc') ? 'soc' : 'web'));
      
      const difficulty = (clean.includes('beginner') || clean.includes('easy')) ? 'easy' : (clean.includes('hard') ? 'hardest' : 'normal');

      return {
        intent: 'CHALLENGE_DISCOVERY',
        mode: 'ACTION_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.96,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: false,
          useCurrentMission: true,
          useCurrentPage: true,
          useProgress: true,
          useLab: false,
          allowToolExecution: true,
          allowNavigation: true
        },
        resolvedEntity: {
          entityType: 'challenge',
          category,
          difficulty,
          targetId: category === 'web' ? 'WEB-002' : 'SOC-001',
          route: '/flag-checkpoint'
        }
      };
    }

    // -------------------------------------------------------------
    // 8. RELATIVE COMMANDS & FOLLOW-UPS ("Continue", "Make it harder", "Open that")
    // -------------------------------------------------------------
    if (/^(continue|resume|aage badho|chalo aage)$/i.test(clean)) {
      return {
        intent: 'COMMAND',
        mode: 'ACTION_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.92,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: true,
          useCurrentMission: true,
          useCurrentPage: true,
          useProgress: true,
          useLab: true,
          allowToolExecution: true,
          allowNavigation: true
        },
        resolvedEntity
      };
    }

    if (/^(make it harder|give me something harder|something harder|harder|increase difficulty)$/i.test(clean)) {
      return {
        intent: 'COMMAND',
        mode: 'ACTION_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.94,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: false,
          useCurrentMission: true,
          useCurrentPage: true,
          useProgress: true,
          useLab: false,
          allowToolExecution: true,
          allowNavigation: true
        },
        resolvedEntity: {
          ...resolvedEntity,
          difficulty: 'hardest'
        }
      };
    }

    // -------------------------------------------------------------
    // 9. MISSION GUIDANCE / NEXT ACTIONS ("What should I do first?", "What's the target?", "Ab mujhe kya karna hai?")
    // -------------------------------------------------------------
    if (
      clean.includes('what should i do') ||
      clean.includes('what do i do') ||
      clean.includes('what to do first') ||
      clean.includes('what is the target') ||
      clean.includes("what's the target") ||
      clean.includes('whats the target') ||
      clean.includes('target ip') ||
      clean.includes('target machine') ||
      clean.includes('what is target') ||
      clean === 'target' ||
      clean.includes('what should i investigate') ||
      clean.includes('what to investigate') ||
      clean.includes('investigate first') ||
      clean.includes('kya karna hai') ||
      clean.includes('karna chahiye') ||
      clean.includes('kya karu') ||
      clean.includes('क्या करना चाहिए') ||
      clean.includes('current mission') ||
      clean.includes('active mission') ||
      clean.includes('mission objective')
    ) {
      return {
        intent: 'CURRENT_MISSION',
        mode: 'LEARNING_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.95,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: false,
          useCurrentMission: true,
          useCurrentPage: true,
          useProgress: false,
          useLab: false,
          allowToolExecution: false,
          allowNavigation: false
        },
        resolvedEntity
      };
    }

    if (/^(open that|open it|launch that|start that|take me there)$/i.test(clean)) {
      return {
        intent: 'NAVIGATION',
        mode: 'NAVIGATION_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.93,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: false,
          useCurrentMission: true,
          useCurrentPage: true,
          useProgress: false,
          useLab: false,
          allowToolExecution: true,
          allowNavigation: true
        },
        resolvedEntity
      };
    }

    // -------------------------------------------------------------
    // 9. ROADMAP INTENT
    // -------------------------------------------------------------
    if (clean.includes('roadmap')) {
      return {
        intent: 'ROADMAP',
        mode: 'NAVIGATION_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.95,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: true,
          useCurrentMission: false,
          useCurrentPage: true,
          useProgress: true,
          useLab: false,
          allowToolExecution: true,
          allowNavigation: true
        },
        resolvedEntity: {
          route: '/roadmap'
        }
      };
    }

    // -------------------------------------------------------------
    // 10. NAVIGATION INTENT
    // -------------------------------------------------------------
    if (
      clean.startsWith('open ') ||
      clean.startsWith('navigate ') ||
      clean.startsWith('go to ') ||
      clean.startsWith('take me to ') ||
      clean.includes('module kholo') ||
      clean.includes('open dashboard')
    ) {
      return {
        intent: 'NAVIGATION',
        mode: 'NAVIGATION_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.94,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: false,
          useCurrentMission: false,
          useCurrentPage: true,
          useProgress: false,
          useLab: false,
          allowToolExecution: true,
          allowNavigation: true
        }
      };
    }

    // -------------------------------------------------------------
    // 11. CURRENT MISSION INTENT
    // -------------------------------------------------------------
    if (
      clean.includes('current mission') ||
      clean.includes('active mission') ||
      clean.includes('mission objective')
    ) {
      return {
        intent: 'CURRENT_MISSION',
        mode: 'LEARNING_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.95,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: false,
          useCurrentMission: true,
          useCurrentPage: true,
          useProgress: false,
          useLab: false,
          allowToolExecution: false,
          allowNavigation: false
        }
      };
    }

    // -------------------------------------------------------------
    // 12. CAREER INTENT
    // -------------------------------------------------------------
    if (
      clean.includes('career') ||
      clean.includes('become a soc') ||
      clean.includes('become an ethical hacker') ||
      clean.includes('salary') ||
      clean.includes('switch track')
    ) {
      return {
        intent: 'CAREER',
        mode: 'PROGRESS_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.92,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: true,
          useCurrentMission: false,
          useCurrentPage: true,
          useProgress: true,
          useLab: false,
          allowToolExecution: false,
          allowNavigation: false
        }
      };
    }

    // -------------------------------------------------------------
    // 13. TECHNICAL CONCEPT EXPLANATION & TEACHING ("Explain what a default gateway is", "mujhe networking samjha do", "Give me an example")
    // -------------------------------------------------------------
    const isTechnicalExplanation =
      clean.startsWith('explain') ||
      clean.startsWith('what is') ||
      clean.startsWith('what are') ||
      clean.startsWith('how does') ||
      clean.startsWith('how do') ||
      clean.startsWith('why does') ||
      clean.startsWith('teach me') ||
      clean.startsWith('scan') ||
      clean.includes('give me an example') ||
      clean.includes('give an example') ||
      clean.includes('show an example') ||
      clean.includes('example') ||
      clean.includes('explain it simply') ||
      clean.includes('simple terms') ||
      clean.includes('samjha do') ||
      clean.includes('samjhao') ||
      clean.includes('sikhao') ||
      clean.includes('subnet') ||
      clean.includes('gateway') ||
      clean.includes('router') ||
      clean.includes('switch') ||
      clean.includes('nmap') ||
      clean.includes('port scan') ||
      clean.includes('sql injection') ||
      clean.includes('sqli') ||
      clean.includes('firewall') ||
      clean.includes('tcp') ||
      clean.includes('ip address') ||
      clean.includes('osi');

    if (isTechnicalExplanation) {
      return {
        intent: 'TECHNICAL_HELP',
        mode: 'LEARNING_MODE',
        detectedLanguage: detectedLang,
        confidence: 0.92,
        isCasual: false,
        contextRelevance: {
          useCurrentCourse: false,
          useCurrentMission: false,
          useCurrentPage: false,
          useProgress: false,
          useLab: false,
          allowToolExecution: false,
          allowNavigation: false
        }
      };
    }

    // -------------------------------------------------------------
    // 14. DEFAULT / UNKNOWN
    // -------------------------------------------------------------
    return {
      intent: 'UNKNOWN',
      mode: 'CHAT_MODE',
      detectedLanguage: detectedLang,
      confidence: 0.6,
      isCasual: true,
      contextRelevance: this.createRelevancePolicy(false),
      conversationalResponse: "I'm here! What would you like to explore or practice today?"
    };
  }

  /**
   * Helper to construct ContextRelevancePolicy
   */
  private static createRelevancePolicy(isEnabled: boolean): ContextRelevancePolicy {
    return {
      useCurrentCourse: isEnabled,
      useCurrentMission: isEnabled,
      useCurrentPage: isEnabled,
      useProgress: isEnabled,
      useLab: isEnabled,
      allowToolExecution: isEnabled,
      allowNavigation: isEnabled
    };
  }

  /**
   * Resolves contextual follow-up pronouns like "that", "it", or "continue"
   * from recent conversational memory or current page.
   */
  private static resolveReferencedEntity(
    cleanText: string,
    memory: ConversationalMemoryItem[] = [],
    backgroundPage: string = '/'
  ): {
    entityType?: 'mission' | 'challenge' | 'lab' | 'module' | 'topic';
    targetId?: string;
    category?: string;
    difficulty?: string;
    route?: string;
  } {
    // 1. Search recent memory for previously mentioned entities
    for (let i = memory.length - 1; i >= 0; i--) {
      const item = memory[i];
      if (item.referencedEntities) {
        return {
          entityType: item.referencedEntities.missionId ? 'mission' : (item.referencedEntities.labId ? 'lab' : 'challenge'),
          targetId: item.referencedEntities.missionId || item.referencedEntities.labId,
          category: item.referencedEntities.category,
          difficulty: item.referencedEntities.difficulty,
          route: item.referencedEntities.route
        };
      }
    }

    // 2. Default inference based on current route
    if (backgroundPage.includes('web-security')) {
      return { entityType: 'challenge', category: 'web', targetId: 'WEB-002', route: '/flag-checkpoint' };
    }
    if (backgroundPage.includes('soc') || backgroundPage.includes('flag-checkpoint')) {
      return { entityType: 'mission', category: 'soc', targetId: 'SOC-001', route: '/flag-checkpoint' };
    }

    return { entityType: 'challenge', category: 'general', targetId: 'SOC-001', route: '/flag-checkpoint' };
  }
}
