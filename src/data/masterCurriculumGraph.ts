/**
 * MY CYBER LAB — MASTER CYBERSECURITY KNOWLEDGE GRAPH (LEVELS 0 - 19)
 * Comprehensive, dependency-aware curriculum with 15-point standard concept structure.
 */

import { CONCEPTS_PART2 } from './masterCurriculumGraphPart2';
import { CONCEPTS_PART3 } from './masterCurriculumGraphPart3';
import { CONCEPTS_PART4 } from './masterCurriculumGraphPart4';

export type ConceptDifficulty = 'FOUNDATION' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface ConceptAssessment {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rationaleByOption?: Record<number, string>;
}

export interface MasterConcept {
  id: string;
  level: number;
  title: string;
  difficulty: ConceptDifficulty;
  prerequisites: string[];
  nextConcepts: string[];
  relatedConcepts: string[];
  definition: string;
  whyItMatters: string;
  mentalModel: string;
  coreExplanation: string;
  visualExplanation: {
    type: 'diagram' | 'flow' | 'table' | 'packet' | 'code' | 'tree';
    title: string;
    content: string;
  };
  example: string;
  practicalExercise: {
    task: string;
    commandOrPayload?: string;
    expectedOutcome: string;
    labRoute: string;
  };
  commonMistakes: string[];
  securityRelevance: string;
  offensivePerspective: string;
  defensivePerspective: string;
  assessment: ConceptAssessment;
  masteryCriteria: {
    minQuizScore: number;
    requiredPracticalRuns: number;
    maxAllowedHintLevel: number;
    retentionIntervalDays: number;
  };
  careerRelevance: string[];
}

export interface CurriculumLevel {
  level: number;
  code: string;
  title: string;
  category: string;
  description: string;
  xpReward: number;
  conceptIds: string[];
}

export const MASTER_CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    level: 0,
    code: 'LVL-00',
    title: 'Digital & Computer Foundations',
    category: 'Foundations',
    description: 'Hardware architecture, CPU cycles, RAM, storage, processes, and the digital processing loop.',
    xpReward: 300,
    conceptIds: ['c0_cpu_ram', 'c0_process_memory', 'c0_client_server', 'c0_cli_basics']
  },
  {
    level: 1,
    code: 'LVL-01',
    title: 'Operating System Fundamentals (Linux & Windows)',
    category: 'Operating Systems',
    description: 'Unix filesystem, permissions, process lifecycle, Windows registry, and administrative shells.',
    xpReward: 400,
    conceptIds: ['c1_linux_fs_perms', 'c1_pipes_redirection', 'c1_windows_registry', 'c1_process_services']
  },
  {
    level: 2,
    code: 'LVL-02',
    title: 'Networking Fundamentals & Protocol Analysis',
    category: 'Networking',
    description: 'OSI 7 Layers, TCP/IP stack, packet encapsulation, subnetting CIDR math, DNS, and DHCP.',
    xpReward: 500,
    conceptIds: ['c2_osi_tcpip', 'c2_subnetting_cidr', 'c2_tcp_handshake', 'c2_dns_dhcp_wire']
  },
  {
    level: 3,
    code: 'LVL-03',
    title: 'Security Fundamentals & Cryptographic Triad',
    category: 'Security Foundations',
    description: 'CIA triad, defense in depth, encoding vs encryption vs hashing, threat vs vulnerability vs exploit, PKI, and MFA.',
    xpReward: 450,
    conceptIds: ['c3_cia_triad', 'c3_encoding_encrypt_hash', 'c3_threat_vuln_exploit', 'c3_pki_mfa']
  },
  {
    level: 4,
    code: 'LVL-04',
    title: 'Security Tools & Investigation Methodology',
    category: 'Security Methodology',
    description: 'Structured methodology: Scope, Recon, Enum, Analysis, Lab Exploit, Evidence, Reporting, and Remediation with Nmap, Wireshark, Burp.',
    xpReward: 500,
    conceptIds: ['c4_security_methodology', 'c4_nmap_scanning', 'c4_wireshark_dissection', 'c4_burp_proxy']
  },
  {
    level: 5,
    code: 'LVL-05',
    title: 'Web Fundamentals & Application Architecture',
    category: 'Web Fundamentals',
    description: 'Client-server HTTP requests/responses, headers, status codes, cookies, sessions, REST, JSON, and CORS.',
    xpReward: 450,
    conceptIds: ['c5_http_mechanics', 'c5_cookies_sessions', 'c5_rest_apis_json', 'c5_browser_same_origin']
  },
  {
    level: 6,
    code: 'LVL-06',
    title: 'Web Application Security & OWASP',
    category: 'Web Security',
    description: 'SQL Injection, Cross-Site Scripting (XSS), IDOR, SSRF, File Upload flaws, and Broken Authentication.',
    xpReward: 600,
    conceptIds: ['c6_sqli', 'c6_xss', 'c6_idor', 'c6_ssrf', 'c6_file_upload_traversal']
  },
  {
    level: 7,
    code: 'LVL-07',
    title: 'Cryptography Fundamentals & Key Exchange',
    category: 'Cryptography',
    description: 'Symmetric encryption (AES), asymmetric key exchange (RSA, ECC), TLS handshake, and digital signatures.',
    xpReward: 550,
    conceptIds: ['c7_symmetric_asymmetric', 'c7_tls_handshake', 'c7_hashing_signatures']
  },
  {
    level: 8,
    code: 'LVL-08',
    title: 'Linux Security & Privilege Escalation',
    category: 'Linux Security',
    description: 'SUID/SGID binaries, Linux capabilities, cron misconfigurations, PATH hijacking, and auditd inspection.',
    xpReward: 600,
    conceptIds: ['c8_suid_capabilities', 'c8_cron_path_hijack', 'c8_linux_privesc_methodology']
  },
  {
    level: 9,
    code: 'LVL-09',
    title: 'Windows Security & Token Architecture',
    category: 'Windows Security',
    description: 'Windows authentication, NTLM challenge-response, Kerberos tickets, access tokens, and Event Log triage.',
    xpReward: 600,
    conceptIds: ['c9_windows_auth_tokens', 'c9_ntlm_kerberos_basics', 'c9_windows_event_forensics']
  },
  {
    level: 10,
    code: 'LVL-10',
    title: 'Active Directory & Enterprise Identity',
    category: 'Enterprise Security',
    description: 'Domains, Domain Controllers, LDAP, Kerberoasting, AS-REP roasting, GPO abuse, and AD hardening.',
    xpReward: 700,
    conceptIds: ['c10_ad_architecture', 'c10_kerberos_attacks', 'c10_ad_hardening_detection']
  },
  {
    level: 11,
    code: 'LVL-11',
    title: 'Blue Team, SIEM & SOC Operations',
    category: 'Defensive Operations',
    description: 'SIEM architecture, log parsing, IOC vs IOA, alert triage, incident containment, and eradication.',
    xpReward: 650,
    conceptIds: ['c11_siem_architecture', 'c11_ioc_vs_ioa', 'c11_soc_alert_triage']
  },
  {
    level: 12,
    code: 'LVL-12',
    title: 'Threat Hunting & Behavioral Detection',
    category: 'Threat Hunting',
    description: 'Hypothesis-driven hunting, process ancestry trees, network beaconing analysis, and lateral movement detection.',
    xpReward: 700,
    conceptIds: ['c12_hypothesis_hunting', 'c12_process_tree_analysis', 'c12_lateral_movement_hunting']
  },
  {
    level: 13,
    code: 'LVL-13',
    title: 'Digital Forensics & Incident Response (DFIR)',
    category: 'Digital Forensics',
    description: 'Chain of custody, forensic imaging, master file table (MFT), prefetch artifacts, memory analysis, and timelines.',
    xpReward: 700,
    conceptIds: ['c13_chain_of_custody', 'c13_disk_artifacts', 'c13_memory_forensics_timelines']
  },
  {
    level: 14,
    code: 'LVL-14',
    title: 'Malware Analysis & Reverse Engineering',
    category: 'Malware Analysis',
    description: 'Static analysis, PE header inspection, hashing, dynamic behavioral sandboxing, and disassembly basics.',
    xpReward: 750,
    conceptIds: ['c14_static_analysis_pe', 'c14_dynamic_sandboxing', 'c14_disassembly_basics']
  },
  {
    level: 15,
    code: 'LVL-15',
    title: 'Red Team Operations & Penetration Testing',
    category: 'Offensive Operations',
    description: 'Scope, Rules of Engagement, initial access, command and control (C2), persistence, and executive reporting.',
    xpReward: 750,
    conceptIds: ['c15_redteam_methodology', 'c15_c2_persistence', 'c15_pentest_reporting']
  },
  {
    level: 16,
    code: 'LVL-16',
    title: 'Purple Teaming & Detection Engineering',
    category: 'Purple Team',
    description: 'Adversary emulation, connecting offensive payloads to telemetry, Sigma rule creation, and defensive feedback loops.',
    xpReward: 800,
    conceptIds: ['c16_purple_team_loop', 'c16_sigma_detection_rules', 'c16_attack_telemetry_correlation']
  },
  {
    level: 17,
    code: 'LVL-17',
    title: 'Cloud Security Architecture (AWS, GCP, Azure)',
    category: 'Cloud Security',
    description: 'Shared responsibility model, IAM policies, least privilege, bucket exposure, container security, and cloud audit logs.',
    xpReward: 750,
    conceptIds: ['c17_cloud_shared_responsibility', 'c17_cloud_iam_least_privilege', 'c17_cloud_storage_audit']
  },
  {
    level: 18,
    code: 'LVL-18',
    title: 'Container & DevSecOps Security',
    category: 'DevSecOps',
    description: 'Docker isolation, cgroups/namespaces, container breakout prevention, CI/CD pipeline security, SAST, DAST, and supply chain.',
    xpReward: 800,
    conceptIds: ['c18_docker_isolation_breakout', 'c18_cicd_sast_dast', 'c18_supply_chain_security']
  },
  {
    level: 19,
    code: 'LVL-19',
    title: 'AI Security & LLM Red Teaming',
    category: 'AI Security',
    description: 'Direct and indirect prompt injection, tool abuse, excessive agency, data leakage, model supply-chain, and robust guardrails.',
    xpReward: 850,
    conceptIds: ['c19_prompt_injection_defense', 'c19_insecure_tool_agency', 'c19_ai_red_teaming_guardrails']
  }
];

