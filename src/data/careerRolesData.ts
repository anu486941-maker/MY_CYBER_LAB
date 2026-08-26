import { CareerRole } from '../types';

export const CAREER_ROLES_DATA: CareerRole[] = [
  {
    id: 'soc-analyst',
    title: 'SOC Analyst',
    emoji: '🛡️',
    badge: 'DEFENSIVE SOC',
    tagline: 'Defend enterprise perimeters, analyze telemetry, and triage security incidents in real time.',
    shortDescription: 'Monitor security operations center telemetry, analyze SIEM alerts, investigate suspicious login anomalies, and contain intrusions.',
    fullDescription: 'As a Security Operations Center (SOC) Analyst, you are the first line of defense protecting enterprise infrastructure. You will master log analysis across Windows Event Logs and Linux Syslog, triage SIEM alerts (Splunk/Elastic), decipher network packets with Wireshark, dissect attacker behaviors via MITRE ATT&CK, and execute rapid incident containment.',
    difficulty: 'Beginner Friendly',
    category: 'defensive',
    estimatedWeeks: 14,
    estimatedHours: 90,
    beginnerFriendly: true,
    coreSkills: [
      'SIEM Alert Triage & Correlation',
      'Windows Event Logs & Sysmon Analysis',
      'Network Packet Inspection (Wireshark)',
      'MITRE ATT&CK Mapping',
      'Incident Response Containment',
      'Log Querying (KQL / SPL concepts)',
      'Phishing Email Header Analysis'
    ],
    commonTools: [
      'Wireshark',
      'Sysmon',
      'Splunk / Elastic (Concepts)',
      'tcpdump',
      'CyberChef',
      'Sigma Rules',
      'grep / awk'
    ],
    careerOutcomes: [
      { title: 'Tier 1 / Tier 2 SOC Analyst', averageSalary: '$82,000 - $115,000', demand: 'Critical' },
      { title: 'Incident Responder (IR)', averageSalary: '$105,000 - $138,000', demand: 'Very High' },
      { title: 'Detection Engineer', averageSalary: '$120,000 - $155,000', demand: 'High' }
    ],
    labsCount: 14,
    missionsCount: 8,
    curriculumSequence: [
      {
        id: 'soc-mod-0',
        levelRef: 0,
        title: 'Computer & OS Fundamentals',
        shortDescription: 'Understand binary, CPU architectures, kernel vs user space, and process execution.',
        moduleCategory: 'Fundamentals',
        milestoneType: 'FOUNDATION',
        toolsUsed: ['Terminal', 'Task Manager'],
        estimatedHours: 4,
        xpReward: 300
      },
      {
        id: 'soc-mod-1',
        levelRef: 1,
        title: 'Linux CLI & Syslog Foundations',
        shortDescription: 'Master grep, awk, tail, systemctl, /var/log/auth.log, and process triage.',
        moduleCategory: 'Linux Defense',
        milestoneType: 'CORE',
        practicalLabName: 'Linux Triage & Log Inspection',
        toolsUsed: ['grep', 'cat', 'tail', 'journalctl'],
        estimatedHours: 6,
        xpReward: 400
      },
      {
        id: 'soc-mod-2',
        levelRef: 2,
        title: 'Networking & TCP/IP Diagnostic Defense',
        shortDescription: 'OSI 7 Layers, IP addressing, TCP handshakes, ICMP, and port diagnostics.',
        moduleCategory: 'Networking',
        milestoneType: 'CORE',
        practicalLabName: 'Interactive Network Diagnostics Lab',
        toolsUsed: ['ip', 'ss', 'ping', 'traceroute'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'soc-mod-5',
        levelRef: 5,
        title: 'HTTP, DNS & Web Protocols',
        shortDescription: 'Inspect DNS lookup query chains, HTTP response codes, cookies, and TLS handshakes.',
        moduleCategory: 'Web Protocols',
        milestoneType: 'CORE',
        toolsUsed: ['dig', 'curl', 'nslookup'],
        estimatedHours: 5,
        xpReward: 400
      },
      {
        id: 'soc-mod-13',
        levelRef: 13,
        title: 'SOC Telemetry, SIEM & Alert Triage',
        shortDescription: 'Analyze real-time simulated SIEM alert streams, calculate true vs false positives, and isolate hosts.',
        moduleCategory: 'SOC Operations',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'SOC Alert Triage Simulator',
        missionName: 'Suspicious Domain Controller Triage',
        toolsUsed: ['SIEM Console', 'Splunk Concepts', 'CyberChef'],
        estimatedHours: 10,
        xpReward: 700
      },
      {
        id: 'soc-mod-14',
        levelRef: 14,
        title: 'Windows Security & Sysmon Telemetry',
        shortDescription: 'Event IDs 4624/4625 (Logons), 4688 (Process Creation), Sysmon Event 1 & 3 (Network Connections).',
        moduleCategory: 'Windows Defense',
        milestoneType: 'CORE',
        practicalLabName: 'Windows Security & Sysmon Lab',
        toolsUsed: ['Sysmon', 'PowerShell', 'Event Viewer'],
        estimatedHours: 8,
        xpReward: 600
      },
      {
        id: 'soc-mod-17',
        levelRef: 17,
        title: 'MITRE ATT&CK Framework & Threat Hunting',
        shortDescription: 'Map adversary tactics (T1059 Command Shell, T1003 Credential Dumping) and hunt anomalies.',
        moduleCategory: 'Threat Hunting',
        milestoneType: 'MISSION',
        missionName: 'Operation Dark Nebula - SOC Hunt',
        toolsUsed: ['MITRE ATT&CK Matrix', 'Sigma Rules'],
        estimatedHours: 8,
        xpReward: 650
      },
      {
        id: 'soc-mod-18',
        levelRef: 18,
        title: 'Incident Response & Containment Playbooks',
        shortDescription: 'NIST/SANS IR lifecycle: Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned.',
        moduleCategory: 'Incident Response',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Incident Containment & Firewall Rule Execution',
        bossChallengeName: 'Ransomware Outbreak Containment Boss',
        toolsUsed: ['iptables', 'Isolated Range Gateway'],
        estimatedHours: 12,
        xpReward: 800
      },
      {
        id: 'soc-mod-20',
        levelRef: 20,
        title: 'Digital Forensics & Memory Triage',
        shortDescription: 'Triage volatility memory dumps, extract injected DLLs, and analyze prefetch timeline artifacts.',
        moduleCategory: 'DFIR',
        milestoneType: 'ADVANCED',
        practicalLabName: 'Forensics Timeline Reconstruction',
        toolsUsed: ['Volatility Concepts', 'Strings', 'Grep'],
        estimatedHours: 10,
        xpReward: 750
      },
      {
        id: 'soc-mod-21',
        levelRef: 21,
        title: 'Enterprise SOC Capstone & Live Range Incident',
        shortDescription: 'Comprehensive multi-stage enterprise attack investigation from initial phishing vector to domain exfiltration.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Enterprise Cyber Defense Capstone',
        toolsUsed: ['SIEM', 'Wireshark', 'Sysmon', 'Range Terminal'],
        estimatedHours: 15,
        xpReward: 1200
      }
    ],
    capstoneProject: {
      title: 'Operation Sovereign Shield: Enterprise Incident Triage & Defense Report',
      description: 'Ingest 2,000+ multi-source telemetry logs (firewall, web proxies, domain controller event logs, Sysmon). Reconstruct the exact attacker kill chain, identify the patient-zero host, contain infected assets, and author an executive Incident Response report with remediation playbooks.',
      skillsApplied: ['SIEM Correlation', 'Sysmon Triage', 'Network Forensics', 'Executive Reporting', 'Remediation Planning'],
      deliverable: 'Official Incident Investigation Report with IOC table, MITRE ATT&CK mapping, and firewall hardening rules.'
    },
    sampleInterviewQuestions: [
      {
        question: 'Explain the difference between a False Positive and a True Positive in a SOC alert stream.',
        hint: 'Think about whether an actual security threat occurred vs legitimate administrative activity triggering a signature.',
        keyConcepts: ['Alert verification', 'Context gathering', 'Baseline network behavior', 'Tuning detection rules']
      },
      {
        question: 'Which Windows Event IDs are most critical when investigating brute force or lateral movement?',
        hint: 'Consider successful vs failed logon events and process creation.',
        keyConcepts: ['Event ID 4625 (Failed Logon)', 'Event ID 4624 (Successful Logon)', 'Event ID 4672 (Admin Logon)', 'Event ID 4688 (Process Creation)']
      },
      {
        question: 'How would you differentiate standard HTTPS traffic from C2 (Command and Control) beaconing over TLS?',
        hint: 'Look at packet timing jitter, periodicity, packet size variance, and domain reputation.',
        keyConcepts: ['Beaconing intervals', 'TLS JA3 fingerprinting', 'DNS query volume', 'Data exfiltration volume']
      }
    ]
  },
  {
    id: 'ethical-hacker',
    title: 'Ethical Hacker',
    emoji: '🔴',
    badge: 'OFFENSIVE SECURITY',
    tagline: 'Discover, exploit, and remediate security vulnerabilities in authorized simulated environments.',
    shortDescription: 'Master ethical reconnaissance, port scanning with Nmap, web application exploitation (OWASP Top 10), privilege escalation, and professional report writing.',
    fullDescription: 'As an Ethical Hacker, you think like an attacker to strengthen enterprise defenses. You will master authorized reconnaissance, advanced Nmap port scanning and NSE scripting, Web Application penetration testing (Burp Suite, SQLi, XSS, SSRF), Linux & Windows privilege escalation techniques, and standard CVSS vulnerability scoring.',
    difficulty: 'Intermediate',
    category: 'offensive',
    estimatedWeeks: 16,
    estimatedHours: 110,
    beginnerFriendly: true,
    coreSkills: [
      'Network & Host Reconnaissance',
      'Port Scanning & NSE Scripts (Nmap)',
      'Web Application Exploitation (OWASP Top 10)',
      'Burp Suite Proxy Interception & Repeater',
      'Linux Privilege Escalation (SUID / Sudo / Crons)',
      'Vulnerability Assessment & Proof of Concept',
      'Executive & Technical Penetration Testing Reports'
    ],
    commonTools: [
      'Nmap',
      'Burp Suite',
      'Gobuster / Dirb',
      'Nikto',
      'Netcat',
      'Hydra (Concepts)',
      'CyberChef'
    ],
    careerOutcomes: [
      { title: 'Junior Penetration Tester', averageSalary: '$88,000 - $120,000', demand: 'Very High' },
      { title: 'Senior Ethical Hacker / Red Teamer', averageSalary: '$130,000 - $175,000', demand: 'High' },
      { title: 'Offensive Security Consultant', averageSalary: '$115,000 - $160,000', demand: 'High' }
    ],
    labsCount: 16,
    missionsCount: 10,
    curriculumSequence: [
      {
        id: 'pent-mod-0',
        levelRef: 0,
        title: 'Computer & OS Fundamentals',
        shortDescription: 'Computer architecture, CPU registers, filesystems, and memory fundamentals.',
        moduleCategory: 'Fundamentals',
        milestoneType: 'FOUNDATION',
        toolsUsed: ['Terminal'],
        estimatedHours: 4,
        xpReward: 300
      },
      {
        id: 'pent-mod-1',
        levelRef: 1,
        title: 'Linux Shell Mastery for Hackers',
        shortDescription: 'File permissions (chmod, chown), find, grep, SUID bits, bash scripting basics.',
        moduleCategory: 'Linux',
        milestoneType: 'CORE',
        practicalLabName: 'Linux Permissions & SUID Enumeration',
        toolsUsed: ['find', 'grep', 'chmod', 'id'],
        estimatedHours: 6,
        xpReward: 400
      },
      {
        id: 'pent-mod-2',
        levelRef: 2,
        title: 'Networking & TCP/IP Diagnostic Protocols',
        shortDescription: 'TCP 3-way handshake, SYN/ACK flags, UDP, ICMP, and port states (open, filtered, closed).',
        moduleCategory: 'Networking',
        milestoneType: 'CORE',
        practicalLabName: 'Packet Analysis & Protocol Diagnostics',
        toolsUsed: ['ss', 'ip', 'ping', 'traceroute'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'pent-mod-7',
        levelRef: 7,
        title: 'Reconnaissance & Passive OSINT Gathering',
        shortDescription: 'DNS zone transfers, WHOIS lookups, certificate transparency logs, subdomains, and Shodan.',
        moduleCategory: 'Reconnaissance',
        milestoneType: 'CORE',
        practicalLabName: 'Target Recon & OSINT Gathering Lab',
        toolsUsed: ['dig', 'nslookup', 'whois', 'curl'],
        estimatedHours: 6,
        xpReward: 500
      },
      {
        id: 'pent-mod-8',
        levelRef: 8,
        title: 'Nmap Scanning & Service Enumeration',
        shortDescription: 'SYN scans (-sS), version detection (-sV), default scripts (-sC), aggressive (-A), and timing templates.',
        moduleCategory: 'Scanning',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Hands-on Nmap Scanner Range',
        missionName: 'Target Nightfall - Recon & Port Enumeration',
        toolsUsed: ['nmap', 'netcat'],
        estimatedHours: 8,
        xpReward: 600
      },
      {
        id: 'pent-mod-10',
        levelRef: 10,
        title: 'Web Application Security & OWASP Top 10',
        shortDescription: 'SQL Injection (SQLi), Cross-Site Scripting (XSS), IDOR, Command Injection, and Burp Suite.',
        moduleCategory: 'Web App Security',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Web Security Sandbox (SQLi & XSS)',
        missionName: 'VulnBank Web App Audit',
        toolsUsed: ['Burp Suite Concepts', 'curl', 'Gobuster'],
        estimatedHours: 12,
        xpReward: 750
      },
      {
        id: 'pent-mod-11',
        levelRef: 11,
        title: 'Linux Privilege Escalation Tradecraft',
        shortDescription: 'Exploit misconfigured sudo rights (sudo -l), vulnerable SUID binaries, cron jobs, and writable PATH.',
        moduleCategory: 'Privilege Escalation',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Linux PrivEsc SUID Sandbox',
        bossChallengeName: 'Nightfall Root PrivEsc Boss',
        toolsUsed: ['find', 'sudo', 'grep', 'linpeas concepts'],
        estimatedHours: 10,
        xpReward: 800
      },
      {
        id: 'pent-mod-14',
        levelRef: 14,
        title: 'Windows Security & Active Directory Basics',
        shortDescription: 'Kerberos authentication, tickets (TGT/TGS), SAM database, Pass-the-Hash concepts, and Group Policies.',
        moduleCategory: 'Active Directory',
        milestoneType: 'ADVANCED',
        toolsUsed: ['PowerShell', 'Active Directory Concepts'],
        estimatedHours: 10,
        xpReward: 700
      },
      {
        id: 'pent-mod-19',
        levelRef: 19,
        title: 'Vulnerability Reporting & CVSS Scoring',
        shortDescription: 'Structure executive summaries, technical impact statements, reproducible proof-of-concept, and CVSS 3.1 math.',
        moduleCategory: 'Professional Reporting',
        milestoneType: 'CORE',
        toolsUsed: ['CVSS Calculator', 'Markdown Reporter'],
        estimatedHours: 6,
        xpReward: 500
      },
      {
        id: 'pent-mod-21',
        levelRef: 21,
        title: 'Master Cyber Range: Fictional Target Nightfall',
        shortDescription: 'End-to-end black box penetration test against multi-server corporate network topology.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Enterprise Cyber Range Penetration Test',
        toolsUsed: ['Nmap', 'Burp Suite', 'Terminal', 'Range Gateway'],
        estimatedHours: 18,
        xpReward: 1400
      }
    ],
    capstoneProject: {
      title: 'Nightfall Enterprise: Authorized Penetration Testing Assessment & Remediation Report',
      description: 'Perform an authorized penetration test against the simulated Nightfall corporate network. Discover exposed services with Nmap, exploit an OWASP vulnerability in the corporate portal, escalate privileges on the internal Linux host, document the attack chain, and compile an industry-grade penetration test report with CVSS ratings and actionable patch guides.',
      skillsApplied: ['Reconnaissance', 'Nmap Port Scanning', 'OWASP Top 10 Web Exploitation', 'SUID Privilege Escalation', 'Professional Reporting'],
      deliverable: 'Executive Summary, Technical Vulnerability Matrix, Detailed Reproduction Steps, and CVSS Remediation Roadmap.'
    },
    sampleInterviewQuestions: [
      {
        question: 'Walk me through the difference between an Nmap SYN Stealth Scan (-sS) and a TCP Connect Scan (-sT).',
        hint: 'Think about whether the 3-way TCP handshake completes with an ACK or is torn down with an RST packet.',
        keyConcepts: ['TCP 3-way handshake', 'SYN -> SYN/ACK -> RST', 'Raw socket permissions (root/sudo requirement)', 'Firewall logging differences']
      },
      {
        question: 'How does SQL Injection work, and what is the single most effective defense against it?',
        hint: 'Focus on separating untrusted user data from the SQL command structure.',
        keyConcepts: ['Data vs Code separation', 'Parameterized queries / Prepared Statements', 'Input sanitization vs Validation', 'OR 1=1 boolean conditions']
      },
      {
        question: 'What is a SUID binary in Linux, and why can misconfigured SUID binaries lead to privilege escalation?',
        hint: 'SUID allows a program to run with the permissions of the file owner (e.g. root) rather than the executing user.',
        keyConcepts: ['chmod u+s', 'Running with root effective UID', 'GTFOBins escape vectors', 'find / -perm -4000']
      }
    ]
  },
  {
    id: 'pentester',
    title: 'Penetration Tester',
    emoji: '🔴',
    badge: 'OFFENSIVE SECURITY',
    tagline: 'Discover, exploit, and remediate security vulnerabilities in authorized simulated environments.',
    shortDescription: 'Master ethical reconnaissance, port scanning with Nmap, web application exploitation (OWASP Top 10), privilege escalation, and professional report writing.',
    fullDescription: 'As an Ethical Penetration Tester, you think like an attacker to strengthen enterprise defenses. You will learn authorized reconnaissance, advanced Nmap port scanning and NSE scripting, Web Application penetration testing (Burp Suite, SQLi, XSS, SSRF), Linux & Windows privilege escalation techniques, and standard CVSS vulnerability scoring.',
    difficulty: 'Intermediate',
    category: 'offensive',
    estimatedWeeks: 16,
    estimatedHours: 110,
    beginnerFriendly: true,
    coreSkills: [
      'Network & Host Reconnaissance',
      'Port Scanning & NSE Scripts (Nmap)',
      'Web Application Exploitation (OWASP Top 10)',
      'Burp Suite Proxy Interception & Repeater',
      'Linux Privilege Escalation (SUID / Sudo / Crons)',
      'Vulnerability Assessment & Proof of Concept',
      'Executive & Technical Penetration Testing Reports'
    ],
    commonTools: [
      'Nmap',
      'Burp Suite',
      'Gobuster / Dirb',
      'Nikto',
      'Netcat',
      'Hydra (Concepts)',
      'CyberChef'
    ],
    careerOutcomes: [
      { title: 'Junior Penetration Tester', averageSalary: '$88,000 - $120,000', demand: 'Very High' },
      { title: 'Senior Ethical Hacker / Red Teamer', averageSalary: '$130,000 - $175,000', demand: 'High' },
      { title: 'Offensive Security Consultant', averageSalary: '$115,000 - $160,000', demand: 'High' }
    ],
    labsCount: 16,
    missionsCount: 10,
    curriculumSequence: [
      {
        id: 'pent-mod-0',
        levelRef: 0,
        title: 'Computer & OS Fundamentals',
        shortDescription: 'Computer architecture, CPU registers, filesystems, and memory fundamentals.',
        moduleCategory: 'Fundamentals',
        milestoneType: 'FOUNDATION',
        toolsUsed: ['Terminal'],
        estimatedHours: 4,
        xpReward: 300
      },
      {
        id: 'pent-mod-1',
        levelRef: 1,
        title: 'Linux Shell Mastery for Hackers',
        shortDescription: 'File permissions (chmod, chown), find, grep, SUID bits, bash scripting basics.',
        moduleCategory: 'Linux',
        milestoneType: 'CORE',
        practicalLabName: 'Linux Permissions & SUID Enumeration',
        toolsUsed: ['find', 'grep', 'chmod', 'id'],
        estimatedHours: 6,
        xpReward: 400
      },
      {
        id: 'pent-mod-2',
        levelRef: 2,
        title: 'Networking & TCP/IP Diagnostic Protocols',
        shortDescription: 'TCP 3-way handshake, SYN/ACK flags, UDP, ICMP, and port states (open, filtered, closed).',
        moduleCategory: 'Networking',
        milestoneType: 'CORE',
        practicalLabName: 'Packet Analysis & Protocol Diagnostics',
        toolsUsed: ['ss', 'ip', 'ping', 'traceroute'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'pent-mod-7',
        levelRef: 7,
        title: 'Reconnaissance & Passive OSINT Gathering',
        shortDescription: 'DNS zone transfers, WHOIS lookups, certificate transparency logs, subdomains, and Shodan.',
        moduleCategory: 'Reconnaissance',
        milestoneType: 'CORE',
        practicalLabName: 'Target Recon & OSINT Gathering Lab',
        toolsUsed: ['dig', 'nslookup', 'whois', 'curl'],
        estimatedHours: 6,
        xpReward: 500
      },
      {
        id: 'pent-mod-8',
        levelRef: 8,
        title: 'Nmap Scanning & Service Enumeration',
        shortDescription: 'SYN scans (-sS), version detection (-sV), default scripts (-sC), aggressive (-A), and timing templates.',
        moduleCategory: 'Scanning',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Hands-on Nmap Scanner Range',
        missionName: 'Target Nightfall - Recon & Port Enumeration',
        toolsUsed: ['nmap', 'netcat'],
        estimatedHours: 8,
        xpReward: 600
      },
      {
        id: 'pent-mod-10',
        levelRef: 10,
        title: 'Web Application Security & OWASP Top 10',
        shortDescription: 'SQL Injection (SQLi), Cross-Site Scripting (XSS), IDOR, Command Injection, and Burp Suite.',
        moduleCategory: 'Web App Security',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Web Security Sandbox (SQLi & XSS)',
        missionName: 'VulnBank Web App Audit',
        toolsUsed: ['Burp Suite Concepts', 'curl', 'Gobuster'],
        estimatedHours: 12,
        xpReward: 750
      },
      {
        id: 'pent-mod-11',
        levelRef: 11,
        title: 'Linux Privilege Escalation Tradecraft',
        shortDescription: 'Exploit misconfigured sudo rights (sudo -l), vulnerable SUID binaries, cron jobs, and writable PATH.',
        moduleCategory: 'Privilege Escalation',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Linux PrivEsc SUID Sandbox',
        bossChallengeName: 'Nightfall Root PrivEsc Boss',
        toolsUsed: ['find', 'sudo', 'grep', 'linpeas concepts'],
        estimatedHours: 10,
        xpReward: 800
      },
      {
        id: 'pent-mod-14',
        levelRef: 14,
        title: 'Windows Security & Active Directory Basics',
        shortDescription: 'Kerberos authentication, tickets (TGT/TGS), SAM database, Pass-the-Hash concepts, and Group Policies.',
        moduleCategory: 'Active Directory',
        milestoneType: 'ADVANCED',
        toolsUsed: ['PowerShell', 'Active Directory Concepts'],
        estimatedHours: 10,
        xpReward: 700
      },
      {
        id: 'pent-mod-19',
        levelRef: 19,
        title: 'Vulnerability Reporting & CVSS Scoring',
        shortDescription: 'Structure executive summaries, technical impact statements, reproducible proof-of-concept, and CVSS 3.1 math.',
        moduleCategory: 'Professional Reporting',
        milestoneType: 'CORE',
        toolsUsed: ['CVSS Calculator', 'Markdown Reporter'],
        estimatedHours: 6,
        xpReward: 500
      },
      {
        id: 'pent-mod-21',
        levelRef: 21,
        title: 'Master Cyber Range: Fictional Target Nightfall',
        shortDescription: 'End-to-end black box penetration test against multi-server corporate network topology.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Enterprise Cyber Range Penetration Test',
        toolsUsed: ['Nmap', 'Burp Suite', 'Terminal', 'Range Gateway'],
        estimatedHours: 18,
        xpReward: 1400
      }
    ],
    capstoneProject: {
      title: 'Nightfall Enterprise: Authorized Penetration Testing Assessment & Remediation Report',
      description: 'Perform an authorized penetration test against the simulated Nightfall corporate network. Discover exposed services with Nmap, exploit an OWASP vulnerability in the corporate portal, escalate privileges on the internal Linux host, document the attack chain, and compile an industry-grade penetration test report with CVSS ratings and actionable patch guides.',
      skillsApplied: ['Reconnaissance', 'Nmap Port Scanning', 'OWASP Top 10 Web Exploitation', 'SUID Privilege Escalation', 'Professional Reporting'],
      deliverable: 'Executive Summary, Technical Vulnerability Matrix, Detailed Reproduction Steps, and CVSS Remediation Roadmap.'
    },
    sampleInterviewQuestions: [
      {
        question: 'Walk me through the difference between an Nmap SYN Stealth Scan (-sS) and a TCP Connect Scan (-sT).',
        hint: 'Think about whether the 3-way TCP handshake completes with an ACK or is torn down with an RST packet.',
        keyConcepts: ['TCP 3-way handshake', 'SYN -> SYN/ACK -> RST', 'Raw socket permissions (root/sudo requirement)', 'Firewall logging differences']
      },
      {
        question: 'How does SQL Injection work, and what is the single most effective defense against it?',
        hint: 'Focus on separating untrusted user data from the SQL command structure.',
        keyConcepts: ['Data vs Code separation', 'Parameterized queries / Prepared Statements', 'Input sanitization vs Validation', 'OR 1=1 boolean conditions']
      },
      {
        question: 'What is a SUID binary in Linux, and why can misconfigured SUID binaries lead to privilege escalation?',
        hint: 'SUID allows a program to run with the permissions of the file owner (e.g. root) rather than the executing user.',
        keyConcepts: ['chmod u+s', 'Running with root effective UID', 'GTFOBins escape vectors', 'find / -perm -4000']
      }
    ]
  },
  {
    id: 'network-security',
    title: 'Network Security Engineer',
    emoji: '🌐',
    badge: 'NETWORK INFRASTRUCTURE',
    tagline: 'Architect resilient topologies, master subnetting, configure firewalls, and inspect packet flows.',
    shortDescription: 'Master IPv4/IPv6 addressing, VLSM subnetting, routing protocols (BGP/OSPF concepts), firewall rule design, VPNs, and IDS/IPS packet inspection.',
    fullDescription: 'Network Security Engineers build the resilient digital highways that power secure organizations. You will master binary subnetting calculations (/24 through /30), TCP/IP routing tables, DNS and DHCP protocol security, Wireshark deep packet inspection, stateful firewall rules, and network micro-segmentation.',
    difficulty: 'Beginner Friendly',
    category: 'engineering',
    estimatedWeeks: 12,
    estimatedHours: 80,
    beginnerFriendly: true,
    coreSkills: [
      'IPv4 & IPv6 Addressing & VLSM Subnetting',
      'TCP/UDP Protocol & Port Architecture',
      'Routing Tables & Gateway Forwarding',
      'Deep Packet Inspection (Wireshark & tcpdump)',
      'Stateful Firewall & ACL Configuration',
      'DNS, DHCP & ARP Protocol Hardening',
      'VLANs & Network Micro-Segmentation'
    ],
    commonTools: [
      'Wireshark',
      'tcpdump',
      'Subnetting Calculator',
      'ip / route / ss',
      'dig / nslookup',
      'iptables / UFW',
      'Nmap'
    ],
    careerOutcomes: [
      { title: 'Network Security Engineer', averageSalary: '$95,000 - $132,000', demand: 'Very High' },
      { title: 'Network Infrastructure Architect', averageSalary: '$125,000 - $165,000', demand: 'High' },
      { title: 'Firewall / Perimeter Specialist', averageSalary: '$90,000 - $125,000', demand: 'High' }
    ],
    labsCount: 15,
    missionsCount: 6,
    curriculumSequence: [
      {
        id: 'net-mod-2',
        levelRef: 2,
        title: 'Network Protocols & OSI 7-Layer Hierarchy',
        shortDescription: 'Physical up to Application layers, encapsulation, MAC headers, IP headers, and payload boundaries.',
        moduleCategory: 'Networking Basics',
        milestoneType: 'FOUNDATION',
        practicalLabName: 'OSI Diagnostic Protocol Lab',
        toolsUsed: ['ip', 'ss', 'ping'],
        estimatedHours: 5,
        xpReward: 400
      },
      {
        id: 'net-mod-3',
        levelRef: 3,
        title: 'IP Addressing, Classes & MAC Layer Communication',
        shortDescription: 'Public vs Private IP ranges (RFC 1918), ARP table lookups, MAC broadcasts, and default gateways.',
        moduleCategory: 'IP Layer',
        milestoneType: 'CORE',
        practicalLabName: 'ARP & Gateway Inspection Lab',
        toolsUsed: ['ip route', 'arp', 'ping'],
        estimatedHours: 6,
        xpReward: 400
      },
      {
        id: 'net-mod-4',
        levelRef: 4,
        title: 'Subnetting & CIDR Calculation Mastery',
        shortDescription: 'Calculate network IDs, broadcast IPs, usable host ranges, and block sizes across /24, /26, /28, /30.',
        moduleCategory: 'Subnetting',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Interactive Subnetting Simulator & Speed Challenge',
        bossChallengeName: 'Subnetting Math Boss Challenge',
        toolsUsed: ['Subnet Calculator', 'Binary Inspector'],
        estimatedHours: 8,
        xpReward: 550
      },
      {
        id: 'net-mod-5',
        levelRef: 5,
        title: 'DNS, DHCP, HTTP & Core Infrastructure Protocols',
        shortDescription: 'DNS recursive resolution, DHCP DORA handshake, HTTP/HTTPS headers, and TLS certificates.',
        moduleCategory: 'Core Protocols',
        milestoneType: 'CORE',
        practicalLabName: 'DNS Resolution & Query Diagnostics Lab',
        toolsUsed: ['dig', 'nslookup', 'curl'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'net-mod-9',
        levelRef: 9,
        title: 'Wireshark & Packet Capture Diagnostics',
        shortDescription: 'Capture network traffic, apply display filters (tcp.flags.syn==1), follow TCP streams, and spot cleartext credentials.',
        moduleCategory: 'Packet Analysis',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Packet Analysis & Wireshark PCAP Inspector',
        missionName: 'Cleartext Credential PCAP Interception',
        toolsUsed: ['Wireshark', 'tcpdump'],
        estimatedHours: 10,
        xpReward: 700
      },
      {
        id: 'net-mod-18',
        levelRef: 18,
        title: 'Firewalls, NAT & Perimeter Defense Rules',
        shortDescription: 'Stateless vs Stateful firewalls, iptables chains (INPUT, FORWARD, OUTPUT), NAT traversal, and DMZ design.',
        moduleCategory: 'Firewalls',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Firewall ACL Configuration & Port Filtering Lab',
        toolsUsed: ['iptables', 'UFW', 'Routing Simulator'],
        estimatedHours: 10,
        xpReward: 750
      },
      {
        id: 'net-mod-21',
        levelRef: 21,
        title: 'Enterprise Multi-VLAN Topology Capstone',
        shortDescription: 'Design, segment, and secure a multi-department enterprise network with segregated DMZ, SOC, and corporate VLANs.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Network Architecture & Segmentation Capstone',
        toolsUsed: ['3D Network Simulator', 'iptables', 'Wireshark'],
        estimatedHours: 14,
        xpReward: 1200
      }
    ],
    capstoneProject: {
      title: 'Enterprise Zero-Trust Network Architecture & Micro-Segmentation Design',
      description: 'Design and validate a secure corporate network architecture for an organization with 500 employees across 4 departments plus public DMZ. Formulate IP subnet allocations (/24, /27, /28), establish stateful firewall rules denying lateral movement, configure secure DNS resolvers, and verify packet isolation with Wireshark PCAP traces.',
      skillsApplied: ['VLSM Subnetting', 'Firewall ACL Rules', 'VLAN Micro-Segmentation', 'Packet Inspection', 'DMZ Architecture'],
      deliverable: 'Topology Map Diagram, Subnet Allocation Table, IPTables Security Rulebook, and Packet Verification Log.'
    },
    sampleInterviewQuestions: [
      {
        question: 'Given an IP of 172.16.10.75/27, what is the Network Address, Broadcast Address, and number of usable hosts?',
        hint: '/27 has 5 host bits (32 - 27 = 5). Block size is 2^5 = 32.',
        keyConcepts: ['Block size = 32', 'Network: 172.16.10.64', 'Broadcast: 172.16.10.95', '30 usable hosts (172.16.10.65 - .94)']
      },
      {
        question: 'What is the difference between a Stateful and Stateless Firewall?',
        hint: 'Consider how stateful firewalls track the connection state table of TCP handshakes.',
        keyConcepts: ['State tables', 'ESTABLISHED / RELATED packet matching', 'Stateless inspection per packet', 'Connection tracking (conntrack)']
      }
    ]
  },
  {
    id: 'blue-team',
    title: 'Blue Team Analyst',
    emoji: '🔵',
    badge: 'DEFENSE & HARDENING',
    tagline: 'Harden systems, deploy endpoint detection, formulate security baselines, and thwart active attacks.',
    shortDescription: 'Specialize in operating system hardening (CIS benchmarks), EDR agent deployment, vulnerability management, and defensive log telemetry.',
    fullDescription: 'Blue Team Analysts are the architects and defenders who proactively harden systems, audit configurations against CIS baselines, enforce principle of least privilege, establish defensive detection rules (Sigma/YARA), and neutralize adversary intrusion attempts.',
    difficulty: 'Beginner Friendly',
    category: 'defensive',
    estimatedWeeks: 14,
    estimatedHours: 85,
    beginnerFriendly: true,
    coreSkills: [
      'Linux & Windows OS Hardening',
      'CIS Benchmark Configuration Audits',
      'Principle of Least Privilege Enforcement',
      'YARA Rule Authoring',
      'Sigma Detection Engineering',
      'Endpoint Detection & Response (EDR)',
      'Security Patch Management'
    ],
    commonTools: [
      'Lynis',
      'Auditd',
      'Sysmon',
      'YARA',
      'Sigma',
      'iptables',
      'PowerShell'
    ],
    careerOutcomes: [
      { title: 'Blue Team Security Analyst', averageSalary: '$85,000 - $118,000', demand: 'Very High' },
      { title: 'Security Systems Administrator', averageSalary: '$90,000 - $125,000', demand: 'High' },
      { title: 'Vulnerability Management Specialist', averageSalary: '$95,000 - $130,000', demand: 'High' }
    ],
    labsCount: 13,
    missionsCount: 7,
    curriculumSequence: [
      {
        id: 'blue-mod-1',
        levelRef: 1,
        title: 'Linux Security & System Hardening',
        shortDescription: 'Harden SSH (sshd_config), disable root login, manage file permissions, and audit with Lynis.',
        moduleCategory: 'Linux Defense',
        milestoneType: 'CORE',
        practicalLabName: 'Linux System Hardening & Lynis Audit Lab',
        toolsUsed: ['chmod', 'chown', 'sshd_config', 'lynis concepts'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'blue-mod-13',
        levelRef: 13,
        title: 'SOC Log Telemetry & Anomaly Detection',
        shortDescription: 'Configure centralized logging, detect port scans, and configure alert thresholds.',
        moduleCategory: 'Telemetry',
        milestoneType: 'CORE',
        practicalLabName: 'Log Auditing & Syslog Aggregator',
        toolsUsed: ['journalctl', 'rsyslog', 'grep'],
        estimatedHours: 8,
        xpReward: 550
      },
      {
        id: 'blue-mod-14',
        levelRef: 14,
        title: 'Windows Endpoint Hardening & Sysmon Rules',
        shortDescription: 'Disable legacy protocols (SMBv1, NTLMv1), configure AppLocker, and craft SwiftOnSecurity Sysmon configs.',
        moduleCategory: 'Endpoint Security',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Windows Baseline Hardening Lab',
        toolsUsed: ['Sysmon', 'PowerShell', 'Group Policy'],
        estimatedHours: 10,
        xpReward: 700
      },
      {
        id: 'blue-mod-17',
        levelRef: 17,
        title: 'Detection Engineering with Sigma & YARA',
        shortDescription: 'Write YARA rules for malware strings and Sigma rules to detect suspicious cmd.exe / powershell.exe spawning.',
        moduleCategory: 'Detection Engineering',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'YARA & Sigma Rule Authoring Lab',
        toolsUsed: ['YARA', 'Sigma Rules', 'CyberChef'],
        estimatedHours: 10,
        xpReward: 750
      },
      {
        id: 'blue-mod-21',
        levelRef: 21,
        title: 'Enterprise Blue Team Hardening Capstone',
        shortDescription: 'Lock down a vulnerable enterprise environment and withstand an automated simulated red team assault.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Blue Team Defense Fortress Capstone',
        toolsUsed: ['All Defensive Tools', 'Terminal', 'Sysmon'],
        estimatedHours: 16,
        xpReward: 1300
      }
    ],
    capstoneProject: {
      title: 'Enterprise Server Fleet Hardening & Detection Engineering Baseline',
      description: 'Audit and remediate 5 simulated enterprise servers (Web, Database, DNS, Domain Controller, Jumpbox). Close unnecessary ports, enforce CIS Level 2 hardening benchmarks, author 5 custom Sigma detection rules for credential dumping and lateral movement, and verify zero unauthorized access.',
      skillsApplied: ['System Hardening', 'CIS Benchmarks', 'Sigma Rules', 'Least Privilege', 'Log Auditing'],
      deliverable: 'Hardening Verification Audit Checklist, Sigma Detection Rule Pack, and Security Posture Assessment Report.'
    },
    sampleInterviewQuestions: [
      {
        question: 'What are the top 3 configurations you would immediately change in an out-of-the-box Linux SSH server?',
        hint: 'Think about authentication methods, root access, and port exposure.',
        keyConcepts: ['PermitRootLogin no', 'PasswordAuthentication no (Key-based only)', 'Change default port 22 (optional)', 'AllowUsers whitelist']
      }
    ]
  },
  {
    id: 'purple-team',
    title: 'Purple Team Specialist',
    emoji: '🟣',
    badge: 'OFFENSIVE + DEFENSIVE',
    tagline: 'Bridge Red and Blue teams by simulating attacker techniques to validate and sharpen detection engineering.',
    shortDescription: 'Emulate adversary TTPs (MITRE ATT&CK), execute atomic tests, validate SIEM detection coverage, and provide rapid feedback loops.',
    fullDescription: 'Purple Team Specialists act as the catalyst uniting offensive red team tradecraft with defensive blue team detections. You will learn adversary emulation, Atomic Red Team execution, MITRE ATT&CK coverage mapping, detection gap analysis, and collaborative threat remediation.',
    difficulty: 'Advanced',
    category: 'hybrid',
    estimatedWeeks: 16,
    estimatedHours: 100,
    beginnerFriendly: false,
    coreSkills: [
      'Adversary Emulation & TTP Execution',
      'MITRE ATT&CK Coverage & Heatmap Modeling',
      'Atomic Testing (Atomic Red Team Concepts)',
      'SIEM Detection Validation & Gap Analysis',
      'Continuous Security Validation',
      'Collaborative Red/Blue Debriefing'
    ],
    commonTools: [
      'Atomic Red Team (Concepts)',
      'Sysmon',
      'Splunk / SIEM',
      'Nmap',
      'Wireshark',
      'Sigma Rules',
      'PowerShell'
    ],
    careerOutcomes: [
      { title: 'Purple Team Specialist', averageSalary: '$115,000 - $160,000', demand: 'Very High' },
      { title: 'Threat Emulation Engineer', averageSalary: '$125,000 - $170,000', demand: 'High' },
      { title: 'Principal Security Consultant', averageSalary: '$140,000 - $190,000', demand: 'High' }
    ],
    labsCount: 14,
    missionsCount: 8,
    curriculumSequence: [
      {
        id: 'purp-mod-1',
        levelRef: 1,
        title: 'Linux System Internals & Process Execution',
        shortDescription: 'Process execution tree, fork/exec, /proc inspection, and syscall monitoring.',
        moduleCategory: 'Linux Internals',
        milestoneType: 'CORE',
        toolsUsed: ['ps', 'top', 'strace concepts'],
        estimatedHours: 6,
        xpReward: 400
      },
      {
        id: 'purp-mod-8',
        levelRef: 8,
        title: 'Offensive Recon & Telemetry Generation',
        shortDescription: 'Run Nmap port scans while simultaneously capturing the resulting firewall and SIEM alerts.',
        moduleCategory: 'Emulation',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Offensive Scanning vs Defensive Telemetry Lab',
        toolsUsed: ['Nmap', 'Syslog', 'Wireshark'],
        estimatedHours: 8,
        xpReward: 600
      },
      {
        id: 'purp-mod-17',
        levelRef: 17,
        title: 'MITRE ATT&CK Matrix & Threat Emulation',
        shortDescription: 'Emulate T1003 (Credential Dumping) and T1059 (Command Execution), checking if Sysmon Event 1 & 10 trigger correctly.',
        moduleCategory: 'Purple Operations',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'MITRE ATT&CK TTP Emulation & Detection Validation Lab',
        missionName: 'Operation Eclipse - Purple Team Emulation',
        toolsUsed: ['Atomic Concepts', 'Sysmon', 'Sigma'],
        estimatedHours: 12,
        xpReward: 850
      },
      {
        id: 'purp-mod-21',
        levelRef: 21,
        title: 'Purple Team Enterprise Exercise Capstone',
        shortDescription: 'Execute a full-scope simulated attack campaign and author detection engineering rules for every missed TTP.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Purple Team Validation Capstone',
        toolsUsed: ['All Cyber Tools', 'Range Console'],
        estimatedHours: 16,
        xpReward: 1400
      }
    ],
    capstoneProject: {
      title: 'Enterprise MITRE ATT&CK Detection Gap Analysis & Emulation Matrix',
      description: 'Execute 15 distinct adversary techniques across Initial Access, Execution, Persistence, Privilege Escalation, and Defense Evasion. Measure SIEM detection rate, identify logging blindspots, author custom detection rules (Sigma/YARA), and re-test until 100% detection coverage is achieved.',
      skillsApplied: ['Adversary Emulation', 'Detection Engineering', 'MITRE ATT&CK Mapping', 'Gap Analysis', 'SIEM Tuning'],
      deliverable: 'MITRE ATT&CK Coverage Heatmap, Detection Gap Matrix, and Sigma Rule Implementation Package.'
    },
    sampleInterviewQuestions: [
      {
        question: 'How do you convince an engineering team to prioritize telemetry logging over blocking in purple teaming?',
        hint: 'Discuss the value of high-fidelity detection and context before prematurely blocking and causing operational outages.',
        keyConcepts: ['Defense-in-depth', 'Visibility before blocking', 'Tuning false positives', 'Adversary behavior awareness']
      }
    ]
  },
  {
    id: 'dfir-analyst',
    title: 'Digital Forensics / DFIR Analyst',
    emoji: '🔬',
    badge: 'FORENSICS & DFIR',
    tagline: 'Preserve evidence, dissect memory dumps, reconstruct attack timelines, and unearth root causes.',
    shortDescription: 'Master disk forensics, volatile RAM analysis, master file table (MFT) carving, prefetch triage, and legal chain of custody.',
    fullDescription: 'DFIR (Digital Forensics & Incident Response) Analysts act as cyber detectives. You will learn to acquire digital evidence without spoliation, reconstruct precise chronological attack timelines, extract injected malicious processes from RAM dumps with Volatility, and author forensic investigation reports for legal and leadership teams.',
    difficulty: 'Intermediate',
    category: 'forensics',
    estimatedWeeks: 14,
    estimatedHours: 95,
    beginnerFriendly: false,
    coreSkills: [
      'Digital Evidence Handling & Chain of Custody',
      'Volatile Memory (RAM) Forensics',
      'Disk Forensics & Filesystem Carving (MFT/NTFS)',
      'Prefetch, Shimcache & Amcache Execution Artifacts',
      'Chronological Timeline Reconstruction',
      'Malware Indicator Extraction',
      'Forensic Investigation Case Authoring'
    ],
    commonTools: [
      'Volatility (Concepts)',
      'Autopsy (Concepts)',
      'CyberChef',
      'Strings / Grep',
      'FTK Imager (Concepts)',
      'Wireshark',
      'Prefetch Parsers'
    ],
    careerOutcomes: [
      { title: 'DFIR Consultant', averageSalary: '$100,000 - $145,000', demand: 'Very High' },
      { title: 'Digital Forensic Examiner', averageSalary: '$92,000 - $135,000', demand: 'High' },
      { title: 'Senior Incident Response Specialist', averageSalary: '$120,000 - $165,000', demand: 'Critical' }
    ],
    labsCount: 14,
    missionsCount: 8,
    curriculumSequence: [
      {
        id: 'dfir-mod-0',
        levelRef: 0,
        title: 'Filesystem Architecture & Data Representation',
        shortDescription: 'Hexadecimal representation, ASCII, file signatures (magic bytes), and sectors.',
        moduleCategory: 'Data Storage',
        milestoneType: 'FOUNDATION',
        toolsUsed: ['CyberChef', 'Hex Viewer'],
        estimatedHours: 5,
        xpReward: 350
      },
      {
        id: 'dfir-mod-1',
        levelRef: 1,
        title: 'Linux Forensics & Log Artifacts',
        shortDescription: 'Audit /var/log, .bash_history timestamps, inode inspection, and hidden files.',
        moduleCategory: 'Linux Forensics',
        milestoneType: 'CORE',
        practicalLabName: 'Linux Forensic Artifact Carving Lab',
        toolsUsed: ['stat', 'find', 'grep', 'strings'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'dfir-mod-14',
        levelRef: 14,
        title: 'Windows Artifacts: MFT, Prefetch & Registry',
        shortDescription: 'Dissect $MFT records, UserAssist keys, Shellbags, and Prefetch (.pf) program execution traces.',
        moduleCategory: 'Windows Forensics',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Windows Execution Artifacts & Registry Triage',
        missionName: 'Case 104 - Compromised Executive Workstation',
        toolsUsed: ['Registry Explorer Concepts', 'Prefetch Parser'],
        estimatedHours: 10,
        xpReward: 700
      },
      {
        id: 'dfir-mod-20',
        levelRef: 20,
        title: 'Memory Forensics & Volatility Analysis',
        shortDescription: 'Analyze memory images (pslist, malfind, netscan), extract injected payloads, and recover memory-resident passwords.',
        moduleCategory: 'Memory Forensics',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Volatility Memory Dump Investigation Lab',
        bossChallengeName: 'Memory Injected Rootkit Boss Challenge',
        toolsUsed: ['Volatility Concepts', 'Strings', 'CyberChef'],
        estimatedHours: 12,
        xpReward: 850
      },
      {
        id: 'dfir-mod-21',
        levelRef: 21,
        title: 'Enterprise Cyber Crime & Data Breach Forensics Capstone',
        shortDescription: 'Conduct full forensic autopsy of a ransomware deployment across corporate network endpoints.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Forensic Investigation Capstone',
        toolsUsed: ['Investigation Board', 'Volatility', 'PCAP Inspector'],
        estimatedHours: 16,
        xpReward: 1350
      }
    ],
    capstoneProject: {
      title: 'Operation Chronos: Full-Scope Data Breach Forensic Autopsy & Timeline Report',
      description: 'Given raw disk images and memory dumps from an exfiltrated financial database server, conduct evidence imaging, verify SHA-256 hash integrity, reconstruct second-by-second attack chronology from Prefetch and MFT records, extract the C2 IP from RAM, and produce a courtroom-ready Forensic Expert Report.',
      skillsApplied: ['Chain of Custody', 'Memory Forensics', 'MFT Timelines', 'Malware Triage', 'Expert Witness Reporting'],
      deliverable: 'Forensic Autopsy Dossier, Master Event Timeline, Evidence Custody Form, and IOC Indicator List.'
    },
    sampleInterviewQuestions: [
      {
        question: 'What is the order of volatility when collecting digital evidence from a running system?',
        hint: 'Think about what data is lost first if the power is cut.',
        keyConcepts: ['1. CPU registers & cache', '2. Routing table / ARP / RAM', '3. Temporary filesystems', '4. Disk storage', '5. Remote logging / Backups']
      }
    ]
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security Engineer',
    emoji: '☁️',
    badge: 'CLOUD & INFRASTRUCTURE',
    tagline: 'Secure multi-cloud architectures, enforce IAM least privilege, audit containers, and lock down cloud storage.',
    shortDescription: 'Specialize in AWS/Azure/GCP cloud security architectures, IAM permission policies, container isolation (Docker/Kubernetes concepts), and S3 bucket protection.',
    fullDescription: 'Cloud Security Engineers safeguard modern cloud-native architectures. You will master Cloud IAM policies, S3/blob storage permission misconfigurations, container security and Docker socket privilege escalation, serverless security, and automated cloud compliance posture.',
    difficulty: 'Intermediate',
    category: 'engineering',
    estimatedWeeks: 12,
    estimatedHours: 85,
    beginnerFriendly: false,
    coreSkills: [
      'Cloud Identity & Access Management (IAM)',
      'Cloud Storage Bucket & Database Security',
      'Container & Kubernetes Security Concepts',
      'Cloud Security Posture Management (CSPM)',
      'Infrastructure as Code (IaC) Auditing',
      'Cloud Trail & VPC Flow Log Analysis'
    ],
    commonTools: [
      'AWS CLI / Cloud Shell (Concepts)',
      'Docker CLI',
      'TruffleHog (Concepts)',
      'ScoutSuite (Concepts)',
      'CyberChef',
      'curl / APIs'
    ],
    careerOutcomes: [
      { title: 'Cloud Security Engineer', averageSalary: '$110,000 - $155,000', demand: 'Critical' },
      { title: 'DevSecOps Engineer', averageSalary: '$115,000 - $160,000', demand: 'Very High' },
      { title: 'Cloud Infrastructure Architect', averageSalary: '$135,000 - $185,000', demand: 'Very High' }
    ],
    labsCount: 12,
    missionsCount: 6,
    curriculumSequence: [
      {
        id: 'cloud-mod-1',
        levelRef: 1,
        title: 'Linux Containers & Filesystem Isolation',
        shortDescription: 'Namespaces, cgroups, environment variables, API tokens, and container boundaries.',
        moduleCategory: 'Containers',
        milestoneType: 'CORE',
        toolsUsed: ['ps', 'env', 'grep', 'docker concepts'],
        estimatedHours: 6,
        xpReward: 400
      },
      {
        id: 'cloud-mod-5',
        levelRef: 5,
        title: 'REST APIs, Cloud Storage & HTTP Auth',
        shortDescription: 'Bearer tokens, JWT parsing, CORS misconfigurations, and cloud object storage endpoints.',
        moduleCategory: 'Cloud Web',
        milestoneType: 'CORE',
        practicalLabName: 'Cloud API & Token Inspection Lab',
        toolsUsed: ['curl', 'CyberChef'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'cloud-mod-10',
        levelRef: 10,
        title: 'Cloud SSRF & Metadata Service Exploitation',
        shortDescription: 'Server-Side Request Forgery against 169.254.169.254 to steal instance IAM role credentials.',
        moduleCategory: 'Cloud Vulnerabilities',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'SSRF & Cloud Metadata Extraction Sandbox',
        missionName: 'Cloud Leak - Unsecured IAM Bucket',
        toolsUsed: ['curl', 'Burp Suite Concepts'],
        estimatedHours: 10,
        xpReward: 750
      },
      {
        id: 'cloud-mod-21',
        levelRef: 21,
        title: 'Multi-Cloud Architecture Hardening Capstone',
        shortDescription: 'Audit, harden, and secure a multi-tier cloud infrastructure with public ingress and private DBs.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Cloud Infrastructure Capstone',
        toolsUsed: ['Cloud Console', 'IAM Policy Engine'],
        estimatedHours: 14,
        xpReward: 1250
      }
    ],
    capstoneProject: {
      title: 'Cloud Infrastructure Threat Model & Zero-Trust IAM Policy Suite',
      description: 'Audit a simulated multi-tier cloud enterprise with over-privileged IAM roles, an exposed storage bucket containing PII, and an SSRF-vulnerable microservice. Redesign IAM roles to strict least privilege, configure VPC private endpoints, and formulate an automated cloud compliance matrix.',
      skillsApplied: ['Cloud IAM', 'SSRF Remediation', 'VPC Architecture', 'Storage Security', 'Compliance Audits'],
      deliverable: 'Cloud Threat Model Architecture Diagram, Least-Privilege IAM JSON Policies, and S3 Remediation Guide.'
    },
    sampleInterviewQuestions: [
      {
        question: 'What is the Cloud Metadata Service (169.254.169.254), and why is it dangerous if accessible via SSRF?',
        hint: 'Think about how cloud instances retrieve temporary IAM security credentials from the instance metadata service.',
        keyConcepts: ['IMDSv1 vs IMDSv2', 'Temporary STS tokens', 'Instance profiles', 'SSRF exploitation']
      }
    ]
  },
  {
    id: 'security-engineer',
    title: 'Security Engineer',
    emoji: '🧑‍💻',
    badge: 'SECURITY ARCHITECTURE',
    tagline: 'Engineer end-to-end security architectures, integrate DevSecOps pipelines, and build automated defense tooling.',
    shortDescription: 'Design security into software and infrastructure from Day 1. Master cryptography, secure coding, CI/CD pipeline scanning (SAST/DAST), and authentication mechanisms.',
    fullDescription: 'Security Engineers build and automate security solutions across the entire technology stack. You will master cryptographic algorithms (AES/RSA/ECC), OAuth 2.0 / OpenID Connect identity flows, secure software supply chains, automated SAST/DAST code scanning, and zero-trust engineering principles.',
    difficulty: 'Intermediate',
    category: 'engineering',
    estimatedWeeks: 14,
    estimatedHours: 90,
    beginnerFriendly: false,
    coreSkills: [
      'Applied Cryptography & Key Management',
      'OAuth 2.0, OIDC & Identity Engineering',
      'Secure Software Development Lifecycle (SSDLC)',
      'SAST / DAST & Secret Scanning',
      'Zero-Trust Architecture Design',
      'Security Automation & Scripting'
    ],
    commonTools: [
      'OpenSSL',
      'CyberChef',
      'Git',
      'Semgrep (Concepts)',
      'OWASP ZAP (Concepts)',
      'Python / Bash'
    ],
    careerOutcomes: [
      { title: 'Security Engineer (Product / AppSec)', averageSalary: '$115,000 - $160,000', demand: 'Very High' },
      { title: 'DevSecOps Automation Engineer', averageSalary: '$110,000 - $155,000', demand: 'Critical' },
      { title: 'Principal Security Architect', averageSalary: '$145,000 - $200,000', demand: 'High' }
    ],
    labsCount: 13,
    missionsCount: 6,
    curriculumSequence: [
      {
        id: 'sec-mod-0',
        levelRef: 0,
        title: 'Computer Architecture & Cryptographic Primitives',
        shortDescription: 'Symmetric vs Asymmetric cryptography, hashing algorithms (SHA-256), and digital signatures.',
        moduleCategory: 'Cryptography',
        milestoneType: 'FOUNDATION',
        toolsUsed: ['CyberChef', 'OpenSSL Concepts'],
        estimatedHours: 5,
        xpReward: 350
      },
      {
        id: 'sec-mod-5',
        levelRef: 5,
        title: 'Authentication & Session Security',
        shortDescription: 'Session tokens, JWT validation, HTTP-only & Secure cookies, and OAuth 2.0 flows.',
        moduleCategory: 'Identity',
        milestoneType: 'CORE',
        practicalLabName: 'JWT Tampering & Token Verification Lab',
        toolsUsed: ['curl', 'CyberChef'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'sec-mod-10',
        levelRef: 10,
        title: 'Secure Code Review & Vulnerability Remediation',
        shortDescription: 'Identify insecure direct object references (IDOR), SQLi vulnerabilities, and apply parameterized code fixes.',
        moduleCategory: 'AppSec',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Source Code Audit & Remediation Lab',
        toolsUsed: ['Code Reviewer', 'Burp Concepts'],
        estimatedHours: 8,
        xpReward: 600
      },
      {
        id: 'sec-mod-21',
        levelRef: 21,
        title: 'Enterprise DevSecOps & Security Architecture Capstone',
        shortDescription: 'Build an automated pipeline that catches hardcoded secrets, validates dependencies, and generates SBOMs.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Security Engineering Capstone',
        toolsUsed: ['CI/CD Pipeline Simulator', 'OpenSSL'],
        estimatedHours: 15,
        xpReward: 1300
      }
    ],
    capstoneProject: {
      title: 'Zero-Trust Authentication Engine & DevSecOps Automated Pipeline',
      description: 'Architect a complete microservice authentication framework supporting mutual TLS (mTLS) and signed JWT tokens with key rotation. Integrate automated SAST and secret scanning checkpoints that automatically fail non-compliant pull requests before production release.',
      skillsApplied: ['Cryptography', 'JWT Security', 'mTLS', 'DevSecOps Pipelines', 'Architecture Reviews'],
      deliverable: 'System Architecture Blueprint, Cryptographic Key Management Policy, and Automated Security Pipeline Config.'
    },
    sampleInterviewQuestions: [
      {
        question: 'Explain the difference between Symmetric and Asymmetric Encryption, and how TLS uses both during a handshake.',
        hint: 'Asymmetric encryption is used to securely exchange a symmetric session key, which then encrypts the high-speed data stream.',
        keyConcepts: ['Public/Private key pairs', 'AES-256 vs RSA/ECC', 'Diffie-Hellman Key Exchange', 'Computational efficiency']
      }
    ]
  },
  {
    id: 'security-researcher',
    title: 'Security Researcher',
    emoji: '🧪',
    badge: 'VULNERABILITY RESEARCH',
    tagline: 'Uncover zero-day vulnerabilities, analyze malware binaries, reverse engineer protocols, and publish disclosures.',
    shortDescription: 'Dive deep into low-level software vulnerabilities, binary reverse engineering (x86/x64 assembly), fuzzing, and responsible disclosure.',
    fullDescription: 'Security Researchers push the boundaries of cyber knowledge. You will learn to reverse engineer compiled binaries with Ghidra concepts, analyze assembly instructions, understand memory corruption bugs (buffer overflows, format strings), construct fuzzing harnesses, and write responsible vulnerability advisories.',
    difficulty: 'Advanced',
    category: 'offensive',
    estimatedWeeks: 18,
    estimatedHours: 120,
    beginnerFriendly: false,
    coreSkills: [
      'x86 / x64 Assembly Language Fundamentals',
      'Binary Disassembly & Reverse Engineering',
      'Memory Corruption (Stack Overflows, Heap)',
      'Protocol Reverse Engineering',
      'Vulnerability Fuzzing Methodologies',
      'Responsible Vulnerability Disclosure & CVEs'
    ],
    commonTools: [
      'Ghidra (Concepts)',
      'GDB (Concepts)',
      'CyberChef',
      'Strings / Grep',
      'Python',
      'objdump'
    ],
    careerOutcomes: [
      { title: 'Vulnerability Researcher', averageSalary: '$125,000 - $180,000', demand: 'High' },
      { title: 'Malware Analyst', averageSalary: '$110,000 - $160,000', demand: 'High' },
      { title: 'Exploit Developer / Bug Hunter', averageSalary: '$130,000 - $220,000+', demand: 'Very High' }
    ],
    labsCount: 14,
    missionsCount: 8,
    curriculumSequence: [
      {
        id: 'res-mod-0',
        levelRef: 0,
        title: 'Binary Math, CPU Registers & Memory Stack',
        shortDescription: 'Registers (EAX/RAX, ESP/RSP, EIP/RIP), stack frame creation, push/pop, and endianness.',
        moduleCategory: 'Low-Level Fundamentals',
        milestoneType: 'FOUNDATION',
        toolsUsed: ['Binary Inspector', 'CyberChef'],
        estimatedHours: 6,
        xpReward: 400
      },
      {
        id: 'res-mod-1',
        levelRef: 1,
        title: 'Linux Binary Inspection & ELF Header Analysis',
        shortDescription: 'Analyze ELF binary headers, symbol tables, strings, and shared library dependencies.',
        moduleCategory: 'Linux Binaries',
        milestoneType: 'CORE',
        practicalLabName: 'ELF Binary Disassembly & Strings Triage',
        toolsUsed: ['file', 'strings', 'readelf concepts'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'res-mod-15',
        levelRef: 15,
        title: 'Buffer Overflow & Memory Corruption Principles',
        shortDescription: 'Overwriting the Instruction Pointer (EIP), calculating offsets with cyclic patterns, and understanding DEP/ASLR.',
        moduleCategory: 'Exploit Development',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Stack Buffer Overflow Sandbox Lab',
        missionName: 'Dissecting Vulnerable Binary Target',
        toolsUsed: ['GDB Concepts', 'Pattern Generator'],
        estimatedHours: 12,
        xpReward: 900
      },
      {
        id: 'res-mod-21',
        levelRef: 21,
        title: 'Vulnerability Research & Responsible Disclosure Capstone',
        shortDescription: 'Reverse engineer a custom proprietary protocol, discover an unauthenticated vulnerability, and write a formal CVE advisory.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Vulnerability Research Capstone',
        toolsUsed: ['Ghidra Concepts', 'Hex Inspector'],
        estimatedHours: 18,
        xpReward: 1500
      }
    ],
    capstoneProject: {
      title: 'Proprietary Network Daemon Reverse Engineering & Vulnerability Advisory',
      description: 'Reverse engineer a fictional proprietary IoT communication protocol. Map the packet command structure from assembly disassembly, discover a remote buffer overflow vulnerability, build a non-destructive Proof-of-Concept demonstration, and draft a complete Security Advisory with mitigation recommendations.',
      skillsApplied: ['Reverse Engineering', 'Assembly Disassembly', 'Memory Safety Analysis', 'PoC Development', 'Advisory Writing'],
      deliverable: 'Protocol Specification Document, Disassembly Flowchart, Working PoC Script, and Vendor Advisory.'
    },
    sampleInterviewQuestions: [
      {
        question: 'What happens on the CPU call stack when a function is invoked, and how does a stack overflow hijack execution?',
        hint: 'Consider the return address saved on the stack before entering the function.',
        keyConcepts: ['Stack frame', 'Saved EIP / Return Address', 'Buffer boundary violation', 'Instruction Pointer redirection']
      }
    ]
  },
  {
    id: 'web-security',
    title: 'Web Application Security Specialist',
    emoji: '🌐',
    badge: 'APPSEC & OWASP',
    tagline: 'Hunt, exploit, and remediate vulnerabilities across modern web apps, APIs, and microservices.',
    shortDescription: 'Master the OWASP Top 10: SQL Injection, XSS, SSRF, CSRF, IDOR, Broken Authentication, and API security testing.',
    fullDescription: 'Web Application Security Specialists protect the modern internet. You will learn hands-on exploitation and defense of the OWASP Top 10 vulnerabilities, master Burp Suite proxy interception and repeater, dissect GraphQL and REST API endpoints, and secure modern single-page applications.',
    difficulty: 'Beginner Friendly',
    category: 'offensive',
    estimatedWeeks: 12,
    estimatedHours: 80,
    beginnerFriendly: true,
    coreSkills: [
      'OWASP Top 10 Vulnerability Assessment',
      'SQL Injection (Union, Blind, Time-based)',
      'Cross-Site Scripting (Reflected, Stored, DOM)',
      'Server-Side Request Forgery (SSRF)',
      'Insecure Direct Object References (IDOR)',
      'Burp Suite Proxy & Interception Workflows',
      'REST & GraphQL API Security Auditing'
    ],
    commonTools: [
      'Burp Suite',
      'Gobuster',
      'Nikto',
      'CyberChef',
      'curl',
      'Browser DevTools'
    ],
    careerOutcomes: [
      { title: 'Web App Penetration Tester', averageSalary: '$95,000 - $135,000', demand: 'Very High' },
      { title: 'Application Security (AppSec) Engineer', averageSalary: '$110,000 - $155,000', demand: 'Critical' },
      { title: 'Bug Bounty Hunter', averageSalary: 'Variable ($50k - $250k+)', demand: 'Very High' }
    ],
    labsCount: 15,
    missionsCount: 8,
    curriculumSequence: [
      {
        id: 'web-mod-5',
        levelRef: 5,
        title: 'HTTP Protocol, Headers & Web Architecture',
        shortDescription: 'HTTP methods (GET, POST, PUT, DELETE), status codes (200, 302, 403, 500), cookies, and headers.',
        moduleCategory: 'HTTP Fundamentals',
        milestoneType: 'FOUNDATION',
        toolsUsed: ['curl', 'Browser DevTools'],
        estimatedHours: 5,
        xpReward: 400
      },
      {
        id: 'web-mod-10',
        levelRef: 10,
        title: 'OWASP Top 10: Injection & Broken Access Control',
        shortDescription: 'Hands-on exploitation of SQLi, Stored/Reflected XSS, and IDOR parameter tampering.',
        moduleCategory: 'OWASP Top 10',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'OWASP Top 10 Interactive Exploitation Range',
        missionName: 'VulnBank E-Commerce Audit Mission',
        toolsUsed: ['Burp Suite Concepts', 'curl'],
        estimatedHours: 12,
        xpReward: 800
      },
      {
        id: 'web-mod-12',
        levelRef: 12,
        title: 'API Security: REST, GraphQL & Broken Object Level Authorization (BOLA)',
        shortDescription: 'Audit API endpoints, bypass object-level access controls, and test rate limiting.',
        moduleCategory: 'API Security',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'REST & GraphQL API Security Lab',
        toolsUsed: ['curl', 'Burp Suite Concepts'],
        estimatedHours: 8,
        xpReward: 650
      },
      {
        id: 'web-mod-21',
        levelRef: 21,
        title: 'Full-Scope Web Application Penetration Test Capstone',
        shortDescription: 'Comprehensive black-box web penetration assessment across an enterprise SaaS portal.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Web App Penetration Test Capstone',
        toolsUsed: ['Burp Suite', 'curl', 'Gobuster'],
        estimatedHours: 16,
        xpReward: 1350
      }
    ],
    capstoneProject: {
      title: 'SaaS Enterprise Portal Web Application Security Assessment & Remediation Suite',
      description: 'Conduct a comprehensive authorized penetration test of a multi-tenant enterprise SaaS platform. Discover 4 distinct OWASP Top 10 vulnerabilities (IDOR leading to cross-tenant data leak, Stored XSS in comment engine, and SQLi in reporting filter), document complete reproduction steps, and author patch pull requests.',
      skillsApplied: ['Burp Suite', 'OWASP Top 10', 'API Security', 'BOLA / IDOR Exploitation', 'Remediation Guides'],
      deliverable: 'Web Application Security Audit Report, Burp Request/Response Proofs, and Code Fix Patches.'
    },
    sampleInterviewQuestions: [
      {
        question: 'Explain the difference between Stored XSS, Reflected XSS, and DOM-based XSS.',
        hint: 'Consider where the malicious payload is stored vs reflected immediately vs executed purely on the client-side JavaScript DOM.',
        keyConcepts: ['Database persistence (Stored)', 'URL parameter reflection (Reflected)', 'Client-side sink/source (DOM)', 'Content Security Policy (CSP)']
      }
    ]
  },
  {
    id: 'threat-hunter',
    title: 'Threat Hunter',
    emoji: '🕵️',
    badge: 'PROACTIVE THREAT HUNTING',
    tagline: 'Proactively search through enterprise data to uncover hidden attackers that evaded automated alerts.',
    shortDescription: 'Formulate threat hypotheses, query large-scale telemetry data, identify advanced persistent threat (APT) techniques, and create new detection rules.',
    fullDescription: 'Threat Hunters operate on the assumption that attackers are already inside the network. Rather than waiting for alerts, you will formulate threat hypotheses based on cyber threat intelligence (CTI), run behavioral baseline queries across event logs, unearth stealthy living-off-the-land (LotL) binaries, and turn findings into permanent detections.',
    difficulty: 'Advanced',
    category: 'defensive',
    estimatedWeeks: 14,
    estimatedHours: 95,
    beginnerFriendly: false,
    coreSkills: [
      'Hypothesis-Driven Threat Hunting',
      'Living-off-the-Land (LOLBins) Detection',
      'Advanced Log Querying (SPL / KQL / SQL concepts)',
      'Baseline Behavioral Profiling',
      'Threat Intelligence (CTI) Ingestion',
      'Adversary Persistence Mechanism Hunting'
    ],
    commonTools: [
      'Sysmon',
      'Splunk / Elastic (Concepts)',
      'CyberChef',
      'PowerShell',
      'YARA',
      'Sigma'
    ],
    careerOutcomes: [
      { title: 'Senior Threat Hunter', averageSalary: '$118,000 - $165,000', demand: 'Very High' },
      { title: 'Cyber Threat Intelligence (CTI) Analyst', averageSalary: '$105,000 - $150,000', demand: 'High' },
      { title: 'Principal Detection Strategist', averageSalary: '$135,000 - $185,000', demand: 'High' }
    ],
    labsCount: 13,
    missionsCount: 8,
    curriculumSequence: [
      {
        id: 'hunt-mod-1',
        levelRef: 1,
        title: 'Process Triage & Hidden Execution',
        shortDescription: 'Parent-child process relationships, unusual process directories (/tmp, /dev/shm), and unlinked binaries.',
        moduleCategory: 'Linux Hunting',
        milestoneType: 'CORE',
        toolsUsed: ['ps', 'lsof', 'grep'],
        estimatedHours: 6,
        xpReward: 450
      },
      {
        id: 'hunt-mod-14',
        levelRef: 14,
        title: 'LOLBins & PowerShell Threat Hunting',
        shortDescription: 'Hunt certutil, bitsadmin, mshta, and encoded PowerShell execution (-enc) in Sysmon logs.',
        moduleCategory: 'Living off the Land',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'LOLBins & Encoded PowerShell Hunting Lab',
        missionName: 'Operation Ghost - APT Infiltration Hunt',
        toolsUsed: ['Sysmon', 'PowerShell Parser', 'CyberChef'],
        estimatedHours: 10,
        xpReward: 750
      },
      {
        id: 'hunt-mod-17',
        levelRef: 17,
        title: 'Hypothesis-Driven Threat Hunting Campaigns',
        shortDescription: 'Formulate hypotheses from CTI reports, execute dataset queries, and isolate anomalous outliers.',
        moduleCategory: 'Hunting Campaigns',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Interactive Threat Hunting Sandbox',
        bossChallengeName: 'Master Threat Hunt Boss Scenario',
        toolsUsed: ['Threat Hunting Engine', 'MITRE ATT&CK Matrix'],
        estimatedHours: 12,
        xpReward: 850
      },
      {
        id: 'hunt-mod-21',
        levelRef: 21,
        title: 'Enterprise APT Threat Hunting Campaign Capstone',
        shortDescription: 'Hunt down an evasive nation-state threat group that bypassed all signature-based anti-virus and EDR alerts.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master Threat Hunting Campaign Capstone',
        toolsUsed: ['Hunting Sandbox', 'Sysmon', 'Sigma'],
        estimatedHours: 16,
        xpReward: 1400
      }
    ],
    capstoneProject: {
      title: 'Operation Phantom Strike: Enterprise Threat Hunting Campaign & Sigma Rule Pack',
      description: 'Ingest 30 days of simulated endpoint telemetry across 250 enterprise hosts. Formulate 3 distinct threat hypotheses targeting persistence (Scheduled Tasks, Run keys, WMI Event Subscriptions). Unearth 2 stealthy APT implants living off the land, trace the initial access vector, and publish 5 new Sigma detection rules.',
      skillsApplied: ['Hypothesis Generation', 'LOLBins Detection', 'WMI Persistence Hunting', 'Sigma Rule Writing', 'CTI Ingestion'],
      deliverable: 'Threat Hunting Campaign Briefing, Threat Actor TTP Mapping, and Production-Ready Sigma Rule Pack.'
    },
    sampleInterviewQuestions: [
      {
        question: 'What is a "Living off the Land" (LotL) binary, and why do sophisticated threat actors prefer them?',
        hint: 'LotL binaries are legitimate, pre-installed administrative tools (like certutil or powershell) that blend in with normal system traffic.',
        keyConcepts: ['LOLBins / LOLBAS', 'Evasion of signature AV', 'Blending with admin activity', 'Command-line parameter auditing']
      }
    ]
  },
  {
    id: 'ctf-competitor',
    title: 'CTF / Security Competition Track',
    emoji: '🏆',
    badge: 'SECURITY COMPETITIONS',
    tagline: 'Master rapid problem solving across Web, Cryptography, Forensics, Reverse Engineering, and Linux challenges.',
    shortDescription: 'Sharpen your technical reflexes for Capture The Flag competitions. Solve hands-on flags, decipher ciphers, analyze PCAPs, and exploit web vulnerabilities.',
    fullDescription: 'The CTF Competition Track trains you for high-speed security problem solving. You will master flag recovery methodologies across Cryptography, Steganography, Web Exploitation, Linux privilege escalation, Network Packet Analysis, and Reverse Engineering in authentic competitive environments.',
    difficulty: 'Beginner Friendly',
    category: 'hybrid',
    estimatedWeeks: 12,
    estimatedHours: 75,
    beginnerFriendly: true,
    coreSkills: [
      'Rapid Vulnerability Identification',
      'Classical & Modern Cryptography Decoding',
      'Steganography & Metadata Extraction',
      'PCAP Packet Triage for Hidden Flags',
      'Source Code Deobfuscation',
      'Command-Line Speed & Scripting'
    ],
    commonTools: [
      'CyberChef',
      'Wireshark',
      'Strings / Grep / Base64',
      'Steghide / Exiftool (Concepts)',
      'Burp Suite',
      'Python'
    ],
    careerOutcomes: [
      { title: 'Competitive CTF Player / Team Lead', averageSalary: 'Tournament Prizes & Prestige', demand: 'High' },
      { title: 'Security Consultant (Offensive/Defensive)', averageSalary: '$95,000 - $140,000', demand: 'Very High' },
      { title: 'Cyber Defense Competition Specialist', averageSalary: '$90,000 - $130,000', demand: 'High' }
    ],
    labsCount: 16,
    missionsCount: 10,
    curriculumSequence: [
      {
        id: 'ctf-mod-0',
        levelRef: 0,
        title: 'CTF Fundamentals, Encoding & Ciphers',
        shortDescription: 'Base64, Hex, URL encoding, Caesar ciphers, XOR logic, and flag format structures.',
        moduleCategory: 'CTF Fundamentals',
        milestoneType: 'FOUNDATION',
        practicalLabName: 'Cipher & Encoding Decoding Lab',
        toolsUsed: ['CyberChef', 'base64', 'tr'],
        estimatedHours: 5,
        xpReward: 350
      },
      {
        id: 'ctf-mod-1',
        levelRef: 1,
        title: 'Linux OverTheWire / Bandit Style Challenges',
        shortDescription: 'Solve file navigation riddles, find hidden flags in compressed archives, and pipe through rot13.',
        moduleCategory: 'Linux CTF',
        milestoneType: 'CORE',
        practicalLabName: 'Linux Shell CTF Gauntlet (10 Flags)',
        toolsUsed: ['find', 'grep', 'tar', 'gzip', 'strings'],
        estimatedHours: 8,
        xpReward: 550
      },
      {
        id: 'ctf-mod-9',
        levelRef: 9,
        title: 'Network Forensics & PCAP Flag Recovery',
        shortDescription: 'Extract hidden flags from HTTP POST requests, FTP transfers, and DNS exfiltration PCAPs.',
        moduleCategory: 'Network CTF',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'PCAP Flag Extraction Challenge',
        toolsUsed: ['Wireshark', 'tcpdump', 'CyberChef'],
        estimatedHours: 8,
        xpReward: 600
      },
      {
        id: 'ctf-mod-10',
        levelRef: 10,
        title: 'Web Exploitation CTF Challenges',
        shortDescription: 'Bypass cookie validations, crack JWT signatures, and exploit source code comments.',
        moduleCategory: 'Web CTF',
        milestoneType: 'PRACTICAL_LAB',
        practicalLabName: 'Web CTF Challenge Arena',
        toolsUsed: ['Burp Suite Concepts', 'curl', 'CyberChef'],
        estimatedHours: 10,
        xpReward: 700
      },
      {
        id: 'ctf-mod-21',
        levelRef: 21,
        title: 'Ultimate 24-Hour Master CTF Arena',
        shortDescription: 'Compete in a multi-category 20-flag competitive arena spanning Linux, Crypto, Web, and Forensics.',
        moduleCategory: 'Capstone',
        milestoneType: 'CAPSTONE',
        bossChallengeName: 'Master CTF Arena Championship',
        toolsUsed: ['All Tools', 'CTF Console'],
        estimatedHours: 14,
        xpReward: 1500
      }
    ],
    capstoneProject: {
      title: 'My Cyber Lab CTF Arena Championship: 20-Flag Multi-Discipline Victory',
      description: 'Successfully solve and document writeups for 20 rigorous CTF challenges across 5 categories (Linux CLI, Network Packet Forensics, Cryptographic Ciphers, Web App Exploitation, and Reverse Engineering). Compile clean, reproducible writeups demonstrating methodology and proof-of-work.',
      skillsApplied: ['Rapid Triage', 'Cryptanalysis', 'PCAP Carving', 'Web Exploitation', 'Technical Writeup Authoring'],
      deliverable: 'Complete CTF Championship Writeup Dossier with flag verification tokens and methodology explanations.'
    },
    sampleInterviewQuestions: [
      {
        question: 'When analyzing an unknown ciphertext string ending in "==" or "=", what is your immediate hypothesis?',
        hint: 'Base64 uses "=" for byte padding when data length is not divisible by 3.',
        keyConcepts: ['Base64 padding', 'Character set A-Z, a-z, 0-9, +, /', 'Decoding pipelines', 'CyberChef magic recipe']
      }
    ]
  }
];

export const getCareerRoleById = (id?: string): CareerRole => {
  if (!id) return CAREER_ROLES_DATA[0]; // Default to SOC Analyst
  const found = CAREER_ROLES_DATA.find(r => r.id === id);
  return found || CAREER_ROLES_DATA[0];
};
