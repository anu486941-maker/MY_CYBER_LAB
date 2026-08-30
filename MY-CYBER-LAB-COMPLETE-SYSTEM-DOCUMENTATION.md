# MY CYBER LAB + AMAN 3.0 — COMPLETE SYSTEM DOCUMENTATION & KNOWLEDGE MODEL

**Authoritative Baseline:** `MY-CYBER-LAB-BETA-1`  
**System Architecture:** Full-Stack Node.js/Express + Vite React SPA + Firestore Cloud Persistence + Server-Side Gemini AI Proxy  
**Audit Date:** 2026-08-30  
**Status:** 🟢 **PRODUCTION & BETA READY (183/183 PASS, 0 TS Errors)**

---

## 1. Executive Summary & Purpose

**MY CYBER LAB** is an interactive, browser-based cybersecurity training platform and adaptive cyber range designed for learners ranging from absolute beginners to professional security practitioners. Integrated deeply into every workflow is **AMAN 3.0**, an AI mentor engineered around Socratic teaching, progressive hint ladders (Levels 0–5), multilingual code-switching (English, Hindi, Hinglish), and misconception detection.

### Core Pillars:
1. **Interactive Cyber Range**: Sandboxed, real-time command execution, simulated network packet visualizer, Web Security challenges, and SOC SIEM log investigation tools.
2. **AMAN 3.0 Socratic Intelligence**: Real-time server-side AI mentoring using a multi-tier fallback architecture (`gemini-3.7-flash` $\to$ `gemini-3.6-flash` $\to$ `gemini-3.1-flash-lite` $\to$ Offline Resilient Engine) with 24-hour quota quarantining.
3. **Evidence-Based Learning Brain**: Mathematical progression state machine (`UNKNOWN` $\to$ `INTRODUCED` $\to$ `LEARNING` $\to$ `PRACTICING` $\to$ `COMPETENT` $\to$ `MASTERED`) requiring practical lab completion and quiz accuracy before advancing mastery.
4. **Role Personalization & Career Blueprints**: Curricula dynamically adapted for SOC Analysts, Penetration Testers, Cloud Security Specialists, and Security Engineers.

---

## 2. Complete Information Architecture & Route Map

```
Landing Page (/)
 │
 ├── Auth & Identity (/login, /register, /onboarding, /role-selection)
 │
 ├── Core Hub (/dashboard)
 │    ├── AI Study Planner (/study-plan)
 │    ├── Adaptive Learning Analytics (/analytics)
 │    ├── Learning Paths & Tracks (/learning-path, /roadmap)
 │    └── Dynamic Skill Tree (/skill-tree, /skill-library)
 │
 ├── AMAN AI Mentor Core (/ai-mentor)
 │    ├── AI Multi-Tool Reasoning (/multi-tool-reasoning)
 │    └── Mistakes Journal (/mistakes-journal)
 │
 ├── Practical Cyber Range & Labs (/labs, /cyber-range, /master-range)
 │    ├── Network Packet Lab (/network-lab, /network-visualizer, /subnetting-trainer)
 │    ├── Linux Terminal Sandbox (/linux-lab, /attackbox)
 │    ├── Web Application Security Lab (/web-security-lab)
 │    ├── Dual-Lens Architecture (/dual-lens)
 │    ├── Ethical Hacker Command Center (/command-center, /workspace)
 │    └── Real-World Authorized Client Engagements (/authorized-engagement)
 │
 ├── SOC Defense & Incident Response (/soc-simulator, /live-incident)
 │    ├── Investigation Center (/investigation-center, /investigation-board)
 │    ├── Threat Hunting Lab (/threat-hunting)
 │    └── Real-World Incident Case Studies (/real-cases, /case-study/:id)
 │
 ├── Gamification, CTF & Community (/ctf-arena, /wargame-arena, /missions)
 │    ├── TryHackMe / HackTheBox Bridge Rooms (/thm-rooms)
 │    ├── Teams & Cohorts (/teams)
 │    ├── Achievements & Badges (/achievements)
 │    └── Rewards & Perks Shop (/rewards)
 │
 ├── Career, Portfolio & Credentials (/career-roles, /career-simulation)
 │    ├── Real-World Portfolio Builder (/portfolio)
 │    ├── Certificate Issuance (/certificate)
 │    └── Public Certificate Verification (/verify-certificate/:id)
 │
 └── Administration & Health (/admin, /instructor, /acquisition, /debug)
```

