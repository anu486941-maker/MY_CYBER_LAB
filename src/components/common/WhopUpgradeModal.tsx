import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  X, 
  ExternalLink, 
  Key, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Terminal, 
  Server, 
  Lock 
} from 'lucide-react';
import { 
  WHOP_TIERS, 
  DEFAULT_WHOP_CHECKOUT_URL, 
  validateWhopLicenseKey 
} from '../../services/whopService';

interface WhopUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightFeatureTitle?: string;
  highlightFeatureDesc?: string;
}

export const WhopUpgradeModal: React.FC<WhopUpgradeModalProps> = ({
  isOpen,
  onClose,
  highlightFeatureTitle,
  highlightFeatureDesc
}) => {
  const { profile, updateProfile } = useApp();
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  if (!isOpen) return null;

  const currentTier = profile.membershipTier || 'FREE';
  const isAlreadyPro = currentTier === 'PRO' || currentTier === 'ENTERPRISE';
  const proTier = WHOP_TIERS.PRO;

  const handleValidateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) return;

    setIsValidating(true);
    setValidationResult({ status: 'idle', message: '' });

    try {
      const res = await validateWhopLicenseKey(licenseKeyInput.trim(), profile.name);
      if (res.success) {
        setValidationResult({
          status: 'success',
          message: res.message
        });

        // Update profile with Pro tier & license key
        updateProfile({
          membershipTier: res.tier,
          whopLicenseKey: res.licenseKey,
          whopSubscriptionStatus: 'active',
          whopValidUntil: res.validUntil,
          whopPlanName: res.planName
        });

        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setValidationResult({
          status: 'error',
          message: res.message
        });
      }
    } catch (err: any) {
      setValidationResult({
        status: 'error',
        message: err?.message || 'Error validating license key.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleQuickBetaKey = (key: string) => {
    setLicenseKeyInput(key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop effects */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="space-y-3 text-center sm:text-left pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>MY CYBER LAB • WHOP ACCESS PASS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
            {isAlreadyPro ? 'Pro Academy Membership Active' : 'Upgrade to Pro Academy'}
          </h2>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            {highlightFeatureTitle ? (
              <span className="block p-3 mb-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-mono">
                <strong>Feature Locked:</strong> {highlightFeatureTitle} — {highlightFeatureDesc}
              </span>
            ) : null}
            Unlock all 30+ cybersecurity curriculum levels, isolated machine Cyber Range nodes, advanced CTF challenges, and unrestricted AMAN AI mentoring.
          </p>
        </div>

        {/* Feature Comparison Grid */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {proTier.features.map((feat, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
            >
              <div className="p-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-slate-200 font-sans leading-snug">{feat}</span>
            </div>
          ))}
        </div>

        {/* Action Row: Buy on Whop or Enter Key */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-cyan-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-extrabold text-white">${proTier.priceMonthly}</span>
                <span className="text-xs text-slate-400 font-mono">/ month</span>
                <span className="text-xs text-slate-500 font-mono">• or $199 lifetime</span>
              </div>
              <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                Instant delivery via Whop • Cancel anytime with 1 click
              </p>
            </div>

            <a
              href={DEFAULT_WHOP_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <span>PURCHASE ON WHOP</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-3 text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500">
              OR ACTIVATE EXISTING LICENSE KEY
            </span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* License Key Redemption Form */}
          <form onSubmit={handleValidateLicense} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={licenseKeyInput}
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                  placeholder="WHOP-XXXX-XXXX-XXXX or whop_lic_..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isValidating || !licenseKeyInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
              >
                {isValidating ? 'VERIFYING...' : 'ACTIVATE KEY'}
              </button>
            </div>

            {/* Validation Feedback */}
            {validationResult.status === 'error' && (
              <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{validationResult.message}</span>
              </div>
            )}

            {validationResult.status === 'success' && (
              <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{validationResult.message}</span>
              </div>
            )}

            {/* Beta Partner Access Helpers */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>First 20 Beta Testers Shortcut:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickBetaKey('BETA-WHOP-ACCESS-2026')}
                    className="text-cyan-400 hover:underline cursor-pointer font-bold"
                  >
                    BETA-WHOP-ACCESS-2026
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    type="button"
                    onClick={() => handleQuickBetaKey('WHOP-PRO-ACADEMY-2026')}
                    className="text-cyan-400 hover:underline cursor-pointer font-bold"
                  >
                    WHOP-PRO-ACADEMY-2026
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Guarantee Banner */}
        <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>7-Day No-Questions-Asked Satisfaction Guarantee on Whop</span>
        </div>
      </div>
    </div>
  );
};
