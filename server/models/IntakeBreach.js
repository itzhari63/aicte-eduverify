import mongoose from 'mongoose';

const intakeBreachSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  institutionId: { type: String, required: true, index: true },
  institutionName: { type: String, required: true },
  branchCode: { type: String, required: true },
  branchName: { type: String, required: true },
  approvedIntake: { type: Number, required: true },
  supernumeraryQuota: { type: Number, required: true },
  totalCap: { type: Number, required: true },
  actualSubmitted: { type: Number, required: true },
  excessCount: { type: Number, required: true },
  detectedTimestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'SHOW_CAUSE_ISSUED' },
  noticeRef: { type: String, required: true }
}, {
  timestamps: true
});

export const IntakeBreach = mongoose.models.IntakeBreach || mongoose.model('IntakeBreach', intakeBreachSchema);
