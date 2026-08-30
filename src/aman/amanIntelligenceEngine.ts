/**
 * AMAN Intelligence Engine (Phase 2 Upgrade)
 * Provides deep intent classification, misconception detection,
 * Socratic question generation, adaptive difficulty scaling,
 * and specialized cybersecurity domain reasoning.
 */

export type CyberDomainMode = 
  | 'GENERAL'
  | 'SOC'
  | 'RED_TEAM'
  | 'BLUE_TEAM'
  | 'WEB_SECURITY'
  | 'NETWORK'
  | 'LINUX'
  | 'PYTHON_SECURITY';

export type LearnerProficiency = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type IntentClassificationType =
  | 'CONCEPT_LEARNING'
  | 'EXPLAIN_SIMPLY'
  | 'EXPLAIN_TECHNICAL'
  | 'PRACTICAL_EXAMPLE'
  | 'COMMAND_EXPLANATION'
  | 'TROUBLESHOOTING'
  | 'MISCONCEPTION_CORRECTION'
  | 'LAB_ASSISTANCE'
  | 'CTF_MENTORING'
  | 'SOCRATIC_CHALLENGE'
  | 'QUIZ_ASSESSMENT'
  | 'CAREER_ROADMAP'
  | 'PROJECT_PORTFOLIO'
  | 'GENERAL_CONVERSATION';

export interface MisconceptionAnalysis {
  detected: boolean;
  misconceptionTopic?: string;
  incorrectStatement?: string;
  underlyingTruth?: string;
  correctMentalModel?: string;
  verificationQuestion?: string;
}

export interface SocraticStep {
  stepNumber: number;
  question: string;
  focusArea: string;
  expectedConcept: string;
}

export interface ClassifiedAmanIntent {
  primaryIntent: IntentClassificationType;
  cyberDomain: CyberDomainMode;
  targetProficiency: LearnerProficiency;
  confidence: number;
  misconception: MisconceptionAnalysis;
  socraticSuggestions?: SocraticStep[];
  suggestedActionRoute?: string;
  suggestedActionLabel?: string;
}

