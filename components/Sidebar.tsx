"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, ChevronDown } from "lucide-react";

type Label =
  | "Dashboard"
  | "Master Data"
  | "Students Data"
  | "Role & Access"
  | "Tuition Fee Management"
  | "School Settings";

type SidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
  // Optional manual active override; when absent, detects from current pathname
  active?: Label;
};

// Reusable Sidebar with fixed width and optional active item
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, active }) => {
  const purple = "#6c2bd9";
  const bgLight = "#f5f6fa";
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  // Basic auto-detection based on route prefix
  const autoActive: Label = pathname?.startsWith("/students")
    ? "Students Data"
    : pathname?.startsWith("/role-access")
    ? "Role & Access"
    : "Dashboard";
  const activeLabel: Label = active ?? autoActive;

  // Role & Access accordion open state (default open when in /role-access/*)
  const defaultOpenRole = useMemo(() => (pathname?.startsWith("/role-access") ? true : false), [pathname]);
  const [roleOpen, setRoleOpen] = useState<boolean>(defaultOpenRole);

  const menuItems: Array<
    | { label: Label; href?: string }
    | { label: "Master Data"; children: string[]; href?: string }
  > = [
    { label: "Dashboard", href: "/dashboard" },
    {
      label: "Master Data",
      children: ["Subjects", "Teachers", "Students Report Format", "Classes"],
    },
    { label: "Students Data", href: "/students" },
    // Role & Access uses accordion; child links are below
    { label: "Role & Access" },
    { label: "Tuition Fee Management" },
    { label: "School Settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-64 border-r bg-slate-50 pointer-events-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ backgroundColor: bgLight }}
      >
        {/* Header: Logo + School name */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-white font-bold">CB</div>
          <div className="font-semibold text-gray-800">Citra Budaya School</div>
        </div>

        {/* Menu */}
        <nav className="p-3 overflow-y-auto h-[calc(100%-140px)] md:h-[calc(100vh-140px)]">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = item.label === activeLabel;
              return (
                <li key={item.label}>
                  {/* Special case: Role & Access parent as accordion */}
                  {item.label === "Role & Access" ? (
                    <>
                      <button
                        onClick={() => setRoleOpen((v) => !v)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                          pathname?.startsWith("/role-access")
                            ? "bg-violet-100 text-violet-700"
                            : "text-gray-700 hover:bg-white/60"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className={pathname?.startsWith("/role-access") ? "font-semibold" : "font-medium"}>
                            Role &amp; Access
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${roleOpen ? "rotate-180" : "rotate-0"}`} />
                      </button>
                      {roleOpen && (
                        <ul className="mt-1 space-y-1">
                          <li>
                            <Link
                              href="/role-access/role-management"
                              className={`block pl-8 pr-3 py-2 rounded-md ${
                                pathname?.startsWith("/role-access/role-management")
                                  ? "bg-violet-700 text-white"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                              onClick={onClose}
                              aria-label="Role Management"
                            >
                              Role Management
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/role-access/admin-list"
                              className={`block pl-8 pr-3 py-2 rounded-md ${
                                pathname?.startsWith("/role-access/admin-list") ? "bg-violet-700 text-white" : "text-slate-700 hover:bg-slate-100"
                              }`}
                              onClick={onClose}
                              aria-label="Admin List"
                            >
                              Admin List
                            </Link>
                          </li>
                        </ul>
                      )}
                    </>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`block px-3 py-2 rounded-md transition-colors ${
                        isActive ? "bg-[#6c2bd9] text-white shadow-sm" : "text-gray-700 hover:bg-white/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: isActive ? "#fff" : "#CBD5E1" }}
                        />
                        <span className={isActive ? "font-semibold" : "font-medium"}>{item.label}</span>
                      </div>
                    </Link>
                  ) : (
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        isActive ? "bg-[#6c2bd9] text-white shadow-sm" : "text-gray-700 hover:bg-white/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: isActive ? "#fff" : "#CBD5E1" }}
                        />
                        <span className={isActive ? "font-semibold" : "font-medium"}>{item.label}</span>
                      </div>
                    </button>
                  )}
                  {"children" in item && item.children && (item as any).label !== "Role & Access" && (
                    <ul className="mt-1 ml-7 space-y-1">
                      {item.children.map((sub) => (
                        <li key={sub}>
                          <button className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1">{sub}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <button
            aria-label="Log out"
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 disabled:opacity-60 transition-colors"
            onClick={async () => {
              try {
                setLoggingOut(true);
                await fetch("/api/auth/logout", { method: "POST" });
                onClose?.();
                router.push("/login");
                router.refresh();
              } finally {
                setLoggingOut(false);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.25a.75.75 0 0 1 .75.75v8a.75.75 0 0 1-1.5 0v-8A.75.75 0 0 1 12 2.25Z" />
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0 8.25 8.25 0 1 1 11.66 11.66.75.75 0 1 1-1.06-1.06A6.75 6.75 0 1 0 6.53 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{loggingOut ? "Logging Out..." : "Log Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
