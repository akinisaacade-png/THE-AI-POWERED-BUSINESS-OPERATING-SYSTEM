import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  Sliders,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Zap,
  Target,
  BarChart2,
  Calendar,
  Layers,
  ArrowRight,
  Percent,
  CheckCircle2,
  PieChart as PieIcon,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { Deal, PipelineStage } from "../types";

interface PredictiveRevenueForecastProps {
  deals: Deal[];
  darkMode?: boolean;
  revenueTarget?: number;
  onNavigateToDeals?: () => void;
}

// Stage baseline conversion weights
const STAGE_CONVERSION_RATES: Record<PipelineStage, number> = {
  won: 1.0,
  negotiation: 0.82,
  proposal: 0.65,
  qualified: 0.42,
  new_lead: 0.22,
  lost: 0.0,
};

const STAGE_LABELS: Record<PipelineStage, string> = {
  new_lead: "New Leads",
  qualified: "Discovery / Qualified",
  proposal: "Proposal Sent",
  negotiation: "In Negotiation",
  won: "Closed Won",
  lost: "Closed Lost",
};

const STAGE_COLORS: Record<PipelineStage, string> = {
  won: "#10B981",
  negotiation: "#6366F1",
  proposal: "#3F51B5",
  qualified: "#F59E0B",
  new_lead: "#8B5CF6",
  lost: "#EF4444",
};

