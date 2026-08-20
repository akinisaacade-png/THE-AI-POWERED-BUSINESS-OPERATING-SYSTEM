import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Globe2,
  Volume2,
  X,
  Sparkles,
  CheckCircle2,
  Copy,
  Download,
  RotateCcw,
  Languages,
  UserPlus,
  Briefcase,
  ArrowRight,
  BrainCircuit,
  Tag,
  Check,
  CalendarCheck,
  Clock,
  AlertCircle,
  FileText,
  Target,
  Zap,
} from "lucide-react";
import { transcribeAndTranslate, parseVoiceNoteWithGemini } from "../services/api";
import { Contact, Deal, CRMTask } from "../types";

interface AudioTranscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact?: (contact: Contact) => void;
  onAddDeal?: (deal: Deal) => void;
  onAddTask?: (task: CRMTask) => void;
  darkMode?: boolean;
}

const WORLD_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish (Español)", flag: "🇪🇸" },
  { code: "fr", name: "French (Français)", flag: "🇫🇷" },
  { code: "de", name: "German (Deutsch)", flag: "🇩🇪" },
  { code: "ja", name: "Japanese (日本語)", flag: "🇯🇵" },
  { code: "zh", name: "Chinese (中文 - 普通话)", flag: "🇨🇳" },
  { code: "ar", name: "Arabic (العربية)", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese (Português)", flag: "🇧🇷" },
  { code: "hi", name: "Hindi (हिन्दी)", flag: "🇮🇳" },
  { code: "it", name: "Italian (Italiano)", flag: "🇮🇹" },
  { code: "ko", name: "Korean (한국어)", flag: "🇰🇷" },
  { code: "nl", name: "Dutch (Nederlands)", flag: "🇳🇱" },
];

const PRESET_CALL_SCENARIOS = [
  {
    id: "scenario-1",
    label: "Enterprise Deal ($28.5k)",
    intent: "deal",
    text: "Hello, this is Sarah from Acme Holdings calling about the Enterprise Revenue OS deployment. We have 45 sales reps ready to onboard and need to integrate our Stripe billing and Google Ads manager right away. Expected deal size is $28,500. Let's send a proposal.",
  },
  {
    id: "scenario-2",
    label: "Urgent Meeting & Demo Task",
    intent: "task",
    text: "Hey Alex, following up from our webinar. We need to schedule a product demo next Tuesday at 2 PM for our VP of Growth. Please prepare the slide deck and send the calendar invite ASAP.",
  },
  {
    id: "scenario-3",
    label: "Contract Upgrade ($42k) & Onboarding",
    intent: "both",
    text: "Hi Elena, this is Marcus at Vanguard Tech. We want to finalize the $42,000 contract expansion for our 50 enterprise seats before end of month. Please send over the revised agreement and set up an onboarding session for Friday.",
  },
];

