# 05 — AI / AMAN Technical Brief

**AMAN** (Adaptive Mentorship & Autonomous Navigator) is the core artificial intelligence engine embedded within CyberForge AI. AMAN is designed to replicate the role of a Senior Cybersecurity Instructor and Incident Commander.

---

## 1. Why AMAN Exists

Standard large language model interfaces present major shortcomings in technical training:
1. **Direct Answer Leakage**: Generic AI chat interfaces provide direct answers, reducing student engagement and retention.
2. **Lack of Contextual Grounding**: Standard models lack awareness of what command a student just ran, what role they are pursuing, or what error code was generated.
3. **Hallucination of Dangerous Commands**: Generic LLMs may recommend non-functional or risky production commands without appropriate security framing.

AMAN addresses these issues by wrapping LLM interactions in specialized cybersecurity system prompts, pedagogical mode constraints, and structured output dispatchers.

---

## 2. Pedagogical Operating Modes

Operators can explicitly select—or AMAN can automatically infer—one of 9 distinct instructional modes:

| Mode | Trigger / Intent | Pedagogical Behavior |
| :--- | :--- | :--- |
| `TEACH` | Concept explanations | Step-by-step conceptual breakdowns using real-world analogies and ASCII diagrams. |
| `COACH` | General guidance | Socratic hints and guided questions that encourage independent problem solving. |
| `DEBUG` | Command syntax errors | Pinpoints syntax errors in `nmap`, `chmod`, `iptables`, or `sqlmap` and explains root causes. |
| `QUIZ` | Knowledge testing | Formulates rapid-fire technical questions to evaluate student comprehension. |
| `CHALLENGE` | Practical scenarios | Issues realistic simulated incident scenarios and log triage tasks. |
| `REVIEW` | Work evaluation | Reviews submitted evidence, writeups, and command outputs against industry criteria. |
| `ROADMAP` | Career planning | Recommends optimal next modules and certifications based on current skill gaps. |
| `LAB_ASSIST` | Active lab walkthrough | Provides tiered hints without directly revealing flags or challenge solutions. |
| `CAREER` | Job market advice | Provides resume feedback, mock interview scenarios, and salary insights for security roles. |

---

## 3. AMAN Conversational Architecture

```
[ Operator Input (Text / Speech) ]
               │
               ▼
[ Intent & Mode Classifier ] ──► (Infers TEACH, DEBUG, QUIZ, or Small-talk)
               │
               ▼
[ Context Hydration Layer ]
   ├── Injects: Selected Role (e.g. SOC Analyst)
   ├── Injects: Skill Level (e.g. Beginner)
   ├── Injects: Active Module / Lab ID
   └── Injects: Recent Command History & Errors
               │
               ▼
[ Server AI Router (`/api/aman/chat`) ]
   ├── Route 1: Google Gemini Flash / Pro API (Primary)
   ├── Route 2: Local Ollama Model (Development only)
   └── Route 3: Deterministic Rule-Based Fallback Engine
               │
               ▼
[ Action Dispatcher & Response Parser ]
   ├── Streams Text Response to Client UI
   ├── Parses Tool Calls & Workflow Badges
   └── Updates Visual Audio Waveform & Speech Engine
```

---

## 4. Conversation Management & Session Features

- **Session Manager (`AmanSessionManager.ts`)**: Supports full multi-turn conversation threading.
- **Categorization**: Sessions are automatically organized into categories (`General`, `Lab Guidance`, `SOC Analysis`, `Offensive Ops`, `Career Advice`, `Incident Investigation`).
- **Persistence & Export**: Sessions persist in Firestore / local storage and can be exported as clean Markdown dossiers or JSON archives.
- **Voice Synthesis Engine**: Integrates client-side Web Speech APIs with dynamic soundwave visualizers for auditory learners.

---

## 5. Acquirer Extension Opportunities (Future Potential)

A prospective buyer can leverage AMAN's existing prompt scaffolding and routing layer to deploy several high-value commercial extensions:

1. **Enterprise SOC Assistant**: Re-prompt AMAN to ingest real enterprise log feeds and serve as a Tier-1 SOC co-pilot.
2. **Automated Lab Grader**: Extend the `REVIEW` mode to evaluate and score student-submitted incident response writeups automatically.
3. **White-Label Corporate Instructor**: Customize AMAN's personality, avatar, and knowledge base to reflect corporate policies and proprietary security tooling.
4. **Voice-First AI Interview Coach**: Build out structured technical mock interviews with real-time vocal feedback for cybersecurity job candidates.
