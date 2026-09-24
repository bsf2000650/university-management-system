import React from "react";
import type { AttendanceStatus } from "@/types/students.types";

const styles: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-600",
  Late: "bg-amber-50 text-amber-600",
  Absent: "bg-red-50 text-red-600",
};

const dotStyles: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-500",
  Late: "bg-amber-500",
  Absent: "bg-red-500",
};

const StatusPill: React.FC<{ status: AttendanceStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} />
    {status}
  </span>
);

export default StatusPill;