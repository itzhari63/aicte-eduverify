// Central Automated Validation & Anomaly Detection Engine for AICTE-EduVerify
// Strictly implements AICTE Problem Statement 26263 rules

export const ERROR_CODES = {
  MISSING_APAAR: {
    code: "MISSING_APAAR",
    severity: "CRITICAL",
    title: "Missing APAAR ID",
    description: "National academic identity string is required for all student admissions."
  },
  INVALID_APAAR_FORMAT: {
    code: "INVALID_APAAR_FORMAT",
    severity: "CRITICAL",
    title: "Invalid APAAR Format",
    description: "APAAR ID must strictly be a 12-digit numeric identifier (e.g., 9823-4512-8831)."
  },
  DUPLICATE_IN_SUBMISSION: {
    code: "DUPLICATE_IN_SUBMISSION",
    severity: "HIGH",
    title: "Intra-Submission Duplicate",
    description: "Multiple entries with the identical APAAR ID detected in this upload batch."
  },
  CROSS_INSTITUTION_DUPLICATE: {
    code: "CROSS_INSTITUTION_DUPLICATE",
    severity: "CRITICAL",
    title: "Cross-Institution Duplicate Enrolment",
    description: "APAAR ID is already enrolled in another active AICTE-approved institution for the current academic session."
  },
  EXCESS_ENROLMENT: {
    code: "EXCESS_ENROLMENT",
    severity: "CRITICAL",
    title: "Intake Cap Violation (Excess Enrolment)",
    description: "Proposed admissions exceed the AICTE-approved department capacity (Intake + Supernumerary)."
  },
  NRI_AND_FN_BOTH_SET: {
    code: "NRI_AND_FN_BOTH_SET",
    severity: "MEDIUM",
    title: "Conflicting Residency Flags",
    description: "A candidate cannot be tagged concurrently as both Non-Resident Indian (NRI) and Foreign National (FN)."
  },
  OCI_WITHOUT_NRI_OR_FN: {
    code: "OCI_WITHOUT_NRI_OR_FN",
    severity: "MEDIUM",
    title: "Incomplete OCI Declaration",
    description: "Overseas Citizen of India (OCI) status must be accompanied by NRI or FN residential classification."
  },
  SUPERNUMERARY_WITHOUT_QUOTA: {
    code: "SUPERNUMERARY_WITHOUT_QUOTA",
    severity: "HIGH",
    title: "Supernumerary Category Missing",
    description: "Admissions under supernumerary quota require explicit scheme allocation (e.g., EWS, PMSSS, TFW, FN)."
  },
  MISSING_REQUIRED_FIELDS: {
    code: "MISSING_REQUIRED_FIELDS",
    severity: "MEDIUM",
    title: "Incomplete Student Record",
    description: "Student full name, roll number, and department code are mandatory."
  }
};

/**
 * Format 12-digit APAAR ID into XXXX-XXXX-XXXX display format
 */
export function formatApaar(apaar) {
  if (!apaar) return "";
  const cleaned = String(apaar).replace(/\D/g, "");
  if (cleaned.length !== 12) return apaar;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
}

/**
 * Clean APAAR input to raw 12 digits
 */
export function cleanApaar(apaar) {
  if (!apaar) return "";
  return String(apaar).replace(/\D/g, "").trim();
}

/**
 * Pseudo-random SHA256-like hex hash generator for client verification simulation
 */
export function generateMockHash(input) {
  let hash = 0;
  const str = typeof input === "object" ? JSON.stringify(input) : String(input);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `sha256_${hex}${Date.now().toString(16).slice(-8)}`;
}

/**
 * Validate a single student against format, national database, and consistency rules
 */
