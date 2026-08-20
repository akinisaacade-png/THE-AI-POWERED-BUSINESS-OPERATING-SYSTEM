import React, { useState } from "react";
import { MessageCircle, Bot, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface UnifiedChatPageProps {
  darkMode?: boolean;
}

export const UnifiedChatPage: React.FC<UnifiedChatPageProps> = ({
  darkMode = false,
}) => {
  const [botTrained, setBotTrained] = useState(true);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Unified Live Chat &amp; Conversation AI
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              Gemini 3.7 Live Agent
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Embeddable web chat widget trained on your knowledge base, FAQs, and real-time appointment booking.
          </p>
        </div>
      </div>

      {/* Configuration & Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Bot Training & Settings */}
        <div
          className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Conversation AI Widget Training
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Synced &amp; Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Primary Goal / Persona
              </label>
              <input
                type="text"
                readOnly
                value="Enterprise Revenue Assistant - Qualify inbound visitors & book meetings directly."
                className={`w-full p-2.5 rounded-xl border font-medium ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Embedded Knowledge Base Sources
              </label>
              <div className="space-y-1.5">
                {[
                  "https://rev-os.io/docs/pricing-and-plans",
                  "Enterprise SLA and Security Whitepaper",
                  "Missed Call 8-Second Recovery Technical Specs",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between"
                  >
                    <span className="font-mono text-[11px]">{src}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Widget Simulation */}
        <div
          className={`p-6 rounded-3xl border flex flex-col justify-between ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#3F51B5] text-white flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Live Visitor Simulation
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Simulated Webhook</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 my-4">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[#3F51B5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                ⚡
              </div>
              <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-xs shadow-sm text-slate-800 dark:text-slate-100">
                Hello! Welcome to THE AI-POWERED BUSINESS OPERATING SYSTEM. Are you exploring revenue automation for your sales reps or agency clients?
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <div className="p-2.5 rounded-2xl bg-[#3F51B5] text-white text-xs shadow-sm">
                We have 50 sales reps and need instant missed call recovery + CRM sync.
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[#3F51B5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                ⚡
              </div>
              <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-xs shadow-sm text-slate-800 dark:text-slate-100 space-y-2">
                <p>
                  Perfect. Our Enterprise OS recovers missed inbound leads in under 8 seconds with round-robin calendar assignment.
                </p>
                <button className="px-3 py-1.5 rounded-xl bg-[#FF9800] text-indigo-950 font-bold text-[11px] hover:bg-amber-500 transition-all">
                  📅 Lock In Enterprise Demo (2:00 PM Today)
                </button>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center text-slate-400 font-semibold">
            ✓ 0-Latency Embed Script generated for your domains
          </div>
        </div>
      </div>
    </div>
  );
};
