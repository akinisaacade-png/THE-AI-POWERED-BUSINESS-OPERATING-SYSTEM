import React, { useState, useEffect } from "react";
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
  Gauge,
  Sliders,
  Check,
  ChevronRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import {
  calculateLeadScore,
  scoreContactWithAI,
  scoreAllContacts,
  LeadScoreResult,
} from "../services/leadScoring";
import { analyzeWithFlashLite } from "../services/api";

interface ContactsPageProps {
  contacts: Contact[];
  onAddContact: (contact: any) => void;
  onDeleteContact: (contactId: string) => void;
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
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
  const [isAutomatingAll, setIsAutomatingAll] = useState(false);
  const [scoringNotification, setScoringNotification] = useState<string | null>(null);
  const [localContacts, setLocalContacts] = useState<Contact[]>(contacts);

  // Synchronize when prop changes
  useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  const tags = ["All", "Inbound Lead", "Enterprise", "High-Intent", "VIP Customer", "Decision Maker", "Missed Call", "Webinar"];

  // Automated scoring evaluation for all contacts
  const scoredContacts = localContacts.map((c) => {
    const calc = calculateLeadScore(c);
    return {
      ...c,
      calculatedScore: calc.score,
      calculatedTier: calc.tier,
      breakdown: calc.breakdown,
      reasoning: calc.reasoning,
      recommendation: calc.recommendation,
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

  // Automated Batch Lead Scoring Action
  const handleAutomateAllScoring = async () => {
    setIsAutomatingAll(true);
    setScoringNotification("Running automated AI scoring on all contacts based on interaction telemetry...");
    try {
      // Simulate real-time automated scoring pass
      await new Promise((resolve) => setTimeout(resolve, 800));
      const updated = await scoreAllContacts(localContacts);
      setLocalContacts(updated);
      setScoringNotification(`Successfully automated AI scoring for ${updated.length} contacts!`);
      setTimeout(() => setScoringNotification(null), 4000);
    } catch (e) {
      setScoringNotification("AI Scoring completed with fallback heuristics.");
      setTimeout(() => setScoringNotification(null), 3000);
    } finally {
      setIsAutomatingAll(false);
    }
  };

  const handleRunContactScoring = async (contact: Contact) => {
    setSelectedContact(contact);
    setLoadingAi(true);
    try {
      const res = await scoreContactWithAI(contact);
      setAiAnalysis(`AI Purchase Probability: ${res.score}% (${res.tier} Tier)\n\nKey Intent Drivers:\n${res.reasoning}\n\nRecommended Action:\n${res.recommendation}`);
      // Also update local contact with the fresh score
      setLocalContacts((prev) =>
        prev.map((c) =>
          c.id === contact.id
            ? {
                ...c,
                lead_score: res.score,
                win_probability: res.score,
                lead_tier: res.tier,
                ai_next_action: res.recommendation,
              }
            : c
        )
      );
    } catch (e) {
      const fallback = calculateLeadScore(contact);
      setAiAnalysis(`Calculated Probability: ${fallback.score}%\n${fallback.reasoning}\nNext step: ${fallback.recommendation}`);
    } finally {
      setLoadingAi(false);
    }
  };

  // Simulate Touchpoint / Boost Score in Real Time
  const handleSimulateTouchpoint = (contactId: string, type: "call" | "email" | "visit") => {
    setLocalContacts((prev) =>
      prev.map((c) => {
        if (c.id !== contactId) return c;
        const currentInteractions = c.interactions || {
          calls_count: 1,
          emails_opened: 3,
          emails_replied: 1,
          website_visits: 4,
          form_submissions: 1,
          last_visited_page: "/enterprise-pricing",
        };

        const updatedInteractions = {
          ...currentInteractions,
          calls_count: type === "call" ? currentInteractions.calls_count + 1 : currentInteractions.calls_count,
          emails_replied: type === "email" ? currentInteractions.emails_replied + 1 : currentInteractions.emails_replied,
          emails_opened: type === "email" ? currentInteractions.emails_opened + 2 : currentInteractions.emails_opened,
          website_visits: type === "visit" ? currentInteractions.website_visits + 3 : currentInteractions.website_visits,
        };

        const tempContact: Contact = {
          ...c,
          interactions: updatedInteractions,
        };
        const newScore = calculateLeadScore(tempContact);

        const updatedContact: Contact = {
          ...tempContact,
          lead_score: newScore.score,
          win_probability: newScore.score,
          lead_tier: newScore.tier,
          ai_next_action: newScore.recommendation,
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
      {/* Header with Title and Automated Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Contacts &amp; AI Lead Scoring
            </h2>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#3F51B5] text-white shadow-xs">
              {totalContacts} Profiles Tracked
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Automated 0–100% Probability Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated machine-learning scoring assigning 0–100% conversion probability to each contact based on calls, email telemetry, and website engagement signals.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Automated AI Lead Scoring Trigger */}
          <button
            id="btn-automate-ai-lead-scoring"
            onClick={handleAutomateAllScoring}
            disabled={isAutomatingAll}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 ${
              isAutomatingAll
                ? "bg-indigo-400 text-white cursor-wait"
                : "bg-gradient-to-r from-[#3F51B5] to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-500/20"
            }`}
            title="Automatically calculate AI lead scores for all contacts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutomatingAll ? "animate-spin" : ""}`} />
            <span>{isAutomatingAll ? "Scoring Contacts..." : "Automate AI Lead Scoring"}</span>
          </button>

          {/* Simulate Live Inbound Lead */}
          <button
            onClick={() => {
              const idSuffix = Date.now().toString().slice(-4);
              const sampleCompanies = ["Apex Cloud Systems", "Starlight Health AI", "HyperScale Logistics", "Quantum Retail Labs"];
              const sampleNames = ["Elena Rostova", "Marcus Vance", "Sophia Chen", "Derrick Sterling"];
              const randomIdx = Math.floor(Math.random() * sampleNames.length);

              const simulatedContact: Contact = {
                id: `cnt-live-${idSuffix}`,
                name: sampleNames[randomIdx],
                email: `${sampleNames[randomIdx].toLowerCase().replace(" ", ".")}@${sampleCompanies[randomIdx].toLowerCase().replace(/\s+/g, "")}.io`,
                phone: `+1 (555) 492-${idSuffix}`,
                company_name: sampleCompanies[randomIdx],
                tags: ["High-Intent", "Live Webhook", "AI Scored"],
                source: "Website AI Inbound Chat",
                owner_id: "usr-1",
                owner_name: "Alex Mercer",
                status: "Lead",
                created_at: new Date().toISOString().slice(0, 16).replace("T", " "),
                win_probability: 91,
                churn_risk: "Low",
                lead_score: 91,
                lead_tier: "Hot",
                ai_next_action: "Trigger priority outbound call or calendar booking workflow.",
                interactions: {
                  calls_count: 2,
                  emails_opened: 5,
                  emails_replied: 3,
                  website_visits: 11,
                  last_visited_page: "/enterprise-pricing",
                  form_submissions: 2,
                },
              };
              onAddContact(simulatedContact);
            }}
            id="btn-simulate-inbound-lead"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-[#3F51B5] dark:text-indigo-300 font-bold text-xs transition-all shadow-xs"
            title="Simulate Real-Time Inbound Webhook / Lead Capture"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Lead</span>
          </button>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortByScore((prev) => (prev === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all shadow-xs"
            title="Sort contacts by AI Lead Score"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#3F51B5] dark:text-indigo-400" />
            <span>Score: {sortByScore === "desc" ? "High to Low" : "Low to High"}</span>
          </button>

          {/* Add / Import Contact Modal */}
          <button
            id="btn-contacts-add-new"
            onClick={() => onOpenDataModal("contacts")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Notification Banner when automated scoring runs */}
      {scoringNotification && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-semibold">{scoringNotification}</span>
          </div>
          <button onClick={() => setScoringNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Lead Scoring Metric Summary Cards */}
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
              Avg AI Lead Score
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-[#3F51B5] flex items-center justify-center font-black text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {avgLeadScore}%
            </span>
            <span className="text-xs font-bold text-slate-400">conversion probability</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {totalContacts} analyzed prospect profiles
          </p>
        </div>

        {/* Metric 2: Hot Leads (80%+) */}
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
              🔥 Hot Leads (80–100%)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono">
              Ready to Close
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {hotCount}
            </span>
            <span className="text-xs font-bold text-slate-400">high intent</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Frequent calls, pricing visits &amp; replies
          </p>
        </div>

        {/* Metric 3: Warm Leads (50-79%) */}
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
              ⚡ Warm Leads (50–79%)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
              Active Nurture
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-[#FF9800]">
              {warmCount}
            </span>
            <span className="text-xs font-bold text-slate-400">engaging</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active email opens &amp; demo visits
          </p>
        </div>

        {/* Metric 4: Cold Leads (<50%) */}
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
              ❄️ Cold Leads (&lt;50%)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono">
              Automated Drip
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-slate-600 dark:text-slate-400">
              {coldCount}
            </span>
            <span className="text-xs font-bold text-slate-400">low touch</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Queued for automated AI re-activation
          </p>
        </div>
      </div>

      {/* AI Intent Analysis Drawer when triggered */}
      {selectedContact && (
        <div
          className={`p-5 rounded-2xl border transition-all ${
            darkMode ? "bg-indigo-950/40 border-indigo-800" : "bg-indigo-50 border-indigo-200"
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 dark:border-indigo-800/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF9800]" />
              <span className="text-xs font-black text-[#3F51B5] dark:text-indigo-300">
                AI Intent &amp; Conversion Evaluation: {selectedContact.name} ({selectedContact.company_name})
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
          <div className="mt-2.5 text-xs text-slate-700 dark:text-slate-200">
            {loadingAi ? (
              <div className="flex items-center gap-2 text-[#3F51B5] dark:text-indigo-300 font-bold animate-pulse py-2">
                <Zap className="w-4 h-4" />
                <span>Evaluating buyer persona, interaction history, and conversion probability...</span>
              </div>
            ) : (
              <p className="whitespace-pre-line leading-relaxed font-medium">{aiAnalysis}</p>
            )}
          </div>
        </div>
      )}

      {/* Detailed Lead Score Inspection Modal */}
      {inspectingContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4 ${
              darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${
                    calculateLeadScore(inspectingContact).tier === "Hot"
                      ? "bg-rose-500 text-white"
                      : calculateLeadScore(inspectingContact).tier === "Warm"
                      ? "bg-[#FF9800] text-indigo-950"
                      : "bg-slate-700 text-white"
                  }`}
                >
                  {calculateLeadScore(inspectingContact).score}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {inspectingContact.name}
                    </h4>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        calculateLeadScore(inspectingContact).tier === "Hot"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : calculateLeadScore(inspectingContact).tier === "Warm"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {calculateLeadScore(inspectingContact).tier} Lead
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
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

            {/* AI Reasoning Summary */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#3F51B5] dark:text-indigo-300 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Automated Lead Scoring Diagnosis:</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {calculateLeadScore(inspectingContact).reasoning}
              </p>
              <div className="mt-2 pt-2 border-t border-indigo-200/50 dark:border-indigo-800/50 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">Recommended Action: </span>
                {calculateLeadScore(inspectingContact).recommendation}
              </div>
            </div>

            {/* Scoring Breakdown Weights */}
            <div className="space-y-3 text-xs pt-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Scoring Breakdown by Interaction &amp; Engagement:
              </div>

              {/* Factor 1: Calls */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-[#3F51B5]" />
                    <span>Call Interactions ({inspectingContact.interactions?.calls_count ?? 1} calls)</span>
                  </span>
                  <span className="font-mono text-[#3F51B5] dark:text-indigo-400 font-bold">
                    +{calculateLeadScore(inspectingContact).breakdown.callsScore} / 30 pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3F51B5] h-full rounded-full transition-all duration-300"
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
                      Email Engagement ({inspectingContact.interactions?.emails_opened ?? 4} opens,{" "}
                      {inspectingContact.interactions?.emails_replied ?? 1} replies)
                    </span>
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    +{calculateLeadScore(inspectingContact).breakdown.emailsScore} / 25 pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(calculateLeadScore(inspectingContact).breakdown.emailsScore / 25) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Factor 3: Web Telemetry */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Globe className="w-3.5 h-3.5 text-[#FF9800]" />
                    <span>
                      Website Visits &amp; Intent URL ({inspectingContact.interactions?.website_visits ?? 6} visits)
                    </span>
                  </span>
                  <span className="font-mono text-[#FF9800] font-bold">
                    +{calculateLeadScore(inspectingContact).breakdown.webScore} / 25 pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF9800] h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(calculateLeadScore(inspectingContact).breakdown.webScore / 25) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Last URL: {calculateLeadScore(inspectingContact).breakdown.lastVisitedPage}
                </div>
              </div>

              {/* Factor 4: Intent Profile Tags */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Tag className="w-3.5 h-3.5 text-purple-500" />
                    <span>Buyer Persona &amp; Intent Tags (Enterprise, High-Intent)</span>
                  </span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                    +{calculateLeadScore(inspectingContact).breakdown.profileScore} / 20 pts
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(calculateLeadScore(inspectingContact).breakdown.profileScore / 20) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Simulate Live Activity Touchpoints */}
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
                  <span>+1 Inbound Call (+8 pts)</span>
                </button>
                <button
                  onClick={() => handleSimulateTouchpoint(inspectingContact.id, "email")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition-all"
                >
                  <Mail className="w-3 h-3" />
                  <span>+1 Email Reply (+6 pts)</span>
                </button>
                <button
                  onClick={() => handleSimulateTouchpoint(inspectingContact.id, "visit")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-[#FF9800] text-xs font-bold hover:bg-amber-200 transition-all"
                >
                  <Globe className="w-3 h-3" />
                  <span>+3 Pricing Visits (+7 pts)</span>
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

      {/* Contacts Table with AI Lead Score Column */}
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
                {/* Dedicated AI Lead Score Column as requested */}
                <th className="p-4 min-w-[210px]">
                  <div className="flex items-center gap-1.5">
                    <span>AI Lead Score</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      0–100%
                    </span>
                  </div>
                </th>
                <th className="p-4">Interaction History</th>
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

                    {/* 2. DEDICATED AI LEAD SCORE COLUMN */}
                    <td className="p-4">
                      <div
                        onClick={() => setInspectingContact(c)}
                        className="cursor-pointer group flex flex-col gap-1.5"
                        title="Click to view full AI interaction score breakdown"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-base font-black font-mono tracking-tight ${
                                tier === "Hot"
                                  ? "text-rose-600 dark:text-rose-400"
                                  : tier === "Warm"
                                  ? "text-[#FF9800]"
                                  : "text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {score}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">probability</span>
                          </div>

                          {/* Tier Badge */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              tier === "Hot"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                : tier === "Warm"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {tier === "Hot" ? (
                              <>
                                <Flame className="w-3 h-3 fill-current text-rose-500" />
                                <span>Hot</span>
                              </>
                            ) : tier === "Warm" ? (
                              <>
                                <Zap className="w-3 h-3 fill-current text-[#FF9800]" />
                                <span>Warm</span>
                              </>
                            ) : (
                              <>
                                <Snowflake className="w-3 h-3 text-slate-400" />
                                <span>Cold</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Visual 0-100% Probability Progress Bar */}
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              tier === "Hot"
                                ? "bg-gradient-to-r from-rose-500 to-red-600"
                                : tier === "Warm"
                                ? "bg-gradient-to-r from-amber-400 to-[#FF9800]"
                                : "bg-slate-400 dark:bg-slate-600"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 group-hover:text-[#3F51B5] dark:group-hover:text-indigo-400">
                          <span className="truncate max-w-[150px]">
                            {tier === "Hot" ? "High purchase intent" : tier === "Warm" ? "Engaged prospect" : "Drip nurture"}
                          </span>
                          <span className="underline font-bold flex items-center gap-0.5 shrink-0">
                            Signals <ChevronRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Interaction History & Engagement Metrics */}
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[#3F51B5] dark:text-indigo-300 text-[10px] font-bold flex items-center gap-1"
                          title="Logged Voice Calls"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{c.breakdown.callsCount} call(s)</span>
                        </span>

                        <span
                          className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                          title="Email Engagement"
                        >
                          <Mail className="w-2.5 h-2.5" />
                          <span>{c.breakdown.emailsOpened} open / {c.breakdown.emailsReplied} reply</span>
                        </span>

                        <span
                          className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[#FF9800] text-[10px] font-bold flex items-center gap-1"
                          title="Website Sessions & Telemetry"
                        >
                          <Globe className="w-2.5 h-2.5" />
                          <span>{c.breakdown.websiteVisits} visits</span>
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

                    {/* 5. Status */}
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
                          title="Run Gemini AI Intent Analysis & Deep Scoring"
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
