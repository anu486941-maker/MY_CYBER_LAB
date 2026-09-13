import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Crosshair, 
  Globe, 
  Flag, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  CheckCircle2, 
  Check, 
  Bot, 
  Layers,
  ChevronRight,
  Terminal,
  Zap
} from 'lucide-react';

interface RoleOption {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
  bgGlow: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'ethical-hacker',
    title: 'Ethical Hacker',
    badge: 'OFFENSIVE SECURITY',
    description: 'Offensive security, network penetration testing, exploit tactics & privilege escalation.',
    icon: Crosshair,
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    bgGlow: 'bg-cyan-950/20'
  },
  {
    id: 'soc-analyst',
    title: 'SOC Analyst',
    badge: 'DEFENSIVE OPERATIONS',
    description: 'SIEM log analysis, telemetry monitoring, incident response & threat containment.',
    icon: Shield,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    bgGlow: 'bg-amber-950/20'
  },
  {
    id: 'web-security',
    title: 'Web Security',
    badge: 'APPLICATION DEFENSE',
    description: 'OWASP Top 10, SQL injection, authentication bypasses & API security testing.',
    icon: Globe,
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    bgGlow: 'bg-emerald-950/20'
  },
  {
    id: 'ctf-ethical-hacker',
    title: 'CTF Player',
    badge: 'COMPETITIVE CYBER',
    description: 'Capture The Flag puzzles, reverse engineering, cryptography & speed solving.',
    icon: Flag,
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    bgGlow: 'bg-purple-950/20'
  },
  {
    id: 'beginner-explore',
    title: 'Cybersecurity Beginner',
    badge: 'START FROM ZERO',
    description: 'Fundamental computer concepts, Linux terminal basics, networking & cyber foundations.',
    icon: Sparkles,
    accentColor: 'text-teal-400',
    borderColor: 'border-teal-500/40 hover:border-teal-400',
    bgGlow: 'bg-teal-950/20'
  }
];

interface CalibrationQuestion {
  question: string;
  options: { label: string; levelWeight: number }[];
}

