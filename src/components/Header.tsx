import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Bell,
  Sparkles,
  Zap,
  BrainCircuit,
  Bot,
  PlusCircle,
  Download,
  Mic,
  Moon,
  Sun,
  Image as ImageIcon,
  HelpCircle,
} from "lucide-react";

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMultiAgent: () => void;
  onOpenImageGen: () => void;
  onOpenTranscriber: () => void;
  onOpenDataModal: () => void;
  onOpenShortcuts?: () => void;
  onNavigateToBilling?: () => void;
  onExportCsv: () => void;
  onDownloadPdf: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  aiMode: "flash-lite" | "thinking" | "standard";
  setAiMode: (mode: "flash-lite" | "thinking" | "standard") => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMultiAgent,
  onOpenImageGen,
  onOpenTranscriber,
  onOpenDataModal,
  onOpenShortcuts,
  onNavigateToBilling,
  onExportCsv,
  onDownloadPdf,
  darkMode,
  setDarkMode,
  aiMode,
  setAiMode,
}) => {
  return (
    <header
      id="app-topbar-header"
      className={`h-16 border-b flex items-center justify-between px-8 shrink-0 transition-colors duration-200 z-10 select-none ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      {/* Sleek Search Input */}
      <div className="w-96 relative">
        <input
          type="text"
          readOnly
          onClick={onOpenSearch}
          placeholder="Search campaigns, nodes, analytics... (⌘K or /)"
          className={`w-full pl-10 pr-4 py-2 border rounded-full text-sm cursor-pointer transition-all ${
            darkMode
              ? "bg-slate-950 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-[#3F51B5]"
              : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3F51B5]"
          }`}
        />
        <span className="absolute left-3.5 top-2.5 opacity-40 text-xs">🔍</span>
      </div>

      {/* Sleek Right Action Controls */}
      <div className="flex items-center gap-3">
        {/* PDF Report Trigger */}
        <button
          onClick={onDownloadPdf}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            darkMode
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          Download PDF Report
        </button>

        {/* Latency & Flash-Lite Indicator */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
            Flash-Lite: 12ms
          </span>
        </div>

        {/* AI Mode Selector */}
        <div
          className={`hidden lg:flex items-center p-1 rounded-lg border text-xs font-medium ${
            darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"
          }`}
        >
          <button
            onClick={() => setAiMode("flash-lite")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
              aiMode === "flash-lite"
                ? "bg-[#FF9800] text-indigo-950 font-bold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Lite</span>
          </button>
          <button
            onClick={() => setAiMode("thinking")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
              aiMode === "thinking"
                ? "bg-[#3F51B5] text-white font-bold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <BrainCircuit className="w-3 h-3" />
            <span>Thinking</span>
          </button>
        </div>

        {/* Quick Tools */}
        <button
          onClick={onOpenImageGen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-all"
          title="AI Image Studio (Create & Edit Assets)"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Image Studio</span>
        </button>

        <button
          onClick={onOpenMultiAgent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-[#3F51B5] dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-all"
          title="Tri-Agent A2A Hub"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">A2A Hub</span>
        </button>

        <button
          onClick={onOpenDataModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-sm"
          title="Universal Add / Import Data"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Data</span>
        </button>

        {/* Keyboard Shortcuts Trigger Button */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className={`p-2 rounded-lg border text-xs font-mono font-bold transition-all ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
            title="Keyboard Shortcuts (Press ?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        {/* Dark/Light Toggle with Sun-to-Moon Rotate Animation */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setDarkMode((prev) => !prev)}
          className={`p-2 rounded-lg border text-xs transition-all flex items-center justify-center ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
              : "bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200"
          }`}
          title="Toggle Theme (or press ? for shortcuts)"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={darkMode ? "sun-icon" : "moon-icon"}
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* User Profile & Subscription / Billing Quick Access */}
        <button
          onClick={onNavigateToBilling}
          id="user-profile-avatar-btn"
          className={`flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border text-xs transition-all ${
            darkMode
              ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
              : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
          }`}
          title="Subscription & Billing: Sign In, Sign Up, or Manage Plan"
        >
          <div className="w-6 h-6 rounded-full bg-[#3F51B5] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
            AM
          </div>
          <span className="hidden xl:inline font-bold text-[11px]">Billing</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="PayPal Subscription Active / 7-Day Trial" />
        </button>
      </div>
    </header>
  );
};

