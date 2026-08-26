import { 
  Search, 
  Globe, 
  Shield, 
  Terminal as TerminalIcon, 
  Server, 
  Wifi, 
  Cloud, 
  ShieldAlert, 
  Fingerprint, 
  Zap,
  Award
} from 'lucide-react';

export interface CommandData {
  cmd: string;
  purpose: string;
  options: string;
  expectedOutput: string;
  discoveries: string;
  mitre: string;
  safety: string;
  flagsDetail?: { flag: string; desc: string }[];
  whatToLookFor?: string;
  discoveryDetail?: string;
  whyItMatters?: string;
  nextInvestigation?: string;
  amanQuestion?: string;
}

export interface VideoChapter {
  time: string;
  title: string;
}

export interface TryItStep {
  title: string;
  description: string;
  actionText: string;
  terminalCmd?: string;
  expectedResult: string;
}

export interface HypothesisOption {
  text: string;
  score: number;
  rationale: string;
}

export interface InvestigationData {
  caseBrief: string;
  knownFacts: string[];
  unknownFacts: string[];
  availableAssets: string[];
  objectives: string[];
  rulesOfEngagement: string;
  socraticAmanPrompt: string;
  hypotheses: HypothesisOption[];
}

export interface ChallengeData {
  title: string;
  brief: string;
  objectives: { id: string; text: string; isCompleted: boolean }[];
  hints: string[];
  successFlag: string;
}

export interface IncidentPhase {
  phase: string;
  name: string;
  desc: string;
  logOutput: string;
  discoveries: string[];
}

