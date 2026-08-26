import { describe, it, expect } from 'vitest';
import { REAL_CASES_DATA } from '../src/data/realCasesData';

describe('Incident Lab Engine Tests', () => {
  it('loads cases with data integrity', () => {
    const case01 = REAL_CASES_DATA.find(c => c.id === 'case-01');
    expect(case01).toBeDefined();
    expect(Array.isArray(case01?.evidence)).toBe(true);
  });
});
