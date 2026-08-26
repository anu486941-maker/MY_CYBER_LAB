import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { speechEngine } from '../utils/speechEngine';
import { 
  generateDailyStudyPlan,
  DailyStudyPlan
} from '../utils/learningPositionEngine';
import { 
  parseAmanActions, 
  detectVoiceIntent, 
  AmanAction 
} from '../utils/amanActionDispatcher';
import { AmanDiagnosticModal } from '../components/common/AmanDiagnosticModal';
import { AmanPathBriefingModal, PathBriefingData } from '../components/common/AmanPathBriefingModal';
import { AmanVoiceSettingsModal } from '../components/common/AmanVoiceSettingsModal';
import { AmanAudioWaveform } from '../components/common/AmanAudioWaveform';
import { AmanToolCallCard } from '../components/common/AmanToolCallCard';
import { AmanWorkflowStepsCard } from '../components/common/AmanWorkflowStepsCard';
import { AmanTurboTelemetryModal } from '../components/common/AmanTurboTelemetryModal';
import { AmanActionExecutor } from '../aman/amanActionExecutor';
import { AmanExecutionContext, ToolCallInvocation, AgentStep } from '../aman/amanTools';
import { AmanAgent } from '../aman/amanAgent';
import { 
  Bot, 
  Send, 
  Mic, 
  Square, 
  Loader2, 
  Sparkles, 
  AlertTriangle, 
  Terminal, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  User,
  Crosshair, 
  Award, 
  ArrowRight,
  Volume2,
  VolumeX,
  RotateCcw,
  Calendar,
  Compass,
  HelpCircle,
  Swords,
  BrainCircuit,
  Search,
  Briefcase,
  FileText,
  Sliders,
  Trash2,
  Copy,
  Check,
  Zap,
  Globe,
  Flame,
  Activity
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'aman';
  text: string;
  timestamp: Date;
  actions?: AmanAction[];
  toolInvocations?: ToolCallInvocation[];
  workflowSteps?: AgentStep[];
  isStreaming?: boolean;
  latencyTag?: string;
  executionPath?: string;
}

export type AmanTeachingMode = 'TEACH' | 'SOCRATIC' | 'DEBATE' | 'DEEP_DIVE' | 'LAB_MENTOR' | 'INTERVIEW' | 'EVIDENCE';

