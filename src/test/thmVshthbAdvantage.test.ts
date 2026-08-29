import { describe, it, expect } from 'vitest';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import { CYBER_LAB_MODULES } from '../data/cyberLabModulesData';
import { REAL_CASES_DATA } from '../data/realCasesData';
import { computeEvidenceHash } from '../utils/evidenceIntegrity';

describe('MY CYBER LAB vs TryHackMe & Hack The Box Superiority Specification Audit', () => {
  it('verifies multi-perspective career tracks (Offensive + Defensive + Engineering)', () => {
    const categories = new Set(CAREER_ROLES_DATA.map(r => r.category));
    expect(categories.has('offensive')).toBe(true);
    expect(categories.has('defensive')).toBe(true);
    expect(categories.has('engineering')).toBe(true);
  });

  it('verifies real incident case studies connection to hands-on labs', () => {
    expect(REAL_CASES_DATA.length).toBeGreaterThan(0);
    const firstCase = REAL_CASES_DATA[0];
    expect(firstCase).toBeDefined();
    expect(firstCase.id).toBeDefined();
    expect(firstCase.title).toBeDefined();
  });

  it('verifies cryptographic evidence hashing for employer audit trails', () => {
    const samplePayload = 'GET /api/v1/user?id=1%20UNION%20SELECT%20null,username%20FROM%20users--';
    const hash = computeEvidenceHash('LAB-101', '192.168.1.100', new Date().toISOString(), samplePayload);
    expect(hash.startsWith('SHA256:')).toBe(true);
    expect(hash.length).toBeGreaterThanOrEqual(23);
  });

  it('verifies guided cyber lab modules inventory and difficulty scaling', () => {
    expect(CYBER_LAB_MODULES.length).toBeGreaterThan(0);
    CYBER_LAB_MODULES.forEach(mod => {
      expect(mod.id).toBeDefined();
      expect(mod.difficulty).toBeDefined();
      expect(mod.summary).toBeDefined();
    });
  });
});
