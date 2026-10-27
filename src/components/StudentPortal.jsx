import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  ShieldCheck, 
  Database, 
  Lock, 
  Unlock, 
  Eye, 
  Download, 
  FileCheck, 
  CheckCircle2, 
  Building2, 
  QrCode, 
  Clock, 
  Award,
  Sparkles,
  Search,
  LogOut,
  AlertCircle,
  Globe,
  Share2,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Check,
  X
} from 'lucide-react';
import { formatApaar } from '../data/validationEngine';

const CARD_TRANSLATIONS = {
  EN: {
    gov: "GOVERNMENT OF INDIA",
    moe: "Ministry of Education",
    cardTitle: "APAAR CARD",
    nameLabel: "Student Name",
    dobLabel: "DOB / Gender",
    rollLabel: "Institutional Roll No",
    instLabel: "Institution",
    apaarTitle: "Automated Permanent Academic Account Registry (APAAR ID)",
    footer: "One Nation • One Student ID"
  },
  HI: {
    gov: "भारत सरकार",
    moe: "शिक्षा मंत्रालय",
    cardTitle: "अपार कार्ड",
    nameLabel: "विद्यार्थी का नाम",
    dobLabel: "जन्म तिथि / लिंग",
    rollLabel: "संस्थान अनुक्रमांक",
    instLabel: "शिक्षण संस्थान",
    apaarTitle: "स्वचालित स्थायी शैक्षणिक खाता रजिस्ट्री (अपार आईडी)",
    footer: "एक राष्ट्र • एक छात्र पहचान"
  },
  MR: {
    gov: "भारत सरकार",
    moe: "शिक्षण मंत्रालय",
    cardTitle: "अपार कार्ड",
    nameLabel: "विद्यार्थ्याचे नाव",
    dobLabel: "जन्मतारीख / लिंग",
    rollLabel: "संस्थात्मक हजेरी क्रमांक",
    instLabel: "संस्था",
    apaarTitle: "स्वयंचलित कायमस्वरूपी शैक्षणिक खाते नोंदवही (अपार आयडी)",
    footer: "एक राष्ट्र • एक विद्यार्थी ओळख"
  },
  TA: {
    gov: "இந்திய அரசு",
    moe: "கல்வி அமைச்சகம்",
    cardTitle: "அபார் அட்டை",
    nameLabel: "மாணவர் பெயர்",
    dobLabel: "பிறந்த தேதி / பாலினம்",
    rollLabel: "நிறுவன பதிவு எண்",
    instLabel: "கல்வி நிறுவனம்",
    apaarTitle: "தானியங்கி நிரந்தர கல்வி கணக்கு பதிவேடு (அபார் ஐடி)",
    footer: "ஒரே தேசம் • ஒரே மாணவர் அடையாளம்"
  },
  TE: {
    gov: "భారత ప్రభుత్వం",
    moe: "విద్యా మంత్రిత్వ శాఖ",
    cardTitle: "అపార్ కార్డ్",
    nameLabel: "విద్యార్థి పేరు",
    dobLabel: "పుట్టిన తేదీ / లింగం",
    rollLabel: "సంస్థాగత రోల్ నంబర్",
    instLabel: "విద్యా సంస్థ",
    apaarTitle: "ఆటోమేటెడ్ పర్మనెంట్ అకడమిక్ అకౌంట్ రిజిస్ట్రీ (అపార్ ఐడీ)",
    footer: "ఒకే దేశం • ఒకే విద్యార్థి గుర్తింపు"
  }
};