const CALIBRATION_QUESTIONS: Record<string, CalibrationQuestion[]> = {
  'ethical-hacker': [
    {
      question: 'How familiar are you with Linux terminal and command-line navigation?',
      options: [
        { label: 'Never used Linux or a terminal before', levelWeight: 0 },
        { label: 'Know basic commands like cd, ls, cat, and grep', levelWeight: 1 },
        { label: 'Comfortable with shell scripting and system permissions', levelWeight: 2 },
        { label: 'Advanced: know kernel exploits, SUID binaries, and privesc', levelWeight: 3 }
      ]
    },
    {
      question: 'What is your experience with network scanning and port enumeration (e.g. Nmap)?',
      options: [
        { label: 'No experience with port scanning', levelWeight: 0 },
        { label: 'Understand IP addresses, ports, and what Nmap does', levelWeight: 1 },
        { label: 'Have executed SYN scans, service detection, and NSE scripts', levelWeight: 2 },
        { label: 'Expert in stealth scanning, banner grabbing, and evasions', levelWeight: 3 }
      ]
    },
    {
      question: 'Have you ever tested or exploited a system vulnerability?',
      options: [
        { label: 'No, looking to learn ethical hacking concepts from scratch', levelWeight: 0 },
        { label: 'Tried basic tutorial challenges or simple CTF exercises', levelWeight: 1 },
        { label: 'Executed common exploits like SQLi, brute forcing, or Metasploit modules', levelWeight: 2 },
        { label: 'Conducted authorized penetration tests and written proof-of-concepts', levelWeight: 3 }
      ]
    }
  ],
  'soc-analyst': [
    {
      question: 'What is your background with system logs and SIEM concepts?',
      options: [
        { label: 'Completely new to security logs and monitoring', levelWeight: 0 },
        { label: 'Understand what Syslog, auth.log, and Windows Event logs are', levelWeight: 1 },
        { label: 'Have queried SIEM dashboards (Splunk, Elastic, or Sentinel)', levelWeight: 2 },
        { label: 'Built custom Sigma detection rules and correlated multi-source alerts', levelWeight: 3 }
      ]
    },
    {
      question: 'How comfortable are you analyzing network traffic and packet captures?',
      options: [
        { label: 'Never analyzed network packets', levelWeight: 0 },
        { label: 'Understand TCP/IP handshakes and common protocol ports', levelWeight: 1 },
        { label: 'Have filtered and inspected PCAP files using Wireshark or tcpdump', levelWeight: 2 },
        { label: 'Expert at spotting C2 beaconing, DNS tunneling, and ARP spoofing', levelWeight: 3 }
      ]
    },
    {
      question: 'Have you handled security incident containment or malware triage?',
      options: [
        { label: 'No prior incident response experience', levelWeight: 0 },
        { label: 'Familiar with basic incident response steps and MITRE ATT&CK', levelWeight: 1 },
        { label: 'Have isolated infected endpoints and gathered memory/disk artifacts', levelWeight: 2 },
        { label: 'Led live incident response, root-cause eradication, and post-mortems', levelWeight: 3 }
      ]
    }
  ],
  'web-security': [
    {
      question: 'How comfortable are you with HTTP protocols and web technologies?',
      options: [
        { label: 'Basic web browsing knowledge only', levelWeight: 0 },
        { label: 'Understand HTTP requests/responses, headers, and cookies', levelWeight: 1 },
        { label: 'Familiar with browser DevTools, REST APIs, and authentication tokens', levelWeight: 2 },
        { label: 'Deep understanding of web architectures, CSP, CORS, and microservices', levelWeight: 3 }
      ]
    },
    {
      question: 'What is your familiarity with the OWASP Top 10 vulnerabilities?',
      options: [
        { label: 'Never heard of OWASP Top 10', levelWeight: 0 },
        { label: 'Recognize names like SQL Injection and Cross-Site Scripting (XSS)', levelWeight: 1 },
        { label: 'Have identified and exploited SQLi, IDOR, or CSRF in lab environments', levelWeight: 2 },
        { label: 'Conducted full web app source code audits and authorized pentests', levelWeight: 3 }
      ]
    },
    {
      question: 'Have you used web proxy tools like Burp Suite or OWASP ZAP?',
      options: [
        { label: 'Never used an intercepting proxy', levelWeight: 0 },
        { label: 'Have seen demonstrations or understand proxy concepts', levelWeight: 1 },
        { label: 'Regularly intercept, modify, and repeat HTTP payloads in Burp', levelWeight: 2 },
        { label: 'Advanced use of Burp Intruder, macro scripts, and custom extensions', levelWeight: 3 }
      ]
    }
  ],
  'ctf-ethical-hacker': [
    {
      question: 'What is your experience with Capture The Flag (CTF) challenges?',
      options: [
        { label: 'Brand new to CTF competitions', levelWeight: 0 },
        { label: 'Played beginner challenges on OverTheWire (Bandit) or PicoCTF', levelWeight: 1 },
        { label: 'Regularly solve HackTheBox, TryHackMe, or university CTFs', levelWeight: 2 },
        { label: 'Compete in national or global cybersecurity CTF rankings', levelWeight: 3 }
      ]
    },
    {
      question: 'How comfortable are you with cryptography and encoding techniques?',
      options: [
        { label: 'No experience with crypto or encodings', levelWeight: 0 },
        { label: 'Familiar with Base64, Hex, and basic substitution ciphers (Caesar/ROT13)', levelWeight: 1 },
        { label: 'Understand RSA public-key crypto, hash collisions, and CyberChef recipes', levelWeight: 2 },
        { label: 'Experienced in breaking weak crypto implementations and custom algorithms', levelWeight: 3 }
      ]
    },
    {
      question: 'Have you worked with binary analysis, reverse engineering, or forensics?',
      options: [
        { label: 'Never opened a binary in a disassembler', levelWeight: 0 },
        { label: 'Familiar with file signatures (magic bytes) and strings command', levelWeight: 1 },
        { label: 'Have inspected assembly/decompiled code with Ghidra, IDA, or GDB', levelWeight: 2 },
        { label: 'Comfortable with buffer overflows, ROP chains, and Ghidra scripting', levelWeight: 3 }
      ]
    }
  ],
  'beginner-explore': [
    {
      question: 'What is your background with computers and operating systems?',
      options: [
        { label: 'Daily casual computer user (browsing, docs, apps)', levelWeight: 0 },
        { label: 'Familiar with file directories, installing software, and basic settings', levelWeight: 1 },
        { label: 'Have used command line prompts (CMD / PowerShell / Terminal)', levelWeight: 2 },
        { label: 'Comfortable troubleshooting hardware, OS configs, and basic networking', levelWeight: 3 }
      ]
    },
    {
      question: 'How do you describe your knowledge of computer networks?',
      options: [
        { label: 'I know Wi-Fi connects me to the internet', levelWeight: 0 },
        { label: 'Understand what IP addresses and domain names (DNS) are', levelWeight: 1 },
        { label: 'Understand routers, switches, subnets, and client-server models', levelWeight: 2 },
        { label: 'Familiar with OSI 7-layer model, packet routing, and firewall rules', levelWeight: 3 }
      ]
    },
    {
      question: 'What is your primary goal in cybersecurity right now?',
      options: [
        { label: 'Explore the field from zero and discover what interests me', levelWeight: 0 },
        { label: 'Build practical hands-on skills in Linux and networking', levelWeight: 1 },
        { label: 'Prepare for a cybersecurity career or certification', levelWeight: 2 },
        { label: 'Advance quickly toward hands-on ethical hacking and defense labs', levelWeight: 3 }
      ]
    }
  ]
};

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile, currentUser } = useApp();
  const navigate = useNavigate();

  // Onboarding steps: 0 = Welcome, 1 = Role Selection, 2 = AMAN Calibration Questions, 3 = Calibration Result
  const [step, setStep] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<string>('ethical-hacker');
  const [answers, setAnswers] = useState<number[]>([0, 0, 0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Derive calibrated level based on score sum (0 - 9)
  const getCalibratedLevel = (ans: number[]): 'Beginner' | 'Foundation' | 'Intermediate' | 'Advanced' => {
    const total = ans.reduce((a, b) => a + b, 0);
    if (total <= 2) return 'Beginner';
    if (total <= 5) return 'Foundation';
    if (total <= 7) return 'Intermediate';
    return 'Advanced';
  };

  const currentQuestions = CALIBRATION_QUESTIONS[selectedRole] || CALIBRATION_QUESTIONS['beginner-explore'];
  const calibratedLevel = getCalibratedLevel(answers);

  const selectedRoleObj = ROLES.find(r => r.id === selectedRole) || ROLES[0];

  const handleSelectAnswer = (qIndex: number, weight: number) => {
    const updated = [...answers];
    updated[qIndex] = weight;
    setAnswers(updated);
  };

  const handleFinishCalibration = async () => {
    setIsSubmitting(true);
    try {
      const finalLevel = getCalibratedLevel(answers);
      const cyberLevelNumber = finalLevel === 'Advanced' ? 3 : finalLevel === 'Intermediate' ? 2 : 1;

      await updateProfile({
        name: profile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Operator',
        selectedRole: selectedRole,
        targetRole: selectedRole,
        learningGoal: `Master ${selectedRoleObj.title}`,
        skillLevel: finalLevel,
        calibratedLevel: finalLevel,
        cyberLevel: cyberLevelNumber,
        onboardingCompleted: true,
        emailVerified: currentUser?.emailVerified ?? true
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save onboarding profile:', err);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* STEP 0: WELCOME SCREEN */}
      {step === 0 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.12)] text-center space-y-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Shield className="w-12 h-12" />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MY CYBER LAB ACADEMY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-white tracking-tight">
              Welcome to MY CYBER LAB
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              Your AI-powered cybersecurity learning journey starts here.
            </p>
          </div>

          <div className="pt-4 max-w-md mx-auto">
            <button
              id="onboarding-get-started-btn"
              onClick={() => setStep(1)}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>GET STARTED →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: ROLE SELECTION (5 CLEAN SELECTABLE CARDS) */}
      {step === 1 && (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8 animate-fadeIn">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
              <span>STEP 1 OF 2</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
              What do you want to learn?
            </h2>
            <p className="text-sm text-slate-400 font-sans">
              Choose your primary focus to personalize your curriculum.
            </p>
          </div>

          {/* 5 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? `border-cyan-400 bg-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.2)]`
                      : `border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80`
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {role.badge}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                        {role.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <p className="text-xs font-mono text-slate-400">
              You can change your role later.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(0)}
              className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              ← Back
            </button>

            <button
              id="onboarding-continue-to-calibration-btn"
              onClick={() => setStep(2)}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <span>Continue to Skill Calibration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 3 SHORT CALIBRATION QUESTIONS */}
      {step === 2 && (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8 animate-fadeIn">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
              <Bot className="w-3.5 h-3.5" />
              <span>AMAN SKILL CALIBRATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
              Calibrating for {selectedRoleObj.title}
            </h2>
            <p className="text-sm text-slate-400 font-sans">
              Answer 3 quick questions so AMAN sets the right starting difficulty for you.
            </p>
          </div>

          <div className="space-y-6">
            {currentQuestions.map((q, qIdx) => (
              <div key={qIdx} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  <h3 className="text-sm font-mono font-bold text-white">
                    {q.question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[qIdx] === opt.levelWeight;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(qIdx, opt.levelWeight)}
                        className={`p-3 rounded-xl border text-left font-sans text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <span className="leading-snug">{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              ← Back
            </button>

            <button
              id="onboarding-see-calibration-btn"
              onClick={() => setStep(3)}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <span>See My Calibration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CALIBRATION RESULT & ROADMAP BUILD */}
      {step === 3 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] text-center space-y-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Brain className="w-12 h-12 text-cyan-400" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CALIBRATION COMPLETE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
              AMAN has calibrated your starting level.
            </h2>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 mt-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Selected Role:</span>
                <span className="text-sm font-mono font-bold text-cyan-300">{selectedRoleObj.title}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Starting Level:</span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider">
                  {calibratedLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans pt-1">
                AMAN has organized your learning path with real hands-on labs and foundational missions matched to your level.
              </p>
            </div>
          </div>

          <div className="pt-4 max-w-md mx-auto space-y-3">
            <button
              id="onboarding-build-roadmap-btn"
              onClick={handleFinishCalibration}
              disabled={isSubmitting}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'BUILDING ROADMAP...' : 'Build My Roadmap →'}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Retake calibration questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
