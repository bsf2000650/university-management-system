import React, { useState } from "react";
import { ClipboardCheck, ListChecks } from "lucide-react";
import AttendanceAnalyticsPage from "./StudentAttendancePage";
import StudentListPage from "./StudentsListPage";
import { studentsSummary } from "@/lib/mockStudents";

type Tab = "analytics" | "list";

const StudentsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("list");

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Title + summary badges */}
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">Students</h1>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
          {studentsSummary.total.toLocaleString()} Total Students
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {studentsSummary.presentPct}% Present Today
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {studentsSummary.latePct}% Late
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          {studentsSummary.absentPct}% Absent
        </span>
      </div>

      {/* Tab toggle */}
      <div className="flex shrink-0 gap-3">
        <button
          type="button"
          onClick={() => setTab("list")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "list"
              ? "bg-indigo-600 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
        >
          <ListChecks className="h-4 w-4" />
          Student List
          <span className={`rounded-full px-2 py-0.5 text-xs ${tab === "list" ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>{studentsSummary.total.toLocaleString()}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("analytics")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "analytics"
              ? "bg-indigo-600 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
        >
          <ClipboardCheck className="h-4 w-4" />
          Students Attendance
        </button>
      </div>

      {/* Active view */}
      {tab === "list" ? <StudentListPage /> : <AttendanceAnalyticsPage />}
    </div>
  );
};

export default StudentsPage;
