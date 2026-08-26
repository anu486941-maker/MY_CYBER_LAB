export interface LiveIncidentObjective {
  id: string;
  title: string;
  description: string;
  mitreTechnique: string;
  isCompleted: boolean;
}

export interface LiveIncidentEvidence {
  id: string;
  title: string;
  type: string;
  rawContent: string;
  mitreTechnique: string;
  analystNote: string;
  sha256: string;
}

export interface LiveIncidentScenario {
  id: string;
  code: string;
  title: string;
  organization: string;
  industry: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Advanced' | 'Master';
  whatHappened?: string;
  timePressureMinutes: number;
  authorizedScope: string[];
  rulesOfEngagement: string[];
  knownAssets: { host: string; ip: string; role: string; status: string }[];
  unknownAssetsCount: number;
  objectives: LiveIncidentObjective[];
  restrictions: string[];
  initialEvidence: LiveIncidentEvidence[];
  mitreTechniques: { id: string; name: string; tactic: string }[];
  briefing: string;
  initialLogExcerpt: string;
  targetOrgId: string;
  initialStage: number;
  hints: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
}

export const LIVE_INCIDENT_SCENARIOS: LiveIncidentScenario[] = [
  {
    id: 'live-inc-01',
    code: 'INCIDENT #LC-2026-001',
    title: 'Financial Web API Anomalous Query Spikes',
    organization: 'FinTech Secure Global',
    industry: 'Financial Services & Payments',
    difficulty: 'Intermediate',
    timePressureMinutes: 45,
    authorizedScope: [
      '10.10.20.0/24 (DMZ & Web App Subnet)',
      'api.fintechglobal.internal',
      'web-srv-01 (10.10.20.10)'
    ],
    rulesOfEngagement: [
      'All actions must be logged in the Evidence Locker with SHA-256 hashes',
      'No out-of-scope subnet scanning permitted',
      'No denial-of-service or heavy bandwidth stress testing',
      'Report all discovered vulnerabilities with CVSS 3.1 metrics'
    ],
    knownAssets: [
      { host: 'web-srv-01', ip: '10.10.20.10', role: 'Reverse Proxy & Node API Gateway', status: 'Active - High CPU' },
      { host: 'db-cluster-01', ip: '10.10.20.25', role: 'PostgreSQL Core Vault', status: 'Unknown State' }
    ],
    unknownAssetsCount: 3,
    objectives: [
      {
        id: 'obj-1',
        title: 'Identify Initial Ingress Vector',
        description: 'Examine web access logs to identify anomalous HTTP parameters and OGNL/SQL payloads.',
        mitreTechnique: 'T1190 - Exploit Public-Facing Application',
        isCompleted: false
      },
      {
        id: 'obj-2',
        title: 'Perform Controlled Exploitation & Verify Vulnerability',
        description: 'Demonstrate authorized exploit proof-of-concept without corrupting database integrity.',
        mitreTechnique: 'T1059.006 - Python/SQL Command Execution',
        isCompleted: false
      },
      {
        id: 'obj-3',
        title: 'Escalate Privileges & Capture Proof',
        description: 'Locate misconfigured SUID binaries or administrative tokens on web-srv-01.',
        mitreTechnique: 'T1548.001 - Abuse Elevation Control Mechanism: SUID/SGID',
        isCompleted: false
      },
      {
        id: 'obj-4',
        title: 'Draft Defensive Remediation & Retest',
        description: 'Enable WAF parameterized query filters and confirm vulnerability resolution.',
        mitreTechnique: 'M1050 - Exploit Protection',
        isCompleted: false
      }
    ],
    restrictions: [
      'Do not modify production payment transactions',
      'Do not access unauthorized third-party subnets outside 10.10.20.0/24',
      'Do not leave unencrypted web shells active on the target server'
    ],
    initialEvidence: [
      {
        id: 'ev-01',
        title: 'HTTP Access Log Spike Excerpt',
        type: 'HTTP_RESPONSE',
        rawContent: `10.10.20.100 - - [25/Aug/2026:03:12:01] "GET /api/v1/customer?id=101%20OR%201=1 HTTP/1.1" 200 84120 "User-Agent: Mozilla/5.0"\n10.10.20.100 - - [25/Aug/2026:03:12:05] "POST /api/v1/auth/token HTTP/1.1" 401 210 "User-Agent: sqlmap/1.6"`,
        mitreTechnique: 'T1190',
        analystNote: 'Multiple SQL injection probes detected originating from internal test node 10.10.20.100.',
        sha256: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
      }
    ],
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
      { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'Execution' },
      { id: 'T1548.001', name: 'SUID Executables', tactic: 'Privilege Escalation' },
      { id: 'T1041', name: 'Exfiltration Over C2 Channel', tactic: 'Exfiltration' }
    ],
    briefing: 'At 03:00 UTC, SOC sensors registered a 400% spike in database queries originating from web-srv-01. Initial log correlation suggests a potential unauthenticated injection vector in the customer API endpoint. You are tasked with conducting an emergency authorized incident investigation: analyze the log telemetry, verify the security vulnerability in an isolated range environment, capture evidence, enforce remediation, and submit an executive report.',
    initialLogExcerpt: `[2026-08-25 03:00:12] SIEM-ALERT: SQLi payload detected on /api/v1/customer?id=101' UNION SELECT username,password FROM users--\n[2026-08-25 03:01:45] SYSTEM-AUDIT: /usr/bin/python3 executed with effective UID 0 by user 'www-data'\n[2026-08-25 03:02:10] NETWORK-MONITOR: 50MB database export transferred to 10.10.20.100:4444`,
    targetOrgId: 'org-fintech',
    initialStage: 1,
    hints: {
      level0: 'No hints requested. Maximum score multiplier active (100%).',
      level1: 'Focus on inspecting web parameters passed to the `/api/v1/customer` endpoint.',
      level2: 'The target API does not sanitize user input before passing it to PostgreSQL. Test single quotes and UNION SELECT syntax.',
      level3: `Use Burp-style HTTP inspector or curl with -X GET "/api/v1/customer?id=101' UNION SELECT null,flag FROM flags--"`,
      level4: 'Check `/usr/bin/find` or `/usr/bin/python3` for SUID privilege escalation on the Linux host after gaining initial shell access.',
      level5: 'Execute `find / -perm -4000 2>/dev/null` to discover the python3 SUID binary, then run `python3 -c "import os; os.setuid(0); os.system(\'/bin/sh\')"` to claim root.'
    }
  },
  {
    id: 'live-inc-02',
    code: 'INCIDENT #LC-2026-002',
    title: 'Healthcare DICOM Imaging System Unauthenticated Exposure',
    organization: 'Apex Health Systems',
    industry: 'Healthcare & Medical Devices',
    difficulty: 'Hard',
    whatHappened: 'Unencrypted DICOM image storage server listening on port 104 exposed patient medical records.',
    timePressureMinutes: 60,
    authorizedScope: [
      '10.10.30.0/24 (Healthcare OT & Imaging Subnet)',
      'dicom-node.apex.internal (10.10.30.15)',
      'pacs-server-02 (10.10.30.22)'
    ],
    rulesOfEngagement: [
      'Strict HIPAA compliance auditing rules in effect',
      'No modification of patient DICOM tags or physical imaging files',
      'Log all data access events to Evidence Locker'
    ],
    knownAssets: [
      { host: 'dicom-node', ip: '10.10.30.15', role: 'DICOM C-STORE Listener', status: 'Unencrypted Port 104' },
      { host: 'pacs-server', ip: '10.10.30.22', role: 'PACS Medical Database', status: 'Active' }
    ],
    unknownAssetsCount: 4,
    objectives: [
      { id: 'obj-201', title: 'Identify DICOM Port 104 Service Status', description: 'Run nmap service scan against DICOM gateway node.', mitreTechnique: 'T1046 - Network Service Discovery', isCompleted: false },
      { id: 'obj-202', title: 'Inspect Medical Telemetry Headers', description: 'Verify unauthenticated DICOM C-FIND response.', mitreTechnique: 'T1005 - Data from Local System', isCompleted: false },
      { id: 'obj-203', title: 'Enforce TLS & Association Control', description: 'Deploy firewall ACL and DICOM AE-title authentication.', mitreTechnique: 'M1042 - Network Boundary Protection', isCompleted: false }
    ],
    restrictions: [
      'No disruption to active patient monitoring services',
      'No downloading of unencrypted PII outside simulated sandbox memory'
    ],
    initialEvidence: [
      {
        id: 'ev-02',
        title: 'DICOM C-FIND Packet Capture',
        type: 'SERVICE_BANNER',
        rawContent: `DICOM Protocol C-FIND-RQ [Port 104]\nCalled AE Title: ANY_AE\nCalling AE Title: SCU_SCANNER\nStatus: SUCCESS (0x0000) - 1,420 Patient Studies Returned`,
        mitreTechnique: 'T1046',
        analystNote: 'Unauthenticated DICOM server accepted C-FIND requests from any AE title without password.',
        sha256: '4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b'
      }
    ],
    mitreTechniques: [
      { id: 'T1046', name: 'Network Service Discovery', tactic: 'Reconnaissance' },
      { id: 'T1005', name: 'Data from Local System', tactic: 'Collection' },
      { id: 'M1042', name: 'Network Boundary Protection', tactic: 'Defensive Mitigation' }
    ],
    briefing: 'Hospital IT security detected unauthenticated traffic on DICOM TCP port 104. Preliminary network captures indicate that medical imaging studies are being queried without Application Entity (AE) title verification or TLS encryption. Investigate the exposed PACS node, verify patient telemetry privacy controls, and deploy network boundary protections.',
    initialLogExcerpt: `[2026-08-25 02:15:44] DICOM-SRV: C-FIND request received from 10.10.30.199 with AE Title 'ANY_AE'\n[2026-08-25 02:15:45] DICOM-SRV: Transmitted 1,420 DICOM tags containing patient SSN and DOB\n[2026-08-25 02:16:00] PACS-AUDIT: Alert 402 - Unencrypted DICOM study export in progress`,
    targetOrgId: 'org-apexhealth',
    initialStage: 1,
    hints: {
      level0: 'No hints requested (100% score multiplier).',
      level1: 'Check if TCP port 104 or 11112 is open using nmap.',
      level2: 'The DICOM daemon accepts default AE Title `ANY_AE` without requiring authentication.',
      level3: 'Inspect DICOM tags using `curl -v http://10.10.30.15:8080/dicom/studies` or nmap scripts.',
      level4: 'Remediate by configuring DICOM AE Title allowlisting in the server configuration file.',
      level5: 'Apply `iptables -A INPUT -p tcp --dport 104 ! -s 10.10.30.22 -j DROP` to restrict access strictly to the PACS server.'
    }
  },
  {
    id: 'live-inc-03',
    code: 'INCIDENT #LC-2026-003',
    title: 'Active Directory Domain Controller Kerberoasting Breach',
    organization: 'Global Energy Corp',
    industry: 'Energy & Utilities',
    difficulty: 'Hard',
    timePressureMinutes: 60,
    authorizedScope: [
      '10.10.40.0/24 (AD Infrastructure Subnet)',
      'dc01.globalenergy.internal (10.10.40.10)',
      'workstation-05 (10.10.40.88)'
    ],
    rulesOfEngagement: [
      'No clearing of Windows Event Logs (EventID 4769)',
      'Document all Kerberos TGS requests in Evidence Locker',
      'Do not disrupt domain controller LDAP services'
    ],
    knownAssets: [
      { host: 'dc01', ip: '10.10.40.10', role: 'Primary Domain Controller (Windows Server 2022)', status: 'Active - Kerberos Port 88' },
      { host: 'sql-svc', ip: '10.10.40.44', role: 'Service Account Host', status: 'Active' }
    ],
    unknownAssetsCount: 5,
    objectives: [
      { id: 'obj-301', title: 'Audit Kerberos TGS Requests', description: 'Analyze EventID 4769 logs for RC4 encryption downgrades.', mitreTechnique: 'T1558.003 - Steal or Forge Kerberos Tickets: Kerberoasting', isCompleted: false },
      { id: 'obj-302', title: 'Extract Service Principal Name (SPN) List', description: 'Enumerate service accounts with weak passwords using impacket-GetUserSPNs.', mitreTechnique: 'T1069.002 - Domain Groups', isCompleted: false },
      { id: 'obj-303', title: 'Enforce AES-256 Kerberos Policy', description: 'Enforce AES-256 encryption for service accounts and force complex password resets.', mitreTechnique: 'M1027 - Password Policies', isCompleted: false }
    ],
    restrictions: [
      'Do not lock out the Active Directory Administrator account',
      'Do not change domain SID'
    ],
    initialEvidence: [
      {
        id: 'ev-03',
        title: 'EventID 4769 TGS Ticket Request Log',
        type: 'LOG_ENTRY',
        rawContent: `EventID: 4769\nTargetUserName: svc_mssql@GLOBALENERGY.INTERNAL\nTicketEncryptionType: 0x17 (RC4-HMAC)\nTicketOptions: 0x40810010\nIpAddress: 10.10.40.88`,
        mitreTechnique: 'T1558.003',
        analystNote: 'RC4-HMAC Kerberos TGS ticket requested for SQL service account from internal workstation.',
        sha256: '7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e'
      }
    ],
    mitreTechniques: [
      { id: 'T1558.003', name: 'Kerberoasting', tactic: 'Credential Access' },
      { id: 'T1069.002', name: 'Domain Groups', tactic: 'Discovery' },
      { id: 'M1027', name: 'Password Policies', tactic: 'Mitigation' }
    ],
    briefing: 'A blue team alert flagged multiple Kerberos Ticket Granting Service (TGS) requests using legacy RC4 encryption (0x17) targeted at service accounts (`svc_mssql`). This indicates an active Kerberoasting attack aimed at offline hash cracking. Investigate the Active Directory environment, identify vulnerable SPNs, enforce AES-256 encryption, and rotate service credentials.',
    initialLogExcerpt: `[2026-08-25 01:40:02] Security-Auditing: EventID 4769 - TGS ticket requested for SPN 'MSSQLSvc/sql-svc.globalenergy.internal:1433' with RC4 (0x17) encryption\n[2026-08-25 01:40:05] Security-Auditing: EventID 4624 - Successful network logon for domain user 'svc_mssql'`,
    targetOrgId: 'org-globalenergy',
    initialStage: 1,
    hints: {
      level0: 'No hints requested (100% score multiplier).',
      level1: 'Look for Active Directory accounts that have Service Principal Names (SPNs) registered.',
      level2: 'Kerberoasting requests TGS tickets encrypted with the service account\'s password hash. RC4 encryption (`0x17`) is vulnerable to offline cracking.',
      level3: 'Run `GetUserSPNs.py globalenergy.internal/student:Password123 -dc-ip 10.10.40.10 -request` to request TGS tickets.',
      level4: 'Configure Active Directory account options to enforce `AES256_HMAC_SHA1` and require 25+ character complex passwords for service accounts.',
      level5: 'Set `msDS-SupportedEncryptionTypes` attribute to `24` (AES128 + AES256) on `svc_mssql` and rotate password with `Set-ADAccountPassword`.'
    }
  },
  {
    id: 'live-inc-04',
    code: 'INCIDENT #LC-2026-004',
    title: 'Cloud AWS IMDSv1 SSRF Metadata & Identity Leak',
    organization: 'CloudScale Tech Solutions',
    industry: 'Cloud Infrastructure & SaaS',
    difficulty: 'Advanced',
    timePressureMinutes: 50,
    authorizedScope: [
      '10.10.50.0/24 (AWS VPC Public Subnet)',
      '169.254.169.254 (Instance Metadata Service)',
      'cloud-app.cloudscale.internal (10.10.50.20)'
    ],
    rulesOfEngagement: [
      'No modification of IAM root policies',
      'All SSRF requests must be captured with SHA-256 evidence hashes',
      'Audit S3 bucket permissions for read-only proof'
    ],
    knownAssets: [
      { host: 'cloud-app', ip: '10.10.50.20', role: 'Node.js Express Microservice', status: 'Active - Public Port 80' },
      { host: 'imds-service', ip: '169.254.169.254', role: 'AWS EC2 Instance Metadata v1/v2', status: 'IMDSv1 Enabled' }
    ],
    unknownAssetsCount: 2,
    objectives: [
      { id: 'obj-401', title: 'Discover SSRF Endpoint', description: 'Identify url parameter vulnerability in image fetcher service.', mitreTechnique: 'T1190 - Exploit Public-Facing Application', isCompleted: false },
      { id: 'obj-402', title: 'Extract IAM Role Credentials via IMDSv1', description: 'Query http://169.254.169.254/latest/meta-data/iam/security-credentials/', mitreTechnique: 'T1552.005 - Cloud Instance Metadata API', isCompleted: false },
      { id: 'obj-403', title: 'Enforce IMDSv2 Hop-Limit & Block IMDSv1', description: 'Require HTTP PUT token authorization (IMDSv2) to mitigate SSRF.', mitreTechnique: 'M1042 - Network Boundary Protection', isCompleted: false }
    ],
    restrictions: [
      'Do not delete S3 objects',
      'Do not modify EC2 security group rules outside authorized VPC'
    ],
    initialEvidence: [
      {
        id: 'ev-04',
        title: 'IMDSv1 Metadata Query Capture',
        type: 'VULN_PROOF',
        rawContent: `GET /api/proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-Admin-Role HTTP/1.1\nHost: cloud-app.cloudscale.internal\n\nHTTP/1.1 200 OK\n{\n  "AccessKeyId": "ASIA2EXAMPLEKEY",\n  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",\n  "Token": "IQoJb3JpZ2luX2Vj..."\n}`,
        mitreTechnique: 'T1552.005',
        analystNote: 'Unauthenticated SSRF vulnerability in url proxy parameter exposed EC2 IAM Role temporary security credentials.',
        sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
      }
    ],
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
      { id: 'T1552.005', name: 'Cloud Instance Metadata API', tactic: 'Credential Access' },
      { id: 'M1042', name: 'Network Boundary Protection', tactic: 'Mitigation' }
    ],
    briefing: 'A security auditor reported that a public-facing Node.js URL image proxy microservice on `cloud-app` accepts arbitrary internal URLs. An attacker used Server-Side Request Forgery (SSRF) to query the AWS Instance Metadata Service (`169.254.169.254`) via IMDSv1 and extract temporary IAM administrator credentials. Investigate the metadata leak, prove the SSRF vector, and enforce IMDSv2 token authentication with a hop-limit of 1.',
    initialLogExcerpt: `[2026-08-25 04:20:01] EXPRESS-LOG: GET /api/proxy?url=http://169.254.169.254/latest/meta-data/ 200 412\n[2026-08-25 04:20:03] AWS-CLOUDTRAIL: AssumeRole event for EC2-Admin-Role from IP 198.51.100.44\n[2026-08-25 04:20:08] S3-AUDIT: ListObjectsV2 called on s3://cloudscale-confidential-vault`,
    targetOrgId: 'org-cloudscale',
    initialStage: 1,
    hints: {
      level0: 'No hints requested (100% score multiplier).',
      level1: 'Look for parameters accepting external URLs such as `?url=`, `?dest=`, or `?fetch=`.',
      level2: 'AWS EC2 instances expose metadata on `http://169.254.169.254`. IMDSv1 allows direct GET requests without tokens.',
      level3: 'Query `curl "http://10.10.50.20/api/proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"`',
      level4: 'Enforce IMDSv2 by updating EC2 metadata options: `HttpTokens=required` and `HttpPutResponseHopLimit=1`.',
      level5: 'Execute AWS CLI command `aws ec2 modify-instance-metadata-options --instance-id i-0123456789 --http-tokens required --http-put-response-hop-limit 1`.'
    }
  },
  {
    id: 'live-inc-05',
    code: 'INCIDENT #LC-2026-005',
    title: 'Critical Infrastructure Logistics Supply Chain Trojan & Wiper Hazard',
    organization: 'TransCorp National Logistics',
    industry: 'Logistics & Transportation',
    difficulty: 'Master',
    timePressureMinutes: 60,
    authorizedScope: [
      '10.10.60.0/24 (Logistics Gateway Subnet)',
      'update-srv.transcorp.internal (10.10.60.10)',
      'scada-bridge (10.10.60.50)'
    ],
    rulesOfEngagement: [
      'Strict containment protocol in effect',
      'Isolate compromised update server immediately upon verification',
      'Document file hashes in Evidence Locker with SHA-256 integrity'
    ],
    knownAssets: [
      { host: 'update-srv', ip: '10.10.60.10', role: 'Internal Software Update Repository', status: 'Compromised DLL' },
      { host: 'scada-bridge', ip: '10.10.60.50', role: 'Freight Dispatch Controller', status: 'Monitoring' }
    ],
    unknownAssetsCount: 6,
    objectives: [
      { id: 'obj-501', title: 'Identify Malicious Software Update Hash', description: 'Analyze update binary hash against upstream pristine vendor baseline.', mitreTechnique: 'T1195.002 - Supply Chain Compromise: Software Supply Chain', isCompleted: false },
      { id: 'obj-502', title: 'Detect Master File Table Wiper Routine', description: 'Inspect disk sector write activity in endpoint EDR telemetry.', mitreTechnique: 'T1485 - Data Destruction', isCompleted: false },
      { id: 'obj-503', title: 'Isolate Update Server & Deploy Air-Gap ACL', description: 'Block egress DGA beaconing and apply software signing verification.', mitreTechnique: 'M1040 - Behavior Prevention on Endpoint', isCompleted: false }
    ],
    restrictions: [
      'Do not allow outbound traffic to DGA C2 domains',
      'Do not reboot physical SCADA controller without operator clearance'
    ],
    initialEvidence: [
      {
        id: 'ev-05',
        title: 'Trojanized Update DLL Hash Discrepancy',
        type: 'OBSERVATION',
        rawContent: `Binary: TransCorpDispatch.Core.dll\nSigner: TransCorp Supply Chain Signing Certificate (EXPIRED)\nCalculated SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nVendor Baseline: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8`,
        mitreTechnique: 'T1195.002',
        analystNote: 'Internal software repository distributed trojanized binary matching SUNBURST supply chain injection characteristics.',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    ],
    mitreTechniques: [
      { id: 'T1195.002', name: 'Software Supply Chain Compromise', tactic: 'Initial Access' },
      { id: 'T1485', name: 'Data Destruction', tactic: 'Impact' },
      { id: 'M1040', name: 'Behavior Prevention on Endpoint', tactic: 'Mitigation' }
    ],
    briefing: 'An emergency alert from national cyber defense warned that TransCorp\'s internal dispatch software repository was compromised by a supply-chain backdoor. Telemetry shows a modified DLL distributing wiper routines and DNS DGA beaconing to covert external IP subnets. You must audit the software update pipeline, isolate compromised hosts, block lateral movement, and protect the freight SCADA bridge.',
    initialLogExcerpt: `[2026-08-25 00:10:01] EDR-ALERT: Process 'TransCorpDispatch.exe' injected thread into 'lsass.exe'\n[2026-08-25 00:10:05] DNS-LOG: Outbound query to 'a891f2c01.update-cloud-telemetry[.]net' [DGA Signature]\n[2026-08-25 00:10:12] DISK-MONITOR: Direct raw write to MFT sector 0 on 10.10.60.50`,
    targetOrgId: 'org-transcorp',
    initialStage: 1,
    hints: {
      level0: 'No hints requested (100% score multiplier).',
      level1: 'Compare binary cryptographic hashes against the official vendor release manifest.',
      level2: 'The trojanized DLL uses an expired code-signing certificate and contacts a DGA domain.',
      level3: 'Inspect `/var/log/syslog` or `journalctl -u transcorp-update` for DGA DNS queries.',
      level4: 'Isolate `update-srv` by dropping outbound DNS traffic to untrusted TLDs and revoking the signing cert.',
      level5: 'Run `iptables -A OUTPUT -d 10.10.60.10 -j DROP && certutil -delstore Disallowed "TransCorp Cert"` to sever C2 and enforce clean updates.'
    }
  }
];
