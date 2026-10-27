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

      {/* 1. METRIC KPI CARDS (Exact Vidya-Verify Numbers: 173 / 63 / 1 / 5 / 3) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Total Institutions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Institutions</span>
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {VIDYA_METRICS.totalInstitutions}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <span>● 100% AISHE Mapped</span>
          </div>
        </div>

        {/* KPI 2: Records Verified */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Records Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {VIDYA_METRICS.recordsVerified}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Cryptographically Anchored
          </div>
        </div>

        {/* KPI 3: Pending Verification */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Verification</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {VIDYA_METRICS.pendingVerification}
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            In Verification Queue
          </div>
        </div>

        {/* KPI 4: Cross-Institution Duplicate Crossover Alerts */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-red-200/80 dark:border-red-900/60 shadow-sm hover:shadow-md transition bg-red-50/20 dark:bg-red-950/20">
          <div className="flex items-center justify-between text-red-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Duplicate Crossovers</span>
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400">
            {VIDYA_METRICS.requiresAttention}
          </div>
          <div className="text-[10px] text-red-600 dark:text-red-400 font-semibold mt-1">
            Cross-Institution Alerts
          </div>
        </div>

        {/* KPI 5: Quota Alerts */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 shadow-sm hover:shadow-md transition bg-amber-50/20 dark:bg-amber-950/20 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Quota Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {VIDYA_METRICS.sanctionedQuotaAlerts}
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Sanctioned Quota Alerts
          </div>
        </div>

      </section>

      {/* 2. SANCTIONED INTAKE & CAPACITY MONITORING CENTER */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Sanctioned Intake & Capacity Monitoring Center
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
                {SANCTIONED_INTAKE_PROGRAMS.filter(p => p.status === 'EXCEEDED').length} Active Overfill Warnings
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated surveillance monitoring program-level Approved Intake vs. Actual Allotted Admissions.
            </p>
          </div>

          {/* Program Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            {['ALL', 'EXCEEDED', 'WARNING', 'NORMAL'].map(status => (
              <button
                key={status}
                onClick={() => setProgramFilter(status)}
                className={`px-3 py-1 rounded-lg transition ${
                  programFilter === status 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Table & Visual Capacity Utilization Gauge */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredPrograms.map((prog) => {
            const isExceeded = prog.utilization > 100;
            const isWarning = prog.utilization >= 90 && prog.utilization <= 100;

            return (
              <div key={prog.id} className="py-4 space-y-2">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {prog.programCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {prog.programName}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isExceeded 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300 border border-red-300 dark:border-red-800' 
                          : isWarning 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' 
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                      }`}>
                        {prog.utilization}% Capacity
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{prog.instituteName}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">AISHE: {prog.aisheCode}</span>
                    </div>
                  </div>

                  {/* Seat Counts */}
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Allotted: <strong className={isExceeded ? 'text-red-600 dark:text-red-400 text-sm' : ''}>{prog.actualAllotted}</strong> / Approved: {prog.approvedIntake}
                    </div>
                    {isExceeded && (
                      <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                        +{prog.excessCount} Seats Unauthorized Overfill
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Capacity Utilization Gauge */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded 
                          ? 'bg-red-500' 
                          : isWarning 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(prog.utilization, 100)}%` }}
                    />
                  </div>
                  {/* Warning banner if exceeded */}
                  {isExceeded && (
                    <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2 text-xs text-red-700 dark:text-red-300 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{prog.alertMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. DATA INTEGRITY & REGULATORY REVIEW CENTER */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Data Integrity & Regulatory Review Center
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
                {flags.filter(f => f.status === 'REQUIRES_ATTENTION').length} Active Flags
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated detection flags with risk tagging, cross-institution duplicate crossovers, and quick action audit controls.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-semibold">
            Real-Time Integrity Stream
          </div>
        </div>

        {/* Flag Cards */}
        <div className="space-y-3">
          {flags.map((flag) => {
            const isCritical = flag.riskLevel === 'CRITICAL';
            const isHigh = flag.riskLevel === 'HIGH';
            const isResolved = flag.status === 'FROZEN' || flag.status === 'DISMISSED';

            return (
              <div 
                key={flag.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  isResolved 
                    ? 'opacity-60 bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800' 
                    : isCritical 
                    ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60' 
                    : isHigh 
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60' 
                    : 'bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isCritical 
                          ? 'bg-red-600 text-white' 
                          : isHigh 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        Risk Score: {flag.riskScore}
                      </span>

                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        APAAR: {flag.formattedApaar}
                      </span>

                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        ({flag.studentName})
                      </span>

                      {flag.status === 'FROZEN' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                          ● ENROLLMENT FROZEN
                        </span>
                      )}
                      {flag.status === 'DISMISSED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                          ✓ DISMISSED / CLEARED
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {flag.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span>Primary: <strong className="text-slate-700 dark:text-slate-300">{flag.primaryInstitute}</strong></span>
                      {flag.secondaryInstitute !== 'None' && (
                        <>
                          <span>↔</span>
                          <span>Secondary: <strong className="text-slate-700 dark:text-slate-300">{flag.secondaryInstitute}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Audit Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedFlagForAudit(flag)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>Audit Record</span>
                    </button>

                    {!isResolved && (
                      <>
                        <button
                          onClick={() => handleFreezeEnrollment(flag)}
                          className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                          title="Freeze candidate registration across institutions"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Freeze Enrollment</span>
                        </button>

                        <button
                          onClick={() => handleDismissAlert(flag)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                          title="Dismiss after verifying authentic waiver"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Dismiss Alert</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. RECENT STUDENT LEDGER FEED */}
      <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Recent Student Ledger Feed
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                Live SHA-256 Anchored
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chronological ledger of recent APAAR student admissions timestamped and immutably sealed.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search APAAR, name, institute..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={ledgerFilter}
              onChange={(e) => setLedgerFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">APAAR ID</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Institution & Program</th>
                <th className="py-2.5 px-3">ABC Credits</th>
                <th className="py-2.5 px-3">Verification Status</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Ledger Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredLedger.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {row.formattedApaar}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {row.studentName}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{row.enrolledProgram}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{row.institutionName}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-[11px]">
                      {row.abcCredits} Credits
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.statusCode === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : row.statusCode === 'NEEDS_REVIEW'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                    {row.timestamp}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400 whitespace-nowrap truncate max-w-[120px]" title={row.ledgerHash}>
                    {row.ledgerHash.substring(0, 14)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
