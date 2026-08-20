import React from "react";
import { Campaign } from "../types";
import { Megaphone, Plus, TrendingUp, DollarSign, Target, Sparkles, Trash2 } from "lucide-react";

interface AdManagerPageProps {
  campaigns: Campaign[];
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
}

export const AdManagerPage: React.FC<AdManagerPageProps> = ({
  campaigns,
  onOpenDataModal,
  darkMode = false,
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Ad Campaign Manager &amp; ROAS Telemetry
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              5.4x Blended ROAS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Google Ads, Meta Ads &amp; LinkedIn Ads real-time attribution, CPA tracking, and creative optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDataModal("ad-manager")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Ad Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((c) => {
          const spend = c.spent ?? (c as any).spend ?? 0;
          const clicks = c.metrics?.clicks ?? (c as any).clicks ?? 0;
          const roas = c.metrics?.roas ?? (c as any).roas ?? 4.2;
          const cpa = c.metrics?.cpa ?? (c as any).cpa ?? 12.5;
          const conversions = c.metrics?.conversions ?? (c as any).conversions ?? (c as any).leads ?? 0;
          const channel = c.channel || (c as any).platform || "Omnichannel Ad";
          const name = c.name || (c as any).campaign_name || "Campaign";

          return (
            <div
              key={c.id}
              className={`p-5 rounded-3xl border transition-all ${
                darkMode ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-[#3F51B5] dark:text-indigo-300 uppercase">
                    {channel}
                  </span>
                  <h4 className="font-extrabold text-sm mt-2 text-slate-900 dark:text-white">{name}</h4>
                </div>

                <span className="text-xs font-black text-emerald-600 font-mono">
                  {roas}x ROAS
                </span>
              </div>

              {/* Metrics Bar */}
              <div className="mt-4 grid grid-cols-4 gap-2 py-3 border-y border-slate-100 dark:border-slate-700/60 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Spend</div>
                  <div className="font-black text-slate-800 dark:text-white mt-0.5 font-mono">
                    ${spend.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Clicks</div>
                  <div className="font-black text-slate-800 dark:text-white mt-0.5 font-mono">
                    {clicks.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CPA</div>
                  <div className="font-black text-emerald-600 mt-0.5 font-mono">${cpa}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Conversions</div>
                  <div className="font-black text-[#3F51B5] dark:text-indigo-400 mt-0.5 font-mono">
                    {conversions.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9800] flex-shrink-0" />
                <span>AI Recommendation: Scale budget by +25% on top-performing search queries.</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
