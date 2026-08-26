import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Award,
  Lock,
  Terminal as TerminalIcon,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  FileText,
  Search,
  Layers,
  RotateCcw,
  Zap,
  Check
} from 'lucide-react';
import { PracticeLab } from '../../data/practiceLabsData';
import { ProfessionalTerminal } from '../terminal/ProfessionalTerminal';
import { IncidentStateEngine, IncidentState } from '../../utils/incidentStateEngine';
import { useApp } from '../../context/AppContext';
import { LabEnvironment, LabTaskObjective } from '../../cyberrange/LabEnvironment';
import { SimulationEngine } from '../../cyberrange/SimulationEngine';
import { ReplayEngine } from '../../cyberrange/ReplayEngine';

interface PracticeLabRunnerModalProps {
  lab: PracticeLab;
  onClose: () => void;
}

export const PracticeLabRunnerModal: React.FC<PracticeLabRunnerModalProps> = ({ lab, onClose }) => {
  const { addXp, completeMission, addEvidence } = useApp();
  const [activeTab, setActiveTab] = useState<'briefing' | 'terminal' | 'tasks' | 'hints' | 'debrief'>('briefing');
  const [activeHintLevel, setActiveHintLevel] = useState<number>(0);
  const [replaySeed, setReplaySeed] = useState<number>(1337);

  // Stateful universal cyber range state
  const [labEnv, setLabEnv] = useState<LabEnvironment>(() => {
    return SimulationEngine.loadOrCreateEnvironment(lab.id, replaySeed);
  });

  const [incidentState, setIncidentState] = useState<IncidentState>(() => {
    return IncidentStateEngine.loadOrCreateState(lab.id);
  });

  const handleEnvUpdated = (newEnv: LabEnvironment) => {
    setLabEnv(newEnv);
    SimulationEngine.persistEnvironment(newEnv);
  };

  const handleTaskComplete = (objectiveId: string) => {
    const updated = JSON.parse(JSON.stringify(labEnv)) as LabEnvironment;
    const obj = updated.objectives.find(o => o.id === objectiveId);
    if (obj && !obj.isCompleted) {
      obj.isCompleted = true;
      // Increment execution score
      obj.mitreTechnique = obj.mitreTechnique || 'T1046';
      updated.score.execution = Math.min(20, updated.score.execution + 4);
      updated.score.totalScore = Math.min(100, updated.score.totalScore + 4);
      
      // Add completion event to timeline
      updated.timeline.push({
        timestamp: new Date().toLocaleTimeString(),
        type: 'VULN_CONFIRMED',
        title: 'Task Cleared manually',
        description: `Verified objective criteria: ${obj.description}`,
        team: 'RED'
      });

      setLabEnv(updated);
      SimulationEngine.persistEnvironment(updated);
      addXp(100);
    }
  };

  const handleResetWithSeed = (seed: number) => {
    const freshEnv = ReplayEngine.resetWithSeed(lab.id, seed);
    setLabEnv(freshEnv);
    setReplaySeed(seed);
    addXp(20);
  };

  const completedObjectivesCount = labEnv.objectives.filter(o => o.isCompleted).length;
  const isAllTasksCompleted = labEnv.objectives.every(o => o.isCompleted);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* =========================================================================
            MODAL HEADER & TOP NAV
            ========================================================================= */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold uppercase tracking-wider">
              {lab.category}
            </span>
            <div>
              <h2 className="text-base sm:text-xl font-mono font-bold text-slate-100 flex items-center gap-2">
                <span>{lab.title}</span>
                <span className="text-xs text-slate-400 font-normal">({lab.difficulty})</span>
              </h2>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Clock className="w-3.5 h-3.5" />
                  {lab.estimatedTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  +{lab.xpReward} XP
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 font-mono text-xs">
              <button
                onClick={() => setActiveTab('briefing')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'briefing' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Briefing
              </button>

              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'terminal' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>Terminal</span>
              </button>

              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'tasks' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Tasks ({completedObjectivesCount}/{labEnv.objectives.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hints')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'hints' ? 'bg-amber-600/80 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hints
              </button>

              <button
                onClick={() => setActiveTab('debrief')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'debrief' ? 'bg-cyan-600 text-white font-bold' : 'text-cyan-400/90 hover:text-cyan-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Debrief</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN BODY PANES
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-slate-950/60">
          
          {/* VIEW 1: BRIEFING & SCENARIO */}
          {activeTab === 'briefing' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
              
              {/* OBJECTIVE CARD */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-2">
                <span className="text-purple-400 font-mono text-xs font-bold uppercase tracking-wider block">
                  LAB OBJECTIVE
                </span>
                <p className="text-sm sm:text-base text-slate-200 font-semibold leading-relaxed">
                  {lab.objective}
                </p>
              </div>

              {/* SCENARIO */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider block">
                  SCENARIO & CONTEXT
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                  {lab.scenario}
                </p>
              </div>

              {/* KNOWN VS UNKNOWN INFORMATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <span className="text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    KNOWN INFORMATION
                  </span>
                  <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                    {lab.knownInformation.map((info, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <span className="text-amber-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    UNKNOWN INFORMATION (INVESTIGATE)
                  </span>
                  <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                    {lab.unknownInformation.map((info, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* RULES OF ENGAGEMENT & TARGET ENVIRONMENT */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">TARGET HOST</span>
                  <span className="text-slate-100 font-bold text-sm">{lab.targetEnvironment.hostName}</span>
                  <span className="text-slate-400 block">{labEnv.hosts[0]?.ip || lab.targetEnvironment.ipAddress}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">RULES OF ENGAGEMENT</span>
                  <span className="text-emerald-400 font-bold">{lab.rulesOfEngagement}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('terminal')}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-xl flex items-center gap-2"
                >
                  <span>Launch Terminal Investigation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: INTERACTIVE PROFESSIONAL TERMINAL */}
          {activeTab === 'terminal' && (
            <div className="h-full space-y-4 animate-fadeIn">
              <ProfessionalTerminal
                incidentState={incidentState}
                onStateUpdated={setIncidentState}
                labEnv={labEnv}
                onEnvUpdated={handleEnvUpdated}
                missionTitle={lab.title}
                targetHost={lab.targetEnvironment.hostName}
                networkRange={lab.targetEnvironment.subnet}
              />
            </div>
          )}

          {/* VIEW 3: TASKS & PROGRESS */}
          {activeTab === 'tasks' && (
            <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
              <h3 className="text-sm font-mono font-bold text-purple-300 uppercase tracking-wider">
                PRACTICE LAB TASKS & VERIFICATION
              </h3>

              <div className="space-y-3">
                {labEnv.objectives.map((task) => {
                  const isDone = task.isCompleted;
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border transition-all font-mono text-xs space-y-2 ${
                        isDone ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{task.description}</span>
                        <span className="text-[10px] text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30">
                          {task.mitreTechnique || 'T1046'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400 text-[11px]">
                          Expected CLI execution: <code className="text-cyan-300">{task.expectedValue}</code>
                        </span>

                        <button
                          onClick={() => handleTaskComplete(task.id)}
                          disabled={isDone}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-default'
                              : 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                          }`}
                        >
                          {isDone ? 'Task Completed' : 'Mark Completed'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 4: ADAPTIVE HINTS */}
          {activeTab === 'hints' && (
            <div className="max-w-3xl mx-auto space-y-4 font-mono text-xs animate-fadeIn">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                ADAPTIVE SOKRATIC HINT LADDER
              </h3>

              <div className="space-y-3">
                {lab.hints.map((hint) => {
                  const isUnlocked = activeHintLevel >= hint.level;
                  return (
                    <div
                      key={hint.level}
                      className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        isUnlocked ? 'bg-slate-900 border-amber-500/40' : 'bg-slate-950/60 border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span>HINT LEVEL {hint.level}: {hint.title}</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-bold">
                          Penalty: -{hint.xpPenalty} XP
                        </span>
                      </div>

                      {isUnlocked ? (
                        <p className="text-slate-200 leading-relaxed pt-1">{hint.text}</p>
                      ) : (
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Hint locked. Click to reveal.</span>
                          <button
                            onClick={() => setActiveHintLevel(hint.level)}
                            className="px-3 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40 font-bold"
                          >
                            Unlock Hint
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 5: CORE COMPREHENSIVE DEBRIEF */}
          {activeTab === 'debrief' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn text-slate-100 font-mono text-xs">
              
              {/* REPLAY SEED PANEL */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-cyan-400 font-bold text-sm uppercase">Replay Seed Controller</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Randomize ports, passwords, subnets, and credentials statefully.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Current Seed:</span>
                  <input 
                    type="number" 
                    value={replaySeed} 
                    onChange={(e) => setReplaySeed(parseInt(e.target.value) || 1337)}
                    className="w-20 p-1.5 rounded bg-slate-950 border border-slate-800 text-center text-cyan-300 font-bold"
                  />
                  <button
                    onClick={() => handleResetWithSeed(replaySeed)}
                    className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Apply Seed</span>
                  </button>
                  <button
                    onClick={() => {
                      const newSeed = Math.floor(Math.random() * 9000) + 1000;
                      handleResetWithSeed(newSeed);
                    }}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center gap-1 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Random</span>
                  </button>
                </div>
              </div>

              {/* DETAILED SCORECARD */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span>PROFESSIONAL MISSION REPORT CARD</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Final Grade:</span>
                    <span className="text-xl font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg">
                      {labEnv.score.grade}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Reconnaissance</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.recon} / 20</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Investigation</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.investigation} / 20</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Execution</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.execution} / 20</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Reasoning</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.reasoning} / 20</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Evidence</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.evidence} / 20</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-center text-sm font-bold text-slate-200">
                  Total Cyber Range Proficiency Index: <span className="text-purple-300 font-extrabold">{labEnv.score.totalScore} / 100</span>
                </div>
              </div>

              {/* AMAN INSTRUCTOR REPORT */}
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                <span className="text-purple-300 font-bold flex items-center gap-1.5 uppercase text-sm">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>AMAN UNIVERSAL INSTRUCTOR RECOMMENDATIONS</span>
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  "You have completed {completedObjectivesCount} out of {labEnv.objectives.length} objectives. Your technical execution grade is {labEnv.score.grade}. 
                  To optimize your posture evaluation: focus on capturing cryptographic hashes inside the Evidence Locker before applying modifications. 
                  In your next simulation, use detailed network recon tools before triggering any payload exfiltration."
                </p>
                <div className="pt-2 border-t border-purple-500/20 grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-purple-200">
                  <div>
                    <strong className="text-purple-300 block mb-0.5">TECHNICAL STRONG SUITS:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                      <li>Deterministic CLI argument validation</li>
                      <li>Vulnerability-criteria recognition</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-purple-300 block mb-0.5">AREAS OF IMPROVEMENT:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                      <li>Dynamic credential enumeration speed</li>
                      <li>Blue Team mitigation retest patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
