import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceLevel, LanguagePreference, DailyTimeGoal, LearningStyle, CareerRoleId } from '../../types';
import { CAREER_ROLES_DATA } from '../../data/careerRolesData';
import { speechEngine } from '../../utils/speechEngine';
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
  Video,
  MousePointerClick,
  Bot,
  Volume2,
  VolumeX,
  Loader2,
  Award,
  CheckCircle2,
  Target,
  Layers,
  HelpCircle,
  Cpu,
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

export const OnboardingModal: React.FC = () => {
  const { profile, updateProfile, isOnboardingOpen, setIsOnboardingOpen } = useApp();

  const [step, setStep] = useState<number>(0);
  const [codename, setCodename] = useState<string>(profile.codename || 'OPERATOR_01');
  const [primaryRole, setPrimaryRole] = useState<CareerRoleId>('soc-analyst');
  const [secondaryRoles, setSecondaryRoles] = useState<CareerRoleId[]>([]);
  const [experience, setExperience] = useState<ExperienceLevel>(profile.experience || 'beginner');
  const [dailyTime, setDailyTime] = useState<DailyTimeGoal>(profile.dailyTime || '30m');
  const [language, setLanguage] = useState<LanguagePreference>(profile.language || 'English');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(profile.learningStyle || 'mixed');

  // Voice States
  const [voiceActive, setVoiceActive] = useState<boolean>(true);
  const [voiceTriggered, setVoiceTriggered] = useState<Record<number, boolean>>({});

  // Diagnostic states
  const [runDiagnostic, setRunDiagnostic] = useState<boolean | null>(null);
  const [diagIndex, setDiagIndex] = useState<number>(0);
  const [diagAnswers, setDiagAnswers] = useState<Record<number, number>>({});
  const [diagFinished, setDiagFinished] = useState<boolean>(false);
  const [diagScore, setDiagScore] = useState<number>(0);

  // Analyzing states
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [analysisPhase, setAnalysisPhase] = useState<number>(0);

  // Lifecycle voice trigger for step 0 (Welcome)
  useEffect(() => {
    if (isOnboardingOpen && step === 0 && voiceActive && !voiceTriggered[0]) {
      const timer = setTimeout(() => {
        speechEngine.speak(
          "Welcome to MY CYBER LAB. Main AMAN hoon. Main aapki cybersecurity journey ko personally guide karunga. Pehle mujhe aapka goal aur learning style samajhne do."
        );
        setVoiceTriggered(prev => ({ ...prev, 0: true }));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOnboardingOpen, step, voiceActive]);

  // Lifecycle profiling simulation (Step 7)
  useEffect(() => {
    if (step === 7) {
      setAnalysisProgress(0);
      setAnalysisLogs([]);
      
      const logs = [
        "Initializing career blueprint compiling environment...",
        `Target role set: ${CAREER_ROLES_DATA.find(r => r.id === primaryRole)?.title || primaryRole}`,
        `Secondary interests identified: ${secondaryRoles.length > 0 ? secondaryRoles.join(', ') : 'None'}`,
        "Parsing Daily learning objective pacing...",
        `Language framework established: ${language}`,
        "Evaluating diagnostic credentials...",
      ];

      let logIndex = 0;
      const interval = setInterval(() => {
        if (logIndex < logs.length) {
          setAnalysisLogs(prev => [...prev, `[✔] ${logs[logIndex]}`]);
          logIndex++;
          setAnalysisProgress(p => Math.min(p + 15, 90));
        } else {
          clearInterval(interval);
          
          // Complete assessment metrics
          let correct = 0;
          if (runDiagnostic) {
            ONBOARDING_DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
              if (diagAnswers[idx] === q.correctIndex) correct++;
            });
          }
          setDiagScore(correct);

          // Propose final evaluation logs
          setTimeout(() => {
            const finalScorePercentage = runDiagnostic ? Math.round((correct / ONBOARDING_DIAGNOSTIC_QUESTIONS.length) * 100) : null;
            const feedbackLog = runDiagnostic 
              ? `Diagnostic evaluation compiled: Score ${correct}/5 (${finalScorePercentage}%).`
              : "Diagnostic bypassed by request. Relying on self-reported baseline.";
            
            let recommendedLevelLabel = "Complete Beginner";
            let updatedLevel: ExperienceLevel = 'beginner';

            if (runDiagnostic) {
              if (correct >= 4) {
                recommendedLevelLabel = "Advanced (Already Studying)";
                updatedLevel = 'already_studying';
              } else if (correct >= 2) {
                recommendedLevelLabel = "Intermediate (Some Linux/Networking)";
                updatedLevel = 'some_linux';
              } else {
                recommendedLevelLabel = "Beginner (Complete Foundations)";
                updatedLevel = 'beginner';
              }
            } else {
              updatedLevel = experience;
              if (experience === 'already_studying') recommendedLevelLabel = "Advanced (Self-Reported)";
              else if (experience === 'some_linux' || experience === 'some_networking') recommendedLevelLabel = "Intermediate (Self-Reported)";
              else recommendedLevelLabel = "Beginner (Self-Reported)";
            }

            // Save experience level change!
            setExperience(updatedLevel);

            setAnalysisLogs(prev => [
              ...prev,
              `[✔] ${feedbackLog}`,
              `[✔] Optimal alignment calibration: Recommended Starting Point -> ${recommendedLevelLabel.toUpperCase()}`,
              `[✔] SECURE ROADMAP ACCESS GRANTED.`
            ]);
            setAnalysisProgress(100);
            
            // Speak recommendation once analysis completes
            if (voiceActive && !voiceTriggered[7]) {
              const speakText = language === 'Hinglish'
                ? "Aapka personalized roadmap set kar diya hai. Base level aur primary topics are primed. Let's begin learning!"
                : "Your personalized cybersecurity roadmap has been configured and optimized. Let's begin learning!";
              speechEngine.speak(speakText);
              setVoiceTriggered(prev => ({ ...prev, 7: true }));
            }
          }, 800);
        }
      }, 700);

      return () => clearInterval(interval);
    }
  }, [step, runDiagnostic, primaryRole, secondaryRoles, language, experience]);

  if (!isOnboardingOpen) return null;

  const handleFinishOnboarding = () => {
    updateProfile({
      codename: codename.trim() || 'OPERATOR_01',
      targetRole: primaryRole,
      secondaryRoles,
      experience,
      dailyTime,
      language,
      learningStyle,
      onboardingCompleted: true
    });
    setIsOnboardingOpen(false);
  };

  const toggleVoice = () => {
    if (voiceActive) {
      speechEngine.stop();
      setVoiceActive(false);
    } else {
      setVoiceActive(true);
      // Replay active step
      if (step === 0) {
        speechEngine.speak("Welcome to MY CYBER LAB. Main AMAN hoon. Main aapki cybersecurity journey ko personally guide karunga. Pehle mujhe aapka goal aur learning style samajhne do.");
      } else if (step === 8) {
        const speakText = language === 'Hinglish'
          ? "Aapka personalized roadmap set kar diya hai. Base level aur primary topics are primed. Let's begin learning!"
          : "Your personalized cybersecurity roadmap has been configured and optimized. Let's begin learning!";
        speechEngine.speak(speakText);
      }
    }
  };

  const handleSelectSecondaryRole = (roleId: CareerRoleId) => {
    if (roleId === primaryRole) return; // Cannot be primary and secondary at the same time
    setSecondaryRoles(prev => 
      prev.includes(roleId)
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
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

  const styleOptions: { value: LearningStyle; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { value: 'reading', label: 'Guided (Theory First)', icon: BookOpen, desc: 'Deep dive technical briefs, structured blueprints, and security documentation first.' },
    { value: 'practice', label: 'Practical First (Hands-on)', icon: Terminal, desc: 'Direct sandbox terminals, traffic analysis tools, and proactive command injections first.' },
    { value: 'mixed', label: 'Balanced (Hybrid)', icon: Sparkles, desc: 'Fluid combination of step-by-step guidance, interactive quiz cards, and labs.' },
    { value: 'missions', label: 'Challenge First (Gamified)', icon: Gamepad2, desc: 'Story-driven task sheets, red/blue operations, and active objective progressions.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8 flex flex-col max-h-[90vh]">
        
        {/* Onboarding Topbar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-mono font-black text-xs text-slate-300 tracking-widest uppercase">AMAN ADVISOR ENGINE</span>
              <span className="text-[10px] text-slate-500 font-mono block uppercase">
                {step === 0 && "Welcome Protocol"}
                {step === 1 && "Goal Alignment"}
                {step === 2 && "Knowledge Mapping"}
                {step === 3 && "Daily Pacing"}
                {step === 4 && "Language Adaptor"}
                {step === 5 && "Learning Preference"}
                {step === 6 && "Tactical Verification"}
                {step === 7 && "Analysis Phase"}
                {step === 8 && "Personalized Blueprint"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Speech synthesis controller */}
            <button
              onClick={toggleVoice}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                voiceActive
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
              title={voiceActive ? "Silence AMAN" : "Enable AMAN Speech"}
            >
              {voiceActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Pagination nodes */}
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
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

        {/* Onboarding Body content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-b from-slate-900 to-slate-950">
          
          {/* STEP 0: WELCOME & INTRODUCE AMAN */}
          {step === 0 && (
            <div className="space-y-6 py-4 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-bounce">
                <Bot className="w-10 h-10" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-100 tracking-tight">
                  WELCOME, OPERATOR
                </h2>
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 max-w-lg mx-auto relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                  <p className="text-sm text-cyan-300 font-mono leading-relaxed text-left">
                    &ldquo;Welcome to MY CYBER LAB. Main AMAN hoon. Main aapki cybersecurity journey ko personally guide karunga. Pehle mujhe aapka goal aur learning style samajhne do.&rdquo;
                  </p>
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed pt-2">
                  My Cyber Lab provides secure, simulated training sandboxes to build practical penetration testing and defensive engineering skills from the ground up.
                </p>
              </div>

              <div className="max-w-xs mx-auto text-left bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-2 shadow-lg">
                <label className="text-[10px] font-mono text-slate-500 tracking-wider block uppercase">SET YOUR OPERATOR CODENAME:</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-600 font-mono">OP_</span>
                  <input
                    type="text"
                    value={codename.startsWith('OP_') ? codename.slice(3) : codename}
                    onChange={(e) => setCodename(`OP_${e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '')}`)}
                    maxLength={12}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/50 uppercase transition-all"
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-mono block">Max 12 characters, alphanumeric and underscores only.</span>
              </div>
            </div>
          )}

          {/* STEP 1: CHOOSE YOUR CAREER GOAL (Primary & Secondary) */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  CHOOSE YOUR ULTIMATE CAREER GOAL
                </h3>
                <p className="text-xs text-slate-400">Select a Primary path to structure your active modules, and optionally check secondary paths of interest.</p>
              </div>

              {/* Career Goal display cards */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {CAREER_ROLES_DATA.map((role) => {
                  const isPrimary = primaryRole === role.id;
                  const isSecondary = secondaryRoles.includes(role.id as CareerRoleId);

                  return (
                    <div
                      key={role.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 relative ${
                        isPrimary
                          ? 'bg-slate-950/80 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : isSecondary
                          ? 'bg-slate-950/40 border-slate-800/80 border-dashed text-slate-300'
                          : 'bg-slate-950/30 border-slate-800 hover:border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <span className="text-2xl shrink-0 mt-0.5">{role.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-mono font-bold text-sm text-cyan-300">{role.title}</h4>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {role.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-normal">{role.tagline}</p>
                          </div>
                        </div>

                        {/* Alignment buttons */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setPrimaryRole(role.id as CareerRoleId);
                              setSecondaryRoles(prev => prev.filter(id => id !== role.id));
                            }}
                            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold transition-all ${
                              isPrimary
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                            }`}
                          >
                            {isPrimary ? 'PRIMARY PATH' : 'SET PRIMARY'}
                          </button>

                          {!isPrimary && (
                            <button
                              onClick={() => handleSelectSecondaryRole(role.id as CareerRoleId)}
                              className={`px-2.5 py-1.5 rounded-lg font-mono text-[10px] border transition-all ${
                                isSecondary
                                  ? 'bg-slate-800/80 border-emerald-500/40 text-emerald-400'
                                  : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {isSecondary ? '✓ INTERESTED' : '+ ADD INTEREST'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE EXPERIENCE LEVEL */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  CHOOSE YOUR STARTING EXPERIENCE LEVEL
                </h3>
                <p className="text-xs text-slate-400">Select where you honest think your capabilities lie. We will double-check this with a short diagnostic check later.</p>
              </div>

              <div className="space-y-3">
                {experienceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setExperience(opt.value)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                      experience === opt.value
                        ? 'bg-slate-950/80 border-cyan-505 border-cyan-500 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-800 hover:bg-slate-950/20'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold text-sm text-cyan-300">{opt.label}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-normal">{opt.desc}</div>
                    </div>
                    {experience === opt.value && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE DAILY STUDY TIME */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  CHOOSE YOUR DAILY STUDY TIME COMMITMENT
                </h3>
                <p className="text-xs text-slate-400">Set your target daily training volume. Consistency builds technical memory much faster than brief cramming.</p>
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
                        <div className="text-xs text-slate-400 mt-0.5">{opt.sub}</div>
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

          {/* STEP 4: CHOOSE LANGUAGE */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  CHOOSE LANGUAGE ADAPTOR FOR AMAN EXPLANATIONS
                </h3>
                <p className="text-xs text-slate-400">Specify your language preference. AMAN adapts its conversations on technical terms and dialogues.</p>
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

          {/* STEP 5: CHOOSE LEARNING STYLE */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  CHOOSE YOUR LEARNING STYLE PREFERENCE
                </h3>
                <p className="text-xs text-slate-400">Let us know how your mind processes technical structures so we prioritize specific content formats.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {styleOptions.map((opt) => {
                  const Icon = opt.icon;
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
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${learningStyle === opt.value ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <span className="font-mono font-bold text-xs text-cyan-300">{opt.label}</span>
                        </div>
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

          {/* STEP 6: OPTIONAL DIAGNOSTIC ASSESSMENT */}
          {step === 6 && (
            <div className="space-y-4">
              {runDiagnostic === null ? (
                <div className="space-y-6 text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <HelpCircle className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-mono font-black text-slate-100">RUN BASICS ADAPTIVE DIAGNOSTIC?</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      Instead of relying purely on self-reported experience, AMAN can present **5 foundational questions** covering operating systems, networks, and secure reasoning.
                    </p>
                    <p className="text-[11px] text-cyan-400 font-mono">
                      Recommended: We will optimize your roadmap starting points so you don&apos;t waste time repeating things you already master.
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
                        setStep(7); // Jump straight to profiling
                      }}
                      className="flex-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      NO, SKIP ASSESSMENT
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
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
                          setStep(7); // Advance to analysis logs
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
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
                  <Loader2 className="w-7 h-7 animate-spin" />
                </div>
                <h3 className="text-lg font-mono font-black text-slate-100 uppercase tracking-wider">AMAN PROFILING RUNNING</h3>
                <p className="text-xs text-slate-400">Please wait while AMAN compiles your personalized laboratory curriculum...</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>

              {/* Terminal Logs Simulation */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 shadow-inner max-h-[220px] overflow-y-auto scrollbar-thin">
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

          {/* STEP 8: PERSONALIZED ROADMAP & AMAN SPEAKS */}
          {step === 8 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-2">
                  <Award className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-mono font-black text-slate-100 tracking-tight">
                  YOUR PERSONALIZED CYBER RANGE ROADMAP
                </h3>
                <p className="text-xs text-slate-400">AMAN has successfully compiled your technical curriculum sequence.</p>
              </div>

              {/* Blueprint Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Profile parameters card */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3 shadow-md">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">Operator Blueprint</span>
                  
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">CODENAME:</span>
                      <span className="text-slate-200 font-bold">{codename}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">PRIMARY PATH:</span>
                      <span className="text-cyan-400 font-bold">
                        {CAREER_ROLES_DATA.find(r => r.id === primaryRole)?.title || primaryRole}
                      </span>
                    </div>
                    {secondaryRoles.length > 0 && (
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">SECONDARY:</span>
                        <span className="text-slate-400 font-medium">
                          {secondaryRoles.map(id => CAREER_ROLES_DATA.find(r => r.id === id)?.title || id).join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">STARTING LEVEL:</span>
                      <span className="text-emerald-400 font-bold uppercase">
                        {experience === 'beginner' ? 'Complete Beginner' : 
                         experience === 'some_computer' ? 'Basic Foundations' :
                         experience === 'some_linux' ? 'Intermediate Linux' : 'Advanced Sec'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">DAILY PACE:</span>
                      <span className="text-amber-400 font-bold">
                        {dailyTime === '15m' ? '15 mins/day' :
                         dailyTime === '30m' ? '30 mins/day' :
                         dailyTime === '1h' ? '1 hour/day' : 'Intensive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">PACING MODEL:</span>
                      <span className="text-indigo-400 uppercase font-semibold">{learningStyle}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Milestone list */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3.5 shadow-md flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">Curriculum Sequencer</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/20 flex items-center justify-center font-mono text-[9px] font-bold">01</div>
                        <span className="text-slate-300 font-mono font-medium">Stage 1: Core Fundamentals & Shell</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/20 flex items-center justify-center font-mono text-[9px] font-bold">02</div>
                        <span className="text-slate-300 font-mono font-medium">Stage 2: Active Diagnostics & Recon</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/20 flex items-center justify-center font-mono text-[9px] font-bold">03</div>
                        <span className="text-slate-300 font-mono font-medium">Stage 3: Advanced Tactical Scenarios</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span>Roadmap calibrated with AMAN Voice Instructor. Start Next is armed.</span>
                  </div>
                </div>
              </div>

              {/* AMAN Briefing */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase mb-1">
                  <span>AMAN Socratic Briefing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
                  {language === 'Hinglish'
                    ? "Aapka personalized roadmap set kar diya hai. Base level aur primary topics are primed. Let's begin learning!"
                    : "Your personalized cybersecurity roadmap has been configured and optimized. Let's begin learning!"}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Onboarding Footer Controls */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          {step > 0 && step !== 7 ? (
            <button
              onClick={() => {
                if (step === 8) {
                  setStep(6); // Return to diagnostic setup
                  setRunDiagnostic(null);
                  setDiagIndex(0);
                  setDiagAnswers({});
                  setDiagFinished(false);
                } else {
                  setStep(s => s - 1);
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer transition-all"
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
              onClick={handleFinishOnboarding}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer transition-all animate-pulse"
            >
              START NEXT
              <Sparkles className="w-4 h-4 text-slate-950" />
            </button>
          ) : (
            <div />
          )}
        </div>

      </div>
    </div>
  );
};
