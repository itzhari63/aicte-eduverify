import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertTriangle 
} from 'lucide-react';
import { VIDYA_METRICS } from '../../data/vidyaVerifyData';

export default function KPIMetricsGrid({ metrics = VIDYA_METRICS, onFilterSelect }) {
  const currentMetrics = {
    totalInstitutions: metrics.totalInstitutions || 173,
    recordsVerified: metrics.recordsVerified || 63,
    pendingVerification: metrics.pendingVerification || 1,
    requiresAttention: metrics.requiresAttention || 5,
    sanctionedQuotaAlerts: metrics.sanctionedQuotaAlerts || 3
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Institutions */}
      <div 
        onClick={() => onFilterSelect?.('INSTITUTIONS')}
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Institutions</span>
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {currentMetrics.totalInstitutions}
        </div>
        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
          <span>● 173 Enrolled</span>
        </div>
      </div>

      {/* 2. Records Verified */}
      <div 
        onClick={() => onFilterSelect?.('VERIFIED')}
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Records Verified</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {currentMetrics.recordsVerified}
        </div>
        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
          63 Confirmed on Ledger
        </div>
      </div>

      {/* 3. Pending Verification */}
      <div 
        onClick={() => onFilterSelect?.('PENDING')}
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Pending Verification</span>
          <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {currentMetrics.pendingVerification}
        </div>
        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
          1 Awaiting Review
        </div>
      </div>

      {/* 4. Integrity Alerts / Crossovers */}
      <div 
        onClick={() => onFilterSelect?.('INTEGRITY_ALERTS')}
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-red-200/80 dark:border-red-900/60 shadow-sm hover:shadow-md transition bg-red-50/20 dark:bg-red-950/20 cursor-pointer group"
      >
        <div className="flex items-center justify-between text-red-500 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider">Integrity Alerts</span>
          <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400">
          {currentMetrics.requiresAttention}
        </div>
        <div className="text-[10px] text-red-600 dark:text-red-400 font-semibold mt-1">
          5 Flagged Crossovers
        </div>
      </div>

      {/* 5. Intake Quota Alerts */}
      <div 
        onClick={() => onFilterSelect?.('QUOTA_ALERTS')}
        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 shadow-sm hover:shadow-md transition bg-amber-50/20 dark:bg-amber-950/20 col-span-2 sm:col-span-1 cursor-pointer group"
      >
        <div className="flex items-center justify-between text-amber-600 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider">Intake Quota Alerts</span>
          <AlertTriangle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
          {currentMetrics.sanctionedQuotaAlerts}
        </div>
        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
          3 Seats Exceeded
        </div>
      </div>
    </div>
  );
}
