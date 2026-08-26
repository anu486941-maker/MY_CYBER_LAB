export interface BossChallenge {
  id: string;
  levelId: number;
  title: string;
  codename: string;
  difficulty: 'Hard' | 'Extreme' | 'Master' | 'Legendary';
  category: string;
  xpReward: number;
  scenario: string;
  targetHost: string;
  networkContext: string;
  availableTools: string[];
  stages: {
    stageNumber: number;
    title: string;
    description: string;
    promptQuestion: string;
    options?: string[];
    correctAnswerIndex?: number;
    expectedEvidencePattern?: string;
    hint: string;
  }[];
  finalReportPrompt: string;
  rubric: {
    reasoningWeight: number;
    toolSelectionWeight: number;
    evidenceWeight: number;
    accuracyWeight: number;
    safetyWeight: number;
    documentationWeight: number;
  };
}

export const BOSS_CHALLENGES: BossChallenge[] = [
  {
    id: 'boss-lvl-01',
    levelId: 1,
    title: 'The SUID Escalation Mystery',
    codename: 'OP_TITAN_PRIVILEGE',
    difficulty: 'Hard',
    category: 'Linux Security',
    xpReward: 500,
    scenario: 'You are an incident responder investigating a compromised shared Linux development server (10.10.10.12). An unprivileged user account (dev_temp) was used to spawn a root shell without entering the root password. Reconstruct how the escalation occurred and patch the misconfiguration.',
    targetHost: '10.10.10.12 (prod-app-server)',
    networkContext: 'Internal VPC / Isolated Sandbox',
    availableTools: ['find', 'ls -la', 'strings', 'id', 'chmod', 'chown', 'auditd'],
    stages: [
      {
        stageNumber: 1,
        title: 'Initial Reconnaissance & Context',
        description: 'Establish what you know and what unprivileged privileges the user possesses.',
        promptQuestion: 'Which command accurately discovers all SUID binaries owned by root on the local system?',
        options: [
          'find / -perm -4000 -user root -type f 2>/dev/null',
          'ls -R /etc/passwd',
          'ps aux | grep root',
          'cat /var/log/auth.log'
        ],
        correctAnswerIndex: 0,
        hint: 'Use find with permission octal -4000 to search for the SUID bit.'
      },
      {
        stageNumber: 2,
        title: 'Identifying the Anomaly',
        description: 'Analyze output showing /usr/local/bin/backup_helper has permissions -rwsr-xr-x.',
        promptQuestion: 'Why is /usr/local/bin/backup_helper with -rwsr-xr-x a critical privilege escalation risk?',
        options: [
          'It allows any unprivileged user to execute the binary with root privileges because of the SUID bit',
          'It is a read-only text file',
          'It deletes the hard drive on execution',
          'It opens an unencrypted HTTP port'
        ],
        correctAnswerIndex: 0,
        hint: 'The \'s\' in the user permission triplet signifies Setuid (execute as owner).'
      },
      {
        stageNumber: 3,
        title: 'Evidence Extraction',
        description: 'Inspect strings inside the custom compiled binary /usr/local/bin/backup_helper.',
        promptQuestion: 'The binary calls system("tar -czf /tmp/backup.tar.gz /var/www") without an absolute path. How was PATH abused?',
        options: [
          'The user created a malicious executable named \'tar\' in /tmp and prepended /tmp to their PATH variable',
          'The user edited /etc/shadow directly',
          'The user rebooted the computer into safe mode',
          'The user entered a SQL injection string'
        ],
        correctAnswerIndex: 0,
        hint: 'Relative path execution in SUID binaries allows PATH environment variable hijacking.'
      },
      {
        stageNumber: 4,
        title: 'Defensive Remediation',
        description: 'Remove the SUID bit and secure the binary path.',
        promptQuestion: 'What is the correct command to strip the SUID bit from /usr/local/bin/backup_helper?',
        options: [
          'chmod u-s /usr/local/bin/backup_helper',
          'rm -rf /',
          'chmod 777 /usr/local/bin/backup_helper',
          'chown dev_temp /usr/local/bin/backup_helper'
        ],
        correctAnswerIndex: 0,
        hint: 'chmod u-s removes the Set User ID permission bit.'
      }
    ],
    finalReportPrompt: 'Synthesize your findings: state the root cause (PATH hijacking of relative call in custom SUID binary), the evidence (find output and strings inspection), and the mitigation (chmod u-s and hardcoding /bin/tar absolute path).',
    rubric: {
      reasoningWeight: 25,
      toolSelectionWeight: 20,
      evidenceWeight: 20,
      accuracyWeight: 15,
      safetyWeight: 10,
      documentationWeight: 10
    }
  },
  {
    id: 'boss-lvl-22',
    title: 'The Rogue PKI Impersonation',
    levelId: 22,
    codename: 'OP_CERT_HIJACK',
    difficulty: 'Extreme',
    category: 'Cryptography',
    xpReward: 750,
    scenario: 'Internal workstations are receiving fraudulent TLS certificates for corporate intranet domains without triggering browser warnings. Discover how an unauthorized intermediate Certificate Authority was trusted and neutralize it.',
    targetHost: '10.10.10.18 (corp-ca-trust)',
    networkContext: 'Corporate PKI Domain',
    availableTools: ['openssl', 'certutil', 'sha256sum', 'grep', 'diff'],
    stages: [
      {
        stageNumber: 1,
        title: 'Certificate Chain Analysis',
        description: 'Inspect the certificate chain presented by https://vault.internal.',
        promptQuestion: 'Which openssl command allows inspecting the full TLS certificate chain presented by a remote server?',
        options: [
          'openssl s_client -connect vault.internal:443 -showcerts',
          'openssl rand -hex 16',
          'openssl enc -aes-256-cbc -in cert.pem',
          'openssl dgst -sha256 vault.internal'
        ],
        correctAnswerIndex: 0,
        hint: 'Use openssl s_client with -showcerts to print all certificates in the TLS handshake chain.'
      },
      {
        stageNumber: 2,
        title: 'Root CA Fingerprint Verification',
        description: 'Compare the Issuer Subject and SHA-256 fingerprint against the authorized Root CA baseline.',
        promptQuestion: 'The certificate was signed by "Internal-Security-Root-CA" but its SHA-256 thumbprint does not match the master CA hash. What does this indicate?',
        options: [
          'A rogue self-signed intermediate CA with spoofed metadata was planted into the local workstation trust store',
          'The server is offline',
          'The DNS query failed',
          'The website is using HTTP/2'
        ],
        correctAnswerIndex: 0,
        hint: 'Anyone can generate a certificate with duplicate Subject metadata, but the cryptographic hash/fingerprint is unique.'
      },
      {
        stageNumber: 3,
        title: 'Neutralization & Remediation',
        description: 'Purge the rogue CA certificate from /etc/ssl/certs and regenerate the system bundle.',
        promptQuestion: 'What command sequence updates the certificate trust bundle on Debian/Ubuntu systems after deleting a malicious certificate from /usr/local/share/ca-certificates/?',
        options: [
          'update-ca-certificates --fresh',
          'apt-get install openssl',
          'reboot -f',
          'openssl req -new -x509'
        ],
        correctAnswerIndex: 0,
        hint: 'update-ca-certificates --fresh re-indexes and purges removed certificates from /etc/ssl/certs.'
      }
    ],
    finalReportPrompt: 'Detail the rogue CA thumbprint, how the system trust store was poisoned, and the automated verification script deployed to audit all corporate endpoints.',
    rubric: {
      reasoningWeight: 30,
      toolSelectionWeight: 20,
      evidenceWeight: 20,
      accuracyWeight: 15,
      safetyWeight: 10,
      documentationWeight: 5
    }
  },
  {
    id: 'boss-incident-response',
    levelId: 31,
    title: 'Enterprise Breach: Operation Nightfall Triage',
    codename: 'OP_NIGHTFALL_FINAL_BOSS',
    difficulty: 'Legendary',
    category: 'Incident Response & Capstone',
    xpReward: 1500,
    scenario: 'You are the Lead Cyber Range Incident Commander responding to an active intrusion inside NIGHTFALL DEFENSE LABS (10.10.10.0/24 & 10.10.20.0/24). An adversary has breached the perimeter web application, moved laterally into the domain database, and staged an exfiltration channel. Complete all investigation stages, locate the root cause, compile forensic evidence, and execute defensive remediation.',
    targetHost: '10.10.10.0/24 Enterprise Grid',
    networkContext: 'Multi-VLAN Enterprise Cyber Range',
    availableTools: ['Wireshark', 'Nmap', 'Burp Suite', 'Sysmon', 'Sigma', 'FTK/Autopsy', 'iptables', 'PowerShell'],
    stages: [
      {
        stageNumber: 1,
        title: 'Perimeter Intrusion Vector Discovery',
        description: 'Correlate web access logs with WAF alerts to identify the initial point of entry.',
        promptQuestion: 'What web vulnerability provided the adversary with initial remote command execution on 10.10.10.105?',
        options: [
          'Unauthenticated Apache Struts OGNL Injection (CVE-2017-5638) in Content-Type header',
          'Cross-Site Scripting (XSS) in user bio',
          'Robots.txt information disclosure',
          'Weak Wi-Fi password in parking lot'
        ],
        correctAnswerIndex: 0,
        hint: 'Review the Content-Type header logs for %{(#_memberAccess...'
      },
      {
        stageNumber: 2,
        title: 'Lateral Movement & Credential Dumping',
        description: 'Inspect Windows EventID 4624/4672 and LSASS memory access events.',
        promptQuestion: 'How did the adversary escalate from a low-privilege web service account to Domain Admin?',
        options: [
          'Dumped LSASS memory on the app server where a Domain Admin had an active cached session, recovering Kerberos tickets (Pass-the-Ticket)',
          'Guessed the administrator password',
          'Phished the front desk receptionist',
          'Executed a ping sweep'
        ],
        correctAnswerIndex: 0,
        hint: 'Mimikatz Pass-the-Ticket reuses cached Kerberos tickets from LSASS memory.'
      },
      {
        stageNumber: 3,
        title: 'C2 Beaconing & Exfiltration Staging',
        description: 'Analyze Zeek/Suricata network telemetry and DNS query logs.',
        promptQuestion: 'What channel was used by the attacker for covert C2 communications and data exfiltration?',
        options: [
          'DNS Tunneling utilizing TXT query lookups to staging domain ns1.exfil-stream[.]net',
          'Cleartext Telnet over port 23',
          'Direct FTP upload to localhost',
          'ICMP echo replies with no payload'
        ],
        correctAnswerIndex: 0,
        hint: 'High-frequency DNS TXT queries with Base64 encoded subdomains indicate DNS data tunneling.'
      },
      {
        stageNumber: 4,
        title: 'Enterprise Containment & Eradication',
        description: 'Formulate and execute the formal containment plan.',
        promptQuestion: 'What is the immediate priority containment action required to stop data exfiltration while preserving forensic volatile memory?',
        options: [
          'Isolate infected hosts at the network layer (VLAN quarantine / host firewall isolation) and dump memory image before rebooting',
          'Immediately unplug power cords without saving RAM',
          'Delete all log files to save disk space',
          'Email the attacker asking them to stop'
        ],
        correctAnswerIndex: 0,
        hint: 'Host isolation preserves volatile forensic memory while severing network C2 channels.'
      }
    ],
    finalReportPrompt: 'Author the definitive Incident Post-Mortem Report including Timeline, MITRE ATT&CK Mapping, CVSS v3.1 Root Cause, Forensic IoCs (Hashes, IPs, Domains), and 5 Strategic Defensive Hardening Mandates.',
    rubric: {
      reasoningWeight: 25,
      toolSelectionWeight: 20,
      evidenceWeight: 20,
      accuracyWeight: 15,
      safetyWeight: 10,
      documentationWeight: 10
    }
  }
];
