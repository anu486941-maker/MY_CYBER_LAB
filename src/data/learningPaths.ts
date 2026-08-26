import { LearningPath } from '../types';

export const LEARNING_PATHS_DATA: LearningPath[] = [
  {
    id: 'path-pre-security',
    title: 'Pre-Security',
    badge: 'PRE-SEC',
    description: 'Learn the essential pre-requisite technical knowledge required before diving into cybersecurity. Master computer basics, Linux, networking, and the web.',
    difficulty: 'Pre-Security',
    estimatedHours: 40,
    totalModules: 5,
    completedModules: 3,
    icon: 'Shield',
    color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-400',
    modules: [
      {
        id: 'ps-1',
        title: 'Introduction to Cyber Security',
        description: 'Understand the defensive and offensive landscape, offensive mindset, and white-hat principles.',
        levelRef: 0,
        lessonsCount: 4,
        xp: 300,
        completed: true
      },
      {
        id: 'ps-2',
        title: 'Network Fundamentals',
        description: 'OSI 7 Layers, IP addressing, MAC addresses, packets, TCP vs UDP, and LAN routing.',
        levelRef: 2,
        lessonsCount: 4,
        xp: 350,
        completed: true
      },
      {
        id: 'ps-3',
        title: 'How the Web Works',
        description: 'DNS lookup flow, HTTP request/response headers, status codes, cookies, and TLS/HTTPS.',
        levelRef: 5,
        lessonsCount: 4,
        xp: 400,
        completed: true
      },
      {
        id: 'ps-4',
        title: 'Linux Fundamentals',
        description: 'File navigation, permissions, piping, process management, and shell environments.',
        levelRef: 1,
        lessonsCount: 4,
        xp: 350,
        completed: false
      },
      {
        id: 'ps-5',
        title: 'Windows Fundamentals',
        description: 'NTFS permissions, Registry, Task Manager, Command Prompt, and PowerShell triage.',
        levelRef: 14,
        lessonsCount: 4,
        xp: 400,
        completed: false
      }
    ]
  },
  {
    id: 'path-complete-beginner',
    title: 'Complete Beginner',
    badge: 'BEGINNER',
    description: 'The premier hands-on journey from zero knowledge to confident ethical hacker. Covers core offensive tools, Linux, web app vulnerabilities, and network security.',
    difficulty: 'Beginner',
    estimatedHours: 72,
    totalModules: 6,
    completedModules: 2,
    icon: 'Terminal',
    color: 'from-cyan-500/20 to-emerald-500/20 border-emerald-500/40 text-emerald-400',
    modules: [
      {
        id: 'cb-1',
        title: 'Linux Shell Mastery & CLI Tools',
        description: 'Deep dive into grep, awk, sed, find, curl, wget, and secure remote shells with SSH.',
        levelRef: 1,
        lessonsCount: 4,
        xp: 400,
        completed: true
      },
      {
        id: 'cb-2',
        title: 'Subnetting & Network Diagnostics',
        description: 'Calculate subnets, CIDR blocks, usable hosts, and diagnose routing tables.',
        levelRef: 4,
        lessonsCount: 4,
        xp: 450,
        completed: true
      },
      {
        id: 'cb-3',
        title: 'Reconnaissance & OSINT',
        description: 'Information gathering, DNS enumeration, Shodan, WHOIS, and passive discovery.',
        levelRef: 7,
        lessonsCount: 5,
        xp: 500,
        completed: false
      },
      {
        id: 'cb-4',
        title: 'Nmap Scanning & Enumeration',
        description: 'Port scanning techniques, service version detection, NSE scripts, and firewall evasion.',
        levelRef: 8,
        lessonsCount: 4,
        xp: 500,
        completed: false
      },
      {
        id: 'cb-5',
        title: 'Web Application Security Basics',
        description: 'Hands-on SQL injection, cross-site scripting (XSS), and authentication bypass.',
        levelRef: 10,
        lessonsCount: 6,
        xp: 600,
        completed: false
      },
      {
        id: 'cb-6',
        title: 'Basic Cryptography & Hash Cracking',
        description: 'Symmetric vs asymmetric encryption, MD5/SHA256 hashes, and John the Ripper / Hashcat.',
        levelRef: 19,
        lessonsCount: 5,
        xp: 550,
        completed: false
      }
    ]
  },
  {
    id: 'path-cyber-defense',
    title: 'Cyber Defense / SOC Level 1',
    badge: 'DEFENSE',
    description: 'Train as a Blue Team Security Operations Center (SOC) Analyst. Detect intrusions, analyze network PCAPs with Wireshark, triage SIEM alerts, and respond to threats.',
    difficulty: 'Intermediate',
    estimatedHours: 85,
    totalModules: 5,
    completedModules: 1,
    icon: 'ShieldAlert',
    color: 'from-blue-600/20 to-indigo-600/20 border-indigo-500/40 text-indigo-400',
    modules: [
      {
        id: 'cd-1',
        title: 'Traffic & Packet Analysis (Wireshark & tcpdump)',
        description: 'Dissect live packets, detect ARP spoofing, cleartext credential leaks, and TCP anomalies.',
        levelRef: 9,
        lessonsCount: 4,
        xp: 500,
        completed: true
      },
      {
        id: 'cd-2',
        title: 'SOC Alert Triage & Incident Handling',
        description: 'Triage live alerts, distinguish true vs false positives, and isolate compromised hosts.',
        levelRef: 18,
        lessonsCount: 5,
        xp: 650,
        completed: false
      },
      {
        id: 'cd-3',
        title: 'SIEM Architecture & Sigma Rules',
        description: 'Correlate logs across Windows Event Logs, Sysmon, Linux auditd, and web servers.',
        levelRef: 18,
        lessonsCount: 5,
        xp: 700,
        completed: false
      },
      {
        id: 'cd-4',
        title: 'Digital Forensics & Memory Analysis',
        description: 'Analyze memory dumps with Volatility, recover deleted data, and build forensic timelines.',
        levelRef: 17,
        lessonsCount: 4,
        xp: 650,
        completed: false
      },
      {
        id: 'cd-5',
        title: 'Threat Hunting with MITRE ATT&CK',
        description: 'Map adversary tactics, detect lateral movement, and hunt for persistent implants.',
        levelRef: 18,
        lessonsCount: 5,
        xp: 750,
        completed: false
      }
    ]
  },
  {
    id: 'path-jr-pentester',
    title: 'Junior Penetration Tester',
    badge: 'PENTEST',
    description: 'Learn the practical penetration testing methodologies used by professional security consultancies. Master Burp Suite, Metasploit, Linux & Windows PrivEsc.',
    difficulty: 'Intermediate',
    estimatedHours: 90,
    totalModules: 5,
    completedModules: 0,
    icon: 'Crosshair',
    color: 'from-red-500/20 to-amber-500/20 border-red-500/40 text-red-400',
    modules: [
      {
        id: 'jp-1',
        title: 'Penetration Testing Methodologies & Scoping',
        description: 'PTES, Rules of Engagement, scope boundaries, legal compliance, and report writing.',
        levelRef: 12,
        lessonsCount: 3,
        xp: 450,
        completed: false
      },
      {
        id: 'jp-2',
        title: 'Burp Suite Pro & Web Exploitation',
        description: 'Intercepting requests, Repeater fuzzing, Intruder dictionary attacks, and SSRF/IDOR.',
        levelRef: 11,
        lessonsCount: 4,
        xp: 550,
        completed: false
      },
      {
        id: 'jp-3',
        title: 'Linux Privilege Escalation',
        description: 'SUID exploitation, sudo -l misconfigurations, cron job hijacking, and LinPEAS automation.',
        levelRef: 13,
        lessonsCount: 5,
        xp: 650,
        completed: false
      },
      {
        id: 'jp-4',
        title: 'Windows Privilege Escalation',
        description: 'Unquoted service paths, token impersonation (SeImpersonate), and registry exploits.',
        levelRef: 15,
        lessonsCount: 5,
        xp: 700,
        completed: false
      },
      {
        id: 'jp-5',
        title: 'Cyber Range Machine Exploitation',
        description: 'End-to-end compromise of vulnerable target machines: NIGHTFALL & BLUEHORIZON.',
        levelRef: 20,
        lessonsCount: 6,
        xp: 900,
        completed: false
      }
    ]
  },
  {
    id: 'path-red-teaming',
    title: 'Active Directory & Red Teaming',
    badge: 'RED-TEAM',
    description: 'Enterprise adversary simulation. Attack Windows Active Directory domains, exploit Kerberos protocols, perform DCSync, and bypass defenses.',
    difficulty: 'Advanced',
    estimatedHours: 110,
    totalModules: 4,
    completedModules: 0,
    icon: 'Cpu',
    color: 'from-purple-600/20 to-pink-600/20 border-purple-500/40 text-purple-400',
    modules: [
      {
        id: 'rt-1',
        title: 'Active Directory Architecture & Kerberos',
        description: 'Domain Controllers, Forests, Trees, OUs, GPOs, TGT/TGS tickets, and SPNs.',
        levelRef: 16,
        lessonsCount: 6,
        xp: 800,
        completed: false
      },
      {
        id: 'rt-2',
        title: 'Kerberoasting & AS-REP Roasting',
        description: 'Extract service account tickets offline and crack them with Hashcat.',
        levelRef: 16,
        lessonsCount: 6,
        xp: 850,
        completed: false
      },
      {
        id: 'rt-3',
        title: 'BloodHound Graph Analysis & Lateral Movement',
        description: 'Map domain trust relationships, shortest paths to Domain Admin, and Pass-the-Hash.',
        levelRef: 16,
        lessonsCount: 6,
        xp: 900,
        completed: false
      },
      {
        id: 'rt-4',
        title: 'Final Enterprise Cyber Range Capstone',
        description: 'Compromise an entire corporate multi-tier network and produce an executive audit report.',
        levelRef: 21,
        lessonsCount: 3,
        xp: 1200,
        completed: false
      }
    ]
  }
];
