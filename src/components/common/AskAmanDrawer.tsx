import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCareerRoleById, CAREER_ROLES_DATA } from '../../data/careerRolesData';
import { CYBER_LAB_MODULES } from '../../data/cyberLabModulesData';
import { BOSS_CHALLENGES } from '../../data/bossChallengesData';
import { speechEngine } from '../../utils/speechEngine';
import { calculateLearnerPosition, calculateNextMove } from '../../utils/learningPositionEngine';
import { 
  parseAmanActions, 
  detectVoiceIntent, 
  AmanAction 
} from '../../utils/amanActionDispatcher';
import { generateLocalGuidanceResponse } from '../../utils/amanLocalGuidance';
import { AmanVoiceSettingsModal } from './AmanVoiceSettingsModal';
import { AmanAudioWaveform } from './AmanAudioWaveform';
import { 
  Bot, 
  Send, 
  Mic, 
  Square, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Gauge, 
  Loader2, 
  Sparkles, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Compass, 
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
  GraduationCap,
  ArrowRight,
  Sliders,
  Radio
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'aman';
  text: string;
  timestamp: Date;
  spoken?: boolean;
  actions?: AmanAction[];
  parts?: any[];
}

interface AskAmanDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AskAmanDrawer: React.FC<AskAmanDrawerProps> = ({ isOpen: controlledIsOpen, onClose }) => {
  const { 
    learningState,
    profile, 
    levels,
    missions,
    ctfChallenges,
    selectedLesson, 
    selectedMission,
    updateProfile
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    if (!val && onClose) onClose();
  };
  const [isMinimized, setIsMinimized] = useState(false);
  const [coachMode, setCoachMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [amanStatus, setAmanStatus] = useState<'CONNECTED' | 'SWITCHING' | 'LOCAL_GUIDANCE'>('CONNECTED');
  
  // Voice Controls
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<'slower' | 'normal' | 'faster'>('normal');
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Authoritative position & next move from UnifiedLearningEngine
  const { position, nextMove } = learningState;

  // Initialize welcome message once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-init',
          sender: 'aman',
          text: `Namaste Operator ${profile.name}! I am AMAN, your personal AI cybersecurity instructor. You are currently at Level ${profile.cyberLevel} in ${position.currentCourse}. Ask me for hints, concept breakdowns in Hinglish or English, or click "Where am I?".`,
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Listen for custom global events to open AMAN with specific prompt
  useEffect(() => {
    const handleOpenWithPrompt = (e: any) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e.detail && e.detail.prompt) {
        handleSend(e.detail.prompt);
      }
    };
    window.addEventListener('open-aman-drawer', handleOpenWithPrompt);
    return () => window.removeEventListener('open-aman-drawer', handleOpenWithPrompt);
  }, []);

  // Voice recording
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
      // Fallback: Web Speech API recognition if supported
      startSpeechRecognitionFallback();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startSpeechRecognitionFallback = () => {
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
          handleSend(transcript);
        }
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    } else {
      alert('Microphone access is not supported in this browser environment.');
    }
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
            await handleSend(data.text);
          }
        }
      };
    } catch (err) {
      console.error('Transcription error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const executeAction = (act: AmanAction) => {
    if (act.type === 'OPEN_LEARNING_PATH' && act.parameter) {
      const targetPath = CAREER_ROLES_DATA.find(r => r.id === act.parameter);
      if (targetPath) {
        updateProfile({ targetRole: targetPath.id as any });
      }
    }
    if (act.targetRoute) {
      navigate(act.targetRoute);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    // Send speech transcript directly to AMAN native agent for tool calling & pedagogical response
    handleSend(transcript);
  };

  // TTS Controls
  const handleSpeak = (text: string) => {
    if (isMuted) return;
    const { cleanText } = parseAmanActions(text);
    setIsSpeaking(true);
    speechEngine.speak(cleanText, {
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

  // Main chat send
  const tryResolveLocalCommand = async (text: string): Promise<boolean> => {
    const query = text.toLowerCase().trim().replace(/[?.,!]$/, '');

    let localResponseText = '';
    let localActions: AmanAction[] = [];

    if (query === 'hi' || query === 'hi aman' || query === 'hello' || query === 'hello aman' || query === 'namaste' || query === 'namaste aman') {
      const activeRole = CAREER_ROLES_DATA.find(r => r.id === profile.targetRole)?.title || 'Ethical Hacker';
      localResponseText = `Namaste Operator ${profile.name}! I am AMAN, your Socratic Learning Orchestrator. You are currently on the **${activeRole}** path at Level ${profile.cyberLevel} (${profile.rank}). How can I guide your hands-on laboratory practice today?`;
      localActions = [{ type: 'OPEN_DASHBOARD', targetRoute: '/dashboard', label: '📊 Open Dashboard' }];
    }
    else if (query === 'what can you do' || query === 'what can you do?' || query === 'help' || query === 'kya kar sakte ho') {
      localResponseText = `As the central learning orchestrator of My Cyber Lab, I can:\n\n1. 🎓 **Guide Career Paths**: Say *"I want to become an ethical hacker"* or *"Switch to SOC"*\n2. 🔄 **Resume Curriculum**: Say *"Continue my course"* or *"What's next?"*\n3. 🖥️ **Command Coaching**: Say *"Explain nmap"* or try standard tools in the terminal\n4. 🎯 **Deploy Missions**: Say *"Give me a mission"* or *"Give me a harder mission"*\n5. 📁 **Analyze Real Cases**: Say *"Give me a real case"*\n6. 🗣️ **Interview Practice**: Say *"Interview me"*\n7. 🗣️ **Hinglish Mode**: Say *"Teach me in Hinglish"* or *"Main kaha tak pahucha?"*`;
      localActions = [
        { type: 'OPEN_LEARNING_PATH', targetRoute: '/learning-path', label: '🎓 View Learning Path' },
        { type: 'OPEN_ROADMAP', targetRoute: '/roadmap', label: '🗺️ View Career Roadmap' }
      ];
    }
    else if (query === 'continue' || query === 'continue learning' || query === 'continue my course' || query === 'continue karo' || query === 'aage badho' || query === 'resume') {
      const nextAct = nextMove || { title: 'Foundations Hands-On Lab', activityId: 'module-01-intro-cyber', actionType: 'LAB' };
      localResponseText = `Done. I've switched you to your saved learning position and opened **${nextAct.title}**. Let's keep making progress!`;
      localActions = [{
        type: 'RESUME_LEARNING',
        targetRoute: nextAct.actionType === 'LAB' ? `/modules/${nextAct.activityId}` : '/learning-path',
        label: `🔄 Resume: ${nextAct.title}`
      }];
      if (nextAct.actionType === 'LAB') {
        navigate(`/modules/${nextAct.activityId}`);
      } else {
        navigate('/learning-path');
      }
    } 
    else if (query === 'where am i' || query === 'where am i?' || query === 'main kaha hoon' || query === 'kaha tak pahucha' || query === 'kahan hoon' || query === 'kahan tak pahucha' || query === 'main kaha tak pahucha?' || query === 'main kaha tak pahucha' || query === 'main kahan tak pahucha') {
      const roleName = CAREER_ROLES_DATA.find(r => r.id === profile.targetRole)?.title || 'Ethical Hacker';
      localResponseText = `You are currently on the **${roleName}** track.\n\n- **Current Level**: Level ${profile.cyberLevel} (${profile.rank})\n- **Total XP**: ${profile.xp} XP\n- **Overall Mastery**: ${position.overallMasteryPercentage}%\n- **Active Milestone**: ${position.nextRequiredSkill || 'Network Fundamentals'}`;
      localActions = [
        { type: 'OPEN_ROADMAP', targetRoute: '/roadmap', label: '🗺️ Open Career Roadmap' },
        { type: 'OPEN_LEARNING_PATH', targetRoute: '/learning-path', label: '🎓 Open Learning Path' }
      ];
    }
    else if (query === "what's next" || query === "what's next?" || query === "what is next" || query === "what should i learn next" || query === "what should i learn next?" || query === "what should i do next" || query === "agla kya hai" || query === "agla lesson kholo") {
      const nextAct = nextMove || { title: 'Foundations Hands-On Lab', activityId: 'module-01-intro-cyber', actionType: 'LAB' };
      const reasonStr = (nextAct as any).reason || 'To reinforce foundational skills and unlock advanced tracks';
      localResponseText = `Based on your active learning sequence, your next recommended activity is:\n\n**${nextAct.title}**\n*(Reason: ${reasonStr})*\n\nLet's get started!`;
      localActions = [{
        type: 'RESUME_LEARNING',
        targetRoute: nextAct.actionType === 'LAB' ? `/modules/${nextAct.activityId}` : '/learning-path',
        label: `🚀 Launch Next: ${nextAct.title}`
      }];
    }
    else if (query === 'open roadmap' || query === 'show roadmap' || query === 'open my roadmap' || query === 'roadmap kholo' || query === 'roadmap') {
      localResponseText = "Opening your interactive career path roadmap now. Check out the custom-curated training stages!";
      localActions = [{ type: 'OPEN_ROADMAP', targetRoute: '/roadmap', label: '🗺️ Open Career Roadmap' }];
      navigate('/roadmap');
    }
    else if (query === 'open learning path' || query === 'learning path' || query === 'learning path kholo') {
      localResponseText = "Loading your personal curriculum progress and skill matrix view.";
      localActions = [{ type: 'OPEN_LEARNING_PATH', targetRoute: '/learning-path', label: '🎓 Open Learning Path' }];
      navigate('/learning-path');
    }
    else if (query === 'open linux' || query === 'open terminal' || query === 'open linux terminal' || query === 'linux terminal' || query === 'linux lab' || query === 'terminal' || query === 'linux terminal kholo') {
      localResponseText = "Launching the secure, sandboxed Linux Learning Terminal. Get ready for hands-on command practice!";
      localActions = [{ type: 'OPEN_LAB', targetRoute: '/linux-lab', label: '🖥️ Open Linux Lab' }];
      navigate('/linux-lab');
    }
    else if (
      query.includes('ethical hacking') || 
      query.includes('ethical hacker') || 
      query.includes('pentester') || 
      query.includes('penetration testing') || 
      query.includes('hacking seekhni') || 
      query.includes('hacking seekhna') || 
      query.includes('ethical hacker banna')
    ) {
      updateProfile({ targetRole: 'ethical-hacker' });
      localResponseText = "Done. I have switched your active career path to **Ethical Hacker**. Your previous progress has been preserved.";
      localActions = [{ type: 'OPEN_LEARNING_PATH', targetRoute: '/learning-path', label: '🎓 Open Ethical Hacker Path', parameter: 'ethical-hacker' }];
      navigate('/learning-path');
    }
    else if (
      query.includes('soc') || 
      query.includes('blue team') || 
      query.includes('soc analyst')
    ) {
      updateProfile({ targetRole: 'soc-analyst' });
      localResponseText = "Done. I have switched your active career path to **SOC Analyst**. Your previous progress has been preserved.";
      localActions = [{ type: 'OPEN_LEARNING_PATH', targetRoute: '/learning-path', label: '🎓 Open SOC Analyst Path', parameter: 'soc-analyst' }];
      navigate('/learning-path');
    }
    else if (
      query.includes('cloud security') || 
      query.includes('cloud-security')
    ) {
      updateProfile({ targetRole: 'cloud-security' });
      localResponseText = "Done. I have switched your active career path to **Cloud Security Specialist**. Your previous progress has been preserved.";
      localActions = [{ type: 'OPEN_LEARNING_PATH', targetRoute: '/learning-path', label: '🎓 Open Cloud Security Path', parameter: 'cloud-security' }];
      navigate('/learning-path');
    }
    else if (query === 'teach me networking' || query === 'networking' || query.includes('networking')) {
      localResponseText = "Loading the **Networking Fundamentals** module index. Networking is the bedrock of cybersecurity. Let's study IP addresses, subnets, and TCP handshake concepts!";
      localActions = [{ type: 'OPEN_LEARNING_PATH', targetRoute: '/learning-path', label: '🎓 Open Networking Module' }];
      navigate('/learning-path');
    }
    else if (query === 'explain nmap' || query === 'nmap' || query === 'explain command') {
      localResponseText = `### Command Anatomy: Nmap\n\n\`nmap [options] [target]\`\n\n- **nmap**: The network exploration tool and port scanner (Program).\n- **-sV**: Probe open ports to determine service/version info (Option).\n- **10.50.0.15**: The destination machine IP (Target).\n\nWould you like me to open the terminal lab to test this?`;
      localActions = [{ type: 'OPEN_LAB', targetRoute: '/linux-lab', label: '🖥️ Launch Linux Terminal' }];
    }
    else if (query === 'nmap 10.50.0.15' || query === '10.50.0.15 nmap') {
      if (query === '10.50.0.15 nmap') {
        localResponseText = `### ⚠️ INCORRECT COMMAND SYNTAX DETECTED\n\n- **Entered**: \`10.50.0.15 nmap\`\n- **What is wrong**: You placed the IP address before the program name.\n- **Why it is wrong**: The terminal interpreter processes arguments from left to right. It expects a program first, then flags/arguments.\n- **Expected Syntax**: \`nmap [options] [target]\`\n- **Correct Example**: \`nmap 10.50.0.15\`\n\nLet's open the Linux Lab to run this correctly!`;
      } else {
        localResponseText = `### Command Anatomy: Nmap\n\n\`nmap 10.50.0.15\`\n\n- **nmap**: Port scanning binary (Program).\n- **10.50.0.15**: Destination server (Target).\n\nThis will perform a default SYN stealth scan on the target. Let's open the Linux Lab to test it!`;
      }
      localActions = [{ type: 'OPEN_LAB', targetRoute: '/linux-lab', label: '🖥️ Launch Linux Terminal' }];
    }
    else if (query === 'give me a mission' || query === 'challenge do' || query === 'mission do' || query === 'mission' || query === "give me my mission" || query === "give me today's mission" || query === "give me today's mission?") {
      const activeMission = missions.find(m => !m.completed) || missions[0];
      localResponseText = `Roger that. Based on your active track, I've selected the mission: **${activeMission?.title || 'System Reconnaissance'}** (Difficulty: ${activeMission?.difficulty || 'Beginner'}). Let's launch this training scenario!`;
      localActions = [{
        type: 'OPEN_MISSION',
        targetRoute: '/dashboard',
        label: `🎯 Open Mission: ${activeMission?.title || 'Missions'}`,
        parameter: activeMission?.id
      }];
    }
    else if (query.includes('harder mission') || query === 'give me a harder mission') {
      const activeMission = missions.find(m => !m.completed && m.difficulty === 'Intermediate') || missions.find(m => m.difficulty === 'Advanced') || missions[missions.length - 1];
      localResponseText = `Challenge accepted! I've selected a highly advanced mission scenario for you: **${activeMission?.title || 'Advanced Pentesting Case'}** (Difficulty: ${activeMission?.difficulty || 'Advanced'}). This requires strong analytical thinking. Let's start!`;
      localActions = [{
        type: 'OPEN_MISSION',
        targetRoute: '/dashboard',
        label: `🎯 Start Advanced Mission: ${activeMission?.title || 'Missions'}`,
        parameter: activeMission?.id
      }];
    }
    else if (query === 'show me a real case related to what i\'m learning' || query === 'real case' || query === 'show me a real case' || query === 'real cases' || query === 'give me a real case') {
      localResponseText = "Interesting! Let's explore real-world cases corresponding to your current module. I'm opening the **APT37 Target Enumeration** case study, showing how real offensive security operators conduct stealth reconnaissance.";
      localActions = [{ type: 'OPEN_DASHBOARD', targetRoute: '/dashboard', label: '📁 Open Real Cases' }];
      navigate('/dashboard');
    }
    else if (query === 'teach me in hinglish' || query === 'hinglish' || query === 'explain in hinglish' || query === 'hindi' || query === 'mujhe ethical hacking seekhni hai') {
      updateProfile({ language: 'Hinglish' as any });
      localResponseText = "Haan bilkul! Ab se main saare concepts Hinglish mein explain karunga. Aapka progress bilkul safe hai. Chalo, seekhte hain!";
    }
    else if (query === 'make it harder' || query === 'increase difficulty' || query === 'harder' || query === 'difficulty badhao') {
      setCoachMode(true);
      localResponseText = "Done. I have updated your AI instructor feedback settings to **Socratic Coach**. From now on, I will provide minimal hints to challenge your technical reasoning.";
    }
    else if (query === 'interview me' || query === 'mock interview' || query === 'interview me for an ethical hacking job' || query === 'test me' || query === 'test') {
      localResponseText = "Initiating the Technical Mock Interview simulator. I will assess your knowledge, communication, and analytical thinking. Ready?\n\n**Question 1**: Describe the main differences between TCP and UDP, and how a port scanner exploits these protocols.";
    }
    else if (query === "what should i do today?" || query === "today's plan" || query === "daily plan" || query === "aj ka plan") {
      localResponseText = `### TODAY'S STRATEGIC MILESTONES\n\n1. Progress on current course: **${position.currentCourse}**\n2. Solve the next hands-on lab task in **${position.currentModule}**\n3. Spend 15 minutes practicing terminal commands in the **Linux Lab**\n4. Review identified weak area: **${position.currentWeakness || 'Subnetting'}**\n5. Complete your active daily mission scenario to maintain your **${profile.streakDays || 1} day streak**!`;
    }
    else if (query === 'show my progress' || query === 'progress' || query === 'show progress') {
      localResponseText = `### YOUR LEARNING PROGRESS REPORT\n\n- **Target Track**: ${profile.targetRole}\n- **Level**: Level ${profile.cyberLevel} (${profile.rank})\n- **XP**: ${profile.xp} XP\n- **Total Completed Labs**: ${position.completedLabsCount}\n- **Strengths**: Linux, Reconnaissance\n- **Weak Areas**: Web Security (28%), Reporting (35%)`;
      localActions = [{ type: 'OPEN_DASHBOARD', targetRoute: '/dashboard', label: '📊 View Progress Analytics' }];
    }

    if (localResponseText) {
      setIsTyping(false);
      const aiMsgId = `aman-local-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: aiMsgId,
        sender: 'aman',
        text: localResponseText,
        actions: localActions,
        timestamp: new Date()
      }]);

      if (!isMuted) {
        handleSpeak(localResponseText);
      }
      return true;
    }

    return false;
  };

  const handleSend = async (text: string = inputVal, messageParts?: any[]) => {
    if (!text.trim() && !messageParts) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text ? text.trim() : '[System Call]',
      parts: messageParts,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!messageParts) setInputVal('');
    setIsTyping(true);

    // Fast local deterministic commands check
    try {
      const wasResolved = await tryResolveLocalCommand(text);
      if (wasResolved) {
        return;
      }
    } catch (localErr) {
      console.warn('Local command resolution failed, falling back to network:', localErr);
    }

    const activeContext = {
      currentPage: location.pathname,
      careerPath: position.careerPath,
      currentCourse: position.currentCourse,
      currentModule: position.currentModule,
      currentLesson: selectedLesson?.title || position.currentLesson,
      currentWeakness: position.currentWeakness,
      nextRequiredSkill: position.nextRequiredSkill,
      masteryPercentage: position.overallMasteryPercentage,
      coachMode: coachMode ? 'ENABLED (Ask guiding questions, give hints, do not reveal full solution directly)' : 'DISABLED (Direct, comprehensive answers)',
      language: profile.language || 'Auto'
    };

    try {

      const history = messages.slice(-10).map(m => ({
        role: m.sender === 'aman' ? 'model' : 'user',
        parts: m.parts ? m.parts : [{ text: m.text }]
      }));

      const res = await fetch('/api/aman/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageParts ? messageParts : (text ? text.trim() : ''), 
          history, 
          contextData: activeContext,
          mode: coachMode ? 'SOCRATIC' : 'TEACH'
        })
      });

      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const aiMsgId = `aman-${Date.now()}`;
      
      setMessages(prev => [...prev, { id: aiMsgId, sender: 'aman', text: '', timestamp: new Date() }]);
      let accumulatedRawText = '';
      let pendingFunctionCalls: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.amanStatus) {
                setAmanStatus(data.amanStatus);
              }
              if (data.text) {
                accumulatedRawText += data.text;
                const { cleanText, actions } = parseAmanActions(accumulatedRawText);
                setMessages(prev => prev.map(m => 
                  m.id === aiMsgId ? { ...m, text: cleanText, actions } : m
                ));
              }
              if (data.functionCalls) {
                pendingFunctionCalls = data.functionCalls;
                setMessages(prev => prev.map(m => 
                  m.id === aiMsgId ? { ...m, parts: [{ functionCall: data.functionCalls[0] }] } : m
                ));
              }
            } catch (e) {
              // chunk parsing
            }
          }
        }
      }

      // Auto-speak response if not muted and voice is preferred
      if (!isMuted && accumulatedRawText) {
        handleSpeak(accumulatedRawText);
      }

      // Execute tool calls if any
      if (pendingFunctionCalls.length > 0) {
        const functionResponses = pendingFunctionCalls.map(call => {
           let result: any = { status: 'success' };
           try {
             const args = call.args || {};
             switch (call.name) {
               // Telemetry & Learner State Query Tools
               case 'getLearnerProfile':
                 result = {
                   name: profile.name,
                   cyberLevel: profile.cyberLevel,
                   careerPath: profile.careerPath,
                   xp: profile.xp,
                   rank: profile.rank,
                   streakDays: profile.streakDays,
                   language: profile.language || 'English'
                 };
                 break;

               case 'getLearningState':
                 result = {
                   position,
                   nextMove,
                   overallMasteryPercentage: position.overallMasteryPercentage,
                   completedLessonsCount: position.completedLessonsCount,
                   completedMissionsCount: position.completedMissionsCount,
                   currentWeakness: position.currentWeakness,
                   nextRequiredSkill: position.nextRequiredSkill
                 };
                 break;

               case 'getCurrentPosition':
                 result = {
                   careerPath: position.careerPath,
                   cyberLevel: position.cyberLevel,
                   currentCourse: position.currentCourse,
                   currentModule: position.currentModule,
                   currentLesson: position.currentLesson,
                   progressPercentage: position.progressPercentage,
                   overallMasteryPercentage: position.overallMasteryPercentage,
                   currentWeakness: position.currentWeakness,
                   weaknessDetail: position.weaknessDetail,
                   nextRequiredSkill: position.nextRequiredSkill
                 };
                 break;

               case 'getRoadmap':
                 result = {
                   careerPath: profile.careerPath,
                   cyberLevel: profile.cyberLevel,
                   stages: (learningState as any).roadmap || CAREER_ROLES_DATA.find(r => r.id === profile.careerPath)?.curriculumSequence || []
                 };
                 break;

               case 'getNextLearningAction':
                 result = nextMove || {
                   actionType: 'LAB',
                   title: 'Foundations Hands-On Lab',
                   reason: 'Continue core competency development',
                   activityId: 'module-01-intro-cyber'
                 };
                 break;

               case 'getAvailablePaths':
                 result = CAREER_ROLES_DATA.map(r => ({ id: r.id, title: r.title, description: r.shortDescription }));
                 break;

               case 'getAvailableModules':
                 result = CYBER_LAB_MODULES.map(m => {
                   const isUnlocked = m.id === 'module-01-intro-cyber' || (profile.cyberLevel >= (m.difficulty === 'Hard' || m.difficulty === 'Expert' ? 3 : m.difficulty === 'Intermediate' ? 2 : 1));
                   return {
                     id: m.id,
                     title: m.title,
                     category: m.category,
                     difficulty: m.difficulty,
                     unlocked: isUnlocked
                   };
                 });
                 break;

               case 'getAvailableLabs':
                 result = CYBER_LAB_MODULES.map(m => ({
                   id: m.id,
                   title: m.title,
                   category: m.category,
                   difficulty: m.difficulty,
                   tasksCount: m.tasks.length
                 }));
                 break;

               case 'getAvailableMissions':
                 result = missions.map(m => ({
                   id: m.id,
                   title: m.title,
                   difficulty: m.difficulty,
                   unlocked: m.unlocked,
                   xp: m.xp
                 }));
                 break;

               // Controlled Application Navigation Tools
               case 'openDashboard':
                 navigate('/dashboard');
                 result = { status: 'success', navigatedTo: '/dashboard' };
                 break;

               case 'openRoadmap':
                 navigate('/roadmap');
                 result = { status: 'success', navigatedTo: '/roadmap' };
                 break;

               case 'openLearningPath': {
                 const targetPath = CAREER_ROLES_DATA.find(r => r.id === args.pathId);
                  if (targetPath) {
                    updateProfile({ targetRole: targetPath.id as any });
                  }
                 if (!targetPath) {
                   result = { status: 'error', error: `Career path '${args.pathId}' not found. Available paths: ${CAREER_ROLES_DATA.map(r => r.id).join(', ')}` };
                 } else {
                   navigate('/learning-path');
                   result = { status: 'success', navigatedTo: '/learning-path', pathId: targetPath.id, title: targetPath.title };
                 }
                 break;
               }

               case 'openModule': {
                 const targetMod = CYBER_LAB_MODULES.find(m => m.id === args.moduleId || m.slug === args.moduleId);
                 if (!targetMod) {
                   result = { status: 'error', error: `Module '${args.moduleId}' does not exist.` };
                 } else {
                   // Prerequisite lock verification
                   const isUnlocked = targetMod.id === 'module-01-intro-cyber' || (profile.cyberLevel >= (targetMod.difficulty === 'Hard' || targetMod.difficulty === 'Expert' ? 3 : targetMod.difficulty === 'Intermediate' ? 2 : 1));
                   if (!isUnlocked) {
                     result = {
                       status: 'locked',
                       error: `Module '${targetMod.title}' is currently locked. Complete 'Cybersecurity Foundations & The CIA Triad' (module-01-intro-cyber) to unlock it.`,
                       requiredPrerequisite: 'module-01-intro-cyber'
                     };
                   } else {
                     navigate(`/modules/${targetMod.id}`);
                     result = { status: 'success', navigatedTo: `/modules/${targetMod.id}`, moduleTitle: targetMod.title };
                   }
                 }
                 break;
               }

               case 'openLesson': {
                 navigate(`/modules/${args.lessonId || 'module-01-intro-cyber'}`);
                 result = { status: 'success', navigatedTo: `/modules/${args.lessonId || 'module-01-intro-cyber'}` };
                 break;
               }

               case 'openLab': {
                 const targetLabMod = CYBER_LAB_MODULES.find(m => m.id === args.labId || m.slug === args.labId);
                 if (args.labId === 'network-lab' || args.labId === 'network') {
                   navigate('/network-lab');
                   result = { status: 'success', navigatedTo: '/network-lab' };
                 } else if (args.labId === 'linux-lab' || args.labId === 'linux') {
                   navigate('/linux-lab');
                   result = { status: 'success', navigatedTo: '/linux-lab' };
                 } else if (args.labId === 'web-security-lab' || args.labId === 'web') {
                   navigate('/web-security-lab');
                   result = { status: 'success', navigatedTo: '/web-security-lab' };
                 } else if (targetLabMod) {
                   const isUnlocked = targetLabMod.id === 'module-01-intro-cyber' || (profile.cyberLevel >= (targetLabMod.difficulty === 'Hard' || targetLabMod.difficulty === 'Expert' ? 3 : targetLabMod.difficulty === 'Intermediate' ? 2 : 1));
                   if (!isUnlocked) {
                     result = {
                       status: 'locked',
                       error: `Lab '${targetLabMod.title}' is currently locked. Complete 'Cybersecurity Foundations' (module-01-intro-cyber) first.`,
                       requiredPrerequisite: 'module-01-intro-cyber'
                     };
                   } else {
                     navigate(`/modules/${targetLabMod.id}`);
                     result = { status: 'success', navigatedTo: `/modules/${targetLabMod.id}`, labTitle: targetLabMod.title };
                   }
                 } else {
                   navigate('/modules');
                   result = { status: 'success', navigatedTo: '/modules' };
                 }
                 break;
               }

               case 'openMission': {
                 const targetMission = missions.find(m => m.id === args.missionId);
                 if (!targetMission) {
                   result = { status: 'error', error: `Mission '${args.missionId}' not found.` };
                 } else if (!targetMission.unlocked) {
                   result = {
                     status: 'locked',
                     error: `Mission '${targetMission.title}' is locked. Complete the prerequisite missions first.`,
                     requiredPrerequisites: targetMission.prerequisites || ['Foundation Level']
                   };
                 } else {
                   navigate('/missions');
                   result = { status: 'success', navigatedTo: '/missions', missionTitle: targetMission.title };
                 }
                 break;
               }

               case 'openCtfChallenge': {
                 const challenge = ctfChallenges.find(c => c.id === args.challengeId);
                 navigate('/ctf');
                 result = { status: 'success', navigatedTo: '/ctf', challengeTitle: challenge?.title || args.challengeId };
                 break;
               }

               case 'openBoss': {
                 const boss = BOSS_CHALLENGES.find(b => b.id === args.bossId);
                 if (!boss) {
                   result = { status: 'error', error: `Boss challenge '${args.bossId}' not found.` };
                 } else {
                   navigate('/missions');
                   result = { status: 'success', navigatedTo: '/missions', bossTitle: boss.title };
                 }
                 break;
               }

               case 'openCapstone': {
                 navigate('/missions');
                 result = { status: 'success', navigatedTo: '/missions', capstoneId: args.capstoneId };
                 break;
               }

               case 'openSocSimulator':
                 navigate('/soc-simulator');
                 result = { status: 'success', navigatedTo: '/soc-simulator' };
                 break;

               case 'openNetworkLab':
                 navigate('/network-lab');
                 result = { status: 'success', navigatedTo: '/network-lab' };
                 break;

               case 'openLinuxLab':
                 navigate('/linux-lab');
                 result = { status: 'success', navigatedTo: '/linux-lab' };
                 break;

               case 'openMistakes':
                 navigate('/mistakes');
                 result = { status: 'success', navigatedTo: '/mistakes' };
                 break;

               case 'startNext': {
                 const target = nextMove || { actionType: 'LAB', activityId: 'module-01-intro-cyber' };
                 if (target.actionType === 'MISSION') {
                   navigate('/missions');
                 } else if (target.actionType === 'PRACTICE' || target.actionType === 'REVISION') {
                   navigate('/practice');
                 } else if (target.actionType === 'ASSESSMENT') {
                   navigate('/exam');
                 } else {
                   navigate(`/modules/${(target as any).activityId || (target as any).targetId || 'module-01-intro-cyber'}`);
                 }
                 result = { status: 'success', executedAction: target };
                 break;
               }

               case 'showWhereAmI':
                 navigate('/roadmap');
                 result = {
                   status: 'success',
                   navigatedTo: '/roadmap',
                   position: {
                     careerPath: position.careerPath,
                     cyberLevel: position.cyberLevel,
                     currentCourse: position.currentCourse,
                     currentModule: position.currentModule,
                     progressPercentage: position.progressPercentage,
                     overallMasteryPercentage: position.overallMasteryPercentage
                   }
                 };
                 break;

               case 'showWhatNext':
                 navigate('/dashboard');
                 result = {
                   status: 'success',
                   navigatedTo: '/dashboard',
                   nextAction: nextMove
                 };
                 break;

               case 'startTodayPlan':
                 navigate('/dashboard');
                 result = { status: 'success', navigatedTo: '/dashboard' };
                 break;

               default:
                 result = { status: 'rejected', error: `Unauthorized or unknown tool '${call.name}'. Action execution is prohibited.` };
             }
           } catch(e: any) {
             result = { status: 'error', error: e.message };
           }
           return {
             functionResponse: {
               name: call.name,
               response: result
             }
           };
        });

        // Recursively send the function response back to Gemini
        await handleSend('', functionResponses);
      }

    } catch (err) {
      console.error('Chat error:', err);
      const userLang = profile.language || 'Auto';
      const localResp = generateLocalGuidanceResponse(text || 'Hello', activeContext, userLang);
      const { cleanText, actions } = parseAmanActions(localResp.fullText);
      setMessages(prev => [...prev, {
        id: `aman-${Date.now()}`,
        sender: 'aman',
        text: cleanText,
        actions,
        timestamp: new Date()
      }]);
      setAmanStatus('LOCAL_GUIDANCE');
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <aside 
        aria-label="Ask AMAN AI Learning Assistant"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3"
      >
        {/* Quick Voice Trigger Banner */}
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 px-4 py-2.5 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          title="Ask AMAN (Voice & Socratic AI Coach)"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse border-2 border-slate-950" />
          </div>
          
          <div className="text-left hidden sm:block pr-1">
            <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <span>ASK AMAN</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-[9px] text-cyan-300">AI INSTRUCTOR</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>Voice & Hinglish Ready</span>
              <AmanAudioWaveform barCount={6} />
            </div>
          </div>
        </button>
      </aside>
    );
  }

  return (
    <>
      <aside 
        aria-label="AMAN AI Instructor Assistant Panel"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end"
      >
        <div 
          className={`w-[95vw] sm:w-[440px] bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-[64px]' : 'h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">AMAN INSTRUCTOR</span>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[9px] font-mono">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      amanStatus === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' :
                      amanStatus === 'SWITCHING' ? 'bg-amber-400 animate-ping' :
                      'bg-purple-400'
                    }`} />
                    <span className="text-slate-300 font-medium">
                      {amanStatus === 'CONNECTED' ? 'AMAN AI' :
                       amanStatus === 'SWITCHING' ? 'Switching AI' :
                       'Local Guidance'}
                    </span>
                  </div>
                  <button
                    onClick={() => setCoachMode(!coachMode)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-colors cursor-pointer ${
                      coachMode 
                        ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Coach Mode asks leading questions to develop problem-solving intuition"
                  >
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-2.5 h-2.5" />
                      {coachMode ? 'COACH MODE ON' : 'COACH MODE'}
                    </span>
                  </button>
                </div>
                <div className="text-[10px] font-mono text-cyan-400/80 truncate max-w-[200px]">
                  {location.pathname === '/' ? 'Dashboard' : location.pathname}
                </div>
              </div>
            </div>

            {/* Top action icons */}
            <div className="flex items-center gap-1">
              <AmanAudioWaveform barCount={6} className="hidden sm:flex" />

              <button
                onClick={() => setIsVoiceSettingsOpen(true)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                title="AMAN Voice & Audio Protocol Settings"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleToggleMute}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isMuted 
                    ? 'bg-slate-900 border-slate-800 text-slate-500' 
                    : 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
                }`}
                title={isMuted ? 'Unmute AMAN Voice' : 'Mute AMAN Voice'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Close Assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        {/* Drawer Body (Visible when not minimized) */}
        {!isMinimized && (
          <>
            {/* Quick Context / Voice Controls Bar */}
            <div className="px-3 py-2 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Lv.{profile.cyberLevel}
                </span>
                <span className="text-slate-600">•</span>
                <span className="truncate max-w-[120px] text-slate-300">{position.currentCourse}</span>
              </div>

              {/* Audio Playback Controls */}
              <div className="flex items-center gap-1.5">
                {isSpeaking ? (
                  <button
                    onClick={handleStopSpeaking}
                    className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300 flex items-center gap-1 text-[10px]"
                  >
                    <Square className="w-2.5 h-2.5 fill-current" /> STOP
                  </button>
                ) : (
                  <button
                    onClick={handleRepeat}
                    className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                    title="Repeat Last Voice"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={handleCycleRate}
                  className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 font-bold hover:bg-slate-800"
                  title="Speech Rate (Slower, Normal, Faster)"
                >
                  {playbackRate === 'slower' ? '0.8x' : playbackRate === 'faster' ? '1.25x' : '1.0x'}
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/90">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'aman' && (
                    <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-800 text-white rounded-tr-xs border border-slate-700'
                      : 'bg-slate-950 text-slate-200 rounded-tl-xs border border-slate-800/80 shadow-md'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Render action chips */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-900 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => executeAction(act)}
                            className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            {act.label}
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {msg.sender === 'aman' && msg.text && !isMuted && (
                      <div className="mt-2 pt-2 border-t border-slate-900 flex justify-end">
                        <button
                          onClick={() => handleSpeak(msg.text)}
                          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" /> Listen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 rounded-tl-xs flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span className="text-[11px] font-mono text-slate-400">AMAN is formulating guidance...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSend("Main abhi kaha hoon?")}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors"
              >
                📍 Main abhi kaha hoon?
              </button>
              <button
                onClick={() => handleSend("What should I do next?")}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors"
              >
                🎯 What next?
              </button>
              <button
                onClick={() => handleSend("Hinglish mein explain karo.")}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors"
              >
                🇮🇳 Hinglish explain
              </button>
              <button
                onClick={() => handleSend("Give me a hint for my current task.")}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors"
              >
                💡 Hint for lab
              </button>
            </div>

            {/* Drawer Input Area */}
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500/40'
                  }`}
                  title="Voice Input (English / Hinglish)"
                >
                  {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask AMAN anything..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!inputVal.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>

    {/* Voice Settings & Audio Protocol Modal */}
    <AmanVoiceSettingsModal
      isOpen={isVoiceSettingsOpen}
      onClose={() => setIsVoiceSettingsOpen(false)}
    />
  </>
  );
};
