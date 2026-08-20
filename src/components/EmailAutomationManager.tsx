import React, { useState } from "react";
import {
  Mail,
  Zap,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  Send,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Settings,
} from "lucide-react";

export interface EmailAutomationRule {
  id: string;
  name: string;
  triggerEvent: "deal_stage_changed" | "deal_value_exceeded" | "contact_created" | "missed_call" | "booking_created";
  conditionField: string;
  conditionOperator: "equals" | "greater_than" | "contains";
  conditionValue: string;
  actionTemplateId: string;
  actionTemplateName: string;
  delayMinutes: number;
  isActive: boolean;
  timesTriggered: number;
  lastExecuted?: string;
}

const defaultRules: EmailAutomationRule[] = [
  {
    id: "rule-1",
    name: "Deal Won → VIP Onboarding & Thank You Sequence",
    triggerEvent: "deal_stage_changed",
    conditionField: "deal.stage",
    conditionOperator: "equals",
    conditionValue: "won",
    actionTemplateId: "tmpl-thank-you",
    actionTemplateName: "VIP Client Thank You & Onboarding Portal",
    delayMinutes: 0,
    isActive: true,
    timesTriggered: 38,
    lastExecuted: "2026-08-19 10:14 AM",
  },
  {
    id: "rule-2",
    name: "Enterprise High-Value Proposal Follow-up",
    triggerEvent: "deal_value_exceeded",
    conditionField: "deal.value",
    conditionOperator: "greater_than",
    conditionValue: "25000",
    actionTemplateId: "tmpl-enterprise-deck",
    actionTemplateName: "Executive ROI Deck & Custom Architecture",
    delayMinutes: 15,
    isActive: true,
    timesTriggered: 19,
    lastExecuted: "2026-08-18 04:30 PM",
  },
  {
    id: "rule-3",
    name: "Missed Call → Instant SMS & Email Recovery",
    triggerEvent: "missed_call",
    conditionField: "call.status",
    conditionOperator: "equals",
    conditionValue: "missed",
    actionTemplateId: "tmpl-missed-call",
    actionTemplateName: "Missed Call Apology + Direct Booking Link",
    delayMinutes: 0,
    isActive: true,
    timesTriggered: 142,
    lastExecuted: "2026-08-19 11:02 AM",
  },
];

interface EmailAutomationManagerProps {
  darkMode?: boolean;
}

