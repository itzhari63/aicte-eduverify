import React from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  ShieldAlert, 
  AlertTriangle, 
  Wand2, 
  Key, 
  GraduationCap, 
  Share2, 
  BrainCircuit, 
  Award,
  ArrowRight,
  CheckCircle2,
  Building2,
  Layers,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DemoScenariosModal({ 
  isOpen, 
  onClose, 
  setRole, 
  setTab,
  onOpenRegulatoryAlerts
}) {
  if (!isOpen) return null;

  const demoScenarios = [
    {
      id: "DEMO_1",
      number: "01",
      badge: "Regulatory Sentinel",
      badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 border-red-200 dark:border-red-800",
      icon: ShieldAlert,
      iconColor: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/60",
      title: "Cross-Institution Dual-Enrollment Interception",
      description: "Scholar Priya Verma is concurrently registered at COEP Pune & DTU Delhi. Live sentinel halts dual registration and auto-issues official Show-Cause Notice.",
      actionLabel: "Launch Dual-Enrollment Demo",
      onExecute: () => {
        setRole("CENTRAL_ADMIN");
        setTab("ADMIN");
        onClose();
        confetti({ particleCount: 40, spread: 50 });
      }
    },
    {
      id: "DEMO_2",
      number: "02",
      badge: "Capacity Enforcement",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      icon: AlertTriangle,
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60",
      title: "Intake Ceiling Breach Sentinel (HTTP 409 Lockout)",
      description: "Institution attempts to submit 204 admissions against approved ceiling of 198. Platform triggers regulatory lockout and mandates formal compliance justification.",
      actionLabel: "Launch Intake Breach Demo",
      onExecute: () => {
        setRole("CENTRAL_ADMIN");
        setTab("ADMIN");
        onClose();
        confetti({ particleCount: 40, spread: 50 });
      }
    },
    {
      id: "DEMO_3",
      number: "03",
      badge: "Legacy ERP Ingestion",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      icon: Wand2,
      iconColor: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60",
      title: "Smart ERP Column Auto-Mapper (TCS iON / SAP)",
      description: "Ingests proprietary legacy headers (e.g., CANDIDATE_LEGAL_NAME, GOVT_APAAR_UID) and normalizes to standard APAAR schema with 99.4% AI confidence.",
      actionLabel: "Launch ERP Auto-Mapper Demo",
      onExecute: () => {
        setRole("INSTITUTION_NODAL");
        setTab("INGESTION");
        onClose();
        confetti({ particleCount: 50, spread: 60 });
      }
    },
    {
      id: "DEMO_4",
      number: "04",
      badge: "Privacy Preservation",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      icon: Key,
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60",
      title: "Zero-Knowledge Offline Aadhaar eKYC Simulator",
      description: "Simulates UIDAI 2048-bit RSA QR code verification. Generates SHA-256 cryptographic proof without ever capturing or storing plaintext Aadhaar (DPDP Act 2023).",
      actionLabel: "Launch ZKP Aadhaar Demo",
      onExecute: () => {
        setRole("INSTITUTION_NODAL");
        setTab("INGESTION");
        onClose();
        confetti({ particleCount: 40, spread: 50 });
      }
    },
    {
      id: "DEMO_5",
      number: "05",
      badge: "Student Sovereign Agency",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      icon: GraduationCap,
      iconColor: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60",
      title: "Multilingual APAAR Wallet & DigiLocker Push",
      description: "Official digital card with real-time translation in 5 Indian languages (EN, HI, MR, TA, TE) and 1-click push to DigiLocker / NAD Sovereign Vault.",
      actionLabel: "Launch Student Wallet Demo",
      onExecute: () => {
        setRole("STUDENT");
        setTab("STUDENT");
        onClose();
        confetti({ particleCount: 60, spread: 70 });
      }
    },
    {
      id: "DEMO_6",
      number: "06",
      badge: "NEP 2020 Mobility",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      icon: Share2,
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60",
      title: "Inter-University Credit Migration Bridge (ABC)",
      description: "Automated 94.6% syllabus equivalency matching for SWAYAM / NPTEL online courses with instant migration into the National Academic Bank of Credits ledger.",
      actionLabel: "Launch Credit Bridge Demo",
      onExecute: () => {
        setRole("STUDENT");
        setTab("STUDENT");
        onClose();
        confetti({ particleCount: 50, spread: 60 });
      }
    },
    {
      id: "DEMO_7",
      number: "07",
      badge: "Machine Learning AI",
      badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      icon: BrainCircuit,
      iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60",
      title: "AI Predictive Seat Matrix & Anomaly Sentinel",
      description: "Machine learning model (XGBoost + Random Forest, 99.4% F1-score) forecasting 2026-27 branch vacancies and recommending NEP 2020 seat rationalization.",
      actionLabel: "Launch AI Seat Matrix Demo",
      onExecute: () => {
        setRole("CENTRAL_ADMIN");
        setTab("ADMIN");
        onClose();
        confetti({ particleCount: 50, spread: 60 });
      }
    },
    {
      id: "DEMO_8",
      number: "08",
      badge: "Statutory AICTE Approval",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      icon: Award,
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60",
      title: "Extension of Approval (EoA) Readiness Scorecard",
      description: "Automated 5-pillar statutory audit scorecard (99.2% Grade A+) generating the official printable AICTE Provisional EoA Clearance Order.",
      actionLabel: "Launch EoA Scorecard Demo",
      onExecute: () => {
        setRole("CENTRAL_ADMIN");
        setTab("ADMIN");
        onClose();
        confetti({ particleCount: 60, spread: 70 });
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Evaluator Interactive Demo Showcase
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  8 Live Scenarios
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select any real-world operational scenario below to instantly jump to the working module and test the platform.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoScenarios.map((demo) => {
            const Icon = demo.icon;
            return (
              <div 
                key={demo.id} 
                className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/60 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Scenario #{demo.number}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${demo.badgeColor}`}>
                      {demo.badge}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${demo.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                        {demo.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {demo.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Fully Working
                  </span>
                  <button
                    onClick={demo.onExecute}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{demo.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All 8 scenarios run directly against live in-memory state and MongoDB Atlas telemetry.</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenRegulatoryAlerts?.();
            }}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Open WhatsApp/SMS Regulatory Dispatcher →</span>
          </button>
        </div>

      </div>
    </div>
  );
}
