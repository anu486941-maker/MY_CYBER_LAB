import { UserProfile } from '../types';

export type FeatureId =
  | 'ADVANCED_MISSIONS'
  | 'ADVANCED_CTF'
  | 'AI_STUDY_PLAN'
  | 'ADVANCED_AMAN'
  | 'CAREER_READINESS'
  | 'CLIENT_ENGAGEMENTS'
  | 'ADVANCED_REPORTING'
  | 'CERTIFICATE'
  | 'ADVANCED_LABS';

export interface FeatureMetadata {
  id: FeatureId;
  name: string;
  description: string;
  category: string;
  isProOnly: boolean;
}

export const FEATURES: Record<FeatureId, FeatureMetadata> = {
  ADVANCED_MISSIONS: {
    id: 'ADVANCED_MISSIONS',
    name: 'Advanced Tactical Missions',
    description: 'High-stake scenario investigations with multi-stage APT telemetry.',
    category: 'Missions',
    isProOnly: true,
  },
  ADVANCED_CTF: {
    id: 'ADVANCED_CTF',
    name: 'Advanced CTF Challenges',
    description: 'Hardcore binary exploitation and memory corruption arenas.',
    category: 'CTF',
    isProOnly: true,
  },
  AI_STUDY_PLAN: {
    id: 'AI_STUDY_PLAN',
    name: 'AI Personalized Study Plan Generator',
    description: 'Dynamic study plan compilation updated daily by AMAN.',
    category: 'AI Guidance',
    isProOnly: false,
  },
  ADVANCED_AMAN: {
    id: 'ADVANCED_AMAN',
    name: 'AMAN Advanced Live Voice & Socratic Debate',
    description: 'Interactive voice streaming, Socratic mode, and mock interview coaching.',
    category: 'AI Guidance',
    isProOnly: false,
  },
  CAREER_READINESS: {
    id: 'CAREER_READINESS',
    name: 'Career Readiness Audit & Portfolio Export',
    description: 'Formal career readiness score and portfolio generator for recruiters.',
    category: 'Career',
    isProOnly: false,
  },
  CLIENT_ENGAGEMENTS: {
    id: 'CLIENT_ENGAGEMENTS',
    name: 'Authorized Client Engagements (ACE Range)',
    description: 'Full scope simulated ethical engagement with formal client RoE.',
    category: 'ACE Range',
    isProOnly: true,
  },
  ADVANCED_REPORTING: {
    id: 'ADVANCED_REPORTING',
    name: 'Executive & Technical Security Reports',
    description: 'Cryptographically hashed PDF & Markdown incident reports.',
    category: 'Reporting',
    isProOnly: false,
  },
  CERTIFICATE: {
    id: 'CERTIFICATE',
    name: 'Verified Cryptographic Certificates',
    description: 'SHA-256 evidence integrity certificates with public validation links.',
    category: 'Certificates',
    isProOnly: false,
  },
  ADVANCED_LABS: {
    id: 'ADVANCED_LABS',
    name: 'Advanced SOC & Threat Hunting Labs',
    description: 'Live interactive sandbox ranges with multi-system topologies.',
    category: 'Labs',
    isProOnly: true,
  },
};

/**
 * Centralized entitlement policy evaluator.
 * Determines whether a user profile has access to a specific platform feature.
 */
export function hasFeature(user: UserProfile | null | undefined, featureId: FeatureId): boolean {
  if (!user) return false;

  // Developer / Practice Mode override or Pro tier
  const isProTier = (user as any).tier === 'PRO' || (user as any).isProUser === true;
  
  // By default in MY CYBER LAB, all core modules and basic labs/missions are unlocked.
  // Pro-only features check tier status. If user tier is not explicitly set or set to 'FREE',
  // free access applies to non-Pro features, or developers can toggle Pro status in settings.
  const featureMeta = FEATURES[featureId];
  if (!featureMeta) return true;

  if (featureMeta.isProOnly) {
    // If user has PRO tier or is elevated, allow access
    return isProTier;
  }

  return true;
}

/**
 * Helper to get user readable tier name
 */
export function getUserTierName(user: UserProfile | null | undefined): string {
  if (!user) return 'CADET (FREE)';
  if ((user as any).tier === 'PRO' || (user as any).isProUser) return 'ACADEMY PRO';
  return 'CADET (FREE)';
}
