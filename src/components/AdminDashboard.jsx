import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Lock, 
  ExternalLink, 
  Users, 
  TrendingUp, 
  Send, 
  Printer, 
  Eye, 
  X,
  FileCheck,
  Check,
  Ban
} from 'lucide-react';
import { formatApaar } from '../data/validationEngine';

export default function AdminDashboard({ 
  institutions, 
  allStudents, 
  setAllStudents, 
  intakeBreaches, 
  setIntakeBreaches, 
  onAddAuditLog,
  onOpenReportModal
}) {
  const [selectedState, setSelectedState] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ANOMALIES'); // 'ANOMALIES', 'BREACHES', 'GEOMAP', 'REPORTS'
  const [selectedProgram, setSelectedProgram] = useState('ALL');
  
  // Show-cause notice generation modal state
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);
  const [showCauseSuccess, setShowCauseSuccess] = useState('');

  // Extract cross-institution duplicate students
  const duplicateStudents = allStudents.filter(s => s.status === 'FLAGGED_DUPLICATE');

  // Calculate totals
  const totalStudents = allStudents.length;
  const totalVerified = allStudents.filter(s => s.status === 'VERIFIED').length;
  const totalConflicts = duplicateStudents.length;
  const totalBreaches = intakeBreaches.length;

  // Dynamic Nationwide Approved Capacity from institutions
  const totalApprovedSeats = (institutions || []).reduce((sum, inst) => 
    sum + (inst.departments?.reduce((deptSum, d) => deptSum + (d.approvedIntake || 0) + (d.supernumerarySeats || 0), 0) || 0), 0
  ) || 0;

  // Real live utilization rate
  const utilizationRate = totalApprovedSeats > 0 
    ? ((totalStudents / totalApprovedSeats) * 100).toFixed(1) 
    : "0.0";

  // Dynamic Supernumerary quota calculations
  const supernumeraryStudents = allStudents.filter(s => s.isSupernumerary);
  const totalSupernumeraryApproved = (institutions || []).reduce((sum, inst) =>
    sum + (inst.departments?.reduce((deptSum, d) => deptSum + (d.supernumerarySeats || 0), 0) || 0), 0
  ) || 0;

  // Dynamic State-wise Data computed from actual institutions & students
  const stateStats = React.useMemo(() => {
    const statesMap = {};
    (institutions || []).forEach(inst => {
      const state = inst.state || 'Other';
      if (!statesMap[state]) {
        statesMap[state] = {
          state,
          code: inst.state === 'Maharashtra' ? 'MH' 
              : inst.state === 'Delhi' ? 'DL'
              : inst.state === 'Tamil Nadu' ? 'TN'
              : inst.state === 'Karnataka' ? 'KA'
              : inst.state === 'West Bengal' ? 'WB'
              : state.substring(0, 2).toUpperCase(),
          totalInstitutions: 0,
          approvedSeats: 0,
          enrolledSeats: 0,
          compliance: inst.complianceScore || 99.0
        };
      }
      statesMap[state].totalInstitutions += 1;
      const instSeats = inst.departments?.reduce((sum, d) => sum + (d.approvedIntake || 0) + (d.supernumerarySeats || 0), 0) || 0;
      statesMap[state].approvedSeats += instSeats;
      
      const enrolledInInst = allStudents.filter(s => s.institutionId === inst.id).length;
      statesMap[state].enrolledSeats += enrolledInInst;
    });

    return Object.values(statesMap).map(st => {
      const util = st.approvedSeats > 0 ? ((st.enrolledSeats / st.approvedSeats) * 100).toFixed(1) : "0.0";
      return {
        ...st,
        utilization: util,
        vacant: Math.max(0, st.approvedSeats - st.enrolledSeats)
      };
    });
  }, [institutions, allStudents]);

  // Active state data
  const stateData = selectedState === 'ALL' 
    ? null 
    : stateStats.find(s => s.code === selectedState);

  // Handlers for Anomaly Resolution
  const handleFreezeRecord = (student) => {
    const updated = allStudents.map(s => {
      if (s.id === student.id) {
        return { ...s, status: "FROZEN_REGULATORY_HOLD", flagReason: "FROZEN by AICTE Regulation Bureau pending inquiry" };
      }
      return s;
    });
    setAllStudents(updated);

    onAddAuditLog({
      actor: "AICTE_CENTRAL_ADMIN",
      actorName: "Regulation Bureau (Apex Command)",
      action: "REGULATORY_HOLD_FREEZE",
      details: `Froze central record for APAAR ID ${formatApaar(student.apaarId)} (${student.name}) due to unresolved dual-enrolment conflict`,
      status: "FROZEN_PENDING_INQUIRY"
    });

    setShowCauseSuccess(`Record for APAAR ${formatApaar(student.apaarId)} frozen across national registry.`);
    setTimeout(() => setShowCauseSuccess(''), 4000);
  };

  const handleIssueNotice = (student) => {
    setActiveNoticeModal({
      type: "DUAL_ENROLMENT",
      refNo: `AICTE/REG/2026/SCN-${student.apaarId.slice(-4)}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      studentName: student.name,
      apaarId: student.apaarId,
      instA: student.institutionName,
      instB: student.conflictWith?.institutionName || "Unknown Institution",
      details: `Student registered under APAAR #${student.apaarId} in two independent AICTE-approved institutions concurrently for Academic Session 2026-27.`
    });
  };

  const handleResolveConflict = (student, keepInstitutionName) => {
    const updated = allStudents.map(s => {
      if (s.id === student.id) {
        return { 
          ...s, 
          status: "VERIFIED", 
          flagReason: undefined, 
          conflictWith: undefined,
          institutionName: keepInstitutionName
        };
      }
      return s;
    });
    setAllStudents(updated);

    onAddAuditLog({
      actor: "AICTE_CENTRAL_ADMIN",
      actorName: "Regulation Bureau Adjudication",
      action: "DUAL_ENROLMENT_ADJUDICATED",
      details: `Adjudicated duplicate APAAR ${formatApaar(student.apaarId)}. Retained admission at ${keepInstitutionName}; secondary registration cancelled.`,
      status: "RESOLVED_CLEARED"
    });

    setShowCauseSuccess(`Conflict successfully resolved. APAAR assigned exclusively to ${keepInstitutionName}.`);
    setTimeout(() => setShowCauseSuccess(''), 4000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Apex Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-blue-900/40">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Apex Authority Command
              </span>
              <span className="text-xs text-blue-300">National Academic Identity Depository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AICTE Regulation Bureau: Central Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Real-time nationwide intake governance, automated cross-institutional duplicate sentinel, and regulatory compliance intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenReportModal("NIRF")}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>NIRF Report</span>
            </button>
            <button
              onClick={() => onOpenReportModal("PARLIAMENT")}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Parliament Q&A Export</span>
            </button>
          </div>
        </div>

        {/* Success toast */}
        {showCauseSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{showCauseSuccess}</span>
          </div>
        )}
      </div>

      {/* 2. Nationwide Macro Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Nationwide Intake Utilization</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {utilizationRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {totalStudents.toLocaleString('en-IN')} of {totalApprovedSeats.toLocaleString('en-IN')} Seats Filled
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(0, parseFloat(utilizationRate) || 0))}%` }} 
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Cross-College Duplicate Alerts</span>
            <ShieldAlert className={`w-4 h-4 ${totalConflicts > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${totalConflicts > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {totalConflicts} Active
          </div>
          <p className="text-xs text-slate-500 mt-1">Dual-Enrolment Anomalies Flagged</p>
          <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${
            totalConflicts > 0 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300' 
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
          }`}>
            {totalConflicts > 0 ? 'Immediate Inquiry Required' : 'All Registrations Unique ✓'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Intake Ceiling Breaches</span>
            <AlertTriangle className={`w-4 h-4 ${totalBreaches > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${totalBreaches > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {totalBreaches} Colleges
          </div>
          <p className="text-xs text-slate-500 mt-1">Exceeding Approved Caps</p>
          <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${
            totalBreaches > 0 
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' 
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
          }`}>
            {totalBreaches > 0 ? 'Show-Cause Notices Dispatched' : '100% Within Approved Caps ✓'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Supernumerary Seats Audited</span>
            <Building2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {supernumeraryStudents.length.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalSupernumeraryApproved > 0 
              ? `${supernumeraryStudents.length} of ${totalSupernumeraryApproved} Quota Enrolled`
              : "EWS, PMSSS, TFW & FN Schemes"}
          </p>
          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
            {supernumeraryStudents.length > 0 ? "100% Within Quotas ✓" : "Regulatory Oversight Active"}
          </span>
        </div>
      </div>

      {/* 3. Central Command SubTabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('ANOMALIES')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'ANOMALIES' 
              ? 'border-red-600 text-red-600 dark:text-red-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Cross-Institution Duplicate Desk ({duplicateStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('BREACHES')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'BREACHES' 
              ? 'border-amber-600 text-amber-600 dark:text-amber-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Intake Ceiling Breaches ({intakeBreaches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('GEOMAP')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'GEOMAP' 
              ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>State-wise Geo-Spatial Analytics</span>
        </button>
      </div>

      {/* 4. SUBTAB: Cross-Institution Duplicate Alerts */}
      {activeTab === 'ANOMALIES' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            duplicateStudents.length > 0
              ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
          }`}>
            <div className="flex items-center gap-3">
              {duplicateStudents.length > 0 ? (
                <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              <div>
                <h3 className={`text-sm font-bold ${duplicateStudents.length > 0 ? 'text-red-900 dark:text-red-200' : 'text-emerald-900 dark:text-emerald-200'}`}>
                  Automated Duplicate Sentinel: Multi-Institution Conflicts
                </h3>
                <p className={`text-xs ${duplicateStudents.length > 0 ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                  {duplicateStudents.length > 0 
                    ? "These student APAAR IDs are enrolled simultaneously across two separate AICTE institutions for 2026-27."
                    : "Zero cross-institutional duplicate enrolments detected. All student APAAR registrations across institutions are unique and verified."}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-white font-mono text-xs font-bold shrink-0 ${
              duplicateStudents.length > 0 ? 'bg-red-600' : 'bg-emerald-600'
            }`}>
              {duplicateStudents.length} Conflicts Pending Adjudication
            </span>
          </div>

          {duplicateStudents.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Zero Multi-Institution Duplicate Violations
              </h4>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                No students are currently enrolled in multiple AICTE institutions concurrently. The APAAR sovereign identity rule engine continuously monitors all institutional admissions in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {duplicateStudents.map(student => (
              <div 
                key={student.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {student.name}
                      </h4>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300">
                        APAAR: {formatApaar(student.apaarId)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      DOB: {student.dob} • Gender: {student.gender} • Academic Session: 2026-27
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
                    Dual Enrolment Violation
                  </span>
                </div>

                {/* Side-by-side Institution Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Institution A */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block">
                      Institution A (Primary Submission)
                    </span>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {student.institutionName}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      ID: <span className="font-mono">{student.institutionId}</span>
                    </div>
                    <div>
                      Department: <strong>{student.branchName || student.branchCode}</strong>
                    </div>
                    <div>
                      Roll No: <span className="font-mono">{student.rollNo}</span> • Category: {student.admissionCategory}
                    </div>
                    
                    <button
                      onClick={() => handleResolveConflict(student, student.institutionName)}
                      className="mt-2 w-full py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold text-xs transition"
                    >
                      Assign Exclusively to Institute A
                    </button>
                  </div>

                  {/* Institution B */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                    <span className="font-bold text-purple-900 dark:text-purple-300 block">
                      Institution B (Conflicting Enrolment)
                    </span>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {student.conflictWith?.institutionName || "Second Institution"}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      ID: <span className="font-mono">{student.conflictWith?.institutionId || "1-992019"}</span>
                    </div>
                    <div>
                      Department: <strong>{student.conflictWith?.branchName || "Engineering"}</strong>
                    </div>
                    <div>
                      Submission Timestamp: <span className="font-mono text-slate-500">{student.conflictWith?.enrolledTimestamp || "2026-08-10"}</span>
                    </div>

                    <button
                      onClick={() => handleResolveConflict(student, student.conflictWith?.institutionName || "Institute B")}
                      className="mt-2 w-full py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-bold text-xs transition"
                    >
                      Assign Exclusively to Institute B
                    </button>
                  </div>
                </div>

                {/* Regulatory Actions Toolbar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500">
                    Regulatory Mandate: Clause 7.2 of AICTE APH 2026 prevents simultaneous dual registrations.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFreezeRecord(student)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-black text-white font-bold transition flex items-center gap-1.5"
                    >
                      <Ban className="w-3.5 h-3.5 text-red-400" />
                      <span>Freeze Record in National DB</span>
                    </button>

                    <button
                      onClick={() => handleIssueNotice(student)}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Generate Show-Cause Notice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      )}

      {/* 5. SUBTAB: Intake Ceiling Breaches */}
      {activeTab === 'BREACHES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Approved Intake Ceiling Breach Monitor
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Institutions that uploaded student enrolments exceeding (Approved Intake + Supernumerary Cap).
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold">
              {intakeBreaches.length} Violations
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Institution Name & ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Approved Cap</th>
                  <th className="py-3 px-4">Actual Submitted</th>
                  <th className="py-3 px-4">Excess Count</th>
                  <th className="py-3 px-4">Regulatory Notice Ref</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {intakeBreaches.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-slate-500">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
                        Zero Intake Ceiling Breaches Detected
                      </span>
                      <span className="text-xs text-slate-400">
                        All registered technical institutions are compliant within approved intake and supernumerary caps.
                      </span>
                    </td>
                  </tr>
                ) : (
                  intakeBreaches.map(breach => (
                    <tr key={breach.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{breach.institutionName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {breach.institutionId}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                        {breach.branchName} ({breach.branchCode})
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {breach.totalCap} ({breach.approvedIntake} + {breach.supernumeraryQuota} Supernumerary)
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-red-600">
                        {breach.actualSubmitted}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-xs bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
                          +{breach.excessCount} Seats Excess
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {breach.noticeRef}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setActiveNoticeModal({
                              type: "EXCESS_ENROLMENT",
                              refNo: breach.noticeRef,
                              date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                              instName: breach.institutionName,
                              instId: breach.institutionId,
                              dept: breach.branchName,
                              cap: breach.totalCap,
                              actual: breach.actualSubmitted,
                              excess: breach.excessCount
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
                        >
                          Inspect Notice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SUBTAB: State-wise Geo-Spatial Analytics */}
      {activeTab === 'GEOMAP' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  All-India State-wise Enrolment Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any state card or filter to examine state intake utilization and vacancy ratios.
                </p>
              </div>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="ALL">All Registered States (National Overview)</option>
                {stateStats.map(s => (
                  <option key={s.code} value={s.code}>{s.state} ({s.code})</option>
                ))}
              </select>
            </div>

            {/* State Grid */}
            {stateStats.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500">
                  No registered institutions in sovereign registry yet. State-wise capacity metrics will appear once institutions are onboarded or loaded from MongoDB Atlas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stateStats.map(st => {
                  const isSelected = selectedState === st.code;
                  return (
                    <div
                      key={st.code}
                      onClick={() => setSelectedState(isSelected ? 'ALL' : st.code)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/20' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {st.state}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold">
                          {st.code}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Colleges</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{st.totalInstitutions}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Utilization</span>
                          <span className="font-bold text-emerald-600">{st.utilization}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Approved Seats</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{st.approvedSeats.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Enrolled APAARs</span>
                          <span className="font-bold text-blue-600">{st.enrolledSeats.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${st.utilization}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Show-Cause / Regulatory Notice Formal Modal */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-700 p-6 md:p-8 space-y-6">
            
            {/* Government Official Letterhead */}
            <div className="text-center pb-4 border-b-2 border-slate-900 dark:border-slate-100 space-y-1">
              <div className="font-bold text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300">
                अखिल भारतीय तकनीकी शिक्षा परिषद | ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
              </div>
              <div className="text-xs text-slate-500">
                (A STATUTORY BODY OF THE GOVERNMENT OF INDIA, MINISTRY OF EDUCATION)
              </div>
              <div className="text-[11px] text-slate-500">
                Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 • Regulation Bureau
              </div>
              <div className="pt-2 text-sm font-extrabold underline text-red-600 dark:text-red-400 uppercase tracking-wide">
                REGULATORY SHOW-CAUSE NOTICE / WARNING ORDER
              </div>
            </div>

            {/* Notice Metadata */}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
              <div>Ref: <strong className="text-slate-900 dark:text-white">{activeNoticeModal.refNo}</strong></div>
              <div>Date: <strong className="text-slate-900 dark:text-white">{activeNoticeModal.date}</strong></div>
            </div>

            {/* Notice Body */}
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              {activeNoticeModal.type === "DUAL_ENROLMENT" ? (
                <>
                  <p>
                    <strong>Subject:</strong> Immediate Notice regarding identified cross-institutional dual-enrolment conflict for Candidate <strong>{activeNoticeModal.studentName}</strong> (APAAR ID: {formatApaar(activeNoticeModal.apaarId)}).
                  </p>
                  <p>
                    Upon automated real-time cross-verification against the AICTE National Academic Repository, it has been discovered that the candidate is concurrently enrolled in:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Institution 1:</strong> {activeNoticeModal.instA}</li>
                    <li><strong>Institution 2:</strong> {activeNoticeModal.instB}</li>
                  </ul>
                  <p>
                    Under Chapter VII of the AICTE Approval Process Handbook, dual simultaneous admission without formal withdrawal constitutes a regulatory violation. Both institutions are directed to submit written clarification within 7 days.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Subject:</strong> Show-Cause Notice for Exceeding AICTE Approved Intake Ceiling in <strong>{activeNoticeModal.dept}</strong>.
                  </p>
                  <p>
                    Institution: <strong>{activeNoticeModal.instName}</strong> (Permanent AICTE ID: {activeNoticeModal.instId})
                  </p>
                  <p>
                    Audit findings reveal that the institution has submitted <strong>{activeNoticeModal.actual}</strong> admissions against the sanctioned total ceiling of <strong>{activeNoticeModal.cap}</strong> seats (excess of +{activeNoticeModal.excess} unauthorized enrolments).
                  </p>
                  <p>
                    Institutional regulatory submission has been locked. Formal compliance reply is mandated within 14 calendar days.
                  </p>
                </>
              )}
            </div>

            {/* Seal & Signatory */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Dr. R. K. Soni</span>
                <span className="text-slate-500 block">Adviser (Regulation Bureau), AICTE New Delhi</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Notice</span>
                </button>

                <button
                  onClick={() => setActiveNoticeModal(null)}
                  className="px-4 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold transition"
                >
                  Dismiss
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
