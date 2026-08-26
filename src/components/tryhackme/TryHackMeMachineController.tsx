import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Plus, 
  Copy, 
  Check, 
  Shield, 
  Terminal, 
  Radio, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Server,
  Zap,
  Globe
} from 'lucide-react';
import { TryHackMeOpenVpnModal } from './TryHackMeOpenVpnModal';

interface TryHackMeMachineControllerProps {
  roomTitle: string;
  defaultIp?: string;
  onIpGenerated?: (ip: string) => void;
  onAttackBoxToggle?: () => void;
  isAttackBoxActive?: boolean;
}

export const TryHackMeMachineController: React.FC<TryHackMeMachineControllerProps> = ({
  roomTitle,
  defaultIp = '10.10.142.88',
  onIpGenerated,
  onAttackBoxToggle,
  isAttackBoxActive = false
}) => {
  const [machineStatus, setMachineStatus] = useState<'OFFLINE' | 'STARTING' | 'ACTIVE' | 'TERMINATED'>('OFFLINE');
  const [targetIp, setTargetIp] = useState<string>('');
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(3600); // 1 hour
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isOpenVpnModalOpen, setIsOpenVpnModalOpen] = useState<boolean>(false);
  const [provisionProgress, setProvisionProgress] = useState<number>(0);

  // Countdown timer when active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (machineStatus === 'ACTIVE' && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            setMachineStatus('TERMINATED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [machineStatus, timeRemainingSeconds]);

  const handleDeployMachine = () => {
    setMachineStatus('STARTING');
    setProvisionProgress(15);

    setTimeout(() => setProvisionProgress(45), 600);
    setTimeout(() => setProvisionProgress(80), 1200);

    setTimeout(() => {
      setMachineStatus('ACTIVE');
      setProvisionProgress(100);
      setTargetIp(defaultIp);
      setTimeRemainingSeconds(3600);
      if (onIpGenerated) {
        onIpGenerated(defaultIp);
      }
    }, 1800);
  };

  const handleTerminateMachine = () => {
    setMachineStatus('OFFLINE');
    setTargetIp('');
    setTimeRemainingSeconds(3600);
  };

  const handleResetMachine = () => {
    setMachineStatus('STARTING');
    setProvisionProgress(25);
    setTimeout(() => {
      setMachineStatus('ACTIVE');
      setProvisionProgress(100);
      setTimeRemainingSeconds(3600);
    }, 1500);
  };

  const handleExtendTimer = () => {
    setTimeRemainingSeconds(prev => Math.min(prev + 900, 7200)); // Add 15 mins (up to 2 hrs max)
  };

  const handleCopyIp = () => {
    if (!targetIp) return;
    navigator.clipboard.writeText(targetIp);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          
          {/* Left: Machine Info & Status */}
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
              machineStatus === 'ACTIVE'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-950/50'
                : machineStatus === 'STARTING'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-400 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <Server className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Target Cyber Range Machine
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  machineStatus === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : machineStatus === 'STARTING'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  ● {machineStatus}
                </span>
              </div>

              {machineStatus === 'ACTIVE' ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm font-bold text-cyan-300 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-cyan-500/40">
                    {targetIp}
                  </span>
                  <button
                    onClick={handleCopyIp}
                    className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                    title="Copy Target IP"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    (Vulnerable target accessible via OpenVPN or AttackBox)
                  </span>
                </div>
              ) : machineStatus === 'STARTING' ? (
                <div className="flex items-center gap-2 mt-1 text-xs text-amber-400 font-mono">
                  <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full transition-all duration-300"
                      style={{ width: `${provisionProgress}%` }}
                    />
                  </div>
                  <span>Provisioning VM sandbox ({provisionProgress}%)...</span>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">
                  Deploy your private isolated vulnerable machine to start practical tasks.
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions & Timer */}
          <div className="flex flex-wrap items-center gap-2.5">
            {machineStatus === 'ACTIVE' && (
              <>
                {/* Timer Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className={timeRemainingSeconds < 300 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-200'}>
                    {formatTimer(timeRemainingSeconds)}
                  </span>
                  <button
                    onClick={handleExtendTimer}
                    className="ml-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-cyan-300 font-bold border border-slate-700 transition-colors"
                    title="Add 15 minutes to session"
                  >
                    +15m
                  </button>
                </div>

                {/* Reset Sandbox Button */}
                <button
                  onClick={handleResetMachine}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Reset VM state"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                {/* Terminate Machine Button */}
                <button
                  onClick={handleTerminateMachine}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/40 text-xs font-mono font-bold text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Terminate VM"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Terminate</span>
                </button>
              </>
            )}

            {machineStatus === 'OFFLINE' && (
              <button
                onClick={handleDeployMachine}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Start Target Machine
              </button>
            )}

            {/* Access Mode / OpenVPN button */}
            <button
              onClick={() => setIsOpenVpnModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="OpenVPN Access Config"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Access / OpenVPN</span>
            </button>

            {/* In-Browser AttackBox Toggle */}
            {onAttackBoxToggle && (
              <button
                onClick={onAttackBoxToggle}
                className={`px-3.5 py-2 rounded-xl border font-mono font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAttackBoxActive
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
                title="Toggle Web AttackBox Split Screen"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>AttackBox</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* OpenVPN Modal */}
      <TryHackMeOpenVpnModal
        isOpen={isOpenVpnModalOpen}
        onClose={() => setIsOpenVpnModalOpen(false)}
      />
    </>
  );
};
