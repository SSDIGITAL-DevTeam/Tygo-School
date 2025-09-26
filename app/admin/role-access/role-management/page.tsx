"use client";
import React, { useMemo, useState } from "react";
import Sidebar from "../../../../components/admin/Sidebar";
import Topbar from "../../../../components/layout-global/Topbar";
import RoleTable from "../../../../components/admin/RoleTable";
import PageHeader from "../../../../components/layout-global/PageHeader";
import { Inter } from "next/font/google";
import { Shield } from "lucide-react";
import { ROLE_LIST } from "@/lib/roles";

const inter = Inter({ subsets: ["latin"] });

const RoleManagementPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const roles = useMemo(() => ROLE_LIST.map((role) => ({
    id: role.id,
    name: role.name,
    features: role.features.length,
    status: role.status,
  })), []);

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