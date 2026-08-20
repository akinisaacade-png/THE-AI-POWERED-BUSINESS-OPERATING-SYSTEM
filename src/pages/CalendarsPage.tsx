import React, { useState } from "react";
import { Booking } from "../types";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  User,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface CalendarsPageProps {
  bookings: Booking[];
  onAddBooking: (booking: any) => void;
  onDeleteBooking: (bookingId: string) => void;
  onOpenDataModal: (section?: string) => void;
  darkMode?: boolean;
}

export const CalendarsPage: React.FC<CalendarsPageProps> = ({
  bookings,
  onAddBooking,
  onDeleteBooking,
  onOpenDataModal,
  darkMode = false,
}) => {
  const [activeView, setActiveView] = useState<"upcoming" | "availability">("upcoming");

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Calendars &amp; Appointment Scheduling
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF9800] text-indigo-950">
              Round-Robin Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time calendar booking links, 2-way Google/Outlook sync, and automated SMS reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDataModal("calendars-booking")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Booked Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className={`p-5 rounded-3xl border transition-all ${
              darkMode ? "bg-slate-800/80 border-slate-700 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                  {b.status}
                </span>
                <h4 className="font-extrabold text-sm mt-2 text-slate-900 dark:text-white">
                  {b.service_name}
                </h4>
              </div>
              <button
                onClick={() => onDeleteBooking(b.id)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Cancel Booking"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#3F51B5] dark:text-indigo-400" />
                <span className="font-semibold">{b.datetime} ({b.duration_minutes} mins)</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#FF9800]" />
                <span>{b.contact_name} ({b.contact_email})</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-emerald-500" />
                <span className="truncate">Host: {b.team_member}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <a
                href={b.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#3F51B5] dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Launch Meeting</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <span className="text-[10px] text-slate-400 font-semibold">
                Auto-Reminders Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
