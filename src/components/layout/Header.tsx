import React from "react";
import { LayoutGrid, Bell, ChevronDown } from "lucide-react";

interface HeaderProps {
  section: string; // e.g. "Campus Admin"
  page: string; // e.g. "Overview"
  term?: string; // e.g. "Fall 2024 / Active Term"
}

const Header: React.FC<HeaderProps> = ({
  section,
  page,
  term = "Fall 2024 / Active Term",
}) => {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6 py-3">
      <p className="flex items-center gap-1.5 text-sm text-slate-400">
        <LayoutGrid className="h-3.5 w-3.5" /> {section}
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-600">{page}</span>
      </p>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {term}
        </span>
        <button
          type="button"
          className="relative rounded-full border border-slate-100 p-2"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-slate-500" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        <img
          src="https://i.pravatar.cc/64?img=47"
          alt="profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
};

export default Header;
