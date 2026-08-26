import { CyberLab } from '../types/incidentLab';

export const LABS_DATA: CyberLab[] = [
  {
    id: 'eh-l1-001',
    title: 'Linux Permissions Explorer',
    careerTrack: 'ETHICAL_HACKER',
    category: 'EH',
    difficulty: 'BEGINNER',
    description: 'Investigate misconfigured Linux permissions.',
    briefing: 'A configuration file has insecure permissions. Find and fix it.',
    objectives: ['Identify insecure file', 'Fix permissions'],
    terminalEnabled: true,
    timelineEvents: [
        { time: '09:00', description: 'Lab started', isNoise: false },
        { time: '09:05', description: 'Permissions enumerated', isNoise: false }
    ],
    evidenceLocker: [
        { id: 'ev-1', type: 'FILE', title: 'config.conf', description: 'Insecure config', value: '777 permissions', source: 'ls -l', confidence: 'high' }
    ],
    decisionPoints: [
        {
            id: 'decision-1',
            scenario: 'You found the file. What do you do?',
            options: [
                { id: 'opt-1', text: 'Chmod 777', isCorrect: false, feedback: 'Too insecure!' },
                { id: 'opt-2', text: 'Chmod 644', isCorrect: true, feedback: 'Correct!' }
            ]
        }
    ],
    hints: ['Check with ls -l', 'Look for 777'],
    xp: 100
  },
  {
      id: 'soc-l1-001',
      title: 'Suspicious Auth Logs',
      careerTrack: 'SOC_ANALYST',
      category: 'SOC',
      difficulty: 'BEGINNER',
      description: 'Investigate failed login attempts.',
      briefing: 'Failed logins detected. Investigate the source.',
      objectives: ['Identify source IP', 'Classify incident'],
      terminalEnabled: false,
      timelineEvents: [
          { time: '08:00', description: 'Failed logins', isNoise: false },
          { time: '08:05', description: 'Successful login', isNoise: false }
      ],
      evidenceLocker: [
          { id: 'ev-soc-1', type: 'IP', title: 'Source IP', description: 'Failed IP', value: '192.168.1.100', source: 'auth.log', confidence: 'high' }
      ],
      decisionPoints: [
          {
              id: 'decision-1',
              scenario: 'Is this activity suspicious?',
              options: [
                  { id: 'opt-1', text: 'False Positive', isCorrect: false, feedback: 'Look closer at the IP!' },
                  { id: 'opt-2', text: 'Suspicious Activity', isCorrect: true, feedback: 'Correct!' }
              ]
          }
      ],
      hints: ['Check timestamps', 'Analyze frequency'],
      xp: 100
    }
];
