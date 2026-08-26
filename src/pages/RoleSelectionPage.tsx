import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllPersonalizedRoles, RolePersonalizationConfig } from '../services/rolePersonalization';
import { 
  Shield, 
  Terminal, 
  Globe, 
  Crosshair, 
  Search, 
  Cloud, 
  Building2, 
  Code, 
  AlertTriangle, 
  Flag, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  DollarSign,
  Layers,
  Wrench,
  Bot
} from 'lucide-react';

const CATEGORY_TABS = ['All Roles', 'Defensive', 'Offensive', 'Enterprise & Cloud', 'Engineering', 'Beginner'] as const;

export const RoleSelectionPage: React.FC = () => {
  const { profile, updateProfile, currentUser } = useApp();
  const navigate = useNavigate();
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('All Roles');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeHoverRole, setActiveHoverRole] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedRoleState, setSelectedRoleState] = useState<string>(
    (profile.selectedRole as string) || (profile.targetRole as string) || 'soc-analyst'
  );

  const allRoles = getAllPersonalizedRoles();

  const filteredRoles = allRoles.filter(role => {
    const matchesCategory = selectedCategoryId === 'All Roles' || role.category === selectedCategoryId;
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          role.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          role.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectRole = async (role: RolePersonalizationConfig) => {
    setIsSaving(true);
    setSelectedRoleState(role.id);

    try {
      const nowIso = new Date().toISOString();
      updateProfile({
        selectedRole: role.id,
        roleSelectedAt: nowIso,
        targetRole: role.id,
        onboardingCompleted: true
      });

      // Brief delay for visual feedback and state sync
      setTimeout(() => {
        setIsSaving(false);
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      console.error('Failed to save role selection:', err);
      setIsSaving(false);
      navigate('/dashboard');
    }
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'soc-analyst': return <Shield className="w-6 h-6 text-cyan-400" />;
      case 'pentester': return <Terminal className="w-6 h-6 text-rose-400" />;
      case 'web-security': return <Globe className="w-6 h-6 text-emerald-400" />;
      case 'threat-hunter': return <Crosshair className="w-6 h-6 text-amber-400" />;
      case 'digital-forensics': return <Search className="w-6 h-6 text-purple-400" />;
      case 'cloud-security': return <Cloud className="w-6 h-6 text-sky-400" />;
      case 'active-directory': return <Building2 className="w-6 h-6 text-blue-400" />;
      case 'security-python': return <Code className="w-6 h-6 text-teal-400" />;
      case 'incident-responder': return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      case 'ctf-ethical-hacker': return <Flag className="w-6 h-6 text-yellow-400" />;
      case 'beginner-explore': return <Compass className="w-6 h-6 text-green-400" />;
      default: return <Shield className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div id="role-selection-page" className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            AMAN Role Personalization Engine
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Choose Your <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Cybersecurity Career Role</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Select your specialized learning track. AMAN AI will personalize your modules, daily lab objectives, 
            tactical incident missions, and CTF challenges based on your chosen career path.
          </p>

          {profile.selectedRole && (
            <div className="inline-block bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400">
              Current Role: <span className="font-semibold text-cyan-400">{allRoles.find(r => r.id === profile.selectedRole)?.title || profile.selectedRole}</span>
              {' • '}
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-slate-300 hover:text-white underline ml-1"
              >
                Skip & Return to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {CATEGORY_TABS.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryId(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategoryId === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, tools, skills..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map(role => {
            const isSelected = selectedRoleState === role.id;
            const isHovered = activeHoverRole === role.id;

            return (
              <div
                key={role.id}
                onMouseEnter={() => setActiveHoverRole(role.id)}
                onMouseLeave={() => setActiveHoverRole(null)}
                className={`flex flex-col justify-between bg-slate-900/90 border rounded-2xl p-6 transition-all duration-200 relative overflow-hidden ${
                  isSelected 
                    ? 'border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50' 
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Accent glow on top */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  role.category === 'Defensive' ? 'bg-cyan-500' :
                  role.category === 'Offensive' ? 'bg-rose-500' :
                  role.category === 'Enterprise & Cloud' ? 'bg-sky-500' :
                  role.category === 'Engineering' ? 'bg-teal-500' : 'bg-emerald-500'
                }`} />

                <div>
                  {/* Top Role Meta */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                        {role.emoji}
                      </div>
                      <div>
                        <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                          {role.badge}
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {role.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      role.demandLevel === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      role.demandLevel === 'Very High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {role.demandLevel} Demand
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-xs leading-relaxed mb-4 min-h-[48px]">
                    {role.shortDescription}
                  </p>

                  {/* Compensation & Category Tag */}
                  <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
                    <div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> Avg Salary
                      </div>
                      <div className="text-xs font-semibold text-slate-200 mt-0.5">
                        {role.salaryRange}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Layers className="w-3 h-3 text-cyan-400" /> Category
                      </div>
                      <div className="text-xs font-semibold text-slate-200 mt-0.5">
                        {role.category}
                      </div>
                    </div>
                  </div>

                  {/* Core Tools */}
                  <div className="space-y-1.5 mb-6">
                    <div className="text-[11px] font-mono font-medium text-slate-400 flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-cyan-400" /> Core Tools & Stack:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.tools.slice(0, 4).map((tool, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                        >
                          {tool}
                        </span>
                      ))}
                      {role.tools.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-950/50 text-[10px] font-mono text-slate-400">
                          +{role.tools.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSelectRole(role)}
                  disabled={isSaving}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400'
                      : 'bg-slate-800 text-slate-200 hover:bg-cyan-600 hover:text-white border border-slate-700 hover:border-cyan-500'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      SELECTED ROLE • LAUNCH DASHBOARD
                    </>
                  ) : (
                    <>
                      SELECT THIS ROLE
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>
            );
          })}
        </div>

        {/* Bottom Tip */}
        <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-800/80">
          💡 You can switch your primary career role at any time. All completed labs, XP, and credentials will be preserved.
        </div>

      </div>
    </div>
  );
};
export default RoleSelectionPage;
