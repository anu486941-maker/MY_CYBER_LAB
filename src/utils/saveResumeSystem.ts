import { UserProfile } from '../types';

export interface ApplicationStateExport {
  schemaVersion: number;
  exportedAt: string;
  appVersion: string;
  user: UserProfile;
  missions: Record<string, any>;
  modules: Record<string, any>;
  customNotes?: any[];
  userSettings?: Record<string, any>;
  lastSavedLocation?: {
    path: string;
    timestamp: string;
    roleId?: string;
    moduleId?: string;
  };
}

export const CURRENT_SCHEMA_VERSION = 2;

/**
 * Serializes the full application state into a validated JSON string
 */
export function exportStateToJSON(
  userProfile: UserProfile,
  missions: Record<string, any>,
  modules: Record<string, any>,
  currentPath?: string
): string {
  const exportData: ApplicationStateExport = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: '1.0.0-PRO',
    user: userProfile,
    missions,
    modules,
    lastSavedLocation: {
      path: currentPath || '/dashboard',
      timestamp: new Date().toISOString(),
      roleId: userProfile.targetRole,
      moduleId: (userProfile as any).currentModule
    }
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Parses and validates an imported JSON state string with automatic migration support
 */
export function parseAndValidateImport(
  jsonString: string
): { success: boolean; data?: ApplicationStateExport; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid state file format.' };
    }

    if (!parsed.user || !parsed.user.uid || !parsed.user.codename) {
      return { success: false, error: 'State export missing core user identity profile.' };
    }

    // Schema version migration handler
    let migratedData = { ...parsed };
    if (!migratedData.schemaVersion || migratedData.schemaVersion < CURRENT_SCHEMA_VERSION) {
      migratedData = migrateSchema(migratedData);
    }

    return { success: true, data: migratedData };
  } catch (err: any) {
    return { success: false, error: `JSON Parse Error: ${err.message || 'Corrupted file'}` };
  }
}

/**
 * Handles backwards-compatible schema upgrades
 */
function migrateSchema(oldData: any): ApplicationStateExport {
  const user = oldData.user || {};
  const missions = oldData.missions || {};
  const modules = oldData.modules || {};

  // Ensure new required v2 fields are present
  const migratedUser: UserProfile = {
    ...user,
    tier: (user as any).tier || 'FREE',
    unlockedRoles: (user as any).unlockedRoles || [user.targetRole || 'soc-analyst'],
    onboardingCompleted: user.onboardingCompleted ?? true,
    lastActiveDate: new Date().toISOString()
  };

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: oldData.exportedAt || new Date().toISOString(),
    appVersion: '1.0.0-PRO',
    user: migratedUser,
    missions,
    modules,
    lastSavedLocation: oldData.lastSavedLocation || {
      path: '/dashboard',
      timestamp: new Date().toISOString(),
      roleId: migratedUser.targetRole
    }
  };
}

/**
 * Download helper for browser state backup
 */
export function downloadStateBackup(
  userProfile: UserProfile,
  missions: Record<string, any>,
  modules: Record<string, any>,
  currentPath?: string
) {
  const jsonString = exportStateToJSON(userProfile, missions, modules, currentPath);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `MY_CYBER_LAB_STATE_${userProfile.codename.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
