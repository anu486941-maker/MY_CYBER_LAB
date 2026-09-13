import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Shield, 
  Terminal, 
  Network, 
  Bot, 
  Trophy, 
  Compass, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Sparkles, 
  Maximize2,
  Minimize2,
  Lock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface Scene {
  id: number;
  startTime: number; // in seconds
  endTime: number;
  title: string;
  badge: string;
  onScreenText: {
    heading: string;
    subheading: string;
  };
  narration: string;
  category: 'intro' | 'problem' | 'solution' | 'roles' | 'roadmap' | 'mentor' | 'labs' | 'practice' | 'progress' | 'outro';
}

const SCENES: Scene[] = [
  {
    id: 1,
    startTime: 0,
    endTime: 8,
    title: 'The Opening',
    badge: 'SCENE 01 // 00:00 - 00:08',
    onScreenText: {
      heading: 'MY CYBER LAB',
      subheading: 'AI-POWERED CYBERSECURITY LEARNING'
    },
    narration: 'Cybersecurity is changing faster than ever. Learning it shouldn\'t be complicated.',
    category: 'intro'
  },
  {
    id: 2,
    startTime: 8,
    endTime: 20,
    title: 'The Problem',
    badge: 'SCENE 02 // 00:08 - 00:20',
    onScreenText: {
      heading: 'TOO MUCH INFORMATION',
      subheading: 'NOT ENOUGH DIRECTION'
    },
    narration: 'Beginners often face thousands of resources, complex tools, and one difficult question: what should I learn next?',
    category: 'problem'
  },
  {
    id: 3,
    startTime: 20,
    endTime: 34,
    title: 'Introducing The Platform',
    badge: 'SCENE 03 // 00:20 - 00:34',
    onScreenText: {
      heading: 'ONE PLATFORM',
      subheading: 'A STRUCTURED CYBERSECURITY JOURNEY'
    },
    narration: 'MY CYBER LAB brings that journey together in one structured learning platform.',
    category: 'solution'
  },
  {
    id: 4,
    startTime: 34,
    endTime: 47,
    title: 'Choose Your Path',
    badge: 'SCENE 04 // 00:34 - 00:47',
    onScreenText: {
      heading: 'CHOOSE YOUR ROLE',
      subheading: 'BUILD YOUR ROADMAP'
    },
    narration: 'Start by choosing your learning direction, then follow a roadmap designed to take you from the fundamentals toward practical cybersecurity skills.',
    category: 'roles'
  },
  {
    id: 5,
    startTime: 47,
    endTime: 60,
    title: 'Structured Roadmap',
    badge: 'SCENE 05 // 00:47 - 01:00',
    onScreenText: {
      heading: 'LEARN • PRACTICE • PROGRESS',
      subheading: 'CURATED COMPETENCY PATHWAYS'
    },
    narration: 'Instead of guessing what comes next, learners can move through a structured progression of concepts, modules, and practical experiences.',
    category: 'roadmap'
  },
  {
    id: 6,
    startTime: 60,
    endTime: 77,
    title: 'Meet AMAN',
    badge: 'SCENE 06 // 01:00 - 01:17 [HERO MOMENT]',
    onScreenText: {
      heading: 'MEET AMAN',
      subheading: 'YOUR AI CYBERSECURITY MENTOR'
    },
    narration: 'And at the center of the experience is AMAN — an AI mentor designed to help learners understand concepts, solve problems, and know what to do next.',
    category: 'mentor'
  },
  {
    id: 7,
    startTime: 77,
    endTime: 94,
    title: 'Practical Learning',
    badge: 'SCENE 07 // 01:17 - 01:34',
    onScreenText: {
      heading: 'PRACTICAL LEARNING',
      subheading: 'REAL SKILLS'
    },
    narration: 'Learning goes beyond theory with practical environments, security exercises, simulations, and challenge-based experiences.',
    category: 'labs'
  },
  {
    id: 8,
    startTime: 94,
    endTime: 105,
    title: 'Learn By Doing',
    badge: 'SCENE 08 // 01:34 - 01:45',
    onScreenText: {
      heading: 'LEARN BY DOING',
      subheading: 'SERVER-SIDE AUTHORITATIVE VERIFICATION'
    },
    narration: 'Every interaction is designed to turn knowledge into practical understanding.',
    category: 'practice'
  },
  {
    id: 9,
    startTime: 105,
    endTime: 113,
    title: 'Progress & Achievement',
    badge: 'SCENE 09 // 01:45 - 01:53',
    onScreenText: {
      heading: 'TRACK YOUR PROGRESS',
      subheading: 'EVIDENCE LOCKER & CRYPTOGRAPHIC PROOF'
    },
    narration: 'Track your progress as you move through your cybersecurity journey.',
    category: 'progress'
  },
  {
    id: 10,
    startTime: 113,
    endTime: 120,
    title: 'Final Brand Statement',
    badge: 'SCENE 10 // 01:53 - 02:00',
    onScreenText: {
      heading: 'MY CYBER LAB',
      subheading: 'LEARN. PRACTICE. BUILD.'
    },
    narration: 'MY CYBER LAB. Learn cybersecurity. Practice your skills. Build your future.',
    category: 'outro'
  }
];

