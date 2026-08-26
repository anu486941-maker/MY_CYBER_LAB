import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Search, 
  Hash, 
  Binary, 
  Globe, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  Sliders,
  Send,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Cpu,
  Zap,
  ArrowRight
} from 'lucide-react';
import { playTacticalSound } from '../../utils/audio';

export type ToolTab = 'port_scanner' | 'hash_decoder' | 'subnet_calc' | 'http_inspector' | 'packet_filter' | 'password_entropy';

interface PracticeToolsLabProps {
  initialTool?: ToolTab;
  onClose?: () => void;
  activeTargetIp?: string;
  className?: string;
}

export const PracticeToolsLab: React.FC<PracticeToolsLabProps> = ({
  initialTool = 'port_scanner',
  onClose,
  activeTargetIp,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<ToolTab>(initialTool);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playTacticalSound('beep');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  /* =========================================================================
     1. PORT SCANNER (NMAP SIMULATOR) STATE & LOGIC
     ========================================================================= */
  const [targetHost, setTargetHost] = useState<string>(activeTargetIp || '192.168.1.105');
  const [scanProfile, setScanProfile] = useState<'syn' | 'version' | 'fast' | 'all'>('syn');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [discoveredPorts, setDiscoveredPorts] = useState<Array<{
    port: number;
    protocol: 'tcp' | 'udp';
    state: 'open' | 'filtered' | 'closed';
    service: string;
    version: string;
    vulnRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>>([]);

  const predefinedTargets = [
    { label: 'Nightfall Cyber Range Target', ip: '192.168.1.105', os: 'Ubuntu 22.04 LTS' },
    { label: 'Default Gateway Router', ip: '192.168.1.1', os: 'Embedded Linux OpenWrt' },
    { label: 'Internal Corporate Web Server', ip: '10.0.0.50', os: 'Debian 11 (Apache/PHP)' },
    { label: 'Local Security Workstation (Self)', ip: '127.0.0.1', os: 'Kali Linux Rolling' }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setDiscoveredPorts([]);
    playTacticalSound('radar');

    const flagStr = scanProfile === 'syn' ? '-sS -T4' : scanProfile === 'version' ? '-sV -sC -T4' : scanProfile === 'fast' ? '-F -T5' : '-p- -T4';
    setScanLogs([
      `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleTimeString()} UTC`,
      `NSE: Loaded 155 scripts for scanning.`,
      `Initiating SYN Stealth Scan against ${targetHost} [65535 ports]`,
      `Command: nmap ${flagStr} ${targetHost}`
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step += 20;
      setScanProgress(step);
      playTacticalSound('type');

      if (step === 40) {
        setScanLogs(prev => [...prev, `Scanning ${targetHost} ... Discovered open port 22/tcp on ${targetHost}`]);
      }
      if (step === 60) {
        setScanLogs(prev => [...prev, `Scanning ${targetHost} ... Discovered open port 80/tcp on ${targetHost}`]);
      }
      if (step === 80) {
        setScanLogs(prev => [...prev, `Scanning ${targetHost} ... Discovered open port 3306/tcp on ${targetHost}`]);
      }

      if (step >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        playTacticalSound('success');

        const mockResults = [
          { port: 22, protocol: 'tcp' as const, state: 'open' as const, service: 'ssh', version: 'OpenSSH 8.9p1 Ubuntu (protocol 2.0)', vulnRisk: 'LOW' as const },
          { port: 80, protocol: 'tcp' as const, state: 'open' as const, service: 'http', version: 'Apache httpd 2.4.52 ((Ubuntu) mod_php)', vulnRisk: 'MEDIUM' as const },
          { port: 3306, protocol: 'tcp' as const, state: 'open' as const, service: 'mysql', version: 'MySQL Community Server 8.0.35', vulnRisk: 'HIGH' as const },
          { port: 8080, protocol: 'tcp' as const, state: 'filtered' as const, service: 'http-proxy', version: 'Squid Proxy / WAF Guard', vulnRisk: 'LOW' as const }
        ];
        setDiscoveredPorts(mockResults);
        setScanLogs(prev => [
          ...prev,
          `Completed SYN Stealth Scan in 1.42s (4 ports alive)`,
          `Nmap done: 1 IP address (1 host up) scanned.`
        ]);
      }
    }, 300);
  };

  /* =========================================================================
     2. CRYPTO & HASH CRACKER/DECODER STATE & LOGIC
     ========================================================================= */
  const [cryptoInput, setCryptoInput] = useState<string>('5f4dcc3b5aa765d61d8327deb882cf99'); // md5 of "password"
  const [cryptoMode, setCryptoMode] = useState<'identify' | 'base64' | 'hex' | 'rot13' | 'url'>('identify');
  const [detectedHashType, setDetectedHashType] = useState<string>('MD5 (128-bit Hex)');
  const [crackedPlaintext, setCrackedPlaintext] = useState<string | null>('password');
  const [isCracking, setIsCracking] = useState<boolean>(false);

  // Common rainbow lookup table for CTF simulation
  const rainbowTable: { [hash: string]: string } = {
    '5f4dcc3b5aa765d61d8327deb882cf99': 'password',
    '21232f297a57a5a743894a0e4a801fc3': 'admin',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918': 'admin123',
    'e99a18c428cb38d5f260853678922e03': 'root',
    'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f': 'cyberlab2026',
    'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3': '12345678'
  };

  const handleAnalyzeHash = () => {
    const raw = cryptoInput.trim();
    if (!raw) return;
    setIsCracking(true);
    playTacticalSound('radar');

    let identified = 'Unknown Hex/String';
    if (/^[a-fA-F0-9]{32}$/.test(raw)) identified = 'MD5 Hash (128-bit / 32 hex chars)';
    else if (/^[a-fA-F0-9]{40}$/.test(raw)) identified = 'SHA-1 Hash (160-bit / 40 hex chars)';
    else if (/^[a-fA-F0-9]{64}$/.test(raw)) identified = 'SHA-256 Hash (256-bit / 64 hex chars)';
    else if (/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(raw) && raw.length % 4 === 0) identified = 'Base64 Encoded Stream';
    
    setDetectedHashType(identified);

    setTimeout(() => {
      setIsCracking(false);
      const lower = raw.toLowerCase();
      if (rainbowTable[lower]) {
        setCrackedPlaintext(rainbowTable[lower]);
        playTacticalSound('success');
      } else {
        try {
          if (cryptoMode === 'base64') {
            setCrackedPlaintext(atob(raw));
          } else if (cryptoMode === 'hex') {
            const hexMatch = raw.replace(/\s+/g, '');
            let str = '';
            for (let i = 0; i < hexMatch.length; i += 2) {
              str += String.fromCharCode(parseInt(hexMatch.substr(i, 2), 16));
            }
            setCrackedPlaintext(str);
          } else if (cryptoMode === 'rot13') {
            setCrackedPlaintext(raw.replace(/[a-zA-Z]/g, (c) => {
              const base = c <= 'Z' ? 65 : 97;
              return String.fromCharCode(base + (c.charCodeAt(0) - base + 13) % 26);
            }));
          } else if (cryptoMode === 'url') {
            setCrackedPlaintext(decodeURIComponent(raw));
          } else {
            setCrackedPlaintext(`[Dictionary Miss: No collision found in rockyou.txt top 100k list for ${raw.slice(0, 8)}...]`);
          }
        } catch (e) {
          setCrackedPlaintext('Failed to decode / Invalid format syntax');
        }
      }
    }, 450);
  };

  /* =========================================================================
     3. SUBNET & CIDR CALCULATOR
     ========================================================================= */
  const [subnetIp, setSubnetIp] = useState<string>('192.168.1.105');
  const [cidrPrefix, setCidrPrefix] = useState<number>(24);

  const calculateSubnetDetails = (ip: string, prefix: number) => {
    const totalAddresses = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : totalAddresses - 2;

    const masks: { [prefix: number]: string } = {
      24: '255.255.255.0',
      25: '255.255.255.128',
      26: '255.255.255.192',
      27: '255.255.255.224',
      28: '255.255.255.240',
      29: '255.255.255.248',
      30: '255.255.255.252'
    };

    const maskStr = masks[prefix] || '255.255.255.0';
    const parts = ip.split('.').map(n => parseInt(n, 10) || 0);
    const baseOctet = parts.length === 4 ? parts.slice(0, 3).join('.') : '192.168.1';

    return {
      mask: maskStr,
      wildcard: `0.0.0.${255 - (parseInt(maskStr.split('.')[3], 10) || 0)}`,
      networkId: `${baseOctet}.0`,
      broadcastId: `${baseOctet}.${totalAddresses - 1}`,
      usableRange: `${baseOctet}.1 — ${baseOctet}.${totalAddresses - 2}`,
      usableHosts,
      totalAddresses,
      binaryMask: '1'.repeat(prefix) + '0'.repeat(32 - prefix)
    };
  };

  const subnetResult = calculateSubnetDetails(subnetIp, cidrPrefix);

  /* =========================================================================
     4. HTTP REQUEST & HEADER INSPECTOR
     ========================================================================= */
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [httpUrl, setHttpUrl] = useState<string>('http://192.168.1.105/api/v1/auth/verify');
  const [httpHeaders, setHttpHeaders] = useState<string>(
    'User-Agent: CyberLab-Recon-Toolkit/3.0\nAuthorization: Bearer c7f_token_x99a00\nContent-Type: application/json'
  );
  const [httpBody, setHttpBody] = useState<string>('{\n  "role": "admin",\n  "action": "elevate_privileges"\n}');
  const [httpResponse, setHttpResponse] = useState<{
    status: number;
    statusText: string;
    timeMs: number;
    headers: { [k: string]: string };
    body: string;
  } | null>({
    status: 200,
    statusText: 'OK',
    timeMs: 42,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Server': 'Apache/2.4.52 (Ubuntu)',
      'X-Powered-By': 'Express/4.18',
      'Set-Cookie': 'session_token=sec_984f4a3; HttpOnly; SameSite=Strict'
    },
    body: '{\n  "status": "success",\n  "authenticated": true,\n  "user": "sec_operator",\n  "clearance": "LEVEL-4-ROOT",\n  "token_flag": "FLAG{HTTP_HEADER_ANALYSIS_CLEARED}"\n}'
  });

  const handleSendHttpRequest = () => {
    playTacticalSound('click');
    const isPostAdmin = httpBody.includes('admin') || httpHeaders.includes('Bearer');
    setTimeout(() => {
      playTacticalSound('success');
      setHttpResponse({
        status: isPostAdmin ? 200 : 403,
        statusText: isPostAdmin ? 'OK' : 'Forbidden',
        timeMs: Math.floor(25 + Math.random() * 30),
        headers: {
          'Content-Type': 'application/json',
          'Server': 'CyberLab-Intranet-Gateway',
          'X-Security-Policy': 'Strict-Enforce',
          'X-Request-Id': `req-${Date.now().toString(36)}`
        },
        body: isPostAdmin
          ? JSON.stringify({
              authorized: true,
              directive: "COMMAND_DISPATCHED_TO_TARGET",
              target: httpUrl,
              code: "200_EXECUTION_SUCCESS"
            }, null, 2)
          : JSON.stringify({
              error: "Unauthorized access vector",
              code: 403,
              reason: "Invalid authentication header"
            }, null, 2)
      });
    }, 250);
  };

  /* =========================================================================
     5. PASSWORD ENTROPY & SECURITY ANALYZER
     ========================================================================= */
  const [pwdInput, setPwdInput] = useState<string>('CyberLab#2026!Sec');
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const calculateEntropy = (pwd: string) => {
    if (!pwd) return { bits: 0, crackTime: '0 seconds', strength: 'Zero' };
    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 32;

    const bits = Math.round(pwd.length * Math.log2(charsetSize || 1));
    let crackTime = 'Instant (< 1 ms)';
    let strength = 'Very Weak';

    if (bits >= 80) {
      crackTime = 'Centuries (10,000+ years)';
      strength = 'Military Grade (Uncrackable)';
    } else if (bits >= 60) {
      crackTime = 'Several Years';
      strength = 'Strong';
    } else if (bits >= 40) {
      crackTime = '3 to 14 Days';
      strength = 'Moderate';
    } else if (bits >= 25) {
      crackTime = 'Minutes to Hours';
      strength = 'Weak';
    }

    return { bits, crackTime, strength, charsetSize };
  };

  const entropyData = calculateEntropy(pwdInput);

  return (
    <div className={`rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col ${className}`}>
      
      {/* Header HUD */}
      <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                TACTICAL PRACTICE ARSENAL
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                ACTIVE LAB TOOLS
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Interactive cyber utilities to analyze, probe, and dissect protocols safely.
            </p>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto custom-scrollbar">
          {[
            { id: 'port_scanner', label: 'Port Scanner', icon: Radio },
            { id: 'hash_decoder', label: 'Hash & Crypto', icon: Hash },
            { id: 'subnet_calc', label: 'Subnet Calculator', icon: Binary },
            { id: 'http_inspector', label: 'HTTP Inspector', icon: Globe },
            { id: 'password_entropy', label: 'Password Entropy', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ToolTab);
                  playTacticalSound('click');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Toolkit Content Viewport */}
      <div className="p-5 overflow-y-auto space-y-6">
        
        {/* =========================================================
            TOOL 1: PORT SCANNER (NMAP SIMULATOR)
            ========================================================= */}
        {activeTab === 'port_scanner' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Scan Configuration Panel */}
              <div className="lg:col-span-1 p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    PROBE CONFIGURATION
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">NMAP SYN v7.94</span>
                </div>

                {/* Target Host Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">TARGET IP / HOSTNAME:</label>
                  <input
                    type="text"
                    value={targetHost}
                    onChange={(e) => setTargetHost(e.target.value)}
                    className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    placeholder="192.168.1.105"
                  />
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono text-slate-500">Quick Targets:</span>
                    <div className="grid grid-cols-1 gap-1">
                      {predefinedTargets.map(t => (
                        <button
                          key={t.ip}
                          onClick={() => {
                            setTargetHost(t.ip);
                            playTacticalSound('click');
                          }}
                          className={`text-left px-2 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer flex items-center justify-between ${
                            targetHost === t.ip ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{t.label}</span>
                          <span className="text-cyan-400/80 font-bold ml-1">{t.ip}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scan Profile Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">SCAN TECHNIQUE & SPEED:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'syn', label: 'SYN Stealth (-sS)', desc: 'Fast, half-open TCP' },
                      { id: 'version', label: 'Service Version (-sV)', desc: 'Banner inspection' },
                      { id: 'fast', label: 'Fast Top 100 (-F)', desc: 'Instant reconnaissance' },
                      { id: 'all', label: 'All Ports (-p-)', desc: 'Exhaustive 65535 ports' }
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setScanProfile(p.id as any)}
                        className={`p-2 rounded-lg text-left text-xs font-mono transition-all cursor-pointer ${
                          scanProfile === p.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-[11px]">{p.label}</div>
                        <div className="text-[9px] text-slate-500">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                  <Play className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'SCANNING NETWORK TARGET...' : 'EXECUTE NMAP SCAN'}</span>
                </button>
              </div>

              {/* Scan Telemetry & Results Terminal */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Live Terminal Stream */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs space-y-2 h-44 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-900 pb-1">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      LIVE NMAP OUTPUT STREAM
                    </span>
                    <span>{isScanning ? 'PROBE TRANSMITTING...' : 'IDLE'}</span>
                  </div>

                  {scanLogs.length === 0 ? (
                    <div className="text-slate-600 italic py-8 text-center">
                      Configure target and click "EXECUTE NMAP SCAN" to initiate live socket discovery.
                    </div>
                  ) : (
                    scanLogs.map((log, i) => (
                      <div key={i} className="text-slate-300 leading-relaxed font-mono">
                        <span className="text-cyan-400 mr-1.5">›</span>
                        {log}
                      </div>
                    ))
                  )}
                </div>

                {/* Discovered Ports Table */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-emerald-400" />
                      DISCOVERED OPEN PORTS & SERVICES ({discoveredPorts.length})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">HOST STATE: UP (0.0014s latency)</span>
                  </div>

                  {discoveredPorts.length === 0 ? (
                    <div className="text-xs font-mono text-slate-500 py-3 text-center">
                      No ports mapped yet. Run probe above to populate service banners.
                    </div>
                  ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="text-[10px] text-slate-500 border-b border-slate-800">
                            <th className="pb-2">PORT / PROTO</th>
                            <th className="pb-2">STATE</th>
                            <th className="pb-2">SERVICE</th>
                            <th className="pb-2">VERSION / BANNER</th>
                            <th className="pb-2 text-right">RISK LEVEL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {discoveredPorts.map((p) => (
                            <tr key={p.port} className="hover:bg-slate-900/80 transition-colors">
                              <td className="py-2.5 text-cyan-300 font-bold">{p.port}/{p.protocol}</td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  p.state === 'open' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400'
                                }`}>
                                  {p.state.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-2.5 text-slate-200">{p.service}</td>
                              <td className="py-2.5 text-slate-400 text-[11px] max-w-xs truncate">{p.version}</td>
                              <td className="py-2.5 text-right">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                  p.vulnRisk === 'HIGH' 
                                    ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                                    : p.vulnRisk === 'MEDIUM'
                                    ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                                    : 'bg-slate-900 text-slate-400'
                                }`}>
                                  {p.vulnRisk}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TOOL 2: HASH & CRYPTO DECODER / IDENTIFIER
            ========================================================= */}
        {activeTab === 'hash_decoder' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Input Form */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-purple-400" />
                    CIPHERTEXT / HASH INPUT STREAM
                  </span>
                  <span className="text-[10px] font-mono text-purple-400">ROCKYOU.TXT READY</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">ENTER RAW HASH OR ENCODED STRING:</label>
                  <textarea
                    rows={3}
                    value={cryptoInput}
                    onChange={(e) => setCryptoInput(e.target.value)}
                    className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                    placeholder="e.g. 5f4dcc3b5aa765d61d8327deb882cf99 or Q3liZXJMYWI="
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-mono text-slate-500 self-center">Presets:</span>
                  {[
                    { label: 'MD5 "password"', val: '5f4dcc3b5aa765d61d8327deb882cf99' },
                    { label: 'MD5 "admin"', val: '21232f297a57a5a743894a0e4a801fc3' },
                    { label: 'SHA256 "cyberlab2026"', val: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' },
                    { label: 'Base64 "Flag"', val: 'RkxBR3tFVEhJQ0FMX0hBQ0tJTkdfMjAyNn0=' }
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setCryptoInput(p.val)}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-[10px] font-mono text-slate-400 hover:text-purple-300 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAnalyzeHash}
                  disabled={isCracking}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
                >
                  <Sparkles className={`w-4 h-4 ${isCracking ? 'animate-spin' : ''}`} />
                  <span>{isCracking ? 'BRUTE LOOKUP IN PROGRESS...' : 'IDENTIFY & REVERSE CRACK'}</span>
                </button>
              </div>

              {/* Analysis & Cracked Output */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    DECRYPTION RECOVERY DOSSIER
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">HASHCAT COMPATIBLE</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="text-[10px] font-mono text-slate-500">IDENTIFIED ALGORITHM:</div>
                  <div className="text-xs font-mono font-bold text-purple-300 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    {detectedHashType}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                      RECOVERED PLAINTEXT STRING:
                    </span>
                    {crackedPlaintext && (
                      <button
                        onClick={() => copyToClipboard(crackedPlaintext, 'plaintext')}
                        className="text-[10px] font-mono text-slate-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'plaintext' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'plaintext' ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-100 bg-slate-900 p-2.5 rounded border border-slate-800 break-all select-all">
                    {crackedPlaintext || 'Awaiting hash submission...'}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold">💡 DEFENSIVE TAKEAWAY:</span> MD5 & SHA1 hashes are cryptographically broken due to collision vulnerabilities. Modern identity systems must use salted, iterated algorithms like Argon2id or Bcrypt.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================
            TOOL 3: SUBNET & CIDR CALCULATOR
            ========================================================= */}
        {activeTab === 'subnet_calc' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Controls */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Binary className="w-3.5 h-3.5 text-cyan-400" />
                    CIDR PREFIX TUNER
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">BASE IP ADDRESS:</label>
                  <input
                    type="text"
                    value={subnetIp}
                    onChange={(e) => setSubnetIp(e.target.value)}
                    className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">CIDR PREFIX:</span>
                    <span className="text-cyan-400 font-bold text-sm">/{cidrPrefix}</span>
                  </div>
                  <input
                    type="range"
                    min={24}
                    max={30}
                    value={cidrPrefix}
                    onChange={(e) => setCidrPrefix(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>/24 (254 Hosts)</span>
                    <span>/28 (14 Hosts)</span>
                    <span>/30 (2 Hosts)</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                  <div className="text-slate-400">Calculated Netmask:</div>
                  <div className="text-cyan-300 font-bold">{subnetResult.mask}</div>
                </div>
              </div>

              {/* Subnet Breakdown Matrix */}
              <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                    IP ADDRESSING & ROUTING ARCHITECTURE
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    {subnetResult.usableHosts} USABLE HOSTS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Network Identifier (ID):</span>
                    <div className="text-xs font-mono font-bold text-cyan-400">{subnetResult.networkId}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Broadcast Address:</span>
                    <div className="text-xs font-mono font-bold text-purple-400">{subnetResult.broadcastId}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Usable Host IP Range:</span>
                    <div className="text-xs font-mono font-bold text-emerald-400">{subnetResult.usableRange}</div>
                  </div>
                </div>

                {/* Binary Mask Visualizer */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">32-Bit Binary Bitmask Division:</div>
                  <div className="text-xs font-mono break-all tracking-widest font-bold">
                    <span className="text-cyan-400">{subnetResult.binaryMask.slice(0, cidrPrefix)}</span>
                    <span className="text-rose-400">{subnetResult.binaryMask.slice(cidrPrefix)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono pt-1">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Network Bits ({cidrPrefix})
                    </span>
                    <span className="flex items-center gap-1 text-rose-400">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      Host Bits ({32 - cidrPrefix})
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =========================================================
            TOOL 4: HTTP REQUEST & HEADER INSPECTOR
            ========================================================= */}
        {activeTab === 'http_inspector' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Request Builder */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    OUTBOUND HTTP PACKET CRAFTER
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">BURP SUITE SIMULATOR</span>
                </div>

                <div className="flex gap-2">
                  <select
                    value={httpMethod}
                    onChange={(e) => setHttpMethod(e.target.value as any)}
                    className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono font-bold text-cyan-400 focus:outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    value={httpUrl}
                    onChange={(e) => setHttpUrl(e.target.value)}
                    className="flex-1 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">REQUEST HEADERS:</label>
                  <textarea
                    rows={3}
                    value={httpHeaders}
                    onChange={(e) => setHttpHeaders(e.target.value)}
                    className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-200 focus:outline-none"
                  />
                </div>

                {httpMethod !== 'GET' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400">REQUEST BODY (JSON/PAYLOAD):</label>
                    <textarea
                      rows={3}
                      value={httpBody}
                      onChange={(e) => setHttpBody(e.target.value)}
                      className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-purple-200 focus:outline-none"
                    />
                  </div>
                )}

                <button
                  onClick={handleSendHttpRequest}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT HTTP REQUEST</span>
                </button>
              </div>

              {/* Response Inspector */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    SERVER HTTP RESPONSE
                  </span>
                  {httpResponse && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      httpResponse.status === 200 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {httpResponse.status} {httpResponse.statusText} ({httpResponse.timeMs}ms)
                    </span>
                  )}
                </div>

                {httpResponse ? (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase">Response Headers:</div>
                      {Object.entries(httpResponse.headers).map(([k, v]) => (
                        <div key={k} className="text-slate-400 text-[11px]">
                          <span className="text-cyan-400">{k}:</span> {v}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase">Response Body:</div>
                      <pre className="text-slate-200 text-xs overflow-x-auto p-2 bg-slate-900/90 rounded border border-slate-800/80 leading-relaxed custom-scrollbar">
                        {httpResponse.body}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-mono text-slate-500 text-center py-10">
                    No active response. Click "TRANSMIT HTTP REQUEST" above.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================
            TOOL 5: PASSWORD ENTROPY & SECURITY ANALYZER
            ========================================================= */}
        {activeTab === 'password_entropy' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    CREDENTIAL ENTROPY TESTBENCH
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400">TEST CREDENTIAL STRING:</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={pwdInput}
                      onChange={(e) => setPwdInput(e.target.value)}
                      className="w-full bg-slate-950 pl-3 pr-10 py-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-slate-500">Preset Common Vectors:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Weak: "password123"', val: 'password123' },
                      { label: 'Moderate: "Cyber2026"', val: 'Cyber2026' },
                      { label: 'Strong: "K4li!L1nux#99"', val: 'K4li!L1nux#99' },
                      { label: 'Military: "9x$Qz!29m@P#Lk91"', val: '9x$Qz!29m@P#Lk91' }
                    ].map(p => (
                      <button
                        key={p.label}
                        onClick={() => setPwdInput(p.val)}
                        className="p-2 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-[10px] font-mono text-slate-400 text-left cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Entropy Telemetry */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                    SECURITY SCORE & CRACK TIME
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">
                    {entropyData.bits} BITS OF ENTROPY
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">Estimated Brute-Force Time:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{entropyData.crackTime}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">Security Classification:</span>
                    <span className="text-xs font-mono font-bold text-purple-300">{entropyData.strength}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Entropy Rating Bar:</span>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          entropyData.bits >= 70
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : entropyData.bits >= 40
                            ? 'bg-gradient-to-r from-amber-500 to-cyan-400'
                            : 'bg-gradient-to-r from-rose-600 to-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (entropyData.bits / 80) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default PracticeToolsLab;
