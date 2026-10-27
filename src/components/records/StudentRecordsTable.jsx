import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  Building2,
  Copy,
  Check
} from 'lucide-react';
import { INITIAL_STUDENTS } from '../../data/mockData';
import { formatApaar } from '../../data/validationEngine';

export default function StudentRecordsTable({ 
  students = INITIAL_STUDENTS,
  onViewStudent,
  onViewCertificate 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState('');
  const pageSize = 8;

  const handleCopyApaar = (apaar) => {
    navigator.clipboard.writeText(apaar);
    setCopiedId(apaar);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const filteredStudents = students.filter(s => {
    const rawApaar = s.apaarId || '';
    const formatted = formatApaar(rawApaar);
    const matchesSearch = 
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      rawApaar.includes(searchTerm) ||
      formatted.includes(searchTerm) ||
      (s.rollNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.institutionName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = 
      deptFilter === 'ALL' || 
      (s.branchCode || '').toUpperCase() === deptFilter.toUpperCase();

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'VERIFIED' && s.status === 'VERIFIED') ||
      (statusFilter === 'PENDING' && (s.status === 'PENDING' || s.status === 'PENDING_REVIEW')) ||
      (statusFilter === 'NEEDS_ATTENTION' && (s.status === 'FLAGGED_DUPLICATE' || s.status === 'INTAKE_BREACH'));

    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Student Name / APAAR ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Department Filter (CSE, ECE, Mech, IT) */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 text-[11px]">Dept:</span>
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE / ENTC</option>
              <option value="MECH">MECH</option>
              <option value="IT">IT / AIDS</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="NEEDS_ATTENTION">Needs Attention</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold">
                <th className="py-3 px-4">APAAR ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Institution Code</th>
                <th className="py-3 px-4">Course / Dept</th>
                <th className="py-3 px-4">Admission Year</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                    No matching student records found for current filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((stu) => {
                  const isVerified = stu.status === 'VERIFIED';
                  const isPending = stu.status === 'PENDING' || stu.status === 'PENDING_REVIEW';
                  const isFlagged = stu.status === 'FLAGGED_DUPLICATE' || stu.status === 'INTAKE_BREACH';
                  const formattedId = formatApaar(stu.apaarId);

                  return (
                    <tr 
                      key={stu.id || stu.apaarId} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      {/* APAAR ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                          <span>{formattedId}</span>
                          <button
                            onClick={() => handleCopyApaar(stu.apaarId)}
                            className="p-1 hover:text-blue-800 dark:hover:text-blue-300 transition"
                            title="Copy APAAR ID"
                          >
                            {copiedId === stu.apaarId ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Candidate Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          {stu.name}
                        </div>
                        <span className="text-[10px] text-slate-400">Roll: {stu.rollNo || 'N/A'}</span>
                      </td>

                      {/* Institution Code */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-600 dark:text-slate-300">
                        {stu.institutionId}
                      </td>

                      {/* Course / Dept */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {stu.branchCode}
                        </span>
                        <span className="text-slate-400 text-[10px] block truncate max-w-xs">
                          {stu.branchName || 'Engineering'}
                        </span>
                      </td>

                      {/* Admission Year */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {stu.admissionYear || 2026}
                      </td>

                      {/* Compliance Status */}
                      <td className="py-3.5 px-4">
                        {isVerified && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending</span>
                          </span>
                        )}
                        {isFlagged && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300 flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            <span>Needs Attention</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onViewStudent?.(stu)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>Audit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{paginatedStudents.length}</strong> of <strong className="text-slate-800 dark:text-slate-200">{filteredStudents.length}</strong> students
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
