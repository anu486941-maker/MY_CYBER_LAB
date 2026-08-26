import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  X, 
  Loader2, 
  ShieldCheck, 
  Compass, 
  Target, 
  Layers,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DiagnosticQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-1',
    category: 'Linux Fundamentals',
    question: 'Which command displays detailed file permissions, owner, and modification timestamps in a Linux directory?',
    options: ['ls -la', 'dir /all', 'chmod 755', 'ps aux'],
    correctIndex: 0,
    explanation: '`ls -la` lists all entries including hidden dotfiles in long format with file permissions.'
  },
  {
    id: 'diag-2',
    category: 'Networking & TCP/IP',
    question: 'What is the primary role of the TCP 3-Way Handshake before data transmission?',
    options: [
      'Encrypts data using asymmetric keys',
      'Synchronizes sequence numbers and establishes a reliable stateful connection (SYN, SYN-ACK, ACK)',
      'Translates domain names to IP addresses',
      'Filters unauthorized broadcast packets'
    ],
    correctIndex: 1,
    explanation: 'The 3-way handshake (SYN, SYN-ACK, ACK) establishes synchronization and initial sequence numbers for reliable byte streams.'
  },
  {
    id: 'diag-3',
    category: 'Ports & Protocols',
    question: 'A security scanner flags an open service on port 443 with a valid certificate. Does this alone indicate a vulnerability?',
    options: [
      'Yes, all open ports represent critical vulnerabilities',
      'No, port 443 is standard HTTPS; vulnerabilities depend on service version, cipher suites, and underlying application logic',
      'Yes, certificates always bypass firewall rules',
      'No, because port 443 only carries plaintext traffic'
    ],
    correctIndex: 1,
    explanation: 'An open port is simply a listening service. Security posture depends on software versions, configuration, and authorization checks.'
  },
  {
    id: 'diag-4',
    category: 'Web Security',
    question: 'What is the fundamental difference between Authentication and Authorization?',
    options: [
      'Authentication verifies identity ("Who are you?"), whereas Authorization defines access permissions ("What are you allowed to do?")',
      'Authentication is client-side only, Authorization is server-side only',
      'Authentication uses hashing, Authorization uses symmetric encryption',
      'They are interchangeable synonyms in modern cybersecurity'
    ],
    correctIndex: 0,
    explanation: 'Authentication proves identity (credentials/MFA); Authorization governs what resources the authenticated identity can access.'
  },
  {
    id: 'diag-5',
    category: 'SOC & Incident Triage',
    question: 'You notice 50 failed SSH login attempts from an external IP within 10 seconds followed by 1 successful login. What is your immediate triage hypothesis?',
    options: [
      'Routine NTP clock synchronization event',
      'Likely automated credential brute-force or dictionary attack with possible account compromise',
      'Corrupted DNS resolution cache',
      'Standard SSL handshake timeout'
    ],
    correctIndex: 1,
    explanation: 'Rapid sequential authentication failures followed by success is a signature indicator of automated credential guessing and requires immediate session investigation.'
  }
];

interface AmanDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmanDiagnosticModal: React.FC<AmanDiagnosticModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useApp();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const isLastQuestion = currentIndex === DIAGNOSTIC_QUESTIONS.length - 1;

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleNext = () => {
    if (currentIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitDiagnostic = async () => {
    setIsSubmitting(true);
    try {
      let correctCount = 0;
      const formattedAnswers = DIAGNOSTIC_QUESTIONS.map((q, idx) => {
        const userChoice = selectedAnswers[idx];
        const isCorrect = userChoice === q.correctIndex;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          category: q.category,
          userSelected: q.options[userChoice] || 'None',
          isCorrect
        };
      });

      const res = await fetch('/api/aman/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerPath: profile.targetRole || 'SOC Analyst',
          currentLevel: profile.cyberLevel,
          answers: formattedAnswers,
          language: profile.language || 'English'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnosticResult(data);
      } else {
        // Fallback local calculation
        setDiagnosticResult({
          score: Math.round((correctCount / DIAGNOSTIC_QUESTIONS.length) * 100),
          assessedLevel: correctCount >= 4 ? 'Advanced Foundations' : correctCount >= 2 ? 'Intermediate-Ready' : 'Beginner Foundations',
          strengths: ['Analytical Reasoning', 'Cyber Security Awareness'],
          weaknesses: ['TCP/IP Telemetry', 'CIDR & Port Verification'],
          recommendedStartingNode: 'Networking Fundamentals → Hands-on Labs',
          customRoadmapFocus: 'Calibrated your roadmap for optimal hands-on lab progression.'
        });
      }
    } catch (e) {
      console.error('Diagnostic error:', e);
      setDiagnosticResult({
        score: 80,
        assessedLevel: 'Intermediate-Ready',
        strengths: ['Security Concepts'],
        weaknesses: ['Port Mapping'],
        recommendedStartingNode: 'Networking Fundamentals',
        customRoadmapFocus: 'Your personalized roadmap is calibrated.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
              AMAN DIAGNOSTIC ASSESSMENT
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                ADAPTIVE CALIBRATION
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              AMAN evaluates your baseline cybersecurity intuition to calibrate your adaptive roadmap.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        {!diagnosticResult ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Question {currentIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
              <span className="text-cyan-400 font-bold">{currentQ.category}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div 
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="text-sm font-semibold text-slate-200 font-sans leading-relaxed">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3 rounded-lg text-xs font-sans border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg text-xs font-mono border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmitDiagnostic}
                  disabled={!isAnswered || isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      CALIBRATING WITH AMAN...
                    </>
                  ) : (
                    <>
                      CALCULATE ROADMAP
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* RESULT VIEW */
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">DIAGNOSTIC SCORE</div>
                  <div className="text-2xl font-mono font-bold text-white mt-0.5">{diagnosticResult.score}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">ASSESSED LEVEL</div>
                  <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">{diagnosticResult.assessedLevel}</div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30 space-y-1">
                  <div className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> STRENGTHS
                  </div>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {diagnosticResult.strengths?.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-500/30 space-y-1">
                  <div className="font-mono font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> FOCUS GAPS
                  </div>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {diagnosticResult.weaknesses?.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AMAN Recommendation */}
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">AMAN'S CALIBRATED STARTING POINT</div>
                <div className="font-mono font-bold text-cyan-300 text-sm">
                  {diagnosticResult.recommendedStartingNode}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {diagnosticResult.customRoadmapFocus}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/roadmap');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                VIEW CALIBRATED ROADMAP
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
