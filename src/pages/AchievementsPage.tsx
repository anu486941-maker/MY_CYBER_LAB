import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Zap,
  Terminal,
  Clock,
  BookOpen,
  Cpu,
  Binary,
  Flag,
  Globe,
  Radio,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const AchievementsPage: React.FC = () => {
  const { achievements } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXpEarned = achievements.reduce((acc, a) => a.unlocked ? acc + (a.xpReward || a.xp || 100) : acc, 0);

  const categories = ['ALL', 'Milestone', 'Linux', 'Networking', 'CTF', 'Dedication', 'Tools', 'Web', 'Forensics'];

  const filteredAchievements = selectedCategory === 'ALL'
    ? achievements
    : achievements.filter(a => a.category?.toLowerCase() === selectedCategory.toLowerCase());

  const renderBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-6 h-6 ${isUnlocked ? 'text-amber-400' : 'text-slate-600'}`;
    switch (iconName) {
      case 'Terminal': return <Terminal className={iconClass} />;
      case 'Network': return <Globe className={iconClass} />;
      case 'BookOpen': return <BookOpen className={iconClass} />;
      case 'CheckCircle': return <CheckCircle2 className={iconClass} />;
      case 'Cpu': return <Cpu className={iconClass} />;
      case 'Binary': return <Binary className={iconClass} />;
      case 'Flag': return <Flag className={iconClass} />;
      case 'Award': return <Award className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'Flame': return <Flame className={iconClass} />;
      case 'Radio': return <Radio className={iconClass} />;
      case 'Globe': return <Globe className={iconClass} />;
      case 'Trophy': return <Trophy className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'ShieldAlert': return <ShieldAlert className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
              ACCOMPLISHMENTS & BADGES
            </span>
            <span className="text-xs font-mono text-slate-500">• {unlockedCount} OF {achievements.length} UNLOCKED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Operator Achievements
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Earn badges and XP by running commands, mastering networking, solving CTFs, and completing lab missions.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-3 text-xs font-mono">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-500">BADGE BONUS XP</div>
            <div className="text-cyan-400 font-bold font-mono">+{totalXpEarned} XP EARNED</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedCategory.toUpperCase() === cat.toUpperCase()
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const isUnlocked = ach.unlocked;
          const xpVal = ach.xpReward || ach.xp || 100;

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isUnlocked
                  ? 'bg-slate-900/70 border-amber-500/30 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    isUnlocked
                      ? 'bg-amber-950/60 border-amber-500/40 shadow-inner'
                      : 'bg-slate-900 border-slate-800'
                  }`}>
                    {renderBadgeIcon(ach.icon, isUnlocked)}
                  </div>

                  {isUnlocked ? (
                    <StatusBadge type="mastered" label="UNLOCKED" size="sm" />
                  ) : (
                    <StatusBadge type="locked" size="sm" />
                  )}
                </div>

                <div>
                  <h3 className="text-base font-mono font-bold text-slate-100">
                    {ach.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    {ach.category}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">+{xpVal} XP</span>
                {isUnlocked && ach.unlockedAt ? (
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ach.unlockedAt}
                  </span>
                ) : (
                  <span className="text-slate-600 text-[11px]">In progress</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
