import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Crosshair, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldAlert, 
  Terminal, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Radio,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Check,
  Send,
  Cpu,
  Layers,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { MissionProgressTracker } from './MissionProgressTracker';
import { PracticeToolsLab, ToolTab } from './PracticeToolsLab';
import { playTacticalSound, toggleSound, isSoundEnabled } from '../../utils/audio';

export const MissionModal: React.FC = () => {
  const { selectedMission, setSelectedMission, toggleMissionObjective, completeMission, addXp } = useApp();
  const navigate = useNavigate();

  const [activeModalTab, setActiveModalTab] = useState<'briefing' | 'toolkit' | 'terminal'>('briefing');
  const [toolkitInitialTab, setToolkitInitialTab] = useState<ToolTab>('port_scanner');
  const [audioMuted, setAudioMuted] = useState<boolean>(!isSoundEnabled());
  const [isPlayingComm, setIsPlayingComm] = useState<boolean>(false);
  const [justClaimed, setJustClaimed] = useState<boolean>(false);

  // Embedded Mini-Terminal State
  const [termInput, setTermInput] = useState<string>('');
  const [termHistory, setTermHistory] = useState<Array<{ cmd: string; out: string; success?: boolean }>>([
    { 
      cmd: 'init_tactical_sandbox', 
      out: 'Connected to safe sandbox container [cyberlab-node-01]. All actions logged for mission telemetry.' 
    }
  ]);

  if (!selectedMission) return null;

  const allCompleted = selectedMission.objectives.every(o => o.completed);
  const completedCount = selectedMission.objectives.filter(o => o.completed).length;

  const handleToggleSound = () => {
    const nextState = toggleSound();
    setAudioMuted(!nextState);
    if (nextState) playTacticalSound('click');
  };

  const handleClaim = () => {
    playTacticalSound('success');
    setJustClaimed(true);
    completeMission(selectedMission.id);
    setTimeout(() => {
      setJustClaimed(false);
    }, 2500);
  };

  const handlePlayTransmission = () => {
    setIsPlayingComm(true);
    playTacticalSound('radar');
    setTimeout(() => {
      setIsPlayingComm(false);
    }, 3000);
  };

  const handleOpenLinuxLab = () => {
    playTacticalSound('click');
    setSelectedMission(null);
    navigate('/linux-lab');
  };

  const handleOpenCyberRange = () => {
    playTacticalSound('click');
    setSelectedMission(null);
    navigate('/cyber-range');
  };

  // Run command in embedded modal terminal with objective detection
  const handleRunTermCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = termInput.trim();
    if (!cmd) return;

    playTacticalSound('type');
    setTermInput('');

    let output = `bash: ${cmd}: command executed in simulated workspace`;
    let isSuccess = true;

    const lower = cmd.toLowerCase();
    if (lower === 'whoami') {
      output = 'student (UID: 1000, GID: 1000 - Group: cyber-operators)';
      // Auto complete objective 1 if mission 1
      const obj = selectedMission.objectives.find(o => o.title.toLowerCase().includes('user') || o.title.toLowerCase().includes('whoami'));
      if (obj && !obj.completed) toggleMissionObjective(selectedMission.id, obj.id);
    } else if (lower === 'hostname') {
      output = 'cyberlab-workstation-kali';
      const obj = selectedMission.objectives.find(o => o.title.toLowerCase().includes('hostname'));
      if (obj && !obj.completed) toggleMissionObjective(selectedMission.id, obj.id);
    } else if (lower.startsWith('uname')) {
      output = 'Linux cyberlab 6.5.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
      const obj = selectedMission.objectives.find(o => o.title.toLowerCase().includes('kernel') || o.title.toLowerCase().includes('uname'));
      if (obj && !obj.completed) toggleMissionObjective(selectedMission.id, obj.id);
    } else if (lower === 'pwd') {
      output = '/home/student/workspace/operations';
      const obj = selectedMission.objectives.find(o => o.title.toLowerCase().includes('path') || o.title.toLowerCase().includes('pwd'));
      if (obj && !obj.completed) toggleMissionObjective(selectedMission.id, obj.id);
    } else if (lower.startsWith('ls')) {
      output = 'drwxr-xr-x 2 student student 4096 Aug 21 03:00 .\ndrwxr-xr-x 4 student student 4096 Aug 21 02:45 ..\n-rw-r--r-- 1 root    root     512 Aug 21 03:10 briefing.txt\n-rw------- 1 student student  128 Aug 21 03:15 .secret_flag';
      const obj = selectedMission.objectives.find(o => o.title.toLowerCase().includes('list') || o.title.toLowerCase().includes('hidden'));
      if (obj && !obj.completed) toggleMissionObjective(selectedMission.id, obj.id);
    } else if (lower.startsWith('cat')) {
      output = `[OPERATIONAL BRIEFING]\nTarget: Safe Intranet Range\nDirective: Validate permissions and extract target flags.\nRule: Authorized laboratory traffic only.`;
      const obj = selectedMission.objectives.find(o => o.title.toLowerCase().includes('read') || o.title.toLowerCase().includes('cat'));
      if (obj && !obj.completed) toggleMissionObjective(selectedMission.id, obj.id);
    } else if (lower.startsWith('mkdir')) {
      output = 'Directory created successfully at target path.';
      const obj = selectedMission.objectives.find(o => o.title.toLowerCase().includes('mkdir') || o.title.toLowerCase().includes('workspace'));
      if (obj && !obj.completed) toggleMissionObjective(selectedMission.id, obj.id);
    } else if (lower.startsWith('ip a') || lower.startsWith('ifconfig')) {
      output = '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 inet 192.168.1.105/24 brd 192.168.1.255 link/ether 00:0c:29:4a:88:91';
      const obj = selectedMission.objectives.find(o => o.title.toLowerCase().includes('ip') || o.title.toLowerCase().includes('interface'));
      if (obj && !obj.completed) toggleMissionObjective(selectedMission.id, obj.id);
    } else if (lower.startsWith('nmap')) {
      output = 'Starting Nmap 7.94\nNmap scan report for 192.168.1.105\nHost is up (0.00082s latency).\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.9p1\n80/tcp open  http    Apache 2.4.52';
    } else if (lower.startsWith('ping')) {
      output = 'PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.412 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.389 ms\n--- 192.168.1.1 ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss';
      const obj = selectedMission.objectives.find(o => o.title.toLowerCase().includes('icmp') || o.title.toLowerCase().includes('ping'));
      if (obj && !obj.completed) toggleMissionObjective(selectedMission.id, obj.id);
    } else if (lower === 'clear') {
      setTermHistory([]);
      return;
    }

    setTermHistory(prev => [...prev, { cmd, out: output, success: isSuccess }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl w-full max-w-4xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)] relative my-4 max-h-[92vh] flex flex-col">
        
        {/* TOP TACTICAL HUD BAR */}
        <div className="bg-slate-900/95 px-5 sm:px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
              <Crosshair className="w-5 h-5 animate-pulse" />
            </div>
            
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {selectedMission.missionNumber}
                </span>
                <span className="text-slate-600 font-mono">•</span>
                <span className="text-xs font-mono text-purple-400 tracking-wider">
                  [{selectedMission.codename}]
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold">
                  {selectedMission.classification || 'TOP SECRET // CLASSIFIED'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-mono font-bold text-slate-100 truncate">
                {selectedMission.title}
              </h2>
            </div>
          </div>

          {/* Right Action Controls (Sound, Close) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              title={audioMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={() => {
                playTacticalSound('click');
                setSelectedMission(null);
              }}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TACTICAL SUB-NAVIGATION BAR (Briefing vs Practice Arsenal vs Live Terminal) */}
        <div className="px-5 sm:px-6 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveModalTab('briefing');
                playTacticalSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeModalTab === 'briefing'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>OPERATION BRIEFING</span>
            </button>

            <button
              onClick={() => {
                setActiveModalTab('toolkit');
                playTacticalSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeModalTab === 'toolkit'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>HANDS-ON PRACTICE ARSENAL</span>
            </button>

            <button
              onClick={() => {
                setActiveModalTab('terminal');
                playTacticalSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeModalTab === 'terminal'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE SHELL EXECUTION</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ENCRYPTED LINK STABLE</span>
          </div>
        </div>

        {/* MODAL VIEWPORT CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* =========================================================================
              VIEW 1: OPERATION BRIEFING & TACTICAL OBJECTIVES
              ========================================================================= */}
          {activeModalTab === 'briefing' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Mission Metadata Dossier */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-cyan-400" /> DIFFICULTY
                  </span>
                  <div className="text-xs font-mono font-bold text-slate-200">{selectedMission.difficulty}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Award className="w-3 h-3 text-cyan-400" /> BOUNTY XP
                  </span>
                  <div className="text-xs font-mono font-bold text-cyan-400">+{selectedMission.xp} XP</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> EST. RUNTIME
                  </span>
                  <div className="text-xs font-mono font-bold text-slate-200">{selectedMission.estimatedTime}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Layers className="w-3 h-3 text-purple-400" /> SECTOR CATEGORY
                  </span>
                  <div className="text-xs font-mono font-bold text-purple-300">{selectedMission.category}</div>
                </div>
              </div>

              {/* Tactical Dispatch Audio / Radio Transmission Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/20 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-purple-400" />
                      HQ DISPATCHER COMM-LINK
                    </span>
                  </div>
                  <button
                    onClick={handlePlayTransmission}
                    disabled={isPlayingComm}
                    className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 hover:text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Play className={`w-3 h-3 ${isPlayingComm ? 'animate-spin' : ''}`} />
                    <span>{isPlayingComm ? 'AUDIO STREAMING...' : 'REPLAY TRANSMISSION'}</span>
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-300 italic border-l-2 border-purple-500/60 pl-3 py-1">
                  "{selectedMission.description}"
                </p>
              </div>

              {/* Tactical Briefing Paragraphs */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">TACTICAL BRIEFING DIRECTIVES:</span>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 text-xs text-slate-300 font-sans leading-relaxed">
                  {selectedMission.briefing.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Visual Progress & Sub-Task Matrix */}
              <MissionProgressTracker
                mission={selectedMission}
                variant="detailed"
                onToggleObjective={(mId, oId) => toggleMissionObjective(mId, oId)}
                interactive={true}
                showHints={true}
              />

              {/* Fast Lab Jump Bar */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    NEED HANDS-ON PRACTICE TOOLS?
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Switch to the Practice Arsenal tab or jump into the dedicated Linux Terminal / Cyber Range.
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setActiveModalTab('toolkit');
                      playTacticalSound('click');
                    }}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Open Arsenal</span>
                  </button>
                  <button
                    onClick={handleOpenLinuxLab}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Dedicated Lab</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 2: HANDS-ON PRACTICE ARSENAL
              ========================================================================= */}
          {activeModalTab === 'toolkit' && (
            <div className="animate-fadeIn">
              <PracticeToolsLab
                initialTool={
                  selectedMission.category === 'Networking' ? 'port_scanner' :
                  selectedMission.category === 'Web' ? 'http_inspector' : 'hash_decoder'
                }
                activeTargetIp="192.168.1.105"
              />
            </div>
          )}

          {/* =========================================================================
              VIEW 3: LIVE SHELL EXECUTION SANDBOX
              ========================================================================= */}
          {activeModalTab === 'terminal' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>IN-MODAL TACTICAL BASH SANDBOX</span>
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Type Linux commands to simulate execution and automatically complete mission sub-tasks.
                  </p>
                </div>
                <button
                  onClick={() => setTermHistory([])}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Terminal Viewport */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-inner font-mono text-xs space-y-3 min-h-[300px] flex flex-col justify-between">
                <div className="space-y-2.5 overflow-y-auto max-h-72 custom-scrollbar">
                  {termHistory.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span className="text-slate-500">operator@cyberlab:~$</span>
                        <span className="font-bold text-slate-100">{item.cmd}</span>
                      </div>
                      <div className="text-slate-300 text-xs pl-4 border-l border-slate-800 whitespace-pre-wrap">
                        {item.out}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prompt Command Line */}
                <form onSubmit={handleRunTermCommand} className="flex items-center gap-2 pt-2 border-t border-slate-900">
                  <span className="text-emerald-400 font-bold">operator@cyberlab:~$</span>
                  <input
                    type="text"
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    placeholder="whoami, pwd, uname -a, ls -la, cat briefing.txt, ip a, nmap..."
                    className="flex-1 bg-transparent text-slate-100 focus:outline-none text-xs font-mono"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Run</span>
                  </button>
                </form>
              </div>

              {/* Quick Command Suggestions */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-500">Quick Recipes:</span>
                {['whoami', 'pwd', 'uname -a', 'ls -la', 'cat /etc/passwd', 'ip a', 'nmap 192.168.1.105', 'ping 192.168.1.1'].map(cmd => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => setTermInput(cmd)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/30 cursor-pointer"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* MODAL BOTTOM TACTICAL ACTION BAR */}
        <div className="bg-slate-900/95 px-5 sm:px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>OBJECTIVES CLEARED:</span>
            <span className={`font-bold ${allCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {completedCount} / {selectedMission.objectives.length} ({allCompleted ? '100%' : `${Math.round((completedCount/selectedMission.objectives.length)*100)}%`})
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                playTacticalSound('click');
                setSelectedMission(null);
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-900 font-mono text-xs cursor-pointer transition-colors"
            >
              Close Briefing
            </button>

            {allCompleted && selectedMission.status !== 'completed' ? (
              <button
                onClick={handleClaim}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all animate-bounce"
              >
                <Sparkles className="w-4 h-4" />
                <span>CLAIM +{selectedMission.xp} XP & CLEAR OP</span>
              </button>
            ) : selectedMission.status === 'completed' ? (
              <div className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>MISSION CLEARED ✓</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveModalTab('terminal');
                  playTacticalSound('click');
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
              >
                <Terminal className="w-4 h-4" />
                <span>EXECUTE MISSION LAB</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default MissionModal;
