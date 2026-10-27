import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Send, 
  XCircle,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { DATA_INTEGRITY_FLAGS } from '../../data/vidyaVerifyData';

export default function IntegrityReviewCenter({ 
  flags = DATA_INTEGRITY_FLAGS, 
  onActionComplete,
  onAuditRecord 
}) {
  const [activeFlags, setActiveFlags] = useState(flags);
  const [actionNotice, setActionNotice] = useState('');

  const handleAction = (flagId, actionType) => {
    setActiveFlags(prev => prev.map(f => {
      if (f.id === flagId) {
        let newStatus = f.status;
        if (actionType === 'FREEZE') newStatus = 'FROZEN';
        else if (actionType === 'OVERRIDE') newStatus = 'OVERRIDDEN';
        else if (actionType === 'AUDIT_FIELD') newStatus = 'FIELD_AUDIT_ASSIGNED';
        return { ...f, status: newStatus };
      }
      return f;
    }));

    const flag = activeFlags.find(f => f.id === flagId);
    let msg = '';
    if (actionType === 'FREEZE') {
      msg = `Record frozen for ${flag?.studentName || flagId}. State portal alerted.`;
    } else if (actionType === 'OVERRIDE') {
      msg = `Regulatory override approved for APAAR ${flag?.formattedApaar}.`;
    } else if (actionType === 'AUDIT_FIELD') {
      msg = `Flagged for physical Field Audit notice dispatched.`;
    }
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4000);

    onActionComplete?.({
      flagId,
      actionType,
      studentName: flag?.studentName,
      apaarId: flag?.apaarId
    });
  };

  return (
    <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Data Integrity Review Center
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
              {activeFlags.filter(f => f.status === 'REQUIRES_ATTENTION').length} Active Flags
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated regulatory anomaly surveillance flagging dual-enrollment crossovers and fraudulent admissions.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-semibold">
          Autonomous Crossover Radar
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Flagged Cards List */}
      <div className="space-y-3.5">
        {activeFlags.map((flag) => {
          const isCritical = flag.riskScore === 'Critical' || flag.riskLevel === 'CRITICAL';
          const isFrozen = flag.status === 'FROZEN';
          const isOverridden = flag.status === 'OVERRIDDEN';
          const isFieldAudit = flag.status === 'FIELD_AUDIT_ASSIGNED';
          const isPending = flag.status === 'REQUIRES_ATTENTION';

          return (
            <div 
              key={flag.id} 
              className={`p-5 rounded-2xl border transition-all ${
                isFrozen || isOverridden
                  ? 'opacity-70 bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                  : isCritical
                  ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                  : 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Risk Score Badge */}
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm ${
                      isCritical 
                        ? 'bg-red-600 text-white' 
                        : 'bg-amber-500 text-slate-950'
                    }`}>
                      Risk Score: {flag.riskScore || 'Critical'}
                    </span>

                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      APAAR: {flag.formattedApaar}
                    </span>

                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      ({flag.studentName})
                    </span>

                    {/* Status Badges */}
                    {isFrozen && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                        ● ENROLLMENT FROZEN
                      </span>
                    )}
                    {isOverridden && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        ✓ OVERRIDE APPROVED
                      </span>
                    )}
                    {isFieldAudit && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                        🔍 FIELD AUDIT PENDING
                      </span>
                    )}
                  </div>

                  {/* Context Narrative */}
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {flag.reason}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span>Primary: <strong className="text-slate-700 dark:text-slate-300">{flag.primaryInstitute}</strong></span>
                    {flag.secondaryInstitute && flag.secondaryInstitute !== 'None' && (
                      <>
                        <span>↔</span>
                        <span>Secondary: <strong className="text-slate-700 dark:text-slate-300">{flag.secondaryInstitute}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                {/* 3 Explicit Actions: Approve Override, Flag for Field Audit, Freeze Duplicate Record */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => onAuditRecord?.(flag)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>View Dossier</span>
                  </button>

                  {isPending && (
                    <>
                      <button
                        onClick={() => handleAction(flag.id, 'OVERRIDE')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Approve Institutional Override"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Approve Override</span>
                      </button>

                      <button
                        onClick={() => handleAction(flag.id, 'AUDIT_FIELD')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Dispatch Field Audit Order"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Flag for Field Audit</span>
                      </button>

                      <button
                        onClick={() => handleAction(flag.id, 'FREEZE')}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Freeze Duplicate Record on Sovereign Ledger"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Freeze Duplicate Record</span>
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
  );
}
