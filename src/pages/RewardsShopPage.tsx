import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ShoppingBag, 
  CheckCircle2, 
  Lock, 
  Terminal, 
  Shield, 
  Palette, 
  Award,
  Zap,
  Flame
} from 'lucide-react';

interface RewardItem {
  id: string;
  name: string;
  category: 'theme' | 'badge' | 'avatar' | 'title';
  costXp: number;
  description: string;
  preview: string;
}

const REWARDS_CATALOG: RewardItem[] = [
  {
    id: 'theme-matrix-green',
    name: 'Matrix Phosphor Green',
    category: 'theme',
    costXp: 500,
    description: 'Vintage 1980s monochrome phosphor CRT green aesthetic for all lab terminals.',
    preview: '#00FF66 / Deep Obsidian'
  },
  {
    id: 'theme-cyber-amber',
    name: 'Amber CRT Terminal',
    category: 'theme',
    costXp: 800,
    description: 'High-contrast amber glow terminal palette favored by early UNIX mainframes.',
    preview: '#FFB000 / Warm Charcoal'
  },
  {
    id: 'theme-midnight-synth',
    name: 'Midnight Synthwave',
    category: 'theme',
    costXp: 1200,
    description: 'Neon magenta and cyan accents on deep space navy backdrop.',
    preview: '#FF007F & #00F0FF'
  },
  {
    id: 'badge-kernel-hacker',
    name: 'Kernel Auditor Badge',
    category: 'badge',
    costXp: 1500,
    description: 'Displayable verified profile badge signifying mastery over Linux kernel and SUID permissions.',
    preview: '🛡️ GOLD CORONET'
  },
  {
    id: 'badge-packet-whisperer',
    name: 'Packet Whisperer Badge',
    category: 'badge',
    costXp: 2000,
    description: 'Special badge awarded for completing all Wireshark packet capture & TCP handshake analysis labs.',
    preview: '⚡ ETHERNET LIGHTNING'
  },
  {
    id: 'title-threat-hunter',
    name: 'Elite Threat Hunter Title',
    category: 'title',
    costXp: 3000,
    description: 'Title prefix displayed next to your codename in leaderboards and candidate portfolio.',
    preview: '[TITAN] '
  }
];

export const RewardsShopPage: React.FC = () => {
  const { profile, addXp } = useApp();
  const [unlockedItems, setUnlockedItems] = useState<string[]>(['theme-matrix-green']);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUnlock = (item: RewardItem) => {
    if (unlockedItems.includes(item.id)) return;

    if (profile.xp < item.costXp) {
      setFeedback(`Insufficient XP. You need ${item.costXp - profile.xp} more XP. Complete more lab missions!`);
      return;
    }

    setUnlockedItems([...unlockedItems, item.id]);
    setFeedback(`Unlocked "${item.name}"! Applied to your profile.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold">
            <ShoppingBag className="w-3.5 h-3.5" /> COSMETIC REWARD SHOP
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            Operator Gear & Terminal Cosmetics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans">
            Redeem earned XP for custom terminal palettes, profile badges, and honorific titles. (Strictly cosmetic).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-right space-y-1 shadow-inner">
          <div className="text-slate-500 uppercase text-[10px]">CURRENT XP BALANCE</div>
          <div className="text-xl font-bold text-emerald-400 flex items-center justify-end gap-1">
            <Zap className="w-4 h-4 text-emerald-400" /> {profile.xp} XP
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 font-mono text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REWARDS_CATALOG.map((item) => {
          const isOwned = unlockedItems.includes(item.id);
          const canAfford = profile.xp >= item.costXp;

          return (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 uppercase text-[10px]">
                    {item.category}
                  </span>
                  <span className="font-bold text-emerald-400">
                    {item.costXp} XP
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-center text-xs text-cyan-300">
                  {item.preview}
                </div>

                <h3 className="font-mono text-sm font-bold text-white">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                {isOwned ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-default border border-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ACTIVE / UNLOCKED
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlock(item)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:opacity-90 shadow-md'
                        : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-slate-950" /> UNLOCK FOR {item.costXp} XP
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> LOCKED ({item.costXp} XP)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
