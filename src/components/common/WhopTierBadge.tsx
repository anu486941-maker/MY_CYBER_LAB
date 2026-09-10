import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Crown, Sparkles, Shield, ArrowUpRight } from 'lucide-react';
import { WhopUpgradeModal } from './WhopUpgradeModal';
import { WHOP_TIERS } from '../../services/whopService';

interface WhopTierBadgeProps {
  showUpgradeBtn?: boolean;
  className?: string;
}

export const WhopTierBadge: React.FC<WhopTierBadgeProps> = ({ 
  showUpgradeBtn = true, 
  className = '' 
}) => {
  const { profile } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tier = profile.membershipTier || 'FREE';
  const tierConfig = WHOP_TIERS[tier] || WHOP_TIERS.FREE;
  const isPro = tier === 'PRO' || tier === 'ENTERPRISE';

  return (
    <>
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
            isPro 
              ? 'bg-gradient-to-r from-cyan-950/90 to-indigo-950/90 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:border-cyan-400' 
              : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
          }`}
          title={isPro ? `Active ${tierConfig.name}` : 'Click to Upgrade via Whop'}
        >
          {isPro ? (
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span>{tierConfig.badge}</span>
        </button>

        {!isPro && showUpgradeBtn && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>UPGRADE</span>
          </button>
        )}
      </div>

      <WhopUpgradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
