import { ThreatHuntingCase } from '../types';

export const THREAT_HUNTING_CASES: ThreatHuntingCase[] = [
  {
    id: 'th-case-01',
    caseNumber: 'CASE-2026-088',
    title: 'Operation Silent Night: Ransomware Precursor Investigation',
    scenario: 'A finance department workstation reported abnormal CPU spikes and encrypted backup shares. Reconstruct the full attack chain from initial spearphishing to ransomware deployment.',
    threatActor: 'FIN7 / Wizard Spider Affiliate',
    difficulty: 'Intermediate',
    targetSector: 'Financial Services',
    isSolved: false,
    xpReward: 350,
    killChainSteps: [
      {
        stepNumber: 1,
        phase: 'Initial Access',
        artifactEvidence: 'Email gateway log: "Urgent_Invoice_August.pdf.iso" received from external spoofed vendor domain.',
        correctTechnique: 'T1566.001 - Spearphishing Attachment (ISO Container)',
        options: [
          'T1566.001 - Spearphishing Attachment (ISO Container)',
          'T1190 - Exploit Public-Facing Application',
          'T1078 - Valid Accounts',
          'T1133 - External Remote Services'
        ],
        hint: 'Look for email delivery of deceptive attachments containing mountable container images.'
      },
      {
        stepNumber: 2,
        phase: 'Execution',
        artifactEvidence: 'Sysmon Event 1: User mounted ISO and clicked "Invoice_Details.lnk" which spawned cmd.exe -> powershell.exe.',
        correctTechnique: 'T1204.002 - User Execution: Malicious File (LNK Shortcut)',
        options: [
          'T1204.002 - User Execution: Malicious File (LNK Shortcut)',
          'T1053 - Scheduled Task',
          'T1059.003 - Windows Command Shell',
          'T1569.002 - Service Execution'
        ],
        hint: 'The user was tricked into executing an LNK shortcut file hiding inside the container.'
      },
      {
        stepNumber: 3,
        phase: 'Command and Control',
        artifactEvidence: 'Proxy logs: Rundll32.exe established recurring HTTPS POST beacons every 45 seconds to 194.26.29.112:8443 (Cobalt Strike malleable C2 profile).',
        correctTechnique: 'T1071.001 - Application Layer Protocol: Web Protocols (C2 Beacons)',
        options: [
          'T1071.001 - Application Layer Protocol: Web Protocols (C2 Beacons)',
          'T1572 - Protocol Tunneling',
          'T1090 - Proxy',
          'T1008 - Fallback Channels'
        ],
        hint: 'Periodic HTTP/HTTPS traffic to unknown external infrastructure indicates automated C2 check-ins.'
      },
      {
        stepNumber: 4,
        phase: 'Lateral Movement',
        artifactEvidence: 'Event 4624 (Logon Type 3) & Event 7045 (New Service Installed): PsExec deployed payload service to Domain Controller 10.0.0.5.',
        correctTechnique: 'T1021.002 - Remote Services: SMB/Windows Admin Shares (PsExec)',
        options: [
          'T1021.002 - Remote Services: SMB/Windows Admin Shares (PsExec)',
          'T1021.001 - Remote Desktop Protocol',
          'T1550.002 - Pass the Hash',
          'T1210 - Exploitation of Remote Services'
        ],
        hint: 'PsExec utilizes ADMIN$ shares and the Service Control Manager to execute binaries across systems.'
      },
      {
        stepNumber: 5,
        phase: 'Impact',
        artifactEvidence: 'VSSadmin executed "vssadmin.exe delete shadows /all /quiet" followed by encrypted file extensions .locked.',
        correctTechnique: 'T1486 - Data Encrypted for Impact & T1490 Inhibit System Recovery',
        options: [
          'T1486 - Data Encrypted for Impact & T1490 Inhibit System Recovery',
          'T1485 - Data Destruction',
          'T1491 - Defacement',
          'T1489 - Service Stop'
        ],
        hint: 'Ransomware actors routinely purge Volume Shadow Copies before encrypting target disks.'
      }
    ]
  },
  {
    id: 'th-case-02',
    caseNumber: 'CASE-2026-092',
    title: 'Operation Cloud Infiltration: Supply Chain & AWS Metadata Attack',
    scenario: 'A web development firm experienced customer credential leakage. Unravel how an SSRF vulnerability exposed cloud IAM credentials.',
    threatActor: 'Scattered Spider / Cloud Broker',
    difficulty: 'Hard',
    targetSector: 'Software & Technology',
    isSolved: false,
    xpReward: 400,
    killChainSteps: [
      {
        stepNumber: 1,
        phase: 'Initial Access',
        artifactEvidence: 'Nginx access logs: POST to /fetch-preview with URL parameter "http://169.254.169.254/latest/meta-data/iam/security-credentials/".',
        correctTechnique: 'T1190 - Exploit Public-Facing Application: Server-Side Request Forgery (SSRF)',
        options: [
          'T1190 - Exploit Public-Facing Application: Server-Side Request Forgery (SSRF)',
          'T1133 - External Remote Services',
          'T1078 - Valid Accounts',
          'T1189 - Drive-by Compromise'
        ],
        hint: '169.254.169.254 is the well-known link-local AWS EC2 Instance Metadata Service (IMDS).'
      },
      {
        stepNumber: 2,
        phase: 'Credential Access',
        artifactEvidence: 'CloudTrail log: Role "ProductionWebAppRole" temporary security token retrieved via IMDSv1.',
        correctTechnique: 'T1552.005 - Unsecured Credentials: Cloud Instance Metadata API',
        options: [
          'T1552.005 - Unsecured Credentials: Cloud Instance Metadata API',
          'T1003 - OS Credential Dumping',
          'T1555 - Credentials from Password Stores',
          'T1110 - Brute Force'
        ],
        hint: 'Querying IMDS allows attackers to harvest short-lived STS credentials attached to the instance role.'
      },
      {
        stepNumber: 3,
        phase: 'Exfiltration',
        artifactEvidence: 'CloudTrail Event: S3:GetObject downloaded 45 production customer database snapshots from s3://prod-backups-2026/.',
        correctTechnique: 'T1537 - Transfer Data to Cloud Account / S3 Bucket Exfiltration',
        options: [
          'T1537 - Transfer Data to Cloud Account / S3 Bucket Exfiltration',
          'T1048 - Exfiltration Over Alternative Protocol',
          'T1041 - Exfiltration Over C2 Channel',
          'T1020 - Automated Exfiltration'
        ],
        hint: 'Stolen IAM tokens were used directly via AWS CLI to download sensitive S3 bucket contents.'
      }
    ]
  }
];
