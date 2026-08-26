import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THREAT_HUNTING_CASES } from '../data/mockData';
import { ThreatHuntingCase } from '../types';
import { 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  Layers, 
  Activity, 
  FolderArchive, 
  ArrowRight,
  Flame
} from 'lucide-react';

export const ThreatHuntingPage: React.FC = () => {
  const { addXp } = useApp();
  const [cases, setCases] = useState<ThreatHuntingCase[]>(THREAT_HUNTING_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(THREAT_HUNTING_CASES[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [caseSolved, setCaseSolved] = useState<boolean>(false);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handleSelectOption = (stepNumber: number, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [stepNumber]: option
    }));
  };

  const handleValidateStep = (stepNumber: number) => {
    const step = activeCase.killChainSteps.find(s => s.stepNumber === stepNumber);
    if (!step) return;

    const chosen = selectedAnswers[stepNumber];
    const isCorrect = chosen === step.correctTechnique;

    setStepValidation(prev => ({
      ...prev,
      [stepNumber]: isCorrect
    }));

    if (isCorrect) {
      addXp(50);
      // Check if all steps in active case are solved
      const allStepsSolved = activeCase.killChainSteps.every(s => 
        s.stepNumber === stepNumber ? isCorrect : stepValidation[s.stepNumber]
      );
      if (allStepsSolved) {
        setCaseSolved(true);
        addXp(activeCase.xpReward);
      }
    }
  };

  const handleSwitchCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setSelectedAnswers({});
    setStepValidation({});
    setShowHints({});
    setCaseSolved(false);
  };

  return (
    <div id="threat-hunting-page" className="space-y-8 pb-20 font-mono">
      
      {/* Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-400 text-xs font-semibold">
              ADVANCED DFIR INVESTIGATION
            </span>
            <span className="text-xs text-slate-500">• ATTACK CHAIN RECONSTRUCTION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Threat Hunting & Kill Chain Simulator
          </h1>
          <p className="text-xs text-slate-400">
            Analyze forensic log artifacts, correlate adversary behaviors, and map the full MITRE ATT&CK kill chain.
          </p>
        </div>

        {/* Case selector tabs */}
        <div className="flex items-center gap-2">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSwitchCase(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                c.id === activeCase.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {c.caseNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Case Briefing Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs text-purple-400 font-bold">{activeCase.caseNumber}</div>
            <h2 className="text-xl font-bold text-slate-100">{activeCase.title}</h2>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              Actor: <strong className="text-purple-400">{activeCase.threatActor}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              Sector: <strong className="text-cyan-400">{activeCase.targetSector}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">
              +{activeCase.xpReward} XP
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {activeCase.scenario}
        </p>

        {caseSolved && (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>CASE COMPLETE! FULL ADVERSARY KILL CHAIN RECONSTRUCTED (+{activeCase.xpReward} XP)</span>
            </div>
            <span className="text-[11px] text-slate-400">All MITRE Techniques Verified</span>
          </div>
        )}
      </div>

      {/* Kill Chain Steps List */}
      <div className="space-y-6">
        <div className="text-xs text-slate-400 font-bold tracking-wider">
          ATTACK CHAIN ARTIFACTS & TECHNIQUE MAPPING ({activeCase.killChainSteps.length} PHASES)
        </div>

        {activeCase.killChainSteps.map((step) => {
          const isSolved = stepValidation[step.stepNumber] === true;
          const isWrong = stepValidation[step.stepNumber] === false;
          const currentSelection = selectedAnswers[step.stepNumber] || '';
          const hintOpen = showHints[step.stepNumber] || false;

          return (
            <div
              key={step.stepNumber}
              className={`p-6 rounded-2xl border transition-all ${
                isSolved
                  ? 'bg-slate-900/90 border-emerald-500/50 shadow-md'
                  : isWrong
                  ? 'bg-slate-900/90 border-rose-500/50'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSolved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    0{step.stepNumber}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">PHASE {step.stepNumber}</span>
                    <h3 className="text-sm font-bold text-slate-100">{step.phase}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSolved ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> VERIFIED
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowHints(prev => ({ ...prev, [step.stepNumber]: !hintOpen }))}
                      className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> {hintOpen ? 'Hide Hint' : 'Investigator Hint'}
                    </button>
                  )}
                </div>
              </div>

              {/* Forensic Artifact Quote */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 mb-4">
                <span className="text-slate-500 text-[10px] block mb-1">RECOVERED FORENSIC LOG EVIDENCE:</span>
                <code className="text-cyan-300">{step.artifactEvidence}</code>
              </div>

              {hintOpen && (
                <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-300 text-xs mb-4">
                  <strong>Hint:</strong> {step.hint}
                </div>
              )}

              {/* Multiple Choice Options */}
              <div className="space-y-2 mb-4">
                <div className="text-[11px] text-slate-400 font-semibold">Select Corresponding MITRE ATT&CK Technique:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {step.options.map((opt, oIdx) => {
                    const isChecked = currentSelection === opt;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(step.stepNumber, opt)}
                        disabled={isSolved}
                        className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-purple-950/60 border-purple-500 text-purple-200 ring-1 ring-purple-500/30'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        } ${isSolved ? 'opacity-80 cursor-default' : ''}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Validate Step Action */}
              {!isSolved && (
                <button
                  onClick={() => handleValidateStep(step.stepNumber)}
                  disabled={!currentSelection}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    currentSelection
                      ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CONFIRM TECHNIQUE CLASSIFICATION (+50 XP)
                </button>
              )}

              {isWrong && (
                <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  Incorrect technique selected for this forensic artifact. Review the hint and try again.
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
