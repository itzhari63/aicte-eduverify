import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Layers, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  Terminal, 
  Users, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  Eye, 
  FileCheck, 
  Trash2, 
  Edit3, 
  Save, 
  ShieldAlert, 
  Check, 
  ArrowUpRight,
  Send,
  HelpCircle,
  Building2,
  X
} from 'lucide-react';
import { 
  formatApaar, 
  cleanApaar, 
  validateStudent, 
  validateBatch, 
  parseStudentCsv 
} from '../data/validationEngine';
import { SAMPLE_CSV_VALID } from '../data/mockData';
import { api } from '../services/api';

export default function InstitutionDashboard({ 
  institution, 
  allStudents, 
  setAllStudents, 
  onAddAuditLog, 
  onViewCertificate,
  onViewApaarCard,
  onAddInstitution
}) {
  const [activeSubTab, setActiveSubTab] = useState('STUDIO'); // 'STUDIO', 'DIRECTORY', 'CAPACITY'
  const [ingestMode, setIngestMode] = useState('CSV'); // 'CSV', 'API', 'MANUAL'
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    shortName: '',
    state: 'Maharashtra',
    city: 'Pune',
    affiliation: 'State Technical University',
    nirfRank: 25,
    nodalName: '',
    nodalEmail: '',
    nodalPhone: '',
    cseCap: 120,
    aidsCap: 60,
    eceCap: 120
  });

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerForm.name.trim()) {
      alert("Please enter the institution name.");
      return;
    }
    setIsRegistering(true);
    try {
      const payload = {
        name: registerForm.name.trim(),
        shortName: registerForm.shortName.trim() || registerForm.name.trim().substring(0, 15),
        state: registerForm.state,
        city: registerForm.city,
        affiliation: registerForm.affiliation,
        nirfRank: Number(registerForm.nirfRank) || 25,
        complianceScore: 99.0,
        nodalOfficer: {
          name: registerForm.nodalName.trim() || "Registrar (Admissions)",
          designation: "Dean of Academic Admissions",
          email: registerForm.nodalEmail.trim() || "admissions@institution.edu.in",
          phone: registerForm.nodalPhone.trim() || "+91 20 2550 7000"
        },
        departments: [
          { code: "CSE", name: "Computer Science & Engineering", approvedIntake: Number(registerForm.cseCap) || 120, supernumerarySeats: Math.round((Number(registerForm.cseCap) || 120) * 0.1), enrolledCount: 0 },
          { code: "AIDS", name: "Artificial Intelligence & Data Science", approvedIntake: Number(registerForm.aidsCap) || 60, supernumerarySeats: Math.round((Number(registerForm.aidsCap) || 60) * 0.1), enrolledCount: 0 },
          { code: "ECE", name: "Electronics & Communication", approvedIntake: Number(registerForm.eceCap) || 120, supernumerarySeats: Math.round((Number(registerForm.eceCap) || 120) * 0.1), enrolledCount: 0 }
        ]
      };
      const res = await api.createInstitution(payload);
      const created = res?.data || payload;
      if (onAddInstitution) {
        onAddInstitution(created);
      }
      setIsRegisterModalOpen(false);
      onAddAuditLog({
        actor: "CENTRAL_ADMIN",
        actorName: "AICTE National Bureau",
        action: "INSTITUTION_REGISTERED",
        details: `Approved Institution Profile registered: ${created.name} (${created.id})`,
        status: "APPROVED_CLEARED"
      });
    } catch (err) {
      alert("Failed to register institution: " + err.message);
    } finally {
      setIsRegistering(false);
    }
  };
  
  // Staging state
  const [stagedStudents, setStagedStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Manual Add Form State
  const [manualForm, setManualForm] = useState({
    name: '',
    apaarId: '',
    rollNo: '',
    gender: 'Male',
    dob: '2004-05-15',
    branchCode: 'CSE',
    admissionCategory: 'General',
    isSupernumerary: false,
    quotaCategory: '',
    isNri: false,
    isOci: false,
    isFn: false,
    isTfw: false
  });

  // REST API Simulator State
  const [apiPayload, setApiPayload] = useState(JSON.stringify([
    {
      "apaarId": "",
      "rollNo": "",
      "name": "",
      "gender": "Female",
      "dob": "2005-01-01",
      "branchCode": "CSE",
      "admissionCategory": "General",
      "isSupernumerary": false,
      "quotaCategory": "None",
      "isNri": false,
      "isOci": false,
      "isFn": false,
      "isTfw": false
    }
  ], null, 2));
  const [apiResponse, setApiResponse] = useState(null);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  // Inline editing row state
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Warning Modal for Excess Enrolment
  const [intakeBreachModal, setIntakeBreachModal] = useState(null);

  // Filter students belonging to this institution
  const institutionStudents = institution ? allStudents.filter(s => s.institutionId === institution.id) : [];

  // Calculate capacity and run batch validation on staged records
  const batchValidation = institution 
    ? validateBatch(stagedStudents, allStudents, institution) 
    : { validRecords: [], invalidRecords: [], departmentCapacities: {} };

  // Handlers for CSV Load
  const handleLoadCsv = (csvText, label) => {
    const parsed = parseStudentCsv(csvText);
    setStagedStudents(parsed);
    if (institution) {
      onAddAuditLog({
        actor: "NODAL_OFFICER",
        actorName: `${institution.nodalOfficer?.name || 'Nodal Officer'} (${institution.shortName || institution.name})`,
        action: "STAGING_DATA_LOAD",
        details: `Loaded ${parsed.length} student records from ${label} into staging grid`,
        status: "STAGED_REVIEW"
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        handleLoadCsv(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  // Add single student manual form
  const handleManualAdd = (e) => {
    e.preventDefault();
    const newStudent = {
      id: `MANUAL-${Date.now()}`,
      apaarId: cleanApaar(manualForm.apaarId),
      rollNo: manualForm.rollNo,
      name: manualForm.name,
      gender: manualForm.gender,
      dob: manualForm.dob,
      branchCode: manualForm.branchCode,
      admissionCategory: manualForm.admissionCategory,
      isSupernumerary: manualForm.isSupernumerary,
      quotaCategory: manualForm.quotaCategory,
      isNri: manualForm.isNri,
      isOci: manualForm.isOci,
      isFn: manualForm.isFn,
      isTfw: manualForm.isTfw,
      admissionYear: 2026,
      status: "PENDING_VALIDATION"
    };

    setStagedStudents([newStudent, ...stagedStudents]);
    // Reset form
    setManualForm({
      name: '',
      apaarId: '',
      rollNo: '',
      gender: 'Male',
      dob: '2004-05-15',
      branchCode: 'CSE',
      admissionCategory: 'General',
      isSupernumerary: false,
      quotaCategory: '',
      isNri: false,
      isOci: false,
      isFn: false,
      isTfw: false
    });
  };

  // Run REST API simulator
  const handleSimulateApi = () => {
    setIsSubmittingApi(true);
    setTimeout(() => {
      try {
        const parsed = JSON.parse(apiPayload);
        const records = Array.isArray(parsed) ? parsed : [parsed];
        const validation = validateBatch(records, allStudents, institution);

        const httpStatus = validation.errorCount > 0 ? 422 : (validation.hasCapacityBreach ? 409 : 200);
        
        setApiResponse({
          status: httpStatus,
          statusText: httpStatus === 200 ? "OK" : (httpStatus === 422 ? "Unprocessable Entity (Validation Failed)" : "Conflict (Intake Cap Exceeded)"),
          timestamp: new Date().toISOString(),
          totalReceived: records.length,
          validCount: validation.validCount,
          errorCount: validation.errorCount,
          hasCapacityBreach: validation.hasCapacityBreach,
          capacityAudit: validation.capacityAudit,
          records: validation.records.map(r => ({
            apaarId: r.apaarId,
            name: r.name,
            rollNo: r.rollNo,
            branchCode: r.branchCode,
            isValid: r.validationResult.isValid,
            errors: r.validationResult.errors,
            warnings: r.validationResult.warnings
          }))
        });

        // Also add to staging for inspection
        setStagedStudents(records);
      } catch (err) {
        setApiResponse({
          status: 400,
          statusText: "Bad Request (JSON Parse Error)",
          error: err.message
        });
      }
      setIsSubmittingApi(false);
    }, 600);
  };

  // Commit Staged Records to AICTE Central Repository
  const handleCommitBatch = () => {
    // 1. Check if any critical validation errors exist
    if (batchValidation.errorCount > 0) {
      alert(`Cannot commit batch! There are ${batchValidation.errorCount} records with critical validation errors. Please fix or remove them.`);
      return;
    }

    // 2. Check if intake capacity is breached
    if (batchValidation.hasCapacityBreach) {
      const breachedDept = Object.entries(batchValidation.capacityAudit).find(([_, d]) => d.excess > 0);
      setIntakeBreachModal({
        department: breachedDept[0],
        audit: breachedDept[1]
      });
      return;
    }

    if (!institution) {
      alert("Please onboard or select an approved institution first.");
      return;
    }

    // 3. Commit records
    const newCommittedStudents = batchValidation.records.map(r => ({
      ...r,
      id: r.id || `STU-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      institutionId: institution.id,
      institutionName: institution.name,
      branchName: institution.departments?.find(d => d.code === r.branchCode)?.name || r.branchCode,
      status: "VERIFIED",
      verificationDate: new Date().toISOString(),
      hash: `sha256_${Date.now().toString(16)}`,
      abcId: `ABC-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${r.apaarId.slice(-4)}`,
      abcCredits: 75 + Math.floor(Math.random()*15),
      cgpa: (8.0 + Math.random()*1.8).toFixed(2)
    }));

    setAllStudents([...newCommittedStudents, ...allStudents]);
    
    // Asynchronously commit to backend REST API
    try {
      api.commitBatch(newCommittedStudents, institution.id);
    } catch (err) {
      console.warn("Backend batch commit warning:", err);
    }
    
    // Update institution department enrolled counts
    const updatedCount = newCommittedStudents.length;
    
    onAddAuditLog({
      actor: "NODAL_OFFICER",
      actorName: `${institution.nodalOfficer?.name || 'Nodal Officer'} (${institution.shortName || institution.name})`,
      action: "CENTRAL_REPOSITORY_COMMIT",
      details: `Committed ${updatedCount} verified student records into AICTE Central Registry with SHA-256 seal`,
      status: "COMMITTED_VERIFIED"
    });

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Clear staging and jump to directory
    setStagedStudents([]);
    setActiveSubTab('DIRECTORY');
  };

  // Delete staged row
  const handleDeleteStagedRow = (index) => {
    const updated = [...stagedStudents];
    updated.splice(index, 1);
    setStagedStudents(updated);
  };

  // Start inline editing
  const handleStartEdit = (index, student) => {
    setEditingIndex(index);
    setEditFormData({ ...student });
  };

  // Save inline edit
  const handleSaveEdit = (index) => {
    const updated = [...stagedStudents];
    updated[index] = { ...editFormData, apaarId: cleanApaar(editFormData.apaarId) };
    setStagedStudents(updated);
    setEditingIndex(null);
  };

  // Filter enrolled students for directory view
  const filteredDirectory = institutionStudents.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.apaarId?.includes(cleanApaar(searchQuery)) ||
      student.rollNo?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      categoryFilter === 'ALL' ||
      (categoryFilter === 'SUPERNUMERARY' && student.isSupernumerary) ||
      (categoryFilter === 'NRI' && student.isNri) ||
      (categoryFilter === 'FN' && student.isFn) ||
      (categoryFilter === 'TFW' && student.isTfw) ||
      (categoryFilter === 'GENERAL' && !student.isSupernumerary && !student.isNri && !student.isFn);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Institution Header & Nodal Profile */}
      {!institution ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Clean Sovereign State: 0 Approved Institutions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-2">
            All demo institutions and student profiles have been completely cleared. You can register an official institution profile below, or connect to your MongoDB Atlas cluster.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register Institutional Profile</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-xl shadow-md border border-blue-800 shrink-0">
                {institution.shortName ? institution.shortName.substring(0, 4).toUpperCase() : "INST"}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {institution.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                    AICTE ID: {institution.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    NIRF Rank #{institution.nirfRank || "N/A"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>Affiliation: {institution.affiliation}</span>
                  <span>•</span>
                  <span>Location: {institution.city}, {institution.state}</span>
                  <span>•</span>
                  <span>Nodal Officer: <strong>{institution.nodalOfficer?.name || "Nodal Officer"}</strong> ({institution.nodalOfficer?.designation || "Admissions"})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-center">
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5"
                title="Register New Institution"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Institution</span>
              </button>
              <button
                onClick={() => setActiveSubTab('STUDIO')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeSubTab === 'STUDIO' 
                    ? 'bg-blue-900 text-white dark:bg-blue-600 shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Ingestion Studio ({stagedStudents.length} Staged)</span>
              </button>

              <button
                onClick={() => setActiveSubTab('DIRECTORY')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeSubTab === 'DIRECTORY' 
                    ? 'bg-blue-900 text-white dark:bg-blue-600 shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Enrolled Directory ({institutionStudents.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('CAPACITY')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeSubTab === 'CAPACITY' 
                    ? 'bg-blue-900 text-white dark:bg-blue-600 shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Quota Monitor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Department Intake & Capacity Gauges */}
      {institution && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(institution.departments || []).map(dept => {
            const maxCapacity = dept.approvedIntake + dept.supernumerarySeats;
            const actualEnrolled = institutionStudents.filter(s => s.branchCode === dept.code).length;
            const enrolledCount = actualEnrolled;
            const percentage = maxCapacity > 0 ? Math.round((enrolledCount / maxCapacity) * 100) : 0;
            const isNearFull = percentage >= 90 && percentage <= 100;
            const isBreached = enrolledCount > maxCapacity;

            return (
              <div key={dept.code} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {dept.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isBreached 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'
                      : isNearFull 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300' 
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                  }`}>
                    {percentage}% Filled
                  </span>
                </div>

                <div className="text-base font-extrabold text-slate-900 dark:text-white truncate" title={dept.name}>
                  {dept.name}
                </div>

                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Enrolled:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {enrolledCount} / <span className="text-slate-400">{maxCapacity} Max</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBreached ? 'bg-red-500' : isNearFull ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Approved: {dept.approvedIntake}</span>
                  <span>Supernumerary: +{dept.supernumerarySeats}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Ingestion Studio SubTab */}
      {activeSubTab === 'STUDIO' && (
        <div className="space-y-6">
          
          {/* Ingestion Mode Selector Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Multi-Method Student Ingestion Studio
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ingest student admissions using batch CSV, ERP REST Webhook simulator, or single student addition.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setIngestMode('CSV')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  ingestMode === 'CSV' ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>CSV / Excel Upload</span>
              </button>

              <button
                onClick={() => setIngestMode('API')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  ingestMode === 'API' ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>REST API Gateway</span>
              </button>

              <button
                onClick={() => setIngestMode('MANUAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  ingestMode === 'MANUAL' ? 'bg-white dark:bg-slate-700 text-blue-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Manual Student Entry</span>
              </button>
            </div>
          </div>

          {/* MODE 1: CSV DRAG & DROP */}
          {ingestMode === 'CSV' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center transition bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Drag and drop admissions CSV / Excel sheet here
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Strict schema mapping for APAAR ID (12-digits), Roll No, Department Code, and Category flags.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <label className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold cursor-pointer transition shadow-sm flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Select Student Admissions CSV File</span>
                    <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Instructions Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 px-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Auto-Validates 12-digit APAAR format, cross-college duplicate checks & quota capping.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([SAMPLE_CSV_VALID], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'AICTE_APAAR_Ingestion_Template.csv';
                    a.click();
                  }}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Blank CSV Template</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: REST API WEBHOOK SIMULATOR */}
          {ingestMode === 'API' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    College ERP Webhook Ingestion API Gateway
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Automated push endpoint for institutional management systems (TCS iON, SAP Education, ERP9, NIC) to AICTE Central Ingestion Gateway.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-mono text-xs font-bold">
                    POST
                  </span>
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                    /api/v1/students/batch-ingest
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* JSON Request Payload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Request Body (JSON Payload):</span>
                    <span className="text-slate-400 font-mono text-[11px]">Bearer Token: inst_{institution?.id?.replace(/[^a-zA-Z0-9]/g, '') || 'gateway_token'}</span>
                  </div>
                  <textarea
                    rows={12}
                    value={apiPayload}
                    onChange={(e) => setApiPayload(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleSimulateApi}
                      disabled={isSubmittingApi}
                      className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingApi ? "Executing Validation Engine..." : "Dispatch API Payload"}</span>
                    </button>
                  </div>
                </div>

                {/* API Response Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Live API Response:</span>
                    {apiResponse && (
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        apiResponse.status === 200 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        HTTP {apiResponse.status} {apiResponse.statusText}
                      </span>
                    )}
                  </div>
                  <div className="h-[240px] overflow-y-auto p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs">
                    {apiResponse ? (
                      <pre className="whitespace-pre-wrap">{JSON.stringify(apiResponse, null, 2)}</pre>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500">
                        Click "Send Webhook Request" to execute validation pipeline and view HTTP response.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: MANUAL STUDENT ENTRY FORM */}
          {ingestMode === 'MANUAL' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Walk-in / Spot Admission Single Record Entry
              </h3>

              <form onSubmit={handleManualAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rohan Deshmukh"
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">12-Digit APAAR ID *</label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    placeholder="e.g., 9821-0492-8371"
                    value={manualForm.apaarId}
                    onChange={(e) => setManualForm({ ...manualForm, apaarId: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">College Roll / Reg No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 112103120"
                    value={manualForm.rollNo}
                    onChange={(e) => setManualForm({ ...manualForm, rollNo: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department / Branch *</label>
                  <select
                    value={manualForm.branchCode}
                    onChange={(e) => setManualForm({ ...manualForm, branchCode: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    {(institution?.departments || []).map(d => (
                      <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={manualForm.dob}
                    onChange={(e) => setManualForm({ ...manualForm, dob: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Admission Category</label>
                  <select
                    value={manualForm.admissionCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setManualForm({ 
                        ...manualForm, 
                        admissionCategory: val,
                        isSupernumerary: val === 'Supernumerary'
                      });
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="General">General / Open</option>
                    <option value="Supernumerary">Supernumerary Quota</option>
                    <option value="NRI">NRI Quota</option>
                    <option value="Foreign National">Foreign National (FN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Supernumerary Scheme Type</label>
                  <select
                    disabled={!manualForm.isSupernumerary}
                    value={manualForm.quotaCategory}
                    onChange={(e) => setManualForm({ ...manualForm, quotaCategory: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50"
                  >
                    <option value="">-- None / Select Scheme --</option>
                    <option value="EWS">Economically Weaker Section (EWS)</option>
                    <option value="PMSSS">Prime Minister's Special Scholarship (PMSSS)</option>
                    <option value="TFW">Tuition Fee Waiver (TFW)</option>
                    <option value="JK_MIGRANT">J&K Migrant Quota</option>
                    <option value="FN">Foreign National (FN)</option>
                  </select>
                </div>

                {/* Checkbox Flags */}
                <div className="flex flex-col justify-end space-y-1">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualForm.isNri}
                        onChange={(e) => setManualForm({ ...manualForm, isNri: e.target.checked })}
                      />
                      <span>NRI</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualForm.isOci}
                        onChange={(e) => setManualForm({ ...manualForm, isOci: e.target.checked })}
                      />
                      <span>OCI</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualForm.isFn}
                        onChange={(e) => setManualForm({ ...manualForm, isFn: e.target.checked })}
                      />
                      <span>FN</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualForm.isTfw}
                        onChange={(e) => setManualForm({ ...manualForm, isTfw: e.target.checked })}
                      />
                      <span>TFW</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition"
                  >
                    + Add to Staging Grid
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. Interactive Pre-Upload Staging Grid */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Grid Header & Batch Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Pre-Upload Staging Grid
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {stagedStudents.length} Records
                  </span>

                  {batchValidation.errorCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {batchValidation.errorCount} Invalid
                    </span>
                  )}

                  {batchValidation.validCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {batchValidation.validCount} Cleared
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review, edit, and fix errors before committing records to AICTE Central Repository.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {stagedStudents.length > 0 && (
                  <button
                    onClick={() => setStagedStudents([])}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Clear Staging
                  </button>
                )}

                <button
                  onClick={handleCommitBatch}
                  disabled={stagedStudents.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-md transition flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Commit Batch to AICTE Central Repository</span>
                </button>
              </div>
            </div>

            {/* Department Capacity Impact Bar */}
            {stagedStudents.length > 0 && (
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between gap-3">
                <span className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-300">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Projected Capacity Impact:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {Object.entries(batchValidation.capacityAudit).map(([branch, audit]) => {
                    const isOver = audit.excess > 0;
                    return (
                      <span key={branch} className={`px-2.5 py-1 rounded-md font-mono text-[11px] ${
                        isOver ? 'bg-red-200 text-red-900 font-bold animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {branch}: {audit.currentEnrolled} + {audit.incomingValid} = {audit.projectedTotal} / {audit.maxCapacity} Max
                        {isOver && ` (Over by +${audit.excess}!)`}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Staging Data Table */}
            {stagedStudents.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">No students currently staged.</p>
                <p className="text-xs mt-1">Upload a CSV or click "Load 5 Valid Students" above to simulate data ingestion.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Status & Rule Validation</th>
                      <th className="py-3 px-4">APAAR ID (12-Digit)</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Roll No</th>
                      <th className="py-3 px-4">Branch</th>
                      <th className="py-3 px-4">Category & Flags</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {batchValidation.records.map((student, idx) => {
                      const isEditing = editingIndex === idx;
                      const res = student.validationResult;
                      const hasErrors = !res.isValid;
                      const hasWarnings = res.warnings.length > 0;

                      return (
                        <tr 
                          key={idx}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                            hasErrors ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                          }`}
                        >
                          {/* Validation Status */}
                          <td className="py-3 px-4 align-top">
                            {hasErrors ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                                  <XCircle className="w-4 h-4 shrink-0" />
                                  Invalid Record
                                </span>
                                {res.errors.map((err, eIdx) => (
                                  <div key={eIdx} className="text-[10px] text-red-500 font-medium">
                                    • {err.title}: {err.description}
                                  </div>
                                ))}
                              </div>
                            ) : hasWarnings ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                                  <AlertTriangle className="w-4 h-4 shrink-0" />
                                  Warning / Advisory
                                </span>
                                {res.warnings.map((warn, wIdx) => (
                                  <div key={wIdx} className="text-[10px] text-amber-500 font-medium">
                                    • {warn.title}: {warn.description}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                Ready for Commit
                              </span>
                            )}
                          </td>

                          {/* APAAR ID */}
                          <td className="py-3 px-4 font-mono font-bold align-top">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.apaarId}
                                onChange={(e) => setEditFormData({ ...editFormData, apaarId: e.target.value })}
                                className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs w-32"
                              />
                            ) : (
                              <span className={hasErrors && res.errors.some(e => e.code.includes("APAAR")) ? "text-red-600 font-extrabold" : "text-slate-900 dark:text-white"}>
                                {formatApaar(student.apaarId) || "MISSING"}
                              </span>
                            )}
                          </td>

                          {/* Student Name */}
                          <td className="py-3 px-4 align-top font-semibold text-slate-800 dark:text-slate-200">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs w-32"
                              />
                            ) : (
                              student.name
                            )}
                          </td>

                          {/* Roll No */}
                          <td className="py-3 px-4 font-mono align-top text-slate-600 dark:text-slate-400">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.rollNo}
                                onChange={(e) => setEditFormData({ ...editFormData, rollNo: e.target.value })}
                                className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs w-24"
                              />
                            ) : (
                              student.rollNo
                            )}
                          </td>

                          {/* Branch Code */}
                          <td className="py-3 px-4 align-top font-bold text-blue-600 dark:text-blue-400">
                            {isEditing ? (
                              <select
                                value={editFormData.branchCode}
                                onChange={(e) => setEditFormData({ ...editFormData, branchCode: e.target.value })}
                                className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                              >
                                {(institution?.departments || []).map(d => (
                                  <option key={d.code} value={d.code}>{d.code}</option>
                                ))}
                              </select>
                            ) : (
                              student.branchCode
                            )}
                          </td>

                          {/* Category & Flags */}
                          <td className="py-3 px-4 align-top">
                            <div className="flex flex-wrap gap-1">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                {student.admissionCategory} {student.quotaCategory ? `(${student.quotaCategory})` : ""}
                              </span>
                              {student.isNri && <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700 font-semibold">NRI</span>}
                              {student.isFn && <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 font-semibold">FN</span>}
                              {student.isOci && <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-100 text-sky-700 font-semibold">OCI</span>}
                              {student.isTfw && <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-700 font-semibold">TFW</span>}
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveEdit(idx)}
                                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 mr-1"
                                title="Save changes"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(idx, student)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 mr-1"
                                title="Edit row"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteStagedRow(idx)}
                              className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200"
                              title="Delete row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 4. Enrolled Student Directory SubTab */}
      {activeSubTab === 'DIRECTORY' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Committed Student Registry ({filteredDirectory.length} Enrolled)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official students actively linked to their APAAR national academic identity.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search Field */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search APAAR / Name / Roll..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Categories</option>
                <option value="GENERAL">General</option>
                <option value="SUPERNUMERARY">Supernumerary (EWS/PMSSS)</option>
                <option value="NRI">NRI Quota</option>
                <option value="FN">Foreign Nationals</option>
                <option value="TFW">TFW</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">APAAR ID (National Key)</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Category Quota</th>
                  <th className="py-3 px-4">ABC Credits</th>
                  <th className="py-3 px-4">AICTE Seal Status</th>
                  <th className="py-3 px-4 text-right">Credentials</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDirectory.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      <Users className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-60" />
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
                        No Student Admissions Committed Yet
                      </span>
                      <span className="text-xs text-slate-400 max-w-md mx-auto block mt-1">
                        Use the Multi-Method Student Ingestion Studio to upload student admission batches via CSV, ERP API gateway, or manual student entry.
                      </span>
                    </td>
                  </tr>
                ) : (
                  filteredDirectory.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {formatApaar(student.apaarId)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {student.rollNo}
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">
                        {student.branchCode}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {student.admissionCategory} {student.quotaCategory ? `(${student.quotaCategory})` : ""}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {student.abcCredits || 78} Credits
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onViewCertificate(student)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold mr-1 transition"
                          title="Print Verifiable Degree Certificate with APAAR ID"
                        >
                          Degree Cert
                        </button>
                        <button
                          onClick={() => onViewApaarCard(student)}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-100 text-xs font-semibold transition"
                          title="View Official APAAR Digital Card"
                        >
                          APAAR Card
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

      {/* 5. Quota & Supernumerary Deep Monitor SubTab */}
      {activeSubTab === 'CAPACITY' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Institutional Intake & Supernumerary Quota Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                AICTE Regulation Bureau verified caps for Academic Session 2026-27.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-xs font-bold">
              Compliance Score: {institution?.complianceScore || 99}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(institution?.departments || []).map(dept => {
              const maxCap = dept.approvedIntake + dept.supernumerarySeats;
              return (
                <div key={dept.code} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {dept.name} ({dept.code})
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      Total Capacity: {maxCap}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Approved Intake</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">{dept.approvedIntake}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Supernumerary Cap</span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">+{dept.supernumerarySeats}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Seats Remaining</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{maxCap - dept.enrolledCount}</span>
                    </div>
                  </div>

                  {dept.categories && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 flex flex-wrap gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Category Breakdown:</span>
                      <span>General: {dept.categories.general}</span>
                      <span>• EWS: {dept.categories.ews}</span>
                      <span>• OBC: {dept.categories.obc}</span>
                      <span>• SC/ST: {dept.categories.scSt}</span>
                      <span>• NRI: {dept.categories.nri}</span>
                      <span>• FN: {dept.categories.fn}</span>
                      <span>• TFW: {dept.categories.tfw}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Intake Breach Warning Modal (Triggered if intake violated) */}
      {intakeBreachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-red-300 dark:border-red-800 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Intake Cap Breach Intercepted
                </h3>
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  Regulatory Submission Locked
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Admissions for Department <strong>{intakeBreachModal.department}</strong> exceed the approved ceiling.
            </p>

            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-xs space-y-1 font-mono">
              <div>Approved Ceiling: <span className="font-bold text-slate-900 dark:text-white">{intakeBreachModal.audit.maxCapacity} Seats</span></div>
              <div>Projected Total: <span className="font-bold text-red-600">{intakeBreachModal.audit.projectedTotal} Admissions</span></div>
              <div className="text-red-700 dark:text-red-300 font-bold">Excess Seats Identified: +{intakeBreachModal.audit.excess} Seats</div>
            </div>

            <p className="text-[11px] text-slate-500">
              Pursuant to AICTE Approval Process Handbook (APH) regulations, excess enrolments cannot be registered into the national repository without prior formal supernumerary seat allocation approval from the Regulation Bureau.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIntakeBreachModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
              >
                Dismiss & Correct Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Register New Institution Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Onboard AICTE Institution
                  </h3>
                  <p className="text-xs text-slate-500">
                    Register an approved institution profile into sovereign registry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Institution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., National Institute of Technology Karnataka"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Short Name / Acronym
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., NITK Surathkal"
                    value={registerForm.shortName}
                    onChange={(e) => setRegisterForm({ ...registerForm, shortName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIRF Rank
                  </label>
                  <input
                    type="number"
                    value={registerForm.nirfRank}
                    onChange={(e) => setRegisterForm({ ...registerForm, nirfRank: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={registerForm.state}
                    onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={registerForm.city}
                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Affiliation / University Body
                </label>
                <input
                  type="text"
                  value={registerForm.affiliation}
                  onChange={(e) => setRegisterForm({ ...registerForm, affiliation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Department Approved Intake Capacities:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500">CSE Intake</label>
                    <input
                      type="number"
                      value={registerForm.cseCap}
                      onChange={(e) => setRegisterForm({ ...registerForm, cseCap: e.target.value })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">AI & DS Intake</label>
                    <input
                      type="number"
                      value={registerForm.aidsCap}
                      onChange={(e) => setRegisterForm({ ...registerForm, aidsCap: e.target.value })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">ECE Intake</label>
                    <input
                      type="number"
                      value={registerForm.eceCap}
                      onChange={(e) => setRegisterForm({ ...registerForm, eceCap: e.target.value })}
                      className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isRegistering ? "Registering..." : "Onboard Institution Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
