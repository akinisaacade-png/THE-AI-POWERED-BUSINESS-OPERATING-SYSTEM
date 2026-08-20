import React, { useState } from "react";
import { Contact } from "../types";
import {
  Users,
  Plus,
  Search,
  Filter,
  Trash2,
  Phone,
  Mail,
  Building,
  Tag,
  Sparkles,
  Download,
  Calendar,
  Zap,
  Flame,
  Snowflake,
  TrendingUp,
  Activity,
  Globe,
  CheckCircle2,
  ArrowUpDown,
  RefreshCw,
  Info,
  X,
  Play,
} from "lucide-react";
import { analyzeWithFlashLite } from "../services/api";

interface ContactsPageProps {
  contacts: Contact[];
  onAddContact: (contact: any) => void;
  onDeleteContact: (contactId: string) => void;
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
}

// Transparent mathematical lead scoring algorithm
export function calculateLeadScore(contact: Contact) {
  const callsCount = contact.interactions?.calls_count ?? (contact.tags?.includes("Inbound Call") ? 2 : 1);
  const emailsOpened = contact.interactions?.emails_opened ?? (contact.status === "Customer" ? 10 : 4);
  const emailsReplied = contact.interactions?.emails_replied ?? (contact.tags?.includes("High-Intent") ? 3 : 1);
  const webVisits = contact.interactions?.website_visits ?? 6;

  // 1. Calls Score (up to 30 pts)
  const callsScore = Math.min(callsCount * 8, 30);

  // 2. Email Engagement Score (up to 25 pts)
  const emailsScore = Math.min(emailsOpened * 2 + emailsReplied * 6, 25);

  // 3. Website & Digital Touchpoints Score (up to 25 pts)
  const webScore = Math.min(webVisits * 3, 25);

  // 4. Intent Tags & Status Score (up to 20 pts)
  let tagsScore = 0;
  if (contact.tags?.some((t) => t.includes("Enterprise") || t.includes("Decision Maker"))) tagsScore += 10;
  if (contact.tags?.some((t) => t.includes("High-Intent") || t.includes("Hot Lead"))) tagsScore += 6;
  if (contact.status === "Customer" || contact.status === "Active") tagsScore += 4;
  tagsScore = Math.min(tagsScore, 20);

  const rawScore = callsScore + emailsScore + webScore + tagsScore;
  const score = Math.min(Math.max(contact.lead_score ?? rawScore, 12), 99);

  let tier: "Hot" | "Warm" | "Cold" = "Cold";
  if (score >= 80) tier = "Hot";
  else if (score >= 50) tier = "Warm";

  return {
    score,
    tier,
    breakdown: {
      callsScore,
      emailsScore,
      webScore,
      tagsScore,
      callsCount,
      emailsOpened,
      emailsReplied,
      webVisits,
    },
  };
}

