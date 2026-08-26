export type LabCategory = 'SOC' | 'EH';
export type LabDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'CAPSTONE';

export interface EvidenceItem {
  id: string;
  type: 'IP' | 'DOMAIN' | 'URL' | 'HASH' | 'USER' | 'LOG' | 'FILE';
  title: string;
  description: string;
  value: string;
  source: string;
  confidence: 'low' | 'medium' | 'high';
  discoveredAtStep?: string;
}

export interface DecisionPoint {
  id: string;
  scenario: string;
  options: { id: string; text: string; isCorrect: boolean; feedback: string }[];
}

export interface CyberLab {
  id: string;
  title: string;
  careerTrack: 'SOC_ANALYST' | 'ETHICAL_HACKER';
  category: LabCategory;
  difficulty: LabDifficulty;
  description: string;
  briefing: string;
  objectives: string[];
  terminalEnabled: boolean;
  timelineEvents: { time: string; description: string; isNoise: boolean }[];
  evidenceLocker: EvidenceItem[];
  decisionPoints: DecisionPoint[];
  hints: string[];
  xp: number;
}
