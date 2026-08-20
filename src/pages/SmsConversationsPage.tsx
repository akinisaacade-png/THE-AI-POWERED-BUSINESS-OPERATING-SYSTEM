import React, { useState } from "react";
import { MessageSquare, Send, Sparkles, User, CheckCircle2, Phone, Zap } from "lucide-react";
import { analyzeWithFlashLite } from "../services/api";

interface SmsConversationsPageProps {
  darkMode?: boolean;
}

export const SmsConversationsPage: React.FC<SmsConversationsPageProps> = ({
  darkMode = false,
}) => {
  const [selectedThread, setSelectedThread] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const threads = [
    {
      id: "th-1",
      contact: "Marcus Thorne",
      phone: "+1 (555) 782-9012",
      channel: "SMS",
      unread: false,
      messages: [
        { sender: "contact", text: "Hey, I tried calling earlier to ask about your Enterprise package.", time: "14:02" },
        { sender: "ai", text: "Hi Marcus! We saw we missed your call. Here is our direct calendar to lock in a discovery walkthrough: https://rev-os.io/book/alex", time: "14:02" },
        { sender: "contact", text: "Awesome, just booked for 2:00 PM today!", time: "14:06" },
      ],
    },
    {
      id: "th-2",
      contact: "Sarah Jenkins (Acme Corp)",
      phone: "+1 (555) 234-5678",
      channel: "WhatsApp",
      unread: true,
      messages: [
        { sender: "contact", text: "Can you send the updated pricing breakdown with 45 seats?", time: "11:30" },
      ],
    },
    {
      id: "th-3",
      contact: "David Chen",
      phone: "+1 (555) 987-6543",
      channel: "SMS",
      unread: false,
      messages: [
        { sender: "ai", text: "Hi David, your onboarding walkthrough is confirmed for tomorrow at 10 AM.", time: "09:15" },
        { sender: "contact", text: "Confirmed. Looking forward to it!", time: "09:20" },
      ],
    },
  ];

  const currentThread = threads[selectedThread];

  const handleGenerateAiReply = async () => {
    setIsAiGenerating(true);
    try {
      const res = await analyzeWithFlashLite(
        `Draft an ultra-concise, high-converting SMS response to: "${currentThread.messages[currentThread.messages.length - 1].text}" from ${currentThread.contact}. Keep it under 25 words with a call to action.`
      );
      setReplyText(res.analysis);
    } catch (e) {
      setReplyText("Hi! I've attached your requested 45-seat pricing proposal here: https://rev-os.io/proposal/acme. Let's review together today!");
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              SMS &amp; Omnichannel Conversations
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              Unified Two-Way Inbox
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Seamless SMS, WhatsApp, Email, and Instagram direct messages with AI response drafting.
          </p>
        </div>
      </div>

      {/* 2-Column Chat Layout */}
      <div
        className={`h-[640px] rounded-3xl border flex overflow-hidden ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        {/* Left Thread List */}
        <div
          className={`w-80 border-r flex flex-col ${
            darkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-slate-50/50"
          }`}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-extrabold text-xs uppercase tracking-wider text-slate-400">
            Active Conversations
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {threads.map((th, idx) => (
              <button
                key={th.id}
                onClick={() => setSelectedThread(idx)}
                className={`w-full p-4 text-left transition-all ${
                  selectedThread === idx
                    ? darkMode
                      ? "bg-slate-800/90 border-l-4 border-[#FF9800]"
                      : "bg-indigo-50/70 border-l-4 border-[#3F51B5]"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{th.contact}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-[#3F51B5] dark:text-indigo-300 font-bold">
                    {th.channel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {th.messages[th.messages.length - 1].text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Message Window */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3F51B5] text-white flex items-center justify-center font-bold text-xs">
                {currentThread.contact[0]}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {currentThread.contact}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">{currentThread.phone}</div>
              </div>
            </div>

            <button
              onClick={handleGenerateAiReply}
              disabled={isAiGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[#FF9800] text-xs font-bold hover:bg-amber-100 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiGenerating ? "Drafting..." : "Flash-Lite Smart Reply"}</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentThread.messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === "contact" ? "items-start" : "items-end"}`}
              >
                <div
                  className={`max-w-md p-3 rounded-2xl text-xs ${
                    m.sender === "contact"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none"
                      : "bg-[#3F51B5] text-white rounded-br-none"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type SMS or generate AI smart reply..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
            />
            <button
              onClick={() => {
                if (replyText.trim()) {
                  currentThread.messages.push({
                    sender: "ai",
                    text: replyText,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  });
                  setReplyText("");
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
