import { CareerRoleId, UserProfile } from '../types';

export interface RoleLearningMilestone {
  id: string;
  stage: 'Foundation' | 'Core Skills' | 'Advanced Specialization' | 'Capstone & Certification';
  title: string;
  description: string;
  targetSkill: string;
  route: string;
  estimatedHours: number;
}

export interface RoleDailyTask {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  xpReward: number;
  route: string;
  category: string;
}

export interface RoleRecommendationAction {
  title: string;
  actionType: 'LAB' | 'MISSION' | 'MODULE' | 'QUIZ' | 'CHALLENGE';
  targetName: string;
  route: string;
  reason: string;
  timeEstimate: string;
  xpReward: number;
}

export interface RolePersonalizationConfig {
  id: CareerRoleId | string;
  title: string;
  emoji: string;
  badge: string;
  category: 'Defensive' | 'Offensive' | 'Enterprise & Cloud' | 'Engineering' | 'Beginner';
  salaryRange: string;
  demandLevel: 'Critical' | 'Very High' | 'High';
  shortDescription: string;
  fullDescription: string;
  recommendedModules: {
    id: string;
    title: string;
    category: string;
    route: string;
    xp: number;
    description: string;
  }[];
  missions: {
    id: string;
    title: string;
    difficulty: 'Beginner' | 'Easy' | 'Intermediate' | 'Hard' | 'Advanced';
    timeEstimate: string;
    description: string;
  }[];
  labs: {
    id: string;
    name: string;
    route: string;
    description: string;
    icon: string;
  }[];
  tools: string[];
  learningPath: RoleLearningMilestone[];
  suggestedDailyTasks: RoleDailyTask[];
  amanSystemInstructions: string;
  getNextAction: (profile?: Partial<UserProfile> | any, completedIds?: string[]) => RoleRecommendationAction;
}

