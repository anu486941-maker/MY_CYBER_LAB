/**
 * Authoritative Target Allowlist Policy & Safety Enforcement
 * Guarantees all cyber range, terminal, and AI activities are restricted to authorized MY CYBER LAB infrastructure.
 */

export interface TargetScopeValidation {
  allowed: boolean;
  target: string;
  reason?: string;
  refusalMessage?: string;
  safeAlternativeTarget?: string;
}

// Explicitly authorized IP subnets and domain patterns for MY CYBER LAB training environments
const AUTHORIZED_SUBNETS = [
  '10.200.1.',  // FinVault Capital Network
  '172.16.40.', // MediHealth EMR Network
  '192.168.1.', // Local Enterprise Range
  '10.10.0.',   // Cyber Lab Sandbox
  '127.0.0.1',  // Loopback
  'localhost'
];

const AUTHORIZED_DOMAIN_PATTERNS = [
  /\.mycyberlab\.local$/i,
  /\.finvault\.local$/i,
  /\.medihealth\.local$/i,
  /\.corp\.local$/i,
  /\.lab$/i,
  /^localhost$/i,
  /^target-range/i,
  /^10\./,
  /^172\.16\./,
  /^192\.168\./
];

/**
 * Validates whether a target IP, hostname, or URL is within authorized MY CYBER LAB training scope.
 */
export function validateTargetScope(targetInput?: string | null): TargetScopeValidation {
  if (!targetInput || !targetInput.trim()) {
    return {
      allowed: true,
      target: '10.200.1.10',
      reason: 'Default authorized lab target assigned.'
    };
  }

  const cleanTarget = targetInput.trim().toLowerCase().replace(/^(https?:\/\/)?/, '').split('/')[0].split(':')[0];

  // Check subnets
  const isSubnetAllowed = AUTHORIZED_SUBNETS.some(sub => cleanTarget.startsWith(sub));
  const isDomainAllowed = AUTHORIZED_DOMAIN_PATTERNS.some(pattern => pattern.test(cleanTarget));

  if (isSubnetAllowed || isDomainAllowed) {
    return {
      allowed: true,
      target: cleanTarget
    };
  }

  // Target is UNAUTHORIZED / PUBLIC IP or Third-Party Website
  return {
    allowed: false,
    target: cleanTarget,
    reason: 'TARGET_OUT_OF_SCOPE',
    refusalMessage: `That target (${cleanTarget}) is outside your authorized training scope. I can help you perform the same exercise against the MY CYBER LAB training target.`,
    safeAlternativeTarget: '10.200.1.10 (fin-proxy-01.finvault.local)'
  };
}
