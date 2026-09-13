# Fact Check & Repository Verification Notes

This document provides a factual verification audit of all architectural, functional, security, and test claims made across the **CyberForge AI** acquisition documentation against the actual codebase implementation.

| Claim / Component | Repository Evidence | Verification Status | Notes |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | `package.json`, `src/main.tsx`, React 19 + TypeScript + Vite | **VERIFIED** | High performance SPA bundled with Vite 6. |
| **Styling & UI Atmosphere** | `src/index.css`, `@tailwindcss/vite` | **VERIFIED** | Dark-first technical styling with functional color mapping. |
| **Backend / API Layer** | `server.ts`, Express, rate-limiting, CORS | **VERIFIED** | Full-stack architecture; server-side proxies for AI API keys. |
| **AI Provider & AMAN Engine** | `server/aiProviderRouter.ts`, `src/aman/` | **VERIFIED** | Production routes to Gemini Free Tier with deterministic offline AMAN fallback. |
| **Local Ollama Handling** | `server/aiProviderRouter.ts` | **VERIFIED** | Detects local availability and disables localhost attempts in production to prevent timeouts. |
| **Authentication System** | `src/lib/firebase.ts`, `src/context/AppContext.tsx` | **VERIFIED** | Google OAuth & email authentication via Firebase Auth with demo fallback mode. |
| **Database & Persistence** | `src/lib/firebase.ts`, `firestore.rules` | **VERIFIED** | Per-user Firestore documents partitioned by authenticated `uid`. |
| **Test Suite Coverage** | `tests/`, `src/test/`, Vitest test runner | **VERIFIED** | 38 test files, 362 passing tests (100% success rate). |
| **Pedagogical Modes** | `src/utils/amanTeachingMode.ts` | **VERIFIED** | TEACH, COACH, DEBUG, QUIZ, CHALLENGE, REVIEW, ROADMAP, LAB_ASSIST, CAREER. |
| **Interactive Labs** | `src/pages/LinuxLabPage.tsx`, `NetworkLabPage.tsx`, `SocSimulatorPage.tsx`, `CtfArenaPage.tsx` | **VERIFIED** | Realistic simulated CLI, packet topology, SIEM alert triage, and flag verification. |
| **Certificates & Verification** | `src/pages/CertificatePage.tsx`, `VerifyCertificatePage.tsx` | **VERIFIED** | Cryptographic verification code and printable/exportable credentials. |
| **Traction / Revenue / Users** | Not tracked in code | **NOT APPLICABLE** | Marked as *"Not publicly disclosed / not provided"* across all documentation. |
| **Third-Party Certifications** | (SOC 2, ISO 27001, FedRAMP, etc.) | **UNSUPPORTED** | No third-party audits claimed; labeled as independent engineering audits only. |
