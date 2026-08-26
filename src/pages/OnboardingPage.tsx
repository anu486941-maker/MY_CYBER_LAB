import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ExperienceLevel, LanguagePreference, DailyTimeGoal, LearningStyle, CareerRoleId } from '../types';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import { speechEngine } from '../utils/speechEngine';
import { 
  Shield, 
  Terminal, 
  Clock, 
  BookOpen, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Gamepad2,
  Bot,
  Volume2,
  VolumeX,
  Loader2,
  Award,
  CheckCircle2,
  HelpCircle,
  Globe
} from 'lucide-react';

interface DiagnosticQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ONBOARDING_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'onboard-diag-1',
    category: 'Computer & OS Fundamentals',
    question: 'What is the primary difference between Kernel Space and User Space in an Operating System?',
    options: [
      'Kernel Space hosts standard user applications, while User Space manages physical RAM and CPU hardware resources.',
      'Kernel Space operates with maximum CPU privilege to control physical hardware, while User Space hosts unprivileged applications for safety.',
      'Kernel Space is client-side only, whereas User Space manages backend database structures.',
      'There is no privilege difference; they are interchangeable naming conventions in modern kernels.'
    ],
    correctIndex: 1,
    explanation: 'Kernel space executes with ring-0 CPU privileges, allowing direct interaction with hardware. User space (ring-3) isolates user applications to prevent system-wide crashes.'
  },
  {
    id: 'onboard-diag-2',
    category: 'Linux Operations',
    question: 'Which directory traditionally stores persistent system and service configuration files in a Linux system?',
    options: ['/var/log', '/bin', '/etc', '/tmp'],
    correctIndex: 2,
    explanation: 'The /etc directory is the default container for static system-wide configuration files and service controls.'
  },
  {
    id: 'onboard-diag-3',
    category: 'Networking Protocols',
    question: 'What is the default TCP port number reserved for SSH (Secure Shell) remote shell administrations?',
    options: ['Port 21', 'Port 22', 'Port 80', 'Port 443'],
    correctIndex: 1,
    explanation: 'SSH operates on port 22 by default, providing encrypted terminal communications.'
  },
  {
    id: 'onboard-diag-4',
    category: 'Web Security',
    question: 'Which HTTP response code indicates that a client requested a resource they are not authorized to access (Forbidden)?',
    options: ['200 OK', '302 Found', '403 Forbidden', '404 Not Found'],
    correctIndex: 2,
    explanation: '403 Forbidden indicates that the server understands the request but refuses to authorize access, whereas 401 indicates unauthenticated.'
  },
  {
    id: 'onboard-diag-5',
    category: 'Cybersecurity Reasoning',
    question: 'When performing defensive traffic analysis, what does a sudden spike in outbound TLS connections on unusual ports from a database server suggest?',
    options: [
      'Standard high-performance database indexing routine.',
      'Possible active data exfiltration or reverse shell beaconing by an adversary.',
      'A routine local system clock synchronization over NTP.',
      'The database is refreshing standard DNS resolver records.'
    ],
    correctIndex: 1,
    explanation: 'Anomalous outbound encrypted sessions from critical assets (like database servers) are key signatures of persistent reverse access, command-and-control (C2) beaconing, or active exfiltration.'
  }
];

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(0);
  const [codename, setCodename] = useState<string>(profile.codename || '');
  const [primaryRole, setPrimaryRole] = useState<CareerRoleId>('soc-analyst');
  const [secondaryRoles, setSecondaryRoles] = useState<CareerRoleId[]>([]);
  const [experience, setExperience] = useState<ExperienceLevel>(profile.experience || 'beginner');
  const [dailyTime, setDailyTime] = useState<DailyTimeGoal>(profile.dailyTime || '30m');
  const [language, setLanguage] = useState<LanguagePreference>(profile.language || 'English');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(profile.learningStyle || 'mixed');

  // Voice controllers
  const [voiceActive, setVoiceActive] = useState<boolean>(true);
  const [voiceTriggered, setVoiceTriggered] = useState<Record<number, boolean>>({});

  // Diagnostic states
  const [runDiagnostic, setRunDiagnostic] = useState<boolean | null>(null);
  const [diagIndex, setDiagIndex] = useState<number>(0);
  const [diagAnswers, setDiagAnswers] = useState<Record<number, number>>({});
  const [diagFinished, setDiagFinished] = useState<boolean>(false);
  const [diagScore, setDiagScore] = useState<number>(0);

  // Profiling Simulation State
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);

  // Synchronize active step to localStorage so AmanVoiceGuide can track progress
  useEffect(() => {
    localStorage.setItem('mcl_onboarding_step', String(step));
    window.dispatchEvent(new Event('storage')); // trigger immediate storage event locally
  }, [step]);

  // Handle socratic speak for welcoming
  useEffect(() => {
    if (step === 0 && voiceActive && !voiceTriggered[0]) {
      const timer = setTimeout(() => {
        speechEngine.speak(
          "Welcome to MY CYBER LAB. Main AMAN hoon. Main aapki cybersecurity learning journey ko guide karunga. Sabse pehle: Aap cybersecurity mein kya banna chahte ho?"
        );
        setVoiceTriggered(prev => ({ ...prev, 0: true }));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [step, voiceActive]);

  // Profiling engine simulation (Step 7)
  useEffect(() => {
    if (step === 7) {
      setAnalysisProgress(0);
      setAnalysisLogs([]);

      const logs = [
        "Initializing career blueprint compiler...",
        `Target career role: ${CAREER_ROLES_DATA.find(r => r.id === primaryRole)?.title || primaryRole}`,
        `Secondary interests: ${secondaryRoles.length > 0 ? secondaryRoles.join(', ') : 'None'}`,
        "Parsing study time pace...",
        `Language: ${language}`,
        "Evaluating diagnostic metrics...",
      ];

      let logIdx = 0;
      const interval = setInterval(() => {
        if (logIdx < logs.length) {
          setAnalysisLogs(prev => [...prev, `[✔] ${logs[logIdx]}`]);
          logIdx++;
          setAnalysisProgress(p => Math.min(p + 15, 90));
        } else {
          clearInterval(interval);

          let correct = 0;
          if (runDiagnostic) {
            ONBOARDING_DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
              if (diagAnswers[idx] === q.correctIndex) correct++;
            });
          }
          setDiagScore(correct);

          setTimeout(() => {
            const pct = runDiagnostic ? Math.round((correct / 5) * 100) : null;
            const scoreMsg = runDiagnostic 
              ? `Diagnostic scores: Correct answers ${correct}/5 (${pct}%).`
              : "Diagnostic skipped. Calibrating starting point to baseline.";

            let recommendedLevelLabel = "Complete Beginner";
            let updatedLevel: ExperienceLevel = 'beginner';

            if (runDiagnostic) {
              if (correct >= 4) {
                recommendedLevelLabel = "Advanced (Cyber Degree / certs prep)";
                updatedLevel = 'already_studying';
              } else if (correct >= 2) {
                recommendedLevelLabel = "Intermediate (Prior OS / Networking)";
                updatedLevel = 'some_linux';
              } else {
                recommendedLevelLabel = "Beginner (Fundamentals needed)";
                updatedLevel = 'beginner';
              }
            } else {
              updatedLevel = experience;
              if (experience === 'already_studying') recommendedLevelLabel = "Advanced (Self-Reported)";
              else if (experience === 'some_linux' || experience === 'some_networking') recommendedLevelLabel = "Intermediate (Self-Reported)";
              else recommendedLevelLabel = "Beginner (Self-Reported)";
            }

            setExperience(updatedLevel);

            setAnalysisLogs(prev => [
              ...prev,
              `[✔] ${scoreMsg}`,
              `[✔] Calibration alignment complete: Recommended Level -> ${recommendedLevelLabel.toUpperCase()}`,
              `[✔] PERSONALIZED ROADMAP RECONSTRUCTION APPLIED.`,
              `[✔] ACCESS KEYS ARMED.`
            ]);
            setAnalysisProgress(100);

            if (voiceActive && !voiceTriggered[7]) {
              const speakText = language === 'Hinglish'
                ? "Aapka personalized roadmap analyze ho gaya hai. Curriculum optimized! Let's review the milestones."
                : "Your cybersecurity profile is analyzed. Personalized roadmap compiled. Review your path and let's begin.";
              speechEngine.speak(speakText);
              setVoiceTriggered(prev => ({ ...prev, 7: true }));
            }
          }, 800);
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [step, runDiagnostic, primaryRole, secondaryRoles, language]);

  // Voice triggers for milestones
  useEffect(() => {
    if (step === 8 && voiceActive && !voiceTriggered[8]) {
      const speakText = language === 'Hinglish'
        ? "Yeh aapka custom roadmap hai. standard and hands-on modules are placed perfectly. Please click Start My Learning Path."
        : "This is your custom cybersecurity roadmap. Click Start My Learning Path to load your curriculum.";
      speechEngine.speak(speakText);
      setVoiceTriggered(prev => ({ ...prev, 8: true }));
    } else if (step === 9 && voiceActive && !voiceTriggered[9]) {
      const activeRoleTitle = CAREER_ROLES_DATA.find(r => r.id === primaryRole)?.title || 'SOC Analyst';
      const speakText = `Welcome to your ${activeRoleTitle} learning path. Your first objective is Linux Fundamentals. This will take approximately 20 minutes. After this, you'll move into networking. I'll guide you through the labs and tell you what to do next.`;
      speechEngine.speak(speakText);
      setVoiceTriggered(prev => ({ ...prev, 9: true }));
    } else if (step === 10 && voiceActive && !voiceTriggered[10]) {
      const speakText = "Let's launch our first practical objective: Linux Fundamentals. Click Start Now to boot up your terminal simulator.";
      speechEngine.speak(speakText);
      setVoiceTriggered(prev => ({ ...prev, 10: true }));
    }
  }, [step, voiceActive, primaryRole]);

  const toggleVoice = () => {
    if (voiceActive) {
      speechEngine.stop();
      setVoiceActive(false);
    } else {
      setVoiceActive(true);
      // Speak corresponding current step advice instantly
      if (step === 0) {
        speechEngine.speak("Please type your secure codename so we can register your terminal session.");
      } else if (step === 8) {
        speechEngine.speak("This is your custom cybersecurity roadmap. Click Start My Learning Path.");
      }
    }
  };

  const handleSelectSecondaryRole = (roleId: CareerRoleId) => {
    if (roleId === primaryRole) return;
    setSecondaryRoles(prev => 
      prev.includes(roleId)
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleCompleteOnboarding = () => {
    const finalCodename = codename.trim() || 'OPERATOR_01';
    updateProfile({
      codename: finalCodename,
      targetRole: primaryRole,
      secondaryRoles,
      experience: experience,
      experienceLevel: experience, // sync both fields safely
      dailyTime,
      language,
      learningStyle,
      onboardingCompleted: true
    });
    // Redirect cleanly to dashboard
    navigate('/dashboard');
  };

  const experienceOptions: { value: ExperienceLevel; label: string; desc: string }[] = [
    { value: 'beginner', label: 'Complete Beginner', desc: 'Starting from total zero with no prior terminal or networking experience.' },
    { value: 'some_computer', label: 'Some Computer Knowledge', desc: 'Comfortable with basic software, operating systems, and file management.' },
    { value: 'some_linux', label: 'Some Linux Knowledge', desc: 'Familiar with basic shell commands like ls, cd, cat, and directory navigation.' },
    { value: 'already_studying', label: 'Already Studying Cybersecurity', desc: 'Enrolled in IT/Cyber degree or certificates (CompTIA Security+, CEH, eJPT).' },
  ];

  const languageOptions: { value: LanguagePreference; label: string; tag: string }[] = [
    { value: 'English', label: 'English Only', tag: 'Technical definitions and conversational explanations entirely in English.' },
    { value: 'Hinglish', label: 'Hinglish Blend', tag: 'A clean bilingual mixture: technical terms in English, explanations in friendly Hindi.' },
    { value: 'Hindi', label: 'Hindi (हिंदी)', tag: 'Colloquial Hindi terms and descriptions for maximum conceptual accessibility.' },
    { value: 'Other', label: 'Auto (Multilingual)', tag: 'Adaptive language engine which matches your exact prompted inputs.' },
  ];

  const timeOptions: { value: DailyTimeGoal; label: string; sub: string }[] = [
    { value: '15m', label: '15 Minutes / Day (Micro-dose)', sub: 'Highly focused burst: 1 rapid theory breakdown + 1 micro quiz' },
    { value: '30m', label: '30 Minutes / Day (Balanced)', sub: 'Default pacing: 1 concept + 1 guided terminal challenge session' },
    { value: '1h', label: '45-60 Minutes / Day (Recommended)', sub: 'Deep learning: 1 complete hands-on scenario module with diagnostics' },
    { value: '2h', label: '90-120 Minutes / Day (Intensive)', sub: 'Fast track: Multiple sandbox environments + capture-the-flag exercises' },
    { value: '3h_plus', label: '3+ Hours / Day (Bootcamp)', sub: 'Apex speedrunner: Hardcore immersion spanning direct multi-system ranges' },
  ];

  const styleOptions: { value: LearningStyle; label: string; icon: any; desc: string }[] = [
    { value: 'reading', label: 'Guided (Theory First)', icon: BookOpen, desc: 'Deep dive technical briefs, structured blueprints, and security documentation first.' },
    { value: 'practice', label: 'Practical First (Hands-on)', icon: Terminal, desc: 'Direct sandbox terminals, traffic analysis tools, and proactive command injections first.' },
    { value: 'mixed', label: 'Balanced (Hybrid)', icon: Sparkles, desc: 'Fluid combination of step-by-step guidance, interactive quiz cards, and labs.' },
    { value: 'missions', label: 'Challenge First (Gamified)', icon: Gamepad2, desc: 'Story-driven task sheets, red/blue operations, and active objective progressions.' },
  ];

  const activeRoleDetails = CAREER_ROLES_DATA.find(r => r.id === primaryRole);

  return (
    <div id="onboarding-page" className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col my-4">
        
        {/* Step Header Topbar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-black text-xs text-slate-300 tracking-widest uppercase">AMAN ADVISOR SYSTEM</span>
              <span className="text-[10px] text-slate-500 font-mono block uppercase">
                {step === 0 && "Welcome & Primary Career Role"}
                {step === 1 && "Secondary Interest & Codename"}
                {step === 2 && "Knowledge Mapping"}
                {step === 3 && "Daily Pacing"}
                {step === 4 && "Language Adapter"}
                {step === 5 && "Learning Preference"}
                {step === 6 && "Tactical Verification"}
                {step === 7 && "Analysis Phase"}
                {step === 8 && "Personalized Blueprint"}
                {step === 9 && "AMAN Path Introduction"}
                {step === 10 && "First Practical Activity"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Speech synthesis controller */}
            <button
              onClick={toggleVoice}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                voiceActive
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
              title={voiceActive ? "Silence AMAN" : "Enable AMAN Speech"}
            >
              {voiceActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Pagination nodes */}
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(idx => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === step
                      ? 'w-5 bg-cyan-400'
                      : idx < step
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar">

          {/* STEP 0: WELCOME & PRIMARY CAREER ROLE */}
          {step === 0 && (
            <div className="space-y-6">
              {/* AMAN Interactive Greeting Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)] relative overflow-hidden flex items-start gap-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none rounded-bl-full" />
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20 shrink-0">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="text-[9px] font-mono font-extrabold text-cyan-400 uppercase tracking-widest block">AMAN — INTEL INSTRUCTOR</span>
                  <p className="text-sm text-slate-200 font-sans leading-relaxed">
                    "Welcome to MY CYBER LAB. Main AMAN hoon. Main aapki cybersecurity learning journey ko guide karunga. Sabse pehle: Aap cybersecurity mein kya banna chahte ho?"
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3.5">
                  SELECT YOUR PRIMARY CAREER GOAL
                </h3>
                
                {/* Primary selector */}
                <div className="grid grid-cols-1 gap-3.5">
                  {CAREER_ROLES_DATA.slice(0, 4).map((role) => (
                    <div
                      key={role.id}
                      onClick={() => {
                        setPrimaryRole(role.id);
                        setSecondaryRoles(prev => prev.filter(id => id !== role.id));
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between gap-2.5 ${
                        primaryRole === role.id
                          ? 'bg-slate-950/80 border-cyan-500 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.15)] border-l-4'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{role.emoji}</span>
                          <div>
                            <span className="font-mono font-bold text-sm text-cyan-300 block">{role.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{role.difficulty} • Est. {role.estimatedHours} Hours</span>
                          </div>
                        </div>
                        {primaryRole === role.id ? (
                          <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[9px] font-mono font-black uppercase">
                            PRIMARY TARGET
                          </span>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-800" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-normal pl-8">
                        {role.shortDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: CHOOSE SECONDARY INTERESTS & SECURE CODENAME */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100 uppercase">
                  OPERATOR DETAILS & COGNITIVE SCOPE
                </h3>
                <p className="text-xs text-slate-400">Choose your secure operator codename and add optional auxiliary targets to customize your curriculum.</p>
              </div>

              {/* Secure Codename Input Block */}
              <div className="space-y-2.5 bg-slate-950/40 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                <label className="text-[10px] font-mono font-extrabold text-cyan-400 uppercase tracking-widest block">
                  CHOOSE SECURE OPERATOR CODENAME
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={codename}
                    onChange={(e) => setCodename(e.target.value.toUpperCase().slice(0, 15))}
                    placeholder="E.G., CYBER_ALPHA_01"
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-600 transition-all uppercase outline-none"
                  />
                  <button
                    onClick={() => setCodename(`OPERATOR_${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="px-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs text-slate-300 font-mono font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    GENERATE
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">This identifies your session logs and certificates. Max 15 alphanumeric characters.</span>
              </div>

              {/* Optional Secondary Interest */}
              <div className="space-y-3 bg-slate-950/20 p-4 sm:p-5 rounded-2xl border border-slate-800/40">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    SELECT OPTIONAL SECONDARY INTERESTS
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">Expand your custom curriculum with modules from other domains.</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {CAREER_ROLES_DATA.slice(0, 4).map((role) => {
                    const isPrimary = primaryRole === role.id;
                    const isSelected = secondaryRoles.includes(role.id);

                    return (
                      <button
                        key={role.id}
                        disabled={isPrimary}
                        onClick={() => handleSelectSecondaryRole(role.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                          isPrimary
                            ? 'bg-slate-900 border-slate-850 text-slate-600 cursor-not-allowed opacity-30'
                            : isSelected
                            ? 'bg-slate-950/80 border-indigo-500 text-indigo-300 font-bold'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-750'
                        }`}
                      >
                        <span className="truncate">{role.emoji} {role.title}</span>
                        {isSelected && !isPrimary && (
                          <div className="w-4 h-4 rounded bg-indigo-500 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EXPERIENCE LEVEL */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100">
                  CHOOSE EXPERIENCE LEVEL
                </h3>
                <p className="text-xs text-slate-400">Be honest so AMAN can customize starting difficulty. All roles support complete foundation paths.</p>
              </div>

              <div className="space-y-3">
                {experienceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setExperience(opt.value)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                      experience === opt.value
                        ? 'bg-slate-950/80 border-cyan-500 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold text-sm text-cyan-300">{opt.label}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-normal">{opt.desc}</div>
                    </div>
                    {experience === opt.value && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DAILY STUDY TIME */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100">
                  CHOOSE DAILY STUDY TIME
                </h3>
                <p className="text-xs text-slate-400">Set your committed daily study pace. Consistent habits prevent information fatigue.</p>
              </div>

              <div className="space-y-3">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDailyTime(opt.value)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                      dailyTime === opt.value
                        ? 'bg-slate-950/80 border-cyan-500 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`w-5 h-5 ${dailyTime === opt.value ? 'text-cyan-400' : 'text-slate-600'}`} />
                      <div>
                        <div className="font-mono font-bold text-sm text-cyan-300">{opt.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5 leading-normal">{opt.sub}</div>
                      </div>
                    </div>
                    {dailyTime === opt.value && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: LANGUAGE */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100">
                  CHOOSE LANGUAGE
                </h3>
                <p className="text-xs text-slate-400">AMAN will explain concepts, provide live vocal cues, and offer feedback using this selected language.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLanguage(opt.value)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${
                      language === opt.value
                        ? 'bg-slate-950/80 border-cyan-500 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="font-mono font-bold text-sm text-cyan-300">{opt.label}</span>
                      {language === opt.value && (
                        <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 leading-normal">{opt.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: LEARNING STYLE */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100">
                  CHOOSE LEARNING STYLE
                </h3>
                <p className="text-xs text-slate-400">Prioritize direct practical sandboxes or structured theory briefs first in your path.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {styleOptions.map((opt) => {
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setLearningStyle(opt.value)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                        learningStyle === opt.value
                          ? 'bg-slate-950/80 border-cyan-500 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="font-mono font-bold text-xs text-cyan-300 uppercase">{opt.label}</span>
                        {learningStyle === opt.value && (
                          <div className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 leading-normal">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: DIAGNOSTIC ASSESSMENT */}
          {step === 6 && (
            <div className="space-y-4">
              {runDiagnostic === null ? (
                <div className="space-y-6 text-center py-6 animate-in fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <HelpCircle className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-mono font-black text-slate-100 uppercase">OPTIONAL DIAGNOSTIC ASSESSMENT</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      Let AMAN test your baseline. We&apos;ll evaluate 5 quick multiple-choice questions on Operating Systems, Networks, and security diagnostics.
                    </p>
                    <p className="text-[11px] text-cyan-400 font-mono">
                      Recommended: Saves time by identifying what you already master and skipping redundancy.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 max-w-sm mx-auto">
                    <button
                      onClick={() => setRunDiagnostic(true)}
                      className="flex-1 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      YES, START ASSESSMENT
                    </button>
                    <button
                      onClick={() => {
                        setRunDiagnostic(false);
                        setStep(7);
                      }}
                      className="flex-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      NO, SKIP ASSESSMENT
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">TACTICAL VERIFICATION</span>
                      <h4 className="text-sm font-mono font-bold text-slate-200">
                        QUESTION {diagIndex + 1} OF {ONBOARDING_DIAGNOSTIC_QUESTIONS.length}
                      </h4>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/30">
                      {ONBOARDING_DIAGNOSTIC_QUESTIONS[diagIndex].category}
                    </span>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shadow-md">
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                      {ONBOARDING_DIAGNOSTIC_QUESTIONS[diagIndex].question}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {ONBOARDING_DIAGNOSTIC_QUESTIONS[diagIndex].options.map((option, idx) => {
                      const isSelected = diagAnswers[diagIndex] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setDiagAnswers(prev => ({ ...prev, [diagIndex]: idx }))}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs leading-normal transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-slate-950/80 border-cyan-500 text-cyan-200 shadow-md'
                              : 'bg-slate-950/40 border-slate-850 border-slate-800/60 text-slate-400 hover:border-slate-800 hover:text-slate-300'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isSelected ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-750 text-slate-500'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <button
                      disabled={diagIndex === 0}
                      onClick={() => setDiagIndex(p => p - 1)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-40 font-mono text-[10px] uppercase transition-all"
                    >
                      PREV
                    </button>

                    {diagIndex < ONBOARDING_DIAGNOSTIC_QUESTIONS.length - 1 ? (
                      <button
                        disabled={diagAnswers[diagIndex] === undefined}
                        onClick={() => setDiagIndex(p => p + 1)}
                        className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] uppercase flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        NEXT
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        disabled={diagAnswers[diagIndex] === undefined}
                        onClick={() => {
                          setDiagFinished(true);
                          setStep(7);
                        }}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-mono font-bold text-[10px] uppercase flex items-center gap-1 transition-all shadow-md"
                      >
                        SUBMIT RESULTS
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: AMAN ANALYZES */}
          {step === 7 && (
            <div className="space-y-6 py-4 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center mx-auto text-cyan-400">
                  <Loader2 className="w-7 h-7 animate-spin" />
                </div>
                <h3 className="text-lg font-mono font-black text-slate-100 uppercase tracking-wider">AMAN PROFILING RUNNING</h3>
                <p className="text-xs text-slate-400">AMAN is analyzing your diagnostics, calibration coefficients, and milestones...</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300 rounded-full" 
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>

              {/* Terminal Logs Simulation */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 shadow-inner max-h-[200px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Profiling Telemetry Log</span>
                  <span className="text-[10px] font-mono text-cyan-500 animate-pulse">{analysisProgress}%</span>
                </div>
                <div className="space-y-1 font-mono text-[10px] text-slate-300">
                  {analysisLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed whitespace-pre-line border-l-2 border-cyan-500/20 pl-2">
                      {log}
                    </div>
                  ))}
                  {analysisProgress < 100 && (
                    <div className="flex items-center gap-1 text-cyan-400 animate-pulse pl-2">
                      <span>&gt; Processing metrics...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: PERSONALIZED ROADMAP */}
          {step === 8 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-2">
                  <Award className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-xl sm:text-2xl font-mono font-black text-slate-100 tracking-tight">
                  YOUR PERSONAL CYBERSECURITY ROADMAP
                </h2>
                <p className="text-xs text-slate-400">Review your customized curriculum milestones before locking in.</p>
              </div>

              {/* Blueprint Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Profile parameters card */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3 shadow-md">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">Operator Blueprint</span>
                  
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">CODENAME:</span>
                      <span className="text-slate-200 font-bold">{codename || 'OPERATOR_01'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">SELECTED CAREER:</span>
                      <span className="text-cyan-400 font-bold">
                        {activeRoleDetails?.title || 'SOC Analyst'}
                      </span>
                    </div>
                    {secondaryRoles.length > 0 && (
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">INTERESTS:</span>
                        <span className="text-slate-400 font-medium truncate max-w-[120px]">
                          {secondaryRoles.map(id => CAREER_ROLES_DATA.find(r => r.id === id)?.title || id).join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">STARTING LEVEL:</span>
                      <span className="text-emerald-400 font-bold uppercase">
                        {experience === 'beginner' ? 'Beginner' : 
                         experience === 'some_computer' ? 'OS Basics' :
                         experience === 'some_linux' ? 'Linux Intermediate' : 'Advanced Sec'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">EST. PATH DURATION:</span>
                      <span className="text-amber-400 font-bold">
                        {activeRoleDetails?.estimatedWeeks || 14} Weeks ({activeRoleDetails?.estimatedHours || 90} hrs)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">PACING:</span>
                      <span className="text-indigo-400 uppercase font-semibold">{dailyTime}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Curriculum Sequencer */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3 shadow-md flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">Curriculum Sequencer</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/20 flex items-center justify-center font-mono text-[9px] font-bold">01</div>
                        <span className="text-slate-300 font-mono font-medium">Stage 1: Core Linux & Shell</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/20 flex items-center justify-center font-mono text-[9px] font-bold">02</div>
                        <span className="text-slate-300 font-mono font-medium">Stage 2: Active Diagnostics & Recon</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/20 flex items-center justify-center font-mono text-[9px] font-bold">03</div>
                        <span className="text-slate-300 font-mono font-medium">Stage 3: Incident Containment & SIEM</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span>Roadmap calibrated with AMAN Voice. Start Here points are armed.</span>
                  </div>
                </div>
              </div>

              {/* YOU ARE HERE / START HERE Highlight Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-950 to-cyan-950/40 border border-cyan-500/30 text-center font-mono text-xs">
                <span className="text-amber-400 font-black tracking-widest uppercase block mb-1">🎯 YOU ARE HERE &amp; START HERE</span>
                <span className="text-slate-300">Linux Fundamentals Lab Environment — Port 3000 Stage 1 Sandbox Simulator</span>
              </div>
            </div>
          )}

          {/* STEP 9: AMAN PATH INTRODUCTION */}
          {step === 9 && (
            <div className="space-y-6 py-4 animate-in fade-in">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <Bot className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-mono font-black text-slate-100 uppercase tracking-tight">
                  AMAN PATH BRIEFING INCOMING
                </h3>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border-2 border-cyan-500/40 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-cyan-400" />
                <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                  <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase font-bold">Live Socratic Voice Audio</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-base text-slate-100 leading-relaxed font-mono">
                  &quot;Welcome to your <strong>{activeRoleDetails?.title || 'SOC Analyst'}</strong> learning path. Your first objective is <strong>Linux Fundamentals</strong>. This will take approximately 20 minutes. After this, you&apos;ll move into networking. I&apos;ll guide you through the labs and tell you what to do next.&quot;
                </p>
              </div>
            </div>
          )}

          {/* STEP 10: FIRST PRACTICAL ACTIVITY */}
          {step === 10 && (
            <div className="space-y-6 py-4 animate-in fade-in">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-black text-amber-400 tracking-wider bg-amber-950/40 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
                  FIRST PRACTICAL OBJECTIVE UNLOCKED
                </span>
                <h3 className="text-2xl font-mono font-black text-white uppercase mt-2">
                  LINUX FUNDAMENTALS
                </h3>
                <p className="text-xs text-slate-400">Initialize your practical terminal shell to secure your first badges.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Objective details card */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                  <div className="space-y-1 font-mono">
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">LAB OBJECTIVE</span>
                    <span className="text-sm text-cyan-300 font-bold">Understand basic Linux cli navigation</span>
                  </div>

                  <div className="space-y-1 font-mono">
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">EXPECTED RUNTIME</span>
                    <span className="text-sm text-amber-400 font-bold">20 Minutes</span>
                  </div>

                  <div className="space-y-1 font-mono">
                    <span className="text-[9px] text-slate-500 uppercase block font-bold">XP REWARD</span>
                    <span className="text-sm text-emerald-400 font-bold">+400 XP • Stage 1 Badge</span>
                  </div>
                </div>

                {/* AMAN commands briefing */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">Armed CLI Tools</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['pwd', 'ls', 'whoami', 'cat', 'cd'].map(tool => (
                        <code key={tool} className="text-xs bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">
                          {tool}
                        </code>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-3">
                    Your lab instance has been isolated on our container nodes. Click START NOW to claim your codename shell and execute your first command.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          
          {/* Back Button */}
          {step > 0 && step !== 7 ? (
            <button
              onClick={() => {
                if (step === 8) {
                  // Reset diagnostic assessment state cleanly
                  setStep(6);
                  setRunDiagnostic(null);
                  setDiagIndex(0);
                  setDiagAnswers({});
                  setDiagFinished(false);
                } else {
                  setStep(s => s - 1);
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK
            </button>
          ) : (
            <div />
          )}

          {/* Continue / Next buttons */}
          {step < 6 ? (
            <button
              onClick={() => {
                // Perform simple codename check
                if (step === 0 && !codename.trim()) {
                  setCodename(`OPERATOR_${Math.floor(1000 + Math.random() * 9000)}`);
                }
                setStep(s => s + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer transition-colors"
            >
              CONTINUE
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : step === 6 && runDiagnostic === false ? (
            <button
              onClick={() => setStep(7)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer transition-all"
            >
              CONTINUE TO PROFILING
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : step === 7 ? (
            <button
              disabled={analysisProgress < 100}
              onClick={() => setStep(8)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer transition-all"
            >
              {analysisProgress < 100 ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                <>
                  VIEW PERSONALIZED ROADMAP
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : step === 8 ? (
            <button
              onClick={() => setStep(9)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 hover:opacity-90 text-slate-950 font-mono font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer transition-all uppercase"
            >
              START MY LEARNING PATH
              <Sparkles className="w-4 h-4 text-slate-950" />
            </button>
          ) : step === 9 ? (
            <button
              onClick={() => setStep(10)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer transition-all"
            >
              START NEXT
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : step === 10 ? (
            <button
              onClick={handleCompleteOnboarding}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 hover:opacity-90 text-slate-950 font-mono font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer transition-all uppercase animate-pulse"
            >
              START NOW
              <Terminal className="w-4 h-4 text-slate-950" />
            </button>
          ) : (
            <div />
          )}

        </div>

      </div>
    </div>
  );
};
