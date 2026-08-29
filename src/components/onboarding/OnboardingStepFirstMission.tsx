import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Terminal, Award, Sparkles, Trophy, Bot, Play, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OnboardingStepFirstMissionProps {
  onCompleteOnboarding: () => void;
}

export const OnboardingStepFirstMission: React.FC<OnboardingStepFirstMissionProps> = ({
  onCompleteOnboarding
}) => {
  const { addXp, awardAchievement, updateSkillMastery } = useApp();

  const [missionPhase, setMissionPhase] = useState<'LEARN' | 'PRACTICE' | 'LAB' | 'CHALLENGE' | 'SUCCESS'>('LEARN');
  
  // Terminal state for hands-on simulation
  const [commandInput, setCommandInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; output: string }>>([
    { cmd: 'sys.init', output: 'MCL Terminal v5.2 Session Ready. Type "help" or recommended commands.' }
  ]);
  const [discoveredFlag, setDiscoveredFlag] = useState<boolean>(false);
  const [submittedFlag, setSubmittedFlag] = useState<string>('');
  const [flagError, setFlagError] = useState<string | null>(null);

  const EXPECTED_FLAG = 'MCL{first_step_completed}';

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = commandInput.trim();
    if (!rawCmd) return;

    let output = '';
    const cmdLower = rawCmd.toLowerCase();

    if (cmdLower === 'help') {
      output = 'Available commands: whoami, pwd, ls, ls -la, cat evidence.txt, cat flag.txt, clear, help';
    } else if (cmdLower === 'whoami') {
      output = 'operator (uid=1000 gid=1000 groups=1000(cybercadet))';
      if (missionPhase === 'PRACTICE') {
        // progress to LAB phase
        setTimeout(() => setMissionPhase('LAB'), 800);
      }
    } else if (cmdLower === 'pwd') {
      output = '/home/operator/recon_sandbox';
    } else if (cmdLower === 'ls' || cmdLower === 'ls -l') {
      output = 'notes.txt  target_ip.txt  evidence.txt';
    } else if (cmdLower === 'ls -la' || cmdLower === 'ls -a') {
      output = 'total 24\ndrwxr-xr-x 2 operator operator 4096 Aug 29 12:00 .\ndrwxr-xr-x 4 operator operator 4096 Aug 29 11:58 ..\n-rw-r--r-- 1 operator operator  142 Aug 29 12:01 evidence.txt\n-rw-r--r-- 1 operator operator   45 Aug 29 12:00 notes.txt\n-rw-r--r-- 1 operator operator   16 Aug 29 12:00 target_ip.txt';
    } else if (cmdLower === 'cat evidence.txt' || cmdLower === 'cat flag.txt') {
      output = `[EVIDENCE CAPTURED]\nTarget verification token found:\n${EXPECTED_FLAG}\n\nCopy this token and submit in the Challenge box below!`;
      setDiscoveredFlag(true);
      if (missionPhase === 'LAB') {
        setMissionPhase('CHALLENGE');
      }
    } else if (cmdLower === 'cat notes.txt') {
      output = 'Target assessment: Find the operator evidence token in this directory and verify your terminal readiness.';
    } else if (cmdLower === 'clear') {
      setCommandHistory([]);
      setCommandInput('');
      return;
    } else {
      output = `zsh: command not found: ${rawCmd}. Try "whoami", "ls -la", or "cat evidence.txt".`;
    }

    setCommandHistory(prev => [...prev, { cmd: rawCmd, output }]);
    setCommandInput('');
  };

  const handleVerifyFlag = () => {
    setFlagError(null);
    if (submittedFlag.trim() === EXPECTED_FLAG) {
      if (missionPhase !== 'SUCCESS') {
        // Idempotently award First Step badge and its +100 XP reward
        awardAchievement('ach-first-step');
        updateSkillMastery('skill-linux-terminal', {
          masteryPercentage: 65,
          confidence: 'COMPETENT',
          practiceCompleted: true,
          missionCompleted: true
        });
        setMissionPhase('SUCCESS');
      }
    } else {
      setFlagError('Invalid token. Run "cat evidence.txt" in the terminal above to inspect the exact token.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 animate-fadeIn">
      {/* Top Mission Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-1.5">
              <span>FIRST MISSION: OPERATION ZERO STEP</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h2 className="text-xl font-mono font-bold text-white">
              Terminal Reconnaissance & Token Extraction
            </h2>
          </div>
        </div>

        {/* Phase Pill */}
        <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">PHASE:</span>
          <span className="text-cyan-400 font-bold">{missionPhase}</span>
        </div>
      </div>

      {/* SUCCESS STAGE */}
      {missionPhase === 'SUCCESS' ? (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950/80 to-slate-950/80 border border-emerald-500/40 text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase block">
              MISSION 1 COMPLETED SUCCESSFULLY!
            </span>
            <h3 className="text-2xl font-mono font-bold text-white">
              First Cybersecurity Achievement Unlocked
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
              You executed your first terminal reconnaissance, inspected file systems, and captured your initial verification evidence.
            </p>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">XP EARNED</span>
              <span className="text-lg font-bold text-emerald-400">+100 XP</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">BADGE UNLOCKED</span>
              <span className="text-sm font-bold text-cyan-300">FIRST STEP 🎖️</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">SKILL UPDATED</span>
              <span className="text-sm font-bold text-indigo-300">Linux Terminal</span>
            </div>
          </div>

          {/* Final CTA to Dashboard */}
          <button
            onClick={onCompleteOnboarding}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 hover:opacity-90 text-slate-950 font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <span>PROCEED TO MY CYBER LAB DASHBOARD</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      ) : (
        /* INTERACTIVE MISSION PHASES */
        <div className="space-y-4">
          {/* Mission Briefing Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-sans">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold uppercase">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AMAN MISSION BRIEFING:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Every cybersecurity operator begins by learning the terminal. Your objective:
              1) Check your identity with <code className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono">whoami</code>.
              2) List directory files with <code className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono">ls -la</code>.
              3) Read the evidence file with <code className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono">cat evidence.txt</code>.
              4) Submit the captured token below.
            </p>
          </div>

          {/* Simulated In-Browser Terminal */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs shadow-inner">
            {/* Terminal Topbar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[11px] text-slate-400 font-bold ml-2">mcl-operator@recon-box:~</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-bold">ONLINE</span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 space-y-2 min-h-[160px] max-h-[220px] overflow-y-auto custom-scrollbar">
              {commandHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <span>operator@mcl:~$</span>
                    <span className="text-white">{item.cmd}</span>
                  </div>
                  {item.output && (
                    <div className="text-slate-300 whitespace-pre-wrap pl-2 border-l border-slate-800 leading-relaxed">
                      {item.output}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Terminal Input Row */}
            <form onSubmit={handleRunCommand} className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center gap-2">
              <span className="text-cyan-400 font-bold">operator@mcl:~$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type command (e.g. whoami, ls -la, cat evidence.txt)..."
                className="flex-1 bg-transparent text-white focus:outline-hidden text-xs font-mono placeholder:text-slate-600"
                autoFocus
              />
              <button
                type="submit"
                className="py-1.5 px-3 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-bold text-[11px] transition-all cursor-pointer"
              >
                EXECUTE
              </button>
            </form>
          </div>

          {/* Quick Helper Command Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 text-[11px]">Quick Execute:</span>
            <button
              onClick={() => { setCommandInput('whoami'); }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              whoami
            </button>
            <button
              onClick={() => { setCommandInput('ls -la'); }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              ls -la
            </button>
            <button
              onClick={() => { setCommandInput('cat evidence.txt'); }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              cat evidence.txt
            </button>
          </div>

          {/* Flag Submission Area */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>SUBMIT EVIDENCE TOKEN:</span>
              </span>
              {discoveredFlag && (
                <span className="text-[10px] text-emerald-400 font-bold">TOKEN DISCOVERED IN TERMINAL</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={submittedFlag}
                onChange={(e) => setSubmittedFlag(e.target.value)}
                placeholder="MCL{...}"
                className="w-full sm:flex-1 py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-cyan-400"
              />
              <button
                onClick={handleVerifyFlag}
                disabled={!submittedFlag.trim()}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
              >
                SUBMIT TOKEN
              </button>
            </div>

            {flagError && (
              <p className="text-red-400 text-xs">{flagError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
