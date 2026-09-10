import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Terminal, 
  HelpCircle,
  Clock,
  Radio,
  X
} from 'lucide-react';
import { playTacticalSound } from '../../utils/audio';

interface PracticalCheck {
  id: string;
  scenario: string;
  question: string;
  options: {
    label: string;
    text: string;
    isCorrect: boolean;
  }[];
  pedagogicalNote: string;
}

const PRACTICAL_CHECKS: PracticalCheck[] = [
  {
    id: 'chk-soc-01',
    scenario: 'SCENARIO: An external host connects to your company SSH gateway and generates 90 authentication failures in 45 seconds targeting "root", followed by a successful session under user "m_chen" from the same IP (198.51.100.44).',
    question: 'As a defensive analyst, how do you categorize this incident?',
    options: [
      {
        label: 'A',
        text: 'Automated brute-force / password spraying leading to account compromise.',
        isCorrect: true
      },
      {
        label: 'B',
        text: 'Unintentional packet retransmissions caused by MTU mismatch.',
        isCorrect: false
      },
      {
        label: 'C',
        text: 'Standard DNS round-robin load balancing anomaly.',
        isCorrect: false
      },
      {
        label: 'D',
        text: 'Cross-Site Scripting (XSS) payload injection into syslog.',
        isCorrect: false
      }
    ],
    pedagogicalNote: 'High failure velocity followed by successful login strongly indicates credential guessing or credential stuffing.'
  },
  {
    id: 'chk-net-02',
    scenario: 'SCENARIO: You are tasked with discovering active network services on a subnet without establishing complete TCP 3-way handshakes to keep scanning noise minimal.',
    question: 'Which scanning technique and tool combination satisfies this operational constraint?',
    options: [
      {
        label: 'A',
        text: 'nmap SYN Stealth Scan (nmap -sS -sV <target>)',
        isCorrect: true
      },
      {
        label: 'B',
        text: 'ping flood (ping -f -c 1000 <target>)',
        isCorrect: false
      },
      {
        label: 'C',
        text: 'traceroute UDP probe (traceroute -U -p 53 <target>)',
        isCorrect: false
      },
      {
        label: 'D',
        text: 'curl HTTP HEAD request (curl -I http://target)',
        isCorrect: false
      }
    ],
    pedagogicalNote: 'A SYN stealth scan sends a SYN packet and awaits SYN-ACK, then immediately resets (RST) before handshake completion.'
  },
  {
    id: 'chk-web-03',
    scenario: 'SCENARIO: During a web application assessment, submitting admin\' -- into the username field successfully logs you in as the system administrator without providing a password.',
    question: 'What fundamental vulnerability category does this exploit demonstrate?',
    options: [
      {
        label: 'A',
        text: 'SQL Injection (SQLi) authentication bypass via comment termination.',
        isCorrect: true
      },
      {
        label: 'B',
        text: 'Buffer overflow memory corruption in the libc allocator.',
        isCorrect: false
      },
      {
        label: 'C',
        text: 'Cross-Site Request Forgery (CSRF) token desynchronization.',
        isCorrect: false
      },
      {
        label: 'D',
        text: 'XML External Entity (XXE) entity resolution flaw.',
        isCorrect: false
      }
    ],
    pedagogicalNote: 'The single quote breaks string literal containment, and the double dash comments out the remaining query logic.'
  }
];

interface AmanLevelCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCalibrated?: (level: 'Beginner' | 'Foundation' | 'Intermediate' | 'Advanced') => void;
}

