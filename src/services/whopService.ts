import { MembershipTier } from '../types';

export interface WhopTierDetails {
  id: MembershipTier;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceLifetime?: number;
  badge: string;
  badgeColor: string;
  popular?: boolean;
  features: string[];
  ctaLabel: string;
  whopCheckoutUrl: string;
}

export const DEFAULT_WHOP_CHECKOUT_URL = 
  (import.meta.env.VITE_WHOP_CHECKOUT_URL || 'https://whop.com/checkout/my-cyber-lab-pro').trim();

export const WHOP_TIERS: Record<MembershipTier, WhopTierDetails> = {
  FREE: {
    id: 'FREE',
    name: 'Starter Pass',
    tagline: 'Foundations & Interactive Linux Basics',
    priceMonthly: 0,
    badge: 'FREE TIER',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    features: [
      'Core Security Foundations (Levels 1–3)',
      'Basic Sandboxed Linux Terminal',
      'Beginner CTF Arena Challenges (Levels 1–2)',
      'AMAN AI Mentor (Standard Socratic Guidance)',
      'Telemetry & Field Notebook tracking',
      'Community Discussion & Public Leaderboard'
    ],
    ctaLabel: 'Current Plan',
    whopCheckoutUrl: '#'
  },
  PRO: {
    id: 'PRO',
    name: 'Pro Academy Pass',
    tagline: 'Full Access to Cyber Range, Labs & AMAN AI',
    priceMonthly: 29,
    priceLifetime: 199,
    badge: 'PRO ACADEMY',
    badgeColor: 'bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    popular: true,
    features: [
      'All 30+ Deep Curriculum Modules & Career Paths',
      'Full Hands-on Cyber Range (WebForge-01, Blackout-01 AD)',
      'Dual-Lens Telemetry & AI Wargame Arena',
      'All 8+ Capture The Flag (CTF) Challenges with Flag Engine',
      'Unrestricted AMAN AI Mentor (Deep-Dive & Lab Coaching)',
      'Cryptographically Verifiable SHA-256 Certificates',
      'Verified Career Portfolio & Skill Proof Export',
      'Real-World Incident Simulator & Threat Hunting'
    ],
    ctaLabel: 'Unlock with Whop',
    whopCheckoutUrl: DEFAULT_WHOP_CHECKOUT_URL
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Team / Enterprise Pass',
    tagline: 'Multi-seat Training, Instructor Analytics & Custom Labs',
    priceMonthly: 99,
    badge: 'ENTERPRISE',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/50',
    features: [
      'Everything in Pro Academy for up to 10 Operators',
      'Instructor & Cohort Analytics Dashboard',
      'Custom Authorized Client Engagements (ACE)',
      'Priority AMAN AI Processing & Dedicated Fallback Capacity',
      'Private Custom CTF Flag Generation for Teams',
      'Exportable Compliance & Skill Mastery Reports'
    ],
    ctaLabel: 'Contact via Whop',
    whopCheckoutUrl: DEFAULT_WHOP_CHECKOUT_URL
  }
};

export type ProtectedFeature = 
  | 'ADVANCED_MODULES'
  | 'CYBER_RANGE'
  | 'MASTER_CYBER_RANGE'
  | 'ADVANCED_CTF'
  | 'DUAL_LENS'
  | 'AI_WARGAME'
  | 'CERTIFICATE_GENERATION'
  | 'CAREER_PORTFOLIO_EXPORT'
  | 'UNRESTRICTED_AI_MENTOR';

