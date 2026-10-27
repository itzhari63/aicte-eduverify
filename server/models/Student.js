import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  apaarId: { type: String, required: true, unique: true, index: true },
  rollNo: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, default: "Other" },
  dob: { type: String },
  institutionId: { type: String, required: true, index: true },
  institutionName: { type: String, required: true },
  branchCode: { type: String, required: true, index: true },
  branchName: { type: String },
  admissionYear: { type: Number, default: 2026 },
  admissionCategory: { type: String, default: "General" },
  isSupernumerary: { type: Boolean, default: false },
  quotaCategory: { type: String, default: "None" },
  isNri: { type: Boolean, default: false },
  isOci: { type: Boolean, default: false },
  isFn: { type: Boolean, default: false },
  isTfw: { type: Boolean, default: false },
  abcId: { type: String },
  abcCredits: { type: Number, default: 0 },
  cgpa: { type: String, default: "0.00" },
  status: { 
    type: String, 
    enum: ['VERIFIED', 'FLAGGED_DUPLICATE', 'FROZEN_REGULATORY_HOLD', 'PENDING_VALIDATION'],
    default: 'VERIFIED',
    index: true
  },
  flagReason: { type: String },
  conflictWith: {
    institutionId: { type: String },
    institutionName: { type: String },
    branchName: { type: String },
    admissionYear: { type: Number },
    enrolledTimestamp: { type: String }
  },
  verificationDate: { type: Date, default: Date.now },
  hash: { type: String, required: true }
}, {
  timestamps: true
});

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
