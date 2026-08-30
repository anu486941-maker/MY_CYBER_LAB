import { detectAmanIntent } from './amanActionDispatcher';

export interface LocalGuidanceResult {
  fullText: string;
  summary: string;
  isLocalGuidance: boolean;
  amanStatus: 'LOCAL_GUIDANCE';
}

export function generateLocalGuidanceResponse(
  userQuery: string,
  contextData: any,
  language: string = 'Auto',
  errorCode: string = 'MODEL_UNAVAILABLE'
): LocalGuidanceResult {
  const isHinglish =
    language === 'Hinglish' ||
    language === 'Hindi' ||
    (contextData && (contextData.language === 'Hinglish' || contextData.language === 'Hindi')) ||
    userQuery.toLowerCase().includes('hinglish') ||
    userQuery.toLowerCase().includes('sikhao') ||
    userQuery.toLowerCase().includes('sikhni');

  const course = contextData?.currentCourse || contextData?.careerPath || 'Networking Fundamentals';
  const topic = contextData?.currentLesson || contextData?.currentModule || 'Switches, Routers & Default Gateways';
  const level = contextData?.cyberLevel || contextData?.level || 1;
  const nextSkill = contextData?.nextRequiredSkill || 'Hands-on Lab Practice';

  const intentResult = detectAmanIntent(userQuery);

  let fullText = '';
  let summary = '';

  // 1. CAREER_LEARNING_INTENT ("I want to learn ethical hacking", "Mujhe ethical hacking sikhni hai")
  if (intentResult.intent === 'CAREER_LEARNING_INTENT') {
    if (isHinglish) {
      fullText = `Bilkul! Main aapko Ethical Hacking ki learning path par lead karunga.

Aap abhi **${course}** (Level ${level}) mein ho. Ethical Hacking master karne ke liye ye foundational steps complete karne honge:

1. **Networking Fundamentals**: TCP/IP, OSI model, ports, & subnetting.
2. **Linux Shell & Terminal**: Permissions, process management, & command lines.
3. **Port Scanning & Reconnaissance**: Target discovery with Nmap & Wireshark.
4. **Vulnerability Assessment**: Identifying misconfigurations and exploits.

Aapka learning progress aur XP completely safe hai!

[ACTION:OPEN_LEARNING_PATH:ethical-hacker]`;
      summary = `Main aapko Ethical Hacking path par guide kar raha hoon. [ACTION:OPEN_LEARNING_PATH:ethical-hacker]`;
    } else {
      fullText = `Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.

Certainly! I will guide you along the **Ethical Hacker** career path.

You are currently in **${course}** (Level ${level}). To master Ethical Hacking, you will complete these core competencies:

1. **Networking Fundamentals**: TCP/IP, OSI layers, ports, & subnetting.
2. **Linux Shell & Command Line**: File permissions, process controls, & automation scripts.
3. **Reconnaissance & Port Scanning**: Target discovery using Nmap & Wireshark.
4. **Vulnerability Assessment**: Scanning for misconfigurations and security flaws.

Your progress, XP, and state remain 100% saved locally.

[ACTION:OPEN_LEARNING_PATH:ethical-hacker]`;
      summary = `I am guiding you to the Ethical Hacker path. [ACTION:OPEN_LEARNING_PATH:ethical-hacker]`;
    }
  } 
  else if (intentResult.intent === 'CAREER_SWITCH') {
    fullText = isHinglish
      ? `Bilkul! Main aapko ${intentResult.canonicalRole === 'ETHICAL_HACKER' ? 'Ethical Hacker' : 'SOC Analyst'} track par switch karwa raha hoon. 🚀\n\n[ACTION:${intentResult.action?.type}:${intentResult.action?.parameter}]`
      : `Switching you to the ${intentResult.canonicalRole === 'ETHICAL_HACKER' ? 'Ethical Hacker' : 'SOC Analyst'} track now! 🚀\n\n[ACTION:${intentResult.action?.type}:${intentResult.action?.parameter}]`;
    summary = `Switching track...`;
  }
  // 2. LEARNING_QUERY ("What to learn next?", "Next lesson")
  else if (intentResult.intent === 'LEARNING_QUERY') {
    fullText = isHinglish
      ? `Aap abhi **${course}** (${topic}) par progress kar rahe ho. Chalo, next lesson start karte hain! 🚀\n\n[ACTION:START_NEXT]`
      : `You are progressing well in **${course}** (${topic}). Let's start the next lesson! 🚀\n\n[ACTION:START_NEXT]`;
    summary = `Resuming learning... [ACTION:START_NEXT]`;
  }
  // 3. CAREER_ROADMAP ("Show me roadmap", "Show ethical hacking roadmap")
  else if (intentResult.intent === 'CAREER_ROADMAP') {
    if (isHinglish) {
      fullText = `Bilkul! Main aapka Adaptive Roadmap open kar raha hoon.

Aap **${course}** par progress kar rahe ho. Complete roadmap dekhne ke liye button click karein.

[ACTION:OPEN_ROADMAP]`;
      summary = `Opening your career roadmap. [ACTION:OPEN_ROADMAP]`;
    } else {
      fullText = `Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.

Here is your adaptive cybersecurity roadmap. You are currently progressing through **${course}**.

[ACTION:OPEN_ROADMAP]`;
      summary = `Opening your career roadmap. [ACTION:OPEN_ROADMAP]`;
    }
  }
  // 3. RESUME_CAREER_PATH ("Continue karo", "Next lesson kholo", "Continue learning")
  else if (intentResult.intent === 'RESUME_CAREER_PATH') {
    if (isHinglish) {
      fullText = `Aapka active topic hai: **${course}** (${topic}).

Aapka next recommended move: **${nextSkill}**.

Chalo aage continue karte hain!

[ACTION:START_NEXT]`;
      summary = `Resuming your saved learning position in ${course}. [ACTION:START_NEXT]`;
    } else {
      fullText = `Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.

Your saved learning position: **${course}** (${topic}).
Next recommended activity: **${nextSkill}**.

Let's launch your next module!

[ACTION:START_NEXT]`;
      summary = `Resuming your saved position in ${course}. [ACTION:START_NEXT]`;
    }
  }
  // 4. MODULE_INTENT ("Open Linux Fundamentals", "Open module")
  else if (intentResult.intent === 'MODULE_INTENT') {
    const actionTag = intentResult.action ? `[ACTION:${intentResult.action.type}:${intentResult.action.targetRoute}]` : '[ACTION:OPEN_MODULE:/modules]';
    if (isHinglish) {
      fullText = `Aapke requested training module ko load kar raha hoon.

${actionTag}`;
      summary = `Opening requested module. ${actionTag}`;
    } else {
      fullText = `Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.

Opening your requested training module now.

${actionTag}`;
      summary = `Opening requested module. ${actionTag}`;
    }
  }
  // 5. CASUAL CONVERSATION ("Kya haal hai?", "Kaise ho?", "Hello", "How are you?", "Thanks")
  else if (intentResult.intent === 'CONVERSATION') {
    const qLower = userQuery.toLowerCase();
    if (qLower.includes('kya kar') || qLower.includes('what are you doing') || qLower.includes('what r u doing')) {
      fullText = isHinglish
        ? `Bas tumhare next step ke liye ready hoon 😄 Batao, aaj kya karna hai?`
        : `Just ready for your next move! 😄 What would you like to work on today?`;
      summary = isHinglish ? `Main ready hoon!` : `Ready when you are!`;
    } else if (qLower.includes('thanks') || qLower.includes('thank')) {
      fullText = isHinglish
        ? `Anytime! 😄 Cybersecurity learning mein koi bhi doubt ho, bina jhijhak poocho.`
        : `You're very welcome! 😄 Feel free to ask whenever you have questions.`;
      summary = `Anytime! 😄`;
    } else if (qLower.includes('bye') || qLower.includes('goodbye')) {
      fullText = isHinglish
        ? `Aapko phir milenge! Tab tak happy learning and stay secure! 🛡️`
        : `See you later! Keep practicing and stay secure! 🛡️`;
      summary = `Goodbye! 🛡️`;
    } else {
      fullText = isHinglish
        ? `Main bilkul badhiya hoon 😄 Tum batao, cybersecurity learning kaisi chal rahi hai?`
        : `I'm doing great! 😄 Ready to help whenever you are. How is your learning going today?`;
      summary = isHinglish ? `Main badhiya hoon 😄` : `I'm doing great! 😄`;
    }
  }
  // 6. ROOM / MODULE EXPLICIT QUERY
  else if (intentResult.intent === 'ROOM_QUERY') {
    if (isHinglish) {
      fullText = `Is room mein hum **${course}** (${topic}) sikh rahe hain.
      
Core concepts:
- **Switch**: Local network ke devices ko connect karta hai.
- **Router**: Networks ke beech traffic routing karta hai.
- **Default Gateway**: Network se bahar nikalne ka exit point.

Aapka status 100% saved hai!`;
      summary = `Is room mein hum ${course} sikh rahe hain.`;
    } else {
      fullText = `In this room, we are focusing on **${course}** (${topic}).

Core principles covered:
- **Switch**: Local area network connectivity.
- **Router**: Inter-network packet routing.
- **Default Gateway**: Exit gateway node for remote destination routing.

Your progress is safely recorded.`;
      summary = `Explaining current room: ${course}.`;
    }
  }
  // 7. SPECIFIC CYBERSECURITY TOPICS & DEEP CONCEPT ANSWERS
  else if (/nmap|port scan|recon|port/i.test(userQuery)) {
    if (isHinglish) {
      fullText = `### 🔍 Port Scanning & Network Reconnaissance

**1. Concept in Simple Terms:**
Port scanning ek process hai jisme target host ke open ports aur running network services ko identify kiya jata hai.

**2. Under the Hood Mechanics:**
- **TCP SYN Scan (\`-sS\`)**: "Stealth scan" jisme 3-way handshake complete nahi hota (SYN bhejo → SYN-ACK mila → RST bhejo).
- **Service Version Detection (\`-sV\`)**: Banner grabbing aur protocol probes se exact software version detect karta hai.
- **Port States**: \`open\` (service listening), \`closed\` (RST received), \`filtered\` (firewall dropping packets).

**3. Practical Hands-On Command:**
\`\`\`bash
# Fast stealth scan with service versions on standard top 1000 ports
nmap -sS -sV -T4 10.10.10.50
\`\`\`

**4. Real-World Threat / Defensive Context:**
Attackers reconnaissance phase me vulnerable services (jaise outdated Apache, SSH, SMB) dhoondhte hain. Defenders ko regular audit karna chahiye aur unused ports ko firewall se block rakhna chahiye.

**5. Next Action:**
Aap is command ko Network Lab me test kar sakte hain!
[ACTION:OPEN_MODULE:/network-lab]`;
      summary = `Explaining Port Scanning & Nmap in Hinglish. [ACTION:OPEN_MODULE:/network-lab]`;
    } else {
      fullText = `### 🔍 Port Scanning & Network Reconnaissance

**1. Concept Overview:**
Port scanning is an active reconnaissance technique used to probe a target IP address for open network ports and accessible services.

**2. Technical Mechanics:**
- **TCP SYN Scan (\`-sS\`)**: Half-open scanning that sends SYN packets without completing the full 3-way handshake (SYN → SYN-ACK → RST).
- **Service Version Detection (\`-sV\`)**: Probes listening ports with protocol banners to identify software names and exact versions.
- **Port States**: \`open\` (actively listening), \`closed\` (RST received), \`filtered\` (firewall or packet filter dropped the probe).

**3. Practical Hands-On Syntax:**
\`\`\`bash
# Run stealth SYN scan with OS & service version detection
nmap -sS -sV -O -T4 10.10.10.50
\`\`\`

**4. Defensive & Incident Context:**
Attackers utilize open port discovery to locate unpatched services (such as vulnerable SMB, RDP, or HTTP daemons). Blue teams monitor network logs for rapid SYN sequences and enforce strict egress/ingress firewall rules.

**5. Recommended Next Step:**
Test this live in our Network Reconnaissance Lab!
[ACTION:OPEN_MODULE:/network-lab]`;
      summary = `Explaining Port Scanning & Nmap reconnaissance. [ACTION:OPEN_MODULE:/network-lab]`;
    }
  }
  else if (/subnet|cidr|ip address|gateway|mask/i.test(userQuery)) {
    if (isHinglish) {
      fullText = `### 🌐 CIDR & Subnetting Fundamentals

**1. Concept in Simple Terms:**
Subnetting ek large IP network ko smaller, isolated sub-networks me divide karne ka process hai, taaki network security aur performance improve ho sake.

**2. Under the Hood Mechanics:**
- **CIDR Notation (\`/24\`)**: Total 32-bit IPv4 address me se pehle 24 bits network ID ke liye hote hain, bache 8 bits host ke liye.
- **Host Calculation Formula**: \`2^(32 - Prefix) - 2\` (2 subtract karte hain Network Address aur Broadcast Address ke liye).
- **Example (/24)**: \`2^(32 - 24) - 2 = 2^8 - 2 = 254\` usable host addresses.
- **Example (/28)**: \`2^(32 - 28) - 2 = 2^4 - 2 = 14\` usable host addresses.

**3. Practical Example:**
Network \`192.168.1.0/24\`:
- **Subnet Mask**: \`255.255.255.0\`
- **Network ID**: \`192.168.1.0\`
- **First Usable Host**: \`192.168.1.1\` (Gateway)
- **Last Usable Host**: \`192.168.1.254\`
- **Broadcast**: \`192.168.1.255\`

**4. Real-World Application:**
DMZ, internal databases, aur corporate workstations ko alag-alag subnets me rakhna segmentation ka golden rule hai.

**5. Next Action:**
Practice your calculation speed in our Subnetting Trainer!
[ACTION:OPEN_MODULE:/subnetting-trainer]`;
      summary = `Explaining CIDR Subnetting in Hinglish. [ACTION:OPEN_MODULE:/subnetting-trainer]`;
    } else {
      fullText = `### 🌐 CIDR & Subnetting Mechanics

**1. Core Concept:**
Subnetting partitions a larger IP address space into distinct, routable sub-networks to reduce broadcast traffic and enforce security boundaries.

**2. Low-Level Mechanics:**
- **CIDR Prefix**: Indicates the number of leading masked network bits out of 32 total bits.
- **Usable Host Formula**: \`2^(32 - Prefix) - 2\` (excluding the network ID and broadcast address).
- **Prefix Breakdown**:
  - \`/24\` = 256 total IPs = **254 usable hosts** (Mask: \`255.255.255.0\`)
  - \`/26\` = 64 total IPs = **62 usable hosts** (Mask: \`255.255.255.192\`)
  - \`/28\` = 16 total IPs = **14 usable hosts** (Mask: \`255.255.255.240\`)

**3. Architecture & Security Context:**
Isolating web-facing assets into a dedicated DMZ subnet while securing internal databases on private non-routable subnets prevents lateral movement during a breach.

**4. Hands-On Practice:**
Master rapid CIDR calculations in our Subnetting Trainer.
[ACTION:OPEN_MODULE:/subnetting-trainer]`;
      summary = `Explaining CIDR Subnetting mechanics. [ACTION:OPEN_MODULE:/subnetting-trainer]`;
    }
  }
  else if (/sql injection|sqli|injection|database exploit/i.test(userQuery)) {
    if (isHinglish) {
      fullText = `### 💉 SQL Injection (SQLi) Mastery

**1. Concept in Simple Terms:**
SQL Injection tab hoti hai jab user input ko bina sanitize kiye direct database SQL query string ke andar concatenate kar diya jata hai.

**2. Under the Hood Mechanics:**
- Vulnerable query: \`SELECT * FROM users WHERE username = '\` + \`userInput\` + \`' AND password = '...'\`
- Agar input \`admin' OR '1'='1\` pass kiya jaye, to SQL condition \`'1'='1'\` hamesha TRUE evaluate hoti hai, aur authentication bypass ho jata hai.
- **UNION-based SQLi**: Attacker \`UNION SELECT\` use karke database ke confidential tables (jaise credentials, hashes) ko dump kar leta hai.

**3. Secure Remediation (Fix):**
Hamesha **Parameterized Queries (Prepared Statements)** use karein:
\`\`\`javascript
// Secure Implementation
db.execute("SELECT * FROM users WHERE username = ? AND password_hash = ?", [username, hash]);
\`\`\`

**4. Next Action:**
Test vulnerable login bypass payloads safely in our Web Security Lab!
[ACTION:OPEN_MODULE:/practice/web-security]`;
      summary = `Explaining SQL Injection and remediation in Hinglish. [ACTION:OPEN_MODULE:/practice/web-security]`;
    } else {
      fullText = `### 💉 SQL Injection (OWASP Top 10)

**1. Fundamental Principle:**
SQL Injection occurs when untrusted user input is directly concatenated into a dynamic database query, allowing an attacker to manipulate the query logic.

**2. Technical Mechanics:**
- **Auth Bypass**: Supplying input like \`admin' OR 1=1 --\` forces the \`WHERE\` clause to evaluate to \`true\`, bypassing credential checks.
- **UNION-Based Extraction**: Appends additional query results to exfiltrate schema metadata, column counts, and database records.
- **Blind & Time-Based SQLi**: Exploits boolean conditions or database sleep functions (\`pg_sleep()\`, \`SLEEP()\`) when error output is suppressed.

**3. Industry Standard Remediation:**
Never concatenate raw strings into SQL statements. Use parameterized queries (Prepared Statements) with an ORM or database driver:
\`\`\`typescript
const query = 'SELECT id, email FROM accounts WHERE username = $1 AND active = true';
const result = await db.query(query, [sanitizedUsername]);
\`\`\`

**4. Hands-On Lab:**
Practice testing and fixing injection vulnerabilities in our Web Security Lab.
[ACTION:OPEN_MODULE:/practice/web-security]`;
      summary = `Explaining SQL Injection and Prepared Statements. [ACTION:OPEN_MODULE:/practice/web-security]`;
    }
  }
  // 8. GENERAL QUERY / FALLBACK
  else {
    let contextExplanation = '';
    if (intentResult.useRoomContext) {
      contextExplanation = isHinglish
        ? `Aap abhi **${course}** (${topic}) topic par ho.`
        : `You are currently studying **${course}** (${topic}).`;
    }

    if (isHinglish) {
      fullText = `${contextExplanation}
      
Chalo core concepts samjhte hain:
- **Switch**: Same local network ke devices ko connect karta hai.
- **Router**: Different networks ke beech traffic forward karta hai.
- **Default Gateway**: Device ka exit point.

Batao, kya help chahiye?`;
      summary = contextExplanation || `Batao, kya help chahiye?`;
    } else {
      fullText = `${contextExplanation}

Key concepts:
- **Switch**: Connects devices on the same subnet.
- **Router**: Routes traffic across networks.
- **Default Gateway**: Exit path for external traffic.

Let me know what you would like to explore next!`;
      summary = contextExplanation || `Let me know what you would like to explore next!`;
    }
  }

  return {
    fullText,
    summary,
    isLocalGuidance: true,
    amanStatus: 'LOCAL_GUIDANCE'
  };
}
