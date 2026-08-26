import React from 'react';
import { useApp } from '../../context/AppContext';
import { TRANSLATIONS } from '../../data/translations';
import { Bot, ShieldCheck, Flame, AlertCircle } from 'lucide-react';

export const ModeToggleBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { trainingMode, setTrainingMode, language } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  return (
    <div className={`p-3.5 rounded-2xl border transition-all ${
      trainingMode === 'EXAM'
        ? 'bg-red-950/40 border-red-500/40 text-red-200'
        : 'bg-purple-950/30 border-purple-500/40 text-purple-200'
    } ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            trainingMode === 'EXAM'
              ? 'bg-red-900/60 border border-red-500/50 text-red-400'
              : 'bg-purple-900/60 border border-purple-500/50 text-purple-300'
          }`}>
            {trainingMode === 'EXAM' ? <Flame className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold">
                {trainingMode === 'EXAM' ? 'EXAM MODE: PRO ASSESSMENT' : 'MENTOR MODE: AI GUIDED'}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {trainingMode === 'EXAM' ? 'TIMED & STRICT' : 'HINTS & WALKTHROUGHS'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              {trainingMode === 'EXAM' ? t.examModeStrict : t.mentorAdvice}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-end sm:self-auto">
          <button
            onClick={() => setTrainingMode('MENTOR')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              trainingMode === 'MENTOR'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MENTOR
          </button>
          <button
            onClick={() => setTrainingMode('EXAM')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              trainingMode === 'EXAM'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EXAM
          </button>
        </div>
      </div>
    </div>
  );
};
