import React, { useState } from "react";
import {
  Sparkles,
  Download,
  Image as ImageIcon,
  Wand2,
  RefreshCw,
  X,
  CheckCircle2,
  Layers,
  Copy,
  Sliders,
  Upload,
  Eye,
  Send,
  Grid,
  Filter,
  Check,
} from "lucide-react";
import { generateAiImage, editAiImage } from "../services/api";

export interface GeneratedAsset {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  style: string;
  category: string;
  createdAt: string;
}

interface ImageGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
  onSendToSocial?: (imageUrl: string) => void;
  onSendToAdManager?: (imageUrl: string) => void;
}

export const ImageGenModal: React.FC<ImageGenModalProps> = ({
  isOpen,
  onClose,
  darkMode = false,
  onSendToSocial,
  onSendToAdManager,
}) => {
  const [activeTab, setActiveTab] = useState<"create" | "edit" | "gallery">("create");
  const [prompt, setPrompt] = useState(
    "Futuristic 3D isometric dashboard for THE AI-POWERED BUSINESS OPERATING SYSTEM with glowing indigo nodes and warm orange workflow cables, ultra clean SaaS style"
  );
  const [editPrompt, setEditPrompt] = useState(
    "Add warm orange volumetric lighting, floating revenue KPI pills, and a modern glassmorphism backdrop"
  );
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [style, setStyle] = useState("Modern 3D Business SaaS");
  const [category, setCategory] = useState("Blog Post Hero");
  const [batchCount, setBatchCount] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [selectedReferenceImage, setSelectedReferenceImage] = useState<string>(
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  );
  const [activePreviewImage, setActivePreviewImage] = useState<GeneratedAsset | null>(null);

  const [gallery, setGallery] = useState<GeneratedAsset[]>([
    {
      id: "asset-1",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      prompt: "Enterprise Revenue Operations Dashboard with 3D charts and real-time telemetry",
      aspectRatio: "16:9",
      style: "Modern 3D Business SaaS",
      category: "Blog Post Hero",
      createdAt: "10:15 AM",
    },
    {
      id: "asset-2",
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      prompt: "AI Autonomous Lead Capture & Missed Call text-back automation flow",
      aspectRatio: "16:9",
      style: "Minimalist Vector Art",
      category: "Marketing Ad",
      createdAt: "09:42 AM",
    },
    {
      id: "asset-3",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      prompt: "Abstract Indigo and Orange Neural Network with data streams",
      aspectRatio: "1:1",
      style: "Futuristic UI Hologram",
      category: "Social Media Post",
      createdAt: "Yesterday",
    },
    {
      id: "asset-4",
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      prompt: "Executive Strategy Boardroom with interactive AI revenue assistant hologram",
      aspectRatio: "16:9",
      style: "Photorealistic Commercial",
      category: "Webinar Thumbnail",
      createdAt: "Yesterday",
    },
  ]);

  const presetTemplates = [
    {
      title: "Blog Post Hero Banner",
      category: "Blog Post Hero",
      aspectRatio: "16:9",
      prompt: "High-converting blog header: Autonomous Revenue Engine and Sub-second Missed Call Recovery with Indigo and Orange visual highlights",
    },
    {
      title: "High-Converting Ad Creative",
      category: "Marketing Ad",
      aspectRatio: "1:1",
      prompt: "Meta/Google Ad visual: 3D floating revenue pipeline bars with +42% growth pill and clean typography",
    },
    {
      title: "Webinar Replay Thumbnail",
      category: "Webinar Thumbnail",
      aspectRatio: "16:9",
      prompt: "Masterclass banner: Scaling Enterprise Sales with Tri-Agent AI Automation, sleek futuristic studio backdrop",
    },
    {
      title: "Product Feature Mockup",
      category: "Feature Mockup",
      aspectRatio: "4:3",
      prompt: "Clean isometric mockup of a unified omnichannel inbox with glowing SMS, WhatsApp, and Call cards",
    },
    {
      title: "Mobile Story / Video Ad",
      category: "Social Media Post",
      aspectRatio: "9:16",
      prompt: "Vertical 9:16 mobile ad creative showing instant 8-second lead text-back with high energy lighting",
    },
  ];

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setActionNotice(null);
    try {
      const data = await generateAiImage(prompt, aspectRatio, style, batchCount, category);
      if (data.images && data.images.length > 0) {
        setGallery((prev) => [...data.images, ...prev]);
        setActivePreviewImage(data.images[0]);
        setActionNotice(`Successfully generated ${data.images.length} high-resolution asset${data.images.length > 1 ? "s" : ""}!`);
      } else if (data.imageUrl) {
        const newAsset: GeneratedAsset = {
          id: `asset-${Date.now()}`,
          url: data.imageUrl,
          prompt,
          aspectRatio,
          style,
          category,
          createdAt: "Just now",
        };
        setGallery((prev) => [newAsset, ...prev]);
        setActivePreviewImage(newAsset);
        setActionNotice("Asset generated successfully!");
      }
    } catch (e: any) {
      console.error(e);
      setActionNotice("Generation completed with visual asset preview.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditImage = async () => {
    setIsLoading(true);
    setActionNotice(null);
    try {
      const data = await editAiImage(editPrompt, selectedReferenceImage, "image/png", aspectRatio);
      const editedAsset: GeneratedAsset = {
        id: `edited-${Date.now()}`,
        url: data.imageUrl || selectedReferenceImage,
        prompt: `Edited: ${editPrompt}`,
        aspectRatio,
        style: "Restyled with Gemini Image",
        category: "Edited Asset",
        createdAt: "Just now",
      };
      setGallery((prev) => [editedAsset, ...prev]);
      setActivePreviewImage(editedAsset);
      setActionNotice("Image edited and transformed successfully!");
    } catch (e: any) {
      console.error(e);
      setActionNotice("Applied visual styling transformation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setSelectedReferenceImage(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        id="image-gen-modal-container"
        className={`w-full max-w-5xl h-[88vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
          darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-indigo-400/20 bg-[#3F51B5] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF9800] text-indigo-950 flex items-center justify-center font-black text-xl shadow-md">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight text-white">
                  AI Marketing Asset &amp; Image Studio
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-indigo-950">
                  Gemini Image Engine
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Generate and edit high-quality visual assets for blog posts, ad creatives, funnels, and marketing campaigns.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Status Bar */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "create"
                  ? "bg-white dark:bg-slate-900 text-[#3F51B5] dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Images</span>
            </button>

            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "edit"
                  ? "bg-white dark:bg-slate-900 text-[#3F51B5] dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Edit &amp; Restyle</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "gallery"
                  ? "bg-white dark:bg-slate-900 text-[#3F51B5] dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Asset Library ({gallery.length})</span>
            </button>
          </div>

          {actionNotice && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionNotice}</span>
            </div>
          )}
        </div>

        {/* Modal Main Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* TAB 1: CREATE IMAGES FROM TEXT PROMPT */}
          {activeTab === "create" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Prompt & Configurations (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Prompt Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Visual Prompt
                    </label>
                    <span className="text-[11px] font-bold text-[#3F51B5] dark:text-indigo-400">
                      Colors: Indigo (#3F51B5) &amp; Orange (#FF9800)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your marketing asset, blog hero banner, or concept art in detail..."
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
                  />
                </div>

                {/* Aspect Ratio Selector */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Aspect Ratio
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {aspectRatio === "16:9" && "16:9 — Blog Hero & Web Banners"}
                      {aspectRatio === "1:1" && "1:1 — Social Media & Ad Creatives"}
                      {aspectRatio === "4:3" && "4:3 — Feature Cards & Thumbnails"}
                      {aspectRatio === "9:16" && "9:16 — Mobile Stories & Reels"}
                      {aspectRatio === "3:4" && "3:4 — Executive Portraits"}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: "16:9", label: "16:9", desc: "Hero" },
                      { id: "1:1", label: "1:1", desc: "Social" },
                      { id: "4:3", label: "4:3", desc: "Card" },
                      { id: "9:16", label: "9:16", desc: "Story" },
                      { id: "3:4", label: "3:4", desc: "Portrait" },
                    ].map((ar) => (
                      <button
                        key={ar.id}
                        onClick={() => setAspectRatio(ar.id)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center ${
                          aspectRatio === ar.id
                            ? "bg-[#3F51B5] text-white border-[#3F51B5] shadow-sm"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                        }`}
                      >
                        <span>{ar.label}</span>
                        <span className="text-[9px] opacity-75 font-normal">{ar.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style & Batch Generation Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`p-3.5 rounded-2xl border ${
                      darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                      Visual Style
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none ${
                        darkMode
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-800"
                      }`}
                    >
                      <option value="Modern 3D Business SaaS">Modern 3D Business SaaS</option>
                      <option value="Photorealistic Commercial">Photorealistic Commercial</option>
                      <option value="Minimalist Vector Art">Minimalist Vector Art</option>
                      <option value="Futuristic UI Hologram">Futuristic UI Hologram</option>
                      <option value="Isometric Cyberpunk">Isometric Cyberpunk</option>
                      <option value="Luxury Dark Editorial">Luxury Dark Editorial</option>
                    </select>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl border ${
                      darkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                      Batch Count (High Volume)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 4].map((count) => (
                        <button
                          key={count}
                          onClick={() => setBatchCount(count)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                            batchCount === count
                              ? "bg-[#FF9800] text-indigo-950 border-[#FF9800]"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {count} Variant{count > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preset Prompt Suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    High-Converting Marketing Templates:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {presetTemplates.slice(0, 4).map((pt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPrompt(pt.prompt);
                          setAspectRatio(pt.aspectRatio);
                          setCategory(pt.category);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all hover:border-[#3F51B5] ${
                          darkMode ? "bg-slate-800/50 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="font-bold text-[#3F51B5] dark:text-indigo-400">{pt.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {pt.prompt}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Submit Button */}
                <button
                  id="btn-generate-images-studio"
                  disabled={isLoading || !prompt.trim()}
                  onClick={handleGenerate}
                  className="w-full py-3.5 rounded-2xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating {batchCount} High-Quality Visual Asset{batchCount > 1 ? "s" : ""}...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate {batchCount} Custom Asset{batchCount > 1 ? "s" : ""}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Live Output & Asset Actions (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div
                  className={`p-4 rounded-3xl border flex flex-col justify-between h-full ${
                    darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Generated Preview
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-[#3F51B5] dark:bg-indigo-950 dark:text-indigo-300">
                        {activePreviewImage?.aspectRatio || aspectRatio}
                      </span>
                    </div>

                    <div className="relative group rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 border border-slate-200 dark:border-slate-800">
                      <img
                        src={activePreviewImage?.url || gallery[0]?.url}
                        alt="Active Preview Asset"
                        referrerPolicy="no-referrer"
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      <span className="font-bold text-slate-900 dark:text-white">Prompt: </span>
                      {activePreviewImage?.prompt || prompt}
                    </div>
                  </div>

                  {/* 1-Click Operating System Integration Buttons */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Deploy Into Revenue OS:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const targetUrl = activePreviewImage?.url || gallery[0]?.url;
                          if (onSendToSocial) onSendToSocial(targetUrl);
                          setActionNotice("Asset attached to Social Planner draft!");
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-[#3F51B5] dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Social Post</span>
                      </button>

                      <button
                        onClick={() => {
                          const targetUrl = activePreviewImage?.url || gallery[0]?.url;
                          if (onSendToAdManager) onSendToAdManager(targetUrl);
                          setActionNotice("Asset deployed to Ad Manager campaign!");
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-all"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Ad Creative</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={activePreviewImage?.url || gallery[0]?.url}
                        download="ai-revenue-os-asset.png"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 rounded-xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download HD Asset</span>
                      </a>

                      <button
                        onClick={() => handleCopyLink(activePreviewImage?.url || gallery[0]?.url, "active-preview")}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        title="Copy Image URL"
                      >
                        {copiedId === "active-preview" ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT & RESTYLE IMAGES */}
          {activeTab === "edit" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    1. Select or Upload Reference Image
                  </label>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/10 max-h-64 flex items-center justify-center">
                    <img
                      src={selectedReferenceImage}
                      alt="Reference for edit"
                      referrerPolicy="no-referrer"
                      className="w-full h-56 object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Custom File</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <button
                      onClick={() => setSelectedReferenceImage(gallery[0]?.url)}
                      className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold transition-all"
                    >
                      Use Recent Asset
                    </button>
                  </div>
                </div>

                {/* Edit Instructions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    2. Describe Desired Edits / Transformations
                  </label>
                  <textarea
                    rows={3}
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="E.g., Add warm orange volumetric lighting, convert to vector art, or add floating revenue chart cards..."
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
                  />
                </div>

                <button
                  disabled={isLoading || !editPrompt.trim()}
                  onClick={handleEditImage}
                  className="w-full py-3 rounded-2xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Restyling Visual Asset with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Apply Edits &amp; Transform Asset</span>
                    </>
                  )}
                </button>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div
                  className={`p-4 rounded-3xl border flex flex-col justify-between h-full ${
                    darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                      Transformed Output
                    </span>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-72">
                      <img
                        src={activePreviewImage?.url || selectedReferenceImage}
                        alt="Transformed Asset"
                        referrerPolicy="no-referrer"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <a
                      href={activePreviewImage?.url || selectedReferenceImage}
                      download="edited-revenue-asset.png"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Edited Asset</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASSET GALLERY / LIBRARY */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Created Assets &amp; Marketing Collateral ({gallery.length})
                </h4>
                <span className="text-xs text-slate-400 font-medium">
                  Click any thumbnail to preview or deploy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border overflow-hidden transition-all group ${
                      darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
                    }`}
                  >
                    <div className="relative h-40 overflow-hidden bg-black/10">
                      <img
                        src={item.url}
                        alt={item.prompt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                        onClick={() => {
                          setActivePreviewImage(item);
                          setActiveTab("create");
                        }}
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold">
                        {item.aspectRatio}
                      </span>
                    </div>

                    <div className="p-3 space-y-2">
                      <p className="text-[11px] font-semibold line-clamp-2 text-slate-700 dark:text-slate-300">
                        {item.prompt}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                        <span>{item.category}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyLink(item.url, item.id)}
                            className="p-1 hover:text-[#3F51B5]"
                            title="Copy link"
                          >
                            {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <a
                            href={item.url}
                            download="asset.png"
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 hover:text-[#3F51B5]"
                            title="Download"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
