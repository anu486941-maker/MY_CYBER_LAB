import React, { useState } from 'react';
import {
  X,
  Radio,
  Clock,
  Award,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal as TerminalIcon,
  Server,
  Globe,
  Lock,
  FileText,
  Sparkles
} from 'lucide-react';
import { Mission } from '../../types';
import { ProfessionalTerminal } from '../terminal/ProfessionalTerminal';
import { IncidentStateEngine, IncidentState } from '../../utils/incidentStateEngine';
import { useApp } from '../../context/AppContext';

interface MissionRunnerModalProps {
  mission: Mission;
  onClose: () => void;
}

export const MissionRunnerModal: React.FC<MissionRunnerModalProps> = ({ mission, onClose }) => {
  const { addXp, completeMission, addEvidence } = useApp();
  const [activeTab, setActiveTab] = useState<'briefing' | 'terminal' | 'evidence' | 'report'>('briefing');
  const [incidentState, setIncidentState] = useState<IncidentState>(() => {
    return IncidentStateEngine.loadOrCreateState(mission.id);
  });

  const handleFinishMission = () => {
    completeMission(mission.id);
    addXp(mission.xp || 500);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* TOP BAR */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              MISSION ID: {mission.id.toUpperCase()}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                {mission.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>CLIENT: FinVault Global Systems</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">+{mission.xp || 500} XP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('briefing')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'briefing' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Engagement Briefing
              </button>

              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'terminal' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>Field Terminal</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-slate-950/60">
          {activeTab === 'briefing' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn font-mono text-xs">
              
              {/* INCIDENT BRIEFING */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-2">
                <span className="text-cyan-400 font-bold uppercase text-[10px] block">
                  INCIDENT BRIEF & OBJECTIVE
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
                  {mission.description}
                </p>
              </div>

              {/* KNOWN FACTS VS UNKNOWN FACTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <span className="text-emerald-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    KNOWN FACTS
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Target Range: 10.10.20.0/24</li>
                    <li>• Primary Host: FINANCE-SIM-01</li>
                    <li>• Public Interface HTTP 80 active</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <span className="text-amber-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    UNKNOWN FACTS (INVESTIGATE)
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Exact initial access vulnerability</li>
                    <li>• Database credentials</li>
                    <li>• Internal privilege escalation vectors</li>
                  </ul>
                </div>
              </div>

              {/* SUCCESS & FAILURE CONDITIONS */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">SUCCESS CONDITIONS:</span>
                  <p className="text-slate-300">Identify initial access vector, extract administrative proof, and verify patch via retest.</p>
                </div>
                <div>
                  <span className="text-rose-400 font-bold block mb-1">FAILURE CONDITIONS:</span>
                  <p className="text-slate-300">Exceed noise thresholds or execute unauthorized external actions.</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('terminal')}
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-xl flex items-center gap-2"
                >
                  <span>Open Field Operations Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="h-full space-y-4 animate-fadeIn">
              <ProfessionalTerminal
                incidentState={incidentState}
                onStateUpdated={setIncidentState}
                missionTitle={mission.title}
                targetHost="FINANCE-SIM-01"
                networkRange="10.10.20.0/24"
              />

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleFinishMission}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Engagement & Award XP</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
