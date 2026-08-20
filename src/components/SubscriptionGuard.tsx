import React from "react";
import { Lock, Sparkles, ArrowRight, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  moduleName?: string;
  description?: string;
  onNavigateToBilling?: () => void;
  darkMode?: boolean;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  moduleName = "Premium AI Module",
  description = "This advanced automation and AI capability requires an active Business Operating System subscription or an active trial.",
  onNavigateToBilling,
  darkMode = false,
}) => {
  const { isSubscribed, isTrialExpired, trialDaysRemaining, simulateTrialStatus } = useSubscription();

  // If user has an active subscription or valid trial, grant full access
  if (isSubscribed) {
    return <>{children}</>;
  }

  // Otherwise, display the locked state redirect view
  return (
    <div className="min-h-[520px] flex items-center justify-center p-4 sm:p-8">
      <div
        className={`max-w-xl w-full p-8 sm:p-10 rounded-3xl border shadow-xl text-center transition-all ${
          darkMode
            ? "bg-slate-900/90 border-slate-800 text-white shadow-black/40"
            : "bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/60 backdrop-blur-md"
        }`}
      >
        {/* Animated Lock Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Lock className="w-8 h-8 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Subscription Required</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Unlock {moduleName}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-md mx-auto">
          {isTrialExpired
            ? `Your 7-day free trial has expired. Subscribe to our Pro Monthly ($29.99/mo) or VIP Yearly ($299.99/yr) plan to continue using ${moduleName} and autonomous workflows.`
            : description}
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <div
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
              darkMode ? "bg-slate-800/50 border-slate-700/60 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <Zap className="w-4 h-4 text-[#3F51B5] shrink-0" />
            <span>Autonomous AI Pipeline Automation</span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
              darkMode ? "bg-slate-800/50 border-slate-700/60 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Gemini Flash & Thinking Reasoning</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-guard-redirect-billing"
            onClick={onNavigateToBilling}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Upgrade Subscription via PayPal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-guard-restore-trial-demo"
            onClick={() => simulateTrialStatus("trial_active")}
            className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl border text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
              darkMode
                ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Active Trial (Demo)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// High-Order Component (HOC) Pattern export
export function withSubscriptionGuard<P extends object>(
  Component: React.ComponentType<P>,
  moduleName: string,
  onNavigateToBilling?: () => void
) {
  return function GuardedComponent(props: P) {
    return (
      <SubscriptionGuard moduleName={moduleName} onNavigateToBilling={onNavigateToBilling}>
        <Component {...props} />
      </SubscriptionGuard>
    );
  };
}
