import { LevelModule } from '../types';
import { EXTENDED_LEVELS_22_TO_31 } from './extendedCurriculum22_31';

export const COMPREHENSIVE_LEVELS_EXTENSION: Record<number, LevelModule> = {
  ...EXTENDED_LEVELS_22_TO_31,
  4: {
    level: 4,
    title: 'Subnetting & CIDR Calculation',
    code: 'LVL-04',
    description: 'Calculate subnet masks, network IDs, broadcast addresses, usable host ranges, and CIDR prefix notation (/24, /28, /30) without sweat.',
    category: 'Networking',
    status: 'locked',
    lessonsCount: 3,
    completedLessons: 0,
    xpReward: 400,
    lessons: [
      {
        id: 'l4-1',
        levelId: 4,
        title: 'CIDR Notation & Network vs Host Bits',
        duration: '15 min',
        xpReward: 125,
        summary: 'Understand how slash notation (/24, /26, /30) slices IPv4 addresses into network and host portions.',
        theoryContent: `Classless Inter-Domain Routing (CIDR) uses a slash followed by the count of 1-bits in the subnet mask.\n\n• /24 = 255.255.255.0 (24 network bits, 8 host bits -> 2^8 - 2 = 254 usable hosts).\n• /26 = 255.255.255.192 (26 network bits, 6 host bits -> 2^6 - 2 = 62 usable hosts).\n• /30 = 255.255.255.252 (30 network bits, 2 host bits -> 2^2 - 2 = 2 usable hosts, standard for point-to-point router links).\n\nWhy it matters: Subnetting isolates departments, limits broadcast storms, and enforces micro-segmentation security boundaries.`,
        interactiveExample: {
          title: 'Subnet Binary Slicer',
          type: 'binary_inspector',
          description: 'Visualize /26 boundary on 192.168.1.65',
          codeOrData: 'IP: 11000000.10101000.00000001 . 01 | 000001 (Network ID: 192.168.1.64, Host: 1)'
        },
        quiz: {
          question: 'How many usable host IP addresses are available in a /28 subnet?',
          options: ['16', '14', '30', '6'],
          correctIndex: 1,
          explanation: '32 - 28 = 4 host bits. 2^4 = 16 total IPs. Subtract 2 (network and broadcast) = 14 usable hosts.'
        },
        practiceTask: 'Calculate the network and broadcast address for 10.0.0.50/29 in the Subnetting Trainer.',
        videoRecommendation: {
          title: 'Subnetting Mastery in 15 Minutes',
          channel: 'NetworkChuck / Professor Messer',
          duration: '16:20',
          tags: ['Networking', 'Subnetting', 'CIDR']
        }
      },
      {
        id: 'l4-2',
        levelId: 4,
        title: 'Network and Broadcast Boundary Math',
        duration: '12 min',
        xpReward: 125,
        summary: 'Master the magic number method: subtract the interesting octet from 256 to find block sizes effortlessly.',
        theoryContent: `The Magic Number Method:\n1. Identify the interesting octet in the subnet mask (e.g. for 255.255.255.224, the 4th octet is 224).\n2. Block size = 256 - 224 = 32.\n3. Network increments are multiples of 32: 0, 32, 64, 96, 128...\n4. If an IP is 192.168.1.75, it falls between 64 and 96. Network ID is 192.168.1.64, Broadcast is 192.168.1.95.`,
        quiz: {
          question: 'For subnet mask 255.255.255.240, what is the block size?',
          options: ['8', '16', '32', '64'],
          correctIndex: 1,
          explanation: '256 - 240 = 16. Subnet boundaries step in increments of 16.'
        },
        practiceTask: 'Identify the first usable host address for 172.16.0.35/27.',
        completed: false
      }
    ]
  },
  5: {
    level: 5,
    title: 'TCP/IP & Core Network Protocols',
    code: 'LVL-05',
    description: 'Master TCP 3-way handshake (SYN, SYN-ACK, ACK), TCP flags, UDP datagrams, DNS queries, DHCP leases, and ICMP diagnostics.',
    category: 'Networking',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 400,
    lessons: [
      {
        id: 'l5-1',
        levelId: 5,
        title: 'TCP 3-Way Handshake & Connection Teardown',
        duration: '14 min',
        xpReward: 100,
        summary: 'Examine SYN, SYN-ACK, ACK packet exchange, sequence numbers, and RST/FIN teardowns.',
        theoryContent: `Before transmitting application data over TCP, client and server establish synchronization:\n1. Client -> Server: SYN (Synchronize Sequence Number = X)\n2. Server -> Client: SYN-ACK (Acknowledge X+1, Server Seq = Y)\n3. Client -> Server: ACK (Acknowledge Y+1)\n\nIn ethical hacking, understanding the handshake is the foundation of SYN stealth scans (-sS), TCP reset attacks, and connection hijacking.`,
        interactiveExample: {
          title: 'TCP Handshake Packet Flow',
          type: 'network_packet',
          description: 'Client 192.168.1.100:54123 -> Server 192.168.1.1:80',
          codeOrData: '[SYN seq=1000] -> [SYN-ACK seq=5000 ack=1001] -> [ACK seq=1001 ack=5001]'
        },
        quiz: {
          question: 'What packet flag combination does a server send to accept an incoming TCP connection?',
          options: ['SYN', 'ACK', 'SYN-ACK', 'RST-ACK'],
          correctIndex: 2,
          explanation: 'The server responds to SYN with SYN-ACK to acknowledge the client sequence number and propose its own.'
        },
        practiceTask: 'Inspect a TCP handshake capture in the Wireshark sandbox.',
        completed: false
      }
    ]
  },
  6: {
    level: 6,
    title: 'Linux for Security Professionals',
    code: 'LVL-06',
    description: 'Bash scripting, cron jobs, network sockets, netcat, ssh tunneling, iptables firewalling, and auditd log analysis.',
    category: 'Linux',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 450,
    lessons: [
      {
        id: 'l6-1',
        levelId: 6,
        title: 'Bash Scripting for Security Automation',
        duration: '15 min',
        xpReward: 110,
        summary: 'Write loops, condition checks, and automated port sweeps in plain bash.',
        theoryContent: `Bash scripts allow penetration testers and defenders to automate repetitive triage.\n\nExample one-liner ping sweep:\n\`for ip in $(seq 1 254); do ping -c 1 -W 1 192.168.1.$ip | grep "64 bytes" & done\`\n\nSecurity best practices:\n• Use set -euo pipefail to catch errors.\n• Quote all variables ("$var") to avoid word splitting.\n• Avoid passing untrusted inputs directly into eval.`,
        quiz: {
          question: 'Which shell command tests if a file is executable before running it in a script?',
          options: ['if [ -x "$file" ]', 'if [ -r "$file" ]', 'if [ -f "$file" ]', 'if [ -d "$file" ]'],
          correctIndex: 0,
          explanation: '-x checks if the file exists and is executable by the current user.'
        },
        practiceTask: 'Create a script that reads an IP list and tests port 80 using curl or nc.',
        completed: false
      }
    ]
  },
  7: {
    level: 7,
    title: 'Passive & Active Reconnaissance',
    code: 'LVL-07',
    description: 'OSINT methodologies, DNS brute-forcing (Amass, Sublist3r), WHOIS, Shodan, Google Dorking, and certificate transparency logs.',
    category: 'Offensive',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 500,
    lessons: [
      {
        id: 'l7-1',
        levelId: 7,
        title: 'OSINT & Passive Information Gathering',
        duration: '15 min',
        xpReward: 100,
        summary: 'Gather intelligence without sending a single packet directly to the target infrastructure.',
        theoryContent: `Passive Reconnaissance collects publicly available intelligence without direct interaction:\n\n• Certificate Transparency (crt.sh): Discover subdomains from SSL certificate issuance history.\n• WHOIS / RDAP: Uncover registrar, administrative contacts, and ASN allocations.\n• Google Dorking (Advanced Search Operators):\n  - site:target.com filetype:pdf confidential\n  - site:target.com inurl:admin\n  - site:target.com intitle:"index of /"`,
        quiz: {
          question: 'Which search operator finds public PDF documents on a specific domain?',
          options: ['site:target.com ext:pdf', 'domain:target.com doc:pdf', 'find:target.com type:pdf', 'lookup:target.com file:pdf'],
          correctIndex: 0,
          explanation: 'site: filters domain, and ext: or filetype: filters file extension.'
        },
        practiceTask: 'Search crt.sh for public subdomains belonging to a fictional university lab.',
        completed: false
      }
    ]
  },
  8: {
    level: 8,
    title: 'Port Scanning & Service Enumeration',
    code: 'LVL-08',
    description: 'Deep dive into Nmap (SYN scan -sS, Version -sV, Script -sC, UDP -sU), banner grabbing, and service fingerprinting.',
    category: 'Offensive',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 500,
    lessons: [
      {
        id: 'l8-1',
        levelId: 8,
        title: 'Nmap Scanning Techniques (-sS vs -sT vs -sV)',
        duration: '18 min',
        xpReward: 125,
        summary: 'Understand stealth half-open scanning, banner version probing, and script engine execution.',
        theoryContent: `Nmap (Network Mapper) flags:\n• -sS (SYN Stealth Scan): Sends SYN, receives SYN-ACK, immediately sends RST. Fast and leaves fewer application logs.\n• -sT (TCP Connect Scan): Completes full 3-way handshake. Used when non-root users lack raw socket privileges.\n• -sV (Version Detection): Probes open ports to extract service banners and exact software release versions.\n• -sC (Default Scripts): Executes safe Lua scripts from the Nmap Scripting Engine (NSE) to identify common vulnerabilities.`,
        interactiveExample: {
          title: 'Nmap Command Output Simulator',
          type: 'terminal',
          description: 'nmap -sV -sC -p 22,80,443 10.10.10.5',
          codeOrData: 'PORT    STATE SERVICE VERSION\n22/tcp  open  ssh     OpenSSH 8.9p1 Ubuntu\n80/tcp  open  http    Apache httpd 2.4.52\n|_http-title: Corporate Portal'
        },
        quiz: {
          question: 'Why does an Nmap SYN stealth scan (-sS) send a RST packet upon receiving a SYN-ACK?',
          options: ['To exploit a buffer overflow in the firewall', 'To teardown the connection before the application layer logs it', 'To verify the UDP checksum', 'To calculate the MTU size'],
          correctIndex: 1,
          explanation: 'Sending RST avoids establishing a full TCP session, preventing many application-layer servers from recording a completed connection.'
        },
        practiceTask: 'Run an Nmap scan against the simulated Cyber Range machine in the Security Tools Sandbox.',
        completed: false
      }
    ]
  },
  9: {
    level: 9,
    title: 'Network Security & Traffic Analysis',
    code: 'LVL-09',
    description: 'Wireshark packet dissections, tcpdump capture filters, MITM detection, and IDS/IPS alert rules (Snort/Suricata).',
    category: 'Defensive',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 500,
    lessons: [
      {
        id: 'l9-1',
        levelId: 9,
        title: 'Wireshark Display Filters & Stream Following',
        duration: '16 min',
        xpReward: 125,
        summary: 'Filter traffic by protocol, extract HTTP payloads, follow TCP streams, and detect cleartext password exposure.',
        theoryContent: `Wireshark display filters isolate specific forensic events:\n• \`http.request.method == "POST"\` -> Find form submissions and logins.\n• \`tcp.port == 443 || tcp.port == 80\` -> Isolate web traffic.\n• \`ip.addr == 10.10.10.5 && dns\` -> Filter DNS lookups originating from a specific host.\n• Follow TCP Stream (Ctrl+Alt+Shift+T): Reassembles full bidirectional conversation between client and server.`,
        quiz: {
          question: 'Which display filter matches DNS queries in Wireshark?',
          options: ['dns.flags.response == 0', 'protocol == dns_query', 'port.dns == 53', 'dns.query == true'],
          correctIndex: 0,
          explanation: 'In Wireshark, dns.flags.response == 0 signifies a query, while 1 indicates a response.'
        },
        practiceTask: 'Extract cleartext credentials from an unencrypted HTTP POST packet stream in the Wireshark lab.',
        completed: false
      }
    ]
  },
  10: {
    level: 10,
    title: 'Web Application Security & OWASP Top 10',
    code: 'LVL-10',
    description: 'SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF, IDOR, SSRF, broken authentication, and security misconfigurations.',
    category: 'Web',
    status: 'locked',
    lessonsCount: 6,
    completedLessons: 0,
    xpReward: 600,
    lessons: [
      {
        id: 'l10-1',
        levelId: 10,
        title: 'SQL Injection (SQLi) from Query Logic to Extraction',
        duration: '20 min',
        xpReward: 150,
        summary: 'Bypass authentication and extract database records using UNION-based and Boolean blind SQLi.',
        theoryContent: `SQL Injection occurs when untrusted user input is directly concatenated into a dynamic SQL string without parametrization.\n\nAuthentication bypass payload:\n\`admin' OR '1'='1' --\`\n\nResulting database query:\n\`SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = '...'\`\n\nRemediation: ALWAYS use Prepared Statements (Parameterized Queries) where input is treated strictly as data parameters, never executable SQL commands.`,
        interactiveExample: {
          title: 'SQL Injection Playground',
          type: 'code_snippet',
          description: 'Interactive Query Builder',
          codeOrData: 'SELECT id, username, email FROM accounts WHERE role = \'user\' UNION SELECT 1, table_name, column_name FROM information_schema.columns--'
        },
        quiz: {
          question: 'What is the primary architectural fix to completely eliminate SQL Injection vulnerabilities?',
          options: ['Blacklisting single quotes with regex', 'Prepared Statements / Parameterized Queries', 'Base64 encoding all form inputs', 'Enabling HTTPS TLS 1.3'],
          correctIndex: 1,
          explanation: 'Parameterized queries separate code execution from user-supplied data, making SQL injection impossible at the database engine level.'
        },
        practiceTask: 'Bypass login authentication in the Web Security Lab using SQL injection.',
        completed: false
      }
    ]
  },
  11: {
    level: 11,
    title: 'Burp Suite & HTTP Proxy Mastery',
    code: 'LVL-11',
    description: 'Intercepting proxy, Repeater manual testing, Intruder payload fuzzing, Decoder, Comparer, and automated scanning workflows.',
    category: 'Web',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 550,
    lessons: [
      {
        id: 'l11-1',
        levelId: 11,
        title: 'Burp Suite Proxy & Repeater Workflows',
        duration: '15 min',
        xpReward: 140,
        summary: 'Intercept browser requests in transit, tamper with parameters in Repeater, and analyze HTTP responses.',
        theoryContent: `Burp Suite operates as a local Man-in-the-Middle (MitM) proxy on 127.0.0.1:8080.\n\nWorkflow:\n1. Proxy -> Intercept: Pause HTTP request before it reaches the web server.\n2. Send to Repeater (Ctrl+R): Modify headers, cookies, and body variables and re-send repeatedly to inspect response behaviors.\n3. Send to Intruder (Ctrl+I): Configure payload positions for dictionary fuzzing or rate-limit testing.`,
        quiz: {
          question: 'Which Burp Suite module is used for modifying individual HTTP requests and resending them repeatedly?',
          options: ['Intruder', 'Repeater', 'Sequencer', 'Decoder'],
          correctIndex: 1,
          explanation: 'Burp Repeater is designed for manual parameter tampering and repeatable request analysis.'
        },
        practiceTask: 'Modify user_id in an intercepted HTTP header using the Burp Suite simulator.',
        completed: false
      }
    ]
  },
  12: {
    level: 12,
    title: 'Vulnerability Assessment & CVSS Scoring',
    code: 'LVL-12',
    description: 'Nessus, OpenVAS, CVE databases, CVSS v3.1 vector calculations, false positive filtering, and remediation planning.',
    category: 'Assessment',
    status: 'locked',
    lessonsCount: 3,
    completedLessons: 0,
    xpReward: 500,
    lessons: [
      {
        id: 'l12-1',
        levelId: 12,
        title: 'CVSS v3.1 Scoring & Vulnerability Prioritization',
        duration: '15 min',
        xpReward: 150,
        summary: 'Calculate Base metrics: Attack Vector (AV), Attack Complexity (AC), Privileges Required (PR), User Interaction (UI), Scope (S), and CIA impacts.',
        theoryContent: `Common Vulnerability Scoring System (CVSS v3.1) evaluates flaw severity from 0.0 to 10.0:\n• None: 0.0\n• Low: 0.1 - 3.9\n• Medium: 4.0 - 6.9\n• High: 7.0 - 8.9\n• Critical: 9.0 - 10.0\n\nVector breakdown example: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H represents a remote unauthenticated Remote Code Execution (RCE) with Critical 9.8 score.`,
        quiz: {
          question: 'Which metric in CVSS measures whether the attack requires physical, local, adjacent, or network access?',
          options: ['Attack Vector (AV)', 'Attack Complexity (AC)', 'Scope (S)', 'Privileges Required (PR)'],
          correctIndex: 0,
          explanation: 'AV (Attack Vector) specifies Network (N), Adjacent (A), Local (L), or Physical (P).'
        },
        practiceTask: 'Score a simulated unauthenticated RCE flaw in the CVSS calculation worksheet.',
        completed: false
      }
    ]
  },
  13: {
    level: 13,
    title: 'Linux Security Hardening & Privilege Escalation',
    code: 'LVL-13',
    description: 'SUID binaries, sudo -l misconfigurations, cron job hijacking, path injection, capabilities (getcap), and LinPEAS.',
    category: 'Linux',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 650,
    lessons: [
      {
        id: 'l13-1',
        levelId: 13,
        title: 'SUID Binaries & GTFOBins Exploitation',
        duration: '18 min',
        xpReward: 130,
        summary: 'Find binaries with SUID permission bit (chmod u+s) that execute with root owner privileges.',
        theoryContent: `When a binary has the SUID bit enabled, any user who runs it inherits the file owner\'s permissions (frequently root / UID 0).\n\nEnumeration command:\n\`find / -perm -4000 2>/dev/null\`\n\nIf standard administrative utilities like find, cp, vim, or bash have SUID bits enabled, an attacker can invoke GTFOBins techniques (e.g. \`find . -exec /bin/sh -p \\;\`) to spawn an instant root shell.`,
        quiz: {
          question: 'Which find command searches the root filesystem for SUID binaries while discarding errors?',
          options: ['find / -perm -4000 2>/dev/null', 'find / -type suid', 'find / -suid root -exec ls', 'find / -perm 777 -error 0'],
          correctIndex: 0,
          explanation: '-perm -4000 matches files with the 4000 SUID bit, and 2>/dev/null redirects permission denied output.'
        },
        practiceTask: 'Find the vulnerable SUID binary on the Linux Lab workstation.',
        completed: false
      }
    ]
  },
  14: {
    level: 14,
    title: 'Windows Security Architecture',
    code: 'LVL-14',
    description: 'NTFS permissions, Registry keys, SAM database, LSASS process, User Account Control (UAC), and PowerShell security.',
    category: 'Windows',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 600,
    lessons: [
      {
        id: 'l14-1',
        levelId: 14,
        title: 'Windows Authentication: NTLM vs Kerberos',
        duration: '16 min',
        xpReward: 150,
        summary: 'Understand SAM registry hives, LSASS memory storage, NTLM challenge-response, and Kerberos ticket architecture.',
        theoryContent: `Windows manages authentication locally and across domains:\n• Local SAM (Security Account Manager): Stores local user NTLM password hashes encrypted with the SYSKEY key in registry.\n• LSASS (Local Security Authority Subsystem Service): Caches active session credentials and Kerberos tickets in RAM.\n• UAC (User Account Control): Separates standard user tokens from administrative elevated tokens to prevent silent background modifications.`,
        quiz: {
          question: 'Which Windows process caches active logon session credentials in memory?',
          options: ['lsass.exe', 'explorer.exe', 'csrss.exe', 'svchost.exe'],
          correctIndex: 0,
          explanation: 'LSASS.exe handles security policy enforcement and caches credentials and tokens in its memory space.'
        },
        practiceTask: 'Audit Windows user privileges and group memberships with whoami /priv and whoami /groups.',
        completed: false
      }
    ]
  },
  15: {
    level: 15,
    title: 'Privilege Escalation Concepts & Windows PrivEsc',
    code: 'LVL-15',
    description: 'Unquoted service paths, always install elevated, token impersonation (SeImpersonatePrivilege), and WinPEAS automation.',
    category: 'Offensive',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 700,
    lessons: [
      {
        id: 'l15-1',
        levelId: 15,
        title: 'Unquoted Service Paths & Weak Service Permissions',
        duration: '18 min',
        xpReward: 140,
        summary: 'Exploit spaces in service binary paths without quotation marks to hijack SYSTEM execution.',
        theoryContent: `When Windows starts a service configured with path:\n\`C:\\Program Files\\Vulnerable Service\\service.exe\`\nWithout surrounding quotes, Windows attempts execution in this order:\n1. C:\\Program.exe\n2. C:\\Program Files\\Vulnerable.exe\n3. C:\\Program Files\\Vulnerable Service\\service.exe\n\nIf a low-privilege user has write permissions to C:\\, dropping a malicious Program.exe escalates directly to NT AUTHORITY\\SYSTEM upon service reboot.`,
        quiz: {
          question: 'Why does an unquoted service path with spaces create an escalation vulnerability?',
          options: ['Windows interprets space-separated chunks as potential executable paths sequentially', 'It disables memory ASLR protections', 'It allows buffer overflows in the Windows kernel', 'It overrides Active Directory group policies'],
          correctIndex: 0,
          explanation: 'The Windows CreateProcess parser checks each space-delimited substring as a potential executable name when quotes are omitted.'
        },
        practiceTask: 'Identify unquoted service paths using wmic service get name,displayname,pathname,startmode in the lab.',
        completed: false
      }
    ]
  },
  16: {
    level: 16,
    title: 'Active Directory Security & Domain Pentesting',
    code: 'LVL-16',
    description: 'Kerberos authentication, AS-REP Roasting, Kerberoasting, BloodHound graph analysis, Pass-the-Hash, and DCSync attacks.',
    category: 'Enterprise',
    status: 'locked',
    lessonsCount: 6,
    completedLessons: 0,
    xpReward: 800,
    lessons: [
      {
        id: 'l16-1',
        levelId: 16,
        title: 'Kerberos Authentication & Kerberoasting Explained',
        duration: '22 min',
        xpReward: 150,
        summary: 'Request TGS service tickets for Service Principal Names (SPNs) and crack service account passwords offline.',
        theoryContent: `Kerberoasting exploits legitimate Kerberos functionality:\n1. Any authenticated domain user requests a Ticket Granting Service (TGS) ticket for an account with a configured SPN (e.g. MSSQLSvc/sql.corp.local).\n2. The Domain Controller encrypts the TGS ticket with the target service account\'s NTLM password hash.\n3. The attacker extracts the ticket from memory or network stream and cracks it offline with Hashcat (mode 13100) without generating failed login lockouts.`,
        quiz: {
          question: 'Why is Kerberoasting undetectable by standard login failure thresholds?',
          options: ['Because password cracking is performed completely offline on the attacker machine', 'Because Kerberos disables event logging', 'Because the Domain Controller does not track TGS requests', 'Because the ticket is signed with AES-512'],
          correctIndex: 0,
          explanation: 'The attacker receives a valid encrypted ticket from the Domain Controller and cracks the plaintext password locally on their GPU.'
        },
        practiceTask: 'Analyze a BloodHound graph path to identify shortest path to Domain Admin in the AD lab.',
        completed: false
      }
    ]
  },
  17: {
    level: 17,
    title: 'Digital Forensics & Incident Response (DFIR)',
    code: 'LVL-17',
    description: 'Memory analysis with Volatility, disk imaging, timeline reconstruction (Plaso), log correlation, and chain of custody.',
    category: 'Forensics',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 650,
    lessons: [
      {
        id: 'l17-1',
        levelId: 17,
        title: 'Memory Forensics with Volatility 3',
        duration: '18 min',
        xpReward: 160,
        summary: 'Extract process trees (windows.pslist), hidden DLLs (windows.malfind), and network connections from RAM dumps.',
        theoryContent: `Memory forensics captures volatile evidence that never touches the hard disk:\n• \`vol -f mem.raw windows.pstree\` -> Visualize parent-child process relationships (e.g., word.exe spawning powershell.exe).\n• \`vol -f mem.raw windows.malfind\` -> Detect injected shellcode in process memory regions with PAGE_EXECUTE_READWRITE permissions.\n• \`vol -f mem.raw windows.netscan\` -> Recover active TCP/UDP connections at time of RAM capture.`,
        quiz: {
          question: 'Which Volatility plugin detects code injection by looking for memory pages marked PAGE_EXECUTE_READWRITE?',
          options: ['windows.malfind', 'windows.pslist', 'windows.handles', 'windows.dumpfile'],
          correctIndex: 0,
          explanation: 'windows.malfind scans process address spaces for suspicious memory protections typical of injected shellcode.'
        },
        practiceTask: 'Extract malicious process PID from a RAM capture artifact.',
        completed: false
      }
    ]
  },
  18: {
    level: 18,
    title: 'Blue Team Operations & Threat Hunting',
    code: 'LVL-18',
    description: 'SIEM architectures (Splunk/Elastic), Sigma rules, MITRE ATT&CK mapping, endpoint detection (Sysmon), and defense in depth.',
    category: 'Defensive',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 700,
    lessons: [
      {
        id: 'l18-1',
        levelId: 18,
        title: 'SOC Triage & MITRE ATT&CK Mapping',
        duration: '20 min',
        xpReward: 150,
        summary: 'Triage incoming security alerts, evaluate false vs true positives, and orchestrate containment.',
        theoryContent: `The MITRE ATT&CK matrix categorizes adversary behavior into 14 tactical phases (Tactics) and hundreds of technical implementations (Techniques).\n\nSOC Analyst Workflow:\n1. Detection Alert: Review SIEM correlation rule trigger.\n2. Triage & Context: Check IP reputation, historical baselines, and endpoint logs.\n3. Containment: Isolate host, revoke compromised credentials, block C2 domain on DNS resolver.\n4. Eradication & Post-Mortem: Patch root cause vulnerability and update detection signatures.`,
        quiz: {
          question: 'Under MITRE ATT&CK, what tactic describes an attacker attempting to spread from one machine to another on a network?',
          options: ['Lateral Movement (TA0008)', 'Initial Access (TA0001)', 'Exfiltration (TA0010)', 'Impact (TA0040)'],
          correctIndex: 0,
          explanation: 'Lateral Movement encompasses techniques adversaries use to enter and control remote systems on a network.'
        },
        practiceTask: 'Investigate and triage an alert in the SOC Simulator.',
        completed: false
      }
    ]
  },
  19: {
    level: 19,
    title: 'Capture The Flag (CTF) Strategies',
    code: 'LVL-19',
    description: 'Reverse engineering with Ghidra, binary exploitation (pwn), web challenge speedruns, and steganography decoding.',
    category: 'CTF',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 750,
    lessons: [
      {
        id: 'l19-1',
        levelId: 19,
        title: 'CTF Reverse Engineering with Ghidra & Strings',
        duration: '20 min',
        xpReward: 160,
        summary: 'Decompile compiled C/C++ binaries, locate string comparisons, and extract hardcoded flag keys.',
        theoryContent: `When analyzing compiled binaries in CTFs:\n1. \`file binary\` -> Check architecture (x86_64, ARM) and stripping status.\n2. \`strings binary | grep -i "flag{"\` -> Check for unencrypted plaintext flags.\n3. Open in Ghidra / Cutter: Locate the \`main()\` function, inspect the decompiled pseudo-C logic, and reverse input validation functions.`,
        quiz: {
          question: 'What is the purpose of decompiling a binary in tools like Ghidra?',
          options: ['Translate compiled machine assembly back into readable high-level C code', 'Convert the binary into a JPEG image', 'Encrypt the executable with AES-256', 'Execute the code in Ring 0'],
          correctIndex: 0,
          explanation: 'Decompilers analyze assembly instructions to reconstruct readable high-level algorithmic logic.'
        },
        practiceTask: 'Decompile the challenge binary and extract the password in the CTF Arena.',
        completed: false
      }
    ]
  },
  20: {
    level: 20,
    title: 'Advanced Ethical Hacking & Red Teaming',
    code: 'LVL-20',
    description: 'Evasion techniques, custom payload crafting, command & control (C2) frameworks, and professional report writing.',
    category: 'Advanced',
    status: 'locked',
    lessonsCount: 6,
    completedLessons: 0,
    xpReward: 900,
    lessons: [
      {
        id: 'l20-1',
        levelId: 20,
        title: 'Professional Penetration Testing Reporting & Scope Management',
        duration: '25 min',
        xpReward: 180,
        summary: 'Document vulnerabilities with executive summaries, CVSS severity, reproduction steps, business impact, and remediation guidance.',
        theoryContent: `A penetration test is only as valuable as the report delivered to stakeholders.\n\nStructure of a Professional Pentest Report:\n1. Executive Summary: Non-technical risk posture overview for C-suite leaders.\n2. Methodology & Scope: Explicitly listed targets, test dates, and constraints.\n3. Technical Findings:\n   • Title, Severity (CVSS v3.1), Affected Asset\n   • Technical Description & Root Cause\n   • Step-by-Step Proof of Concept (PoC)\n   • Business Impact & Likelihood\n   • Remediation Recommendations & Retest Timeline.`,
        quiz: {
          question: 'Who is the primary audience for the Executive Summary section of a cybersecurity report?',
          options: ['Executive leadership, C-suite, and business decision makers', 'Junior software developers only', 'External black-hat forums', 'Network cable technicians'],
          correctIndex: 0,
          explanation: 'The executive summary translates technical risks into business impact for non-technical leadership.'
        },
        practiceTask: 'Draft a remediation recommendation for an SQL injection finding.',
        completed: false
      }
    ]
  },
  21: {
    level: 21,
    title: 'Final Cyber Range Capstone',
    code: 'LVL-21',
    description: 'End-to-end multi-machine enterprise simulation. Full scope engagement, penetration test, forensic post-mortem, and executive debrief.',
    category: 'Capstone',
    status: 'locked',
    lessonsCount: 3,
    completedLessons: 0,
    xpReward: 1200,
    lessons: [
      {
        id: 'l21-1',
        levelId: 21,
        title: 'Enterprise Multi-Tier Cyber Range Assessment',
        duration: '45 min',
        xpReward: 400,
        summary: 'Execute a full assessment: perimeter recon, initial web exploit, internal pivoting, domain escalation, and data recovery.',
        theoryContent: `Welcome to the Final Capstone.\n\nYou are tasked with auditing the fictional corporate network: "KOBAYASHI ENTERPRISE LAB".\n\nPhases:\n1. Perimeter Web App Audit -> Identify parameter vulnerability.\n2. Internal Pivoting -> Route traffic through compromised web server.\n3. Domain Privilege Escalation -> Exploit Kerberos configuration to achieve Enterprise Admin.\n4. Complete the formal report with evidence and mitigation guidance.`,
        quiz: {
          question: 'What is the first step in an authorized enterprise penetration test before executing active scans?',
          options: ['Verify and sign Rules of Engagement (RoE) and defined Scope boundaries', 'Launch DDoS attacks against DNS servers', 'Download all corporate email databases', 'Change administrator passwords'],
          correctIndex: 0,
          explanation: 'Ethical and legal penetration tests require explicit written Rules of Engagement defining scope and permitted testing techniques.'
        },
        practiceTask: 'Launch the NIGHTFALL target in the Cyber Range and capture both user.txt and root.txt flags.',
        completed: false
      }
    ]
  }
};
