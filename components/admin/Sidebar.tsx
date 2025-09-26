"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  Settings,
  DollarSign,
  ChevronDown,
  LogOut,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const isRoute = (p: string) => pathname === p;
  const starts = (p: string) => pathname.startsWith(p);

  // default accordion open if berada di route-nya
  const [openMaster, setOpenMaster] = useState(starts("/master-data"));
  const [openRole, setOpenRole] = useState(starts("/role-access"));

  // warna sesuai UI
  const ACTIVE_PURPLE = "bg-[#6c2bd9] text-white";      // item aktif (ungu penuh)
  const PARENT_OPEN   = "bg-gray-100 text-gray-900";     // parent accordion saat dibuka / berada di section
  const PARENT_BASE   = "text-gray-800 hover:bg-gray-50";
  const CHILD_ACTIVE  = ACTIVE_PURPLE;                   // child aktif = ungu
  const CHILD_BASE    = "text-gray-700 hover:bg-gray-50";

  const handleNav = () => onClose?.();

  const onLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    handleNav();
    router.push("/");
    router.refresh();
  };

  // helper komponen ikon biar gampang switch warna
  const IconWrap = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center justify-center w-5 h-5">{children}</span>
  );

  return (
    <>
      {/* overlay mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* sidebar (tanpa border-r agar tidak ada garis vertikal) */}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-64 bg-white transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="h-full flex flex-col">
          {/* header—tinggi sama topbar */}
          <div className="h-[60px] px-4 bg-white border-b border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-600 text-white grid place-items-center text-xs font-bold">
              CB
            </div>
            <span className="font-semibold text-gray-800 truncate">Citra Budaya School</span>
          </div>

          {/* menu */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {/* Dashboard (leaf) */}
              <li>
                <Link
                  href="/admin/dashboard"
                  onClick={handleNav}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                    starts("/admin/dashboard") || pathname === "/" ? `${ACTIVE_PURPLE} font-semibold` : PARENT_BASE
                  }`}
                >
                  <IconWrap>
                    <LayoutDashboard
                      className={`w-5 h-5 ${
                        starts("/admin/dashboard") || pathname === "/" ? "text-white" : "text-gray-700"
                      }`}
                    />
                  </IconWrap>
                  Dashboard
                </Link>
              </li>

              {/* Master Data (parent: abu-abu saat open; child aktif = ungu) */}
              <li>
                <button
                  onClick={() => setOpenMaster(v => !v)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${
                    starts("/admin/master-data") || openMaster ? PARENT_OPEN : PARENT_BASE
                  }`}
                  aria-expanded={openMaster}
                  aria-controls="master-children"
                >
                  <span className="flex items-center gap-3">
                    <IconWrap>
                      <BookOpen
                        className={`w-5 h-5 ${
                          starts("/admin/master-data") || openMaster ? "text-gray-700" : "text-gray-700"
                        }`}
                      />
                    </IconWrap>
                    <span className={starts("/admin/master-data") ? "font-semibold" : "font-medium"}>
                      Master Data
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openMaster ? "rotate-180" : ""
                    } ${starts("/admin/master-data") || openMaster ? "text-gray-700" : "text-gray-500"}`}
                  />
                </button>

                {openMaster && (
                  <ul id="master-children" className="mt-1 space-y-1">
                    <li>
                      <Link
                        href="/admin/master-data/subjects"
                        onClick={handleNav}
                        className={`block pl-11 pr-4 py-2 rounded-md ${
                          isRoute("/admin/master-data/subjects") ? CHILD_ACTIVE : CHILD_BASE
                        }`}
                      >
                        Subjects
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/master-data/teachers-management"
                        onClick={handleNav}
                        className={`block pl-11 pr-4 py-2 rounded-md ${
                          starts("/admin/master-data/teachers-management") ? CHILD_ACTIVE : CHILD_BASE
                        }`}
                      >
                        Teachers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/master-data/student-report/assessment-category"
                        onClick={handleNav}
                        className={`block pl-11 pr-4 py-2 rounded-md ${
                          isRoute("/admin/master-data/student-report/assessment-category") ? CHILD_ACTIVE : CHILD_BASE
                        }`}
                      >
                        Students Report Format
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/master-data/classes"
                        onClick={handleNav}
                        className={`block pl-11 pr-4 py-2 rounded-md ${
                          isRoute("/admin/master-data/classes") ? CHILD_ACTIVE : CHILD_BASE
                        }`}
                      >
                        Classes
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Students Data (leaf) */}
              <li>
                <Link
                  href="/admin/students"
                  onClick={handleNav}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                    starts("/admin/students") ? `${ACTIVE_PURPLE} font-semibold` : PARENT_BASE
                  }`}
                >
                  <IconWrap>
                    <GraduationCap className={`w-5 h-5 ${starts("/admin/students") ? "text-white" : "text-gray-700"}`} />
                  </IconWrap>
                  Students Data
                </Link>
              </li>

              {/* Role & Access (parent abu-abu saat open) */}
              <li>
                <button
                  onClick={() => setOpenRole(v => !v)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${
                    starts("/admin/role-access") || openRole ? PARENT_OPEN : PARENT_BASE
                  }`}
                  aria-expanded={openRole}
                  aria-controls="role-children"
                >
                  <span className="flex items-center gap-3">
                    <IconWrap>
                      <Users className={`w-5 h-5 ${starts("/admin/role-access") || openRole ? "text-gray-700" : "text-gray-700"}`} />
                    </IconWrap>
                    <span className={starts("/admin/role-access") ? "font-semibold" : "font-medium"}>Role &amp; Access</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openRole ? "rotate-180" : ""
                    } ${starts("/admin/role-access") || openRole ? "text-gray-700" : "text-gray-500"}`}
                  />
                </button>

                {openRole && (
                  <ul id="role-children" className="mt-1 space-y-1">
                    <li>
                      <Link
                        href="/admin/role-access/role-management"
                        onClick={handleNav}
                        className={`block pl-11 pr-4 py-2 rounded-md ${
                          starts("/admin/role-access/role-management") ? CHILD_ACTIVE : CHILD_BASE
                        }`}
                      >
                        Role Management
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/role-access/admin-list"
                        onClick={handleNav}
                        className={`block pl-11 pr-4 py-2 rounded-md ${
                          starts("/admin/role-access/admin-list") ? CHILD_ACTIVE : CHILD_BASE
                        }`}
                      >
                        Admin List
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Tuition (leaf) */}
              <li>
                <Link
                  href="/admin/tuition"
                  onClick={handleNav}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                    starts("/admin/tuition") ? `${ACTIVE_PURPLE} font-semibold` : PARENT_BASE
                  }`}
                >
                  <IconWrap>
                    <DollarSign className={`w-5 h-5 ${starts("/admin/tuition") ? "text-white" : "text-gray-700"}`} />
                  </IconWrap>
                  Tuition Fee Management
                </Link>
              </li>

              {/* Settings (leaf) */}
              <li>
                <Link
                  href="/admin/school-settings"
                  onClick={handleNav}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md ${
                    starts("/school-settings") ? `${ACTIVE_PURPLE} font-semibold` : PARENT_BASE
                  }`}
                >
                  <IconWrap>
                    <Settings className={`w-5 h-5 ${starts("/admin/school-settings") ? "text-white" : "text-gray-700"}`} />
                  </IconWrap>
                  School Settings
                </Link>
              </li>
            </ul>
          </nav>

          {/* logout */}
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

export default Sidebar;

