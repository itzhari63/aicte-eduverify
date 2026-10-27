import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import { 
  institutions as defaultInstitutions, 
  students as defaultStudents,
  intakeBreaches as defaultBreaches,
  auditLogs as defaultAuditLogs 
} from './data.js';
import { Institution } from './models/Institution.js';
import { Student } from './models/Student.js';
import { IntakeBreach } from './models/IntakeBreach.js';
import { AuditLog } from './models/AuditLog.js';

dotenv.config();

// Ensure public DNS resolver is configured for reliable Atlas SRV records resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

let isConnected = false;
let dbStatus = {
  connected: false,
  uri: process.env.MONGODB_URI ? 'CONFIGURED' : 'NOT_CONFIGURED',
  databaseName: null,
  error: null
};

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('⚠️  MONGODB_URI not detected in environment / .env file.');
    console.log('   Running in Sovereign In-Memory Engine mode (Full API operational).');
    return false;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    dbStatus = {
      connected: true,
      uri: 'CONFIGURED',
      databaseName: conn.connection.name,
      host: conn.connection.host,
      error: null
    };

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);

    // Seed master institutions and genesis audit log if fresh database
    await seedMasterDataIfNeeded();

    return true;
  } catch (err) {
    console.error('❌ MongoDB Atlas Connection Error:', err.message);
    dbStatus = {
      connected: false,
      uri: 'ERROR',
      databaseName: null,
      error: err.message
    };
    console.log('   Fallback to Sovereign In-Memory Engine mode active.');
    return false;
  }
}

async function seedMasterDataIfNeeded() {
  try {
    const institutionCount = await Institution.countDocuments();
    if (institutionCount === 0 && defaultInstitutions.length > 0) {
      console.log('🌱 Seeding approved AICTE master institutions into MongoDB Atlas...');
      await Institution.insertMany(defaultInstitutions);
      console.log(`   Seeded ${defaultInstitutions.length} approved institutions.`);
    }

    const studentCount = await Student.countDocuments();
    if (studentCount === 0 && defaultStudents.length > 0) {
      console.log('🌱 Seeding authentic student enrolments into MongoDB Atlas...');
      await Student.insertMany(defaultStudents);
      console.log(`   Seeded ${defaultStudents.length} student records.`);
    }

    const breachCount = await IntakeBreach.countDocuments();
    if (breachCount === 0 && defaultBreaches.length > 0) {
      console.log('🌱 Seeding regulatory breach cases into MongoDB Atlas...');
      await IntakeBreach.insertMany(defaultBreaches);
      console.log(`   Seeded ${defaultBreaches.length} breach notices.`);
    }

    const logCount = await AuditLog.countDocuments();
    if (logCount === 0 && defaultAuditLogs.length > 0) {
      console.log('🌱 Initializing sovereign genesis audit ledger in MongoDB Atlas...');
      await AuditLog.insertMany(defaultAuditLogs);
      console.log('   Genesis ledger initialized.');
    }
  } catch (err) {
    console.warn('⚠️  Master seeding notice:', err.message);
  }
}

export function getDbStatus() {
  return dbStatus;
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export {
  Institution,
  Student,
  IntakeBreach,
  AuditLog
};