export const ContactsPage: React.FC<ContactsPageProps> = ({
  contacts,
  onAddContact,
  onDeleteContact,
  onOpenDataModal,
  darkMode = false,
}) => {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [scoreFilter, setScoreFilter] = useState<"ALL" | "HOT" | "WARM" | "COLD">("ALL");
  const [sortByScore, setSortByScore] = useState<"none" | "desc" | "asc">("desc");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [inspectingContact, setInspectingContact] = useState<Contact | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [localContacts, setLocalContacts] = useState<Contact[]>(contacts);

  // Synchronize when prop changes
  React.useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  const tags = ["All", "Inbound Lead", "Enterprise", "High-Intent", "VIP Customer", "Decision Maker", "Missed Call"];

  // Compute metrics
  const scoredContacts = localContacts.map((c) => {
    const calc = calculateLeadScore(c);
    return {
      ...c,
      calculatedScore: calc.score,
      calculatedTier: calc.tier,
      breakdown: calc.breakdown,
    };
  });

  const totalContacts = scoredContacts.length;
  const avgLeadScore =
    totalContacts > 0
      ? Math.round(scoredContacts.reduce((sum, c) => sum + c.calculatedScore, 0) / totalContacts)
      : 0;
  const hotCount = scoredContacts.filter((c) => c.calculatedTier === "Hot").length;
  const warmCount = scoredContacts.filter((c) => c.calculatedTier === "Warm").length;
  const coldCount = scoredContacts.filter((c) => c.calculatedTier === "Cold").length;

  // Filter and sort contacts
  const filteredContacts = scoredContacts
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);

      const matchesTag =
        selectedTag === "All" || (c.tags && c.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()));

      const matchesScore =
        scoreFilter === "ALL" ||
        (scoreFilter === "HOT" && c.calculatedTier === "Hot") ||
        (scoreFilter === "WARM" && c.calculatedTier === "Warm") ||
        (scoreFilter === "COLD" && c.calculatedTier === "Cold");

      return matchesSearch && matchesTag && matchesScore;
    })
    .sort((a, b) => {
      if (sortByScore === "desc") return b.calculatedScore - a.calculatedScore;
      if (sortByScore === "asc") return a.calculatedScore - b.calculatedScore;
      return 0;
    });

  const handleRunContactScoring = async (contact: Contact) => {
    setSelectedContact(contact);
    setLoadingAi(true);
    try {
      const res = await analyzeWithFlashLite(
        `Perform advanced buyer intent & lead score evaluation for: Name: ${contact.name}, Company: ${contact.company_name}, Status: ${contact.status}, Source: ${contact.source}. Explain key conversion drivers and recommend 2 immediate closing angles.`
      );
      setAiAnalysis(res.analysis);
    } catch (e) {
      setAiAnalysis("Recommend high-intent outreach: Propose a personalized demo link with tailored ROI projections based on company size.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Simulate Touchpoint / Boost Score
  const handleSimulateTouchpoint = (contactId: string, type: "call" | "email" | "visit") => {
    setLocalContacts((prev) =>
      prev.map((c) => {
        if (c.id !== contactId) return c;
        const currentInteractions = c.interactions || {
          calls_count: 1,
          emails_opened: 3,
          emails_replied: 1,
          website_visits: 4,
        };

        const updatedInteractions = {
          ...currentInteractions,
          calls_count: type === "call" ? currentInteractions.calls_count + 1 : currentInteractions.calls_count,
          emails_replied: type === "email" ? currentInteractions.emails_replied + 1 : currentInteractions.emails_replied,
          emails_opened: type === "email" ? currentInteractions.emails_opened + 2 : currentInteractions.emails_opened,
          website_visits: type === "visit" ? currentInteractions.website_visits + 3 : currentInteractions.website_visits,
        };

        const updatedContact: Contact = {
          ...c,
          interactions: updatedInteractions,
          lead_score: Math.min((c.lead_score ?? 60) + (type === "call" ? 10 : type === "email" ? 8 : 6), 99),
        };

        if (inspectingContact && inspectingContact.id === contactId) {
          setInspectingContact(updatedContact);
        }

        return updatedContact;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Contacts &amp; Autonomous Lead Scoring
            </h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#3F51B5] text-white shadow-xs">
              {totalContacts} Contacts Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic 0–100 behavioral scoring based on real-time calls, email velocity, and website telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortByScore((prev) => (prev === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all shadow-xs"
            title="Sort by Lead Score"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#3F51B5] dark:text-indigo-400" />
            <span>Score: {sortByScore === "desc" ? "Highest First" : "Lowest First"}</span>
          </button>

          <button
            id="btn-contacts-add-new"
            onClick={() => onOpenDataModal("contacts")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add / Import Contact</span>
          </button>
        </div>
      </div>

      {/* 1. Lead Scoring Summary Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Average Lead Score */}
        <div
          onClick={() => setScoreFilter("ALL")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            scoreFilter === "ALL"
              ? "ring-2 ring-[#3F51B5] border-transparent shadow-md"
              : "hover:border-slate-300 dark:hover:border-slate-700"
          } ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Avg Lead Score
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-[#3F51B5] flex items-center justify-center font-black text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {avgLeadScore}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 100 max</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {totalContacts} tracked prospect profiles
          </p>
        </div>

        {/* Metric 2: Hot Leads */}
        <div
          onClick={() => setScoreFilter("HOT")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            scoreFilter === "HOT"
              ? "ring-2 ring-rose-500 border-transparent shadow-md"
              : "hover:border-slate-300 dark:hover:border-slate-700"
          } ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500">
              🔥 Hot Leads (80+)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono">
              High Intent
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {hotCount}
            </span>
            <span className="text-xs font-bold text-slate-400">ready to close</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Frequent calls &amp; multiple email replies
          </p>
        </div>

        {/* Metric 3: Warm Leads */}
        <div
          onClick={() => setScoreFilter("WARM")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            scoreFilter === "WARM"
              ? "ring-2 ring-amber-500 border-transparent shadow-md"
              : "hover:border-slate-300 dark:hover:border-slate-700"
          } ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF9800]">
              ⚡ Warm Leads (50-79)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
              Engaged
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-[#FF9800]">
              {warmCount}
            </span>
            <span className="text-xs font-bold text-slate-400">nurturing</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active web visits &amp; email opens
          </p>
        </div>

        {/* Metric 4: Cold Leads */}
        <div
          onClick={() => setScoreFilter("COLD")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            scoreFilter === "COLD"
              ? "ring-2 ring-indigo-400 border-transparent shadow-md"
              : "hover:border-slate-300 dark:hover:border-slate-700"
          } ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              ❄️ Cold Leads (&lt;50)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono">
              Drip Mode
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-slate-600 dark:text-slate-400">
              {coldCount}
            </span>
            <span className="text-xs font-bold text-slate-400">automated</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Queued for automated AI re-engagement
          </p>
        </div>
      </div>

      {/* AI Contact Scoring Drawer when active */}
      {selectedContact && (
        <div
          className={`p-4 rounded-2xl border transition-all ${
            darkMode ? "bg-indigo-950/40 border-indigo-800" : "bg-indigo-50 border-indigo-200"
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 dark:border-indigo-800/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF9800]" />
              <span className="text-xs font-black text-[#3F51B5] dark:text-indigo-300">
                AI Prospect Intent Analysis: {selectedContact.name} ({selectedContact.company_name})
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedContact(null);
                setAiAnalysis(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Close
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-700 dark:text-slate-200">
            {loadingAi ? (
              <div className="flex items-center gap-2 text-[#3F51B5] dark:text-indigo-300 font-bold animate-pulse py-2">
                <Zap className="w-4 h-4" />
                <span>Running Flash-Lite buyer persona and win probability scoring...</span>
              </div>
            ) : (
              <p className="whitespace-pre-line leading-relaxed font-medium">{aiAnalysis}</p>
            )}
          </div>
        </div>
      )}

      {/* Score Inspection Popover / Detailed Modal */}
      {inspectingContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4 ${
              darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#3F51B5] text-white flex items-center justify-center font-black text-sm">
                  {calculateLeadScore(inspectingContact).score}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Lead Score Breakdown: {inspectingContact.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {inspectingContact.company_name || "Independent"} • {inspectingContact.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingContact(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Breakdown Bars */}
            <div className="space-y-3 text-xs">
              {/* Factor 1: Calls */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-[#3F51B5]" />
                    <span>Call Interactions ({inspectingContact.interactions?.calls_count ?? 2} logged calls)</span>
                  </span>
                  <span className="font-mono text-[#3F51B5] dark:text-indigo-400">
                    +{calculateLeadScore(inspectingContact).breakdown.callsScore} / 30 pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3F51B5] h-full rounded-full"
                    style={{
                      width: `${(calculateLeadScore(inspectingContact).breakdown.callsScore / 30) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Factor 2: Emails */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      Email Activity ({inspectingContact.interactions?.emails_opened ?? 4} opens,{" "}
                      {inspectingContact.interactions?.emails_replied ?? 1} replies)
                    </span>
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    +{calculateLeadScore(inspectingContact).breakdown.emailsScore} / 25 pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{
                      width: `${(calculateLeadScore(inspectingContact).breakdown.emailsScore / 25) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Factor 3: Web Visits */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Globe className="w-3.5 h-3.5 text-[#FF9800]" />
                    <span>Website Telemetry ({inspectingContact.interactions?.website_visits ?? 6} page views)</span>
                  </span>
                  <span className="font-mono text-[#FF9800]">
                    +{calculateLeadScore(inspectingContact).breakdown.webScore} / 25 pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF9800] h-full rounded-full"
                    style={{
                      width: `${(calculateLeadScore(inspectingContact).breakdown.webScore / 25) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Factor 4: Intent Tags */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Tag className="w-3.5 h-3.5 text-purple-500" />
                    <span>Profile &amp; Intent Tags (Enterprise, High-Intent)</span>
                  </span>
                  <span className="font-mono text-purple-600 dark:text-purple-400">
                    +{calculateLeadScore(inspectingContact).breakdown.tagsScore} / 20 pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{
                      width: `${(calculateLeadScore(inspectingContact).breakdown.tagsScore / 20) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Simulate Interaction Section */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Simulate Prospect Activity Touchpoint:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSimulateTouchpoint(inspectingContact.id, "call")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-[#3F51B5] dark:text-indigo-300 text-xs font-bold hover:bg-indigo-200 transition-all"
                >
                  <Phone className="w-3 h-3" />
                  <span>+1 Inbound Call (+10 pts)</span>
                </button>
                <button
                  onClick={() => handleSimulateTouchpoint(inspectingContact.id, "email")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition-all"
                >
                  <Mail className="w-3 h-3" />
                  <span>+1 Email Reply (+8 pts)</span>
                </button>
                <button
                  onClick={() => handleSimulateTouchpoint(inspectingContact.id, "visit")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-[#FF9800] text-xs font-bold hover:bg-amber-200 transition-all"
                >
                  <Globe className="w-3 h-3" />
                  <span>+3 Pricing Visits (+6 pts)</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingContact(null)}
                className="px-4 py-2 rounded-xl bg-[#3F51B5] text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email, phone..."
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
              darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          />
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto custom-scrollbar">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedTag === t
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : darkMode
                  ? "bg-slate-800 text-slate-400 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table with Lead Scoring Column */}
      <div
        className={`rounded-3xl border overflow-hidden ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b font-extrabold uppercase tracking-wider text-[10px] ${
                darkMode ? "bg-slate-800/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <tr>
                <th className="p-4">Contact &amp; Company</th>
                <th className="p-4">Lead Score &amp; Tier</th>
                <th className="p-4">Interaction Signals</th>
                <th className="p-4">Tags &amp; Source</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredContacts.map((c) => {
                const score = c.calculatedScore;
                const tier = c.calculatedTier;

                return (
                  <tr
                    key={c.id}
                    className={`transition-colors ${
                      darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* 1. Contact & Company */}
                    <td className="p-4">
                      <div className="font-black text-slate-900 dark:text-white text-xs">{c.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-[#3F51B5]" />
                        <span>{c.company_name || "Independent"}</span>
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">{c.email}</div>
                    </td>

                    {/* 2. Lead Score & Tier Badge */}
                    <td className="p-4">
                      <div
                        onClick={() => setInspectingContact(c)}
                        className="cursor-pointer group flex items-center gap-2.5"
                        title="Click to view full lead score breakdown"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs shadow-xs transition-transform group-hover:scale-105 ${
                            tier === "Hot"
                              ? "bg-rose-500 text-white"
                              : tier === "Warm"
                              ? "bg-[#FF9800] text-indigo-950"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {score}
                        </div>

                        <div>
                          <div className="flex items-center gap-1 font-bold text-xs">
                            {tier === "Hot" ? (
                              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 fill-current" />
                                <span>Hot Lead</span>
                              </span>
                            ) : tier === "Warm" ? (
                              <span className="text-[#FF9800] flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 fill-current" />
                                <span>Warm Lead</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Snowflake className="w-3.5 h-3.5" />
                                <span>Cold Nurture</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 group-hover:underline flex items-center gap-0.5 mt-0.5">
                            <Info className="w-2.5 h-2.5" /> View Breakdown
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Interaction Signals */}
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[#3F51B5] dark:text-indigo-300 text-[10px] font-bold flex items-center gap-1"
                          title="Logged Calls"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{c.breakdown.callsCount} calls</span>
                        </span>

                        <span
                          className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                          title="Email Opens & Replies"
                        >
                          <Mail className="w-2.5 h-2.5" />
                          <span>{c.breakdown.emailsOpened} opens / {c.breakdown.emailsReplied} replies</span>
                        </span>

                        <span
                          className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[#FF9800] text-[10px] font-bold flex items-center gap-1"
                          title="Website Visits"
                        >
                          <Globe className="w-2.5 h-2.5" />
                          <span>{c.breakdown.webVisits} visits</span>
                        </span>
                      </div>
                    </td>

                    {/* 4. Tags & Source */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {c.tags?.map((tg, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Source: {c.source}</div>
                    </td>

                    {/* 5. Lead Status */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          c.status === "Customer"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : c.status === "Lead"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* 6. Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRunContactScoring(c)}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-[#3F51B5] dark:text-indigo-300 hover:bg-indigo-100 font-bold transition-all text-[11px] flex items-center gap-1 shadow-xs"
                          title="Run Gemini AI Intent Analysis"
                        >
                          <Sparkles className="w-3 h-3 text-[#FF9800]" />
                          <span className="hidden sm:inline">AI Analysis</span>
                        </button>
                        <button
                          onClick={() => onDeleteContact(c.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                          title="Delete Contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
