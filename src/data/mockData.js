// Authentic Indian Institutions, Students, Conflicts, and State Statistics for AICTE-EduVerify

export const INITIAL_INSTITUTIONS = [
  {
    id: "1-10293847",
    name: "College of Engineering Pune (COEP Technological University)",
    shortName: "COEP Pune",
    type: "Engineering & Technology",
    category: "State Autonomous Govt. Aided",
    state: "Maharashtra",
    city: "Pune",
    affiliation: "Savitribai Phule Pune University",
    nirfRank: 24,
    complianceScore: 99.2,
    nodalOfficer: {
      name: "Dr. Sudhir Deshmukh",
      designation: "Dean of Academic Admissions",
      email: "dean.academics@coep.ac.in",
      phone: "+91 20 2550 7000"
    },
    departments: [
      { code: "CSE", name: "Computer Science & Engineering", approvedIntake: 120, supernumerarySeats: 12, enrolledCount: 3, categories: { general: 2, ews: 0, obc: 1, scSt: 0, nri: 0, fn: 0, oci: 0, tfw: 0 } },
      { code: "AIDS", name: "Artificial Intelligence & Data Science", approvedIntake: 60, supernumerarySeats: 6, enrolledCount: 1, categories: { general: 1, ews: 0, obc: 0, scSt: 0, nri: 0, fn: 0, oci: 0, tfw: 0 } },
      { code: "ENTC", name: "Electronics & Telecommunication", approvedIntake: 120, supernumerarySeats: 12, enrolledCount: 1, categories: { general: 0, ews: 0, obc: 0, scSt: 1, nri: 0, fn: 0, oci: 0, tfw: 0 } },
      { code: "MECH", name: "Mechanical Engineering", approvedIntake: 120, supernumerarySeats: 12, enrolledCount: 0, categories: { general: 0, ews: 0, obc: 0, scSt: 0, nri: 0, fn: 0, oci: 0, tfw: 0 } }
    ]
  },
  {
    id: "1-20491823",
    name: "Delhi Technological University (DTU)",
    shortName: "DTU Delhi",
    type: "Engineering & Technology",
    category: "State University",
    state: "Delhi",
    city: "New Delhi",
    affiliation: "Govt. of NCT of Delhi",
    nirfRank: 29,
    complianceScore: 98.6,
    nodalOfficer: {
      name: "Prof. Rajesh Kumar",
      designation: "Registrar (Admissions)",
      email: "admissions@dtu.ac.in",
      phone: "+91 11 2787 1018"
    },
    departments: [
      { code: "CSE", name: "Computer Science & Engineering", approvedIntake: 180, supernumerarySeats: 18, enrolledCount: 1 },
      { code: "IT", name: "Information Technology", approvedIntake: 120, supernumerarySeats: 12, enrolledCount: 0 },
      { code: "ECE", name: "Electronics & Communication", approvedIntake: 180, supernumerarySeats: 18, enrolledCount: 0 }
    ]
  },
  {
    id: "1-48201934",
    name: "R.V. College of Engineering (RVCE)",
    shortName: "RVCE Bangalore",
    type: "Engineering & Technology",
    category: "Autonomous Private (Govt Aided)",
    state: "Karnataka",
    city: "Bengaluru",
    affiliation: "VTU Belagavi",
    nirfRank: 89,
    complianceScore: 97.4,
    nodalOfficer: {
      name: "Dr. K. N. Subramanya",
      designation: "Principal & Academic Head",
      email: "principal@rvce.edu.in",
      phone: "+91 80 6818 8100"
    },
    departments: [
      { code: "CSE", name: "Computer Science & Engineering", approvedIntake: 180, supernumerarySeats: 18, enrolledCount: 1 },
      { code: "ISE", name: "Information Science & Engineering", approvedIntake: 120, supernumerarySeats: 12, enrolledCount: 0 }
    ]
  },
  {
    id: "1-57201923",
    name: "PSG College of Technology",
    shortName: "PSG Tech",
    type: "Engineering & Technology",
    category: "Govt. Aided Autonomous",
    state: "Tamil Nadu",
    city: "Coimbatore",
    affiliation: "Anna University",
    nirfRank: 63,
    complianceScore: 99.0,
    nodalOfficer: {
      name: "Dr. K. Prakasan",
      designation: "Principal",
      email: "principal@psgtech.edu",
      phone: "+91 422 257 2177"
    },
    departments: [
      { code: "CSE", name: "Computer Science & Engineering", approvedIntake: 120, supernumerarySeats: 12, enrolledCount: 1 }
    ]
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "STU-1001",
    apaarId: "982345128831",
    rollNo: "2024-CSE-042",
    name: "Aditi Ramesh Sharma",
    gender: "Female",
    dob: "2005-04-18",
    institutionId: "1-10293847",
    institutionName: "College of Engineering Pune (COEP Technological University)",
    branchCode: "CSE",
    branchName: "Computer Science & Engineering",
    admissionCategory: "General",
    quotaCategory: "State Merit",
    admissionYear: 2026,
    status: "VERIFIED",
    verificationDate: new Date().toISOString(),
    hash: "sha256_982345128831_coep_verified",
    abcId: "ABC-7892-1049-8831",
    abcCredits: 84,
    cgpa: "9.38"
  },
  {
    id: "STU-1002",
    apaarId: "814592013342",
    rollNo: "2024-CSE-088",
    name: "Rohan Jayesh Patel",
    gender: "Male",
    dob: "2004-11-22",
    institutionId: "1-10293847",
    institutionName: "College of Engineering Pune (COEP Technological University)",
    branchCode: "CSE",
    branchName: "Computer Science & Engineering",
    admissionCategory: "OBC",
    quotaCategory: "State Reserved",
    admissionYear: 2026,
    status: "VERIFIED",
    verificationDate: new Date().toISOString(),
    hash: "sha256_814592013342_coep_verified",
    abcId: "ABC-8145-9201-3342",
    abcCredits: 78,
    cgpa: "8.92"
  },
  {
    id: "STU-1003",
    apaarId: "723488910192",
    rollNo: "2024-AIDS-015",
    name: "Ananya Sundaram",
    gender: "Female",
    dob: "2005-02-10",
    institutionId: "1-10293847",
    institutionName: "College of Engineering Pune (COEP Technological University)",
    branchCode: "AIDS",
    branchName: "Artificial Intelligence & Data Science",
    admissionCategory: "General",
    quotaCategory: "Open Merit",
    admissionYear: 2026,
    status: "VERIFIED",
    verificationDate: new Date().toISOString(),
    hash: "sha256_723488910192_coep_verified",
    abcId: "ABC-7234-8891-0192",
    abcCredits: 80,
    cgpa: "9.45"
  },
  {
    id: "STU-1004",
    apaarId: "652144029918",
    rollNo: "2024-CSE-104",
    name: "Priya Anand Verma",
    gender: "Female",
    dob: "2005-01-14",
    institutionId: "1-10293847",
    institutionName: "College of Engineering Pune (COEP Technological University)",
    branchCode: "CSE",
    branchName: "Computer Science & Engineering",
    admissionCategory: "General",
    quotaCategory: "Central Counseling",
    admissionYear: 2026,
    status: "FLAGGED_DUPLICATE",
    verificationDate: new Date().toISOString(),
    hash: "sha256_652144029918_dual_enrolment_flagged",
    abcId: "ABC-6521-4402-9918",
    abcCredits: 72,
    cgpa: "8.75",
    conflictWith: {
      institutionId: "1-20491823",
      institutionName: "Delhi Technological University (DTU)",
      branchCode: "CSE",
      branchName: "Computer Science & Engineering",
      rollNo: "DTU-2024-CS-091"
    }
  },
  {
    id: "STU-1005",
    apaarId: "541277036619",
    rollNo: "2024-ENTC-031",
    name: "Kavita Meena",
    gender: "Female",
    dob: "2004-09-14",
    institutionId: "1-10293847",
    institutionName: "College of Engineering Pune (COEP Technological University)",
    branchCode: "ENTC",
    branchName: "Electronics & Telecommunication",
    admissionCategory: "ST",
    quotaCategory: "Reserved Category",
    admissionYear: 2026,
    status: "VERIFIED",
    verificationDate: new Date().toISOString(),
    hash: "sha256_541277036619_coep_verified",
    abcId: "ABC-5412-7703-6619",
    abcCredits: 76,
    cgpa: "8.65"
  },
  {
    id: "STU-1006",
    apaarId: "430966125520",
    rollNo: "DTU-2024-CS-012",
    name: "Vikramaditya Sengupta",
    gender: "Male",
    dob: "2004-08-05",
    institutionId: "1-20491823",
    institutionName: "Delhi Technological University (DTU)",
    branchCode: "CSE",
    branchName: "Computer Science & Engineering",
    admissionCategory: "General",
    quotaCategory: "All India Merit",
    admissionYear: 2026,
    status: "VERIFIED",
    verificationDate: new Date().toISOString(),
    hash: "sha256_430966125520_dtu_verified",
    abcId: "ABC-4309-6612-5520",
    abcCredits: 82,
    cgpa: "9.15"
  },
  {
    id: "STU-1007",
    apaarId: "329855214431",
    rollNo: "RVCE-2024-CS-045",
    name: "Siddharth Nair",
    gender: "Male",
    dob: "2004-12-18",
    institutionId: "1-48201934",
    institutionName: "R.V. College of Engineering (RVCE)",
    branchCode: "CSE",
    branchName: "Computer Science & Engineering",
    admissionCategory: "General",
    quotaCategory: "Merit Quota",
    admissionYear: 2026,
    status: "VERIFIED",
    verificationDate: new Date().toISOString(),
    hash: "sha256_329855214431_rvce_verified",
    abcId: "ABC-3298-5521-4431",
    abcCredits: 79,
    cgpa: "8.88"
  },
  {
    id: "STU-1008",
    apaarId: "218744303342",
    rollNo: "PSG-2024-CS-028",
    name: "Meera Krishnan",
    gender: "Female",
    dob: "2005-03-25",
    institutionId: "1-57201923",
    institutionName: "PSG College of Technology",
    branchCode: "CSE",
    branchName: "Computer Science & Engineering",
    admissionCategory: "General",
    quotaCategory: "Single Window Counseling",
    admissionYear: 2026,
    status: "VERIFIED",
    verificationDate: new Date().toISOString(),
    hash: "sha256_218744303342_psg_verified",
    abcId: "ABC-2187-4430-3342",
    abcCredits: 85,
    cgpa: "9.52"
  }
];

