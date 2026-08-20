import React, { useState } from "react";
import { CallLog } from "../types";
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Sparkles,
  Zap,
  Clock,
  Mic,
  MessageSquare,
} from "lucide-react";
import { analyzeWithFlashLite } from "../services/api";

interface CallsVoicePageProps {
  calls: CallLog[];
  onAddCall: (call: any) => void;
  onDeleteCall: (callId: string) => void;
  onOpenDataModal: (section?: string) => void;
  onOpenTranscriber: () => void;
  darkMode?: boolean;
}

export const CallsVoicePage: React.FC<CallsVoicePageProps> = ({
  calls,
  onAddCall,
  onDeleteCall,
  onOpenDataModal,
  onOpenTranscriber,
  darkMode = false,
}) => {
  const [simulatingRecovery, setSimulatingRecovery] = useState(false);
  const [recoveryLog, setRecoveryLog] = useState<string | null>(null);

  const handleSimulateMissedCall = () => {
    setSimulatingRecovery(true);
    setRecoveryLog("⚡ Incoming call missed from +1 (555) 782-9012...");

    setTimeout(() => {
      setRecoveryLog("🤖 Voice AI triggered: Initiating 8-second SMS text-back sequence...");
    }, 1200);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toISOString().replace("T", " ").slice(0, 16);
      const newCall: CallLog = {
        id: `call-sim-${Date.now().toString().slice(-4)}`,
        contact_name: "Marcus Thorne (Recovered)",
        phone: "+1 (555) 782-9012",
        type: "missed",
        duration: "00:00",
        outcome: "Recovered via SMS (8s)",
        timestamp: `${timeStr} (Just now)`,
        ai_summary: "Automated SMS text-back sent with personalized booking calendar. Prospect confirmed 2:00 PM slot.",
        sentiment: "Positive",
        follow_up_task: "Prepare enterprise proposal presentation for 2:00 PM discovery call.",
      };
      onAddCall(newCall);
      setRecoveryLog("✅ Successfully recovered! SMS text-back delivered in 8 seconds. Booking secured.");
      setSimulatingRecovery(false);
    }, 3200);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Calls &amp; Voice AI Engine
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              8s Missed Call Text-Back Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            IVR call routing, real-time transcription, and zero-drop-off missed call recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-voice-live-transcribe"
            onClick={onOpenTranscriber}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              darkMode ? "bg-slate-800 border-slate-700 text-indigo-300" : "bg-white border-slate-200 text-[#3F51B5] shadow-sm"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>World Language Transcriber</span>
          </button>

          <button
            id="btn-simulate-missed-call"
            disabled={simulatingRecovery}
            onClick={handleSimulateMissedCall}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Simulate Missed Call Recovery</span>
          </button>
        </div>
      </div>

      {/* Recovery Live Telemetry Banner */}
      {recoveryLog && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-[#3F51B5] dark:text-indigo-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF9800]" />
            <span>{recoveryLog}</span>
          </div>
          <button
            onClick={() => setRecoveryLog(null)}
            className="text-slate-400 hover:text-slate-600 font-normal"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Call History Table */}
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
                <th className="p-4">Caller &amp; Phone</th>
                <th className="p-4">Call Type</th>
                <th className="p-4">Duration &amp; Outcome</th>
                <th className="p-4">AI Call Summary &amp; Sentiment</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {calls.map((call) => (
                <tr
                  key={call.id}
                  className={`transition-colors ${
                    darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{call.contact_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{call.phone}</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-bold">
                      {call.type === "inbound" ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <PhoneIncoming className="w-3.5 h-3.5" /> Inbound
                        </span>
                      ) : call.type === "outbound" ? (
                        <span className="flex items-center gap-1 text-blue-500">
                          <PhoneOutgoing className="w-3.5 h-3.5" /> Outbound
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#FF9800]">
                          <PhoneMissed className="w-3.5 h-3.5" /> Missed
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {call.duration}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {call.outcome}
                    </span>
                  </td>

                  <td className="p-4 max-w-sm">
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {call.ai_summary}
                    </p>
                    {call.follow_up_task && (
                      <div className="mt-1 text-[10px] text-[#3F51B5] dark:text-indigo-400 font-bold">
                        → Task: {call.follow_up_task}
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                    {call.timestamp}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => onDeleteCall(call.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                      title="Delete Call Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
