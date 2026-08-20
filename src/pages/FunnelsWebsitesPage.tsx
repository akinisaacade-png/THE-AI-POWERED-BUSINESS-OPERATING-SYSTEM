import React, { useState } from "react";
import { Funnel } from "../types";
import {
  Globe,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  Zap,
  CheckCircle2,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { analyzeWithFlashLite } from "../services/api";

interface FunnelsWebsitesPageProps {
  funnels: Funnel[];
  onAddFunnel: (funnel: any) => void;
  onDeleteFunnel: (funnelId: string) => void;
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
}

export const FunnelsWebsitesPage: React.FC<FunnelsWebsitesPageProps> = ({
  funnels,
  onAddFunnel,
  onDeleteFunnel,
  onOpenDataModal,
  darkMode = false,
}) => {
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel>(funnels[0]);
  const [headlinePrompt, setHeadlinePrompt] = useState("");
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCopy = async () => {
    setIsGenerating(true);
    try {
      const res = await analyzeWithFlashLite(
        `Generate 3 high-converting landing page hero headlines and subheadlines for this offer: "${headlinePrompt || selectedFunnel.name}". Focus on high-converting B2B revenue automation.`
      );
      setGeneratedCopy(res.analysis);
    } catch (e) {
      setGeneratedCopy("⚡ Capture 100% of Missed Revenue with Autonomous AI Operations.\nStop losing high-ticket inbound leads to phone tag.");
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
              Funnels &amp; High-Converting Websites
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              Multi-Step Conversion Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Drag-and-drop funnel architecture, 1-click upsells, and A/B split-tested copy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDataModal("funnels")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Funnel</span>
          </button>
        </div>
      </div>

      {/* Active Funnel Architecture Map */}
      <div
        className={`p-6 rounded-3xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Funnel Flow</div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              {selectedFunnel.name}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Avg Conversion: {selectedFunnel.conversion_rate ?? 0}%
            </span>
            <span className="text-xs font-bold text-[#3F51B5] dark:text-indigo-400 font-mono">
              Revenue: ${(selectedFunnel.revenue ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Funnel Steps Visual Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {(selectedFunnel.steps || []).map((step, idx) => (
            <div
              key={step.id || idx}
              className={`p-4 rounded-2xl border relative flex flex-col justify-between ${
                darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                  <span>STEP 0{idx + 1}</span>
                  <span className="text-emerald-600 font-mono font-black">{step.conversion_rate ?? 0}%</span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{step.name}</h4>
                <div className="text-[11px] text-slate-400 font-mono mt-1">{step.url}</div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1 font-bold text-[#3F51B5] dark:text-indigo-300">
                  <TrendingUp className="w-3 h-3" /> {(step.visitors ?? 0).toLocaleString()} Visits
                </span>
                <span className="font-bold text-emerald-600">{step.conversions ?? 0} Opt-Ins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Funnel Copywriting Studio */}
      <div
        className={`p-6 rounded-3xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#FF9800]" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Gemini Landing Page Copywriting Engine
          </h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={headlinePrompt}
            onChange={(e) => setHeadlinePrompt(e.target.value)}
            placeholder="Enter product offer or ICP angle (e.g. Enterprise B2B SaaS revenue automation)..."
            className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
          />
          <button
            onClick={handleGenerateCopy}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isGenerating ? "Drafting Copy..." : "Generate Headlines"}</span>
          </button>
        </div>

        {generatedCopy && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs whitespace-pre-line text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {generatedCopy}
          </div>
        )}
      </div>
    </div>
  );
};
