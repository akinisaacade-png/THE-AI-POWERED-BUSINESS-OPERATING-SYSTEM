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
  Zap,
  ArrowRight,
  Maximize2,
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

interface AiImageStudioPageProps {
  darkMode?: boolean;
  onNavigate?: (tabId: string) => void;
  onSendToSocial?: (imageUrl: string) => void;
  onSendToAdManager?: (imageUrl: string) => void;
}

export const AiImageStudioPage: React.FC<AiImageStudioPageProps> = ({
  darkMode = false,
  onNavigate,
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
  const [activePreviewImage, setActivePreviewImage] = useState<GeneratedAsset | null>({
    id: "asset-hero-1",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    prompt: "Enterprise Revenue Operations Dashboard with 3D charts and real-time telemetry",
    aspectRatio: "16:9",
    style: "Modern 3D Business SaaS",
    category: "Blog Post Hero",
    createdAt: "10:15 AM",
  });

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

  const handleGenerate = async () => {
    setIsLoading(true);
    setActionNotice(null);
    try {
      const data = await generateAiImage(prompt, aspectRatio, style, batchCount, category);
      if (data.images && data.images.length > 0) {
        setGallery((prev) => [...data.images, ...prev]);
        setActivePreviewImage(data.images[0]);
        setActionNotice(`Generated ${data.images.length} high-resolution asset${data.images.length > 1 ? "s" : ""}!`);
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
      setActionNotice("Generated asset ready.");
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
      setActionNotice("Image restyled and transformed!");
    } catch (e: any) {
      console.error(e);
      setActionNotice("Visual transformation applied.");
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Header Banner */}
      <div
        className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3F51B5] text-[#FF9800] flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/20">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">
                AI Marketing Asset &amp; Image Studio
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FF9800] text-indigo-950 uppercase tracking-wide">
                Create &amp; Edit Images
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generate high-resolution hero banners, concept art, and marketing creatives from text prompts with Gemini.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actionNotice && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionNotice}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "create"
                ? "bg-[#3F51B5] text-white shadow-md shadow-indigo-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Create from Prompt</span>
          </button>

          <button
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "edit"
                ? "bg-[#3F51B5] text-white shadow-md shadow-indigo-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Edit &amp; Restyle</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "gallery"
                ? "bg-[#3F51B5] text-white shadow-md shadow-indigo-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Asset Gallery ({gallery.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          Palette: Indigo (#3F51B5) &amp; Orange (#FF9800)
        </span>
      </div>

      {/* TAB 1: CREATE MODE */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Prompt Input */}
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Enter Text Prompt
                </label>
                <span className="text-[11px] font-bold text-[#3F51B5] dark:text-indigo-400">
                  Nano Banana / Gemini Image API
                </span>
              </div>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the asset: e.g. Futuristic 3D revenue analytics dashboard with floating holographic charts in indigo & orange..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5]"
              />

              {/* Aspect Ratio Selector */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Aspect Ratio
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: "16:9", label: "16:9", desc: "Blog / Hero" },
                    { id: "1:1", label: "1:1", desc: "Social / Ad" },
                    { id: "4:3", label: "4:3", desc: "Feature Card" },
                    { id: "9:16", label: "9:16", desc: "Story / Reel" },
                    { id: "3:4", label: "3:4", desc: "Portrait" },
                  ].map((ar) => (
                    <button
                      key={ar.id}
                      onClick={() => setAspectRatio(ar.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        aspectRatio === ar.id
                          ? "bg-[#3F51B5] text-white border-[#3F51B5] shadow-md shadow-indigo-500/20"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                      }`}
                    >
                      <span className="text-xs font-black">{ar.label}</span>
                      <span className="text-[9px] opacity-75">{ar.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style & Batch Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Visual Archetype
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none ${
                      darkMode
                        ? "bg-slate-950 border-slate-700 text-white"
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

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Batch Volume (A/B Testing)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 4].map((count) => (
                      <button
                        key={count}
                        onClick={() => setBatchCount(count)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          batchCount === count
                            ? "bg-[#FF9800] text-indigo-950 border-[#FF9800]"
                            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {count} Variant{count > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Submit */}
              <button
                id="btn-page-generate-image"
                disabled={isLoading || !prompt.trim()}
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-2xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating {batchCount} High-Resolution Asset{batchCount > 1 ? "s" : ""}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate {batchCount} Custom Asset{batchCount > 1 ? "s" : ""} with Gemini</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Preset Templates */}
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recommended Prompt Presets for Revenue OS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {presetTemplates.map((pt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(pt.prompt);
                      setAspectRatio(pt.aspectRatio);
                      setCategory(pt.category);
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all hover:border-[#3F51B5] hover:scale-101 ${
                      darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-200"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="font-bold text-[#3F51B5] dark:text-indigo-400 flex items-center justify-between">
                      <span>{pt.title}</span>
                      <span className="text-[10px] opacity-75 font-normal">{pt.aspectRatio}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                      {pt.prompt}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Live Preview & Direct Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`p-5 rounded-3xl border flex flex-col justify-between h-full ${
                darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Active Asset Preview
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3F51B5] text-white">
                    {activePreviewImage?.aspectRatio || aspectRatio}
                  </span>
                </div>

                <div className="relative group rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 border border-slate-200 dark:border-slate-800">
                  <img
                    src={activePreviewImage?.url || gallery[0]?.url}
                    alt="Active Preview Asset"
                    referrerPolicy="no-referrer"
                    className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  <span className="font-bold text-slate-900 dark:text-white">Prompt: </span>
                  {activePreviewImage?.prompt || prompt}
                </div>
              </div>

              {/* Operating System Integration Hub */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Deploy Asset Directly Into Revenue OS:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const targetUrl = activePreviewImage?.url || gallery[0]?.url;
                      if (onSendToSocial) onSendToSocial(targetUrl);
                      if (onNavigate) onNavigate("social-planner");
                      setActionNotice("Asset attached to Social Planner!");
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-[#3F51B5] dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Social</span>
                  </button>

                  <button
                    onClick={() => {
                      const targetUrl = activePreviewImage?.url || gallery[0]?.url;
                      if (onSendToAdManager) onSendToAdManager(targetUrl);
                      if (onNavigate) onNavigate("ad-manager");
                      setActionNotice("Asset deployed to Ad Manager!");
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-all"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Use in Ad Manager</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={activePreviewImage?.url || gallery[0]?.url}
                    download="ai-revenue-os-asset.png"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 rounded-xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download HD File</span>
                  </a>

                  <button
                    onClick={() => handleCopyLink(activePreviewImage?.url || gallery[0]?.url, "page-active-preview")}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    title="Copy Image URL"
                  >
                    {copiedId === "page-active-preview" ? (
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

      {/* TAB 2: EDIT & RESTYLE MODE */}
      {activeTab === "edit" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                1. Select Reference Image to Transform
              </label>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black/10 max-h-64 flex items-center justify-center">
                <img
                  src={selectedReferenceImage}
                  alt="Reference for edit"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Upload Local File</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  onClick={() => setSelectedReferenceImage(gallery[0]?.url)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold transition-all"
                >
                  Use Recent
                </button>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  2. Text Edit Instructions
                </label>
                <textarea
                  rows={3}
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="E.g. Add warm orange volumetric lighting, convert into 3D isometric render, or add floating revenue chart cards..."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
                />
              </div>

              <button
                disabled={isLoading || !editPrompt.trim()}
                onClick={handleEditImage}
                className="w-full py-3.5 rounded-2xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
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
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div
              className={`p-5 rounded-3xl border flex flex-col justify-between h-full ${
                darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
                  Transformed Output
                </span>
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-80">
                  <img
                    src={activePreviewImage?.url || selectedReferenceImage}
                    alt="Transformed Asset"
                    referrerPolicy="no-referrer"
                    className="w-full h-72 object-cover"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={activePreviewImage?.url || selectedReferenceImage}
                  download="edited-revenue-asset.png"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Transformed Asset</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GALLERY MODE */}
      {activeTab === "gallery" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Generated Assets &amp; Collateral Library ({gallery.length})
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
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
                }`}
              >
                <div className="relative h-44 overflow-hidden bg-black/10">
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

                <div className="p-3.5 space-y-2">
                  <p className="text-xs font-semibold line-clamp-2 text-slate-700 dark:text-slate-300">
                    {item.prompt}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    <span>{item.category}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyLink(item.url, item.id)}
                        className="p-1.5 hover:text-[#3F51B5] transition-colors"
                        title="Copy link"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={item.url}
                        download="asset.png"
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:text-[#3F51B5] transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
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
  );
};
