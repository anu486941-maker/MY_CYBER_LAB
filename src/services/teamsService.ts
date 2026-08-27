/**
 * Cyber Teams Service
 * Manages Academy, SOC, CTF, and Enterprise teams with invitation codes and team XP tracking.
 */

export interface CyberTeam {
  id: string;
  name: string;
  type: 'ACADEMY' | 'SOC_TEAM' | 'CTF_SQUAD' | 'ENTERPRISE';
  description: string;
  inviteCode: string;
  leaderUserId: string;
  memberUserIds: string[];
  teamXp: number;
  globalRank: number;
  createdAt: string;
}

const TEAMS_STORAGE_KEY = 'mcl_cyber_teams_v1';

export const INITIAL_TEAMS: CyberTeam[] = [
  {
    id: 'team-blue-shadows',
    name: 'Blue Shadows SOC Elite',
    type: 'SOC_TEAM',
    description: 'Premier defensive incident response and threat hunting team.',
    inviteCode: 'BLUE-8891-SOC',
    leaderUserId: 'user-lead-01',
    memberUserIds: ['user-lead-01', 'user-analyst-02', 'user-analyst-03'],
    teamXp: 18450,
    globalRank: 1,
    createdAt: '2026-08-01'
  },
  {
    id: 'team-red-vipers',
    name: 'Red Vipers Offensive Squad',
    type: 'CTF_SQUAD',
    description: 'Authorized pentesting and CTF challenge speedrunners.',
    inviteCode: 'RED-1337-CTF',
    leaderUserId: 'user-red-01',
    memberUserIds: ['user-red-01', 'user-red-02'],
    teamXp: 15200,
    globalRank: 2,
    createdAt: '2026-08-05'
  }
];

export function getCyberTeams(): CyberTeam[] {
  try {
    const raw = localStorage.getItem(TEAMS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load cyber teams:', e);
  }
  return INITIAL_TEAMS;
}

export function saveCyberTeams(teams: CyberTeam[]): void {
  try {
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  } catch (e) {
    console.warn('Failed to save cyber teams:', e);
  }
}

export function createCyberTeam(
  name: string,
  type: CyberTeam['type'],
  description: string,
  leaderUserId: string
): CyberTeam {
  const teams = getCyberTeams();
  const newTeam: CyberTeam = {
    id: `team-${Date.now()}`,
    name,
    type,
    description,
    inviteCode: `${type.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
    leaderUserId,
    memberUserIds: [leaderUserId],
    teamXp: 500,
    globalRank: teams.length + 1,
    createdAt: new Date().toISOString()
  };
  teams.push(newTeam);
  saveCyberTeams(teams);
  return newTeam;
}

export function joinTeamByInviteCode(inviteCode: string, userId: string): CyberTeam | null {
  const teams = getCyberTeams();
  const match = teams.find(t => t.inviteCode.trim().toUpperCase() === inviteCode.trim().toUpperCase());
  if (!match) return null;

  if (!match.memberUserIds.includes(userId)) {
    match.memberUserIds.push(userId);
    saveCyberTeams(teams);
  }
  return match;
}
