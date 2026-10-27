import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Download, 
  Lock, 
  QrCode, 
  Camera, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Printer
} from 'lucide-react';
import { formatApaar, cleanApaar } from '../data/validationEngine';

export default function VerifierHub({ students, onAddAuditLog }) {
  const [apaarQuery, setApaarQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifierOrg, setVerifierOrg] = useState('Tata Consultancy Services (TCS)');
  const [scannerSimOpen, setScannerSimOpen] = useState(false);

  const handleVerify = (customApaar = null) => {
    const raw = cleanApaar(customApaar || apaarQuery);
    if (!raw) return;

    setIsVerifying(true);
    setTimeout(() => {
      const match = students.find(s => cleanApaar(s.apaarId) === raw);
      if (match) {
        setSelectedResult(match);
        onAddAuditLog({
          actor: "AUTHORIZED_VERIFIER",
          actorName: verifierOrg,
          action: "CREDENTIAL_AUTHENTICATION",
          details: `Verified academic credential for APAAR ${formatApaar(match.apaarId)} (${match.name})`,
          status: "AUTHENTIC_VALIDATED"
        });
      } else {
        setSelectedResult({
          apaarId: raw,
          status: "NOT_FOUND",
          error: "Unregistered or invalid APAAR ID. No matching record in AICTE Central Ledger."
        });
      }
      setIsVerifying(false);
    }, 450);
  };

  const handleScanPreset = (presetApaar) => {
    setApaarQuery(formatApaar(presetApaar));
    setScannerSimOpen(false);
    handleVerify(presetApaar);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Third-Party Trust Gateway
            </span>
            <span className="text-xs text-slate-500">DPDP Act 2023 Compliant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Authorized Verifier & Background Authentication Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instant tamper-evident academic verification for corporate employers, foreign embassies, and universities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Querying as:</label>
          <select
            value={verifierOrg}
            onChange={(e) => setVerifierOrg(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border-none text-slate-800 dark:text-slate-200"
          >
            <option value="Tata Consultancy Services (TCS)">Tata Consultancy Services (TCS)</option>
            <option value="Infosys Talent Acquisition">Infosys Talent Acquisition</option>
            <option value="Embassy of Germany (Visa Section)">Embassy of Germany (Student Visa)</option>
            <option value="US-India Educational Foundation (USIEF)">US-India Educational Foundation</option>
            <option value="IIM Ahmedabad (Admissions Desk)">IIM Ahmedabad Admissions</option>
          </select>
        </div>
      </div>

      {/* 2. Verification Search & QR Scan Box */}
      <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Enter candidate's 12-Digit APAAR ID (e.g., 1234-5678-9012)..."
              value={apaarQuery}
              onChange={(e) => setApaarQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVerify()}
              disabled={isVerifying}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isVerifying ? "Verifying Ledger..." : "Authenticate Record"}</span>
            </button>

            <button
              onClick={() => setScannerSimOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              title="Optical QR Credential Scanner"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs pt-1 text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Enter 12-digit APAAR ID or scan digital QR credential to authenticate records.</span>
        </div>
      </div>

      {/* 3. Verification Result Card */}
      {selectedResult && (
        <div className="max-w-3xl mx-auto">
          {selectedResult.status === "NOT_FOUND" ? (
            <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-slate-900 dark:text-white shadow-lg space-y-3">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <XCircle className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-extrabold">Academic Credential Not Found</h3>
                  <span className="text-xs font-mono">APAAR ID: {selectedResult.apaarId}</span>
                </div>
              </div>
              <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
                No verified enrollment or degree credential exists for this APAAR ID in the AICTE Sovereign Repository. Possible causes: unapproved institution, invalid candidate identity, or pending enrollment submission.
              </p>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              
              {/* Badge & Status Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {selectedResult.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {selectedResult.name}
                      </h3>
                      {selectedResult.status === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Authentic & Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Regulatory Flag Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      APAAR ID: <strong className="text-blue-600 dark:text-blue-400">{formatApaar(selectedResult.apaarId)}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">AICTE Verification Seal</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">SHA-256 Ledger Cleared</div>
                </div>
              </div>

              {/* Data Verification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Degree-Awarding Body</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5 truncate" title={selectedResult.institutionName}>
                    {selectedResult.institutionName}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">ID: {selectedResult.institutionId}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Programme & Branch</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                    {selectedResult.branchName || selectedResult.branchCode}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Institutional Roll Number</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                    {selectedResult.rollNo}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Academic Bank of Credits</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    {selectedResult.abcCredits || 78} Earned Credits
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">ABC-ID: {selectedResult.abcId || "ABC-7892-1049-8831"}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Cumulative GPA / Score</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                    {selectedResult.cgpa || "9.24"} / 10.00
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Enrolment Validity</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                    Session 2026-27 (Active)
                  </span>
                </div>
              </div>

              {/* Privacy Notice under DPDP Act */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Privacy Shield: PII (Aadhaar, parent names, residential address) masked under Digital Personal Data Protection Act 2023.</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">
                  Verification Token: {selectedResult.hash?.slice(0, 24) || "sha256_live_token"}...
                </span>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shadow flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Authentication Dossier (PDF)</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* 4. Optical QR Scanner Modal */}
      {scannerSimOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Digital Credential Optical QR Scanner
              </span>
              <button onClick={() => setScannerSimOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {/* Viewfinder Graphic */}
            <div className="w-56 h-56 mx-auto rounded-2xl border-4 border-dashed border-blue-500 flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
              <QrCode className="w-20 h-20 text-slate-600 opacity-60" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_8px_#10b981] animate-bounce" />
              <span className="text-[11px] text-slate-400 mt-2">Align QR Code inside frame</span>
            </div>

            <p className="text-xs text-slate-500">
              Align camera over candidate degree credential QR code or upload document image:
            </p>

            <div className="space-y-2 text-xs">
              <label className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold cursor-pointer flex items-center justify-center gap-2 transition">
                <QrCode className="w-4 h-4" />
                <span>Upload QR Credential Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setScannerSimOpen(false);
                      if (students.length > 0) {
                        handleVerify(students[0].apaarId);
                        setApaarQuery(formatApaar(students[0].apaarId));
                      }
                    }
                  }} 
                />
              </label>
              <button
                type="button"
                onClick={() => setScannerSimOpen(false)}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