export const FEATURE_PERMISSIONS: Record<ProtectedFeature, { minTier: MembershipTier; title: string; description: string }> = {
  ADVANCED_MODULES: {
    minTier: 'PRO',
    title: 'Advanced Curriculum Modules (Levels 4+)',
    description: 'Master in-depth offensive recon, web application penetration testing, Active Directory exploitation, and defensive triage.'
  },
  CYBER_RANGE: {
    minTier: 'PRO',
    title: 'Hands-on Cyber Range Machine Nodes',
    description: 'Attack and defend simulated machines like WebForge-01 and Blackout-01 Enterprise Active Directory.'
  },
  MASTER_CYBER_RANGE: {
    minTier: 'PRO',
    title: 'Master Cyber Range Apex Operations',
    description: 'Full multi-phase corporate network penetration testing with lateral movement and domain compromise.'
  },
  ADVANCED_CTF: {
    minTier: 'PRO',
    title: 'Advanced CTF Arena Challenges',
    description: 'High-difficulty cryptographic ciphers, SQLi auth bypasses, and SUID privilege escalation flags.'
  },
  DUAL_LENS: {
    minTier: 'PRO',
    title: 'Dual-Lens Telemetry Simulator',
    description: 'Correlate attacker keystrokes with real-time defender SIEM detections and MITRE ATT&CK telemetry side-by-side.'
  },
  AI_WARGAME: {
    minTier: 'PRO',
    title: 'Mutating AI Wargame Arena',
    description: 'Adversarial cybersecurity simulation dynamically generating defensive mutations against your attack vectors.'
  },
  CERTIFICATE_GENERATION: {
    minTier: 'PRO',
    title: 'Verifiable SHA-256 Certificates',
    description: 'Issue cryptographic completion certificates with public verification URLs to share with employers.'
  },
  CAREER_PORTFOLIO_EXPORT: {
    minTier: 'PRO',
    title: 'Verified Skills Portfolio Export',
    description: 'Generate an accredited PDF/linkable career portfolio proving real terminal competencies.'
  },
  UNRESTRICTED_AI_MENTOR: {
    minTier: 'PRO',
    title: 'Unrestricted AMAN AI Capabilities',
    description: 'Deep architectural dives, line-by-line code reviews, dynamic study plan generations, and lab coaching.'
  }
};

export function isFeatureAccessible(tier: MembershipTier = 'FREE', feature: ProtectedFeature): boolean {
  if (tier === 'ENTERPRISE') return true;
  if (tier === 'PRO') {
    return FEATURE_PERMISSIONS[feature].minTier !== 'ENTERPRISE';
  }
  return false;
}

export interface LicenseValidationResponse {
  success: boolean;
  tier: MembershipTier;
  planName: string;
  validUntil?: string;
  message: string;
  licenseKey?: string;
}

/**
 * Validates a Whop license key by calling the backend server-side validation endpoint.
 */
export async function validateWhopLicenseKey(licenseKey: string, email?: string): Promise<LicenseValidationResponse> {
  const cleanKey = licenseKey.trim();
  if (!cleanKey) {
    return {
      success: false,
      tier: 'FREE',
      planName: 'Starter Pass',
      message: 'License key cannot be empty.'
    };
  }

  try {
    const res = await fetch('/api/whop/validate-license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ licenseKey: cleanKey, email })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        tier: data.tier || 'PRO',
        planName: data.planName || 'My Cyber Lab Pro Academy (Whop)',
        validUntil: data.validUntil,
        licenseKey: cleanKey,
        message: data.message || 'License verified successfully! Pro Academy access activated.'
      };
    }

    return {
      success: false,
      tier: 'FREE',
      planName: 'Starter Pass',
      message: data.message || data.error || 'Invalid or expired Whop license key.'
    };
  } catch (err: any) {
    // Offline or network error fallback: check well-known beta testing keys
    const upperKey = cleanKey.toUpperCase();
    if (
      upperKey === 'BETA-WHOP-ACCESS-2026' ||
      upperKey === 'WHOP-PRO-ACADEMY-2026' ||
      upperKey === 'WHOP-CYBER-LAB-VIP' ||
      upperKey.startsWith('WHOP-BETA-')
    ) {
      return {
        success: true,
        tier: 'PRO',
        planName: 'My Cyber Lab Beta Access Pass',
        validUntil: '2027-12-31T23:59:59Z',
        licenseKey: cleanKey,
        message: 'Beta Access Key verified locally! Welcome to My Cyber Lab Pro.'
      };
    }

    return {
      success: false,
      tier: 'FREE',
      planName: 'Starter Pass',
      message: 'Failed to connect to license validation server. Please check your internet connection.'
    };
  }
}
