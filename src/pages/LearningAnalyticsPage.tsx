import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SPACED_REVIEW_CARDS } from '../data/intelligenceData';
import { TRANSLATIONS } from '../data/translations';
import { 
  Activity, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Flame, 
  RotateCw, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Zap,
  BookOpen,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export const LearningAnalyticsPage: React.FC = () => {
  const { 
    learningHealth, 
    skillMasteries, 
    profile, 
    completeSpacedReview, 
    language 
  } = useApp();

  const [activeReviewCardIndex, setActiveReviewCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const t = TRANSLATIONS[language] || TRANSLATIONS.English;
  const currentCard = SPACED_REVIEW_CARDS[activeReviewCardIndex];

  const handleReviewFeedback = (success: boolean) => {
    completeSpacedReview(currentCard.id, success);
    setIsFlipped(false);
    setReviewCount(prev => prev + 1);
    if (activeReviewCardIndex + 1 < SPACED_REVIEW_CARDS.length) {
      setActiveReviewCardIndex(prev => prev + 1);
    } else {
      setActiveReviewCardIndex(0);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> LEARNER COGNITIVE TELEMETRY
            </span>
            <span className="text-xs font-mono text-slate-500">• RETENTION & HEALTH INDEX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            My Learning Health
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {t.learningHealthTitle}: Deep telemetry measuring consistent habit, conceptual depth, and lab execution.
          </p>
        </div>

        <div className="bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">HEALTH INDEX</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">
            {learningHealth.overallHealthScore}%
          </div>
        </div>
      </div>

      {/* 4 Pillars of Learning Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pillar 1: Understanding */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">{t.understanding}</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {learningHealth.understandingScore}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${learningHealth.understandingScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Measured via theory quizzes, conceptual drills, and first-attempt accuracy.
          </p>
        </div>

        {/* Pillar 2: Practical Ability */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">{t.practicalAbility}</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {learningHealth.practicalScore}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${learningHealth.practicalScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Calculated from Linux/Network sandbox executions & assessment engine grades.
          </p>
        </div>

        {/* Pillar 3: Problem Solving */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">{t.problemSolving}</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {learningHealth.problemSolvingScore}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${learningHealth.problemSolvingScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Evaluated through CTF challenges, resolved mistake drills & multi-tool decisions.
          </p>
        </div>

        {/* Pillar 4: Consistency */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase">{t.consistency}</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {learningHealth.consistencyScore}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: `${learningHealth.consistencyScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Active streak: <strong>{profile.streak} days</strong>. Total study time: <strong>{profile.labHours} hrs</strong>.
          </p>
        </div>

      </div>

      {/* Spaced Repetition Retention Engine & Skill Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Spaced Repetition Retention Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-cyan-400" /> SPACED MEMORY REFRESHER
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Card {activeReviewCardIndex + 1}/{SPACED_REVIEW_CARDS.length}</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl text-center">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold">{currentCard.skillName}</span>
              <span>INTERVAL: {currentCard.intervalDays} DAYS</span>
            </div>

            <div className="py-6 min-h-[160px] flex flex-col items-center justify-center space-y-3">
              <p className="text-sm font-mono font-semibold text-white">
                {currentCard.prompt}
              </p>

              {isFlipped ? (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs font-sans text-cyan-200 text-left w-full animate-in fade-in duration-200">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">EXACT ANSWER & CONCEPT:</div>
                  {currentCard.explanation}
                </div>
              ) : (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
                >
                  REVEAL CONCEPT ANSWER
                </button>
              )}
            </div>

            {isFlipped ? (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleReviewFeedback(false)}
                  className="p-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-mono text-xs transition-colors cursor-pointer"
                >
                  STILL HARD (1d)
                </button>
                <button
                  onClick={() => handleReviewFeedback(true)}
                  className="p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs transition-colors cursor-pointer font-bold"
                >
                  REMEMBERED (+60 XP)
                </button>
              </div>
            ) : (
              <div className="text-[10px] font-mono text-slate-500">
                Test your recall before flipping to boost long-term retention.
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Comprehensive Skill Mastery Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" /> PRO SKILL MASTERY BREAKDOWN (6-STAGE MODEL)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{skillMasteries.length} TRACKED SKILLS</span>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 gap-3">
              {skillMasteries.map((skill) => {
                let badgeColor = 'bg-slate-800 text-slate-400';
                if (skill.confidence === 'MASTERED') badgeColor = 'bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold';
                else if (skill.confidence === 'STRONG') badgeColor = 'bg-cyan-950 border border-cyan-500/40 text-cyan-300';
                else if (skill.confidence === 'COMPETENT') badgeColor = 'bg-indigo-950 border border-indigo-500/40 text-indigo-300';

                return (
                  <div key={skill.skillId} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">{skill.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({skill.category})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${badgeColor}`}>
                          {skill.confidence}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-200">{skill.masteryPercentage}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          skill.masteryPercentage >= 90 ? 'bg-emerald-400' : skill.masteryPercentage >= 70 ? 'bg-cyan-400' : 'bg-amber-400'
                        }`} 
                        style={{ width: `${skill.masteryPercentage}%` }} 
                      />
                    </div>

                    {/* 6 Stages Pill Checklist */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[10px] font-mono pt-1">
                      <span className={`p-1 rounded text-center ${skill.theoryCompleted ? 'bg-emerald-950/60 text-emerald-400' : 'bg-slate-900 text-slate-600'}`}>
                        1. Theory
                      </span>
                      <span className={`p-1 rounded text-center ${skill.practiceCompleted ? 'bg-emerald-950/60 text-emerald-400' : 'bg-slate-900 text-slate-600'}`}>
                        2. Drill ({skill.practiceScore}%)
                      </span>
                      <span className={`p-1 rounded text-center ${skill.labCompleted ? 'bg-emerald-950/60 text-emerald-400' : 'bg-slate-900 text-slate-600'}`}>
                        3. Lab ({skill.labScore}%)
                      </span>
                      <span className={`p-1 rounded text-center ${skill.assessmentCompleted ? 'bg-emerald-950/60 text-emerald-400' : 'bg-slate-900 text-slate-600'}`}>
                        4. Exam
                      </span>
                      <span className={`p-1 rounded text-center ${skill.missionCompleted ? 'bg-emerald-950/60 text-emerald-400' : 'bg-slate-900 text-slate-600'}`}>
                        5. Mission
                      </span>
                      <span className={`p-1 rounded text-center ${skill.bossCompleted ? 'bg-emerald-950/60 text-emerald-400' : 'bg-slate-900 text-slate-600'}`}>
                        6. Boss
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
