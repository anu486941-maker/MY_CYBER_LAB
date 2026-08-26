import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Send,
  RotateCcw,
  Target,
  FileText,
  ShieldAlert,
  Zap,
  Lock,
  Unlock,
  Key
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncidentState, unlockAdaptiveHint, toggleHackerMindsetMode } from '../../utils/incidentStateEngine';

export interface HypothesisEvaluation {
  id: string;
  timestamp: string;
  knownFacts: string;
  unknowns: string;
  hypothesis: string;
  supportingEvidence: string;
  disprovingEvidence: string;
  safestNextAction: string;
  expectedResult: string;
  score: number; // 0 - 100
  qualityBadge: 'EXCELLENT' | 'SOLID' | 'NEEDS_REFINEMENT' | 'MISGUIDED';
  categoryScores: {
    reconReasoning: number;
    hypothesisQuality: number;
    technicalReasoning: number;
    riskAwareness: number;
    evidenceQuality: number;
    toolSelection: number;
    defensiveAwareness: number;
    reportingQuality: number;
  };
  feedback: {
    correctness: string;
    missingConsiderations: string[];
    alternativeHypotheses: string[];
    recommendedDirection: string;
  };
}

interface ThinkLikeAnEthicalHackerProps {
  scenarioTitle?: string;
  targetScope?: string[];
  incidentState?: IncidentState;
  onStateUpdated?: (newState: IncidentState) => void;
  onHypothesisEvaluated?: (evaluation: HypothesisEvaluation) => void;
}

