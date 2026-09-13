import React, { useState } from 'react';
import { NetworkNodeData } from './Interactive3DCyberNetwork';
import { Server, Laptop, Shield, Router, Database, Bot, ChevronRight, Activity, X } from 'lucide-react';

interface Interactive2DCyberNetworkProps {
  nodes: NetworkNodeData[];
  selectedNode: NetworkNodeData | null;
  onSelectNode: (node: NetworkNodeData | null) => void;
  onAskAman: (node: NetworkNodeData) => void;
}

export const Interactive2DCyberNetwork: React.FC<Interactive2DCyberNetworkProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
  onAskAman
}) => {
  const getNodeIcon = (type: NetworkNodeData['type']) => {
    switch (type) {
      case 'GATEWAY':
      case 'FIREWALL':
        return <Router className="w-5 h-5 text-cyan-400" />;
      case 'DATABASE':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'WORKSTATION':
        return <Laptop className="w-5 h-5 text-blue-400" />;
      case 'AMAN':
        return <Bot className="w-5 h-5 text-violet-400" />;
      default:
        return <Server className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getStatusColor = (status: NetworkNodeData['status']) => {
    switch (status) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/40 border-rose-500/50';
      case 'WARNING':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/50';
      case 'VERIFIED':
      case 'ONLINE':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/50';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="relative w-full p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs text-slate-400">
        <span>2D TOPOLOGY SCHEMATIC VIEW</span>
        <span>{nodes.length} Network Nodes Detected</span>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {getNodeIcon(node.type)}
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-white text-sm">{node.name}</h4>
                    <span className="font-mono text-[11px] text-cyan-300 block">{node.ip}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${getStatusColor(node.status)}`}>
                  {node.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {node.role}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                <span className="text-slate-500 uppercase">{node.type}</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  <span>Inspect Data</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Drawer */}
      {selectedNode && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4 shadow-2xl relative font-mono">
          <button
            onClick={() => onSelectNode(null)}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              REAL ASSET NODE DETAILS
            </span>
            <h3 className="text-xl font-bold text-white">{selectedNode.name}</h3>
            <span className="text-xs text-cyan-300">IP: {selectedNode.ip}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">ROLE</span>
              <span className="text-slate-200 font-bold text-[11px]">{selectedNode.role}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">STATUS</span>
              <span className="text-emerald-400 font-bold text-[11px]">{selectedNode.status}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">TYPE</span>
              <span className="text-indigo-300 font-bold text-[11px]">{selectedNode.type}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SERVICES</span>
              <span className="text-slate-300 text-[11px]">{selectedNode.openServices?.join(', ') || 'Standard Port'}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onAskAman(selectedNode)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Bot className="w-4 h-4 text-violet-200" />
              <span>Ask AMAN About This Node</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
