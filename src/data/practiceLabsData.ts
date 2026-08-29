export interface PracticeLab {
  id: string;
  category: 
    | 'NETWORK SECURITY'
    | 'LINUX SECURITY'
    | 'WEB SECURITY'
    | 'API SECURITY'
    | 'ACTIVE DIRECTORY'
    | 'CLOUD SECURITY'
    | 'SOC / DETECTION'
    | 'DIGITAL FORENSICS'
    | 'INCIDENT RESPONSE'
    | 'PRIVILEGE ESCALATION'
    | 'OSINT'
    | 'CRYPTOGRAPHY'
    | 'WIRELESS SECURITY'
    | 'THREAT HUNTING'
    | 'PYTHON SECURITY AUTOMATION'
    | 'SECURITY FUNDAMENTALS';
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Advanced';
  estimatedTime: string;
  xpReward: number;
  objective: string;
  scenario: string;
  conceptExplanation?: string;
  demonstration?: string;
  careerRelevance?: string;
  prerequisites?: string[];
  skillsTrained?: string[];
  whatYouWillAccomplish?: string[];
  rulesOfEngagement: string;
  ethicalScopeNotice?: string;
  targetEnvironment: {
    hostName: string;
    ipAddress: string;
    subnet: string;
    services: string[];
  };
  knownInformation: string[];
  unknownInformation: string[];
  startingPoint: string;
  availableTools: string[];
  tasks: {
    id: string;
    description: string;
    verificationType: 'terminal' | 'flag' | 'evidence';
    expectedValue: string;
    isCompleted?: boolean;
    mitreTechnique: string;
    explanation?: string;
  }[];
  hints: {
    level: number;
    title: string;
    text: string;
    xpPenalty: number;
    hintType?: 'Conceptual' | 'Directional' | 'Command' | 'Detailed' | 'Walkthrough';
  }[];
  mitreTechniques: string[];
  debrief?: {
    whatYouLearned: string[];
    skillsImproved: string[];
    conceptsUsed: string[];
    realWorldApplication: string;
    defensivePerspective: string;
    nextRecommendedStep: string;
    nextRoute: string;
  };
}

