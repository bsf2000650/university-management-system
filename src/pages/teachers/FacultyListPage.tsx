import { useEffect, useMemo, useState } from "react";
import { Download, Phone, Plus, Search, SlidersHorizontal } from "lucide-react";
import type { FacultyMember } from "@/lib/mockFaculty";
import Pagination from "@/components/common/Pagination";
import RowActionsMenu from "@/components/common/RowActionsMenu";

interface FacultyListPageProps {
  faculty: FacultyMember[];
  onAdd: () => void;
  onEdit: (person: FacultyMember) => void;
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 7;

const FacultyListPage: React.FC<FacultyListPageProps> = ({ faculty, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const filtered = useMemo(() => faculty.filter((person) => `${person.name} ${person.email} ${person.employeeId} ${person.department} ${person.designation}`.toLowerCase().includes(search.toLowerCase())), [faculty, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setCurrentPage((page) => Math.min(page, totalPages)); }, [totalPages]);

  const updateSearch = (value: string) => { setSearch(value); setCurrentPage(1); };
  const employmentStyle = { Active: "bg-emerald-50 text-emerald-700", "On Leave": "bg-amber-50 text-amber-700", Inactive: "bg-slate-100 text-slate-600" };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 items-center gap-3">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="Search by faculty name, employee ID, or department..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-300" /></div>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600"><SlidersHorizontal className="h-4 w-4" />Filters</button>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600"><Download className="h-4 w-4" />Export</button>
        <button type="button" onClick={onAdd} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"><Plus className="h-4 w-4" />Add Faculty</button>
      </div>

      <div className="flex shrink-0 items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-500"><input type="checkbox" checked={selectAll} onChange={(event) => setSelectAll(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />Select All<span className="ml-1 text-slate-400">Showing {rows.length} faculty members</span></label>
        <span className="text-slate-400">Faculty directory</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1500px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-600"><tr>
            <th className="w-10 whitespace-nowrap px-3 py-3"></th><th className="whitespace-nowrap px-3 py-3 font-medium">SR</th><th className="whitespace-nowrap px-3 py-3 font-medium">Teacher</th><th className="whitespace-nowrap px-3 py-3 font-medium">Employee ID</th><th className="whitespace-nowrap px-3 py-3 font-medium">Department</th><th className="whitespace-nowrap px-3 py-3 font-medium">Designation / Title</th><th className="whitespace-nowrap px-3 py-3 font-medium">Assigned Courses</th><th className="whitespace-nowrap px-3 py-3 font-medium">Date of Joining</th><th className="whitespace-nowrap px-3 py-3 font-medium">Contact Number</th><th className="whitespace-nowrap px-3 py-3 font-medium">Employment Status</th><th className="whitespace-nowrap px-3 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((person, index) => <tr key={person.id} className="hover:bg-slate-50/60">
              <td className="px-3 py-3"><input type="checkbox" checked={selectAll} onChange={() => undefined} aria-label={`Select ${person.name}`} className="h-4 w-4 rounded border-slate-300 text-indigo-600" /></td>
              <td className="px-3 py-3 font-medium text-slate-500">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
              <td className="px-3 py-3"><div className="flex items-center gap-2.5"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${person.avatarColor}`}>{person.initials}</span><div><p className="text-sm font-medium text-slate-800">{person.name}</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">{person.email}</p></div></div></td>
              <td className="px-3 py-3 text-slate-700">{person.employeeId}</td>
              <td className="px-3 py-3"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-700">{person.department}</span></td>
              <td className="px-3 py-3 text-slate-700">{person.designation}</td>
              <td className="px-3 py-3"><p className="font-medium text-slate-700">{person.courses.length} courses</p><p className="max-w-48 truncate text-[10px] text-slate-500">{person.courses.join(", ")}</p></td>
              <td className="px-3 py-3 text-slate-700">{person.joined}</td>
              <td className="px-3 py-3 text-slate-700"><span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" />{person.phone}</span></td>
              <td className="px-3 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${employmentStyle[person.employment]}`}>{person.employment}</span></td>
              <td className="px-3 py-3"><RowActionsMenu onEdit={() => onEdit(person)} onDelete={() => onDelete(person.id)} onView={() => window.alert(`${person.name}\n${person.designation}\n${person.email}`)} /></td>
            </tr>)}
            {rows.length === 0 && <tr><td colSpan={11} className="py-10 text-center text-slate-400">No faculty match your search.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 items-center justify-between text-sm text-slate-400"><span>Showing {(currentPage - 1) * PAGE_SIZE + (rows.length ? 1 : 0)} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {faculty.length} faculty members</span><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>
    </div>
  );
};

export default FacultyListPage;
