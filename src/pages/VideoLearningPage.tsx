import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllVideos, getVideoById, getVideosByRole } from '../data/videoLearningData';
import { getVideoRecommendationsForRole, getNextRecommendedVideo, searchVideos } from '../services/videoRecommendationEngine';
import { VideoItem, VideoLanguage } from '../types';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import {
  Play,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Search,
  Sparkles,
  Bot,
  Layers,
  Clock,
  Award,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  FileEdit,
  ExternalLink,
  Shield,
  CheckCircle,
  Video,
  ListVideo,
  RotateCcw,
  Languages,
  Copy,
  Sliders,
  Check
} from 'lucide-react';

export const VideoLearningPage: React.FC = () => {
  const {
    profile,
    videoProgressMap,
    weakSkills,
    updateVideoProgress,
    markVideoComplete,
    recordVideoQuizScore,
    toggleBookmarkVideo,
    saveVideoNotes
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const videoIdParam = searchParams.get('videoId');

  // Selected Video State
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(() => {
    if (videoIdParam) {
      const found = getVideoById(videoIdParam);
      if (found) return found;
    }
    return null;
  });

  // Filter & Search State
  const chosenRoleKey = profile?.selectedRole || profile?.targetRole || 'ethical-hacker';
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('all');
  const [activeLanguageFilter, setActiveLanguageFilter] = useState<VideoLanguage | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'in_progress' | 'completed' | 'bookmarked'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Player Sub-Tabs
  const [playerTab, setPlayerTab] = useState<'overview' | 'notes' | 'quiz' | 'practice' | 'chapters'>('overview');
  const [showQualityBreakdown, setShowQualityBreakdown] = useState<boolean>(false);

  // Note Pad State
  const [currentNotes, setCurrentNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [notesSaveSuccess, setNotesSaveSuccess] = useState<boolean>(false);
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Synchronize URL parameter when selectedVideo changes
  useEffect(() => {
    if (videoIdParam) {
      const found = getVideoById(videoIdParam);
      if (found && (!selectedVideo || selectedVideo.id !== found.id)) {
        setSelectedVideo(found);
      }
    } else {
      setSelectedVideo(null);
    }
  }, [videoIdParam]);

  // Load existing notes and quiz progress when selectedVideo changes
  useEffect(() => {
    if (selectedVideo) {
      const prog = videoProgressMap[selectedVideo.id];
      setCurrentNotes(prog?.notes || '');
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(prog?.quizScore ?? null);
      if (prog?.quizCompleted && typeof prog.quizScore === 'number') {
        setQuizSubmitted(true);
      }
      
      // Auto record initial watch start if untouched
      if (!prog) {
        updateVideoProgress(selectedVideo.id, { watchProgress: 10 });
      }
    }
  }, [selectedVideo?.id]);

  // Handle Note Auto-Save
  const handleSaveNotes = async () => {
    if (!selectedVideo) return;
    setIsSavingNotes(true);
    await saveVideoNotes(selectedVideo.id, currentNotes);
    setIsSavingNotes(false);
    setNotesSaveSuccess(true);
    setTimeout(() => setNotesSaveSuccess(false), 2500);
  };

  // Handle Copy Transcript
  const handleCopyTranscript = () => {
    if (!selectedVideo) return;
    const textToCopy = selectedVideo.transcript || selectedVideo.notesSummary || selectedVideo.description;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2500);
  };

  // Handle Quiz Submission
  const handleSubmitQuiz = async () => {
    if (!selectedVideo || !selectedVideo.quiz) return;
    const questions = selectedVideo.quiz;
    let correctCount = 0;

    questions.forEach((q, idx) => {
      const correctIdx = (q as any).correctAnswerIndex ?? q.correctIndex;
      if (quizAnswers[idx] === correctIdx) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    await recordVideoQuizScore(selectedVideo.id, calculatedScore);
  };

  // Watch Progress Simulation Helper
  const handleSimulateWatch = async (targetPercent: number) => {
    if (!selectedVideo) return;
    const isCompleted = targetPercent >= 100;
    await updateVideoProgress(selectedVideo.id, {
      watchProgress: targetPercent,
      completed: isCompleted
    });
  };

  // Calculate Overall Video Stats
  const stats = useMemo(() => {
    const all = getAllVideos();
    const progressList = Object.values(videoProgressMap);
    const completedCount = progressList.filter(p => p.completed || (p.watchProgress || 0) >= 90).length;
    const bookmarkedCount = progressList.filter(p => p.bookmarked).length;
    
    // Total duration watched in minutes
    let totalMinutesWatched = 0;
    progressList.forEach(p => {
      const vid = all.find(v => v.id === p.videoId);
      if (vid) {
        const factor = (p.watchProgress || 0) / 100;
        const durMins = Math.round((vid.durationSeconds || 600) / 60);
        totalMinutesWatched += Math.round(durMins * factor);
      }
    });

    const quizzesTaken = progressList.filter(p => typeof p.quizScore === 'number');
    const avgScore = quizzesTaken.length > 0
      ? Math.round(quizzesTaken.reduce((acc, curr) => acc + (curr.quizScore || 0), 0) / quizzesTaken.length)
      : 0;

    return {
      totalVideos: all.length,
      completedCount,
      bookmarkedCount,
      totalMinutesWatched,
      avgScore,
      progressPercentage: Math.round((completedCount / (all.length || 1)) * 100)
    };
  }, [videoProgressMap]);

  // Filtered Video List
  const filteredVideos = useMemo(() => {
    let result = getAllVideos();

    // 1. Role Filter
    if (activeRoleFilter !== 'all') {
      result = result.filter(v => 
        v.role === activeRoleFilter || 
        (v.roles && v.roles.includes(activeRoleFilter))
      );
    }

    // 2. Language Filter
    if (activeLanguageFilter !== 'all') {
      result = result.filter(v => v.language === activeLanguageFilter);
    }

    // 3. Tab Filter
    if (activeTab === 'recommended') {
      result = getVideoRecommendationsForRole(chosenRoleKey, videoProgressMap, weakSkills);
    } else if (activeTab === 'in_progress') {
      result = result.filter(v => {
        const p = videoProgressMap[v.id];
        return p && !p.completed && (p.watchProgress || 0) > 0 && (p.watchProgress || 0) < 90;
      });
    } else if (activeTab === 'completed') {
      result = result.filter(v => {
        const p = videoProgressMap[v.id];
        return p && (p.completed || (p.watchProgress || 0) >= 90);
      });
    } else if (activeTab === 'bookmarked') {
      result = result.filter(v => videoProgressMap[v.id]?.bookmarked);
    }

    // 4. Difficulty Filter
    if (selectedDifficulty !== 'all') {
      result = result.filter(v => v.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    // 5. Search Filter
    if (searchQuery.trim()) {
      result = searchVideos(searchQuery, result);
    }

    return result;
  }, [activeRoleFilter, activeLanguageFilter, activeTab, selectedDifficulty, searchQuery, chosenRoleKey, videoProgressMap, weakSkills]);

  // Handle Video Selection
  const handleSelectVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setSearchParams({ videoId: video.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedVideo(null);
    setSearchParams({});
  };

  const handleAskAmanAboutVideo = (customPrompt?: string) => {
    const prompt = customPrompt || (selectedVideo 
      ? `Namaste AMAN! I am watching the video lesson "${selectedVideo.title}" (${selectedVideo.topic}). Can you explain the core concepts and how I can apply this in our hands-on cyber range?`
      : `Namaste AMAN! What video lesson should I watch next for my ${chosenRoleKey} career path?`);

    window.dispatchEvent(
      new CustomEvent('open-aman-drawer', {
        detail: {
          prompt,
          contextData: selectedVideo ? {
            currentVideoId: selectedVideo.id,
            currentVideoTitle: selectedVideo.title,
            currentVideoTopic: selectedVideo.topic,
            roleId: selectedVideo.role
          } : undefined
        }
      })
    );
  };

  // Next recommended video for banner and sidebar
  const nextRecommended = useMemo(() => {
    return getNextRecommendedVideo(chosenRoleKey, videoProgressMap, weakSkills);
  }, [chosenRoleKey, videoProgressMap, weakSkills]);

  const getVideoDurationMinutes = (video: VideoItem): number => {
    if (typeof (video as any).durationMinutes === 'number') return (video as any).durationMinutes;
    if (video.durationSeconds) return Math.round(video.durationSeconds / 60);
    return 15;
  };

  const getVideoThumbnail = (video: VideoItem): string => {
    return video.thumbnail || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80';
  };

  const getVideoRoleTitle = (video: VideoItem): string => {
    const roleId = video.role || (video as any).roleId || '';
    const match = CAREER_ROLES_DATA.find(r => r.id === roleId);
    return match ? match.title : String(roleId).replace('-', ' ');
  };

  const currentProg = selectedVideo ? videoProgressMap[selectedVideo.id] : null;
  const currentWatchPercent = currentProg?.watchProgress || 0;
  const awardedMilestones = currentProg?.awardedMilestones || [];

  return (
    <div id="video-learning-page" className="space-y-6 pb-20 font-sans">
      
      {/* =========================================================================
          VIEW 1: ACTIVE VIDEO PLAYER & INTERACTIVE STUDIO
      ========================================================================== */}
      {selectedVideo ? (
        <div className="space-y-6">
          {/* Top Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={handleBackToCatalog}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Videos</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-400 uppercase font-bold">{getVideoRoleTitle(selectedVideo)}</span>
              {selectedVideo.language && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {selectedVideo.language}
                  </span>
                </>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 truncate max-w-[200px] sm:max-w-md">{selectedVideo.title}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quality Rating Badge */}
              <button
                onClick={() => setShowQualityBreakdown(!showQualityBreakdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
                title="View Quality Audit Score Breakdown"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{selectedVideo.qualityScore || 96}/100 VERIFIED</span>
              </button>

              {/* Bookmark Toggle */}
              <button
                onClick={() => toggleBookmarkVideo(selectedVideo.id)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  currentProg?.bookmarked
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Bookmark Video"
              >
                {currentProg?.bookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              {/* Mark Complete Toggle */}
              <button
                onClick={() => markVideoComplete(selectedVideo.id, !currentProg?.completed)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                  currentProg?.completed
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{currentProg?.completed ? 'COMPLETED' : 'MARK COMPLETE'}</span>
              </button>
            </div>
          </div>

          {/* Quality Score Breakdown Card (Toggled) */}
          {showQualityBreakdown && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    MY CYBER LAB Quality & Curriculum Audit (Score: {selectedVideo.qualityScore || 96}/100)
                  </h3>
                </div>
                <button
                  onClick={() => setShowQualityBreakdown(false)}
                  className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block font-bold">Role Relevance</span>
                  <span className="text-cyan-300 font-black">{selectedVideo.qualityBreakdown?.roleRelevance || 25} / 25</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block font-bold">Technical Accuracy</span>
                  <span className="text-emerald-300 font-black">{selectedVideo.qualityBreakdown?.technicalAccuracy || 25} / 25</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block font-bold">Teaching Clarity</span>
                  <span className="text-amber-300 font-black">{selectedVideo.qualityBreakdown?.teachingClarity || 20} / 20</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block font-bold">Language Quality</span>
                  <span className="text-purple-300 font-black">{selectedVideo.qualityBreakdown?.languageQuality || 10} / 10</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block font-bold">Practical Value</span>
                  <span className="text-pink-300 font-black">{selectedVideo.qualityBreakdown?.practicalUsefulness || 9} / 10</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block font-bold">Recency & Alignment</span>
                  <span className="text-indigo-300 font-black">{selectedVideo.qualityBreakdown?.recency || 9} / 10</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Stage: Player + Side Playlist */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: High-Fidelity Video Player + Sub-Tabs */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Responsive 16:9 Video Container */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                <iframe
                  src={selectedVideo.embedUrl}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Idempotent Progression & XP Milestone Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-300 font-bold">Watch Progression & Idempotent XP Milestones:</span>
                    <span className="text-cyan-400 font-black">{currentWatchPercent}%</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className={`px-2 py-0.5 rounded border ${awardedMilestones.includes('25') ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      25% (+2 XP)
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${awardedMilestones.includes('50') ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      50% (+3 XP)
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${awardedMilestones.includes('90') ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      90% (+5 XP)
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${awardedMilestones.includes('100') ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                      100% (+10 XP)
                    </span>
                  </div>
                </div>

                {/* Progress Visualizer Bar */}
                <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800 relative">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${currentWatchPercent}%` }}
                  />
                </div>

                {/* Quick Simulation Buttons to Test Idempotent Progression */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] font-mono text-slate-500">Fast Forward / Simulate Watch Progression:</span>
                  <div className="flex items-center gap-1.5">
                    {[25, 50, 90, 100].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => handleSimulateWatch(pct)}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          currentWatchPercent >= pct
                            ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Metadata Card */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase">
                      {getVideoRoleTitle(selectedVideo)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                      {selectedVideo.difficulty}
                    </span>
                    {selectedVideo.language && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                        <Languages className="w-3 h-3" />
                        {selectedVideo.language}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-400 bg-slate-800 border border-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getVideoDurationMinutes(selectedVideo)} mins
                    </span>
                  </div>

                  {/* AMAN AI Video Copilot Trigger */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAskAmanAboutVideo(`Namaste AMAN! Please explain the key concepts in "${selectedVideo.title}" in Hindi/Hinglish with practical cyber range examples.`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 hover:bg-purple-900/80 text-purple-300 font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                      title="Explain this lesson in Hindi / Hinglish"
                    >
                      <span>🇮🇳 Explain in Hindi</span>
                    </button>

                    <button
                      onClick={() => handleAskAmanAboutVideo()}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask AMAN Copilot</span>
                    </button>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-mono font-black text-white">
                  {selectedVideo.title}
                </h1>
                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {selectedVideo.description}
                </p>

                {/* Tags */}
                {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedVideo.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Player Sub-Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
                <button
                  onClick={() => setPlayerTab('overview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    playerTab === 'overview'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Overview & Objectives</span>
                </button>

                {selectedVideo.chapters && selectedVideo.chapters.length > 0 && (
                  <button
                    onClick={() => setPlayerTab('chapters')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                      playerTab === 'chapters'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Chapters ({selectedVideo.chapters.length})</span>
                  </button>
                )}

                <button
                  onClick={() => setPlayerTab('notes')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    playerTab === 'notes'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Notes & Transcript</span>
                </button>

                {selectedVideo.quiz && selectedVideo.quiz.length > 0 && (
                  <button
                    onClick={() => setPlayerTab('quiz')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                      playerTab === 'quiz'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Mastery Quiz (+10 XP) {quizScore !== null && `(${quizScore}%)`}</span>
                  </button>
                )}

                {(selectedVideo.relatedLab || selectedVideo.relatedMission) && (
                  <button
                    onClick={() => setPlayerTab('practice')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                      playerTab === 'practice'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Hands-On Range Bridge</span>
                  </button>
                )}
              </div>

              {/* Player Sub-Tab Content: TAB 1 OVERVIEW */}
              {playerTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Takeaways ("WHAT YOU LEARNED") */}
                  {selectedVideo.keyTakeaways && selectedVideo.keyTakeaways.length > 0 && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900/60 border border-cyan-500/30 space-y-3">
                      <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        Core Takeaways & Operational Findings
                      </h3>
                      <div className="space-y-2">
                        {selectedVideo.keyTakeaways.map((takeaway, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-slate-200 font-sans">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2" />
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning Objectives */}
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      Detailed Learning Objectives
                    </h3>
                    <div className="space-y-2.5">
                      {selectedVideo.learningObjectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-slate-300 font-sans">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prerequisites & Instructor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                      <span className="text-xs font-mono text-slate-400 uppercase font-bold">Prerequisites</span>
                      <p className="text-xs text-slate-300 font-sans">
                        {Array.isArray(selectedVideo.prerequisites) ? selectedVideo.prerequisites.join(', ') : 'Basic understanding of command line and network concepts.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                      <span className="text-xs font-mono text-slate-400 uppercase font-bold">Curated Instructor / Source</span>
                      <p className="text-xs text-cyan-300 font-sans font-bold">
                        {selectedVideo.instructor || selectedVideo.channelName || 'MY CYBER LAB Academy'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CHAPTERS */}
              {playerTab === 'chapters' && selectedVideo.chapters && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        Video Chapters & Timestamps
                      </h3>
                      <p className="text-xs text-slate-400">Jump directly to specific sub-topics and practical demonstrations.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedVideo.chapters.map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                            {ch.timestamp}
                          </span>
                          <span className="text-sm font-mono text-slate-200">{ch.title}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">Chapter {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: NOTES & TRANSCRIPT */}
              {playerTab === 'notes' && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                  {/* Curated Lecture Summary Notes */}
                  {selectedVideo.notesSummary && (
                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-mono font-bold text-cyan-400 uppercase">Curated Lecture Cheat Sheet</span>
                        <button
                          onClick={handleCopyTranscript}
                          className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer"
                        >
                          {copiedTranscript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedTranscript ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300">
                        {selectedVideo.notesSummary}
                      </pre>
                    </div>
                  )}

                  {/* Operator Personal Note Pad */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-mono font-bold text-white uppercase">Operator Personal Notes</h3>
                        <p className="text-xs text-slate-400">Notes are persisted securely to your profile.</p>
                      </div>
                      
                      <button
                        onClick={handleSaveNotes}
                        disabled={isSavingNotes}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSavingNotes ? 'Saving...' : notesSaveSuccess ? 'Saved ✓' : 'Save Notes'}
                      </button>
                    </div>

                    <textarea
                      value={currentNotes}
                      onChange={(e) => setCurrentNotes(e.target.value)}
                      placeholder="Write key command snippets, takeaways, investigation ideas, or timestamp notes..."
                      rows={6}
                      className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500/50 custom-scrollbar"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: ACTIVE-RECALL QUIZ (+10 XP) */}
              {playerTab === 'quiz' && selectedVideo.quiz && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-cyan-400" />
                        Video Mastery Quiz (+10 XP)
                      </h3>
                      <p className="text-xs text-slate-400">Score 70% or higher to cement +10 XP and pass the lesson retention check.</p>
                    </div>

                    {quizScore !== null && (
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Score</span>
                        <div className={`text-lg font-mono font-black ${quizScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {quizScore}% {quizScore >= 70 ? '✓ PASSED' : 'RETRY'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Question Cards */}
                  <div className="space-y-6">
                    {selectedVideo.quiz.map((q, qIndex) => {
                      const selectedOpt = quizAnswers[qIndex];
                      const correctIdx = (q as any).correctAnswerIndex ?? q.correctIndex;
                      const isCorrect = selectedOpt === correctIdx;

                      return (
                        <div key={qIndex} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 font-sans">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-mono font-bold text-cyan-400 shrink-0 mt-0.5">Q{qIndex + 1}.</span>
                            <p className="text-sm text-slate-200 font-semibold">{q.question}</p>
                          </div>

                          {/* Options */}
                          <div className="space-y-2 pl-5">
                            {q.options.map((opt, optIndex) => {
                              const isSelected = selectedOpt === optIndex;
                              let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700';

                              if (quizSubmitted) {
                                if (optIndex === correctIdx) {
                                  btnStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-bold';
                                } else if (isSelected && !isCorrect) {
                                  btnStyle = 'bg-rose-950/60 border-rose-500/60 text-rose-300 line-through';
                                }
                              } else if (isSelected) {
                                btnStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold';
                              }

                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => {
                                    if (!quizSubmitted) {
                                      setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
                                    }
                                  }}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && optIndex === correctIdx && (
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation post-submit */}
                          {quizSubmitted && (
                            <div className="mt-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-sans text-slate-300">
                              <strong className="text-cyan-400 font-mono">EXPLANATION: </strong>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Quiz Action Row */}
                  <div className="flex items-center justify-between pt-2">
                    {quizSubmitted ? (
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizAnswers({});
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Quiz</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(quizAnswers).length < selectedVideo.quiz.length}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
                      >
                        Submit Answers (+10 XP)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: PRACTICE LAB BRIDGE */}
              {playerTab === 'practice' && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      Cyber Range Practice Integration
                    </h3>
                    <p className="text-xs text-slate-400">Put theoretical concepts into real command terminal practice.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedVideo.relatedLab && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">HANDS-ON LAB</span>
                        <h4 className="text-sm font-mono font-bold text-white">{selectedVideo.relatedLab.name || 'Interactive Sandbox'}</h4>
                        <p className="text-xs text-slate-400">{selectedVideo.relatedLab.description || 'Practice live commands associated with this lesson topic.'}</p>
                        <Link
                          to={selectedVideo.relatedLab.route || '/practice'}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase transition-colors"
                        >
                          <span>Launch Practice Lab</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}

                    {selectedVideo.relatedMission && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">TACTICAL MISSION</span>
                        <h4 className="text-sm font-mono font-bold text-white">{selectedVideo.relatedMission.title || 'Incident Scenario'}</h4>
                        <p className="text-xs text-slate-400">{selectedVideo.relatedMission.description || 'Execute tactical mission objectives matching this video.'}</p>
                        <Link
                          to={selectedVideo.relatedMission.route || `/missions?id=${selectedVideo.relatedMission.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase transition-colors"
                        >
                          <span>Open Mission Briefing</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Right Col: Role Curriculum Playlist */}
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ListVideo className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {getVideoRoleTitle(selectedVideo)} Curriculum
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {getVideosByRole(selectedVideo.role).length} Lessons
                  </span>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
                  {getVideosByRole(selectedVideo.role).map((v, i) => {
                    const isCurrent = v.id === selectedVideo.id;
                    const prog = videoProgressMap[v.id];
                    const isDone = prog?.completed || (prog?.watchProgress || 0) >= 90;

                    return (
                      <button
                        key={v.id}
                        onClick={() => handleSelectVideo(v)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isCurrent
                            ? 'bg-cyan-950/80 border-cyan-500/80 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <span className="text-xs font-mono font-bold text-slate-500 shrink-0 mt-0.5">
                          {isDone ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            `${i + 1}.`
                          )}
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-mono font-bold truncate ${isCurrent ? 'text-cyan-300' : 'text-slate-200'}`}>
                            {v.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                            {v.language && <span className="text-amber-400 font-bold">{v.language}</span>}
                            {v.language && <span>•</span>}
                            <span>{getVideoDurationMinutes(v)}m</span>
                            <span>•</span>
                            <span>{v.topic}</span>
                          </div>
                        </div>

                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AMAN Mentor Callout */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/40 space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-mono text-xs font-bold uppercase">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>AMAN AI Companion</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Have a question regarding this video's commands, architecture, or defensive evasion? AMAN is ready to explain in depth or in Hindi/Hinglish.
                </p>
                <button
                  onClick={() => handleAskAmanAboutVideo()}
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Ask AMAN a Question
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW 2: VIDEO HUB CATALOG & ROLE RECOMMENDATION CENTER
        ========================================================================== */
        <div className="space-y-8">
          
          {/* Hero Banner with Role Radar Integration */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span>CYBERSECURITY VIDEO LEARNING SYSTEM</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-mono font-black text-white">
                  High-Fidelity Video Training Hub
                </h1>
                <p className="text-sm text-slate-300 font-sans max-w-2xl">
                  Curated video lessons across English, Hindi, and Hinglish aligned with your career role, hands-on terminal sandboxes, and active-recall quizzes.
                </p>
              </div>

              {/* Role Indicator */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center gap-3 shrink-0">
                <div className="text-2xl">🎯</div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Active Track</span>
                  <span className="text-sm font-mono font-bold text-cyan-300 capitalize">{chosenRoleKey.replace('-', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 uppercase block text-[10px] font-bold">Videos Completed</span>
                <span className="text-lg font-black text-cyan-400">{stats.completedCount} / {stats.totalVideos}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 uppercase block text-[10px] font-bold">Time Trained</span>
                <span className="text-lg font-black text-emerald-400">{stats.totalMinutesWatched} Mins</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 uppercase block text-[10px] font-bold">Quiz Average</span>
                <span className="text-lg font-black text-amber-400">{stats.avgScore}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 uppercase block text-[10px] font-bold">Bookmarked</span>
                <span className="text-lg font-black text-purple-400">{stats.bookmarkedCount}</span>
              </div>
            </div>

            {/* Featured Next Lesson Callout */}
            {nextRecommended && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-950 to-slate-950 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    RECOMMENDED NEXT LESSON FOR YOU
                  </span>
                  <h3 className="text-base font-mono font-bold text-white">
                    {nextRecommended.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    {nextRecommended.topic} • {getVideoDurationMinutes(nextRecommended)} mins • {getVideoRoleTitle(nextRecommended)} {nextRecommended.language && `• [${nextRecommended.language}]`}
                  </p>
                </div>

                <button
                  onClick={() => handleSelectVideo(nextRecommended)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Watch Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Search and Filter Controls */}
          <div className="space-y-4">
            
            {/* Search + Tab Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              
              {/* Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Videos
                </button>

                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'recommended'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎯 For My Role
                </button>

                <button
                  onClick={() => setActiveTab('in_progress')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'in_progress'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  In Progress
                </button>

                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'completed'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Completed
                </button>

                <button
                  onClick={() => setActiveTab('bookmarked')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'bookmarked'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bookmarked
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px] md:min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos, topics, tools, language..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Language Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase shrink-0 flex items-center gap-1">
                <Languages className="w-3 h-3 text-amber-400" />
                Language:
              </span>
              {(['all', 'English', 'Hindi', 'Hinglish'] as (VideoLanguage | 'all')[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLanguageFilter(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap border transition-all cursor-pointer ${
                    activeLanguageFilter === lang
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'all' ? 'All Languages' : lang === 'Hindi' ? '🇮🇳 Hindi (हिंदी)' : lang === 'Hinglish' ? '🇮🇳 Hinglish' : '🌐 English'}
                </button>
              ))}
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase shrink-0">Role Track:</span>
              <button
                onClick={() => setActiveRoleFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase whitespace-nowrap border transition-all cursor-pointer ${
                  activeRoleFilter === 'all'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All Roles
              </button>

              {CAREER_ROLES_DATA.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRoleFilter(role.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap border transition-all cursor-pointer ${
                    activeRoleFilter === role.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{role.emoji}</span> <span className="ml-1">{role.title}</span>
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-[10px] font-bold uppercase text-slate-500">Difficulty:</span>
              {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedDifficulty(lvl)}
                  className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer ${
                    selectedDifficulty === lvl
                      ? 'bg-slate-800 text-cyan-300 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const prog = videoProgressMap[video.id];
              const isCompleted = prog?.completed || (prog?.watchProgress || 0) >= 90;
              const watchPercent = prog?.watchProgress || 0;
              const isBookmarked = !!prog?.bookmarked;
              const durationMins = getVideoDurationMinutes(video);

              return (
                <div
                  key={video.id}
                  className="group rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                >
                  {/* Card Header & Thumbnail Area */}
                  <div>
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={getVideoThumbnail(video)}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Play Button Overlay */}
                      <button
                        onClick={() => handleSelectVideo(video)}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                        title="Play Video"
                      >
                        <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                      </button>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md border border-slate-800 text-cyan-300">
                            {getVideoRoleTitle(video)}
                          </span>
                          {video.language && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300">
                              {video.language}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmarkVideo(video.id);
                          }}
                          className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                            isBookmarked ? 'bg-amber-500 text-slate-950' : 'bg-slate-950/80 text-slate-300 hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bottom Duration & Quality Badge */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
                          ★ {video.qualityScore || 96}%
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/90 text-slate-300">
                          {durationMins} mins
                        </span>
                      </div>

                      {/* Watch Progress Bar */}
                      {watchPercent > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                          <div
                            className={`h-full ${isCompleted ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                            style={{ width: `${watchPercent}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span className="text-cyan-400 font-bold uppercase">{video.topic}</span>
                        <span>•</span>
                        <span className="capitalize">{video.difficulty}</span>
                        {isCompleted && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Done
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base font-mono font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {video.title}
                      </h3>

                      <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom CTA Bar */}
                  <div className="p-5 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between">
                    <button
                      onClick={() => handleSelectVideo(video)}
                      className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Watch Lesson</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {video.quiz && (
                      <span className="text-[10px] font-mono text-slate-500">
                        {video.quiz.length} Quiz Questions
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredVideos.length === 0 && (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
              <Video className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-mono font-bold text-slate-300">No video lessons found</h3>
              <p className="text-xs text-slate-500">Try changing your search query, role filter, or language selector.</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default VideoLearningPage;
