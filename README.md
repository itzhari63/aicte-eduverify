# AICTE-EduVerify: APAAR-Based Student Data Management & Verification Portal
### Smart India Hackathon 2026 | Problem Statement ID: 26263
**Organization:** All India Council for Technical Education (AICTE)  
**Department:** Regulation Bureau  
**Theme:** Smart Automation  
**Category:** Software  

---

## 🇮🇳 Executive Summary & Mission
**AICTE-EduVerify** is an enterprise-grade, production-ready web platform engineered to bridge the critical gap between AICTE macro-level institution intake approvals and micro-level student enrollments using India's sovereign academic identifier: **APAAR ID (Automated Permanent Academic Account Registry / One Nation One Student ID)**.

Under current processes, non-PGDM institutions traditionally report only aggregated statistical headcounts during annual approval cycles. This creates major regulatory vulnerabilities:
1. **Backdoor Excess Admissions:** Institutions enrolling students beyond the sanctioned approved intake.
2. **Ghost & Dual Enrolments:** Students simultaneously registered across multiple universities or blocking seats across states.
3. **Fragmented Academic Records:** Lack of tamper-proof credential verification linked to a lifelong sovereign academic identity.

**AICTE-EduVerify** provides an end-to-end digital governance ecosystem:
$$\text{Institution} \xrightarrow{\text{Upload}} \text{Automated APAAR Engine} \xrightarrow{\text{Verification}} \text{AICTE Central Repository} \xrightarrow{\text{Analytics}} \text{Authorized Stakeholders}$$

---

## 🏛️ Core System Architecture & Modules

```mermaid
graph TD
    A[AICTE-Approved Institution / College ERP] -->|Batch CSV / REST API Webhook| B[AICTE Ingestion Gateway]
    B --> C{Central Automated Validation Engine}
    C -->|Format Check| C1[12-Digit Numeric Regex Validator]
    C -->|Intra-Batch Check| C2[Duplicate Submission Filter]
    C -->|National Registry Check| C3[Cross-Institution Duplicate Sentinel]
    C -->|Capacity Enforcer| C4[Approved Intake + Supernumerary Cap Guard]
    C -->|Business Logic| C5[NRI / FN / OCI / TFW Consistency Matrix]
    
    C -->|Pass| D[(AICTE Sovereign Central Ledger)]
    C -->|Fail| E[Submission Lock & Anomaly Flagging Desk]
    
    D --> F[AICTE Central Command & Geo-Spatial Heatmap]
    D --> G[Public & Employer Verification Gateway]
    D --> H[Verifiable Degree Certificate Engine with APAAR]
    D --> I[Student Digital Identity Wallet & DPDP Consent Manager]
    D --> J[National Policy & Accreditation Reports (NIRF, NAAC, Parliament)]
```

---

## 🌟 Key Features Strictly Fulfilling Problem Statement 26263

### 1. Multi-Tenant Role-Based Access Control (RBAC)
- 🏛️ **AICTE Central Administrator (Regulation Bureau Apex):** Real-time nationwide analytics, macro anomaly tracking, state-by-state intake utilization, cross-institution duplicate desk, show-cause notice generator.
- 🏫 **Institutional Nodal Officer (e.g. COEP Technological University):** Department intake setup, quota gauges, multi-method ingestion studio (CSV, API Webhook, walk-in modal), pre-upload staging grid with inline editing.
- 🔍 **Authorized Verifier / Employer:** Privacy-preserving degree verification portal verifying credentials without leaking sensitive personal identifiers (compliant with the DPDP Act 2023).
- 🎓 **Student Portal & Consent Manager:** Official Ministry of Education Digital APAAR ID Card, Academic Bank of Credits (ABC) handshake (78+ credits), and sovereign consent management toggles.

### 2. Multi-Layered Automated Validation Engine
- **Strict 12-Digit Format Enforcer:** Regex validation (`^\d{12}$` or `XXXX-XXXX-XXXX`).
- **Intra-Submission Duplicate Detection:** Detects duplicate APAAR submissions within the same batch upload.
- **Cross-Institution Duplicate Sentinel:** Scans the national repository to catch students concurrently enrolled in two independent colleges in the same academic cycle.
- **Intake Ceiling & Capacity Enforcer:** Enforces `(Approved Intake + Supernumerary Seats)` per department. Hard-locks regulatory submissions if intake is breached.
- **Data Consistency & Quota Rules:**
  * `NRI_AND_FN_BOTH_SET`: Flags conflicting residency statuses.
  * `OCI_WITHOUT_NRI_OR_FN`: Ensures OCI status is paired with residential classification.
  * `SUPERNUMERARY_WITHOUT_QUOTA`: Validates scheme assignment (EWS, PMSSS, TFW, JK Migrants).

### 3. Verifiable Certificates Carrying APAAR ID (Requirement 10)
- Degree certificates display the **12-digit APAAR ID printed side-by-side with the Institutional Roll Number**.
- Embeds a dynamic cryptographic QR code encoding a tamper-evident W3C Verifiable Credential payload signed with an AICTE SHA-256 seal.
- Features an AICTE Gold Hologram Seal, formal border embellishments, and print-ready PDF export.

