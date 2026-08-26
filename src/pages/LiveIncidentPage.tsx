import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LIVE_INCIDENT_SCENARIOS, LiveIncidentScenario } from '../data/liveIncidentsData';
import { ThinkLikeAnEthicalHackerEngine } from '../components/ethical-hacker/ThinkLikeAnEthicalHackerEngine';
import { AdaptiveHintSystem } from '../components/common/AdaptiveHintSystem';
import { StatefulIncidentWorkspace } from '../components/live-incidents/StatefulIncidentWorkspace';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Clock,
  Target,
  FileCheck2,
  Terminal,
  Activity,
  Layers,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Zap,
  Lock,
  Search,
  BookOpen,
  FolderGit2,
  Brain,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LiveIncidentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const incidentUrlId = searchParams.get('id');

  const { addXp, completeMission, addNotebookNote } = useApp();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidentUrlId || 'live-inc-01');
  const [activeTab, setActiveTab] = useState<'workspace' | 'briefing' | 'scope' | 'evidence' | 'hypothesis' | 'hints'>('workspace');
  const [hintMultiplier, setHintMultiplier] = useState<number>(1.0);

  useEffect(() => {
    if (incidentUrlId && LIVE_INCIDENT_SCENARIOS.some(i => i.id === incidentUrlId)) {
      setSelectedIncidentId(incidentUrlId);
    }
  }, [incidentUrlId]);

  const activeIncident = LIVE_INCIDENT_SCENARIOS.find(i => i.id === selectedIncidentId) || LIVE_INCIDENT_SCENARIOS[0];

  const handleLaunchCyberRange = () => {
    navigate(`/master-cyber-range?org=${activeIncident.targetOrgId}&incident=${activeIncident.id}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-500/40 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-red-950 text-red-400 border border-red-500/50 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                <span>LIVE INCIDENT MODE</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                UNSOLVED INCIDENT BRIEFINGS & SPREAD ANALYSIS
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 tracking-tight flex items-center gap-3">
              <span>{activeIncident.code}:</span>
              <span className="text-red-400">{activeIncident.title}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              You are deployed as lead responder. Rather than a guided tutorial, you are given authorized scope, rules of engagement, and raw log telemetry. You must investigate the incident, test hypotheses, gather evidence, escalate access, and enforce defensive controls.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleLaunchCyberRange}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shadow-xl hover:shadow-red-500/30 flex items-center justify-center gap-2 group"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Cyber Range Investigation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Incident Selector Bar */}
      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {LIVE_INCIDENT_SCENARIOS.map((inc) => {
            const isSelected = inc.id === selectedIncidentId;
            return (
              <button
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className={`px-4 py-2.5 rounded-lg font-mono text-xs transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-red-950 text-red-300 border border-red-500/50 shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <ShieldAlert className={`w-3.5 h-3.5 ${isSelected ? 'text-red-400' : 'text-slate-500'}`} />
                <div className="text-left">
                  <div className="font-bold text-[11px]">{inc.code}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{inc.organization}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Overview & Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Incident Briefing & Socratic Engine */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'workspace' ? 'bg-red-950 text-red-300 border border-red-500/50 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              <span>Stateful Reconstruction Workspace</span>
            </button>
            <button
              onClick={() => setActiveTab('briefing')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'briefing' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Executive Briefing</span>
            </button>
            <button
              onClick={() => setActiveTab('scope')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'scope' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authorized Scope & RoE</span>
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'evidence' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Initial Telemetry Logs</span>
            </button>
          </div>

          {/* Tab 0: Stateful Reconstruction Workspace */}
          {activeTab === 'workspace' && (
            <StatefulIncidentWorkspace incidentId={selectedIncidentId} />
          )}

          {/* Tab 1: Briefing */}
          {activeTab === 'briefing' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase">TARGET ORGANIZATION</span>
                    <h3 className="text-lg font-bold font-mono text-slate-100">{activeIncident.organization}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono font-bold">
                      {activeIncident.industry}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-500/40 text-xs font-mono font-bold">
                      Difficulty: {activeIncident.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    EXECUTIVE BRIEFING
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {activeIncident.briefing}
                  </p>
                </div>

                {/* Raw Log Excerpt */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    <span>INITIAL SIEM ALERT LOG STREAM</span>
                  </h4>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto custom-scrollbar leading-relaxed">
                    {activeIncident.initialLogExcerpt}
                  </pre>
                </div>
              </div>

              {/* Think Like an Ethical Hacker Engine Embedded */}
              <ThinkLikeAnEthicalHackerEngine
                scenarioTitle={`${activeIncident.code} - ${activeIncident.title}`}
                targetScope={activeIncident.authorizedScope}
              />
            </div>
          )}

          {/* Tab 2: Authorized Scope & Rules of Engagement */}
          {activeTab === 'scope' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Authorized Scope */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold border-b border-slate-800 pb-3">
                    <Target className="w-4 h-4" />
                    <span>AUTHORIZED SCOPE</span>
                  </div>
                  <ul className="space-y-2">
                    {activeIncident.authorizedScope.map((scope, idx) => (
                      <li key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs font-mono text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{scope}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rules of Engagement */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold border-b border-slate-800 pb-3">
                    <ShieldAlert className="w-4 h-4" />
                    <span>RULES OF ENGAGEMENT (RoE)</span>
                  </div>
                  <ul className="space-y-2">
                    {activeIncident.rulesOfEngagement.map((roe, idx) => (
                      <li key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs font-mono text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                        <span>{roe}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Restrictions */}
              <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ENGAGEMENT RESTRICTIONS & SAFETY BOUNDARIES</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeIncident.restrictions.map((res, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-red-200 leading-relaxed">
                      ❌ {res}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Initial Telemetry Logs */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              {activeIncident.initialEvidence.map((ev) => (
                <div key={ev.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">{ev.type}</span>
                      <h4 className="text-sm font-bold font-mono text-slate-100">{ev.title}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-mono text-[10px]">
                      MITRE: {ev.mitreTechnique}
                    </span>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    {ev.rawContent}
                  </pre>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-850">
                    <div><strong className="text-slate-300">Analyst Note:</strong> {ev.analystNote}</div>
                    <div className="text-[10px] text-slate-500">SHA-256: {ev.sha256.substring(0, 16)}...</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Hypothesis Form */}
          {activeTab === 'hypothesis' && (
            <ThinkLikeAnEthicalHackerEngine
              scenarioTitle={`${activeIncident.code} - ${activeIncident.title}`}
              targetScope={activeIncident.authorizedScope}
            />
          )}

          {/* Adaptive Hint System */}
          <AdaptiveHintSystem
            hints={activeIncident.hints}
            onHintLevelChanged={(lvl, mult) => setHintMultiplier(mult)}
          />
        </div>

        {/* Right Column (4 cols): Known/Unknown Assets & MITRE Checklist */}
        <div className="lg:col-span-4 space-y-6">
          {/* Incident Status Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300">INCIDENT METRICS</span>
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 font-mono text-[10px] font-bold">
                TIMED MISSION
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">TIME PRESSURE</div>
                <div className="text-lg font-mono font-bold text-amber-400">{activeIncident.timePressureMinutes} min</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">SCORE MULTIPLIER</div>
                <div className="text-lg font-mono font-bold text-emerald-400">{(hintMultiplier * 100).toFixed(0)}%</div>
              </div>
            </div>

            <button
              onClick={handleLaunchCyberRange}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Cyber Range Workspace</span>
            </button>
          </div>

          {/* Asset Discovery Matrix */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300">KNOWN vs UNKNOWN ASSETS</span>
              <span className="text-[10px] font-mono text-cyan-400">
                {activeIncident.knownAssets.length} Known / {activeIncident.unknownAssetsCount} Hidden
              </span>
            </div>

            <div className="space-y-2">
              {activeIncident.knownAssets.map((asset, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300">{asset.host}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{asset.ip}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{asset.role}</div>
                  <div className="text-[10px] font-mono text-amber-400">{asset.status}</div>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-xs font-mono text-slate-500">
                + {activeIncident.unknownAssetsCount} Unknown hosts to be discovered via Recon
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Objectives Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300">INCIDENT OBJECTIVES</span>
              <span className="text-[10px] font-mono text-purple-400">MITRE MAPPED</span>
            </div>

            <div className="space-y-3">
              {activeIncident.objectives.map((obj) => (
                <div key={obj.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-mono font-bold text-slate-200">{obj.title}</h5>
                    <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[9px] font-mono shrink-0">
                      {obj.mitreTechnique.split(' - ')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{obj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
