/**
 * AI Skill Graph Engine
 * Manages a persistent hierarchical skill graph for cybersecurity competencies.
 */

export interface SkillNode {
  id: string;
  name: string;
  category: 'NETWORKING' | 'WEB_SECURITY' | 'SOC' | 'DFIR' | 'CLOUD' | 'PENTESTING' | 'LINUX' | 'ACTIVE_DIRECTORY';
  score: number; // 0 - 100
  confidence: 'BEGINNER' | 'FAMILIAR' | 'STRONG' | 'MASTERED';
  lastPracticed: string;
  attemptsCount: number;
  mistakesCount: number;
  evidenceCount: number;
  prerequisiteIds: string[];
  recommendedRemediation: {
    videoTitle?: string;
    videoRoute?: string;
    labId?: string;
    labRoute?: string;
    missionId?: string;
  };
}

export const MASTER_SKILL_GRAPH: Record<string, SkillNode> = {
  'net-tcp-ip': {
    id: 'net-tcp-ip',
    name: 'TCP/IP & Packet Inspection',
    category: 'NETWORKING',
    score: 85,
    confidence: 'STRONG',
    lastPracticed: '2026-08-25',
    attemptsCount: 12,
    mistakesCount: 1,
    evidenceCount: 4,
    prerequisiteIds: [],
    recommendedRemediation: {
      videoTitle: 'TCP/IP 3-Way Handshake Deep Dive',
      videoRoute: '/video-learning?videoId=vid-01',
      labId: 'practice-subnetting',
      labRoute: '/practice/subnetting'
    }
  },
  'net-dns': {
    id: 'net-dns',
    name: 'DNS Protocol & Exfiltration Detection',
    category: 'NETWORKING',
    score: 75,
    confidence: 'FAMILIAR',
    lastPracticed: '2026-08-24',
    attemptsCount: 8,
    mistakesCount: 2,
    evidenceCount: 3,
    prerequisiteIds: ['net-tcp-ip'],
    recommendedRemediation: {
      videoTitle: 'DNS Tunneling & Log Triage',
      videoRoute: '/video-learning?videoId=vid-02',
      labId: 'practice-security-tools',
      labRoute: '/practice/security-tools'
    }
  },
  'web-sqli': {
    id: 'web-sqli',
    name: 'SQL Injection & Database Security',
    category: 'WEB_SECURITY',
    score: 60,
    confidence: 'FAMILIAR',
    lastPracticed: '2026-08-26',
    attemptsCount: 15,
    mistakesCount: 4,
    evidenceCount: 6,
    prerequisiteIds: ['net-tcp-ip'],
    recommendedRemediation: {
      videoTitle: 'SQL Injection Exploitation & Remediation',
      videoRoute: '/video-learning?videoId=vid-03',
      labId: 'practice-web-security',
      labRoute: '/practice/web-security'
    }
  },
  'web-xss': {
    id: 'web-xss',
    name: 'Cross-Site Scripting (XSS)',
    category: 'WEB_SECURITY',
    score: 90,
    confidence: 'MASTERED',
    lastPracticed: '2026-08-26',
    attemptsCount: 20,
    mistakesCount: 0,
    evidenceCount: 8,
    prerequisiteIds: ['web-sqli'],
    recommendedRemediation: {
      videoTitle: 'DOM vs Stored XSS Attacks',
      videoRoute: '/video-learning?videoId=vid-04',
      labId: 'practice-web-security',
      labRoute: '/practice/web-security'
    }
  },
  'soc-log-analysis': {
    id: 'soc-log-analysis',
    name: 'SIEM & Log Correlation',
    category: 'SOC',
    score: 65,
    confidence: 'FAMILIAR',
    lastPracticed: '2026-08-26',
    attemptsCount: 10,
    mistakesCount: 3,
    evidenceCount: 5,
    prerequisiteIds: ['net-tcp-ip'],
    recommendedRemediation: {
      videoTitle: 'SIEM Alert Triaging Best Practices',
      videoRoute: '/video-learning?videoId=vid-05',
      labId: 'soc-simulator',
      labRoute: '/practice/soc-simulator'
    }
  },
  'soc-threat-hunting': {
    id: 'soc-threat-hunting',
    name: 'Threat Hunting & Hypothesis Testing',
    category: 'SOC',
    score: 55,
    confidence: 'BEGINNER',
    lastPracticed: '2026-08-20',
    attemptsCount: 5,
    mistakesCount: 3,
    evidenceCount: 2,
    prerequisiteIds: ['soc-log-analysis'],
    recommendedRemediation: {
      videoTitle: 'Proactive Threat Hunting Frameworks',
      videoRoute: '/video-learning?videoId=vid-06',
      labId: 'threat-hunting',
      labRoute: '/practice/threat-hunting'
    }
  },
  'dfir-disk-forensics': {
    id: 'dfir-disk-forensics',
    name: 'Digital Forensics & Artifact Analysis',
    category: 'DFIR',
    score: 50,
    confidence: 'BEGINNER',
    lastPracticed: '2026-08-18',
    attemptsCount: 4,
    mistakesCount: 3,
    evidenceCount: 2,
    prerequisiteIds: ['soc-log-analysis'],
    recommendedRemediation: {
      videoTitle: 'Forensic Evidence Locker & Chain of Custody',
      videoRoute: '/video-learning?videoId=vid-07',
      labId: 'real-cases',
      labRoute: '/real-cases'
    }
  },
  'ad-kerberoast': {
    id: 'ad-kerberoast',
    name: 'Active Directory Kerberoasting & Escalation',
    category: 'ACTIVE_DIRECTORY',
    score: 45,
    confidence: 'BEGINNER',
    lastPracticed: '2026-08-15',
    attemptsCount: 3,
    mistakesCount: 2,
    evidenceCount: 1,
    prerequisiteIds: ['net-tcp-ip'],
    recommendedRemediation: {
      videoTitle: 'Active Directory Attacks & Defense',
      videoRoute: '/video-learning?videoId=vid-08',
      labId: 'master-cyber-range',
      labRoute: '/master-cyber-range'
    }
  }
};

export function getWeakestSkills(skills: Record<string, SkillNode> = MASTER_SKILL_GRAPH): SkillNode[] {
  return Object.values(skills)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
}

export function getCategoryMasteryScores(skills: Record<string, SkillNode> = MASTER_SKILL_GRAPH): Record<string, number> {
  const categories: Record<string, { total: number; count: number }> = {};
  Object.values(skills).forEach(s => {
    if (!categories[s.category]) {
      categories[s.category] = { total: 0, count: 0 };
    }
    categories[s.category].total += s.score;
    categories[s.category].count += 1;
  });

  const result: Record<string, number> = {};
  Object.keys(categories).forEach(cat => {
    result[cat] = Math.round(categories[cat].total / categories[cat].count);
  });
  return result;
}
