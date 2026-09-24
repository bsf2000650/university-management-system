import React from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Download,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---- Placeholder data (swap for RTK Query hooks, e.g. useGetAttendanceSummaryQuery) ----

const statCards = [
  {
    label: "Student Attendance",
    value: "1240",
    delta: "+1.8% vs last week",
    icon: GraduationCap,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    label: "Teacher Attendance",
    value: "75",
    delta: "+0.5% vs last week",
    icon: Users,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    label: "Total Enrollments",
    value: "1,240",
    delta: "+4.2% vs last month",
    icon: BookOpen,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

const trendData = [
  { day: "Day 1", students: 90, teachers: 96 },
  { day: "Day 5", students: 89, teachers: 95.5 },
  { day: "Week 1", students: 91.2, teachers: 96 },
  { day: "Day 12", students: 90.5, teachers: 96.5 },
  { day: "Week 2", students: 92.8, teachers: 97.5 },
  { day: "Day 20", students: 91.5, teachers: 96.8 },
  { day: "Week 3", students: 93.4, teachers: 97 },
  { day: "Day 28", students: 93.1, teachers: 97.2 },
  { day: "Day 30", students: 93, teachers: 97.2 },
];

// ---- Small building blocks ----

function DeltaBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
      <TrendingUp className="h-3 w-3" />
      {text}
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function StatCard({ label, value, delta, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-slate-400">{label}</p>
        <div className={`rounded-full p-2 ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold text-slate-800">{value}</span>
        <DeltaBadge text={delta} />
      </div>
    </div>
  );
}

interface TooltipPayloadItem {
  value: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg">
      <p className="mb-1 font-medium">{label} Marker</p>
      <p className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Students {payload[0]?.value}%
      </p>
      <p className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Faculty {payload[1]?.value}%
      </p>
    </div>
  );
}

// ---- Page ----

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      {/* Page heading */}
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold leading-tight text-slate-800">
            Academic Overview
            <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-500">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Live Sync
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time attendance &amp; enrollment statistics for Fall Semester 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Attendance trends — takes whatever vertical space is left */}
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-2 flex shrink-0 items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Attendance Trends</h2>
            <p className="text-xs text-slate-400">
              Last 30 days comparison between faculty &amp; enrolled cohorts
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="h-0.5 w-4 rounded bg-indigo-500" />
              Students (Avg 92%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-0.5 w-4 rounded border-b-2 border-dashed border-emerald-500" />
              Teachers (Avg 96.8%)
            </span>
          </div>
        </div>

        {/* min-h-0 + flex-1 lets ResponsiveContainer measure the real
            remaining space rather than pushing the card taller */}
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                ticks={["Day 1", "Week 1", "Week 2", "Week 3", "Day 30"]}
              />
              <YAxis
                domain={[80, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="teachers"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
