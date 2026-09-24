export type AttendanceStatus = "Present" | "Late" | "Absent";

export interface Student {
  id: string;
  sr: number;
  name: string;
  email: string;
  initials: string;
  avatarColor: string; // tailwind bg class, e.g. "bg-blue-100 text-blue-600"
  rollNumber: string;
  program: string; // short code, e.g. "BSCS" — used on the attendance table
  classGrade?: string; // Legacy field for records saved before programs were introduced.
  guardianName: string;
  contactNumber: string;
  dateJoined: string; // e.g. "Aug 15, 2024"
  attendanceDate: string; // e.g. "Oct 24, 2024"
  arrivalTime: string | null; // null when absent
  status: AttendanceStatus;
  enrollmentStatus?: "Active" | "Inactive";
  attendanceRate: number; // 0-100, drives the colored bar on the attendance table
}
