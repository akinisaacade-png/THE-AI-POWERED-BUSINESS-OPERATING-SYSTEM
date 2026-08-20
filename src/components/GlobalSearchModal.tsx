import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Kanban, Users, PhoneCall, Workflow, Megaphone, Star, Globe, CreditCard } from "lucide-react";
import { navItems } from "./Sidebar";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  contacts: any[];
  deals: any[];
  workflows: any[];
  campaigns: any[];
  darkMode?: boolean;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  contacts,
  deals,
  workflows,
  campaigns,
  darkMode = false,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search Navigation Nodes
  const matchingNavs = navItems.filter(
    (item) => item.label.toLowerCase().includes(cleanQuery) || item.id.toLowerCase().includes(cleanQuery)
  );

  // Search Contacts
  const matchingContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(cleanQuery) ||
      c.email.toLowerCase().includes(cleanQuery) ||
      c.company_name?.toLowerCase().includes(cleanQuery) ||
      c.tags?.some((t: string) => t.toLowerCase().includes(cleanQuery))
  );

  // Search Deals
  const matchingDeals = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(cleanQuery) ||
      d.contact_name.toLowerCase().includes(cleanQuery) ||
      d.stage.toLowerCase().includes(cleanQuery)
  );

  // Search Workflows
  const matchingWorkflows = workflows.filter(
    (w) =>
      w.name.toLowerCase().includes(cleanQuery) ||
      w.trigger_event.toLowerCase().includes(cleanQuery) ||
      w.judge_verdict.toLowerCase().includes(cleanQuery)
  );

  // Search Campaigns
  const matchingCampaigns = campaigns.filter(
    (cmp) => cmp.name.toLowerCase().includes(cleanQuery) || cmp.channel.toLowerCase().includes(cleanQuery)
  );

  const handleSelect = (tabId: string) => {
    onNavigate(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div
        id="global-search-modal-container"
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#3F51B5] dark:text-indigo-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search campaigns, system nodes, contacts, deals, automations, or reviews..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium focus:outline-none placeholder-slate-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Navigation Pages */}
          {matchingNavs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                System Modules & Navigation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchingNavs.slice(0, 6).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                        darkMode
                          ? "bg-slate-800/60 border-slate-700/60 hover:bg-[#3F51B5] hover:text-white"
                          : "bg-slate-50 border-slate-200/80 hover:bg-[#3F51B5] hover:text-white hover:border-[#3F51B5]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contacts */}
          {matchingContacts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Contacts ({matchingContacts.length})
              </div>
              <div className="space-y-1">
                {matchingContacts.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect("contacts")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                      darkMode
                        ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800"
                        : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#3F51B5] dark:text-indigo-400">{c.name}</span>
                      <span className="text-slate-400 ml-2">({c.company_name || c.email})</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-[#FF9800] font-bold">
                      {c.source}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deals */}
          {matchingDeals.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Pipeline Deals ({matchingDeals.length})
              </div>
              <div className="space-y-1">
                {matchingDeals.slice(0, 4).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect("crm-pipeline")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                      darkMode
                        ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800"
                        : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <span className="font-bold">{d.title}</span>
                      <span className="text-[#3F51B5] dark:text-indigo-400 font-bold ml-2">
                        ${(d.value ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-[#3F51B5] dark:text-indigo-300 font-bold uppercase">
                      {d.stage.replace("_", " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Automations */}
          {matchingWorkflows.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Workflows ({matchingWorkflows.length})
              </div>
              <div className="space-y-1">
                {matchingWorkflows.slice(0, 3).map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleSelect("automation")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                      darkMode
                        ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800"
                        : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <span className="font-bold">{w.name}</span>
                      <span className="text-slate-400 ml-2">Trigger: {w.trigger_event}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      {w.judge_verdict}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingNavs.length === 0 &&
            matchingContacts.length === 0 &&
            matchingDeals.length === 0 &&
            matchingWorkflows.length === 0 &&
            matchingCampaigns.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                No matching system nodes, campaigns, or records found for &quot;{query}&quot;.
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
