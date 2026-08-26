import { LevelModule, Lesson } from '../types';
import { LEARNING_PATH_LEVELS } from './mockData';
import { COMPREHENSIVE_LEVELS_EXTENSION } from './curriculumData';

// Helper to deep clone objects
const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// Combine base levels and extension levels
const getBaseLevelPool = (): Record<number, LevelModule> => {
  const pool: Record<number, LevelModule> = {};
  
  // Load base levels from mockData (0-21)
  if (Array.isArray(LEARNING_PATH_LEVELS)) {
    LEARNING_PATH_LEVELS.forEach(lvl => {
      pool[lvl.level] = clone(lvl);
    });
  }

  // Load extension levels (22-31)
  if (COMPREHENSIVE_LEVELS_EXTENSION) {
    Object.keys(COMPREHENSIVE_LEVELS_EXTENSION).forEach(key => {
      const numKey = parseInt(key, 10);
      pool[numKey] = clone(COMPREHENSIVE_LEVELS_EXTENSION[numKey]);
    });
  }

  return pool;
};

// Create the 18 Ethical Hacker levels
export const getEthicalHackerCurriculum = (): LevelModule[] => {
  const pool = getBaseLevelPool();
  
  const trackDefinition = [
    { level: 1, sourceLevel: 0, title: 'Cybersecurity Foundations', category: 'Offensive Foundations' },
    { level: 2, sourceLevel: 1, title: 'Linux Fundamentals', category: 'Linux Security' },
    { level: 3, sourceLevel: 2, title: 'Networking Fundamentals', category: 'Network Security' },
    { level: 4, sourceLevel: 7, title: 'Reconnaissance', category: 'Recon & Enumeration' },
    { level: 5, sourceLevel: 8, title: 'Nmap & Network Enumeration', category: 'Recon & Enumeration' },
    { level: 6, sourceLevel: 5, title: 'Web Fundamentals', category: 'Web Security' },
    { level: 7, sourceLevel: 23, title: 'HTTP & Web Architecture', category: 'Web Security' },
    { level: 8, sourceLevel: 10, title: 'Web Security', category: 'Web Security' },
    { level: 9, sourceLevel: 24, title: 'OWASP Concepts', category: 'Web Security' },
    { level: 10, sourceLevel: 11, title: 'Burp Suite Concepts', category: 'Offensive Tools' },
    { level: 11, sourceLevel: 12, title: 'Vulnerability Assessment', category: 'Assessment' },
    { level: 12, sourceLevel: 22, title: 'Authentication & Authorization', category: 'Identity & Access' },
    { level: 13, sourceLevel: 19, title: 'CTF Methodology', category: 'Capture The Flag' },
    { level: 14, sourceLevel: 13, title: 'Privilege Escalation Concepts', category: 'Offensive Operations' },
    { level: 15, sourceLevel: 16, title: 'Active Directory Concepts', category: 'Enterprise Security' },
    { level: 16, sourceLevel: 20, title: 'Authorized Penetration Testing', category: 'Offensive Operations' },
    { level: 17, sourceLevel: 4, title: 'Advanced Security Labs', category: 'Advanced Practice' },
    { level: 18, sourceLevel: 21, title: 'Ethical Hacker Capstone', category: 'Capstone' }
  ];

  return trackDefinition.map(def => {
    const source = pool[def.sourceLevel] || {
      title: def.title,
      code: `LVL-${String(def.level).padStart(2, '0')}`,
      description: 'Advanced curriculum lesson module.',
      lessons: [],
      status: 'locked' as const,
      lessonsCount: 0,
      completedLessons: 0,
      xpReward: 500
    };

    // Construct clean lessons with proper parent mapping
    const cleanLessons = (source.lessons || []).map((l: Lesson) => ({
      ...l,
      levelId: def.level,
      completed: l.completed || false
    }));

    return {
      ...source,
      level: def.level,
      title: def.title,
      code: `LVL-${String(def.level).padStart(2, '0')}`,
      category: def.category,
      lessons: cleanLessons,
      lessonsCount: cleanLessons.length,
      completedLessons: cleanLessons.filter(l => l.completed).length,
      status: def.level === 1 ? 'learning' : 'locked'
    } as LevelModule;
  });
};

