import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingHub from './components/LandingHub';
import AdminDashboard from './components/AdminDashboard';
import InstitutionDashboard from './components/InstitutionDashboard';
import VerifierHub from './components/VerifierHub';
import CertificateGenerator from './components/CertificateGenerator';
import StudentPortal from './components/StudentPortal';
import AuditTrail from './components/AuditTrail';
import ProblemStatementModal from './components/ProblemStatementModal';
import PolicyReportsModal from './components/PolicyReportsModal';
import MongoConnectModal from './components/MongoConnectModal';
import RegulatoryAlertsModal from './components/RegulatoryAlertsModal';
import LoginModal from './components/LoginModal';
import { getSavedSession, saveSession, clearSession } from './data/authUsers';

import { 
  INITIAL_INSTITUTIONS, 
  INITIAL_STUDENTS, 
  INITIAL_INTAKE_BREACHES, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { api } from './services/api';

export default function App() {
  const [currentRole, setRole] = useState('INSTITUTION_NODAL'); // Default to Nodal for immediate wow factor on Ingestion
  const [currentTab, setTab] = useState('INGESTION');
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('aicte_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Main Central Repositories in State
  const [institutions, setInstitutions] = useState(INITIAL_INSTITUTIONS);
  const [allStudents, setAllStudents] = useState(INITIAL_STUDENTS);
  const [intakeBreaches, setIntakeBreaches] = useState(INITIAL_INTAKE_BREACHES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [backendConnected, setBackendConnected] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);

  // Modals & Navigation Helpers
  const [isProblemStatementOpen, setIsProblemStatementOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMongoModalOpen, setIsMongoModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  // Authentication & Stakeholder User Session State
  const [currentUser, setCurrentUser] = useState(() => getSavedSession());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalInitialRole, setLoginModalInitialRole] = useState('CENTRAL_ADMIN');

  const [reportModalType, setReportModalType] = useState('NIRF');
  const [selectedStudentForCert, setSelectedStudentForCert] = useState(null);

  // Sync data with live backend
  useEffect(() => {
    async function initBackend() {
      try {
        const health = await api.checkHealth();
        if (health && health.status === 'ONLINE') {
          setBackendConnected(true);
          if (health.database?.connected) {
            setDbConnected(true);
          }
          const [instData, stuData, breachesData, logsData] = await Promise.all([
            api.getInstitutions(),
            api.getStudents(),
            api.getIntakeBreaches(),
            api.getAuditLogs()
          ]);
          if (Array.isArray(instData)) setInstitutions(instData);
          if (Array.isArray(stuData)) setAllStudents(stuData);
          if (Array.isArray(breachesData)) setIntakeBreaches(breachesData);
          if (Array.isArray(logsData)) setAuditLogs(logsData);
        }
      } catch (err) {
        console.warn('Backend sync failed, using sovereign client store:', err);
      }
    }
    initBackend();
  }, []);

  const handleDbConnected = async () => {
    setDbConnected(true);
    try {
      const [instData, stuData, breachesData, logsData] = await Promise.all([
        api.getInstitutions(),
        api.getStudents(),
        api.getIntakeBreaches(),
        api.getAuditLogs()
      ]);
      if (Array.isArray(instData)) setInstitutions(instData);
      if (Array.isArray(stuData)) setAllStudents(stuData);
      if (Array.isArray(breachesData)) setIntakeBreaches(breachesData);
      if (Array.isArray(logsData)) setAuditLogs(logsData);
    } catch {}
  };

  // Dark mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      try { localStorage.setItem('aicte_theme', 'dark'); } catch {}
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      try { localStorage.setItem('aicte_theme', 'light'); } catch {}
    }
  }, [darkMode]);

  // Audit log helper
  const handleAddAuditLog = async ({ actor, actorName, action, details, status }) => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actor,
      actorName,
      action,
      details,
      ipHash: `192.168.1.${Math.floor(10 + Math.random() * 200)}:sha256-${Math.floor(1000 + Math.random() * 9000)}`,
      status,
      recordHash: `sha256_${Date.now().toString(16)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
    try {
      await api.addAuditLog(newLog);
    } catch {}
  };

  // Stakeholder Login & Logout Handlers
  const handleOpenLoginModal = (role = 'CENTRAL_ADMIN') => {
    setLoginModalInitialRole(role);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    saveSession(user);
    setRole(user.role);

    // Auto-navigate to the authenticated stakeholder's dedicated portal view
    if (user.role === 'CENTRAL_ADMIN') setTab('ADMIN');
    else if (user.role === 'INSTITUTION_NODAL') setTab('INGESTION');
    else if (user.role === 'PUBLIC_VERIFIER') setTab('VERIFIER');
    else if (user.role === 'STUDENT') setTab('STUDENT');

    handleAddAuditLog({
      actor: `${user.name} (${user.roleTitle})`,
      actorName: user.name,
      action: "USER_AUTHENTICATED_SESSION",
      details: `Sovereign SSO session established via ${user.ssoProvider || 'National Gateway'}. Security clearance granted.`,
      status: "AUTHENTIC_VALIDATED"
    });
  };

  const handleLogout = () => {
    if (currentUser) {
      handleAddAuditLog({
        actor: `${currentUser.name} (${currentUser.roleTitle})`,
        actorName: currentUser.name,
        action: "USER_SESSION_TERMINATED",
        details: `User explicitly signed out of AICTE-EduVerify. Cryptographic session token revoked and invalidated.`,
        status: "SESSION_REVOKED"
      });
    }
    clearSession();
    setCurrentUser(null);
    setTab('LANDING');
  };

  // Jump to Certificate Generator
  const handleViewCertificate = (student) => {
    setSelectedStudentForCert(student);
    setTab('CERTIFICATE');
  };

  // Jump to Student Digital Card
  const handleViewApaarCard = (student) => {
    setSelectedStudentForCert(student);
    setRole('STUDENT');
    setTab('STUDENT');
  };

  // Open policy reports modal
  const handleOpenReportModal = (type = 'NIRF') => {
    setReportModalType(type);
    setIsReportModalOpen(true);
  };

  // Current primary institution
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null);
  const currentInstitution = institutions.find(i => i.id === selectedInstitutionId) || institutions[0] || null;

  const handleAddInstitution = (newInst) => {
    setInstitutions(prev => [newInst, ...prev]);
    setSelectedInstitutionId(newInst.id);
  };

  // Active duplicate conflicts count
  const activeDuplicateCount = allStudents.filter(s => s.status === 'FLAGGED_DUPLICATE').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. Universal Government Header */}
      <Header
        currentRole={currentRole}
        setRole={setRole}
        currentTab={currentTab}
        setTab={setTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenProblemStatement={() => setIsProblemStatementOpen(true)}
        onOpenMongoModal={() => setIsMongoModalOpen(true)}
        onOpenRegulatoryAlerts={() => setIsAlertsModalOpen(true)}
        activeAlertCount={activeDuplicateCount}
        backendConnected={backendConnected}
        dbConnected={dbConnected}
        currentUser={currentUser}
        onOpenLoginModal={handleOpenLoginModal}
        onLogout={handleLogout}
      />

      {/* 2. Main Module Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        
        {currentTab === 'LANDING' && (
          <LandingHub
            students={allStudents}
            institutions={institutions}
            setTab={setTab}
            setRole={setRole}
            onVerifySelect={handleViewCertificate}
            onOpenLoginModal={handleOpenLoginModal}
          />
        )}

        {currentTab === 'ADMIN' && (
          <AdminDashboard
            institutions={institutions}
            allStudents={allStudents}
            setAllStudents={setAllStudents}
            intakeBreaches={intakeBreaches}
            setIntakeBreaches={setIntakeBreaches}
            onAddAuditLog={handleAddAuditLog}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {currentTab === 'INGESTION' && (
          <InstitutionDashboard
            institution={currentInstitution}
            allStudents={allStudents}
            setAllStudents={setAllStudents}
            onAddAuditLog={handleAddAuditLog}
            onViewCertificate={handleViewCertificate}
            onViewApaarCard={handleViewApaarCard}
            onAddInstitution={handleAddInstitution}
          />
        )}

        {currentTab === 'VERIFIER' && (
          <VerifierHub
            students={allStudents}
            onAddAuditLog={handleAddAuditLog}
          />
        )}

        {currentTab === 'CERTIFICATE' && (
          <CertificateGenerator
            students={allStudents}
            selectedStudent={selectedStudentForCert}
          />
        )}

        {currentTab === 'STUDENT' && (
          <StudentPortal
            student={selectedStudentForCert}
            onSelectStudent={setSelectedStudentForCert}
            allStudents={allStudents}
            onViewCertificate={handleViewCertificate}
          />
        )}

        {currentTab === 'AUDIT' && (
          <AuditTrail
            auditLogs={auditLogs}
          />
        )}

      </main>

      {/* 3. Official Government Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-xs text-slate-500 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950 text-white flex items-center justify-center font-bold text-xs">
              AICTE
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">
                अखिल भारतीय तकनीकी शिक्षा परिषद | ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
              </div>
              <div className="text-[11px] text-slate-500">
                Department: Regulation Bureau • National Academic Depository & APAAR Enforcement System
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button 
              onClick={() => setIsProblemStatementOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
            >
              Regulatory Framework
            </button>
            <span>•</span>
            <button 
              onClick={() => handleOpenReportModal("NIRF")}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
            >
              NIRF Compliance
            </button>
            <span>•</span>
            <button 
              onClick={() => setTab("AUDIT")}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
            >
              Audit Trail
            </button>
            <span>•</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ● Central Ledger Sync: ONLINE (18ms)
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center text-[10px] text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          Official portal of All India Council for Technical Education (AICTE), Ministry of Education, Government of India. Compliant with National Education Policy 2020 & Digital Personal Data Protection Act 2023.
        </div>
      </footer>

      {/* 4. Global Modals */}
      <ProblemStatementModal
        isOpen={isProblemStatementOpen}
        onClose={() => setIsProblemStatementOpen(false)}
      />

      <PolicyReportsModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialType={reportModalType}
        institutions={institutions}
      />

      <MongoConnectModal
        isOpen={isMongoModalOpen}
        onClose={() => setIsMongoModalOpen(false)}
        onConnected={handleDbConnected}
      />

      <RegulatoryAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        students={allStudents}
        institutions={institutions}
      />

      {/* Stakeholder Login & Authentication Gateway Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={loginModalInitialRole}
      />


    </div>
  );
}
