import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Terminal,
  Network,
  Globe,
  Search,
  Zap,
  Lock,
  FolderGit2,
  Cpu,
  Activity,
  FileCheck2,
  AlertTriangle,
  Award,
  Sparkles,
  BarChart2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  knowledgeScore: number; // 0-100
  practicalScore: number; // 0-100
  evidenceScore: number;  // 0-100
  incidentScore: number;  // 0-100
  isWeakness: boolean;
  weaknessIndicator?: string;
  recommendedLabRoute: string;
}

export const SKILL_NODES_DATA: SkillNode[] = [
  { id: 'sk-linux', name: 'Linux System Administration', category: 'CORE', knowledgeScore: 85, practicalScore: 80, evidenceScore: 90, incidentScore: 75, isWeakness: false, recommendedLabRoute: '/linux-lab' },
  { id: 'sk-net', name: 'Networking & Subnetting', category: 'CORE', knowledgeScore: 90, practicalScore: 70, evidenceScore: 85, incidentScore: 80, isWeakness: true, weaknessIndicator: 'CIDR Notation & Variable-Length Subnet Masking', recommendedLabRoute: '/practice/subnetting' },
  { id: 'sk-web', name: 'Web Application Security (OWASP)', category: 'OFFENSIVE', knowledgeScore: 88, practicalScore: 82, evidenceScore: 95, incidentScore: 85, isWeakness: false, recommendedLabRoute: '/practice/web-security' },
  { id: 'sk-recon', name: 'Reconnaissance & Footprinting', category: 'OFFENSIVE', knowledgeScore: 92, practicalScore: 88, evidenceScore: 90, incidentScore: 90, isWeakness: false, recommendedLabRoute: '/network-lab' },
  { id: 'sk-enum', name: 'Service & OS Enumeration', category: 'OFFENSIVE', knowledgeScore: 80, practicalScore: 75, evidenceScore: 85, incidentScore: 78, isWeakness: false, recommendedLabRoute: '/network-lab' },
  { id: 'sk-exploit', name: 'Simulated Exploitation', category: 'OFFENSIVE', knowledgeScore: 78, practicalScore: 72, evidenceScore: 80, incidentScore: 70, isWeakness: false, recommendedLabRoute: '/live-incidents' },
  { id: 'sk-privesc', name: 'Privilege Escalation (SUID/Kernel)', category: 'OFFENSIVE', knowledgeScore: 82, practicalScore: 76, evidenceScore: 88, incidentScore: 75, isWeakness: false, recommendedLabRoute: '/linux-lab' },
  { id: 'sk-ad', name: 'Active Directory Security', category: 'ENTERPRISE', knowledgeScore: 65, practicalScore: 60, evidenceScore: 70, incidentScore: 55, isWeakness: true, weaknessIndicator: 'Kerberoasting & Ticket Extraction', recommendedLabRoute: '/live-incidents?id=live-inc-01' },
  { id: 'sk-cloud', name: 'Cloud Infrastructure (AWS/IAM)', category: 'ENTERPRISE', knowledgeScore: 70, practicalScore: 65, evidenceScore: 75, incidentScore: 60, isWeakness: false, recommendedLabRoute: '/live-incidents?id=live-inc-01' },
  { id: 'sk-soc', name: 'SOC Monitoring & SIEM Triage', category: 'DEFENSIVE', knowledgeScore: 86, practicalScore: 84, evidenceScore: 92, incidentScore: 88, isWeakness: false, recommendedLabRoute: '/practice/soc-simulator' },
  { id: 'sk-dfir', name: 'Digital Forensics & Incident Response', category: 'DEFENSIVE', knowledgeScore: 80, practicalScore: 78, evidenceScore: 94, incidentScore: 82, isWeakness: false, recommendedLabRoute: '/investigation-board' },
  { id: 'sk-threathunt', name: 'Threat Hunting & Log Analysis', category: 'DEFENSIVE', knowledgeScore: 84, practicalScore: 80, evidenceScore: 88, incidentScore: 86, isWeakness: false, recommendedLabRoute: '/practice/threat-hunting' },
  { id: 'sk-python', name: 'Python Security Scripting', category: 'AUTOMATION', knowledgeScore: 75, practicalScore: 70, evidenceScore: 78, incidentScore: 72, isWeakness: false, recommendedLabRoute: '/practice/security-tools' },
  { id: 'sk-auto', name: 'Security Automation & Orchestration', category: 'AUTOMATION', knowledgeScore: 72, practicalScore: 68, evidenceScore: 74, incidentScore: 65, isWeakness: false, recommendedLabRoute: '/practice/security-tools' },
  { id: 'sk-reporting', name: 'Executive Security Reporting', category: 'PROFESSIONAL', knowledgeScore: 94, practicalScore: 90, evidenceScore: 96, incidentScore: 92, isWeakness: false, recommendedLabRoute: '/security-report' }
];

export const CybersecuritySkillGraph: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(SKILL_NODES_DATA[1]); // Networking default

  const overallScore = Math.round(
    SKILL_NODES_DATA.reduce((acc, s) => acc + (s.knowledgeScore + s.practicalScore + s.evidenceScore + s.incidentScore) / 4, 0) / SKILL_NODES_DATA.length
  );

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase">
              15-CATEGORY COMPETENCY ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">Live Skill Telemetry</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2 mt-1">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <span>Cybersecurity Master Skill Graph</span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <span className="text-slate-400">Overall Mastery: </span>
            <strong className="text-emerald-400 text-sm">{overallScore}%</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 15 Skill Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SKILL_NODES_DATA.map((skill) => {
            const avg = Math.round((skill.knowledgeScore + skill.practicalScore + skill.evidenceScore + skill.incidentScore) / 4);
            const isSelected = selectedSkill.id === skill.id;

            return (
              <button
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`p-3.5 rounded-xl border text-left transition-all space-y-2 relative ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/40'
                    : skill.isWeakness
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                {skill.isWeakness && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">{skill.category}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{avg}%</span>
                </div>

                <div className="font-mono text-xs font-bold text-slate-100 truncate">{skill.name}</div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${skill.isWeakness ? 'bg-amber-400' : 'bg-cyan-400'}`}
                    style={{ width: `${avg}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Skill Detail Inspector */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{selectedSkill.category} CATEGORY</span>
            <h4 className="text-base font-mono font-bold text-slate-100">{selectedSkill.name}</h4>
          </div>

          {/* 4 Score Dimensions */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Knowledge Score:</span>
              <span className="text-slate-200 font-bold">{selectedSkill.knowledgeScore}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedSkill.knowledgeScore}%` }} />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Practical Score:</span>
              <span className="text-slate-200 font-bold">{selectedSkill.practicalScore}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${selectedSkill.practicalScore}%` }} />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Evidence Score:</span>
              <span className="text-slate-200 font-bold">{selectedSkill.evidenceScore}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedSkill.evidenceScore}%` }} />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Incident Score:</span>
              <span className="text-slate-200 font-bold">{selectedSkill.incidentScore}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${selectedSkill.incidentScore}%` }} />
            </div>
          </div>

          {selectedSkill.isWeakness && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1 text-xs">
              <div className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>IDENTIFIED SKILL GAP</span>
              </div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                {selectedSkill.weaknessIndicator}
              </p>
            </div>
          )}

          <button
            onClick={() => navigate(selectedSkill.recommendedLabRoute)}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Practice {selectedSkill.name.split(' ')[0]} Module</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
