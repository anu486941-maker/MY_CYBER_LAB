# Security Policy & Architecture Guide — MY CYBER LAB v1.0

## 1. Executive Summary & Security Philosophy

**MY CYBER LAB** is designed from the ground up as an educational, defensive, and authorized offensive cybersecurity proving ground. 

As a release-grade cybersecurity platform, MY CYBER LAB enforces the **Deny-by-Default** principle, rigorous container and execution sandboxing, cryptographic evidence hashing, and fail-closed architecture.

---

## 2. Core Security Controls & Architecture

### 2.1 Authorized Client Engagement (ACE) Scope Policy
- **Deny-by-Default RoE Engine**: All commands executed in client assessment workflows are validated against the active client scope (`authorizedSubnet`, `authorizedAssets`, and explicit Rules of Engagement).
- **Out-of-Scope Blocking**: Any reconnaissance, port scan, or payload sent to out-of-scope targets or non-whitelisted tooling is blocked immediately and written to the security audit trail.
- **Client Data Isolation**: Evidence lockers, vulnerability findings, and executive reports are cryptographically isolated per engagement identifier.

### 2.2 Terminal Sandbox & Filesystem Hardening
- **Virtual Chroot & Path Traversal Prevention**: The terminal execution environment runs in a sandboxed, unprivileged sub-environment (`/tmp/mcl_sandbox`).
- **Forbidden Subsystems & Tokens**: Commands containing path traversal (`../`, `..\`), direct access to `/etc`, `/var`, `/proc`, `/sys`, `/root`, raw sockets (`/dev/tcp`, `/dev/udp`), or destructive forkbombs (`:(){ :|:& };:`) are neutralized before execution.
- **Execution Limits**: All sandbox commands are constrained to a strict 3.0-second execution timeout and 500KB buffer limits to prevent resource exhaustion and DoS.
- **Environment Scrubbing**: Sensitive runtime environment secrets (`API_KEY`, `FIREBASE`, `GEMINI`) are stripped from process execution environments.

### 2.3 Cryptographic Forensic Evidence Integrity
- **Deterministic Evidence Hashing**: Every forensic artifact preserved in the ACE Evidence Locker is sealed with a cryptographic hash digest based on engagement ID, asset IP, UTC timestamp, and raw output payload.
- **Integrity Verification**: Real-time verification indicates whether stored evidence has suffered tampering or modification.
- **CVSS 3.1 Standard Scoring**: Vulnerabilities are calculated using standard CVSS 3.1 specification metrics with vector validation.

### 2.4 AI Mentor (AMAN) Safety & Prompt Injection Hardening
- **Immutable Ethical Boundaries**: AMAN enforces strict ethical constraints. Any jailbreak attempts ("DAN mode", "disregard guidelines", unapproved exploit generation) are declined and redirected to defensive learning goals.
- **Server-Side Key Isolation**: All Gemini API calls are strictly handled server-side (`/api/*`). No API keys or secret tokens are ever sent to client-side bundles.

### 2.5 Real Range Gate
- **Safe Default**: `REAL_RANGE_ENABLED=false` is enforced by default to prevent inadvertent network traffic to external systems.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability within MY CYBER LAB:

1. **Do not disclose publicly** until an authorized fix has been issued.
2. **Submit a detailed report** including:
   - Reproduction steps and proof of concept
   - Affected component/endpoint
   - Impact evaluation and CVSS vector
3. **Remediation SLA**: We commit to acknowledging reports within 24 hours and providing targeted patches within 7 business days.

---

## 4. Compliance & Standards

- **PTES**: Penetration Testing Execution Standard workflow compliance.
- **OWASP Top 10**: Direct CWE and vulnerability mapping.
- **NIST SP 800-115**: Technical Guide to Information Security Testing and Assessment alignment.
