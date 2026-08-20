import React, { useState } from "react";
import { SocialPost } from "../types";
import {
  Share2,
  Plus,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  Heart,
  MessageSquare,
  Repeat,
  Send,
} from "lucide-react";
import { analyzeWithFlashLite } from "../services/api";

interface SocialPlannerPageProps {
  posts: SocialPost[];
  onAddPost: (post: any) => void;
  onDeletePost: (postId: string) => void;
  onOpenDataModal: (section?: string) => void;
  onOpenImageGen: () => void;
  darkMode?: boolean;
}

export const SocialPlannerPage: React.FC<SocialPlannerPageProps> = ({
  posts,
  onAddPost,
  onDeletePost,
  onOpenDataModal,
  onOpenImageGen,
  darkMode = false,
}) => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);

  const handleGeneratePost = async () => {
    setIsGenerating(true);
    try {
      const res = await analyzeWithFlashLite(
        `Draft an engaging LinkedIn & X (Twitter) thought leadership post about: "${topic || "Why missed phone calls cost B2B companies thousands in lost pipeline"}" with relevant hashtags.`
      );
      setGeneratedPost(res.analysis);
    } catch (e) {
      setGeneratedPost("⚡ 62% of high-intent B2B phone calls go unanswered during peak hours.\n\nBy the time sales reps dial back, the lead has already scheduled a demo with a competitor.\n\nAutonomous 8-second text-back closes this revenue leak completely. #RevenueOps #SalesAutomation");
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
              Social Media Planner &amp; Multi-Channel Scheduler
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              Omni-Network Publishing
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Auto-publish to LinkedIn, X, Facebook, and Instagram with AI copywriting and visual asset generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImageGen}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              darkMode ? "bg-slate-800 border-slate-700 text-amber-400" : "bg-white border-slate-200 text-amber-600 shadow-sm"
            }`}
          >
            Generate Post Hero Asset
          </button>
          <button
            onClick={() => onOpenDataModal("social-planner")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Scheduled Posts Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-5 rounded-3xl border transition-all ${
              darkMode ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap gap-1">
                {post.platforms.map((p, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-[#3F51B5] dark:text-indigo-300 text-[10px] font-bold"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                  {post.status}
                </span>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
              {post.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-[#3F51B5] dark:text-indigo-400" />
                <span>Scheduled: {post.scheduled_for}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px]">
                  <Heart className="w-3 h-3 text-rose-500" /> {post.engagement?.likes || 0}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Repeat className="w-3 h-3 text-emerald-500" /> {post.engagement?.shares || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Thought Leadership Drafter */}
      <div
        className={`p-6 rounded-3xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#FF9800]" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Flash-Lite Social Post &amp; Hook Drafter
          </h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (e.g. 5 reasons autonomous voice AI outperforms manual sales dials)..."
            className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
          />
          <button
            onClick={handleGeneratePost}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md"
          >
            {isGenerating ? "Drafting..." : "Generate Post"}
          </button>
        </div>

        {generatedPost && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs whitespace-pre-line text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {generatedPost}
          </div>
        )}
      </div>
    </div>
  );
};