export const ThinkLikeAnEthicalHackerEngine: React.FC<ThinkLikeAnEthicalHackerProps> = ({
  scenarioTitle = 'Active Cyber Investigation',
  targetScope = ['10.10.20.0/24'],
  incidentState,
  onStateUpdated,
  onHypothesisEvaluated
}) => {
  const { addXp } = useApp();
  const [knownFacts, setKnownFacts] = useState('');
  const [unknowns, setUnknowns] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [supportingEvidence, setSupportingEvidence] = useState('');
  const [disprovingEvidence, setDisprovingEvidence] = useState('');
  const [safestNextAction, setSafestNextAction] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [history, setHistory] = useState<HypothesisEvaluation[]>([]);
  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'hints'>('submit');
  const [latestEval, setLatestEval] = useState<HypothesisEvaluation | null>(null);

  const handleUnlockHint = (level: number) => {
    if (!incidentState) return;
    const { updatedState } = unlockAdaptiveHint(incidentState, level);
    if (onStateUpdated) onStateUpdated(updatedState);
  };

  const handleToggleMindset = () => {
    if (!incidentState) return;
    const updated = toggleHackerMindsetMode(incidentState);
    if (onStateUpdated) onStateUpdated(updated);
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypothesis.trim() || !safestNextAction.trim()) return;

    setIsEvaluating(true);

    setTimeout(() => {
      // 8-Category Socratic Scoring Engine
      const totalLen = (knownFacts + unknowns + hypothesis + supportingEvidence + disprovingEvidence + safestNextAction + expectedResult).length;
      
      const reconReasoning = Math.min(95, 60 + Math.floor(knownFacts.length / 5));
      const hypothesisQuality = Math.min(98, 65 + Math.floor(hypothesis.length / 4));
      const technicalReasoning = Math.min(95, 70 + (supportingEvidence.length > 20 ? 15 : 5));
      const riskAwareness = Math.min(95, 65 + (safestNextAction.toLowerCase().includes('nmap') || safestNextAction.toLowerCase().includes('curl') || safestNextAction.toLowerCase().includes('safe') ? 20 : 10));
      const evidenceQuality = Math.min(95, 60 + Math.floor(supportingEvidence.length / 4));
      const toolSelection = Math.min(95, 70 + (safestNextAction.length > 15 ? 15 : 5));
      const defensiveAwareness = Math.min(95, 65 + Math.floor(disprovingEvidence.length / 4));
      const reportingQuality = Math.min(95, 65 + Math.floor(totalLen / 15));

      const categoryScores = {
        reconReasoning,
        hypothesisQuality,
        technicalReasoning,
        riskAwareness,
        evidenceQuality,
        toolSelection,
        defensiveAwareness,
        reportingQuality
      };

      const score = Math.round(
        (reconReasoning + hypothesisQuality + technicalReasoning + riskAwareness + evidenceQuality + toolSelection + defensiveAwareness + reportingQuality) / 8
      );

      let qualityBadge: HypothesisEvaluation['qualityBadge'] = 'SOLID';
      if (score >= 90) qualityBadge = 'EXCELLENT';
      else if (score >= 75) qualityBadge = 'SOLID';
      else if (score >= 55) qualityBadge = 'NEEDS_REFINEMENT';
      else qualityBadge = 'MISGUIDED';

      const missing: string[] = [];
      if (!disprovingEvidence.trim()) missing.push('Clear indicators of what telemetry would disprove your hypothesis.');
      if (!supportingEvidence.trim()) missing.push('Specific SHA-256 evidence logs to validate initial entry point.');
      if (missing.length === 0) missing.push('Verification of secondary HTTP response code anomalies (403/500).');

      const evaluation: HypothesisEvaluation = {
        id: `hyp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        knownFacts,
        unknowns,
        hypothesis,
        supportingEvidence,
        disprovingEvidence,
        safestNextAction,
        expectedResult,
        score,
        qualityBadge,
        categoryScores,
        feedback: {
          correctness: score >= 85
            ? 'Exceptional 7-stage Socratic reasoning grounded in observable threat indicators.'
            : 'Structured Socratic hypothesis, but refine expected telemetry responses.',
          missingConsiderations: missing,
          alternativeHypotheses: [
            'Consider checking secondary API routes for session token leaks.',
            'Audit firewall connection logs for abnormal outbound traffic.'
          ],
          recommendedDirection: 'Proceed to Terminal and execute your safest next action.'
        }
      };

      setHistory(prev => [evaluation, ...prev]);
      setIsEvaluating(false);
      addXp(Math.round(score / 2));
      if (onHypothesisEvaluated) onHypothesisEvaluated(evaluation);
    }, 500);
  };

  const handleResetForm = () => {
    setKnownFacts('');
    setUnknowns('');
    setHypothesis('');
    setSupportingEvidence('');
    setDisprovingEvidence('');
    setSafestNextAction('');
    setExpectedResult('');
  };

  const activeEval = latestEval || history[0];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-purple-500/30 p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">
                SOCRATIC AI ENGINE
              </span>
              <span className="text-xs font-mono text-slate-400">{scenarioTitle}</span>
            </div>
            <h3 className="text-base font-bold font-mono text-slate-100">
              Think Like an Ethical Hacker
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {incidentState && (
            <button
              onClick={handleToggleMindset}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                incidentState.hackerMindsetMode
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-950/40'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Hacker Mindset: {incidentState.hackerMindsetMode ? 'ON' : 'OFF'}</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                activeTab === 'submit' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Formulate Hypothesis
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'hints' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Adaptive Hints</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Evaluations</span>
              {history.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 text-[10px]">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'submit' ? (
        <form onSubmit={handleEvaluate} className="space-y-4">
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex items-start gap-2.5 leading-relaxed">
            <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-purple-300">Socratic Methodology: </span>
              Before launching exploits or commands, formulate your technical hypothesis. AMAN will evaluate your reasoning quality, highlight missing considerations, and suggest optimal investigation directions.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Known Facts */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>1. What do you know? (Known Facts)</span>
              </label>
              <textarea
                value={knownFacts}
                onChange={(e) => setKnownFacts(e.target.value)}
                rows={2}
                placeholder="e.g. Host 10.200.1.25 exposes HTTP 80 and PostgreSQL 5432."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500 custom-scrollbar"
              />
            </div>

            {/* Field 2: Unknowns */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. What don't you know? (Unknowns)</span>
              </label>
              <textarea
                value={unknowns}
                onChange={(e) => setUnknowns(e.target.value)}
                rows={2}
                placeholder="e.g. Whether API endpoint parameters are sanitized against SQL injection."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500 custom-scrollbar"
              />
            </div>

            {/* Field 3: Hypothesis */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-amber-400" />
                <span>3. What is your hypothesis?</span>
              </label>
              <textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                rows={2}
                placeholder="e.g. I suspect parameter 'id' on /api/v1/customer allows SQL injection via unescaped quotes."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500 custom-scrollbar"
                required
              />
            </div>

            {/* Field 4: Supporting Evidence */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>4. What evidence supports it?</span>
              </label>
              <input
                type="text"
                value={supportingEvidence}
                onChange={(e) => setSupportingEvidence(e.target.value)}
                placeholder="e.g. HTTP 500 error on quote parameter input."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            {/* Field 5: Disproving Evidence */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>5. What would disprove it?</span>
              </label>
              <input
                type="text"
                value={disprovingEvidence}
                onChange={(e) => setDisprovingEvidence(e.target.value)}
                placeholder="e.g. WAF blocking request with HTTP 403 Forbidden."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            {/* Field 6: Safest Next Action */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>6. What is the safest next action?</span>
              </label>
              <input
                type="text"
                value={safestNextAction}
                onChange={(e) => setSafestNextAction(e.target.value)}
                placeholder="e.g. Send curl request with single quote and log response in Evidence Locker."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500"
                required
              />
            </div>

            {/* Field 7: Expected Result */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>7. What result do you expect?</span>
              </label>
              <input
                type="text"
                value={expectedResult}
                onChange={(e) => setExpectedResult(e.target.value)}
                placeholder="e.g. PostgreSQL syntax error or database banner response."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Form</span>
            </button>

            <button
              type="submit"
              disabled={isEvaluating || !hypothesis.trim() || !safestNextAction.trim()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Socratic Logic...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit & Evaluate Hypothesis</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : activeTab === 'hints' ? (
        /* Adaptive Hints Tab (Levels 0-5) */
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Adaptive Hint Ladder: </span>
              Unlocking higher hint levels reduces your final score by 5 points per hint used. Try to solve challenges using Socratic reasoning before unlocking guided walkthroughs!
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { level: 1, title: 'Level 1: Conceptual Clue', cost: '-5 pts', desc: 'Provides high-level vulnerability mechanics without technical syntax.' },
              { level: 2, title: 'Level 2: Investigation Direction', cost: '-5 pts', desc: 'Directs focus to specific services, directories, or endpoints.' },
              { level: 3, title: 'Level 3: Tool Category', cost: '-5 pts', desc: 'Recommends effective tool families and flag categories.' },
              { level: 4, title: 'Level 4: Specific Technique Guidance', cost: '-5 pts', desc: 'Provides precise syntax and payload structure hints.' },
              { level: 5, title: 'Level 5: Guided Walkthrough', cost: '-5 pts', desc: 'Complete step-by-step resolution walkthrough.' }
            ].map(({ level, title, cost, desc }) => {
              const isUnlocked = incidentState?.unlockedHints?.[level];
              return (
                <div key={level} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                      <span className="text-xs font-mono font-bold text-slate-100">{title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">{cost}</span>
                      {!isUnlocked && (
                        <button
                          onClick={() => handleUnlockHint(level)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-[10px] font-bold transition-all shadow"
                        >
                          Unlock Hint
                        </button>
                      )}
                    </div>
                  </div>

                  {isUnlocked ? (
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-200 leading-relaxed">
                      {incidentState.unlockedHints[level]}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-slate-400">{desc}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs space-y-2">
              <Brain className="w-8 h-8 mx-auto text-slate-700" />
              <p>No hypotheses evaluated yet for this scenario.</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      item.qualityBadge === 'EXCELLENT' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                      item.qualityBadge === 'SOLID' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' :
                      'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {item.qualityBadge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{item.timestamp}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-purple-300">
                    Reasoning Score: {item.score}%
                  </div>
                </div>

                <div className="space-y-1 text-xs font-mono text-slate-200">
                  <div><span className="text-purple-400 font-semibold">Hypothesis:</span> {item.hypothesis}</div>
                  <div><span className="text-cyan-400 font-semibold">Safest Action:</span> {item.safestNextAction}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>AMAN Socratic Feedback</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{item.feedback.correctness}</p>

                  {item.feedback.missingConsiderations.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-amber-400 font-semibold text-[11px]">Missing Considerations:</span>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
                        {item.feedback.missingConsiderations.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-1 text-purple-300 font-semibold text-[11px] flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-purple-400" />
                    <span>Next Direction: {item.feedback.recommendedDirection}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Latest Evaluation Highlight (if just submitted) */}
      {latestEval && activeTab === 'submit' && (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-purple-200">
                AMAN Socratic Evaluation Summary ({latestEval.score}% Score)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-purple-900 text-purple-200 font-mono text-[10px] font-bold">
              +{Math.round(latestEval.score / 2)} XP
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {latestEval.feedback.correctness}
          </p>

          <div className="text-xs font-mono text-purple-300 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
            <span><strong className="text-slate-200">Recommended Direction:</strong> {latestEval.feedback.recommendedDirection}</span>
          </div>
        </div>
      )}
    </div>
  );
};
