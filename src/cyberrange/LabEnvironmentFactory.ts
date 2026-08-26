import { LabEnvironment, LabHostNode, LabTaskObjective, DefensiveRule } from './LabEnvironment';
import { PRACTICE_LABS_HUB_DATA, PracticeLab } from '../data/practiceLabsData';
import { REAL_WORLD_INCIDENTS, RealIncident } from '../data/realWorldIncidentsData';

// Generate a deterministic hash based on seed and string
function getSeededValue(seed: number, offset: number, items: string[]): string {
  const index = Math.abs(seed + offset) % items.length;
  return items[index];
}

export const LabEnvironmentFactory = {
  createEnvironment(labId: string, seed: number = 1337): LabEnvironment {
    const isIncident = labId.startsWith('inc-') || labId.startsWith('live-');
    
    // 1. Fetch source template
    let title = 'General Sandbox Lab';
    let category = 'NETWORK SECURITY';
    let difficulty: any = 'Intermediate';
    let objectiveText = 'Audit internal range assets.';
    let scenarioText = 'Standard isolated range network.';
    let baseHosts: any[] = [];
    let baseTasks: any[] = [];
    let baseHints: any[] = [];

    if (isIncident) {
      const inc = REAL_WORLD_INCIDENTS.find(i => i.id === labId) || REAL_WORLD_INCIDENTS[0];
      title = inc.name;
      category = inc.incidentType.toUpperCase();
      difficulty = inc.difficulty;
      objectiveText = inc.safeSimulation.remediationTask || inc.whatHappened;
      scenarioText = inc.safeSimulation.scenario || inc.whatHappened;
      baseHosts = [
        { id: 'web', label: inc.safeSimulation.targetHost, role: 'Public Ingress Proxy Web Node', icon: 'Server', dependencies: [] },
        { id: 'db', label: 'Database Node', role: 'Vulnerable Database Container', icon: 'Database', dependencies: ['web'] },
        { id: 'auth', label: 'Identity Vault', role: 'Private SSO Credential Storage', icon: 'Key', dependencies: ['db'] },
        { id: 'dc', label: 'Domain Controller', role: 'Active Directory Domain Controller', icon: 'Cpu', dependencies: ['auth'] }
      ];
      baseTasks = [
        {
          id: 't-1',
          description: inc.safeSimulation.investigationQuestions[0]?.question || 'Evaluate log files and identify breach indicators',
          verificationType: 'terminal',
          expectedValue: inc.safeSimulation.verificationCommand || 'whoami',
          mitreTechnique: inc.mitreMapping[0]?.techniqueId || 'T1046'
        }
      ];
      baseHints = [
        { level: 1, title: 'Recon Clue', text: 'Analyze public network interfaces using reconnaissance tools like nmap.', xpPenalty: 10 },
        { level: 2, title: 'Credential Clue', text: 'Look for leaked database connections, environment flags, or credentials.', xpPenalty: 25 }
      ];
    } else {
      const lab = PRACTICE_LABS_HUB_DATA.find(l => l.id === labId) || PRACTICE_LABS_HUB_DATA[0];
      title = lab.title;
      category = lab.category;
      difficulty = lab.difficulty;
      objectiveText = lab.objective;
      scenarioText = lab.scenario;
      baseHosts = [
        { id: 'web', label: lab.targetEnvironment.hostName, role: lab.targetEnvironment.services.join(', '), icon: 'Server', dependencies: [] },
        { id: 'db', label: 'Database Segment', role: 'Auxiliary Database host', icon: 'Database', dependencies: ['web'] },
        { id: 'auth', label: 'Auth Subsystem', role: 'Identity management services', icon: 'Key', dependencies: ['db'] }
      ];
      baseTasks = lab.tasks;
      baseHints = lab.hints;
    }

    // 2. Deterministic Seeding Mechanics
    const subnetOctet = (seed % 200) + 10;
    const targetSubnet = `10.10.${subnetOctet}`;
    const hostSuffixBase = (seed % 80) + 10;

    const hosts: LabHostNode[] = baseHosts.map((node, index) => {
      // First node status is DISCOVERED, others are UNKNOWN until attack sequence
      const status = index === 0 ? 'DISCOVERED' : 'UNKNOWN';
      return {
        id: node.id,
        label: node.label,
        ip: `${targetSubnet}.${hostSuffixBase + index * 15}`,
        status,
        icon: node.icon,
        role: node.role,
        dependencies: node.dependencies,
        os: node.id === 'dc' ? 'Windows Server 2022' : 'Ubuntu Linux 22.04 LTS'
      };
    });

    const targetAssets = hosts.map(h => h.label);

    const passwords = ['P@ssword9912', 'SecuredVault321!', 'AdminAccessTokens', 'KerberosTicket77'];
    const selectedPassword = getSeededValue(seed, 42, passwords);

    const simulatedCredentials: Record<string, string> = {
      'admin': selectedPassword,
      'postgres': `db_${selectedPassword.toLowerCase()}`,
      'domain_admin': `dc_root_${seed}`
    };

    const files = [
      `/var/www/html/server.js`,
      `/etc/passwd`,
      `/home/student/flag.txt`,
      `/opt/backups/db_hash_backup.sql`
    ];

    const processes = [
      'nginx: master process /usr/sbin/nginx',
      'node /var/www/html/server.js',
      'postgresql: 14-main database server',
      'systemd --user'
    ];

    const users = ['root', 'student', 'www-data', 'postgres', 'administrator'];

    const flagString = `MCL{FLAG_${seed}_${labId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}}`;

    const networkTopology = {
      subnet: `${targetSubnet}.0/24`,
      gateway: `${targetSubnet}.1`,
      firewallRules: [
        'ALLOW INBOUND TCP 80, 443 FROM EXTERNAL',
        'BLOCK INBOUND ANY TO DATABASE SEGMENT DIRECTLY',
        'ALLOW INTER-NODE SSH TCP 22'
      ]
    };

    const defensiveControls: Record<string, DefensiveRule> = {
      'ctrl-1': {
        id: 'ctrl-1',
        name: 'WAF SQLi Signature Filter',
        description: 'Blocks common SQL injection sequences like UNION, SELECT, and single quotes.',
        ruleType: 'WAF_FILTER',
        applied: false
      },
      'ctrl-2': {
        id: 'ctrl-2',
        name: 'SUID Privilege Hardening',
        description: 'Removes setuid permissions on interpreter binaries like python3 and bash.',
        ruleType: 'SUID_HARDENING',
        applied: false
      }
    };

    const objectives: LabTaskObjective[] = baseTasks.map((t, idx) => ({
      id: t.id,
      description: t.description,
      verificationType: t.verificationType,
      expectedValue: t.expectedValue,
      isCompleted: false,
      mitreTechnique: t.mitreTechnique
    }));

    const timeline = [
      {
        timestamp: new Date().toLocaleTimeString(),
        type: 'OPENED',
        title: 'Training Sandbox Allocated',
        description: `Cyber range instantiated dynamically under seed ${seed}. Ready for security audit.`,
        team: 'RED' as const
      }
    ];

    const startedTime = new Date().toISOString();

    return {
      labId,
      labType: isIncident ? 'REAL_INCIDENT' : 'PRACTICE_LAB',
      difficulty,
      targetOrganization: isIncident ? 'Financial Ecosystem Infrastructure' : 'Practice Sandbox Org',
      targetAssets,
      networkTopology,
      hosts,
      ports: [22, 80, 443, 5432, 8080],
      services: ['SSH', 'HTTP (Nginx)', 'HTTPS', 'PostgreSQL', 'HTTP-Proxy'],
      versions: ['OpenSSH 8.9p1', 'Nginx 1.22.0', 'Express 4.18.2', 'PostgreSQL 14.5'],
      simulatedCredentials,
      vulnerabilities: [
        'CWE-89: SQL Injection via API Customer Query Parameter',
        'CWE-269: Privilege Escalation via SUID Python Binary',
        'CWE-611: XML External Entity (XXE) Injection'
      ],
      files,
      processes,
      users,
      logs: [
        `[${startedTime.slice(0,10)} 08:00:00] SYSTEM-INIT: Node initialized at ${targetSubnet}.${hostSuffixBase}`,
        `[${startedTime.slice(0,10)} 08:01:10] DAEMON-START: Nginx listening on port 80/443`,
        `[${startedTime.slice(0,10)} 08:02:15] DB-LISTEN: PostgreSQL binding to secure internal port 5432`
      ],
      SIEMEvents: [],
      flags: [flagString],
      defensiveControls,
      discoveredAssets: [hosts[0].id],
      compromisedAssets: [],
      evidence: [],
      learnerActions: [],
      hypotheses: [],
      score: {
        recon: 10,
        investigation: 10,
        reasoning: 10,
        execution: 10,
        evidence: 10,
        totalScore: 50,
        grade: 'B'
      },
      currentStage: 1, // Briefing
      remediationStatus: 'UNPROTECTED',
      isCompleted: false,
      lastFailureInfo: null,
      mistakeCount: 0,
      noiseMeter: 0,
      objectives,
      hintsUsed: 0,
      timeline,
      replaySeed: seed,
      timestamps: {
        startedAt: startedTime,
        lastUpdated: startedTime
      }
    };
  }
};
