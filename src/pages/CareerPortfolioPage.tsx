import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCareerRoleById } from '../data/careerRolesData';
import { CareerReadinessService } from '../services/careerReadinessService';
import { 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  Terminal, 
  Sparkles, 
  Layers, 
  FileText, 
  ExternalLink,
  Flame,
  Globe,
  Lock,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CareerPortfolioPage: React.FC = () => {
  const { 
    profile, 
    missions, 
    certificatesList, 
    certificateInfo, 
    completedMissions, 
    engagementReports, 
    securityFindings,
    skillMasteries,
    mistakes,
    evidenceLocker
  } = useApp();
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const currentRole = getCareerRoleById(profile.targetRole || profile.careerPath || 'soc-analyst');
  const verifiedCert = (certificatesList && certificatesList.length > 0) ? certificatesList[0] : certificateInfo;

  const completedMissionsList = missions.filter(
    (m) => m.status === 'completed' || completedMissions?.includes(m.id)
  );

  // Compute 9-Pillar Career Readiness
  const readiness = CareerReadinessService.calculateReadiness({
    profile,
    skillMasteries: skillMasteries || [],
    mistakes: mistakes || [],
    completedMissionsCount: completedMissionsList.length,
    evidenceCount: evidenceLocker?.length || 0,
    reportsCount: (engagementReports?.length || 0) + (securityFindings?.length || 0)
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const portfolioData = {
      candidate: {
        name: profile.name,
        codename: profile.codename || 'CIPHER-01',
        careerSpecialization: currentRole.title,
        experienceLevel: profile.experienceLevel,
        dailyGoal: profile.dailyTime,
        totalXp: profile.xp,
        currentCyberLevel: profile.cyberLevel
      },
      readinessScore: readiness.overallScore,
      readinessTier: readiness.careerReadinessTier,
      readinessPillars: readiness.pillars,
      verifiedCertificates: certificatesList,
      completedMissionsCount: completedMissionsList.length,
      completedMissions: completedMissionsList.map((m) => ({
        id: m.id,
        title: m.title,
        category: m.category,
        difficulty: m.difficulty,
        xp: m.xp
      })),
      verifiedSkills: [
        'Linux System Administration & SUID Auditing',
        'TCP/IP & Packet Diagnostics (Wireshark/ss)',
        'Network Reconnaissance (Nmap)',
        'OWASP Top 10 Web Security Testing',
        'SOC Alert Triage & SIEM Analysis',
        'Sigma Detection Rule Authoring'
      ],
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(portfolioData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cyber_Portfolio_${profile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      
      {/* Action Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" /> VERIFIED CYBER PORTFOLIO
          </div>
          <h1 className="text-2xl font-mono font-bold text-white">
            Professional Cybersecurity Record
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Automatically compiled evidence of completed labs, missions, CTF solutions, and verifiable credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/career-simulation"
            className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>LAUNCH SIMULATION</span>
          </Link>

          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'LINK COPIED!' : 'SHARE LINK'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> JSON EXPORT
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> PRINT TO PDF
          </button>
        </div>
      </div>

      {/* PORTFOLIO DOCUMENT CANVAS */}
      <div className="bg-slate-950 border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-10 print:border-none print:p-0 print:bg-white print:text-black">
        
        {/* Candidate Profile Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-800 print:border-slate-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                {currentRole.emoji} {currentRole.title}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-400 text-xs font-mono">
                Level {profile.cyberLevel} Operator
              </span>
            </div>

            <h2 className="text-3xl font-mono font-bold text-white print:text-black">
              {profile.name}
            </h2>

            <p className="text-xs font-mono text-slate-400 print:text-slate-700">
              Codename: <strong className="text-cyan-300 print:text-black">{profile.codename || 'CIPHER-01'}</strong> • Verified Practical Cybersecurity Candidate
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 print:bg-slate-100 text-center">
              <div className="text-lg font-bold text-cyan-400 print:text-black">{readiness.overallScore}%</div>
              <div className="text-[10px] text-slate-500 uppercase">JOB READINESS</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 print:bg-slate-100 text-center">
              <div className="text-lg font-bold text-emerald-400 print:text-black">{profile.xp}</div>
              <div className="text-[10px] text-slate-500 uppercase">EARNED XP</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 print:bg-slate-100 text-center col-span-2 sm:col-span-1">
              <div className="text-lg font-bold text-purple-400 print:text-black">{completedMissionsList.length}</div>
              <div className="text-[10px] text-slate-500 uppercase">MISSIONS</div>
            </div>
          </div>
        </div>

        {/* 1. CAREER READINESS SCORECARD (9 PILLARS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase flex items-center gap-2 print:text-black">
              <TrendingUp className="w-4 h-4 text-cyan-400 print:text-black" /> 1. CAREER READINESS INDEX & PILLARS
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              {readiness.careerReadinessTier.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            {Object.entries(readiness.pillars).map(([key, pillar]) => (
              <div key={key} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold print:text-black">{pillar.name}</span>
                  <span className={`font-bold ${
                    pillar.score >= 80 ? 'text-emerald-400' :
                    pillar.score >= 65 ? 'text-cyan-400' :
                    pillar.score >= 45 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {pillar.score}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      pillar.score >= 80 ? 'bg-emerald-400' :
                      pillar.score >= 65 ? 'bg-cyan-400' :
                      pillar.score >= 45 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-tight line-clamp-2">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Biggest Gap Callout */}
          {readiness.biggestGap && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-amber-300 font-bold">Target Growth Priority: {readiness.biggestGap.name} ({readiness.biggestGap.score}%)</span>
                  <p className="text-slate-300 text-[11px] font-sans">{readiness.biggestGap.remediation}</p>
                </div>
              </div>
              <Link
                to={readiness.biggestGap.targetRoute}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 flex items-center gap-1 transition-all"
              >
                <span>Launch Drill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* 2. VERIFIED CERTIFICATES */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase flex items-center gap-2 print:text-black">
            <Award className="w-4 h-4 text-cyan-400 print:text-black" /> 2. VERIFIABLE ACADEMY CREDENTIALS
          </h3>

          {verifiedCert ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-mono font-bold text-white print:text-black">
                  {verifiedCert.certificateTitle || 'Certificate of Completion'}
                </div>
                <div className="text-xs text-slate-400 font-mono print:text-slate-700">
                  Course: <strong className="text-slate-200 print:text-black">{verifiedCert.courseName}</strong>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  ID: <span className="text-cyan-300 print:text-black">{verifiedCert.certificateId}</span> • Issued: {verifiedCert.completionDate} • Training Hours: {verifiedCert.trainingHours} hrs
                </div>
              </div>

              <Link
                to={`/verify-certificate/${verifiedCert.certificateId}`}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 print:hidden"
              >
                <span>VERIFY ON-CHAIN</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Complete all 32 curriculum modules & final capstone to issue your permanent credential.</span>
              <Link to="/certificate" className="text-cyan-400 hover:text-cyan-300 underline">
                View Certificate Requirements →
              </Link>
            </div>
          )}
        </div>

        {/* 3. DEMONSTRATED TECHNICAL SKILLS MATRIX */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase flex items-center gap-2 print:text-black">
            <ShieldCheck className="w-4 h-4 text-emerald-400 print:text-black" /> 3. DEMONSTRATED COMPETENCIES & TOOLCHAINS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {[
              { skill: 'Linux Kernel & System Administration', desc: 'File permissions, SUID discovery, process analysis, and log auditing' },
              { skill: 'Layer 2 - 4 Network Diagnostics', desc: 'TCP 3-way handshake analysis, ARP inspection, and Wireshark packet capture' },
              { skill: 'Reconnaissance & Surface Mapping', desc: 'Nmap TCP SYN scanning, service banner grabbing, and subnet discovery' },
              { skill: 'Web Security & OWASP Top 10', desc: 'SQL Injection mitigation, XSS prevention, and CSRF token verification' },
              { skill: 'SOC Triage & Log Investigation', desc: 'SIEM alert analysis, brute-force correlation, and Sigma detection rules' },
              { skill: 'Cryptographic Security & TLS', desc: 'Diffie-Hellman key exchange, hashing algorithms, and X.509 certificates' }
            ].map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-1">
                <div className="font-bold text-white print:text-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 print:text-black shrink-0" />
                  <span>{s.skill}</span>
                </div>
                <p className="text-[11px] text-slate-400 print:text-slate-600 font-sans">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. VERIFIED LABS & MISSIONS EVIDENCE */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-purple-400 uppercase flex items-center gap-2 print:text-black">
            <Terminal className="w-4 h-4 text-purple-400 print:text-black" /> 4. COMPLETED LABS & TACTICAL MISSIONS
          </h3>

          {completedMissionsList.length > 0 ? (
            <div className="space-y-2">
              {completedMissionsList.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-slate-50 print:border-slate-300 flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-black" />
                    <div>
                      <strong className="text-white print:text-black">{m.title}</strong>
                      <span className="text-slate-500 ml-2">({m.category})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 print:text-black text-[10px]">
                      {m.difficulty}
                    </span>
                    <span className="text-emerald-400 font-bold">+{m.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
              No tactical missions completed yet. Visit the Missions Console to solve hands-on investigations.
            </div>
          )}
        </div>

        {/* 5. CAREER CAPSTONE PROJECT DELIVERABLE */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 space-y-3">
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 5. ACCREDITED CAREER CAPSTONE
          </div>
          <h4 className="text-base font-mono font-bold text-white">
            Enterprise Incident Response & Perimeter Hardening Capstone
          </h4>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Hands-on multi-stage investigation assessing telemetry from compromised endpoints, validating network segmentation, writing Sigma detection signatures, and producing an executive root-cause remediation deliverable.
          </p>
        </div>

        {/* 6. AUTHORIZED CLIENT ENGAGEMENT (ACE) DELIVERABLES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase flex items-center gap-2 print:text-black">
              <ShieldCheck className="w-4 h-4 text-cyan-400 print:text-black" /> 6. AUTHORIZED CLIENT ENGAGEMENT DELIVERABLES
            </h3>
            <Link to="/ace" className="text-xs font-mono text-cyan-400 hover:underline print:hidden flex items-center gap-1">
              ACE Console <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {engagementReports.length > 0 ? (
            <div className="space-y-3">
              {engagementReports.map((rep) => (
                <div key={rep.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">PENETRATION TEST DELIVERABLE</span>
                      <h4 className="font-mono font-bold text-white text-base print:text-black">{rep.clientName} Assessment Report</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                      AMAN Score: {rep.score}/100
                    </span>
                  </div>
                  <p className="text-xs font-sans text-slate-300 print:text-slate-700 leading-relaxed">
                    {rep.executiveSummary}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>Audit Date: {rep.createdAt}</span>
                    <span>Methodology: {rep.methodology}</span>
                    <span className="text-emerald-400">Findings: {rep.findings.length} documented</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
              No formal client reports published yet. Launch the Authorized Client Engagement simulator to conduct hands-on pentesting against enterprise subnets.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