export const ROLE_PERSONALIZATION_REGISTRY: Record<string, RolePersonalizationConfig> = {
  'soc-analyst': {
    id: 'soc-analyst',
    title: 'SOC Analyst',
    emoji: '🛡️',
    badge: 'DEFENSIVE SOC',
    category: 'Defensive',
    salaryRange: '$82,000 - $115,000',
    demandLevel: 'Critical',
    shortDescription: 'Monitor SIEM alerts, analyze security telemetry, investigate malicious events, and contain active intrusions.',
    fullDescription: 'As a Security Operations Center (SOC) Analyst, you act as the primary frontline defender against persistent cyber threats. You will master log parsing (Syslog, Windows Event Logs, Sysmon), SIEM alert triage, network packet inspection with Wireshark, MITRE ATT&CK mapping, and rapid incident containment protocols.',
    recommendedModules: [
      { id: 'linux-fundamentals', title: 'Linux CLI & Syslog Foundations', category: 'Linux Defense', route: '/linux-lab', xp: 400, description: 'Master grep, journalctl, /var/log analysis, and process triage.' },
      { id: 'network-diagnostics', title: 'Networking & TCP/IP Diagnostics', category: 'Networking', route: '/network-lab', xp: 450, description: 'TCP handshakes, Wireshark packet captures, and anomalous flow detection.' },
      { id: 'soc-siem-triage', title: 'SOC Telemetry & SIEM Alert Triage', category: 'SOC Operations', route: '/practice/soc-simulator', xp: 700, description: 'Simulated SIEM log streams, calculating true vs false positive ratios.' },
      { id: 'threat-hunting-mitre', title: 'Threat Hunting & MITRE ATT&CK', category: 'Threat Intel', route: '/practice/threat-hunting', xp: 800, description: 'Proactive detection engineering with Sigma rules and behavioral indicators.' }
    ],
    missions: [
      { id: 'soc-mission-01', title: 'Suspicious Domain Controller Triage', difficulty: 'Intermediate', timeEstimate: '25 min', description: 'Investigate anomalous Kerberos ticket requests and lateral movement logs.' },
      { id: 'soc-mission-02', title: 'Phishing Campaign Ingestion Analysis', difficulty: 'Easy', timeEstimate: '15 min', description: 'Extract malicious sender IP, spoofed SPF/DKIM headers, and weaponized attachments.' },
      { id: 'soc-mission-03', title: 'Ransomware Outbreak Containment', difficulty: 'Hard', timeEstimate: '35 min', description: 'Isolate compromised subnet hosts and terminate rogue encryption scripts.' }
    ],
    labs: [
      { id: 'soc-simulator', name: 'SOC Incident Simulator', route: '/practice/soc-simulator', description: 'Real-time alert queues, SIEM queries, and containment execution.', icon: 'Shield' },
      { id: 'network-lab', name: 'Network Diagnostics Lab', route: '/network-lab', description: 'Packet sniffing, protocol dissection, and traffic anomalies.', icon: 'Network' },
      { id: 'threat-hunting', name: 'Threat Hunting Range', route: '/practice/threat-hunting', description: 'Query telemetry, construct Sigma detections, and hunt APT footprints.', icon: 'Crosshair' }
    ],
    tools: ['Wireshark', 'Splunk / SIEM Concepts', 'Sysmon', 'tcpdump', 'CyberChef', 'Sigma Rules', 'Zeek / Suricata'],
    learningPath: [
      { id: 'soc-step-1', stage: 'Foundation', title: 'Operating Systems & CLI Log Triage', description: 'Inspect Windows Event Viewer and Linux /var/log/auth.log.', targetSkill: 'Log Parsing', route: '/linux-lab', estimatedHours: 8 },
      { id: 'soc-step-2', stage: 'Core Skills', title: 'Network Packet Dissection', description: 'Inspect TCP/UDP sessions, DNS queries, and ARP spoofing in Wireshark.', targetSkill: 'Packet Analysis', route: '/network-lab', estimatedHours: 12 },
      { id: 'soc-step-3', stage: 'Advanced Specialization', title: 'SIEM Alert Rule Engineering', description: 'Build high-fidelity alert correlations and reduce false positive noise.', targetSkill: 'Detection Engineering', route: '/practice/soc-simulator', estimatedHours: 16 },
      { id: 'soc-step-4', stage: 'Capstone & Certification', title: 'SOC Tier 2 Incident Containment Capstone', description: 'Full live-fire breach triage, evidence preservation, and eradication.', targetSkill: 'Incident Response', route: '/live-incidents', estimatedHours: 20 }
    ],
    suggestedDailyTasks: [
      { id: 'soc-task-1', title: 'Triage 3 Simulated SIEM Alerts', description: 'Classify events as True Positive or Benign in the SOC Simulator.', estimatedMinutes: 15, xpReward: 150, route: '/practice/soc-simulator', category: 'Defensive' },
      { id: 'soc-task-2', title: 'Analyze Suspicious PCAP Flow', description: 'Filter malicious HTTP beacons in the Network Diagnostics Lab.', estimatedMinutes: 20, xpReward: 200, route: '/network-lab', category: 'Networking' },
      { id: 'soc-task-3', title: 'Draft Incident Ticket in Evidence Locker', description: 'Log IOC hashes and MITRE ATT&CK technique IDs.', estimatedMinutes: 10, xpReward: 100, route: '/ace', category: 'Documentation' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing as a SOC Analyst.
FOCUS: Emphasize defensive telemetry, MITRE ATT&CK detection matrices, log analysis (Syslog, Windows Event IDs, Sysmon), SIEM correlation, false positive reduction, and containment strategies.
TONE: Analytical, vigilant, and structured like a Lead SOC Incident Commander.`,
    getNextAction: (profile, completedIds = []) => {
      if (!completedIds.includes('linux-fundamentals')) {
        return {
          title: 'Linux Triage & Syslog Inspection',
          actionType: 'LAB',
          targetName: 'Linux Mastery Lab',
          route: '/linux-lab',
          reason: 'Mastering Linux log parsing (/var/log) is foundational for all SOC telemetry investigations.',
          timeEstimate: '20 min',
          xpReward: 400
        };
      }
      return {
        title: 'SOC Live Alert Triage Simulator',
        actionType: 'LAB',
        targetName: 'SOC Incident Simulator',
        route: '/practice/soc-simulator',
        reason: 'Practice real-time SIEM alert triage, MITRE mapping, and host isolation.',
        timeEstimate: '25 min',
        xpReward: 700
      };
    }
  },

  'pentester': {
    id: 'pentester',
    title: 'Penetration Tester',
    emoji: '⚔️',
    badge: 'OFFENSIVE SECURITY',
    category: 'Offensive',
    salaryRange: '$95,000 - $145,000',
    demandLevel: 'Very High',
    shortDescription: 'Identify infrastructure vulnerabilities, simulate sophisticated cyber attacks, and author remediation reports.',
    fullDescription: 'Penetration Testers systematically evaluate organizational attack surfaces by discovering unpatched vulnerabilities, misconfigurations, and weak access controls before adversaries exploit them. You will master network reconnaissance, privilege escalation, Active Directory attack paths, and post-exploitation persistence.',
    recommendedModules: [
      { id: 'network-recon-nmap', title: 'Port Scanning & Fingerprinting', category: 'Reconnaissance', route: '/network-lab', xp: 500, description: 'Advanced Nmap scanning flags, service enumeration, and script engine (NSE).' },
      { id: 'linux-privesc', title: 'Linux Privilege Escalation', category: 'Exploitation', route: '/linux-lab', xp: 650, description: 'SUID binaries, sudo misconfigurations, cronjob hijacking, and kernel exploits.' },
      { id: 'web-vuln-assessment', title: 'Web Exploit Vectors & Injection', category: 'Web Exploitation', route: '/practice/web-security', xp: 750, description: 'SQL injection, command injection, SSRF, and authentication bypasses.' },
      { id: 'command-center-ops', title: 'Ethical Hacker Command Center Ops', category: 'Live Fire', route: '/command-center', xp: 900, description: 'Multi-system target engagements with live scope validation.' }
    ],
    missions: [
      { id: 'pentest-mission-01', title: 'Perimeter Breach & Initial Access', difficulty: 'Intermediate', timeEstimate: '25 min', description: 'Enumerate open services and exploit exposed FTP/SSH weak configurations.' },
      { id: 'pentest-mission-02', title: 'SUID Root Privilege Escalation', difficulty: 'Intermediate', timeEstimate: '20 min', description: 'Identify vulnerable root-owned binary and spawn an elevated root shell.' },
      { id: 'pentest-mission-03', title: 'Internal Subnet Pivoting', difficulty: 'Advanced', timeEstimate: '40 min', description: 'Pivot through dual-homed bastion host to compromise internal database node.' }
    ],
    labs: [
      { id: 'network-lab', name: 'Network Recon Lab', route: '/network-lab', description: 'Host discovery, service fingerprinting, and NSE vulnerability scripts.', icon: 'Radio' },
      { id: 'linux-lab', name: 'Linux Exploitation Sandbox', route: '/linux-lab', description: 'Permission bypasses, PATH hijacking, and credential harvesting.', icon: 'Terminal' },
      { id: 'command-center', name: 'Ethical Hacker Command Center', route: '/command-center', description: 'Authorized offensive operations, target networks, and evidence capturing.', icon: 'Crosshair' }
    ],
    tools: ['Nmap', 'Metasploit Concepts', 'Burp Suite', 'Hydra', 'Gobuster', 'LinPEAS / WinPEAS Concepts', 'Netcat'],
    learningPath: [
      { id: 'pt-step-1', stage: 'Foundation', title: 'Deep Port Scanning & Reconnaissance', description: 'Execute stealth SYN scans, UDP enumeration, and version detection.', targetSkill: 'Reconnaissance', route: '/network-lab', estimatedHours: 10 },
      { id: 'pt-step-2', stage: 'Core Skills', title: 'Linux & Windows Privilege Escalation', description: 'Identify privilege escalations via SUID, sudoers, and unquoted service paths.', targetSkill: 'Privilege Escalation', route: '/linux-lab', estimatedHours: 16 },
      { id: 'pt-step-3', stage: 'Advanced Specialization', title: 'Web App & API Exploitation', description: 'Discover zero-trust bypasses, IDORs, and remote code execution vulnerabilities.', targetSkill: 'Vulnerability Assessment', route: '/practice/web-security', estimatedHours: 20 },
      { id: 'pt-step-4', stage: 'Capstone & Certification', title: 'Full-Scope Penetration Test Capstone', description: 'Conduct authorized pentest, log cryptographic proof, and write remediation report.', targetSkill: 'Client Engagement & Reporting', route: '/ace', estimatedHours: 25 }
    ],
    suggestedDailyTasks: [
      { id: 'pt-task-1', title: 'Run Stealth Nmap Scan on Target', description: 'Enumerate open ports and banner versions on 10.200.1.0/24.', estimatedMinutes: 15, xpReward: 180, route: '/network-lab', category: 'Offensive' },
      { id: 'pt-task-2', title: 'Solve 1 Privilege Escalation Challenge', description: 'Inspect SUID binary permissions in Linux Sandbox.', estimatedMinutes: 20, xpReward: 220, route: '/linux-lab', category: 'Exploitation' },
      { id: 'pt-task-3', title: 'Log Proof of Concept in ACE Locker', description: 'Record CVSS score, reproduction steps, and mitigation fix.', estimatedMinutes: 10, xpReward: 120, route: '/ace', category: 'Reporting' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing as a Penetration Tester.
FOCUS: Emphasize offensive methodology, thorough reconnaissance, precision exploit execution, privilege escalation vectors, lateral movement, and responsible proof-of-concept disclosure with clear remediation guidance.
TONE: Methodical, tactical, and sharp like a Senior Principal Penetration Tester.`,
    getNextAction: (profile, completedIds = []) => {
      if (!completedIds.includes('network-recon-nmap')) {
        return {
          title: 'Network Port Scanning & Reconnaissance',
          actionType: 'LAB',
          targetName: 'Network Recon Lab',
          route: '/network-lab',
          reason: 'Comprehensive reconnaissance is the cornerstone of every successful penetration test.',
          timeEstimate: '20 min',
          xpReward: 500
        };
      }
      return {
        title: 'Linux Privilege Escalation Sandbox',
        actionType: 'LAB',
        targetName: 'Linux Exploitation Sandbox',
        route: '/linux-lab',
        reason: 'Practice escalating from standard unprivileged user to root via SUID and misconfigured sudo.',
        timeEstimate: '25 min',
        xpReward: 650
      };
    }
  },

  'web-security': {
    id: 'web-security',
    title: 'Web Security Specialist',
    emoji: '🌐',
    badge: 'APPSEC & OWASP',
    category: 'Offensive',
    salaryRange: '$90,000 - $135,000',
    demandLevel: 'Critical',
    shortDescription: 'Master the OWASP Top 10, find web injection vulnerabilities, audit API endpoints, and secure modern web architectures.',
    fullDescription: 'Web Security Specialists focus on auditing and securing web applications, APIs, and microservices. You will delve deep into Cross-Site Scripting (XSS), SQL Injection (SQLi), Server-Side Request Forgery (SSRF), Cross-Site Request Forgery (CSRF), Insecure Direct Object References (IDOR), JWT validation flaws, and Content Security Policies.',
    recommendedModules: [
      { id: 'owasp-sqli', title: 'SQL Injection: Union, Error & Blind Exploitation', category: 'OWASP Top 10', route: '/practice/web-security', xp: 600, description: 'Extract database schemas, bypass logins, and construct parameterized queries.' },
      { id: 'owasp-xss', title: 'Cross-Site Scripting (Stored, Reflected, DOM)', category: 'OWASP Top 10', route: '/practice/web-security', xp: 550, description: 'Cookie theft payloads, DOM injection sinks, and CSP defense bypasses.' },
      { id: 'api-security-jwt', title: 'REST API & JWT Token Flaws', category: 'API Security', route: '/practice/web-security', xp: 700, description: 'Algorithm confusion, expired tokens, IDOR parameter tampering, and rate limiting.' },
      { id: 'ssrf-deserialization', title: 'SSRF & Business Logic Flaws', category: 'Advanced AppSec', route: '/practice/web-security', xp: 850, description: 'Target internal metadata endpoints (169.254.169.254) and secure cloud requests.' }
    ],
    missions: [
      { id: 'web-mission-01', title: 'Authentication Bypass via SQL Injection', difficulty: 'Easy', timeEstimate: '15 min', description: 'Bypass administrative login portal using auth payload sanitization flaws.' },
      { id: 'web-mission-02', title: 'Stored XSS Admin Session Hijack', difficulty: 'Intermediate', timeEstimate: '20 min', description: 'Inject persistent script into comment board to exfiltrate session cookies.' },
      { id: 'web-mission-03', title: 'Cloud Metadata SSRF Extraction', difficulty: 'Hard', timeEstimate: '30 min', description: 'Leverage image URL fetching endpoint to access internal cloud instance credentials.' }
    ],
    labs: [
      { id: 'web-security-lab', name: 'Web Application Security Lab', route: '/practice/web-security', description: 'Interactive OWASP injection testbed with live request/response inspection.', icon: 'Globe' },
      { id: 'security-tools', name: 'Security Tools Suite', route: '/practice/security-tools', description: 'HTTP proxy, base64/hex encoder, hash identifier, and header analyzer.', icon: 'Wrench' },
      { id: 'ctf-arena', name: 'Web CTF Challenges', route: '/ctf-arena', description: 'Capture flags by solving real-world web exploitation puzzles.', icon: 'Flag' }
    ],
    tools: ['Burp Suite', 'OWASP ZAP', 'SQLmap', 'CyberChef', 'Browser DevTools', 'Postman', 'ffuf / Gobuster'],
    learningPath: [
      { id: 'web-step-1', stage: 'Foundation', title: 'HTTP/HTTPS Architecture & Cookie Security', description: 'Inspect headers (SameSite, Secure, HttpOnly) and HTTP status codes.', targetSkill: 'HTTP Protocols', route: '/practice/web-security', estimatedHours: 8 },
      { id: 'web-step-2', stage: 'Core Skills', title: 'OWASP Top 10 Injections (SQLi & XSS)', description: 'Master SQL syntax manipulation and JavaScript DOM manipulation sinks.', targetSkill: 'OWASP Injection', route: '/practice/web-security', estimatedHours: 15 },
      { id: 'web-step-3', stage: 'Advanced Specialization', title: 'Modern API Security & JWT Authentication', description: 'Analyze REST APIs, GraphQL endpoints, and broken object-level authorization (BOLA).', targetSkill: 'API Security', route: '/practice/web-security', estimatedHours: 18 },
      { id: 'web-step-4', stage: 'Capstone & Certification', title: 'Enterprise Web Application Security Audit Capstone', description: 'Full blackbox audit, discovering 5 OWASP vulnerabilities and preparing remediation guide.', targetSkill: 'Application Security Audit', route: '/ace', estimatedHours: 22 }
    ],
    suggestedDailyTasks: [
      { id: 'web-task-1', title: 'Solve 1 SQL Injection Challenge', description: 'Extract hidden table names using UNION SELECT in Web Lab.', estimatedMinutes: 15, xpReward: 160, route: '/practice/web-security', category: 'AppSec' },
      { id: 'web-task-2', title: 'Craft XSS Payload with CSP Bypass', description: 'Test DOM sink sanitization in the Web Security Sandbox.', estimatedMinutes: 20, xpReward: 190, route: '/practice/web-security', category: 'AppSec' },
      { id: 'web-task-3', title: 'Inspect JWT Claims in CyberChef', description: 'Decode and evaluate signature algorithms of bearer tokens.', estimatedMinutes: 10, xpReward: 110, route: '/practice/security-tools', category: 'Encoding' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing as a Web Security Specialist (Application Security Engineer).
FOCUS: Emphasize OWASP Top 10 vulnerabilities, HTTP request/response mechanics, browser security models (CORS, CSP, SOP), API authorization flaws (BOLA/IDOR), and secure code remediation.
TONE: Deeply technical, browser-savvy, and code-conscious like a Senior AppSec Architect.`,
    getNextAction: (profile, completedIds = []) => {
      return {
        title: 'OWASP SQL Injection Master Lab',
        actionType: 'LAB',
        targetName: 'Web Security Lab',
        route: '/practice/web-security',
        reason: 'Master how SQL injection bypasses authentication and how parameterized queries prevent it.',
        timeEstimate: '20 min',
        xpReward: 600
      };
    }
  },

  'threat-hunter': {
    id: 'threat-hunter',
    title: 'Threat Hunter',
    emoji: '🎯',
    badge: 'THREAT INTEL & HUNTING',
    category: 'Defensive',
    salaryRange: '$110,000 - $160,000',
    demandLevel: 'High',
    shortDescription: 'Proactively search enterprise environments to detect evasive advanced persistent threats (APTs).',
    fullDescription: 'Threat Hunters assume breach and proactively hunt for stealthy adversaries that evade traditional security sensors. You will master MITRE ATT&CK framework mapping, Sigma detection rule creation, endpoint telemetry baselining, persistence hunting, and threat intelligence ingestion.',
    recommendedModules: [
      { id: 'mitre-attack-mapping', title: 'MITRE ATT&CK Framework & APT Playbooks', category: 'Threat Intel', route: '/practice/threat-hunting', xp: 650, description: 'Map adversary behaviors across Initial Access to Exfiltration.' },
      { id: 'sigma-rule-engineering', title: 'Sigma Detection Rule Development', category: 'Detection Engineering', route: '/practice/threat-hunting', xp: 750, description: 'Write vendor-agnostic behavioral detection rules for suspicious processes.' },
      { id: 'persistence-hunting', title: 'Hunting Windows & Linux Persistence', category: 'Endpoint Hunting', route: '/practice/threat-hunting', xp: 850, description: 'Uncover scheduled tasks, WMI event subscriptions, and modified rc.local scripts.' },
      { id: 'memory-network-indicators', title: 'Memory & Network Beaconing Analysis', category: 'C2 Detection', route: '/network-lab', xp: 900, description: 'Detect jittered C2 heartbeats, domain fronting, and suspicious parent-child processes.' }
    ],
    missions: [
      { id: 'th-mission-01', title: 'Hunt Evasive C2 Beaconing in Traffic', difficulty: 'Intermediate', timeEstimate: '25 min', description: 'Detect periodic outbound TLS handshakes using statistical timing analysis.' },
      { id: 'th-mission-02', title: 'Identify SUID Persistence Mechanism', difficulty: 'Intermediate', timeEstimate: '20 min', description: 'Hunt for modified system binaries with unusual timestamps and hashes.' },
      { id: 'th-mission-03', title: 'Nation-State APT Lateral Movement Hunt', difficulty: 'Advanced', timeEstimate: '40 min', description: 'Track Pass-the-Hash and SMB pipe lateral movement across active directory hosts.' }
    ],
    labs: [
      { id: 'threat-hunting-range', name: 'Threat Hunting Range', route: '/practice/threat-hunting', description: 'Query telemetry, construct Sigma detections, and hunt APT footprints.', icon: 'Crosshair' },
      { id: 'soc-simulator', name: 'SOC & Telemetry Simulator', route: '/practice/soc-simulator', description: 'Correlate events across multiple distributed log sources.', icon: 'Shield' },
      { id: 'investigation-board', name: 'Threat Investigation Board', route: '/investigation-board', description: 'Link adversary tactics, IOCs, and target assets on visual canvas.', icon: 'Layers' }
    ],
    tools: ['Sigma Rules', 'YARA', 'Sysmon', 'Velociraptor Concepts', 'MITRE ATT&CK Navigator', 'KQL / Splunk Querying', 'CyberChef'],
    learningPath: [
      { id: 'th-step-1', stage: 'Foundation', title: 'Adversary Tactics & MITRE Matrix', description: 'Learn the 14 MITRE tactics and common APT28/APT29 techniques.', targetSkill: 'MITRE ATT&CK', route: '/practice/threat-hunting', estimatedHours: 10 },
      { id: 'th-step-2', stage: 'Core Skills', title: 'Behavioral Endpoint Hunting', description: 'Baseline normal OS operations to isolate anomalous parent-child process chains.', targetSkill: 'Endpoint Telemetry', route: '/practice/threat-hunting', estimatedHours: 15 },
      { id: 'th-step-3', stage: 'Advanced Specialization', title: 'Sigma & Detection-as-Code Engineering', description: 'Craft detection rules that catch obfuscated PowerShell and encoded bash payloads.', targetSkill: 'Detection-as-Code', route: '/practice/threat-hunting', estimatedHours: 20 },
      { id: 'th-step-4', stage: 'Capstone & Certification', title: 'Enterprise APT Hunt & Eradication Capstone', description: 'Formulate hypotheses, execute queries, and eliminate multi-stage APT intrusion.', targetSkill: 'Proactive Threat Hunting', route: '/investigation-board', estimatedHours: 25 }
    ],
    suggestedDailyTasks: [
      { id: 'th-task-1', title: 'Draft 1 Sigma Detection Rule', description: 'Write detection for lolbas execution (e.g. certutil/curl downloading payloads).', estimatedMinutes: 20, xpReward: 200, route: '/practice/threat-hunting', category: 'Hunting' },
      { id: 'th-task-2', title: 'Map 3 IOCs to MITRE Techniques', description: 'Link suspicious hashes and IP addresses to ATT&CK sub-techniques.', estimatedMinutes: 15, xpReward: 150, route: '/investigation-board', category: 'Intel' },
      { id: 'th-task-3', title: 'Analyze Network Jitter Patterns', description: 'Evaluate connection timing in Network Diagnostics Lab.', estimatedMinutes: 15, xpReward: 150, route: '/network-lab', category: 'Analysis' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing as a Threat Hunter.
FOCUS: Emphasize hypothesis-driven hunting, adversary behavior baselining, MITRE ATT&CK mapping, Sigma detection rule writing, parent-child process trees, and catching zero-day persistence.
TONE: Inquisitive, proactive, and data-driven like a Principal Cyber Threat Hunter.`,
    getNextAction: (profile, completedIds = []) => {
      return {
        title: 'MITRE ATT&CK Threat Hunting Range',
        actionType: 'LAB',
        targetName: 'Threat Hunting Range',
        route: '/practice/threat-hunting',
        reason: 'Construct behavioral detection rules to isolate persistent adversaries.',
        timeEstimate: '25 min',
        xpReward: 650
      };
    }
  },

  'digital-forensics': {
    id: 'digital-forensics',
    title: 'Digital Forensics (DFIR)',
    emoji: '🔬',
    badge: 'FORENSIC INVESTIGATION',
    category: 'Defensive',
    salaryRange: '$95,000 - $140,000',
    demandLevel: 'High',
    shortDescription: 'Preserve digital evidence, analyze disk images and memory dumps, and reconstruct cyber breach timelines.',
    fullDescription: 'Digital Forensics & Incident Response (DFIR) specialists uncover the exact how, when, and who of cyber intrusions. You will master evidence preservation with cryptographic hashing, filesystem forensics (NTFS $MFT, EXT4 inodes), memory dump extraction (Volatility concepts), prefetch analysis, and legal chain of custody documentation.',
    recommendedModules: [
      { id: 'evidence-chain-custody', title: 'Evidence Handling & Cryptographic Integrity', category: 'Forensic Principles', route: '/ace', xp: 500, description: 'SHA-256 evidence hashing, write blockers, and chain of custody tracking.' },
      { id: 'linux-disk-forensics', title: 'Linux Artifacts & Inode Reconstruction', category: 'Disk Forensics', route: '/linux-lab', xp: 650, description: 'Deleted file carving, timestamp analysis (MACB), and system journal extraction.' },
      { id: 'network-pcap-forensics', title: 'Network Flow & Packet Reconstruction', category: 'Network Forensics', route: '/network-lab', xp: 750, description: 'Reconstruct transferred files, extract unencrypted credentials, and analyze streams.' },
      { id: 'incident-timeline-reconstruction', title: 'Incident Root Cause & Timeline Construction', category: 'Investigation', route: '/investigation-board', xp: 850, description: 'Build unified super-timelines correlating disk, memory, and network artifacts.' }
    ],
    missions: [
      { id: 'dfir-mission-01', title: 'Deleted File Inode Recovery', difficulty: 'Intermediate', timeEstimate: '20 min', description: 'Recover wiped configuration files from Linux virtual filesystem.' },
      { id: 'dfir-mission-02', title: 'Data Exfiltration Protocol Reconstruction', difficulty: 'Intermediate', timeEstimate: '25 min', description: 'Extract stolen sensitive archive from raw packet stream.' },
      { id: 'dfir-mission-03', title: 'Ransomware Master Super-Timeline', difficulty: 'Hard', timeEstimate: '35 min', description: 'Determine patient zero and initial ingress vector from system logs.' }
    ],
    labs: [
      { id: 'ace-locker', name: 'ACE Forensic Evidence Locker', route: '/ace', description: 'Cryptographic SHA-256 hashed evidence catalog and retest logs.', icon: 'Lock' },
      { id: 'investigation-center', name: 'Digital Investigation Center', route: '/investigation-center', description: 'Interactive case studies, artifact correlation, and findings manager.', icon: 'FolderSearch' },
      { id: 'linux-lab', name: 'Filesystem Artifact Sandbox', route: '/linux-lab', description: 'Inspect inodes, permissions, file hashes, and bash history artifacts.', icon: 'Terminal' }
    ],
    tools: ['Autopsy Concepts', 'Volatility Concepts', 'CyberChef', 'Wireshark', 'sleuthkit (fls/icat)', 'sha256sum', 'strings / hexdump'],
    learningPath: [
      { id: 'dfir-step-1', stage: 'Foundation', title: 'Evidence Preservation & Hash Verification', description: 'Calculate SHA-256 checksums and maintain tamper-proof chain of custody.', targetSkill: 'Evidence Integrity', route: '/ace', estimatedHours: 8 },
      { id: 'dfir-step-2', stage: 'Core Skills', title: 'Filesystem Artifacts & Timestamp Analysis', description: 'Analyze Modified, Accessed, Created, Birth (MACB) timestamps.', targetSkill: 'Filesystem Forensics', route: '/linux-lab', estimatedHours: 14 },
      { id: 'dfir-step-3', stage: 'Advanced Specialization', title: 'Memory Analysis & Process Injection', description: 'Inspect memory dumps for injected shellcode and hidden DLLs.', targetSkill: 'Memory Forensics', route: '/investigation-center', estimatedHours: 18 },
      { id: 'dfir-step-4', stage: 'Capstone & Certification', title: 'Court-Ready Forensic Investigation Report Capstone', description: 'Compile an end-to-end incident investigation with legal evidence standards.', targetSkill: 'Forensic Case Documentation', route: '/ace', estimatedHours: 24 }
    ],
    suggestedDailyTasks: [
      { id: 'dfir-task-1', title: 'Compute & Verify SHA-256 Evidence Hash', description: 'Hash target binary and verify against known malicious checksums.', estimatedMinutes: 10, xpReward: 120, route: '/ace', category: 'Integrity' },
      { id: 'dfir-task-2', title: 'Analyze PCAP Artifact for Hidden File Transfer', description: 'Extract payload files from TCP streams in Network Lab.', estimatedMinutes: 20, xpReward: 200, route: '/network-lab', category: 'Network DFIR' },
      { id: 'dfir-task-3', title: 'Construct 5-Event Incident Timeline', description: 'Place attacker actions in chronological order on the Investigation Board.', estimatedMinutes: 15, xpReward: 160, route: '/investigation-board', category: 'Timeline' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing in Digital Forensics & Incident Response (DFIR).
FOCUS: Emphasize strict evidence integrity, cryptographic proof, timestamp verification (MACB), chain of custody, artifact reconstruction, and objective factual reporting without speculative bias.
TONE: Forensic, precise, detail-oriented, and methodical like a Senior Digital Forensics Examiner.`,
    getNextAction: (profile, completedIds = []) => {
      return {
        title: 'Evidence Locker & Forensic Verification',
        actionType: 'LAB',
        targetName: 'Forensic Evidence Locker',
        route: '/ace',
        reason: 'Master cryptographic SHA-256 evidence hashing and chain of custody preservation.',
        timeEstimate: '15 min',
        xpReward: 500
      };
    }
  },

  'cloud-security': {
    id: 'cloud-security',
    title: 'Cloud Security',
    emoji: '☁️',
    badge: 'CLOUD & INFRASTRUCTURE',
    category: 'Enterprise & Cloud',
    salaryRange: '$115,000 - $165,000',
    demandLevel: 'Critical',
    shortDescription: 'Secure AWS, GCP, and Azure cloud environments, IAM policies, Kubernetes clusters, and CI/CD pipelines.',
    fullDescription: 'Cloud Security Specialists protect modern cloud-native architectures, containerized workloads, and serverless applications. You will master Cloud IAM least privilege, S3 bucket policy auditing, Kubernetes RBAC, infrastructure as code (Terraform) security scanning, and cloud misconfiguration remediation.',
    recommendedModules: [
      { id: 'cloud-iam-least-privilege', title: 'Cloud IAM & Role Privilege Escalation', category: 'Cloud IAM', route: '/practice/security-tools', xp: 600, description: 'Identify overly permissive IAM roles and assume-role privilege chains.' },
      { id: 'container-kubernetes-sec', title: 'Container & Kubernetes Cluster Hardening', category: 'Cloud Native', route: '/linux-lab', xp: 750, description: 'Docker socket escapes, unprivileged container namespaces, and network policies.' },
      { id: 'cloud-storage-misconfig', title: 'Cloud Storage & Metadata Security', category: 'Cloud Infrastructure', route: '/practice/web-security', xp: 700, description: 'Prevent public bucket leaks and protect cloud metadata endpoints (IMDSv2).' },
      { id: 'iac-pipeline-security', title: 'DevSecOps & CI/CD Pipeline Scanning', category: 'DevSecOps', route: '/practice/security-tools', xp: 850, description: 'Scan Terraform/CloudFormation code for security misconfigurations.' }
    ],
    missions: [
      { id: 'cloud-mission-01', title: 'Overly Permissive S3 Bucket Remediation', difficulty: 'Easy', timeEstimate: '15 min', description: 'Lock down public read/write permissions on corporate backup bucket.' },
      { id: 'cloud-mission-02', title: 'Cloud Instance Metadata SSRF Defense', difficulty: 'Intermediate', timeEstimate: '20 min', description: 'Enforce IMDSv2 session tokens to block SSRF credential theft.' },
      { id: 'cloud-mission-03', title: 'Container Namespace Breakout Containment', difficulty: 'Hard', timeEstimate: '30 min', description: 'Isolate compromised pod attempting to mount host filesystem root.' }
    ],
    labs: [
      { id: 'security-tools', name: 'Cloud Policy & Security Tools', route: '/practice/security-tools', description: 'Inspect JSON IAM policies, audit access controls, and verify headers.', icon: 'Cloud' },
      { id: 'linux-lab', name: 'Container & Linux Sandbox', route: '/linux-lab', description: 'Explore Linux namespaces, cgroups, chroot, and process permissions.', icon: 'Terminal' },
      { id: 'web-security', name: 'Cloud API & Web Lab', route: '/practice/web-security', description: 'Audit REST APIs and test cloud metadata SSRF protection.', icon: 'Globe' }
    ],
    tools: ['AWS/GCP/Azure CLI Concepts', 'Terraform / IaC Scanners', 'Trivy / Container Scanners', 'Docker / K8s Concepts', 'CyberChef'],
    learningPath: [
      { id: 'cloud-step-1', stage: 'Foundation', title: 'Cloud Shared Responsibility Model & IAM', description: 'Understand identity federation, policies, roles, and principle of least privilege.', targetSkill: 'Cloud IAM', route: '/practice/security-tools', estimatedHours: 8 },
      { id: 'cloud-step-2', stage: 'Core Skills', title: 'Storage & Network Security in the Cloud', description: 'Configure VPC subnets, security groups, private endpoints, and encryption at rest.', targetSkill: 'Cloud Networking', route: '/network-lab', estimatedHours: 14 },
      { id: 'cloud-step-3', stage: 'Advanced Specialization', title: 'Kubernetes & Container Workload Protection', description: 'Implement container security scanning, distroless images, and runtime defense.', targetSkill: 'Container Security', route: '/linux-lab', estimatedHours: 18 },
      { id: 'cloud-step-4', stage: 'Capstone & Certification', title: 'Multi-Cloud Secure Architecture Capstone', description: 'Design zero-trust multi-region cloud deployment adhering to CIS Benchmarks.', targetSkill: 'Cloud Security Architecture', route: '/roadmap', estimatedHours: 24 }
    ],
    suggestedDailyTasks: [
      { id: 'cloud-task-1', title: 'Audit JSON IAM Policy for Wildcards (*)', description: 'Replace wildcard permissions with scoped action verbs.', estimatedMinutes: 15, xpReward: 150, route: '/practice/security-tools', category: 'Cloud IAM' },
      { id: 'cloud-task-2', title: 'Inspect Container Permissions in Linux Lab', description: 'Verify unprivileged user execution inside virtual container shell.', estimatedMinutes: 20, xpReward: 180, route: '/linux-lab', category: 'Containers' },
      { id: 'cloud-task-3', title: 'Test Cloud Metadata Defense in Web Lab', description: 'Validate IMDSv2 token enforcement on mock server.', estimatedMinutes: 15, xpReward: 160, route: '/practice/web-security', category: 'Cloud AppSec' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing as a Cloud Security Specialist.
FOCUS: Emphasize Cloud IAM least privilege, Shared Responsibility Model, container/Kubernetes security, Infrastructure-as-Code (IaC) guardrails, and cloud misconfiguration prevention.
TONE: Forward-looking, architecturally disciplined, and cloud-native like a Lead Cloud Security Architect.`,
    getNextAction: (profile, completedIds = []) => {
      return {
        title: 'Cloud IAM & Policy Hardening Lab',
        actionType: 'LAB',
        targetName: 'Cloud Security Tools',
        route: '/practice/security-tools',
        reason: 'Master least-privilege IAM policies to prevent lateral privilege escalation in cloud environments.',
        timeEstimate: '20 min',
        xpReward: 600
      };
    }
  },

  'active-directory': {
    id: 'active-directory',
    title: 'Active Directory / Enterprise Security',
    emoji: '🏢',
    badge: 'IDENTITY & ENTERPRISE',
    category: 'Enterprise & Cloud',
    salaryRange: '$105,000 - $150,000',
    demandLevel: 'High',
    shortDescription: 'Defend and audit enterprise Windows domains, Kerberos authentication, Group Policy, and Tiered Admin models.',
    fullDescription: 'Active Directory (AD) is the identity backbone of 90%+ of global enterprises. You will master Kerberos authentication (TGT, TGS, PAC), Kerberoasting & AS-REP Roasting defense, Pass-the-Hash mitigation, Group Policy Object (GPO) hardening, BloodHound attack path auditing, and Azure AD / Entra ID hybrid synchronization.',
    recommendedModules: [
      { id: 'kerberos-fundamentals', title: 'Kerberos Protocols & Authentication Flow', category: 'Identity Security', route: '/network-lab', xp: 600, description: 'Understand KDC, AS-REQ/AS-REP, TGS-REQ/TGS-REP, and ticket security.' },
      { id: 'ad-attack-vectors-defense', title: 'Kerberoasting & AS-REP Roasting Defense', category: 'Domain Hardening', route: '/practice/soc-simulator', xp: 750, description: 'Detect and mitigate service account password cracking attacks.' },
      { id: 'gpo-tiered-administration', title: 'Group Policy & Tiered Administrative Model', category: 'Enterprise Architecture', route: '/practice/threat-hunting', xp: 850, description: 'Implement Tier 0 / Tier 1 / Tier 2 administrative segregation.' },
      { id: 'bloodhound-graph-auditing', title: 'Attack Path Graph Analysis (BloodHound Concepts)', category: 'Domain Auditing', route: '/investigation-board', xp: 900, description: 'Eliminate shortest lateral movement paths to Domain Admin.' }
    ],
    missions: [
      { id: 'ad-mission-01', title: 'Detect AS-REP Roasting Anomaly in SIEM', difficulty: 'Intermediate', timeEstimate: '20 min', description: 'Isolate account requesting Kerberos tickets without pre-authentication.' },
      { id: 'ad-mission-02', title: 'Audit Overly Permissive Domain GPO', difficulty: 'Intermediate', timeEstimate: '25 min', description: 'Remove dangerous startup script granting local administrator to domain users.' },
      { id: 'ad-mission-03', title: 'Sever Lateral Movement Path to Tier 0', difficulty: 'Hard', timeEstimate: '35 min', description: 'Break DCSync and Pass-the-Hash paths leading to Domain Controller.' }
    ],
    labs: [
      { id: 'soc-simulator', name: 'Enterprise SIEM Simulator', route: '/practice/soc-simulator', description: 'Detect Kerberos ticket anomalies and lateral movement logs.', icon: 'Shield' },
      { id: 'investigation-board', name: 'Domain Attack Path Board', route: '/investigation-board', description: 'Graph domain relationships, user groups, and trust hierarchies.', icon: 'Layers' },
      { id: 'network-lab', name: 'Network Protocol Analyzer', route: '/network-lab', description: 'Inspect LDAP, Kerberos (88), and SMB (445) protocol traffic.', icon: 'Network' }
    ],
    tools: ['Active Directory Users & Computers', 'BloodHound Concepts', 'Mimikatz Defense Concepts', 'Wireshark', 'Sysmon', 'PowerView Concepts'],
    learningPath: [
      { id: 'ad-step-1', stage: 'Foundation', title: 'Windows Domain Architecture & Kerberos', description: 'Learn Domain Controllers, Forests, Trees, OUs, and Ticket Granting Services.', targetSkill: 'Domain Foundations', route: '/network-lab', estimatedHours: 10 },
      { id: 'ad-step-2', stage: 'Core Skills', title: 'Enterprise Identity Attacks & Defenses', description: 'Mitigate Kerberoasting, Golden/Silver Tickets, and Unconstrained Delegation.', targetSkill: 'Kerberos Defense', route: '/practice/soc-simulator', estimatedHours: 16 },
      { id: 'ad-step-3', stage: 'Advanced Specialization', title: 'Tiered Admin Architecture & GPO Hardening', description: 'Enforce ESAE / Red Forest models and disable NTLMv1/SMBv1 across enterprise.', targetSkill: 'Enterprise Architecture', route: '/practice/threat-hunting', estimatedHours: 20 },
      { id: 'ad-step-4', stage: 'Capstone & Certification', title: 'Enterprise Domain Security Hardening Capstone', description: 'Audit complete domain forest, remediate all Tier 0 paths, and issue audit report.', targetSkill: 'Enterprise Domain Hardening', route: '/ace', estimatedHours: 25 }
    ],
    suggestedDailyTasks: [
      { id: 'ad-task-1', title: 'Analyze Kerberos Port 88 Traffic', description: 'Inspect AS-REQ and TGS-REP packets in the Network Lab.', estimatedMinutes: 15, xpReward: 160, route: '/network-lab', category: 'Protocols' },
      { id: 'ad-task-2', title: 'Correlate Event ID 4769 (TGS Request)', description: 'Identify RC4 encryption downgrade anomalies in SIEM Simulator.', estimatedMinutes: 20, xpReward: 200, route: '/practice/soc-simulator', category: 'SIEM' },
      { id: 'ad-task-3', title: 'Map Tier 0 Assets on Investigation Board', description: 'Link Domain Controllers, PKI, and Admin accounts.', estimatedMinutes: 15, xpReward: 150, route: '/investigation-board', category: 'Architecture' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing in Active Directory & Enterprise Security.
FOCUS: Emphasize Kerberos authentication mechanics, Tiered Administrative architectures (Tier 0/1/2), Group Policy hardening, Pass-the-Hash mitigation, and attack path elimination.
TONE: Enterprise-grade, governance-minded, and identity-focused like a Principal Enterprise Identity Security Engineer.`,
    getNextAction: (profile, completedIds = []) => {
      return {
        title: 'Kerberos Authentication & Protocol Dissection',
        actionType: 'LAB',
        targetName: 'Network Recon Lab',
        route: '/network-lab',
        reason: 'Master Kerberos ticket exchange (Port 88) to defend against credential harvesting attacks.',
        timeEstimate: '20 min',
        xpReward: 600
      };
    }
  },

  'security-python': {
    id: 'security-python',
    title: 'Security Python Developer',
    emoji: '🐍',
    badge: 'SECURITY ENGINEERING',
    category: 'Engineering',
    salaryRange: '$100,000 - $145,000',
    demandLevel: 'High',
    shortDescription: 'Build automated vulnerability scanners, network packet crafters, threat intelligence parsers, and custom security tooling.',
    fullDescription: 'Security Python Developers bridge the gap between software engineering and offensive/defensive operations by writing custom automation scripts, exploit proof-of-concepts, log parsers, and threat intelligence ingestion pipelines. You will master socket programming, Scapy packet manipulation, requests/BeautifulSoup scraping, cryptography libraries, and CI/CD security automation.',
    recommendedModules: [
      { id: 'python-socket-port-scanner', title: 'Socket Programming: Custom Port Scanner', category: 'Network Tooling', route: '/linux-lab', xp: 500, description: 'Build a multi-threaded TCP banner grabber and port scanner in Python.' },
      { id: 'python-packet-crafting-scapy', title: 'Packet Crafting with Scapy', category: 'Protocol Engineering', route: '/network-lab', xp: 650, description: 'Forge custom ARP/ICMP packets and analyze raw network responses.' },
      { id: 'python-log-parser-regex', title: 'Automated SIEM & Syslog Ingestion Engine', category: 'Defensive Automation', route: '/linux-lab', xp: 750, description: 'Parse multi-gigabyte log streams using regex and extract suspicious IP IOCs.' },
      { id: 'python-crypto-hashing', title: 'Cryptographic Tooling & Key Verification', category: 'Cryptography', route: '/practice/security-tools', xp: 800, description: 'Implement SHA-256 HMAC verification, AES encryption, and RSA keypair handlers.' }
    ],
    missions: [
      { id: 'py-mission-01', title: 'Automate Nmap Output XML Parsing', difficulty: 'Easy', timeEstimate: '15 min', description: 'Write script to parse nmap -oX and extract vulnerable service versions.' },
      { id: 'py-mission-02', title: 'Build Web Form Brute-Force Script', difficulty: 'Intermediate', timeEstimate: '20 min', description: 'Write threaded HTTP client to test weak authentication endpoints.' },
      { id: 'py-mission-03', title: 'Automate Forensic Hash Verification Pipeline', difficulty: 'Intermediate', timeEstimate: '25 min', description: 'Calculate recursive SHA-256 hashes and flag tampered evidence files.' }
    ],
    labs: [
      { id: 'linux-lab', name: 'Python Execution Sandbox', route: '/linux-lab', description: 'Write and execute Python security scripts in the Linux terminal.', icon: 'Code' },
      { id: 'network-lab', name: 'Network Packet Lab', route: '/network-lab', description: 'Test custom network packets and analyze socket connections.', icon: 'Network' },
      { id: 'security-tools', name: 'Encoder & Cryptography Suite', route: '/practice/security-tools', description: 'Verify hashes, base64 encoding, and cipher transformations.', icon: 'Key' }
    ],
    tools: ['Python 3', 'Scapy', 'Requests', 'Sockets', 'Regex (re)', 'PyCryptodome', 'Subprocess'],
    learningPath: [
      { id: 'py-step-1', stage: 'Foundation', title: 'Python Sockets & Network CLI Tooling', description: 'Connect to remote ports, send HTTP headers, and read raw socket buffers.', targetSkill: 'Socket Programming', route: '/linux-lab', estimatedHours: 8 },
      { id: 'py-step-2', stage: 'Core Skills', title: 'Packet Crafting & Raw Protocol Injection', description: 'Construct custom TCP flags and SYN flood detectors using Scapy.', targetSkill: 'Scapy Packet Crafting', route: '/network-lab', estimatedHours: 14 },
      { id: 'py-step-3', stage: 'Advanced Specialization', title: 'Threat Intel & SIEM Ingestion Pipelines', description: 'Consume external threat feeds (AlienVault OTX, AbuseIPDB) via REST APIs.', targetSkill: 'Security Automation', route: '/practice/threat-hunting', estimatedHours: 18 },
      { id: 'py-step-4', stage: 'Capstone & Certification', title: 'Automated Security Scanner & Reporter Capstone', description: 'Author a complete end-to-end vulnerability scanning and report generation engine.', targetSkill: 'Custom Tool Architecture', route: '/ace', estimatedHours: 22 }
    ],
    suggestedDailyTasks: [
      { id: 'py-task-1', title: 'Write 10-line Python TCP Port Scanner', description: 'Use Python socket module to test port 80/443 in Linux Lab.', estimatedMinutes: 15, xpReward: 160, route: '/linux-lab', category: 'Scripting' },
      { id: 'py-task-2', title: 'Parse IP Addresses from Raw Text with Regex', description: 'Extract IPv4 patterns from auth.log in the Linux Sandbox.', estimatedMinutes: 15, xpReward: 150, route: '/linux-lab', category: 'Automation' },
      { id: 'py-task-3', title: 'Calculate SHA-256 Hashes with hashlib', description: 'Verify file checksum integrity programmatically.', estimatedMinutes: 10, xpReward: 110, route: '/practice/security-tools', category: 'Crypto' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing as a Security Python Developer.
FOCUS: Emphasize practical cybersecurity automation, socket programming, Scapy packet crafting, regex log extraction, secure coding practices, and creating maintainable security CLI tools.
TONE: Pragmatic, code-focused, algorithmic, and developer-friendly like a Staff Security Software Engineer.`,
    getNextAction: (profile, completedIds = []) => {
      return {
        title: 'Python Sockets & Network Tooling Sandbox',
        actionType: 'LAB',
        targetName: 'Linux Python Sandbox',
        route: '/linux-lab',
        reason: 'Build your first custom Python port scanner and banner grabber.',
        timeEstimate: '20 min',
        xpReward: 500
      };
    }
  },

  'incident-responder': {
    id: 'incident-responder',
    title: 'Incident Responder',
    emoji: '🚨',
    badge: 'INCIDENT RESPONSE',
    category: 'Defensive',
    salaryRange: '$98,000 - $148,000',
    demandLevel: 'Critical',
    shortDescription: 'Lead rapid containment, eradicate malicious persistence, and restore critical services during active enterprise cyberattacks.',
    fullDescription: 'Incident Responders take charge when organizations face live breaches. You will master the 6 NIST/SANS Incident Response stages (Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned), live memory triage, firewall isolation, compromised credential revocation, and root cause post-mortem documentation.',
    recommendedModules: [
      { id: 'nist-sans-ir-lifecycle', title: 'NIST & SANS Incident Response Lifecycle', category: 'IR Frameworks', route: '/live-incidents', xp: 550, description: 'Master triage priorities, severity matrix, and containment strategies.' },
      { id: 'host-containment-isolation', title: 'Live Host Isolation & Network Segmentation', category: 'Containment', route: '/practice/soc-simulator', xp: 700, description: 'Sever adversary C2 connections and block compromised IP ranges.' },
      { id: 'persistence-eradication', title: 'Malware Eradication & Credential Revocation', category: 'Eradication', route: '/linux-lab', xp: 800, description: 'Remove backdoors, clean scheduled jobs, and invalidate Kerberos golden tickets.' },
      { id: 'post-incident-reporting', title: 'Post-Mortem Root Cause Analysis & ACE Report', category: 'Post-Incident', route: '/ace', xp: 850, description: 'Author executive breach summaries and lessons-learned action plans.' }
    ],
    missions: [
      { id: 'ir-mission-01', title: 'Active Ransomware Encryption Containment', difficulty: 'Intermediate', timeEstimate: '20 min', description: 'Halt malicious process tree and isolate patient zero server.' },
      { id: 'ir-mission-02', title: 'Compromised Domain Admin Account Revocation', difficulty: 'Intermediate', timeEstimate: '25 min', description: 'Reset Krbtgt account twice and invalidate active session tokens.' },
      { id: 'ir-mission-03', title: 'Multi-Host Enterprise Breach Eradication', difficulty: 'Hard', timeEstimate: '35 min', description: 'Coordinate containment across 4 compromised subnet endpoints.' }
    ],
    labs: [
      { id: 'live-incidents', name: 'Live Incident Response Arena', route: '/live-incidents', description: 'Real-time simulated cyber crisis command and containment room.', icon: 'AlertTriangle' },
      { id: 'soc-simulator', name: 'SOC & Containment Simulator', route: '/practice/soc-simulator', description: 'Execute host isolation rules and analyze SIEM correlation.', icon: 'Shield' },
      { id: 'investigation-board', name: 'Incident War Room Board', route: '/investigation-board', description: 'Coordinate timeline, affected hosts, and remediation milestones.', icon: 'Activity' }
    ],
    tools: ['Wireshark', 'Velociraptor Concepts', 'Splunk / SIEM', 'Sysmon', 'Firewall CLI', 'CyberChef'],
    learningPath: [
      { id: 'ir-step-1', stage: 'Foundation', title: 'Incident Response Phases & Triage Matrix', description: 'Understand triage criteria, severity scoring (P1-P4), and initial scopes.', targetSkill: 'IR Triage', route: '/live-incidents', estimatedHours: 8 },
      { id: 'ir-step-2', stage: 'Core Skills', title: 'Rapid Containment & Firewall Quarantine', description: 'Execute host isolation without destroying volatile memory evidence.', targetSkill: 'Host Isolation', route: '/practice/soc-simulator', estimatedHours: 14 },
      { id: 'ir-step-3', stage: 'Advanced Specialization', title: 'Persistence Eradication & System Recovery', description: 'Eliminate rootkits, persistence keys, and restore safe system backups.', targetSkill: 'Eradication & Recovery', route: '/linux-lab', estimatedHours: 18 },
      { id: 'ir-step-4', stage: 'Capstone & Certification', title: 'Live Crisis Simulation & Executive Debrief Capstone', description: 'Lead end-to-end response during active enterprise ransomware simulation.', targetSkill: 'Incident Command', route: '/live-incidents', estimatedHours: 24 }
    ],
    suggestedDailyTasks: [
      { id: 'ir-task-1', title: 'Execute Host Quarantine Command in Simulator', description: 'Isolate compromised host 10.200.1.25 in the SOC Simulator.', estimatedMinutes: 15, xpReward: 170, route: '/practice/soc-simulator', category: 'Containment' },
      { id: 'ir-task-2', title: 'Identify Root Ingress Vector in Live Incident', description: 'Trace initial access point in the Live Incident Arena.', estimatedMinutes: 20, xpReward: 210, route: '/live-incidents', category: 'Root Cause' },
      { id: 'ir-task-3', title: 'Draft Incident Action Plan in ACE Locker', description: 'List short-term containment and long-term hardening tasks.', estimatedMinutes: 15, xpReward: 140, route: '/ace', category: 'Documentation' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing as an Incident Responder.
FOCUS: Emphasize rapid triage, immediate containment strategies, evidence preservation, methodical eradication of threat actor persistence, and structured post-incident debriefs.
TONE: Urgent yet calm, decisive, tactical, and authoritative like an Incident Commander in a live war room.`,
    getNextAction: (profile, completedIds = []) => {
      return {
        title: 'Live Incident Response Simulation',
        actionType: 'LAB',
        targetName: 'Live Incident Arena',
        route: '/live-incidents',
        reason: 'Experience live breach containment and coordinate threat mitigation.',
        timeEstimate: '20 min',
        xpReward: 600
      };
    }
  },

  'ctf-ethical-hacker': {
    id: 'ctf-ethical-hacker',
    title: 'CTF / Ethical Hacker',
    emoji: '🏆',
    badge: 'CTF COMPETITOR & RED TEAM',
    category: 'Offensive',
    salaryRange: '$90,000 - $140,000',
    demandLevel: 'High',
    shortDescription: 'Master competitive Capture The Flag (CTF) challenges across Web, Cryptography, Reverse Engineering, Forensics, and Pwn.',
    fullDescription: 'CTF Competitors and Ethical Hackers cultivate deep out-of-the-box analytical problem solving across all cybersecurity domains. You will master cryptic encoding decoders, binary reverse engineering, web injection bypasses, steganography, custom cipher cracking, and privilege exploitation under time constraints.',
    recommendedModules: [
      { id: 'ctf-crypto-encoding', title: 'Cryptography & Ciphers Mastery', category: 'Cryptography', route: '/ctf-arena', xp: 550, description: 'Base64, ROT13, XOR, RSA public key decryption, and hash cracking.' },
      { id: 'ctf-web-exploitation', title: 'Web CTF Challenges & Filter Bypasses', category: 'Web CTF', route: '/ctf-arena', xp: 650, description: 'Bypass WAF filters, exploit regex weaknesses, and manipulate hidden cookies.' },
      { id: 'ctf-forensics-stego', title: 'Forensic Artifacts & Steganography', category: 'Forensics', route: '/ctf-arena', xp: 750, description: 'Extract hidden payloads inside image EXIF data and binary file headers.' },
      { id: 'ctf-reverse-engineering', title: 'Reverse Engineering & Binary Analysis', category: 'Rev / Binary', route: '/ctf-arena', xp: 850, description: 'Decompile binaries, inspect assembly strings, and bypass license checks.' }
    ],
    missions: [
      { id: 'ctf-mission-01', title: 'Cracking the Multi-Layer Encoded Cipher', difficulty: 'Easy', timeEstimate: '15 min', description: 'Decode chained Base64, Hex, and Caesar ciphers to reveal hidden flag.' },
      { id: 'ctf-mission-02', title: 'Web Header Flag Extraction', difficulty: 'Easy', timeEstimate: '15 min', description: 'Inspect custom HTTP response headers and cookies to locate secret token.' },
      { id: 'ctf-mission-03', title: 'Hidden Inode Flag Recovery', difficulty: 'Intermediate', timeEstimate: '20 min', description: 'Carve deleted flag text file from virtual disk partition.' }
    ],
    labs: [
      { id: 'ctf-arena', name: 'CTF Arena', route: '/ctf-arena', description: 'Category-based CTF challenges with live flag submission engine.', icon: 'Flag' },
      { id: 'security-tools', name: 'Crypto & Hash Tools Suite', route: '/practice/security-tools', description: 'Instant decoding, hashing, and protocol translation tools.', icon: 'Wrench' },
      { id: 'linux-lab', name: 'Linux Mastery Lab', route: '/linux-lab', description: 'Command-line manipulation, strings, grep, and binary inspection.', icon: 'Terminal' }
    ],
    tools: ['CyberChef', 'Ghidra Concepts', 'GDB / Binary Tools', 'Strings', 'Base64', 'John the Ripper / Hashcat Concepts', 'Wireshark'],
    learningPath: [
      { id: 'ctf-step-1', stage: 'Foundation', title: 'Encoding, Hashing & Classic Cryptography', description: 'Differentiate encoding (Base64), hashing (SHA), and encryption (AES/RSA).', targetSkill: 'Crypto Foundations', route: '/ctf-arena', estimatedHours: 8 },
      { id: 'ctf-step-2', stage: 'Core Skills', title: 'Web App Injection & Source Code Inspection', description: 'Inspect DOM scripts, hidden form fields, and SQL injection filter evasion.', targetSkill: 'Web CTF', route: '/ctf-arena', estimatedHours: 14 },
      { id: 'ctf-step-3', stage: 'Advanced Specialization', title: 'Binary Inspection & Reverse Engineering', description: 'Inspect ELF binary sections, strings, and disassemble functions in Linux.', targetSkill: 'Reverse Engineering', route: '/linux-lab', estimatedHours: 18 },
      { id: 'ctf-step-4', stage: 'Capstone & Certification', title: 'CTF Championship Speedrun Capstone', description: 'Solve 10 mixed-category challenges under time pressure to earn Apex Hacker badge.', targetSkill: 'Competitive CTF Mastery', route: '/ctf-arena', estimatedHours: 20 }
    ],
    suggestedDailyTasks: [
      { id: 'ctf-task-1', title: 'Capture 1 Flag in CTF Arena', description: 'Solve a Crypto or Web challenge in the CTF Arena.', estimatedMinutes: 15, xpReward: 200, route: '/ctf-arena', category: 'CTF' },
      { id: 'ctf-task-2', title: 'Decode Complex CyberChef Recipe', description: 'Unravel nested encoding in the Security Tools suite.', estimatedMinutes: 10, xpReward: 120, route: '/practice/security-tools', category: 'Crypto' },
      { id: 'ctf-task-3', title: 'Inspect Strings in Linux Binary', description: 'Run strings and hexdump on mystery target in Linux Lab.', estimatedMinutes: 15, xpReward: 150, route: '/linux-lab', category: 'Reversing' }
    ],
    amanSystemInstructions: `You are mentoring a student specializing as a CTF Competitor & Ethical Hacker.
FOCUS: Emphasize lateral thinking, creative problem solving, cryptographic decoding (CyberChef), web filter evasion, binary inspection, and progressive hint guidance without giving away flags directly.
TONE: Energetic, clever, gamified, and challenging like a veteran CTF team captain.`,
    getNextAction: (profile, completedIds = []) => {
      return {
        title: 'CTF Arena Challenge Suite',
        actionType: 'CHALLENGE',
        targetName: 'CTF Arena',
        route: '/ctf-arena',
        reason: 'Test your out-of-the-box hacking skills across real-world CTF flag categories.',
        timeEstimate: '15 min',
        xpReward: 550
      };
    }
  },

  'beginner-explore': {
    id: 'beginner-explore',
    title: 'Beginner / Explore Cybersecurity',
    emoji: '🌱',
    badge: 'FOUNDATIONAL EXPLORER',
    category: 'Beginner',
    salaryRange: 'Explore All Paths ($75k - $150k+)',
    demandLevel: 'Critical',
    shortDescription: 'Starting from zero? Explore Linux commands, computer networking, ethical hacking basics, and defense fundamentals.',
    fullDescription: 'The Beginner Explorer pathway is designed for curious minds taking their first steps into the cybersecurity universe. You will gently build confidence with basic command line navigation, understand how the internet and IP addresses work, learn the fundamentals of cyber defense vs offense, and test different specialties before choosing your long-term career focus.',
    recommendedModules: [
      { id: 'comp-fundamentals', title: 'Computer & OS Fundamentals', category: 'Fundamentals', route: '/modules', xp: 300, description: 'Learn bits, bytes, operating systems, processes, and memory.' },
      { id: 'linux-starter', title: 'Linux Starter: First Terminal Commands', category: 'Linux', route: '/linux-lab', xp: 400, description: 'Master pwd, ls, cd, cat, whoami, and basic file manipulation.' },
      { id: 'networking-starter', title: 'How the Internet Works & IP Addressing', category: 'Networking', route: '/network-lab', xp: 400, description: 'IP addresses, DNS lookup queries, ping, and TCP/UDP ports.' },
      { id: 'ethical-hacking-overview', title: 'Ethical Hacking vs Cyber Defense Overview', category: 'Cyber Overview', route: '/roadmap', xp: 350, description: 'Understand Red Team vs Blue Team roles, ethics, and career paths.' }
    ],
    missions: [
      { id: 'beg-mission-01', title: 'My First Linux Terminal Command', difficulty: 'Beginner', timeEstimate: '10 min', description: 'Navigate directories and read secret welcome note in Linux sandbox.' },
      { id: 'beg-mission-02', title: 'Ping the Gateway & Check Connectivity', difficulty: 'Beginner', timeEstimate: '10 min', description: 'Verify network connectivity and identify gateway IP address.' },
      { id: 'beg-mission-03', title: 'Decode Your First Secret Message', difficulty: 'Beginner', timeEstimate: '10 min', description: 'Decode simple Base64 secret text in the Security Tools suite.' }
    ],
    labs: [
      { id: 'linux-lab', name: 'Linux Terminal Sandbox', route: '/linux-lab', description: 'Zero-risk interactive browser shell to learn basic commands.', icon: 'Terminal' },
      { id: 'network-lab', name: 'Network Explorer Lab', route: '/network-lab', description: 'Visual diagnostics, ping tests, and port exploration.', icon: 'Globe' },
      { id: 'subnetting-trainer', name: 'Subnetting & Binary Speed Trainer', route: '/practice/subnetting', description: 'Interactive binary and CIDR visual math trainer.', icon: 'Calculator' }
    ],
    tools: ['Terminal (ls, cd, cat)', 'Ping', 'Traceroute', 'CyberChef', 'Browser DevTools'],
    learningPath: [
      { id: 'beg-step-1', stage: 'Foundation', title: 'Welcome to the Command Line', description: 'Overcome terminal fear by practicing basic filesystem commands in sandbox.', targetSkill: 'Basic Terminal', route: '/linux-lab', estimatedHours: 4 },
      { id: 'beg-step-2', stage: 'Core Skills', title: 'Networking Basics (IPs, Ports & DNS)', description: 'Understand how websites load and how devices communicate on networks.', targetSkill: 'Networking Basics', route: '/network-lab', estimatedHours: 6 },
      { id: 'beg-step-3', stage: 'Advanced Specialization', title: 'Try All Specialties (Web, SOC & Pentesting)', description: 'Sample hands-on mini labs in Web Security, SOC Triage, and CTF challenges.', targetSkill: 'Cyber Exploration', route: '/roles', estimatedHours: 8 },
      { id: 'beg-step-4', stage: 'Capstone & Certification', title: 'Cyber Foundations Badge Capstone', description: 'Complete your first end-to-end beginner cyber lab mission and claim badge.', targetSkill: 'Cyber Foundations', route: '/dashboard', estimatedHours: 10 }
    ],
    suggestedDailyTasks: [
      { id: 'beg-task-1', title: 'Run 5 Basic Linux Commands', description: 'Execute pwd, ls -la, whoami, date, and uname in Linux Lab.', estimatedMinutes: 10, xpReward: 100, route: '/linux-lab', category: 'Linux' },
      { id: 'beg-task-2', title: 'Ping a Host in the Network Lab', description: 'Test ICMP echo reply responses in Network Lab.', estimatedMinutes: 10, xpReward: 100, route: '/network-lab', category: 'Networking' },
      { id: 'beg-task-3', title: 'Explore the 11 Career Roles', description: 'Browse career paths and salaries on the Career Roles page.', estimatedMinutes: 10, xpReward: 100, route: '/roles', category: 'Career' }
    ],
    amanSystemInstructions: `You are mentoring a complete beginner exploring cybersecurity for the very first time.
FOCUS: Keep explanations simple, friendly, jargon-free, and encouraging. Use clear everyday analogies (e.g. comparing IP addresses to postal addresses, ports to apartment door numbers, firewalls to security guards).
TONE: Warm, patient, highly encouraging, and supportive like a welcoming mentor.`,
    getNextAction: (profile, completedIds = []) => {
      return {
        title: 'Linux Fundamentals Starter Lab',
        actionType: 'LAB',
        targetName: 'Linux Starter Sandbox',
        route: '/linux-lab',
        reason: 'Get comfortable with the Linux terminal by executing your first few commands.',
        timeEstimate: '15 min',
        xpReward: 400
      };
    }
  }
};

// Aliases and mappings
ROLE_PERSONALIZATION_REGISTRY['ethical-hacker'] = ROLE_PERSONALIZATION_REGISTRY['ctf-ethical-hacker'];
ROLE_PERSONALIZATION_REGISTRY['dfir-analyst'] = ROLE_PERSONALIZATION_REGISTRY['digital-forensics'];
ROLE_PERSONALIZATION_REGISTRY['network-security'] = ROLE_PERSONALIZATION_REGISTRY['soc-analyst'];
ROLE_PERSONALIZATION_REGISTRY['blue-team'] = ROLE_PERSONALIZATION_REGISTRY['soc-analyst'];
ROLE_PERSONALIZATION_REGISTRY['purple-team'] = ROLE_PERSONALIZATION_REGISTRY['pentester'];
ROLE_PERSONALIZATION_REGISTRY['security-engineer'] = ROLE_PERSONALIZATION_REGISTRY['security-python'];
ROLE_PERSONALIZATION_REGISTRY['security-researcher'] = ROLE_PERSONALIZATION_REGISTRY['threat-hunter'];
ROLE_PERSONALIZATION_REGISTRY['ctf-competitor'] = ROLE_PERSONALIZATION_REGISTRY['ctf-ethical-hacker'];

export function getRolePersonalization(roleIdOrTitle?: string): RolePersonalizationConfig {
  if (!roleIdOrTitle) {
    return ROLE_PERSONALIZATION_REGISTRY['soc-analyst'];
  }

  const normalized = roleIdOrTitle.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (ROLE_PERSONALIZATION_REGISTRY[normalized]) {
    return ROLE_PERSONALIZATION_REGISTRY[normalized];
  }

  // Check titles
  const byTitle = Object.values(ROLE_PERSONALIZATION_REGISTRY).find(
    r => r.title.toLowerCase() === roleIdOrTitle.toLowerCase() ||
         r.id.toLowerCase() === roleIdOrTitle.toLowerCase()
  );

  if (byTitle) return byTitle;

  return ROLE_PERSONALIZATION_REGISTRY['soc-analyst'];
}

export function getAllPersonalizedRoles(): RolePersonalizationConfig[] {
  return [
    ROLE_PERSONALIZATION_REGISTRY['soc-analyst'],
    ROLE_PERSONALIZATION_REGISTRY['pentester'],
    ROLE_PERSONALIZATION_REGISTRY['web-security'],
    ROLE_PERSONALIZATION_REGISTRY['threat-hunter'],
    ROLE_PERSONALIZATION_REGISTRY['digital-forensics'],
    ROLE_PERSONALIZATION_REGISTRY['cloud-security'],
    ROLE_PERSONALIZATION_REGISTRY['active-directory'],
    ROLE_PERSONALIZATION_REGISTRY['security-python'],
    ROLE_PERSONALIZATION_REGISTRY['incident-responder'],
    ROLE_PERSONALIZATION_REGISTRY['ctf-ethical-hacker'],
    ROLE_PERSONALIZATION_REGISTRY['beginner-explore']
  ];
}