export class AmanIntelligenceEngine {
  /**
   * Detects known cybersecurity misconceptions and returns correction data.
   */
  public static analyzeMisconceptions(query: string): MisconceptionAnalysis {
    const q = query.toLowerCase();

    // 1. TCP vs UDP Speed & Security
    if (
      (q.includes('tcp') && q.includes('faster') && q.includes('udp')) ||
      (q.includes('tcp') && q.includes('more secure') && q.includes('faster than udp'))
    ) {
      return {
        detected: true,
        misconceptionTopic: 'TCP vs UDP Performance Mechanics',
        incorrectStatement: 'TCP is faster than UDP because it is more secure.',
        underlyingTruth: 'UDP is faster and lighter because it has NO connection handshake (SYN/ACK) and NO packet retransmission overhead. TCP is slower due to state management, sliding window flow control, and guaranteed ordered delivery.',
        correctMentalModel: 'UDP = Realtime speed without guarantees (VoIP/Gaming/DNS). TCP = Reliable, ordered delivery with overhead (HTTP/SSH/FTP).',
        verificationQuestion: 'Why would a DNS lookup or video stream prefer UDP over TCP?'
      };
    }

    // 2. HTTPS & Network Layer Encryption
    if (
      q.includes('https') && (
        q.includes('encrypts') || 
        q.includes('hides') || 
        q.includes('protects')
      ) && (
        q.includes('ip') || 
        q.includes('destination') || 
        q.includes('header')
      )
    ) {
      return {
        detected: true,
        misconceptionTopic: 'TLS/HTTPS Encryption Layer Boundaries',
        incorrectStatement: 'HTTPS encrypts destination IP addresses and network packet headers.',
        underlyingTruth: 'HTTPS (TLS) operates at Layer 7 (Application Layer) above TCP/IP. It encrypts HTTP payloads (URLs, headers, cookies, POST bodies), but Layer 3 IP headers (Source IP & Destination IP) remain in plaintext so routers can deliver packets.',
        correctMentalModel: 'TLS encrypts the letter inside the envelope; the envelope address (IP) must remain readable to the postal carrier (routers).',
        verificationQuestion: 'What technology (like VPNs or Tor) is required to hide or encapsulate the destination IP?'
      };
    }

    // 3. Subnet Usable Host Calculation
    if (
      (q.includes('/24') && (q.includes('256 usable') || q.includes('256 hosts') || q.includes('256 computers'))) ||
      (q.includes('/28') && (q.includes('16 usable') || q.includes('16 hosts')))
    ) {
      return {
        detected: true,
        misconceptionTopic: 'Subnet Usable Host Arithmetic',
        incorrectStatement: 'A /24 subnet has 256 usable host IP addresses.',
        underlyingTruth: 'While a /24 has 256 total addresses (2^8), 2 addresses are strictly reserved: the Network ID (first address, .0) and the Broadcast Address (last address, .255). Usable hosts = 2^(32-prefix) - 2 = 254.',
        correctMentalModel: 'Always subtract 2 from total IPs for Network ID and Broadcast ID.',
        verificationQuestion: 'In a 192.168.1.0/28 subnet (16 total IPs), how many actual devices can receive valid host IPs?'
      };
    }

    // 4. Base64 vs Encryption
    if (
      (q.includes('base64') && (q.includes('encrypt') || q.includes('is encryption') || q.includes('secure hash')))
    ) {
      return {
        detected: true,
        misconceptionTopic: 'Encoding vs. Encryption vs. Hashing',
        incorrectStatement: 'Base64 is an encryption algorithm that protects sensitive data.',
        underlyingTruth: 'Base64 is an ENCODING scheme designed for data transmission across ASCII channels, not encryption. It requires NO secret key and can be trivially decoded by anyone with `base64 -d`.',
        correctMentalModel: 'Encoding = Format representation (Base64). Encryption = Confidentiality with a key (AES-256). Hashing = One-way integrity check (SHA-256).',
        verificationQuestion: 'Why should you never store user passwords in Base64 encoding?'
      };
    }

    // 5. Firewalls vs SQL Injection
    if (
      q.includes('firewall') && (q.includes('sql injection') || q.includes('sqli'))
    ) {
      return {
        detected: true,
        misconceptionTopic: 'Network Firewalls vs. Application Vulnerabilities',
        incorrectStatement: 'Standard network firewalls completely protect web apps from SQL Injection.',
        underlyingTruth: 'Standard network firewalls filter L3/L4 traffic (ports 80/443). Because SQL injection attacks travel inside legitimate HTTP requests on open ports, network firewalls allow them through. Defense requires Parameterized Queries (Prepared Statements) at the application layer.',
        correctMentalModel: 'A gate guard (firewall) lets authorized visitors in; if the visitor carries malicious SQL inside their legitimate luggage, only application-level code sanitization can stop them.',
        verificationQuestion: 'How do Prepared Statements prevent SQL Injection even without a WAF?'
      };
    }

    return { detected: false };
  }

