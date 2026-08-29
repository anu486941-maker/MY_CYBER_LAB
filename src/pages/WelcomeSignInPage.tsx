import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, AlertTriangle, Eye, EyeOff, Mail, Lock, User, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

export const WelcomeSignInPage: React.FC = () => {
  const { 
    signInWithGoogle, 
    signInAsGuest, 
    signUpWithEmail, 
    signInWithEmail, 
    sendEmailVerificationLink,
    isAuthLoading, 
    syncErrorMessage,
    currentUser 
  } = useApp();

  const [authMode, setAuthMode] = useState<'signup' | 'signin' | 'verify'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasLetterAndNumber = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetterAndNumber;

  const calculatePasswordStrength = (): { label: string; percent: number; color: string } => {
    if (!password) return { label: 'None', percent: 0, color: 'bg-slate-800' };
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-zA-Z]/.test(password) && /[0-9]/.test(password)) score += 25;
    if (/[^a-zA-Z0-9]/.test(password)) score += 25;

    if (score <= 25) return { label: 'Weak', percent: 25, color: 'bg-red-500' };
    if (score <= 50) return { label: 'Fair', percent: 50, color: 'bg-amber-500' };
    if (score <= 75) return { label: 'Good', percent: 75, color: 'bg-blue-500' };
    return { label: 'Strong', percent: 100, color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (authMode === 'signup') {
      if (!name.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setLocalError('Please enter a valid email address.');
        return;
      }
      if (!isPasswordValid) {
        setLocalError('Password must be at least 8 characters and contain both letters and numbers.');
        return;
      }

      try {
        await signUpWithEmail(email.trim(), password, name.trim());
        setAuthMode('verify');
        setVerificationSent(true);
      } catch (err: any) {
        setLocalError(err.message || 'Failed to create account. Please try again.');
      }
    } else if (authMode === 'signin') {
      if (!email.trim() || !password) {
        setLocalError('Please enter both your email and password.');
        return;
      }

      try {
        await signInWithEmail(email.trim(), password);
      } catch (err: any) {
        setLocalError(err.message || 'Invalid email or password.');
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      await sendEmailVerificationLink();
      setVerificationSent(true);
      setLocalError(null);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to resend verification email.');
    }
  };

  return (
    <div id="welcome-signin" className="w-full max-w-md mx-auto p-4 sm:p-6 my-auto animate-fadeIn">
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.12)] space-y-6 relative overflow-hidden">
        
        {/* Subtle glow highlights */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Branded Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <span className="font-mono font-bold text-[10px] text-cyan-400 tracking-widest uppercase">
              MY CYBER LAB AUTHENTICATION
            </span>
            <h1 className="text-2xl font-mono font-bold text-white mt-0.5">
              {authMode === 'signup' ? 'Create Your Account' : authMode === 'signin' ? 'Welcome Back' : 'Verify Your Email'}
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {authMode === 'signup' 
                ? 'Start your cybersecurity learning journey.' 
                : authMode === 'signin' 
                ? 'Access your hands-on terminals and missions.' 
                : 'A confirmation link has been dispatched to your inbox.'}
            </p>
          </div>
        </div>

        {/* Tab Toggle between Sign Up and Sign In */}
        {authMode !== 'verify' && (
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => { setAuthMode('signup'); setLocalError(null); }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CREATE ACCOUNT
            </button>
            <button
              onClick={() => { setAuthMode('signin'); setLocalError(null); }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SIGN IN
            </button>
          </div>
        )}

        {/* Error Alert Display */}
        {(localError || syncErrorMessage) && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono text-left flex items-start gap-2.5 shadow-sm animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-0.5">
              <span className="font-bold block text-amber-200 uppercase text-[10px]">Notice</span>
              <p className="text-slate-300 leading-snug">{localError || syncErrorMessage}</p>
            </div>
          </div>
        )}

        {/* VERIFICATION SCREEN */}
        {authMode === 'verify' ? (
          <div className="space-y-5 text-center font-sans">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-left">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Verification Link Sent</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                We sent a verification email to <strong className="text-white font-mono">{email || currentUser?.email || 'your email'}</strong>. Please check your inbox and click the link to verify your account.
              </p>
            </div>

            {verificationSent && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verification link dispatched!</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={handleResendVerification}
                disabled={isAuthLoading}
                className="w-full py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RESEND VERIFICATION EMAIL</span>
              </button>

              <button
                onClick={() => setAuthMode('signup')}
                className="text-xs font-mono text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
              >
                Change Email Address
              </button>
            </div>
          </div>
        ) : (
          /* FORM SUBMISSION */
          <form onSubmit={handleEmailSubmit} className="space-y-4 font-sans">
            {authMode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Carter"
                    required
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-hidden focus:border-cyan-400 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@mycyberlab.io"
                  required
                  className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-hidden focus:border-cyan-400 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full py-2.5 pl-10 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-hidden focus:border-cyan-400 transition-colors placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength and Requirements (Only in Signup) */}
              {authMode === 'signup' && password && (
                <div className="space-y-2 pt-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Password Strength:</span>
                    <span className="font-bold text-white">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>

                  <div className="space-y-1 pt-1 text-[10px]">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLetterAndNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Contains letters and numbers</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms Acknowledgement */}
            {authMode === 'signup' && (
              <p className="text-[10px] text-slate-500 leading-snug">
                By creating an account, you agree to the Ethical Hacking Guidelines and Terms of Service of MY CYBER LAB.
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthLoading || (authMode === 'signup' && !isPasswordValid)}
              className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer mt-2"
            >
              {isAuthLoading ? (
                <span className="animate-pulse">AUTHENTICATING...</span>
              ) : (
                <>
                  <span>{authMode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        {authMode !== 'verify' && (
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute px-3 bg-slate-900 text-[10px] font-mono text-slate-500 uppercase">
              OR CONTINUE WITH
            </span>
          </div>
        )}

        {/* Alternative Auth Buttons */}
        {authMode !== 'verify' && (
          <div className="space-y-3">
            <button
              onClick={signInWithGoogle}
              disabled={isAuthLoading}
              className="w-full py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-200 font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:border-cyan-500/40"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            <button
              onClick={signInAsGuest}
              disabled={isAuthLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-slate-300 font-mono text-[11px] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>START FREE BETA (GUEST MODE)</span>
            </button>
          </div>
        )}

        {/* Footer State Info */}
        <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>SECURE TLS ENCRYPTED</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>PORT 443 READY</span>
          </span>
        </div>

      </div>
    </div>
  );
};
