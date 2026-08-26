import React, { useState } from 'react';
import { 
  TRYHACKME_ROOMS, 
  THMRoom, 
  THMRoomType, 
  THMDifficulty, 
  THMCategory 
} from '../data/tryHackMeRoomsData';
import { TryHackMeRoomRunnerModal } from '../components/tryhackme/TryHackMeRoomRunnerModal';
import { TryHackMeOpenVpnModal } from '../components/tryhackme/TryHackMeOpenVpnModal';
import { TryHackMeKingOfTheHillModal } from '../components/tryhackme/TryHackMeKingOfTheHillModal';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Terminal, 
  Crown, 
  Flame, 
  Search, 
  Filter, 
  Award, 
  Play, 
  Clock, 
  Zap, 
  Globe, 
  Layers, 
  Cpu, 
  Lock, 
  Eye, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Radio
} from 'lucide-react';

export const TryHackMeRoomsPage: React.FC = () => {
  const { user } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [selectedRoom, setSelectedRoom] = useState<THMRoom | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
  const [isOpenVpnModalOpen, setIsOpenVpnModalOpen] = useState<boolean>(false);
  const [isKothModalOpen, setIsKothModalOpen] = useState<boolean>(false);

  const categories = ['All', 'Web', 'Windows', 'Linux', 'SOC & Defense', 'Active Directory', 'Network'];
  const roomTypes = ['All', 'Walkthroughs', 'Challenges', 'King of the Hill (KotH)'];

  const filteredRooms = TRYHACKME_ROOMS.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || r.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    
    let matchesType = true;
    if (selectedType === 'Walkthroughs') matchesType = r.roomType === 'walkthrough';
    if (selectedType === 'Challenges') matchesType = r.roomType === 'challenge';
    if (selectedType === 'King of the Hill (KotH)') matchesType = r.roomType === 'koth';

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  });

  const handleOpenRoom = (room: THMRoom) => {
    if (room.roomType === 'koth') {
      setIsKothModalOpen(true);
    } else {
      setSelectedRoom(room);
      setIsRoomModalOpen(true);
    }
  };

  const getDifficultyBadge = (diff: THMDifficulty) => {
    switch (diff) {
      case 'info': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'hard': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'insane': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Hero & TryHackMe Concept Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold tracking-wider">
                  TRYHACKME ROOMS & CTF ENGINE
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  Full Attack & Defense Suite
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                TryHackMe Practice Rooms & Cyber Ranges
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Deploy private isolated virtual machines, connect via OpenVPN or the in-browser AttackBox, answer guided task questions, and escalate privileges from zero to root.
              </p>
            </div>

            {/* Quick Action Hub: OpenVPN & KotH */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsOpenVpnModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono font-bold text-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-black/40"
              >
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>OpenVPN Access (10.8.0.0/16)</span>
              </button>

              <button
                onClick={() => setIsKothModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
              >
                <Crown className="w-4 h-4 animate-bounce" />
                <span>King of the Hill (KotH) Live</span>
              </button>
            </div>
          </div>

          {/* TryHackMe Gamification Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            
            {/* Daily Streak */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1">
                  7-Day Streak
                  <span className="text-[10px] text-amber-400">🔥</span>
                </div>
                <div className="text-[11px] text-slate-400">1.5x XP Multiplier Active</div>
              </div>
            </div>

            {/* Rank */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-200">[02] Hacker</div>
                <div className="text-[11px] text-emerald-400">Top 5% Globally</div>
              </div>
            </div>

            {/* Rooms Available */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-200">{TRYHACKME_ROOMS.length} Classic Rooms</div>
                <div className="text-[11px] text-slate-400">Walkthroughs & CTFs</div>
              </div>
            </div>

            {/* AttackBox Engine */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-200">Kali AttackBox</div>
                <div className="text-[11px] text-emerald-400">Browser Ready</div>
              </div>
            </div>

          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rooms by name, CVE, tool (Nmap, Burp, Metasploit, Wireshark, SQLi)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
              />
            </div>

            {/* Room Type Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              {roomTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedType === t
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

          </div>

          {/* Categories Row */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-xs font-mono text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              CATEGORY:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${room.bannerGradient} opacity-20 pointer-events-none`} />

              <div className="space-y-4 relative z-10">
                
                {/* Top Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-950 text-cyan-400 border border-cyan-500/30">
                    {room.code}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getDifficultyBadge(room.difficulty)}`}>
                      {room.difficulty.toUpperCase()}
                    </span>
                    {room.isFree ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        FREE
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-950 text-amber-300 border border-amber-500/30">
                        VIP / ARENA
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-mono font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    {room.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {room.tags.slice(0, 4).map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-slate-400 border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {room.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Award className="w-3.5 h-3.5" />
                    +{room.xpReward} XP
                  </span>
                </div>

                <button
                  onClick={() => handleOpenRoom(room)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 group-hover:scale-105"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Enter Room</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* TryHackMe Modals */}
      <TryHackMeRoomRunnerModal
        room={selectedRoom}
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setSelectedRoom(null);
        }}
      />

      <TryHackMeOpenVpnModal
        isOpen={isOpenVpnModalOpen}
        onClose={() => setIsOpenVpnModalOpen(false)}
      />

      <TryHackMeKingOfTheHillModal
        isOpen={isKothModalOpen}
        onClose={() => setIsKothModalOpen(false)}
      />

    </div>
  );
};
