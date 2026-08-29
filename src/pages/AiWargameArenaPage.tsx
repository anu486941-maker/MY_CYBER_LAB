import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Bot, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Radio, 
  Shield, 
  Terminal, 
  Lock, 
  Sparkles,
  Trophy,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DynamicTargetMachine {
  id: string;
  name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE';
  dynamicPort: number;
  activeMitigation: string;
  threatPersona: string;
  objective: string;
}

export const AiWargameArenaPage: React.FC = () => {
  const { profile, addXp } = useApp();
  const [activeScenario, setActiveScenario] = useState<DynamicTargetMachine>({
    id: 'wg-01',
    name: 'Dynamic Enterprise Gateway Alpha',
    difficulty: 'MEDIUM',
    dynamicPort: 8443,
    activeMitigation: 'Rate Limiting (Max 3 failed auths before 60s IP ban)',
    threatPersona: 'Adaptive AI Defense System (Suricata + Fail2Ban)',
    objective: 'Bypass adaptive rate-limiting using IP rotation or randomized delay intervals.'
  });

  const [wargameLogs, setWargameLogs] = useState<string[]>([
    '[WARGAME ENGINE] Initializing Dynamic AI Target System...',
    '[WARGAME ENGINE] AMAN AI Defense System deployed active mitigations.',
    `[TARGET] Port mutated to: ${activeScenario.dynamicPort} (Standard HTTP/HTTPS blocked)`,
    `[TARGET] Active Defense: ${activeScenario.activeMitigation}`
  ]);

  const [attemptInput, setAttemptInput] = useState('');
  const [score, setScore] = useState(0);

  const mutateTarget = () => {
    const ports = [8080, 8443, 9090, 4433, 2222];
    const mitigations = [
      'WAF Rule: Blocking SQL keywords (UNION, SELECT, SLEEP)',
      'Adaptive IP Ban (Fail2Ban 5-second interval)',
      'CSRF Token Mutation on every GET request',
      'Honeypot Decoy Service on port 80'
    ];
    const randomPort = ports[Math.floor(Math.random() * ports.length)];
    const randomMitigation = mitigations[Math.floor(Math.random() * mitigations.length)];

    setActiveScenario(prev => ({
      ...prev,
      dynamicPort: randomPort,
      activeMitigation: randomMitigation
    }));

    setWargameLogs(prev => [
      `[MUTATION ENGINE] Target mutated! Port changed to ${randomPort}`,
      `[MUTATION ENGINE] New Active Defense applied: ${randomMitigation}`,
      '[WARGAME ENGINE] Previous attack vectors invalidated by AI Defense.'
    ]);
  };

  const handleExecuteAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attemptInput.trim()) return;

    const cmd = attemptInput.trim();
    setAttemptInput('');
    setWargameLogs(prev => [...prev, `operator@wargame:~$ ${cmd}`]);

    setTimeout(() => {
      if (cmd.includes('--delay') || cmd.includes('-T2') || cmd.includes('hex_encode')) {
        setWargameLogs(prev => [
          ...prev,
          '[+] ATTACK SUCCESSFUL! Bypass technique identified.',
          `[+] Flag Captured: FLAG{AI_WARGAME_MUTATION_BYPASS_${Math.floor(Math.random() * 90000 + 10000)}}`
        ]);
        setScore(s => s + 150);
        addXp(150, 'Dynamic AI Wargame Victory');
      } else {
        setWargameLogs(prev => [
          ...prev,
          '[!] ATTACK BLOCKED BY AI DEFENSE ENGINE!',
          `[!] Reason: ${activeScenario.activeMitigation}`,
          '[!] Hint: Try adding stealth parameters like "--delay 5" or encoding payloads.'
        ]);
      }
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fadeIn text-slate-100">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-6 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                DYNAMIC AI RED VS BLUE WARGAME ARENA
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                NO STATIC WRITEUPS POSSIBLE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              AI Threat Mutation & Adaptive Wargame
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Unlike TryHackMe and Hack The Box where target machines have fixed vulnerabilities that can be copied from YouTube solutions, MY CYBER LAB's AI Wargame mutates target ports, WAF rules, and defensive mitigations in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={mutateTarget}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4 text-rose-400" /> MUTATE TARGET
            </button>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Arena Score</span>
              <span className="text-xl font-black text-rose-400">{score} PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE TARGET CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Dynamic Target</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            {activeScenario.name}
          </h3>
          <p className="text-xs text-slate-300">{activeScenario.objective}</p>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Mutated Port</span>
          <h3 className="text-2xl font-black font-mono text-cyan-400">
            PORT {activeScenario.dynamicPort}
          </h3>
          <p className="text-xs text-slate-400">Standard ports 80 & 22 are intercepted by honeypots.</p>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Active AI Mitigation</span>
          <h3 className="text-xs font-bold font-mono text-amber-400 bg-slate-950 p-2 rounded border border-amber-500/30">
            {activeScenario.activeMitigation}
          </h3>
          <p className="text-[11px] text-slate-400">AMAN AI Defense adapts to attack signatures.</p>
        </div>
      </div>

      {/* WARGAME TERMINAL CONSOLE */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[450px]">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-rose-400" />
            OPERATOR DYNAMIC WARGAME TERMINAL
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
            AI RED VS BLUE ACTIVE
          </span>
        </div>

        <div className="p-4 font-mono text-xs space-y-2 overflow-y-auto flex-1 text-slate-300">
          {wargameLogs.map((log, i) => (
            <div key={i} className={
              log.includes('SUCCESSFUL') ? 'text-emerald-400 font-bold' :
              log.includes('BLOCKED') ? 'text-rose-400 font-bold' :
              log.startsWith('operator@') ? 'text-cyan-400 font-bold' :
              'text-slate-300'
            }>
              {log}
            </div>
          ))}
        </div>

        <form onSubmit={handleExecuteAttempt} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-rose-400 font-mono text-xs font-bold">operator@wargame:~$</span>
          <input
            type="text"
            value={attemptInput}
            onChange={e => setAttemptInput(e.target.value)}
            placeholder='Try: nmap -p 8443 --delay 5 192.168.1.100'
            className="flex-1 bg-transparent text-xs font-mono text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-mono font-bold cursor-pointer transition-all"
          >
            EXECUTE
          </button>
        </form>
      </div>
    </div>
  );
};
