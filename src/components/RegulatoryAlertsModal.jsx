import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Smartphone, 
  Bell, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  User, 
  Building2,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function RegulatoryAlertsModal({ isOpen, onClose, students = [], institutions = [] }) {
  const [selectedRecipient, setSelectedRecipient] = useState('STUDENT'); // 'STUDENT' or 'NODAL'
  const [selectedStudent, setSelectedStudent] = useState(students[0] || null);
  const [selectedChannel, setSelectedChannel] = useState('WHATSAPP'); // 'WHATSAPP' or 'SMS'
  const [alertType, setAlertType] = useState('ADMISSION_CONFIRMATION');
  const [isSending, setIsSending] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const [messageLogs, setMessageLogs] = useState([
    {
      id: "MSG-9021",
      recipient: "Aditi Ramesh Sharma (+91 98234 51288)",
      channel: "WHATSAPP",
      type: "ADMISSION_ANCHORED",
      content: "AICTE Regulatory Bureau: Your admission to COEP Pune (B.Tech CSE) is verified & cryptographically anchored to APAAR ID 9823-4512-8831. View sovereign digital card at aicte.gov.in.",
      timestamp: "10 mins ago",
      status: "DELIVERED_READ"
    },
    {
      id: "MSG-9020",
      recipient: "Dr. Sudhir Deshmukh, Nodal Officer, COEP (+91 20 2550 7000)",
      channel: "SMS",
      type: "DUAL_ENROLMENT_FLAG",
      content: "URGENT AICTE AUDIT ALERT: Dual-enrollment conflict detected for Scholar Priya Anand Verma between COEP and DTU Delhi. Review within 48h under Clause 7.2 of APH 2026.",
      timestamp: "35 mins ago",
      status: "DELIVERED"
    },
    {
      id: "MSG-9019",
      recipient: "Vikramaditya Sengupta (+91 94120 88210)",
      channel: "WHATSAPP",
      type: "DEGREE_ISSUED",
      content: "Official W3C Verifiable Degree Certificate issued with cryptographic SHA-256 seal. Authenticated by DTU Delhi & AICTE National Depository.",
      timestamp: "2 hours ago",
      status: "DELIVERED_READ"
    }
  ]);

  if (!isOpen) return null;

  const handleDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      let content = "";
      let recipientText = "";
      if (selectedRecipient === 'STUDENT') {
        recipientText = `${selectedStudent?.name || "Student"} (+91 98*** 12831)`;
        if (alertType === 'ADMISSION_CONFIRMATION') {
          content = `AICTE Notification: Your admission is approved & permanently linked to APAAR ID ${selectedStudent?.apaarId || "9823-4512-8831"}. Credits registered in ABC Ledger.`;
        } else if (alertType === 'DUAL_ENROLMENT_WARNING') {
          content = `AICTE Regulatory Notice: Concurrent enrollment detected for APAAR ${selectedStudent?.apaarId}. Please verify your institutional affiliation within 48 hours.`;
        } else {
          content = `AICTE Credential Engine: Your official W3C digital degree certificate has been generated and sealed with SHA-256 cryptographic proof.`;
        }
      } else {
        recipientText = `Institution Nodal Officer (${selectedStudent?.institutionName || "COEP Pune"})`;
        content = `AICTE Regulation Bureau: Department intake audit completed. Please verify supernumerary quotas and pending compliance notices at aicte.gov.in.`;
      }

      const newLog = {
        id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
        recipient: recipientText,
        channel: selectedChannel,
        type: alertType,
        content,
        timestamp: "Just now",
        status: "DELIVERED_READ"
      };

      setMessageLogs([newLog, ...messageLogs]);
      setIsSending(false);
      setDispatchSuccess(true);
      setTimeout(() => setDispatchSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  Citizen & Regulatory Gateway
                </span>
                <span className="text-xs text-slate-400">Telecom Regulatory Authority of India (TRAI) Compliant</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Automated Regulatory WhatsApp & SMS Notification Dispatcher
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Dispatch Controller (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Dispatch Outbound Regulatory Alert
              </span>

              {/* 1. Recipient Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Target Recipient Persona:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedRecipient('STUDENT')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      selectedRecipient === 'STUDENT'
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Enrolled Scholar</span>
                  </button>

                  <button
                    onClick={() => setSelectedRecipient('NODAL')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      selectedRecipient === 'NODAL'
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Institution Nodal Officer</span>
                  </button>
                </div>
              </div>

              {/* 2. Select Student if student selected */}
              {selectedRecipient === 'STUDENT' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    Select Scholar Profile:
                  </label>
                  <select
                    value={selectedStudent?.id}
                    onChange={(e) => {
                      const s = students.find(item => item.id === e.target.value);
                      if (s) setSelectedStudent(s);
                    }}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.branchCode}) • APAAR: {s.apaarId}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 3. Dispatch Channel */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Communication Pipeline:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedChannel('WHATSAPP')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      selectedChannel === 'WHATSAPP'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Enterprise API</span>
                  </button>

                  <button
                    onClick={() => setSelectedChannel('SMS')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      selectedChannel === 'SMS'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>NIC DLT National SMS Gateway</span>
                  </button>
                </div>
              </div>

              {/* 4. Alert Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Notification Template:
                </label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="ADMISSION_CONFIRMATION">Admission Anchored & APAAR Issuance Notice</option>
                  <option value="DUAL_ENROLMENT_WARNING">Immediate Dual-Enrollment Anomaly Warning</option>
                  <option value="DEGREE_ISSUED">Official Degree Credential Published</option>
                </select>
              </div>

              {/* Dispatch Action */}
              <button
                onClick={handleDispatch}
                disabled={isSending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>{isSending ? "Routing through Gov Gateway..." : "Trigger Live Notification Dispatch"}</span>
              </button>

              {dispatchSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dispatched successfully! Simulated delivery acknowledgment received with 0ms latency.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Realistic Smartphone Message Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[320px] bg-slate-950 rounded-[38px] p-4 shadow-2xl border-4 border-slate-800 text-white relative">
              {/* Phone Speaker & Camera Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              </div>

              {/* Message Header Bar */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 flex items-center gap-2 border-b border-slate-800 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  selectedChannel === 'WHATSAPP' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {selectedChannel === 'WHATSAPP' ? 'WA' : 'SMS'}
                </div>
                <div>
                  <div className="text-xs font-extrabold flex items-center gap-1">
                    <span>Gov-AICTE</span>
                    <span className="text-[10px] text-emerald-400">✓ Official</span>
                  </div>
                  <span className="text-[9px] text-slate-400">APAAR Sovereign Dispatch</span>
                </div>
              </div>

              {/* Message Bubble Preview */}
              <div className="space-y-3 min-h-[260px] max-h-[300px] overflow-y-auto pr-1">
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  selectedChannel === 'WHATSAPP' 
                    ? 'bg-emerald-950/80 text-emerald-100 border border-emerald-800/80 rounded-tl-sm'
                    : 'bg-blue-950/80 text-blue-100 border border-blue-800/80 rounded-tl-sm'
                }`}>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                    GOVT OF INDIA • AICTE DISPATCH
                  </div>
                  <p>
                    {alertType === 'ADMISSION_CONFIRMATION'
                      ? `Dear ${selectedStudent?.name || "Scholar"}, your B.Tech admission at ${selectedStudent?.institutionName?.substring(0, 25) || "COEP"} is confirmed & anchored to sovereign APAAR ID ${selectedStudent?.apaarId || "9823-4512-8831"}. Access your Academic Bank of Credits anytime at aicte.gov.in.`
                      : alertType === 'DUAL_ENROLMENT_WARNING'
                      ? `ATTENTION: Simultaneous duplicate admission detected for APAAR ID ${selectedStudent?.apaarId || "6521-4402-9918"}. Under AICTE APH 2026 Clause 7.2, please resolve this conflict within 48 hours to prevent regulatory freeze.`
                      : `Official W3C Verifiable Degree Certificate issued for ${selectedStudent?.name || "Scholar"}. Signed with SHA-256 seal. Verified & valid across India & abroad.`
                    }
                  </p>
                  <div className="text-[9px] text-right text-slate-400 mt-1.5 flex items-center justify-end gap-1">
                    <span>Just now</span>
                    <span className="text-emerald-400 font-bold">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-4" />
            </div>
          </div>

        </div>

        {/* Live Outbound Telemetry Logs */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Live Outbound Regulatory Gateway Telemetry Logs
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Latency: &lt;12ms • 100% Delivery SLA
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-40 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-2 text-xs">
            {messageLogs.map(log => (
              <div key={log.id} className="py-2.5 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-200">{log.recipient}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      log.channel === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {log.channel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{log.content}</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold shrink-0">
                  {log.status === 'DELIVERED_READ' ? 'Read by Citizen ✓✓' : 'Delivered ✓'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
