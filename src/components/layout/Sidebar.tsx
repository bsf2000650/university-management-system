import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, GraduationCap, Users, BookOpen, LogOut } from "lucide-react";

// Swap these for your routePaths constants once wired up, e.g. ROUTES.DASHBOARD
const navItems = [
  { label: "Dashboard", icon: LayoutGrid, to: "/dashboard" },
  { label: "Students", icon: GraduationCap, to: "/students" },
  { label: "Faculty", icon: Users, to: "/teachers" },
  { label: "Courses", icon: BookOpen, to: "/courses" },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <aside className="relative z-10 flex h-dvh w-56 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white px-3 py-4">
      <div className="shrink-0">
        <div className="mb-8 flex h-8 items-center gap-2 border-b border-slate-100 px-2 pb-3">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 text-[8px] font-bold text-white">E</span>
          <span className="text-sm font-semibold">EduAttend</span>
        </div>

        <p className="mb-3 px-2 text-[11px] font-medium tracking-wide text-slate-400">
          Navigation
        </p>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-50 font-medium text-indigo-600 shadow-[inset_-2px_0_0_#4f46e5]"
                    : "text-slate-500 hover:bg-slate-50"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto shrink-0 border-t border-slate-100 pt-3">
        <button type="button" onClick={() => navigate("/login", { replace: true })} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"><LogOut className="h-4 w-4" />Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
