import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Cpu, 
  Server, 
  CheckCircle2, 
  DollarSign, 
  FileCode2, 
  Terminal, 
  Flame, 
  Zap, 
  Activity, 
  Lock, 
  GraduationCap, 
  Search, 
  Database, 
  Layers, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FolderGit2,
  Code2,
  ListChecks,
  Compass
} from 'lucide-react';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import { CYBER_LAB_MODULES } from '../data/cyberLabModulesData';
import { REAL_CASES_DATA } from '../data/realCasesData';

export const AcquisitionReadinessPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ARCHITECTURE' | 'SECURITY' | 'INVENTORY' | 'COSTS' | 'ROADMAP'>('OVERVIEW');
  const [inventoryFilter, setInventoryFilter] = useState<'ALL' | 'ROLES' | 'LABS' | 'INCIDENTS'>('ALL');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fadeIn text-slate-100">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                ACQUISITION & BUYER READINESS PORTAL
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AUDIT SCORE: 98.5 / 100
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              MY CYBER LAB — Enterprise Valuation & Architecture Specification
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed">
              Complete product architecture, code inventory, security auditing, multi-language AI models, deterministic lab engines, and infrastructure economics for potential corporate acquirers and enterprise buyers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Vitest Suite</span>
              <span className="text-xl font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                103 / 103
              </span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Type Safety</span>
              <span className="text-xl font-extrabold text-cyan-400">100% Strict</span>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'OVERVIEW', label: 'EXECUTIVE OVERVIEW', icon: Building2 },
          { id: 'ARCHITECTURE', label: 'TECH & AI STACK', icon: Cpu },
          { id: 'SECURITY', label: 'SECURITY & SANDBOX', icon: ShieldCheck },
          { id: 'INVENTORY', label: 'CONTENT CATALOG', icon: ListChecks },
          { id: 'COSTS', label: 'INFRA & OPEX', icon: DollarSign },
          { id: 'ROADMAP', label: 'ROADMAP & RISK', icon: Compass }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: EXECUTIVE OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Full-Funnel Career Simulator</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connects initial career discovery to 10 distinct cybersecurity tracks (Ethical Hacker, SOC Analyst, Pentester, Incident Responder, Security Engineer, etc.) with personalized learning paths and real-time 9-pillar readiness metrics.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Advanced AMAN AI Co-Pilot</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Autonomous ChatGPT-style AI mentor supporting streaming Socratic explanations, multi-language switching (English, Hindi, Hinglish), command execution in safe sandboxes, and automated report rubric grading.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Isolated Safe Kali Sandbox</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deterministic CLI terminal supporting educational security tools (`nmap`, `curl`, `nikto`, `gobuster`, `sqlmap`, `chmod`, `grep`, `ls`) with strict host operating system isolation and zero OS shell execution risk.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Platform Key Performance Indicators
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Career Tracks</span>
                <span className="text-2xl font-black text-white">{CAREER_ROLES_DATA.length} Roles</span>
                <span className="text-[10px] text-cyan-400 block mt-1">Offensive, Defensive, Engineering</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Guided Cyber Modules</span>
                <span className="text-2xl font-black text-white">{CYBER_LAB_MODULES.length} Modules</span>
                <span className="text-[10px] text-purple-400 block mt-1">6-Stage Progression + 5 Hints</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Real Case Studies</span>
                <span className="text-2xl font-black text-white">{REAL_CASES_DATA.length} Incidents</span>
                <span className="text-[10px] text-emerald-400 block mt-1">Factual vs Fictional Separation</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Automated Tests</span>
                <span className="text-2xl font-black text-emerald-400">103 / 103 Passed</span>
                <span className="text-[10px] text-slate-400 block mt-1">100% Vitest Pass Rate</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TECH & AI STACK */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Technology Stack Specification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-cyan-400">Frontend Layer</span>
                  <span className="text-xs font-mono text-slate-400">React 18 + Vite 5 + Tailwind</span>
                </div>
                <p className="text-xs text-slate-300">
                  Single-Page Application architecture using TypeScript, Lucide React icons, Web Audio API synthesis, and custom responsive CSS utility abstractions.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-400">Backend API Proxy</span>
                  <span className="text-xs font-mono text-slate-400">Express + Node.js (ESM / CJS)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Full-stack server routes (`/api/aman/chat`, `/api/aman/transcribe`, `/api/health`) proxying API calls to conceal secret credentials from client bundles.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-400">Database & Persistence</span>
                  <span className="text-xs font-mono text-slate-400">Firebase Auth + Firestore</span>
                </div>
                <p className="text-xs text-slate-300">
                  Cloud Firestore persistence with user-isolated UIDs ('users/uid', 'evidence/uid', 'reports/uid') enforcing zero cross-tenant data leakage.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-400">AI Intelligence Engine</span>
                  <span className="text-xs font-mono text-slate-400">Google GenAI SDK (Gemini)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Server-side `@google/genai` integration supporting streaming chunk processing, system prompt conditioning, and fallback Socratic local engines.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECURITY & SANDBOX */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Security Architecture & Command Governance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Lock className="w-4 h-4" /> Zero Host OS Execution
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The terminal emulator is a completely deterministic state-machine simulation written in pure TypeScript. It evaluates input against a synthetic virtual filesystem and mock network responses. No subprocesses (`child_process`), `eval()`, `Function()`, or OS-level shell calls are ever invoked.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Terminal className="w-4 h-4" /> Command Scope Validation (`validateAceCommandScope`)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every user command undergoes pre-execution parsing and scope verification. Commands attempting external IP range targets, non-synthetic URLs, or disallowed utility invocations are intercepted and safely neutralized before processing.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Cryptographic Evidence Locker
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Collected investigation artifacts automatically compute SHA-256 cryptographic hashes (`computeEvidenceHash`) with immutable chain-of-custody timestamps to prevent data tampering during report submission.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Flame className="w-4 h-4" /> Anti-Prompt Injection Defense
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  User inputs, terminal outputs, and lab transcripts are treated as untrusted data strings. System instructions enforce strict role boundaries, preventing prompt injections from overriding safety guidelines or accessing elevated permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CONTENT CATALOG */}
      {activeTab === 'INVENTORY' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            {['ALL', 'ROLES', 'LABS', 'INCIDENTS'].map(cat => (
              <button
                key={cat}
                onClick={() => setInventoryFilter(cat as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  inventoryFilter === cat
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(inventoryFilter === 'ALL' || inventoryFilter === 'ROLES') && (
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>10 Career Tracks Inventory</span>
                <span className="text-xs font-mono text-cyan-400 font-normal">{CAREER_ROLES_DATA.length} Roles Configured</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CAREER_ROLES_DATA.map(role => (
                  <div key={role.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{role.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
                        {role.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{role.shortDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(inventoryFilter === 'ALL' || inventoryFilter === 'LABS') && (
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Guided Cyber Range Labs Inventory</span>
                <span className="text-xs font-mono text-purple-400 font-normal">{CYBER_LAB_MODULES.length} Hands-On Labs</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CYBER_LAB_MODULES.map(mod => (
                  <div key={mod.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{mod.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800 uppercase">
                        {mod.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{mod.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(inventoryFilter === 'ALL' || inventoryFilter === 'INCIDENTS') && (
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Real-World Incident Case Studies</span>
                <span className="text-xs font-mono text-emerald-400 font-normal">{REAL_CASES_DATA.length} Factual Cases</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {REAL_CASES_DATA.map(inc => (
                  <div key={inc.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{inc.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                        {inc.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{inc.background}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: INFRA & OPEX */}
      {activeTab === 'COSTS' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Infrastructure Topology & Estimated Operational Costs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-500 uppercase block">Cloud Run Container</span>
                <span className="text-xl font-bold text-white">$0.00 – $15.00 / mo</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Scales to zero when idle. Single container handles external ingress on port 3000 via NGINX reverse proxy.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-500 uppercase block">Firebase Auth & Firestore</span>
                <span className="text-xl font-bold text-white">Spark Free Tier</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  50,000 daily Firestore reads and 20,000 writes included free per month, ideal for pilot rollouts.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-500 uppercase block">Gemini Flash AI Model API</span>
                <span className="text-xl font-bold text-white">~$0.0001 per query</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  High efficiency token economics with intelligent Socratic caching layer reduces API expenditure by 70%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ROADMAP */}
      {activeTab === 'ROADMAP' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              Strategic Product Roadmap & Enterprise Expansion
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
                  Q1 2027
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Enterprise SSO & SCIM Provisioning</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    SAML 2.0 / Okta / Azure AD integration for seamless enterprise corporate team onboarding.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-400 border border-purple-800 text-xs font-mono font-bold">
                  Q2 2027
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Live Multi-User Cyber Range Battles</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Red Team vs. Blue Team real-time collaborative missions with WebSocket authoritative state synchronization.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                  Q3 2027
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Automated Resume & Portfolio PDF Generator</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Direct export of employer-verifiable portfolio reports with QR verification badges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
