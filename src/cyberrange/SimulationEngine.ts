import { LabEnvironment } from './LabEnvironment';
import { LabEnvironmentFactory } from './LabEnvironmentFactory';
import { ReplayEngine } from './ReplayEngine';

export const SimulationEngine = {
  loadOrCreateEnvironment(labId: string, seed: number = 1337): LabEnvironment {
    let saved = ReplayEngine.loadSavedState(labId);
    if (!saved) {
      saved = LabEnvironmentFactory.createEnvironment(labId, seed);
      ReplayEngine.saveState(saved);
    }
    return saved;
  },

  persistEnvironment(env: LabEnvironment) {
    ReplayEngine.saveState(env);
  }
};
