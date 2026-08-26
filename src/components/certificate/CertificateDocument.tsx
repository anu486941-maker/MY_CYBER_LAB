import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Cpu, 
  Terminal, 
  ExternalLink,
  Lock
} from 'lucide-react';
import { CertificateRecord } from '../../types';

interface CertificateDocumentProps {
  certificate: CertificateRecord;
  id?: string;
  isPrintMode?: boolean;
}

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  certificate,
  id = 'printable-certificate',
  isPrintMode = false
}) => {
  const verificationUrl = certificate.verificationUrl?.startsWith('http')
    ? certificate.verificationUrl
    : typeof window !== 'undefined'
      ? `${window.location.origin}/verify-certificate?id=${certificate.certificateId}`
      : `/verify-certificate?id=${certificate.certificateId}`;

  return (
    <div
      id={id}
      className={`relative w-full bg-slate-950 text-slate-100 font-sans border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl transition-all ${
        isPrintMode ? 'print:rounded-none print:border-none print:shadow-none' : ''
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.12) 0%, transparent 60%),
          radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          linear-gradient(to bottom, #020617, #030712)
        `
      }}
    >
      {/* Decorative Guilloche-style Dual Borders */}
      <div className="absolute inset-3 sm:inset-4 border border-cyan-500/20 rounded-2xl pointer-events-none" />
      <div className="absolute inset-5 sm:inset-6 border border-emerald-500/15 rounded-xl pointer-events-none" />

      {/* Subtle Grid Watermark Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Corner Technical Crosshairs */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

      {/* Certificate Content Container */}
      <div className="relative z-10 space-y-6 sm:space-y-8">
        
        {/* Header Branding & Crest */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)]">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] sm:text-xs font-mono font-extrabold tracking-[0.3em] text-cyan-400 uppercase">
              {certificate.issuer?.academyName || 'MY CYBER LAB ACADEMY & CYBER RANGE'}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-mono font-black tracking-tight text-white uppercase">
              {certificate.certificateTitle || 'CERTIFICATE OF COMPLETION'}
            </h1>
            <div className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold tracking-wider uppercase">
              PRACTICAL ETHICAL HACKING & CYBER DEFENSE MASTERY
            </div>
          </div>

          {/* Ornamental Divider */}
          <div className="flex items-center justify-center gap-2 w-full max-w-md pt-1">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-cyan-500" />
            <div className="w-2 h-2 rotate-45 border border-cyan-400 bg-cyan-950" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-cyan-500/50 to-cyan-500" />
          </div>
        </div>

        {/* Recipient Details */}
        <div className="text-center space-y-3 sm:space-y-4 py-2">
          <p className="text-[11px] sm:text-xs font-mono text-slate-400 uppercase tracking-[0.25em]">
            THIS OFFICIAL CREDENTIAL IS PROUDLY CONFERRED UPON
          </p>

          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl md:text-6xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-emerald-200 tracking-tight">
              {certificate.learnerName}
            </div>
            {certificate.codename && (
              <div className="text-xs sm:text-sm font-mono text-cyan-400/90 font-medium">
                OPERATOR CODENAME: <span className="font-bold text-cyan-300">[{certificate.codename.toUpperCase()}]</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans px-4">
            For successfully completing all rigorous training curricula, practical terminal exercises, and simulated attack & defense operations in:
          </p>

          <div className="inline-block px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-cyan-300 font-mono text-xs sm:text-base font-bold shadow-inner">
            {certificate.courseName}
          </div>
        </div>

        {/* Verified Practical Achievements Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto font-mono text-center">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 uppercase">
              <Clock className="w-3 h-3 text-cyan-400" /> DURATION
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-100">
              {certificate.trainingHours} Hours
            </div>
            <div className="text-[9px] text-cyan-400/80">Hands-on Labs</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 uppercase">
              <Trophy className="w-3 h-3 text-amber-400" /> FINAL SCORE
            </div>
            <div className="text-sm sm:text-base font-bold text-amber-300">
              {certificate.finalScore}%
            </div>
            <div className="text-[9px] text-amber-400/80">Assessment Grade</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 uppercase">
              <Terminal className="w-3 h-3 text-emerald-400" /> CURRICULUM
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-300">
              {certificate.lessonsCompletedCount} Lessons
            </div>
            <div className="text-[9px] text-emerald-400/80">{certificate.labsCompletedCount} Practical Labs</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 uppercase">
              <Cpu className="w-3 h-3 text-purple-400" /> MISSIONS
            </div>
            <div className="text-sm sm:text-base font-bold text-purple-300">
              {certificate.missionsCompletedCount} Completed
            </div>
            <div className="text-[9px] text-purple-400/80">{certificate.toolsMasteredCount} Tools Mastered</div>
          </div>
        </div>

        {/* Core Skills Badges */}
        {certificate.skillsCovered && certificate.skillsCovered.length > 0 && (
          <div className="space-y-2 max-w-3xl mx-auto">
            <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase text-center">
              DEMONSTRATED COMPETENCIES & DOMAINS
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {certificate.skillsCovered.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300 text-[10px] sm:text-[11px] font-mono flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Signatures, Cryptographic Seal, and QR Verification Block */}
        <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 font-mono text-center sm:text-left">
          
          {/* Left: Authorized Director Signature */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="h-10 flex items-end justify-center sm:justify-start">
              <div className="font-serif italic text-lg sm:text-xl text-cyan-300 tracking-wide font-normal">
                Dr. Evelyn Cross
              </div>
            </div>
            <div className="h-[1px] w-full max-w-[200px] mx-auto sm:mx-0 bg-slate-700" />
            <div className="text-xs font-bold text-slate-200">
              {certificate.issuer?.director || 'Dr. Evelyn Cross, CISSP'}
            </div>
            <div className="text-[10px] text-slate-400">
              {certificate.issuer?.title || 'Academic Director & Lead Examiner'}
            </div>
            <div className="text-[9px] text-slate-500">
              Issued on: {certificate.issueDate}
            </div>
          </div>

          {/* Center: Official Holographic Academy Seal */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-cyan-400/60 bg-gradient-to-tr from-cyan-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)] p-2 text-center">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mb-0.5" />
              <span className="text-[8px] font-mono font-extrabold text-cyan-300 leading-tight uppercase">
                OFFICIAL SEAL
              </span>
              <span className="text-[7px] font-mono text-emerald-400">
                VERIFIED AUTH
              </span>
            </div>
            <div className="text-[9px] font-mono text-slate-400">
              {certificate.issuer?.sealNumber || 'SEAL-2026-AUTH'}
            </div>
          </div>

          {/* Right: QR Code & Verification ID */}
          <div className="flex flex-col items-center sm:items-end justify-center space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white text-slate-950 shadow-md">
                <QRCodeSVG
                  value={verificationUrl}
                  size={64}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="text-center sm:text-right space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">
                  VERIFICATION ID
                </span>
                <span className="text-xs font-extrabold text-cyan-300 block font-mono">
                  {certificate.certificateId}
                </span>
                <span className="text-[8px] text-emerald-400 font-bold block">
                  STATUS: {certificate.status || 'ISSUED'}
                </span>
                <span className="text-[8px] text-slate-500 block">
                  Scan to verify online
                </span>
              </div>
            </div>
            <div className="text-[8px] text-slate-500 font-mono max-w-[220px] text-center sm:text-right truncate">
              {certificate.verificationCode}
            </div>
          </div>

        </div>

        {/* Ethical Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-900 text-center">
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono leading-normal max-w-2xl mx-auto">
            <Lock className="w-2.5 h-2.5 inline mr-1 text-slate-400" />
            Official Certificate of Completion acknowledging practical ethical hacking and cybersecurity laboratory coursework under strict ethical non-aggression code. Not an official government accreditation.
          </p>
        </div>

      </div>
    </div>
  );
};
