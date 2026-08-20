import React, { useState } from "react";
import {
  Plus,
  X,
  UserPlus,
  PhoneCall,
  Briefcase,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Calendar,
  Building,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Contact, Deal, CallLog } from "../types";

interface QuickAddFabProps {
  darkMode?: boolean;
  onOpenDataModal?: (section?: string) => void;
  onAddContact?: (contact: Contact) => void;
  onAddDeal?: (deal: Deal) => void;
  onAddCall?: (call: CallLog) => void;
}

type QuickModalType = "contact" | "call" | "deal" | null;

export const QuickAddFab: React.FC<QuickAddFabProps> = ({
  darkMode = false,
  onOpenDataModal,
  onAddContact,
  onAddDeal,
  onAddCall,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<QuickModalType>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string>("");

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCompany, setContactCompany] = useState("");

  // Call Form State
  const [callContactName, setCallContactName] = useState("");
  const [callDuration, setCallDuration] = useState("4m 12s");
  const [callOutcome, setCallOutcome] = useState<"completed" | "missed" | "scheduled">("completed");
  const [callSummary, setCallSummary] = useState("");

  // Deal Form State
  const [dealTitle, setDealTitle] = useState("");
  const [dealValue, setDealValue] = useState("15000");
  const [dealContactName, setDealContactName] = useState("");
  const [dealCompany, setDealCompany] = useState("");
  const [dealStage, setDealStage] = useState<"new_lead" | "qualified" | "proposal" | "negotiation" | "won">("qualified");

  const showSuccessFeedback = (msg: string) => {
    setSubmittedMessage(msg);
    setTimeout(() => {
      setSubmittedMessage("");
      setActiveModal(null);
      setIsOpen(false);
    }, 1800);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `cnt-${Date.now().toString().slice(-4)}`;
    const newContact: Contact = {
      id,
      name: contactName || "New Inbound Prospect",
      email: contactEmail || `prospect.${id}@enterprise.io`,
      phone: contactPhone || "+1 (555) 019-" + id,
      company_name: contactCompany || "Enterprise Client",
      tags: ["Quick-Added", "Inbound"],
      source: "Quick Add FAB",
      owner_id: "usr-1",
      owner_name: "Alex Mercer",
      status: "Lead",
      created_at: new Date().toISOString().slice(0, 16).replace("T", " "),
      win_probability: 75,
      churn_risk: "Low",
      ai_next_action: "Send AI personalized email introduction and discovery agenda.",
    };

    if (onAddContact) onAddContact(newContact);
    if (onOpenDataModal) onOpenDataModal("contacts");
    showSuccessFeedback(`Contact "${newContact.name}" added!`);

    // Reset
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setContactCompany("");
  };

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `call-${Date.now().toString().slice(-4)}`;
    const newCall: CallLog = {
      id,
      contact_name: callContactName || "Enterprise Lead",
      phone: "+1 (555) 019-" + id,
      type: "inbound",
      timestamp: "Just now",
      duration: callDuration || "3m 45s",
      outcome: callOutcome === "completed" ? "Answered" : callOutcome === "scheduled" ? "Callback Scheduled" : "Missed - Text Sent",
      sentiment: "Positive",
      ai_summary: callSummary || "Discussed high-priority enterprise requirements and verified implementation timeline.",
    };

    if (onAddCall) onAddCall(newCall);
    if (onOpenDataModal) onOpenDataModal("calls");
    showSuccessFeedback(`Call with "${newCall.contact_name}" logged!`);

    // Reset
    setCallContactName("");
    setCallSummary("");
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `deal-${Date.now().toString().slice(-4)}`;
    const newDeal: Deal = {
      id,
      contact_id: `cnt-${id}`,
      title: dealTitle || "Enterprise Growth Package",
      value: Number(dealValue) || 15000,
      contact_name: dealContactName || "Strategic Lead",
      company_name: dealCompany || "Apex Global",
      stage: dealStage,
      probability: dealStage === "won" ? 100 : dealStage === "negotiation" ? 85 : dealStage === "proposal" ? 65 : 45,
      close_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      owner_name: "Alex Mercer",
      ai_insights: {
        next_best_action: "Schedule executive demonstration and align technical requirements.",
        churn_risk: "Low",
        win_probability: dealStage === "won" ? 100 : 75,
        reasoning: "High stakeholder interest with approved quarterly budget.",
      },
    };

    if (onAddDeal) onAddDeal(newDeal);
    if (onOpenDataModal) onOpenDataModal("crm-pipeline");
    showSuccessFeedback(`Deal "$${newDeal.value.toLocaleString()}" created!`);

    // Reset
    setDealTitle("");
    setDealValue("15000");
    setDealContactName("");
    setDealCompany("");
  };

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(false);
              setActiveModal(null);
            }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-40 transition-opacity"
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button and Speed Dial Menu */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Speed Dial Menu Actions */}
        <AnimatePresence>
          {isOpen && !activeModal && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex flex-col items-end gap-2.5 mb-2"
            >
              {/* Action 1: Create Deal */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md whitespace-nowrap">
                  Create Deal
                </span>
                <button
                  id="fab-action-create-deal"
                  onClick={() => setActiveModal("deal")}
                  className="w-11 h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                  title="Create Pipeline Deal"
                >
                  <Briefcase className="w-5 h-5" />
                </button>
              </div>

              {/* Action 2: Log Call */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md whitespace-nowrap">
                  Log Call
                </span>
                <button
                  id="fab-action-log-call"
                  onClick={() => setActiveModal("call")}
                  className="w-11 h-11 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
                  title="Log Phone Call"
                >
                  <PhoneCall className="w-5 h-5" />
                </button>
              </div>

              {/* Action 3: Add Contact */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md whitespace-nowrap">
                  Add Contact
                </span>
                <button
                  id="fab-action-add-contact"
                  onClick={() => setActiveModal("contact")}
                  className="w-11 h-11 rounded-2xl bg-[#3F51B5] hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                  title="Add Inbound Lead"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <button
          id="btn-dashboard-quick-add-fab"
          onClick={() => {
            if (activeModal) {
              setActiveModal(null);
            } else {
              setIsOpen(!isOpen);
            }
          }}
          className={`h-14 px-4.5 sm:px-5 rounded-full text-white flex items-center gap-2.5 shadow-2xl transition-all duration-200 active:scale-95 ${
            isOpen || activeModal
              ? "bg-slate-800 dark:bg-slate-700 shadow-slate-900/40"
              : "bg-gradient-to-r from-[#3F51B5] to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105"
          }`}
        >
          <motion.div
            animate={{ rotate: isOpen || activeModal ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-5 h-5" />
          </motion.div>
          <span className="font-extrabold text-xs tracking-wide uppercase">
            {isOpen || activeModal ? "Close" : "Quick Add"}
          </span>
        </button>
      </div>

      {/* Quick Entry Modal Forms */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative overflow-hidden ${
                darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              {/* Success Notification Banner */}
              {submittedMessage && (
                <div className="absolute inset-0 bg-emerald-500 text-white flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-12 h-12 mb-2 animate-bounce" />
                  <h4 className="text-lg font-black">{submittedMessage}</h4>
                  <p className="text-xs opacity-90 mt-1">Saved and synced with pipeline</p>
                </div>
              )}

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold ${
                      activeModal === "contact"
                        ? "bg-[#3F51B5]"
                        : activeModal === "call"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  >
                    {activeModal === "contact" && <UserPlus className="w-4 h-4" />}
                    {activeModal === "call" && <PhoneCall className="w-4 h-4" />}
                    {activeModal === "deal" && <Briefcase className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">
                      {activeModal === "contact" && "Add New Contact"}
                      {activeModal === "call" && "Log Phone Call"}
                      {activeModal === "deal" && "Create Pipeline Deal"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Quick 1-click capture into your Revenue OS
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form 1: Add Contact */}
              {activeModal === "contact" && (
                <form onSubmit={handleCreateContact} className="mt-4 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="sarah@company.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Health Systems"
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 active:scale-95"
                    >
                      Save Contact
                    </button>
                  </div>
                </form>
              )}

              {/* Form 2: Log Call */}
              {activeModal === "call" && (
                <form onSubmit={handleLogCall} className="mt-4 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Vance"
                      value={callContactName}
                      onChange={(e) => setCallContactName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Call Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 4m 12s"
                        value={callDuration}
                        onChange={(e) => setCallDuration(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Outcome
                      </label>
                      <select
                        value={callOutcome}
                        onChange={(e) => setCallOutcome(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-bold"
                      >
                        <option value="completed">Completed &amp; Qualified</option>
                        <option value="scheduled">Scheduled Follow-up</option>
                        <option value="missed">Missed / Voicemail</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Call Notes / AI Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Discussed proposal budget, key stakeholders, and booked demo call..."
                      value={callSummary}
                      onChange={(e) => setCallSummary(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20 active:scale-95"
                    >
                      Log Call Record
                    </button>
                  </div>
                </form>
              )}

              {/* Form 3: Create Deal */}
              {activeModal === "deal" && (
                <form onSubmit={handleCreateDeal} className="mt-4 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Deal Opportunity Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Enterprise RevOps Platform - Annual"
                      value={dealTitle}
                      onChange={(e) => setDealTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Contract Value ($) *
                      </label>
                      <input
                        type="number"
                        required
                        min={100}
                        step={500}
                        value={dealValue}
                        onChange={(e) => setDealValue(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Pipeline Stage
                      </label>
                      <select
                        value={dealStage}
                        onChange={(e) => setDealStage(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-bold"
                      >
                        <option value="new_lead">New Lead (20%)</option>
                        <option value="qualified">Discovery / Qualified (45%)</option>
                        <option value="proposal">Proposal Sent (65%)</option>
                        <option value="negotiation">In Negotiation (85%)</option>
                        <option value="won">Closed Won (100%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Primary Contact
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Marcus Ray"
                        value={dealContactName}
                        onChange={(e) => setDealContactName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Horizon Labs"
                        value={dealCompany}
                        onChange={(e) => setDealCompany(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      Create Deal
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
