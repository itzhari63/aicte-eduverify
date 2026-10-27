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
  Sparkles
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
  onOpenDemoModal,
  activeAlertCount = 2,
  backendConnected = false,
  dbConnected = false
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

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
            
            {/* Role Switcher Gateway */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 transition text-left"
              >
                <div className="p-1 rounded-lg bg-blue-600 text-white">
                  <currentRoleObj.icon className="w-4 h-4" />
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    {currentRoleObj.title}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                    {currentRoleObj.subtitle}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 md:hidden" />
              </button>

              {/* Role Switcher Dropdown */}
              {showRoleMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowRoleMenu(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-40 p-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Select Authorized Stakeholder Role
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
                              // Auto switch to role's primary view
                              if (role.id === "CENTRAL_ADMIN") setTab("ADMIN");
                              else if (role.id === "INSTITUTION_NODAL") setTab("INGESTION");
                              else if (role.id === "PUBLIC_VERIFIER") setTab("VERIFIER");
                              else if (role.id === "STUDENT") setTab("STUDENT");
                            }}
                            className={`w-full text-left p-2.5 rounded-lg flex items-start gap-3 transition ${
                              isSelected 
                                ? "bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900" 
                                : "hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg mt-0.5 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                  {role.title}
                                </span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${role.badgeColor}`}>
                                  {role.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
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

            {/* Evaluator Live Demos Launcher */}
            <button
              onClick={onOpenDemoModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-xl font-extrabold text-xs shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
              title="Open Interactive Evaluator Demo Hub (8 Live Scenarios)"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>Live Demos</span>
            </button>

            {/* WhatsApp & SMS Regulatory Dispatcher Trigger */}
            <button
              onClick={onOpenRegulatoryAlerts}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 transition text-xs font-bold"
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
            { id: "LANDING", label: "Public Hub & Search", icon: Search },
            { id: "ADMIN", label: "AICTE Apex Command", icon: Building2, badge: "National" },
            { id: "INGESTION", label: "Institution Ingestion Studio", icon: Layers, badge: "Nodal" },
            { id: "VERIFIER", label: "Authorized Verifier", icon: UserCheck },
            { id: "CERTIFICATE", label: "Degree & Certificate Engine", icon: FileCheck },
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