### 4. Policy & Regulatory Reports Engine
- One-click generated certified dossiers:
  * 📋 **NIRF Student Intake Compliance Dossier**
  * 🏛️ **NAAC / NBA Criterion 2.1 Enrolment Verification Report**
  * 🇮🇳 **Parliament Lok Sabha / Rajya Sabha Starred Question Reference Report**
  * 📊 **All-India Supernumerary (PMSSS/EWS/FN) Audit Report**
- Available in print preview and downloadable CSV format.

### 5. Cryptographic Regulatory Audit Trail
- SHA-256 chained transaction logs tracking every upload, anomaly trigger, regulatory freeze, and verification query with timestamp, actor role, and IP hash.

---

## 🚀 Running the Project Locally

```bash
# Clone the repository
git clone <repo-url>
cd SIH

# Install dependencies
npm install

# Configure MongoDB Atlas (Optional - in-memory fallback enabled by default)
# Create a .env file or use the web portal's "Connect Atlas" modal
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/aicte_eduverify?retryWrites=true&w=majority

# Start backend server
npm run server
# Running at: http://127.0.0.1:5000/

# Start frontend development server
npm run dev
# The application will start at: http://localhost:5173/

# Run production build validation
npm run build
```

---

## 🌐 Public Cloud Deployment Guide (Vercel & Render)

The project includes root configuration files [`vercel.json`](file:///c:/Users/gsat6/SIH/vercel.json) and [`render.yaml`](file:///c:/Users/gsat6/SIH/render.yaml) for automated deployment:

### 1. Backend Deployment on Render
* **GitHub Repository:** [https://github.com/itzhari63/aicte-eduverify](https://github.com/itzhari63/aicte-eduverify)
* **Configuration:**
  1. Open [Render Dashboard](https://dashboard.render.com/) ➔ Click **New +** ➔ **Web Service**.
  2. Select repository: `itzhari63/aicte-eduverify`.
  3. Render auto-configures from `render.yaml`:
     * **Environment:** `Node`
     * **Build Command:** `npm install`
     * **Start Command:** `node server/index.js`
  4. Under **Environment Variables**, add:
     * `MONGODB_URI`: `mongodb+srv://gsat6384_db_user:AICTE_Secured_2026_Atlas@cluster0.taamwpx.mongodb.net/aicte_eduverify?retryWrites=true&w=majority&appName=Cluster0`
     * `PORT`: `10000`
     * `NODE_ENV`: `production`
  5. Click **Deploy Web Service** to get your public backend URL (e.g. `https://aicte-eduverify-backend.onrender.com`).

### 2. Frontend Deployment on Vercel
* **Instant Claim Link:** [Claim Live Anonymous Deployment](https://vercel.com/claim-deployment?code=a4b671fa-6fa2-4e75-b6d6-7aed1d34e757)
* **Permanent Continuous Deployment via GitHub:**
  1. Open [Vercel Dashboard](https://vercel.com/new) ➔ Click **Import Project**.
  2. Select `itzhari63/aicte-eduverify`.
  3. Framework Preset: **Vite** *(auto-detected)*.
  4. Under **Environment Variables**, set:
     * `VITE_API_BASE_URL`: `https://<your-render-backend-url>.onrender.com/api`
  5. Click **Deploy**. Vercel will host the frontend with global CDN and automated SSL at: `https://aicte-eduverify.vercel.app`.

---

## 🧪 Demonstration & Testing Scenarios for Evaluators

1. **Test Verification Sandbox (Landing Page):**
   - Click `"✅ Try Aryan Sharma"` to inspect a verified COEP Pune CSE student record.
   - Click `"⚠️ Try Priya Patel"` to view a cross-institution duplicate enrollment alert.
   - Click `"❌ Try Unregistered APAAR"` to see invalid identity handling.

2. **Test Institutional Ingestion Studio (College Nodal View):**
   - Click `"⚠️ Load Conflict & Rule-Violation Dataset"` to witness real-time client-side detection of invalid APAARs, batch duplicates, and quota errors.
   - Click `"⚡ Load 5 Valid Students"` and press `"Commit Batch to AICTE Central Repository"` to celebrate live commitment with confetti!
   - Test the `"REST API Simulator"` to test ERP webhook requests with live HTTP 200/422 responses.

3. **Test AICTE Central Command (Apex Admin View):**
   - Go to `"Cross-Institution Duplicate Desk"` to view Priya Patel's dual enrollment across DTU Delhi and VJTI Mumbai.
   - Click `"Generate Show-Cause Notice"` to preview a formal Ministry of Education regulatory notice.
   - Test the `"State-wise Geo-Spatial Analytics"` to inspect state intake utilization across Maharashtra, Delhi, Karnataka, and Tamil Nadu.

4. **Test Certificate Engine (Module D):**
   - Inspect the Degree Certificate with **APAAR ID displayed side-by-side with Student Roll No**.
   - Click `"Print / Save PDF"` to preview the printable vector certificate.

---

## 🛡️ Security & Privacy Compliance
- **Digital Personal Data Protection (DPDP) Act 2023:** Data minimization on public verifier queries (masks Aadhaar and parent contact data).
- **Sovereign Student Consent:** Students can grant or revoke third-party verification access at any time.
- **Interoperability:** Ready for integration with DigiLocker, Academic Bank of Credits (ABC), and National Academic Depository (NAD).
