"use client";
import React, { useMemo, useState } from "react";
import Sidebar from "../../../../components/admin/Sidebar";
import Topbar from "../../../../components/layout-global/Topbar";
import AdminTable, { AdminRow } from "../../../../components/admin/AdminTable";
import PageHeader from "../../../../components/layout-global/PageHeader";
import { Inter } from "next/font/google";
import { Users } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// Dummy data admin
const buildAdmins = (): AdminRow[] => {
  const seed: AdminRow[] = [
    { id: "meijiko", name: "Meijiko", email: "meijiko@gmail.com", role: "Admin", features: 6, status: "Active" },
    { id: "ryan", name: "Ryan Kusuma", email: "ryan@gmail.com", role: "Secondary Admin", features: 4, status: "Active" },
    { id: "heriyanto", name: "Heriyanto", email: "heriyanto@gmail.com", role: "Subjects and Teachers Admin", features: 4, status: "Active" },
    { id: "imroatust", name: "Imroatust", email: "imroatust@gmail.com", role: "Students Report Admin", features: 5, status: "Non Active" },
  ];

  const extraNames = [
    "Intan Permata","Budi Santoso","Andre Simatupang","Gita Prameswari","Larissa Kamila","Samuel Adrian",
    "Fauzan Nur","Aulia Rahman","Chelsea Debora","Yoga Mahendra","Nabila Safitri","Raka Yudhistira",
    "Ajeng Maharani","Pramudya Seno","Kamal Fariz","Dewi Lestari","Putra Nugraha","Siska Hapsari",
    "Dimas Prasetya","Farhan Maulana","Jacky Fernandez",
  ];

  const roles: AdminRow["role"][] = [
    "Admin", "Secondary Admin", "Subjects and Teachers Admin", "Students Report Admin",
  ];

  const extras: AdminRow[] = extraNames.map((name, index) => {
    const baseSlug = name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
    const slug = baseSlug || `admin-${index}`;
    return {
      id: slug,
      name,
      email: `${slug}@tygo.school`,
      role: roles[index % roles.length],
      features: 3 + ((index + 1) % 4),
      status: index % 5 === 0 ? "Non Active" : "Active",
    };
  });

  return [...seed, ...extras];
};

const AdminListPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const admins = useMemo(buildAdmins, []);

  return (
    <div className={`${inter.className} flex min-h-screen`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="w-64 shrink-0" aria-hidden />

      <div className="flex min-h-screen flex-1 flex-col bg-slate-100">
        <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((open) => !open)} />

        <main className="flex-1">
          <div className="space-y-6 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {/* === Reusable PageHeader === */}
              <PageHeader
                title="Admin List"
                icon={<Users className="h-5 w-5 text-violet-700" aria-hidden />}
              />
            </div>

            <div className="mx-auto max-w-7xl">
              <AdminTable data={admins} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminListPage;
