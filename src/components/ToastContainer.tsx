import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserPlus,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  ArrowRight,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  Flame,
} from "lucide-react";
import { ToastNotification, PipelineStage } from "../types";
import { useToast, STAGE_LABELS } from "../context/ToastContext";

interface ToastCardProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

const getStageBadgeColor = (stage: PipelineStage) => {
  switch (stage) {
    case "new_lead":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "qualified":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
    case "proposal":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "negotiation":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "won":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold";
    case "lost":
      return "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
};

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const duration = toast.durationMs ?? 5500;
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);

  useEffect(() => {
    if (paused) return;

    const start = Date.now();
    const initialRemaining = remainingTimeRef.current;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const currentRemaining = Math.max(0, initialRemaining - elapsed);
      remainingTimeRef.current = currentRemaining;
      const pct = (currentRemaining / duration) * 100;
      setProgress(pct);

      if (currentRemaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [paused, duration, onDismiss, toast.id]);

  const handleMouseEnter = () => {
    setPaused(true);
  };

  const handleMouseLeave = () => {
    setPaused(false);
    startTimeRef.current = Date.now();
  };

  const isWon = toast.dealData?.toStage === "won";
  const isLead = toast.type === "lead_added";
  const isDealStage = toast.type === "deal_stage_changed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -18, scale: 0.94, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.9, x: 40, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={`toast-notification-${toast.id}`}
      className={`relative w-full max-w-sm sm:max-w-md rounded-2xl shadow-xl border overflow-hidden backdrop-blur-md transition-shadow select-none group ${
        isWon
          ? "bg-gradient-to-br from-emerald-50/95 via-white/95 to-amber-50/95 dark:from-slate-900/95 dark:via-emerald-950/40 dark:to-slate-900/95 border-emerald-300 dark:border-emerald-600 shadow-emerald-500/10"
          : isLead
          ? "bg-white/95 dark:bg-slate-900/95 border-[#3F51B5]/30 dark:border-indigo-500/40 shadow-indigo-500/10"
          : isDealStage
          ? "bg-white/95 dark:bg-slate-900/95 border-purple-300/40 dark:border-purple-500/40 shadow-purple-500/10"
          : "bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="p-3.5 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Icon Badge */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isWon
                ? "bg-gradient-to-br from-amber-400 to-emerald-500 text-white"
                : isLead
                ? "bg-gradient-to-br from-[#3F51B5] to-indigo-600 text-white"
                : isDealStage
                ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                : toast.type === "deal_added"
                ? "bg-gradient-to-br from-amber-500 to-[#FF9800] text-indigo-950 font-bold"
                : toast.type === "error"
                ? "bg-rose-500 text-white"
                : toast.type === "warning"
                ? "bg-amber-500 text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            {isWon ? (
              <Trophy className="w-5 h-5 animate-bounce" />
            ) : isLead ? (
              <UserPlus className="w-4 h-4" />
            ) : isDealStage ? (
              <TrendingUp className="w-4 h-4" />
            ) : toast.type === "deal_added" ? (
              <Briefcase className="w-4 h-4" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-4 h-4" />
            ) : toast.type === "info" ? (
              <Info className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                  {toast.title}
                </span>
                {isWon && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 animate-pulse shrink-0">
                    <Sparkles className="w-2.5 h-2.5" /> Won
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {toast.timestamp}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
              {toast.message}
            </p>

            {/* Lead Specific Meta */}
            {toast.leadData && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                {toast.leadData.company && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    🏢 {toast.leadData.company}
                  </span>
                )}
                {toast.leadData.source && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-[#3F51B5] dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                    Source: {toast.leadData.source}
                  </span>
                )}
                {toast.leadData.score !== undefined && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-1 font-bold">
                    <Flame className="w-3 h-3 text-amber-500" />
                    Score: {toast.leadData.score}
                  </span>
                )}
              </div>
            )}

            {/* Deal Stage Change Specific Meta */}
            {toast.dealData && (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                    ${toast.dealData.value.toLocaleString()}
                  </span>
                  {toast.dealData.contactName && (
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      • {toast.dealData.contactName}
                    </span>
                  )}
                </div>

                {toast.dealData.fromStage && toast.dealData.toStage && (
                  <div className="flex items-center gap-1 text-[10px] font-medium pt-0.5 overflow-x-auto scrollbar-none">
                    <span
                      className={`px-2 py-0.5 rounded-md border truncate ${getStageBadgeColor(
                        toast.dealData.fromStage
                      )}`}
                    >
                      {STAGE_LABELS[toast.dealData.fromStage] || toast.dealData.fromStage}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span
                      className={`px-2 py-0.5 rounded-md border truncate ${getStageBadgeColor(
                        toast.dealData.toStage
                      )}`}
                    >
                      {STAGE_LABELS[toast.dealData.toStage] || toast.dealData.toStage}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            {toast.onAction && toast.actionLabel && (
              <div className="mt-2.5 pt-1">
                <button
                  onClick={() => {
                    toast.onAction?.();
                    onDismiss(toast.id);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                    isWon
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-[#3F51B5] hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500"
                  }`}
                >
                  <span>{toast.actionLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            onClick={() => onDismiss(toast.id)}
            className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800/80">
        <div
          className={`h-full transition-all duration-75 ${
            isWon
              ? "bg-gradient-to-r from-amber-400 to-emerald-500"
              : isLead
              ? "bg-[#3F51B5]"
              : isDealStage
              ? "bg-purple-500"
              : "bg-emerald-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, clearAllToasts, soundEnabled, setSoundEnabled } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      id="global-toast-notification-system"
      className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none"
    >
      {/* Toast Control Header for Multiple Toasts */}
      {toasts.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md text-xs"
        >
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#3F51B5]" />
            <span>{toasts.length} Real-Time Alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title={soundEnabled ? "Mute alert chimes" : "Unmute alert chimes"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={clearAllToasts}
              className="text-[11px] font-bold text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            >
              Dismiss All
            </button>
          </div>
        </motion.div>
      )}

      {/* List of active toasts */}
      <div className="space-y-2.5 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
