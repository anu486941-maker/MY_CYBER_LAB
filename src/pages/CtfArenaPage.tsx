import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CtfChallenge } from '../types';
import { 
  Trophy, 
  Flag, 
  CheckCircle2, 
  HelpCircle, 
  Filter, 
  Sparkles, 
  Lock, 
  Award,
  Terminal,
  Shield,
  Eye,
  Key
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const CtfArenaPage: React.FC = () => {
  const { ctfChallenges, submitCtfFlag } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedChallenge, setSelectedChallenge] = useState<CtfChallenge | null>(null);
  const [flagInput, setFlagInput] = useState<string>('');
  const [submissionFeedback, setSubmissionFeedback] = useState<{ isSuccess: boolean; msg: string } | null>(null);
  const [revealedHints, setRevealedHints] = useState<{ [id: string]: boolean }>({});

  const categories = ['All', 'Linux', 'Web', 'Cryptography', 'Forensics'];

  const filteredChallenges = filterCategory === 'All'
    ? ctfChallenges
    : ctfChallenges.filter(c => c.category === filterCategory);

  const solvedCount = ctfChallenges.filter(c => c.solved).length;
  const totalScore = ctfChallenges.reduce((acc, c) => c.solved ? acc + c.points : acc, 0);

  const handleOpenChallenge = (challenge: CtfChallenge) => {
    setSelectedChallenge(challenge);
    setFlagInput('');
    setSubmissionFeedback(null);
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge || !flagInput.trim()) return;

    const result = await submitCtfFlag(selectedChallenge.id, flagInput);
    if (result && result.success) {
      setSubmissionFeedback({
        isSuccess: true,
        msg: result.message || `FLAG CAPTURED! +${selectedChallenge.points} Points & XP credited to your profile.`
      });
    } else {
      setSubmissionFeedback({
        isSuccess: false,
        msg: result?.message || 'INCORRECT FLAG. Re-inspect your clues or request a hint.'
      });
    }
  };

  const toggleHint = (id: string) => {
    setRevealedHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
              COMPETITIVE ARENA
            </span>
            <span className="text-xs font-mono text-slate-500">• {solvedCount} OF {ctfChallenges.length} SOLVED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Capture The Flag (CTF) Arena
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Solve authentic security puzzles across Linux privilege paths, web parameters, cryptography, and network captures.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] font-mono text-slate-500">ARENA SCORE</div>
              <div className="text-base font-mono font-bold text-amber-400">{totalScore} PTS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <span className="text-xs font-mono text-slate-500 flex items-center gap-1 shrink-0 pl-1">
          <Filter className="w-3 h-3" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.map((chall) => (
          <div
            key={chall.id}
            onClick={() => handleOpenChallenge(chall)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${
              chall.solved
                ? 'bg-slate-900/40 border-emerald-500/30 hover:border-emerald-500/60'
                : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/90'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400 font-bold">
                  {chall.category}
                </span>

                {chall.solved ? (
                  <StatusBadge type="mastered" label="SOLVED" />
                ) : (
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{chall.points} PTS
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-mono font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {chall.title}
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Difficulty: <strong className="text-slate-300">{chall.difficulty}</strong>
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
                {chall.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-amber-400">
                <Flag className="w-3.5 h-3.5" />
                {chall.solved ? 'Captured' : 'Submit Flag'}
              </span>
              <span>{chall.solvesCount} Solves</span>
            </div>
          </div>
        ))}
      </div>

      {/* Challenge Inspection & Submission Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-5 p-6 relative my-8 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                    {selectedChallenge.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedChallenge.difficulty}</span>
                  <span className="text-xs font-mono text-amber-400 font-bold">+{selectedChallenge.points} PTS</span>
                </div>
                <h2 className="text-xl font-mono font-bold text-slate-100 mt-1">
                  {selectedChallenge.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedChallenge(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Description & Clues */}
            <div className="space-y-4 text-xs font-mono text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-sans text-sm text-slate-300">
                <p>{selectedChallenge.description}</p>
              </div>

              {/* Hint Accordion */}
              <div className="space-y-1.5">
                <button
                  onClick={() => toggleHint(selectedChallenge.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 hover:text-amber-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {revealedHints[selectedChallenge.id] ? 'Hide Hint' : 'Reveal Tactical Clue'}
                </button>

                {revealedHints[selectedChallenge.id] && (
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs font-mono">
                    💡 <strong>HINT:</strong> {selectedChallenge.hint}
                  </div>
                )}
              </div>

              {/* Flag Submission Form */}
              <form onSubmit={handleFlagSubmit} className="space-y-3 pt-2">
                <label className="text-xs font-mono text-slate-400 block">
                  SUBMIT FLAG (FORMAT: MCL&#123;flag_text_here&#125;):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    placeholder="MCL{...}"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs cursor-pointer"
                  >
                    SUBMIT
                  </button>
                </div>
              </form>

              {/* Feedback Alert */}
              {submissionFeedback && (
                <div className={`p-3 rounded-xl border text-xs font-mono ${
                  submissionFeedback.isSuccess
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-rose-950 border-rose-500 text-rose-300'
                }`}>
                  {submissionFeedback.msg}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
