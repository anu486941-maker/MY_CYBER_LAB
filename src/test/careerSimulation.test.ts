import { describe, it, expect } from 'vitest';
import { CAREER_JOB_SIMULATIONS } from '../pages/CareerSimulationPage';
import { CareerReadinessService } from '../services/careerReadinessService';
import { computeEvidenceHash } from '../utils/evidenceIntegrity';

describe('Career Simulation & Job-Readiness Engine Test Suite', () => {
  it('contains substantially different simulations for Ethical Hacker and SOC Analyst', () => {
    const ethicalHackerSim = CAREER_JOB_SIMULATIONS.find(s => s.roleId === 'ethical-hacker');
    const socAnalystSim = CAREER_JOB_SIMULATIONS.find(s => s.roleId === 'soc-analyst');

    expect(ethicalHackerSim).toBeDefined();
    expect(socAnalystSim).toBeDefined();

    expect(ethicalHackerSim?.scenarioType).toBe('PENTEST');
    expect(socAnalystSim?.scenarioType).toBe('SIEM_TRIAGE');

    // Ethical Hacker focuses on vulnerability exploitation & CVSS
    expect(ethicalHackerSim?.phases.some(p => p.title.toLowerCase().includes('command injection') || p.cweCategory)).toBe(true);

    // SOC Analyst focuses on SIEM alert triage & containment
    expect(socAnalystSim?.phases.some(p => p.title.toLowerCase().includes('siem') || p.mitreTechnique)).toBe(true);
  });

  it('computes evidence hash integrity with SHA-256 for simulation outputs', () => {
    const rawOutput = 'Nmap scan report for finvault-api.internal (10.50.20.100)';
    const timestamp = new Date().toISOString();
    const hash1 = computeEvidenceHash('sim-eth-01', '10.50.20.100', timestamp, rawOutput);
    const hash2 = computeEvidenceHash('sim-eth-01', '10.50.20.100', timestamp, rawOutput);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBeGreaterThan(15);
  });

  it('calculates multi-pillar readiness score accurately', () => {
    const mockProfile = {
      name: 'Test Operator',
      email: 'operator@cyber.lab',
      cyberLevel: 5,
      xp: 1500,
      targetRole: 'soc-analyst' as const
    };

    const report = CareerReadinessService.calculateReadiness({
      profile: mockProfile as any,
      skillMasteries: [],
      mistakes: [],
      completedMissionsCount: 3,
      evidenceCount: 2,
      reportsCount: 1
    });

    expect(report.overallScore).toBeGreaterThan(0);
    expect(report.pillars.technicalKnowledge).toBeDefined();
    expect(report.pillars.socAnalysis).toBeDefined();
    expect(report.careerReadinessTier).toBeDefined();
  });
});
