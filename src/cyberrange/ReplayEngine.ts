import { LabEnvironment } from './LabEnvironment';
import { LabEnvironmentFactory } from './LabEnvironmentFactory';

export const ReplayEngine = {
  resetWithSeed(labId: string, seed: number): LabEnvironment {
    const env = LabEnvironmentFactory.createEnvironment(labId, seed);
    localStorage.setItem(`mycyberlab_env_${labId}`, JSON.stringify(env));
    return env;
  },

  loadSavedState(labId: string): LabEnvironment | null {
    const saved = localStorage.getItem(`mycyberlab_env_${labId}`);
    if (saved) {
      try {
        return JSON.parse(saved) as LabEnvironment;
      } catch {
        return null;
      }
    }
    return null;
  },

  saveState(env: LabEnvironment) {
    localStorage.setItem(`mycyberlab_env_${env.labId}`, JSON.stringify(env));
  }
};
