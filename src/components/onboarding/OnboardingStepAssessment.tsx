import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Brain, Check, HelpCircle, Shield, SkipForward, BarChart3 } from 'lucide-react';

export interface AssessmentQuestion {
  id: string;
  category: 'Computer Fundamentals' | 'Networking' | 'Linux' | 'Python' | 'Web Security' | 'Security Concepts';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    category: 'Computer Fundamentals',
    question: 'What is the primary role of an IP (Internet Protocol) address on a network?',
    options: [
      'To uniquely identify and locate a device or host on a computer network.',
      'To encrypt all outgoing hard drive data for physical theft prevention.',
      'To compile source code into executable assembly instructions.',
      'To regulate electrical voltage inside the central power supply unit.'
    ],
    correctIndex: 0,
    explanation: 'An IP address acts as a logical network identifier that routes packets between devices across a TCP/IP network.'
  },
  {
    id: 'q2',
    category: 'Computer Fundamentals',
    question: 'What is the fundamental privilege boundary between Operating System Kernel Space and User Space?',
    options: [
      'Kernel Space has unrestricted access to physical hardware/CPU instructions; User Space runs isolated unprivileged applications.',
      'User Space operates with ring-0 CPU access, while Kernel Space is restricted to file storage.',
      'Kernel Space handles graphical rendering, while User Space manages physical RAM registers.',
      'There is no technical difference between the two in modern operating systems.'
    ],
    correctIndex: 0,
    explanation: 'Kernel space executes in privileged CPU mode (Ring 0) with direct hardware access. User space (Ring 3) protects system integrity by isolating applications.'
  },
  {
    id: 'q3',
    category: 'Linux',
    question: 'Which standard Linux terminal command prints the absolute path of your current working directory?',
    options: ['cd ~', 'pwd', 'ls -la', 'whoami'],
    correctIndex: 1,
    explanation: '"pwd" stands for Print Working Directory and outputs the current folder path in UNIX/Linux environments.'
  },
  {
    id: 'q4',
    category: 'Networking',
    question: 'What is the default TCP port reserved worldwide for encrypted HTTPS secure web communications?',
    options: ['Port 22', 'Port 80', 'Port 443', 'Port 8080'],
    correctIndex: 2,
    explanation: 'Port 443 is the standard port for TLS/SSL encrypted HTTPS traffic (Port 80 is unencrypted HTTP).'
  },
  {
    id: 'q5',
    category: 'Python',
    question: 'Which Python standard or third-party library is most commonly used by security professionals to make HTTP requests and automate API interactions?',
    options: ['requests', 'pandas', 'pygame', 'numpy'],
    correctIndex: 0,
    explanation: 'The Python "requests" library provides human-readable HTTP methods (GET, POST, headers) essential for security scripting.'
  },
  {
    id: 'q6',
    category: 'Web Security',
    question: 'What type of vulnerability occurs when untrusted user input is directly concatenated into a backend database statement without parameterization?',
    options: [
      'SQL Injection (SQLi)',
      'Cross-Site Request Forgery (CSRF)',
      'Buffer Overflow',
      'DNS Cache Poisoning'
    ],
    correctIndex: 0,
    explanation: 'SQL Injection allows attackers to manipulate database queries by injecting structured SQL syntax into vulnerable input fields.'
  },
  {
    id: 'q7',
    category: 'Web Security',
    question: 'What is the primary mechanism of a Cross-Site Scripting (XSS) vulnerability in a web application?',
    options: [
      'Executing arbitrary malicious JavaScript within the victim’s browser session.',
      'Physically crashing the remote web server hardware via packet saturation.',
      'Decrypting the database administrator master password via brute force.',
      'Overheating the client-side CPU GPU shader cores.'
    ],
    correctIndex: 0,
    explanation: 'XSS allows attackers to inject client-side scripts (usually JavaScript) that execute in the browser of other users viewing the application.'
  },
  {
    id: 'q8',
    category: 'Security Concepts',
    question: 'What are the three core foundational pillars of the standard cybersecurity "CIA Triad"?',
    options: [
      'Confidentiality, Integrity, and Availability',
      'Cryptography, Intelligence, and Authentication',
      'Control, Inspection, and Auditing',
      'Cloud, Internet, and Automation'
    ],
    correctIndex: 0,
    explanation: 'The CIA triad (Confidentiality, Integrity, Availability) represents the foundational model governing information security policies.'
  },
  {
    id: 'q9',
    category: 'Networking',
    question: 'What is the primary function of a Network Firewall?',
    options: [
      'Inspecting and filtering incoming and outgoing network traffic based on predefined security rules.',
      'Increasing physical broadband upload bandwidth speed.',
      'Storing compressed backups of operating system log files.',
      'Providing wireless Bluetooth synchronization for peripheral devices.'
    ],
    correctIndex: 0,
    explanation: 'A firewall monitors, filters, and blocks unauthorized network connections between trusted internal and untrusted external networks.'
  },
  {
    id: 'q10',
    category: 'Security Concepts',
    question: 'What does "SOC" stand for in an enterprise cybersecurity defensive operations organization?',
    options: [
      'Security Operations Center',
      'System Optimization Controller',
      'Secure Output Channel',
      'Standard Operating Certificate'
    ],
    correctIndex: 0,
    explanation: 'A Security Operations Center (SOC) is the central team that monitors, detects, analyzes, and responds to cybersecurity incidents.'
  }
];

interface OnboardingStepAssessmentProps {
  onComplete: (scores: Record<string, number>, skipped: boolean) => void;
  onBack: () => void;
}

