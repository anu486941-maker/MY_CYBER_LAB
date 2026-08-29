import { UserProfile, CareerRoleId } from '../types';
import { SkillMasteryRecord, LearnerMistake } from '../types/intelligence';

export interface ReadinessPillar {
  name: string;
  score: number; // 0 to 100
  weight: number;
  description: string;
  status: 'EXCELLENT' | 'PROFICIENT' | 'DEVELOPING' | 'NEEDS_FOCUS';
}

export interface CareerReadinessReport {
  overallScore: number; // 0 to 100
  roleTitle: string;
  targetRole: CareerRoleId;
  pillars: {
    technicalKnowledge: ReadinessPillar;
    practicalExecution: ReadinessPillar;
    linuxProficiency: ReadinessPillar;
    networkEngineering: ReadinessPillar;
    webSecurity: ReadinessPillar;
    socAnalysis: ReadinessPillar;
    incidentResponse: ReadinessPillar;
    documentationReporting: ReadinessPillar;
    independentProblemSolving: ReadinessPillar;
  };
  topStrengths: { name: string; score: number; takeaway: string }[];
  criticalGaps: { name: string; score: number; remediation: string; targetRoute: string }[];
  biggestGap: { name: string; score: number; remediation: string; targetRoute: string } | null;
  careerReadinessTier: 'JUNIOR_READY' | 'ASSOCIATE_READY' | 'DEVELOPING_CANDIDATE' | 'FOUNDATIONAL';
  mentorDebrief: string;
}

