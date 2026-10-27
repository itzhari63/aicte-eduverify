import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  GraduationCap, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  HelpCircle, 
  ChevronDown, 
  FileCheck, 
  Layers, 
  Activity,
  CheckCircle,
  AlertCircle,
  Database,
  MessageSquare,
  Smartphone,
  LogIn,
  LogOut,
  User,
  Lock,
  Sparkles,
  FileText,
  UploadCloud,
  QrCode
} from 'lucide-react';

export default function Header({ 
  currentRole, 
  setRole, 
  currentTab, 
  setTab, 
  darkMode, 
  setDarkMode, 
  onOpenProblemStatement,
  onOpenMongoModal,
  onOpenRegulatoryAlerts,
  activeAlertCount = 2,
  backendConnected = false,
  dbConnected = false,
  currentUser = null,
  onOpenLoginModal,
  onLogout
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roles = [
    {
      id: "CENTRAL_ADMIN",
      title: "AICTE Central Admin",
      subtitle: "Apex Regulation Bureau",
      icon: Building2,
      badge: "National Apex",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300"
    },
    {
      id: "INSTITUTION_NODAL",
      title: "Institution Nodal Officer",
      subtitle: "Institutional Portal & Ingestion",
      icon: Layers,
      badge: "Approved College",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
    },
    {
      id: "PUBLIC_VERIFIER",
      title: "Authorized Verifier",
      subtitle: "Employers & Background Verifiers",
      icon: UserCheck,
      badge: "Third-Party",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
    },
    {
      id: "STUDENT",
      title: "Student Portal",
      subtitle: "Digital Academic Identity & Consent",
      icon: GraduationCap,
      badge: "Self-Service",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
    }
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      {/* 1. National Tricolor & Official Government Banner */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />
      
      <div className="bg-slate-100/90 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800/60 text-[11px] py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              भारत सरकार | Government of India
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline font-medium">शिक्षा मंत्रालय | Ministry of Education</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline font-medium">अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
              Academic Cycle: 2026-27
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Portal Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTab("LANDING")}>
            {/* AICTE Emblem / Seal SVG */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white shadow-md shadow-blue-950/20 border border-blue-800/40">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  AICTE-<span className="text-blue-600 dark:text-blue-400">EduVerify</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-md">
                  APAAR Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                National Academic Identity & Institutional Intake Enforcement System
              </p>
            </div>
          </div>

          {/* Right Action Controls: Role Switcher, Notifications, Theme */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Authenticated User Session Pill OR Stakeholder Login Gateway */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Active Session Profile Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 transition text-left cursor-pointer"
                  >
                    {/* User Avatar / Initials */}
                    {currentUser.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name} 
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/40 shrink-0" 
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {currentUser.name?.charAt(0) || 'U'}
                      </div>
                    )}

                    <div className="hidden md:block">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span className="truncate max-w-[140px]">{currentUser.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="truncate max-w-[120px]">{currentUser.roleTitle}</span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 md:hidden" />
                  </button>

                  {/* Account Profile & Session Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-40 p-3 animate-in fade-in zoom-in-95 duration-150">
                        {/* Profile Header */}
                        <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                          {currentUser.avatar ? (
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/30" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                              {currentUser.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                              {currentUser.name}
                            </div>
                            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                              {currentUser.designation || currentUser.roleTitle}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {currentUser.email || currentUser.apaarId || currentUser.organization}
                            </div>
                          </div>
                        </div>

                        {/* Session Metadata */}
                        <div className="py-2.5 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                          <div className="flex justify-between items-center">
                            <span>Sovereign Role:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                              {currentUser.roleTitle}
                            </span>
                          </div>
                          {currentUser.organization && (
                            <div className="flex justify-between items-center">
                              <span>Organization:</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                                {currentUser.organization}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span>Security Clearance:</span>
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              {currentUser.securityLevel || 'AUTHENTICATED'}
                            </span>
                          </div>
                        </div>

                        {/* Account Actions */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              onOpenLoginModal?.(currentUser.role);
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Switch Account / Stakeholder</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              onLogout?.();
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200/80 dark:border-red-900/60 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                            <span>Sign Out of AICTE Portal</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Instant 1-Click Logout Button in Header Bar */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 rounded-xl border border-red-200/80 dark:border-red-800/60 transition text-xs font-bold cursor-pointer"
                  title="Sign Out of Session"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Guest Role Preview Switcher */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 transition text-left"
                    title="Select Stakeholder Preview"
                  >
                    <div className="p-1 rounded-lg bg-blue-600 text-white">
                      <currentRoleObj.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span>{currentRoleObj.title}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </button>

                  {/* Role Switcher Dropdown */}
                  {showRoleMenu && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowRoleMenu(false)} />
                      <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-40 p-2 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Select Stakeholder Portal to Access
                        </div>
                        <div className="mt-1 space-y-1">
                          {roles.map(role => {
                            const Icon = role.icon;
                            const isSelected = role.id === currentRole;
                            return (
                              <button
                                key={role.id}
                                onClick={() => {
                                  setRole(role.id);
                                  setShowRoleMenu(false);
                                  if (role.id === "CENTRAL_ADMIN") setTab("ADMIN");
                                  else if (role.id === "INSTITUTION_NODAL") setTab("INGESTION");
                                  else if (role.id === "PUBLIC_VERIFIER") setTab("VERIFIER");
                                  else if (role.id === "STUDENT") setTab("STUDENT");
                                }}
                                className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition ${
                                  isSelected 
                                    ? "bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900" 
                                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg mt-0.5 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                      {role.title}
                                    </span>
                                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${role.badgeColor}`}>
                                      {role.badge}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                    {role.subtitle}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Primary Stakeholder Login Trigger */}
                <button
                  onClick={() => onOpenLoginModal?.(currentRole)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white rounded-xl shadow-md text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer"
                  title="Authenticate into AICTE Stakeholder Portal"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Stakeholder Login</span>
                </button>
              </div>
            )}

            {/* WhatsApp & SMS Regulatory Dispatcher Trigger */}
            <button
              onClick={onOpenRegulatoryAlerts}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 transition text-xs font-bold"
              title="TRAI-Compliant WhatsApp & SMS Regulatory Dispatcher"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Regulatory Alerts</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                title="Regulatory Alerts"
              >
                <Bell className="w-5 h-5" />
                {activeAlertCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {activeAlertCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifMenu(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-40 p-3 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Live Regulatory Audit Alerts
                      </span>
                      <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">
                        {activeAlertCount} Active
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-2 max-h-72 overflow-y-auto">
                      {activeAlertCount === 0 ? (
                        <div className="py-6 text-center text-slate-500 space-y-2">
                          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Zero Regulatory Anomalies
                          </div>
                          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                            All student admissions and institutional intake ceilings are 100% compliant and verified.
                          </p>
                        </div>
                      ) : (
                        <div className="py-2.5 flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-200">
                              Active Regulatory Conflict Detected
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {activeAlertCount} student admissions flagged for cross-institution duplicate enrollment.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <button
                        onClick={() => {
                          setShowNotifMenu(false);
                          onOpenRegulatoryAlerts?.();
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Dispatch WhatsApp / SMS Notice</span>
                      </button>

                      <button
                        onClick={() => {
                          setTab("AUDIT");
                          setShowNotifMenu(false);
                        }}
                        className="w-full py-1 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline block"
                      >
                        View Immutable Audit Logs →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>


            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

          </div>
        </div>
      </div>

      {/* 3. Horizontal Navigation Ribbon */}
      <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5">
          {[
            { id: "DASHBOARD", label: "Regulatory Dashboard", icon: ShieldCheck, badge: "Apex" },
            { id: "INSTITUTIONS", label: "Institution Directory", icon: Building2 },
            { id: "RECORDS", label: "Student Records & Audit", icon: FileText, badge: "Audited" },
            { id: "BATCH_IMPORT", label: "Batch Ingestion Engine", icon: UploadCloud, badge: "CSV" },
            { id: "VERIFY", label: "Instant Public Verify", icon: QrCode, badge: "No Auth" },
            { id: "LANDING", label: "Public Search Hub", icon: Search },
            { id: "ADMIN", label: "AICTE Apex Command", icon: Building2, badge: "National" },
            { id: "INGESTION", label: "Institution Studio", icon: Layers, badge: "Nodal" },
            { id: "VERIFIER", label: "Authorized Verifier", icon: UserCheck },
            { id: "CERTIFICATE", label: "Degree Engine", icon: FileCheck },
            { id: "STUDENT", label: "Student Dossier & Consent", icon: GraduationCap },
            { id: "AUDIT", label: "Audit Trail & Logs", icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-900 text-white shadow-sm dark:bg-blue-600"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                    isActive 
                      ? "bg-blue-800 text-blue-200 dark:bg-blue-700" 
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
