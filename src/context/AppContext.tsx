import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { User, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UnifiedLearningEngine, UnifiedLearningState } from '../utils/unifiedLearningEngine';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import { speechEngine } from '../utils/speechEngine';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import {
  UserProfile,
  LevelModule,
  Mission,
  CTFChallenge,
  Achievement,
  NotebookEntry,
  Lesson,
  SyncStatus,
  Bookmark,
  CertificateInfo,
  CertificateRecord,
  VideoHistoryItem,
  AiStudyPlanHistoryItem,
  UserLearningState,
  LanguagePreference,
  EvidenceItem,
  SecurityFinding,
  EngagementReport
} from '../types';
import {
  SkillMasteryRecord,
  LearnerMistake,
  TrainingMode,
  LearningHealthMetrics
} from '../types/intelligence';
import {
  INITIAL_USER_PROFILE,
  LEARNING_PATH_LEVELS,
  INITIAL_MISSIONS,
  CTF_CHALLENGES,
  ACHIEVEMENTS_DATA,
  INITIAL_NOTEBOOK_ENTRIES
} from '../data/mockData';
import { getEthicalHackerCurriculum, getSocAnalystCurriculum } from '../data/careerCurriculum';
import { CareerTrackState } from '../types';
import {
  INITIAL_SKILL_MASTERIES,
  INITIAL_MISTAKES
} from '../data/intelligenceData';
import {
  INITIAL_EVIDENCE_ITEMS,
  INITIAL_SECURITY_FINDINGS,
  INITIAL_ENGAGEMENT_REPORTS
} from '../data/aceSeedData';
import { computeEvidenceHash } from '../utils/evidenceIntegrity';
import { evaluateFindingQuality } from '../utils/cvssCalculator';
import { securityAuditLogger } from '../utils/securityAuditLogger';

interface AppContextType {
  // Auth state
  currentUser: User | null;
  user: User | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;

  // Sync state & indicators
  syncStatus: SyncStatus;
  isOnline: boolean;
  lastSyncedTime: string | null;
  syncErrorMessage: string | null;
  syncNow: () => Promise<void>;

  // Core Learning State
  learningState: UnifiedLearningState;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  levels: LevelModule[];
  missions: Mission[];
  ctfChallenges: CTFChallenge[];
  achievements: Achievement[];
  notes: NotebookEntry[];
  bookmarks: Bookmark[];
  certificateInfo: CertificateInfo | null;
  certificatesList: CertificateRecord[];
  videoHistory: VideoHistoryItem[];
  aiStudyPlanHistory: AiStudyPlanHistoryItem[];
  quizScores: Record<string, number>;
  labScores: Record<string, number>;
  ctfScores: Record<string, number>;
  weakSkills: string[];
  strongSkills: string[];
  studyTime: number; // in minutes
  currentTopic: string;
  completedMissions: string[];

  // PRO INTELLIGENCE & MASTERY SYSTEMS
  skillMasteries: SkillMasteryRecord[];
  updateSkillMastery: (skillId: string, updates: Partial<SkillMasteryRecord>) => void;
  getSkillMastery: (skillId: string) => SkillMasteryRecord | undefined;
  mistakes: LearnerMistake[];
  recordMistake: (mistake: {
    title: string;
    category: string;
    whyItHappens: string;
    howToFixIt: string;
    relatedSkillId: string;
    drillQuestion: {
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      hint: string;
    };
  }) => void;
  resolveMistake: (mistakeId: string) => void;
  trainingMode: TrainingMode;
  setTrainingMode: (mode: TrainingMode) => void;
  toolReasoningScores: Record<string, number>;
  recordToolReasoningScore: (scenarioId: string, score: number) => void;
  learningHealth: LearningHealthMetrics;
  language: LanguagePreference;
  setLanguage: (lang: LanguagePreference) => void;
  completeSpacedReview: (reviewId: string, success: boolean) => void;
  amanGuidedMode: boolean;
  setAmanGuidedMode: (mode: boolean) => void;

