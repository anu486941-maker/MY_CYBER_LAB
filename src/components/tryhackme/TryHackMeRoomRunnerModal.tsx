import React, { useState, useEffect, useRef } from 'react';
import { 
  THMRoom, 
  THMTask, 
  THMTaskQuestion 
} from '../../data/tryHackMeRoomsData';
import { TryHackMeMachineController } from './TryHackMeMachineController';
import { useApp } from '../../context/AppContext';
import { speechEngine } from '../../utils/speechEngine';
import { 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Terminal, 
  Bot, 
  Send, 
  Copy, 
  Check, 
  X, 
  Shield, 
  Radio, 
  Clock, 
  Award, 
  Flame, 
  ChevronRight, 
  ExternalLink,
  HelpCircle,
  Play
} from 'lucide-react';

interface TryHackMeRoomRunnerModalProps {
  room: THMRoom | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TryHackMeRoomRunnerModal: React.FC<TryHackMeRoomRunnerModalProps> = ({
  room,
  isOpen,
  onClose
}) => {
  const { user, addXp } = useApp();

  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, 'CORRECT' | 'WRONG' | 'UNATTEMPTED'>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [targetIp, setTargetIp] = useState<string>(room?.targetMachineConfig?.defaultIp || '10.10.142.88');
  const [isAttackBoxActive, setIsAttackBoxActive] = useState<boolean>(true);

  // AttackBox terminal state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[ATTACKBOX] Kali Linux 2026.2 (Rolling Release) initialized.',
    '[VPN] tun0 active: 10.8.44.12/16 -> Gateway: 10.8.0.1',
    `[INFO] Target machine is accessible at ${room?.targetMachineConfig?.defaultIp || '10.10.142.88'}.`,
    '[TIPS] Run "nmap -sV -sC <TARGET_IP>" or "curl http://<TARGET_IP>" to begin.'
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // AMAN Walkthrough Coach chat
  const [amanMessages, setAmanMessages] = useState<Array<{ role: 'aman' | 'user'; text: string }>>([
    {
      role: 'aman',
      text: `Namaste Operator! Main hoon AMAN. "${room?.title || 'TryHackMe Room'}" me aapka swagat hai! Kisi bhi question ya task me help chahiye ho toh poochiye. Main aapko Socratic hints dunga taaki aap flag khud discover kar sakein!`
    }
  ]);
  const [amanInput, setAmanInput] = useState<string>('');

  useEffect(() => {
    if (room) {
      setActiveTaskIndex(0);
      setAnswers({});
      setQuestionStatuses({});
      setRevealedHints({});
      setTargetIp(room.targetMachineConfig?.defaultIp || '10.10.142.88');
      setTerminalLogs([
        `[ATTACKBOX] Kali Linux 2026.2 initialized for room: ${room.title}`,
        `[VPN] Assigned IP: 10.8.44.12 | Target: ${room.targetMachineConfig?.defaultIp || '10.10.142.88'}`,
        `[STATUS] Type "help" or run security tools to begin exploitation.`
      ]);
    }
  }, [room]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  if (!isOpen || !room) return null;

  const currentTask = room.tasks[activeTaskIndex] || room.tasks[0];
  const totalQuestions = room.tasks.reduce((acc, t) => acc + t.questions.length, 0);
  const completedQuestionsCount = Object.values(questionStatuses).filter(s => s === 'CORRECT').length;
  const roomProgress = Math.round((completedQuestionsCount / (totalQuestions || 1)) * 100);

  const handleSubmitAnswer = (q: THMTaskQuestion) => {
    const rawAnswer = (answers[q.id] || '').trim();
    if (!rawAnswer) return;

    const isMatch = 
      rawAnswer.toLowerCase() === q.correctAnswer.toLowerCase() ||
      (q.acceptedAnswers && q.acceptedAnswers.some(a => a.toLowerCase() === rawAnswer.toLowerCase()));

    if (isMatch) {
      setQuestionStatuses(prev => ({ ...prev, [q.id]: 'CORRECT' }));
      addXp(q.points);
      speechEngine.playChime('success');
    } else {
      setQuestionStatuses(prev => ({ ...prev, [q.id]: 'WRONG' }));
      speechEngine.playChime('alert');
    }
  };

  const handleExecuteTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalLogs(prev => [...prev, `root@attackbox:~# ${cmd}`]);
    setTerminalInput('');

    // Simulate realistic tool responses
    if (cmd.startsWith('nmap')) {
      const openPorts = room.targetMachineConfig?.ports || [
        { port: 80, service: 'http', banner: 'Apache/2.4.41' },
        { port: 22, service: 'ssh', banner: 'OpenSSH 8.2p1' }
      ];
      const portLines = openPorts.map(p => `${p.port}/tcp  open  ${p.service}  ${p.banner}`).join('\n');

      setTerminalLogs(prev => [
        ...prev,
        `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}`,
        `Nmap scan report for ${targetIp}`,
        `Host is up (0.018s latency).`,
        `PORT     STATE SERVICE VERSION`,
        portLines,
        `\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .`,
        `Nmap done: 1 IP address (1 host up) scanned in 2.14 seconds`
      ]);
    } else if (cmd.startsWith('curl') || cmd.startsWith('wget')) {
      setTerminalLogs(prev => [
        ...prev,
        `HTTP/1.1 200 OK`,
        `Server: Apache/2.4.41 (Ubuntu)`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Length: 1042`,
        `\n<!DOCTYPE html><html><!-- Developer Note: Check Sup3rS3cretPickl3Ingred.txt --><body><h1>${room.title} Web Service</h1></body></html>`
      ]);
    } else if (cmd === 'help') {
      setTerminalLogs(prev => [
        ...prev,
        `Supported Diagnostic & Offensive Commands:`,
        `  nmap <options> <target>   - Port & service enumeration`,
        `  curl <url>                - Query HTTP web server`,
        `  gobuster / dirb <url>     - Directory & file fuzzing`,
        `  msfconsole                - Metasploit framework console`,
        `  cat / ls / pwd / id       - Linux file & permission diagnostics`,
        `  clear                     - Reset terminal window`
      ]);
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
    } else {
      setTerminalLogs(prev => [
        ...prev,
        `Command executed successfully on ${targetIp}.`
      ]);
    }
  };

  const handleAskAman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amanInput.trim()) return;

    const query = amanInput.trim();
    setAmanMessages(prev => [...prev, { role: 'user', text: query }]);
    setAmanInput('');

    // Generate Socratic walkthrough guidance
    let reply = `Good question! In room "${room.title}", examine the hints and review the service banners discovered via Nmap on ${targetIp}.`;
    if (query.toLowerCase().includes('flag') || query.toLowerCase().includes('answer')) {
      reply = `Operator, TryHackMe guidelines and AMAN protocol encourage finding the flag independently! Check Task ${currentTask.taskNumber} instructions or reveal Hint #1 for the exact direction.`;
    } else if (query.toLowerCase().includes('nmap') || query.toLowerCase().includes('port')) {
      reply = `Try running: \`nmap -sV -sC ${targetIp}\` in the AttackBox terminal. Pay close attention to any service versions that might have known CVEs.`;
    }

    setTimeout(() => {
      setAmanMessages(prev => [...prev, { role: 'aman', text: reply }]);
      speechEngine.speak(reply);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-7xl h-[92vh] overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Top Room Header Bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono font-bold text-sm text-slate-100">{room.title}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {room.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                  {room.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">{room.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right font-mono">
                <div className="text-[10px] text-slate-400">ROOM PROGRESS</div>
                <div className="text-xs font-bold text-emerald-400">{roomProgress}% Completed</div>
              </div>
              <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${roomProgress}%` }} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Machine Controller Deployment Bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 shrink-0">
          <TryHackMeMachineController
            roomTitle={room.title}
            defaultIp={room.targetMachineConfig?.defaultIp || '10.10.142.88'}
            onIpGenerated={(ip) => setTargetIp(ip)}
            onAttackBoxToggle={() => setIsAttackBoxActive(!isAttackBoxActive)}
            isAttackBoxActive={isAttackBoxActive}
          />
        </div>

        {/* Main Split Layout: Tasks on Left, AttackBox & AMAN on Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Tasks & Questions (7 cols) */}
          <div className="lg:col-span-7 border-r border-slate-800 flex flex-col overflow-hidden bg-slate-900/60">
            
            {/* Task Selector Tabs */}
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
              {room.tasks.map((task, idx) => {
                const taskQuestions = task.questions.map(q => questionStatuses[q.id]);
                const isTaskDone = taskQuestions.length > 0 && taskQuestions.every(s => s === 'CORRECT');

                return (
                  <button
                    key={task.id}
                    onClick={() => setActiveTaskIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      activeTaskIndex === idx
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {isTaskDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    Task {task.taskNumber}
                  </button>
                );
              })}
            </div>

            {/* Active Task Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              
              {/* Task Title & Description */}
              <div className="space-y-2">
                <h3 className="font-mono font-bold text-base text-slate-100 flex items-center gap-2">
                  {currentTask.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentTask.description}
                </p>
              </div>

              {/* Questions Section */}
              <div className="space-y-4 pt-2">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Answer the questions below:
                </div>

                {currentTask.questions.map((q) => {
                  const status = questionStatuses[q.id] || 'UNATTEMPTED';
                  const isHintRevealed = revealedHints[q.id] || false;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border transition-all ${
                        status === 'CORRECT'
                          ? 'bg-emerald-950/30 border-emerald-500/40 ring-1 ring-emerald-500/30'
                          : status === 'WRONG'
                          ? 'bg-rose-950/20 border-rose-500/40'
                          : 'bg-slate-950/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="text-xs font-medium text-slate-200 leading-snug">
                          <strong className="font-mono text-cyan-400 mr-1.5">Question {q.questionNumber}:</strong>
                          {q.prompt}
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 shrink-0">
                          +{q.points} XP
                        </span>
                      </div>

                      {/* Input & Submit Form */}
                      <div className="flex items-center gap-2 mt-3">
                        <input
                          type="text"
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          disabled={status === 'CORRECT'}
                          placeholder={q.answerFormat ? `Format: ${q.answerFormat}` : 'Enter your answer / flag...'}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
                        />
                        <button
                          onClick={() => handleSubmitAnswer(q)}
                          disabled={status === 'CORRECT'}
                          className={`px-4 py-2 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                            status === 'CORRECT'
                              ? 'bg-emerald-500 text-slate-950 cursor-default'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                          }`}
                        >
                          {status === 'CORRECT' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Correct!
                            </>
                          ) : (
                            'Submit'
                          )}
                        </button>
                      </div>

                      {/* Hint Accordion */}
                      {q.hint && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                          {isHintRevealed ? (
                            <div className="text-xs font-mono text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/30 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <span>{q.hint}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setRevealedHints(prev => ({ ...prev, [q.id]: true }))}
                              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Lightbulb className="w-3.5 h-3.5" />
                              Need a Hint?
                            </button>
                          )}
                        </div>
                      )}

                      {/* Explanation on correct */}
                      {status === 'CORRECT' && q.explanation && (
                        <div className="mt-2 text-xs text-emerald-400 font-mono">
                          ✓ {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Right Column: AttackBox Terminal & AMAN Coach (5 cols) */}
          <div className="lg:col-span-5 flex flex-col overflow-hidden bg-slate-950">
            
            {/* AttackBox Terminal Header */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-xs text-slate-200">
                  ATTACKBOX LINUX WEB TERMINAL
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                tun0: 10.8.44.12
              </span>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 bg-black/90 custom-scrollbar">
              {terminalLogs.map((log, i) => (
                <div key={i} className="text-slate-300 whitespace-pre-wrap">
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input Form */}
            <form onSubmit={handleExecuteTerminal} className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <span className="font-mono text-xs text-cyan-400 font-bold">root@attackbox:~#</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="nmap -sV 10.10.x.x, curl, gobuster..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded transition-colors"
              >
                Exec
              </button>
            </form>

            {/* Bottom Socratic AMAN Hint Box */}
            <div className="h-44 border-t border-slate-800 bg-slate-950/90 flex flex-col shrink-0">
              <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono font-bold text-xs text-slate-300">
                    AMAN Socratic Walkthrough Mentor
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">Hinglish / English</span>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2 font-mono text-xs custom-scrollbar">
                {amanMessages.map((msg, i) => (
                  <div key={i} className={`p-2 rounded-lg ${
                    msg.role === 'aman' ? 'bg-cyan-950/40 border border-cyan-500/30 text-slate-300' : 'bg-slate-900 text-slate-200 text-right'
                  }`}>
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAskAman} className="p-2 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={amanInput}
                  onChange={(e) => setAmanInput(e.target.value)}
                  placeholder="Ask AMAN for a walkthrough hint..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="p-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
