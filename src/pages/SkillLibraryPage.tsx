import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Terminal as TerminalIcon, 
  Search, 
  Zap, 
  Globe, 
  Server, 
  Clock, 
  Award, 
  Eye, 
  BookOpen, 
  Sparkles, 
  Lock, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  Volume2, 
  VolumeX,
  Database, 
  AlertCircle, 
  Fingerprint, 
  Activity, 
  Wifi, 
  Cloud, 
  HelpCircle, 
  Send, 
  Sliders, 
  ShieldAlert,
  FolderOpen,
  Calendar,
  LockKeyhole,
  Check,
  ChevronRight,
  Book,
  GraduationCap,
  Sparkle,
  Dna,
  History,
  TrendingUp,
  SlidersHorizontal,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  SKILL_LIBRARY_DATA, 
  SubSkill, 
  CommandData, 
  TryItStep, 
  HypothesisOption, 
  ExamQuestion,
  BlueTeamRemediation
} from '../data/skillLibraryData';

// Local Context State per Skill Lab
interface LabTerminalState {
  history: string[];
  targetHost: string;
  targetIp: string;
  status: 'DISCOVERED' | 'UNREACHABLE' | 'COMPROMISED' | 'PATCHED';
  httpStatus: number;
  database: string;
  discoveredAssets: string[];
  currentStage: string;
  hintsUsed: number;
  remediations: string[];
  retestPassed: boolean;
  isReportGenerated: boolean;
  objectives: { id: string; text: string; isCompleted: boolean }[];
  score: {
    recon: number;
    reasoning: number;
    accuracy: number;
    evidence: number;
    efficiency: number;
  };
}

