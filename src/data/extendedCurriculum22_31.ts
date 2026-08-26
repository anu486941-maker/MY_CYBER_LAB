import { LevelModule } from '../types';

export const EXTENDED_LEVELS_22_TO_31: Record<number, LevelModule> = {
  22: {
    level: 22,
    title: 'Cryptography & Secure Communications',
    code: 'LVL-22',
    description: 'Master symmetric vs asymmetric cryptography, digital signatures, hashing vs encoding vs encryption, certificates, PKI, and TLS handshakes.',
    category: 'Security Fundamentals',
    status: 'locked',
    lessonsCount: 8,
    completedLessons: 0,
    xpReward: 950,
    lessons: [
      {
        id: 'l22-1',
        levelId: 22,
        title: 'Encoding vs Encryption vs Hashing',
        duration: '15 min',
        xpReward: 120,
        summary: 'Clarify the core differences: Encoding ensures data usability, Hashing ensures integrity, and Encryption ensures confidentiality.',
        theoryContent: `A fundamental mistake in security is confusing encoding, hashing, and encryption:\n\n1. Encoding (e.g. Base64, URL-encoding, Hex):\n• Purpose: Data usability and safe transport across ASCII protocols.\n• Key: None. Anyone can reverse it instantly without a secret.\n\n2. Hashing (e.g. SHA-256, bcrypt, MD5):\n• Purpose: One-way data integrity verification and password derivation.\n• Reversibility: Mathematically irreversible. Given H(m), computing m is computationally infeasible.\n\n3. Encryption (e.g. AES-256-GCM, RSA, ChaCha20):\n• Purpose: Confidentiality.\n• Reversibility: Reversible only with the designated secret mathematical key.`,
        interactiveExample: {
          title: 'Encoding vs Hashing vs Encryption Visualizer',
          type: 'code_snippet',
          description: 'Input "admin_secret"',
          codeOrData: 'Base64: YWRtaW5fc2VjcmV0\nSHA-256: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918\nAES-256: 4f7a1c89e4b2d3... (Requires Key)'
        },
        quiz: {
          question: 'If you store passwords in a database encoded with Base64, what is the primary security flaw?',
          options: ['Base64 requires too much CPU to decode', 'Base64 is an encoding with no key and can be instantly reversed by anyone', 'Base64 produces one-way hashes that cannot be validated', 'Base64 requires an SSL certificate'],
          correctIndex: 1,
          explanation: 'Base64 is purely an encoding mechanism for data representation, providing zero confidentiality or security.'
        },
        practiceTask: 'Use the interactive Hash & Encryption Playground to compare Base64, MD5, SHA-256, and AES ciphertext.',
        completed: false
      },
      {
        id: 'l22-2',
        levelId: 22,
        title: 'Symmetric vs Asymmetric Cryptography & PKI',
        duration: '20 min',
        xpReward: 140,
        summary: 'Explore AES block ciphers, RSA/ECC public-private key pairs, digital signatures, and TLS handshake negotiation.',
        theoryContent: `Cryptographic Systems:\n\n• Symmetric (Shared Secret): Both sender and receiver share a single key (e.g. AES-GCM, ChaCha20). Fast, high throughput, ideal for bulk data transfer.\n• Asymmetric (Public/Private): Sender encrypts with receiver's Public Key; receiver decrypts with private key. Digital signatures work in reverse: sign with Private Key, verify with Public Key.\n• TLS (Transport Layer Security): Combines asymmetric key exchange (ECDHE) with symmetric session encryption (AES-256-GCM) to establish secure HTTPS channels.`,
        quiz: {
          question: 'In asymmetric digital signatures, which key is used to sign the hash of a message?',
          options: ['The recipient\'s Public Key', 'The sender\'s Private Key', 'The root CA symmetric secret', 'The browser session token'],
          correctIndex: 1,
          explanation: 'The sender signs using their private key so anyone with their public key can mathematically verify authenticity.'
        },
        practiceTask: 'Inspect the fictional X.509 certificate chain for "vault.nightfall-defense.internal" in the Certificate Viewer.',
        completed: false
      }
    ]
  },
  23: {
    level: 23,
    title: 'API Security & Modern Web Applications',
    code: 'LVL-23',
    description: 'REST & JSON architecture, HTTP methods, JWT & Bearer tokens, Broken Object Level Authorization (BOLA/IDOR), rate limiting, and API security testing.',
    category: 'Web',
    status: 'locked',
    lessonsCount: 8,
    completedLessons: 0,
    xpReward: 1000,
    lessons: [
      {
        id: 'l23-1',
        levelId: 23,
        title: 'REST Architecture, JSON & API Authentication Tokens',
        duration: '18 min',
        xpReward: 130,
        summary: 'Learn how modern single-page apps communicate with backend microservices using JSON payloads and Authorization Bearer headers.',
        theoryContent: `REST APIs rely on stateless HTTP requests with structured JSON bodies:\n\n• GET /api/v1/users/me -> Retrieve current profile.\n• POST /api/v1/transfers -> Submit financial transaction.\n• PUT / PATCH -> Update state.\n• DELETE -> Remove resource.\n\nAuthentication Tokens (JWT):\nHeader.Payload.Signature (e.g. eyJhbGciOiJIUzI1Ni...)\nTokens are passed in headers: \`Authorization: Bearer <token>\`.\n\nSecurity concern: Unlike cookies with HttpOnly flags, tokens stored in localStorage are vulnerable to XSS extraction.`,
        interactiveExample: {
          title: 'API Request & JWT Header Inspector',
          type: 'code_snippet',
          description: 'Inspecting JSON Web Token structure',
          codeOrData: 'GET /api/v2/tenant/402/vault HTTP/1.1\nHost: api.training.corp\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        quiz: {
          question: 'Where should sensitive API Bearer tokens ideally be stored in browser clients to prevent JavaScript XSS theft?',
          options: ['In local storage with window.localStorage', 'In a secure HttpOnly SameSite cookie', 'In URL query parameters (?token=xyz)', 'In HTML comments'],
          correctIndex: 1,
          explanation: 'HttpOnly cookies cannot be read or stolen by malicious JavaScript executed through XSS flaws.'
        },
        practiceTask: 'Use curl or Burp Suite to audit the training endpoint at /api/v1/invoices.',
        completed: false
      },
      {
        id: 'l23-2',
        levelId: 23,
        title: 'Broken Object Level Authorization (BOLA / IDOR in APIs)',
        duration: '22 min',
        xpReward: 150,
        summary: 'Analyze OWASP API #1: Why APIs fail when backend code queries database records without verifying user tenancy.',
        theoryContent: `BOLA (Broken Object Level Authorization) occurs when an endpoint relies on client-supplied IDs without checking ownership:\n\n\`\`\`python\n# Vulnerable Endpoint\n@app.route('/api/documents/<doc_id>')\n@jwt_required\ndef get_document(doc_id):\n    # Fails to check if doc.owner_id == current_user.id\n    return db.query(Document).filter_by(id=doc_id).first().to_json()\n\`\`\`\n\nRemediation:\nAlways enforce tenancy filtering: \`filter_by(id=doc_id, owner_id=current_user.id)\`.`,
        quiz: {
          question: 'What is the root cause of Broken Object Level Authorization (BOLA)?',
          options: ['Missing HTTPS encryption on the network', 'The backend queries records by ID without validating if the authenticated user owns that record', 'The database port 3306 is open to localhost', 'The API returns JSON instead of XML'],
          correctIndex: 1,
          explanation: 'BOLA happens when access control is not enforced at the object/record retrieval layer for the current authenticated user identity.'
        },
        practiceTask: 'Investigate the API parameter tampering vulnerability in the API Security sandbox.',
        completed: false
      }
    ]
  },
  24: {
    level: 24,
    title: 'Secure Programming & Vulnerability Prevention',
    code: 'LVL-24',
    description: 'Master defensive secure coding: parameterized SQL queries, context-aware HTML output encoding, password hashing with bcrypt, and session handling.',
    category: 'Defensive',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1050,
    lessons: [
      {
        id: 'l24-1',
        levelId: 24,
        title: 'Secure Input Handling & SQL Parameterization',
        duration: '20 min',
        xpReward: 140,
        summary: 'Examine vulnerable string concatenation versus prepared statements in Python, PHP, and Node.js.',
        theoryContent: `Vulnerable Code Pattern (Python):\n\`\`\`python\n# INSECURE: Direct String Concatenation\nquery = f"SELECT * FROM users WHERE username = '{user_input}' AND pass = '{pass_input}'"\ncursor.execute(query)\n\`\`\`\n\nSecure Implementation:\n\`\`\`python\n# SECURE: Parameterized Prepared Statement\nquery = "SELECT * FROM users WHERE username = %s AND pass = %s"\ncursor.execute(query, (user_input, pass_input))\n\`\`\`\n\nWhy it works: Prepared statements compile the SQL query structure first. User input is treated strictly as data literals, rendering SQL injection syntax inert.`,
        quiz: {
          question: 'Why do parameterized queries completely prevent SQL injection?',
          options: ['They encrypt the entire database table', 'The database engine compiles query structure before injecting parameters strictly as data literals', 'They convert all letters to uppercase', 'They block all HTTP POST requests'],
          correctIndex: 1,
          explanation: 'Parameterized queries separate code execution from untrusted data parameters at the database query compiler level.'
        },
        practiceTask: 'Review vulnerable code samples in the Secure Coding Arena and apply the correct patch.',
        completed: false
      }
    ]
  },
  25: {
    level: 25,
    title: 'Cloud Security Fundamentals',
    code: 'LVL-25',
    description: 'IaaS, PaaS, SaaS architecture, AWS/GCP/Azure IAM least privilege, S3 bucket misconfigurations, security groups, and cloud incident remediation.',
    category: 'Cloud',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1100,
    lessons: [
      {
        id: 'l25-1',
        levelId: 25,
        title: 'Shared Responsibility & Cloud Identity (IAM)',
        duration: '22 min',
        xpReward: 150,
        summary: 'Understand who is responsible for what in IaaS/PaaS/SaaS and how misconfigured IAM role policies cause cloud account takeovers.',
        theoryContent: `The Cloud Shared Responsibility Model:\n• IaaS (EC2, Compute Engine): Cloud provider manages physical data center, hardware, and hypervisor. Customer manages OS patches, network rules, IAM, and applications.\n• PaaS / Serverless: Provider manages OS and runtime. Customer manages code and IAM.\n• SaaS: Provider manages virtually all infrastructure. Customer manages user access and data governance.\n\nPrimary Cloud Threat: IAM Over-permissioning (e.g. \`"Action": "*", "Resource": "*"\`) allowing attackers who compromise one API key to pivot across the entire cloud tenant.`,
        quiz: {
          question: 'In an IaaS (Infrastructure as a Service) cloud model, who is responsible for patching the guest operating system?',
          options: ['The cloud provider exclusively', 'The customer organization', 'The internet service provider', 'Nobody, IaaS does not have operating systems'],
          correctIndex: 1,
          explanation: 'Under IaaS, the customer retains full responsibility for configuring, securing, and patching the guest OS.'
        },
        practiceTask: 'Audit the simulated S3 bucket policy in the Cloud Security sandbox to remove public wildcard read access.',
        completed: false
      }
    ]
  },
  26: {
    level: 26,
    title: 'Container & Docker Security',
    code: 'LVL-26',
    description: 'Docker image layers, rootless containers, exposed daemon sockets (/var/run/docker.sock), Linux capabilities (CAP_SYS_ADMIN), and container hardening.',
    category: 'Infrastructure',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1100,
    lessons: [
      {
        id: 'l26-1',
        levelId: 26,
        title: 'Container Isolation, Namespaces, Cgroups & Rootless Execution',
        duration: '20 min',
        xpReward: 140,
        summary: 'Understand how Linux namespaces (PID, NET, MNT) isolate containers and why running containers as root inside creates container breakout risks.',
        theoryContent: `Containers are not full virtual machines; they share the host Linux kernel.\n\nIsolation Mechanisms:\n• Namespaces: Provide isolated views of PIDs, Network interfaces, and Mount points.\n• Cgroups (Control Groups): Enforce CPU, RAM, and I/O limits.\n• Danger of Docker Socket: Mounting \`-v /var/run/docker.sock:/var/run/docker.sock\` inside a container allows any process to command the host Docker daemon to create root containers with host root filesystem mounts (\`--privileged -v /:/host\`).`,
        quiz: {
          question: 'What is the security risk of mounting /var/run/docker.sock inside an untrusted web container?',
          options: ['The container runs out of disk space', 'Any compromise of the web container allows instant root execution on the host system via the Docker API', 'The web server will reject SSL connections', 'Port 80 will become unreachable'],
          correctIndex: 1,
          explanation: 'Access to the Docker socket allows creating privileged containers on the host, leading directly to full host compromise.'
        },
        practiceTask: 'Inspect Dockerfile configurations in the Container Security Lab to detect root user execution.',
        completed: false
      }
    ]
  },
  27: {
    level: 27,
    title: 'Wireless & Network Access Security',
    code: 'LVL-27',
    description: '802.11 standards, WPA2 4-way handshake, WPA3 SAE (Simultaneous Authentication of Equals), Rogue Access Points, Evil Twins, and 802.1X Enterprise.',
    category: 'Networking',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1000,
    lessons: [
      {
        id: 'l27-1',
        levelId: 27,
        title: 'WPA2 4-Way Handshake vs WPA3 SAE & Rogue AP Defenses',
        duration: '20 min',
        xpReward: 130,
        summary: 'Learn how wireless frames protect pre-shared keys and how defenders detect unauthorized rogue access points using WIPS/WIDS.',
        theoryContent: `Wireless Protocols:\n\n• WPA2-PSK: Uses a 4-way EAPOL handshake to derive pairwise transient keys (PTK). Vulnerable to offline dictionary attacks if the 4-way handshake is captured.\n• WPA3: Implements Dragonfly handshake / SAE (Simultaneous Authentication of Equals) with forward secrecy, preventing passive offline cracking.\n• Rogue AP / Evil Twin: Attackers broadcast an identical SSID (e.g. "Corporate-Guest") to trick clients into associating and routing through an attacker MITM gateway.\n• Defense: Enterprise 802.1X authentication with RADIUS and client certificates.`,
        quiz: {
          question: 'Why is WPA3 significantly more resilient against offline dictionary cracking than WPA2-PSK?',
          options: ['WPA3 uses unencrypted broadcast beacons', 'WPA3 uses Simultaneous Authentication of Equals (SAE) with forward secrecy', 'WPA3 disables passwords entirely', 'WPA3 operates exclusively on 2.4GHz'],
          correctIndex: 1,
          explanation: 'WPA3 SAE requires active participation in every guess, preventing offline dictionary attacks against captured handshakes.'
        },
        practiceTask: 'Inspect simulated 802.11 frame captures in the wireless security analyzer.',
        completed: false
      }
    ]
  },
  28: {
    level: 28,
    title: 'Malware Analysis & Reverse Engineering Fundamentals',
    code: 'LVL-28',
    description: 'Static analysis (strings, PE headers, imports), dynamic sandbox analysis, indicators of compromise (IoCs), process hollowing, and persistence mechanisms.',
    category: 'Forensics',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1200,
    lessons: [
      {
        id: 'l28-1',
        levelId: 28,
        title: 'Static & Dynamic Malware Triage Workflow',
        duration: '25 min',
        xpReward: 160,
        summary: 'Safely dissect synthetic malware artifacts in isolated sandboxes using PEStudio, FLOSS, Ghidra, and Sysmon process telemetry.',
        theoryContent: `Analysis Phases in Isolated Environments:\n\n1. Static Triage (Without Executing):\n• Compute cryptographic hashes (SHA-256, SSDEEP).\n• Check PE Imports (e.g. \`VirtualAllocEx\`, \`WriteProcessMemory\`, \`CreateRemoteThread\` indicate process injection).\n• Extract strings and compile timestamps.\n\n2. Dynamic Triage (Isolated Sandbox):\n• Monitor process execution trees.\n• Capture network beaconing (C2 IP addresses, User-Agent strings, DNS queries).\n• Record registry persistence keys (e.g. \`HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\`).`,
        quiz: {
          question: 'Which Windows API function import is commonly associated with process memory injection techniques?',
          options: ['WriteProcessMemory', 'MessageBoxA', 'GetSystemTime', 'CloseHandle'],
          correctIndex: 0,
          explanation: 'WriteProcessMemory is used to write malicious shellcode or payloads into the memory space of target processes.'
        },
        practiceTask: 'Analyze the synthetic sample "sample_dropped.exe" in the isolated malware sandbox viewer.',
        completed: false
      }
    ]
  },
  29: {
    level: 29,
    title: 'Threat Intelligence & Adversary Simulation',
    code: 'LVL-29',
    description: 'Strategic & tactical CTI, Indicators of Compromise (IoCs), MITRE ATT&CK enterprise matrix, Sigma rules, threat hunting hypotheses, and attack chain mapping.',
    category: 'Defensive',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1250,
    lessons: [
      {
        id: 'l29-1',
        levelId: 29,
        title: 'MITRE ATT&CK Matrix & Cyber Kill Chain Mapping',
        duration: '22 min',
        xpReward: 160,
        summary: 'Map real forensic evidence to ATT&CK tactics: Recon, Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, and Exfiltration.',
        theoryContent: `MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) standardizes adversary behavior:\n\n• Tactic (The "Why"): What the attacker is trying to achieve (e.g. TA0003 Persistence).\n• Technique (The "How"): Specific method used (e.g. T1053 Scheduled Task/Cron).\n• Procedure: The exact command or software implementation.\n\nDetection Engineering: Modern SOC teams write Sigma and Yara-L rules mapped directly to ATT&CK IDs to verify detection coverage across all kill-chain phases.`,
        quiz: {
          question: 'In MITRE ATT&CK, what does a "Technique" represent?',
          options: ['The attacker\'s high-level business motivation', 'The specific technical action or mechanism used to accomplish a tactic', 'The legal jurisdiction of the target organization', 'The cost of the victim\'s firewall'],
          correctIndex: 1,
          explanation: 'Techniques describe the specific technical behaviors and mechanisms adversaries use to achieve tactical objectives.'
        },
        practiceTask: 'Map the telemetry logs from the fictional NIGHTFALL incident to MITRE ATT&CK techniques.',
        completed: false
      }
    ]
  },
  30: {
    level: 30,
    title: 'Professional Ethical Hacking Methodology',
    code: 'LVL-30',
    description: 'Scope definition, Rules of Engagement (RoE), PTES methodology, vulnerability scoring (CVSS v3.1), proof-of-concept hygiene, executive reporting, and remediation retesting.',
    category: 'Professional',
    status: 'locked',
    lessonsCount: 14,
    completedLessons: 0,
    xpReward: 1400,
    lessons: [
      {
        id: 'l30-1',
        levelId: 30,
        title: 'Rules of Engagement, Scope Boundaries & Professional Reporting',
        duration: '30 min',
        xpReward: 200,
        summary: 'Step into the shoes of a lead consultant auditing "NIGHTFALL TECHNOLOGIES": deliver findings with CVSS metrics and executive business impact.',
        theoryContent: `Professional Penetration Testing Execution Standard (PTES):\n\n1. Pre-engagement: Define scope (CIDR blocks, excluded assets), emergency contacts, testing windows.\n2. Intelligence Gathering & Threat Modeling.\n3. Vulnerability Analysis & Validation.\n4. Exploitation: Strictly within authorized bounds without service disruption.\n5. Post-Exploitation & Risk Evaluation.\n6. Reporting: Technical documentation + C-Suite executive risk summary.\n7. Remediation Retesting: Verify engineering fixes before signing off.`,
        quiz: {
          question: 'What must an ethical penetration tester do immediately if they accidentally identify a critical production issue outside the authorized scope?',
          options: ['Exploit it immediately to see how far it goes', 'Notify the client point-of-contact immediately without testing the out-of-scope system', 'Post the vulnerability on social media', 'Ignore it and delete all logs'],
          correctIndex: 1,
          explanation: 'Strict adherence to scope is mandatory; out-of-scope assets must not be tested and must be escalated to the client.'
        },
        practiceTask: 'Generate a professional penetration testing report for Nightfall Technologies.',
        completed: false
      }
    ]
  },
  31: {
    level: 31,
    title: 'MY CYBER LAB MASTER RANGE',
    code: 'LVL-31',
    description: 'The ultimate 12-phase capstone cyber range. Multi-subnet enterprise simulation: Perimeter Firewall, Web App, DNS, Database, Linux Host, Windows Host, and Active Directory domain.',
    category: 'Capstone',
    status: 'locked',
    lessonsCount: 12,
    completedLessons: 0,
    xpReward: 2500,
    lessons: [
      {
        id: 'l31-1',
        levelId: 31,
        title: 'Master Range Briefing & Environment Architecture',
        duration: '60 min',
        xpReward: 500,
        summary: 'Engage the 12-phase multi-tier enterprise range: Recon, Web Audit, Triage, Linux Escalation, Windows AD Analysis, Remediation, and Executive Retest.',
        theoryContent: `Welcome to the Master Cyber Range.\n\nTarget Network: 10.10.10.0/24 & 10.10.20.0/24 (Fictional Isolated Lab)\n\nPhases of Master Range:\n1. Environment Orientation & RoE\n2. Network Mapping & Port Discovery\n3. Service Enumeration\n4. Web Application Vulnerability Audit\n5. Suspicious Log Analysis & Triage\n6. Linux Host Security Audit\n7. Windows & Active Directory Investigation\n8. Forensic Evidence Synthesis\n9. Root Cause Vulnerability Mapping\n10. Defensive Remediation & Hardening\n11. Authorized Retesting Validation\n12. Professional Executive & Technical Report Delivery`,
        quiz: {
          question: 'In the Master Cyber Range, what validates that a defensive fix is effective?',
          options: ['Closing the terminal without checking', 'Phase 11: Authorized Retesting where the identical exploit payload fails safely', 'Disabling the entire network permanently', 'Renaming the server hostname'],
          correctIndex: 1,
          explanation: 'Retesting verifies that the specific root cause is patched while legitimate service functionality remains intact.'
        },
        practiceTask: 'Enter the Master Cyber Range and commence Phase 1 reconnaissance.',
        completed: false
      }
    ]
  }
};
