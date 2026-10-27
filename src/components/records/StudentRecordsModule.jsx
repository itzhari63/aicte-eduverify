import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  QrCode, 
  ChevronRight, 
  ChevronLeft,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { RECENT_STUDENT_LEDGER } from '../../data/vidyaVerifyData';

export default function StudentRecordsModule({ onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selected student for expanded details drawer / modal
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filtered Students
  const filteredRecords = RECENT_STUDENT_LEDGER.filter(student => {
    const matchesSearch = 
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.apaarId.includes(searchQuery) ||
      student.formattedApaar.includes(searchQuery) ||
      student.institutionCode.includes(searchQuery) ||
      student.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrolledProgram.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'VERIFIED' && student.statusCode === 'VERIFIED') ||
      (statusFilter === 'NEEDS_REVIEW' && student.statusCode === 'NEEDS_REVIEW') ||
      (statusFilter === 'PENDING' && student.statusCode === 'PENDING');

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-blue-900/40">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Sovereign National Student Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Complete Student Records & Audit Module
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Immutable 12-digit APAAR student academic repository, Academic Bank of Credits (ABC) validation, and cross-institution crossover audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-white font-mono">
              {filteredRecords.length}
            </div>
            <div className="text-xs text-slate-300">Audited Student Records</div>
          </div>
        </div>
      </div>

      {/* Search, Filter & Pagination Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by APAAR ID, Student Name, Program or Institute Code..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses ({filteredRecords.length})</option>
            <option value="VERIFIED">Verified</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Paginated Student Records Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">APAAR ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Institution Code</th>
                <th className="py-3 px-4">Enrolled Program</th>
                <th className="py-3 px-4">Admission Batch</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedRecords.map((student) => {
                const isVerified = student.statusCode === 'VERIFIED';
                const isNeedsReview = student.statusCode === 'NEEDS_REVIEW';

                return (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {student.formattedApaar}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {student.studentName}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {student.institutionCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{student.enrolledProgram}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{student.institutionName}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-600 dark:text-slate-400">
                      {student.admissionBatch}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : isNeedsReview
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      }`}>
                        {isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isNeedsReview && <AlertTriangle className="w-3 h-3 text-red-600" />}
                        {!isVerified && !isNeedsReview && <Clock className="w-3 h-3 text-amber-600" />}
                        <span>{student.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold text-xs transition"
                      >
                        Inspect Dossier →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800 dark:text-slate-200">{(currentPage - 1) * pageSize + 1}</strong> to <strong className="text-slate-800 dark:text-slate-200">{Math.min(currentPage * pageSize, filteredRecords.length)}</strong> of <strong className="text-slate-800 dark:text-slate-200">{filteredRecords.length}</strong> records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedStudent.studentName}
                  </h3>
                  <div className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                    APAAR ID: {selectedStudent.formattedApaar}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Institution</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedStudent.institutionName}</span>
                <span className="font-mono text-slate-400 text-[10px]">Code: {selectedStudent.institutionCode}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Program</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedStudent.enrolledProgram}</span>
                <span className="text-slate-400 text-[10px]">Batch: {selectedStudent.admissionBatch}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">ABC Academic Credits</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm mt-0.5 block">{selectedStudent.abcCredits} Verified Credits</span>
                <span className="text-slate-400 text-[10px]">Academic Bank of Credits</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Verification Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">{selectedStudent.status}</span>
                <span className="text-slate-400 text-[10px]">Updated: {selectedStudent.timestamp}</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Ledger Hash */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Cryptographic SHA-256 Ledger Anchor
              </span>
              <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all">
                {selectedStudent.ledgerHash}
              </div>
            </div>

            {/* Cross-Enrollment Compliance Notice */}
            {selectedStudent.statusCode === 'NEEDS_REVIEW' ? (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>Regulatory Warning: Candidate identified with concurrent admission flags requiring nodal verification.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Single enrollment verified with 100% sovereign regulatory compliance.</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
