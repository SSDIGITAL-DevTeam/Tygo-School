"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  School,
  NotebookPen,
  Users,
  ChevronDown,
  LogOut,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
  schoolName?: string;
  schoolLogoUrl?: string | null;
  // daftar kelas yang tampil di "Input Grades"
  gradeClasses?: { label: string; slug: string }[];
};

const TeacherSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  schoolName = "Citra Budaya School",
  schoolLogoUrl = null,
  gradeClasses = [
    { label: "IX-A", slug: "ix-a" },
    { label: "VII-A", slug: "vii-a" },
  ],
}) => {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const starts = (p: string) => pathname.startsWith(p);
  const isRoute = (p: string) => pathname === p;

  // default buka kalau sedang di dalam section input grades
  const [openGrades, setOpenGrades] = useState(starts("/teacher/input-grades"));

  // palet sesuai UI
  const ACTIVE_PURPLE = "bg-[#6c2bd9] text-white";
  const PARENT_OPEN = "bg-gray-100 text-gray-900";
  const PARENT_BASE = "text-gray-800 hover:bg-gray-50";
  const CHILD_ACTIVE = ACTIVE_PURPLE;
  const CHILD_BASE = "text-gray-700 hover:bg-gray-50";

  const onNav = () => onClose?.();
  const onLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    onNav();
    router.push("/login");
    router.refresh();
  };

  const initials =
    schoolName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "SC";

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar (no border-r → tidak ada garis vertikal) */}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-64 bg-white transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="h-full flex flex-col">
          {/* Header: 60px + border bawah biar rapi */}
          <div className="h-[60px] px-4 bg-white border-b border-gray-200 flex items-center gap-3">
            {schoolLogoUrl ? (
              <img
                src={schoolLogoUrl}
                alt={`${schoolName} logo`}
                className="w-9 h-9 rounded-md object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-md bg-blue-600 text-white grid place-items-center text-xs font-bold">
                {initials}
              </div>
            )}
            <span className="font-semibold text-gray-800 truncate">
              {schoolName}
            </span>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {/* Dashboard */}
              <li>
                <Link
                  href="/teacher/dashboard"
                  onClick={onNav}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                    starts("/teacher/dashboard") ? `${ACTIVE_PURPLE} font-semibold` : PARENT_BASE
                  }`}
                >
                  <LayoutDashboard
                    className={`w-5 h-5 ${
                      starts("/teacher/dashboard") ? "text-white" : "text-gray-700"
                    }`}
                  />
                  Dashboard
                </Link>
              </li>

              {/* My Class */}
              <li>
                <Link
                  href="/teacher/my-class"
                  onClick={onNav}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                    starts("/teacher/my-class") ? `${ACTIVE_PURPLE} font-semibold` : PARENT_BASE
                  }`}
                >
                  <School
                    className={`w-5 h-5 ${
                      starts("/teacher/my-class") ? "text-white" : "text-gray-700"
                    }`}
                  />
                  My Class
                </Link>
              </li>

              {/* Input Grades (accordion; parent open = abu-abu) */}
              <li>
                <button
                  onClick={() => setOpenGrades((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${
                    starts("/teacher/input-grades") || openGrades ? PARENT_OPEN : PARENT_BASE
                  }`}
                  aria-expanded={openGrades}
                  aria-controls="grades-children"
                >
                  <span className="flex items-center gap-3">
                    <NotebookPen className="w-5 h-5 text-gray-700" />
                    <span className={starts("/teacher/input-grades") ? "font-semibold" : "font-medium"}>
                      Input Grades
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openGrades ? "rotate-180" : ""
                    } ${starts("/teacher/input-grades") || openGrades ? "text-gray-700" : "text-gray-500"}`}
                  />
                </button>

                {openGrades && (
                  <ul id="grades-children" className="mt-1 space-y-1">
                    {gradeClasses.map((c) => {
                      const href = `/teacher/input-grades/${c.slug}`;
                      const active = isRoute(href) || starts(href);
                      return (
                        <li key={c.slug}>
                          <Link
                            href={href}
                            onClick={onNav}
                            className={`block pl-11 pr-4 py-2 rounded-md ${
                              active ? CHILD_ACTIVE : CHILD_BASE
                            }`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>

              {/* Student Data */}
              <li>
                <Link
                  href="/teacher/students"
                  onClick={onNav}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                    starts("/teacher/students") ? `${ACTIVE_PURPLE} font-semibold` : PARENT_BASE
                  }`}
                >
                  <Users
                    className={`w-5 h-5 ${
                      starts("/teacher/students") ? "text-white" : "text-gray-700"
                    }`}
                  />
                  Student Data
                </Link>
              </li>
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TeacherSidebar;
