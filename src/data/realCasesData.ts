export interface RealCase {
  id: string;
  caseNumber: number;
  title: string;
  codename: string;
  difficulty: 'Beginner' | 'Easy' | 'Intermediate' | 'Hard' | 'Advanced';
  category: 'Linux' | 'Networking' | 'DNS' | 'Web Security' | 'System Admin' | 'Windows/AD' | 'Forensics' | 'Multi-Host' | 'Enterprise';
  estimatedTime: string;
  xpReward: number;
  unlockedLevel: number;
  background: string;
  whatYouKnow: string[];
  networkDiagram: {
    nodes: { id: string; name: string; ip: string; role: string; status: 'online' | 'compromised' | 'target' | 'gateway' }[];
    connections: string[];
  };
  availableSystems: string[];
  authorizedScope: string;
  objective: string;
  evidence: {
    type: 'log' | 'packet' | 'file' | 'config' | 'http_trace';
    title: string;
    content: string;
  }[];
  toolsAvailable: string[];
  initialClues: string[];
  hints: {
    level: 1 | 2 | 3;
    title: string;
    text: string;
    xpPenalty: number;
  }[];
  simulationEnv: {
    hostname: string;
    targetIp: string;
    user: string;
    files: Record<string, string>;
    processes?: string[];
    listeningPorts?: { port: number; proto: string; service: string; banner?: string }[];
  };
  investigationQuestions: {
    id: string;
    question: string;
    expectedAnswerType: 'text' | 'port' | 'ip' | 'choice';
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }[];
  rootCause: string;
  remediation: string[];
  defensiveLesson: string;
  
  // ADDITIVE interactive properties
  careerTrack?: 'SOC_ANALYST' | 'ETHICAL_HACKER';
  timelineEvents?: {
    time: string;
    description: string;
    isNoise: boolean;
  }[];
  decisionPoints?: {
    id: string;
    scenario: string;
    options: { id: string; text: string; isCorrect: boolean; feedback: string }[];
  }[];
}

