export interface SecurityTool {
  id: string;
  name: string;
  category: 'Linux Native' | 'Recon & Scanning' | 'Packet Analysis' | 'Web Interception' | 'Network Debugging' | 'DNS & OSINT';
  unlockLevel: number;
  iconName: string;
  tagline: string;
  badge: string;
  whatIsIt: string;
  whyIsItUsed: string;
  whenShouldIUseIt: string;
  commonCommands: {
    command: string;
    description: string;
    sampleOutput: string;
    interpretation: string;
  }[];
  whatToLookFor: string[];
  whatCanGoWrong: string[];
  howDefendersDetectIt: string;
  practicalLab: {
    title: string;
    target: string;
    task: string;
    hint: string;
    expectedCommand: string;
    verificationOutput: string;
  };
  missions: {
    id: string;
    code: string;
    title: string;
    objective: string;
    xp: number;
    challengeSnippet: string;
  }[];
  caseStudy: {
    title: string;
    scenario: string;
    lesson: string;
  };
}

export const SECURITY_TOOLS_ACADEMY: SecurityTool[] = [
  {
    id: 'nmap',
    name: 'Nmap (Network Mapper)',
    category: 'Recon & Scanning',
    unlockLevel: 4,
    iconName: 'Activity',
    tagline: 'The gold standard network discovery and vulnerability scanner',
    badge: 'STAGE 4 UNLOCKED',
    whatIsIt: 'Nmap ("Network Mapper") is an open-source utility for network exploration, host discovery, port scanning, OS detection, and vulnerability audit.',
    whyIsItUsed: 'Security professionals and system administrators use Nmap to map out network topologies, discover live hosts, determine which ports and network services are running, and identify outdated software versions.',
    whenShouldIUseIt: 'During the initial reconnaissance and enumeration phase of a security assessment, or during internal network audits to verify firewall rules and detect rogue or unmanaged services.',
    commonCommands: [
      {
        command: 'nmap -sS -p- 10.10.10.5',
        description: 'SYN Stealth Scan across all 65,535 TCP ports without completing the 3-way handshake.',
        sampleOutput: `PORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n8080/tcp open  http-proxy`,
        interpretation: 'Target 10.10.10.5 is alive and exposing standard SSH, web servers, and an alternative proxy port on 8080.'
      },
      {
        command: 'nmap -sV -sC -p 22,80,8080 10.10.10.5',
        description: 'Service Version Detection and Default Safe NSE Scripts against specific discovered ports.',
        sampleOutput: `PORT     STATE SERVICE    VERSION\n22/tcp   open  ssh        OpenSSH 8.9p1 Ubuntu 3ubuntu0.1\n80/tcp   open  http       Apache httpd 2.4.52 ((Ubuntu))\n|_http-title: Internal Corporate Portal\n8080/tcp open  http-proxy Apache Tomcat 9.0.58`,
        interpretation: 'Reveals exact software versions (Apache 2.4.52, Tomcat 9.0.58), allowing you to research known CVEs and security advisories.'
      }
    ],
    whatToLookFor: [
      'Unexpected high-number open ports (e.g. 8000, 8080, 9001, 31337).',
      'Outdated software versions (e.g. OpenSSH < 7.4, Apache 2.2, vsftpd 2.3.4).',
      'Insecure cleartext protocols like Telnet (23), FTP (21), or HTTP (80) where encrypted alternatives exist.',
      'Information leakage in banners such as internal hostnames, build IDs, or PHP version headers.'
    ],
    whatCanGoWrong: [
      'Intrusive NSE scripts (-sC or --script vuln) can crash fragile legacy daemons or embedded IoT services.',
      'Fast scan rates (-T4, -T5, --min-rate 5000) can saturate network switches or trigger IDS/IPS automatic port blocks.',
      'Stateful firewalls might return false positives by responding with SYN-ACK to all port probes.'
    ],
    howDefendersDetectIt: 'Network Intrusion Detection Systems (Snort, Suricata, Zeek) detect rapid SYN packets to sequential or multiple ports from a single IP. Firewall logs show burst connection attempts to closed ports.',
    practicalLab: {
      title: 'Scan the Private Training Gateway (10.10.10.5)',
      target: '10.10.10.5',
      task: 'Execute an Nmap service scan against 10.10.10.5 to find the version of Apache and OpenSSH running.',
      hint: 'Use flags -sV -p 22,80,443',
      expectedCommand: 'nmap -sV -p 22,80,443 10.10.10.5',
      verificationOutput: '22/tcp open ssh OpenSSH 8.9p1\n80/tcp open http Apache httpd 2.4.52'
    },
    missions: [
      { id: 'nmap-01', code: 'NMAP 01', title: 'Discover the Training Host', objective: 'Use Nmap ping sweep (-sn) to locate live hosts on the 10.10.10.0/24 subnet.', xp: 100, challengeSnippet: 'nmap -sn 10.10.10.0/24' },
      { id: 'nmap-02', code: 'NMAP 02', title: 'Find Open Ports', objective: 'Scan top 1000 common ports on target 10.10.10.10.', xp: 120, challengeSnippet: 'nmap --top-ports 1000 10.10.10.10' },
      { id: 'nmap-03', code: 'NMAP 03', title: 'Identify Services', objective: 'Identify running services and protocols without full banner grabbing.', xp: 120, challengeSnippet: 'nmap -sT 10.10.10.10' },
      { id: 'nmap-04', code: 'NMAP 04', title: 'Understand Service Versions', objective: 'Perform version detection (-sV) to pinpoint exact software versions.', xp: 140, challengeSnippet: 'nmap -sV 10.10.10.10' },
      { id: 'nmap-05', code: 'NMAP 05', title: 'Interpret Scan Results', objective: 'Distinguish between Open, Closed, and Filtered port states.', xp: 140, challengeSnippet: 'nmap -p 21,22,80,443,3389 10.10.10.10' },
      { id: 'nmap-06', code: 'NMAP 06', title: 'Compare Two Training Machines', objective: 'Compare attack surfaces of Web Server A vs Database Server B.', xp: 150, challengeSnippet: 'nmap 10.10.10.10 10.10.10.20' },
      { id: 'nmap-07', code: 'NMAP 07', title: 'Map the Training Network', objective: 'Build a network topology map of all responsive subnets.', xp: 160, challengeSnippet: 'nmap -sP 10.10.10.0/24 10.10.20.0/24' },
      { id: 'nmap-08', code: 'NMAP 08', title: 'Investigate an Unknown Service', objective: 'Use Nmap Script Engine (-sC) to probe an obscure daemon on port 9001.', xp: 180, challengeSnippet: 'nmap -sC -p 9001 10.10.10.10' },
      { id: 'nmap-09', code: 'NMAP 09', title: 'Create a Basic Asset Inventory', objective: 'Export scan results to XML/Grepable format to document asset ports.', xp: 200, challengeSnippet: 'nmap -oN asset_scan.txt 10.10.10.0/24' },
      { id: 'nmap-10', code: 'NMAP 10', title: 'Nmap Investigation Challenge', objective: 'Synthesize all scanning techniques to identify an uncataloged rogue gateway.', xp: 250, challengeSnippet: 'nmap -A -T4 10.10.10.254' }
    ],
    caseStudy: {
      title: 'The Unmanaged Redis Server',
      scenario: 'An attacker ran a port scan against an enterprise IP range and discovered Redis listening on default port 6379 without a password. The attacker wrote an SSH authorized_keys file via the Redis CONFIG SET command, gaining root access.',
      lesson: 'Never leave databases bound to 0.0.0.0 without authentication. Regular Nmap internal scans catch forgotten services before threat actors do.'
    }
  },
  {
    id: 'wireshark',
    name: 'Wireshark (Packet Analysis)',
    category: 'Packet Analysis',
    unlockLevel: 5,
    iconName: 'Layers',
    tagline: 'Deep packet inspection and protocol dissecting',
    badge: 'STAGE 5 UNLOCKED',
    whatIsIt: 'Wireshark is the world\'s foremost network protocol analyzer. It captures packets flying across a network interface and lets you inspect headers and payloads at every OSI layer.',
    whyIsItUsed: 'Network engineers and cybersecurity analysts use Wireshark to troubleshoot connectivity issues, analyze suspicious network traffic, dissect malware beaconing, and extract transferred files.',
    whenShouldIUseIt: 'When investigating suspicious network traffic, debugging packet drops, analyzing malware communications, or following unencrypted session streams in PCAP recordings.',
    commonCommands: [
      {
        command: 'http.request.method == "POST"',
        description: 'Wireshark display filter isolating all HTTP POST requests (form submissions, logins, file uploads).',
        sampleOutput: `No. Time     Source       Destination  Protocol Length Info\n42  12.4102  10.10.10.45  10.10.10.5   HTTP     482    POST /api/v1/auth/login HTTP/1.1`,
        interpretation: 'Isolates client authentication attempts so you can inspect form parameters and credentials.'
      },
      {
        command: 'tcp.stream eq 3 (Follow TCP Stream)',
        description: 'Reassembles bidirectional TCP segments into a human-readable stream.',
        sampleOutput: `USER admin\r\nPASS Winter2026!\r\n230 User logged in, proceed.\r\nSTOR malware.sh\r\n150 Ok to send data.`,
        interpretation: 'Reveals cleartext FTP commands, showing the exact username, password, and uploaded filename.'
      }
    ],
    whatToLookFor: [
      'Unusual DNS queries (long subdomains indicating DNS tunneling / data exfiltration).',
      'Plaintext credentials in HTTP, FTP, Telnet, or SMTP streams.',
      'TCP Retransmissions and SYN/RST spikes indicating network drops or port scans.',
      'Beaconing intervals (regular recurring TCP connections every 30 or 60 seconds to unfamiliar external IPs).'
    ],
    whatCanGoWrong: [
      'Large PCAP files (hundreds of megabytes) can crash the analysis workstation if loaded without display filters.',
      'Encrypted protocols (TLS, SSH) cannot be read directly unless session decryption keys (SSLKEYLOGFILE) are provided.'
    ],
    howDefendersDetectIt: 'Wireshark operates in passive promiscuous mode and does not emit traffic itself. However, promiscuous mode can occasionally be detected on switches via ARP request timing.',
    practicalLab: {
      title: 'Analyze HTTP Authentication Capture',
      target: 'http_auth.pcap',
      task: 'Apply the filter "http.request" and follow TCP stream 0 to recover the submitted admin password.',
      hint: 'Right click on packet #42 -> Follow -> TCP Stream',
      expectedCommand: 'http.request.method == "POST"',
      verificationOutput: 'username=admin&password=FLAG{WIRESHARK_STREAM_UNMASKED_8812}'
    },
    missions: [
      { id: 'ws-01', code: 'WIRESHARK 01', title: 'Find the DNS Query', objective: 'Filter for DNS queries to identify which domain the infected client looked up.', xp: 120, challengeSnippet: 'dns.flags.response == 0' },
      { id: 'ws-02', code: 'WIRESHARK 02', title: 'Identify the Client', objective: 'Extract the MAC address and IP of the host requesting DHCP lease.', xp: 120, challengeSnippet: 'bootp || dhcp' },
      { id: 'ws-03', code: 'WIRESHARK 03', title: 'Follow a TCP Conversation', objective: 'Reconstruct a raw TCP conversation to extract transmitted plain text.', xp: 140, challengeSnippet: 'tcp.stream eq 2' },
      { id: 'ws-04', code: 'WIRESHARK 04', title: 'Identify HTTP Traffic', objective: 'Filter for HTTP response status 200 OK containing image or script artifacts.', xp: 150, challengeSnippet: 'http.response.code == 200' },
      { id: 'ws-05', code: 'WIRESHARK 05', title: 'Find the Suspicious Training Packet', objective: 'Locate a beaconing packet containing a base64 encoded command string.', xp: 180, challengeSnippet: 'frame contains "base64"' },
      { id: 'ws-06', code: 'WIRESHARK 06', title: 'Reconstruct a Fictional Investigation', objective: 'Synthesize packet clues to build an incident timeline of an unencrypted FTP exfiltration.', xp: 220, challengeSnippet: 'ftp || ftp-data' }
    ],
    caseStudy: {
      title: 'The Cleartext Corporate Spillage',
      scenario: 'An employee transmitted salary spreadsheets over an internal unencrypted HTTP intranet. A rogue technician captured packets on the local switch port using Wireshark and reconstructed the entire Excel document.',
      lesson: 'Always mandate HTTPS / TLS 1.3 even for internal services. Never assume internal local area networks are secure.'
    }
  },
  {
    id: 'burp-suite',
    name: 'Burp Suite (Web Interception Proxy)',
    category: 'Web Interception',
    unlockLevel: 6,
    iconName: 'Globe',
    tagline: 'Industry-standard web application security testing proxy',
    badge: 'STAGE 6 UNLOCKED',
    whatIsIt: 'Burp Suite is an integrated platform and proxy server for testing web application security. It sits between your browser and the web target, allowing you to intercept, inspect, and modify HTTP/HTTPS requests in flight.',
    whyIsItUsed: 'Web penetration testers use Burp to discover vulnerabilities such as SQL Injection, Cross-Site Scripting (XSS), IDOR / Broken Object Level Authorization, and flawed authentication workflows.',
    whenShouldIUseIt: 'When assessing web applications, REST APIs, or single-page applications for input validation flaws, authorization bugs, and business logic errors.',
    commonCommands: [
      {
        command: 'Burp Intercept ON (Proxy -> Intercept)',
        description: 'Freezes an outgoing HTTP request before it reaches the server, allowing parameter tampering.',
        sampleOutput: `GET /api/v1/user/profile?id=42 HTTP/1.1\nHost: target.app\nAuthorization: Bearer eyJhbGci...`,
        interpretation: 'You can tamper with id=42 (change to id=1) to test for Insecure Direct Object References.'
      },
      {
        command: 'Burp Repeater (Ctrl+R / Cmd+R)',
        description: 'Allows manual crafting, replaying, and rapid testing of individual HTTP requests.',
        sampleOutput: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "role": "ADMIN",\n  "flag": "FLAG{BURP_REPEATER_PARAMETER_TAMPERED}"\n}`,
        interpretation: 'Confirms that modifying the JSON body bypassed client-side role validation.'
      }
    ],
    whatToLookFor: [
      'Hidden form parameters and debug flags (e.g. is_admin=false, role=user, debug=0).',
      'Predictable numeric IDs in URL paths or parameters (e.g. /invoices/1004).',
      'Reflected user inputs in the response body without HTML entity encoding.',
      'Missing or misconfigured security headers (Content-Security-Policy, Strict-Transport-Security).'
    ],
    whatCanGoWrong: [
      'Sending too many automated requests via Intruder can trigger Web Application Firewall (WAF) IP bans or lock account credentials.',
      'Modifying CSRF tokens or session cookies incorrectly will cause the server to terminate your active session.'
    ],
    howDefendersDetectIt: 'Web Application Firewalls (WAFs) and SIEM systems look for rapid anomalous parameter tampering, SQL injection signatures, and non-standard User-Agent headers.',
    practicalLab: {
      title: 'Tamper with Employee Profile ID in Repeater',
      target: 'http://target.kobayashi.internal/api/v1/profile',
      task: 'Intercept GET /api/v1/profile?user_id=42, send to Repeater, change user_id to 1, and inspect the CEO record.',
      hint: 'Edit the user_id parameter in the top pane and click Send.',
      expectedCommand: 'GET /api/v1/profile?user_id=1 HTTP/1.1',
      verificationOutput: '{"id":1,"name":"Chief Executive Officer","role":"CEO"}'
    },
    missions: [
      { id: 'burp-01', code: 'BURP 01', title: 'Capture Your First Request', objective: 'Route browser traffic through Burp Proxy on port 8080 and inspect the HTTP GET request.', xp: 120, challengeSnippet: 'GET / HTTP/1.1' },
      { id: 'burp-02', code: 'BURP 02', title: 'Understand HTTP Parameters', objective: 'Inspect GET query parameters vs POST form-urlencoded body payloads.', xp: 140, challengeSnippet: 'POST /search HTTP/1.1' },
      { id: 'burp-03', code: 'BURP 03', title: 'Inspect Cookies', objective: 'Analyze the Set-Cookie headers for missing HttpOnly and Secure flags.', xp: 150, challengeSnippet: 'Cookie: session=xyz123' },
      { id: 'burp-04', code: 'BURP 04', title: 'Modify a Training Request', objective: 'Use Burp Repeater to change a quantity parameter to a negative number to test business logic.', xp: 160, challengeSnippet: '{"quantity": -1}' },
      { id: 'burp-05', code: 'BURP 05', title: 'Investigate Authorization', objective: 'Test for IDOR by requesting resources belonging to another tenant.', xp: 180, challengeSnippet: 'GET /api/v1/orders/1001' },
      { id: 'burp-06', code: 'BURP 06', title: 'Analyze a Vulnerable Training Endpoint', objective: 'Identify and demonstrate a reflected XSS vulnerability on a test form.', xp: 220, challengeSnippet: '<script>alert(1)</script>' }
    ],
    caseStudy: {
      title: 'The Negative Price Checkout Bug',
      scenario: 'A web shop validated prices in client-side JavaScript. A tester intercepted the checkout HTTP request in Burp Suite and changed the item price from $500 to $1, successfully receiving the order confirmation.',
      lesson: 'Never trust client-side validation. All business rules and authorization checks must be enforced strictly on the server.'
    }
  },
  {
    id: 'netcat',
    name: 'Netcat (The Swiss Army Knife)',
    category: 'Network Debugging',
    unlockLevel: 3,
    iconName: 'Terminal',
    tagline: 'Raw TCP and UDP socket read/write debugging tool',
    badge: 'STAGE 3 UNLOCKED',
    whatIsIt: 'Netcat (nc) is a versatile networking utility that reads and writes data across network connections using the TCP or UDP protocol.',
    whyIsItUsed: 'It is used for port scanning, banner grabbing, transferring files, testing firewall rules, creating reverse/bind shells for remote administration, and verifying socket listeners.',
    whenShouldIUseIt: 'When you need to manually connect to a port to view raw server responses, set up a temporary listening port, or test raw socket communications.',
    commonCommands: [
      {
        command: 'nc -zv 10.10.10.5 80',
        description: 'Zero-I/O port check to verify if port 80 is listening on 10.10.10.5.',
        sampleOutput: `Connection to 10.10.10.5 80 port [tcp/http] succeeded!`,
        interpretation: 'Confirms that TCP port 80 is reachable through all firewalls.'
      },
      {
        command: 'nc -lvnp 4444',
        description: 'Listen on local port 4444 in verbose mode without DNS resolution.',
        sampleOutput: `Listening on 0.0.0.0 4444\nConnection received on 10.10.10.25 50412`,
        interpretation: 'Creates a listening socket ready to receive debugging streams or connection probes.'
      }
    ],
    whatToLookFor: [
      'Raw service banners returned immediately upon connection (e.g. SSH-2.0-OpenSSH, 220 ProFTPD).',
      'Differences in connection timeouts indicating stateful firewall drops vs closed port RST packets.'
    ],
    whatCanGoWrong: [
      'Binding to privileged ports (< 1024) requires root / sudo privileges.',
      'Leaving unencrypted Netcat listeners running without authentication exposes raw shell access to anyone on the subnet.'
    ],
    howDefendersDetectIt: 'Endpoint Detection and Response (EDR) agents flag execution of nc / ncat with shell arguments (-e /bin/bash or -e cmd.exe) as high-severity alerts.',
    practicalLab: {
      title: 'Banner Grab the Secret Service on Port 31337',
      target: '10.10.10.5:31337',
      task: 'Connect to port 31337 with Netcat and read the service banner.',
      hint: 'Run "nc -vn 10.10.10.5 31337"',
      expectedCommand: 'nc -vn 10.10.10.5 31337',
      verificationOutput: '220 MYCYBERLAB_BANNER_FLAG{NETCAT_RAW_BANNER_CAPTURED_9918}'
    },
    missions: [
      { id: 'nc-01', code: 'NC 01', title: 'Verify Port Reachability', objective: 'Use nc -zv to check if HTTP and HTTPS ports are open.', xp: 100, challengeSnippet: 'nc -zv 10.10.10.5 80 443' },
      { id: 'nc-02', code: 'NC 02', title: 'Banner Grab an SSH Server', objective: 'Connect to port 22 and capture the OpenSSH banner.', xp: 120, challengeSnippet: 'nc 10.10.10.5 22' },
      { id: 'nc-03', code: 'NC 03', title: 'Send a Manual HTTP GET', objective: 'Pipe an HTTP request into Netcat to receive raw HTTP headers.', xp: 140, challengeSnippet: 'printf "GET / HTTP/1.0\\r\\n\\r\\n" | nc 10.10.10.5 80' },
      { id: 'nc-04', code: 'NC 04', title: 'Simulate a Socket Listener', objective: 'Create an isolated training listener on port 9999 and test client connection.', xp: 160, challengeSnippet: 'nc -lvnp 9999' }
    ],
    caseStudy: {
      title: 'The Unprotected Shell Listener',
      scenario: 'A systems administrator ran "nc -lp 8888 -e /bin/bash" to easily debug scripts from home. A malicious port scanner discovered the open port 20 minutes later and took over the server.',
      lesson: 'Never deploy unauthenticated listeners. Always use secure SSH tunnels with public key authentication.'
    }
  },
  {
    id: 'dig-dns',
    name: 'Dig & Nslookup (DNS Diagnostics)',
    category: 'DNS & OSINT',
    unlockLevel: 2,
    iconName: 'Search',
    tagline: 'DNS lookup, zone query, and record verification utilities',
    badge: 'STAGE 2 UNLOCKED',
    whatIsIt: 'Dig (Domain Information Groper) and Nslookup are command-line tools for querying Domain Name System (DNS) name servers for specific record types (A, AAAA, MX, TXT, CNAME, SOA, NS).',
    whyIsItUsed: 'Used by security researchers and sysadmins to verify DNS configuration, discover mail servers and cloud providers, detect DNS misconfigurations, and check SPF/DMARC email security records.',
    whenShouldIUseIt: 'During initial OSINT, when diagnosing domain resolution issues, or when investigating DNS spoofing and phishing infrastructure.',
    commonCommands: [
      {
        command: 'dig @10.10.10.2 mail.apexcorp.internal MX',
        description: 'Queries the specific nameserver 10.10.10.2 for the Mail Exchange (MX) records.',
        sampleOutput: `;; ANSWER SECTION:\nmail.apexcorp.internal. 300 IN MX 10 mx1.apexcorp.internal.\nmx1.apexcorp.internal.  300 IN A  10.10.10.88`,
        interpretation: 'Reveals that mail is handled by mx1.apexcorp.internal at IP 10.10.10.88.'
      },
      {
        command: 'dig apexcorp.internal TXT +short',
        description: 'Queries TXT records to inspect SPF, DKIM, and domain verification records.',
        sampleOutput: `"v=spf1 include:_spf.google.com ~all"\n"docusign-domain-verification=98124"`,
        interpretation: 'Shows the company authorized mail sender policy (SPF) and integrated SaaS providers.'
      }
    ],
    whatToLookFor: [
      'Missing SPF (~all/-all) or DMARC records allowing email spoofing.',
      'Dangling CNAME records pointing to expired cloud instances (Subdomain Takeover).',
      'Exposed internal IP addresses in public DNS records.',
      'Zone transfer vulnerabilities (AXFR) allowing a complete dump of all subdomains.'
    ],
    whatCanGoWrong: [
      'Querying public DNS resolvers (8.8.8.8) might return cached results rather than live authoritative records.',
      'Attempting full AXFR zone transfers against production nameservers is logged and flagged as reconnaissance.'
    ],
    howDefendersDetectIt: 'DNS servers log AXFR requests and rate-limit excessive iterative queries from single source IPs.',
    practicalLab: {
      title: 'Query the Authoritative Training Nameserver',
      target: '10.10.10.2',
      task: 'Query TXT records for apexcorp.internal to recover the verification flag.',
      hint: 'Run "dig @10.10.10.2 apexcorp.internal TXT"',
      expectedCommand: 'dig @10.10.10.2 apexcorp.internal TXT',
      verificationOutput: 'FLAG{DIG_DNS_RECORDS_VERIFIED_7712}'
    },
    missions: [
      { id: 'dig-01', code: 'DIG 01', title: 'Find the A Record', objective: 'Resolve hostname to IPv4 address using dig +short.', xp: 100, challengeSnippet: 'dig web.apexcorp.internal A' },
      { id: 'dig-02', code: 'DIG 02', title: 'Inspect MX Mail Servers', objective: 'Identify all primary and backup mail servers.', xp: 120, challengeSnippet: 'dig apexcorp.internal MX' },
      { id: 'dig-03', code: 'DIG 03', title: 'Audit SPF Security Policy', objective: 'Extract and analyze the SPF record from TXT entries.', xp: 140, challengeSnippet: 'dig apexcorp.internal TXT' },
      { id: 'dig-04', code: 'DIG 04', title: 'Test for Zone Transfer', objective: 'Attempt an AXFR query against the safe training nameserver.', xp: 160, challengeSnippet: 'dig axfr @10.10.10.2 apexcorp.internal' }
    ],
    caseStudy: {
      title: 'The Dangling Subdomain Takeover',
      scenario: 'A company pointed blog.company.com to an Amazon S3 bucket via CNAME. When the marketing team deleted the S3 bucket, they forgot to remove the DNS record. An attacker claimed the abandoned S3 bucket name and hosted phishing pages on company.com.',
      lesson: 'Regularly audit DNS zones for dangling CNAME records pointing to unclaimed third-party resources.'
    }
  },
  {
    id: 'curl-cmd',
    name: 'cURL & Wget (HTTP Command Line)',
    category: 'Linux Native',
    unlockLevel: 1,
    iconName: 'Code',
    tagline: 'Command-line tool for transferring data with URLs',
    badge: 'STAGE 1 UNLOCKED',
    whatIsIt: 'cURL is a command-line tool and library for transferring data with URLs. It supports HTTP, HTTPS, FTP, FTPS, SFTP, and dozens of other protocols.',
    whyIsItUsed: 'Used by security practitioners to interact with REST APIs, debug web response headers, send custom HTTP headers and JSON bodies, and download forensic payloads.',
    whenShouldIUseIt: 'Whenever you want to quickly test a web endpoint, automate API queries, or inspect raw server headers without opening a web browser.',
    commonCommands: [
      {
        command: 'curl -i -X POST https://api.internal/login -d "user=admin&pass=123"',
        description: 'Sends an HTTP POST with data and prints both response headers and body (-i).',
        sampleOutput: `HTTP/1.1 401 Unauthorized\nServer: nginx/1.24.0\nSet-Cookie: session=invalid; Path=/; HttpOnly\n\n{"error": "Invalid credentials"}`,
        interpretation: 'Reveals server header banners, status code 401, cookie attributes, and JSON error response.'
      },
      {
        command: 'curl -I http://10.10.10.5',
        description: 'Sends a HEAD request to inspect HTTP response headers only.',
        sampleOutput: `HTTP/1.1 200 OK\nDate: Fri, 21 Aug 2026 12:00:00 GMT\nServer: Apache/2.4.52 (Ubuntu)\nX-Powered-By: PHP/8.1.2`,
        interpretation: 'Reveals precise PHP and Apache versions, aiding in vulnerability assessment.'
      }
    ],
    whatToLookFor: [
      'Server banners (Server, X-Powered-By, X-AspNet-Version) revealing framework versions.',
      'HTTP status codes (301 redirects, 403 Forbidden vs 404 Not Found revealing hidden files).',
      'Security headers (Strict-Transport-Security, X-Frame-Options, Content-Security-Policy).'
    ],
    whatCanGoWrong: [
      'Self-signed SSL certificates will fail unless you pass -k (--insecure).',
      'Automatic redirect following is disabled by default unless you pass -L.'
    ],
    howDefendersDetectIt: 'Web servers log the default User-Agent "curl/7.88.1" in access logs unless overridden with the -A / --user-agent flag.',
    practicalLab: {
      title: 'Inspect HTTP Response Headers on Web Server',
      target: 'http://10.10.10.5/api/health',
      task: 'Use curl -i to inspect the headers on http://10.10.10.5/api/health and find the custom debug token.',
      hint: 'Run "curl -i http://10.10.10.5/api/health"',
      expectedCommand: 'curl -i http://10.10.10.5/api/health',
      verificationOutput: 'X-Debug-Token: FLAG{CURL_HEADER_INSPECTION_OK_1044}'
    },
    missions: [
      { id: 'curl-01', code: 'CURL 01', title: 'Fetch Web Page Body', objective: 'Download raw HTML using curl -s.', xp: 100, challengeSnippet: 'curl -s http://10.10.10.5' },
      { id: 'curl-02', code: 'CURL 02', title: 'Inspect Response Headers', objective: 'Use curl -I to check HTTP status and server banners.', xp: 120, challengeSnippet: 'curl -I http://10.10.10.5' },
      { id: 'curl-03', code: 'CURL 03', title: 'Send Custom Headers', objective: 'Send an Authorization Bearer header using -H.', xp: 140, challengeSnippet: 'curl -H "Authorization: Bearer token123" http://10.10.10.5/api' },
      { id: 'curl-04', code: 'CURL 04', title: 'POST JSON Data', objective: 'Send a JSON payload with Content-Type application/json.', xp: 160, challengeSnippet: 'curl -X POST -H "Content-Type: application/json" -d \'{"role":"admin"}\' http://10.10.10.5/api' }
    ],
    caseStudy: {
      title: 'The Hidden Admin Endpoint',
      scenario: 'A web developer commented out the link to "/admin_debug_2026" in the HTML. A penetration tester ran curl against common wordlists, received an HTTP 200 OK on the endpoint, and accessed the unauthenticated diagnostic panel.',
      lesson: 'Never rely on security through obscurity or hidden links. Protect all administrative endpoints with robust authentication.'
    }
  }
];

export const LINUX_NATIVE_TOOLS = [
  { name: 'ip', category: 'Networking', purpose: 'Show / manipulate routing, network devices, interfaces and tunnels', example: 'ip addr show' },
  { name: 'ss', category: 'Networking', purpose: 'Investigate sockets and active network connections (modern netstat)', example: 'ss -tulpn' },
  { name: 'ping', category: 'Networking', purpose: 'Send ICMP ECHO_REQUEST packets to network hosts', example: 'ping -c 4 10.10.10.1' },
  { name: 'traceroute', category: 'Networking', purpose: 'Print the route packets trace to network host', example: 'traceroute 10.10.10.5' },
  { name: 'grep', category: 'Text Processing', purpose: 'Search text and log files for patterns matching regular expressions', example: 'grep -i "failed" /var/log/auth.log' },
  { name: 'find', category: 'Filesystem', purpose: 'Search for files in a directory hierarchy based on permissions, names, or modification times', example: 'find / -perm -4000 2>/dev/null' },
  { name: 'cat / less', category: 'File Inspection', purpose: 'Concatenate and view files sequentially or page by page', example: 'less /var/log/syslog' },
  { name: 'head / tail', category: 'File Inspection', purpose: 'Output the first or last parts of files in real time', example: 'tail -f /var/log/nginx/access.log' },
  { name: 'awk / sed', category: 'Stream Editing', purpose: 'Pattern scanning and stream editor for filtering columns and replacing text', example: 'awk \'{print $1, $7}\' access.log' }
];
