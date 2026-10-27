import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  X, 
  Sparkles,
  Fingerprint,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { DEMO_STAKEHOLDER_ACCOUNTS } from '../data/authUsers';
import { formatApaar, cleanApaar } from '../data/validationEngine';

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  initialRole = 'CENTRAL_ADMIN' 
}) {
  const [activeTab, setActiveTab] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states per role
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');

  const [nodalPid, setNodalPid] = useState('');
  const [nodalEmail, setNodalEmail] = useState('');
  const [nodalPassword, setNodalPassword] = useState('');

  const [verifierOrg, setVerifierOrg] = useState('');
  const [verifierEmail, setVerifierEmail] = useState('');
  const [verifierPassword, setVerifierPassword] = useState('');

  const [studentApaar, setStudentApaar] = useState('');
  const [studentOtp, setStudentOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  if (!isOpen) return null;

  const handleTabChange = (roleId) => {
    setActiveTab(roleId);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Quick Demo Auto-fill helpers
  const handleAutoFill = (roleKey) => {
    const acc = DEMO_STAKEHOLDER_ACCOUNTS[roleKey];
    if (!acc) return;
    setErrorMsg('');
    setSuccessMsg('');

    if (roleKey === 'CENTRAL_ADMIN') {
      setAdminEmail(acc.email);
      setAdminPassword(acc.defaultPassword);
      setAdminPin(acc.twoFactorPin);
    } else if (roleKey === 'INSTITUTION_NODAL') {
      setNodalPid(acc.pid);
      setNodalEmail(acc.email);
      setNodalPassword(acc.defaultPassword);
    } else if (roleKey === 'PUBLIC_VERIFIER') {
      setVerifierOrg(acc.organization);
      setVerifierEmail(acc.email);
      setVerifierPassword(acc.defaultPassword);
    } else if (roleKey === 'STUDENT') {
      setStudentApaar(acc.formattedApaar);
      setOtpSent(true);
      setStudentOtp(acc.mobileOtp);
    }
  };

  const handleSendStudentOtp = () => {
    const cleaned = cleanApaar(studentApaar);
    if (!cleaned || cleaned.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit APAAR ID before requesting OTP.');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setStudentOtp('123456'); // Pre-fill simulation for frictionless evaluation
    setOtpTimer(30);
    setSuccessMsg('One-Time Password (OTP) dispatched to registered mobile +91 98•••• 4412. Demo OTP auto-filled: 123456');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    // Validation per tab
    if (activeTab === 'CENTRAL_ADMIN') {
      if (!adminEmail || !adminPassword) {
        setIsLoading(false);
        setErrorMsg('Please enter both your AICTE Admin official email and security password.');
        return;
      }
    } else if (activeTab === 'INSTITUTION_NODAL') {
      if (!nodalPid || !nodalEmail) {
        setIsLoading(false);
        setErrorMsg('Permanent Institute ID (PID) and Nodal Officer Email are mandatory.');
        return;
      }
    } else if (activeTab === 'PUBLIC_VERIFIER') {
      if (!verifierEmail || !verifierPassword) {
        setIsLoading(false);
        setErrorMsg('Verifier corporate email and authorization key are required.');
        return;
      }
    } else if (activeTab === 'STUDENT') {
      const cleaned = cleanApaar(studentApaar);
      if (!cleaned || cleaned.length !== 12) {
        setIsLoading(false);
        setErrorMsg('Please enter a valid 12-digit sovereign APAAR ID.');
        return;
      }
      if (!studentOtp) {
        setIsLoading(false);
        setErrorMsg('Please request and enter the 6-digit DigiLocker / Aadhaar OTP.');
        return;
      }
    }

    // Simulate cryptographic government verification handshake (400ms)
    setTimeout(() => {
      const targetUser = DEMO_STAKEHOLDER_ACCOUNTS[activeTab];
      setIsLoading(false);
      setSuccessMsg(`Authentication Successful! Welcome, ${targetUser.name}`);
      
      setTimeout(() => {
        onLoginSuccess(targetUser);
        onClose();
      }, 500);
    }, 450);
  };

  const stakeholderTabs = [
    {
      id: 'CENTRAL_ADMIN',
      title: 'AICTE Apex Admin',
      subtitle: 'National Bureau',
      icon: Building2,
      accent: 'from-purple-600 to-indigo-700',
      tag: 'Apex Clearance'
    },
    {
      id: 'INSTITUTION_NODAL',
      title: 'College Nodal Officer',
      subtitle: 'Approval & Ingestion',
      icon: Layers,
      accent: 'from-blue-600 to-cyan-700',
      tag: 'Approved Colleges'
    },
    {
      id: 'PUBLIC_VERIFIER',
      title: 'Authorized Verifier',
      subtitle: 'Corporate Screener',
      icon: UserCheck,
      accent: 'from-emerald-600 to-teal-700',
      tag: 'Employers & BGV'
    },
    {
      id: 'STUDENT',
      title: 'Student APAAR',
      subtitle: 'Academic Dossier',
      icon: GraduationCap,
      accent: 'from-amber-600 to-orange-700',
      tag: 'Learner Self-Service'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sovereign Tricolor Header Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-indigo-900 text-white flex items-center justify-center shadow-md border border-blue-800/40">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  AICTE-EduVerify Central Authentication Gateway
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 rounded">
                  SSL Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Government of India Sovereign Single Sign-On & Stakeholder Access Management
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Close Gateway"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-slate-100/80 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800">
          {stakeholderTabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all ${
                  isCurrent 
                    ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-1 ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold truncate max-w-full">
                  {tab.title}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 hidden sm:block">
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Active Stakeholder Info Card */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                <Fingerprint className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {DEMO_STAKEHOLDER_ACCOUNTS[activeTab].roleTitle} Access Gateway
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {DEMO_STAKEHOLDER_ACCOUNTS[activeTab].ssoProvider}
                </div>
              </div>
            </div>

            {/* Quick Demo Fill Pill Button */}
            <button
              type="button"
              onClick={() => handleAutoFill(activeTab)}
              className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition"
              title="Click to auto-fill official demo credentials"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Autofill Demo Login</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Tab 1: AICTE Apex Central Admin */}
            {activeTab === 'CENTRAL_ADMIN' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    AICTE Central Email / Parichay Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="e.g. admin@aicte-india.org"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Apex Security Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-9 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      2FA Government Security PIN
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        maxLength="6"
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        placeholder="e.g. 8821"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Tab 2: Institution Nodal Officer */}
            {activeTab === 'INSTITUTION_NODAL' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      AICTE Permanent Institute ID (PID)
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={nodalPid}
                        onChange={(e) => setNodalPid(e.target.value)}
                        placeholder="e.g. 1-10293847"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nodal Officer Official Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={nodalEmail}
                        onChange={(e) => setNodalEmail(e.target.value)}
                        placeholder="e.g. dean.academics@coep.ac.in"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Institutional Passkey & AICTE Approval Secret
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={nodalPassword}
                      onChange={(e) => setNodalPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
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
              </>
            )}

            {/* Tab 3: Authorized Verifier */}
            {activeTab === 'PUBLIC_VERIFIER' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Employer / Verifying Entity Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={verifierOrg}
                      onChange={(e) => setVerifierOrg(e.target.value)}
                      placeholder="e.g. Tata Consultancy Services (TCS Global)"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Corporate Verifier Email / TAN
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={verifierEmail}
                        onChange={(e) => setVerifierEmail(e.target.value)}
                        placeholder="e.g. verify@tcs.com"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Verifier Access Token / Key
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={verifierPassword}
                        onChange={(e) => setVerifierPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-9 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
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
              </>
            )}

            {/* Tab 4: Student APAAR Portal */}
            {activeTab === 'STUDENT' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    12-Digit Sovereign APAAR ID
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength="14"
                      value={studentApaar}
                      onChange={(e) => setStudentApaar(formatApaar(e.target.value))}
                      placeholder="e.g. 9823-4512-8831"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono tracking-wider font-bold text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      DigiLocker / Aadhaar OTP Verification
                    </span>
                    <button
                      type="button"
                      onClick={handleSendStudentOtp}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {otpSent ? 'Resend OTP' : 'Send Mobile OTP'}
                    </button>
                  </div>

                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      maxLength="6"
                      value={studentOtp}
                      onChange={(e) => setStudentOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP (Demo: 123456)"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-mono tracking-widest text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Error and Success Alerts */}
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

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Cryptographic Ledger Handshake...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate & Open {stakeholderTabs.find(t => t.id === activeTab)?.title} Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badges */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Digital Personal Data Protection (DPDP) Act 2023 Compliant
            </span>
            <span>AICTE National Gateway v2.4</span>
          </div>

        </div>
      </div>
    </div>
  );
}
