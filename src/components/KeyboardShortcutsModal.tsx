import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Keyboard,
  X,
  Search,
  Mic,
  Image as ImageIcon,
  Bot,
  PlusCircle,
  Sun,
  LayoutDashboard,
  Kanban,
  CreditCard,
  Mail,
  LineChart,
  Workflow,
  PhoneCall,
  Command,
} from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: "Actions" | "Navigation" | "Global";
  icon?: React.ElementType;
}

const shortcuts: ShortcutItem[] = [
  // Global & Search
  { keys: ["?"], description: "Toggle this Keyboard Shortcuts modal", category: "Global", icon: Keyboard },
  { keys: ["/", "⌘", "K"], description: "Open Universal Search", category: "Global", icon: Search },
  { keys: ["Esc"], description: "Close modals and overlays", category: "Global", icon: X },
  { keys: ["D"], description: "Toggle Dark / Light Mode", category: "Global", icon: Sun },

  // Quick Action Modals
  { keys: ["T"], description: "Open Voice Note Audio Transcriber", category: "Actions", icon: Mic },
  { keys: ["I"], description: "Open AI Image Studio", category: "Actions", icon: ImageIcon },
  { keys: ["M"], description: "Open Tri-Agent Multi-Agent Hub", category: "Actions", icon: Bot },
  { keys: ["N"], description: "Open Quick Data Creation modal", category: "Actions", icon: PlusCircle },

  // Quick Navigation (G + Key)
  { keys: ["G", "D"], description: "Go to Dashboard & Targets", category: "Navigation", icon: LayoutDashboard },
  { keys: ["G", "C"], description: "Go to CRM & Pipeline", category: "Navigation", icon: Kanban },
  { keys: ["G", "E"], description: "Go to Email Marketing & Builder", category: "Navigation", icon: Mail },
  { keys: ["G", "A"], description: "Go to Tracking & Analytics", category: "Navigation", icon: LineChart },
  { keys: ["G", "W"], description: "Go to Automation Workflows", category: "Navigation", icon: Workflow },
  { keys: ["G", "P"], description: "Go to Payments & Invoicing", category: "Navigation", icon: CreditCard },
  { keys: ["G", "V"], description: "Go to Calls & Voice AI", category: "Navigation", icon: PhoneCall },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  darkMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden z-10 ${
            darkMode
              ? "bg-slate-900 border-slate-800 text-slate-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#3F51B5] text-white flex items-center justify-center shadow-xs">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Keyboard Shortcuts
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Navigate Revenue OS with lightning speed
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Shortcuts Grid */}
          <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5 custom-scrollbar">
            {(["Global", "Actions", "Navigation"] as const).map((category) => {
              const categoryShortcuts = shortcuts.filter((s) => s.category === category);
              return (
                <div key={category} className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {category} Shortcuts
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categoryShortcuts.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                            darkMode
                              ? "bg-slate-950/60 border-slate-800/80 hover:bg-slate-950"
                              : "bg-slate-50 border-slate-100 hover:bg-slate-100/80"
                          } transition-colors`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {Icon && (
                              <Icon className="w-3.5 h-3.5 text-[#3F51B5] dark:text-indigo-400 shrink-0" />
                            )}
                            <span className="truncate text-[11px] font-medium text-slate-700 dark:text-slate-300">
                              {item.description}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.keys.map((k, kIdx) => (
                              <kbd
                                key={kIdx}
                                className={`px-2 py-1 text-[10px] font-mono font-black rounded-md border shadow-xs ${
                                  darkMode
                                    ? "bg-slate-800 border-slate-700 text-amber-300"
                                    : "bg-white border-slate-200 text-[#3F51B5]"
                                }`}
                              >
                                {k}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-mono">?</kbd> anywhere to trigger
            </span>
            <span className="font-semibold text-[#3F51B5] dark:text-indigo-400">
              Revenue OS 2026
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
