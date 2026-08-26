import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  ShieldAlert, 
  Swords, 
  Activity, 
  Clock, 
  Terminal, 
  Check, 
  X, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  Award,
  Play,
  Flame,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface KotHPlayer {
  id: string;
  name: string;
  score: number;
  isKing: boolean;
  avatar: string;
  rank: number;
  status: 'online' | 'attacking' | 'defending';
}

interface KotHEvent {
  id: string;
  timestamp: string;
  message: string;
  type: 'king_change' | 'exploit' | 'defense' | 'points';
}

interface TryHackMeKingOfTheHillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TryHackMeKingOfTheHillModal: React.FC<TryHackMeKingOfTheHillModalProps> = ({
  isOpen,
  onClose
}) => {
  const { profile, currentUser, addXp } = useApp();
  const playerName = profile?.name || currentUser?.displayName || 'Operator';

  const [players, setPlayers] = useState<KotHPlayer[]>([
    { id: 'p1', name: playerName, score: 340, isKing: true, avatar: '👑', rank: 1, status: 'defending' },
    { id: 'p2', name: 'ZeroCool', score: 280, isKing: false, avatar: '⚡', rank: 2, status: 'attacking' },
    { id: 'p3', name: 'AcidBurn', score: 210, isKing: false, avatar: '🔥', rank: 3, status: 'attacking' },
    { id: 'p4', name: 'LordNikon', score: 140, isKing: false, avatar: '👁️', rank: 4, status: 'online' },
  ]);

  const [events, setEvents] = useState<KotHEvent[]>([
    { id: 'e1', timestamp: '12:44:10', message: `👑 ${playerName} executed echo "${playerName}" > /root/king.txt and claimed the Hill!`, type: 'king_change' },
    { id: 'e2', timestamp: '12:44:25', message: `🛡️ ${playerName} secured SSH and changed root credentials (+50 Def PTS)`, type: 'defense' },
    { id: 'e3', timestamp: '12:45:00', message: `⭐ Point Tick: ${playerName} held the Hill for 60s (+10 PTS)`, type: 'points' },
    { id: 'e4', timestamp: '12:45:18', message: `⚠️ ZeroCool launched SQLMap against Citadel web portal (10.10.199.50)`, type: 'exploit' },
  ]);

  const [roundSecondsRemaining, setRoundSecondsRemaining] = useState<number>(1640);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[KOTH_ENGINE] Connected to Citadel Arena machine: 10.10.199.50',
    '[KOTH_ENGINE] Target flag destination: /root/king.txt',
    `[STATUS] You currently control the Hill! Prevent other players from overwriting /root/king.txt.`
  ]);

  useEffect(() => {
    if (!isOpen) return;

    // Simulation ticker for points and competitor actions
    const interval = setInterval(() => {
      setRoundSecondsRemaining(prev => Math.max(prev - 1, 0));

      // Random bot event every 12 seconds
      if (Math.random() < 0.25) {
        const botNames = ['ZeroCool', 'AcidBurn', 'LordNikon'];
        const randomBot = botNames[Math.floor(Math.random() * botNames.length)];
        const actions = [
          `⚠️ ${randomBot} attempted SUID binary exploit on /usr/bin/find!`,
          `⚔️ ${randomBot} scanned Citadel ports with Nmap -sV`,
          `🛡️ System hardening check executed by KotH daemon.`
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];

        setEvents(prev => [
          {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            message: randomAction,
            type: 'exploit'
          },
          ...prev.slice(0, 15)
        ]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, playerName]);

  if (!isOpen) return null;

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalLogs(prev => [...prev, `operator@koth-citadel:~$ ${cmd}`]);
    setTerminalInput('');

    // Handle common KotH commands
    if (cmd.includes('king.txt')) {
      setTerminalLogs(prev => [
        ...prev,
        `[SUCCESS] /root/king.txt updated with "${playerName}". Flag locked with chattr +i.`,
        `[SCORE] You earned +100 KotH Tactical XP!`
      ]);
      addXp(100);
      setEvents(prev => [
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          message: `👑 ${playerName} reaffirmed Hill ownership in /root/king.txt!`,
          type: 'king_change'
        },
        ...prev
      ]);
    } else if (cmd.includes('passwd') || cmd.includes('iptables') || cmd.includes('patch')) {
      setTerminalLogs(prev => [
        ...prev,
        `[DEFENSE] Hardening policy applied. Ingress attacks mitigated.`,
        `[DEFENSE] +50 Defense Points awarded!`
      ]);
      addXp(50);
    } else {
      setTerminalLogs(prev => [
        ...prev,
        `[KOTH_TERMINAL] Command executed on Citadel sandbox target.`
      ]);
    }
  };

  const handleQuickDefense = (action: string) => {
    setTerminalLogs(prev => [
      ...prev,
      `[QUICK_ACTION] Executing defensive protocol: ${action}...`,
      `[SUCCESS] Defensive rule active. +50 XP`
    ]);
    addXp(50);
    setEvents(prev => [
      {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        message: `🛡️ ${playerName} triggered defense protocol: ${action}`,
        type: 'defense'
      },
      ...prev
    ]);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-red-500/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shadow-lg shadow-red-950/50">
              <Crown className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-sm text-slate-100 flex items-center gap-2">
                  KING OF THE HILL (KotH) ARENA
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-500/30">
                    LIVE MATCH
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400">Target: Citadel (10.10.199.50) • Control /root/king.txt & patch weaknesses</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
              <Clock className="w-4 h-4 text-red-400" />
              <span className="font-bold text-red-300">{formatTimer(roundSecondsRemaining)}</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Top Scoreboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {players.map((p) => (
              <div
                key={p.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  p.isKing
                    ? 'bg-red-950/40 border-red-500/60 ring-1 ring-red-500/40 shadow-lg shadow-red-950/40'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">{p.avatar}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    p.isKing ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {p.isKing ? 'ACTIVE KING' : `RANK #${p.rank}`}
                  </span>
                </div>
                <div className="font-mono font-bold text-xs text-slate-200 truncate">{p.name}</div>
                <div className="font-mono text-sm font-bold text-cyan-400 mt-0.5">{p.score} PTS</div>
              </div>
            ))}
          </div>

          {/* Quick Defense Action Triggers */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Tactical KotH Defense Directives (Click to Execute)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleQuickDefense('Patch LFI in /var/www/html/portal.php')}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-mono font-bold text-emerald-300">1. Patch Web LFI</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Sanitize file inclusion vector</div>
              </button>

              <button
                onClick={() => handleQuickDefense('Lock down SUID binaries (chmod u-s /usr/bin/find)')}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-mono font-bold text-cyan-300">2. Remove Dangerous SUID</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Strip suid bit from find/nmap</div>
              </button>

              <button
                onClick={() => handleQuickDefense('Apply Immutable Flag: chattr +i /root/king.txt')}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-500/40 text-left transition-all cursor-pointer"
              >
                <div className="text-xs font-mono font-bold text-red-300">3. Lock /root/king.txt</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Prevent competitors from writing</div>
              </button>
            </div>
          </div>

          {/* KotH Live Event Log & Terminal Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Live Match Feed */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 flex flex-col h-64">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Activity className="w-3.5 h-3.5 text-red-400" />
                Live KotH Telemetry Feed
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {events.map((e) => (
                  <div key={e.id} className="text-xs font-mono p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-start gap-2">
                    <span className="text-[10px] text-slate-500 shrink-0">{e.timestamp}</span>
                    <span className="text-slate-300">{e.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KotH Target Shell */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 flex flex-col h-64">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Citadel Root Shell (10.10.199.50)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">UID=0(root)</span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-xs text-slate-300 space-y-1 pr-1 custom-scrollbar">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="text-slate-300">{log}</div>
                ))}
              </div>
              <form onSubmit={handleExecuteCommand} className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder='e.g. echo "Operator" > /root/king.txt'
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-slate-950 font-mono font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Hold the King position until round timer expires to secure victory!
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs transition-colors cursor-pointer"
          >
            Leave Arena
          </button>
        </div>

      </div>
    </div>
  );
};