export const REAL_CASES_DATA: RealCase[] = [
  {
    id: 'case-01',
    caseNumber: 1,
    title: 'The Unknown Server',
    codename: 'OPERATION GHOST_BOX',
    difficulty: 'Beginner',
    category: 'Linux',
    estimatedTime: '15 mins',
    xpReward: 200,
    unlockedLevel: 1,
    background: 'A newly acquired branch office of Kobayashi Logistics discovered a headless rackmount Linux server running in an unmonitored server closet. No documentation exists in the IT registry.',
    whatYouKnow: [
      'Server is booted and connected to the private subnet (10.10.20.14).',
      'You have received local terminal access as user "operator".',
      'Management wants to know the primary role and network services of this host before decommissioning.'
    ],
    networkDiagram: {
      nodes: [
        { id: 'gw', name: 'Branch Gateway', ip: '10.10.20.1', role: 'Router/Firewall', status: 'gateway' },
        { id: 'target', name: 'Unknown Server', ip: '10.10.20.14', role: 'Uncataloged Asset', status: 'target' },
        { id: 'workstation', name: 'Analyst Rig', ip: '10.10.20.100', role: 'Security Workstation', status: 'online' }
      ],
      connections: ['Analyst Rig -> Branch Gateway -> Unknown Server']
    },
    availableSystems: ['10.10.20.14 (Target Host)', '10.10.20.1 (Gateway)'],
    authorizedScope: 'Host 10.10.20.14 internal auditing and network interface inspection only.',
    objective: 'Investigate the server identity, network interfaces, and listening sockets to determine its official role.',
    evidence: [
      {
        type: 'config',
        title: '/etc/os-release & hostname',
        content: 'PRETTY_NAME="Ubuntu 22.04.4 LTS"\nNAME="Ubuntu"\nVERSION_ID="22.04"\nHOSTNAME=internal-db-legacy-backup'
      }
    ],
    toolsAvailable: ['ip', 'ss', 'uname', 'hostname', 'ps', 'cat'],
    initialClues: [
      'Clue 1: Check the hostname and network configuration using standard Linux utilities.',
      'Clue 2: Inspect listening network sockets to see if any database or web servers are bound to ports.'
    ],
    hints: [
      { level: 1, title: 'Network Socket Inspection', text: 'Run "ss -tulpn" or "ss -tuln" to view active TCP and UDP listening ports.', xpPenalty: 15 },
      { level: 2, title: 'Host Identification', text: 'Check the hostname with "hostname" and inspect IP addresses with "ip a".', xpPenalty: 30 },
      { level: 3, title: 'Service Details', text: 'Port 5432 is typically used by PostgreSQL. Check running processes with "ps aux | grep postgres".', xpPenalty: 50 }
    ],
    simulationEnv: {
      hostname: 'internal-db-legacy-backup',
      targetIp: '10.10.20.14',
      user: 'operator',
      files: {
        '/etc/motd': '=== KOBAYASHI LOGISTICS LEGACY ARCHIVE SERVER ===\nNotice: This machine handles cold PostgreSQL backups.',
        '/etc/network/interfaces': 'auto eth0\niface eth0 inet static\n  address 10.10.20.14/24\n  gateway 10.10.20.1',
        '/var/log/backup.log': '[2026-08-20 03:00:01] DB Backup completed successfully: archive_20260820.sql.gz (Size: 4.2GB)'
      },
      processes: ['systemd', 'sshd', 'postgres -D /var/lib/postgresql/data', 'cron'],
      listeningPorts: [
        { port: 22, proto: 'tcp', service: 'ssh', banner: 'OpenSSH 8.9p1' },
        { port: 5432, proto: 'tcp', service: 'postgresql', banner: 'PostgreSQL 14.9' }
      ]
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'What is the configured hostname of the mystery server?',
        expectedAnswerType: 'text',
        correctAnswer: 'internal-db-legacy-backup',
        explanation: 'The hostname command or /etc/hostname reveals the server purpose as a legacy backup database.'
      },
      {
        id: 'q2',
        question: 'Which database port is currently listening for incoming connections?',
        expectedAnswerType: 'port',
        correctAnswer: '5432',
        explanation: 'Port 5432 is the standard listening port for PostgreSQL database servers.'
      }
    ],
    rootCause: 'An uncataloged legacy PostgreSQL backup database was left running without entry in the CMDB asset management inventory.',
    remediation: [
      'Document the host IP, MAC, and role in the central NetBox CMDB.',
      'Restrict PostgreSQL listening to localhost (127.0.0.1) if remote connections are not required.',
      'Enforce firewall rules on the branch router to isolate legacy backup servers from regular workstation traffic.'
    ],
    defensiveLesson: 'Unmanaged shadow IT and forgotten legacy assets are prime targets for lateral movement because they frequently lack regular patch updates.'
  },
  {
    id: 'case-02',
    caseNumber: 2,
    title: 'The Open Port',
    codename: 'OPERATION EXPOSED_DAEMON',
    difficulty: 'Beginner',
    category: 'Networking',
    estimatedTime: '20 mins',
    xpReward: 220,
    unlockedLevel: 2,
    background: 'A security auditor noticed irregular outbound traffic from a development staging container at 10.10.30.25. Management requested an emergency port audit.',
    whatYouKnow: [
      'Target IP: 10.10.30.25',
      'The staging server is supposed to run only an HTTPS web app on port 443.',
      'Network telemetry suggests an unapproved service is accepting raw connections.'
    ],
    networkDiagram: {
      nodes: [
        { id: 'target', name: 'Dev Staging Host', ip: '10.10.30.25', role: 'Web Server', status: 'target' },
        { id: 'scanner', name: 'Security Scanner', ip: '10.10.30.100', role: 'Nmap Node', status: 'online' }
      ],
      connections: ['Security Scanner -> Dev Staging Host (Nmap SYN scan)']
    },
    availableSystems: ['10.10.30.25 (Staging Server)'],
    authorizedScope: 'Port scanning and banner grabbing on 10.10.30.25 only.',
    objective: 'Use Nmap and service detection to identify all open ports and detect the unauthorized daemon.',
    evidence: [
      {
        type: 'log',
        title: 'Firewall Alert Snippet',
        content: 'ALERT: Non-standard TCP port inbound traffic detected on host 10.10.30.25 from internal dev subnet.'
      }
    ],
    toolsAvailable: ['nmap', 'nc', 'curl'],
    initialClues: [
      'Clue 1: Run an Nmap SYN scan across all common ports (-p- or -p 1-10000).',
      'Clue 2: Use version detection (-sV) to see what software banner responds on non-standard ports.'
    ],
    hints: [
      { level: 1, title: 'Nmap Service Scan', text: 'Execute "nmap -sV -p 80,443,8080,9001 10.10.30.25".', xpPenalty: 20 },
      { level: 2, title: 'Banner Inspection', text: 'Inspect port 9001. A debug backdoor or raw shell might be bound there.', xpPenalty: 35 },
      { level: 3, title: 'Root Finding', text: 'Port 9001 is running an unauthenticated debug telnet/nc listener.', xpPenalty: 50 }
    ],
    simulationEnv: {
      hostname: 'dev-staging-02',
      targetIp: '10.10.30.25',
      user: 'auditor',
      files: {
        '/var/www/html/index.html': '<h1>Staging App v2.1</h1>'
      },
      listeningPorts: [
        { port: 80, proto: 'tcp', service: 'http', banner: 'nginx/1.24.0' },
        { port: 443, proto: 'tcp', service: 'https', banner: 'nginx/1.24.0 SSL' },
        { port: 9001, proto: 'tcp', service: 'debug-shell', banner: 'DEBUG_SHELL_V1.0_NO_AUTH_READY' }
      ]
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'Which unexpected high TCP port is open on the target?',
        expectedAnswerType: 'port',
        correctAnswer: '9001',
        explanation: 'Port 9001 was left open by developers running an unauthenticated debugging console.'
      },
      {
        id: 'q2',
        question: 'What service banner is exposed on port 9001?',
        expectedAnswerType: 'text',
        correctAnswer: 'DEBUG_SHELL_V1.0_NO_AUTH_READY',
        explanation: 'The banner exposes an insecure debug shell without authentication.'
      }
    ],
    rootCause: 'A developer deployed a troubleshooting backdoor/debug shell on port 9001 without access control or authentication.',
    remediation: [
      'Immediately terminate the process listening on port 9001 via systemctl or kill.',
      'Implement strict egress/ingress host firewall (iptables / ufw) blocking all unapproved ports.',
      'Add automated CI/CD port-scanning regression tests to prevent unauthorized listeners in staging.'
    ],
    defensiveLesson: 'Never leave developer debugging services or raw socket listeners active in environments accessible over the network.'
  },
  {
    id: 'case-03',
    caseNumber: 3,
    title: 'The Missing DNS Record',
    codename: 'OPERATION RESOLVER_DROP',
    difficulty: 'Beginner',
    category: 'DNS',
    estimatedTime: '15 mins',
    xpReward: 200,
    unlockedLevel: 3,
    background: 'Customer service agents at Apex Health report that the internal portal "portal.apexhealth.internal" is unreachable. Ping fails with "Name or service not known".',
    whatYouKnow: [
      'Local resolver IP: 10.10.10.2 (Primary DNS)',
      'Backup DNS: 10.10.10.3',
      'Target domain: portal.apexhealth.internal'
    ],
    networkDiagram: {
      nodes: [
        { id: 'client', name: 'Workstation', ip: '10.10.10.45', role: 'Client', status: 'online' },
        { id: 'dns1', name: 'Primary DNS', ip: '10.10.10.2', role: 'BIND9 Server', status: 'online' },
        { id: 'web', name: 'Portal Web Host', ip: '10.10.10.88', role: 'Web Server', status: 'online' }
      ],
      connections: ['Workstation -> Primary DNS (Port 53 UDP) -> Web Host (Port 443)']
    },
    availableSystems: ['10.10.10.45 (Local Shell)', '10.10.10.2 (DNS Server)'],
    authorizedScope: 'DNS queries and dig diagnostics within apexhealth.internal domain.',
    objective: 'Use dig and nslookup to diagnose why portal.apexhealth.internal fails to resolve and identify the correct CNAME or A record.',
    evidence: [
      {
        type: 'config',
        title: '/etc/resolv.conf',
        content: 'nameserver 10.10.10.2\nsearch apexhealth.internal'
      }
    ],
    toolsAvailable: ['dig', 'nslookup', 'ping', 'cat'],
    initialClues: [
      'Clue 1: Query the primary nameserver directly using "dig @10.10.10.2 portal.apexhealth.internal".',
      'Clue 2: Check for typos or misconfigured CNAME aliases pointing to outdated hosts.'
    ],
    hints: [
      { level: 1, title: 'Dig Syntax', text: 'Run "dig @10.10.10.2 portal.apexhealth.internal ANY" to see status NXDOMAIN vs NOERROR.', xpPenalty: 15 },
      { level: 2, title: 'CNAME Target', text: 'The CNAME points to portal-prod-old.apexhealth.internal which was decommissioned.', xpPenalty: 30 },
      { level: 3, title: 'Resolution Target', text: 'The valid web server A record is web-app-v2.apexhealth.internal at 10.10.10.88.', xpPenalty: 45 }
    ],
    simulationEnv: {
      hostname: 'analyst-node',
      targetIp: '10.10.10.2',
      user: 'student',
      files: {
        '/etc/resolv.conf': 'nameserver 10.10.10.2\nsearch apexhealth.internal'
      },
      listeningPorts: []
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'What DNS response code is returned when querying portal.apexhealth.internal directly?',
        expectedAnswerType: 'choice',
        options: ['NOERROR', 'NXDOMAIN', 'SERVFAIL', 'REFUSED'],
        correctAnswer: 'NXDOMAIN',
        explanation: 'NXDOMAIN indicates the record does not exist on the authoritative nameserver.'
      },
      {
        id: 'q2',
        question: 'What is the actual IP address of the live Portal web server (web-app-v2)?',
        expectedAnswerType: 'ip',
        correctAnswer: '10.10.10.88',
        explanation: 'Querying web-app-v2.apexhealth.internal returns the active IP 10.10.10.88.'
      }
    ],
    rootCause: 'The DNS zone file contained a stale CNAME alias pointing to a deleted host instead of the updated web-app-v2 node.',
    remediation: [
      'Update the authoritative zone record: portal.apexhealth.internal IN A 10.10.10.88.',
      'Reload BIND9 configuration with "rndc reload".',
      'Implement automated zone validation before committing DNS record updates.'
    ],
    defensiveLesson: 'Dangling DNS records and stale CNAMEs can lead to subdomain takeover attacks if pointed at external third-party cloud assets.'
  },
  {
    id: 'case-04',
    caseNumber: 4,
    title: 'The Wrong Gateway',
    codename: 'OPERATION ROUTE_BLACKHOLE',
    difficulty: 'Beginner',
    category: 'Networking',
    estimatedTime: '20 mins',
    xpReward: 220,
    unlockedLevel: 2,
    background: 'Accounting workstation WS-09 (192.168.10.45) cannot access the invoice server on the server subnet (192.168.20.10). Local network devices respond, but routed traffic is dropped.',
    whatYouKnow: [
      'Workstation IP: 192.168.10.45/24',
      'Target Server IP: 192.168.20.10/24',
      'True Subnet Gateway: 192.168.10.1'
    ],
    networkDiagram: {
      nodes: [
        { id: 'ws', name: 'Workstation WS-09', ip: '192.168.10.45', role: 'Client', status: 'target' },
        { id: 'correct_gw', name: 'VLAN Gateway', ip: '192.168.10.1', role: 'Default Gateway', status: 'gateway' },
        { id: 'server', name: 'Invoice Server', ip: '192.168.20.10', role: 'Server', status: 'online' }
      ],
      connections: ['WS-09 -> Default Gateway (192.168.10.1) -> Invoice Server (192.168.20.10)']
    },
    availableSystems: ['192.168.10.45 (Local WS)'],
    authorizedScope: 'Local route table and interface inspection on WS-09.',
    objective: 'Inspect the routing table with "ip route" or "route -n", locate the misconfigured default gateway, and identify the correct route.',
    evidence: [
      {
        type: 'config',
        title: 'ip route output',
        content: 'default via 192.168.10.254 dev eth0 proto static\n192.168.10.0/24 dev eth0 proto kernel scope link src 192.168.10.45'
      }
    ],
    toolsAvailable: ['ip', 'ping', 'traceroute', 'ss'],
    initialClues: [
      'Clue 1: Run "ip route show" to see the default gateway setting.',
      'Clue 2: Notice that the default route is pointing to .254 instead of .1.'
    ],
    hints: [
      { level: 1, title: 'Routing Check', text: 'Inspect the first line of "ip route". What IP follows "default via"?', xpPenalty: 15 },
      { level: 2, title: 'Gateway Reachability', text: 'Ping 192.168.10.254 (unresponsive) vs 192.168.10.1 (live gateway).', xpPenalty: 30 },
      { level: 3, title: 'Fix Syntax', text: 'The correct command is "ip route replace default via 192.168.10.1".', xpPenalty: 45 }
    ],
    simulationEnv: {
      hostname: 'ws-accounting-09',
      targetIp: '192.168.10.45',
      user: 'admin',
      files: {
        '/etc/netplan/01-netcfg.yaml': 'network:\n  version: 2\n  ethernets:\n    eth0:\n      addresses: [192.168.10.45/24]\n      gateway4: 192.168.10.254 # TYPO HERE'
      }
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'Which incorrect IP address was set as the default gateway?',
        expectedAnswerType: 'ip',
        correctAnswer: '192.168.10.254',
        explanation: 'The static configuration incorrectly pointed to .254 instead of .1.'
      },
      {
        id: 'q2',
        question: 'What is the correct gateway IP address for this subnet?',
        expectedAnswerType: 'ip',
        correctAnswer: '192.168.10.1',
        explanation: '192.168.10.1 is the active router interface for the accounting VLAN.'
      }
    ],
    rootCause: 'Static IP configuration had a typographical error setting the default gateway to .254 instead of .1.',
    remediation: [
      'Update the Netplan/interface configuration to set gateway to 192.168.10.1.',
      'Switch client workstations to DHCP with Option 3 (Router) rather than error-prone manual static assignments.'
    ],
    defensiveLesson: 'Incorrect gateway assignments create blackhole routing and break logging pipelines back to central SIEM servers.'
  },
  {
    id: 'case-05',
    caseNumber: 5,
    title: 'The Subnet Mistake',
    codename: 'OPERATION MASK_MISMATCH',
    difficulty: 'Beginner',
    category: 'Networking',
    estimatedTime: '20 mins',
    xpReward: 220,
    unlockedLevel: 2,
    background: 'Two engineers in the robotics lab cannot establish peer-to-peer telemetry between Machine A (10.0.1.50) and Machine B (10.0.2.50). The network planner claimed both belong to a single /23 subnet.',
    whatYouKnow: [
      'Machine A: 10.0.1.50 with mask 255.255.255.0 (/24)',
      'Machine B: 10.0.2.50 with mask 255.255.254.0 (/23)',
      'Intended subnet: 10.0.0.0/23 (Range 10.0.0.1 to 10.0.1.254)'
    ],
    networkDiagram: {
      nodes: [
        { id: 'nodeA', name: 'Machine A', ip: '10.0.1.50/24', role: 'Telemetry Node', status: 'target' },
        { id: 'nodeB', name: 'Machine B', ip: '10.0.2.50/23', role: 'Controller Node', status: 'online' }
      ],
      connections: ['Machine A (Mask Mismatch) <---> Machine B (Out of /23 Range)']
    },
    availableSystems: ['Machine A (10.0.1.50)', 'Machine B (10.0.2.50)'],
    authorizedScope: 'Subnet calculations and interface netmask audits.',
    objective: 'Determine why Machine B is outside the valid /23 boundary of 10.0.0.0/23 and fix the IP/mask.',
    evidence: [
      {
        type: 'config',
        title: 'Subnet Calculation Breakdown',
        content: 'Subnet: 10.0.0.0/23\nMask: 255.255.254.0\nUsable Host Range: 10.0.0.1 - 10.0.1.254\nBroadcast: 10.0.1.255\nMachine B Address: 10.0.2.50 (Falls into 10.0.2.0/23!)'
      }
    ],
    toolsAvailable: ['ip', 'ping', 'traceroute'],
    initialClues: [
      'Clue 1: Calculate the host range for 10.0.0.0/23.',
      'Clue 2: Notice that 10.0.2.50 is outside the 10.0.0.0/23 boundary.'
    ],
    hints: [
      { level: 1, title: 'CIDR Math', text: 'A /23 block spans 2 class C blocks (512 total addresses, 510 usable hosts).', xpPenalty: 15 },
      { level: 2, title: 'Address Boundary', text: '10.0.0.0/23 covers 10.0.0.0 through 10.0.1.255 only.', xpPenalty: 30 },
      { level: 3, title: 'Resolution', text: 'Machine B must be re-addressed into the 10.0.0.1-10.0.1.254 range (e.g. 10.0.0.50/23).', xpPenalty: 45 }
    ],
    simulationEnv: {
      hostname: 'robotics-rig-a',
      targetIp: '10.0.1.50',
      user: 'engineer',
      files: {
        '/etc/network/interfaces': 'iface eth0 inet static\naddress 10.0.1.50\nnetmask 255.255.254.0'
      }
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'What is the broadcast address for the 10.0.0.0/23 network?',
        expectedAnswerType: 'ip',
        correctAnswer: '10.0.1.255',
        explanation: 'A /23 mask on 10.0.0.0 gives host addresses 10.0.0.1 to 10.0.1.254 and broadcast 10.0.1.255.'
      },
      {
        id: 'q2',
        question: 'Why could Machine A not reach 10.0.2.50 locally?',
        expectedAnswerType: 'choice',
        options: ['10.0.2.50 is on a different subnet', 'Machine B firewall was active', 'DNS failed', 'Cable unplugged'],
        correctAnswer: '10.0.2.50 is on a different subnet',
        explanation: '10.0.2.50 belongs to the separate network 10.0.2.0/23.'
      }
    ],
    rootCause: 'Machine B was assigned an IP address outside the /23 subnet boundary, requiring a router hop that did not exist.',
    remediation: [
      'Re-address Machine B to an available host IP in the 10.0.0.0/23 pool (e.g. 10.0.0.51/23).',
      'Ensure both machines share the identical subnet mask 255.255.254.0.'
    ],
    defensiveLesson: 'Subnet misconfigurations frequently lead administrators to mistakenly disable host firewalls in futile troubleshooting attempts.'
  },
  {
    id: 'case-06',
    caseNumber: 6,
    title: 'The Slow Connection',
    codename: 'OPERATION SYN_STORM',
    difficulty: 'Beginner',
    category: 'Networking',
    estimatedTime: '20 mins',
    xpReward: 230,
    unlockedLevel: 2,
    background: 'Users complain that SSH and HTTP connections to the internal file server take 45 seconds to establish or frequently time out during peak hours.',
    whatYouKnow: [
      'File server: 10.10.15.5',
      'CPU and RAM usage on the server are normal (<15%).',
      'Network sockets show a massive backlog in SYN_RECV state.'
    ],
    networkDiagram: {
      nodes: [
        { id: 'attacker', name: 'Rogue Workstation', ip: '10.10.15.220', role: 'Flooder', status: 'compromised' },
        { id: 'server', name: 'File Server', ip: '10.10.15.5', role: 'Target', status: 'target' }
      ],
      connections: ['Rogue Workstation (Spoofed TCP SYN packets) ----> File Server Port 80']
    },
    availableSystems: ['10.10.15.5 (File Server)'],
    authorizedScope: 'Socket statistics and TCP connection state analysis.',
    objective: 'Use ss to inspect socket states and diagnose the TCP SYN backlog exhaustion.',
    evidence: [
      {
        type: 'log',
        title: 'ss -s output',
        content: 'TCP: 2450 (estab 8, closed 0, orphaned 0, timewait 12)\nTCP SYN-RECV: 2420 connections pending ack.'
      }
    ],
    toolsAvailable: ['ss', 'netstat', 'ip', 'dmesg'],
    initialClues: [
      'Clue 1: Run "ss -tan state syn-recv" to check pending half-open TCP connections.',
      'Clue 2: Check dmesg for "TCP: Possible SYN flooding on port 80. Sending cookies."'
    ],
    hints: [
      { level: 1, title: 'Socket States', text: 'Run "ss -t state syn-recv" to view half-open connections.', xpPenalty: 15 },
      { level: 2, title: 'SYN Flood Symptom', text: 'When SYN cookies are disabled, a SYN backlog fills the queue and drops legitimate SYNs.', xpPenalty: 30 },
      { level: 3, title: 'Kernel Sysctl', text: 'Check "sysctl net.ipv4.tcp_syncookies" and "net.ipv4.tcp_max_syn_backlog".', xpPenalty: 45 }
    ],
    simulationEnv: {
      hostname: 'fileserver-01',
      targetIp: '10.10.15.5',
      user: 'sysadmin',
      files: {
        '/proc/sys/net/ipv4/tcp_syncookies': '0\n'
      },
      listeningPorts: [
        { port: 22, proto: 'tcp', service: 'ssh' },
        { port: 80, proto: 'tcp', service: 'http' }
      ]
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'What TCP state were thousands of pending connections stuck in?',
        expectedAnswerType: 'choice',
        options: ['ESTABLISHED', 'SYN-RECV', 'TIME-WAIT', 'CLOSE-WAIT'],
        correctAnswer: 'SYN-RECV',
        explanation: 'SYN-RECV indicates the server sent a SYN-ACK but never received the final ACK from the client.'
      },
      {
        id: 'q2',
        question: 'What Linux kernel security feature was disabled (set to 0)?',
        expectedAnswerType: 'text',
        correctAnswer: 'tcp_syncookies',
        explanation: 'net.ipv4.tcp_syncookies was set to 0, leaving the server vulnerable to connection table exhaustion.'
      }
    ],
    rootCause: 'TCP SYN flood attack exhausted the server connection queue because TCP SYN cookies were disabled in sysctl configuration.',
    remediation: [
      'Enable SYN cookies: sysctl -w net.ipv4.tcp_syncookies=1 and persist in /etc/sysctl.conf.',
      'Increase tcp_max_syn_backlog to 4096.',
      'Deploy rate-limiting on the perimeter firewall (iptables -m limit --limit 25/minute).'
    ],
    defensiveLesson: 'Always ensure kernel hardening protections like TCP SYN cookies and reverse path filtering (rp_filter) are enabled on production systems.'
  },
  {
    id: 'case-07',
    caseNumber: 7,
    title: 'The Hidden File',
    codename: 'OPERATION STEALTH_DOT',
    difficulty: 'Beginner',
    category: 'Linux',
    estimatedTime: '15 mins',
    xpReward: 200,
    unlockedLevel: 1,
    background: 'A junior employee accidentally downloaded a malicious archive onto a shared marketing workstation. The file disappeared from the graphical file manager, but disk space remains consumed.',
    whatYouKnow: [
      'Host: workstation-mktg-03',
      'Suspicious file was extracted somewhere under /home/designer or /tmp.',
      'Hidden files in Linux begin with a leading dot (.)'
    ],
    networkDiagram: {
      nodes: [
        { id: 'ws', name: 'Marketing Workstation', ip: '10.10.50.12', role: 'Target', status: 'target' }
      ],
      connections: []
    },
    availableSystems: ['10.10.50.12 (Local Terminal)'],
    authorizedScope: 'Filesystem search within /home and /tmp.',
    objective: 'Use "ls -la" and "find" to locate hidden directories and extract the concealed credential dump artifact.',
    evidence: [
      {
        type: 'file',
        title: 'Hidden Directory Artifact',
        content: 'Path: /home/designer/.cache/.hidden_stage/payload.sh'
      }
    ],
    toolsAvailable: ['ls', 'find', 'cat', 'file', 'stat'],
    initialClues: [
      'Clue 1: Use "ls -la" or "find /home/designer -name \'.*\'" to find hidden files.',
      'Clue 2: Look inside nested hidden directories like .cache or .config.'
    ],
    hints: [
      { level: 1, title: 'Find Hidden Files', text: 'Run "find /home/designer -name \'.*\' -ls".', xpPenalty: 15 },
      { level: 2, title: 'Deep Path', text: 'Check /home/designer/.cache/.hidden_stage/.', xpPenalty: 30 },
      { level: 3, title: 'Inspect Payload', text: 'Run "cat /home/designer/.cache/.hidden_stage/exfil.txt" to find the extracted flag.', xpPenalty: 45 }
    ],
    simulationEnv: {
      hostname: 'workstation-mktg-03',
      targetIp: '10.10.50.12',
      user: 'designer',
      files: {
        '/home/designer/.cache/.hidden_stage/exfil.txt': 'FLAG{HIDDEN_DOT_DIRECTORY_FOUND_9812}\nStaged Database Keys:\nAWS_SECRET_KEY=AKIA_STAGED_TEMP_KEY',
        '/home/designer/.bash_history': 'tar -xvf update.tar.gz\nrm update.tar.gz'
      }
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'What is the full path of the hidden directory where the payload was stored?',
        expectedAnswerType: 'text',
        correctAnswer: '/home/designer/.cache/.hidden_stage',
        explanation: 'The attacker nested a dot-directory inside the standard user .cache folder.'
      },
      {
        id: 'q2',
        question: 'What flag string was recovered inside exfil.txt?',
        expectedAnswerType: 'text',
        correctAnswer: 'FLAG{HIDDEN_DOT_DIRECTORY_FOUND_9812}',
        explanation: 'Recovered directly from the staged text file.'
      }
    ],
    rootCause: 'Malware extracted into a hidden nested dot directory (.hidden_stage) to avoid detection by standard file browsers.',
    remediation: [
      'Remove unauthorized directories in /home/designer/.cache/.',
      'Deploy file integrity monitoring (AIDE / Tripwire / Wazuh) on user profile directories.'
    ],
    defensiveLesson: 'Standard graphical file managers hide dotfiles by default. Incident responders must always use "ls -la" or automated EDR file tracking.'
  },
  {
    id: 'case-08',
    caseNumber: 8,
    title: 'The Permission Problem',
    codename: 'OPERATION SUID_DRIFT',
    difficulty: 'Beginner',
    category: 'System Admin',
    estimatedTime: '20 mins',
    xpReward: 220,
    unlockedLevel: 1,
    background: 'The automated web server backup script fails every night with "Permission Denied" when trying to read the database configuration file.',
    whatYouKnow: [
      'Service account: backup_svc (UID 1002, GID 1002)',
      'Config file: /etc/webapp/database.conf',
      'Target permissions: file is owned by root:root with mode 0600 (-rw-------)'
    ],
    networkDiagram: {
      nodes: [
        { id: 'server', name: 'Web Server Node', ip: '10.10.40.10', role: 'Target', status: 'target' }
      ],
      connections: []
    },
    availableSystems: ['10.10.40.10 (Local Shell)'],
    authorizedScope: 'File permissions, groups, and ACLs on /etc/webapp.',
    objective: 'Investigate file ownership with "ls -l" and recommend the secure group and chmod permissions for backup_svc.',
    evidence: [
      {
        type: 'config',
        title: 'ls -l /etc/webapp',
        content: '-rw------- 1 root root 240 Aug 15 10:00 database.conf\ndrwxr-xr-x 2 root root 4096 Aug 15 10:00 backups'
      }
    ],
    toolsAvailable: ['ls', 'id', 'groups', 'chmod', 'chown'],
    initialClues: [
      'Clue 1: Check the ownership and octal permissions of /etc/webapp/database.conf.',
      'Clue 2: Check which groups user "backup_svc" belongs to using "id backup_svc".'
    ],
    hints: [
      { level: 1, title: 'Permission Mode', text: '0600 allows ONLY the owner (root) to read and write.', xpPenalty: 15 },
      { level: 2, title: 'Group Assignment', text: 'Create or use group "webapp-readers" or "backup_svc" and assign group read (0640).', xpPenalty: 30 },
      { level: 3, title: 'Secure Fix', text: 'Run "chown root:backup_svc /etc/webapp/database.conf" and "chmod 640 /etc/webapp/database.conf".', xpPenalty: 45 }
    ],
    simulationEnv: {
      hostname: 'web-prod-01',
      targetIp: '10.10.40.10',
      user: 'sysadmin',
      files: {
        '/etc/webapp/database.conf': 'DB_HOST=127.0.0.1\nDB_USER=app_user\nDB_PASS=S3cur3P@ssw0rd2026',
        '/etc/group': 'root:x:0:\nbackup_svc:x:1002:backup_svc'
      }
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'What was the exact numerical permission mode of database.conf causing the failure?',
        expectedAnswerType: 'text',
        correctAnswer: '600',
        explanation: 'Mode 600 (-rw-------) prevents non-root accounts like backup_svc from reading the file.'
      },
      {
        id: 'q2',
        question: 'What is the least-privilege permission mode to allow group reading while denying others?',
        expectedAnswerType: 'text',
        correctAnswer: '640',
        explanation: 'Mode 640 (-rw-r-----) gives read/write to owner, read-only to group, and zero access to world.'
      }
    ],
    rootCause: 'Strict root-only permissions (600) blocked the dedicated backup service account from reading database credentials.',
    remediation: [
      'Change group ownership to backup_svc: chown root:backup_svc /etc/webapp/database.conf.',
      'Grant group read permission: chmod 640 /etc/webapp/database.conf.',
      'Do NOT set mode 777 or world-readable permissions (644) on sensitive credential files.'
    ],
    defensiveLesson: 'Principle of Least Privilege: Service accounts should receive only the exact permissions needed via targeted POSIX groups or Linux ACLs.'
  },
  {
    id: 'case-09',
    caseNumber: 9,
    title: 'The Suspicious Process',
    codename: 'OPERATION CPU_DRAIN',
    difficulty: 'Beginner',
    category: 'System Admin',
    estimatedTime: '20 mins',
    xpReward: 220,
    unlockedLevel: 1,
    background: 'Cloud monitoring triggered a high CPU alert on a customer portal backend. An unknown binary running from /tmp is utilizing 98% CPU.',
    whatYouKnow: [
      'Host: portal-backend-04',
      'Process is named "kworker_sys" to disguise itself as a Linux kernel worker.',
      'Execution path points to /tmp/.miner/xmrig.'
    ],
    networkDiagram: {
      nodes: [
        { id: 'server', name: 'Portal Backend', ip: '10.10.60.8', role: 'Target', status: 'compromised' },
        { id: 'pool', name: 'Cryptocurrency Pool', ip: '198.51.100.44', role: 'C2 / Mining Pool', status: 'online' }
      ],
      connections: ['Portal Backend (PID 4892) ----TCP 3333 Stratum----> Mining Pool']
    },
    availableSystems: ['10.10.60.8 (Portal Backend)'],
    authorizedScope: 'Process inspection with ps, top, lsof, and killing malicious PID.',
    objective: 'Find the PID, working directory, and network socket of the rogue process masquerading as a kernel worker.',
    evidence: [
      {
        type: 'log',
        title: 'ps aux | grep kworker',
        content: 'www-data  4892 98.2  1.4  452104 28400 ?  Sl  09:12  42:15 /tmp/.miner/kworker_sys --url=stratum+tcp://pool.minexmr.fake:3333'
      }
    ],
    toolsAvailable: ['ps', 'top', 'kill', 'ls', 'ss'],
    initialClues: [
      'Clue 1: Run "ps aux --sort=-%cpu" to identify top CPU consumers.',
      'Clue 2: Check the executable path in /proc/<PID>/exe.'
    ],
    hints: [
      { level: 1, title: 'PID Identification', text: 'PID 4892 is running under user www-data with 98% CPU.', xpPenalty: 15 },
      { level: 2, title: 'Executable Path', text: 'Real kernel workers have brackets like [kworker/0:0] and no path in /tmp.', xpPenalty: 30 },
      { level: 3, title: 'Remediation Command', text: 'Kill the process with "kill -9 4892" and remove the /tmp/.miner directory.', xpPenalty: 45 }
    ],
    simulationEnv: {
      hostname: 'portal-backend-04',
      targetIp: '10.10.60.8',
      user: 'sysadmin',
      files: {
        '/tmp/.miner/config.json': '{\n  "url": "pool.minexmr.fake:3333",\n  "user": "XMR_WALLET_UNAUTHORIZED_MINER_8812"\n}'
      },
      processes: [
        'systemd',
        'apache2 -k start',
        '/tmp/.miner/kworker_sys --url=stratum+tcp://pool.minexmr.fake:3333 (PID: 4892)'
      ]
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'What was the PID of the unauthorized cryptominer process?',
        expectedAnswerType: 'text',
        correctAnswer: '4892',
        explanation: 'ps aux shows PID 4892 consuming 98% CPU.'
      },
      {
        id: 'q2',
        question: 'Which directory was the malicious executable running from?',
        expectedAnswerType: 'text',
        correctAnswer: '/tmp/.miner',
        explanation: 'Malware frequently drops and executes from world-writable /tmp or /var/tmp directories.'
      }
    ],
    rootCause: 'An unauthenticated web vulnerability allowed the attacker to drop and execute an XMRig cryptominer in the world-writable /tmp directory.',
    remediation: [
      'Kill process 4892 immediately and purge /tmp/.miner.',
      'Mount /tmp with the "noexec,nosuid,nodev" options in /etc/fstab to prevent execution from temporary folders.',
      'Audit Apache access logs to find how the miner was originally uploaded.'
    ],
    defensiveLesson: 'Attackers frequently use process masquerading (naming binaries after kernel threads like kworker) to deceive junior analysts.'
  },
  {
    id: 'case-10',
    caseNumber: 10,
    title: 'The Strange Log',
    codename: 'OPERATION BRUTE_AUTH',
    difficulty: 'Beginner',
    category: 'System Admin',
    estimatedTime: '20 mins',
    xpReward: 230,
    unlockedLevel: 1,
    background: 'A security alert from the auth server indicates an administrative account was compromised after 4,000 failed SSH attempts in 5 minutes.',
    whatYouKnow: [
      'Authentication log: /var/log/auth.log',
      'Target user: deploy_admin',
      'Attacker IP: 198.51.100.77'
    ],
    networkDiagram: {
      nodes: [
        { id: 'attacker', name: 'Brute-Forcer', ip: '198.51.100.77', role: 'Attacker', status: 'compromised' },
        { id: 'auth_server', name: 'Auth Server', ip: '10.10.1.5', role: 'Target', status: 'target' }
      ],
      connections: ['198.51.100.77 ----SSH Port 22 Brute Force----> Auth Server (10.10.1.5)']
    },
    availableSystems: ['10.10.1.5 (Auth Server)'],
    authorizedScope: 'Log analysis of /var/log/auth.log with grep, awk, and less.',
    objective: 'Analyze the auth log, calculate the attacker IP, and locate the exact timestamp of the successful password acceptance.',
    evidence: [
      {
        type: 'log',
        title: '/var/log/auth.log snippet',
        content: 'Aug 21 04:15:02 server sshd[1204]: Failed password for deploy_admin from 198.51.100.77 port 48210 ssh2\nAug 21 04:15:03 server sshd[1205]: Failed password for deploy_admin from 198.51.100.77 port 48212 ssh2\nAug 21 04:19:42 server sshd[1890]: Accepted password for deploy_admin from 198.51.100.77 port 49102 ssh2'
      }
    ],
    toolsAvailable: ['grep', 'awk', 'less', 'cat', 'wc'],
    initialClues: [
      'Clue 1: Use "grep \'Accepted\' /var/log/auth.log" to find the moment the attacker guessed the password.',
      'Clue 2: Count failed attempts with "grep -c \'Failed password\' /var/log/auth.log".'
    ],
    hints: [
      { level: 1, title: 'Accepted Login', text: 'Search for "Accepted password" in /var/log/auth.log.', xpPenalty: 15 },
      { level: 2, title: 'Timestamp Analysis', text: 'The success occurred at Aug 21 04:19:42.', xpPenalty: 30 },
      { level: 3, title: 'Remediation Tool', text: 'Fail2ban and SSH key authentication disable brute-force attacks.', xpPenalty: 45 }
    ],
    simulationEnv: {
      hostname: 'auth-server-01',
      targetIp: '10.10.1.5',
      user: 'soc_analyst',
      files: {
        '/var/log/auth.log': 'Aug 21 04:15:01 server sshd[1201]: Failed password for deploy_admin from 198.51.100.77 port 48208\nAug 21 04:15:02 server sshd[1204]: Failed password for deploy_admin from 198.51.100.77 port 48210\nAug 21 04:19:42 server sshd[1890]: Accepted password for deploy_admin from 198.51.100.77 port 49102\nAug 21 04:19:43 server systemd-logind[450]: New session 42 of user deploy_admin.'
      }
    },
    investigationQuestions: [
      {
        id: 'q1',
        question: 'What is the external IP address that performed the brute force attack?',
        expectedAnswerType: 'ip',
        correctAnswer: '198.51.100.77',
        explanation: 'All failed and accepted SSH connections originated from 198.51.100.77.'
      },
      {
        id: 'q2',
        question: 'Which username was successfully compromised at 04:19:42?',
        expectedAnswerType: 'text',
        correctAnswer: 'deploy_admin',
        explanation: 'deploy_admin password was accepted by sshd.'
      }
    ],
    rootCause: 'SSH password authentication was enabled without rate-limiting or Fail2ban protection, allowing automated dictionary attacks.',
    remediation: [
      'Disable SSH password authentication (PasswordAuthentication no in /etc/ssh/sshd_config) and enforce SSH ed25519 public keys.',
      'Deploy Fail2ban or CrowdSec to ban IPs after 5 failed authentication attempts.',
      'Rotate the compromised deploy_admin credentials immediately across all hosts.'
    ],
    defensiveLesson: 'Never expose SSH password logins directly to the Internet. Always require public keys, MFA, or an internal VPN.'
  }
];

