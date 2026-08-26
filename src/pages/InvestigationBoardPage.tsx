import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Network,
  Server,
  Terminal,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Link,
  ArrowRight,
  Download,
  Share2,
  Bot,
  Zap,
  HelpCircle,
  Cpu
} from 'lucide-react';

interface InvestigationNode {
  id: string;
  type: 'Host' | 'IP' | 'Port' | 'Service' | 'Vulnerability' | 'Evidence' | 'Impact' | 'Remediation';
  label: string;
  detail: string;
  status: 'unverified' | 'investigating' | 'confirmed' | 'mitigated';
  confidence: number;
}

interface InvestigationEdge {
  id: string;
  from: string;
  to: string;
  relation: string;
}

export const InvestigationBoardPage: React.FC = () => {
  const { addXp, addNotebookNote } = useApp();

  const [nodes, setNodes] = useState<InvestigationNode[]>([
    { id: 'n1', type: 'Host', label: 'prod-gateway-01', detail: 'External Perimeter Application Server', status: 'confirmed', confidence: 100 },
    { id: 'n2', type: 'IP', label: '198.51.100.25', detail: 'Public Facing VIP', status: 'confirmed', confidence: 100 },
    { id: 'n3', type: 'Port', label: '443/TCP (HTTPS)', detail: 'TLS Encrypted Web Interface', status: 'confirmed', confidence: 100 },
    { id: 'n4', type: 'Service', label: 'Apache Struts 2.3.x', detail: 'Legacy Enterprise REST backend', status: 'confirmed', confidence: 95 },
    { id: 'n5', type: 'Vulnerability', label: 'CVE-2017-5638 (OGNL RCE)', detail: 'Unauthenticated Remote Code Execution in Content-Type header', status: 'confirmed', confidence: 98 },
    { id: 'n6', type: 'Evidence', label: 'WAF Log Payload Match', detail: 'POST /orders with %{(#_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS)...}', status: 'confirmed', confidence: 99 },
    { id: 'n7', type: 'Impact', label: 'System Shell as www-data', detail: 'Spawning bash reverse shell to 203.0.113.88', status: 'confirmed', confidence: 92 },
    { id: 'n8', type: 'Remediation', label: 'Upgrade to Apache Struts 2.5.10.1+', detail: 'Sanitize Content-Type headers and enforce WAF block rule', status: 'mitigated', confidence: 100 },
  ]);

  const [edges, setEdges] = useState<InvestigationEdge[]>([
    { id: 'e1', from: 'n1', to: 'n2', relation: 'resolves_to' },
    { id: 'e2', from: 'n2', to: 'n3', relation: 'listens_on' },
    { id: 'e3', from: 'n3', to: 'n4', relation: 'serves' },
    { id: 'e4', from: 'n4', to: 'n5', relation: 'is_vulnerable_to' },
    { id: 'e5', from: 'n5', to: 'n6', relation: 'verified_by' },
    { id: 'e6', from: 'n6', to: 'n7', relation: 'resulted_in' },
    { id: 'e7', from: 'n7', to: 'n8', relation: 'countered_by' },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('n5');
  const [isAddingNode, setIsAddingNode] = useState<boolean>(false);
  const [newNodeType, setNewNodeType] = useState<InvestigationNode['type']>('Evidence');
  const [newNodeLabel, setNewNodeLabel] = useState<string>('');
  const [newNodeDetail, setNewNodeDetail] = useState<string>('');

  const [aiVerdict, setAiVerdict] = useState<string | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;

    const newId = `node-${Date.now()}`;
    const newNode: InvestigationNode = {
      id: newId,
      type: newNodeType,
      label: newNodeLabel,
      detail: newNodeDetail || 'Added during active investigation session.',
      status: 'investigating',
      confidence: 85
    };

    setNodes(prev => [...prev, newNode]);
    if (selectedNodeId) {
      setEdges(prev => [...prev, {
        id: `e-${Date.now()}`,
        from: selectedNodeId,
        to: newId,
        relation: 'correlates_with'
      }]);
    }

    setNewNodeLabel('');
    setNewNodeDetail('');
    setIsAddingNode(false);
    setSelectedNodeId(newId);
    addXp(25);
  };

  const handleEvaluateChain = () => {
    setAiVerdict('INVESTIGATION GRAPH INTEGRITY: 98.4%. The causal chain from Host [prod-gateway-01] -> CVE-2017-5638 -> WAF Artifact -> Remediation Mandate is forensically sound and ready for formal Incident Debrief export.');
    addXp(100);
    addNotebookNote({
      title: '[INVESTIGATION BOARD GRAPH] Attack Path Analysis',
      content: `Target: prod-gateway-01\nVulnerability: CVE-2017-5638\n\nGraph Nodes:\n${nodes.map(n => `• [${n.type}] ${n.label}: ${n.detail}`).join('\n')}`,
      category: 'Cases',
      tags: ['Investigation Board', 'Attack Chain', 'Forensics']
    });
  };

  const getNodeColor = (type: InvestigationNode['type']) => {
    switch (type) {
      case 'Host': return 'border-blue-500/50 bg-blue-950/30 text-blue-300';
      case 'IP': return 'border-indigo-500/50 bg-indigo-950/30 text-indigo-300';
      case 'Port': return 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300';
      case 'Service': return 'border-teal-500/50 bg-teal-950/30 text-teal-300';
      case 'Vulnerability': return 'border-red-500/50 bg-red-950/40 text-red-300';
      case 'Evidence': return 'border-amber-500/50 bg-amber-950/40 text-amber-300';
      case 'Impact': return 'border-rose-500/50 bg-rose-950/40 text-rose-300';
      case 'Remediation': return 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-500/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                VISUAL FORENSIC CORRELATION
              </span>
              <span className="text-xs font-mono text-slate-400">
                ATTACK GRAPH & EVIDENCE MAPPING
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-mono text-slate-100 tracking-tight mt-1">
              Interactive Investigation Board
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
              Connect the attack path: Host → IP → Port → Service → Vulnerability → Evidence → Impact → Remediation. Build forensically unshakeable causality chains.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsAddingNode(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Artifact</span>
            </button>
            <button
              onClick={handleEvaluateChain}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md"
            >
              <Bot className="w-4 h-4" />
              <span>Evaluate Graph</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas Visualizer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative min-h-[520px] overflow-hidden flex flex-col justify-between">
            {/* Board Background Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

            {/* Board Nodes Flow */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-cyan-400" />
                  <span>ACTIVE ATTACK CHAIN GRAPH ({nodes.length} ARTIFACTS CONNECTED)</span>
                </span>
                <span className="text-emerald-400">100% REASONING ACCURACY</span>
              </div>

              {/* Node Cards Chain */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {nodes.map((node, idx) => {
                  const isSelected = node.id === selectedNodeId;
                  const colorClass = getNodeColor(node.type);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between gap-2 ${colorClass} ${
                        isSelected ? 'ring-2 ring-cyan-400 shadow-lg' : 'hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 font-bold uppercase tracking-wider">
                          [{idx + 1}] {node.type}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          node.status === 'confirmed' ? 'bg-emerald-950 text-emerald-400' :
                          node.status === 'mitigated' ? 'bg-teal-950 text-teal-300' :
                          'bg-amber-950 text-amber-300'
                        }`}>
                          {node.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono font-bold text-slate-100 truncate">
                          {node.label}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {node.detail}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/5 pt-1.5">
                        <span>Confidence: <strong className="text-cyan-300">{node.confidence}%</strong></span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Verdict Ribbon */}
            {aiVerdict && (
              <div className="relative z-10 mt-4 p-3.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-mono flex items-start gap-3">
                <Bot className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-indigo-300">AI MENTOR CHAIN VERDICT:</span>
                  <p className="font-sans leading-relaxed">{aiVerdict}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Node Inspector & Artifact Editor */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Artifact Detail */}
          {selectedNode ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold uppercase">
                    {selectedNode.type} NODE
                  </span>
                  <h3 className="text-sm font-mono font-bold text-slate-100 mt-1">
                    {selectedNode.label}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">Confidence</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{selectedNode.confidence}%</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <span className="text-slate-400 block font-bold">Investigation Findings:</span>
                <p className="text-slate-300 font-sans leading-relaxed p-3 rounded bg-slate-950 border border-slate-800">
                  {selectedNode.detail}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 block font-bold">Correlated Edges:</span>
                <div className="space-y-1">
                  {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map(e => (
                    <div key={e.id} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                      <span className="text-slate-400">{e.from} → {e.to}</span>
                      <span className="text-cyan-400">({e.relation})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs font-mono text-slate-400 py-12">
              Select an artifact on the investigation graph to inspect forensic details.
            </div>
          )}

          {/* Add New Artifact Form */}
          {isAddingNode && (
            <form onSubmit={handleAddNode} className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">ADD EVIDENCE ARTIFACT</span>
                <button
                  type="button"
                  onClick={() => setIsAddingNode(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Artifact Type</label>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-slate-200"
                >
                  {['Host', 'IP', 'Port', 'Service', 'Vulnerability', 'Evidence', 'Impact', 'Remediation'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Artifact Title</label>
                <input
                  type="text"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="e.g., CVE-2021-44228 or /var/log/nginx/access.log"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Investigation Evidence</label>
                <textarea
                  value={newNodeDetail}
                  onChange={(e) => setNewNodeDetail(e.target.value)}
                  placeholder="Log excerpt, packet hex dump, or terminal output..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors"
              >
                Insert & Link to Active Node
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
