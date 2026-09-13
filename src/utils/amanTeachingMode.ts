/**
 * AMAN Teaching Modes & Automatic Intent Inference
 * Maps and automatically detects the optimal cybersecurity pedagogy mode based on user inquiry.
 */

export type AmanTeachingMode = 
  | 'TEACH'
  | 'COACH'
  | 'DEBUG'
  | 'QUIZ'
  | 'CHALLENGE'
  | 'REVIEW'
  | 'ROADMAP'
  | 'LAB_ASSIST'
  | 'CAREER';

export interface TeachingModeMeta {
  id: AmanTeachingMode;
  label: string;
  badge: string;
  description: string;
  color: string;
  quickPrompt: string;
}

export const AMAN_TEACHING_MODES: Record<AmanTeachingMode, TeachingModeMeta> = {
  TEACH: {
    id: 'TEACH',
    label: 'Teach',
    badge: 'CONCEPT',
    description: 'Direct, clear, structured cybersecurity concept explanation',
    color: 'emerald',
    quickPrompt: 'Teach me the core concepts of this topic'
  },
  COACH: {
    id: 'COACH',
    label: 'Coach',
    badge: 'SOCRATIC',
    description: 'Socratic step-by-step guidance without spoiling answers',
    color: 'amber',
    quickPrompt: 'Give me a hint on how to approach this'
  },
  DEBUG: {
    id: 'DEBUG',
    label: 'Debug',
    badge: 'SYNTAX',
    description: 'Diagnose commands, network errors, and terminal syntax',
    color: 'rose',
    quickPrompt: 'Why is my command failing?'
  },
  QUIZ: {
    id: 'QUIZ',
    label: 'Quiz',
    badge: 'RECALL',
    description: 'Active-recall questions to test and verify retention',
    color: 'cyan',
    quickPrompt: 'Quiz me on this concept'
  },
  CHALLENGE: {
    id: 'CHALLENGE',
    label: 'Challenge',
    badge: 'PRACTICE',
    description: 'Practical hands-on scenario challenges and CTF problems',
    color: 'purple',
    quickPrompt: 'Give me a practical challenge'
  },
  REVIEW: {
    id: 'REVIEW',
    label: 'Review',
    badge: 'AUDIT',
    description: 'Constructive review of submitted answers and command flags',
    color: 'blue',
    quickPrompt: 'Review my answer for security flaws'
  },
  ROADMAP: {
    id: 'ROADMAP',
    label: 'Roadmap',
    badge: 'CAREER',
    description: 'Next learning steps based on your active role and progress',
    color: 'indigo',
    quickPrompt: 'What should I learn next?'
  },
  LAB_ASSIST: {
    id: 'LAB_ASSIST',
    label: 'Lab Assist',
    badge: 'SIMULATION',
    description: 'Environment guidance without claiming remote execution',
    color: 'teal',
    quickPrompt: 'Help me navigate this lab objective'
  },
  CAREER: {
    id: 'CAREER',
    label: 'Career',
    badge: 'INDUSTRY',
    description: 'Real-world competencies, salaries, and interview advice',
    color: 'violet',
    quickPrompt: 'What skills do employers look for here?'
  }
};

/**
 * Automatically infers the appropriate teaching mode from the user's inquiry
 */
export function inferAmanTeachingMode(prompt: string, fallbackMode: AmanTeachingMode = 'TEACH'): AmanTeachingMode {
  const clean = (prompt || '').toLowerCase().trim();

  if (!clean) return fallbackMode;

  // 1. QUIZ / TEST
  if (/\b(quiz|test me|ask me a question|exam|trivia|flashcard)\b/i.test(clean)) {
    return 'QUIZ';
  }

  // 2. CHALLENGE / CTF
  if (/\b(challenge|give me a task|scenario challenge|ctf|practical scenario|tryhackme|hackthebox)\b/i.test(clean)) {
    return 'CHALLENGE';
  }

  // 3. DEBUG / ERROR ANALYSIS
  if (/\b(why is my.*wrong|debug|syntax error|command error|fix my command|error in command|why.*failing|not working)\b/i.test(clean)) {
    return 'DEBUG';
  }

  // 4. ROADMAP / NEXT STEPS
  if (/\b(what should i learn next|what is next|what's next|where to go next|roadmap|next module|next step)\b/i.test(clean)) {
    return 'ROADMAP';
  }

  // 5. REVIEW / AUDIT
  if (/\b(review my|check my answer|is this correct|is my answer right|verify my answer|audit my)\b/i.test(clean)) {
    return 'REVIEW';
  }

  // 6. COACH / HINT / SOCRATIC
  if (/\b(coach me|guide me|step by step|give me a hint|hint please|don't give me the answer|nudge)\b/i.test(clean)) {
    return 'COACH';
  }

  // 7. LAB ASSIST
  if (/\b(lab assist|help me with this lab|explain this lab|stuck in lab|how do i do this lab)\b/i.test(clean)) {
    return 'LAB_ASSIST';
  }

  // 8. CAREER / INTERVIEW
  if (/\b(career|interview|salary|resume|job|hiring|certification|ceh|oscp|security\+)\b/i.test(clean)) {
    return 'CAREER';
  }

  // 9. TEACH
  if (/\b(teach|explain|what is|how does|samjha|sikhao|deep dive)\b/i.test(clean)) {
    return 'TEACH';
  }

  return fallbackMode;
}