// Helper generator to ensure we have all 30 cases defined
const GENERATE_REMAINING_CASES = (): RealCase[] => {
  const definitions: Partial<RealCase>[] = [
    {
      caseNumber: 11,
      title: 'The Unexpected Service',
      codename: 'OPERATION GHOST_PORT',
      difficulty: 'Easy',
      category: 'Linux',
      estimatedTime: '25 mins',
      xpReward: 250,
      unlockedLevel: 4,
      background: 'A web hosting server was found listening on TCP port 2323. Port scans reveal a legacy Telnet server inadvertently enabled during an OS upgrade.',
      objective: 'Identify the daemon behind port 2323, trace its systemd unit, and disable the unencrypted protocol.',
      rootCause: 'Legacy inetd/telnetd package was installed as a dependency and automatically started on boot.',
      remediation: ['systemctl stop telnet.socket', 'systemctl disable telnet.socket', 'apt purge telnetd'],
      defensiveLesson: 'Unencrypted management protocols transmit credentials in plaintext across the local network.'
    },
    {
      caseNumber: 12,
      title: 'The DNS Investigation',
      codename: 'OPERATION POISON_CACHE',
      difficulty: 'Easy',
      category: 'DNS',
      estimatedTime: '25 mins',
      xpReward: 250,
      unlockedLevel: 4,
      background: 'Users visiting mail.corp.internal are redirected to a phishing landing page. Dig diagnostics show authoritative vs cache discrepancy.',
      objective: 'Inspect authoritative SOA, MX, and TXT records with dig +trace to detect the rogue nameserver.',
      rootCause: 'A rogue DHCP server pushed a malicious secondary DNS IP to client workstations.',
      remediation: ['Enable DHCP Snooping on switches', 'Flush local resolver cache', 'Enforce DNSSEC validation'],
      defensiveLesson: 'Always secure the local broadcast domain against rogue DHCP and ARP spoofing attacks.'
    },
    {
      caseNumber: 13,
      title: 'The Packet Trail',
      codename: 'OPERATION CLEARTEXT_CRED',
      difficulty: 'Easy',
      category: 'Networking',
      estimatedTime: '25 mins',
      xpReward: 260,
      unlockedLevel: 5,
      background: 'SOC analysts captured a suspicious PCAP from the internal finance VLAN. A legacy application transmitted plaintext basic auth tokens.',
      objective: 'Use Wireshark filters to isolate the HTTP POST stream and decode the Base64 Authorization header.',
      rootCause: 'Legacy internal web application used HTTP instead of HTTPS with Basic Authentication.',
      remediation: ['Enforce TLS 1.3 encryption', 'Deprecate HTTP Basic Auth in favor of OAuth2/OIDC with Bearer tokens'],
      defensiveLesson: 'Any plaintext traffic on internal subnets is vulnerable to packet sniffing from compromised adjacent hosts.'
    },
    {
      caseNumber: 14,
      title: 'The Web Request',
      codename: 'OPERATION HEADER_LEAK',
      difficulty: 'Easy',
      category: 'Web Security',
      estimatedTime: '25 mins',
      xpReward: 260,
      unlockedLevel: 6,
      background: 'A security crawler detected sensitive internal server architecture and debug flags leaked inside HTTP response headers.',
      objective: 'Use curl -I and Burp Suite to inspect HTTP headers and uncover leaked internal IP addresses and server versions.',
      rootCause: 'Server emitted X-Powered-By, Server, and custom X-Backend-Debug-Host headers in production.',
      remediation: ['Configure server-tokens off in Nginx/Apache', 'Strip custom debug headers via reverse proxy'],
      defensiveLesson: 'Excessive server banners provide threat actors with precise version numbers for exploit targeting.'
    },
    {
      caseNumber: 15,
      title: 'The Session Cookie',
      codename: 'OPERATION COOKIE_HIJACK',
      difficulty: 'Easy',
      category: 'Web Security',
      estimatedTime: '25 mins',
      xpReward: 270,
      unlockedLevel: 6,
      background: 'Users on an open cafeteria Wi-Fi network suffered session hijackings because authentication cookies lacked security flags.',
      objective: 'Inspect the Set-Cookie response header in Burp Suite and verify missing HttpOnly, Secure, and SameSite attributes.',
      rootCause: 'Session cookie was created without HttpOnly and Secure flags, permitting JavaScript access and cleartext transmission.',
      remediation: ['Set-Cookie: session_id=...; Secure; HttpOnly; SameSite=Strict'],
      defensiveLesson: 'HttpOnly prevents XSS theft of session identifiers; Secure ensures cookies are never transmitted over unencrypted HTTP.'
    },
    {
      caseNumber: 16,
      title: 'The Access Control Bug',
      codename: 'OPERATION BOLA_EXPLOIT',
      difficulty: 'Intermediate',
      category: 'Web Security',
      estimatedTime: '30 mins',
      xpReward: 300,
      unlockedLevel: 7,
      background: 'A customer reported viewing another user invoice by editing the ID in the URL. A classic Broken Object Level Authorization (BOLA/IDOR) vulnerability.',
      objective: 'Use Burp Suite Repeater to change the document_id parameter from 104 to 101 and inspect the unauthorized payload.',
      rootCause: 'The backend database query fetched records based purely on the supplied request ID without checking session ownership.',
      remediation: ['Verify user session identity matches resource ownership in SQL/ORM: WHERE id = :id AND user_id = :session_user_id'],
      defensiveLesson: 'Never trust client-supplied identifiers without server-side authorization checks.'
    },
    {
      caseNumber: 17,
      title: 'The Input Problem',
      codename: 'OPERATION XSS_REFLECT',
      difficulty: 'Intermediate',
      category: 'Web Security',
      estimatedTime: '30 mins',
      xpReward: 300,
      unlockedLevel: 7,
      background: 'The search query parameter on the knowledgebase portal reflects unescaped user input directly into the HTML document body.',
      objective: 'Identify the reflected script payload and implement context-aware output encoding.',
      rootCause: 'User input was concatenated directly into innerHTML without sanitization or HTML entity encoding.',
      remediation: ['Implement DOMPurify sanitization', 'Deploy a strict Content-Security-Policy (CSP) header'],
      defensiveLesson: 'All untrusted input must be sanitized and context-encoded before reflection in the DOM.'
    },
    {
      caseNumber: 18,
      title: 'The Database Error',
      codename: 'OPERATION SQL_PROBE',
      difficulty: 'Intermediate',
      category: 'Web Security',
      estimatedTime: '30 mins',
      xpReward: 320,
      unlockedLevel: 7,
      background: 'Submitting a single quote (\') in the product filter causes a verbose PostgreSQL syntax error leaking database table schemas.',
      objective: 'Analyze the SQL syntax error, identify the injection point, and replace raw concatenation with parameterized queries.',
      rootCause: 'Dynamic string concatenation was used instead of prepared statements / parameterized SQL.',
      remediation: ['Use parameterized queries ($1, $2) or an ORM with automatic escaping'],
      defensiveLesson: 'Verbose database errors must be suppressed in production and never displayed to end users.'
    },
    {
      caseNumber: 19,
      title: 'The File Upload',
      codename: 'OPERATION SHELL_DROP',
      difficulty: 'Intermediate',
      category: 'Web Security',
      estimatedTime: '35 mins',
      xpReward: 340,
      unlockedLevel: 7,
      background: 'A profile picture upload endpoint checks only the client-supplied Content-Type header rather than verifying actual file magic bytes.',
      objective: 'Inspect the upload mechanism with Burp Suite, bypass the extension filter, and recommend magic byte validation.',
      rootCause: 'File upload validated only the MIME type header supplied by the browser and stored executable scripts in the webroot.',
      remediation: ['Verify magic bytes (header signatures)', 'Store uploaded files outside webroot with randomized filenames', 'Serve uploads with Content-Disposition: attachment'],
      defensiveLesson: 'Unrestricted file uploads represent the most direct route to Remote Code Execution (RCE).'
    },
    {
      caseNumber: 20,
      title: 'The Misconfigured Server',
      codename: 'OPERATION HARDEN_DRIFT',
      difficulty: 'Intermediate',
      category: 'System Admin',
      estimatedTime: '35 mins',
      xpReward: 350,
      unlockedLevel: 8,
      background: 'A production application server has 6 unnecessary services enabled including anonymous FTP, Redis without password, and SNMP with default public community strings.',
      objective: 'Perform a comprehensive Nmap audit, prioritize vulnerabilities by CVSS, and generate a system hardening plan.',
      rootCause: 'Default package installations left management ports exposed without firewall restrictions or strong credentials.',
      remediation: ['Disable unused services with systemctl', 'Bind Redis to 127.0.0.1 with requirepass', 'Restrict SNMP to v3 with SHA/AES auth'],
      defensiveLesson: 'CIS Benchmarks and automated hardening scripts should be enforced during server provisioning.'
    },
    {
      caseNumber: 21,
      title: 'The Compromised Linux Host',
      codename: 'OPERATION CRON_BACKDOOR',
      difficulty: 'Intermediate',
      category: 'Linux',
      estimatedTime: '40 mins',
      xpReward: 380,
      unlockedLevel: 8,
      background: 'A Linux database host established periodic outbound connections to an external IP at minute 15 of every hour. Persistence is suspected.',
      objective: 'Inspect /etc/cron.*, /var/spool/cron, and systemd timers to discover and neutralize the attacker persistence mechanism.',
      rootCause: 'Attacker wrote a reverse shell one-liner into /var/spool/cron/crontabs/www-data.',
      remediation: ['Remove malicious crontab', 'Check for unauthorized SUID binaries with find / -perm -4000', 'Rotate all server credentials'],
      defensiveLesson: 'Cron jobs and systemd timers are primary persistence mechanisms on Linux systems.'
    },
    {
      caseNumber: 22,
      title: 'The Privilege Problem',
      codename: 'OPERATION SUID_ESCAPE',
      difficulty: 'Intermediate',
      category: 'Linux',
      estimatedTime: '40 mins',
      xpReward: 400,
      unlockedLevel: 8,
      background: 'A junior administrator granted SUID root permissions to /usr/bin/find so that automated log rotation could clean old files.',
      objective: 'Analyze SUID binaries with find / -perm -4000, explain the GTFOBins root escalation mechanism, and strip the SUID bit.',
      rootCause: 'SUID bit on find allows unprivileged users to execute arbitrary commands with root privileges via the -exec flag.',
      remediation: ['chmod u-s /usr/bin/find', 'Use sudoers with specific command arguments rather than SUID bits'],
      defensiveLesson: 'Never assign SUID root to interactive utilities, editors, or script interpreters.'
    },
    {
      caseNumber: 23,
      title: 'The Windows Investigation',
      codename: 'OPERATION EVENT_4624',
      difficulty: 'Intermediate',
      category: 'Windows/AD',
      estimatedTime: '40 mins',
      xpReward: 400,
      unlockedLevel: 9,
      background: 'Windows Event Viewer recorded multiple Type 10 (RemoteInteractive) and Type 3 (Network) logon events during non-business hours.',
      objective: 'Analyze Windows Security Event Logs (Event ID 4624, 4625, 4720) in PowerShell to reconstruct the intruder session.',
      rootCause: 'RDP port 3389 was forwarded directly to the Internet with weak administrative passwords.',
      remediation: ['Enforce Network Level Authentication (NLA)', 'Require VPN with MFA for all remote administrative access'],
      defensiveLesson: 'Event ID 4624 Logon Type indicates the exact access method (Type 2=Interactive, Type 3=Network/SMB, Type 10=RDP).'
    },
    {
      caseNumber: 24,
      title: 'The Domain Problem',
      codename: 'OPERATION KERBEROAST_AUDIT',
      difficulty: 'Intermediate',
      category: 'Windows/AD',
      estimatedTime: '45 mins',
      xpReward: 420,
      unlockedLevel: 9,
      background: 'An Active Directory audit revealed high-privilege service accounts using weak static passwords with Service Principal Names (SPNs) registered.',
      objective: 'Identify service accounts vulnerable to offline Kerberoasting and recommend Group Managed Service Accounts (gMSA).',
      rootCause: 'Domain admin accounts registered SPNs with RC4 encryption and 8-character passwords.',
      remediation: ['Migrate to Group Managed Service Accounts (gMSA) with 128-character auto-rotated passwords', 'Enforce AES256 for Kerberos'],
      defensiveLesson: 'Any authenticated domain user can request a TGS ticket for an SPN and attempt offline password cracking.'
    },
    {
      caseNumber: 25,
      title: 'The Network Segmentation Failure',
      codename: 'OPERATION FLAT_NET',
      difficulty: 'Intermediate',
      category: 'Networking',
      estimatedTime: '45 mins',
      xpReward: 450,
      unlockedLevel: 10,
      background: 'A compromised IoT security camera in the lobby was able to directly ping and access the SWIFT transaction database in the core banking segment.',
      objective: 'Analyze router ACLs and VLAN tags to identify the missing firewall boundary between IoT and Core zones.',
      rootCause: 'The network core switch had inter-VLAN routing enabled without firewall filtering between untrusted IoT and PCI-DSS zones.',
      remediation: ['Implement zero-trust microsegmentation', 'Deploy Next-Gen Firewalls (NGFW) between VLANs with default-deny rules'],
      defensiveLesson: 'Never trust internal IoT or guest networks. All inter-segment traffic must cross stateful firewall inspection.'
    },
    {
      caseNumber: 26,
      title: 'The Web Incident',
      codename: 'OPERATION KILLCHAIN_ALPHA',
      difficulty: 'Hard',
      category: 'Web Security',
      estimatedTime: '50 mins',
      xpReward: 500,
      unlockedLevel: 11,
      background: 'A fictional fintech startup suffered data exfiltration. The student must correlate Nmap scan logs, Apache access logs, and Burp traces to reconstruct the full killchain.',
      objective: 'Reconstruct the 4-stage kill chain: Reconnaissance -> SQLi Auth Bypass -> File Upload RCE -> Credential Dumping.',
      rootCause: 'Chained vulnerabilities: unauthenticated SQL injection bypassed login, leading to admin file upload RCE.',
      remediation: ['Remediate SQLi with prepared statements', 'Harden upload endpoints', 'Isolate database credentials in HashiCorp Vault'],
      defensiveLesson: 'Attacks rarely consist of a single vulnerability; attackers chain low-severity bugs into critical compromises.'
    },
    {
      caseNumber: 27,
      title: 'The Digital Forensics Case',
      codename: 'OPERATION TIMELINE_RECON',
      difficulty: 'Hard',
      category: 'Forensics',
      estimatedTime: '55 mins',
      xpReward: 550,
      unlockedLevel: 11,
      background: 'An executive laptop was seized following an intellectual property leak. The investigator must extract MFT timestamps, browser history, and USB insertion logs.',
      objective: 'Construct a chronologically precise incident timeline proving unauthorized USB exfiltration.',
      rootCause: 'Unauthorized USB mass storage device was plugged into the workstation and sensitive archives were copied.',
      remediation: ['Deploy Endpoint DLP to block unauthorized USB storage', 'Enforce BitLocker full-disk encryption and device control policies'],
      defensiveLesson: 'Digital forensic evidence must maintain strict chain of custody and cryptographic hash verification (SHA-256).'
    },
    {
      caseNumber: 28,
      title: 'The Multi-Host Investigation',
      codename: 'OPERATION PIVOT_TRACE',
      difficulty: 'Hard',
      category: 'Multi-Host',
      estimatedTime: '60 mins',
      xpReward: 600,
      unlockedLevel: 12,
      background: 'An intruder entered through a vulnerable public web server (Host A) and laterally moved via SSH keys to an internal database server (Host B) and file share (Host C).',
      objective: 'Track the attacker across 3 isolated lab hosts using auth logs, SSH known_hosts, and bash histories.',
      rootCause: 'Unencrypted SSH private keys stored in the web application directory enabled lateral pivot to internal databases.',
      remediation: ['Remove private keys from web servers', 'Use SSH certificates or ephemeral jump-host bastion authentication'],
      defensiveLesson: 'Lateral movement requires rapid containment: isolating the pivot host prevents full enterprise compromise.'
    },
    {
      caseNumber: 29,
      title: 'The Enterprise Security Investigation',
      codename: 'OPERATION APEX_TRIAGE',
      difficulty: 'Advanced',
      category: 'Enterprise',
      estimatedTime: '70 mins',
      xpReward: 750,
      unlockedLevel: 13,
      background: 'A full-scale enterprise compromise simulation involving AD, Linux web farms, SIEM log correlation, packet inspection, and executive report authoring.',
      objective: 'Independently formulate hypotheses, execute diagnostic commands, prove root cause, and write a formal CISO remediation report.',
      rootCause: 'Supply chain dependency compromise combined with unsegmented AD trust relationships.',
      remediation: ['Implement Software Bill of Materials (SBOM)', 'Tiered Active Directory administration (Tier 0/1/2 isolation)'],
      defensiveLesson: 'Executive incident reports must balance technical depth with business risk and clear actionable remediation roadmaps.'
    },
    {
      caseNumber: 30,
      title: 'Final Case: Nightfall',
      codename: 'OPERATION NIGHTFALL_APEX',
      difficulty: 'Advanced',
      category: 'Enterprise',
      estimatedTime: '90 mins',
      xpReward: 1000,
      unlockedLevel: 14,
      background: 'The apex capstone investigation. Nightfall Corporation experienced a silent intrusion across its hybrid infrastructure. You receive only scope, IP range, and initial symptoms. AI mentor asks questions rather than giving answers.',
      objective: 'Uncover the full intrusion lifecycle across DNS, web proxy, Linux kernel, Windows domain controller, and database vaults without step-by-step guidance.',
      rootCause: 'Multi-vector advanced persistent threat (APT) utilizing zero-day input deserialization, SUID privilege escalation, and DCSync domain extraction.',
      remediation: [
        'Complete credential revocation and AD forest password reset (krbtgt double-reset)',
        'Full rebuild of compromised Linux instances from golden immutable images',
        'Deployment of behavioral EDR with automated isolation rules across all endpoints'
      ],
      defensiveLesson: 'True cybersecurity mastery is the ability to reason methodically through ambiguous evidence, formulate hypotheses, test them safely, and defend systems against future attacks.'
    }
  ];

  return definitions.map((d, index) => {
    const caseNum = d.caseNumber || (index + 11);
    const caseId = `case-${caseNum < 10 ? '0' + caseNum : caseNum}`;
    
    return {
      id: caseId,
      caseNumber: caseNum,
      title: d.title || `Investigation Case #${caseNum}`,
      codename: d.codename || `OPERATION_CASE_${caseNum}`,
      difficulty: d.difficulty || 'Intermediate',
      category: d.category || 'System Admin',
      estimatedTime: d.estimatedTime || '30 mins',
      xpReward: d.xpReward || 300,
      unlockedLevel: d.unlockedLevel || Math.min(14, Math.floor(caseNum / 2) + 1),
      background: d.background || 'Security telemetry identified anomalies requiring forensic investigation in the safe training lab.',
      whatYouKnow: [
        `Target Host / Range: 10.10.${caseNum}.10`,
        'Safe isolated simulation environment active.',
        'Initial alerts logged in SIEM correlation dashboard.'
      ],
      networkDiagram: {
        nodes: [
          { id: 'target', name: `Target Host (${d.codename})`, ip: `10.10.${caseNum}.10`, role: 'Target Asset', status: 'target' },
          { id: 'analyst', name: 'Analyst Terminal', ip: `10.10.${caseNum}.100`, role: 'Workstation', status: 'online' }
        ],
        connections: [`Analyst Terminal -> Target Host (10.10.${caseNum}.10)`]
      },
      availableSystems: [`10.10.${caseNum}.10 (Target Host)`],
      authorizedScope: `Host 10.10.${caseNum}.10 within authorized training sandbox only.`,
      objective: d.objective || 'Investigate logs, network sockets, and file artifacts to determine root cause and defense.',
      evidence: [
        {
          type: 'log',
          title: 'System Event Log Snippet',
          content: `[ALERT] Anomaly detected on 10.10.${caseNum}.10: ${d.codename} suspicious event triggered.`
        }
      ],
      toolsAvailable: ['nmap', 'ss', 'ps', 'grep', 'curl', 'dig', 'wireshark', 'burp'],
      initialClues: [
        'Clue 1: Formulate a hypothesis before running commands.',
        'Clue 2: Check active network listeners, running processes, and recent system logs.'
      ],
      hints: [
        { level: 1, title: 'Initial Triage', text: 'Inspect listening sockets and open ports first to identify the attack surface.', xpPenalty: 20 },
        { level: 2, title: 'Log & Process Correlation', text: 'Search logs for anomalies matching the incident timeframe.', xpPenalty: 40 },
        { level: 3, title: 'Root Cause Confirmation', text: d.rootCause || 'Review configuration files and credential storage.', xpPenalty: 60 }
      ],
      simulationEnv: {
        hostname: `case-${caseNum}-node`,
        targetIp: `10.10.${caseNum}.10`,
        user: 'analyst',
        files: {
          '/var/log/syslog': `Aug 21 12:00:00 case-${caseNum}-node systemd[1]: Security audit marker: ${d.codename}`,
          '/etc/issue': `My Cyber Lab Safe Sandbox - Case ${caseNum}\n`
        },
        listeningPorts: [
          { port: 80, proto: 'tcp', service: 'http' },
          { port: 22, proto: 'tcp', service: 'ssh' }
        ]
      },
      investigationQuestions: [
        {
          id: 'q1',
          question: `What is the primary root cause identified in ${d.title}?`,
          expectedAnswerType: 'text',
          correctAnswer: d.rootCause || 'Security misconfiguration',
          explanation: d.rootCause || 'Identified through systematic evidence gathering.'
        },
        {
          id: 'q2',
          question: 'What is the top recommended defense or remediation step?',
          expectedAnswerType: 'choice',
          options: [
            d.remediation?.[0] || 'Apply patch and update configuration',
            'Disable all network logging',
            'Restart the machine without changes',
            'Allow unauthenticated access'
          ],
          correctAnswer: d.remediation?.[0] || 'Apply patch and update configuration',
          explanation: 'Implementing proper configuration hardening and patching eliminates the root flaw.'
        }
      ],
      rootCause: d.rootCause || 'Security flaw in configuration or software component.',
      remediation: d.remediation || ['Patch vulnerable components', 'Enforce least privilege', 'Monitor logs'],
      defensiveLesson: d.defensiveLesson || 'Systematic investigation and defense-in-depth ensure resilient infrastructure.'
    };
  });
};

export const ALL_30_REAL_CASES: RealCase[] = [
  ...REAL_CASES_DATA,
  ...GENERATE_REMAINING_CASES()
];
