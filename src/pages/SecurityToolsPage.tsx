import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SECURITY_TOOLS_ACADEMY, LINUX_NATIVE_TOOLS, SecurityTool } from '../data/securityToolAcademyData';
import {
  Wrench,
  Terminal,
  Activity,
  Layers,
  Globe,
  Search,
  Code,
  Shield,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
  Send,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

export const SecurityToolsPage: React.FC = () => {
  const { addXp, completedMissions, completeMission, addNotebookNote } = useApp();
  const [selectedToolId, setSelectedToolId] = useState<string>('nmap');
  const [activeTab, setActiveTab] = useState<'academy' | 'sandbox' | 'missions' | 'case_study' | 'linux_native'>('academy');

  // Nmap Sandbox State
  const [nmapTarget, setNmapTarget] = useState<string>('10.10.10.5');
  const [nmapFlags, setNmapFlags] = useState<string>('-sV -sC -p 22,80,443,3306');
  const [nmapOutput, setNmapOutput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Wireshark Sandbox State
  const [selectedPcap, setSelectedPcap] = useState<'http_auth' | 'tcp_handshake' | 'dns_exfil'>('http_auth');
  const [displayFilter, setDisplayFilter] = useState<string>('http.request.method == "POST"');
  const [streamFollowed, setStreamFollowed] = useState<boolean>(false);

  // Burp Suite Repeater State
  const [burpMethod, setBurpMethod] = useState<string>('POST');
  const [burpPath, setBurpPath] = useState<string>('/api/v1/auth/login');
  const [burpHeaders, setBurpHeaders] = useState<string>('Host: target.internal\nContent-Type: application/json\nUser-Agent: Mozilla/5.0');
  const [burpBody, setBurpBody] = useState<string>('{\n  "username": "admin\' OR \'1\'=\'1",\n  "password": "password"\n}');
  const [burpResponse, setBurpResponse] = useState<string>('');

  // Netcat / curl State
  const [ncHost, setNcHost] = useState<string>('10.10.10.5');
  const [ncPort, setNcPort] = useState<string>('80');
  const [ncPayload, setNcPayload] = useState<string>('HEAD / HTTP/1.1\r\nHost: 10.10.10.5\r\n\r\n');
  const [ncOutput, setNcOutput] = useState<string>('');

  // Practical Lab verification
  const [labCommandInput, setLabCommandInput] = useState<string>('');
  const [labResultOutput, setLabResultOutput] = useState<string>('');
  const [labCompleted, setLabCompleted] = useState<boolean>(false);

  const currentTool = SECURITY_TOOLS_ACADEMY.find(t => t.id === selectedToolId) || SECURITY_TOOLS_ACADEMY[0];

  // Run Nmap Scan in Sandbox
  const handleRunNmap = () => {
    setIsScanning(true);
    setNmapOutput(`Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-21 12:00:00 UTC\nInitiating SYN Stealth Scan against ${nmapTarget}...\nScanning ports with flags: ${nmapFlags}...`);

    setTimeout(() => {
      let result = `Nmap scan report for target.kobayashi.internal (${nmapTarget})\nHost is up (0.00042s latency).\n\nPORT     STATE SERVICE VERSION\n`;
      if (nmapFlags.includes('22')) {
        result += `22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)\n| ssh-hostkey:\n|_  256 ed:4a:23:90:55:12:bc (ED25519)\n`;
      }
      if (nmapFlags.includes('80')) {
        result += `80/tcp   open  http    Apache httpd 2.4.52 ((Ubuntu))\n|_http-title: Kobayashi Corp Portal - v1.4\n|_http-server-header: Apache/2.4.52 (Ubuntu)\n`;
      }
      if (nmapFlags.includes('443')) {
        result += `443/tcp  open  ssl/http Apache httpd 2.4.52 ((Ubuntu))\n| ssl-cert: Subject: commonName=*.kobayashi.internal\n|_ssl-date: TLS randomness does not represent time\n`;
      }
      if (nmapFlags.includes('3306')) {
        result += `3306/tcp open  mysql   MySQL 8.0.32-0ubuntu0.22.04.2\n| mysql-info:\n|   Protocol: 10\n|   Version: 8.0.32\n|_  Auth Plugin: caching_sha2_password\n`;
      }
      if (nmapFlags.includes('9001') || nmapFlags.includes('-p-')) {
        result += `9001/tcp open  unreal  UnrealIRCd 3.2.8.1 (Deprecated/Insecure)\n|_irc-info: Rogue debug daemon found!\n`;
      }
      result += `\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\nNmap done: 1 IP address (1 host up) scanned in 1.48 seconds`;
      setNmapOutput(result);
      setIsScanning(false);
      addXp(25);
    }, 800);
  };

  // Run Burp Suite Repeater
  const handleSendBurp = () => {
    setBurpResponse('HTTP/1.1 200 OK\nDate: Fri, 21 Aug 2026 12:00:00 GMT\nServer: Apache/2.4.52\nContent-Type: application/json\n\n{\n  "status": "success",\n  "authenticated": true,\n  "role": "ADMINISTRATOR",\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "message": "Welcome back, System Admin!"\n}');
    addXp(25);
  };

  // Run Netcat
  const handleRunNc = () => {
    setNcOutput(`Connecting to ${ncHost} on port ${ncPort}...\nConnected to ${ncHost}.\nHTTP/1.1 200 OK\nDate: Fri, 21 Aug 2026 12:00:00 GMT\nServer: Apache/2.4.52 (Ubuntu)\nContent-Type: text/html; charset=UTF-8\nConnection: close\n\n[Connection closed by foreign host]`);
    addXp(25);
  };

  // Execute Lab Verification
  const handleRunLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labCommandInput.trim()) return;

    if (labCommandInput.trim().toLowerCase().includes(currentTool.id) || labCommandInput.trim().length > 5) {
      setLabResultOutput(currentTool.practicalLab.verificationOutput);
      setLabCompleted(true);
      addXp(100);
      completeMission(`tool-lab-${currentTool.id}`);
      addNotebookNote(
        `Security Tool Lab: ${currentTool.name}`,
        `Command Executed: ${labCommandInput}\nVerification Output:\n${currentTool.practicalLab.verificationOutput}`,
        'Tools'
      );
    } else {
      setLabResultOutput(`Command executed but did not match the expected objective. Hint: ${currentTool.practicalLab.hint}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-md font-semibold">
                🛠️ SECURITY TOOL ACADEMY
              </span>
              <span className="text-xs text-slate-400 font-mono">
                PRACTICAL MASTERY • CONCEPT TO DEFENSE
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Cybersecurity Tools Academy
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1 max-w-3xl">
              Master essential ethical hacking and defensive tools through hands-on missions, raw output interpretation,
              decision-making, and defender detection mechanics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('linux_native')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                activeTab === 'linux_native'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              🐧 Linux Native Utilities (Level 1)
            </button>
          </div>
        </div>

        {/* Methodology Pathway Bar */}
        <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between overflow-x-auto text-[11px] font-mono text-slate-400 gap-2">
          <span className="text-cyan-400 font-bold whitespace-nowrap">METHODOLOGY:</span>
          {['CONCEPT', 'TOOL', 'COMMAND', 'OUTPUT', 'INTERPRETATION', 'INVESTIGATION', 'DECISION', 'LAB', 'CASE', 'DEFENSE'].map((step, idx) => (
            <React.Fragment key={step}>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 whitespace-nowrap">{step}</span>
              {idx < 9 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tool Selector Grid */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SECURITY_TOOLS_ACADEMY.map(tool => {
          const isSel = tool.id === selectedToolId && activeTab !== 'linux_native';
          return (
            <button
              key={tool.id}
              onClick={() => {
                setSelectedToolId(tool.id);
                if (activeTab === 'linux_native') setActiveTab('academy');
                setLabCompleted(false);
                setLabResultOutput('');
                setLabCommandInput('');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSel
                  ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400">{tool.badge}</span>
              </div>
              <div className="text-xs font-bold text-slate-200 line-clamp-1">{tool.name}</div>
              <div className="text-[10px] text-slate-500 mt-1">{tool.category}</div>
            </button>
          );
        })}
      </div>

      {/* Linux Native Utilities Mode */}
      {activeTab === 'linux_native' ? (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              🐧 Level 1: Linux Native Security Utilities
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Before running external security scanners, security analysts use native Linux operating system binaries to inspect interfaces, sockets, processes, and text streams.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LINUX_NATIVE_TOOLS.map((t, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-cyan-400">{t.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">{t.category}</span>
                  </div>
                  <p className="text-xs text-slate-300">{t.purpose}</p>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-mono block mb-1">Example Command:</span>
                    <code className="text-xs text-emerald-400 font-mono bg-slate-900 px-2 py-1 rounded block">
                      {t.example}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Security Tool Academy View */
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tool Profile Banner */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                  {currentTool.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">CATEGORY: {currentTool.category}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">{currentTool.name}</h2>
              <p className="text-slate-300 text-sm italic">{currentTool.tagline}</p>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center gap-2 border-t border-slate-800/80 pt-4 mt-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('academy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'academy' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> 1. Deep Dive Academy
                </button>

                <button
                  onClick={() => setActiveTab('sandbox')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'sandbox' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" /> 2. Interactive Sandbox
                </button>

                <button
                  onClick={() => setActiveTab('missions')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'missions' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> 3. Structured Missions ({currentTool.missions.length})
                </button>

                <button
                  onClick={() => setActiveTab('case_study')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'case_study' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" /> 4. Real-World Case Study
                </button>
              </div>
            </div>

            {/* TAB: ACADEMY (WHAT, WHY, WHEN, OUTPUT, DEFENSE) */}
            {activeTab === 'academy' && (
              <div className="space-y-6">
                {/* 3 Core Questions: What, Why, When */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">WHAT IS IT?</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{currentTool.whatIsIt}</p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">WHY IS IT USED?</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{currentTool.whyIsItUsed}</p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">WHEN SHOULD I USE IT?</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{currentTool.whenShouldIUseIt}</p>
                  </div>
                </div>

                {/* Common Commands & Output Interpretation */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-4 h-4 text-cyan-400" /> Command Syntax & Output Interpretation
                  </h4>

                  <div className="space-y-4">
                    {currentTool.commonCommands.map((cmd, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div>
                          <code className="text-xs font-mono text-cyan-400 bg-slate-900 px-2.5 py-1 rounded block mb-1">
                            {cmd.command}
                          </code>
                          <p className="text-xs text-slate-400">{cmd.description}</p>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Sample Output:</span>
                          <pre className="bg-slate-900/90 p-3 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                            {cmd.sampleOutput}
                          </pre>
                        </div>

                        <div className="pl-3 border-l-2 border-emerald-500 text-xs text-emerald-300/90">
                          <strong>Output Meaning:</strong> {cmd.interpretation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What to look for & What can go wrong */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> What Should I Look For?
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {currentTool.whatToLookFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-mono">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> What Can Go Wrong?
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {currentTool.whatCanGoWrong.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 font-mono">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Defender Detection Mechanics */}
                <div className="bg-slate-900/60 border border-red-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> How Can a Defender Detect It?
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{currentTool.howDefendersDetectIt}</p>
                </div>
              </div>
            )}

            {/* TAB: INTERACTIVE SANDBOX */}
            {activeTab === 'sandbox' && (
              <div className="space-y-6">
                {currentTool.id === 'nmap' && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" /> Nmap Live Interactive Sandbox
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Target Host / IP:</label>
                        <input
                          type="text"
                          value={nmapTarget}
                          onChange={e => setNmapTarget(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Flags & Options:</label>
                        <input
                          type="text"
                          value={nmapFlags}
                          onChange={e => setNmapFlags(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleRunNmap}
                        disabled={isScanning}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5" /> {isScanning ? 'Scanning...' : 'Execute Nmap Scan'}
                      </button>
                    </div>

                    <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto min-h-[220px]">
                      {nmapOutput || '// Click "Execute Nmap Scan" to start network discovery.'}
                    </pre>
                  </div>
                )}

                {currentTool.id === 'wireshark' && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" /> Wireshark PCAP Packet Dissector
                    </h4>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={displayFilter}
                        onChange={e => setDisplayFilter(e.target.value)}
                        placeholder="Apply display filter (e.g. http.request.method == 'POST')..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                      />
                      <button
                        onClick={() => setStreamFollowed(!streamFollowed)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 rounded-lg"
                      >
                        {streamFollowed ? 'Show Packets' : 'Follow TCP Stream'}
                      </button>
                    </div>

                    {!streamFollowed ? (
                      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-[11px] font-mono">
                        <table className="w-full text-left">
                          <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="p-2">No.</th>
                              <th className="p-2">Time</th>
                              <th className="p-2">Source</th>
                              <th className="p-2">Destination</th>
                              <th className="p-2">Protocol</th>
                              <th className="p-2">Info</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 text-slate-300">
                            <tr className="hover:bg-slate-900/50">
                              <td className="p-2 text-cyan-400">1</td>
                              <td className="p-2">0.000</td>
                              <td className="p-2">10.10.10.45</td>
                              <td className="p-2">10.10.10.5</td>
                              <td className="p-2 text-blue-400">TCP</td>
                              <td className="p-2">50412 → 80 [SYN]</td>
                            </tr>
                            <tr className="hover:bg-slate-900/50">
                              <td className="p-2 text-cyan-400">2</td>
                              <td className="p-2">0.001</td>
                              <td className="p-2">10.10.10.5</td>
                              <td className="p-2">10.10.10.45</td>
                              <td className="p-2 text-blue-400">TCP</td>
                              <td className="p-2">80 → 50412 [SYN, ACK]</td>
                            </tr>
                            <tr className="hover:bg-slate-900/50 bg-cyan-950/20">
                              <td className="p-2 text-cyan-400">3</td>
                              <td className="p-2">0.003</td>
                              <td className="p-2">10.10.10.45</td>
                              <td className="p-2">10.10.10.5</td>
                              <td className="p-2 text-emerald-400">HTTP</td>
                              <td className="p-2">POST /api/v1/auth/login HTTP/1.1</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
                        {`POST /api/v1/auth/login HTTP/1.1\nHost: target.internal\nContent-Type: application/x-www-form-urlencoded\nContent-Length: 35\n\nusername=admin&password=FLAG{WIRESHARK_STREAM_UNMASKED_8812}`}
                      </pre>
                    )}
                  </div>
                )}

                {currentTool.id === 'burp-suite' && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" /> Burp Suite Repeater
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Request Pane */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Request Editor</span>
                          <button
                            onClick={handleSendBurp}
                            className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded text-xs"
                          >
                            Send Request (Ctrl+Space)
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={burpMethod}
                            onChange={e => setBurpMethod(e.target.value)}
                            className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-cyan-400"
                          />
                          <input
                            type="text"
                            value={burpPath}
                            onChange={e => setBurpPath(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200"
                          />
                        </div>
                        <textarea
                          rows={3}
                          value={burpHeaders}
                          onChange={e => setBurpHeaders(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-slate-300"
                        />
                        <textarea
                          rows={4}
                          value={burpBody}
                          onChange={e => setBurpBody(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-amber-300"
                        />
                      </div>

                      {/* Response Pane */}
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Response Inspector</div>
                        <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono text-emerald-400 h-[220px] overflow-y-auto whitespace-pre-wrap">
                          {burpResponse || '// Click Send Request to inspect server response headers and body.'}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {currentTool.id === 'netcat' && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" /> Netcat Raw Socket Terminal
                    </h4>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ncHost}
                        onChange={e => setNcHost(e.target.value)}
                        placeholder="Host"
                        className="w-40 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-200"
                      />
                      <input
                        type="text"
                        value={ncPort}
                        onChange={e => setNcPort(e.target.value)}
                        placeholder="Port"
                        className="w-24 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-200"
                      />
                      <button
                        onClick={handleRunNc}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded"
                      >
                        Connect
                      </button>
                    </div>

                    <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 min-h-[160px]">
                      {ncOutput || '// Ready to connect.'}
                    </pre>
                  </div>
                )}

                {currentTool.id === 'dig-dns' && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Search className="w-4 h-4 text-cyan-400" /> Dig DNS Query Console
                    </h4>
                    <p className="text-xs text-slate-400">Query apexcorp.internal records directly.</p>
                    <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300">
                      {`$ dig @10.10.10.2 apexcorp.internal ANY\n\n;; ANSWER SECTION:\napexcorp.internal.  300 IN A     10.10.10.88\napexcorp.internal.  300 IN MX    10 mail.apexcorp.internal.\napexcorp.internal.  300 IN TXT   "v=spf1 include:_spf.google.com ~all"\napexcorp.internal.  300 IN TXT   "FLAG{DIG_DNS_RECORDS_VERIFIED_7712}"`}
                    </pre>
                  </div>
                )}

                {currentTool.id === 'curl-cmd' && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Code className="w-4 h-4 text-cyan-400" /> cURL HTTP Inspector
                    </h4>
                    <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400">
                      {`$ curl -i http://10.10.10.5/api/health\n\nHTTP/1.1 200 OK\nDate: Fri, 21 Aug 2026 12:00:00 GMT\nServer: Apache/2.4.52 (Ubuntu)\nX-Debug-Token: FLAG{CURL_HEADER_INSPECTION_OK_1044}\nContent-Type: application/json\n\n{"status": "healthy", "uptime": 98412}`}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* TAB: STRUCTURED MISSIONS */}
            {activeTab === 'missions' && (
              <div className="space-y-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    Structured Training Progression ({currentTool.missions.length} Missions)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Complete each tool mission in sequence to advance your practical score and earn cybersecurity XP.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentTool.missions.map(m => {
                    const isDone = (completedMissions || []).includes(m.id);
                    return (
                      <div
                        key={m.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-slate-900/80 border-emerald-500/40'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-cyan-400">{m.code}</span>
                          <span className="text-xs font-mono text-emerald-400">+{m.xp} XP</span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-200 mb-1">{m.title}</h5>
                        <p className="text-xs text-slate-400 mb-3">{m.objective}</p>
                        <code className="text-[11px] font-mono text-slate-300 bg-slate-950 px-2 py-1 rounded block">
                          {m.challengeSnippet}
                        </code>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => {
                              if (!isDone) {
                                completeMission(m.id);
                                addXp(m.xp);
                              }
                            }}
                            className={`text-xs px-3 py-1 rounded font-semibold transition-all ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
                            }`}
                          >
                            {isDone ? 'Completed ✓' : 'Complete Mission'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: CASE STUDY */}
            {activeTab === 'case_study' && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                  <FileCode className="w-4 h-4" /> Educational Real-World Incident Case Study
                </div>
                <h3 className="text-xl font-bold text-white">{currentTool.caseStudy.title}</h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-200 block mb-1">Scenario:</strong>
                  {currentTool.caseStudy.scenario}
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
                  <strong className="text-emerald-400 block mb-1">Defensive Takeaway:</strong>
                  {currentTool.caseStudy.lesson}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Practical Lab Verification */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono">PRACTICAL LAB CHALLENGE</span>
                <span className="text-xs font-mono text-emerald-400">+100 XP</span>
              </div>

              <h3 className="text-base font-bold text-white">{currentTool.practicalLab.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{currentTool.practicalLab.task}</p>

              <form onSubmit={handleRunLab} className="space-y-2">
                <label className="text-[10px] font-mono text-slate-400 block">Command Input:</label>
                <input
                  type="text"
                  value={labCommandInput}
                  onChange={e => setLabCommandInput(e.target.value)}
                  placeholder={`E.g. ${currentTool.practicalLab.expectedCommand}...`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                >
                  Verify Lab Command
                </button>
              </form>

              {labResultOutput && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Terminal Output:</span>
                  <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                    {labResultOutput}
                  </pre>
                  {labCompleted && (
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                      Lab Completed & Verified! ✓
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
