"use client";
import React, { useMemo, useState } from "react";
import Sidebar from "../../../../components/admin/Sidebar";
import Topbar from "../../../../components/layout-global/Topbar";
import RoleTable from "../../../../components/admin/RoleTable";
import PageHeader from "../../../../components/layout-global/PageHeader";
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
    "Finance Admin","Library Admin","Lab Admin","Counseling Admin","Dorm Admin","Sports Admin",
    "Events Admin","Transport Admin","IT Support","Admissions Admin","Attendance Admin",
    "Curriculum Admin","Schedule Admin","Exams Admin","Alumni Admin","Health Admin",
    "Cafeteria Admin","Discipline Admin","Security Admin","Communication Admin","Procurement Admin",
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
    <div className={`${inter.className} flex min-h-screen`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="w-64 shrink-0" aria-hidden />

      <div className="flex min-h-screen flex-1 flex-col bg-slate-100">
        <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((open) => !open)} />

        <main className="flex-1">
          <div className="space-y-6 p-4 md:p-6 lg:p-8">
            {/* === Reusable PageHeader === */}
            <div className="mx-auto max-w-7xl">
              <PageHeader
                title="Role Management"
                icon={<Shield className="h-5 w-5 text-violet-700" aria-hidden />}
              />
            </div>

            {/* === Table Role === */}
            <div className="mx-auto max-w-7xl">
              <RoleTable data={roles} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoleManagementPage;
