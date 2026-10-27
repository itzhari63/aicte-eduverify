import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Key, 
  Server,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function MongoConnectModal({ isOpen, onClose, onConnected }) {
  const [uri, setUri] = useState('');
  const [dbStatus, setDbStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedExample, setCopiedExample] = useState(false);

  const sampleUri = "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/aicte_eduverify?retryWrites=true&w=majority";

  useEffect(() => {
    if (isOpen) {
      checkStatus();
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  const checkStatus = async () => {
    try {
      const res = await api.getDbStatus();
      if (res && res.status) {
        setDbStatus(res.status);
      }
    } catch {}
  };

  const handleConnect = async (e) => {
    e?.preventDefault();
    if (!uri.trim()) {
      setErrorMessage('Please enter a valid MongoDB Atlas connection URI.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.connectMongoDB(uri.trim());
      if (res && res.success) {
        setSuccessMessage('Successfully connected to MongoDB Atlas cluster! Master collections initialized.');
        setDbStatus(res.database);
        if (onConnected) onConnected(res.database);
      } else {
        setErrorMessage(res?.error || res?.message || 'Failed to connect to MongoDB Atlas. Check your username, password, and IP access list.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error connecting to backend API.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  Cloud Depository
                </span>
                <span className="text-xs text-slate-400">Enterprise Database</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                Connect MongoDB Atlas Cluster
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Pill */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
          dbStatus?.connected
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
        }`}>
          <div className="flex items-center gap-2.5">
            {dbStatus?.connected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Server className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {dbStatus?.connected ? "MongoDB Atlas Active & Online" : "Operating in In-Memory Sovereign Mode"}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {dbStatus?.connected 
                  ? `Connected to cluster: ${dbStatus.host || 'MongoDB Atlas'} • Database: ${dbStatus.databaseName || 'aicte_eduverify'}`
                  : "Connect your MongoDB Atlas cluster URI below to persist all admissions and verifications."}
              </div>
            </div>
          </div>
          <button
            onClick={checkStatus}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Refresh Status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>MongoDB Atlas Connection URI (SRV Format)</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(sampleUri);
                  setCopiedExample(true);
                  setTimeout(() => setCopiedExample(false), 2000);
                }}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-normal"
              >
                {copiedExample ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>Copy Sample Format</span>
              </button>
            </label>
            <div className="relative">
              <input
                type="text"
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                placeholder="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/aicte_eduverify?retryWrites=true&w=majority"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Your connection string is stored securely in the local <code className="font-mono text-slate-600 dark:text-slate-300">.env</code> file.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://cloud.mongodb.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 font-semibold"
            >
              <span>Open MongoDB Atlas Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting to Cluster...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Connect & Sync Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Instructions Accordion */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
          <div className="font-bold text-slate-900 dark:text-white">
            Quick Setup Steps on MongoDB Atlas:
          </div>
          <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
            <li>In <strong>Network Access</strong>, ensure your IP address is whitelisted (or <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">0.0.0.0/0</code> for development).</li>
            <li>In <strong>Database Access</strong>, make sure your user has <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">readWriteAnyDatabase</code> role.</li>
            <li>Click <strong>Connect &rarr; Drivers &rarr; Node.js</strong>, copy the connection URI, replace <code className="font-mono">&lt;password&gt;</code> with your password, and paste it above.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