export default function StudentPortal({ 
  student, 
  onSelectStudent, 
  allStudents = [], 
  onViewCertificate 
}) {
  const [qrUrl, setQrUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Feature 2: Multilingual Card State
  const [cardLang, setCardLang] = useState('EN');
  const [isDigiLockerModalOpen, setIsDigiLockerModalOpen] = useState(false);
  const [isDigiLockerSyncing, setIsDigiLockerSyncing] = useState(false);
  const [isDigiLockerSynced, setIsDigiLockerSynced] = useState(false);

  // Feature 3: Inter-University Credit Transfer Bridge State
  const [isCreditTransferModalOpen, setIsCreditTransferModalOpen] = useState(false);
  const [creditSource, setCreditSource] = useState('SWAYAM');
  const [selectedCourse, setSelectedCourse] = useState('CS-NPTEL-304');
  const [bonusCredits, setBonusCredits] = useState(0);
  const [isTransferringCredits, setIsTransferringCredits] = useState(false);
  const [transferredCourses, setTransferredCourses] = useState([]);

  // Consent Management State (DPDP Act 2023)
  const [consents, setConsents] = useState([
    {
      id: "CON-01",
      orgName: "Tata Consultancy Services (TCS Campus Hiring)",
      purpose: "Employment Background Degree Verification",
      grantedAt: "2026-08-14T09:30:00Z",
      expiresAt: "2026-11-14T09:30:00Z",
      status: true
    },
    {
      id: "CON-02",
      orgName: "US-India Educational Foundation (USIEF)",
      purpose: "Fulbright Higher Education Academic Evaluation",
      grantedAt: "2026-08-01T12:00:00Z",
      expiresAt: "2026-12-31T23:59:59Z",
      status: true
    },
    {
      id: "CON-03",
      orgName: "Wipro Global Tech Verification",
      purpose: "Pre-Onboarding Credential Validation",
      grantedAt: "2026-08-20T15:10:00Z",
      expiresAt: "2026-09-20T15:10:00Z",
      status: false
    }
  ]);

  const toggleConsent = (id) => {
    setConsents(consents.map(c => c.id === id ? { ...c, status: !c.status } : c));
  };

  const handleAuthenticate = (e) => {
    e?.preventDefault();
    setAuthError('');
    const cleanQuery = searchQuery.trim().replace(/[-\s]/g, '').toLowerCase();
    if (!cleanQuery) {
      setAuthError('Please enter a 12-digit APAAR ID or Institutional Roll Number.');
      return;
    }

    const match = allStudents.find(s => {
      const cleanApaar = (s.apaarId || '').replace(/[-\s]/g, '').toLowerCase();
      const cleanRoll = (s.rollNo || '').replace(/[-\s]/g, '').toLowerCase();
      const cleanName = (s.name || '').toLowerCase();
      return cleanApaar === cleanQuery || cleanRoll === cleanQuery || cleanName.includes(cleanQuery);
    });

    if (match) {
      onSelectStudent(match);
      setSearchQuery('');
    } else {
      setAuthError(`No student record found matching "${searchQuery}". Verify the APAAR ID or select an enrolled student record below.`);
    }
  };

  useEffect(() => {
    if (student) {
      QRCode.toDataURL(`https://aicte.gov.in/apaar/verify/${student.apaarId}`, {
        width: 130,
        margin: 1,
        color: { dark: '#0a2540', light: '#ffffff' }
      })
      .then(url => setQrUrl(url))
      .catch(err => console.error(err));
    }
  }, [student]);

  // Feature 2: DigiLocker Push Handler
  const handlePushToDigiLocker = () => {
    setIsDigiLockerSyncing(true);
    setTimeout(() => {
      setIsDigiLockerSyncing(false);
      setIsDigiLockerSynced(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }, 1200);
  };

  // Feature 3: Inter-University Transfer Approval
  const handleAuthorizeCreditTransfer = () => {
    setIsTransferringCredits(true);
    setTimeout(() => {
      setIsTransferringCredits(false);
      setBonusCredits(prev => prev + 4);
      setTransferredCourses(prev => [
        {
          course: selectedCourse === 'CS-NPTEL-304' ? "Cloud Computing & Distributed Systems (NPTEL)" : "Deep Learning & Generative AI",
          code: selectedCourse,
          credits: 4,
          sem: "SWAYAM Credit Migration",
          grade: "Elite+Gold (92%)"
        },
        ...prev
      ]);
      setIsCreditTransferModalOpen(false);
      confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
    }, 1000);
  };

  const t = CARD_TRANSLATIONS[cardLang] || CARD_TRANSLATIONS.EN;

  if (!student) {
    return (
      <div className="space-y-8 pb-16">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                National Student Academic Identity Portal
              </span>
              <span className="text-xs text-slate-500">Ministry of Education • AICTE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Student Identity & Academic Credit Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Authenticate using your 12-digit sovereign APAAR ID or select your enrolled student record to manage digital credentials, ABC ledger, and consent permissions.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-900 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Sovereign Student Identity Authentication
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Automated Permanent Academic Account Registry (One Nation, One Student ID)
            </p>
          </div>

          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Enter Sovereign 12-Digit APAAR ID or Institutional Roll Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setAuthError(''); }}
                  placeholder="e.g. 1234-5678-9012 or ROLL-2026-001"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm font-mono focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-slate-900 dark:text-white"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Authenticate & Access Student Ledger</span>
            </button>
          </form>

          {allStudents.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block text-center">
                — Or select an enrolled record from institution admissions registry —
              </span>
              <div className="relative">
                <select
                  onChange={(e) => {
                    const s = allStudents.find(item => item.id === e.target.value);
                    if (s) onSelectStudent(s);
                  }}
                  defaultValue=""
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                >
                  <option value="" disabled>Select Student Record to Authenticate...</option>
                  {allStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.branchCode}) • Roll: {s.rollNo} • APAAR: {formatApaar(s.apaarId)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const totalDisplayCredits = (student.abcCredits || 84) + bonusCredits;

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header with Actions */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              Student Self-Service Portal
            </span>
            <span className="text-xs text-slate-500">One Nation, One Academic Identity</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Welcome, {student.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your sovereign APAAR academic identifier, view earned ABC credits, and govern third-party data sharing consents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectStudent && onSelectStudent(null)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Student</span>
          </button>

          <button
            onClick={() => onViewCertificate(student)}
            className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Generate Official Degree Certificate</span>
          </button>
        </div>
      </div>

      {/* 2. Top Grid: Digital APAAR Card & ABC Credit Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* OFFICIAL DIGITAL APAAR ID CARD WITH MULTILINGUAL CONTROLS */}
        <div className="space-y-3">
          
          {/* Feature 2: Multilingual Selector Bar */}
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              Sovereign Card Language:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
              {[
                { code: 'EN', label: 'English' },
                { code: 'HI', label: 'हिन्दी' },
                { code: 'MR', label: 'मराठी' },
                { code: 'TA', label: 'தமிழ்' },
                { code: 'TE', label: 'తెలుగు' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setCardLang(lang.code)}
                  className={`px-2 py-0.5 rounded-md transition ${
                    cardLang === lang.code 
                      ? 'bg-blue-900 text-white dark:bg-blue-600 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl border border-blue-900/50 space-y-4 relative overflow-hidden">
            
            {/* Subtle security background watermark */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Card Top Flag Stripe & Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                  🇮🇳
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
                    {t.gov}
                  </div>
                  <div className="text-xs font-bold text-white">
                    {t.moe}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {t.cardTitle}
              </span>
            </div>

            {/* Student Avatar, APAAR ID & Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2">
              <div className="w-24 h-28 rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 border-2 border-amber-400/80 p-1 flex flex-col items-center justify-center text-center shadow-md shrink-0">
                <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center text-xl font-bold">
                  {student.name.charAt(0)}
                </div>
                <span className="text-[8px] font-mono text-amber-300 mt-1 uppercase font-bold">AICTE SEALED</span>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.nameLabel}</span>
                  <span className="text-base font-extrabold text-white block">{student.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.dobLabel}</span>
                    <span className="font-semibold text-slate-200">{student.dob} • {student.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.rollLabel}</span>
                    <span className="font-mono font-semibold text-amber-300">{student.rollNo}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">{t.instLabel}</span>
                  <span className="text-xs font-semibold text-slate-200 block truncate" title={student.institutionName}>
                    {student.institutionName}
                  </span>
                </div>
              </div>

              {qrUrl && (
                <div className="bg-white p-1 rounded-lg shrink-0 shadow">
                  <img src={qrUrl} alt="APAAR QR" className="w-16 h-16" />
                </div>
              )}
            </div>

            {/* Large APAAR ID Display Bar */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center font-mono">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest block font-sans font-bold">
                {t.apaarTitle}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-widest text-white mt-0.5 inline-block">
                {formatApaar(student.apaarId)}
              </span>
            </div>

            {/* Footer Card Ribbon */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
              <span>{t.footer}</span>
              <span className="font-mono text-emerald-400">ABC-ID: {student.abcId || "ABC-7892-1049-8831"}</span>
              <span className="text-amber-300 font-semibold">{isDigiLockerSynced ? "DigiLocker Synced ✓" : "Vault Ready"}</span>
            </div>
          </div>

          {/* Feature 2: DigiLocker Push Button */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                DL
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  DigiLocker & National Academic Depository (NAD)
                </span>
                <span className="text-[10px] text-slate-400">
                  {isDigiLockerSynced ? "Sovereign Document Anchored #DL-APAAR-2026-98234" : "Sync tamper-proof APAAR credential to your citizen locker"}
                </span>
              </div>
            </div>

            <button
              onClick={handlePushToDigiLocker}
              disabled={isDigiLockerSyncing || isDigiLockerSynced}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isDigiLockerSynced 
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-blue-900 hover:bg-blue-800 text-white shadow-xs"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isDigiLockerSyncing ? "Syncing..." : isDigiLockerSynced ? "Synced in DigiLocker ✓" : "Push to DigiLocker"}</span>
            </button>
          </div>

        </div>

        {/* ACADEMIC BANK OF CREDITS (ABC) WALLET WITH SWAYAM TRANSFER BRIDGE */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Academic Bank of Credits (ABC) Ledger
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              Active Deposit
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold block">Total Accumulated Credits</span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {totalDisplayCredits}
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 block">Towards 160 Credit Degree Threshold</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
              <span className="text-xs text-blue-800 dark:text-blue-300 font-semibold block">Cumulative GPA</span>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {student.cgpa || "9.24"}
              </div>
              <span className="text-[10px] text-blue-700 dark:text-blue-400 mt-1 block">First Class with Distinction</span>
            </div>
          </div>

          {/* Feature 3: Action to Initiate Inter-University / SWAYAM Credit Transfer */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200 block">
                NEP 2020 Inter-College Credit Mobility Bridge
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-300/80">
                Migrate validated credits from SWAYAM, NPTEL, or previous university.
              </span>
            </div>

            <button
              onClick={() => setIsCreditTransferModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition shrink-0 cursor-pointer shadow-xs"
            >
              + Transfer Credits
            </button>
          </div>

          {/* Credit Subject Breakdown */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Verified Credit Deposits:</span>
            
            {/* Newly Transferred Courses */}
            {transferredCourses.map((c, idx) => (
              <div key={`trans-${idx}`} className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {c.course}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">{c.code} • {c.sem}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{c.credits} Credits</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">{c.grade}</span>
                </div>
              </div>
            ))}

            {[
              { course: "Data Structures & Algorithms", code: "CS201", credits: 4, sem: "Sem III", grade: "A+" },
              { course: "Computer Networks & Security", code: "CS204", credits: 4, sem: "Sem IV", grade: "O" },
              { course: "Database Management Systems", code: "CS206", credits: 4, sem: "Sem IV", grade: "A+" },
              { course: "Design & Analysis of Algorithms", code: "CS301", credits: 4, sem: "Sem V", grade: "O" }
            ].map((c, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.course}</span>
                  <span className="text-[10px] text-slate-400 block">{c.code} • {c.sem}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">{c.credits} Credits</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">Grade: {c.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Consent Management Desk (DPDP Act 2023 Compliance) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Data Consent & Verification Access Governance
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Governed under the Digital Personal Data Protection (DPDP) Act 2023. You have sovereign control over which entities can verify your APAAR academic records.
            </p>
          </div>

          <span className="text-[10px] px-2.5 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
            Sovereign Consent Active
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {consents.map(consent => (
            <div key={consent.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {consent.orgName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    consent.status 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'
                  }`}>
                    {consent.status ? "Authorized Access" : "Access Revoked"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Purpose: {consent.purpose}</p>
                <div className="text-[10px] text-slate-400 flex items-center gap-3">
                  <span>Granted: {new Date(consent.grantedAt).toLocaleDateString()}</span>
                  <span>Expires: {new Date(consent.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => toggleConsent(consent.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  consent.status
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-300 hover:bg-red-100'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                {consent.status ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{consent.status ? "Revoke Access" : "Grant Access"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 3 Modal: Inter-University Credit Transfer Bridge */}
      {isCreditTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Inter-University Credit Migration Desk
                </h3>
              </div>
              <button 
                onClick={() => setIsCreditTransferModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Under NEP 2020 Multiple Entry/Exit & ABC Framework, select an external accredited MOOC or migrated institute course to credit to your sovereign record.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Accredited Source Platform:
                </label>
                <select 
                  value={creditSource}
                  onChange={(e) => setCreditSource(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="SWAYAM">SWAYAM / NPTEL (IIT Madras)</option>
                  <option value="IIT_BOMBAY">IIT Bombay Online Certification</option>
                  <option value="UNIVERSITY_MIGRATION">Savitribai Phule Pune University (Credit Transfer)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Verified Completed Course:
                </label>
                <select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="CS-NPTEL-304">Cloud Computing & Distributed Systems (4 Credits • Elite+Gold 92%)</option>
                  <option value="AI-NPTEL-401">Deep Learning & Generative AI (4 Credits • Elite 88%)</option>
                </select>
              </div>

              {/* AI Equivalency Match Banner */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AI Syllabus Equivalency Match: 94.6%</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Matches Institutional Elective: <strong>CS304 Distributed Cloud Architecture</strong>. Eligible for direct transfer without institutional re-examination.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCreditTransferModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAuthorizeCreditTransfer}
                disabled={isTransferringCredits}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isTransferringCredits ? "Transferring & Anchoring..." : "Authorize Credit Transfer (+4 Credits)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
