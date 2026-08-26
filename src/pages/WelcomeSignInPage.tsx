import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles } from 'lucide-react';

export const WelcomeSignInPage: React.FC = () => {
  const { signInWithGoogle, isAuthLoading } = useApp();

  return (
    <div id="welcome-signin" className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(6,182,212,0.1)] space-y-8 text-center relative overflow-hidden">
        
        {/* Subtle decorative glow overlay */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Branded Logo Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <span className="font-mono font-black text-xs text-cyan-400 tracking-widest uppercase">MY CYBER LAB SYSTEM</span>
            <h1 className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
              WELCOME TO MY CYBER LAB
            </h1>
          </div>
        </div>

        {/* Motivational Subtext */}
        <p className="text-slate-300 text-sm font-sans leading-relaxed px-2">
          "Sign in to create your personal cybersecurity learning journey."
        </p>

        {/* Secure Authorization Button */}
        <div className="space-y-4 pt-2">
          <button
            onClick={signInWithGoogle}
            disabled={isAuthLoading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-mono font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
          >
            {isAuthLoading ? (
              <span className="flex items-center gap-2 animate-pulse">
                INITIALIZING HANDSHAKE...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                SIGN IN
              </>
            )}
          </button>
          
          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5 uppercase">
            <span>SECURE FIREBASE ENCRYPTED PORT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>

        {/* Feature Teasers */}
        <div className="border-t border-slate-800/60 pt-6 grid grid-cols-2 gap-4 text-left font-mono text-[10px] text-slate-400">
          <div className="space-y-1">
            <span className="text-cyan-400 block font-bold">12 CAREER PATHS</span>
            <span className="leading-tight block text-slate-500">Tailored SOC, Pen-testing, Forensics curricula.</span>
          </div>
          <div className="space-y-1">
            <span className="text-indigo-400 block font-bold">AMAN AI INSTRUCTOR</span>
            <span className="leading-tight block text-slate-500">Interactive live speech guidance and briefings.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
