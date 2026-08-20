import React from "react";
import { GraduationCap, Plus, Users, BookOpen, Star, Play, CheckCircle2 } from "lucide-react";

interface MembershipPageProps {
  darkMode?: boolean;
}

export const MembershipPage: React.FC<MembershipPageProps> = ({
  darkMode = false,
}) => {
  const courses = [
    {
      id: "crs-1",
      title: "Enterprise Revenue Architecture Mastery",
      description: "Complete blueprint for deploying autonomous sales pipelines, missed call recovery, and CRM automation.",
      modules: 8,
      students: 342,
      rating: 4.9,
      status: "Published",
      revenue: 48000,
    },
    {
      id: "crs-2",
      title: "AI Voice Agent & Telephony Engineering",
      description: "How to configure sub-second IVR routing, automated missed call text-back, and round-robin calendars.",
      modules: 6,
      students: 189,
      rating: 5.0,
      status: "Published",
      revenue: 28350,
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Membership &amp; Client Training Academy
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3F51B5] text-white">
              Gated Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Host video courses, client onboarding tracks, certificates, and community forums.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95">
            <Plus className="w-4 h-4" />
            <span>Create Course Track</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`p-6 rounded-3xl border transition-all ${
              darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                  {course.status}
                </span>
                <h3 className="font-extrabold text-base mt-2 text-slate-900 dark:text-white">
                  {course.title}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{course.rating}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {course.description}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Modules</div>
                <div className="font-black text-slate-800 dark:text-white mt-0.5">{course.modules} Units</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Enrolled</div>
                <div className="font-black text-slate-800 dark:text-white mt-0.5 font-mono">{course.students}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Gross Rev</div>
                <div className="font-black text-[#3F51B5] dark:text-indigo-400 mt-0.5 font-mono">
                  ${(course.revenue ?? 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Automatic Access on Stripe Checkout</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3F51B5] text-white text-xs font-bold hover:bg-indigo-700 transition-all">
                <Play className="w-3 h-3" />
                <span>Preview Portal</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
