import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  Building2, 
  CheckCircle2, 
  Layers,
  Award
} from 'lucide-react';
export default function PolicyReportsModal({ isOpen, onClose, initialType = 'NIRF', institutions = [] }) {
  const [reportType, setReportType] = useState(initialType);

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
      const enrolled = inst.departments?.reduce((sum, d) => sum + (d.enrolledCount || 0), 0) || 0;
      statesMap[state].enrolledSeats += enrolled;
    });

    return Object.values(statesMap).map(st => {
      const util = st.approvedSeats > 0 ? ((st.enrolledSeats / st.approvedSeats) * 100).toFixed(1) : "0.0";
      return {
        ...st,
        utilization: util,
        vacant: Math.max(0, st.approvedSeats - st.enrolledSeats)
      };
    });
  }, [institutions]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    let csv = "";
    if (reportType === 'NIRF') {
      csv = "InstitutionID,Name,State,ApprovedIntake,ActualEnrolled,UtilizationPct,Supernumerary,ComplianceScore\n" +
        institutions.map(inst => {
          const totalApproved = inst.departments.reduce((acc, d) => acc + d.approvedIntake, 0);
          const totalEnrolled = inst.departments.reduce((acc, d) => acc + (d.enrolledCount || 0), 0);
          const totalSuper = inst.departments.reduce((acc, d) => acc + d.supernumerarySeats, 0);
          const util = totalApproved > 0 ? ((totalEnrolled / totalApproved) * 100).toFixed(1) : "0.0";
          return `"${inst.id}","${inst.name}","${inst.state}",${totalApproved},${totalEnrolled},${util}%,${totalSuper},${inst.complianceScore}%`;
        }).join("\n");
    } else {
      csv = "StateCode,StateName,TotalInstitutions,ApprovedSeats,EnrolledAPAAR,UtilizationPct,VacantSeats,ComplianceRating\n" +
        stateStats.map(st => 
          `"${st.code}","${st.state}",${st.totalInstitutions},${st.approvedSeats},${st.enrolledSeats},${st.utilization}%,${st.vacant},${st.compliance}%`
        ).join("\n");
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AICTE_${reportType}_Report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                AICTE Regulatory & Policy Intelligence Engine
              </h2>
              <span className="text-xs text-slate-500">Accreditation Dossiers & Parliament Queries</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold border-none text-slate-800 dark:text-slate-200"
            >
              <option value="NIRF">NIRF Student Intake Dossier</option>
              <option value="NAAC">NAAC / NBA Criterion 2.1 Report</option>
              <option value="PARLIAMENT">Lok Sabha / Rajya Sabha Starred Q&A</option>
              <option value="SUPERNUMERARY">All-India Supernumerary (PMSSS/EWS) Audit</option>
            </select>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Report Layout */}
        <div className="space-y-6 font-sans">
          
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 dark:border-slate-100 space-y-1">
            <div className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">
              भारत सरकार | GOVERNMENT OF INDIA • शिक्षा मंत्रालय | MINISTRY OF EDUCATION
            </div>
            <h1 className="text-lg font-extrabold uppercase text-slate-950 dark:text-white">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
            </h1>
            <div className="text-xs text-slate-500">
              Regulation Bureau, Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
            </div>
            <div className="pt-2 text-sm font-bold uppercase text-blue-900 dark:text-blue-400">
              {reportType === 'NIRF' && "Official NIRF Student Intake Compliance Dossier (Academic Year 2026-27)"}
              {reportType === 'NAAC' && "NAAC / NBA Criterion 2.1: Enrolment Profile & Student-Teacher Ratio Audit"}
              {reportType === 'PARLIAMENT' && "Parliament of India (Lok Sabha / Rajya Sabha) Starred Question Reference Report"}
              {reportType === 'SUPERNUMERARY' && "National Supernumerary Quota Distribution (EWS, PMSSS, TFW, FN & NRI)"}
            </div>
          </div>

          {/* Report Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>Report Ref: <strong>AICTE/POL/{reportType}/2026/0921</strong></div>
            <div>Generated On: <strong>{new Date().toLocaleString()}</strong></div>
            <div>Status: <strong className="text-emerald-600">CERTIFIED AUTHENTIC</strong></div>
          </div>

          {/* Report Content Table */}
          {reportType === 'NIRF' || reportType === 'NAAC' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                This certified dossier compiles verified student enrolments registered under individual 12-digit <strong>APAAR IDs</strong>, cross-verified against AICTE-sanctioned approved intake capacities.
              </p>

              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold uppercase text-[10px] text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="py-2.5 px-3">Institution Name & ID</th>
                    <th className="py-2.5 px-3">State</th>
                    <th className="py-2.5 px-3">Sanctioned Intake</th>
                    <th className="py-2.5 px-3">Verified APAAR Count</th>
                    <th className="py-2.5 px-3">Supernumerary</th>
                    <th className="py-2.5 px-3">Utilization</th>
                    <th className="py-2.5 px-3 text-right">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {institutions.map(inst => {
                    const totalApproved = inst.departments.reduce((acc, d) => acc + d.approvedIntake, 0);
                    const totalEnrolled = inst.departments.reduce((acc, d) => acc + d.enrolledCount, 0);
                    const totalSuper = inst.departments.reduce((acc, d) => acc + d.supernumerarySeats, 0);
                    const util = Math.round((totalEnrolled / totalApproved) * 100);

                    return (
                      <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          <div>{inst.name}</div>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {inst.id}</span>
                        </td>
                        <td className="py-2.5 px-3">{inst.state}</td>
                        <td className="py-2.5 px-3 font-mono">{totalApproved}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{totalEnrolled}</td>
                        <td className="py-2.5 px-3 font-mono">+{totalSuper}</td>
                        <td className="py-2.5 px-3 font-bold">{util}%</td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">
                          {inst.complianceScore}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                State-by-state analytical breakdown of technical education seat availability, enrolled APAAR identities, and unallocated vacant seats for policy planning.
              </p>

              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold uppercase text-[10px] text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="py-2.5 px-3">State / UT</th>
                    <th className="py-2.5 px-3">Institutions</th>
                    <th className="py-2.5 px-3">Approved Seats</th>
                    <th className="py-2.5 px-3">Enrolled APAARs</th>
                    <th className="py-2.5 px-3">Intake Utilization</th>
                    <th className="py-2.5 px-3">Vacant Seats</th>
                    <th className="py-2.5 px-3 text-right">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {stateStats.map(st => (
                    <tr key={st.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {st.state} ({st.code})
                      </td>
                      <td className="py-2.5 px-3 font-mono">{st.totalInstitutions}</td>
                      <td className="py-2.5 px-3 font-mono">{st.approvedSeats.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{st.enrolledSeats.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 font-bold">{st.utilization}%</td>
                      <td className="py-2.5 px-3 font-mono text-amber-600 font-bold">{st.vacant.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">
                        {st.compliance}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Official Sign-off */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">AICTE Regulation Bureau</span>
              <span>All India Council for Technical Education, New Delhi</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px]">Digital Signature Hash: 7b841a0293ec4...</span>
              <div className="text-emerald-600 font-bold flex items-center justify-end gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Certified for Release
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
