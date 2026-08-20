import React, { useState } from "react";
import { AutomationWorkflow } from "../types";
import {
  Workflow,
  Plus,
  Play,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Clock,
  Sparkles,
  Zap,
  Bot,
  Mail,
  Layers,
} from "lucide-react";
import { EmailAutomationManager } from "../components/EmailAutomationManager";

interface AutomationPageProps {
  workflows: AutomationWorkflow[];
  onAddWorkflow: (workflow: any) => void;
  onDeleteWorkflow: (workflowId: string) => void;
  onOpenDataModal: (section?: string) => void;
  onOpenMultiAgent: () => void;
  darkMode?: boolean;
}

export const AutomationPage: React.FC<AutomationPageProps> = ({
  workflows,
  onAddWorkflow,
  onDeleteWorkflow,
  onOpenDataModal,
  onOpenMultiAgent,
  darkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<"workflows" | "email_triggers">("workflows");

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Automation Workflows &amp; Multi-Agent Engine
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              Self-Maintaining Judge Agent
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual triggers, conditional email logic, and autonomous anti-spam verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-view Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab("workflows")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "workflows"
                  ? "bg-[#3F51B5] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Pipelines ({workflows.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("email_triggers")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "email_triggers"
                  ? "bg-[#3F51B5] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Triggers</span>
            </button>
          </div>

          <button
            onClick={onOpenMultiAgent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-[#3F51B5] dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition-all shadow-sm"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">A2A Hub</span>
          </button>

          <button
            onClick={() => onOpenDataModal("automation")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>

      {activeTab === "email_triggers" ? (
        /* Email Automation Trigger System */
        <EmailAutomationManager darkMode={darkMode} />
      ) : (
        /* Workflows Grid */
        <div className="space-y-4">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className={`p-6 rounded-3xl border transition-all ${
                darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
              }`}
            >
              {/* Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-[#3F51B5] dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {wf.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black">
                        {wf.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Trigger: <code className="text-[#FF9800] font-mono">{wf.trigger_event}</code></span>
                      <span>•</span>
                      <span>Last Run: {wf.last_run}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Judge: {wf.judge_verdict}</span>
                  </div>
                  <button
                    onClick={() => onDeleteWorkflow(wf.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                    title="Delete Workflow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Steps Sequence Node Graph */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
                {wf.steps.map((st, idx) => (
                  <div
                    key={st.id}
                    className={`p-3.5 rounded-2xl border relative flex flex-col justify-between ${
                      darkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                        <span>Node 0{idx + 1} ({st.type})</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <h5 className="font-black text-xs text-slate-900 dark:text-white">{st.title}</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Configured &amp; Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

