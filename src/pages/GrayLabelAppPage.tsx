import React, { useState } from "react";
import { Smartphone, Plus, CheckCircle2, ShieldCheck, Sparkles, Download, Layers } from "lucide-react";

interface GrayLabelAppPageProps {
  darkMode?: boolean;
}

export const GrayLabelAppPage: React.FC<GrayLabelAppPageProps> = ({
  darkMode = false,
}) => {
  const [appName, setAppName] = useState("Acme Revenue OS");
  const [brandColor, setBrandColor] = useState("#3F51B5");
  const [accentColor, setAccentColor] = useState("#FF9800");
  const [domain, setDomain] = useState("app.acmerevenue.com");

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Gray-Labelled Custom Mobile &amp; Desktop App
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF9800] text-indigo-950">
              Agency Reseller Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deploy custom-branded iOS &amp; Android apps, custom domains, and custom app store listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3F51B5] text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md">
            <Download className="w-4 h-4" />
            <span>Export iOS/Android PWA Build</span>
          </button>
        </div>
      </div>

      {/* 2-Column Customization & Live Phone Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Branding Controls */}
        <div
          className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Brand Identity &amp; Custom Domain
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Custom Application Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-bold ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Custom White-Label Domain (CNAME)
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-mono ${
                  darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Primary Brand Hex
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <span className="font-mono font-bold text-xs">{brandColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Accent Color Hex
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <span className="font-mono font-bold text-xs">{accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Phone Mockup Frame */}
        <div
          className={`p-6 rounded-3xl border flex items-center justify-center ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="w-64 h-[440px] rounded-[36px] border-4 border-slate-800 dark:border-slate-700 bg-slate-950 p-3 shadow-2xl flex flex-col text-white relative">
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-3"></div>

            {/* Mobile App Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-black truncate" style={{ color: brandColor }}>
                {appName}
              </span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
            </div>

            {/* Simulated Mobile Feed */}
            <div className="flex-1 space-y-2 mt-3 overflow-hidden text-[10px]">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold">Missed Call Text-Back</div>
                <div className="text-slate-400 text-[9px] mt-0.5">8s Auto-Recovery Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold">Pipeline Deals: $117.4k</div>
                <div className="text-emerald-400 text-[9px] mt-0.5">85% Win Probability</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold">Next Booking: 2:00 PM</div>
                <div className="text-[#FF9800] text-[9px] mt-0.5">Marcus Thorne (Discovery)</div>
              </div>
            </div>

            <div className="pt-2 text-center text-[9px] text-slate-500 font-mono">
              {domain}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
