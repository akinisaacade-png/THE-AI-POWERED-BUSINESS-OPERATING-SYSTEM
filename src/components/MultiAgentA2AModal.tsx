import React, { useState } from "react";
import {
  Bot,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  Layers,
  Sparkles,
  Calendar,
  X,
  FileCheck,
} from "lucide-react";
import { executeMultiAgentCollab } from "../services/api";

interface MultiAgentA2AModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export const MultiAgentA2AModal: React.FC<MultiAgentA2AModalProps> = ({
  isOpen,
  onClose,
  darkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<"runner" | "maintenance" | "architecture">("runner");
  const [taskInput, setTaskInput] = useState(
    "Automate Missed Inbound Call -> 8s SMS Text-Back with dynamic booking link -> 24h CRM Task assignment"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>({
    verdict: "APPROVED",
    builder: `**Builder Agent Output (Executable Flow)**:
- **Trigger**: \`inbound_call.status == 'missed'\`
- **Affected Modules**: Calls & Voice AI (/calls-voice-ai), SMS & Conversations (/sms-conversations), Calendars (/calendars-booking)
- **Action Sequence**:
  1. \`sms.send({ to: contact.phone, text: "Hey {{contact.first_name}}, we saw we missed your call. Lock in a time here: {{booking_link}}" })\`
  2. \`tasks.create({ owner: assigned_rep, due: "+24h", priority: "HIGH" })\`
  3. \`crm.logActivity({ type: "automation", note: "Missed call text-back sent in 8s." })\``,
    businessOps: `**Business Ops Agent Optimization**:
- **Expected KPI Impact**: +38% recovery of otherwise lost inbound leads.
- **Conversion Targets**: 96% text-back delivery rate, 28% calendar booking conversion.
- **Strategy Note**: Pre-populate lead profile from caller ID to ensure frictionless 1-click meeting reservation.`,
    judge: `**Judge Agent Evaluation**:
- **Verdict**: APPROVED
- **Consistency**: All schema variables (\`{{contact.first_name}}\`, \`{{booking_link}}\`) correctly match Data Model definitions.
- **Safety Audit**: Opt-out compliance ("Reply STOP to opt-out") is enforced. No circular retry loops found.
- **Maintainability**: Fallback assigned user configured in case rep is out of office.`,
    timestamp: new Date().toLocaleTimeString(),
  });

  if (!isOpen) return null;

  const handleRunDeliberation = async () => {
    setIsLoading(true);
    try {
      const data = await executeMultiAgentCollab(taskInput);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (presetText: string) => {
    setTaskInput(presetText);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        id="multi-agent-modal-container"
        className={`w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
          darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-900 to-[#3F51B5] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF9800] text-indigo-950 flex items-center justify-center font-black text-xl shadow-lg">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  Multi-Agent A2A Collaboration Hub
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-indigo-950">
                  Google AI Studio Tri-Agent Engine
                </span>
              </div>
              <p className="text-xs text-indigo-100/90 mt-0.5">
                Builder Agent 🛠️ + Business Ops Agent 📊 + Self-Maintaining Judge Agent ⚖️
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab("runner")}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "runner"
                ? "border-[#FF9800] text-[#FF9800]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>A2A Live Deliberation & Verification</span>
          </button>
          <button
            onClick={() => setActiveTab("maintenance")}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "maintenance"
                ? "border-[#FF9800] text-[#FF9800]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Self-Maintenance Strategy (Weekly/Monthly/Quarterly)</span>
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "architecture"
                ? "border-[#FF9800] text-[#FF9800]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tri-Agent Core Prompts & Constraints</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === "runner" && (
            <div className="space-y-5">
              {/* Task Input Area */}
              <div
                className={`p-4 rounded-2xl border ${
                  darkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Propose Workflow / Campaign Structural Change
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-[#3F51B5] dark:text-indigo-400 font-semibold">
                    <span>Quick Presets:</span>
                    <button
                      onClick={() =>
                        handleApplyPreset(
                          "Missed Call -> 8s SMS Text-Back -> Dynamic Calendar Booking Link -> 24h Task"
                        )
                      }
                      className="underline hover:text-[#FF9800] ml-1"
                    >
                      Missed Call
                    </button>
                    <span>•</span>
                    <button
                      onClick={() =>
                        handleApplyPreset(
                          "New Inbound Funnel Lead -> 3-Day Email Drip -> Deal Won & Paid -> 3-Day Review Request"
                        )
                      }
                      className="underline hover:text-[#FF9800] ml-1"
                    >
                      Lead to Review
                    </button>
                    <span>•</span>
                    <button
                      onClick={() =>
                        handleApplyPreset(
                          "Stalled Proposal (>4 days) -> AI Flash-Lite ROI Offer Generator -> Omnichannel Nudge"
                        )
                      }
                      className="underline hover:text-[#FF9800] ml-1"
                    >
                      Stalled Deal
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Describe any workflow trigger, campaign sequence, or CRM logic..."
                    className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
                  />
                  <button
                    id="btn-run-a2a-deliberation"
                    disabled={isLoading}
                    onClick={handleRunDeliberation}
                    className="px-5 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RotateCcw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Run Tri-Agent Deliberation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 3 Agents Output Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Builder Agent */}
                <div
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700/60 mb-2.5">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-[#3F51B5] flex items-center justify-center font-bold text-xs">
                        🛠️
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#3F51B5] dark:text-indigo-300">
                          1. Builder Agent
                        </h4>
                        <span className="text-[10px] text-slate-400">System & Dev Engineer</span>
                      </div>
                    </div>
                    <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line font-mono bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl max-h-56 overflow-y-auto">
                      {result.builder}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-400 font-semibold">
                    ✓ Structured JSON & Execution Triggers
                  </div>
                </div>

                {/* 2. Business Ops Agent */}
                <div
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700/60 mb-2.5">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-[#FF9800] flex items-center justify-center font-bold text-xs">
                        📊
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#FF9800]">
                          2. Business Ops Agent
                        </h4>
                        <span className="text-[10px] text-slate-400">Domain & Strategy Specialist</span>
                      </div>
                    </div>
                    <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl max-h-56 overflow-y-auto">
                      {result.businessOps}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-400 font-semibold">
                    ✓ Conversion KPIs & Retention Strategy
                  </div>
                </div>

                {/* 3. Judge Agent */}
                <div
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    result.verdict === "APPROVED"
                      ? "border-emerald-500/40 bg-emerald-50/10 dark:bg-emerald-950/20"
                      : "border-rose-500/40 bg-rose-50/10 dark:bg-rose-950/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                          ⚖️
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            3. Judge Agent
                          </h4>
                          <span className="text-[10px] text-slate-400">Verification & Safety</span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          result.verdict === "APPROVED"
                            ? "bg-emerald-500 text-white"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {result.verdict}
                      </span>
                    </div>
                    <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl max-h-56 overflow-y-auto">
                      {result.judge}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Self-Maintenance Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                The Judge Agent autonomously executes scheduled health checks to ensure 0 orphaned
                automations, 0 undefined fields, and 100% compliant opt-out rules.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Weekly */}
                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-bold text-xs text-[#3F51B5] dark:text-indigo-400">
                    <Clock className="w-4 h-4" />
                    <span>Weekly Maintenance Task</span>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#FF9800] font-bold">•</span>
                      <span>Scan automation logs for errors (missing fields, failed triggers).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#FF9800] font-bold">•</span>
                      <span>Suggest fixes and mark deprecated flows.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#FF9800] font-bold">•</span>
                      <span>Audit telephony carrier text-back delivery rates.</span>
                    </li>
                  </ul>
                </div>

                {/* Monthly */}
                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-bold text-xs text-[#FF9800]">
                    <Sparkles className="w-4 h-4" />
                    <span>Monthly Strategy Review</span>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#3F51B5] font-bold">•</span>
                      <span>Review campaign performance (ads, SMS, email).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#3F51B5] font-bold">•</span>
                      <span>Business Ops Agent proposes new segments & offers.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#3F51B5] font-bold">•</span>
                      <span>Builder Agent updates funnels and templates.</span>
                    </li>
                  </ul>
                </div>

                {/* Quarterly */}
                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Quarterly System Audit</span>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>Audit data model: new fields vs unused fields.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>Update Conversation AI intents and FAQs.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>Refresh UI components for accessibility and speed.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-4 text-xs">
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h4 className="font-bold text-sm text-[#3F51B5] dark:text-indigo-400">
                  Core Tri-Agent Orchestration Specification
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Every structural modification, automation addition, or funnel adjustment passes
                  sequentially through the Builder Agent, gets commercially optimized by the
                  Business Ops Agent, and is strictly audited by the Judge Agent before production
                  execution.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-[#3F51B5] mb-1">Builder Agent:</div>
                    Outputs executable JSON schemas, triggers, actions, and UI flow changes.
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-[#FF9800] mb-1">Business Ops Agent:</div>
                    Translates pipeline goals to KPIs, close rates, and multi-channel drip sequences.
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-emerald-600 mb-1">Judge Agent:</div>
                    Validates schema consistency, anti-spam safety, and schedules maintenance checks.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All 3 Agents Operating with Gemini 3.7 Flash</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#3F51B5] text-white font-bold hover:bg-indigo-700 transition-all"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
