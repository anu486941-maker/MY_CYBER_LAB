import React, { useState } from 'react';
import {
  GitBranch,
  Globe,
  Server,
  Terminal,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Brain,
  Zap,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface DecisionNode {
  id: string;
  title: string;
  category: 'RECON' | 'ENUMERATION' | 'EXPLOITATION' | 'PRIV_ESC' | 'EXFILTRATION';
  description: string;
  siemNoiseLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isOptimal: boolean;
  explanation: string;
  children?: DecisionNode[];
}

export const ATTACK_DECISION_TREES: Record<string, DecisionNode> = {
  'port-80': {
    id: 'node-port-80',
    title: 'PORT 80 (HTTP Web Application)',
    category: 'RECON',
    description: 'Discovered listening HTTP web server on port 80.',
    siemNoiseLevel: 'LOW',
    isOptimal: true,
    explanation: 'Standard web application service exposed to DMZ.',
    children: [
      {
        id: 'node-tech-fingerprint',
        title: 'Option A: Technology & Header Fingerprinting',
        category: 'ENUMERATION',
        description: 'Inspect HTTP response headers (Server, X-Powered-By) and WAF presence.',
        siemNoiseLevel: 'LOW',
        isOptimal: true,
        explanation: 'Low-noise passive enumeration establishing framework versions before injection.',
        children: [
          {
            id: 'node-api-inspect',
            title: 'Sub-Path: API Endpoint Analysis (/api/v1/customer)',
            category: 'ENUMERATION',
            description: 'Inspect JSON API endpoints and parameter structures.',
            siemNoiseLevel: 'LOW',
            isOptimal: true,
            explanation: 'Identifies unauthenticated parameters for SQLi/IDOR testing.',
            children: [
              {
                id: 'node-sqli-test',
                title: 'Action: Parameterized SQLi Proof',
                category: 'EXPLOITATION',
                description: 'Test single quote and union select on customer ID parameter.',
                siemNoiseLevel: 'MEDIUM',
                isOptimal: true,
                explanation: 'Directly yields database records with minimal bandwidth impact.'
              }
            ]
          }
        ]
      },
      {
        id: 'node-dir-fuzz-noisy',
        title: 'Option B: Aggressive Directory Fuzzing (10,000 req/sec)',
        category: 'ENUMERATION',
        description: 'Launch heavy dirbuster dictionary scan without rate limiting.',
        siemNoiseLevel: 'CRITICAL',
        isOptimal: false,
        explanation: 'Generates thousands of 404 log entries, immediately alerting Blue Team SIEM rules.',
        children: [
          {
            id: 'node-waf-block',
            title: 'Outcome: WAF Auto-Ban Activated',
            category: 'EXPLOITATION',
            description: 'IP blocked for 30 minutes by defensive rate limiting.',
            siemNoiseLevel: 'CRITICAL',
            isOptimal: false,
            explanation: 'Suboptimal attack path resulting in operational lockout.'
          }
        ]
      }
    ]
  },
  'port-445': {
    id: 'node-port-445',
    title: 'PORT 445 (SMB File Sharing)',
    category: 'RECON',
    description: 'Discovered active SMB listener on port 445.',
    siemNoiseLevel: 'LOW',
    isOptimal: true,
    explanation: 'Windows Server Message Block file share service.',
    children: [
      {
        id: 'node-smb-enum',
        title: 'Option A: Null Session & Anonymous Share Audit',
        category: 'ENUMERATION',
        description: 'Check for unauthenticated IPC$ or public shares using smbclient / enum4linux.',
        siemNoiseLevel: 'LOW',
        isOptimal: true,
        explanation: 'Passive share inspection without attempting invalid password spraying.',
        children: [
          {
            id: 'node-kerberoast',
            title: 'Sub-Path: Service Account SPN Enumeration',
            category: 'EXPLOITATION',
            description: 'Extract service accounts with SPNs registered for offline Kerberoasting.',
            siemNoiseLevel: 'MEDIUM',
            isOptimal: true,
            explanation: 'Optimal Kerberoasting vector yielding offline crackable hashes.'
          }
        ]
      },
      {
        id: 'node-pass-spray-noisy',
        title: 'Option B: Password Spray (1,000 passwords across all domain accounts)',
        category: 'EXPLOITATION',
        description: 'Attempt dictionary login on domain controller.',
        siemNoiseLevel: 'CRITICAL',
        isOptimal: false,
        explanation: 'Triggers EventID 4740 (Account Lockout) across 50 domain accounts.',
        children: [
          {
            id: 'node-lockout-trigger',
            title: 'Outcome: Domain Account Lockout Triggered',
            category: 'EXPLOITATION',
            description: 'Blue Team alerted immediately; sysadmins lock down domain.',
            siemNoiseLevel: 'CRITICAL',
            isOptimal: false,
            explanation: 'High-noise path resulting in immediate detection.'
          }
        ]
      }
    ]
  }
};

interface AttackerDecisionTreeProps {
  initialTreeKey?: 'port-80' | 'port-445';
  onPathSelected?: (node: DecisionNode) => void;
}

export const AttackerDecisionTree: React.FC<AttackerDecisionTreeProps> = ({
  initialTreeKey = 'port-80',
  onPathSelected
}) => {
  const { addXp } = useApp();
  const [selectedTreeKey, setSelectedTreeKey] = useState<'port-80' | 'port-445'>(initialTreeKey);
  const [activePath, setActivePath] = useState<DecisionNode[]>([ATTACK_DECISION_TREES[initialTreeKey]]);

  const currentRoot = ATTACK_DECISION_TREES[selectedTreeKey];
  const currentNode = activePath[activePath.length - 1];

  const handleSelectChild = (childNode: DecisionNode) => {
    setActivePath(prev => [...prev, childNode]);
    if (childNode.isOptimal) {
      addXp(25);
    }
    if (onPathSelected) {
      onPathSelected(childNode);
    }
  };

  const handleResetPath = () => {
    setActivePath([ATTACK_DECISION_TREES[selectedTreeKey]]);
  };

  const handleSwitchTree = (key: 'port-80' | 'port-445') => {
    setSelectedTreeKey(key);
    setActivePath([ATTACK_DECISION_TREES[key]]);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100">
              Attacker Branching Decision Tree
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Evaluate optimal vs high-noise attack vectors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSwitchTree('port-80')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedTreeKey === 'port-80' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            Port 80 Web App
          </button>
          <button
            onClick={() => handleSwitchTree('port-445')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedTreeKey === 'port-445' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            Port 445 SMB / AD
          </button>
        </div>
      </div>

      {/* Active Breadcrumb Trail */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {activePath.map((node, idx) => (
          <React.Fragment key={node.id}>
            {idx > 0 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
            <div className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold shrink-0 flex items-center gap-1.5 border ${
              node.isOptimal
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                : 'bg-red-950 text-red-300 border-red-500/40'
            }`}>
              <span>{node.title.split(':')[0]}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Current Step Overview */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              currentNode.isOptimal
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-950 text-red-300 border border-red-500/30'
            }`}>
              {currentNode.isOptimal ? 'OPTIMAL STEALTH PATH' : 'SUBOPTIMAL / HIGH NOISE'}
            </span>
            <span className="text-xs font-mono text-slate-400">SIEM Noise Level:</span>
            <span className={`text-xs font-mono font-bold ${
              currentNode.siemNoiseLevel === 'CRITICAL' ? 'text-red-400' :
              currentNode.siemNoiseLevel === 'HIGH' ? 'text-amber-400' :
              currentNode.siemNoiseLevel === 'MEDIUM' ? 'text-cyan-400' : 'text-emerald-400'
            }`}>
              {currentNode.siemNoiseLevel}
            </span>
          </div>

          {activePath.length > 1 && (
            <button
              onClick={handleResetPath}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 underline"
            >
              Reset Tree
            </button>
          )}
        </div>

        <h4 className="text-sm font-bold font-mono text-slate-100">{currentNode.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentNode.description}</p>
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
          <strong>Tactical Evaluation:</strong> {currentNode.explanation}
        </div>
      </div>

      {/* Branch Choices */}
      {currentNode.children && currentNode.children.length > 0 ? (
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            CHOOSE NEXT INVESTIGATIVE DIRECTION:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentNode.children.map((child) => (
              <button
                key={child.id}
                onClick={() => handleSelectChild(child)}
                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] space-y-2 ${
                  child.isOptimal
                    ? 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                    : 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-red-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    child.isOptimal ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                  }`}>
                    {child.isOptimal ? 'STEALTH PATH' : 'HIGH-NOISE PATH'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    SIEM Noise: {child.siemNoiseLevel}
                  </span>
                </div>

                <div className="font-mono text-xs font-bold text-slate-100">{child.title}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed font-sans">{child.description}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center text-xs font-mono text-emerald-200 space-y-2">
          <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
          <div className="font-bold">BRANCH TERMINAL OUTCOME REACHED</div>
          <p className="text-slate-300 text-[11px]">
            You have navigated this decision branch to its final resolution.
          </p>
        </div>
      )}
    </div>
  );
};
