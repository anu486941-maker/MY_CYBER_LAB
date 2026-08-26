/**
 * AMAN Turbo Precomputed Platform Index
 * Fast in-memory searchable index for instant zero-latency module,
 * mission, lab, tool, and concept lookups (<1ms).
 */

export interface IndexedPlatformItem {
  id: string;
  title: string;
  category: 'MODULE' | 'LAB' | 'MISSION' | 'TOOL' | 'CONCEPT' | 'CAREER' | 'PAGE';
  route: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  tags: string[];
  description: string;
  mitreTechniques?: string[];
  actionCommand?: string;
  xpReward?: number;
}

export class AmanPlatformIndex {
  private static items: IndexedPlatformItem[] = [
    // --- LABS & TRAINING WORKSHOPS ---
    {
      id: 'linux-lab',
      title: 'Linux Fundamentals & Command Mastery',
      category: 'LAB',
      route: '/linux-lab',
      difficulty: 'Beginner',
      tags: ['linux', 'terminal', 'bash', 'cli', 'permissions', 'chmod', 'chown', 'grep', 'find', 'sudo', 'process', 'ps aux', 'cron'],
      description: 'Hands-on interactive bash terminal environment with file system triage, process management, and permission security.',
      xpReward: 150
    },
    {
      id: 'network-lab',
      title: 'Network Reconnaissance & Port Scanning',
      category: 'LAB',
      route: '/network-lab',
      difficulty: 'Intermediate',
      tags: ['network', 'networking', 'nmap', 'port scan', 'recon', 'wireshark', 'tcp', 'udp', 'packet', 'arp', 'icmp', 'ping', 'syn scan'],
      description: 'Scan virtual subnets, analyze active open ports (21, 22, 80, 443, 3306), inspect packet payloads, and map attack surfaces.',
      mitreTechniques: ['T1046', 'T1595'],
      xpReward: 200
    },
    {
      id: 'subnetting-trainer',
      title: 'CIDR Subnetting Speed & Binary Trainer',
      category: 'LAB',
      route: '/subnetting-trainer',
      difficulty: 'Beginner',
      tags: ['subnet', 'subnetting', 'cidr', 'ip address', 'netmask', 'broadcast', 'usable hosts', 'slash notation', '/24', '/28', '/16', 'binary'],
      description: 'Master IPv4 subnet calculations, broadcast address deduction, CIDR prefix masks, and usable host range arithmetic.',
      xpReward: 120
    },
    {
      id: 'web-security-lab',
      title: 'Web Application Security (OWASP Top 10)',
      category: 'LAB',
      route: '/web-security',
      difficulty: 'Intermediate',
      tags: ['web', 'web security', 'owasp', 'sql injection', 'sqli', 'xss', 'cross-site scripting', 'csrf', 'idor', 'authentication bypass', 'burp'],
      description: 'Test and remediate live vulnerabilities: SQL Injection (`\' OR 1=1--`), Stored XSS payloads, broken access controls, and IDOR.',
      mitreTechniques: ['T1190', 'T1059.007'],
      xpReward: 250
    },
    {
      id: 'soc-simulator',
      title: 'SOC Incident Response & SIEM Simulator',
      category: 'LAB',
      route: '/soc-simulator',
      difficulty: 'Advanced',
      tags: ['soc', 'siem', 'incident response', 'blue team', 'splunk', 'elastic', 'alerts', 'brute force', 'ransomware', 'triage', 'log analysis'],
      description: 'Investigate live simulated enterprise alerts, analyze authorization failures, trace lateral movement, and contain threats.',
      mitreTechniques: ['T1110', 'T1486', 'T1078'],
      xpReward: 300
    },
    {
      id: 'threat-hunting',
      title: 'Threat Hunting & MITRE ATT&CK Range',
      category: 'LAB',
      route: '/threat-hunting',
      difficulty: 'Advanced',
      tags: ['threat hunting', 'mitre', 'att&ck', 'persistence', 'c2', 'lateral movement', 'powershell', 'sigma', 'yara', 'ioc'],
      description: 'Hypothesis-driven threat hunting matrix mapping adversary techniques across Enterprise MITRE tactics.',
      mitreTechniques: ['T1059', 'T1547', 'T1021'],
      xpReward: 350
    },
    {
      id: 'ctf-arena',
      title: 'Capture The Flag (CTF) Arena',
      category: 'LAB',
      route: '/ctf',
      difficulty: 'Intermediate',
      tags: ['ctf', 'capture the flag', 'crypto', 'steganography', 'reverse engineering', 'forensics', 'binary exploitation', 'flags'],
      description: 'Competitive gamified challenges across Cryptography, Web Exploitation, Reverse Engineering, and Network Forensics.',
      xpReward: 500
    },
    {
      id: 'cyber-range',
      title: 'Master Cyber Range & Incident Arenas',
      category: 'LAB',
      route: '/cyber-range',
      difficulty: 'Advanced',
      tags: ['range', 'cyber range', 'arena', 'live attack', 'simulation', 'multi-tool', 'defense'],
      description: 'High-fidelity tactical sandbox combining multi-vector red and blue team operational campaigns.',
      xpReward: 400
    },

    // --- STRATEGIC PAGES & PLATFORM HUBS ---
    {
      id: 'dashboard',
      title: 'Command Dashboard & Telemetry',
      category: 'PAGE',
      route: '/dashboard',
      tags: ['dashboard', 'home', 'main', 'stats', 'xp', 'level', 'overview', 'summary'],
      description: 'Central operations hub with active stats, ongoing missions, streak calendar, and quick-launch workspaces.'
    },
    {
      id: 'ace-console',
      title: 'Authorized Client Engagement (ACE) & Evidence Locker',
      category: 'PAGE',
      route: '/ace-engagement',
      tags: ['ace', 'scope', 'engagement', 'rules of engagement', 'roe', 'evidence', 'locker', 'forensic', 'client', 'audit', 'findings'],
      description: 'Legally authorized security audit scope, verified engagement objectives, and cryptographic evidence custody locker.'
    },
    {
      id: 'study-plan',
      title: 'AI Personalized Study Planner',
      category: 'PAGE',
      route: '/study-plan',
      tags: ['study plan', 'plan', 'schedule', 'daily goal', 'calendar', 'curriculum', 'routine', 'spaced repetition'],
      description: 'AI-generated adaptive daily learning plan dynamically calibrated to your target career role and skill gaps.'
    },
    {
      id: 'career-roles',
      title: 'Cybersecurity Career Pathways & Role Matrix',
      category: 'CAREER',
      route: '/career-roles',
      tags: ['career', 'roles', 'jobs', 'soc analyst', 'penetration tester', 'ethical hacker', 'salary', 'certifications', 'skills needed'],
      description: 'Explore industry roles (SOC Analyst Tier 1-3, Ethical Hacker, Incident Responder, Cloud Sec) and prerequisites.'
    },
    {
      id: 'career-portfolio',
      title: 'Verified Cyber Career Portfolio & Proof of Work',
      category: 'CAREER',
      route: '/career-portfolio',
      tags: ['portfolio', 'resume', 'cv', 'proof of work', 'skills verified', 'github', 'projects', 'badges'],
      description: 'Shareable cryptographic portfolio demonstrating verified hands-on lab completions and mission artifacts.'
    },
    {
      id: 'skill-tree',
      title: 'Visual Cybersecurity Skill Tree',
      category: 'PAGE',
      route: '/skill-tree',
      tags: ['skill tree', 'skills', 'nodes', 'mastery', 'prerequisites', 'graph', 'progression'],
      description: 'RPG-style visual skill tree mapping prerequisites from foundational networking to advanced red-team operations.'
    },
    {
      id: 'roadmap',
      title: 'Interactive Cybersecurity Roadmap',
      category: 'PAGE',
      route: '/roadmap',
      tags: ['roadmap', 'path', 'learning path', 'guide', 'steps', 'timeline', 'beginner to pro'],
      description: 'Step-by-step master learning path from zero prerequisites to professional job-ready cybersecurity competencies.'
    },
    {
      id: 'certificate',
      title: 'Cryptographic Certificate of Completion',
      category: 'PAGE',
      route: '/certificate',
      tags: ['certificate', 'cert', 'diploma', 'credential', 'verify', 'sha256', 'blockchain', 'tamper evident'],
      description: 'Issue and verify SHA-256 tamper-evident cryptographic course completion certificates.'
    },
    {
      id: 'security-tools',
      title: 'Security Tools Directory & Cheatsheets',
      category: 'PAGE',
      route: '/security-tools',
      tags: ['tools', 'cheatsheet', 'commands', 'nmap syntax', 'sqlmap', 'wireshark filters', 'hydra', 'metasploit'],
      description: 'Comprehensive cheatsheet directory with production CLI syntax, flag explanations, and use cases.'
    },
    {
      id: 'analytics',
      title: 'Learner Telemetry & Analytics Dashboard',
      category: 'PAGE',
      route: '/analytics',
      tags: ['analytics', 'charts', 'telemetry', 'speed', 'accuracy', 'time spent', 'streak', 'radar chart'],
      description: 'Deep-dive visual analytics tracking mastery velocity, retention rates, and domain competencies.'
    },
    {
      id: 'notebook',
      title: 'Tactical Cyber Notes & Notebook',
      category: 'PAGE',
      route: '/notebook',
      tags: ['notebook', 'notes', 'documentation', 'markdown', 'scratchpad', 'memo'],
      description: 'Markdown-enabled tactical research notebook for saving incident findings and command syntax.'
    },

    // --- CYBER LAB SPECIFIC MODULES ---
    {
      id: 'mod-recon-101',
      title: 'Passive & Active Reconnaissance',
      category: 'MODULE',
      route: '/network-lab',
      difficulty: 'Beginner',
      tags: ['recon', 'whois', 'dig', 'dnsrecon', 'osint', 'shodan', 'sublist3r'],
      description: 'Discovering subdomains, public IP ranges, and external DNS records without triggering defensive alarms.'
    },
    {
      id: 'mod-sqli-defense',
      title: 'SQL Injection Exploitation & Prepared Statements',
      category: 'MODULE',
      route: '/web-security',
      difficulty: 'Intermediate',
      tags: ['sql injection', 'sqli', 'database', 'mysql', 'union select', 'boolean blind', 'parameterized queries'],
      description: 'Learn UNION-based and Error-based SQL Injection along with secure parameterized query remediation.'
    },
    {
      id: 'mod-bruteforce-triage',
      title: 'SSH & RDP Brute Force Detection',
      category: 'MODULE',
      route: '/soc-simulator',
      difficulty: 'Intermediate',
      tags: ['brute force', 'ssh', 'rdp', 'fail2ban', 'siem', 'auth.log', 'event id 4625'],
      description: 'Triage high-frequency authentication failures and implement automated IP banning policies.'
    }
  ];

