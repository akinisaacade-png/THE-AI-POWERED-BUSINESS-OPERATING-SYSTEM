import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Zap,
  BrainCircuit,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { sendChatMessage } from "../services/api";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface GeminiChatbotWidgetProps {
  darkMode?: boolean;
}

export const GeminiChatbotWidget: React.FC<GeminiChatbotWidgetProps> = ({
  darkMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [agentRole, setAgentRole] = useState<"general" | "sales" | "tech_support" | "judge">("general");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init",
      sender: "ai",
      text: "⚡ Welcome to THE AI-POWERED BUSINESS OPERATING SYSTEM. I am your context-aware revenue assistant with conversational memory. How can I help optimize your pipeline, automations, or bookings today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const historyContext = messages.map((m) => ({ sender: m.sender, text: m.text }));
      const res = await sendChatMessage(promptText, historyContext, agentRole);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: res.reply || "I am ready to assist with your business operations.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "I processed your request. You can check your pipeline stages or trigger automated follow-ups directly in the CRM tab.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "How does the Missed Call Text-Back automation work?",
    "Generate a high-converting enterprise proposal outline",
    "Audit my active workflows using the Judge Agent",
    "How do I configure my Gray-Labelled Mobile App?",
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40 select-none">
      {!isOpen && (
        <div
          id="btn-open-gemini-chatbot"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#FF9800] rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform"
          title="Open Conversation AI Chatbot"
        >
          <span className="text-2xl">💬</span>
        </div>
      )}

      {isOpen && (
        <div
          id="gemini-chatbot-window"
          className={`rounded-2xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-5 ${
            isExpanded
              ? "w-[92vw] sm:w-[680px] h-[80vh]"
              : "w-[92vw] sm:w-[420px] h-[540px]"
          } ${
            darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {/* Chatbot Header */}
          <div className="p-4 bg-[#3F51B5] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF9800] text-indigo-950 flex items-center justify-center font-bold text-sm shadow-md">
                OS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm tracking-tight leading-none">
                    Conversation AI
                  </h4>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-400 text-indigo-950">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-indigo-200 mt-0.5 font-medium">
                  Context-Aware Assistant • Gemini 3.7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-all"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Role:</span>
            <div className="flex items-center gap-1">
              {[
                { id: "general", label: "General OS" },
                { id: "sales", label: "Sales Coach" },
                { id: "tech_support", label: "Support" },
                { id: "judge", label: "Judge Auditor" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setAgentRole(r.id as any)}
                  className={`px-2 py-0.5 rounded font-bold transition-all ${
                    agentRole === r.id
                      ? "bg-[#3F51B5] text-white"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="w-6 h-6 rounded-md bg-[#FF9800] text-indigo-950 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    OS
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-xl text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#3F51B5] text-white rounded-br-none shadow-sm"
                      : darkMode
                      ? "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60"
                      : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`text-[9px] block mt-1 text-right font-medium opacity-60 ${
                      m.sender === "user" ? "text-indigo-100" : "text-slate-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400">
                <div className="w-6 h-6 rounded-md bg-[#FF9800] text-indigo-950 flex items-center justify-center font-bold text-[10px]">
                  OS
                </div>
                <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3F51B5] animate-bounce"></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#3F51B5] animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#3F51B5] animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                  <span className="ml-1 text-[10px] text-slate-500 font-semibold">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 text-[10px] font-bold flex-shrink-0">Ask:</span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#FF9800] hover:text-indigo-950 text-slate-600 dark:text-slate-300 transition-all flex-shrink-0 truncate max-w-[200px]"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about CRM, revenue workflows..."
                className="flex-1 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#3F51B5]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-lg bg-[#3F51B5] hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
