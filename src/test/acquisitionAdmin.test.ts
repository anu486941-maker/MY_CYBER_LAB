import { describe, it, expect } from 'vitest';
import { CAREER_ROLES_DATA } from '../data/careerRolesData';
import { CYBER_LAB_MODULES } from '../data/cyberLabModulesData';
import { REAL_CASES_DATA } from '../data/realCasesData';
import { computeEvidenceHash } from '../utils/evidenceIntegrity';

describe('Acquisition & Buyer Readiness Specification Audit', () => {
  it('validates career roles inventory integrity across 10 roles', () => {
    expect(CAREER_ROLES_DATA.length).toBeGreaterThanOrEqual(10);
    CAREER_ROLES_DATA.forEach(role => {
      expect(role.id).toBeDefined();
      expect(role.title).toBeDefined();
      expect(role.shortDescription).toBeDefined();
      expect(role.category).toBeDefined();
    });
  });

  it('validates guided lab modules inventory and stage progression', () => {
    expect(CYBER_LAB_MODULES.length).toBeGreaterThan(0);
    CYBER_LAB_MODULES.forEach(module => {
      expect(module.id).toBeDefined();
      expect(module.title).toBeDefined();
      expect(module.difficulty).toBeDefined();
      expect(module.summary).toBeDefined();
    });
  });

  it('validates real-world incident case studies inventory', () => {
    expect(REAL_CASES_DATA.length).toBeGreaterThan(0);
    REAL_CASES_DATA.forEach(incident => {
      expect(incident.id).toBeDefined();
      expect(incident.title).toBeDefined();
      expect(incident.category).toBeDefined();
      expect(incident.background).toBeDefined();
    });
  });

  it('verifies evidence hash computation for security reports', () => {
    const hash = computeEvidenceHash('ENG-101', '10.0.0.5', new Date().toISOString(), 'SYN-ACK Packet Captured');
    expect(hash).toBeDefined();
    expect(hash.startsWith('SHA256:')).toBe(true);
  });
});
