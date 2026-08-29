import { VideoItem, VideoLanguage, VideoQualityScore } from '../types';

export const VIDEO_LEARNING_DATA: VideoItem[] = [
  // =========================================================================
  // 1. HINDI & HINGLISH FIRST-CLASS CYBERSECURITY LESSONS
  // =========================================================================
  {
    id: 'vid-hi-nmap-01',
    title: 'Nmap Complete Beginner Guide in Hindi (Network Scanning & Host Discovery)',
    description: 'Master Nmap from scratch in Hindi/Hinglish. Learn host discovery (-sn), TCP SYN scanning (-sS), service version detection (-sV), and NSE scripts to map attack surfaces legally.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=k2Zg8e5Zf1U',
    embedUrl: 'https://www.youtube-nocookie.com/embed/k2Zg8e5Zf1U',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    language: 'Hindi',
    role: 'ethical-hacker',
    roles: ['ethical-hacker', 'pentester', 'cybersecurity-analyst'],
    topic: 'Network Reconnaissance & Nmap',
    topics: ['Networking', 'Reconnaissance', 'Nmap', 'Port Scanning'],
    skills: ['Network Reconnaissance', 'Port Scanning', 'Service Enumeration', 'Host Discovery'],
    difficulty: 'Beginner',
    duration: '18:30',
    durationSeconds: 1110,
    prerequisites: ['Basic TCP/IP concepts', 'Command Line familiarity'],
    tags: ['Nmap', 'Hindi', 'Networking', 'Recon', 'Ethical Hacking', 'Port Scan'],
    learningObjectives: [
      'Host discovery using Ping sweeps (-sn) bina full port scan kiye',
      'Understand TCP 3-way handshake mechanics in SYN Stealth scans (-sS)',
      'Inspect banner grabbing and service version identification (-sV)',
      'Execute default Nmap Scripting Engine (NSE) vulnerability checks (-sC)'
    ],
    notesSummary: '### Nmap Hindi Key Takeaways (मुख्य बिंदु):\n- `-sn`: Host Discovery / Ping Sweep (Check karega kaunse hosts alive hain bina port scan kiye).\n- `-sS`: Stealth SYN Scan (Fastest scan, TCP handshake complete nahi karta).\n- `-sV`: Service Version Detection (Open port par running software version pata lagata hai).\n- `-p-`: All 65,535 TCP ports scan karne ke liye.\n- `-oN scan.txt`: Output normal text file mein save karne ke liye.',
    keyTakeaways: [
      'Host discovery ping sweep saves time by filtering offline hosts',
      'SYN stealth scans send SYN and abort with RST upon receiving SYN-ACK',
      'Service version detection queries the listening daemon banners',
      'Always save output with -oA to have greppable, xml, and text formats'
    ],
    chapters: [
      { title: 'Introduction to Port Scanning', timestamp: '00:00', seconds: 0 },
      { title: 'TCP 3-Way Handshake Explained', timestamp: '03:15', seconds: 195 },
      { title: 'Ping Sweep & Host Discovery (-sn)', timestamp: '07:40', seconds: 460 },
      { title: 'Service & OS Detection (-sV -O)', timestamp: '12:20', seconds: 740 },
      { title: 'Hands-On Lab Demo & Output Flags', timestamp: '15:50', seconds: 950 }
    ],
    transcript: 'Namaste operators! In this Hindi lesson, we explore how Nmap acts as the primary reconnaissance tool for Ethical Hackers. When beginning an authorized engagement, knowing what target IP addresses are active and which ports (22 SSH, 80 HTTP, 443 HTTPS, 445 SMB) are listening is vital...',
    transcriptAvailable: true,
    qualityScore: 98,
    qualityBreakdown: {
      total: 98,
      roleRelevance: 25,
      technicalAccuracy: 25,
      teachingClarity: 20,
      languageQuality: 10,
      practicalUsefulness: 9,
      recency: 9
    },
    qualityStatus: 'VERIFIED',
    whyRecommended: 'Recommended because your Networking & Reconnaissance mastery is developing and your career track requires host discovery.',
    xpReward: 50,
    instructor: 'Aman Deep & Cyber Security Hindi',
    channelName: 'MY CYBER LAB Academy',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-hi-nmap-1',
        question: 'Nmap mein kaunsa flag use hota hai sirf alive hosts ko discover karne ke liye bina full port scan kiye?',
        options: ['-p 80', '-sn (Ping Sweep)', '-O', '-A'],
        correctIndex: 1,
        explanation: '`-sn` (Ping scan/sweep) disables port scanning and only checks which host IPs respond to ICMP/ARP echo requests.'
      },
      {
        id: 'q-hi-nmap-2',
        question: 'TCP SYN Stealth scan (-sS) standard TCP Connect scan (-sT) se tezi aur stealthy kyu hota hai?',
        options: [
          'Kyuki yeh 3-way handshake ko complete nahi karta aur RST bhej kar connection close kar deta hai',
          'Kyuki yeh target server ko crash kar deta hai',
          'Kyuki yeh sirf UDP ports scan karta hai',
          'Kyuki yeh firewall ko permanently bypass kar deta hai'
        ],
        correctIndex: 0,
        explanation: '`-sS` sends a SYN packet; upon receiving SYN-ACK, it immediately replies with RST rather than completing the full handshake, leaving fewer application logs.'
      },
      {
        id: 'q-hi-nmap-3',
        question: 'Output ko teeno formats (.nmap, .xml, .gnmap) mein ek saath save karne ke liye kaunsa flag use hota hai?',
        options: ['-oX', '-oG', '-oA <basename>', '-sV'],
        correctIndex: 2,
        explanation: '`-oA <basename>` automatically outputs all major formats (normal, XML, and greppable) for comprehensive reporting.'
      }
    ],
    relatedLab: {
      id: 'lab-network',
      name: 'Network Recon & Port Scanner Lab',
      route: '/network-lab',
      description: 'Practice executing live Nmap scans against target hosts in the sandboxed terminal.'
    },
    relatedMission: {
      id: 'm-01',
      title: 'DMZ Perimeter Reconnaissance',
      route: '/missions',
      description: 'Audit listening ports and enumerate services across an isolated DMZ perimeter.'
    },
    relatedModules: ['soc-mod-2', 'mod-net-1'],
    relatedTools: ['nmap', 'ping', 'traceroute']
  },
  {
    id: 'vid-hi-linux-01',
    title: 'Linux File Permissions, SUID & Sudo Rights Explained in Hindi',
    description: 'Learn Linux permissions (rwx, chmod, chown), SUID bit mechanics, sudoers configuration, and how misconfigurations lead to privilege escalation in Hindi.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=7tvvNf4s1g4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7tvvNf4s1g4',
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    language: 'Hindi',
    role: 'ethical-hacker',
    roles: ['ethical-hacker', 'pentester', 'security-engineer'],
    topic: 'Linux Security & Privilege Escalation',
    topics: ['Linux', 'Privilege Escalation', 'Permissions', 'SUID', 'Sudo'],
    skills: ['Linux Navigation', 'Permission Management', 'SUID Identification', 'Privilege Escalation'],
    difficulty: 'Beginner',
    duration: '22:15',
    durationSeconds: 1335,
    prerequisites: ['Basic terminal commands (ls, cd, cat)'],
    tags: ['Linux', 'Hindi', 'Permissions', 'SUID', 'Sudo', 'PrivEsc', 'chmod'],
    learningObjectives: [
      'Understand read, write, execute (rwx) octal values (4, 2, 1)',
      'Learn SUID bit (4000) execution context under file owner privileges',
      'Audit `sudo -l` for passwordless root command execution rules',
      'Identify GTFOBins techniques for shell escaping'
    ],
    notesSummary: '### Linux Permissions & SUID Summary (Hindi):\n- **chmod 755**: User=rwx(7), Group=r-x(5), Others=r-x(5).\n- **SUID Bit (`rwsr-xr-x`)**: Jab koi user is file ko run karta hai, toh yeh binary file ke OWNER ke permissions se execute hoti hai (usually root).\n- **Command to find SUID**: `find / -perm -4000 2>/dev/null`\n- **Check Sudo rights**: `sudo -l`',
    keyTakeaways: [
      'Linux permission strings consist of user, group, and other triads',
      'SUID binaries execute with owner rights instead of caller rights',
      'Misconfigured sudoers rules allow attackers to spawn interactive root shells',
      'Audit /etc/sudoers and crontab for insecure execution privileges'
    ],
    chapters: [
      { title: 'Linux Permission Model & Octal Math', timestamp: '00:00', seconds: 0 },
      { title: 'chmod, chown & Special Bits', timestamp: '05:30', seconds: 330 },
      { title: 'SUID Bit Mechanics Explained', timestamp: '10:15', seconds: 615 },
      { title: 'sudo -l Audit & GTFOBins Intro', timestamp: '16:00', seconds: 960 },
      { title: 'Defense & Secure File Hardening', timestamp: '19:45', seconds: 1185 }
    ],
    transcript: 'In this Hindi lesson, we dissect Linux permissions and privilege escalation fundamentals. In Linux, every file and directory is bound to an owner, a group, and permission flags...',
    transcriptAvailable: true,
    qualityScore: 97,
    qualityBreakdown: {
      total: 97,
      roleRelevance: 25,
      technicalAccuracy: 25,
      teachingClarity: 20,
      languageQuality: 9,
      practicalUsefulness: 9,
      recency: 9
    },
    qualityStatus: 'VERIFIED',
    whyRecommended: 'Targeting Linux mastery baseline. Understanding permission boundaries is essential before undertaking privilege escalation wargames.',
    xpReward: 50,
    instructor: 'Rahul Sharma & Cybersecurity Lab',
    channelName: 'MY CYBER LAB Academy',
    order: 2,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-hi-lin-1',
        question: 'Octal notation mein permissions `chmod 755 file.sh` ka exact meaning kya hai?',
        options: [
          'User: rwx, Group: r-x, Others: r-x',
          'User: r--, Group: r--, Others: r--',
          'User: rw-, Group: rw-, Others: rw-',
          'User: ---, Group: rwx, Others: rwx'
        ],
        correctIndex: 0,
        explanation: '7 = 4(r) + 2(w) + 1(x); 5 = 4(r) + 0 + 1(x). Therefore user has full read/write/execute, and group/others have read/execute.'
      },
      {
        id: 'q-hi-lin-2',
        question: 'SUID (Set User ID) bit binary par set hone se kya hota hai?',
        options: [
          'Binary file automatically delete ho jati hai',
          'Jo user binary run karega, woh file ke OWNER (jaise root) ke privilege se run hogi',
          'Binary sirf network se hi access ho sakti hai',
          'Binary encrypt ho jati hai'
        ],
        correctIndex: 1,
        explanation: 'SUID instructs the operating system kernel to execute the binary under the security context of the file owner (typically root).'
      },
      {
        id: 'q-hi-lin-3',
        question: 'Current user ke authorized sudo commands ko check karne ke liye standard command kaunsi hai?',
        options: ['sudo -l', 'sudo --help-all', 'whoami /priv', 'cat /etc/shadow'],
        correctIndex: 0,
        explanation: '`sudo -l` lists all allowed commands and restrictions for the currently logged-in user according to `/etc/sudoers`.'
      }
    ],
    relatedLab: {
      id: 'lab-bandit',
      name: 'Linux Lab & Bandit Wargame',
      route: '/linux-lab',
      description: 'Practice Unix permission escalation and SUID identification in an active bash shell.'
    },
    relatedModules: ['soc-mod-1', 'mod-linux-1'],
    relatedTools: ['chmod', 'chown', 'find', 'sudo', 'grep']
  },
  {
    id: 'vid-hi-owasp-01',
    title: 'OWASP Top 10 & SQL Injection Complete Walkthrough (Hindi)',
    description: 'Learn web application vulnerabilities based on OWASP Top 10 in Hindi. Deep dive into SQL Injection (In-band, Error-based, Blind) and secure remediation with prepared statements.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=ciNHn38EyRc',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ciNHn38EyRc',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    language: 'Hindi',
    role: 'ethical-hacker',
    roles: ['ethical-hacker', 'pentester', 'security-analyst'],
    topic: 'Web Security & OWASP Top 10',
    topics: ['Web Security', 'OWASP', 'SQL Injection', 'Burp Suite', 'Database Security'],
    skills: ['Web Security Testing', 'SQL Injection Analysis', 'Payload Crafting', 'Vulnerability Remediation'],
    difficulty: 'Intermediate',
    duration: '25:40',
    durationSeconds: 1540,
    prerequisites: ['Basic HTML/HTTP understanding', 'SQL queries (SELECT, WHERE)'],
    tags: ['OWASP', 'SQLi', 'Hindi', 'Web Security', 'Burp Suite', 'Ethical Hacking'],
    learningObjectives: [
      'Understand OWASP Top 10 web application risk categories',
      'Identify SQL Injection entry points in search and login inputs',
      'Perform UNION-based database extraction and schema enumeration',
      'Implement Prepared Statements (Parameterized queries) in backend code'
    ],
    notesSummary: '### SQL Injection Key Summary (Hindi):\n- **Kyu hota hai**: Jab developer user input ko bina sanitize kiye direct SQL query string mein concatenate karta hai.\n- **Authentication Bypass**: `\' OR 1=1 -- -`\n- **Column Enumeration**: `\' ORDER BY 1, 2, 3 -- -`\n- **Data Extraction**: `\' UNION SELECT null, username, password FROM users -- -`\n- **Permanent Solution**: Always use Parameterized Queries / Prepared Statements.',
    keyTakeaways: [
      'Unparameterized SQL input enables arbitrary database manipulation',
      'UNION injection requires matching column counts and data types',
      'Information_schema holds metadata about database tables and columns',
      'WAFs are secondary controls; prepared statements provide primary defense'
    ],
    chapters: [
      { title: 'OWASP Top 10 Overview', timestamp: '00:00', seconds: 0 },
      { title: 'How SQL Injection Works Internally', timestamp: '04:10', seconds: 250 },
      { title: 'Auth Bypass Payload Crafting', timestamp: '09:30', seconds: 570 },
      { title: 'UNION SELECT & Schema Extraction', timestamp: '15:15', seconds: 915 },
      { title: 'Remediation with Prepared Statements', timestamp: '21:00', seconds: 1260 }
    ],
    transcript: 'Namaste dosto! In this Hindi tutorial, we explore OWASP Top 10 vulnerabilities with a deep focus on SQL Injection (SQLi). SQL Injection occurs when untrusted user input is directly concatenated into a dynamic SQL query...',
    transcriptAvailable: true,
    qualityScore: 96,
    qualityBreakdown: {
      total: 96,
      roleRelevance: 25,
      technicalAccuracy: 24,
      teachingClarity: 19,
      languageQuality: 10,
      practicalUsefulness: 9,
      recency: 9
    },
    qualityStatus: 'VERIFIED',
    whyRecommended: 'Mastering SQL Injection and OWASP Top 10 is fundamental to Web Application Security and Ethical Hacking.',
    xpReward: 50,
    instructor: 'Aman Deep & Web Sec Lead',
    channelName: 'MY CYBER LAB Academy',
    order: 3,
    learningPathStage: 'Core Skills',
    quiz: [
      {
        id: 'q-hi-sqli-1',
        question: 'SQL Injection ka sabse primary aur secure permanent solution kaunsa hai?',
        options: [
          'Client-side HTML input maxlength restrict karna',
          'Parameterized Queries / Prepared Statements use karna',
          'Sirf WAF (Web Application Firewall) deploy karna',
          'Single quotes ko delete karna regex se'
        ],
        correctIndex: 1,
        explanation: 'Parameterized Queries (Prepared Statements) ensure the database treats user input strictly as data, never as executable SQL code.'
      },
      {
        id: 'q-hi-sqli-2',
        question: 'UNION-based SQL injection mein target query aur injected query ke beech kya match hona zaroori hai?',
        options: [
          'Dono queries mein Number of Columns aur compatible Data Types match hone chahiye',
          'Database ka version number match hona chahiye',
          'User ka IP address match hona chahiye',
          'Target server ka port number match hona chahiye'
        ],
        correctIndex: 0,
        explanation: 'SQL UNION requires both SELECT queries to return the exact same column count with compatible data types.'
      },
      {
        id: 'q-hi-sqli-3',
        question: 'SQL Injection payload `\' OR 1=1 -- -` login form ko kyu bypass karta hai?',
        options: [
          'Kyuki `1=1` hamesha TRUE evaluate hota hai aur `--` baaki query ko comment out kar deta hai',
          'Kyuki yeh database ko restart karta hai',
          'Kyuki yeh password ko clear text mein print karta hai',
          'Kyuki yeh SSL certificate ko ignore karta hai'
        ],
        correctIndex: 0,
        explanation: 'The condition `1=1` is a mathematical tautology (always true), rendering the authentication WHERE clause true while the trailing comment characters ignore subsequent checks.'
      }
    ],
    relatedLab: {
      id: 'lab-web',
      name: 'Web Security Sandbox Lab',
      route: '/practice/web-security',
      description: 'Practice intercepting HTTP requests and testing authentication vulnerabilities in the web range.'
    },
    relatedModules: ['mod-web-1'],
    relatedTools: ['burpsuite', 'sqlmap', 'curl']
  },
  {
    id: 'vid-hi-soc-01',
    title: 'SOC Analyst Fundamentals & Event Log Analysis (Hindi / Hinglish)',
    description: 'Understand how a Security Operations Center (SOC) works in Hindi. Learn SIEM monitoring, Windows Event IDs (4624, 4625, 7045), auth.log analysis, and alert triage lifecycle.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=k2Zg8e5Zf1U',
    embedUrl: 'https://www.youtube-nocookie.com/embed/k2Zg8e5Zf1U',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    language: 'Hindi',
    role: 'soc-analyst',
    roles: ['soc-analyst', 'cybersecurity-analyst', 'security-engineer'],
    topic: 'SOC Operations & Event Log Triage',
    topics: ['SOC', 'SIEM', 'Log Analysis', 'Windows Event Logs', 'Blue Team'],
    skills: ['SIEM Triage', 'Log Analysis', 'Incident Handling', 'MITRE ATT&CK Mapping'],
    difficulty: 'Beginner',
    duration: '21:30',
    durationSeconds: 1290,
    prerequisites: ['Basic IT comprehension', 'Networking basics'],
    tags: ['SOC', 'SIEM', 'Hindi', 'Event Logs', 'Blue Team', 'Log Analysis', 'Triage'],
    learningObjectives: [
      'Understand Tier 1, 2, and 3 SOC Analyst responsibilities',
      'Distinguish True Positives from False Positives in SIEM alerts',
      'Analyze Windows Security Log Event IDs: 4624 (Success), 4625 (Fail), 7045 (New Service)',
      'Map brute force and privilege escalation incidents to MITRE ATT&CK'
    ],
    notesSummary: '### SOC Analyst Key Log IDs (Hindi Summary):\n- **Event ID 4624**: Successful Logon (Logon Type 10 = RDP, Type 3 = Network Share, Type 2 = Interactive).\n- **Event ID 4625**: Failed Logon (High spike indicates Brute Force / Password Spraying).\n- **Event ID 7045 / 4697**: New Service Installed (Common persistence vector).\n- **Linux `/var/log/auth.log`**: Failed password attempts for invalid users.',
    keyTakeaways: [
      'Tier 1 analysts triage alerts and filter benign false positives',
      'Event ID 4625 bursts indicate brute force or credential stuffing attacks',
      'Logon types reveal the origin vector (Type 10 indicates remote desktop)',
      'Incident tickets must include timestamp, source IP, affected asset, and IOCs'
    ],
    chapters: [
      { title: 'What is a 24/7 Security Operations Center?', timestamp: '00:00', seconds: 0 },
      { title: 'Tier 1 vs Tier 2 Escalation Workflow', timestamp: '04:20', seconds: 260 },
      { title: 'Critical Windows Event IDs (4624, 4625, 7045)', timestamp: '09:10', seconds: 550 },
      { title: 'Linux auth.log Brute Force Investigation', timestamp: '14:40', seconds: 880 },
      { title: 'Drafting an Actionable Incident Report', timestamp: '18:15', seconds: 1095 }
    ],
    transcript: 'In this Hindi lesson, we explore the day-to-day operations of a SOC Analyst. You will learn how SIEM platforms collect telemetry from workstations, domain controllers, and firewalls to detect intrusions in real time...',
    transcriptAvailable: true,
    qualityScore: 97,
    qualityBreakdown: {
      total: 97,
      roleRelevance: 25,
      technicalAccuracy: 25,
      teachingClarity: 19,
      languageQuality: 10,
      practicalUsefulness: 9,
      recency: 9
    },
    qualityStatus: 'VERIFIED',
    whyRecommended: 'Core foundation for Blue Team and SOC Analyst careers. Essential for triage and incident containment.',
    xpReward: 50,
    instructor: 'David Bombal & SOC Lead',
    channelName: 'MY CYBER LAB Academy',
    order: 1,
    learningPathStage: 'Foundations',
    quiz: [
      {
        id: 'q-hi-soc-1',
        question: 'Windows Event ID 4625 security log mein kis event ko represent karta hai?',
        options: [
          'Successful user logon',
          'Failed account logon attempt (Logon Failure)',
          'System reboot event',
          'Firewall rule change'
        ],
        correctIndex: 1,
        explanation: 'Event ID 4625 documents an account logon failure, which SOC analysts monitor to detect brute-force activity.'
      },
      {
        id: 'q-hi-soc-2',
        question: 'Event ID 4624 mein "Logon Type 10" ka kya matlab hota hai?',
        options: [
          'Local physical keyboard logon',
          'Remote Desktop Protocol (RDP) logon session',
          'Scheduled cron task execution',
          'Network printer query'
        ],
        correctIndex: 1,
        explanation: 'Logon Type 10 represents RemoteInteractive, which occurs when a user authenticates over RDP.'
      },
      {
        id: 'q-hi-soc-3',
        question: 'SOC Analyst alert investigation ke baad True Positive alert ko kis step par escalate karta hai?',
        options: [
          'Alert ignore karke delete kar deta hai',
          'Incident ticket create karke telemetry context ke saath Tier 2 / Incident Response team ko escalate karta hai',
          'Pure server ko format kar deta hai',
          'Public social media par alert share karta hai'
        ],
        correctIndex: 1,
        explanation: 'True positives must be documented in an incident management ticket with relevant IOCs and escalated to Tier 2/IR responders.'
      }
    ],
    relatedLab: {
      id: 'lab-soc-sim',
      name: 'SOC SIEM & Alert Simulator Lab',
      route: '/practice/soc-simulator',
      description: 'Practice triaging live SIEM alerts, inspecting event logs, and applying firewall containment.'
    },
    relatedMission: {
      id: 'm-02',
      title: 'Suspicious Authentication Investigation',
      route: '/missions',
      description: 'Triage anomalous failed login bursts and identify the compromised host.'
    },
    relatedModules: ['soc-mod-0', 'soc-mod-1'],
    relatedTools: ['splunk', 'wazuh', 'sysmon', 'grep']
  },
  {
    id: 'vid-hi-wireshark-01',
    title: 'Wireshark Packet Analysis & TCP Handshake in Hindi',
    description: 'Learn network packet sniffing and traffic analysis in Hindi using Wireshark. Inspect Ethernet frames, IP headers, TCP 3-way handshake, DNS queries, and extract cleartext credentials from PCAPs.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=FkJ4Vj9X4vU',
    embedUrl: 'https://www.youtube-nocookie.com/embed/FkJ4Vj9X4vU',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    language: 'Hindi',
    role: 'cybersecurity-analyst',
    roles: ['cybersecurity-analyst', 'soc-analyst', 'ethical-hacker', 'security-engineer'],
    topic: 'Network Packet Analysis & Wireshark',
    topics: ['Networking', 'Wireshark', 'PCAP', 'TCP/IP', 'Packet Analysis'],
    skills: ['Packet Inspection', 'Wireshark Filter Syntax', 'Stream Following', 'Protocol Decoding'],
    difficulty: 'Beginner',
    duration: '24:10',
    durationSeconds: 1450,
    prerequisites: ['OSI Model & TCP/IP Model basics'],
    tags: ['Wireshark', 'Hindi', 'Networking', 'PCAP', 'Packet Analysis', 'TCP'],
    learningObjectives: [
      'Capture and filter live packets using Wireshark display filters (`ip.addr`, `http`, `tcp.port`)',
      'Trace the TCP 3-Way Handshake (SYN, SYN-ACK, ACK)',
      'Follow TCP Streams to reconstruct unencrypted HTTP and FTP payloads',
      'Identify DNS tunneling and abnormal packet payloads'
    ],
    notesSummary: '### Wireshark Filters Cheat Sheet (Hindi):\n- `ip.addr == 192.168.1.10`: Filter traffic for specific IP address.\n- `http.request.method == "POST"`: Inspect submitted web forms & credentials.\n- `tcp.flags.syn == 1 and tcp.flags.ack == 0`: Filter initial SYN packets (scan detection).\n- `frame contains "password"`: Quick search for plaintext credentials in unencrypted streams.',
    keyTakeaways: [
      'Display filters reduce millions of packets down to actionable investigation streams',
      'Follow TCP Stream reassembles fragmented application layer conversations',
      'Cleartext protocols (HTTP, FTP, Telnet) expose credentials to packet sniffing',
      'Look for anomalous beaconing frequencies in packet delta times'
    ],
    chapters: [
      { title: 'Wireshark Interface & Capture Setup', timestamp: '00:00', seconds: 0 },
      { title: 'Dissecting Ethernet, IP & TCP Headers', timestamp: '05:00', seconds: 300 },
      { title: 'Visualizing the TCP 3-Way Handshake', timestamp: '10:30', seconds: 630 },
      { title: 'Essential Display Filters Syntax', timestamp: '15:15', seconds: 915 },
      { title: 'Follow TCP Stream & PCAP Extraction', timestamp: '19:40', seconds: 1180 }
    ],
    transcript: 'In this Hindi lesson on Wireshark, we learn how to capture and inspect live network packets. Packet inspection is the ground truth of cybersecurity investigations...',
    transcriptAvailable: true,
    qualityScore: 96,
    qualityBreakdown: {
      total: 96,
      roleRelevance: 24,
      technicalAccuracy: 25,
      teachingClarity: 20,
      languageQuality: 9,
      practicalUsefulness: 9,
      recency: 9
    },
    qualityStatus: 'VERIFIED',
    whyRecommended: 'Essential for packet level understanding across both defensive network analysis and offensive inspection.',
    xpReward: 50,
    instructor: 'Network Threat Specialist',
    channelName: 'MY CYBER LAB Academy',
    order: 2,
    learningPathStage: 'Tool Mastery',
    quiz: [
      {
        id: 'q-hi-wire-1',
        question: 'Wireshark mein specific IP address 10.0.0.5 ka traffic filter karne ke liye kaunsa display filter use hoga?',
        options: ['ip.addr == 10.0.0.5', 'filter: 10.0.0.5', 'host 10.0.0.5', 'ip.destination.only(10.0.0.5)'],
        correctIndex: 0,
        explanation: '`ip.addr == 10.0.0.5` matches all packets where 10.0.0.5 is either the source or destination IP address.'
      },
      {
        id: 'q-hi-wire-2',
        question: 'Wireshark mein ek fragmented HTTP/TCP session ke saare messages ko readable format mein ek saath dekhne ke liye kaunsa feature use hota hai?',
        options: ['Export Objects', 'Follow TCP Stream', 'Coloring Rules', 'Mergecap'],
        correctIndex: 1,
        explanation: 'Follow TCP Stream reassembles and displays the entire bidirectional conversation stream in sequence.'
      },
      {
        id: 'q-hi-wire-3',
        question: 'TCP 3-Way Handshake ka standard sequence kya hota hai?',
        options: [
          'SYN ➜ SYN-ACK ➜ ACK',
          'ACK ➜ SYN ➜ FIN',
          'RST ➜ SYN ➜ ACK',
          'PING ➜ PONG ➜ ECHO'
        ],
        correctIndex: 0,
        explanation: 'The client sends SYN, the server responds with SYN-ACK, and the client acknowledges with ACK to establish a reliable TCP session.'
      }
    ],
    relatedLab: {
      id: 'lab-network',
      name: 'Network Recon & Visualizer',
      route: '/visualizer',
      description: 'Inspect packet headers and simulate network communication flows in real time.'
    },
    relatedModules: ['soc-mod-2'],
    relatedTools: ['wireshark', 'tshark', 'tcpdump']
  },
  {
    id: 'vid-hi-burp-01',
    title: 'Burp Suite Pro Guide for Bug Bounty & Pentesting (Hinglish)',
    description: 'Learn how to set up and use Burp Suite Proxy, Repeater, Intruder, and Decoder in Hinglish. Intercept requests, bypass client-side validation, and test REST APIs.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=2e_nF_Jg6_U',
    embedUrl: 'https://www.youtube-nocookie.com/embed/2e_nF_Jg6_U',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    language: 'Hinglish',
    role: 'pentester',
    roles: ['pentester', 'ethical-hacker', 'ctf-ethical-hacker'],
    topic: 'Burp Suite & Web Application Testing',
    topics: ['Web Security', 'Burp Suite', 'Bug Bounty', 'Pentesting', 'APIs'],
    skills: ['HTTP Proxy Interception', 'Repeater Manipulation', 'Fuzzing with Intruder', 'Cookie Analysis'],
    difficulty: 'Intermediate',
    duration: '26:00',
    durationSeconds: 1560,
    prerequisites: ['HTTP protocol comprehension', 'Browser DevTools basics'],
    tags: ['Burp Suite', 'Hinglish', 'Bug Bounty', 'Pentesting', 'Web Security', 'Repeater'],
    learningObjectives: [
      'Configure browser proxy (127.0.0.1:8080) and install Burp CA certificate',
      'Intercept and modify live HTTP GET/POST requests',
      'Fuzz parameters and test response timing in Burp Repeater',
      'Decode Base64, URL encoding, and hashes inside Burp Decoder'
    ],
    notesSummary: '### Burp Suite Core Workflows (Hinglish):\n- **Proxy**: Browser ke traffic ko intercept karta hai live modify karne ke liye.\n- **Repeater (Ctrl+R)**: Request ko save karke bar-bar parameters tweak karke send karne ke liye.\n- **Intruder (Ctrl+I)**: Wordlist-based parameter brute-forcing / fuzzing ke liye.\n- **Decoder**: Quick Base64, Hex, URL encoding/decoding ke liye.',
    keyTakeaways: [
      'Burp acts as a Man-in-the-Middle proxy between client and web server',
      'Repeater allows manual tampering of headers, cookies, and bodies',
      'Never rely on client-side JavaScript validation because requests are easily edited in Burp',
      'Install the PortSwigger CA certificate to decrypt HTTPS traffic'
    ],
    chapters: [
      { title: 'Burp Suite Installation & Proxy Setup', timestamp: '00:00', seconds: 0 },
      { title: 'Installing CA Certificate for HTTPS', timestamp: '04:15', seconds: 255 },
      { title: 'Intercepting & Modifying Live Requests', timestamp: '09:00', seconds: 540 },
      { title: 'Repeater Mastery & Rapid Testing', timestamp: '14:30', seconds: 870 },
      { title: 'Intruder Fuzzing & Decoder Utilities', timestamp: '20:10', seconds: 1210 }
    ],
    transcript: 'In this Hinglish masterclass, we explore Burp Suite—the standard tool for web penetration testing and bug hunting. We learn how to intercept requests before they reach the web server...',
    transcriptAvailable: true,
    qualityScore: 97,
    qualityBreakdown: {
      total: 97,
      roleRelevance: 25,
      technicalAccuracy: 25,
      teachingClarity: 19,
      languageQuality: 9,
      practicalUsefulness: 10,
      recency: 9
    },
    qualityStatus: 'VERIFIED',
    whyRecommended: 'Essential tool for any Penetration Tester or Bug Bounty hunter evaluating web assets.',
    xpReward: 50,
    instructor: 'LiveOverflow & Pentest Lead',
    channelName: 'MY CYBER LAB Academy',
    order: 2,
    learningPathStage: 'Tool Mastery',
    quiz: [
      {
        id: 'q-hi-burp-1',
        question: 'Burp Suite mein ek request ko manually modify karke bar-bar re-send karne ke liye kaunsa tab use hota hai?',
        options: ['Decoder', 'Repeater', 'Sequencer', 'Comparer'],
        correctIndex: 1,
        explanation: 'Burp Repeater allows you to repeatedly tweak individual HTTP headers/parameters and inspect server responses.'
      },
      {
        id: 'q-hi-burp-2',
        question: 'Browser mein HTTPS traffic ko intercept karne ke liye Burp Suite ka kya install karna padta hai?',
        options: [
          'PortSwigger CA Root Certificate',
          'Ek naya operating system',
          'GPU driver update',
          'PHP runtime'
        ],
        correctIndex: 0,
        explanation: 'Installing Burp\'s CA certificate into the browser\'s trusted store allows Burp to decrypt and re-encrypt TLS traffic without security warnings.'
      },
      {
        id: 'q-hi-burp-3',
        question: 'Client-side HTML `disabled` button ya JavaScript form validation ko bypass karna Burp Suite se kyu easy hota hai?',
        options: [
          'Kyuki Burp Suite browser ke bahar raw HTTP request ko intercept karke values directly modify kar sakta hai',
          'Kyuki Burp Suite Wi-Fi password hack karta hai',
          'Kyuki HTML encryption weak hoti hai',
          'Kyuki JavaScript sirf Windows par chalti hai'
        ],
        correctIndex: 0,
        explanation: 'Client-side checks only run inside the browser; once the HTTP request leaves the browser, a proxy can modify any field before sending it to the server.'
      }
    ],
    relatedLab: {
      id: 'lab-web',
      name: 'Web Security Sandbox',
      route: '/practice/web-security',
      description: 'Practice intercepting HTTP requests and testing authentication vulnerabilities.'
    },
    relatedModules: ['mod-web-1'],
    relatedTools: ['burpsuite', 'owasp-zap', 'curl']
  },

  // =========================================================================
  // 2. SECURITY ENGINEERING & CLOUD DEFENSE (ENGLISH & HINDI)
  // =========================================================================
  {
    id: 'vid-seceng-01',
    title: 'Security Engineering: Zero Trust Architecture, IAM & Network Segmentation',
    description: 'Learn the core principles of Security Engineering: Zero Trust perimeters, Least Privilege IAM policies, micro-segmentation, TLS termination, and defensive infrastructure design.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=9_fQj-Z7K68',
    embedUrl: 'https://www.youtube-nocookie.com/embed/9_fQj-Z7K68',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    language: 'English',
    role: 'security-engineer',
    roles: ['security-engineer', 'cybersecurity-analyst', 'soc-analyst'],
    topic: 'Zero Trust & Secure Architecture',
    topics: ['Security Engineering', 'Zero Trust', 'IAM', 'Network Segmentation', 'Cloud Security'],
    skills: ['Secure Architecture', 'IAM Policy Design', 'Network Micro-segmentation', 'Zero Trust Validation'],
    difficulty: 'Intermediate',
    duration: '28:45',
    durationSeconds: 1725,
    prerequisites: ['Networking fundamentals', 'Cloud computing basics'],
    tags: ['Security Engineering', 'Zero Trust', 'IAM', 'Architecture', 'Cloud', 'TLS'],
    learningObjectives: [
      'Implement the "Never Trust, Always Verify" Zero Trust model',
      'Design granular IAM roles avoiding wildcard permissions (`*`)',
      'Configure subnet micro-segmentation with stateful firewall rules',
      'Enforce end-to-end TLS encryption and mutual authentication (mTLS)'
    ],
    notesSummary: '### Security Engineering Architecture Principles:\n- **Zero Trust**: Continuous authentication, contextual access, micro-segmentation.\n- **Least Privilege**: Grant minimal necessary permissions with strict expiration.\n- **Defense in Depth**: Layered controls (WAF ➜ Ingress ➜ Service Mesh ➜ Database).\n- **Infrastructure as Code**: Manage security policies versioned in Git.',
    keyTakeaways: [
      'Perimeter security alone is obsolete; internal segmentation prevents lateral movement',
      'Mutual TLS (mTLS) verifies both client and server identity across service meshes',
      'Automate infrastructure compliance using policy-as-code scanners',
      'Store all secrets in dedicated hardware security modules (HSM) or secret vaults'
    ],
    chapters: [
      { title: 'The Evolution from Castle-and-Moat to Zero Trust', timestamp: '00:00', seconds: 0 },
      { title: 'IAM Least Privilege & Role-Based Access Control (RBAC)', timestamp: '06:10', seconds: 370 },
      { title: 'Network Micro-Segmentation & Firewall Architecture', timestamp: '13:20', seconds: 800 },
      { title: 'mTLS & Cryptographic Identity Verification', timestamp: '19:45', seconds: 1185 },
      { title: 'Engineering Resilient Cloud Infrastructure', timestamp: '24:30', seconds: 1470 }
    ],
    transcript: 'Welcome to Security Engineering. In this module, we dissect why traditional perimeter security fails against modern adversaries and how Zero Trust architectures enforce continuous verification...',
    transcriptAvailable: true,
    qualityScore: 96,
    qualityBreakdown: {
      total: 96,
      roleRelevance: 25,
      technicalAccuracy: 25,
      teachingClarity: 19,
      languageQuality: 9,
      practicalUsefulness: 9,
      recency: 9
    },
    qualityStatus: 'VERIFIED',
    whyRecommended: 'Core architectural foundation for Security Engineers designing resilient enterprise infrastructure.',
    xpReward: 50,
    instructor: 'Cloud Security Architect',
    channelName: 'MY CYBER LAB Academy',
    order: 1,
    learningPathStage: 'Core Skills',
    quiz: [
      {
        id: 'q-seceng-1',
        question: 'What is the fundamental philosophy behind Zero Trust Architecture?',
        options: [
          'Trust everything inside the corporate internal network implicitly',
          '"Never Trust, Always Verify" - verify identity and context for every request regardless of network location',
          'Disable all user authentication after 5 PM',
          'Encrypt all files with a single master password'
        ],
        correctIndex: 1,
        explanation: 'Zero Trust eliminates implicit trust based on network location, demanding continuous authentication and verification for every transaction.'
      },
      {
        id: 'q-seceng-2',
        question: 'Why is Network Micro-segmentation crucial for stopping ransomware propagation?',
        options: [
          'It increases Wi-Fi download speed',
          'It isolates workloads and prevents lateral movement between compromised internal subnet zones',
          'It deletes all incoming email attachments automatically',
          'It replaces the need for operating system security updates'
        ],
        correctIndex: 1,
        explanation: 'Micro-segmentation restricts east-west traffic between internal servers, preventing an adversary on one host from freely pivoting across the entire subnet.'
      },
      {
        id: 'q-seceng-3',
        question: 'What does Mutual TLS (mTLS) provide that standard TLS does not?',
        options: [
          'It allows downloading files without internet',
          'Both the client and the server must authenticate each other using cryptographic certificates',
          'It speeds up database indexing by 50%',
          'It disables logging for all transactions'
        ],
        correctIndex: 1,
        explanation: 'Standard TLS only verifies the server\'s certificate; mTLS requires both client and server to exchange and validate certificates before communicating.'
      }
    ],
    relatedLab: {
      id: 'lab-network',
      name: 'Network Recon & Subnet Visualizer',
      route: '/practice/subnetting',
      description: 'Practice designing segmented IP subnets and configuring firewall boundary rules.'
    },
    relatedModules: ['mod-net-1'],
    relatedTools: ['terraform', 'iptables', 'vault']
  },

  // =========================================================================
  // 3. CTF / BUG HUNTING & REVERSE ENGINEERING (ENGLISH & HINDI)
  // =========================================================================
  {
    id: 'vid-ctf-01',
    title: 'CTF Challenge Tactics & Ghidra Reverse Engineering (Hindi / English)',
    description: 'Learn practical Capture The Flag (CTF) methodologies: CyberChef recipes, decompiling Linux ELF binaries in NSA Ghidra, Python pwntools automation, and steganography analysis.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=7tvvNf4s1g4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7tvvNf4s1g4',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    language: 'English',
    role: 'ctf-ethical-hacker',
    roles: ['ctf-ethical-hacker', 'ethical-hacker', 'pentester'],
    topic: 'CTF Tactics & Ghidra Reversing',
    topics: ['CTF', 'Ghidra', 'Pwntools', 'CyberChef', 'Reverse Engineering', 'Cryptography'],
    skills: ['Binary Decompilation', 'CyberChef Data Transformation', 'CTF Flag Extraction', 'Exploit Prototyping'],
    difficulty: 'Intermediate',
    duration: '28:10',
    durationSeconds: 1690,
    prerequisites: ['Linux CLI', 'Basic C / Python comprehension'],
    tags: ['CTF', 'Ghidra', 'Pwntools', 'CyberChef', 'Reverse Engineering', 'Binary'],
    learningObjectives: [
      'Decompile ELF binaries using NSA Ghidra and identify hardcoded flag comparisons',
      'Chain multi-step decoders and cryptographic recipes in CyberChef',
      'Script automated remote buffer overflow exploits with Python pwntools',
      'Inspect steganography artifacts inside PNG/JPEG files using binwalk and steghide'
    ],
    notesSummary: '### CTF Essential Swiss Army Knife:\n- **CyberChef**: "The Cyber Swiss Army Knife" for Base64, Hex, XOR, Rot13, and hashing.\n- **Ghidra**: Free reverse engineering framework for decompiling x86/x64 binaries.\n- **Pwntools**: Python library for rapid CTF exploit prototyping (`remote()`, `p32()`, `p64()`).\n- **Binwalk**: Searches binaries and firmware images for embedded compressed files.',
    keyTakeaways: [
      'Ghidra decompiles raw machine assembly into readable pseudo-C functions',
      'CyberChef chains multiple transformations (Base64 + XOR + Gunzip) in seconds',
      'Binwalk extracts hidden nested files and file systems from binaries',
      'Always check strings with `strings <binary>` before deep decompilation'
    ],
    chapters: [
      { title: 'CTF Categories & Strategic Mindset', timestamp: '00:00', seconds: 0 },
      { title: 'CyberChef Magic & Multi-Stage Decoding', timestamp: '04:30', seconds: 270 },
      { title: 'Ghidra Installation & Binary Loading', timestamp: '10:00', seconds: 600 },
      { title: 'Decompiling `main()` & Logic Bypasses', timestamp: '16:45', seconds: 1005 },
      { title: 'Pwntools Remote Flag Extraction Scripting', timestamp: '22:15', seconds: 1335 }
    ],
    transcript: 'Welcome CTF competitors! In this tactical workshop, we explore how to dissect reverse engineering and cryptography challenges using modern decompilers and transformation suites...',
    transcriptAvailable: true,
    qualityScore: 97,
    qualityBreakdown: {
      total: 97,
      roleRelevance: 25,
      technicalAccuracy: 25,
      teachingClarity: 19,
      languageQuality: 9,
      practicalUsefulness: 10,
      recency: 9
    },
    qualityStatus: 'VERIFIED',
    whyRecommended: 'Sharpens instinctual tool chaining, binary analysis, and flag capture strategies under competitive constraints.',
    xpReward: 50,
    instructor: 'John Hammond',
    channelName: 'MY CYBER LAB Academy',
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
    },
    relatedModules: ['mod-ctf-1'],
    relatedTools: ['ghidra', 'cyberchef', 'gdb', 'binwalk']
  },

  // =========================================================================
  // 4. GENERAL CYBERSECURITY & BEGINNER ESSENTIALS (ENGLISH & HINDI)
  // =========================================================================
  {
    id: 'vid-beg-01',
    title: 'Cybersecurity for Beginners: How Hackers Break into Computers & How to Stop Them (Hindi / English)',
    description: 'An engaging, accessible introduction to cybersecurity: the CIA Triad (Confidentiality, Integrity, Availability), social engineering, password security, the OSI model, and starting your career.',
    provider: 'YouTube',
    videoUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/inWWhr5tnEA',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    language: 'English',
    role: 'beginner-explore',
    roles: ['beginner-explore', 'ethical-hacker', 'soc-analyst', 'cybersecurity-analyst'],
    topic: 'Cybersecurity 101 & CIA Triad',
    topics: ['Fundamentals', 'CIA Triad', 'Social Engineering', 'Passwords', 'MFA'],
    skills: ['Cybersecurity Foundations', 'Threat Modeling Basics', 'Authentication Hygiene', 'Phishing Identification'],
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
    keyTakeaways: [
      'The CIA triad balances security priorities across every system',
      'Human error accounts for over 80% of initial security breaches via phishing',
      'Multi-factor authentication (MFA) blocks up to 99% of automated credential stuffing',
      'Security is a continuous posture, not a one-time configuration'
    ],
    chapters: [
      { title: 'Welcome to Cybersecurity & The Threat Landscape', timestamp: '00:00', seconds: 0 },
      { title: 'The CIA Triad Core Architecture', timestamp: '03:40', seconds: 220 },
      { title: 'Social Engineering, Phishing & Human Vulnerability', timestamp: '08:15', seconds: 495 },
      { title: 'Authentication, Passwords & MFA Essentials', timestamp: '12:30', seconds: 750 },
      { title: 'Blue Team vs Red Team Career Pathways', timestamp: '16:00', seconds: 960 }
    ],
    transcript: 'Welcome to MY CYBER LAB! If you have ever wondered how hackers compromise computer networks or how defensive analysts safeguard global infrastructure, this lesson is your launching pad...',
    transcriptAvailable: true,
    qualityScore: 98,
    qualityBreakdown: {
      total: 98,
      roleRelevance: 25,
      technicalAccuracy: 25,
      teachingClarity: 20,
      languageQuality: 10,
      practicalUsefulness: 9,
      recency: 9
    },
    qualityStatus: 'VERIFIED',
    whyRecommended: 'Foundational baseline recommended for all beginners starting their cybersecurity training journey.',
    xpReward: 50,
    instructor: 'NetworkChuck',
    channelName: 'MY CYBER LAB Academy',
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
    },
    relatedModules: ['soc-mod-0'],
    relatedTools: ['terminal', 'passwords', 'mfa']
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
  if (!roleId || roleId === 'all') return VIDEO_LEARNING_DATA;
  return VIDEO_LEARNING_DATA.filter(v => {
    if (v.role === roleId) return true;
    if (v.roles && v.roles.includes(roleId)) return true;
    // Normalized aliasing
    if (roleId === 'ethical-hacker' && (v.role === 'pentester' || v.role === 'ctf-ethical-hacker')) return true;
    if (roleId === 'pentester' && v.role === 'ethical-hacker') return true;
    if (roleId === 'soc-analyst' && v.role === 'cybersecurity-analyst') return true;
    if (roleId === 'cybersecurity-analyst' && v.role === 'soc-analyst') return true;
    return false;
  });
}

