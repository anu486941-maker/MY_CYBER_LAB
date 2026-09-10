/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/machines/MachineRegistry.ts
 * Purpose: Authoritative Catalog of Intentionally Vulnerable Target Machines
 */

import { CyberMachine } from '../types';

export class MachineRegistry {
  private static readonly MACHINES: CyberMachine[] = [
    {
      id: 'm-webforge-01',
      name: 'WebForge Alpha',
      codename: 'WEBFORGE-01',
      hostname: 'webforge.internal',
      ipAddress: '10.20.0.10',
      subnet: '10.20.0.0/24',
      os: 'Ubuntu 22.04 LTS',
      difficulty: 'BEGINNER',
      category: 'WEB_APPLICATION',
      runtimeType: 'ISOLATED_SANDBOX',
      description: 'Intentionally misconfigured corporate intranet server running an outdated custom PHP portal with exposed diagnostic endpoints and weak credentials.',
      scenario: 'Client "Nightfall Logistics" contracted an authorized external web assessment against their staging portal.',
      requiredSkills: ['c0_client_server', 'c2_tcp_handshake', 'c4_nmap_scanning', 'c5_http_methods'],
      recommendedPrerequisites: ['c1_linux_fs_perms', 'c3_cia_triad'],
      services: [
        {
          port: 22,
          protocol: 'TCP',
          serviceName: 'SSH',
          product: 'OpenSSH',
          version: '8.9p1 Ubuntu-3ubuntu0.6',
          banner: 'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6',
          state: 'OPEN'
        },
        {
          port: 80,
          protocol: 'TCP',
          serviceName: 'HTTP',
          product: 'Apache httpd',
          version: '2.4.52 (Ubuntu)',
          banner: 'Server: Apache/2.4.52 (Ubuntu)\nX-Powered-By: PHP/8.1.2',
          state: 'OPEN',
          isVulnerable: true,
          vulnerabilityRef: 'VULN-WEB-001'
        },
        {
          port: 8080,
          protocol: 'TCP',
          serviceName: 'HTTP-ALT',
          product: 'Werkzeug/Flask Internal API',
          version: '2.2.2',
          banner: 'Server: Werkzeug/2.2.2 Python/3.10.12',
          state: 'OPEN',
          isVulnerable: true,
          vulnerabilityRef: 'VULN-API-002'
        }
      ],
      vulnerabilities: [
        {
          id: 'VULN-WEB-001',
          name: 'Exposed Server Info & Directory Traversal via Config Backup',
          cvssScore: 7.5,
          severity: 'HIGH',
          mitreTechnique: 'T1083 - File and Directory Discovery',
          description: 'Apache server exposes .git directory and unauthenticated /backup/db_config.php.bak containing database credentials.',
          servicePort: 80,
          exploitPrerequisiteConcepts: ['c4_burp_proxy', 'c5_rest_apis_json'],
          remediationAdvice: 'Restrict access to dotfiles (.git, .env) and relocate backups outside the web document root.'
        },
        {
          id: 'VULN-API-002',
          name: 'Flask Debugger Interactive Console Enabled with Default PIN',
          cvssScore: 8.8,
          severity: 'HIGH',
          mitreTechnique: 'T1190 - Exploit Public-Facing Application',
          description: 'Werkzeug debug console accessible on port 8080 without IP restriction, allowing Python evaluation.',
          servicePort: 8080,
          exploitPrerequisiteConcepts: ['c1_linux_fs_perms', 'c5_rest_apis_json'],
          remediationAdvice: 'Set FLASK_ENV=production and disable debug mode in configuration.'
        }
      ],
      flags: [
        {
          id: 'flag-user-wf01',
          type: 'USER_FLAG',
          description: 'Initial Access User Flag located in /home/developer/user.txt',
          points: 50,
          location: '/home/developer/user.txt',
          expectedHashSha256: '7051af69e69b4733a1ba74fd1b159ef270e7180d3a7f9156dd1a56470869bc2f',
          canonicalValue: 'FLAG{WEBFORGE_INITIAL_ACCESS_DEV_8821}'
        },
        {
          id: 'flag-root-wf01',
          type: 'ROOT_FLAG',
          description: 'Root Administrative Flag located in /root/root.txt via sudo tar wildcards privilege escalation',
          points: 100,
          location: '/root/root.txt',
          expectedHashSha256: '82f933781747c58411df7eca95214e433fd368c5c45522cb066ca71937ecefa1',
          canonicalValue: 'FLAG{WEBFORGE_ROOT_SYSTEM_MASTER_9901}'
        }
      ],
      defaultCredentials: {
        'developer': 'devpass_2026!',
        'web_admin': 'Admin123!'
      },
      filesystemBaseline: {
        '/var/www/html/index.html': '<h1>Nightfall Logistics Internal Portal</h1>',
        '/var/www/html/backup/db_config.php.bak': '<?php $DB_USER="developer"; $DB_PASS="devpass_2026!"; ?>',
        '/home/developer/user.txt': '[CONFIDENTIAL_TRAINING_USER_FLAG]',
        '/root/root.txt': '[CONFIDENTIAL_TRAINING_ROOT_FLAG]'
      },
      authoritativeRulesOfEngagement: {
        authorizedSubnet: '10.20.0.0/24',
        allowedPorts: [22, 80, 8080],
        prohibitedTargets: ['10.20.1.0/24', '192.168.0.0/16', '172.16.0.0/12']
      },
      learningOutcomes: [
        'Perform accurate TCP service enumeration with nmap -sV -sC',
        'Identify hidden directories and sensitive backup files',
        'Leverage discovered developer credentials to establish an SSH foothold',
        'Analyze sudoers configuration and escalate privileges to root'
      ],
      defensiveRemediation: {
        patchOverview: 'Remove public directory indexing, restrict Werkzeug debugging to localhost, and revoke wildcard sudo permissions.',
        hardeningSteps: [
          'Disable Apache mod_autoindex and remove .bak files from webroot',
          'Disable Werkzeug console in production (FLASK_DEBUG=0)',
          'Remove (ALL) NOPASSWD: /usr/bin/tar from /etc/sudoers.d/developer'
        ],
        verificationCommand: 'curl -s -I http://10.20.0.10/backup/db_config.php.bak'
      }
    },
    {
      id: 'm-blackout-boss',
      name: 'Blackout Enterprise Pivot',
      codename: 'BLACKOUT-01',
      hostname: 'gateway.blackout.corp',
      ipAddress: '10.30.0.15',
      subnet: '10.30.0.0/24',
      os: 'Debian 12',
      difficulty: 'HARD',
      category: 'ACTIVE_DIRECTORY',
      runtimeType: 'VIRTUAL_RANGE',
      description: 'Multi-tiered enterprise infrastructure featuring an external Linux edge gateway, internal SQL data store, and a domain controller.',
      scenario: 'Black-box red team simulation testing external perimeter resistance, pivot stability, and Kerberos attack vectors.',
      requiredSkills: ['c2_tcp_handshake', 'c4_nmap_scanning', 'c8_suid_capabilities', 'c10_kerberos_attacks', 'c11_siem_architecture'],
      recommendedPrerequisites: ['c9_windows_event_forensics', 'c16_sigma_detection_rules'],
      services: [
        {
          port: 22,
          protocol: 'TCP',
          serviceName: 'SSH',
          product: 'OpenSSH',
          version: '9.2p1 Debian-2+deb12u2',
          banner: 'SSH-2.0-OpenSSH_9.2p1 Debian-2+deb12u2',
          state: 'OPEN'
        },
        {
          port: 80,
          protocol: 'TCP',
          serviceName: 'HTTP',
          product: 'nginx',
          version: '1.22.1',
          banner: 'Server: nginx/1.22.1',
          state: 'OPEN',
          isVulnerable: true
        },
        {
          port: 88,
          protocol: 'TCP',
          serviceName: 'Kerberos KDC',
          product: 'Microsoft Windows Kerberos',
          version: 'Active Directory Domain Service',
          banner: 'Kerberos-Sec: BLACKOUT.CORP KDC Service',
          state: 'OPEN',
          isVulnerable: true
        },
        {
          port: 445,
          protocol: 'TCP',
          serviceName: 'SMB',
          product: 'Microsoft-DS',
          version: 'Windows Server 2022',
          banner: 'SMBv3 Active Directory Share',
          state: 'OPEN'
        }
      ],
      vulnerabilities: [
        {
          id: 'VULN-AD-001',
          name: 'Kerberoastable Service Principal Name (SPN) with Weak Password Hash',
          cvssScore: 8.2,
          severity: 'HIGH',
          mitreTechnique: 'T1558.003 - Steal or Forge Kerberos Tickets: Kerberoasting',
          description: 'Service account "svc_sql" has an SPN registered with RC4 encryption and a crackable passphrase.',
          servicePort: 88,
          exploitPrerequisiteConcepts: ['c10_kerberos_attacks', 'c3_cia_triad'],
          remediationAdvice: 'Migrate SPNs to Group Managed Service Accounts (gMSA) with 128-bit random passwords and enforce AES Kerberos encryption.'
        }
      ],
      flags: [
        {
          id: 'flag-pivot-bo01',
          type: 'USER_FLAG',
          description: 'Perimeter Access Flag on Gateway',
          points: 100,
          location: '/home/operator/gateway.txt',
          expectedHashSha256: '134f836386ff4106f88c84e8e85969439c8fa5e868c6d9c394571e9a146afa66',
          canonicalValue: 'FLAG{BLACKOUT_PERIMETER_GATEWAY_COMPROMISE_1044}'
        },
        {
          id: 'flag-domain-bo01',
          type: 'ROOT_FLAG',
          description: 'Enterprise Domain Administrator Flag in C:\\Flags\\da_flag.txt',
          points: 250,
          location: 'C:\\Flags\\da_flag.txt',
          expectedHashSha256: '34f572bad9fbfc4b07adc0f955b610789fea64b0545a931fb8028b273be6e9a8',
          canonicalValue: 'FLAG{BLACKOUT_ENTERPRISE_DOMAIN_ADMIN_APEX_9941}'
        }
      ],
      defaultCredentials: {
        'operator': 'Operator@2026',
        'svc_sql': 'Summer2024!'
      },
      filesystemBaseline: {
        '/home/operator/gateway.txt': '[CONFIDENTIAL_GATEWAY_FLAG]',
        '/etc/hosts': '127.0.0.1 localhost\n10.30.0.15 gateway.blackout.corp\n10.30.10.10 dc01.blackout.corp\n10.30.10.20 srv01.blackout.corp\n10.30.10.30 client01.blackout.corp'
      },
      authoritativeRulesOfEngagement: {
        authorizedSubnet: '10.30.0.0/24',
        allowedPorts: [22, 80, 88, 389, 445],
        prohibitedTargets: ['10.30.50.0/24', '192.168.1.0/24']
      },
      learningOutcomes: [
        'Establish initial foothold through web service exploitation',
        'Enumerate Active Directory user accounts and SPNs from Linux AttackBox',
        'Execute Kerberoasting attack to recover service account credentials',
        'Perform lateral movement to Domain Controller and collect executive evidence'
      ],
      defensiveRemediation: {
        patchOverview: 'Enforce AES256 for Kerberos tickets, disable RC4, implement gMSA, and deploy Sigma detection rules for Event ID 4769.',
        hardeningSteps: [
          'Configure KDC to reject RC4-HMAC ticket requests',
          'Deploy Splunk / Elastic SIEM correlation for unusual TGS request volumes',
          'Enforce Privileged Access Workstations (PAW) for Domain Admin accounts'
        ],
        verificationCommand: 'Get-ADUser -Filter {ServicePrincipalName -like "*"} -Properties ServicePrincipalName'
      }
    },
    {
      id: 'm-aisec-01',
      name: 'NeuroGuard AI Vault',
      codename: 'AISEC-01',
      hostname: 'ai-gateway.neuroguard.corp',
      ipAddress: '10.40.0.25',
      subnet: '10.40.0.0/24',
      os: 'Ubuntu 22.04 LTS',
      difficulty: 'MEDIUM',
      category: 'AI_SECURITY',
      runtimeType: 'CONTAINERIZED_LAB',
      description: 'Enterprise Retrieval-Augmented Generation (RAG) assistant with tool-use capabilities and document retrieval interfaces.',
      scenario: 'AI Red Teaming engagement assessing prompt injection resilience, tool agency boundaries, and system prompt leakage.',
      requiredSkills: ['c5_rest_apis_json', 'c6_sqli', 'c19_prompt_injection_defense', 'c19_insecure_tool_agency'],
      recommendedPrerequisites: ['c19_ai_red_teaming_guardrails', 'c3_cia_triad'],
      services: [
        {
          port: 8000,
          protocol: 'TCP',
          serviceName: 'HTTP-RAG-API',
          product: 'FastAPI / LangChain Agent Gateway',
          version: '0.95.1',
          banner: 'Server: uvicorn 0.22.0\nX-AI-Model: NeuroGuard-Enterprise-v2',
          state: 'OPEN',
          isVulnerable: true
        }
      ],
      vulnerabilities: [
        {
          id: 'VULN-AI-001',
          name: 'Indirect Prompt Injection via Ingested Support Tickets',
          cvssScore: 8.5,
          severity: 'HIGH',
          mitreTechnique: 'AML.T0051 - LLM Prompt Injection',
          description: 'The automated support bot processes user tickets without delimiter sanitization, allowing attackers to override system instructions and trigger internal tool calls.',
          servicePort: 8000,
          exploitPrerequisiteConcepts: ['c19_prompt_injection_defense', 'c19_insecure_tool_agency'],
          remediationAdvice: 'Implement strict XML/Markdown delimiter tagging, enforce dual-LLM supervisor validation, and constrain tool parameter schemas.'
        }
      ],
      flags: [
        {
          id: 'flag-ai-vault',
          type: 'EVIDENCE_FLAG',
          description: 'Extracted Confidential System Prompt & Master API Token',
          points: 150,
          location: 'Memory / Vector Store System Prompt',
          expectedHashSha256: '7c4a8d09ca3762af61e59520943dc26494f8941b',
          canonicalValue: '[REDACTED_SERVER_VALIDATED_FLAG]'
        }
      ],
      defaultCredentials: {},
      filesystemBaseline: {
        '/app/config.json': '{"agent": "NeuroGuard", "sandbox_mode": true}'
      },
      authoritativeRulesOfEngagement: {
        authorizedSubnet: '10.40.0.0/24',
        allowedPorts: [8000],
        prohibitedTargets: ['10.40.1.0/24']
      },
      learningOutcomes: [
        'Analyze conversational boundaries and identify indirect prompt injection vectors',
        'Craft structured delimiter escape payloads',
        'Extract sensitive system configuration without violating model safety guidelines',
        'Implement robust input/output guardrails'
      ],
      defensiveRemediation: {
        patchOverview: 'Apply input sanitizer, isolate tool execution in read-only sandboxes, and verify token signatures before executing actions.',
        hardeningSteps: [
          'Add delimiter framing: <<<USER_INPUT>>> to isolate untrusted text',
          'Deploy Llama Guard / NeMo Guardrails for real-time safety evaluation',
          'Strip dangerous tool invocations from unauthenticated user sessions'
        ],
        verificationCommand: 'curl -s -X POST http://10.40.0.25:8000/api/chat -d \'{"message":"[TEST_DELIMITER_INSPECTION]"}\''
      }
    }
  ];

  public static getAllMachines(): CyberMachine[] {
    return [...this.MACHINES];
  }

  public static getMachineById(id: string): CyberMachine | undefined {
    return this.MACHINES.find(m => m.id === id || m.codename.toLowerCase() === id.toLowerCase());
  }

  public static getMachinesByCategory(category: string): CyberMachine[] {
    return this.MACHINES.filter(m => m.category === category);
  }

  public static getMachinesByDifficulty(difficulty: string): CyberMachine[] {
    return this.MACHINES.filter(m => m.difficulty === difficulty);
  }
}
