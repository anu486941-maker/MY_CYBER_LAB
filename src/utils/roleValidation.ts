import { ROLE_PERSONALIZATION_REGISTRY } from '../services/rolePersonalization';

/**
 * Validates whether a given roleId string matches a valid registered cybersecurity career role.
 * Handles normalizing aliases (e.g., 'ethical-hacker', 'dfir-analyst', 'security-engineer').
 */
export function isValidRole(roleIdOrTitle?: string | null): boolean {
  if (!roleIdOrTitle || typeof roleIdOrTitle !== 'string' || !roleIdOrTitle.trim()) {
    return false;
  }
  const normalized = roleIdOrTitle.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (ROLE_PERSONALIZATION_REGISTRY[normalized]) {
    return true;
  }
  const byTitle = Object.values(ROLE_PERSONALIZATION_REGISTRY).find(
    r => r.title.toLowerCase() === roleIdOrTitle.toLowerCase() ||
         r.id.toLowerCase() === roleIdOrTitle.toLowerCase()
  );
  return !!byTitle;
}

/**
 * Normalizes a role string to its canonical role ID.
 * Returns 'soc-analyst' if invalid or missing.
 */
export function normalizeRoleId(roleIdOrTitle?: string | null): string {
  if (!roleIdOrTitle || typeof roleIdOrTitle !== 'string' || !roleIdOrTitle.trim()) {
    return 'soc-analyst';
  }
  const normalized = roleIdOrTitle.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (ROLE_PERSONALIZATION_REGISTRY[normalized]) {
    return ROLE_PERSONALIZATION_REGISTRY[normalized].id;
  }
  const byTitle = Object.values(ROLE_PERSONALIZATION_REGISTRY).find(
    r => r.title.toLowerCase() === roleIdOrTitle.toLowerCase() ||
         r.id.toLowerCase() === roleIdOrTitle.toLowerCase()
  );
  return byTitle ? byTitle.id : 'soc-analyst';
}
