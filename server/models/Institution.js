import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  approvedIntake: { type: Number, required: true, default: 0 },
  supernumerarySeats: { type: Number, required: true, default: 0 },
  enrolledCount: { type: Number, required: true, default: 0 },
  categories: {
    general: { type: Number, default: 0 },
    ews: { type: Number, default: 0 },
    obc: { type: Number, default: 0 },
    scSt: { type: Number, default: 0 },
    nri: { type: Number, default: 0 },
    fn: { type: Number, default: 0 },
    oci: { type: Number, default: 0 },
    tfw: { type: Number, default: 0 }
  }
}, { _id: false });

const institutionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  type: { type: String, default: "Engineering & Technology" },
  category: { type: String },
  state: { type: String, required: true, index: true },
  city: { type: String },
  affiliation: { type: String },
  nirfRank: { type: Number },
  complianceScore: { type: Number, default: 98.0 },
  nodalOfficer: {
    name: { type: String },
    designation: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  departments: [departmentSchema]
}, { 
  timestamps: true 
});

export const Institution = mongoose.models.Institution || mongoose.model('Institution', institutionSchema);
