import { useState } from "react";
import { ClipboardCheck, ListChecks } from "lucide-react";
import FacultyAttendancePage from "./FacultyAttendancePage";
import FacultyListPage from "./FacultyListPage";
import { mockFaculty, type FacultyMember } from "@/lib/mockFaculty";
import usePersistentState from "@/lib/usePersistentState";
import RecordDialog, { type DialogField } from "@/components/common/RecordDialog";

type Tab = "analytics" | "list";
const facultyFields: DialogField[] = [
  { name: "name", label: "Teacher Name", required: true, placeholder: "e.g. Dr. Marcus Reed" },
  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "e.g. marcus.reed@university.edu" },
  { name: "employeeId", label: "Employee ID", required: true, placeholder: "e.g. FAC-1042" },
  { name: "department", label: "Department", required: true, placeholder: "e.g. Physics & Engineering" },
  { name: "designation", label: "Designation / Title", required: true, placeholder: "e.g. Senior Lecturer" },
  { name: "courses", label: "Assigned Courses", placeholder: "e.g. AP Physics, Engineering 101" },
  { name: "joined", label: "Date of Joining", required: true, placeholder: "e.g. Aug 12, 2024" },
  { name: "phone", label: "Contact Number", type: "tel", required: true, placeholder: "e.g. +1 (555) 210-1042" },
  // { name: "employment", label: "Employment Status", type: "select", required: true, options: ["Active", "On Leave", "Inactive"] },
];

export default function FacultyPage() {
  const [tab, setTab] = useState<Tab>("list");
  const [faculty, setFaculty] = usePersistentState<FacultyMember[]>("eduattend.faculty", mockFaculty);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FacultyMember | null>(null);
  const summary = { total: faculty.length, active: faculty.filter((person) => person.employment === "Active").length, onLeave: faculty.filter((person) => person.employment === "On Leave").length, inactive: faculty.filter((person) => person.employment === "Inactive").length };

  function saveFaculty(values: Record<string, string>) {
    const name = values.name.trim();
    const next: FacultyMember = {
      ...(editing ?? mockFaculty[0]), id: editing?.id ?? crypto.randomUUID(), name, email: values.email, initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(), employeeId: values.employeeId, department: values.department, designation: values.designation, courses: values.courses.split(",").map((course) => course.trim()).filter(Boolean), joined: values.joined, phone: values.phone, employment: values.employment as FacultyMember["employment"],
    };
    setFaculty((current) => editing ? current.map((person) => person.id === editing.id ? next : person) : [next, ...current]);
    setDialogOpen(false);
    setEditing(null);
  }

  function deleteFaculty(id: string) {
    setFaculty((current) => current.filter((person) => person.id !== id));
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold text-slate-800">Faculty</h1>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">{summary.total} Total Faculty</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">● {summary.active} Active</span>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">● {summary.onLeave} On Leave</span>
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">● {summary.inactive} Inactive</span>
        </div>
      </div>

      <div className="flex shrink-0 gap-3">
        <button type="button" onClick={() => setTab("list")} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${tab === "list" ? "bg-indigo-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600"}`}><ListChecks className="h-4 w-4" />Faculty List<span className={`rounded-full px-2 py-0.5 text-xs ${tab === "list" ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>{summary.total}</span></button>
        <button type="button" onClick={() => setTab("analytics")} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${tab === "analytics" ? "bg-indigo-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600"}`}><ClipboardCheck className="h-4 w-4" />Faculty Attendance</button>
      </div>

      {tab === "analytics" ? <FacultyAttendancePage faculty={faculty} onAdd={() => { setEditing(null); setDialogOpen(true); }} onUpdate={(id, attendance) => setFaculty((current) => current.map((person) => person.id === id ? { ...person, attendance } : person))} /> : <FacultyListPage faculty={faculty} onAdd={() => { setEditing(null); setDialogOpen(true); }} onEdit={(person) => { setEditing(person); setDialogOpen(true); }} onDelete={deleteFaculty} />}
      <RecordDialog open={dialogOpen} entity="Faculty" initialValues={editing ? { name: editing.name, email: editing.email, employeeId: editing.employeeId, department: editing.department, designation: editing.designation, courses: editing.courses.join(", "), joined: editing.joined, phone: editing.phone, employment: editing.employment } : undefined} fields={facultyFields} onClose={() => setDialogOpen(false)} onSave={saveFaculty} />
    </div>
  );
}
