import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoteItem } from '../types';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Tag, 
  Search, 
  Edit3, 
  Check, 
  Copy, 
  FileText, 
  Clock
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const NotebookPage: React.FC = () => {
  const { notes, addNote, deleteNote } = useApp();
  const [selectedNote, setSelectedNote] = useState<NoteItem>(notes[0] || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Linux');
  const [content, setContent] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredNotes = notes.filter(n => 
    (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.tags || []).some(t => (t || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    addNote({
      title,
      category,
      content,
      tags: tags.length > 0 ? tags : [category]
    });

    setIsCreating(false);
    setTitle('');
    setContent('');
    setTagInput('');
  };

  const handleCopyContent = () => {
    if (!selectedNote) return;
    navigator.clipboard.writeText(selectedNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
              FIELD NOTEBOOK
            </span>
            <span className="text-xs font-mono text-slate-500">• {notes.length} SAVED ENTRIES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Cybersecurity Knowledge Base & Notebook
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Record findings, save cheatsheets, and document incident investigations.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setTitle('');
            setContent('');
            setTagInput('');
          }}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> NEW NOTE ENTRY
        </button>
      </div>

      {/* Main 2-Column Note Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Col: Notes Index list & Search */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, tags, commands..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsCreating(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected && !isCreating
                      ? 'bg-cyan-950/60 border-cyan-500/80 text-cyan-200 shadow-md'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono font-bold text-xs truncate text-slate-100">
                      {note.title}
                    </h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 shrink-0">
                      {note.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {note.updatedAt}
                    </span>
                    <span>{note.tags.length} tags</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Note Editor or Selected Note Inspector */}
        <div className="lg:col-span-2 space-y-4">
          {isCreating ? (
            /* Creation Form */
            <form onSubmit={handleSaveNote} className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-mono font-bold text-sm text-cyan-300 uppercase flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> CREATE NOTEBOOK ENTRY
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">NOTE TITLE:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wireshark Filter Syntax Reference"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">CATEGORY:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Linux">Linux</option>
                    <option value="Networking">Networking</option>
                    <option value="Concepts">Concepts</option>
                    <option value="Tactics">Tactics</option>
                    <option value="Web">Web Security</option>
                    <option value="CTF">CTF Writeups</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">TAGS (COMMA SEPARATED):</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. commands, cheatsheet, triage"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">NOTE CONTENT (MARKDOWN):</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter commands, findings, tactical observations..."
                  className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs cursor-pointer"
                >
                  SAVE ENTRY
                </button>
              </div>
            </form>
          ) : selectedNote ? (
            /* Selected Note Viewer */
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {selectedNote.category}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Updated {selectedNote.updatedAt}</span>
                  </div>
                  <h2 className="text-xl font-mono font-bold text-slate-100 mt-1">
                    {selectedNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyContent}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 text-xs cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5">
                {selectedNote.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Note Body Text */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto min-h-[250px]">
                {selectedNote.content}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-500 font-mono text-xs">
              Select or create a note to view its contents.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
