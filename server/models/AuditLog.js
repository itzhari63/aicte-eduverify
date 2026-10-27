import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  actor: { type: String, required: true },
  actorName: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  ipHash: { type: String, required: true },
  status: { type: String, required: true },
  recordHash: { type: String, required: true }
}, {
  timestamps: true
});

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
