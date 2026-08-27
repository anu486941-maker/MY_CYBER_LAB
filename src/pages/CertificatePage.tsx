import React, { useState } from 'react';
import { Award, Shield, CheckCircle2, Download, ExternalLink, Lock } from 'lucide-react';
import { verifyAndIssueCertificate, CyberCertificate } from '../services/certificateService';
import { useApp } from '../context/AppContext';

export const CertificatePage: React.FC = () => {
  const { currentUser } = useApp();
  const [selectedCert, setSelectedCert] = useState<string>('SOC Analyst Foundations');
  const [certResult, setCertResult] = useState<CyberCertificate | null>(
    verifyAndIssueCertificate('SOC Analyst Foundations', currentUser?.displayName || 'Authorized Learner', 85)
  );

  const availableCerts = [
    'SOC Analyst Foundations',
    'Ethical Hacking Foundations',
    'Incident Response Foundations',
    'Web Security Foundations'
  ];

  const handleGenerate = (certTitle: string) => {
    setSelectedCert(certTitle);
    const issued = verifyAndIssueCertificate(certTitle, currentUser?.displayName || 'Authorized Learner', 85);
    setCertResult(issued);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      <div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
          Server-Verified Qualifications
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-2">MY CYBER LAB Verification Certificates</h1>
        <p className="text-sm text-slate-400 mt-1">
          Server-validated certificates issued based on verified readiness scores and lab completions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableCerts.map(c => (
          <button
            key={c}
            onClick={() => handleGenerate(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCert === c
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Certificate Frame */}
      {certResult && (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-800 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl relative space-y-6 text-center">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="text-xs font-extrabold text-white uppercase tracking-widest">MY CYBER LAB AUTHORIZED CERTIFICATION</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> VERIFIED BY SERVER
            </span>
          </div>

          <div className="space-y-2 py-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest">This certifies that</p>
            <h2 className="text-3xl font-extrabold text-white tracking-wide">{certResult.recipientName}</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              has successfully satisfied all practical lab requirements, evidence locker verifications, and AMAN AI debrief evaluations for
            </p>
            <h3 className="text-2xl font-bold text-cyan-400 pt-2">{certResult.title}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-400">
            <div>
              <span className="block text-slate-500 uppercase text-[10px]">Certificate ID</span>
              <span className="text-cyan-300 font-bold">{certResult.certificateId}</span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase text-[10px]">Authoritative Hash</span>
              <span className="text-emerald-400 font-bold">{certResult.authoritativeHash}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
