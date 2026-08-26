import React, { useState } from 'react';
import { EvidenceItem } from '../../types/incidentLab';
import { Search, Plus, Tag, ShieldAlert, CheckCircle, Trash2, Bookmark, FileText, Globe, Terminal, User, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EvidenceLockerProps {
  evidenceList: EvidenceItem[];
  onAddEvidence?: (item: EvidenceItem) => void;
  onRemoveEvidence?: (id: string) => void;
  onToggleImportant?: (id: string) => void;
}

export const EvidenceLocker: React.FC<EvidenceLockerProps> = ({
  evidenceList,
  onAddEvidence,
  onRemoveEvidence,
  onToggleImportant
}) => {
  const { language } = useApp();
  const t = (en: string, hi: string) => (language === 'Hinglish' ? hi : en);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<EvidenceItem['type']>('IP');
  const [newTitle, setNewTitle] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newConfidence, setNewConfidence] = useState<EvidenceItem['confidence']>('medium');

  const filteredEvidence = evidenceList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newValue) return;

    const newItem: EvidenceItem = {
      id: `ev-${Date.now()}`,
      type: newType,
      title: newTitle,
      description: newDescription || 'Manual analyst observation',
      value: newValue,
      source: 'analyst-terminal',
      confidence: newConfidence,
      discoveredAtStep: 'investigation'
    };

    if (onAddEvidence) {
      onAddEvidence(newItem);
    }
    setNewTitle('');
    setNewValue('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const getTypeIcon = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'IP': return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'HASH': return <Hash className="w-4 h-4 text-amber-400" />;
      case 'USER': return <User className="w-4 h-4 text-purple-400" />;
      case 'LOG': return <Terminal className="w-4 h-4 text-green-400" />;
      case 'DOMAIN': return <Globe className="w-4 h-4 text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            {t('Evidence Locker', 'Evidence Locker / Saboot')}
          </h3>
          <span className="text-xs px-2 py-0.5 bg-slate-800 text-cyan-300 rounded-full font-mono">
            {evidenceList.length} {t('items', 'items')}
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('Add Artifact', 'Artifact Jodo')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={t('Search artifacts (IP, hash, title)...', 'Artifacts search karo...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">{t('All Types', 'Sabhi Types')}</option>
          <option value="IP">IP Address</option>
          <option value="HASH">Hash</option>
          <option value="DOMAIN">Domain</option>
          <option value="URL">URL</option>
          <option value="USER">User</option>
          <option value="LOG">Log</option>
          <option value="FILE">File</option>
        </select>
      </div>

      {/* Evidence Items List */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {filteredEvidence.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {t('No evidence artifacts collected yet. Investigate or add artifacts manually.', 'Abhi tak koi evidence collect nahi kiya gaya.')}
          </div>
        ) : (
          filteredEvidence.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-lg transition space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  <span className="text-xs font-semibold text-white">{item.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded font-mono">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                    item.confidence === 'high' ? 'bg-red-950/60 text-red-400 border border-red-900/40' :
                    item.confidence === 'medium' ? 'bg-amber-950/60 text-amber-400 border border-amber-900/40' :
                    'bg-slate-900 text-slate-400'
                  }`}>
                    {item.confidence}
                  </span>
                  {onToggleImportant && (
                    <button
                      onClick={() => onToggleImportant(item.id)}
                      className="text-slate-500 hover:text-amber-400 p-1"
                      title="Bookmark / Important"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onRemoveEvidence && (
                    <button
                      onClick={() => onRemoveEvidence(item.id)}
                      className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 p-2 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 select-all overflow-x-auto">
                {item.value}
              </div>

              {item.description && (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400" />
              {t('Capture New Evidence Artifact', 'Naya Evidence Artifact Jodo')}
            </h4>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{t('Artifact Type', 'Artifact Type')}</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="IP">IP Address</option>
                  <option value="HASH">Hash (MD5/SHA256)</option>
                  <option value="DOMAIN">Domain</option>
                  <option value="URL">URL</option>
                  <option value="USER">User Account</option>
                  <option value="LOG">Log Entry</option>
                  <option value="FILE">File / Path</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{t('Title / Identifier', 'Title')}</label>
                <input
                  type="text"
                  placeholder="e.g. C2 Callback IP or Suspicious Login Hash"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{t('Artifact Value / Data', 'Artifact Value')}</label>
                <input
                  type="text"
                  placeholder="e.g. 192.168.1.150 or d41d8cd98f00b204e9800998ecf8427e"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-cyan-300"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{t('Description / Notes', 'Description')}</label>
                <textarea
                  placeholder="Explain why this artifact is suspicious..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white h-20"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{t('Confidence', 'Confidence')}</label>
                <select
                  value={newConfidence}
                  onChange={(e) => setNewConfidence(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="low">Low Confidence</option>
                  <option value="medium">Medium Confidence</option>
                  <option value="high">High Confidence (Confirmed IOC)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  {t('Cancel', 'Radd karo')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
                >
                  {t('Save Artifact', 'Save Karo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
