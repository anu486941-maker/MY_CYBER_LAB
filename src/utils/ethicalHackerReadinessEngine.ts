import { UserProfile, UserLearningState, EthicalHackerReadiness } from '../types';

export function calculateEthicalHackerReadiness(
  profile: UserProfile,
  learningState: any,
  evidenceCount: number = 0,
  findingsCount: number = 0,
  reportsCount: number = 0
): EthicalHackerReadiness {
  const completedLessons = learningState.completedLessons || [];
  const completedMissions = learningState.completedMissions || [];
  const labScores = learningState.labScores || {};
  const ctfScores = learningState.ctfScores || {};

  // 1. Networking (Subnetting, TCP/IP, DNS, Wireshark)
  const networkLessons = completedLessons.filter(l => l.includes('net') || l.includes('tcp') || l.includes('dns') || l.includes('subnet') || l.includes('wireshark')).length;
  const networkScore = Math.min(100, Math.round(
    (networkLessons * 12) +
    ((labScores['network-lab'] || 0) * 0.4) +
    ((learningState.quizScores?.['subnet-quiz'] || 0) * 0.3) +
    (profile.cyberLevel * 2)
  ));

  // 2. Linux (CLI, Permissions, SUID, Processes, Syslog)
  const linuxLessons = completedLessons.filter(l => l.includes('linux') || l.includes('bash') || l.includes('suid') || l.includes('perm')).length;
  const linuxScore = Math.min(100, Math.round(
    (linuxLessons * 14) +
    ((labScores['linux-lab'] || 0) * 0.4) +
    (profile.cyberLevel * 2.5)
  ));

  // 3. Web Security (OWASP Top 10, SQLi, XSS, Auth, API)
  const webLessons = completedLessons.filter(l => l.includes('web') || l.includes('sql') || l.includes('xss') || l.includes('owasp') || l.includes('jwt') || l.includes('auth')).length;
  const webScore = Math.min(100, Math.round(
    (webLessons * 15) +
    ((labScores['web-security-lab'] || 0) * 0.4) +
    (profile.cyberLevel * 2)
  ));

  // 4. Reconnaissance (Host Discovery, OSINT, Port Scanning, Footprinting)
  const reconMissions = completedMissions.filter(m => m.includes('recon') || m.includes('nmap') || m.includes('footprint') || m.includes('m1')).length;
  const reconScore = Math.min(100, Math.round(
    (reconMissions * 25) +
    (networkScore * 0.3) +
    (evidenceCount * 5)
  ));

  // 5. Enumeration (Service Versioning, Directory Fuzzing, Banner Grabbing)
  const enumScore = Math.min(100, Math.round(
    (reconScore * 0.5) +
    (webScore * 0.3) +
    (evidenceCount * 6) +
    (profile.cyberLevel * 1.5)
  ));

  // 6. Vulnerability Analysis (CVSS, Exploit Verification, Privilege Escalation)
  const solvedCtfCount = Object.keys(ctfScores).length;
  const vulnScore = Math.min(100, Math.round(
    (findingsCount * 18) +
    (solvedCtfCount * 12) +
    (webScore * 0.25) +
    (linuxScore * 0.25)
  ));

  // 7. Reporting & Documentation (Executive Summaries, Technical Evidence, Retest)
  const reportingScore = Math.min(100, Math.round(
    (reportsCount * 30) +
    (findingsCount * 10) +
    (evidenceCount * 5) +
    (profile.cyberLevel > 3 ? 20 : profile.cyberLevel * 5)
  ));

  // 8. Ethics & Scope Discipline (Rules of Engagement, Authorization, Responsible Disclosure)
  const ethicsScore = Math.min(100, Math.max(75, Math.round(
    90 + (profile.onboardingCompleted ? 5 : 0) + (profile.cyberLevel >= 2 ? 5 : 0)
  )));

  // Weighted Overall Readiness
  const overallScore = Math.min(100, Math.round(
    (networkScore * 0.15) +
    (linuxScore * 0.15) +
    (webScore * 0.15) +
    (reconScore * 0.12) +
    (enumScore * 0.12) +
    (vulnScore * 0.15) +
    (reportingScore * 0.10) +
    (ethicsScore * 0.06)
  ));

  let readinessBand: EthicalHackerReadiness['readinessBand'] = 'NOVICE';
  if (overallScore >= 85) {
    readinessBand = 'JOB_READY_ETHICAL_HACKER';
  } else if (overallScore >= 70) {
    readinessBand = 'PRACTITIONER';
  } else if (overallScore >= 50) {
    readinessBand = 'TRAINEE';
  } else if (overallScore >= 30) {
    readinessBand = 'APPRENTICE';
  }

  return {
    networking: Math.max(10, networkScore),
    linux: Math.max(10, linuxScore),
    webSecurity: Math.max(10, webScore),
    reconnaissance: Math.max(10, reconScore),
    enumeration: Math.max(10, enumScore),
    vulnerabilityAnalysis: Math.max(10, vulnScore),
    reporting: Math.max(10, reportingScore),
    ethicsAndScope: Math.max(75, ethicsScore),
    overallScore: Math.max(15, overallScore),
    readinessBand
  };
}
