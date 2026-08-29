import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  ShieldAlert, 
  Eye, 
  Activity, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Bot, 
  Sparkles, 
  Radio, 
  Lock, 
  Layers, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SiemAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  event: string;
  mitreTactic: string;
  mitreId: string;
  sourceIp: string;
  targetPort: number;
  rawPayload: string;
}

export const DualLensSimulatorPage: React.FC = () => {
  const { profile, addXp } = useApp();
  const [commandInput, setCommandInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'MY CYBER LAB — Dual-Lens Attack & Defense Telemetry Arena v4.2',
    'Target IP: 192.168.1.100 (Enterprise Payment Gateway Mock)',
    'SIEM Telemetry Collector: ACTIVE & LISTENING on port 514',
    'Type "nmap", "sqlmap", "nikto", "hydra", or "cat /etc/passwd" to observe live defensive logs...'
  ]);
  const [siemAlerts, setSiemAlerts] = useState<SiemAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'MITRE' | 'AMAN_EXPLANATION'>('TELEMETRY');
  const [selectedAlert, setSelectedAlert] = useState<SiemAlert | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const siemEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  useEffect(() => {
    siemEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [siemAlerts]);

  const handleRunCommand = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun || commandInput).trim();
    if (!rawCmd) return;

    setCommandInput('');
    const time = new Date().toLocaleTimeString();

    // Append to terminal
    setTerminalLogs(prev => [...prev, `kali@mycyberlab:~$ ${rawCmd}`]);
    setIsSimulating(true);

    setTimeout(() => {
      let outputLines: string[] = [];
      let newAlert: SiemAlert | null = null;

      const lower = rawCmd.toLowerCase();

      if (lower.startsWith('nmap')) {
        outputLines = [
          'Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-29',
          'Nmap scan report for 192.168.1.100',
          'Host is up (0.00042s latency).',
          'PORT     STATE SERVICE    VERSION',
          '22/tcp   open  ssh        OpenSSH 8.9p1 Ubuntu',
          '80/tcp   open  http       Apache httpd 2.4.52',
          '3306/tcp open  mysql      MySQL 8.0.35',
          'Nmap done: 1 IP address scanned in 0.84 seconds'
        ];
        newAlert = {
          id: `alert-${Date.now()}`,
          timestamp: time,
          severity: 'HIGH',
          event: 'TCP Port Scan & Service Enumeration Detected',
          mitreTactic: 'Reconnaissance / Active Scanning',
          mitreId: 'T1595.002',
          sourceIp: '192.168.1.50 (Attacker Kali)',
          targetPort: 80,
          rawPayload: 'SYN-ACK probe sequence detected across ports [22, 80, 3306] within 400ms interval'
        };
      } else if (lower.startsWith('sqlmap')) {
        outputLines = [
          '[+] Testing connection to target URL...',
          '[!] Heuristic (basic) test shows GET parameter "id" might be vulnerable to SQL injection',
          '[+] Target is vulnerable! Injection type: UNION query-based',
          '[+] Fetching database schema: db_payment_gateway (3 tables found)',
          '[+] Retreived table: users [id, username, password_hash, credit_card]'
        ];
        newAlert = {
          id: `alert-${Date.now()}`,
          timestamp: time,
          severity: 'CRITICAL',
          event: 'SQL Injection Attack Sequence & Data Exfiltration Target',
          mitreTactic: 'Initial Access / Exploit Public-Facing Application',
          mitreId: 'T1190',
          sourceIp: '192.168.1.50 (Attacker Kali)',
          targetPort: 80,
          rawPayload: "GET /api/v1/user?id=1%20UNION%20SELECT%20null,username,password_hash%20FROM%20users--"
        };
      } else if (lower.startsWith('nikto')) {
        outputLines = [
          '- Nikto v2.5.0 target http://192.168.1.100',
          '+ Target IP: 192.168.1.100',
          '+ Server: Apache/2.4.52 (Ubuntu)',
          '+ OSVDB-3268: /admin/: Directory indexing enabled',
          '+ OSVDB-3092: /config.php.bak: Backup file containing DB credentials exposed'
        ];
        newAlert = {
          id: `alert-${Date.now()}`,
          timestamp: time,
          severity: 'HIGH',
          event: 'Web Server Vulnerability Scanner (Nikto User-Agent)',
          mitreTactic: 'Reconnaissance / Vulnerability Scanning',
          mitreId: 'T1595.002',
          sourceIp: '192.168.1.50 (Attacker Kali)',
          targetPort: 80,
          rawPayload: 'User-Agent: Mozilla/5.0 (Nikto/2.5.0) GET /config.php.bak HTTP/1.1'
        };
      } else if (lower.startsWith('hydra')) {
        outputLines = [
          '[DATA] attacking ssh://192.168.1.100:22/',
          '[22][ssh] host: 192.168.1.100   login: admin   password: password123',
          '[STATUS] 1 password found out of 500 attempts'
        ];
        newAlert = {
          id: `alert-${Date.now()}`,
          timestamp: time,
          severity: 'CRITICAL',
          event: 'SSH Brute-Force Password Spraying Triggered',
          mitreTactic: 'Credential Access / Brute Force',
          mitreId: 'T1110.001',
          sourceIp: '192.168.1.50 (Attacker Kali)',
          targetPort: 22,
          rawPayload: 'SSH Failed password for invalid user admin from 192.168.1.50 (500 failed attempts in 3s)'
        };
      } else if (lower.includes('/etc/passwd') || lower.includes('cat')) {
        outputLines = [
          'root:x:0:0:root:/root:/bin/bash',
          'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
          'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin',
          'admin:x:1000:1000:System Administrator,,,:/home/admin:/bin/bash'
        ];
        newAlert = {
          id: `alert-${Date.now()}`,
          timestamp: time,
          severity: 'MEDIUM',
          event: 'Local File Inclusion / Arbitrary File Read Detected',
          mitreTactic: 'Discovery / System Information Discovery',
          mitreId: 'T1082',
          sourceIp: '192.168.1.50 (Attacker Kali)',
          targetPort: 80,
          rawPayload: 'GET /download.php?file=../../../../etc/passwd HTTP/1.1 (Path Traversal pattern matched)'
        };
      } else {
        outputLines = [
          `Executing simulated utility: ${rawCmd}`,
          'Operation completed successfully in isolated sandbox environment.'
        ];
        newAlert = {
          id: `alert-${Date.now()}`,
          timestamp: time,
          severity: 'LOW',
          event: 'Generic Sandbox Command Telemetry',
          mitreTactic: 'Execution / Command & Scripting Interpreter',
          mitreId: 'T1059',
          sourceIp: '192.168.1.50 (Attacker Kali)',
          targetPort: 80,
          rawPayload: `Shell command invocation logged: "${rawCmd}"`
        };
      }

      setTerminalLogs(prev => [...prev, ...outputLines]);
      if (newAlert) {
        setSiemAlerts(prev => [newAlert!, ...prev]);
        setSelectedAlert(newAlert);
      }
      setIsSimulating(false);
      addXp(15, 'Dual-Lens Telemetry Analysis');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fadeIn text-slate-100">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                INDUSTRY FIRST: DUAL-LENS CYBER BATTLEGROUND
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                ATTACKER CLI + DEFENDER SIEM SIDE-BY-SIDE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Live Attack & Defense Telemetry Simulator
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Unlike TryHackMe or Hack The Box where you only see one side of the battlefield, MY CYBER LAB streams your offensive terminal exploits directly into a real-time SOC SIEM log collector.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400">Quick Scenarios:</span>
            {['nmap -sV', 'sqlmap', 'nikto', 'hydra'].map(btnCmd => (
              <button
                key={btnCmd}
                onClick={() => handleRunCommand(btnCmd)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-slate-700 transition-all cursor-pointer"
              >
                {btnCmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SPLIT-SCREEN BATTLEFIELD CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANE: KALI OFFENSIVE TERMINAL */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[520px]">
          {/* TERMINAL HEADER */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 ml-2 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                OFFENSIVE KALI TERMINAL (Attacker Lens)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              SAFE SANDBOX
            </span>
          </div>

          {/* TERMINAL LOGS BODY */}
          <div className="p-4 font-mono text-xs space-y-2 overflow-y-auto flex-1 bg-slate-950 text-slate-200">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('kali@') ? 'text-cyan-400 font-bold mt-2' : 'text-slate-300'}>
                {log}
              </div>
            ))}
            {isSimulating && (
              <div className="text-amber-400 animate-pulse flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Executing command & generating SIEM telemetry packet...
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* TERMINAL INPUT FORM */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleRunCommand(); }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <span className="text-cyan-400 font-mono text-xs font-bold">kali@mycyberlab:~$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Type nmap, sqlmap, nikto, hydra..."
              className="flex-1 bg-transparent text-xs font-mono text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSimulating}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Play className="w-3.5 h-3.5" /> RUN
            </button>
          </form>
        </div>

        {/* RIGHT PANE: DEFENSIVE SIEM TELEMETRY COLLECTOR */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[520px]">
          {/* SIEM HEADER */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono font-bold text-white">
                SOC SIEM ALERT STREAM (Defender Lens)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
              SURICATA IDS ACTIVE
            </span>
          </div>

          {/* SIEM ALERTS BODY */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-slate-900/40">
            {siemAlerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                <Activity className="w-8 h-8 text-slate-600 animate-pulse" />
                <p className="text-xs font-mono">No telemetry events captured yet.</p>
                <p className="text-[11px] text-slate-400">Run an offensive command in the Kali terminal to trigger real-time SIEM alerts.</p>
              </div>
            ) : (
              siemAlerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    selectedAlert?.id === alert.id
                      ? 'bg-purple-950/40 border-purple-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      alert.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}>
                      [{alert.severity}] {alert.mitreId}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white">{alert.event}</h4>
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 truncate">
                    {alert.rawPayload}
                  </div>
                </div>
              ))
            )}
            <div ref={siemEndRef} />
          </div>
        </div>
      </div>

      {/* AMAN AI SOCRATIC TELEMETRY BREAKDOWN */}
      {selectedAlert && (
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              AMAN AI Socratic Telemetry Breakdown
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              MITRE ATT&CK Mapping: {selectedAlert.mitreId} ({selectedAlert.mitreTactic})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-rose-400 font-bold block">Attacker Viewpoint (Offensive Execution)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                You dispatched <code className="text-cyan-400 font-mono">{selectedAlert.event}</code>. The payload crafted packets sent to port {selectedAlert.targetPort} on the target system.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 font-bold block">Defender Viewpoint (SOC Telemetry)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                The SOC SIEM rule flagged this event as <strong className="text-white">{selectedAlert.severity}</strong> severity because it matched signature: <code className="text-purple-300 font-mono">{selectedAlert.rawPayload}</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