export const AudioTranscriberModal: React.FC<AudioTranscriberModalProps> = ({
  isOpen,
  onClose,
  onAddContact,
  onAddDeal,
  onAddTask,
  darkMode = false,
}) => {
  const [selectedLang, setSelectedLang] = useState("es");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audioFeedSource, setAudioFeedSource] = useState<"mic" | "demo_call">("demo_call");

  const [originalText, setOriginalText] = useState(
    PRESET_CALL_SCENARIOS[0].text
  );

  const [translatedText, setTranslatedText] = useState(
    "Hola, soy Sarah de Acme Holdings y llamo sobre el despliegue del OS de ingresos Enterprise. Tenemos 45 representantes de ventas listos para incorporarse y necesitamos integrar nuestra facturación de Stripe y el administrador de Google Ads de inmediato."
  );

  const [entities, setEntities] = useState<string[]>([
    "Acme Holdings",
    "45 Sales Reps",
    "Stripe Billing",
    "Google Ads Manager",
    "$28,500 Budget",
    "Enterprise License",
  ]);

  // Detected Business Keywords & Intent
  const [detectedDealIntent, setDetectedDealIntent] = useState<boolean>(true);
  const [detectedTaskIntent, setDetectedTaskIntent] = useState<boolean>(false);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);

  // Action status indicators
  const [dealCreated, setDealCreated] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);
  const [contactCreated, setContactCreated] = useState(false);

  // Suggested values derived from text
  const [proposedDeal, setProposedDeal] = useState<{
    title: string;
    company: string;
    contactName: string;
    value: number;
    stage: "qualified" | "proposal" | "negotiation";
    probability: number;
    notes: string;
  }>({
    title: "Acme Holdings - Enterprise License",
    company: "Acme Holdings",
    contactName: "Sarah Jenkins",
    value: 28500,
    stage: "proposal",
    probability: 85,
    notes: "45 sales reps onboarding with Stripe and Google Ads integration.",
  });

  const [proposedTask, setProposedTask] = useState<{
    title: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
    assignee: string;
  }>({
    title: "Prepare Enterprise Proposal & Schedule Onboarding Demo",
    dueDate: "Tomorrow by 5:00 PM",
    priority: "high",
    assignee: "Alex Mercer",
  });

  // Automated Keyword & Intent Engine
  useEffect(() => {
    const text = originalText.toLowerCase();

    // Deal Keywords: deal, budget, quote, proposal, contract, enterprise, reps, $, dollars, license, agreement
    const dealKeywords = [
      "deal",
      "budget",
      "proposal",
      "contract",
      "enterprise",
      "seats",
      "agreement",
      "license",
      "pricing",
      "$",
      "28,500",
      "42,000",
      "expansion",
    ];

    // Task Keywords: follow up, schedule, demo, calendar, invite, slide deck, meeting, prepare, asap, tuesday, friday, onboarding
    const taskKeywords = [
      "follow up",
      "schedule",
      "demo",
      "calendar",
      "invite",
      "deck",
      "meeting",
      "prepare",
      "asap",
      "onboarding",
      "tuesday",
      "friday",
      "review",
      "call back",
    ];

    const matchedDealKeys = dealKeywords.filter((k) => text.includes(k));
    const matchedTaskKeys = taskKeywords.filter((k) => text.includes(k));

    const hasDealIntent = matchedDealKeys.length > 0;
    const hasTaskIntent = matchedTaskKeys.length > 0;

    setDetectedDealIntent(hasDealIntent);
    setDetectedTaskIntent(hasTaskIntent);
    setMatchedKeywords([...new Set([...matchedDealKeys, ...matchedTaskKeys])]);

    // Extract Deal details dynamically
    let val = 25000;
    const dollarMatch = originalText.match(/\$([0-9,]+)/);
    if (dollarMatch && dollarMatch[1]) {
      val = parseInt(dollarMatch[1].replace(/,/g, ""), 10);
    } else if (text.includes("42,000") || text.includes("42000")) {
      val = 42000;
    } else if (text.includes("28,500") || text.includes("28500")) {
      val = 28500;
    }

    let company = "Acme Holdings";
    if (text.includes("vanguard")) company = "Vanguard Tech Labs";
    else if (text.includes("lumina")) company = "Lumina Health Systems";
    else if (text.includes("crestwood")) company = "Crestwood Logistics";

    let contactName = "Sarah Jenkins";
    if (text.includes("marcus")) contactName = "Marcus Thorne";
    else if (text.includes("alex")) contactName = "Alex Mercer";
    else if (text.includes("elena")) contactName = "Elena Rostova";

    setProposedDeal({
      title: `${company} - Enterprise License Expansion`,
      company,
      contactName,
      value: val,
      stage: text.includes("finalize") || text.includes("contract") ? "negotiation" : "proposal",
      probability: val > 40000 ? 90 : 80,
      notes: `Extracted from voice transcript: ${originalText.slice(0, 100)}...`,
    });

    // Extract Task details dynamically
    let taskTitle = `Follow up with ${contactName}: Send proposal & schedule demo`;
    if (text.includes("slide deck") || text.includes("deck")) {
      taskTitle = `Prepare custom slide deck & send calendar invite to ${contactName}`;
    } else if (text.includes("onboarding")) {
      taskTitle = `Set up onboarding session & dispatch enterprise agreement for ${company}`;
    }

    setProposedTask({
      title: taskTitle,
      dueDate: text.includes("asap") ? "Today (Urgent)" : text.includes("tuesday") ? "Next Tuesday at 2 PM" : "Within 24 Hours",
      priority: text.includes("asap") || text.includes("urgent") || val > 30000 ? "high" : "medium",
      assignee: "Alex Mercer",
    });
  }, [originalText]);

  if (!isOpen) return null;

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLang(langCode);
    const langObj = WORLD_LANGUAGES.find((l) => l.code === langCode);
    setIsProcessing(true);
    try {
      const res = await transcribeAndTranslate(langCode, langObj?.name || "English", originalText);
      if (res.translatedTranscript) {
        setTranslatedText(res.translatedTranscript);
      }
      if (res.detectedEntities) {
        setEntities(res.detectedEntities);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleLanguageChange(selectedLang);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${originalText}\n\n[Translation (${selectedLang})]:\n${translatedText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1-Click Create Contact Action
  const handleCreateContact = () => {
    const newContact: Contact = {
      id: `cnt-${Date.now()}`,
      name: proposedDeal.contactName,
      email: `${proposedDeal.contactName.toLowerCase().replace(" ", ".")}@${proposedDeal.company.toLowerCase().replace(/\s+/g, "")}.com`,
      phone: "+1 (555) 382-9910",
      company_name: proposedDeal.company,
      tags: ["Voice Lead", "Enterprise", "High-Intent"],
      source: "Voice Note AI Parser",
      owner_id: "usr-1",
      owner_name: "Alex Mercer",
      status: "Lead",
      notes: `Extracted from voice transcript: ${originalText}`,
      created_at: new Date().toISOString().slice(0, 10),
      win_probability: proposedDeal.probability,
      churn_risk: "Low",
      ai_next_action: "Send calendar demo invitation & customized pricing deck.",
      lead_score: 92,
      lead_tier: "Hot",
      interactions: {
        calls_count: 2,
        emails_opened: 4,
        emails_replied: 2,
        website_visits: 8,
      },
    };
    if (onAddContact) {
      onAddContact(newContact);
    }
    setContactCreated(true);
  };

  // 1-Click Create Proposed Deal Action
  const handleCreateDeal = () => {
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      contact_id: `cnt-${Date.now()}`,
      title: proposedDeal.title,
      company_name: proposedDeal.company,
      contact_name: proposedDeal.contactName,
      value: proposedDeal.value,
      stage: proposedDeal.stage,
      probability: proposedDeal.probability,
      close_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      owner_name: "Alex Mercer",
      ai_insights: {
        churn_risk: "Low",
        win_probability: proposedDeal.probability,
        next_best_action: `Deliver custom onboarding proposal to ${proposedDeal.contactName} within 2 business hours.`,
        reasoning: `High intent business keywords (${matchedKeywords.join(", ")}) detected in voice note.`,
      },
    };
    if (onAddDeal) {
      onAddDeal(newDeal);
    }
    setDealCreated(true);
  };

  // 1-Click Create Proposed Task Action
  const handleCreateTask = () => {
    const newTask: CRMTask = {
      id: `task-${Date.now()}`,
      title: proposedTask.title,
      contact_name: proposedDeal.contactName,
      due_date: proposedTask.dueDate,
      priority: proposedTask.priority,
      completed: false,
      source: "Voice Note Intent Detector",
    };
    if (onAddTask) {
      onAddTask(newTask);
    }
    setTaskCreated(true);
  };

  const currentLangObj = WORLD_LANGUAGES.find((l) => l.code === selectedLang) || WORLD_LANGUAGES[0];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        id="audio-transcriber-modal-container"
        className={`w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
          darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#3F51B5] to-indigo-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF9800] text-indigo-950 flex items-center justify-center font-black text-xl shadow-lg">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  Voice Transcriber &amp; Autonomous Intent Detector
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-indigo-950">
                  Real-Time NLP
                </span>
              </div>
              <p className="text-xs text-indigo-100/90 mt-0.5">
                Automatically detects business keywords to propose pipeline Deals and CRM follow-up Tasks.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          {/* Preset Scenario Quick Selectors */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9800]" />
                <span>Test Voice Scenarios with Keyword Triggers:</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_CALL_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setOriginalText(sc.text);
                    setDealCreated(false);
                    setTaskCreated(false);
                    setContactCreated(false);
                    handleLanguageChange(selectedLang);
                  }}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all ${
                    originalText === sc.text
                      ? "bg-indigo-50 dark:bg-indigo-950/80 border-[#3F51B5] text-[#3F51B5] dark:text-indigo-300 ring-1 ring-[#3F51B5]"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold">{sc.label}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border text-slate-500">
                      {sc.intent}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Top Control Bar: Language & Mic Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* World Language Dropdown */}
            <div
              className={`p-3 rounded-2xl border ${
                darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            >
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-[#3F51B5] dark:text-indigo-400" />
                <span>Target Translation Language</span>
              </label>
              <select
                id="select-world-language"
                value={selectedLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white"
                    : "bg-white border-slate-300 text-slate-800 shadow-xs"
                }`}
              >
                {WORLD_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mic / Live Recording Controls */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between ${
                darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                  Live Audio Simulation
                </label>
                <span className="text-xs font-medium text-slate-400">
                  {isRecording ? "Listening & streaming audio..." : "Speak or record simulated stream"}
                </span>
              </div>
              <button
                id="btn-trigger-live-audio-record"
                onClick={handleToggleRecord}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-xs ${
                  isRecording
                    ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse"
                    : "bg-[#3F51B5] hover:bg-indigo-700 text-white"
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Simulate Voice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-Time Keyword & Intent Detection Banner */}
          <div
            className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              detectedDealIntent || detectedTaskIntent
                ? darkMode
                  ? "bg-indigo-950/40 border-indigo-700"
                  : "bg-indigo-50 border-indigo-200 shadow-xs"
                : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FF9800] text-indigo-950 flex items-center justify-center font-bold text-xs">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#3F51B5] dark:text-indigo-300">
                    Detected Business Intent:
                  </span>
                  {detectedDealIntent && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      💼 Pipeline Deal Opportunity
                    </span>
                  )}
                  {detectedTaskIntent && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-[#FF9800] text-[10px] font-bold">
                      📅 Actionable CRM Task
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[11px] text-slate-400 font-medium">Matched Triggers:</span>
                  {matchedKeywords.map((k, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold"
                    >
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {matchedKeywords.length} keywords triggered
            </div>
          </div>

          {/* Dual Transcription Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Audio Feed Transcript */}
            <div
              className={`p-4 rounded-2xl border ${
                darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/60 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F51B5] dark:text-indigo-400">
                  🇺🇸 Voice Transcript (Editable)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
              </div>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                rows={3}
                className="w-full text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-transparent border-none focus:outline-none resize-none"
                placeholder="Type or speak transcript here..."
              />
            </div>

            {/* Real-Time Translated Feed */}
            <div
              className={`p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 ${
                darkMode ? "bg-indigo-950/20" : "bg-indigo-50/50"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 dark:border-indigo-800/60 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F51B5] dark:text-indigo-300 flex items-center gap-1.5">
                  <span>{currentLangObj.flag}</span>
                  <span>Live Translation ({currentLangObj.name})</span>
                </span>
                {isProcessing && (
                  <span className="text-[10px] text-[#FF9800] font-bold animate-pulse">
                    Translating...
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-800 dark:text-indigo-100 font-medium min-h-[60px]">
                {translatedText}
              </p>
            </div>
          </div>

          {/* ACTION PROPOSALS SECTION (Auto-proposed Deals & Tasks) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#FF9800]" />
                <span>Autonomous Action Proposals based on Voice Intent:</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">1-Click Execution</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Proposed Deal Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  detectedDealIntent
                    ? darkMode
                      ? "bg-slate-800/90 border-emerald-500/50 shadow-md"
                      : "bg-white border-emerald-400 shadow-sm"
                    : "opacity-60 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900 dark:text-white">
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    <span>Proposed Pipeline Deal</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                    {proposedDeal.probability}% Probability
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="font-black text-slate-900 dark:text-white text-sm">
                    {proposedDeal.title}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-[#3F51B5] dark:text-indigo-400 font-mono">
                      ${(proposedDeal.value ?? 0).toLocaleString()} USD
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize">
                      Stage: {proposedDeal.stage}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {proposedDeal.notes}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                  <button
                    onClick={handleCreateContact}
                    disabled={contactCreated}
                    className="text-[11px] font-bold text-[#3F51B5] dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {contactCreated ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Contact Added
                      </span>
                    ) : (
                      <span>+ Save Contact</span>
                    )}
                  </button>

                  <button
                    id="btn-create-proposed-deal"
                    onClick={handleCreateDeal}
                    disabled={dealCreated}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      dealCreated
                        ? "bg-emerald-500 text-white cursor-default"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {dealCreated ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Deal Added to Pipeline!</span>
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Create Deal (${(proposedDeal.value ?? 0).toLocaleString()})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 2. Proposed Task / Follow-Up Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  detectedTaskIntent
                    ? darkMode
                      ? "bg-slate-800/90 border-[#FF9800]/50 shadow-md"
                      : "bg-white border-[#FF9800] shadow-sm"
                    : "opacity-60 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900 dark:text-white">
                    <CalendarCheck className="w-4 h-4 text-[#FF9800]" />
                    <span>Proposed Follow-Up Task</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                      proposedTask.priority === "high"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {proposedTask.priority} Priority
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {proposedTask.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-[#3F51B5]" />
                    <span>Due: {proposedTask.dueDate}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Assigned to: {proposedTask.assignee}
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Auto-linked to CRM Calendar
                  </span>

                  <button
                    id="btn-create-proposed-task"
                    onClick={handleCreateTask}
                    disabled={taskCreated}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      taskCreated
                        ? "bg-emerald-500 text-white cursor-default"
                        : "bg-[#FF9800] hover:bg-amber-500 text-indigo-950"
                    }`}
                  >
                    {taskCreated ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Task Created in CRM!</span>
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>Create Follow-up Task</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold transition-all"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied to Clipboard!" : "Copy Transcripts"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#3F51B5] text-white font-bold hover:bg-indigo-700 transition-all shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
