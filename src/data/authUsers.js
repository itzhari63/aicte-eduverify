// Sovereign AICTE-EduVerify Stakeholder Accounts & Authentication Directory
// Configured with authentic Indian regulatory and institutional profiles

export const DEMO_STAKEHOLDER_ACCOUNTS = {
  CENTRAL_ADMIN: {
    id: "USR-AICTE-001",
    role: "CENTRAL_ADMIN",
    roleTitle: "AICTE Central Admin",
    name: "Prof. T. G. Sitharam",
    designation: "Chairman, AICTE & Apex Regulatory Authority",
    email: "admin@aicte-india.org",
    defaultPassword: "Admin@2026",
    twoFactorPin: "8821",
    organization: "All India Council for Technical Education (AICTE HQ)",
    department: "National Academic Bureau, Nelson Mandela Marg, New Delhi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    ssoProvider: "Parichay / MeriPehchan (National Government SSO)",
    securityLevel: "LEVEL-4 APEX CLEARANCE",
    badge: "National Apex",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300",
    permissions: [
      "NATIONAL_ANALYTICS_READ",
      "INSTITUTION_CAP_ENFORCE",
      "REGULATORY_NOTICE_DISPATCH",
      "IMMUTABLE_AUDIT_INSPECT",
      "SUPERNUMERARY_APPROVAL",
      "SHOW_CAUSE_ISSUANCE"
    ]
  },

  INSTITUTION_NODAL: {
    id: "USR-NODAL-1029",
    role: "INSTITUTION_NODAL",
    roleTitle: "Institution Nodal Officer",
    name: "Dr. Sudhir Deshmukh",
    designation: "Dean of Academic Admissions & Nodal Officer",
    email: "dean.academics@coep.ac.in",
    pid: "1-10293847",
    defaultPassword: "Nodal@2026",
    securityKey: "COEP-SEC-892",
    organization: "College of Engineering Pune (COEP Technological University)",
    institutionId: "1-10293847",
    institutionName: "College of Engineering Pune (COEP Technological University)",
    state: "Maharashtra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    ssoProvider: "AICTE Approval Bureau Institutional Federation",
    securityLevel: "LEVEL-2 INSTITUTIONAL NODAL",
    badge: "Approved College",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300",
    permissions: [
      "STUDENT_BATCH_INGEST",
      "CSV_EXCEL_DATA_MAP",
      "INTAKE_BREACH_RESOLVE",
      "DEGREE_CREDENTIAL_ISSUE",
      "OFFLINE_EKYC_VALIDATE"
    ]
  },

  PUBLIC_VERIFIER: {
    id: "USR-VER-8821",
    role: "PUBLIC_VERIFIER",
    roleTitle: "Authorized Verifier",
    name: "Sneha Kulkarni",
    designation: "Lead Talent Authentication & Compliance Partner",
    email: "verify@tcs.com",
    corporateId: "VER-TCS-902",
    defaultPassword: "Verify@2026",
    accessKey: "TCS-GLOBAL-AUTH-2026",
    organization: "Tata Consultancy Services (Global BGV & Talent Compliance)",
    tanNumber: "MUMT12345C",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    ssoProvider: "Corporate Verifier Trust Gateway (ISO/IEC 27001)",
    securityLevel: "LEVEL-1 AUTHORIZED VERIFIER",
    badge: "Third-Party",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
    permissions: [
      "APAAR_RECORD_AUTHENTICATE",
      "LEDGER_HASH_VERIFY",
      "TAMPER_PROOF_CERT_INSPECT",
      "VERIFICATION_DOSSIER_DOWNLOAD"
    ]
  },

  STUDENT: {
    id: "USR-STU-9823",
    role: "STUDENT",
    roleTitle: "Student / Academic Learner",
    name: "Aditi Ramesh Sharma",
    designation: "Undergraduate Student (B.Tech Computer Science)",
    apaarId: "982345128831",
    formattedApaar: "9823-4512-8831",
    rollNo: "2024-CSE-042",
    mobileOtp: "123456",
    registeredMobile: "+91 98•••• 4412",
    registeredEmail: "aditi.sharma@coep.ac.in",
    organization: "College of Engineering Pune (COEP)",
    institutionName: "College of Engineering Pune (COEP Technological University)",
    branch: "Computer Science & Engineering",
    academicYear: "3rd Year (Semester VI)",
    abcId: "ABC-7892-1049-8831",
    abcCredits: 84,
    cgpa: "9.38",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    ssoProvider: "DigiLocker & Sovereign APAAR Identity Ledger",
    securityLevel: "LEVEL-0 CITIZEN / LEARNER",
    badge: "Self-Service",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300",
    permissions: [
      "VIEW_PERSONAL_DOSSIER",
      "CONSENT_PERMISSION_GOVERN",
      "ABC_CREDIT_TRANSFER",
      "VERIFIABLE_CREDENTIAL_EXPORT"
    ]
  }
};

export const AUTH_STORAGE_KEY = 'aicte_eduverify_session_v1';

export function getSavedSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read user session:", e);
    return null;
  }
}

export function saveSession(user) {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        ...user,
        sessionTimestamp: new Date().toISOString()
      }));
    }
  } catch (e) {
    console.warn("Failed to persist user session:", e);
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear session:", e);
  }
}