export const INITIAL_INTAKE_BREACHES = [
  {
    id: "BRCH-2026-9041",
    institutionId: "1-20491823",
    institutionName: "Delhi Technological University (DTU)",
    branchCode: "CSE",
    branchName: "Computer Science & Engineering",
    approvedIntake: 180,
    supernumerarySeats: 18,
    totalCap: 198,
    actualSubmitted: 204,
    excessCount: 6,
    noticeRef: "AICTE/REG/2026/DL-DTU-0091",
    date: new Date().toISOString(),
    status: "SHOW_CAUSE_ISSUED"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-INIT-1001",
    timestamp: "2026-08-26T00:00:00Z",
    actor: "AICTE_CENTRAL_GATEWAY",
    actorName: "National Sovereign Ledger Node",
    action: "GATEWAY_INITIALIZED",
    details: "AICTE Sovereign Academic Ledger initialized. Live node active and ready for admissions ingestion.",
    ipHash: "10.0.1.1:sha256-init",
    status: "APPROVED_CLEARED",
    recordHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  {
    id: "LOG-INST-2001",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    actor: "CENTRAL_ADMIN",
    actorName: "AICTE Apex Regulation Bureau",
    action: "INSTITUTIONS_VERIFIED",
    details: "Approved intake matrices synchronized for COEP Pune, DTU Delhi, RVCE Bangalore, and PSG Tech.",
    ipHash: "14.139.128.5:sha256-node",
    status: "APPROVED_CLEARED",
    recordHash: "sha256_log_inst_2001_verified"
  },
  {
    id: "LOG-INGEST-3001",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    actor: "NODAL_OFFICER",
    actorName: "Dr. Sudhir Deshmukh (COEP Pune)",
    action: "BATCH_COMMITTED",
    details: "Committed 5 verified candidate admission records with cryptographic APAAR identity verification.",
    ipHash: "103.21.124.9:sha256-coep",
    status: "APPROVED_CLEARED",
    recordHash: "sha256_log_ingest_3001_committed"
  },
  {
    id: "LOG-ANOMALY-4001",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actor: "AICTE_INTAKE_ENFORCER",
    actorName: "Autonomous Dual-Enrolment Interception Daemon",
    action: "CROSS_INSTITUTION_DUPLICATE_FLAGGED",
    details: "Flagged APAAR 6521-4402-9918 for simultaneous active enrollment between COEP Pune and DTU Delhi.",
    ipHash: "10.0.1.2:sha256-interceptor",
    status: "FLAGGED_DUPLICATE",
    recordHash: "sha256_log_anomaly_4001_flagged"
  },
  {
    id: "LOG-VERIFY-5001",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    actor: "AUTHORIZED_VERIFIER",
    actorName: "TCS National Recruitment Verification Node",
    action: "CREDENTIAL_AUTHENTICATED",
    details: "Verified digital B.Tech degree credential for APAAR ID 9823-4512-8831 (Aditi Sharma). Status: Valid Sovereign Degree.",
    ipHash: "115.112.92.14:sha256-tcs",
    status: "VERIFIED",
    recordHash: "sha256_log_verify_5001_sealed"
  }
];

export const SAMPLE_CSV_VALID = `apaar_id,roll_no,name,gender,dob,branch_code,admission_category,is_supernumerary,quota_category,is_nri,is_oci,is_fn,is_tfw
982345128831,2024-CSE-042,Aditi Ramesh Sharma,Female,2005-04-18,CSE,General,false,State Merit,false,false,false,false
814592013342,2024-CSE-088,Rohan Jayesh Patel,Male,2004-11-22,CSE,OBC,false,State Reserved,false,false,false,false
723488910192,2024-AIDS-015,Ananya Sundaram,Female,2005-02-10,AIDS,General,false,Open Merit,false,false,false,false
541277036619,2024-ENTC-031,Kavita Meena,Female,2004-09-14,ENTC,ST,false,Reserved,false,false,false,false`;
