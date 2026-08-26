import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LearnerMistake } from '../types/intelligence';
import { TRANSLATIONS } from '../data/translations';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';

export const MistakesJournalPage: React.FC = () => {
  const { learningState, mistakes, resolveMistake, addXp, language } = useApp();
  const [selectedMistake, setSelectedMistake] = useState<LearnerMistake>(learningState.pendingMistakes[0] || mistakes[0] || null);
  const [activeDrillMistake, setActiveDrillMistake] = useState<LearnerMistake | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [drillSubmitted, setDrillSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.English;
  const pendingCount = learningState.pendingMistakes.length;
  const resolvedCount = learningState.resolvedMistakes.length;

  const handleStartDrill = (mistake: LearnerMistake) => {
    setActiveDrillMistake(mistake);
    setSelectedOption(null);
    setDrillSubmitted(false);
    setShowHint(false);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !activeDrillMistake) return;
    setDrillSubmitted(true);
    if (selectedOption === activeDrillMistake.drillQuestion.correctIndex) {
      resolveMistake(activeDrillMistake.id);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" /> MISTAKE JOURNAL & SMART REVIEW
            </span>
            <span className="text-xs font-mono text-slate-500">• {pendingCount} PENDING WEAKNESSES • {resolvedCount} RESOLVED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            My Conceptual Mistakes
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {t.mistakesLogged}
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-amber-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Smart Remediation Engine: ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Mistake List (Left) + Detail & Interactive Drill (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Mistakes Cards */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Recorded Conceptual Flaws ({mistakes.length})
          </h3>

          {mistakes.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-mono font-bold text-white">Zero Active Mistakes!</p>
              <p className="text-xs text-slate-400 font-sans">You have maintained flawless accuracy across your recent labs.</p>
            </div>
          ) : (
            mistakes.map((m) => {
              const isSelected = selectedMistake?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMistake(m)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : m.resolved
                      ? 'bg-slate-950/60 border-emerald-500/30 hover:border-emerald-500/60'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                      {m.category}
                    </span>
                    {m.resolved ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> RESOLVED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {m.occurrences}x ERROR
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-mono font-bold text-slate-200 line-clamp-1">
                    {m.title}
                  </h4>

                  <p className="text-xs text-slate-400 font-sans line-clamp-2">
                    {m.whyItHappens}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80">
                    <span>Logged: {m.lastOccurredAt}</span>
                    <span className="text-amber-400 font-semibold">Inspect & Fix →</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Cols: Mistake Inspector & Interactive Smart Review Drill */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMistake ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl">
              
              {/* Header & Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      CATEGORY: {selectedMistake.category.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-slate-500">• LAST RECORDED: {selectedMistake.lastOccurredAt}</span>
                  </div>
                  <h2 className="text-xl font-mono font-bold text-white">
                    {selectedMistake.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartDrill(selectedMistake)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>LAUNCH TARGETED DRILL</span>
                  </button>
                </div>
              </div>

              {/* Root Cause & Diagnostic Fix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-2">
                  <div className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> WHY THIS ERROR HAPPENS
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {selectedMistake.whyItHappens}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> EXACT METHODOLOGICAL FIX
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {selectedMistake.howToFixIt}
                  </p>
                </div>
              </div>

              {/* Active Practice Drill Session */}
              {activeDrillMistake && activeDrillMistake.id === selectedMistake.id ? (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> SMART DRILL: PROVE UNDERSTANDING
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">+50 XP ON SUCCESS</span>
                  </div>

                  <p className="text-sm font-mono font-semibold text-white leading-relaxed">
                    {selectedMistake.drillQuestion.prompt}
                  </p>

                  <div className="space-y-2">
                    {selectedMistake.drillQuestion.options.map((option, idx) => {
                      const isChosen = selectedOption === idx;
                      const isCorrect = idx === selectedMistake.drillQuestion.correctIndex;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (drillSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'bg-red-950/80 border-red-500 text-red-300';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-amber-950/80 border-amber-500 text-amber-300';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={drillSubmitted}
                          onClick={() => setSelectedOption(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {drillSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions & Hint */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showHint ? 'Hide Pedagogical Hint' : 'Need a Progressive Hint?'}</span>
                    </button>

                    {!drillSubmitted ? (
                      <button
                        onClick={handleCheckAnswer}
                        disabled={selectedOption === null}
                        className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs transition-all cursor-pointer"
                      >
                        SUBMIT DRILL ANSWER
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {selectedOption === selectedMistake.drillQuestion.correctIndex ? (
                          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> WEAKNESS RESOLVED (+50 XP)
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedOption(null);
                              setDrillSubmitted(false);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-red-950 border border-red-500/40 text-red-300 font-mono text-xs hover:bg-red-900 transition-colors"
                          >
                            RETRY DRILL
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {showHint && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs font-sans text-amber-200">
                      💡 <strong>Hint:</strong> {selectedMistake.drillQuestion.hint}
                    </div>
                  )}

                  {drillSubmitted && (
                    <div className={`p-3 rounded-xl border text-xs font-sans ${
                      selectedOption === selectedMistake.drillQuestion.correctIndex
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/40 border-red-500/40 text-red-200'
                    }`}>
                      <strong>Explanation:</strong> {selectedMistake.drillQuestion.explanation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-3">
                  <BookOpen className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs font-mono text-slate-400">
                    Click <strong>LAUNCH TARGETED DRILL</strong> to test your mastery of this concept and clear the weakness record.
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
              <Brain className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-mono font-bold text-slate-400">Select a mistake record to inspect details</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
