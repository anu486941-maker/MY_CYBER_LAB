/**
 * Structured Learner Performance Memory System
 * Maintains long-term learning history without storing sensitive PII.
 * Allows users to inspect and reset their learning memory at any time.
 */

export interface LearnerMemory {
  selectedRole: string;
  preferredPace: 'SLOW' | 'BALANCED' | 'FAST_TRACK';
  weakSkills: string[];
  completedTopics: string[];
  recurringMistakes: {
    topic: string;
    description: string;
    occurrencesCount: number;
    lastOccurred: string;
  }[];
  successfulTechniques: string[];
  currentLearningObjectives: string[];
  lastUpdated: string;
}

const MEMORY_STORAGE_KEY = 'mcl_learner_performance_memory_v1';

export function loadLearnerMemory(): LearnerMemory {
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse learner memory from localStorage:', err);
  }

  return {
    selectedRole: 'soc-analyst',
    preferredPace: 'BALANCED',
    weakSkills: ['SQL Injection', 'SIEM Log Correlation'],
    completedTopics: ['Linux Terminal Navigation', 'HTTP Basics'],
    recurringMistakes: [
      {
        topic: 'SQL Injection',
        description: 'Forgot single quote parameter escaping check',
        occurrencesCount: 2,
        lastOccurred: new Date().toISOString()
      }
    ],
    successfulTechniques: ['Nmap Port Scanning', 'Wireshark Stream Analysis'],
    currentLearningObjectives: ['Master Authoritative Incident Response', 'Obtain SOC Analyst Foundations Certificate'],
    lastUpdated: new Date().toISOString()
  };
}

export function saveLearnerMemory(memory: LearnerMemory): void {
  try {
    memory.lastUpdated = new Date().toISOString();
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
  } catch (err) {
    console.warn('Failed to save learner memory:', err);
  }
}

export function resetLearnerMemory(): LearnerMemory {
  const freshMemory: LearnerMemory = {
    selectedRole: 'soc-analyst',
    preferredPace: 'BALANCED',
    weakSkills: [],
    completedTopics: [],
    recurringMistakes: [],
    successfulTechniques: [],
    currentLearningObjectives: ['Select career role and begin foundational training'],
    lastUpdated: new Date().toISOString()
  };
  saveLearnerMemory(freshMemory);
  return freshMemory;
}
