import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Crown, 
  Sparkles, 
  Check, 
  X, 
  Shield, 
  ShieldCheck, 
  ExternalLink, 
  Key, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  Server, 
  Trophy, 
  Bot, 
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  WHOP_TIERS, 
  DEFAULT_WHOP_CHECKOUT_URL, 
  validateWhopLicenseKey, 
  WhopTierDetails 
} from '../services/whopService';
import { WhopUpgradeModal } from '../components/common/WhopUpgradeModal';

export const PricingPage: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const currentTier = profile.membershipTier || 'FREE';

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

        updateProfile({
          membershipTier: res.tier,
          whopLicenseKey: res.licenseKey,
          whopSubscriptionStatus: 'active',
          whopValidUntil: res.validUntil,
          whopPlanName: res.planName
        });
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

  const tiersList: WhopTierDetails[] = [
    WHOP_TIERS.FREE,
    WHOP_TIERS.PRO,
    WHOP_TIERS.ENTERPRISE
  ];

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <section className="text-center pt-8 pb-4 space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold tracking-wider uppercase shadow-xs">
          <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span>OFFICIAL WHOP STOREFRONT & ACADEMY PASSES</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight leading-tight">
          Invest in Real Cyber Skills.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400">
            Learn with AI. Practice in Range.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          From zero Linux knowledge to offensive penetration testing and SOC incident response. Backed by 24/7 AMAN AI Socratic mentorship.
        </p>

        {/* Current User Status Banner */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Your Current Status:</span>
            <span className={`px-2 py-0.5 rounded-md font-bold ${
              currentTier === 'PRO' || currentTier === 'ENTERPRISE'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {WHOP_TIERS[currentTier]?.name || 'Starter Pass'}
            </span>
            {currentTier === 'FREE' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer ml-1"
              >
                Upgrade Now →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tier Pricing Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiersList.map((tier) => {
          const isCurrent = currentTier === tier.id;
          const isPopular = tier.popular;

          return (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                isPopular
                  ? 'bg-gradient-to-b from-slate-900/95 to-slate-950 border-2 border-cyan-500/60 shadow-[0_0_40px_rgba(6,182,212,0.15)] scale-100 lg:-translate-y-2'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-mono text-[11px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  <span>MOST POPULAR • BEST VALUE</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                      {tier.badge}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                        ACTIVE ON ACCOUNT
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-mono font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-slate-400 font-sans">{tier.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="py-2 border-y border-slate-800/80">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-mono font-black text-white">
                      ${tier.priceMonthly}
                    </span>
                    <span className="text-sm font-mono text-slate-400">
                      {tier.priceMonthly === 0 ? 'forever free' : '/ month'}
                    </span>
                  </div>
                  {tier.priceLifetime && (
                    <p className="text-[11px] font-mono text-emerald-400 mt-1">
                      Or one-time ${tier.priceLifetime} lifetime access
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
                    INCLUDED CAPABILITIES:
                  </span>
                  <ul className="space-y-2.5">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans">
                        <div className="p-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6 border-t border-slate-800/80">
                {tier.id === 'FREE' ? (
                  <button
                    disabled={isCurrent}
                    className="w-full py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {isCurrent ? 'CURRENT STARTER PLAN' : 'SWITCH TO STARTER'}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <a
                      href={tier.whopCheckoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
                    >
                      <span>PURCHASE PASS ON WHOP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      ENTER LICENSE KEY
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick License Redemption Card */}
      <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-mono font-bold text-white">Already Purchased on Whop?</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Enter your Whop license key below for instant activation across all browser sessions.
            </p>
          </div>

          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>Instant Cloud Synced</span>
          </span>
        </div>

        <form onSubmit={handleValidateLicense} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                placeholder="Enter Whop Key (e.g. WHOP-XXXX-XXXX-XXXX or whop_lic_...)"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isValidating || !licenseKeyInput.trim()}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              {isValidating ? 'VERIFYING...' : 'ACTIVATE WHOP PASS'}
            </button>
          </div>

          {validationResult.status === 'error' && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationResult.message}</span>
            </div>
          )}

          {validationResult.status === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{validationResult.message}</span>
            </div>
          )}
        </form>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            BUYER ASSURANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              How does Whop delivery work?
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              When you complete checkout on Whop, your unique license key is generated immediately on your Whop dashboard and emailed to you. Simply copy your key, paste it into the "Enter License Key" field in MY CYBER LAB, and all Pro features unlock instantaneously.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Can I cancel my subscription anytime?
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Yes, absolutely. You can manage and cancel your subscription directly from your Whop customer portal with 1 click. You retain Pro access until the end of your paid billing period.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              What makes AMAN AI different from generic ChatGPT prompts?
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              AMAN is engineered strictly for cybersecurity education. It utilizes Socratic pedagogical reasoning: instead of spoon-feeding exploit code, it prompts you to observe terminal outputs, understand network packets, and analyze security flaws step-by-step. AMAN never encourages illegal behavior and keeps you safe within authorized educational boundaries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="font-mono font-bold text-sm text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Are the certificates recognized by employers?
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Each completion certificate contains a cryptographically generated SHA-256 validation hash and a permanent public verification link. Employers and interviewers can view the exact labs, challenges, and terminal exercises you completed to earn the credential.
            </p>
          </div>
        </div>
      </section>

      <WhopUpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PricingPage;
