import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isValidRole, normalizeRoleId, getRolePersonalization, getAllPersonalizedRoles } from '../services/rolePersonalization';
import { buildAmanContext } from '../aman/amanContext';

describe('Role Selection & Authentication Guard Integration Tests', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Role Validation Utility Unit Tests', () => {
    it('validates all 11 cybersecurity career roles correctly', () => {
      const allRoles = getAllPersonalizedRoles();
      expect(allRoles.length).toBe(11);

      allRoles.forEach(role => {
        expect(isValidRole(role.id)).toBe(true);
        expect(isValidRole(role.title)).toBe(true);
      });
    });

    it('returns false for invalid, empty, or null role inputs', () => {
      expect(isValidRole(null)).toBe(false);
      expect(isValidRole(undefined)).toBe(false);
      expect(isValidRole('')).toBe(false);
      expect(isValidRole('   ')).toBe(false);
      expect(isValidRole('non-existent-role-xyz')).toBe(false);
    });

    it('normalizes role aliases and fallback safely', () => {
      expect(normalizeRoleId('Pentester')).toBe('pentester');
      expect(normalizeRoleId('SOC Analyst')).toBe('soc-analyst');
      expect(normalizeRoleId('invalid-role')).toBe('soc-analyst');
    });
  });

  describe('AMAN AI Context Role Awareness Unit Tests', () => {
    it('builds role-personalized context for Pentester role', () => {
      const mockProfile = {
        selectedRole: 'pentester',
        targetRole: 'pentester',
        cyberLevel: 3,
        xp: 1200,
        language: 'English'
      };

      const amanCtx = buildAmanContext(mockProfile, {}, [], '/dashboard', 'TEACH');

      expect(amanCtx.activeRole).toBe('pentester');
      expect(amanCtx.selectedRole).toBe('pentester');
      expect(amanCtx.roleTitle).toContain('Penetration Tester');
      expect(amanCtx.roleCategory).toBe('Offensive');
      expect(amanCtx.roleRecommendedNextAction).toBeDefined();
    });

    it('builds role-personalized context for Web Security Engineer role', () => {
      const mockProfile = {
        selectedRole: 'web-security',
        cyberLevel: 2,
        xp: 800,
        language: 'Hinglish'
      };

      const amanCtx = buildAmanContext(mockProfile, {}, [], '/dashboard', 'TEACH');

      expect(amanCtx.activeRole).toBe('web-security');
      expect(amanCtx.roleTitle).toContain('Web Security');
      expect(amanCtx.roleCategory).toBe('Offensive');
    });
  });

  describe('Role Selection Registry Verification', () => {
    it('contains valid salary ranges, core tools, and demand levels for all roles', () => {
      const allRoles = getAllPersonalizedRoles();

      allRoles.forEach(role => {
        expect(role.id).toBeDefined();
        expect(role.title).toBeDefined();
        expect(role.salaryRange).toContain('$');
        expect(role.tools.length).toBeGreaterThan(0);
        expect(role.demandLevel).toBeDefined();
        expect(role.emoji).toBeDefined();
      });
    });
  });
});
