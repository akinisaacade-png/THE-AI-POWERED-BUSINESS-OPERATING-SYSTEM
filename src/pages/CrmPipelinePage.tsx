import React, { useState } from "react";
import { Deal } from "../types";
import {
  Kanban,
  Plus,
  TrendingUp,
  BrainCircuit,
  Filter,
  Sparkles,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { analyzeWithFlashLite } from "../services/api";

interface CrmPipelinePageProps {
  deals: Deal[];
  onAddDeal: (deal: any) => void;
  onUpdateDeal: (dealId: string, updates: Partial<Deal>) => void;
  onDeleteDeal: (dealId: string) => void;
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
}

const STAGES: { key: Deal["stage"]; label: string; color: string }[] = [
  { key: "new_lead", label: "New Leads", color: "border-blue-500 text-blue-500" },
  { key: "qualified", label: "Qualified", color: "border-indigo-500 text-indigo-500" },
  { key: "proposal", label: "Proposal Sent", color: "border-amber-500 text-amber-500" },
  { key: "negotiation", label: "Negotiation", color: "border-orange-500 text-orange-500" },
  { key: "won", label: "Closed Won", color: "border-emerald-500 text-emerald-500" },
  { key: "lost", label: "Closed Lost", color: "border-rose-500 text-rose-500" },
];

export const CrmPipelinePage: React.FC<CrmPipelinePageProps> = ({
  deals,
  onAddDeal,
  onUpdateDeal,
  onDeleteDeal,
  onOpenDataModal,
  darkMode = false,
}) => {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [dealAiTip, setDealAiTip] = useState<string | null>(null);

  const totalPipelineVal = deals.reduce((acc, d) => acc + d.value, 0);

  const handleStageMove = (dealId: string, nextStage: Deal["stage"]) => {
    onUpdateDeal(dealId, { stage: nextStage });
  };

  const handleRunAiDealAudit = async (deal: Deal) => {
    setSelectedDeal(deal);
    setAiAnalyzing(true);
    try {
      const res = await analyzeWithFlashLite(
        `Perform rapid win probability analysis and recommend 1 high-impact action to close this deal: "${deal.title}" ($${deal.value}), Contact: ${deal.contact_name}, Company: ${deal.company_name}, Stage: ${deal.stage}.`
      );
      setDealAiTip(res.analysis);
    } catch (e) {
      setDealAiTip("AI suggests booking a follow-up demo and sending a personalized ROI calculator.");
    } finally {
      setAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              CRM &amp; Opportunities Pipeline
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              6-Stage Kanban
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual revenue pipeline with real-time AI win probability, churn risk and next best action.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              // Find an active un-won deal to advance to the next stage or won
              const stageOrder: Deal["stage"][] = ["new_lead", "qualified", "proposal", "negotiation", "won"];
              const advanceableDeal = deals.find((d) => d.stage !== "won" && d.stage !== "lost") || deals[0];

              if (advanceableDeal) {
                const currentIdx = stageOrder.indexOf(advanceableDeal.stage);
                const nextStage = stageOrder[Math.min(currentIdx + 1, stageOrder.length - 1)];
                onUpdateDeal(advanceableDeal.id, {
                  stage: nextStage,
                  probability: nextStage === "won" ? 100 : Math.min((advanceableDeal.probability || 50) + 15, 95),
                });
              } else {
                // If all won, add a new deal to trigger stage transition
                const idSuffix = Date.now().toString().slice(-4);
                const newD: Deal = {
                  id: `deal-${idSuffix}`,
                  contact_id: `cnt-${idSuffix}`,
                  contact_name: "Sarah Jenkins",
                  company_name: "Nexus Cloud AI",
                  title: "Nexus Cloud - Enterprise SaaS License",
                  value: 38500,
                  stage: "negotiation",
                  close_date: new Date().toISOString().slice(0, 10),
                  probability: 85,
                  owner_name: "Alex Mercer",
                };
                onAddDeal(newD);
              }
            }}
            id="btn-simulate-deal-stage-move"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs transition-all shadow-xs"
            title="Simulate Real-Time Deal Stage Change / Close Won"
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            <span>Simulate Stage Move</span>
          </button>

          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            Total Pipeline: <span className="text-[#3F51B5] dark:text-indigo-400 font-mono">${(totalPipelineVal ?? 0).toLocaleString()}</span>
          </div>
          <button
            id="btn-crm-add-opportunity"
            onClick={() => onOpenDataModal("crm-pipeline")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* AI Deal Intelligence Drawer / Modal when active */}
      {selectedDeal && (
        <div
          className={`p-4 rounded-2xl border transition-all ${
            darkMode ? "bg-indigo-950/40 border-indigo-800" : "bg-indigo-50 border-indigo-200"
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 dark:border-indigo-800/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF9800]" />
              <span className="text-xs font-black text-[#3F51B5] dark:text-indigo-300">
                Gemini Flash-Lite Deal Strategy: {selectedDeal.title}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedDeal(null);
                setDealAiTip(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Close
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-700 dark:text-slate-200">
            {aiAnalyzing ? (
              <div className="flex items-center gap-2 text-[#3F51B5] dark:text-indigo-300 font-bold animate-pulse py-2">
                <BrainCircuit className="w-4 h-4 animate-spin" />
                <span>Analyzing contact behavior, stage velocity and pricing sensitivity...</span>
              </div>
            ) : (
              <p className="whitespace-pre-line leading-relaxed font-medium">{dealAiTip}</p>
            )}
          </div>
        </div>
      )}

      {/* 6-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto min-h-[600px]">
        {STAGES.map((col) => {
          const colDeals = deals.filter((d) => d.stage === col.key);
          const colTotal = colDeals.reduce((sum, d) => sum + (d.value ?? 0), 0);

          return (
            <div
              key={col.key}
              className={`p-3 rounded-2xl border flex flex-col justify-between ${
                darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200/80"
              }`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {col.label}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      ${(colTotal ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {colDeals.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="space-y-2.5">
                  {colDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className={`p-3 rounded-2xl border shadow-sm transition-all hover:shadow-md ${
                        darkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-slate-200/90 text-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-extrabold text-xs leading-snug">{deal.title}</h4>
                        <button
                          onClick={() => onDeleteDeal(deal.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Delete opportunity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {deal.company_name} ({deal.contact_name})
                      </div>

                      <div className="mt-2 flex items-baseline justify-between border-t border-slate-100 dark:border-slate-700/60 pt-2">
                        <span className="text-sm font-black text-[#3F51B5] dark:text-indigo-400">
                          ${(deal.value ?? 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {deal.probability}% Win
                        </span>
                      </div>

                      {/* AI Next Action Chip */}
                      {deal.ai_insights?.next_best_action && (
                        <div className="mt-2 p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-[10px] text-amber-800 dark:text-amber-300 font-semibold border border-amber-200/60 dark:border-amber-900/60">
                          ⚡ {deal.ai_insights.next_best_action}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="mt-3 flex items-center justify-between gap-1 pt-1">
                        <button
                          onClick={() => handleRunAiDealAudit(deal)}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#3F51B5] dark:text-indigo-400 hover:text-[#FF9800]"
                          title="Get Instant Gemini Coaching"
                        >
                          <BrainCircuit className="w-3 h-3" />
                          <span>AI Strategy</span>
                        </button>

                        <select
                          value={deal.stage}
                          onChange={(e) => handleStageMove(deal.id, e.target.value as any)}
                          className={`text-[10px] font-bold p-1 rounded border focus:outline-none ${
                            darkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              → {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {colDeals.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-[11px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      No deals
                    </div>
                  )}
                </div>
              </div>

              {/* Column Add Quick Trigger */}
              <button
                onClick={() => onOpenDataModal("crm-pipeline")}
                className="mt-3 w-full py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-500 hover:text-[#3F51B5] hover:border-[#3F51B5] transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Deal</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
