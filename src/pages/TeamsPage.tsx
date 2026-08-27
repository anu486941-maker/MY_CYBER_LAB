import React, { useState } from 'react';
import { Users, Shield, Plus, Key, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getCyberTeams, createCyberTeam, joinTeamByInviteCode, CyberTeam } from '../services/teamsService';
import { useApp } from '../context/AppContext';

export const TeamsPage: React.FC = () => {
  const { currentUser } = useApp();
  const [teams, setTeams] = useState<CyberTeam[]>(getCyberTeams());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamType, setNewTeamType] = useState<CyberTeam['type']>('SOC_TEAM');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  const handleJoinTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const joined = joinTeamByInviteCode(joinCodeInput, currentUser?.uid || 'guest-user');
    if (joined) {
      setTeams(getCyberTeams());
      setJoinCodeInput('');
      alert(`Successfully joined ${joined.name}!`);
    } else {
      alert('Invalid invitation code.');
    }
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    createCyberTeam(newTeamName, newTeamType, newTeamDesc, currentUser?.uid || 'guest-user');
    setTeams(getCyberTeams());
    setShowCreateModal(false);
    setNewTeamName('');
    setNewTeamDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            Collaborative Cyber Operations
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Cyber Teams & Academy Squads</h1>
          <p className="text-sm text-slate-400 mt-1">
            Form or join authorized security teams, pool team XP, and complete collaborative incident missions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Cyber Team
        </button>
      </div>

      {/* Join Team by Code Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" /> Have a Team Invitation Code?
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Enter invitation code issued by your team lead.</p>
        </div>
        <form onSubmit={handleJoinTeam} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="e.g. BLUE-8891-SOC"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500 w-full md:w-56"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shrink-0"
          >
            Join Team
          </button>
        </form>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map(t => (
          <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {t.type}
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{t.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{t.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Global Rank</span>
                <span className="text-2xl font-extrabold text-amber-400">#{t.globalRank}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-cyan-400" /> {t.memberUserIds.length} Members
              </span>
              <span className="font-mono text-cyan-300 font-bold">{t.teamXp.toLocaleString()} Team XP</span>
              <span className="font-mono bg-slate-950 px-2 py-1 rounded text-slate-300 border border-slate-800">
                Code: {t.inviteCode}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 text-slate-100">
            <h3 className="text-xl font-bold text-white">Create Cyber Team</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Team Category</label>
                <select
                  value={newTeamType}
                  onChange={(e) => setNewTeamType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500"
                >
                  <option value="SOC_TEAM">SOC Defense Team</option>
                  <option value="CTF_SQUAD">CTF & Offensive Squad</option>
                  <option value="ACADEMY">University / Training Academy</option>
                  <option value="ENTERPRISE">Enterprise Security Team</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Team Description</label>
                <textarea
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-xs font-bold text-white rounded-lg hover:bg-cyan-500"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
