# 15 — Acquisition FAQ

This document addresses 25 common questions prospective buyers ask during due diligence.

---

### 1. General & Strategic
1. **What is CyberForge AI?**  
   CyberForge AI is a production-ready cybersecurity education platform featuring role-based roadmaps, interactive in-browser labs (Linux, Networking, SOC, Web, CTF), and an embedded AI mentor named AMAN.
2. **Why is the asset being sold?**  
   The founder is looking to transition the technology asset to a dedicated operator, training academy, or EdTech company with existing distribution channels to scale it.
3. **What makes this different from an ordinary AI wrapper?**  
   Unlike simple wrappers, CyberForge AI features proprietary simulated lab engines (interactive Linux CLI, subnet math engines, packet visualizers, SIEM alert feeds) that interact contextually with AMAN.

### 2. Technology & Architecture
4. **What is the core technology stack?**  
   React 19, TypeScript 5.8, Vite 6, Node.js, Express 4, Tailwind CSS, Firebase Auth, and Firebase Firestore.
5. **Is the platform production-ready?**  
   Yes. It passes full TypeScript linting (`tsc --noEmit`), compiles a clean single-bundle backend (`dist/server.cjs`), and passes 362 automated tests across 38 test files.
6. **Is Google Gemini required, or can I swap in Claude / OpenAI / DeepSeek?**  
   Gemini is the default provider, but all AI routing is cleanly decoupled inside `server/aiProviderRouter.ts`. An acquirer can easily point the endpoint to OpenAI, Anthropic, or an open-source model endpoint in less than an hour.
7. **What happens if the AI provider goes down or exceeds quota?**  
   The platform includes a built-in deterministic offline fallback engine for AMAN that provides structured, rule-based cybersecurity responses without throwing client errors.

### 3. Labs & Simulations
8. **Do the labs require expensive dedicated virtual machines (AWS EC2 / DigitalOcean Droplets)?**  
   No. All standard training labs (Linux CLI, Network Topology, SIEM triage, CTF challenges) run via high-performance client-side simulation engines. This keeps hosting costs near zero.
9. **Can an acquirer add full Dockerized VMs in the future?**  
   Yes. The modular architecture easily accommodates backend WebSocket bridges to Docker/Kubernetes container clusters if heavy real-world kernel exploitation is desired.
10. **How many curriculum tracks are included?**  
    Four comprehensive career tracks: SOC Analyst, Ethical Hacker / Penetration Tester, Web Security Specialist, and CTF Competitor.

### 4. Data, Security & Handover
11. **How is user data protected?**  
    User data is strictly partitioned in Firestore by authenticated UID. Firestore security rules reject any unauthorized cross-tenant queries.
12. **Are API keys exposed to the browser?**  
    No. AI API keys are stored in server-side environment variables and proxied through Node.js Express.
13. **What is required for the handover?**  
    Transfer of the Git repository, transfer of the Firebase/GCP project ownership, transfer of domain names (if applicable), and updating production environment secrets.
14. **How long does handover typically take?**  
    Technical handover can be completed within 24–48 hours.

### 5. Monetization & Business Potential
15. **Is there current revenue or subscriber traction?**  
    Financial performance and historical metrics are not publicly disclosed / not provided. The asset is sold as a fully functional technology and content asset.
16. **How can the buyer monetize this asset?**  
    Via monthly/annual B2C subscriptions (Pro tier), B2B team licensing for corporate IT/SOC training, white-label academy licensing, or verified certificate fees.
17. **Can the platform be completely rebranded?**  
    Yes. Brand names, logos, colors, and copy are cleanly organized in design tokens and logo components (`CyberForgeLogo.tsx`).

### 6. Maintenance & Operating Costs
18. **What are the ongoing hosting costs?**  
    Under normal operations using Google Gemini Free Tier and Firebase Spark/Blaze tiers, total infrastructure costs can be as low as $10–$25/month for Cloud Run or VPS hosting.
19. **Are there any proprietary SDK licenses or recurring royalties?**  
    None. All dependencies are open-source with permissive licenses (MIT / Apache 2.0 / ISC).
20. **Is the codebase fully documented?**  
    Yes. The repository includes extensive architectural notes, TypeScript interface definitions, and this 22-part acquisition data room.
