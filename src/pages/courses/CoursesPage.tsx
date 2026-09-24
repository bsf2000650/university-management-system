import { useMemo, useState } from "react";
import {
  Atom, BookOpen, Calculator, Download, FlaskConical, Globe2,
  Plus, Search, SlidersHorizontal, Users,
} from "lucide-react";
import RecordDialog, { type DialogField } from "@/components/common/RecordDialog";
import RowActionsMenu from "@/components/common/RowActionsMenu";
import usePersistentState from "@/lib/usePersistentState";

const iconMap = { Atom, Calculator, BookOpen, FlaskConical, Globe2 } as const;
type IconName = keyof typeof iconMap;

type Course = {
  title: string;
  detail: string;
  code: string;
  instructor: string;
  department: string;
  enrolled: number;
  capacity: number;
  schedule: string;
  time: string;
  icon: IconName;
  tone: string;
};

function resolveIcon(icon: unknown, code: string): IconName {
  if (typeof icon === "string" && icon in iconMap) return icon as IconName;
  return initialCourses.find((course) => course.code === code)?.icon ?? "Atom";
}

const initialCourses: Course[] = [
  { title: "Advanced Placement Physics C", detail: "Mechanics & Electromagnetism • Lab Required", code: "PHY-301", instructor: "Dr. Marcus Reed", department: "Science Faculty", enrolled: 28, capacity: 30, schedule: "Mon, Wed, Fri", time: "09:00 - 10:30 AM", icon: "Atom", tone: "bg-violet-100 text-violet-600" },
  { title: "Calculus BC & Analytic Geometry", detail: "Differential & Integral Theories • Year 2", code: "MTH-204", instructor: "Prof. Elena Rostova", department: "Math Lead", enrolled: 32, capacity: 35, schedule: "Tue, Thu", time: "10:00 - 11:30 AM", icon: "Calculator", tone: "bg-blue-100 text-blue-600" },
  { title: "Computer Science: Algorithms", detail: "Data Structures & Complexity • Java Core", code: "CS-108", instructor: "David Chen", department: "Computer Studies", enrolled: 30, capacity: 30, schedule: "Mon, Wed", time: "01:00 - 02:30 PM", icon: "BookOpen", tone: "bg-indigo-100 text-indigo-600" },
  { title: "Organic Chemistry & Synthesis", detail: "Carbon Compounds & Mechanism Studies", code: "CHM-215", instructor: "Dr. Sarah Al-Mansoor", department: "Physical Sciences", enrolled: 22, capacity: 25, schedule: "Tue, Thu, Fri", time: "08:30 - 10:00 AM", icon: "FlaskConical", tone: "bg-emerald-100 text-emerald-600" },
  { title: "Modern World History", detail: "Global Treaties & 20th Century Conflicts", code: "HIS-112", instructor: "Michael O'Connor", department: "Humanities Dept", enrolled: 25, capacity: 30, schedule: "Mon, Wed, Fri", time: "11:00 AM - 12:00 PM", icon: "Globe2", tone: "bg-violet-100 text-violet-600" },
  { title: "Introduction to Machine Learning", detail: "Neural Nets, Regression Models & Python ML", code: "CS-350", instructor: "David Chen", department: "Computer Studies", enrolled: 0, capacity: 25, schedule: "Tue, Thu", time: "03:00 - 04:30 PM", icon: "Atom", tone: "bg-blue-100 text-blue-600" },
  { title: "Classical Mechanics & Waves", detail: "Motion, energy and wave systems", code: "PHY-204", instructor: "Dr. Marcus Reed", department: "Science Faculty", enrolled: 45, capacity: 45, schedule: "Mon, Wed", time: "09:00 - 10:30 AM", icon: "Atom", tone: "bg-violet-100 text-violet-600" },
  { title: "Advanced Linear Algebra & Matrices", detail: "Vector spaces and linear transformations", code: "MTH-302", instructor: "Prof. Elena Rostova", department: "Math Lead", enrolled: 18, capacity: 25, schedule: "Tue, Thu", time: "12:00 - 01:30 PM", icon: "Calculator", tone: "bg-blue-100 text-blue-600" },
  { title: "Cellular Biology & Genetics", detail: "Cell structures, genes and inheritance", code: "BIO-110", instructor: "Claire Davenport", department: "Life Sciences", enrolled: 30, capacity: 30, schedule: "Mon, Wed, Fri", time: "10:00 - 11:00 AM", icon: "FlaskConical", tone: "bg-emerald-100 text-emerald-600" },
  { title: "Contemporary Global Literature", detail: "Modern texts across cultures", code: "ENG-201", instructor: "Michael O'Connor", department: "Humanities Dept", enrolled: 12, capacity: 20, schedule: "Tue, Thu", time: "01:00 - 02:30 PM", icon: "Globe2", tone: "bg-violet-100 text-violet-600" },
  { title: "Principles of Organic Chemistry", detail: "Structure, bonding and reactions", code: "CHM-105", instructor: "Dr. Sarah Al-Mansoor", department: "Physical Sciences", enrolled: 38, capacity: 40, schedule: "Mon, Wed", time: "02:00 - 03:30 PM", icon: "FlaskConical", tone: "bg-emerald-100 text-emerald-600" },
  { title: "Applied Statistics", detail: "Probability, sampling and inference", code: "STA-220", instructor: "Prof. Elena Rostova", department: "Math Lead", enrolled: 21, capacity: 28, schedule: "Wed, Fri", time: "11:00 AM - 12:30 PM", icon: "Calculator", tone: "bg-blue-100 text-blue-600" },
  { title: "Environmental Science", detail: "Ecology and sustainable systems", code: "ENV-101", instructor: "Claire Davenport", department: "Life Sciences", enrolled: 26, capacity: 30, schedule: "Mon, Thu", time: "08:00 - 09:30 AM", icon: "Globe2", tone: "bg-emerald-100 text-emerald-600" },
  { title: "Software Engineering", detail: "Design, testing and delivery", code: "CS-240", instructor: "David Chen", department: "Computer Studies", enrolled: 24, capacity: 30, schedule: "Tue, Fri", time: "01:00 - 02:30 PM", icon: "BookOpen", tone: "bg-indigo-100 text-indigo-600" },
  { title: "Electromagnetic Theory", detail: "Fields, circuits and applications", code: "PHY-320", instructor: "Dr. Marcus Reed", department: "Science Faculty", enrolled: 17, capacity: 24, schedule: "Mon, Wed", time: "03:00 - 04:30 PM", icon: "Atom", tone: "bg-violet-100 text-violet-600" },
  { title: "Organic Laboratory", detail: "Experimental methods and analysis", code: "CHM-221", instructor: "Dr. Sarah Al-Mansoor", department: "Physical Sciences", enrolled: 20, capacity: 24, schedule: "Fri", time: "01:00 - 04:00 PM", icon: "FlaskConical", tone: "bg-emerald-100 text-emerald-600" },
  { title: "Data Structures", detail: "Algorithms and program design", code: "CS-202", instructor: "David Chen", department: "Computer Studies", enrolled: 27, capacity: 30, schedule: "Tue, Thu", time: "09:00 - 10:30 AM", icon: "BookOpen", tone: "bg-indigo-100 text-indigo-600" },
  { title: "World Literature", detail: "Classics and contemporary writing", code: "ENG-115", instructor: "Michael O'Connor", department: "Humanities Dept", enrolled: 19, capacity: 25, schedule: "Mon, Wed", time: "12:00 - 01:30 PM", icon: "Globe2", tone: "bg-violet-100 text-violet-600" },
];

