import { EngagementSeverity, SecurityFinding, EvidenceItem } from '../types';

export interface Cvss31Metrics {
  attackVector: 'N' | 'A' | 'L' | 'P';
  attackComplexity: 'L' | 'H';
  privilegesRequired: 'N' | 'L' | 'H';
  userInteraction: 'N' | 'R';
  scope: 'U' | 'C';
  confidentiality: 'N' | 'L' | 'H';
  integrity: 'N' | 'L' | 'H';
  availability: 'N' | 'L' | 'H';
}

export interface CvssCalculationResult {
  score: number;
  severity: EngagementSeverity;
  vector: string;
  impactScore: number;
  exploitabilityScore: number;
  isValid: boolean;
  error?: string;
}

/**
 * CVSS 3.1 Standard Metric Weights
 */
const METRIC_WEIGHTS = {
  AV: { N: 0.85, A: 0.62, L: 0.55, P: 0.20 },
  AC: { L: 0.77, H: 0.44 },
  PR: {
    U: { N: 0.85, L: 0.62, H: 0.27 }, // Scope Unchanged
    C: { N: 0.85, L: 0.68, H: 0.50 }  // Scope Changed
  },
  UI: { N: 0.85, R: 0.62 },
  C: { N: 0.0, L: 0.22, H: 0.56 },
  I: { N: 0.0, L: 0.22, H: 0.56 },
  A: { N: 0.0, L: 0.22, H: 0.56 }
};

/**
 * CVSS 3.1 Rounding Helper (Round-Up standard to 1 decimal place)
 * E.g., 4.02 -> 4.1
 */
export function cvssRoundUp(input: number): number {
  const intVal = Math.round(input * 100000);
  if (intVal % 10000 === 0) {
    return intVal / 100000;
  }
  return (Math.floor(intVal / 10000) + 1) / 10;
}

/**
 * Calculates CVSS 3.1 Base Score from metric values.
 */
export function calculateCvss31(metrics: Cvss31Metrics): CvssCalculationResult {
  try {
    const {
      attackVector: AV,
      attackComplexity: AC,
      privilegesRequired: PR,
      userInteraction: UI,
      scope: S,
      confidentiality: C,
      integrity: I,
      availability: A
    } = metrics;

    const avWeight = METRIC_WEIGHTS.AV[AV] || 0.85;
    const acWeight = METRIC_WEIGHTS.AC[AC] || 0.77;
    const prWeight = METRIC_WEIGHTS.PR[S][PR] || 0.85;
    const uiWeight = METRIC_WEIGHTS.UI[UI] || 0.85;
    const cWeight = METRIC_WEIGHTS.C[C] || 0;
    const iWeight = METRIC_WEIGHTS.I[I] || 0;
    const aWeight = METRIC_WEIGHTS.A[A] || 0;

    // 1. Calculate ISS (Impact Sub-Score)
    const iss = 1 - (1 - cWeight) * (1 - iWeight) * (1 - aWeight);

    // 2. Calculate Impact
    let impact = 0;
    if (S === 'U') {
      impact = 6.42 * iss;
    } else {
      impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
    }

    // 3. Calculate Exploitability
    const exploitability = 8.22 * avWeight * acWeight * prWeight * uiWeight;

    // 4. Calculate Base Score
    let score = 0;
    if (impact <= 0) {
      score = 0.0;
    } else if (S === 'U') {
      score = cvssRoundUp(Math.min(impact + exploitability, 10.0));
    } else {
      score = cvssRoundUp(Math.min(1.08 * (impact + exploitability), 10.0));
    }

    score = Math.min(10.0, Math.max(0.0, score));

    // Severity mapping
    let severity: EngagementSeverity = 'INFORMATIONAL';
    if (score === 0.0) severity = 'INFORMATIONAL';
    else if (score < 4.0) severity = 'LOW';
    else if (score < 7.0) severity = 'MEDIUM';
    else if (score < 9.0) severity = 'HIGH';
    else severity = 'CRITICAL';

    const vector = `CVSS:3.1/AV:${AV}/AC:${AC}/PR:${PR}/UI:${UI}/S:${S}/C:${C}/I:${I}/A:${A}`;

    return {
      score,
      severity,
      vector,
      impactScore: Math.round(impact * 10) / 10,
      exploitabilityScore: Math.round(exploitability * 10) / 10,
      isValid: true
    };
  } catch (err: any) {
    return {
      score: 5.0,
      severity: 'MEDIUM',
      vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
      impactScore: 2.5,
      exploitabilityScore: 3.9,
      isValid: false,
      error: err.message
    };
  }
}

