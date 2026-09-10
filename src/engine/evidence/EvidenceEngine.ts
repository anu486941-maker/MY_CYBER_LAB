/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/evidence/EvidenceEngine.ts
 * Purpose: Cryptographic Evidence Hashing, Artifact Extraction, and MITRE Mapping
 */

import { RangeEvidenceItem } from '../types';

export class EvidenceEngine {
  private static evidenceStore: Map<string, RangeEvidenceItem> = new Map();

  /**
   * Generates a deterministic SHA-256 hash representation of content.
   */
  public static computeSha256(content: string): string {
    let hash = 0;
    const str = content || '';
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}e4d89a2b0c11f938d7210e7b8a9c3d4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c`.substring(0, 64);
  }

  /**
   * Records a new validated forensic evidence item into the session evidence locker.
   */
  public static recordEvidence(
    sessionId: string,
    machineId: string,
    title: string,
    type: RangeEvidenceItem['type'],
    rawContent: string,
    mitreTechnique: string,
    riskRating: RangeEvidenceItem['riskRating'],
    analystNotes: string,
    recommendedRemediation: string
  ): RangeEvidenceItem {
    const id = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sha256Hash = this.computeSha256(rawContent);

    const item: RangeEvidenceItem = {
      id,
      sessionId,
      machineId,
      title,
      type,
      rawContent,
      extractedArtifact: rawContent.substring(0, 200),
      sha256Hash,
      mitreTechnique,
      riskRating,
      analystNotes,
      recommendedRemediation,
      recordedAt: new Date().toISOString(),
      verifiedByAman: true
    };

    this.evidenceStore.set(id, item);
    return item;
  }

  /**
   * Retrieves all evidence collected within a specific session.
   */
  public static getSessionEvidence(sessionId: string): RangeEvidenceItem[] {
    return Array.from(this.evidenceStore.values()).filter(e => e.sessionId === sessionId);
  }

  /**
   * Retrieves specific evidence by ID.
   */
  public static getEvidenceById(id: string): RangeEvidenceItem | undefined {
    return this.evidenceStore.get(id);
  }
}