const courseFields: DialogField[] = [
  { name: "title", label: "Course Title", required: true },
  { name: "detail", label: "Course Description", type: "textarea", required: true },
  { name: "code", label: "Course Code", required: true },
  { name: "instructor", label: "Assigned Instructor", required: true },
  { name: "department", label: "Department", required: true },
  { name: "enrolled", label: "Enrolled Students", type: "number", required: true },
  { name: "capacity", label: "Course Capacity", type: "number", required: true },
  { name: "schedule", label: "Schedule", required: true },
  { name: "time", label: "Class Time", required: true },
];

type View = "courses" | "enrollments";

export default function CoursesPage() {
  const [view, setView] = useState<View>("courses");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [fullOnly, setFullOnly] = useState(false);
  const [persistedCourses, setCourseData] = usePersistentState<Course[]>("eduattend.courses", initialCourses);
  const courseData = useMemo(() => persistedCourses.map((course) => ({ ...course, icon: resolveIcon(course.icon, course.code) })), [persistedCourses]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const pageSize = 6;
  const filtered = useMemo(() => courseData.filter((course) => {
    const matches = `${course.title} ${course.code} ${course.department} ${course.instructor}`.toLowerCase().includes(query.toLowerCase());
    return matches && (!fullOnly || course.enrolled >= course.capacity);
  }), [courseData, query, fullOnly]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function changeQuery(value: string) { setQuery(value); setPage(1); }

  function saveCourse(values: Record<string, string>) {
    const next: Course = { ...(editingCourse ?? initialCourses[0]), title: values.title.trim(), detail: values.detail, code: values.code.trim(), instructor: values.instructor, department: values.department, enrolled: Number(values.enrolled), capacity: Number(values.capacity), schedule: values.schedule, time: values.time };
    setCourseData((current) => editingCourse ? current.map((course) => course.code === editingCourse.code ? next : course) : [next, ...current]);
    setDialogOpen(false);
    setEditingCourse(null);
    setPage(1);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Courses</h1>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">● {courseData.length} Active Courses</span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">Academic Year 2024-2025</span>
        </div>
        <div className="flex gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" />Export Catalog</button>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 rounded-full bg-slate-100 p-1">
        <button type="button" onClick={() => setView("courses")} className={`flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium ${view === "courses" ? "bg-indigo-700 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"}`}><BookOpen className="h-4 w-4" />Course List <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{courseData.length}</span></button>
        <button type="button" onClick={() => setView("enrollments")} className={`flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium ${view === "enrollments" ? "bg-indigo-700 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"}`}><Users className="h-4 w-4" />Enrollments &amp; Allocations <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-700">147</span></button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => changeQuery(event.target.value)} placeholder={view === "courses" ? "Search by course name, code, or department..." : "Search section allocations..."} className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <div className="relative">
          <button type="button" onClick={() => setShowFilters((open) => !open)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><SlidersHorizontal className="h-4 w-4" />Filters</button>
          {showFilters && <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"><label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={fullOnly} onChange={(event) => { setFullOnly(event.target.checked); setPage(1); }} className="accent-indigo-600" />Show full courses only</label></div>}
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-800"><Download className="h-4 w-4" />{view === "courses" ? "Export" : "Export Course List"}</button>
        {view === "courses" && <button type="button" onClick={() => { setEditingCourse(null); setDialogOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"><Plus className="h-4 w-4" />Add Course</button>}
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-600">
              {view === "courses" ? <tr><th className="w-10 whitespace-nowrap px-3 py-3"><input type="checkbox" aria-label="Select all courses" /></th><th className="w-10 whitespace-nowrap px-2 py-3">#</th><th className="w-[32%] whitespace-nowrap px-3 py-3">Course title &amp; details</th><th className="w-[8%] whitespace-nowrap px-2 py-3">Code</th><th className="w-[20%] whitespace-nowrap px-3 py-3">Assigned instructor</th><th className="w-[18%] whitespace-nowrap px-3 py-3">Enrolled / capacity</th><th className="w-[18%] whitespace-nowrap px-3 py-3">Schedule</th><th className="whitespace-nowrap px-3 py-3">Actions</th></tr> : <tr><th className="w-10 whitespace-nowrap px-3 py-3"><input type="checkbox" aria-label="Select all allocations" /></th><th className="w-10 whitespace-nowrap px-2 py-3">#</th><th className="w-[29%] whitespace-nowrap px-3 py-3">Course title</th><th className="w-[16%] whitespace-nowrap px-3 py-3">Assigned instructor</th><th className="w-[12%] whitespace-nowrap px-3 py-3">Enrolled students</th><th className="w-[13%] whitespace-nowrap px-3 py-3">Enrollment %</th><th className="w-[12%] whitespace-nowrap px-3 py-3">Waitlist count</th><th className="w-[12%] whitespace-nowrap px-3 py-3">Available seats</th><th className="whitespace-nowrap px-3 py-3">Actions</th></tr>}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((course, index) => {
                const Icon = iconMap[course.icon];
                const percent = Math.round((course.enrolled / course.capacity) * 100);
                const full = percent >= 100;
                return <tr key={course.code} className="hover:bg-slate-50/70">
                  <td className="px-3 py-2.5"><input type="checkbox" aria-label={`Select ${course.title}`} /></td>
                  <td className="px-2 py-2.5 text-slate-500">{(page - 1) * pageSize + index + 1}</td>
                  <td className="px-3 py-2.5"><div className="flex items-center gap-2.5"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${course.tone}`}><Icon className="h-4 w-4" /></span><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{course.title}</p><p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-500">{course.detail}</p></div></div></td>
                  {view === "courses" ? <>
                    <td className="px-2 py-2.5"><span className="rounded bg-indigo-50 px-1.5 py-1 text-[10px] font-medium text-indigo-700">{course.code}</span></td>
                    <td className="px-3 py-2.5"><p className="font-medium text-slate-700">{course.instructor}</p><p className="mt-0.5 truncate text-[10px] text-slate-400">{course.department}</p></td>
                    <td className="px-3 py-2.5"><div className="flex justify-between gap-2 text-[11px]"><span className="font-medium text-slate-700">{course.enrolled} / {course.capacity}</span><span className="text-slate-400">{course.enrolled === 0 ? "Upcoming" : `${percent}%${full ? " FULL" : ""}`}</span></div><div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${full ? "bg-rose-500" : "bg-indigo-600"}`} style={{ width: `${percent}%` }} /></div></td>
                    <td className="px-3 py-2.5"><p className="font-medium text-slate-700">{course.schedule}</p><p className="mt-0.5 text-[10px] text-slate-400">{course.time}</p></td>
                  </> : <>
                    <td className="px-3 py-2.5"><p className="font-medium text-slate-700">{course.instructor}</p><p className="mt-0.5 text-[10px] text-slate-400">{course.department}</p></td>
                    <td className="px-3 py-2.5 font-medium text-slate-700">{course.enrolled} / {course.capacity}</td>
                    <td className="px-3 py-2.5"><p className={`font-medium ${full ? "text-rose-600" : "text-slate-700"}`}>{course.enrolled === 0 ? "—" : `${percent}%${full ? " FULL" : ""}`}</p><div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${full ? "bg-rose-500" : "bg-indigo-600"}`} style={{ width: `${percent}%` }} /></div></td>
                    <td className="px-3 py-2.5 text-slate-600">{full ? "5 waiting" : "0 waiting"}</td>
                    <td className="px-3 py-2.5"><span className={`rounded-full px-2 py-1 text-[10px] ${full ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{Math.max(0, course.capacity - course.enrolled)} seats</span></td>
                  </>}
                  <td className="px-3 py-2.5"><RowActionsMenu onEdit={() => { setEditingCourse(course); setDialogOpen(true); }} onDelete={() => { const next = courseData.filter((item) => item.code !== course.code); setCourseData(next); setPage((value) => Math.min(value, Math.max(1, Math.ceil(next.length / pageSize)))); }} /></td>
                </tr>;
              })}
              {rows.length === 0 && <tr><td colSpan={view === "courses" ? 8 : 9} className="px-4 py-12 text-center text-sm text-slate-500">No courses match your search.</td></tr>}
            </tbody>
          </table>
        </div>
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-indigo-50/70 px-4 py-2.5 text-[11px] text-slate-600">
          <span>Showing {rows.length ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, filtered.length)} of {view === "courses" ? `${filtered.length} courses` : "147 section allocations"}</span>
          <nav aria-label="Course pages" className="flex items-center gap-1">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 disabled:opacity-40">‹</button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button type="button" key={number} onClick={() => setPage(number)} className={`rounded-md px-2.5 py-1.5 ${page === number ? "bg-indigo-700 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{number}</button>)}
            <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount} className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 disabled:opacity-40">›</button>
          </nav>
        </footer>
      </section>
      <RecordDialog open={dialogOpen} entity="Course" initialValues={editingCourse ? { title: editingCourse.title, detail: editingCourse.detail, code: editingCourse.code, instructor: editingCourse.instructor, department: editingCourse.department, enrolled: editingCourse.enrolled, capacity: editingCourse.capacity, schedule: editingCourse.schedule, time: editingCourse.time } : undefined} fields={courseFields} onClose={() => setDialogOpen(false)} onSave={saveCourse} />
    </div>
  );
}