export interface RealIncidentMatch {
  name: string;
  historicalContext: string;
  attackChain: IncidentPhase[];
  techniques: string[];
  defensiveLessons: string[];
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface BlueTeamRemediation {
  id: string;
  title: string;
  desc: string;
  logs: string;
}

export interface SubSkill {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estTime: string;
  theory: {
    what: string;
    why: string;
    how: string;
    defenderView: string;
    mistakes: string;
    detection: string;
    mitigation: string;
  };
  visual: {
    nodes: string[];
    packetFlow: string;
    asciiArt: string;
  };
  video: {
    title: string;
    duration: string;
    difficulty: string;
    learnOutcome: string;
    chapters: VideoChapter[];
  };
  commands: CommandData[];
  tryIt: {
    steps: TryItStep[];
  };
  investigation: InvestigationData;
  challenge: ChallengeData;
  realIncidentMatch: RealIncidentMatch;
  exam: {
    questions: ExamQuestion[];
  };
  blueTeam: {
    remediations: BlueTeamRemediation[];
  };
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  skills: SubSkill[];
}

export const SKILL_LIBRARY_DATA: SkillCategory[] = [
  {
    id: 'recon',
    name: 'NETWORKING & RECON',
    icon: Search,
    color: 'from-blue-600 to-cyan-500',
    skills: [
      {
        id: 'active-recon',
        name: 'Active Port Scanning',
        difficulty: 'Beginner',
        estTime: '15 mins',
        theory: {
          what: 'Active Port Scanning actively probes target system ports to identify open listening ports, daemon versions, and operating system attributes.',
          why: 'Discovers target interfaces, network architecture layout, and potential software vulnerabilities.',
          how: 'Sends custom packets (SYN, Connect, UDP) and observes flags (SYN-ACK, RST) returned.',
          defenderView: 'High volume of TCP SYN connection logs originating from a single IP address targeted sequentially.',
          mistakes: 'Using speed flags (-T5) which cause firewall blockades or trigger aggressive alerts.',
          detection: 'SIEM threshold alerting for source IPs initiating >50 connections per minute.',
          mitigation: 'Implement responsive firewalls, network isolation, or port-knocking services.'
        },
        visual: {
          nodes: ['Attacker (10.10.1.5)', 'Firewall', 'Server Target (10.10.1.20)'],
          packetFlow: 'Attacker ──[TCP SYN to Port 80]──> Firewall ──> Server\nAttacker <──[TCP SYN-ACK (Open Port)]── Server\nAttacker ──[TCP SYN to Port 445]──> Dropped by Firewall ╳',
          asciiArt: `
+------------------+         [TCP SYN to Port 80]        +------------------+
| ATTACKER HOST    | ──────────────────────────────────> | TARGET INSTANCE  |
| IP: 10.10.1.5    | <────────────────────────────────── | IP: 10.10.1.20   |
+------------------+        [TCP SYN-ACK (OPEN!)]        +------------------+
          `
        },
        video: {
          title: 'Stealth Scanning & Banner Analysis',
          duration: '8:45',
          difficulty: 'Easy',
          learnOutcome: 'Understand TCP handshakes, stealth scanning flags, and banner service fingerprinting.',
          chapters: [
            { time: '00:00', title: 'The Scan Surface' },
            { time: '02:15', title: 'SYN vs Connect Scanning' },
            { time: '05:30', title: 'Analyzing responses' },
            { time: '07:45', title: 'Remediation protocols' }
          ]
        },
        commands: [
          {
            cmd: 'nmap -sS -sV -F 10.10.1.20',
            purpose: 'Stealth SYN Scan to determine service versions on top 100 fast ports.',
            options: '-sS (SYN Stealth), -sV (Service Versioning), -F (Fast ports)',
            expectedOutput: 'PORT   STATE SERVICE VERSION\n80/tcp open  http    Apache httpd 2.4.41\n22/tcp open  ssh     OpenSSH 8.2p1',
            discoveries: 'Identified Apache 2.4.41, which is prone to local path traversals.',
            mitre: 'T1046 - Network Service Scanning',
            safety: 'Only perform on sandboxed ranges. High speeds can cause service exhaustion on older nodes.',
            flagsDetail: [
              { flag: '-sS', desc: 'Sends stealthy TCP SYN packets instead of completing 3-way handshake.' },
              { flag: '-sV', desc: 'Queries open ports to determine product name and version details.' },
              { flag: '-F', desc: 'Fast Mode - scans fewer ports (top 100) to keep detection footprint low.' }
            ],
            whatToLookFor: 'Verify if any web servers (Port 80/443) or administration endpoints (Port 22/3389) reveal vulnerable legacy software versions.',
            discoveryDetail: 'Active scanning revealed port 80 hosting Apache httpd 2.4.41 and SSH running on port 22.',
            whyItMatters: 'Apache 2.4.41 is vulnerable to memory leaks and path traversals, revealing an immediate attack vector.',
            nextInvestigation: 'Launch targeted directory traversal scans or audit HTTP security parameters.',
            amanQuestion: 'Based on the service version discovered on port 80, what configuration properties or CVE databases should we audit next?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Initiate a Fast Port Map',
              description: 'Run nmap to discover which services are listening on the sandbox target.',
              actionText: 'Execute standard port map command',
              terminalCmd: 'nmap -sS -sV -F 10.10.1.20',
              expectedResult: 'PORT 80 and PORT 22 marked as open.'
            }
          ]
        },
        investigation: {
          caseBrief: 'Subnet network monitoring indicates suspicious outgoing telemetry from server node 10.10.1.20. Your objective is to discover and analyze listening service footprints.',
          knownFacts: [
            'Target IP is 10.10.1.20.',
            'Host responds to ICMP echo requests.',
            'Perimeter firewall permits inbound traffic on ports 80 and 22.'
          ],
          unknownFacts: [
            'Underlying listening applications and version strings.',
            'Active vulnerability CVE profiles on running services.',
            'Operating system kernel properties.'
          ],
          availableAssets: ['Student workstation workstation-kali (10.10.1.5)', 'Target Node (10.10.1.20)'],
          objectives: [
            'Enumerate listening TCP services on target node.',
            'Locate version strings and potential threat surfaces.',
            'Analyze if any CVE alerts are triggered by scanner scripts.'
          ],
          rulesOfEngagement: 'Strictly monitor port scans within subnet 10.10.1.0/24. Avoid heavy flood modes (-T5). Log all active commands.',
          socraticAmanPrompt: 'You have identified an active IP address, but have no knowledge of the running server daemon. What scanning strategy balances stealth with high detail discovery?',
          hypotheses: [
            {
              text: 'Execute a stealth SYN scan (-sS) with service versioning (-sV) to query banner properties safely.',
              score: 100,
              rationale: 'Correct. Stealth SYN scans do not complete the TCP handshake, reducing detection footprint while -sV queries banners directly.'
            },
            {
              text: 'Run a full TCP Connect scan (-sT) on all 65,535 ports with maximum velocity (-T5).',
              score: 50,
              rationale: 'Sub-optimal. Completing full connections on every port is extremely noisy, will instantly trip SIEM alerts, and can crash older service daemons.'
            }
          ]
        },
        challenge: {
          title: 'Stealth Intrusion Enumeration',
          brief: 'A secure backend node at 10.10.1.20 is suspected of running an undocumented service. Enumerate and discover the secret listening port without triggering firewall state blocks.',
          objectives: [
            { id: 'sec-scan', text: 'Scan all non-standard ports above 8000', isCompleted: false },
            { id: 'flag-collect', text: 'Locate vulnerability flag on hidden port 8080', isCompleted: false }
          ],
          hints: [
            'The hidden port is above 8000.',
            'Try running nmap -p 8080 10.10.1.20 to audit Tomcat setups.'
          ],
          successFlag: 'FLAG{NMAP_STEALTH_MASTER}'
        },
        realIncidentMatch: {
          name: 'The Equifax Breach Reconnaissance Phase',
          historicalContext: 'In 2017, attackers conducted extensive scanning and enumeration across public-facing corporate portals, locating a vulnerable Apache Struts endpoint that led to the theft of 147 million records.',
          attackChain: [
            {
              phase: 'recon',
              name: 'Perimeter Scanning',
              desc: 'Attackers scan public subnets to inventory open web application portals.',
              logOutput: 'TCP SYN scan detected from 192.168.10.5 on ports: [80, 443, 8080]. State: Ports Open.',
              discoveries: ['Discovered active web server running Apache Struts handler.']
            }
          ],
          techniques: ['T1046 - Network Service Scanning', 'T1595 - Active Scanning'],
          defensiveLessons: [
            'Maintain strict software inventories across exposed assets.',
            'Deploy dynamic vulnerability scanners to spot unpatched frameworks before adversaries do.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'Which Nmap scan type is considered the standard "stealth" scan and how does it operate?',
              options: [
                'TCP Connect scan (-sT) by completing the 3-way handshake',
                'SYN Stealth scan (-sS) by sending a SYN packet and evaluating response without completing handshake',
                'UDP scan (-sU) by auditing ICMP port unreachable frames',
                'Fin scan (-sF) by injecting packet terminations'
              ],
              correctAnswer: 'SYN Stealth scan (-sS) by sending a SYN packet and evaluating response without completing handshake',
              explanation: 'The -sS option sends a SYN packet and waits for SYN-ACK or RST. Once received, it immediately sends an RST packet to terminate the connection, bypassing the full three-way handshake and avoiding system connection logging.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'rate_limiting',
              title: 'Enable Perimeter Rate Limiting',
              desc: 'Configures iptables rules to block IP addresses initiating more than 20 TCP connections per minute.',
              logs: 'iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --set\niptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --update --seconds 60 --hitcount 20 -j DROP'
            }
          ]
        }
      },
      {
        id: 'traffic-analysis',
        name: 'Wireshark & Traffic Analysis',
        difficulty: 'Intermediate',
        estTime: '20 mins',
        theory: {
          what: 'Traffic analysis intercepts and interprets raw packets flowing across network segments, parsing header protocols and packet contents.',
          why: 'Enables identification of cleartext protocol data, rogue activities, command-and-control beacons, and network bottlenecks.',
          how: 'Runs network interfaces in promiscuous mode to capture frames, translating bytes into structured OSI layers.',
          defenderView: 'Encrypted or unencrypted payload flows showing consistent beaconing sequences at precise clock intervals.',
          mistakes: 'Scanning massive files without query filters, causing interface memory saturation.',
          detection: 'Capture cleartext HTTP POST requests transmitting session cookies or password vectors.',
          mitigation: 'Migrate to TLS/HTTPS globally. Enforce cryptographic handshakes for all lateral communications.'
        },
        visual: {
          nodes: ['Hacker IP (10.10.1.5)', 'Hub / Span Port', 'Protected Target (10.10.1.20)'],
          packetFlow: 'Target ──[Plain HTTP Post Auth]──> Span Port ──> Hacker (Sniffs traffic)\nHacker Sniffs: "username=admin&password=FLAG{WIRESHARK_SNIFF_KEY}"',
          asciiArt: `
+------------------+         [HTTP Cleartext Data]       +------------------+
| ATTACKER (Sniffer)| <───────────────────────────────── | CLIENT TO SERVER |
| Captures cookie!  |        Promiscuous Mode Packet     | Data Exposed!    |
+------------------+                                     +------------------+
          `
        },
        video: {
          title: 'Deciphering TCP Handshakes & Packet Dumps',
          duration: '10:15',
          difficulty: 'Intermediate',
          learnOutcome: 'Apply Wireshark display filters to isolate anomalous TCP resets and decode cleartext logins.',
          chapters: [
            { time: '00:00', title: 'Introduction to PCAPs' },
            { time: '02:30', title: 'TCP Reassembly' },
            { time: '06:00', title: 'Display Filter Syntax' },
            { time: '08:45', title: 'Credential Extraction' }
          ]
        },
        commands: [
          {
            cmd: 'tshark -r capture.pcap -Y "http.request.method==POST" -T fields -e http.file_data',
            purpose: 'Parse network packet dump to extract HTTP POST form payloads containing credentials.',
            options: '-r (Read file), -Y (Display filter), -T (Output format), -e (Selected field)',
            expectedOutput: 'username=security_admin&password=FLAG{PCAP_EXTRACT_SUCCESS}',
            discoveries: 'Extracted cleartext administrative passwords from HTTP requests.',
            mitre: 'T1040 - Network Sniffing',
            safety: 'Only scan network links with formal corporate or laboratory authorization.',
            flagsDetail: [
              { flag: '-r capture.pcap', desc: 'Directs analyzer engine to parse recorded network packet capture file.' },
              { flag: '-Y "http.request.method==POST"', desc: 'Applies filter matching only HTTP POST requests.' }
            ],
            whatToLookFor: 'Search for cleartext parameters like "password", "cookie", or "bearer" inside forms.',
            discoveryDetail: 'Recovered active administrator password flag from raw packet dump.',
            whyItMatters: 'HTTP cleartext transmissions allow any intermediary router or attacker to capture user secrets.',
            nextInvestigation: 'Pivot to the target using credentials to audit system access levels.',
            amanQuestion: 'If the connection were encrypted with TLS/HTTPS, what extra steps or certs would you require to decrypt this stream?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Decrypt Packet Stream',
              description: 'Run tshark to query captured HTTP streams for raw POST requests.',
              actionText: 'Run filter extraction',
              terminalCmd: 'tshark -r capture.pcap -Y "http.request.method==POST" -T fields -e http.file_data',
              expectedResult: 'Extracted raw form-data: username=security_admin&password=FLAG{PCAP_EXTRACT_SUCCESS}'
            }
          ]
        },
        investigation: {
          caseBrief: 'An employee workstation is suspected of communicating with an offshore command-and-control node in cleartext. Capture and audit the traffic stream.',
          knownFacts: [
            'Packet capture (capture.pcap) contains 5 minutes of local traffic.',
            'HTTP requests are recorded over unencrypted Port 80.'
          ],
          unknownFacts: [
            'If active session secrets or credentials are leaking.',
            'Command parameters being queried by the client.'
          ],
          availableAssets: ['Wireshark Terminal (10.10.1.5)'],
          objectives: [
            'Filter packets for TCP connections to unknown IP nodes.',
            'Exfiltrate transmission streams to identify the breach payload.'
          ],
          rulesOfEngagement: 'Analyze pre-recorded captures only. Do not perform active packet injection on live networks.',
          socraticAmanPrompt: 'What filter query isolates HTTP authentication POST traffic from other protocol streams like DNS or ARP?',
          hypotheses: [
            {
              text: 'Use http.request.method == "POST" to parse data submissions directly.',
              score: 100,
              rationale: 'Correct. Cleartext form data is submitted inside POST bodies, making this filter the most effective.'
            },
            {
              text: 'Filter for all DNS packets using UDP port 53 query fields.',
              score: 45,
              rationale: 'Incorrect. DNS packets contain domain query maps, not HTTP form authentication strings.'
            }
          ]
        },
        challenge: {
          title: 'Deep Packet Exfiltration',
          brief: 'Locate the administrative login packet inside the capture dump and extract the hidden authorization flag.',
          objectives: [
            { id: 'read-pcap', text: 'Apply tshark filters to capture.pcap', isCompleted: false },
            { id: 'get-flag', text: 'Extract password string', isCompleted: false }
          ],
          hints: [
            'Filter on http.request.method==POST.',
            'Look closely at the password form attribute.'
          ],
          successFlag: 'FLAG{PCAP_EXTRACT_SUCCESS}'
        },
        realIncidentMatch: {
          name: 'The GitHub Cleartext Log Leak',
          historicalContext: 'In 2018, GitHub notified users of an internal logging error where customer credentials were transiently written in cleartext to internal diagnostic systems, revealing vulnerabilities to raw file searches.',
          attackChain: [
            {
              phase: 'exfiltration',
              name: 'Log Scraping',
              desc: 'Security engineers trace logging files and extract user session credentials.',
              logOutput: '[INFO] POST /login parameters: {user: admin, pass: FLAG{PCAP_EXTRACT_SUCCESS}}',
              discoveries: ['Identified plaintext passwords written to system storage.']
            }
          ],
          techniques: ['T1040 - Network Sniffing', 'T1552 - Unsecured Credentials'],
          defensiveLessons: [
            'Enforce comprehensive payload sanitization prior to logging system exports.',
            'Implement continuous automated checking for credential-like patterns.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'Which Wireshark display filter correctly restricts output to HTTP traffic with a response code of 404 (Not Found)?',
              options: [
                'http.response.code == 404',
                'tcp.port == 404',
                'ip.addr == 404',
                'http.status == "missing"'
              ],
              correctAnswer: 'http.response.code == 404',
              explanation: 'The filter http.response.code directly queries the status line parameter inside HTTP response headers, isolating resource-missing conditions.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'tls_upgrade',
              title: 'Enforce HTTPS Redirects',
              desc: 'Configures Nginx web servers to redirect cleartext HTTP traffic to TLS.',
              logs: 'server {\n  listen 80;\n  return 301 https://$host$request_uri;\n}'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'linux',
    name: 'LINUX SECURITY',
    icon: TerminalIcon,
    color: 'from-emerald-600 to-teal-500',
    skills: [
      {
        id: 'suid-privesc',
        name: 'SUID Privilege Escalation',
        difficulty: 'Intermediate',
        estTime: '20 mins',
        theory: {
          what: 'SUID (Set Owner User ID) is a specific file permission in Linux that allows a user to run an executable with the permissions of the file\'s owner (typically root).',
          why: 'Improperly configured custom binaries or default system executables can be abused to spawn high-privilege sub-processes.',
          how: 'Searching for files with permission mask -4000 identifies binaries. If a binary executes user commands (like find or custom tools) without dropping root privileges, a shell can be spawned.',
          defenderView: 'System processes showing an unprivileged user ID suddenly spawning a root-owned bash shell.',
          mistakes: 'Assigning SUID bits to compiler tools, interpreters, or text editors which allow command execution.',
          detection: 'Monitor execve system calls originating from system processes with mismatched effective user IDs.',
          mitigation: 'Audit SUID permissions regularly and remove SUID bits from non-essential custom commands.'
        },
        visual: {
          nodes: ['Low-priv user "student"', 'SUID Binary (/usr/local/bin/custom-suid)', 'Root Bash Context'],
          packetFlow: 'student ──[Executes custom-suid --exec-shell]──> Binary retains Owner: root ──> Spawns root context shell!',
          asciiArt: `
+------------------+         Executes SUID tool         +------------------+
| student terminal | ─────────────────────────────────> | custom-suid-tool | (Runs as root)
| (unprivileged)   | <───────────────────────────────── | Spawns Root Shell|
+------------------+          Acquires root prompt      +------------------+
          `
        },
        video: {
          title: 'Abusing SUID Configurations & GTFOBins',
          duration: '9:30',
          difficulty: 'Intermediate',
          learnOutcome: 'Audit system file permissions, locate GTFOBins vectors, and securely restrict SUID bits.',
          chapters: [
            { time: '00:00', title: 'Linux Permission Matrices' },
            { time: '02:30', title: 'Locating SUID Files' },
            { time: '05:45', title: 'Analyzing GTFOBins Vectors' },
            { time: '08:00', title: 'Remediation with chmod' }
          ]
        },
        commands: [
          {
            cmd: 'find / -perm -4000 -type f 2>/dev/null',
            purpose: 'Discover all executable files on the system that have the SUID bit set.',
            options: '-perm -4000 (match SUID bit), -type f (files only), 2>/dev/null (silence permission errors)',
            expectedOutput: '/usr/bin/chfn\n/usr/bin/passwd\n/usr/local/bin/custom-suid-tool',
            discoveries: 'Found a non-standard SUID binary at /usr/local/bin/custom-suid-tool.',
            mitre: 'T1548.001 - Abuse Privilege Escalation Mechanism: Setuid and Setgid',
            safety: 'Safe to run. Scanning reads directory hierarchies and does not modify properties.',
            flagsDetail: [
              { flag: '-perm -4000', desc: 'Queries files matching exact SUID state permissions.' },
              { flag: '2>/dev/null', desc: 'Discards stderr stream messages to hide system permission errors.' }
            ],
            whatToLookFor: 'Scan the output list for custom binaries in non-standard paths (like /var/tmp or /usr/local/bin).',
            discoveryDetail: 'Spotted a custom SUID tool: /usr/local/bin/custom-suid-tool.',
            whyItMatters: 'Custom binaries often miss security boundaries, allowing execution parameters to compromise memory states.',
            nextInvestigation: 'Consult GTFOBins to verify common sub-shell parameters.',
            amanQuestion: 'Why should we filter out stderr warnings (2>/dev/null) when executing file discovery commands across system root paths?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Crawl local SUID Binaries',
              description: 'Expose all executable SUID binaries hosted in system directories.',
              actionText: 'Execute file permission scan',
              terminalCmd: 'find / -perm -4000 -type f 2>/dev/null',
              expectedResult: 'Non-standard SUID tool discovered at /usr/local/bin/custom-suid-tool.'
            }
          ]
        },
        investigation: {
          caseBrief: 'A regular user account has compromised ssh-access on the server target (10.10.1.20). Your directive is to audit setuid configurations to discover privilege escalation vulnerabilities.',
          knownFacts: [
            'Access context is unprivileged user "student".',
            'Multiple standard SUID tools like passwd exist.',
            'A custom administrative command utility is mapped at /usr/local/bin/custom-suid-tool.'
          ],
          unknownFacts: [
            'If the custom SUID utility allows sub-process spawning.',
            'If SUID permissions are correctly audited.'
          ],
          availableAssets: ['SSH Console (10.10.1.20)'],
          objectives: [
            'Inventory SUID permissions on target.',
            'Inspect /usr/local/bin/custom-suid-tool execution properties.',
            'Obtain root-level system integrity hash.'
          ],
          rulesOfEngagement: 'Analyze binaries locally. Do not write destructive cron scripts or erase standard system files.',
          socraticAmanPrompt: 'You have accessed a low-privileged system shell. What command structure allows you to discover files possessing elevated setuid ownership?',
          hypotheses: [
            {
              text: 'Execute `find / -perm -4000 -type f 2>/dev/null` to parse SUID permissions globally.',
              score: 100,
              rationale: 'Correct. This identifies executable binaries with the owner-execute permission set, filtering out noise.'
            },
            {
              text: 'Run standard `ls -la` inside the current directory and look for normal text files.',
              score: 40,
              rationale: 'Inefficient. Standard listing only queries the current local directory, missing hidden SUID parameters elsewhere on root.'
            }
          ]
        },
        challenge: {
          title: 'Root Privilege Shell Escalation',
          brief: 'Locate SUID binaries and abuse custom utilities to spawn an elevated shell process on node 10.10.1.20.',
          objectives: [
            { id: 'suid-find', text: 'Crawl SUID directories', isCompleted: false },
            { id: 'root-escalate', text: 'Spawn root shell using custom binary', isCompleted: false }
          ],
          hints: [
            'Check /usr/local/bin/custom-suid-tool execution flags.',
            'Try running custom-suid-tool with --exec-shell argument.'
          ],
          successFlag: 'FLAG{ROOT_SUID_EXPLOITED}'
        },
        realIncidentMatch: {
          name: 'The Sudo Baron Samedit Exploit',
          historicalContext: 'In 2021, security analysts discovered CVE-2021-3156 (Baron Samedit), where a heap-based buffer overflow in sudo parsed backslash characters incorrectly, granting full root shells to local unprivileged attackers.',
          attackChain: [
            {
              phase: 'execution',
              name: 'Heap Overflow Sudo Trigger',
              desc: 'Attackers trigger memory overflow inside the setuid-root sudo binary, spawning root shells.',
              logOutput: 'user@host:~$ sudoedit -s \'\\\' `python3 -c "print(\'A\'*100)"` \n[SUCCESS] uid=0(root) gid=0(root) groups=0(root)',
              discoveries: ['Privileges escalated to root globally.']
            }
          ],
          techniques: ['T1548.001 - Abuse Privilege Escalation: Setuid and Setgid', 'T1068 - Exploitation for Privilege Escalation'],
          defensiveLessons: [
            'Deploy kernel-level system audits to identify rapid uid transitions.',
            'Patch Sudo utilities immediately upon vendor security announcements.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'Which of the following describes the secure configuration strategy for preventing SUID privilege exploitation?',
              options: [
                'Assigning SUID bits to all shell-spawning binaries',
                'Removing SUID bits from non-essential executables and enforcing strict execution boundaries (nosuid) on partition mounts',
                'Storing administrative passwords inside cleartext cron scripts',
                'Migrating files to local user directories'
              ],
              correctAnswer: 'Removing SUID bits from non-essential executables and enforcing strict execution boundaries (nosuid) on partition mounts',
              explanation: 'To secure Linux environments, administrators should audit and remove the SUID bit from unnecessary binaries, use sudo rules for precise privilege delegation, and mount partitions containing user-writable data with the "nosuid" flag to disable SUID operations entirely.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'remove_suid_priv',
              title: 'Revoke SUID Privileges',
              desc: 'Updates target file properties to revoke SUID executable bit permissions.',
              logs: 'sudo chmod u-s /usr/local/bin/custom-suid-tool'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'web',
    name: 'WEB SECURITY',
    icon: Globe,
    color: 'from-purple-600 to-pink-500',
    skills: [
      {
        id: 'sql-injection',
        name: 'SQL Injection (SQLi)',
        difficulty: 'Intermediate',
        estTime: '20 mins',
        theory: {
          what: 'SQL Injection is a critical vulnerability where user-supplied inputs are directly concatenated into backend SQL query commands without proper escaping or parameterization.',
          why: 'Allows attackers to bypass login screens, exfiltrate entire databases, or gain Remote Code Execution (RCE).',
          how: 'Injecting characters like single quotes (\') to break query boundaries and appending conditions like OR 1=1.',
          defenderView: 'SQL syntax exceptions inside application logs or anomalous UNION keywords in request patterns.',
          mistakes: 'Using string concatenation or interpolation inside SQL execution statements.',
          detection: 'Detecting unexpected SQL keywords (UNION, SELECT, --) within GET or POST parameters.',
          mitigation: 'Use parameterized queries (Prepared Statements) or ORMs globally.'
        },
        visual: {
          nodes: ['Client Browser', 'Web App Controller', 'PostgreSQL DB'],
          packetFlow: 'Client ──[POST username=\' OR 1=1 --]──> Web App ──> DB executes query\nDB evaluates Always True! ──> Grants session cookie ──> Administrator session activated!',
          asciiArt: `
+------------------+         Injects ' OR 1=1 --        +------------------+
| Hacker Browser   | ──────────────────────────────────> | login.php daemon |
| Auth bypassed!   | <────────────────────────────────── | Returns admin row|
+------------------+         Bypasses credentials       +------------------+
          `
        },
        video: {
          title: 'Exploiting & Securing SQL Parameters',
          duration: '11:20',
          difficulty: 'Intermediate',
          learnOutcome: 'Audit authentication prompts and utilize safe parameterized drivers in Node/Python.',
          chapters: [
            { time: '00:00', title: 'SQL Vulnerability Root Cause' },
            { time: '03:15', title: 'UNION-based exfiltration' },
            { time: '07:30', title: 'Blind SQL injection concepts' },
            { time: '09:45', title: 'Secure Parameterization' }
          ]
        },
        commands: [
          {
            cmd: "curl -X POST -d \"username=' OR 1=1 --&password=x\" http://10.10.1.20/api/login",
            purpose: 'Bypass SQL query login structure by making the WHERE condition evaluate to true.',
            options: '-X POST (POST request), -d (form key-value body)',
            expectedOutput: '{"status":"success","user":"administrator","token":"FLAG{SQL_INJECTION_EXFIL_SUCCESS}"}',
            discoveries: 'SQL authentication bypass confirmed on login endpoint.',
            mitre: 'T1190 - Exploit Public-Facing Application',
            safety: 'Never inject payloads on external public-facing web targets.',
            flagsDetail: [
              { flag: '-X POST', desc: 'Sets HTTP execution method to POST for sending form payloads.' },
              { flag: '-d "username=..."', desc: 'Encodes the forms data keys to send to backend login route.' }
            ],
            whatToLookFor: 'Look for status: success or session web tokens returning in the response.',
            discoveryDetail: 'Auth bypass successfully dumped administrative session profile.',
            whyItMatters: 'Authentication bypass allows full, unauthenticated control over user registries.',
            nextInvestigation: 'Search for hidden tables and exfiltrate custom database schemas.',
            amanQuestion: 'If the app utilized Prepared Statements, how would the SQL engine treat our input quote character?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Exploit Login Prompt Concatenation',
              description: 'Launch a curled request injecting boolean operators into the web login router.',
              actionText: 'Execute curl bypass command',
              terminalCmd: "curl -X POST -d \"username=' OR 1=1 --&password=x\" http://10.10.1.20/api/login",
              expectedResult: 'Authentication bypassed. Token received containing administrative flag.'
            }
          ]
        },
        investigation: {
          caseBrief: 'The portal login route on the shop.lab server (10.10.1.20) is suspected of containing a classic concatenated SQL Injection vulnerability. Probe and verify the risk.',
          knownFacts: [
            'Web portal serves login parameters on port 80.',
            'Backend database type is PostgreSQL.'
          ],
          unknownFacts: [
            'Concatenation vulnerabilities in parameter processing.',
            'Access controls governing administrative database profiles.'
          ],
          availableAssets: ['Attacker Machine (10.10.1.5)', 'Web Server (10.10.1.20)'],
          objectives: [
            'Submit malformed input parameters to test for SQL parsing errors.',
            'Trigger logic bypasses using conditional structures.',
            'Retrieve admin flag indicators.'
          ],
          rulesOfEngagement: 'Conduct localized validation probes. Avoid modifying server databases or deleting system tables.',
          socraticAmanPrompt: 'You have located an active login form, but don\'t have valid password hashes. How would you structure a SQL payload to alter the backend WHERE query validation logic?',
          hypotheses: [
            {
              text: "Inject a payload containing single quotes and logical OR operators like `' OR 1=1 --` to neutralize the query.",
              score: 100,
              rationale: 'Perfect. This forces the query evaluation logic to always resolve to TRUE and comments out the remainder of the query.'
            },
            {
              text: 'Attempt to upload a PHP shell script inside the login parameter input fields directly.',
              score: 30,
              rationale: 'Incorrect. Plain text login forms do not execute files; they pass variables to SQL controllers. File upload requires file handlers.'
            }
          ]
        },
        challenge: {
          title: 'Database Schema Exfiltration',
          brief: 'Bypass auth and determine the database version by exfiltrating SQL variables on node 10.10.1.20.',
          objectives: [
            { id: 'db-bypass', text: 'Bypass login control using parameterized injections', isCompleted: false },
            { id: 'db-version', text: 'Determine database version string', isCompleted: false }
          ],
          hints: [
            'Try UNION queries to fetch system metadata.',
            'Query version() variable on PostgreSQL.'
          ],
          successFlag: 'FLAG{SQL_INJECTION_EXFIL_SUCCESS}'
        },
        realIncidentMatch: {
          name: 'The TalkTalk Telecom Breach',
          historicalContext: 'In 2015, TalkTalk Telecom was breached via a simple SQL Injection vulnerability on an exposed web application database, resulting in the theft of personal records of 150,000 customers.',
          attackChain: [
            {
              phase: 'access',
              name: 'SQLi Schema Extraction',
              desc: 'Attackers target custom web fields, executing queries that exfiltrated customer bank account metrics.',
              logOutput: 'SELECT account_number, card_expiry FROM customers WHERE first_name=\'\' UNION SELECT username, password FROM users --\'',
              discoveries: ['Exfiltrated plaintext passwords and credit card configurations.']
            }
          ],
          techniques: ['T1190 - Exploit Public-Facing Application', 'T1505 - Server Software Component'],
          defensiveLessons: [
            'Never build dynamic SQL statements using string concats.',
            'Ensure database services execute with minimal privileges.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'How do prepared statements (parameterized queries) successfully neutralize SQL Injection vulnerabilities?',
              options: [
                'They run secondary regex scans to delete bad letters',
                'They separate code from data by compiling the query structure first, then treating input strictly as a literal parameter',
                'They encrypt database rows on write operations',
                'They route queries to external firewalls'
              ],
              correctAnswer: 'They separate code from data by compiling the query structure first, then treating input strictly as a literal parameter',
              explanation: 'Prepared statements define the SQL query structure on the database first. User inputs are then bound as raw data values, meaning any injected SQL keywords are treated strictly as literal string values and cannot alter query logic.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'db_parameterize',
              title: 'Implement Prepared SQL Statements',
              desc: 'Updates query execution logic to bind parameters rather than string formatting.',
              logs: 'const query = "SELECT * FROM users WHERE username = ? AND password = ?";\ndb.execute(query, [username, password]);'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'ad',
    name: 'ACTIVE DIRECTORY',
    icon: Server,
    color: 'from-yellow-600 to-amber-500',
    skills: [
      {
        id: 'kerberoasting',
        name: 'Domain Kerberoasting',
        difficulty: 'Advanced',
        estTime: '25 mins',
        theory: {
          what: 'Kerberoasting is a post-exploitation technique targeting Active Directory Service Principal Names (SPNs) linked to domain user accounts.',
          why: 'Allows any validated domain user to request service tickets (TGS) and crack password hashes offline to escalate privileges.',
          how: 'Requests domain tickets for accounts with active SPNs, dumps the ticket memory payload, and cracks hashes using Hashcat.',
          defenderView: 'Anomalous surge of Kerberos TGS requests utilizing legacy weak RC4 encryption options.',
          mistakes: 'Using default dictionary words for domain service accounts, leading to rapid cracking times.',
          detection: 'Track event ID 4769 (A Kerberos service ticket was requested) with RC4 encryption (0x17).',
          mitigation: 'Enforce strong passwords for SPN accounts, configure Managed Service Accounts (gMSAs).'
        },
        visual: {
          nodes: ['Domain User', 'Domain Controller (DC)', 'Offline Cracker'],
          packetFlow: 'User ──[Requests TGS for SPN]──> DC returns ticket encrypted with SPN password hash\nUser dumps ticket ──> Cracks ticket offline ──> Recovers service password!',
          asciiArt: `
+------------------+      1. Requests Service Ticket     +------------------+
| Domain User      | ──────────────────────────────────> | Domain Controller|
| dumps ticket hash| <────────────────────────────────── | DC signs TGS ticket|
+------------------+      2. Returns TGS Ticket Hash     +------------------+
          `
        },
        video: {
          title: 'Abusing Active Directory SPNs & Ticket Extraction',
          duration: '12:40',
          difficulty: 'Hard',
          learnOutcome: 'Harvest Active Directory service tickets, extract hashes, and analyze Kerberos flows.',
          chapters: [
            { time: '00:00', title: 'The Active Directory architecture' },
            { time: '03:10', title: 'Understanding SPNs and DC logic' },
            { time: '07:20', title: 'Ticket Extraction with Mimikatz' },
            { time: '10:45', title: 'Offline Cracking with Hashcat' }
          ]
        },
        commands: [
          {
            cmd: 'GetUserSPNs.py -dc-ip 10.10.1.20 -request domain.local/student',
            purpose: 'Query active Active Directory domain controller, discover SPNs, and request Kerberos service tickets.',
            options: '-dc-ip (IP of Domain Controller), -request (Fetch ticket hashes)',
            expectedOutput: 'ServicePrincipalName: MSSQLSvc/sql-prod.domain.local\nTicket Hash: $krb5tgs$23$*sql-prod*$FLAG{KERBEROAST_PASS_EXTRACTED}',
            discoveries: 'Recovered Kerberos ticket hash for SQL service account.',
            mitre: 'T1558.003 - Use Alternative Authentication Material: Kerberoasting',
            safety: 'Harmless query; does not lock accounts or inject rogue records.',
            flagsDetail: [
              { flag: '-dc-ip 10.10.1.20', desc: 'Directs script queries to target Active Directory server IP.' },
              { flag: '-request', desc: 'Asks the DC to issue TGS ticket parameters for active accounts.' }
            ],
            whatToLookFor: 'Verify if returned hashes correspond to high-privilege domain user profiles.',
            discoveryDetail: 'Dumped Active Directory service tickets mapping MS-SQL services.',
            whyItMatters: 'Extracted ticket hashes can be cracked offline on standard attacker systems without locking DC accounts.',
            nextInvestigation: 'Crack the ticket offline to recover active server credentials.',
            amanQuestion: 'Why can ticket cracking occur offline without alerting the Domain Controller?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Request service SPNs',
              description: 'Execute GetUserSPNs to request service ticket parameters from the domain DC.',
              actionText: 'Execute SPN harvest script',
              terminalCmd: 'GetUserSPNs.py -dc-ip 10.10.1.20 -request domain.local/student',
              expectedResult: 'Ticket hashes returned successfully.'
            }
          ]
        },
        investigation: {
          caseBrief: 'The Active Directory domain controllers of domain.local are suspected of utilizing legacy service account configurations. Audit active SPNs.',
          knownFacts: [
            'Active Directory Controller is active at 10.10.1.20.',
            'Authenticated user session is active for user "student".'
          ],
          unknownFacts: [
            'Active SPN services mapped to high-privilege profiles.',
            'Strength of service account passwords.'
          ],
          availableAssets: ['Student workstation (10.10.1.5)', 'Domain DC (10.10.1.20)'],
          objectives: [
            'Query active Active Directory nodes for Service Principal Names (SPNs).',
            'Request ticket structures and analyze encryption strengths.'
          ],
          rulesOfEngagement: 'Strictly utilize read-only service ticket queries. Avoid launching massive brute-force sweeps on active DC accounts.',
          socraticAmanPrompt: 'What security properties of Kerberos ticket signing enable attackers to recover service passwords offline?',
          hypotheses: [
            {
              text: 'DC service tickets are encrypted with the target service account password hash, enabling brute-force testing.',
              score: 100,
              rationale: 'Correct. Because tickets are encrypted utilizing the service password, any valid client can attempt decryption offline.'
            },
            {
              text: 'Kerberoasting requests exploit direct buffer overflows inside DC Kerberos ports.',
              score: 30,
              rationale: 'Incorrect. Kerberoasting uses normal, standard protocol interactions and does not inject buffer exploits.'
            }
          ]
        },
        challenge: {
          title: 'Service Principal Ticket Harvest',
          brief: 'Harvest Kerberos tickets from domain.local and locate the password hash flag on the DB service account.',
          objectives: [
            { id: 'dc-query', text: 'Harvest SPNs from DC node', isCompleted: false },
            { id: 'ticket-crack', text: 'Locate ticket flag parameter', isCompleted: false }
          ],
          hints: [
            'Request tickets with GetUserSPNs.py.',
            'Locate MSSQLSvc indicators.'
          ],
          successFlag: 'FLAG{KERBEROAST_PASS_EXTRACTED}'
        },
        realIncidentMatch: {
          name: 'The SolarWinds Kerberos Attack Phase',
          historicalContext: 'In 2020, lateral movements across compromised networks routinely leveraged Kerberoasting of domain services, extracting weak service account credentials to pivot deeper into domain systems.',
          attackChain: [
            {
              phase: 'lateral_movement',
              name: 'Kerberos Abuse',
              desc: 'Attackers target domain SPNs to extract domain credential material.',
              logOutput: 'Event 4769: TGS Requested for MSSQLSvc. Encryption: RC4. Client: admin_pivot.',
              discoveries: ['Recovered active DBA administrative credentials.']
            }
          ],
          techniques: ['T1558.003 - Kerberoasting', 'T1003 - Credential Dumping'],
          defensiveLessons: [
            'Enforce long random passwords (min 25 characters) for all Service Accounts.',
            'Transition directories to Group Managed Service Accounts (gMSA).'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'Why are Group Managed Service Accounts (gMSAs) highly effective in preventing Kerberoasting success?',
              options: [
                'They disable Kerberos ticket exchanges entirely',
                'They automatically generate complex, 240-character passwords and rotation schedules handled by Active Directory',
                'They encrypt domain controllers utilizing hardware locks',
                'They restrict access based on IP domains'
              ],
              correctAnswer: 'They automatically generate complex, 240-character passwords and rotation schedules handled by Active Directory',
              explanation: 'gMSAs automatically enforce complex, rotating 240-character passwords. This makes offline cracking attempts computationally impossible, neutralizing the Kerberoasting attack pattern.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'gmsa_migrate',
              title: 'Migrate to gMSA Service Account',
              desc: 'Creates a group-managed service profile with dynamic security credentials.',
              logs: 'New-ADServiceAccount -Name mssql-prod -DNSHostName sql-prod.domain.local -PrincipalsAllowedToRetrieveManagedPassword "SQL-Servers"'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'wireless',
    name: 'WIRELESS SECURITY',
    icon: Wifi,
    color: 'from-orange-600 to-amber-500',
    skills: [
      {
        id: 'wireless-handshake',
        name: 'WPA2 Handshake Analysis',
        difficulty: 'Intermediate',
        estTime: '20 mins',
        theory: {
          what: 'WPA2 Handshake Analysis is the audit of the four-way handshake sequence exchanged between a wireless client and an Access Point (AP).',
          why: 'Allows recovery of the pre-shared key (PSK) by capturing the cryptographic handshake parameters and executing offline wordlist attacks.',
          how: 'Captures EAPOL frames during client association or by injecting deauthentication frames, then cracks the PMK offline.',
          defenderView: 'Abrupt surges of deauthentication frames targeted at a wireless MAC address on a specific channel.',
          mistakes: 'Relying on short, dictionary-based WPA2 keys which can be cracked in seconds.',
          detection: 'Wireless intrusion sensors tracking abnormal 802.11 management frames (Deauth floods).',
          mitigation: 'Migrate to WPA3 or WPA2-Enterprise which utilize centralized credential handshakes.'
        },
        visual: {
          nodes: ['AP (Access Point)', 'Sniffer Host (Attacker)', 'Wireless Client'],
          packetFlow: 'Sniffer ──[Deauth Flood]──> AP / Client dissociates\nClient ──[Reassociates, 4-way handshake]──> AP\nSniffer Captures 4-way EAPOL packets ──> cracks offline!',
          asciiArt: `
+------------------+         Deauth client frame        +------------------+
| ATTACKER Sniffer | ──────────────────────────────────> | Wireless AP / Cl |
| Captures Handshake| <────────────────────────────────── | Reassociating... |
+------------------+         EAPOL packet stream        +------------------+
          `
        },
        video: {
          title: 'Sniffing 802.11 Protocols & EAPOL Cracking',
          duration: '11:10',
          difficulty: 'Intermediate',
          learnOutcome: 'Utilize airmon-ng to establish monitor interfaces, capture EAPOL frames, and apply wordlist tests.',
          chapters: [
            { time: '00:00', title: '802.11 Frame Structure' },
            { time: '03:00', title: 'Aircrack-ng Monitor Modes' },
            { time: '06:30', title: 'Deauthentication Attacks' },
            { time: '09:15', title: 'Cracking WPA Handshakes' }
          ]
        },
        commands: [
          {
            cmd: 'aircrack-ng -w wordlist.txt -b 00:11:22:33:44:55 wpa_handshake.cap',
            purpose: 'Run a dictionary-based cracking attack against captured WPA2 EAPOL handshake packages.',
            options: '-w (Wordlist file), -b (BSSID MAC address of Access Point)',
            expectedOutput: 'KEY FOUND! [ FLAG{WPA2_CRACKED_SUCCESS} ]\nDecrypted SSID: Secure_Lab_AP',
            discoveries: 'Cracked the pre-shared network key of the target wireless network.',
            mitre: 'T1557 - Adversary-in-the-Middle',
            safety: 'Only perform offline cracking tests on pre-recorded packet capture files.',
            flagsDetail: [
              { flag: '-w wordlist.txt', desc: 'Specifies the path to the password dictionary used for testing.' },
              { flag: '-b 00:11:22:33:44:55', desc: 'Filters handshake captures matching the specific target AP MAC address.' }
            ],
            whatToLookFor: 'Look for the "KEY FOUND!" notification block inside the terminal report.',
            discoveryDetail: 'Cracked WPA2 handshake, revealing cleartext Wi-Fi access passphrase.',
            whyItMatters: 'Compromised Wi-Fi keys permit full network association, exposing lateral systems to direct attacks.',
            nextInvestigation: 'Associate with wireless networks to perform internal sub-network mapping.',
            amanQuestion: 'How does WPA3 prevent dictionary attacks on captured handshake parameters?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Decrypt Handshake File',
              description: 'Execute aircrack-ng on the captured file using the dictionary wordlist.',
              actionText: 'Execute handshake cracker',
              terminalCmd: 'aircrack-ng -w wordlist.txt -b 00:11:22:33:44:55 wpa_handshake.cap',
              expectedResult: 'Decryption key located successfully.'
            }
          ]
        },
        investigation: {
          caseBrief: 'The corporate administrative Wi-Fi network (Secure_Lab_AP) is suspected of utilizing a compromised or weak PSK configuration. Analyze the handshake file.',
          knownFacts: [
            'Handshake file (wpa_handshake.cap) records EAPOL packets.',
            'Target BSSID MAC address is 00:11:22:33:44:55.'
          ],
          unknownFacts: [
            'Strength and complexity of the configured pre-shared key.',
            'Encryption configuration limits.'
          ],
          availableAssets: ['Wireless Audit Suite (10.10.1.5)'],
          objectives: [
            'Parse handshake file for valid 4-way handshake sequences.',
            'Apply dictionary analysis to crack the shared key.'
          ],
          rulesOfEngagement: 'Analyze pre-recorded offline packet captures. Do not transmit active jammer or deauthentication waves on live environments.',
          socraticAmanPrompt: 'What cryptographic parameters are exchanged in the WPA2 4-way handshake that enable offline credential testing?',
          hypotheses: [
            {
              text: 'The ANonce, SNonce, and MIC parameters allow attackers to validate potential PSK combinations offline.',
              score: 100,
              rationale: 'Correct. The MIC (Message Integrity Code) validates whether the derived temporal key matches, enabling offline password brute-forcing.'
            },
            {
              text: 'WPA2 handshakes transmit cleartext password strings during user login.',
              score: 25,
              rationale: 'Incorrect. Keys are never sent in cleartext; they are checked through cryptographic validations of temporal keys.'
            }
          ]
        },
        challenge: {
          title: 'WPA2 Cryptographic Crack',
          brief: 'Recover the pre-shared network key from the provided handshake capture and identify the network passphrase flag.',
          objectives: [
            { id: 'load-cap', text: 'Load wpa_handshake.cap into cracker', isCompleted: false },
            { id: 'find-wifi-flag', text: 'Recover the wireless PSK flag', isCompleted: false }
          ],
          hints: [
            'Use aircrack-ng with -b 00:11:22:33:44:55.',
            'Verify that wordlist.txt contains common entries.'
          ],
          successFlag: 'FLAG{WPA2_CRACKED_SUCCESS}'
        },
        realIncidentMatch: {
          name: 'The TJX Companies Wireless Breach',
          historicalContext: 'In 2005, attackers exploited weak WEP encryption standards on retail store routers, sniffing networks to extract transaction registries and compromise over 45 million card numbers.',
          attackChain: [
            {
              phase: 'access',
              name: 'WEP Key Decryption',
              desc: 'Attackers sniff weak initialization vectors to decrypt network encryption keys.',
              logOutput: 'Decrypted WEP Key: 10:20:30:40:50. Associated: Success.',
              discoveries: ['Associated with store registers directly.']
            }
          ],
          techniques: ['T1557 - Adversary-in-the-Middle', 'T1040 - Network Sniffing'],
          defensiveLessons: [
            'Immediately phase out legacy, broken WEP or WPA1 wireless security protocols.',
            'Isolate and fire-wall administrative transaction links from wireless corporate routers.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'How does the Dragonfly handshake utilized in WPA3 secure connections against offline dictionary attacks?',
              options: [
                'It runs local antivirus checks on clients',
                'It enforces Simultaneous Authentication of Equals (SAE), generating dynamic session elements that prevent offline guessing verification',
                'It encrypts transmissions utilizing pre-shared SSH certs',
                'It blocks deauthentication requests'
              ],
              correctAnswer: 'It enforces Simultaneous Authentication of Equals (SAE), generating dynamic session elements that prevent offline guessing verification',
              explanation: 'Dragonfly SAE uses zero-knowledge proof concepts. Since the network password is never exposed in the handshake exchanges, attackers cannot verify passphrase guesses offline.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'wpa3_upgrade',
              title: 'Migrate to WPA3 Security Profile',
              desc: 'Updates AP configuration parameters to enforce WPA3 SAE handshakes.',
              logs: 'wireless-ap(config)# security-profile enterprise-sae\nwireless-ap(config)# wpa3-only enable'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'cloud',
    name: 'CLOUD SECURITY',
    icon: Cloud,
    color: 'from-sky-600 to-indigo-500',
    skills: [
      {
        id: 'cloud-s3',
        name: 'S3 Buckets & Access Controls',
        difficulty: 'Beginner',
        estTime: '15 mins',
        theory: {
          what: 'S3 Buckets & Access Controls govern the security policies and public exposure limits of cloud-hosted object storage files.',
          why: 'Improper permissions (open public access) leak critical source code, sensitive user logs, database backups, or API secrets.',
          how: 'Auditing access control lists (ACLs) or bucket policies to ensure unauthenticated users cannot list object nodes.',
          defenderView: 'API audit logs showing anonymous GetObject or ListBucket requests targeting private document hierarchies.',
          mistakes: 'Assigning "AllUsers" read or write capabilities to backup storage folders.',
          detection: 'Track anomalous GET requests or bulk document exfiltration sequences via AWS CloudTrail.',
          mitigation: 'Enforce "Block Public Access" policies globally and mandate IAM-based AWS credential authorization.'
        },
        visual: {
          nodes: ['Anonymous User', 'Cloud Storage AWS S3 API', 'Private Logs Buckets'],
          packetFlow: 'User ──[HTTP GET /logs-prod/]──> Public Bucket Policy (Open Access!) ──> S3 Returns directory list!\nUser reads "db_backup.sql" and "secrets.json" containing keys!',
          asciiArt: `
+------------------+         Anonymous API query         +------------------+
| Hacker Workstation| ──────────────────────────────────> | Public S3 Bucket | (Open ACL!)
| reads credentials| <────────────────────────────────── | Returns raw files|
+------------------+         Fetches private documents  +------------------+
          `
        },
        video: {
          title: 'Securing Cloud Object Storage & IAM Policies',
          duration: '9:05',
          difficulty: 'Easy',
          learnOutcome: 'Locate public buckets, review AWS bucket JSON policies, and apply strict blocking parameters.',
          chapters: [
            { time: '00:00', title: 'S3 Object Storage Fundamentals' },
            { time: '02:00', title: 'Anatomy of Public ACL Leaks' },
            { time: '05:00', title: 'AWS IAM Policy Auditing' },
            { time: '07:30', title: 'Hardening Cloud Storage' }
          ]
        },
        commands: [
          {
            cmd: 'aws s3 ls s3://prod-logs-backup --no-sign-request',
            purpose: 'Query cloud object storage buckets anonymously to verify if public file listings are permitted.',
            options: 'ls (List files), --no-sign-request (Anonymous/Unauthenticated access)',
            expectedOutput: '2026-08-25 12:00:00      12403 db_backup.sql\n2026-08-25 12:01:00        401 FLAG{S3_LEAK_EXPOSED}',
            discoveries: 'Exposed sensitive backup database and credential assets due to open public bucket policy.',
            mitre: 'T1530 - Data from Cloud Storage Object',
            safety: 'Do not run against external production resources that you do not own or have formal written consent to scan.',
            flagsDetail: [
              { flag: 'ls', desc: 'Directs the client tool to query directories and list active filenames.' },
              { flag: '--no-sign-request', desc: 'Omits AWS credential signature fields to execute anonymous public requests.' }
            ],
            whatToLookFor: 'Look for successfully listed filenames and file directories instead of "Access Denied" errors.',
            discoveryDetail: 'Bucket returned full file registry, including a confidential database dump.',
            whyItMatters: 'Open buckets expose private systems to trivial anonymous asset discovery and data theft.',
            nextInvestigation: 'Examine files for cleartext system credentials or encryption keys.',
            amanQuestion: 'If the bucket returned "Access Denied", does that prove the files are completely secure?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'List anonymous cloud assets',
              description: 'Launch aws s3 CLI queries to test storage permissions on the lab bucket.',
              actionText: 'Execute S3 directory sweep',
              terminalCmd: 'aws s3 ls s3://prod-logs-backup --no-sign-request',
              expectedResult: 'File registry list returned successfully containing database backups.'
            }
          ]
        },
        investigation: {
          caseBrief: 'The production backup storage nodes of prod-logs-backup are suspected of leaking configuration schemas due to permissive policies. Audit the bucket permissions.',
          knownFacts: [
            'Storage node is hosted at s3://prod-logs-backup.',
            'Request is executed unauthenticated.'
          ],
          unknownFacts: [
            'Presence of public policies permitting unauthenticated actions.',
            'Exposure status of internal logs.'
          ],
          availableAssets: ['Student Workstation (10.10.1.5)'],
          objectives: [
            'Analyze storage endpoint for open directory permissions.',
            'Discover and extract hidden diagnostic flags.'
          ],
          rulesOfEngagement: 'Analyze target buckets only. Do not upload unauthorized files or modify existing object parameters.',
          socraticAmanPrompt: 'What structural component of bucket policies governs whether unauthenticated users can download files?',
          hypotheses: [
            {
              text: 'The Principal parameter is configured as a wildcard ("*") alongside the s3:ListBucket effect.',
              score: 100,
              rationale: 'Correct. A Principal wildcard allows any entity, including unauthenticated public guests, to make queries.'
            },
            {
              text: 'S3 buckets are configured to run local SSH server daemons.',
              score: 20,
              rationale: 'Incorrect. S3 is object storage serviced via HTTP/REST APIs, not a standard compute node with SSH.'
            }
          ]
        },
        challenge: {
          title: 'Exposed Object Exfiltration',
          brief: 'Locate the administrative storage folder on prod-logs-backup and exfiltrate the hidden system key flag.',
          objectives: [
            { id: 'scan-s3', text: 'Scan storage bucket logs anonymously', isCompleted: false },
            { id: 'dump-flag', text: 'Extract file flag data', isCompleted: false }
          ],
          hints: [
            'Use aws s3 ls s3://prod-logs-backup --no-sign-request.',
            'Read the specific flag text file.'
          ],
          successFlag: 'FLAG{S3_LEAK_EXPOSED}'
        },
        realIncidentMatch: {
          name: 'The Capital One S3 Breach',
          historicalContext: 'In 2019, attackers exploited an SSRF vulnerability on a cloud server to fetch IAM credentials, utilizing them to access open S3 buckets and steal over 100 million customer records.',
          attackChain: [
            {
              phase: 'exfiltration',
              name: 'S3 Storage Dump',
              desc: 'Attackers use compromised credentials to list and exfiltrate customer database logs.',
              logOutput: 'aws s3 cp s3://capitalone-credit-prod/customers/ . --recursive',
              discoveries: ['Stole credit profiles and transaction logs.']
            }
          ],
          techniques: ['T1530 - Data from Cloud Storage', 'T1078 - Valid Accounts'],
          defensiveLessons: [
            'Enforce comprehensive "Block Public Access" variables globally at the AWS Account level.',
            'Continuously audit cloud resource permissions utilizing automated tools.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'Which of the following AWS policies completely prevents any public access to an S3 bucket, overriding custom bucket policies?',
              options: [
                'Disable VPC Endpoint linkages',
                'Block Public Access (BPA) at the Account level',
                'Disable SSL requests',
                'Reset API keys'
              ],
              correctAnswer: 'Block Public Access (BPA) at the Account level',
              explanation: 'AWS Block Public Access (BPA) acts as a centralized administrative guardrail. When enabled, it rejects any ACLs or bucket policies that grant public read/write permissions.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 's3_block_public',
              title: 'Enable Block Public Access Policies',
              desc: 'Configures bucket configuration parameters to strictly deny public ACL parameters.',
              logs: 'aws s3api put-public-access-block --bucket prod-logs-backup --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'soc',
    name: 'SOC / BLUE TEAM',
    icon: ShieldAlert,
    color: 'from-red-600 to-orange-500',
    skills: [
      {
        id: 'threat-hunting-siem',
        name: 'Threat Hunting in SIEM',
        difficulty: 'Intermediate',
        estTime: '20 mins',
        theory: {
          what: 'Threat Hunting is the proactive search for cyber threats lurking undetected in corporate logs, networks, or endpoints.',
          why: 'Enables identification of stealth adversaries who have bypassed automatic detection rules and established persistent holds.',
          how: 'Formulates hypotheses based on attacker profiles, queries SIEM database schemas, and isolates anomalous data indicators.',
          defenderView: 'Unusual, outbound terminal connections running during off-hours, or unexpected admin tool executions.',
          mistakes: 'Relying exclusively on default antivirus signatures without checking system event logs (like Sysmon).',
          detection: 'Identify outliers by comparing file execution counts across hundreds of endpoints.',
          mitigation: 'Implement centralized logging architecture and build automated detection triggers.'
        },
        visual: {
          nodes: ['Endpoint Host', 'ElasticSearch / SIEM Log Store', 'SOC Analyst Monitor'],
          packetFlow: 'Host logs "whoami" commands executed by Apache ──> Logs exported to SIEM ──> Analyst queries: "process.parent.name: apache AND process.name: whoami" ──> Alert triggered!',
          asciiArt: `
+------------------+         Log Forwarder export        +------------------+
| Compromised Host | ──────────────────────────────────> | SIEM Log Database| (ElasticSearch)
| runs whoami...   | <────────────────────────────────── | Analyst Query!   |
+------------------+         Analyst spots intrusion     +------------------+
          `
        },
        video: {
          title: 'Proactive Querying & Log Correlation in SIEM',
          duration: '10:35',
          difficulty: 'Intermediate',
          learnOutcome: 'Utilize Splunk or Elastic query structures to correlate firewall rejects with endpoint user events.',
          chapters: [
            { time: '00:00', title: 'The Threat Hunter Mindset' },
            { time: '02:30', title: 'Windows Event Logs (Sysmon)' },
            { time: '05:45', title: 'Writing Splunk Search Queries' },
            { time: '08:15', title: 'Detecting Lateral Movements' }
          ]
        },
        commands: [
          {
            cmd: 'splunk-search "index=windows_sysmon EventID=1 (process_name=whoami OR process_name=net)"',
            purpose: 'Query SIEM database to locate unprompted executions of common system reconnaissance commands on endpoints.',
            options: '"index=windows_sysmon" (target data index), "EventID=1" (Process Creation event)',
            expectedOutput: 'Host: WS-PROD-10\nParentProcess: apache2.exe\nCommand: whoami\nResult: FLAG{SIEM_HUNT_ALERT}',
            discoveries: 'Detected web shell execution footprint: apache2 server spawned whoami system checks.',
            mitre: 'T1059 - Command and Scripting Interpreter',
            safety: 'Safe to execute; queries read-only indexed log structures.',
            flagsDetail: [
              { flag: 'index=windows_sysmon', desc: 'Directs the search engine to audit Windows system monitoring indexes.' },
              { flag: 'EventID=1', desc: 'Filters logging records to display only process creation events.' }
            ],
            whatToLookFor: 'Verify if system tools (whoami, net, ipconfig) possess web server or database application parent processes.',
            discoveryDetail: 'Isolated process creation logs where web services executed system administration binaries.',
            whyItMatters: 'Web servers should never spawn system utilities; this is a clear sign of web shell exploitation.',
            nextInvestigation: 'Investigate the network connections originating from the web server process.',
            amanQuestion: 'Why does an attacker run "whoami" immediately after establishing an initial exploit shell?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Audit Endpoint Process Logs',
              description: 'Launch Splunk-styled queries to look for web servers executing terminal tools.',
              actionText: 'Execute Splunk query',
              terminalCmd: 'splunk-search "index=windows_sysmon EventID=1 (process_name=whoami OR process_name=net)"',
              expectedResult: 'Anomalous process creation alerts returned exposing active breach.'
            }
          ]
        },
        investigation: {
          caseBrief: 'The server node at 10.10.1.20 recently generated anomalous file outputs. Query system process registries inside the SIEM logs to reconstruct the timeline.',
          knownFacts: [
            'Logs are aggregated under index "windows_sysmon".',
            'Multiple endpoints are registered.'
          ],
          unknownFacts: [
            'Entry vectors used by the threat agent.',
            'Malicious files executing in memory.'
          ],
          availableAssets: ['SOC SIEM Console (10.10.1.5)'],
          objectives: [
            'Audit process creations globally for high-risk parents.',
            'Exfiltrate compromise indicators.'
          ],
          rulesOfEngagement: 'Analyze pre-recorded logs. Do not alter local active endpoint system files.',
          socraticAmanPrompt: 'What system monitoring logging structures provide the highest detail of process ancestry and creation parameters?',
          hypotheses: [
            {
              text: 'Query Sysmon Process Creation logs (Event ID 1) with filters for unusual parent contexts.',
              score: 100,
              rationale: 'Correct. Sysmon Event ID 1 provides detailed parent-child process mappings, which are critical for tracing shell activities.'
            },
            {
              text: 'Query login failure logs (Event ID 4625) exclusively.',
              score: 40,
              rationale: 'Sub-optimal. Login failures show authentication attempts, not active command execution or parent-child processes.'
            }
          ]
        },
        challenge: {
          title: 'Web Shell Log Reconstruction',
          brief: 'Locate the web shell execution logs inside the SIEM and identify the flag containing the compromise signature.',
          objectives: [
            { id: 'query-siem', text: 'Filter logs for web server parent events', isCompleted: false },
            { id: 'get-siem-flag', text: 'Extract breach signature flag', isCompleted: false }
          ],
          hints: [
            'Splunk query index=windows_sysmon.',
            'Filter on process_name=whoami.'
          ],
          successFlag: 'FLAG{SIEM_HUNT_ALERT}'
        },
        realIncidentMatch: {
          name: 'The SolarWinds Command-and-Control Discovery',
          historicalContext: 'In 2020, threat hunters discovered the SUNBURST backdoor by analyzing endpoint logs for unexpected outbound traffic patterns originating from administrative updates.',
          attackChain: [
            {
              phase: 'execution',
              name: 'Backdoor Activation',
              desc: 'SolarWinds updates execute stealthy lateral commands.',
              logOutput: 'Process: SolarWinds.BusinessLayerHost.exe -> spawned cmd.exe. Target: c2-beacons.net.',
              discoveries: ['Identified compromised software updates.']
            }
          ],
          techniques: ['T1195 - Supply Chain Compromise', 'T1071 - Application Layer Protocol'],
          defensiveLessons: [
            'Enforce application whitelisting across all corporate servers.',
            'Continuously baseline normal service network and process relationships.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'In Sysmon configuration, what is the significance of Event ID 3?',
              options: [
                'Registry modification tracking',
                'Network Connection established events',
                'Process Termination logs',
                'Driver loading events'
              ],
              correctAnswer: 'Network Connection established events',
              explanation: 'Sysmon Event ID 3 logs network connections (both TCP and UDP) initiated by local processes, which is crucial for identifying command-and-control beacons.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'sysmon_harden',
              title: 'Deploy Hardened Sysmon Profiles',
              desc: 'Installs robust XML filtering schemas (like SwiftOnSecurity) to filter out noise while capturing malicious activities.',
              logs: 'sysmon.exe -c sysmonconfig-export.xml'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'forensics',
    name: 'DFIR / FORENSICS',
    icon: Fingerprint,
    color: 'from-purple-600 to-indigo-500',
    skills: [
      {
        id: 'forensic-timeline',
        name: 'Forensic Timeline Analysis',
        difficulty: 'Advanced',
        estTime: '20 mins',
        theory: {
          what: 'Timeline Analysis reconstructs digital activities sequentially by extracting and compiling timestamps from filesystem changes (MFT), event logs, and cache indexes.',
          why: 'Enables identification of exact entry points, file copy sequences, data exfiltration windows, and lateral movements.',
          how: 'Parses MACB timestamps (Modified, Accessed, Created, Born) into a cohesive chronological ledger.',
          defenderView: 'Clustered file writes in system paths matching known backdoor delivery mechanisms.',
          mistakes: 'Mounting disk images in read-write mode, corrupting file metadata and chain of custody.',
          detection: 'Correlate event logs with NTFS filesystem updates.',
          mitigation: 'Enforce strict log integrity protections (write-once media) and perform read-only forensic acquisitions.'
        },
        visual: {
          nodes: ['Compromised Disk', 'Forensic Workstation (Read-Only)', 'Sequence of Events'],
          packetFlow: 'Workstation mounts copy ──[Log2Timeline Parses MFT]──> Generates CSV output\nAnalyst reads timeline: 12:00:01 (Web Shell Created) ──> 12:00:05 (Whoami run) ──> 12:01:00 (Registry backdoor added)',
          asciiArt: `
+------------------+         Parses disk MACB timestamps +------------------+
| Read-Only Mount  | ──────────────────────────────────> | Log2Timeline CSV | (Plaso)
| preserves metadata| <────────────────────────────────── | Order of Events  |
+------------------+         Traces malicious entry     +------------------+
          `
        },
        video: {
          title: 'NTFS Artifacts & Timeline Generation',
          duration: '11:45',
          difficulty: 'Hard',
          learnOutcome: 'Utilize Plaso/log2timeline, interpret NTFS MFT record changes, and map timestamps.',
          chapters: [
            { time: '00:00', title: 'The digital forensic standard' },
            { time: '02:45', title: 'MFT and MACB timestamps' },
            { time: '06:15', title: 'Compiling logs into CSV' },
            { time: '09:00', title: 'Identifying timeline abnormalities' }
          ]
        },
        commands: [
          {
            cmd: 'log2timeline -r --output csv timeline.csv /mnt/forensic_disk',
            purpose: 'Parse directory metadata, event logs, and NTFS attributes into a centralized, sorted timeline file.',
            options: '-r (recursive extraction), --output csv (CSV output), /mnt/forensic_disk (Forensic mount)',
            expectedOutput: 'Parsed 12040 records.\nRow: 2026-08-25 12:00:15, Created, /var/www/html/shell.php, FLAG{NTFS_MFT_FORENSICS}',
            discoveries: 'Identified the exact timestamp when the attacker\'s PHP shell backdoor was written to disk.',
            mitre: 'T1012 - Query Registry',
            safety: 'Always ensure the target directory /mnt/forensic_disk is mounted as read-only.',
            flagsDetail: [
              { flag: '-r', desc: 'Directs Plaso to extract artifacts recursively from all sub-folders.' },
              { flag: '--output csv', desc: 'Instructs compiler engine to compile extracted logs into a tabular CSV report.' }
            ],
            whatToLookFor: 'Look for unexpected system folder updates (like system32 or /etc/) in the minutes surrounding the alert.',
            discoveryDetail: 'Identified precise write timestamps matching the attacker\'s backdoor.',
            whyItMatters: 'Timestamps provide factual evidence of when files were altered, helping determine the entry vector.',
            nextInvestigation: 'Correlate HTTP server access log timestamps with filesystem write times.',
            amanQuestion: 'Why can NTFS Born/Created timestamps sometimes be older than Modified timestamps?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Generate Forensic Timeline',
              description: 'Run Plaso to compile system metadata logs into a structured CSV file.',
              actionText: 'Execute log2timeline compiler',
              terminalCmd: 'log2timeline -r --output csv timeline.csv /mnt/forensic_disk',
              expectedResult: 'Centralized CSV timeline created. Located PHP shell write event.'
            }
          ]
        },
        investigation: {
          caseBrief: 'A server disk image has been mounted as read-only. Compile a chronological log sequence to trace when local configuration credentials were exfiltrated.',
          knownFacts: [
            'Target disk is mounted at /mnt/forensic_disk.',
            'File changes occurred within a 1-hour window.'
          ],
          unknownFacts: [
            'Initial entry point used by the threat agent.',
            'Backdoors added to system paths.'
          ],
          availableAssets: ['Forensic Analysis Station (10.10.1.5)'],
          objectives: [
            'Parse directory timestamps and export sorted reports.',
            'Identify files created inside system directories.'
          ],
          rulesOfEngagement: 'Analyze mounted directories strictly in read-only mode. Maintain strict logging integrity hashes.',
          socraticAmanPrompt: 'What term describes the technique where attackers alter file timestamps to match standard system files and deceive analysts?',
          hypotheses: [
            {
              text: 'The attacker applied Timestomping (T1070.006) to overwrite MFT attributes.',
              score: 100,
              rationale: 'Correct. Timestomping alters timestamps, making malicious files look like old, legitimate system binaries.'
            },
            {
              text: 'The attacker compiled files in different system partitions.',
              score: 35,
              rationale: 'Incorrect. Partition migration does not overwrite chronological attributes to hide process creations.'
            }
          ]
        },
        challenge: {
          title: 'FileSystem Timeline Extraction',
          brief: 'Compile filesystem metadata and locate the chronological file write flag indicating when the backdoor was delivered.',
          objectives: [
            { id: 'run-plaso', text: 'Parse NTFS timestamps from mount', isCompleted: false },
            { id: 'get-mft-flag', text: 'Extract NTFS timestamp flag', isCompleted: false }
          ],
          hints: [
            'Use log2timeline parser tools.',
            'Filter results on timeline.csv.'
          ],
          successFlag: 'FLAG{NTFS_MFT_FORENSICS}'
        },
        realIncidentMatch: {
          name: 'The Target Corporation Incident Timeline',
          historicalContext: 'In 2013, digital forensics teams traced the massive retail breach back to compromised partner credentials. They mapped the attack timeline from initial portal access to bulk card data exfiltration.',
          attackChain: [
            {
              phase: 'installation',
              name: 'POS Backdoor Delivery',
              desc: 'Attackers deliver malware to registers at precise times.',
              logOutput: 'File: pos_grabber.exe Created: 2013-11-27 15:40:11. SHA-256: 0e78a2f...',
              discoveries: ['Identified compiled POS malware write event.']
            }
          ],
          techniques: ['T1070.006 - Timestomping', 'T1059 - Command Interpreter'],
          defensiveLessons: [
            'Aggregating endpoint activity logs centrally prevents attackers from deleting local logs.',
            'Conduct routine digital forensic readiness training.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'Which NTFS attribute stores the primary timestamp data accessed by the standard user command "ls" or Windows Explorer?',
              options: [
                '$STANDARD_INFORMATION',
                '$FILE_NAME',
                '$OBJECT_ID',
                '$SECURITY_DESCRIPTOR'
              ],
              correctAnswer: '$STANDARD_INFORMATION',
              explanation: 'NTFS standard timestamps are kept inside the $STANDARD_INFORMATION attribute, which is easily editable by user APIs. The $FILE_NAME timestamps are only altered by the system kernel, serving as a reliable backup.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'mft_integrity_check',
              title: 'Validate File Metadata Integrity',
              desc: 'Utilizes file system auditing tools to compare standard information attributes with file name attributes.',
              logs: 'fsck.ntfs -v /dev/sdb1'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'python',
    name: 'PYTHON SECURITY AUTOMATION',
    icon: Zap,
    color: 'from-amber-600 to-yellow-500',
    skills: [
      {
        id: 'python-portscanner',
        name: 'Socket Port Scanner Dev',
        difficulty: 'Beginner',
        estTime: '15 mins',
        theory: {
          what: 'Socket Port Scanner Development is the creation of customized network scanning scripts using Python\'s socket API library.',
          why: 'Allows analysts to run lightweight, rapid connection probes without relying on third-party security platforms or heavy pre-compiled packages.',
          how: 'Initializes a socket client connection attempt (`connect_ex`) across targeted port ranges, logging successful handshakes.',
          defenderView: 'Sequential, rapid TCP connect requests originating from a single source host IP.',
          mistakes: 'Using non-blocking sockets without timeouts, causing scanning loops to hang indefinitely on inactive targets.',
          detection: 'Track excessive socket connect connection failures originating from a single local endpoint.',
          mitigation: 'Implement host-level firewall rate limits or log socket connection rates.'
        },
        visual: {
          nodes: ['Python Script Host', 'TCP Connection Request', 'Target Server IP'],
          packetFlow: 'Python: s.connect((ip, port)) ──[TCP SYN]──> Target\nIf port is open: connect_ex returns 0 (Connected!) ──> Script prints: "Port Open!"',
          asciiArt: `
+------------------+         Executes Python Code        +------------------+
| python scanner   | ──────────────────────────────────> | Target Listening |
| prints open port | <────────────────────────────────── | Returns state 0  |
+------------------+         Logs connection result     +------------------+
          `
        },
        video: {
          title: 'Developing Network Scanners in Python',
          duration: '8:10',
          difficulty: 'Easy',
          learnOutcome: 'Write python socket connection algorithms, handle exceptions, and speed up connection loops.',
          chapters: [
            { time: '00:00', title: 'The Python socket API' },
            { time: '02:00', title: 'Writing the connection code' },
            { time: '04:30', title: 'Exception & timeout control' },
            { time: '06:45', title: 'Multithreading Scans' }
          ]
        },
        commands: [
          {
            cmd: 'python3 -c "import socket; s=socket.socket(); s.settimeout(0.5); print(\'Open!\' if s.connect_ex((\'10.10.1.20\', 80))==0 else \'Closed\')"',
            purpose: 'Run a direct inline python socket connection test targeting port 80 of the sandbox server.',
            options: '-c (Inline Python execution command string)',
            expectedOutput: 'Open!\nFLAG{PYTHON_SOCKET_DEV_SUCCESS}',
            discoveries: 'Verified listening HTTP port 80 using a custom socket scanning query.',
            mitre: 'T1046 - Network Service Scanning',
            safety: 'Safe to execute. Standard connection probes do not alter target database properties.',
            flagsDetail: [
              { flag: 'socket.socket()', desc: 'Initializes a TCP stream socket client module.' },
              { flag: 's.connect_ex()', desc: 'Queries target IP and port, returning status 0 if connected successfully.' }
            ],
            whatToLookFor: 'Look for "Open!" or 0 status indicators in terminal logs.',
            discoveryDetail: 'Identified listening port 80 using inline socket script.',
            whyItMatters: 'Socket scripting enables custom threat sweeping and scanning without standard binary utilities.',
            nextInvestigation: 'Build multithreaded socket sweeps to map entire subnets.',
            amanQuestion: 'What is the performance benefit of using socket.connect_ex() over socket.connect() inside loops?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Trigger Custom Python Probe',
              description: 'Execute the Python inline socket script to scan port 80 of the sandbox.',
              actionText: 'Execute inline scanner',
              terminalCmd: 'python3 -c "import socket; s=socket.socket(); s.settimeout(0.5); print(\'Open!\' if s.connect_ex((\'10.10.1.20\', 80))==0 else \'Closed\')"',
              expectedResult: 'Python output displays Port Open accompanied by success flag.'
            }
          ]
        },
        investigation: {
          caseBrief: 'The server node at 10.10.1.20 is suspected of hosting an unmapped SSH or administration service. Author a python probe to scan port 22.',
          knownFacts: [
            'Target node is active at 10.10.1.20.',
            'Port 22 is permitted through perimeter firewalls.'
          ],
          unknownFacts: [
            'Active response properties of the listening SSH socket daemon.'
          ],
          availableAssets: ['Student Workstation (10.10.1.5)'],
          objectives: [
            'Develop socket query script to scan target SSH socket.',
            'Extract active response signatures.'
          ],
          rulesOfEngagement: 'Strictly scan target within local range boundaries. Keep timeout thresholds minimal.',
          socraticAmanPrompt: 'What socket property prevents Python port scanning sweeps from hanging indefinitely on inactive IP addresses?',
          hypotheses: [
            {
              text: 'Configure socket.settimeout() to drop connections that fail to respond within a short threshold (e.g. 0.5s).',
              score: 100,
              rationale: 'Correct. Enforcing timeouts ensures socket operations abort quickly on dead hosts, speeding up scanning loops.'
            },
            {
              text: 'Set socket connections to use infinity loops.',
              score: 30,
              rationale: 'Incorrect. Loops without exit parameters or timeout controls will hang indefinitely, halting scanners.'
            }
          ]
        },
        challenge: {
          title: 'Custom Socket Analyzer',
          brief: 'Write and compile an inline socket probe targeting port 80 on 10.10.1.20, extracting the python scan flag.',
          objectives: [
            { id: 'write-socket', text: 'Initialize python socket connection script', isCompleted: false },
            { id: 'extract-py-flag', text: 'Exfiltrate key verification flag', isCompleted: false }
          ],
          hints: [
            'Use python3 -c with socket module.',
            'Connect to port 80 and print results.'
          ],
          successFlag: 'FLAG{PYTHON_SOCKET_DEV_SUCCESS}'
        },
        realIncidentMatch: {
          name: 'The Mirai Botnet Scanner Phase',
          historicalContext: 'In 2016, the Mirai botnet scanned millions of IoT nodes globally utilizing highly optimized, lightweight C and Python scanning scripts that probed Telnet ports (23) to inject factory credentials.',
          attackChain: [
            {
              phase: 'reconnaissance',
              name: 'IoT Telnet Sweeps',
              desc: 'Rogue scripts sweep IPv4 blocks targeting vulnerable socket links.',
              logOutput: 'Socket: 192.168.1.10:23. Status: Connected. Attempting auth: root/root -> Success.',
              discoveries: ['Compromised thousands of network devices.']
            }
          ],
          techniques: ['T1046 - Network Scanning', 'T1110 - Brute Force'],
          defensiveLessons: [
            'Enforce perimeter firewall rules that block inbound sweeps.',
            'Disable legacy administrative protocols like Telnet globally.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'In Python\'s socket API, what integer value does the connect_ex() method return when a TCP connection is successfully established?',
              options: [
                '1',
                '0',
                '-1',
                'None'
              ],
              correctAnswer: '0',
              explanation: 'The connect_ex() function wraps connect(), but instead of raising exceptions, it returns the standard C socket error code (0 indicates success; any positive integer indicates a system error code).'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'conn_rate_limit',
              title: 'Implement Network Connection Rate Limiting',
              desc: 'Enforces socket connection limits using security configurations.',
              logs: 'iptables -A INPUT -p tcp --syn -m connlimit --connlimit-above 10 -j REJECT'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'ctf',
    name: 'CTF / PRACTICAL SKILLS',
    icon: Award,
    color: 'from-purple-600 to-pink-500',
    skills: [
      {
        id: 'ctf-multistage',
        name: 'Multi-Stage Attack Chains',
        difficulty: 'Expert',
        estTime: '30 mins',
        theory: {
          what: 'Multi-Stage Attack Chains mimic advanced persistent threats (APTs) by linking multiple individual security vulnerabilities (Recon $\rightarrow$ Web Exploit $\rightarrow$ Local Privilege Escalation) into a cohesive infiltration chain.',
          why: 'Simulates comprehensive real-world breach paths, showing how minor misconfigurations can escalate into complete network compromises.',
          how: 'Executes port scanning, exploits a web application (SQLi) to recover local credentials, logs in via SSH, and abuses system configurations (SUID) to acquire root access.',
          defenderView: 'Cohesive, sequential event logs showing perimeter scans followed immediately by web database syntax errors and root-level sudo transitions.',
          mistakes: 'Securing only web parameters while leaving local system executables misconfigured.',
          detection: 'Correlate perimeter and endpoint audits to spot progressive lateral jumps.',
          mitigation: 'Implement Defense-in-Depth architectures, patch systems, and segregate networks.'
        },
        visual: {
          nodes: ['Hacker (10.10.1.5)', 'Web server (SQLi)', 'Target System (SUID)'],
          packetFlow: 'Step 1: Scan target ports ──> Step 2: Exploit SQLi on Port 80 to dump SSH credentials ──> Step 3: Login SSH on Port 22 ──> Step 4: Abuse SUID binary to acquire Root!',
          asciiArt: `
[Port Scan] ──────────> [SQL Injection on Port 80] ──────────> [Local SSH access] ──────────> [SUID Privilege Abuse]
  (Recon)                  (Initial Compromise)                (Lateral Pivot)                 (Domain Takeover!)
          `
        },
        video: {
          title: 'Chaining Perimeter Explolts for Local Privilege Takeovers',
          duration: '15:20',
          difficulty: 'Expert',
          learnOutcome: 'Chain web application vulnerabilities with unpatched system service configurations to acquire administrative shells.',
          chapters: [
            { time: '00:00', title: 'The Multi-stage Attack Cycle' },
            { time: '04:10', title: 'Phase 1: Entry Point SQLi' },
            { time: '08:45', title: 'Phase 2: Pivot & SSH Credentials' },
            { time: '12:15', title: 'Phase 3: SUID Root Takeover' }
          ]
        },
        commands: [
          {
            cmd: 'nmap -sS 10.10.1.20 && curl -X POST -d "username=\' OR 1=1 --" http://10.10.1.20/api/login && find / -perm -4000 -type f 2>/dev/null',
            purpose: 'Simulate the full, multi-stage attack chain sequentially: scan target ports, exploit Web login, and query local SUID vulnerabilities.',
            options: 'Combined sequential pipeline',
            expectedOutput: 'FLAG{APT_CHAIN_MASTER_COMPLETE}',
            discoveries: 'Completed the entire threat sequence from unauthenticated perimeter scan to root-level file sweeps.',
            mitre: 'T1548 - Abuse Privilege Escalation',
            safety: 'Only execute within sandbox environments specifically designed for multi-stage red-team chains.',
            flagsDetail: [
              { flag: 'nmap -sS', desc: 'Queries target open ports.' },
              { flag: 'curl -X POST', desc: 'Exploits web SQL database.' },
              { flag: 'find / -perm -4000', desc: 'Identifies privilege escalation opportunities.' }
            ],
            whatToLookFor: 'Verify that every link in the attack chain completes successfully before proceeding.',
            discoveryDetail: 'Chained external scanning with SQLi bypass and SUID privilege extraction.',
            whyItMatters: 'Adversaries do not rely on single vulnerabilities; they chain multiple minor misconfigurations together.',
            nextInvestigation: 'Apply complete multi-layered remediations across both web and system layers.',
            amanQuestion: 'Which security control would have halted this attack chain at the web application layer?'
          }
        ],
        tryIt: {
          steps: [
            {
              title: 'Trigger Multi-Stage Infiltration',
              description: 'Run the combined sequential red-team pipeline on the sandbox system.',
              actionText: 'Execute full attack pipeline',
              terminalCmd: 'nmap -sS 10.10.1.20 && curl -X POST -d "username=\' OR 1=1 --" http://10.10.1.20/api/login && find / -perm -4000 -type f 2>/dev/null',
              expectedResult: 'Chain executes successfully and dumps the ultimate APT master flag.'
            }
          ]
        },
        investigation: {
          caseBrief: 'The server node at 10.10.1.20 has suffered a major, multi-stage network breach. Investigate the timeline and isolate the vulnerability chains.',
          knownFacts: [
            'Compromised node is active at 10.10.1.20.',
            'Logs record external scanning followed by web server alerts and SSH logins.'
          ],
          unknownFacts: [
            'System permissions used to acquire administrative context.'
          ],
          availableAssets: ['Student Terminal (10.10.1.5)', 'Server target (10.10.1.20)'],
          objectives: [
            'Map sequential steps of the intrusion chain.',
            'Isolate and document security weaknesses at each layer.'
          ],
          rulesOfEngagement: 'Strictly utilize read-only audit logs. Do not run destructive binaries or clean up active investigation files.',
          socraticAmanPrompt: 'What security strategy ensures that even if one layer (web authentication) is compromised, the remainder of the network remains secure?',
          hypotheses: [
            {
              text: 'Implementing Defense-in-Depth, ensuring local systems (SUID) are hardened and networks are segmented.',
              score: 100,
              rationale: 'Correct. Defense-in-Depth ensures that compromising one boundary (Web) does not lead to complete system takeover.'
            },
            {
              text: 'Relying entirely on perimeter firewalls.',
              score: 30,
              rationale: 'Incorrect. If the perimeter is bypassed (e.g. via port 80/443), the absence of internal security allows full compromise.'
            }
          ]
        },
        challenge: {
          title: 'Advanced persistent Intrusion',
          brief: 'Execute the full red-team multi-stage chain sequentially on the sandbox, exfiltrating the final administrator flag.',
          objectives: [
            { id: 'recon-stage', text: 'Scan target network attributes', isCompleted: false },
            { id: 'web-stage', text: 'Exploit SQLi to exfiltrate system access keys', isCompleted: false },
            { id: 'local-stage', text: 'Abuse SUID privilege to spawn root shell', isCompleted: false }
          ],
          hints: [
            'Execute the scanning, SQL injection, and local find SUID commands sequentially.',
            'Verify all steps complete cleanly.'
          ],
          successFlag: 'FLAG{APT_CHAIN_MASTER_COMPLETE}'
        },
        realIncidentMatch: {
          name: 'The Equifax Attack Chain',
          historicalContext: 'In 2017, attackers chained a public-facing Apache Struts vulnerability with weak internal database separation and plaintext credential storage, allowing them to steal personal data of millions of users.',
          attackChain: [
            {
              phase: 'exfiltration',
              name: 'Database Exfiltration',
              desc: 'Attackers query unsegmented internal databases using compromised credentials.',
              logOutput: 'SELECT * FROM credit_data.customers LIMIT 1000000;',
              discoveries: ['Stole database profiles globally.']
            }
          ],
          techniques: ['T1190 - Exploit Public-Facing Application', 'T1078 - Valid Accounts', 'T1083 - System File Discovery'],
          defensiveLessons: [
            'Implement strict network segmentation between external web servers and internal database nodes.',
            'Encrypt sensitive database columns at rest using isolated key management.'
          ]
        },
        exam: {
          questions: [
            {
              id: 'q1',
              question: 'Which cybersecurity concept focuses on deploying multiple layered security controls to protect digital assets?',
              options: [
                'Defense-in-Depth',
                'Single Point of Failure',
                'perimeter-only security',
                'Symmetric Encryption'
              ],
              correctAnswer: 'Defense-in-Depth',
              explanation: 'Defense-in-Depth is the practice of establishing multiple independent layers of security, ensuring that if one control fails, secondary boundaries are in place to halt the attacker.'
            }
          ]
        },
        blueTeam: {
          remediations: [
            {
              id: 'multi_layer_harden',
              title: 'Implement Full Stack Hardening',
              desc: 'Applies input parameterization, removes SUID binary permissions, and configures firewalls.',
              logs: 'sudo chmod u-s /usr/local/bin/custom-suid-tool && iptables -P INPUT DROP'
            }
          ]
        }
      }
    ]
  }
];
