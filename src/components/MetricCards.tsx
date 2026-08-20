import React from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  PhoneCall,
  Star,
  Megaphone,
  Workflow,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface MetricCardsProps {
  onDownloadPdf: () => void;
  onExportCsv: () => void;
  darkMode?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const MetricCards: React.FC<MetricCardsProps> = ({
  onDownloadPdf,
  onExportCsv,
  darkMode = false,
}) => {
  return (
    <div className="space-y-4">
      {/* 4 Sleek Metric Cards matching Design Theme */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* 1. New Leads */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          id="metric-card-new-leads"
          className={`p-5 rounded-xl border transition-shadow hover:shadow-md ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-white border-slate-200 shadow-sm text-slate-800"
          }`}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            New Leads
          </p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">1,284</h3>
            <span className="text-emerald-500 text-sm font-bold">+12% ↑</span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#3F51B5] w-3/4 rounded-full"></div>
          </div>
        </motion.div>

        {/* 2. Qualified */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          id="metric-card-qualified"
          className={`p-5 rounded-xl border transition-shadow hover:shadow-md ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-white border-slate-200 shadow-sm text-slate-800"
          }`}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Qualified
          </p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">452</h3>
            <span className="text-slate-400 text-sm">84 today</span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF9800] w-1/2 rounded-full"></div>
          </div>
        </motion.div>

        {/* 3. Conversion Rate */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          id="metric-card-conversion-rate"
          className={`p-5 rounded-xl border transition-shadow hover:shadow-md ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-white border-slate-200 shadow-sm text-slate-800"
          }`}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Conversion Rate
          </p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">18.4%</h3>
            <span className="text-[#FF9800] text-sm font-bold">Target: 20%</span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#3F51B5] w-5/6 rounded-full"></div>
          </div>
        </motion.div>

        {/* 4. Won Revenue */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          id="metric-card-won-revenue"
          className={`p-5 rounded-xl border transition-shadow hover:shadow-md ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-white border-slate-200 shadow-sm text-slate-800"
          }`}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Won Revenue
          </p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-[#3F51B5] dark:text-indigo-400">$42,850</h3>
            <span className="text-emerald-500 text-sm font-bold">+8.2% ↑</span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF9800] w-2/3 rounded-full"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

