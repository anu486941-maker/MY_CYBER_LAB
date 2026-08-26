import React, { useState, useEffect } from 'react';
import { 
  analyzeCommandSyntax, 
  CommandSyntaxAnalysis, 
  SUPPORTED_COMMAND_DATABASE,
  saveCommandBookmark,
  getSavedCommandBookmarks,
  deleteCommandBookmark,
  CommandBookmark
} from '../../utils/commandCoachEngine';
import { 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Copy, 
  RotateCcw,
  Code2,
  Info,
  ShieldAlert,
  Zap,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Target,
  Layers,
  Award,
  BookMarked,
  Sliders,
  Trash2
} from 'lucide-react';

export type LearningMode = 'GUIDED' | 'PRACTICE' | 'CHALLENGE' | 'EXAM';

interface CommandAnatomyPanelProps {
  lastCommand?: string;
  onRetryCommand?: (cmd: string) => void;
  onAskAman?: (prompt: string) => void;
  className?: string;
  defaultCollapsed?: boolean;
}

export const CommandAnatomyPanel: React.FC<CommandAnatomyPanelProps> = ({
  lastCommand = '',
  onRetryCommand,
  onAskAman,
  className = '',
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);
  const [explanationLevel, setExplanationLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [learningMode, setLearningMode] = useState<LearningMode>('GUIDED');
  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);
  const [showReferenceModal, setShowReferenceModal] = useState<boolean>(false);
  const [bookmarkTitle, setBookmarkTitle] = useState<string>('');
  const [bookmarkNote, setBookmarkNote] = useState<string>('');
  const [savedBookmarks, setSavedBookmarks] = useState<CommandBookmark[]>([]);
  const [bookmarkSaved, setBookmarkSaved] = useState<boolean>(false);
  const [examRevealed, setExamRevealed] = useState<boolean>(false);

  useEffect(() => {
    setSavedBookmarks(getSavedCommandBookmarks());
    setExamRevealed(false);
  }, [lastCommand]);

  // If no last command provided, show placeholder state
  if (!lastCommand || !lastCommand.trim()) {
    return (
      <div className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-slate-400 font-sans ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
                COMMAND ANATOMY & COACH
              </h3>
              <p className="text-xs text-slate-500">
                Type a command in the terminal to visualize its structure, options, and targets.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReferenceModal(true)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono flex items-center gap-1 cursor-pointer transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Command Guide
            </button>
          </div>
        </div>

        {/* Reference Guide Modal */}
        {showReferenceModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-5 space-y-4 text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold font-mono text-cyan-400 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" /> Command Reference Library
                </h3>
                <button 
                  onClick={() => setShowReferenceModal(false)}
                  className="text-slate-400 hover:text-slate-100 font-mono text-sm px-2 py-1 rounded bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {Object.values(SUPPORTED_COMMAND_DATABASE).map((item) => (
                  <div key={item.command} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-emerald-400">{item.command}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{item.description}</p>
                    <code className="block bg-slate-900 p-1.5 rounded text-[11px] font-mono text-amber-300 border border-slate-800">
                      {item.syntax}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Analyze syntax using commandCoachEngine
  const analysis: CommandSyntaxAnalysis = analyzeCommandSyntax(lastCommand);
  const knowledge = analysis.parsedCommand ? SUPPORTED_COMMAND_DATABASE[analysis.parsedCommand.toLowerCase()] : undefined;

  const handleSaveBookmark = () => {
    if (!bookmarkTitle.trim()) return;
    const updated = saveCommandBookmark(lastCommand, bookmarkTitle.trim(), bookmarkNote.trim());
    setSavedBookmarks(updated);
    setBookmarkSaved(true);
    setBookmarkTitle('');
    setBookmarkNote('');
    setTimeout(() => setBookmarkSaved(false), 2500);
  };

  const handleDeleteBm = (id: string) => {
    const updated = deleteCommandBookmark(id);
    setSavedBookmarks(updated);
  };

  const getTokenBgColor = (type: string) => {
    switch (type) {
      case 'COMMAND':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
      case 'OPTION':
        return 'bg-purple-950/80 border-purple-500/50 text-purple-300';
      case 'TARGET':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'ARGUMENT':
      default:
        return 'bg-blue-950/80 border-blue-500/50 text-blue-300';
    }
  };

  const getTokenBadgeColor = (type: string) => {
    switch (type) {
      case 'COMMAND':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'OPTION':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'TARGET':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'ARGUMENT':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className={`bg-slate-900/90 border ${analysis.isValid ? 'border-slate-800' : 'border-red-500/40'} rounded-2xl overflow-hidden transition-all shadow-xl font-sans ${className}`}>
      
      {/* Panel Header */}
      <div 
        className="px-4 py-3 bg-slate-900 flex items-center justify-between border-b border-slate-800/80 select-none"
      >
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2.5 cursor-pointer flex-1"
        >
          <div className={`p-1.5 rounded-lg border ${analysis.isValid ? 'bg-cyan-950/60 border-cyan-800/40 text-cyan-400' : 'bg-red-950/60 border-red-800/40 text-red-400'}`}>
            {analysis.isValid ? <Code2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
                Command Anatomy & Coach
              </h3>
              {analysis.isValid ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Valid Syntax
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 border border-red-500/30 text-red-400 flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="w-3 h-3" /> {analysis.errorType || 'Syntax Error'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-md">
              $ {lastCommand}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Learning Mode Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
            {(['GUIDED', 'PRACTICE', 'CHALLENGE', 'EXAM'] as LearningMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setLearningMode(mode)}
                className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                  learningMode === mode ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowReferenceModal(true)}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1 cursor-pointer"
            title="Command Reference Library"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={() => setShowBookmarksModal(!showBookmarksModal)}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1 cursor-pointer"
            title="Command Notes & Bookmarks"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button 
            type="button" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 cursor-pointer"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Body */}
      {!isCollapsed && (
        <div className="p-4 space-y-4 text-xs">
          
          {/* EXAM MODE MASK (If Exam mode and error exists) */}
          {learningMode === 'EXAM' && !analysis.isValid && !examRevealed ? (
            <div className="p-3.5 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-2 text-slate-200">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold rounded border border-purple-500/30">
                  EXAM MODE ACTIVE
                </span>
                <button
                  onClick={() => setExamRevealed(true)}
                  className="px-2.5 py-1 bg-purple-500 hover:bg-purple-400 text-slate-950 font-mono text-xs font-bold rounded transition-colors cursor-pointer"
                >
                  Reveal Syntax Coach Hints
                </button>
              </div>
              <p className="text-xs text-slate-300">
                In Exam Mode, automatic error hints are masked so you can test your command recall independently. Click above if you need assistance.
              </p>
            </div>
          ) : (
            <>
              {/* SECTION 1: SYNTAX ERROR DIAGNOSIS & FIX (IF INVALID) */}
              {!analysis.isValid && (
                <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-300 font-mono text-[10px] uppercase font-bold rounded border border-red-500/30">
                          {analysis.errorType || 'COMMAND ERROR'}
                        </span>
                        {analysis.typoSuggestion && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold rounded border border-amber-500/30">
                            TYPO DETECTED
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-red-200 font-mono">
                        {analysis.errorMessage}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {analysis.problemExplanation}
                      </p>
                    </div>
                  </div>

                  {/* Correct Structure Guidance */}
                  {analysis.correctStructure && (
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5 font-mono">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                        Expected Command Structure:
                      </span>
                      <div className="text-cyan-300 font-bold bg-slate-900 px-3 py-1.5 rounded border border-cyan-800/40 flex items-center justify-between">
                        <span>{analysis.correctStructure}</span>
                      </div>
                    </div>
                  )}

                  {/* Suggested Example & Quick Retry Actions */}
                  {analysis.exampleCommand && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-red-900/50">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[11px]">Suggested Fix:</span>
                        <code className="bg-slate-950 px-2.5 py-1 rounded text-emerald-400 font-mono border border-emerald-900/50">
                          {analysis.exampleCommand}
                        </code>
                      </div>

                      <div className="flex items-center gap-2">
                        {onRetryCommand && (
                          <button
                            onClick={() => onRetryCommand(analysis.exampleCommand!)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/50 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Use Suggestion
                          </button>
                        )}

                        {onAskAman && (
                          <button
                            onClick={() => onAskAman(`AMAN, explain why my command "${lastCommand}" failed and teach me how to structure it correctly.`)}
                            className="px-2.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 font-mono text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Ask AMAN
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* SECTION 2: COMMAND ANATOMY VISUAL BREAKDOWN */}
          {analysis.anatomy && analysis.anatomy.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> Token Structural Breakdown
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  POSIX Grammar Tokenizer
                </span>
              </div>

              {/* Anatomy Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {analysis.anatomy.map((part, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-xl border ${getTokenBgColor(part.type)} space-y-1`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs">
                        {part.token}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${getTokenBadgeColor(part.type)}`}>
                        {part.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-tight">
                      {part.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: RELATED CONCEPTS CHIPS */}
          {analysis.relatedConcepts && analysis.relatedConcepts.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" /> Related Concepts:
              </span>
              {analysis.relatedConcepts.map((concept, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700 text-[10px] font-mono">
                  {concept}
                </span>
              ))}
            </div>
          )}

          {/* SECTION 4: LEVEL EXPLANATION TABS */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Educational Insights
              </span>

              {/* Level Tabs */}
              <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setExplanationLevel('beginner')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                    explanationLevel === 'beginner' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => setExplanationLevel('intermediate')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                    explanationLevel === 'intermediate' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Intermediate
                </button>
                <button
                  onClick={() => setExplanationLevel('advanced')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                    explanationLevel === 'advanced' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>

            {/* Selected Explanation Text */}
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {explanationLevel === 'beginner' && (analysis.beginnerExplanation || 'Executes Linux tools step-by-step. Make sure to specify the command tool before its options or target IP.')}
              {explanationLevel === 'intermediate' && (analysis.intermediateExplanation || 'Command parser verifies token boundaries, option flags, and positional target parameters against authorized lab policy.')}
              {explanationLevel === 'advanced' && (analysis.advancedExplanation || 'Grammar parser tokenizes input into POSIX compliant argv vector. Subjected to server-side ACE scope enforcement.')}
            </p>

            {/* Knowledge Tool Common Errors / Tips */}
            {knowledge && knowledge.commonErrors && knowledge.commonErrors.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">
                  Common Pitfalls for {knowledge.command.toUpperCase()}:
                </span>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5 font-mono">
                  {knowledge.commonErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SECTION 5: BOOKMARK QUICK CREATION */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Save Command Note
              </span>
              {bookmarkSaved && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Saved to Notes
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Note Title (e.g. Nmap Service Scan)"
                value={bookmarkTitle}
                onChange={(e) => setBookmarkTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Key concept or takeaway..."
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleSaveBookmark}
              disabled={!bookmarkTitle.trim()}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-mono font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              Save to Notebook
            </button>
          </div>

        </div>
      )}

      {/* BOOKMARKS MODAL */}
      {showBookmarksModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-5 space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-mono text-amber-400 flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> Command Bookmarks & Notes
              </h3>
              <button 
                onClick={() => setShowBookmarksModal(false)}
                className="text-slate-400 hover:text-slate-100 font-mono text-sm px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            {savedBookmarks.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono py-4 text-center">
                No bookmarked commands yet. Use the Save Command Note field above to bookmark commands.
              </p>
            ) : (
              <div className="space-y-2">
                {savedBookmarks.map((bm) => (
                  <div key={bm.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-300 font-mono">{bm.title}</span>
                      <button
                        onClick={() => handleDeleteBm(bm.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <code className="block bg-slate-900 p-1.5 rounded text-xs font-mono text-emerald-400 border border-slate-800">
                      $ {bm.command}
                    </code>
                    {bm.note && <p className="text-xs text-slate-400">{bm.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REFERENCE GUIDE MODAL */}
      {showReferenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-5 space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-mono text-cyan-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" /> Command Reference Library
              </h3>
              <button 
                onClick={() => setShowReferenceModal(false)}
                className="text-slate-400 hover:text-slate-100 font-mono text-sm px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {Object.values(SUPPORTED_COMMAND_DATABASE).map((item) => (
                <div key={item.command} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-emerald-400">{item.command}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{item.description}</p>
                  <code className="block bg-slate-900 p-1.5 rounded text-[11px] font-mono text-amber-300 border border-slate-800">
                    {item.syntax}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
