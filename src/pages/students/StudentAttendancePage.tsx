import React, { useState } from "react";
import { Search, SlidersHorizontal, Download } from "lucide-react";
import { mockStudents } from "@/lib/mockStudents";
import StatusPill from "@/components/common/StatusPill";
import Pagination from "@/components/common/Pagination";

const PAGE_SIZE = 8;
const TOTAL_STUDENTS = 1240;
const TOTAL_PAGES = Math.ceil(TOTAL_STUDENTS / PAGE_SIZE); // 155

const attendanceBarColor: Record<string, string> = {
  Present: "bg-emerald-500",
  Late: "bg-amber-500",
  Absent: "bg-red-400",
};

const StudentsAttendancePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Swap for useGetAttendanceQuery({ page, search }) once attendanceApi is wired up.
  const rows = mockStudents;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* Search + actions */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, or class..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-300"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          <Download className="h-4 w-4" />
          Export Attendance
        </button>
      </div>

      {/* Table controls */}
      <div className="flex shrink-0 items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-500">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => setSelectAll(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
          />
          Select All
        </label>
        <span className="text-slate-400">
          Showing 1-{rows.length} of {TOTAL_STUDENTS.toLocaleString()} records (Thursday, Oct 24, 2024)
        </span>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-600">
            <tr>
              <th className="w-10 whitespace-nowrap px-4 py-3"></th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Sr</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Student</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Roll Number</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Program</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Date</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Arrival Time</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((s) => (
              <tr
                key={s.id}
                className={s.status === "Absent" ? "bg-red-50/40" : "hover:bg-slate-50/60"}
              >
                <td className="px-4 py-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
                </td>
                <td className="px-4 py-3 font-medium text-indigo-600">{s.sr}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${s.avatarColor}`}
                    >
                      {s.initials}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{s.name}</p>
                      <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{s.rollNumber}</td>
                <td className="px-4 py-3 text-slate-500">{s.program}</td>
                <td className="px-4 py-3 text-slate-500">{s.attendanceDate}</td>
                <td className="px-4 py-3 text-slate-500">{s.arrivalTime ?? "-"}</td>
                <td className="px-4 py-3">
                  <StatusPill status={s.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${attendanceBarColor[s.status]}`}
                      style={{ width: `${s.attendanceRate}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between text-sm text-slate-400">
        <span>
          Showing 1 to {rows.length} of {TOTAL_STUDENTS.toLocaleString()} results
        </span>
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default StudentsAttendancePage;
