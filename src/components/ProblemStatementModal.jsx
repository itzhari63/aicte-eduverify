import React from 'react';
import { X, Award, ShieldCheck, CheckCircle2, Building2, FileText, Cpu, AlertTriangle } from 'lucide-react';

export default function ProblemStatementModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">
                  Ministry of Education • AICTE
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded-full">
                  Regulatory Mandate #26263
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                APAAR ID-Based Student Data Management & Verification System Architecture
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-sm">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Organization</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">AICTE</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Department</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">Regulation Bureau</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Theme</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">Smart Automation</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Category</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">Software</span>
          </div>
        </div>

        {/* Core Challenge */}
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 bg-blue-50/80 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50">
            <h3 className="font-bold text-blue-950 dark:text-blue-300 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              The Core Regulatory Problem
            </h3>
            <p>
              AICTE currently receives student information through fragmented channels. Non-PGDM institutions historically provided only macro statistical summaries (such as total enrolment headcounts) during the annual approval cycle. This created critical blindspots: <strong>unauthorized excess admissions beyond approved ceilings</strong>, <strong>ghost/duplicate student enrolments across colleges</strong>, and <strong>lack of verifiable digital academic identities</strong>.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-500" />
              AICTE-EduVerify Architectural Solution Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "APAAR ID as Primary Key", desc: "12-digit national identifier (One Nation One Student ID) uniquely anchoring student data across India." },
                { title: "Approved vs Actual Enrolment Guard", desc: "Real-time intake capping enforcing Approved Intake + Supernumerary capacity (EWS, PMSSS, TFW, NRI, FN, OCI)." },
                { title: "Cross-Institutional Duplicate Sentinel", desc: "Automated anomaly engine that instantly flags students enrolled simultaneously in two institutions." },
                { title: "W3C Verifiable Credentials & QR Codes", desc: "Degree/bonafide certificates displaying APAAR ID side-by-side with institutional roll number and cryptographic QR code." },
                { title: "Public & Employer Verification Gateway", desc: "Zero-knowledge verification portal authenticating degrees without leaking sensitive Aadhaar or personal data." },
                { title: "DPDP Act 2023 Consent Management", desc: "Student-controlled consent ledger tracking who queries academic records." }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70">
                  <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">National Regulatory Workflow Standard:</h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-400">
              Institution → Student Data Upload → Automated APAAR Validation → AICTE Central Repository → Real-time Analytics & Anomaly Detection → Authorized Public Verification.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition shadow-md"
          >
            Access Portal Services
          </button>
        </div>

      </div>
    </div>
  );
}
