import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Download, Plus } from "lucide-react";
import type { FacultyMember } from "@/lib/mockFaculty";
import Pagination from "@/components/common/Pagination";
import RowActionsMenu from "@/components/common/RowActionsMenu";
import RecordDialog, { type DialogField } from "@/components/common/RecordDialog";

const PAGE_SIZE = 7;
const attendanceFields: DialogField[] = [{ name: "attendance", label: "Attendance Status", type: "select", required: true, options: ["Present", "Late", "Absent"] }];
interface FacultyAttendancePageProps { faculty: FacultyMember[]; onAdd: () => void; onUpdate: (id: string, status: FacultyMember["attendance"]) => void }

const FacultyAttendancePage: React.FC<FacultyAttendancePageProps> = ({ faculty, onAdd, onUpdate }) => {
  const [search, setSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState<FacultyMember | null>(null);
  const filtered = useMemo(() => faculty.filter((person) => `${person.name} ${person.email} ${person.employeeId} ${person.department}`.toLowerCase().includes(search.toLowerCase())), [faculty, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const presentCount = faculty.filter((person) => person.attendance === "Present").length;
  const lateCount = faculty.filter((person) => person.attendance === "Late").length;
  const absentCount = faculty.filter((person) => person.attendance === "Absent").length;

  const updateSearch = (value: string) => { setSearch(value); setCurrentPage(1); };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="Search by teacher name, employee ID, or department..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-300" />
        </div>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600"><SlidersHorizontal className="h-4 w-4" />Filters</button>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600"><Download className="h-4 w-4" />Export</button>
        <button type="button" onClick={onAdd} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"><Plus className="h-4 w-4" />Add Faculty</button>
      </div>

      <div className="flex shrink-0 items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-500"><input type="checkbox" checked={selectAll} onChange={(event) => setSelectAll(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />Select All</label>
        <span className="text-slate-400">Showing {(currentPage - 1) * PAGE_SIZE + (rows.length ? 1 : 0)}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {faculty.length} faculty members · Thursday, Oct 24, 2024</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1450px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-600"><tr>
            <th className="w-10 whitespace-nowrap px-3 py-3"></th><th className="whitespace-nowrap px-3 py-3 font-medium">SR</th><th className="whitespace-nowrap px-3 py-3 font-medium">Teacher</th><th className="whitespace-nowrap px-3 py-3 font-medium">Employee ID</th><th className="whitespace-nowrap px-3 py-3 font-medium">Department</th><th className="whitespace-nowrap px-3 py-3 font-medium">Date</th><th className="whitespace-nowrap px-3 py-3 font-medium">Check-in Time</th><th className="whitespace-nowrap px-3 py-3 font-medium">Check-out Time</th><th className="whitespace-nowrap px-3 py-3 font-medium">Status</th><th className="whitespace-nowrap px-3 py-3 font-medium">Attendance %</th><th className="whitespace-nowrap px-3 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((person, index) => {
              const pill = person.attendance === "Present" ? "bg-emerald-50 text-emerald-700" : person.attendance === "Late" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700";
              const bar = person.attendance === "Present" ? "bg-emerald-500" : person.attendance === "Late" ? "bg-amber-500" : "bg-red-400";
              return <tr key={person.id} className={person.attendance === "Absent" ? "bg-red-50/30" : "hover:bg-slate-50/60"}>
                <td className="px-3 py-3"><input type="checkbox" checked={selectAll} onChange={() => undefined} aria-label={`Select ${person.name}`} className="h-4 w-4 rounded border-slate-300 text-indigo-600" /></td>
                <td className="px-3 py-3 font-medium text-indigo-600">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td className="px-3 py-3"><div className="flex items-center gap-2.5"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${person.avatarColor}`}>{person.initials}</span><div><p className="text-sm font-medium text-slate-800">{person.name}</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">{person.email}</p></div></div></td>
                <td className="px-3 py-3 text-slate-500">{person.employeeId}</td><td className="px-3 py-3 text-slate-500">{person.department}</td><td className="px-3 py-3 text-slate-500">{person.date}</td><td className="px-3 py-3 text-slate-500">{person.checkIn}</td><td className="px-3 py-3 text-slate-500">{person.checkOut}</td>
                <td className="px-3 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${pill}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{person.attendance === "Present" ? "Present" : person.attendance}</span></td>
                <td className="px-3 py-3"><div className="flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${bar}`} style={{ width: `${person.attendanceRate}%` }} /></div><span className="text-xs text-slate-500">{person.attendanceRate}%</span></div></td>
                <td className="px-3 py-3"><RowActionsMenu onEdit={() => setEditing(person)} /></td>
              </tr>;
            })}
            {rows.length === 0 && <tr><td colSpan={11} className="py-10 text-center text-slate-400">No faculty match your search.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 items-center justify-between text-sm text-slate-400"><span>Showing {(currentPage - 1) * PAGE_SIZE + (rows.length ? 1 : 0)} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {faculty.length} records ({presentCount} present, {lateCount} late, {absentCount} absent)</span><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>
      <RecordDialog open={Boolean(editing)} entity="Attendance" initialValues={editing ? { attendance: editing.attendance } : undefined} fields={attendanceFields} onClose={() => setEditing(null)} onSave={(values) => { if (editing) onUpdate(editing.id, values.attendance as FacultyMember["attendance"]); setEditing(null); }} />
    </div>
  );
};

export default FacultyAttendancePage;
