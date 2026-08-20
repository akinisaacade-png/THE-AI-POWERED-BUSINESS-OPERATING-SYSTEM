import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Kanban,
  Users,
  CalendarDays,
  PhoneCall,
  MessageSquareText,
  Star,
  Globe,
  Video,
  FileQuestion,
  QrCode,
  Megaphone,
  CreditCard,
  Workflow,
  TrendingUp,
  Bot,
  FileSignature,
  LineChart,
  UserCheck,
  Share2,
  Settings,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "crm-pipeline", label: "CRM & Pipeline", icon: Kanban, badge: "AI Insights" },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "calendars-booking", label: "Calendars & Booking", icon: CalendarDays },
  { id: "calls-voice-ai", label: "Calls & Voice AI", icon: PhoneCall, badge: "Text-Back" },
  { id: "sms-conversations", label: "SMS & Conversations", icon: MessageSquareText },
  { id: "reputation", label: "Reputation & Reviews", icon: Star },
  { id: "funnels-websites", label: "Websites & Funnels", icon: Globe },
  { id: "forms-surveys", label: "Forms & Surveys", icon: FileQuestion },
  { id: "email-marketing", label: "Email Marketing", icon: Megaphone },
  { id: "ai-image-studio", label: "AI Image Studio", icon: ImageIcon, badge: "Create & Edit" },
  { id: "unified-chat", label: "Conversation AI", icon: Bot },
  { id: "ad-manager", label: "Ad Manager", icon: Megaphone },
  { id: "payments", label: "Payments & Invoicing", icon: CreditCard },
  { id: "subscription-billing", label: "Subscription & Billing", icon: Sparkles, badge: "PayPal Active" },
  { id: "automation", label: "Automation", icon: Workflow, badge: "A2A Synced" },
  { id: "membership", label: "Membership Academy", icon: UserCheck },
  { id: "affiliate", label: "Affiliates", icon: Share2 },
  { id: "document-signing", label: "Document Signing", icon: FileSignature },
  { id: "analytics", label: "Tracking & Analytics", icon: LineChart },
  { id: "gray-label-app", label: "Gray-Labelled App", icon: Globe },
  { id: "social-planner", label: "Social Planner", icon: Share2 },
  { id: "settings", label: "Settings", icon: Settings },
];

interface ChecklistTask {
  id: string;
  text: string;
  completed: boolean;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  unreadMessagesCount?: number;
  pendingReviewsCount?: number;
  pendingDealsCount?: number;
  onOpenMultiAgent?: () => void;
  onOpenImageGen?: () => void;
  onOpenTranscriber?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadMessagesCount = 0,
  pendingReviewsCount = 0,
  pendingDealsCount = 0,
  onOpenMultiAgent,
  onOpenImageGen,
  onOpenTranscriber,
}) => {
  // Persistent Daily Checklist State
  const [tasks, setTasks] = useState<ChecklistTask[]>(() => {
    try {
      const saved = localStorage.getItem("business_os_sidebar_checklist");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: "t-1", text: "Follow up with high-intent lead", completed: true },
      { id: "t-2", text: "Verify missed call auto-text trigger", completed: false },
      { id: "t-3", text: "Review quarterly MRR report", completed: false },
    ];
  });

  const [newTaskText, setNewTaskText] = useState("");
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem("business_os_sidebar_checklist", JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: ChecklistTask = {
      id: `t-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskText("");
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <aside
      id="app-sidebar-nav"
      className="w-[280px] min-w-[280px] bg-[#3F51B5] flex flex-col shrink-0 text-white select-none z-20 h-screen sticky top-0 shadow-lg"
    >
      {/* Sleek Header */}
      <div className="p-6 flex items-center gap-3 border-b border-indigo-400/20">
        <div className="w-8 h-8 bg-[#FF9800] rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md">
          OS
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight uppercase tracking-wider">
            Revenue OS
          </h1>
          <p className="text-[10px] text-indigo-200 font-semibold tracking-wide">
            AI-POWERED BUSINESS OS
          </p>
        </div>
      </div>

      {/* Sleek Navigation List */}
      <nav className="flex-1 overflow-y-auto px-0 space-y-0.5 text-[11px] font-medium custom-scrollbar py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-6 py-2 cursor-pointer transition-all duration-150 ${
                isActive
                  ? "bg-indigo-800/60 border-l-4 border-[#FF9800] text-white font-bold shadow-inner"
                  : "text-indigo-100 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center">
                <Icon
                  className={`w-4 h-4 mr-3 shrink-0 ${
                    isActive ? "text-[#FF9800]" : "text-indigo-200"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                    isActive
                      ? "bg-[#FF9800] text-indigo-950"
                      : "bg-indigo-900/80 text-amber-200"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Persistent Daily Checklist Widget */}
      <div className="border-t border-indigo-400/20 bg-indigo-900/40 p-3">
        <div
          onClick={() => setIsChecklistOpen(!isChecklistOpen)}
          className="flex items-center justify-between cursor-pointer text-indigo-100 hover:text-white"
        >
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-[#FF9800]" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Daily Checklist
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/60 text-amber-300">
              {completedCount}/{tasks.length}
            </span>
            {isChecklistOpen ? (
              <ChevronDown className="w-3 h-3 text-indigo-300" />
            ) : (
              <ChevronUp className="w-3 h-3 text-indigo-300" />
            )}
          </div>
        </div>

        {isChecklistOpen && (
          <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
            {/* Task list container */}
            <div className="max-h-28 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {tasks.length === 0 ? (
                <p className="text-[10px] text-indigo-300/70 italic text-center py-1">
                  No tasks left today.
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center justify-between gap-1.5 text-[11px] bg-indigo-950/40 hover:bg-indigo-950/70 px-2 py-1 rounded transition-colors"
                  >
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="flex items-center gap-1.5 text-left flex-1 min-w-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-3 h-3 text-indigo-300 shrink-0 group-hover:text-white" />
                      )}
                      <span
                        className={`truncate text-[10.5px] ${
                          task.completed
                            ? "line-through text-indigo-300/60"
                            : "text-indigo-100"
                        }`}
                      >
                        {task.text}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-red-300 transition-opacity shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add task mini form */}
            <form onSubmit={handleAddTask} className="flex items-center gap-1 mt-1.5">
              <input
                type="text"
                placeholder="Quick add task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 bg-indigo-950/70 border border-indigo-500/30 rounded px-2 py-1 text-[10.5px] text-white placeholder:text-indigo-300/50 focus:outline-none focus:border-[#FF9800]"
              />
              <button
                type="submit"
                disabled={!newTaskText.trim()}
                className="p-1 rounded bg-[#FF9800] text-indigo-950 hover:bg-amber-400 disabled:opacity-40 transition-colors shrink-0"
              >
                <Plus className="w-3 h-3 font-bold" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Sleek Footer Status */}
      <div className="p-3 border-t border-indigo-400/20 bg-indigo-950/40 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-indigo-200">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white">Tri-Agent Synced</span>
          </div>
          <span className="text-[#FF9800] font-mono font-bold">Gemini 3.7</span>
        </div>
      </div>
    </aside>
  );
};

