import React, { useState } from "react";
import { Review } from "../types";
import {
  Star,
  Plus,
  Sparkles,
  CheckCircle2,
  Trash2,
  Send,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { analyzeWithFlashLite } from "../services/api";

interface ReputationPageProps {
  reviews: Review[];
  onAddReview: (review: any) => void;
  onDeleteReview: (reviewId: string) => void;
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
}

export const ReputationPage: React.FC<ReputationPageProps> = ({
  reviews,
  onAddReview,
  onDeleteReview,
  onOpenDataModal,
  darkMode = false,
}) => {
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [aiDraft, setAiDraft] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const avgRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(2);

  const handleGenerateReply = async (review: Review) => {
    setActiveReviewId(review.id);
    setIsGenerating(true);
    try {
      const res = await analyzeWithFlashLite(
        `Generate a professional, warm, and brand-building public reply to this 5-star customer review from ${review.author_name}: "${review.text}" on ${review.source}.`
      );
      setAiDraft(res.analysis);
    } catch (e) {
      setAiDraft(`Thank you so much ${review.author_name}! We are thrilled to empower your business operations and revenue growth.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Reputation &amp; Review Management
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-indigo-950">
              ★ {avgRating} Average (142 Total)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated Google &amp; Facebook review collection with 1-click AI response generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDataModal("reputation")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add / Import Review</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`p-5 rounded-3xl border transition-all ${
              darkMode ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {rev.author_name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-[#3F51B5] dark:text-indigo-300 font-bold">
                    {rev.source}
                  </span>
                </div>
                <div className="text-amber-400 text-xs mt-1">
                  {"★".repeat(Math.floor(rev.rating))}
                  <span className="text-slate-400 text-[10px] ml-2 font-mono">{rev.date}</span>
                </div>
              </div>

              <button
                onClick={() => onDeleteReview(rev.id)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Delete Review"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic">
              &quot;{rev.text}&quot;
            </p>

            {/* AI Auto-Response Section */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              {rev.responded && rev.ai_response ? (
                <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs">
                  <div className="flex items-center gap-1.5 text-[#3F51B5] dark:text-indigo-300 font-bold text-[11px] mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Public Response (AI Published):</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-[11px]">{rev.ai_response}</p>
                </div>
              ) : (
                <div>
                  {activeReviewId === rev.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={aiDraft}
                        onChange={(e) => setAiDraft(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            rev.responded = true;
                            rev.ai_response = aiDraft;
                            setActiveReviewId(null);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#3F51B5] text-white text-xs font-bold hover:bg-indigo-700 transition-all"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerateReply(rev)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#3F51B5] dark:text-indigo-400 hover:text-[#FF9800]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FF9800]" />
                      <span>Draft AI Response</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