  /**
   * Generates progressive Socratic scaffolding questions for deep learning.
   */
  public static generateSocraticLadder(topic: string, domain: CyberDomainMode): SocraticStep[] {
    const t = topic.toLowerCase();

    if (t.includes('nmap') || t.includes('port scan')) {
      return [
        {
          stepNumber: 1,
          focusArea: 'Observation',
          question: 'When an attacker probes a target, what is the very first piece of information they need to find out about running services?',
          expectedConcept: 'Open ports and listening services'
        },
        {
          stepNumber: 2,
          focusArea: 'Protocol Mechanics',
          question: 'What makes a TCP SYN scan ("stealth scan") different from a full TCP connect scan in terms of packet exchange?',
          expectedConcept: 'Half-open handshake (SYN -> SYN/ACK -> RST without completing connection)'
        },
        {
          stepNumber: 3,
          focusArea: 'Defensive Detection',
          question: 'How would a SOC analyst detect an aggressive Nmap scan in their firewall or SIEM logs?',
          expectedConcept: 'Rapid sequential SYN packets across multiple ports from a single IP'
        }
      ];
    }

    if (t.includes('sqli') || t.includes('sql injection')) {
      return [
        {
          stepNumber: 1,
          focusArea: 'Root Cause',
          question: 'Where does the boundary between SQL code structure and user input data get blurred during an injection attack?',
          expectedConcept: 'Direct string concatenation in dynamic query strings'
        },
        {
          stepNumber: 2,
          focusArea: 'Payload Execution',
          question: 'When an attacker inputs `\' OR \'1\'=\'1`, why does the database return unauthorized records?',
          expectedConcept: 'Boolean TRUE condition forces the WHERE clause to match all records'
        },
        {
          stepNumber: 3,
          focusArea: 'Root Fix',
          question: 'Why does a Parameterized Query (Prepared Statement) make SQL injection impossible even if the input contains malicious SQL characters?',
          expectedConcept: 'Database engine treats parameter strictly as literal data, never executable syntax'
        }
      ];
    }

    // Default general cybersecurity scaffolding
    return [
      {
        stepNumber: 1,
        focusArea: 'Foundational Concept',
        question: `What is the primary objective of ${topic} in a secure system architecture?`,
        expectedConcept: 'Security objective and protocol purpose'
      },
      {
        stepNumber: 2,
        focusArea: 'Under-the-Hood Mechanics',
        question: `How does data or execution flow under the hood during this operation?`,
        expectedConcept: 'Protocol headers, memory, or network transmission'
      },
      {
        stepNumber: 3,
        focusArea: 'Hands-on Application',
        question: `How would you verify or test this in our hands-on cybersecurity lab?`,
        expectedConcept: 'Command syntax and defensive log inspection'
      }
    ];
  }

