import { LabEnvironment, LabHostNode } from './LabEnvironment';

export const TargetStateEngine = {
  updateNodeStatus(env: LabEnvironment, hostId: string, status: 'UNKNOWN' | 'DISCOVERED' | 'ENUMERATED' | 'COMPROMISED' | 'MITIGATED'): LabEnvironment {
    const updated = JSON.parse(JSON.stringify(env)) as LabEnvironment;
    const node = updated.hosts.find(h => h.id === hostId);
    if (node) {
      node.status = status;
      if (status !== 'UNKNOWN' && !updated.discoveredAssets.includes(node.id)) {
        updated.discoveredAssets.push(node.id);
      }
      if (status === 'COMPROMISED' && !updated.compromisedAssets.includes(node.id)) {
        updated.compromisedAssets.push(node.id);
      }
    }
    return updated;
  },

  discoverConnectedNodes(env: LabEnvironment, completedHostId: string): LabEnvironment {
    const updated = JSON.parse(JSON.stringify(env)) as LabEnvironment;
    updated.hosts.forEach(host => {
      if (host.dependencies.includes(completedHostId) && host.status === 'UNKNOWN') {
        host.status = 'DISCOVERED';
        if (!updated.discoveredAssets.includes(host.id)) {
          updated.discoveredAssets.push(host.id);
        }
      }
    });
    return updated;
  }
};
