# 04 — Technical Architecture

CyberForge AI utilizes a full-stack architecture combining a reactive Single-Page Application (SPA) frontend with a lightweight Node.js/Express proxy backend, backed by Google Firebase for authentication and Firestore for document persistence.

---

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER (SPA)                          │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │   React 19 / TypeScript / Vite / Tailwind CSS / Motion            │  │
│  │                                                                   │  │
│  │   ├── Command Center Views (Dashboard, Labs, CTF, SOC)           │  │
│  │   ├── AMAN UI (Chat Feed, Voice Visualizer, Session Manager)      │  │
│  │   ├── Simulated Lab Engines (Linux CLI, Network Topology, SIEM)  │  │
│  │   └── AppContext State Manager (Local + Firestore Sync)           │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  │ Direct Firebase SDK (Client-Side)   │
                  ▼                                     ▼
      ┌─────────────────────────┐           ┌─────────────────────────┐
      │  Firebase Auth Service  │           │   Firestore Database    │
      │  (Google OAuth / Email) │           │  (Per-UID Collections)  │
      └─────────────────────────┘           └─────────────────────────┘
                                     │
                                     │ API Requests (Bearer Tokens / Chat)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     BACKEND / API LAYER (Node / Express)                │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │   Express 4 Server (Port 3000 / Reverse Proxy Compliant)          │  │
│  │                                                                   │  │
│  │   ├── Security Middleware (CORS, Express Rate-Limit, JSON Body)   │  │
│  │   ├── AI Provider Router (`server/aiProviderRouter.ts`)           │  │
│  │   │   ├── Primary Provider: Google Gemini API (Server Secret)     │  │
│  │   │   ├── Dev Environment: Local Ollama (Auto-probed if alive)    │  │
│  │   │   └── Fallback: Deterministic Offline AMAN Engine             │  │
│  │   └── SPA Static Fallback (Production `dist/index.html` Handler)  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Architectural Layers

### A. Frontend Layer (Client-Side)
- **Framework**: React 19 + TypeScript 5.8 + Vite 6.
- **Routing**: `react-router-dom` v7 with code-split lazy routes wrapped in resilient chunk recovery (`lazyWithRetry`).
- **Styling**: Tailwind CSS with custom dark palette tokens, responsive breakpoints, and custom scrollbars.
- **State Management**: Centralized React Context (`AppContext.tsx`) managing profile state, mission milestones, evidence locker, and offline synchronization queues.

### B. Backend & API Layer (Server-Side)
- **Engine**: Node.js with Express 4.
- **Security & Rate Limiting**: `express-rate-limit` guards the `/api/aman/*` endpoints against abuse.
- **Bundling**: Compiled into a single self-contained CommonJS output (`dist/server.cjs`) via `esbuild` to guarantee fast container cold-starts and clean relative import resolution.
- **Secret Protection**: Third-party API credentials (such as `GEMINI_API_KEY`) reside exclusively in server environment variables and are never transmitted to the client browser.

### C. AI Provider Routing & Resiliency
The backend routes AI queries through `server/aiProviderRouter.ts`:
1. **Primary Provider (Production)**: Google Gemini API utilizing the `@google/genai` SDK.
2. **Local Development (Optional)**: Probes local Ollama instances (`http://127.0.0.1:11434`). In production cloud environments, localhost probes are bypassed to eliminate network timeouts.
3. **Deterministic Fallback Engine**: If Gemini is unreachable or quota limits are exceeded, the server transitions to a rule-based cybersecurity response engine, ensuring zero user-facing 500 errors.

### D. Data Persistence & Security Isolation
- **Authentication**: Firebase Authentication manages user sessions with Google Identity Services and email login.
- **Database**: Firebase Firestore stores user profiles, progress, evidence items, notes, and chat sessions.
- **Security Rules**: Firestore rules enforce strict owner-only read/write access:
  ```
  match /users/{userId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  ```

---

## 3. Production Deployment Footprint

- **Container Ingress**: Dev and production servers bind to `0.0.0.0:3000`.
- **Static Asset Serving**: In production mode, Express serves static assets directly from `dist/` with fallback to `index.html` for client-side SPA routing.
- **No Heavy External Infrastructure**: The platform requires no dedicated GPU clusters, local virtual machines, or persistent Redis instances to operate, keeping infrastructure hosting costs negligible.