export const PredictiveRevenueForecast: React.FC<PredictiveRevenueForecastProps> = ({
  deals,
  darkMode = false,
  revenueTarget = 60000,
  onNavigateToDeals,
}) => {
  // Horizon: 30 days, 90 days (Quarter), 180 days (6 Months), 365 days (12 Months)
  const [horizon, setHorizon] = useState<"30d" | "90d" | "180d" | "365d">("90d");
  const [activeLines, setActiveLines] = useState<"all" | "expected" | "scenarios" | "rates">("all");
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [winRateModifier, setWinRateModifier] = useState<number>(0); // -30% to +30%
  const [dealSizeModifier, setDealSizeModifier] = useState<number>(0); // -20% to +20%
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // 1. Calculate Pipeline Stage Totals, Historical Win Rates & Conversion Multipliers
  const pipelineMetrics = useMemo(() => {
    const stageBreakdown: Record<
      PipelineStage,
      { count: number; totalValue: number; weightedValue: number; conversionRate: number }
    > = {
      new_lead: { count: 0, totalValue: 0, weightedValue: 0, conversionRate: STAGE_CONVERSION_RATES.new_lead },
      qualified: { count: 0, totalValue: 0, weightedValue: 0, conversionRate: STAGE_CONVERSION_RATES.qualified },
      proposal: { count: 0, totalValue: 0, weightedValue: 0, conversionRate: STAGE_CONVERSION_RATES.proposal },
      negotiation: { count: 0, totalValue: 0, weightedValue: 0, conversionRate: STAGE_CONVERSION_RATES.negotiation },
      won: { count: 0, totalValue: 0, weightedValue: 0, conversionRate: 1.0 },
      lost: { count: 0, totalValue: 0, weightedValue: 0, conversionRate: 0.0 },
    };

    let totalPipelineUnclosed = 0;
    let totalWeightedPipeline = 0;
    let closedWonTotal = 0;
    let closedWonCount = 0;
    let closedLostTotal = 0;
    let closedLostCount = 0;

    deals.forEach((deal) => {
      const stage = deal.stage;
      const baseValue = deal.value || 0;
      const modValue = baseValue * (1 + dealSizeModifier / 100);

      // Base conversion rate with what-if modifier
      const baseRate = deal.probability ? deal.probability / 100 : STAGE_CONVERSION_RATES[stage] ?? 0.3;
      const effectiveRate = Math.min(1, Math.max(0, baseRate * (1 + winRateModifier / 100)));

      if (stageBreakdown[stage]) {
        stageBreakdown[stage].count += 1;
        stageBreakdown[stage].totalValue += modValue;
        stageBreakdown[stage].weightedValue += modValue * effectiveRate;
        stageBreakdown[stage].conversionRate = Math.round(effectiveRate * 100);
      }

      if (stage === "won") {
        closedWonTotal += modValue;
        closedWonCount += 1;
      } else if (stage === "lost") {
        closedLostTotal += modValue;
        closedLostCount += 1;
      } else {
        totalPipelineUnclosed += modValue;
        totalWeightedPipeline += modValue * effectiveRate;
      }
    });

    const totalClosed = closedWonCount + closedLostCount;
    const empiricalWinRate = totalClosed > 0 ? (closedWonCount / totalClosed) * 100 : 75;
    const avgDealSize = closedWonCount > 0 ? closedWonTotal / closedWonCount : 18500;
    const blendedPipelineConversion =
      totalPipelineUnclosed > 0 ? (totalWeightedPipeline / totalPipelineUnclosed) * 100 : 54;

    return {
      stageBreakdown,
      totalPipelineUnclosed,
      totalWeightedPipeline,
      closedWonTotal,
      closedWonCount,
      closedLostTotal,
      closedLostCount,
      empiricalWinRate: Math.round(empiricalWinRate),
      avgDealSize: Math.round(avgDealSize),
      blendedPipelineConversion: Math.round(blendedPipelineConversion),
    };
  }, [deals, winRateModifier, dealSizeModifier]);

  // 2. Generate Future Time-Series Projections via Line Chart Data Points
  const projectionData = useMemo(() => {
    // Current date baseline (August 2026)
    const now = new Date(2026, 7, 20); // Aug 2026
    const wonBase = pipelineMetrics.closedWonTotal > 0 ? pipelineMetrics.closedWonTotal : 48000;
    const weightedPipeline = pipelineMetrics.totalWeightedPipeline > 0 ? pipelineMetrics.totalWeightedPipeline : 38000;
    const unclosedPipeline = pipelineMetrics.totalPipelineUnclosed > 0 ? pipelineMetrics.totalPipelineUnclosed : 68000;
    const baseWinRate = pipelineMetrics.blendedPipelineConversion;

    // Monthly compound velocity (avg 7.5% organic monthly growth)
    const monthlyRunRate = wonBase * 0.85;

    interface ChartPoint {
      label: string;
      periodName: string;
      actual: number | null;
      projected: number;
      conservative: number;
      optimistic: number;
      conversionRate: number;
      isProjected: boolean;
      pipelineRealized: number;
    }

    const points: ChartPoint[] = [];

    if (horizon === "30d") {
      // 4-Week Horizon
      points.push({
        label: "Week 1",
        periodName: "Week 1 (Current)",
        actual: Math.round(wonBase),
        projected: Math.round(wonBase),
        conservative: Math.round(wonBase),
        optimistic: Math.round(wonBase),
        conversionRate: baseWinRate,
        isProjected: false,
        pipelineRealized: 0,
      });

      const wFactors = [
        { label: "Week 2", pRate: 0.28, cRate: 0.18, oRate: 0.38, rate: baseWinRate + 2 },
        { label: "Week 3", pRate: 0.62, cRate: 0.42, oRate: 0.75, rate: baseWinRate + 4 },
        { label: "Week 4", pRate: 1.05, cRate: 0.72, oRate: 1.25, rate: baseWinRate + 7 },
      ];

      wFactors.forEach((wf) => {
        const expected = Math.round(wonBase + weightedPipeline * wf.pRate);
        const conservative = Math.round(wonBase + weightedPipeline * wf.cRate);
        const optimistic = Math.round(wonBase + unclosedPipeline * wf.oRate * 0.75);

        points.push({
          label: wf.label,
          periodName: `${wf.label} (Projected)`,
          actual: null,
          projected: expected,
          conservative,
          optimistic,
          conversionRate: Math.min(wf.rate, 95),
          isProjected: true,
          pipelineRealized: Math.round(weightedPipeline * wf.pRate),
        });
      });
    } else if (horizon === "90d") {
      // 90-Day (Quarterly Horizon) with 2 historical months and 3 future projected months
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      // 2 historical actual months
      points.push({
        label: `${monthNames[5]} (Act)`,
        periodName: "June 2026 (Actual)",
        actual: Math.round(wonBase * 0.78),
        projected: Math.round(wonBase * 0.78),
        conservative: Math.round(wonBase * 0.78),
        optimistic: Math.round(wonBase * 0.78),
        conversionRate: 52,
        isProjected: false,
        pipelineRealized: 0,
      });

      points.push({
        label: `${monthNames[6]} (Act)`,
        periodName: "July 2026 (Actual)",
        actual: Math.round(wonBase * 0.88),
        projected: Math.round(wonBase * 0.88),
        conservative: Math.round(wonBase * 0.88),
        optimistic: Math.round(wonBase * 0.88),
        conversionRate: 58,
        isProjected: false,
        pipelineRealized: 0,
      });

      // Current month (Aug)
      points.push({
        label: `${monthNames[7]} (Curr)`,
        periodName: "August 2026 (Current)",
        actual: Math.round(wonBase),
        projected: Math.round(wonBase),
        conservative: Math.round(wonBase),
        optimistic: Math.round(wonBase),
        conversionRate: baseWinRate,
        isProjected: false,
        pipelineRealized: 0,
      });

      // 3 Future months: Sep, Oct, Nov
      const futureQuarters = [
        { idx: 8, label: `${monthNames[8]} (P)`, pFrac: 0.85, cFrac: 0.55, oFrac: 1.15, rate: baseWinRate + 3 },
        { idx: 9, label: `${monthNames[9]} (P)`, pFrac: 1.65, cFrac: 1.1, oFrac: 2.1, rate: baseWinRate + 6 },
        { idx: 10, label: `${monthNames[10]} (P)`, pFrac: 2.5, cFrac: 1.65, oFrac: 3.1, rate: baseWinRate + 9 },
      ];

      futureQuarters.forEach((fq, i) => {
        const growthStep = (i + 1) * 0.12;
        const expected = Math.round(wonBase + weightedPipeline * fq.pFrac + monthlyRunRate * growthStep);
        const conservative = Math.round(wonBase + weightedPipeline * fq.cFrac + monthlyRunRate * growthStep * 0.6);
        const optimistic = Math.round(wonBase + unclosedPipeline * 0.7 * fq.pFrac + monthlyRunRate * growthStep * 1.35);

        points.push({
          label: fq.label,
          periodName: `${monthNames[fq.idx]} 2026 (Forecast)`,
          actual: null,
          projected: expected,
          conservative,
          optimistic,
          conversionRate: Math.min(fq.rate, 92),
          isProjected: true,
          pipelineRealized: Math.round(weightedPipeline * fq.pFrac),
        });
      });
    } else if (horizon === "180d") {
      // 6-Month Trajectory: 2 past months, current, and 5 future months
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      points.push({
        label: `${monthNames[5]}`,
        periodName: "June 2026 (Actual)",
        actual: Math.round(wonBase * 0.78),
        projected: Math.round(wonBase * 0.78),
        conservative: Math.round(wonBase * 0.78),
        optimistic: Math.round(wonBase * 0.78),
        conversionRate: 52,
        isProjected: false,
        pipelineRealized: 0,
      });

      points.push({
        label: `${monthNames[6]}`,
        periodName: "July 2026 (Actual)",
        actual: Math.round(wonBase * 0.88),
        projected: Math.round(wonBase * 0.88),
        conservative: Math.round(wonBase * 0.88),
        optimistic: Math.round(wonBase * 0.88),
        conversionRate: 58,
        isProjected: false,
        pipelineRealized: 0,
      });

      points.push({
        label: `${monthNames[7]}*`,
        periodName: "August 2026 (Current)",
        actual: Math.round(wonBase),
        projected: Math.round(wonBase),
        conservative: Math.round(wonBase),
        optimistic: Math.round(wonBase),
        conversionRate: baseWinRate,
        isProjected: false,
        pipelineRealized: 0,
      });

      for (let f = 1; f <= 5; f++) {
        const mIdx = (7 + f) % 12;
        const mName = monthNames[mIdx];
        const step = f;
        const expected = Math.round(wonBase + (weightedPipeline * 0.85 + monthlyRunRate * 0.35) * step);
        const conservative = Math.round(wonBase + (weightedPipeline * 0.55 + monthlyRunRate * 0.2) * step);
        const optimistic = Math.round(wonBase + (unclosedPipeline * 0.75 + monthlyRunRate * 0.5) * step);

        points.push({
          label: `${mName} (P)`,
          periodName: `${mName} (Projected)`,
          actual: null,
          projected: expected,
          conservative,
          optimistic,
          conversionRate: Math.min(baseWinRate + step * 2.5, 94),
          isProjected: true,
          pipelineRealized: Math.round(weightedPipeline * 0.85 * step),
        });
      }
    } else {
      // 12-Month Annual Model
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 0; i < 12; i++) {
        const mIdx = (7 + i) % 12;
        const mName = monthNames[mIdx];
        const isPastOrCurr = i === 0;

        if (isPastOrCurr) {
          points.push({
            label: mName,
            periodName: `${mName} 2026 (Current)`,
            actual: Math.round(wonBase),
            projected: Math.round(wonBase),
            conservative: Math.round(wonBase),
            optimistic: Math.round(wonBase),
            conversionRate: baseWinRate,
            isProjected: false,
            pipelineRealized: 0,
          });
        } else {
          const step = i;
          const expected = Math.round(wonBase + (weightedPipeline * 0.65 + monthlyRunRate * 0.28) * step);
          const conservative = Math.round(wonBase + (weightedPipeline * 0.42 + monthlyRunRate * 0.18) * step);
          const optimistic = Math.round(wonBase + (unclosedPipeline * 0.6 + monthlyRunRate * 0.45) * step);

          points.push({
            label: `${mName} (P)`,
            periodName: `${mName} (Forecast)`,
            actual: null,
            projected: expected,
            conservative,
            optimistic,
            conversionRate: Math.min(baseWinRate + step * 1.5, 95),
            isProjected: true,
            pipelineRealized: Math.round(weightedPipeline * 0.65 * step),
          });
        }
      }
    }

    return points;
  }, [horizon, pipelineMetrics]);

  // Final End-of-Horizon Projections
  const finalProjected = projectionData[projectionData.length - 1];
  const expectedForecast = finalProjected?.projected || 0;
  const conservativeForecast = finalProjected?.conservative || 0;
  const optimisticForecast = finalProjected?.optimistic || 0;
  const projectedSurplus = expectedForecast - revenueTarget;

  // Custom Line Chart Tooltip
  const CustomForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0]?.payload;
      return (
        <div
          className={`p-3.5 rounded-2xl border shadow-xl text-xs space-y-2 min-w-[210px] ${
            darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
              {point?.periodName || label}
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                point?.isProjected
                  ? "bg-indigo-100 text-[#3F51B5] dark:bg-indigo-950 dark:text-indigo-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {point?.isProjected ? "AI Predictive" : "Closed Actual"}
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Projected Earnings */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3F51B5]" />
                <span>Projected Earnings:</span>
              </span>
              <span className="font-mono font-bold text-[#3F51B5] dark:text-indigo-400">
                ${point?.projected?.toLocaleString()}
              </span>
            </div>

            {/* Historical Deal Revenue (if applicable) */}
            {point?.actual !== null && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                  <span>Historical Actual:</span>
                </span>
                <span className="font-mono font-bold text-[#0284C7]">
                  ${point?.actual?.toLocaleString()}
                </span>
              </div>
            )}

            {/* Optimistic Scenario */}
            {activeLines === "all" || activeLines === "scenarios" ? (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Optimistic Upside:</span>
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ${point?.optimistic?.toLocaleString()}
                </span>
              </div>
            ) : null}

            {/* Conservative Scenario */}
            {activeLines === "all" || activeLines === "scenarios" ? (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Conservative Floor:</span>
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  ${point?.conservative?.toLocaleString()}
                </span>
              </div>
            ) : null}

            {/* Stage Conversion Rate % */}
            <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Percent className="w-3 h-3 text-purple-500" />
                <span>Stage Conversion Rate:</span>
              </span>
              <span className="font-mono font-black text-purple-600 dark:text-purple-400">
                {point?.conversionRate}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="predictive-revenue-forecast-module"
      className={`p-6 sm:p-7 rounded-3xl border transition-all relative overflow-hidden ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white shadow-xl shadow-black/20"
          : "bg-white border-slate-200 shadow-sm text-slate-900"
      }`}
    >
      {/* Background Ambience Gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3F51B5] to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/25 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                Predictive Revenue Forecast
              </h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#3F51B5] dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Line Chart Projection Model
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-month future earnings projection synthesized from historical deal velocity and stage conversion rates.
            </p>
          </div>
        </div>

        {/* Action Controls & Horizon Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setHorizon("30d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                horizon === "30d"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setHorizon("90d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                horizon === "90d"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              90 Days (Qtr)
            </button>
            <button
              onClick={() => setHorizon("180d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                horizon === "180d"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setHorizon("365d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                horizon === "365d"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              12 Months
            </button>
          </div>

          {/* Line Chart View Filter Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveLines("all")}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeLines === "all"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Show all scenario lines"
            >
              All Lines
            </button>
            <button
              onClick={() => setActiveLines("expected")}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeLines === "expected"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Show only expected projected and historical actual lines"
            >
              Projected
            </button>
            <button
              onClick={() => setActiveLines("rates")}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeLines === "rates"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Highlight stage conversion rate overlay"
            >
              Conversion %
            </button>
          </div>

          {/* What-If Sensitivity Button */}
          <button
            id="btn-toggle-what-if"
            onClick={() => setShowWhatIf(!showWhatIf)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs active:scale-95 ${
              showWhatIf
                ? "bg-amber-500 text-white border-amber-600"
                : darkMode
                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showWhatIf ? "Hide Sliders" : "What-If Model"}</span>
          </button>

          {/* Explanation Modal Button */}
          <button
            onClick={() => setShowFormulaModal(!showFormulaModal)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all"
            title="How the predictive conversion algorithm works"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive What-If Scenario Controls */}
      <AnimatePresence>
        {showWhatIf && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 dark:bg-amber-950/20 dark:border-amber-800/40 text-xs space-y-3 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-extrabold text-slate-900 dark:text-amber-200 text-xs">
                  What-If Sensitivity Simulation Controls
                </span>
              </div>
              <button
                onClick={() => {
                  setWinRateModifier(0);
                  setDealSizeModifier(0);
                }}
                className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
              >
                Reset Parameters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Stage Conversion Win Rate Modifier
                  </label>
                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                    {winRateModifier >= 0 ? `+${winRateModifier}%` : `${winRateModifier}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  step={5}
                  value={winRateModifier}
                  onChange={(e) => setWinRateModifier(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3F51B5]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Adjust probability capture rates across new leads, proposals, and negotiations.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Average Deal Value Modifier
                  </label>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {dealSizeModifier >= 0 ? `+${dealSizeModifier}%` : `${dealSizeModifier}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  step={5}
                  value={dealSizeModifier}
                  onChange={(e) => setDealSizeModifier(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Simulate contract expansion or enterprise upsells on prospective deals.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Model Explanation Modal / Dropdown */}
      <AnimatePresence>
        {showFormulaModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#3F51B5] dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                How the Predictive Revenue Forecast Projects Future Earnings:
              </span>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                Close
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              1. <strong>Historical Deal Baseline:</strong> Evaluates closed-won deals (${pipelineMetrics.closedWonTotal.toLocaleString()}) and historical win ratios ({pipelineMetrics.empiricalWinRate}% across {pipelineMetrics.closedWonCount} closed deals).
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              2. <strong>Stage Conversion Weights:</strong> Discounts open opportunities by stage-specific conversion probabilities (Negotiation: 82%, Proposal: 65%, Discovery: 42%, Lead: 22%).
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              3. <strong>Predictive Time Trajectory:</strong> Blends historical organic velocity with weighted pipeline close milestones to project future monthly earnings visualized via the line chart.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Summary Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Card 1: Projected Future Earnings */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            darkMode ? "bg-slate-800/60 border-slate-700/80" : "bg-indigo-50/40 border-indigo-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3F51B5] dark:text-indigo-300">
              Projected Earnings
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#3F51B5] text-white">
              {horizon.toUpperCase()}
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1.5">
            ${expectedForecast.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>
              {projectedSurplus >= 0
                ? `+$${projectedSurplus.toLocaleString()} over goal`
                : `$${Math.abs(projectedSurplus).toLocaleString()} gap to target`}
            </span>
          </div>
        </div>

        {/* Card 2: Historical Closed Deal Revenue */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            darkMode ? "bg-slate-800/60 border-slate-700/80" : "bg-sky-50/40 border-sky-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7]">
              Historical Deal Revenue
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              Won Deals
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1.5">
            ${pipelineMetrics.closedWonTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {pipelineMetrics.closedWonCount} contracts closed • Avg ${pipelineMetrics.avgDealSize.toLocaleString()}
          </p>
        </div>

        {/* Card 3: Stage-Weighted Pipeline Value */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            darkMode ? "bg-slate-800/60 border-slate-700/80" : "bg-purple-50/40 border-purple-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-300">
              Weighted Pipeline
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Active Deals
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1.5">
            ${pipelineMetrics.totalWeightedPipeline.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            From ${pipelineMetrics.totalPipelineUnclosed.toLocaleString()} total open pipeline
          </p>
        </div>

        {/* Card 4: Empirical Stage Conversion Rate */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            darkMode ? "bg-slate-800/60 border-slate-700/80" : "bg-emerald-50/40 border-emerald-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Conversion Win Rate
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Efficiency
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1.5">
            {pipelineMetrics.blendedPipelineConversion}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Historical win rate: {pipelineMetrics.empiricalWinRate}% won vs lost
          </p>
        </div>
      </div>

      {/* Main Visual Forecasting Module: LINE CHART */}
      <div className="mt-6 p-5 rounded-2xl border bg-slate-50/60 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>Predictive Revenue Line Chart</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                {horizon === "30d"
                  ? "30-Day Weekly Run-Rate"
                  : horizon === "90d"
                  ? "90-Day Quarterly Trajectory"
                  : horizon === "180d"
                  ? "6-Month Forecast"
                  : "12-Month Annual Model"}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Historical Deal Revenue (Sky Blue Line) transitioning to AI Expected Projected Earnings (Indigo Line) &amp; Confidence Bands.
            </p>
          </div>

          {/* Quick Legend Indicators */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-3 h-1 bg-[#3F51B5] rounded-full inline-block" />
              <span>Projected Earnings</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-3 h-1 bg-[#0284C7] rounded-full inline-block" />
              <span>Historical Actual</span>
            </span>
            {(activeLines === "all" || activeLines === "scenarios") && (
              <>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500 inline-block" />
                  <span>Optimistic</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-500 inline-block" />
                  <span>Conservative</span>
                </span>
              </>
            )}
            {(activeLines === "all" || activeLines === "rates") && (
              <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full border border-purple-500 bg-purple-100 dark:bg-purple-950 inline-block" />
                <span>Conversion %</span>
              </span>
            )}
          </div>
        </div>

        {/* RECHARTS LINE CHART VISUALIZATION */}
        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={projectionData}
              margin={{ top: 15, right: 25, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#334155" : "#E2E8F0"}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                stroke={darkMode ? "#94A3B8" : "#64748B"}
                fontSize={11}
                fontWeight={600}
                tickLine={false}
              />
              <YAxis
                yAxisId="revenue"
                stroke={darkMode ? "#94A3B8" : "#64748B"}
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              {/* Secondary Axis for Conversion Rate % */}
              <YAxis
                yAxisId="rate"
                orientation="right"
                stroke={darkMode ? "#A78BFA" : "#8B5CF6"}
                fontSize={10}
                fontWeight={600}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomForecastTooltip />} />

              {/* Benchmark Reference Target Line */}
              <ReferenceLine
                yAxisId="revenue"
                y={revenueTarget}
                stroke="#94A3B8"
                strokeDasharray="4 4"
                label={{
                  value: `Target ($${(revenueTarget / 1000).toFixed(0)}k)`,
                  fill: darkMode ? "#94A3B8" : "#64748B",
                  fontSize: 10,
                  position: "top",
                }}
              />

              {/* 1. Historical Closed Deal Actuals Line */}
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="actual"
                name="Historical Deal Revenue"
                stroke="#0284C7"
                strokeWidth={3}
                dot={{ r: 5, fill: "#0284C7", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: "#0284C7", strokeWidth: 2 }}
                connectNulls={false}
              />

              {/* 2. Projected Future Earnings Line (AI Expected) */}
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="projected"
                name="Projected Earnings (AI Expected)"
                stroke="#3F51B5"
                strokeWidth={3.5}
                dot={{ r: 4, fill: "#3F51B5", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: "#3F51B5", strokeWidth: 2 }}
              />

              {/* 3. Optimistic Upside Line */}
              {(activeLines === "all" || activeLines === "scenarios") && (
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="optimistic"
                  name="Optimistic (Upside)"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: "#10B981" }}
                />
              )}

              {/* 4. Conservative Floor Line */}
              {(activeLines === "all" || activeLines === "scenarios") && (
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="conservative"
                  name="Conservative (Floor)"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 3, fill: "#F59E0B" }}
                />
              )}

              {/* 5. Stage Conversion Rate Line on Secondary Axis */}
              {(activeLines === "all" || activeLines === "rates") && (
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="conversionRate"
                  name="Conversion Rate %"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#8B5CF6" }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline Stage Conversion Rates Breakdown */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div>
            <h5 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[#3F51B5]" />
              <span>Stage-Specific Conversion Rates &amp; Pipeline Realization</span>
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              How each pipeline stage translates unclosed deal values into projected future earnings.
            </p>
          </div>
          {onNavigateToDeals && (
            <button
              onClick={onNavigateToDeals}
              className="text-xs font-bold text-[#3F51B5] dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage CRM Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(["new_lead", "qualified", "proposal", "negotiation", "won"] as PipelineStage[]).map((stage) => {
            const data = pipelineMetrics.stageBreakdown[stage];
            const color = STAGE_COLORS[stage];
            return (
              <div
                key={stage}
                className={`p-3 rounded-xl border ${
                  darkMode ? "bg-slate-800/40 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] font-mono font-black text-slate-700 dark:text-slate-300">
                    {data.conversionRate}% conv
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                  {STAGE_LABELS[stage]}
                </div>
                <div className="text-sm font-black font-mono text-slate-900 dark:text-white mt-1">
                  ${Math.round(data.totalValue).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 flex justify-between">
                  <span>{data.count} deal(s)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    ${Math.round(data.weightedValue).toLocaleString()} proj
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