const TOTAL_DURATION = 120; // 2 minutes in seconds

export const CinematicProductVideoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const synthVoiceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentSceneIdRef = useRef<number>(1);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Determine current active scene
  const currentScene = SCENES.find(s => currentTime >= s.startTime && currentTime < s.endTime) || SCENES[SCENES.length - 1];

  // Initialize Web Audio ambient synth pulse
  const startAmbientPulse = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A bass drone
      
      // Subtle pulsing LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.25, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.015, ctx.currentTime);
      
      lfo.connect(gain.gain);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      lfo.start();
      
      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // Ignore audio context errors gracefully
    }
  };

  const stopAmbientPulse = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  // Voice narration trigger using SpeechSynthesis
  const speakSceneNarration = (narration: string) => {
    if (!isVoiceEnabled || isMuted) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = 0.98;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Premium')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    synthVoiceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Scene transition watcher for voice triggers
  useEffect(() => {
    if (isOpen && isPlaying) {
      if (currentScene.id !== currentSceneIdRef.current) {
        currentSceneIdRef.current = currentScene.id;
        speakSceneNarration(currentScene.narration);
      }
    }
  }, [currentScene.id, isOpen, isPlaying]);

  // Main playback timer loop
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopAmbientPulse();
      return;
    }

    if (isPlaying) {
      if (!isMuted) startAmbientPulse();
      lastTickRef.current = Date.now();

      const tick = () => {
        const now = Date.now();
        const delta = (now - lastTickRef.current) / 1000;
        lastTickRef.current = now;

        setCurrentTime(prev => {
          const next = prev + delta;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(tick);
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, isPlaying]);

  const togglePlay = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      setIsPlaying(true);
      currentSceneIdRef.current = 1;
      speakSceneNarration(SCENES[0].narration);
      return;
    }
    
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
    } else {
      setIsPlaying(true);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.resume();
      }
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    const targetScene = SCENES.find(s => newTime >= s.startTime && newTime < s.endTime) || SCENES[0];
    currentSceneIdRef.current = targetScene.id;
    speakSceneNarration(targetScene.narration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-300">
      <div 
        ref={containerRef}
        className={`relative w-full max-w-6xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 max-w-none rounded-none z-50' : 'aspect-[16/9] max-h-[90vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-cyan-300 tracking-wider">
                MY CYBER LAB // 2:00 LAUNCH SHOWCASE
              </span>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-slate-400">
              {currentScene.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (nextMute) {
                  stopAmbientPulse();
                  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
                } else {
                  startAmbientPulse();
                  speakSceneNarration(currentScene.narration);
                }
              }}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
                stopAmbientPulse();
                onClose();
              }}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700/60 transition-colors"
              title="Close Showcase"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Stage / Video Viewport */}
        <div className="relative flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
          {/* Background Futuristic Grid / Circuitry Animation */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none" />

          {/* SCENE RENDERER */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center select-none">
            {/* SCENE 1: THE OPENING */}
            {currentScene.id === 1 && (
              <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95 duration-1000">
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                  <Shield className="w-12 h-12 text-cyan-400 animate-pulse" />
                  <div className="absolute inset-0 rounded-2xl border border-cyan-400/20 animate-ping opacity-25" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-6xl font-mono font-black tracking-tight text-white">
                    MY CYBER LAB
                  </h1>
                  <p className="font-mono text-sm sm:text-base text-cyan-400 tracking-widest uppercase font-semibold">
                    AI-POWERED CYBERSECURITY LEARNING
                  </p>
                </div>
              </div>
            )}

            {/* SCENE 2: THE PROBLEM */}
            {currentScene.id === 2 && (
              <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 font-mono text-xs tracking-wider">
                  <span>THE BEGINNER'S DILEMMA</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-mono font-black text-white leading-tight">
                  TOO MUCH INFORMATION.<br />
                  <span className="text-rose-400">NOT ENOUGH DIRECTION.</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono text-slate-400">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">Scattered Tutorials</div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">Complex Tools</div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">No Structured Path</div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">Unclear Next Steps</div>
                </div>
              </div>
            )}

            {/* SCENE 3: INTRODUCING THE PLATFORM */}
            {currentScene.id === 3 && (
              <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-700">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>THE UNIFIED PLATFORM</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-mono font-black text-white">
                  ONE PLATFORM.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400">
                    A STRUCTURED CYBERSECURITY JOURNEY.
                  </span>
                </h2>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Guided Roadmaps</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> AMAN AI Mentor</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Hands-On Labs</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Evidence Locker</div>
                </div>
              </div>
            )}

            {/* SCENE 4: CHOOSE YOUR PATH */}
            {currentScene.id === 4 && (
              <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-right-6 duration-700">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest font-bold">CAREER TRACKS</span>
                  <h2 className="text-2xl sm:text-4xl font-mono font-black text-white">
                    CHOOSE YOUR ROLE. BUILD YOUR ROADMAP.
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
                  <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 shadow-lg shadow-cyan-950/20">
                    <Shield className="w-6 h-6 text-cyan-400 mb-2" />
                    <h3 className="font-mono font-bold text-white text-sm">SOC Analyst</h3>
                    <p className="text-xs text-slate-300 mt-1">SIEM log investigation, alert triage, incident response.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 shadow-lg shadow-rose-950/20">
                    <Terminal className="w-6 h-6 text-rose-400 mb-2" />
                    <h3 className="font-mono font-bold text-white text-sm">Ethical Hacker</h3>
                    <p className="text-xs text-slate-300 mt-1">Reconnaissance, port enumeration, web vulnerability testing.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 shadow-lg shadow-emerald-950/20">
                    <Network className="w-6 h-6 text-emerald-400 mb-2" />
                    <h3 className="font-mono font-bold text-white text-sm">Network Defender</h3>
                    <p className="text-xs text-slate-300 mt-1">Packet inspection, routing topologies, subnet engineering.</p>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 5: STRUCTURED ROADMAP */}
            {currentScene.id === 5 && (
              <div className="max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-700">
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">PROGRESSION PIPELINE</span>
                <h2 className="text-2xl sm:text-4xl font-mono font-black text-white">
                  LEARN • PRACTICE • PROGRESS
                </h2>
                <div className="flex items-center justify-between gap-2 p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono">
                  <div className="flex-1 p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">1. Foundations</div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                  <div className="flex-1 p-2 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300">2. Linux & Net</div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                  <div className="flex-1 p-2 rounded bg-amber-950 border border-amber-500/40 text-amber-300">3. Web & SOC</div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                  <div className="flex-1 p-2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">4. CTF Checkpoint</div>
                </div>
              </div>
            )}

            {/* SCENE 6: MEET AMAN (HERO MOMENT) */}
            {currentScene.id === 6 && (
              <div className="max-w-4xl space-y-5 animate-in fade-in zoom-in-90 duration-700">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 font-mono text-xs tracking-wider">
                  <Bot className="w-4 h-4 text-teal-400" />
                  <span>HERO SYSTEM // AMAN AI AGENT</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-mono font-black text-white">
                  MEET AMAN.<br />
                  <span className="text-teal-400">YOUR AI CYBERSECURITY MENTOR.</span>
                </h2>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-teal-500/30 text-left space-y-2 max-w-xl mx-auto text-xs font-mono">
                  <div className="text-teal-400 font-bold flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" /> AMAN (Autonomous Mentor):
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    "I noticed you're inspecting port 80. Look at the authentication header for parameter manipulation before running an automated scan."
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-[10px] text-teal-300">
                    <span className="px-2 py-0.5 rounded bg-teal-950 border border-teal-500/30">Multi-Turn Reasoning</span>
                    <span className="px-2 py-0.5 rounded bg-teal-950 border border-teal-500/30">Voice Interaction</span>
                    <span className="px-2 py-0.5 rounded bg-teal-950 border border-teal-500/30">Socratic Hints</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 7: PRACTICAL LEARNING */}
            {currentScene.id === 7 && (
              <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-left-6 duration-700">
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold">CONTROLLED LAB ECOSYSTEM</span>
                <h2 className="text-2xl sm:text-4xl font-mono font-black text-white">
                  PRACTICAL LEARNING. REAL SKILLS.
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-left">
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300">
                    <Terminal className="w-4 h-4 mb-1 text-emerald-400" />
                    <strong>Linux Lab</strong>
                    <div className="text-[10px] text-slate-400 mt-1">Bash triage, permissions</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-blue-500/30 text-blue-300">
                    <Network className="w-4 h-4 mb-1 text-blue-400" />
                    <strong>Network Lab</strong>
                    <div className="text-[10px] text-slate-400 mt-1">Topology & packet traces</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300">
                    <Shield className="w-4 h-4 mb-1 text-amber-400" />
                    <strong>Web Security</strong>
                    <div className="text-[10px] text-slate-400 mt-1">OWASP Top 10 exercises</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-rose-500/30 text-rose-300">
                    <Trophy className="w-4 h-4 mb-1 text-rose-400" />
                    <strong>CTF Arena</strong>
                    <div className="text-[10px] text-slate-400 mt-1">Real flag discovery</div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 8: LEARN BY DOING */}
            {currentScene.id === 8 && (
              <div className="max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-700">
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">AUTHORITATIVE VERIFICATION</span>
                <h2 className="text-3xl sm:text-5xl font-mono font-black text-white">
                  LEARN BY DOING.
                </h2>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 max-w-lg mx-auto text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>FLAG CHECKPOINT:</span>
                    <span className="text-emerald-400 font-bold">SERVER-VERIFIED ✓</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 font-mono text-xs text-emerald-400 border border-emerald-500/30 flex items-center justify-between">
                    <span>FLAG&#123;SOC_AUTH_ANOMALY_1042&#125;</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">+100 XP</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 9: PROGRESS & ACHIEVEMENT */}
            {currentScene.id === 9 && (
              <div className="max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-700">
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold">PROVABLE MASTERY</span>
                <h2 className="text-3xl sm:text-5xl font-mono font-black text-white">
                  TRACK YOUR PROGRESS.
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700">
                    <div className="text-cyan-400 font-bold mb-1">Evidence Locker</div>
                    <div className="text-slate-400 text-[11px]">Tamper-evident verification records of completed labs.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700">
                    <div className="text-emerald-400 font-bold mb-1">Skill Verification</div>
                    <div className="text-slate-400 text-[11px]">Cryptographically verifiable learning checkpoints.</div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 10: FINAL BRAND STATEMENT */}
            {currentScene.id === 10 && (
              <div className="max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-1000">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                  <Shield className="w-10 h-10 text-cyan-400" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-6xl font-mono font-black text-white tracking-tight">
                    MY CYBER LAB
                  </h1>
                  <p className="text-base sm:text-xl font-mono text-cyan-400 font-bold tracking-widest">
                    LEARN. PRACTICE. BUILD.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs tracking-wider">
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    my-cyber-lab.vercel.app
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Subtitle / Voice Caption Banner */}
          <div className="absolute bottom-16 inset-x-0 z-20 px-4 sm:px-12 pointer-events-none text-center">
            <div className="inline-block max-w-3xl px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-md shadow-2xl">
              <p className="text-xs sm:text-sm font-sans font-medium text-slate-200 leading-snug">
                "{currentScene.narration}"
              </p>
            </div>
          </div>
        </div>

        {/* Video Timeline & Scrubbing Control Bar */}
        <div className="relative z-30 bg-slate-950 border-t border-slate-800/80 px-4 sm:px-6 py-3 space-y-2.5">
          {/* Progress bar scrubber */}
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              handleSeek(Math.min(TOTAL_DURATION, Math.max(0, clickPos * TOTAL_DURATION)));
            }}
            className="group relative w-full h-2 rounded-full bg-slate-800 cursor-pointer overflow-hidden"
          >
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-75"
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            />
          </div>

          {/* Controls & Chapter Markers */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(true);
                  currentSceneIdRef.current = 1;
                  speakSceneNarration(SCENES[0].narration);
                }}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
                title="Replay from Beginning"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="text-slate-300 font-semibold tracking-wider">
                {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            {/* Scene Jump Pills */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-xl py-0.5">
              {SCENES.map((scene) => {
                const isActive = currentScene.id === scene.id;
                return (
                  <button
                    key={scene.id}
                    onClick={() => handleSeek(scene.startTime)}
                    className={`px-2 py-1 rounded text-[10px] font-mono transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {scene.id}. {scene.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
