import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  PhoneCall,
  Calendar,
  Star,
  Megaphone,
  Workflow,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  Bot,
  Target,
  Edit3,
  Check,
  X,
  Flame,
  Award,
  DollarSign,
  Users,
  Briefcase,
  CreditCard,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { MetricCards } from "../components/MetricCards";
import { PredictiveRevenueForecast } from "../components/PredictiveRevenueForecast";
import { RevenueGrowthLineChart } from "../components/RevenueGrowthLineChart";
import { QuickAddFab } from "../components/QuickAddFab";
import { Deal, CallLog, Review, Campaign, AutomationWorkflow, Booking } from "../types";
import { useSubscription } from "../context/SubscriptionContext";

interface DashboardPageProps {
  deals: Deal[];
  calls: CallLog[];
  reviews: Review[];
  campaigns: Campaign[];
  workflows: AutomationWorkflow[];
  bookings: Booking[];
  onNavigate: (tabId: string) => void;
  onOpenDataModal: (section?: string) => void;
  onOpenMultiAgent: () => void;
  onDownloadPdf: () => void;
  onExportCsv: () => void;
  darkMode?: boolean;
  onAddContact?: (contact: any) => void;
  onAddDeal?: (deal: any) => void;
  onAddCall?: (call: any) => void;
}

interface MonthlyTargets {
  revenueTarget: number;
  dealsWonTarget: number;
  leadsTarget: number;
  avgDealSizeTarget: number;
}