/**
 * Parses and evaluates a raw CVSS 3.1 Vector String.
 * E.g., "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H" -> 9.8 Critical
 */
export function parseCvss31Vector(vectorStr: string): CvssCalculationResult {
  if (!vectorStr || typeof vectorStr !== 'string') {
    return {
      score: 0.0,
      severity: 'INFORMATIONAL',
      vector: '',
      impactScore: 0,
      exploitabilityScore: 0,
      isValid: false,
      error: 'Empty vector string'
    };
  }

  const clean = vectorStr.trim();
  const pairs = clean.replace(/^CVSS:3\.[01]\//i, '').split('/');
  const metricMap: Record<string, string> = {};

  for (const pair of pairs) {
    const [key, val] = pair.split(':');
    if (key && val) {
      metricMap[key.toUpperCase()] = val.toUpperCase();
    }
  }

  const metrics: Cvss31Metrics = {
    attackVector: (metricMap['AV'] as any) || 'N',
    attackComplexity: (metricMap['AC'] as any) || 'L',
    privilegesRequired: (metricMap['PR'] as any) || 'N',
    userInteraction: (metricMap['UI'] as any) || 'N',
    scope: (metricMap['S'] as any) || 'U',
    confidentiality: (metricMap['C'] as any) || 'N',
    integrity: (metricMap['I'] as any) || 'N',
    availability: (metricMap['A'] as any) || 'N'
  };

  return calculateCvss31(metrics);
}

/**
 * AMAN Review and Finding Rigor Validator
 */
export function evaluateFindingQuality(
  finding: Partial<SecurityFinding>,
  evidenceList: EvidenceItem[]
): { isValid: boolean; score: number; critique: string; remediationAdvice: string } {
  let score = 100;
  const critiquePoints: string[] = [];
  const remediationAdvicePoints: string[] = [];

  // 1. Check Evidence Citation
  if (!finding.evidenceIds || finding.evidenceIds.length === 0) {
    score -= 35;
    critiquePoints.push('Finding lacks cited technical evidence. In professional penetration testing, every finding must reference empirical artifacts in the Evidence Locker.');
  } else {
    const matchingEvidence = evidenceList.filter(e => finding.evidenceIds?.includes(e.id));
    if (matchingEvidence.length === 0) {
      score -= 25;
      critiquePoints.push('Cited evidence ID does not exist in the current Evidence Locker.');
    }
  }

  // 2. Check Affected Asset & Component
  if (!finding.affectedAsset || finding.affectedAsset.trim().length < 3) {
    score -= 20;
    critiquePoints.push('Affected asset hostname or IP is missing or vague.');
  }

  // 3. Check Description & Impact
  if (!finding.description || finding.description.trim().length < 30) {
    score -= 20;
    critiquePoints.push('Vulnerability description is brief. Detail the root cause and exposure mechanism.');
  }
  if (!finding.impact || finding.impact.trim().length < 20) {
    score -= 15;
    critiquePoints.push('Impact statement needs specific business and technical risk description (e.g. data disclosure, unauthorized control).');
  }

  // 4. Check Remediation Quality
  if (!finding.remediation || finding.remediation.trim().length < 25) {
    score -= 20;
    remediationAdvicePoints.push('Provide actionable, step-by-step technical remediation guidance (e.g., config changes, patch version, firewall rule).');
  }

  // 5. Logical Consistency Check (Open Port != Exploit)
  const title = (finding.title || '').toLowerCase();
  const desc = (finding.description || '').toLowerCase();
  if ((title.includes('port 22') || title.includes('port 80 open')) && finding.severity === 'CRITICAL') {
    score -= 25;
    critiquePoints.push('Severity Inflation: An open standard service port (e.g. SSH/HTTP) without proven unauthenticated exploit or critical version vulnerability cannot be scored as CRITICAL.');
  }

  const finalScore = Math.max(10, Math.min(100, score));
  const isValid = finalScore >= 60;

  const critique = critiquePoints.length > 0
    ? critiquePoints.join(' ')
    : 'Excellent technical finding. Evidence citations, CVSS metric alignment, and risk attribution adhere to PTES & OWASP standards.';

  const remediationAdvice = remediationAdvicePoints.length > 0
    ? remediationAdvicePoints.join(' ')
    : 'Remediation is thorough and directly addresses the root vulnerability with defense-in-depth measures.';

  return {
    isValid,
    score: finalScore,
    critique,
    remediationAdvice
  };
}
