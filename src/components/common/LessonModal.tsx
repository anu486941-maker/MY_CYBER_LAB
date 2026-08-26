import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  BookOpen, 
  Video, 
  HelpCircle, 
  CheckCircle2, 
  Terminal, 
  Sparkles, 
  Award,
  Edit3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const LessonModal: React.FC = () => {
  const { selectedLesson, setSelectedLesson, completeLesson, addNote } = useApp();
  const [activeTab, setActiveTab] = useState<'theory' | 'video' | 'interactive' | 'quiz' | 'practice'>('theory');
  
  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quickNoteText, setQuickNoteText] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  if (!selectedLesson) return null;

  const isCompleted = selectedLesson.completed;

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
  };

  const handleCompleteLesson = () => {
    completeLesson(selectedLesson.id, selectedLesson.levelId);
  };

  const handleSaveQuickNote = () => {
    if (!quickNoteText.trim()) return;
    addNote({
      title: `Notes: ${selectedLesson.title}`,
      category: 'Concepts',
      content: quickNoteText,
      tags: ['Lesson', `Level-${selectedLesson.levelId}`]
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-6 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-cyan-400">LEVEL {selectedLesson.levelId}</span>
                <span className="text-slate-600 font-mono">•</span>
                <span className="text-xs font-mono text-slate-400">{selectedLesson.duration}</span>
                {isCompleted && (
                  <StatusBadge type="mastered" label="COMPLETED" size="sm" />
                )}
              </div>
              <h2 className="text-sm sm:text-base font-mono font-bold text-slate-100 truncate">
                {selectedLesson.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedLesson(null);
              setSelectedAnswer(null);
              setQuizSubmitted(false);
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/60 px-5 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            THEORY
          </button>

          {selectedLesson.videoRecommendation && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              VIDEO
            </button>
          )}

          {selectedLesson.interactiveExample && (
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'interactive'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              EXAMPLE
            </button>
          )}

          {selectedLesson.quiz && (
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              QUIZ
            </button>
          )}

          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            PRACTICE
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar text-slate-200">
          
          {/* TAB: THEORY */}
          {activeTab === 'theory' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                <span className="font-bold text-cyan-400">OBJECTIVE SUMMARY:</span> {selectedLesson.summary}
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-line font-sans space-y-3">
                {selectedLesson.theoryContent}
              </div>

              {/* Quick Note Box */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    ADD QUICK NOTE TO NOTEBOOK:
                  </label>
                  {noteSaved && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Notebook!
                    </span>
                  )}
                </div>
                <textarea
                  value={quickNoteText}
                  onChange={(e) => setQuickNoteText(e.target.value)}
                  placeholder="Record your personal notes, insights, or command snippets from this lesson..."
                  className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSaveQuickNote}
                  disabled={!quickNoteText.trim()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          {/* TAB: VIDEO RECOMMENDATION */}
          {activeTab === 'video' && selectedLesson.videoRecommendation && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                      CURATED VIDEO RECOMMENDATION
                    </span>
                    <h3 className="text-base font-mono font-bold text-slate-100 mt-1.5">
                      {selectedLesson.videoRecommendation.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Channel / Creator: {selectedLesson.videoRecommendation.channel} • {selectedLesson.videoRecommendation.duration}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedLesson.videoRecommendation.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono flex items-center justify-between">
                  <span>Search query: &ldquo;{selectedLesson.videoRecommendation.title} {selectedLesson.videoRecommendation.channel}&rdquo;</span>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedLesson.videoRecommendation.title + ' ' + selectedLesson.videoRecommendation.channel)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline"
                  >
                    Search on YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INTERACTIVE EXAMPLE */}
          {activeTab === 'interactive' && selectedLesson.interactiveExample && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-cyan-300">
                    {selectedLesson.interactiveExample.title}
                  </h3>
                  <StatusBadge type="simulation" label="INTERACTIVE DEMO" />
                </div>
                
                <p className="text-xs text-slate-400">
                  {selectedLesson.interactiveExample.description}
                </p>

                <div className="bg-black/90 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <div className="text-slate-500 mb-2 font-mono text-[11px]">// SIMULATED DATA INSPECTION</div>
                  <code>{selectedLesson.interactiveExample.codeOrData}</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB: QUIZ */}
          {activeTab === 'quiz' && selectedLesson.quiz && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">CONCEPT CHECKPOINT QUIZ</span>
                  <span className="text-xs font-mono text-slate-400">+75 XP Reward</span>
                </div>

                <h3 className="text-sm sm:text-base font-mono font-semibold text-slate-100">
                  {selectedLesson.quiz.question}
                </h3>

                <div className="space-y-2">
                  {selectedLesson.quiz.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === selectedLesson.quiz!.correctIndex;
                    
                    let btnClass = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-950/60 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-mono flex items-center justify-between gap-3 cursor-pointer transition-all ${btnClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {quizSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswer === null}
                    className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-mono font-bold text-xs cursor-pointer shadow-sm"
                  >
                    SUBMIT ANSWER
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs font-mono">
                    <div className="font-bold text-slate-200">
                      {selectedAnswer === selectedLesson.quiz.correctIndex ? (
                        <span className="text-emerald-400">CORRECT! Excellent analysis.</span>
                      ) : (
                        <span className="text-rose-400">INCORRECT. Review the explanation below:</span>
                      )}
                    </div>
                    <p className="text-slate-400">{selectedLesson.quiz.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: PRACTICE */}
          {activeTab === 'practice' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-cyan-300">PRACTICE EXERCISE</h3>
                  <StatusBadge type="simulation" label="HANDS-ON TASK" />
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  {selectedLesson.practiceTask}
                </p>

                <div className="text-xs text-slate-400 font-mono">
                  Tip: Use the <span className="text-cyan-400 font-bold">Linux Lab</span> or <span className="text-cyan-400 font-bold">Network Lab</span> from the sidebar navigation to test your practice commands in simulation mode.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3.5 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Reward: +{selectedLesson.xpReward} XP</span>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <button
                onClick={handleCompleteLesson}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-mono font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                MARK LESSON COMPLETED
              </button>
            ) : (
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                LESSON MASTERED
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
