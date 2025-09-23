"use client";
import React from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import RoleTable from "../../../components/RoleTable";
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
    "Finance Admin", "Library Admin", "Lab Admin", "Counseling Admin", "Dorm Admin",
    "Sports Admin", "Events Admin", "Transport Admin", "IT Support", "Admissions Admin",
    "Attendance Admin", "Curriculum Admin", "Schedule Admin", "Exams Admin", "Alumni Admin",
    "Health Admin", "Cafeteria Admin", "Discipline Admin", "Security Admin", "Communication Admin",
  ];
  return [...seed, ...extras.map((n, i) => ({ name: n, features: 3 + (i % 4), status: i % 7 === 0 ? ("Non Active" as const) : ("Active" as const) }))];
};

const RoleManagementPage: React.FC = () => {
  const roles = buildRoles();
  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={false} />
        <div className="w-64 shrink-0" aria-hidden />
        <div className="flex-1 min-h-screen bg-slate-100 relative z-0">
          <Topbar offset={false} />
          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 grid place-content-center">
                <Shield className="w-5 h-5 text-[#6c2bd9]" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
            </div>

            <RoleTable data={roles} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementPage;

