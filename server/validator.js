import crypto from 'crypto';

// Format APAAR ID with standard hyphen grouping
export function formatApaar(id) {
  if (!id) return "";
  const cleaned = id.toString().replace(/\D/g, "");
  if (cleaned.length !== 12) return id;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
}

// Strictly validate 12-digit APAAR format
export function isValidApaarFormat(id) {
  if (!id) return false;
  const cleaned = id.toString().replace(/\D/g, "");
  return cleaned.length === 12;
}

// Generate deterministic SHA-256 hash for tamper-proof ledger
export function generateLedgerHash(student) {
  const payload = [
    student.apaarId || "",
    student.rollNo || "",
    student.name || "",
    student.institutionId || "",
    student.branchCode || "",
    student.admissionYear || "2026",
    student.quotaCategory || "None"
  ].join("|");
  return crypto.createHash('sha256').update(payload).digest('hex');
}

// Validate candidate admissions batch against current database state and institution quotas
export function validateBatchRecords(batchRecords, currentInstitution, allExistingStudents) {
  const anomalies = [];
  const processedRecords = [];

  const deptMap = {};
  if (currentInstitution?.departments) {
    currentInstitution.departments.forEach(d => {
      deptMap[d.code] = {
        ...d,
        batchCount: 0
      };
    });
  }

  const seenInBatch = new Set();

  batchRecords.forEach((record, idx) => {
    const rowNum = idx + 2;
    const apaarClean = (record.apaar_id || record.apaarId || "").toString().replace(/\D/g, "");

    // 1. Mandatory format check
    if (!apaarClean || apaarClean.length !== 12) {
      anomalies.push({
        row: rowNum,
        apaarId: record.apaar_id || record.apaarId || "MISSING",
        studentName: record.name || "Unknown",
        code: "INVALID_APAAR_FORMAT",
        severity: "CRITICAL",
        message: `Row ${rowNum}: Invalid APAAR ID format. Must strictly be a 12-digit identifier.`
      });
    }

    // 2. Intra-batch duplicate
    if (apaarClean && seenInBatch.has(apaarClean)) {
      anomalies.push({
        row: rowNum,
        apaarId: apaarClean,
        studentName: record.name,
        code: "DUPLICATE_IN_SUBMISSION",
        severity: "HIGH",
        message: `Row ${rowNum}: Duplicate APAAR ID ${formatApaar(apaarClean)} repeated inside this batch.`
      });
    } else if (apaarClean) {
      seenInBatch.add(apaarClean);
    }

    // 3. Cross-institution duplicate check
    const existingStudent = allExistingStudents.find(
      s => (s.apaarId || "").toString().replace(/\D/g, "") === apaarClean
    );

    let status = "VERIFIED";
    let conflictInfo = null;

    if (existingStudent) {
      if (existingStudent.institutionId !== currentInstitution?.id) {
        status = "FLAGGED_DUPLICATE";
        conflictInfo = {
          institutionId: existingStudent.institutionId,
          institutionName: existingStudent.institutionName,
          branchName: existingStudent.branchName || existingStudent.branchCode,
          enrolledDate: existingStudent.verificationDate || new Date().toISOString()
        };

        anomalies.push({
          row: rowNum,
          apaarId: apaarClean,
          studentName: record.name,
          code: "CROSS_INSTITUTION_DUPLICATE",
          severity: "CRITICAL",
          message: `Row ${rowNum}: Dual enrolment intercepted! Already enrolled at ${existingStudent.institutionName} (${existingStudent.branchName}).`
        });
      }
    }

    // 4. Department capacity tracking
    const bCode = (record.branch_code || record.branchCode || "CSE").toUpperCase();
    if (deptMap[bCode]) {
      deptMap[bCode].batchCount += 1;
      const totalAllowed = (deptMap[bCode].approvedIntake || 0) + (deptMap[bCode].supernumerarySeats || 0);
      const prospectiveTotal = (deptMap[bCode].enrolledCount || 0) + deptMap[bCode].batchCount;

      if (prospectiveTotal > totalAllowed) {
        anomalies.push({
          row: rowNum,
          apaarId: apaarClean,
          studentName: record.name,
          code: "EXCESS_ENROLMENT",
          severity: "CRITICAL",
          message: `Row ${rowNum}: Department ${bCode} intake breach! Prospective: ${prospectiveTotal} / Allowed: ${totalAllowed}.`
        });
      }
    }

    const studentObj = {
      id: `STU-GEN-${Date.now()}-${idx}`,
      apaarId: apaarClean,
      rollNo: record.roll_no || record.rollNo || `2026-${bCode}-${String(idx + 1).padStart(3, '0')}`,
      name: record.name || "Enrolled Candidate",
      gender: record.gender || "Unspecified",
      dob: record.dob || "2004-01-01",
      institutionId: currentInstitution?.id || "1-10293847",
      institutionName: currentInstitution?.name || "COEP Technological University",
      branchCode: bCode,
      branchName: deptMap[bCode]?.name || bCode,
      admissionYear: 2026,
      admissionCategory: record.admission_category || record.admissionCategory || (record.is_supernumerary ? "Supernumerary" : "General"),
      isSupernumerary: String(record.is_supernumerary) === "true",
      quotaCategory: record.quota_category || record.quotaCategory || "None",
      isNri: String(record.is_nri) === "true",
      isOci: String(record.is_oci) === "true",
      isFn: String(record.is_fn) === "true",
      isTfw: String(record.is_tfw) === "true",
      abcId: `ABC-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${apaarClean.slice(-4) || '8821'}`,
      abcCredits: 76,
      cgpa: "9.15",
      status: status,
      conflictWith: conflictInfo,
      verificationDate: new Date().toISOString(),
      hash: generateLedgerHash({
        apaarId: apaarClean,
        rollNo: record.roll_no || record.rollNo,
        name: record.name,
        institutionId: currentInstitution?.id,
        branchCode: bCode,
        admissionYear: 2026
      })
    };

    processedRecords.push(studentObj);
  });

  return {
    valid: anomalies.filter(a => a.severity === 'CRITICAL').length === 0,
    anomalies,
    criticalCount: anomalies.filter(a => a.severity === 'CRITICAL').length,
    warningCount: anomalies.filter(a => a.severity !== 'CRITICAL').length,
    processedRecords
  };
}
