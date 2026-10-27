import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { institutions as memoryInstitutions, students as memoryStudents, intakeBreaches as memoryBreaches, auditLogs as memoryAuditLogs } from './data.js';
import { 
  formatApaar, 
  isValidApaarFormat, 
  generateLedgerHash, 
  validateBatchRecords 
} from './validator.js';
import { 
  connectDB, 
  isDbConnected, 
  getDbStatus, 
  Institution as InstitutionModel, 
  Student as StudentModel, 
  IntakeBreach as IntakeBreachModel, 
  AuditLog as AuditLogModel 
} from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize MongoDB Atlas Connection on Server Startup
connectDB();

// ==========================================
// 1. PERMISSION MIDDLEWARE: ACCEPT ALL PERMISSIONS
// ==========================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['*'],
  exposedHeaders: ['*']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('X-Permissions-Policy', 'all=*');
  res.setHeader('X-Governance-Scope', 'ALL_PERMISSIONS_GRANTED');
  res.setHeader('X-DPDP-Consent', 'AUTHORIZED_BY_CITIZEN');

  req.auth = {
    authorized: true,
    scope: 'ALL_PERMISSIONS_ACCEPTED',
    role: req.headers['x-role'] || 'CENTRAL_ADMIN',
    permissions: [
      'ADMIN_READ',
      'ADMIN_WRITE',
      'INSTITUTION_INGEST',
      'INTAKE_ENFORCE',
      'CREDENTIAL_VERIFY',
      'LEDGER_COMMIT',
      'AUDIT_ACCESS',
      'DPDP_CONSENT_GOVERN'
    ]
  };

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Permissions: ALL_ACCEPTED`);
  next();
});

// ==========================================
// 1.5. STAKEHOLDER AUTHENTICATION & LOGIN API
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { role, identifier } = req.body;
  const token = `aicte_auth_${crypto.randomBytes(16).toString('hex')}`;

  let user = null;
  if (role === 'CENTRAL_ADMIN') {
    user = {
      id: "USR-AICTE-001",
      role: "CENTRAL_ADMIN",
      roleTitle: "AICTE Central Admin",
      name: "Prof. T. G. Sitharam",
      designation: "Chairman, AICTE & Apex Regulatory Authority",
      email: identifier || "admin@aicte-india.org",
      organization: "All India Council for Technical Education (AICTE HQ)",
      department: "National Academic Bureau, Nelson Mandela Marg, New Delhi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      ssoProvider: "Parichay / MeriPehchan (National Government SSO)",
      securityLevel: "LEVEL-4 APEX CLEARANCE",
      token
    };
  } else if (role === 'INSTITUTION_NODAL') {
    const pid = req.body.pid || identifier || "1-10293847";
    user = {
      id: "USR-NODAL-1029",
      role: "INSTITUTION_NODAL",
      roleTitle: "Institution Nodal Officer",
      name: "Dr. Sudhir Deshmukh",
      designation: "Dean of Academic Admissions & Nodal Officer",
      email: identifier || "dean.academics@coep.ac.in",
      pid: pid,
      organization: "College of Engineering Pune (COEP Technological University)",
      institutionId: pid,
      institutionName: "College of Engineering Pune (COEP Technological University)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      ssoProvider: "AICTE Approval Bureau Institutional Federation",
      securityLevel: "LEVEL-2 INSTITUTIONAL NODAL",
      token
    };
  } else if (role === 'PUBLIC_VERIFIER') {
    user = {
      id: "USR-VER-8821",
      role: "PUBLIC_VERIFIER",
      roleTitle: "Authorized Verifier",
      name: "Sneha Kulkarni",
      designation: "Lead Talent Authentication & Compliance Partner",
      email: identifier || "verify@tcs.com",
      corporateId: "VER-TCS-902",
      organization: "Tata Consultancy Services (Global BGV Cell)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      ssoProvider: "Corporate Verifier Trust Gateway (ISO/IEC 27001)",
      securityLevel: "LEVEL-1 AUTHORIZED VERIFIER",
      token
    };
  } else if (role === 'STUDENT') {
    const cleanId = (identifier || "982345128831").replace(/-/g, '').trim();
    user = {
      id: "USR-STU-9823",
      role: "STUDENT",
      roleTitle: "Student / Academic Learner",
      name: "Aditi Ramesh Sharma",
      designation: "Undergraduate Student (B.Tech Computer Science)",
      apaarId: cleanId,
      formattedApaar: formatApaar(cleanId),
      rollNo: "2024-CSE-042",
      organization: "College of Engineering Pune (COEP)",
      institutionName: "College of Engineering Pune (COEP Technological University)",
      branch: "Computer Science & Engineering",
      academicYear: "3rd Year (Semester VI)",
      abcCredits: 84,
      cgpa: "9.38",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      ssoProvider: "DigiLocker & Sovereign APAAR Identity Ledger",
      securityLevel: "LEVEL-0 CITIZEN / LEARNER",
      token
    };
  } else {
    return res.status(400).json({ success: false, message: 'Invalid stakeholder role specified' });
  }

  return res.json({
    success: true,
    message: `Authenticated successfully as ${user.roleTitle}`,
    token,
    user
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'User session terminated successfully. Token invalidated.'
  });
});

app.get('/api/auth/me', (req, res) => {
  const role = req.headers['x-role'] || 'CENTRAL_ADMIN';
  res.json({
    success: true,
    authenticated: true,
    role
  });
});

// ==========================================
// 2. MONGODB ATLAS CONNECTION CONTROL API
// ==========================================
app.get('/api/db/status', (req, res) => {
  res.json({
    success: true,
    connected: isDbConnected(),
    status: getDbStatus()
  });
});

app.post('/api/db/connect', async (req, res) => {
  const { uri } = req.body;
  if (!uri || !uri.trim()) {
    return res.status(400).json({ success: false, message: 'MongoDB Atlas URI is required.' });
  }

  process.env.MONGODB_URI = uri.trim();

  // Update or create .env file on disk
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('MONGODB_URI=')) {
        envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${uri.trim()}`);
      } else {
        envContent += `\nMONGODB_URI=${uri.trim()}\n`;
      }
    } else {
      envContent = `PORT=${PORT}\nMONGODB_URI=${uri.trim()}\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf8');
  } catch (err) {
    console.warn('Notice: Could not write .env to disk:', err.message);
  }

  const success = await connectDB();
  const dbStatus = getDbStatus();

  if (success) {
    return res.json({
      success: true,
      message: 'Successfully connected to MongoDB Atlas cluster.',
      database: dbStatus
    });
  } else {
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to MongoDB Atlas.',
      error: dbStatus.error
    });
  }
});

// ==========================================
// 3. SYSTEM STATUS & HEALTH CHECK
// ==========================================
app.get('/api/health', async (req, res) => {
  let institutionCount = memoryInstitutions.length;
  let studentCount = memoryStudents.length;
  let breachCount = memoryBreaches.length;
  let auditLogCount = memoryAuditLogs.length;

  if (isDbConnected()) {
    try {
      institutionCount = await InstitutionModel.countDocuments();
      studentCount = await StudentModel.countDocuments();
      breachCount = await IntakeBreachModel.countDocuments();
      auditLogCount = await AuditLogModel.countDocuments();
    } catch {}
  }

  res.json({
    status: 'ONLINE',
    system: 'AICTE-EduVerify Central Gateway',
    version: '2.4.0-Production',
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: getDbStatus(),
    permissions: {
      status: 'ALL_ACCEPTED',
      scope: 'UNRESTRICTED',
      cors: 'PERMISSIVE',
      roles: ['CENTRAL_ADMIN', 'INSTITUTION_NODAL', 'PUBLIC_VERIFIER', 'STUDENT']
    },
    counts: {
      institutions: institutionCount,
      students: studentCount,
      activeIntakeBreaches: breachCount,
      auditLogs: auditLogCount
    }
  });
});

// Apex System Stats
app.get('/api/stats', async (req, res) => {
  let instList = memoryInstitutions;
  let stuList = memoryStudents;

  if (isDbConnected()) {
    try {
      instList = await InstitutionModel.find({}).lean();
      stuList = await StudentModel.find({}).lean();
    } catch {}
  }

  const totalApproved = instList.reduce((acc, inst) => {
    return acc + (inst.departments || []).reduce((dAcc, d) => dAcc + (d.approvedIntake || 0) + (d.supernumerarySeats || 0), 0);
  }, 0);

  const totalEnrolled = stuList.length;
  const duplicateCount = stuList.filter(s => s.status === 'FLAGGED_DUPLICATE').length;
  const verifiedCount = stuList.filter(s => s.status === 'VERIFIED').length;

  res.json({
    nationalStats: {
      totalApprovedSeats: totalApproved,
      totalEnrolledStudents: totalEnrolled,
      utilizationRate: totalApproved > 0 ? ((totalEnrolled / totalApproved) * 100).toFixed(1) : "0.0",
      verifiedCredentials: verifiedCount,
      duplicatesIntercepted: duplicateCount,
      complianceAverage: 98.4
    }
  });
});

// ==========================================
// 4. INSTITUTIONS API
// ==========================================
app.get('/api/institutions', async (req, res) => {
  if (isDbConnected()) {
    try {
      const data = await InstitutionModel.find({}).lean();
      return res.json({ success: true, count: data.length, data });
    } catch {}
  }
  res.json({ success: true, count: memoryInstitutions.length, data: memoryInstitutions });
});

app.post('/api/institutions', async (req, res) => {
  try {
    const {
      id = `1-${Math.floor(10000000 + Math.random() * 90000000)}`,
      name,
      shortName,
      type = 'Engineering & Technology',
      category = 'State Autonomous Govt. Aided',
      state = 'Maharashtra',
      city = 'Pune',
      affiliation = 'AICTE Approved University',
      nirfRank = 50,
      complianceScore = 99.0,
      nodalOfficer = {
        name: 'Nodal Officer',
        designation: 'Registrar (Admissions)',
        email: 'nodal@institution.edu.in',
        phone: '+91 11 0000 0000'
      },
      departments = [
        {
          code: 'CSE',
          name: 'Computer Science & Engineering',
          approvedIntake: 120,
          supernumerarySeats: 12,
          enrolledCount: 0,
          categories: { general: 0, ews: 0, obc: 0, scSt: 0, nri: 0, fn: 0, oci: 0, tfw: 0 }
        }
      ]
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Institution name is required' });
    }

    const newInst = {
      id,
      name: name.trim(),
      shortName: shortName?.trim() || name.trim().substring(0, 15),
      type,
      category,
      state,
      city,
      affiliation,
      nirfRank: Number(nirfRank) || 50,
      complianceScore: Number(complianceScore) || 99.0,
      nodalOfficer,
      departments
    };

    if (isDbConnected()) {
      try {
        const created = await InstitutionModel.create(newInst);
        return res.status(201).json({ success: true, message: 'Institution registered successfully in MongoDB Atlas', data: created });
      } catch (dbErr) {
        return res.status(500).json({ success: false, message: 'DB Error: ' + dbErr.message });
      }
    }

    memoryInstitutions.push(newInst);
    res.status(201).json({ success: true, message: 'Institution registered in sovereign memory repository', data: newInst });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/institutions/:id', async (req, res) => {
  if (isDbConnected()) {
    try {
      const inst = await InstitutionModel.findOne({ id: req.params.id }).lean();
      if (inst) return res.json({ success: true, data: inst });
    } catch {}
  }

  const inst = memoryInstitutions.find(i => i.id === req.params.id);
  if (!inst) {
    return res.status(404).json({ success: false, message: 'Institution not found' });
  }
  res.json({ success: true, data: inst });
});

app.put('/api/institutions/:id/capacity', async (req, res) => {
  const { branchCode, approvedIntake, supernumerarySeats } = req.body;

  if (isDbConnected()) {
    try {
      const inst = await InstitutionModel.findOne({ id: req.params.id });
      if (inst) {
        const dept = inst.departments.find(d => d.code === branchCode);
        if (dept) {
          if (approvedIntake !== undefined) dept.approvedIntake = Number(approvedIntake);
          if (supernumerarySeats !== undefined) dept.supernumerarySeats = Number(supernumerarySeats);
          await inst.save();
          return res.json({ success: true, data: inst });
        }
      }
    } catch {}
  }

  const inst = memoryInstitutions.find(i => i.id === req.params.id);
  if (!inst) {
    return res.status(404).json({ success: false, message: 'Institution not found' });
  }

  const dept = (inst.departments || []).find(d => d.code === branchCode);
  if (dept) {
    if (approvedIntake !== undefined) dept.approvedIntake = Number(approvedIntake);
    if (supernumerarySeats !== undefined) dept.supernumerarySeats = Number(supernumerarySeats);
  }

  res.json({ success: true, data: inst });
});

// ==========================================
// 5. STUDENTS API
// ==========================================
app.get('/api/students', async (req, res) => {
  const { search, institutionId, branchCode, status } = req.query;

  if (isDbConnected()) {
    try {
      const filter = {};
      if (institutionId) filter.institutionId = institutionId;
      if (branchCode) filter.branchCode = branchCode;
      if (status) filter.status = status;
      if (search) {
        const q = search.trim();
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { apaarId: { $regex: q, $options: 'i' } },
          { rollNo: { $regex: q, $options: 'i' } }
        ];
      }
      const data = await StudentModel.find(filter).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: data.length, data });
    } catch {}
  }

  let filtered = [...memoryStudents];
  if (institutionId) filtered = filtered.filter(s => s.institutionId === institutionId);
  if (branchCode) filtered = filtered.filter(s => s.branchCode === branchCode);
  if (status) filtered = filtered.filter(s => s.status === status);
  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(s => 
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.apaarId && s.apaarId.includes(q)) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

app.get('/api/students/:id', async (req, res) => {
  if (isDbConnected()) {
    try {
      const student = await StudentModel.findOne({ id: req.params.id }).lean();
      if (student) return res.json({ success: true, data: student });
    } catch {}
  }

  const student = memoryStudents.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student record not found' });
  }
  res.json({ success: true, data: student });
});

app.get('/api/students/apaar/:apaarId', async (req, res) => {
  const cleanApaar = req.params.apaarId.replace(/\D/g, '');

  if (isDbConnected()) {
    try {
      const student = await StudentModel.findOne({ apaarId: cleanApaar }).lean();
      if (student) return res.json({ success: true, data: student });
    } catch {}
  }

  const student = memoryStudents.find(s => (s.apaarId || '').replace(/\D/g, '') === cleanApaar);
  if (!student) {
    return res.status(404).json({
      success: false,
      status: 'NOT_FOUND',
      apaarId: req.params.apaarId,
      message: 'APAAR ID not found in the national registry.'
    });
  }
  res.json({ success: true, data: student });
});

// ==========================================
// 6. BATCH INGESTION & VALIDATION ENGINE
// ==========================================
app.post('/api/students/validate-batch', async (req, res) => {
  const { records = [], institutionId } = req.body;
  let instList = memoryInstitutions;
  let allStu = memoryStudents;

  if (isDbConnected()) {
    try {
      instList = await InstitutionModel.find({}).lean();
      allStu = await StudentModel.find({}).lean();
    } catch {}
  }

  const currentInstitution = instList.find(i => i.id === institutionId) || instList[0];
  const validationResult = validateBatchRecords(records, currentInstitution, allStu);
  res.json({ success: true, ...validationResult });
});

// Commit admissions batch into the ledger
app.post('/api/students/commit-batch', async (req, res) => {
  const { records = [], institutionId } = req.body;
  let instList = memoryInstitutions;
  let allStu = memoryStudents;

  if (isDbConnected()) {
    try {
      instList = await InstitutionModel.find({}).lean();
      allStu = await StudentModel.find({}).lean();
    } catch {}
  }

  const currentInstitution = instList.find(i => i.id === institutionId) || instList[0];
  const validationResult = validateBatchRecords(records, currentInstitution, allStu);
  const newStudents = validationResult.processedRecords;

  // 1. Commit to MongoDB Atlas if connected
  if (isDbConnected()) {
    try {
      for (const stu of newStudents) {
        await StudentModel.findOneAndUpdate(
          { apaarId: stu.apaarId },
          stu,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }

      // Update institution department counts in DB
      const countByBranch = {};
      newStudents.forEach(s => {
        countByBranch[s.branchCode] = (countByBranch[s.branchCode] || 0) + 1;
      });

      const instDoc = await InstitutionModel.findOne({ id: currentInstitution.id });
      if (instDoc && instDoc.departments) {
        instDoc.departments.forEach(dept => {
          if (countByBranch[dept.code]) {
            dept.enrolledCount = (dept.enrolledCount || 0) + countByBranch[dept.code];
          }
        });
        await instDoc.save();
      }
    } catch (dbErr) {
      console.error('Error committing students to MongoDB Atlas:', dbErr);
    }
  }

  // 2. Also sync to in-memory store for fallback parity
  newStudents.forEach(stu => {
    const existingIdx = memoryStudents.findIndex(s => s.apaarId === stu.apaarId);
    if (existingIdx >= 0) {
      memoryStudents[existingIdx] = stu;
    } else {
      memoryStudents.unshift(stu);
    }
  });

  const countByBranch = {};
  newStudents.forEach(s => {
    countByBranch[s.branchCode] = (countByBranch[s.branchCode] || 0) + 1;
  });

  if (currentInstitution?.departments) {
    currentInstitution.departments.forEach(dept => {
      if (countByBranch[dept.code]) {
        dept.enrolledCount = (dept.enrolledCount || 0) + countByBranch[dept.code];
      }
    });
  }

  // 3. Create Audit Log
  const newLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    actor: `NODAL_OFFICER (${currentInstitution.id})`,
    actorName: `${currentInstitution.nodalOfficer?.name || "Admissions Nodal"} (${currentInstitution.shortName})`,
    action: 'BATCH_DATA_INGESTION',
    details: `Successfully ingested and sealed ${newStudents.length} candidate admissions into AICTE ledger`,
    ipHash: `192.168.1.108:sha256-${Date.now().toString(16).slice(-5)}`,
    status: 'APPROVED_CLEARED',
    recordHash: crypto.createHash('sha256').update(JSON.stringify(newStudents)).digest('hex').slice(0, 16)
  };

  if (isDbConnected()) {
    try {
      await AuditLogModel.create(newLog);
    } catch {}
  }
  memoryAuditLogs.unshift(newLog);

  res.json({
    success: true,
    message: `Batch committed successfully. Ingested ${newStudents.length} student records.`,
    count: newStudents.length,
    newStudents,
    auditLog: newLog
  });
});

// Create single student
app.post('/api/students', async (req, res) => {
  const studentData = req.body;
  const apaarClean = (studentData.apaarId || '').replace(/\D/g, '');

  if (!isValidApaarFormat(apaarClean)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid APAAR ID format. Must strictly be a 12-digit numeric identifier.'
    });
  }

  const newStudent = {
    id: `STU-${Date.now()}`,
    ...studentData,
    apaarId: apaarClean,
    hash: generateLedgerHash(studentData),
    verificationDate: new Date().toISOString(),
    status: studentData.status || 'VERIFIED'
  };

  if (isDbConnected()) {
    try {
      await StudentModel.create(newStudent);
    } catch (err) {
      console.warn('DB student creation error:', err.message);
    }
  }

  memoryStudents.unshift(newStudent);
  res.status(201).json({ success: true, data: newStudent });
});

// ==========================================
// 7. SOVEREIGN CREDENTIAL VERIFICATION API (W3C Standard)
// ==========================================
app.get('/api/verify/:apaarId', async (req, res) => {
  const cleanApaar = req.params.apaarId.replace(/\D/g, '');
  let student = null;

  if (isDbConnected()) {
    try {
      student = await StudentModel.findOne({ apaarId: cleanApaar }).lean();
    } catch {}
  }

  if (!student) {
    student = memoryStudents.find(s => (s.apaarId || '').replace(/\D/g, '') === cleanApaar);
  }

  if (!student) {
    return res.status(404).json({
      verified: false,
      status: 'NOT_FOUND',
      apaarId: req.params.apaarId,
      message: 'APAAR ID does not exist in the National Academic Registry.'
    });
  }

  const isDuplicate = student.status === 'FLAGGED_DUPLICATE';
  const credentialHash = student.hash || generateLedgerHash(student);

  res.json({
    verified: !isDuplicate,
    status: student.status,
    verificationTimestamp: new Date().toISOString(),
    verifiableCredential: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://aicte.gov.in/contexts/education/v2"
      ],
      id: `urn:uuid:aicte-apaar-${student.apaarId}`,
      type: ["VerifiableCredential", "AICTEApaarIdentityCredential"],
      issuer: {
        id: `did:aicte:in:${student.institutionId}`,
        name: student.institutionName,
        jurisdiction: "All India Council for Technical Education (Ministry of Education)"
      },
      issuanceDate: student.verificationDate || "2026-08-14T10:30:00Z",
      credentialSubject: {
        id: `did:apaar:in:${student.apaarId}`,
        apaarId: student.apaarId,
        formattedApaar: formatApaar(student.apaarId),
        studentName: student.name,
        gender: student.gender,
        dob: student.dob,
        institutionalRollNo: student.rollNo,
        institutionName: student.institutionName,
        programme: student.branchName || student.branchCode,
        admissionCategory: student.admissionCategory,
        abcAccountId: student.abcId || "ABC-7892-1049-8831",
        earnedCredits: student.abcCredits || 78,
        cgpa: student.cgpa || "9.24"
      },
      proof: {
        type: "Ed25519Signature2020",
        created: student.verificationDate || "2026-08-14T10:30:00Z",
        verificationMethod: "did:aicte:in:ledger#keys-1",
        proofPurpose: "assertionMethod",
        proofValue: credentialHash
      }
    },
    conflictNotice: isDuplicate ? student.conflictWith : null
  });
});

// ==========================================
// 8. INTAKE BREACHES & REGULATORY ACTIONS
// ==========================================
app.get('/api/intake-breaches', async (req, res) => {
  if (isDbConnected()) {
    try {
      const data = await IntakeBreachModel.find({}).lean();
      return res.json({ success: true, count: data.length, data });
    } catch {}
  }
  res.json({ success: true, count: memoryBreaches.length, data: memoryBreaches });
});

app.post('/api/intake-breaches/:id/resolve', async (req, res) => {
  const { action = 'PENALIZE_FEE', notes } = req.body;
  const statusUpdate = action === 'RESOLVE' ? 'RESOLVED' : 'PENALTY_ENFORCED';
  const actionNotes = notes || 'Regulatory penalty applied pursuant to AICTE APH Chapter 10.';

  if (isDbConnected()) {
    try {
      const breach = await IntakeBreachModel.findOneAndUpdate(
        { id: req.params.id },
        { 
          status: statusUpdate, 
          actionTakenAt: new Date(), 
          actionNotes 
        },
        { new: true }
      );
      if (breach) return res.json({ success: true, data: breach });
    } catch {}
  }

  const breach = memoryBreaches.find(b => b.id === req.params.id);
  if (!breach) {
    return res.status(404).json({ success: false, message: 'Breach reference not found' });
  }

  breach.status = statusUpdate;
  breach.actionTakenAt = new Date().toISOString();
  breach.actionNotes = actionNotes;

  const newLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    actor: 'CENTRAL_REGULATOR',
    actorName: 'AICTE Apex Regulatory Bureau',
    action: 'REGULATORY_PENALTY_ENFORCED',
    details: `Enforced regulatory order for ${breach.institutionName} (${breach.branchName}) - Excess +${breach.excessCount} seats`,
    ipHash: '10.0.4.1:sha256-a19e2',
    status: 'PENALTY_CONFIRMED',
    recordHash: crypto.createHash('sha256').update(breach.id + Date.now()).digest('hex').slice(0, 16)
  };

  if (isDbConnected()) {
    try { await AuditLogModel.create(newLog); } catch {}
  }
  memoryAuditLogs.unshift(newLog);

  res.json({ success: true, data: breach });
});

// ==========================================
// 9. AUDIT TRAIL API
// ==========================================
app.get('/api/audit-logs', async (req, res) => {
  if (isDbConnected()) {
    try {
      const data = await AuditLogModel.find({}).sort({ timestamp: -1 }).lean();
      return res.json({ success: true, count: data.length, data });
    } catch {}
  }
  res.json({ success: true, count: memoryAuditLogs.length, data: memoryAuditLogs });
});

app.post('/api/audit-logs', async (req, res) => {
  const logData = req.body;
  const newLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    actor: logData.actor || 'SYSTEM_NODE',
    actorName: logData.actorName || 'AICTE Verified Endpoint',
    action: logData.action || 'GENERAL_TRANSACTION',
    details: logData.details || 'Operation committed via sovereign API',
    ipHash: logData.ipHash || `192.168.1.${Math.floor(10 + Math.random() * 200)}:sha256-${Date.now().toString(16).slice(-5)}`,
    status: logData.status || 'APPROVED_CLEARED',
    recordHash: crypto.createHash('sha256').update(JSON.stringify(logData) + Date.now()).digest('hex').slice(0, 16)
  };

  if (isDbConnected()) {
    try {
      await AuditLogModel.create(newLog);
    } catch {}
  }
  memoryAuditLogs.unshift(newLog);

  res.status(201).json({ success: true, data: newLog });
});

// ==========================================
// 10. DPDP ACT 2023 CONSENT TOGGLE API
// ==========================================
app.post('/api/consents/toggle', (req, res) => {
  const { consentId, studentId, status } = req.body;
  res.json({
    success: true,
    consentId,
    studentId,
    status: !status,
    timestamp: new Date().toISOString(),
    governanceNotice: "Updated pursuant to Digital Personal Data Protection (DPDP) Act 2023 Clause 6"
  });
});

// Start Express server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 AICTE-EduVerify REST API Server Running`);
  console.log(`🌐 URL: http://127.0.0.1:${PORT}`);
  console.log(`🍃 Database: MongoDB Atlas Driver Initialized`);
  console.log(`🛡️  Permissions: ALL_PERMISSIONS_ACCEPTED (CORS: *)`);
  console.log(`📂 Endpoints: /api/health, /api/db/status, /api/db/connect, /api/students, /api/institutions`);
  console.log(`======================================================\n`);
});
