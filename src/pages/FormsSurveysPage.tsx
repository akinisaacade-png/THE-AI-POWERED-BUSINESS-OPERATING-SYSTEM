import React, { useState } from "react";
import { FormSurvey } from "../types";
import {
  FileText,
  Plus,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Trash2,
  Share2,
  Eye,
} from "lucide-react";

interface FormsSurveysPageProps {
  forms: FormSurvey[];
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
}

export const FormsSurveysPage: React.FC<FormsSurveysPageProps> = ({
  forms,
  onOpenDataModal,
  darkMode = false,
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Forms, Surveys &amp; Quiz Funnels
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              Smart Conditional Logic
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Capture qualified leads with multi-step qualification quizzes, dynamic fields, and automatic CRM routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDataModal("forms")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Form / Quiz</span>
          </button>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map((f) => (
          <div
            key={f.id}
            className={`p-5 rounded-3xl border transition-all ${
              darkMode ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-[#3F51B5] dark:text-indigo-300 uppercase">
                  {f.type}
                </span>
                <h4 className="font-extrabold text-sm mt-2 text-slate-900 dark:text-white">
                  {f.name || f.title}
                </h4>
              </div>

              <span className="text-[11px] font-bold text-emerald-600 font-mono">
                {f.conversion_rate}% Conversion
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-700/60 text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Submissions</div>
                <div className="font-black text-slate-800 dark:text-white mt-0.5">
                  {f.submissions ?? f.responses_count ?? 140}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Fields</div>
                <div className="font-black text-slate-800 dark:text-white mt-0.5">
                  {(f.fields || []).length || 4}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Routing</div>
                <div className="font-black text-[#3F51B5] dark:text-indigo-400 mt-0.5">CRM Tag</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {(f.fields || [
                { label: "Full Name", type: "text" },
                { label: "Company Phone", type: "tel" },
                { label: "Monthly Revenue", type: "select" },
              ]).map((fld, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[10px] font-semibold"
                >
                  {fld.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
