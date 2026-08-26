import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { 
  Flame, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  RotateCcw, 
  HelpCircle, 
  FileText,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExamQuestion {
  id: string;
  category: 'Linux' | 'Networking' | 'Web Security' | 'SOC & IR' | 'Cryptography';
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'eq-1',
    category: 'Linux',
    prompt: 'You discover a binary with file permissions "-rwsr-xr-x" owned by root. What security implication does this represent?',
    options: [
      'The binary can only be executed in read-only mode by unprivileged users.',
      'The SUID bit is set; when executed by any user, it runs with root privileges.',
      'The sticky bit prevents unauthorized users from deleting or renaming the binary.',
      'The SGID bit is active, giving group members unrestricted write access.'
    ],
    correctIndex: 1,
    explanation: 'The letter "s" in the owner execute position denotes SUID (Set Owner User ID). If misconfigured or vulnerable to injection, it can allow immediate local privilege escalation to root.'
  },
  {
    id: 'eq-2',
    category: 'Networking',
    prompt: 'During an Nmap stealth scan (-sS), what packet sequence does the scanner send upon receiving a SYN-ACK from an open port?',
    options: [
      'ACK to complete the standard 3-way TCP handshake.',
      'RST (Reset) to tear down the connection before full establishment.',
      'FIN-PSH-URG packet to bypass stateful firewalls.',
      'ICMP Echo Reply to measure round-trip latency.'
    ],
    correctIndex: 1,
    explanation: 'In a SYN stealth scan, Nmap immediately sends an RST packet upon receiving a SYN-ACK. This prevents the TCP connection from fully completing, often avoiding application-level connection logging.'
  },
  {
    id: 'eq-3',
    category: 'Web Security',
    prompt: 'A web parameter input of "admin\' OR \'1\'=\'1\' --" bypasses an authentication login form. What is the fundamental root cause and optimal remediation?',
    options: [
      'Weak MD5 password hashing; remediate by upgrading to SHA-256 with salting.',
      'Dynamic SQL query concatenation; remediate by enforcing Parameterized Prepared Statements.',
      'Cross-Site Scripting (XSS); remediate by HTML entity encoding input fields.',
      'Cross-Site Request Forgery (CSRF); remediate by deploying Anti-CSRF tokens in cookies.'
    ],
    correctIndex: 1,
    explanation: 'The vulnerability is SQL Injection due to untrusted user input concatenated directly into the SQL statement. Parameterized queries (Prepared Statements) ensure inputs are treated strictly as data literals.'
  },
  {
    id: 'eq-4',
    category: 'SOC & IR',
    prompt: 'In Wireshark, you observe thousands of TCP SYN packets originating from diverse external IP addresses toward port 443 with no ACK completions. What attack pattern is occurring?',
    options: [
      'Distributed TCP SYN Flood (Denial of Service).',
      'Man-in-the-Middle SSL certificate spoofing.',
      'ARP Cache Poisoning across the local collision domain.',
      'DNS Zone Transfer enumeration.'
    ],
    correctIndex: 0,
    explanation: 'A flood of SYN packets without subsequent ACKs exhausts the target server’s half-open TCP connection backlog queue (SYN Flood DoS).'
  },
  {
    id: 'eq-5',
    category: 'Cryptography',
    prompt: 'Why must cryptographic hashing algorithms (like SHA-256) be collision-resistant in cybersecurity operations?',
    options: [
      'To prevent attackers from finding two distinct inputs that produce the identical hash digest.',
      'To ensure ciphertext can be symmetrically decrypted using a public key.',
      'To allow the algorithm to run faster on unaccelerated CPU architectures.',
      'To enable reversible data compression across encrypted channels.'
    ],
    correctIndex: 0,
    explanation: 'Collision resistance guarantees that an attacker cannot forge an alternate message or certificate with the same hash as a legitimate payload.'
  }
];

