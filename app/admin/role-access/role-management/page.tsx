"use client";
import React, { useMemo, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import Topbar from "../../../../components/Topbar";
import RoleTable from "../../../../components/RoleTable";
import { Inter } from "next/font/google";
import { Shield } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const buildRoles = () => {
  const seed = [
    { name: "Admin", features: 6, status: "Active" as const },
    { name: "Secondary Admin", features: 4, status: "Active" as const },
    { name: "Subjects and Teachers Admin", features: 4, status: "Active" as const },
    { name: "Students Report Admin", features: 5, status: "Active" as const },
  ];

  const extras = [
    "Finance Admin",
    "Library Admin",
    "Lab Admin",
    "Counseling Admin",
    "Dorm Admin",
    "Sports Admin",
    "Events Admin",
    "Transport Admin",
    "IT Support",
    "Admissions Admin",
    "Attendance Admin",
    "Curriculum Admin",
    "Schedule Admin",
    "Exams Admin",
    "Alumni Admin",
    "Health Admin",
    "Cafeteria Admin",
    "Discipline Admin",
    "Security Admin",
    "Communication Admin",
    "Procurement Admin",
  ];

  return [
    ...seed,
    ...extras.map((name, index) => ({
      name,
      features: 3 + (index % 4),
      status: index % 7 === 0 ? ("Non Active" as const) : ("Active" as const),
    })),
  ];
};

const RoleManagementPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const roles = useMemo(() => buildRoles(), []);

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="w-64 shrink-0" aria-hidden />

        <main className="flex-1 min-h-screen bg-slate-100">
          <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <div className="space-y-6 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-100">
                  <Shield className="h-5 w-5 text-violet-700" aria-hidden />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
              </div>
            </div>

            <div className="mx-auto max-w-6xl">
              <RoleTable data={roles} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoleManagementPage;
