import { ClientEngagement } from '../types';

export const AUTHORIZED_CLIENT_ENGAGEMENTS: ClientEngagement[] = [
  {
    id: 'ace-northstar-01',
    clientName: 'Northstar Technologies',
    logoEmoji: '⭐',
    engagementTitle: 'External Corporate Perimeter & Service Audit',
    engagementType: 'External Penetration Testing & Reconnaissance',
    industry: 'Cloud Infrastructure & SaaS',
    difficulty: 'Beginner',
    xpReward: 650,
    estimatedMinutes: 45,
    threatModel: 'External unauthenticated cybercriminals probing internet-facing company assets for exposed maintenance ports and default credentials.',
    briefing: [
      'Northstar Technologies is a mid-sized cloud analytics platform preparing for SOC 2 Type II compliance.',
      'Your objective as the lead penetration tester is to perform an external network reconnaissance and service enumeration on their authorized training subnet.',
      'Identify any misconfigured services, verify service version vulnerabilities, preserve forensic evidence, and formulate actionable remediation recommendations.'
    ],
    scope: {
      authorizedSubnet: '10.50.0.0/24',
      authorizedDomains: ['northstar-analytics.internal', 'api.northstar-analytics.internal', 'vpn.northstar-analytics.internal'],
      authorizedAssets: [
        {
          id: 'asset-ns-01',
          name: 'ns-edge-router.internal',
          ip: '10.50.0.1',
          role: 'Border Gateway & Firewall',
          os: 'Linux 5.15 (EdgeOS)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 22, name: 'ssh', version: 'OpenSSH 8.9p1', state: 'open' },
            { port: 80, name: 'http', version: 'nginx 1.22.0', state: 'open' },
            { port: 443, name: 'https', version: 'nginx 1.22.0 (TLS 1.3)', state: 'open' }
          ]
        },
        {
          id: 'asset-ns-02',
          name: 'ns-web-app01.internal',
          ip: '10.50.0.10',
          role: 'Customer Analytics Portal',
          os: 'Ubuntu 22.04 LTS',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 80, name: 'http', version: 'Apache 2.4.52', state: 'open' },
            { port: 8080, name: 'http-proxy', version: 'Node.js Express / Swagger Docs (Exposed)', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Exposed Swagger UI on port 8080 reveals unauthenticated internal metrics and diagnostic endpoints.'
        },
        {
          id: 'asset-ns-03',
          name: 'ns-db-staging.internal',
          ip: '10.50.0.25',
          role: 'Staging Database Host',
          os: 'Debian 11',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 3306, name: 'mysql', version: 'MySQL 8.0.32 (Permissive bind 0.0.0.0)', state: 'open' },
            { port: 6379, name: 'redis', version: 'Redis 6.2.6 (Unprotected Mode / No Auth)', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Redis server is bound to public interface with requirepass disabled, allowing unauthorized key inspection.'
        }
      ],
      prohibitedTargets: [
        'Any IP outside 10.50.0.0/24',
        'Production billing services (192.168.100.0/24)',
        'Third-party cloud identity providers (Okta / Google Workspace)',
        'Real employee workstations'
      ],
      rulesOfEngagement: [
        'Strictly confine all port scans and requests to 10.50.0.0/24.',
        'Do not perform Denial-of-Service (DoS) or destructive flooding.',
        'Preserve raw command outputs in the Evidence Locker for every discovered finding.',
        'Always verify findings before classifying them as vulnerabilities.',
        'Report all critical flaws immediately with remediation guidance.'
      ]
    },
    objectives: [
      {
        id: 'obj-ns-1',
        title: 'Network Discovery & Active Host Sweeping',
        category: 'Reconnaissance',
        description: 'Execute an authorized ping sweep / Nmap discovery scan on 10.50.0.0/24 to enumerate live hosts.',
        points: 100,
        completed: false,
        evidenceRequired: true,
        hint: 'Use nmap -sn 10.50.0.0/24 or nmap -sP 10.50.0.0/24 to discover live assets without port scanning.'
      },
      {
        id: 'obj-ns-2',
        title: 'Comprehensive Service & Version Enumeration',
        category: 'Enumeration',
        description: 'Scan live hosts for open ports, running daemon banners, and service versions (e.g. nmap -sV -sC -p- 10.50.0.10,25).',
        points: 150,
        completed: false,
        evidenceRequired: true,
        hint: 'Inspect ports 8080, 3306, and 6379 for exposed administrative interfaces.'
      },
      {
        id: 'obj-ns-3',
        title: 'Unauthenticated Redis Key Enumeration Proof',
        category: 'Vulnerability Analysis',
        description: 'Connect to 10.50.0.25 on port 6379 with redis-cli / curl probe and collect evidence of unauthenticated info access.',
        points: 150,
        completed: false,
        evidenceRequired: true,
        hint: 'Send redis command "INFO" to capture configuration telemetry evidence.'
      },
      {
        id: 'obj-ns-4',
        title: 'Formal Evidence Documentation & Finding Creation',
        category: 'Evidence Collection',
        description: 'Create a High-severity finding in the Finding Builder referencing your Redis evidence (EVID) item.',
        points: 150,
        completed: false,
        evidenceRequired: true,
        hint: 'Ensure your finding includes affected asset, CVSS 7.5, and remediation instructions (requirepass & bind 127.0.0.1).'
      },
      {
        id: 'obj-ns-5',
        title: 'Remediation Retest & Final Report Generation',
        category: 'Remediation',
        description: 'Apply simulated client hardening patch, retest the service, verify closed state, and generate the executive report.',
        points: 100,
        completed: false,
        evidenceRequired: false,
        hint: 'Go to the Retest tab, trigger simulated redis.conf hardening, and re-run verification.'
      }
    ],
    retestScenarios: [
      {
        findingId: 'FIND-NS-REDIS',
        patchDescription: 'Applied bind 127.0.0.1 and enabled requirepass authentication in /etc/redis/redis.conf.',
        verificationCommand: 'nmap -p 6379 -sV 10.50.0.25',
        expectedPatchedOutput: 'PORT     STATE  SERVICE\n6379/tcp closed redis\nService unreachable from external network.'
      }
    ]
  },
  {
    id: 'ace-redpeak-02',
    clientName: 'RedPeak Retail',
    logoEmoji: '🛍️',
    engagementTitle: 'E-Commerce Web Application & API Security Assessment',
    engagementType: 'Web Application Penetration Test (OWASP Top 10)',
    industry: 'E-Commerce & Digital Commerce',
    difficulty: 'Intermediate',
    xpReward: 850,
    estimatedMinutes: 60,
    threatModel: 'Malicious threat actors attempting order tampering, customer PII harvesting, and payment gateway bypass via web injection.',
    briefing: [
      'RedPeak Retail operates an online storefront serving 150,000 customers monthly.',
      'Recent code revisions to their promotional coupon system and customer profile API need thorough pre-launch security validation.',
      'Test for SQL injection, Broken Object Level Authorization (BOLA/IDOR), Reflected XSS in search parameters, and insecure cookie flags.'
    ],
    scope: {
      authorizedSubnet: '172.20.10.0/24',
      authorizedDomains: ['shop.redpeak-retail.internal', 'api-checkout.redpeak-retail.internal'],
      authorizedAssets: [
        {
          id: 'asset-rp-web',
          name: 'storefront-nginx01.internal',
          ip: '172.20.10.15',
          role: 'E-Commerce Web Front-End',
          os: 'Ubuntu 22.04 LTS',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 80, name: 'http', version: 'nginx 1.24.0', state: 'open' },
            { port: 443, name: 'https', version: 'nginx 1.24.0', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Product search endpoint /search?q= allows SQL injection via unsanitized boolean conditions.'
        },
        {
          id: 'asset-rp-api',
          name: 'api-gateway.redpeak-retail.internal',
          ip: '172.20.10.20',
          role: 'REST API & User Profile Microservice',
          os: 'Alpine Linux (Docker Node.js)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 5000, name: 'http-api', version: 'Express.js v4.18', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Endpoint /api/v1/orders/:orderId fails to validate JWT ownership against requested order ID (BOLA/IDOR).'
        }
      ],
      prohibitedTargets: [
        'Real Visa / Stripe merchant gateways',
        'Physical warehouse fulfillment barcode scanners',
        'Marketing email servers'
      ],
      rulesOfEngagement: [
        'Perform all tests through simulated sandbox browser/Burp proxy.',
        'Do not alter live product pricing in a permanent manner.',
        'Collect HTTP request and response pairs for all finding artifacts.'
      ]
    },
    objectives: [
      {
        id: 'obj-rp-1',
        title: 'Web Directory & Parameter Enumeration',
        category: 'Enumeration',
        description: 'Map web endpoints and discover hidden API routes using directory fuzzing and robots.txt analysis.',
        points: 120,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-rp-2',
        title: 'SQL Injection Proof of Concept Extraction',
        category: 'Vulnerability Analysis',
        description: 'Exploit boolean-based SQL injection on the search parameter to extract the database version banner.',
        points: 200,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-rp-3',
        title: 'BOLA / IDOR Authorization Bypass Verification',
        category: 'Vulnerability Analysis',
        description: 'Demonstrate horizontal privilege escalation by retrieving another user order using swapped orderId parameter.',
        points: 180,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-rp-4',
        title: 'Remediation Proposal & Prepared Statement Guideline',
        category: 'Reporting',
        description: 'Document the findings with parameterized query code snippets and CVSS 8.6 impact breakdown.',
        points: 150,
        completed: false,
        evidenceRequired: true
      }
    ]
  },
  {
    id: 'ace-bluegrid-03',
    clientName: 'BlueGrid Finance',
    logoEmoji: '🏦',
    engagementTitle: 'Authentication & Access Control Security Audit',
    engagementType: 'Identity & Authentication Assessment',
    industry: 'Financial Services & Banking',
    difficulty: 'Intermediate',
    xpReward: 900,
    estimatedMinutes: 60,
    threatModel: 'Targeted credential stuffing, session hijacking, and privilege escalation targeting teller and loan officer portals.',
    briefing: [
      'BlueGrid Finance operates a commercial credit appraisal system.',
      'Your task is to audit the multi-factor authentication implementation, password reset flows, and session invalidation triggers.',
      'Check for JWT algorithm manipulation (none algorithm / weak HMAC secret), missing rate limits on login, and insecure direct session reuse.'
    ],
    scope: {
      authorizedSubnet: '192.168.42.0/24',
      authorizedDomains: ['portal.bluegrid-finance.internal', 'auth.bluegrid-finance.internal'],
      authorizedAssets: [
        {
          id: 'asset-bg-auth',
          name: 'auth-idp01.bluegrid-finance.internal',
          ip: '192.168.42.5',
          role: 'Identity Provider & OAuth/OIDC Server',
          os: 'Red Hat Enterprise Linux 9',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 443, name: 'https', version: 'Keycloak / Spring Boot (Custom Auth Filter)', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'JWT token header "alg": "none" is accepted by the legacy token verification filter.'
        },
        {
          id: 'asset-bg-app',
          name: 'loan-teller.bluegrid-finance.internal',
          ip: '192.168.42.12',
          role: 'Loan Processing Dashboard',
          os: 'RHEL 9',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 443, name: 'https', version: 'Tomcat 9.0.58', state: 'open' },
            { port: 8443, name: 'https-alt', version: 'Actuator Metrics Endpoint (Exposed)', state: 'open' }
          ],
          isVulnerable: true
        }
      ],
      prohibitedTargets: [
        'Swift / Fedwire clearing interbank interfaces',
        'Physical ATM controller subnet (10.0.99.0/24)',
        'Core customer debit card database'
      ],
      rulesOfEngagement: [
        'Audit authentication logic without locking out real administrative accounts.',
        'Validate JWT token signature bypass and document the resulting administrative claim.'
      ]
    },
    objectives: [
      {
        id: 'obj-bg-1',
        title: 'Authentication Endpoint Discovery & Rate Limit Audit',
        category: 'Enumeration',
        description: 'Test login endpoint for account lockout enforcement and brute-force mitigation.',
        points: 150,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-bg-2',
        title: 'JWT None-Algorithm Signature Bypass Proof',
        category: 'Vulnerability Analysis',
        description: 'Forge a valid JWT token payload with role="ADMINISTRATOR" using alg="none" to access /admin/accounts.',
        points: 250,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-bg-3',
        title: 'Exposed Actuator Environment Dump Remediation',
        category: 'Remediation',
        description: 'Identify exposed /actuator/env endpoint leaking database credentials and formulate security filter fix.',
        points: 200,
        completed: false,
        evidenceRequired: true
      }
    ]
  },
  {
    id: 'ace-novahealth-04',
    clientName: 'NovaHealth Systems',
    logoEmoji: '🏥',
    engagementTitle: 'Hospital Linux Infrastructure & SUID Privilege Audit',
    engagementType: 'Internal Linux Host & SUID Assessment',
    industry: 'Healthcare & Clinical Informatics',
    difficulty: 'Hard',
    xpReward: 1100,
    estimatedMinutes: 75,
    threatModel: 'Lateral movement by insider threat or compromised nurse station pivot escalating to root privileges on patient telemetry servers.',
    briefing: [
      'NovaHealth Systems manages medical telemetry and radiology archiving across 4 hospital facilities.',
      'As part of a HIPAA security audit, you have been granted unprivileged SSH access (user: clinical_nurse) to the internal archiving host.',
      'Your task is to conduct an internal security assessment, uncover privilege escalation vectors (misconfigured SUID binaries, writable cron jobs, sudo misconfigurations), and audit patient database security.'
    ],
    scope: {
      authorizedSubnet: '10.80.0.0/24',
      authorizedDomains: ['telemetry-archive.novahealth.internal'],
      authorizedAssets: [
        {
          id: 'asset-nh-01',
          name: 'telemetry-archive01.internal',
          ip: '10.80.0.40',
          role: 'DICOM Imaging & Telemetry Archive Host',
          os: 'Ubuntu 20.04 LTS (Kernel 5.4.0-42)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 22, name: 'ssh', version: 'OpenSSH 8.2p1', state: 'open' },
            { port: 104, name: 'dicom', version: 'Orthanc DICOM Server 1.9.0', state: 'open' },
            { port: 8042, name: 'http', version: 'Orthanc Web Portal', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Custom SUID binary /usr/local/bin/backup-telemetry executes cp with relative path rather than absolute path.'
        }
      ],
      prohibitedTargets: [
        'Live patient monitor hardware / ICU devices',
        'Emergency surgical theater network'
      ],
      rulesOfEngagement: [
        'Do not terminate medical logging daemons or delete telemetry records.',
        'Demonstrate root privilege escalation using harmless proof (id command execution) and preserve evidence.'
      ]
    },
    objectives: [
      {
        id: 'obj-nh-1',
        title: 'Linux SUID Binary & Capabilities Enumeration',
        category: 'Enumeration',
        description: 'Execute find / -perm -4000 2>/dev/null to identify non-standard SUID root binaries on the system.',
        points: 200,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-nh-2',
        title: 'Path Hijacking / SUID Privilege Escalation Proof',
        category: 'Vulnerability Analysis',
        description: 'Exploit the relative path invocation in backup-telemetry to spawn a root shell and capture id output.',
        points: 300,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-nh-3',
        title: 'Defensive Hardening: Principle of Least Privilege',
        category: 'Remediation',
        description: 'Author remediation report detailing how to replace SUID with Linux capabilities (cap_dac_read_search) or sudoers scoping.',
        points: 200,
        completed: false,
        evidenceRequired: true
      }
    ]
  },
  {
    id: 'ace-vertex-05',
    clientName: 'Vertex Labs',
    logoEmoji: '⚡',
    engagementTitle: 'Active Directory Domain Architecture & Kerberos Audit',
    engagementType: 'Active Directory & Domain Privilege Assessment',
    industry: 'Defense Research & Enterprise Software',
    difficulty: 'Advanced',
    xpReward: 1350,
    estimatedMinutes: 90,
    threatModel: 'Advanced Persistent Threat (APT) utilizing Kerberoasting and AS-REP roasting to achieve Domain Admin privilege.',
    briefing: [
      'Vertex Labs is an aerospace R&D enterprise with a 5,000-user Active Directory forest (VERTEX.LOCAL).',
      'You are provided standard domain user credentials (user: research.intern).',
      'Audit the domain architecture for Kerberoastable Service Principal Names (SPNs), accounts with "Do not require Kerberos preauthentication" enabled (AS-REP roasting), and insecure Group Policy Object (GPO) write permissions.'
    ],
    scope: {
      authorizedSubnet: '10.100.0.0/24',
      authorizedDomains: ['dc01.vertex.local', 'fs01.vertex.local'],
      authorizedAssets: [
        {
          id: 'asset-vx-dc',
          name: 'DC01.VERTEX.LOCAL',
          ip: '10.100.0.5',
          role: 'Primary Domain Controller & Global Catalog',
          os: 'Windows Server 2022 Datacenter',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 53, name: 'dns', state: 'open' },
            { port: 88, name: 'kerberos', state: 'open' },
            { port: 135, name: 'msrpc', state: 'open' },
            { port: 389, name: 'ldap', state: 'open' },
            { port: 445, name: 'microsoft-ds', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Account svc_mssql has SPN MSSQLSvc/fs01.vertex.local:1433 with weak RC4-encrypted service ticket.'
        }
      ],
      prohibitedTargets: [
        'Federal customer test ranges',
        'Physical badge access servers'
      ],
      rulesOfEngagement: [
        'Do not lock out Domain Admin accounts.',
        'Document Kerberoastable SPN extraction and recommend AES256 enforcement and Managed Service Accounts (gMSA).'
      ]
    },
    objectives: [
      {
        id: 'obj-vx-1',
        title: 'AD Domain Enumeration & SPN Querying',
        category: 'Enumeration',
        description: 'Query LDAP / GetUserSPNs.py to discover user accounts with associated Service Principal Names.',
        points: 250,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-vx-2',
        title: 'Kerberoast Ticket Request & Hash Analysis',
        category: 'Vulnerability Analysis',
        description: 'Request a Kerberos TGS ticket for svc_mssql, analyze the ticket format, and document encryption strength.',
        points: 350,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-vx-3',
        title: 'gMSA Migration & Tiered AD Architecture Report',
        category: 'Reporting',
        description: 'Draft the executive AD remediation strategy recommending Group Managed Service Accounts and Tier 0 isolation.',
        points: 250,
        completed: false,
        evidenceRequired: true
      }
    ]
  },
  {
    id: 'ace-nightfall-06',
    clientName: 'Operation Nightfall (Master Capstone)',
    logoEmoji: '🦅',
    engagementTitle: 'Full-Spectrum Enterprise Penetration Test & Executive Report',
    engagementType: 'Full-Spectrum Red Team Assessment (Capstone)',
    industry: 'Multinational Financial & Defense Conglomerate',
    difficulty: 'Capstone',
    xpReward: 2500,
    estimatedMinutes: 120,
    threatModel: 'Sophisticated multi-vector attack chain spanning external recon, web portal exploitation, internal lateral pivot, and privilege escalation.',
    briefing: [
      'OPERATION NIGHTFALL is the ultimate capstone engagement for My Cyber Lab trainees.',
      'You are contracted by the Board of Directors to perform a comprehensive, black-box penetration testing assessment.',
      'Starting from zero internal knowledge, you must execute the entire professional methodology: Reconnaissance -> Port Scanning -> Web Exploitation -> Evidence Preservation -> SUID Privilege Escalation -> Remediation Retest -> Board-Level Executive Report.'
    ],
    scope: {
      authorizedSubnet: '10.99.0.0/24',
      authorizedDomains: ['portal.nightfall-corp.internal', 'vpn.nightfall-corp.internal', 'vault.nightfall-corp.internal'],
      authorizedAssets: [
        {
          id: 'asset-nf-edge',
          name: 'edge-gateway.nightfall-corp.internal',
          ip: '10.99.0.1',
          role: 'Border Firewall & Router',
          os: 'Linux 5.15',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 22, name: 'ssh', version: 'OpenSSH 8.9p1', state: 'open' },
            { port: 80, name: 'http', version: 'nginx 1.24.0', state: 'open' }
          ]
        },
        {
          id: 'asset-nf-web',
          name: 'portal-app.nightfall-corp.internal',
          ip: '10.99.0.10',
          role: 'Corporate Web Portal & Document Vault',
          os: 'Ubuntu 22.04 LTS',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 80, name: 'http', version: 'Apache 2.4.52', state: 'open' },
            { port: 8080, name: 'http-proxy', version: 'Node.js Diagnostic API', state: 'open' }
          ],
          isVulnerable: true
        },
        {
          id: 'asset-nf-vault',
          name: 'internal-vault.nightfall-corp.internal',
          ip: '10.99.0.50',
          role: 'Core Enterprise Database & Credential Vault',
          os: 'Debian 11 (Hardened)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 5432, name: 'postgresql', version: 'PostgreSQL 14.2', state: 'open' }
          ],
          isVulnerable: true
        }
      ],
      prohibitedTargets: [
        'Any non-authorized public internet IPs',
        'Physical data center infrastructure'
      ],
      rulesOfEngagement: [
        'Demonstrate end-to-end craftsmanship: every finding must cite an EVID-xxx token.',
        'AMAN will review your final report for technical rigor, CVSS accuracy, and remediation viability.'
      ]
    },
    objectives: [
      {
        id: 'obj-nf-1',
        title: 'Phase 1: External Reconnaissance & Host Discovery',
        category: 'Reconnaissance',
        description: 'Map the entire 10.99.0.0/24 subnet and identify all active corporate assets and open services.',
        points: 300,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-nf-2',
        title: 'Phase 2: Web Exploitation & Foothold Acquisition',
        category: 'Vulnerability Analysis',
        description: 'Exploit the diagnostic endpoint on portal-app to acquire initial low-privilege command execution.',
        points: 500,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-nf-3',
        title: 'Phase 3: Internal SUID Privilege Escalation',
        category: 'Vulnerability Analysis',
        description: 'Escalate from standard user to root on the internal host and document the privilege escalation path.',
        points: 600,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-nf-4',
        title: 'Phase 4: Complete Evidence Locker & Finding Matrix',
        category: 'Evidence Collection',
        description: 'Build at least 3 fully validated findings with CVSS scores, reproduction steps, and evidence links.',
        points: 400,
        completed: false,
        evidenceRequired: true
      },
      {
        id: 'obj-nf-5',
        title: 'Phase 5: Remediation Verification & Retest',
        category: 'Remediation',
        description: 'Execute retest verification against all patched services and mark findings as verified closed.',
        points: 300,
        completed: false,
        evidenceRequired: false
      },
      {
        id: 'obj-nf-6',
        title: 'Phase 6: Board-Ready Executive Penetration Test Report',
        category: 'Reporting',
        description: 'Generate and submit the comprehensive penetration testing report for AMAN senior reviewer scoring.',
        points: 400,
        completed: false,
        evidenceRequired: false
      }
    ]
  }
];

export function getClientEngagementById(id: string): ClientEngagement {
  return AUTHORIZED_CLIENT_ENGAGEMENTS.find(e => e.id === id) || AUTHORIZED_CLIENT_ENGAGEMENTS[0];
}
