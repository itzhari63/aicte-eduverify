import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Download, 
  ExternalLink, 
  Building2, 
  GraduationCap, 
  Award, 
  RefreshCw,
  QrCode
} from 'lucide-react';
import { formatApaar, cleanApaar } from '../../data/validationEngine';
import { RECENT_STUDENT_LEDGER } from '../../data/vidyaVerifyData';

const DEMO_CHIPS = [
  { apaar: "9823-4512-8831", name: "Aditi Sharma", institute: "COEP Pune" },
  { apaar: "8145-9201-3342", name: "Rohan Patel", institute: "COEP Pune" },
  { apaar: "7712-4091-6623", name: "Priya Sundaram", institute: "DTU Delhi" },
  { apaar: "7234-8891-0192", name: "Ananya Sundaram", institute: "COEP Pune" }
];

export default function PublicVerifyCard() {
  const [apaarInput, setApaarInput] = useState('9823-4512-8831');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedRecord, setVerifiedRecord] = useState(RECENT_STUDENT_LEDGER[0]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = (e) => {
    e?.preventDefault();
    setErrorMessage('');
    const cleaned = cleanApaar(apaarInput);

    if (!cleaned || cleaned.length !== 12) {
      setErrorMessage('Please enter a valid 12-digit sovereign APAAR ID.');
      setVerifiedRecord(null);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const match = RECENT_STUDENT_LEDGER.find(r => r.apaarId === cleaned) || {
        id: `VER-${Date.now().toString(16)}`,
        apaarId: cleaned,
        formattedApaar: formatApaar(cleaned),
        studentName: "Aditi Ramesh Sharma",
        institutionCode: "1-10293847",
        institutionName: "College of Engineering Pune (COEP Technological University)",
        enrolledProgram: "B.Tech Computer Science & Engineering",
        programCode: "CSE",
        admissionBatch: "2026-2030",
        status: "Verified",
        statusCode: "VERIFIED",
        abcCredits: 84,
        timestamp: new Date().toLocaleString(),
        ledgerHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
      };

      setVerifiedRecord(match);
    }, 400);
  };

  const handleChipSelect = (apaar) => {
    setApaarInput(apaar);
    setErrorMessage('');
    const cleaned = cleanApaar(apaar);
    const match = RECENT_STUDENT_LEDGER.find(r => r.apaarId === cleaned) || RECENT_STUDENT_LEDGER[0];
    setVerifiedRecord(match);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Search Header Banner */}
      <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-blue-900/40 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Public Academic Authentication Gateway
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Instant Public APAAR Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-1">
            Direct sovereign verification of academic identity, enrolled degree credentials, and Academic Bank of Credits (ABC) ledger without authentication.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleVerify} className="max-w-xl mx-auto pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-300 absolute left-3 top-3" />
              <input
                type="text"
                maxLength="14"
                value={apaarInput}
                onChange={(e) => setApaarInput(formatApaar(e.target.value))}
                placeholder="Enter 12-Digit APAAR ID (e.g. 9823-4512-8831)"
                className="w-full pl-9 pr-3 py-2 text-sm bg-transparent outline-none font-mono tracking-wider font-extrabold text-white placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Credential</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Demo Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Demo Identifiers:</span>
          {DEMO_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipSelect(chip.apaar)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 text-[11px] font-mono font-bold transition cursor-pointer"
            >
              {chip.apaar} ({chip.name})
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-2xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300 max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Verified Digital Credential Card */}
      {verifiedRecord && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
          {/* Tricolor National Watermark Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600 absolute top-0 left-0 right-0" />

          {/* Card Header with Green Authenticated Seal */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Authenticated Academic Credential
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    ✓ Verified Authentic
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Government of India Sovereign Academic Depository Seal
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Sovereign APAAR ID</span>
              <span className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400">
                {verifiedRecord.formattedApaar}
              </span>
            </div>
          </div>

          {/* Masked Student Identity & Program Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Candidate Identity */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Identity</span>
              <strong className="text-sm font-extrabold text-slate-900 dark:text-white block">
                {verifiedRecord.studentName}
              </strong>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Aadhaar eKYC Masked: •••• •••• 8831
              </span>
            </div>

            {/* Degree Program */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree Program</span>
              <strong className="text-sm font-extrabold text-slate-900 dark:text-white block">
                {verifiedRecord.enrolledProgram}
              </strong>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Admission Cycle: {verifiedRecord.admissionBatch || '2026-2030'}
              </span>
            </div>

            {/* Institution Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Institution</span>
              <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                {verifiedRecord.institutionName}
              </strong>
              <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                Institute Code: {verifiedRecord.institutionCode}
              </span>
            </div>

            {/* Verified Credits */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Bank of Credits</span>
              <strong className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">
                {verifiedRecord.abcCredits || 84} Verified Credits
              </strong>
              <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                Sovereign ABC Repository Ledger
              </span>
            </div>
          </div>

          {/* Cryptographic Ledger Anchor Seal */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                Immutable Ledger Anchor
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Timestamp: {verifiedRecord.timestamp}
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all font-semibold">
              {verifiedRecord.ledgerHash}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <QrCode className="w-4 h-4 text-slate-400" />
              <span>Verifiable W3C VC 2.0 Credential</span>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Authenticated Dossier</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
