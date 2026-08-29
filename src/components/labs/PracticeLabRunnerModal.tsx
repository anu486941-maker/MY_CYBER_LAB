import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Award,
  Lock,
  Terminal as TerminalIcon,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  FileText,
  Search,
  Layers,
  RotateCcw,
  Zap,
  Check,
  Bot,
  Send,
  Lightbulb,
  Shield,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Code,
  ShieldCheck
} from 'lucide-react';
import { PracticeLab } from '../../data/practiceLabsData';
import { ProfessionalTerminal } from '../terminal/ProfessionalTerminal';
import { IncidentStateEngine, IncidentState } from '../../utils/incidentStateEngine';
import { useApp } from '../../context/AppContext';
import { LabEnvironment, LabTaskObjective } from '../../cyberrange/LabEnvironment';
import { SimulationEngine } from '../../cyberrange/SimulationEngine';
import { ReplayEngine } from '../../cyberrange/ReplayEngine';

interface PracticeLabRunnerModalProps {
  lab: PracticeLab;
  onClose: () => void;
}

type ModalTab = 'briefing' | 'concept' | 'terminal' | 'tasks' | 'hints' | 'aman' | 'debrief';

export const PracticeLabRunnerModal: React.FC<PracticeLabRunnerModalProps> = ({ lab, onClose }) => {
  const navigate = useNavigate();
  const { 
    addXp, 
    completeMission, 
    addEvidence, 
    recordMistake, 
    updateSkillMastery, 
    profile, 
    language,
    trainingMode 
  } = useApp();

  const [activeTab, setActiveTab] = useState<ModalTab>('briefing');
  const [activeHintLevel, setActiveHintLevel] = useState<number>(0);
  const [replaySeed, setReplaySeed] = useState<number>(1337);

  // AMAN in-lab copilot state
  const [amanQuery, setAmanQuery] = useState<string>('');
  const [amanChat, setAmanChat] = useState<Array<{ role: 'user' | 'aman'; text: string; time: string }>>([
    {
      role: 'aman',
      text: `Namaste Operator! I am your real-time AMAN Lab Mentor for "${lab.title}". I'm here to explain foundational concepts, analyze your command execution, provide progressive hints, or guide your defensive takeaways. How can I assist?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isAmanLoading, setIsAmanLoading] = useState<boolean>(false);
  const [explanationMode, setExplanationMode] = useState<'beginner' | 'advanced'>('beginner');

  // Stateful universal cyber range state
  const [labEnv, setLabEnv] = useState<LabEnvironment>(() => {
    return SimulationEngine.loadOrCreateEnvironment(lab.id, replaySeed);
  });

  const [incidentState, setIncidentState] = useState<IncidentState>(() => {
    return IncidentStateEngine.loadOrCreateState(lab.id);
  });

  const handleEnvUpdated = (newEnv: LabEnvironment) => {
    setLabEnv(newEnv);
    SimulationEngine.persistEnvironment(newEnv);
  };

  const handleTaskComplete = (objectiveId: string) => {
    const updated = JSON.parse(JSON.stringify(labEnv)) as LabEnvironment;
    const obj = updated.objectives.find(o => o.id === objectiveId);
    if (obj && !obj.isCompleted) {
      obj.isCompleted = true;
      obj.mitreTechnique = obj.mitreTechnique || 'T1046';
      updated.score.execution = Math.min(20, updated.score.execution + 4);
      updated.score.totalScore = Math.min(100, updated.score.totalScore + 4);
      
      updated.timeline.push({
        timestamp: new Date().toLocaleTimeString(),
        type: 'VULN_CONFIRMED',
        title: 'Task Cleared manually',
        description: `Verified objective criteria: ${obj.description}`,
        team: 'RED'
      });

      setLabEnv(updated);
      SimulationEngine.persistEnvironment(updated);
      addXp(100, `Completed task: ${obj.description}`);
    }
  };

  const handleResetWithSeed = (seed: number) => {
    const freshEnv = ReplayEngine.resetWithSeed(lab.id, seed);
    setLabEnv(freshEnv);
    SimulationEngine.persistEnvironment(freshEnv);
  };

  const completedObjectivesCount = labEnv.objectives.filter(o => o.isCompleted).length;
  const isLabFullyCompleted = completedObjectivesCount === labEnv.objectives.length && labEnv.objectives.length > 0;

  // AMAN Prompt Actions
  const handleAmanQuickPrompt = async (promptType: string) => {
    let query = '';
    if (promptType === 'explain-concept') {
      query = `Explain the core concept behind ${lab.title} in simple ${explanationMode} terms. Why is this important in real-world security?`;
    } else if (promptType === 'explain-command') {
      query = `What are the primary commands used in this lab (${lab.availableTools.join(', ')}) and what do their options do safely?`;
    } else if (promptType === 'progressive-hint') {
      query = `Give me a progressive Socratic hint for my current task without spoiling the exact solution command.`;
    } else if (promptType === 'defensive-perspective') {
      query = `How does a SOC Analyst or Security Engineer detect and mitigate the techniques simulated in this lab (${lab.mitreTechniques.join(', ')})?`;
    } else if (promptType === 'socratic-question') {
      query = `Ask me a targeted conceptual question to test my understanding of ${lab.title}.`;
    }

    if (!query) return;

    const userMessage = {
      role: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAmanChat(prev => [...prev, userMessage]);
    setIsAmanLoading(true);

    try {
      const response = await fetch('/api/aman/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            currentLab: lab.title,
            category: lab.category,
            difficulty: lab.difficulty,
            tools: lab.availableTools,
            objectives: lab.tasks.map(t => t.description),
            explanationMode,
            careerTrack: profile.selectedRole || 'ethical-hacker'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const amanReply = data.reply || data.response || data.message || 'Understood. Review the task parameters carefully.';
        setAmanChat(prev => [
          ...prev,
          {
            role: 'aman',
            text: amanReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Fallback structured mentor response
      let fallbackText = `Let's break down ${lab.title}:\n\n`;
      if (promptType === 'explain-concept') {
        fallbackText += `📌 **Objective**: ${lab.objective}\n\n💡 **Core Mechanics**: ${lab.conceptExplanation || lab.scenario}\n\nKey takeaway: Security testing verifies whether the system properly enforces authorization and boundary isolation.`;
      } else if (promptType === 'defensive-perspective') {
        fallbackText += `🛡️ **Defensive Controls & Detection**:\n- **SIEM Rules**: Monitor for unexpected process spawning or high-frequency port connections.\n- **Hardening**: Apply principle of least privilege and strict ingress firewall policies.\n- **MITRE Mapping**: Correlate with ${lab.mitreTechniques[0] || 'T1046'}.`;
      } else {
        fallbackText += `💡 **Mentor Guidance**: Remember to examine the known vs unknown information in your Briefing tab. Start by running \`${lab.availableTools[0] || 'whoami'}\` to inspect your execution environment.`;
      }

      setAmanChat(prev => [
        ...prev,
        {
          role: 'aman',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAmanLoading(false);
    }
  };

  const handleSendCustomAmanMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amanQuery.trim() || isAmanLoading) return;

    const text = amanQuery.trim();
    setAmanQuery('');

    const userMessage = {
      role: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAmanChat(prev => [...prev, userMessage]);
    setIsAmanLoading(true);

    try {
      const response = await fetch('/api/aman/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            currentLab: lab.title,
            category: lab.category,
            difficulty: lab.difficulty,
            tools: lab.availableTools,
            explanationMode
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAmanChat(prev => [
          ...prev,
          {
            role: 'aman',
            text: data.reply || data.response || 'Stay focused on your objective parameter validation.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      setAmanChat(prev => [
        ...prev,
        {
          role: 'aman',
          text: `Regarding "${text}": In this simulation (${lab.title}), always verify your target host (${lab.targetEnvironment.hostName} @ ${lab.targetEnvironment.ipAddress}) and confirm which tool flags are appropriate for ${lab.rulesOfEngagement}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAmanLoading(false);
    }
  };

  // 5-Tier Hint Ladder Defaults
  const hintLadder = [
    {
      level: 1,
      title: 'Conceptual Clue',
      type: 'Conceptual',
      xpPenalty: 5,
      text: lab.hints?.[0]?.text || `Focus on understanding the vulnerability mechanism for ${lab.title}. Check what service or parameter is exposed.`
    },
    {
      level: 2,
      title: 'Directional Clue',
      type: 'Directional',
      xpPenalty: 10,
      text: lab.hints?.[1]?.text || `Examine the available tools: ${lab.availableTools.join(', ')}. Use standard discovery syntax against target ${lab.targetEnvironment.ipAddress}.`
    },
    {
      level: 3,
      title: 'Command / Tool Hint',
      type: 'Command',
      xpPenalty: 15,
      text: `Try running: \`${lab.tasks[0]?.expectedValue || lab.availableTools[0] || 'whoami'}\` in the terminal to inspect the initial system state.`
    },
    {
      level: 4,
      title: 'Detailed Explanation',
      type: 'Detailed',
      xpPenalty: 25,
      text: `The target environment is misconfigured. When you execute ${lab.tasks[0]?.expectedValue || 'the primary command'}, the service returns unfiltered feedback or elevated privileges.`
    },
    {
      level: 5,
      title: 'Full Walkthrough',
      type: 'Walkthrough',
      xpPenalty: 35,
      text: `Complete Solution: 1) Run \`${lab.tasks[0]?.expectedValue || 'whoami'}\` 2) Run \`${lab.tasks[1]?.expectedValue || 'cat /etc/passwd'}\` 3) Verify your task completion in the Tasks tab.`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        
        {/* =========================================================================
            HEADER BAR & STAGE STEPPER
            ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              {lab.category}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                <span>{lab.title}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                  {lab.difficulty}
                </span>
              </h2>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Clock className="w-3.5 h-3.5" />
                  {lab.estimatedTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  +{lab.xpReward} XP
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  {completedObjectivesCount}/{labEnv.objectives.length} Tasks Cleared
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* 6 Core Guided Lab Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('briefing')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'briefing' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Briefing</span>
              </button>

              <button
                onClick={() => setActiveTab('concept')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'concept' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>2. Concept & Demo</span>
              </button>

              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'terminal' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>3. Terminal</span>
              </button>

              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'tasks' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>4. Tasks ({completedObjectivesCount}/{labEnv.objectives.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hints')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'hints' ? 'bg-amber-600/90 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>5. 5-Tier Hints</span>
              </button>

              <button
                onClick={() => setActiveTab('aman')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'aman' ? 'bg-purple-600 text-white font-bold shadow' : 'text-purple-400 hover:text-purple-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AMAN Copilot</span>
              </button>

              <button
                onClick={() => setActiveTab('debrief')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'debrief' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-emerald-400 hover:text-emerald-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>6. Debrief</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Close Lab"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN BODY PANES
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-slate-950/60">
          
          {/* TAB 1: PRE-LAB BRIEFING & SPECIFICATIONS */}
          {activeTab === 'briefing' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
              
              {/* OBJECTIVE CARD */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/40 space-y-3 shadow-lg">
                <span className="text-cyan-400 font-mono text-xs font-extrabold uppercase tracking-wider block flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  LAB LEARNING OBJECTIVE
                </span>
                <p className="text-base sm:text-lg text-slate-100 font-bold leading-relaxed">
                  {lab.objective}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono">
                    Target: <strong className="text-cyan-300">{lab.targetEnvironment.hostName} ({lab.targetEnvironment.ipAddress})</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono">
                    Subnet: <strong className="text-amber-300">{lab.targetEnvironment.subnet}</strong>
                  </span>
                </div>
              </div>

              {/* CAREER RELEVANCE & PREREQUISITES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-purple-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-purple-400" />
                    CAREER PATH RELEVANCE
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {lab.careerRelevance || `Crucial skill for Ethical Hackers and SOC Analysts. Mastering ${lab.category.toLowerCase()} enables you to audit system vulnerabilities and interpret defensive detections.`}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {(lab.skillsTrained || [lab.category, 'CLI Execution', 'MITRE Analysis']).map((skill, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-amber-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    REQUIRED KNOWLEDGE & PREREQUISITES
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {(lab.prerequisites || [
                      'Basic command-line navigation (ls, cd, cat)',
                      'Basic understanding of TCP/IP and ports',
                      'Awareness of client-server request model'
                    ]).map((prereq, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* KNOWN VS UNKNOWN INFORMATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <span className="text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    KNOWN INFORMATION
                  </span>
                  <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                    {lab.knownInformation.map((info, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <span className="text-amber-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    UNKNOWN INFORMATION (TO INVESTIGATE)
                  </span>
                  <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                    {lab.unknownInformation.map((info, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ETHICAL SCOPE NOTICE */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs font-mono">
                  <span className="font-bold text-white uppercase block">ETHICAL TRAINING NOTICE & SCOPE</span>
                  <p className="text-slate-400">
                    {lab.ethicalScopeNotice || `All activities are strictly contained within the virtual sandbox subnet ${lab.targetEnvironment.subnet}. Execution against unauthorized external systems is strictly prohibited.`}
                  </p>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setActiveTab('concept')}
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Review Concept & Demo First</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('terminal')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-mono text-xs font-black transition-all shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch Live Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONCEPT & DEMONSTRATION */}
          {activeTab === 'concept' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn font-mono text-xs">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  CONCEPTUAL ARCHITECTURE & THEORY
                </span>
                <p className="text-slate-300 leading-relaxed font-sans text-sm">
                  {lab.conceptExplanation || `In cybersecurity, understanding how network packets and operating system permissions behave is foundational. In this lab, you analyze the interaction between user permissions, services running on ${lab.targetEnvironment.hostName}, and client execution commands.`}
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 leading-relaxed">
                  <div className="text-slate-500 mb-1">// System Topology Flow</div>
                  [Student Terminal] --- (Simulated Network {lab.targetEnvironment.subnet}) ---&gt; [{lab.targetEnvironment.hostName} ({lab.targetEnvironment.ipAddress})]
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;└── Exposed Services: {lab.targetEnvironment.services.join(', ')}
                </div>
              </div>

              {/* DEMONSTRATION WALKTHROUGH */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-3">
                <span className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  STEP-BY-STEP DEMONSTRATION
                </span>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {lab.demonstration || `Before executing in the live terminal, study the expected tool chaining pattern below:`}
                </p>

                <div className="space-y-2 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold">Step 1: Reconnaissance & Environment Inspection</span>
                    <p className="text-slate-400 text-[11px]">Run initial discovery to verify your permissions and host reachability.</p>
                    <code className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded block w-fit">
                      {lab.startingPoint || 'whoami && id'}
                    </code>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold">Step 2: Service & Vulnerability Enumeration</span>
                    <p className="text-slate-400 text-[11px]">Query the target endpoint using authorized security audit tools.</p>
                    <code className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded block w-fit">
                      {lab.tasks[0]?.expectedValue || 'nmap -sV 10.10.20.25'}
                    </code>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setActiveTab('briefing')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold"
                >
                  ← Back to Briefing
                </button>
                <button
                  onClick={() => setActiveTab('terminal')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2 shadow"
                >
                  <span>Ready! Open Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE PROFESSIONAL TERMINAL */}
          {activeTab === 'terminal' && (
            <div className="h-full space-y-4 animate-fadeIn">
              <ProfessionalTerminal
                incidentState={incidentState}
                onStateUpdated={setIncidentState}
                labEnv={labEnv}
                onEnvUpdated={handleEnvUpdated}
                missionTitle={lab.title}
                targetHost={lab.targetEnvironment.hostName}
                networkRange={lab.targetEnvironment.subnet}
              />
            </div>
          )}

          {/* TAB 4: TASKS & PROGRESS */}
          {activeTab === 'tasks' && (
            <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  LAB TASKS & EXECUTION VERIFICATION
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {completedObjectivesCount} of {labEnv.objectives.length} Completed
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {labEnv.objectives.map((task, idx) => {
                  const isDone = task.isCompleted;
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        isDone ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isDone ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                            {idx + 1}
                          </span>
                          <span>{task.description}</span>
                        </span>
                        <span className="text-[10px] text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                          {task.mitreTechnique || 'T1046'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-400 text-[11px]">
                          Target Command Pattern: <code className="text-cyan-300">{task.expectedValue}</code>
                        </span>

                        <button
                          onClick={() => handleTaskComplete(task.id)}
                          disabled={isDone}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isDone
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-default'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
                          }`}
                        >
                          {isDone ? '✓ Completed' : 'Mark Completed'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {isLabFullyCompleted && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-mono font-bold text-white">All Lab Objectives Cleared!</h4>
                      <p className="text-xs text-emerald-300 font-sans">View your technical scorecard and recommendations in the Debrief tab.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('debrief')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all cursor-pointer"
                  >
                    View Debrief →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: 5-TIER SOKRATIC HINT LADDER */}
          {activeTab === 'hints' && (
            <div className="max-w-3xl mx-auto space-y-4 font-mono text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>5-TIER SOKRATIC HINT LADDER</span>
                  </h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Progressive hints scale from conceptual clues to full solutions.</p>
                </div>
                <span className="text-[11px] text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-500/30">
                  Minimal penalty to encourage mastery
                </span>
              </div>

              <div className="space-y-3">
                {hintLadder.map((hint) => {
                  const isUnlocked = activeHintLevel >= hint.level;
                  return (
                    <div
                      key={hint.level}
                      className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        isUnlocked ? 'bg-slate-900 border-amber-500/40 shadow-md' : 'bg-slate-950/60 border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500/50 flex items-center justify-center text-[10px] text-amber-300">
                            {hint.level}
                          </span>
                          <span>LEVEL {hint.level}: {hint.title}</span>
                          <span className="text-[10px] font-normal text-slate-400">({hint.type})</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-bold">
                          Penalty: -{hint.xpPenalty} XP
                        </span>
                      </div>

                      {isUnlocked ? (
                        <p className="text-slate-200 leading-relaxed pt-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                          {hint.text}
                        </p>
                      ) : (
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Hint locked. Unlock only if you are stuck.</span>
                          <button
                            onClick={() => setActiveHintLevel(hint.level)}
                            className="px-3 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40 font-bold transition-all cursor-pointer"
                          >
                            Unlock Level {hint.level} Hint
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5 (NEW): AMAN IN-LAB AI COPILOT */}
          {activeTab === 'aman' && (
            <div className="max-w-4xl mx-auto h-full flex flex-col space-y-4 animate-fadeIn font-mono text-xs">
              
              {/* Copilot Header & Mode Toggle */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-purple-500/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      <span>AMAN In-Lab AI Mentor Co-Pilot</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h3>
                    <p className="text-[11px] text-purple-300">Live contextual guidance calibrated to {lab.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Explanation Depth:</span>
                  <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center">
                    <button
                      onClick={() => setExplanationMode('beginner')}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        explanationMode === 'beginner' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Beginner
                    </button>
                    <button
                      onClick={() => setExplanationMode('advanced')}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        explanationMode === 'advanced' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Advanced
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Prompt Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">Quick Prompts:</span>
                <button
                  onClick={() => handleAmanQuickPrompt('explain-concept')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 text-[11px] shrink-0 transition-all cursor-pointer"
                >
                  💡 Explain Concept
                </button>
                <button
                  onClick={() => handleAmanQuickPrompt('explain-command')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 text-[11px] shrink-0 transition-all cursor-pointer"
                >
                  ⌨️ Explain Tool Commands
                </button>
                <button
                  onClick={() => handleAmanQuickPrompt('defensive-perspective')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 text-[11px] shrink-0 transition-all cursor-pointer"
                >
                  🛡️ Defensive Implications
                </button>
                <button
                  onClick={() => handleAmanQuickPrompt('progressive-hint')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 text-[11px] shrink-0 transition-all cursor-pointer"
                >
                  🎯 Socratic Hint
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 overflow-y-auto space-y-3 min-h-[220px]">
                {amanChat.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>{msg.role === 'user' ? 'Operator' : 'AMAN AI Mentor'}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-sans'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAmanLoading && (
                  <div className="flex items-center gap-2 text-purple-400 text-xs py-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>AMAN is analyzing lab telemetry and preparing guidance...</span>
                  </div>
                )}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendCustomAmanMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={amanQuery}
                  onChange={(e) => setAmanQuery(e.target.value)}
                  placeholder="Ask AMAN anything about this lab scenario, tool flags, or conceptual doubts..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isAmanLoading || !amanQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: COMPREHENSIVE DEBRIEF & SKILLS */}
          {activeTab === 'debrief' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn text-slate-100 font-mono text-xs">
              
              {/* REPLAY SEED CONTROLLER */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-cyan-400 font-bold text-sm uppercase">Replay Seed Controller</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Randomize ports, passwords, subnets, and credentials statefully.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Current Seed:</span>
                  <input 
                    type="number" 
                    value={replaySeed} 
                    onChange={(e) => setReplaySeed(parseInt(e.target.value) || 1337)}
                    className="w-20 p-1.5 rounded bg-slate-950 border border-slate-800 text-center text-cyan-300 font-bold"
                  />
                  <button
                    onClick={() => handleResetWithSeed(replaySeed)}
                    className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Apply Seed</span>
                  </button>
                  <button
                    onClick={() => {
                      const newSeed = Math.floor(Math.random() * 9000) + 1000;
                      handleResetWithSeed(newSeed);
                    }}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Random</span>
                  </button>
                </div>
              </div>

              {/* DETAILED SCORECARD */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <span>PROFESSIONAL MISSION REPORT CARD</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Final Grade:</span>
                    <span className="text-xl font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg">
                      {labEnv.score.grade}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Reconnaissance</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.recon} / 20</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Investigation</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.investigation} / 20</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Execution</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.execution} / 20</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Reasoning</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.reasoning} / 20</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Evidence</span>
                    <span className="text-lg font-bold text-slate-200">{labEnv.score.evidence} / 20</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center text-sm font-bold text-slate-200">
                  Total Cyber Range Proficiency Index: <span className="text-cyan-300 font-extrabold">{labEnv.score.totalScore} / 100</span>
                </div>
              </div>

              {/* POST-LAB KEY TAKEAWAYS & DEFENSIVE IMPLICATIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5 uppercase text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>WHAT YOU MASTERED</span>
                  </span>
                  <ul className="space-y-1.5 text-slate-300 text-xs font-sans">
                    {(lab.debrief?.whatYouLearned || [
                      'Deterministic CLI execution and tool argument verification',
                      'Correlating network services with MITRE ATT&CK techniques',
                      'Identifying and isolating unpatched service misconfigurations'
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5 uppercase text-xs">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>DEFENSIVE PERSPECTIVE & HARDENING</span>
                  </span>
                  <p className="text-slate-300 text-xs font-sans leading-relaxed">
                    {lab.debrief?.defensivePerspective || `In production environments, ensure stateful firewalls block all non-essential ports, enforce least-privilege RBAC, and ingest daemon logs into SIEM correlation rules.`}
                  </p>
                </div>
              </div>

              {/* NEXT RECOMMENDED STEP (1-CLICK CTA) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider block">
                    AMAN ADAPTIVE NEXT STEP
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {lab.debrief?.nextRecommendedStep || 'Continue to your Career Learning Path & Tactical Missions'}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate(lab.debrief?.nextRoute || '/dashboard');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer shrink-0"
                >
                  <span>Launch Next Activity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
