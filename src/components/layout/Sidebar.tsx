import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { WhereAmIModal } from '../common/WhereAmIModal';
import { PlatformFeedbackModal } from '../common/PlatformFeedbackModal';
import {
  Home,
  LayoutDashboard,
  Map,
  Compass,
  Crosshair,
  Network,
  Terminal,
  Server,
  Trophy,
  Building2,
  Bot,
  CalendarCheck,
  GitBranch,
  Award,
  BookOpen,
  FileCheck2,
  Settings,
  ShieldAlert,
  Shield,
  ShieldCheck,
  FolderGit2,
  Search,
  Binary,
  Globe,
  Wrench,
  Briefcase,
  Layers,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  GraduationCap,
  FileText,
  Brain,
  Activity,
  Flame,
  Zap,
  MessageSquare,
  Video
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'Video Academy', path: '/academy', icon: Video, badge: 'ACADEMY', badgeColor: 'bg-rose-950 text-rose-300 border-rose-500/40' },
  { name: 'Cyber Labs', path: '/modules', icon: Terminal, badge: 'MODULES', badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40' },
  { name: 'Practice Labs', path: '/practice', icon: Layers, badge: 'PRACTICE', badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-500/40' },
  { name: 'Skill Library', path: '/skill-library', icon: BookOpen, badge: 'SKILLS', badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/40' },
  { name: 'Roadmap', path: '/roadmap', icon: Compass, badge: 'CAREER', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' },
  { name: 'AMAN AI', path: '/ai-mentor', icon: Bot, badge: 'MENTOR', badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/40' },
  { name: 'Progress', path: '/learning-path', icon: GitBranch, badge: 'LEVELS', badgeColor: 'bg-amber-950 text-amber-300 border-amber-500/40' },
];

const SECONDARY_NAV_ITEMS: { category: string; items: NavItem[] }[] = [
  {
    category: 'TACTICAL SCENARIOS',
    items: [
      { name: 'Job Simulation', path: '/career-simulation', icon: Briefcase, badge: 'CAREER', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' },
      { name: 'Command Center', path: '/command-center', icon: Zap, badge: '5.0 PRO', badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/40' },
      { name: 'Live Incidents', path: '/live-incidents', icon: ShieldAlert, badge: 'UNSOLVED', badgeColor: 'bg-red-950 text-red-300 border-red-500/40' },
      { name: 'Investigation Center', path: '/investigation-center', icon: Shield, badge: 'PHASE 5', badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/40' },
      { name: 'ACE Engagement', path: '/ace', icon: ShieldCheck, badge: 'CLIENT SIM', badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40' },
      { name: 'TryHackMe Rooms', path: '/rooms', icon: Terminal, badge: 'ROOMS', badgeColor: 'bg-red-950 text-red-300 border-red-500/40' },
      { name: 'Missions', path: '/missions', icon: Crosshair, badge: '8 ACTIVE', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/30' },
      { name: 'CTF Arena', path: '/ctf-arena', icon: Trophy, badge: '8 CTFS', badgeColor: 'bg-rose-950 text-rose-400 border-rose-500/30' },
      { name: 'Cyber Range', path: '/cyber-range', icon: Server, badge: 'TARGETS', badgeColor: 'bg-red-950 text-red-400 border-red-500/30' },
      { name: 'Master Cyber Range', path: '/master-cyber-range', icon: Server, badge: 'PRO', badgeColor: 'bg-rose-950 text-rose-400 border-rose-500/30' },
      { name: 'SOC Simulator', path: '/practice/soc-simulator', icon: ShieldAlert, badge: 'SIEM', badgeColor: 'bg-blue-950 text-blue-400 border-blue-500/30' },
      { name: 'Threat Hunting', path: '/practice/threat-hunting', icon: Search, badge: 'DFIR', badgeColor: 'bg-purple-950 text-purple-400 border-purple-500/30' },
      { name: 'Linux & Bandit', path: '/linux-lab', icon: Terminal, badge: 'WARGAMES', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/30' },
      { name: 'Web Security Lab', path: '/practice/web-security', icon: Globe, badge: 'OWASP', badgeColor: 'bg-amber-950 text-amber-400 border-amber-500/30' },
      { name: 'Subnetting & IP', path: '/practice/subnetting', icon: Binary, badge: 'CIDR', badgeColor: 'bg-cyan-950 text-cyan-400 border-cyan-500/30' },
      { name: 'Packet Visualizer', path: '/visualizer', icon: Network, badge: 'SIM', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' },
    ]
  },
  {
    category: 'INTELLIGENCE & MASTERY',
    items: [
      { name: 'Career Roles', path: '/roles', icon: Briefcase, badge: '12 PATHS', badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40' },
      { name: 'Skill Tree', path: '/skill-tree', icon: GitBranch },
      { name: 'My Mistakes', path: '/mistakes', icon: Brain, badge: 'DRILLS', badgeColor: 'bg-amber-950 text-amber-300 border-amber-500/40' },
      { name: 'Learning Health', path: '/analytics', icon: Activity, badge: 'STATS', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' },
      { name: 'Exam Assessment', path: '/exam-mode', icon: Flame, badge: 'CERT', badgeColor: 'bg-red-950 text-red-300 border-red-500/40' },
      { name: 'Real Incidents', path: '/real-incidents', icon: ShieldAlert, badge: '15 CASES', badgeColor: 'bg-red-950 text-red-400 border-red-500/30' },
      { name: 'Real Cases', path: '/real-cases', icon: Shield, badge: '30 CASES', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/30' },
      { name: 'Tool Reasoning', path: '/multi-tool', icon: Zap },
    ]
  },
  {
    category: 'RESOURCES & SETTINGS',
    items: [
      { name: 'Acquisition Portal', path: '/acquisition', icon: Building2, badge: 'BUYER', badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40' },
      { name: 'Admin Control', path: '/admin', icon: ShieldAlert, badge: 'OWNER', badgeColor: 'bg-rose-950 text-rose-300 border-rose-500/40' },
      { name: 'AI Study Plan', path: '/ai-study-plan', icon: CalendarCheck },
      { name: 'Security Report AI', path: '/security-report', icon: FileText },
      { name: 'Evidence Locker', path: '/evidence-locker', icon: FolderGit2, badge: 'ACE', badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/40' },
      { name: 'Career Portfolio', path: '/portfolio', icon: Briefcase, badge: 'VERIFIED', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/30' },
      { name: 'Certificates', path: '/certificate', icon: FileCheck2 },
      { name: 'Cheat Sheets', path: '/cheat-sheets', icon: FileText },
      { name: 'Instructor Portal', path: '/instructor', icon: GraduationCap },
      { name: 'Rewards Shop', path: '/rewards', icon: ShoppingBag },
      { name: 'Notebook', path: '/notebook', icon: BookOpen },
      { name: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isWhereAmIOpen, setIsWhereAmIOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          
          {/* Telemetry Actions */}
          <div className="px-1 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsWhereAmIOpen(true);
                if (window.innerWidth < 1024) onClose();
              }}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 font-mono text-[11px] font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all cursor-pointer group"
            >
              <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>WHERE AM I?</span>
            </button>

            <button
              onClick={() => {
                setIsWhereAmIOpen(true);
                if (window.innerWidth < 1024) onClose();
              }}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-indigo-950/90 to-purple-950/90 border border-indigo-500/40 text-indigo-300 hover:text-white hover:border-indigo-400 font-mono text-[11px] font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(99,102,241,0.15)] transition-all cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>WHAT NEXT?</span>
            </button>
          </div>

          {/* PRIMARY NAVIGATION (6 CLEAN LINKS) */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center justify-between">
              <span>PRIMARY ACADEMY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            {PRIMARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all group ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono font-extrabold ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* MORE TOOLS EXPANDABLE ACCORDION */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => setShowMore(!showMore)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>MORE ACADEMY TOOLS</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showMore ? 'rotate-90 text-cyan-400' : ''}`} />
            </button>

            {showMore && (
              <div className="space-y-4 pt-1 pl-1">
                {SECONDARY_NAV_ITEMS.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-1">
                    <div className="px-2 pb-1 text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                      {group.category}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all group ${
                              isActive
                                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                            }`
                          }
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
                            <span className="truncate">{item.name}</span>
                          </div>

                          {item.badge && (
                            <span className={`text-[9px] px-1 py-0.2 rounded border font-mono shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FEEDBACK BUTTON */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                setIsFeedbackOpen(true);
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 text-slate-400 hover:text-slate-200 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <MessageSquare className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
              <span>SUBMIT FEEDBACK</span>
            </button>
          </div>

        </div>

        {/* Sidebar Footer status card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 text-[11px] font-mono space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>SECURITY SCOPE</span>
              <span className="text-emerald-400 font-bold">CONTAINED</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>LAB ENGINE</span>
              <NavLink to="/debug" onClick={() => { if (window.innerWidth < 1024) onClose(); }} className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline">
                STAGE 1 SIM (DEV)
              </NavLink>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>AI AGENT</span>
              <span className="text-purple-400 font-bold">AMAN AUTONOMOUS</span>
            </div>
          </div>
        </div>
      </aside>

      <WhereAmIModal
        isOpen={isWhereAmIOpen}
        onClose={() => setIsWhereAmIOpen(false)}
      />
      
      <PlatformFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
};
