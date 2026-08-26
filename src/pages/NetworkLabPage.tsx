import React, { useState } from 'react';
import { NETWORK_LAB_DEVICES } from '../data/mockData';
import { NetworkDevice } from '../types';
import { 
  Network, 
  Server, 
  Laptop, 
  Router, 
  ShieldAlert, 
  Radio, 
  Terminal, 
  Activity, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  Send,
  Zap,
  Globe
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const NetworkLabPage: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice>(NETWORK_LAB_DEVICES[0]);
  const [pingTarget, setPingTarget] = useState<string>('192.168.1.1');
  const [pingLogs, setPingLogs] = useState<string[]>([]);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  // Subnetting calculator state
  const [cidrInput, setCidrInput] = useState<string>('192.168.1.0/24');
  const [calcResult, setCalcResult] = useState({
    netMask: '255.255.255.0',
    netId: '192.168.1.0',
    broadcast: '192.168.1.255',
    usableRange: '192.168.1.1 - 192.168.1.254',
    totalHosts: 256,
    usableHosts: 254
  });

  const handleSimulatePing = () => {
    if (!pingTarget.trim() || isPinging) return;
    setIsPinging(true);
    setPingLogs([
      `PING ${pingTarget} (56 data bytes)...`,
      `64 bytes from ${pingTarget}: icmp_seq=1 ttl=64 time=0.421 ms`,
      `64 bytes from ${pingTarget}: icmp_seq=2 ttl=64 time=0.388 ms`,
      `64 bytes from ${pingTarget}: icmp_seq=3 ttl=64 time=0.412 ms`,
      `--- ${pingTarget} ping statistics ---`,
      `3 packets transmitted, 3 received, 0% packet loss, rtt min/avg/max = 0.388/0.407/0.421 ms`
    ]);
    setTimeout(() => {
      setIsPinging(false);
    }, 600);
  };

  const calculateSubnet = (input: string) => {
    setCidrInput(input);
    const prefix = parseInt(input.split('/')[1] || '24', 10);
    const total = Math.pow(2, 32 - prefix);
    const usable = Math.max(0, total - 2);
    
    let mask = '255.255.255.0';
    if (prefix === 28) mask = '255.255.255.240';
    if (prefix === 26) mask = '255.255.255.192';
    if (prefix === 30) mask = '255.255.255.252';
    if (prefix === 16) mask = '255.255.0.0';

    setCalcResult({
      netMask: mask,
      netId: input.split('/')[0] || '192.168.1.0',
      broadcast: prefix === 24 ? '192.168.1.255' : '192.168.1.x',
      usableRange: `192.168.1.1 - 192.168.1.${usable}`,
      totalHosts: total,
      usableHosts: usable
    });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/30 text-blue-400 font-mono text-xs font-semibold">
              LAB SIMULATION
            </span>
            <StatusBadge type="simulation" label="SIMULATION PREVIEW" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Interactive Networking Laboratory
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Inspect subnet boundaries, Layer 2 MAC addresses, Layer 3 routing, and open port daemons.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>VIRTUAL SUBNET: 192.168.1.0/24</span>
        </div>
      </div>

      {/* Network Topology Visualizer */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <h2 className="font-mono font-bold text-sm text-slate-100 uppercase">
              NETWORK TOPOLOGY MAP (CLICK ANY NODE TO INSPECT)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Layer 2 / Layer 3 Schematic</span>
        </div>

        {/* Diagram Area */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
          
          {/* Node 1: Student Machine */}
          <button
            onClick={() => setSelectedDevice(NETWORK_LAB_DEVICES[0])}
            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 cursor-pointer ${
              selectedDevice.id === NETWORK_LAB_DEVICES[0].id
                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Laptop className="w-8 h-8 text-cyan-400" />
            <div className="font-mono font-bold text-xs text-slate-100">STUDENT MACHINE</div>
            <div className="text-[11px] font-mono text-cyan-400 font-semibold">192.168.1.10</div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              eth0 / Workstation
            </span>
          </button>

          {/* Connection 1 */}
          <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
            <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/50" />
            <span className="text-[10px] font-mono text-slate-400 mt-1">Ethernet Cat6</span>
          </div>

          {/* Node 2: Gateway Router */}
          <button
            onClick={() => setSelectedDevice(NETWORK_LAB_DEVICES[1])}
            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 cursor-pointer ${
              selectedDevice.id === NETWORK_LAB_DEVICES[1].id
                ? 'bg-blue-950/60 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Router className="w-8 h-8 text-blue-400" />
            <div className="font-mono font-bold text-xs text-slate-100">ROUTER / GATEWAY</div>
            <div className="text-[11px] font-mono text-blue-400 font-semibold">192.168.1.1</div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              Default Route
            </span>
          </button>

          {/* Connection 2 */}
          <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
            <div className="w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50" />
            <span className="text-[10px] font-mono text-slate-400 mt-1">VLAN 10 Trunk</span>
          </div>

          {/* Target Cluster Selector */}
          <div className="space-y-2">
            {[NETWORK_LAB_DEVICES[2], NETWORK_LAB_DEVICES[3], NETWORK_LAB_DEVICES[4]].map(dev => (
              <button
                key={dev.id}
                onClick={() => setSelectedDevice(dev)}
                className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  selectedDevice.id === dev.id
                    ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-mono font-bold text-slate-200 truncate">{dev.name}</div>
                    <div className="text-[10px] font-mono text-cyan-400">{dev.ip}</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400">
                  {dev.role.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Two Column Section: Device Inspector Panel & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Device Detailed Inspector (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  DEVICE INSPECTION TELEMETRY
                </span>
                <h3 className="text-xl font-mono font-bold text-slate-100 mt-1">
                  {selectedDevice.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedDevice.description}</p>
              </div>

              <StatusBadge type="simulation" label={selectedDevice.status.toUpperCase()} />
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">IPv4 ADDRESS</span>
                <span className="text-xs font-mono font-bold text-cyan-400">{selectedDevice.ip}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">HARDWARE MAC</span>
                <span className="text-xs font-mono font-bold text-slate-300">{selectedDevice.mac}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">SUBNET MASK</span>
                <span className="text-xs font-mono font-bold text-slate-300">{selectedDevice.subnetMask}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">DEVICE ROLE</span>
                <span className="text-xs font-mono font-bold text-purple-400">{selectedDevice.role}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 sm:col-span-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">OPERATING SYSTEM / FIRMWARE</span>
                <span className="text-xs font-mono font-bold text-emerald-400 truncate block">{selectedDevice.os}</span>
              </div>
            </div>

            {/* Open Ports & Listening Daemons */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                LISTENING PORTS & SERVICES (SIMULATED PORT SCAN)
              </h4>

              <div className="space-y-1.5">
                {selectedDevice.openPorts.map((p, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold">
                        PORT {p.port}/{p.protocol}
                      </span>
                      <span className="text-slate-200">{p.service}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${p.status === 'open' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notes */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
              <span className="text-amber-400 font-bold uppercase block">SECURITY & AUDIT NOTES:</span>
              <p className="text-slate-400">{selectedDevice.securityNotes}</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Ping Simulator & Subnet Trainer */}
        <div className="space-y-6">
          
          {/* ICMP Ping Tester */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-mono font-bold text-xs text-slate-200 uppercase flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              ICMP PING SIMULATOR
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={pingTarget}
                onChange={(e) => setPingTarget(e.target.value)}
                placeholder="e.g. 192.168.1.1"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSimulatePing}
                disabled={isPinging}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-mono font-bold text-xs shrink-0 cursor-pointer"
              >
                {isPinging ? 'PINGING...' : 'PING'}
              </button>
            </div>

            <div className="bg-black/90 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 min-h-[110px] space-y-1 overflow-x-auto">
              {pingLogs.length === 0 ? (
                <span className="text-slate-600">// Ready to transmit ICMP packets...</span>
              ) : (
                pingLogs.map((log, i) => <div key={i}>{log}</div>)
              )}
            </div>
          </div>

          {/* Subnetting Mini Calculator */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="font-mono font-bold text-xs text-slate-200 uppercase flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              SUBNETTING & CIDR TRAINER
            </h3>

            <div className="flex gap-1.5 flex-wrap">
              {['192.168.1.0/24', '10.0.0.0/28', '172.16.0.0/26', '192.168.1.0/30'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => calculateSubnet(preset)}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    cidrInput === preset
                      ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">Subnet Mask:</span> <span className="text-cyan-400">{calcResult.netMask}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Usable Range:</span> <span>{calcResult.usableRange}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Total Hosts:</span> <span>{calcResult.totalHosts}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Usable Hosts:</span> <span className="text-emerald-400 font-bold">{calcResult.usableHosts}</span></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