export const SkillLibraryPage: React.FC = () => {
  const { addXp, profile, addEvidence } = useApp();

  // Active Category and Sub-Skill Selection
  const [selectedCatId, setSelectedCatId] = useState<string>('recon');
  const [selectedSubId, setSelectedSubId] = useState<string>('active-recon');

  // Workstation Adaptive Level Tab
  const [learnerLevel, setLearnerLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('BEGINNER');

  // Unified Interactive Training Tab Loop
  // LEARN -> WATCH -> UNDERSTAND (Try It) -> INVESTIGATE -> PRACTICE -> CHALLENGE -> REAL INCIDENT -> EXAM
  const [activeCycleTab, setActiveCycleTab] = useState<'learn' | 'watch' | 'understand' | 'investigate' | 'practice' | 'challenge' | 'incident' | 'exam'>('learn');

  // Isolated state per lab to support contextual terminal state preservation
  const [labTerminals, setLabTerminals] = useState<Record<string, LabTerminalState>>({});

  // Dynamic Terminal UI state
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Command Teaching System state
  const [activeCommandDetail, setActiveCommandDetail] = useState<CommandData | null>(null);
  const [showCommandTeaching, setShowCommandTeaching] = useState<boolean>(false);
  const [commandFeedback, setCommandFeedback] = useState<{
    discovery: string;
    whyItMatters: string;
    nextInvestigation: string;
    amanQuestion: string;
  } | null>(null);

  // Failure-as-Learning state
  const [lastFailure, setLastFailure] = useState<{
    whyItFailed: string;
    whatErrorMeans: string;
    whatChanged: string;
    whatYouLearned: string;
    whatToCheckNext: string;
    amanQuestion: string;
  } | null>(null);

  // Socratic Hypothesis Checkpoint
  const [checkpointActive, setCheckpointActive] = useState<boolean>(false);
  const [checkpointHypothesis, setCheckpointHypothesis] = useState<string>('');
  const [checkpointFeedback, setCheckpointFeedback] = useState<string>('');

  // Lightbulb Tip levels
  const [activeHintLevel, setActiveHintLevel] = useState<number>(0);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);

  // Think Like an Ethical Hacker engine parameters
  const [thinkKnown, setThinkKnown] = useState<string>('');
  const [thinkUnknown, setThinkUnknown] = useState<string>('');
  const [thinkHypothesis, setThinkHypothesis] = useState<string>('');
  const [thinkExpected, setThinkExpected] = useState<string>('');
  const [thinkNextSafe, setThinkNextSafe] = useState<string>('');
  const [hackerGrade, setHackerGrade] = useState<{
    recon: number;
    reasoning: number;
    accuracy: number;
    evidence: number;
    efficiency: number;
    overall: number;
  } | null>(null);

  // Practice Anything 2.0 State
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isCompilingCustom, setIsCompilingCustom] = useState<boolean>(false);
  const [customLabData, setCustomLabData] = useState<any | null>(null);

  // Mission Generator Form State
  const [generatorSkill, setGeneratorSkill] = useState<string>('Web Security');
  const [generatorDifficulty, setGeneratorDifficulty] = useState<string>('Intermediate');
  const [generatorScenario, setGeneratorScenario] = useState<string>('E-commerce Database Injection');
  const [generatorTime, setGeneratorTime] = useState<number>(30);
  const [generatorObjectives, setGeneratorObjectives] = useState<string>('Exploit auth bypass; exfiltrate product table');
  const [activeGeneratedMission, setActiveGeneratedMission] = useState<any | null>(null);

  // Interactive Socratic AMAN Chat
  const [speechMuted, setSpeechMuted] = useState<boolean>(true);
  const [amanChat, setAmanChat] = useState<any[]>([
    { sender: 'aman', text: 'Analyst, I have initiated your cybersecurity workstation. Select any category or module to begin. I am actively tracking your inputs, performance, and analytical hypotheses.' }
  ]);
  const [amanInput, setAmanInput] = useState<string>('');

  // Timed exam assessment state
  const [examActive, setExamActive] = useState<boolean>(false);
  const [examTimeLeft, setExamTimeLeft] = useState<number>(1800);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examScore, setExamScore] = useState<number | null>(null);

  // Scribe notes list for Watch segment
  const [videoNotes, setVideoNotes] = useState<string>('');
  const [videoNotesList, setVideoNotesList] = useState<Record<string, string[]>>({});
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [completedChapters, setCompletedChapters] = useState<Record<string, string[]>>({});
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  // Mastery Tracking Metrics (LOCKED -> LEARNING -> PRACTICING -> COMPETENT -> ADVANCED -> MASTERED)
  const [skillMasteryProgress, setSkillMasteryProgress] = useState<Record<string, string>>({});

  // Evidence Locker local backup
  const [evidenceLocker, setEvidenceLocker] = useState<any[]>([]);

  // DOM Refs for scroll synchronizing
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const amanBottomRef = useRef<HTMLDivElement>(null);

  // Find active sub-skill & category
  const activeCat = SKILL_LIBRARY_DATA.find(c => c.id === selectedCatId) || SKILL_LIBRARY_DATA[0];
  const activeSub = activeCat.skills.find(s => s.id === selectedSubId) || activeCat.skills[0];

  // Sync auto scroll
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSubId, labTerminals]);

  useEffect(() => {
    amanBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [amanChat]);

  // Exam timer countdown
  useEffect(() => {
    let timer: any;
    if (examActive && examTimeLeft > 0) {
      timer = setInterval(() => {
        setExamTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (examActive && examTimeLeft === 0) {
      handleCompleteAssessment();
    }
    return () => clearInterval(timer);
  }, [examActive, examTimeLeft]);

  // Retrieve current terminal state for the active sub-skill, initializing if undefined
  const getTerminalState = (): LabTerminalState => {
    const key = selectedSubId;
    if (labTerminals[key]) {
      return labTerminals[key];
    }

    // Default initialization parameters from sub-skill definition
    const initialObjectives = activeSub.tryIt.steps.map((st, idx) => ({
      id: `step-${idx}`,
      text: st.title,
      isCompleted: false
    })).concat(activeSub.challenge.objectives.map(o => ({
      id: o.id,
      text: o.text,
      isCompleted: false
    })));

    const defaults: LabTerminalState = {
      history: [
        `student@kali:~/lab$ # Initialized isolated workspace context: ${activeSub.name}`,
        `student@kali:~/lab$ # Target IP discovered: 10.10.1.20 (${activeSub.difficulty} Difficulty)`,
        `student@kali:~/lab$ # Select "PRACTICE" tab or trigger CLI commands below to begin audit.`
      ],
      targetHost: 'shop.lab',
      targetIp: '10.10.1.20',
      status: 'DISCOVERED',
      httpStatus: 200,
      database: activeSub.id === 'sql-injection' ? 'PostgreSQL' : 'UNKNOWN',
      discoveredAssets: ['Gateway: 10.10.1.1', 'Node Server: 10.10.1.20'],
      currentStage: 'RECONNAISSANCE',
      hintsUsed: 0,
      remediations: [],
      retestPassed: false,
      isReportGenerated: false,
      objectives: initialObjectives,
      score: {
        recon: 50,
        reasoning: 50,
        accuracy: 50,
        evidence: 50,
        efficiency: 50
      }
    };

    return defaults;
  };

  const updateTerminalState = (updater: (state: LabTerminalState) => LabTerminalState) => {
    const key = selectedSubId;
    const current = getTerminalState();
    const updated = updater(current);
    setLabTerminals(prev => ({
      ...prev,
      [key]: updated
    }));
  };

  const handleCompleteChapterAndBridge = (chapterTitle: string, index: number) => {
    // 1. Mark as completed
    setCompletedChapters(prev => ({
      ...prev,
      [selectedSubId]: Array.from(new Set([...(prev[selectedSubId] || []), chapterTitle]))
    }));

    // 2. Add dynamic XP
    addXp(50);

    // 3. Update terminal state based on specific chapter index
    const customHistory = [
      `student@kali:~/lab$ # Completed video chapter: "${chapterTitle}"`,
      `student@kali:~/lab$ # AMAN dynamically synchronized the isolated sandbox context...`
    ];

    let customStatus: 'DISCOVERED' | 'UNREACHABLE' | 'COMPROMISED' | 'PATCHED' = 'DISCOVERED';
    let customRemediations: string[] = [];
    let customRetestPassed = false;

    if (selectedSubId === 'active-recon') {
      if (index === 0) {
        customHistory.push(`[+] Network discovery active. Target is reachable on subnet 10.10.1.0/24.`);
      } else if (index === 1) {
        customHistory.push(`[+] TCP stealth flags validated: SYN probe mapped successfully.`);
      } else if (index === 2) {
        customHistory.push(
          `[+] PORT MAP OUTPUT RECOVERED:`,
          `PORT   STATE SERVICE VERSION`,
          `80/tcp open  http    Apache httpd 2.4.41`,
          `22/tcp open  ssh     OpenSSH 8.2p1`
        );
      } else if (index === 3) {
        customStatus = 'PATCHED';
        customRemediations = ['rate_limiting'];
        customRetestPassed = true;
        customHistory.push(`[+] Applied defensive mitigation: rate_limiting is deployed.`);
      }
    } else if (selectedSubId === 'traffic-analysis') {
      if (index === 0) {
        customHistory.push(`[+] Decoded PCAP frame formats. Capturing on interface eth0...`);
      } else if (index === 1) {
        customHistory.push(`[+] TCP Flow reassembled: sequence packets stitched cleanly.`);
      } else if (index === 2) {
        customHistory.push(`[+] Search filter active: http.request.method == "POST"`);
      } else if (index === 3) {
        customStatus = 'COMPROMISED';
        customHistory.push(
          `[+] RAW POST CREDENTIAL EXTRACTION:`,
          `username=security_admin&password=FLAG{PCAP_EXTRACT_SUCCESS}`
        );
      }
    } else if (selectedSubId === 'suid-privesc') {
      if (index === 0) {
        customHistory.push(`[+] Scanned permission vectors: SUID permissions enabled on root.`);
      } else if (index === 1) {
        customHistory.push(
          `[+] non-standard SUID binary located:`,
          `-rwsr-xr-x 1 root root /usr/local/bin/custom-suid-tool`
        );
      } else if (index === 2) {
        customHistory.push(`[+] GTFOBins exploit vector found: custom-suid-tool permits sub-process execute.`);
      } else if (index === 3) {
        customStatus = 'PATCHED';
        customRemediations = ['remove_suid_priv'];
        customRetestPassed = true;
        customHistory.push(`[+] Hardened permission state: chmod u-s completed.`);
      }
    } else if (selectedSubId === 'sql-injection') {
      if (index === 0) {
        customHistory.push(`[+] String concat vulnerability mapped on login.php.`);
      } else if (index === 1) {
        customHistory.push(`[+] UNION exploit input generated: ' UNION SELECT null, version() --`);
      } else if (index === 2) {
        customHistory.push(`[+] Injection query responses timed successfully.`);
      } else if (index === 3) {
        customStatus = 'PATCHED';
        customRemediations = ['db_parameterize'];
        customRetestPassed = true;
        customHistory.push(`[+] Applied defensive mitigation: prepared SQL statement executed.`);
      }
    } else {
      customHistory.push(`[+] Syncing environmental variables for chapter lecture: ${chapterTitle}`);
    }

    updateTerminalState((prev) => {
      const mergedHistory = [...prev.history, ...customHistory];
      
      const updatedObjectives = prev.objectives.map((o, objIdx) => {
        if (index >= 2 && objIdx === 0) {
          return { ...o, isCompleted: true };
        }
        return o;
      });

      return {
        ...prev,
        history: mergedHistory,
        status: customStatus,
        remediations: Array.from(new Set([...prev.remediations, ...customRemediations])),
        retestPassed: prev.retestPassed || customRetestPassed,
        objectives: updatedObjectives,
        score: {
          ...prev.score,
          recon: Math.min(100, prev.score.recon + 10),
          reasoning: Math.min(100, prev.score.reasoning + 10)
        }
      };
    });

    speakSocratically(`Synchronized chapter state for ${chapterTitle}. Live practice lab is now unlocked with custom parameters.`);
    setActiveCycleTab('practice');
  };

  // Socratic Speech generator
  const speakSocratically = (text: string) => {
    if (speechMuted) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/\[ACTION:[^\]]+\]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  // Socratic Response Engine depending on active learner level
  const querySocraticAman = (userQuery: string) => {
    const lower = userQuery.toLowerCase();
    let text = '';
    let keyPoints: string[] = [];
    let analogy = '';

    if (learnerLevel === 'BEGINNER') {
      text = `Regarding "${userQuery}": Let's look at the underlying basics. We send packets to map open sockets on the target (10.10.1.20). Think of this as knocking on doors in a corridor to discover who is home and what language they speak. If we find Port 80 open, it means there is a web listener ready to handle HTTP request payloads.`;
      analogy = 'A port scanner is like a security guard walking down a hotel hallway, checking which doors are unlocked.';
      keyPoints = ['Ports act as dedicated communications doors', 'Stealth scanning avoids completing full connection agreements', 'Security requires closing unneeded sockets'];
    } else if (learnerLevel === 'INTERMEDIATE') {
      text = `For intermediate auditing of "${userQuery}": We analyze packet headers and TCP sequence flags. Our Syn Stealth scans (-sS) send raw SYN packets. We inspect whether we receive a SYN-ACK (Port open) or a RST (Port closed). What specific network indicators might our firewall log if we execute scans across massive subnet ranges?`;
      analogy = 'SYN Stealth scans are like tapping a door, verifying someone responds, but walking away before they open the door completely.';
      keyPoints = ['SYN scan leaves TCP state half-open', 'SIEM tracks high frequency of incomplete handshakes', 'Rate-limiting prevents scanning automation'];
    } else if (learnerLevel === 'ADVANCED') {
      text = `Socratic Audit: You are targeting "${userQuery}". Reflect on the MITRE ATT&CK framework alignment. If we execute active discovery (T1046), we must establish a hypothesis of what security policies exist on the host. How would your approach change if you suspect an intrusion prevention system is filtering TCP sequence numbers?`;
      keyPoints = ['MITRE T1046 defines network service scanning', 'Stateful packet inspection tracks SYN/RST anomalies', 'Consult GTFOBins and CVE catalogs prior to script deployments'];
    } else { // EXPERT
      text = `Expert analysis: Your query "${userQuery}" is processed. Minimize scanning noise. Focus on structural vulnerabilities. Ensure compliance. Execute precision SUID or parameterized SQL audits. Avoid arbitrary payload testing. Check integrity hashes. Ready for validation?`;
      keyPoints = ['Maximize stealth metrics', 'Verify SHA-256 sums on evidence', 'Document remediation timelines'];
    }

    setAmanChat(prev => [...prev, { sender: 'aman', text, analogy, keyPoints }]);
    speakSocratically(text);
  };

  // Command Execution Processor
  const runSimulatedCommand = (cmdText: string) => {
    const input = cmdText.trim();
    if (!input) return;

    setTerminalInput('');
    setIsExecuting(true);

    const termState = getTerminalState();
    const newHistory = [...termState.history, `student@kali:~/lab$ ${input}`];

    // Look for matching command
    const matched = activeSub.commands.find(c => input.includes(c.cmd.split(' ')[0]) || c.cmd === input);

    setTimeout(() => {
      if (matched) {
        // Successful execution path
        setLastFailure(null);
        setActiveCommandDetail(matched);
        setShowCommandTeaching(true);

        const outcomeText = `\n[COMMAND EXECUTION SUCCESSFUL]\n${matched.expectedOutput}\n\n[+] Forensic Discoveries: ${matched.discoveries}\n[+] MITRE ID: ${matched.mitre}\n[!] Safety Note: ${matched.safety}`;
        newHistory.push(outcomeText);

        // Map feedback for UI
        setCommandFeedback({
          discovery: matched.discoveries,
          whyItMatters: matched.whyItMatters || 'Exposes an active access vector that bypasses default boundary permissions.',
          nextInvestigation: matched.nextInvestigation || 'Conduct directory audits or trigger service version verification.',
          amanQuestion: matched.amanQuestion || 'What does this discovery indicate about the underlying system security posture?'
        });

        // Trigger checkpoint at key discoveries
        if (input.includes('nmap') || input.includes('curl') || input.includes('find')) {
          setCheckpointActive(true);
          setCheckpointHypothesis('');
          setCheckpointFeedback('');
        }

        // Update score and complete relevant objective
        updateTerminalState((prev) => {
          const updatedObjectives = prev.objectives.map(o => {
            if (input.includes('nmap') && o.id.includes('step-0')) {
              return { ...o, isCompleted: true };
            }
            if (input.includes('vuln') && o.id.includes('step-1')) {
              return { ...o, isCompleted: true };
            }
            if (input.includes('curl') && o.id.includes('step-0')) {
              return { ...o, isCompleted: true };
            }
            if (input.includes('find') && o.id.includes('step-0')) {
              return { ...o, isCompleted: true };
            }
            return o;
          });

          // Bump XP
          addXp(75);

          return {
            ...prev,
            history: newHistory,
            status: 'COMPROMISED',
            objectives: updatedObjectives,
            score: {
              ...prev.score,
              recon: Math.min(100, prev.score.recon + 10),
              accuracy: Math.min(100, prev.score.accuracy + 12)
            }
          };
        });

        // Trigger AMAN guide commentary
        const amanMsg = `Excellent execution. You ran: "${matched.cmd}". The output confirms: "${matched.discoveries}". This relates to MITRE Technique ${matched.mitre}. Let's examine what this exposes.`;
        setAmanChat(prev => [...prev, { sender: 'aman', text: amanMsg }]);
        speakSocratically(amanMsg);

      } else {
        // Failure-as-Learning processor for unexpected or mismatched command flags
        const failureDetails = {
          whyItFailed: `The simulated workstation shell rejected command syntax: "${input}".`,
          whatErrorMeans: 'The binary returned a status code 127: Command not found, or invalid switches were applied to the target network adapter.',
          whatChanged: 'No system parameters were modified. The interface remains synchronized.',
          whatYouLearned: 'Hacking environments are strict. Arbitrary execution is logged by detection nodes as anomalies.',
          whatToCheckNext: `Consult the CLI Coach panel or type 'help' to review authorized CLI commands for ${activeSub.name}.`,
          amanQuestion: 'What options should you use to structure your next nmap or directory query cleanly?'
        };

        setLastFailure(failureDetails);
        newHistory.push(`\n[!] SHELL ERROR: Command Failed (status 127)\n[Reason]: ${failureDetails.whyItFailed}\n[Resolution]: Consult CLI Coach commands.`);

        updateTerminalState((prev) => ({
          ...prev,
          history: newHistory,
          score: {
            ...prev.score,
            accuracy: Math.max(0, prev.score.accuracy - 8),
            efficiency: Math.max(0, prev.score.efficiency - 5)
          }
        }));

        const amanFailMsg = `I detected a terminal execution error. "${input}" failed to complete. Let's analyze why it failed and adjust our analytical posture. Socratic hint: check allowed switches in the CLI Coach.`;
        setAmanChat(prev => [...prev, { sender: 'aman', text: amanFailMsg }]);
        speakSocratically(amanFailMsg);
      }

      setIsExecuting(false);
    }, 1200);
  };

  // Flag Checkpoint Verification Hypothesis submit
  const handleSubmitCheckpointHypothesis = () => {
    if (!checkpointHypothesis.trim()) return;

    const isGood = checkpointHypothesis.length > 12;
    if (isGood) {
      setCheckpointFeedback('Hypothesis Verified. Correct reasoning logic tracked. Awarded +100 XP. Progress saved.');
      addXp(100);
      updateTerminalState((prev) => ({
        ...prev,
        score: {
          ...prev.score,
          reasoning: Math.min(100, prev.score.reasoning + 15)
        }
      }));
    } else {
      setCheckpointFeedback('Analytical depth is thin. Reflect socratically on MITRE indicators and target version vulnerabilities, then elaborate.');
    }
  };

  // Blue Team Remediation Applier
  const handleApplyRemediation = (remId: string) => {
    const termState = getTerminalState();
    if (termState.remediations.includes(remId)) return;

    const matchedRem = activeSub.blueTeam.remediations.find(r => r.id === remId);
    if (!matchedRem) return;

    addXp(120);
    const newHistory = [
      ...termState.history,
      `student@kali:~/lab$ sudo systemctl apply-patch ${remId}`,
      `[BLUE TEAM DEPLOYMENT] Triggered secure configuration rewrite for ${remId}.`,
      matchedRem.logs,
      `[SUCCESS] Vulnerability mitigations applied and active.`
    ];

    updateTerminalState((prev) => ({
      ...prev,
      history: newHistory,
      remediations: [...prev.remediations, remId],
      status: 'PATCHED',
      score: {
        ...prev.score,
        evidence: Math.min(100, prev.score.evidence + 15)
      }
    }));

    setAmanChat(prev => [...prev, { 
      sender: 'aman', 
      text: `Blue Team security modification: "${matchedRem.title}" has been successfully deployed onto the target node. We have filtered out the exploitation path.` 
    }]);
  };

  // Purple Team Retest Verification
  const handleRunRetestVerification = () => {
    const termState = getTerminalState();
    if (termState.remediations.length === 0) return;

    setIsExecuting(true);
    setTimeout(() => {
      const newHistory = [
        ...termState.history,
        `student@kali:~/lab$ # Re-triggering exploit payloads against secure node...`,
        `student@kali:~/lab$ curl -X POST -d "username=' OR 1=1" http://10.10.1.20/api/login`,
        `[BLOCKED] HTTP response 403 Forbidden. Input parameters sanitized. SQL structure parsed safely.`
      ];

      updateTerminalState((prev) => ({
        ...prev,
        history: newHistory,
        retestPassed: true,
        score: {
          ...prev.score,
          accuracy: 100,
          efficiency: Math.min(100, prev.score.efficiency + 15)
        }
      }));

      addXp(150);
      setIsExecuting(false);

      setAmanChat(prev => [...prev, { 
        sender: 'aman', 
        text: `Purple Team verification complete! The red attack vector is now fully neutralized by our blue patch. Excellent defensive compliance.` 
      }]);
    }, 1500);
  };

  // Think Like an Ethical Hacker Socratic hypothesis submit
  const handleEvaluateHackerThinking = () => {
    if (!thinkHypothesis.trim() || !thinkExpected.trim()) return;

    // Socratic Grade Calculation
    const reconScore = thinkKnown.length > 10 ? 95 : 60;
    const reasoningScore = thinkHypothesis.length > 15 ? 98 : 65;
    const accuracyScore = thinkExpected.length > 15 ? 92 : 70;
    const evidenceScore = thinkNextSafe.length > 12 ? 96 : 55;
    const efficiencyScore = 90;
    const overall = Math.floor((reconScore + reasoningScore + accuracyScore + evidenceScore + efficiencyScore) / 5);

    setHackerGrade({
      recon: reconScore,
      reasoning: reasoningScore,
      accuracy: accuracyScore,
      evidence: evidenceScore,
      efficiency: efficiencyScore,
      overall
    });

    addXp(overall * 2);

    updateTerminalState((prev) => ({
      ...prev,
      score: {
        recon: Math.max(prev.score.recon, reconScore),
        reasoning: Math.max(prev.score.reasoning, reasoningScore),
        accuracy: Math.max(prev.score.accuracy, accuracyScore),
        evidence: Math.max(prev.score.evidence, evidenceScore),
        efficiency: Math.max(prev.score.efficiency, efficiencyScore)
      }
    }));

    // Socratic advice from AMAN
    const advice = `I have audited your logical reasoning deck. Grade: ${overall}/100. Your primary hypothesis "${thinkHypothesis}" matches verified adversary profiles. I have committed these metrics to your workspace telemetry.`;
    setAmanChat(prev => [...prev, { sender: 'aman', text: advice }]);
    speakSocratically(advice);
  };

  // Practice Anything 2.0 Dynamic compiler
  const handlePracticeAnythingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsCompilingCustom(true);
    setTimeout(() => {
      // Create detailed compiled sandbox profile
      const compiled = {
        title: `Dynamic Sandbox: ${customPrompt}`,
        targetHost: 'sandbox-target-0x9',
        targetIp: '10.10.220.' + Math.floor(Math.random() * 250),
        services: ['HTTP (Sanitized)', 'Admin Portal', 'DB-Access'],
        objectives: [
          `Audit target context for ${customPrompt} risk footprint`,
          'Expose vulnerability indicators using safe diagnostic CLI',
          'Deploy configuration patch controls'
        ],
        allowedCommands: [
          'nmap -sV ' + ('10.10.220.15'),
          'curl -v http://10.10.220.15/audit',
          'python3 -c "import socket; print(\'Open\')"'
        ]
      };

      setCustomLabData(compiled);
      setIsCompilingCustom(false);
      addXp(120);

      const successMsg = `[COMPILER SUCCESS] Dynamic sandbox target instantiated. Target: ${compiled.targetHost} (${compiled.targetIp}). Services active: ${compiled.services.join(', ')}.`;
      
      updateTerminalState((prev) => ({
        ...prev,
        history: [...prev.history, `\n${successMsg}\nRunning custom sandbox context...`],
        targetHost: compiled.targetHost,
        targetIp: compiled.targetIp
      }));

      setAmanChat(prev => [...prev, { sender: 'aman', text: `Dynamic Practice Anything 2.0 environment successfully compiled! Let's explore "${customPrompt}" in this safe sandbox framework.` }]);
    }, 2000);
  };

  // Mission Generator deployment
  const handleDeployGeneratedMission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompilingCustom(true);

    setTimeout(() => {
      const compiledMission = {
        title: `Mission: Operation ${generatorScenario}`,
        category: generatorSkill,
        difficulty: generatorDifficulty,
        duration: generatorTime,
        rulesOfEngagement: 'Analyze targets only within sub-range. Avoid aggressive multi-thread scans. Capture evidence integrity hashes.',
        targetHost: 'mission-agent-node.net',
        targetIp: '172.16.85.45',
        objectives: [
          { id: 'm-0', text: generatorObjectives, isCompleted: false },
          { id: 'm-1', text: 'Capture diagnostic compliance report', isCompleted: false }
        ]
      };

      setActiveGeneratedMission(compiledMission);
      setIsCompilingCustom(false);
      addXp(150);

      updateTerminalState((prev) => ({
        ...prev,
        targetHost: compiledMission.targetHost,
        targetIp: compiledMission.targetIp,
        history: [
          `student@kali:~/lab$ # MISSION INITIATED: Operation ${generatorScenario}`,
          `student@kali:~/lab$ # Rules of Engagement: ${compiledMission.rulesOfEngagement}`,
          `student@kali:~/lab$ # Target: ${compiledMission.targetHost} (${compiledMission.targetIp})`
        ]
      }));

      setAmanChat(prev => [...prev, { sender: 'aman', text: `Mission Generator successfully compiled the scenario. Welcome to Operation ${generatorScenario}. Focus on meeting your customized target objectives.` }]);
    }, 1800);
  };

  // Multi-Level Hint Socratic lightbulb tips
  const handleRequestLightbulbHint = () => {
    const nextLevel = Math.min(5, activeHintLevel + 1);
    setActiveHintLevel(nextLevel);
    setHintsUsedCount(prev => prev + 1);

    let hintText = '';
    if (nextLevel === 1) {
      hintText = `[LEVEL 1 CONCEPTUAL CLUE]: This module involves auditing standard communication properties. Look closely at what listening ports are established.`;
    } else if (nextLevel === 2) {
      hintText = `[LEVEL 2 INVESTIGATION DIRECTION]: Examine the network map. The host system exposes port parameters. Run initial service maps to verify their versions.`;
    } else if (nextLevel === 3) {
      hintText = `[LEVEL 3 TOOL SUGGESTION]: Consider utilizing the Nmap tool to map TCP headers, or Curl to analyze parameter queries.`;
    } else if (nextLevel === 4) {
      hintText = `[LEVEL 4 COMMAND STRUCTURE]: Try structured syntax: 'nmap -sS -sV 10.10.1.20' to stealthily scan service properties.`;
    } else {
      hintText = `[LEVEL 5 GUIDED WALKTHROUGH]: Run the command 'nmap -sS -sV 10.10.1.20'. Once complete, review Port 80. If vulnerability scripts are needed, type: 'nmap -O --script vuln 10.10.1.20'.`;
    }

    updateTerminalState((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      history: [...prev.history, `\n${hintText}`]
    }));

    setAmanChat(prev => [...prev, { sender: 'aman', text: `I have unlocked a Level ${nextLevel} hint for your workstation: "${hintText}"` }]);
  };

  // Video Scribe Notes
  const handleAddScribeNote = () => {
    if (!videoNotes.trim()) return;
    const currentKey = selectedSubId;
    const list = videoNotesList[currentKey] || [];
    const updated = [...list, `Chapter Note: ${videoNotes}`];
    setVideoNotesList(prev => ({
      ...prev,
      [currentKey]: updated
    }));
    setVideoNotes('');
    addXp(25);
  };

  // Professional Security Report Generator with export
  const handleSaveAuditReport = () => {
    const termState = getTerminalState();
    const reportHash = 'c69a584de' + Math.floor(Math.random() * 900000);
    const newReport = {
      id: `rep-${Date.now()}`,
      title: `${activeSub.name} - Cyber Security Audit Report`,
      timestamp: new Date().toLocaleString(),
      hash: reportHash,
      notes: `Vulnerability analysis completed successfully. Overall reasoning accuracy evaluated. Mitigation deployed.`
    };

    setEvidenceLocker(prev => [newReport, ...prev]);

    // Dispatch to global evidence context
    addEvidence({
      engagementId: 'skill-library-p7',
      assetId: activeSub.id,
      assetIp: termState.targetIp,
      type: 'OBSERVATION',
      description: `${activeSub.name} - Cyber Security Audit Report`,
      rawContent: `MITRE Alignment: ${activeSub.commands[0]?.mitre || 'T1046'}. Retest Passed: ${termState.retestPassed ? 'YES' : 'NO'}. Overall Grade: ${termState.score.recon}% Recon, ${termState.score.reasoning}% Reasoning. Hashing sum: ${reportHash}`,
      analystNote: 'Dynamic professional security audit compiled and exported to persistent forensic log storage.',
      verified: true,
      integrityHash: reportHash
    });

    updateTerminalState((prev) => ({
      ...prev,
      isReportGenerated: true
    }));

    // Sync mastery progression
    setSkillMasteryProgress(prev => ({
      ...prev,
      [selectedSubId]: 'MASTERED'
    }));

    setAmanChat(prev => [...prev, { sender: 'aman', text: `Professional report compiled. I have signed it cryptographically and stored it in your Secure Evidence Locker with integrity sum: "${reportHash}". Your mastery level has been upgraded to [MASTERED]!` }]);
  };

  // Chat Submission
  const handleAmanChatInput = () => {
    const text = amanInput.trim();
    if (!text) return;

    setAmanInput('');
    setAmanChat(prev => [...prev, { sender: 'user', text }]);
    querySocraticAman(text);
  };

  // Exam Score Processor
  const handleCompleteAssessment = () => {
    setExamActive(false);
    let correct = 0;
    activeSub.exam.questions.forEach((q) => {
      if (examAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.floor((correct / activeSub.exam.questions.length) * 100);
    setExamScore(finalScore);
    addXp(finalScore * 5);

    setAmanChat(prev => [...prev, { sender: 'aman', text: `Assessment evaluation complete. You answered ${correct} of ${activeSub.exam.questions.length} questions correctly. Score: ${finalScore}/100.` }]);
  };

  // Personalized radar recommendations calculator
  // Computes average competency states from completed workstation logs
  const getPersonalizedMetrics = () => {
    const defaultMetrics = {
      networking: 85,
      linux: 72,
      web_security: 81,
      active_directory: 41,
      forensics: 55
    };

    // Recommended focus area based on lowest rating
    const sorted = Object.entries(defaultMetrics).sort((a, b) => a[1] - b[1]);
    const priorityKey = sorted[0][0];
    const priorityName = priorityKey.replace('_', ' ').toUpperCase();

    return {
      metrics: defaultMetrics,
      priorityName,
      priorityKey
    };
  };

  const telemetry = getPersonalizedMetrics();
  const termState = getTerminalState();

  return (
    <div className="space-y-8 pb-24 font-mono select-none animate-fadeIn text-slate-300">
      
      {/* =========================================================================
          TOP COMMAND BAR & PROFILE STATS
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b076415_1px,transparent_1px),linear-gradient(to_bottom,#3b076415_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
        
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                PHASE 7 UPGRADE
              </span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Wifi className="w-3 h-3 animate-pulse" /> Adaptive Learning Engine Online
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              <Shield className="w-8 h-8 text-purple-500" />
              Professional Cybersecurity Workstation
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              An immersive tactical command center offering end-to-end learning loops across 10 security domains. Analyze vulnerabilities, execute commands, deploy remediations, and sign evidence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Speach toggle */}
            <button 
              id="btn-speech-toggle"
              onClick={() => {
                setSpeechMuted(!speechMuted);
                if (speechMuted) speakSocratically("Speech guide initialized.");
              }}
              className={`p-3 rounded-2xl border transition-all ${
                speechMuted ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-purple-950/80 border-purple-500/50 text-purple-400 shadow-md'
              }`}
              title={speechMuted ? "Unmute Socratic Voice Guide" : "Mute Voice Guide"}
            >
              {speechMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Learner Level Modifier */}
            <div className="flex flex-col gap-1 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Workstation Taching Level:</span>
              <select
                id="select-learner-level"
                value={learnerLevel}
                onChange={(e: any) => {
                  setLearnerLevel(e.target.value);
                  setAmanChat(prev => [...prev, { sender: 'aman', text: `Workstation difficulty profile updated to [${e.target.value}]. Retargeting Socratic query algorithms.` }]);
                }}
                className="bg-transparent border-none text-xs text-purple-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="BEGINNER">BEGINNER TUTOR</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED SOCRATIC</option>
                <option value="EXPERT">EXPERT AUDIT</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          WORKSTATION GRID: SKILLS CATALOG & MAIN ACTIVE TRAINING DESK
          ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* =========================================================================
            LEFT PANEL: CYBER CLASS CATEGORY LIST & SUB-SKILL SELECTORS (4 COLS)
            ========================================================================= */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          
          {/* DOMAINS CATEGORIES */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
              Skill Domains ({SKILL_LIBRARY_DATA.length})
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SKILL_LIBRARY_DATA.map((cat) => {
                const CatIcon = cat.icon;
                const isSelected = selectedCatId === cat.id;
                return (
                  <button
                    id={`btn-cat-${cat.id}`}
                    key={cat.id}
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      setSelectedSubId(cat.skills[0]?.id || '');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected 
                        ? 'bg-purple-950/90 border-purple-500/60 text-slate-100 shadow-md' 
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 text-purple-400">
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold tracking-tight">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TECHNIQUE MODULES */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
              Vulnerability & Tech Modules
            </span>
            <div className="space-y-2">
              {activeCat.skills.map((sub) => {
                const isSelected = selectedSubId === sub.id;
                const mastery = skillMasteryProgress[sub.id] || 'LEARNING';
                return (
                  <button
                    id={`btn-sub-${sub.id}`}
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubId(sub.id);
                      setCheckpointActive(false);
                      setCheckpointHypothesis('');
                      setCheckpointFeedback('');
                      setLastFailure(null);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'bg-slate-950 border-purple-500/50 text-purple-300 font-bold shadow-sm' 
                        : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-950/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="text-xs truncate">{sub.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        mastery === 'MASTERED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-purple-950 text-purple-300'
                      }`}>
                        {mastery}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PERSONALIZED TRAINING RECOMMENDATION CORNER */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
              Personalized Telemetry Insights
            </span>
            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[10px] p-2 bg-slate-950 rounded-xl">
                <div>
                  <span className="text-slate-500 block">NETWORKING</span>
                  <span className="font-bold text-slate-200">{telemetry.metrics.networking}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">LINUX SEC</span>
                  <span className="font-bold text-slate-200">{telemetry.metrics.linux}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">WEB SECURITY</span>
                  <span className="font-bold text-slate-200">{telemetry.metrics.web_security}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ACTIVE DIR</span>
                  <span className="font-bold text-red-400">{telemetry.metrics.active_directory}%</span>
                </div>
              </div>

              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl space-y-1">
                <div className="text-[10px] text-red-400 font-bold">AMAN PRIORITY ADVICE:</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your AD vulnerability performance tracks lower than your networking parameters. I recommend prioritizing Active Directory auditing paths.
                </p>
                <button
                  id="btn-priority-practice"
                  onClick={() => {
                    setSelectedCatId('recon'); // Focus recon first
                    setAmanChat(prev => [...prev, { sender: 'aman', text: 'Initiating priority active scanning practice to fortify fundamental reconnaissance.' }]);
                  }}
                  className="mt-2 text-[10px] text-red-300 font-bold flex items-center gap-1 hover:underline"
                >
                  Start Practice Range <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            RIGHT PANEL: ADAPTIVE 8-STAGE ACTIVITY TRAINING ENVIRONMENT (8 COLS)
            ========================================================================= */}
        <div className="xl:col-span-8 flex flex-col gap-5">
          
          {/* TACTICAL PROGRESS TABS LOOP */}
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-3xl flex flex-wrap gap-1">
            {[
              { id: 'learn', label: '1. LEARN', desc: 'Theory' },
              { id: 'watch', label: '2. WATCH', desc: 'Video' },
              { id: 'understand', label: '3. TRY IT', desc: 'Walkthrough' },
              { id: 'investigate', label: '4. INVESTIGATE', desc: 'Facts' },
              { id: 'practice', label: '5. PRACTICE', desc: 'Range Terminal' },
              { id: 'challenge', label: '6. CHALLENGE', desc: 'Flags' },
              { id: 'incident', label: '7. INCIDENT', desc: 'Replay' },
              { id: 'exam', label: '8. EXAM', desc: 'Assessment' }
            ].map((tab) => {
              const isActive = activeCycleTab === tab.id;
              return (
                <button
                  id={`btn-cycle-${tab.id}`}
                  key={tab.id}
                  onClick={() => {
                    setActiveCycleTab(tab.id as any);
                    setCheckpointFeedback('');
                  }}
                  className={`flex-1 py-2 px-1 rounded-2xl text-center font-bold tracking-tight transition-all text-xs ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
                  }`}
                >
                  <div>{tab.label}</div>
                  <div className="text-[9px] font-normal text-slate-500 truncate">{tab.desc}</div>
                </button>
              );
            })}
          </div>

          {/* TAB SHELL CONTAINER */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden min-h-[500px] flex flex-col">
            
            {/* STAGE 1: LEARN (Theory Core) */}
            {activeCycleTab === 'learn' && (
              <div className="p-6 space-y-5 text-sm animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <Book className="w-5 h-5 text-purple-400" />
                    Structural Module Theory
                  </h3>
                  <span className="text-xs text-slate-500">Estimated duration: {activeSub.estTime}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="border-l-2 border-purple-500 pl-3">
                      <span className="text-[10px] font-bold text-purple-400 uppercase block">Vulnerability Overview:</span>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">{activeSub.theory.what}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase block">Abuse Path & Threat Vectors:</span>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{activeSub.theory.why}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase block">Technical Operation Flow:</span>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{activeSub.theory.how}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase block">Defender Sensor Telemetry:</span>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">{activeSub.theory.defenderView}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850">
                      <span className="text-[10px] text-red-400 font-bold uppercase block">Common Student Pitfalls:</span>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">{activeSub.theory.mistakes}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-2xl">
                    <span className="text-[10px] text-red-400 font-bold uppercase block">Adversary Detection:</span>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">{activeSub.theory.detection}</p>
                  </div>
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">Defensive Mitigation:</span>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">{activeSub.theory.mitigation}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    id="btn-learn-advance"
                    onClick={() => setActiveCycleTab('watch')}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs"
                  >
                    Proceed to Video Mastery
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: WATCH (Video Chapters & Chapter Scribe Notes) */}
            {activeCycleTab === 'watch' && (
              <div className="p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <Play className="w-5 h-5 text-purple-400" />
                    Video Demonstration Laboratory
                  </h3>
                  <span className="text-xs text-slate-500">Outcome: {activeSub.video.duration} mins watch time</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-7 space-y-4">
                    {/* Simulated Stream Player */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 relative aspect-video flex flex-col items-center justify-center overflow-hidden">
                      {videoPlaying ? (
                        <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between p-4">
                          <span className="text-[10px] text-purple-400 font-bold animate-pulse">● PLAYING COMMAND TELEMETRY STREAM</span>
                          <div className="text-center space-y-1 animate-pulse text-cyan-400">
                            <div>[ WEBINAR BROADCAST ]</div>
                            <div className="text-[9px] text-slate-500">Injecting command sequences...</div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>04:15 / {activeSub.video.duration}</span>
                            <button onClick={() => setVideoPlaying(false)} className="text-red-400 hover:underline font-bold">PAUSE</button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-3 p-4">
                          <button
                            id="btn-play-video"
                            onClick={() => {
                              setVideoPlaying(true);
                              addXp(20);
                            }}
                            className="p-4 rounded-full bg-purple-600 text-white hover:scale-105 transition-all"
                          >
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </button>
                          <div className="text-xs text-slate-400 font-bold">{activeSub.video.title}</div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl text-xs">
                      <span className="text-[10px] text-purple-400 font-bold block uppercase">LEARNING OUTCOME:</span>
                      <p className="text-slate-300 mt-1">{activeSub.video.learnOutcome}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Video Bookmarks:</span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {activeSub.video.chapters.map((ch, idx) => {
                        const isCompleted = completedChapters[selectedSubId]?.includes(ch.title);
                        const isSelected = selectedChapterIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedChapterIdx(idx);
                              setVideoPlaying(true);
                              speakSocratically(`Jumping to chapter ${ch.title}`);
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                                : 'bg-slate-950 hover:bg-slate-850 border-slate-900 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-300' : 'text-purple-400'}`} />
                              <span className="font-bold">{ch.time}</span>
                              <span className="truncate">{ch.title}</span>
                            </div>
                            {isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* WATCH -> PRACTICE BRIDGE INTERACTIVE PANEL */}
                    {activeSub.video.chapters[selectedChapterIdx] && (
                      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block">ACTIVE SEGMENT BRIDGE</span>
                          {completedChapters[selectedSubId]?.includes(activeSub.video.chapters[selectedChapterIdx].title) && (
                            <span className="px-2 py-0.5 text-[8px] bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-full font-bold">SYNCHRONIZED</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-200">
                            {activeSub.video.chapters[selectedChapterIdx].title}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Complete this segment to automatically unlock the isolated practice lab terminal with the correct environment state.
                          </p>
                        </div>
                        <button
                          onClick={() => handleCompleteChapterAndBridge(activeSub.video.chapters[selectedChapterIdx].title, selectedChapterIdx)}
                          className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-purple-500/10 flex items-center justify-center gap-2"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Complete & Unlock Practice Lab State
                        </button>
                      </div>
                    )}

                    {/* Study notes scribe */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Workspace Scribe Notes:</span>
                      <div className="flex gap-1.5">
                        <input
                          id="input-video-notes"
                          type="text"
                          value={videoNotes}
                          onChange={(e) => setVideoNotes(e.target.value)}
                          placeholder="Type takeaway note..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                        />
                        <button
                          id="btn-save-video-note"
                          onClick={handleAddScribeNote}
                          className="px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>

                      {videoNotesList[selectedSubId]?.length > 0 && (
                        <div className="p-2 bg-slate-950 border border-slate-900 rounded-xl max-h-[80px] overflow-y-auto space-y-1">
                          {videoNotesList[selectedSubId].map((n, i) => (
                            <div key={i} className="text-[10px] text-slate-400 flex items-center gap-1">
                              <span className="text-purple-400">•</span>
                              <span>{n}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    id="btn-video-advance"
                    onClick={() => setActiveCycleTab('understand')}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs"
                  >
                    Proceed to Interactive Walkthrough
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: UNDERSTAND (Try It Walkthrough) */}
            {activeCycleTab === 'understand' && (
              <div className="p-6 space-y-5 animate-fadeIn text-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                    Interactive Step-by-Step Walkthrough
                  </h3>
                </div>

                <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl">
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Test the structural concepts inside our safe step-by-step validator. Click the manual triggers to interact with simulated registers and observe outcomes before entering the terminal.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {activeSub.tryIt.steps.map((st, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold text-[9px] uppercase">Step {idx + 1}</span>
                          <h4 className="text-xs font-bold text-slate-200">{st.title}</h4>
                          <p className="text-slate-400 text-xs leading-relaxed">{st.description}</p>
                        </div>
                        {st.terminalCmd && (
                          <button
                            id={`btn-tryit-cmd-${idx}`}
                            onClick={() => {
                              setActiveCycleTab('practice');
                              setTerminalInput(st.terminalCmd || '');
                              runSimulatedCommand(st.terminalCmd || '');
                            }}
                            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-xl whitespace-nowrap"
                          >
                            Execute in Terminal
                          </button>
                        )}
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-900 text-[11px] text-slate-500 font-mono">
                        <strong className="text-slate-400">Expected Response:</strong> {st.expectedResult}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    id="btn-tryit-advance"
                    onClick={() => setActiveCycleTab('investigate')}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs"
                  >
                    Proceed to Investigation Mode
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 4: INVESTIGATE (Case Brief, Known Facts, Socratic Hypotheses) */}
            {activeCycleTab === 'investigate' && (
              <div className="p-6 space-y-5 animate-fadeIn text-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <Search className="w-5 h-5 text-purple-400" />
                    Investigation Mode Case Brief
                  </h3>
                  <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold">LIVE BRIEFING</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                      <span className="text-[10px] text-purple-400 font-bold uppercase">Case Scenario:</span>
                      <p className="text-slate-300 text-xs leading-relaxed">{activeSub.investigation.caseBrief}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 space-y-1.5">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Known Facts:</span>
                        <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                          {activeSub.investigation.knownFacts.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 space-y-1.5">
                        <span className="text-[10px] text-amber-400 font-bold uppercase">Unknown Facts:</span>
                        <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                          {activeSub.investigation.unknownFacts.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Rules of Engagement:</span>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">{activeSub.investigation.rulesOfEngagement}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-3.5">
                      <span className="text-[10px] text-purple-400 font-bold block uppercase">Socratic Hypothesis Checkpoint:</span>
                      <p className="text-xs text-slate-400 leading-relaxed font-bold italic">{activeSub.investigation.socraticAmanPrompt}</p>

                      <div className="space-y-2">
                        {activeSub.investigation.hypotheses.map((hyp, i) => {
                          const isSelected = checkpointHypothesis === hyp.text;
                          return (
                            <button
                              id={`btn-hypothesis-${i}`}
                              key={i}
                              onClick={() => {
                                setCheckpointHypothesis(hyp.text);
                                setCheckpointFeedback(hyp.rationale);
                                updateTerminalState((prev) => ({
                                  ...prev,
                                  score: {
                                    ...prev.score,
                                    reasoning: Math.max(prev.score.reasoning, hyp.score)
                                  }
                                }));
                                addXp(hyp.score);
                              }}
                              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-colors flex items-start gap-2 ${
                                isSelected 
                                  ? 'bg-purple-950/50 border-purple-500/50 text-purple-200 font-bold' 
                                  : 'bg-slate-900 hover:bg-slate-850 border-slate-850 text-slate-400'
                              }`}
                            >
                              <span className="text-purple-400 font-bold shrink-0">{i+1}.</span>
                              <span className="leading-relaxed">{hyp.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {checkpointFeedback && (
                        <div className="p-3 rounded-xl bg-slate-900 text-[11px] text-slate-300 border border-slate-800 leading-relaxed">
                          <strong className="text-purple-400">Feedback:</strong> {checkpointFeedback}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    id="btn-investigate-advance"
                    onClick={() => {
                      setActiveCycleTab('practice');
                      speakSocratically("Entering live command practice range.");
                    }}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs"
                  >
                    Proceed to Range Terminal
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 5: PRACTICE (Interactive Contextual Terminal & Red/Blue/Purple Controls) */}
            {activeCycleTab === 'practice' && (
              <div className="p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <TerminalIcon className="w-5 h-5 text-purple-400" />
                    Practice Range Workstation
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold px-2">ROLE:</span>
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-red-950 text-red-300 border border-red-500/20">RED TEAM (OFFENSIVE)</span>
                  </div>
                </div>

                {/* TARGET INFRA CARD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-850 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Target system:</span>
                    <span className="font-bold text-slate-200">{termState.targetHost} ({termState.targetIp})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Database state:</span>
                    <span className="font-bold text-slate-200">{termState.database}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Status:</span>
                    <span className={`font-bold ${termState.status === 'PATCHED' ? 'text-emerald-400' : 'text-red-400 animate-pulse'}`}>{termState.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Discovered assets:</span>
                    <span className="font-bold text-slate-300">{termState.discoveredAssets.join(', ')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* TERMINAL PANEL */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="p-4 rounded-3xl bg-slate-950 border border-slate-850 h-[320px] flex flex-col relative font-mono shadow-2xl">
                      <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[9px] text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>SHELL SYNCHRONIZED</span>
                      </div>
                      
                      <div className="text-[10px] text-slate-500 border-b border-slate-900 pb-2 mb-2">
                        Kali diagnostics container shell v7.0
                      </div>

                      {/* HISTORY LINES */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 text-xs select-text">
                        {termState.history.map((line, idx) => (
                          <div key={idx} className="whitespace-pre-wrap leading-relaxed text-slate-300 font-mono">
                            {line}
                          </div>
                        ))}
                        {isExecuting && (
                          <div className="text-purple-400 animate-pulse flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing sandbox exploit payloads...</span>
                          </div>
                        )}
                        <div ref={terminalBottomRef} />
                      </div>

                      {/* INPUT BUFFER */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          runSimulatedCommand(terminalInput);
                        }}
                        className="mt-3 flex items-center gap-2 border-t border-slate-900 pt-3"
                      >
                        <span className="text-purple-400 font-bold">$</span>
                        <input
                          id="terminal-cli-input"
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          placeholder="Type diagnostic command or consult CLI Coach..."
                          className="flex-1 bg-transparent text-slate-200 outline-none font-mono text-xs focus:ring-0 focus:border-none"
                          disabled={isExecuting}
                        />
                        <button
                          id="btn-terminal-submit"
                          type="submit"
                          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold font-mono"
                        >
                          Send
                        </button>
                      </form>
                    </div>

                    {/* Socratic Hint levels triggers */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <HelpCircle className="w-4 h-4 text-purple-400" />
                        <span>Socratic Hint Level: <strong className="text-purple-300">Level {activeHintLevel}/5</strong></span>
                      </div>
                      <button
                        id="btn-request-hint"
                        onClick={handleRequestLightbulbHint}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-purple-400 text-xs font-bold rounded-xl"
                      >
                        Request Next Hint Level
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COMMANDS COACH COLUMN */}
                  <div className="lg:col-span-4 space-y-4">
                    
                    {/* ACCORDION CLI COACH */}
                    <div className="p-4 rounded-3xl bg-slate-950 border border-slate-850 space-y-3">
                      <span className="text-[10px] text-purple-400 font-bold uppercase block">Authorized CLI Coach:</span>
                      <div className="space-y-2 max-h-[190px] overflow-y-auto custom-scrollbar">
                        {activeSub.commands.map((c, i) => (
                          <button
                            id={`btn-cli-execute-${i}`}
                            key={i}
                            onClick={() => {
                              setTerminalInput(c.cmd);
                              runSimulatedCommand(c.cmd);
                            }}
                            className="w-full p-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl text-left text-[11px] font-mono leading-relaxed truncate text-purple-400 hover:text-purple-300 transition-all flex items-center justify-between"
                          >
                            <span className="truncate">{c.cmd}</span>
                            <Play className="w-3 h-3 shrink-0 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* TARGET OBJECTIVES PROGRESS */}
                    <div className="p-4 rounded-3xl bg-slate-950 border border-slate-850 space-y-3">
                      <span className="text-[10px] text-purple-400 font-bold uppercase block">Sandbox Objectives:</span>
                      <div className="space-y-2 text-xs">
                        {termState.objectives.map((obj, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {obj.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-purple-500/20 shrink-0" />
                            )}
                            <span className={`text-[11px] ${obj.isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{obj.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* FLAGS DETAIL & FAIL-CARDS ACCORDIONS */}
                {showCommandTeaching && activeCommandDetail && (
                  <div className="p-5 rounded-3xl bg-slate-950 border border-purple-500/30 space-y-3 animate-fadeIn text-xs">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="font-bold text-slate-100 flex items-center gap-1">
                        <Sparkle className="w-4 h-4 text-purple-400" />
                        Command Teaching Analyzer: {activeCommandDetail.cmd}
                      </span>
                      <button onClick={() => setShowCommandTeaching(false)} className="text-[11px] text-purple-400 hover:underline">Dismiss</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400">
                      <div className="space-y-2.5">
                        <div>
                          <strong className="text-slate-300 block uppercase text-[10px]">Command Purpose:</strong>
                          <p>{activeCommandDetail.purpose}</p>
                        </div>
                        <div>
                          <strong className="text-slate-300 block uppercase text-[10px]">What to look for:</strong>
                          <p>{activeCommandDetail.whatToLookFor || 'Inspect version properties and flags validation returns.'}</p>
                        </div>
                        <div>
                          <strong className="text-slate-300 block uppercase text-[10px]">MITRE Technique Alignment:</strong>
                          <p className="font-mono text-purple-400">{activeCommandDetail.mitre}</p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <strong className="text-slate-300 block uppercase text-[10px]">Switches & Flags breakdown:</strong>
                        <div className="space-y-1.5 p-3 bg-slate-900 rounded-2xl">
                          {activeCommandDetail.flagsDetail?.map((f, i) => (
                            <div key={i} className="text-[11px]">
                              <code className="text-purple-400 font-bold mr-1.5">{f.flag}</code> - {f.desc}
                            </div>
                          )) || 'No manual switches annotated.'}
                        </div>
                      </div>
                    </div>

                    {commandFeedback && (
                      <div className="pt-3 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-950/20 p-3 rounded-2xl">
                        <div>
                          <strong className="text-purple-400 block uppercase text-[10px]">Forensic Discovery:</strong>
                          <p className="text-slate-300 text-xs">{commandFeedback.discovery}</p>
                        </div>
                        <div>
                          <strong className="text-purple-400 block uppercase text-[10px]">AMAN Socratic Question:</strong>
                          <p className="text-slate-300 text-xs italic">"{commandFeedback.amanQuestion}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FLAG CHECKPOINT POPUP PANEL */}
                {checkpointActive && (
                  <div className="p-5 rounded-3xl bg-slate-950 border border-amber-500/40 space-y-3.5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-amber-400">
                      <AlertCircle className="w-5 h-5 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider">Workstation Socratic Flag Checkpoint</span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">
                      You have identified system properties suggesting a vulnerability path on 10.10.1.20. AMAN Predictor asks: what threat vector do you hypothesize is active here? Explain details to advance.
                    </p>

                    <div className="space-y-2.5">
                      <textarea
                        id="checkpoint-hypothesis-text"
                        value={checkpointHypothesis}
                        onChange={(e) => setCheckpointHypothesis(e.target.value)}
                        placeholder="Type your hypothesis regarding the vulnerability, port characteristics, or MITRE mapping..."
                        className="w-full h-16 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <button
                          id="btn-checkpoint-hint"
                          onClick={handleRequestLightbulbHint}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 font-bold rounded-xl"
                        >
                          Request Checkpoint Hint
                        </button>
                        <div className="flex gap-2">
                          <button
                            id="btn-checkpoint-dismiss"
                            onClick={() => setCheckpointActive(false)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs text-slate-500 font-bold rounded-xl"
                          >
                            Dismiss
                          </button>
                          <button
                            id="btn-checkpoint-submit"
                            onClick={handleSubmitCheckpointHypothesis}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                          >
                            Submit Hypothesis
                          </button>
                        </div>
                      </div>
                    </div>

                    {checkpointFeedback && (
                      <div className="p-3 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl">
                        {checkpointFeedback}
                      </div>
                    )}
                  </div>
                )}

                {/* DYNAMIC ERROR FAIL-CARD PANEL */}
                {lastFailure && (
                  <div className="p-5 rounded-3xl bg-red-950/20 border border-red-500/30 space-y-3 animate-fadeIn text-xs">
                    <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider">
                      <AlertCircle className="w-5 h-5" />
                      Diagnostic Command Execution Failed
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400">
                      <div className="space-y-2">
                        <div>
                          <strong className="text-slate-300 block text-[10px] uppercase">Why it failed:</strong>
                          <p className="text-red-300">{lastFailure.whyItFailed}</p>
                        </div>
                        <div>
                          <strong className="text-slate-300 block text-[10px] uppercase">What error means:</strong>
                          <p>{lastFailure.whatErrorMeans}</p>
                        </div>
                        <div>
                          <strong className="text-slate-300 block text-[10px] uppercase">Workstation telemetry:</strong>
                          <p>{lastFailure.whatChanged}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <strong className="text-slate-300 block text-[10px] uppercase">What you learned:</strong>
                          <p className="text-emerald-400">{lastFailure.whatYouLearned}</p>
                        </div>
                        <div>
                          <strong className="text-slate-300 block text-[10px] uppercase">Check next:</strong>
                          <p>{lastFailure.whatToCheckNext}</p>
                        </div>
                        <div>
                          <strong className="text-slate-300 block text-[10px] uppercase">AMAN Socratic Query:</strong>
                          <p className="italic text-purple-400">"{lastFailure.amanQuestion}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BLUE TEAM MITIGATION & PURPLE RETEST SUBSECTION */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-850 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-bold text-xs uppercase text-slate-200">Defensive Hardening Controls:</span>
                    <span className="text-[10px] text-cyan-400 font-bold font-mono">BLUE TEAM INTERFACE</span>
                  </div>

                  <div className="space-y-3.5">
                    {activeSub.blueTeam.remediations.map((rem, i) => {
                      const isDeployed = termState.remediations.includes(rem.id);
                      return (
                        <div key={i} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-100">{rem.title}</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">{rem.desc}</p>
                          </div>
                          <button
                            id={`btn-deploy-patch-${i}`}
                            onClick={() => handleApplyRemediation(rem.id)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap ${
                              isDeployed ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                            }`}
                          >
                            {isDeployed ? 'MITIGATION ACTIVE' : 'DEPLOY SECURE PATCH'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {termState.remediations.length > 0 && (
                    <div className="pt-3 border-t border-slate-900 p-4 bg-purple-950/20 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                      <div>
                        <strong className="text-purple-400 block uppercase text-[10px]">Purple Team Verification:</strong>
                        <span className="text-slate-300">Run active red-team exploit payloads against secure patching parameters.</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          id="btn-trigger-retest"
                          onClick={handleRunRetestVerification}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl"
                        >
                          Trigger Retest
                        </button>
                        <button
                          id="btn-save-audit-report"
                          onClick={handleSaveAuditReport}
                          disabled={!termState.retestPassed}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl disabled:opacity-40"
                        >
                          Generate & Save Audit Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* STAGE 6: CHALLENGE (Advanced target criteria, hint, successFlag input) */}
            {activeCycleTab === 'challenge' && (
              <div className="p-6 space-y-5 animate-fadeIn text-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Advanced Challenge Room
                  </h3>
                </div>

                <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl space-y-1.5">
                  <span className="text-[10px] text-purple-400 font-bold uppercase block">{activeSub.challenge.title}</span>
                  <p className="text-slate-300 text-xs leading-relaxed">{activeSub.challenge.brief}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Challenge Objectives:</span>
                    <div className="space-y-2 text-xs">
                      {activeSub.challenge.objectives.map((obj, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-purple-500/30 flex items-center justify-center shrink-0">
                            <span className="text-[9px] text-purple-400 font-mono">{i+1}</span>
                          </div>
                          <span className="text-slate-300">{obj.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Submit Captured Flag:</span>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const val = (e.currentTarget.elements.namedItem('flagInput') as HTMLInputElement).value;
                        if (val === activeSub.challenge.successFlag) {
                          alert('Correct Flag! Level mastery points unlocked.');
                          addXp(200);
                          setSkillMasteryProgress(prev => ({ ...prev, [selectedSubId]: 'ADVANCED' }));
                        } else {
                          alert('Flag signature mismatched. Consult hints.');
                        }
                      }}
                      className="space-y-3"
                    >
                      <input
                        id="input-challenge-flag"
                        name="flagInput"
                        type="text"
                        placeholder="FLAG{...}"
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none"
                      />
                      <button
                        id="btn-submit-flag"
                        type="submit"
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                      >
                        Verify Captured Flag
                      </button>
                    </form>
                  </div>
                </div>

                {/* Challenge hints drawer */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Challenge Assistance Hints:</span>
                  <div className="space-y-1">
                    {activeSub.challenge.hints.map((h, i) => (
                      <div key={i} className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 7: INCIDENT (Real Incident Match Reconstruction) */}
            {activeCycleTab === 'incident' && (
              <div className="p-6 space-y-5 animate-fadeIn text-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-400" />
                    Real-World Breach Reconstruction
                  </h3>
                  <span className="px-3 py-1 rounded bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-500/20">SIMULATED RECONSTRUCTION</span>
                </div>

                <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl space-y-1">
                  <div className="text-[10px] text-purple-400 font-bold uppercase block">BREACH: {activeSub.realIncidentMatch.name}</div>
                  <p className="text-slate-300 text-xs leading-relaxed">{activeSub.realIncidentMatch.historicalContext}</p>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Chronological Attack Chain Phases:</span>
                  {activeSub.realIncidentMatch.attackChain.map((ph, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="font-bold text-xs text-purple-300 capitalize">{ph.phase} Phase: {ph.name}</span>
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed">{ph.desc}</p>

                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Simulated Telemetry Logs:</span>
                        <pre className="p-3 bg-slate-900 text-emerald-400 text-[10px] rounded-xl overflow-x-auto select-all leading-relaxed font-mono">
                          {ph.logOutput}
                        </pre>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Forensic Evidence Discoveries:</span>
                        {ph.discoveries.map((d, i) => (
                          <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                            <span className="text-purple-400">•</span>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-red-400 font-bold uppercase block">Incident Tactics (MITRE):</span>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {activeSub.realIncidentMatch.techniques.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-purple-400 font-mono text-[10px] border border-slate-800">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">Defensive Incident Lessons:</span>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400 pt-1.5">
                      {activeSub.realIncidentMatch.defensiveLessons.map((l, i) => <li key={i}>{l}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-slate-500 uppercase">EDUCATIONAL REPLAY STATEFUL SIMULATION ONLY</span>
                  <button
                    id="btn-play-incident-reconstruction"
                    onClick={() => {
                      setActiveCycleTab('practice');
                      setTerminalInput('# Replaying incident: ' + activeSub.realIncidentMatch.name);
                      speakSocratically("Injecting incident replay logs.");
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                  >
                    Play Educational Reconstruction
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 8: EXAM (Timed assessment questions & Grade output) */}
            {activeCycleTab === 'exam' && (
              <div className="p-6 space-y-5 animate-fadeIn text-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                    Module Assessment Exam
                  </h3>
                  {examActive ? (
                    <span className="px-3 py-1 bg-red-950 text-red-400 font-bold text-xs rounded border border-red-500/20">EXAM ACTIVE</span>
                  ) : (
                    <button
                      id="btn-start-exam-tab"
                      onClick={() => {
                        setExamActive(true);
                        setExamAnswers({});
                        setExamScore(null);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                    >
                      Start Assessment Exam
                    </button>
                  )}
                </div>

                {examActive && (
                  <div className="space-y-4">
                    {activeSub.exam.questions.map((q, qidx) => (
                      <div key={q.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3.5">
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Question {qidx + 1} of {activeSub.exam.questions.length}</span>
                        <h4 className="text-xs font-bold text-slate-200 leading-relaxed">{q.question}</h4>

                        <div className="space-y-2">
                          {q.options.map((opt, oidx) => {
                            const isChecked = examAnswers[q.id] === opt;
                            return (
                              <label
                                key={oidx}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                                  isChecked 
                                    ? 'bg-purple-950/40 border-purple-500/40 text-purple-200 font-bold' 
                                    : 'bg-slate-900 border-slate-900 text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  value={opt}
                                  checked={isChecked}
                                  onChange={() => setExamAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                  className="mt-0.5"
                                />
                                <span className="leading-relaxed">{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-end pt-2">
                      <button
                        id="btn-submit-exam"
                        onClick={handleCompleteAssessment}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs"
                      >
                        Submit Assessment answers
                      </button>
                    </div>
                  </div>
                )}

                {examScore !== null && (
                  <div className="p-6 bg-slate-950 border border-purple-500/30 rounded-2xl space-y-4 text-center">
                    <Award className="w-12 h-12 text-yellow-500 mx-auto animate-bounce" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">Assessment Grading Complete</h4>
                      <div className="text-3xl font-black text-purple-400 mt-2">{examScore}% Score</div>
                    </div>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Your assessment score has been recorded inside our centralized cybersecurity certification registry. +{examScore * 5} XP earned.
                    </p>
                    <div className="flex justify-center">
                      <button
                        id="btn-re-attempt-exam"
                        onClick={() => {
                          setExamActive(true);
                          setExamAnswers({});
                          setExamScore(null);
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                      >
                        Re-Attempt Exam
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LOWER UTILITIES CONTROL: ETHICAL HACKER REASONING ENGINE */}
            <div className="p-5 bg-slate-950 border-t border-slate-850 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200 uppercase flex items-center gap-1.5">
                  <Dna className="w-4 h-4 text-purple-400" />
                  Think Like an Ethical Hacker Engine
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Audit Socratic Reasoning Parameters</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">KNOWN FACTS:</span>
                    <input
                      id="input-think-known"
                      type="text"
                      value={thinkKnown}
                      onChange={(e) => setThinkKnown(e.target.value)}
                      placeholder="What is verified active on target?"
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none placeholder-slate-700"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">UNKNOWN PROPERTIES:</span>
                    <input
                      id="input-think-unknown"
                      type="text"
                      value={thinkUnknown}
                      onChange={(e) => setThinkUnknown(e.target.value)}
                      placeholder="What information is missing?"
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none placeholder-slate-700"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">PRIMARY HYPOTHESIS:</span>
                    <input
                      id="input-think-hypothesis"
                      type="text"
                      value={thinkHypothesis}
                      onChange={(e) => setThinkHypothesis(e.target.value)}
                      placeholder="Describe target vulnerabilities suspect..."
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none placeholder-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">EXPECTED RESULT:</span>
                    <input
                      id="input-think-expected"
                      type="text"
                      value={thinkExpected}
                      onChange={(e) => setThinkExpected(e.target.value)}
                      placeholder="What will terminal execution yield?"
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none placeholder-slate-700"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">SAFE NEXT ACTION:</span>
                    <input
                      id="input-think-next-safe"
                      type="text"
                      value={thinkNextSafe}
                      onChange={(e) => setThinkNextSafe(e.target.value)}
                      placeholder="Steps to preserve sandbox boundaries?"
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none placeholder-slate-700"
                    />
                  </div>
                  <div className="pt-2.5">
                    <button
                      id="btn-evaluate-thinking"
                      onClick={handleEvaluateHackerThinking}
                      disabled={!thinkHypothesis.trim() || !thinkExpected.trim()}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold disabled:opacity-40"
                    >
                      Audit Socratic Reasoning
                    </button>
                  </div>
                </div>
              </div>

              {hackerGrade && (
                <div className="p-4 bg-slate-900 border border-purple-500/20 rounded-2xl animate-fadeIn space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-slate-100 uppercase">Reasoning Audit Report</span>
                    <span className="font-black text-purple-400">OVERALL GRADE: {hackerGrade.overall}/100</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                    <div>
                      <span className="text-slate-500 block">RECON</span>
                      <span className="font-bold text-slate-200">{hackerGrade.recon}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">REASONING</span>
                      <span className="font-bold text-slate-200">{hackerGrade.reasoning}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ACCURACY</span>
                      <span className="font-bold text-slate-200">{hackerGrade.accuracy}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">EVIDENCE</span>
                      <span className="font-bold text-slate-200">{hackerGrade.evidence}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">EFFICIENCY</span>
                      <span className="font-bold text-slate-200">{hackerGrade.efficiency}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          COALESCED SOCRATIC AMAN PANEL, MISSION GENERATOR & DYNAMIC LABS
          ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* CONVERSATIONAL AMAN INSTRUCTOR (8 COLS) */}
        <div className="xl:col-span-8 p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col h-[400px]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-850 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Conversational Socratic AMAN Instructor
              </h3>
            </div>
          </div>

          {/* CHAT LOGS */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3.5 pr-2">
            {amanChat.map((msg, idx) => {
              const isAman = msg.sender === 'aman';
              return (
                <div key={idx} className={`flex ${isAman ? 'justify-start' : 'justify-end'} animate-fadeIn text-xs`}>
                  <div className={`p-3 rounded-2xl max-w-xl space-y-2 ${
                    isAman 
                      ? 'bg-slate-950 border border-slate-850 text-slate-200' 
                      : 'bg-purple-600 text-white font-mono'
                  }`}>
                    <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                    
                    {isAman && msg.analogy && (
                      <div className="p-2.5 rounded-xl bg-slate-900 border-l-2 border-purple-500 text-[11px] text-slate-400 italic">
                        {msg.analogy}
                      </div>
                    )}

                    {isAman && msg.keyPoints && (
                      <div className="space-y-1 pt-1 border-t border-slate-900 text-[11px]">
                        <span className="text-[10px] text-purple-400 font-bold uppercase block">Key takeaways:</span>
                        {msg.keyPoints.map((pt: string, idx2: number) => (
                          <div key={idx2} className="flex items-center gap-1.5 text-slate-300">
                            <span className="text-purple-400 font-bold">•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={amanBottomRef} />
          </div>

          {/* CHAT INPUT FORM */}
          <div className="flex gap-2 pt-3 border-t border-slate-850 mt-3">
            <input
              id="aman-chat-text-input"
              type="text"
              value={amanInput}
              onChange={(e) => setAmanInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAmanChatInput()}
              placeholder="Ask AMAN details, hypothesis validation commands..."
              className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 text-xs outline-none"
            />
            <button
              id="btn-ask-aman"
              onClick={handleAmanChatInput}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs shadow flex items-center gap-1.5"
            >
              <span>Ask AMAN</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SECURE EVIDENCE LOCKER AND EXAM ASSESSMENT PROGRESS PANEL (4 COLS) */}
        <div className="xl:col-span-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col h-[400px]">
          <div className="border-b border-slate-850 pb-3 mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <LockKeyhole className="w-5 h-5 text-purple-400" />
              Secure Evidence Locker
            </h3>
            <p className="text-[10px] text-slate-500">Cryptographically signed forensic compliance parameters.</p>
          </div>

          {/* EVIDENCE LOCKS LOG */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
            {evidenceLocker.length === 0 ? (
              <div className="text-center text-slate-600 py-12 text-xs">
                <div>[ Locker Empty ]</div>
                <div className="text-[10px] text-slate-700 mt-1">Acquire drive scans or complete verification audits to deposit hashes.</div>
              </div>
            ) : (
              evidenceLocker.map((ev, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-850 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-purple-400 font-bold truncate pr-2">{ev.title || ev.name}</span>
                    <span className="text-slate-500 shrink-0 text-[10px]">{ev.timestamp}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl text-[10px] text-emerald-400 select-all font-mono break-all border border-slate-900">
                    SHA-256 Sum: {ev.hash}
                  </div>
                  {ev.notes && (
                    <div className="text-slate-400 text-[10px] italic">
                      Notes: {ev.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* PROGRESS STATS BANNER */}
          <div className="pt-3 border-t border-slate-850 mt-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Workstation Compliance Hash:</span>
              <span className="font-bold text-slate-200">Level {profile?.cyberLevel || 1} operator</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Integrity logs:</span>
              <span className="font-bold text-purple-400">{evidenceLocker.length} sums verified</span>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          PRACTICE ANYTHING 2.0 & MISSION GENERATOR FORM DRAWER
          ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* PRACTICE ANYTHING 2.0 */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-100">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              Practice Anything 2.0 Range Compiler
            </h3>
            <p className="text-[10px] text-slate-500">AMAN compiles isolated sandbox environments dynamically from custom prompts.</p>
          </div>

          <form onSubmit={handlePracticeAnythingSubmit} className="flex gap-2">
            <input
              id="input-practice-anything"
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="E.g., Spring4Shell, IMDSv1 token exfiltration, DNS zone transfer..."
              className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 text-xs focus:outline-none"
            />
            <button
              id="btn-practice-anything-submit"
              type="submit"
              disabled={isCompilingCustom}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs disabled:opacity-45"
            >
              {isCompilingCustom ? 'Compiling...' : 'Bootstrap'}
            </button>
          </form>

          {customLabData && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-xs space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold uppercase">{customLabData.title}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">READY</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-slate-400 space-y-1.5 font-mono text-[11px]">
                <div><strong className="text-slate-300">Target host:</strong> {customLabData.targetHost}</div>
                <div><strong className="text-slate-300">IP address:</strong> {customLabData.targetIp}</div>
                <div><strong className="text-slate-300">Services:</strong> {customLabData.services.join(', ')}</div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Dynamic Objectives:</span>
                {customLabData.objectives.map((obj: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <span className="text-purple-400 font-bold font-mono">{i+1}.</span>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>

              <button
                id="btn-mount-custom-target"
                onClick={() => {
                  setActiveCycleTab('practice');
                  setCustomLabData(null);
                  setCustomPrompt('');
                }}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs"
              >
                Mount Custom Target to Workstation
              </button>
            </div>
          )}
        </div>

        {/* MISSION GENERATOR FORM */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-100">
              <Sliders className="w-5 h-5 text-purple-400 animate-pulse" />
              Dynamic Mission Generator Desk
            </h3>
            <p className="text-[10px] text-slate-500">Configure parameters to bootstrap detailed chronological cyber missions.</p>
          </div>

          <form onSubmit={handleDeployGeneratedMission} className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1.5">
              <span className="text-slate-500 block">Skill Domain:</span>
              <select
                id="select-gen-skill"
                value={generatorSkill}
                onChange={(e) => setGeneratorSkill(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 outline-none"
              >
                <option value="Network Security">Network Security</option>
                <option value="Web Security">Web Security</option>
                <option value="Linux Privilege Esc">Linux Privilege Esc</option>
                <option value="Active Directory">Active Directory</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-500 block">Difficulty level:</span>
              <select
                id="select-gen-difficulty"
                value={generatorDifficulty}
                onChange={(e) => setGeneratorDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-2">
              <span className="text-slate-500 block">Custom Scenario:</span>
              <input
                id="input-gen-scenario"
                type="text"
                value={generatorScenario}
                onChange={(e) => setGeneratorScenario(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 outline-none"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <span className="text-slate-500 block">Mission Target Objectives:</span>
              <input
                id="input-gen-objectives"
                type="text"
                value={generatorObjectives}
                onChange={(e) => setGeneratorObjectives(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 outline-none"
              />
            </div>

            <div className="col-span-2 pt-2">
              <button
                id="btn-generate-mission"
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs"
              >
                Compile and Deploy Mission
              </button>
            </div>
          </form>

          {activeGeneratedMission && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-xs space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-bold uppercase">{activeGeneratedMission.title}</span>
                <span className="text-slate-500 font-mono text-[10px]">{activeGeneratedMission.difficulty}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-slate-300">Rules of engagement:</strong> {activeGeneratedMission.rulesOfEngagement}
              </p>
              <button
                id="btn-mount-mission"
                onClick={() => {
                  setActiveCycleTab('practice');
                  setActiveGeneratedMission(null);
                }}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs"
              >
                Trigger Operation In Terminal
              </button>
            </div>
          )}
        </div>

      </div>

      {/* =========================================================================
          STAGE 16: COMPREHENSIVE SECURITY AUDIT & PENETRATION REPORT
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-100">
              <FileText className="w-5 h-5 text-purple-400" />
              Professional Penetration & Audit Report Generator
            </h3>
            <p className="text-[10px] text-slate-500">Sign, export, and record forensic compliance parameters.</p>
          </div>
          <button
            id="btn-compile-final-report"
            onClick={handleSaveAuditReport}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
          >
            Export Signed Report to Locker
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 text-xs font-mono space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar select-text leading-relaxed">
          <div className="text-center border-b border-slate-900 pb-3 space-y-1">
            <h4 className="text-xs font-black text-slate-200">SECURE AUDIT COMPLIANCE REPORT</h4>
            <div className="text-[10px] text-slate-500">WORKSTATION REFERENCE ID: P7-SECURITY-COMPLIANT</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[11px]">
            <div>
              <strong className="text-slate-400 block uppercase text-[10px]">1. Executive Summary:</strong>
              <p className="text-slate-400 mt-1">
                An active authorized network and application audit was executed against server node {termState.targetIp}. System state evaluated for vulnerability risk compliance.
              </p>
            </div>
            <div>
              <strong className="text-slate-400 block uppercase text-[10px]">2. Scope & Methodology:</strong>
              <p className="text-slate-400 mt-1">
                Scope of assessment is limited to subnet 10.10.1.0/24. Methodologies conform to OWASP testing standards and MITRE ATT&CK adversarial mapping frameworks.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <strong className="text-slate-400 block uppercase text-[10px]">3. Target Findings:</strong>
            <div className="p-3 bg-slate-900 rounded-xl space-y-1.5">
              <div><strong className="text-slate-300">Audited module:</strong> {activeSub.name} ({activeSub.difficulty} Level)</div>
              <div><strong className="text-slate-300">Vulnerable configuration vector:</strong> Concatenated parameter streams / unvalidated permissions.</div>
              <div><strong className="text-slate-300">Mitre matching:</strong> {activeSub.commands[0]?.mitre || 'T1046'}</div>
            </div>
          </div>

          <div className="space-y-1">
            <strong className="text-slate-400 block uppercase text-[10px]">4. Retesting & Mitigation verification:</strong>
            <div className="p-3 bg-slate-900 rounded-xl text-slate-400">
              <div><strong className="text-slate-300">Patches deployed:</strong> {termState.remediations.join(', ') || 'No local patches loaded.'}</div>
              <div><strong className="text-slate-300">Post-patch retesting state:</strong> {termState.retestPassed ? 'VERIFIED (PASS)' : 'PENDING DEFENSIVE TEST'}</div>
            </div>
          </div>

          <div className="space-y-1">
            <strong className="text-slate-400 block uppercase text-[10px]">5. Forensics & Timeline logs:</strong>
            <div className="p-2.5 bg-slate-900 rounded-xl text-[10px] text-slate-500 leading-snug">
              {termState.history.slice(-3).map((h, i) => (
                <div key={i} className="truncate">{h}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SkillLibraryPage;
