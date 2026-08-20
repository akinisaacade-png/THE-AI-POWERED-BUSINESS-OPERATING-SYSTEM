import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { ToastNotification, ToastType, Contact, Deal, PipelineStage } from "../types";

interface ToastContextValue {
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, "id" | "timestamp">) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  notifyNewLead: (contact: Contact, onNavigate?: () => void) => void;
  notifyDealStageChanged: (
    deal: Deal,
    fromStage: PipelineStage | undefined,
    toStage: PipelineStage,
    onNavigate?: () => void
  ) => void;
  notifyNewDeal: (deal: Deal, onNavigate?: () => void) => void;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Friendly Stage Titles
export const STAGE_LABELS: Record<PipelineStage, string> = {
  new_lead: "New Lead",
  qualified: "Discovery / Qualified",
  proposal: "Proposal Sent",
  negotiation: "In Negotiation",
  won: "Closed Won 🏆",
  lost: "Closed Lost",
};

// Subtle Web Audio Chimes
const playNotificationSound = (type: ToastType, toStage?: PipelineStage) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (type === "lead_added") {
      // Warm twin chime (E5 -> A5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.setValueAtTime(880.0, now + 0.08); // A5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.12);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } else if (type === "deal_stage_changed" && toStage === "won") {
      // Triumphant major triad chime (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.09, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.32);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.32);
      });
    } else if (type === "deal_stage_changed" || type === "deal_added") {
      // Upward smooth chime (F5 -> C6)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(698.46, now); // F5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.14); // C6

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    }
  } catch {
    // Audio contexts might be blocked until user interacts, safely catch
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((toastData: Omit<ToastNotification, "id" | "timestamp">): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastNotification = {
      ...toastData,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      durationMs: toastData.durationMs ?? 5500,
    };

    if (soundRef.current) {
      playNotificationSound(toastData.type, toastData.dealData?.toStage);
    }

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5 active toasts
    return id;
  }, []);

  const notifyNewLead = useCallback(
    (contact: Contact, onNavigate?: () => void) => {
      showToast({
        type: "lead_added",
        title: "✨ Real-Time Lead Captured",
        message: `${contact.name}${contact.company_name ? ` (${contact.company_name})` : ""} has been added to your CRM pipeline.`,
        leadData: {
          name: contact.name,
          company: contact.company_name,
          source: contact.source,
          score: contact.lead_score,
          email: contact.email,
        },
        actionLabel: onNavigate ? "View in Contacts" : undefined,
        onAction: onNavigate,
        durationMs: 6000,
      });
    },
    [showToast]
  );

  const notifyDealStageChanged = useCallback(
    (
      deal: Deal,
      fromStage: PipelineStage | undefined,
      toStage: PipelineStage,
      onNavigate?: () => void
    ) => {
      const isWon = toStage === "won";
      const fromLabel = fromStage ? STAGE_LABELS[fromStage] || fromStage : "Previous Stage";
      const toLabel = STAGE_LABELS[toStage] || toStage;

      showToast({
        type: "deal_stage_changed",
        title: isWon ? "🎉 Deal Won & Closed!" : "⚡ Real-Time Deal Stage Update",
        message: isWon
          ? `Deal "${deal.title}" for $${deal.value.toLocaleString()} has been marked as Closed Won!`
          : `Deal "${deal.title}" moved from ${fromLabel} ➔ ${toLabel}.`,
        dealData: {
          dealId: deal.id,
          title: deal.title,
          value: deal.value,
          fromStage,
          toStage,
          contactName: deal.contact_name,
          companyName: deal.company_name,
        },
        actionLabel: onNavigate ? "Open Pipeline" : undefined,
        onAction: onNavigate,
        durationMs: isWon ? 8000 : 6000,
      });
    },
    [showToast]
  );

  const notifyNewDeal = useCallback(
    (deal: Deal, onNavigate?: () => void) => {
      showToast({
        type: "deal_added",
        title: "💼 New Deal Created",
        message: `New deal "${deal.title}" valued at $${deal.value.toLocaleString()} added to ${STAGE_LABELS[deal.stage] || deal.stage}.`,
        dealData: {
          dealId: deal.id,
          title: deal.title,
          value: deal.value,
          toStage: deal.stage,
          contactName: deal.contact_name,
          companyName: deal.company_name,
        },
        actionLabel: onNavigate ? "View Deal" : undefined,
        onAction: onNavigate,
        durationMs: 5500,
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        clearAllToasts,
        notifyNewLead,
        notifyDealStageChanged,
        notifyNewDeal,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};