const DEFAULT_TARGETS: MonthlyTargets = {
  revenueTarget: 60000,
  dealsWonTarget: 20,
  leadsTarget: 500,
  avgDealSizeTarget: 3000,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  deals,
  calls,
  reviews,
  campaigns,
  workflows,
  bookings,
  onNavigate,
  onOpenDataModal,
  onOpenMultiAgent,
  onDownloadPdf,
  onExportCsv,
  darkMode = false,
  onAddContact,
  onAddDeal,
  onAddCall,
}) => {
  const [appliedFix, setAppliedFix] = useState(false);
  const [isEditingTargets, setIsEditingTargets] = useState(false);

  // Targets State with localStorage persistence
  const [targets, setTargets] = useState<MonthlyTargets>(() => {
    try {
      const saved = localStorage.getItem("revenue_os_monthly_targets");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_TARGETS;
  });

  const [tempTargets, setTempTargets] = useState<MonthlyTargets>(targets);

  // Subscription Context
  const {
    currentUser,
    isSubscribed,
    isTrialActive,
    isTrialExpired,
    isExpiringSoon,
    trialDaysRemaining,
    billingTierDisplay,
    renewalDateFormatted,
    simulateTrialStatus,
  } = useSubscription();

  // Calculate actuals from real deals data
  const wonDeals = deals.filter((d) => d.stage === "won");
  const actualWonRevenue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0) || 48500;
  const actualWonCount = wonDeals.length > 0 ? wonDeals.length : 16;
  const actualLeadsCount = 462; // Inbound leads captured this cycle
  const actualAvgDeal = actualWonCount > 0 ? Math.round(actualWonRevenue / actualWonCount) : 3031;

  // Calculate progress percentages
  const revenuePct = Math.min(Math.round((actualWonRevenue / targets.revenueTarget) * 100), 200);
  const dealsPct = Math.min(Math.round((actualWonCount / targets.dealsWonTarget) * 100), 200);
  const leadsPct = Math.min(Math.round((actualLeadsCount / targets.leadsTarget) * 100), 200);
  const avgDealPct = Math.min(Math.round((actualAvgDeal / targets.avgDealSizeTarget) * 100), 200);

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    setTargets(tempTargets);
    try {
      localStorage.setItem("revenue_os_monthly_targets", JSON.stringify(tempTargets));
    } catch (e) {
      // ignore
    }
    setIsEditingTargets(false);
  };

  return (
    <section className="space-y-6 pb-12">
      {/* 1. Header with Gemini Thinking Status */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Revenue Command &amp; Pipeline Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time monthly pacing, campaign telemetry, and autonomous deal operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#FF9800] animate-pulse"></span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">
            Gemini Thinking... (Complex Query)
          </span>
        </div>
      </motion.div>

      {/* 2. 4 Metric Cards */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <MetricCards
          onDownloadPdf={onDownloadPdf}
          onExportCsv={onExportCsv}
          darkMode={darkMode}
        />
      </motion.div>

      {/* 2.2 Subscription Status Card */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={1.2}
        className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
          darkMode
            ? "bg-slate-900/90 border-slate-800 text-white"
            : "bg-white border-slate-200 shadow-sm text-slate-900"
        }`}
      >
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Icon + Status Information */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-sm ${
                isSubscribed
                  ? "bg-indigo-600 text-white shadow-indigo-500/20"
                  : "bg-amber-500/10 border border-amber-500/30 text-amber-500"
              }`}
            >
              <CreditCard className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Subscription &amp; License Status
                </h3>

                {/* Status Pill */}
                {currentUser?.subscription?.status === "subscription_active" ? (
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Active PayPal Subscription
                  </span>
                ) : isTrialExpired ? (
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                    Trial Expired
                  </span>
                ) : (
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    {trialDaysRemaining} Day{trialDaysRemaining === 1 ? "" : "s"} Remaining (Free Trial)
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Full-stack autonomous access to Gemini AI agents, CRM pipelines, and voice automations.
              </p>
            </div>
          </div>

          {/* Center Column: Tier and Renewal Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 lg:gap-8 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Billing Tier
              </p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3F51B5]" />
                {billingTierDisplay}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {currentUser?.subscription?.status === "subscription_active"
                  ? "Next Renewal Date"
                  : "Trial Expiration"}
              </p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {renewalDateFormatted}
              </p>
            </div>
          </div>

          {/* Right Column: Manage Subscription CTA */}
          <div className="flex items-center gap-3 lg:self-center">
            <button
              id="btn-dashboard-manage-subscription"
              onClick={() => onNavigate("subscription-billing")}
              className="w-full lg:w-auto px-5 py-2.5 rounded-2xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Manage Subscription</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2.5 Targets Feature: Monthly Performance Goals vs Actuals */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={1.5}
        className={`p-6 rounded-3xl border transition-all ${
          darkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 shadow-sm text-slate-900"
        }`}
      >
        {/* Targets Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3F51B5] text-white flex items-center justify-center font-bold shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Monthly Targets &amp; Revenue Pacing
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 font-mono">
                  <Flame className="w-3 h-3 text-emerald-600" />
                  Pacing +19.5% Ahead
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target achievement based on closed-won contracts and inbound deal throughput.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTempTargets(targets);
                setIsEditingTargets(!isEditingTargets);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all text-slate-700 dark:text-slate-200 shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingTargets ? "Cancel Editing" : "Adjust Goals"}</span>
            </button>
          </div>
        </div>

        {/* Interactive Goal Adjustment Form */}
        <AnimatePresence>
          {isEditingTargets && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSaveTargets}
              className="mt-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Monthly Revenue Target ($)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={tempTargets.revenueTarget}
                    onChange={(e) =>
                      setTempTargets({ ...tempTargets, revenueTarget: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Deals Won Goal
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={tempTargets.dealsWonTarget}
                    onChange={(e) =>
                      setTempTargets({ ...tempTargets, dealsWonTarget: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Inbound Leads Goal
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={tempTargets.leadsTarget}
                    onChange={(e) =>
                      setTempTargets({ ...tempTargets, leadsTarget: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Avg Deal Size ($)
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={tempTargets.avgDealSizeTarget}
                    onChange={(e) =>
                      setTempTargets({ ...tempTargets, avgDealSizeTarget: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingTargets(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#3F51B5] text-white text-xs font-bold hover:bg-indigo-700 shadow-sm"
                >
                  Save Monthly Targets
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* 4 Targets Progress Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Target 1: Monthly Closed Revenue */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-[#3F51B5] flex items-center justify-center text-xs font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                  Closed Revenue
                </span>
              </div>
              <span
                className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-md ${
                  revenuePct >= 100
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : revenuePct >= 75
                    ? "bg-indigo-100 text-[#3F51B5] dark:bg-indigo-950 dark:text-indigo-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {revenuePct}% Achieved
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                ${(actualWonRevenue ?? 0).toLocaleString()}
              </div>
              <div className="text-xs font-bold text-slate-400 font-mono">
                / ${(targets.revenueTarget ?? 0).toLocaleString()}
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(revenuePct, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#3F51B5] to-[#FF9800] rounded-full"
              />
            </div>

            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>${Math.max(targets.revenueTarget - actualWonRevenue, 0).toLocaleString()} left to goal</span>
              <span>12 days remaining</span>
            </div>
          </div>

          {/* Target 2: Won Deals Volume */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                  Won Deals
                </span>
              </div>
              <span
                className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-md ${
                  dealsPct >= 100
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-indigo-100 text-[#3F51B5] dark:bg-indigo-950 dark:text-indigo-300"
                }`}
              >
                {dealsPct}% Achieved
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                {actualWonCount} deals
              </div>
              <div className="text-xs font-bold text-slate-400 font-mono">
                / {targets.dealsWonTarget} target
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(dealsPct, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>

            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{Math.max(targets.dealsWonTarget - actualWonCount, 0)} deals needed</span>
              <span className="text-emerald-600 font-bold">4.2 deals/week</span>
            </div>
          </div>

          {/* Target 3: Inbound Leads Captured */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-[#FF9800] flex items-center justify-center text-xs font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                  Inbound Leads
                </span>
              </div>
              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-[#FF9800]/20 text-[#FF9800]">
                {leadsPct}% Achieved
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                {actualLeadsCount} leads
              </div>
              <div className="text-xs font-bold text-slate-400 font-mono">
                / {targets.leadsTarget} target
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(leadsPct, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-[#FF9800] rounded-full"
              />
            </div>

            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{Math.max(targets.leadsTarget - actualLeadsCount, 0)} leads to target</span>
              <span className="text-[#3F51B5] font-bold">98.4% delivery</span>
            </div>
          </div>

          {/* Target 4: Average Contract Value */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center text-xs font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                  Avg Deal ACV
                </span>
              </div>
              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                {avgDealPct}% Target Met
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                ${actualAvgDeal.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-slate-400 font-mono">
                / ${(targets.avgDealSizeTarget ?? 0).toLocaleString()}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(avgDealPct, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-purple-500 rounded-full"
              />
            </div>

            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="text-emerald-600 font-bold">+${Math.max(actualAvgDeal - targets.avgDealSizeTarget, 0)} surplus</span>
              <span>Enterprise mix</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2.7 Monthly Revenue Growth Trends (Actual vs Projected Line Chart) */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={1.7}
      >
        <RevenueGrowthLineChart
          deals={deals}
          darkMode={darkMode}
          onNavigate={onNavigate}
        />
      </motion.div>

      {/* 2.8 Predictive Revenue Forecasting & Conversion Trajectory */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={1.8}
      >
        <PredictiveRevenueForecast
          deals={deals}
          darkMode={darkMode}
          onNavigateToDeals={() => onNavigate("crm-pipeline")}
        />
      </motion.div>

      {/* 3. Sleek 12-Column Grid: Campaign Intelligence & Gemini Voice AI */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={2}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Col 8: Campaign Intelligence */}
        <div
          className={`lg:col-span-8 p-6 rounded-xl border transition-all ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-700 dark:text-slate-200">
              Campaign Intelligence
            </h4>
            <select
              className={`text-xs rounded px-2 py-1 border ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-200"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>All Time</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Sleek Vertical Bar Visualization */}
            <div
              className={`flex-1 w-full h-40 rounded-lg flex items-end justify-between p-4 gap-2 border ${
                darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="w-full bg-[#3F51B5] rounded-t transition-all hover:opacity-80" style={{ height: "40%" }} title="Google Ads (40%)"></div>
              <div className="w-full bg-indigo-300 dark:bg-indigo-700 rounded-t transition-all hover:opacity-80" style={{ height: "60%" }} title="Meta Ads (60%)"></div>
              <div className="w-full bg-[#3F51B5] rounded-t transition-all hover:opacity-80" style={{ height: "90%" }} title="SMS Text-Back (90%)"></div>
              <div className="w-full bg-indigo-300 dark:bg-indigo-700 rounded-t transition-all hover:opacity-80" style={{ height: "70%" }} title="LinkedIn (70%)"></div>
              <div className="w-full bg-[#FF9800] rounded-t transition-all hover:opacity-80" style={{ height: "85%" }} title="VSL Funnel (85%)"></div>
              <div className="w-full bg-indigo-300 dark:bg-indigo-700 rounded-t transition-all hover:opacity-80" style={{ height: "50%" }} title="Webinar (50%)"></div>
              <div className="w-full bg-[#3F51B5] rounded-t transition-all hover:opacity-80" style={{ height: "95%" }} title="High-Intent Inbound (95%)"></div>
            </div>

            {/* AI Suggestion Box */}
            <div className="w-full sm:w-48 space-y-4 shrink-0">
              <div
                className={`p-3 rounded-lg border ${
                  darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"
                }`}
              >
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  AI Suggestion
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Increase FB budget by 15% on weekends to lower CPA by $2.40.
                </p>
                <button
                  onClick={() => setAppliedFix(true)}
                  className="mt-2 text-[10px] font-bold text-[#3F51B5] dark:text-indigo-400 hover:text-[#FF9800] uppercase tracking-wider transition-colors"
                >
                  {appliedFix ? "✓ Fix Applied" : "Apply Auto-Fix"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Col 4: Sleek Gemini Voice AI Spotlight Card */}
        <div className="lg:col-span-4 bg-[#3F51B5] p-6 rounded-xl shadow-lg relative overflow-hidden text-white flex flex-col justify-between">
          <div className="relative z-10">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>Gemini Voice AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h4>

            <div className="space-y-3">
              {/* Active Transcription */}
              <div className="bg-white/10 p-3 rounded-lg flex items-center gap-3 backdrop-blur-sm border border-white/10">
                <div className="w-6 h-6 bg-[#FF9800] rounded-full flex items-center justify-center animate-pulse text-xs shrink-0 font-bold">
                  🎙️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">
                    Active Transcription
                  </p>
                  <p className="text-xs text-white truncate italic mt-0.5">
                    &quot;I&apos;m interested in the enterprise revenue package...&quot;
                  </p>
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="p-3 border border-white/20 rounded-lg bg-white/5">
                <p className="text-[10px] text-indigo-200 uppercase mb-1 font-bold tracking-wider">
                  Sentiment Analysis
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white font-semibold">Positive (88%)</span>
                  <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-full bg-emerald-400 h-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate("calls-voice-ai")}
              className="w-full mt-6 py-2.5 bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs rounded-lg uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
              Launch Conversation
            </button>
          </div>

          {/* Decorative Translucent Circle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        </div>
      </motion.div>

      {/* 4. 3 Status Cards */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={3}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Chatbot Status */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={() => onNavigate("unified-chat")}
          className={`p-5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all hover:border-[#3F51B5] hover:shadow-md ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-800"
          }`}
        >
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg flex items-center justify-center text-xl shrink-0">
            🤖
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chatbot Status</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
              Context-Aware (Live)
            </p>
          </div>
        </motion.div>

        {/* Active Automations */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={() => onNavigate("automation")}
          className={`p-5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all hover:border-[#FF9800] hover:shadow-md ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-800"
          }`}
        >
          <div className="w-12 h-12 bg-orange-50 dark:bg-amber-950/60 rounded-lg flex items-center justify-center text-xl shrink-0">
            ⚙️
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Automations</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
              42 Workflows Running
            </p>
          </div>
        </motion.div>

        {/* Real-time Sync */}
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          onClick={onOpenMultiAgent}
          className={`p-5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all hover:border-emerald-500 hover:shadow-md ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-800"
          }`}
        >
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg flex items-center justify-center text-xl shrink-0">
            ⚡
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Real-time Sync</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
              Enabled (Multi-agent)
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* 5. Quick Add Floating Action Button (Bottom-Right) */}
      <QuickAddFab
        darkMode={darkMode}
        onOpenDataModal={onOpenDataModal}
        onAddContact={onAddContact}
        onAddDeal={onAddDeal}
        onAddCall={onAddCall}
      />
    </section>
  );
};


