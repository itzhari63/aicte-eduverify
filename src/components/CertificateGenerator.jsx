import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  FileCheck, 
  Printer, 
  Download, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  QrCode, 
  Lock,
  ChevronDown
} from 'lucide-react';
import { formatApaar, generateMockHash } from '../data/validationEngine';

export default function CertificateGenerator({ students, selectedStudent: initialSelected }) {
  const [selectedStudentId, setSelectedStudentId] = useState(
    initialSelected?.id || (students.length > 0 ? students[0].id : '')
  );
  const [certificateType, setCertificateType] = useState('DEGREE'); // 'DEGREE', 'BONAFIDE', 'PROVISIONAL'
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const certificateRef = useRef(null);

  const currentStudent = students.find(s => s.id === selectedStudentId) || (students.length > 0 ? students[0] : null);

  useEffect(() => {
    if (initialSelected?.id) {
      setSelectedStudentId(initialSelected.id);
    }
  }, [initialSelected]);

  useEffect(() => {
    if (currentStudent) {
      const verifiablePayload = JSON.stringify({
        context: "https://www.w3.org/2018/credentials/v1",
        type: ["VerifiableCredential", "AICTEDegreeCertificate"],
        issuer: `did:aicte:in:${(currentStudent.institutionId || 'inst').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          apaarId: currentStudent.apaarId,
          institutionalRollNo: currentStudent.rollNo,
          studentName: currentStudent.name,
          institution: currentStudent.institutionName,
          programme: currentStudent.branchName || currentStudent.branchCode,
          degreeTitle: "Bachelor of Technology (B.Tech)",
          cgpa: currentStudent.cgpa || "9.24",
          status: "AUTHENTIC_VERIFIED"
        },
        proof: {
          type: "Ed25519Signature2020",
          created: "2026-08-14T10:30:00Z",
          verificationMethod: "did:aicte:in:ledger#keys-1",
          proofValue: currentStudent.hash || generateMockHash(currentStudent)
        }
      });

      QRCode.toDataURL(verifiablePayload, {
        width: 160,
        margin: 1,
        color: {
          dark: '#0A2540',
          light: '#FFFFFF'
        }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
    }
  }, [currentStudent, certificateType]);

  const handlePrint = () => {
    window.print();
  };

  if (!currentStudent || students.length === 0) {
    return (
      <div className="space-y-6 pb-16">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                National Credential Standard
              </span>
              <span className="text-xs text-slate-500">AICTE Approval Process Handbook Clause 10</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Verifiable Academic Credential & Certificate Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Displaying <strong>APAAR ID side-by-side with Institutional Student ID</strong> on degree certificates with cryptographic QR code.
            </p>
          </div>
        </div>

        <div className="max-w-xl mx-auto p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Student Admissions Ingested Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            To generate and print official verifiable degree certificates containing cryptographic SHA-256 seals and APAAR identifiers, first ingest student admission batches via the Institution Ingestion Studio.
          </p>
        </div>
      </div>
    );
  }

  const certificateHash = currentStudent.hash || generateMockHash(currentStudent);

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header & Configuration Controls */}
      <div className="no-print p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              National Credential Standard
            </span>
            <span className="text-xs text-slate-500">AICTE Approval Process Handbook Clause 10</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Verifiable Academic Credential & Certificate Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Displaying <strong>APAAR ID side-by-side with Institutional Student ID</strong> on degree certificates with cryptographic QR code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Student Selector */}
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.branchCode}) - APAAR: {formatApaar(s.apaarId)}
              </option>
            ))}
          </select>

          {/* Certificate Type */}
          <select
            value={certificateType}
            onChange={(e) => setCertificateType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="DEGREE">Official Degree Certificate</option>
            <option value="BONAFIDE">Bonafide Student Certificate</option>
            <option value="PROVISIONAL">Provisional Degree Certificate</option>
          </select>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Verifiable Certificate Container */}
      <div className="max-w-4xl mx-auto">
        <div 
          ref={certificateRef}
          className="certificate-container relative bg-white text-slate-900 p-8 sm:p-12 md:p-16 rounded-2xl shadow-2xl border-8 border-double border-amber-600/60 overflow-hidden font-serif"
          style={{ minHeight: '680px' }}
        >
          {/* Ornamental corner embellishments */}
          <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-600 pointer-events-none" />
          <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-600 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-600 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-600 pointer-events-none" />

          {/* Subtle Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96 text-slate-900" />
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 relative z-10 pb-6 border-b border-amber-600/30">
            {/* Government & AICTE Insignia */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold text-xs">
                AICTE
              </div>
              <div className="text-center">
                <div className="text-[10px] tracking-widest uppercase font-sans font-bold text-slate-600">
                  भारत सरकार | GOVERNMENT OF INDIA
                </div>
                <div className="text-xs font-bold font-sans text-slate-800">
                  ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs">
                {currentStudent.institutionName ? currentStudent.institutionName.substring(0, 4).toUpperCase() : "INST"}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase text-slate-950 font-serif">
              {currentStudent.institutionName || "AICTE Approved Technical Institution"}
            </h1>
            <p className="text-xs font-sans text-slate-600">
              (Recognized Autonomous Institution • Approved by All India Council for Technical Education)
            </p>

            <div className="pt-4">
              <span className="px-6 py-1 border-b-2 border-amber-600 text-lg sm:text-xl font-bold uppercase tracking-widest text-amber-900 inline-block">
                {certificateType === 'DEGREE' 
                  ? 'Degree of Bachelor of Technology'
                  : certificateType === 'BONAFIDE'
                  ? 'Bonafide Student Certificate'
                  : 'Provisional Degree Certificate'
                }
              </span>
            </div>
          </div>

          {/* Crucial Dual Identifier Highlight Box (AICTE Requirement 10) */}
          <div className="my-6 p-4 rounded-xl bg-amber-50/80 border-2 border-amber-500/40 font-sans">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
              
              {/* National APAAR ID */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>National Academic Identifier (APAAR ID)</span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-950 tracking-wider">
                  {formatApaar(currentStudent.apaarId)}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Automated Permanent Academic Account Registry • MoE
                </div>
              </div>

              <div className="hidden sm:block h-10 w-px bg-amber-400" />

              {/* Institutional Student Roll No */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Institutional Register / Roll No.</span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-950 tracking-wider">
                  {currentStudent.rollNo}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Degree-Awarding Body Official Record
                </div>
              </div>

            </div>
          </div>

          {/* Certificate Body Text */}
          <div className="py-4 text-center space-y-4 font-serif text-slate-800 text-sm sm:text-base leading-relaxed relative z-10">
            <p className="italic">This is to certify that</p>
            
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif tracking-wide underline decoration-amber-500/50 underline-offset-8">
              {currentStudent.name}
            </div>

            <p className="max-w-2xl mx-auto text-xs sm:text-sm font-sans text-slate-700 leading-normal">
              having satisfied all academic requirements in the Academic Session <strong>2026-27</strong> with a Cumulative Grade Point Average of <strong>{currentStudent.cgpa || "9.24"}</strong>, is hereby admitted to the degree of
            </p>

            <div className="text-lg sm:text-xl font-bold uppercase tracking-wide text-blue-950 font-serif">
              Bachelor of Technology in {currentStudent.branchName || currentStudent.branchCode}
            </div>

            <p className="text-xs font-sans text-slate-500 max-w-xl mx-auto">
              Admission Category: {currentStudent.admissionCategory} {currentStudent.quotaCategory ? `(${currentStudent.quotaCategory})` : ""} • Academic Bank of Credits: {currentStudent.abcCredits || 78} Credits
            </p>
          </div>

          {/* Certificate Footer with Dynamic Cryptographic QR Code & Hologram Seal */}
          <div className="pt-8 mt-6 border-t border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 font-sans">
            
            {/* Left: Cryptographic QR Code */}
            <div className="flex items-center gap-3">
              {qrCodeUrl && (
                <div className="p-1 bg-white border-2 border-slate-900 rounded-lg shadow-sm">
                  <img src={qrCodeUrl} alt="Verifiable Credential QR" className="w-20 h-20" />
                </div>
              )}
              <div className="text-left space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  Scan to Verify Authenticity
                </div>
                <p className="text-[10px] text-slate-500 max-w-[180px]">
                  Tamper-evident W3C Credential signed on AICTE Central Ledger.
                </p>
                <div className="font-mono text-[9px] text-slate-400 truncate max-w-[180px]">
                  Hash: {certificateHash.slice(0, 20)}...
                </div>
              </div>
            </div>

            {/* Center: Hologram Seal */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full hologram-seal flex items-center justify-center shadow-lg border-2 border-amber-400 p-1">
                <div className="w-full h-full rounded-full bg-white/90 flex flex-col items-center justify-center text-center p-1">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span className="text-[7px] font-extrabold uppercase text-slate-900 leading-tight">AICTE SEAL</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-amber-800 uppercase tracking-widest mt-1">Official Hologram</span>
            </div>

            {/* Right: Signatories */}
            <div className="flex items-center gap-8 text-center text-xs">
              <div>
                <div className="font-script text-lg text-slate-800 font-bold mb-1">
                  Sudhir D.
                </div>
                <div className="w-24 h-px bg-slate-400 mx-auto mb-1" />
                <span className="font-bold text-[11px] block text-slate-900">Dean (Academics)</span>
                <span className="text-[9px] text-slate-500">{currentStudent.institutionName || "Degree Awarding Institution"}</span>
              </div>

              <div>
                <div className="font-script text-lg text-slate-800 font-bold mb-1">
                  B. N. Bhandari
                </div>
                <div className="w-24 h-px bg-slate-400 mx-auto mb-1" />
                <span className="font-bold text-[11px] block text-slate-900">Vice Chancellor</span>
                <span className="text-[9px] text-slate-500">Degree-Awarding Body</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