export const AmanLevelCalibrationModal: React.FC<AmanLevelCalibrationModalProps> = ({
  isOpen,
  onClose,
  onCalibrated
}) => {
  const { profile, updateProfile, addXp } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [calculatedLevel, setCalculatedLevel] = useState<'Beginner' | 'Foundation' | 'Intermediate' | 'Advanced'>('Beginner');

  if (!isOpen) return null;

  const currentCheck = PRACTICAL_CHECKS[currentIndex];
  const hasSelectedCurrent = selectedAnswers[currentIndex] !== undefined;

  const handleSelectOption = (optIdx: number) => {
    playTacticalSound('click');
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optIdx
    }));
  };

  const handleNext = () => {
    playTacticalSound('click');
    if (currentIndex < PRACTICAL_CHECKS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate calibration
      let score = 0;
      PRACTICAL_CHECKS.forEach((check, idx) => {
        const chosen = selectedAnswers[idx];
        if (chosen !== undefined && check.options[chosen]?.isCorrect) {
          score += 1;
        }
      });

      let levelResult: 'Beginner' | 'Foundation' | 'Intermediate' | 'Advanced' = 'Beginner';
      if (score === 3) {
        levelResult = 'Advanced';
      } else if (score === 2) {
        levelResult = 'Intermediate';
      } else if (score === 1) {
        levelResult = 'Foundation';
      } else {
        levelResult = 'Beginner';
      }

      setCalculatedLevel(levelResult);
      setIsCompleted(true);
      playTacticalSound('success');

      updateProfile({
        calibratedLevel: levelResult,
        assessmentCompleted: true,
        assessmentScores: {
          calibrationScore: score,
          totalQuestions: PRACTICAL_CHECKS.length
        }
      });
      addXp(150);

      if (onCalibrated) {
        onCalibrated(levelResult);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden text-slate-100">
        
        {/* TOP HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  AMAN COGNITIVE CALIBRATION
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  3-QUESTION PRACTICAL CHECK
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-200">
                Starting Level & Mission Calibration
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* AMAN SOCRATIC ADVISORY BANNER */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" />
            <p className="text-xs text-cyan-200 font-sans leading-relaxed">
              <strong className="text-cyan-300">AMAN:</strong> "Based on your answers, I will calibrate your missions so you don't waste time on concepts you already know. This is not a formal exam — it is a quick check of your practical instincts."
            </p>
          </div>

          {!isCompleted ? (
            <div className="space-y-5 animate-fadeIn">
              
              {/* QUESTION PROGRESS */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>SCENARIO {currentIndex + 1} OF {PRACTICAL_CHECKS.length}</span>
                <div className="flex gap-1.5">
                  {PRACTICAL_CHECKS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-1.5 rounded-full transition-colors ${
                        idx === currentIndex
                          ? 'bg-cyan-400'
                          : selectedAnswers[idx] !== undefined
                          ? 'bg-emerald-500'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* SCENARIO CARD */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-bold block mb-1">REAL-WORLD TELEMETRY:</span>
                {currentCheck.scenario}
              </div>

              {/* QUESTION PROMPT */}
              <h4 className="text-sm font-semibold text-slate-100">
                {currentCheck.question}
              </h4>

              {/* OPTIONS */}
              <div className="space-y-2.5">
                {currentCheck.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {opt.label}
                      </span>
                      <span className="text-xs font-medium leading-relaxed pt-0.5">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Select an answer to continue
                </span>

                <button
                  onClick={handleNext}
                  disabled={!hasSelectedCurrent}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>{currentIndex === PRACTICAL_CHECKS.length - 1 ? 'Calibrate My Level' : 'Next Scenario'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* CALIBRATION COMPLETE SCREEN */
            <div className="space-y-6 text-center py-4 animate-fadeIn">
              
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-bold uppercase tracking-wider">
                  CALIBRATION COMPLETED // +150 XP
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
                  Calibrated Level: <span className="text-cyan-400">{calculatedLevel.toUpperCase()}</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  AMAN has configured your personal roadmap and calibrated your first hands-on challenge: <strong className="text-amber-400">SOC-001: Investigate a Suspicious Login</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Track Focus:</span>
                  <span className="text-slate-200 font-bold">{(profile.selectedRole || 'SOC Analyst').toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Recommended Mission:</span>
                  <span className="text-cyan-400 font-bold">SOC-001 (FLAG CHECKPOINT)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Time to Milestone:</span>
                  <span className="text-emerald-400 font-bold">15 Minutes</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Proceed to Personal Roadmap & Mission
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