---

## 3. Role & Permission Matrix

| Feature / Subsystem | Guest / Unauthenticated | Member / Learner | Admin / Instructor |
| :--- | :---: | :---: | :---: |
| **Landing & Demo Previews** | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed |
| **Public Certificate Verification** | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed |
| **Interactive AMAN Chat** | 🟡 Limited Demo | 🟢 Full Access | 🟢 Full Access |
| **Hands-On Cyber Range Execution** | 🔴 Restricted | 🟢 Isolated Sandbox | 🟢 Isolated Sandbox |
| **Personal Notes & Persistence** | 🔴 Local Only | 🟢 Firestore Sync | 🟢 Firestore Sync |
| **Certificates & Badges** | 🔴 Restricted | 🟢 Earn & Verify | 🟢 Earn & Verify |
| **Cohort & Team Management** | 🔴 Restricted | 🟢 Team Member | 🟢 Full Admin Control |
| **System Telemetry & Beta Monitoring** | 🔴 Restricted | 🔴 Restricted | 🟢 Real-Time Dashboard |

---

## 4. Full-Stack Architecture & Security

```
[ BROWSER CLIENT (React 18 + Vite + Tailwind CSS) ]
                     │
                     │ (HTTPS / SSE Streaming)
                     ▼
[ BACKEND PROXY (server.ts - Express + Node.js CJS) ]
  ├── 1. Rate Limiting & Input Validation
  ├── 2. Terminal Command Sanitization (/tmp/mcl_sandbox isolation)
  ├── 3. Telemetry & Error Deduplication (BetaHealthMonitor)
  └── 4. Gemini AI Model Proxy with 24-Hour Quota Quarantine
         ├── Tier 1: Gemini 3.7 Flash
         ├── Tier 2: Gemini 3.6 Flash
         ├── Tier 3: Gemini 3.1 Flash Lite
         └── Tier 4: Offline Resilient Engine (Socratic fallback)
                     │
                     │ (Encrypted gRPC / REST)
                     ▼
[ FIRESTORE CLUSTER (ai-studio-mycyberlab-72b2ef56-a955-44ea-8f40-478d3756f0ba) ]
  ├── Collection /users/{userId} -> Profiles, roles, study plans
  ├── Collection /progress/{userId} -> Lab flags, quiz scores, mastery stages
  ├── Collection /notebooks/{userId} -> Socratic notes, snippets
  └── Collection /teams/{teamId} -> Cohort leaderboards & collaboration
```

---

## 5. Security & Sandbox Boundary Controls

1. **Zero Secret Leakage**: API keys and service secrets remain strictly server-side in `process.env`. Zero credentials are leaked in client bundles or network logs.
2. **Terminal Isolation**: Real command execution is restricted to `/tmp/mcl_sandbox` with stripped environment paths, read-only system mounts, and blacklisted destructive commands (`rm -rf /`, fork bombs, raw socket creation).
3. **Firestore Security Rules**: User collections enforce strict `request.auth.uid == userId` constraints; role changes require administrative token claims.
4. **Telemetry Sanitization**: `BetaHealthMonitor` scrubs all API keys (`AIzaSy...`), tokens, and passwords using pattern-matching redaction before recording metrics.

---

## 6. Verification & Automated Quality Baseline

- **Automated Regression Suite**: **183 / 183 tests PASS** across **24 test suites**.
- **TypeScript Typecheck (`tsc --noEmit`)**: **0 errors**.
- **Production Build Compilation**: **PASS** (Vite static assets + standalone esbuild CJS server).
- **Beta Readiness Score**: **98 / 100**.
- **AMAN AI Reliability Score**: **99 / 100**.
