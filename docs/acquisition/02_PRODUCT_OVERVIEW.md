# 02 — Product Overview & User Journey

CyberForge AI is engineered as an integrated cybersecurity command center and AI academy. The application moves students seamlessly from basic diagnostic calibration to advanced offensive and defensive operational simulations.

---

## 1. Product Vision & Philosophy

The guiding philosophy of CyberForge AI is **"Action Over Theory"**:
1. **Zero Setup Friction**: Traditional cyber ranges require multi-gigabyte virtual machines or complex VPN setups. CyberForge AI provides in-browser simulated terminal, networking, and SIEM environments that launch instantly.
2. **Context-Aware Socratic AI**: Instead of a detached chatbot that generates generic answers, AMAN is integrated into the active view, receiving context on the user's selected role, current module, and CLI errors to deliver tailored guidance.
3. **Structured Skill Scaffolding**: Progression is organized across defined career paths rather than uncurated lists of disconnected tasks.

---

## 2. Complete End-to-End User Journey

```
[ New Operator Arrival ]
        ↓
[ Authentication & Codename Selection ]
        ↓
[ 8-Step Interactive Onboarding & Diagnostic ]
        ↓
[ Role Calibration (SOC / Pentest / Web / CTF) ]
        ↓
[ Tactical Command Center Dashboard ]
   ├── Continue Primary Mission
   ├── Engage Specialized Lab (Linux / Net / Web / SOC / CTF)
   ├── Consult AMAN AI Mentor (Text / Voice)
   └── Collect Evidence & Verify Flags
        ↓
[ Capstone Completion & Certificate Issuance ]
        ↓
[ Public Verification Portal ]
```

### Step 1: Authentication & Onboarding
- Operators authenticate via Google OAuth or standard email accounts.
- The onboarding wizard collects target goals, baseline computing proficiency, weekly study commitments, and preferred instructional languages (English / Hinglish / Hindi).
- A baseline diagnostic assessment calibrates initial skill levels and unlocks tailored recommendations.

### Step 2: Role Selection & Skill Matrix Calibration
Operators choose a dedicated cybersecurity specialization track:
- **SOC Analyst**: Focuses on SIEM triage, Sysmon/Syslog investigation, Wireshark packet capture, and MITRE ATT&CK incident mapping.
- **Ethical Hacker / Pentester**: Covers network reconnaissance (Nmap), vulnerability exploitation, Linux privilege escalation, and client reporting.
- **Web Security Specialist**: Explores OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, IDOR, SSRF) and client-server security architectures.
- **CTF Competitor**: Trains rapid problem-solving across cryptography, reverse engineering, forensic carving, and web challenges.

### Step 3: Command Center Dashboard
The central dashboard displays:
- **Primary Mission Briefing**: Active tactical objective with real-time completion status and direct lab launch buttons.
- **AMAN AI Status Widget**: Fast entry point for Socratic text and voice tutoring.
- **Learning Progress & Skill Matrix**: Category-by-category mastery tracking backed by Firestore persistence.
- **Quick-Access Lab Suite**: One-click navigation to Linux CLI, Network Visualizer, SOC Triage, and CTF arenas.

### Step 4: Interactive Training Labs
- **Linux Terminal Lab**: Realistic command execution environment with full support for filesystem exploration, file permissions (`chmod`, `chown`), text manipulation (`grep`, `awk`), and process monitoring (`ps`, `top`).
- **Network Simulator & Subnet Trainer**: Interactive visualizer mapping routers, firewalls, and server nodes with subnet calculating challenges (/24 to /30).
- **SOC Incident Simulator**: Realistic log stream simulating brute-force attacks, malware execution, and port scans with structured investigative workflows.
- **CTF Arena**: Progressive challenge categories containing cryptographic ciphers, steganography tasks, and flag submissions.

### Step 5: Evidence Locker & Portfolio Building
- Operators save command outputs, triage notes, and verified flags into an organized Evidence Locker.
- Structured findings can be compiled into an executive penetration testing report.

### Step 6: Certificate Generation & Public Verification
- Upon completing module milestones, operators generate cryptographically verifiable certificates of completion.
- Each certificate features a distinct verification hash verifiable through the public `/verify-certificate` route.
