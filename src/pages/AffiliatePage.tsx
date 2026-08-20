import React from "react";
import { Share2, Plus, Users, DollarSign, ArrowUpRight, TrendingUp } from "lucide-react";

interface AffiliatePageProps {
  darkMode?: boolean;
}

export const AffiliatePage: React.FC<AffiliatePageProps> = ({
  darkMode = false,
}) => {
  const affiliates = [
    {
      id: "aff-1",
      name: "Apex Growth Partners",
      email: "partners@apexgrowth.com",
      tier: "Enterprise (30%)",
      referrals: 28,
      conversions: 14,
      commission_earned: 14200,
      payout_status: "Paid",
    },
    {
      id: "aff-2",
      name: "RevTech Reviews Agency",
      email: "collabs@revtech.io",
      tier: "Standard (20%)",
      referrals: 45,
      conversions: 19,
      commission_earned: 9500,
      payout_status: "Pending",
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Affiliate Management &amp; Referral Engine
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              Automated Payouts
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track affiliate links, commission tiers, cookie windows, and Stripe mass payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95">
            <Plus className="w-4 h-4" />
            <span>Add Affiliate Partner</span>
          </button>
        </div>
      </div>

      {/* Affiliates Table */}
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
                <th className="p-4">Partner Name &amp; Email</th>
                <th className="p-4">Commission Tier</th>
                <th className="p-4">Referrals &amp; Won</th>
                <th className="p-4">Commissions Earned</th>
                <th className="p-4">Payout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {affiliates.map((a) => (
                <tr
                  key={a.id}
                  className={`transition-colors ${
                    darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{a.name}</div>
                    <div className="text-[11px] text-slate-400">{a.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-[#3F51B5] dark:text-indigo-400">{a.tier}</span>
                  </td>
                  <td className="p-4 font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{a.referrals} clicks</span>
                    <span className="text-emerald-600 font-bold ml-2">({a.conversions} closed)</span>
                  </td>
                  <td className="p-4 font-mono font-black text-slate-900 dark:text-white">
                    ${(a.commission_earned ?? 0).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        a.payout_status === "Paid"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {a.payout_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