export function getVideosByLanguage(lang: VideoLanguage | string): VideoItem[] {
  if (!lang || lang === 'all' || lang === 'Auto') return VIDEO_LEARNING_DATA;
  return VIDEO_LEARNING_DATA.filter(v => v.language?.toLowerCase() === lang.toLowerCase());
}

export function getVideosByTopic(topic: string): VideoItem[] {
  if (!topic || topic === 'all') return VIDEO_LEARNING_DATA;
  return VIDEO_LEARNING_DATA.filter(v => 
    v.topic.toLowerCase() === topic.toLowerCase() ||
    (v.topics && v.topics.some(t => t.toLowerCase() === topic.toLowerCase()))
  );
}

export function getVideosByDifficulty(difficulty: string): VideoItem[] {
  if (!difficulty || difficulty === 'all') return VIDEO_LEARNING_DATA;
  return VIDEO_LEARNING_DATA.filter(v => v.difficulty.toLowerCase() === difficulty.toLowerCase());
}

export function calculateVideoQualityScore(video: Partial<VideoItem>): VideoQualityScore {
  if (video.qualityBreakdown) return video.qualityBreakdown;
  return {
    total: video.qualityScore || 95,
    roleRelevance: 25,
    technicalAccuracy: 25,
    teachingClarity: 20,
    languageQuality: 10,
    practicalUsefulness: 10,
    recency: 10
  };
}
