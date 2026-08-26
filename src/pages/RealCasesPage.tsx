import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IncidentLabEngine } from '../components/IncidentLabEngine';
import { CyberLab } from '../types/incidentLab';
import { ALL_30_REAL_CASES, RealCase } from '../data/realCasesData';
import {
  Shield,
  Search,
  Terminal,
  Activity,
  Network,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Clock,
  Sparkles,
  Server,
  Lock,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Send,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

export const RealCasesPage: React.FC = () => {
  const { addXp, completedMissions, completeMission, addNotebookNote } = useApp();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-01');
  const [activeTab, setActiveTab] = useState<'briefing' | 'sandbox' | 'evidence' | 'mentor' | 'report' | 'lab'>('briefing');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sandbox terminal state
  const [termCommand, setTermCommand] = useState<string>('');
  const [termHistory, setTermHistory] = useState<Array<{ cmd: string; out: string; time: string }>>([
    { cmd: '# SYSTEM', out: 'Connected to safe authorized lab environment. Type commands (e.g., ip a, ss -tuln, ps aux, cat /etc/motd) to investigate.', time: '12:00:00' }
  ]);

  // Think First & Hypothesis state
  const [userHypothesis, setUserHypothesis] = useState<string>('');
  const [hypothesisSubmitted, setHypothesisSubmitted] = useState<boolean>(false);

  // Hints state
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);

  // Mentor Chat state
  const [mentorMessages, setMentorMessages] = useState<Array<{ sender: 'user' | 'mentor'; text: string }>>([
    { sender: 'mentor', text: 'Welcome to the case investigation. Before jumping straight into commands, what are your initial thoughts on the symptoms reported in the briefing?' }
  ]);
  const [mentorInput, setMentorInput] = useState<string>('');

  // Report Question Answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showCaseSummaryModal, setShowCaseSummaryModal] = useState<boolean>(false);
  const [caseSolved, setCaseSolved] = useState<boolean>(false);

  const currentCase = ALL_30_REAL_CASES.find(c => c.id === selectedCaseId) || ALL_30_REAL_CASES[0];
  const isCompleted = (completedMissions || []).includes(currentCase?.id || '');

  const labData: CyberLab = {
    id: currentCase.id,
    title: currentCase.title,
    careerTrack: 'SOC_ANALYST',
    category: 'SOC',
    difficulty: 'BEGINNER',
    description: currentCase.background,
    briefing: currentCase.background,
    objectives: [currentCase.objective],
    terminalEnabled: true,
    timelineEvents: [],
    evidenceLocker: currentCase.evidence.map(ev => ({
        id: ev.title, 
        type: 'FILE', 
        title: ev.title,
        description: ev.title,
        value: ev.content,
        source: 'system',
        confidence: 'high'
      })),
    decisionPoints: currentCase.investigationQuestions.map(iq => ({
        id: iq.id,
        scenario: iq.question,
        options: iq.options ? iq.options.map(opt => ({
            id: opt,
            text: opt,
            isCorrect: opt === iq.correctAnswer,
            feedback: iq.explanation
        })) : []
    })),
    hints: currentCase.hints.map(h => h.text),
    xp: currentCase.xpReward
  };

  // Filter cases
  const filteredCases = ALL_30_REAL_CASES.filter(c => {
    const matchCat = filterCategory === 'All' || c.category === filterCategory;
    const matchDiff = filterDifficulty === 'All' || c.difficulty === filterDifficulty;
    const matchSearch = (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (c.codename || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (c.background || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchDiff && matchSearch;
  });

  const categories = ['All', 'Linux', 'Networking', 'DNS', 'Web Security', 'System Admin', 'Windows/AD', 'Forensics', 'Multi-Host', 'Enterprise'];
  const difficulties = ['All', 'Beginner', 'Easy', 'Intermediate', 'Hard', 'Advanced'];

  // Handle Terminal Execution
  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termCommand.trim()) return;

    const cmd = termCommand.trim();
    let out = '';
    const now = new Date().toLocaleTimeString();

    if (cmd === 'clear') {
      setTermHistory([]);
      setTermCommand('');
      return;
    }

    if (cmd.startsWith('cat ')) {
      const filePath = cmd.split(' ')[1];
      if (currentCase.simulationEnv.files[filePath]) {
        out = currentCase.simulationEnv.files[filePath];
      } else {
        out = `cat: ${filePath}: No such file or directory`;
      }
    } else if (cmd.startsWith('ls')) {
      const paths = Object.keys(currentCase.simulationEnv.files);
      out = `total ${paths.length * 4}\n` + paths.map(p => `-rw-r--r-- 1 ${currentCase.simulationEnv.user} root 1024 Aug 21 12:00 ${p}`).join('\n');
    } else if (cmd.startsWith('ip a') || cmd.startsWith('ifconfig')) {
      out = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet ${currentCase.simulationEnv.targetIp}/24 brd 10.10.255.255 scope global eth0`;
    } else if (cmd.startsWith('ss') || cmd.startsWith('netstat')) {
      const ports = currentCase.simulationEnv.listeningPorts || [
        { port: 22, proto: 'tcp', service: 'ssh' },
        { port: 80, proto: 'tcp', service: 'http' }
      ];
      out = 'Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port   Process\n' +
        ports.map(p => `${p.proto.padEnd(6)} LISTEN  0       128      0.0.0.0:${p.port.toString().padEnd(12)} 0.0.0.0:*           "${p.service}"`).join('\n');
    } else if (cmd.startsWith('ps')) {
      const procs = currentCase.simulationEnv.processes || ['systemd', 'sshd', 'nginx', 'bash'];
      out = 'UID        PID  PPID  C STIME TTY          TIME CMD\n' +
        procs.map((p, i) => `root     ${(1000 + i * 20).toString().padEnd(6)} 1     0 12:00 ?        00:00:01 ${p}`).join('\n');
    } else if (cmd.startsWith('hostname')) {
      out = currentCase.simulationEnv.hostname;
    } else if (cmd.startsWith('whoami')) {
      out = currentCase.simulationEnv.user;
    } else if (cmd.startsWith('uname')) {
      out = 'Linux mycyberlab-node 5.15.0-89-generic #99-Ubuntu SMP x86_64 GNU/Linux';
    } else if (cmd.startsWith('nmap')) {
      out = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${currentCase.simulationEnv.hostname} (${currentCase.simulationEnv.targetIp})\nHost is up (0.00021s latency).\n\nPORT     STATE SERVICE\n` +
        (currentCase.simulationEnv.listeningPorts || [{ port: 80, proto: 'tcp', service: 'http' }])
          .map(p => `${(p.port + '/' + p.proto).padEnd(9)} open  ${p.service} ${p.banner || ''}`).join('\n');
    } else if (cmd.startsWith('curl')) {
      out = `HTTP/1.1 200 OK\nServer: MyCyberLab-Test-Httpd/2.4\nContent-Type: text/html\n\n<html><body><h1>${currentCase.title}</h1><p>Target active.</p></body></html>`;
    } else if (cmd.startsWith('dig') || cmd.startsWith('nslookup')) {
      out = `;; ANSWER SECTION:\n${currentCase.title.toLowerCase().replace(/\s+/g, '-')}.internal. 300 IN A ${currentCase.simulationEnv.targetIp}`;
    } else {
      out = `Command executed on ${currentCase.simulationEnv.hostname}: ${cmd}\nExit code 0 (Simulated sandbox environment)`;
    }

    setTermHistory(prev => [...prev, { cmd, out, time: now }]);
    setTermCommand('');
  };

  // Unlock hint
  const handleUnlockHint = (level: number, cost: number) => {
    if (!unlockedHints.includes(level)) {
      setUnlockedHints([...unlockedHints, level]);
    }
  };

  // AI Mentor Chat
  const handleSendMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorInput.trim()) return;

    const userText = mentorInput.trim();
    setMentorMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setMentorInput('');

    setTimeout(() => {
      let mentorReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('where') || lower.includes('start') || lower.includes('begin')) {
        mentorReply = `Good question. Look closely at the "What You Know" section in the briefing. Have you checked the listening ports with "ss -tuln" or examined the configuration files in /etc? What does that show?`;
      } else if (lower.includes('port') || lower.includes('nmap') || lower.includes('scan')) {
        mentorReply = `Port enumeration is a solid first step. Which specific ports responded? Are any of those services running on non-standard ports or showing an unexpected version banner?`;
      } else if (lower.includes('why') || lower.includes('root cause')) {
        mentorReply = `Think about the chain of cause and effect: what misconfiguration or software flaw allowed this behavior to occur in the first place? Have you documented the exact proof in your notes?`;
      } else if (lower.includes('flag') || lower.includes('answer') || lower.includes('solution')) {
        mentorReply = `As your senior mentor, I won't just hand you the answer! Let's reason through it together: What evidence have you collected so far, and what hypothesis does it support?`;
      } else {
        mentorReply = `Interesting observation! How does that connect with the symptoms described in the case briefing? What command or check would definitively prove or disprove your theory?`;
      }

      setMentorMessages(prev => [...prev, { sender: 'mentor', text: mentorReply }]);
    }, 600);
  };

  // Submit Final Answers
  const handleSubmitReport = () => {
    let allCorrect = true;
    for (const q of currentCase.investigationQuestions) {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const correct = q.correctAnswer.trim().toLowerCase();
      if (!userAns.includes(correct) && userAns !== correct) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect || Object.keys(answers).length >= currentCase.investigationQuestions.length) {
      setCaseSolved(true);
      setShowCaseSummaryModal(true);
      if (!isCompleted) {
        addXp(currentCase.xpReward);
        completeMission(currentCase.id);
        addNotebookNote(
          `Case Solved: ${currentCase.title} (#${currentCase.caseNumber})`,
          `Root Cause: ${currentCase.rootCause}\nDefensive Lesson: ${currentCase.defensiveLesson}\nRemediation: ${currentCase.remediation.join(', ')}`,
          'Findings'
        );
      }
    } else {
      alert('Some questions require more investigation. Check your terminal output and evidence vault!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-md font-semibold">
                🛡️ EDUCATIONAL CASE SIMULATIONS
              </span>
              <span className="text-xs text-slate-400 font-mono">
                30 ACTIVE MISSIONS • STRICT SAFE SANDBOX
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Real Cases & Incident Investigations
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1 max-w-3xl">
              Solve realistic cybersecurity incidents from beginner system triage to the apex NIGHTFALL enterprise investigation.
              Learn through systematic hypothesis testing, evidence correlation, and root-cause defense.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Solved</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {ALL_30_REAL_CASES.filter(c => (completedMissions || []).includes(c.id)).length} / 30
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-xs text-slate-400">Available XP</div>
              <div className="text-lg font-bold text-cyan-400 font-mono">9,850 XP</div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by case name, codename, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-slate-500 whitespace-nowrap">Category:</span>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex items-center gap-2 overflow-x-auto pb-1 justify-start md:justify-end">
            <span className="text-xs text-slate-500 whitespace-nowrap">Difficulty:</span>
            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Case List + Active Case Canvas */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 30 Case Selector */}
        <div className="lg:col-span-4 space-y-2 max-h-[820px] overflow-y-auto pr-1">
          {filteredCases.map(c => {
            const isSel = c.id === selectedCaseId;
            const isDone = (completedMissions || []).includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCaseId(c.id);
                  setUnlockedHints([]);
                  setHypothesisSubmitted(false);
                  setUserHypothesis('');
                  setTermHistory([
                    { cmd: '# SYSTEM', out: `Connected to safe authorized lab environment for ${c.title}. Host: ${c.simulationEnv.hostname}`, time: '12:00:00' }
                  ]);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isSel
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/30'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isSel
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {c.caseNumber < 10 ? `0${c.caseNumber}` : c.caseNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200 line-clamp-1">{c.title}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{c.codename}</span>
                      <span className="text-[10px] text-slate-600">•</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                        c.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                        c.difficulty === 'Easy' ? 'bg-blue-500/10 text-blue-400' :
                        c.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' :
                        c.difficulty === 'Hard' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-red-500/10 text-red-400 font-bold'
                      }`}>
                        {c.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-cyan-400 font-semibold">+{c.xpReward} XP</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Case Workspace */}
        <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col">
          {/* Active Case Header Banner */}
          <div className="border-b border-slate-800 pb-5 mb-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded">
                  CASE #{currentCase.caseNumber < 10 ? `0${currentCase.caseNumber}` : currentCase.caseNumber}
                </span>
                <span className="text-xs font-mono text-slate-400 tracking-wider font-semibold">
                  {currentCase.codename}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {currentCase.estimatedTime}</span>
                <span>•</span>
                <span className="text-cyan-400 font-mono font-bold">+{currentCase.xpReward} XP</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{currentCase.category}</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{currentCase.title}</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{currentCase.background}</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 mb-5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'lab' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Lab Engine
            </button>
            <button
              onClick={() => setActiveTab('briefing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'briefing' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> 1. Briefing & Topology
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sandbox' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> 2. Safe Terminal Sandbox
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'evidence' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> 3. Evidence Vault & Clues
            </button>

            <button
              onClick={() => setActiveTab('mentor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'mentor' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> 4. AI Case Mentor
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'report' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> 5. Submit Report & Defense
            </button>
          </div>

          {/* TAB: INTERACTIVE LAB */}
          {activeTab === 'lab' && <IncidentLabEngine currentLab={labData} />}

          {/* TAB 1: BRIEFING & TOPOLOGY */}
          {activeTab === 'briefing' && (
            <div className="space-y-6 flex-1">
              {/* Think First Form */}
              <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Lightbulb className="w-4 h-4" /> "Think First" Protocol
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Before running diagnostic commands, formulate your hypothesis. What root cause do you expect based on the briefing symptoms?
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g., I expect an uncataloged legacy database daemon or misconfigured gateway..."
                    value={userHypothesis}
                    onChange={e => setUserHypothesis(e.target.value)}
                    disabled={hypothesisSubmitted}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
                  />
                  <button
                    onClick={() => setHypothesisSubmitted(true)}
                    disabled={!userHypothesis.trim() || hypothesisSubmitted}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                  >
                    {hypothesisSubmitted ? 'Hypothesis Logged ✓' : 'Log Hypothesis'}
                  </button>
                </div>
              </div>

              {/* What You Know */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> What You Know
                  </h4>
                  <ul className="space-y-2">
                    {currentCase.whatYouKnow.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-cyan-500 font-mono">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Scope & Target Systems
                  </h4>
                  <div className="text-xs text-slate-400 space-y-2">
                    <p><strong className="text-slate-300">Target IP:</strong> <code className="text-cyan-400 font-mono">{currentCase.simulationEnv.targetIp}</code></p>
                    <p><strong className="text-slate-300">Hostname:</strong> <code className="text-emerald-400 font-mono">{currentCase.simulationEnv.hostname}</code></p>
                    <p><strong className="text-slate-300">Authorized Scope:</strong> {currentCase.authorizedScope}</p>
                    <p><strong className="text-slate-300">Tools:</strong> {currentCase.toolsAvailable.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Network Diagram */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-cyan-400" /> Network Architecture Diagram
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentCase.networkDiagram.nodes.map(node => (
                    <div
                      key={node.id}
                      className={`p-3 rounded-lg border text-center ${
                        node.status === 'target' ? 'bg-cyan-950/30 border-cyan-500/50' :
                        node.status === 'compromised' ? 'bg-red-950/30 border-red-500/50' :
                        node.status === 'gateway' ? 'bg-amber-950/30 border-amber-500/50' :
                        'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <Server className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                      <div className="text-xs font-semibold text-slate-200">{node.name}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{node.ip}</div>
                      <div className="text-[10px] text-slate-500 uppercase mt-0.5">{node.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-950/40"
                >
                  Proceed to Terminal Sandbox <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TERMINAL SANDBOX */}
          {activeTab === 'sandbox' && (
            <div className="flex flex-col flex-1 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col flex-1 min-h-[420px]">
                {/* Terminal Bar */}
                <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      {currentCase.simulationEnv.user}@{currentCase.simulationEnv.hostname}:~
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      🟢 SANDBOX SAFE
                    </span>
                    <button
                      onClick={() => setTermHistory([])}
                      className="text-xs text-slate-500 hover:text-slate-300 p-1"
                      title="Clear Terminal"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Terminal Output */}
                <div className="p-4 font-mono text-xs text-slate-300 flex-1 overflow-y-auto space-y-3 bg-slate-950">
                  {termHistory.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <span className="text-slate-600">[{item.time}]</span>
                        <span className="text-emerald-400">{currentCase.simulationEnv.user}@{currentCase.simulationEnv.hostname}:$</span>
                        <span>{item.cmd}</span>
                      </div>
                      <pre className="text-slate-300 whitespace-pre-wrap pl-4 border-l border-slate-800 text-[11px]">
                        {item.out}
                      </pre>
                    </div>
                  ))}
                </div>

                {/* Command Input Form */}
                <form onSubmit={handleRunCommand} className="border-t border-slate-800 bg-slate-900/50 p-2 flex items-center gap-2">
                  <span className="text-emerald-400 font-mono text-xs pl-2">$</span>
                  <input
                    type="text"
                    value={termCommand}
                    onChange={e => setTermCommand(e.target.value)}
                    placeholder="Type command (e.g. ss -tuln, ip a, cat /etc/motd, ps aux, nmap -sV)..."
                    className="flex-1 bg-transparent border-none text-xs font-mono text-slate-200 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded transition-colors"
                  >
                    Execute
                  </button>
                </form>
              </div>

              {/* Quick Command Suggestions */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">Suggested:</span>
                {['ip a', 'ss -tuln', 'hostname', 'ps aux', 'cat /etc/motd', 'nmap -sV'].map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setTermCommand(cmd);
                    }}
                    className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-[11px] font-mono text-cyan-400 rounded border border-slate-700 transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE & HINTS */}
          {activeTab === 'evidence' && (
            <div className="space-y-6 flex-1">
              {/* Evidence Vault */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Evidence Vault & Artifacts
                </h4>
                {currentCase.evidence.map((ev, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-cyan-400">{ev.title}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded uppercase">
                        {ev.type}
                      </span>
                    </div>
                    <pre className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                      {ev.content}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Progressive Hint System */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Progressive Clues (Think First!)
                </h4>
                <p className="text-xs text-slate-400">
                  Hints provide guided reasoning without spoiling the solution directly.
                </p>

                <div className="space-y-2">
                  {currentCase.hints.map(hint => {
                    const isUnlocked = unlockedHints.includes(hint.level);
                    return (
                      <div key={hint.level} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-400">Clue #{hint.level}: {hint.title}</span>
                          </div>
                          {!isUnlocked ? (
                            <button
                              onClick={() => handleUnlockHint(hint.level, hint.xpPenalty)}
                              className="text-xs px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded font-medium transition-all"
                            >
                              Unlock Clue (-{hint.xpPenalty} XP)
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-mono">UNLOCKED</span>
                          )}
                        </div>
                        {isUnlocked && (
                          <div className="mt-2 text-xs text-slate-300 pl-2 border-l border-amber-500/50">
                            {hint.text}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI CASE MENTOR */}
          {activeTab === 'mentor' && (
            <div className="flex flex-col flex-1 space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Senior Incident Responder AI Mentor</h4>
                  <p className="text-xs text-slate-400">
                    Guiding you through SOC analysis methodology. The mentor asks leading questions to strengthen your reasoning.
                  </p>
                </div>
              </div>

              {/* Chat Window */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex-1 overflow-y-auto space-y-3 min-h-[300px]">
                {mentorMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-slate-950 font-medium'
                        : 'bg-slate-900 text-slate-200 border border-slate-800'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMentor} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question (e.g., 'What does the ss output indicate about port 5432?')..."
                  value={mentorInput}
                  onChange={e => setMentorInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: SUBMIT REPORT & DEFENSE */}
          {activeTab === 'report' && (
            <div className="space-y-6 flex-1">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Investigation Findings & Defense Verification
                </h4>
                <p className="text-xs text-slate-400">
                  Answer the verification questions based on the evidence gathered in your terminal and logs.
                </p>
              </div>

              <div className="space-y-4">
                {currentCase.investigationQuestions.map((q, idx) => (
                  <div key={q.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <label className="text-xs font-semibold text-slate-200 block">
                      Question {idx + 1}: {q.question}
                    </label>

                    {q.expectedAnswerType === 'choice' && q.options ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {q.options.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                            className={`p-2.5 text-left rounded-lg text-xs border transition-all ${
                              answers[q.id] === opt
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                        placeholder={`Enter ${q.expectedAnswerType} answer...`}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSubmitReport}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4" /> Submit Investigation Findings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Case Solved & Defense Summary Modal */}
      {showCaseSummaryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold">CASE SOLVED • +{currentCase.xpReward} XP</span>
                <h3 className="text-2xl font-extrabold text-white">{currentCase.title}</h3>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <strong className="text-cyan-400 block mb-1">🔍 Root Cause:</strong>
                <p className="text-slate-300">{currentCase.rootCause}</p>
              </div>

              <div>
                <strong className="text-emerald-400 block mb-1">🛡️ Defensive Remediation:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {currentCase.remediation.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-amber-400 block mb-1">💡 Professional Security Lesson:</strong>
                <p className="text-slate-300">{currentCase.defensiveLesson}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCaseSummaryModal(false)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
              >
                Continue Training
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