  // Modals & Active selections
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson | null) => void;
  selectedMission: Mission | null;
  setSelectedMission: (mission: Mission | null) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;

  // Actions
  completeLesson: (lessonId: string, levelId: number, score?: number) => void;
  toggleMissionObjective: (missionId: string, objectiveId: string) => void;
  completeMission: (missionId: string) => void;
  submitCtfFlag: (challengeId: string, flag: string) => Promise<{ success: boolean; message: string }>;
  unlockCtfHint: (challengeId: string, hintIndex: number) => void;
  addNote: (note: Omit<NotebookEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addNotebookNote: (
    titleOrObj: string | { title: string; content: string; category?: string; tags?: string[] },
    content?: string,
    category?: string,
    tags?: string[]
  ) => void;
  updateNote: (id: string, note: Partial<NotebookEntry>) => void;
  deleteNote: (id: string) => void;
  toggleBookmark: (bookmark: Omit<Bookmark, 'id' | 'addedAt'>) => void;
  isBookmarked: (urlOrRef: string) => boolean;
  recordVideoWatched: (video: Omit<VideoHistoryItem, 'id' | 'watchedAt'>) => void;
  saveAiStudyPlan: (plan: Omit<AiStudyPlanHistoryItem, 'id' | 'generatedAt'>) => void;
  recordLabScore: (labId: string, score: number) => void;
  generateCertificate: () => CertificateInfo;
  issueCertificate: (courseName?: string) => CertificateRecord;
  revokeCertificate: (certId: string) => void;
  getCertificateById: (certId: string) => CertificateRecord | undefined;
  setCurrentTopic: (topic: string) => void;
  resetAllProgress: () => void;
  resetAllData: () => void;
  addXp: (amount: number, reason?: string) => void;
  awardAchievement: (idOrCodeOrTitle: string) => boolean;
  trackStudyTime: (minutes: number) => void;

  // AUTHORIZED CLIENT ENGAGEMENT (ACE) & FORENSIC EVIDENCE ACTIONS
  evidenceLocker: EvidenceItem[];
  addEvidence: (evidence: Omit<EvidenceItem, 'id' | 'timestamp'>) => EvidenceItem;
  deleteEvidence: (id: string) => void;
  securityFindings: SecurityFinding[];
  addFinding: (finding: Omit<SecurityFinding, 'id'>) => SecurityFinding;
  updateFinding: (id: string, updates: Partial<SecurityFinding>) => void;
  deleteFinding: (id: string) => void;
  retestFinding: (findingId: string, command: string, output: string) => { success: boolean; message: string };
  engagementReports: EngagementReport[];
  saveEngagementReport: (report: Omit<EngagementReport, 'id' | 'createdAt'>) => EngagementReport;
  activeEngagementId: string | null;
  setActiveEngagementId: (id: string | null) => void;

  // Track state
  activeCareerTrack: 'ETHICAL_HACKER' | 'SOC_ANALYST';
  setActiveCareerTrack: (track: 'ETHICAL_HACKER' | 'SOC_ANALYST') => void;
  careerProgress: Record<string, CareerTrackState>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Sync state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(navigator.onLine ? 'SYNCED' : 'OFFLINE');
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(() => localStorage.getItem('mcl_last_synced') || null);
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);

  // Core Learning State with offline localStorage fallback
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mcl_profile') || localStorage.getItem('mycyberlab_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER_PROFILE;
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [levels, setLevels] = useState<LevelModule[]>(() => {
    const saved = localStorage.getItem('mcl_levels') || localStorage.getItem('mycyberlab_levels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return LEARNING_PATH_LEVELS;
      }
    }
    return LEARNING_PATH_LEVELS;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('mcl_missions') || localStorage.getItem('mycyberlab_missions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MISSIONS;
      }
    }
    return INITIAL_MISSIONS;
  });

  const [ctfChallenges, setCtfChallenges] = useState<CTFChallenge[]>(() => {
    const saved = localStorage.getItem('mcl_ctf') || localStorage.getItem('mycyberlab_ctf');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return CTF_CHALLENGES;
      }
    }
    return CTF_CHALLENGES;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('mcl_achievements') || localStorage.getItem('mycyberlab_achievements');
    if (saved) {
      try {
        const parsed: Achievement[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with ACHIEVEMENTS_DATA to preserve unlocked states while including any new badges
          return ACHIEVEMENTS_DATA.map(baseAch => {
            const found = parsed.find(p => p.id === baseAch.id || p.code === baseAch.code || p.title.toLowerCase() === baseAch.title.toLowerCase());
            return found ? { ...baseAch, ...found } : baseAch;
          });
        }
      } catch {
        return ACHIEVEMENTS_DATA;
      }
    }
    return ACHIEVEMENTS_DATA;
  });

  const [notes, setNotes] = useState<NotebookEntry[]>(() => {
    const saved = localStorage.getItem('mcl_notes') || localStorage.getItem('mycyberlab_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTEBOOK_ENTRIES;
      }
    }
    return INITIAL_NOTEBOOK_ENTRIES;
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('mcl_bookmarks');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  const [certificatesList, setCertificatesList] = useState<CertificateRecord[]>(() => {
    const saved = localStorage.getItem('mcl_certificates_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    // Default pre-seeded verified credential for testing & demo
    return [
      {
        certificateId: 'MCL-2026-CYB-8F42A1',
        learnerName: 'Alex Vance',
        codename: 'CIPHER-01',
        courseName: 'Practical Ethical Hacking & Defensive Cybersecurity',
        certificateTitle: 'Certificate of Completion',
        completionDate: 'August 22, 2026',
        issueDate: 'August 22, 2026',
        trainingHours: 42,
        finalScore: 96,
        lessonsCompletedCount: 32,
        labsCompletedCount: 16,
        missionsCompletedCount: 8,
        toolsMasteredCount: 14,
        skillsCovered: [
          'Linux Terminal & File System Security',
          'TCP/IP & OSI Layer Network Diagnostics',
          'Port Scanning & Reconnaissance (Nmap)',
          'Web Application Vulnerabilities (OWASP Top 10)',
          'SOC Telemetry & Log Investigation',
          'Capture The Flag (CTF) Methodologies',
          'Ethical Rules of Engagement & Defensive Hardening'
        ],
        verificationCode: 'SHA256:8f42a1b9c3e47a28e5d01249b6f1789c0a',
        verificationUrl: '/verify-certificate?id=MCL-2026-CYB-8F42A1',
        status: 'ISSUED',
        issuer: {
          academyName: 'My Cyber Lab Academy',
          director: 'Dr. Evelyn Cross, CISSP',
          title: 'Academic Director & Lead Cyber Examiner',
          sealNumber: 'SEAL-2026-AUTH-904'
        }
      }
    ];
  });

  const [certificateInfo, setCertificateInfo] = useState<CertificateInfo | null>(() => {
    const saved = localStorage.getItem('mcl_certificate');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [videoHistory, setVideoHistory] = useState<VideoHistoryItem[]>(() => {
    const saved = localStorage.getItem('mcl_video_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  const [aiStudyPlanHistory, setAiStudyPlanHistory] = useState<AiStudyPlanHistoryItem[]>(() => {
    const saved = localStorage.getItem('mcl_study_plan_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('mcl_quiz_scores');
    if (saved) {
      try { return JSON.parse(saved); } catch { return {}; }
    }
    return {};
  });

  const [labScores, setLabScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('mcl_lab_scores');
    if (saved) {
      try { return JSON.parse(saved); } catch { return {}; }
    }
    return {};
  });

  const [ctfScores, setCtfScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('mcl_ctf_scores');
    if (saved) {
      try { return JSON.parse(saved); } catch { return {}; }
    }
    return {};
  });

  const [weakSkills, setWeakSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem('mcl_weak_skills');
    if (saved) {
      try { return JSON.parse(saved); } catch { return ['Reverse Engineering', 'Active Directory PrivEsc']; }
    }
    return ['Reverse Engineering', 'Active Directory PrivEsc'];
  });

  const [amanGuidedMode, setAmanGuidedModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('mcl_aman_guided_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const setAmanGuidedMode = useCallback((mode: boolean) => {
    setAmanGuidedModeState(mode);
    try { localStorage.setItem('mcl_aman_guided_mode', String(mode)); } catch {}
  }, []);

  const [strongSkills, setStrongSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem('mcl_strong_skills');
    if (saved) {
      try { return JSON.parse(saved); } catch { return ['Linux Fundamentals', 'Network Port Scanning']; }
    }
    return ['Linux Fundamentals', 'Network Port Scanning'];
  });

  const [studyTime, setStudyTime] = useState<number>(() => {
    const saved = localStorage.getItem('mcl_study_time');
    return saved ? parseInt(saved, 10) : 180; // 3 hours default
  });

  const [currentTopic, setCurrentTopic] = useState<string>(() => {
    return localStorage.getItem('mcl_current_topic') || 'Linux Shell & Navigation';
  });

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    const saved = localStorage.getItem('mcl_completed_missions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return INITIAL_MISSIONS.filter(m => m.status === 'completed' || m.completed).map(m => m.id);
  });

  // PRO INTELLIGENCE & MASTERY STATES
  const [skillMasteries, setSkillMasteries] = useState<SkillMasteryRecord[]>(() => {
    const saved = localStorage.getItem('mcl_skill_masteries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_SKILL_MASTERIES;
  });

  const [mistakes, setMistakes] = useState<LearnerMistake[]>(() => {
    const saved = localStorage.getItem('mcl_mistakes_journal');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_MISTAKES;
  });

  const [trainingMode, setTrainingModeState] = useState<TrainingMode>(() => {
    const saved = localStorage.getItem('mcl_training_mode');
    return (saved === 'EXAM' ? 'EXAM' : 'MENTOR') as TrainingMode;
  });

  // Track State
  const [activeCareerTrack, setActiveCareerTrackState] = useState<'ETHICAL_HACKER' | 'SOC_ANALYST'>(() => {
    return (localStorage.getItem('mcl_active_career_track') || 'ETHICAL_HACKER') as 'ETHICAL_HACKER' | 'SOC_ANALYST';
  });

  const [careerProgress, setCareerProgress] = useState<Record<string, CareerTrackState>>(() => {
    const saved = localStorage.getItem('mcl_career_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  const [toolReasoningScores, setToolReasoningScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('mcl_tool_reasoning_scores');
    if (saved) {
      try { return JSON.parse(saved); } catch { return {}; }
    }
    return { 'scen-01': 95 };
  });

  // AUTHORIZED CLIENT ENGAGEMENT (ACE) STATE
  const [evidenceLocker, setEvidenceLocker] = useState<EvidenceItem[]>(() => {
    const savedTrack = localStorage.getItem('mcl_active_career_track') || 'ETHICAL_HACKER';
    const savedCP = localStorage.getItem('mcl_career_progress');
    if (savedCP) {
      try {
        const parsedCP = JSON.parse(savedCP);
        if (parsedCP[savedTrack]?.evidenceLocker && Array.isArray(parsedCP[savedTrack].evidenceLocker)) {
          return parsedCP[savedTrack].evidenceLocker;
        }
      } catch {}
    }
    const saved = localStorage.getItem('mcl_evidence_locker');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_EVIDENCE_ITEMS;
  });

  // Keep track-specific evidence locker synchronized
  useEffect(() => {
    localStorage.setItem('mcl_evidence_locker', JSON.stringify(evidenceLocker));
    setCareerProgress(prev => {
      const trackState = prev[activeCareerTrack] || {
        levels: activeCareerTrack === 'ETHICAL_HACKER' ? getEthicalHackerCurriculum() : getSocAnalystCurriculum(),
        missions: INITIAL_MISSIONS,
        ctfChallenges: CTF_CHALLENGES,
        quizScores: {},
        labScores: {},
        ctfScores: {},
        completedMissions: [],
        skillMasteries: INITIAL_SKILL_MASTERIES,
        xp: profile.xp,
        cyberLevel: profile.cyberLevel,
        xpToNextLevel: profile.xpToNextLevel,
        currentTopic,
        evidenceLocker: INITIAL_EVIDENCE_ITEMS
      };
      if (trackState.evidenceLocker === evidenceLocker) return prev;
      const updated = {
        ...prev,
        [activeCareerTrack]: {
          ...trackState,
          evidenceLocker
        }
      };
      localStorage.setItem('mcl_career_progress', JSON.stringify(updated));
      return updated;
    });
  }, [evidenceLocker, activeCareerTrack]);

  const [securityFindings, setSecurityFindings] = useState<SecurityFinding[]>(() => {
    const saved = localStorage.getItem('mcl_security_findings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_SECURITY_FINDINGS;
  });

  const [engagementReports, setEngagementReports] = useState<EngagementReport[]>(() => {
    const saved = localStorage.getItem('mcl_engagement_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_ENGAGEMENT_REPORTS;
  });

  const [activeEngagementId, setActiveEngagementIdState] = useState<string | null>(() => {
    return localStorage.getItem('mcl_active_engagement_id') || 'ace-northstar-01';
  });

  // UI state
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => !profile.onboardingCompleted);

  // Ref to track if state has been loaded from remote
  const hasLoadedRemoteRef = useRef<boolean>(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor online / offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (currentUser) {
        setSyncStatus('SYNCING');
        // trigger background sync
        syncToCloud();
      } else {
        setSyncStatus('SYNCED');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);

  // Initialize and migrate career progress on mount
  useEffect(() => {
    setCareerProgress(prev => {
      const updated = { ...prev };
      let changed = false;

      if (!updated.ETHICAL_HACKER) {
        updated.ETHICAL_HACKER = {
          levels: levels,
          missions: missions,
          ctfChallenges: ctfChallenges,
          quizScores: quizScores,
          labScores: labScores,
          ctfScores: ctfScores,
          completedMissions: completedMissions,
          skillMasteries: skillMasteries,
          xp: profile.xp,
          cyberLevel: profile.cyberLevel,
          xpToNextLevel: profile.xpToNextLevel,
          currentTopic: currentTopic,
          evidenceLocker: evidenceLocker
        };
        changed = true;
      }

      if (!updated.SOC_ANALYST) {
        updated.SOC_ANALYST = {
          levels: getSocAnalystCurriculum(),
          missions: INITIAL_MISSIONS,
          ctfChallenges: CTF_CHALLENGES,
          quizScores: {},
          labScores: {},
          ctfScores: {},
          completedMissions: [],
          skillMasteries: INITIAL_SKILL_MASTERIES,
          xp: 0,
          cyberLevel: 1,
          xpToNextLevel: 1000,
          currentTopic: 'SIEM & Log Analysis',
          evidenceLocker: INITIAL_EVIDENCE_ITEMS
        };
        changed = true;
      }

      if (changed) {
        localStorage.setItem('mcl_career_progress', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, []);

  // Save active track and career progress to localStorage
  useEffect(() => {
    localStorage.setItem('mcl_active_career_track', activeCareerTrack);
  }, [activeCareerTrack]);

  useEffect(() => {
    localStorage.setItem('mcl_career_progress', JSON.stringify(careerProgress));
  }, [careerProgress]);

  // Save all to localStorage as an offline cache
  useEffect(() => {
    localStorage.setItem('mcl_profile', JSON.stringify(profile));
    localStorage.setItem('mycyberlab_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('mcl_levels', JSON.stringify(levels));
    localStorage.setItem('mycyberlab_levels', JSON.stringify(levels));
  }, [levels]);

  useEffect(() => {
    localStorage.setItem('mcl_missions', JSON.stringify(missions));
    localStorage.setItem('mycyberlab_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('mcl_ctf', JSON.stringify(ctfChallenges));
    localStorage.setItem('mycyberlab_ctf', JSON.stringify(ctfChallenges));
  }, [ctfChallenges]);

  useEffect(() => {
    localStorage.setItem('mcl_achievements', JSON.stringify(achievements));
    localStorage.setItem('mycyberlab_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('mcl_notes', JSON.stringify(notes));
    localStorage.setItem('mycyberlab_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('mcl_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('mcl_certificates_list', JSON.stringify(certificatesList));
  }, [certificatesList]);

  useEffect(() => {
    if (certificateInfo) {
      localStorage.setItem('mcl_certificate', JSON.stringify(certificateInfo));
    }
  }, [certificateInfo]);

  useEffect(() => {
    localStorage.setItem('mcl_video_history', JSON.stringify(videoHistory));
  }, [videoHistory]);

  useEffect(() => {
    localStorage.setItem('mcl_study_plan_history', JSON.stringify(aiStudyPlanHistory));
  }, [aiStudyPlanHistory]);

  useEffect(() => {
    localStorage.setItem('mcl_quiz_scores', JSON.stringify(quizScores));
  }, [quizScores]);

  useEffect(() => {
    localStorage.setItem('mcl_lab_scores', JSON.stringify(labScores));
  }, [labScores]);

  useEffect(() => {
    localStorage.setItem('mcl_ctf_scores', JSON.stringify(ctfScores));
  }, [ctfScores]);

  useEffect(() => {
    localStorage.setItem('mcl_weak_skills', JSON.stringify(weakSkills));
  }, [weakSkills]);

  useEffect(() => {
    localStorage.setItem('mcl_strong_skills', JSON.stringify(strongSkills));
  }, [strongSkills]);

  useEffect(() => {
    localStorage.setItem('mcl_study_time', studyTime.toString());
  }, [studyTime]);

  useEffect(() => {
    localStorage.setItem('mcl_current_topic', currentTopic);
  }, [currentTopic]);

  useEffect(() => {
    localStorage.setItem('mcl_completed_missions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  useEffect(() => {
    localStorage.setItem('mcl_skill_masteries', JSON.stringify(skillMasteries));
  }, [skillMasteries]);

  useEffect(() => {
    localStorage.setItem('mcl_mistakes_journal', JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem('mcl_training_mode', trainingMode);
  }, [trainingMode]);

  useEffect(() => {
    localStorage.setItem('mcl_tool_reasoning_scores', JSON.stringify(toolReasoningScores));
  }, [toolReasoningScores]);

  useEffect(() => {
    localStorage.setItem('mcl_evidence_locker', JSON.stringify(evidenceLocker));
  }, [evidenceLocker]);

  useEffect(() => {
    localStorage.setItem('mcl_security_findings', JSON.stringify(securityFindings));
  }, [securityFindings]);

  useEffect(() => {
    localStorage.setItem('mcl_engagement_reports', JSON.stringify(engagementReports));
  }, [engagementReports]);

  useEffect(() => {
    if (activeEngagementId) {
      localStorage.setItem('mcl_active_engagement_id', activeEngagementId);
    }
  }, [activeEngagementId]);

  // Compute Rank based on XP and Level
  const calculateRank = (level: number, xp: number): string => {
    if (level >= 6 || xp >= 5000) return 'CYBER SPECIALIST (TIER 1)';
    if (level >= 4 || xp >= 3000) return 'TACTICAL OPERATOR (TIER 2)';
    if (level >= 2 || xp >= 1500) return 'FIELD RECON (TIER 3)';
    return 'NOVICE CADET (TIER 4)';
  };

  // Sync to Firestore Cloud function
  const syncToCloud = useCallback(async (userToSave?: User | null) => {
    const user = userToSave !== undefined ? userToSave : currentUser;
    if (!user) {
      return;
    }

    if (!navigator.onLine) {
      setSyncStatus('OFFLINE');
      return;
    }

    setSyncStatus('SYNCING');
    setSyncErrorMessage(null);

    try {
      const userRef = doc(db, 'users', user.uid);
      
      const completedLessonIds: string[] = [];
      levels.forEach(lvl => {
        lvl.lessons.forEach(ls => {
          if (ls.completed) completedLessonIds.push(ls.id);
        });
      });

      const unlockedAchievementIds = achievements
         .filter(a => a.unlocked)
         .map(a => a.id);

      const payload: UserLearningState = {
        currentLevel: profile.cyberLevel,
        currentTopic,
        completedLessons: completedLessonIds,
        completedMissions,
        xp: profile.xp,
        rank: calculateRank(profile.cyberLevel, profile.xp),
        achievements: unlockedAchievementIds,
        streak: profile.streak,
        quizScores,
        labScores,
        ctfScores,
        weakSkills,
        strongSkills,
        studyTime,
        preferredLanguage: profile.language,
        preferredLearningStyle: profile.learningStyle,
        dailyStudyTime: profile.dailyTime,
        notes,
        bookmarks,
        certificateInfo,
        videoHistory,
        aiStudyPlanHistory,
        lastSyncedAt: new Date().toISOString(),
        activeCareerTrack,
        careerProgress
      };

      // Also persist the raw module states so exact UI representations restore seamlessly
      await setDoc(userRef, {
        learningState: payload,
        profile,
        levels,
        missions,
        ctfChallenges,
        achievements,
        skillMasteries,
        mistakes,
        trainingMode,
        toolReasoningScores,
        certificatesList,
        activeCareerTrack,
        careerProgress,
        updatedAt: serverTimestamp(),
        email: user.email || '',
        displayName: user.displayName || profile.name
      }, { merge: true });

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncedTime(nowStr);
      localStorage.setItem('mcl_last_synced', nowStr);
      setSyncStatus('SYNCED');
      setSyncErrorMessage(null);
    } catch (err: any) {
      console.error('Firestore synchronization error:', err);
      setSyncStatus('SYNC ERROR');
      setSyncErrorMessage(err?.message || 'Failed to sync with cloud database');
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  }, [
    currentUser,
    profile,
    currentTopic,
    levels,
    missions,
    completedMissions,
    achievements,
    quizScores,
    labScores,
    ctfScores,
    weakSkills,
    strongSkills,
    studyTime,
    notes,
    bookmarks,
    certificateInfo,
    videoHistory,
    aiStudyPlanHistory,
    ctfChallenges,
    skillMasteries,
    mistakes,
    trainingMode,
    toolReasoningScores,
    certificatesList,
    activeCareerTrack,
    careerProgress
  ]);

  // Debounced auto-save whenever core progress changes
  useEffect(() => {
    if (!currentUser || !hasLoadedRemoteRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSyncStatus(navigator.onLine ? 'SYNCING' : 'OFFLINE');

    saveTimeoutRef.current = setTimeout(() => {
      syncToCloud();
    }, 1200);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    profile,
    levels,
    missions,
    completedMissions,
    ctfChallenges,
    achievements,
    notes,
    bookmarks,
    certificateInfo,
    videoHistory,
    aiStudyPlanHistory,
    quizScores,
    labScores,
    ctfScores,
    studyTime,
    currentTopic,
    syncToCloud,
    currentUser,
    skillMasteries,
    mistakes,
    trainingMode,
    toolReasoningScores,
    certificatesList,
    activeCareerTrack,
    careerProgress
  ]);

  // Load progress from Firestore on user sign in
  const loadUserProgressFromCloud = async (user: User) => {
    setSyncStatus('SYNCING');
    setIsAuthLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const ls = data.learningState as UserLearningState | undefined;

        if (data.profile) {
          setProfile(prev => ({
            ...prev,
            ...data.profile,
            name: data.profile.name || user.displayName || prev.name,
            codename: data.profile.codename || prev.codename
          }));
        }

        if (data.levels && Array.isArray(data.levels)) {
          setLevels(data.levels);
        }

        if (data.missions && Array.isArray(data.missions)) {
          setMissions(data.missions);
        }

        if (data.ctfChallenges && Array.isArray(data.ctfChallenges)) {
          setCtfChallenges(data.ctfChallenges);
        }

        if (data.achievements && Array.isArray(data.achievements)) {
          setAchievements(data.achievements);
        }

        if (data.skillMasteries && Array.isArray(data.skillMasteries)) {
          setSkillMasteries(data.skillMasteries);
        }

        if (data.activeCareerTrack) {
          setActiveCareerTrackState(data.activeCareerTrack);
        }

        if (data.careerProgress) {
          setCareerProgress(data.careerProgress);
          const currentTrack = data.activeCareerTrack || activeCareerTrack;
          if (data.careerProgress[currentTrack]?.evidenceLocker && Array.isArray(data.careerProgress[currentTrack].evidenceLocker)) {
            setEvidenceLocker(data.careerProgress[currentTrack].evidenceLocker);
          }
        }

        if (data.mistakes && Array.isArray(data.mistakes)) {
          setMistakes(data.mistakes);
        }

        if (data.trainingMode) {
          setTrainingModeState(data.trainingMode);
        }

        if (data.toolReasoningScores) {
          setToolReasoningScores(data.toolReasoningScores);
        }

        if (data.certificatesList && Array.isArray(data.certificatesList)) {
          setCertificatesList(data.certificatesList);
        }

        if (ls) {
          if (ls.completedMissions && Array.isArray(ls.completedMissions)) {
            setCompletedMissions(ls.completedMissions);
          }
          if (ls.notes && Array.isArray(ls.notes)) setNotes(ls.notes);
          if (ls.bookmarks && Array.isArray(ls.bookmarks)) setBookmarks(ls.bookmarks);
          if (ls.certificateInfo) setCertificateInfo(ls.certificateInfo);
          if (ls.videoHistory && Array.isArray(ls.videoHistory)) setVideoHistory(ls.videoHistory);
          if (ls.aiStudyPlanHistory && Array.isArray(ls.aiStudyPlanHistory)) setAiStudyPlanHistory(ls.aiStudyPlanHistory);
          if (ls.quizScores) setQuizScores(ls.quizScores);
          if (ls.labScores) setLabScores(ls.labScores);
          if (ls.ctfScores) setCtfScores(ls.ctfScores);
          if (ls.weakSkills && Array.isArray(ls.weakSkills)) setWeakSkills(ls.weakSkills);
          if (ls.strongSkills && Array.isArray(ls.strongSkills)) setStrongSkills(ls.strongSkills);
          if (typeof ls.studyTime === 'number') setStudyTime(ls.studyTime);
          if (ls.currentTopic) setCurrentTopic(ls.currentTopic);
        }

        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncedTime(nowStr);
        setSyncStatus('SYNCED');
      } else {
        // Document doesn't exist yet, push initial local data to Firestore
        hasLoadedRemoteRef.current = true;
        await syncToCloud(user);
      }
    } catch (err: any) {
      console.error('Error loading user progress from Firestore:', err);
      setSyncStatus('SYNC ERROR');
      setSyncErrorMessage(err?.message || 'Error loading cloud data. Using local offline cache.');
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
    } finally {
      hasLoadedRemoteRef.current = true;
      setIsAuthLoading(false);
    }
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProgressFromCloud(user);
      } else {
        hasLoadedRemoteRef.current = true;
        setIsAuthLoading(false);
        setSyncStatus(navigator.onLine ? 'SYNCED' : 'OFFLINE');
      }
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In with popup fallback
  const signInWithGoogle = async () => {
    try {
      setIsAuthLoading(true);
      setSyncStatus('SYNCING');
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Progress will be loaded via onAuthStateChanged
      }
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      setSyncErrorMessage(error.message || 'Google Sign-In failed.');
      setSyncStatus('SYNC ERROR');
      setIsAuthLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setSyncStatus(navigator.onLine ? 'SYNCED' : 'OFFLINE');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // User Actions
  const addXp = (amount: number, reason?: string) => {
    setProfile(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.cyberLevel;
      let xpThreshold = prev.xpToNextLevel;

      if (newXp >= xpThreshold) {
        newLevel += 1;
        xpThreshold = Math.round(xpThreshold * 1.5);
      }

      return {
        ...prev,
        xp: newXp,
        cyberLevel: newLevel,
        xpToNextLevel: xpThreshold
      };
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      if (updates.targetRole && updates.targetRole !== prev.targetRole) {
        // Track shift transition logic
        const oldRoleTitle = CAREER_ROLES_DATA.find(r => r.id === prev.targetRole)?.title || String(prev.targetRole);
        const newRoleTitle = CAREER_ROLES_DATA.find(r => r.id === updates.targetRole)?.title || String(updates.targetRole);
        
        // Push a trace note asynchronously
        setTimeout(() => {
          addNotebookNote({
            title: `Track Shift: ${oldRoleTitle} ➜ ${newRoleTitle}`,
            content: `Operator changed their primary career track on ${new Date().toLocaleString()}.\n- Old Track: ${oldRoleTitle}\n- New Track: ${newRoleTitle}\n- Completed Labs & Lessons: Preserved successfully.\n- Roadmap & Active Guidance: Recalculated by AMAN.`,
            category: 'System Logs',
            tags: ['track-shift', 'recalibration']
          });

          // Trigger AMAN to speak
          speechEngine.speak(`Target track changed to ${newRoleTitle}. I have updated your roadmap and recalculated your next objective, preserving all your completed training history.`);
        }, 100);
      }
      return { ...prev, ...updates };
    });
  };

  const setActiveCareerTrack = useCallback((track: 'ETHICAL_HACKER' | 'SOC_ANALYST') => {
    const prevTrack = activeCareerTrack;
    if (prevTrack === track) return; // avoid redundant switches

    // 1. Capture current active state
    const currentTrackState: CareerTrackState = {
      levels,
      missions,
      ctfChallenges,
      quizScores,
      labScores,
      ctfScores,
      completedMissions,
      skillMasteries,
      xp: profile.xp,
      cyberLevel: profile.cyberLevel,
      xpToNextLevel: profile.xpToNextLevel,
      currentTopic,
      evidenceLocker
    };

    setCareerProgress(prev => {
      const updated = {
        ...prev,
        [prevTrack]: currentTrackState
      };

      // 2. Resolve target track's state
      let targetState = updated[track];
      if (!targetState) {
        // Initialize if it doesn't exist
        targetState = {
          levels: track === 'ETHICAL_HACKER' ? getEthicalHackerCurriculum() : getSocAnalystCurriculum(),
          missions: INITIAL_MISSIONS,
          ctfChallenges: CTF_CHALLENGES,
          quizScores: {},
          labScores: {},
          ctfScores: {},
          completedMissions: [],
          skillMasteries: INITIAL_SKILL_MASTERIES,
          xp: 0,
          cyberLevel: 1,
          xpToNextLevel: 1000,
          currentTopic: track === 'ETHICAL_HACKER' ? 'Linux Shell & Navigation' : 'SIEM & Log Analysis',
          evidenceLocker: INITIAL_EVIDENCE_ITEMS
        };
        updated[track] = targetState;
      }

      // 3. Apply isolated state to hooks
      setLevels(targetState.levels);
      setMissions(targetState.missions);
      setCtfChallenges(targetState.ctfChallenges);
      setQuizScores(targetState.quizScores || {});
      setLabScores(targetState.labScores || {});
      setCtfScores(targetState.ctfScores || {});
      setCompletedMissions(targetState.completedMissions || []);
      setSkillMasteries(targetState.skillMasteries || INITIAL_SKILL_MASTERIES);
      setCurrentTopic(targetState.currentTopic || (track === 'ETHICAL_HACKER' ? 'Linux Shell & Navigation' : 'SIEM & Log Analysis'));
      setEvidenceLocker(targetState.evidenceLocker || INITIAL_EVIDENCE_ITEMS);
      
      setProfile(prevProf => ({
        ...prevProf,
        xp: targetState.xp ?? 0,
        cyberLevel: targetState.cyberLevel ?? 1,
        xpToNextLevel: targetState.xpToNextLevel ?? 1000,
        targetRole: track === 'ETHICAL_HACKER' ? 'ethical-hacker' : 'soc-analyst'
      }));

      localStorage.setItem('mcl_career_progress', JSON.stringify(updated));
      return updated;
    });

    setActiveCareerTrackState(track);
    localStorage.setItem('mcl_active_career_track', track);
    
    // Voice feedback
    setTimeout(() => {
      const title = track === 'ETHICAL_HACKER' ? 'Ethical Hacker' : 'SOC Analyst';
      speechEngine.speak(`Active career track changed to ${title}. Your isolated progress has been restored.`);
    }, 150);

  }, [
    activeCareerTrack,
    levels,
    missions,
    ctfChallenges,
    quizScores,
    labScores,
    ctfScores,
    completedMissions,
    skillMasteries,
    profile,
    currentTopic
  ]);

  const completeLesson = (lessonId: string, levelId: number, score: number = 100) => {
    setLevels(prev => prev.map(lvl => {
      if (lvl.level !== levelId) return lvl;
      const updatedLessons = lvl.lessons.map(l => l.id === lessonId ? { ...l, completed: true } : l);
      const completedCount = updatedLessons.filter(l => l.completed).length;
      const isMastered = completedCount === lvl.lessonsCount;
      return {
        ...lvl,
        lessons: updatedLessons,
        completedLessons: completedCount,
        status: isMastered ? 'mastered' : (completedCount > 0 ? 'learning' : lvl.status)
      };
    }));

    setQuizScores(prev => ({
      ...prev,
      [lessonId]: score
    }));

    // Record study topic
    const foundLesson = levels.flatMap(lvl => lvl.lessons).find(l => l.id === lessonId);
    if (foundLesson) {
      setCurrentTopic(foundLesson.title);
    }

    addXp(75, `Completed lesson: ${lessonId}`);

    // Auto-award milestone achievements
    awardAchievement('ach-2'); // First lesson
    if (levelId === 1) awardAchievement('ach-4'); // Linux Beginner
    if (levelId === 2 || levelId === 3) awardAchievement('ach-networking-beginner'); // Networking Beginner
  };

  const toggleMissionObjective = (missionId: string, objectiveId: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m;
      const updatedObjectives = (m.objectives || []).map(obj => 
        obj.id === objectiveId ? { ...obj, completed: !obj.completed } : obj
      );
      const allDone = updatedObjectives.every(obj => obj.completed);
      if (allDone) {
        setCompletedMissions(curr => curr.includes(missionId) ? curr : [...curr, missionId]);
      }
      return {
        ...m,
        objectives: updatedObjectives,
        status: allDone ? 'completed' : 'in_progress',
        completed: allDone
      };
    }));
  };

  const completeMission = (missionId: string) => {
    setCompletedMissions(prev => (prev.includes(missionId) ? prev : [...prev, missionId]));

    const targetMission = missions.find(m => m.id === missionId);
    if (targetMission) {
      if (targetMission.status !== 'completed') {
        setMissions(prev => prev.map(m => {
          if (m.id !== missionId) return m;
          return {
            ...m,
            status: 'completed',
            completed: true,
            objectives: (m.objectives || []).map(obj => ({ ...obj, completed: true }))
          };
        }));
        setCurrentTopic(`Mission: ${targetMission.title}`);
        addXp(targetMission.xp, `Completed mission: ${targetMission.title}`);

        // Auto-award badges for specific missions
        if (missionId === 'm-01') awardAchievement('ach-3');
        if (missionId === 'm-02') awardAchievement('ach-first-linux-cmd');
        if (targetMission.category === 'Networking') awardAchievement('ach-networking-beginner');
      }
    }
  };

  const submitCtfFlag = async (challengeId: string, flag: string) => {
    const challenge = ctfChallenges.find(c => c.id === challengeId);
    if (!challenge) return { success: false, message: 'Challenge not found' };
    if (challenge.isSolved) return { success: true, message: 'Flag already captured previously!' };

    const cleanInput = flag.trim();

    // Secure authoritative server-side validation check
    try {
      const response = await fetch('/api/labs/validate-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId: challengeId, flag: cleanInput })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCtfChallenges(prev => prev.map(c => 
            c.id === challengeId ? { ...c, isSolved: true, solvedCount: c.solvedCount + 1 } : c
          ));
          setCtfScores(prev => ({ ...prev, [challengeId]: challenge.points }));
          addXp(challenge.xpReward, `Captured flag for CTF: ${challenge.title}`);
          awardAchievement('ach-7'); // Flag Captor
          return { success: true, message: data.message };
        }
      }
    } catch (err) {
      console.warn('Server-side authoritative check offline or failed, using safe fallback check:', err);
    }

    if (cleanInput === challenge.expectedFlagHash) {
      setCtfChallenges(prev => prev.map(c => 
        c.id === challengeId ? { ...c, isSolved: true, solvedCount: c.solvedCount + 1 } : c
      ));

      setCtfScores(prev => ({
        ...prev,
        [challengeId]: challenge.points
      }));

      addXp(challenge.xpReward, `Captured flag for CTF: ${challenge.title}`);
      awardAchievement('ach-7'); // Flag Captor
      return { success: true, message: `ACCESS GRANTED! Flag accepted. +${challenge.points} Points & +${challenge.xpReward} XP earned.` };
    }

    return { success: false, message: 'ACCESS DENIED! Invalid flag hash string. Check syntax or request a hint.' };
  };

  const unlockCtfHint = (challengeId: string, hintIndex: number) => {
    setCtfChallenges(prev => prev.map(c => {
      if (c.id !== challengeId) return c;
      const updatedHints = [...c.hints];
      if (updatedHints[hintIndex]) {
        updatedHints[hintIndex] = { ...updatedHints[hintIndex], unlocked: true };
      }
      return { ...c, hints: updatedHints };
    }));
  };

  const addNote = (noteData: Omit<NotebookEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: NotebookEntry = {
      id: `note-${Date.now()}`,
      ...noteData,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const addNotebookNote = (
    titleOrObj: string | { title: string; content: string; category?: string; tags?: string[] },
    content?: string,
    category?: string,
    tags?: string[]
  ) => {
    if (typeof titleOrObj === 'object' && titleOrObj !== null) {
      addNote({
        title: titleOrObj.title || 'Untitled Note',
        content: titleOrObj.content || '',
        category: titleOrObj.category || 'General',
        tags: titleOrObj.tags || ['cybersecurity']
      });
    } else {
      const strTitle = typeof titleOrObj === 'string' ? titleOrObj : 'Untitled Note';
      addNote({
        title: strTitle || 'Untitled Note',
        content: content || '',
        category: category || 'General',
        tags: tags || ['findings']
      });
    }
  };

  const updateNote = (id: string, updates: Partial<NotebookEntry>) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toLocaleString() } : n
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const toggleBookmark = (item: Omit<Bookmark, 'id' | 'addedAt'>) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.urlOrRef === item.urlOrRef);
      if (exists) {
        return prev.filter(b => b.urlOrRef !== item.urlOrRef);
      } else {
        return [...prev, { ...item, id: `bm-${Date.now()}`, addedAt: new Date().toISOString() }];
      }
    });
  };

  const isBookmarked = (urlOrRef: string) => {
    return bookmarks.some(b => b.urlOrRef === urlOrRef);
  };

  const recordVideoWatched = (video: Omit<VideoHistoryItem, 'id' | 'watchedAt'>) => {
    const newItem: VideoHistoryItem = {
      id: `vid-${Date.now()}`,
      ...video,
      watchedAt: new Date().toLocaleString()
    };
    setVideoHistory(prev => [newItem, ...prev.slice(0, 49)]); // Keep last 50
  };

  const saveAiStudyPlan = (plan: Omit<AiStudyPlanHistoryItem, 'id' | 'generatedAt'>) => {
    const newItem: AiStudyPlanHistoryItem = {
      id: `plan-${Date.now()}`,
      ...plan,
      generatedAt: new Date().toLocaleDateString()
    };
    setAiStudyPlanHistory(prev => [newItem, ...prev]);
  };

  const awardAchievement = (idOrCodeOrTitle: string): boolean => {
    if (!idOrCodeOrTitle) return false;
    const query = idOrCodeOrTitle.trim().toLowerCase();
    
    // Find target achievement by ID, Code, or Title
    const target = achievements.find(a => 
      a.id.toLowerCase() === query ||
      a.code.toLowerCase() === query ||
      a.title.toLowerCase() === query
    );

    if (!target) return false;
    if (target.unlocked) return false;

    const nowStr = new Date().toISOString().split('T')[0];
    const xpReward = target.xpReward || target.xp || 100;

    const updated = achievements.map(a => {
      if (a.id === target.id) {
        return {
          ...a,
          unlocked: true,
          unlockedAt: nowStr
        };
      }
      return a;
    });

    setAchievements(updated);

    // Immediate localStorage persistence
    try {
      localStorage.setItem('mcl_achievements', JSON.stringify(updated));
      localStorage.setItem('mycyberlab_achievements', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save achievements to localStorage', err);
    }

    setProfile(prev => {
      const currentAch = Array.isArray(prev.achievements) ? prev.achievements : [];
      if (!currentAch.includes(target.id)) {
        return {
          ...prev,
          achievements: [...currentAch, target.id]
        };
      }
      return prev;
    });

    addXp(xpReward, `Badge Unlocked: ${target.title}`);
    return true;
  };

  const recordLabScore = (labId: string, score: number) => {
    setLabScores(prev => ({
      ...prev,
      [labId]: score
    }));
  };

  const trackStudyTime = (minutes: number) => {
    setStudyTime(prev => prev + minutes);
  };

  const issueCertificate = (courseName: string = 'Practical Ethical Hacking & Defensive Cybersecurity'): CertificateRecord => {
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const certId = `MCL-${year}-CYB-${randomHex}`;
    
    // Calculate completed metrics
    const completedLessons = levels.reduce((acc, lvl) => acc + (lvl.completedLessons || 0), 0);
    const completedMissionsCount = completedMissions.length || missions.filter(m => m.status === 'completed' || m.completed).length;
    const labsCount = Object.keys(labScores).length || 8;
    const trainingHours = Math.max(Math.round((studyTime || 120) / 60) + (profile.labHours || 14), 16);
    
    // Calculate final score
    const quizValues = Object.values(quizScores) as number[];
    const avgQuiz = quizValues.length > 0 
      ? Math.round(quizValues.reduce((a, b) => Number(a) + Number(b), 0) / quizValues.length) 
      : 95;
    const finalScore = Math.min(100, Math.max(88, avgQuiz));

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const rawHash = `SHA256:${Math.abs(Date.now() ^ 0x5f3759df).toString(16)}${Math.random().toString(16).slice(2, 10)}`;

    const newCert: CertificateRecord = {
      certificateId: certId,
      learnerName: profile.name || 'Alex Vance',
      codename: profile.codename || 'CIPHER-01',
      courseName: courseName,
      certificateTitle: 'Certificate of Completion',
      completionDate: formattedDate,
      issueDate: formattedDate,
      trainingHours: trainingHours,
      finalScore: finalScore,
      lessonsCompletedCount: completedLessons || 32,
      labsCompletedCount: labsCount || 8,
      missionsCompletedCount: completedMissionsCount || 4,
      toolsMasteredCount: 12,
      skillsCovered: [
        'Linux Terminal & File System Security',
        'TCP/IP & OSI Layer Network Diagnostics',
        'Port Scanning & Reconnaissance (Nmap)',
        'Web Application Vulnerabilities (OWASP Top 10)',
        'SOC Telemetry & Log Investigation',
        'Capture The Flag (CTF) Methodologies',
        'Ethical Rules of Engagement & Defensive Hardening'
      ],
      verificationCode: rawHash,
      verificationUrl: `${window.location.origin}/verify-certificate?id=${certId}`,
      status: 'ISSUED',
      issuer: {
        academyName: 'My Cyber Lab Academy',
        director: 'Dr. Evelyn Cross, CISSP',
        title: 'Academic Director & Lead Cyber Examiner',
        sealNumber: `SEAL-${year}-AUTH`
      }
    };

    const updatedList = [newCert, ...certificatesList.filter(c => c.certificateId !== certId)];
    setCertificatesList(updatedList);
    setCertificateInfo(newCert);
    localStorage.setItem('mcl_certificates_list', JSON.stringify(updatedList));
    localStorage.setItem('mcl_certificate', JSON.stringify(newCert));

    // Async push to server registry if online
    fetch('/api/certificates/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificate: newCert })
    }).catch(err => console.warn('Offline certificate sync notice:', err));
    
    awardAchievement('ach-cyber-apprentice');
    addXp(250, 'Earned Course Certificate of Completion');
    return newCert;
  };

  const revokeCertificate = (certId: string) => {
    const updated = certificatesList.map(c => 
      c.certificateId === certId ? { ...c, status: 'REVOKED' as const } : c
    );
    setCertificatesList(updated);
    if (certificateInfo && certificateInfo.certificateId === certId) {
      setCertificateInfo({ ...certificateInfo, status: 'REVOKED' });
    }
  };

  const getCertificateById = (certId: string): CertificateRecord | undefined => {
    if (!certId) return undefined;
    const cleanId = certId.trim().toUpperCase();
    return certificatesList.find(c => c.certificateId.toUpperCase() === cleanId);
  };

  const generateCertificate = (): CertificateInfo => {
    const cert = issueCertificate();
    return cert;
  };

  // PRO INTELLIGENCE & MASTERY ACTIONS
  const updateSkillMastery = (skillId: string, updates: Partial<SkillMasteryRecord>) => {
    setSkillMasteries(prev => {
      return prev.map(item => {
        if (item.skillId === skillId) {
          const updated = { ...item, ...updates, lastTrainedAt: new Date().toISOString().split('T')[0] };
          // recalculate mastery %
          let scoreSum = 0;
          if (updated.theoryCompleted) scoreSum += 15;
          if (updated.practiceCompleted) scoreSum += Math.min(20, Math.round((updated.practiceScore || 80) * 0.2));
          if (updated.labCompleted) scoreSum += Math.min(25, Math.round((updated.labScore || 80) * 0.25));
          if (updated.assessmentCompleted) scoreSum += Math.min(20, Math.round((updated.assessmentScore || 80) * 0.2));
          if (updated.missionCompleted) scoreSum += Math.min(10, Math.round((updated.missionScore || 80) * 0.1));
          if (updated.bossCompleted) scoreSum += Math.min(10, Math.round((updated.bossScore || 80) * 0.1));
          
          updated.masteryPercentage = Math.min(100, Math.max(0, scoreSum));
          
          if (updated.masteryPercentage >= 90 && updated.bossCompleted) {
            updated.confidence = 'MASTERED';
          } else if (updated.masteryPercentage >= 75) {
            updated.confidence = 'STRONG';
          } else if (updated.masteryPercentage >= 50) {
            updated.confidence = 'COMPETENT';
          } else if (updated.masteryPercentage >= 25) {
            updated.confidence = 'FAMILIAR';
          } else {
            updated.confidence = 'BEGINNER';
          }

          return updated;
        }
        return item;
      });
    });
  };

  const getSkillMastery = (skillId: string): SkillMasteryRecord | undefined => {
    return skillMasteries.find(s => s.skillId === skillId);
  };

  const recordMistake = (newMistakeData: {
    title: string;
    category: string;
    whyItHappens: string;
    howToFixIt: string;
    relatedSkillId: string;
    drillQuestion: {
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      hint: string;
    };
  }) => {
    setMistakes(prev => {
      const existing = prev.find(m => m.title === newMistakeData.title || m.relatedSkillId === newMistakeData.relatedSkillId);
      if (existing) {
        return prev.map(m => m.id === existing.id ? {
          ...m,
          occurrences: m.occurrences + 1,
          lastOccurredAt: new Date().toISOString().split('T')[0],
          resolved: false,
          drillQuestion: newMistakeData.drillQuestion
        } : m);
      }
      const newEntry: LearnerMistake = {
        id: `mistake-${Date.now()}`,
        title: newMistakeData.title,
        category: newMistakeData.category,
        occurrences: 1,
        lastOccurredAt: new Date().toISOString().split('T')[0],
        whyItHappens: newMistakeData.whyItHappens,
        howToFixIt: newMistakeData.howToFixIt,
        relatedSkillId: newMistakeData.relatedSkillId,
        resolved: false,
        drillQuestion: newMistakeData.drillQuestion
      };
      return [newEntry, ...prev];
    });
  };

  const resolveMistake = (mistakeId: string) => {
    setMistakes(prev => prev.map(m => m.id === mistakeId ? { ...m, resolved: true } : m));
    addXp(50, 'Resolved conceptual weakness via targeted practice');
  };

  const setTrainingMode = (mode: TrainingMode) => {
    setTrainingModeState(mode);
  };

  const recordToolReasoningScore = (scenarioId: string, score: number) => {
    setToolReasoningScores(prev => ({ ...prev, [scenarioId]: score }));
    addXp(Math.round(score * 1.5), 'Completed Multi-Tool Reasoning Scenario');
  };

  const completeSpacedReview = (reviewId: string, success: boolean) => {
    if (success) {
      addXp(60, 'Completed Spaced Repetition Refresher');
    }
  };

  const setLanguage = (lang: LanguagePreference) => {
    updateProfile({ language: lang });
  };

  // Compute Learning Health
  const resolvedMistakesCount = mistakes.filter(m => m.resolved).length;
  const pendingMistakesCount = mistakes.filter(m => !m.resolved).length;
  const labScoreValues = Object.values(labScores) as number[];
  const avgLab = labScoreValues.length > 0
    ? Math.round(labScoreValues.reduce((a, b) => a + b, 0) / labScoreValues.length)
    : 86;

  const masteredSkillsCount = skillMasteries.filter(s => s.confidence === 'MASTERED' || s.confidence === 'STRONG').length;
  const understandingScore = Math.min(100, Math.max(45, 60 + masteredSkillsCount * 6 - pendingMistakesCount * 5));
  const practicalScore = Math.min(100, Math.max(50, Math.round(avgLab * 0.9 + (profile.labHours > 10 ? 10 : 5))));
  const problemSolvingScore = Math.min(100, Math.max(55, Math.round(75 + resolvedMistakesCount * 4 + completedMissions.length * 3)));
  const consistencyScore = Math.min(100, Math.max(50, Math.min(100, profile.streak * 15 + 30)));
  const overallHealthScore = Math.round((understandingScore + practicalScore + problemSolvingScore + consistencyScore) / 4);

  const learningHealth: LearningHealthMetrics = {
    consistencyScore,
    understandingScore,
    practicalScore,
    problemSolvingScore,
    overallHealthScore,
    totalStudyMinutes: studyTime,
    streakDays: profile.streak,
    averageLabScore: avgLab,
    firstAttemptRate: 78,
    resolvedMistakesCount,
    pendingMistakesCount
  };

  // AUTHORIZED CLIENT ENGAGEMENT (ACE) ACTIONS
  const addEvidence = (item: Omit<EvidenceItem, 'id' | 'timestamp'>): EvidenceItem => {
    const nextNumber = evidenceLocker.length + 1;
    const padded = nextNumber.toString().padStart(3, '0');
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const integrityHash = item.integrityHash || computeEvidenceHash(item.engagementId, item.assetIp, timestamp, item.rawContent);
    const newEvidence: EvidenceItem = {
      ...item,
      id: `EVID-${padded}`,
      timestamp,
      integrityHash
    };
    setEvidenceLocker(prev => [newEvidence, ...prev]);
    securityAuditLogger.logEvent('EVIDENCE_PRESERVED', `Evidence artifact ${newEvidence.id} preserved for ${newEvidence.assetIp} (${newEvidence.type})`, {
      engagementId: newEvidence.engagementId,
      actor: profile.name || 'Operator',
      metadata: { integrityHash, assetId: newEvidence.assetId }
    });
    addXp(40, 'Forensic Evidence Preserved in ACE Locker');
    return newEvidence;
  };

  const deleteEvidence = (id: string) => {
    setEvidenceLocker(prev => prev.filter(e => e.id !== id));
  };

  const addFinding = (findingData: Omit<SecurityFinding, 'id'>): SecurityFinding => {
    const nextNumber = securityFindings.length + 1;
    const padded = nextNumber.toString().padStart(3, '0');
    const quality = evaluateFindingQuality(findingData, evidenceLocker);
    const newFinding: SecurityFinding = {
      ...findingData,
      id: `FIND-${padded}`,
      amanReviewFeedback: findingData.amanReviewFeedback || {
        isValid: quality.isValid,
        score: quality.score,
        critique: quality.critique,
        remediationAdvice: quality.remediationAdvice
      }
    };
    setSecurityFindings(prev => [newFinding, ...prev]);
    securityAuditLogger.logEvent('FINDING_CREATED', `Security Finding ${newFinding.id} [${newFinding.severity}] authored: "${newFinding.title}"`, {
      engagementId: newFinding.engagementId,
      actor: profile.name || 'Operator',
      metadata: { cvssScore: newFinding.cvssScore, affectedAsset: newFinding.affectedAsset }
    });
    addXp(120, 'Security Finding Authored with Evidence Citation');
    return newFinding;
  };

  const updateFinding = (id: string, updates: Partial<SecurityFinding>) => {
    setSecurityFindings(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFinding = (id: string) => {
    setSecurityFindings(prev => prev.filter(f => f.id !== id));
  };

  const retestFinding = (findingId: string, command: string, output: string): { success: boolean; message: string } => {
    const isClosed = output.toLowerCase().includes('closed') || 
                     output.toLowerCase().includes('denied') || 
                     output.toLowerCase().includes('unreachable') || 
                     output.toLowerCase().includes('403 forbidden') ||
                     output.toLowerCase().includes('sanitized');

    const status = isClosed ? 'RETEST_VERIFIED_CLOSED' : 'RETEST_FAILED';
    const notes = isClosed 
      ? `Retest verified via "${command}". Target service responded securely.`
      : `Retest verification via "${command}" revealed service remains accessible/vulnerable.`;

    updateFinding(findingId, {
      retestStatus: status,
      retestNotes: notes
    });

    securityAuditLogger.logEvent(
      isClosed ? 'RETEST_PASSED' : 'RETEST_FAILED',
      `Retest verification for ${findingId} resulted in ${status} via command "${command}"`,
      {
        actor: profile.name || 'Operator',
        severity: isClosed ? 'INFO' : 'WARN'
      }
    );

    if (isClosed) {
      addXp(80, 'Retest Verification Verified Vulnerability Closed');
      return { success: true, message: 'Remediation verified! Vulnerability confirmed closed.' };
    } else {
      return { success: false, message: 'Retest failed. The target service is still vulnerable.' };
    }
  };

  const saveEngagementReport = (reportData: Omit<EngagementReport, 'id' | 'createdAt'>): EngagementReport => {
    const nextNumber = engagementReports.length + 1;
    const padded = nextNumber.toString().padStart(3, '0');
    const newReport: EngagementReport = {
      ...reportData,
      id: `REP-ENG-${padded}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEngagementReports(prev => [newReport, ...prev]);
    securityAuditLogger.logEvent('REPORT_PUBLISHED', `Assessment Report ${newReport.id} compiled and published for ${newReport.clientName}`, {
      engagementId: newReport.engagementId,
      actor: profile.name || 'Operator',
      metadata: { posture: newReport.overallPosture, score: newReport.score }
    });
    addXp(300, 'Published Executive Penetration Testing Report');
    return newReport;
  };

  const setActiveEngagementId = (id: string | null) => {
    setActiveEngagementIdState(id);
  };

  const resetAllProgress = () => {
    setProfile(INITIAL_USER_PROFILE);
    setLevels(LEARNING_PATH_LEVELS);
    setMissions(INITIAL_MISSIONS);
    setCompletedMissions(INITIAL_MISSIONS.filter(m => m.status === 'completed' || m.completed).map(m => m.id));
    setCtfChallenges(CTF_CHALLENGES);
    setAchievements(ACHIEVEMENTS_DATA);
    setNotes(INITIAL_NOTEBOOK_ENTRIES);
    setBookmarks([]);
    setCertificateInfo(null);
    setCertificatesList([]);
    setVideoHistory([]);
    setAiStudyPlanHistory([]);
    setQuizScores({});
    setLabScores({});
    setCtfScores({});
    setStudyTime(0);
    setSkillMasteries(INITIAL_SKILL_MASTERIES);
    setMistakes(INITIAL_MISTAKES);
    setTrainingModeState('MENTOR');
    setToolReasoningScores({ 'scen-01': 95 });
    setEvidenceLocker(INITIAL_EVIDENCE_ITEMS);
    setSecurityFindings(INITIAL_SECURITY_FINDINGS);
    setEngagementReports(INITIAL_ENGAGEMENT_REPORTS);
    setActiveEngagementIdState('ace-northstar-01');
    localStorage.clear();
  };

  const resetAllData = resetAllProgress;

  // Authoritative Single Source of Truth Unified Learning State
  const learningState = useMemo(() => {
    return UnifiedLearningEngine.getSnapshot(
      profile,
      levels,
      missions,
      ctfChallenges,
      skillMasteries,
      mistakes,
      quizScores,
      labScores
    );
  }, [profile, levels, missions, ctfChallenges, skillMasteries, mistakes, quizScores, labScores]);

  return (
    <AppContext.Provider
      value={{
        learningState,
        currentUser,
        user: currentUser,
        isAuthLoading,
        signInWithGoogle,
        signOut,
        syncStatus,
        isOnline,
        lastSyncedTime,
        syncErrorMessage,
        syncNow: () => syncToCloud(),
        profile,
        updateProfile,
        levels,
        missions,
        completedMissions,
        ctfChallenges,
        achievements,
        notes,
        bookmarks,
        certificateInfo,
        certificatesList,
        videoHistory,
        aiStudyPlanHistory,
        quizScores,
        labScores,
        ctfScores,
        weakSkills,
        strongSkills,
        studyTime,
        currentTopic,
        skillMasteries,
        updateSkillMastery,
        getSkillMastery,
        mistakes,
        recordMistake,
        resolveMistake,
        trainingMode,
        setTrainingMode,
        toolReasoningScores,
        recordToolReasoningScore,
        learningHealth,
        language: profile.language || 'English',
        setLanguage,
        completeSpacedReview,
        amanGuidedMode,
        setAmanGuidedMode,
        selectedLesson,
        setSelectedLesson,
        selectedMission,
        setSelectedMission,
        isOnboardingOpen,
        setIsOnboardingOpen,
        completeLesson,
        toggleMissionObjective,
        completeMission,
        submitCtfFlag,
        unlockCtfHint,
        addNote,
        addNotebookNote,
        updateNote,
        deleteNote,
        toggleBookmark,
        isBookmarked,
        recordVideoWatched,
        saveAiStudyPlan,
        recordLabScore,
        generateCertificate,
        issueCertificate,
        revokeCertificate,
        getCertificateById,
        setCurrentTopic,
        resetAllProgress,
        resetAllData,
        addXp,
        awardAchievement,
        trackStudyTime,

        // ACE Mode exports
        evidenceLocker,
        addEvidence,
        deleteEvidence,
        securityFindings,
        addFinding,
        updateFinding,
        deleteFinding,
        retestFinding,
        engagementReports,
        saveEngagementReport,
        activeEngagementId,
        setActiveEngagementId,

        // Track state exports
        activeCareerTrack,
        setActiveCareerTrack,
        careerProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
