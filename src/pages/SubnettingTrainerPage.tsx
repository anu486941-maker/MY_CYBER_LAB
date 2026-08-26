import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_SUBNET_QUESTIONS, generateRandomSubnetQuestion } from '../data/mockData';
import { SubnetQuestion } from '../types';
import { 
  Binary, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Award, 
  Layers, 
  Info,
  XCircle,
  ArrowRight,
  Flame
} from 'lucide-react';

export const SubnettingTrainerPage: React.FC = () => {
  const { addXp, awardAchievement, profile } = useApp();
  
  const [currentQuestion, setCurrentQuestion] = useState<SubnetQuestion>(PRESET_SUBNET_QUESTIONS[0]);
  const [userNetAddress, setUserNetAddress] = useState<string>('');
  const [userBroadcast, setUserBroadcast] = useState<string>('');
  const [userFirstHost, setUserFirstHost] = useState<string>('');
  const [userLastHost, setUserLastHost] = useState<string>('');
  const [userUsableHosts, setUserUsableHosts] = useState<string>('');
  const [userSubnetMask, setUserSubnetMask] = useState<string>('');

  const [feedback, setFeedback] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    mistakes: string[];
    showHint: boolean;
    showExplanation: boolean;
  }>({
    submitted: false,
    isCorrect: false,
    mistakes: [],
    showHint: false,
    showExplanation: false
  });

  const [streakCount, setStreakCount] = useState<number>(0);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [mistakesHistory, setMistakesHistory] = useState<number>(0);

  // IP Identifier Game State
  const [ipGameAddress, setIpGameAddress] = useState<string>('192.168.1.10/24');
  const [ipGameClass, setIpGameClass] = useState<string>('Private (RFC 1918)');
  const [ipGameType, setIpGameType] = useState<string>('IPv4');
  const [ipGameNetPortion, setIpGameNetPortion] = useState<string>('192.168.1.0');
  const [ipGameFeedback, setIpGameFeedback] = useState<string | null>(null);

  const handleCheckAnswers = () => {
    const mistakes: string[] = [];

    if (userNetAddress.trim() !== currentQuestion.networkAddress) {
      mistakes.push(`Network Address: expected "${currentQuestion.networkAddress}", got "${userNetAddress || 'empty'}"`);
    }
    if (userBroadcast.trim() !== currentQuestion.broadcastAddress) {
      mistakes.push(`Broadcast Address: expected "${currentQuestion.broadcastAddress}", got "${userBroadcast || 'empty'}"`);
    }
    if (userFirstHost.trim() !== currentQuestion.firstUsableHost) {
      mistakes.push(`First Usable Host: expected "${currentQuestion.firstUsableHost}", got "${userFirstHost || 'empty'}"`);
    }
    if (userLastHost.trim() !== currentQuestion.lastUsableHost) {
      mistakes.push(`Last Usable Host: expected "${currentQuestion.lastUsableHost}", got "${userLastHost || 'empty'}"`);
    }
    if (parseInt(userUsableHosts.trim(), 10) !== currentQuestion.totalUsableHosts) {
      mistakes.push(`Total Usable Hosts: expected ${currentQuestion.totalUsableHosts}, got "${userUsableHosts || 'empty'}"`);
    }
    if (userSubnetMask.trim() !== currentQuestion.subnetMask) {
      mistakes.push(`Subnet Mask: expected "${currentQuestion.subnetMask}", got "${userSubnetMask || 'empty'}"`);
    }

    const isAllCorrect = mistakes.length === 0;

    if (isAllCorrect) {
      setStreakCount(prev => prev + 1);
      setTotalSolved(prev => prev + 1);
      addXp(100);
      awardAchievement('ach-6'); // Subnetting Solver
      awardAchievement('ach-networking-beginner'); // Networking Beginner
    } else {
      setStreakCount(0);
      setMistakesHistory(prev => prev + mistakes.length);
    }

    setFeedback({
      submitted: true,
      isCorrect: isAllCorrect,
      mistakes,
      showHint: false,
      showExplanation: isAllCorrect ? false : feedback.showExplanation
    });
  };

  const handleNextRandomQuestion = () => {
    const nextQ = generateRandomSubnetQuestion();
    setCurrentQuestion(nextQ);
    setUserNetAddress('');
    setUserBroadcast('');
    setUserFirstHost('');
    setUserLastHost('');
    setUserUsableHosts('');
    setUserSubnetMask('');
    setFeedback({
      submitted: false,
      isCorrect: false,
      mistakes: [],
      showHint: false,
      showExplanation: false
    });
  };

  const handleCheckIpGame = () => {
    // Basic IP game check
    if (ipGameClass === 'Private (RFC 1918)' && ipGameType === 'IPv4') {
      setIpGameFeedback('✓ Correct! 192.168.1.10 falls under RFC 1918 Class C private address space (192.168.0.0/16). +50 XP');
      addXp(50);
    } else {
      setIpGameFeedback('Incorrect classification. 192.168.0.0 - 192.168.255.255 is strictly Private under RFC 1918.');
    }
  };

  return (
    <div id="subnetting-trainer-page" className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
              PHASE 7 & 8 TRAINER
            </span>
            <span className="text-xs font-mono text-slate-500">• /24 THROUGH /30 CIDRs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Subnetting & IP Addressing Trainer
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Master IPv4 binary slicing, network boundaries, broadcast calculation, and host capacities.
          </p>
        </div>

        {/* Telemetry counters */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-amber-950/40 border border-amber-500/30 px-3 py-2 rounded-xl text-amber-400 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-amber-500/80 uppercase">Subnet Streak</div>
              <div className="text-sm font-bold">{streakCount} Correct</div>
            </div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 px-3 py-2 rounded-xl text-emerald-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-emerald-500/80 uppercase">Total Solved</div>
              <div className="text-sm font-bold">{totalSolved} Subnets</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Trainer Card (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            
            {/* Question Target Banner */}
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                  GIVEN IP & CIDR PREFIX:
                </span>
                <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40">
                  /{currentQuestion.cidr} PREFIX
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-mono font-extrabold text-cyan-400 tracking-wider">
                {currentQuestion.ipAddress} <span className="text-slate-500 font-normal">/{currentQuestion.cidr}</span>
              </div>

              {/* Binary Visualizer */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <Binary className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Bit-by-Bit Binary Representation (32 Bits):</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto custom-scrollbar">
                  <div className="flex items-center gap-1 font-bold">
                    <span className="text-emerald-400" title="Network Bits">{currentQuestion.binaryIp.slice(0, currentQuestion.cidr + Math.floor(currentQuestion.cidr/8))}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-cyan-400" title="Host Bits">{currentQuestion.binaryIp.slice(currentQuestion.cidr + Math.floor(currentQuestion.cidr/8))}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-3">
                    <span className="text-emerald-400">■ {currentQuestion.cidr} Network Bits</span>
                    <span className="text-cyan-400">■ {32 - currentQuestion.cidr} Host Bits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  1. Network Address (ID):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.0"
                  value={userNetAddress}
                  onChange={(e) => setUserNetAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  2. Broadcast Address:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.255"
                  value={userBroadcast}
                  onChange={(e) => setUserBroadcast(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  3. First Usable Host:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.1"
                  value={userFirstHost}
                  onChange={(e) => setUserFirstHost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  4. Last Usable Host:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.254"
                  value={userLastHost}
                  onChange={(e) => setUserLastHost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  5. Total Usable Hosts:
                </label>
                <input
                  type="number"
                  placeholder="e.g. 254"
                  value={userUsableHosts}
                  onChange={(e) => setUserUsableHosts(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  6. Subnet Mask:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 255.255.255.0"
                  value={userSubnetMask}
                  onChange={(e) => setUserSubnetMask(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

            </div>

            {/* Feedback & Result Alert */}
            {feedback.submitted && (
              <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
                feedback.isCorrect 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {feedback.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>CORRECT! +100 XP AWARDED</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>{feedback.mistakes.length} CALCULATION ERROR(S) DETECTED</span>
                    </>
                  )}
                </div>

                {!feedback.isCorrect && (
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                    {feedback.mistakes.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Hint / Explanation panels */}
            {feedback.showHint && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  SUBNET CALCULATION HINT:
                </div>
                <p className="text-slate-300">
                  Host bits = 32 - {currentQuestion.cidr} = {32 - currentQuestion.cidr}. Total IPs = 2^{32 - currentQuestion.cidr} = {Math.pow(2, 32 - currentQuestion.cidr)}.
                  Usable hosts = Total IPs - 2. Block size in 4th octet = {Math.pow(2, 32 - currentQuestion.cidr)}.
                </p>
              </div>
            )}

            {feedback.showExplanation && (
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 font-mono text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-purple-400" />
                  FULL MATHEMATICAL STEP-BY-STEP EXPLANATION:
                </div>
                <div className="text-slate-300 space-y-1 text-xs">
                  <p>1. <strong>Mask</strong>: /{currentQuestion.cidr} has {currentQuestion.cidr} ones in binary = <code>{currentQuestion.subnetMask}</code>.</p>
                  <p>2. <strong>Block Size</strong>: 256 - {parseInt(currentQuestion.subnetMask.split('.')[3], 10)} = {Math.pow(2, 32 - currentQuestion.cidr)}.</p>
                  <p>3. <strong>Network ID</strong>: The 4th octet starts at the lower block boundary = <code>{currentQuestion.networkAddress}</code>.</p>
                  <p>4. <strong>Broadcast</strong>: Network ID + block size - 1 = <code>{currentQuestion.broadcastAddress}</code>.</p>
                  <p>5. <strong>Usable Range</strong>: <code>{currentQuestion.firstUsableHost}</code> to <code>{currentQuestion.lastUsableHost}</code> ({currentQuestion.totalUsableHosts} hosts).</p>
                </div>
              </div>
            )}

            {/* Buttons Row: Check, Hint, Explain, Try Another */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={handleCheckAnswers}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                CHECK
              </button>

              <button
                onClick={() => setFeedback(prev => ({ ...prev, showHint: !prev.showHint }))}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                HINT
              </button>

              <button
                onClick={() => setFeedback(prev => ({ ...prev, showExplanation: !prev.showExplanation }))}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5 text-purple-400" />
                EXPLAIN
              </button>

              <button
                onClick={handleNextRandomQuestion}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                TRY ANOTHER
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: IP Address Classifier Game */}
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold">
                PHASE 7 GAME
              </span>
              <h3 className="text-base font-mono font-bold text-slate-100">
                IP Address Classifier
              </h3>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Quickly categorize addresses as Public vs Private, loopback, or multicast.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center">
              <div className="text-[10px] text-slate-500 uppercase">Target Address</div>
              <div className="text-xl font-bold text-cyan-400">{ipGameAddress}</div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Address Type:</label>
                <select
                  value={ipGameClass}
                  onChange={(e) => setIpGameClass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs font-mono"
                >
                  <option value="Private (RFC 1918)">Private (RFC 1918: 10.x, 172.16.x, 192.168.x)</option>
                  <option value="Public Routable">Public Internet Routable</option>
                  <option value="Loopback (127.0.0.1)">Loopback (127.0.0.0/8)</option>
                  <option value="Link-Local (APIPA 169.254.x)">Link-Local (APIPA 169.254.x)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">IP Protocol Version:</label>
                <select
                  value={ipGameType}
                  onChange={(e) => setIpGameType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs font-mono"
                >
                  <option value="IPv4">IPv4 (32-bit Dotted Decimal)</option>
                  <option value="IPv6">IPv6 (128-bit Hexadecimal)</option>
                </select>
              </div>

              <button
                onClick={handleCheckIpGame}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-100 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                SUBMIT CLASSIFICATION (+50 XP)
              </button>

              {ipGameFeedback && (
                <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                  {ipGameFeedback}
                </div>
              )}
            </div>

          </div>

          {/* CIDR Cheatsheet Quick Reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Quick CIDR Host Reference
            </h4>
            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-cyan-400 font-bold">/24</span>
                <span>255.255.255.0</span>
                <span className="text-slate-300">254 Hosts</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-cyan-400 font-bold">/26</span>
                <span>255.255.255.192</span>
                <span className="text-slate-300">62 Hosts</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-cyan-400 font-bold">/28</span>
                <span>255.255.255.240</span>
                <span className="text-slate-300">14 Hosts</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-cyan-400 font-bold">/30</span>
                <span>255.255.255.252</span>
                <span className="text-slate-300">2 Hosts (P2P)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
