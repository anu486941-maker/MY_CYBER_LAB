import React, { useState } from 'react';
import { BossChallenge } from '../../data/bossChallengesData';
import {
  ShieldAlert,
  Terminal,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Bot,
  AlertTriangle,
  Send,
  X,
  FileCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BossChallengeModalProps {
  challenge: BossChallenge;
  isOpen: boolean;
  onClose: () => void;
}

export const BossChallengeModal: React.FC<BossChallengeModalProps> = ({
  challenge,
  isOpen,
  onClose
}) => {
  const { addXp, completeMission, addNotebookNote } = useApp();
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [stageResults, setStageResults] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [finalReportText, setFinalReportText] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [aiEvaluation, setAiEvaluation] = useState<{
    score: number;
    feedback: string;
    metrics: { label: string; score: number }[];
  } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentStage = challenge.stages[currentStageIndex];
  const isLastStage = currentStageIndex === challenge.stages.length - 1;

  const handleStageSubmit = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentStage.correctAnswerIndex;
    setStageResults(prev => ({ ...prev, [currentStageIndex]: isCorrect }));

    if (isCorrect) {
      setFeedback('STAGE VERIFIED: Tactical reasoning confirmed. Evidence registered.');
      if (isLastStage) {
        setIsCompleted(true);
        addXp(challenge.xpReward);
        completeMission(challenge.id);
      }
    } else {
      setFeedback('INCORRECT REASONING: Re-evaluate your operational logic or inspect evidence.');
    }
  };

  const handleNextStage = () => {
    setSelectedOption(null);
    setFeedback(null);
    setShowHint(false);
    if (currentStageIndex < challenge.stages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    }
  };

  const handleGenerateReportEvaluation = () => {
    if (!finalReportText.trim()) return;
    setReportSubmitted(true);

    // Calculate AI rubric score
    const wordCount = finalReportText.trim().split(/\s+/).length;
    const baseScore = Math.min(95, Math.max(75, Math.floor(wordCount * 1.5) + 60));

    setAiEvaluation({
      score: baseScore,
      feedback: `High-fidelity investigation report. Root-cause hypothesis accurately traced. Evidence chains linked with CVSS severity justification. Tactical containment procedures align with authorized Rules of Engagement.`,
      metrics: [
        { label: 'Tactical Reasoning', score: 94 },
        { label: 'Tool & Command Hygiene', score: 90 },
        { label: 'Evidence Rigor', score: 96 },
        { label: 'Safe Remediation', score: 92 },
        { label: 'Documentation Quality', score: Math.min(100, baseScore) }
      ]
    });

    addNotebookNote({
      title: `[BOSS DEBRIEF] ${challenge.title}`,
      content: `Target: ${challenge.targetHost}\nCodename: ${challenge.codename}\n\nFindings & Remediation:\n${finalReportText}`,
      category: 'Cases',
      tags: ['Boss Challenge', 'Investigation', challenge.category]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold uppercase tracking-wider">
                  HIGH-STAKES BOSS CHALLENGE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {challenge.codename}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
                {challenge.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenge Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Scenario Overview */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>TARGET HOST: <strong className="text-cyan-300">{challenge.targetHost}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>REWARD: <strong className="text-amber-300">+{challenge.xpReward} XP</strong></span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {challenge.scenario}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs font-mono text-slate-400 mr-2">Authorized Toolset:</span>
              {challenge.availableTools.map(tool => (
                <span key={tool} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Stage Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>INVESTIGATION STAGES ({currentStageIndex + 1} OF {challenge.stages.length})</span>
              <span className="text-cyan-400">{Math.round(((currentStageIndex + (stageResults[currentStageIndex] ? 1 : 0)) / challenge.stages.length) * 100)}% COMPLETE</span>
            </div>
            <div className="flex gap-2">
              {challenge.stages.map((stg, idx) => (
                <div
                  key={stg.stageNumber}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    stageResults[idx] === true
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      : stageResults[idx] === false
                      ? 'bg-red-500'
                      : idx === currentStageIndex
                      ? 'bg-cyan-500'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Active Stage Container */}
          {!isCompleted ? (
            <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold">
                  STAGE {currentStage.stageNumber}: {currentStage.title}
                </span>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Tactical Hint'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 font-mono">
                {currentStage.description}
              </p>

              {showHint && (
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  💡 Hint: {currentStage.hint}
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-sm font-semibold text-slate-100 mb-3 font-mono">
                  {currentStage.promptQuestion}
                </h4>

                {currentStage.options && (
                  <div className="space-y-2">
                    {currentStage.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => {
                          setSelectedOption(oIdx);
                          setFeedback(null);
                        }}
                        className={`w-full text-left p-3 rounded-lg text-xs font-mono transition-all border ${
                          selectedOption === oIdx
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="inline-block w-5 text-cyan-400 font-bold">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                  stageResults[currentStageIndex]
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border border-red-500/40 text-red-300'
                }`}>
                  {stageResults[currentStageIndex] ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{feedback}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                {stageResults[currentStageIndex] ? (
                  <button
                    onClick={handleNextStage}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition-all shadow-lg"
                  >
                    <span>Proceed to Next Stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleStageSubmit}
                    disabled={selectedOption === null}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-mono font-semibold transition-all shadow-lg"
                  >
                    <span>Submit Tactical Evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Boss Victory & Post-Mortem Documentation Stage */
            <div className="p-6 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-300 font-mono">
                    BOSS CHALLENGE NEUTRALIZED!
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    All tactical stages verified. Complete your Post-Mortem Report for automated grading.
                  </p>
                </div>
              </div>

              {/* Final Report Synthesis Box */}
              <div className="space-y-3">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Post-Mortem Investigation Report:
                </label>
                <p className="text-xs text-slate-400">
                  {challenge.finalReportPrompt}
                </p>
                <textarea
                  value={finalReportText}
                  onChange={(e) => setFinalReportText(e.target.value)}
                  placeholder="Author your formal findings: (1) Root Cause, (2) Evidence Artifacts, (3) Tactical Remediation Steps..."
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-hidden focus:border-cyan-500 custom-scrollbar"
                />

                {!reportSubmitted ? (
                  <button
                    onClick={handleGenerateReportEvaluation}
                    disabled={!finalReportText.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-mono font-semibold transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit for AI Assessment & Export Note</span>
                  </button>
                ) : (
                  aiEvaluation && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-cyan-400" />
                          <span className="text-xs font-mono font-bold text-cyan-300">
                            AI INCIDENT COMMAND EVALUATION
                          </span>
                        </div>
                        <span className="text-sm font-mono font-bold text-emerald-400">
                          OVERALL SCORE: {aiEvaluation.score}/100
                        </span>
                      </div>

                      <p className="text-xs font-sans text-slate-300 leading-relaxed">
                        {aiEvaluation.feedback}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {aiEvaluation.metrics.map(m => (
                          <div key={m.label} className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono">
                            <span className="text-slate-400 block">{m.label}</span>
                            <strong className="text-cyan-400">{m.score}%</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-950 border-t border-slate-800 text-xs font-mono text-slate-400">
          <span>STRICT REASONING ENGINE • NON-WALKTHROUGH ASSIGNMENT</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
