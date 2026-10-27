// Sovereign AICTE-EduVerify REST API Client
// Connects to local Express backend with auto-fallback and permissive CORS permissions

const rawApiBase = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE = rawApiBase.endsWith('/api') ? rawApiBase : (rawApiBase === '/' ? '/api' : `${rawApiBase.replace(/\/+$/, '')}/api`);


const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Client-Role': 'AICTE_SOVEREIGN_CLIENT',
  'X-Permission-Request': 'ALL_PERMISSIONS_ACCEPTED'
};

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMsg = errorData.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // 1. Health & System Permissions
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, {
        headers: defaultHeaders
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Backend connection notice:', err.message);
      return { status: 'OFFLINE', error: err.message };
    }
  },

  // 2. Apex National Statistics
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`, { headers: defaultHeaders });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Failed to fetch stats from backend:', err);
      return null;
    }
  },

  // 3. Institutions
  async getInstitutions() {
    try {
      const res = await fetch(`${API_BASE}/institutions`, { headers: defaultHeaders });
      const data = await handleResponse(res);
      return data.data || [];
    } catch (err) {
      console.warn('Failed to fetch institutions from backend:', err);
      return null;
    }
  },

  async createInstitution(payload) {
    const res = await fetch(`${API_BASE}/institutions`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  },

  async updateInstitutionCapacity(id, payload) {
    const res = await fetch(`${API_BASE}/institutions/${id}/capacity`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  },

  // 4. Students
  async getStudents(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/students${query ? `?${query}` : ''}`, {
        headers: defaultHeaders
      });
      const data = await handleResponse(res);
      return data.data || [];
    } catch (err) {
      console.warn('Failed to fetch students from backend:', err);
      return null;
    }
  },

  async getStudentByApaar(apaarId) {
    const res = await fetch(`${API_BASE}/students/apaar/${encodeURIComponent(apaarId)}`, {
      headers: defaultHeaders
    });
    return await handleResponse(res);
  },

  async createStudent(studentData) {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(studentData)
    });
    return await handleResponse(res);
  },

  // 5. Ingestion Engine
  async validateBatch(records, institutionId) {
    const res = await fetch(`${API_BASE}/students/validate-batch`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ records, institutionId })
    });
    return await handleResponse(res);
  },

  async commitBatch(records, institutionId) {
    const res = await fetch(`${API_BASE}/students/commit-batch`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ records, institutionId })
    });
    return await handleResponse(res);
  },

  // 6. Sovereign Verifier Hub (W3C standard)
  async verifyApaar(apaarId) {
    const res = await fetch(`${API_BASE}/verify/${encodeURIComponent(apaarId)}`, {
      headers: defaultHeaders
    });
    return await handleResponse(res);
  },

  // 7. Intake Breaches
  async getIntakeBreaches() {
    try {
      const res = await fetch(`${API_BASE}/intake-breaches`, { headers: defaultHeaders });
      const data = await handleResponse(res);
      return data.data || [];
    } catch (err) {
      console.warn('Failed to fetch breaches from backend:', err);
      return null;
    }
  },

  async resolveIntakeBreach(id, action, notes) {
    const res = await fetch(`${API_BASE}/intake-breaches/${id}/resolve`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ action, notes })
    });
    return await handleResponse(res);
  },

  // 8. Audit Logs
  async getAuditLogs() {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`, { headers: defaultHeaders });
      const data = await handleResponse(res);
      return data.data || [];
    } catch (err) {
      console.warn('Failed to fetch audit logs from backend:', err);
      return null;
    }
  },

  async addAuditLog(logData) {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(logData)
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Failed to push audit log to backend:', err);
      return null;
    }
  },

  // 9. DPDP Act 2023 Consent Toggle
  async toggleConsent(payload) {
    const res = await fetch(`${API_BASE}/consents/toggle`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  },

  // 10. MongoDB Atlas Control
  async getDbStatus() {
    try {
      const res = await fetch(`${API_BASE}/db/status`, { headers: defaultHeaders });
      return await handleResponse(res);
    } catch (err) {
      return { connected: false, error: err.message };
    }
  },

  async connectMongoDB(uri) {
    const res = await fetch(`${API_BASE}/db/connect`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ uri })
    });
    return await handleResponse(res);
  },

  // 11. Stakeholder Authentication & Session
  async login(credentials) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(credentials)
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Backend login fallback to local session:', err.message);
      return null;
    }
  },

  async logout() {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: defaultHeaders
      });
      return await handleResponse(res);
    } catch (err) {
      return { success: true };
    }
  }
};
