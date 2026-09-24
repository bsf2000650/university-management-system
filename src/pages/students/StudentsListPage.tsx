import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Download, Plus, Phone } from "lucide-react";
import { mockStudents } from "@/lib/mockStudents";
import Pagination from "@/components/common/Pagination";
import RecordDialog, { type DialogField } from "@/components/common/RecordDialog";
import RowActionsMenu from "@/components/common/RowActionsMenu";
import usePersistentState from "@/lib/usePersistentState";
import type { Student } from "@/types/students.types";

const PAGE_SIZE = 8;
const PROGRAMS = ["BSCS", "BSIT", "BSSE", "BS Data Science", "BS Biotechnology", "BS Mathematics", "BBA", "B.Ed"];
const studentFields: DialogField[] = [
  { name: "name", label: "Full Name", required: true, placeholder: "e.g. Maya Lin" },
  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "student@university.edu" },
  { name: "rollNumber", label: "Roll Number", required: true, placeholder: "STU-2024-0001" },
  { name: "program", label: "Program", type: "select", required: true, options: PROGRAMS },
  { name: "guardianName", label: "Guardian / Parent Name", placeholder:"e.g John Sampson", required: true },
  { name: "contactNumber", label: "Contact Number", type: "tel", required: true, placeholder: "+1 (555) 000-0000" },
  { name: "dateJoined", label: "Date of Admission", required: true, placeholder: "e.g. Oct 24, 2024" },
  // { name: "enrollmentStatus", label: "Enrollment Status", type: "select", required: true, options: ["Active", "Inactive"] },
];

const StudentListPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = usePersistentState<Student[]>("eduattend.students", mockStudents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  useEffect(() => {
    setStudents((current) => current.map((student, index) => {
      const needsProgram = !student.program || student.program === "General";
      const legacyClass = student.classGrade?.startsWith("Grade ") ?? false;
      return needsProgram || legacyClass
        ? { ...student, program: PROGRAMS[index % PROGRAMS.length], classGrade: undefined }
        : student;
    }));
  }, [setStudents]);
  const filtered = useMemo(() => students.filter((student) => `${student.name} ${student.email} ${student.rollNumber} ${student.program}`.toLowerCase().includes(search.toLowerCase())), [students, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function saveStudent(values: Record<string, string>) {
    if (editing) {
      setStudents((current) => current.map((student) => student.id === editing.id ? { ...student, ...values, program: values.program, classGrade: undefined, enrollmentStatus: values.enrollmentStatus as Student["enrollmentStatus"], initials: values.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() } : student));
    } else {
      const name = values.name.trim();
      const next: Student = { id: crypto.randomUUID(), sr: students.length + 1, name, email: values.email, initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(), avatarColor: "bg-indigo-100 text-indigo-600", rollNumber: values.rollNumber, program: values.program, guardianName: values.guardianName, contactNumber: values.contactNumber, dateJoined: values.dateJoined, attendanceDate: "Oct 24, 2024", arrivalTime: null, status: "Present", enrollmentStatus: values.enrollmentStatus as Student["enrollmentStatus"], attendanceRate: 100 };
      setStudents((current) => [next, ...current]);
      setCurrentPage(1);
    }
    setDialogOpen(false);
    setEditing(null);
  }

  const openEdit = (student: Student) => { setEditing(student); setDialogOpen(true); };
  const deleteStudent = (id: string) => {
    const next = students.filter((student) => student.id !== id);
    setStudents(next);
    setSelectedIds((ids) => ids.filter((selectedId) => selectedId !== id));
    setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(next.length / PAGE_SIZE))));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 items-center gap-3">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} placeholder="Search by student name, roll number, or class..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-300" /></div>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600"><SlidersHorizontal className="h-4 w-4" />Filters</button>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600"><Download className="h-4 w-4" />Export</button>
        <button type="button" onClick={() => { setEditing(null); setDialogOpen(true); }} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"><Plus className="h-4 w-4" />Add Student</button>
      </div>

      <div className="flex shrink-0 items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-500"><input type="checkbox" checked={selectAll} onChange={(event) => setSelectAll(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />Select All<span className="ml-1 text-slate-400">Showing {rows.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} students</span></label>
        <span className="text-slate-400">Active Term Directory</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-600"><tr>
            <th className="w-10 px-4 py-3"></th><th className="whitespace-nowrap px-4 py-3 font-medium">SR</th><th className="whitespace-nowrap px-4 py-3 font-medium">Student</th><th className="whitespace-nowrap px-4 py-3 font-medium">Roll Number</th><th className="whitespace-nowrap px-4 py-3 font-medium">Program</th><th className="whitespace-nowrap px-4 py-3 font-medium">Guardian / Parent Name</th><th className="whitespace-nowrap px-4 py-3 font-medium">Contact Number</th><th className="whitespace-nowrap px-4 py-3 font-medium">Date Joined</th><th className="whitespace-nowrap px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((student, index) => <tr key={student.id} className="hover:bg-slate-50/60">
              <td className="px-4 py-3"><input type="checkbox" checked={selectAll || selectedIds.includes(student.id)} onChange={(event) => setSelectedIds((ids) => event.target.checked ? [...ids, student.id] : ids.filter((id) => id !== student.id))} className="h-4 w-4 rounded border-slate-300 text-indigo-600" /></td>
              <td className="px-4 py-3 font-medium text-slate-500">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
              <td className="px-4 py-3"><div className="flex items-center gap-2.5"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${student.avatarColor}`}>{student.initials}</span><div><p className="text-sm font-medium text-slate-800">{student.name}</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">{student.email}</p></div></div></td>
              <td className="px-4 py-3 text-slate-700">{student.rollNumber}</td><td className="px-4 py-3"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-700">{student.program}</span></td><td className="px-4 py-3 text-slate-700">{student.guardianName}</td>
              <td className="px-4 py-3 text-slate-700"><span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" />{student.contactNumber}</span></td><td className="px-4 py-3 text-slate-700">{student.dateJoined}</td><td className="px-4 py-3"><RowActionsMenu onEdit={() => openEdit(student)} onDelete={() => deleteStudent(student.id)} /></td>
            </tr>)}
            {rows.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-400">No students match your search.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 items-center justify-between text-sm text-slate-400"><span>Showing {(currentPage - 1) * PAGE_SIZE + (rows.length ? 1 : 0)} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} results</span><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>
      <RecordDialog open={dialogOpen} entity="Student" initialValues={editing ? { name: editing.name, email: editing.email, rollNumber: editing.rollNumber, program: editing.program, guardianName: editing.guardianName, contactNumber: editing.contactNumber, dateJoined: editing.dateJoined, enrollmentStatus: editing.enrollmentStatus ?? "Active" } : undefined} fields={studentFields} onClose={() => setDialogOpen(false)} onSave={saveStudent} />
    </div>
  );
};

export default StudentListPage;