export class CareerReadinessService {
  /**
   * Computes comprehensive, multi-pillar job readiness for cybersecurity roles
   */
  static calculateReadiness(params: {
    profile: UserProfile;
    skillMasteries: SkillMasteryRecord[];
    mistakes: LearnerMistake[];
    completedMissionsCount: number;
    labScores?: Record<string, number>;
    evidenceCount?: number;
    reportsCount?: number;
  }): CareerReadinessReport {
    const { 
      profile, 
      skillMasteries, 
      mistakes, 
      completedMissionsCount, 
      labScores = {},
      evidenceCount = 0,
      reportsCount = 0
    } = params;

    const role = (profile.selectedRole || profile.targetRole || 'soc-analyst') as CareerRoleId;

    // Helper to get average category mastery
    const getCatMastery = (categoryMatch: string, defaultScore = 50) => {
      const matching = skillMasteries.filter(s => 
        s.category.toLowerCase().includes(categoryMatch.toLowerCase())
      );
      if (matching.length === 0) return defaultScore;
      const total = matching.reduce((acc, curr) => acc + curr.masteryPercentage, 0);
      return Math.min(100, Math.round(total / matching.length));
    };

    // Calculate pillars
    const linuxScore = getCatMastery('linux', 45);
    const networkScore = getCatMastery('network', 40);
    const webScore = getCatMastery('web', 35);
    const socScore = getCatMastery('soc', 50);
    const incidentScore = getCatMastery('incident', 45);

    // Knowledge (theory + assessments)
    const completedAssessments = skillMasteries.filter(s => s.assessmentCompleted).length;
    const technicalKnowledge = Math.min(100, Math.round(
      (skillMasteries.reduce((a, s) => a + s.masteryPercentage, 0) / Math.max(1, skillMasteries.length)) * 0.7 +
      (completedAssessments * 5)
    ));

    // Practical Execution (labs + missions completed)
    const labsDone = Object.keys(labScores).length;
    const practicalExecution = Math.min(100, Math.round(
      (labsDone * 8) + (completedMissionsCount * 12) + (profile.xp > 500 ? 25 : 10)
    ));

    // Documentation & Reporting (evidence gathered + report generated)
    const documentationReporting = Math.min(100, Math.round(
      Math.max(20, (evidenceCount * 10) + (reportsCount * 25) + (completedMissionsCount * 5))
    ));

    // Independent Problem Solving (inverse of unresolved mistakes & hint dependency)
    const resolvedMistakes = mistakes.filter(m => m.resolved).length;
    const pendingMistakes = mistakes.filter(m => !m.resolved).length;
    const totalMistakes = mistakes.length;
    const mistakePenalty = pendingMistakes * 8;
    const hintCount = skillMasteries.reduce((a, s) => a + (s.hintsUsedCount || 0), 0);
    const independentProblemSolving = Math.max(20, Math.min(100, Math.round(
      75 + (resolvedMistakes * 10) - mistakePenalty - (hintCount * 2) + (labsDone * 3)
    )));

    const getStatus = (score: number): 'EXCELLENT' | 'PROFICIENT' | 'DEVELOPING' | 'NEEDS_FOCUS' => {
      if (score >= 80) return 'EXCELLENT';
      if (score >= 65) return 'PROFICIENT';
      if (score >= 45) return 'DEVELOPING';
      return 'NEEDS_FOCUS';
    };

    const pillars = {
      technicalKnowledge: {
        name: 'Technical Knowledge',
        score: technicalKnowledge,
        weight: 0.15,
        description: 'Command of cybersecurity protocols, attack patterns, and defense frameworks.',
        status: getStatus(technicalKnowledge)
      },
      practicalExecution: {
        name: 'Practical CLI & Tool Execution',
        score: practicalExecution,
        weight: 0.20,
        description: 'Hands-on agility with nmap, curl, auth.log analysis, and terminal workflows.',
        status: getStatus(practicalExecution)
      },
      linuxProficiency: {
        name: 'Linux Systems & Permissions',
        score: linuxScore,
        weight: 0.12,
        description: 'Proficiency in Unix file permissions, SUID binaries, and process auditing.',
        status: getStatus(linuxScore)
      },
      networkEngineering: {
        name: 'Networking & Packet Diagnostics',
        score: networkScore,
        weight: 0.12,
        description: 'Understanding of TCP/IP, CIDR subnetting, ports, and traffic analysis.',
        status: getStatus(networkScore)
      },
      webSecurity: {
        name: 'Web Application Security',
        score: webScore,
        weight: 0.10,
        description: 'OWASP Top 10 vulnerabilities, injection flaws, and authentication auditing.',
        status: getStatus(webScore)
      },
      socAnalysis: {
        name: 'SOC Alert Triage & SIEM',
        score: socScore,
        weight: 0.10,
        description: 'Ability to distinguish true positives from false positives and analyze logs.',
        status: getStatus(socScore)
      },
      incidentResponse: {
        name: 'Incident Response & Containment',
        score: incidentScore,
        weight: 0.08,
        description: 'Methodology for scoping, IOC extraction, containment, and recovery.',
        status: getStatus(incidentScore)
      },
      documentationReporting: {
        name: 'Professional Documentation & Reporting',
        score: documentationReporting,
        weight: 0.08,
        description: 'Structuring findings, evidence correlation, and executive risk summaries.',
        status: getStatus(documentationReporting)
      },
      independentProblemSolving: {
        name: 'Independent Problem Solving',
        score: independentProblemSolving,
        weight: 0.05,
        description: 'Executing complex scenarios with minimal hint dependency and high accuracy.',
        status: getStatus(independentProblemSolving)
      }
    };

    // Overall weighted score
    const overallScore = Math.min(100, Math.round(
      (technicalKnowledge * pillars.technicalKnowledge.weight) +
      (practicalExecution * pillars.practicalExecution.weight) +
      (linuxScore * pillars.linuxProficiency.weight) +
      (networkScore * pillars.networkEngineering.weight) +
      (webScore * pillars.webSecurity.weight) +
      (socScore * pillars.socAnalysis.weight) +
      (incidentScore * pillars.incidentResponse.weight) +
      (documentationReporting * pillars.documentationReporting.weight) +
      (independentProblemSolving * pillars.independentProblemSolving.weight)
    ));

    // Sort pillars to find strengths and gaps
    const pillarList = Object.values(pillars);
    const sortedByScore = [...pillarList].sort((a, b) => b.score - a.score);

    const topStrengths = sortedByScore.slice(0, 3).map(p => ({
      name: p.name,
      score: p.score,
      takeaway: `Demonstrates high competency in ${p.name.toLowerCase()} (${p.score}% index).`
    }));

    const gapCandidates = [...sortedByScore].reverse().filter(p => p.score < 70);
    const criticalGaps = gapCandidates.slice(0, 3).map(p => {
      let route = '/labs';
      let remediation = `Complete hands-on exercises in ${p.name.toLowerCase()} to bring proficiency above 70%.`;

      if (p.name.includes('Linux')) {
        route = '/linux-lab';
        remediation = 'Practice Linux permissions and core command auditing in the interactive terminal.';
      } else if (p.name.includes('Networking')) {
        route = '/networking-lab';
        remediation = 'Execute subnetting calculations and packet analysis drills.';
      } else if (p.name.includes('Web')) {
        route = '/web-security-lab';
        remediation = 'Investigate SQL injection and authentication bypass vulnerabilities.';
      } else if (p.name.includes('SOC')) {
        route = '/soc-simulator';
        remediation = 'Handle simulated SOC queue shifts to sharpen alert triage.';
      } else if (p.name.includes('Documentation')) {
        route = '/security-report';
        remediation = 'Compile an authorized assessment finding into a professional security report.';
      }

      return {
        name: p.name,
        score: p.score,
        remediation,
        targetRoute: route
      };
    });

    const biggestGap = criticalGaps[0] || null;

    let careerReadinessTier: 'JUNIOR_READY' | 'ASSOCIATE_READY' | 'DEVELOPING_CANDIDATE' | 'FOUNDATIONAL' = 'FOUNDATIONAL';
    if (overallScore >= 80) {
      careerReadinessTier = 'JUNIOR_READY';
    } else if (overallScore >= 65) {
      careerReadinessTier = 'ASSOCIATE_READY';
    } else if (overallScore >= 45) {
      careerReadinessTier = 'DEVELOPING_CANDIDATE';
    }

    let mentorDebrief = `Your current Cybersecurity Career Readiness index stands at ${overallScore}%. `;
    if (biggestGap) {
      mentorDebrief += `Your primary growth bottleneck is ${biggestGap.name} (${biggestGap.score}%). Resolving this with target exercises will elevate your profile toward ${careerReadinessTier === 'JUNIOR_READY' ? 'enterprise deployment' : 'job-ready status'}.`;
    } else {
      mentorDebrief += 'All core pillars are balanced. You are ready to tackle capstone assessments and live job simulations.';
    }

    const roleTitles: Record<string, string> = {
      'soc-analyst': 'Junior SOC Analyst',
      'ethical-hacker': 'Junior Ethical Hacker / Pentester',
      'network-engineer': 'Network Security Specialist',
      'incident-responder': 'Digital Forensics & Incident Responder',
      'cloud-security': 'Cloud Security Associate',
      'threat-hunter': 'Cyber Threat Hunter'
    };

    return {
      overallScore,
      roleTitle: roleTitles[role] || 'Cybersecurity Practitioner',
      targetRole: role,
      pillars,
      topStrengths,
      criticalGaps,
      biggestGap,
      careerReadinessTier,
      mentorDebrief
    };
  }
}
