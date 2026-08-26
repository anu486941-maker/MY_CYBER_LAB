import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  AmanInstruction, 
  generateAmanInstruction, 
  parseVoiceCommand 
} from '../../utils/amanInstructionEngine';
import { 
  calculateLearnerPosition, 
  calculateNextMove 
} from '../../utils/learningPositionEngine';
import { speechEngine } from '../../utils/speechEngine';
import { 
  Bot, 
  Volume2, 
  VolumeX, 
  Mic, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  Compass, 
  RotateCcw,
  Zap,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface AmanInstructionBannerProps {
  customInstruction?: AmanInstruction | null;
  compact?: boolean;
  onActionClick?: () => void;
}

export const AmanInstructionBanner: React.FC<AmanInstructionBannerProps> = ({
  customInstruction,
  compact = false,
  onActionClick
}) => {
  const navigate = useNavigate();
  const { 
    learningState,
    profile,
    amanGuidedMode,
    setAmanGuidedMode
  } = useApp();

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  // Authoritative Single Source of Truth
  const { position, nextMove } = learningState;

  // Active Instruction
  const instruction: AmanInstruction = customInstruction || learningState.activeAmanInstruction;

  // Subscribe to speech visualizer
  useEffect(() => {
    const unsubscribe = speechEngine.subscribeVisualizer((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  // Speak Instruction Handler
  const handleSpeak = () => {
    if (speechEngine.isSpeaking()) {
      speechEngine.stop();
      setIsSpeaking(false);
      return;
    }

    const isHinglish = profile.language === 'Hinglish' || profile.language === 'Hindi';
    const textToSpeak = isHinglish ? instruction.hinglishSpokenText : instruction.spokenText;

    speechEngine.speak(textToSpeak, {
      playChime: true,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false)
    });
  };

  // Voice Command Speech Recognition
  const handleVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceFeedback('Voice recognition is not supported in this browser.');
      setTimeout(() => setVoiceFeedback(null), 3000);
      return;
    }

    setIsListening(true);
    setVoiceFeedback('Listening for commands (e.g. "Next", "Hint", "Where am I")...');

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.lang = profile.language === 'Hinglish' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setVoiceFeedback(`Command heard: "${transcript}"`);

        const result = parseVoiceCommand(transcript);
        speechEngine.speak(result.spokenResponse);

        if (result.actionRoute) {
          navigate(result.actionRoute);
        } else if (
          result.commandType === 'next' || 
          result.commandType === 'start' || 
          result.commandType === 'start_next' || 
          result.commandType === 'what_next'
        ) {
          if (instruction.primaryActionRoute) {
            navigate(instruction.primaryActionRoute);
          }
        } else if (result.commandType === 'roadmap') {
          navigate('/roadmap');
        } else if (result.commandType === 'why') {
          setShowWhyModal(true);
        }

        setTimeout(() => setVoiceFeedback(null), 4000);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceFeedback('Could not capture audio. Please try clicking the button.');
        setTimeout(() => setVoiceFeedback(null), 3000);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setVoiceFeedback('Voice mic error.');
      setTimeout(() => setVoiceFeedback(null), 3000);
    }
  };

  const handleMainAction = () => {
    if (onActionClick) {
      onActionClick();
    } else if (instruction.primaryActionRoute) {
      navigate(instruction.primaryActionRoute);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 md:p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                AMAN SENIOR INSTRUCTOR
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-semibold border border-cyan-500/30">
                AUTONOMOUS MODE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Role: <span className="text-white">{position.careerPath}</span> | Level {position.cyberLevel}
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          {/* Guided Mode Toggle */}
          <button
            onClick={() => setAmanGuidedMode(!amanGuidedMode)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              amanGuidedMode 
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-sm' 
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="When enabled, AMAN automatically manages path transitions and guides every step."
          >
            <Zap className={`w-3.5 h-3.5 ${amanGuidedMode ? 'text-emerald-400 fill-emerald-400' : ''}`} />
            <span>GUIDED MODE: {amanGuidedMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Voice Speak Button */}
          <button
            onClick={handleSpeak}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isSpeaking 
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Click to hear AMAN speak these instructions"
          >
            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Voice Command Mic */}
          <button
            onClick={handleVoiceCommand}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isListening
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-bounce'
                : 'bg-slate-800 border-slate-700 text-amber-400 hover:text-amber-300 hover:bg-slate-700'
            }`}
            title="Speak voice command (e.g., 'Next', 'Hint', 'Where am I?')"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Feedback Toast */}
      {voiceFeedback && (
        <div className="mt-2.5 p-2 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-200 font-mono text-xs flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{voiceFeedback}</span>
        </div>
      )}

      {/* Main Instruction Card Body */}
      <div className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase">
              {instruction.title}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              Est. {instruction.expectedTime}
            </span>
          </div>

          <h3 className="text-sm md:text-base font-mono font-bold text-white leading-snug">
            {instruction.whatToDo}
          </h3>

          <div className="text-xs text-slate-300 font-sans space-y-1 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <p className="flex items-start gap-1.5">
              <strong className="font-mono text-cyan-400 uppercase text-[11px] shrink-0 mt-0.5">WHY:</strong>
              <span>{instruction.why}</span>
            </p>
            <p className="flex items-start gap-1.5">
              <strong className="font-mono text-emerald-400 uppercase text-[11px] shrink-0 mt-0.5">HOW:</strong>
              <span>{instruction.howToStart}</span>
            </p>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="lg:col-span-4 flex flex-col gap-2 justify-center">
          <button
            onClick={handleMainAction}
            className="w-full py-3.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>{instruction.primaryActionLabel}</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setShowWhyModal(true)}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Educational Evidence</span>
            </button>
            <span className="text-[11px] font-mono text-slate-500">
              Target: {position.nextRequiredSkill}
            </span>
          </div>
        </div>
      </div>

      {/* Educational Evidence Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="font-mono text-base font-bold text-white">
                  Educational Evidence & Reasoning
                </h3>
              </div>
              <button 
                onClick={() => setShowWhyModal(false)}
                className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold">1. Current Mastery Baseline:</span>
                <p className="text-slate-200">{position.overallMasteryPercentage}% across {position.totalLabsCount} skill records.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold">2. Detected Weakness:</span>
                <p className="text-slate-200">{position.currentWeakness} — {position.weaknessDetail}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold">3. Prerequisite Threshold:</span>
                <p className="text-slate-200">Required skill "{position.nextRequiredSkill}" is needed before unlocking the next career mission.</p>
              </div>
            </div>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
