import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { generateMockHash } from '../data/validationEngine';

export default function AuditTrail({ auditLogs }) {
  const [filterActor, setFilterActor] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesActor = filterActor === 'ALL' || log.actor.includes(filterActor);
    const matchesQuery = 
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recordHash?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesActor && matchesQuery;
  });

  const handleExportCsv = () => {
    const headers = "id,timestamp,actor,actorName,action,details,ipHash,status,recordHash\n";
    const rows = filteredLogs.map(l => 
      `"${l.id}","${l.timestamp}","${l.actor}","${l.actorName}","${l.action}","${l.details}","${l.ipHash}","${l.status}","${l.recordHash}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AICTE_Audit_Trail_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Cryptographic Immutability
            </span>
            <span className="text-xs text-slate-500">SHA-256 Chained Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            National Regulatory Audit Trail & Transaction Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every student record upload, anomaly flag, regulatory freeze, and third-party verification is cryptographically anchored.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shadow-md flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, keyword, actor, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-800 dark:text-slate-200 w-full sm:w-auto"
          >
            <option value="ALL">All Actors & Engines</option>
            <option value="NODAL">Institution Nodal Officers</option>
            <option value="AICTE">AICTE Central Rule Engines</option>
            <option value="VERIFIER">Authorized Verifiers</option>
          </select>
        </div>
      </div>

      {/* 3. Log Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="py-3 px-4">Log ID & Timestamp</th>
              <th className="py-3 px-4">Actor & System Role</th>
              <th className="py-3 px-4">Action Type</th>
              <th className="py-3 px-4">Transaction Details</th>
              <th className="py-3 px-4">Cryptographic Hash</th>
              <th className="py-3 px-4 text-right">Regulatory Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{log.id}</div>
                  <div className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{log.actorName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{log.ipHash}</div>
                </td>

                <td className="py-3 px-4">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300">
                    {log.action}
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                  {log.details}
                </td>

                <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                  <span className="hover:text-slate-900 dark:hover:text-white transition" title={log.recordHash}>
                    {log.recordHash || "sha256_e3b0c44..."}
                  </span>
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    log.status.includes("REGULATORY") || log.status.includes("LOCKED") || log.status.includes("FROZEN")
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
