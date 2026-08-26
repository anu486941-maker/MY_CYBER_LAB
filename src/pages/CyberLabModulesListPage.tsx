import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CYBER_LAB_MODULES } from '../data/cyberLabModulesData';
import { CyberLabDifficulty } from '../types/cyberLabModuleTypes';
import { 
  Terminal, 
  Shield, 
  Layers, 
  Search, 
  Filter, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  Radio, 
  Sparkles, 
  Cpu, 
  Network, 
  Globe, 
  Lock, 
  Eye, 
  Compass,
  FileCheck
} from 'lucide-react';
import { WhereAmIModal } from '../components/common/WhereAmIModal';

export const CyberLabModulesListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [isWhereAmIOpen, setIsWhereAmIOpen] = useState<boolean>(false);

  const categories = [
    'All',
    'Foundations',
    'Linux',
    'Networking',
    'Web Security',
    'Offensive',
    'Defensive & SOC',
    'Cryptography',
    'Capstone'
  ];

  const filteredModules = CYBER_LAB_MODULES.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.skillsEarned.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || m.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Foundations': return <Shield className="w-4 h-4 text-cyan-400" />;
      case 'Linux': return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'Networking': return <Network className="w-4 h-4 text-blue-400" />;
      case 'Web Security': return <Globe className="w-4 h-4 text-purple-400" />;
      case 'Offensive': return <Cpu className="w-4 h-4 text-rose-400" />;
      case 'Defensive & SOC': return <Eye className="w-4 h-4 text-amber-400" />;
      case 'Cryptography': return <Lock className="w-4 h-4 text-indigo-400" />;
      case 'Capstone': return <Award className="w-4 h-4 text-yellow-400" />;
      default: return <Layers className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getDifficultyColor = (diff: CyberLabDifficulty) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Easy': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Hard': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Expert': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Hero & Telemetry Navigator */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold tracking-wider">
                  HANDS-ON CYBER ACADEMY
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold">
                  {CYBER_LAB_MODULES.length} Comprehensive Modules
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Cyber Lab Training Modules
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Step-by-step guided cybersecurity modules with live interactive sandboxes, terminal emulation, packet inspection, 3-tier progressive hints, and AMAN Socratic AI coaching.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsWhereAmIOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span>WHERE AM I?</span>
              </button>

              <Link
                to={`/modules/${CYBER_LAB_MODULES[0].id}`}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-950/50 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch First Module</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules by name, skill (e.g. nmap, sqli, logs, wireshark), or code..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500 w-full md:w-auto"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/50'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat !== 'All' && getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 group"
            >
              <div className="space-y-3">
                
                {/* Card Top Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-950 text-cyan-400 border border-slate-800">
                      {module.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 flex items-center gap-1">
                      {getCategoryIcon(module.category)}
                      <span>{module.category}</span>
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                </div>

                {/* Module Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {module.title}
                </h3>

                {/* Module Summary */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {module.summary}
                </p>

                {/* Skills Earned Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {module.skillsEarned.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                  {module.skillsEarned.length > 3 && (
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-500 text-[10px] font-mono">
                      +{module.skillsEarned.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Meta & Launch Action */}
              <div className="border-t border-slate-800 pt-3.5 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{module.estimatedMinutes}m</span>
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>+{module.xpReward} XP</span>
                  </span>
                </div>

                <Link
                  to={`/modules/${module.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-500 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm group-hover:bg-cyan-500 group-hover:text-slate-950"
                >
                  <span>Launch Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
            <Shield className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Modules Found</h3>
            <p className="text-xs text-slate-400">
              No cyber lab modules match your search filters. Try clearing filters or searching for keywords like "linux", "nmap", or "web".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Global WHERE AM I? Modal */}
      <WhereAmIModal
        isOpen={isWhereAmIOpen}
        onClose={() => setIsWhereAmIOpen(false)}
      />
    </div>
  );
};
