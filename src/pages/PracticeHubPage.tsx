import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Search, 
  Terminal, 
  Binary, 
  Flag, 
  Globe, 
  Wrench, 
  Crosshair, 
  Shield, 
  FileText, 
  Award, 
  ArrowRight,
  Sparkles,
  Play,
  Cpu,
  Server,
  Key,
  Cloud,
  Eye,
  Microscope,
  RotateCcw,
  Unlock,
  Radio,
  Clock,
  Layers,
  HelpCircle,
  CheckCircle2,
  Filter,
  Zap,
  Check,
  X
} from 'lucide-react';
import { PRACTICE_LABS_HUB_DATA, PracticeLab } from '../data/practiceLabsData';
import { PracticeLabRunnerModal } from '../components/labs/PracticeLabRunnerModal';
import { MICRO_CHALLENGES_DATA, MicroChallenge } from '../services/microChallengeService';

export const PracticeHubPage: React.FC = () => {
  const { addXp } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeLabModal, setActiveLabModal] = useState<PracticeLab | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [customLabs, setCustomLabs] = useState<PracticeLab[]>(() => {
    const saved = localStorage.getItem('mycyberlab_custom_labs');
    return saved ? JSON.parse(saved) : [];
  });

  // Micro challenge state
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const [selectedDrillOption, setSelectedDrillOption] = useState<number | null>(null);
  const [isDrillSubmitted, setIsDrillSubmitted] = useState<boolean>(false);
  const [completedDrills, setCompletedDrills] = useState<string[]>([]);

  const activeDrill = MICRO_CHALLENGES_DATA[activeChallengeIndex] || MICRO_CHALLENGES_DATA[0];

  const handleDrillSubmit = () => {
    if (selectedDrillOption === null) return;
    setIsDrillSubmitted(true);
    if (selectedDrillOption === activeDrill.correctIndex && !completedDrills.includes(activeDrill.id)) {
      addXp(activeDrill.xpReward, `Completed Micro-Challenge: ${activeDrill.title}`);
      setCompletedDrills(prev => [...prev, activeDrill.id]);
    }
  };

  const handleNextDrill = () => {
    setSelectedDrillOption(null);
    setIsDrillSubmitted(false);
    setActiveChallengeIndex((prev) => (prev + 1) % MICRO_CHALLENGES_DATA.length);
  };

  const handleGenerateCustomLab = (promptText: string) => {
    const topic = promptText.trim() || 'Custom Sandbox Scenario';
    const id = `custom-${Date.now()}`;
    
    const newLab: PracticeLab = {
      id,
      title: topic.length > 40 ? `${topic.slice(0, 37)}...` : topic,
      category: 'WEB SECURITY',
      difficulty: 'Intermediate',
      objective: `Investigate security controls, verify attack parameters, and identify remediation vectors for: "${topic}". Obtain system flag and submit.`,
      scenario: `An dynamic range target sandbox has been instantiated statefully under local network conditions to audit: "${topic}". Conduct nmap, curl, and exfiltration checklists.`,
      estimatedTime: '30 mins',
      xpReward: 250,
      targetEnvironment: {
        hostName: 'sandbox-target-node',
        ipAddress: '10.10.150.25',
        subnet: '10.150.1.0/24',
        services: ['HTTP (Nginx)', 'SSH', 'PostgreSQL']
      },
      rulesOfEngagement: 'AUTHORIZED TRAINING LAB ONLY',
      startingPoint: 'Initiate dynamic terminal shell session against local sandboxed targets.',
      availableTools: ['nmap', 'curl', 'gobuster', 'sqlmap', 'ssh', 'whoami', 'find'],
      mitreTechniques: ['T1046', 'T1190', 'T1005'],
      knownInformation: [
        'Target was provisioned on internal private ranges',
        'Vulnerability involves parameters related to input topic'
      ],
      unknownInformation: [
        'Enumerate target ports to discover vulnerable ports',
        'Analyze exfiltrated responses to retrieve system flags'
      ],
      tasks: [
        {
          id: 't-1',
          description: 'Scan target assets and locate active HTTP/SSH portals using nmap',
          verificationType: 'terminal',
          expectedValue: 'nmap',
          mitreTechnique: 'T1046'
        },
        {
          id: 't-2',
          description: 'Evaluate active inputs or service variables using curl parameters',
          verificationType: 'terminal',
          expectedValue: 'curl',
          mitreTechnique: 'T1190'
        },
        {
          id: 't-3',
          description: 'Compromise target database segment and extract hidden flag',
          verificationType: 'terminal',
          expectedValue: 'flag',
          mitreTechnique: 'T1005'
        }
      ],
      hints: [
        {
          level: 1,
          title: 'Initial Discovery',
          text: 'Use network tools like nmap or ping to discover available interfaces.',
          xpPenalty: 15
        },
        {
          level: 2,
          title: 'Exploit Point',
          text: 'Exfiltrate database structures and request flag parameters with secure requests.',
          xpPenalty: 30
        }
      ]
    };

    const updated = [newLab, ...customLabs];
    setCustomLabs(updated);
    localStorage.setItem('mycyberlab_custom_labs', JSON.stringify(updated));
    setCustomPrompt('');
    setActiveLabModal(newLab);
  };

  const handleClearCustomLabs = () => {
    setCustomLabs([]);
    localStorage.removeItem('mycyberlab_custom_labs');
  };

  const categories = [
    'ALL',
    'NETWORK SECURITY',
    'LINUX SECURITY',
    'WEB SECURITY',
    'API SECURITY',
    'ACTIVE DIRECTORY',
    'CLOUD SECURITY',
    'SOC / DETECTION',
    'DIGITAL FORENSICS',
    'INCIDENT RESPONSE',
    'PRIVILEGE ESCALATION',
    'OSINT',
    'CRYPTOGRAPHY',
    'WIRELESS SECURITY',
    'THREAT HUNTING',
    'PYTHON SECURITY AUTOMATION'
  ];

  const allAvailableLabs = [...customLabs, ...PRACTICE_LABS_HUB_DATA];

  const filteredLabs = allAvailableLabs.filter(lab => {
    if (selectedCategory === 'ALL') return true;
    return lab.category === selectedCategory;
  });

  const categoryIcons: Record<string, React.ElementType> = {
    'NETWORK SECURITY': Globe,
    'LINUX SECURITY': Terminal,
    'WEB SECURITY': Shield,
    'API SECURITY': Wrench,
    'ACTIVE DIRECTORY': Server,
    'CLOUD SECURITY': Cloud,
    'SOC / DETECTION': ShieldAlert,
    'DIGITAL FORENSICS': Microscope,
    'INCIDENT RESPONSE': RotateCcw,
    'PRIVILEGE ESCALATION': Unlock,
    'OSINT': Eye,
    'CRYPTOGRAPHY': Key,
    'WIRELESS SECURITY': Radio,
    'THREAT HUNTING': Search,
    'PYTHON SECURITY AUTOMATION': Cpu
  };

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b076415_1px,transparent_1px),linear-gradient(to_bottom,#3b076415_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              PRACTICE LAB HUB 2.0
            </span>
            <span className="text-xs font-mono text-slate-500">•</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              12 SPECIALIZED DOMAINS
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-mono font-black text-slate-100 tracking-tight">
            Hands-On Cyber Range Practice Labs
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
            Investigate real security scenarios inside isolated container simulations. Reconstruct attack chains, gather forensic evidence, test hypotheses, and verify remediation in realtime.
          </p>
        </div>
      </div>

      {/* =========================================================================
          PRACTICE ANYTHING: DYNAMIC WORKSTATION LAB GENERATOR
          ========================================================================= */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Dynamic "Practice Anything" Range Generator</h3>
          </div>
          {customLabs.length > 0 && (
            <button 
              onClick={handleClearCustomLabs}
              className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Clear Custom Labs
            </button>
          )}
        </div>

        <p className="text-slate-400 text-[11px] leading-relaxed">
          Type any target vulnerability, service, CVE, or network deployment scenario. AMAN will dynamically compile and bootstrap a custom simulated range environment statefully with local targets, nmap outputs, databases, and objectives.
        </p>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateCustomLab(customPrompt);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="E.g., Active Directory Kerberoasting on Win Server 2022, AWS Metadata IMDSv1, CVE-2021-44228 Log4j..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            Generate Mission
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold pr-1">DYNAMIC SCENARIOS:</span>
          {[
            'Active Directory Kerberoasting',
            'AWS IMDSv1 SSRF Profile Leak',
            'Kubernetes API Token Exfiltration',
            'SQL Injection Database Dump',
            'Spring4Shell CVE-2022-22965 Remote Code Execution'
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => handleGenerateCustomLab(tag)}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-slate-400 hover:text-purple-300 text-[10px] cursor-pointer transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MICRO-CHALLENGE & RAPID RETENTION DRILL (2-5 MIN RECALL)
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase">RAPID RETENTION MICRO-DRILL (2-5 MIN)</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {activeDrill.category}
                </span>
                {activeDrill.mitreRef && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                    MITRE {activeDrill.mitreRef}
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[11px]">Reinforce critical security instincts with spaced micro-challenges.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">+{activeDrill.xpReward} XP</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Drill {activeChallengeIndex + 1} of {MICRO_CHALLENGES_DATA.length}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-100 font-sans leading-relaxed">
            {activeDrill.prompt}
          </h4>

          {activeDrill.codeSnippet && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono whitespace-pre-wrap">
              {activeDrill.codeSnippet}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {activeDrill.options.map((option, idx) => {
              const isSelected = selectedDrillOption === idx;
              const isCorrect = idx === activeDrill.correctIndex;
              let btnClass = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300';

              if (isDrillSubmitted) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                } else if (isSelected) {
                  btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                btnClass = 'bg-cyan-950/80 border-cyan-500 text-cyan-200';
              }

              return (
                <button
                  key={idx}
                  disabled={isDrillSubmitted}
                  onClick={() => setSelectedDrillOption(idx)}
                  className={`p-3 rounded-xl border text-left font-sans text-xs transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnClass}`}
                >
                  <span className="font-mono font-bold text-slate-500 shrink-0">[{String.fromCharCode(65 + idx)}]</span>
                  <span className="leading-snug">{option}</span>
                </button>
              );
            })}
          </div>

          {isDrillSubmitted && (
            <div className={`p-4 rounded-xl border space-y-1 ${
              selectedDrillOption === activeDrill.correctIndex
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {selectedDrillOption === activeDrill.correctIndex ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>{selectedDrillOption === activeDrill.correctIndex ? 'Correct Instinct!' : 'Conceptual Explanation:'}</span>
              </div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">{activeDrill.explanation}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {!isDrillSubmitted ? (
              <button
                disabled={selectedDrillOption === null}
                onClick={handleDrillSubmit}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold transition-all cursor-pointer font-mono"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextDrill}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all cursor-pointer font-mono flex items-center gap-1.5"
              >
                <span>Next Recall Drill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="text-[11px] text-slate-500">
              {completedDrills.length}/{MICRO_CHALLENGES_DATA.length} Drills Cleared
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CATEGORY FILTER TABS (12 DOMAINS)
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-400" />
            <span>Select Practice Domain ({PRACTICE_LABS_HUB_DATA.length} Available Labs)</span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const Icon = categoryIcons[cat] || Layers;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat !== 'ALL' && <Icon className="w-3.5 h-3.5" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          PRACTICE LAB CARDS GRID
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLabs.map((lab) => {
          const IconComponent = categoryIcons[lab.category] || Terminal;
          return (
            <div
              key={lab.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <IconComponent className="w-3 h-3 text-purple-400" />
                    {lab.category}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    lab.difficulty === 'Beginner' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                    lab.difficulty === 'Intermediate' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' :
                    'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}>
                    {lab.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-mono font-bold text-slate-100 group-hover:text-purple-300 transition-colors leading-snug">
                  {lab.title}
                </h3>

                {/* Objective */}
                <p className="text-xs text-slate-400 font-mono leading-relaxed line-clamp-3">
                  {lab.objective}
                </p>

                {/* Target info */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 text-[10px]">TARGET:</span>
                    <span className="font-bold">{lab.targetEnvironment.hostName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>IP: {lab.targetEnvironment.ipAddress}</span>
                    <span className="text-cyan-400">{lab.targetEnvironment.services[0]}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {lab.estimatedTime}
                  </span>
                  <span className="text-amber-400 text-[11px] font-bold">
                    +{lab.xpReward} XP
                  </span>
                </div>

                <button
                  onClick={() => setActiveLabModal(lab)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow flex items-center gap-1 group-hover:gap-1.5"
                >
                  <span>Launch Lab</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          PRACTICE LAB RUNNER MODAL
          ========================================================================= */}
      {activeLabModal && (
        <PracticeLabRunnerModal
          lab={activeLabModal}
          onClose={() => setActiveLabModal(null)}
        />
      )}
    </div>
  );
};
