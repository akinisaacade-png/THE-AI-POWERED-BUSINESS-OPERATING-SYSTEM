import React, { useState } from "react";
import {
  Layers,
  Type,
  Image as ImageIcon,
  Square,
  Columns2,
  Minus,
  MessageSquare,
  Trash2,
  GripVertical,
  Eye,
  Code,
  Smartphone,
  Monitor,
  Sparkles,
  Download,
  Copy,
  Check,
  Plus,
  Settings,
  ArrowUp,
  ArrowDown,
  Palette,
  ExternalLink,
} from "lucide-react";

export interface EmailBlock {
  id: string;
  type: "header" | "heading" | "text" | "button" | "image" | "columns" | "testimonial" | "divider" | "footer";
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    buttonText?: string;
    buttonUrl?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    imageUrl?: string;
    imageAlt?: string;
    col1Title?: string;
    col1Text?: string;
    col2Title?: string;
    col2Text?: string;
    quote?: string;
    author?: string;
    role?: string;
    logoText?: string;
    align?: "left" | "center" | "right";
    bgColor?: string;
    textColor?: string;
    padding?: "sm" | "md" | "lg";
  };
}

const defaultBlocks: EmailBlock[] = [
  {
    id: "block-1",
    type: "header",
    content: {
      logoText: "REVENUE OS",
      bgColor: "#3F51B5",
      textColor: "#FFFFFF",
      align: "center",
      padding: "md",
    },
  },
  {
    id: "block-2",
    type: "heading",
    content: {
      title: "Supercharge your pipeline with Autonomous Inbound AI",
      subtitle: "Turn every missed call and ad click into high-intent booked demos in under 60 seconds.",
      align: "center",
      textColor: "#1E293B",
      padding: "md",
    },
  },
  {
    id: "block-3",
    type: "image",
    content: {
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Revenue Operations Dashboard",
      align: "center",
      padding: "sm",
    },
  },
  {
    id: "block-4",
    type: "text",
    content: {
      text: "Hi {{contact.first_name}},\n\nSpeed-to-lead is the single highest leverage metric for revenue teams. When a prospective client reaches out, our Voice & SMS AI answers within 8 seconds, qualifies the prospect using your custom criteria, and books straight onto your calendar.",
      align: "left",
      textColor: "#334155",
      padding: "md",
    },
  },
  {
    id: "block-5",
    type: "button",
    content: {
      buttonText: "Schedule Live Architecture Walkthrough →",
      buttonUrl: "https://calendly.com/revenue-os/demo",
      buttonColor: "#FF9800",
      buttonTextColor: "#0F172A",
      align: "center",
      padding: "md",
    },
  },
  {
    id: "block-6",
    type: "testimonial",
    content: {
      quote: "Revenue OS recovered $84,000 in missed-call opportunities in our first 30 days of deployment.",
      author: "Marcus Vance",
      role: "VP of Sales, Crestwood Global",
      bgColor: "#F8FAFC",
      textColor: "#0F172A",
      padding: "md",
    },
  },
  {
    id: "block-7",
    type: "footer",
    content: {
      text: "You are receiving this email because you subscribed to Revenue OS. You can manage your preferences or unsubscribe at any time.",
      align: "center",
      textColor: "#94A3B8",
      padding: "sm",
    },
  },
];

const blockTemplates: { type: EmailBlock["type"]; label: string; icon: React.ElementType }[] = [
  { type: "header", label: "Header & Logo", icon: Layers },
  { type: "heading", label: "Headline & Subtitle", icon: Type },
  { type: "text", label: "Paragraph Body", icon: MessageSquare },
  { type: "button", label: "Call to Action", icon: Square },
  { type: "image", label: "Media Banner", icon: ImageIcon },
  { type: "columns", label: "2-Column Features", icon: Columns2 },
  { type: "testimonial", label: "Testimonial Card", icon: Sparkles },
  { type: "divider", label: "Divider Line", icon: Minus },
  { type: "footer", label: "Footer & Legal", icon: Layers },
];

interface EmailTemplateBuilderProps {
  darkMode?: boolean;
  onImportAIText?: string | null;
}

