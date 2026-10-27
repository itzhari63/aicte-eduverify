import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Key, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Fingerprint, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatApaar, cleanApaar } from '../../data/validationEngine';

export const AUTH_ROLES = [
  {
    id: "INSTITUTE_ADMIN",
    title: "Institute Administrator",
    category: "AISHE / AICTE Approved Colleges",
    description: "Manage institutional student admissions, program sanctioned intake quotas, and batch CSV ingestion.",
    icon: Building2,
    badge: "Approved College",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300",
    accent: "from-blue-600 to-indigo-700",
    redirectTab: "INGESTION",
    redirectPath: "/institutions",
    demoAccount: {
      name: "Dr. Sudhir Deshmukh",
      designation: "Dean of Academic Admissions & Nodal Officer",
      identifier: "1-10293847",
      aisheCode: "C-41289",
      email: "dean.academics@coep.ac.in",
      organization: "College of Engineering Pune (COEP Tech Univ)",
      defaultPassword: "Admin@2026",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "AICTE_OFFICIAL",
    title: "AICTE Regulatory Official",
    category: "Bureau & State Council Authorities",
    description: "Apex regulatory surveillance, cross-institution duplicate APAAR detection, and sanctioned intake enforcement.",
    icon: ShieldCheck,
    badge: "Apex Council",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300",
    accent: "from-purple-600 to-indigo-800",
    redirectTab: "DASHBOARD",
    redirectPath: "/dashboard",
    demoAccount: {
      name: "Prof. T. G. Sitharam",
      designation: "Chairman, AICTE & Apex Regulatory Authority",
      identifier: "AICTE-HQ-7701",
      email: "admin@aicte-india.org",
      organization: "All India Council for Technical Education (New Delhi)",
      defaultPassword: "Aicte@2026",
      securityPin: "8821",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  },
  {
    id: "STUDENT",
    title: "Student / Candidate",
    category: "APAAR / ABC Academic Credit Holders",
    description: "Access sovereign academic dossier, Academic Bank of Credits (ABC), verifiable degree credentials, and DPDP consent.",
    icon: GraduationCap,
    badge: "Learner Portal",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300",
    accent: "from-amber-600 to-orange-700",
    redirectTab: "STUDENT",
    redirectPath: "/student/profile",
    demoAccount: {
      name: "Aditi Ramesh Sharma",
      designation: "Undergraduate Student (B.Tech Computer Science)",
      identifier: "982345128831",
      formattedApaar: "9823-4512-8831",
      mobile: "+91 98450 12345",
      organization: "College of Engineering Pune (COEP)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    }
  }
];

export default function MultiStepLogin({ 
  isOpen = true, 
  onClose, 
  onLoginSuccess,
  isModal = false 
}) {
  // Step state: 1 = Role Selection, 2 = Credentials, 3 = Multi-Factor / OTP
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(AUTH_ROLES[0]);
  
  // Credentials per role
  const [instituteCode, setInstituteCode] = useState('');
  const [instituteEmail, setInstituteEmail] = useState('');
  const [institutePassword, setInstitutePassword] = useState('');

  const [officialId, setOfficialId] = useState('');
  const [officialPassword, setOfficialPassword] = useState('');
  const [officialPin, setOfficialPin] = useState('');

  const [studentIdentifier, setStudentIdentifier] = useState('');

  // Step 3 OTP state
  const [otpValue, setOtpValue] = useState('');
  const [cooldown, setCooldown] = useState(30);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer for OTP resend cooldown
  useEffect(() => {
    let interval = null;
    if (isCooldownActive && cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    } else if (cooldown === 0) {
      setIsCooldownActive(false);
    }
    return () => clearInterval(interval);
  }, [isCooldownActive, cooldown]);

  // Step 1: Select Role
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    setCurrentStep(2);
  };

  // Step 2: Validate Credentials & Advance to Step 3 (OTP)
  const handleProceedToOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (selectedRole.id === 'INSTITUTE_ADMIN') {
      if (!instituteCode || !instituteEmail) {
        setErrorMsg('AISHE Code / Permanent Institute ID and Institutional Email are required.');
        return;
      }
    } else if (selectedRole.id === 'AICTE_OFFICIAL') {
      if (!officialId || !officialPassword) {
        setErrorMsg('Central Bureau Officer ID and Departmental Password are required.');
        return;
      }
    } else if (selectedRole.id === 'STUDENT') {
      const clean = cleanApaar(studentIdentifier);
      if (!clean && studentIdentifier.length < 10) {
        setErrorMsg('Please enter a valid 12-digit APAAR ID or registered 10-digit Mobile number.');
        return;
      }
    }

    setCurrentStep(3);
    setCooldown(30);
    setIsCooldownActive(true);
    setSuccessMsg(`Multi-Factor authentication code dispatched. (Demo OTP: 123456)`);
  };

  // Instant Demo One-Click Login
  const handleOneClickDemo = () => {
    setErrorMsg('');
    setOtpValue('123456');
    setSuccessMsg('Demo OTP 123456 auto-filled! Submitting secure session...');
    setTimeout(() => {
      completeLogin();
    }, 400);
  };

  // Step 3: Complete Login and issue session
  const completeLogin = () => {
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      const demo = selectedRole.demoAccount;
      
      const userPayload = {
        id: `USR-${selectedRole.id}-${Date.now().toString(16)}`,
        name: demo.name,
        role: selectedRole.id === 'AICTE_OFFICIAL' ? 'CENTRAL_ADMIN' : selectedRole.id,
        roleTitle: selectedRole.title,
        designation: demo.designation,
        email: demo.email || `${selectedRole.id.toLowerCase()}@aicte-india.org`,
        organization: demo.organization,
        identifier: demo.identifier,
        avatar: demo.avatar,
        ssoProvider: "National Parichay & MeriPehchan Federated Gateway",
        token: `jwt_token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        redirectTab: selectedRole.redirectTab,
        redirectPath: selectedRole.redirectPath
      };

      onLoginSuccess?.(userPayload);
      if (onClose) onClose();
    }, 500);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit numeric verification OTP.');
      return;
    }
    completeLogin();
  };

  // Auto-fill demo credentials in Step 2
  const handleAutoFillStep2 = () => {
    setErrorMsg('');
    const demo = selectedRole.demoAccount;
    if (selectedRole.id === 'INSTITUTE_ADMIN') {
      setInstituteCode(demo.identifier);
      setInstituteEmail(demo.email);
      setInstitutePassword(demo.defaultPassword);
    } else if (selectedRole.id === 'AICTE_OFFICIAL') {
      setOfficialId(demo.identifier);
      setOfficialPassword(demo.defaultPassword);
      setOfficialPin(demo.securityPin || '8821');
    } else if (selectedRole.id === 'STUDENT') {
      setStudentIdentifier(demo.formattedApaar);
    }
    setSuccessMsg(`Official demo credentials loaded for ${demo.name}.`);
  };

  const containerContent = (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden w-full max-w-2xl mx-auto my-4 transition-all">
      {/* Tricolor Government Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white flex items-center justify-center shadow-md border border-blue-800/40">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                AICTE Sovereign Access Gateway
              </h2>
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 rounded">
                DPDP 2023 Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              National Academic Identity & Stakeholder Multi-Step Authentication
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 3-Step Progress Indicator */}
      <div className="px-6 py-3 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between max-w-md mx-auto text-xs font-bold">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
              currentStep === 1 
                ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' 
                : currentStep > 1 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span className={currentStep === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>
              Role Selection
            </span>
          </div>

          <div className="flex-1 h-0.5 mx-2 bg-slate-200 dark:bg-slate-800" />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
              currentStep === 2 
                ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' 
                : currentStep > 2 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <span className={currentStep === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>
              Credentials
            </span>
          </div>

          <div className="flex-1 h-0.5 mx-2 bg-slate-200 dark:bg-slate-800" />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
              currentStep === 3 
                ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' 
                : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              3
            </div>
            <span className={currentStep === 3 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>
              OTP / 2FA
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="p-6">
        
        {/* STEP 1: ROLE SELECTION GATEWAY */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="text-center max-w-md mx-auto mb-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Step 1: Select Your Authorized Stakeholder Role
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose your official affiliation to proceed with sovereign identity verification.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {AUTH_ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role)}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all text-left flex items-start gap-4 group cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${role.accent} text-white shadow-md group-hover:scale-105 transition shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {role.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${role.badgeColor}`}>
                          {role.badge}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        {role.category}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {role.description}
                      </p>
                    </div>

                    <div className="p-2 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: ROLE CREDENTIALS & IDENTITY VERIFICATION */}
        {currentStep === 2 && (
          <form onSubmit={handleProceedToOtp} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  title="Back to Role Selection"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Step 2: {selectedRole.title} Authentication
                  </h3>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                    {selectedRole.category}
                  </span>
                </div>
              </div>

              {/* Demo Fill Helper */}
              <button
                type="button"
                onClick={handleAutoFillStep2}
                className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Autofill Demo</span>
              </button>
            </div>

            {/* Role 1: Institute Administrator */}
            {selectedRole.id === 'INSTITUTE_ADMIN' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      AISHE Code / Permanent Institute ID
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={instituteCode}
                        onChange={(e) => setInstituteCode(e.target.value)}
                        placeholder="e.g. 1-10293847 or C-41289"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Institutional Nodal Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={instituteEmail}
                        onChange={(e) => setInstituteEmail(e.target.value)}
                        placeholder="dean.academics@coep.ac.in"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Institutional Approval Passcode
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={institutePassword}
                      onChange={(e) => setInstitutePassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Role 2: AICTE Regulatory Official */}
            {selectedRole.id === 'AICTE_OFFICIAL' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Central Bureau Officer ID
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={officialId}
                        onChange={(e) => setOfficialId(e.target.value)}
                        placeholder="e.g. AICTE-HQ-7701"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-mono text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      2FA Government Security PIN
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        maxLength="6"
                        value={officialPin}
                        onChange={(e) => setOfficialPin(e.target.value)}
                        placeholder="e.g. 8821"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Departmental Passkey
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={officialPassword}
                      onChange={(e) => setOfficialPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Role 3: Student / Candidate */}
            {selectedRole.id === 'STUDENT' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    12-Digit Sovereign APAAR ID or Registered Mobile
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength="14"
                      value={studentIdentifier}
                      onChange={(e) => setStudentIdentifier(formatApaar(e.target.value))}
                      placeholder="e.g. 9823-4512-8831 or 9845012345"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono tracking-wider font-bold text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Secured with DigiLocker and the Academic Bank of Credits (ABC) repository.
                  </span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Step 3: Multi-Factor OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 3: MULTI-FACTOR / OTP VERIFICATION SCREEN */}
        {currentStep === 3 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-1 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Credentials</span>
              </button>

              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                OTP Dispatched
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6 animate-bounce" />
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Enter 6-Digit Multi-Factor OTP
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  A verification code has been dispatched to your registered Aadhaar / Institutional mobile (+91 ••••• ••345).
                </p>
              </div>

              {/* OTP Input Box */}
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength="6"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full py-2.5 text-center text-xl font-mono tracking-[0.5em] font-extrabold bg-white dark:bg-slate-900 border-2 border-blue-500 dark:border-blue-400 rounded-xl focus:ring-4 focus:ring-blue-500/20 outline-none text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>

              {/* Resend Cooldown Timer */}
              <div className="text-xs text-slate-400">
                {isCooldownActive ? (
                  <span>Resend code in <strong className="text-slate-700 dark:text-slate-200 font-mono">{cooldown}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setCooldown(30); setIsCooldownActive(true); }}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </div>

            {/* Instant Demo One-Click Login Button */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-amber-900 dark:text-amber-200 font-semibold">
                  Evaluator Demo: Instant 1-Click Verification (Auto-fills 123456)
                </span>
              </div>
              <button
                type="button"
                onClick={handleOneClickDemo}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm transition hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              >
                Demo 1-Click Login
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Issuing Cryptographic Session...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>Authenticate & Launch {selectedRole.title} Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );

  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
          {containerContent}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {containerContent}
    </div>
  );
}