export function validateStudent(student, allExistingStudents = [], stagedBatch = [], institution = null) {
  const errors = [];
  const warnings = [];

  const rawApaar = cleanApaar(student.apaarId || student.apaar_id);

  // 1. FORMAT & INPUT SANITIZATION
  if (!rawApaar) {
    errors.push({
      ...ERROR_CODES.MISSING_APAAR,
      field: "apaarId"
    });
  } else if (!/^\d{12}$/.test(rawApaar)) {
    errors.push({
      ...ERROR_CODES.INVALID_APAAR_FORMAT,
      field: "apaarId",
      received: student.apaarId
    });
  }

  // 2. REQUIRED BASIC FIELDS
  const name = student.name || student.student_name;
  const rollNo = student.rollNo || student.roll_no;
  const branchCode = student.branchCode || student.branch_code;

  if (!name || !rollNo || !branchCode) {
    errors.push({
      ...ERROR_CODES.MISSING_REQUIRED_FIELDS,
      missing: [!name && "Name", !rollNo && "Roll No", !branchCode && "Branch Code"].filter(Boolean)
    });
  }

  // 3. INTRA-SUBMISSION DUPLICATE DETECTION
  if (rawApaar && /^\d{12}$/.test(rawApaar) && stagedBatch.length > 0) {
    const duplicatesInBatch = stagedBatch.filter(s => {
      const otherApaar = cleanApaar(s.apaarId || s.apaar_id);
      return otherApaar === rawApaar && s !== student;
    });
    if (duplicatesInBatch.length > 0) {
      errors.push({
        ...ERROR_CODES.DUPLICATE_IN_SUBMISSION,
        duplicateCount: duplicatesInBatch.length + 1
      });
    }
  }

  // 4. CROSS-INSTITUTION DUPLICATE DETECTION
  if (rawApaar && /^\d{12}$/.test(rawApaar) && allExistingStudents.length > 0) {
    const currentInstId = institution?.id || student.institutionId;
    const crossMatch = allExistingStudents.find(existing => {
      const existingApaar = cleanApaar(existing.apaarId);
      // check if same APAAR in another institution
      return existingApaar === rawApaar && existing.institutionId !== currentInstId;
    });

    if (crossMatch) {
      errors.push({
        ...ERROR_CODES.CROSS_INSTITUTION_DUPLICATE,
        conflictWith: {
          institutionId: crossMatch.institutionId,
          institutionName: crossMatch.institutionName,
          branchName: crossMatch.branchName || crossMatch.branchCode,
          admissionYear: crossMatch.admissionYear,
          enrolledTimestamp: crossMatch.verificationDate || "2026-08-10T14:00:00Z"
        }
      });
    }
  }

  // 5. DATA CONSISTENCY & BUSINESS RULES
  const isNri = Boolean(student.isNri ?? student.is_nri);
  const isFn = Boolean(student.isFn ?? student.is_fn);
  const isOci = Boolean(student.isOci ?? student.is_oci);
  const isSupernumerary = Boolean(student.isSupernumerary ?? student.is_supernumerary);
  const quotaCategory = (student.quotaCategory || student.quota_category || "").trim();

  // Rule: NRI and FN cannot both be true
  if (isNri && isFn) {
    errors.push({
      ...ERROR_CODES.NRI_AND_FN_BOTH_SET
    });
  }

  // Rule: OCI requires NRI or FN
  if (isOci && !isNri && !isFn) {
    warnings.push({
      ...ERROR_CODES.OCI_WITHOUT_NRI_OR_FN
    });
  }

  // Rule: Supernumerary without quota category
  if (isSupernumerary && (!quotaCategory || quotaCategory === "None" || quotaCategory === "")) {
    errors.push({
      ...ERROR_CODES.SUPERNUMERARY_WITHOUT_QUOTA
    });
  }

  const isValid = errors.length === 0;
  return {
    isValid,
    errors,
    warnings,
    cleanedApaar: rawApaar
  };
}

/**
 * Validate a full batch of students and check against department capacity ceilings
 */