export const EmailTemplateBuilder: React.FC<EmailTemplateBuilderProps> = ({
  darkMode = false,
  onImportAIText,
}) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>(defaultBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>("block-2");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Add block
  const handleAddBlock = (type: EmailBlock["type"]) => {
    const newBlock: EmailBlock = {
      id: `block-${Date.now()}`,
      type,
      content: {
        title: type === "heading" ? "New Section Headline" : undefined,
        subtitle: type === "heading" ? "Add supporting context here." : undefined,
        text: type === "text" ? "Enter your personalized email copy here..." : undefined,
        buttonText: type === "button" ? "Claim Your Access →" : undefined,
        buttonUrl: type === "button" ? "https://yourcompany.com" : undefined,
        buttonColor: "#3F51B5",
        buttonTextColor: "#FFFFFF",
        imageUrl: type === "image" ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" : undefined,
        imageAlt: "Feature illustration",
        col1Title: type === "columns" ? "Instant Text-Back" : undefined,
        col1Text: type === "columns" ? "8-second automated engagement." : undefined,
        col2Title: type === "columns" ? "AI Booking" : undefined,
        col2Text: type === "columns" ? "Seamless calendar integration." : undefined,
        quote: type === "testimonial" ? "This completely transformed our lead response workflow." : undefined,
        author: type === "testimonial" ? "Sarah Chen" : undefined,
        role: type === "testimonial" ? "Head of Growth" : undefined,
        logoText: type === "header" ? "YOUR BRAND" : undefined,
        align: "center",
        padding: "md",
      },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  // Update selected block content
  const handleUpdateContent = (field: string, value: any) => {
    if (!selectedBlockId) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === selectedBlockId
          ? { ...b, content: { ...b.content, [field]: value } }
          : b
      )
    );
  };

  // Delete block
  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  // Move block up or down
  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const updated = [...blocks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setBlocks(updated);
  };

  // Drag and drop sorting
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...blocks];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);
    setDraggedIndex(index);
    setBlocks(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Apply AI Draft into current block or create new block
  const handleInsertAIDraft = () => {
    if (!onImportAIText) return;
    const newBlock: EmailBlock = {
      id: `block-${Date.now()}`,
      type: "text",
      content: {
        text: onImportAIText,
        align: "left",
        textColor: "#1E293B",
        padding: "md",
      },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  // Generate exported HTML
  const generateEmailHtml = () => {
    const blocksHtml = blocks
      .map((block) => {
        const c = block.content;
        switch (block.type) {
          case "header":
            return `<div style="background-color: ${c.bgColor || "#3F51B5"}; color: ${c.textColor || "#FFF"}; padding: 24px; text-align: ${c.align || "center"}; font-family: sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 2px;">${c.logoText || "REVENUE OS"}</div>`;
          case "heading":
            return `<div style="padding: 24px 20px; text-align: ${c.align || "center"}; font-family: sans-serif;"><h1 style="color: ${c.textColor || "#0F172A"}; font-size: 24px; margin: 0 0 8px 0; font-weight: 800; line-height: 1.3;">${c.title || ""}</h1><p style="color: #64748B; font-size: 14px; margin: 0; line-height: 1.5;">${c.subtitle || ""}</p></div>`;
          case "text":
            return `<div style="padding: 16px 20px; text-align: ${c.align || "left"}; font-family: sans-serif; font-size: 14px; line-height: 1.6; color: ${c.textColor || "#334155"}; white-space: pre-line;">${c.text || ""}</div>`;
          case "button":
            return `<div style="padding: 20px; text-align: ${c.align || "center"}; font-family: sans-serif;"><a href="${c.buttonUrl || "#"}" style="background-color: ${c.buttonColor || "#FF9800"}; color: ${c.buttonTextColor || "#000"}; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 14px; display: inline-block;">${c.buttonText || "Click Here"}</a></div>`;
          case "image":
            return `<div style="padding: 12px 20px; text-align: ${c.align || "center"};"><img src="${c.imageUrl || ""}" alt="${c.imageAlt || ""}" style="max-width: 100%; border-radius: 8px; display: inline-block;" /></div>`;
          case "columns":
            return `<div style="padding: 16px 20px; font-family: sans-serif;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td width="48%" style="vertical-align: top; padding: 12px; background: #F8FAFC; border-radius: 8px;"><h3 style="margin: 0 0 4px 0; font-size: 14px; color: #0F172A;">${c.col1Title || ""}</h3><p style="margin: 0; font-size: 12px; color: #64748B;">${c.col1Text || ""}</p></td><td width="4%"></td><td width="48%" style="vertical-align: top; padding: 12px; background: #F8FAFC; border-radius: 8px;"><h3 style="margin: 0 0 4px 0; font-size: 14px; color: #0F172A;">${c.col2Title || ""}</h3><p style="margin: 0; font-size: 12px; color: #64748B;">${c.col2Text || ""}</p></td></tr></table></div>`;
          case "testimonial":
            return `<div style="padding: 20px; background-color: ${c.bgColor || "#F8FAFC"}; border-left: 4px solid #3F51B5; margin: 16px 20px; font-family: sans-serif; border-radius: 4px;"><p style="font-style: italic; color: #334155; font-size: 13px; margin: 0 0 8px 0;">"${c.quote || ""}"</p><div style="font-weight: 800; font-size: 12px; color: #0F172A;">${c.author || ""} <span style="font-weight: normal; color: #64748B;">— ${c.role || ""}</span></div></div>`;
          case "divider":
            return `<div style="padding: 12px 20px;"><hr style="border: none; border-top: 1px solid #E2E8F0; margin: 0;" /></div>`;
          case "footer":
            return `<div style="padding: 24px 20px; text-align: ${c.align || "center"}; font-family: sans-serif; font-size: 11px; color: ${c.textColor || "#94A3B8"}; line-height: 1.5; border-top: 1px solid #E2E8F0;">${c.text || ""}</div>`;
          default:
            return "";
        }
      })
      .join("\n");

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marketing Broadcast</title>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <tr>
      <td>
${blocksHtml}
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generateEmailHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Builder Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#3F51B5] dark:text-indigo-400" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Visual Drag &amp; Drop Email Builder
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF9800]/20 text-[#FF9800] border border-[#FF9800]/30 font-mono">
            {blocks.length} Blocks
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Responsive Preview Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "desktop"
                  ? "bg-[#3F51B5] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "mobile"
                  ? "bg-[#3F51B5] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Code Toggle */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              showCode
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCode ? "Visual Canvas" : "HTML Code"}</span>
          </button>

          {/* Copy HTML Button */}
          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3F51B5] text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied HTML!" : "Export HTML"}</span>
          </button>

          {onImportAIText && (
            <button
              onClick={handleInsertAIDraft}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FF9800] text-indigo-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-sm"
              title="Insert AI Generated Copy"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Insert AI Draft</span>
            </button>
          )}
        </div>
      </div>

      {showCode ? (
        /* Raw HTML view */
        <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[600px]">
          <pre>{generateEmailHtml()}</pre>
        </div>
      ) : (
        /* 3-Column Interactive Layout: Palette (Left) | Canvas (Center) | Properties Inspector (Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left: Drag / Add Blocks Palette */}
          <div className="lg:col-span-3 space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-3">
                Add Components
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                {blockTemplates.map((tmpl) => {
                  const Icon = tmpl.icon;
                  return (
                    <button
                      key={tmpl.type}
                      onClick={() => handleAddBlock(tmpl.type)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs font-bold bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-[#3F51B5] dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700/60 transition-all group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:text-[#3F51B5] shadow-xs">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="flex-1 truncate">{tmpl.label}</span>
                      <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#3F51B5] transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Templates */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">
                Preset Sequences
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setBlocks(defaultBlocks)}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  ⚡ Product Announcement
                </button>
                <button
                  onClick={() => {
                    setBlocks([
                      defaultBlocks[0],
                      {
                        id: `b-${Date.now()}-1`,
                        type: "heading",
                        content: { title: "Quick question regarding your revenue operations", align: "left" },
                      },
                      {
                        id: `b-${Date.now()}-2`,
                        type: "text",
                        content: {
                          text: "Hi {{contact.first_name}},\n\nNoticed your team is scaling fast. Are you currently utilizing automated SMS text-back to capture missed inbound leads?\n\nWould love to share how Crestwood Logistics increased inbound bookings by 34%.",
                          align: "left",
                        },
                      },
                      {
                        id: `b-${Date.now()}-3`,
                        type: "button",
                        content: { buttonText: "View 2-Min Architecture Video", buttonColor: "#3F51B5", buttonTextColor: "#FFF" },
                      },
                      defaultBlocks[6],
                    ]);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  🎯 1-on-1 Executive Outreach
                </button>
              </div>
            </div>
          </div>

          {/* Center: Live Interactive Drag-and-Drop Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div
              className={`w-full transition-all duration-300 ${
                viewMode === "mobile" ? "max-w-[380px]" : "max-w-full"
              }`}
            >
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-4 shadow-sm min-h-[500px]">
                {/* Email container simulator */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 divide-y divide-slate-100">
                  {blocks.map((block, index) => {
                    const isSelected = block.id === selectedBlockId;
                    const c = block.content;

                    return (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedBlockId(block.id)}
                        className={`relative group cursor-pointer transition-all ${
                          isSelected
                            ? "ring-2 ring-[#3F51B5] ring-inset bg-indigo-50/20"
                            : "hover:bg-slate-50/70"
                        }`}
                      >
                        {/* Hover / Active Block Actions bar */}
                        <div
                          className={`absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-lg shadow-sm transition-opacity ${
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <span
                            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-0.5"
                            title="Drag to reorder"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveBlock(index, "up");
                            }}
                            disabled={index === 0}
                            className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveBlock(index, "down");
                            }}
                            disabled={index === blocks.length - 1}
                            className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlock(block.id);
                            }}
                            className="p-0.5 text-slate-400 hover:text-red-600"
                            title="Delete Block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Render Block visually */}
                        <div className="p-4 select-none">
                          {block.type === "header" && (
                            <div
                              style={{
                                backgroundColor: c.bgColor || "#3F51B5",
                                color: c.textColor || "#FFFFFF",
                                textAlign: c.align || "center",
                              }}
                              className="py-5 px-6 font-black tracking-widest text-base rounded-lg uppercase shadow-xs"
                            >
                              {c.logoText || "REVENUE OS"}
                            </div>
                          )}

                          {block.type === "heading" && (
                            <div style={{ textAlign: c.align || "center" }} className="space-y-1.5 py-2">
                              <h2
                                style={{ color: c.textColor || "#1E293B" }}
                                className="text-xl font-black leading-tight"
                              >
                                {c.title || "Section Headline"}
                              </h2>
                              {c.subtitle && (
                                <p className="text-xs text-slate-500 font-medium">
                                  {c.subtitle}
                                </p>
                              )}
                            </div>
                          )}

                          {block.type === "text" && (
                            <div
                              style={{ textAlign: c.align || "left", color: c.textColor || "#334155" }}
                              className="text-xs leading-relaxed whitespace-pre-line font-medium py-1"
                            >
                              {c.text || "Write your message content here."}
                            </div>
                          )}

                          {block.type === "button" && (
                            <div style={{ textAlign: c.align || "center" }} className="py-3">
                              <span
                                style={{
                                  backgroundColor: c.buttonColor || "#FF9800",
                                  color: c.buttonTextColor || "#0F172A",
                                }}
                                className="inline-block px-6 py-2.5 rounded-xl font-black text-xs shadow-md"
                              >
                                {c.buttonText || "Call to Action"}
                              </span>
                            </div>
                          )}

                          {block.type === "image" && (
                            <div style={{ textAlign: c.align || "center" }} className="py-2">
                              <img
                                src={c.imageUrl}
                                alt={c.imageAlt || "Campaign Visual"}
                                className="w-full max-h-56 object-cover rounded-xl shadow-xs"
                              />
                            </div>
                          )}

                          {block.type === "columns" && (
                            <div className="grid grid-cols-2 gap-3 py-2">
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-xs text-slate-900">
                                  {c.col1Title || "Feature 1"}
                                </h4>
                                <p className="text-[11px] text-slate-500 mt-1">
                                  {c.col1Text || "Description of benefit"}
                                </p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-xs text-slate-900">
                                  {c.col2Title || "Feature 2"}
                                </h4>
                                <p className="text-[11px] text-slate-500 mt-1">
                                  {c.col2Text || "Description of benefit"}
                                </p>
                              </div>
                            </div>
                          )}

                          {block.type === "testimonial" && (
                            <div
                              style={{ backgroundColor: c.bgColor || "#F8FAFC" }}
                              className="p-4 rounded-xl border-l-4 border-[#3F51B5] my-1"
                            >
                              <p className="text-xs italic text-slate-700">
                                &quot;{c.quote || "Customer testimonial quote"}&quot;
                              </p>
                              <div className="mt-2 text-[11px] font-bold text-slate-900">
                                {c.author || "Client Name"}{" "}
                                <span className="font-normal text-slate-500">
                                  — {c.role || "Executive"}
                                </span>
                              </div>
                            </div>
                          )}

                          {block.type === "divider" && (
                            <div className="py-2">
                              <div className="border-t border-slate-200 w-full" />
                            </div>
                          )}

                          {block.type === "footer" && (
                            <div
                              style={{ textAlign: c.align || "center", color: c.textColor || "#94A3B8" }}
                              className="text-[10px] py-3 leading-relaxed"
                            >
                              {c.text || "Unsubscribe & company footer information."}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Block Properties Inspector */}
          <div className="lg:col-span-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-[#3F51B5] dark:text-indigo-400" />
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                    Block Inspector
                  </h4>
                </div>
                {selectedBlock && (
                  <span className="text-[10px] font-mono uppercase font-bold text-[#FF9800]">
                    {selectedBlock.type}
                  </span>
                )}
              </div>

              {selectedBlock ? (
                <div className="space-y-3 text-xs">
                  {/* Heading Properties */}
                  {selectedBlock.type === "heading" && (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Headline Text
                        </label>
                        <input
                          type="text"
                          value={selectedBlock.content.title || ""}
                          onChange={(e) => handleUpdateContent("title", e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={selectedBlock.content.subtitle || ""}
                          onChange={(e) => handleUpdateContent("subtitle", e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                        />
                      </div>
                    </>
                  )}

                  {/* Header / Logo */}
                  {selectedBlock.type === "header" && (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Brand / Logo Name
                        </label>
                        <input
                          type="text"
                          value={selectedBlock.content.logoText || ""}
                          onChange={(e) => handleUpdateContent("logoText", e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Background Color
                        </label>
                        <input
                          type="color"
                          value={selectedBlock.content.bgColor || "#3F51B5"}
                          onChange={(e) => handleUpdateContent("bgColor", e.target.value)}
                          className="w-full h-8 rounded-lg cursor-pointer"
                        />
                      </div>
                    </>
                  )}

                  {/* Text Properties */}
                  {selectedBlock.type === "text" && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Body Content (Supports Mergetags like &#123;&#123;contact.first_name&#125;&#125;)
                      </label>
                      <textarea
                        rows={6}
                        value={selectedBlock.content.text || ""}
                        onChange={(e) => handleUpdateContent("text", e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Button Properties */}
                  {selectedBlock.type === "button" && (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={selectedBlock.content.buttonText || ""}
                          onChange={(e) => handleUpdateContent("buttonText", e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Destination URL
                        </label>
                        <input
                          type="text"
                          value={selectedBlock.content.buttonUrl || ""}
                          onChange={(e) => handleUpdateContent("buttonUrl", e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                            Button Color
                          </label>
                          <input
                            type="color"
                            value={selectedBlock.content.buttonColor || "#FF9800"}
                            onChange={(e) => handleUpdateContent("buttonColor", e.target.value)}
                            className="w-full h-8 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                            Text Color
                          </label>
                          <input
                            type="color"
                            value={selectedBlock.content.buttonTextColor || "#0F172A"}
                            onChange={(e) => handleUpdateContent("buttonTextColor", e.target.value)}
                            className="w-full h-8 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Image Properties */}
                  {selectedBlock.type === "image" && (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Image Source URL
                        </label>
                        <input
                          type="text"
                          value={selectedBlock.content.imageUrl || ""}
                          onChange={(e) => handleUpdateContent("imageUrl", e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={selectedBlock.content.imageAlt || ""}
                          onChange={(e) => handleUpdateContent("imageAlt", e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                        />
                      </div>
                    </>
                  )}

                  {/* Testimonial Properties */}
                  {selectedBlock.type === "testimonial" && (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          Quote Text
                        </label>
                        <textarea
                          rows={3}
                          value={selectedBlock.content.quote || ""}
                          onChange={(e) => handleUpdateContent("quote", e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                            Author Name
                          </label>
                          <input
                            type="text"
                            value={selectedBlock.content.author || ""}
                            onChange={(e) => handleUpdateContent("author", e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                            Role / Company
                          </label>
                          <input
                            type="text"
                            value={selectedBlock.content.role || ""}
                            onChange={(e) => handleUpdateContent("role", e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Alignment Control */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Text Alignment
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => handleUpdateContent("align", align)}
                          className={`py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            selectedBlock.content.align === align
                              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteBlock(selectedBlock.id)}
                    className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Component</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Click on any block on the canvas to configure its content, typography, and styling.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
