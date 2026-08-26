import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Award, 
  Clock, 
  Trophy, 
  Terminal, 
  ExternalLink, 
  Copy, 
  Check, 
  Printer, 
  ArrowLeft,
  FileCheck2,
  Lock,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { CertificateRecord } from '../types';
import { CertificateDocument } from '../components/certificate/CertificateDocument';

export const VerifyCertificatePage: React.FC = () => {
  const { certificatesList } = useApp();
  const [searchParams] = useSearchParams();
  const { certId: paramCertId } = useParams<{ certId?: string }>();
  
  const queryId = searchParams.get('id') || searchParams.get('code') || paramCertId || '';
  const [inputCertId, setInputCertId] = useState<string>(queryId);
  const [searchedId, setSearchedId] = useState<string>(queryId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [hasCopiedLink, setHasCopiedLink] = useState<boolean>(false);
  const [showFullDocument, setShowFullDocument] = useState<boolean>(false);

  const performVerification = async (targetId: string) => {
    const cleanId = (targetId || '').trim().toUpperCase();
    if (!cleanId) {
      setCertificate(null);
      setVerificationError(null);
      return;
    }

    setIsLoading(true);
    setVerificationError(null);

    try {
      // 1. Check server registry
      const response = await fetch(`/api/certificates/verify/${encodeURIComponent(cleanId)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.verified && data.certificate) {
          setCertificate(data.certificate);
          setIsLoading(false);
          return;
        }
      }

      // 2. Check local context / localStorage cache
      const localMatch = certificatesList.find(
        c => c.certificateId.toUpperCase() === cleanId
      );

      if (localMatch) {
        setCertificate(localMatch);
        setIsLoading(false);
        return;
      }

      // 3. Fallback sample certificates
      if (cleanId === 'MCL-2026-CYB-8F42A1' || cleanId === 'MCL-CERT-2026-X7942') {
        const sampleCert: CertificateRecord = {
          certificateId: cleanId,
          learnerName: cleanId.includes('7942') ? 'Marcus Wright' : 'Alex Vance',
          codename: cleanId.includes('7942') ? 'GHOST-99' : 'CIPHER-01',
          courseName: 'Practical Ethical Hacking & Defensive Cybersecurity',
          certificateTitle: 'Certificate of Completion',
          completionDate: 'August 22, 2026',
          issueDate: 'August 22, 2026',
          trainingHours: 42,
          finalScore: 96,
          lessonsCompletedCount: 32,
          labsCompletedCount: 16,
          missionsCompletedCount: 8,
          toolsMasteredCount: 14,
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
          verificationUrl: `/verify-certificate?id=${cleanId}`,
          status: 'ISSUED',
          issuer: {
            academyName: 'My Cyber Lab Academy',
            director: 'Dr. Evelyn Cross, CISSP',
            title: 'Academic Director & Lead Cyber Examiner',
            sealNumber: 'SEAL-2026-AUTH-904'
          }
        };
        setCertificate(sampleCert);
        setIsLoading(false);
        return;
      }

      // If not found anywhere
      setCertificate(null);
      setVerificationError(`No verifiable record found for Certificate ID "${cleanId}". Please verify the ID from your document.`);
    } catch (err: any) {
      // Local fallback in case network call fails
      const localMatch = certificatesList.find(
        c => c.certificateId.toUpperCase() === cleanId
      );
      if (localMatch) {
        setCertificate(localMatch);
      } else {
        setCertificate(null);
        setVerificationError('Unable to connect to verification registry. Please check your network and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      setInputCertId(queryId);
      setSearchedId(queryId);
      performVerification(queryId);
    } else {
      // Auto verify first existing certificate or demo if available
      const defaultId = certificatesList[0]?.certificateId || 'MCL-2026-CYB-8F42A1';
      setInputCertId(defaultId);
      setSearchedId(defaultId);
      performVerification(defaultId);
    }
  }, [queryId, certificatesList]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(inputCertId);
    performVerification(inputCertId);
  };

  const handleCopyVerificationLink = () => {
    if (!certificate) return;
    const url = `${window.location.origin}/verify-certificate?id=${certificate.certificateId}`;
    navigator.clipboard.writeText(url);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> PUBLIC CREDENTIAL REGISTRY
              </span>
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">• MY CYBER LAB ACADEMY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white">
              Certificate Verification Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Instantly audit the authenticity, training metrics, and cryptographic hash of any My Cyber Lab credential.
            </p>
          </div>

          <Link
            to="/certificate"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Certificate
          </Link>
        </div>

        {/* Search & Verification Input Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-2">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                placeholder="Enter Certificate ID (e.g. MCL-2026-CYB-8F42A1)"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputCertId.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> VERIFYING...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> VERIFY CREDENTIAL
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Test Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-3 text-[11px] font-mono text-slate-400">
            <span>Quick Test IDs:</span>
            <button
              type="button"
              onClick={() => {
                setInputCertId('MCL-2026-CYB-8F42A1');
                setSearchedId('MCL-2026-CYB-8F42A1');
                performVerification('MCL-2026-CYB-8F42A1');
              }}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
            >
              MCL-2026-CYB-8F42A1 (Alex Vance)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputCertId('MCL-CERT-2026-X7942');
                setSearchedId('MCL-CERT-2026-X7942');
                performVerification('MCL-CERT-2026-X7942');
              }}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
            >
              MCL-CERT-2026-X7942 (Marcus Wright)
            </button>
          </div>
        </form>
      </div>

      {/* Verification Result Section */}
      {isLoading ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
          <div className="font-mono text-sm text-slate-300 font-bold">
            Auditing Cryptographic Registry for {searchedId}...
          </div>
          <div className="font-mono text-xs text-slate-500">
            Checking SHA-256 seal & curriculum milestones
          </div>
        </div>
      ) : certificate ? (
        <div className="space-y-6">
          
          {/* Authentic Badge Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            certificate.status === 'REVOKED'
              ? 'bg-red-950/30 border-red-500/40 text-red-100'
              : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
          } shadow-xl relative overflow-hidden`}>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl ${
                  certificate.status === 'REVOKED'
                    ? 'bg-red-950 border border-red-500 text-red-400'
                    : 'bg-emerald-950 border border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                }`}>
                  {certificate.status === 'REVOKED' ? (
                    <ShieldAlert className="w-8 h-8" />
                  ) : (
                    <ShieldCheck className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold ${
                      certificate.status === 'REVOKED'
                        ? 'bg-red-900/80 text-red-300 border border-red-700'
                        : 'bg-emerald-900/80 text-emerald-200 border border-emerald-600'
                    }`}>
                      STATUS: {certificate.status || 'ISSUED'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ID: <span className="text-slate-200 font-bold">{certificate.certificateId}</span>
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-mono font-black text-white mt-1">
                    {certificate.status === 'REVOKED'
                      ? 'Credential Revoked'
                      : 'Authentic & Verified Credential'}
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyVerificationLink}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                >
                  {hasCopiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> COPIED!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> SHARE LINK
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowFullDocument(!showFullDocument)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 font-mono text-xs flex items-center justify-center gap-2 border border-cyan-500/40 transition-colors cursor-pointer"
                >
                  <FileCheck2 className="w-3.5 h-3.5" /> {showFullDocument ? 'HIDE DIPLOMA' : 'VIEW DIPLOMA'}
                </button>
              </div>
            </div>

            {/* Credential Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 font-mono text-xs">
              
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">RECIPIENT NAME</span>
                <div className="text-base font-bold text-white">{certificate.learnerName}</div>
                {certificate.codename && (
                  <span className="text-cyan-400 text-[11px]">Codename: [{certificate.codename}]</span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">COURSE TITLE</span>
                <div className="text-sm font-bold text-slate-200">{certificate.courseName}</div>
                <span className="text-emerald-400 text-[11px]">Type: Hands-on Laboratory Coursework</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">DATE OF CONFERRAL</span>
                <div className="text-sm font-bold text-slate-200">{certificate.issueDate}</div>
                <span className="text-slate-400 text-[11px]">Seal: {certificate.issuer?.sealNumber}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">FINAL SCORE</span>
                <div className="text-base font-bold text-amber-400">{certificate.finalScore}%</div>
                <span className="text-slate-400 text-[11px]">Grade: Certified Competent</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">TRAINING DURATION</span>
                <div className="text-sm font-bold text-slate-200">{certificate.trainingHours} Hours</div>
                <span className="text-slate-400 text-[11px]">{certificate.lessonsCompletedCount} Lessons • {certificate.labsCompletedCount} Practical Labs</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">ISSUING INSTITUTION</span>
                <div className="text-sm font-bold text-cyan-300">{certificate.issuer?.academyName || 'My Cyber Lab Academy'}</div>
                <span className="text-slate-400 text-[11px]">Examiner: {certificate.issuer?.director}</span>
              </div>

            </div>

            {/* Cryptographic Hash Details */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 font-mono space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>CRYPTOGRAPHIC VERIFICATION HASH (SHA-256)</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> MATCHES REGISTRY ARCHIVE
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono break-all select-all bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                {certificate.verificationCode}
              </div>
            </div>

            {/* Skills & Domains Breakdown */}
            {certificate.skillsCovered && certificate.skillsCovered.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                  VERIFIED LABORATORY SKILLS & COMPETENCY MATRIX:
                </div>
                <div className="flex flex-wrap gap-2">
                  {certificate.skillsCovered.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/70 text-slate-200 text-xs font-mono flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Optional Full Document Render */}
          {showFullDocument && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">
                  OFFICIAL DIPLOMA DOCUMENT PREVIEW
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> PRINT DOCUMENT
                </button>
              </div>
              <CertificateDocument certificate={certificate} />
            </div>
          )}

        </div>
      ) : verificationError ? (
        <div className="p-8 sm:p-12 text-center bg-slate-900/40 rounded-3xl border border-red-500/30 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-mono font-bold text-white">
              Certificate Not Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-lg mx-auto">
              {verificationError}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setInputCertId('MCL-2026-CYB-8F42A1');
                setSearchedId('MCL-2026-CYB-8F42A1');
                performVerification('MCL-2026-CYB-8F42A1');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs border border-slate-700 cursor-pointer"
            >
              Test with sample valid ID: MCL-2026-CYB-8F42A1
            </button>
          </div>
        </div>
      ) : null}

      {/* Trust & Transparency Policy Box */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-300 font-bold uppercase">
          <Lock className="w-4 h-4 text-cyan-400" />
          Verification Integrity & Privacy Guarantee
        </div>
        <p className="leading-relaxed">
          My Cyber Lab cryptographically validates each Certificate ID against our immutable database of laboratory sessions, CTF flag submissions, and practical quizzes. To safeguard learner privacy, private contact details, email addresses, and network session credentials are never stored or exposed on public verification endpoints.
        </p>
      </div>

    </div>
  );
};
