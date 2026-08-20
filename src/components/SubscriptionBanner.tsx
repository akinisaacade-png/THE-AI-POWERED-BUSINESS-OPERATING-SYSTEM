import React from "react";
import { AlertTriangle, Sparkles, Clock, ArrowRight, X, ShieldAlert } from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";

interface SubscriptionBannerProps {
  onNavigateToBilling: () => void;
  darkMode?: boolean;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  onNavigateToBilling,
  darkMode = false,
}) => {
  const {
    isSubscribed,
    isTrialActive,
    isTrialExpired,
    isExpiringSoon,
    trialDaysRemaining,
    renewalDateFormatted,
    bannerDismissed,
    dismissBanner,
  } = useSubscription();

  // If dismissed or trial has more than 3 days and user is not expired, do not show
  if (bannerDismissed) return null;
  if (!isExpiringSoon && !isTrialExpired) return null;

  return (
    <aside
      aria-label="Subscription status notification banner"
      className={`w-full px-4 py-2.5 sm:px-6 transition-all border-b text-xs flex flex-wrap items-center justify-between gap-3 ${
        isTrialExpired
          ? darkMode
            ? "bg-rose-950/80 border-rose-800/80 text-rose-200"
            : "bg-rose-50 border-rose-200 text-rose-900"
          : darkMode
          ? "bg-amber-950/70 border-amber-800/70 text-amber-200"
          : "bg-amber-50 border-amber-200 text-amber-900"
      }`}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
            isTrialExpired
              ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
              : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
          }`}
        >
          {isTrialExpired ? (
            <ShieldAlert className="w-3.5 h-3.5" />
          ) : (
            <Clock className="w-3.5 h-3.5 animate-pulse" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 leading-snug">
          <span className="font-extrabold uppercase tracking-wide text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
            {isTrialExpired ? "Trial Expired" : "Notice"}
          </span>

          <span className="font-semibold">
            {isTrialExpired
              ? "Your 7-day free trial has expired. Upgrade your account to maintain unlimited AI automation access."
              : `Your 7-day trial is expiring in ${trialDaysRemaining} day${
                  trialDaysRemaining === 1 ? "" : "s"
                } (${renewalDateFormatted}). Upgrade to Monthly or Yearly to avoid interruption.`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          id="btn-banner-upgrade-now"
          onClick={onNavigateToBilling}
          className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition-all flex items-center gap-1.5 shadow-xs active:scale-95 ${
            isTrialExpired
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "bg-[#3F51B5] hover:bg-indigo-700 text-white"
          }`}
        >
          <span>{isTrialExpired ? "Renew Subscription" : "Manage Subscription"}</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <button
          id="btn-banner-dismiss"
          onClick={dismissBanner}
          title="Dismiss banner"
          className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-current transition-colors opacity-70 hover:opacity-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
