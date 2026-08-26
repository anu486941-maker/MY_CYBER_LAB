import React, { useState } from 'react';
import {
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Brain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface HintLevel {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  title: string;
  multiplier: number; // e.g. 1.0, 0.95, 0.90, 0.80, 0.70, 0.60
  label: string;
  content: string;
}

interface AdaptiveHintSystemProps {
  hints: {
    level0?: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
  onHintLevelChanged?: (level: number, multiplier: number) => void;
}

export const AdaptiveHintSystem: React.FC<AdaptiveHintSystemProps> = ({
  hints,
  onHintLevelChanged
}) => {
  const { addXp } = useApp();
  const [activeLevel, setActiveLevel] = useState<number>(0);
  const [revealedLevels, setRevealedLevels] = useState<number[]>([0]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const levelConfigs: { level: number; title: string; multiplier: number; label: string; desc: string }[] = [
    { level: 0, title: 'Level 0', multiplier: 1.0, label: 'Unassisted (100%)', desc: 'No hints requested. Maximum score multiplier active.' },
    { level: 1, title: 'Level 1', multiplier: 0.95, label: 'Conceptual Hint (95%)', desc: 'High-level architectural concept without revealing specific tools.' },
    { level: 2, title: 'Level 2', multiplier: 0.90, label: 'Investigation Direction (90%)', desc: 'Points toward specific protocols, files, or ports to examine.' },
    { level: 3, title: 'Level 3', multiplier: 0.80, label: 'Tool & Technique Guidance (80%)', desc: 'Recommends exact CLI tools or web security options.' },
    { level: 4, title: 'Level 4', multiplier: 0.70, label: 'Strong Guided Hint (70%)', desc: 'Provides near-complete payload structure and flags to inspect.' },
    { level: 5, title: 'Level 5', multiplier: 0.60, label: 'Full Walkthrough (60%)', desc: 'Step-by-step solution walkthrough.' }
  ];

  const getHintText = (level: number): string => {
    switch (level) {
      case 0: return hints.level0 || 'No hints requested. Rely on your investigative analysis.';
      case 1: return hints.level1;
      case 2: return hints.level2;
      case 3: return hints.level3;
      case 4: return hints.level4;
      case 5: return hints.level5;
      default: return hints.level1;
    }
  };

  const handleRevealLevel = (lvl: number) => {
    if (!revealedLevels.includes(lvl)) {
      setRevealedLevels(prev => [...prev, lvl]);
    }
    setActiveLevel(lvl);
    const config = levelConfigs.find(c => c.level === lvl) || levelConfigs[0];
    if (onHintLevelChanged) {
      onHintLevelChanged(lvl, config.multiplier);
    }
  };

  const activeConfig = levelConfigs.find(c => c.level === activeLevel) || levelConfigs[0];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-amber-500/30 overflow-hidden shadow-xl transition-all">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 flex items-center justify-between cursor-pointer select-none border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300">
                5-LEVEL ADAPTIVE HINT SYSTEM
              </span>
              <span className="px-2 py-0.2 rounded bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                Current: {activeConfig.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Adjust hint assistance without blocking learning progression.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-emerald-400">
              Score Multiplier: {(activeConfig.multiplier * 100).toFixed(0)}%
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expanded Controls */}
      {isOpen && (
        <div className="p-4 space-y-4 bg-slate-950/80">
          {/* Level Selection Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {levelConfigs.map((cfg) => {
              const isRevealed = revealedLevels.includes(cfg.level);
              const isActive = activeLevel === cfg.level;

              return (
                <button
                  key={cfg.level}
                  onClick={() => handleRevealLevel(cfg.level)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between h-20 ${
                    isActive
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                      : isRevealed
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500/50'
                      : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold">{cfg.title}</span>
                    {isRevealed ? (
                      <Unlock className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] font-mono font-semibold text-amber-400">
                      {(cfg.multiplier * 100).toFixed(0)}% Score
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 truncate">
                      {cfg.label.split('(')[0]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Hint Content Display */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {activeConfig.title}: {activeConfig.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {activeConfig.desc}
              </span>
            </div>

            <p className="text-xs font-mono text-amber-100/90 leading-relaxed whitespace-pre-wrap">
              {getHintText(activeLevel)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
