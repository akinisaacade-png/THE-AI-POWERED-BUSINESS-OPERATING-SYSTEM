import React, { useState } from "react";
import { DocumentSigning } from "../types";
import { FileCheck, Plus, Download, CheckCircle2, Trash2, ExternalLink, Clock, Sparkles } from "lucide-react";
import { analyzeWithFlashLite } from "../services/api";

interface DocumentSigningPageProps {
  documents: DocumentSigning[];
  onAddDocument: (doc: any) => void;
  onDeleteDocument: (docId: string) => void;
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
}

export const DocumentSigningPage: React.FC<DocumentSigningPageProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onOpenDataModal,
  darkMode = false,
}) => {
  const [draftingClause, setDraftingClause] = useState(false);
  const [clausePrompt, setClausePrompt] = useState("");
  const [generatedClause, setGeneratedClause] = useState<string | null>(null);

  const handleGenerateClause = async () => {
    setDraftingClause(true);
    try {
      const res = await analyzeWithFlashLite(
        `Draft a legally sound commercial contract clause for an Enterprise B2B SaaS agreement with the requirement: "${clausePrompt || "Missed call uptime guarantee and 99.9% SMS response SLA"}".`
      );
      setGeneratedClause(res.analysis);
    } catch (e) {
      setGeneratedClause("12. SERVICE LEVEL AGREEMENT (SLA): Provider guarantees 99.9% uptime for the automated telephony engine and 8-second latency for missed call SMS text-back events.");
    } finally {
      setDraftingClause(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Document Signing &amp; Enterprise Contracts
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              Legally Binding E-Sign
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Send Master Services Agreements, proposals, and NDAs with 1-click audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDataModal("document-signing")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Send New Agreement</span>
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-5 rounded-3xl border transition-all ${
              darkMode ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    doc.status === "completed"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {doc.status}
                </span>
                <h4 className="font-extrabold text-sm mt-2 text-slate-900 dark:text-white">
                  {doc.title}
                </h4>
              </div>

              <button
                onClick={() => onDeleteDocument(doc.id)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Delete Agreement"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Signer:</span>
                <span className="font-bold text-slate-900 dark:text-white">{doc.contact_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Contract Value:</span>
                <span className="font-mono font-bold text-[#3F51B5] dark:text-indigo-400">
                  ${(doc.value ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Created:</span>
                <span className="font-mono">{doc.created_at}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <a
                href={doc.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#3F51B5] dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View E-Sign Document</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <span className="text-[10px] text-slate-400">Audit Trail SHA-256</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Contract Clause Drafter */}
      <div
        className={`p-6 rounded-3xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#FF9800]" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Flash-Lite Contract Clause Generator
          </h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={clausePrompt}
            onChange={(e) => setClausePrompt(e.target.value)}
            placeholder="Describe clause requirement (e.g. Non-disclosure, 30-day payment terms, API rate limits)..."
            className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
          />
          <button
            onClick={handleGenerateClause}
            disabled={draftingClause}
            className="px-5 py-2.5 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md"
          >
            {draftingClause ? "Drafting Clause..." : "Draft Legal Clause"}
          </button>
        </div>

        {generatedClause && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-mono whitespace-pre-line text-slate-700 dark:text-slate-200 leading-relaxed">
            {generatedClause}
          </div>
        )}
      </div>
    </div>
  );
};
