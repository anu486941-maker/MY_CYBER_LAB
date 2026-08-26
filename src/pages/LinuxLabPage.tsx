import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BANDIT_LEVELS_DATA } from '../data/mockData';
import { BanditLevel } from '../data/banditChallenges';
import { TerminalProvider, SimulatedTerminalProvider, ContainerTerminalProvider, VMTerminalProvider } from '../utils/terminalProvider';
import { SafeLabGatewayBanner } from '../components/labs/SafeLabGatewayBanner';
import { LabAssessmentEngine } from '../components/labs/LabAssessmentEngine';
import { CommandAnatomyPanel } from '../components/labs/CommandAnatomyPanel';
import { AmanInstructionBanner } from '../components/common/AmanInstructionBanner';
import { 
  Terminal as TerminalIcon, 
  Play, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  RotateCcw, 
  Copy, 
  ChevronRight,
  ShieldAlert,
  Layers,
  Flame,
  ArrowRight,
  Server,
  Lock,
  Unlock,
  Shield,
  Bot,
  Info,
  Terminal,
  Activity,
  Compass,
  Cpu
} from 'lucide-react';

interface CommandHistoryItem {
  command: string;
  output: string;
  isError?: boolean;
}

interface TerminalMission {
  id: string;
  code: string;
  title: string;
  task: string;
  hint: string;
  expectedCommand: string;
  xp: number;
}

const TERMINAL_MISSIONS: TerminalMission[] = [
  { id: 'tm-01', code: 'TERM 01', title: 'Check Current Directory', task: 'Run "pwd" to print your working directory.', hint: 'Type pwd and hit Enter.', expectedCommand: 'pwd', xp: 50 },
  { id: 'tm-02', code: 'TERM 02', title: 'List Directory Contents', task: 'Run "ls -la" to inspect all regular and hidden dotfiles.', hint: 'Type ls -la.', expectedCommand: 'ls -la', xp: 50 },
  { id: 'tm-03', code: 'TERM 03', title: 'Identify User & UID', task: 'Run "whoami" and "id" to verify your identity and group memberships.', hint: 'Type whoami or id.', expectedCommand: 'whoami', xp: 60 },
  { id: 'tm-04', code: 'TERM 04', title: 'Navigate Directories', task: 'Change directory to "/labs" and list files there.', hint: 'Type cd /labs then ls.', expectedCommand: 'cd /labs', xp: 70 },
  { id: 'tm-05', code: 'TERM 05', title: 'Inspect Kernel & OS', task: 'Run "uname -a" to view kernel architecture and release version.', hint: 'Type uname -a.', expectedCommand: 'uname -a', xp: 70 },
  { id: 'tm-06', code: 'TERM 06', title: 'Read Training Notes', task: 'Use "cat /home/student/notes.txt" to read system instructions.', hint: 'Type cat /home/student/notes.txt.', expectedCommand: 'cat /home/student/notes.txt', xp: 80 },
  { id: 'tm-07', code: 'TERM 07', title: 'Find Concealed Files', task: 'Use "find /labs -name \'*.flag\'" to locate hidden challenge flags.', hint: 'Type find /labs -name \'*.flag\'.', expectedCommand: 'find /labs -name \'*.flag\'', xp: 90 },
  { id: 'tm-08', code: 'TERM 08', title: 'Inspect Network Sockets', task: 'Run "ss -tuln" to list active TCP and UDP listening sockets.', hint: 'Type ss -tuln.', expectedCommand: 'ss -tuln', xp: 100 },
  { id: 'tm-09', code: 'TERM 09', title: 'Check IP Interfaces', task: 'Run "ip addr" to inspect IP configuration on eth0 and lo.', hint: 'Type ip addr or ip a.', expectedCommand: 'ip addr', xp: 100 },
  { id: 'tm-10', code: 'TERM 10', title: 'Examine Running Processes', task: 'Run "ps aux" to view running system daemons and background tasks.', hint: 'Type ps aux.', expectedCommand: 'ps aux', xp: 110 },
  { id: 'tm-11', code: 'TERM 11', title: 'Filter Log Entries', task: 'Run "grep -i \'error\' /var/log/syslog" to extract failure events.', hint: 'Type grep -i error /var/log/syslog.', expectedCommand: 'grep -i error /var/log/syslog', xp: 120 },
  { id: 'tm-12', code: 'TERM 12', title: 'Create Temporary File', task: 'Create a test file in "/tmp/probe.txt" using touch or echo.', hint: 'Type touch /tmp/probe.txt.', expectedCommand: 'touch /tmp/probe.txt', xp: 120 },
  { id: 'tm-13', code: 'TERM 13', title: 'Inspect File Permissions', task: 'Check octal and human permissions on /etc/passwd with "ls -l /etc/passwd".', hint: 'Type ls -l /etc/passwd.', expectedCommand: 'ls -l /etc/passwd', xp: 130 },
  { id: 'tm-14', code: 'TERM 14', title: 'Test Host Reachability', task: 'Send ICMP probes with "ping -c 3 10.10.10.1".', hint: 'Type ping -c 3 10.10.10.1.', expectedCommand: 'ping -c 3 10.10.10.1', xp: 130 },
  { id: 'tm-15', code: 'TERM 15', title: 'HTTP Diagnostic', task: 'Fetch web header banner using "curl -I http://10.10.10.5".', hint: 'Type curl -I http://10.10.10.5.', expectedCommand: 'curl -I http://10.10.10.5', xp: 140 },
  { id: 'tm-16', code: 'TERM 16', title: 'Inspect System Resources', task: 'Run "df -h" and "free -m" to audit disk mounts and memory usage.', hint: 'Type df -h.', expectedCommand: 'df -h', xp: 140 },
  { id: 'tm-17', code: 'TERM 17', title: 'Find SUID Binaries', task: 'Execute "find / -perm -4000 2>/dev/null" to audit privileged executable bits.', hint: 'Type find / -perm -4000.', expectedCommand: 'find / -perm -4000', xp: 150 },
  { id: 'tm-18', code: 'TERM 18', title: 'Read Log Tails', task: 'Use "tail -n 20 /var/log/auth.log" to inspect the most recent logins.', hint: 'Type tail -n 20 /var/log/auth.log.', expectedCommand: 'tail -n 20 /var/log/auth.log', xp: 160 },
  { id: 'tm-19', code: 'TERM 19', title: 'Simulate Port Scan', task: 'Run "nmap -sV -p 22,80 10.10.10.5" inside the training range.', hint: 'Type nmap -sV -p 22,80 10.10.10.5.', expectedCommand: 'nmap -sV -p 22,80 10.10.10.5', xp: 180 },
  { id: 'tm-20', code: 'TERM 20', title: 'Investigate a Vulnerable Lab', task: 'Synthesize commands to uncover the hidden vulnerability flag in /labs/vault/.secret_flag.', hint: 'Type cat /labs/vault/.secret_flag.', expectedCommand: 'cat /labs/vault/.secret_flag', xp: 200 }
];

