import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LABS_DATA } from '../data/labsData';
import { PRACTICE_LABS_HUB_DATA, PracticeLab } from '../data/practiceLabsData';
import { IncidentLabEngine } from '../components/IncidentLabEngine';
import { PracticeLabRunnerModal } from '../components/labs/PracticeLabRunnerModal';
import { 
  Terminal, 
  Shield, 
  Crosshair, 
  Search, 
  Filter, 
  Clock, 
  Award, 
  Sparkles, 
  Play, 
  Layers, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  Code,
  Zap,
  Globe,
  Radio,
  FileCode
} from 'lucide-react';

export const LabsPage: React.FC = () => {
  const { activeCareerTrack, setActiveCareerTrack, profile } = useApp();
  const [labMode, setLabMode] = useState<'PRACTICE_RANGE' | 'INCIDENT_LABS'>('PRACTICE_RANGE');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalLab, setActiveModalLab] = useState<PracticeLab | null>(null);

  // Incident Labs state
  const incidentLabs = LABS_DATA.filter(l => l.careerTrack === activeCareerTrack);
  const [selectedIncidentLabId, setSelectedIncidentLabId] = useState<string | null>(incidentLabs[0]?.id || null);
  const selectedIncidentLab = incidentLabs.find(l => l.id === selectedIncidentLabId);

  // Filter Practice Labs
  const filteredPracticeLabs = useMemo(() => {
    return PRACTICE_LABS_HUB_DATA.filter(lab => {
      const matchesCat = selectedCategory === 'ALL' || lab.category === selectedCategory;
      const matchesDiff = selectedDifficulty === 'ALL' || lab.difficulty.toUpperCase() === selectedDifficulty;
      const matchesSearch = 
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lab.availableTools && lab.availableTools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCat && matchesDiff && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const categories = [
    'ALL',
    'LINUX SECURITY',
    'NETWORK SECURITY',
    'WEB SECURITY',
    'PYTHON SECURITY AUTOMATION',
    'SOC / DETECTION',
    'ACTIVE DIRECTORY',
    'CLOUD SECURITY',
    'PRIVILEGE ESCALATION',
    'THREAT HUNTING',
    'DIGITAL FORENSICS',
    'CRYPTOGRAPHY'
  ];

  return (
    <div id="labs-page" className="space-y-6 pb-16">
      
      {/* HEADER HERO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-cyan-400" />
                VIRTUAL SANDBOX CYBER RANGE
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                • {PRACTICE_LABS_HUB_DATA.length} GUIDED SANDBOXES
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-mono font-bold text-white">
              Interactive Cybersecurity Labs
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Practice real-world offensive techniques, system hardening, and threat investigation in isolated terminal sandboxes.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center shrink-0 self-start sm:self-auto font-mono text-xs">
            <button
              onClick={() => setLabMode('PRACTICE_RANGE')}
              className={`px-4 py-2 rounded-xl transition-all font-bold flex items-center gap-2 cursor-pointer ${
                labMode === 'PRACTICE_RANGE'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Full Practice Range</span>
            </button>

            <button
              onClick={() => setLabMode('INCIDENT_LABS')}
              className={`px-4 py-2 rounded-xl transition-all font-bold flex items-center gap-2 cursor-pointer ${
                labMode === 'INCIDENT_LABS'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Role Scenario Labs</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        {labMode === 'PRACTICE_RANGE' && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search labs by tool (nmap, curl, find), topic (SQLi, SUID, SIEM), or objective..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Difficulty filter */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-[11px]">
                {['ALL', 'BEGINNER', 'INTERMEDIATE', 'HARD'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-slate-800 text-cyan-400 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-slate-950/70 border border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: PRACTICE RANGE GRID */}
      {labMode === 'PRACTICE_RANGE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPracticeLabs.map((lab) => {
            const isBeginner = lab.difficulty.toLowerCase() === 'beginner';
            const isIntermediate = lab.difficulty.toLowerCase() === 'intermediate';
            
            return (
              <div
                key={lab.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 group hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                      {lab.category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isBeginner 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                        : isIntermediate
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}>
                      {lab.difficulty}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {lab.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                      {lab.objective}
                    </p>
                  </div>

                  {/* Environment & Tools Info */}
                  <div className="space-y-2 pt-1 font-mono text-[11px]">
                    <div className="text-slate-400 flex items-center gap-1.5">
                      <span className="text-slate-500">Host:</span>
                      <span className="text-slate-200">{lab.targetEnvironment.hostName}</span>
                      <span className="text-cyan-400">({lab.targetEnvironment.ipAddress})</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {lab.availableTools.map((tool, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Clock className="w-3.5 h-3.5" />
                      {lab.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Award className="w-3.5 h-3.5" />
                      +{lab.xpReward} XP
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveModalLab(lab)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-cyan-300" />
                    <span>Launch Lab</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: INCIDENT ROLE LABS */}
      {labMode === 'INCIDENT_LABS' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
              Active Track: {activeCareerTrack === 'ETHICAL_HACKER' ? 'Ethical Hacker' : 'SOC Analyst'}
            </h3>
            {incidentLabs.map(lab => (
              <button 
                key={lab.id}
                onClick={() => setSelectedIncidentLabId(lab.id)}
                className={`w-full text-left p-3 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedIncidentLabId === lab.id 
                    ? 'bg-cyan-950 border border-cyan-500/50 text-white font-bold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-slate-200">{lab.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">{lab.difficulty} • +{lab.xp} XP</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            {selectedIncidentLab ? (
              <IncidentLabEngine currentLab={selectedIncidentLab} />
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 font-mono text-xs">
                Select a lab scenario to begin.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL LAB RUNNER */}
      {activeModalLab && (
        <PracticeLabRunnerModal
          lab={activeModalLab}
          onClose={() => setActiveModalLab(null)}
        />
      )}

    </div>
  );
};
