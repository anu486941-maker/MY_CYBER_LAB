import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SyncIndicatorBadge } from '../common/SyncIndicatorBadge';
import { LanguageSelector } from '../common/LanguageSelector';
import { WhereAmIModal } from '../common/WhereAmIModal';
import { 
  Shield, 
  Flame, 
  Award, 
  Sparkles, 
  Terminal, 
  Menu, 
  X, 
  HelpCircle, 
  BookOpen,
  User,
  Zap,
  Crosshair,
  Compass
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { profile, setIsOnboardingOpen } = useApp();
  const location = useLocation();
  const [isWhereAmIOpen, setIsWhereAmIOpen] = useState(false);

  const xpProgressPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
                aria-label="Toggle navigation drawer"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-extrabold text-base tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors">
                    MY CYBER LAB
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 uppercase tracking-widest hidden sm:inline">
                    ACADEMY
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                  START FROM ZERO • MASTER ETHICAL HACKING
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Quick navigation pills (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {/* Permanent WHERE AM I Trigger */}
            <button
              onClick={() => setIsWhereAmIOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:bg-cyan-900/80 hover:text-white cursor-pointer"
              title="Click anytime to see where you are and your telemetry"
            >
              <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              WHERE AM I?
            </button>

            {/* Permanent WHAT NEXT Trigger */}
            <button
              onClick={() => setIsWhereAmIOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 bg-indigo-950/80 text-indigo-300 border border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:bg-indigo-900/80 hover:text-white cursor-pointer"
              title="Click anytime for AMAN's deterministic next action"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              WHAT NEXT?
            </button>

            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              DASHBOARD
            </Link>
            <Link
              to="/roadmap"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                location.pathname === '/roadmap' || location.pathname === '/learning-path'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              ROADMAP
            </Link>
            <Link
              to="/modules"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                location.pathname.startsWith('/modules') || location.pathname.startsWith('/learn/module')
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              CYBER LABS
            </Link>
            <Link
              to="/practice"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                location.pathname.startsWith('/practice')
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              PRACTICE HUB
            </Link>
            <Link
              to="/missions"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                location.pathname === '/missions'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              MISSIONS
            </Link>
            <Link
              to="/linux-lab"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                location.pathname === '/linux-lab'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              LINUX LAB
            </Link>
            <Link
              to="/ctf-arena"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                location.pathname === '/ctf-arena'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              CTF ARENA
            </Link>
            <Link
              to="/ai-mentor"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                location.pathname === '/ai-mentor'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-purple-400 hover:text-purple-200 hover:bg-purple-950/40'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              AI MENTOR
            </Link>
          </nav>


          {/* Right: Operator Telemetry & Profile Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile WHERE AM I trigger */}
            <button
              onClick={() => setIsWhereAmIOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
              title="Where am I?"
            >
              <Crosshair className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="hidden xs:inline">POSITION</span>
            </button>

            {/* Mobile WHAT NEXT trigger */}
            <button
              onClick={() => setIsWhereAmIOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
              title="What next?"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="hidden xs:inline">NEXT</span>
            </button>

            {/* Multi-language Selector */}
            <LanguageSelector className="hidden md:block" />

            {/* Cloud Sync Status Indicator */}
            <SyncIndicatorBadge />

            {/* Daily Streak */}
            <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg text-amber-400 font-mono text-xs" title="Daily study streak">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span className="font-bold">{profile.streak}</span>
              <span className="text-[10px] text-amber-500/80 hidden sm:inline">DAYS</span>
            </div>

            {/* Level & XP Gauge */}
            <div className="hidden sm:flex flex-col items-end bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-cyan-400 font-bold">LVL {profile.cyberLevel}</span>
                <span className="text-slate-400 text-[11px]">{profile.xp} / {profile.xpToNextLevel} XP</span>
              </div>
              <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Onboarding / Help Trigger */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
              title="Open Onboarding & Learning Preferences"
              aria-label="Re-open Onboarding Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Profile link */}
            <Link
              to="/settings"
              className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-80 transition-opacity"
              title="Settings & Profile"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
                {profile.codename.slice(0, 2)}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Global WHERE AM I Modal */}
      <WhereAmIModal
        isOpen={isWhereAmIOpen}
        onClose={() => setIsWhereAmIOpen(false)}
      />
    </>
  );
};