export const EmailAutomationManager: React.FC<EmailAutomationManagerProps> = ({
  darkMode = false,
}) => {
  const [rules, setRules] = useState<EmailAutomationRule[]>(defaultRules);
  const [isCreating, setIsCreating] = useState(false);
  const [testNotification, setTestNotification] = useState<string | null>(null);

  // New Rule Form State
  const [newRuleName, setNewRuleName] = useState("");
  const [triggerEvent, setTriggerEvent] = useState<EmailAutomationRule["triggerEvent"]>("deal_stage_changed");
  const [conditionField, setConditionField] = useState("deal.stage");
  const [conditionOperator, setConditionOperator] = useState<EmailAutomationRule["conditionOperator"]>("equals");
  const [conditionValue, setConditionValue] = useState("won");
  const [actionTemplateName, setActionTemplateName] = useState("VIP Client Thank You & Onboarding Portal");
  const [delayMinutes, setDelayMinutes] = useState(0);

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newRule: EmailAutomationRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName.trim(),
      triggerEvent,
      conditionField,
      conditionOperator,
      conditionValue,
      actionTemplateId: `tmpl-${Date.now()}`,
      actionTemplateName,
      delayMinutes: Number(delayMinutes) || 0,
      isActive: true,
      timesTriggered: 0,
      lastExecuted: "Just created",
    };

    setRules((prev) => [newRule, ...prev]);
    setIsCreating(false);
    setNewRuleName("");
    setTestNotification(`✓ Created trigger: "${newRule.name}"`);
    setTimeout(() => setTestNotification(null), 3500);
  };

  const handleTestTrigger = (rule: EmailAutomationRule) => {
    setTestNotification(
      `🚀 Triggered "${rule.name}"! Condition satisfied [${rule.conditionField} ${rule.conditionOperator} '${rule.conditionValue}']. Successfully queued "${rule.actionTemplateName}" email template.`
    );
    setRules((prev) =>
      prev.map((r) =>
        r.id === rule.id
          ? {
              ...r,
              timesTriggered: r.timesTriggered + 1,
              lastExecuted: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : r
      )
    );
    setTimeout(() => setTestNotification(null), 5000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#3F51B5] text-white flex items-center justify-center shadow-xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Conditional Email Automation Triggers
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Trigger instant or scheduled email campaigns based on CRM events and deal lifecycle changes.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Email Trigger</span>
        </button>
      </div>

      {/* Test Execution Notification Alert */}
      {testNotification && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testNotification}</span>
          </div>
        </div>
      )}

      {/* Create New Trigger Modal / Inline Panel */}
      {isCreating && (
        <form
          onSubmit={handleCreateRule}
          className={`p-5 rounded-2xl border ${
            darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 shadow-md text-slate-900"
          } space-y-4 animate-in fade-in duration-150`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-extrabold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF9800]" />
              <span>Configure Conditional Email Trigger</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Rule Name
              </label>
              <input
                type="text"
                required
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="e.g. Deal Won → Send VIP Thank You Email"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Event Trigger
              </label>
              <select
                value={triggerEvent}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setTriggerEvent(val);
                  if (val === "deal_stage_changed") {
                    setConditionField("deal.stage");
                    setConditionValue("won");
                  } else if (val === "deal_value_exceeded") {
                    setConditionField("deal.value");
                    setConditionValue("20000");
                  } else if (val === "missed_call") {
                    setConditionField("call.status");
                    setConditionValue("missed");
                  }
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
              >
                <option value="deal_stage_changed">Deal Stage Changes in CRM</option>
                <option value="deal_value_exceeded">Deal Value Exceeds Threshold</option>
                <option value="contact_created">New Contact Added</option>
                <option value="missed_call">Inbound Call Missed</option>
                <option value="booking_created">Demo / Meeting Booked</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Condition Field
                </label>
                <input
                  type="text"
                  value={conditionField}
                  onChange={(e) => setConditionField(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs font-bold text-[#3F51B5] dark:text-indigo-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Operator
                </label>
                <select
                  value={conditionOperator}
                  onChange={(e) => setConditionOperator(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                >
                  <option value="equals">Equals (==)</option>
                  <option value="greater_than">Is Greater Than (&gt;)</option>
                  <option value="contains">Contains Substring</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Target Value
                </label>
                <input
                  type="text"
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  placeholder="e.g. won, proposal, 25000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Queue Email Template
              </label>
              <select
                value={actionTemplateName}
                onChange={(e) => setActionTemplateName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
              >
                <option value="VIP Client Thank You & Onboarding Portal">VIP Client Thank You &amp; Onboarding Portal</option>
                <option value="Executive ROI Deck & Custom Architecture">Executive ROI Deck &amp; Custom Architecture</option>
                <option value="Missed Call Apology + Direct Booking Link">Missed Call Apology + Direct Booking Link</option>
                <option value="3-Day Post-Demo Warm Nurture Drip">3-Day Post-Demo Warm Nurture Drip</option>
                <option value="5-Star Review Request & Referral Incentive">5-Star Review Request &amp; Referral Incentive</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Execution Delay
              </label>
              <select
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
              >
                <option value={0}>Instant (Immediate execution)</option>
                <option value={5}>5 Minutes delay</option>
                <option value={15}>15 Minutes delay</option>
                <option value={60}>1 Hour delay</option>
                <option value={1440}>1 Day delay</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#3F51B5] text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-sm"
            >
              Save Automation Trigger
            </button>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-2xl border transition-all ${
              darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
            } ${!rule.isActive ? "opacity-60" : ""}`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="font-extrabold text-sm">{rule.name}</h4>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      rule.isActive
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {rule.isActive ? "Active" : "Paused"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Triggered {rule.timesTriggered} times
                  </span>
                </div>

                {/* Visual Logic Flow Badge */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 font-medium">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">IF</span>
                    <code className="text-[#3F51B5] dark:text-indigo-400 font-mono font-bold">{rule.conditionField}</code>
                    <span className="text-slate-500 font-bold">{rule.conditionOperator}</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-[#FF9800] font-bold font-mono">
                      &apos;{rule.conditionValue}&apos;
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 font-medium">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">THEN QUEUE</span>
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {rule.actionTemplateName}
                    </span>
                  </div>

                  {rule.delayMinutes > 0 && (
                    <span className="flex items-center gap-1 text-[10.5px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3" />
                      +{rule.delayMinutes}m delay
                    </span>
                  )}
                </div>
              </div>

              {/* Actions & Simulation Trigger */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTestTrigger(rule)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs active:scale-95"
                  title="Simulate CRM event and test trigger"
                >
                  <Play className="w-3 h-3 text-[#3F51B5] dark:text-indigo-400 fill-current" />
                  <span>Test Run</span>
                </button>

                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title={rule.isActive ? "Pause Trigger" : "Activate Trigger"}
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                </button>

                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete Trigger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
