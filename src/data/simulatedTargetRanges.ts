import { TargetAsset } from '../utils/incidentStateEngine';

export interface SimulatedEnvironmentRange {
  id: string;
  name: string;
  category: 'FINANCE' | 'HEALTHCARE' | 'ACTIVE_DIRECTORY' | 'CLOUD';
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  icon: string;
  assets: TargetAsset[];
  networkTopology: {
    subnet: string;
    gateway: string;
    firewallRules: string[];
    dnsEntries: Record<string, string>;
  };
  simulatedLogs: {
    source: string;
    timestamp: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    mitreTechnique?: string;
  }[];
  siemRules: {
    ruleId: string;
    ruleName: string;
    query: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    mitigationAction: string;
  }[];
  initialAccessVector: string;
  targetObjective: string;
}

export const SIMULATED_TARGET_RANGES: SimulatedEnvironmentRange[] = [
  {
    id: 'range-finance-01',
    name: 'FinVault Capital Infrastructure',
    category: 'FINANCE',
    description: 'High-availability banking environment featuring an Nginx reverse proxy, customer API service, PostgreSQL ledger database, and Linux host.',
    difficulty: 'INTERMEDIATE',
    icon: 'Building2',
    assets: [
      { host: 'fin-proxy-01', ip: '10.200.1.10', role: 'Nginx Reverse Proxy & WAF', status: 'DISCOVERED' },
      { host: 'fin-api-01', ip: '10.200.1.25', role: 'Customer Ledger REST API', status: 'DISCOVERED' },
      { host: 'fin-db-01', ip: '10.200.1.50', role: 'PostgreSQL Database Cluster', status: 'UNKNOWN' },
      { host: 'fin-app-01', ip: '10.200.1.80', role: 'Internal Banking Portal', status: 'UNKNOWN' }
    ],
    networkTopology: {
      subnet: '10.200.1.0/24',
      gateway: '10.200.1.1',
      firewallRules: ['ALLOW 80, 443 -> 10.200.1.10', 'ALLOW 5432 ONLY 10.200.1.25 -> 10.200.1.50', 'BLOCK ALL INBOUND TO 10.200.1.50'],
      dnsEntries: {
        'api.finvault.local': '10.200.1.25',
        'portal.finvault.local': '10.200.1.80'
      }
    },
    simulatedLogs: [
      { source: 'WAF-Nginx', timestamp: '10:02:14', severity: 'MEDIUM', message: 'HTTP GET /api/v1/customer?id=101%27%20UNION%20SELECT -- suspicious SQL syntax detected', mitreTechnique: 'T1190' },
      { source: 'PostgreSQL-Audit', timestamp: '10:02:15', severity: 'HIGH', message: 'Query executed with non-standard schema reflection on table user_credentials', mitreTechnique: 'T1005' },
      { source: 'Linux-Auth', timestamp: '10:05:22', severity: 'CRITICAL', message: 'SUID binary /usr/bin/python3 executed by www-data with root uid 0', mitreTechnique: 'T1548.001' }
    ],
    siemRules: [
      { ruleId: 'SIEM-FIN-01', ruleName: 'SQL Injection Single Quote Anomaly', query: 'url_params MATCH "(\'|--|UNION|SELECT)"', severity: 'HIGH', mitigationAction: 'Apply WAF Parameter Sanitizer Rule WAF-901' },
      { ruleId: 'SIEM-FIN-02', ruleName: 'Privileged SUID Execution by Web Service User', query: 'process_owner == "www-data" AND euid == 0', severity: 'CRITICAL', mitigationAction: 'Revoke SUID permission on /usr/bin/python3' }
    ],
    initialAccessVector: 'Unsanitized input parameters in the Customer REST API',
    targetObjective: 'Gain root privilege on fin-api-01, locate the vault flag, document evidence, and deploy defensive controls.'
  },
  {
    id: 'range-health-02',
    name: 'MediHealth Clinical PACS & EMR Range',
    category: 'HEALTHCARE',
    description: 'Healthcare clinical network hosting DICOM image archives, HL7 interfaces, Patient EMR web portal, and identity directory.',
    difficulty: 'ADVANCED',
    icon: 'Activity',
    assets: [
      { host: 'pacs-dicom-01', ip: '172.16.40.10', role: 'Orthanc DICOM PACS Server (Port 4242)', status: 'DISCOVERED' },
      { host: 'emr-portal-01', ip: '172.16.40.20', role: 'Patient Record Management Web Server', status: 'DISCOVERED' },
      { host: 'hl7-gateway-01', ip: '172.16.40.35', role: 'HL7 Interface Engine', status: 'UNKNOWN' },
      { host: 'health-db-01', ip: '172.16.40.100', role: 'Protected Health Information DB', status: 'UNKNOWN' }
    ],
    networkTopology: {
      subnet: '172.16.40.0/24',
      gateway: '172.16.40.1',
      firewallRules: ['ALLOW 4242 DICOM INBOUND', 'ALLOW 8080 EMR WEB PORTAL', 'RESTRICT DB PORT 3306 TO INTERNAL SUB-NET'],
      dnsEntries: {
        'emr.medihealth.local': '172.16.40.20',
        'pacs.medihealth.local': '172.16.40.10'
      }
    },
    simulatedLogs: [
      { source: 'DICOM-Daemon', timestamp: '11:14:02', severity: 'HIGH', message: 'Unauthenticated C-STORE query issued with path traversal payload "../../patients/"', mitreTechnique: 'T1083' },
      { source: 'EMR-Web', timestamp: '11:18:40', severity: 'CRITICAL', message: 'Arbitrary file write in /var/www/uploads/shell.php via medical attachment', mitreTechnique: 'T1505.003' }
    ],
    siemRules: [
      { ruleId: 'SIEM-HLT-01', ruleName: 'Unauthenticated DICOM Path Traversal', query: 'dicom_command == "C-STORE" AND payload MATCH "\\.\\./"', severity: 'CRITICAL', mitigationAction: 'Enforce TLS C-STORE Authentication and Path Validation' }
    ],
    initialAccessVector: 'DICOM protocol path traversal and unvalidated file upload in the EMR portal attachment handler',
    targetObjective: 'Identify patient record leakage, isolate compromised DICOM server, and lock evidence.'
  },
  {
    id: 'range-ad-03',
    name: 'Corporate Active Directory Enterprise Range',
    category: 'ACTIVE_DIRECTORY',
    description: 'Windows Active Directory domain tree with Domain Controller DC01, Kerberos ticket service, SMB file shares, and LDAP directory.',
    difficulty: 'ADVANCED',
    icon: 'FolderGit2',
    assets: [
      { host: 'DC01.corp.local', ip: '192.168.10.5', role: 'Active Directory Domain Controller (Windows Server 2022)', status: 'DISCOVERED' },
      { host: 'FS01.corp.local', ip: '192.168.10.12', role: 'SMB Corporate File Share Server', status: 'DISCOVERED' },
      { host: 'WKST-FIN04', ip: '192.168.10.105', role: 'Finance Analyst Workstation', status: 'UNKNOWN' },
      { host: 'SQL01.corp.local', ip: '192.168.10.50', role: 'MSSQL Service Instance (Kerberoastable SPN)', status: 'UNKNOWN' }
    ],
    networkTopology: {
      subnet: '192.168.10.0/24',
      gateway: '192.168.10.1',
      firewallRules: ['ALLOW 88 KERBEROS', 'ALLOW 389/636 LDAP/S', 'ALLOW 445 SMB'],
      dnsEntries: {
        'dc01.corp.local': '192.168.10.5',
        'fs01.corp.local': '192.168.10.12'
      }
    },
    simulatedLogs: [
      { source: 'Security-Event-4768', timestamp: '14:22:01', severity: 'MEDIUM', message: 'Kerberos TGT requested for user "svc_sql" with RC4-HMAC encryption (Ticket Granting Service)', mitreTechnique: 'T1558.003' },
      { source: 'Security-Event-4624', timestamp: '14:25:33', severity: 'HIGH', message: 'Successful logon by Administrator using Pass-the-Hash from IP 192.168.10.105', mitreTechnique: 'T1550.002' }
    ],
    siemRules: [
      { ruleId: 'SIEM-AD-01', ruleName: 'Kerberoasting SPN Ticket Request Pattern', query: 'EventID == 4769 AND TicketOptions MATCH "0x40810000" AND EncryptionType == "0x17"', severity: 'HIGH', mitigationAction: 'Upgrade SPN Accounts to 25-character Managed Service Accounts (gMSA)' }
    ],
    initialAccessVector: 'Kerberoasting weak SPN service accounts and Pass-the-Hash lateral movement',
    targetObjective: 'Perform Kerberos ticket extraction analysis, detect lateral NTLM authentication, and enforce gMSA policy.'
  },
  {
    id: 'range-cloud-04',
    name: 'AWS Cloud Native Infrastructure Range',
    category: 'CLOUD',
    description: 'Cloud environment featuring AWS EC2 web nodes, IAM metadata endpoint 169.254.169.254, S3 vault bucket, and CloudTrail audit logging.',
    difficulty: 'EXPERT',
    icon: 'Cpu',
    assets: [
      { host: 'ec2-prod-web-01', ip: '54.210.12.99', role: 'AWS EC2 Web Node (IAM Role: EC2-Vault-Admin)', status: 'DISCOVERED' },
      { host: 's3-vault-bucket', ip: '169.254.169.254', role: 'AWS IMDSv1 Instance Metadata Service', status: 'DISCOVERED' },
      { host: 'api-gateway-prod', ip: '10.0.12.1', role: 'AWS API Gateway Proxy', status: 'UNKNOWN' },
      { host: 'rds-aurora-cluster', ip: '10.0.45.10', role: 'AWS RDS Aurora Postgres Cluster', status: 'UNKNOWN' }
    ],
    networkTopology: {
      subnet: '10.0.0.0/16 (VPC)',
      gateway: 'igw-091a33b91',
      firewallRules: ['ALLOW HTTP/HTTPS INBOUND TO EC2', 'ALLOW METADATA ACCESS ON 169.254.169.254'],
      dnsEntries: {
        'cloud.corp.internal': '10.0.12.1'
      }
    },
    simulatedLogs: [
      { source: 'AWS-CloudTrail', timestamp: '16:01:05', severity: 'HIGH', message: 'AssumeRole called from external IP 198.51.100.42 using temporary credentials stolen from EC2 metadata', mitreTechnique: 'T1552.005' },
      { source: 'S3-Access-Log', timestamp: '16:04:19', severity: 'CRITICAL', message: 'GetObject request for s3://corp-finance-vault/customer_ssn_export.csv from unverified IP', mitreTechnique: 'T1530' }
    ],
    siemRules: [
      { ruleId: 'SIEM-CLD-01', ruleName: 'IMDSv1 Metadata Secret Exfiltration', query: 'eventSource == "sts.amazonaws.com" AND userAgent MATCH "aws-cli" AND external_ip != vpc_ip', severity: 'CRITICAL', mitigationAction: 'Enforce AWS IMDSv2 Token Header Requirement (HttpPutResponseHopLimit = 1)' }
    ],
    initialAccessVector: 'SSRF vulnerability on EC2 instance abusing IMDSv1 to extract IAM temporary security credentials',
    targetObjective: 'Exploit SSRF to retrieve EC2 IAM credentials, trace S3 bucket access in CloudTrail, and enforce IMDSv2 mitigation.'
  }
];
