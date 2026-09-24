import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/students": "Students",
  "/teachers": "Teachers",
  "/courses": "Courses",
};

// Shared shell for every authenticated page: Sidebar + Header + scrollable main.
// Wired as a parent layout route in App.tsx via <Outlet />, so each page only
// renders its own content — the sidebar/header appear automatically everywhere.
//
// h-screen + overflow-hidden on the shell means the app fills exactly one
// viewport. Individual pages should use flex + min-h-0 on their tallest
// section (see DashboardPage) so content resizes to fit instead of
// producing a scrollbar.
const DashboardLayout: React.FC = () => {
  const { pathname } = useLocation();
  const page = pageTitles[pathname] ?? "Overview";

  return (
    <div className="fixed inset-0 flex h-dvh w-screen overflow-hidden bg-slate-50 text-slate-800">
      <Sidebar />
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header section="Campus Admin" page={page} />
        <main className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