  /**
   * Classifies user query into rich intent, domain, and adaptive difficulty.
   */
  public static classifyIntent(
    query: string,
    currentCyberLevel: number = 1,
    currentRoute: string = '/dashboard'
  ): ClassifiedAmanIntent {
    const q = query.toLowerCase().trim();
    const misconception = this.analyzeMisconceptions(q);

    // 1. Cyber Domain Detection
    let cyberDomain: CyberDomainMode = 'GENERAL';
    if (/wireshark|packet capture|subnet|cidr|tcp syn|tcp\/ip|ip address|arp|icmp|dns query|routing|dhcp/i.test(q)) {
      cyberDomain = 'NETWORK';
    } else if (/soc|siem|splunk|elastic|alert|incident response|triage|log analysis|ioc|edr/i.test(q)) {
      cyberDomain = 'SOC';
    } else if (/web security|owasp|sql injection|sqli|xss|csrf|idor|burp|cookie|jwt|session/i.test(q)) {
      cyberDomain = 'WEB_SECURITY';
    } else if (/red team|pentest|penetration testing|recon|nmap|metasploit|privilege escalation|exploit|reverse shell/i.test(q)) {
      cyberDomain = 'RED_TEAM';
    } else if (/blue team|defense|hardening|firewall|ids|ips|yara|sigma|patching/i.test(q)) {
      cyberDomain = 'BLUE_TEAM';
    } else if (/network|tcp|udp/i.test(q)) {
      cyberDomain = 'NETWORK';
    } else if (/linux|bash|chmod|chown|grep|sudo|systemctl|process|crontab|terminal/i.test(q)) {
      cyberDomain = 'LINUX';
    } else if (/python|scripting|automation|scapy|socket|beautifulsoup|requests/i.test(q)) {
      cyberDomain = 'PYTHON_SECURITY';
    }

    // 2. Proficiency Level Detection
    let targetProficiency: LearnerProficiency = 'BEGINNER';
    if (currentCyberLevel >= 4 || /advanced|expert|deep dive|internals|assembly|kernel|rfc/i.test(q)) {
      targetProficiency = 'EXPERT';
    } else if (currentCyberLevel === 3 || /intermediate|technical|mechanics|under the hood/i.test(q)) {
      targetProficiency = 'ADVANCED';
    } else if (currentCyberLevel === 2 || /practical|example|hands on|command/i.test(q)) {
      targetProficiency = 'INTERMEDIATE';
    }

    // 3. Primary Intent Classification
    let primaryIntent: IntentClassificationType = 'CONCEPT_LEARNING';
    let suggestedActionRoute: string | undefined;
    let suggestedActionLabel: string | undefined;

    if (misconception.detected) {
      primaryIntent = 'MISCONCEPTION_CORRECTION';
    } else if (/^(hi|hello|hey|kya haal hai|kaise ho|greetings|what's up|how are you)(\s+aman|\s*!|\s*\.)*$/i.test(q)) {
      primaryIntent = 'GENERAL_CONVERSATION';
    } else if (/quiz me|test me|ask me a question|give me a quiz|mcq|assess me/i.test(q)) {
      primaryIntent = 'QUIZ_ASSESSMENT';
    } else if (/give me a challenge|challenge me|practical task|hands-on exercise/i.test(q)) {
      primaryIntent = 'SOCRATIC_CHALLENGE';
    } else if (/why is this not working|troubleshoot|fix this command|error|syntax error|connection refused/i.test(q)) {
      primaryIntent = 'TROUBLESHOOTING';
    } else if (/explain simply|simple terms|in simple words|layman|aasan bhasha|eli5/i.test(q)) {
      primaryIntent = 'EXPLAIN_SIMPLY';
      targetProficiency = 'BEGINNER';
    } else if (/explain technically|deep dive|low level|packet structure|rfc specification/i.test(q)) {
      primaryIntent = 'EXPLAIN_TECHNICAL';
      targetProficiency = 'ADVANCED';
    } else if (/give me an example|practical example|show me an example|real world example/i.test(q)) {
      primaryIntent = 'PRACTICAL_EXAMPLE';
    } else if (/command breakdown|explain flag|what does -s|how to run|syntax/i.test(q)) {
      primaryIntent = 'COMMAND_EXPLANATION';
    } else if (/career|roadmap|how to become|salary|certification|ceh|oscp|security+/i.test(q)) {
      primaryIntent = 'CAREER_ROADMAP';
      suggestedActionRoute = '/career-paths';
      suggestedActionLabel = 'Explore Cyber Career Paths';
    } else if (/project|portfolio|github|what project should i build/i.test(q)) {
      primaryIntent = 'PROJECT_PORTFOLIO';
    } else if (/ctf|flag|challenge hint|stuck on flag/i.test(q)) {
      primaryIntent = 'CTF_MENTORING';
      suggestedActionRoute = '/ctf';
      suggestedActionLabel = 'Open CTF Arena';
    }

    // Map Domain to Lab Routes
    if (!suggestedActionRoute) {
      if (cyberDomain === 'NETWORK') {
        suggestedActionRoute = '/network-lab';
        suggestedActionLabel = 'Launch Network Recon Lab';
      } else if (cyberDomain === 'WEB_SECURITY') {
        suggestedActionRoute = '/web-security';
        suggestedActionLabel = 'Open Web Security Lab';
      } else if (cyberDomain === 'SOC') {
        suggestedActionRoute = '/soc-simulator';
        suggestedActionLabel = 'Launch SOC SIEM Simulator';
      } else if (cyberDomain === 'LINUX') {
        suggestedActionRoute = '/linux-lab';
        suggestedActionLabel = 'Open Linux Terminal Lab';
      }
    }

    const socraticSuggestions = (primaryIntent === 'SOCRATIC_CHALLENGE' || primaryIntent === 'CONCEPT_LEARNING')
      ? this.generateSocraticLadder(q, cyberDomain)
      : undefined;

    return {
      primaryIntent,
      cyberDomain,
      targetProficiency,
      confidence: 0.95,
      misconception,
      socraticSuggestions,
      suggestedActionRoute,
      suggestedActionLabel
    };
  }
}
