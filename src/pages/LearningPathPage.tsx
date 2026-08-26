import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BEGINNER_TOPICS } from '../data/mockData';
import { LevelModule, Lesson } from '../types';
import { 
  Map, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  BookOpen, 
  Video, 
  Award, 
  ChevronRight, 
  PlayCircle,
  HelpCircle,
  Clock,
  Filter
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const LearningPathPage: React.FC = () => {
  const { levels, setSelectedLesson } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'levels' | 'beginner_cards'>('levels');

  const categories = ['All', 'Foundations', 'Linux', 'Networking', 'Offensive', 'Web', 'Defensive', 'Enterprise', 'Capstone'];

  const filteredLevels = filterCategory === 'All'
    ? levels
    : levels.filter(lvl => (lvl.category || '').toLowerCase().includes(filterCategory.toLowerCase()));

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleOpenBeginnerCard = (topic: typeof BEGINNER_TOPICS[0]) => {
    // Generate a temporary lesson object for the beginner topic
    const synthLesson: Lesson = {
      id: `beginner-${topic.id}`,
      levelId: 0,
      title: topic.title,
      duration: topic.duration,
      xpReward: 50,
      summary: topic.summary,
      theoryContent: `# ${topic.title}\n\n${topic.summary}\n\nIn cybersecurity, mastery starts with zero assumptions. When understanding ${topic.title.toLowerCase()}, always remember how data flows from user input to binary instructions in memory.\n\nKey Takeaways:\n• Understand the foundational building blocks.\n• Observe how permissions, protocol rules, and hardware interact.\n• Every higher-level vulnerability is rooted in fundamental system behaviors.`,
      videoRecommendation: {
        title: `Introduction to ${topic.title}`,
        channel: 'My Cyber Lab Academy',
        duration: topic.duration,
        tags: ['Beginner', 'Foundations', topic.category]
      },
      practiceTask: `Review your system details regarding ${topic.title.toLowerCase()} in the Linux Lab simulator.`,
      completed: true
    };
    setSelectedLesson(synthLesson);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
              CURRICULUM ROADMAP
            </span>
            <span className="text-xs font-mono text-slate-500">• 22 PROGRESSIVE LEVELS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Ethical Hacking Learning Path
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Zero to Master: From hardware logic and Linux shells to Active Directory and enterprise cyber ranges.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('levels')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'levels'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            22-LEVEL PATH
          </button>
          <button
            onClick={() => setActiveTab('beginner_cards')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'beginner_cards'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BEGINNER LESSON CARDS ({BEGINNER_TOPICS.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: 22 PROGRESSIVE LEVELS */}
      {activeTab === 'levels' && (
        <div className="space-y-6">
          
          {/* Category Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1 shrink-0 pl-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Cards List */}
          <div className="space-y-4">
            {filteredLevels.map((lvl) => {
              const isLocked = lvl.status === 'locked';
              const isMastered = lvl.status === 'mastered';
              const isLearning = lvl.status === 'learning';

              return (
                <div
                  key={lvl.level}
                  className={`p-5 rounded-2xl border transition-all ${
                    isMastered
                      ? 'bg-slate-900/40 border-emerald-500/30'
                      : isLearning
                      ? 'bg-slate-900/80 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Level Meta & Title */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                          {lvl.code}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                          LEVEL {lvl.level}
                        </span>
                        <span className="text-slate-600 font-mono">•</span>
                        <span className="text-xs font-mono text-cyan-400">{lvl.category}</span>
                        
                        <StatusBadge type={lvl.status} />
                      </div>

                      <h2 className="text-lg sm:text-xl font-mono font-bold text-slate-100">
                        {lvl.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-400 max-w-3xl font-sans leading-relaxed">
                        {lvl.description}
                      </p>
                    </div>

                    {/* Right: Lesson Count & XP Reward */}
                    <div className="flex items-center gap-4 shrink-0 self-end lg:self-center">
                      <div className="text-right font-mono text-xs">
                        <div className="text-slate-300 font-bold">
                          {lvl.completedLessons} / {lvl.lessonsCount} Lessons
                        </div>
                        <div className="text-cyan-400">+{lvl.xpReward} XP</div>
                      </div>

                      {isLocked ? (
                        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Embedded Lessons Drawer */}
                  {lvl.lessons.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">
                        LESSONS IN THIS LEVEL:
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {lvl.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleOpenLesson(lesson)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                              lesson.completed
                                ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60 text-slate-200'
                                : 'bg-slate-950 border-slate-800 hover:border-cyan-500/40 text-slate-300'
                            }`}
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                {lesson.completed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <PlayCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                )}
                                <span className="font-mono font-bold text-xs truncate text-slate-100">
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                                <span>⏱️ {lesson.duration}</span>
                                <span>+{lesson.xpReward} XP</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: BEGINNER CURRICULUM PREVIEW CARDS */}
      {activeTab === 'beginner_cards' && (
        <div className="space-y-4">
          <div className="bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/30 text-xs font-mono text-cyan-300 space-y-1">
            <span className="font-bold text-cyan-400">BEGINNER FOUNDATIONS INDEX:</span>
            <p className="text-slate-400">
              Start here if you have zero previous computer or cybersecurity knowledge. Click any lesson card to review theory, quizzes, and practice exercises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {BEGINNER_TOPICS.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleOpenBeginnerCard(topic)}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">
                      {topic.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {topic.duration}
                    </span>
                  </div>

                  <h3 className="font-mono font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {topic.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono text-cyan-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Read Lesson
                  </span>
                  <span>+50 XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
