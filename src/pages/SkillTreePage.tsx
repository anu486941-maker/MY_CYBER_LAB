import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SKILL_TREE_DATA } from '../data/mockData';
import { SkillTreeNode } from '../types';
import { 
  GitBranch, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Terminal, 
  Layers, 
  Award,
  ChevronRight,
  Shield,
  Zap,
  BookOpen
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const SkillTreePage: React.FC = () => {
  const { learningState } = useApp();
  const [selectedSkill, setSelectedSkill] = useState<SkillTreeNode>(SKILL_TREE_DATA[0]);

  const masteredCount = learningState.strongSkills.length || SKILL_TREE_DATA.filter(s => s.status === 'mastered').length;
  const learningCount = learningState.weakSkills.length || SKILL_TREE_DATA.filter(s => s.status === 'learning').length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-semibold">
              TALENT & CAPABILITY MATRIX
            </span>
            <span className="text-xs font-mono text-slate-500">• {masteredCount} MASTERED • {learningCount} IN PROGRESS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Cybersecurity Skill Tree
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Progressive competency matrix across core operational domains.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Operator Capability Index: {learningState.overallMasteryPercentage}%</span>
        </div>
      </div>

      {/* Main Grid: Skill Nodes Matrix (2 Cols) + Skill Detail Inspector (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Skill Node Grid Grouped by Tiers */}
        <div className="lg:col-span-2 space-y-6">
          
          {[1, 2, 3, 4, 5, 6, 7, 8].map((tier) => {
            const tierSkills = SKILL_TREE_DATA.filter(s => s.tier === tier);
            if (tierSkills.length === 0) return null;

            return (
              <div key={tier} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    TIER {tier}: {tier === 1 ? 'HARDWARE & COMPUTER FOUNDATIONS' : tier === 2 ? 'CORE OPERATING SYSTEMS & PROTOCOLS' : tier === 3 ? 'DEFENSIVE & ETHICAL GOVERNANCE' : tier === 4 ? 'RECONNAISSANCE & DISCOVERY' : tier === 5 ? 'VULNERABILITY ASSESSMENT & WEB' : tier === 6 ? 'ENTERPRISE DOMAINS & ACTIVE DIRECTORY' : tier === 7 ? 'CTF EXPLOIT CRAFTING' : 'CAPSTONE CYBER RANGE'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tierSkills.map((skill) => {
                    const isSelected = selectedSkill.id === skill.id;
                    const isMastered = skill.status === 'mastered';
                    const isLearning = skill.status === 'learning';
                    const isLocked = skill.status === 'locked';

                    return (
                      <button
                        key={skill.id}
                        onClick={() => setSelectedSkill(skill)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                            : isMastered
                            ? 'bg-slate-900/60 border-emerald-500/40 hover:border-emerald-400'
                            : isLearning
                            ? 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400'
                            : 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-90'
                        }`}
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                              {skill.category}
                            </span>
                            {isMastered ? (
                              <StatusBadge type="mastered" label="MASTERED" size="sm" />
                            ) : isLearning ? (
                              <StatusBadge type="learning" label="LEARNING" size="sm" />
                            ) : (
                              <StatusBadge type="locked" size="sm" />
                            )}
                          </div>

                          <h3 className="font-mono font-bold text-sm text-slate-100 truncate">
                            {skill.name}
                          </h3>

                          <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                            {skill.description}
                          </p>
                        </div>

                        <div className="shrink-0 pt-1">
                          {isMastered ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : isLearning ? (
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <Lock className="w-5 h-5 text-slate-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>

        {/* Right 1 Col: Selected Skill Inspector Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 sticky top-24">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  {selectedSkill.category.toUpperCase()} • TIER {selectedSkill.tier}
                </span>
                <h2 className="text-xl font-mono font-bold text-slate-100 mt-1">
                  {selectedSkill.name}
                </h2>
              </div>
              <StatusBadge type={selectedSkill.status} />
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {selectedSkill.description}
            </p>

            {/* Key Concepts */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase block">
                CORE OPERATIONAL CONCEPTS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSkill.keyConcepts.map((concept, i) => (
                  <span key={i} className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Associated Missions */}
            {selectedSkill.associatedMissions.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase block">
                  PRACTICAL MISSIONS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.associatedMissions.map((m, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedSkill.status === 'mastered' ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500 text-center text-xs font-mono text-emerald-300 font-bold">
                ✓ CAPABILITY FULLY MASTERED
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-mono text-slate-400">
                Complete connected missions and quizzes to elevate skill tier.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
