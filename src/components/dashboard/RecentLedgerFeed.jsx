import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Lock, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { RECENT_STUDENT_LEDGER } from '../../data/vidyaVerifyData';

export default function RecentLedgerFeed({ 
  records = RECENT_STUDENT_LEDGER, 
  onSelectStudent 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.apaarId?.includes(searchTerm) ||
      r.formattedApaar?.includes(searchTerm) ||
      r.institutionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.enrolledProgram?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'VERIFIED' && (r.status === 'Verified' || r.statusCode === 'VERIFIED')) ||
      (statusFilter === 'PENDING' && (r.status === 'Pending Review' || r.statusCode === 'PENDING_REVIEW')) ||
      (statusFilter === 'REJECTED' && (r.status === 'Rejected' || r.statusCode === 'FLAGGED_DUPLICATE'));

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Live Student Ledger Feed
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Sync (12ms)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable stream of newly sealed student enrollments and credential issuance.
          </p>
        </div>

        {/* Search & Status Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search APAAR or Name..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            {['ALL', 'VERIFIED', 'PENDING', 'REJECTED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                  statusFilter === st 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Candidate / APAAR</th>
              <th className="py-2.5 px-3">Institution & Program</th>
              <th className="py-2.5 px-3">Registration Time</th>
              <th className="py-2.5 px-3">Audit Status</th>
              <th className="py-2.5 px-3">SHA-256 Hash</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRecords.map((item) => {
              const isVerified = item.status === 'Verified' || item.statusCode === 'VERIFIED';
              const isPending = item.status === 'Pending Review' || item.statusCode === 'PENDING_REVIEW';
              const isRejected = item.status === 'Rejected' || item.statusCode === 'FLAGGED_DUPLICATE';

              return (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectStudent?.(item)}
                >
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900 dark:text-white">
                      {item.studentName}
                    </div>
                    <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                      {item.formattedApaar}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {item.enrolledProgram}
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-xs block">
                      {item.institutionName}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
                    {item.timestamp}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    {isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 flex items-center gap-1 w-max">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pending Review</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300 flex items-center gap-1 w-max">
                        <XCircle className="w-3 h-3 text-red-600" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate max-w-[120px]">{item.ledgerHash}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent?.(item);
                      }}
                      className="p-1 text-slate-400 group-hover:text-blue-600 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
