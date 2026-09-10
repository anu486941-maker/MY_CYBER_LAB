/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/missions/MissionRegistry.ts
 * Purpose: Authoritative Catalog of Structured Scenarios, Engagements, and Missions
 */

import { CyberMission } from '../types';

export class MissionRegistry {
  private static readonly MISSIONS: CyberMission[] = [
    {
      id: 'mission-nightfall-webforge',
      missionCode: 'OP-NIGHTFALL-01',
      title: 'Operation Nightfall: External Perimeter & Web Assessment',
      clientOrganization: 'Nightfall Logistics Corp',
      classification: 'AUTHORIZED_TRAINING',
      difficulty: 'EASY',
      category: 'WEB_APPLICATION',
      scenarioBriefing: 'Client Nightfall Logistics has authorized a black-box external security evaluation of their staging intranet web server. The goal is to discover exposed attack surface, exploit software misconfigurations, obtain authorized low-privileged access, and escalate to root.',
      targetMachines: ['m-webforge-01'],
      rulesOfEngagement: {
        engagementId: 'roe-nightfall-01',
        clientName: 'Nightfall Logistics Corp',
        authorizedScope: ['10.20.0.0/24', 'webforge.internal'],
        prohibitedScope: ['10.20.1.0/24', '192.168.0.0/16', 'public internet'],
        rules: [
          'Perform scanning and enumeration strictly within the 10.20.0.0/24 subnet.',
          'Do not perform Denial-of-Service (DoS) attacks or flood network interfaces.',
          'Capture user and root flags as cryptographic proof of access.',
          'Document every discovered vulnerability with CVSS score and precise remediation.'
        ],
        authorizedTools: ['nmap', 'curl', 'python3', 'ssh', 'nikto', 'gobuster', 'nc'],
        timeLimitMinutes: 60,
        testingWindow: 'Continuous 24/7 Training Range Window',
        emergencyContact: 'soc-escalation@nightfall.corp'
      },
      objectives: [
        {
          id: 'obj-recon-01',
          phase: 'RECONNAISSANCE',
          title: 'Discover Target & Identify Open Services',
          description: 'Scan subnet 10.20.0.0/24, discover host 10.20.0.10, and identify active open ports (SSH, HTTP, API).',
          verificationMethod: 'TERMINAL_OUTPUT',
          targetMachineId: 'm-webforge-01',
          points: 25,
          isCompleted: false,
          mitreAttackId: 'T1046 - Network Service Discovery',
          validationCriteria: {
            expectedRegex: '80/tcp\\s+open|8080/tcp\\s+open'
          }
        },
        {
          id: 'obj-enum-02',
          phase: 'ENUMERATION',
          title: 'Extract Exposed Database Backup Credentials',
          description: 'Locate the sensitive backup script /backup/db_config.php.bak and recover developer SSH credentials.',
          verificationMethod: 'EVIDENCE_RECORD',
          targetMachineId: 'm-webforge-01',
          points: 50,
          isCompleted: false,
          mitreAttackId: 'T1083 - File and Directory Discovery',
          validationCriteria: {
            requiredArtifactSha256: '9f83c605d442'
          }
        },
        {
          id: 'obj-access-03',
          phase: 'INITIAL_ACCESS',
          title: 'Obtain Low-Privileged Foothold (User Flag)',
          description: 'Authenticate via SSH as "developer" and submit the user flag from /home/developer/user.txt.',
          verificationMethod: 'FLAG_SUBMISSION',
          targetMachineId: 'm-webforge-01',
          points: 75,
          isCompleted: false,
          mitreAttackId: 'T1078 - Valid Accounts',
          validationCriteria: {
            expectedFlagHash: '7051af69e69b4733a1ba74fd1b159ef270e7180d3a7f9156dd1a56470869bc2f'
          }
        },
        {
          id: 'obj-privesc-04',
          phase: 'PRIVILEGE_ESCALATION',
          title: 'Escalate Privileges to Root (Root Flag)',
          description: 'Discover sudo wildcard permissions on /usr/bin/tar and obtain administrative root access.',
          verificationMethod: 'FLAG_SUBMISSION',
          targetMachineId: 'm-webforge-01',
          points: 100,
          isCompleted: false,
          mitreAttackId: 'T1548.003 - Sudo and Sudo Caching',
          validationCriteria: {
            expectedFlagHash: '82f933781747c58411df7eca95214e433fd368c5c45522cb066ca71937ecefa1'
          }
        },
        {
          id: 'obj-remediation-05',
          phase: 'REMEDIATION_VERIFICATION',
          title: 'Submit Penetration Testing Report with Hardening Recommendations',
          description: 'Document the full attack path, provide CVSS severity ratings, and recommend defensive fixes.',
          verificationMethod: 'REPORT_SUBMISSION',
          targetMachineId: 'm-webforge-01',
          points: 50,
          isCompleted: false,
          mitreAttackId: 'M1028 - Operating System Configuration',
          validationCriteria: {}
        }
      ],
      graduatedHints: {
        'obj-recon-01': [
          {
            level: 1,
            title: 'Initial Discovery Focus',
            hintContent: 'What tool can probe all 65,535 TCP ports on the 10.20.0.0/24 subnet to find open service banners?',
            costXp: 0,
            pedagogicalFocus: 'CONCEPTUAL_QUESTION'
          },
          {
            level: 2,
            title: 'Enumeration Technique',
            hintContent: 'Use nmap with service detection flags (-sV -sC) to uncover web services running on non-standard ports like 8080.',
            costXp: 5,
            pedagogicalFocus: 'TECHNIQUE_CATEGORY'
          },
          {
            level: 3,
            title: 'Exact Command Formulation',
            hintContent: 'Execute: nmap -sV -sC -p 22,80,8080 10.20.0.10',
            costXp: 15,
            pedagogicalFocus: 'CONSTRAINED_HINT'
          }
        ],
        'obj-privesc-04': [
          {
            level: 1,
            title: 'Linux Enumeration',
            hintContent: 'Check what elevated commands your current user is allowed to run with: sudo -l',
            costXp: 0,
            pedagogicalFocus: 'CONCEPTUAL_QUESTION'
          },
          {
            level: 2,
            title: 'GTFOBins Tar Privilege Escalation',
            hintContent: 'Tar has checkpoint execution options (--checkpoint=1 --checkpoint-action=exec=sh) that can execute shell commands with elevated sudo privileges.',
            costXp: 10,
            pedagogicalFocus: 'TECHNIQUE_CATEGORY'
          }
        ]
      },
      estimatedTimeMinutes: 45,
      xpReward: 300,
      requiredCurriculumLevel: 3,
      requiredPrerequisiteConcepts: ['c1_linux_fs_perms', 'c2_tcp_handshake', 'c4_nmap_scanning'],
      careerPathAlignment: ['PENETRATION_TESTER', 'SOC_ANALYST', 'BLUE_TEAM'],
      dualLensDefensiveScenario: {
        detectionObjective: 'Identify the sudo tar invocation in /var/log/auth.log and extract the timestamp.',
        patchObjective: 'Remove the NOPASSWD line from /etc/sudoers.d/developer.',
        mitigationCommand: 'sudo rm /etc/sudoers.d/developer'
      }
    },
    {
      id: 'mission-blackout-pivot',
      missionCode: 'OP-BLACKOUT-02',
      title: 'Operation Blackout: Active Directory Lateral Movement & Kerberoasting',
      clientOrganization: 'Blackout Financial Systems',
      classification: 'CONFIDENTIAL_ENGAGEMENT',
      difficulty: 'HARD',
      category: 'ACTIVE_DIRECTORY',
      scenarioBriefing: 'Conduct an authorized simulated penetration test against Blackout Financial Systems. Compromise the Linux gateway, pivot into the internal Active Directory subnet (10.30.0.0/24), perform Kerberoasting to extract service tickets, crack offline hashes, and compromise the domain controller.',
      targetMachines: ['m-blackout-boss'],
      rulesOfEngagement: {
        engagementId: 'roe-blackout-02',
        clientName: 'Blackout Financial Systems',
        authorizedScope: ['10.30.0.0/24', 'gateway.blackout.corp', 'dc01.blackout.corp'],
        prohibitedScope: ['10.30.50.0/24', '192.168.1.0/24', 'public internet'],
        rules: [
          'Target exclusively the 10.30.0.0/24 Active Directory lab subnet.',
          'Record all Kerberos ticket requests (TGS/TGT) and correlate against simulated SIEM logs.',
          'Provide cryptographic proof of Domain Administrator flag acquisition.'
        ],
        authorizedTools: ['nmap', 'impacket', 'hashcat', 'john', 'curl', 'ssh', 'smbclient'],
        timeLimitMinutes: 90,
        testingWindow: 'Standard Engagement Window',
        emergencyContact: 'ciso@blackout.corp'
      },
      objectives: [
        {
          id: 'obj-bo-recon',
          phase: 'RECONNAISSANCE',
          title: 'Gateway Reconnaissance & Port Enumeration',
          description: 'Identify exposed Kerberos (88), SMB (445), and HTTP services on 10.30.0.15.',
          verificationMethod: 'TERMINAL_OUTPUT',
          targetMachineId: 'm-blackout-boss',
          points: 50,
          isCompleted: false,
          mitreAttackId: 'T1046 - Network Service Discovery',
          validationCriteria: {
            expectedRegex: '88/tcp\\s+open|445/tcp\\s+open'
          }
        },
        {
          id: 'obj-bo-kerberoast',
          phase: 'INITIAL_ACCESS',
          title: 'Execute Kerberoasting Attack & Crack Service Account Ticket',
          description: 'Request TGS for svc_sql and crack the RC4 ticket hash to recover the plaintext service account password.',
          verificationMethod: 'EVIDENCE_RECORD',
          targetMachineId: 'm-blackout-boss',
          points: 100,
          isCompleted: false,
          mitreAttackId: 'T1558.003 - Steal or Forge Kerberos Tickets: Kerberoasting',
          validationCriteria: {}
        },
        {
          id: 'obj-bo-da-flag',
          phase: 'PRIVILEGE_ESCALATION',
          title: 'Domain Admin Flag Submission',
          description: 'Authenticate as Domain Admin on DC01 and submit the root flag C:\\Flags\\da_flag.txt.',
          verificationMethod: 'FLAG_SUBMISSION',
          targetMachineId: 'm-blackout-boss',
          points: 150,
          isCompleted: false,
          mitreAttackId: 'T1078.002 - Domain Accounts',
          validationCriteria: {
            expectedFlagHash: '34f572bad9fbfc4b07adc0f955b610789fea64b0545a931fb8028b273be6e9a8'
          }
        }
      ],
      graduatedHints: {},
      estimatedTimeMinutes: 90,
      xpReward: 500,
      requiredCurriculumLevel: 10,
      requiredPrerequisiteConcepts: ['c10_kerberos_attacks', 'c2_tcp_handshake', 'c8_suid_capabilities'],
      careerPathAlignment: ['PENETRATION_TESTER', 'BLUE_TEAM', 'SOC_ANALYST']
    },
    {
      id: 'mission-aisec-promptguard',
      missionCode: 'OP-AISEC-03',
      title: 'Operation NeuroGuard: Adversarial AI Red Teaming',
      clientOrganization: 'NeuroGuard AI Labs',
      classification: 'AUTHORIZED_TRAINING',
      difficulty: 'MEDIUM',
      category: 'AI_SECURITY',
      scenarioBriefing: 'Perform authorized adversarial testing against an enterprise RAG and automated AI support agent. Evaluate prompt injection vulnerabilities, verify system prompt boundary containment, and test defensive guardrail bypass resistance.',
      targetMachines: ['m-aisec-01'],
      rulesOfEngagement: {
        engagementId: 'roe-aisec-03',
        clientName: 'NeuroGuard AI Labs',
        authorizedScope: ['10.40.0.0/24', 'ai-gateway.neuroguard.corp'],
        prohibitedScope: ['public internet', '10.40.1.0/24'],
        rules: [
          'Execute prompt injection testing strictly against the simulated AI API endpoint on port 8000.',
          'Extract the confidential system prompt and evaluate excessive tool agency.'
        ],
        authorizedTools: ['curl', 'python3', 'burp'],
        timeLimitMinutes: 45,
        testingWindow: 'AI Red Team Lab Window',
        emergencyContact: 'ai-safety@neuroguard.corp'
      },
      objectives: [
        {
          id: 'obj-ai-extract',
          phase: 'VULNERABILITY_ASSESSMENT',
          title: 'Bypass Delimiter Isolation & Extract System Token',
          description: 'Craft an adversarial prompt that causes the AI assistant to leak its system instructions and security token.',
          verificationMethod: 'FLAG_SUBMISSION',
          targetMachineId: 'm-aisec-01',
          points: 100,
          isCompleted: false,
          mitreAttackId: 'AML.T0051 - LLM Prompt Injection',
          validationCriteria: {
            expectedFlagHash: '7c4a8d09ca3762af61e59520943dc26494f8941b'
          }
        }
      ],
      graduatedHints: {},
      estimatedTimeMinutes: 40,
      xpReward: 350,
      requiredCurriculumLevel: 19,
      requiredPrerequisiteConcepts: ['c19_prompt_injection_defense', 'c19_insecure_tool_agency'],
      careerPathAlignment: ['AI_SECURITY', 'PENETRATION_TESTER']
    }
  ];

  public static getAllMissions(): CyberMission[] {
    return [...this.MISSIONS];
  }

  public static getMissionById(id: string): CyberMission | undefined {
    return this.MISSIONS.find(m => m.id === id || m.missionCode.toLowerCase() === id.toLowerCase());
  }

  public static getMissionsByCategory(category: string): CyberMission[] {
    return this.MISSIONS.filter(m => m.category === category);
  }
}