export const PRACTICE_LABS_HUB_DATA: PracticeLab[] = [
  {
    id: 'lab-net-01',
    category: 'NETWORK SECURITY',
    title: 'Stealth Port Scanning & Firewall Evasion',
    difficulty: 'Intermediate',
    estimatedTime: '25 mins',
    xpReward: 300,
    objective: 'Map hidden network ports behind a stateful firewall using SYN scanning and fragmentation.',
    scenario: 'A target gateway at 10.10.20.25 is filtering standard TCP connect probes. Map open ports without triggering threshold alerts.',
    targetEnvironment: {
      hostName: 'FW-SIM-GATEWAY-01',
      ipAddress: '10.10.20.25',
      subnet: '10.10.20.0/24',
      services: ['TCP/22 (SSH)', 'TCP/80 (HTTP)', 'TCP/8080 (Proxy)']
    },
    knownInformation: [
      'Target IP is 10.10.20.25',
      'Port 80 HTTP is publicly reachable'
    ],
    unknownInformation: [
      'Internal management ports',
      'Filtered UDP listeners',
      'Host OS version'
    ],
    rulesOfEngagement: 'Authorized scan within 10.10.20.0/24 subnet. Do not exceed 100 packets/sec.',
    startingPoint: 'Execute nmap port scan from student terminal.',
    availableTools: ['nmap', 'curl', 'dig', 'ss', 'nc'],
    tasks: [
      {
        id: 't-1',
        description: 'Execute nmap port scan on 10.10.20.25 to discover open ports',
        verificationType: 'terminal',
        expectedValue: 'nmap 10.10.20.25',
        mitreTechnique: 'T1046'
      },
      {
        id: 't-2',
        description: 'Inspect HTTP response headers using curl -I',
        verificationType: 'terminal',
        expectedValue: 'curl -I http://10.10.20.25',
        mitreTechnique: 'T1190'
      }
    ],
    hints: [
      { level: 1, title: 'Conceptual Clue', text: 'Consider using nmap SYN scans (-sS) to avoid full TCP handshake logging.', xpPenalty: 10 },
      { level: 2, title: 'Command Structure', text: 'Run: nmap 10.10.20.25', xpPenalty: 20 }
    ],
    mitreTechniques: ['T1046 - Network Service Discovery', 'T1595 - Active Scanning']
  },
  {
    id: 'lab-lin-01',
    category: 'LINUX SECURITY',
    title: 'SUID Binary Exploitation & Privilege Escalation',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    xpReward: 350,
    objective: 'Locate misconfigured SUID binaries and escalate from unprivileged user to root.',
    scenario: 'You have initial shell access as "student". Inspect local binaries for setuid permissions.',
    targetEnvironment: {
      hostName: 'LIN-SRV-CORE-02',
      ipAddress: '10.10.20.50',
      subnet: '10.10.20.0/24',
      services: ['SSH', 'Local Shell']
    },
    knownInformation: [
      'Local user credential student:student',
      'Kernel Linux 5.15 LTS'
    ],
    unknownInformation: [
      'Root password',
      'Custom SUID scripts in /usr/bin'
    ],
    rulesOfEngagement: 'Local privilege audit only.',
    startingPoint: 'Run find / -perm -4000 2>/dev/null',
    availableTools: ['find', 'whoami', 'id', 'cat', 'chmod'],
    tasks: [
      {
        id: 't-1',
        description: 'Check current effective identity with whoami and id',
        verificationType: 'terminal',
        expectedValue: 'whoami',
        mitreTechnique: 'T1033'
      },
      {
        id: 't-2',
        description: 'Read system shadow hashes or config via cat /etc/passwd',
        verificationType: 'terminal',
        expectedValue: 'cat /etc/passwd',
        mitreTechnique: 'T1003'
      }
    ],
    hints: [
      { level: 1, title: 'Enumeration Clue', text: 'Search for files with SUID bit set using find command.', xpPenalty: 10 },
      { level: 2, title: 'Exact Command', text: 'Run: whoami and cat /etc/passwd in terminal.', xpPenalty: 20 }
    ],
    mitreTechniques: ['T1548.001 - SUID/SGID Abuse', 'T1033 - System Owner/User Discovery']
  },
  {
    id: 'lab-web-01',
    category: 'WEB SECURITY',
    title: 'SQL Injection & Credential Exfiltration',
    difficulty: 'Hard',
    estimatedTime: '35 mins',
    xpReward: 400,
    objective: 'Exploit UNION-based SQL injection in customer API parameter to extract database hashes.',
    scenario: 'The customer lookup API endpoint does not sanitize string parameters before constructing SQL queries.',
    targetEnvironment: {
      hostName: 'WEB-API-GATEWAY',
      ipAddress: '10.10.20.100',
      subnet: '10.10.20.0/24',
      services: ['HTTP 80', 'PostgreSQL 5432']
    },
    knownInformation: [
      'Endpoint: /api/v1/customer?id=101'
    ],
    unknownInformation: [
      'Database schema',
      'Table names',
      'Admin passwords'
    ],
    rulesOfEngagement: 'Do not drop tables.',
    startingPoint: 'Test single quote parameter injection via curl.',
    availableTools: ['curl', 'nmap', 'sqlmap', 'evidence lock'],
    tasks: [
      {
        id: 't-1',
        description: 'Query API endpoint with curl',
        verificationType: 'terminal',
        expectedValue: 'curl -I http://10.10.20.25',
        mitreTechnique: 'T1190'
      }
    ],
    hints: [
      { level: 1, title: 'Payload Clue', text: 'Append single quote \' to id parameter to test SQL syntax error.', xpPenalty: 15 }
    ],
    mitreTechniques: ['T1190 - Exploit Public-Facing Application', 'T1005 - Data from Local System']
  },
  {
    id: 'lab-api-01',
    category: 'API SECURITY',
    title: 'BOLA & JWT Token Forgery Triage',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    xpReward: 350,
    objective: 'Bypass authorization checks by manipulating JSON Web Token claims.',
    scenario: 'API backend fails to verify JWT signature algorithm "none" header.',
    targetEnvironment: {
      hostName: 'API-AUTH-SVC',
      ipAddress: '10.10.20.120',
      subnet: '10.10.20.0/24',
      services: ['HTTPS 443', 'REST API']
    },
    knownInformation: ['Bearer token format JWT'],
    unknownInformation: ['Secret key HMAC string'],
    rulesOfEngagement: 'Authorized testing.',
    startingPoint: 'Inspect JWT payload structure.',
    availableTools: ['curl', 'nc'],
    tasks: [
      {
        id: 't-1',
        description: 'Send test HTTP request',
        verificationType: 'terminal',
        expectedValue: 'curl -I http://10.10.20.25',
        mitreTechnique: 'T1071'
      }
    ],
    hints: [{ level: 1, title: 'JWT Hint', text: 'Decode base64 JWT header.', xpPenalty: 10 }],
    mitreTechniques: ['T1550 - Use Alternate Authentication Material']
  },
  {
    id: 'lab-ad-01',
    category: 'ACTIVE DIRECTORY',
    title: 'Kerberoasting & SPN Hash Extraction',
    difficulty: 'Hard',
    estimatedTime: '40 mins',
    xpReward: 500,
    objective: 'Request TGS tickets for Service Principal Names and crack service passwords offline.',
    scenario: 'Domain controller DC-01 contains accounts with SPNs configured.',
    targetEnvironment: {
      hostName: 'DC-FINVAULT-01',
      ipAddress: '10.10.20.200',
      subnet: '10.10.20.0/24',
      services: ['Kerberos 88', 'LDAP 389', 'SMB 445']
    },
    knownInformation: ['Domain: finvault.local'],
    unknownInformation: ['Domain Admin passwords'],
    rulesOfEngagement: 'Read-only ticket requests.',
    startingPoint: 'Enumerate SPNs.',
    availableTools: ['dig', 'nc', 'nmap'],
    tasks: [
      {
        id: 't-1',
        description: 'Query Domain Controller DNS records',
        verificationType: 'terminal',
        expectedValue: 'dig',
        mitreTechnique: 'T1558.003'
      }
    ],
    hints: [{ level: 1, title: 'Kerberos Clue', text: 'Request TGS ticket using Impacket GetUserSPNs.', xpPenalty: 20 }],
    mitreTechniques: ['T1558.003 - Kerberoasting']
  },
  {
    id: 'lab-cloud-01',
    category: 'CLOUD SECURITY',
    title: 'AWS IMDSv1 Metadata Service SSRF Abuse',
    difficulty: 'Intermediate',
    estimatedTime: '25 mins',
    xpReward: 350,
    objective: 'Exploit SSRF vulnerability to query 169.254.169.254 and exfiltrate IAM role credentials.',
    scenario: 'An EC2-hosted application forwards URL requests without validating loopback IPs.',
    targetEnvironment: {
      hostName: 'EC2-SIM-NODE',
      ipAddress: '10.10.20.150',
      subnet: '10.10.20.0/24',
      services: ['HTTP 80']
    },
    knownInformation: ['Metadata IP: 169.254.169.254'],
    unknownInformation: ['IAM Role Secret Access Key'],
    rulesOfEngagement: 'Target IMDS endpoint.',
    startingPoint: 'Craft SSRF request.',
    availableTools: ['curl'],
    tasks: [
      {
        id: 't-1',
        description: 'Send request to metadata endpoint',
        verificationType: 'terminal',
        expectedValue: 'curl',
        mitreTechnique: 'T1552.005'
      }
    ],
    hints: [{ level: 1, title: 'IMDS Clue', text: 'Query /latest/meta-data/iam/security-credentials/', xpPenalty: 15 }],
    mitreTechniques: ['T1552.005 - Cloud Instance Metadata API']
  },
  {
    id: 'lab-soc-01',
    category: 'SOC / DETECTION',
    title: 'SIEM Alert Triage & False Positive Analysis',
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    xpReward: 250,
    objective: 'Filter noisy Sysmon logs to pinpoint initial execution of malicious PowerShell script.',
    scenario: 'SIEM generated alert for Event ID 1 (Process Creation).',
    targetEnvironment: {
      hostName: 'SIEM-SIM-ELK',
      ipAddress: '10.10.20.10',
      subnet: '10.10.20.0/24',
      services: ['Elasticsearch 9200']
    },
    knownInformation: ['Alert ID: ALT-9921'],
    unknownInformation: ['Encoded PowerShell payload string'],
    rulesOfEngagement: 'Log analysis.',
    startingPoint: 'Check process execution logs.',
    availableTools: ['ss', 'ps'],
    tasks: [
      {
        id: 't-1',
        description: 'Inspect active system sockets',
        verificationType: 'terminal',
        expectedValue: 'ss',
        mitreTechnique: 'T1059.001'
      }
    ],
    hints: [{ level: 1, title: 'SIEM Clue', text: 'Look for -EncodedCommand parameter in powershell.exe args.', xpPenalty: 10 }],
    mitreTechniques: ['T1059.001 - PowerShell']
  },
  {
    id: 'lab-dfir-01',
    category: 'DIGITAL FORENSICS',
    title: 'Memory Artifact Dump & Volatility Analysis',
    difficulty: 'Hard',
    estimatedTime: '35 mins',
    xpReward: 400,
    objective: 'Analyze raw RAM image to extract injected DLL memory address and C2 IP address.',
    scenario: 'Suspicious process injected shellcode into lsass.exe process.',
    targetEnvironment: {
      hostName: 'EVIDENCE-WORKSTATION',
      ipAddress: '10.10.20.210',
      subnet: '10.10.20.0/24',
      services: ['Forensic Station']
    },
    knownInformation: ['Dump file: memdump.raw'],
    unknownInformation: ['C2 IP and port'],
    rulesOfEngagement: 'Read-only memory analysis.',
    startingPoint: 'Run volatility pslist.',
    availableTools: ['ps', 'cat'],
    tasks: [
      {
        id: 't-1',
        description: 'Check active processes',
        verificationType: 'terminal',
        expectedValue: 'ps',
        mitreTechnique: 'T1055'
      }
    ],
    hints: [{ level: 1, title: 'DFIR Clue', text: 'Use malfind plugin to find unbacked executable memory pages.', xpPenalty: 15 }],
    mitreTechniques: ['T1055 - Process Injection']
  },
  {
    id: 'lab-ir-01',
    category: 'INCIDENT RESPONSE',
    title: 'Ransomware Containment & Host Quarantine',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    xpReward: 350,
    objective: 'Isolate compromised domain controller before lateral propagation completes.',
    scenario: 'Encryption indicator detected on file share \\FINANCE-NAS.',
    targetEnvironment: {
      hostName: 'FINANCE-NAS',
      ipAddress: '10.10.20.220',
      subnet: '10.10.20.0/24',
      services: ['SMB 445']
    },
    knownInformation: ['Host IP 10.10.20.220'],
    unknownInformation: ['Ransomware extension name'],
    rulesOfEngagement: 'Containment actions required.',
    startingPoint: 'Block IP in firewall.',
    availableTools: ['retest'],
    tasks: [
      {
        id: 't-1',
        description: 'Execute defensive containment retest',
        verificationType: 'terminal',
        expectedValue: 'retest',
        mitreTechnique: 'T1486'
      }
    ],
    hints: [{ level: 1, title: 'IR Clue', text: 'Revoke compromised accounts and apply firewall isolate rule.', xpPenalty: 10 }],
    mitreTechniques: ['T1486 - Data Encrypted for Impact']
  },
  {
    id: 'lab-pe-01',
    category: 'PRIVILEGE ESCALATION',
    title: 'Sudoers Wildcard Abuse Escalation',
    difficulty: 'Intermediate',
    estimatedTime: '25 mins',
    xpReward: 300,
    objective: 'Abuse sudo permission wildcard on tar to spawn root shell via --checkpoint-action.',
    scenario: 'User student has sudo rights for /usr/bin/tar on /var/backups/*',
    targetEnvironment: {
      hostName: 'BACKUP-NODE',
      ipAddress: '10.10.20.60',
      subnet: '10.10.20.0/24',
      services: ['SSH 22']
    },
    knownInformation: ['Sudo rule: (ALL) NOPASSWD: /usr/bin/tar'],
    unknownInformation: ['Root flag string'],
    rulesOfEngagement: 'Escalate privileges safely.',
    startingPoint: 'Check sudo -l',
    availableTools: ['whoami', 'id', 'chmod'],
    tasks: [
      {
        id: 't-1',
        description: 'Check user permissions with whoami and id',
        verificationType: 'terminal',
        expectedValue: 'whoami',
        mitreTechnique: 'T1548.003'
      }
    ],
    hints: [{ level: 1, title: 'GTFOBins Clue', text: 'GTFOBins tar checkpoint flags can run arbitrary shell scripts.', xpPenalty: 10 }],
    mitreTechniques: ['T1548.003 - Sudo and Sudo Caching']
  },
  {
    id: 'lab-osint-01',
    category: 'OSINT',
    title: 'Public Repository Secret Leak & DNS Recon',
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    xpReward: 250,
    objective: 'Reconstruct leaked AWS API keys from commit history and perform DNS domain mapping.',
    scenario: 'Developer accidentally pushed configuration file containing API token to public git repo.',
    targetEnvironment: {
      hostName: 'GIT-PUBLIC-MIRROR',
      ipAddress: '10.10.20.5',
      subnet: '10.10.20.0/24',
      services: ['DNS 53', 'HTTP 80']
    },
    knownInformation: ['Domain: finvault.local'],
    unknownInformation: ['AWS Access Key ID'],
    rulesOfEngagement: 'OSINT reconnaissance.',
    startingPoint: 'Query DNS server.',
    availableTools: ['dig', 'curl'],
    tasks: [
      {
        id: 't-1',
        description: 'Query DNS records with dig',
        verificationType: 'terminal',
        expectedValue: 'dig',
        mitreTechnique: 'T1593'
      }
    ],
    hints: [{ level: 1, title: 'OSINT Clue', text: 'Run dig @10.10.20.1 api.finvault.local ANY', xpPenalty: 10 }],
    mitreTechniques: ['T1593 - Search Open Technical Databases']
  },
  {
    id: 'lab-crypto-01',
    category: 'CRYPTOGRAPHY',
    title: 'RSA Weak Key Exponent Attack & Padding Oracle',
    difficulty: 'Hard',
    estimatedTime: '35 mins',
    xpReward: 400,
    objective: 'Decrypt AES-CBC session key using Padding Oracle side-channel response codes.',
    scenario: 'HTTP endpoint returns 500 on invalid PKCS#7 padding vs 200 on valid padding.',
    targetEnvironment: {
      hostName: 'CRYPTO-VAULT',
      ipAddress: '10.10.20.80',
      subnet: '10.10.20.0/24',
      services: ['HTTP 80']
    },
    knownInformation: ['Ciphertext hex string'],
    unknownInformation: ['AES-128 secret key'],
    rulesOfEngagement: 'Side-channel analysis.',
    startingPoint: 'Inspect HTTP status codes.',
    availableTools: ['curl'],
    tasks: [
      {
        id: 't-1',
        description: 'Send test HTTP request',
        verificationType: 'terminal',
        expectedValue: 'curl -I http://10.10.20.25',
        mitreTechnique: 'T1600'
      }
    ],
    hints: [{ level: 1, title: 'Crypto Clue', text: 'Padding oracle allows byte-by-byte plaintext recovery.', xpPenalty: 15 }],
    mitreTechniques: ['T1600 - Reduce Remote Encryption Strength']
  },
  {
    id: 'lab-wifi-01',
    category: 'WIRELESS SECURITY',
    title: 'WPA2 Handshake Capture & Enterprise Deauth Analysis',
    difficulty: 'Intermediate',
    estimatedTime: '25 mins',
    xpReward: 300,
    objective: 'Capture WPA2 4-Way handshake packets and audit corporate Rogue Access Point broadcast signatures.',
    scenario: 'An unauthorized rogue AP is broadcasting BSSID 00:11:22:33:44:55 on 2.4GHz channel 6 imitating Corporate_Wifi.',
    targetEnvironment: {
      hostName: 'ROGUE-AP-MONITOR',
      ipAddress: '10.10.20.90',
      subnet: '10.10.20.0/24',
      services: ['802.11 Wireless Monitor']
    },
    knownInformation: ['Target BSSID: 00:11:22:33:44:55', 'Channel: 6'],
    unknownInformation: ['Pre-shared WPA2 passphrase'],
    rulesOfEngagement: 'Passive packet capture on wireless interface.',
    startingPoint: 'Run iwconfig / tcpdump wireless probe.',
    availableTools: ['tcpdump', 'nmap', 'cat'],
    tasks: [
      {
        id: 't-1',
        description: 'Inspect captured wireless traffic dump',
        verificationType: 'terminal',
        expectedValue: 'cat /etc/passwd',
        mitreTechnique: 'T1040'
      }
    ],
    hints: [{ level: 1, title: 'Wireless Clue', text: 'Look for EAPOL frames in pcap stream.', xpPenalty: 10 }],
    mitreTechniques: ['T1040 - Network Sniffing', 'T1557 - Adversary-in-the-Middle']
  },
  {
    id: 'lab-hunt-01',
    category: 'THREAT HUNTING',
    title: 'Behavioral Anomaly Hunting & Process Parentage',
    difficulty: 'Hard',
    estimatedTime: '35 mins',
    xpReward: 400,
    objective: 'Identify living-off-the-land binary (LOLBin) execution paths via parent-child process anomalies.',
    scenario: 'An adversary spawned cmd.exe from wordpad.exe followed by certutil.exe file download.',
    targetEnvironment: {
      hostName: 'SIEM-ELK-HUNT-01',
      ipAddress: '10.10.20.15',
      subnet: '10.10.20.0/24',
      services: ['Sysmon Log Feed']
    },
    knownInformation: ['Target Host: FIN-PC-402', 'User: jsmith'],
    unknownInformation: ['Malicious stager hash and C2 domain'],
    rulesOfEngagement: 'Log analysis and query hunting.',
    startingPoint: 'Check process execution logs via ps / ss commands.',
    availableTools: ['ps', 'ss', 'grep'],
    tasks: [
      {
        id: 't-1',
        description: 'Query active processes to find parent PID mismatches',
        verificationType: 'terminal',
        expectedValue: 'ps aux',
        mitreTechnique: 'T1055'
      }
    ],
    hints: [{ level: 1, title: 'Hunting Clue', text: 'Filter process list for certutil.exe -urlcache -f commands.', xpPenalty: 15 }],
    mitreTechniques: ['T1218 - System Binary Proxy Execution', 'T1105 - Ingress Tool Transfer']
  },
  {
    id: 'lab-py-01',
    category: 'PYTHON SECURITY AUTOMATION',
    title: 'Automated Vulnerability Scanner & Port Probe Script',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    xpReward: 350,
    objective: 'Build a Python automation script using socket and requests to audit HTTP endpoints and open ports.',
    scenario: 'Automate weekly perimeter compliance scanning for exposed database and administrative ports.',
    targetEnvironment: {
      hostName: 'PY-AUTO-NODE',
      ipAddress: '10.10.20.40',
      subnet: '10.10.20.0/24',
      services: ['Python 3.11 Runtime']
    },
    knownInformation: ['Target subnet: 10.10.20.0/24'],
    unknownInformation: ['List of non-compliant listening ports'],
    rulesOfEngagement: 'Authorized compliance script execution.',
    startingPoint: 'Run whoami and python3 scanner script.',
    availableTools: ['whoami', 'cat', 'nmap', 'curl'],
    tasks: [
      {
        id: 't-1',
        description: 'Verify current user environment and python execution',
        verificationType: 'terminal',
        expectedValue: 'whoami',
        mitreTechnique: 'T1059.006'
      }
    ],
    hints: [{ level: 1, title: 'Python Clue', text: 'Use socket.socket(socket.AF_INET, socket.SOCK_STREAM) with connect_ex.', xpPenalty: 10 }],
    mitreTechniques: ['T1059.006 - Python', 'T1595 - Active Scanning']
  }
];
