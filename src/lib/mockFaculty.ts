export type FacultyAttendanceStatus = "Present" | "Late" | "Absent";
export type EmploymentStatus = "Active" | "On Leave" | "Inactive";

export interface FacultyMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  employeeId: string;
  department: string;
  designation: string;
  courses: string[];
  joined: string;
  phone: string;
  employment: EmploymentStatus;
  date: string;
  checkIn: string;
  checkOut: string;
  attendance: FacultyAttendanceStatus;
  attendanceRate: number;
}

const seed: Omit<FacultyMember, "id" | "employeeId" | "date" | "checkIn" | "checkOut" | "attendanceRate">[] = [
  { name: "Dr. Marcus Reed", email: "m.reed@edu.org", initials: "MR", avatarColor: "bg-amber-100 text-amber-700", department: "Physics & Engineering", designation: "Professor & Head of Dept", courses: ["AP Physics", "Eng 101", "Mechanics"], joined: "Aug 12, 2018", phone: "+1 (555) 210-1042", employment: "Active", attendance: "Present" },
  { name: "Elena Rostova", email: "e.rostova@edu.org", initials: "ER", avatarColor: "bg-sky-100 text-sky-700", department: "Mathematics", designation: "Associate Professor", courses: ["Calculus BC", "Linear Algebra"], joined: "Jan 08, 2020", phone: "+1 (555) 210-1018", employment: "Active", attendance: "Present" },
  { name: "Dr. Tariq Al-Mansoor", email: "t.almansoor@edu.org", initials: "TM", avatarColor: "bg-indigo-100 text-indigo-700", department: "Computer Science", designation: "Senior Lecturer", courses: ["CS 101", "Data Structures", "Machine Learning", "Software Design"], joined: "Mar 16, 2017", phone: "+1 (555) 210-1077", employment: "Active", attendance: "Late" },
  { name: "Claire Davenport", email: "c.davenport@edu.org", initials: "CD", avatarColor: "bg-emerald-100 text-emerald-700", department: "Chemistry", designation: "Assistant Professor", courses: ["Organic Chem", "Chem Lab"], joined: "Sep 03, 2021", phone: "+1 (555) 210-1031", employment: "Active", attendance: "Present" },
  { name: "Prof. Arthur Pendleton", email: "a.pendleton@edu.org", initials: "AP", avatarColor: "bg-blue-100 text-blue-700", department: "Humanities & History", designation: "Department Chair", courses: ["World History", "Civics", "Modern Europe"], joined: "Jun 22, 2015", phone: "+1 (555) 210-1065", employment: "Active", attendance: "Absent" },
  { name: "Maya Lin-Soto", email: "m.lin@edu.org", initials: "ML", avatarColor: "bg-rose-100 text-rose-700", department: "Literature & Arts", designation: "Lecturer", courses: ["Modern Lit", "Creative Writing"], joined: "Feb 14, 2022", phone: "+1 (555) 210-1090", employment: "On Leave", attendance: "Absent" },
  { name: "David K. Thornton", email: "d.thornton@edu.org", initials: "DT", avatarColor: "bg-teal-100 text-teal-700", department: "Economics", designation: "Adjunct Professor", courses: ["Microeconomics", "Macroeconomics", "Public Policy"], joined: "Oct 01, 2019", phone: "+1 (555) 210-1054", employment: "Active", attendance: "Present" },
  { name: "Dr. Sarah Al-Mansoor", email: "s.almansoor@edu.org", initials: "SA", avatarColor: "bg-fuchsia-100 text-fuchsia-700", department: "Physical Sciences", designation: "Associate Professor", courses: ["Organic Chemistry", "Synthesis"], joined: "Apr 05, 2016", phone: "+1 (555) 210-1022", employment: "Active", attendance: "Present" },
  { name: "Michael O'Connor", email: "m.oconnor@edu.org", initials: "MO", avatarColor: "bg-orange-100 text-orange-700", department: "Humanities", designation: "Senior Lecturer", courses: ["World Literature", "Writing"], joined: "May 19, 2020", phone: "+1 (555) 210-1082", employment: "Active", attendance: "Late" },
  { name: "Dr. Priya Nair", email: "p.nair@edu.org", initials: "PN", avatarColor: "bg-cyan-100 text-cyan-700", department: "Biological Sciences", designation: "Department Chair", courses: ["Cell Biology", "Genetics", "Ecology"], joined: "Aug 27, 2014", phone: "+1 (555) 210-1114", employment: "Active", attendance: "Present" },
  { name: "Samuel Okafor", email: "s.okafor@edu.org", initials: "SO", avatarColor: "bg-lime-100 text-lime-700", department: "Mathematics", designation: "Lecturer", courses: ["Statistics", "Calculus"], joined: "Nov 11, 2022", phone: "+1 (555) 210-1128", employment: "On Leave", attendance: "Absent" },
  { name: "Dr. Aisha Rahman", email: "a.rahman@edu.org", initials: "AR", avatarColor: "bg-violet-100 text-violet-700", department: "Computer Science", designation: "Professor", courses: ["AI Foundations", "Data Science", "Algorithms"], joined: "Jan 13, 2013", phone: "+1 (555) 210-1140", employment: "Active", attendance: "Present" },
  { name: "Jonathan Brooks", email: "j.brooks@edu.org", initials: "JB", avatarColor: "bg-red-100 text-red-700", department: "History", designation: "Assistant Professor", courses: ["Modern History", "Civics"], joined: "Jul 07, 2021", phone: "+1 (555) 210-1156", employment: "Inactive", attendance: "Absent" },
  { name: "Dr. Linh Nguyen", email: "l.nguyen@edu.org", initials: "LN", avatarColor: "bg-pink-100 text-pink-700", department: "Chemistry", designation: "Senior Lecturer", courses: ["General Chemistry", "Lab Methods", "Materials"], joined: "Dec 02, 2018", phone: "+1 (555) 210-1173", employment: "Active", attendance: "Present" },
];

export const mockFaculty: FacultyMember[] = seed.map((member, index) => ({
  ...member,
  id: `faculty-${index + 1}`,
  employeeId: `FAC-${[1042, 1018, 1077, 1031, 1065, 1090, 1054, 1022, 1082, 1114, 1128, 1140, 1156, 1173][index]}`,
  date: "Oct 24, 2024",
  checkIn: member.attendance === "Present" ? "08:02 AM" : member.attendance === "Late" ? "08:34 AM" : "—",
  checkOut: member.attendance === "Present" ? "04:12 PM" : member.attendance === "Late" ? "04:05 PM" : "—",
  attendanceRate: [98, 96, 89, 94, 81, 92, 97, 95, 88, 99, 91, 93, 87, 96][index],
}));

export const facultySummary = {
  total: mockFaculty.length,
  active: mockFaculty.filter((person) => person.employment === "Active").length,
  onLeave: mockFaculty.filter((person) => person.employment === "On Leave").length,
  inactive: mockFaculty.filter((person) => person.employment === "Inactive").length,
  presentToday: mockFaculty.filter((person) => person.attendance === "Present").length,
  lateToday: mockFaculty.filter((person) => person.attendance === "Late").length,
  absentToday: mockFaculty.filter((person) => person.attendance === "Absent").length,
};
