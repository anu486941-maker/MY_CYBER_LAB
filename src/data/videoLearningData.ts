import { VideoItem } from '../types';

export const VIDEO_LEARNING_DATA: VideoItem[] = [
  // =========================================================================
  // 1. SOC ANALYST TRACK
  // =========================================================================
  {
    id: 'vid-soc-01',
    title: 'SOC Analyst Fundamentals: What Happens in a Security Operations Center?',
    description: 'Understand the core daily duties of a Tier 1/2 SOC Analyst, SIEM monitoring workflows, alert triage lifecycle, and threat escalation procedures.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=k2Zg8e5Zf1U',
    embedUrl: 'https://www.youtube-nocookie.com/embed/k2Zg8e5Zf1U',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    role: 'soc-analyst',
    topic: 'SOC Operations & Alert Triage',
    difficulty: 'Beginner',
    duration: '18:45',
    durationSeconds: 1125,
    prerequisites: ['Basic IT knowledge', 'Networking basics'],
    tags: ['SOC', 'SIEM', 'Alert Triage', 'Blue Team', 'Defensive'],
    learningObjectives: [
      'Understand the architecture of a 24/7 Security Operations Center',
      'Learn the Tier 1, Tier 2, and Tier 3 alert escalation chain',
      'Distinguish True Positives from False Positives in log analysis',
      'Master the basic incident response handling playbook'
    ],
    notesSummary: '### SOC Analyst Key Takeaways:\n- **Tier 1**: Alert monitoring, triage, initial validation, ticketing.\n- **Tier 2**: Deep incident analysis, host quarantine, root cause analysis.\n- **Tier 3 / Threat Hunter**: Proactive hypothesis-driven hunting, reverse engineering malware.\n- **Key Metrics**: MTTD (Mean Time to Detect) & MTTR (Mean Time to Respond).',
    instructor: 'David Bombal & SOC Lead',
    channelName: 'David Bombal',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-soc-01-1',
        question: 'What is the primary responsibility of a Tier 1 SOC Analyst during an alert triage?',
        options: [
          'Decompile ransomware binaries in a sandbox',
          'Validate alert authenticity and filter out benign false positives',
          'Deploy firewall rule patches to production core routers',
          'Draft executive risk disclosures for regulatory bodies'
        ],
        correctIndex: 1,
        explanation: 'Tier 1 analysts focus on rapidly inspecting raw alerts, verifying indicators, filtering out false positives, and escalating true threats.'
      },
      {
        id: 'q-soc-01-2',
        question: 'What does the metric MTTD stand for in security operations?',
        options: [
          'Maximum Threshold for Threat Decontamination',
          'Mean Time to Detect',
          'Manual Tool Tracking Database',
          'Mission Threat Tactical Defense'
        ],
        correctIndex: 1,
        explanation: 'MTTD stands for Mean Time to Detect, measuring how quickly a security team identifies an ongoing breach or intrusion.'
      },
      {
        id: 'q-soc-01-3',
        question: 'When an alert is confirmed as a malicious True Positive, what is the immediate next step for a Tier 1 analyst?',
        options: [
          'Delete the compromised database to stop data leaks',
          'Escalate to Tier 2 with initial telemetry and open an incident ticket',
          'Shut down the entire corporate data center power grid',
          'Ignore the alert if the user is an executive'
        ],
        correctIndex: 1,
        explanation: 'True positives are enriched with telemetry context, documented in an incident ticket, and escalated to Incident Responders / Tier 2.'
      }
    ],
    relatedLab: {
      id: 'lab-soc-sim',
      name: 'SOC SIEM & Alert Simulator',
      route: '/practice/soc-simulator',
      description: 'Practice triaging live SIEM alerts, inspecting event logs, and applying firewall blocks.'
    },
    relatedMission: {
      id: 'mission-rogue-insider',
      title: 'Operation: Rogue Insider',
      route: '/missions?id=mission-rogue-insider',
      description: 'Investigate anomalous data exfiltration from an unauthorized insider account.'
    }
  },
  {
    id: 'vid-soc-02',
    title: 'SIEM Log Analysis & Threat Detection with Splunk and Wazuh',
    description: 'Master practical SIEM query syntax, Sysmon event correlation, Windows Event IDs (4624, 4625, 4688, 7045), and detecting lateral movement.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=7gQnPy_H3oQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7gQnPy_H3oQ',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    role: 'soc-analyst',
    topic: 'SIEM & Event Log Analysis',
    difficulty: 'Intermediate',
    duration: '26:10',
    durationSeconds: 1570,
    prerequisites: ['SOC Fundamentals', 'Windows Architecture basics'],
    tags: ['SIEM', 'Splunk', 'Wazuh', 'Sysmon', 'Event Logs', 'Log Analysis'],
    learningObjectives: [
      'Search and filter security logs using SIEM query syntax',
      'Correlate Event ID 4625 (Failed Logon) with Event ID 4624 (Successful Logon)',
      'Detect process creation tampering using Sysmon Event ID 1',
      'Build search queries to identify suspicious PowerShell execution flags (-enc, -nop)'
    ],
    notesSummary: '### Critical Windows Security Event IDs:\n- `4624`: Successful Logon (Check Logon Type: 2=Interactive, 3=Network, 10=RDP)\n- `4625`: Failed Logon (Brute-force indicator)\n- `4688`: Process Creation (Enable command line logging)\n- `4697/7045`: New Service Installed (Persistence indicator)\n- `Sysmon 1`: Process Create with full hashes and parent processes\n- `Sysmon 3`: Network Connection initiated by executable',
    instructor: 'Cyber Insecurity Instructor',
    channelName: 'Cyber Insecurity',
    order: 2,
    learningPathStage: 'Core Skills',
    quiz: [
      {
        id: 'q-soc-02-1',
        question: 'Which Windows Event ID represents a successful account logon?',
        options: ['Event ID 4625', 'Event ID 4624', 'Event ID 1102', 'Event ID 7045'],
        correctIndex: 1,
        explanation: 'Event ID 4624 indicates a successful logon, while 4625 indicates a logon failure.'
      },
      {
        id: 'q-soc-02-2',
        question: 'What does a Windows Logon Type of 10 signify in an Event ID 4624 record?',
        options: [
          'Local console keyboard logon',
          'Network share access (SMB)',
          'Remote Desktop Protocol (RDP) logon',
          'Service account startup'
        ],
        correctIndex: 2,
        explanation: 'Logon Type 10 is RemoteInteractive, standard for Remote Desktop (RDP) sessions.'
      },
      {
        id: 'q-soc-02-3',
        question: 'Why is Sysmon Event ID 1 critical for detecting stealthy malware executions?',
        options: [
          'It captures CPU temperature spikes',
          'It records the full command-line arguments, parent process, and file hashes (SHA256)',
          'It automatically deletes unencrypted Word documents',
          'It prevents passwords from being typed in notepad'
        ],
        correctIndex: 1,
        explanation: 'Sysmon Event ID 1 provides full process creation telemetry including parent process, image path, SHA256 hashes, and command line.'
      }
    ],
    relatedLab: {
      id: 'lab-soc-sim',
      name: 'SOC SIEM & Alert Simulator',
      route: '/practice/soc-simulator',
      description: 'Run Splunk and Wazuh queries against synthetic incident logs.'
    },
    relatedMission: {
      id: 'mission-stealth-exfil',
      title: 'Operation: Ghost Exfiltration',
      route: '/missions?id=mission-stealth-exfil',
      description: 'Trace suspicious PowerShell process spawning across compromised enterprise workstations.'
    }
  },
  {
    id: 'vid-soc-03',
    title: 'Network Intrusion Detection & Snort/Suricata Rule Writing',
    description: 'Learn how NIDS engines parse PCAP packets, trigger on malicious signatures, and write custom Snort alert rules.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=FkJ4Vj9X4vU',
    embedUrl: 'https://www.youtube-nocookie.com/embed/FkJ4Vj9X4vU',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    role: 'soc-analyst',
    topic: 'Network IDS & Signature Detection',
    difficulty: 'Advanced',
    duration: '22:15',
    durationSeconds: 1335,
    prerequisites: ['TCP/IP Model', 'Wireshark Packet Analysis'],
    tags: ['NIDS', 'Snort', 'Suricata', 'Network Security', 'PCAP'],
    learningObjectives: [
      'Understand Snort rule header structure: action, protocol, source, port, destination',
      'Write rule options matching malicious HTTP payloads using content and nocase',
      'Tune threshold and rate limits to eliminate noisy false alerts',
      'Analyze network packet captures for Command & Control beacons'
    ],
    notesSummary: '### Snort Rule Format Anatomy:\n`alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:"MALWARE HTTP User-Agent Beacon"; content:"User-Agent: C2Bot"; nocase; sid:1000001; rev:1;)`',
    instructor: 'Network Threat Specialist',
    channelName: 'NetworkChuck',
    order: 3,
    learningPathStage: 'Tool Mastery',
    quiz: [
      {
        id: 'q-soc-03-1',
        question: 'In a Snort rule, what does the "nocase" keyword perform?',
        options: [
          'Ensures the rule only runs on Linux servers',
          'Performs case-insensitive pattern matching on payload content',
          'Disables logging if packet matches',
          'Prevents memory leaks in the Snort daemon'
        ],
        correctIndex: 1,
        explanation: 'The "nocase" option directs the pattern matcher to evaluate payload content irrespective of uppercase or lowercase letters.'
      },
      {
        id: 'q-soc-03-2',
        question: 'What is the purpose of the "sid" (Signature ID) field in Snort rules?',
        options: [
          'It sets the encryption key for the rule',
          'It gives the rule a unique numerical identifier',
          'It indicates the server IP address',
          'It marks the priority of the packet queue'
        ],
        correctIndex: 1,
        explanation: 'The SID is a unique number identifying the specific rule signature (custom rules typically start at sid: 1000000+).'
      },
      {
        id: 'q-soc-03-3',
        question: 'Which protocol header flag combination is characteristic of a TCP SYN stealth scan?',
        options: [
          'SYN flag set without an ACK flag',
          'FIN, PSH, and URG flags set simultaneously (XMAS)',
          'RST and ACK flags set together',
          'No flags set (NULL scan)'
        ],
        correctIndex: 0,
        explanation: 'A SYN scan initiates communication by sending TCP SYN packets to target ports without completing the 3-way handshake.'
      }
    ],
    relatedLab: {
      id: 'lab-network',
      name: 'Network Recon & Port Scanner',
      route: '/network-lab',
      description: 'Inspect live packet headers and analyze network traffic streams.'
    }
  },

  // =========================================================================
  // 2. PENETRATION TESTER TRACK
  // =========================================================================
  {
    id: 'vid-pen-01',
    title: 'Penetration Testing Methodology: From Reconnaissance to Exploitation',
    description: 'Learn the PTES (Penetration Testing Execution Standard) framework, passive vs active reconnaissance, scoping rules of engagement, and vulnerability assessment.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3Kq1MIfTWCE',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    role: 'pentester',
    topic: 'PTES Methodology & Scope',
    difficulty: 'Beginner',
    duration: '24:30',
    durationSeconds: 1470,
    prerequisites: ['Linux terminal navigation', 'Networking concepts'],
    tags: ['Pentesting', 'PTES', 'Recon', 'Exploitation', 'Ethical Hacking'],
    learningObjectives: [
      'Understand the 7 stages of the PTES penetration testing standard',
      'Formulate Rules of Engagement (RoE) and legal authorization boundaries',
      'Distinguish Passive OSINT from Active Network Probing',
      'Document findings systematically for client executive reports'
    ],
    notesSummary: '### The 7 PTES Phases:\n1. Pre-engagement Interactions (Scope & RoE)\n2. Intelligence Gathering (OSINT & Recon)\n3. Threat Modeling\n4. Vulnerability Analysis\n5. Exploitation\n6. Post-Exploitation (PrivEsc, Lateral Movement, Looting)\n7. Reporting & Debriefing',
    instructor: 'TCM Security Instructor',
    channelName: 'The Cyber Mentor',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-pen-01-1',
        question: 'Why is a formal Rules of Engagement (RoE) document mandatory before conducting a penetration test?',
        options: [
          'To ensure the tester receives discount software licenses',
          'To establish legal authorization, in-scope target assets, testing windows, and emergency contacts',
          'To automate exploit delivery through cloud servers',
          'To bypass the need for client data backups'
        ],
        correctIndex: 1,
        explanation: 'Rules of Engagement provide written legal consent and explicitly outline authorized target IP ranges, out-of-scope systems, and testing rules.'
      },
      {
        id: 'q-pen-01-2',
        question: 'Which of the following activities is classified as Passive Reconnaissance?',
        options: [
          'Running aggressive Nmap port scans with -A',
          'Querying Certificate Transparency logs and public WHOIS records',
          'Sending SQL injection fuzz payloads to a web login',
          'Exploiting an unpatched FTP server with Metasploit'
        ],
        correctIndex: 1,
        explanation: 'Passive recon collects information from third-party databases (like DNS, CT logs, WHOIS) without sending direct packets to target servers.'
      },
      {
        id: 'q-pen-01-3',
        question: 'In penetration testing, what is the primary goal of Post-Exploitation?',
        options: [
          'To delete all system logs and leave no trace',
          'To evaluate the business impact of the compromise (access levels, data exposure, lateral risk)',
          'To reinstall the target server operating system',
          'To publish sensitive user data on social media'
        ],
        correctIndex: 1,
        explanation: 'Post-exploitation demonstrates the real-world risk and business impact of a vulnerability to the client.'
      }
    ],
    relatedLab: {
      id: 'lab-ace',
      name: 'ACE Client Engagement Simulator',
      route: '/ace',
      description: 'Execute a simulated penetration test engagement under strict Rules of Engagement.'
    },
    relatedMission: {
      id: 'mission-corp-breach',
      title: 'Operation: Blackout Perimeter',
      route: '/missions?id=mission-corp-breach',
      description: 'Conduct external perimeter penetration testing against a vulnerable enterprise gateway.'
    }
  },
  {
    id: 'vid-pen-02',
    title: 'Nmap Mastery: Advanced Port Scanning, Banner Grabbing & NSE Scripts',
    description: 'Deep dive into TCP SYN scans (-sS), UDP scanning (-sU), OS fingerprinting (-O), service versioning (-sV), and utilizing the Nmap Scripting Engine (NSE).',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=4t4kBkMsDbQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/4t4kBkMsDbQ',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    role: 'pentester',
    topic: 'Nmap & Network Enumeration',
    difficulty: 'Intermediate',
    duration: '28:40',
    durationSeconds: 1720,
    prerequisites: ['Networking fundamentals', 'TCP/IP Handshake'],
    tags: ['Nmap', 'Scanning', 'Enumeration', 'NSE', 'Recon'],
    learningObjectives: [
      'Execute stealth SYN scanning without establishing full TCP handshakes',
      'Identify service versions and vulnerable service banners with -sV',
      'Run targeted vulnerability detection scripts using --script vuln',
      'Optimize scan timing (-T4) and output formats (-oA) for reporting'
    ],
    notesSummary: '### Essential Nmap Command Cheatsheet:\n- `nmap -sS -sV -p- -T4 10.10.10.5`: Fast stealth full port scan with versions\n- `nmap -sU -top-ports 100 10.10.10.5`: UDP port enumeration\n- `nmap --script "vuln and safe" 10.10.10.5`: Automated vulnerability detection\n- `nmap -p 445 --script smb-enum-shares 10.10.10.5`: SMB share enumeration',
    instructor: 'NetworkChuck',
    channelName: 'NetworkChuck',
    order: 2,
    learningPathStage: 'Tool Mastery',
    quiz: [
      {
        id: 'q-pen-02-1',
        question: 'What is the advantage of using a TCP SYN scan (`-sS`) over a TCP Connect scan (`-sT`)?',
        options: [
          'SYN scans can bypass TLS encryption',
          'SYN scans do not complete the 3-way handshake, making them faster and less likely to be logged by simple applications',
          'SYN scans work without root or administrator privileges',
          'SYN scans automatically exploit buffer overflows'
        ],
        correctIndex: 1,
        explanation: 'SYN scanning is half-open; it sends a SYN and resets (RST) immediately upon receiving SYN-ACK, avoiding full connection state creation.'
      },
      {
        id: 'q-pen-02-2',
        question: 'Which Nmap option outputs scan results simultaneously in standard, XML, and grepable formats?',
        options: ['-oG', '-oX', '-oA <basename>', '-sV'],
        correctIndex: 2,
        explanation: '`-oA <basename>` writes output in all three major formats (.nmap, .xml, .gnmap) with a single command.'
      },
      {
        id: 'q-pen-02-3',
        question: 'When scanning UDP ports with `-sU`, why do open ports often take much longer to scan than TCP ports?',
        options: [
          'UDP packets travel at half the speed of light',
          'Open UDP services frequently do not respond with packets (open|filtered), requiring timeout retransmissions',
          'Nmap disables multi-threading for UDP scans',
          'Firewalls automatically convert UDP to TCP'
        ],
        correctIndex: 1,
        explanation: 'UDP is connectionless; unless a service responds with an application payload, Nmap must wait for timeouts to distinguish open from filtered ports.'
      }
    ],
    relatedLab: {
      id: 'lab-network',
      name: 'Network Recon & Port Scanner',
      route: '/network-lab',
      description: 'Run interactive Nmap scans and analyze open service vulnerabilities.'
    }
  },
  {
    id: 'vid-pen-03',
    title: 'Linux Privilege Escalation: SUID, Sudo Rights & Cron Exploitation',
    description: 'Learn the most common vectors for escalating from a low-privilege shell to root on Linux: SUID binaries, GTFOBins, vulnerable sudoers rules, and writable cron jobs.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=7tvvNf4s1g4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7tvvNf4s1g4',
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    role: 'pentester',
    topic: 'Privilege Escalation & Post-Exploitation',
    difficulty: 'Advanced',
    duration: '31:20',
    durationSeconds: 1880,
    prerequisites: ['Linux Command Line', 'Bash Scripting basics'],
    tags: ['PrivEsc', 'Linux', 'SUID', 'Sudo', 'GTFOBins', 'Root'],
    learningObjectives: [
      'Find misconfigured SUID binaries using find / -perm -u=s',
      'Leverage GTFOBins techniques to spawn root shells from utilities like vim or find',
      'Inspect sudo -l permissions for unquoted or wildcard command execution',
      'Identify and exploit writable root cron jobs and shared library hijacking'
    ],
    notesSummary: '### Linux PrivEsc Quick Commands:\n- `sudo -l`: View authorized sudo commands for current user\n- `find / -perm -4000 2>/dev/null`: Find SUID root binaries\n- `cat /etc/crontab`: View system-wide scheduled cron tasks\n- `uname -a`: Check Linux kernel version for known kernel exploits (Dirty COW, PwnKit)',
    instructor: 'John Hammond',
    channelName: 'John Hammond',
    order: 3,
    learningPathStage: 'Exploitation & Defense',
    quiz: [
      {
        id: 'q-pen-03-1',
        question: 'If `sudo -l` reveals that the user can run `/usr/bin/find` as root without a password, how can they spawn a root shell?',
        options: [
          'find . -exec /bin/sh \\; -quit',
          'find --make-root',
          'sudo find --delete-password',
          'find / -user admin -password'
        ],
        correctIndex: 0,
        explanation: 'The `-exec` flag in find allows executing arbitrary shell commands, which inherit root privilege when run via sudo.'
      },
      {
        id: 'q-pen-03-2',
        question: 'What is the security risk of setting the SUID bit on a binary owned by root?',
        options: [
          'It deletes the file after 24 hours',
          'Any user executing the binary runs it with the permissions of the file owner (root)',
          'It disables network connectivity for that application',
          'It forces the program to use TLS 1.0'
        ],
        correctIndex: 1,
        explanation: 'SUID (Set User ID) instructs the kernel to execute the program under the owner\'s UID rather than the calling user\'s UID.'
      },
      {
        id: 'q-pen-03-3',
        question: 'What is GTFOBins in penetration testing?',
        options: [
          'A hardware physical keylogger',
          'A curated repository of Unix binaries that can be exploited to bypass local security restrictions and escalate privileges',
          'A commercial antivirus scanner',
          'A firewall testing appliance'
        ],
        correctIndex: 1,
        explanation: 'GTFOBins is an open-source reference cataloging how standard legitimate Unix utilities can be weaponized for shell escapes and privesc.'
      }
    ],
    relatedLab: {
      id: 'lab-bandit',
      name: 'Linux Lab & Bandit Wargame',
      route: '/linux-lab',
      description: 'Practice Unix permission escalation and SUID identification in an active bash shell.'
    }
  },

  // =========================================================================
  // 3. WEB SECURITY TRACK
  // =========================================================================
  {
    id: 'vid-web-01',
    title: 'Web Application Security 101: HTTP Protocol, Cookies & Burp Suite',
    description: 'Learn how the web works under the hood: HTTP requests/responses, headers, methods, session management, cookies, and configuring Burp Suite as an intercepting proxy.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=2e_nF_Jg6_U',
    embedUrl: 'https://www.youtube-nocookie.com/embed/2e_nF_Jg6_U',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    role: 'web-security',
    topic: 'HTTP, Cookies & Burp Suite',
    difficulty: 'Beginner',
    duration: '21:10',
    durationSeconds: 1270,
    prerequisites: ['Basic HTML/Web understanding'],
    tags: ['Web Security', 'HTTP', 'Burp Suite', 'Cookies', 'OWASP'],
    learningObjectives: [
      'Intercept and modify HTTP traffic in real time using Burp Suite Proxy',
      'Understand HTTP Request Anatomy: Verb, Path, Headers, Body',
      'Analyze Session Cookies, HttpOnly, and SameSite security flags',
      'Repeat and manipulate API requests in Burp Repeater'
    ],
    notesSummary: '### Key Web Security Headers:\n- `HttpOnly`: Prevents JavaScript from reading `document.cookie` (mitigating XSS theft)\n- `Secure`: Cookie is only transmitted over HTTPS connections\n- `SameSite=Strict/Lax`: Defends against Cross-Site Request Forgery (CSRF)\n- `Content-Security-Policy (CSP)`: Restricts origins from which scripts/styles can load',
    instructor: 'LiveOverflow',
    channelName: 'LiveOverflow',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-web-01-1',
        question: 'What is the primary function of the `HttpOnly` flag on a session cookie?',
        options: [
          'It forces the browser to encrypt the cookie with AES-256',
          'It blocks client-side JavaScript from accessing the cookie via `document.cookie`',
          'It expires the cookie after 10 minutes of inactivity',
          'It automatically fills in user passwords'
        ],
        correctIndex: 1,
        explanation: '`HttpOnly` blocks client-side scripts from reading the cookie value, neutralizing cookie-stealing Cross-Site Scripting (XSS) attacks.'
      },
      {
        id: 'q-web-01-2',
        question: 'In Burp Suite, which tab is designed specifically to modify an intercepted HTTP request and resend it multiple times?',
        options: ['Decoder', 'Repeater', 'Sequencer', 'Comparer'],
        correctIndex: 1,
        explanation: 'Burp Repeater allows manually tweaking individual HTTP headers/parameters and inspecting the server\'s raw response.'
      },
      {
        id: 'q-web-01-3',
        question: 'Which HTTP response status code indicates an unauthorized access attempt due to missing or invalid credentials?',
        options: ['200 OK', '302 Found', '401 Unauthorized', '500 Internal Server Error'],
        correctIndex: 2,
        explanation: 'HTTP 401 Unauthorized indicates the request lacks valid authentication credentials for the requested resource.'
      }
    ],
    relatedLab: {
      id: 'lab-web',
      name: 'Web Security Sandbox',
      route: '/practice/web-security',
      description: 'Practice intercepting HTTP requests and testing authentication vulnerabilities.'
    }
  },
  {
    id: 'vid-web-02',
    title: 'SQL Injection: In-Band, Blind & Time-Based Exploitation',
    description: 'Understand how unparameterized database queries lead to SQL Injection (SQLi). Learn UNION-based extraction, Boolean-blind inference, and Time-based delays.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=ciNHn38EyRc',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ciNHn38EyRc',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    role: 'web-security',
    topic: 'SQL Injection & Data Extraction',
    difficulty: 'Intermediate',
    duration: '27:50',
    durationSeconds: 1670,
    prerequisites: ['SQL query basics (SELECT, FROM, WHERE)'],
    tags: ['SQLi', 'Database', 'OWASP Top 10', 'Exploitation', 'Web'],
    learningObjectives: [
      'Identify SQL injection entry points in web form parameters and URLs',
      'Determine column count and data types using ORDER BY and UNION SELECT',
      'Extract database schema tables and columns from information_schema',
      'Remediate SQL injection using Prepared Statements (Parameterized Queries)'
    ],
    notesSummary: '### SQL Injection Payloads & Concepts:\n- Auth Bypass: `\' OR 1=1 -- -`\n- Column Enumeration: `\' ORDER BY 1, 2, 3 -- -`\n- UNION Data Extraction: `\' UNION SELECT null, username, password FROM users -- -`\n- Best Defense: Always use parameterized queries / prepared statements!',
    instructor: 'Rana Khalil',
    channelName: 'Rana Khalil',
    order: 2,
    learningPathStage: 'Core Skills',
    quiz: [
      {
        id: 'q-web-02-1',
        question: 'What is the industry standard and most effective defense against SQL Injection vulnerabilities?',
        options: [
          'Using a Web Application Firewall (WAF) only',
          'Parameterized queries (Prepared Statements)',
          'Blacklisting single quote characters with regex',
          'Hashing the database user password'
        ],
        correctIndex: 1,
        explanation: 'Parameterized queries ensure user input is treated strictly as data rather than executable SQL command syntax.'
      },
      {
        id: 'q-web-02-2',
        question: 'When performing a UNION-based SQL injection, what must match between the original query and the injected query?',
        options: [
          'The exact name of the target database table',
          'The number and compatible data types of the columns returned',
          'The primary key index of the users table',
          'The server IP address'
        ],
        correctIndex: 1,
        explanation: 'SQL UNION requires that both queries return identical column counts with compatible data types.'
      },
      {
        id: 'q-web-02-3',
        question: 'What distinguishes Blind SQL Injection from classic In-Band SQL Injection?',
        options: [
          'Blind SQLi only works on mobile devices',
          'In Blind SQLi, data is not printed directly to the screen; results must be inferred via Boolean responses or time delays',
          'Blind SQLi does not require single quotes',
          'Blind SQLi cannot extract database contents'
        ],
        correctIndex: 1,
        explanation: 'Blind SQLi occurs when the application is vulnerable but does not display SQL error messages or result sets directly in HTTP responses.'
      }
    ],
    relatedLab: {
      id: 'lab-web',
      name: 'Web Security Sandbox',
      route: '/practice/web-security',
      description: 'Execute hands-on SQL injection payloads in a secure sandbox database.'
    }
  },
  {
    id: 'vid-web-03',
    title: 'Cross-Site Scripting (XSS): Reflected, Stored & DOM-Based',
    description: 'Explore the mechanics of client-side code execution via XSS. Learn payload construction, bypassing basic filters, stealing session tokens, and modern CSP mitigations.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=EoaDgJP460A',
    embedUrl: 'https://www.youtube-nocookie.com/embed/EoaDgJP460A',
    thumbnail: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80',
    role: 'web-security',
    topic: 'XSS & Client-Side Attacks',
    difficulty: 'Intermediate',
    duration: '25:15',
    durationSeconds: 1515,
    prerequisites: ['HTML & JavaScript basics'],
    tags: ['XSS', 'JavaScript', 'OWASP', 'Client-Side', 'Web Security'],
    learningObjectives: [
      'Distinguish Stored XSS (persistent) from Reflected XSS (non-persistent)',
      'Inspect DOM sinks and sources leading to DOM-based XSS execution',
      'Demonstrate the security impact of session hijacking and credential harvesting',
      'Implement context-aware output encoding and Content Security Policy (CSP)'
    ],
    notesSummary: '### Types of XSS:\n1. **Reflected**: User input is immediately echoed in the HTTP response (via query params).\n2. **Stored**: Malicious script is saved in the database (e.g., comment/profile) and executed on all visitors.\n3. **DOM-based**: Vulnerability exists purely in client-side JS manipulating the DOM (e.g., `eval()`, `innerHTML`, `location.hash`).',
    instructor: 'LiveOverflow',
    channelName: 'LiveOverflow',
    order: 3,
    learningPathStage: 'Tool Mastery',
    quiz: [
      {
        id: 'q-web-03-1',
        question: 'Which type of Cross-Site Scripting vulnerability stores the malicious script permanently in the server database?',
        options: ['Reflected XSS', 'Stored XSS', 'DOM-based XSS', 'Self XSS'],
        correctIndex: 1,
        explanation: 'Stored XSS persists in backend storage (e.g., blog comments, user bios) and executes whenever subsequent users view the data.'
      },
      {
        id: 'q-web-03-2',
        question: 'Which JavaScript property is vulnerable to DOM XSS if populated with unsanitized user input?',
        options: ['element.textContent', 'element.innerHTML', 'console.log', 'document.title'],
        correctIndex: 1,
        explanation: 'Assigning untrusted data directly to `innerHTML` causes the browser to parse and execute any HTML/JavaScript tags inside it.'
      },
      {
        id: 'q-web-03-3',
        question: 'What is the primary method to prevent Cross-Site Scripting across web applications?',
        options: [
          'Encrypting the database with AES',
          'Context-aware output encoding and strict Content Security Policy (CSP)',
          'Disabling CSS styles',
          'Setting all ports to 443'
        ],
        correctIndex: 1,
        explanation: 'Encoding output before rendering in HTML/JavaScript contexts prevents user input from being interpreted as code.'
      }
    ],
    relatedLab: {
      id: 'lab-web',
      name: 'Web Security Sandbox',
      route: '/practice/web-security',
      description: 'Test Reflected and Stored XSS filter bypasses.'
    }
  },

  // =========================================================================
  // 4. DIGITAL FORENSICS TRACK
  // =========================================================================
  {
    id: 'vid-dfir-01',
    title: 'Digital Forensics & Incident Investigation: Evidence Acquisition & Chain of Custody',
    description: 'Learn the principles of digital forensics: Order of Volatility, write-blockers, bit-stream disk imaging (dd, FTK Imager), and maintaining cryptographic chain of custody.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=Vl8dCj8sV_Y',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Vl8dCj8sV_Y',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    role: 'digital-forensics',
    topic: 'Evidence Acquisition & Chain of Custody',
    difficulty: 'Beginner',
    duration: '22:40',
    durationSeconds: 1360,
    prerequisites: ['Basic OS architecture'],
    tags: ['Forensics', 'DFIR', 'Evidence', 'Chain of Custody', 'FTK Imager'],
    learningObjectives: [
      'Understand the RFC 3227 Order of Volatility (Registers -> RAM -> Disk -> Backups)',
      'Create bit-by-bit raw forensic images using write-blocking hardware',
      'Calculate MD5 and SHA256 hashes to verify forensic integrity',
      'Document legal chain of custody logs for court admissibility'
    ],
    notesSummary: '### RFC 3227 Order of Volatility (Most to Least Volatile):\n1. CPU registers & cache\n2. System RAM & ARP/routing tables\n3. Temporary file storage (pagefile/swap)\n4. Hard disks & solid-state storage\n5. Remote logs & network backups\n6. Physical archival media',
    instructor: 'DFIR Science Instructor',
    channelName: '13Cubed',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-dfir-01-1',
        question: 'According to the RFC 3227 Order of Volatility, which data must be acquired first during an active breach investigation?',
        options: [
          'Archived tape backups',
          'Physical system RAM and volatile network connections',
          'Internal hard drive filesystems',
          'Offsite printer spool logs'
        ],
        correctIndex: 1,
        explanation: 'RAM is highly volatile and lost when power is disconnected, so it must be captured before powered down or disk acquired.'
      },
      {
        id: 'q-dfir-01-2',
        question: 'Why do forensic investigators use hardware write-blockers when copying suspect hard drives?',
        options: [
          'To increase data transfer speeds over USB',
          'To ensure the forensic workstation makes zero modifications to the original suspect storage media',
          'To automatically crack drive encryption',
          'To bypass BIOS administrator passwords'
        ],
        correctIndex: 1,
        explanation: 'Write blockers prevent the operating system from altering metadata (like access timestamps) on suspect evidence.'
      },
      {
        id: 'q-dfir-01-3',
        question: 'What mathematical property is used to prove that a forensic disk image is identical to the original evidence drive?',
        options: ['Hamming Distance', 'Cryptographic Hash Match (e.g., SHA-256)', 'File Count Comparison', 'Volume Serial Check'],
        correctIndex: 1,
        explanation: 'Matching cryptographic hashes (MD5 / SHA-256) mathematically proves the acquired image is a bit-for-bit exact copy.'
      }
    ],
    relatedLab: {
      id: 'lab-threat',
      name: 'Threat Hunting & Artifact Lab',
      route: '/practice/threat-hunting',
      description: 'Examine disk artifacts, timestamps, and memory dumps for signs of compromise.'
    }
  },
  {
    id: 'vid-dfir-02',
    title: 'Memory Forensics with Volatility 3: Analyzing RAM Dumps for Malware',
    description: 'Learn how to analyze raw RAM dumps using Volatility 3: listing running processes (`pslist`, `pstree`), detecting injected DLLs (`malfind`), and extracting network sockets (`netscan`).',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=Gk6rW3q3H2M',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Gk6rW3q3H2M',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    role: 'digital-forensics',
    topic: 'Memory Forensics & Volatility',
    difficulty: 'Advanced',
    duration: '29:45',
    durationSeconds: 1785,
    prerequisites: ['Windows Architecture', 'DFIR Acquisition Basics'],
    tags: ['Volatility', 'Memory Forensics', 'RAM', 'Malware Analysis', 'DFIR'],
    learningObjectives: [
      'Navigate Volatility 3 plugins for Windows memory dump analysis',
      'Detect hollowed and unlinked processes hidden from Task Manager',
      'Identify memory sections with PAGE_EXECUTE_READWRITE permissions via malfind',
      'Extract injected DLL payloads and command-line parameters from memory'
    ],
    notesSummary: '### Volatility 3 Windows Plugins:\n- `windows.pslist`: Lists active processes from the EPROCESS linked list\n- `windows.pstree`: Displays hierarchical parent-child relationships\n- `windows.malfind`: Highlights suspicious executable memory segments (RWX)\n- `windows.netscan`: Scans pool tags for active and closed TCP/UDP connections\n- `windows.cmdline`: Extracts process launch arguments',
    instructor: '13Cubed Specialist',
    channelName: '13Cubed',
    order: 2,
    learningPathStage: 'Tool Mastery',
    quiz: [
      {
        id: 'q-dfir-02-1',
        question: 'Which Volatility plugin is designed to identify suspicious memory sections containing injected shellcode or unmapped code?',
        options: ['windows.malfind', 'windows.registry', 'windows.clipboard', 'windows.timezones'],
        correctIndex: 0,
        explanation: '`malfind` searches for memory pages allocated with PAGE_EXECUTE_READWRITE permissions containing executable code headers.'
      },
      {
        id: 'q-dfir-02-2',
        question: 'Why would an attacker perform process hollowing on `svchost.exe`?',
        options: [
          'To make the computer run faster',
          'To hide malicious code execution inside a legitimate, trusted Windows system process',
          'To bypass the Windows volume control',
          'To disable the graphics card'
        ],
        correctIndex: 1,
        explanation: 'Process hollowing replaces legitimate memory inside trusted processes (like svchost.exe or explorer.exe) to evade detection.'
      },
      {
        id: 'q-dfir-02-3',
        question: 'What is the primary benefit of Volatility 3 over Volatility 2?',
        options: [
          'Volatility 3 has a graphical user interface',
          'Volatility 3 eliminates the need to guess or specify kernel profiles (automated symbol resolution via Symbol Tables)',
          'Volatility 3 is only available for macOS',
          'Volatility 3 can predict future attacks'
        ],
        correctIndex: 1,
        explanation: 'Volatility 3 automates symbol and kernel data structure resolution using intermediate Symbol Tables (ISF), removing profile guessing.'
      }
    ],
    relatedLab: {
      id: 'lab-threat',
      name: 'Threat Hunting & Artifact Lab',
      route: '/practice/threat-hunting',
      description: 'Analyze volatility memory outputs to uncover hidden C2 beaconing processes.'
    }
  },

  // =========================================================================
  // 5. CLOUD SECURITY TRACK
  // =========================================================================
  {
    id: 'vid-cloud-01',
    title: 'Cloud Security Fundamentals: AWS IAM, Least Privilege & Misconfigurations',
    description: 'Learn cloud security principles across AWS, Azure, and GCP. Master IAM policies, principle of least privilege, S3 bucket permissions, and CloudTrail auditing.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=ubCNZph_9X4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ubCNZph_9X4',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    role: 'cloud-security',
    topic: 'AWS IAM & Storage Security',
    difficulty: 'Beginner',
    duration: '23:30',
    durationSeconds: 1410,
    prerequisites: ['Basic Cloud Computing concepts'],
    tags: ['Cloud Security', 'AWS', 'IAM', 'S3', 'CloudTrail'],
    learningObjectives: [
      'Design role-based IAM policies adhering to the Principle of Least Privilege',
      'Audit AWS S3 storage buckets for dangerous public read/write permissions',
      'Enable CloudTrail and GuardDuty for continuous threat detection',
      'Prevent root account API key exposure in code repositories'
    ],
    notesSummary: '### Cloud Security Golden Rules:\n1. **Never use the Root Account** for daily tasks; enforce MFA on root.\n2. **Enforce Least Privilege**: Avoid wildcards (`Action: "*"`, `Resource: "*"`) in IAM policies.\n3. **Block Public S3 Access**: Enable account-level S3 Block Public Access.\n4. **Audit Logs**: Maintain multi-region CloudTrail logs in a dedicated security account.',
    instructor: 'freeCodeCamp Cloud Specialist',
    channelName: 'freeCodeCamp.org',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-cloud-01-1',
        question: 'In AWS IAM, what is considered a critical security violation in policy definitions?',
        options: [
          'Setting policy version to "2012-10-17"',
          'Using wildcard Administrator permissions (`Effect: Allow`, `Action: *`, `Resource: *`) on standard user roles',
          'Attaching policies to IAM Groups rather than individuals',
          'Enforcing Multi-Factor Authentication'
        ],
        correctIndex: 1,
        explanation: 'Wildcard administrator permissions grant total control over all cloud services, violating the Principle of Least Privilege.'
      },
      {
        id: 'q-cloud-01-2',
        question: 'Which AWS service records all API calls made within an AWS account for forensic and auditing purposes?',
        options: ['AWS CloudWatch', 'AWS CloudTrail', 'Amazon DynamoDB', 'AWS Lambda'],
        correctIndex: 1,
        explanation: 'AWS CloudTrail records user identity, timestamp, IP address, and parameters for every API call in the AWS environment.'
      },
      {
        id: 'q-cloud-01-3',
        question: 'What is the Shared Responsibility Model in cloud security?',
        options: [
          'The customer and cloud provider share computing power equally',
          'The cloud provider secures the cloud infrastructure (hardware, data centers), while the customer secures data, IAM, and configurations in the cloud',
          'The government is responsible for paying all cloud server costs',
          'Security is exclusively the responsibility of the cloud provider'
        ],
        correctIndex: 1,
        explanation: 'The cloud provider secures the infrastructure "of" the cloud, while the customer is responsible for security "in" the cloud.'
      }
    ],
    relatedLab: {
      id: 'lab-soc-sim',
      name: 'SOC SIEM & Alert Simulator',
      route: '/practice/soc-simulator',
      description: 'Audit simulated cloud access logs for credential misuse.'
    }
  },

  // =========================================================================
  // 6. THREAT HUNTER TRACK
  // =========================================================================
  {
    id: 'vid-th-01',
    title: 'Hypothesis-Driven Threat Hunting & MITRE ATT&CK Framework',
    description: 'Learn proactive threat hunting methodologies: forming actionable hypotheses, mapping adversary TTPs to MITRE ATT&CK, writing Sigma rules, and hunting for persistence.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=9_fQj-Z7K68',
    embedUrl: 'https://www.youtube-nocookie.com/embed/9_fQj-Z7K68',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    role: 'threat-hunter',
    topic: 'MITRE ATT&CK & Threat Hunting',
    difficulty: 'Intermediate',
    duration: '26:50',
    durationSeconds: 1610,
    prerequisites: ['SOC Fundamentals', 'SIEM Query basics'],
    tags: ['Threat Hunting', 'MITRE ATT&CK', 'Sigma', 'TTPs', 'YARA'],
    learningObjectives: [
      'Formulate hypothesis-driven threat hunting models from threat intelligence',
      'Navigate the MITRE ATT&CK Enterprise Matrix to identify adversary techniques',
      'Convert Sigma detection rules into SIEM query formats',
      'Hunt for scheduled tasks, run keys, and WMI persistence mechanisms'
    ],
    notesSummary: '### Threat Hunting Core Steps:\n1. **Hypothesis Formulation**: e.g., "Adversaries are using unmanaged PowerShell to establish Scheduled Task persistence."\n2. **Telemetry Collection**: Gather Sysmon Event ID 1 (Process Create) & Event ID 11 (File Create).\n3. **Investigation & Baselining**: Filter known administrative scripts.\n4. **Response & Rule Hardening**: Convert successful hunts into automated SIEM detection rules.',
    instructor: 'Black Hills Information Security',
    channelName: 'Black Hills InfoSec',
    order: 1,
    learningPathStage: 'Core Skills',
    quiz: [
      {
        id: 'q-th-01-1',
        question: 'What is the primary difference between Reactive SOC Monitoring and Proactive Threat Hunting?',
        options: [
          'Threat hunting uses antivirus while SOC monitoring does not',
          'Threat hunting proactively searches for undetected adversaries without waiting for an automated alert to fire',
          'SOC monitoring is only performed on weekends',
          'Threat hunting is performed exclusively by law enforcement'
        ],
        correctIndex: 1,
        explanation: 'Threat hunters operate under the assumption of breach, actively seeking stealthy adversary activity that evaded automated alerts.'
      },
      {
        id: 'q-th-01-2',
        question: 'In the MITRE ATT&CK framework, what is the relationship between Tactics and Techniques?',
        options: [
          'Tactics describe "why" or the adversary\'s objective; Techniques describe "how" they achieve that objective',
          'Tactics are for hardware; Techniques are for software',
          'Techniques are only used by red teams; Tactics are only for blue teams',
          'They are identical synonyms'
        ],
        correctIndex: 0,
        explanation: 'Tactics represent the high-level goal (e.g., Persistence, Lateral Movement), while Techniques detail the exact method (e.g., Scheduled Task/Job).'
      },
      {
        id: 'q-th-01-3',
        question: 'What is the purpose of the open-source Sigma project in threat detection?',
        options: [
          'To replace Python with a new programming language',
          'To provide a generic, vendor-agnostic signature format that can be converted into queries for Splunk, Elastic, QRadar, and Sentinel',
          'To generate fake user passwords',
          'To encrypt hard drives'
        ],
        correctIndex: 1,
        explanation: 'Sigma is a standardized rule format allowing researchers to describe log detection signatures once and translate them into any SIEM query syntax.'
      }
    ],
    relatedLab: {
      id: 'lab-threat',
      name: 'Threat Hunting & Artifact Lab',
      route: '/practice/threat-hunting',
      description: 'Hunt for living-off-the-land binaries (LOLBins) across network telemetry.'
    }
  },

  // =========================================================================
  // 7. ACTIVE DIRECTORY / ENTERPRISE SECURITY
  // =========================================================================
  {
    id: 'vid-ad-01',
    title: 'Active Directory Attacks & Defense: Kerberoasting, AS-REP & BloodHound',
    description: 'Master the mechanics of enterprise Active Directory exploitation and defense: Kerberos TGT/TGS tickets, Kerberoasting service accounts, AS-REP roasting, and BloodHound graph analysis.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=d_k8F7f1u3c',
    embedUrl: 'https://www.youtube-nocookie.com/embed/d_k8F7f1u3c',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    role: 'active-directory',
    topic: 'Active Directory & Kerberos Attacks',
    difficulty: 'Intermediate',
    duration: '32:10',
    durationSeconds: 1930,
    prerequisites: ['Windows Server basics', 'Kerberos authentication concepts'],
    tags: ['Active Directory', 'Kerberoasting', 'BloodHound', 'Kerberos', 'PrivEsc'],
    learningObjectives: [
      'Understand the 3-step Kerberos authentication flow (AS-REQ/AS-REP, TGS-REQ/TGS-REP)',
      'Perform Kerberoasting against accounts with registered Service Principal Names (SPNs)',
      'Map shortest attack paths to Domain Admin using BloodHound and Cypher queries',
      'Implement Group Managed Service Accounts (gMSA) to neutralize Kerberoasting'
    ],
    notesSummary: '### Kerberos Attack Essentials:\n- **AS-REP Roasting**: Targets user accounts with `Do not require Kerberos preauthentication` enabled.\n- **Kerberoasting**: Requests TGS tickets for accounts with SPNs; cracks the RC4/AES encrypted ticket offline with Hashcat.\n- **Mitigation**: Use gMSAs (managed 120-character random passwords) or AES-256 with 25+ character complex passwords for service accounts.',
    instructor: 'The Cyber Mentor',
    channelName: 'The Cyber Mentor',
    order: 1,
    learningPathStage: 'Core Skills',
    quiz: [
      {
        id: 'q-ad-01-1',
        question: 'Why does Kerberoasting allow an attacker to request ticket hashes without needing elevated administrative privileges?',
        options: [
          'Any authenticated domain user is legitimately allowed to request a TGS ticket for any valid Service Principal Name (SPN)',
          'Kerberos has no authentication mechanism',
          'Service Principal Names are stored in plaintext on public web servers',
          'Kerberoasting only works if the attacker is physically in the server room'
        ],
        correctIndex: 0,
        explanation: 'In Active Directory, any valid domain account can request a service ticket (TGS) for any service, which is encrypted with the service account\'s NTLM hash.'
      },
      {
        id: 'q-ad-01-2',
        question: 'What is the primary function of the BloodHound tool in Active Directory security assessments?',
        options: [
          'To brute-force Wi-Fi passwords',
          'To map Active Directory relationships, permissions, and shortest attack paths to Domain Admin using graph theory',
          'To install Microsoft Exchange updates',
          'To monitor CPU clock frequencies'
        ],
        correctIndex: 1,
        explanation: 'BloodHound uses graph theory to reveal unintended permission chains (like GenericAll, WriteDacl, MemberOf) leading to domain escalation.'
      },
      {
        id: 'q-ad-01-3',
        question: 'What is the most effective defense to protect Active Directory service accounts against Kerberoasting?',
        options: [
          'Disabling all firewalls',
          'Deploying Group Managed Service Accounts (gMSAs) with automatic 120-character rotating passwords',
          'Deleting the Domain Controller',
          'Changing domain user passwords to 4 digits'
        ],
        correctIndex: 1,
        explanation: 'gMSAs use complex, automatically rotated 120-character passwords that cannot be practically cracked offline.'
      }
    ],
    relatedLab: {
      id: 'lab-ace',
      name: 'ACE Client Engagement Simulator',
      route: '/ace',
      description: 'Audit enterprise Active Directory permissions and domain trusts.'
    }
  },

  // =========================================================================
  // 8. SECURITY PYTHON DEVELOPER
  // =========================================================================
  {
    id: 'vid-py-01',
    title: 'Python for Cybersecurity: Socket Programming, Port Scanners & Scapy Packet Crafting',
    description: 'Learn how to write custom offensive and defensive tools in Python: building raw TCP socket port scanners, banner grabbers, parsing PCAPs, and crafting custom packets with Scapy.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=7lmCu8wz8ro',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7lmCu8wz8ro',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    role: 'security-python',
    topic: 'Python Sockets & Scapy',
    difficulty: 'Beginner',
    duration: '27:15',
    durationSeconds: 1635,
    prerequisites: ['Python basics (variables, loops, functions)'],
    tags: ['Python', 'Automation', 'Scapy', 'Sockets', 'Tool Building'],
    learningObjectives: [
      'Build multi-threaded TCP port scanners using Python\'s socket library',
      'Craft custom IP/TCP/UDP packets and send SYN probes using Scapy',
      'Automate threat intelligence IP lookups and reputation checks via APIs',
      'Parse web server responses and extract security headers with requests'
    ],
    notesSummary: '### Python Socket & Scapy Cheatsheet:\n```python\nimport socket\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.settimeout(1.0)\nresult = s.connect_ex((\'10.10.10.5\', 80))\nif result == 0: print(\'Port 80 is OPEN\')\ns.close()\n```',
    instructor: 'freeCodeCamp Developer',
    channelName: 'freeCodeCamp.org',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-py-01-1',
        question: 'In Python\'s `socket` module, what does `socket.connect_ex()` return when a connection to the target port is successful?',
        options: ['1', '0', '-1', 'True'],
        correctIndex: 1,
        explanation: '`connect_ex()` returns 0 on success (matching C-style socket semantics) rather than raising an exception.'
      },
      {
        id: 'q-py-01-2',
        question: 'What is the powerful Python library used by security professionals to forge, sniff, dissect, and inject custom network packets?',
        options: ['Pandas', 'Scapy', 'Django', 'Flask'],
        correctIndex: 1,
        explanation: 'Scapy is a Python packet manipulation program and library capable of crafting custom network layers from Ethernet to application protocols.'
      },
      {
        id: 'q-py-01-3',
        question: 'Why is multithreading or asynchronous I/O (asyncio) essential when writing a Python port scanner for large subnets?',
        options: [
          'It makes the code legal to run',
          'Sequential single-threaded scanning must wait for connection timeouts on every closed port, making subnet scans unacceptably slow',
          'Python cannot send TCP packets on a single thread',
          'It bypasses target antivirus'
        ],
        correctIndex: 1,
        explanation: 'Concurrent workers allow probing hundreds of ports simultaneously rather than waiting seconds per closed port timeout.'
      }
    ],
    relatedLab: {
      id: 'lab-network',
      name: 'Network Recon & Port Scanner',
      route: '/network-lab',
      description: 'Observe packet streams and test automated port scanner scripts.'
    }
  },

  // =========================================================================
  // 9. INCIDENT RESPONDER TRACK
  // =========================================================================
  {
    id: 'vid-ir-01',
    title: 'Incident Response Lifecycle: NIST SP 800-61 & Ransomware Triage',
    description: 'Learn the official NIST and SANS Incident Response lifecycle: Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Post-Incident Activity (Lessons Learned).',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=0_nF2Xgq8Vw',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0_nF2Xgq8Vw',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    role: 'incident-responder',
    topic: 'NIST IR Lifecycle & Ransomware Playbooks',
    difficulty: 'Beginner',
    duration: '25:40',
    durationSeconds: 1540,
    prerequisites: ['Basic SOC & OS understanding'],
    tags: ['Incident Response', 'NIST', 'Ransomware', 'Containment', 'Playbooks'],
    learningObjectives: [
      'Master the 6 phases of the NIST SP 800-61 incident response standard',
      'Execute network isolation and endpoint containment playbooks during live ransomware',
      'Preserve critical volatile memory evidence before rebooting compromised hosts',
      'Lead Post-Incident Lessons Learned reviews to close root-cause security gaps'
    ],
    notesSummary: '### NIST SP 800-61 IR Phases:\n1. **Preparation**: Tools, playbooks, communication channels, out-of-band backups.\n2. **Detection & Analysis**: Verifying scope, identifying initial access vector (patient zero).\n3. **Containment**: Network isolation, disabling compromised credentials, blocking C2 domains.\n4. **Eradication**: Removing backdoors, deleting persistence artifacts, patching vulnerabilities.\n5. **Recovery**: Restoring clean systems from verified offline backups.\n6. **Post-Incident Activity**: Documenting lessons learned, tuning detection rules.',
    instructor: 'Cyber Security Operations Specialist',
    channelName: 'SANS Institute',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-ir-01-1',
        question: 'During an active ransomware outbreak, why is immediately powering off or rebooting infected servers considered a major mistake?',
        options: [
          'Rebooting makes the ransomware spread 100x faster',
          'Powering down destroys volatile memory (RAM), erasing active encryption keys, malware processes, and network socket evidence',
          'It voids the computer manufacturer warranty',
          'Servers cannot be turned on once turned off'
        ],
        correctIndex: 1,
        explanation: 'Volatile RAM contains crucial forensic artifacts, active C2 connections, and potentially memory-resident decryption keys.'
      },
      {
        id: 'q-ir-01-2',
        question: 'What is the primary objective of the "Containment" phase in the NIST incident response lifecycle?',
        options: [
          'To sue the threat actors in court',
          'To prevent the spread of the incident and limit further damage to critical business assets',
          'To purchase replacement laptops',
          'To erase all system backups'
        ],
        correctIndex: 1,
        explanation: 'Containment limits the blast radius of the attack (e.g., isolating endpoints from the network) while preserving evidence for analysis.'
      },
      {
        id: 'q-ir-01-3',
        question: 'What is the term used to describe the first compromised device in an enterprise breach?',
        options: ['Patient Zero (Initial Access Host)', 'Master Controller', 'Root Gateway', 'Primary Node'],
        correctIndex: 0,
        explanation: 'Patient Zero refers to the initial entry point or first machine compromised by the adversary.'
      }
    ],
    relatedLab: {
      id: 'lab-live-incidents',
      name: 'Live Incident Response Center',
      route: '/live-incidents',
      description: 'Triage live unfolding security breaches and execute containment steps.'
    },
    relatedMission: {
      id: 'mission-ransomware-outbreak',
      title: 'Operation: Dark Crypt',
      route: '/missions?id=mission-ransomware-outbreak',
      description: 'Isolate an active ransomware lateral movement infection across corporate servers.'
    }
  },

  // =========================================================================
  // 10. CTF & ETHICAL HACKER TRACK
  // =========================================================================
  {
    id: 'vid-ctf-01',
    title: 'CTF Player Masterclass: Web Exploitation, Cryptography & Reverse Engineering',
    description: 'Learn the mindset and essential toolkit for dominating Capture The Flag (CTF) competitions: Ghidra decompilation, CyberChef decoding, Python pwntools, and flag extraction tricks.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3Kq1MIfTWCE',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    role: 'ctf-ethical-hacker',
    topic: 'CTF Tactics & Ghidra Reversing',
    difficulty: 'Intermediate',
    duration: '28:10',
    durationSeconds: 1690,
    prerequisites: ['Linux CLI', 'Basic C / Python comprehension'],
    tags: ['CTF', 'Ghidra', 'Pwntools', 'CyberChef', 'Reverse Engineering'],
    learningObjectives: [
      'Decompile ELF binaries using NSA Ghidra and identify hardcoded flag comparisons',
      'Chain multi-step decoders and cryptographic recipes in CyberChef',
      'Script automated remote buffer overflow exploits with Python pwntools',
      'Inspect steganography artifacts inside PNG/JPEG files using binwalk and steghide'
    ],
    notesSummary: '### CTF Essential Swiss Army Knife:\n- **CyberChef**: "The Cyber Swiss Army Knife" for Base64, Hex, XOR, Rot13, and hashing\n- **Ghidra**: Free reverse engineering framework for decompiling x86/x64 binaries\n- **Pwntools**: Python library for rapid CTF exploit prototyping (`remote()`, `p32()`, `p64()`)\n- **Binwalk**: Searches binaries and firmware images for embedded compressed files',
    instructor: 'John Hammond',
    channelName: 'John Hammond',
    order: 1,
    learningPathStage: 'Core Skills',
    quiz: [
      {
        id: 'q-ctf-01-1',
        question: 'Which tool is known as "The Cyber Swiss Army Knife" for decoding obscure formats, Base64, XOR, and hex in the browser?',
        options: ['CyberChef', 'Wireshark', 'Metasploit', 'Nmap'],
        correctIndex: 0,
        explanation: 'CyberChef is an open-source web app for decoding, converting, and transforming complex data recipes.'
      },
      {
        id: 'q-ctf-01-2',
        question: 'What is the purpose of the `binwalk` command-line utility in CTF challenges?',
        options: [
          'To format Linux partitions',
          'To analyze, reverse engineer, and extract hidden files/filesystems embedded inside firmware or images',
          'To measure battery health',
          'To generate secure random numbers'
        ],
        correctIndex: 1,
        explanation: '`binwalk` scans file signatures to identify and automatically extract embedded zip files, PNGs, or file systems.'
      },
      {
        id: 'q-ctf-01-3',
        question: 'In binary reverse engineering, what does a decompiler like Ghidra do?',
        options: [
          'Deletes the binary file from disk',
          'Translates low-level machine assembly code back into high-level pseudo-C code for easier human reading',
          'Encrypts the binary with RSA-4096',
          'Increases the CPU clock speed'
        ],
        correctIndex: 1,
        explanation: 'Decompilers analyze assembly instructions and reconstruct readable C pseudo-code functions.'
      }
    ],
    relatedLab: {
      id: 'lab-ctf-arena',
      name: 'CTF Challenge Arena',
      route: '/ctf-arena',
      description: 'Solve real jeopardy-style CTF challenges and submit captured flags.'
    }
  },

  // =========================================================================
  // 11. BEGINNER / EXPLORE TRACK
  // =========================================================================
  {
    id: 'vid-beg-01',
    title: 'Cybersecurity for Beginners: How Hackers Break into Computers & How to Stop Them',
    description: 'An engaging, accessible introduction to cybersecurity: the CIA Triad (Confidentiality, Integrity, Availability), social engineering, password security, the OSI model, and starting your career.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/inWWhr5tnEA',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    role: 'beginner-explore',
    topic: 'Cybersecurity 101 & CIA Triad',
    difficulty: 'Beginner',
    duration: '19:30',
    durationSeconds: 1170,
    prerequisites: ['None! Perfect for absolute beginners'],
    tags: ['Beginner', 'Cybersecurity 101', 'CIA Triad', 'Passwords', 'Fundamentals'],
    learningObjectives: [
      'Understand the 3 pillars of the CIA Triad: Confidentiality, Integrity, Availability',
      'Learn how Phishing and Social Engineering manipulate human psychology',
      'Implement multi-factor authentication (MFA) and password managers',
      'Explore the defensive Blue Team vs offensive Red Team career pathways'
    ],
    notesSummary: '### The CIA Triad Explained:\n- **Confidentiality**: Ensuring sensitive data is only accessible to authorized individuals (Encryption, Access Control).\n- **Integrity**: Ensuring data has not been altered or tampered with in transit or storage (Hashes, Signatures).\n- **Availability**: Ensuring systems and services remain operational and accessible when needed (Redundancy, Backups, DDoS Defense).',
    instructor: 'NetworkChuck',
    channelName: 'NetworkChuck',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-beg-01-1',
        question: 'What are the three core principles of the CIA Triad in information security?',
        options: [
          'Central Intelligence Agency',
          'Confidentiality, Integrity, Availability',
          'Computers, Internet, Authentication',
          'Crypto, IP, Antivirus'
        ],
        correctIndex: 1,
        explanation: 'Confidentiality, Integrity, and Availability form the foundational model guiding all information security policies.'
      },
      {
        id: 'q-beg-01-2',
        question: 'Which of the following is an example of Multi-Factor Authentication (MFA)?',
        options: [
          'Typing your password twice in the same form',
          'Entering your password (something you know) plus a dynamic code from an authenticator app (something you have)',
          'Writing your password on a sticky note under the keyboard',
          'Using a longer 20-character password without special symbols'
        ],
        correctIndex: 1,
        explanation: 'MFA requires two or more distinct authentication factors: something you know (password), something you have (token/app), or something you are (biometrics).'
      },
      {
        id: 'q-beg-01-3',
        question: 'What is Social Engineering in the context of cyber attacks?',
        options: [
          'Building social media applications with React',
          'Manipulating people into voluntarily giving up confidential information or clicking malicious links',
          'Configuring enterprise routers in a network closet',
          'Encrypting hard drives with BitLocker'
        ],
        correctIndex: 1,
        explanation: 'Social engineering targets human psychology rather than software flaws, tricking users via phishing, pretexting, or impersonation.'
      }
    ],
    relatedLab: {
      id: 'lab-modules',
      name: 'Interactive Modules Hub',
      route: '/modules',
      description: 'Start with hands-on foundational cybersecurity and Linux lessons.'
    }
  }
];

export const VIDEO_TOPICS = Array.from(new Set(VIDEO_LEARNING_DATA.map(v => v.topic)));

export function getAllVideos(): VideoItem[] {
  return VIDEO_LEARNING_DATA;
}

export function getVideoById(id: string): VideoItem | undefined {
  return VIDEO_LEARNING_DATA.find(v => v.id === id);
}

export function getVideosByRole(roleId: string): VideoItem[] {
  return VIDEO_LEARNING_DATA.filter(v => v.role === roleId || (roleId === 'ethical-hacker' && v.role === 'pentester'));
}
