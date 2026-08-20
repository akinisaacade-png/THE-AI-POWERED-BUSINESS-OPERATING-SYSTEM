import React, { useState } from "react";
import {
  Mail,
  Plus,
  Send,
  Sparkles,
  CheckCircle2,
  Trash2,
  Eye,
  TrendingUp,
  Layers,
  LayoutTemplate,
  BarChart3,
} from "lucide-react";
import { analyzeWithFlashLite } from "../services/api";
import { EmailTemplateBuilder } from "../components/EmailTemplateBuilder";

interface EmailMarketingPageProps {
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
}

export const EmailMarketingPage: React.FC<EmailMarketingPageProps> = ({
  onOpenDataModal,
  darkMode = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"campaigns" | "builder">("campaigns");
  const [subject, setSubject] = useState("");
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const campaigns = [
    {
      id: "em-1",
      name: "Q3 Enterprise Revenue OS Architecture Announcement",
      subject: "⚡ Autonomous revenue operations for high-ticket sales teams",
      sent_count: 4820,
      open_rate: 42.4,
      click_rate: 14.8,
      status: "Sent",
      date: "2026-08-14",
    },
    {
      id: "em-2",
      name: "Missed Call Auto-Recovery Case Study Drip",
      subject: "How Crestwood Logistics recovered $48,000 in 14 days",
      sent_count: 1240,
      open_rate: 56.1,
      click_rate: 22.4,
      status: "Active Drip",
      date: "2026-08-16",
    },
  ];

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    try {
      const res = await analyzeWithFlashLite(
        `Draft a high-converting B2B cold/warm nurture email with the topic: "${subject || "Autonomous missed-call SMS text-back and CRM pipeline acceleration"}". Include a crisp subject line, 3 value bullet points, and a calendar booking CTA.`
      );
      setGeneratedDraft(res.analysis);
    } catch (e) {
      setGeneratedDraft("Subject: Eliminating lead drop-off for your sales team\n\nHi {{contact.first_name}},\n\nWhen a high-value prospect calls your company, response speed determines close rates.\n\nLock in a 15-minute architecture walkthrough here: {{booking_link}}.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Email Marketing &amp; Dynamic Broadcasts
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              99.2% Inbox Deliverability
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual drag-and-drop builder, AI subject line generator, and automated behavioural sequences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-view switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab("campaigns")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === "campaigns"
                  ? "bg-[#3F51B5] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Broadcasts</span>
            </button>
            <button
              onClick={() => setActiveSubTab("builder")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === "builder"
                  ? "bg-[#3F51B5] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Visual Builder</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (activeSubTab === "campaigns") {
                onOpenDataModal("emails");
              } else {
                setActiveSubTab("builder");
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Broadcast</span>
          </button>
        </div>
      </div>

      {activeSubTab === "builder" ? (
        /* Visual Drag & Drop Builder */
        <EmailTemplateBuilder
          darkMode={darkMode}
          onImportAIText={generatedDraft}
        />
      ) : (
        /* Campaigns & AI Copywriter View */
        <>
          {/* Quick Action banner to jump into builder */}
          <div
            onClick={() => setActiveSubTab("builder")}
            className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-transparent border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer hover:border-indigo-500/40 transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3F51B5] text-white flex items-center justify-center shadow-sm">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Visual Drag-and-Drop Template Canvas
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Compose responsive multi-column layouts, buttons, testimonials, and brand banners with live mobile preview.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-[#3F51B5] text-white text-xs font-black shadow-sm shrink-0">
              Launch Visual Builder →
            </button>
          </div>

          {/* Campaigns Table */}
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
                    <th className="p-4">Campaign Name &amp; Subject</th>
                    <th className="p-4">Recipients</th>
                    <th className="p-4">Open Rate</th>
                    <th className="p-4">Click Rate</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Sent Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {campaigns.map((c) => (
                    <tr
                      key={c.id}
                      className={`transition-colors ${
                        darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{c.subject}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {(c.sent_count ?? 0).toLocaleString()}
                      </td>
                      <td className="p-4 text-emerald-600 font-bold font-mono">{c.open_rate}%</td>
                      <td className="p-4 text-[#3F51B5] dark:text-indigo-400 font-bold font-mono">{c.click_rate}%</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Email Copywriter */}
          <div
            className={`p-6 rounded-3xl border ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#FF9800]" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Flash-Lite Email Copy &amp; Sequence Generator
              </h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Target audience or email objective (e.g. 3-day post-demo follow up for Enterprise CTOs)..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
              />
              <button
                onClick={handleGenerateEmail}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Drafting..." : "Generate Email Sequence"}</span>
              </button>
            </div>

            {generatedDraft && (
              <div className="mt-4 space-y-3">
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs whitespace-pre-line text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {generatedDraft}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveSubTab("builder")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3F51B5] text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    <LayoutTemplate className="w-3.5 h-3.5" />
                    <span>Open in Visual Email Builder →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

