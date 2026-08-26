import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LanguagePreference } from '../../types';
import { Globe, Check, ChevronDown } from 'lucide-react';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { id: LanguagePreference; label: string; sub: string }[] = [
    { id: 'English', label: 'English', sub: 'Standard International' },
    { id: 'Hinglish', label: 'Hinglish', sub: 'Hindi + English Hybrid' },
    { id: 'Hindi', label: 'हिन्दी (Hindi)', sub: 'Devanagari Explanations' }
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-cyan-300 font-mono text-xs transition-colors cursor-pointer"
        title="Switch Educational Explanation Language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-bold">{language}</span>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase font-semibold">
            Educational Language
          </div>
          <div className="p-1 space-y-1">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-mono text-xs transition-colors cursor-pointer ${
                  language === lang.id
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-bold">{lang.label}</div>
                  <div className="text-[10px] text-slate-400 font-sans">{lang.sub}</div>
                </div>
                {language === lang.id && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-slate-800 text-[10px] text-slate-400 font-sans leading-tight">
            * Note: Technical commands (Linux/Nmap) remain in standard English syntax.
          </div>
        </div>
      )}
    </div>
  );
};
