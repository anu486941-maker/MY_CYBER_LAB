import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Terminal, 
  Shield, 
  Bot, 
  Map, 
  Trophy, 
  BookOpen, 
  FileCheck2, 
  Globe, 
  Server, 
  Binary, 
  Briefcase, 
  Flame, 
  Zap, 
  X,
  ArrowRight,
  Command,
  LayoutDashboard
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Labs' | 'AMAN AI' | 'Career';
  path?: string;
  action?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
}

export const GlobalCommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { profile } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    { id: 'dash', title: 'Dashboard & Command Center', category: 'Navigation', path: '/dashboard', icon: LayoutDashboard },
    { id: 'roadmap', title: 'Career Roadmap & Skill Progression', category: 'Navigation', path: '/roadmap', icon: Map },
    { id: 'aman', title: 'AMAN AI Cybersecurity Mentor', category: 'AMAN AI', path: '/ai-mentor', icon: Bot, shortcut: 'AI' },
    { id: 'linux', title: 'Linux Terminal & Bandit Wargames', category: 'Labs', path: '/linux-lab', icon: Terminal },
    { id: 'network', title: 'Network Packet & Port Scanning Lab', category: 'Labs', path: '/network-lab', icon: Server },
    { id: 'websec', title: 'Web Application Security (OWASP Top 10)', category: 'Labs', path: '/practice/web-security', icon: Globe },
    { id: 'soc', title: 'SOC Incident Simulator & Telemetry', category: 'Labs', path: '/practice/soc-simulator', icon: Shield },
    { id: 'ctf', title: 'CTF Arena & Security Challenges', category: 'Labs', path: '/ctf-arena', icon: Trophy },
    { id: 'subnet', title: 'CIDR Subnetting & IP Trainer', category: 'Labs', path: '/practice/subnetting', icon: Binary },
    { id: 'range', title: 'Master Cyber Range Sandboxes', category: 'Labs', path: '/master-cyber-range', icon: Server },
    { id: 'evidence', title: 'Evidence Locker & Incident Findings', category: 'Career', path: '/ace', icon: FileCheck2 },
    { id: 'roles', title: 'Career Roles & Specializations', category: 'Career', path: '/roles', icon: Briefcase },
    { id: 'cert', title: 'Certificates & Cryptographic Verification', category: 'Career', path: '/certificate', icon: Trophy },
    { id: 'skills', title: 'Curriculum & Skill Library', category: 'Navigation', path: '/skill-library', icon: BookOpen }
  ];

  const filtered = query.trim() === ''
    ? commands
    : commands.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) || 
        c.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (item: CommandItem) => {
    setIsOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  const handleKeyDownInList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4 animate-fadeIn"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDownInList}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search CyberForge AI modules, labs, commands, or AMAN..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
            ESC
          </kbd>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-200 sm:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2 custom-scrollbar space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching modules or actions found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected 
                      ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300' 
                      : 'text-slate-300 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium text-slate-100">{item.title}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.shortcut && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold">
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-cyan-400 font-bold">CyberForge AI Command Palette</span>
        </div>
      </div>
    </div>
  );
};
