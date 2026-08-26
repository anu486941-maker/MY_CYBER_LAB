import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { REAL_WORLD_INCIDENTS, RealIncident } from '../data/realWorldIncidentsData';
import { BOSS_CHALLENGES } from '../data/bossChallengesData';
import { BossChallengeModal } from '../components/boss/BossChallengeModal';
import { ProfessionalTerminal } from '../components/terminal/ProfessionalTerminal';
import { IncidentStateEngine, IncidentState, resetIncidentWithSeed } from '../utils/incidentStateEngine';
import { ThinkLikeAnEthicalHackerEngine } from '../components/ethical-hacker/ThinkLikeAnEthicalHackerEngine';
import { AttackerDecisionEngine } from '../components/ethical-hacker/AttackerDecisionEngine';
import { BluePurpleTeamPanel } from '../components/blue-purple/BluePurpleTeamPanel';
import {
  ShieldAlert,
  Search,
  Terminal,
  Activity,
  History,
  Calendar,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Bot,
  Zap,
  ArrowRight,
  Filter,
  CheckSquare,
  Lock,
  ChevronRight,
  Compass,
  Cpu,
  Database,
  Globe,
  Dices,
  RotateCcw,
  Shield,
  Brain
} from 'lucide-react';

export const RealWorldIncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addXp, completeMission, addNotebookNote } = useApp();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-01');
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'mitre' | 'simulation' | 'quiz' | 'debrief'>('overview');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Simulation state
  const [simAnswers, setSimAnswers] = useState<Record<number, number>>({});
  const [simCompleted, setSimCompleted] = useState<boolean>(false);
  const [remediationCommand, setRemediationCommand] = useState<string>('');
  const [remediationVerified, setRemediationVerified] = useState<boolean>(false);

  // Quiz state
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<boolean | null>(null);

  // Boss challenge modal state
  const [activeBossModal, setActiveBossModal] = useState<boolean>(false);

  // Simulation sub-tabs and seed controls
  const [simSubTab, setSimSubTab] = useState<'terminal' | 'hacker_mode' | 'defender_mode' | 'replay'>('terminal');
  const [teamMode, setTeamMode] = useState<'RED' | 'BLUE' | 'PURPLE'>('PURPLE');

  // Terminal Incident State & Seed
  const [incidentState, setIncidentState] = useState<IncidentState>(() => {
    return IncidentStateEngine.loadOrCreateState(selectedIncidentId);
  });
  const [seedInput, setSeedInput] = useState<string>(String(incidentState.seed || '1337'));

  useEffect(() => {
    const fresh = IncidentStateEngine.loadOrCreateState(selectedIncidentId);
    setIncidentState(fresh);
    setSeedInput(String(fresh.seed || '1337'));
  }, [selectedIncidentId]);

  const handleResetIncident = () => {
    const seedNum = parseInt(seedInput, 10) || 1337;
    const freshState = resetIncidentWithSeed(selectedIncidentId, seedNum);
    setIncidentState(freshState);
  };

  const handleRandomSeed = () => {
    const newSeedNum = Math.floor(1000 + Math.random() * 9000);
    setSeedInput(String(newSeedNum));
    const freshState = resetIncidentWithSeed(selectedIncidentId, newSeedNum);
    setIncidentState(freshState);
  };

  const currentIncident = REAL_WORLD_INCIDENTS.find(i => i.id === selectedIncidentId) || REAL_WORLD_INCIDENTS[0];

  const filteredIncidents = REAL_WORLD_INCIDENTS.filter(inc => {
    const matchType = filterType === 'All' || inc.incidentType === filterType;
    const matchDiff = filterDifficulty === 'All' || inc.difficulty === filterDifficulty;
    const matchSearch = (inc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (inc.sector || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (inc.initialAttackVector || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchDiff && matchSearch;
  });

  const incidentTypes = ['All', 'Ransomware', 'Data Breach', 'Supply Chain', 'Web Application', 'Malware', 'Social Engineering', 'Critical Infrastructure', 'Zero-Day'];
  const difficulties = ['All', 'Beginner', 'Easy', 'Intermediate', 'Hard', 'Advanced', 'Master'];

  const handleSimOptionSelect = (qIdx: number, oIdx: number) => {
    setSimAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    const isCorrect = oIdx === currentIncident.safeSimulation.investigationQuestions[qIdx].correctIndex;
    if (isCorrect) {
      setSimCompleted(true);
      addXp(150);
    }
  };

  const handleVerifyRemediation = (e: React.FormEvent) => {
    e.preventDefault();
    if (remediationCommand.trim() === currentIncident.safeSimulation.verificationCommand.trim() || remediationCommand.trim().length > 5) {
      setRemediationVerified(true);
      addXp(100);
      completeMission(currentIncident.id);
      addNotebookNote({
        title: `[INCIDENT CASE] ${currentIncident.name} (${currentIncident.year})`,
        content: `Sector: ${currentIncident.sector}\nVector: ${currentIncident.initialAttackVector}\n\nSecurity Weakness: ${currentIncident.securityWeakness}\nMitigations:\n${currentIncident.mitigations.join('\n')}`,
        category: 'Cases',
        tags: ['Real Incident', currentIncident.incidentType, currentIncident.name]
      });
    }
  };

  const handleQuizSubmit = () => {
    if (quizSelected === null) return;
    const isCorrect = quizSelected === currentIncident.quiz.correctIndex;
    setQuizFeedback(isCorrect);
    if (isCorrect) {
      addXp(75);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-950 border border-red-500/30 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                ARCHIVE OF REAL-WORLD INCIDENTS
              </span>
              <span className="text-xs font-mono text-slate-400">
                15 HISTORICAL CASES • SAFE SIMULATIONS
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-mono text-slate-100 tracking-tight">
              Real-World Cyber Incidents & Case Studies
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Study the exact technical mechanisms, initial attack vectors, timeline chains, MITRE ATT&CK mappings, and defensive lessons from history's most defining cyber breaches.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/command-center')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-lg hover:shadow-purple-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>Launch in Ethical Hacker Command Center</span>
            </button>

            <button
              onClick={() => setActiveBossModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shadow-lg hover:shadow-red-500/20"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Incident Response Boss</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Selector Sidebar & Case Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Incident List & Search Filter */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search & Filter Controls */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, CVEs, vectors..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-hidden focus:border-cyan-500"
              >
                {incidentTypes.map(t => (
                  <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
                ))}
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-hidden focus:border-cyan-500"
              >
                {difficulties.map(d => (
                  <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Incidents Card Scroll */}
          <div className="space-y-2 max-h-[650px] overflow-y-auto custom-scrollbar pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              return (
                <button
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    setSimCompleted(false);
                    setRemediationVerified(false);
                    setQuizSelected(null);
                    setQuizFeedback(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        {inc.year}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-200 truncate">
                        {inc.name}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      inc.difficulty === 'Master' ? 'bg-red-950 text-red-300 border-red-500/30' :
                      inc.difficulty === 'Hard' ? 'bg-amber-950 text-amber-300 border-amber-500/30' :
                      'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                    }`}>
                      {inc.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {inc.whatHappened}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                    <span>{inc.incidentType}</span>
                    <span className="text-slate-400">{inc.sector}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Deep-Dive & Simulation Studio */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Case Navigation Tabs */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 font-bold">
                  {currentIncident.incidentType}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentIncident.sector} ({currentIncident.year})
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-slate-100">
                {currentIncident.name}
              </h2>
            </div>

            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              {[
                { id: 'overview', label: 'Briefing' },
                { id: 'timeline', label: 'Timeline' },
                { id: 'mitre', label: 'ATT&CK' },
                { id: 'simulation', label: 'Lab Sim' },
                { id: 'quiz', label: 'Quiz' },
                { id: 'debrief', label: 'AI Debrief' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: OVERVIEW & ATTACK CHAIN */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    What Happened:
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {currentIncident.whatHappened}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Initial Attack Vector:
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentIncident.initialAttackVector}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">
                      Core Security Weakness:
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentIncident.securityWeakness}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Attack Execution Chain:
                  </h4>
                  <div className="space-y-1.5">
                    {currentIncident.attackChain.map((step, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 font-bold shrink-0">[{idx + 1}]</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Impact & Mitigations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                    Impact & Extortion:
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentIncident.impact}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Defensive Mitigations:
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {currentIncident.mitigations.map((m, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lessons for Red & Blue Team */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-rose-400 font-bold uppercase">Lessons for Ethical Hackers:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentIncident.lessonsForEthicalHackers}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-blue-400 font-bold uppercase">Lessons for Blue Team Defenders:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentIncident.lessonsForBlueTeam}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE TIMELINE STEPPER */}
          {activeTab === 'timeline' && (
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-6">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Chronological Attack Timeline:
              </h3>
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                {currentIncident.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">{step.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">{step.timestamp}</span>
                        <span className="text-[10px] font-mono text-amber-400">({step.stage})</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MITRE ATT&CK MAPPING */}
          {activeTab === 'mitre' && (
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                MITRE ATT&CK Enterprise Matrix Alignment:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentIncident.mitreMapping.map((mitre, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-purple-300 font-bold">{mitre.tactic}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/30 font-bold">
                        {mitre.techniqueId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-sans">
                      {mitre.techniqueName}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400">Associated Skill Tracks:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentIncident.relatedSkills.map(skill => (
                    <span key={skill} className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAFE PRACTICAL SIMULATION LAB */}
          {activeTab === 'simulation' && (
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>{currentIncident.safeSimulation.labTitle}</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Host: <strong className="text-cyan-300">{currentIncident.safeSimulation.targetHost}</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {currentIncident.safeSimulation.scenario}
                </p>
              </div>

              {/* Fictional Forensic Logs */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-slate-400">Synthetic Forensic Log Capture:</span>
                <pre className="p-3.5 rounded-lg bg-black border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentIncident.safeSimulation.fictionalLogs}
                </pre>
              </div>

              {/* Investigation Question */}
              {currentIncident.safeSimulation.investigationQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-mono font-semibold text-slate-200">
                    Investigation Query: {q.question}
                  </h4>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleSimOptionSelect(qIdx, oIdx)}
                        className={`w-full text-left p-2.5 rounded text-xs font-mono transition-all border ${
                          simAnswers[qIdx] === oIdx
                            ? oIdx === q.correctIndex
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                              : 'bg-red-950/60 border-red-500 text-red-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>

                  {simAnswers[qIdx] !== undefined && (
                    <div className="text-xs font-mono text-slate-400 p-2 rounded bg-slate-900">
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {/* Remediation Action */}
              <form onSubmit={handleVerifyRemediation} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Defensive Remediation Mandate:
                </h4>
                <p className="text-xs text-slate-300">
                  {currentIncident.safeSimulation.remediationTask}
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={remediationCommand}
                    onChange={(e) => setRemediationCommand(e.target.value)}
                    placeholder={`e.g. ${currentIncident.safeSimulation.verificationCommand}`}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-hidden focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors"
                  >
                    Verify Patch
                  </button>
                </div>

                {remediationVerified && (
                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>REMEDIATION CONFIRMED: Patch verified. Case logged in Cyber Notebook. (+100 XP)</span>
                  </div>
                )}
              </form>

              {/* Interactive Cyber Range Suite for this Incident */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 font-mono text-xs">
                    <button
                      onClick={() => setSimSubTab('terminal')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        simSubTab === 'terminal' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Kali Terminal 3.0</span>
                    </button>
                    <button
                      onClick={() => setSimSubTab('hacker_mode')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        simSubTab === 'hacker_mode' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Think Like a Hacker</span>
                    </button>
                    <button
                      onClick={() => setSimSubTab('defender_mode')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        simSubTab === 'defender_mode' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Blue Team SIEM & Defense</span>
                    </button>
                    <button
                      onClick={() => setSimSubTab('replay')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        simSubTab === 'replay' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Incident Replay & Seed</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    Seed: <strong className="text-cyan-300">{seedInput}</strong>
                  </span>
                </div>

                {/* SUB-VIEW 1: TERMINAL 3.0 */}
                {simSubTab === 'terminal' && (
                  <ProfessionalTerminal
                    incidentState={incidentState}
                    onStateUpdated={setIncidentState}
                    missionTitle={`Incident Lab: ${currentIncident.name}`}
                    targetHost={currentIncident.safeSimulation.targetHost}
                    networkRange="10.10.20.0/24"
                  />
                )}

                {/* SUB-VIEW 2: THINK LIKE AN ETHICAL HACKER MODE */}
                {simSubTab === 'hacker_mode' && (
                  <div className="space-y-4">
                    <ThinkLikeAnEthicalHackerEngine
                      incidentState={incidentState}
                      onStateUpdated={setIncidentState}
                    />
                    <AttackerDecisionEngine
                      state={incidentState}
                      onDecisionChosen={(opt) => {
                        const updated = { ...incidentState };
                        if (opt.isOptimal) {
                          updated.score.totalScore = Math.min(100, updated.score.totalScore + (opt.scoreDelta || 5));
                        }
                        updated.timeline.unshift({
                          timestamp: new Date().toLocaleTimeString(),
                          type: 'INVESTIGATION_PERFORMED',
                          title: `Decision: ${opt.label}`,
                          description: opt.description,
                          team: 'RED'
                        });
                        setIncidentState(updated);
                        addXp(opt.isOptimal ? 50 : 20);
                      }}
                    />
                  </div>
                )}

                {/* SUB-VIEW 3: BLUE TEAM SIEM & DEFENSE */}
                {simSubTab === 'defender_mode' && (
                  <BluePurpleTeamPanel
                    state={incidentState}
                    onStateUpdated={setIncidentState}
                  />
                )}

                {/* SUB-VIEW 4: INCIDENT REPLAY & SEED CONFIGURATION */}
                {simSubTab === 'replay' && (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
                    <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 uppercase">
                      <RotateCcw className="w-4 h-4" />
                      <span>Deterministic Incident Replay Controls</span>
                    </h4>
                    <p className="text-slate-300">
                      Randomize IP addresses, network signatures, port numbers, vulnerability flags, and forensic artifact hashes while maintaining structural incident realism.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <label className="text-slate-400 font-bold block">Current Simulation Seed:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={seedInput}
                            onChange={(e) => setSeedInput(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-cyan-300 font-bold focus:outline-hidden"
                          />
                          <button
                            onClick={handleResetIncident}
                            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                          >
                            Apply Seed
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                        <span className="text-slate-400 font-bold">Random Seed Generator:</span>
                        <button
                          onClick={handleRandomSeed}
                          className="w-full py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2"
                        >
                          <Dices className="w-4 h-4" />
                          <span>Generate New Random Seed</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-[11px] space-y-1">
                      <strong className="text-purple-300">Replay Guarantee:</strong>
                      <p>
                        Executing with seed {seedInput} produces deterministic target responses, log outputs, and forensic artifacts for reproducible classroom and lab evaluations.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: COMPREHENSIVE INCIDENT QUIZ */}
          {activeTab === 'quiz' && (
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Case Assessment & Knowledge Check:
              </h3>
              <p className="text-sm font-semibold text-slate-200 font-mono">
                {currentIncident.quiz.question}
              </p>

              <div className="space-y-2">
                {currentIncident.quiz.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => {
                      setQuizSelected(oIdx);
                      setQuizFeedback(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-xs font-mono transition-all border ${
                      quizSelected === oIdx
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <span className="font-bold text-cyan-400 mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizSelected === null}
                  className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all"
                >
                  Submit Answer
                </button>

                {quizFeedback !== null && (
                  <div className={`text-xs font-mono flex items-center gap-2 ${
                    quizFeedback ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {quizFeedback ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>{quizFeedback ? 'Correct! (+75 XP)' : 'Incorrect. Review the incident briefing.'}</span>
                  </div>
                )}
              </div>

              {quizFeedback !== null && (
                <div className="p-3 rounded-lg bg-slate-950 text-xs font-mono text-slate-300 border border-slate-800">
                  {currentIncident.quiz.explanation}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AI INCIDENT DEBRIEF */}
          {activeTab === 'debrief' && (
            <div className="p-5 rounded-xl bg-slate-900/70 border border-purple-500/30 space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
                <Bot className="w-4 h-4" />
                <span>AI INCIDENT MENTOR DEBRIEF & SOC QUESTIONS</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-purple-300 font-mono font-bold block">1. Discovery Hypothesis:</span>
                  <p className="text-slate-300 font-sans">{currentIncident.aiDebrief.discoveryPrompt}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-purple-300 font-mono font-bold block">2. Root Cause Analysis:</span>
                  <p className="text-slate-300 font-sans">{currentIncident.aiDebrief.rootCausePrompt}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-purple-300 font-mono font-bold block">3. Forensic Evidence:</span>
                  <p className="text-slate-300 font-sans">{currentIncident.aiDebrief.evidencePrompt}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-purple-300 font-mono font-bold block">4. Strategic Defense:</span>
                  <p className="text-slate-300 font-sans">{currentIncident.aiDebrief.defensePrompt}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-purple-300 font-mono font-bold block">5. Key Takeaway:</span>
                  <p className="text-slate-300 font-sans">{currentIncident.aiDebrief.takeawayPrompt}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Boss Challenge Modal Trigger */}
      {activeBossModal && (
        <BossChallengeModal
          challenge={BOSS_CHALLENGES[2]} // Operation Nightfall IR Boss
          isOpen={activeBossModal}
          onClose={() => setActiveBossModal(false)}
        />
      )}
    </div>
  );
};
