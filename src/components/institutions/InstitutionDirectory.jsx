import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Users
} from 'lucide-react';
import { VIDYA_INSTITUTIONS } from '../../data/vidyaVerifyData';

export default function InstitutionDirectory({ onAddAuditLog }) {
  const [institutions, setInstitutions] = useState(VIDYA_INSTITUTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [expandedInstId, setExpandedInstId] = useState(null);

  // Modal: Add Program
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [targetInstitution, setTargetInstitution] = useState(null);
  const [newProgramName, setNewProgramName] = useState('');
  const [newProgramCode, setNewProgramCode] = useState('');
  const [newSanctionedIntake, setNewSanctionedIntake] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenAddProgram = (inst) => {
    setTargetInstitution(inst);
    setNewProgramName('');
    setNewProgramCode('');
    setNewSanctionedIntake('60');
    setIsAddProgramOpen(true);
  };

  const handleSaveProgram = (e) => {
    e.preventDefault();
    if (!newProgramName || !newProgramCode || !newSanctionedIntake) return;

    const intake = parseInt(newSanctionedIntake, 10) || 60;
    const newProg = {
      code: newProgramCode.toUpperCase().trim(),
      name: newProgramName.trim(),
      approvedIntake: intake,
      enrolled: 0
    };

    setInstitutions(prev => prev.map(inst => {
      if (inst.id === targetInstitution.id) {
        return {
          ...inst,
          activeProgramsCount: inst.activeProgramsCount + 1,
          sanctionedQuota: inst.sanctionedQuota + intake,
          programs: [...(inst.programs || []), newProg]
        };
      }
      return inst;
    }));

    showToast(`New Program "${newProg.name}" (${newProg.code}) with ${intake} sanctioned seats added to ${targetInstitution.name}.`);
    onAddAuditLog?.({
      actor: "Institutional Admin",
      actorName: targetInstitution.nodalOfficer || "Nodal Officer",
      action: "PROGRAM_ADDED",
      details: `Added new academic degree program ${newProg.code} with approved intake of ${intake} seats under AISHE ${targetInstitution.aisheCode}.`,
      status: "APPROVED_CONFIGURED"
    });

    setIsAddProgramOpen(false);
  };

  // Filtered List
  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.aisheCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState === 'ALL' || inst.state === selectedState;
    return matchesSearch && matchesState;
  });

  const uniqueStates = ['ALL', ...new Set(institutions.map(i => i.state))];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-blue-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-blue-800/40">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            AICTE Approved Institutions Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Institution Management Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Directory of approved colleges, AISHE code mapping, active degree programs, and capacity utilization monitoring.
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {institutions.length}
          </div>
          <div className="text-xs text-slate-300">Monitored Institutions</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Institution Name or AISHE Code..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">Filter State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            {uniqueStates.map(state => (
              <option key={state} value={state}>{state === 'ALL' ? 'All States' : state}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Institute Name</th>
                <th className="py-3 px-4">AISHE Code</th>
                <th className="py-3 px-4">Active Programs</th>
                <th className="py-3 px-4">Enrolled Students</th>
                <th className="py-3 px-4">Sanctioned Quota</th>
                <th className="py-3 px-4">Capacity Utilization</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInstitutions.map((inst) => {
                const isExpanded = expandedInstId === inst.id;
                const isExceeded = inst.capacityUtilization > 100;
                const isWarning = inst.capacityUtilization >= 90 && inst.capacityUtilization <= 100;

                return (
                  <React.Fragment key={inst.id}>
                    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedInstId(isExpanded ? null : inst.id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white">
                              {inst.name}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {inst.type} • {inst.state}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {inst.aisheCode}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {inst.activeProgramsCount} Programs
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                        {inst.enrolledStudentsCount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300">
                        {inst.sanctionedQuota.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-bold ${
                              isExceeded 
                                ? 'text-red-600 dark:text-red-400' 
                                : isWarning 
                                ? 'text-amber-600 dark:text-amber-400' 
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {inst.capacityUtilization}%
                            </span>
                            {isExceeded && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300">
                                Overfill
                              </span>
                            )}
                          </div>
                          <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                isExceeded ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(inst.capacityUtilization, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenAddProgram(inst)}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Program</span>
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Department / Programs Sub-Table */}
                    {isExpanded && (
                      <tr className="bg-slate-50/60 dark:bg-slate-950/60">
                        <td colSpan="7" className="p-4 pl-12">
                          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                Configured Academic Degree Programs ({inst.name})
                              </h5>
                              <span className="text-[11px] text-slate-400 font-semibold">
                                Nodal Contact: {inst.nodalEmail}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                              {inst.programs?.map((prog, pIdx) => {
                                const pExceeded = prog.enrolled > prog.approvedIntake;
                                return (
                                  <div key={pIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                                    <div>
                                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                                        {prog.code} - {prog.name}
                                      </div>
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                        Intake: {prog.approvedIntake} Seats
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className={`text-xs font-bold ${pExceeded ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {prog.enrolled} Allotted
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Program */}
      {isAddProgramOpen && targetInstitution && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Add Degree Program
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {targetInstitution.name} ({targetInstitution.aisheCode})
                </p>
              </div>
              <button 
                onClick={() => setIsAddProgramOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Program Name
                </label>
                <input
                  type="text"
                  value={newProgramName}
                  onChange={(e) => setNewProgramName(e.target.value)}
                  placeholder="e.g. B.Tech Robotics & Automation"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program Code
                  </label>
                  <input
                    type="text"
                    value={newProgramCode}
                    onChange={(e) => setNewProgramCode(e.target.value)}
                    placeholder="e.g. ROBO"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Approved Intake
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={newSanctionedIntake}
                    onChange={(e) => setNewSanctionedIntake(e.target.value)}
                    placeholder="60"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-700 dark:text-blue-300">
                AICTE Approval Regulation mandates strict enforcement of the configured sanctioned intake ceiling during student batch ingestion.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProgramOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md"
                >
                  Confirm & Configure Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