  /**
   * Fast in-memory search across all indexed modules, labs, missions, and pages (<1ms)
   */
  public static search(query: string, maxResults: number = 5): IndexedPlatformItem[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.items.slice(0, maxResults);

    const scored = this.items.map(item => {
      let score = 0;
      const lowerTitle = item.title.toLowerCase();
      const lowerDesc = item.description.toLowerCase();
      const lowerId = item.id.toLowerCase();

      // Exact title match
      if (lowerTitle === q) score += 100;
      else if (lowerTitle.startsWith(q)) score += 60;
      else if (lowerTitle.includes(q)) score += 40;

      // Exact ID match
      if (lowerId === q) score += 90;
      else if (lowerId.includes(q)) score += 30;

      // Tag matches
      const tagMatchCount = item.tags.filter(t => t.includes(q) || q.includes(t)).length;
      score += tagMatchCount * 25;

      // MITRE technique match
      if (item.mitreTechniques && item.mitreTechniques.some(m => m.toLowerCase().includes(q))) {
        score += 50;
      }

      // Description match
      if (lowerDesc.includes(q)) score += 10;

      return { item, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(s => s.item);
  }

  /**
   * Find single best matching item
   */
  public static findExact(query: string): IndexedPlatformItem | null {
    const results = this.search(query, 1);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * List all items of a given category
   */
  public static getByCategory(category: IndexedPlatformItem['category']): IndexedPlatformItem[] {
    return this.items.filter(i => i.category === category);
  }
}