export function validateBatch(studentsArray = [], allExistingStudents = [], institution = null) {
  const staged = [...studentsArray];
  const validatedRecords = [];
  const deptAdmissions = {}; // branchCode -> count of valid submissions

  // 1. Validate each record individually
  staged.forEach(student => {
    const result = validateStudent(student, allExistingStudents, staged, institution);
    const branch = (student.branchCode || student.branch_code || "UNKNOWN").toUpperCase();
    
    validatedRecords.push({
      ...student,
      validationResult: result,
      isValid: result.isValid
    });

    if (result.isValid) {
      deptAdmissions[branch] = (deptAdmissions[branch] || 0) + 1;
    }
  });

  // 2. Capacity & Excess Enrolment Check
  let hasCapacityBreach = false;
  const capacityAudit = {};

  if (institution && institution.departments) {
    institution.departments.forEach(dept => {
      const code = dept.code.toUpperCase();
      const currentEnrolled = dept.enrolledCount || 0;
      const approved = dept.approvedIntake || 0;
      const supernumerary = dept.supernumerarySeats || 0;
      const maxCap = approved + supernumerary;
      const incoming = deptAdmissions[code] || 0;
      const projectedTotal = currentEnrolled + incoming;
      const excess = projectedTotal > maxCap ? projectedTotal - maxCap : 0;

      if (excess > 0) {
        hasCapacityBreach = true;
      }

      capacityAudit[code] = {
        departmentName: dept.name,
        approvedIntake: approved,
        supernumeraryQuota: supernumerary,
        maxCapacity: maxCap,
        currentEnrolled,
        incomingValid: incoming,
        projectedTotal,
        excess,
        status: excess > 0 ? "EXCEEDED" : (projectedTotal === maxCap ? "FULL" : "WITHIN_LIMIT")
      };
    });

    // Tag records in breached departments if intake is overflowed
    validatedRecords.forEach(rec => {
      const branch = (rec.branchCode || rec.branch_code || "").toUpperCase();
      const deptAudit = capacityAudit[branch];
      if (deptAudit && deptAudit.excess > 0) {
        rec.validationResult.warnings.push({
          ...ERROR_CODES.EXCESS_ENROLMENT,
          department: branch,
          excessCount: deptAudit.excess,
          maxCapacity: deptAudit.maxCapacity,
          projected: deptAudit.projectedTotal
        });
      }
    });
  }

  const validCount = validatedRecords.filter(r => r.validationResult.isValid).length;
  const errorCount = validatedRecords.filter(r => !r.validationResult.isValid).length;

  return {
    records: validatedRecords,
    totalRecords: validatedRecords.length,
    validCount,
    errorCount,
    capacityAudit,
    hasCapacityBreach
  };
}

/**
 * Parse CSV string to structured student objects
 */
export function parseStudentCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));
  const students = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
    const row = {};
    headers.forEach((header, idx) => {
      let val = values[idx] || "";
      if (val.toLowerCase() === "true") val = true;
      else if (val.toLowerCase() === "false") val = false;
      row[header] = val;
    });

    students.push({
      id: `BATCH-${Date.now()}-${i}`,
      apaarId: cleanApaar(row.apaar_id || row.apaarid || row.apaar),
      rollNo: row.roll_no || row.rollno || row.roll || `ROLL-${i}`,
      name: row.name || row.student_name || "Unknown Candidate",
      gender: row.gender || "Other",
      dob: row.dob || "2004-01-01",
      branchCode: (row.branch_code || row.branch || "CSE").toUpperCase(),
      admissionCategory: row.admission_category || (row.is_supernumerary ? "Supernumerary" : "General"),
      isSupernumerary: Boolean(row.is_supernumerary),
      quotaCategory: row.quota_category || "",
      isNri: Boolean(row.is_nri),
      isOci: Boolean(row.is_oci),
      isFn: Boolean(row.is_fn),
      isTfw: Boolean(row.is_tfw),
      admissionYear: 2026,
      status: "PENDING_VALIDATION"
    });
  }

  return students;
}
