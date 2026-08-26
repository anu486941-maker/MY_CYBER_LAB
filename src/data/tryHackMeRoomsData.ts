export type THMRoomType = 'walkthrough' | 'challenge' | 'koth' | 'ctf';
export type THMDifficulty = 'info' | 'easy' | 'medium' | 'hard' | 'insane';
export type THMCategory = 'Web' | 'Network' | 'Linux' | 'Windows' | 'SOC & Defense' | 'PrivEsc' | 'Active Directory' | 'Cryptography' | 'Forensics' | 'Cloud' | 'Offensive';

export interface THMTaskQuestion {
  id: string;
  questionNumber: number;
  prompt: string;
  answerFormat?: string; // e.g. "THM{...}" or "4"
  correctAnswer: string;
  acceptedAnswers?: string[];
  hint?: string;
  points: number;
  explanation?: string;
}

export interface THMTask {
  id: string;
  taskNumber: number;
  title: string;
  description: string;
  hasDeployableMachine?: boolean;
  questions: THMTaskQuestion[];
}

export interface THMRoom {
  id: string;
  title: string;
  code: string;
  slug: string;
  roomType: THMRoomType;
  difficulty: THMDifficulty;
  category: THMCategory;
  isFree: boolean;
  estimatedTime: string;
  xpReward: number;
  tags: string[];
  bannerGradient: string;
  author: string;
  description: string;
  learningObjectives: string[];
  targetMachineConfig?: {
    defaultIp: string;
    os: string;
    ports: { port: number; service: string; banner: string }[];
    vulnerabilities: string[];
  };
  tasks: THMTask[];
}

