import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Crown, ArrowRight, ShieldCheck } from 'lucide-react';
import { 
  ProtectedFeature, 
  isFeatureAccessible, 
  FEATURE_PERMISSIONS 
} from '../../services/whopService';
import { WhopUpgradeModal } from './WhopUpgradeModal';

interface WhopFeatureGateProps {
  feature: ProtectedFeature;
  children: React.ReactNode;
  fallbackMode?: 'blur' | 'card';
  title?: string;
  description?: string;
}

export const WhopFeatureGate: React.FC<WhopFeatureGateProps> = ({
  feature,
  children,
  fallbackMode = 'blur',
  title,
  description
}) => {
  const { profile } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tier = profile.membershipTier || 'FREE';
  const hasAccess = isFeatureAccessible(tier, feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  const meta = FEATURE_PERMISSIONS[feature];
  const displayTitle = title || meta.title;
  const displayDesc = description || meta.description;

  if (fallbackMode === 'card') {
    return (
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 text-center space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
        <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>PRO ACADEMY PASS REQUIRED</span>
          </div>
          <h3 className="text-lg font-mono font-bold text-white">{displayTitle}</h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">{displayDesc}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 mx-auto shadow-md transition-all cursor-pointer"
        >
          <span>UNLOCK WITH WHOP</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
        </button>

        <WhopUpgradeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          highlightFeatureTitle={displayTitle}
          highlightFeatureDesc={displayDesc}
        />
      </div>
    );
  }

  // Blur overlay mode
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="pointer-events-none filter blur-sm select-none opacity-40">
        {children}
      </div>

      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
        <div className="max-w-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>WHOP PRO ACADEMY PASS</span>
            </span>
            <h3 className="text-xl font-mono font-bold text-white">{displayTitle}</h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">{displayDesc}</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
            >
              <span>UNLOCK ACCESS NOW</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant activation with your Whop License Key</span>
          </p>
        </div>
      </div>

      <WhopUpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        highlightFeatureTitle={displayTitle}
        highlightFeatureDesc={displayDesc}
      />
    </div>
  );
};