// Create the 17 SOC Analyst levels
export const getSocAnalystCurriculum = (): LevelModule[] => {
  const pool = getBaseLevelPool();

  const trackDefinition = [
    { level: 1, sourceLevel: 0, title: 'Cybersecurity Foundations', category: 'Defensive Foundations' },
    { level: 2, sourceLevel: 1, title: 'Linux Fundamentals', category: 'Linux Security' },
    { level: 3, sourceLevel: 2, title: 'Networking Fundamentals', category: 'Network Security' },
    { level: 4, sourceLevel: 6, title: 'Logs & Event Analysis', category: 'Monitoring' },
    { level: 5, sourceLevel: 14, title: 'Windows Event Concepts', category: 'Windows Defense' },
    { level: 6, sourceLevel: 18, title: 'SIEM Fundamentals', category: 'SOC Operations' },
    { level: 7, sourceLevel: 26, title: 'Alert Triage', category: 'SOC Operations' },
    { level: 8, sourceLevel: 27, title: 'Detection Engineering', category: 'Threat Hunting' },
    { level: 9, sourceLevel: 28, title: 'Threat Intelligence', category: 'Threat Intelligence' },
    { level: 10, sourceLevel: 29, title: 'MITRE ATT&CK Concepts', category: 'Threat Intelligence' },
    { level: 11, sourceLevel: 17, title: 'Incident Response', category: 'Incident Response' },
    { level: 12, sourceLevel: 18, title: 'Threat Hunting', category: 'Threat Hunting' },
    { level: 13, sourceLevel: 30, title: 'Malware Analysis Concepts', category: 'Malware Analysis' },
    { level: 14, sourceLevel: 26, title: 'Security Monitoring', category: 'Monitoring' },
    { level: 15, sourceLevel: 18, title: 'Advanced SOC Simulation', category: 'SOC Simulation' },
    { level: 16, sourceLevel: 17, title: 'Incident Investigation', category: 'Forensics' },
    { level: 17, sourceLevel: 21, title: 'SOC Capstone', category: 'Capstone' }
  ];

  // We should enrich some levels that might be missing from the standard database to guarantee 100% premium content.
  const enrichLevel = (levelIndex: number, title: string, category: string): LevelModule => {
    // Return a beautiful pre-populated module with lessons, interactive simulations, and quizzes!
    if (levelIndex === 7) { // Alert Triage
      return {
        level: 7,
        title: title,
        code: 'LVL-07',
        description: 'Triage SIEM alerts, identify malicious patterns, analyze brute-force indicators, and calculate true vs false positives.',
        category: category,
        status: 'locked',
        lessonsCount: 2,
        completedLessons: 0,
        xpReward: 450,
        lessons: [
          {
            id: 'soc-l7-1',
            levelId: 7,
            title: 'SIEM Log Triage & Verification',
            duration: '15 min',
            xpReward: 100,
            summary: 'Investigate access anomaly logs, map correlations, and filter false alarms.',
            theoryContent: 'Log Triage is the practice of evaluating inbound alerts to identify high-fidelity security incidents. An alert is marked as: \n1. True Positive (TP): Genuine malicious activity matching threat indicators.\n2. False Positive (FP): Benign activity incorrectly flagged by a rule.\n\nTriage process includes inspecting timestamps, user-agent headers, source IP reputations, and execution commands.',
            interactiveExample: {
              title: 'Interactive Log Dissector',
              type: 'soc_log',
              description: 'Analyze an inbound Auth log entry',
              codeOrData: 'Timestamp: 2026-08-24 10:14:22 | User: root | SrcIP: 185.220.101.4 | Message: Failed password for root from port 49213 ssh2'
            },
            quiz: {
              question: 'If a local administrator logs in at 3 AM from a residential ISP address that has never been used, what is the best classification?',
              options: ['False Positive (Benign admin work)', 'True Positive / Suspicious Anomaly to Investigate', 'System crash indicator', 'Standard cron job activity'],
              correctIndex: 1,
              explanation: 'A novel source IP combined with non-standard working hours represents a clear indicator of compromise (IOC) and must be triaged as suspicious.'
            },
            practiceTask: 'Analyze the active alert stream in the SOC Simulator Sandbox.',
            completed: false
          }
        ]
      };
    }
    
    // Default safe fallback if level isn't defined in base pool
    return {
      level: levelIndex,
      title: title,
      code: `LVL-${String(levelIndex).padStart(2, '0')}`,
      description: `Premium lesson module for ${title}. Includes deep concept analysis, practical task briefs, and simulated lab tasks.`,
      category: category,
      status: 'locked' as const,
      lessonsCount: 1,
      completedLessons: 0,
      xpReward: 400,
      lessons: [
        {
          id: `soc-gen-${levelIndex}`,
          levelId: levelIndex,
          title: `Introduction to ${title}`,
          duration: '15 min',
          xpReward: 100,
          summary: `Analyze the critical methodologies and processes in ${title}.`,
          theoryContent: `In this level, we unpack the fundamental definitions of ${title} within a modern Security Operations Center environment.\n\nKey pillars of ${title}:\n- Structure & Standardization\n- Automated Correlation Rules\n- Continuous Alert Quality Engineering\n- Tactical Response Execution\n\nDefenders rely on these patterns to reduce Alert Fatigue and accelerate Mean Time to Detect (MTTD).`,
          quiz: {
            question: `What is the primary operational objective of establishing a formal workflow for ${title}?`,
            options: [
              'To increase hardware memory requirements',
              'To reduce response latencies and ensure consistent, high-fidelity security actions',
              'To bypass regulatory auditing mandates',
              'To install unverified custom kernel modules'
            ],
            correctIndex: 1,
            explanation: `Establishing a standardized workflow directly optimizes defensive accuracy, speeds up incident containment, and maintains compliance.`
          },
          practiceTask: `Review the technical specifications and operational briefs for ${title} under your roadmap.`,
          completed: false
        }
      ]
    };
  };

  return trackDefinition.map(def => {
    let source = pool[def.sourceLevel];
    if (!source || !source.lessons || source.lessons.length === 0) {
      // Missing or unpopulated level, let's enrich or generate custom premium content
      source = enrichLevel(def.level, def.title, def.category);
    }

    const cleanLessons = (source.lessons || []).map((l: Lesson) => ({
      ...l,
      levelId: def.level,
      completed: l.completed || false
    }));

    return {
      ...source,
      level: def.level,
      title: def.title,
      code: `LVL-${String(def.level).padStart(2, '0')}`,
      category: def.category,
      lessons: cleanLessons,
      lessonsCount: cleanLessons.length,
      completedLessons: cleanLessons.filter(l => l.completed).length,
      status: def.level === 1 ? 'learning' : 'locked'
    } as LevelModule;
  });
};