export const TRYHACKME_ROOMS: THMRoom[] = [
  // 1. BLUE (MS17-010 EternalBlue)
  {
    id: 'thm-blue',
    title: 'Blue (MS17-010 EternalBlue)',
    code: 'ROOM-BLUE',
    slug: 'blue',
    roomType: 'walkthrough',
    difficulty: 'easy',
    category: 'Windows',
    isFree: true,
    estimatedTime: '45 mins',
    xpReward: 450,
    tags: ['windows', 'smb', 'ms17-010', 'eternalblue', 'metasploit', 'privesc'],
    bannerGradient: 'from-blue-600/30 via-indigo-900/40 to-slate-950',
    author: 'DarkStar & MyCyberLab',
    description: 'Scan and exploit an unpatched Windows machine running vulnerable SMBv1 (CVE-2017-0144). Perform reconnaissance with Nmap, leverage Metasploit for NT AUTHORITY\\SYSTEM shell access, and dump NTLM hashes.',
    learningObjectives: [
      'Scan Windows ports with Nmap and identify vulnerable SMBv1 services',
      'Understand the EternalBlue SMB kernel vulnerability (MS17-010)',
      'Execute the exploit using Metasploit and gain SYSTEM privileges',
      'Dump and crack Windows NTLM password hashes using Mimikatz/hashcat'
    ],
    targetMachineConfig: {
      defaultIp: '10.10.142.88',
      os: 'Windows 7 Professional SP1 (x64)',
      ports: [
        { port: 135, service: 'msrpc', banner: 'Microsoft Windows RPC' },
        { port: 139, service: 'netbios-ssn', banner: 'Microsoft Windows netbios-ssn' },
        { port: 445, service: 'microsoft-ds', banner: 'Windows 7 Professional 7601 SP1' },
        { port: 3389, service: 'ms-wbt-server', banner: 'Microsoft Terminal Services' }
      ],
      vulnerabilities: ['CVE-2017-0144 (EternalBlue / MS17-010)', 'Unpatched SMBv1']
    },
    tasks: [
      {
        id: 'blue-t1',
        taskNumber: 1,
        title: 'Task 1: Reconnaissance & Port Scanning',
        description: 'Scan the machine with Nmap using vulnerability scanning scripts (`nmap -sV -sC --script vuln 10.10.142.88`) to discover open services and verify if SMBv1 is vulnerable to MS17-010.',
        hasDeployableMachine: true,
        questions: [
          {
            id: 'blue-q1',
            questionNumber: 1,
            prompt: 'How many ports are open on the target under port 1000?',
            answerFormat: '3',
            correctAnswer: '3',
            hint: 'Count ports 135, 139, and 445.',
            points: 100,
            explanation: 'Ports 135 (MSRPC), 139 (NetBIOS), and 445 (SMB) are standard Windows services open under port 1000.'
          },
          {
            id: 'blue-q2',
            questionNumber: 2,
            prompt: 'What Microsoft vulnerability code is this machine vulnerable to (format: ms17-xxx)?',
            answerFormat: 'ms17-010',
            correctAnswer: 'ms17-010',
            acceptedAnswers: ['ms17-010', 'MS17-010'],
            hint: 'Look for the Microsoft Security Bulletin code in the Nmap vuln script output.',
            points: 100,
            explanation: 'MS17-010 is the critical bulletin addressing remote code execution in SMBv1.'
          }
        ]
      },
      {
        id: 'blue-t2',
        taskNumber: 2,
        title: 'Task 2: Gaining Access with Metasploit',
        description: 'Start Metasploit (`msfconsole`), search for `ms17_010_eternalblue`, configure `RHOSTS` and `LHOST`, and launch the exploit.',
        questions: [
          {
            id: 'blue-q3',
            questionNumber: 1,
            prompt: 'What is the full Metasploit module path used to exploit this vulnerability?',
            answerFormat: 'exploit/windows/smb/ms17_010_eternalblue',
            correctAnswer: 'exploit/windows/smb/ms17_010_eternalblue',
            hint: 'use exploit/windows/smb/ms17_010_eternalblue',
            points: 100,
            explanation: 'The standard module is exploit/windows/smb/ms17_010_eternalblue.'
          },
          {
            id: 'blue-q4',
            questionNumber: 2,
            prompt: 'Once the shell opens, what user authority do you possess by default?',
            answerFormat: 'NT AUTHORITY\\SYSTEM',
            correctAnswer: 'NT AUTHORITY\\SYSTEM',
            acceptedAnswers: ['nt authority\\system', 'SYSTEM', 'NT AUTHORITY/SYSTEM'],
            hint: 'EternalBlue executes kernel-level shellcode directly with maximum system privileges.',
            points: 150,
            explanation: 'EternalBlue gives immediate NT AUTHORITY\\SYSTEM access.'
          }
        ]
      },
      {
        id: 'blue-t3',
        taskNumber: 3,
        title: 'Task 3: Cracking Hashes & Capturing Flags',
        description: 'Use Meterpreter `hashdump` to extract NTLM password hashes and capture the user and root flags.',
        questions: [
          {
            id: 'blue-q5',
            questionNumber: 1,
            prompt: 'What is flag 1 located in C:\\flag1.txt?',
            answerFormat: 'THM{access_the_machine}',
            correctAnswer: 'THM{access_the_machine}',
            acceptedAnswers: ['THM{access_the_machine}', 'flag{access_the_machine}'],
            hint: 'Check the root of drive C:.',
            points: 100
          },
          {
            id: 'blue-q6',
            questionNumber: 2,
            prompt: 'What is the system root flag located in C:\\Windows\\System32\\config\\flag3.txt?',
            answerFormat: 'THM{all_your_base_are_belong_to_us}',
            correctAnswer: 'THM{all_your_base_are_belong_to_us}',
            hint: 'Read the contents of flag3.txt inside the SAM config directory.',
            points: 100
          }
        ]
      }
    ]
  },

  // 2. PICKLE RICK (Web & Linux CTF)
  {
    id: 'thm-pickle-rick',
    title: 'Pickle Rick (Web & Command Injection)',
    code: 'ROOM-PICKLERICK',
    slug: 'picklerick',
    roomType: 'challenge',
    difficulty: 'easy',
    category: 'Web',
    isFree: true,
    estimatedTime: '40 mins',
    xpReward: 400,
    tags: ['web', 'command-injection', 'linux', 'robots.txt', 'sudo-privesc', 'ctf'],
    bannerGradient: 'from-emerald-600/30 via-teal-900/40 to-slate-950',
    author: 'RickSanchez & MyCyberLab',
    description: 'A Rick and Morty themed web penetration testing challenge. Inspect HTML comments, find hidden credentials in robots.txt, bypass command injection filters on the web portal, and escalate to root.',
    learningObjectives: [
      'Inspect page source code and robots.txt for leaked usernames and passwords',
      'Discover and exploit a web portal command execution input panel',
      'Bypass disallowed Linux commands (e.g. cat blocked -> use head, tail, or grep)',
      'Escalate to root privileges via misconfigured sudo privileges (sudo -l)'
    ],
    targetMachineConfig: {
      defaultIp: '10.10.87.112',
      os: 'Ubuntu Linux 20.04 LTS',
      ports: [
        { port: 22, service: 'SSH', banner: 'OpenSSH 8.2p1' },
        { port: 80, service: 'HTTP', banner: 'Apache/2.4.41 (Ubuntu) Web Portal' }
      ],
      vulnerabilities: ['Cleartext credentials in source comments', 'Web command injection', 'Passwordless sudo']
    },
    tasks: [
      {
        id: 'pr-t1',
        taskNumber: 1,
        title: 'Task 1: Capture the Ingredients',
        description: 'Help Rick turn himself back into a human by finding the 3 secret potion ingredients hidden across the file system.',
        hasDeployableMachine: true,
        questions: [
          {
            id: 'pr-q1',
            questionNumber: 1,
            prompt: 'What is the username found in the HTML source comment of the homepage?',
            answerFormat: 'R1ckRul3s',
            correctAnswer: 'R1ckRul3s',
            hint: 'View page source of index.html and look for the commented username note.',
            points: 100
          },
          {
            id: 'pr-q2',
            questionNumber: 2,
            prompt: 'What is the secret string found inside robots.txt?',
            answerFormat: 'Wubbalubbadubdub',
            correctAnswer: 'Wubbalubbadubdub',
            hint: 'Navigate to http://10.10.87.112/robots.txt',
            points: 100
          },
          {
            id: 'pr-q3',
            questionNumber: 3,
            prompt: 'What is the first ingredient found in Sup3rS3cretPickl3Ingred.txt?',
            answerFormat: 'mr. meeseek hair',
            correctAnswer: 'mr. meeseek hair',
            acceptedAnswers: ['mr. meeseek hair', 'mr meeseek hair', 'mr. meeseeks hair'],
            hint: 'Since `cat` is blocked in the command panel, use `head`, `tac`, or `less`.',
            points: 100
          },
          {
            id: 'pr-q4',
            questionNumber: 4,
            prompt: 'What is the final third ingredient located in /root/3rd.txt?',
            answerFormat: 'fleeb juice',
            correctAnswer: 'fleeb juice',
            hint: 'Check `sudo -l` to see what www-data can execute without password, then read /root/3rd.txt.',
            points: 100
          }
        ]
      }
    ]
  },

  // 3. WIRESHARK 101 (Packet Forensics & Blue Team)
  {
    id: 'thm-wireshark-101',
    title: 'Wireshark 101: Packet & Traffic Analysis',
    code: 'ROOM-WIRESHARK',
    slug: 'wireshark-101',
    roomType: 'walkthrough',
    difficulty: 'easy',
    category: 'SOC & Defense',
    isFree: true,
    estimatedTime: '50 mins',
    xpReward: 500,
    tags: ['wireshark', 'pcap', 'networking', 'tcp', 'dns', 'http', 'defense', 'soc'],
    bannerGradient: 'from-cyan-600/30 via-blue-900/40 to-slate-950',
    author: 'TryHackMe & BlueTeamAman',
    description: 'Learn the essentials of packet analysis using Wireshark. Master display filters, follow TCP and HTTP streams, isolate ARP poisoning attacks, and extract cleartext credentials from network PCAPs.',
    learningObjectives: [
      'Apply powerful Wireshark display filters (`ip.addr`, `tcp.flags.syn`, `http.request`)',
      'Reconstruct full conversational streams via "Follow TCP Stream"',
      'Identify malicious beaconing, DNS exfiltration, and ARP spoofing',
      'Export extracted malicious files and malware payloads from PCAP objects'
    ],
    targetMachineConfig: {
      defaultIp: '10.10.220.45',
      os: 'Forensics Investigation Workstation',
      ports: [
        { port: 8080, service: 'Web-PCAP', banner: 'Cloud Wireshark Stream Viewer' }
      ],
      vulnerabilities: ['Cleartext HTTP basic auth', 'ARP cache poisoning', 'FTP credential leaks']
    },
    tasks: [
      {
        id: 'ws-t1',
        taskNumber: 1,
        title: 'Task 1: Basic Filtering & Statistics',
        description: 'Understand Wireshark interface colors, capture vs display filters, and Conversations window.',
        questions: [
          {
            id: 'ws-q1',
            questionNumber: 1,
            prompt: 'What filter would you use to filter traffic strictly originating from or destined to IP 192.168.1.50?',
            answerFormat: 'ip.addr == 192.168.1.50',
            correctAnswer: 'ip.addr == 192.168.1.50',
            acceptedAnswers: ['ip.addr == 192.168.1.50', 'ip.addr==192.168.1.50'],
            hint: 'Use the `ip.addr ==` syntax.',
            points: 100
          },
          {
            id: 'ws-q2',
            questionNumber: 2,
            prompt: 'What filter isolates all HTTP POST requests sent over the wire?',
            answerFormat: 'http.request.method == "POST"',
            correctAnswer: 'http.request.method == "POST"',
            acceptedAnswers: ['http.request.method == "POST"', 'http.request.method == POST', 'http.request.method=="POST"'],
            hint: 'Filter on `http.request.method`.',
            points: 100
          }
        ]
      },
      {
        id: 'ws-t2',
        taskNumber: 2,
        title: 'Task 2: Packet Forensics Case Investigation',
        description: 'Analyze `investigation.pcap` to uncover the compromised credentials and exfiltrated file.',
        questions: [
          {
            id: 'ws-q3',
            questionNumber: 1,
            prompt: 'What cleartext password was submitted in the HTTP login stream to /admin/auth?',
            answerFormat: 'P@ssw0rdSecurity2026',
            correctAnswer: 'P@ssw0rdSecurity2026',
            hint: 'Follow the HTTP TCP stream on packet 42.',
            points: 150
          },
          {
            id: 'ws-q4',
            questionNumber: 2,
            prompt: 'What is the flag found in the decoded HTTP payload: THM{...}?',
            answerFormat: 'THM{packet_sniffer_master}',
            correctAnswer: 'THM{packet_sniffer_master}',
            hint: 'Look at the JSON response returned to the attacker.',
            points: 150
          }
        ]
      }
    ]
  },

  // 4. KENOBI (SMB, ProFTPD, & SUID PrivEsc)
  {
    id: 'thm-kenobi',
    title: 'Kenobi (ProFTPd, SMB, SUID & PATH Hijacking)',
    code: 'ROOM-KENOBI',
    slug: 'kenobi',
    roomType: 'walkthrough',
    difficulty: 'easy',
    category: 'Linux',
    isFree: true,
    estimatedTime: '55 mins',
    xpReward: 550,
    tags: ['linux', 'smb', 'proftpd', 'nfs', 'suid', 'path-hijacking', 'privesc'],
    bannerGradient: 'from-amber-600/30 via-yellow-900/40 to-slate-950',
    author: 'TryHackMe & MyCyberLab',
    description: 'Learn Linux enumeration, exploit an unauthenticated ProFTPd mod_copy vulnerability to move private SSH keys, mount network NFS shares, and hijack PATH environment variables on SUID binaries for root.',
    learningObjectives: [
      'Enumerate open SMB shares using Nmap scripts and smbclient',
      'Exploit ProFTPd 1.3.5 mod_copy commands to duplicate files into accessible NFS shares',
      'Mount remote NFS shares locally and retrieve Kenobi\'s id_rsa private key',
      'Analyze SUID binaries using strings and perform PATH injection privilege escalation'
    ],
    targetMachineConfig: {
      defaultIp: '10.10.95.201',
      os: 'Ubuntu Linux 18.04 LTS',
      ports: [
        { port: 21, service: 'FTP', banner: 'ProFTPd 1.3.5' },
        { port: 22, service: 'SSH', banner: 'OpenSSH 7.2p2' },
        { port: 80, service: 'HTTP', banner: 'Apache/2.4.18' },
        { port: 111, service: 'rpcbind', banner: 'NFS Network File System' },
        { port: 445, service: 'Samba', banner: 'Samba 4.3.11' }
      ],
      vulnerabilities: ['ProFTPd mod_copy vulnerability (CVE-2015-3306)', 'World-readable NFS share', 'SUID binary without absolute path']
    },
    tasks: [
      {
        id: 'kenobi-t1',
        taskNumber: 1,
        title: 'Task 1: Deploy & Enumerate SMB Shares',
        description: 'Scan the machine for open Samba shares using `nmap -p 445 --script=smb-enum-shares.nse,smb-enum-users.nse 10.10.95.201`',
        hasDeployableMachine: true,
        questions: [
          {
            id: 'kenobi-q1',
            questionNumber: 1,
            prompt: 'How many SMB shares were found by the Nmap script?',
            answerFormat: '3',
            correctAnswer: '3',
            hint: 'Count anonymous, IPC$, and print$',
            points: 100
          },
          {
            id: 'kenobi-q2',
            questionNumber: 2,
            prompt: 'What file is found inside the accessible anonymous share?',
            answerFormat: 'log.txt',
            correctAnswer: 'log.txt',
            hint: 'Connect with `smbclient //10.10.95.201/anonymous` and run `dir`.',
            points: 100
          }
        ]
      },
      {
        id: 'kenobi-t2',
        taskNumber: 2,
        title: 'Task 2: Gain Initial Access with ProFTPd',
        description: 'Use netcat to connect to port 21 and issue SITE CPFR and SITE CPTO commands to copy /home/kenobi/.ssh/id_rsa into the /var NFS mount.',
        questions: [
          {
            id: 'kenobi-q3',
            questionNumber: 1,
            prompt: 'What ProFTPd module allows unauthenticated copying of files on the system?',
            answerFormat: 'mod_copy',
            correctAnswer: 'mod_copy',
            hint: 'Look up ProFTPd 1.3.5 exploit on Searchsploit.',
            points: 100
          },
          {
            id: 'kenobi-q4',
            questionNumber: 2,
            prompt: 'What is Kenobi\'s user flag (THM{...})?',
            answerFormat: 'THM{d0_0r_d0_n0t_th3r3_is_n0_try}',
            correctAnswer: 'THM{d0_0r_d0_n0t_th3r3_is_n0_try}',
            hint: 'Check /home/kenobi/user.txt after logging in via SSH.',
            points: 150
          }
        ]
      },
      {
        id: 'kenobi-t3',
        taskNumber: 3,
        title: 'Task 3: Privilege Escalation via SUID & PATH Hijack',
        description: 'Find SUID binaries with `find / -perm -u=s -type f 2>/dev/null`. Notice `/usr/bin/menu`. It runs `curl` without an absolute path.',
        questions: [
          {
            id: 'kenobi-q5',
            questionNumber: 1,
            prompt: 'What command does `/usr/bin/menu` execute to check system status without specifying an absolute path?',
            answerFormat: 'curl',
            correctAnswer: 'curl',
            hint: 'Run `strings /usr/bin/menu` to inspect internal system calls.',
            points: 100
          },
          {
            id: 'kenobi-q6',
            questionNumber: 2,
            prompt: 'What is the root flag located in /root/root.txt?',
            answerFormat: 'THM{1_4m_th3_m4st3r_n0w}',
            correctAnswer: 'THM{1_4m_th3_m4st3r_n0w}',
            hint: 'Create a malicious `curl` binary in /tmp, export PATH=/tmp:$PATH, and execute `/usr/bin/menu`.',
            points: 200
          }
        ]
      }
    ]
  },

  // 5. OWASP TOP 10 (Web Vulnerabilities)
  {
    id: 'thm-owasp-top-10',
    title: 'OWASP Top 10: Deep Dive & Defenses',
    code: 'ROOM-OWASP10',
    slug: 'owasp-top-10',
    roomType: 'walkthrough',
    difficulty: 'medium',
    category: 'Web',
    isFree: true,
    estimatedTime: '90 mins',
    xpReward: 750,
    tags: ['owasp', 'sqli', 'xss', 'idor', 'ssrf', 'command-injection', 'web', 'burp'],
    bannerGradient: 'from-purple-600/30 via-pink-900/40 to-slate-950',
    author: 'TryHackMe & AMAN Security',
    description: 'The definitive hands-on guide to the most critical web application security risks. Learn how to discover, exploit, and remediate SQL Injection, Broken Access Control, Server-Side Request Forgery (SSRF), IDOR, and Cross-Site Scripting.',
    learningObjectives: [
      'Exploit In-Band and Blind SQL Injection using SQLMap and manual boolean payloads',
      'Execute Cross-Site Scripting (Stored, Reflected, DOM) to steal session cookies',
      'Bypass Insecure Direct Object References (IDOR) to access unauthorized records',
      'Leverage SSRF to query cloud instance metadata endpoints (169.254.169.254)'
    ],
    targetMachineConfig: {
      defaultIp: '10.10.155.33',
      os: 'Debian Linux (Vulnerable Web Suite)',
      ports: [
        { port: 80, service: 'HTTP', banner: 'Nginx 1.18.0 / OWASP Vulnerable App' },
        { port: 3306, service: 'MySQL', banner: 'MySQL 8.0' }
      ],
      vulnerabilities: ['SQLi in /search.php', 'Stored XSS in /comments', 'IDOR in /api/invoices', 'SSRF in /preview_url']
    },
    tasks: [
      {
        id: 'owasp-t1',
        taskNumber: 1,
        title: 'Task 1: SQL Injection (SQLi)',
        description: 'Test the login form at `/login.php` with classic authentication bypass payloads: `\' OR 1=1 -- -`.',
        hasDeployableMachine: true,
        questions: [
          {
            id: 'owasp-q1',
            questionNumber: 1,
            prompt: 'What payload successfully bypasses the authentication query `SELECT * FROM users WHERE user=\'$u\' AND pass=\'$p\'`?',
            answerFormat: "' OR 1=1 -- -",
            correctAnswer: "' OR 1=1 -- -",
            acceptedAnswers: ["' OR 1=1 -- -", "admin' --", "' OR '1'='1"],
            hint: 'Close the single quote, add OR 1=1, and comment out the rest.',
            points: 100
          },
          {
            id: 'owasp-q2',
            questionNumber: 2,
            prompt: 'What is the flag revealed upon logging into the administrator dashboard?',
            answerFormat: 'THM{sqli_bypass_successful}',
            correctAnswer: 'THM{sqli_bypass_successful}',
            hint: 'Submit the payload in the username box with any password.',
            points: 150
          }
        ]
      },
      {
        id: 'owasp-t2',
        taskNumber: 2,
        title: 'Task 2: Server-Side Request Forgery (SSRF)',
        description: 'The endpoint `/fetch?url=` makes internal HTTP requests. Point it to localhost and cloud metadata services.',
        questions: [
          {
            id: 'owasp-q3',
            questionNumber: 1,
            prompt: 'What is the link-local IP address used to query cloud metadata in AWS, GCP, and Azure?',
            answerFormat: '169.254.169.254',
            correctAnswer: '169.254.169.254',
            hint: 'IPv4 link-local address for metadata discovery.',
            points: 100
          },
          {
            id: 'owasp-q4',
            questionNumber: 2,
            prompt: 'What secret token is exposed when querying `http://127.0.0.1:8080/internal-api/token`?',
            answerFormat: 'THM{ssrf_cloud_metadata_leaked}',
            correctAnswer: 'THM{ssrf_cloud_metadata_leaked}',
            hint: 'Use SSRF to query port 8080 on 127.0.0.1.',
            points: 150
          }
        ]
      }
    ]
  },

  // 6. KING OF THE HILL (KotH Competitive Arena)
  {
    id: 'thm-koth-citadel',
    title: 'King of the Hill: Citadel Fortress',
    code: 'ROOM-KOTH-CITADEL',
    slug: 'koth-citadel',
    roomType: 'koth',
    difficulty: 'hard',
    category: 'Offensive',
    isFree: false,
    estimatedTime: '45 mins (Live Match)',
    xpReward: 1000,
    tags: ['koth', 'king-of-the-hill', 'competitive', 'attack-defense', 'multiplayer', 'patching'],
    bannerGradient: 'from-rose-600/30 via-red-900/40 to-slate-950',
    author: 'TryHackMe Arena & AMAN',
    description: 'Attack and Defense multiplayer battleground. Gain root access to the Citadel target machine, write your operator username into `/root/king.txt`, defend against rival hackers by patching vulnerabilities, and score points every 60 seconds.',
    learningObjectives: [
      'Rapid reconnaissance and race-to-root exploitation in under 5 minutes',
      'Defensive hardening: kill reverse shells, change root passwords, modify SSH authorized_keys',
      'Patch web vulnerabilities on live Apache/PHP code to lock out rival players',
      'Maintain continuous persistence via cron jobs, SUID wrappers, and king.txt guard scripts'
    ],
    targetMachineConfig: {
      defaultIp: '10.10.199.50',
      os: 'Citadel Linux Core (KotH Target)',
      ports: [
        { port: 22, service: 'SSH', banner: 'OpenSSH 8.4p1' },
        { port: 80, service: 'HTTP', banner: 'Citadel Portal / Vulnerable LFI' },
        { port: 8080, service: 'HTTP-Admin', banner: 'Apache Tomcat 9.0' },
        { port: 9999, service: 'KingDaemon', banner: 'KotH Flag Verifier' }
      ],
      vulnerabilities: ['LFI to RCE via PHP session files', 'Tomcat default admin credentials', 'SUID /bin/find']
    },
    tasks: [
      {
        id: 'koth-t1',
        taskNumber: 1,
        title: 'Task 1: Capture the Hill & Claim King',
        description: 'Exploit the vulnerable Tomcat manager application or LFI portal to gain root, and execute `echo "OPERATOR_NAME" > /root/king.txt`.',
        hasDeployableMachine: true,
        questions: [
          {
            id: 'koth-q1',
            questionNumber: 1,
            prompt: 'What file on the target determines the current King of the Hill?',
            answerFormat: '/root/king.txt',
            correctAnswer: '/root/king.txt',
            hint: 'The standard KotH flag path is in the root home directory.',
            points: 200
          },
          {
            id: 'koth-q2',
            questionNumber: 2,
            prompt: 'How often does the scoring engine award points to the active King in /root/king.txt?',
            answerFormat: '60 seconds',
            correctAnswer: '60 seconds',
            acceptedAnswers: ['60 seconds', '60s', 'every minute', '1 minute'],
            hint: 'Points tick every 1 minute.',
            points: 100
          },
          {
            id: 'koth-q3',
            questionNumber: 3,
            prompt: 'What is the first defensive action you should take immediately upon gaining root on a KotH box?',
            answerFormat: 'Change root password and patch the exploit vector',
            correctAnswer: 'Change root password and patch the exploit vector',
            acceptedAnswers: [
              'Change root password and patch the exploit vector',
              'change root password',
              'patch vulnerabilities',
              'kill connections'
            ],
            hint: 'Lock out competitors by changing credentials and securing the vulnerable script.',
            points: 150
          }
        ]
      }
    ]
  }
];

export const getTryHackMeRoomById = (id: string): THMRoom | undefined => {
  return TRYHACKME_ROOMS.find(r => r.id === id || r.slug === id || r.code === id);
};
