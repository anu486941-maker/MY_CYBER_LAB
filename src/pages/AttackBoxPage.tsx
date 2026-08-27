import React from 'react';
import { AttackBoxTerminal } from '../components/cyber-range/AttackBoxTerminal';
import { Shield, Terminal, BookOpen, Lock } from 'lucide-react';

export const AttackBoxPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
          Browser Workstation Engine
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-2">AttackBox Authorized Training Environment</h1>
        <p className="text-sm text-slate-400 mt-1">
          Perform security testing, log triage, and vulnerability assessment against isolated MY CYBER LAB targets.
        </p>
      </div>

      <AttackBoxTerminal />
    </div>
  );
};

export default AttackBoxPage;
