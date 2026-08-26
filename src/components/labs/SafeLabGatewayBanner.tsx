import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Server, 
  Cpu, 
  HardDrive, 
  Clock, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Activity,
  Terminal,
  Info,
  Layers,
  ArrowRight,
  WifiOff
} from 'lucide-react';

interface SafeLabGatewayProps {
  labName: string;
  targetHost?: string;
  targetIp?: string;
  allocatedTimeMinutes?: number;
  onResetLab?: () => void;
}

export const SafeLabGatewayBanner: React.FC<SafeLabGatewayProps> = ({
  labName,
  targetHost = 'training-target.local',
  targetIp = '10.10.14.25',
  allocatedTimeMinutes = 45,
  onResetLab
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(allocatedTimeMinutes * 60);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [showArchDetails, setShowArchDetails] = useState<boolean>(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setSecondsRemaining(allocatedTimeMinutes * 60);
      setIsResetting(false);
      if (onResetLab) onResetLab();
    }, 600);
  };

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl">
      
      {/* Top Bar: Sandbox Status & Isolation Telemetry */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        
        {/* Left: Mode Badge & Target */}
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SIMULATION SANDBOX ACTIVE
          </div>

          <div className="text-xs font-mono text-slate-400">
            Target: <span className="text-cyan-300 font-semibold">{targetHost}</span> ({targetIp})
          </div>
        </div>

        {/* Right: Timer & Reset */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            <span>SESSION: {formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={handleReset}
            disabled={isResetting}
            className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Reset training environment state to clean baseline"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>RESET LAB</span>
          </button>
        </div>

      </div>

      {/* Ephemeral Environment Resource Constraints */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">CPU LIMIT</div>
            <div className="text-slate-200 font-bold">0.5 vCPU (Capped)</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
          <Server className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">RAM LIMIT</div>
            <div className="text-slate-200 font-bold">512 MB (Isolated)</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
          <HardDrive className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">STORAGE</div>
            <div className="text-slate-200 font-bold">2 GB Overlay (Ephemeral)</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">NETWORK</div>
            <div className="text-slate-200 font-bold">Isolated Bridge (No WAN)</div>
          </div>
        </div>

      </div>

      {/* Architecture Pathway Flow */}
      <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-300 font-bold">SECURE PATH:</span>
          <span className="text-cyan-400 font-semibold">Learner Client</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-purple-400 font-semibold">Lab Gateway</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-400 font-semibold">Isolated Sandbox</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-amber-400 font-semibold">Private Range Target</span>
        </div>

        <button
          onClick={() => setShowArchDetails(!showArchDetails)}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer flex items-center gap-1"
        >
          <Info className="w-3 h-3" />
          {showArchDetails ? 'Hide Security Rules' : 'View Isolation Rules'}
        </button>
      </div>

      {/* Collapsible Security & Safety Assurance */}
      {showArchDetails && (
        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/20 text-xs font-sans text-slate-300 space-y-2">
          <div className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> LAB SAFETY & NON-EXPOSURE PROTOCOL
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
            <li>All commands execute strictly in this ephemeral browser session or private sandbox.</li>
            <li>No vulnerable ports or target services are exposed to the public internet.</li>
            <li>Host operating system is completely isolated from guest terminal execution.</li>
            <li>Session automatically resets upon timer expiration or when you click "RESET LAB".</li>
          </ul>
        </div>
      )}

    </div>
  );
};
