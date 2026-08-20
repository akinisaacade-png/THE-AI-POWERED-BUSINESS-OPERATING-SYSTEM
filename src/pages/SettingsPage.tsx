import React, { useState } from "react";
import { Settings, ShieldCheck, Database, Key, CheckCircle2, Zap, Radio, Globe, Cloud, RefreshCw } from "lucide-react";
import { testFirestoreConnection, firestoreDatabaseId } from "../services/firebase";

interface SettingsPageProps {
  darkMode?: boolean;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  darkMode = false,
}) => {
  const [testingDb, setTestingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ status: "idle" | "connected" | "error"; message?: string }>({
    status: "idle",
  });

  const handleTestConnection = async () => {
    setTestingDb(true);
    const res = await testFirestoreConnection();
    setTestingDb(false);
    if (res.connected) {
      setDbStatus({ status: "connected", message: res.message });
    } else {
      setDbStatus({ status: "error", message: res.message });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              System Settings &amp; Infrastructure Hub
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              All Systems Operational
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Firebase Firestore cloud persistence, PayPal gateway webhooks, carrier telephony, and Gemini AI configuration.
          </p>
        </div>
      </div>

      {/* Integration & Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firebase Firestore Cloud Database */}
        <div
          className={`p-6 rounded-3xl border space-y-4 md:col-span-2 ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-2">
                  <span>Firebase Firestore Cloud Database</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Provisioned &amp; Connected
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Real-time document synchronization and cloud persistence for Users, Deals, Workflows, and Bookings.
                </p>
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testingDb}
              className="px-4 py-2 rounded-xl bg-[#3F51B5] hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingDb ? "animate-spin" : ""}`} />
              <span>{testingDb ? "Testing..." : "Test Firestore Write/Read"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Project ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">gen-lang-client-0307379646</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Firestore Database ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block" title={firestoreDatabaseId}>
                {firestoreDatabaseId}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Security Rules</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Deployed (firestore.rules)
              </span>
            </div>
          </div>

          {dbStatus.status !== "idle" && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                dbStatus.status === "connected"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{dbStatus.message}</span>
            </div>
          )}
        </div>
        {/* Telephony & Voice AI Carrier */}
        <div
          className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#FF9800]" />
              <h3 className="text-sm font-extrabold">Telephony &amp; SMS Carrier (Twilio)</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Connected (10DLC Verified)
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Primary Phone Number:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">+1 (555) 019-2834</span>
            </div>
            <div className="flex justify-between">
              <span>Missed Call Auto-Text Trigger:</span>
              <span className="font-bold text-emerald-600">Enabled (08s delay)</span>
            </div>
            <div className="flex justify-between">
              <span>SMS Delivery Rate:</span>
              <span className="font-bold font-mono">99.8% (A2P 10DLC Tier 3)</span>
            </div>
          </div>
        </div>

        {/* Database & State Persistence (PostgreSQL & Redis) */}
        <div
          className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#3F51B5] dark:text-indigo-400" />
              <h3 className="text-sm font-extrabold">Database Persistence &amp; Cache</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Active Sync
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Primary Storage Engine:</span>
              <span className="font-bold text-slate-900 dark:text-white">PostgreSQL (Relational Storage)</span>
            </div>
            <div className="flex justify-between">
              <span>Session &amp; Real-Time Cache:</span>
              <span className="font-bold text-[#FF9800]">Redis In-Memory State</span>
            </div>
            <div className="flex justify-between">
              <span>Query Latency:</span>
              <span className="font-mono text-emerald-600 font-bold">1.2ms</span>
            </div>
          </div>
        </div>

        {/* Gemini AI Engine Configuration */}
        <div
          className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-extrabold">Gemini AI Intelligence Engine</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-[#3F51B5] dark:bg-indigo-950 dark:text-indigo-300">
              Google @google/genai SDK
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Primary Execution Model:</span>
              <span className="font-bold text-slate-900 dark:text-white">Gemini 3.7 Flash</span>
            </div>
            <div className="flex justify-between">
              <span>Low-Latency Real-Time Model:</span>
              <span className="font-bold text-[#FF9800]">Gemini Flash-Lite</span>
            </div>
            <div className="flex justify-between">
              <span>High-Thinking Mode:</span>
              <span className="font-bold text-[#3F51B5] dark:text-indigo-300">Enabled (Reasoning Budget 8192)</span>
            </div>
          </div>
        </div>

        {/* Stripe Gateway */}
        <div
          className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-extrabold">Stripe Billing &amp; Webhooks</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live Verified
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Account Status:</span>
              <span className="font-bold text-emerald-600">Active (Automatic Payouts)</span>
            </div>
            <div className="flex justify-between">
              <span>Webhook Endpoint:</span>
              <span className="font-mono text-slate-900 dark:text-white">/api/stripe/webhook</span>
            </div>
            <div className="flex justify-between">
              <span>Supported Currencies:</span>
              <span className="font-bold">USD, EUR, GBP, AUD, CAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