export const AiMentorPage: React.FC = () => {
  const { 
    learningState,
    profile, 
    evidenceLocker,
    addEvidence,
    deleteEvidence,
    addNotebookNote,
    setActiveCareerTrack,
    resetAllProgress,
    addXp,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Authoritative position & next move from UnifiedLearningEngine
  const { position, nextMove } = learningState;

  // Daily Study Plan state
  const [selectedPlanMinutes, setSelectedPlanMinutes] = useState<number>(30);
  const studyPlan: DailyStudyPlan = generateDailyStudyPlan(selectedPlanMinutes, position, learningState.pendingMistakes);

  // Connectivity State
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Teaching Mode State
  const [activeMode, setActiveMode] = useState<AmanTeachingMode>('TEACH');

  // Modals
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [briefingData, setBriefingData] = useState<PathBriefingData | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'msg-welcome',
    sender: 'aman',
    text: `Greetings Operator ${profile.name}. I am **AMAN Agent 2.0**, your autonomous AI Instructor and Command Agent.\n\nI can **teach** cybersecurity concepts in English or Hinglish, and **control** the application directly (opening labs, querying evidence, managing study plans, and executing multi-step missions).\n\nWhat would you like to investigate or accomplish today?`,
    timestamp: new Date()
  }]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [amanStatus, setAmanStatus] = useState<'CONNECTED' | 'SWITCHING' | 'LOCAL_GUIDANCE' | 'WEB_RESEARCH'>('CONNECTED');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Audio & Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<'slower' | 'normal' | 'faster'>('normal');
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle redirect prompt from Next Step Banner
  useEffect(() => {
    if (location.state && (location.state as any).initialPrompt) {
      handleSend((location.state as any).initialPrompt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  // Speech synthesis handlers
  const handleSpeak = (text: string) => {
    if (isMuted) return;
    const { cleanText } = parseAmanActions(text);
    // Strip markdown formatting for cleaner TTS
    const cleanSpeech = cleanText.replace(/[*#`_\[\]]/g, '').trim();
    setIsSpeaking(true);
    speechEngine.speak(cleanSpeech, {
      rate: playbackRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleStopSpeaking = () => {
    speechEngine.stop();
    setIsSpeaking(false);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    speechEngine.setMuted(nextMuted);
    if (nextMuted) {
      setIsSpeaking(false);
    }
  };

  const handleCycleRate = () => {
    const rates: ('slower' | 'normal' | 'faster')[] = ['slower', 'normal', 'faster'];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    speechEngine.setRate(nextRate);
  };

  const handleRepeat = () => {
    setIsSpeaking(true);
    speechEngine.repeat({
      rate: playbackRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  // Audio recording & Voice Intent Execution
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioSubmit(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
      // Fallback to web speech recognition if available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = profile.language === 'Hindi' ? 'hi-IN' : 'en-US';
        recognition.start();
        setIsRecording(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsRecording(false);
          if (transcript) {
            handleVoiceTranscript(transcript);
          }
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
      } else {
        alert('Microphone access is not supported or was blocked.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    const recognized = detectVoiceIntent(transcript);
    if (recognized) {
      if (recognized.action) {
        executeAction(recognized.action);
      }
      if (recognized.directPrompt) {
        handleSend(recognized.directPrompt);
        return;
      }
    }
    handleSend(transcript);
  };

  const handleAudioSubmit = async (audioBlob: Blob) => {
    setIsTyping(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await fetch('/api/aman/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioData: base64Data, mimeType: 'audio/webm' })
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            handleVoiceTranscript(data.text);
          }
        }
      };
    } catch (err) {
      console.error('Transcription error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const executeAction = (action: AmanAction) => {
    if (action.type === 'SWITCH_MODE') {
      setActiveMode(action.targetRoute as AmanTeachingMode);
    } else if (action.targetRoute) {
      navigate(action.targetRoute);
    }
  };

  // Execution Context for Tools
  const buildExecutionContext = (): AmanExecutionContext => {
    return {
      navigate,
      currentRoute: location.pathname,
      profile,
      learningState,
      evidenceLocker,
      addEvidence,
      deleteEvidence,
      addNote: addNotebookNote,
      setActiveCareerTrack,
      resetAllProgress,
      addXp,
    };
  };

  // Confirm high-impact tool execution
  const handleConfirmTool = async (messageId: string, toolCallId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg || !msg.toolInvocations) return;

    const toolCall = msg.toolInvocations.find(t => t.id === toolCallId);
    if (!toolCall) return;

    toolCall.status = 'RUNNING';
    setMessages(prev => [...prev]);

    const ctx = buildExecutionContext();
    const result = await AmanActionExecutor.executeTool(toolCall.toolName, toolCall.params, ctx, true);

    toolCall.status = result.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED';
    toolCall.result = result.result;
    toolCall.error = result.error;
    setMessages(prev => [...prev]);
  };

  const handleRejectTool = (messageId: string, toolCallId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId && m.toolInvocations) {
        return {
          ...m,
          toolInvocations: m.toolInvocations.map(t => 
            t.id === toolCallId ? { ...t, status: 'REJECTED' as const } : t
          )
        };
      }
      return m;
    }));
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort('NAVIGATION_CANCELLED');
      }
    };
  }, []);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('USER_CANCELLED');
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: `msg-${Date.now()}`,
      sender: 'aman',
      text: `Chat cleared. AMAN Agent 2.0 standing by. How can I assist your operations?`,
      timestamp: new Date()
    }]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleSend = async (text: string = inputVal, overrideMode?: AmanTeachingMode) => {
    if (!text.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort('SUPERSEDED_BY_NEW_REQUEST');
    }
    const currentController = new AbortController();
    abortControllerRef.current = currentController;

    const currentTeachingMode = overrideMode || activeMode;
    const userText = text.trim();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };
    
    const aiMsgId = `aman-${Date.now()}`;
    const aiInitialMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'aman',
      text: '',
      timestamp: new Date(),
      isStreaming: true,
      toolInvocations: [],
      workflowSteps: []
    };

    setMessages(prev => [...prev, userMsg, aiInitialMsg]);
    setInputVal('');
    setIsTyping(true);

    const execContext = buildExecutionContext();
    const history = messages.slice(-8).map(m => ({
      role: m.sender === 'aman' ? 'model' : 'user',
      text: m.text
    }));

    try {
      const response = await AmanAgent.processMessage(
        userText,
        history,
        execContext,
        currentTeachingMode,
        (chunk) => {
          setMessages(prev => prev.map(m => 
            m.id === aiMsgId ? { ...m, text: m.text + chunk } : m
          ));
        },
        (toolInv) => {
          setMessages(prev => prev.map(m => {
            if (m.id === aiMsgId) {
              const existing = m.toolInvocations || [];
              const index = existing.findIndex(t => t.id === toolInv.id);
              const updated = index >= 0 
                ? existing.map(t => t.id === toolInv.id ? toolInv : t)
                : [...existing, toolInv];
              return { ...m, toolInvocations: updated };
            }
            return m;
          }));
        },
        (step) => {
          setMessages(prev => prev.map(m => {
            if (m.id === aiMsgId) {
              const existingSteps = m.workflowSteps || [];
              const index = existingSteps.findIndex(s => s.stepNumber === step.stepNumber);
              const updatedSteps = index >= 0
                ? existingSteps.map(s => s.stepNumber === step.stepNumber ? step : s)
                : [...existingSteps, step];
              return { ...m, workflowSteps: updatedSteps };
            }
            return m;
          }));
        },
        currentController.signal
      );

      // Finalize message
      const { cleanText, actions } = parseAmanActions(response.text);
      const latTag = response.perceivedLatencyMs ? `${response.perceivedLatencyMs}ms` : undefined;

      setMessages(prev => prev.map(m => 
        m.id === aiMsgId 
          ? { 
              ...m, 
              text: cleanText || response.text, 
              actions, 
              isStreaming: false,
              toolInvocations: response.toolCalls || m.toolInvocations,
              workflowSteps: response.workflowSteps || m.workflowSteps,
              latencyTag: latTag,
              executionPath: response.executionPath
            } 
          : m
      ));

      if (response.isLocalFallback) {
        setAmanStatus('LOCAL_GUIDANCE');
      } else {
        setAmanStatus('CONNECTED');
      }

      // Read aloud if voice is unmuted
      if (!isMuted && cleanText) {
        handleSpeak(cleanText);
      }

    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.log('[AiMentorPage] Request cancelled by user.');
        return;
      }
      console.error('[AiMentorPage] Send error:', err);
      setMessages(prev => prev.map(m => 
        m.id === aiMsgId 
          ? { ...m, text: `I encountered a communication interruption. You can ask me to navigate or review topics deterministically.`, isStreaming: false }
          : m
      ));
      setAmanStatus('LOCAL_GUIDANCE');
    } finally {
      setIsTyping(false);
    }
  };

  const triggerPathBriefing = () => {
    setBriefingData({
      type: 'PATH_START',
      title: `Path Orientation: ${position.currentCourse}`,
      pathName: position.currentCourse,
      whyItMatters: `In this path, you move beyond passive theory to inspect live packet streams, configure security boundaries, and solve isolated incident investigations.`,
      whyHinglish: `Yahan hum theory ke sath practical packet analysis aur firewall configuration controlled environment mein seekhenge.`,
      prerequisitesMet: ['Linux File Permissions', 'Basic CLI Navigation'],
      keyCompetencies: ['TCP/IP Diagnostics', 'Port Reconnaissance (Nmap)', 'Protocol Header Analysis'],
      firstActionLabel: 'LAUNCH ACTIVE LAB',
      firstActionLink: '/modules',
      estimatedMinutes: 25
    });
  };

  // Helper to render formatted markdown & code blocks
  const renderMessageContent = (text: string, msgId: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].trim() || 'bash';
        const codeContent = lines.slice(1).join('\n') || lines[0];
        const blockId = `${msgId}-code-${index}`;

        return (
          <div key={index} className="my-3 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400 font-bold uppercase">{language}</span>
              <button
                onClick={() => copyToClipboard(codeContent, blockId)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCodeId === blockId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950 flex items-center justify-center border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Bot className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-mono font-bold text-white tracking-tight">
                AMAN COMMAND CENTER
              </h1>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-400">
                AGENT 2.0 • WEBSITE AGENT
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono">
                <span className={`w-2 h-2 rounded-full ${
                  !isOnline ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
                  amanStatus === 'LOCAL_GUIDANCE' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' :
                  amanStatus === 'WEB_RESEARCH' ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)] animate-pulse' :
                  'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
                }`} />
                <span className="text-slate-300 font-semibold">
                  {!isOnline ? 'OFFLINE' : 
                   amanStatus === 'LOCAL_GUIDANCE' ? 'LOCAL' : 
                   amanStatus === 'WEB_RESEARCH' ? 'WEB RESEARCH' : 
                   'ONLINE'}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 font-sans mt-1">
              General Cybersecurity AI • Website Action Control • Multi-Step Pipelines • Safe Sandbox
            </p>
          </div>
        </div>

        {/* Global Modal Triggers & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTelemetryOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold border border-amber-500/40 bg-amber-950/60 text-amber-300 hover:bg-amber-900/50 hover:border-amber-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            title="Open AMAN Turbo Telemetry & Latency Benchmark"
          >
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>TURBO STATS</span>
          </button>

          <button
            onClick={() => setIsDiagnosticOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            DIAGNOSTIC
          </button>
          
          <button
            onClick={triggerPathBriefing}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold border border-slate-700 bg-slate-900 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            BRIEFING
          </button>

          <button
            onClick={handleClearChat}
            className="px-3 py-2 rounded-xl text-xs font-mono border border-slate-800 bg-slate-950 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TEACHING MODE SELECTOR BAR */}
      <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold px-2 shrink-0">TEACHING MODE:</span>
        
        <button
          onClick={() => setActiveMode('TEACH')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeMode === 'TEACH' 
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" /> TEACH (DIRECT)
        </button>

        <button
          onClick={() => setActiveMode('SOCRATIC')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeMode === 'SOCRATIC' 
              ? 'bg-purple-500 text-slate-950 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" /> SOCRATIC COACH
        </button>

        <button
          onClick={() => setActiveMode('DEBATE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeMode === 'DEBATE' 
              ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Swords className="w-3.5 h-3.5" /> DEBATE / CHALLENGE
        </button>

        <button
          onClick={() => setActiveMode('DEEP_DIVE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeMode === 'DEEP_DIVE' 
              ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Search className="w-3.5 h-3.5" /> DEEP DIVE ARCHITECT
        </button>

        <button
          onClick={() => setActiveMode('LAB_MENTOR')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeMode === 'LAB_MENTOR' 
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" /> LAB MENTOR
        </button>

        <button
          onClick={() => setActiveMode('INTERVIEW')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeMode === 'INTERVIEW' 
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> MOCK INTERVIEW
        </button>

        <button
          onClick={() => setActiveMode('EVIDENCE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeMode === 'EVIDENCE' 
              ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> EVIDENCE MODE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: WHERE AM I? + NEXT MOVE + TODAY'S PLAN */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. WHERE YOU ARE CARD */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" /> WHERE YOU ARE
              </h2>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                LIVE
              </span>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 uppercase">CAREER PATH & LEVEL</div>
                <div className="font-bold text-slate-200 font-mono mt-0.5">{position.careerPath}</div>
                <div className="text-xs text-cyan-400 font-mono">Level {position.cyberLevel} • {profile.xp} Total XP</div>
              </div>
              
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 uppercase">ACTIVE COURSE & LESSON</div>
                <div className="font-bold text-slate-200 font-sans mt-0.5">{position.currentCourse}</div>
                <div className="text-xs text-indigo-300 font-mono">{position.currentModule} → {position.currentLesson}</div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase mb-1.5 flex justify-between">
                  <span>FOUNDATIONAL MASTERY</span>
                  <span className="text-cyan-400 font-mono font-bold">{position.overallMasteryPercentage}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${position.overallMasteryPercentage}%` }}
                  />
                </div>
              </div>

              {position.blockingSkill && (
                <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-amber-400 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> CURRENT WEAKNESS
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{position.currentWeakness}</div>
                  <div className="text-[11px] text-amber-300/80 font-sans mt-1">{position.weaknessDetail}</div>
                </div>
              )}
            </div>
          </div>

          {/* 2. AMAN'S NEXT MOVE PANEL */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-cyan-500/40 p-6 shadow-[0_0_30px_-10px_rgba(6,182,212,0.2)] relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AMAN'S NEXT MOVE
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${nextMove.badgeColor}`}>
                {nextMove.badgeLabel}
              </span>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-base font-mono font-bold text-white">{nextMove.title}</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{nextMove.whyDescription}</p>
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs font-mono text-slate-400 italic">
                "{nextMove.hinglishWhy}"
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cyan-400" /> {nextMove.timeEstimate}</div>
                <div className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-400" /> +{nextMove.xpReward} XP</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => navigate(nextMove.stepLink)}
                  className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  START <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleSend(`AMAN, explain why "${nextMove.title}" is my recommended next move in Hinglish.`, 'EVIDENCE')}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> ASK WHY
                </button>
              </div>
            </div>
          </div>

          {/* 3. TODAY'S DAILY PLAN GENERATOR */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" /> TODAY'S PLAN
              </h2>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {[15, 30, 55].map(min => (
                  <button
                    key={min}
                    onClick={() => setSelectedPlanMinutes(min)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                      selectedPlanMinutes === min 
                        ? 'bg-indigo-500 text-white font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {min}m
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 font-sans">{studyPlan.focusSummary}</p>

            <div className="space-y-2.5">
              {studyPlan.items.map((item, idx) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-colors cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-[11px] font-mono text-indigo-300 shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.description}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{item.durationMinutes}m</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CHATGPT-LIKE AI + WEBSITE AGENT CONSOLE */}
        <div className="lg:col-span-8 flex flex-col h-[820px] bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          
          {/* Chat Header & Controls */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-wrap justify-between items-center gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-1 -right-1 animate-pulse" />
                <Bot className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-slate-200">AMAN AGENT 2.0</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    MODE: {activeMode}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">AI INSTRUCTOR & OPERATING AGENT</span>
              </div>
            </div>

            {/* Voice & Quick Actions */}
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <AmanAudioWaveform barCount={8} className="mr-1" />

              <button
                onClick={() => setIsVoiceSettingsOpen(true)}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
                title="Configure AMAN Voice Persona"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleMute}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isMuted 
                    ? 'bg-slate-950 border-slate-800 text-slate-500' 
                    : 'bg-slate-950 border-slate-700 text-cyan-400 hover:text-white'
                }`}
                title={isMuted ? 'Unmute Voice' : 'Mute Voice'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {isSpeaking ? (
                <button
                  onClick={handleStopSpeaking}
                  className="px-2 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Square className="w-3 h-3 fill-current" /> STOP
                </button>
              ) : (
                <button
                  onClick={handleRepeat}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                  title="Repeat Last Voice"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleCycleRate}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 font-bold hover:bg-slate-800 cursor-pointer"
                title="Adjust Voice Speed (0.8x, 1.0x, 1.25x)"
              >
                {playbackRate === 'slower' ? '0.8x' : playbackRate === 'faster' ? '1.25x' : '1.0x'}
              </button>
            </div>
          </div>

          {/* Chat History & Interactive Agent Cards */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/90">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'aman' && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
                
                <div className={`max-w-[88%] rounded-2xl p-4.5 ${
                  msg.sender === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-sm border border-slate-700' 
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md'
                }`}>
                  {msg.sender === 'user' && (
                    <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center gap-1 justify-end">
                      OPERATOR <User className="w-3 h-3" />
                    </div>
                  )}

                  {/* Multi-Step Pipeline Widget if present */}
                  {msg.workflowSteps && msg.workflowSteps.length > 0 && (
                    <AmanWorkflowStepsCard steps={msg.workflowSteps} />
                  )}

                  {/* Render Message Body with Markdown and Code Blocks */}
                  <div className="text-sm font-sans leading-relaxed text-slate-200">
                    {renderMessageContent(msg.text, msg.id)}
                  </div>

                  {/* Tool Invocations / Confirmation Cards */}
                  {msg.toolInvocations && msg.toolInvocations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-900 space-y-2">
                      {msg.toolInvocations.map(inv => (
                        <AmanToolCallCard
                          key={inv.id}
                          toolCall={inv}
                          onConfirm={(toolId) => handleConfirmTool(msg.id, toolId)}
                          onReject={(toolId) => handleRejectTool(msg.id, toolId)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Render Action Chips if AMAN recommended quick actions */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-900 flex flex-wrap gap-2">
                      {msg.actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => executeAction(act)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          {act.label}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.sender === 'aman' && (
                    <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        {msg.latencyTag && (
                          <span 
                            onClick={() => setIsTelemetryOpen(true)}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                            title="Click to view latency telemetry breakdown"
                          >
                            <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>⚡ {msg.latencyTag}</span>
                            {msg.executionPath && (
                              <span className="text-[9px] text-slate-400 font-normal">
                                ({msg.executionPath === 'TURBO_FAST_PATH' ? 'CACHED' : 
                                  msg.executionPath === 'LOCAL_FALLBACK' ? 'LOCAL KNOWLEDGE' : 
                                  msg.executionPath === 'GEMINI_STREAM' ? 'CLOUD AI' : 
                                  msg.executionPath === 'WEB_RESEARCH' ? 'WEB RESEARCH' : 
                                  msg.executionPath})
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      {msg.text && !isMuted && !msg.isStreaming && (
                        <button
                          onClick={() => handleSpeak(msg.text)}
                          className="font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> Listen
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-900 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 rounded-tl-sm flex items-center gap-2 shadow-md">
                  <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
                  <span className="text-xs font-mono text-slate-400">AMAN is formulating guidance and evaluating agent actions...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Agent Command Chips */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend("Open Linux Lab")}
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Open Linux Lab
            </button>
            <button
              onClick={() => handleSend("What should I study next and open it")}
              className="px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-900/50 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Find next module & open it
            </button>
            <button
              onClick={() => handleSend("Show my progress and stats")}
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors cursor-pointer"
            >
              📊 Show my progress
            </button>
            <button
              onClick={() => handleSend("Open Evidence Locker")}
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors cursor-pointer"
            >
              🗄️ Evidence Locker
            </button>
            <button
              onClick={() => handleSend("Explain why an open port is NOT automatically a vulnerability in Hinglish.")}
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors cursor-pointer"
            >
              🛡️ Open Port vs Vuln (Hinglish)
            </button>
            <button
              onClick={() => {
                setActiveMode('INTERVIEW');
                handleSend("Generate 3 SOC Analyst interview questions for my level.", 'INTERVIEW');
              }}
              className="px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-xs font-mono text-amber-300 hover:bg-amber-900/50 shrink-0 transition-colors cursor-pointer"
            >
              💼 Mock Interview Qs
            </button>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/90 shrink-0">
            <div className="flex items-end gap-2">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isRecording 
                    ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500/40'
                }`}
                title="Voice Input (English / Hinglish)"
              >
                {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <div className="flex-1 relative">
                <textarea 
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask AMAN any cybersecurity question or give an agent command ('Open Linux Lab', 'Show progress')..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-sans"
                  rows={2}
                />
              </div>

              {isTyping ? (
                <button 
                  onClick={handleStopGeneration}
                  className="p-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
                  title="Stop Generating"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputVal.trim() || isTyping}
                  className="p-3.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <AmanDiagnosticModal 
        isOpen={isDiagnosticOpen} 
        onClose={() => setIsDiagnosticOpen(false)} 
      />

      <AmanPathBriefingModal 
        isOpen={!!briefingData} 
        onClose={() => setBriefingData(null)} 
        data={briefingData} 
      />

      <AmanVoiceSettingsModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
      />

      <AmanTurboTelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        executionContext={buildExecutionContext()}
      />
    </div>
  );
};
