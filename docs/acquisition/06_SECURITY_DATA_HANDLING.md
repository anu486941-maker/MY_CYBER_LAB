# 06 — Security & Data Handling

This document provides a technical overview of security boundaries, data governance, secrets isolation, and identity management implemented in CyberForge AI.

---

## 1. Security Architecture & Controls

CyberForge AI enforces strict client-server boundaries to protect sensitive credentials and isolate user data.

### Implemented Security Controls:
1. **Server-Side API Key Secrecy**: The Google Gemini API key (`GEMINI_API_KEY`) is stored exclusively in server environment variables and accessed only in Node.js runtime code. It is never exposed in client bundle files or browser network traces.
2. **UID-Based Firestore Partitioning**: All learner state (progress, evidence, chat sessions, certificates) is scoped under `/users/{uid}/*` subcollections in Firestore.
3. **Database Security Rules**: Firestore rules enforce that users can only read, write, and query documents that match their authenticated UID:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
4. **Backend Rate Limiting**: The Express backend incorporates `express-rate-limit` on `/api/aman/*` routes to prevent request flooding and DDoS abuse.
5. **CORS Enforcement**: Cross-Origin Resource Sharing is locked down to authorized origins.
6. **Client-Side Simulation Isolation**: Terminal commands, packet visualizers, and CTF challenges execute entirely within isolated JavaScript runtimes on the client. No unvetted user code is executed on the host server shell.

---

## 2. User Data Handling & Privacy

| Data Category | Storage Location | Retention / Access Policy |
| :--- | :--- | :--- |
| **Authentication Profiles** | Firebase Auth Service | Managed by Google Identity. Stores email, UID, and display name. |
| **Learning Progress & XP** | Firestore (`/users/{uid}`) | Accessible only by the authenticated owner. |
| **Evidence & Notes** | Firestore (`/users/{uid}/evidence`) | User-generated artifacts, flags, and investigative notes. |
| **AMAN Chat Sessions** | Firestore (`/users/{uid}/chats`) | Conversation history. User can delete or export at any time. |
| **Certificate Verification** | Firestore (`/certificates/{certId}`) | Public read access permitted for verification code lookups. |

---

## 3. Known Limitations & Handover Considerations

- **No Third-Party Compliance Certifications**: CyberForge AI has undergone thorough internal engineering audits and automated testing, but has not undergone formal SOC 2 Type II, ISO 27001, or FedRAMP audits.
- **Client-Side Terminal Simulation**: The Linux terminal is a high-fidelity frontend simulator, not a full hypervisor-backed virtual machine. For advanced kernel-level exploit training (e.g. ring-0 rootkits), an acquirer may integrate external container virtualization (e.g. Docker/Kubernetes sandboxes).
- **Public Verification Data**: Certificate verification records contain student names and completion dates to facilitate public verification. If an acquirer requires GDPR "right-to-be-forgotten" features, an automated certificate revocation flow should be added.

---

## 4. Recommended Post-Acquisition Hardening Steps

For enterprise and B2B deployments, an acquirer may consider:
1. **SSO / SAML 2.0 Integration**: Adding Okta, Azure AD, or Google Workspace enterprise sign-on via Firebase Auth Enterprise.
2. **Granular Role-Based Access Control (RBAC)**: Implementing an Instructor / Admin dashboard with multi-tenant team grouping.
3. **WAF & CDN Provisioning**: Placing Cloudflare or Google Cloud Armor in front of the production ingress.
