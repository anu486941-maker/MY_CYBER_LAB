import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Filter,
  Eye,
  ArrowRight,
  Server,
  Layers,
  Cpu
} from 'lucide-react';
import { IncidentState, toggleDefensiveControl, performRetest } from '../../utils/incidentStateEngine';

interface BluePurpleTeamPanelProps {
  state: IncidentState;
  onStateUpdated: (newState: IncidentState) => void;
}

export const BluePurpleTeamPanel: React.FC<BluePurpleTeamPanelProps> = ({
  state,
  onStateUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'BLUE' | 'PURPLE'>('BLUE');

  const handleToggleControl = (controlId: string) => {
    const { updatedState } = toggleDefensiveControl(state, controlId);
    onStateUpdated(updatedState);
  };

  const handleRunRetest = () => {
    const { updatedState } = performRetest(state);
    onStateUpdated(updatedState);
  };

  const isRemediated = state.remediationStatus === 'REMEDIATED' || Object.values(state.defensiveControls).some(c => c.applied);

  return (
    <div id="blue-purple-panel" className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            activeTab === 'BLUE' ? 'bg-blue-950/80 border-blue-500/40 text-blue-400' : 'bg-purple-950/80 border-purple-500/40 text-purple-400'
          }`}>
            {activeTab === 'BLUE' ? <ShieldAlert className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                activeTab === 'BLUE' ? 'bg-blue-950 text-blue-300 border border-blue-500/30' : 'bg-purple-950 text-purple-300 border border-purple-500/30'
              }`}>
                {activeTab === 'BLUE' ? 'BLUE TEAM AI DEFENDER' : 'PURPLE TEAM COMPARATIVE MATRIX'}
              </span>
              <span className="text-xs font-mono text-slate-400">Target: {state.discoveredAssets[0]?.host || '10.200.1.25'}</span>
            </div>
            <h3 className="text-base font-bold font-mono text-slate-100">
              {activeTab === 'BLUE' ? 'Blue Team Defensive Analysis & Control Engine' : 'Purple Team Attack vs Defense Evaluation'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('BLUE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'BLUE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Blue Team Mode</span>
          </button>
          <button
            onClick={() => setActiveTab('PURPLE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'PURPLE' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Purple Team Mode</span>
          </button>
        </div>
      </div>

      {activeTab === 'BLUE' ? (
        /* Blue Team View */
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Control Panel */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-mono font-bold text-blue-300 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Active Defensive Controls & Hardening Rules</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.values(state.defensiveControls).map((ctrl) => (
                  <div
                    key={ctrl.id}
                    className={`p-4 rounded-xl border transition-all space-y-2 text-left ${
                      ctrl.applied
                        ? 'bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-950/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-slate-100">{ctrl.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        ctrl.applied ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {ctrl.applied ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-400 leading-relaxed">{ctrl.description}</p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                      <span className="text-[10px] font-mono text-slate-500">Type: {ctrl.ruleType}</span>
                      <button
                        onClick={() => handleToggleControl(ctrl.id)}
                        className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                          ctrl.applied
                            ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/40'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                        }`}
                      >
                        {ctrl.applied ? 'Disable Control' : 'Deploy Control'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Retest Trigger */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-mono font-bold text-slate-200">Red Team Retest Engine</h5>
                  <p className="text-xs text-slate-400 font-mono">
                    Re-run original exploit payload to verify if active Blue Team controls block the vulnerability.
                  </p>
                </div>
                <button
                  onClick={handleRunRetest}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute Retest</span>
                </button>
              </div>
            </div>

            {/* SIEM Telemetry & Alerts */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-blue-300 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Live SIEM Telemetry Log</span>
              </h4>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 max-h-80 overflow-y-auto custom-scrollbar font-mono text-xs">
                {state.triggeredAlerts.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-xs">No SIEM alerts logged yet.</div>
                ) : (
                  state.triggeredAlerts.map((alert) => (
                    <div key={alert.id} className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          alert.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                          alert.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                          'bg-blue-950 text-blue-300 border border-blue-500/30'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                      </div>
                      <div className="font-bold text-slate-200 text-[11px]">{alert.title}</div>
                      <p className="text-slate-400 text-[10px] leading-relaxed">{alert.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Purple Team View */
        <div className="space-y-5">
          {/* Comparative Pipeline */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-purple-300 uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Purple Team Incident Sequence Flow</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase">1. Attack Action</span>
                <p className="text-slate-200 text-xs font-semibold">{state.executedActions[0]?.commandOrAction || 'Recon scan'}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase">2. Telemetry</span>
                <p className="text-slate-200 text-xs font-semibold">{state.triggeredAlerts.length} Events Logged</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase">3. Detection</span>
                <p className="text-slate-200 text-xs font-semibold">{state.triggeredAlerts[0]?.severity || 'MEDIUM'} Severity</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">4. Defense</span>
                <p className="text-slate-200 text-xs font-semibold">{state.remediationStatus}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">5. Retest Result</span>
                <p className="text-slate-200 text-xs font-semibold">{isRemediated ? 'MITIGATED (403)' : 'EXPLOITABLE (200)'}</p>
              </div>
            </div>
          </div>

          {/* Matrix Comparison Table */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Before Defense vs After Defense Matrix</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                    <th className="p-2.5">Metric</th>
                    <th className="p-2.5">Before Defense</th>
                    <th className="p-2.5">After Defense</th>
                    <th className="p-2.5">Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">Attack Exploit Status</td>
                    <td className="p-2.5 text-rose-400">HTTP 200 OK — Vulnerable</td>
                    <td className="p-2.5 text-emerald-400">{isRemediated ? 'HTTP 403 Forbidden — Blocked' : 'HTTP 200 OK — Vulnerable'}</td>
                    <td className="p-2.5 font-bold">{isRemediated ? 'Mitigated (+100%)' : 'Unmitigated (0%)'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">SIEM Alert Severity</td>
                    <td className="p-2.5 text-amber-400">MEDIUM (Scan Anomaly)</td>
                    <td className="p-2.5 text-blue-400">HIGH / CRITICAL (WAF Block)</td>
                    <td className="p-2.5 font-bold">Visibility Elevated</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">Evidence Quality</td>
                    <td className="p-2.5">{state.collectedEvidence.length} Lock(s)</td>
                    <td className="p-2.5">{state.collectedEvidence.length} Lock(s) with SHA-256 Verification</td>
                    <td className="p-2.5 font-bold">100% Chain-of-Custody</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-200">Target Risk Level</td>
                    <td className="p-2.5 text-rose-400">CRITICAL RISK</td>
                    <td className="p-2.5 text-emerald-400">{isRemediated ? 'LOW RISK (Hardened)' : 'CRITICAL RISK'}</td>
                    <td className="p-2.5 font-bold">{isRemediated ? 'Risk Reduced' : 'Action Needed'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
