/**
 * 14 Authoritative Case-Based Incident Missions
 * Synthetic, isolated enterprise incident scenarios mapped to MITRE ATT&CK.
 * STRICTLY restricted to authorized MY CYBER LAB training targets.
 */

export interface IncidentMission {
  id: string;
  title: string;
  category: 'OFFENSIVE' | 'DEFENSIVE' | 'SOC' | 'DFIR' | 'CLOUD';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  targetScope: string;
  organizationName: string;
  briefing: string;
  objectives: string[];
  rulesOfEngagement: string[];
  timeLimitMinutes: number;
  mitreTechniques: string[];
  phasesSupported: number; // e.g. 13 phases
  syntheticArtifacts: {
    hostname: string;
    ip: string;
    vulnerability: string;
    evidenceHash: string;
  }[];
  authoritativeFlag: string;
}

export const AUTHORIZED_INCIDENT_MISSIONS: IncidentMission[] = [
  {
    id: 'mission-01',
    title: 'Web Application Auth Bypass & Data Extraction',
    category: 'OFFENSIVE',
    difficulty: 'INTERMEDIATE',
    targetScope: '10.200.1.10 (fin-proxy-01.finvault.local)',
    organizationName: 'FinVault Capital Ltd.',
    briefing: 'An unauthenticated endpoint in the Customer REST API exhibits suspicious SQL string concatenation. Perform authorized reconnaissance, exploit the vulnerability inside scope, retrieve customer ledger flags, and submit a security report.',
    objectives: [
      'Reconnaissance: Identify active services on 10.200.1.10',
      'Enumeration: Discover unsanitized URL parameters',
      'Initial Access: Execute UNION SELECT injection payload',
      'Privilege Escalation: Elevate via SUID python binary',
      'Report & Remediate: Document findings and propose patch'
    ],
    rulesOfEngagement: [
      'Target ONLY authorized assets in 10.200.1.0/24',
      'Do NOT attempt external domain lookups',
      'All evidence must be logged in Evidence Locker'
    ],
    timeLimitMinutes: 45,
    mitreTechniques: ['T1190', 'T1005', 'T1548.001'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'fin-api-01', ip: '10.200.1.25', vulnerability: 'SQL Injection in /api/v1/customer', evidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }
    ],
    authoritativeFlag: 'FLAG{SQLI_AUTH_BYPASS_UNION_EXTRACTED_9918}'
  },
  {
    id: 'mission-02',
    title: 'Credential Compromise & SSH Brute-Force Triage',
    category: 'SOC',
    difficulty: 'BEGINNER',
    targetScope: '172.16.40.20 (emr-portal-01.medihealth.local)',
    organizationName: 'MediHealth Clinical Systems',
    briefing: 'SIEM alerts indicate 450 failed SSH authentication attempts within 3 minutes followed by a successful login. Triage the logs, identify the compromised account, and isolate the source IP.',
    objectives: [
      'Analyze SSH auth logs in SIEM queue',
      'Identify attacker IP and compromised username',
      'Reconstruct execution timeline',
      'Apply IP firewall block rule'
    ],
    rulesOfEngagement: ['Authorized SOC investigation only.'],
    timeLimitMinutes: 30,
    mitreTechniques: ['T1110.001', 'T1078'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'emr-portal-01', ip: '172.16.40.20', vulnerability: 'Weak SSH Passwords', evidenceHash: '4b227777d4da1fcacd168f0853e2e70809f643580979387358474d17b4c12bf7' }
    ],
    authoritativeFlag: 'MCL{ssh_bruteforce_triaged_successfully}'
  },
  {
    id: 'mission-03',
    title: 'Phishing Intrusion & Malicious Attachment Analysis',
    category: 'DFIR',
    difficulty: 'INTERMEDIATE',
    targetScope: '192.168.1.50 (corp-ws-04.corp.local)',
    organizationName: 'Apex Logistics Inc.',
    briefing: 'An employee opened a suspicious email attachment containing an obfuscated macro. Inspect the memory dump, extract C2 domains, and analyze payload execution.',
    objectives: [
      'Parse email headers and MIME payload',
      'Deobfuscate VBA macro script',
      'Identify C2 IP address in memory log',
      'Issue proxy domain block'
    ],
    rulesOfEngagement: ['Synthetic email archive analysis.'],
    timeLimitMinutes: 40,
    mitreTechniques: ['T1566.001', 'T1059.005', 'T1071.001'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'corp-ws-04', ip: '192.168.1.50', vulnerability: 'Macro Execution Allowed', evidenceHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d' }
    ],
    authoritativeFlag: 'MCL{phishing_macro_c2_extracted}'
  },
  {
    id: 'mission-04',
    title: 'Ransomware Outbreak & Shadow Copy Recovery',
    category: 'DEFENSIVE',
    difficulty: 'ADVANCED',
    targetScope: '10.200.1.80 (fin-app-01.finvault.local)',
    organizationName: 'FinVault Capital Infrastructure',
    briefing: 'A simulated ransomware variant has encrypted file shares on fin-app-01. Locate the encryption key in process memory, terminate the malicious process, and restore Volume Shadow Copies.',
    objectives: [
      'Detect ransomware process extension',
      'Extract memory strings for decryption key',
      'Execute Shadow Copy restoration command',
      'Verify host integrity'
    ],
    rulesOfEngagement: ['Authorized ransomware response laboratory.'],
    timeLimitMinutes: 60,
    mitreTechniques: ['T1486', 'T1490'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'fin-app-01', ip: '10.200.1.80', vulnerability: 'Unpatched SMBv1 Protocol', evidenceHash: 'e7f6c011776e8db7cd330b54174ec76f7d0216b670525a7878e3f423f0858007' }
    ],
    authoritativeFlag: 'MCL{ransomware_contained_shadow_restored}'
  },
  {
    id: 'mission-05',
    title: 'Suspicious Encoded PowerShell Command Triage',
    category: 'SOC',
    difficulty: 'BEGINNER',
    targetScope: '192.168.1.12 (ad-dc-01.corp.local)',
    organizationName: 'Corp Enterprise AD',
    briefing: 'Sysmon Event ID 1 logs reveal PowerShell launched with Base64 encoded payload arguments (`-EncodedCommand`). Decode the command string and isolate the invoked API call.',
    objectives: [
      'Filter Sysmon Event ID 1 in SIEM',
      'Decode Base64 payload string',
      'Identify targeted registry run key'
    ],
    rulesOfEngagement: ['Authorized AD telemetry analysis.'],
    timeLimitMinutes: 25,
    mitreTechniques: ['T1059.001', 'T1027', 'T1547.001'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'ad-dc-01', ip: '192.168.1.12', vulnerability: 'Unrestricted PowerShell Policy', evidenceHash: '0c88028ad3e6e457245b648e94e4776ec0d86895b6c03998cfb97c41551ef408' }
    ],
    authoritativeFlag: 'MCL{powershell_base64_decoded_success}'
  },
  {
    id: 'mission-06',
    title: 'Web Shell Incident & Persistence Removal',
    category: 'OFFENSIVE',
    difficulty: 'INTERMEDIATE',
    targetScope: '172.16.40.20 (emr-portal-01.medihealth.local)',
    organizationName: 'MediHealth Clinical Range',
    briefing: 'An adversary uploaded a PHP web shell (`shell.php`) into `/var/www/uploads/`. Access the authorized target, analyze command execution capabilities, remove the shell, and fix file permission ACLs.',
    objectives: [
      'Locate web shell URI on target web server',
      'Inspect command execution capability',
      'Remove web shell binary file',
      'Reconfigure upload directory non-executable bit'
    ],
    rulesOfEngagement: ['Target strictly inside MediHealth lab network.'],
    timeLimitMinutes: 35,
    mitreTechniques: ['T1505.003', 'T1059.004'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'emr-portal-01', ip: '172.16.40.20', vulnerability: 'Unrestricted File Upload', evidenceHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e' }
    ],
    authoritativeFlag: 'MCL{webshell_removed_upload_dir_hardened}'
  },
  {
    id: 'mission-07',
    title: 'DNS Tunneling Data Exfiltration Investigation',
    category: 'DFIR',
    difficulty: 'ADVANCED',
    targetScope: '10.200.1.25 (fin-api-01.finvault.local)',
    organizationName: 'FinVault Capital Network',
    briefing: 'High volume of TXT record queries targeting `sub.exfil-domain.local` were recorded. Reconstruct the hex-encoded DNS queries to recover exfiltrated customer credit records.',
    objectives: [
      'Filter PCAP for DNS TXT queries',
      'Concatenate hex payload fragments',
      'Reconstruct exfiltrated data document',
      'Assess impact and compliance risk'
    ],
    rulesOfEngagement: ['Authorized PCAP file triage.'],
    timeLimitMinutes: 45,
    mitreTechniques: ['T1071.004', 'T1048.003'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'fin-api-01', ip: '10.200.1.25', vulnerability: 'Unmonitored Outbound DNS', evidenceHash: 'bf671c692b15e34778326e6ef198642289c099b2408c627443f1138407338541' }
    ],
    authoritativeFlag: 'MCL{dns_exfiltration_reconstructed_2026}'
  },
  {
    id: 'mission-08',
    title: 'Linux SUID Binary Privilege Escalation',
    category: 'OFFENSIVE',
    difficulty: 'INTERMEDIATE',
    targetScope: '10.200.1.25 (fin-api-01.finvault.local)',
    organizationName: 'FinVault Capital Network',
    briefing: 'You have low-privilege access as `www-data`. Enumerate local Linux binaries, discover custom SUID executable `/usr/bin/custom-backup`, exploit buffer overflow, and elevate to `root`.',
    objectives: [
      'Run `find / -perm -4000 2>/dev/null`',
      'Identify misconfigured SUID binary',
      'Exploit binary to trigger root shell',
      'Capture root flag'
    ],
    rulesOfEngagement: ['Authorized Linux lab target.'],
    timeLimitMinutes: 40,
    mitreTechniques: ['T1548.001'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'fin-api-01', ip: '10.200.1.25', vulnerability: 'SUID Root Binary Misconfiguration', evidenceHash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae' }
    ],
    authoritativeFlag: 'FLAG{DMZ_ROOT_PRIVILEGE_UNLOCKED}'
  },
  {
    id: 'mission-09',
    title: 'AWS S3 Public Bucket Misconfiguration Audit',
    category: 'CLOUD',
    difficulty: 'BEGINNER',
    targetScope: 's3://finvault-customer-backups.mycyberlab.local',
    organizationName: 'FinVault Cloud Tenant',
    briefing: 'An S3 bucket storing database backups was mistakenly provisioned with `AllUsers: READ` permission. Enumerate the bucket contents, identify exposed API keys, and update bucket ACL policy.',
    objectives: [
      'Enumerate synthetic S3 bucket ACL',
      'Download exposed backup archive',
      'Scrub API key credentials',
      'Apply S3 Block Public Access policy'
    ],
    rulesOfEngagement: ['Synthetic cloud API lab.'],
    timeLimitMinutes: 20,
    mitreTechniques: ['T1530', 'T1552.001'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 's3-cloud-storage', ip: '10.200.1.99', vulnerability: 'Public S3 Bucket ACL', evidenceHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069' }
    ],
    authoritativeFlag: 'MCL{s3_public_bucket_hardened}'
  },
  {
    id: 'mission-10',
    title: 'Insider Threat Mass Data Download Triage',
    category: 'SOC',
    difficulty: 'INTERMEDIATE',
    targetScope: '192.168.1.100 (file-share-01.corp.local)',
    organizationName: 'Apex Enterprise',
    briefing: 'DLP alerts triggered when user `j.smith` downloaded 5,000 sensitive HR files at 02:00 AM outside normal shift hours. Audit user session telemetry, verify scope, and restrict account access.',
    objectives: [
      'Review DLP logs in SOC console',
      'Correlate VPN login IP with geographical anomaly',
      'Suspend compromised user active directory account'
    ],
    rulesOfEngagement: ['Authorized SOC investigation.'],
    timeLimitMinutes: 30,
    mitreTechniques: ['T1078', 'T1020'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'file-share-01', ip: '192.168.1.100', vulnerability: 'Lack of Contextual Access Control', evidenceHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' }
    ],
    authoritativeFlag: 'MCL{insider_threat_account_suspended}'
  },
  {
    id: 'mission-11',
    title: 'NPM Supply-Chain Dependency Poisoning Investigation',
    category: 'DFIR',
    difficulty: 'ADVANCED',
    targetScope: '10.200.1.25 (fin-api-01.finvault.local)',
    organizationName: 'FinVault Development Team',
    briefing: 'A malicious sub-dependency (`express-auth-logger@1.0.4`) was published with telemetry exfiltration hooks. Inspect `package-lock.json`, trace environment variable dumping, and publish fixed manifest.',
    objectives: [
      'Inspect AST of imported NPM package',
      'Identify malicious network POST function',
      'Pin verified dependency version in package.json'
    ],
    rulesOfEngagement: ['Synthetic codebase audit.'],
    timeLimitMinutes: 35,
    mitreTechniques: ['T1195.002', 'T1059.007'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'fin-api-01', ip: '10.200.1.25', vulnerability: 'Supply Chain Package Poisoning', evidenceHash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' }
    ],
    authoritativeFlag: 'MCL{npm_supply_chain_poison_mitigated}'
  },
  {
    id: 'mission-12',
    title: 'Active Directory Kerberoasting & Lateral Movement',
    category: 'OFFENSIVE',
    difficulty: 'EXPERT',
    targetScope: '192.168.1.12 (ad-dc-01.corp.local)',
    organizationName: 'Corp Enterprise Active Directory',
    briefing: 'Request TGS service tickets for SPN accounts, crack the offline NTLM hash via Hashcat/John, and move laterally to Domain Controller `ad-dc-01`.',
    objectives: [
      'Execute Kerberoasting query using Impacket',
      'Extract TGS ticket hash',
      'Crack weak service account password offline',
      'Authenticate to Domain Controller'
    ],
    rulesOfEngagement: ['Target strictly inside Active Directory lab.'],
    timeLimitMinutes: 50,
    mitreTechniques: ['T1558.003', 'T1021.002'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'ad-dc-01', ip: '192.168.1.12', vulnerability: 'Weak SPN Service Password', evidenceHash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce' }
    ],
    authoritativeFlag: 'FLAG{KERBEROAST_CRACKED_SUCCESS}'
  },
  {
    id: 'mission-13',
    title: 'Persistence Analysis: Cron Jobs & SSH Keys',
    category: 'DEFENSIVE',
    difficulty: 'INTERMEDIATE',
    targetScope: '10.200.1.10 (fin-proxy-01.finvault.local)',
    organizationName: 'FinVault Capital Network',
    briefing: 'An attacker established persistence via a hidden cron job (`/etc/cron.d/backdoor`) and added an unauthorized public key to `~/.ssh/authorized_keys`. Discover and purge both persistence vectors.',
    objectives: [
      'Audit crontab and `/etc/cron*` directories',
      'Remove unauthorized SSH public keys',
      'Verify host boot security status'
    ],
    rulesOfEngagement: ['Authorized Linux security audit.'],
    timeLimitMinutes: 30,
    mitreTechniques: ['T1053.003', 'T1098.004'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'fin-proxy-01', ip: '10.200.1.10', vulnerability: 'Unauthorized Cron & SSH Key Persistence', evidenceHash: '7b502c3a1f48c8609ae212cdfb639dee39673f5e048edd51dee3e04710d62484' }
    ],
    authoritativeFlag: 'MCL{persistence_cron_and_ssh_purged}'
  },
  {
    id: 'mission-14',
    title: 'Malicious API BOLA / IDOR Parameter Tampering',
    category: 'OFFENSIVE',
    difficulty: 'INTERMEDIATE',
    targetScope: '10.200.1.25 (fin-api-01.finvault.local)',
    organizationName: 'FinVault API Gateway',
    briefing: 'The `/api/v1/user/profile?account_id=1001` endpoint fails to verify account ownership. Manipulate `account_id` to access administrator records and extract flag.',
    objectives: [
      'Interception: Inspect HTTP GET request parameter',
      'Parameter Tampering: Modify `account_id=1001` to `account_id=1`',
      'Extract Admin profile flag',
      'Propose RBAC check fix'
    ],
    rulesOfEngagement: ['Authorized REST API testing scope.'],
    timeLimitMinutes: 25,
    mitreTechniques: ['T1078', 'T1595'],
    phasesSupported: 13,
    syntheticArtifacts: [
      { hostname: 'fin-api-01', ip: '10.200.1.25', vulnerability: 'IDOR / Broken Object Level Authorization', evidenceHash: '2176949a212260ef28163f45c85b62b69480eb175b31f24d360ef8d617d9146f' }
    ],
    authoritativeFlag: 'FLAG{IDOR_PARAMETER_POLLUTION_UNAUTHORIZED_ACCESS_2026}'
  }
];
