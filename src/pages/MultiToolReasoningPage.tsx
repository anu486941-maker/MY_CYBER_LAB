import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MULTI_TOOL_SCENARIOS } from '../data/intelligenceData';
import { MultiToolScenario } from '../types/intelligence';
import { 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  Terminal, 
  Layers, 
  ShieldCheck,
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';

export const MultiToolReasoningPage: React.FC = () => {
  const { toolReasoningScores, recordToolReasoningScore, addXp } = useApp();
  const [selectedScenario, setSelectedScenario] = useState<MultiToolScenario>(MULTI_TOOL_SCENARIOS[0]);
  const [selectedToolIndex, setSelectedToolIndex] = useState<number | null>(null);
  const [selectedFollowUpIndex, setSelectedFollowUpIndex] = useState<number | null>(null);
  const [isToolSubmitted, setIsToolSubmitted] = useState<boolean>(false);
  const [isFollowUpSubmitted, setIsFollowUpSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const completedCount = Object.keys(toolReasoningScores).length;

  const handleSelectScenario = (scen: MultiToolScenario) => {
    setSelectedScenario(scen);
    setSelectedToolIndex(null);
    setSelectedFollowUpIndex(null);
    setIsToolSubmitted(false);
    setIsFollowUpSubmitted(false);
    setShowHint(false);
  };

  const handleConfirmToolSelection = () => {
    if (selectedToolIndex === null) return;
    setIsToolSubmitted(true);
  };

  const handleConfirmFollowUp = () => {
    if (selectedFollowUpIndex === null) return;
    setIsFollowUpSubmitted(true);
    
    const isToolCorrect = selectedScenario.tools[selectedToolIndex!].isCorrect;
    const isFollowUpCorrect = selectedFollowUpIndex === selectedScenario.followUpCorrectIndex;
    
    let finalScore = 0;
    if (isToolCorrect && isFollowUpCorrect) finalScore = 100;
    else if (isToolCorrect) finalScore = 60;
    else finalScore = 20;

    recordToolReasoningScore(selectedScenario.id, finalScore);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" /> MULTI-TOOL DECISION MATRIX
            </span>
            <span className="text-xs font-mono text-slate-500">• {completedCount} OF {MULTI_TOOL_SCENARIOS.length} SCENARIOS PROVEN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Multi-Tool Reasoning Engine
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            True cybersecurity professionals don&apos;t memorize commands — they know which tool to choose for each operational scenario.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Decision Logic: EVALUATED</span>
        </div>
      </div>

      {/* Main Grid: Scenario Selector (Left) + Decision Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Scenarios */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Operational Scenarios ({MULTI_TOOL_SCENARIOS.length})
          </h3>

          {MULTI_TOOL_SCENARIOS.map((scen) => {
            const isSelected = selectedScenario.id === scen.id;
            const score = toolReasoningScores[scen.id];

            return (
              <button
                key={scen.id}
                onClick={() => handleSelectScenario(scen)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                    {scen.category}
                  </span>
                  {score !== undefined ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">
                      {score}% PROVEN
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-bold">
                      READY
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-mono font-bold text-slate-200 line-clamp-1">
                  {scen.title}
                </h4>

                <p className="text-xs text-slate-400 font-sans line-clamp-2">
                  {scen.scenarioContext}
                </p>

                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80">
                  <span className="text-cyan-400 font-semibold">+{scen.xpReward} XP</span>
                  <span className="text-slate-500 uppercase">{scen.difficulty}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 2 Cols: Interactive Decision Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl">
            
            {/* Context & Raw Evidence */}
            <div className="space-y-3 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  {selectedScenario.category} • {selectedScenario.difficulty}
                </span>
                <span className="text-xs font-mono text-slate-400">XP REWARD: +{selectedScenario.xpReward}</span>
              </div>
              
              <h2 className="text-xl font-mono font-bold text-white">
                {selectedScenario.title}
              </h2>
              
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {selectedScenario.scenarioContext}
              </p>

              {/* Raw Evidence Console Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">RAW TELEMETRY EVIDENCE:</div>
                <div className="text-slate-200">{selectedScenario.telemetryEvidence}</div>
              </div>
            </div>

            {/* Step 1: Tool Selection Question */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" /> STEP 1: WHAT TOOL WOULD YOU DEPLOY?
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Select the optimal utility</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedScenario.tools.map((tool, idx) => {
                  const isChosen = selectedToolIndex === idx;
                  let cardStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isToolSubmitted) {
                    if (tool.isCorrect) {
                      cardStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                    } else if (isChosen && !tool.isCorrect) {
                      cardStyle = 'bg-red-950/80 border-red-500 text-red-300';
                    }
                  } else if (isChosen) {
                    cardStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isToolSubmitted}
                      onClick={() => setSelectedToolIndex(idx)}
                      className={`p-4 rounded-xl border text-left font-mono transition-all cursor-pointer space-y-1.5 ${cardStyle}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{tool.name}</span>
                        {isToolSubmitted && tool.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-400 font-sans">
                        {tool.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {!isToolSubmitted ? (
                <div className="flex justify-end">
                  <button
                    onClick={handleConfirmToolSelection}
                    disabled={selectedToolIndex === null}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>CONFIRM TOOL CHOICE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className={`p-3.5 rounded-xl border text-xs font-sans space-y-1 ${
                  selectedScenario.tools[selectedToolIndex!].isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-red-950/30 border-red-500/30 text-red-200'
                }`}>
                  <strong>Operational Rationale:</strong> {selectedScenario.tools[selectedToolIndex!].rationale}
                </div>
              )}
            </div>

            {/* Step 2: Follow-up Syntax & Flag Question */}
            {isToolSubmitted && (
              <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-amber-400" /> STEP 2: TECHNICAL EXECUTION & SYNTAX
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Select the exact command</span>
                </div>

                <p className="text-sm font-mono font-semibold text-white">
                  {selectedScenario.followUpPrompt}
                </p>

                <div className="space-y-2">
                  {selectedScenario.followUpOptions.map((opt, idx) => {
                    const isChosen = selectedFollowUpIndex === idx;
                    const isCorrect = idx === selectedScenario.followUpCorrectIndex;
                    let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (isFollowUpSubmitted) {
                      if (isCorrect) {
                        optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                      } else if (isChosen && !isCorrect) {
                        optStyle = 'bg-red-950/80 border-red-500 text-red-300';
                      }
                    } else if (isChosen) {
                      optStyle = 'bg-amber-950/80 border-amber-500 text-amber-300';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isFollowUpSubmitted}
                        onClick={() => setSelectedFollowUpIndex(idx)}
                        className={`w-full p-3 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {isFollowUpSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {!isFollowUpSubmitted ? (
                  <div className="flex justify-end">
                    <button
                      onClick={handleConfirmFollowUp}
                      disabled={selectedFollowUpIndex === null}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs transition-all cursor-pointer"
                    >
                      EVALUATE REASONING
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> SCENARIO EVALUATION COMPLETE
                    </div>
                    <p className="text-xs text-slate-300 font-sans">
                      {selectedScenario.followUpExplanation}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
