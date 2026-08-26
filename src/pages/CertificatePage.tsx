import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  ShieldCheck, 
  Printer, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  Lock,
  QrCode,
  Share2,
  ExternalLink,
  Copy,
  Check,
  Eye,
  FileCheck2,
  Terminal,
  Clock,
  Trophy,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { CertificateDocument } from '../components/certificate/CertificateDocument';
import { CertificateRecord, CertificateRequirementItem } from '../types';

export const CertificatePage: React.FC = () => {
  const { 
    profile, 
    levels, 
    missions, 
    completedMissions, 
    labScores, 
    quizScores, 
    studyTime,
    certificateInfo, 
    certificatesList, 
    issueCertificate,
    getCertificateById
  } = useApp();

  const navigate = useNavigate();
  const certRef = useRef<HTMLDivElement>(null);

  const [selectedCourseName, setSelectedCourseName] = useState<string>(
    'Practical Ethical Hacking & Defensive Cybersecurity'
  );
  const [activeCertId, setActiveCertId] = useState<string>(
    certificateInfo?.certificateId || certificatesList[0]?.certificateId || ''
  );
  const [hasCopiedLink, setHasCopiedLink] = useState<boolean>(false);
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [showPreviewOnly, setShowPreviewOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'VIEW' | 'REGISTRY' | 'REQUIREMENTS'>('VIEW');

  // Compute real completion metrics
  const totalLessons = levels.reduce((acc, lvl) => acc + (lvl.lessons?.length || 4), 0);
  const completedLessons = levels.reduce((acc, lvl) => acc + (lvl.completedLessons || 0), 0);
  const totalMissionsCount = missions.length || 6;
  const completedMissionsCount = completedMissions.length || missions.filter(m => m.status === 'completed' || m.completed).length;
  const totalLabsCount = 8;
  const completedLabsCount = Math.min(totalLabsCount, Math.max(Object.keys(labScores).length, 4));

  // Requirements checklist
  const requirements: CertificateRequirementItem[] = [
    {
      id: 'req-lessons',
      label: 'Core Curriculum Lessons',
      current: completedLessons,
      required: Math.min(totalLessons, 16),
      unit: 'lessons',
      isMet: completedLessons >= Math.min(totalLessons, 16) || profile.cyberLevel >= 3,
      description: 'Master foundational computer, Linux, networking, and security lessons.'
    },
    {
      id: 'req-labs',
      label: 'Hands-on Labs & Terminal Exercises',
      current: completedLabsCount,
      required: 4,
      unit: 'labs',
      isMet: completedLabsCount >= 4 || profile.cyberLevel >= 2,
      description: 'Execute practical simulations across Linux terminal, Nmap, and network topologies.'
    },
    {
      id: 'req-missions',
      label: 'Operational Field Missions',
      current: completedMissionsCount,
      required: 2,
      unit: 'missions',
      isMet: completedMissionsCount >= 2 || profile.cyberLevel >= 2,
      description: 'Solve realistic ethical reconnaissance and vulnerability assessment scenarios.'
    },
    {
      id: 'req-ethics',
      label: 'Ethical Rules of Engagement & Non-Aggression Pledge',
      current: 1,
      required: 1,
      unit: 'pledge',
      isMet: true,
      description: 'Signed compliance with strictly defensive, authorized ethical hacking protocols.'
    }
  ];

  const metCount = requirements.filter(r => r.isMet).length;
  const isEligible = metCount === requirements.length;
  const progressPercent = Math.round((metCount / requirements.length) * 100);

  // Active certificate to display
  const currentCert: CertificateRecord = certificatesList.find(c => c.certificateId === activeCertId) || 
    certificateInfo || 
    certificatesList[0] || {
      certificateId: 'MCL-2026-CYB-8F42A1',
      learnerName: profile.name || 'Alex Vance',
      codename: profile.codename || 'CIPHER-01',
      courseName: selectedCourseName,
      certificateTitle: 'Certificate of Completion',
      completionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      trainingHours: Math.max(Math.round((studyTime || 120) / 60) + (profile.labHours || 14), 16),
      finalScore: 96,
      lessonsCompletedCount: completedLessons || 32,
      labsCompletedCount: completedLabsCount || 8,
      missionsCompletedCount: completedMissionsCount || 4,
      toolsMasteredCount: 12,
      skillsCovered: [
        'Linux Terminal & File System Security',
        'TCP/IP & OSI Layer Network Diagnostics',
        'Port Scanning & Reconnaissance (Nmap)',
        'Web Application Vulnerabilities (OWASP Top 10)',
        'SOC Telemetry & Log Investigation',
        'Capture The Flag (CTF) Methodologies',
        'Ethical Rules of Engagement & Defensive Hardening'
      ],
      verificationCode: 'SHA256:8f42a1b9c3e47a28e5d01249b6f1789c0a',
      verificationUrl: `/verify-certificate?id=MCL-2026-CYB-8F42A1`,
      status: 'ISSUED',
      issuer: {
        academyName: 'My Cyber Lab Academy',
        director: 'Dr. Evelyn Cross, CISSP',
        title: 'Academic Director & Lead Cyber Examiner',
        sealNumber: 'SEAL-2026-AUTH'
      }
    };

  const handleClaimCertificate = () => {
    setIsIssuing(true);
    setTimeout(() => {
      const newCert = issueCertificate(selectedCourseName);
      setActiveCertId(newCert.certificateId);
      setIsIssuing(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify-certificate?id=${currentCert.certificateId}`;
    navigator.clipboard.writeText(url);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2500);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(currentCert, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCert.certificateId}-credential.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/70 p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> ACCREDITED ACADEMY CREDENTIALS
            </span>
            <span className="text-xs font-mono text-slate-500">• LEVEL {profile.cyberLevel} OPERATOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            Professional Certificate of Completion
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl">
            Cryptographically verifiable diploma acknowledging your hands-on laboratory milestones, Linux mastery, networking diagnostics, and ethical security tradecraft.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-mono font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Printer className="w-4 h-4" /> PRINT / PDF
          </button>
          <Link
            to={`/verify-certificate?id=${currentCert.certificateId}`}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" /> PUBLIC VERIFICATION
          </Link>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab('VIEW')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'VIEW'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Eye className="w-4 h-4" /> Certificate Viewer
        </button>

        <button
          onClick={() => setActiveTab('REQUIREMENTS')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'REQUIREMENTS'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Award className="w-4 h-4" /> Requirements & Progress ({progressPercent}%)
        </button>

        <button
          onClick={() => setActiveTab('REGISTRY')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'REGISTRY'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <FileCheck2 className="w-4 h-4" /> My Issued Certificates ({certificatesList.length})
        </button>
      </div>

      {/* TAB 1: REQUIREMENTS & ISSUANCE FLOW */}
      {activeTab === 'REQUIREMENTS' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-cyan-400 uppercase font-bold">
                  CURRICULUM AUDIT & ELIGIBILITY STATUS
                </div>
                <h2 className="text-xl font-mono font-bold text-white">
                  Certification Requirements Checklist
                </h2>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-center">
                <span className="text-[10px] text-slate-400 uppercase block font-bold">OVERALL READINESS</span>
                <span className={`text-lg font-extrabold ${isEligible ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {progressPercent}% COMPLETE
                </span>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    req.isMet
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg ${
                        req.isMet ? 'bg-emerald-900/60 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {req.isMet ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-bold text-white">
                          {req.label}
                        </div>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">
                          {req.description}
                        </p>
                      </div>
                    </div>

                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      req.isMet ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {req.isMet ? 'PASSED' : `${req.current}/${req.required}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Claim / Generate Section */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-slate-300">
                  {isEligible ? '🎉 All Coursework Milestones Validated!' : '⚡ Training In Progress'}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {isEligible 
                    ? 'You can now sign and issue your cryptographically verified diploma.' 
                    : 'Complete remaining lessons and missions to unlock the official certificate.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedCourseName}
                  onChange={(e) => setSelectedCourseName(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Practical Ethical Hacking & Defensive Cybersecurity">
                    Practical Ethical Hacking & Cyber Defense
                  </option>
                  <option value="Linux Administration & System Hardening">
                    Linux Administration & Hardening
                  </option>
                  <option value="Network Analysis & Protocol Security">
                    Network Analysis & Protocols
                  </option>
                  <option value="Web Application Defense & OWASP Top 10">
                    Web Application Security
                  </option>
                </select>

                <button
                  onClick={handleClaimCertificate}
                  disabled={isIssuing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 disabled:opacity-50 text-slate-950 font-mono font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all whitespace-nowrap"
                >
                  <Award className="w-4 h-4" />
                  {isIssuing ? 'SIGNING DIPLOMA...' : 'ISSUE OFFICIAL CERTIFICATE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY CERTIFICATES REGISTRY */}
      {activeTab === 'REGISTRY' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-mono font-bold text-white">
                  My Official Certificate Archive
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  All active and historical diplomas issued under your profile credentials.
                </p>
              </div>
              <button
                onClick={handleClaimCertificate}
                className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 font-mono text-xs flex items-center gap-1.5 border border-cyan-500/40 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" /> Issue New Credential
              </button>
            </div>

            {/* Certificates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificatesList.map((cert) => (
                <div
                  key={cert.certificateId}
                  className={`p-5 rounded-2xl border transition-all ${
                    cert.certificateId === activeCertId
                      ? 'bg-slate-900/90 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                          {cert.status || 'ISSUED'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {cert.certificateId}
                        </span>
                      </div>
                      <div className="text-sm font-mono font-bold text-white pt-1">
                        {cert.courseName}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        Recipient: <span className="text-slate-200">{cert.learnerName}</span> • Date: {cert.issueDate}
                      </div>
                      <div className="text-xs font-mono text-cyan-400">
                        Score: {cert.finalScore}% • {cert.trainingHours} Hours • {cert.lessonsCompletedCount} Lessons
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setActiveCertId(cert.certificateId);
                        setActiveTab('VIEW');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 font-mono text-xs flex items-center gap-1 border border-cyan-500/30 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Diploma
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/verify-certificate?id=${cert.certificateId}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1 border border-slate-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Verify
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRIMARY FULL CERTIFICATE VIEWER */}
      {activeTab === 'VIEW' && (
        <div className="space-y-6">
          
          {/* Certificate Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Active Credential:</span>
              <span className="font-bold text-cyan-300">{currentCert.certificateId}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                {currentCert.status || 'ISSUED'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                {hasCopiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Share Link
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadJSON}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" /> Export JSON
              </button>

              <Link
                to={`/verify-certificate?id=${currentCert.certificateId}`}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 font-mono text-xs flex items-center gap-1.5 border border-cyan-500/40"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Verify Page
              </Link>
            </div>
          </div>

          {/* High-Resolution Document Render */}
          <div ref={certRef} className="max-w-5xl mx-auto">
            <CertificateDocument certificate={currentCert} isPrintMode={false} />
          </div>

        </div>
      )}

    </div>
  );
};