export const OnboardingStepAssessment: React.FC<OnboardingStepAssessmentProps> = ({
  onComplete,
  onBack
}) => {
  const [assessmentStarted, setAssessmentStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = ASSESSMENT_QUESTIONS[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleNext = () => {
    if (currentIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateCategoryScores = () => {
    const categoryTotals: Record<string, { correct: number; total: number }> = {};

    ASSESSMENT_QUESTIONS.forEach((q, idx) => {
      const cat = q.category;
      if (!categoryTotals[cat]) categoryTotals[cat] = { correct: 0, total: 0 };
      categoryTotals[cat].total += 1;
      if (answers[idx] === q.correctIndex) {
        categoryTotals[cat].correct += 1;
      }
    });

    const categoryPercentages: Record<string, number> = {};
    Object.entries(categoryTotals).forEach(([cat, stats]) => {
      categoryPercentages[cat] = Math.round((stats.correct / stats.total) * 100);
    });

    return categoryPercentages;
  };

  const finishAssessment = () => {
    setIsFinished(true);
  };

  const handleProceedToPath = () => {
    const scores = calculateCategoryScores();
    onComplete(scores, false);
  };

  const handleSkip = () => {
    const defaultScores: Record<string, number> = {
      'Computer Fundamentals': 50,
      'Networking': 30,
      'Linux': 30,
      'Python': 20,
      'Web Security': 20,
      'Security Concepts': 40
    };
    onComplete(defaultScores, true);
  };

  // 1. Initial Choice Screen: Start vs Skip
  if (!assessmentStarted && !isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-8 animate-fadeIn text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Brain className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
            STEP 3 OF 6 • SKILL CALIBRATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            Let's understand your current skills
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Take a quick, 10-question assessment (~3 minutes) so AMAN can customize your starting point and unlock relevant modules.
          </p>
        </div>

        {/* Feature Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-mono text-xs font-bold block">10 SHORT QUESTIONS</span>
            <span className="text-[11px] text-slate-400 leading-snug block">Covers Linux, Networking, Web Security, & OS.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-indigo-400 font-mono text-xs font-bold block">NO STRESS TIMER</span>
            <span className="text-[11px] text-slate-400 leading-snug block">Answer at your own pace with zero penalties.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-mono text-xs font-bold block">SKILL PLACEMENT</span>
            <span className="text-[11px] text-slate-400 leading-snug block">Skip beginner modules if you already know them.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setAssessmentStarted(true)}
            className="w-full py-4 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
          >
            <Brain className="w-4 h-4 text-slate-950" />
            <span>START SKILL ASSESSMENT (10 QUESTIONS)</span>
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-3.5 px-6 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 font-mono text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>SKIP FOR NOW (START FROM ZERO)</span>
          </button>
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <button
            onClick={onBack}
            className="text-xs font-mono text-slate-500 hover:text-slate-400 transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to goals</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Results Screen
  if (isFinished) {
    const scores = calculateCategoryScores();
    const totalCorrect = Object.values(answers).filter(
      (ans, idx) => ans === ASSESSMENT_QUESTIONS[idx].correctIndex
    ).length;
    const overallPercent = Math.round((totalCorrect / ASSESSMENT_QUESTIONS.length) * 100);

    return (
      <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 animate-fadeIn text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <BarChart3 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
            ASSESSMENT COMPLETE
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            Initial Skill Profile Calculated
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            You answered <strong className="text-white">{totalCorrect} of 10</strong> questions correctly ({overallPercent}% baseline).
          </p>
        </div>

        {/* Skills Breakdown Grid */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left space-y-3.5 font-mono">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
            BASELINE MASTERY BREAKDOWN:
          </span>

          <div className="space-y-2.5">
            {Object.entries(scores).map(([category, score]) => (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{category}</span>
                  <span className="text-cyan-400 font-bold">{score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to View Path */}
        <button
          onClick={handleProceedToPath}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
        >
          <span>VIEW MY PERSONALIZED LEARNING PATH</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    );
  }

  // 3. Question Form
  const isSelected = answers[currentIndex] !== undefined;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 animate-fadeIn">
      {/* Top Header & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-400 font-bold uppercase tracking-wider">
            QUESTION {currentIndex + 1} OF {ASSESSMENT_QUESTIONS.length}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
            {currentQ.category}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
        <h3 className="font-mono font-bold text-white text-base sm:text-lg leading-relaxed">
          {currentQ.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {currentQ.options.map((option, idx) => {
          const selectedThis = answers[currentIndex] === idx;

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`w-full p-4 rounded-xl border text-left flex items-start justify-between gap-3 font-mono text-xs sm:text-sm transition-all cursor-pointer ${
                selectedThis
                  ? 'bg-slate-800 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                  selectedThis ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed">{option}</span>
              </div>

              <div className="shrink-0 mt-1">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    selectedThis
                      ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                      : 'border-slate-700 bg-transparent'
                  }`}
                >
                  {selectedThis && <Check className="w-3 h-3 text-slate-950 font-black" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="py-3 px-5 rounded-xl border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={handleSkip}
            className="text-xs font-mono text-slate-500 hover:text-slate-400 transition-colors cursor-pointer"
          >
            Skip Assessment
          </button>

          <button
            onClick={handleNext}
            disabled={!isSelected}
            className="py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
          >
            <span>{currentIndex === ASSESSMENT_QUESTIONS.length - 1 ? 'SUBMIT' : 'NEXT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
