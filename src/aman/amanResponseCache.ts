/**
 * AMAN 4.0 Response Knowledge Cache
 * In-memory deterministic knowledge cache for frequently asked cybersecurity concepts,
 * networking protocols, terminal troubleshooting, and active lab guidance.
 * 
 * STRICT PRIVACY INVARIANT:
 * Stores ONLY educational, protocol, and concept explanations.
 * NEVER caches personal user credentials, private keys, or dynamic session state.
 */

export interface CachedResponse {
  queryKeywords: string[];
  title: string;
  response: string;
  category: 'NETWORKING' | 'LINUX' | 'WEB_SECURITY' | 'SOC' | 'METHODOLOGY' | 'TOOLS';
  suggestedAction?: {
    label: string;
    route: string;
  };
}

export class AmanResponseCache {
  private static staticStore: CachedResponse[] = [
    // -------------------------------------------------------------
    // NETWORKING PROTOCOLS
    // -------------------------------------------------------------
    {
      queryKeywords: ['explain tcp', 'what is tcp', 'tcp 3 way handshake', 'how tcp works', 'tcp protocol'],
      title: 'Transmission Control Protocol (TCP)',
      category: 'NETWORKING',
      response: `🌐 **Transmission Control Protocol (TCP)** is a reliable, connection-oriented Layer 4 transport protocol.

### Key Characteristics:
1. **Three-Way Handshake**:
   - \`SYN\` (Client $\\rightarrow$ Server): Client requests a connection with an initial sequence number ($ISN_C$).
   - \`SYN-ACK\` (Server $\\rightarrow$ Client): Server acknowledges and returns its own sequence number ($ISN_S$).
   - \`ACK\` (Client $\\rightarrow$ Server): Client acknowledges server sequence number. Connection established!
2. **Reliability Mechanisms**:
   - Packet sequencing, error-checking checksums, and retransmission of dropped packets.
   - Flow control via sliding window buffers.

### Common Ports:
- **Port 80**: HTTP | **Port 443**: HTTPS | **Port 22**: SSH | **Port 21**: FTP

*(Tip: In our Network Lab, you can capture TCP handshakes live using Wireshark filters).*`,
      suggestedAction: { label: 'Launch Network Lab', route: '/network-lab' }
    },
    {
      queryKeywords: ['explain udp', 'what is udp', 'udp protocol', 'tcp vs udp', 'user datagram protocol'],
      title: 'User Datagram Protocol (UDP)',
      category: 'NETWORKING',
      response: `⚡ **User Datagram Protocol (UDP)** is a lightweight, connectionless Layer 4 transport protocol prioritizing minimal latency over guaranteed delivery.

### Key Differences from TCP:
- **No Handshake**: Packets (datagrams) are transmitted immediately without establishing a stateful session.
- **No Retransmission**: Unacknowledged or dropped packets are discarded without recovery.
- **Low Header Overhead**: 8-byte fixed header vs. 20–60 bytes for TCP.

### Primary Use Cases:
- **DNS Queries** (Port 53), **DHCP** (Ports 67/68), **SNMP** (Port 161), **VoIP / Video Streaming**, and **Online Gaming**.`,
      suggestedAction: { label: 'Explore Network Lab', route: '/network-lab' }
    },
    {
      queryKeywords: ['explain ip', 'what is ip', 'what is an ip address', 'ipv4 vs ipv6', 'ip addressing'],
      title: 'Internet Protocol (IP) & Addressing',
      category: 'NETWORKING',
      response: `📡 **Internet Protocol (IP)** provides logical addressing and routing for data packets across Layer 3 network boundaries.

### IPv4 vs. IPv6 Comparison:
- **IPv4**: 32-bit address space ($2^{32} \\approx 4.29\\text{ billion}$ addresses), written in dotted decimal (e.g. \`192.168.1.1\`).
- **IPv6**: 128-bit address space ($2^{128}$ addresses), written in hexadecimal colon notation (e.g. \`2001:0db8:85a3::8a2e:0370:7334\`).

### Reserved Private IPv4 Ranges (RFC 1918):
- **Class A**: \`10.0.0.0/8\` (10.0.0.0 – 10.255.255.255)
- **Class B**: \`172.16.0.0/12\` (172.16.0.0 – 172.31.255.255)
- **Class C**: \`192.168.0.0/16\` (192.168.0.0 – 192.168.255.255)`,
      suggestedAction: { label: 'Open Subnetting Trainer', route: '/subnetting-trainer' }
    },
    {
      queryKeywords: ['explain dns', 'what is dns', 'domain name system', 'how dns works', 'dns record types'],
      title: 'Domain Name System (DNS)',
      category: 'NETWORKING',
      response: `🔎 **Domain Name System (DNS)** is the phonebook of the Internet, translating human-readable hostnames (e.g. \`cyberlab.local\`) into machine-routable IP addresses (e.g. \`192.168.1.50\`).

### Key DNS Record Types:
- **A Record**: Resolves hostname to IPv4 address.
- **AAAA Record**: Resolves hostname to IPv6 address.
- **CNAME**: Alias pointing one domain name to another canonical name.
- **MX Record**: Mail exchange servers.
- **TXT Record**: Arbitrary text (SPF, DKIM, verification tokens).

### Security Vulnerabilities:
- **DNS Spoofing / Cache Poisoning**: Injecting false DNS records to redirect traffic to adversary servers.
- **DNS Tunneling**: Exfiltrating encoded data via DNS TXT queries to bypass firewalls.`,
      suggestedAction: { label: 'Explore Network Lab', route: '/network-lab' }
    },
    {
      queryKeywords: ['explain http', 'explain https', 'http vs https', 'what is http', 'what is https'],
      title: 'HTTP vs. HTTPS & TLS Encryption',
      category: 'NETWORKING',
      response: `🔒 **HyperText Transfer Protocol (HTTP vs HTTPS)**:

### HTTP (Port 80):
- Plaintext, unencrypted application-layer communication.
- Subject to eavesdropping, packet sniffing, and Man-In-The-Middle (MITM) tampering.

### HTTPS (Port 443):
- HTTP layered over **Transport Layer Security (TLS 1.3)**.
- Guarantees **Confidentiality** (symmetric AES-GCM encryption), **Integrity** (HMAC/AEAD checks), and **Authentication** (X.509 certificates validated by trusted Certificate Authorities).

### Key HTTP Methods:
- \`GET\`: Retrieve resources | \`POST\`: Submit data | \`PUT\`/\`PATCH\`: Update resources | \`DELETE\`: Remove resource`,
      suggestedAction: { label: 'Open Web Security Lab', route: '/web-security' }
    },
    {
      queryKeywords: ['explain osi model', '7 layers of osi', 'what is osi', 'osi model explained', 'osi layers'],
      title: 'The 7-Layer OSI Reference Model',
      category: 'NETWORKING',
      response: `🥞 **The OSI (Open Systems Interconnection) 7-Layer Model**:

1. **Layer 7 - Application**: User interfaces & network services (HTTP, SSH, DNS, FTP).
2. **Layer 6 - Presentation**: Data formatting, encryption, and compression (TLS, JSON, ASCII).
3. **Layer 5 - Session**: Establishing, managing, and terminating communication sessions.
4. **Layer 4 - Transport**: End-to-end delivery and reliability (TCP, UDP, Ports).
5. **Layer 3 - Network**: Logical addressing, packet forwarding, and routing (IP, ICMP, Routers).
6. **Layer 2 - Data Link**: Physical MAC addressing and frame transmission (Ethernet, Switches, ARP).
7. **Layer 1 - Physical**: Electrical signals, fiber optics, cables, and bitstreams.

*(Mnemonic: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way)*`,
      suggestedAction: { label: 'Open Network Lab', route: '/network-lab' }
    },
    {
      queryKeywords: ['explain tcp ip model', 'tcp/ip model', 'tcp ip vs osi', 'what is tcp ip'],
      title: 'The TCP/IP 4-Layer Architecture',
      category: 'NETWORKING',
      response: `🌐 **The TCP/IP Protocol Suite** is the practical 4-layer architecture of the modern Internet:

1. **Application Layer**: Combines OSI Layers 5–7 (HTTP, HTTPS, SSH, DNS, SMTP).
2. **Transport Layer**: End-to-end transport (TCP, UDP).
3. **Internet Layer**: Path determination and IP packet routing (IPv4, IPv6, ICMP, ARP).
4. **Network Access (Link) Layer**: Physical transmission and Layer 2 framing (Ethernet, Wi-Fi 802.11).`,
      suggestedAction: { label: 'Open Network Lab', route: '/network-lab' }
    },
    {
      queryKeywords: ['what is subnetting', 'explain subnetting', 'cidr notation', 'how to subnet', 'subnet mask explained'],
      title: 'CIDR Subnetting & Network Partitioning',
      category: 'NETWORKING',
      response: `📐 **Subnetting** is the division of a single physical IPv4 network into multiple logical sub-networks (subnets) to improve routing performance and isolate security boundaries.

### Core Formulae:
- **Number of Subnets**: $2^s$ (where $s$ is borrowed subnet bits)
- **Total IP Addresses**: $2^{(32 - \\text{CIDR})}$
- **Usable Host Addresses**: $2^{(32 - \\text{CIDR})} - 2$ *(Subtract 2 for Network ID & Broadcast address)*

### Quick CIDR Reference:
- **/24** $\\rightarrow$ Mask: \`255.255.255.0\` $\\rightarrow$ 256 total IPs, **254 usable hosts**
- **/28** $\\rightarrow$ Mask: \`255.255.255.240\` $\\rightarrow$ 16 total IPs, **14 usable hosts**
- **/30** $\\rightarrow$ Mask: \`255.255.255.252\` $\\rightarrow$ 4 total IPs, **2 usable hosts** (Point-to-Point links)

*(Tip: Practice instant binary and CIDR math in our Subnetting Trainer!)*`,
      suggestedAction: { label: 'Open Subnetting Trainer', route: '/subnetting-trainer' }
    },
    {
      queryKeywords: ['what is arp', 'explain arp', 'arp spoofing', 'address resolution protocol'],
      title: 'Address Resolution Protocol (ARP)',
      category: 'NETWORKING',
      response: `🔄 **Address Resolution Protocol (ARP)** maps Layer 3 IP addresses to Layer 2 physical MAC addresses within a local broadcast domain.

### Operational Flow:
1. Host broadcasts \`Who has 192.168.1.1? Tell 192.168.1.100\` (\`FF:FF:FF:FF:FF:FF\`).
2. Target responds via Unicast: \`192.168.1.1 is at 00:1A:2B:3C:4D:5E\`.
3. Origin host stores mapping in local ARP cache (\`arp -a\`).

### Attack Vector:
- **ARP Poisoning / Spoofing**: Adversary sends unsolicited gratuitous ARP replies, associating the default gateway IP with their own MAC address to intercept traffic (Man-In-The-Middle).`,
      suggestedAction: { label: 'Open Network Lab', route: '/network-lab' }
    },
    {
      queryKeywords: ['common ports', 'what are ports', 'explain ports', 'well known ports', 'ports and protocols'],
      title: 'Common Well-Known Ports (0–1023)',
      category: 'NETWORKING',
      response: `🚪 **Essential Well-Known Ports & Protocols**:

- **Port 21**: FTP (File Transfer Protocol - Insecure)
- **Port 22**: SSH (Secure Shell) & SFTP
- **Port 23**: Telnet (Unencrypted remote terminal)
- **Port 25**: SMTP (Simple Mail Transfer Protocol)
- **Port 53**: DNS (Domain Name System)
- **Port 80**: HTTP (Web Traffic - Plaintext)
- **Port 110**: POP3 (Mail Retrieval)
- **Port 143**: IMAP (Mail Retrieval)
- **Port 443**: HTTPS (Encrypted TLS Web Traffic)
- **Port 445**: SMB (Server Message Block - Windows File Sharing)
- **Port 3306**: MySQL Database
- **Port 3389**: RDP (Remote Desktop Protocol)`,
      suggestedAction: { label: 'Open Network Lab', route: '/network-lab' }
    },

    // -------------------------------------------------------------
    // TOOLS: NMAP & WIRESHARK
    // -------------------------------------------------------------
    {
      queryKeywords: ['teach me nmap', 'explain nmap', 'nmap flags', 'what is nmap', 'nmap scan types', 'how to use nmap'],
      title: 'Nmap (Network Mapper) Mastery Guide',
      category: 'TOOLS',
      response: `🔍 **Nmap** is the industry standard network scanner for host discovery, port scanning, OS detection, and vulnerability audit.

### Essential Scan Flags:
- \`nmap -sS <target>\`: **SYN Stealth Scan** (Default root scan; sends SYN, receives SYN-ACK, teardowns with RST without finishing 3-way handshake).
- \`nmap -sT <target>\`: **TCP Connect Scan** (Non-root full 3-way handshake).
- \`nmap -sU <target>\`: **UDP Scan** (Scans DNS, SNMP, DHCP services).
- \`nmap -sV <target>\`: **Service Version Detection** (Probes open ports for application banners).
- \`nmap -O <target>\`: **Operating System Fingerprinting** (Analyzes TCP/IP stack behavior).
- \`nmap -p- <target>\`: Scan all 65,535 TCP ports.
- \`nmap -p 80,443,22 <target>\`: Scan specific target ports.
- \`nmap -A <target>\`: Aggressive scan (Enables OS detection, version scanning, script scanning, traceroute).
- \`nmap --script=vuln <target>\`: Runs Nmap Scripting Engine (NSE) vulnerability detection scripts.

### Recommended Lab Practice:
\`\`\`bash
# Fast initial reconnaissance scan
sudo nmap -sS -sV -T4 10.10.10.50
\`\`\``,
      suggestedAction: { label: 'Practice Nmap in Network Lab', route: '/network-lab' }
    },
    {
      queryKeywords: ['teach me wireshark', 'explain wireshark', 'what is wireshark', 'wireshark filters', 'packet analysis'],
      title: 'Wireshark & Packet Capture Analysis',
      category: 'TOOLS',
      response: `🦈 **Wireshark** is the premier GUI packet analyzer for inspecting raw network traffic in real-time.

### Useful Display Filters:
- \`ip.addr == 192.168.1.100\`: Filter traffic to/from a specific IP.
- \`tcp.port == 80 || tcp.port == 443\`: Filter HTTP and HTTPS traffic.
- \`http.request.method == "POST"\`: Inspect form submissions and logins.
- \`dns.flags.response == 0\`: View outgoing DNS resolution queries.
- \`tcp.flags.syn == 1 && tcp.flags.ack == 0\`: View initial TCP connection SYN packets (Port Scan Detection).

*(Practice capturing live packets in the Network Lab!)*`,
      suggestedAction: { label: 'Open Network Lab', route: '/network-lab' }
    },

    // -------------------------------------------------------------
    // LINUX & PERMISSIONS
    // -------------------------------------------------------------
    {
      queryKeywords: ['explain linux permissions', 'chmod explained', 'suid sgid', 'linux file permissions', 'chmod octal'],
      title: 'Linux Permissions & Octal Notation (chmod / chown)',
      category: 'LINUX',
      response: `🐧 **Linux File Permissions Model**:

### Permission Triplets (\`rwxr-xr--\`):
- **User (Owner)**: \`rwx\` (Read=4, Write=2, Execute=1) $\\rightarrow$ Total = 7
- **Group**: \`r-x\` (Read=4, Write=0, Execute=1) $\\rightarrow$ Total = 5
- **Others (World)**: \`r--\` (Read=4, Write=0, Execute=0) $\\rightarrow$ Total = 4
- Result: \`chmod 754 filename\`

### Special Permission Bits:
1. **SUID (SetUID - 4000)**: \`chmod u+s /usr/bin/tool\` $\\rightarrow$ Executes with permissions of the file owner (e.g. root).
2. **SGID (SetGID - 2000)**: \`chmod g+s /shared/dir\` $\\rightarrow$ New files inherit directory group.
3. **Sticky Bit (1000)**: \`chmod +t /tmp\` $\\rightarrow$ Only file owner can delete their files in the directory.`,
      suggestedAction: { label: 'Open Linux Lab', route: '/linux-lab' }
    },

    // -------------------------------------------------------------
    // WEB APPLICATION SECURITY (OWASP)
    // -------------------------------------------------------------
    {
      queryKeywords: ['what is sql injection', 'explain sql injection', 'sqli tutorial', 'how sql injection works'],
      title: 'SQL Injection (SQLi) - OWASP A03',
      category: 'WEB_SECURITY',
      response: `💉 **SQL Injection (SQLi)** occurs when untrusted user input is directly concatenated into a dynamic database query string, allowing an attacker to manipulate the query structure.

### Classic Authentication Bypass:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' AND password = '' OR '1'='1';
\`\`\`

### Types of SQLi:
1. **In-Band (Classic)**: Error-based and UNION-based (data returned in direct HTTP response).
2. **Blind (Inferential)**: Boolean-based and Time-based (\`SLEEP(5)\`).
3. **Out-of-Band (OOB)**: Triggering DNS or HTTP requests from the database server.

### Gold Standard Remediation:
Always use **Parameterized Queries (Prepared Statements)** or Object-Relational Mappers (ORMs).`,
      suggestedAction: { label: 'Open Web Security Lab', route: '/web-security' }
    },
    {
      queryKeywords: ['what is cross site scripting', 'explain xss', 'stored xss', 'reflected xss', 'what is xss'],
      title: 'Cross-Site Scripting (XSS) - OWASP A03',
      category: 'WEB_SECURITY',
      response: `🛡️ **Cross-Site Scripting (XSS)** is a client-side vulnerability where malicious JavaScript scripts are injected into trusted web applications and executed inside the victim's browser session.

### Three Primary Types:
1. **Reflected XSS**: Script is reflected off a web server (e.g. in search query parameters) without persistence.
2. **Stored (Persistent) XSS**: Payload is stored in a database (e.g. comments/forum posts) and delivered to all users viewing the page.
3. **DOM-Based XSS**: Vulnerability exists purely in client-side code modifying the Document Object Model (\`document.write\`, \`innerHTML\`).

### Defense:
- Context-aware output encoding (HTML, JavaScript, Attribute).
- Enforce strict **Content Security Policy (CSP)** headers.
- Set \`HttpOnly\` and \`SameSite=Strict\` flags on authentication cookies.`,
      suggestedAction: { label: 'Open Web Security Lab', route: '/web-security' }
    },
    {
      queryKeywords: ['explain csrf', 'what is csrf', 'cross site request forgery', 'how csrf works'],
      title: 'Cross-Site Request Forgery (CSRF)',
      category: 'WEB_SECURITY',
      response: `🎭 **Cross-Site Request Forgery (CSRF)** tricks an authenticated victim's browser into executing unauthorized state-changing actions (e.g. transferring funds, changing passwords) on a vulnerable web application where the user is logged in.

### Mechanism:
Adversary hosts a malicious webpage containing a forged form targeting \`https://bank.com/transfer?amount=1000&to=hacker\`. Because cookies are automatically attached by the browser, the server processes the request as legitimate.

### Defense:
1. **Anti-CSRF Synchronizer Tokens**: Unpredictable, unique tokens validated on every state-changing POST/PUT request.
2. **SameSite Cookie Attribute**: Set \`SameSite=Lax\` or \`SameSite=Strict\` on session cookies.
3. **Re-Authentication**: Require password verification for sensitive state changes.`,
      suggestedAction: { label: 'Open Web Security Lab', route: '/web-security' }
    },
    {
      queryKeywords: ['authentication vs authorization', 'auth vs authz', 'difference between auth and authz'],
      title: 'Authentication (AuthN) vs. Authorization (AuthZ)',
      category: 'METHODOLOGY',
      response: `🔑 **Authentication vs. Authorization**:

- **Authentication (AuthN)**: *"Who are you?"*
  - Verifying the declared identity of a user or system.
  - *Mechanisms*: Passwords, Biometrics, Multi-Factor Authentication (MFA), OAuth2 / OIDC tokens.

- **Authorization (AuthZ)**: *"What are you allowed to do?"*
  - Determining permissions and access rights granted to an authenticated identity.
  - *Mechanisms*: Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), Principle of Least Privilege.`,
      suggestedAction: { label: 'Open SOC Simulator', route: '/soc-simulator' }
    },

    // -------------------------------------------------------------
    // SOC, SIEM & DEFENSIVE SECURITY
    // -------------------------------------------------------------
    {
      queryKeywords: ['what is cia triad', 'explain cia triad', 'confidentiality integrity availability'],
      title: 'The CIA Triad of Information Security',
      category: 'METHODOLOGY',
      response: `🔺 **The CIA Triad** is the foundational model guiding cybersecurity policies and architectural defenses:

1. **Confidentiality**:
   - Ensuring sensitive information is inaccessible to unauthorized entities.
   - *Controls*: AES-256 encryption, access control lists (ACLs), multi-factor authentication (MFA).
2. **Integrity**:
   - Preserving the accuracy, consistency, and trustworthiness of data throughout its lifecycle.
   - *Controls*: Cryptographic hashes (SHA-256), HMACs, digital signatures, audit logging.
3. **Availability**:
   - Ensuring systems, services, and data are reliably accessible to authorized users when needed.
   - *Controls*: Redundant load balancers, RAID arrays, DDoS mitigation, disaster recovery backups.`
    },
    {
      queryKeywords: ['explain mitre attack', 'what is mitre framework', 'mitre attack framework', 'mitre tactics'],
      title: 'MITRE ATT&CK Framework',
      category: 'SOC',
      response: `🎯 **MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge)** is a curated knowledge base of real-world adversary behaviors and threat actor methodologies.

### Core Matrix Structure:
- **Tactics (The "Why")**: The adversary's technical goal (e.g. Initial Access, Privilege Escalation, Defense Evasion, Exfiltration).
- **Techniques (The "How")**: The specific method used (e.g. T1190: Exploit Public-Facing Application, T1059: Command and Scripting Interpreter).
- **Procedures**: The exact implementation used by known APT groups.`,
      suggestedAction: { label: 'Open Threat Hunting Range', route: '/threat-hunting' }
    },
    {
      queryKeywords: ['what is a soc', 'explain soc', 'soc analyst', 'security operations center'],
      title: 'Security Operations Center (SOC)',
      category: 'SOC',
      response: `🛡️ **Security Operations Center (SOC)** is the command center responsible for monitoring, detecting, analyzing, and responding to cyber incidents across an enterprise 24/7/365.

### SOC Analyst Tier Hierarchy:
- **Tier 1 (Triage Analyst)**: Monitors SIEM alert queues, filters false positives, and escalates true anomalies.
- **Tier 2 (Incident Responder)**: Deep-dive forensic investigation, endpoint containment, and threat remediation.
- **Tier 3 (Threat Hunter / SME)**: Proactive threat hunting, root-cause vulnerability analysis, and custom detection engineering.`,
      suggestedAction: { label: 'Open SOC Simulator', route: '/soc-simulator' }
    },
    {
      queryKeywords: ['explain siem', 'what is siem', 'siem tools', 'security information and event management'],
      title: 'Security Information and Event Management (SIEM)',
      category: 'SOC',
      response: `📊 **SIEM (Security Information & Event Management)** aggregates, normalizes, correlates, and analyzes security log telemetry across servers, firewalls, endpoints, and cloud services in real time.

### Core Functions:
1. **Log Aggregation & Parsing**: Ingesting Syslog, Windows Event Logs (Event IDs 4624, 4688, 4720), and audit trails.
2. **Correlation Rules**: Triggering high-fidelity alerts when multiple suspicious events chain together (e.g., 5 failed logins followed by an immediate privilege escalation).
3. **Leading SIEM Platforms**: Splunk, Microsoft Sentinel, Elastic SIEM, IBM QRadar.`,
      suggestedAction: { label: 'Open SOC Simulator', route: '/soc-simulator' }
    },
    {
      queryKeywords: ['explain firewalls', 'types of firewalls', 'what is a firewall', 'how firewalls work'],
      title: 'Firewall Technologies & Architecture',
      category: 'SOC',
      response: `🧱 **Firewalls** enforce network security policies by inspecting and controlling incoming and outgoing traffic based on predetermined rules.

### Major Firewall Types:
1. **Stateless Packet Filtering**: Inspects individual packets in isolation based on Source/Dest IP, Port, and Protocol (Layer 3/4).
2. **Stateful Inspection**: Tracks active TCP connection states in a state table (\`ESTABLISHED\`, \`RELATED\`).
3. **Next-Generation Firewall (NGFW)**: Deep Packet Inspection (DPI), Application-level awareness (Layer 7), integrated IPS, and SSL/TLS decryption.
4. **Web Application Firewall (WAF)**: Protects web servers by filtering HTTP/S payloads against SQLi, XSS, and OWASP Top 10 exploits.`,
      suggestedAction: { label: 'Open Network Lab', route: '/network-lab' }
    },

    // -------------------------------------------------------------
    // TERMINAL & LAB ERROR DIAGNOSTICS
    // -------------------------------------------------------------
    {
      queryKeywords: ['why did my lab command fail', 'command not found', 'permission denied in terminal', 'linux command error'],
      title: 'Terminal Command Troubleshooting Guide',
      category: 'LINUX',
      response: `🛠️ **Common Terminal Error Diagnostics**:

1. **\`Permission Denied\`**:
   - You attempted an operation requiring superuser privileges or modified a file owned by root.
   - *Fix*: Prefix with \`sudo\` (e.g. \`sudo nmap -sS target\`) or check file permissions with \`ls -la\`.
2. **\`Command Not Found\`**:
   - The binary is either not installed or not in your current \`$PATH\`.
   - *Fix*: Check \`echo $PATH\` or locate binary using \`which <tool>\` or \`find / -name <tool> 2>/dev/null\`.
3. **\`Address Already in Use\`**:
   - A background daemon is already bound to that port.
   - *Fix*: Find PID using \`netstat -tlpn\` or \`lsof -i :<PORT>\` and terminate it with \`kill -9 <PID>\`.`,
      suggestedAction: { label: 'Open Linux Lab', route: '/linux-lab' }
    },
    {
      queryKeywords: ['explain this error and tell me what to try next', 'diagnose this error', 'what should i try next after error'],
      title: 'Interactive Error Resolution & Next Steps',
      category: 'LINUX',
      response: `🔧 **Diagnostic & Recommended Recovery Steps**:

1. **Step 1: Check Command Syntax**:
   - Run \`<command> --help\` or \`man <command>\` to verify required positional arguments.
2. **Step 2: Inspect Network & Socket Connectivity**:
   - Test target connectivity with \`ping -c 2 <target-ip>\` or verify open port status with \`nc -zv <target-ip> <port>\`.
3. **Step 3: Check Environment & Permissions**:
   - Ensure you are working in your allocated sandbox directory (\`pwd\`) and have read/write rights (\`chmod u+w <file>\`).
4. **Step 4: Re-run with Verbose Telemetry**:
   - Add \`-v\` or \`-vv\` to your command (e.g. \`nmap -v <target>\`) to view detailed step-by-step debug output.

*(Would you like me to inspect your active lab sandbox or open the corresponding training module?)*`,
      suggestedAction: { label: 'Open Linux Lab', route: '/linux-lab' }
    },

    // -------------------------------------------------------------
    // GENERAL COMPUTER SCIENCE, CODING & FUNDAMENTALS
    // -------------------------------------------------------------
    {
      queryKeywords: ['what is recursion', 'explain recursion', 'recursion in python', 'what is recursion in python', 'how recursion works'],
      title: 'Recursion in Computer Science & Python',
      category: 'METHODOLOGY',
      response: `🔄 **Recursion** is a programming technique where a function calls itself to solve a smaller instance of the same problem.

### Core Anatomy of a Recursive Function:
1. **Base Case**: The stopping condition that prevents infinite execution and stack overflow.
2. **Recursive Step**: The logic where the function calls itself with modified arguments moving toward the base case.

### Example in Python (Factorial Calculation):
\`\`\`python
def factorial(n: int) -> int:
    # 1. Base Case: 0! = 1 and 1! = 1
    if n <= 1:
        return 1
    # 2. Recursive Step: n * (n - 1)!
    return n * factorial(n - 1)

print(factorial(5))  # Output: 120 (5 * 4 * 3 * 2 * 1)
\`\`\`

### Key Considerations:
- **Call Stack**: Every recursive call allocates a new stack frame in memory. In Python, the default recursion limit is 1,000 (\`sys.getrecursionlimit()\`).
- **Use Cases**: Tree traversals (DOM, JSON), graph search algorithms (DFS), divide-and-conquer (MergeSort, QuickSort), and backtracking.`
    },
    {
      queryKeywords: ['explain python classes', 'what is a python class', 'python oop', 'classes in python', 'python classes and objects'],
      title: 'Object-Oriented Programming & Python Classes',
      category: 'METHODOLOGY',
      response: `🐍 **Python Classes & Object-Oriented Programming (OOP)**:

A **Class** is a blueprint for creating objects (instances) encapsulating data (attributes) and behaviors (methods).

### Key Concepts & Example:
\`\`\`python
class SecurityScanner:
    # Class attribute shared across all instances
    tool_type = "Reconnaissance"

    # Constructor method (__init__) initializes instance attributes
    def __init__(self, target_ip: str, timeout: int = 5):
        self.target_ip = target_ip    # Instance attribute
        self.timeout = timeout
        self.open_ports = []

    # Instance method
    def record_port(self, port: int):
        self.open_ports.append(port)
        print(f"[+] Found open port {port} on {self.target_ip}")

# Creating an instance (object)
scanner = SecurityScanner("192.168.1.50")
scanner.record_port(80)
scanner.record_port(443)
\`\`\`

### 4 Pillars of OOP:
1. **Encapsulation**: Bundling data and methods that operate on that data within classes.
2. **Inheritance**: Creating child classes that inherit attributes/methods from a parent class (\`class WebScanner(SecurityScanner):\`).
3. **Polymorphism**: Defining methods in different classes with the same name.
4. **Abstraction**: Hiding complex internal logic behind simple public interfaces.`
    },
    {
      queryKeywords: ['what is binary', 'explain binary', 'binary number system', 'how binary works', 'binary and bits'],
      title: 'Binary Number System & Bitwise Representation',
      category: 'METHODOLOGY',
      response: `🔢 **Binary (Base-2)** is the fundamental numerical system used by digital computers, representing data exclusively using two states: **\`0\` (off/false)** and **\`1\` (on/true)**.

### How Positional Value Works:
Each digit (bit) represents a power of 2:
| $2^7$ (128) | $2^6$ (64) | $2^5$ (32) | $2^4$ (16) | $2^3$ (8) | $2^2$ (4) | $2^1$ (2) | $2^0$ (1) | Decimal Value |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | **192** |
| 1 | 0 | 1 | 0 | 1 | 0 | 0 | 0 | **168** |

### Crucial Applications in Cybersecurity:
- **IP Addressing & Subnetting**: A \`/24\` netmask is \`11111111.11111111.11111111.00000000\` (24 network bits, 8 host bits).
- **Bitwise Logic**: \`AND\`, \`OR\`, \`XOR\`, and \`NOT\` form the core of symmetric ciphers (AES, ChaCha20) and subnet mask calculations.`,
      suggestedAction: { label: 'Open Subnetting Trainer', route: '/subnetting-trainer' }
    },
    {
      queryKeywords: ['difference between linux and windows', 'linux vs windows', 'compare linux and windows', 'linux or windows'],
      title: 'Linux vs. Windows Architectural Comparison',
      category: 'LINUX',
      response: `💻 **Linux vs. Windows: Core Architectural Differences**:

| Aspect | Linux | Windows |
| :--- | :--- | :--- |
| **Kernel** | Monolithic Unix-like Kernel (Open Source) | Hybrid NT Kernel (Proprietary) |
| **Filesystem** | Single unified hierarchical tree (\`/\`, \`/etc\`, \`/var\`) | Drive-letter based (\`C:\\\`, \`D:\\\`) + NTFS |
| **Configuration** | Human-readable plaintext files (\`/etc/nginx.conf\`, \`/etc/passwd\`) | Centralized Windows Registry (\`regedit\`) |
| **Permissions** | POSIX permissions (\`rwx\`, Owner/Group/Other, SUID/SGID) | Access Control Lists (DACLs/SACLs) + Security Descriptors |
| **CLI / Shell** | Bash, Zsh, POSIX standard with piping (\`|\`) | PowerShell (Object-oriented) & Command Prompt |
| **Case Sensitivity** | Case-sensitive (\`File.txt\` $\\ne$ \`file.txt\`) | Case-insensitive |

### Why Security Professionals Prioritize Linux:
Direct control over network sockets, lightweight container virtualization (Docker/K8s), native scripting, and granular kernel-level visibility.`
    },
    {
      queryKeywords: ['what is xss', 'explain xss', 'cross site scripting', 'types of xss', 'xss vulnerability'],
      title: 'Cross-Site Scripting (XSS) - OWASP Top 10',
      category: 'WEB_SECURITY',
      response: `🛡️ **Cross-Site Scripting (XSS)** occurs when an untrusted web application includes unvalidated user input inside HTML output, executing arbitrary JavaScript in victim browsers.

### Major Types of XSS:
1. **Stored (Persistent) XSS**:
   - The malicious payload is saved in the database (e.g. comment section, profile bio) and executed whenever other users view the page.
2. **Reflected (Non-Persistent) XSS**:
   - The payload is reflected immediately off a server response via URL parameters (e.g. \`https://site.com/search?q=<script>...\`).
3. **DOM-based XSS**:
   - The vulnerability exists entirely client-side when JavaScript sinks (like \`element.innerHTML\` or \`document.write\`) process unsafe sources (\`location.hash\`).

### Defense & Remediation:
- **Context-Aware Output Encoding** (HTML entity encoding, attribute encoding).
- **Content Security Policy (CSP)** (\`default-src 'self'\`).
- Set \`HttpOnly\` flag on session cookies to prevent document.cookie exfiltration.`,
      suggestedAction: { label: 'Open Web Security Lab', route: '/web-security' }
    },
    {
      queryKeywords: ['bhai networking samjha', 'networking samjha', 'networking samjhao', 'bhai networking kya hoti hai', 'networking seekhao'],
      title: 'Networking Basics (Romanized Hinglish)',
      category: 'NETWORKING',
      response: `🌐 **Namaste! Networking ko aasan shabdon mein samjhte hain:**

Networking ka matlab hota hai do ya zyada computers ka aapas mein connect hona taaki wo data, files aur communication share kar sakein.

### 4 Most Important Concepts:
1. **IP Address (Pata)**:
   - Jaise har ghar ka ek address hota hai, waise hi internet par har device ka ek unique IP address hota hai (Jaise: \`192.168.1.1\`).
2. **Port Numbers (Darwaza)**:
   - IP address ghar hai, toh port darwaza hai. Har service ka apna port hota hai:
     - **Port 80**: HTTP (Normal Website)
     - **Port 443**: HTTPS (Secure Encrypted Website)
     - **Port 22**: SSH (Remote Linux Login)
3. **TCP vs UDP**:
   - **TCP**: Guaranteed delivery karta hai (3-way handshake ke sath). Jaise registered post.
   - **UDP**: Fast hota hai bina wait kiye (Voice calls, video streaming, DNS).
4. **Router & Switch**:
   - **Switch**: Local Network (LAN) mein devices ko connect karta hai.
   - **Router**: Do alag networks (jaise aapka home network aur Internet) ko jodata hai.

Aap chahein toh humara interactive **Network Reconnaissance Lab** khol kar Nmap commands live practice kar sakte hain!`,
      suggestedAction: { label: 'Open Network Lab', route: '/network-lab' }
    },
    {
      queryKeywords: ['ye command fail kyu ho rahi hai', 'command fail kyu ho rahi hai', 'command error kyu aaya', 'command kyu nahi chal rahi'],
      title: 'Terminal Error Diagnostic (Romanized Hinglish)',
      category: 'LINUX',
      response: `🛠️ **Terminal Command Troubleshooting (Hinglish):**

Agar aapki terminal command fail ho rahi hai, toh aamtaur par ye 3 reasons hote hain:

1. **Permission Denied (Root Rights Ki Kami)**:
   - Kuch commands (jaise \`nmap -sS\`, raw packet capture, ya system files edit karna) ke liye root permissions chahiye hoti hain.
   - **Fix**: Command ke aage \`sudo\` lagayein (Jaise: \`sudo nmap 192.168.1.1\`).
2. **Command Not Found (Binary Path Error)**:
   - Tool install nahi hai ya fir command spelling mein mistake hai.
   - **Fix**: Tool ka path check karein: \`which <command-name>\`.
3. **Wrong Syntax ya Target IP**:
   - Positional arguments galat order mein hain.
   - **Fix**: \`<command> --help\` chala kar syntax check karein.

Aap exact command mujhe batayein, main step-by-step debug karke bata dunga!`,
      suggestedAction: { label: 'Open Linux Lab', route: '/linux-lab' }
    }
  ];

  /**
   * Fast normalized query lookup with high confidence and zero false-positives
   */
  public static get(query: string): CachedResponse | null {
    const q = query.toLowerCase().trim().replace(/[?!.,;:]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!q) return null;
    
    // 1. Strict primary matching (exact match or direct prefix followed by space)
    for (const item of this.staticStore) {
      for (const kw of item.queryKeywords) {
        const normalizedKw = kw.toLowerCase().trim();
        if (q === normalizedKw || q.startsWith(normalizedKw + ' ')) {
          return item;
        }
      }
    }

    // 2. Secondary relaxed match (only for query strings longer than 5 characters to avoid false hits on short words)
    if (q.length > 5) {
      for (const item of this.staticStore) {
        for (const kw of item.queryKeywords) {
          const normalizedKw = kw.toLowerCase().trim();
          // Verify that kw is a distinct phrase inside the user query, not a sub-word
          // Escape any potential regex characters inside the keyword safely
          const escapedKw = normalizedKw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
          if (regex.test(q)) {
            return item;
          }
        }
      }
    }

    return null;
  }
}
