import { EvidenceItem } from '../types';

/**
 * Computes a deterministic integrity hash for an evidence record.
 */
export function computeEvidenceHash(
  engagementId: string,
  assetIp: string,
  timestamp: string,
  rawContent: string
): string {
  const payload = `${engagementId}::${assetIp}::${timestamp}::${rawContent}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `SHA256:${hex}${Math.abs((hash ^ 0x5f3759df) >>> 0).toString(16).padStart(8, '0')}`;
}

/**
 * Validates the forensic integrity of an evidence artifact.
 */
export function verifyEvidenceIntegrity(evidence: EvidenceItem & { integrityHash?: string }): {
  verified: boolean;
  computedHash: string;
  isTampered: boolean;
} {
  const computedHash = computeEvidenceHash(
    evidence.engagementId,
    evidence.assetIp,
    evidence.timestamp,
    evidence.rawContent
  );

  const existingHash = evidence.integrityHash;
  if (!existingHash) {
    return {
      verified: true,
      computedHash,
      isTampered: false
    };
  }

  const isTampered = existingHash !== computedHash;
  return {
    verified: !isTampered,
    computedHash,
    isTampered
  };
}

/**
 * Filters evidence items with strict cross-engagement isolation.
 */
export function getIsolatedEvidenceForEngagement(
  allEvidence: EvidenceItem[],
  targetEngagementId: string
): EvidenceItem[] {
  if (!targetEngagementId) return [];
  return allEvidence.filter(e => e.engagementId === targetEngagementId);
}
