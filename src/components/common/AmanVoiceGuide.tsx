import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { speechEngine } from '../../utils/speechEngine';
import { Bot, Volume2, VolumeX, Sparkles, AlertCircle, Play, Pause, RotateCw } from 'lucide-react';

export const AmanVoiceGuide: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, currentUser } = useApp();
  
  const [isActive, setIsActive] = useState<boolean>(() => {
    return localStorage.getItem('aman_vocal_tutoring_active') !== 'false';
  });
  const [subtitle, setSubtitle] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isAmanSpeaking, setIsAmanSpeaking] = useState<boolean>(false);
  const [soundBars, setSoundBars] = useState<number[]>([15, 15, 15, 15, 15]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const speakTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state of speech engine speaking
  useEffect(() => {
    const unsubscribe = speechEngine.subscribeVisualizer((speaking, level) => {
      setIsAmanSpeaking(speaking);
      if (speaking) {
        // Map randomized soundwave values
        setSoundBars([
          Math.max(10, Math.round(level * 0.4)),
          Math.max(10, Math.round(level * 0.8)),
          Math.max(10, Math.round(level * 1.0)),
          Math.max(10, Math.round(level * 0.7)),
          Math.max(10, Math.round(level * 0.3)),
        ]);
      } else {
        setSoundBars([15, 15, 15, 15, 15]);
      }
    });

    return () => unsubscribe();
  }, []);

  const getCustomAmanAdvice = (): { voiceText: string; subtitleText: string } => {
    const path = location.pathname;
    const lang = profile.language || 'English';

    // 1. If not authenticated
    if (!currentUser) {
      return {
        voiceText: "Welcome to My Cyber Lab. Main aapka Senior Advisor AMAN hoon. Please login first to calibrate your secure learning shell.",
        subtitleText: "Please authenticate with Google Login to initialize your secure cybersecurity lab shell."
      };
    }

    // 2. If onboarding is not completed
    if (!profile.onboardingCompleted) {
      const stepStr = localStorage.getItem('mcl_onboarding_step') || '0';
      const step = parseInt(stepStr, 10);

      switch (step) {
        case 0:
          return {
            voiceText: "Welcome cadet! Main AMAN hoon. Let's calibrate your cybersecurity profile. Choose a secure codename first.",
            subtitleText: "Welcome to My Cyber Lab! I am AMAN, your AI Tutor. Let's begin your calibration. Choose your codename."
          };
        case 1:
          return {
            voiceText: "Select your target role. SOC Analysts manage defenses. Penetration Testers ethical hackers. Threat Hunters hunt threats.",
            subtitleText: "Select your career role goal. Choose a Primary Career Role and optional Secondary Interests."
          };
        case 2:
          return {
            voiceText: "Where are you starting from? Be honest about your experience level so I can calibrate our labs and difficulty.",
            subtitleText: "Tell AMAN where you are starting from: Beginner, Computer Basics, or prior Linux/Networking study."
          };
        case 3:
          return {
            voiceText: "How much daily study time can you commit? Choose from 15 minutes to multi hour intensive bootcamps.",
            subtitleText: "Commit to a daily study duration goal. Consistency is the primary weapon in ethical hacking."
          };
        case 4:
          return {
            voiceText: "Select how I should teach you. English, Hinglish, or clean Hindi. I will write study plans in this language.",
            subtitleText: "Choose how AMAN should explain concepts: English, friendly Hinglish blend, or Hindi."
          };
        case 5:
          return {
            voiceText: "What is your preferred learning style? Practical first hands-on labs, or guided structural reading?",
            subtitleText: "Choose your preferred pedagogical style: Guided (Theory-first), Practical, or Gamified Missions."
          };
        case 6:
          return {
            voiceText: "This is our baseline diagnostic assessment. It tests computer fundamentals and networking. Let's do it!",
            subtitleText: "Launch the baseline interactive diagnostic assessment to analyze your current baseline strength."
          };
        case 7:
          return {
            voiceText: "Analysis in progress. Compiling diagnostic scores and aligning core roadmap milestones. Please wait.",
            subtitleText: "AMAN is currently synthesizing your custom cyber-profile database. Computing prerequisites."
          };
        case 8:
          return {
            voiceText: "Your personalized cybersecurity roadmap is complete. Review your curriculum and click Start My Learning Path.",
            subtitleText: "Onboarding success! Your roadmap is ready. Click 'START MY LEARNING PATH' to begin."
          };
        case 9:
          return {
            voiceText: `Welcome to your career path. Your first objective is Linux Fundamentals. This will take twenty minutes. After this, we do networking. Start Next.`,
            subtitleText: `Welcome to your career path. First objective: Linux Fundamentals (20 mins). Start Next is armed.`
          };
        case 10:
          return {
            voiceText: "Your first practical activity is ready. Linux Fundamentals Lab. Click Start Now to launch your first terminal simulator.",
            subtitleText: "Active Action armed: LINUX FUNDAMENTALS. Time: 20 mins. Click 'START NOW' to initialize the terminal."
          };
        default:
          return {
            voiceText: "Please finish your onboarding profile so I can compile your personalized career path blueprint.",
            subtitleText: "Please finish all steps of your onboarding so we can open the cyber ranges."
          };
      }
    }

    // 3. Authenticated & Onboarded paths
    if (path.includes('/linux-lab')) {
      return {
        voiceText: "You are inside the interactive Linux CLI Lab. Execute commands in the terminal on the left to complete your objectives.",
        subtitleText: "Active: Linux CLI Lab. Use ls, cd, cat, chmod, and grep to solve the terminal tasks on your dashboard."
      };
    }

    if (path.includes('/network-lab') || path.includes('/visualizer')) {
      return {
        voiceText: "Active: Networking Simulator. Analyze the topology packets and ping hosts to map the subnet. Check CIDR configurations.",
        subtitleText: "Active: Network Simulator. Map out device ports, ARP caches, and inspect packet flows to analyze subnets."
      };
    }

    if (path.includes('/ai-mentor')) {
      return {
        voiceText: "This is my AI Mentoring room. Type any security query or paste command errors and I will dissect them with analogies.",
        subtitleText: "Active: AMAN AI Mentor. Ask anything from Buffer Overflows, Active Directory, to Splunk log querying."
      };
    }

    if (path.includes('/missions')) {
      return {
        voiceText: "We are inspecting tactical story-driven missions. Select an active mission briefing, view host IPs, and unlock reward badges.",
        subtitleText: "Active: Game Missions Hub. Review briefings, read threat classifications, and trigger your current objective."
      };
    }

    if (path.includes('/ctf-arena')) {
      return {
        voiceText: "Capture The Flag Arena. Analyze the binary hashes, injection payloads, or cryptography files to capture the flag.",
        subtitleText: "Active: CTF Arena. Solve capture-the-flag problems and submit authentic flags to claim XP."
      };
    }

    if (path.includes('/practice')) {
      return {
        voiceText: "You are in the Practice Hub. Select a simulated training laboratory: Subnetting, SIEM operations, Web security, or Case investigations.",
        subtitleText: "Active: Lab Hub. Launch dedicated training sandboxes to build practical muscle memory."
      };
    }

    if (path.includes('/settings')) {
      return {
        voiceText: "You are in Settings. You can update your codename, visual themes, or toggle your career role goal. Progress remains persistent.",
        subtitleText: "Active: Settings. Adjust profile options, select themes, or change your targeted primary role."
      };
    }

    // Default Dashboard
    return {
      voiceText: `Welcome to your Academy, ${profile.codename}. We are currently targeting the ${profile.targetRole || 'SOC Analyst'} career roadmap. Click Start Next on your dashboard to proceed.`,
      subtitleText: `Targeting: ${profile.targetRole || 'SOC Analyst'}. Level ${profile.cyberLevel}. Click 'START NEXT' to trigger your next move.`
    };
  };

  const triggerAmanSpeech = (force: boolean = false) => {
    if (!isActive && !force) return;
    
    // Stop any existing speech first
    speechEngine.stop();

    const advice = getCustomAmanAdvice();
    setSubtitle(advice.subtitleText);
    setShowPopup(true);

    speechEngine.speak(advice.voiceText, {
      playChime: true,
      onStart: () => {
        setIsAmanSpeaking(true);
      },
      onEnd: () => {
        setIsAmanSpeaking(false);
        // Fade out subtitles after 4 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 4000);
      }
    });
  };

  // Set up 1-minute vocal transmission interval
  useEffect(() => {
    // Initial speak with brief delay on mount or path change
    if (isActive) {
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = setTimeout(() => {
        triggerAmanSpeech(false);
      }, 1500);
    }

    setTimeLeft(60);

    // Countdown interval (1s updates)
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    // Core transmission interval (60s updates)
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      triggerAmanSpeech(false);
    }, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    };
  }, [location.pathname, isActive]);

  // Listen to step changes during onboarding to trigger instant updates
  useEffect(() => {
    const handleStepChange = () => {
      if (isActive) {
        triggerAmanSpeech(false);
      }
    };
    window.addEventListener('storage', handleStepChange);
    return () => window.removeEventListener('storage', handleStepChange);
  }, [isActive]);

  const toggleVocalTutoring = () => {
    const nextVal = !isActive;
    setIsActive(nextVal);
    localStorage.setItem('aman_vocal_tutoring_active', String(nextVal));
    if (!nextVal) {
      speechEngine.stop();
      setIsAmanSpeaking(false);
      setShowPopup(false);
    } else {
      setTimeLeft(60);
      // Speak immediately on activation
      setTimeout(() => triggerAmanSpeech(true), 200);
    }
  };

  const handleManualTrigger = () => {
    triggerAmanSpeech(true);
  };

  return (
    <>
      {/* GLOBAL HUD POP-OUT PANEL IN BOTTOM-RIGHT CORNER */}
      <div id="aman-voice-hud" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Subtitle speech bubble popout (Only visible when speaking or active info) */}
        {showPopup && subtitle && (
          <div className="bg-slate-900/95 border border-cyan-500/30 p-3.5 rounded-2xl max-w-sm shadow-[0_4px_20px_rgba(6,182,212,0.15)] flex gap-2.5 items-start pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">AMAN Live Briefing</span>
                {isAmanSpeaking && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
              </div>
              <p className="text-xs text-slate-200 font-mono leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        )}

        {/* Small persistent controller widget */}
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-2xl flex items-center gap-3.5 shadow-xl pointer-events-auto border-l-cyan-500/50 border-l-2">
          
          {/* Glowing Animated Waveform Avatar */}
          <div 
            onClick={handleManualTrigger}
            className={`w-9 h-9 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
              isAmanSpeaking 
                ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
            title="Click to hear AMAN's active guidance"
          >
            {isAmanSpeaking ? (
              <div className="flex items-end gap-0.5 h-3">
                {soundBars.map((height, idx) => (
                  <div
                    key={idx}
                    className="w-0.75 bg-cyan-400 rounded-full transition-all duration-100"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            ) : (
              <Bot className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {/* Status info & countdown details */}
          <div className="font-mono text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Vocal Tutor</span>
              <span className={`text-[8px] px-1 rounded font-black uppercase ${
                isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}>
                {isActive ? 'ACTIVE' : 'MUTED'}
              </span>
            </div>
            
            <p className="text-[10px] text-slate-500 tracking-tight">
              {isActive 
                ? `Next guide in: ${timeLeft}s` 
                : "Continuous speaking is paused."}
            </p>
          </div>

          {/* Quick interactive buttons */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            
            {/* Manual Play/Mute trigger */}
            <button
              onClick={toggleVocalTutoring}
              className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={isActive ? "Pause active speaking triggers" : "Enable continuous active tutor voice"}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Repeat button */}
            <button
              onClick={handleManualTrigger}
              disabled={!isActive}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Repeat last vocal briefing"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </>
  );
};
