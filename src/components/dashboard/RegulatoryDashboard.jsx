import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Lock, 
  Ban, 
  Eye, 
  Check, 
  Sparkles, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { 
  VIDYA_METRICS, 
  SANCTIONED_INTAKE_PROGRAMS, 
  DATA_INTEGRITY_FLAGS, 
  RECENT_STUDENT_LEDGER 
} from '../../data/vidyaVerifyData';
import KPIMetricsGrid from './KPIMetricsGrid';
import CapacityMonitor from './CapacityMonitor';
import IntegrityReviewCenter from './IntegrityReviewCenter';
import RecentLedgerFeed from './RecentLedgerFeed';

export default function RegulatoryDashboard({ 
  onNavigateTab, 
  onAddAuditLog 
}) {
  // Integrity review flags state (allows Freeze / Dismiss interactive actions)
  const [flags, setFlags] = useState(DATA_INTEGRITY_FLAGS);
  const [selectedFlagForAudit, setSelectedFlagForAudit] = useState(null);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState('ALL');
  const [programFilter, setProgramFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Action: Freeze Enrollment
  const handleFreezeEnrollment = (flag) => {
    setFlags(prev => prev.map(f => f.id === flag.id ? { ...f, status: 'FROZEN', frozen: true } : f));
    showToast(`Enrollment frozen for candidate ${flag.studentName} (APAAR: ${flag.formattedApaar}). Notice dispatched to institutions.`);
    onAddAuditLog?.({
      actor: "AICTE Regulatory Bureau",
      actorName: "Apex Regulatory Official",
      action: "ENROLLMENT_FROZEN",
      details: `Cross-institution duplicate crossover frozen for APAAR ${flag.formattedApaar} between ${flag.primaryInstitute} and ${flag.secondaryInstitute}.`,
      status: "REGULATORY_ENFORCED"
    });
  };

  // Action: Dismiss Alert
  const handleDismissAlert = (flag) => {
    setFlags(prev => prev.map(f => f.id === flag.id ? { ...f, status: 'DISMISSED', dismissed: true } : f));
    showToast(`Integrity alert ${flag.id} dismissed with formal audit sign-off.`);
    onAddAuditLog?.({
      actor: "AICTE Regulatory Bureau",
      actorName: "Apex Regulatory Official",
      action: "ALERT_DISMISSED",
      details: `Regulatory warning dismissed for APAAR ${flag.formattedApaar} following compliance review.`,
      status: "COMPLIANCE_CLEARED"
    });
  };

  // Filtered Programs
  const filteredPrograms = SANCTIONED_INTAKE_PROGRAMS.filter(prog => {
    if (programFilter === 'EXCEEDED') return prog.status === 'EXCEEDED';
    if (programFilter === 'WARNING') return prog.status === 'WARNING';
    if (programFilter === 'NORMAL') return prog.status === 'NORMAL';
    return true;
  });

  // Filtered Ledger
  const filteredLedger = RECENT_STUDENT_LEDGER.filter(item => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      item.apaarId.includes(ledgerSearch) ||
      item.institutionName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      item.programCode.toLowerCase().includes(ledgerSearch.toLowerCase());

    const matchesFilter = 
      ledgerFilter === 'ALL' ||
      (ledgerFilter === 'VERIFIED' && item.statusCode === 'VERIFIED') ||
      (ledgerFilter === 'PENDING' && item.statusCode === 'PENDING') ||
      (ledgerFilter === 'NEEDS_REVIEW' && item.statusCode === 'NEEDS_REVIEW');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-blue-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white shadow-xl border border-blue-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              National Apex Command
            </span>
            <span className="text-xs text-slate-400">Academic Cycle: 2026-27</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Centralized Regulatory & Integrity Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time surveillance of sanctioned intake capacities, cross-institutional crossover detection, and sovereign student ledger verifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab?.('INSTITUTIONS')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Institution Directory</span>
          </button>
          <button
            onClick={() => onNavigateTab?.('BATCH_IMPORT')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs rounded-xl transition border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Batch Ingestion</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. METRIC KPI CARDS (Modular Component) */}
      <KPIMetricsGrid 
        metrics={VIDYA_METRICS} 
        onFilterSelect={(f) => {
          if (f === 'INSTITUTIONS' && onNavigateTab) onNavigateTab('INSTITUTIONS');
        }} 
      />

      {/* 2. SANCTIONED INTAKE & CAPACITY MONITORING CENTER (Modular Component) */}
      <CapacityMonitor 
        programs={SANCTIONED_INTAKE_PROGRAMS} 
      />

      {/* 3. DATA INTEGRITY & REGULATORY REVIEW CENTER (Modular Component) */}
      <IntegrityReviewCenter 
        flags={flags} 
        onAuditRecord={setSelectedFlagForAudit}
        onActionComplete={({ actionType, studentName, apaarId }) => {
          if (actionType === 'FREEZE') {
            showToast(`Enrollment frozen for candidate ${studentName} (${apaarId}). Notice dispatched to institutions.`);
            onAddAuditLog?.({
              actor: "AICTE Regulatory Bureau",
              actorName: "Apex Regulatory Official",
              action: "ENROLLMENT_FROZEN",
              details: `Cross-institution duplicate crossover frozen for APAAR ${apaarId} (${studentName}) on sovereign ledger.`,
              status: "REGULATORY_ENFORCED"
            });
          } else if (actionType === 'OVERRIDE') {
            showToast(`Regulatory override authorized for ${studentName}.`);
            onAddAuditLog?.({
              actor: "AICTE Regulatory Bureau",
              actorName: "Apex Regulatory Official",
              action: "REGULATORY_OVERRIDE_APPROVED",
              details: `Administrative override authorized for APAAR ${apaarId} (${studentName}).`,
              status: "APPROVED_CLEARED"
            });
          } else if (actionType === 'AUDIT_FIELD') {
            showToast(`Field audit order generated for ${studentName}.`);
            onAddAuditLog?.({
              actor: "AICTE Inspection Bureau",
              actorName: "Apex Regulatory Official",
              action: "FIELD_AUDIT_ORDER_ISSUED",
              details: `Physical inspection order dispatched for candidate ${studentName} (${apaarId}).`,
              status: "FIELD_AUDIT_ASSIGNED"
            });
          }
        }}
      />

      {/* 4. RECENT STUDENT ENROLLMENT LEDGER FEED (Modular Component) */}
      <RecentLedgerFeed 
        records={RECENT_STUDENT_LEDGER}
        onSelectStudent={(stu) => setSelectedFlagForAudit({
          id: stu.id,
          studentName: stu.studentName,
          formattedApaar: stu.formattedApaar,
          riskScore: "Low",
          reason: `Authentic verified enrollment in ${stu.enrolledProgram} at ${stu.institutionName}.`,
          primaryInstitute: stu.institutionName,
          secondaryInstitute: "None",
          status: stu.status
        })}
      />

      {/* Audit Detail Modal (When "Audit Record" is clicked) */}
      {selectedFlagForAudit && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Regulatory Audit Dossier: {selectedFlagForAudit.id}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedFlagForAudit(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate Name:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedFlagForAudit.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">12-Digit APAAR ID:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{selectedFlagForAudit.formattedApaar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{selectedFlagForAudit.riskScore}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Audit Finding Summary:</span>
                <p className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-slate-800 dark:text-slate-200">
                  {selectedFlagForAudit.reason}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Conflicting Enrolled Programs:</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  {selectedFlagForAudit.enrolledPrograms?.map((p, idx) => (
                    <li key={idx}><strong className="text-slate-800 dark:text-slate-200">{p}</strong></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  handleFreezeEnrollment(selectedFlagForAudit);
                  setSelectedFlagForAudit(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
              >
                Execute Freeze Enrollment
              </button>
              <button
                onClick={() => setSelectedFlagForAudit(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
