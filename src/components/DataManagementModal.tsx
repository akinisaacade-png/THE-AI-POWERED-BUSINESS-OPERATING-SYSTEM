import React, { useState } from "react";
import { Plus, Trash2, Upload, X, CheckCircle2, Database, Calendar } from "lucide-react";

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
  onAddContact: (contact: any) => void;
  onAddDeal: (deal: any) => void;
  onAddCall: (call: any) => void;
  onAddBooking: (booking: any) => void;
  onAddReview: (review: any) => void;
  onAddPayment: (payment: any) => void;
  onAddWorkflow: (workflow: any) => void;
  onAddFunnel: (funnel: any) => void;
  onAddAd: (ad: any) => void;
  onAddDocument: (doc: any) => void;
  onAddSocialPost: (post: any) => void;
  darkMode?: boolean;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  activeSection = "contacts",
  onAddContact,
  onAddDeal,
  onAddCall,
  onAddBooking,
  onAddReview,
  onAddPayment,
  onAddWorkflow,
  onAddFunnel,
  onAddAd,
  onAddDocument,
  onAddSocialPost,
  darkMode = false,
}) => {
  const [section, setSection] = useState(activeSection);
  const [nameOrTitle, setNameOrTitle] = useState("");
  const [emailOrChannel, setEmailOrChannel] = useState("");
  const [phoneOrPlatform, setPhoneOrPlatform] = useState("");
  const [valueOrAmount, setValueOrAmount] = useState("15000");
  const [customNotes, setCustomNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const currentDateStr = now.toISOString().replace("T", " ").slice(0, 16);
    const currentDateShort = now.toISOString().slice(0, 10);
    const idSuffix = Date.now().toString().slice(-4);

    if (section === "contacts" || section === "crm-pipeline") {
      const newC = {
        id: `cnt-${idSuffix}`,
        name: nameOrTitle || "New Inbound Prospect",
        email: emailOrChannel || `prospect.${idSuffix}@enterprise.io`,
        phone: phoneOrPlatform || "+1 (555) 019-" + idSuffix,
        tags: ["Inbound Lead", "AI Captured"],
        source: "Direct App Input",
        owner_id: "usr-1",
        owner_name: "Alex Mercer",
        company_name: customNotes || "Acme Innovations",
        status: "Lead",
        created_at: currentDateStr,
        win_probability: 78,
        churn_risk: "Low",
        ai_next_action: "Trigger automated SMS welcome pack and calendar booking link.",
      };
      onAddContact(newC);

      const newD = {
        id: `deal-${idSuffix}`,
        contact_id: newC.id,
        contact_name: newC.name,
        company_name: newC.company_name,
        title: `${newC.name} - Enterprise Solution`,
        value: Number(valueOrAmount) || 18500,
        stage: "new_lead",
        close_date: currentDateShort,
        probability: 70,
        owner_name: "Alex Mercer",
        ai_insights: {
          next_best_action: "Send automated discovery quiz and calendar link.",
          churn_risk: "Low" as const,
          win_probability: 75,
          reasoning: "Imported into pipeline with current date verification.",
        },
      };
      onAddDeal(newD);
    } else if (section === "calls-voice-ai") {
      onAddCall({
        id: `call-${idSuffix}`,
        contact_name: nameOrTitle || "Inbound Caller",
        phone: phoneOrPlatform || "+1 (555) 999-" + idSuffix,
        type: "inbound",
        duration: "04:12",
        outcome: "Booked Demo",
        timestamp: currentDateStr,
        ai_summary: customNotes || "Customer evaluated revenue automation workflows and requested pricing proposal.",
        sentiment: "Positive",
        follow_up_task: "Send enterprise agreement before end of day.",
      });
    } else if (section === "calendars-booking") {
      onAddBooking({
        id: `bk-${idSuffix}`,
        contact_id: `cnt-${idSuffix}`,
        contact_name: nameOrTitle || "Executive Prospect",
        contact_email: emailOrChannel || "exec@company.com",
        service_id: "srv-demo",
        service_name: customNotes || "AI Revenue OS Live Architecture Demo",
        datetime: `${currentDateShort} 14:00`,
        duration_minutes: 45,
        status: "confirmed",
        team_member: "Alex Mercer",
        meeting_link: "https://meet.google.com/ais-rev-demo",
      });
    } else if (section === "reputation") {
      onAddReview({
        id: `rev-${idSuffix}`,
        source: (emailOrChannel as any) || "Google",
        rating: 5,
        author_name: nameOrTitle || "Enterprise Client VP",
        date: currentDateShort,
        text: customNotes || "The missed-call text-back recovered $30k in deals in our very first week.",
        responded: true,
        ai_response: "Thank you! We are excited to support your revenue growth.",
      });
    } else if (section === "payments") {
      onAddPayment({
        id: `pay-${idSuffix}`,
        contact_id: `cnt-${idSuffix}`,
        contact_name: nameOrTitle || "Corporate Client",
        amount: Number(valueOrAmount) || 24000,
        currency: "USD",
        status: "paid",
        method: "Stripe",
        invoice_number: `INV-2026-${idSuffix}`,
        date: currentDateShort,
        plan: customNotes || "Enterprise Annual Growth Plan",
      });
    } else if (section === "automation") {
      onAddWorkflow({
        id: `wf-${idSuffix}`,
        name: nameOrTitle || "Custom Revenue Nurture Flow",
        trigger_event: emailOrChannel || "inbound_contact_registered",
        trigger_condition: "lead_score > 70",
        status: "running",
        last_run: `${currentDateStr} (Just now)`,
        success_rate: 100,
        judge_verdict: "APPROVED",
        judge_notes: "Schema validated with 0 orphaned triggers.",
        steps: [
          { id: "s1", title: "Capture Event", type: "trigger", description: "Triggered on new event", configured: true },
          { id: "s2", title: "Send SMS Nudge", type: "action", description: "Sends dynamic link", configured: true },
        ],
      });
    } else if (section === "ad-manager") {
      onAddAd({
        id: `ad-${idSuffix}`,
        platform: (phoneOrPlatform as any) || "Google",
        campaign_name: nameOrTitle || "Search - Revenue Automation High Intent",
        spend: Number(valueOrAmount) || 1200,
        budget: 2500,
        impressions: 34000,
        clicks: 1820,
        conversions: 110,
        roas: 4.8,
        cpa: 10.9,
        status: "Active",
        ai_creative_tip: customNotes || "Focus on speed to lead with instant 8s text-back response hook.",
      });
    } else if (section === "document-signing") {
      onAddDocument({
        id: `doc-${idSuffix}`,
        title: nameOrTitle || "Enterprise Master Services Agreement",
        type: "contract",
        status: "sent",
        link: "https://rev-os.io/docs/sign/" + idSuffix,
        contact_id: `cnt-${idSuffix}`,
        contact_name: emailOrChannel || "Eleanor Vance",
        created_at: currentDateShort,
        value: Number(valueOrAmount) || 35000,
      });
    } else if (section === "social-planner") {
      onAddSocialPost({
        id: `post-${idSuffix}`,
        platforms: ["LinkedIn", "X"],
        content: customNotes || "How THE AI-POWERED BUSINESS OPERATING SYSTEM eliminates lead drop-off with autonomous agents. ⚡📈",
        scheduled_for: `${currentDateShort} 10:00`,
        status: "scheduled",
        engagement: { likes: 0, shares: 0, comments: 0 },
      });
    } else {
      // Default to contact & deal
      onAddContact({
        id: `cnt-${idSuffix}`,
        name: nameOrTitle || "Imported Record",
        email: emailOrChannel || "imported@company.com",
        phone: phoneOrPlatform || "+1 (555) 222-3333",
        tags: ["Imported", "Current Date"],
        source: "Manual Import",
        owner_id: "usr-1",
        owner_name: "Alex Mercer",
        status: "Lead",
        created_at: currentDateStr,
      });
    }

    setSuccessMsg(`Successfully added record to "${section}" with current date: ${currentDateStr}`);
    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        id="data-management-modal-container"
        className={`w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden transition-all ${
          darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-900 to-[#3F51B5] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF9800] text-indigo-950 flex items-center justify-center font-black text-xl shadow-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Universal Data Management & Import
              </h3>
              <p className="text-xs text-indigo-100 mt-0.5">
                Add, import or sync records with current system timestamp.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreateRecord} className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">
              Target Module / Section
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              <option value="contacts">3. Contacts & CRM Leads</option>
              <option value="crm-pipeline">2. CRM & Pipeline Deals</option>
              <option value="calls-voice-ai">5. Calls & Voice AI Logs</option>
              <option value="calendars-booking">4. Calendars & Bookings</option>
              <option value="reputation">7. Reputation & Reviews</option>
              <option value="payments">13. Payments & Invoices</option>
              <option value="automation">14. Automation Workflows</option>
              <option value="ad-manager">12. Ad Campaigns</option>
              <option value="document-signing">17. Document Signing</option>
              <option value="social-planner">20. Social Planner Posts</option>
            </select>
          </div>

          {/* Dynamic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                Record Name / Title
              </label>
              <input
                type="text"
                required
                value={nameOrTitle}
                onChange={(e) => setNameOrTitle(e.target.value)}
                placeholder="e.g. Acme Corp Enterprise Deal"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                Email / Channel / Source
              </label>
              <input
                type="text"
                value={emailOrChannel}
                onChange={(e) => setEmailOrChannel(e.target.value)}
                placeholder="e.g. client@acme.com or Google"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                Phone / Platform
              </label>
              <input
                type="text"
                value={phoneOrPlatform}
                onChange={(e) => setPhoneOrPlatform(e.target.value)}
                placeholder="e.g. +1 (555) 345-6789 or Google"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                Value / Budget ($)
              </label>
              <input
                type="number"
                value={valueOrAmount}
                onChange={(e) => setValueOrAmount(e.target.value)}
                placeholder="15000"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
              Notes / AI Instructions / Copy
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Additional operational parameters or notes..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-[#FF9800]" />
            <span>Automatic Timestamp: {new Date().toLocaleString()}</span>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-confirm-add-import-data"
              className="px-5 py-2.5 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save &amp; Import Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