export const ExamModePage: React.FC = () => {
  const { addXp, issueCertificate, language } = useApp();
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [earnedCert, setEarnedCert] = useState<any | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  // Countdown timer
  useEffect(() => {
    if (!examStarted || examFinished) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setExamFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examStarted, examFinished]);

  const handleStartExam = () => {
    setExamStarted(true);
    setExamFinished(false);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(600);
    setEarnedCert(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (examFinished) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleFinishExam = () => {
    setExamFinished(true);
    // calculate score
    let correctCount = 0;
    EXAM_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correctCount++;
    });
    const percentage = Math.round((correctCount / EXAM_QUESTIONS.length) * 100);
    if (percentage >= 80) {
      addXp(300, 'Passed Pro Cybersecurity Certification Exam');
      const cert = issueCertificate('Certified Cybersecurity Tactical Operator');
      setEarnedCert(cert);
    }
  };

  // Calculate results
  let correctCount = 0;
  EXAM_QUESTIONS.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctIndex) correctCount++;
  });
  const scorePercent = Math.round((correctCount / EXAM_QUESTIONS.length) * 100);
  const isPassed = scorePercent >= 80;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-950/70 border border-red-500/30 text-red-400 font-mono text-xs font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> PRO CERTIFICATION ASSESSMENT
            </span>
            <span className="text-xs font-mono text-slate-500">• TIMED & HINT-FREE ENVIRONMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Official Exam Assessment
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {t.examModeStrict}: Pass with 80%+ to validate industry readiness and earn verified certification.
          </p>
        </div>

        {examStarted && !examFinished && (
          <div className="bg-red-950/80 px-5 py-2.5 rounded-2xl border border-red-500/40 text-center flex items-center gap-2 text-red-300 font-mono">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="font-extrabold text-base">{formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {!examStarted ? (
        /* Pre-Exam Briefing Card */
        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-mono font-bold text-white">
              Tactical Operator Certification Exam
            </h2>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              This exam evaluates your operational cybersecurity aptitude under strict exam conditions. AI assistants and hints are completely locked.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <div>
              <div className="text-slate-500 text-[10px]">TIME LIMIT</div>
              <div className="text-white font-bold">10 MINUTES</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">QUESTIONS</div>
              <div className="text-white font-bold">{EXAM_QUESTIONS.length} SCENARIOS</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">PASS SCORE</div>
              <div className="text-emerald-400 font-bold">80% MINIMUM</div>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-sm shadow-xl shadow-red-600/30 transition-all cursor-pointer"
          >
            START OFFICIAL EXAM NOW
          </button>
        </div>
      ) : examFinished ? (
        /* Post-Exam Report Card */
        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="text-center space-y-3">
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
              isPassed ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400' : 'bg-red-950 border border-red-500/50 text-red-400'
            }`}>
              {isPassed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>

            <h2 className="text-2xl font-mono font-bold text-white">
              {isPassed ? 'EXAMINATION PASSED — CERTIFIED OPERATOR' : 'EXAMINATION NOT PASSED'}
            </h2>

            <div className="text-3xl font-mono font-extrabold text-white">
              {scorePercent}% SCORE ({correctCount}/{EXAM_QUESTIONS.length} CORRECT)
            </div>

            <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
              {isPassed
                ? 'Congratulations! You have verified theoretical and operational competency across key security domains.'
                : 'Review your weak conceptual domains in My Mistakes & Spaced Repetition, then re-attempt when prepared.'}
            </p>
          </div>

          {/* Question-by-Question Diagnostic Review */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Diagnostic Question Breakdown
            </h3>

            {EXAM_QUESTIONS.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div key={q.id} className={`p-4 rounded-xl border space-y-2 ${
                  isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'
                }`}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">Q{idx + 1}. {q.category}</span>
                    <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-sans">
                    {q.prompt}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-sans text-slate-300">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleStartExam}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RE-ATTEMPT EXAM</span>
            </button>

            {isPassed ? (
              <Link
                to="/certificate"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>VIEW OFFICIAL CERTIFICATE</span>
              </Link>
            ) : (
              <Link
                to="/mistakes"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PRACTICE WEAK CONCEPTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Active Exam Question Session */
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">
                QUESTION {currentQuestionIndex + 1} OF {EXAM_QUESTIONS.length}
              </span>
              <span className="text-xs font-mono text-slate-400">
                • {EXAM_QUESTIONS[currentQuestionIndex].category}
              </span>
            </div>
            <span className="text-xs font-mono text-red-400 font-bold">LOCKED ENVIRONMENT</span>
          </div>

          <p className="text-base font-mono font-bold text-white leading-relaxed">
            {EXAM_QUESTIONS[currentQuestionIndex].prompt}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {EXAM_QUESTIONS[currentQuestionIndex].options.map((option, idx) => {
              const isChosen = userAnswers[currentQuestionIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isChosen
                      ? 'bg-red-950/60 border-red-500 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{option}</span>
                  {isChosen && <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 disabled:opacity-30 text-xs font-mono text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              PREVIOUS
            </button>

            {currentQuestionIndex + 1 < EXAM_QUESTIONS.length ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-all cursor-pointer"
              >
                NEXT QUESTION →
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                SUBMIT EXAM FOR SCORING
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
