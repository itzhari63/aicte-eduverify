import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Building2, 
  Award, 
  Database, 
  QrCode, 
  Lock, 
  Layers, 
  Zap,
  Sparkles,
  ExternalLink,
  Users,
  AlertCircle
} from 'lucide-react';
import { formatApaar, cleanApaar } from '../data/validationEngine';
import { api } from '../services/api';

export default function LandingHub({ students, institutions = [], setTab, setRole, onVerifySelect, onOpenDemoModal }) {
  const totalApproved = (institutions || []).reduce((sum, inst) => 
    sum + (inst.departments?.reduce((deptSum, d) => deptSum + (d.approvedIntake || 0) + (d.supernumerarySeats || 0), 0) || 0), 0
  ) || 0;
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showAbcDetails, setShowAbcDetails] = useState(false);

  useEffect(() => {
    if (searchResult && searchResult.status !== 'NOT_FOUND') {
      const payload = JSON.stringify({
        apaar: searchResult.apaarId,
        name: searchResult.name,
        inst: searchResult.institutionName,
        roll: searchResult.rollNo,
        status: searchResult.status,
        hash: searchResult.hash || "sha256-verified"
      });
      QRCode.toDataURL(payload, { width: 140, margin: 1 })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [searchResult]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    const raw = cleanApaar(searchInput);
    setHasSearched(true);

    if (!raw) {
      setSearchResult(null);
      return;
    }

    const found = students.find(s => cleanApaar(s.apaarId) === raw);
    if (found) {
      setSearchResult(found);
      return;
    }

    try {
      const liveRes = await api.verifyApaar(raw);
      if (liveRes && liveRes.verifiableCredential) {
        const sub = liveRes.verifiableCredential.credentialSubject;
        setSearchResult({
          apaarId: sub.apaarId,
          name: sub.studentName,
          gender: sub.gender,
          dob: sub.dob,
          rollNo: sub.institutionalRollNo,
          institutionName: sub.institutionName,
          branchName: sub.programme,
          status: liveRes.status,
          abcId: sub.abcAccountId,
          abcCredits: sub.earnedCredits,
          cgpa: sub.cgpa,
          hash: liveRes.verifiableCredential.proof?.proofValue,
          conflictWith: liveRes.conflictNotice
        });
        return;
      }
    } catch {}

    setSearchResult({
      apaarId: raw,
      name: "Unregistered Candidate",
      status: "NOT_FOUND",
      error: "No enrolled student record found with this APAAR ID in AICTE National Academic Registry."
    });
  };

  const displayStudent = searchResult;

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Hero Section with National Academic Depository Backdrop */}
      <section className="relative overflow-hidden pt-8 pb-12 rounded-3xl bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white shadow-2xl border border-blue-900/40">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>National Education Policy 2020 • One Nation One Student ID</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            One Nation, One Academic Identity for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">Technical Education</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Bridging the gap between AICTE macro-intake approvals and micro-level student enrolments through India's sovereign academic identifier: <strong>APAAR ID</strong>.
          </p>

          {/* Quick Verification Search Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl">
              <div className="absolute left-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter 12-Digit APAAR ID (e.g., 1234-5678-9012) or Scan QR..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base backdrop-blur-md font-mono"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg flex items-center gap-1.5"
              >
                <span>Verify Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct sovereign credential verification against AICTE National Academic Registry</span>
            </div>

            {/* 1-Click Demo Search Presets */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Demo Presets:
              </span>

              {[
                { label: "Aditi Sharma (Verified Scholar)", apaar: "9823-4512-8831", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30" },
                { label: "Priya Verma (Duplicate Flagged)", apaar: "6521-4402-9918", badge: "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30" },
                { label: "Ananya Sundaram (AI&DS 9.45 CGPA)", apaar: "7234-8891-0192", badge: "bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30" },
                { label: "Rohan Patel (OBC Merit)", apaar: "8145-9201-3342", badge: "bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30" },
                { label: "Unregistered (404 Sentinel)", apaar: "1111-2222-3333", badge: "bg-slate-500/20 text-slate-300 border-slate-500/40 hover:bg-slate-500/30" }
              ].map(preset => (
                <button
                  key={preset.apaar}
                  type="button"
                  onClick={() => {
                    setSearchInput(preset.apaar);
                    const raw = cleanApaar(preset.apaar);
                    setHasSearched(true);
                    const found = students.find(s => cleanApaar(s.apaarId) === raw);
                    if (found) {
                      setSearchResult(found);
                    } else {
                      setSearchResult({
                        apaarId: raw,
                        name: "Unregistered Candidate",
                        status: "NOT_FOUND",
                        error: "No enrolled student record found with this APAAR ID in AICTE National Academic Registry."
                      });
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm ${preset.badge}`}
                >
                  {preset.label}
                </button>
              ))}

              {onOpenDemoModal && (
                <button
                  type="button"
                  onClick={onOpenDemoModal}
                  className="px-2.5 py-1 rounded-lg border border-amber-400 bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 text-[11px] font-bold transition hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>All 8 Demos →</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Verification Result Card Showcase */}
          <div className="pt-6 max-w-2xl mx-auto text-left">
            {displayStudent && displayStudent.status === "NOT_FOUND" ? (
              <div className="p-6 rounded-2xl bg-red-950/40 border border-red-800 text-white backdrop-blur-md animate-in fade-in zoom-in-95">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-300">Unregistered / Invalid Academic Identity</h3>
                    <p className="text-xs text-red-200/80 mt-1">
                      APAAR ID <span className="font-mono font-bold text-white">{displayStudent.apaarId}</span> was not found in the AICTE National Database.
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Please verify with the issuing degree institution or check if the admission submission cycle has been formally committed.
                    </p>
                  </div>
                </div>
              </div>
            ) : displayStudent ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-white/10 dark:bg-slate-900/90 border border-white/20 dark:border-slate-800 text-white backdrop-blur-md shadow-2xl transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
                      {displayStudent.name ? displayStudent.name.charAt(0) : "S"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-extrabold text-white">
                          {displayStudent.name}
                        </h3>
                        {displayStudent.status === "VERIFIED" ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            AICTE Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Duplicate Flagged
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        APAAR ID: <span className="text-amber-400 font-bold">{formatApaar(displayStudent.apaarId)}</span>
                      </div>
                    </div>
                  </div>

                  {qrDataUrl && (
                    <div className="flex items-center gap-2 self-end sm:self-center bg-white p-1 rounded-lg shadow-sm">
                      <img src={qrDataUrl} alt="Verification QR" className="w-14 h-14" />
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Institution</span>
                    <span className="font-semibold text-white truncate block" title={displayStudent.institutionName}>
                      {displayStudent.institutionName}
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono">ID: {displayStudent.institutionId}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Branch / Programme</span>
                    <span className="font-semibold text-white">
                      {displayStudent.branchName || displayStudent.branchCode}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Roll / Register No</span>
                    <span className="font-mono font-semibold text-amber-300">
                      {displayStudent.rollNo}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Admission Category</span>
                    <span className="font-medium text-slate-200">
                      {displayStudent.admissionCategory} {displayStudent.quotaCategory ? `(${displayStudent.quotaCategory})` : ""}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Academic Session</span>
                    <span className="font-medium text-slate-200">
                      {displayStudent.admissionYear || 2026}-27 (Active)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">ABC Bank Handshake</span>
                    <button 
                      onClick={() => setShowAbcDetails(!showAbcDetails)}
                      className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>{displayStudent.abcCredits || 78} Credits</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Dual Enrolment Alert Notice if Flagged */}
                {displayStudent.status === "FLAGGED_DUPLICATE" && displayStudent.conflictWith && (
                  <div className="p-3 bg-red-950/70 border border-red-700 rounded-xl my-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-red-300">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      Cross-Institution Conflict Detected
                    </div>
                    <p className="text-slate-300 mt-1">
                      This APAAR ID is simultaneously registered at: <strong>{displayStudent.conflictWith.institutionName}</strong> ({displayStudent.conflictWith.branchName}).
                    </p>
                  </div>
                )}

                {/* ABC Drawer */}
                {showAbcDetails && (
                  <div className="p-3 bg-slate-800/80 rounded-xl my-2 border border-slate-700 text-xs text-slate-300 space-y-1 animate-in fade-in">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Database className="w-4 h-4" />
                      Academic Bank of Credits (ABC) Record:
                    </div>
                    <div>ABC Account ID: <span className="font-mono text-white">{displayStudent.abcId || "ABC-7892-1049-8831"}</span></div>
                    <div>Accumulated Earned Credits: <span className="font-bold text-emerald-400">{displayStudent.abcCredits || 78} Credits</span></div>
                    <div>Cumulative GPA: <span className="font-bold text-white">{displayStudent.cgpa || "9.24"}</span></div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-white/10 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-[10px]">Tamper-Proof SHA-256 Ledger Sealed</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setRole("PUBLIC_VERIFIER");
                        setTab("VERIFIER");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                    >
                      Open Full Verifier Dossier
                    </button>
                    <button
                      onClick={() => {
                        setTab("CERTIFICATE");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition"
                    >
                      View APAAR Certificate
                    </button>
                  </div>
                </div>
              </div>
            ) : !hasSearched ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Real-Time Sovereign Credential Verification</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Enter any 12-digit APAAR ID above to retrieve authenticated academic records.</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

        </div>
      </section>

      {/* 2. Key National Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              label: "Total Approved Intake", 
              value: totalApproved > 0 ? totalApproved.toLocaleString('en-IN') : "0", 
              subtext: `Sanctioned Across ${institutions?.length || 0} Registered Institutions`, 
              icon: Building2, 
              color: "text-blue-600 dark:text-blue-400" 
            },
            { 
              label: "Verified APAAR Enrolments", 
              value: students.filter(s => s.status === 'VERIFIED').length.toLocaleString('en-IN'), 
              subtext: students.length > 0 ? `${((students.filter(s => s.status === 'VERIFIED').length / students.length) * 100).toFixed(1)}% Verified Rate` : "0 Live Admissions Ingested", 
              icon: Users, 
              color: "text-emerald-600 dark:text-emerald-400" 
            },
            { 
              label: "Duplicate Enrolments Prevented", 
              value: students.filter(s => s.status === 'FLAGGED_DUPLICATE').length.toLocaleString('en-IN'), 
              subtext: "Real-time Multi-College Interceptions", 
              icon: AlertTriangle, 
              color: "text-red-500" 
            },
            { 
              label: "Digital Credentials Issued", 
              value: students.filter(s => s.status === 'VERIFIED').length.toLocaleString('en-IN'), 
              subtext: "QR Verifiable Degrees Sealed", 
              icon: Award, 
              color: "text-amber-500" 
            }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{stat.label}</span>
                  <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.subtext}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 4 Core Pillars of APAAR-Based Governance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            System Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Engineered for Sovereign Data Integrity
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Solving the core challenges of AICTE Regulation Bureau through automated validation, tamper-evident records, and macro intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "APAAR Primary Anchor",
              desc: "Mandatory 12-digit One Nation One Student ID replaces fragmented roll numbers, establishing a continuous digital trail across schools, polytechnics, and universities.",
              icon: ShieldCheck,
              cta: "Test Ingestion",
              action: () => { setRole("INSTITUTION_NODAL"); setTab("INGESTION"); }
            },
            {
              title: "Intake Cap Enforcer",
              desc: "Automated calculations guard (Approved Intake + Supernumerary Seats). Prevents backchannel over-admissions with hard regulatory submission locks.",
              icon: Layers,
              cta: "View Quota Monitor",
              action: () => { setRole("INSTITUTION_NODAL"); setTab("INGESTION"); }
            },
            {
              title: "Cross-Institute Sentinel",
              desc: "National registry scans catch students claiming simultaneous admissions across different colleges or states for seat blocking or double benefit.",
              icon: Zap,
              cta: "Open AICTE Command",
              action: () => { setRole("CENTRAL_ADMIN"); setTab("ADMIN"); }
            },
            {
              title: "Verifiable Certificates",
              desc: "Institutions issue degree certificates displaying APAAR ID side-by-side with student roll number, verified via cryptographic QR code.",
              icon: Award,
              cta: "Generate Certificate",
              action: () => { setTab("CERTIFICATE"); }
            }
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx} 
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <button
                  onClick={pillar.action}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <span>{pillar.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Role Action Jump Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl border border-blue-900/40">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                AICTE Sovereign Depository Gateways
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                Integrated National Academic Governance
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Dedicated interfaces for regulatory administration, institutional intake submissions, and authorized credential authentication.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => { setRole("CENTRAL_ADMIN"); setTab("ADMIN"); }}
                className="px-4 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition shadow-md flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-blue-900" />
                <span>AICTE Central Command</span>
              </button>

              <button
                onClick={() => { setRole("INSTITUTION_NODAL"); setTab("INGESTION"); }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition shadow-md flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-amber-300" />
                <span>Institution Ingestion Studio</span>
              </button>

              <button
                onClick={() => { setRole("STUDENT"); setTab("STUDENT"); }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs hover:bg-slate-700 transition flex items-center gap-2"
              >
                <span>Student Identity Card</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
