import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SANCTIONED_INTAKE_PROGRAMS } from '../../data/vidyaVerifyData';

export default function CapacityMonitor({ programs = SANCTIONED_INTAKE_PROGRAMS }) {
  const [filter, setFilter] = useState('ALL');

  const filteredPrograms = programs.filter(prog => {
    if (filter === 'ALL') return true;
    if (filter === 'EXCEEDED') return prog.utilization > 100;
    if (filter === 'WARNING') return prog.utilization >= 90 && prog.utilization <= 100;
    if (filter === 'NORMAL') return prog.utilization < 90;
    return true;
  });

  const exceededCount = programs.filter(p => p.utilization > 100).length;

  return (
    <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Sanctioned Capacity Review Center
            </h2>
            {exceededCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
                {exceededCount} Capacity Breaches
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated institutional surveillance tracking Approved Intake vs. Actual Allotment with color-coded ceiling gauges.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          {['ALL', 'EXCEEDED', 'WARNING', 'NORMAL'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filter === status 
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Capacity Table & Progress Bars */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {filteredPrograms.map((prog) => {
          const isExceeded = prog.utilization > 100;
          const isWarning = prog.utilization >= 90 && prog.utilization <= 100;

          // Color-coded capacity progress bar logic
          let barColor = 'bg-emerald-500';
          let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300';
          if (isExceeded) {
            barColor = 'bg-red-500';
            badgeColor = 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300 border border-red-300 dark:border-red-800';
          } else if (isWarning) {
            barColor = 'bg-amber-500';
            badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300';
          }

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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {prog.utilization}% Capacity
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{prog.instituteName}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">AISHE: {prog.aisheCode}</span>
                  </div>
                </div>

                {/* Seat Metrics */}
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Allotted: <strong className={isExceeded ? 'text-red-600 dark:text-red-400 text-sm' : ''}>{prog.actualAllotted}</strong> / Approved: {prog.approvedIntake}
                  </div>
                  {isExceeded && (
                    <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                      +{prog.excessCount} Unauthorized Admission Overfill
                    </div>
                  )}
                </div>
              </div>

              {/* Color-Coded Utilization Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(prog.utilization, 100)}%` }}
                  />
                </div>

                {/* Red Overfill Alert Badge */}
                {isExceeded && (
                  <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2 text-xs text-red-700 dark:text-red-300 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>
                      {prog.alertMessage || `Intake capacity exceeded: Admitted ${prog.actualAllotted} students against approved quota of ${prog.approvedIntake}.`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
