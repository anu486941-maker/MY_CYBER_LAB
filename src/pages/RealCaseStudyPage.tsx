/**
 * Real Case Study Mode Page
 * Uses publicly documented cybersecurity incidents only as educational case studies.
 * Clearly distinguishes [DOCUMENTED FACT], [SIMULATED ELEMENT], and [LEARNER HYPOTHESIS].
 */

import React, { useState } from 'react';
import { BookOpen, Shield, AlertTriangle, FileText, CheckCircle2, Tag } from 'lucide-react';

interface EducationalCaseStudy {
  id: string;
  title: string;
  threatActor: string;
  year: number;
  initialAccess: string;
  documentedFacts: string[];
  simulatedElements: string[];
  mitreMapping: string[];
  lessonsLearned: string[];
}

const CASE_STUDIES: EducationalCaseStudy[] = [
  {
    id: 'case-solarwinds-2020',
    title: 'SUNBURST Supply Chain Intrusion',
    threatActor: 'NOBELIUM / APT29',
    year: 2020,
    initialAccess: 'Trojanized Orion software build system updates.',
    documentedFacts: [
      '[DOCUMENTED FACT] Adversary inserted malicious code into Orion software updates via source code modification.',
      '[DOCUMENTED FACT] SUNBURST malware used steganography and domain generation algorithms (DGA) to evade network detection.',
      '[DOCUMENTED FACT] C2 communication relied on spoofed domain names resembling legitimate Orion API endpoints.'
    ],
    simulatedElements: [
      '[SIMULATED ELEMENT] Synthetic build log telemetry file in MY CYBER LAB sandbox.',
      '[SIMULATED ELEMENT] Isolated mock DGA domain lookup exercise inside 10.200.1.0/24 range.'
    ],
    mitreMapping: ['T1195.002', 'T1071.001', 'T1027'],
    lessonsLearned: [
      'Enforce reproducible software builds with cryptographic hash verification.',
      'Implement strict outbound network filtering for infrastructure servers.'
    ]
  },
  {
    id: 'case-equifax-2017',
    title: 'Apache Struts OGNL Remote Code Execution',
    threatActor: 'Unauthenticated Remote Adversary',
    year: 2017,
    initialAccess: 'Unpatched CVE-2017-5638 Apache Struts vulnerability in dispute portal.',
    documentedFacts: [
      '[DOCUMENTED FACT] Attackers exploited Jakarta Multipart parser error handling via OGNL payload in Content-Type header.',
      '[DOCUMENTED FACT] Adversary executed whoami and privilege enumeration commands on web server hosts.',
      '[DOCUMENTED FACT] Over 140 million customer PII records were exfiltrated over several months.'
    ],
    simulatedElements: [
      '[SIMULATED ELEMENT] Mock Jakarta header parser inside isolated test container.',
      '[SIMULATED ELEMENT] Synthetic SQL query log showing unencrypted PII reflection.'
    ],
    mitreMapping: ['T1190', 'T1059.004', 'T1005'],
    lessonsLearned: [
      'Establish a 72-hour emergency patching SLA for internet-facing critical vulnerabilities.',
      'Enforce network segment isolation between web tier and internal database servers.'
    ]
  }
];

export const RealCaseStudyPage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<EducationalCaseStudy>(CASE_STUDIES[0]);
  const [learnerHypothesis, setLearnerHypothesis] = useState<string>('');
  const [hypotheses, setHypotheses] = useState<string[]>([]);

  const handleAddHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerHypothesis.trim()) return;
    setHypotheses(prev => [...prev, `[LEARNER HYPOTHESIS] ${learnerHypothesis}`]);
    setLearnerHypothesis('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      <div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
          Public Educational Case Studies
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-2">Real Case Study Investigation Mode</h1>
        <p className="text-sm text-slate-400 mt-1">
          Analyze documented historical cybersecurity incidents with strict separation of facts, synthetic lab elements, and learner hypotheses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Case List Selector */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Select Educational Case:</h2>
          {CASE_STUDIES.map(cs => (
            <button
              key={cs.id}
              onClick={() => setSelectedCase(cs)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                selectedCase.id === cs.id
                  ? 'bg-slate-800 border-cyan-500 shadow-lg ring-1 ring-cyan-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <h3 className="font-bold text-white text-base">{cs.title}</h3>
              <p className="text-xs text-cyan-400 mt-1">{cs.threatActor} ({cs.year})</p>
            </button>
          ))}
        </div>

        {/* Selected Case Details */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedCase.title}</h2>
            <p className="text-xs text-slate-400 mt-1">Initial Access Vector: {selectedCase.initialAccess}</p>
          </div>

          {/* Documented Facts */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Documented Facts:
            </h3>
            <div className="space-y-1.5">
              {selectedCase.documentedFacts.map((fact, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-emerald-950 rounded text-xs text-slate-200">
                  {fact}
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Elements */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" /> Simulated MY CYBER LAB Elements:
            </h3>
            <div className="space-y-1.5">
              {selectedCase.simulatedElements.map((elem, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-cyan-950 rounded text-xs text-slate-300 font-mono">
                  {elem}
                </div>
              ))}
            </div>
          </div>

          {/* Learner Hypothesis Builder */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-400" /> Learner Hypotheses:
            </h3>

            <form onSubmit={handleAddHypothesis} className="flex gap-2">
              <input
                type="text"
                placeholder="Formulate an investigation hypothesis..."
                value={learnerHypothesis}
                onChange={(e) => setLearnerHypothesis(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded transition"
              >
                Log Hypothesis
              </button>
            </form>

            <div className="space-y-1">
              {hypotheses.map((h, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-amber-950 text-xs text-amber-300 rounded font-mono">
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealCaseStudyPage;