const STARTER_COMMANDS = [
  { cmd: 'pwd', does: 'Prints current working directory', why: 'Orient yourself before executing destructive or path-relative commands' },
  { cmd: 'ls -la', does: 'Lists all files, sizes, and hidden dotfiles', why: 'Uncovers concealed configurations and permissions' },
  { cmd: 'whoami && id', does: 'Displays current username and group IDs', why: 'Determines if you operate with root (UID 0) or unprivileged access' },
  { cmd: 'ip a', does: 'Shows network interfaces and assigned IPs', why: 'Essential for discovering subnet boundaries and gateway addresses' },
  { cmd: 'ss -tulpn', does: 'Lists all listening TCP/UDP sockets with PIDs', why: 'Reveals all active services and uncataloged backdoors' },
  { cmd: 'ps aux', does: 'Snapshots all active processes in the OS', why: 'Identifies unauthorized background daemons or cryptominers' },
  { cmd: 'cat /etc/os-release', does: 'Outputs Linux distribution and version', why: 'Enables precise vulnerability and kernel CVE research' }
];

export const LinuxLabPage: React.FC = () => {
  const { profile, missions, completedMissions: ctxCompletedMissions, completeMission, addXp, awardAchievement, addNotebookNote } = useApp();
  
  const isRealRangeEnabled = import.meta.env.VITE_REAL_RANGE_ENABLED === 'true';

  // 3 Modes: Simulation, Local Lab, Cyber Range
  const [labMode, setLabMode] = useState<'simulation' | 'local_lab' | 'cyber_range'>('simulation');
  const [learningMode, setLearningMode] = useState<'learning' | 'normal' | 'exam'>('learning');
  const [activeTab, setActiveTab] = useState<'terminal' | 'assessment' | 'missions' | 'bandit' | 'ai_mentor'>('terminal');

  // Terminal state
  const [currentDir, setCurrentDir] = useState<string>('/home/student');
  const [inputVal, setInputVal] = useState<string>('');
  const [lastEnteredCmd, setLastEnteredCmd] = useState<string>('nmap -sV 10.10.10.5');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: '# SYSTEM INITIALIZATION',
      output: `╔══════════════════════════════════════════════════════════════════════════════╗\n║  MY CYBER LAB — LINUX LAB ENVIRONMENT (VIRTUAL SANDBOX)                     ║\n║  Kernel: Linux 5.15.0-89-generic #99-Ubuntu SMP x86_64                      ║\n║  Security: Strict Isolated Sandbox. Commands execute ONLY within lab.        ║\n║  Type "help" for built-in commands or explore /home/student, /labs, /notes.  ║\n╚══════════════════════════════════════════════════════════════════════════════╝`
    }
  ]);
  const [cmdIndexHistory, setCmdIndexHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  // Dynamic Terminal Provider instantiation (Phase 3 & 7)
  const terminalProvider = React.useMemo<TerminalProvider>(() => {
    if (labMode === 'local_lab') {
      return new ContainerTerminalProvider();
    }
    if (labMode === 'cyber_range') {
      return new VMTerminalProvider();
    }
    return new SimulatedTerminalProvider();
  }, [labMode]);

  // Sync state whenever the provider changes or creates a session
  useEffect(() => {
    terminalProvider.createSession('linux-lab', (profile && profile.uid) || 'guest').then(state => {
      setHistory(state.commandHistory);
      setCurrentDir(state.workingDirectory);
    });
  }, [terminalProvider, profile]);

  // Bandit Level State
  const [currentBanditIndex, setCurrentBanditIndex] = useState<number>(0);
  const [banditFlagInput, setBanditFlagInput] = useState<string>('');
  const [banditFeedback, setBanditFeedback] = useState<string | null>(null);
  const [showBanditHint, setShowBanditHint] = useState<boolean>(false);
  const currentBandit: BanditLevel = BANDIT_LEVELS_DATA[currentBanditIndex] || BANDIT_LEVELS_DATA[0];
  const completedMissions = ctxCompletedMissions || (missions || []).filter(m => m.status === 'completed' || m.completed).map(m => m.id);

  // AI Mentor Drawer State
  const [selectedCmdForAi, setSelectedCmdForAi] = useState<string>('ss -tuln');
  const [aiExplanation, setAiExplanation] = useState<{ purpose: string; securityRelevance: string; defense: string }>({
    purpose: 'ss (Socket Statistics) is the modern replacement for netstat, querying Linux kernel socket tables.',
    securityRelevance: 'Used in host triage to discover listening ports, unauthorized network listeners, and active C2 connections.',
    defense: 'Defenders use ss in automated baseline scripts to detect listening socket drift and unapproved port bindings.'
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Handle Command Execution (Asynchronous, backing-provider driven)
  const handleRunCommand = async (cmdStr?: string) => {
    const rawCmd = (cmdStr || inputVal).trim();
    if (!rawCmd) return;

    // Track command in history for arrow navigation
    setCmdIndexHistory(prev => [...prev, rawCmd]);
    setHistoryPointer(-1);
    setLastEnteredCmd(rawCmd);

    const lower = rawCmd.toLowerCase();

    // Intercept clear command
    if (lower === 'clear') {
      await terminalProvider.executeCommand('clear');
      setHistory([]);
      setInputVal('');
      return;
    }

    // Execute through our modular terminal abstraction
    const res = await terminalProvider.executeCommand(rawCmd);

    setHistory(prev => [...prev, { command: rawCmd, output: res.output, isError: res.isError }]);
    setCurrentDir(terminalProvider.getWorkingDirectory());
    setInputVal('');

    // Rewards & telemetry progression
    addXp(10);
    awardAchievement('ach-first-linux-cmd');
    if (lower.startsWith('nmap')) {
      awardAchievement('ach-nmap-explorer');
    }
  };

  // Autocomplete on Tab
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim();
      const match = STARTER_COMMANDS.map(s => s.cmd).find(c => c.startsWith(current));
      if (match) {
        setInputVal(match);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdIndexHistory.length > 0) {
        const nextPtr = historyPointer === -1 ? cmdIndexHistory.length - 1 : Math.max(0, historyPointer - 1);
        setHistoryPointer(nextPtr);
        setInputVal(cmdIndexHistory[nextPtr]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer !== -1 && historyPointer < cmdIndexHistory.length - 1) {
        const nextPtr = historyPointer + 1;
        setHistoryPointer(nextPtr);
        setInputVal(cmdIndexHistory[nextPtr]);
      } else {
        setHistoryPointer(-1);
        setInputVal('');
      }
    }
  };

  // Ask AI about command
  const handleExplainCommand = (cmd: string) => {
    setSelectedCmdForAi(cmd);
    if (cmd.includes('ss')) {
      setAiExplanation({
        purpose: 'Inspects socket tables directly from the Linux kernel to reveal listening network endpoints.',
        securityRelevance: 'Detects unauthorized daemons, covert listeners, and malware command-and-control beacons.',
        defense: 'Defenders correlate ss outputs with process execution logs (Auditd/Sysmon) to spot rogue listeners.'
      });
    } else if (cmd.includes('ip') || cmd.includes('ifconfig')) {
      setAiExplanation({
        purpose: 'Displays network interface configuration, MAC addresses, and subnet masks.',
        securityRelevance: 'Verifies IP routing and determines if network cards operate in promiscuous/sniffing mode.',
        defense: 'Enforces 802.1X network access control and prevents rogue IP assignments.'
      });
    } else if (cmd.includes('find') && cmd.includes('4000')) {
      setAiExplanation({
        purpose: 'Searches the root filesystem for binaries with the SUID (Set User ID) permission bit set.',
        securityRelevance: 'High priority during Linux privilege escalation audits. Vulnerable SUID binaries allow root escape.',
        defense: 'Strip SUID bits with chmod u-s and use fine-grained sudoers policies.'
      });
    } else {
      setAiExplanation({
        purpose: `Executes standard Linux utility "${cmd}" to gather system and process metadata.`,
        securityRelevance: 'Crucial for initial host triage, artifact extraction, and situational awareness.',
        defense: 'Log command execution with process auditing (Auditd) and monitor for abnormal parent-child process chains.'
      });
    }
    setActiveTab('ai_mentor');
  };

  // Bandit Flag Submission
  const handleBanditSubmit = () => {
    if (!banditFlagInput.trim()) return;
    if (banditFlagInput.trim() === currentBandit.flagSolution || banditFlagInput.trim().length > 5) {
      setBanditFeedback('Level Passed! Access Granted to Next Challenge.');
      addXp(100);
      completeMission(`bandit-${currentBandit.level}`);
      if (currentBanditIndex < BANDIT_LEVELS_DATA.length - 1) {
        setCurrentBanditIndex(currentBanditIndex + 1);
        setBanditFlagInput('');
      }
    } else {
      setBanditFeedback('Incorrect flag. Review the password file instructions.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans space-y-6">
      
      {/* AUTONOMOUS AMAN INSTRUCTION BANNER */}
      <div className="max-w-7xl mx-auto">
        <AmanInstructionBanner />
      </div>

      <div className="max-w-7xl mx-auto mb-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-md font-semibold">
                🛡️ SAFE TRAINING SANDBOX
              </span>
              <span className="text-xs text-slate-400 font-mono">
                UBUNTU 22.04 LTS EMULATION • ZERO HOST ESCAPE
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Realistic Linux Cyber Lab
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1 max-w-3xl">
              Practice real Linux command line security, file auditing, network analysis, and progressive challenges
              inside a safe browser sandbox.
            </p>
          </div>

          {/* 3 Modes Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 uppercase px-2">Lab Mode:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setLabMode('simulation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  labMode === 'simulation'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                🟢 Simulation
              </button>
              <button
                onClick={() => isRealRangeEnabled && setLabMode('local_lab')}
                disabled={!isRealRangeEnabled}
                title={!isRealRangeEnabled ? "Real Range is currently disabled for security." : ""}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  labMode === 'local_lab'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                    : isRealRangeEnabled ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                🔵 Local Lab
              </button>
              <button
                onClick={() => isRealRangeEnabled && setLabMode('cyber_range')}
                disabled={!isRealRangeEnabled}
                title={!isRealRangeEnabled ? "Real Range is currently disabled for security." : ""}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  labMode === 'cyber_range'
                    ? 'bg-red-500 text-slate-950 shadow-md shadow-red-950/40'
                    : isRealRangeEnabled ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                🔴 Cyber Range
              </button>
            </div>
          </div>
        </div>

        {/* Safe Lab Gateway Architecture Telemetry */}
        <div className="mt-4">
          <SafeLabGatewayBanner 
            labName="Linux Kernel & Command Security Lab"
            targetHost="training-sandbox.local"
            targetIp="10.10.14.2"
            allocatedTimeMinutes={45}
            onResetLab={async () => {
              const state = await terminalProvider.resetSession();
              setHistory(state.commandHistory);
              setCurrentDir(state.workingDirectory);
            }}
          />
        </div>
      </div>

      {/* Main Grid: Left Workspace Tabs + Right Command Learning Drawer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Terminal and Challenge Tabs */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'terminal' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" /> Interactive Linux Terminal
            </button>

            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'assessment' ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Automated Lab Assessment
            </button>

            <button
              onClick={() => setActiveTab('missions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'missions' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Progressive Missions (20)
            </button>

            <button
              onClick={() => setActiveTab('bandit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'bandit' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" /> OverTheWire Bandit Track
            </button>

            <button
              onClick={() => setActiveTab('ai_mentor')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'ai_mentor' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> Ask AI About Command
            </button>
          </div>

          {/* TAB 0: AUTOMATED LAB ASSESSMENT */}
          {activeTab === 'assessment' && (
            <LabAssessmentEngine />
          )}

          {/* TAB 1: INTERACTIVE LINUX TERMINAL */}
          {activeTab === 'terminal' && (
            <div className="flex flex-col flex-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl min-h-[480px]">
              {/* Terminal Titlebar */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    student@mycyberlab:{currentDir}$ ({terminalProvider.getProviderName()})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunCommand('reset')}
                    className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Lab
                  </button>
                  <button
                    onClick={() => setHistory([])}
                    className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Terminal Logs Area */}
              <div className="p-4 font-mono text-xs text-slate-300 flex-1 overflow-y-auto space-y-3 bg-slate-950/95 max-h-[500px]">
                {history.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <span className="text-emerald-400 font-bold">student@mycyberlab:{currentDir}$</span>
                      <span>{item.command}</span>
                    </div>
                    <pre className={`whitespace-pre-wrap pl-4 border-l ${item.isError ? 'border-red-500 text-red-400' : 'border-slate-800 text-slate-300'} text-[11px]`}>
                      {item.output}
                    </pre>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Input Bar */}
              <form onSubmit={e => { e.preventDefault(); handleRunCommand(); }} className="border-t border-slate-800 bg-slate-900/60 p-3 flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs font-bold pl-2">$</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type command (e.g. ls -la, ss -tuln, ip a, cat notes.txt, nmap 10.10.10.5)... [Tab for Autocomplete]"
                  className="flex-1 bg-transparent border-none text-xs font-mono text-slate-200 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Run
                </button>
              </form>

              {/* LIVE COMMAND ANATOMY & SYNTAX COACHING PANEL */}
              <div className="p-3 bg-slate-950 border-t border-slate-800">
                <CommandAnatomyPanel
                  lastCommand={lastEnteredCmd || inputVal}
                  onRetryCommand={suggested => {
                    setInputVal(suggested);
                  }}
                  onAskAman={prompt => {
                    handleExplainCommand(lastEnteredCmd || inputVal);
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: PROGRESSIVE TERMINAL MISSIONS (20) */}
          {activeTab === 'missions' && (
            <div className="space-y-4">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Progressive Command Line Missions</h4>
                  <p className="text-xs text-slate-400">Advance from beginner navigation to complex system triage.</p>
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  {TERMINAL_MISSIONS.filter(m => completedMissions.includes(m.id)).length} / 20 Solved
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
                {TERMINAL_MISSIONS.map(m => {
                  const isDone = completedMissions.includes(m.id);
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
                        <span className="text-xs font-mono text-emerald-400 font-bold">+{m.xp} XP</span>
                      </div>
                      <h5 className="text-xs font-bold text-white mb-1">{m.title}</h5>
                      <p className="text-xs text-slate-400 mb-2">{m.task}</p>
                      
                      {learningMode !== 'exam' && (
                        <div className="text-[11px] text-amber-400/90 font-mono bg-slate-950 p-2 rounded mb-3">
                          Hint: {m.hint}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setActiveTab('terminal');
                            handleRunCommand(m.expectedCommand);
                          }}
                          className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          Execute in Terminal <Play className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            if (!isDone) {
                              completeMission(m.id);
                              addXp(m.xp);
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded font-semibold transition-all ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isDone ? 'Solved ✓' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: OVERTHEWIRE BANDIT TRACK */}
          {activeTab === 'bandit' && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold">BANDIT LEVEL {currentBandit.level} → {currentBandit.nextUser}</span>
                  <h3 className="text-xl font-bold text-white">{currentBandit.title}</h3>
                </div>
                <div className="flex gap-1">
                  {BANDIT_LEVELS_DATA.slice(0, 8).map((b, idx) => (
                    <button
                      key={b.level}
                      onClick={() => setCurrentBanditIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                        currentBanditIndex === idx
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {b.level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <strong className="text-xs text-slate-300 block font-mono">OBJECTIVE & DESCRIPTION:</strong>
                <p className="text-xs text-slate-300 leading-relaxed">{currentBandit.objective}</p>
                <div className="text-xs text-slate-400 pt-2 font-mono">
                  Solution Strategy: <code className="text-cyan-400">{currentBandit.solutionCommand}</code>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200 block">Submit Next Level Password Flag:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={banditFlagInput}
                    onChange={e => setBanditFlagInput(e.target.value)}
                    placeholder="Enter discovered password flag (e.g. NH2KXG84N46PRC9D5Z6258POEN59NV68)..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleBanditSubmit}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Submit Flag
                  </button>
                </div>
                {banditFeedback && (
                  <p className="text-xs font-mono text-emerald-400">{banditFeedback}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ASK AI ABOUT COMMAND */}
          {activeTab === 'ai_mentor' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">AI Linux Command Mentor</h4>
                  <p className="text-xs text-slate-400">Deep technical insights, security relevance, and defensive monitoring.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedCmdForAi}
                  onChange={e => setSelectedCmdForAi(e.target.value)}
                  placeholder="Enter any Linux command (e.g. ss -tuln, find / -perm -4000)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleExplainCommand(selectedCmdForAi)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Explain Command
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <strong className="text-xs font-bold text-cyan-400 block mb-1">1. PURPOSE & OPERATION:</strong>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiExplanation.purpose}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <strong className="text-xs font-bold text-amber-400 block mb-1">2. SECURITY & INCIDENT TRIAGE RELEVANCE:</strong>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiExplanation.securityRelevance}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
                  <strong className="text-xs font-bold text-emerald-400 block mb-1">3. DEFENDER DETECTION & HARDENING:</strong>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiExplanation.defense}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Command Reference & Starter Drawer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" /> Essential Starter Commands
            </h3>
            <p className="text-xs text-slate-400">
              Click any command to test it directly in your virtual terminal or ask AI for a deep explanation.
            </p>

            <div className="space-y-2.5">
              {STARTER_COMMANDS.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono font-bold text-cyan-400">{item.cmd}</code>
                    <button
                      onClick={() => handleExplainCommand(item.cmd)}
                      className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-0.5"
                    >
                      <Bot className="w-3 h-3" /> Ask AI
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300">{item.does}</p>
                  <p className="text-[10px] text-slate-500 italic">Why: {item.why}</p>
                  <button
                    onClick={() => {
                      setActiveTab('terminal');
                      handleRunCommand(item.cmd);
                    }}
                    className="w-full mt-1.5 py-1 text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Play className="w-2.5 h-2.5 text-cyan-400" /> Try It
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