export const MASTER_CONCEPTS_GRAPH: Record<string, MasterConcept> = {
  // LEVEL 0
  'c0_cpu_ram': {
    id: 'c0_cpu_ram',
    level: 0,
    title: 'Computer Architecture: CPU, RAM & Storage',
    difficulty: 'FOUNDATION',
    prerequisites: [],
    nextConcepts: ['c0_process_memory', 'c1_linux_fs_perms'],
    relatedConcepts: ['c0_process_memory', 'c1_process_services'],
    definition: 'The fundamental physical and logical components that execute instructions, hold volatile runtime state, and persist long-term data.',
    whyItMatters: 'Every cyber attack—from buffer overflows to malware persistence—manipulates how the CPU executes instructions or how data resides in RAM and disk.',
    mentalModel: 'The CPU is a lightning-fast chef, RAM is the kitchen prep counter (fast, clears at night), and Storage is the pantry (vast, permanent, slower).',
    coreExplanation: 'The Central Processing Unit (CPU) executes arithmetic and logic instructions in clock cycles via the Fetch-Decode-Execute pipeline. Random Access Memory (RAM) provides high-speed volatile byte-addressable memory where active programs and variables live. Non-volatile storage (SSD/HDD) persists binaries and data across power cycles.',
    visualExplanation: {
      type: 'diagram',
      title: 'Von Neumann Architecture Flow',
      content: '[Storage / Disk] -> (Load into RAM) -> [RAM / Byte Addresses] <-> [CPU Registers / ALU / Control Unit]'
    },
    example: 'When you launch an application, the OS loads the compiled binary from Disk into RAM memory segments (Text, Data, Heap, Stack) and points the CPU Instruction Pointer (EIP/RIP) to the entry address.',
    practicalExercise: {
      task: 'Inspect system memory and CPU architecture in the Linux terminal.',
      commandOrPayload: 'lscpu && free -h',
      expectedOutcome: 'Displays CPU core topology, architecture (x86_64), total/used RAM in human-readable format.',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Confusing RAM (volatile, byte-addressable) with Storage/Disk (non-volatile, block-based).',
      'Assuming programs execute directly on disk without being copied into RAM.'
    ],
    securityRelevance: 'Memory corruption bugs (e.g. stack buffer overflows) overwrite RAM return pointers to hijack CPU execution flow.',
    offensivePerspective: 'Attackers target memory offsets and heap structures to execute arbitrary shellcode.',
    defensivePerspective: 'Defenders implement ASLR (Address Space Layout Randomization) and DEP/NX (Data Execution Prevention) to stop code execution in data RAM.',
    assessment: {
      question: 'Why must an executable file be loaded into RAM before the CPU can run its instructions?',
      options: [
        'Because storage drives cannot be read by software',
        'Because the CPU can only fetch instructions directly from high-speed byte-addressable memory and registers',
        'Because RAM permanently encrypts all executable code',
        'Because the operating system deletes files from disk upon execution'
      ],
      correctIndex: 1,
      explanation: 'The CPU architecture requires instructions to reside in byte-addressable RAM or cache for the instruction pointer to fetch and execute cycles at gigahertz speeds.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['SOC Analyst', 'Penetration Tester', 'Reverse Engineer', 'Security Engineer']
  },

  'c0_process_memory': {
    id: 'c0_process_memory',
    level: 0,
    title: 'Processes & Virtual Memory Space',
    difficulty: 'FOUNDATION',
    prerequisites: ['c0_cpu_ram'],
    nextConcepts: ['c1_process_services'],
    relatedConcepts: ['c0_cpu_ram', 'c8_suid_capabilities'],
    definition: 'A process is an active, executing instance of a program with an isolated virtual memory space (Stack, Heap, Data, Text).',
    whyItMatters: 'Process isolation protects programs from tampering with each other; security exploits break these boundaries or inject into other processes.',
    mentalModel: 'A program is a recipe printed in a book (on disk); a process is the chef actively cooking the dish in an isolated kitchen stall.',
    coreExplanation: 'When an OS executes a program, it allocates a Process ID (PID) and a virtual address space. The memory layout is partitioned into: Text (compiled code), Data/BSS (global variables), Heap (dynamically allocated memory), and Stack (local variables, function call frames, return addresses).',
    visualExplanation: {
      type: 'diagram',
      title: 'Process Virtual Memory Layout',
      content: '[High Memory 0xFFFFFFFF] -> [Kernel Space] -> [Stack (grows down)] -> [Unallocated] -> [Heap (grows up)] -> [BSS / Data] -> [Text / Code] -> [Low Memory 0x00000000]'
    },
    example: 'In Linux, running `ps aux` lists all active processes, their PID, user owner, CPU/RAM usage, and executable command line.',
    practicalExercise: {
      task: 'List active processes and observe the PID hierarchy.',
      commandOrPayload: 'ps -eo pid,user,args --forest | head -n 20',
      expectedOutcome: 'Displays process tree showing systemd (PID 1) spawning child daemons and user shells.',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Assuming two processes with the same name share the same memory space.',
      'Confusing the Stack (automatic LIFO function frames) with the Heap (dynamic malloc/free memory).'
    ],
    securityRelevance: 'Process injection (e.g. DLL injection, ptrace hijacking) allows malware to hide inside trusted system processes like svchost.exe or systemd.',
    offensivePerspective: 'Red teams migrate beacon payloads into legitimate system processes to evade endpoint detection.',
    defensivePerspective: 'EDR monitors unexpected process injection APIs (VirtualAllocEx, WriteProcessMemory, CreateRemoteThread) and abnormal parent-child process relationships.',
    assessment: {
      question: 'Which process memory section is automatically managed in a LIFO (Last-In, First-Out) structure for local variables and return addresses?',
      options: ['Heap', 'Stack', 'BSS segment', 'Text segment'],
      correctIndex: 1,
      explanation: 'The Stack stores stack frames for function calls, local variables, and return instruction pointers in a strict LIFO order.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['SOC Analyst', 'Threat Hunter', 'Malware Analyst', 'Penetration Tester']
  },

  'c0_client_server': {
    id: 'c0_client_server',
    level: 0,
    title: 'Client-Server Architecture & Communication',
    difficulty: 'FOUNDATION',
    prerequisites: ['c0_cpu_ram'],
    nextConcepts: ['c2_osi_tcpip', 'c5_http_mechanics'],
    relatedConcepts: ['c2_tcp_handshake', 'c5_http_mechanics'],
    definition: 'A distributed computing model where service requesters (clients) initiate requests to dedicated providers (servers) listening on network ports.',
    whyItMatters: 'Almost all internet protocols and cybersecurity attacks happen across the client-server boundary.',
    mentalModel: 'A customer (client) placing an order at a restaurant counter; the cashier (server daemon listening on a port) processes the order and returns food (response).',
    coreExplanation: 'A server runs a background daemon that binds to a specific IP address and network port (e.g. port 80 for HTTP, 22 for SSH), entering a passive LISTEN state. A client initiates a connection using an ephemeral outbound port, sends a formatted request, and receives a response.',
    visualExplanation: {
      type: 'flow',
      title: 'Client-Server Request-Response Lifecycle',
      content: '[Client (Browser / Curl)] --(Request: GET /index.html)--> [Network / Internet] --> [Server (Nginx :80)]\n[Client (Browser / Curl)] <-- (Response: 200 OK + HTML) -- [Network / Internet] <-- [Server (Nginx :80)]'
    },
    example: 'Running `curl -i http://example.com` makes your terminal act as an HTTP client sending a request to the server at IP 93.184.216.34 on port 80.',
    practicalExercise: {
      task: 'Use netcat to create a minimal listening server and connect to it as a client.',
      commandOrPayload: 'nc -lvnp 4444',
      expectedOutcome: 'Terminal listens on port 4444 waiting for incoming client connections.',
      labRoute: '/network-lab'
    },
    commonMistakes: [
      'Assuming the client and server must be on different physical machines (they can communicate over localhost 127.0.0.1).',
      'Thinking servers initiate connections to clients in standard request-response protocols.'
    ],
    securityRelevance: 'Servers represent listening attack surface. Any open port with an unpatched service can be targeted for exploitation.',
    offensivePerspective: 'Port scanning identifies listening server daemons and software versions to pinpoint unauthenticated remote code execution vulnerabilities.',
    defensivePerspective: 'Firewalls enforce ingress filtering, closing unused listening ports to shrink the external attack surface.',
    assessment: {
      question: 'What state must a server program be in to accept connections from incoming clients?',
      options: ['CLOSED', 'SYN_SENT', 'LISTEN', 'TIME_WAIT'],
      correctIndex: 2,
      explanation: 'A server binds a socket to a port and calls listen() to enter the LISTEN state, waiting for client handshakes.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['SOC Analyst', 'Network Security Engineer', 'Penetration Tester']
  },

  'c0_cli_basics': {
    id: 'c0_cli_basics',
    level: 0,
    title: 'Command Line Interface (CLI) Fundamentals',
    difficulty: 'FOUNDATION',
    prerequisites: ['c0_cpu_ram'],
    nextConcepts: ['c1_linux_fs_perms', 'c1_pipes_redirection'],
    relatedConcepts: ['c1_linux_fs_perms'],
    definition: 'A text-based mechanism for interacting with an operating system by typing commands with arguments and flags.',
    whyItMatters: 'GUIs hide critical system metadata, log streams, and security tooling. Mastery of the CLI is mandatory for all cybersecurity professionals.',
    mentalModel: 'A GUI is like driving an automatic car on a pre-paved tourist road; the CLI is piloting a spaceship with direct access to every engine thruster.',
    coreExplanation: 'A CLI command consists of the command executable name, optional modifier flags/switches (e.g. `-l`, `-a`, `--verbose`), and arguments (e.g. file paths or target hosts). Standard streams include stdin (0), stdout (1), and stderr (2).',
    visualExplanation: {
      type: 'diagram',
      title: ' Anatomy of a CLI Command',
      content: 'Command: [nmap]  Flags: [-sV -p 80]  Argument: [192.168.1.1]\n           ^               ^                      ^\n      (Executable)     (Modifiers)             (Target)'
    },
    example: '`ls -la /var/log` runs the `ls` program with `-l` (long listing) and `-a` (show hidden files) against the directory `/var/log`.',
    practicalExercise: {
      task: 'Navigate filesystem and print working directory and current user.',
      commandOrPayload: 'pwd && whoami && id',
      expectedOutcome: 'Prints absolute current directory path, username, UID, GID, and group memberships.',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Forgetting that Unix filenames and commands are strictly case-sensitive (`ls` vs `LS`).',
      'Confusing relative paths (`logs/auth.log`) with absolute paths (`/var/log/auth.log`).'
    ],
    securityRelevance: 'Command line logs (e.g. Bash history, Windows Event ID 4688) provide the primary forensic evidence trail during incident response.',
    offensivePerspective: 'Attackers utilize living-off-the-land binaries (LOLBins) directly from the CLI to evade antivirus detections.',
    defensivePerspective: 'SOC analysts write SIEM detection rules to alert on suspicious command-line flags (e.g. `powershell -enc`, `certutil -urlcache`).',
    assessment: {
      question: 'In standard Unix shells, what do the file descriptors 0, 1, and 2 represent?',
      options: [
        'Root, User, Guest',
        'stdin, stdout, stderr',
        'Read, Write, Execute',
        'Input, Output, Pipe'
      ],
      correctIndex: 1,
      explanation: 'File descriptor 0 is standard input (stdin), 1 is standard output (stdout), and 2 is standard error (stderr).'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['SOC Analyst', 'Penetration Tester', 'DFIR Analyst', 'Security Engineer']
  },

  // LEVEL 1: LINUX & WINDOWS OS
  'c1_linux_fs_perms': {
    id: 'c1_linux_fs_perms',
    level: 1,
    title: 'Linux Permissions & Core Administration',
    difficulty: 'BEGINNER',
    prerequisites: ['c0_cli_basics'],
    nextConcepts: ['c8_suid_capabilities', 'c1_pipes_redirection'],
    relatedConcepts: ['c8_suid_capabilities', 'c0_cli_basics'],
    definition: 'The Unix single-rooted filesystem tree (`/`) and its discretionary access control system (User, Group, Others permissions in Read/Write/Execute bits).',
    whyItMatters: 'Misconfigured file permissions (e.g. world-writable `/etc/passwd` or exposed SSH keys) represent one of the most common vectors for local privilege escalation.',
    mentalModel: 'Every file has a three-lock security gate: one key for the Owner (u), one for the Team/Group (g), and one for the Public (o).',
    coreExplanation: 'Linux permissions use 3 sets of 3 bits: `r` (read = 4), `w` (write = 2), `x` (execute = 1). In octal notation, `chmod 755 file` grants `rwx` (7) to owner, `r-x` (5) to group, and `r-x` (5) to others. Directory execution (`x`) is required to traverse into the directory.',
    visualExplanation: {
      type: 'table',
      title: 'Linux Permission Matrix',
      content: 'Symbol | Binary | Octal | Meaning for Files | Meaning for Directories\nr--    | 100    | 4     | Read content      | List files in directory\n-w-    | 010    | 2     | Modify content    | Create/delete files in dir\n--x    | 001    | 1     | Execute program   | Enter/cd into directory\nrwx    | 111    | 7     | Full control      | Full control'
    },
    example: '`-rw-r--r-- 1 root root 1240 Jan 15 10:00 /etc/shadow` indicates only `root` can read/write; others have zero access.',
    practicalExercise: {
      task: 'Check file permissions of system files and identify world-writable files.',
      commandOrPayload: 'find /etc -maxdepth 2 -type f -perm -o=w 2>/dev/null',
      expectedOutcome: 'Audits `/etc` for dangerous world-writable configuration files.',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Assuming chmod 777 is an acceptable fix for permission errors in production.',
      'Forgetting that deleting a file requires write permission on the PARENT DIRECTORY, not on the file itself.'
    ],
    securityRelevance: 'Overly permissive file settings allow unprivileged local users to read sensitive credentials or overwrite executable scripts.',
    offensivePerspective: 'Pentesters run privilege escalation scanners (LinPEAS) to find world-writable files in cron directories or root PATH.',
    defensivePerspective: 'Defenders run file integrity monitoring (FIM / OSSEC) to detect unexpected permission modifications on critical system paths.',
    assessment: {
      question: 'What numerical octal code represents permissions where the Owner has full control (rwx), and Group and Others have read and execute only (r-x)?',
      options: ['644', '755', '777', '700'],
      correctIndex: 1,
      explanation: 'Owner: 4+2+1=7. Group: 4+0+1=5. Others: 4+0+1=5. Total octal: 755.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['Linux Administrator', 'Penetration Tester', 'SOC Analyst', 'Cloud Security Engineer']
  },

  'c1_pipes_redirection': {
    id: 'c1_pipes_redirection',
    level: 1,
    title: 'Unix Pipes, Redirection & Log Filtering',
    difficulty: 'BEGINNER',
    prerequisites: ['c0_cli_basics'],
    nextConcepts: ['c4_security_methodology', 'c11_siem_architecture'],
    relatedConcepts: ['c0_cli_basics'],
    definition: 'Chaining commands together by sending the stdout of one program into the stdin of another via `|`, and controlling file streams with `>`, `>>`, and `<`.',
    whyItMatters: 'SOC analysts and threat hunters parse gigabytes of raw security logs in seconds using CLI pipelines with `grep`, `awk`, `sort`, and `uniq`.',
    mentalModel: 'A pipeline connects industrial plumbing: output water from tank A flows directly into filter B, which flows into bottling plant C.',
    coreExplanation: 'The pipe `|` redirects stdout of the left command to stdin of the right command. `>` writes stdout to a file (overwriting), `>>` appends stdout to a file, `2>` redirects stderr, and `2>&1` merges stderr into stdout.',
    visualExplanation: {
      type: 'flow',
      title: 'Stream Redirection & Pipe Pipeline',
      content: '[cat /var/log/auth.log] --(stdout)--> | [grep "Failed password"] --(stdout)--> | [awk \'{print $11}\'] --(stdout)--> | [sort | uniq -c] > failed_ips.txt'
    },
    example: '`grep "Accepted publickey" /var/log/auth.log | awk \'{print $9, $11}\' | sort | uniq -c` summarizes successful SSH logins by user and source IP.',
    practicalExercise: {
      task: 'Extract all failed login attempts from auth log and rank top attacker IPs.',
      commandOrPayload: 'grep "Failed" /var/log/auth.log | awk \'{print $(NF-3)}\' | sort | uniq -c | sort -nr | head -n 5',
      expectedOutcome: 'Outputs count and IP address of the top 5 aggressive brute force sources.',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Using `>` instead of `>>`, accidentally overwriting critical log files.',
      'Running `grep` on binary files without text filters.'
    ],
    securityRelevance: 'Log filtering pipelines are the baseline triage tool for identifying initial compromise indicators during live incidents.',
    offensivePerspective: 'Attackers use one-liner pipelines to harvest passwords (`cat ~/.bash_history | grep -i pass`) and pivot through internal networks.',
    defensivePerspective: 'Defenders build automated log parsing scripts to extract attacker indicators of compromise (IOCs) and feed firewall drop tables.',
    assessment: {
      question: 'Which redirection operator appends command output to an existing file without wiping its existing contents?',
      options: ['>', '>>', '<', '2>'],
      correctIndex: 1,
      explanation: '`>>` opens the target file in append mode, whereas `>` truncates and overwrites the file.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['SOC Analyst', 'Incident Responder', 'Penetration Tester', 'DevSecOps']
  },

  'c1_windows_registry': {
    id: 'c1_windows_registry',
    level: 1,
    title: 'Windows Architecture & Registry Forensics',
    difficulty: 'BEGINNER',
    prerequisites: ['c0_cpu_ram'],
    nextConcepts: ['c9_windows_auth_tokens', 'c13_disk_artifacts'],
    relatedConcepts: ['c9_windows_auth_tokens'],
    definition: 'A centralized hierarchical database in Windows storing low-level operating system, hardware driver, software configuration, and user preference settings.',
    whyItMatters: 'Malware commonly establishes persistence by writing to Registry Run keys, and forensic analysts inspect Registry hives for execution evidence (UserAssist, Shimcache).',
    mentalModel: 'The Registry is the central nervous system database of Windows, arranged like folders (Keys) holding configuration records (Values).',
    coreExplanation: 'The Registry is organized into 5 root hives: HKEY_LOCAL_MACHINE (HKLM - machine settings), HKEY_CURRENT_USER (HKCU - logged-in user profile), HKEY_CLASSES_ROOT (HKCR - file associations), HKEY_USERS (HKU), and HKEY_CURRENT_CONFIG (HKCC).',
    visualExplanation: {
      type: 'tree',
      title: 'Windows Registry Hierarchy & Persistence Keys',
      content: 'Registry Root\n ├── HKLM (System-wide)\n │    └── Software\\Microsoft\\Windows\\CurrentVersion\\Run (System Persistence)\n └── HKCU (User-specific)\n      └── Software\\Microsoft\\Windows\\CurrentVersion\\Run (User Persistence)'
    },
    example: 'PowerShell command `Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run` lists programs configured to launch automatically on boot.',
    practicalExercise: {
      task: 'Query Windows startup persistence keys via command line.',
      commandOrPayload: 'reg query "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"',
      expectedOutcome: 'Lists all binary paths registered for auto-execution on system boot.',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Assuming deleting a malware executable cleans the system without removing its Registry persistence keys.',
      'Editing Registry keys in production without taking a backup hive export (`.reg`).'
    ],
    securityRelevance: 'Autoruns and RunOnce registry keys are prime persistence vectors (MITRE ATT&CK T1547.001).',
    offensivePerspective: 'Attackers inject stealthy startup keys or modify Accessibility tool paths (Sticky Keys `sethc.exe` backdoor) via the Registry.',
    defensivePerspective: 'Sysmon Event ID 12, 13, and 14 monitor Registry creation, set-value, and key delete actions to catch persistence creation in real-time.',
    assessment: {
      question: 'Under which Registry hive does a user-level autostart persistence program reside?',
      options: ['HKEY_CLASSES_ROOT', 'HKEY_CURRENT_USER (HKCU)', 'HKEY_HARDWARE', 'HKEY_LOCAL_DRIVE'],
      correctIndex: 1,
      explanation: 'HKCU stores user-specific configurations, including `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run` which runs when that user logs in.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['SOC Analyst', 'DFIR Analyst', 'Threat Hunter', 'Windows Administrator']
  },

  'c1_process_services': {
    id: 'c1_process_services',
    level: 1,
    title: 'Daemons, Background Services & Systemd',
    difficulty: 'BEGINNER',
    prerequisites: ['c0_process_memory', 'c1_linux_fs_perms'],
    nextConcepts: ['c8_suid_capabilities', 'c11_siem_architecture'],
    relatedConcepts: ['c0_process_memory'],
    definition: 'Long-running background processes (daemons in Linux, Services in Windows) that operate without direct user terminal interaction to serve network requests.',
    whyItMatters: 'Attackers create rogue services or hijack existing unquoted service paths to execute persistent payloads with SYSTEM/root privileges.',
    mentalModel: 'An interactive program is a worker waiting for direct verbal orders; a service is an automated night-guard robot running continuously on a schedule.',
    coreExplanation: 'On modern Linux distributions, `systemd` (PID 1) manages services via unit files located in `/etc/systemd/system/` or `/lib/systemd/system/`. Service lifecycle is controlled via `systemctl start|stop|restart|status|enable`.',
    visualExplanation: {
      type: 'flow',
      title: 'Linux Service Lifecycle via Systemd',
      content: '[systemctl start nginx] -> [Systemd PID 1 reads /lib/systemd/system/nginx.service] -> [Forks child process PID 1420] -> [Binds to Port 80]'
    },
    example: 'Checking `systemctl status sshd` displays whether the OpenSSH daemon is active, its PID, memory footprint, and recent log snippets.',
    practicalExercise: {
      task: 'Inspect running systemd services and view service unit definitions.',
      commandOrPayload: 'systemctl list-units --type=service --state=running',
      expectedOutcome: 'Lists all active daemons, unit names, and active descriptions.',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Assuming stopping a service prevents it from restarting on the next boot (you must run `systemctl disable`).',
      'Placing world-writable scripts inside systemd service `ExecStart` directives.'
    ],
    securityRelevance: 'Service misconfigurations (e.g. unquoted service paths in Windows, or writable service files in Linux) lead directly to root privilege escalation.',
    offensivePerspective: 'Attackers create persistent systemd timers or Windows services configured with reverse shell payloads.',
    defensivePerspective: 'SOC analysts monitor service installation events (Windows Event ID 7045 / Linux auditd EXECVE of systemctl) for unauthorized daemon creation.',
    assessment: {
      question: 'Which command ensures a Linux service automatically starts upon system reboot?',
      options: ['systemctl start <svc>', 'systemctl enable <svc>', 'systemctl boot <svc>', 'systemctl autorun <svc>'],
      correctIndex: 1,
      explanation: '`systemctl enable` creates symbolic links in `/etc/systemd/system/` so the init system launches the unit on boot.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['SOC Analyst', 'Linux Administrator', 'Penetration Tester', 'Cloud Security Engineer']
  },

  // LEVEL 2: NETWORKING & PROTOCOLS
  'c2_osi_tcpip': {
    id: 'c2_osi_tcpip',
    level: 2,
    title: 'OSI 7-Layer vs TCP/IP Stack & Encapsulation',
    difficulty: 'BEGINNER',
    prerequisites: ['c0_client_server'],
    nextConcepts: ['c2_subnetting_cidr', 'c2_tcp_handshake'],
    relatedConcepts: ['c2_tcp_handshake'],
    definition: 'Conceptual network models describing how data moves from high-level applications down to physical bits across transmission media through packet encapsulation.',
    whyItMatters: 'Every network attack and security control operates at a specific layer (e.g. MAC spoofing at L2, IP spoofing at L3, SYN floods at L4, SQLi at L7).',
    mentalModel: 'Sending a letter: Write message (L7) -> Put in envelope with Department (L4) -> Put in postal envelope with Street/City (L3) -> Postal truck takes bin (L2) -> Physical road (L1).',
    coreExplanation: 'Data is encapsulated as it descends the stack: Application Data -> Transport Segment (TCP/UDP header with Ports) -> Network Packet (IP header with Source/Dest IP) -> Data Link Frame (Ethernet header with MAC addresses and CRC trailer) -> Physical Bits on wire.',
    visualExplanation: {
      type: 'table',
      title: 'OSI 7 Layers vs TCP/IP Model & PDU Types',
      content: 'OSI Layer | TCP/IP Layer | PDU Name | Header Added | Security Examples\n7. Application | Application | Data | HTTP, SSH, DNS | WAF, L7 DDoS, SQLi\n6. Presentation | Application | Data | TLS / SSL | TLS Decryption\n5. Session | Application | Data | Sockets, RPC | Session Hijacking\n4. Transport | Transport | Segment | TCP/UDP Ports | Stateful Firewall, SYN Flood\n3. Network | Internet | Packet | Source/Dest IP | IP Spoofing, Routers, ACLs\n2. Data Link | Network Access | Frame | Source/Dest MAC | ARP Poisoning, Switches\n1. Physical | Network Access | Bits | Electrical/Optical | Tap, Jamming, Cable Cut'
    },
    example: 'When browsing a website, your HTTP GET request is wrapped in a TCP header (port 443), an IP header (destination IP), and an Ethernet frame (gateway MAC address).',
    practicalExercise: {
      task: 'Capture and inspect encapsulated protocol layers of an outbound ping.',
      commandOrPayload: 'tcpdump -c 2 -nnvv -i any icmp',
      expectedOutcome: 'Shows IP header (TTL, source/dest IP) and ICMP protocol payload structure.',
      labRoute: '/network-lab'
    },
    commonMistakes: [
      'Believing MAC addresses travel across the entire internet (MAC addresses change at every router hop).',
      'Confusing Layer 4 Port numbers with Layer 3 IP addresses.'
    ],
    securityRelevance: 'Defense-in-depth requires controls at every layer: 802.1X at L2, Network ACLs at L3, Next-Gen Firewalls at L4, and WAFs at L7.',
    offensivePerspective: 'Attackers identify what layer a target defense operates on to craft bypasses (e.g. tunneling HTTP inside DNS to bypass L4 firewall blocks).',
    defensivePerspective: 'Defenders correlate cross-layer anomalies (e.g. mismatch between L7 HTTP host header and L3 destination IP address).',
    assessment: {
      question: 'At which OSI layer does packet routing based on logical IPv4/IPv6 addresses occur?',
      options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
      correctIndex: 1,
      explanation: 'Layer 3 (Network) handles logical addressing (IP addresses) and path routing across multiple network hops.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['Network Security Engineer', 'SOC Analyst', 'Penetration Tester']
  },

  'c2_subnetting_cidr': {
    id: 'c2_subnetting_cidr',
    level: 2,
    title: 'IPv4 Addressing, Subnetting & CIDR Calculation',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c2_osi_tcpip'],
    nextConcepts: ['c4_nmap_scanning'],
    relatedConcepts: ['c2_osi_tcpip'],
    definition: 'Classless Inter-Domain Routing (CIDR) notation and binary subnet mask calculations to divide IP network address space into segmented subnets.',
    whyItMatters: 'Network segmentation is the #1 defense against lateral movement. Understanding subnet boundaries is essential for scoping pentests and setting firewall rules.',
    mentalModel: 'An IP address is a street address: the network portion is the Neighborhood name, and the host portion is the individual House number.',
    coreExplanation: 'An IPv4 address has 32 bits. The CIDR prefix (e.g. `/24`) specifies how many bits represent the network ID. The remaining bits (`32 - prefix`) represent host addresses. Usable hosts = `2^(host_bits) - 2` (subtracting Network ID and Broadcast address).',
    visualExplanation: {
      type: 'table',
      title: 'Common CIDR Subnet Masks & Host Capacities',
      content: 'CIDR | Subnet Mask | Total IPs | Usable Hosts | Common Use Case\n/30  | 255.255.255.252 | 4 | 2 | Point-to-point router links\n/28  | 255.255.255.240 | 16 | 14 | Small server DMZ\n/24  | 255.255.255.0   | 256 | 254 | Standard office LAN / VLAN\n/16  | 255.255.0.0     | 65,536 | 65,534 | Large enterprise campus\n/8   | 255.0.0.0       | 16,777,216 | 16,777,214 | Class A private (10.0.0.0/8)'
    },
    example: 'For 192.168.1.70/26: Subnet mask is 255.255.255.192. Block size = 256 - 192 = 64. Networks increment by 64: 0, 64, 128... 70 falls in 192.168.1.64. Network ID = 192.168.1.64, Broadcast = 192.168.1.127, Usable hosts = 192.168.1.65 to 192.168.1.126.',
    practicalExercise: {
      task: 'Calculate network boundary and test connectivity across isolated subnets in the Network Lab.',
      commandOrPayload: 'ip route show && ip -br addr',
      expectedOutcome: 'Displays local IP assignment, CIDR prefix, and default gateway routing rules.',
      labRoute: '/network-lab'
    },
    commonMistakes: [
      'Forgetting to subtract 2 when calculating usable host IPs (Network ID and Broadcast are reserved).',
      'Assuming private IP ranges (RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are directly routable across the public internet.'
    ],
    securityRelevance: 'Insecure flat networks allow an attacker who compromises one workstation to reach critical database servers without encountering a firewall.',
    offensivePerspective: 'Pentesters enumerate secondary network interfaces to find dual-homed machines and pivot into private internal subnets.',
    defensivePerspective: 'Architects implement micro-segmentation with /28 or /29 subnets to isolate critical assets into distinct trust zones.',
    assessment: {
      question: 'How many usable host IP addresses exist in a /27 IPv4 subnet?',
      options: ['32', '30', '62', '14'],
      correctIndex: 1,
      explanation: '32 - 27 = 5 host bits. 2^5 = 32 total IPs. Minus 2 (network and broadcast) = 30 usable hosts.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Network Security Engineer', 'Penetration Tester', 'Cloud Security Architect']
  },

  'c2_tcp_handshake': {
    id: 'c2_tcp_handshake',
    level: 2,
    title: 'TCP 3-Way Handshake & UDP Mechanics',
    difficulty: 'BEGINNER',
    prerequisites: ['c2_osi_tcpip'],
    nextConcepts: ['c4_nmap_scanning', 'c9_windows_event_forensics'],
    relatedConcepts: ['c2_osi_tcpip'],
    definition: 'The connection-establishment process in TCP using SYN, SYN-ACK, and ACK packet flags to synchronize sequence numbers and establish reliable streams.',
    whyItMatters: 'Understanding TCP flags is fundamental to port scanning techniques (SYN stealth vs connect), stateful firewall state tables, and DoS attacks.',
    mentalModel: 'A walkie-talkie protocol: "Can you hear me? (SYN)" -> "I hear you, can you hear me? (SYN-ACK)" -> "Yes, I hear you! (ACK)".',
    coreExplanation: 'Client sends SYN with Initial Sequence Number (ISN_c). Server responds with SYN-ACK, setting ACK = ISN_c + 1 and proposing its own ISN_s. Client sends ACK with ACK = ISN_s + 1. Data transfer begins. Teardown uses FIN-ACK / ACK or immediate RST.',
    visualExplanation: {
      type: 'flow',
      title: 'TCP 3-Way Handshake Sequence',
      content: '[Client] --- (SYN: Seq=100) ---> [Server]\n[Client] <--- (SYN-ACK: Seq=500, Ack=101) --- [Server]\n[Client] --- (ACK: Seq=101, Ack=501) ---> [Server]\n[=== Connection ESTABLISHED ===]'
    },
    example: 'In Wireshark, filtering by `tcp.flags.syn == 1 && tcp.flags.ack == 0` isolates connection initiation requests.',
    practicalExercise: {
      task: 'Capture and observe TCP handshake flags in real-time.',
      commandOrPayload: 'tcpdump -nn -i any "tcp[tcpflags] & (tcp-syn|tcp-ack) != 0" -c 6',
      expectedOutcome: 'Displays exact SYN, SYN-ACK, ACK packet exchange between hosts.',
      labRoute: '/network-lab'
    },
    commonMistakes: [
      'Assuming UDP uses handshakes (UDP is connectionless and stateless).',
      'Confusing RST (abrupt reset/drop) with FIN (graceful bidirectional teardown).'
    ],
    securityRelevance: 'SYN flood attacks exhaust server connection state tables by sending thousands of SYN packets and never sending the final ACK.',
    offensivePerspective: 'Nmap uses SYN stealth scans (`-sS`) to probe open ports without completing the handshake, avoiding application-level session logging.',
    defensivePerspective: 'Defenders deploy SYN cookies and rate limiting on firewalls to neutralize SYN flood denial-of-service attacks.',
    assessment: {
      question: 'Which packet flags are set by a server when accepting a new TCP connection request?',
      options: ['SYN only', 'ACK only', 'SYN and ACK', 'FIN and ACK'],
      correctIndex: 2,
      explanation: 'The server sets both SYN (to synchronize its own sequence number) and ACK (to acknowledge the client sequence number).'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['SOC Analyst', 'Network Security Engineer', 'Penetration Tester']
  },

  'c2_dns_dhcp_wire': {
    id: 'c2_dns_dhcp_wire',
    level: 2,
    title: 'Core Infrastructure Protocols: DNS & DHCP on the Wire',
    difficulty: 'BEGINNER',
    prerequisites: ['c2_osi_tcpip'],
    nextConcepts: ['c4_nmap_scanning', 'c7_tls_handshake'],
    relatedConcepts: ['c2_osi_tcpip'],
    definition: 'Domain Name System (DNS - UDP port 53 name resolution) and Dynamic Host Configuration Protocol (DHCP - UDP ports 67/68 automatic IP configuration).',
    whyItMatters: 'Over 90% of malware campaigns rely on DNS for Command & Control (C2) domain generation algorithms (DGAs) and DNS data exfiltration.',
    mentalModel: 'DHCP is the conference receptionist handing you a visitor name badge and seat assignment (IP); DNS is the phonebook translating human names to numeric phone numbers.',
    coreExplanation: 'DHCP uses DORA: Discover (client broadcast), Offer (server response), Request (client selection), Acknowledge (server lease confirmation). DNS resolves domain names through hierarchical lookup: Root (.) -> TLD (.com) -> Authoritative Nameserver -> A/AAAA/MX/TXT records.',
    visualExplanation: {
      type: 'flow',
      title: 'Recursive DNS Query Lifecycle',
      content: '[Client] -> [Local Resolver] -> [Root Server (.)] -> [.com TLD Server] -> [Authoritative NS (example.com)] -> [IP: 93.184.216.34] -> [Client]'
    },
    example: 'Running `dig TXT google.com +short` queries the authoritative nameservers for SPF verification records.',
    practicalExercise: {
      task: 'Perform manual DNS resolution and inspect query response records.',
      commandOrPayload: 'dig @8.8.8.8 A scanme.nmap.org +stats',
      expectedOutcome: 'Shows query response time, resolved A record IP, and authoritative server details.',
      labRoute: '/network-lab'
    },
    commonMistakes: [
      'Assuming DNS traffic is encrypted by default (standard DNS is plaintext UDP 53; DoH and DoT add TLS encryption).',
      'Confusing authoritative nameservers with recursive resolving servers.'
    ],
    securityRelevance: 'DNS tunneling encodes stolen data into subdomains (e.g. `secretdata.attacker.com`), bypassing firewall rules that permit outbound UDP 53.',
    offensivePerspective: 'Attackers register lookalike domains (typosquatting) and use fast-flux DNS rotation to keep C2 infrastructure resilient.',
    defensivePerspective: 'SOC analysts monitor DNS query logs for high-entropy subdomain strings, unusual volume spikes, and newly registered domains (NRDs).',
    assessment: {
      question: 'What is the 4-step sequence used by DHCP to allocate an IP address to a new client?',
      options: ['SYN, SYN-ACK, ACK, FIN', 'Discover, Offer, Request, Acknowledge (DORA)', 'Query, Lookup, Response, Connect', 'Probe, Assign, Lease, Bind'],
      correctIndex: 1,
      explanation: 'DHCP follows the DORA sequence: Discover -> Offer -> Request -> Acknowledge.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['SOC Analyst', 'Network Engineer', 'Incident Responder']
  },

  // LEVEL 3: SECURITY & CRYPTOGRAPHY FUNDAMENTALS
  'c3_cia_triad': {
    id: 'c3_cia_triad',
    level: 3,
    title: 'CIA Triad, Defense in Depth & Least Privilege',
    difficulty: 'BEGINNER',
    prerequisites: ['c0_cpu_ram'],
    nextConcepts: ['c3_encoding_encrypt_hash', 'c3_threat_vuln_exploit'],
    relatedConcepts: ['c3_threat_vuln_exploit'],
    definition: 'The foundational security model balancing Confidentiality (privacy), Integrity (accuracy/authenticity), and Availability (accessibility) through layered defenses.',
    whyItMatters: 'Every cybersecurity policy, technical control, risk assessment, and incident categorization maps directly back to the CIA Triad.',
    mentalModel: 'A bank vault: Confidentiality = thick windowless walls, Integrity = tamper-evident seals on cash bags, Availability = operating during opening hours with working keys.',
    coreExplanation: 'Confidentiality ensures only authorized entities read data (encryption, ACLs). Integrity ensures data is not altered in transit or storage (hashes, digital signatures). Availability ensures systems remain reachable when needed (redundancy, DDoS mitigation, backups). Defense-in-depth applies multiple overlapping security layers.',
    visualExplanation: {
      type: 'diagram',
      title: 'The CIA Triad Pillars',
      content: '          [Confidentiality] (Encryption, ACLs, DLP)\n                 /        \\\n                /   CIA    \\\n               /   TRIAD    \\\n    [Integrity] ------------ [Availability]\n  (Hashing, PKI)           (Redundancy, Backups)'
    },
    example: 'Ransomware attacks violate both Availability (encrypting operational files) and Confidentiality (exfiltrating data in double-extortion schemes).',
    practicalExercise: {
      task: 'Audit user privilege boundaries to verify least privilege enforcement.',
      commandOrPayload: 'sudo -l',
      expectedOutcome: 'Shows exactly which commands the current user is authorized to execute with root privileges.',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Focusing 100% on Confidentiality while ignoring Availability (e.g. failing to maintain offline backups).',
      'Believing a single strong security control (e.g. strong password) eliminates the need for layered defenses.'
    ],
    securityRelevance: 'Security architecture balances business velocity with CIA protections; Least Privilege ensures users only receive the bare minimum access needed for their role.',
    offensivePerspective: 'Attackers identify single points of failure where a single control failure compromises the entire system.',
    defensivePerspective: 'Defenders design controls so that if an attacker bypasses the perimeter firewall, internal authentication and EDR still block lateral progress.',
    assessment: {
      question: 'Which pillar of the CIA Triad is violated when an unauthorized database trigger silently modifies user account balances?',
      options: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'],
      correctIndex: 1,
      explanation: 'Integrity guarantees data remains authentic and free from unauthorized modification or tampering.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['Security Analyst', 'Security Architect', 'Compliance Officer', 'Penetration Tester']
  },

  'c3_encoding_encrypt_hash': {
    id: 'c3_encoding_encrypt_hash',
    level: 3,
    title: 'Encoding vs Encryption vs Hashing vs Obfuscation',
    difficulty: 'BEGINNER',
    prerequisites: ['c3_cia_triad'],
    nextConcepts: ['c7_symmetric_asymmetric', 'c7_hashing_signatures'],
    relatedConcepts: ['c7_hashing_signatures'],
    definition: 'Distinguishing data representation (Encoding), reversible confidentiality with keys (Encryption), one-way mathematical digest (Hashing), and human-unfriendly code hiding (Obfuscation).',
    whyItMatters: 'Confusing encoding (like Base64) with encryption is one of the most dangerous developer mistakes, leading to catastrophic plaintext data leaks.',
    mentalModel: 'Encoding = Translating text into French (anyone who knows French can read it); Encryption = Putting message in locked box (only key holder can open); Hashing = Grinding beef into a burger (cannot turn burger back into cow).',
    coreExplanation: 'Encoding (e.g. Base64, URL-encoding, Hex) changes data format for safe transmission; it provides ZERO confidentiality. Encryption (e.g. AES, RSA) transforms plaintext into ciphertext using a secret key; it is reversible ONLY with the key. Hashing (e.g. SHA-256, bcrypt) is a one-way mathematical function producing a fixed-size digest; it cannot be decrypted.',
    visualExplanation: {
      type: 'table',
      title: 'Encoding vs Encryption vs Hashing Comparison',
      content: 'Operation | Purpose | Key Required? | Reversible? | Example\nEncoding | Data compatibility | No | Yes (Trivial) | Base64, URL-encoding, Hex\nEncryption | Confidentiality | Yes (Secret key) | Yes (With key) | AES-256-GCM, RSA-4096\nHashing | Integrity & Password verification | No (Salts used) | No (One-way) | SHA-256, Argon2id, bcrypt\nObfuscation | Hide code logic | No | Yes (Deobfuscation) | JavaScript minification, XOR packers'
    },
    example: 'Base64 string `YWRtaW4=` decoded with `echo "YWRtaW4=" | base64 -d` yields `admin` immediately without any password.',
    practicalExercise: {
      task: 'Compute cryptographic hashes and decode Base64 strings in terminal.',
      commandOrPayload: 'echo -n "password123" | sha256sum && echo "c2VjcmV0" | base64 -d',
      expectedOutcome: 'Generates 64-character SHA-256 hexadecimal hash digest and decodes "secret".',
      labRoute: '/crypto-lab'
    },
    commonMistakes: [
      'Claiming "Base64 encrypted passwords" in application documentation.',
      'Using fast hashing algorithms (MD5, SHA-1, SHA-256) for password storage instead of salted, work-factor algorithms (bcrypt, Argon2).'
    ],
    securityRelevance: 'Passwords must NEVER be stored plaintext or encrypted (where key compromise exposes all passwords); they must be salted and hashed.',
    offensivePerspective: 'Attackers spot Base64/Hex encoding in HTTP headers and API tokens, instantly decoding hidden parameter values.',
    defensivePerspective: 'Defenders enforce strong salting and modern memory-hard hashing algorithms (Argon2id) to render offline GPU brute-force attacks infeasible.',
    assessment: {
      question: 'Why is Base64 encoding completely ineffective as a security control for protecting sensitive user data?',
      options: [
        'Because it requires an asymmetric private key to decode',
        'Because it is an open standardized transformation with zero secret keys, allowing anyone to trivially decode it',
        'Because it only works on Windows operating systems',
        'Because it slows down network bandwidth by 800%'
      ],
      correctIndex: 1,
      explanation: 'Encoding transforms data formatting without any secret key; anyone can decode Base64 back to plaintext instantly.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Application Security Engineer', 'Penetration Tester', 'SOC Analyst', 'Software Developer']
  },

  'c3_threat_vuln_exploit': {
    id: 'c3_threat_vuln_exploit',
    level: 3,
    title: 'Threats vs Vulnerabilities vs Exploits vs Risk',
    difficulty: 'BEGINNER',
    prerequisites: ['c3_cia_triad'],
    nextConcepts: ['c4_security_methodology'],
    relatedConcepts: ['c3_cia_triad'],
    definition: 'The fundamental risk equation: Risk = Threat Actor × Vulnerability × Asset Impact × Likelihood.',
    whyItMatters: 'Security teams must prioritize patching based on actual risk and active exploitation rather than panic over raw vulnerability counts.',
    mentalModel: 'Burglary risk: Threat = Burglar in the neighborhood; Vulnerability = Unlocked back window; Exploit = Climbing through the window; Asset Impact = Jewelry stolen; Risk = Overall probability and loss.',
    coreExplanation: 'A Threat is an entity or event capable of causing harm (e.g. ransomware gang, malicious insider). A Vulnerability is a weakness in software, hardware, or process (e.g. unpatched CVE). An Exploit is the software or technique used to take advantage of a vulnerability. Risk is the measurable likelihood and financial/operational impact of a threat exploiting a vulnerability.',
    visualExplanation: {
      type: 'diagram',
      title: 'The Risk Formula Relationship',
      content: '[Threat Actor (Intent & Capability)]\n            ↓ (executes)\n     [Exploit (Weapon)]\n            ↓ (targets)\n  [Vulnerability (Flaw)] in [Asset (Value)] ===> [RISK = Impact × Likelihood]'
    },
    example: 'A critical vulnerability (Log4j CVE-2021-44228) on an isolated offline test machine with zero external network connectivity presents low risk compared to the same flaw on a public production gateway.',
    practicalExercise: {
      task: 'Inspect CVSS vulnerability scoring metrics and calculate overall risk priority.',
      commandOrPayload: 'echo "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H -> Base Score 9.8 (CRITICAL)"',
      expectedOutcome: 'Evaluates attack vector (Network), complexity (Low), privileges (None), and impacts (High).',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Using the terms "Threat" and "Vulnerability" interchangeably.',
      'Assuming high CVSS score automatically equals high business risk without evaluating asset exposure.'
    ],
    securityRelevance: 'Risk management frameworks (NIST SP 800-30, ISO 27005) guide CISOs in allocating budget and engineering resources to mitigate maximum risk.',
    offensivePerspective: 'Attackers search for high-impact vulnerabilities with weaponized public exploits (Metasploit, PoCs) that require low skill to execute.',
    defensivePerspective: 'Threat intelligence teams track CISA Known Exploited Vulnerabilities (KEV) to patch flaws actively being leveraged in the wild first.',
    assessment: {
      question: 'Which element represents a technical software flaw or misconfiguration that creates an unauthorized access opportunity?',
      options: ['Threat', 'Vulnerability', 'Exploit', 'Risk'],
      correctIndex: 1,
      explanation: 'A vulnerability is the underlying weakness or defect in software, configuration, or architecture.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['Security Analyst', 'Risk & Compliance Auditor', 'Penetration Tester']
  },

  'c3_pki_mfa': {
    id: 'c3_pki_mfa',
    level: 3,
    title: 'Public Key Infrastructure (PKI), Certificates & MFA',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c3_encoding_encrypt_hash'],
    nextConcepts: ['c7_tls_handshake'],
    relatedConcepts: ['c7_tls_handshake'],
    definition: 'The hierarchy of trusted Certificate Authorities (CAs) issuing digital certificates for identity verification, coupled with Multi-Factor Authentication (Something you know, have, are).',
    whyItMatters: 'PKI secures the entire global web via HTTPS certificates, and MFA neutralizes over 99% of automated credential stuffing and password-spraying attacks.',
    mentalModel: 'PKI is a government passport office (Certificate Authority) stamping your passport (Digital Certificate) with cryptographic seals that foreign border agents can verify.',
    coreExplanation: 'PKI binds public keys to verified identities via X.509 certificates signed by trusted Root and Intermediate CAs. Multi-Factor Authentication (MFA) requires two or more distinct categories: Knowledge (password/PIN), Possession (hardware key/authenticator app TOTP), Inherence (biometrics/fingerprint).',
    visualExplanation: {
      type: 'tree',
      title: 'Certificate Authority (CA) Trust Chain',
      content: '[Root CA (Self-signed in browser trust store)]\n  └── [Intermediate CA (Signed by Root CA)]\n        └── [Server Certificate (issued to example.com)]'
    },
    example: 'Viewing a website TLS certificate in the browser displays the Subject Name, Issuer, Validity Period, Public Key, and SHA-256 thumbprint signature.',
    practicalExercise: {
      task: 'Inspect an SSL/TLS certificate chain using OpenSSL CLI.',
      commandOrPayload: 'openssl s_client -connect google.com:443 -servername google.com </dev/null 2>/dev/null | openssl x509 -noout -issuer -subject -dates',
      expectedOutcome: 'Prints certificate issuer, domain subject, and valid expiration date range.',
      labRoute: '/crypto-lab'
    },
    commonMistakes: [
      'Believing SMS-based 2FA is secure against SIM-swapping attacks (FIDO2/WebAuthn hardware keys are phishing-resistant).',
      'Ignoring expired or self-signed certificate warnings in production internal applications.'
    ],
    securityRelevance: 'Compromised CA private keys allow adversaries to forge valid certificates for any domain, enabling transparent Man-In-The-Middle (MITM) interception.',
    offensivePerspective: 'Adversaries deploy Adversary-in-the-Middle (AiTM) phishing proxies (Evilginx) to capture session cookies and bypass legacy OTP-based MFA.',
    defensivePerspective: 'Enterprises deploy FIDO2 hardware tokens (YubiKeys) and enforce Certificate Transparency (CT) monitoring to prevent unauthorized certificate issuance.',
    assessment: {
      question: 'Which of the following represents a true multi-factor authentication (MFA) combination?',
      options: [
        'A password and a memorable childhood pet name',
        'A password and a time-based one-time password (TOTP) from an authenticator app',
        'A password and a security question',
        'Two different passwords on separate web pages'
      ],
      correctIndex: 1,
      explanation: 'A password is "Something you know" and a TOTP authenticator app is "Something you have", representing two distinct authentication factors.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Identity & Access Management (IAM) Engineer', 'Security Architect', 'SOC Analyst']
  },
  ...CONCEPTS_PART2,
  ...CONCEPTS_PART3,
  ...CONCEPTS_PART4
};
