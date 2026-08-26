import assert from 'assert';
import { REAL_CASES_DATA } from '../src/data/realCasesData';

console.log('🧪 RUNNING INCIDENT LAB TESTS...');

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ Passed: ${name}`);
  } catch (err: any) {
    console.error(`  ❌ Failed: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

runTest('Incident Lab Engine - Loading and Integrity', () => {
  const case01 = REAL_CASES_DATA.find(c => c.id === 'case-01');
  assert.ok(case01, 'Case 01 should exist');
  assert.ok(Array.isArray(case01.evidence), 'Evidence should be an array');
});

console.log('🎉 INCIDENT LAB TESTS PASSED');
